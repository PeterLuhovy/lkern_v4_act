/*
 * ================================================================
 * FILE: updateIssueWorkflow.ts
 * PATH: /apps/web-ui/src/services/issueWorkflow/updateIssueWorkflow.ts
 * DESCRIPTION: Standalone workflow for updating issues with health checks,
 *              retry logic and comprehensive debug logging.
 *              Uses same patterns as createIssueWorkflow.
 * VERSION: v1.1.0
 * CREATED: 2025-11-30
 * UPDATED: 2025-11-30
 * CHANGELOG:
 *   v1.1.0 - Cleaned up logging to match createIssueWorkflow style
 * ================================================================
 */

import { executeWithRetry, type ServiceCallResult, type RetryCallbacks } from '@l-kern/config';

// ============================================================
// TYPES
// ============================================================

export interface UpdateIssueInput {
  issueId: string;
  updates: Record<string, unknown>;
  permissionLevel: number;
}

export interface UpdatedIssue {
  id: string;
  issue_code: string;
  title: string;
  description: string;
  type: string;
  severity: string;
  status: string;
  priority: string;
  category?: string;
  resolution?: string;
  error_message?: string;
  error_type?: string;
  system_info?: Record<string, unknown>;
  reporter_id?: string;
  assignee_id?: string;
  created_at: string;
  updated_at?: string;
  resolved_at?: string;
  closed_at?: string;
  deleted_at?: string;
}

export type UpdateWorkflowErrorCode =
  | 'SERVICE_DOWN'
  | 'SQL_DOWN'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'PERMISSION_DENIED'
  | 'API_ERROR'
  | 'NETWORK_ERROR';

export interface UpdateIssueResult {
  success: boolean;
  issue?: UpdatedIssue;
  error?: string;
  errorCode?: UpdateWorkflowErrorCode;
}

export interface UpdateWorkflowOptions {
  /** Skip health check (for quick updates) */
  skipHealthCheck?: boolean;
  /** Enable debug logging */
  debug?: boolean;
  /** Caller identifier for logs */
  caller?: string;
  /** Called when service is alive */
  onServiceAlive?: () => void;
  /** Called when service is down after all retries */
  onServiceDown?: () => void;
  /** Called when request takes longer than expected */
  onTakingLonger?: () => void;
  /** Called on each retry attempt */
  onRetry?: (attempt: number, maxAttempts: number) => void;
}

// ============================================================
// CONFIGURATION
// ============================================================

const API_BASE_URL = 'http://localhost:4105';
const PING_TIMEOUT = 5000;      // 5s - timeout for ping
const UPDATE_TIMEOUT = 10000;   // 10s - timeout for update API call

// Retry configuration (same as createIssueWorkflow)
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
    console.log(`[UpdateWorkflow] ${message}`, data);
  } else {
    console.log(`[UpdateWorkflow] ${message}`);
  }
}

function logSection(title: string) {
  if (!debugEnabled) return;
  console.log('───────────────────────────────────────────────────────────────');
  console.log(`[UpdateWorkflow] ${title}`);
  console.log('───────────────────────────────────────────────────────────────');
}

function logHeader(title: string) {
  if (!debugEnabled) return;
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`[UpdateWorkflow] ${title}`);
  console.log('═══════════════════════════════════════════════════════════════');
}

// ============================================================
// MAIN WORKFLOW FUNCTION
// ============================================================

/**
 * Update issue workflow with health checks and retry logic.
 *
 * Flow:
 * 1. Health check (ping + SQL) with 3x retry
 * 2. Update issue API call with 3x retry
 *
 * @param input - Issue ID, updates and permission level
 * @param options - Workflow options (callbacks, debug, etc.)
 * @returns Result with updated issue or error
 */
