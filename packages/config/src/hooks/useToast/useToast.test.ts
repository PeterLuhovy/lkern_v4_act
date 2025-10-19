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
});