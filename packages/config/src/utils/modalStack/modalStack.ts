/*
 * ================================================================
 * FILE: modalStack.ts
 * PATH: /packages/config/src/utils/modalStack.ts
 * DESCRIPTION: Modal stack management for nested modals and topmost detection
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 22:00:00
 *
 * FEATURES:
 *   - Track modal hierarchy (parent-child relationships)
 *   - Determine topmost modal for keyboard event handling
 *   - Auto z-index calculation based on stack position
 *   - Cleanup when modals close
 *
 * MIGRATED FROM: L-KERN v3 modal-stack.ts
 * ================================================================
 */

// ================================================================
// INTERFACES
// ================================================================

interface ModalStackItem {
  /**
   * Unique modal identifier
   */
  id: string;

  /**
   * Parent modal ID (if this is a nested modal)
   */
  parentId?: string;

  /**
   * Callback to close this modal
   */
  onClose?: () => void;

  /**
   * Callback to confirm/submit this modal (triggered by Enter key)
   */
  onConfirm?: () => void;

  /**
   * Z-index for this modal
   */
  zIndex: number;
}

// ================================================================
// MODAL STACK MANAGER
// ================================================================

class ModalStackManager {
  private stack: ModalStackItem[] = [];
  private baseZIndex = 1000; // Base z-index for first modal

  /**
   * Register modal in stack
   *
   * @param modalId - Unique modal identifier
   * @param parentId - Parent modal ID (optional)
   * @param onClose - Callback to close modal (optional)
   * @param onConfirm - Callback to confirm/submit modal (optional, triggered by Enter key)
   * @returns Calculated z-index for this modal
   *
   * @example
   * ```tsx
   * useEffect(() => {
   *   if (isOpen) {
   *     const zIndex = modalStack.push('edit-contact', undefined, handleClose, handleSave);
   *     setModalZIndex(zIndex);
   *   }
   *   return () => modalStack.pop('edit-contact');
   * }, [isOpen]);
   * ```
   */
  push(modalId: string, parentId?: string, onClose?: () => void, onConfirm?: () => void): number {
    // Remove existing entry if already in stack (prevent duplicates)
    this.stack = this.stack.filter((item) => item.id !== modalId);

    // Calculate z-index (base + stack position * 10)
    const zIndex = this.baseZIndex + this.stack.length * 10;

    this.stack.push({ id: modalId, parentId, onClose, onConfirm, zIndex });

    console.log('[ModalStack] PUSH:', modalId, 'parent:', parentId, 'zIndex:', zIndex, 'hasConfirm:', !!onConfirm, 'stack:', this.stack.map(m => m.id));

    return zIndex;
  }

  /**
   * Unregister modal from stack
   *
   * @param modalId - ID of modal to remove
   * @param closeChildren - If true, also close all child modals (default: false)
   * @returns true if modal had a parent (for legacy compatibility)
   *
   * @example
   * ```tsx
   * useEffect(() => {
   *   return () => {
   *     modalStack.pop('edit-contact');
   *   };
   * }, [isOpen]);
   * ```
   */
  pop(modalId: string, closeChildren: boolean = false): boolean {
    console.log('[ModalStack] POP called:', modalId, 'closeChildren:', closeChildren, 'stack before:', this.stack.map(m => m.id));

    const index = this.stack.findIndex((item) => item.id === modalId);
    if (index === -1) {
      // Modal not in stack - already popped, ignore (prevents double-pop race condition)
      console.log('[ModalStack] POP ignored - not in stack:', modalId);
      return false;
    }

    const item = this.stack[index];

    // Remove this modal from stack
    this.stack = this.stack.filter((m) => m.id !== modalId);
    console.log('[ModalStack] POP removed:', modalId, 'stack after:', this.stack.map(m => m.id));

    // Close all child modals ONLY if explicitly requested (user close, not cleanup)
    if (closeChildren) {
      const childModals = this.stack.filter((m) => m.parentId === modalId);
      console.log('[ModalStack] Closing children:', childModals.map(m => m.id));
      childModals.forEach((child) => {
        if (child.onClose) {
          // Remove child from stack first
          this.stack = this.stack.filter((m) => m.id !== child.id);
          // Trigger child close
          child.onClose();
        }
      });
    }

    // Should parent close too?
    return item.parentId !== undefined;
  }

