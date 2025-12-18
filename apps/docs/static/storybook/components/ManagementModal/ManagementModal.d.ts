import { default as React } from '../../../../../node_modules/react';
import { default as styles } from './ManagementModal.module.css';
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
    renderItem: (item: any, helpers: {
        onEdit: (id: any) => void;
        onDelete: (id: any) => void;
        editHint: string;
        deleteHint: string;
        isPrimary: boolean;
        onSetPrimary?: (id: any) => void;
        primaryHint?: string;
    }) => React.ReactNode;
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
/**
 * ManagementModal Component
 *
 * Generic modal for managing lists of items (phones, emails, addresses, roles, etc.)
 * Features delete all with confirmation, empty state, and customizable content.
 */
export declare const ManagementModal: React.FC<ManagementModalProps>;
export { styles as managementModalStyles };
