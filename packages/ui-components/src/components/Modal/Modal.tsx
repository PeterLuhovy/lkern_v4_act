/*
 * ================================================================
 * FILE: Modal.tsx
 * PATH: /packages/ui-components/src/components/Modal/Modal.tsx
 * DESCRIPTION: Production modal component with v3 enhanced features
 * VERSION: v3.0.0
 * UPDATED: 2025-10-18 22:00:00
 *
 * FEATURES (v3 enhancements):
 *   - Drag & Drop: Modal can be dragged by header
 *   - Nested Modals: Full modalStack integration with auto z-index
 *   - Enhanced Footer: Left slot (delete) + Right slot (cancel/confirm) + error message
 *   - Alignment: top/center/bottom positioning
 *   - Padding Override: Custom overlay padding for nested modals
 *
 * KEYBOARD SHORTCUTS:
 *   - Handled by BasePage component (global ESC key closes topmost modal)
 *   - Modal registers onClose callback via modalStack
 *   - BasePage calls modalStack.closeModal() on ESC press
 *
 * MIGRATED FROM: L-KERN v3 ModalBaseTemplate.tsx (lines 1-681)
 * ================================================================
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation, modalStack } from '@l-kern/config';
import styles from './Modal.module.css';

// === TYPES ===

/**
 * Enhanced footer configuration
 * Allows separate left (delete) and right (cancel/confirm) action slots
 */
export interface ModalFooterConfig {
  /**
   * Left side content (typically delete button)
   */
  left?: React.ReactNode;

  /**
   * Right side content (typically cancel + confirm buttons)
   */
  right?: React.ReactNode;

  /**
   * Error message to display in footer
   */
  errorMessage?: string;
}

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
   * Unique modal identifier (required for nested modals and keyboard handling)
   * @example 'edit-contact', 'add-company'
   */
  modalId: string;

  /**
   * Parent modal ID (for nested modals)
   * @example When opening edit modal from list modal, pass list modal's ID
   */
  parentModalId?: string;

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
   * Can be:
   * - React.ReactNode (simple footer)
   * - ModalFooterConfig (enhanced footer with left/right slots)
   */
  footer?: React.ReactNode | ModalFooterConfig;

  /**
   * Close on backdrop click
   * @default false
   */
  closeOnBackdropClick?: boolean;

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
   * Disable dragging
   * @default false
   */
  disableDrag?: boolean;

  /**
   * Vertical alignment
   * @default 'center'
   */
  alignment?: 'top' | 'center' | 'bottom';

  /**
   * Overlay padding override (for nested modals)
   * @default '64px'
   */
  overlayPadding?: string;

  /**
   * Z-index override (auto-calculated from modalStack if not provided)
   */
  zIndexOverride?: number;

  /**
   * Custom className for modal content
   */
  className?: string;
}

// === HELPER FUNCTIONS ===

/**
 * Check if footer is ModalFooterConfig object
 */
function isModalFooterConfig(
  footer: React.ReactNode | ModalFooterConfig | undefined
): footer is ModalFooterConfig {
  return (
    footer !== null &&
    footer !== undefined &&
    typeof footer === 'object' &&
    !React.isValidElement(footer) &&
    ('left' in footer || 'right' in footer || 'errorMessage' in footer)
  );
}

/**
 * Convert alignment prop to CSS flexbox value
 */
function getAlignmentValue(alignment?: 'top' | 'center' | 'bottom'): string {
  switch (alignment) {
    case 'top':
      return 'flex-start';
    case 'bottom':
      return 'flex-end';
    case 'center':
    default:
      return 'center';
  }
}

// === COMPONENT ===

