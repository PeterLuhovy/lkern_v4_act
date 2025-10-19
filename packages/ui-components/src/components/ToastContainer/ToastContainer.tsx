/*
 * ================================================================
 * FILE: ToastContainer.tsx
 * PATH: /packages/ui-components/src/components/ToastContainer/ToastContainer.tsx
 * DESCRIPTION: Container for rendering toast notifications (queue)
 * VERSION: v1.0.0
 * UPDATED: 2025-10-19 13:00:00
 * ================================================================
 */

import React from 'react';
import { useToastContext } from '@l-kern/config';
import { Toast } from '../Toast';
import styles from './ToastContainer.module.css';

export interface ToastContainerProps {
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'bottom-center'
}) => {
  const { toasts, hideToast } = useToastContext();

  // Filter toasts by position
  const filteredToasts = toasts.filter(toast => (toast.position || 'bottom-center') === position);

  if (filteredToasts.length === 0) {
    return null;
  }

  const containerClasses = [
    styles.toastContainer,
    styles[`toastContainer--${position}`],
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses} data-testid="toast-container">
      {filteredToasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={hideToast}
        />
      ))}
    </div>
  );
};

export default ToastContainer;