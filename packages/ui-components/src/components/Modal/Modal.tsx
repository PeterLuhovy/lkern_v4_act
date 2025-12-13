/*
 * ================================================================
 * FILE: Modal.tsx
 * PATH: /packages/ui-components/src/components/Modal/Modal.tsx
 * DESCRIPTION: Production modal component with v3 enhanced features
 * VERSION: v4.1.0
 * UPDATED: 2025-12-09 12:00:00
 *
 * FEATURES (v3 enhancements):
 *   - Drag & Drop: Modal can be dragged by header
 *   - Nested Modals: Full modalStack integration with auto z-index
 *   - Enhanced Footer: Left slot (delete) + Right slot (cancel/confirm) + error message
 *   - Alignment: top/center/bottom positioning
 *   - Padding Override: Custom overlay padding for nested modals
 *
 * FEATURES (v4.0.0+ - Pessimistic Locking):
 *   - Optional locking support (disabled by default)
 *   - Automatic lock acquisition on modal open
 *   - Read-only mode when locked by another user
 *   - Lock banner showing who is editing
 *   - Automatic lock release on modal close
 *   - v4.1.0: Uses serviceWorkflow with automatic retry (3x), health checks, logging
 *
 * KEYBOARD SHORTCUTS (HYBRID APPROACH - v3.2.0+):
 *   - Modal handles ESC and Enter locally (separation of concerns)
 *   - ESC: Input focused → blur input | No input → close modal
 *   - Enter: Input focused → blur input | No input → submit (onConfirm) OR close (no onConfirm)
 *   - Uses bubble phase (false) instead of capture phase for proper event order
 *   - BasePage only handles global shortcuts (Ctrl+D, Ctrl+L)
 *
 * CHANGES:
 *   - v4.1.0: Lock/unlock now uses useLocking hook with serviceWorkflow
 *             (automatic retry 3x, health checks, comprehensive logging)
 *   - v4.0.0: Added pessimistic locking support (disabled by default)
 *   - v3.8.1: Fixed unsaved changes confirm modal using proper translations
 *   - v3.7.0: CRITICAL - Fixed 2 memory leaks (drag listeners + keyboard listener churn)
 *   - v3.6.0: Enter closes modal when no onConfirm (same as ESC)
 *   - v3.5.0: Enhanced input field handling - ESC/Enter blur input instead of modal action
 *   - v3.4.0: Fixed nested modal ESC - switched to bubble phase listeners
 *   - v3.3.0: Attempted fix with _modalHandled flag (didn't work)
 *   - v3.2.0: Hybrid keyboard handling - Modal handles ESC/Enter locally
 *   - v3.1.0: Initial version with keyboard delegation to BasePage
 *
 * MIGRATED FROM: L-KERN v3 ModalBaseTemplate.tsx (lines 1-681)
 * ================================================================
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation, useTheme, modalStack, usePageAnalytics, useConfirm, useAnalyticsContext, useLocking, useAuthContext, SUPER_ADMIN_LEVEL, serviceWorkflow } from '@l-kern/config';
import { DebugBar } from '../DebugBar';
import { ConfirmModal } from '../ConfirmModal';
import styles from './Modal.module.css';

// === TYPES ===

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

// === HELPER FUNCTIONS ===

/**
 * Check if footer is ModalFooterConfig object
 */
function isModalFooterConfig(
  footer: React.ReactNode | ModalFooterConfig | undefined
): footer is ModalFooterConfig {
  return (
    footer !== null &&
    footer !== undefined &&
    typeof footer === 'object' &&
    !React.isValidElement(footer) &&
    ('left' in footer || 'right' in footer)
  );
}

/**
 * Convert alignment prop to CSS flexbox value
 */
function getAlignmentValue(alignment?: 'top' | 'center' | 'bottom'): string {
  switch (alignment) {
    case 'top':
      return 'flex-start';
    case 'bottom':
      return 'flex-end';
    case 'center':
    default:
      return 'center';
  }
}

