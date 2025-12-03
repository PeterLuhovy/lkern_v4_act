/*
 * ================================================================
 * FILE: operations.ts
 * PATH: /packages/config/src/utils/storageOperations/operations.ts
 * DESCRIPTION: CRUD operations with verification for SQL and MinIO
 *              Includes: pre-flight health check, operation, verification
 * VERSION: v1.0.0
 * CREATED: 2025-11-30
 * UPDATED: 2025-11-30
 * ================================================================
 */

import type {
  StorageConfig,
  StorageType,
  OperationType,
  OperationPhase,
  OperationRequest,
  OperationResult,
  StorageOperationResult,
  RetryConfig,
  CombinedHealthResult,
  OperationCallbacks,
} from './types';
import {
  checkMultipleStoragesHealth,
  checkStorageHealth,
} from './healthCheck';

// ============================================================
// DEFAULT CONFIGURATION
// ============================================================

const DEFAULT_OPERATION_TIMEOUT = 30000; // 30 seconds

// ============================================================
// UTILITY: Deep compare values
// ============================================================

/**
 * Deep compare two values for verification
 */
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (typeof a !== 'object') return a === b;

  // Arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((val, i) => deepEqual(val, b[i]));
  }

  // Objects
  if (Array.isArray(a) || Array.isArray(b)) return false;

  const keysA = Object.keys(a as object);
  const keysB = Object.keys(b as object);
  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) =>
    deepEqual(
      (a as Record<string, unknown>)[key],
      (b as Record<string, unknown>)[key]
    )
  );
}

// ============================================================
// VERIFICATION: Compare expected vs actual values
// ============================================================

/**
 * Verify that all expected fields match actual values
 */
function verifyFields(
  expected: Record<string, unknown>,
  actual: Record<string, unknown>
): { verified: boolean; errors: Array<{ field: string; expected: unknown; actual: unknown }> } {
  const errors: Array<{ field: string; expected: unknown; actual: unknown }> = [];

  for (const [field, expectedValue] of Object.entries(expected)) {
    const actualValue = actual[field];
    if (!deepEqual(expectedValue, actualValue)) {
      errors.push({ field, expected: expectedValue, actual: actualValue });
    }
  }

  return {
    verified: errors.length === 0,
    errors,
  };
}

// ============================================================
// SQL OPERATIONS
// ============================================================

/**
 * Execute SQL CREATE operation with verification
 *
 * 1. POST to create endpoint
 * 2. GET to verify created record
 * 3. Compare all verifyFields
 */
