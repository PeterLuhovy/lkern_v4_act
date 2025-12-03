/*
 * ================================================================
 * FILE: useStorageOperation.ts
 * PATH: /packages/config/src/hooks/useStorageOperation/useStorageOperation.ts
 * DESCRIPTION: React hook for storage operations with UI state management
 *              Handles: health check, operation, verification, error modals
 * VERSION: v1.0.0
 * CREATED: 2025-11-30
 * UPDATED: 2025-11-30
 * ================================================================
 */

import { useState, useCallback, useRef } from 'react';
import type {
  StorageConfig,
  StorageType,
  OperationType,
  OperationPhase,
  OperationRequest,
  OperationResult,
  StorageOperationUIState,
  RetryConfig,
  CombinedHealthResult,
} from '../../utils/storageOperations/types';
import {
  executeOperation,
  executeBatchOperations,
} from '../../utils/storageOperations/operations';
import {
  checkMultipleStoragesHealth,
  getStorageDisplayNames,
} from '../../utils/storageOperations/healthCheck';

// ============================================================
// TYPES
// ============================================================

export interface UseStorageOperationOptions {
  /** Storage configurations */
  storages: StorageConfig[];
  /** Retry configuration */
  retryConfig?: Partial<RetryConfig>;
  /** Auto-reset state after success (ms, 0 = no auto-reset) */
  autoResetDelay?: number;
}

export interface UseStorageOperationReturn {
  /** Current UI state */
  state: StorageOperationUIState;
  /** Execute a single operation */
  execute: <T = unknown>(
    request: Omit<OperationRequest<T>, 'storages'>
  ) => Promise<OperationResult<T>>;
  /** Execute multiple operations */
  executeBatch: <T = unknown>(
    requests: Omit<OperationRequest<T>, 'storages'>[],
    options?: { parallel?: boolean; stopOnError?: boolean }
  ) => Promise<{ results: OperationResult<T>[]; successCount: number; failCount: number }>;
  /** Check health only (without operation) */
  checkHealth: () => Promise<CombinedHealthResult>;
  /** Retry last operation */
  retry: () => Promise<OperationResult | null>;
  /** Reset state to idle */
  reset: () => void;
  /** Close unavailable modal */
  closeUnavailableModal: () => void;
  /** Close confirm modal */
  closeConfirmModal: () => void;
  /** Set confirmation type and show modal */
  showConfirmation: (type: 'standard' | 'force' | 'mark_for_pending') => void;
  /** Computed helpers */
  isIdle: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isUnavailable: boolean;
  /** Get display names for unavailable storages */
  getUnavailableDisplayNames: () => string[];
}

// ============================================================
// INITIAL STATE
// ============================================================

const initialState: StorageOperationUIState = {
  phase: 'idle',
  isLoading: false,
  showUnavailableModal: false,
  unavailableStorages: [],
  showConfirmModal: false,
  confirmationType: undefined,
  progress: 0,
  statusMessage: '',
  error: null,
  lastResult: null,
};

// ============================================================
// HOOK IMPLEMENTATION
// ============================================================

/**
 * React hook for storage operations with UI state management
 *
 * Provides:
 * - Automatic health check before operations
 * - Exponential backoff retry with slow notification
 * - Modal state management (unavailable, confirm)
 * - Progress tracking for batch operations
 * - Operation verification
 *
 * @example
 * ```tsx
 * const {
 *   state,
 *   execute,
 *   isLoading,
 *   isUnavailable,
 *   closeUnavailableModal,
 *   getUnavailableDisplayNames,
 * } = useStorageOperation({
 *   storages: [STORAGE_CONFIGS.issuesSQL, STORAGE_CONFIGS.minio],
 * });
 *
 * const handleDelete = async () => {
 *   const result = await execute({
 *     type: 'delete',
 *     endpoint: '/issues',
 *     data: { id: issueId },
 *   });
 *
 *   if (result.success) {
 *     toast.success('Deleted!');
 *   }
 * };
 *
 * // In JSX:
 * {isLoading && <Spinner />}
 * {state.statusMessage && <p>{state.statusMessage}</p>}
 *
 * <Modal isOpen={isUnavailable} onClose={closeUnavailableModal}>
 *   <p>Unavailable: {getUnavailableDisplayNames().join(', ')}</p>
 *   <Button onClick={retry}>Retry</Button>
 * </Modal>
 * ```
 */
