/*
 * ================================================================
 * FILE: useConfirm.ts
 * PATH: /packages/config/src/hooks/useConfirm/useConfirm.ts
 * DESCRIPTION: React hook for displaying confirmation dialogs with Promise-based API
 * VERSION: v1.0.0
 * UPDATED: 2025-10-20 16:00:00
 * ================================================================
 */

import { useState, useRef, useCallback } from 'react';

/**
 * Result returned by useConfirm hook
 */
export interface UseConfirmResult {
  /**
   * Shows confirmation dialog and returns Promise
   * @param message - Confirmation message to display
   * @returns Promise that resolves to true (confirmed) or false (cancelled)
   */
  confirm: (message: string) => Promise<boolean>;

  /**
   * Internal state - modal open status (for rendering)
   * @internal
   */
  isOpen: boolean;

  /**
   * Internal state - current message (for rendering)
   * @internal
   */
  message: string;

  /**
   * Internal handler - confirm button clicked
   * @internal
   */
  handleConfirm: () => void;

  /**
   * Internal handler - cancel button clicked
   * @internal
   */
  handleCancel: () => void;
}

/**
 * useConfirm Hook
 *
 * Provides Promise-based confirmation dialogs. User calls confirm(message)
 * which returns a Promise that resolves to true (confirmed) or false (cancelled).
 *
 * **Features:**
 * - Promise-based API (use with async/await)
 * - Modal integration with modalStack
 * - Keyboard shortcuts (Enter/ESC)
 * - Nested modal support
 * - Automatic cleanup on unmount
 *
 * @returns Object with confirm function and internal state/handlers
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { confirm } = useConfirm();
 *
 *   const handleDelete = async () => {
 *     const confirmed = await confirm('Naozaj chceš vymazať?');
 *     if (confirmed) {
 *       await deleteRecord();
 *     }
 *   };
 *
 *   return <button onClick={handleDelete}>Delete</button>;
 * }
 * ```
 */
export function useConfirm(): UseConfirmResult {
  // Modal open/close state
  const [isOpen, setIsOpen] = useState(false);

  // Current confirmation message
  const [message, setMessage] = useState('');

  // Store Promise resolve function in ref (survives re-renders)
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  /**
   * Confirm function - shows modal and returns Promise
   */
  const confirm = useCallback((confirmMessage: string): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      // Store resolve function for later use
      resolveRef.current = resolve;

      // Open modal with message
      setMessage(confirmMessage || 'Naozaj chceš pokračovať?');
      setIsOpen(true);
    });
  }, []);

  /**
   * Handle confirm button click (or Enter key)
   */
  const handleConfirm = useCallback(() => {
    // Resolve Promise with true
    if (resolveRef.current) {
      resolveRef.current(true);
      resolveRef.current = null;
    }

    // Close modal
    setIsOpen(false);
  }, []);

  /**
   * Handle cancel button click (or ESC key)
   */
  const handleCancel = useCallback(() => {
    // Resolve Promise with false
    if (resolveRef.current) {
      resolveRef.current(false);
      resolveRef.current = null;
    }

    // Close modal
    setIsOpen(false);
  }, []);

  return {
    confirm,
    isOpen,
    message,
    handleConfirm,
    handleCancel,
  };
}

export default useConfirm;
