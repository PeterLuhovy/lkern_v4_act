/*
 * ================================================================
 * FILE: ManagementModal.tsx
 * PATH: /packages/ui-components/src/components/ManagementModal/ManagementModal.tsx
 * DESCRIPTION: Generic list management modal with advanced features
 * VERSION: v2.0.0
 * UPDATED: 2025-10-31 14:00:00
 *
 * FEATURES v2.0:
 *   - Always-visible footer buttons (Add, Delete All, Cancel)
 *   - Primary item support (optional)
 *   - Bulk delete with checkbox selection
 *   - Custom item rendering with render prop
 *   - Empty state support
 *   - Full translation support (SK/EN)
 *
 * BREAKING CHANGES from v1.0:
 *   - Children prop replaced with renderItem prop
 *   - Footer buttons always visible (not just in empty state)
 *   - onAdd is now required (not optional)
 *
 * USAGE:
 *   <ManagementModal
 *     isOpen={isOpen}
 *     onClose={handleClose}
 *     title="Správa telefónov"
 *     modalId="manage-phones"
 *     items={phones}
 *     onAdd={handleAdd}
 *     onEdit={handleEdit}
 *     onDelete={handleDelete}
 *     onDeleteAll={handleDeleteAll}
 *     onSetPrimary={handleSetPrimary}
 *     getPrimaryId={(item) => item.isPrimary ? item.id : null}
 *     renderItem={(phone) => (
 *       <div>
 *         <div>{phone.number}</div>
 *         <div>{t(`phoneTypes.${phone.type}`)}</div>
 *       </div>
 *     )}
 *   />
 * ================================================================
 */

import React, { useState, useMemo } from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { ConfirmModal } from '../ConfirmModal';
import { EmptyState } from '../EmptyState';
import { useTranslation } from '@l-kern/config';
import styles from './ManagementModal.module.css';

// ================================================================
// TYPES
// ================================================================

export interface ManagementModalProps<T = any> {
  // Modal control
  isOpen: boolean;
  onClose: () => void;
  title: string;
  modalId: string;
  parentModalId?: string;

  // Data
  items: T[];
  getItemId: (item: T) => string | number;

  // Actions
  onAdd: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onDeleteAll: () => void;
  onDeleteSelected?: (items: T[]) => void;

  // Primary item support (optional)
  supportsPrimary?: boolean;
  onSetPrimary?: (item: T) => void;
  getPrimaryId?: (items: T[]) => string | number | null;

  // Rendering
  renderItem: (item: T, options: {
    isPrimary: boolean;
    isSelected: boolean;
    onToggleSelect: () => void;
  }) => React.ReactNode;

  // Empty state
  emptyStateMessage?: string;
  emptyStateIcon?: string;

  // Customization
  maxWidth?: string;
  maxHeight?: string;
  deleteAllTitle?: string;
  deleteAllMessage?: string;
}

// ================================================================
// COMPONENT
// ================================================================

