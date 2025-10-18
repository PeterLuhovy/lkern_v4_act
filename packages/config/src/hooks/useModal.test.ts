/*
 * ================================================================
 * FILE: useModal.test.ts
 * PATH: /packages/config/src/hooks/useModal.test.ts
 * DESCRIPTION: Tests for useModal hook
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 16:00:00
 * ================================================================
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useModal } from './useModal';

describe('useModal', () => {
  // === BASIC STATE TESTS ===

  it('should initialize with closed state by default', () => {
    const { result } = renderHook(() => useModal());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should initialize with open state when initialOpen is true', () => {
    const { result } = renderHook(() => useModal({ initialOpen: true }));

    expect(result.current.isOpen).toBe(true);
    expect(result.current.isSubmitting).toBe(false);
  });

  // === OPEN/CLOSE TESTS ===

  it('should open modal when open() is called', () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.open();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it('should close modal when close() is called', () => {
    const { result } = renderHook(() => useModal({ initialOpen: true }));

    act(() => {
      result.current.close();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('should reset isSubmitting to false when opening modal', () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.setIsSubmitting(true);
    });

    expect(result.current.isSubmitting).toBe(true);

    act(() => {
      result.current.open();
    });

    expect(result.current.isSubmitting).toBe(false);
  });

  // === CALLBACKS TESTS ===

  it('should call onClose callback when closing modal', () => {
    const onClose = vi.fn();
    const { result } = renderHook(() => useModal({ onClose, initialOpen: true }));

    act(() => {
      result.current.close();
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onConfirm callback when confirm() is called', () => {
    const onConfirm = vi.fn();
    const { result } = renderHook(() => useModal({ onConfirm }));

    act(() => {
      result.current.confirm();
    });

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose if callback not provided', () => {
    const { result } = renderHook(() => useModal({ initialOpen: true }));

    // Should not throw error
    act(() => {
      result.current.close();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('should not call onConfirm if callback not provided', () => {
    const { result } = renderHook(() => useModal());

    // Should not throw error
    act(() => {
      result.current.confirm();
    });

    expect(result.current.isOpen).toBe(false);
  });

  // === SUBMITTING STATE TESTS ===

  it('should prevent closing when isSubmitting is true', () => {
    const onClose = vi.fn();
    const { result } = renderHook(() => useModal({ onClose, initialOpen: true }));

    act(() => {
      result.current.setIsSubmitting(true);
    });

    act(() => {
      result.current.close();
    });

    // Modal should still be open
    expect(result.current.isOpen).toBe(true);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should prevent confirm when isSubmitting is true', () => {
    const onConfirm = vi.fn();
    const { result } = renderHook(() => useModal({ onConfirm }));

    act(() => {
      result.current.setIsSubmitting(true);
    });

    act(() => {
      result.current.confirm();
    });

    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('should allow closing after isSubmitting is set back to false', () => {
    const onClose = vi.fn();
    const { result } = renderHook(() => useModal({ onClose, initialOpen: true }));

    act(() => {
      result.current.setIsSubmitting(true);
    });

    act(() => {
      result.current.close();
    });

    // Still open
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.setIsSubmitting(false);
    });

    act(() => {
      result.current.close();
    });

    // Now closed
    expect(result.current.isOpen).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // === INTEGRATION TESTS ===

  it('should handle complete open -> submit -> close workflow', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    const { result } = renderHook(() => useModal({ onClose, onConfirm }));

    // Open modal
    act(() => {
      result.current.open();
    });
    expect(result.current.isOpen).toBe(true);

    // Start submission
    act(() => {
      result.current.setIsSubmitting(true);
    });
    expect(result.current.isSubmitting).toBe(true);

    // Try to close (should be prevented)
    act(() => {
      result.current.close();
    });
    expect(result.current.isOpen).toBe(true);
    expect(onClose).not.toHaveBeenCalled();

    // Finish submission
    act(() => {
      result.current.setIsSubmitting(false);
    });

    // Close modal
    act(() => {
      result.current.close();
    });
    expect(result.current.isOpen).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should handle async onConfirm callback', async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useModal({ onConfirm }));

    await act(async () => {
      result.current.confirm();
    });

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  // === MULTIPLE OPEN/CLOSE TESTS ===

  it('should handle multiple open/close cycles', () => {
    const { result } = renderHook(() => useModal());

    // Cycle 1
    act(() => {
      result.current.open();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.close();
    });
    expect(result.current.isOpen).toBe(false);

    // Cycle 2
    act(() => {
      result.current.open();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.close();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('should maintain stable function references', () => {
    const { result, rerender } = renderHook(() => useModal());

    const firstOpen = result.current.open;
    const firstClose = result.current.close;
    const firstConfirm = result.current.confirm;

    rerender();

    // Functions should maintain same reference (useCallback)
    expect(result.current.open).toBe(firstOpen);
    expect(result.current.close).toBe(firstClose);
    expect(result.current.confirm).toBe(firstConfirm);
  });
});
