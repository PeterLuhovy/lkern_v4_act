/*
 * ================================================================
 * FILE: Modal.tsx
 * PATH: /packages/ui-components/src/components/Modal/Modal.tsx
 * DESCRIPTION: Production modal component (centered variant only)
 * VERSION: v2.0.0
 * UPDATED: 2025-10-18 19:00:00
 *
 * NOTE: Simplified production version with centered variant only.
 *       For testing all 3 variants, see __tests__/components/Modal3Variants.tsx
 * ================================================================
 */

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from '@l-kern/config';
import styles from './Modal.module.css';

// === TYPES ===

export interface ModalProps {
  /**
   * Whether modal is open
   */
  isOpen: boolean;

  /**
   * Callback when modal should close
   */
  onClose: () => void;

  /**
   * Modal size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Modal title
   */
  title?: string;

  /**
   * Modal content
   */
  children: React.ReactNode;

  /**
   * Footer content
   */
  footer?: React.ReactNode;

  /**
   * Close on backdrop click
   * @default true
   */
  closeOnBackdropClick?: boolean;

  /**
   * Close on ESC key
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Show close button (X)
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Custom className for modal content
   */
  className?: string;
}

// === COMPONENT ===

/**
 * Production Modal component (centered variant only)
 *
 * Features:
 * - Portal rendering (outside DOM hierarchy)
 * - Focus trap (keyboard navigation locked)
 * - ESC key handler
 * - Backdrop overlay with click-to-close
 * - Centered positioning with 3 sizes (sm=400px, md=600px, lg=800px)
 *
 * @example Basic usage
 * ```tsx
 * <Modal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   title="Add Contact"
 *   size="md"
 * >
 *   <ContactForm />
 * </Modal>
 * ```
 *
 * @note For testing drawer/fullscreen variants, see __tests__/components/Modal3Variants.tsx
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  size = 'md',
  title,
  children,
  footer,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  loading = false,
  className = '',
}) => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // === FOCUS TRAP ===

  useEffect(() => {
    if (!isOpen) return;

    // Store previous focus
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus modal on open
    if (modalRef.current) {
      modalRef.current.focus();
    }

    // Restore focus on close
    return () => {
      previousFocusRef.current?.focus();
    };
  }, [isOpen]);

  // === ESC KEY HANDLER ===

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

  // === BODY SCROLL LOCK ===

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

  // === HANDLERS ===

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose();
    }
  };

  // === RENDER ===

  if (!isOpen) return null;

  const modalContent = (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div
        ref={modalRef}
        className={`${styles.modalContainer} ${styles['modal--centered']} ${styles[`modal--${size}`]} ${className}`}
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

  // Portal render
  return createPortal(modalContent, document.body);
};

export default Modal;