export function ManagementModal<T = any>({
  isOpen,
  onClose,
  title,
  modalId,
  parentModalId,
  items,
  getItemId,
  onAdd,
  onEdit,
  onDelete,
  onDeleteAll,
  onDeleteSelected,
  supportsPrimary = false,
  onSetPrimary,
  getPrimaryId,
  renderItem,
  emptyStateMessage,
  emptyStateIcon = '📭',
  maxWidth = '700px',
  maxHeight = '80vh',
  deleteAllTitle,
  deleteAllMessage,
}: ManagementModalProps<T>) {
  const { t } = useTranslation();

  // Selection state for bulk delete
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [showDeleteSelectedConfirm, setShowDeleteSelectedConfirm] = useState(false);

  // Calculate primary item
  const primaryId = useMemo(() => {
    if (!supportsPrimary || !getPrimaryId) return null;
    return getPrimaryId(items);
  }, [supportsPrimary, getPrimaryId, items]);

  // Sort items: primary first, then others
  const sortedItems = useMemo(() => {
    if (!supportsPrimary || !primaryId) return items;

    const primaryItem = items.find(item => getItemId(item) === primaryId);
    const otherItems = items.filter(item => getItemId(item) !== primaryId);

    return primaryItem ? [primaryItem, ...otherItems] : items;
  }, [items, supportsPrimary, primaryId, getItemId]);

  // ================================================================
  // SELECTION HANDLERS
  // ================================================================

  const handleToggleSelect = (itemId: string | number) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(items.map(getItemId)));
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  // ================================================================
  // DELETE HANDLERS
  // ================================================================

  const handleDeleteAllClick = () => {
    if (items.length > 0) {
      setShowDeleteAllConfirm(true);
    }
  };

  const handleDeleteAllConfirm = () => {
    onDeleteAll();
    setShowDeleteAllConfirm(false);
    setSelectedIds(new Set());
  };

  const handleDeleteSelectedClick = () => {
    if (selectedIds.size > 0 && onDeleteSelected) {
      setShowDeleteSelectedConfirm(true);
    }
  };

  const handleDeleteSelectedConfirm = () => {
    if (onDeleteSelected) {
      const selectedItems = items.filter(item => selectedIds.has(getItemId(item)));
      onDeleteSelected(selectedItems);
      setShowDeleteSelectedConfirm(false);
      setSelectedIds(new Set());
    }
  };

  // ================================================================
  // PRIMARY HANDLERS
  // ================================================================

  const handleSetPrimary = (item: T) => {
    if (supportsPrimary && onSetPrimary) {
      onSetPrimary(item);
    }
  };

  // ================================================================
  // RENDER
  // ================================================================

  const isEmpty = items.length === 0;
  const hasSelection = selectedIds.size > 0;
  const allSelected = items.length > 0 && selectedIds.size === items.length;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        modalId={modalId}
        parentModalId={parentModalId}
        title={title}
        maxWidth={maxWidth}
        maxHeight={maxHeight}
        footerConfig={{
          left: (
            <>
              {!isEmpty && onDeleteSelected && (
                <Button
                  variant="danger"
                  onClick={handleDeleteSelectedClick}
                  disabled={!hasSelection}
                >
                  {t('managementModal.deleteSelected')} ({selectedIds.size})
                </Button>
              )}
              <Button
                variant="danger-subtle"
                onClick={handleDeleteAllClick}
                disabled={isEmpty}
              >
                {t('managementModal.deleteAllButton')}
              </Button>
            </>
          ),
          right: (
            <>
              <Button variant="secondary" onClick={onAdd}>
                ➕ {t('managementModal.addButton')}
              </Button>
              <Button variant="primary" onClick={onClose}>
                {t('managementModal.cancelButton')}
              </Button>
            </>
          ),
        }}
      >
        <div className={styles.content}>
          {isEmpty ? (
            <EmptyState
              message={emptyStateMessage || t('managementModal.emptyState.message')}
              icon={emptyStateIcon}
              actionText={t('managementModal.addButton')}
              onAction={onAdd}
            />
          ) : (
            <div className={styles.listContainer}>
              {/* Bulk selection toolbar */}
              {onDeleteSelected && items.length > 1 && (
                <div className={styles.selectionToolbar}>
                  {allSelected ? (
                    <Button variant="secondary" size="sm" onClick={handleDeselectAll}>
                      {t('managementModal.deselectAll')}
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm" onClick={handleSelectAll}>
                      {t('managementModal.selectAll')}
                    </Button>
                  )}
                  <span className={styles.selectionCount}>
                    {selectedIds.size} / {items.length} {t('managementModal.selected')}
                  </span>
                </div>
              )}

              {/* Item list */}
              <div className={styles.itemList}>
                {sortedItems.map((item) => {
                  const itemId = getItemId(item);
                  const isPrimary = supportsPrimary && itemId === primaryId;
                  const isSelected = selectedIds.has(itemId);

                  return (
                    <div
                      key={itemId}
                      className={`${styles.itemWrapper} ${isPrimary ? styles.primaryItem : ''}`}
                    >
                      {renderItem(item, {
                        isPrimary,
                        isSelected,
                        onToggleSelect: () => handleToggleSelect(itemId),
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Delete All Confirmation */}
      <ConfirmModal
        isOpen={showDeleteAllConfirm}
        onClose={() => setShowDeleteAllConfirm(false)}
        onConfirm={handleDeleteAllConfirm}
        title={deleteAllTitle || t('managementModal.deleteAll.title')}
        message={deleteAllMessage || t('managementModal.deleteAll.message')}
        confirmKeyword="ano"
        isDanger
        parentModalId={modalId}
      />

      {/* Delete Selected Confirmation */}
      <ConfirmModal
        isOpen={showDeleteSelectedConfirm}
        onClose={() => setShowDeleteSelectedConfirm(false)}
        onConfirm={handleDeleteSelectedConfirm}
        title={t('managementModal.deleteSelected.title')}
        message={t('managementModal.deleteSelected.message', { count: selectedIds.size })}
        confirmKeyword="ano"
        isDanger
        parentModalId={modalId}
      />
    </>
  );
}
