/*
 * ================================================================
 * FILE: useAuth.ts
 * PATH: /packages/config/src/hooks/useAuth/useAuth.ts
 * DESCRIPTION: Authentication hook - reads from AuthContext
 * VERSION: v2.0.0
 * CREATED: 2025-11-22
 * UPDATED: 2025-11-22
 * ================================================================
 */

import { useAuthContext } from '../../contexts/AuthContext/AuthContext';

/**
 * Re-export types from AuthContext for convenience
 */
export type { UserRole, User } from '../../contexts/AuthContext/AuthContext';

/**
 * Permission types in the system
 */
export type Permission =
  | 'create'
  | 'edit'
  | 'delete'
  | 'view'
  | 'create_issue'
  | 'edit_issue'
  | 'delete_issue'
  | 'view_issue'
  | 'create_contact'
  | 'edit_contact'
  | 'delete_contact'
  | 'view_contact';

/**
 * useAuth Hook
 *
 * 🚨 MOCK IMPLEMENTATION - FOR DEVELOPMENT ONLY
 *
 * Reads current authorization role from AuthContext.
 * Provides permission checking based on role.
 *
 * TODO: Replace with real auth when lkms-auth microservice is implemented
 *
 * Current behavior:
 * - Reads user from AuthContext (selected via AuthRoleSwitcher)
 * - hasPermission() returns true/false based on role
 * - Sends authorization key in API calls
 *
 * Future implementation:
 * - Connect to lkms-auth microservice
 * - Read JWT token from localStorage/cookies
 * - Validate token with backend
 * - Get real user data and permissions from auth service
 */
export const useAuth = () => {
  const { user, isAuthenticated } = useAuthContext();

  /**
   * Check if current user has a specific permission
   *
   * @param permission - Permission to check
   * @returns true if user has permission, false otherwise
   */
  const hasPermission = (permission: Permission): boolean => {
    // Safety check: return false if user is not loaded yet
    if (!user) return false;

    const { role } = user;

    // Advanced: Full access (all permissions)
    if (role === 'advanced') return true;

    // Standard: Create + View (no edit/delete)
    if (role === 'standard') {
      if (['create', 'view', 'create_issue', 'view_issue', 'create_contact', 'view_contact'].includes(permission)) {
        return true;
      }
      return false;
    }

    // Basic: Read-only (view only)
    if (role === 'basic') {
      if (['view', 'view_issue', 'view_contact'].includes(permission)) {
        return true;
      }
      return false;
    }

    return false;
  };

  return {
    user,
    isAuthenticated,
    hasPermission,
  };
};
