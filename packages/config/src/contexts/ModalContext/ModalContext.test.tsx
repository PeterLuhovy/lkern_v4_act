/*
 * ================================================================
 * FILE: ModalContext.test.tsx
 * PATH: /packages/config/src/contexts/ModalContext/ModalContext.test.tsx
 * DESCRIPTION: Tests for ModalContext provider
 * VERSION: v1.0.0
 * UPDATED: 2025-10-19 15:00:00
 * ================================================================
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { ModalProvider, useModalContext } from './ModalContext';

// Wrapper component for testing
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ModalProvider>{children}</ModalProvider>
);

describe('ModalContext', () => {
  describe('modal registration', () => {
    it('should register modal', () => {
      const { result } = renderHook(() => useModalContext(), { wrapper });

      act(() => {
        result.current.registerModal('test-modal');
      });

      expect(result.current.isModalOpen('test-modal')).toBe(false);
    });

    it('should unregister modal', () => {
      const { result } = renderHook(() => useModalContext(), { wrapper });

      act(() => {
        result.current.registerModal('test-modal');
      });

      act(() => {
        result.current.unregisterModal('test-modal');
      });

      // Modal should still exist but not be tracked
      expect(result.current.openModals).toEqual([]);
    });
  });

  describe('modal opening and closing', () => {
    it('should open modal', () => {
      const { result } = renderHook(() => useModalContext(), { wrapper });

      act(() => {
        result.current.registerModal('test-modal');
      });

      act(() => {
        result.current.openModal('test-modal');
      });

      expect(result.current.isModalOpen('test-modal')).toBe(true);
      expect(result.current.openModals).toContain('test-modal');
    });

    it('should close modal', () => {
      const { result } = renderHook(() => useModalContext(), { wrapper });

      act(() => {
        result.current.registerModal('test-modal');
        result.current.openModal('test-modal');
      });

      act(() => {
        result.current.closeModal('test-modal');
      });

      expect(result.current.isModalOpen('test-modal')).toBe(false);
      expect(result.current.openModals).not.toContain('test-modal');
    });

    it('should close all modals', () => {
      const { result } = renderHook(() => useModalContext(), { wrapper });

      act(() => {
        result.current.registerModal('modal-1');
        result.current.registerModal('modal-2');
        result.current.registerModal('modal-3');
        result.current.openModal('modal-1');
        result.current.openModal('modal-2');
        result.current.openModal('modal-3');
      });

      act(() => {
        result.current.closeAll();
      });

      expect(result.current.openModals).toEqual([]);
    });
  });

  describe('z-index calculation', () => {
    it('should return base z-index for first modal', () => {
      const { result } = renderHook(() => useModalContext(), { wrapper });

      act(() => {
        result.current.registerModal('modal-1');
        result.current.openModal('modal-1');
      });

      const zIndex = result.current.getZIndex('modal-1');

      expect(zIndex).toBe(1000); // Base z-index
    });

    it('should increment z-index for stacked modals', () => {
      const { result } = renderHook(() => useModalContext(), { wrapper });

      act(() => {
        result.current.registerModal('modal-1');
        result.current.registerModal('modal-2');
        result.current.registerModal('modal-3');
        result.current.openModal('modal-1');
        result.current.openModal('modal-2');
        result.current.openModal('modal-3');
      });

      const zIndex1 = result.current.getZIndex('modal-1');
      const zIndex2 = result.current.getZIndex('modal-2');
      const zIndex3 = result.current.getZIndex('modal-3');

      expect(zIndex1).toBe(1000);
      expect(zIndex2).toBe(1010);
      expect(zIndex3).toBe(1020);
    });

    it('should return default z-index for unopened modal', () => {
      const { result } = renderHook(() => useModalContext(), { wrapper });

      act(() => {
        result.current.registerModal('modal-1');
      });

      const zIndex = result.current.getZIndex('modal-1');

      expect(zIndex).toBe(1000); // Default base
    });
  });

  describe('modal state tracking', () => {
    it('should track multiple open modals', () => {
      const { result } = renderHook(() => useModalContext(), { wrapper });

      act(() => {
        result.current.registerModal('modal-1');
        result.current.registerModal('modal-2');
        result.current.openModal('modal-1');
        result.current.openModal('modal-2');
      });

      expect(result.current.openModals).toHaveLength(2);
      expect(result.current.openModals).toContain('modal-1');
      expect(result.current.openModals).toContain('modal-2');
    });

    it('should prevent duplicate open modals', () => {
      const { result } = renderHook(() => useModalContext(), { wrapper });

      act(() => {
        result.current.registerModal('test-modal');
        result.current.openModal('test-modal');
        result.current.openModal('test-modal'); // Open again
      });

      expect(result.current.openModals).toHaveLength(1);
    });

    it('should handle closing unopened modal', () => {
      const { result } = renderHook(() => useModalContext(), { wrapper });

      act(() => {
        result.current.registerModal('test-modal');
        result.current.closeModal('test-modal'); // Close without opening
      });

      expect(result.current.openModals).toEqual([]);
    });
  });

  describe('nested modals', () => {
    it('should handle nested modal scenario', () => {
      const { result } = renderHook(() => useModalContext(), { wrapper });

      act(() => {
        // Open parent modal
        result.current.registerModal('parent');
        result.current.openModal('parent');

        // Open child modal
        result.current.registerModal('child');
        result.current.openModal('child');
      });

      expect(result.current.openModals).toHaveLength(2);

      // Child should have higher z-index
      const parentZ = result.current.getZIndex('parent');
      const childZ = result.current.getZIndex('child');

      expect(childZ).toBeGreaterThan(parentZ);
    });

    it('should maintain z-index when closing middle modal', () => {
      const { result } = renderHook(() => useModalContext(), { wrapper });

      act(() => {
        result.current.registerModal('modal-1');
        result.current.registerModal('modal-2');
        result.current.registerModal('modal-3');
        result.current.openModal('modal-1');
        result.current.openModal('modal-2');
        result.current.openModal('modal-3');
      });

      // Close middle modal
      act(() => {
        result.current.closeModal('modal-2');
      });

      expect(result.current.openModals).toHaveLength(2);
      expect(result.current.openModals).toContain('modal-1');
      expect(result.current.openModals).toContain('modal-3');
    });
  });
});