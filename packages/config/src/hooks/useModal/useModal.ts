/*
 * ================================================================
 * FILE: useModal.ts
 * PATH: /packages/config/src/hooks/useModal.ts
 * DESCRIPTION: Custom hook for modal state management
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 16:00:00
 * ================================================================
 */

import { useState, useCallback } from 'react';

// === TYPES ===

export interface UseModalOptions {
  /**
   * Callback executed when modal is closed
   */
  onClose?: () => void;

  /**
   * Callback executed when confirm button is clicked
   */
  onConfirm?: () => void | Promise<void>;

  /**
   * Initial open state
   * @default false
   */
  initialOpen?: boolean;
}

export interface UseModalReturn {
  /**
   * Whether modal is currently open
   */
  isOpen: boolean;

  /**
   * Open the modal
   */
  open: () => void;

  /**
   * Close the modal (only if not submitting)
   */
  close: () => void;

  /**
   * Execute confirm action (calls onConfirm callback)
   */
  confirm: () => void;

  /**
   * Whether modal is in submitting state (prevents closing)
   */
  isSubmitting: boolean;

  /**
   * Set submitting state
   */
  setIsSubmitting: (submitting: boolean) => void;
}

// === HOOK ===

/**
 * Hook for managing modal state and lifecycle
 *
 * @example Basic usage
 * ```tsx
 * const modal = useModal({
 *   onClose: () => console.log('Modal closed'),
 *   onConfirm: () => console.log('Confirmed')
 * });
 *
 * return (
 *   <>
 *     <button onClick={modal.open}>Open Modal</button>
 *     <Modal
 *       isOpen={modal.isOpen}
 *       onClose={modal.close}
 *       isSubmitting={modal.isSubmitting}
 *     >
 *       Content
 *     </Modal>
 *   </>
 * );
 * ```
 *
 * @example With async submission
 * ```tsx
 * const modal = useModal({
 *   onConfirm: async () => {
 *     modal.setIsSubmitting(true);
 *     try {
 *       await saveData();
 *       modal.close();
 *     } finally {
 *       modal.setIsSubmitting(false);
 *     }
 *   }
 * });
 * ```
 */
export const useModal = (options: UseModalOptions = {}): UseModalReturn => {
  const { onClose, onConfirm, initialOpen = false } = options;

  // === STATE ===
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // === HANDLERS ===

  /**
   * Open modal and reset submitting state
   */
  const open = useCallback(() => {
    setIsOpen(true);
    setIsSubmitting(false);
  }, []);

  /**
   * Close modal if not submitting
   * Executes onClose callback
   */
  const close = useCallback(() => {
    if (!isSubmitting) {
      setIsOpen(false);
      if (onClose) {
        onClose();
      }
    }
  }, [isSubmitting, onClose]);

  /**
   * Execute confirm action
   * Calls onConfirm callback if provided and not submitting
   */
  const confirm = useCallback(() => {
    if (!isSubmitting && onConfirm) {
      onConfirm();
    }
  }, [isSubmitting, onConfirm]);

  return {
    isOpen,
    open,
    close,
    confirm,
    isSubmitting,
    setIsSubmitting,
  };
};

export default useModal;
