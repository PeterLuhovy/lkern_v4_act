/*
 * ================================================================
 * FILE: index.ts
 * PATH: /packages/config/src/utils/serviceWorkflow/index.ts
 * DESCRIPTION: Service workflow barrel export
 * VERSION: v2.2.0
 * CREATED: 2025-12-03
 * UPDATED: 2025-12-10
 * CHANGELOG:
 *   v2.2.0 - MODULE EXTRACTION: Split into separate modules for better maintainability
 *            - apiExecution.ts: HTTP request logic (GET/POST/PUT/PATCH/DELETE, FormData, files)
 *            - verification.ts: SQL + MinIO + field verification with retry
 *            - healthCheck.ts: Service/SQL/MinIO health checks with retry
 *            - constants.ts: Centralized configuration (timeouts, retry counts, cache TTL)
 *            - logging.ts: WorkflowContext class for isolated logging state
 *   v2.1.0 - Added data integrity utilities for auto-issue creation
 *   v2.0.0 - REMOVED: attachmentWorkflow (wrong pattern - called serviceWorkflow 4x)
 *            Batch operations will be handled by serviceWorkflow with skip flags
 *   v1.1.0 - Added attachmentWorkflow for batch attachment operations
 * ================================================================
 */

export { serviceWorkflow, clearHealthCheckCache, getErrorMessage } from './serviceWorkflow';
export type {
  ServiceWorkflowConfig,
  ServiceWorkflowResult,
  ServiceWorkflowErrorCode,
  ServiceWorkflowMessages,
  ServiceWorkflowCallbacks,
  HealthCheckConfig,
  VerificationConfig,
  DeleteVerificationConfig,
  // Data integrity types
  DataIntegrityEvent,
  DataIntegrityIssueType,
  // Download progress (v5.1.0)
  DownloadProgress,
} from './types';

// Data integrity utilities
export {
  createDataIntegrityEvent,
  reportDataIntegrityIssue,
  defaultDataIntegrityHandler,
} from './dataIntegrity';

// Cache management
export { workflowCache } from './cache';

// API execution
export { executeApiCall, setApiExecutionLogger } from './apiExecution';
export type { ApiResult } from './apiExecution';

// Verification
export {
  performVerification,
  performPreDeleteVerification,
  setVerificationLogger,
} from './verification';
export type {
  AttachmentVerificationResult,
  VerificationResult,
  PreDeleteVerificationResult,
} from './verification';

// Health checks
export { performHealthCheckWithRetry, setHealthCheckLogger } from './healthCheck';
export type { ServiceHealth, HealthCheckResult, HealthCheckCallbacks } from './healthCheck';

/**
 * Cleanup function for cache (call on app unmount).
 * Prevents memory leaks in long-running SPAs.
 *
 * @example
 * ```typescript
 * // In app cleanup
 * window.addEventListener('beforeunload', () => {
 *   cleanupServiceWorkflowCache();
 * });
 * ```
 */
export function cleanupServiceWorkflowCache(): void {
  const { workflowCache } = require('./cache');
  workflowCache.destroy();
}
