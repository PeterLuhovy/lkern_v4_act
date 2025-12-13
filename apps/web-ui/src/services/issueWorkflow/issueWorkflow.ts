/*
 * ================================================================
 * FILE: issueWorkflow.ts
 * PATH: /apps/web-ui/src/services/issueWorkflow/issueWorkflow.ts
 * DESCRIPTION: Universal workflow for issue operations (create/update)
 *              with health checks, retry logic and comprehensive logging.
 *              Configurable endpoint, method, and health checks via parameters.
 * VERSION: v1.1.0
 * CREATED: 2025-12-01
 * UPDATED: 2025-12-03
 * CHANGELOG:
 *   v1.1.0 - Use SERVICE_ENDPOINTS from @l-kern/config (supports Docker/localhost)
 *   v1.0.0 - Universal workflow replacing separate create/update workflows
 * ================================================================
 */

import { executeWithRetry, type ServiceCallResult, type RetryCallbacks, SERVICE_ENDPOINTS } from '@l-kern/config';

// ============================================================
// TYPES
// ============================================================

export interface WorkflowMessages {
  /** Messages shown during workflow */
  checkingService?: string;      // "Overujem Issues Service..."
  serviceAvailable?: string;     // "Issues Service je dostupný"
  checkingSql?: string;          // "Overujem SQL databázu..."
  sqlAvailable?: string;         // "SQL databáza je dostupná"
  checkingMinio?: string;        // "Overujem MinIO úložisko..."
  minioAvailable?: string;       // "MinIO úložisko je dostupné"
  saving?: string;               // "Ukladám zmeny..."
  takingLonger?: string;         // "Trvá to dlhšie ako obvykle..."
  retrying?: string;             // "Skúšam znova... (pokus {attempt}/{max})"
  success?: string;              // "Zmeny boli úspešne uložené"

  /** Error messages */
  serviceDown?: string;          // "Služba nie je dostupná"
  sqlDown?: string;              // "SQL databáza nie je dostupná"
  minioDown?: string;            // "MinIO úložisko nie je dostupné"
  notFound?: string;             // "Položka nenájdená"
  permissionDenied?: string;     // "Nedostatočné oprávnenia"
  validation?: string;           // "Chyba validácie"
  generic?: string;              // "Nastala neočakávaná chyba"
}

export interface IssueWorkflowConfig {
  /** API endpoint (e.g., '/issues' or '/issues/{id}') */
  endpoint: string;
  /** HTTP method */
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** Data to send in request body */
  data?: Record<string, unknown>;
  /** Files to upload (only for POST with FormData) */
  files?: File[];
  /** Permission level for X-Permission-Level header */
  permissionLevel?: number;
  /** Backend role for FormData (only for POST) */
  backendRole?: string;
  /** Health checks to perform before API call */
  healthChecks?: {
    /** Check if service is alive (ping) - default: true */
    ping?: boolean;
    /** Check SQL database health - default: true */
    sql?: boolean;
    /** Check MinIO storage health - default: true only if files provided */
    minio?: boolean;
  };
  /** UI messages for toasts and modals (localized by caller) */
  messages?: WorkflowMessages;
  /** Skip verification after create - default: false */
  skipVerification?: boolean;
  /** Enable debug logging - default: true */
  debug?: boolean;
  /** Caller name for debug logs */
  caller?: string;
  /** Callback when service is alive (ping succeeded) */
  onServiceAlive?: () => void;
  /** Callback when service is down after all retries */
  onServiceDown?: () => void;
  /** Callback when operation takes longer than expected */
  onTakingLonger?: () => void;
  /** Callback on each retry attempt */
  onRetry?: (attempt: number, maxAttempts: number) => void;
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

export type WorkflowErrorCode =
  | 'SERVICE_DOWN'
  | 'SQL_DOWN'
  | 'MINIO_DOWN'
  | 'MINIO_UNAVAILABLE_WITH_FILES'
  | 'NOT_FOUND'
  | 'PERMISSION_DENIED'
  | 'VALIDATION_ERROR'
  | 'API_ERROR'
  | 'NETWORK_ERROR';

export interface IssueWorkflowResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: WorkflowErrorCode;
  httpStatus?: number;
  minioAvailable: boolean;
  filesUploaded: boolean;
  healthCheck: HealthCheckResult | null;
  apiResponse?: unknown;
}

