/*
 * ================================================================
 * FILE: healthCheck.ts
 * PATH: /packages/config/src/utils/storageOperations/healthCheck.ts
 * DESCRIPTION: Health check utilities with exponential backoff retry logic
 *              Supports: SQL services, MinIO, ElasticSearch
 * VERSION: v1.0.0
 * CREATED: 2025-11-30
 * UPDATED: 2025-11-30
 * ================================================================
 */

import type {
  StorageConfig,
  StorageType,
  RetryConfig,
  HealthStatus,
  HealthCheckResult,
  CombinedHealthResult,
} from './types';

// ============================================================
// DEFAULT CONFIGURATION
// ============================================================

const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
  maxTotalTime: 15000,      // 15 seconds max
  initialDelay: 1000,       // Start with 1 second
  maxDelay: 4000,           // Max 4 seconds between retries
  backoffMultiplier: 2,     // Double delay each time
  slowThreshold: 5000,      // Show "slow" toast after 5 seconds
  onSlowOperation: () => {},
  onRetry: () => {},
};

const DEFAULT_HEALTH_TIMEOUT = 3000; // 3 seconds per attempt

// ============================================================
// UTILITY: Sleep function
// ============================================================

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================
// SINGLE HEALTH CHECK (no retry)
// ============================================================

/**
 * Perform a single health check attempt (no retry)
 */
async function singleHealthCheck(
  config: StorageConfig,
  timeout: number
): Promise<{ success: boolean; statusCode?: number; error?: string; responseTime: number }> {
  const startTime = performance.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(`${config.baseUrl}${config.healthEndpoint}`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const responseTime = performance.now() - startTime;

    if (response.ok) {
      return { success: true, statusCode: response.status, responseTime };
    }

    return {
      success: false,
      statusCode: response.status,
      error: `Service returned status ${response.status}`,
      responseTime,
    };
  } catch (error) {
    const responseTime = performance.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Check for abort (timeout)
    if (errorMessage.includes('abort')) {
      return {
        success: false,
        error: 'Health check timed out',
        responseTime,
      };
    }

    return {
      success: false,
      error: errorMessage,
      responseTime,
    };
  }
}

// ============================================================
// HEALTH CHECK WITH RETRY
// ============================================================

/**
 * Check health of a single storage with exponential backoff retry
 *
 * Retry logic:
 * 1. Try immediately
 * 2. If fails, wait 1 second, retry
 * 3. If fails, wait 2 seconds, retry
 * 4. After 5 seconds total, call onSlowOperation (show toast)
 * 5. Continue retrying with max 4 second delays
 * 6. After 15 seconds total, give up and return unhealthy
 *
 * @example
 * ```ts
 * const result = await checkStorageHealth(
 *   STORAGE_CONFIGS.issuesSQL,
 *   {
 *     onSlowOperation: () => toast.warning('Pripojenie trvá dlhšie...'),
 *     onRetry: (attempt, delay) => console.log(`Retry ${attempt}, waiting ${delay}ms`)
 *   }
 * );
 * ```
 */
export async function checkStorageHealth(
  config: StorageConfig,
  retryConfig?: Partial<RetryConfig>
): Promise<HealthCheckResult> {
  const retry: Required<RetryConfig> = {
    ...DEFAULT_RETRY_CONFIG,
    ...config.retryConfig,
    ...retryConfig,
  };

  const healthTimeout = config.healthTimeout ?? DEFAULT_HEALTH_TIMEOUT;
  const startTime = performance.now();

  let attempt = 0;
  let currentDelay = retry.initialDelay;
  let slowNotified = false;
  let lastError: string | undefined;
  let lastStatusCode: number | undefined;

  while (true) {
    attempt++;

    // Check if we've exceeded max total time
    const elapsed = performance.now() - startTime;
    if (elapsed >= retry.maxTotalTime) {
      return {
        storage: config.type,
        status: 'unhealthy',
        error: lastError ?? 'Health check timed out after retries',
        statusCode: lastStatusCode,
        retryAttempts: attempt - 1,
        wasSlow: slowNotified,
        responseTime: elapsed,
      };
    }

    // Check if we should show "slow" notification
    if (!slowNotified && elapsed >= retry.slowThreshold) {
      slowNotified = true;
      retry.onSlowOperation();
    }

    // Perform health check
    const result = await singleHealthCheck(config, healthTimeout);

    if (result.success) {
      return {
        storage: config.type,
        status: 'healthy',
        statusCode: result.statusCode,
        responseTime: performance.now() - startTime,
        retryAttempts: attempt - 1,
        wasSlow: slowNotified,
      };
    }

    // Store last error for final result
    lastError = result.error;
    lastStatusCode = result.statusCode;

    // Check if remaining time allows for another retry
    const remainingTime = retry.maxTotalTime - (performance.now() - startTime);
    if (remainingTime < currentDelay + healthTimeout) {
      // Not enough time for another retry
      return {
        storage: config.type,
        status: 'unhealthy',
        error: lastError,
        statusCode: lastStatusCode,
        retryAttempts: attempt,
        wasSlow: slowNotified,
        responseTime: performance.now() - startTime,
      };
    }

    // Wait before retry
    retry.onRetry(attempt, currentDelay);
    await sleep(currentDelay);

    // Increase delay with exponential backoff
    currentDelay = Math.min(currentDelay * retry.backoffMultiplier, retry.maxDelay);
  }
}