export async function sqlCreate<T>(
  config: StorageConfig,
  endpoint: string,
  data: Record<string, unknown>,
  verifyFields?: Record<string, unknown>
): Promise<StorageOperationResult<T>> {
  const timeout = config.operationTimeout ?? DEFAULT_OPERATION_TIMEOUT;

  try {
    // Step 1: Create record
    const createResponse = await fetch(`${config.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(timeout),
    });

    if (!createResponse.ok) {
      // Handle 503 specifically
      if (createResponse.status === 503) {
        return {
          storage: config.type,
          success: false,
          error: 'Service unavailable',
          statusCode: 503,
        };
      }

      const errorData = await createResponse.json().catch(() => null);
      return {
        storage: config.type,
        success: false,
        error: errorData?.detail ?? `Create failed with status ${createResponse.status}`,
        statusCode: createResponse.status,
      };
    }

    const createdData = await createResponse.json() as T;

    // Step 2: Verify if verifyFields provided
    if (verifyFields && Object.keys(verifyFields).length > 0) {
      // Extract ID from created data for verification GET
      const createdId = (createdData as Record<string, unknown>).id;

      if (createdId) {
        const verifyResponse = await fetch(`${config.baseUrl}${endpoint}/${createdId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(timeout),
        });

        if (verifyResponse.ok) {
          const verifyData = await verifyResponse.json();
          const verification = verifyFields
            ? verifyFieldsResult(verifyFields, verifyData)
            : { verified: true, errors: [] };

          if (!verification.verified) {
            return {
              storage: config.type,
              success: false,
              data: createdData,
              verified: false,
              verificationErrors: verification.errors,
              error: 'Verification failed - data mismatch',
            };
          }
        }
      }
    }

    return {
      storage: config.type,
      success: true,
      data: createdData,
      verified: true,
      statusCode: createResponse.status,
    };
  } catch (error) {
    return {
      storage: config.type,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Helper to avoid name collision
function verifyFieldsResult(
  expected: Record<string, unknown>,
  actual: Record<string, unknown>
) {
  return verifyFields(expected, actual);
}

/**
 * Execute SQL DELETE operation with verification
 *
 * 1. GET to verify record exists
 * 2. DELETE the record
 * 3. GET to verify record no longer exists
 */
export async function sqlDelete(
  config: StorageConfig,
  endpoint: string,
  entityId: string,
  force = false
): Promise<StorageOperationResult<void>> {
  const timeout = config.operationTimeout ?? DEFAULT_OPERATION_TIMEOUT;
  const fullEndpoint = `${config.baseUrl}${endpoint}/${entityId}`;

  try {
    // Step 1: Verify record exists (unless force)
    if (!force) {
      const checkResponse = await fetch(fullEndpoint, {
        method: 'GET',
        signal: AbortSignal.timeout(timeout),
      });

      if (checkResponse.status === 404) {
        return {
          storage: config.type,
          success: false,
          error: 'Record not found - already deleted',
          statusCode: 404,
        };
      }

      if (checkResponse.status === 503) {
        return {
          storage: config.type,
          success: false,
          error: 'Service unavailable',
          statusCode: 503,
        };
      }
    }

    // Step 2: Delete record
    const deleteUrl = force ? `${fullEndpoint}?force=true` : fullEndpoint;
    const deleteResponse = await fetch(deleteUrl, {
      method: 'DELETE',
      signal: AbortSignal.timeout(timeout),
    });

    if (!deleteResponse.ok) {
      if (deleteResponse.status === 503) {
        return {
          storage: config.type,
          success: false,
          error: 'Service unavailable',
          statusCode: 503,
        };
      }

      const errorData = await deleteResponse.json().catch(() => null);
      return {
        storage: config.type,
        success: false,
        error: errorData?.detail ?? `Delete failed with status ${deleteResponse.status}`,
        statusCode: deleteResponse.status,
      };
    }

    // Step 3: Verify record no longer exists
    const verifyResponse = await fetch(fullEndpoint, {
      method: 'GET',
      signal: AbortSignal.timeout(timeout),
    });

    // 404 means successfully deleted
    if (verifyResponse.status === 404) {
      return {
        storage: config.type,
        success: true,
        verified: true,
        statusCode: 200,
      };
    }

    // Record still exists - verification failed
    return {
      storage: config.type,
      success: false,
      verified: false,
      error: 'Verification failed - record still exists after delete',
      statusCode: verifyResponse.status,
    };
  } catch (error) {
    return {
      storage: config.type,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Execute SQL UPDATE operation with verification
 */
export async function sqlUpdate<T>(
  config: StorageConfig,
  endpoint: string,
  entityId: string,
  data: Record<string, unknown>,
  verifyFieldsToCheck?: Record<string, unknown>
): Promise<StorageOperationResult<T>> {
  const timeout = config.operationTimeout ?? DEFAULT_OPERATION_TIMEOUT;
  const fullEndpoint = `${config.baseUrl}${endpoint}/${entityId}`;

  try {
    // Step 1: Update record
    const updateResponse = await fetch(fullEndpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(timeout),
    });

    if (!updateResponse.ok) {
      if (updateResponse.status === 503) {
        return {
          storage: config.type,
          success: false,
          error: 'Service unavailable',
          statusCode: 503,
        };
      }

      if (updateResponse.status === 404) {
        return {
          storage: config.type,
          success: false,
          error: 'Record not found',
          statusCode: 404,
        };
      }

      const errorData = await updateResponse.json().catch(() => null);
      return {
        storage: config.type,
        success: false,
        error: errorData?.detail ?? `Update failed with status ${updateResponse.status}`,
        statusCode: updateResponse.status,
      };
    }

    const updatedData = await updateResponse.json() as T;

    // Step 2: Verify if verifyFields provided
    if (verifyFieldsToCheck && Object.keys(verifyFieldsToCheck).length > 0) {
      const verifyResponse = await fetch(fullEndpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(timeout),
      });

      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        const verification = verifyFields(verifyFieldsToCheck, verifyData);

        if (!verification.verified) {
          return {
            storage: config.type,
            success: false,
            data: updatedData,
            verified: false,
            verificationErrors: verification.errors,
            error: 'Verification failed - data mismatch after update',
          };
        }
      }
    }

    return {
      storage: config.type,
      success: true,
      data: updatedData,
      verified: true,
      statusCode: updateResponse.status,
    };
  } catch (error) {
    return {
      storage: config.type,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================
// MINIO OPERATIONS
// ============================================================

/**
 * Upload file to MinIO with verification
 *
 * Uses the service's file upload endpoint (not direct MinIO access)
 */
export async function minioUpload(
  serviceConfig: StorageConfig,
  endpoint: string,
  file: File,
  metadata?: Record<string, string>
): Promise<StorageOperationResult<{ fileName: string; filePath: string }>> {
  const timeout = serviceConfig.operationTimeout ?? DEFAULT_OPERATION_TIMEOUT;

  try {
    const formData = new FormData();
    formData.append('file', file);

    if (metadata) {
      for (const [key, value] of Object.entries(metadata)) {
        formData.append(key, value);
      }
    }

    const response = await fetch(`${serviceConfig.baseUrl}${endpoint}`, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(timeout),
    });

    if (!response.ok) {
      if (response.status === 503) {
        return {
          storage: 'minio',
          success: false,
          error: 'Storage service unavailable',
          statusCode: 503,
        };
      }

      const errorData = await response.json().catch(() => null);
      return {
        storage: 'minio',
        success: false,
        error: errorData?.detail ?? `Upload failed with status ${response.status}`,
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return {
      storage: 'minio',
      success: true,
      data: {
        fileName: data.file_name ?? file.name,
        filePath: data.file_path ?? '',
      },
      verified: true,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      storage: 'minio',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Delete file from MinIO via service endpoint
 */
export async function minioDelete(
  serviceConfig: StorageConfig,
  endpoint: string,
  fileName: string
): Promise<StorageOperationResult<void>> {
  const timeout = serviceConfig.operationTimeout ?? DEFAULT_OPERATION_TIMEOUT;

  try {
    const response = await fetch(`${serviceConfig.baseUrl}${endpoint}/${fileName}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(timeout),
    });

    if (!response.ok) {
      if (response.status === 503) {
        return {
          storage: 'minio',
          success: false,
          error: 'Storage service unavailable',
          statusCode: 503,
        };
      }

      if (response.status === 404) {
        // File already deleted - consider this success
        return {
          storage: 'minio',
          success: true,
          verified: true,
          statusCode: 404,
        };
      }

      const errorData = await response.json().catch(() => null);
      return {
        storage: 'minio',
        success: false,
        error: errorData?.detail ?? `Delete failed with status ${response.status}`,
        statusCode: response.status,
      };
    }

    return {
      storage: 'minio',
      success: true,
      verified: true,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      storage: 'minio',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check if file exists in MinIO (HEAD request via service)
 */
export async function minioExists(
  serviceConfig: StorageConfig,
  endpoint: string,
  fileName: string
): Promise<boolean> {
  const timeout = serviceConfig.operationTimeout ?? DEFAULT_OPERATION_TIMEOUT;

  try {
    const response = await fetch(`${serviceConfig.baseUrl}${endpoint}/${fileName}`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(timeout),
    });

    return response.ok;
  } catch {
    return false;
  }
}

// ============================================================
// COMBINED OPERATIONS (SQL + MinIO)
// ============================================================

/**
 * Execute operation with health check, execution, and verification
 *
 * This is the main entry point for all storage operations.
 *
 * @example
 * ```ts
 * const result = await executeOperation({
 *   type: 'delete',
 *   storages: [STORAGE_CONFIGS.issuesSQL, STORAGE_CONFIGS.minio],
 *   endpoint: '/issues',
 *   data: { id: 'issue-123', entityCode: 'ISSUE-001' },
 * }, {
 *   onHealthCheckStart: () => setPhase('health_check'),
 *   onUnavailable: (storages) => showUnavailableModal(storages),
 *   onSuccess: () => toast.success('Deleted!'),
 * });
 * ```
 */
export async function executeOperation<T = unknown>(
  request: OperationRequest<T>,
  callbacks?: OperationCallbacks<T>,
  retryConfig?: Partial<RetryConfig>
): Promise<OperationResult<T>> {
  const startTime = performance.now();
  const results = new Map<StorageType, StorageOperationResult<T>>();
  const failedStorages: StorageType[] = [];

  // Phase 1: Health Check
  callbacks?.onHealthCheckStart?.();

  if (!request.skipHealthCheck) {
    const healthResult = await checkMultipleStoragesHealth(request.storages, retryConfig);
    callbacks?.onHealthCheckComplete?.(healthResult);

    if (!healthResult.allHealthy) {
      callbacks?.onUnavailable?.(healthResult.unhealthyStorages);

      // If force with pending is allowed and user chooses it
      if (request.forceWithPending) {
        return {
          success: false,
          phase: 'unavailable',
          results,
          failedStorages: healthResult.unhealthyStorages,
          markedForPending: true,
          error: `Storage unavailable: ${healthResult.unhealthyStorages.join(', ')}`,
          duration: performance.now() - startTime,
        };
      }

      return {
        success: false,
        phase: 'unavailable',
        results,
        failedStorages: healthResult.unhealthyStorages,
        markedForPending: false,
        error: `Storage unavailable: ${healthResult.unhealthyStorages.join(', ')}`,
        duration: performance.now() - startTime,
      };
    }
  }

  // Phase 2: Execute Operation
  callbacks?.onOperationStart?.();

  let primaryData: T | undefined;

  for (let i = 0; i < request.storages.length; i++) {
    const storage = request.storages[i];
    callbacks?.onProgress?.(i + 1, request.storages.length);

    let result: StorageOperationResult<T>;

    switch (request.type) {
      case 'create':
        result = await sqlCreate<T>(
          storage,
          request.endpoint,
          request.data as Record<string, unknown>,
          request.verifyFields
        );
        break;

      case 'delete':
        result = await sqlDelete(
          storage,
          request.endpoint,
          (request.data as Record<string, unknown>)?.id as string,
          request.forceWithPending
        ) as StorageOperationResult<T>;
        break;

      case 'update':
        result = await sqlUpdate<T>(
          storage,
          request.endpoint,
          (request.data as Record<string, unknown>)?.id as string,
          request.data as Record<string, unknown>,
          request.verifyFields
        );
        break;

      case 'read':
        // Simple GET request
        try {
          const response = await fetch(
            `${storage.baseUrl}${request.endpoint}`,
            { method: 'GET', signal: AbortSignal.timeout(storage.operationTimeout ?? DEFAULT_OPERATION_TIMEOUT) }
          );
          if (response.ok) {
            const data = await response.json();
            result = { storage: storage.type, success: true, data, statusCode: response.status };
          } else {
            result = { storage: storage.type, success: false, statusCode: response.status, error: `Read failed with ${response.status}` };
          }
        } catch (e) {
          result = { storage: storage.type, success: false, error: e instanceof Error ? e.message : 'Unknown error' };
        }
        break;

      default:
        result = { storage: storage.type, success: false, error: `Unknown operation type: ${request.type}` };
    }

    results.set(storage.type, result);

    if (!result.success) {
      failedStorages.push(storage.type);

      // Handle 404 (not found)
      if (result.statusCode === 404) {
        callbacks?.onNotFound?.((request.data as Record<string, unknown>)?.id as string);
      }

      // Handle verification failures
      if (result.verificationErrors) {
        callbacks?.onVerificationFailed?.(result.verificationErrors);
      }
    } else if (!primaryData && result.data) {
      primaryData = result.data;
    }
  }

  // Determine success based on allowPartialSuccess
  const allSucceeded = failedStorages.length === 0;
  const anySucceeded = failedStorages.length < request.storages.length;
  const success = request.allowPartialSuccess ? anySucceeded : allSucceeded;

  const phase: OperationPhase = success
    ? 'success'
    : failedStorages.some((s) => results.get(s)?.statusCode === 404)
    ? 'not_found'
    : failedStorages.some((s) => results.get(s)?.verificationErrors)
    ? 'verification_failed'
    : 'failed';

  const operationResult: OperationResult<T> = {
    success,
    phase,
    results,
    failedStorages,
    markedForPending: false,
    data: primaryData,
    error: success ? undefined : `Operation failed for: ${failedStorages.join(', ')}`,
    duration: performance.now() - startTime,
  };

  if (success) {
    callbacks?.onSuccess?.(operationResult);
  } else {
    callbacks?.onError?.(operationResult.error!, operationResult);
  }

  return operationResult;
}

// ============================================================
// BATCH OPERATIONS
// ============================================================

/**
 * Execute multiple operations in sequence or parallel
 */
export async function executeBatchOperations<T = unknown>(
  requests: OperationRequest<T>[],
  options?: {
    parallel?: boolean;
    stopOnError?: boolean;
    callbacks?: OperationCallbacks<T>;
    retryConfig?: Partial<RetryConfig>;
  }
): Promise<{
  results: OperationResult<T>[];
  successCount: number;
  failCount: number;
}> {
  const { parallel = false, stopOnError = false, callbacks, retryConfig } = options ?? {};

  const results: OperationResult<T>[] = [];
  let successCount = 0;
  let failCount = 0;

  if (parallel) {
    const allResults = await Promise.all(
      requests.map((req) => executeOperation(req, callbacks, retryConfig))
    );
    for (const result of allResults) {
      results.push(result);
      if (result.success) successCount++;
      else failCount++;
    }
  } else {
    for (let i = 0; i < requests.length; i++) {
      callbacks?.onProgress?.(i + 1, requests.length);

      const result = await executeOperation(requests[i], callbacks, retryConfig);
      results.push(result);

      if (result.success) {
        successCount++;
      } else {
        failCount++;
        if (stopOnError) break;
      }
    }
  }

  return { results, successCount, failCount };
}