// === COMPONENT ===

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
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  hasUnsavedChanges = false,
  modalId,
  parentModalId,
  size = 'md',
  title,
  children,
  footer,
  closeOnBackdropClick = false,
  showCloseButton = true,
  loading = false,
  disableDrag = false,
  alignment = 'center',
  overlayPadding = '64px',
  zIndexOverride,
  className = '',
  showDebugBar = true,
  pageName,
  headerClassName,
  // Locking (disabled by default)
  locking,
  onLockStatusChange,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const unsavedConfirm = useConfirm();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const debugBarRef = useRef<HTMLDivElement>(null);

  // Drag & Drop state
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const listenersAttachedRef = useRef(false); // Track drag listener state

  // Auto z-index from modalStack
  const [calculatedZIndex, setCalculatedZIndex] = useState<number>(1000);

  // Debug bar height (dynamic, measured from actual rendered height)
  const [debugBarHeight, setDebugBarHeight] = useState<number>(0);

  // Analytics for DebugBar (modal context)
  const analytics = usePageAnalytics(pageName || modalId, 'modal');

  // Try to get settings from AnalyticsContext (sidebar toggles)
  let contextShowDebugBarModal = true;
  let contextLogIssueWorkflow = false;
  try {
    const analyticsContext = useAnalyticsContext();
    contextShowDebugBarModal = analyticsContext.settings.showDebugBarModal;
    contextLogIssueWorkflow = analyticsContext.settings.logIssueWorkflow;
  } catch {
    // AnalyticsContext not available, use default values
  }

  // Final effectiveShowDebugBar = prop AND context (both must be true)
  const effectiveShowDebugBar = showDebugBar && contextShowDebugBarModal;

  // Check if dark mode is active
  const isDarkMode = theme === 'dark';

  // DEBUG: Log when Modal component mounts/updates with hasUnsavedChanges (DISABLED - too noisy)
  // console.log('[Modal] Component render, modalId:', modalId, 'hasUnsavedChanges:', hasUnsavedChanges);

  // ================================================================
  // LOCKING STATE (using useLocking hook with serviceWorkflow)
  // ================================================================

  // Get user info from AuthContext for lock operations
  const { user, permissionLevel } = useAuthContext();

  // Check if locking is enabled
  const lockingEnabled = locking?.enabled === true;

  // Use useLocking hook for lock operations with serviceWorkflow
  // (automatic retry, health checks, comprehensive logging)
  const {
    acquireLock,
    releaseLock,
    lockState,
    resetState: resetLockState,
  } = useLocking({
    baseUrl: locking?.lockApiUrl || '',
    apiPrefix: locking?.lockApiPrefix || '',
    // User info for backend permission checks
    userInfo: {
      userId: user.id,
      userName: user.name,
      permissionLevel,
    },
    debug: contextLogIssueWorkflow, // Controlled by sidebar "Log Issue Workflow" checkbox
    showToasts: true, // Show toast notifications for lock operations
    callbacks: {
      onLockAcquired: () => {
        locking?.onLockAcquired?.();
        onLockStatusChange?.(false);
      },
      onLockConflict: (lockInfo) => {
        locking?.onLockConflict?.({
          isLocked: true,
          lockedById: lockInfo.lockedById,
          lockedAt: lockInfo.lockedAt,
        });
        onLockStatusChange?.(true);
      },
      onLockReleased: () => {
        locking?.onLockReleased?.();
      },
    },
  });

  // Derive lock state for backwards compatibility
  const isLockedByOther = lockState.isLockedByOther;
  const lockConflictInfo = lockState.conflictInfo || null;
  const hasLock = lockState.hasLock;
  const isAcquiringLock = lockState.isAcquiring;

  // Track lock acquisition failure (SERVICE_DOWN, NETWORK_ERROR, etc.)
  const [lockAcquisitionFailed, setLockAcquisitionFailed] = useState(false);

  // Track if lock acquisition is in progress to prevent duplicate calls
  const isAcquiringLockRef = useRef(false);

  // Track if we've attempted lock acquisition for this modal open (reset on close)
  const lockAcquisitionAttemptedRef = useRef(false);

  // Track current lock state with refs for cleanup without triggering re-renders
  const hasLockRef = useRef(false);
  const currentRecordIdRef = useRef<string | number | null>(null);

  // Track locking functions with refs to avoid dependencies in cleanup effect
  const resetLockStateRef = useRef(resetLockState);
  const releaseLockRef = useRef(releaseLock);

  // Format lock time for display
  const formatLockTime = useCallback((isoString?: string): string => {
    if (!isoString) return '';
    try {
      return new Date(isoString).toLocaleTimeString();
    } catch {
      return '';
    }
  }, []);

  // Check if current user is super admin (can force unlock)
  const isSuperAdmin = permissionLevel >= SUPER_ADMIN_LEVEL;

  // State for force unlock confirmation
  const [showForceUnlockConfirm, setShowForceUnlockConfirm] = useState(false);
  const [isForceUnlocking, setIsForceUnlocking] = useState(false);

  // Handle force unlock (super admin only)
  // Uses serviceWorkflow directly to bypass useLocking check (which only releases own locks)
  const handleForceUnlock = useCallback(async () => {
    if (!lockingEnabled || !locking?.recordId || !locking?.lockApiUrl || !locking?.lockApiPrefix || !isSuperAdmin) return;

    setIsForceUnlocking(true);
    try {
      // Force release lock using serviceWorkflow directly (with superadmin credentials)
      const unlockResult = await serviceWorkflow<undefined, void>({
        baseUrl: locking.lockApiUrl,
        endpoint: `${locking.lockApiPrefix}/${locking.recordId}/lock`,
        method: 'DELETE',
        headers: {
          'X-User-ID': user.id,
          'X-Permission-Level': String(permissionLevel),
        },
        debug: true,
        caller: 'Modal.forceUnlock',
        healthChecks: { ping: false, sql: true, minio: false },
        verification: { enabled: false, getEndpoint: () => '' },
      });

      if (unlockResult.success) {
        // Now acquire lock for current user
        await acquireLock(locking.recordId);
      }
    } finally {
      setIsForceUnlocking(false);
      setShowForceUnlockConfirm(false);
    }
  }, [lockingEnabled, locking?.recordId, locking?.lockApiUrl, locking?.lockApiPrefix, isSuperAdmin, user.id, permissionLevel, acquireLock]);

  // ================================================================
  // LOCK MONITORING (5s quick check, 60s full workflow)
  // ================================================================

  // Track if lock was lost mid-edit (show warning but preserve data)
  const [lockLostWarning, setLockLostWarning] = useState(false);

  // Refs for intervals and callbacks to avoid stale closures
  const lockCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fullWorkflowIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Refs for current values (to avoid stale closures in intervals)
  const lockingRef = useRef(locking);
  const hasLockRef2 = useRef(hasLock);
  const lockLostWarningRef = useRef(lockLostWarning);
  const acquireLockRef = useRef(acquireLock);
  // Note: resetLockStateRef is already defined above (line ~552)

  // Keep refs in sync
  useEffect(() => {
    lockingRef.current = locking;
    hasLockRef2.current = hasLock;
    lockLostWarningRef.current = lockLostWarning;
    acquireLockRef.current = acquireLock;
    resetLockStateRef.current = resetLockState;
  }, [locking, hasLock, lockLostWarning, acquireLock, resetLockState]);

  // Setup lock monitoring when modal is open
  // Note: Using refs for all callbacks to avoid constant re-renders
  useEffect(() => {
    // Only run for modals with locking enabled
    if (!isOpen || !lockingEnabled || !locking?.recordId || !locking?.lockApiUrl || !locking?.lockApiPrefix) {
      return;
    }

    console.log('[Modal] Setting up lock monitoring for record:', locking.recordId);

    // Quick check every 5 seconds
    lockCheckIntervalRef.current = setInterval(async () => {
      const currentLocking = lockingRef.current;
      const currentHasLock = hasLockRef2.current;
      const currentLockLostWarning = lockLostWarningRef.current;

      if (!currentLocking?.recordId || !currentLocking?.lockApiUrl || !currentLocking?.lockApiPrefix) {
        return;
      }

      try {
        const url = `${currentLocking.lockApiUrl}${currentLocking.lockApiPrefix}/${currentLocking.recordId}/lock`;
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'X-User-ID': user.id },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('[Modal] Lock status:', data, 'hasLock:', currentHasLock);

          if (data.is_locked && data.is_mine) {
            // Still have lock - all good
            if (currentLockLostWarning) setLockLostWarning(false);
          } else if (data.is_locked && !data.is_mine) {
            // Someone else took the lock!
            if (currentHasLock) {
              console.log('[Modal] Lock lost! Someone else has it now.');
              setLockLostWarning(true);
              resetLockStateRef.current();
            }
          } else if (!data.is_locked && !currentHasLock) {
            // Lock is free - try to acquire it
            console.log('[Modal] Lock is free, attempting to acquire...');
            await acquireLockRef.current(currentLocking.recordId);
          }
        }
      } catch {
        // Network error - skip this check silently
      }
    }, 5000);

    // Full workflow every 60 seconds (only when waiting for lock)
    fullWorkflowIntervalRef.current = setInterval(async () => {
      const currentLocking = lockingRef.current;
      const currentHasLock = hasLockRef2.current;

      if (!currentLocking?.recordId || currentHasLock) return;

      console.log('[Modal] 60s full workflow attempt...');
      await acquireLockRef.current(currentLocking.recordId);
    }, 60000);

    return () => {
      console.log('[Modal] Cleaning up lock monitoring intervals');
      if (lockCheckIntervalRef.current) {
        clearInterval(lockCheckIntervalRef.current);
        lockCheckIntervalRef.current = null;
      }
      if (fullWorkflowIntervalRef.current) {
        clearInterval(fullWorkflowIntervalRef.current);
        fullWorkflowIntervalRef.current = null;
      }
    };
  }, [isOpen, lockingEnabled, locking?.recordId, locking?.lockApiUrl, locking?.lockApiPrefix, user.id]);

  // Clear lock lost warning when lock is regained
  useEffect(() => {
    if (hasLock && lockLostWarning) {
      setLockLostWarning(false);
    }
  }, [hasLock, lockLostWarning]);

  // ================================================================
  // CLOSE WITH UNSAVED CHANGES CONFIRMATION
  // ================================================================

  /**
   * Handles close with optional unsaved changes confirmation
   * If hasUnsavedChanges is true, shows confirmation dialog first
   * NOTE: Cannot be async - React onClick handlers don't wait for Promises
   */
  const handleCloseWithConfirm = useCallback(() => {
    if (hasUnsavedChanges) {
      // Pass unsavedChanges translations explicitly (useConfirm doesn't provide defaults)
      unsavedConfirm.confirm({
        title: t('components.modalV3.confirmModal.unsavedChanges.title'),
        message: t('components.modalV3.confirmModal.unsavedChanges.message'),
        confirmButtonLabel: t('components.modalV3.confirmModal.unsavedChanges.confirmButton'),
      }).then((confirmed) => {
        if (confirmed) {
          onClose();
        }
      });
      // Modal stays open until user responds to confirmation
    } else {
      onClose();
    }
  }, [hasUnsavedChanges, unsavedConfirm, onClose, t]);


  // ================================================================
  // DEBUG BAR ANALYTICS SESSION
  // ================================================================

  useEffect(() => {
    if (isOpen && effectiveShowDebugBar) {
      analytics.startSession();
    }

    return () => {
      if (effectiveShowDebugBar) {
        // End session if still active
        if (analytics.isSessionActive) {
          analytics.endSession('dismissed');
        }

        // CRITICAL: ALWAYS reset session on cleanup to allow quick reopen
        // Without this, reopening modal quickly would fail (endTime check in startSession)
        analytics.resetSession();
      }
    };
    // analytics functions are stable (useCallback), safe to exclude from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, effectiveShowDebugBar, pageName, modalId]);

  // ================================================================
  // DEBUG BAR HEIGHT MEASUREMENT
  // ================================================================

  useEffect(() => {
    if (isOpen && effectiveShowDebugBar && debugBarRef.current) {
      // Measure debug bar height after render
      const measureHeight = () => {
        if (debugBarRef.current) {
          const height = debugBarRef.current.offsetHeight;
          setDebugBarHeight(height);
        }
      };

      // Initial measurement
      measureHeight();

      // Re-measure on window resize (debug bar may wrap to multiple lines)
      window.addEventListener('resize', measureHeight);

      return () => {
        window.removeEventListener('resize', measureHeight);
      };
    } else {
      setDebugBarHeight(0);
    }
  }, [isOpen, effectiveShowDebugBar]);

  // ================================================================
  // LOCKING EFFECTS (using useLocking hook with serviceWorkflow)
  // Features: automatic retry (3x), health checks, comprehensive logging
  // ================================================================

  /**
   * Handle lock acquisition when modal opens using useLocking hook
   * The hook uses serviceWorkflow internally for:
   * - Health checks before lock operations
   * - Automatic retry (3x with 5s delay)
   * - Comprehensive logging
   */
  const handleAcquireLock = useCallback(async () => {
    if (!locking?.recordId || isAcquiringLockRef.current) return;

    isAcquiringLockRef.current = true;
    setLockAcquisitionFailed(false);

    const result = await acquireLock(locking.recordId);
    isAcquiringLockRef.current = false;

    // Check if acquisition failed (not conflict - that's handled separately)
    if (!result.success && result.errorCode !== 'CONFLICT') {
      setLockAcquisitionFailed(true);
    }
  }, [acquireLock, locking?.recordId]);

  useEffect(() => {
    // Reset state when modal closes
    if (!isOpen) {
      lockAcquisitionAttemptedRef.current = false;
      setLockLostWarning(false);
      return;
    }

    // Skip if locking not enabled or missing required config
    if (!lockingEnabled || !locking?.recordId || !locking?.lockApiUrl || !locking?.lockApiPrefix) {
      return;
    }

    // Check external lock info first (from parent GET response)
    // This allows parent to pre-check lock status without making another request
    if (locking.lockInfo?.isLocked) {
      // External lock info provided - skip acquisition
      // The useLocking hook callbacks will handle the state updates
      locking.onLockConflict?.(locking.lockInfo);
      onLockStatusChange?.(true);
      return;
    }

    // Acquire lock when modal opens (only once per open)
    // Using ref prevents re-running when lock state changes during acquisition
    if (!lockAcquisitionAttemptedRef.current) {
      lockAcquisitionAttemptedRef.current = true;
      handleAcquireLock();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, lockingEnabled, locking?.recordId, locking?.lockApiUrl, locking?.lockApiPrefix, locking?.lockInfo, handleAcquireLock]);

  /**
   * Update refs when lock state or functions change (doesn't trigger re-renders)
   */
  useEffect(() => {
    hasLockRef.current = hasLock;
    currentRecordIdRef.current = locking?.recordId || null;
    resetLockStateRef.current = resetLockState;
    releaseLockRef.current = releaseLock;
  }, [hasLock, locking?.recordId, resetLockState, releaseLock]);

  /**
   * Reset locking state and release lock when modal closes
   * Uses refs for functions to avoid infinite loop from changing dependencies
   */
  useEffect(() => {
    if (!isOpen) {
      // Release lock using ref values (avoids infinite loop)
      if (hasLockRef.current && currentRecordIdRef.current) {
        releaseLockRef.current(currentRecordIdRef.current);
      }

      // Reset all locking state using ref (avoids infinite loop)
      resetLockStateRef.current();
      setLockAcquisitionFailed(false);
      isAcquiringLockRef.current = false;
      lockAcquisitionAttemptedRef.current = false;
      hasLockRef.current = false;
      currentRecordIdRef.current = null;
    }
  }, [isOpen]);

  // ================================================================
  // MODAL STACK REGISTRATION
  // ================================================================

  useEffect(() => {
    if (isOpen) {
      // Register in modalStack and get z-index
      const zIndex = modalStack.push(modalId, parentModalId, handleCloseWithConfirm, onConfirm);
      setCalculatedZIndex(zIndex);
    }

    return () => {
      if (isOpen) {
        // Unregister from modalStack
        modalStack.pop(modalId);
      }
    };
    // CRITICAL: onClose and onConfirm are intentionally excluded from dependencies
    // to prevent unmount/remount cycles when parent component re-renders with new function references.
    // modalStack stores these functions internally and uses the latest version when called.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, modalId, parentModalId]);

  // ================================================================
  // KEYBOARD SHORTCUTS (HYBRID APPROACH)
  // ================================================================
  // Modal handles ESC and Enter locally (not delegated to BasePage)
  // This gives modal full control over its keyboard behavior

  // Stabilize keyboard handler with useRef to prevent listener churn
  const handleModalKeyEventRef = useRef<((e: KeyboardEvent) => void) | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleModalKeyEvent = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      // Check if user is typing in input field
      const isInputField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      // CRITICAL: Check if this modal is topmost SYNCHRONOUSLY
      // This must happen BEFORE any setState/onClose calls
      const topmostModalId = modalStack.getTopmostModalId();

      // Only topmost modal handles keyboard events
      if (topmostModalId !== modalId) {
        return;
      }

      // Track keyboard event in analytics (BOTH keydown and keyup for topmost modal)
      if (effectiveShowDebugBar) {
        analytics.trackKeyboard(e);
      }

      // Only process shortcuts on keydown (not keyup)
      if (e.type !== 'keydown') {
        return;
      }

      // ESC key handling
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();

        if (isInputField) {
          // Input field is focused → blur it (remove focus)
          target.blur();
        } else {
          // No input focused → close modal (with unsaved changes check)
          handleCloseWithConfirm();
        }
        return;
      }

      // ENTER key handling
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();

        if (isInputField) {
          // Input field is focused → blur it (remove focus)
          target.blur();
        } else {
          // No input focused → submit OR close modal
          if (onConfirm) {
            // Modal has onConfirm → submit
            onConfirm();
          } else {
            // Modal has NO onConfirm → close (same as ESC, with unsaved changes check)
            handleCloseWithConfirm();
          }
        }
        return;
      }
    };

    // Update ref with current handler
    handleModalKeyEventRef.current = handleModalKeyEvent;

    // FIXED: Stable event handler to prevent listener churn
    const stableHandler = (e: KeyboardEvent) => {
      handleModalKeyEventRef.current?.(e);
    };

    // IMPORTANT: Use BUBBLE phase (false), NOT capture phase
    // Bubble phase ensures child modal listener runs BEFORE parent
    // (Child is deeper in DOM, so it bubbles up from child to parent)
    // Register BOTH keydown and keyup listeners
    document.addEventListener('keydown', stableHandler, false);
    document.addEventListener('keyup', stableHandler, false);

    return () => {
      document.removeEventListener('keydown', stableHandler, false);
      document.removeEventListener('keyup', stableHandler, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, modalId, onClose, onConfirm]);

  // ================================================================
  // DRAG AND DROP HANDLERS
  // ================================================================

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (disableDrag) return;

    // Only allow dragging from header (not close button)
    if ((e.target as HTMLElement).closest('button')) return;

    // Blur any focused input before dragging
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    e.preventDefault(); // Prevent text selection while dragging
    e.stopPropagation(); // Prevent event bubbling

    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();

      // If this is the first drag (position is null), initialize to current centered position
      if (position === null) {
        setPosition({
          x: rect.left,
          y: rect.top,
        });
      }

      // Calculate offset from mouse to modal top-left corner
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });

      setIsDragging(true);
    }
  }, [disableDrag, position]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      setPosition({ x: newX, y: newY });
    },
    [isDragging, dragOffset]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    // Note: dragStartPosRef is NOT cleared here - we need it for click detection in handleBackdropClick
  }, []);

  // ================================================================
  // LIFECYCLE EFFECTS
  // ================================================================

  // Reset position when modal opens
  useEffect(() => {
    if (isOpen) {
      setPosition(null); // null = centered, non-null = absolute position
      setIsDragging(false);
    }
  }, [isOpen]);

  // Drag event listeners - FIXED: Memory leak prevention
  useEffect(() => {
    if (isDragging && !listenersAttachedRef.current) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      listenersAttachedRef.current = true;
    }

    if (!isDragging && listenersAttachedRef.current) {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      listenersAttachedRef.current = false;
    }

    // CRITICAL: Cleanup on unmount
    return () => {
      if (listenersAttachedRef.current) {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        listenersAttachedRef.current = false;
      }
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // === FOCUS TRAP ===

  useEffect(() => {
    if (!isOpen) return;

    // Store previous focus
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus modal on open
    if (modalRef.current) {
      modalRef.current.focus();
    }

    // Restore focus on close
    return () => {
      previousFocusRef.current?.focus();
    };
  }, [isOpen]);

  // === BODY SCROLL LOCK ===

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // === HANDLERS ===

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking directly on backdrop (not on modal content)
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      handleCloseWithConfirm();
    }
  };

  // === RENDER ===

  if (!isOpen) return null;

  // Determine final z-index
  const finalZIndex = zIndexOverride || calculatedZIndex;

  // Separate footer into config or ReactNode
  const footerConfig = isModalFooterConfig(footer) ? footer : null;
  const footerNode = !footerConfig ? (footer as React.ReactNode) : null;

  // Calculate modal position styles
  // If position is set (after drag), use absolute positioning
  // Otherwise, let flexbox overlay handle alignment (top/center/bottom)
  const modalPositionStyle: React.CSSProperties = position
    ? {
        // Absolute positioning after drag started
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'none',
      }
    : {
        // Flexbox positioning - let overlay alignment control vertical position
        // No fixed position needed - flexbox does the work
      };

  const modalContent = (
    <div
      className={styles.modalOverlay}
      onClick={(e) => {
        // Stop event propagation to prevent BasePage analytics from tracking modal clicks
        e.stopPropagation();
        handleBackdropClick(e);
      }}
      style={{
        zIndex: finalZIndex,
        alignItems: getAlignmentValue(alignment),
        padding: overlayPadding,
      }}
      data-modal-overlay="true"
      data-modal-id={modalId}
    >
      <div
        ref={modalRef}
        className={`${styles.modalContainer} ${position === null ? styles['modal--centered'] : ''} ${styles[`modal--${size}`]} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
        data-modal-container-id={modalId}
        style={{
          ...modalPositionStyle,
          userSelect: isDragging ? 'none' : 'auto',
          zIndex: finalZIndex + 1,
        }}
        onMouseDown={(e) => {
          // CRITICAL: Stop propagation to prevent BasePage from tracking modal clicks
          e.stopPropagation();

          // Track mousedown inside modal
          if (effectiveShowDebugBar) {
            const target = e.target as HTMLElement;
            const elementType = target.tagName.toLowerCase();

            // Get meaningful element identifier (priority order)
            const elementId =
              target.id ||
              target.getAttribute('data-testid') ||
              target.getAttribute('aria-label') ||
              target.getAttribute('name') ||
              (target.textContent?.trim().substring(0, 20) || elementType);

            analytics.trackClick(elementId, elementType, e);
          }
        }}
        onMouseUp={(e) => {
          // CRITICAL: Check if event came from THIS modal or a CHILD modal
          // If event came from child modal (e.g., child modal header drag),
          // we must NOT stopPropagation, otherwise child's document mouseup listener won't fire
          const target = e.target as HTMLElement;
          const closestModalContainer = target.closest('[data-modal-container-id]') as HTMLElement;
          const eventFromChildModal = closestModalContainer?.getAttribute('data-modal-container-id') !== modalId;

          // Check if event came from header (to avoid duplicate tracking)
          const isFromHeader = target.closest(`.${styles.modalHeader}`) !== null;

          // Track mouseup inside modal (but NOT if from header - header already tracked it)
          if (effectiveShowDebugBar && !eventFromChildModal && !isFromHeader) {
            const elementType = target.tagName.toLowerCase();

            // Get meaningful element identifier (priority order)
            const elementId =
              target.id ||
              target.getAttribute('data-testid') ||
              target.getAttribute('aria-label') ||
              target.getAttribute('name') ||
              (target.textContent?.trim().substring(0, 20) || elementType);

            analytics.trackClick(elementId, elementType, e);
          }

          // CRITICAL: Only stopPropagation if event is from THIS modal AND not dragging
          // If event from child modal OR if dragging, allow propagation to document
          if (!eventFromChildModal && !isDragging) {
            e.stopPropagation(); // Prevent BasePage from tracking modal clicks
          }
        }}
      >
        {/* Debug Bar - Top of modal */}
        {effectiveShowDebugBar && (
          <DebugBar
            ref={debugBarRef}
            modalName={pageName || modalId}
            isDarkMode={isDarkMode}
            analytics={analytics}
            show={effectiveShowDebugBar}
            contextType="modal"
          />
        )}

        {/* Header */}
        {(title || showCloseButton) && (
          <div
            className={`${styles.modalHeader} ${headerClassName || ''}`}
            onMouseDown={(e) => {
              // Track mousedown on header (for drag analytics)
              if (effectiveShowDebugBar) {
                const target = e.target as HTMLElement;
                const elementType = target.tagName.toLowerCase();
                const elementId =
                  target.id ||
                  target.getAttribute('data-testid') ||
                  target.getAttribute('aria-label') ||
                  target.getAttribute('name') ||
                  (target.textContent?.trim().substring(0, 20) || elementType);

                analytics.trackClick(elementId, elementType, e);
              }

              // Then handle drag logic
              handleMouseDown(e);
            }}
            onMouseUp={(e) => {
              // Track mouseup on header (for drag analytics)
              if (effectiveShowDebugBar) {
                const target = e.target as HTMLElement;
                const elementType = target.tagName.toLowerCase();
                const elementId =
                  target.id ||
                  target.getAttribute('data-testid') ||
                  target.getAttribute('aria-label') ||
                  target.getAttribute('name') ||
                  (target.textContent?.trim().substring(0, 20) || elementType);

                analytics.trackClick(elementId, elementType, e);
              }
            }}
            style={{
              cursor: disableDrag ? 'default' : isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              paddingTop: effectiveShowDebugBar && debugBarHeight > 0 ? `${debugBarHeight + 4}px` : undefined,
            }}
          >
            {title && (
              <h2 id="modal-title" className={styles.modalTitle}>
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                className={styles.modalCloseButton}
                onClick={() => {
                  handleCloseWithConfirm();
                }}
                aria-label={t('common.close')}
                title={`${t('common.close')} (ESC)`}
                type="button"
              >
                ×
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className={styles.modalBody}>
          {loading ? (
            <div className={styles.modalLoading}>
              <div className={styles.spinner} />
              <p>{t('common.loading') || 'Loading...'}</p>
            </div>
          ) : (
            <>
              {/* Lock Lost Warning - shown when lock was lost mid-edit */}
              {lockingEnabled && lockLostWarning && (
                <div className={styles.lockLostBanner} data-testid="modal-lock-lost-banner">
                  <span className={styles.lockIcon} role="img" aria-hidden="true">⚠️</span>
                  <span>{t('common.locking.lockLost')}</span>
                  <span className={styles.lockLostHint}>{t('common.locking.lockLostHint')}</span>
                </div>
              )}

              {/* Lock Banner - shown when record is locked by another user */}
              {lockingEnabled && isLockedByOther && lockConflictInfo && !lockLostWarning && (
                <div className={styles.lockBanner} data-testid="modal-lock-banner">
                  <span className={styles.lockIcon} role="img" aria-hidden="true">🔒</span>
                  <span>
                    {t('common.locking.editedBy', {
                      name: lockConflictInfo.lockedById || t('common.unknown'),
                      time: formatLockTime(lockConflictInfo.lockedAt) || t('common.unknown'),
                    })}
                  </span>
                  {/* Force Unlock button - only for super admins */}
                  {isSuperAdmin && (
                    <button
                      type="button"
                      className={styles.forceUnlockButton}
                      onClick={() => setShowForceUnlockConfirm(true)}
                      disabled={isForceUnlocking}
                      title={t('common.locking.forceUnlock')}
                    >
                      <span role="img" aria-hidden="true">🔓</span>
                    </button>
                  )}
                </div>
              )}

              {/* Lock acquisition states - acquiring, failed, or success */}
              {lockingEnabled && isAcquiringLock && !hasLock ? (
                // State 1: Acquiring lock - show spinner
                <div className={styles.lockLoading} data-testid="modal-lock-loading">
                  <div className={styles.spinner} />
                  <p>{t('common.locking.acquiring')}</p>
                </div>
              ) : lockingEnabled && lockAcquisitionFailed ? (
                // State 2: Lock acquisition failed - show error with retry/close buttons
                <div className={styles.lockError} data-testid="modal-lock-error">
                  <div className={styles.lockErrorIcon} role="img" aria-hidden="true">⚠️</div>
                  <h3 className={styles.lockErrorTitle}>
                    {t('common.locking.serviceUnavailableTitle')}
                  </h3>
                  <p className={styles.lockErrorMessage}>
                    {t('common.locking.serviceUnavailableMessage')}
                  </p>
                  <div className={styles.lockErrorButtons}>
                    <button
                      type="button"
                      className={styles.lockErrorButtonSecondary}
                      onClick={onClose}
                    >
                      {t('common.locking.closeModal')}
                    </button>
                    <button
                      type="button"
                      className={styles.lockErrorButtonPrimary}
                      onClick={handleAcquireLock}
                    >
                      {t('common.locking.retryLock')}
                    </button>
                  </div>
                </div>
              ) : (
                // State 3: Lock acquired or not locking - show children
                <div className={lockingEnabled && (isLockedByOther || lockLostWarning) ? styles.readOnly : undefined}>
                  {children}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer - Enhanced or Simple */}
        {footer && (
          <div className={styles.modalFooter}>
            {footerConfig ? (
              // Enhanced footer with left/right slots
              <div className={styles.modalFooterEnhanced}>
                {/* Left side: Delete button */}
                <div className={styles.modalFooterLeft}>
                  {footerConfig.left}
                </div>

                {/* Right side: Cancel + Confirm */}
                <div className={styles.modalFooterRight}>{footerConfig.right}</div>
              </div>
            ) : (
              // Simple footer (ReactNode)
              footerNode
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Portal render - wrap in fragment to satisfy React.FC return type
  return (
    <>
      {createPortal(modalContent, document.body)}

      {/* Unsaved Changes Confirmation Modal */}
      <ConfirmModal
        isOpen={unsavedConfirm.state.isOpen}
        onClose={unsavedConfirm.handleCancel}
        onConfirm={unsavedConfirm.handleConfirm}
        title={unsavedConfirm.state.title}
        message={unsavedConfirm.state.message}
        parentModalId={modalId}
      />

      {/* Force Unlock Confirmation Modal (Super Admin only) */}
      <ConfirmModal
        isOpen={showForceUnlockConfirm}
        onClose={() => setShowForceUnlockConfirm(false)}
        onConfirm={handleForceUnlock}
        title={t('common.locking.forceUnlock')}
        message={t('common.locking.forceUnlockConfirm', {
          name: lockConflictInfo?.lockedById || t('common.unknown'),
        })}
        confirmButtonLabel={t('common.locking.forceUnlock')}
        parentModalId={modalId}
      />
    </>
  );
};

export default Modal;
