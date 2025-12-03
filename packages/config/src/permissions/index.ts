/*
 * ================================================================
 * FILE: index.ts
 * PATH: /packages/config/src/permissions/index.ts
 * DESCRIPTION: Permissions module exports - core + field-level
 * VERSION: v2.0.0
 * CREATED: 2025-11-29
 * UPDATED: 2025-11-29
 * ================================================================
 */

// === CORE PERMISSION SYSTEM ===
// Thresholds, role mapping, storage
export {
  PERMISSION_THRESHOLDS,
  PERMISSION_COLOR_RANGES,
  QUICK_PERMISSION_LEVELS,
  PERMISSION_SHORTCUTS,
  SUPER_ADMIN_LEVEL,
  getBackendRole,
  getPermissionFromRole,
  getPermissionColorRange,
  canView,
  canCreate,
  canEdit,
  canDelete,
  canExport,
  canViewDeleted,
  validatePermissionLevel,
  getStoredPermissionLevel,
  setStoredPermissionLevel,
} from './core';

// === FIELD-LEVEL PERMISSION TYPES ===
export type {
  FieldAccess,
  FieldPermission,
  FieldAccessResult,
  FieldPermissionsMap,
  PermissionContext,
  PermissionEntity,
  FieldPermissionConditions,
} from './types';

// === ISSUE FIELD PERMISSIONS ===
export {
  ISSUE_FIELD_PERMISSIONS,
  getIssueFieldPermission,
  getIssueFieldNames,
} from './issueFieldPermissions';

// === FIELD PERMISSION FUNCTIONS ===
export {
  getFieldPermissionsForEntity,
  getFieldPermission,
  checkFieldAccess,
  getFieldAccess,
  getFieldsAccess,
  getEditableFields,
  getVisibleFields,
  canEditField,
  canViewField,
} from './fieldPermissions';
