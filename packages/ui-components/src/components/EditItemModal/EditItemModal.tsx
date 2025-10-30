/*
 * ================================================================
 * FILE: EditItemModal.tsx
 * PATH: /packages/ui-components/src/components/EditItemModal/EditItemModal.tsx
 * DESCRIPTION: Generic add/edit modal wrapper with unsaved changes detection
 * VERSION: v1.0.0
 * UPDATED: 2025-10-30 12:00:00
 *
 * FEATURES:
 *   - Generic add/edit wrapper (configurable via props)
 *   - Unsaved changes detection + confirmation modal
 *   - Optional clear button (with confirmation)
 *   - Customizable footer buttons
 *   - Integration with useFormDirty hook
 *   - Full translation support (SK/EN)
 *
 * USAGE:
 *   <EditItemModal
 *     isOpen={isOpen}
 *     onClose={handleClose}
 *     onSave={handleSave}
 *     title="Pridať email"
 *     modalId="edit-email"
 *     parentModalId="management-emails"
 *     saveDisabled={!validation.isValid}
 *     hasUnsavedChanges={isDirty}
 *     showClearButton
 *     onClear={handleClear}
 *   >
 *     <Input ... />
 *     <Select ... />
 *   </EditItemModal>
 *
 * MIGRATED FROM: L-KERN v3 EditItemModal.tsx (simplified for v4)
 * ================================================================
 */

import React, { useState } from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { ConfirmModal } from '../ConfirmModal';
import { useTranslation } from '@l-kern/config';

// ================================================================
// TYPES
// ================================================================

/**
 * EditItemModal Props Interface
 */
export interface EditItemModalProps {
  /**
   * Controls modal visibility
   */
  isOpen: boolean;

  /**
   * Called when modal is closed (cancel/ESC)
   */
  onClose: () => void;

  /**
   * Called when user saves the form
   */
  onSave: () => void;

  /**
   * Modal title (e.g., "Pridať email", "Upraviť telefón")
   */
  title: string;

  /**
   * Unique modal identifier
   */
  modalId: string;

  /**
   * Parent modal ID (for nested modals)
   */
  parentModalId?: string;

  /**
   * Form fields content
   */
  children: React.ReactNode;

  /**
   * Whether save button should be disabled
   * @default false
   */
  saveDisabled?: boolean;

  /**
   * Custom save button text
   * @default "Uložiť" (from translations)
   */
  saveText?: string;

  /**
   * Custom cancel button text
   * @default "Zrušiť" (from translations)
   */
  cancelText?: string;

  /**
   * Show clear button in footer left slot
   * @default false
   */
  showClearButton?: boolean;

  /**
   * Custom clear button text
   * @default "Vyčistiť formulár" (from translations)
   */
  clearButtonText?: string;

  /**
   * Called when user confirms form clear
   */
  onClear?: () => void;

  /**
   * Whether form has unsaved changes (triggers confirmation on close)
   * @default false
   */
  hasUnsavedChanges?: boolean;

  /**
   * Custom unsaved changes confirmation title
   * @default "Neuložené zmeny" (from translations)
   */
  unsavedChangesTitle?: string;

  /**
   * Custom unsaved changes confirmation message
   * @default "Máte neuložené zmeny..." (from translations)
   */
  unsavedChangesMessage?: string;

