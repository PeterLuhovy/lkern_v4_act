/*
 * ================================================================
 * FILE: useToast.ts
 * PATH: /packages/config/src/hooks/useToast/useToast.ts
 * DESCRIPTION: React hook for toast notifications (simple API)
 * VERSION: v1.0.0
 * UPDATED: 2025-10-19 13:00:00
 * ================================================================
 */

import { useCallback } from 'react';
import { useTranslation } from '../../translations';
import { toastManager, ToastOptions } from '../../utils/toastManager';

export interface UseToastReturn {
  showToast: (message: string, options?: ToastOptions) => string;
  hideToast: (id: string) => void;
  clearAll: () => void;
  success: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  error: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  warning: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  info: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
}

export const useToast = (): UseToastReturn => {
  const { t } = useTranslation();

  const showToast = useCallback((message: string, options?: ToastOptions) => {
    return toastManager.show(message, options);
  }, []);

  const hideToast = useCallback((id: string) => {
    toastManager.hide(id);
  }, []);

  const clearAll = useCallback(() => {
    toastManager.clearAll();
  }, []);

  const success = useCallback((message: string, options?: Omit<ToastOptions, 'type'>) => {
    return toastManager.show(message, { ...options, type: 'success' });
  }, []);

  const error = useCallback((message: string, options?: Omit<ToastOptions, 'type'>) => {
    return toastManager.show(message, { ...options, type: 'error' });
  }, []);

  const warning = useCallback((message: string, options?: Omit<ToastOptions, 'type'>) => {
    return toastManager.show(message, { ...options, type: 'warning' });
  }, []);

  const info = useCallback((message: string, options?: Omit<ToastOptions, 'type'>) => {
    return toastManager.show(message, { ...options, type: 'info' });
  }, []);

  return {
    showToast,
    hideToast,
    clearAll,
    success,
    error,
    warning,
    info,
  };
};