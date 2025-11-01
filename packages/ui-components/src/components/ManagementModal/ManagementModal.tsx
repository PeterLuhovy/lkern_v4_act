/*
 * ================================================================
 * FILE: ManagementModal.tsx
 * PATH: /packages/ui-components/src/components/ManagementModal/ManagementModal.tsx
 * DESCRIPTION: Generic list management modal with add/edit/delete all functionality
 * VERSION: v1.0.0
 * UPDATED: 2025-10-31 12:00:00
 *
 * FEATURES:
 *   - Generic list management wrapper
 *   - Delete all with confirmation (danger mode)
 *   - Empty state support
 *   - Customizable item rendering
 *   - Full translation support (SK/EN)
 *   - Integration with EditItemModal (nested modals)
 *
 * USAGE:
 *   <ManagementModal
 *     isOpen={isOpen}
 *     onClose={handleClose}
 *     title="Správa telefónov"
 *     modalId="manage-phones"
 *     items={contact.phones}
 *     onDeleteAll={handleDeleteAll}
 *     emptyStateMessage="Žiadne telefónne čísla"
 *     emptyStateIcon="📱"
 *   >
 *     <PhoneListEditor ... />
 *   </ManagementModal>
 *
 * MIGRATED FROM: L-KERN v3 ManagementModal.tsx (refactored for v4)
 * ================================================================
 */

import React, { useState, useCallback } from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { ConfirmModal } from '../ConfirmModal';
import { EmptyState } from '../EmptyState';
import { useTranslation, useConfirm } from '@l-kern/config';
import styles from './ManagementModal.module.css';

// ================================================================
// TYPES
// ================================================================

/**
 * ManagementModal Props Interface
 */
export interface ManagementModalProps {
  /**
   * Controls modal visibility
   */
  isOpen: boolean;

  /**
   * Called when modal is closed (Cancel button)
   */
  onClose: () => void;

  /**
   * Called when user clicks Save button
   * Should persist changes to parent state
   */
  onSave: () => void;

  /**
   * Indicates if there are unsaved changes
   * Enables unsaved changes warning on close
   */
  hasUnsavedChanges?: boolean;

  /**
   * Modal title (e.g., "Správa telefónov", "Správa emailov")
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
   * Array of items (for delete all validation and empty state)
   */
  items: any[];

  /**
   * Render function for each item
   * Receives item and helpers for Edit/Delete/Primary buttons
   * @example
   * renderItem={(item, { onEdit, onDelete, isPrimary, onSetPrimary, editHint, deleteHint, primaryHint }) => (
   *   <div>
   *     <span>{item.number}</span>
   *     {onSetPrimary && (
   *       <Button onClick={() => onSetPrimary(item.id)} title={primaryHint}>
   *         {isPrimary ? '⭐' : '☆'}
   *       </Button>
   *     )}
   *     <Button onClick={() => onEdit(item.id)} title={editHint}>✏️</Button>
   *     <Button onClick={() => onDelete(item.id)} title={deleteHint}>🗑️</Button>
   *   </div>
   * )}
   */
  renderItem: (
    item: any,
    helpers: {
      onEdit: (id: any) => void;
      onDelete: (id: any) => void;
      editHint: string;
      deleteHint: string;
      isPrimary: boolean;
      onSetPrimary?: (id: any) => void;
      primaryHint?: string;
    }
  ) => React.ReactNode;

  /**
   * Called when user clicks edit button on an item
   */
  onEdit?: (id: any) => void;

  /**
   * Called when user clicks delete button on an item (with confirmation)
   */
  onDelete?: (id: any) => void;

  /**
   * Edit button hover hint text
   * @default "Edit"
   */
  editHint?: string;

  /**
   * Delete button hover hint text
   * @default "Delete"
   */
  deleteHint?: string;

  /**
   * Enable primary item support (star marking and sorting)
   * @default false
   */
  enablePrimary?: boolean;

  /**
   * ID of the current primary item
   */
  primaryItemId?: any;

  /**
   * Called when user sets a new primary item
   */
  onSetPrimary?: (id: any) => void;

  /**
   * Primary button hover hint text
   * @default "Set as primary"
   */
  primaryHint?: string;

  /**
   * Function to extract ID from item (required if enablePrimary is true)
   * @default (item) => item.id
   */
  getItemId?: (item: any) => any;

