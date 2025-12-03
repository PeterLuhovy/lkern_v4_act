/*
 * ================================================================
 * FILE: AuthContext.tsx
 * PATH: /packages/config/src/contexts/AuthContext/AuthContext.tsx
 * DESCRIPTION: Authorization context with numeric permission level (0-100)
 *              and centralized permission checks (DRY)
 * VERSION: v3.1.0
 * CREATED: 2025-11-22
 * UPDATED: 2025-11-24
 * CHANGES:
 *   - v3.1.0: Added centralized permissions object (canView, canCreate, canEdit, canDelete, canExport, canViewDeleted)
 *   - v3.0.0: Initial numeric permission system (0-100)
 * ================================================================
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  getStoredPermissionLevel,
  setStoredPermissionLevel,
  getBackendRole,
  QUICK_PERMISSION_LEVELS,
  canView,
  canCreate,
  canEdit,
  canDelete,
  canExport,
  canViewDeleted,
} from '../../permissions/index';

/**
 * User permission levels in the system (DEPRECATED - Use permissionLevel instead)
 * - basic: Read-only access (view only) - level 0-29 (default: 30)
 * - standard: Standard user (create, view) - level 30-59 (default: 60)
 * - advanced: Full access (create, edit, delete, view) - level 60-100 (default: 100)
 */
export type UserRole = 'basic' | 'standard' | 'advanced';

/**
 * User interface
 */
export interface User {
  id: string;
  name: string;
  email: string;
  permissionLevel: number; // 0-100
  role: UserRole; // Derived from permissionLevel for backward compatibility
}

/**
 * Hardcoded authorization keys for each permission level
 * 🚨 TEMPORARY - Will be replaced with JWT tokens when lkms-auth is ready
 */
const ROLE_AUTH_KEYS: Record<UserRole, string> = {
  basic: 'basic-key-L-KERN-2025',
  standard: 'standard-key-L-KERN-2025',
  advanced: 'advanced-key-L-KERN-2025',
};

/**
 * Generate mock user based on permission level
 */
function generateMockUser(permissionLevel: number): User {
  const role = getRoleFromPermissionLevel(permissionLevel);
  const roleNames: Record<UserRole, string> = {
    basic: 'Základný používateľ',
    standard: 'Štandardný používateľ',
    advanced: 'Pokročilý používateľ',
  };
  const roleEmails: Record<UserRole, string> = {
    basic: 'basic@lkern.local',
    standard: 'standard@lkern.local',
    advanced: 'advanced@lkern.local',
  };
  const roleIds: Record<UserRole, string> = {
    basic: '550e8400-e29b-41d4-a716-446655440001',
    standard: '550e8400-e29b-41d4-a716-446655440002',
    advanced: '550e8400-e29b-41d4-a716-446655440003',
  };

  return {
    id: roleIds[role],
    name: `${roleNames[role]} (${permissionLevel})`,
    email: roleEmails[role],
    permissionLevel,
    role,
  };
}

/**
 * Get role from permission level for backward compatibility
 * - Basic: 0-29
 * - Standard: 30-59
 * - Advanced: 60-100
 */
function getRoleFromPermissionLevel(level: number): UserRole {
  if (level >= 60) return 'advanced';
  if (level >= 30) return 'standard';
  return 'basic';
}

/**
 * Computed permissions based on permission level
 */
export interface Permissions {
  /** Can view issues (level >= 1) */
  canView: boolean;
  /** Can create new issues (level >= 30) */
  canCreate: boolean;
  /** Can edit issues (level >= 60) */
  canEdit: boolean;
  /** Can delete issues (level >= 60) */
  canDelete: boolean;
  /** Can export data (level >= 60) */
  canExport: boolean;
  /** Can view soft-deleted issues (level >= 60) */
  canViewDeleted: boolean;
}

/**
 * Auth context interface
 */
interface AuthContextType {
  /** Current user based on permission level */
  user: User;
  /** Current authorization key for API calls */
  authKey: string;
  /** Current permission level (0-100) */
  permissionLevel: number;
  /** Change the permission level (triggers re-render) */
  setPermissionLevel: (level: number) => void;
  /** Current role (DEPRECATED - derived from permissionLevel) */
  currentRole: UserRole;
  /** Change the current role (DEPRECATED - use setPermissionLevel) */
  setRole: (role: UserRole) => void;
  /** Check if authenticated (always true in mock) */
  isAuthenticated: boolean;
  /** Computed permissions (DRY - calculated once in context) */
  permissions: Permissions;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component
 *
 * 🚨 MOCK IMPLEMENTATION - FOR DEVELOPMENT ONLY
 *
 * Provides authorization context with numeric permission level (0-100).
 * Selected level is stored in localStorage and persists across page refreshes.
 *
 * Features:
 * - Numeric permission levels (0-100)
 * - Quick access levels: 15 (basic), 45 (standard), 75 (advanced)
 * - Hardcoded authorization keys mapped from derived role
 * - localStorage persistence
 * - Mock user data based on permission level
 * - Centralized permissions object (DRY - calculated once, used everywhere)
 *
 * TODO: Replace with real authentication when lkms-auth microservice is ready
 * - Read JWT token from localStorage
 * - Validate token with backend
 * - Get real user data from auth service
 * - Get permission level from user's role/permissions
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [permissionLevel, setPermissionLevelState] = useState<number>(() => {
    // Load permission level from localStorage or default to 30 (basic)
    return getStoredPermissionLevel();
  });

  // Save permission level to localStorage when it changes
  useEffect(() => {
    setStoredPermissionLevel(permissionLevel);
  }, [permissionLevel]);

  // Generate user based on current permission level
  const user = generateMockUser(permissionLevel);
  const currentRole = user.role;

  // Backward compatibility: setRole function that converts role to permission level
  const setRole = (role: UserRole) => {
    const levelMap: Record<UserRole, number> = {
      basic: QUICK_PERMISSION_LEVELS.BASIC,
      standard: QUICK_PERMISSION_LEVELS.STANDARD,
      advanced: QUICK_PERMISSION_LEVELS.ADVANCED,
    };
    setPermissionLevelState(levelMap[role]);
  };

  // Compute permissions once (memoized for performance)
  const permissions: Permissions = useMemo(() => ({
    canView: canView(permissionLevel),
    canCreate: canCreate(permissionLevel),
    canEdit: canEdit(permissionLevel),
    canDelete: canDelete(permissionLevel),
    canExport: canExport(permissionLevel),
    canViewDeleted: canViewDeleted(permissionLevel),
  }), [permissionLevel]);

  const value: AuthContextType = {
    user,
    authKey: ROLE_AUTH_KEYS[currentRole],
    permissionLevel,
    setPermissionLevel: setPermissionLevelState,
    currentRole,
    setRole,
    isAuthenticated: true, // TODO: Replace with real auth check
    permissions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuthContext Hook
 *
 * Access the current authorization context.
 *
 * @returns AuthContextType with user, authKey, and setRole function
 * @throws Error if used outside AuthProvider
 */
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
