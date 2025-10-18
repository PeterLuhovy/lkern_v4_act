/*
 * ================================================================
 * FILE: Modal3Variants.tsx
 * PATH: /apps/web-ui/src/__tests__/components/Modal3Variants/Modal3Variants.tsx
 * DESCRIPTION: TESTING ONLY - Modal with all 3 variants (centered, drawer, fullscreen)
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 19:00:00
 *
 * NOTE: This is a TEST-ONLY component. Production uses simplified Modal
 *       from @l-kern/ui-components with centered variant only.
 * ================================================================
 */

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from '@l-kern/config';
import styles from './Modal3Variants.module.css';

// === TYPES ===

export interface Modal3VariantsProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: 'centered' | 'drawer' | 'fullscreen';
  size?: 'sm' | 'md' | 'lg';
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  loading?: boolean;
  className?: string;
}

// === COMPONENT ===

/**
 * TEST-ONLY Modal component with all 3 variants
 *
 * This component is preserved for testing purposes only.
 * Production code should use the simplified Modal from @l-kern/ui-components.
 */
export const Modal3Variants = ({
  isOpen,
  onClose,
  variant = 'centered',
  size = 'md',
  title,
  children,
  footer,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  loading = false,
  className = '',
}: Modal3VariantsProps) => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement;

    if (modalRef.current) {
      modalRef.current.focus();
    }

    return () => {
      previousFocusRef.current?.focus();
    };
  }, [isOpen]);

  // ESC key handler
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div
        ref={modalRef}
        className={`${styles.modalContainer} ${styles[`modal--${variant}`]} ${
          variant === 'centered' ? styles[`modal--${size}`] : ''
        } ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className={styles.modalHeader}>
            {title && (
              <h2 id="modal-title" className={styles.modalTitle}>
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                className={styles.modalCloseButton}
                onClick={onClose}
                aria-label={t('common.buttons.close') || 'Close'}
                type="button"
              >
                ×
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className={styles.modalBody}>
          {loading ? (
            <div className={styles.modalLoading}>
              <div className={styles.spinner} />
              <p>{t('common.loading') || 'Loading...'}</p>
            </div>
          ) : (
            children
          )}
        </div>

        {/* Footer */}
        {footer && <div className={styles.modalFooter}>{footer}</div>}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal3Variants;
