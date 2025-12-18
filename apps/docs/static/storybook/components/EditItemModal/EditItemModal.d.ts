import { default as React } from '../../../../../node_modules/react';
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
     * Delegated to base Modal component
     * @default false
     */
    hasUnsavedChanges?: boolean;
    /**
     * Modal size
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg';
}
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
export declare const EditItemModal: React.FC<EditItemModalProps>;
export default EditItemModal;
