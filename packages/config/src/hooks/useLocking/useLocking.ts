/*
 * ================================================================
 * FILE: useLocking.ts
 * PATH: /packages/config/src/hooks/useLocking/useLocking.ts
 * DESCRIPTION: React hook for pessimistic locking with serviceWorkflow
 *              Provides lock acquisition and release with:
 *              - Automatic retry (3x)
 *              - Health checks
 *              - Comprehensive logging
 *              - Toast notifications
 * VERSION: v1.0.0
 * CREATED: 2025-12-09
 * UPDATED: 2025-12-09
 * ================================================================
 */

import { useState, useCallback, useRef } from 'react';
import { serviceWorkflow } from '../../utils/serviceWorkflow/serviceWorkflow';
import type {
  UseLockingConfig,
  UseLockingResult,
  LockState,
  LockAcquireResult,
  LockReleaseResult,
  LockInfo,
} from './types';

/**
 * Hook for pessimistic locking using serviceWorkflow.
 *
 * Features:
 * - Uses serviceWorkflow for all lock operations
 * - Automatic retry (3x) with 5s delay
 * - Health checks before lock operations
 * - Comprehensive logging (when debug=true)
 * - Toast notifications (when showToasts=true)
 *
 * @example Basic usage
 * ```tsx
 * const { acquireLock, releaseLock, lockState } = useLocking({
 *   baseUrl: 'http://localhost:8101/api/v1/issues',
 *   debug: true,
 * });
 *
 * // Acquire lock when modal opens
 * useEffect(() => {
 *   if (isOpen && recordId) {
 *     acquireLock(recordId);
 *   }
 *   return () => {
 *     if (recordId) releaseLock(recordId);
 *   };
 * }, [isOpen, recordId]);
 * ```
 *
 * @example With callbacks
 * ```tsx
 * const { acquireLock, releaseLock, lockState } = useLocking({
 *   baseUrl: API_BASE_URL,
 *   callbacks: {
 *     onLockAcquired: () => console.log('Lock acquired!'),
 *     onLockConflict: (info) => console.log(`Locked by ${info.lockedByName}`),
 *   },
 * });
 * ```
 */
