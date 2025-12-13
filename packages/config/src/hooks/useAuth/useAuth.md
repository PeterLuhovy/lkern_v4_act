# ================================================================
# useAuth
# ================================================================
# File: L:\system\lkern_codebase_v4_act\packages\config\src\hooks\useAuth\useAuth.md
# Version: 2.0.0
# Created: 2025-11-22
# Updated: 2025-12-10
# Hook Location: packages/config/src/hooks/useAuth/useAuth.ts
# Package: @l-kern/config
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Authentication hook providing current user data and permission checking.
#   Mock implementation for development - to be replaced with real lkms-auth service.
# ================================================================

---

## Overview

**Purpose**: Access current user authentication state and check permissions
**Package**: @l-kern/config
**Path**: packages/config/src/hooks/useAuth
**Since**: v1.0.0 (Current: v2.0.0)

🚨 **DEVELOPMENT TOOL - FOR TESTING ONLY**

The useAuth hook provides access to the current user's authentication state and permission checking functionality. It reads data from AuthContext which manages user sessions and permission levels (0-100). The hook returns user information, authentication status, and a hasPermission() function for checking specific permissions based on user role.

**Must be replaced with real authentication when lkms-auth microservice is implemented.**

---

## Features

- ✅ **Current User Access**: Returns logged-in user object (id, name, email, role, permissionLevel)
- ✅ **Authentication Status**: Boolean indicating if user is authenticated
- ✅ **Permission Checking**: hasPermission() function for 14 permission types
- ✅ **Role-Based Logic**: 3 roles (basic, standard, advanced) with different permission sets
- ✅ **Type Safety**: Full TypeScript support with Permission union type
- ✅ **Context Integration**: Reads from centralized AuthContext
- ✅ **Test User Support**: Works with AuthRoleSwitcher for permission testing
- ✅ **Mock Implementation**: Simulates real auth until lkms-auth is ready

---

## Quick Start

### Basic Usage

```tsx
import { useAuth } from '@l-kern/config';

function MyComponent() {
  const { user, isAuthenticated, hasPermission } = useAuth();

  if (!isAuthenticated) {
    return <p>Please log in</p>;
  }

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <p>Permission Level: {user.permissionLevel}</p>

      {hasPermission('create_issue') && (
        <button>Create New Issue</button>
      )}
    </div>
  );
}
```

### Common Patterns

#### Pattern 1: Conditional Rendering Based on Permission

```tsx
import { useAuth } from '@l-kern/config';

function IssueActions({ issueId }: { issueId: string }) {
  const { hasPermission } = useAuth();

  return (
    <div className="issue-actions">
      {hasPermission('view_issue') && (
        <button onClick={() => viewIssue(issueId)}>View</button>
      )}

      {hasPermission('edit_issue') && (
        <button onClick={() => editIssue(issueId)}>Edit</button>
      )}

      {hasPermission('delete_issue') && (
        <button onClick={() => deleteIssue(issueId)}>Delete</button>
      )}
    </div>
  );
}
```

#### Pattern 2: Protecting Entire Page

```tsx
import { useAuth } from '@l-kern/config';
import { Navigate } from 'react-router-dom';

function AdminPage() {
  const { isAuthenticated, hasPermission } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!hasPermission('delete')) {
    return <p>Access denied. Admin permissions required.</p>;
  }

  return <div>{/* Admin content */}</div>;
}
```

#### Pattern 3: Displaying User Info

```tsx
import { useAuth } from '@l-kern/config';

function UserProfile() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>Role: {user.role}</p>
      <p>Permission Level: {user.permissionLevel}/100</p>
    </div>
  );
}
```

---

## API Reference

### Function Signature

```typescript
function useAuth(): UseAuthResult
```

### Parameters

**None** - This hook takes no parameters.

### Return Value

```typescript
interface UseAuthResult {
  user: User | null;              // Current user object (null if not authenticated)
  isAuthenticated: boolean;       // True if user is logged in
  hasPermission: (permission: Permission) => boolean; // Permission checking function
}
```

| Return Property | Type | Description |
|-----------------|------|-------------|
| `user` | `User \| null` | Current user object containing id, name, email, role, permissionLevel. Null if not authenticated. |
| `isAuthenticated` | `boolean` | Authentication status. True if user is logged in, false otherwise. |
| `hasPermission` | `(permission: Permission) => boolean` | Function to check if current user has a specific permission. Returns false if user is null. |

### User Interface

```typescript
interface User {
  id: string;                    // User UUID (e.g., "550e8400-e29b-41d4-a716-446655440001")
  name: string;                  // Display name (e.g., "Peter Luhový")
  email: string;                 // Email address (e.g., "peter@lra.sk")
  role: UserRole;                // User role ('basic' | 'standard' | 'advanced')
  permissionLevel: number;       // Numeric permission level (0-100)
  exportBehavior?: 'automatic' | 'save-as-dialog'; // Export file behavior preference
}
```

### Permission Type

