/*
 * ================================================================
 * FILE: useFieldPermission.ts
 * PATH: /packages/config/src/hooks/useFieldPermission/useFieldPermission.ts
 * DESCRIPTION: React hook for field-level permission checking
 * VERSION: v1.0.0
 * CREATED: 2025-11-29
 * UPDATED: 2025-11-29
 *
 * USAGE:
 *   const { access, reason, canView, canEdit } = useFieldPermission('issue', 'assignee_id', context);
 *
 *   // In JSX:
 *   {canView && (
 *     <FormField disabled={!canEdit} disabledTooltip={reason}>
 *       ...
 *     </FormField>
 *   )}
 * ================================================================
 */

import { useMemo } from 'react';
import { useAuthContext } from '../../contexts/AuthContext/AuthContext';
import { useTranslation } from '../../translations';
import {
  getFieldAccess,
  getFieldsAccess,
  type PermissionEntity,
  type PermissionContext,
  type FieldAccessResult,
} from '../../permissions/index';

/**
 * Extended result for hook (includes convenience booleans and translated reason)
 */
export interface UseFieldPermissionResult extends FieldAccessResult {
  /** Whether field is visible (access !== 'hidden') */
  canView: boolean;
  /** Whether field is editable (access === 'editable') */
  canEdit: boolean;
  /** Translated reason message (for tooltip) */
  translatedReason?: string;
}

/**
 * Extended result for batch hook
 */
export type UseFieldPermissionsResult = Record<string, UseFieldPermissionResult>;

/**
 * Hook to check single field permission
 *
 * @param entityType - Entity type ('issue', 'contact', etc.)
 * @param fieldName - Field name to check
 * @param context - Optional permission context (status, ownership, etc.)
 * @returns Permission result with access level, reasons, and convenience booleans
 *
 * @example
 * ```tsx
 * const { canView, canEdit, translatedReason } = useFieldPermission('issue', 'assignee_id');
 *
 * return canView ? (
 *   <FormField disabled={!canEdit} disabledTooltip={translatedReason}>
 *     <Select ... />
 *   </FormField>
 * ) : null;
 * ```
 */
export function useFieldPermission(
  entityType: PermissionEntity,
  fieldName: string,
  context?: PermissionContext
): UseFieldPermissionResult {
  const { permissionLevel } = useAuthContext();
  const { t } = useTranslation();

  return useMemo(() => {
    const result = getFieldAccess(entityType, fieldName, permissionLevel, context);

    return {
      ...result,
      canView: result.access !== 'hidden',
      canEdit: result.access === 'editable',
      translatedReason: result.reasonKey ? t(result.reasonKey) : undefined,
    };
  }, [entityType, fieldName, permissionLevel, context, t]);
}

/**
 * Hook to check multiple field permissions at once
 *
 * @param entityType - Entity type
 * @param fieldNames - Array of field names
 * @param context - Optional permission context
 * @returns Map of field name to permission result
 *
 * @example
 * ```tsx
 * const permissions = useFieldPermissions('issue', ['title', 'severity', 'assignee_id']);
 *
 * return (
 *   <>
 *     {permissions.title.canView && (
 *       <FormField disabled={!permissions.title.canEdit}>...</FormField>
 *     )}
 *     {permissions.severity.canView && (
 *       <FormField disabled={!permissions.severity.canEdit}>...</FormField>
 *     )}
 *   </>
 * );
 * ```
 */
export function useFieldPermissions(
  entityType: PermissionEntity,
  fieldNames: string[],
  context?: PermissionContext
): UseFieldPermissionsResult {
  const { permissionLevel } = useAuthContext();
  const { t } = useTranslation();

  return useMemo(() => {
    const results = getFieldsAccess(entityType, fieldNames, permissionLevel, context);

    const extendedResults: UseFieldPermissionsResult = {};

    for (const [fieldName, result] of Object.entries(results)) {
      extendedResults[fieldName] = {
        ...result,
        canView: result.access !== 'hidden',
        canEdit: result.access === 'editable',
        translatedReason: result.reasonKey ? t(result.reasonKey) : undefined,
      };
    }

    return extendedResults;
  }, [entityType, fieldNames, permissionLevel, context, t]);
}

/**
 * Hook to get Issue-specific field permissions (convenience wrapper)
 *
 * @param fieldNames - Array of Issue field names
 * @param context - Optional context with Issue status, ownership, etc.
 * @returns Map of field permissions
 *
 * @example
 * ```tsx
 * const perms = useIssueFieldPermissions(['title', 'severity'], { entityStatus: issue.status });
 * ```
 */
export function useIssueFieldPermissions(
  fieldNames: string[],
  context?: Omit<PermissionContext, 'entityType'>
): UseFieldPermissionsResult {
  return useFieldPermissions('issue', fieldNames, { ...context, entityType: 'issue' });
}
