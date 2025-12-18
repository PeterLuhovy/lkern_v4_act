import { default as React } from '../../../../../node_modules/react';
/**
 * Enhanced footer configuration
 * Allows separate left (delete) and right (cancel/confirm) action slots
 */
export interface ModalFooterConfig {
    /**
     * Left side content (typically delete button)
     */
    left?: React.ReactNode;
    /**
     * Right side content (typically cancel + confirm buttons)
     */
    right?: React.ReactNode;
}
/**
 * Lock information for pessimistic locking
 */
export interface LockInfo {
    /**
     * Whether the record is locked by another user
     */
    isLocked: boolean;
    /**
     * User ID of the lock holder
     */
    lockedById?: string;
    /**
     * Display name of the lock holder
     */
    lockedByName?: string;
    /**
     * ISO timestamp when lock was acquired
     */
    lockedAt?: string;
}
/**
 * Locking configuration for Modal
 * All locking is DISABLED by default - must explicitly enable
 */
export interface ModalLockingConfig {
    /**
     * Enable pessimistic locking for this modal
     * @default false
     */
    enabled: boolean;
    /**
     * Record ID to lock (required when enabled)
     */
    recordId?: string | number;
    /**
     * API base URL for health checks (e.g., 'http://localhost:4105')
     */
    lockApiUrl?: string;
    /**
     * API prefix for lock endpoints (e.g., '/issues')
     * Endpoints used:
     * - POST {lockApiUrl}{lockApiPrefix}/{recordId}/lock - acquire lock
     * - DELETE {lockApiUrl}{lockApiPrefix}/{recordId}/lock - release lock
     */
    lockApiPrefix?: string;
    /**
     * Pre-populated lock info (from parent component GET response)
     * If provided with isLocked=true, modal skips lock acquisition
     */
    lockInfo?: LockInfo;
    /**
     * Callback when lock is successfully acquired
     */
    onLockAcquired?: () => void;
    /**
     * Callback when lock acquisition fails (conflict - someone else is editing)
     */
    onLockConflict?: (lockInfo: LockInfo) => void;
    /**
     * Callback when lock is released
     */
    onLockReleased?: () => void;
}
export interface ModalProps {
    /**
     * Whether modal is open
     */
    isOpen: boolean;
    /**
     * Callback when modal should close
     */
    onClose: () => void;
    /**
     * Callback when modal should confirm/submit (triggered by Enter key in BasePage)
     * @optional If provided, pressing Enter will call this function
     * @example () => handleSaveContact()
     */
    onConfirm?: () => void;
    /**
     * Indicates if there are unsaved changes (opt-in dirty tracking)
     * When true, closing modal will show unsaved changes confirmation
     * @default false
     * @example hasUnsavedChanges={isDirty}
     */
    hasUnsavedChanges?: boolean;
    /**
     * Unique modal identifier (required for nested modals and keyboard handling)
     * @example 'edit-contact', 'add-company'
     */
    modalId: string;
    /**
     * Parent modal ID (for nested modals)
     * @example When opening edit modal from list modal, pass list modal's ID
     */
    parentModalId?: string;
    /**
     * Modal size
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg';
    /**
     * Modal title
     */
    title?: string;
    /**
     * Modal content
     */
    children: React.ReactNode;
    /**
     * Footer content
     * Can be:
     * - React.ReactNode (simple footer)
     * - ModalFooterConfig (enhanced footer with left/right slots)
     */
    footer?: React.ReactNode | ModalFooterConfig;
    /**
     * Close on backdrop click
     * @default false
     */
    closeOnBackdropClick?: boolean;
    /**
     * Show close button (X)
     * @default true
     */
    showCloseButton?: boolean;
    /**
     * Loading state
     */
    loading?: boolean;
    /**
     * Disable dragging
     * @default false
     */
    disableDrag?: boolean;
    /**
     * Vertical alignment
     * @default 'center'
     */
    alignment?: 'top' | 'center' | 'bottom';
    /**
     * Overlay padding override (for nested modals)
     * @default '64px'
     */
    overlayPadding?: string;
    /**
     * Z-index override (auto-calculated from modalStack if not provided)
     */
    zIndexOverride?: number;
    /**
     * Custom className for modal content
     */
    className?: string;
    /**
     * Show debug bar with analytics
     * @default true
     */
    showDebugBar?: boolean;
    /**
     * Modal name for analytics (English name)
     * @default Uses modalId if not provided
     * @example 'contactEdit', 'companyAdd'
     */
    pageName?: string;
    /**
     * Form validation state
     * When false, submit/confirm button will be disabled
     * @default true
     */
    isFormValid?: boolean;
    /**
     * Maximum width for modal content
     * @example '600px', '80vw', '50rem'
     */
    maxWidth?: string;
    /**
     * Custom className for modal header (for colored headers)
     * @example 'headerBug', 'headerFeature'
     */
    headerClassName?: string;
    /**
     * Pessimistic locking configuration
     * DISABLED by default - must set locking.enabled = true to use
     *
     * @example Basic locking
     * ```tsx
     * <Modal
     *   locking={{
     *     enabled: true,
     *     recordId: contact.id,
     *     lockApiUrl: '/api/contacts',
     *   }}
     * />
     * ```
     *
     * @example With callbacks
     * ```tsx
     * <Modal
     *   locking={{
     *     enabled: true,
     *     recordId: contact.id,
     *     lockApiUrl: '/api/contacts',
     *     onLockAcquired: () => console.log('Lock acquired'),
     *     onLockConflict: (info) => toast.error(`Locked by ${info.lockedByName}`),
     *   }}
     * />
     * ```
     */
    locking?: ModalLockingConfig;
    /**
     * Callback when lock status changes (locked by other user)
     * Modal children can use this to disable editing
     */
    onLockStatusChange?: (isLockedByOther: boolean) => void;
}
/**
 * Production Modal component with v3 enhanced features
 *
 * **Features:**
 * - Portal rendering (outside DOM hierarchy)
 * - Focus trap (keyboard navigation locked)
 * - Nested modals support (auto z-index via modalStack)
 * - Drag & Drop (draggable by header)
 * - Enhanced footer (left/right slots + error message)
 * - Alignment options (top/center/bottom)
 * - Backdrop overlay with click-to-close
 * - 3 sizes (sm=400px, md=600px, lg=800px)
 * - Keyboard shortcuts handled globally by BasePage wrapper
 *
 * @example Basic usage
 * ```tsx
 * <Modal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   onConfirm={handleSave}  // Enter key will trigger this
 *   modalId="add-contact"
 *   title="Add Contact"
 *   size="md"
 * >
 *   <ContactForm />
 * </Modal>
 * ```
 *
 * @example Enhanced footer
 * ```tsx
 * <Modal
 *   footer={{
 *     left: <Button variant="danger">Delete</Button>,
 *     right: (
 *       <>
 *         <Button variant="secondary" onClick={onClose}>Cancel</Button>
 *         <Button variant="primary" onClick={onSave}>Save</Button>
 *       </>
 *     ),
 *     errorMessage: error ? 'Please fix validation errors' : undefined
 *   }}
 * />
 * ```
 *
 * @example Nested modal
 * ```tsx
 * <Modal modalId="list" title="Contacts">
 *   <ContactList />
 *   <Modal
 *     modalId="edit"
 *     parentModalId="list"
 *     title="Edit Contact"
 *   >
 *     <EditForm />
 *   </Modal>
 * </Modal>
 * ```
 */
export declare const Modal: React.FC<ModalProps>;
export default Modal;
