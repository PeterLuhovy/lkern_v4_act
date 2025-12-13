/*
 * ================================================================
 * FILE: Toast.tsx
 * PATH: /packages/ui-components/src/components/Toast/Toast.tsx
 * DESCRIPTION: Toast notification component (single toast)
 * VERSION: v1.0.0
 * UPDATED: 2025-10-19 13:00:00
 * ================================================================
 */

import React, { useEffect, useState } from 'react';
import type { Toast as ToastType } from '@l-kern/config';
import { useTranslation } from '@l-kern/config';
import styles from './Toast.module.css';

export interface ToastProps {
  toast: ToastType;
  onClose?: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in animation
    const fadeInTimer = setTimeout(() => setIsVisible(true), 10);

    return () => clearTimeout(fadeInTimer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for fade-out animation before calling onClose
    setTimeout(() => {
      if (onClose) onClose(toast.id);
    }, 300); // Match CSS transition duration
  };

  // Icon based on toast type
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '✓';
    }
  };

  const classes = [
    styles.toast,
    styles[`toast--${toast.type || 'success'}`],
    isVisible ? styles['toast--visible'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      role="alert"
      aria-live="polite"
      data-toast-id={toast.id}
    >
      <div className={styles.toast__icon}>{getIcon()}</div>
      <div className={styles.toast__content}>
        <div className={styles.toast__message}>{toast.message}</div>
        {toast.copiedContent && (
          <div className={styles.toast__copiedContent}>{toast.copiedContent}</div>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          className={styles.toast__closeButton}
          onClick={handleClose}
          aria-label={t('common.ariaLabels.closeNotification')}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Toast;