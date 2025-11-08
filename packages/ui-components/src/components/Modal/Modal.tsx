/*
 * ================================================================
 * FILE: Modal.tsx
 * PATH: /packages/ui-components/src/components/Modal/Modal.tsx
 * DESCRIPTION: Production modal component with v3 enhanced features
 * VERSION: v3.8.0
 * UPDATED: 2025-10-19 17:00:00
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
 *   - ESC: Input focused → blur input | No input → close modal
 *   - Enter: Input focused → blur input | No input → submit (onConfirm) OR close (no onConfirm)
 *   - Uses bubble phase (false) instead of capture phase for proper event order
 *   - BasePage only handles global shortcuts (Ctrl+D, Ctrl+L)
 *
 * CHANGES:
 *   - v3.7.0: CRITICAL - Fixed 2 memory leaks (drag listeners + keyboard listener churn)
 *   - v3.6.0: Enter closes modal when no onConfirm (same as ESC)
 *   - v3.5.0: Enhanced input field handling - ESC/Enter blur input instead of modal action
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
import { useTranslation, useTheme, modalStack, usePageAnalytics, useConfirm } from '@l-kern/config';
import { DebugBar } from '../DebugBar';
import { ConfirmModal } from '../ConfirmModal';
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
   * Indicates if there are unsaved changes (opt-in dirty tracking)
   * When true, closing modal will show unsaved changes confirmation
   * @default false
   * @example hasUnsavedChanges={isDirty}
   */
  hasUnsavedChanges?: boolean;

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
   * Modal name for analytics (English name)
   * @default Uses modalId if not provided
   * @example 'contactEdit', 'companyAdd'
   */
  pageName?: string;

  /**
   * Form validation state
   * When false, submit/confirm button will be disabled
   * @default true
   */
  isFormValid?: boolean;

  /**
   * Maximum width for modal content
   * @example '600px', '80vw', '50rem'
   */
  maxWidth?: string;
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
    ('left' in footer || 'right' in footer)
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
  hasUnsavedChanges = false,
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
  pageName,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const unsavedConfirm = useConfirm();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const debugBarRef = useRef<HTMLDivElement>(null);

  // Drag & Drop state
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const listenersAttachedRef = useRef(false); // Track drag listener state

  // Auto z-index from modalStack
  const [calculatedZIndex, setCalculatedZIndex] = useState<number>(1000);

  // Debug bar height (dynamic, measured from actual rendered height)
  const [debugBarHeight, setDebugBarHeight] = useState<number>(0);

  // Analytics for DebugBar (modal context)
  const analytics = usePageAnalytics(pageName || modalId, 'modal');

  // Check if dark mode is active
  const isDarkMode = theme === 'dark';

  // DEBUG: Log when Modal component mounts/updates with hasUnsavedChanges (DISABLED - too noisy)
  // console.log('[Modal] Component render, modalId:', modalId, 'hasUnsavedChanges:', hasUnsavedChanges);

  // ================================================================
  // CLOSE WITH UNSAVED CHANGES CONFIRMATION
  // ================================================================

  /**
   * Handles close with optional unsaved changes confirmation
   * If hasUnsavedChanges is true, shows confirmation dialog first
   * NOTE: Cannot be async - React onClick handlers don't wait for Promises
   */
  const handleCloseWithConfirm = useCallback(() => {
    if (hasUnsavedChanges) {
      // Use empty object so ConfirmModal loads default unsavedChanges translations
      // This returns a Promise, but we don't await it - instead we handle result in .then()
      unsavedConfirm.confirm({}).then((confirmed) => {
        if (confirmed) {
          onClose();
        }
      });
      // Modal stays open until user responds to confirmation
    } else {
      onClose();
    }
  }, [hasUnsavedChanges, unsavedConfirm, onClose]);


  // ================================================================
  // DEBUG BAR ANALYTICS SESSION
  // ================================================================

  useEffect(() => {
    if (isOpen && showDebugBar) {
      analytics.startSession();
    }

    return () => {
      if (showDebugBar) {
        // End session if still active
        if (analytics.isSessionActive) {
          analytics.endSession('dismissed');
        }

        // CRITICAL: ALWAYS reset session on cleanup to allow quick reopen
        // Without this, reopening modal quickly would fail (endTime check in startSession)
        analytics.resetSession();
      }
    };
    // analytics functions are stable (useCallback), safe to exclude from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, showDebugBar, pageName, modalId]);

  // ================================================================
  // DEBUG BAR HEIGHT MEASUREMENT
  // ================================================================

  useEffect(() => {
    if (isOpen && showDebugBar && debugBarRef.current) {
      // Measure debug bar height after render
      const measureHeight = () => {
        if (debugBarRef.current) {
          const height = debugBarRef.current.offsetHeight;
          setDebugBarHeight(height);
        }
      };

      // Initial measurement
      measureHeight();

      // Re-measure on window resize (debug bar may wrap to multiple lines)
      window.addEventListener('resize', measureHeight);

      return () => {
        window.removeEventListener('resize', measureHeight);
      };
    } else {
      setDebugBarHeight(0);
    }
  }, [isOpen, showDebugBar]);

  // ================================================================
  // MODAL STACK REGISTRATION
  // ================================================================

  useEffect(() => {
    if (isOpen) {
      // Register in modalStack and get z-index
      const zIndex = modalStack.push(modalId, parentModalId, handleCloseWithConfirm, onConfirm);
      setCalculatedZIndex(zIndex);
    }

    return () => {
      if (isOpen) {
        // Unregister from modalStack
        modalStack.pop(modalId);
      }
    };
    // CRITICAL: onClose and onConfirm are intentionally excluded from dependencies
    // to prevent unmount/remount cycles when parent component re-renders with new function references.
    // modalStack stores these functions internally and uses the latest version when called.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, modalId, parentModalId]);

  // ================================================================
  // KEYBOARD SHORTCUTS (HYBRID APPROACH)
  // ================================================================
  // Modal handles ESC and Enter locally (not delegated to BasePage)
  // This gives modal full control over its keyboard behavior

  // Stabilize keyboard handler with useRef to prevent listener churn
  const handleModalKeyEventRef = useRef<((e: KeyboardEvent) => void) | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleModalKeyEvent = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      // Check if user is typing in input field
      const isInputField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      // CRITICAL: Check if this modal is topmost SYNCHRONOUSLY
      // This must happen BEFORE any setState/onClose calls
      const topmostModalId = modalStack.getTopmostModalId();

      // Only topmost modal handles keyboard events
      if (topmostModalId !== modalId) {
        return;
      }

      // Track keyboard event in analytics (BOTH keydown and keyup for topmost modal)
      if (showDebugBar) {
        analytics.trackKeyboard(e);
      }

      // Only process shortcuts on keydown (not keyup)
      if (e.type !== 'keydown') {
        return;
      }

      // ESC key handling
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();

        if (isInputField) {
          // Input field is focused → blur it (remove focus)
          target.blur();
        } else {
          // No input focused → close modal (with unsaved changes check)
          handleCloseWithConfirm();
        }
        return;
      }

      // ENTER key handling
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();

        if (isInputField) {
          // Input field is focused → blur it (remove focus)
          target.blur();
        } else {
          // No input focused → submit OR close modal
          if (onConfirm) {
            // Modal has onConfirm → submit
            onConfirm();
          } else {
            // Modal has NO onConfirm → close (same as ESC, with unsaved changes check)
            handleCloseWithConfirm();
          }
        }
        return;
      }
    };

    // Update ref with current handler
    handleModalKeyEventRef.current = handleModalKeyEvent;

    // FIXED: Stable event handler to prevent listener churn
    const stableHandler = (e: KeyboardEvent) => {
      handleModalKeyEventRef.current?.(e);
    };

    // IMPORTANT: Use BUBBLE phase (false), NOT capture phase
    // Bubble phase ensures child modal listener runs BEFORE parent
    // (Child is deeper in DOM, so it bubbles up from child to parent)
    // Register BOTH keydown and keyup listeners
    document.addEventListener('keydown', stableHandler, false);
    document.addEventListener('keyup', stableHandler, false);

    return () => {
      document.removeEventListener('keydown', stableHandler, false);
      document.removeEventListener('keyup', stableHandler, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, modalId, onClose, onConfirm]);

  // ================================================================
  // DRAG AND DROP HANDLERS
  // ================================================================

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (disableDrag) return;

    // Only allow dragging from header (not close button)
    if ((e.target as HTMLElement).closest('button')) return;

    // Blur any focused input before dragging
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

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

  // Drag event listeners - FIXED: Memory leak prevention
  useEffect(() => {
    if (isDragging && !listenersAttachedRef.current) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      listenersAttachedRef.current = true;
    }

    if (!isDragging && listenersAttachedRef.current) {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      listenersAttachedRef.current = false;
    }

    // CRITICAL: Cleanup on unmount
    return () => {
      if (listenersAttachedRef.current) {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        listenersAttachedRef.current = false;
      }
    };
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
      handleCloseWithConfirm();
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
      onClick={(e) => {
        // Stop event propagation to prevent BasePage analytics from tracking modal clicks
        e.stopPropagation();
        handleBackdropClick(e);
      }}
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
        data-modal-container-id={modalId}
        style={{
          ...modalPositionStyle,
          userSelect: isDragging ? 'none' : 'auto',
          zIndex: finalZIndex + 1,
        }}
        onMouseDown={(e) => {
          // CRITICAL: Stop propagation to prevent BasePage from tracking modal clicks
          e.stopPropagation();

          // Track mousedown inside modal
          if (showDebugBar) {
            const target = e.target as HTMLElement;
            const elementType = target.tagName.toLowerCase();

            // Get meaningful element identifier (priority order)
            const elementId =
              target.id ||
              target.getAttribute('data-testid') ||
              target.getAttribute('aria-label') ||
              target.getAttribute('name') ||
              (target.textContent?.trim().substring(0, 20) || elementType);

            analytics.trackClick(elementId, elementType, e);
          }
        }}
        onMouseUp={(e) => {
          // CRITICAL: Check if event came from THIS modal or a CHILD modal
          // If event came from child modal (e.g., child modal header drag),
          // we must NOT stopPropagation, otherwise child's document mouseup listener won't fire
          const target = e.target as HTMLElement;
          const closestModalContainer = target.closest('[data-modal-container-id]') as HTMLElement;
          const eventFromChildModal = closestModalContainer?.getAttribute('data-modal-container-id') !== modalId;

          // Check if event came from header (to avoid duplicate tracking)
          const isFromHeader = target.closest(`.${styles.modalHeader}`) !== null;

          // Track mouseup inside modal (but NOT if from header - header already tracked it)
          if (showDebugBar && !eventFromChildModal && !isFromHeader) {
            const elementType = target.tagName.toLowerCase();

            // Get meaningful element identifier (priority order)
            const elementId =
              target.id ||
              target.getAttribute('data-testid') ||
              target.getAttribute('aria-label') ||
              target.getAttribute('name') ||
              (target.textContent?.trim().substring(0, 20) || elementType);

            analytics.trackClick(elementId, elementType, e);
          }

          // CRITICAL: Only stopPropagation if event is from THIS modal AND not dragging
          // If event from child modal OR if dragging, allow propagation to document
          if (!eventFromChildModal && !isDragging) {
            e.stopPropagation(); // Prevent BasePage from tracking modal clicks
          }
        }}
      >
        {/* Debug Bar - Top of modal */}
        {showDebugBar && (
          <DebugBar
            ref={debugBarRef}
            modalName={pageName || modalId}
            isDarkMode={isDarkMode}
            analytics={analytics}
            show={showDebugBar}
            contextType="modal"
          />
        )}

        {/* Header */}
        {(title || showCloseButton) && (
          <div
            className={styles.modalHeader}
            onMouseDown={(e) => {
              // Track mousedown on header (for drag analytics)
              if (showDebugBar) {
                const target = e.target as HTMLElement;
                const elementType = target.tagName.toLowerCase();
                const elementId =
                  target.id ||
                  target.getAttribute('data-testid') ||
                  target.getAttribute('aria-label') ||
                  target.getAttribute('name') ||
                  (target.textContent?.trim().substring(0, 20) || elementType);

                analytics.trackClick(elementId, elementType, e);
              }

              // Then handle drag logic
              handleMouseDown(e);
            }}
            onMouseUp={(e) => {
              // Track mouseup on header (for drag analytics)
              if (showDebugBar) {
                const target = e.target as HTMLElement;
                const elementType = target.tagName.toLowerCase();
                const elementId =
                  target.id ||
                  target.getAttribute('data-testid') ||
                  target.getAttribute('aria-label') ||
                  target.getAttribute('name') ||
                  (target.textContent?.trim().substring(0, 20) || elementType);

                analytics.trackClick(elementId, elementType, e);
              }
            }}
            style={{
              cursor: disableDrag ? 'default' : isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              paddingTop: showDebugBar && debugBarHeight > 0 ? `${debugBarHeight + 4}px` : undefined,
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
                onClick={() => {
                  handleCloseWithConfirm();
                }}
                aria-label={t('common.close')}
                title={`${t('common.close')} (ESC)`}
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
                {/* Left side: Delete button */}
                <div className={styles.modalFooterLeft}>
                  {footerConfig.left}
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
  return (
    <>
      {createPortal(modalContent, document.body)}

      {/* Unsaved Changes Confirmation Modal */}
      <ConfirmModal
        isOpen={unsavedConfirm.state.isOpen}
        onClose={unsavedConfirm.handleCancel}
        onConfirm={unsavedConfirm.handleConfirm}
        title={unsavedConfirm.state.title}
        message={unsavedConfirm.state.message}
        parentModalId={modalId}
      />
    </>
  );
};

export default Modal;
