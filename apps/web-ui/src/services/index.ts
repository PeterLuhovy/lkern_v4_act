/*
 * ================================================================
 * FILE: index.ts
 * PATH: /apps/web-ui/src/services/index.ts
 * DESCRIPTION: Services exports - API clients and types for external services
 * VERSION: v2.0.0
 * CREATED: 2025-11-29
 * UPDATED: 2025-12-04
 * CHANGELOG:
 *   v2.0.0 - Deprecated local workflow functions in favor of serviceWorkflow from @l-kern/config
 *            Kept only types that are still in use
 * ================================================================
 */

// Contacts Service API
export { contactsApi } from './contactsService';
export type { Contact, ContactsApiError } from './contactsService';

// Issue types (used by IssueCreateHandler and Issues page)
// NOTE: For workflow operations, use serviceWorkflow from @l-kern/config
export type { CreatedIssue } from './issueWorkflow';