export function useLocking(config: UseLockingConfig): UseLockingResult {
  const { baseUrl, apiPrefix, userInfo, debug = false, showToasts = true, callbacks } = config;

  // Lock state
  const [lockState, setLockState] = useState<LockState>({
    hasLock: false,
    isLockedByOther: false,
    conflictInfo: undefined,
    isAcquiring: false,
    isReleasing: false,
  });

  // Track current lock for cleanup
  const currentLockIdRef = useRef<string | number | null>(null);

  /**
   * Acquire lock for a record using serviceWorkflow
   */
  const acquireLock = useCallback(
    async (recordId: string | number): Promise<LockAcquireResult> => {
      if (debug) {
        console.log(`[useLocking] Acquiring lock for record: ${recordId}`);
      }

      setLockState((prev) => ({
        ...prev,
        isAcquiring: true,
        hasLock: false,
        isLockedByOther: false,
        conflictInfo: undefined,
      }));

      try {
        // Lock request body - only user_id needed (name lookup done by frontend)
        const lockRequestData = {
          user_id: userInfo.userId,
        };

        const result = await serviceWorkflow<typeof lockRequestData, { success: boolean; locked_by?: LockInfo }>({
          baseUrl,
          endpoint: `${apiPrefix}/${recordId}/lock`,
          method: 'POST',
          data: lockRequestData,
          debug,
          caller: 'useLocking.acquireLock',
          showToasts, // Use built-in serviceWorkflow toast support
          // Health checks - ping + SQL (locking writes to database)
          healthChecks: {
            ping: true,
            sql: true,
            minio: false,
          },
          // No verification needed for lock
          verification: {
            enabled: false,
            getEndpoint: () => '',
          },
          callbacks: {
            onError: (error, errorCode) => {
              if (debug) {
                console.error(`[useLocking] Error: ${error} (${errorCode})`);
              }
              callbacks?.onError?.(error, errorCode);
            },
          },
        });

        // Handle result
        if (result.success) {
          // Lock acquired successfully
          currentLockIdRef.current = recordId;
          setLockState({
            hasLock: true,
            isLockedByOther: false,
            conflictInfo: undefined,
            isAcquiring: false,
            isReleasing: false,
          });

          if (debug) {
            console.log(`[useLocking] Lock acquired for record: ${recordId}`);
          }

          callbacks?.onLockAcquired?.();

          return { success: true };
        }

        // Check for lock conflict (HTTP 409)
        if (result.statusCode === 409) {
          // Debug: log what data we received
          if (debug) {
            console.log(`[useLocking] 409 Conflict - result.data:`, result.data);
            console.log(`[useLocking] 409 Conflict - result.rawResponse:`, result.rawResponse);
          }

          const conflictInfo: LockInfo = {
            isLocked: true,
            lockedById: (result.data as { locked_by?: { id?: string } })?.locked_by?.id,
            lockedAt: (result.data as { locked_by?: { locked_at?: string } })?.locked_by?.locked_at,
          };

          setLockState({
            hasLock: false,
            isLockedByOther: true,
            conflictInfo,
            isAcquiring: false,
            isReleasing: false,
          });

          if (debug) {
            console.log(`[useLocking] Lock conflict - locked by user ${conflictInfo.lockedById}`);
          }

          callbacks?.onLockConflict?.(conflictInfo);

          return {
            success: false,
            conflictInfo,
            errorCode: 'CONFLICT',
          };
        }

        // Other error
        setLockState((prev) => ({
          ...prev,
          isAcquiring: false,
        }));

        const errorCode =
          result.errorCode === 'SERVICE_DOWN'
            ? 'SERVICE_DOWN'
            : result.errorCode === 'NETWORK_ERROR'
              ? 'NETWORK_ERROR'
              : 'UNKNOWN';

        return {
          success: false,
          error: result.error,
          errorCode,
        };
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        if (debug) {
          console.error(`[useLocking] Exception during lock acquisition:`, error);
        }

        setLockState((prev) => ({
          ...prev,
          isAcquiring: false,
        }));

        return {
          success: false,
          error: errorMsg,
          errorCode: 'UNKNOWN',
        };
      }
    },
    [baseUrl, apiPrefix, userInfo, debug, showToasts, callbacks]
  );

  /**
   * Release lock for a record using serviceWorkflow
   */
  const releaseLock = useCallback(
    async (recordId: string | number): Promise<LockReleaseResult> => {
      // Skip if we don't hold the lock (check ref only, not state, to avoid dependency issues)
      if (currentLockIdRef.current !== recordId) {
        if (debug) {
          console.log(`[useLocking] Skip release - no lock held for record: ${recordId}`);
        }
        return { success: true };
      }

      if (debug) {
        console.log(`[useLocking] Releasing lock for record: ${recordId}`);
      }

      setLockState((prev) => ({
        ...prev,
        isReleasing: true,
      }));

      try {
        const result = await serviceWorkflow<undefined, void>({
          baseUrl,
          endpoint: `${apiPrefix}/${recordId}/lock`,
          method: 'DELETE',
          // Headers for unlock permission check
          headers: {
            'X-User-ID': userInfo.userId,
            'X-Permission-Level': String(userInfo.permissionLevel),
          },
          debug,
          caller: 'useLocking.releaseLock',
          // Health checks - SQL only (unlock writes to database)
          healthChecks: {
            ping: false,
            sql: true,
            minio: false,
          },
          verification: {
            enabled: false,
            getEndpoint: () => '',
          },
          callbacks: {
            onError: (error, errorCode) => {
              if (debug) {
                console.error(`[useLocking] Release error: ${error} (${errorCode})`);
              }
              // Don't propagate error callback for release - it's fire-and-forget
            },
          },
        });

        // Clear lock state regardless of result
        currentLockIdRef.current = null;
        setLockState({
          hasLock: false,
          isLockedByOther: false,
          conflictInfo: undefined,
          isAcquiring: false,
          isReleasing: false,
        });

        if (result.success) {
          if (debug) {
            console.log(`[useLocking] Lock released for record: ${recordId}`);
          }
          callbacks?.onLockReleased?.();
          return { success: true };
        }

        // Release failed but we still clear local state
        if (debug) {
          console.warn(`[useLocking] Lock release failed: ${result.error}`);
        }

        return {
          success: false,
          error: result.error,
        };
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        if (debug) {
          console.error(`[useLocking] Exception during lock release:`, error);
        }

        // Clear lock state regardless of error
        currentLockIdRef.current = null;
        setLockState({
          hasLock: false,
          isLockedByOther: false,
          conflictInfo: undefined,
          isAcquiring: false,
          isReleasing: false,
        });

        return {
          success: false,
          error: errorMsg,
        };
      }
    },
    [baseUrl, apiPrefix, userInfo, debug, callbacks]
  );

  /**
   * Reset lock state (call when modal closes)
   */
  const resetState = useCallback(() => {
    currentLockIdRef.current = null;
    setLockState({
      hasLock: false,
      isLockedByOther: false,
      conflictInfo: undefined,
      isAcquiring: false,
      isReleasing: false,
    });
  }, []);

  return {
    acquireLock,
    releaseLock,
    lockState,
    resetState,
  };
}

export default useLocking;