  /**
   * Called when user confirms "Delete All" action
   * Should clear all items from parent state
   */
  onDeleteAll: () => void;

  /**
   * Custom delete all confirmation title
   * @default t('components.modalV3.managementModal.deleteAll.title')
   */
  deleteAllTitle?: string;

  /**
   * Custom delete all confirmation message
   * @default t('components.modalV3.managementModal.deleteAll.message')
   */
  deleteAllMessage?: string;

  /**
   * Empty state message when no items
   * @default t('components.modalV3.managementModal.emptyState.message')
   */
  emptyStateMessage?: string;

  /**
   * Empty state icon (emoji)
   * @default "📭"
   */
  emptyStateIcon?: string;

  /**
   * Add button text
   * @default t('components.modalV3.managementModal.addButton')
   */
  addButtonText?: string;

  /**
   * Called when user clicks add button (REQUIRED - always visible in footer)
   */
  onAdd: () => void;

  /**
   * Modal max width
   * @default "700px"
   */
  maxWidth?: string;

  /**
   * Modal max height
   * @default "80vh"
   */
  maxHeight?: string;

  /**
   * List editor component (children)
   */
  children: React.ReactNode;

  /**
   * Content to display below Add button (e.g., instructions, help text)
   */
  bottomContent?: React.ReactNode;
}

// ================================================================
// COMPONENT
// ================================================================

/**
 * ManagementModal Component
 *
 * Generic modal for managing lists of items (phones, emails, addresses, roles, etc.)
 * Features delete all with confirmation, empty state, and customizable content.
 */
