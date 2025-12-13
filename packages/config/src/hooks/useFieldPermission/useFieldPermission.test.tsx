/*
 * ================================================================
 * FILE: useFieldPermission.test.ts
 * PATH: /packages/config/src/hooks/useFieldPermission/useFieldPermission.test.ts
 * DESCRIPTION: Unit tests for useFieldPermission, useFieldPermissions, and useIssueFieldPermissions hooks
 * VERSION: v1.0.0
 * CREATED: 2025-12-11
 * UPDATED: 2025-12-11
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';
import { useFieldPermission, useFieldPermissions, useIssueFieldPermissions } from './useFieldPermission';
import { AuthProvider, useAuthContext } from '../../contexts/AuthContext/AuthContext';
import { TranslationProvider } from '../../translations';
import { ThemeProvider } from '../../theme/ThemeContext';

// ================================================================
// TEST WRAPPER
// ================================================================

/**
 * Wrapper component that provides all required contexts
 */
const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider defaultTheme="light">
    <TranslationProvider defaultLanguage="sk">
      <AuthProvider>
        {children}
      </AuthProvider>
    </TranslationProvider>
  </ThemeProvider>
);

// ================================================================
// useFieldPermission TESTS
// ================================================================

describe('useFieldPermission', () => {
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
    it('returns access property', () => {
      const { result } = renderHook(
        () => useFieldPermission('issue', 'title'),
        { wrapper }
      );
      expect(result.current.access).toBeDefined();
    });

    it('returns canView boolean', () => {
      const { result } = renderHook(
        () => useFieldPermission('issue', 'title'),
        { wrapper }
      );
      expect(typeof result.current.canView).toBe('boolean');
    });

    it('returns canEdit boolean', () => {
      const { result } = renderHook(
        () => useFieldPermission('issue', 'title'),
        { wrapper }
      );
      expect(typeof result.current.canEdit).toBe('boolean');
    });

    it('canView is true when access is not hidden', () => {
      const { result } = renderHook(
        () => useFieldPermission('issue', 'title'), // viewLevel: 1, always visible
        { wrapper }
      );
      expect(result.current.canView).toBe(true);
    });

    it('canEdit is true when access is editable', () => {
      // Use description field which has editLevel: 30
      // Default permission level should allow editing for higher levels
      const { result } = renderHook(() => {
        const auth = useAuthContext();
        return { auth, permission: useFieldPermission('issue', 'description') };
      }, { wrapper });

      // Set permission level high enough to edit
      act(() => {
        result.current.auth.setPermissionLevel(70);
      });

      expect(result.current.permission.canEdit).toBe(true);
    });
  });

  // ================================================================
  // ACCESS LEVEL TESTS
  // ================================================================
  describe('Access Levels', () => {
    it('returns editable for fields user can edit', () => {
      const { result } = renderHook(() => {
        const auth = useAuthContext();
        return { auth, permission: useFieldPermission('issue', 'description') };
      }, { wrapper });

      // Set permission level to 70 (Admin lvl 2)
      act(() => {
        result.current.auth.setPermissionLevel(70);
      });

      expect(result.current.permission.access).toBe('editable');
      expect(result.current.permission.canEdit).toBe(true);
      expect(result.current.permission.canView).toBe(true);
    });

    it('returns readonly for fields user can view but not edit', () => {
      const { result } = renderHook(() => {
        const auth = useAuthContext();
        return { auth, permission: useFieldPermission('issue', 'title') };
      }, { wrapper });

      // Set permission level to 30 (Standard) - can view but not edit title (needs 70)
      act(() => {
        result.current.auth.setPermissionLevel(30);
      });

      expect(result.current.permission.access).toBe('readonly');
      expect(result.current.permission.canView).toBe(true);
      expect(result.current.permission.canEdit).toBe(false);
    });

    it('returns hidden for fields user cannot view', () => {
      const { result } = renderHook(() => {
        const auth = useAuthContext();
        return { auth, permission: useFieldPermission('issue', 'reporter_id') };
      }, { wrapper });

      // Set permission level to 10 (Basic) - cannot view reporter_id (needs 60)
      act(() => {
        result.current.auth.setPermissionLevel(10);
      });

      expect(result.current.permission.access).toBe('hidden');
      expect(result.current.permission.canView).toBe(false);
      expect(result.current.permission.canEdit).toBe(false);
    });
  });

  // ================================================================
  // PERMISSION LEVEL BASED TESTS
  // ================================================================
  describe('Permission Level Based', () => {
    it('basic user (level 10) can view title but not edit', () => {
      const { result } = renderHook(() => {
        const auth = useAuthContext();
        return { auth, permission: useFieldPermission('issue', 'title') };
      }, { wrapper });

      act(() => {
        result.current.auth.setPermissionLevel(10);
      });

      expect(result.current.permission.canView).toBe(true);
      expect(result.current.permission.canEdit).toBe(false);
    });

    it('standard user (level 45) can edit description', () => {
      const { result } = renderHook(() => {
        const auth = useAuthContext();
        return { auth, permission: useFieldPermission('issue', 'description') };
      }, { wrapper });

      act(() => {
        result.current.auth.setPermissionLevel(45);
      });

      expect(result.current.permission.canView).toBe(true);
      expect(result.current.permission.canEdit).toBe(true);
    });

    it('admin user (level 75) can edit severity', () => {
      const { result } = renderHook(() => {
        const auth = useAuthContext();
        return { auth, permission: useFieldPermission('issue', 'severity') };
      }, { wrapper });

      act(() => {
        result.current.auth.setPermissionLevel(75);
      });

      expect(result.current.permission.canView).toBe(true);
      expect(result.current.permission.canEdit).toBe(true);
    });

    it('super admin (level 100) can edit status', () => {
      const { result } = renderHook(() => {
        const auth = useAuthContext();
        return { auth, permission: useFieldPermission('issue', 'status') };
      }, { wrapper });

      act(() => {
        result.current.auth.setPermissionLevel(100);
      });

      expect(result.current.permission.canView).toBe(true);
      expect(result.current.permission.canEdit).toBe(true);
    });

    it('non-super admin cannot edit status', () => {
      const { result } = renderHook(() => {
        const auth = useAuthContext();
        return { auth, permission: useFieldPermission('issue', 'status') };
      }, { wrapper });

      act(() => {
        result.current.auth.setPermissionLevel(90);
      });

      expect(result.current.permission.canView).toBe(true);
      expect(result.current.permission.canEdit).toBe(false);
    });
  });

  // ================================================================
  // FIELD VISIBILITY TESTS
  // ================================================================
  describe('Field Visibility', () => {
    it('id field is always visible (viewLevel 0)', () => {
      const { result } = renderHook(() => {
        const auth = useAuthContext();
        return { auth, permission: useFieldPermission('issue', 'id') };
      }, { wrapper });

      act(() => {
        result.current.auth.setPermissionLevel(1);
      });

      expect(result.current.permission.canView).toBe(true);
    });

    it('id field is never editable', () => {
      const { result } = renderHook(() => {
        const auth = useAuthContext();
        return { auth, permission: useFieldPermission('issue', 'id') };
      }, { wrapper });

      act(() => {
        result.current.auth.setPermissionLevel(100);
      });

      expect(result.current.permission.canEdit).toBe(false);
    });

    it('assignee_id requires level 30+ to view', () => {
      const { result } = renderHook(() => {
        const auth = useAuthContext();
        return { auth, permission: useFieldPermission('issue', 'assignee_id') };
      }, { wrapper });

      // Below threshold
      act(() => {
        result.current.auth.setPermissionLevel(20);
      });
      expect(result.current.permission.canView).toBe(false);

      // At threshold
      act(() => {
        result.current.auth.setPermissionLevel(30);
      });
      expect(result.current.permission.canView).toBe(true);
    });

    it('error_type requires level 60+ to view', () => {
      const { result } = renderHook(() => {
        const auth = useAuthContext();
        return { auth, permission: useFieldPermission('issue', 'error_type') };
      }, { wrapper });

      // Below threshold
      act(() => {
        result.current.auth.setPermissionLevel(50);
      });
      expect(result.current.permission.canView).toBe(false);

      // At threshold
      act(() => {
        result.current.auth.setPermissionLevel(60);
      });
      expect(result.current.permission.canView).toBe(true);
    });
  });

  // ================================================================
  // CONTEXT SUPPORT TESTS
  // ================================================================
  describe('Context Support', () => {
    it('accepts context parameter', () => {
      const { result } = renderHook(
        () => useFieldPermission('issue', 'title', { entityStatus: 'open' }),
        { wrapper }
      );

      expect(result.current.access).toBeDefined();
    });

    it('context does not throw', () => {
      expect(() => {
        renderHook(
          () => useFieldPermission('issue', 'title', {
            entityStatus: 'resolved',
            isOwner: true,
            isDeleted: false,
          }),
          { wrapper }
        );
      }).not.toThrow();
    });
  });

  // ================================================================
  // TRANSLATED REASON TESTS
  // ================================================================
  describe('Translated Reason', () => {
    it('translatedReason is undefined when no restriction', () => {
      const { result } = renderHook(() => {
        const auth = useAuthContext();
        return { auth, permission: useFieldPermission('issue', 'description') };
      }, { wrapper });

      act(() => {
        result.current.auth.setPermissionLevel(70);
      });

      // When editable, there should be no restriction reason
      expect(result.current.permission.translatedReason).toBeUndefined();
    });
  });
});

