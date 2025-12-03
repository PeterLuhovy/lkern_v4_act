/*
 * ================================================================
 * FILE: types.ts
 * PATH: /packages/config/src/permissions/types.ts
 * DESCRIPTION: Field-level permission types for granular access control
 * VERSION: v1.0.0
 * CREATED: 2025-11-29
 * UPDATED: 2025-11-29
 * ================================================================
 */

/**
 * Field access levels
 * - hidden: User cannot see the field at all
 * - readonly: User can see but cannot edit
 * - editable: User can see and edit
 */
export type FieldAccess = 'hidden' | 'readonly' | 'editable';

/**
 * Entity types that have field-level permissions
 */
export type PermissionEntity = 'issue' | 'contact' | 'order' | 'customer';

/**
 * Field permission definition
 * Defines who can view and edit a specific field
 */
export interface FieldPermission {
  /** Field name (e.g., 'title', 'assignee_id', 'error_type') */
  field: string;

  /** Minimum permission level to VIEW this field (0-100) */
  viewLevel: number;

  /** Minimum permission level to EDIT this field (0-100), null = never editable */
  editLevel: number | null;

  /** Optional conditions for access */
  conditions?: FieldPermissionConditions;
}

/**
 * Conditional permission requirements
 */
export interface FieldPermissionConditions {
  /** Field is only editable when entity has specific status */
  requiresStatus?: string[];

  /** Field is only editable by the owner (reporter_id matches user.id) */
  requiresOwnership?: boolean;

  /** Field is only visible/editable when entity is NOT deleted */
  requiresActive?: boolean;
}

/**
 * Result of field permission check
 */
export interface FieldAccessResult {
  /** Computed access level */
  access: FieldAccess;

  /** Human-readable reason (for tooltip) when access is restricted */
  reason?: string;

  /** Translation key for the reason */
  reasonKey?: string;
}

/**
 * Context for permission check (entity-specific data)
 */
export interface PermissionContext {
  /** Current entity status (e.g., 'open', 'resolved', 'closed') */
  entityStatus?: string;

  /** Whether current user is the owner/creator */
  isOwner?: boolean;

  /** Whether entity is soft-deleted */
  isDeleted?: boolean;

  /** Entity type for entity-specific rules */
  entityType?: PermissionEntity;
}

/**
 * Batch permission check result
 */
export type FieldPermissionsMap = Record<string, FieldAccessResult>;
