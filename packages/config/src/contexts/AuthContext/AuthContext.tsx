/*
 * ================================================================
 * FILE: AuthContext.tsx
 * PATH: /packages/config/src/contexts/AuthContext/AuthContext.tsx
 * DESCRIPTION: Authorization context with numeric permission level (0-100)
 *              and centralized permission checks (DRY)
 * VERSION: v4.0.0
 * CREATED: 2025-11-22
 * UPDATED: 2025-12-09
 * CHANGES:
 *   - v4.0.0: Added test user switching (Peter, Test User 1-3)
 *             Users have predefined IDs from environment variables
 *   - v3.1.0: Added centralized permissions object (canView, canCreate, canEdit, canDelete, canExport, canViewDeleted)
 *   - v3.0.0: Initial numeric permission system (0-100)
 * ================================================================
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import {
  getStoredPermissionLevel,
  setStoredPermissionLevel,
  QUICK_PERMISSION_LEVELS,
  canView,
  canCreate,
  canEdit,
  canDelete,
  canExport,
  canViewDeleted,
} from '../../permissions/index';
import { TEST_USERS, TestUser } from '../../constants/system-constants';
import type { ExportBehavior } from '../../utils/exportFile';

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
  exportBehavior?: ExportBehavior; // Export file behavior preference (automatic download vs "Save As" dialog)
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

  // Read export behavior from localStorage (for mock implementation)
  let exportBehavior: 'automatic' | 'save-as-dialog' = 'automatic';
  try {
    const saved = localStorage.getItem('user-export-behavior');
    if (saved === 'save-as-dialog') {
      exportBehavior = 'save-as-dialog';
    }
  } catch {
    // Ignore localStorage errors
  }

  return {
    id: roleIds[role],
    name: `${roleNames[role]} (${permissionLevel})`,
    email: roleEmails[role],
    permissionLevel,
    role,
    exportBehavior,
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
  /** Available test users for switching */
  testUsers: TestUser[];
  /** Currently selected test user ID (null = auto-generated from level) */
  selectedTestUserId: string | null;
  /** Switch to a specific test user */
  setTestUser: (userId: string | null) => void;
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
  // Permission level state
  const [permissionLevel, setPermissionLevelState] = useState<number>(() => {
    return getStoredPermissionLevel();
  });

  // Selected test user ID (null = use auto-generated user from permission level)
  const [selectedTestUserId, setSelectedTestUserId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('lkern-selected-test-user') || null;
    } catch {
      return null;
    }
  });

  // Save permission level to localStorage when it changes
  useEffect(() => {
    setStoredPermissionLevel(permissionLevel);
  }, [permissionLevel]);

  // Save selected test user to localStorage
  useEffect(() => {
    try {
      if (selectedTestUserId) {
        localStorage.setItem('lkern-selected-test-user', selectedTestUserId);
      } else {
        localStorage.removeItem('lkern-selected-test-user');
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [selectedTestUserId]);

  // Set test user - updates both user selection and permission level
  const setTestUser = useCallback((userId: string | null) => {
    setSelectedTestUserId(userId);
    if (userId) {
      const testUser = TEST_USERS.find((u) => u.id === userId);
      if (testUser) {
        setPermissionLevelState(testUser.permissionLevel);
      }
    }
  }, []);

  // Generate user based on current state
  const user: User = useMemo(() => {
    // If test user is selected, use their data
    if (selectedTestUserId) {
      const testUser = TEST_USERS.find((u) => u.id === selectedTestUserId);
      if (testUser) {
        // Read export behavior from localStorage (for mock implementation)
        let exportBehavior: 'automatic' | 'save-as-dialog' = 'automatic';
        try {
          const saved = localStorage.getItem('user-export-behavior');
          if (saved === 'save-as-dialog') {
            exportBehavior = 'save-as-dialog';
          }
        } catch {
          // Ignore localStorage errors
        }

        return {
          id: testUser.id,
          name: testUser.name,
          email: testUser.email,
          permissionLevel: testUser.permissionLevel,
          role: testUser.role,
          exportBehavior,
        };
      }
    }
    // Otherwise generate mock user from permission level
    return generateMockUser(permissionLevel);
  }, [selectedTestUserId, permissionLevel]);

  const currentRole = user.role;

  // Backward compatibility: setRole function that converts role to permission level
  const setRole = useCallback((role: UserRole) => {
    const levelMap: Record<UserRole, number> = {
      basic: QUICK_PERMISSION_LEVELS.BASIC,
      standard: QUICK_PERMISSION_LEVELS.STANDARD,
      advanced: QUICK_PERMISSION_LEVELS.ADVANCED,
    };
    setPermissionLevelState(levelMap[role]);
    // Clear test user selection when changing role directly
    setSelectedTestUserId(null);
  }, []);

  // Override setPermissionLevel to clear test user selection
  const setPermissionLevel = useCallback((level: number) => {
    setPermissionLevelState(level);
    // Clear test user selection when changing level directly
    setSelectedTestUserId(null);
  }, []);

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
    setPermissionLevel,
    currentRole,
    setRole,
    isAuthenticated: true, // TODO: Replace with real auth check
    permissions,
    testUsers: TEST_USERS,
    selectedTestUserId,
    setTestUser,
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
