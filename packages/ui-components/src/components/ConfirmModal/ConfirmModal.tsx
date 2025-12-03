/*
 * ================================================================
 * FILE: ConfirmModal.tsx
 * PATH: /packages/ui-components/src/components/ConfirmModal/ConfirmModal.tsx
 * DESCRIPTION: Universal confirmation modal component (simple + danger modes)
 * VERSION: v1.0.0
 * UPDATED: 2025-10-30 10:45:00
 * ================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { Input } from '../Input';
import { FormField } from '../FormField';
import { useTranslation } from '@l-kern/config';
import styles from './ConfirmModal.module.css';

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
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmKeyword,
  isDanger = false,
  confirmButtonLabel,
  cancelButtonLabel,
  secondaryButtonLabel,
  onSecondary,
  isLoading = false,
  isSecondaryLoading = false,
  parentModalId,
}) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [showError, setShowError] = useState(false);

  const isSimpleMode = !isDanger;  // Simple mode = NOT danger mode
  const modalId = `confirm-modal-${parentModalId || 'root'}`;

  // Get the actual keyword to validate against (supports localization)
  // If confirmKeyword prop is provided, use it; otherwise use default from translations
  const actualKeyword = confirmKeyword || (isDanger ? t('components.modalV3.confirmModal.danger.confirmKeyword') : '');

  // Reset state only when modal opens (not on every re-render)
  const prevIsOpenRef = useRef(isOpen);
  useEffect(() => {
    // Only reset when transitioning from closed → open
    if (isOpen && !prevIsOpenRef.current) {
      setInputValue('');
      setShowError(false);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen]);

  const handleConfirm = () => {
    // Simple mode - confirm immediately
    if (isSimpleMode) {
      onConfirm();  // Call the prop callback
      return;
    }

    // Danger mode - check keyword
    const normalizedInput = inputValue.trim().toLowerCase();
    const normalizedKeyword = actualKeyword.toLowerCase();

    if (normalizedInput === normalizedKeyword) {
      onConfirm();  // Call the prop callback after validation passes
    } else {
      setShowError(true);  // Show error, do NOT call onConfirm
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default form submission
      e.stopPropagation(); // Prevent parent Modal from receiving this event
      handleConfirm();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      modalId={modalId}
      parentModalId={parentModalId}
      title={title || (isDanger ? t('components.modalV3.confirmModal.danger.defaultTitle') : t('components.modalV3.confirmModal.simple.defaultTitle'))}
      size="sm"
      footer={{
        right: (
          <>
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isLoading || isSecondaryLoading}
              data-testid="confirm-modal-cancel"
            >
              {cancelButtonLabel || t('components.modalV3.confirmModal.simple.defaultCancel')}
            </Button>
            {secondaryButtonLabel && onSecondary && (
              <Button
                variant="secondary"
                onClick={onSecondary}
                loading={isSecondaryLoading}
                disabled={isLoading}
                data-testid="confirm-modal-secondary"
              >
                {secondaryButtonLabel}
              </Button>
            )}
            <Button
              variant={isDanger ? 'danger' : 'primary'}
              onClick={handleConfirm}
              loading={isLoading}
              disabled={isSecondaryLoading}
              data-testid="confirm-modal-confirm"
            >
              {confirmButtonLabel || (isDanger ? t('components.modalV3.confirmModal.danger.defaultConfirm') : t('components.modalV3.confirmModal.simple.defaultConfirm'))}
            </Button>
          </>
        ),
      }}
    >
      <div className={styles.content}>
        {/* Message */}
        <div className={styles.message}>
          {message || (isDanger && actualKeyword ? t('components.modalV3.confirmModal.danger.defaultMessage', { keyword: actualKeyword }) : t('components.modalV3.confirmModal.simple.defaultMessage'))}
        </div>

        {/* Danger mode - keyword input */}
        {!isSimpleMode && !!actualKeyword && (
          <FormField
            label={t('components.modalV3.confirmModal.danger.keywordLabel', { keyword: actualKeyword })}
            error={showError ? t('components.modalV3.confirmModal.danger.keywordError', { keyword: actualKeyword }) : undefined}
            reserveMessageSpace
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowError(false);
            }}
          >
            <Input
              type="text"
              placeholder={t('components.modalV3.confirmModal.danger.keywordPlaceholder', { keyword: actualKeyword })}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </FormField>
        )}
      </div>
    </Modal>
  );
};

export default ConfirmModal;