// ============================================================
// CONFIGURATION
// ============================================================

// Use SERVICE_ENDPOINTS from @l-kern/config (supports Docker/localhost)
const API_BASE_URL = SERVICE_ENDPOINTS.issues.baseUrl;
const PING_TIMEOUT = 5000;      // 5s - timeout for ping
const HEALTH_TIMEOUT = 10000;   // 10s - full health check
const API_TIMEOUT = 15000;      // 15s - API call timeout

// Retry configuration
const RETRY_COUNT = 3;
const RETRY_DELAY = 5000;         // 5s between retries
const TAKING_LONGER_DELAY = 1500; // 1.5s - show "taking longer" toast

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
// HEALTH CHECK WITH RETRY
// ============================================================

async function performHealthCheckWithRetry(
  config: {
    checkPing?: boolean;
    checkSql?: boolean;
    checkMinio?: boolean;
    onServiceAlive?: () => void;
    onServiceDown?: () => void;
    onTakingLonger?: () => void;
    onRetry?: (attempt: number, maxAttempts: number) => void;
  }
): Promise<HealthCheckResult> {
  const {
    checkPing = true,
    checkSql = true,
    checkMinio = false,
    onServiceAlive,
    onServiceDown,
    onTakingLonger,
    onRetry,
  } = config;

  const overallStartTime = performance.now();

  // Default result
  let issuesServiceHealth: ServiceHealth = { status: 'unknown' };
  let sqlHealth: ServiceHealth = { status: 'unknown' };
  let minioHealth: ServiceHealth = { status: 'unknown' };

  // ─────────────────────────────────────────────────────────────────
  // STEP 1: Ping Issues Service
  // ─────────────────────────────────────────────────────────────────
  if (checkPing) {
    log('🔍 Overujem Issues Service...');

    const pingServiceCall = async (): Promise<ServiceCallResult<{ alive: boolean }>> => {
      const startTime = performance.now();
      try {
        const response = await fetch(`${API_BASE_URL}/ping`, { method: 'GET' });
        return {
          success: response.ok,
          data: { alive: response.ok },
          responseTime: Math.round(performance.now() - startTime),
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
      onSuccess: () => {
        log('✅ Issues Service je dostupný');
        onServiceAlive?.();
      },
      onAllRetriesFailed: () => {
        log('❌ Issues Service nie je dostupný po 3 pokusoch');
        onServiceDown?.();
      },
    };

    const pingResult = await executeWithRetry(
      pingServiceCall,
      {
        serviceName: 'Issues Service',
        maxRetries: RETRY_COUNT,
        takingLongerDelay: TAKING_LONGER_DELAY,
        attemptTimeout: PING_TIMEOUT,
        retryDelay: RETRY_DELAY,
        debug: false, // Suppress ServiceRetry logs - we have our own
      },
      pingCallbacks
    );

    issuesServiceHealth = {
      status: pingResult.success ? 'healthy' : 'unhealthy',
      responseTime: pingResult.totalTime,
      error: pingResult.error,
    };

    if (!pingResult.success) {
      return {
        issuesService: issuesServiceHealth,
        sql: sqlHealth,
        minio: minioHealth,
        overall: 'unhealthy',
        totalTime: Math.round(performance.now() - overallStartTime),
      };
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // STEP 2: Check SQL Database
  // ─────────────────────────────────────────────────────────────────
  if (checkSql) {
    log('🔍 Overujem SQL databázu...');

    const healthServiceCall = async (): Promise<ServiceCallResult<{ sql: ServiceHealth; minio: ServiceHealth }>> => {
      const startTime = performance.now();
      try {
        const response = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
        const data = await response.json();
        const responseTime = Math.round(performance.now() - startTime);

        const sqlStatus = data.dependencies?.sql?.status === 'healthy' ? 'healthy' : 'unhealthy';
        const minioStatus = data.dependencies?.minio?.status === 'healthy' ? 'healthy' : 'unhealthy';

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
      onSuccess: () => {
        log('✅ SQL databáza je dostupná');
      },
      onAllRetriesFailed: () => {
        log('❌ SQL databáza nie je dostupná po 3 pokusoch');
        onServiceDown?.();
      },
    };

    const healthResult = await executeWithRetry(
      healthServiceCall,
      {
        serviceName: 'SQL Database',
        maxRetries: RETRY_COUNT,
        takingLongerDelay: TAKING_LONGER_DELAY,
        attemptTimeout: HEALTH_TIMEOUT,
        retryDelay: RETRY_DELAY,
        debug: false,
      },
      healthCallbacks
    );

    sqlHealth = healthResult.data?.sql ?? {
      status: 'unhealthy',
      responseTime: healthResult.totalTime,
      error: healthResult.error,
    };

    minioHealth = healthResult.data?.minio ?? {
      status: 'unknown',
      responseTime: healthResult.totalTime,
    };

    if (sqlHealth.status !== 'healthy') {
      return {
        issuesService: issuesServiceHealth,
        sql: sqlHealth,
        minio: minioHealth,
        overall: 'unhealthy',
        totalTime: Math.round(performance.now() - overallStartTime),
      };
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // STEP 3: Check MinIO (if required)
  // ─────────────────────────────────────────────────────────────────
  if (checkMinio && minioHealth.status !== 'healthy') {
    log('🔍 Overujem MinIO úložisko...');

    // MinIO retry - we already have the status from health check
    // If it was unhealthy, try again specifically for MinIO
    const minioServiceCall = async (): Promise<ServiceCallResult<ServiceHealth>> => {
      const startTime = performance.now();
      try {
        const response = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
        const data = await response.json();
        const responseTime = Math.round(performance.now() - startTime);

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
      onTakingLonger,
      onRetry,
      onSuccess: () => {
        log('✅ MinIO úložisko je dostupné');
      },
      onAllRetriesFailed: () => {
        log('❌ MinIO úložisko nie je dostupné po 3 pokusoch');
      },
    };

    const minioResult = await executeWithRetry(
      minioServiceCall,
      {
        serviceName: 'MinIO Storage',
        maxRetries: RETRY_COUNT,
        takingLongerDelay: TAKING_LONGER_DELAY,
        attemptTimeout: HEALTH_TIMEOUT,
        retryDelay: RETRY_DELAY,
        debug: false,
      },
      minioCallbacks
    );

    if (minioResult.success && minioResult.data) {
      minioHealth = minioResult.data;
    }
  }

  log('✅ Health check prešiel úspešne');

  // ─────────────────────────────────────────────────────────────────
  // Return combined result
  // ─────────────────────────────────────────────────────────────────
  const totalTime = Math.round(performance.now() - overallStartTime);
  const overall = sqlHealth.status === 'healthy'
    ? (minioHealth.status === 'healthy' ? 'healthy' : 'degraded')
    : 'unhealthy';

  return {
    issuesService: issuesServiceHealth,
    sql: sqlHealth,
    minio: minioHealth,
    overall,
    totalTime,
  };
}

// ============================================================
// API CALL WITH RETRY
// ============================================================

interface ApiCallConfig {
  endpoint: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  data?: Record<string, unknown>;
  files?: File[];
  permissionLevel?: number;
  backendRole?: string;
  /** Error messages for localization */
  messages?: {
    notFound?: string;
    permissionDenied?: string;
    validation?: string;
    serviceDown?: string;
    minioDown?: string;
    generic?: string;
  };
  onTakingLonger?: () => void;
  onRetry?: (attempt: number, maxAttempts: number) => void;
}

interface ApiResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: WorkflowErrorCode;
  httpStatus?: number;
  rawResponse?: unknown;
}

async function callApiWithRetry<T = unknown>(config: ApiCallConfig): Promise<ApiResult<T>> {
  const {
    endpoint,
    method,
    data,
    files,
    permissionLevel,
    backendRole,
    messages = {},
    onTakingLonger,
    onRetry,
  } = config;

  // Default messages
  const msg = {
    notFound: messages.notFound || 'Položka nenájdená',
    permissionDenied: messages.permissionDenied || 'Nedostatočné oprávnenia',
    validation: messages.validation || 'Chyba validácie',
    serviceDown: messages.serviceDown || 'Služba dočasne nedostupná',
    minioDown: messages.minioDown || 'MinIO úložisko nie je dostupné',
    generic: messages.generic || 'Nastala neočakávaná chyba',
  };

  const hasFiles = files && files.length > 0;
  const fullUrl = `${API_BASE_URL}${endpoint}`;

  log(`📤 ${method} ${fullUrl}`);

  const apiServiceCall = async (): Promise<ServiceCallResult<T>> => {
    const startTime = performance.now();
    try {
      let body: FormData | string | undefined;
      const headers: Record<string, string> = {};

      // Build request body and headers based on method and files
      if (method === 'POST' && (hasFiles || backendRole)) {
        // FormData for POST with files or backendRole
        const formData = new FormData();
        if (data) {
          formData.append('data', JSON.stringify(data));
        }
        if (backendRole) {
          formData.append('role', backendRole);
        }
        if (hasFiles && files) {
          for (const file of files) {
            formData.append('files', file);
            log(`   📎 Súbor: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
          }
        }
        body = formData;
        // Don't set Content-Type - browser will set it with boundary
      } else if (data) {
        // JSON for PUT/PATCH or POST without files
        body = JSON.stringify(data);
        headers['Content-Type'] = 'application/json';
      }

      if (permissionLevel !== undefined) {
        headers['X-Permission-Level'] = String(permissionLevel);
      }

      const response = await fetch(fullUrl, {
        method,
        headers,
        body,
      });

      const responseTime = Math.round(performance.now() - startTime);

      let responseData: unknown;
      try {
        responseData = await response.json();
      } catch {
        responseData = { message: response.statusText };
      }

      if (response.ok) {
        return {
          success: true,
          data: responseData as T,
          responseTime,
        };
      }

      // Handle error responses
      const detail = (responseData as { detail?: { error?: string } | string })?.detail;

      // Map HTTP status to error code
      let errorCode: WorkflowErrorCode = 'API_ERROR';
      let errorMsg = typeof detail === 'string' ? detail : `HTTP ${response.status}`;

      if (response.status === 404) {
        errorCode = 'NOT_FOUND';
        errorMsg = msg.notFound;
      } else if (response.status === 403) {
        errorCode = 'PERMISSION_DENIED';
        errorMsg = msg.permissionDenied;
      } else if (response.status === 422) {
        errorCode = 'VALIDATION_ERROR';
        errorMsg = typeof detail === 'string' ? detail : msg.validation;
      } else if (response.status === 503) {
        if (typeof detail === 'object' && detail?.error === 'minio_unavailable') {
          errorCode = 'MINIO_UNAVAILABLE_WITH_FILES';
          errorMsg = msg.minioDown;
        } else {
          errorCode = 'SERVICE_DOWN';
          errorMsg = msg.serviceDown;
        }
      }

      return {
        success: false,
        error: errorMsg,
        errorCode,
        responseTime,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Neznáma chyba',
        responseTime: Math.round(performance.now() - startTime),
      };
    }
  };

  const apiCallbacks: RetryCallbacks = {
    onTakingLonger: () => {
      log('⏳ Operácia trvá dlhšie...');
      onTakingLonger?.();
    },
    onRetry: (attempt, max) => {
      log(`🔄 Pokus ${attempt}/${max} - skúšam znova...`);
      onRetry?.(attempt, max);
    },
    onSuccess: () => {
      log('✅ Operácia úspešná');
    },
    onAllRetriesFailed: () => {
      log('❌ Operácia zlyhala po 3 pokusoch');
    },
  };

  const result = await executeWithRetry(
    apiServiceCall,
    {
      serviceName: `${method} ${endpoint}`,
      maxRetries: RETRY_COUNT,
      takingLongerDelay: TAKING_LONGER_DELAY,
      attemptTimeout: API_TIMEOUT,
      retryDelay: RETRY_DELAY,
      debug: false,
    },
    apiCallbacks
  );

  if (result.success && result.data) {
    return {
      success: true,
      data: result.data,
      httpStatus: 200,
      rawResponse: result.data,
    };
  }

  // Map error
  let errorCode: WorkflowErrorCode = 'API_ERROR';
  const errorMsg = result.error || 'Neznáma chyba';

  if (errorMsg.includes('nenájdená') || errorMsg.includes('not found')) {
    errorCode = 'NOT_FOUND';
  } else if (errorMsg.includes('oprávnenia') || errorMsg.includes('Permission')) {
    errorCode = 'PERMISSION_DENIED';
  } else if (errorMsg.includes('validácie') || errorMsg.includes('Validation')) {
    errorCode = 'VALIDATION_ERROR';
  } else if (errorMsg.includes('nedostupná') || errorMsg.includes('unavailable')) {
    errorCode = 'SERVICE_DOWN';
  } else if (errorMsg.includes('fetch') || errorMsg.includes('network')) {
    errorCode = 'NETWORK_ERROR';
  }

  return {
    success: false,
    error: errorMsg,
    errorCode,
  };
}

// ============================================================
// MAIN WORKFLOW FUNCTION
// ============================================================

/**
 * Universal issue workflow for create/update operations.
 *
 * Features:
 * - Configurable endpoint and HTTP method
 * - Health checks with automatic retry (ping → SQL → MinIO)
 * - API call with automatic retry
 * - Comprehensive logging
 *
 * @example Create issue:
 * ```ts
 * const result = await issueWorkflow({
 *   endpoint: '/issues/',
 *   method: 'POST',
 *   data: { title, description, type },
 *   files: attachments,
 *   backendRole: 'developer',
 *   permissionLevel: 50,
 * });
 * ```
 *
 * @example Update issue:
 * ```ts
 * const result = await issueWorkflow({
 *   endpoint: `/issues/${issueId}`,
 *   method: 'PUT',
 *   data: { title: 'New title' },
 *   permissionLevel: 50,
 *   healthChecks: { minio: false }, // Don't check MinIO for updates
 * });
 * ```
 */
export async function issueWorkflow<T = unknown>(
  config: IssueWorkflowConfig
): Promise<IssueWorkflowResult<T>> {
  const {
    endpoint,
    method,
    data,
    files,
    permissionLevel,
    backendRole,
    healthChecks = {},
    messages = {},
    debug = true,
    caller = 'issueWorkflow',
    onServiceAlive,
    onServiceDown,
    onTakingLonger,
    onRetry,
  } = config;

  // Default messages (fallbacks if not provided)
  const msg = {
    serviceDown: messages.serviceDown || 'Issues Service nie je dostupný',
    sqlDown: messages.sqlDown || 'SQL databáza nie je dostupná',
    minioDown: messages.minioDown || 'MinIO úložisko nie je dostupné',
    notFound: messages.notFound || 'Položka nenájdená',
    permissionDenied: messages.permissionDenied || 'Nedostatočné oprávnenia',
    validation: messages.validation || 'Chyba validácie',
    generic: messages.generic || 'Nastala neočakávaná chyba',
  };

  debugEnabled = debug;
  const hasFiles = files && files.length > 0;
  const timestamp = new Date().toISOString();

  // Default health checks
  const checkPing = healthChecks.ping ?? true;
  const checkSql = healthChecks.sql ?? true;
  const checkMinio = healthChecks.minio ?? hasFiles; // Only check MinIO if files provided

  // ─────────────────────────────────────────────────────────────────
  // START
  // ─────────────────────────────────────────────────────────────────
  logHeader(`🚀 ISSUE WORKFLOW - ${method} ${endpoint}`);
  log(`Timestamp: ${timestamp}`);
  log(`Caller: ${caller}`);
  log(`Health checks: ping=${checkPing}, sql=${checkSql}, minio=${checkMinio}`);
  if (data) {
    log('Data:', data);
  }
  if (hasFiles) {
    log(`Files: ${files?.length} súbor(y)`);
  }

  // ─────────────────────────────────────────────────────────────────
  // STEP 1: HEALTH CHECK
  // ─────────────────────────────────────────────────────────────────
  logSection('STEP 1: HEALTH CHECK');

  const health = await performHealthCheckWithRetry({
    checkPing,
    checkSql,
    checkMinio,
    onServiceAlive,
    onServiceDown,
    onTakingLonger,
    onRetry,
  });

  // Check if required services are healthy
  if (checkPing && health.issuesService.status !== 'healthy') {
    log('❌ Issues Service nie je dostupný');
    return {
      success: false,
      error: msg.serviceDown,
      errorCode: 'SERVICE_DOWN',
      minioAvailable: false,
      filesUploaded: false,
      healthCheck: health,
    };
  }

  if (checkSql && health.sql.status !== 'healthy') {
    log('❌ SQL databáza nie je dostupná');
    return {
      success: false,
      error: msg.sqlDown,
      errorCode: 'SQL_DOWN',
      minioAvailable: false,
      filesUploaded: false,
      healthCheck: health,
    };
  }

  const minioAvailable = health.minio.status === 'healthy';

  if (checkMinio && !minioAvailable && hasFiles) {
    log('❌ MinIO nie je dostupné a máte súbory na nahratie');
    return {
      success: false,
      error: msg.minioDown,
      errorCode: 'MINIO_UNAVAILABLE_WITH_FILES',
      minioAvailable: false,
      filesUploaded: false,
      healthCheck: health,
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // STEP 2: API CALL
  // ─────────────────────────────────────────────────────────────────
  logSection(`STEP 2: ${method} ${endpoint}`);

  const apiResult = await callApiWithRetry<T>({
    endpoint,
    method,
    data,
    files: minioAvailable ? files : undefined, // Only send files if MinIO is available
    permissionLevel,
    backendRole,
    messages: msg,
    onTakingLonger,
    onRetry,
  });

  if (!apiResult.success) {
    log(`❌ API zlyhalo: ${apiResult.error}`);
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

  const filesUploaded = !!(hasFiles && minioAvailable);

  // ─────────────────────────────────────────────────────────────────
  // COMPLETE
  // ─────────────────────────────────────────────────────────────────
  logSection('📊 SUMMARY');
  log(`Výsledok: ✅ Úspech`);
  log(`MinIO: ${minioAvailable ? '✅' : '❌'}`);
  log(`Súbory: ${filesUploaded ? `✅ ${files?.length} nahraných` : '➖ Žiadne'}`);
  logHeader('✅ WORKFLOW COMPLETE');

  return {
    success: true,
    data: apiResult.data,
    minioAvailable,
    filesUploaded,
    healthCheck: health,
    apiResponse: apiResult.rawResponse,
  };
}

// ============================================================
// CONVENIENCE WRAPPERS
// ============================================================

// Re-export types for backward compatibility
export type { ServiceCallResult, RetryCallbacks };

/**
 * Ping Issues Service (quick health check)
 */
export async function performPing(): Promise<{ alive: boolean; responseTime: number }> {
  const startTime = performance.now();
  try {
    const response = await fetch(`${API_BASE_URL}/ping`, {
      method: 'GET',
      signal: AbortSignal.timeout(PING_TIMEOUT),
    });
    return {
      alive: response.ok,
      responseTime: Math.round(performance.now() - startTime),
    };
  } catch {
    return {
      alive: false,
      responseTime: Math.round(performance.now() - startTime),
    };
  }
}

/**
 * Full health check (ping + SQL + MinIO)
 */
export async function performHealthCheck(): Promise<HealthCheckResult> {
  return performHealthCheckWithRetry({
    checkPing: true,
    checkSql: true,
    checkMinio: true,
  });
}