export function useStorageOperation(
  options: UseStorageOperationOptions
): UseStorageOperationReturn {
  const { storages, retryConfig, autoResetDelay = 0 } = options;

  // State
  const [state, setState] = useState<StorageOperationUIState>(initialState);

  // Refs for retry functionality
  const lastRequestRef = useRef<OperationRequest | null>(null);
  const autoResetTimerRef = useRef<number | null>(null);

  // ============================================================
  // HELPERS
  // ============================================================

  const clearAutoResetTimer = () => {
    if (autoResetTimerRef.current) {
      window.clearTimeout(autoResetTimerRef.current);
      autoResetTimerRef.current = null;
    }
  };

  const scheduleAutoReset = () => {
    if (autoResetDelay > 0) {
      clearAutoResetTimer();
      autoResetTimerRef.current = window.setTimeout(() => {
        setState(initialState);
      }, autoResetDelay);
    }
  };

  const updatePhase = (phase: OperationPhase, message: string) => {
    setState((prev) => ({
      ...prev,
      phase,
      statusMessage: message,
      isLoading: ['health_check', 'executing', 'verifying'].includes(phase),
    }));
  };

  // ============================================================
  // RESET
  // ============================================================

  const reset = useCallback(() => {
    clearAutoResetTimer();
    setState(initialState);
    lastRequestRef.current = null;
  }, []);

  // ============================================================
  // MODAL CONTROLS
  // ============================================================

  const closeUnavailableModal = useCallback(() => {
    setState((prev) => ({ ...prev, showUnavailableModal: false }));
  }, []);

  const closeConfirmModal = useCallback(() => {
    setState((prev) => ({ ...prev, showConfirmModal: false, confirmationType: undefined }));
  }, []);

  const showConfirmation = useCallback((type: 'standard' | 'force' | 'mark_for_pending') => {
    setState((prev) => ({ ...prev, showConfirmModal: true, confirmationType: type }));
  }, []);

  // ============================================================
  // CHECK HEALTH ONLY
  // ============================================================

  const checkHealth = useCallback(async (): Promise<CombinedHealthResult> => {
    updatePhase('health_check', 'Kontrolujem dostupnosť služieb...');

    const result = await checkMultipleStoragesHealth(storages, {
      ...retryConfig,
      onSlowOperation: () => {
        setState((prev) => ({
          ...prev,
          statusMessage: 'Pripojenie trvá dlhšie ako obvykle...',
        }));
      },
    });

    if (!result.allHealthy) {
      setState((prev) => ({
        ...prev,
        phase: 'unavailable',
        isLoading: false,
        showUnavailableModal: true,
        unavailableStorages: result.unhealthyStorages,
        statusMessage: 'Niektoré služby sú nedostupné',
        error: `Nedostupné: ${getStorageDisplayNames(result.unhealthyStorages).join(', ')}`,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        phase: 'idle',
        isLoading: false,
        statusMessage: 'Všetky služby sú dostupné',
      }));
    }

    return result;
  }, [storages, retryConfig]);

  // ============================================================
  // EXECUTE SINGLE OPERATION
  // ============================================================

  const execute = useCallback(
    async <T = unknown>(
      request: Omit<OperationRequest<T>, 'storages'>
    ): Promise<OperationResult<T>> => {
      clearAutoResetTimer();

      const fullRequest: OperationRequest<T> = {
        ...request,
        storages,
      };

      // Store for retry
      lastRequestRef.current = fullRequest as unknown as OperationRequest;

      // Execute with callbacks
      const result = await executeOperation<T>(fullRequest, {
        onHealthCheckStart: () => {
          updatePhase('health_check', 'Kontrolujem dostupnosť služieb...');
        },
        onHealthCheckComplete: (healthResult: CombinedHealthResult) => {
          if (!healthResult.allHealthy) {
            setState((prev) => ({
              ...prev,
              phase: 'unavailable',
              isLoading: false,
              showUnavailableModal: true,
              unavailableStorages: healthResult.unhealthyStorages,
              statusMessage: 'Niektoré služby sú nedostupné',
              error: `Nedostupné: ${getStorageDisplayNames(healthResult.unhealthyStorages).join(', ')}`,
            }));
          }
        },
        onOperationStart: () => {
          const messages: Record<OperationType, string> = {
            create: 'Vytváram záznam...',
            read: 'Načítavam dáta...',
            update: 'Aktualizujem záznam...',
            delete: 'Odstraňujem záznam...',
          };
          updatePhase('executing', messages[request.type]);
        },
        onProgress: (current, total) => {
          setState((prev) => ({
            ...prev,
            progress: Math.round((current / total) * 100),
          }));
        },
        onSuccess: (opResult) => {
          setState((prev) => ({
            ...prev,
            phase: 'success',
            isLoading: false,
            progress: 100,
            statusMessage: 'Operácia úspešná',
            error: null,
            lastResult: opResult as unknown as OperationResult,
          }));
          scheduleAutoReset();
        },
        onError: (error, opResult) => {
          setState((prev) => ({
            ...prev,
            phase: 'failed',
            isLoading: false,
            statusMessage: 'Operácia zlyhala',
            error,
            lastResult: opResult as unknown as OperationResult ?? null,
          }));
        },
        onUnavailable: (unavailableStorages) => {
          setState((prev) => ({
            ...prev,
            phase: 'unavailable',
            isLoading: false,
            showUnavailableModal: true,
            unavailableStorages,
            statusMessage: 'Služba nedostupná',
            error: `Nedostupné: ${getStorageDisplayNames(unavailableStorages).join(', ')}`,
          }));
        },
        onNotFound: () => {
          setState((prev) => ({
            ...prev,
            phase: 'not_found',
            isLoading: false,
            statusMessage: 'Záznam nebol nájdený',
            error: 'Záznam neexistuje alebo bol vymazaný',
          }));
        },
        onVerificationFailed: (errors) => {
          setState((prev) => ({
            ...prev,
            phase: 'verification_failed',
            isLoading: false,
            statusMessage: 'Overenie zlyhalo',
            error: `Nesúlad polí: ${errors?.map((e) => e.field).join(', ')}`,
          }));
        },
      }, {
        ...retryConfig,
        onSlowOperation: () => {
          setState((prev) => ({
            ...prev,
            statusMessage: 'Operácia trvá dlhšie ako obvykle...',
          }));
        },
      });

      return result;
    },
    [storages, retryConfig]
  );

  // ============================================================
  // EXECUTE BATCH OPERATIONS
  // ============================================================

  const executeBatch = useCallback(
    async <T = unknown>(
      requests: Omit<OperationRequest<T>, 'storages'>[],
      batchOptions?: { parallel?: boolean; stopOnError?: boolean }
    ): Promise<{ results: OperationResult<T>[]; successCount: number; failCount: number }> => {
      clearAutoResetTimer();

      const fullRequests = requests.map((req) => ({
        ...req,
        storages,
      }));

      updatePhase('health_check', 'Kontrolujem dostupnosť služieb...');

      const result = await executeBatchOperations<T>(fullRequests, {
        ...batchOptions,
        retryConfig: {
          ...retryConfig,
          onSlowOperation: () => {
            setState((prev) => ({
              ...prev,
              statusMessage: 'Operácia trvá dlhšie ako obvykle...',
            }));
          },
        },
        callbacks: {
          onOperationStart: () => {
            updatePhase('executing', `Spracúvam ${fullRequests.length} záznamov...`);
          },
          onProgress: (current, total) => {
            setState((prev) => ({
              ...prev,
              progress: Math.round((current / total) * 100),
              statusMessage: `Spracúvam ${current}/${total}...`,
            }));
          },
          onUnavailable: (unavailableStorages) => {
            setState((prev) => ({
              ...prev,
              phase: 'unavailable',
              isLoading: false,
              showUnavailableModal: true,
              unavailableStorages,
            }));
          },
        },
      });

      if (result.failCount === 0) {
        setState((prev) => ({
          ...prev,
          phase: 'success',
          isLoading: false,
          progress: 100,
          statusMessage: `Úspešne spracovaných ${result.successCount} záznamov`,
          error: null,
        }));
        scheduleAutoReset();
      } else {
        setState((prev) => ({
          ...prev,
          phase: 'failed',
          isLoading: false,
          statusMessage: `Zlyhalo ${result.failCount} z ${requests.length} operácií`,
          error: `Úspešných: ${result.successCount}, Zlyhalo: ${result.failCount}`,
        }));
      }

      return result;
    },
    [storages, retryConfig]
  );

  // ============================================================
  // RETRY LAST OPERATION
  // ============================================================

  const retry = useCallback(async (): Promise<OperationResult | null> => {
    if (!lastRequestRef.current) {
      return null;
    }

    closeUnavailableModal();
    return execute(lastRequestRef.current);
  }, [execute, closeUnavailableModal]);

  // ============================================================
  // COMPUTED HELPERS
  // ============================================================

  const isIdle = state.phase === 'idle';
  const isLoading = state.isLoading;
  const isSuccess = state.phase === 'success';
  const isError = ['failed', 'verification_failed'].includes(state.phase);
  const isUnavailable = state.phase === 'unavailable' || state.showUnavailableModal;

  const getUnavailableDisplayNames = useCallback(() => {
    const storageMap = new Map(storages.map((s) => [s.type, s]));
    return getStorageDisplayNames(state.unavailableStorages, storageMap);
  }, [state.unavailableStorages, storages]);

  // ============================================================
  // RETURN
  // ============================================================

  return {
    state,
    execute,
    executeBatch,
    checkHealth,
    retry,
    reset,
    closeUnavailableModal,
    closeConfirmModal,
    showConfirmation,
    isIdle,
    isLoading,
    isSuccess,
    isError,
    isUnavailable,
    getUnavailableDisplayNames,
  };
}
