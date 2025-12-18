import { default as React } from '../../../../../node_modules/react';
/**
 * ConfirmModal Props Interface
 */
export interface ConfirmModalProps {
    /**
     * Controls modal visibility
     */
    isOpen: boolean;
    /**
     * Called when modal is closed (cancel/ESC)
     */
    onClose: () => void;
    /**
     * Called when user confirms the action
     */
    onConfirm: () => void;
    /**
     * Modal title (optional - uses default from translations)
     */
    title?: string;
    /**
     * Confirmation message (optional - uses default from translations)
     */
    message?: string;
    /**
     * Keyword required for danger confirmation
     * - If empty/undefined → Simple mode (Yes/No)
     * - If provided (e.g., "ano", "delete") → Danger mode (must type keyword)
     */
    confirmKeyword?: string;
    /**
     * Whether this is a dangerous action (affects styling)
     * @default false
     */
    isDanger?: boolean;
    /**
     * Custom label for confirm button (optional)
     */
    confirmButtonLabel?: string;
    /**
     * Custom label for cancel button (optional)
     */
    cancelButtonLabel?: string;
    /**
     * Optional secondary action button (appears between cancel and confirm)
     * Useful for modals that need 3 options (e.g., Cancel / Retry / Proceed)
     */
    secondaryButtonLabel?: string;
    /**
     * Called when user clicks the secondary action button
     */
    onSecondary?: () => void;
    /**
     * Show loading spinner on confirm button
     */
    isLoading?: boolean;
    /**
     * Show loading spinner on secondary button
     */
    isSecondaryLoading?: boolean;
    /**
     * Parent modal ID (for nested modals)
     */
    parentModalId?: string;
}
/**
 * ConfirmModal Component
 *
 * Universal confirmation dialog with two modes:
 *
 * **Simple Mode** (confirmKeyword not provided):
 * - Shows message with Yes/Cancel buttons
 * - User clicks Yes to confirm
 * - Good for: non-destructive confirmations
 *
 * **Danger Mode** (confirmKeyword provided):
 * - Shows message + text input
 * - User must type exact keyword (case-insensitive)
 * - Confirm button disabled until keyword matches
 * - Shows error if keyword is wrong
 * - Good for: destructive actions (delete, clear all, etc.)
 *
 * @example Simple Mode
 * ```tsx
 * <ConfirmModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onConfirm={handleConfirm}
 *   message="Naozaj chcete pokračovať?"
 * />
 * ```
 *
 * @example Danger Mode
 * ```tsx
 * <ConfirmModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onConfirm={handleDelete}
 *   title="Vymazať kontakt"
 *   message="Táto akcia je nevratná. Zadajte 'ano' pre potvrdenie."
 *   confirmKeyword="ano"
 *   isDanger
 * />
 * ```
 */
export declare const ConfirmModal: React.FC<ConfirmModalProps>;
export default ConfirmModal;
