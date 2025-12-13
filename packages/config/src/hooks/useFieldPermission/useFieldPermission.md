# ================================================================
# useFieldPermission
# ================================================================
# File: L:\system\lkern_codebase_v4_act\packages\config\src\hooks\useFieldPermission\useFieldPermission.md
# Version: 1.0.0
# Created: 2025-11-29
# Updated: 2025-12-10
# Hook Location: packages/config/src/hooks/useFieldPermission/useFieldPermission.ts
# Package: @l-kern/config
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   React hook for field-level permission checking with access levels (editable,
#   read-only, hidden), convenience booleans, and translated reason messages.
# ================================================================

---

## Overview

**Purpose**: Check field-level permissions and access levels for entity fields
**Package**: @l-kern/config
**Path**: packages/config/src/hooks/useFieldPermission
**Since**: v1.0.0

The useFieldPermission hook provides field-level permission checking for entity fields (Issues, Contacts, etc.). It returns access levels (editable, read-only, hidden), convenience boolean helpers (canView, canEdit), and translated reason messages for disabled fields. The hook reads current user permission level from AuthContext, applies field-level rules based on entity status and ownership, and provides both single-field and batch variants for efficient permission checking across multiple fields.

---

## Features

- ✅ **3 Access Levels**: editable, read-only, hidden
- ✅ **Convenience Booleans**: canView (not hidden), canEdit (is editable)
- ✅ **Translated Reasons**: Localized messages for tooltips (e.g., "Field locked while closed")
- ✅ **Context-Aware**: Checks entity status, ownership, workflow state
- ✅ **Batch Variant**: useFieldPermissions() for checking multiple fields at once
- ✅ **Issue-Specific Wrapper**: useIssueFieldPermissions() convenience function
- ✅ **Memoized Results**: Prevents unnecessary re-renders
- ✅ **Type-Safe**: Full TypeScript support with entity types
- ✅ **Reason Keys**: Returns translation keys for custom UI messages

---

## Quick Start

### Basic Usage

```tsx
import { useFieldPermission } from '@l-kern/config';

function IssueAssigneeField({ issue }: { issue: Issue }) {
  const { canView, canEdit, translatedReason } = useFieldPermission(
    'issue',
    'assignee_id',
    { entityStatus: issue.status }
  );

  if (!canView) {
    return null; // Field hidden
  }

  return (
    <FormField label="Assignee" disabled={!canEdit} disabledTooltip={translatedReason}>
      <Select
        value={issue.assignee_id}
        onChange={(value) => updateIssue({ assignee_id: value })}
        disabled={!canEdit}
      />
    </FormField>
  );
}
```

### Common Patterns

#### Pattern 1: Multiple Fields with Batch Check

```tsx
import { useFieldPermissions } from '@l-kern/config';

function IssueEditForm({ issue }: { issue: Issue }) {
  const perms = useFieldPermissions('issue', ['title', 'severity', 'status', 'assignee_id'], {
    entityStatus: issue.status,
  });

  return (
    <form>
      {perms.title.canView && (
        <FormField label="Title" disabled={!perms.title.canEdit} disabledTooltip={perms.title.translatedReason}>
          <Input value={issue.title} disabled={!perms.title.canEdit} />
        </FormField>
      )}

      {perms.severity.canView && (
        <FormField label="Severity" disabled={!perms.severity.canEdit}>
          <Select value={issue.severity} disabled={!perms.severity.canEdit} />
        </FormField>
      )}

      {perms.status.canView && (
        <FormField label="Status" disabled={!perms.status.canEdit}>
          <Select value={issue.status} disabled={!perms.status.canEdit} />
        </FormField>
      )}

      {perms.assignee_id.canView && (
        <FormField label="Assignee" disabled={!perms.assignee_id.canEdit}>
          <Select value={issue.assignee_id} disabled={!perms.assignee_id.canEdit} />
        </FormField>
      )}
    </form>
  );
}
```

#### Pattern 2: Issue-Specific Convenience Wrapper

```tsx
import { useIssueFieldPermissions } from '@l-kern/config';

function IssueForm({ issue }: { issue: Issue }) {
  // Convenience wrapper for Issue entity
  const perms = useIssueFieldPermissions(['title', 'description', 'severity'], {
    entityStatus: issue.status,
    ownership: issue.created_by === currentUserId ? 'owner' : 'other',
  });

  return (
    <form>
      <FormField disabled={!perms.title.canEdit}>
        <Input value={issue.title} />
      </FormField>

      <FormField disabled={!perms.description.canEdit}>
        <Textarea value={issue.description} />
      </FormField>

      <FormField disabled={!perms.severity.canEdit}>
        <Select value={issue.severity} />
      </FormField>
    </form>
  );
}
```

#### Pattern 3: Read-Only Display Based on Access

```tsx
import { useFieldPermission } from '@l-kern/config';

function ContactEmailField({ contact }: { contact: Contact }) {
  const { access, canEdit, translatedReason } = useFieldPermission('contact', 'email');

  // Show different UI based on access level
  if (access === 'hidden') {
    return null;
  }

  if (access === 'read-only') {
    return (
      <div className="read-only-field" title={translatedReason}>
        <label>Email</label>
        <span>{contact.email}</span>
        <LockIcon />
      </div>
    );
  }

  // Editable
  return (
    <FormField label="Email">
      <Input type="email" value={contact.email} />
    </FormField>
  );
}
```

#### Pattern 4: Dynamic Form Based on Permissions

```tsx
import { useFieldPermissions } from '@l-kern/config';

function DynamicIssueForm({ issue }: { issue: Issue }) {
  const fieldNames = ['title', 'description', 'severity', 'status', 'assignee_id', 'tags'];
  const perms = useFieldPermissions('issue', fieldNames, { entityStatus: issue.status });

  // Get only visible fields
  const visibleFields = fieldNames.filter((field) => perms[field].canView);

  return (
    <form>
      {visibleFields.map((field) => {
        const perm = perms[field];

        return (
          <FormField
            key={field}
            label={field}
            disabled={!perm.canEdit}
            disabledTooltip={perm.translatedReason}
          >
            <DynamicInput field={field} value={issue[field]} disabled={!perm.canEdit} />
          </FormField>
        );
      })}
    </form>
  );
}
```

---

## API Reference

### Function Signature

```typescript
function useFieldPermission(
  entityType: PermissionEntity,
  fieldName: string,
  context?: PermissionContext
): UseFieldPermissionResult
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `entityType` | `PermissionEntity` | Yes | Entity type ('issue', 'contact', etc.) |
| `fieldName` | `string` | Yes | Field name to check (e.g., 'assignee_id', 'title') |
| `context` | `PermissionContext` | No | Optional context (status, ownership, workflow state) |

### Context

```typescript
interface PermissionContext {
  entityType?: PermissionEntity;     // Override entity type
  entityStatus?: string;             // Entity status (e.g., 'open', 'closed')
  ownership?: 'owner' | 'other';     // User ownership
  workflowState?: string;            // Workflow state (for advanced rules)
}

type PermissionEntity = 'issue' | 'contact' | string;
```

### Return Value

```typescript
interface UseFieldPermissionResult {
  access: 'editable' | 'read-only' | 'hidden'; // Access level
  reasonKey?: string;                          // Translation key for reason
  translatedReason?: string;                   // Translated reason message
  canView: boolean;                            // Convenience: access !== 'hidden'
  canEdit: boolean;                            // Convenience: access === 'editable'
}
```

| Return Property | Type | Description |
|-----------------|------|-------------|
| `access` | `'editable' \| 'read-only' \| 'hidden'` | Field access level |
| `reasonKey` | `string \| undefined` | Translation key for reason (e.g., 'permissions.fieldLocked.closed') |
| `translatedReason` | `string \| undefined` | Translated reason message for tooltips |
| `canView` | `boolean` | Convenience boolean. True if access !== 'hidden'. |
| `canEdit` | `boolean` | Convenience boolean. True if access === 'editable'. |

---

## Batch Variant API

### Function Signature

```typescript
function useFieldPermissions(
  entityType: PermissionEntity,
  fieldNames: string[],
  context?: PermissionContext
): UseFieldPermissionsResult
```

### Batch Return Value

```typescript
type UseFieldPermissionsResult = Record<string, UseFieldPermissionResult>;

// Example:
{
  title: { access: 'editable', canView: true, canEdit: true, ... },
  severity: { access: 'read-only', canView: true, canEdit: false, reasonKey: '...', ... },
  assignee_id: { access: 'hidden', canView: false, canEdit: false, ... },
}
```

---

## Issue-Specific Wrapper API

### Function Signature

```typescript
function useIssueFieldPermissions(
  fieldNames: string[],
  context?: Omit<PermissionContext, 'entityType'>
): UseFieldPermissionsResult
```

**Note**: This is a convenience wrapper that automatically sets `entityType: 'issue'`.

---

## Behavior

### Internal Logic

**Permission Checking Flow:**
1. Read current user's `permissionLevel` from AuthContext
2. Call `getFieldAccess()` from permissions system with: entityType, fieldName, permissionLevel, context
3. Permission system applies field-level rules based on:
   - User permission level (0-100)
   - Entity status (e.g., closed issues → read-only)
   - Ownership (owner vs other user)
   - Workflow state (custom workflow rules)
4. Return access level ('editable', 'read-only', 'hidden')
5. Hook extends result with: canView, canEdit, translatedReason

**Access Level Rules (Typical):**
- **Permission Level < 30**: Most fields read-only or hidden
- **Permission Level 30-59**: Can edit own entities, view others
- **Permission Level 60+**: Can edit most fields
- **Status = 'closed'**: Most fields read-only (except admins)
- **Ownership = 'other'**: Limited edit access (depends on permission level)

**State Management:**
- Uses `useMemo` to cache permission results
- Re-computes only when dependencies change (entityType, fieldName, permissionLevel, context)
- No internal state - pure computation based on props

**Translation:**
- If reasonKey exists, translates using `t(reasonKey)`
- Translation examples: "Field locked while issue is closed", "Insufficient permissions"

### Dependencies

**React Hooks Used:**
- `useMemo` - Memoizes permission results

**Context Dependencies:**
- `useAuthContext` - Reads current user permission level
- `useTranslation` - Translates reason keys

**Utility Dependencies:**
- `getFieldAccess` from `../../permissions/index` - Core permission checking function
- `getFieldsAccess` from `../../permissions/index` - Batch permission checking

### Memoization

**useMemo Dependencies:**
- Single field: `[entityType, fieldName, permissionLevel, context, t]`
- Batch fields: `[entityType, fieldNames, permissionLevel, context, t]`

**Why Memoization Matters:**
- Prevents unnecessary permission recalculations
- Avoids re-renders when props haven't changed
- Efficient for forms with many fields

---

## Examples

### Example 1: Simple Field Check

```tsx
import { useFieldPermission } from '@l-kern/config';

function StatusBadge({ issue }: { issue: Issue }) {
  const { canView } = useFieldPermission('issue', 'status');

  if (!canView) return null;

  return <Badge>{issue.status}</Badge>;
}
```

### Example 2: Conditional Edit Button

```tsx
import { useFieldPermission } from '@l-kern/config';

function IssueActions({ issue }: { issue: Issue }) {
  const { canEdit: canEditTitle } = useFieldPermission('issue', 'title', {
    entityStatus: issue.status,
  });

  const { canEdit: canEditStatus } = useFieldPermission('issue', 'status', {
    entityStatus: issue.status,
  });

  return (
    <div>
      {canEditTitle && <Button>Edit Title</Button>}
      {canEditStatus && <Button>Change Status</Button>}
    </div>
  );
}
```

### Example 3: Form with Disabled Tooltips

```tsx
import { useFieldPermissions } from '@l-kern/config';

function IssueDetailsForm({ issue }: { issue: Issue }) {
  const perms = useFieldPermissions('issue', ['title', 'description', 'severity'], {
    entityStatus: issue.status,
  });

  return (
    <form>
      <FormField
        label="Title"
        disabled={!perms.title.canEdit}
        disabledTooltip={perms.title.translatedReason}
      >
        <Input value={issue.title} />
      </FormField>

      <FormField
        label="Description"
        disabled={!perms.description.canEdit}
        disabledTooltip={perms.description.translatedReason}
      >
        <Textarea value={issue.description} />
      </FormField>

      <FormField
        label="Severity"
        disabled={!perms.severity.canEdit}
        disabledTooltip={perms.severity.translatedReason}
      >
        <Select value={issue.severity} />
      </FormField>
    </form>
  );
}
```

---

## Known Issues

**No known issues** - Hook is stable and production-ready.

---

## Testing

### Test Coverage

- **Unit Tests**: Not yet implemented
- **Integration Tests**: Tested via permission system tests

### Key Test Cases

1. **Returns correct access level for each permission level**
2. **canView is false when access is 'hidden'**
3. **canEdit is true when access is 'editable'**
4. **translatedReason contains translated text**
5. **Batch variant returns correct permissions for all fields**
6. **Issue-specific wrapper sets entityType correctly**
7. **Memoization prevents unnecessary recalculations**

---

## Related Components

- [useAuth](../useAuth/useAuth.md) - Authentication hook (provides permission level)
- [FormField](../../../../ui-components/src/components/FormField/FormField.md) - Form field with disabled tooltip support
- [permissions system](../../permissions/README.md) - Core permission checking logic

---

## Best Practices

1. **Use batch variant for forms** - More efficient than multiple individual checks
2. **Always handle hidden fields** - Check canView before rendering
3. **Show disabled tooltips** - Use translatedReason for user feedback
4. **Pass entity context** - Include entityStatus, ownership for accurate checks
5. **Use Issue wrapper for Issues** - useIssueFieldPermissions() for convenience
6. **Test with different permission levels** - Verify UI works for all user roles
7. **Handle null context gracefully** - Permission checks should work without context
8. **Cache permission results** - Hook uses useMemo, but avoid recalculating in render

---

## Changelog

### v1.0.0 (2025-11-29)
- ✅ Initial implementation
- ✅ Single field permission checking
- ✅ Batch field permission checking
- ✅ Issue-specific convenience wrapper
- ✅ Translated reason messages
- ✅ Memoized results for performance

---

**End of useFieldPermission Documentation**
