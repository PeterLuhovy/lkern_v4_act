/*
 * ================================================================
 * FILE: createIssueWorkflow.ts
 * PATH: /apps/web-ui/src/services/issueWorkflow/createIssueWorkflow.ts
 * DESCRIPTION: Standalone workflow for creating issues with health checks,
 *              validation, verification and comprehensive debug logging.
 *              This module is UI-agnostic - returns results for UI to handle.
 * VERSION: v1.7.0
 * CREATED: 2025-11-30
 * UPDATED: 2025-11-30
 * CHANGELOG:
 *   v1.7.0 - Added 3x retry logic for MinIO when user has files (before showing modal)
 *   v1.6.0 - Return MINIO_UNAVAILABLE_WITH_FILES when MinIO down + user has files (show modal)
 *   v1.5.0 - Fixed: call /health ONCE instead of twice (SQL+MinIO in single response)
 *   v1.4.0 - Refactored to use universal executeWithRetry utility from @l-kern/config
 *   v1.3.0 - Improved retry timing: 2s→"taking longer", 3s→retry1, then 5s intervals (3 retries)
 *   v1.2.0 - Added automatic retry logic for health check (5x with 2s delay)
 * ================================================================
 */

import { executeWithRetry, type ServiceCallResult, type RetryCallbacks } from '@l-kern/config';

// ============================================================
// TYPES
// ============================================================

export interface CreateIssueInput {
  title: string;
  description: string;
  type: string;
  severity?: string | null;
  category?: string | null;
  priority?: string | null;
  error_message?: string | null;
  error_type?: string | null;
  system_info?: string | null;
  attachments?: File[];
}

export interface UserContext {
  permissionLevel: string;
  backendRole: string;
}

export interface ServiceHealth {
  status: 'healthy' | 'unhealthy' | 'unknown';
  responseTime?: number;
  error?: string;
}

export interface HealthCheckResult {
  issuesService: ServiceHealth;
  sql: ServiceHealth;
  minio: ServiceHealth;
  overall: 'healthy' | 'degraded' | 'unhealthy';
  totalTime: number;
}

export interface CreatedIssue {
  id: string;
  issue_code: string;
  title: string;
  attachments?: Array<{
    file_name: string;
    file_path: string;
    file_size: number;
    content_type: string;
  }>;
}

export interface FieldComparisonResult {
  field: string;
  sent: unknown;
  saved: unknown;
  match: boolean;
}

export interface AttachmentVerificationResult {
  fileName: string;
  available: boolean;
  expectedSize?: number;
  actualSize?: number;
  sizeMatch?: boolean;
}

export interface VerificationResult {
  sqlVerified: boolean;
  attachmentsVerified: boolean;
  attachmentResults?: AttachmentVerificationResult[];
  fieldComparison?: {
    results: FieldComparisonResult[];
    matchCount: number;
    totalCount: number;
    allMatch: boolean;
  };
  verificationTime: number;
}

export type WorkflowErrorCode =
  | 'SERVICE_DOWN'
  | 'SQL_DOWN'
  | 'MINIO_DOWN'
  | 'MINIO_UNAVAILABLE_WITH_FILES'
  | 'API_ERROR'
  | 'VALIDATION_ERROR'
  | 'NETWORK_ERROR';

export interface CreateIssueResult {
  success: boolean;
  issue?: CreatedIssue;
  error?: string;
  errorCode?: WorkflowErrorCode;
  httpStatus?: number;
  minioAvailable: boolean;
  filesUploaded: boolean;
  healthCheck: HealthCheckResult | null;
  verification?: VerificationResult;
  apiResponse?: unknown;
}

export interface WorkflowOptions {
  skipFiles?: boolean;
  skipVerification?: boolean;
  debug?: boolean;
  /** Name of the calling component/function for debug logs */
  caller?: string;
  /** Callback called immediately when ping succeeds (service is alive) */
  onServiceAlive?: () => void;
  /** Callback called when service is down (ping failed) */
  onServiceDown?: () => void;
  /** Callback called when full health check is taking longer than expected */
  onTakingLonger?: () => void;
  /** Callback called on each health check retry (for UI feedback like toasts) */
  onHealthRetry?: (attempt: number, maxAttempts: number) => void;
}

// ============================================================
// CONFIGURATION
// ============================================================