// ================================================================
// useFieldPermissions TESTS (BATCH)
// ================================================================

describe('useFieldPermissions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ================================================================
  // BASIC FUNCTIONALITY
  // ================================================================
  describe('Basic Functionality', () => {
    it('returns permissions for multiple fields', () => {
      const { result } = renderHook(
        () => useFieldPermissions('issue', ['title', 'description', 'severity']),
        { wrapper }
      );

      expect(result.current.title).toBeDefined();
      expect(result.current.description).toBeDefined();
      expect(result.current.severity).toBeDefined();
    });

    it('each field has access property', () => {
      const { result } = renderHook(
        () => useFieldPermissions('issue', ['title', 'description']),
        { wrapper }
      );

      expect(result.current.title.access).toBeDefined();
      expect(result.current.description.access).toBeDefined();
    });

    it('each field has canView and canEdit', () => {
      const { result } = renderHook(
        () => useFieldPermissions('issue', ['title', 'description']),
        { wrapper }
      );

      expect(typeof result.current.title.canView).toBe('boolean');
      expect(typeof result.current.title.canEdit).toBe('boolean');
      expect(typeof result.current.description.canView).toBe('boolean');
      expect(typeof result.current.description.canEdit).toBe('boolean');
    });
  });

  // ================================================================
  // PERMISSION LEVEL BASED
  // ================================================================
  describe('Permission Level Based', () => {
    it('returns correct permissions for basic user', () => {
      const { result } = renderHook(() => {
        const auth = useAuthContext();
        return { auth, permissions: useFieldPermissions('issue', ['title', 'reporter_id']) };
      }, { wrapper });

      act(() => {
        result.current.auth.setPermissionLevel(10);
      });

      // title: viewLevel 1, editLevel 70
      expect(result.current.permissions.title.canView).toBe(true);
      expect(result.current.permissions.title.canEdit).toBe(false);

      // reporter_id: viewLevel 60, editLevel 100
      expect(result.current.permissions.reporter_id.canView).toBe(false);
      expect(result.current.permissions.reporter_id.canEdit).toBe(false);
    });

    it('returns correct permissions for admin user', () => {
      const { result } = renderHook(() => {
        const auth = useAuthContext();
        return { auth, permissions: useFieldPermissions('issue', ['title', 'reporter_id']) };
      }, { wrapper });

      act(() => {
        result.current.auth.setPermissionLevel(75);
      });

      // title: viewLevel 1, editLevel 70
      expect(result.current.permissions.title.canView).toBe(true);
      expect(result.current.permissions.title.canEdit).toBe(true);

      // reporter_id: viewLevel 60, editLevel 100
      expect(result.current.permissions.reporter_id.canView).toBe(true);
      expect(result.current.permissions.reporter_id.canEdit).toBe(false);
    });
  });

  // ================================================================
  // CONTEXT SUPPORT
  // ================================================================
  describe('Context Support', () => {
    it('accepts context parameter', () => {
      const { result } = renderHook(
        () => useFieldPermissions('issue', ['title', 'description'], { entityStatus: 'open' }),
        { wrapper }
      );

      expect(result.current.title).toBeDefined();
      expect(result.current.description).toBeDefined();
    });
  });
});