  /**
   * Close a modal by calling its onClose callback
   *
   * This is used for global keyboard shortcuts (e.g., ESC in BasePage)
   *
   * @param modalId - ID of modal to close
   * @returns true if modal was closed, false if not found or no onClose callback
   *
   * @example
   * ```tsx
   * // In BasePage keyboard handler
   * if (e.key === 'Escape') {
   *   const topmostModalId = modalStack.getTopmostModalId();
   *   if (topmostModalId) {
   *     modalStack.closeModal(topmostModalId);
   *   }
   * }
   * ```
   */
  closeModal(modalId: string): boolean {
    const item = this.stack.find((m) => m.id === modalId);

    if (!item) {
      console.log('[ModalStack] closeModal - modal not found:', modalId);
      return false;
    }

    if (!item.onClose) {
      console.log('[ModalStack] closeModal - no onClose callback:', modalId);
      return false;
    }

    console.log('[ModalStack] closeModal - calling onClose:', modalId);
    item.onClose();
    return true;
  }

  /**
   * Confirm/submit a modal by calling its onConfirm callback
   *
   * This is used for global keyboard shortcuts (e.g., Enter in BasePage)
   *
   * @param modalId - ID of modal to confirm
   * @returns true if modal was confirmed, false if not found or no onConfirm callback
   *
   * @example
   * ```tsx
   * // In BasePage keyboard handler
   * if (e.key === 'Enter') {
   *   const topmostModalId = modalStack.getTopmostModalId();
   *   if (topmostModalId) {
   *     modalStack.confirmModal(topmostModalId);
   *   }
   * }
   * ```
   */
  confirmModal(modalId: string): boolean {
    const item = this.stack.find((m) => m.id === modalId);

    if (!item) {
      console.log('[ModalStack] confirmModal - modal not found:', modalId);
      return false;
    }

    if (!item.onConfirm) {
      console.log('[ModalStack] confirmModal - no onConfirm callback:', modalId);
      return false;
    }

    console.log('[ModalStack] confirmModal - calling onConfirm:', modalId);
    item.onConfirm();
    return true;
  }

  /**
   * Get the topmost modal ID (last in stack)
   *
   * Used for keyboard event handling - only topmost modal should handle ESC/Enter
   *
   * @returns Modal ID or undefined if stack is empty
   *
   * @example
   * ```tsx
   * const handleKeyDown = (e: KeyboardEvent) => {
   *   const topmostModalId = modalStack.getTopmostModalId();
   *   if (topmostModalId !== modalName) return; // Not topmost, ignore event
   *
   *   if (e.key === 'Escape') handleClose();
   * };
   * ```
   */
  getTopmostModalId(): string | undefined {
    if (this.stack.length === 0) return undefined;
    const topmost = this.stack[this.stack.length - 1].id;
    return topmost;
  }

  /**
   * Get z-index for a specific modal
   *
   * @param modalId - Modal identifier
   * @returns Z-index or undefined if not found
   */
  getZIndex(modalId: string): number | undefined {
    const item = this.stack.find((m) => m.id === modalId);
    return item?.zIndex;
  }

  /**
   * Check if modal is in stack
   *
   * @param modalId - Modal identifier
   * @returns true if modal is registered
   */
  has(modalId: string): boolean {
    return this.stack.some((item) => item.id === modalId);
  }

  /**
   * Get stack size (for debugging)
   *
   * @returns Number of modals in stack
   */
  size(): number {
    return this.stack.length;
  }

  /**
   * Clear entire stack (close all modals)
   *
   * Used for emergency cleanup or page navigation
   */
  clear(): void {
    const all = [...this.stack];
    this.stack = [];

    // Close all modals
    all.forEach((item) => {
      if (item.onClose) item.onClose();
    });

    console.log('[ModalStack] CLEAR - all modals closed');
  }
}

// ================================================================
// SINGLETON INSTANCE
// ================================================================

/**
 * Global modal stack manager singleton
 *
 * Import this in any component that needs to register modals:
 * ```tsx
 * import { modalStack } from '@l-kern/config';
 * ```
 */
export const modalStack = new ModalStackManager();

export default modalStack;
