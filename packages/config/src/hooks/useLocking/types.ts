/*
 * ================================================================
 * FILE: types.ts
 * PATH: /packages/config/src/hooks/useLocking/types.ts
 * DESCRIPTION: Type definitions for useLocking hook
 * VERSION: v1.0.0
 * CREATED: 2025-12-09
 * UPDATED: 2025-12-09
 * ================================================================
 */

/**
 * Lock information for a record
 * Note: Name is NOT returned from backend - frontend does lookup by ID
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
   * ISO timestamp when lock was acquired
   */
  lockedAt?: string;
}

/**
 * Result of lock acquisition attempt
 */
export interface LockAcquireResult {
  /**
   * Whether lock was successfully acquired
   */
  success: boolean;

  /**
   * Lock conflict info if another user has the lock
   */
  conflictInfo?: LockInfo;

  /**
   * Error message if acquisition failed
   */
  error?: string;

  /**
   * Error code for programmatic handling
   */
  errorCode?: 'CONFLICT' | 'SERVICE_DOWN' | 'NETWORK_ERROR' | 'UNKNOWN';
}

/**
 * Result of lock release attempt
 */
export interface LockReleaseResult {
  /**
   * Whether lock was successfully released
   */
  success: boolean;

  /**
   * Error message if release failed
   */
  error?: string;
}

/**
 * Current locking state
 */
export interface LockState {
  /**
   * Whether we hold the lock
   */
  hasLock: boolean;

  /**
   * Whether lock is held by another user
   */
  isLockedByOther: boolean;

  /**
   * Lock conflict info if locked by another user
   */
  conflictInfo?: LockInfo;

  /**
   * Whether lock acquisition is in progress
   */
  isAcquiring: boolean;

  /**
   * Whether lock release is in progress
   */
  isReleasing: boolean;
}

/**
 * Callbacks for lock operations
 */
export interface LockingCallbacks {
  /**
   * Called when lock is successfully acquired
   */
  onLockAcquired?: () => void;

  /**
   * Called when lock acquisition fails due to conflict
   */
  onLockConflict?: (lockInfo: LockInfo) => void;

  /**
   * Called when lock is successfully released
   */
  onLockReleased?: () => void;

  /**
   * Called when service is checking availability
   */
  onTakingLonger?: () => void;

  /**
   * Called when service is confirmed alive
   */
  onServiceAlive?: () => void;

  /**
   * Called when service is down
   */
  onServiceDown?: () => void;

  /**
   * Called on retry attempt
   */
  onRetry?: (attempt: number, maxAttempts: number) => void;

  /**
   * Called on any error
   */
  onError?: (error: string, errorCode: string) => void;
}

/**
 * User info for lock operations
 */
export interface LockingUserInfo {
  /**
   * UUID of the current user
   */
  userId: string;

  /**
   * Display name of the current user
   */
  userName: string;

  /**
   * Permission level (0-100 scale)
   * Used for unlock permission checks
   */
  permissionLevel: number;
}

/**
 * Configuration for useLocking hook
 */
export interface UseLockingConfig {
  /**
   * Base service URL for health checks (e.g., 'http://localhost:4105')
   */
  baseUrl: string;

  /**
   * API prefix for lock endpoints (e.g., '/issues')
   * Lock endpoint will be: baseUrl + apiPrefix + /{recordId}/lock
   */
  apiPrefix: string;

  /**
   * Current user info for lock/unlock operations
   * Required for backend permission checks
   */
  userInfo: LockingUserInfo;

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;

  /**
   * Show toast notifications for lock operations
   * @default true
   */
  showToasts?: boolean;

  /**
   * Callbacks for lock events
   */
  callbacks?: LockingCallbacks;
}

/**
 * Result of useLocking hook
 */
export interface UseLockingResult {
  /**
   * Acquire lock for a record
   * Uses serviceWorkflow with retry logic and health checks
   */
  acquireLock: (recordId: string | number) => Promise<LockAcquireResult>;

  /**
   * Release lock for a record
   * Uses serviceWorkflow with retry logic
   */
  releaseLock: (recordId: string | number) => Promise<LockReleaseResult>;

  /**
   * Current lock state
   */
  lockState: LockState;

  /**
   * Reset lock state (call when modal closes)
   */
  resetState: () => void;
}
