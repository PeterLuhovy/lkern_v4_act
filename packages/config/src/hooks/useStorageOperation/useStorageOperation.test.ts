/*
 * ================================================================
 * FILE: useStorageOperation.test.ts
 * PATH: /packages/config/src/hooks/useStorageOperation/useStorageOperation.test.ts
 * DESCRIPTION: Unit tests for useStorageOperation hook
 * VERSION: v1.0.0
 * CREATED: 2025-12-11
 * UPDATED: 2025-12-11
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStorageOperation } from './useStorageOperation';
import type { StorageConfig, OperationResult, CombinedHealthResult } from '../../utils/storageOperations/types';

// Mock the storage operations
vi.mock('../../utils/storageOperations/operations', () => ({
  executeOperation: vi.fn(),
  executeBatchOperations: vi.fn(),
}));

vi.mock('../../utils/storageOperations/healthCheck', () => ({
  checkMultipleStoragesHealth: vi.fn(),
  getStorageDisplayNames: vi.fn((types: string[]) => types.map(t => `Storage-${t}`)),
}));

// Import mocked functions
import { executeOperation, executeBatchOperations } from '../../utils/storageOperations/operations';
import { checkMultipleStoragesHealth, getStorageDisplayNames } from '../../utils/storageOperations/healthCheck';

// ================================================================
// TEST DATA
// ================================================================

const mockStorageConfig: StorageConfig = {
  type: 'sql',
  name: 'Test SQL',
  healthEndpoint: '/health',
  baseUrl: 'http://localhost:3000',
};

const mockStorages: StorageConfig[] = [mockStorageConfig];

const mockSuccessResult: OperationResult = {
  success: true,
  data: { id: '123', name: 'Test' },
  storageResults: [],
};

const mockFailResult: OperationResult = {
  success: false,
  error: 'Operation failed',
  storageResults: [],
};

const mockHealthyResult: CombinedHealthResult = {
  allHealthy: true,
  unhealthyStorages: [],
  results: [{ type: 'sql', healthy: true, responseTime: 50 }],
};

const mockUnhealthyResult: CombinedHealthResult = {
  allHealthy: false,
  unhealthyStorages: ['sql'],
  results: [{ type: 'sql', healthy: false, error: 'Connection refused' }],
};

// ================================================================
// useStorageOperation TESTS
// ================================================================

describe('useStorageOperation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  // ================================================================
  // INITIAL STATE TESTS
  // ================================================================
  describe('Initial State', () => {
    it('starts with idle phase', () => {
      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      expect(result.current.state.phase).toBe('idle');
    });

    it('starts with isLoading false', () => {
      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      expect(result.current.state.isLoading).toBe(false);
    });

    it('starts with showUnavailableModal false', () => {
      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      expect(result.current.showUnavailableModal).toBe(undefined);
      expect(result.current.state.showUnavailableModal).toBe(false);
    });

    it('starts with showConfirmModal false', () => {
      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      expect(result.current.state.showConfirmModal).toBe(false);
    });

    it('starts with progress 0', () => {
      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      expect(result.current.state.progress).toBe(0);
    });

    it('starts with empty statusMessage', () => {
      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      expect(result.current.state.statusMessage).toBe('');
    });

    it('starts with null error', () => {
      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      expect(result.current.state.error).toBeNull();
    });

    it('starts with null lastResult', () => {
      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      expect(result.current.state.lastResult).toBeNull();
    });
  });

  // ================================================================
  // HELPER BOOLEANS TESTS
  // ================================================================
  describe('Helper Booleans', () => {
    it('isIdle is true when phase is idle', () => {
      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      expect(result.current.isIdle).toBe(true);
    });

    it('isLoading is false initially', () => {
      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      expect(result.current.isLoading).toBe(false);
    });

    it('isSuccess is false initially', () => {
      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      expect(result.current.isSuccess).toBe(false);
    });

    it('isError is false initially', () => {
      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      expect(result.current.isError).toBe(false);
    });

    it('isUnavailable is false initially', () => {
      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      expect(result.current.isUnavailable).toBe(false);
    });
  });

  // ================================================================
  // METHODS EXISTENCE TESTS
  // ================================================================
  describe('Methods Existence', () => {
    it('returns execute function', () => {
      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      expect(typeof result.current.execute).toBe('function');
    });

    it('returns executeBatch function', () => {
      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      expect(typeof result.current.executeBatch).toBe('function');
    });

    it('returns checkHealth function', () => {
      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      expect(typeof result.current.checkHealth).toBe('function');
    });

    it('returns retry function', () => {
      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      expect(typeof result.current.retry).toBe('function');
    });

    it('returns reset function', () => {
      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      expect(typeof result.current.reset).toBe('function');
    });

    it('returns closeUnavailableModal function', () => {
      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      expect(typeof result.current.closeUnavailableModal).toBe('function');
    });

    it('returns closeConfirmModal function', () => {
      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      expect(typeof result.current.closeConfirmModal).toBe('function');
    });

    it('returns showConfirmation function', () => {
      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      expect(typeof result.current.showConfirmation).toBe('function');
    });

    it('returns getUnavailableDisplayNames function', () => {
      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      expect(typeof result.current.getUnavailableDisplayNames).toBe('function');
    });
  });

  // ================================================================
  // RESET TESTS
  // ================================================================
  describe('Reset', () => {
    it('reset returns state to initial', async () => {
      vi.mocked(executeOperation).mockImplementation(async (_req, callbacks) => {
        callbacks?.onSuccess?.(mockSuccessResult);
        return mockSuccessResult;
      });

      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      // Execute to change state
      await act(async () => {
        await result.current.execute({ type: 'read', endpoint: '/test' });
      });

      expect(result.current.state.phase).toBe('success');

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.state.phase).toBe('idle');
      expect(result.current.state.isLoading).toBe(false);
      expect(result.current.state.progress).toBe(0);
      expect(result.current.state.error).toBeNull();
    });
  });

  // ================================================================
  // MODAL CONTROLS TESTS
  // ================================================================
  describe('Modal Controls', () => {
    it('showConfirmation sets showConfirmModal to true', () => {
      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      act(() => {
        result.current.showConfirmation('standard');
      });

      expect(result.current.state.showConfirmModal).toBe(true);
      expect(result.current.state.confirmationType).toBe('standard');
    });

    it('showConfirmation with force type', () => {
      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      act(() => {
        result.current.showConfirmation('force');
      });

      expect(result.current.state.confirmationType).toBe('force');
    });

    it('showConfirmation with mark_for_pending type', () => {
      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      act(() => {
        result.current.showConfirmation('mark_for_pending');
      });

      expect(result.current.state.confirmationType).toBe('mark_for_pending');
    });

    it('closeConfirmModal sets showConfirmModal to false', () => {
      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      // First show modal
      act(() => {
        result.current.showConfirmation('standard');
      });

      expect(result.current.state.showConfirmModal).toBe(true);

      // Then close
      act(() => {
        result.current.closeConfirmModal();
      });

      expect(result.current.state.showConfirmModal).toBe(false);
      expect(result.current.state.confirmationType).toBeUndefined();
    });

    it('closeUnavailableModal sets showUnavailableModal to false', async () => {
      vi.mocked(checkMultipleStoragesHealth).mockResolvedValue(mockUnhealthyResult);

      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      // Trigger unavailable state
      await act(async () => {
        await result.current.checkHealth();
      });

      expect(result.current.state.showUnavailableModal).toBe(true);

      // Close modal
      act(() => {
        result.current.closeUnavailableModal();
      });

      expect(result.current.state.showUnavailableModal).toBe(false);
    });
  });

  // ================================================================
  // CHECK HEALTH TESTS
  // ================================================================
  describe('Check Health', () => {
    it('checkHealth returns healthy result', async () => {
      vi.mocked(checkMultipleStoragesHealth).mockResolvedValue(mockHealthyResult);

      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      let healthResult: CombinedHealthResult | undefined;
      await act(async () => {
        healthResult = await result.current.checkHealth();
      });

      expect(healthResult?.allHealthy).toBe(true);
      expect(result.current.state.phase).toBe('idle');
    });

    it('checkHealth handles unhealthy result', async () => {
      vi.mocked(checkMultipleStoragesHealth).mockResolvedValue(mockUnhealthyResult);

      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      await act(async () => {
        await result.current.checkHealth();
      });

      expect(result.current.state.phase).toBe('unavailable');
      expect(result.current.state.showUnavailableModal).toBe(true);
      expect(result.current.isUnavailable).toBe(true);
    });

    it('checkHealth sets unavailableStorages', async () => {
      vi.mocked(checkMultipleStoragesHealth).mockResolvedValue(mockUnhealthyResult);

      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      await act(async () => {
        await result.current.checkHealth();
      });

      expect(result.current.state.unavailableStorages).toEqual(['sql']);
    });
  });

  // ================================================================
  // EXECUTE TESTS
  // ================================================================
  describe('Execute', () => {
    it('execute calls executeOperation', async () => {
      vi.mocked(executeOperation).mockResolvedValue(mockSuccessResult);

      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      await act(async () => {
        await result.current.execute({ type: 'read', endpoint: '/test' });
      });

      expect(executeOperation).toHaveBeenCalled();
    });

    it('execute returns operation result', async () => {
      vi.mocked(executeOperation).mockResolvedValue(mockSuccessResult);

      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      let opResult: OperationResult | undefined;
      await act(async () => {
        opResult = await result.current.execute({ type: 'read', endpoint: '/test' });
      });

      expect(opResult?.success).toBe(true);
    });

    it('execute with onSuccess callback updates state', async () => {
      vi.mocked(executeOperation).mockImplementation(async (_req, callbacks) => {
        callbacks?.onSuccess?.(mockSuccessResult);
        return mockSuccessResult;
      });

      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      await act(async () => {
        await result.current.execute({ type: 'read', endpoint: '/test' });
      });

      expect(result.current.state.phase).toBe('success');
      expect(result.current.isSuccess).toBe(true);
    });

    it('execute with onError callback updates state', async () => {
      vi.mocked(executeOperation).mockImplementation(async (_req, callbacks) => {
        callbacks?.onError?.('Test error', mockFailResult);
        return mockFailResult;
      });

      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      await act(async () => {
        await result.current.execute({ type: 'delete', endpoint: '/test' });
      });

      expect(result.current.state.phase).toBe('failed');
      expect(result.current.isError).toBe(true);
    });

    it('execute with onUnavailable callback updates state', async () => {
      vi.mocked(executeOperation).mockImplementation(async (_req, callbacks) => {
        callbacks?.onUnavailable?.(['sql']);
        return mockFailResult;
      });

      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      await act(async () => {
        await result.current.execute({ type: 'read', endpoint: '/test' });
      });

      expect(result.current.state.phase).toBe('unavailable');
      expect(result.current.state.showUnavailableModal).toBe(true);
    });

    it('execute with onNotFound callback updates state', async () => {
      vi.mocked(executeOperation).mockImplementation(async (_req, callbacks) => {
        callbacks?.onNotFound?.();
        return mockFailResult;
      });

      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      await act(async () => {
        await result.current.execute({ type: 'read', endpoint: '/test' });
      });

      expect(result.current.state.phase).toBe('not_found');
    });

    it('execute with onVerificationFailed callback updates state', async () => {
      vi.mocked(executeOperation).mockImplementation(async (_req, callbacks) => {
        callbacks?.onVerificationFailed?.([{ field: 'name', expected: 'A', actual: 'B' }]);
        return mockFailResult;
      });

      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      await act(async () => {
        await result.current.execute({ type: 'update', endpoint: '/test', data: {} });
      });

      expect(result.current.state.phase).toBe('verification_failed');
    });
  });

  // ================================================================
  // EXECUTE BATCH TESTS
  // ================================================================
  describe('Execute Batch', () => {
    it('executeBatch calls executeBatchOperations', async () => {
      vi.mocked(executeBatchOperations).mockResolvedValue({
        results: [mockSuccessResult],
        successCount: 1,
        failCount: 0,
      });

      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      await act(async () => {
        await result.current.executeBatch([
          { type: 'read', endpoint: '/test1' },
          { type: 'read', endpoint: '/test2' },
        ]);
      });

      expect(executeBatchOperations).toHaveBeenCalled();
    });

    it('executeBatch with all success updates state', async () => {
      vi.mocked(executeBatchOperations).mockResolvedValue({
        results: [mockSuccessResult, mockSuccessResult],
        successCount: 2,
        failCount: 0,
      });

      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      await act(async () => {
        await result.current.executeBatch([
          { type: 'read', endpoint: '/test1' },
          { type: 'read', endpoint: '/test2' },
        ]);
      });

      expect(result.current.state.phase).toBe('success');
      expect(result.current.state.progress).toBe(100);
    });

    it('executeBatch with failures updates state', async () => {
      vi.mocked(executeBatchOperations).mockResolvedValue({
        results: [mockSuccessResult, mockFailResult],
        successCount: 1,
        failCount: 1,
      });

      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      await act(async () => {
        await result.current.executeBatch([
          { type: 'delete', endpoint: '/test1' },
          { type: 'delete', endpoint: '/test2' },
        ]);
      });

      expect(result.current.state.phase).toBe('failed');
      expect(result.current.isError).toBe(true);
    });

    it('executeBatch returns results summary', async () => {
      vi.mocked(executeBatchOperations).mockResolvedValue({
        results: [mockSuccessResult, mockFailResult],
        successCount: 1,
        failCount: 1,
      });

      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      let batchResult: { successCount: number; failCount: number } | undefined;
      await act(async () => {
        batchResult = await result.current.executeBatch([
          { type: 'delete', endpoint: '/test1' },
          { type: 'delete', endpoint: '/test2' },
        ]);
      });

      expect(batchResult?.successCount).toBe(1);
      expect(batchResult?.failCount).toBe(1);
    });
  });

  // ================================================================
  // RETRY TESTS
  // ================================================================
  describe('Retry', () => {
    it('retry returns null when no previous operation', async () => {
      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      let retryResult: OperationResult | null | undefined;
      await act(async () => {
        retryResult = await result.current.retry();
      });

      expect(retryResult).toBeNull();
    });

    it('retry re-executes last operation', async () => {
      vi.mocked(executeOperation).mockResolvedValue(mockSuccessResult);

      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      // First execute
      await act(async () => {
        await result.current.execute({ type: 'read', endpoint: '/test' });
      });

      // Then retry
      await act(async () => {
        await result.current.retry();
      });

      // executeOperation should be called twice
      expect(executeOperation).toHaveBeenCalledTimes(2);
    });
  });

  // ================================================================
  // GET UNAVAILABLE DISPLAY NAMES TESTS
  // ================================================================
  describe('Get Unavailable Display Names', () => {
    it('returns empty array when no unavailable storages', () => {
      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      const names = result.current.getUnavailableDisplayNames();
      expect(names).toEqual([]);
    });

    it('returns display names for unavailable storages', async () => {
      vi.mocked(checkMultipleStoragesHealth).mockResolvedValue(mockUnhealthyResult);
      vi.mocked(getStorageDisplayNames).mockReturnValue(['SQL Database']);

      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      await act(async () => {
        await result.current.checkHealth();
      });

      result.current.getUnavailableDisplayNames();
      expect(getStorageDisplayNames).toHaveBeenCalled();
    });
  });

  // ================================================================
  // AUTO RESET TESTS
  // ================================================================
  describe('Auto Reset', () => {
    it('auto resets after success when autoResetDelay is set', async () => {
      vi.mocked(executeOperation).mockImplementation(async (_req, callbacks) => {
        if (callbacks?.onSuccess) {
          callbacks.onSuccess(mockSuccessResult);
        }
        return mockSuccessResult;
      });

      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages, autoResetDelay: 1000 })
      );

      await act(async () => {
        await result.current.execute({ type: 'read', endpoint: '/test' });
      });

      expect(result.current.state.phase).toBe('success');

      // Advance timers
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.state.phase).toBe('idle');
    });

    it('does not auto reset when autoResetDelay is 0', async () => {
      vi.mocked(executeOperation).mockImplementation(async (_req, callbacks) => {
        callbacks?.onSuccess?.(mockSuccessResult);
        return mockSuccessResult;
      });

      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages, autoResetDelay: 0 })
      );

      await act(async () => {
        await result.current.execute({ type: 'read', endpoint: '/test' });
      });

      expect(result.current.state.phase).toBe('success');

      // Advance timers
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Still success - no auto reset
      expect(result.current.state.phase).toBe('success');
    });
  });

  // ================================================================
  // OPTIONS TESTS
  // ================================================================
  describe('Options', () => {
    it('accepts storages option', () => {
      const { result } = renderHook(() =>
        useStorageOperation({ storages: mockStorages })
      );

      expect(result.current.state.phase).toBe('idle');
    });

    it('accepts retryConfig option', () => {
      const { result } = renderHook(() =>
        useStorageOperation({
          storages: mockStorages,
          retryConfig: { maxAttempts: 5, baseDelayMs: 500 },
        })
      );

      expect(result.current.state.phase).toBe('idle');
    });

    it('accepts autoResetDelay option', () => {
      const { result } = renderHook(() =>
        useStorageOperation({
          storages: mockStorages,
          autoResetDelay: 3000,
        })
      );

      expect(result.current.state.phase).toBe('idle');
    });
  });
});
