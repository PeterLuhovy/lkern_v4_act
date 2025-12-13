/*
 * ================================================================
 * FILE: serviceRetry.ts
 * PATH: /packages/config/src/utils/serviceRetry/serviceRetry.ts
 * DESCRIPTION: Universal service retry utility with configurable timing
 *              and callbacks for toast notifications.
 * VERSION: v1.0.0
 * CREATED: 2025-11-30
 * UPDATED: 2025-11-30
 * ================================================================
 */

// ============================================================
// TYPES
// ============================================================

/**
 * Result of a service call attempt
 */
export interface ServiceCallResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  responseTime: number;
}

/**
 * Callback functions for retry events
 */
export interface RetryCallbacks {
  /** Called when first attempt starts */
  onAttemptStart?: () => void;
  /** Called when connection is taking longer than expected (after takingLongerDelay) */
  onTakingLonger?: () => void;
  /** Called when first attempt fails quickly (before takingLongerDelay) - "Connection failed" */
  onQuickFailure?: () => void;
  /** Called when a retry attempt starts (attempt: 1-based, maxAttempts: total) */
  onRetry?: (attempt: number, maxAttempts: number) => void;
  /** Called when attempt succeeds */
  onSuccess?: () => void;
  /** Called when all retries exhausted (service considered unavailable) */
  onAllRetriesFailed?: () => void;
}

/**
 * Configuration for retry behavior
 */
export interface RetryConfig {
  /** Service name for logging (e.g., "Issues Service", "SQL", "MinIO") */
  serviceName: string;
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number;
  /** Time before showing "taking longer" message in ms (default: 2000) */
  takingLongerDelay?: number;
  /** Timeout for each attempt in ms (default: 5000) */
  attemptTimeout?: number;
  /** Delay between retry attempts in ms (default: 5000) */
  retryDelay?: number;
  /** Enable console logging (default: true) */
  debug?: boolean;
}

/**
 * Final result of the retry operation
 */
export interface RetryResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  attempts: number;
  totalTime: number;
  /** True if "taking longer" callback was triggered */
  tookLonger: boolean;
}

// ============================================================
// DEFAULT CONFIGURATION
// ============================================================

const DEFAULT_CONFIG: Required<Omit<RetryConfig, 'serviceName'>> = {
  maxRetries: 3,
  takingLongerDelay: 1500,   // 1.5s - show "taking longer" toast
  attemptTimeout: 5000,
  retryDelay: 5000,
  debug: true,
};

// ============================================================
// LOGGING
// ============================================================

let debugEnabled = true;

function log(serviceName: string, message: string, data?: unknown) {
  if (!debugEnabled) return;
  if (data !== undefined) {
    console.log(`[ServiceRetry:${serviceName}] ${message}`, data);
  } else {
    console.log(`[ServiceRetry:${serviceName}] ${message}`);
  }
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Simple delay helper using Promise
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Execute a promise with timeout
 */
async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutError = 'Operation timed out'
): Promise<T> {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(timeoutError)), timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    if (timeoutId) clearTimeout(timeoutId);
    return result;
  } catch (error) {
    if (timeoutId) clearTimeout(timeoutId);
    throw error;
  }
}

// ============================================================
// MAIN RETRY FUNCTION
// ============================================================

/**
 * Universal retry function for service calls with configurable timing and callbacks.
 *
 * Flow:
 * 1. First attempt starts immediately
 * 2. If response takes longer than `takingLongerDelay` → `onTakingLonger` callback
 * 3. If attempt fails/times out after `attemptTimeout` → retry with `onRetry` callback
 * 4. Retries continue with `retryDelay` between them
 * 5. After `maxRetries` failures → `onAllRetriesFailed` callback
 *
 * @param serviceCall - Async function that performs the actual service call
 * @param config - Configuration for retry behavior
 * @param callbacks - Callbacks for UI feedback (toasts)
 * @returns Final result after all attempts
 *
 * @example
 * ```ts
 * const result = await executeWithRetry(
 *   async () => {
 *     const response = await fetch('http://localhost:4105/ping');
 *     return {
 *       success: response.ok,
 *       data: await response.json(),
 *       responseTime: 50
 *     };
 *   },
 *   { serviceName: 'Issues Service', maxRetries: 3 },
 *   {
 *     onTakingLonger: () => toast.info('Pripojenie trvá dlhšie...', { duration: 20000 }),
 *     onRetry: (attempt, max) => toast.warning(`Pokus ${attempt}/${max}...`, { duration: 20000 }),
 *     onAllRetriesFailed: () => showServiceDownModal()
 *   }
 * );
 * ```
 */
