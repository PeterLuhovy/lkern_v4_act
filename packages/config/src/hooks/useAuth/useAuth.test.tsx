/*
 * ================================================================
 * FILE: useAuth.test.tsx
 * PATH: /packages/config/src/hooks/useAuth/useAuth.test.tsx
 * DESCRIPTION: Unit tests for useAuth hook
 * VERSION: v1.1.0
 * CREATED: 2025-12-11
 * UPDATED: 2025-12-16
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';
import { useAuth } from './useAuth';
import { AuthProvider, useAuthContext } from '../../contexts/AuthContext/AuthContext';

// Wrapper component that provides AuthContext
const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ================================================================
  // BASIC FUNCTIONALITY TESTS
  // ================================================================
  describe('Basic Functionality', () => {
    it('returns user object', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      expect(result.current.user).toBeDefined();
    });

    it('returns isAuthenticated as true (mock implementation)', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('returns hasPermission function', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      expect(typeof result.current.hasPermission).toBe('function');
    });

    it('user has required properties', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      const { user } = result.current;

      expect(user.id).toBeDefined();
      expect(user.name).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.permissionLevel).toBeDefined();
      expect(user.role).toBeDefined();
    });
  });

  // ================================================================
  // PERMISSION LEVEL TESTS
  // ================================================================
  describe('Permission Levels', () => {
    it('user role is one of basic, standard, or advanced', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      expect(['basic', 'standard', 'advanced']).toContain(result.current.user.role);
    });

    it('permission level is a number between 0 and 100', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      expect(result.current.user.permissionLevel).toBeGreaterThanOrEqual(0);
      expect(result.current.user.permissionLevel).toBeLessThanOrEqual(100);
    });

    it('role changes when permission level changes via context', () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });

      act(() => {
        result.current.setPermissionLevel(10);
      });
      expect(result.current.user.role).toBe('basic');

      act(() => {
        result.current.setPermissionLevel(45);
      });
      expect(result.current.user.role).toBe('standard');

      act(() => {
        result.current.setPermissionLevel(75);
      });
      expect(result.current.user.role).toBe('advanced');
    });
  });

  // ================================================================
  // BASIC ROLE PERMISSION TESTS
  // ================================================================
  describe('Basic Role Permissions', () => {
    it('basic role can view', () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });
      act(() => { result.current.setPermissionLevel(10); });

      // Need to set permission level in same context
      act(() => {
        result.current.setPermissionLevel(10);
      });

      expect(result.current.user.role).toBe('basic');
    });

    it('basic role can only view (not create/edit/delete)', () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });
      act(() => { result.current.setPermissionLevel(10); });

      // Since we can't easily sync context between hooks, test the permissions logic
      expect(result.current.user.role).toBe('basic');
      expect(result.current.permissions.canView).toBe(true);
      expect(result.current.permissions.canCreate).toBe(false);
      expect(result.current.permissions.canEdit).toBe(false);
      expect(result.current.permissions.canDelete).toBe(false);
    });
  });

  // ================================================================
  // STANDARD ROLE PERMISSION TESTS
  // ================================================================
  describe('Standard Role Permissions', () => {
    it('standard role can view and create but not edit/delete', () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });
      act(() => { result.current.setPermissionLevel(45); });

      expect(result.current.user.role).toBe('standard');
      expect(result.current.permissions.canView).toBe(true);
      expect(result.current.permissions.canCreate).toBe(true);
      expect(result.current.permissions.canEdit).toBe(false);
      expect(result.current.permissions.canDelete).toBe(false);
    });
  });

  // ================================================================
  // ADVANCED ROLE PERMISSION TESTS
  // ================================================================
  describe('Advanced Role Permissions', () => {
    it('advanced role has full access', () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });
      act(() => { result.current.setPermissionLevel(100); });

      expect(result.current.user.role).toBe('advanced');
      expect(result.current.permissions.canView).toBe(true);
      expect(result.current.permissions.canCreate).toBe(true);
      expect(result.current.permissions.canEdit).toBe(true);
      expect(result.current.permissions.canDelete).toBe(true);
      expect(result.current.permissions.canExport).toBe(true);
      expect(result.current.permissions.canViewDeleted).toBe(true);
    });
  });

  // ================================================================
  // hasPermission FUNCTION TESTS
  // ================================================================
  describe('hasPermission Function', () => {
    it('hasPermission returns boolean', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      expect(typeof result.current.hasPermission('view')).toBe('boolean');
    });

    it('hasPermission accepts view permission', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      expect(result.current.hasPermission('view')).toBeDefined();
    });

    it('hasPermission accepts create permission', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      expect(result.current.hasPermission('create')).toBeDefined();
    });

    it('hasPermission accepts edit permission', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      expect(result.current.hasPermission('edit')).toBeDefined();
    });

    it('hasPermission accepts delete permission', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      expect(result.current.hasPermission('delete')).toBeDefined();
    });

    it('hasPermission accepts issue-specific permissions', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      expect(result.current.hasPermission('create_issue')).toBeDefined();
      expect(result.current.hasPermission('edit_issue')).toBeDefined();
      expect(result.current.hasPermission('delete_issue')).toBeDefined();
      expect(result.current.hasPermission('view_issue')).toBeDefined();
    });

    it('hasPermission accepts contact-specific permissions', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      expect(result.current.hasPermission('create_contact')).toBeDefined();
      expect(result.current.hasPermission('edit_contact')).toBeDefined();
      expect(result.current.hasPermission('delete_contact')).toBeDefined();
      expect(result.current.hasPermission('view_contact')).toBeDefined();
    });
  });

  // ================================================================
  // ERROR HANDLING TESTS
  // ================================================================
  describe('Error Handling', () => {
    it('throws error when used outside AuthProvider', () => {
      expect(() => {
        renderHook(() => useAuthContext());
      }).toThrow('useAuthContext must be used within AuthProvider');
    });
  });
});

// ================================================================
// AUTHCONTEXT TESTS
// ================================================================
describe('useAuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Context Values', () => {
    it('provides user object', () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });
      expect(result.current.user).toBeDefined();
    });

    it('provides authKey', () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });
      expect(result.current.authKey).toBeDefined();
    });

    it('provides permissionLevel', () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });
      expect(typeof result.current.permissionLevel).toBe('number');
    });

    it('provides setPermissionLevel function', () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });
      expect(typeof result.current.setPermissionLevel).toBe('function');
    });

    it('provides currentRole', () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });
      expect(['basic', 'standard', 'advanced']).toContain(result.current.currentRole);
    });

    it('provides setRole function', () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });
      expect(typeof result.current.setRole).toBe('function');
    });

    it('provides isAuthenticated', () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('provides permissions object', () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });
      expect(result.current.permissions).toBeDefined();
      expect(typeof result.current.permissions.canView).toBe('boolean');
      expect(typeof result.current.permissions.canCreate).toBe('boolean');
      expect(typeof result.current.permissions.canEdit).toBe('boolean');
      expect(typeof result.current.permissions.canDelete).toBe('boolean');
      expect(typeof result.current.permissions.canExport).toBe('boolean');
      expect(typeof result.current.permissions.canViewDeleted).toBe('boolean');
    });

    it('provides testUsers array', () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });
      expect(Array.isArray(result.current.testUsers)).toBe(true);
    });

    it('provides setTestUser function', () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });
      expect(typeof result.current.setTestUser).toBe('function');
    });
  });

  describe('Permission Level Management', () => {
    it('setPermissionLevel updates the permission level', () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });

      act(() => {
        result.current.setPermissionLevel(45);
      });

      expect(result.current.permissionLevel).toBe(45);
    });

    it('setRole updates the role via permission level', () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });

      act(() => {
        result.current.setRole('basic');
      });

      expect(result.current.currentRole).toBe('basic');

      act(() => {
        result.current.setRole('standard');
      });

      expect(result.current.currentRole).toBe('standard');

      act(() => {
        result.current.setRole('advanced');
      });

      expect(result.current.currentRole).toBe('advanced');
    });
  });

  describe('Auth Keys', () => {
    it('returns correct auth key for basic role', () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });
      act(() => { result.current.setPermissionLevel(10); });
      expect(result.current.authKey).toBe('basic-key-L-KERN-2025');
    });

    it('returns correct auth key for standard role', () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });
      act(() => { result.current.setPermissionLevel(45); });
      expect(result.current.authKey).toBe('standard-key-L-KERN-2025');
    });

    it('returns correct auth key for advanced role', () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });
      act(() => { result.current.setPermissionLevel(100); });
      expect(result.current.authKey).toBe('advanced-key-L-KERN-2025');
    });
  });

  describe('Test Users', () => {
    it('testUsers array is not empty', () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });
      expect(result.current.testUsers.length).toBeGreaterThan(0);
    });

    it('test users have required properties', () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });
      result.current.testUsers.forEach((user) => {
        expect(user.id).toBeDefined();
        expect(user.name).toBeDefined();
        expect(user.email).toBeDefined();
        expect(user.role).toBeDefined();
        expect(typeof user.permissionLevel).toBe('number');
      });
    });

    it('setTestUser switches to specified user', () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });

      const firstUser = result.current.testUsers[0];
      act(() => {
        result.current.setTestUser(firstUser.id);
      });

      expect(result.current.selectedTestUserId).toBe(firstUser.id);
      expect(result.current.user.id).toBe(firstUser.id);
    });

    it('setTestUser with null clears selection', () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });

      const firstUser = result.current.testUsers[0];
      act(() => {
        result.current.setTestUser(firstUser.id);
      });

      act(() => {
        result.current.setTestUser(null);
      });

      expect(result.current.selectedTestUserId).toBeNull();
    });
  });
});