export async function updateIssueWorkflow(
  input: UpdateIssueInput,
  options: UpdateWorkflowOptions = {}
): Promise<UpdateIssueResult> {
  const {
    skipHealthCheck = false,
    debug = true,
    caller = 'updateIssueWorkflow',
    onServiceAlive,
    onServiceDown,
    onTakingLonger,
    onRetry,
  } = options;

  debugEnabled = debug;

  logHeader(`UPDATE ISSUE WORKFLOW - ${caller}`);
  log(`Issue ID: ${input.issueId}`);
  log(`Permission Level: ${input.permissionLevel}`);
  log(`Updates:`, input.updates);

  // ─────────────────────────────────────────────────────────────────
  // STEP 1: HEALTH CHECK (optional)
  // ─────────────────────────────────────────────────────────────────
  if (!skipHealthCheck) {
    logSection('STEP 1: HEALTH CHECK');

    // 1a. Check Issues Service (ping)
    log('🔍 Overujem Issues Service...');

    const pingServiceCall = async (): Promise<ServiceCallResult<{ alive: boolean }>> => {
      const callStart = performance.now();
      try {
        const response = await fetch(`${API_BASE_URL}/ping`, { method: 'GET' });
        return {
          success: response.ok,
          data: { alive: response.ok },
          responseTime: Math.round(performance.now() - callStart),
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          responseTime: Math.round(performance.now() - callStart),
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

    if (!pingResult.success) {
      return {
        success: false,
        error: 'Issues Service nie je dostupný',
        errorCode: 'SERVICE_DOWN',
      };
    }

    // 1b. Check SQL Database
    log('🔍 Overujem SQL databázu...');

    const healthServiceCall = async (): Promise<ServiceCallResult<{ sqlHealthy: boolean }>> => {
      const callStart = performance.now();
      try {
        const response = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
        const data = await response.json();
        const sqlHealthy = data.dependencies?.sql?.status === 'healthy';
        return {
          success: sqlHealthy,
          data: { sqlHealthy },
          responseTime: Math.round(performance.now() - callStart),
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          responseTime: Math.round(performance.now() - callStart),
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
        attemptTimeout: PING_TIMEOUT,
        retryDelay: RETRY_DELAY,
        debug: false, // Suppress ServiceRetry logs
      },
      healthCallbacks
    );

    if (!healthResult.success) {
      return {
        success: false,
        error: 'SQL databáza nie je dostupná',
        errorCode: 'SQL_DOWN',
      };
    }

    log('✅ Health check prešiel úspešne');
  } else {
    log('⏭️ Health check preskočený');
  }

  // ─────────────────────────────────────────────────────────────────
  // STEP 2: UPDATE ISSUE
  // ─────────────────────────────────────────────────────────────────
  logSection('STEP 2: UPDATE ISSUE');
  log('📤 Ukladám zmeny...');

  const updateServiceCall = async (): Promise<ServiceCallResult<UpdatedIssue>> => {
    const callStart = performance.now();
    try {
      const response = await fetch(`${API_BASE_URL}/issues/${input.issueId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Permission-Level': String(input.permissionLevel),
        },
        body: JSON.stringify(input.updates),
      });

      const responseTime = Math.round(performance.now() - callStart);

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data,
          responseTime,
        };
      }

      // Handle specific error codes
      if (response.status === 404) {
        return { success: false, error: 'Položka nenájdená', responseTime };
      }
      if (response.status === 403) {
        return { success: false, error: 'Nedostatočné oprávnenia', responseTime };
      }
      if (response.status === 422) {
        const errorData = await response.json().catch(() => ({}));
        return { success: false, error: errorData.detail || 'Chyba validácie', responseTime };
      }
      if (response.status === 503) {
        return { success: false, error: 'Služba dočasne nedostupná', responseTime };
      }

      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        responseTime,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Neznáma chyba',
        responseTime: Math.round(performance.now() - callStart),
      };
    }
  };

  const updateCallbacks: RetryCallbacks = {
    onTakingLonger: () => {
      log('⏳ Ukladanie trvá dlhšie...');
      onTakingLonger?.();
    },
    onRetry: (attempt, max) => {
      log(`🔄 Pokus ${attempt}/${max} - skúšam znova uložiť...`);
      onRetry?.(attempt, max);
    },
    onSuccess: () => {
      log('✅ Zmeny boli úspešne uložené');
    },
    onAllRetriesFailed: () => {
      log('❌ Ukladanie zlyhalo po 3 pokusoch');
      onServiceDown?.();
    },
  };

  const updateResult = await executeWithRetry(
    updateServiceCall,
    {
      serviceName: 'Update Issue',
      maxRetries: RETRY_COUNT,
      takingLongerDelay: TAKING_LONGER_DELAY,
      attemptTimeout: UPDATE_TIMEOUT,
      retryDelay: RETRY_DELAY,
      debug: false, // Suppress ServiceRetry logs
    },
    updateCallbacks
  );

  if (updateResult.success && updateResult.data) {
    log('✅ Issue aktualizovaný úspešne');
    return {
      success: true,
      issue: updateResult.data,
    };
  }

  // Map error to error code
  let errorCode: UpdateWorkflowErrorCode = 'API_ERROR';
  const errorMsg = updateResult.error || 'Neznáma chyba';

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

  log(`❌ Update zlyhal: ${errorMsg} (${errorCode})`);
  return {
    success: false,
    error: errorMsg,
    errorCode,
  };
}