// ============================================================
// COMBINED HEALTH CHECK (multiple storages in parallel)
// ============================================================

/**
 * Check health of multiple storages in parallel
 *
 * All health checks run simultaneously. Returns combined result
 * with overall status and individual results per storage.
 *
 * @example
 * ```ts
 * const result = await checkMultipleStoragesHealth(
 *   [STORAGE_CONFIGS.issuesSQL, STORAGE_CONFIGS.minio],
 *   { onSlowOperation: () => toast.warning('Kontrola trvá dlhšie...') }
 * );
 *
 * if (!result.allHealthy) {
 *   console.log('Unhealthy storages:', result.unhealthyStorages);
 * }
 * ```
 */
export async function checkMultipleStoragesHealth(
  configs: StorageConfig[],
  retryConfig?: Partial<RetryConfig>
): Promise<CombinedHealthResult> {
  const startTime = performance.now();

  // Create shared slow notification (only notify once for all storages)
  let slowNotified = false;
  const sharedRetryConfig: Partial<RetryConfig> = {
    ...retryConfig,
    onSlowOperation: () => {
      if (!slowNotified) {
        slowNotified = true;
        retryConfig?.onSlowOperation?.();
      }
    },
  };

  // Run all health checks in parallel
  const results = await Promise.all(
    configs.map((config) => checkStorageHealth(config, sharedRetryConfig))
  );

  // Build results map
  const resultsMap = new Map<StorageType, HealthCheckResult>();
  const unhealthyStorages: StorageType[] = [];

  for (const result of results) {
    resultsMap.set(result.storage, result);
    if (result.status !== 'healthy') {
      unhealthyStorages.push(result.storage);
    }
  }

  return {
    allHealthy: unhealthyStorages.length === 0,
    results: resultsMap,
    unhealthyStorages,
    totalDuration: performance.now() - startTime,
  };
}

// ============================================================
// QUICK HEALTH CHECK (single attempt, no retry)
// ============================================================

/**
 * Quick health check without retry - useful for pre-flight checks
 * where you want fast feedback
 *
 * @example
 * ```ts
 * const isAvailable = await quickHealthCheck(STORAGE_CONFIGS.minio);
 * if (!isAvailable) {
 *   // Show warning but don't block
 * }
 * ```
 */
export async function quickHealthCheck(
  config: StorageConfig,
  timeout = DEFAULT_HEALTH_TIMEOUT
): Promise<boolean> {
  const result = await singleHealthCheck(config, timeout);
  return result.success;
}

/**
 * Quick check multiple storages (no retry, parallel)
 * Returns map of storage type to availability
 */
export async function quickCheckMultiple(
  configs: StorageConfig[],
  timeout = DEFAULT_HEALTH_TIMEOUT
): Promise<Map<StorageType, boolean>> {
  const results = await Promise.all(
    configs.map(async (config) => ({
      type: config.type,
      available: await quickHealthCheck(config, timeout),
    }))
  );

  return new Map(results.map((r) => [r.type, r.available]));
}

// ============================================================
// STORAGE-SPECIFIC HEALTH CHECKS
// ============================================================

/**
 * Check SQL service health (via REST API /health endpoint)
 */
export async function checkSQLHealth(
  baseUrl: string,
  retryConfig?: Partial<RetryConfig>
): Promise<HealthCheckResult> {
  return checkStorageHealth(
    {
      type: 'sql',
      baseUrl,
      healthEndpoint: '/health',
      displayName: 'SQL Database',
    },
    retryConfig
  );
}

/**
 * Check MinIO health (via /minio/health/live endpoint)
 */
export async function checkMinIOHealth(
  baseUrl = 'http://localhost:9000',
  retryConfig?: Partial<RetryConfig>
): Promise<HealthCheckResult> {
  return checkStorageHealth(
    {
      type: 'minio',
      baseUrl,
      healthEndpoint: '/minio/health/live',
      displayName: 'MinIO Storage',
    },
    retryConfig
  );
}

/**
 * Check ElasticSearch health (via /_cluster/health endpoint)
 */
export async function checkElasticSearchHealth(
  baseUrl = 'http://localhost:9200',
  retryConfig?: Partial<RetryConfig>
): Promise<HealthCheckResult> {
  return checkStorageHealth(
    {
      type: 'elasticsearch',
      baseUrl,
      healthEndpoint: '/_cluster/health',
      displayName: 'ElasticSearch',
    },
    retryConfig
  );
}

// ============================================================
// UTILITY: Get display name for storage
// ============================================================

/**
 * Get human-readable display name for storage type
 */
export function getStorageDisplayName(
  storage: StorageType,
  config?: StorageConfig
): string {
  if (config?.displayName) {
    return config.displayName;
  }

  switch (storage) {
    case 'sql':
      return 'Databáza';
    case 'minio':
      return 'Súborové úložisko';
    case 'elasticsearch':
      return 'Vyhľadávač';
    default:
      return storage;
  }
}

/**
 * Get display names for multiple storages
 */
export function getStorageDisplayNames(
  storages: StorageType[],
  configs?: Map<StorageType, StorageConfig>
): string[] {
  return storages.map((s) =>
    getStorageDisplayName(s, configs?.get(s))
  );
}
