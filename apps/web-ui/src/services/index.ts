/*
 * ================================================================
 * FILE: index.ts
 * PATH: /apps/web-ui/src/services/index.ts
 * DESCRIPTION: Services exports - API clients for external services
 * VERSION: v1.0.0
 * CREATED: 2025-11-29
 * UPDATED: 2025-11-29
 * ================================================================
 */

// Contacts Service API
export { contactsApi } from './contactsService';
export type { Contact, ContactsApiError } from './contactsService';

// Universal Issue Workflow Service (recommended)
export {
  issueWorkflow,
  performHealthCheck as performIssueHealthCheck,
  performPing as performIssuePing,
  type IssueWorkflowConfig,
  type IssueWorkflowResult,
  type WorkflowMessages,
  type HealthCheckResult as IssueHealthCheckResult,
  type ServiceHealth as IssueServiceHealth,
  type WorkflowErrorCode as IssueWorkflowErrorCode,
} from './issueWorkflow';

// Legacy: Create workflow (for backward compatibility)
export {
  createIssueWorkflow,
  type CreateIssueInput,
  type CreateIssueResult,
  type CreatedIssue,
  type UserContext as IssueUserContext,
  type VerificationResult as IssueVerificationResult,
  type WorkflowOptions as IssueWorkflowOptions,
} from './issueWorkflow';

// Legacy: Update workflow (for backward compatibility)
export {
  updateIssueWorkflow,
  type UpdateIssueInput,
  type UpdateIssueResult,
  type UpdatedIssue,
  type UpdateWorkflowErrorCode,
  type UpdateWorkflowOptions,
} from './issueWorkflow';
