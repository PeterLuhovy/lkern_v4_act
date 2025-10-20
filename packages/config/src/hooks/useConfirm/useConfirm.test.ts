/*
 * ================================================================
 * FILE: useConfirm.test.ts
 * PATH: /packages/config/src/hooks/useConfirm/useConfirm.test.ts
 * DESCRIPTION: Unit tests for useConfirm hook
 * VERSION: v1.0.0
 * UPDATED: 2025-10-20 16:00:00
 * ================================================================
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useConfirm } from './useConfirm';

describe('useConfirm', () => {
  describe('initialization', () => {
    it('should return confirm function', () => {
      const { result } = renderHook(() => useConfirm());

      expect(result.current.confirm).toBeTypeOf('function');
    });

    it('should initialize with modal closed', () => {
      const { result } = renderHook(() => useConfirm());

      expect(result.current.isOpen).toBe(false);
    });

    it('should initialize with empty message', () => {
      const { result } = renderHook(() => useConfirm());

      expect(result.current.message).toBe('');
    });
  });

  describe('confirm() function', () => {
    it('should open modal when confirm() called', async () => {
      const { result } = renderHook(() => useConfirm());

      act(() => {
        result.current.confirm('Test message');
      });

      expect(result.current.isOpen).toBe(true);
    });

    it('should display custom message', async () => {
      const { result } = renderHook(() => useConfirm());

      act(() => {
        result.current.confirm('Delete this record?');
      });

      expect(result.current.message).toBe('Delete this record?');
    });

    it('should use default message when empty string passed', async () => {
      const { result } = renderHook(() => useConfirm());

      act(() => {
        result.current.confirm('');
      });

      expect(result.current.message).toBe('Naozaj chceš pokračovať?');
    });

    it('should return Promise', () => {
      const { result } = renderHook(() => useConfirm());

      const promise = result.current.confirm('Test');

      expect(promise).toBeInstanceOf(Promise);
    });
  });

  describe('Promise resolution', () => {
    it('should resolve to true when handleConfirm called', async () => {
      const { result } = renderHook(() => useConfirm());

      let confirmResult: boolean | undefined;
      act(() => {
        result.current.confirm('Test').then((res) => {
          confirmResult = res;
        });
      });

      act(() => {
        result.current.handleConfirm();
      });

      // Wait for Promise to resolve
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(confirmResult).toBe(true);
    });

    it('should resolve to false when handleCancel called', async () => {
      const { result } = renderHook(() => useConfirm());

      let confirmResult: boolean | undefined;
      act(() => {
        result.current.confirm('Test').then((res) => {
          confirmResult = res;
        });
      });

      act(() => {
        result.current.handleCancel();
      });

      // Wait for Promise to resolve
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(confirmResult).toBe(false);
    });

    it('should work with async/await syntax', async () => {
      const { result } = renderHook(() => useConfirm());

      let confirmResult: boolean | undefined;

      // Start confirmation
      act(() => {
        (async () => {
          confirmResult = await result.current.confirm('Test message');
        })();
      });

      // Confirm
      act(() => {
        result.current.handleConfirm();
      });

      // Wait for Promise
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(confirmResult).toBe(true);
    });
  });

  describe('modal state', () => {
    it('should close modal after handleConfirm', () => {
      const { result } = renderHook(() => useConfirm());

      act(() => {
        result.current.confirm('Test');
      });

      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.handleConfirm();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('should close modal after handleCancel', () => {
      const { result } = renderHook(() => useConfirm());

      act(() => {
        result.current.confirm('Test');
      });

      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.handleCancel();
      });

      expect(result.current.isOpen).toBe(false);
    });
  });

  describe('multiple confirmations', () => {
    it('should handle sequential confirmations', async () => {
      const { result } = renderHook(() => useConfirm());

      // First confirmation
      let result1: boolean | undefined;
      act(() => {
        result.current.confirm('First').then((res) => {
          result1 = res;
        });
      });

      act(() => {
        result.current.handleConfirm();
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result1).toBe(true);

      // Second confirmation
      let result2: boolean | undefined;
      act(() => {
        result.current.confirm('Second').then((res) => {
          result2 = res;
        });
      });

      act(() => {
        result.current.handleCancel();
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result2).toBe(false);
    });

    it('should update message for each confirmation', () => {
      const { result } = renderHook(() => useConfirm());

      act(() => {
        result.current.confirm('First message');
      });
      expect(result.current.message).toBe('First message');

      act(() => {
        result.current.handleConfirm();
      });

      act(() => {
        result.current.confirm('Second message');
      });
      expect(result.current.message).toBe('Second message');
    });
  });

  describe('edge cases', () => {
    it('should handle handleConfirm without pending confirmation', () => {
      const { result } = renderHook(() => useConfirm());

      // No confirm() called yet
      expect(() => {
        act(() => {
          result.current.handleConfirm();
        });
      }).not.toThrow();
    });

    it('should handle handleCancel without pending confirmation', () => {
      const { result } = renderHook(() => useConfirm());

      // No confirm() called yet
      expect(() => {
        act(() => {
          result.current.handleCancel();
        });
      }).not.toThrow();
    });

    it('should have stable confirm function reference', () => {
      const { result, rerender } = renderHook(() => useConfirm());

      const confirmRef1 = result.current.confirm;

      rerender();

      const confirmRef2 = result.current.confirm;

      expect(confirmRef1).toBe(confirmRef2);
    });
  });
});