export async function executeWithRetry<T = unknown>(
  serviceCall: () => Promise<ServiceCallResult<T>>,
  config: RetryConfig,
  callbacks: RetryCallbacks = {}
): Promise<RetryResult<T>> {
  const {
    serviceName,
    maxRetries = DEFAULT_CONFIG.maxRetries,
    takingLongerDelay = DEFAULT_CONFIG.takingLongerDelay,
    attemptTimeout = DEFAULT_CONFIG.attemptTimeout,
    retryDelay = DEFAULT_CONFIG.retryDelay,
    debug = DEFAULT_CONFIG.debug,
  } = config;

  debugEnabled = debug;

  const startTime = performance.now();
  let attempts = 0;
  let tookLonger = false;
  let lastError: string | undefined;

  log(serviceName, `Starting retry logic (max ${maxRetries} retries, ${attemptTimeout}ms timeout)`);

  // Notify that first attempt is starting
  callbacks.onAttemptStart?.();

  // ─────────────────────────────────────────────────────────────────
  // FIRST ATTEMPT (with "taking longer" detection DURING the attempt)
  // ─────────────────────────────────────────────────────────────────
  attempts++;
  log(serviceName, `Attempt 1 (initial)... (takingLonger: ${takingLongerDelay}ms, timeout: ${attemptTimeout}ms)`);

  const attemptStartTime = performance.now();

  // Create the service call promise with timeout
  const callPromise = withTimeout(serviceCall(), attemptTimeout, `${serviceName} timeout`);

  // Create a timer that fires after takingLongerDelay (1.5s)
  // We need TWO flags:
  // - takingLongerCallbackCalled: true if onTakingLonger was actually called (timer fired)
  // - timerCancelled: true if call finished before timer (to prevent timer callback)
  let takingLongerCallbackCalled = false;
  let timerCancelled = false;
  const takingLongerTimer = delay(takingLongerDelay).then(() => {
    if (!timerCancelled) {
      takingLongerCallbackCalled = true;
      tookLonger = true;
      log(serviceName, `📢 SHOWING "taking longer" toast at ${Math.round(performance.now() - attemptStartTime)}ms`);
      callbacks.onTakingLonger?.();
    }
    return { type: 'timer' as const };
  });

  // Race: wait for either the call to complete OR the timer to fire
  // But we always need the call result, so we handle both cases
  let result: ServiceCallResult<T> | undefined;

  try {
    // First, race to see what happens first
    const raceResult = await Promise.race([
      callPromise.then(r => ({ type: 'call' as const, result: r })),
      takingLongerTimer,
    ]);

    if (raceResult.type === 'call') {
      // Call finished before timer - cancel the timer by marking it as cancelled
      timerCancelled = true;  // Prevent timer from firing callback
      result = raceResult.result;
      log(serviceName, `First attempt completed in ${Math.round(performance.now() - attemptStartTime)}ms (before "taking longer" timer)`);
    } else {
      // Timer fired first (1.5s passed) - "taking longer" toast already shown
      // Now wait for the actual call result
      log(serviceName, `Timer fired, waiting for call to complete...`);
      try {
        result = await callPromise;
      } catch (err) {
        result = {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
          responseTime: Math.round(performance.now() - attemptStartTime),
        };
      }
    }
  } catch (error) {
    result = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: Math.round(performance.now() - attemptStartTime),
    };
  }

  // Check if first attempt succeeded
  if (result.success) {
    log(serviceName, `✅ First attempt successful (${result.responseTime}ms)`);
    callbacks.onSuccess?.();
    return {
      success: true,
      data: result.data,
      attempts,
      totalTime: Math.round(performance.now() - startTime),
      tookLonger,
    };
  }

  lastError = result.error;
  log(serviceName, `❌ First attempt failed: ${lastError}`);

  // Quick failure (before timer) - show "connection failed" toast
  // This is different from "taking longer" which is for slow responses
  // Only show if onTakingLonger was NOT already called (timer didn't fire)
  if (!takingLongerCallbackCalled) {
    log(serviceName, `📢 Quick failure detected - showing "connection failed" toast`);
    callbacks.onQuickFailure?.();
  }

  // Wait before first retry
  const elapsedSoFar = performance.now() - attemptStartTime;
  const waitBeforeRetry = Math.max(0, retryDelay - elapsedSoFar);
  if (waitBeforeRetry > 0) {
    log(serviceName, `⏳ Waiting ${Math.round(waitBeforeRetry)}ms before first retry...`);
    await delay(waitBeforeRetry);
  }

  log(serviceName, `📢 Starting retry loop at ${Math.round(performance.now() - attemptStartTime)}ms`);

  // ─────────────────────────────────────────────────────────────────
  // RETRY LOOP
  // ─────────────────────────────────────────────────────────────────
  for (let retry = 1; retry <= maxRetries; retry++) {
    attempts++;

    // Notify UI about retry FIRST (so user sees "Retry 1/3" before attempt)
    callbacks.onRetry?.(retry, maxRetries);
    log(serviceName, `🔄 Retry ${retry}/${maxRetries}...`);

    try {
      const result = await withTimeout(serviceCall(), attemptTimeout, `${serviceName} timeout`);

      if (result.success) {
        log(serviceName, `✅ Retry ${retry} successful (${result.responseTime}ms)`);
        callbacks.onSuccess?.();
        return {
          success: true,
          data: result.data,
          attempts,
          totalTime: Math.round(performance.now() - startTime),
          tookLonger,
        };
      }

      lastError = result.error;
      log(serviceName, `❌ Retry ${retry} failed: ${lastError}`);
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Unknown error';
      log(serviceName, `❌ Retry ${retry} error: ${lastError}`);
    }

    // Wait before next retry (except after last attempt)
    if (retry < maxRetries) {
      log(serviceName, `⏳ Waiting ${retryDelay}ms before next retry...`);
      await delay(retryDelay);
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // ALL RETRIES FAILED
  // ─────────────────────────────────────────────────────────────────
  const totalTime = Math.round(performance.now() - startTime);
  log(serviceName, `🚫 All ${maxRetries} retries failed after ${totalTime}ms`);

  callbacks.onAllRetriesFailed?.();

  return {
    success: false,
    error: lastError || 'All retry attempts failed',
    attempts,
    totalTime,
    tookLonger,
  };
}

// ============================================================
// CONVENIENCE FUNCTIONS
// ============================================================

/**
 * Create a service call function from a simple fetch request
 */
export function createFetchServiceCall<T = unknown>(
  url: string,
  options?: RequestInit
): () => Promise<ServiceCallResult<T>> {
  return async () => {
    const startTime = performance.now();
    try {
      const response = await fetch(url, options);
      const responseTime = Math.round(performance.now() - startTime);

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          responseTime,
        };
      }

      let data: T | undefined;
      try {
        data = await response.json();
      } catch {
        // Response might not be JSON
      }

      return {
        success: true,
        data,
        responseTime,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Math.round(performance.now() - startTime),
      };
    }
  };
}

/**
 * Simplified retry for ping-style health checks
 */
export async function pingWithRetry(
  url: string,
  serviceName: string,
  callbacks: RetryCallbacks = {}
): Promise<RetryResult<{ status: string }>> {
  return executeWithRetry(
    createFetchServiceCall(url),
    { serviceName },
    callbacks
  );
}
