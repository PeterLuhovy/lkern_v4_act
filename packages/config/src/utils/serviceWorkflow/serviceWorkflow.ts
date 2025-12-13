/*
 * ================================================================
 * FILE: serviceWorkflow.ts
 * PATH: /packages/config/src/utils/serviceWorkflow/serviceWorkflow.ts
 * DESCRIPTION: Universal service workflow with health checks, retries,
 *              verification, and comprehensive error handling.
 *              Replaces duplicated workflow code across microservices.
 *              1:1 COPY OF createIssueWorkflow LOGIC AND FLOW.
 * VERSION: v5.0.0
 * CREATED: 2025-12-03
 * UPDATED: 2025-12-10
 * CHANGELOG:
 *   v5.0.0 - MAJOR REFACTORING: Module extraction for maintainability (~830 lines removed)
 *            - Extracted apiExecution.ts: HTTP request logic (GET/POST/PUT/PATCH/DELETE, FormData, files)
 *            - Extracted verification.ts: SQL + MinIO + field verification with retry
 *            - Extracted healthCheck.ts: Service/SQL/MinIO health checks with retry
 *            - Extracted constants.ts: Centralized configuration (timeouts, retry counts, cache TTL)
 *            - All helper functions now in separate modules with proper exports
 *            - Improved security: SHA-256 hashing in cache, sensitive field filtering in logs
 *            - File size reduced: 1526 → 695 lines (54% reduction)
 *   v4.0.0 - MAJOR UPGRADE: Added cache system, verification retry, optimistic updates
 *            - Cache: In-memory TTL cache (default 5min) for GET requests
 *            - Verification retry: 3x retry with 2s delay (configurable)
 *            - Optimistic updates: Toggle-able with rollback on failure
 *            - Quality logging: Detailed logs for cache hits/misses, retry attempts
 *   v3.5.1 - Fixed: onDataIntegrityIssue callback now called for BOTH:
 *            - missing_in_minio (files in DB but not in MinIO) - severity MODERATE
 *            - orphaned_in_minio (files in MinIO but not in DB) - severity MINOR
 *   v3.5.0 - Added pre-delete verification for DELETE operations:
 *            - Calls verify endpoint to detect orphaned/missing attachments
 *            - Reports data integrity issues via onDataIntegrityIssue callback
 *            - Enables auto-issue creation when problems detected
 *   v3.4.1 - Fixed health check logic for skipped services:
 *            - Changed !== 'healthy' to === 'unhealthy' checks
 *            - 'skipped' status now allowed (intentionally not checked)
 *            - Fixes issue where GET/DELETE with healthChecks: false would fail
 *   v3.4.0 - Fixed executeApiCall for all HTTP methods:
 *            - GET/DELETE: No body, no Content-Type header
 *            - POST with files: FormData without Content-Type (browser sets boundary)
 *            - PUT/PATCH/POST without files: JSON with Content-Type: application/json
 *            - Added 204 No Content handling for DELETE responses
 *   v3.3.0 - CRITICAL FIX: Field verification now affects success status!
 *            - If fields don't match (sent != saved), workflow returns success: false
 *            - Added VERIFICATION_FAILED error code
 *            - Returns data for debugging even on verification failure
 *            - Calls onError callback with error details
 *   v3.2.3 - Improved request data logging:
 *            - PUT/PATCH: "📝 FIELDS TO UPDATE (N)" - clear it's changes only
 *            - POST: "📝 NEW RECORD DATA (N fields)" - clear it's new record
 *            - Separated "📡 REQUEST INFO" for URL/method/permission
 *            - Files logged only when present
 *   v3.2.2 - Fixed MinIO logging:
 *            - Changed "MinIO down" to "MinIO unhealthy" for clarity
 *            - No log when MinIO is intentionally skipped (already shown in RESULTS)
 *            - Added minioSkipped flag to distinguish skipped vs unhealthy
 *   v3.2.1 - Fixed overall status semantics:
 *            - UNHEALTHY = only when service ping fails (backend down)
 *            - DEGRADED = service runs but SQL/MinIO unhealthy
 *            - SKIPPED = some checks were skipped (no complete info)
 *            - HEALTHY = all checked services are healthy
 *            - SQL default status is now 'skipped' (when checkSql=false)
 *   v3.2.0 - Added 'skipped' status for MinIO health check
 *            - When checkMinio=false (no files), status is 'skipped' not 'unknown'
 *            - When SQL is down, MinIO check is 'skipped' not 'unknown'
 *            - Overall status: 'skipped' treated as 'healthy' (intentionally not checked)
 *            - Logging shows ⏭️ SKIPPED instead of ❓ unknown
 *   v3.1.0 - Added attachment verification (1:1 with createIssueWorkflow)
 *            - performVerification verifies MinIO attachments with size comparison
 *            - Added data field logging (all fields logged like createIssueWorkflow)
 *            - Updated summary to show fields and attachment verification status
 *   v3.0.0 - MAJOR: 1:1 copy of createIssueWorkflow logic
 *            - performHealthCheckWithRetry returns full HealthCheckResult
 *            - MinIO retry in main workflow (not in health check)
 *            - Exact same logging, callbacks, and flow
 *   v2.0.0 - Same logging format and flow as createIssueWorkflow
 *   v1.1.0 - Added formDataFields support for custom FormData fields
 * ================================================================
 */

