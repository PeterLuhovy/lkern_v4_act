/*
 * ================================================================
 * FILE: index.ts
 * PATH: /apps/web-ui/src/services/issueWorkflow/index.ts
 * DESCRIPTION: Issue workflow service exports
 * VERSION: v3.0.0
 * CREATED: 2025-11-30
 * UPDATED: 2025-12-04
 * CHANGELOG:
 *   v3.0.0 - DEPRECATED: Use serviceWorkflow from @l-kern/config instead
 *            Only types are exported now, functions are deprecated
 *   v2.0.0 - Added universal issueWorkflow function
 *   v1.1.0 - Added updateIssueWorkflow exports
 *
 * @deprecated Use serviceWorkflow from @l-kern/config instead of these local workflows.
 *             Only type exports are maintained for backward compatibility.
 * ================================================================
 */

// Universal workflow (recommended)
export {
  issueWorkflow,
  performHealthCheck,
  performPing,
  type IssueWorkflowConfig,
  type IssueWorkflowResult,
  type WorkflowMessages,
  type HealthCheckResult,
  type ServiceHealth,
  type WorkflowErrorCode,
} from './issueWorkflow';

// Legacy: Create workflow (for backward compatibility)
export {
  createIssueWorkflow,
  performHealthCheck as performHealthCheckLegacy,
  performPing as performPingLegacy,
  type AttachmentVerificationResult,
  type CreateIssueInput,
  type CreateIssueResult,
  type CreatedIssue,
  type FieldComparisonResult,
  type HealthCheckResult as LegacyHealthCheckResult,
  type ServiceHealth as LegacyServiceHealth,
  type UserContext,
  type VerificationResult,
  type WorkflowErrorCode as LegacyWorkflowErrorCode,
  type WorkflowOptions,
} from './createIssueWorkflow';

// Legacy: Update workflow (for backward compatibility)
export {
  updateIssueWorkflow,
  type UpdateIssueInput,
  type UpdateIssueResult,
  type UpdatedIssue,
  type UpdateWorkflowErrorCode,
  type UpdateWorkflowOptions,
} from './updateIssueWorkflow';
