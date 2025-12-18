import { default as React } from '../../../../../node_modules/react';
import { ModalLockingConfig } from '../Modal';
/**
 * Field validation result
 */
export interface ValidationResult {
    isValid: boolean;
    error?: string;
}
/**
 * Field definition for dynamic form rendering
 */
export interface FieldDefinition {
    /**
     * Field identifier (used as form data key)
     */
    name: string;
    /**
     * Display label (translated)
     */
    label: string;
    /**
     * Field type
     */
    type: 'text' | 'email' | 'number' | 'date' | 'select' | 'textarea';
    /**
     * Is field required?
     * @default false
     */
    required?: boolean;
    /**
     * Placeholder text (translated)
     */
    placeholder?: string;
    /**
     * Options for select fields
     */
    options?: Array<{
        value: string;
        label: string;
    }>;
    /**
     * HTML5 validation pattern (regex string)
     */
    pattern?: string;
    /**
     * Minimum value (number) or length (text)
     */
    min?: number | string;
    /**
     * Maximum value (number) or length (text)
     */
    max?: number | string;
    /**
     * Custom validation function (synchronous)
     * Receives current value and entire form data
     * Returns validation result with error message if invalid
     */
    validate?: (value: any, formData: Record<string, any>) => ValidationResult;
}
/**
 * SectionEditModal Props Interface
 */
export interface SectionEditModalProps {
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
     * Receives entire form data object
     *
     * Can be sync or async:
     * - Sync: `onSave={(data) => console.log(data)}`
     * - Async: `onSave={async (data) => { await api.save(data); }}`
     *
     * If async and throws error with `status: 409`, modal switches to read-only mode.
     * This handles the case when someone else took the lock while user was editing.
     */
    onSave: (data: Record<string, any>) => void | Promise<void>;
    /**
     * Modal title (e.g., "Upraviť: Základné údaje")
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
     * Field definitions for form rendering
     */
    fields: FieldDefinition[];
    /**
     * Initial form data
     * @default {}
     */
    initialData?: Record<string, any>;
    /**
     * Modal size
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg';
    /**
     * Show clear form button
     * @default true
     */
    showClearButton?: boolean;
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
     * Pessimistic locking configuration (passed to base Modal)
     * @example
     * ```tsx
     * <SectionEditModal
     *   locking={{
     *     enabled: true,
     *     recordId: contactId,
     *     lockApiUrl: '/api/contacts',
     *   }}
     * />
     * ```
     */
    locking?: ModalLockingConfig;
    /**
     * Force read-only mode (ignores locking)
     * @default false
     */
    readOnly?: boolean;
    /**
     * Callback when save fails with 409 conflict (lock was taken)
     * Called with lock info about who now has the lock.
     * Modal automatically switches to read-only mode.
     *
     * @example
     * ```tsx
     * <SectionEditModal
     *   onSaveConflict={(lockInfo) => {
     *     toast.error(`${lockInfo.lockedByName} prevzal editáciu`);
     *   }}
     * />
     * ```
     */
    onSaveConflict?: (lockInfo: LockInfo) => void;
}
/**
 * Error type for 409 Conflict responses
 * Used to detect lock conflicts when saving
 */
export interface SaveConflictError extends Error {
    status: 409;
    lockedById?: string;
    lockedByName?: string;
    lockedAt?: string;
}
/**
 * SectionEditModal Component
 *
 * Generic form builder for dynamic forms using FieldDefinition system.
 * Supports 6 field types: text, email, number, date, select, textarea.
 * Includes HTML5 validation, custom validation, clear form, and unsaved changes detection.
 *
 * @example Basic Usage
 * ```tsx
 * const fields: FieldDefinition[] = [
 *   { name: 'firstName', label: 'Meno', type: 'text', required: true },
 *   { name: 'email', label: 'Email', type: 'email', required: true },
 *   { name: 'age', label: 'Vek', type: 'number', min: 0, max: 120 },
 * ];
 *
 * <SectionEditModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onSave={(data) => console.log(data)}
 *   title="Upraviť: Osobné údaje"
 *   modalId="edit-personal"
 *   fields={fields}
 *   initialData={{ firstName: 'Ján', email: 'jan@example.com', age: 30 }}
 * />
 * ```
 *
 * @example With Custom Validation
 * ```tsx
 * const fields: FieldDefinition[] = [
 *   {
 *     name: 'password',
 *     label: 'Heslo',
 *     type: 'text',
 *     validate: (value) => {
 *       if (value.length < 8) {
 *         return { isValid: false, error: 'Heslo musí mať aspoň 8 znakov' };
 *       }
 *       return { isValid: true };
 *     },
 *   },
 * ];
 * ```
 */
export declare const SectionEditModal: React.FC<SectionEditModalProps>;
export default SectionEditModal;