const API_BASE_URL = 'http://localhost:4105';
const PING_TIMEOUT = 5000;    // 5s - timeout for each ping attempt
const HEALTH_TIMEOUT = 10000; // 10s - full health check (backend has 5s MinIO timeout)
const VERIFY_TIMEOUT = 5000;

// Automatic retry configuration (using universal executeWithRetry)
const HEALTH_RETRY_COUNT = 3;         // Number of automatic retries
const HEALTH_RETRY_DELAY = 5000;      // 5s delay between retry attempts
const TAKING_LONGER_DELAY = 1500;     // 1.5s - if no response, show "taking longer" toast

// ============================================================
// DEBUG LOGGING
// ============================================================

let debugEnabled = true;

function log(message: string, data?: unknown) {
  if (!debugEnabled) return;
  if (data !== undefined) {
    console.log(`[IssueWorkflow] ${message}`, data);
  } else {
    console.log(`[IssueWorkflow] ${message}`);
  }
}

function logSection(title: string) {
  if (!debugEnabled) return;
  console.log('───────────────────────────────────────────────────────────────');
  console.log(`[IssueWorkflow] ${title}`);
  console.log('───────────────────────────────────────────────────────────────');
}

function logHeader(title: string) {
  if (!debugEnabled) return;
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`[IssueWorkflow] ${title}`);
  console.log('═══════════════════════════════════════════════════════════════');
}

// ============================================================
// STEP 1: HEALTH CHECK
// ============================================================

/**
 * Quick ping to check if Issues Service is alive (no dependency checks).
 * Returns immediately - use for instant UI feedback.
 */
export async function performPing(): Promise<{ alive: boolean; responseTime: number }> {
  const startTime = performance.now();
  log('Pinging Issues Service...');

  try {
    const response = await fetch(`${API_BASE_URL}/ping`, {
      method: 'GET',
      signal: AbortSignal.timeout(PING_TIMEOUT),
    });

    const responseTime = Math.round(performance.now() - startTime);
    const alive = response.ok;

    log(`Ping result: ${alive ? '✅ alive' : '❌ not responding'} (${responseTime}ms)`);
    return { alive, responseTime };
  } catch (error) {
    const responseTime = Math.round(performance.now() - startTime);
    log(`Ping failed: ${error instanceof Error ? error.message : 'Unknown error'} (${responseTime}ms)`);
    return { alive: false, responseTime };
  }
}

export async function performHealthCheck(): Promise<HealthCheckResult> {
  const startTime = performance.now();
  log('Checking backend health...');

  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(HEALTH_TIMEOUT),
    });

    // Parse response body even for non-200 status codes
    // The service IS running if we got a response (even 503)
    let data: any = {};
    try {
      data = await response.json();
    } catch {
      // If JSON parsing fails, we still know service responded
    }

    const totalTime = Math.round(performance.now() - startTime);

    // Service is healthy if it responded (regardless of HTTP status)
    // Dependencies (SQL, MinIO) status comes from response body
    return {
      issuesService: { status: 'healthy', responseTime: totalTime },
      sql: {
        status: data.dependencies?.sql?.status === 'healthy' ? 'healthy' : 'unhealthy',
        responseTime: data.dependencies?.sql?.responseTime || 0,
        error: data.dependencies?.sql?.error,
      },
      minio: {
        status: data.dependencies?.minio?.status === 'healthy' ? 'healthy' : 'unhealthy',
        responseTime: data.dependencies?.minio?.responseTime || 0,
        error: data.dependencies?.minio?.error,
      },
      overall: data.status || 'unhealthy',
      totalTime,
    };
  } catch (error) {
    const totalTime = Math.round(performance.now() - startTime);
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';

    return {
      issuesService: { status: 'unhealthy', responseTime: totalTime, error: errorMsg },
      sql: { status: 'unknown' },
      minio: { status: 'unknown' },
      overall: 'unhealthy',
      totalTime,
    };
  }
}

/**
 * Perform health check with automatic retries using universal retry utility.
 *
 * Flow:
 * 1. Ping Issues Service with retry
 * 2. Check SQL with retry
 * 3. Check MinIO with retry
 *
 * Each step has its own retry logic:
 * - 1s → "taking longer" toast
 * - 5s timeout per attempt
 * - 5s between retries
 * - 3 max retries
 *
 * @param onServiceAlive Callback when ping succeeds (instant feedback)
 * @param onServiceDown Callback when all retries fail for any service
 * @param onTakingLonger Callback when check is taking longer (after 1s)
 * @param onRetry Callback on each retry attempt
 * @returns Final health check result after all retries
 */
