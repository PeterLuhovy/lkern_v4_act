/*
 * ================================================================
 * FILE: index.ts
 * PATH: /packages/config/src/hooks/index.ts
 * DESCRIPTION: Hooks exports
 * VERSION: v2.0.0
 * UPDATED: 2025-10-19 15:00:00
 *
 * CHANGES:
 *   - v2.0.0: Migrated to folder structure (useModal/, useModalWizard/, etc.)
 * ================================================================
 */

// useModal hook
export { useModal } from './useModal';
export type { UseModalReturn } from './useModal';

// useModalWizard hook
export { useModalWizard } from './useModalWizard';
export type {
  UseModalWizardOptions,
  UseModalWizardReturn,
  WizardStep
} from './useModalWizard';

// usePageAnalytics hook
export { usePageAnalytics } from './usePageAnalytics';
export type {
  ClickEvent,
  KeyboardEvent,
  PageAnalyticsSession,
  PageAnalyticsMetrics,
  UsePageAnalyticsReturn
} from './usePageAnalytics';

// useAuth hook (mock implementation)
export { useAuth } from './useAuth';
export type { User, UserRole, Permission } from './useAuth';

// useServiceFetch hook - universal service availability + data fetching
export { useServiceFetch, SERVICE_CONFIGS } from './useServiceFetch';
export type {
  ServiceFetchStatus,
  ServiceFetchState,
  ServiceConfig,
  UseServiceFetchOptions,
  UseServiceFetchReturn,
  ServiceName,
} from './useServiceFetch';

// useFieldPermission hook - field-level access control
export {
  useFieldPermission,
  useFieldPermissions,
  useIssueFieldPermissions,
} from './useFieldPermission';
export type {
  UseFieldPermissionResult,
  UseFieldPermissionsResult,
} from './useFieldPermission';

// useEntityLookup hook - universal entity fetch with health check & caching
export {
  useEntityLookup,
  useBatchEntityLookup,
} from './useEntityLookup';
export type {
  EntityLookupStatus,
  UseEntityLookupOptions,
  UseEntityLookupResult,
  UseBatchEntityLookupOptions,
  UseBatchEntityLookupResult,
} from './useEntityLookup';

// useStorageOperation hook - validated CRUD operations with health checks
export { useStorageOperation } from './useStorageOperation';
export type {
  UseStorageOperationOptions,
  UseStorageOperationReturn,
} from './useStorageOperation';

// useServiceWorkflow hook - serviceWorkflow wrapper with automatic toast notifications
export { useServiceWorkflow } from './useServiceWorkflow';
export type {
  ServiceWorkflowMessages,
  ExecuteConfig,
  UseServiceWorkflowReturn,
} from './useServiceWorkflow';

// useSSEInvalidation hook - SSE cache invalidation for real-time updates
export { useSSEInvalidation } from './useSSEInvalidation';
