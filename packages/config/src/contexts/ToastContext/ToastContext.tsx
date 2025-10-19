/*
 * ================================================================
 * FILE: ToastContext.tsx
 * PATH: /packages/config/src/contexts/ToastContext/ToastContext.tsx
 * DESCRIPTION: React context provider for toast notifications
 * VERSION: v1.0.0
 * UPDATED: 2025-10-19 13:00:00
 * ================================================================
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toastManager, Toast } from '../../utils/toastManager';

// === CONTEXT TYPES ===

interface ToastContextValue {
  toasts: Toast[];
  showToast: (message: string, options?: Parameters<typeof toastManager.show>[1]) => string;
  hideToast: (id: string) => void;
  clearAll: () => void;
}

// === CONTEXT ===

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// === PROVIDER ===

interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  maxToasts = 5
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    // Listen to toastManager 'show' events
    const handleShow = (toast: Toast) => {
      setToasts((prev) => {
        // Add new toast
        const updated = [...prev, toast];

        // Limit to maxToasts (remove oldest)
        if (updated.length > maxToasts) {
          return updated.slice(-maxToasts);
        }

        return updated;
      });

      // Auto-dismiss after duration (if duration > 0)
      if (toast.duration && toast.duration > 0) {
        setTimeout(() => {
          handleHide(toast);
        }, toast.duration);
      }
    };

    // Listen to toastManager 'hide' events
    const handleHide = (toast: Toast) => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    };

    // Listen to toastManager 'clear' events
    const handleClear = () => {
      setToasts([]);
    };

    // Register listeners
    toastManager.on('show', handleShow);
    toastManager.on('hide', handleHide);
    toastManager.on('clear', handleClear);

    // Cleanup on unmount
    return () => {
      toastManager.off('show', handleShow);
      toastManager.off('hide', handleHide);
      toastManager.off('clear', handleClear);
    };
  }, [maxToasts]);

  const value: ToastContextValue = {
    toasts,
    showToast: toastManager.show.bind(toastManager),
    hideToast: toastManager.hide.bind(toastManager),
    clearAll: toastManager.clearAll.bind(toastManager),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

// === HOOK ===

export const useToastContext = (): ToastContextValue => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }

  return context;
};
