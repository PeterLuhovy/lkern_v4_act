/*
 * ================================================================
 * FILE: issueFieldPermissions.ts
 * PATH: /packages/config/src/permissions/issueFieldPermissions.ts
 * DESCRIPTION: Field-level permission definitions for Issue entity
 * VERSION: v2.0.0
 * CREATED: 2025-11-29
 * UPDATED: 2025-11-30
 *
 * PERMISSION LEVELS:
 *   - 1-29 (Basic lvl 1-3): View-only, limited fields
 *   - 30-59 (Standard lvl 1-3): Create + view more fields
 *   - 60-69 (Admin lvl 1): ID hidden, limited edit
 *   - 70-99 (Admin lvl 2-3): Full view, Admin lvl 2+ can edit most fields
 *   - 100 (Super Admin): Full access including type, status, issue_code
 *
 * ACCESS MATRIX:
 *   Field           | View Level | Edit Level | Notes
 *   ----------------|------------|------------|---------------------------
 *   id              | 0          | null       | Always visible (frontend logic), NEVER editable
 *   issue_code      | 1          | 100        | Everyone sees, Super Admin edits
 *   title           | 1          | 70         | Everyone sees, Admin lvl 2+ (70+) edits
 *   description     | 1          | 30         | Everyone sees, Standard+ edits
 *   type            | 1          | 100        | Everyone sees, Super Admin edits
 *   severity        | 1          | 70         | Everyone sees, Admin lvl 2+ (70+) edits
 *   priority        | 1          | 70         | Everyone sees, Admin lvl 2+ (70+) edits
 *   status          | 1          | 100        | Everyone sees, Super Admin edits
 *   category        | 1          | 70         | Everyone sees, Admin lvl 2+ (70+) edits
 *   assignee_id     | 30         | 70         | Standard+ sees, Admin lvl 2+ (70+) assigns
 *   reporter_id     | 60         | null       | Admin sees, auto-set
 *   error_type      | 60         | 70         | Technical - Admin lvl 2+ (70+) edits
 *   error_message   | 60         | 70         | Technical - Admin lvl 2+ (70+) edits
 *   system_info     | 60         | 80         | Technical - Admin sees, Admin lvl 3 (80+) edits
 *   resolution      | 1          | 70         | Everyone sees, Admin lvl 2+ (70+) edits
 *   created_at      | 1          | null       | Everyone sees, never editable
 *   updated_at      | 1          | null       | Everyone sees, never editable
 *   attachments     | 30         | 70         | Standard+ sees, Admin lvl 2+ (70+) manages
 * ================================================================
 */

import type { FieldPermission } from './types';

/**
 * Issue entity field permissions
 *
 * Why: Centralized definition of who can view/edit each Issue field
 * When to change: When adding new fields or adjusting access requirements
 */
export const ISSUE_FIELD_PERMISSIONS: FieldPermission[] = [
  // ═══════════════════════════════════════════════════════════════
  // IDENTIFIERS
  // ═══════════════════════════════════════════════════════════════
  {
    field: 'id',
    viewLevel: 0,      // Always visible (needed for frontend logic)
    editLevel: null,   // NEVER editable - foreign key integrity
  },
  {
    field: 'issue_code',
    viewLevel: 1,      // Everyone can see
    editLevel: 100,    // Super Admin only can edit
  },

  // ═══════════════════════════════════════════════════════════════
  // BASIC INFO - Visible to all, editable by Admin lvl 2+ (70+)
  // ═══════════════════════════════════════════════════════════════
  {
    field: 'title',
    viewLevel: 1,      // Everyone can see
    editLevel: 70,     // Admin lvl 2+ (70+) can edit
  },
  {
    field: 'description',
    viewLevel: 1,
    editLevel: 30,     // Standard+ can edit
  },

  // ═══════════════════════════════════════════════════════════════
  // CLASSIFICATION - Visible to all, varies by field
  // ═══════════════════════════════════════════════════════════════
  {
    field: 'type',
    viewLevel: 1,
    editLevel: 100,    // Super Admin only can change type
  },
  {
    field: 'severity',
    viewLevel: 1,
    editLevel: 70,     // Admin lvl 2+ (70+) can change severity
  },
  {
    field: 'priority',
    viewLevel: 1,
    editLevel: 70,     // Admin lvl 2+ (70+) can change priority
  },
  {
    field: 'status',
    viewLevel: 1,
    editLevel: 100,    // Super Admin only can change status directly
  },
  {
    field: 'category',
    viewLevel: 1,
    editLevel: 70,     // Admin lvl 2+ (70+) can change category
  },

  // ═══════════════════════════════════════════════════════════════
  // PEOPLE - Sensitive, restricted visibility
  // ═══════════════════════════════════════════════════════════════
  {
    field: 'assignee_id',
    viewLevel: 30,     // Standard+ can see who is assigned
    editLevel: 70,     // Admin lvl 2+ (70+) can assign/reassign
  },
  {
    field: 'reporter_id',
    viewLevel: 60,     // Admin+ can see reporter (privacy)
    editLevel: null,   // Never editable - set automatically
  },

  // ═══════════════════════════════════════════════════════════════
  // TECHNICAL DETAILS - Admin only
  // ═══════════════════════════════════════════════════════════════
  {
    field: 'error_type',
    viewLevel: 60,     // Admin+ can view
    editLevel: 70,     // Admin lvl 2+ (70+) can edit
  },
  {
    field: 'error_message',
    viewLevel: 60,     // Admin+ can view
    editLevel: 70,     // Admin lvl 2+ (70+) can edit
  },
  {
    field: 'system_info',
    viewLevel: 60,     // Admin+ can view
    editLevel: 80,     // Admin lvl 3 (80+) can modify system info
  },

  // ═══════════════════════════════════════════════════════════════
  // RESOLUTION - Public view, Admin lvl 2+ edit
  // ═══════════════════════════════════════════════════════════════
  {
    field: 'resolution',
    viewLevel: 1,      // Everyone can see solution
    editLevel: 70,     // Admin lvl 2+ (70+) can document resolution
    conditions: {
      requiresStatus: ['resolved', 'closed'], // Only editable when resolved
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // TIMESTAMPS - Read-only for all
  // ═══════════════════════════════════════════════════════════════
  {
    field: 'created_at',
    viewLevel: 1,
    editLevel: null,
  },
  {
    field: 'updated_at',
    viewLevel: 1,
    editLevel: null,
  },
  {
    field: 'resolved_at',
    viewLevel: 1,
    editLevel: null,
  },
  {
    field: 'closed_at',
    viewLevel: 1,
    editLevel: null,
  },
  {
    field: 'deleted_at',
    viewLevel: 60,     // Only expert+ sees deletion timestamp
    editLevel: null,
  },

  // ═══════════════════════════════════════════════════════════════
  // ATTACHMENTS - Standard+ view, Admin lvl 2+ manage
  // ═══════════════════════════════════════════════════════════════
  {
    field: 'attachments',
    viewLevel: 30,     // Standard+ can view attachments
    editLevel: 70,     // Admin lvl 2+ (70+) can add/remove attachments
  },

];

/**
 * Get field permission definition by field name
 *
 * @param fieldName - Name of the field to look up
 * @returns FieldPermission or undefined if not found
 */
export function getIssueFieldPermission(fieldName: string): FieldPermission | undefined {
  return ISSUE_FIELD_PERMISSIONS.find(p => p.field === fieldName);
}

/**
 * Get all Issue field names
 *
 * @returns Array of field names
 */
export function getIssueFieldNames(): string[] {
  return ISSUE_FIELD_PERMISSIONS.map(p => p.field);
}