// ================================================================
// useIssueFieldPermissions TESTS
// ================================================================

describe('useIssueFieldPermissions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ================================================================
  // BASIC FUNCTIONALITY
  // ================================================================
  describe('Basic Functionality', () => {
    it('returns permissions for issue fields', () => {
      const { result } = renderHook(
        () => useIssueFieldPermissions(['title', 'severity']),
        { wrapper }
      );

      expect(result.current.title).toBeDefined();
      expect(result.current.severity).toBeDefined();
    });

    it('each field has access, canView, canEdit', () => {
      const { result } = renderHook(
        () => useIssueFieldPermissions(['title']),
        { wrapper }
      );

      expect(result.current.title.access).toBeDefined();
      expect(typeof result.current.title.canView).toBe('boolean');
      expect(typeof result.current.title.canEdit).toBe('boolean');
    });
  });

  // ================================================================
  // CONVENIENCE WRAPPER
  // ================================================================
  describe('Convenience Wrapper', () => {
    it('behaves same as useFieldPermissions with issue entity', () => {
      const { result: result1 } = renderHook(
        () => useIssueFieldPermissions(['title', 'description']),
        { wrapper }
      );

      const { result: result2 } = renderHook(
        () => useFieldPermissions('issue', ['title', 'description']),
        { wrapper }
      );

      expect(result1.current.title.access).toBe(result2.current.title.access);
      expect(result1.current.description.access).toBe(result2.current.description.access);
    });

    it('accepts context parameter', () => {
      const { result } = renderHook(
        () => useIssueFieldPermissions(['title'], { entityStatus: 'resolved' }),
        { wrapper }
      );

      expect(result.current.title).toBeDefined();
    });
  });
});