import type {
  ServiceWorkflowConfig,
  ServiceWorkflowResult,
  ServiceWorkflowErrorCode,
} from './types';
import { executeWithRetry } from '../serviceRetry/serviceRetry';
import type { ServiceCallResult, RetryCallbacks } from '../serviceRetry/serviceRetry';
import { toastManager } from '../toastManager';
import { sk } from '../../translations/sk';
import { en } from '../../translations/en';
import { workflowCache } from './cache';
import { WorkflowContext, sanitizeForLogging } from './logging';
import { TIMEOUTS, RETRY, CACHE } from './constants';
import { executeApiCall, setApiExecutionLogger } from './apiExecution';
import {
  performVerification,
  performPreDeleteVerification,
  setVerificationLogger,
} from './verification';
import type { VerificationResult } from './verification';
import {
  performHealthCheckWithRetry,
  setHealthCheckLogger,
} from './healthCheck';
import type { ServiceHealth } from './healthCheck';

// ============================================================
// CONFIGURATION - All constants moved to constants.ts
// ============================================================
// TIMEOUTS.PING, TIMEOUTS.HEALTH, TIMEOUTS.TAKING_LONGER
// RETRY.HEALTH_COUNT, RETRY.HEALTH_DELAY, RETRY.VERIFICATION_COUNT, RETRY.VERIFICATION_DELAY
// CACHE.DEFAULT_TTL

// ============================================================
// LOGGING - Now using WorkflowContext for isolated state
// ============================================================
// WorkflowContext created per-workflow to prevent race conditions

// ============================================================
// NOTE: All helper functions moved to separate modules
// ============================================================
// - normalizeForComparison() → verification.ts
// - performHealthCheckWithRetry() → healthCheck.ts
// - executeApiCall() → apiExecution.ts
// - performVerification() → verification.ts
// - performPreDeleteVerification() → verification.ts

// ============================================================
// MAIN WORKFLOW (1:1 copy of createIssueWorkflow structure)
// ============================================================