export const ManagementModal: React.FC<ManagementModalProps> = ({
  isOpen,
  onClose,
  onSave,
  hasUnsavedChanges = false,
  title,
  modalId,
  parentModalId,
  items,
  renderItem,
  onEdit,
  onDelete,
  editHint,
  deleteHint,
  enablePrimary = false,
  primaryItemId,
  onSetPrimary,
  primaryHint,
  getItemId = (item) => item.id,
  onDeleteAll,
  deleteAllTitle,
  deleteAllMessage,
  emptyStateMessage,
  emptyStateIcon = '📭',
  addButtonText,
  onAdd,
  maxWidth = '700px',
  maxHeight = '80vh',
  children,
  bottomContent,
}) => {
  const { t } = useTranslation();
  const unsavedConfirm = useConfirm();
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [showDeleteItemConfirm, setShowDeleteItemConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  // ================================================================
  // COMPUTED
  // ================================================================

  const isEmpty = !items || items.length === 0;

  /**
   * Sorted items - primary item first if enablePrimary is true
   */
  const sortedItems = React.useMemo(() => {
    if (!enablePrimary || !primaryItemId || isEmpty) {
      return items;
    }

    // Sort: primary item first, then rest
    const primary = items.find(item => getItemId(item) === primaryItemId);
    const rest = items.filter(item => getItemId(item) !== primaryItemId);

    return primary ? [primary, ...rest] : items;
  }, [items, enablePrimary, primaryItemId, getItemId, isEmpty]);

  // ================================================================
  // HANDLERS
  // ================================================================

  /**
   * Handle close with dirty tracking
   * If hasUnsavedChanges, shows confirmation before closing
   */
  const handleCloseWithConfirm = useCallback(() => {
    console.log('[ManagementModal v2.0] handleCloseWithConfirm called, hasUnsavedChanges:', hasUnsavedChanges);
    if (hasUnsavedChanges) {
      console.log('[ManagementModal v2.0] Showing unsaved changes confirmation...');
      unsavedConfirm.confirm({}).then((confirmed) => {
        console.log('[ManagementModal v2.0] Confirmation result:', confirmed);
        if (confirmed) {
          console.log('[ManagementModal v2.0] User confirmed - closing modal');
          onClose();
        } else {
          console.log('[ManagementModal v2.0] User cancelled - staying in modal');
        }
      });
    } else {
      console.log('[ManagementModal v2.0] No unsaved changes - closing directly');
      onClose();
    }
  }, [hasUnsavedChanges, unsavedConfirm, onClose]);

  /**
   * Handle delete all button click
   * Opens confirmation modal (only if items exist)
   */
  const handleDeleteAllClick = () => {
    if (items && items.length > 0) {
      setShowDeleteAllConfirm(true);
    }
  };

  /**
   * Handle delete all confirmation
   * Calls parent's onDeleteAll handler and closes confirmation
   */
  const handleDeleteAllConfirm = () => {
    onDeleteAll();
    setShowDeleteAllConfirm(false);
    // Keep management modal open - user can add new items or close manually
  };

  /**
   * Handle edit item click
   * Calls parent's onEdit handler if provided
   */
  const handleEditClick = (id: any) => {
    if (onEdit) {
      onEdit(id);
    }
  };

  /**
   * Handle delete item click
   * Opens confirmation modal
   */
  const handleDeleteClick = (id: any) => {
    setItemToDelete(id);
    setShowDeleteItemConfirm(true);
  };

  /**
   * Handle delete item confirmation
   * Calls parent's onDelete handler and closes confirmation
   */
  const handleDeleteItemConfirm = () => {
    if (onDelete && itemToDelete !== null) {
      onDelete(itemToDelete);
    }
    setItemToDelete(null);
    setShowDeleteItemConfirm(false);
  };

  /**
   * Handle set primary click
   * Calls parent's onSetPrimary handler if provided
   */
  const handleSetPrimaryClick = (id: any) => {
    if (onSetPrimary) {
      onSetPrimary(id);
    }
  };

  // ================================================================
  // RENDER
  // ================================================================

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onSave}
        hasUnsavedChanges={hasUnsavedChanges}
        modalId={modalId}
        parentModalId={parentModalId}
        title={title}
        maxWidth={maxWidth}
        maxHeight={maxHeight}
        footer={{
          left: (
            <Button
              variant="danger-subtle"
              onClick={handleDeleteAllClick}
              disabled={isEmpty}
            >
              {t('components.modalV3.managementModal.deleteAllButton')}
            </Button>
          ),
          right: (
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  console.log('[ManagementModal v2.0] Cancel button clicked - calling handleCloseWithConfirm');
                  console.log('[ManagementModal v2.0] hasUnsavedChanges:', hasUnsavedChanges);
                  handleCloseWithConfirm();
                }}
              >
                {t('common.cancel')} {/* v2.0 */}
              </Button>
              <Button variant="primary" onClick={onSave}>
                {t('common.save')}
              </Button>
            </>
          ),
        }}
      >
        <div className={styles.content}>
          {isEmpty && (
            <EmptyState
              message={emptyStateMessage || t('components.modalV3.managementModal.emptyState.message')}
              icon={emptyStateIcon}
            />
          )}
          {!isEmpty && (
            <div className={styles.itemsList}>
              {sortedItems.map((item, index) => {
                const itemId = getItemId(item);
                const isPrimary = enablePrimary && itemId === primaryItemId;

                return renderItem(item, {
                  onEdit: handleEditClick,
                  onDelete: handleDeleteClick,
                  editHint: editHint || t('components.modalV3.managementModal.editHint'),
                  deleteHint: deleteHint || t('components.modalV3.managementModal.deleteHint'),
                  isPrimary,
                  onSetPrimary: enablePrimary ? handleSetPrimaryClick : undefined,
                  primaryHint: primaryHint || t('components.modalV3.managementModal.primaryHint'),
                });
              })}
            </div>
          )}
          <Button
            variant="secondary"
            onClick={onAdd}
            fullWidth
            className={styles.addButton}
          >
            ➕ {addButtonText || t('components.modalV3.managementModal.addButton')}
          </Button>
          {bottomContent}
        </div>
      </Modal>

      {/* Delete All Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteAllConfirm}
        onClose={() => setShowDeleteAllConfirm(false)}
        onConfirm={handleDeleteAllConfirm}
        title={deleteAllTitle || t('components.modalV3.managementModal.deleteAll.title')}
        message={deleteAllMessage || t('components.modalV3.managementModal.deleteAll.message')}
        parentModalId={modalId}
      />

      {/* Delete Item Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteItemConfirm}
        onClose={() => setShowDeleteItemConfirm(false)}
        onConfirm={handleDeleteItemConfirm}
        title={t('components.modalV3.managementModal.deleteItem.title')}
        message={t('components.modalV3.managementModal.deleteItem.message')}
        parentModalId={modalId}
      />

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

// Export styles for external use (e.g., test pages)
export { styles as managementModalStyles };
