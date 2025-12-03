/*
 * ================================================================
 * FILE: fieldPermissions.ts
 * PATH: /packages/config/src/permissions/fieldPermissions.ts
 * DESCRIPTION: Core functions for field-level permission checking
 * VERSION: v1.0.0
 * CREATED: 2025-11-29
 * UPDATED: 2025-11-29
 * ================================================================
 */

import type {
  FieldAccess,
  FieldAccessResult,
  FieldPermission,
  FieldPermissionsMap,
  PermissionContext,
  PermissionEntity,
} from './types';
import { ISSUE_FIELD_PERMISSIONS, getIssueFieldPermission } from './issueFieldPermissions';
import { SUPER_ADMIN_LEVEL } from './core';

/**
 * Get field permissions array for entity type
 *
 * @param entityType - Entity type ('issue', 'contact', etc.)
 * @returns Array of field permissions
 */
export function getFieldPermissionsForEntity(entityType: PermissionEntity): FieldPermission[] {
  switch (entityType) {
    case 'issue':
      return ISSUE_FIELD_PERMISSIONS;
    // TODO: Add other entity types when needed
    // case 'contact':
    //   return CONTACT_FIELD_PERMISSIONS;
    default:
      console.warn(`[Permissions] Unknown entity type: ${entityType}`);
      return [];
  }
}

/**
 * Get field permission definition
 *
 * @param entityType - Entity type
 * @param fieldName - Field name
 * @returns FieldPermission or undefined
 */
export function getFieldPermission(
  entityType: PermissionEntity,
  fieldName: string
): FieldPermission | undefined {
  switch (entityType) {
    case 'issue':
      return getIssueFieldPermission(fieldName);
    default:
      return undefined;
  }
}

/**
 * Check field access for a specific user permission level
 *
 * @param permission - Field permission definition
 * @param userLevel - User's permission level (0-100)
 * @param context - Optional context (status, ownership, etc.)
 * @returns FieldAccessResult with access level and reason
 */
export function checkFieldAccess(
  permission: FieldPermission,
  userLevel: number,
  context?: PermissionContext
): FieldAccessResult {
  // STEP 1: Check VIEW permission FIRST (even for id field)
  // This ensures Admin lvl 1 (60-69) sees id as hidden
  if (userLevel < permission.viewLevel) {
    return {
      access: 'hidden',
      reasonKey: 'permissions.noViewAccess',
    };
  }

  // STEP 2: ID is NEVER editable - even by Super Admin (foreign key integrity)
  // Only checked AFTER view permission passes
  if (permission.field === 'id') {
    return {
      access: 'readonly',
      reasonKey: 'permissions.immutableField',
    };
  }

  // STEP 3: SUPER ADMIN (level 100) - bypass ALL other restrictions
  if (userLevel >= SUPER_ADMIN_LEVEL) {
    return {
      access: 'editable',
    };
  }

  // Field has no edit capability (read-only by design)
  if (permission.editLevel === null) {
    return {
      access: 'readonly',
      reasonKey: 'permissions.fieldReadOnly',
    };
  }

  // Check EDIT permission level
  if (userLevel < permission.editLevel) {
    return {
      access: 'readonly',
      reasonKey: 'permissions.noEditAccess',
    };
  }

  // Check conditional permissions
  if (permission.conditions) {
    // Status condition
    if (permission.conditions.requiresStatus && context?.entityStatus) {
      if (!permission.conditions.requiresStatus.includes(context.entityStatus)) {
        return {
          access: 'readonly',
          reasonKey: 'permissions.wrongStatus',
        };
      }
    }

    // Ownership condition
    if (permission.conditions.requiresOwnership && !context?.isOwner) {
      return {
        access: 'readonly',
        reasonKey: 'permissions.requiresOwnership',
      };
    }

    // Active (not deleted) condition
    if (permission.conditions.requiresActive && context?.isDeleted) {
      return {
        access: 'readonly',
        reasonKey: 'permissions.entityDeleted',
      };
    }
  }

  // All checks passed - user can edit
  return {
    access: 'editable',
  };
}

/**
 * Get access level for a single field
 *
 * @param entityType - Entity type ('issue', 'contact', etc.)
 * @param fieldName - Field name
 * @param userLevel - User's permission level (0-100)
 * @param context - Optional context
 * @returns FieldAccessResult
 */
export function getFieldAccess(
  entityType: PermissionEntity,
  fieldName: string,
  userLevel: number,
  context?: PermissionContext
): FieldAccessResult {
  const permission = getFieldPermission(entityType, fieldName);

  // Field not in permission list - default to hidden (secure by default)
  if (!permission) {
    console.warn(`[Permissions] Field '${fieldName}' not found in ${entityType} permissions`);
    return {
      access: 'hidden',
      reasonKey: 'permissions.fieldNotConfigured',
    };
  }

  return checkFieldAccess(permission, userLevel, context);
}

/**
 * Get access levels for multiple fields at once
 *
 * @param entityType - Entity type
 * @param fieldNames - Array of field names
 * @param userLevel - User's permission level
 * @param context - Optional context
 * @returns Map of field name to access result
 */
export function getFieldsAccess(
  entityType: PermissionEntity,
  fieldNames: string[],
  userLevel: number,
  context?: PermissionContext
): FieldPermissionsMap {
  const results: FieldPermissionsMap = {};

  for (const fieldName of fieldNames) {
    results[fieldName] = getFieldAccess(entityType, fieldName, userLevel, context);
  }

  return results;
}

/**
 * Get all editable fields for a user
 *
 * @param entityType - Entity type
 * @param userLevel - User's permission level
 * @param context - Optional context
 * @returns Array of field names that user can edit
 */
export function getEditableFields(
  entityType: PermissionEntity,
  userLevel: number,
  context?: PermissionContext
): string[] {
  const permissions = getFieldPermissionsForEntity(entityType);

  return permissions
    .filter(p => {
      const access = checkFieldAccess(p, userLevel, context);
      return access.access === 'editable';
    })
    .map(p => p.field);
}

/**
 * Get all visible fields for a user
 *
 * @param entityType - Entity type
 * @param userLevel - User's permission level
 * @param context - Optional context
 * @returns Array of field names that user can see
 */
export function getVisibleFields(
  entityType: PermissionEntity,
  userLevel: number,
  context?: PermissionContext
): string[] {
  const permissions = getFieldPermissionsForEntity(entityType);

  return permissions
    .filter(p => {
      const access = checkFieldAccess(p, userLevel, context);
      return access.access !== 'hidden';
    })
    .map(p => p.field);
}

/**
 * Check if user can edit a specific field (simple boolean check)
 *
 * @param entityType - Entity type
 * @param fieldName - Field name
 * @param userLevel - User's permission level
 * @param context - Optional context
 * @returns true if user can edit
 */
export function canEditField(
  entityType: PermissionEntity,
  fieldName: string,
  userLevel: number,
  context?: PermissionContext
): boolean {
  const access = getFieldAccess(entityType, fieldName, userLevel, context);
  return access.access === 'editable';
}

/**
 * Check if user can view a specific field (simple boolean check)
 *
 * @param entityType - Entity type
 * @param fieldName - Field name
 * @param userLevel - User's permission level
 * @param context - Optional context
 * @returns true if user can view
 */
export function canViewField(
  entityType: PermissionEntity,
  fieldName: string,
  userLevel: number,
  context?: PermissionContext
): boolean {
  const access = getFieldAccess(entityType, fieldName, userLevel, context);
  return access.access !== 'hidden';
}