/**
 * Universal service workflow for all CRUD operations across microservices.
 *
 * Features:
 * - Health checks (Service ping, SQL database, MinIO storage)
 * - HTTP operations (GET, POST, PUT, PATCH, DELETE)
 * - File uploads with FormData
 * - Post-operation verification (SQL records, MinIO files, field comparison)
 * - Pre-delete integrity checks (missing/orphaned files)
 * - Automatic retry with callbacks
 * - Standardized error handling
 * - Request cancellation via AbortSignal
 *
 * Workflow Steps:
 * 1. Health Checks (optional, with cache)
 * 2. Pre-Delete Verification (DELETE operations only)
 * 3. API Call Execution (GET/POST/PUT/PATCH/DELETE)
 * 4. Post-Operation Verification (optional, with retry)
 *
 * @template TData - Type of request data (sent to API)
 * @template TResult - Type of response data (received from API)
 * @param config - Workflow configuration (endpoint, method, data, verification, callbacks)
 * @returns Workflow result with success status, data, error details, and verification results
 *
 * @example
 * ```typescript
 * // Create a new issue with file uploads
 * const result = await serviceWorkflow({
 *   baseUrl: SERVICE_ENDPOINTS.issues.baseUrl,
 *   endpoint: '/issues/',
 *   method: 'POST',
 *   data: { title: 'Bug report', severity: 'HIGH' },
 *   files: [screenshotFile, logFile],
 *   verification: {
 *     skipSql: false,
 *     skipAttachments: false,
 *     getEndpoint: (res) => `/issues/${res.id}`,
 *     compareFields: ['title', 'severity'],
 *   },
 *   healthCheck: {
 *     checkPing: true,
 *     checkSql: true,
 *     checkMinio: true,
 *   },
 *   callbacks: {
 *     onServiceAlive: () => console.log('Service is ready'),
 *     onVerificationRetry: (attempt) => console.log(`Retry ${attempt}`),
 *   },
 * });
 *
 * if (result.success) {
 *   console.log('Issue created:', result.data);
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Delete with integrity check
 * const result = await serviceWorkflow({
 *   baseUrl: SERVICE_ENDPOINTS.contacts.baseUrl,
 *   endpoint: '/contacts/123',
 *   method: 'DELETE',
 *   deleteVerification: {
 *     entityId: 123,
 *     entityType: 'contact',
 *     entityCode: 'CONT-123',
 *     getVerifyEndpoint: (id) => `/contacts/${id}/verify`,
 *   },
 *   callbacks: {
 *     onDataIntegrityIssue: (event) => reportToIssueTracker(event),
 *   },
 * });
 * ```
 */
