/*
 * ================================================================
 * FILE: ToastContext.test.tsx
 * PATH: /packages/config/src/contexts/ToastContext/ToastContext.test.tsx
 * DESCRIPTION: Tests for ToastContext provider
 * VERSION: v1.0.1
 * UPDATED: 2025-12-16
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { ToastProvider, useToastContext } from './ToastContext';
import { toastManager } from '../../utils/toastManager';

// Wrapper for provider
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>{children}</ToastProvider>
);

describe('ToastContext', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Clear toasts - wrap in act() since this triggers state updates in ToastProvider
    await act(async () => {
      toastManager.clearAll();
      await Promise.resolve(); // Let event handlers complete
    });
  });

  afterEach(async () => {
    // Clear toasts - wrap in act() since this triggers state updates in ToastProvider
    await act(async () => {
      toastManager.clearAll();
      await Promise.resolve();
    });
  });

  describe('useToastContext hook', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleError = vi.spyOn(console, 'error').mockImplementation(vi.fn());

      expect(() => {
        renderHook(() => useToastContext());
      }).toThrow('useToastContext must be used within ToastProvider');

      consoleError.mockRestore();
    });

    it('should return context value when used within provider', () => {
      const { result } = renderHook(() => useToastContext(), { wrapper });

      expect(result.current.toasts).toEqual([]);
      expect(result.current.showToast).toBeTypeOf('function');
      expect(result.current.hideToast).toBeTypeOf('function');
      expect(result.current.clearAll).toBeTypeOf('function');
    });
  });

  describe('toast display', () => {
    it('should add toast when showToast called', () => {
      const { result } = renderHook(() => useToastContext(), { wrapper });

      act(() => {
        result.current.showToast('Test message');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('Test message');
    });

    it('should add multiple toasts', () => {
      const { result } = renderHook(() => useToastContext(), { wrapper });

      act(() => {
        result.current.showToast('First message');
        result.current.showToast('Second message');
        result.current.showToast('Third message');
      });

      expect(result.current.toasts).toHaveLength(3);
    });

    it('should respect maxToasts limit', () => {
      const customWrapper = ({ children }: { children: React.ReactNode }) => (
        <ToastProvider maxToasts={3}>{children}</ToastProvider>
      );

      const { result } = renderHook(() => useToastContext(), { wrapper: customWrapper });

      act(() => {
        result.current.showToast('Toast 1');
        result.current.showToast('Toast 2');
        result.current.showToast('Toast 3');
        result.current.showToast('Toast 4'); // Should remove oldest
        result.current.showToast('Toast 5'); // Should remove oldest
      });

      expect(result.current.toasts).toHaveLength(3);
      // Should have the last 3 toasts
      expect(result.current.toasts[0].message).toBe('Toast 3');
      expect(result.current.toasts[1].message).toBe('Toast 4');
      expect(result.current.toasts[2].message).toBe('Toast 5');
    });
  });

  describe('toast removal', () => {
    it('should remove toast when hideToast called', () => {
      const { result } = renderHook(() => useToastContext(), { wrapper });

      let toastId: string;

      act(() => {
        toastId = result.current.showToast('Test message');
      });

      expect(result.current.toasts).toHaveLength(1);

      act(() => {
        result.current.hideToast(toastId);
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('should remove specific toast by id', () => {
      const { result } = renderHook(() => useToastContext(), { wrapper });

      let toast1Id: string;
      let toast2Id: string;

      act(() => {
        toast1Id = result.current.showToast('First message');
        toast2Id = result.current.showToast('Second message');
      });

      expect(result.current.toasts).toHaveLength(2);

      act(() => {
        result.current.hideToast(toast1Id);
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].id).toBe(toast2Id);
    });

    it('should clear all toasts when clearAll called', () => {
      const { result } = renderHook(() => useToastContext(), { wrapper });

      act(() => {
        result.current.showToast('Toast 1');
        result.current.showToast('Toast 2');
        result.current.showToast('Toast 3');
      });

      expect(result.current.toasts).toHaveLength(3);

      act(() => {
        result.current.clearAll();
      });

      expect(result.current.toasts).toHaveLength(0);
    });
  });

  describe('auto-dismiss', () => {
    it('should auto-dismiss toast after duration', async () => {
      const { result } = renderHook(() => useToastContext(), { wrapper });

      act(() => {
        result.current.showToast('Auto-dismiss message', { duration: 100 });
      });

      expect(result.current.toasts).toHaveLength(1);

      // Wait for auto-dismiss (100ms + buffer)
      await waitFor(
        () => {
          expect(result.current.toasts).toHaveLength(0);
        },
        { timeout: 200 }
      );
    });

    it('should not auto-dismiss when duration is 0', async () => {
      const { result } = renderHook(() => useToastContext(), { wrapper });

      act(() => {
        result.current.showToast('Manual dismiss message', { duration: 0 });
      });

      expect(result.current.toasts).toHaveLength(1);

      // Wait to ensure it doesn't auto-dismiss - wrap in act() to handle any state updates
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      expect(result.current.toasts).toHaveLength(1);
    });
  });

  describe('toast options', () => {
    it('should create toast with type', () => {
      const { result } = renderHook(() => useToastContext(), { wrapper });

      act(() => {
        result.current.showToast('Error message', { type: 'error' });
      });

      expect(result.current.toasts[0].type).toBe('error');
    });

    it('should create toast with position', () => {
      const { result } = renderHook(() => useToastContext(), { wrapper });

      act(() => {
        result.current.showToast('Top right message', { position: 'top-right' });
      });

      expect(result.current.toasts[0].position).toBe('top-right');
    });

    it('should create toast with copied content', () => {
      const { result } = renderHook(() => useToastContext(), { wrapper });

      act(() => {
        result.current.showToast('Copied!', { copiedContent: 'example@email.com' });
      });

      expect(result.current.toasts[0].copiedContent).toBe('example@email.com');
    });
  });

  describe('event listener cleanup', () => {
    it('should cleanup listeners on unmount', () => {
      const offSpy = vi.spyOn(toastManager, 'off');

      const { unmount } = renderHook(() => useToastContext(), { wrapper });

      unmount();

      expect(offSpy).toHaveBeenCalledTimes(3); // show, hide, clear
    });
  });
});