  /**
   * Modal size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
}

// ================================================================
// COMPONENT
// ================================================================

/**
 * EditItemModal Component
 *
 * Generic wrapper for add/edit modals with:
 * - Unsaved changes protection (confirmation before close)
 * - Optional clear button (with confirmation)
 * - Customizable footer buttons
 * - Full translation support
 *
 * @example Simple Edit Modal
 * ```tsx
 * <EditItemModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onSave={handleSave}
 *   title="Upraviť email"
 *   modalId="edit-email"
 *   saveDisabled={!isValid}
 * >
 *   <Input label="Email" value={email} onChange={setEmail} />
 * </EditItemModal>
 * ```
 *
 * @example With Unsaved Changes Detection
 * ```tsx
 * const { isDirty } = useFormDirty(initialData, formData);
 *
 * <EditItemModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onSave={handleSave}
 *   title="Upraviť kontakt"
 *   modalId="edit-contact"
 *   hasUnsavedChanges={isDirty}
 * >
 *   <Input ... />
 * </EditItemModal>
 * ```
 *
 * @example With Clear Button
 * ```tsx
 * <EditItemModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onSave={handleSave}
 *   title="Pridať email"
 *   modalId="add-email"
 *   showClearButton
 *   onClear={handleClearForm}
 * >
 *   <Input ... />
 * </EditItemModal>
 * ```
 */
export const EditItemModal: React.FC<EditItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  modalId,
  parentModalId,
  children,
  saveDisabled = false,
  saveText,
  cancelText,
  showClearButton = false,
  clearButtonText,
  onClear,
  hasUnsavedChanges = false,
  unsavedChangesTitle,
  unsavedChangesMessage,
  size = 'md',
}) => {
  const { t } = useTranslation();

  // State for confirmation modals
  const [showUnsavedConfirm, setShowUnsavedConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // ================================================================
  // HANDLERS
  // ================================================================

  /**
   * Handle modal close request
   * Shows unsaved changes confirmation if needed
   */
  const handleClose = () => {
    console.log('[EditItemModal] handleClose called');
    console.log('[EditItemModal] hasUnsavedChanges:', hasUnsavedChanges);
    if (hasUnsavedChanges) {
      console.log('[EditItemModal] Showing unsaved changes confirmation');
      setShowUnsavedConfirm(true);
      return;
    }
    console.log('[EditItemModal] No unsaved changes, calling onClose');
    onClose();
  };

  /**
   * Handle unsaved changes confirmation
   * User confirmed - close without saving
   */
  const handleUnsavedConfirm = () => {
    console.log('[EditItemModal] User confirmed unsaved changes - closing');
    setShowUnsavedConfirm(false);
    onClose();
  };

  /**
   * Handle unsaved changes cancellation
   * User cancelled - stay in modal
   */
  const handleUnsavedCancel = () => {
    console.log('[EditItemModal] User cancelled unsaved changes - staying in modal');
    setShowUnsavedConfirm(false);
  };

  /**
   * Handle clear button click
   * Shows confirmation before clearing
   */
  const handleClearClick = () => {
    console.log('[EditItemModal] Clear button clicked - showing confirmation');
    setShowClearConfirm(true);
  };

  /**
   * Handle clear confirmation
   * User confirmed - clear form
   */
  const handleClearConfirm = () => {
    console.log('[EditItemModal] ========================================');
    console.log('[EditItemModal] handleClearConfirm START');
    console.log('[EditItemModal] User confirmed clear');
    console.log('[EditItemModal] Closing clear confirmation modal');
    setShowClearConfirm(false);

    if (onClear) {
      console.log('[EditItemModal] onClear callback exists, calling it NOW');
      onClear();
      console.log('[EditItemModal] onClear callback finished');
    } else {
      console.log('[EditItemModal] WARNING: onClear callback not provided!');
    }

    console.log('[EditItemModal] handleClearConfirm END');
    console.log('[EditItemModal] ========================================');
  };

  /**
   * Handle clear cancellation
   * User cancelled - do nothing
   */
  const handleClearCancel = () => {
    console.log('[EditItemModal] User cancelled clear - staying in modal');
    setShowClearConfirm(false);
  };

  // ================================================================
  // FOOTER CONFIGURATION
  // ================================================================

  const footer = {
    // Left slot: Clear button (if enabled)
    left: showClearButton ? (
      <Button
        variant="danger-subtle"
        onClick={handleClearClick}
        data-testid="edit-item-modal-clear"
      >
        {clearButtonText || t('components.modalV3.editItemModal.defaultClear')}
      </Button>
    ) : undefined,

    // Right slot: Cancel + Save buttons
    right: (
      <>
        <Button
          variant="ghost"
          onClick={handleClose}
          data-testid="edit-item-modal-cancel"
        >
          {cancelText || t('components.modalV3.editItemModal.defaultCancel')}
        </Button>
        <Button
          variant="primary"
          onClick={onSave}
          disabled={saveDisabled}
          data-testid="edit-item-modal-save"
        >
          {saveText || t('components.modalV3.editItemModal.defaultSave')}
        </Button>
      </>
    ),
  };

  // ================================================================
  // RENDER
  // ================================================================

  return (
    <>
      {/* Main Edit Modal */}
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={onSave}
        modalId={modalId}
        parentModalId={parentModalId}
        title={title}
        size={size}
        footer={footer}
      >
        {children}
      </Modal>

      {/* Unsaved Changes Confirmation Modal */}
      <ConfirmModal
        isOpen={showUnsavedConfirm}
        onClose={handleUnsavedCancel}
        onConfirm={handleUnsavedConfirm}
        title={unsavedChangesTitle || t('components.modalV3.confirmModal.unsavedChanges.title')}
        message={unsavedChangesMessage || t('components.modalV3.confirmModal.unsavedChanges.message')}
        confirmButtonLabel={t('common.close')}
        cancelButtonLabel={t('common.cancel')}
        parentModalId={modalId}
      />

      {/* Clear Form Confirmation Modal */}
      {showClearButton && (
        <ConfirmModal
          isOpen={showClearConfirm}
          onClose={handleClearCancel}
          onConfirm={handleClearConfirm}
          title={t('components.modalV3.editItemModal.clearConfirmTitle')}
          message={t('components.modalV3.editItemModal.clearConfirmMessage')}
          confirmButtonLabel={t('components.modalV3.editItemModal.clearConfirmButton')}
          cancelButtonLabel={t('common.cancel')}
          parentModalId={modalId}
        />
      )}
    </>
  );
};

export default EditItemModal;