export async function serviceWorkflow<TData = unknown, TResult = unknown>(
  config: ServiceWorkflowConfig<TData, TResult>
): Promise<ServiceWorkflowResult<TResult>> {
  const {
    baseUrl,
    endpoint,
    method,
    data,
    files,
    headers,
    permissionLevel,
    formDataRole,
    formDataFields,
    healthChecks,
    verification,
    deleteVerification,
    callbacks,
    debug = false,
    caller = 'ServiceWorkflow',
    showToasts = false,
    language = 'sk',
    responseType = 'json',
  } = config;

  // Create isolated logging context for this workflow execution
  const context = new WorkflowContext(debug, caller);

  // Initialize logging for extracted modules
  setHealthCheckLogger(debug, context.log.bind(context));
  setApiExecutionLogger(debug, context.log.bind(context));
  setVerificationLogger(debug, caller, context.log.bind(context));

  // Get translation object based on language
  const t = language === 'en' ? en : sk;

  // Track toast IDs for cleanup
  let takingLongerToastId: string | undefined;

  // Wrap callbacks with automatic toast logic
  const wrappedCallbacks = {
    onServiceAlive: () => {
      if (takingLongerToastId) {
        toastManager.hide(takingLongerToastId);
        takingLongerToastId = undefined;
      }
      callbacks?.onServiceAlive?.();
    },
    onServiceDown: () => {
      if (takingLongerToastId) {
        toastManager.hide(takingLongerToastId);
        takingLongerToastId = undefined;
      }
      if (showToasts) {
        toastManager.show(t.storageOperations.messages.serviceDown, {
          type: 'error',
          duration: 20000,
        });
      }
      callbacks?.onServiceDown?.();
    },
    onTakingLonger: () => {
      if (showToasts) {
        takingLongerToastId = toastManager.show(t.storageOperations.messages.takingLonger, {
          type: 'warning',
          duration: 0, // Infinite until dismissed
        });
      }
      callbacks?.onTakingLonger?.();
    },
    onQuickFailure: () => {
      if (showToasts) {
        toastManager.show(t.storageOperations.messages.connectionFailed, {
          type: 'warning',
          duration: 20000,
        });
      }
      callbacks?.onQuickFailure?.();
    },
    onHealthRetry: (attempt: number, maxAttempts: number) => {
      if (showToasts) {
        toastManager.show(t.storageOperations.messages.retrying.replace('{attempt}', String(attempt)).replace('{max}', String(maxAttempts)), {
          type: 'info',
          duration: 20000,
        });
      }
      callbacks?.onHealthRetry?.(attempt, maxAttempts);
    },
    onSuccess: callbacks?.onSuccess,
    onError: callbacks?.onError,
    onDataIntegrityIssue: callbacks?.onDataIntegrityIssue,
    onOptimisticUpdate: callbacks?.onOptimisticUpdate,
    onVerificationRetry: callbacks?.onVerificationRetry,
  };

  const hasFiles = files && files.length > 0;
  const timestamp = new Date().toISOString();

  // ─────────────────────────────────────────────────────────────────
  // START
  // ─────────────────────────────────────────────────────────────────
  context.logHeader(`🚀 ${method} WORKFLOW`);

  context.logSection('📌 WORKFLOW CONTEXT');
  context.log(`   Timestamp:   ${timestamp}`);
  context.log(`   Caller:      ${caller}`);
  context.log(`   Debug Mode:  ${debug ? 'ON' : 'OFF'}`);

  context.logSection('📡 REQUEST INFO');
  context.log(`   Base URL:    ${baseUrl}`);
  context.log(`   Endpoint:    ${endpoint}`);
  context.log(`   Method:      ${method}`);
  if (permissionLevel !== undefined) {
    context.log(`   Permission:  ${permissionLevel}`);
  }

  // Log data fields with clear section title based on method
  const dataFieldCount = data && typeof data === 'object' ? Object.keys(data as Record<string, unknown>).length : 0;
  if (method === 'PUT' || method === 'PATCH') {
    context.logSection(`📝 FIELDS TO UPDATE (${dataFieldCount})`);
  } else if (method === 'POST') {
    context.logSection(`📝 NEW RECORD DATA (${dataFieldCount} fields)`);
  } else {
    context.logSection('📝 REQUEST DATA');
  }

  if (data && typeof data === 'object') {
    const dataObj = data as Record<string, unknown>;
    for (const [key, value] of Object.entries(dataObj)) {
      if (value === null || value === undefined) {
        context.log(`   ${key.padEnd(14)} (not set)`);
      } else {
        // Sanitize value to prevent sensitive data exposure (passwords, tokens, etc.)
        const sanitized = sanitizeForLogging(key, value);
        context.log(`   ${key.padEnd(14)} ${sanitized}`);
      }
    }
  }

  if (hasFiles) {
    context.log(`   + ${files?.length} file(s) to upload`);
  }
  if (hasFiles && files) {
    files.forEach((f, i) => context.log(`      [${i + 1}] ${f.name} (${(f.size / 1024).toFixed(1)} KB, ${f.type})`));
  }

  // ─────────────────────────────────────────────────────────────────
  // STEP 1: HEALTH CHECK (with automatic retry)
  // ─────────────────────────────────────────────────────────────────
  context.logSection('STEP 1: HEALTH CHECK');
  context.log(`   Automatic retry: up to ${RETRY.HEALTH_COUNT}x (${TIMEOUTS.TAKING_LONGER}ms→"taking longer", ${TIMEOUTS.PING}ms timeout, ${RETRY.HEALTH_DELAY}ms between)`);

  const health = await performHealthCheckWithRetry(
    baseUrl,
    healthChecks?.ping ?? true,
    healthChecks?.sql ?? true,
    healthChecks?.minio ?? false,
    {
      onServiceAlive: wrappedCallbacks.onServiceAlive,
      onServiceDown: wrappedCallbacks.onServiceDown,
      onTakingLonger: wrappedCallbacks.onTakingLonger,
      onQuickFailure: wrappedCallbacks.onQuickFailure,
      onRetry: wrappedCallbacks.onHealthRetry,
    }
  );

  context.logSection('🏥 RESULTS');
  context.log(`   Service:     ${health.service.status === 'healthy' ? '✅' : '❌'} ${health.service.status.toUpperCase()} (${health.service.responseTime}ms)`);
  context.log(`   SQL Database: ${health.sql.status === 'healthy' ? '✅' : health.sql.status === 'skipped' ? '⏭️' : health.sql.status === 'unknown' ? '❓' : '❌'} ${health.sql.status.toUpperCase()} (${health.sql.responseTime || 0}ms)${health.sql.error ? ` [${health.sql.error}]` : ''}`);
  context.log(`   MinIO Storage: ${health.minio.status === 'healthy' ? '✅' : health.minio.status === 'skipped' ? '⏭️' : health.minio.status === 'unknown' ? '❓' : '❌'} ${health.minio.status.toUpperCase()} (${health.minio.responseTime || 0}ms)${health.minio.error ? ` [${health.minio.error}]` : ''}`);
  context.log(`   Overall: ${health.overall.toUpperCase()}`);

  // Check critical services (skipped = intentionally not checked, allowed to proceed)
  if (health.service.status === 'unhealthy') {
    context.log('❌ Service down - cannot proceed');
    const workflowTotalTime = context.getElapsedFormatted();
    context.log(`⏱️  Total workflow time: ${workflowTotalTime}s`);
    wrappedCallbacks.onError?.('Service is not available', 'SERVICE_DOWN');
    return {
      success: false,
      error: 'Service is not available',
      errorCode: 'SERVICE_DOWN',
      totalTime: health.totalTime,
    };
  }

  if (health.sql.status === 'unhealthy') {
    context.log('❌ SQL Database down - cannot proceed');
    const workflowTotalTime = context.getElapsedFormatted();
    context.log(`⏱️  Total workflow time: ${workflowTotalTime}s`);
    wrappedCallbacks.onError?.('Database is not available', 'SQL_DOWN');
    return {
      success: false,
      error: 'Database is not available',
      errorCode: 'SQL_DOWN',
      totalTime: health.totalTime,
    };
  }

  let minioAvailable = health.minio.status === 'healthy';
  const minioSkipped = health.minio.status === 'skipped';

  // If MinIO is down (not skipped!) AND user has files → retry MinIO 3x before showing modal
  // (Same logic as createIssueWorkflow)
  if (!minioAvailable && !minioSkipped && hasFiles && healthChecks?.minio) {
    context.log('⚠️ MinIO unhealthy + user has files → retrying MinIO check...');

    // MinIO-specific retry (user has files, so MinIO is required)
    const minioServiceCall = async (): Promise<ServiceCallResult<ServiceHealth>> => {
      const startTime = performance.now();
      try {
        const response = await fetch(`${baseUrl}/health`, { method: 'GET' });
        const responseTime = Math.round(performance.now() - startTime);
        const responseData = await response.json();

        const minioStatus = responseData.dependencies?.minio?.status === 'healthy' ? 'healthy' : 'unhealthy';
        return {
          success: minioStatus === 'healthy',
          data: {
            status: minioStatus,
            responseTime: responseData.dependencies?.minio?.responseTime || responseTime,
            error: responseData.dependencies?.minio?.error,
          },
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

    const minioCallbacks: RetryCallbacks = {
      onTakingLonger: callbacks?.onTakingLonger,
      onRetry: callbacks?.onHealthRetry,
    };

    context.log('🔄 Starting MinIO retry loop (3 attempts)...');
    const minioRetryResult = await executeWithRetry(
      minioServiceCall,
      {
        serviceName: 'MinIO Storage',
        maxRetries: RETRY.HEALTH_COUNT,
        takingLongerDelay: TIMEOUTS.TAKING_LONGER,
        attemptTimeout: TIMEOUTS.HEALTH,
        retryDelay: RETRY.HEALTH_DELAY,
        debug: debug,
      },
      minioCallbacks
    );

    if (minioRetryResult.success) {
      context.log('✅ MinIO became available after retry!');
      minioAvailable = true;
      health.minio = minioRetryResult.data || { status: 'healthy', responseTime: minioRetryResult.totalTime };
      health.overall = 'healthy';
    } else {
      context.log('❌ MinIO still unavailable after 3 retries → showing modal');
      const errorMsg = `MinIO storage is unavailable after ${RETRY.HEALTH_COUNT} retries. ${files?.length} file(s) cannot be uploaded.`;
      const workflowTotalTime = context.getElapsedFormatted();
      context.log(`⏱️  Total workflow time: ${workflowTotalTime}s`);
      wrappedCallbacks.onError?.(errorMsg, 'MINIO_UNAVAILABLE_WITH_FILES');
      return {
        success: false,
        error: errorMsg,
        errorCode: 'MINIO_UNAVAILABLE_WITH_FILES',
        totalTime: health.totalTime,
      };
    }
  }

  // Log MinIO status for clarity
  if (minioSkipped && !hasFiles) {
    // MinIO was intentionally skipped (no files to upload) - this is expected
    // No log needed - already shown as SKIPPED in health check results
  } else if (!minioAvailable && !hasFiles) {
    // MinIO is unhealthy but no files to upload - can continue
    context.log('⚠️ MinIO unhealthy - no files to upload, continuing without storage');
  }

  context.log('✅ Can proceed');

  // ─────────────────────────────────────────────────────────────────
  // STEP 1.5: PRE-DELETE VERIFICATION (DELETE only)
  // ─────────────────────────────────────────────────────────────────
  if (method === 'DELETE' && deleteVerification?.enabled) {
    context.logSection('STEP 1.5: PRE-DELETE VERIFICATION');
    await performPreDeleteVerification(
      baseUrl,
      deleteVerification,
      permissionLevel,
      callbacks?.onDataIntegrityIssue
    );
    // Note: We continue with delete even if issues found - the issue is logged
    // The delete operation will proceed to clean up what it can
  }

  // ─────────────────────────────────────────────────────────────────
  // STEP 1.7: CACHE LOOKUP (v4.0.0)
  // ─────────────────────────────────────────────────────────────────
  const { cache, optimisticUpdates } = config;

  if (cache?.enabled && !cache?.skipCache && method === 'GET') {
    context.logSection('STEP 1.7: CACHE LOOKUP');

    const cacheKey = cache.cacheKey ?? await workflowCache.generateKey(endpoint, method, data);
    context.log(`🔍 Cache key: ${cacheKey}`);

    const cachedData = workflowCache.get<TResult>(cacheKey);

    if (cachedData) {
      const ttl = cache.ttl || CACHE.DEFAULT_TTL;
      context.log(`✅ Cache HIT - returning cached response (TTL: ${ttl}ms)`);
      context.log(`⏱️  Total workflow time: ${context.getElapsedFormatted()}s`);
      context.logHeader('✅ WORKFLOW COMPLETE (from cache)');

      return {
        success: true,
        data: cachedData,
        statusCode: 200,
        verified: false, // Cached data not verified
        totalTime: health.totalTime,
      };
    }

    context.log(`❌ Cache MISS - proceeding with API call`);
  }

  // ─────────────────────────────────────────────────────────────────
  // STEP 1.8: OPTIMISTIC UPDATE (v4.0.0)
  // ─────────────────────────────────────────────────────────────────
  let rollbackFn: (() => void) | undefined;

  if (optimisticUpdates && callbacks?.onOptimisticUpdate) {
    context.logSection('STEP 1.8: OPTIMISTIC UPDATE');
    context.log(`📤 Triggering optimistic UI update BEFORE API call`);

    const result = wrappedCallbacks.onOptimisticUpdate?.(data);
    if (typeof result === 'function') {
      rollbackFn = result;
      context.log(`✅ Rollback function registered`);
    } else {
      context.log(`ℹ️  No rollback function provided`);
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // STEP 2: API CALL
  // ─────────────────────────────────────────────────────────────────
  context.logSection(`STEP 2: ${method} ${endpoint}`);

  const shouldSkipFiles = !minioAvailable;

  // Report health check complete, starting download phase
  if (callbacks?.onProgress) {
    callbacks.onProgress({
      phase: 'downloading',
      totalBytes: 0,
      downloadedBytes: 0,
      percentage: 0,
      totalKnown: false,
    });
  }

  const apiResult = await executeApiCall<TData, TResult>(
    baseUrl,
    endpoint,
    method,
    data,
    files,
    headers,
    permissionLevel,
    formDataRole,
    formDataFields,
    shouldSkipFiles,
    responseType,
    undefined, // signal - not used yet
    callbacks?.onProgress
  );

  if (!apiResult.success) {
    context.log(`❌ API failed: ${apiResult.error}`);

    // Rollback optimistic update if failed
    if (rollbackFn) {
      context.log(`🔄 Rolling back optimistic update`);
      rollbackFn();
    }

    wrappedCallbacks.onError?.(apiResult.error ?? 'Unknown API error', apiResult.errorCode ?? 'API_ERROR');
    return {
      success: false,
      error: apiResult.error,
      errorCode: apiResult.errorCode,
      statusCode: apiResult.httpStatus,
      totalTime: health.totalTime,
      // Pass through data and rawResponse for error handling (e.g., 409 lock conflict)
      data: apiResult.data,
      rawResponse: apiResult.rawResponse,
    };
  }

  const resultData = apiResult.data as TResult;
  const filesUploaded = !!(hasFiles && minioAvailable);

  context.log(`✅ ${method} successful`);
  context.log(`   Status: ${apiResult.httpStatus}`);
  context.log(`   Files uploaded: ${filesUploaded ? 'yes' : 'no'}`);

  // Cache successful GET responses
  if (cache?.enabled && !cache?.skipCache && method === 'GET' && apiResult.success && apiResult.data) {
    const cacheKey = cache.cacheKey ?? await workflowCache.generateKey(endpoint, method, data);
    const ttl = cache.ttl || CACHE.DEFAULT_TTL;
    workflowCache.set(cacheKey, apiResult.data, ttl);
    context.log(`💾 Cached response (key: ${cacheKey}, TTL: ${ttl}ms)`);
  }

  // ─────────────────────────────────────────────────────────────────
  // STEP 3: VERIFICATION (same as createIssueWorkflow)
  // ─────────────────────────────────────────────────────────────────
  let verificationResult: VerificationResult | undefined;

  if (verification?.enabled) {
    context.logSection('STEP 3: VERIFICATION');
    verificationResult = await performVerification(
      baseUrl,
      verification,
      resultData,
      data,
      permissionLevel,
      filesUploaded ? files : undefined,  // Only pass files if they were uploaded
      wrappedCallbacks.onVerificationRetry
    );
    // Note: performVerification already logs all details, no need to duplicate here
  }

  // ─────────────────────────────────────────────────────────────────
  // COMPLETE (same summary format as createIssueWorkflow)
  // ─────────────────────────────────────────────────────────────────
  const totalTime = health.totalTime;

  // Check if field verification failed (critical - data not saved correctly)
  const fieldsMatch = verificationResult?.fieldComparison?.allMatch ?? true; // true if no comparison done
  const sqlVerified = verificationResult?.sqlVerified ?? true; // true if verification disabled
  const attachmentsVerified = verificationResult?.attachmentsVerified ?? true; // true if no files
  const allVerified = sqlVerified && attachmentsVerified && fieldsMatch;

  context.logSection('📊 SUMMARY');
  context.log(`   Status:      ${apiResult.httpStatus}`);
  context.log(`   SQL:         ${verificationResult?.sqlVerified ? '✅ VERIFIED' : !verification?.enabled ? '⏭️ SKIPPED' : '❌ FAILED'}`);
  context.log(`   Fields:      ${verificationResult?.fieldComparison ? (fieldsMatch ? '✅' : '❌') + ` ${verificationResult.fieldComparison.matchCount}/${verificationResult.fieldComparison.totalCount}` : '➖ N/A'}`);
  context.log(`   MinIO:       ${!filesUploaded ? '➖ N/A (no files)' : attachmentsVerified ? '✅ VERIFIED' : '❌ FAILED'}`);

  // If verification failed (especially field mismatch), this is an error!
  if (verification?.enabled && !allVerified) {
    const errorDetails: string[] = [];
    if (!sqlVerified) errorDetails.push('SQL record not found');
    if (!fieldsMatch) errorDetails.push(`Fields mismatch (${verificationResult?.fieldComparison?.matchCount}/${verificationResult?.fieldComparison?.totalCount})`);
    if (!attachmentsVerified && filesUploaded) errorDetails.push('Attachments not verified');

    const errorMsg = `Verification failed: ${errorDetails.join(', ')}`;
    context.log(`❌ ${errorMsg}`);

    // Log total workflow time
    const workflowTotalTime = context.getElapsedFormatted();
    context.log(`⏱️  Total workflow time: ${workflowTotalTime}s`);

    context.logHeader('❌ WORKFLOW FAILED (VERIFICATION)');

    wrappedCallbacks.onError?.(errorMsg, 'VERIFICATION_FAILED');

    return {
      success: false,
      data: resultData, // Still return data for debugging
      error: errorMsg,
      errorCode: 'VERIFICATION_FAILED',
      statusCode: apiResult.httpStatus,
      filesUploaded,
      verified: false,
      totalTime,
    };
  }

  // Log total workflow time
  const workflowTotalTime = context.getElapsedFormatted();
  context.log(`⏱️  Total workflow time: ${workflowTotalTime}s`);

  context.logHeader('✅ WORKFLOW COMPLETE');

  // Call success callback
  wrappedCallbacks.onSuccess?.(resultData);

  return {
    success: true,
    data: resultData,
    statusCode: apiResult.httpStatus,
    filesUploaded,
    verified: allVerified,
    totalTime,
  };
}

// ============================================================
// ERROR MESSAGES
// ============================================================

/**
 * Get user-friendly error message for workflow error code.
 *
 * Converts technical error codes to localized Slovak error messages
 * for display in the UI.
 *
 * @param errorCode - Standardized workflow error code
 * @returns Localized Slovak error message
 *
 * @example
 * ```typescript
 * const result = await serviceWorkflow({ ... });
 * if (!result.success && result.errorCode) {
 *   const message = getErrorMessage(result.errorCode);
 *   showToast({ type: 'error', message }); // "Služba je nedostupná"
 * }
 * ```
 */
export function getErrorMessage(errorCode: ServiceWorkflowErrorCode): string {
  switch (errorCode) {
    case 'SERVICE_DOWN':
      return 'Služba je nedostupná';
    case 'SQL_DOWN':
      return 'Databáza je nedostupná';
    case 'MINIO_UNAVAILABLE':
      return 'Súborové úložisko je nedostupné';
    case 'MINIO_UNAVAILABLE_WITH_FILES':
      return 'Súborové úložisko je nedostupné (požadované pre súbory)';
    case 'NOT_FOUND':
      return 'Záznam nebol najdený';
    case 'PERMISSION_DENIED':
      return 'Nedostatočné oprávnenia';
    case 'VALIDATION_ERROR':
      return 'Neplatné údaje';
    case 'CONFLICT':
      return 'Konflikt pri ukladaní';
    case 'API_ERROR':
      return 'Chyba API';
    case 'NETWORK_ERROR':
      return 'Chyba pripojenia';
    case 'VERIFICATION_FAILED':
      return 'Overenie zlyhalo';
    default:
      return 'Neznáma chyba';
  }
}

/**
 * Clear health check cache (for compatibility)
 */
export function clearHealthCheckCache(): void {
  // No-op - cache removed in v3.0.0 for simplicity
}