```typescript
type Permission =
  | 'create'           // General create permission
  | 'edit'             // General edit permission
  | 'delete'           // General delete permission
  | 'view'             // General view permission
  | 'create_issue'     // Create issues specifically
  | 'edit_issue'       // Edit issues specifically
  | 'delete_issue'     // Delete issues specifically
  | 'view_issue'       // View issues specifically
  | 'create_contact'   // Create contacts specifically
  | 'edit_contact'     // Edit contacts specifically
  | 'delete_contact'   // Delete contacts specifically
  | 'view_contact';    // View contacts specifically
```

### User Roles

| Role | Permission Level | Permissions |
|------|------------------|-------------|
| **basic** | 0-29 | View only (view, view_issue, view_contact) |
| **standard** | 30-59 | Create + View (create, view, create_issue, view_issue, create_contact, view_contact) |
| **advanced** | 60-100 | All permissions (full access) |

---

## Behavior

### Internal Logic

**Context Integration:**
- Hook calls `useAuthContext()` to access AuthContext
- AuthContext manages global user state and permission level
- All components using useAuth share the same user data

**Permission Checking Logic:**
```typescript
// hasPermission() implementation:
1. Safety check: If user is null, return false
2. Read user.role
3. If role === 'advanced', return true (full access)
4. If role === 'standard', check against standard permission list
5. If role === 'basic', check against basic permission list (view only)
6. Default: return false
```

**State Management:**
- No local state - reads from AuthContext
- User changes propagate to all components using useAuth
- AuthContext manages localStorage persistence

**Side Effects:**
- **None** - This hook has no side effects
- Read-only access to AuthContext state
- Permission checking is pure function (no state mutations)

### Dependencies

**React Hooks Used:**
- None directly (AuthContext uses useState, useEffect internally)

**Context Dependencies:**
- `useAuthContext` from `@l-kern/config` (required)

**External Dependencies:**
- None

### Memoization

**Not applicable** - Hook returns fresh values from context on each render. Context handles memoization internally via useMemo.

---

## Permission Matrix

### Basic Role (Permission Level 0-29)

| Permission | Allowed | Notes |
|------------|---------|-------|
| view | ✅ Yes | General view permission |
| view_issue | ✅ Yes | Can view issues |
| view_contact | ✅ Yes | Can view contacts |
| create | ❌ No | Cannot create |
| edit | ❌ No | Cannot edit |
| delete | ❌ No | Cannot delete |
| create_issue | ❌ No | Cannot create issues |
| edit_issue | ❌ No | Cannot edit issues |
| delete_issue | ❌ No | Cannot delete issues |
| create_contact | ❌ No | Cannot create contacts |
| edit_contact | ❌ No | Cannot edit contacts |
| delete_contact | ❌ No | Cannot delete contacts |

### Standard Role (Permission Level 30-59)

| Permission | Allowed | Notes |
|------------|---------|-------|
| view | ✅ Yes | General view permission |
| view_issue | ✅ Yes | Can view issues |
| view_contact | ✅ Yes | Can view contacts |
| create | ✅ Yes | General create permission |
| create_issue | ✅ Yes | Can create issues |
| create_contact | ✅ Yes | Can create contacts |
| edit | ❌ No | Cannot edit |
| delete | ❌ No | Cannot delete |
| edit_issue | ❌ No | Cannot edit issues |
| delete_issue | ❌ No | Cannot delete issues |
| edit_contact | ❌ No | Cannot edit contacts |
| delete_contact | ❌ No | Cannot delete contacts |

### Advanced Role (Permission Level 60-100)

| Permission | Allowed | Notes |
|------------|---------|-------|
| **ALL** | ✅ Yes | Full access to all permissions |

---

## Examples

### Example 1: Simple Permission Check

```tsx
import { useAuth } from '@l-kern/config';

function CreateButton() {
  const { hasPermission } = useAuth();

  if (!hasPermission('create')) {
    return null; // Hide button if no permission
  }

  return <button>Create New Item</button>;
}
```

### Example 2: Multiple Permission Checks

```tsx
import { useAuth } from '@l-kern/config';

function IssueToolbar({ issueId }: { issueId: string }) {
  const { hasPermission } = useAuth();

  const canEdit = hasPermission('edit_issue');
  const canDelete = hasPermission('delete_issue');

  return (
    <div className="toolbar">
      {canEdit && <button>Edit</button>}
      {canDelete && <button>Delete</button>}
    </div>
  );
}
```

### Example 3: User Info Display

```tsx
import { useAuth } from '@l-kern/config';

function UserBadge() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <button>Log In</button>;
  }

  return (
    <div className="user-badge">
      <span>{user.name}</span>
      <span className="role-badge">{user.role}</span>
    </div>
  );
}
```

### Example 4: Protected Route Component

