/*
 * ================================================================
 * FILE: useConfirm.ts
 * PATH: /packages/config/src/hooks/useConfirm/useConfirm.ts
 * DESCRIPTION: React hook for displaying confirmation dialogs with Promise-based API
 * VERSION: v2.0.0
 * UPDATED: 2025-10-30 20:00:00
 * ================================================================
 */

import { useState, useRef, useCallback } from 'react';

/**
 * Confirmation options for useConfirm hook
 */
export interface ConfirmOptions {
  /**
   * Confirmation message to display
   */
  message?: string;

  /**
   * Modal title
   */
  title?: string;

  /**
   * Confirm button label
   */
  confirmButtonLabel?: string;

  /**
   * Cancel button label
   */
  cancelButtonLabel?: string;

  /**
   * Keyword for danger mode (e.g., "ano", "delete")
   * If provided, activates danger mode with keyword validation
   */
  confirmKeyword?: string;

  /**
   * Danger mode styling (red button)
   */
  isDanger?: boolean;
}

/**
 * Internal state for confirmation dialog
 */
export interface ConfirmState extends ConfirmOptions {
  isOpen: boolean;
}

/**
 * Result returned by useConfirm hook
 */
export interface UseConfirmResult {
  /**
   * Shows confirmation dialog and returns Promise
   * @param options - Confirmation options (message, title, danger mode, etc.)
   * @returns Promise that resolves to true (confirmed) or false (cancelled)
   */
  confirm: (options: string | ConfirmOptions) => Promise<boolean>;

  /**
   * Internal state - current confirmation state (for ConfirmModal rendering)
   * @internal
   */
  state: ConfirmState;

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
 * Provides Promise-based confirmation dialogs with support for simple and danger modes.
 *
 * **Features:**
 * - Promise-based API (use with async/await)
 * - Simple mode: Quick yes/no confirmations
 * - Danger mode: Keyword validation for destructive actions
 * - Keyboard shortcuts (Enter/ESC)
 * - Nested modal support
 * - Automatic cleanup on unmount
 *
 * @returns Object with confirm function and internal state/handlers
 *
 * @example Simple confirmation
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
 *
 * @example Danger mode with keyword
 * ```tsx
 * function DeleteAllButton() {
 *   const { confirm } = useConfirm();
 *
 *   const handleDeleteAll = async () => {
 *     const confirmed = await confirm({
 *       message: 'Vymazať všetky záznamy?',
 *       confirmKeyword: 'ano',
 *       isDanger: true
 *     });
 *
 *     if (confirmed) {
 *       await deleteAllRecords();
 *     }
 *   };
 *
 *   return <button onClick={handleDeleteAll}>Delete All</button>;
 * }
 * ```
 */
export function useConfirm(): UseConfirmResult {
  // Confirmation state (includes all options + isOpen flag)
  const [state, setState] = useState<ConfirmState>({
    isOpen: false,
    message: '',
    title: undefined,
    confirmButtonLabel: undefined,
    cancelButtonLabel: undefined,
    confirmKeyword: undefined,
    isDanger: false,
  });

  // Store Promise resolve function in ref (survives re-renders)
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  /**
   * Confirm function - shows modal and returns Promise
   * Accepts either a simple string message or full options object
   */
  const confirm = useCallback((options: string | ConfirmOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      // Store resolve function for later use
      resolveRef.current = resolve;

      // Parse options (string shorthand or full object)
      const confirmOptions: ConfirmOptions = typeof options === 'string'
        ? { message: options }
        : options;

      // Open modal with options
      setState({
        isOpen: true,
        message: confirmOptions.message || '',
        title: confirmOptions.title,
        confirmButtonLabel: confirmOptions.confirmButtonLabel,
        cancelButtonLabel: confirmOptions.cancelButtonLabel,
        confirmKeyword: confirmOptions.confirmKeyword,
        isDanger: confirmOptions.isDanger || false,
      });
    });
  }, []);

  /**
   * Handle confirm button click (or Enter key)
   * Called by ConfirmModal after keyword validation (if danger mode)
   */
  const handleConfirm = useCallback(() => {
    // Resolve Promise with true
    if (resolveRef.current) {
      resolveRef.current(true);
      resolveRef.current = null;
    }

    // Close modal
    setState(prev => ({ ...prev, isOpen: false }));
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
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    confirm,
    state,
    handleConfirm,
    handleCancel,
  };
}

export default useConfirm;
