/*
 * ================================================================
 * FILE: Modal.tsx
 * PATH: /packages/ui-components/src/components/Modal/Modal.tsx
 * DESCRIPTION: Production modal component with v3 enhanced features
 * VERSION: v3.4.0
 * UPDATED: 2025-10-19 01:30:00
 *
 * FEATURES (v3 enhancements):
 *   - Drag & Drop: Modal can be dragged by header
 *   - Nested Modals: Full modalStack integration with auto z-index
 *   - Enhanced Footer: Left slot (delete) + Right slot (cancel/confirm) + error message
 *   - Alignment: top/center/bottom positioning
 *   - Padding Override: Custom overlay padding for nested modals
 *
 * KEYBOARD SHORTCUTS (HYBRID APPROACH - v3.2.0+):
 *   - Modal handles ESC and Enter locally (separation of concerns)
 *   - ESC: Closes topmost modal only (bubble phase ensures correct order)
 *   - Enter: Confirms topmost modal (calls onConfirm directly, if provided)
 *   - Uses bubble phase (false) instead of capture phase for proper event order
 *   - BasePage only handles global shortcuts (Ctrl+D, Ctrl+L)
 *
 * CHANGES:
 *   - v3.4.0: Fixed nested modal ESC - switched to bubble phase listeners
 *   - v3.3.0: Attempted fix with _modalHandled flag (didn't work)
 *   - v3.2.0: Hybrid keyboard handling - Modal handles ESC/Enter locally
 *   - v3.1.0: Initial version with keyboard delegation to BasePage
 *
 * MIGRATED FROM: L-KERN v3 ModalBaseTemplate.tsx (lines 1-681)
 * ================================================================
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation, useTheme, modalStack, usePageAnalytics } from '@l-kern/config';
import { DebugBar } from '../DebugBar';
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
   * Callback when modal should confirm/submit (triggered by Enter key in BasePage)
   * @optional If provided, pressing Enter will call this function
   * @example () => handleSaveContact()
   */
  onConfirm?: () => void;

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

  /**
   * Show debug bar with analytics
   * @default true
   */
  showDebugBar?: boolean;

  /**
   * Modal name for debug bar
   * @default Uses title or modalId if not provided
   */
  debugPageName?: string;
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
 *   onConfirm={handleSave}  // Enter key will trigger this
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
  onConfirm,
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
  showDebugBar = true,
  debugPageName,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Drag & Drop state
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Auto z-index from modalStack
  const [calculatedZIndex, setCalculatedZIndex] = useState<number>(1000);

  // Analytics for DebugBar
  const analytics = usePageAnalytics(debugPageName || modalId);

  // Check if dark mode is active
  const isDarkMode = theme === 'dark';

  // ================================================================
  // DEBUG BAR ANALYTICS SESSION
  // ================================================================

  useEffect(() => {
    if (isOpen && showDebugBar) {
      analytics.startSession();
      console.log('[Modal] DebugBar session started:', debugPageName || modalId);
    }

    return () => {
      if (showDebugBar && analytics.session) {
        analytics.endSession('dismissed');
        console.log('[Modal] DebugBar session ended');
      }
    };
  }, [isOpen, showDebugBar, analytics, debugPageName, modalId]);

  // ================================================================
  // MODAL STACK REGISTRATION
  // ================================================================

  useEffect(() => {
    if (isOpen) {
      // Register in modalStack and get z-index
      const zIndex = modalStack.push(modalId, parentModalId, onClose, onConfirm);
      setCalculatedZIndex(zIndex);

      console.log('[Modal] Registered:', modalId, 'z-index:', zIndex, 'hasConfirm:', !!onConfirm);
    }

    return () => {
      if (isOpen) {
        // Unregister from modalStack
        modalStack.pop(modalId);
        console.log('[Modal] Unregistered:', modalId);
      }
    };
  }, [isOpen, modalId, parentModalId, onClose, onConfirm]);

  // ================================================================
  // KEYBOARD SHORTCUTS (HYBRID APPROACH)
  // ================================================================
  // Modal handles ESC and Enter locally (not delegated to BasePage)
  // This gives modal full control over its keyboard behavior

  useEffect(() => {
    if (!isOpen) return;

    const handleModalKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in input field
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return; // Let user type normally
      }

      // CRITICAL: Check if this modal is topmost SYNCHRONOUSLY
      // This must happen BEFORE any setState/onClose calls
      const topmostModalId = modalStack.getTopmostModalId();

      console.log('[Modal] KeyDown:', {
        modalId,
        topmost: topmostModalId,
        key: e.key,
        isTopmost: topmostModalId === modalId
      });

      // Only topmost modal handles keyboard events
      if (topmostModalId !== modalId) {
        console.log('[Modal] Not topmost, ignoring event');
        return;
      }

      // ESC key - Close modal
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();

        console.log('[Modal] ESC - closing topmost modal:', modalId);
        onClose();
        return;
      }

      // ENTER key - Confirm/submit (if onConfirm defined)
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();

        if (onConfirm) {
          console.log('[Modal] ENTER - confirming modal:', modalId);
          onConfirm();
        } else {
          console.log('[Modal] ENTER - no onConfirm, preventing default only');
        }
        return;
      }
    };

    // IMPORTANT: Use BUBBLE phase (false), NOT capture phase
    // Bubble phase ensures child modal listener runs BEFORE parent
    // (Child is deeper in DOM, so it bubbles up from child to parent)
    document.addEventListener('keydown', handleModalKeyDown, false);

    return () => {
      document.removeEventListener('keydown', handleModalKeyDown, false);
    };
  }, [isOpen, modalId, onClose, onConfirm]);

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
  // If position is set (after drag), use absolute positioning
  // Otherwise, let flexbox overlay handle alignment (top/center/bottom)
  const modalPositionStyle: React.CSSProperties = position
    ? {
        // Absolute positioning after drag started
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'none',
      }
    : {
        // Flexbox positioning - let overlay alignment control vertical position
        // No fixed position needed - flexbox does the work
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
        {/* Debug Bar - Top of modal */}
        {showDebugBar && (
          <DebugBar
            modalName={debugPageName || title || modalId}
            isDarkMode={isDarkMode}
            analytics={analytics}
            show={showDebugBar}
          />
        )}

        {/* Header */}
        {(title || showCloseButton) && (
          <div
            className={styles.modalHeader}
            onMouseDown={handleMouseDown}
            style={{
              cursor: disableDrag ? 'default' : isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              paddingTop: showDebugBar ? '48px' : undefined,
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

  // Portal render - wrap in fragment to satisfy React.FC return type
  return <>{createPortal(modalContent, document.body)}</>;
};

export default Modal;