/**
 * Production Modal component with v3 enhanced features
 *
 * **Features:**
 * - Portal rendering (outside DOM hierarchy)
 * - Focus trap (keyboard navigation locked)
 * - Nested modals support (auto z-index via modalStack)
 * - Drag & Drop (draggable by header)
 * - Enhanced footer (left/right slots + error message)
 * - Alignment options (top/center/bottom)
 * - Backdrop overlay with click-to-close
 * - 3 sizes (sm=400px, md=600px, lg=800px)
 * - Keyboard shortcuts handled globally by BasePage wrapper
 *
 * @example Basic usage
 * ```tsx
 * <Modal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   modalId="add-contact"
 *   title="Add Contact"
 *   size="md"
 * >
 *   <ContactForm />
 * </Modal>
 * ```
 *
 * @example Enhanced footer
 * ```tsx
 * <Modal
 *   footer={{
 *     left: <Button variant="danger">Delete</Button>,
 *     right: (
 *       <>
 *         <Button variant="secondary" onClick={onClose}>Cancel</Button>
 *         <Button variant="primary" onClick={onSave}>Save</Button>
 *       </>
 *     ),
 *     errorMessage: error ? 'Please fix validation errors' : undefined
 *   }}
 * />
 * ```
 *
 * @example Nested modal
 * ```tsx
 * <Modal modalId="list" title="Contacts">
 *   <ContactList />
 *   <Modal
 *     modalId="edit"
 *     parentModalId="list"
 *     title="Edit Contact"
 *   >
 *     <EditForm />
 *   </Modal>
 * </Modal>
 * ```
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  modalId,
  parentModalId,
  size = 'md',
  title,
  children,
  footer,
  closeOnBackdropClick = false,
  showCloseButton = true,
  loading = false,
  disableDrag = false,
  alignment = 'center',
  overlayPadding = '64px',
  zIndexOverride,
  className = '',
}) => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Drag & Drop state
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Auto z-index from modalStack
  const [calculatedZIndex, setCalculatedZIndex] = useState<number>(1000);

  // ================================================================
  // MODAL STACK REGISTRATION
  // ================================================================

  useEffect(() => {
    if (isOpen) {
      // Register in modalStack and get z-index
      const zIndex = modalStack.push(modalId, parentModalId, onClose);
      setCalculatedZIndex(zIndex);

      console.log('[Modal] Registered:', modalId, 'z-index:', zIndex);
    }

    return () => {
      if (isOpen) {
        // Unregister from modalStack
        modalStack.pop(modalId);
        console.log('[Modal] Unregistered:', modalId);
      }
    };
  }, [isOpen, modalId, parentModalId, onClose]);

  // ================================================================
  // DRAG AND DROP HANDLERS
  // ================================================================

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (disableDrag) return;

    // Only allow dragging from header (not close button)
    if ((e.target as HTMLElement).closest('button')) return;

    e.preventDefault(); // Prevent text selection while dragging
    e.stopPropagation(); // Prevent event bubbling

    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();

      // If this is the first drag (position is null), initialize to current centered position
      if (position === null) {
        setPosition({
          x: rect.left,
          y: rect.top,
        });
      }

      // Calculate offset from mouse to modal top-left corner
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });

      setIsDragging(true);
    }
  }, [disableDrag, position]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      setPosition({ x: newX, y: newY });
    },
    [isDragging, dragOffset]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    // Note: dragStartPosRef is NOT cleared here - we need it for click detection in handleBackdropClick
  }, []);

  // ================================================================
  // LIFECYCLE EFFECTS
  // ================================================================

  // Reset position when modal opens
  useEffect(() => {
    if (isOpen) {
      setPosition(null); // null = centered, non-null = absolute position
      setIsDragging(false);
    }
  }, [isOpen]);

  // Drag event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

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
    // Only close if clicking directly on backdrop (not on modal content)
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose();
    }
  };

  // === RENDER ===

  if (!isOpen) return null;

  // Determine final z-index
  const finalZIndex = zIndexOverride || calculatedZIndex;

  // Separate footer into config or ReactNode
  const footerConfig = isModalFooterConfig(footer) ? footer : null;
  const footerNode = !footerConfig ? (footer as React.ReactNode) : null;

  // Calculate modal position styles
  const modalPositionStyle: React.CSSProperties = position
    ? {
        // Absolute positioning after drag started
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'none',
      }
    : {
        // Centered positioning (default)
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      };

  const modalContent = (
    <div
      className={styles.modalOverlay}
      onClick={handleBackdropClick}
      style={{
        zIndex: finalZIndex,
        alignItems: getAlignmentValue(alignment),
        padding: overlayPadding,
      }}
      data-modal-overlay="true"
      data-modal-id={modalId}
    >
      <div
        ref={modalRef}
        className={`${styles.modalContainer} ${position === null ? styles['modal--centered'] : ''} ${styles[`modal--${size}`]} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
        style={{
          ...modalPositionStyle,
          userSelect: isDragging ? 'none' : 'auto',
          zIndex: finalZIndex + 1,
        }}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div
            className={styles.modalHeader}
            onMouseDown={handleMouseDown}
            style={{
              cursor: disableDrag ? 'default' : isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
            }}
          >
            {title && (
              <h2 id="modal-title" className={styles.modalTitle}>
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                className={styles.modalCloseButton}
                onClick={onClose}
                aria-label={t('common.close')}
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

        {/* Footer - Enhanced or Simple */}
        {footer && (
          <div className={styles.modalFooter}>
            {footerConfig ? (
              // Enhanced footer with left/right slots
              <div className={styles.modalFooterEnhanced}>
                {/* Left side: Delete button + error message */}
                <div className={styles.modalFooterLeft}>
                  {footerConfig.left}
                  {footerConfig.errorMessage && (
                    <div className={styles.modalFooterError}>
                      <span role="img" aria-label="Error">
                        ❌
                      </span>{' '}
                      {footerConfig.errorMessage}
                    </div>
                  )}
                </div>

                {/* Right side: Cancel + Confirm */}
                <div className={styles.modalFooterRight}>{footerConfig.right}</div>
              </div>
            ) : (
              // Simple footer (ReactNode)
              footerNode
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Portal render
  return createPortal(modalContent, document.body);
};

export default Modal;
