/*
 * ================================================================
 * FILE: useToast.test.ts
 * PATH: /packages/config/src/hooks/useToast/useToast.test.ts
 * DESCRIPTION: Tests for useToast hook
 * VERSION: v1.0.0
 * UPDATED: 2025-10-19 16:00:00
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useToast } from './useToast';
import { toastManager } from '../../utils/toastManager';

vi.mock('../../translations', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('../../utils/toastManager', () => ({
  toastManager: {
    show: vi.fn().mockReturnValue('toast-id'),
    hide: vi.fn(),
    clearAll: vi.fn(),
  },
}));

describe('useToast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return toast API methods', () => {
    const { result } = renderHook(() => useToast());

    expect(result.current.showToast).toBeTypeOf('function');
    expect(result.current.hideToast).toBeTypeOf('function');
    expect(result.current.clearAll).toBeTypeOf('function');
    expect(result.current.success).toBeTypeOf('function');
    expect(result.current.error).toBeTypeOf('function');
    expect(result.current.warning).toBeTypeOf('function');
    expect(result.current.info).toBeTypeOf('function');
  });

  it('should call toastManager.show when showToast called', () => {
    const { result } = renderHook(() => useToast());

    result.current.showToast('Test message');

    expect(toastManager.show).toHaveBeenCalledWith('Test message', undefined);
  });

  it('should call toastManager.hide when hideToast called', () => {
    const { result } = renderHook(() => useToast());

    result.current.hideToast('toast-1');

    expect(toastManager.hide).toHaveBeenCalledWith('toast-1');
  });

  it('should call toastManager.clearAll when clearAll called', () => {
    const { result } = renderHook(() => useToast());

    result.current.clearAll();

    expect(toastManager.clearAll).toHaveBeenCalled();
  });

  it('should call show with success type', () => {
    const { result } = renderHook(() => useToast());

    result.current.success('Success message');

    expect(toastManager.show).toHaveBeenCalledWith('Success message', { type: 'success' });
  });

  it('should call show with error type', () => {
    const { result } = renderHook(() => useToast());

    result.current.error('Error message');

    expect(toastManager.show).toHaveBeenCalledWith('Error message', { type: 'error' });
  });

  it('should call show with warning type', () => {
    const { result } = renderHook(() => useToast());

    result.current.warning('Warning message');

    expect(toastManager.show).toHaveBeenCalledWith('Warning message', { type: 'warning' });
  });

  it('should call show with info type', () => {
    const { result } = renderHook(() => useToast());

    result.current.info('Info message');

    expect(toastManager.show).toHaveBeenCalledWith('Info message', { type: 'info' });
  });

  // Edge Cases - Rapid Successive Toasts
  it('should handle rapid successive toast calls', () => {
    const { result } = renderHook(() => useToast());

    result.current.success('Toast 1');
    result.current.success('Toast 2');
    result.current.success('Toast 3');

    expect(toastManager.show).toHaveBeenCalledTimes(3);
  });

  it('should return unique IDs for multiple toasts', () => {
    (toastManager.show as ReturnType<typeof vi.fn>).mockReturnValueOnce('id-1').mockReturnValueOnce('id-2');
    const { result } = renderHook(() => useToast());

    const id1 = result.current.success('First');
    const id2 = result.current.success('Second');

    expect(id1).toBe('id-1');
    expect(id2).toBe('id-2');
  });

  // Options Passing
  it('should pass custom duration option', () => {
    const { result } = renderHook(() => useToast());

    result.current.success('Message', { duration: 10000 });

    expect(toastManager.show).toHaveBeenCalledWith('Message', { duration: 10000, type: 'success' });
  });

  it('should pass custom position option', () => {
    const { result } = renderHook(() => useToast());

    result.current.error('Message', { position: 'bottom-left' });

    expect(toastManager.show).toHaveBeenCalledWith('Message', { position: 'bottom-left', type: 'error' });
  });

  it('should pass multiple options', () => {
    const { result } = renderHook(() => useToast());

    result.current.warning('Message', { duration: 5000, position: 'top-center' });

    expect(toastManager.show).toHaveBeenCalledWith('Message', { duration: 5000, position: 'top-center', type: 'warning' });
  });

  // Callback Stability
  it('should have stable callback references', () => {
    const { result, rerender } = renderHook(() => useToast());

    const firstShowToast = result.current.showToast;
    const firstSuccess = result.current.success;

    rerender();

    expect(result.current.showToast).toBe(firstShowToast);
    expect(result.current.success).toBe(firstSuccess);
  });

  // Empty Message Handling
  it('should handle empty message string', () => {
    const { result } = renderHook(() => useToast());

    result.current.showToast('');

    expect(toastManager.show).toHaveBeenCalledWith('', undefined);
  });

  // Hide/Clear Operations
  it('should hide specific toast by ID', () => {
    const { result } = renderHook(() => useToast());

    result.current.hideToast('specific-id');

    expect(toastManager.hide).toHaveBeenCalledWith('specific-id');
  });

  it('should clear all toasts when clearAll called', () => {
    const { result } = renderHook(() => useToast());

    result.current.success('Toast 1');
    result.current.error('Toast 2');
    result.current.clearAll();

    expect(toastManager.clearAll).toHaveBeenCalledTimes(1);
  });

  // Return Value Verification
  it('should return toast ID from showToast', () => {
    (toastManager.show as ReturnType<typeof vi.fn>).mockReturnValue('generated-id');
    const { result } = renderHook(() => useToast());

    const id = result.current.showToast('Test');

    expect(id).toBe('generated-id');
  });

  it('should return toast ID from success helper', () => {
    (toastManager.show as ReturnType<typeof vi.fn>).mockReturnValue('success-id');
    const { result } = renderHook(() => useToast());

    const id = result.current.success('Success!');

    expect(id).toBe('success-id');
  });
});