```tsx
import { useAuth } from '@l-kern/config';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({
  children,
  requiredPermission,
}: {
  children: React.ReactNode;
  requiredPermission: Permission;
}) {
  const { isAuthenticated, hasPermission } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!hasPermission(requiredPermission)) {
    return <Navigate to="/access-denied" />;
  }

  return <>{children}</>;
}

// Usage:
<ProtectedRoute requiredPermission="delete">
  <AdminPanel />
</ProtectedRoute>
```

### Example 5: Conditional Form Fields

```tsx
import { useAuth } from '@l-kern/config';

function ContactForm() {
  const { hasPermission } = useAuth();

  const canEdit = hasPermission('edit_contact');
  const canDelete = hasPermission('delete_contact');

  return (
    <form>
      <input type="text" name="name" disabled={!canEdit} />
      <input type="email" name="email" disabled={!canEdit} />

      {canEdit && <button type="submit">Save</button>}
      {canDelete && <button type="button">Delete Contact</button>}
    </form>
  );
}
```

---

## Known Issues

### Current Known Issues

- ⚠️ **MOCK IMPLEMENTATION**: Not real authentication - uses AuthContext with test users
  - **Tracking**: Task #1.200 Authentication Service
  - **Impact**: Permissions are simulated, no real JWT tokens or session management
  - **Workaround**: Use AuthRoleSwitcher for testing different permission levels

- ⚠️ **Hardcoded Permission Logic**: Permission matrix is hardcoded in hasPermission()
  - **Tracking**: Task #1.200 Authentication Service
  - **Impact**: Cannot customize permissions without code changes
  - **Workaround**: Will be replaced with backend-driven permissions from lkms-auth

- ⚠️ **No Token Refresh**: No session timeout or token refresh mechanism
  - **Tracking**: Task #1.200 Authentication Service
  - **Impact**: User stays logged in indefinitely
  - **Workaround**: Manual logout required

### Resolved Issues

- ✅ **FIXED (v2.0.0)**: Hook now returns user object from AuthContext correctly
- ✅ **FIXED (v2.0.0)**: Type safety improved with explicit Permission type

---

## Testing

### Test Coverage

- **Unit Tests**: Not yet implemented
- **Integration Tests**: Tested via AuthContext tests
- **Component Tests**: Tested via components using useAuth

### Key Test Cases

1. **Returns user from AuthContext**
   ```tsx
   const { user } = useAuth();
   expect(user).toEqual({ id: '...', name: '...', role: 'advanced', ... });
   ```

2. **Returns authentication status**
   ```tsx
   const { isAuthenticated } = useAuth();
   expect(isAuthenticated).toBe(true);
   ```

3. **hasPermission returns true for advanced role**
   ```tsx
   const { hasPermission } = useAuth();
   expect(hasPermission('delete')).toBe(true);
   ```

4. **hasPermission returns false for basic role (delete)**
   ```tsx
   // Set permission level to 10 (basic)
   const { hasPermission } = useAuth();
   expect(hasPermission('delete')).toBe(false);
   ```

5. **hasPermission returns true for standard role (create)**
   ```tsx
   // Set permission level to 45 (standard)
   const { hasPermission } = useAuth();
   expect(hasPermission('create')).toBe(true);
   ```

6. **hasPermission returns false when user is null**
   ```tsx
   // Simulate logged-out state
   const { hasPermission } = useAuth();
   expect(hasPermission('view')).toBe(false);
   ```

---

## Related Components

- [AuthContext](../../contexts/AuthContext/AuthContext.md) - Context providing user state and permission level
- [AuthRoleSwitcher](../../../../ui-components/src/components/AuthRoleSwitcher/AuthRoleSwitcher.md) - Development tool for testing permissions
- ProtectedRoute - Route guard using hasPermission (to be implemented)

---

## Migration Guide

### From v1.x to v2.0.0

**No breaking changes** - Hook API remains the same.

**Changes:**
- User object now includes permissionLevel (0-100)
- Role is now derived from permissionLevel
- Permission checking logic unchanged

**Migration Steps:**
1. No code changes required
2. Test existing permission checks
3. Optional: Update to use permissionLevel if needed

---

## Best Practices

1. **Always check isAuthenticated first** - Before accessing user object
2. **Use hasPermission for UI logic** - Show/hide buttons based on permissions
3. **Check permissions at route level** - Use ProtectedRoute wrapper for entire pages
4. **Don't bypass permission checks** - Always respect hasPermission() result
5. **Test with multiple roles** - Use AuthRoleSwitcher to verify UI works for all roles
6. **Prepare for real auth** - Don't hardcode assumptions about mock behavior
7. **Handle null user safely** - Always check if user exists before accessing properties

---

## Changelog

### v2.0.0 (2025-11-22)
- ✅ Updated to work with AuthContext v4.0.0 (test user switching)
- ✅ User object now includes test user IDs
- ✅ Improved type safety with explicit Permission type export

### v1.0.0 (2025-11-22)
- ✅ Initial implementation
- ✅ 3 roles: basic, standard, advanced
- ✅ 14 permission types
- ✅ hasPermission() function
- ⚠️ Mock implementation (to be replaced with real auth)

---

**End of useAuth Documentation**