async function performHealthCheckWithRetry(
  onServiceAlive?: () => void,
  onServiceDown?: () => void,
  onTakingLonger?: () => void,
  onRetry?: (attempt: number, maxAttempts: number) => void
): Promise<HealthCheckResult> {
  const overallStartTime = performance.now();

  // ─────────────────────────────────────────────────────────────────
  // STEP 1: Ping Issues Service
  // ─────────────────────────────────────────────────────────────────
  const pingServiceCall = async (): Promise<ServiceCallResult<{ alive: boolean }>> => {
    const startTime = performance.now();
    try {
      const response = await fetch(`${API_BASE_URL}/ping`, { method: 'GET' });
      const responseTime = Math.round(performance.now() - startTime);
      return {
        success: response.ok,
        data: { alive: response.ok },
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

  const pingCallbacks: RetryCallbacks = {
    onTakingLonger,
    onRetry,
    onSuccess: onServiceAlive,
    onAllRetriesFailed: onServiceDown,
  };

  const pingResult = await executeWithRetry(
    pingServiceCall,
    {
      serviceName: 'Issues Service',
      maxRetries: HEALTH_RETRY_COUNT,
      takingLongerDelay: TAKING_LONGER_DELAY,
      attemptTimeout: PING_TIMEOUT,
      retryDelay: HEALTH_RETRY_DELAY,
      debug: debugEnabled,
    },
    pingCallbacks
  );

  if (!pingResult.success) {
    log('❌ Issues Service is not responding after all retries');
    return {
      issuesService: { status: 'unhealthy', responseTime: pingResult.totalTime, error: pingResult.error },
      sql: { status: 'unknown' },
      minio: { status: 'unknown' },
      overall: 'unhealthy',
      totalTime: pingResult.totalTime,
    };
  }

  log('✅ Issues Service is alive');

  // ─────────────────────────────────────────────────────────────────
  // STEP 2: Check Dependencies (SQL + MinIO in ONE call)
  // ─────────────────────────────────────────────────────────────────
  // Backend /health returns both SQL and MinIO status in single response
  // No need to call twice - just parse both from same response

  interface HealthResponse {
    sql: ServiceHealth;
    minio: ServiceHealth;
  }

  const healthServiceCall = async (): Promise<ServiceCallResult<HealthResponse>> => {
    const startTime = performance.now();
    try {
      const response = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
      const responseTime = Math.round(performance.now() - startTime);
      const data = await response.json();

      const sqlStatus = data.dependencies?.sql?.status === 'healthy' ? 'healthy' : 'unhealthy';
      const minioStatus = data.dependencies?.minio?.status === 'healthy' ? 'healthy' : 'unhealthy';

      // Success = SQL is healthy (MinIO is optional)
      return {
        success: sqlStatus === 'healthy',
        data: {
          sql: {
            status: sqlStatus,
            responseTime: data.dependencies?.sql?.responseTime || responseTime,
            error: data.dependencies?.sql?.error,
          },
          minio: {
            status: minioStatus,
            responseTime: data.dependencies?.minio?.responseTime || responseTime,
            error: data.dependencies?.minio?.error,
          },
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

  const healthCallbacks: RetryCallbacks = {
    onTakingLonger,
    onRetry,
    onAllRetriesFailed: onServiceDown,
  };

  log('🔍 Checking dependencies (SQL + MinIO)...');
  const healthResult = await executeWithRetry(
    healthServiceCall,
    {
      serviceName: 'Dependencies',
      maxRetries: HEALTH_RETRY_COUNT,
      takingLongerDelay: TAKING_LONGER_DELAY,
      attemptTimeout: HEALTH_TIMEOUT,  // 10s - backend has 5s MinIO timeout
      retryDelay: HEALTH_RETRY_DELAY,
      debug: debugEnabled,
    },
    healthCallbacks
  );

  // Parse results
  const sqlHealth: ServiceHealth = healthResult.data?.sql
    ?? { status: 'unhealthy', responseTime: healthResult.totalTime, error: healthResult.error };

  const minioHealth: ServiceHealth = healthResult.data?.minio
    ?? { status: 'unhealthy', responseTime: healthResult.totalTime, error: healthResult.error };

  if (sqlHealth.status === 'healthy') {
    log('✅ SQL Database is healthy');
  } else {
    log(`❌ SQL Database is unhealthy: ${sqlHealth.error}`);
  }

  if (minioHealth.status === 'healthy') {
    log('✅ MinIO Storage is healthy');
  } else {
    log(`⚠️ MinIO Storage is unavailable: ${minioHealth.error} (optional - continuing)`);
  }

  // ─────────────────────────────────────────────────────────────────
  // Return combined result
  // ─────────────────────────────────────────────────────────────────
  const totalTime = Math.round(performance.now() - overallStartTime);
  const overall = sqlHealth.status === 'healthy'
    ? (minioHealth.status === 'healthy' ? 'healthy' : 'degraded')
    : 'unhealthy';

  return {
    issuesService: { status: 'healthy', responseTime: pingResult.totalTime },
    sql: sqlHealth,
    minio: minioHealth,
    overall,
    totalTime,
  };
}

// ============================================================
// STEP 2: CREATE ISSUE API CALL
// ============================================================

interface ApiResult {
  success: boolean;
  data?: CreatedIssue;
  error?: string;
  errorCode?: WorkflowErrorCode;
  httpStatus?: number;
  rawResponse?: unknown;
}

async function callCreateIssueApi(
  input: CreateIssueInput,
  userContext: UserContext,
  skipFiles: boolean
): Promise<ApiResult> {
  const hasFiles = !skipFiles && input.attachments && input.attachments.length > 0;

  // Build JSON data object (matching backend expected format)
  const jsonData = {
    title: input.title,
    description: input.description,
    type: input.type,
    severity: input.severity || null,
    category: input.category || null,
    priority: input.priority || null,
    error_message: input.error_message || null,
    error_type: input.error_type || null,
    system_info: input.system_info || null,
  };

  // Prepare FormData
  const formData = new FormData();
  formData.append('data', JSON.stringify(jsonData));
  formData.append('role', userContext.backendRole);

  // Add files
  if (hasFiles && input.attachments) {
    for (const file of input.attachments) {
      formData.append('files', file);
      log(`   Added file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    }
  }

  try {
    log(`POST ${API_BASE_URL}/issues/`);
    const response = await fetch(`${API_BASE_URL}/issues/`, {
      method: 'POST',
      body: formData,
    });

    let responseData: unknown;
    try {
      responseData = await response.json();
    } catch {
      responseData = { message: response.statusText };
    }

    log(`Response: ${response.status}`);

    if (!response.ok) {
      const detail = (responseData as { detail?: { error?: string } | string })?.detail;

      // MinIO unavailable (503)
      if (response.status === 503 && typeof detail === 'object' && detail?.error === 'minio_unavailable') {
        return {
          success: false,
          error: 'MinIO storage is unavailable',
          errorCode: 'MINIO_UNAVAILABLE_WITH_FILES',
          httpStatus: 503,
          rawResponse: responseData,
        };
      }

      // Server error
      if (response.status >= 500) {
        return {
          success: false,
          error: typeof detail === 'string' ? detail : 'Service error',
          errorCode: 'API_ERROR',
          httpStatus: response.status,
          rawResponse: responseData,
        };
      }

      // Client error
      return {
        success: false,
        error: typeof detail === 'string' ? detail : `API returned ${response.status}`,
        errorCode: 'VALIDATION_ERROR',
        httpStatus: response.status,
        rawResponse: responseData,
      };
    }

    return {
      success: true,
      data: responseData as CreatedIssue,
      httpStatus: response.status,
      rawResponse: responseData,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: errorMsg,
      errorCode: 'NETWORK_ERROR',
    };
  }
}

// ============================================================
// STEP 3: VERIFICATION
// ============================================================

async function verifyCreatedIssue(
  issueId: string,
  expectedAttachments: number,
  permissionLevel: string,
  originalInput: CreateIssueInput
): Promise<VerificationResult> {
  const startTime = performance.now();

  let sqlVerified = false;
  let attachmentsVerified = expectedAttachments === 0; // true if no files expected
  const attachmentResults: AttachmentVerificationResult[] = [];
  let fieldComparison: VerificationResult['fieldComparison'] = undefined;

  // ─────────────────────────────────────────────────────────────────
  // VERIFY SQL RECORD EXISTS
  // ─────────────────────────────────────────────────────────────────
  log(`📋 Verifying SQL record: ${issueId}`);
  log(`   Using permission level: ${permissionLevel}`);

  try {
    const response = await fetch(`${API_BASE_URL}/issues/${issueId}`, {
      method: 'GET',
      headers: {
        'X-Permission-Level': permissionLevel,
      },
      signal: AbortSignal.timeout(VERIFY_TIMEOUT),
    });

    if (response.ok) {
      sqlVerified = true;
      const issue = await response.json();
      log(`   SQL Record: ✅ EXISTS in database`);
      log(`   Issue Code: ${issue.issue_code || '(unknown)'}`);

      // ─────────────────────────────────────────────────────────────────
      // COMPARE FIELDS (sent vs saved)
      // ─────────────────────────────────────────────────────────────────
      log(`🔍 Field comparison (sent vs saved):`);

      const fieldsToCompare: Array<{ field: string; sent: unknown; saved: unknown }> = [
        { field: 'title', sent: originalInput.title, saved: issue.title },
        { field: 'description', sent: originalInput.description, saved: issue.description },
        { field: 'type', sent: originalInput.type, saved: issue.type },
        { field: 'severity', sent: originalInput.severity || null, saved: issue.severity },
        { field: 'category', sent: originalInput.category || null, saved: issue.category },
        { field: 'priority', sent: originalInput.priority || null, saved: issue.priority },
        { field: 'error_message', sent: originalInput.error_message || null, saved: issue.error_message },
        { field: 'error_type', sent: originalInput.error_type || null, saved: issue.error_type },
      ];

      const comparisonResults: FieldComparisonResult[] = [];

      for (const { field, sent, saved } of fieldsToCompare) {
        // Normalize for comparison (handle null/undefined/empty string)
        const normalizedSent = sent === undefined || sent === '' ? null : sent;
        const normalizedSaved = saved === undefined || saved === '' ? null : saved;
        const match = normalizedSent === normalizedSaved;

        comparisonResults.push({ field, sent: normalizedSent, saved: normalizedSaved, match });

        // Format values for logging
        const sentStr = normalizedSent === null ? 'null' : `"${String(normalizedSent).substring(0, 30)}${String(normalizedSent).length > 30 ? '...' : ''}"`;
        const savedStr = normalizedSaved === null ? 'null' : `"${String(normalizedSaved).substring(0, 30)}${String(normalizedSaved).length > 30 ? '...' : ''}"`;

        if (match) {
          log(`   [✅] ${field.padEnd(14)} ${sentStr}`);
        } else {
          log(`   [❌] ${field.padEnd(14)} sent: ${sentStr}`);
          log(`                        saved: ${savedStr}`);
        }
      }

      const matchCount = comparisonResults.filter(r => r.match).length;
      const totalCount = comparisonResults.length;
      const allMatch = matchCount === totalCount;

      fieldComparison = {
        results: comparisonResults,
        matchCount,
        totalCount,
        allMatch,
      };

      log(`   Field Result: ${allMatch ? '✅' : '⚠️'} ${matchCount}/${totalCount} fields match`);

      // ─────────────────────────────────────────────────────────────────
      // VERIFY MINIO ATTACHMENTS
      // ─────────────────────────────────────────────────────────────────
      log(`   Attachments in response: ${issue.attachments?.length || 0}`);

      if (expectedAttachments > 0) {
        log(`📎 Verifying MinIO attachments (expected: ${expectedAttachments})...`);

        // Build map of original file sizes for comparison
        const originalFileSizes = new Map<string, number>();
        if (originalInput.attachments) {
          for (const file of originalInput.attachments) {
            originalFileSizes.set(file.name, file.size);
          }
        }

        if (issue.attachments && issue.attachments.length > 0) {
          for (const att of issue.attachments) {
            try {
              const attResponse = await fetch(
                `${API_BASE_URL}/issues/${issueId}/attachments/${att.file_name}`,
                { method: 'HEAD', signal: AbortSignal.timeout(3000) }
              );
              const available = attResponse.ok;

              // Use file_size from database (backend response), NOT Content-Length from HEAD
              // Content-Length from HEAD is unreliable (may be API wrapper size, not actual file)
              const actualSize = att.file_size || undefined;
              const expectedSize = originalFileSizes.get(att.file_name);
              const sizeMatch = expectedSize !== undefined && actualSize !== undefined ? expectedSize === actualSize : undefined;

              attachmentResults.push({
                fileName: att.file_name,
                available,
                expectedSize,
                actualSize,
                sizeMatch,
              });

              // Format size for logging
              const formatSize = (bytes?: number) => bytes !== undefined ? `${(bytes / 1024).toFixed(1)} KB` : '?';

              if (available) {
                if (sizeMatch === true) {
                  log(`   [✅] ${att.file_name} (${formatSize(actualSize)}) ✅ size match`);
                } else if (sizeMatch === false) {
                  log(`   [⚠️] ${att.file_name} - size mismatch! DB: ${formatSize(actualSize)}, Sent: ${formatSize(expectedSize)}`);
                } else {
                  log(`   [✅] ${att.file_name} (${formatSize(actualSize)}) - size check skipped`);
                }
              } else {
                log(`   [❌] ${att.file_name} - NOT FOUND in MinIO`);
              }
            } catch (err) {
              attachmentResults.push({ fileName: att.file_name, available: false });
              log(`   [❌] ${att.file_name} (error: ${err instanceof Error ? err.message : 'unknown'})`);
            }
          }

          // All files must be available AND sizes must match (if checkable)
          const allAvailable = attachmentResults.every(r => r.available);
          const allSizesMatch = attachmentResults.every(r => r.sizeMatch !== false); // undefined is OK
          attachmentsVerified = allAvailable && allSizesMatch;

          log(`   MinIO Result: ${attachmentsVerified ? '✅ ALL FILES VERIFIED' : '❌ VERIFICATION FAILED'}`);
          if (!allAvailable) log(`      - Some files not accessible`);
          if (!allSizesMatch) log(`      - Some file sizes don't match`);
        } else {
          log(`   ⚠️ WARNING: Expected ${expectedAttachments} attachments but API returned 0`);
          log(`   (Backend GET /issues/{id} may not include attachments array)`);
          attachmentsVerified = false; // Can't verify - mark as failed
        }
      } else {
        log(`📎 MinIO: No attachments to verify (none uploaded)`);
      }
    } else {
      log(`   SQL Record: ❌ NOT FOUND (status ${response.status})`);
    }
  } catch (error) {
    log(`   ❌ Verification error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }

  const verificationTime = Math.round(performance.now() - startTime);
  log(`⏱️ Verification completed in ${verificationTime}ms`);

  return {
    sqlVerified,
    attachmentsVerified,
    attachmentResults: attachmentResults.length > 0 ? attachmentResults : undefined,
    fieldComparison,
    verificationTime,
  };
}

// ============================================================
// MAIN WORKFLOW
// ============================================================

/**
 * Execute the complete issue creation workflow.
 *
 * Steps:
 * 1. Health check (Issues Service, SQL, MinIO)
 * 2. Create issue via API
 * 3. Verify created record (optional)
 *
 * Returns comprehensive result - UI handles toasts/modals based on result.
 *
 * @example
 * ```ts
 * const result = await createIssueWorkflow(
 *   { title: 'Bug', description: 'Details', type: 'bug', attachments: files },
 *   { permissionLevel: 'developer', backendRole: 'developer' }
 * );
 *
 * if (result.success) {
 *   toast.success(`Created: ${result.issue?.issue_code}`);
 * } else if (result.errorCode === 'MINIO_UNAVAILABLE_WITH_FILES') {
 *   showCreateWithoutFilesDialog();
 * } else if (result.errorCode === 'SQL_DOWN') {
 *   toast.error('Database unavailable');
 * } else {
 *   toast.error(result.error);
 * }
 * ```
 */
export async function createIssueWorkflow(
  input: CreateIssueInput,
  userContext: UserContext,
  options: WorkflowOptions = {}
): Promise<CreateIssueResult> {
  const { skipFiles = false, skipVerification = false, debug = true, caller = 'unknown' } = options;

  debugEnabled = debug;
  const hasFiles = input.attachments && input.attachments.length > 0;
  const timestamp = new Date().toISOString();

  // ─────────────────────────────────────────────────────────────────
  // START
  // ─────────────────────────────────────────────────────────────────
  logHeader('🚀 CREATE ISSUE WORKFLOW');

  logSection('📌 WORKFLOW CONTEXT');
  log(`   Timestamp:   ${timestamp}`);
  log(`   Caller:      ${caller}`);
  log(`   Debug Mode:  ${debug ? 'ON' : 'OFF'}`);

  logSection('👤 USER CONTEXT');
  log(`   Permission Level: ${userContext.permissionLevel}`);
  log(`   Backend Role:     ${userContext.backendRole}`);

  logSection('📝 ISSUE DATA (ALL FIELDS)');
  log(`   title:         "${input.title}"`);
  log(`   description:   "${input.description?.substring(0, 100)}${(input.description?.length || 0) > 100 ? '...' : ''}" (${input.description?.length || 0} chars)`);
  log(`   type:          ${input.type}`);
  log(`   severity:      ${input.severity || '(not set)'}`);
  log(`   category:      ${input.category || '(not set)'}`);
  log(`   priority:      ${input.priority || '(not set)'}`);
  log(`   error_message: ${input.error_message ? `"${input.error_message.substring(0, 50)}..."` : '(not set)'}`);
  log(`   error_type:    ${input.error_type || '(not set)'}`);
  log(`   system_info:   ${input.system_info ? JSON.stringify(input.system_info).substring(0, 100) + '...' : '(not set)'}`);
  log(`   attachments:   ${hasFiles ? `${input.attachments?.length} file(s)` : 'none'}`);
  if (hasFiles && input.attachments) {
    input.attachments.forEach((f, i) => log(`      [${i + 1}] ${f.name} (${(f.size / 1024).toFixed(1)} KB, ${f.type})`));
  }

  // ─────────────────────────────────────────────────────────────────
  // STEP 1: HEALTH CHECK (with automatic retry)
  // ─────────────────────────────────────────────────────────────────
  logSection('STEP 1: HEALTH CHECK');
  log(`   Automatic retry: up to ${HEALTH_RETRY_COUNT}x (${TAKING_LONGER_DELAY}ms→"taking longer", ${PING_TIMEOUT}ms timeout, ${HEALTH_RETRY_DELAY}ms between)`);

  const health = await performHealthCheckWithRetry(
    options.onServiceAlive,
    options.onServiceDown,
    options.onTakingLonger,
    options.onHealthRetry
  );

  logSection('🏥 RESULTS');
  log(`   Issues Service: ${health.issuesService.status === 'healthy' ? '✅' : '❌'} ${health.issuesService.status} (${health.issuesService.responseTime}ms)`);
  log(`   SQL Database:   ${health.sql.status === 'healthy' ? '✅' : health.sql.status === 'unknown' ? '❓' : '❌'} ${health.sql.status} (${health.sql.responseTime || 0}ms)${health.sql.error ? ` [${health.sql.error}]` : ''}`);
  log(`   MinIO Storage:  ${health.minio.status === 'healthy' ? '✅' : health.minio.status === 'unknown' ? '❓' : '❌'} ${health.minio.status} (${health.minio.responseTime || 0}ms)${health.minio.error ? ` [${health.minio.error}]` : ''}`);
  log(`   Overall: ${health.overall.toUpperCase()}`);

  // Check critical services
  if (health.issuesService.status !== 'healthy') {
    log('❌ Issues Service down - cannot proceed');
    return {
      success: false,
      error: 'Issues Service is not available',
      errorCode: 'SERVICE_DOWN',
      minioAvailable: false,
      filesUploaded: false,
      healthCheck: health,
    };
  }

  if (health.sql.status !== 'healthy') {
    log('❌ SQL Database down - cannot proceed');
    return {
      success: false,
      error: 'Database is not available',
      errorCode: 'SQL_DOWN',
      minioAvailable: false,
      filesUploaded: false,
      healthCheck: health,
    };
  }

  let minioAvailable = health.minio.status === 'healthy';

  // If MinIO is down AND user has files AND skipFiles is false → retry MinIO 3x before showing modal
  if (!minioAvailable && hasFiles && !skipFiles) {
    log('⚠️ MinIO down + user has files → retrying MinIO check...');

    // MinIO-specific retry (user has files, so MinIO is required)
    const minioServiceCall = async (): Promise<ServiceCallResult<ServiceHealth>> => {
      const startTime = performance.now();
      try {
        const response = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
        const responseTime = Math.round(performance.now() - startTime);
        const data = await response.json();

        const minioStatus = data.dependencies?.minio?.status === 'healthy' ? 'healthy' : 'unhealthy';
        return {
          success: minioStatus === 'healthy',
          data: {
            status: minioStatus,
            responseTime: data.dependencies?.minio?.responseTime || responseTime,
            error: data.dependencies?.minio?.error,
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
      onTakingLonger: options.onTakingLonger,
      onRetry: options.onHealthRetry,
    };

    log('🔄 Starting MinIO retry loop (3 attempts)...');
    const minioRetryResult = await executeWithRetry(
      minioServiceCall,
      {
        serviceName: 'MinIO Storage',
        maxRetries: HEALTH_RETRY_COUNT,
        takingLongerDelay: TAKING_LONGER_DELAY,
        attemptTimeout: HEALTH_TIMEOUT,
        retryDelay: HEALTH_RETRY_DELAY,
        debug: debugEnabled,
      },
      minioCallbacks
    );

    if (minioRetryResult.success) {
      log('✅ MinIO became available after retry!');
      minioAvailable = true;
      // Update health result
      health.minio = minioRetryResult.data || { status: 'healthy', responseTime: minioRetryResult.totalTime };
      health.overall = 'healthy';
    } else {
      log('❌ MinIO still unavailable after 3 retries → showing modal');
      return {
        success: false,
        error: `MinIO storage is unavailable after ${HEALTH_RETRY_COUNT} retries. ${input.attachments?.length} file(s) cannot be uploaded.`,
        errorCode: 'MINIO_UNAVAILABLE_WITH_FILES',
        minioAvailable: false,
        filesUploaded: false,
        healthCheck: health,
      };
    }
  }

  if (!minioAvailable) {
    log('⚠️ MinIO down - no files to upload, continuing');
  }

  log('✅ Can proceed');

  // ─────────────────────────────────────────────────────────────────
  // STEP 2: CREATE ISSUE
  // ─────────────────────────────────────────────────────────────────
  logSection('STEP 2: CREATE ISSUE');

  const shouldSkipFiles = skipFiles || !minioAvailable;
  const apiResult = await callCreateIssueApi(input, userContext, shouldSkipFiles);

  if (!apiResult.success) {
    log(`❌ API failed: ${apiResult.error}`);
    return {
      success: false,
      error: apiResult.error,
      errorCode: apiResult.errorCode,
      httpStatus: apiResult.httpStatus,
      minioAvailable,
      filesUploaded: false,
      healthCheck: health,
      apiResponse: apiResult.rawResponse,
    };
  }

  const issue = apiResult.data!;
  const filesUploaded = !!(hasFiles && minioAvailable && !skipFiles);

  log(`✅ Created: ${issue.issue_code}`);
  log(`   ID: ${issue.id}`);
  log(`   Files uploaded: ${filesUploaded ? 'yes' : 'no'}`);

  // ─────────────────────────────────────────────────────────────────
  // STEP 3: VERIFICATION
  // ─────────────────────────────────────────────────────────────────
  let verification: VerificationResult | undefined;

  if (!skipVerification) {
    logSection('STEP 3: VERIFICATION');
    verification = await verifyCreatedIssue(
      issue.id,
      filesUploaded ? (input.attachments?.length || 0) : 0,
      userContext.permissionLevel,
      input
    );
    // Note: verifyCreatedIssue already logs all details, no need to duplicate here
  }

  // ─────────────────────────────────────────────────────────────────
  // COMPLETE
  // ─────────────────────────────────────────────────────────────────
  logSection('📊 SUMMARY');
  log(`   Issue Code:  ${issue.issue_code}`);
  log(`   SQL:         ${verification?.sqlVerified ? '✅ VERIFIED' : skipVerification ? '⏭️ SKIPPED' : '❌ FAILED'}`);
  log(`   Fields:      ${verification?.fieldComparison ? (verification.fieldComparison.allMatch ? '✅' : '⚠️') + ` ${verification.fieldComparison.matchCount}/${verification.fieldComparison.totalCount}` : '➖ N/A'}`);
  log(`   MinIO:       ${!filesUploaded ? '➖ N/A (no files)' : verification?.attachmentsVerified ? '✅ VERIFIED' : '❌ FAILED'}`);
  logHeader('✅ WORKFLOW COMPLETE');

  return {
    success: true,
    issue,
    minioAvailable,
    filesUploaded,
    healthCheck: health,
    verification,
    apiResponse: apiResult.rawResponse,
  };
}
