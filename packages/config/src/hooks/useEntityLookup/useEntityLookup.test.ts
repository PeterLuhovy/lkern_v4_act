/*
 * ================================================================
 * FILE: useEntityLookup.test.ts
 * PATH: /packages/config/src/hooks/useEntityLookup/useEntityLookup.test.ts
 * DESCRIPTION: Unit tests for useEntityLookup and useBatchEntityLookup hooks
 * VERSION: v1.0.1
 * CREATED: 2025-12-11
 * UPDATED: 2025-12-16
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useEntityLookup, useBatchEntityLookup } from './useEntityLookup';

// ================================================================
// MOCK DATA
// ================================================================

interface TestEntity {
  id: string;
  name: string;
  email: string;
}

const mockEntity: TestEntity = {
  id: 'entity-123',
  name: 'Test Entity',
  email: 'test@example.com',
};

const mockEntity2: TestEntity = {
  id: 'entity-456',
  name: 'Second Entity',
  email: 'second@example.com',
};

// Helper to generate unique IDs to avoid cache collisions between tests
let testCounter = 0;
function uniqueId(prefix = 'test'): string {
  return `${prefix}-${Date.now()}-${++testCounter}`;
}

// ================================================================
// useEntityLookup TESTS
// ================================================================

describe('useEntityLookup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ================================================================
  // INITIAL STATE TESTS
  // ================================================================
  describe('Initial State', () => {
    it('starts with idle status when entityId is null', () => {
      const fetcher = vi.fn();
      const { result } = renderHook(() =>
        useEntityLookup({
          service: 'test-service',
          entityId: null,
          fetcher,
        })
      );

      expect(result.current.status).toBe('idle');
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it('starts with idle status when entityId is undefined', () => {
      const fetcher = vi.fn();
      const { result } = renderHook(() =>
        useEntityLookup({
          service: 'test-service',
          entityId: undefined,
          fetcher,
        })
      );

      expect(result.current.status).toBe('idle');
      expect(result.current.data).toBeNull();
    });

    it('does not call fetcher when entityId is null', () => {
      const fetcher = vi.fn();
      renderHook(() =>
        useEntityLookup({
          service: 'test-service',
          entityId: null,
          fetcher,
        })
      );

      expect(fetcher).not.toHaveBeenCalled();
    });

    it('returns isServiceAvailable as true initially', () => {
      const fetcher = vi.fn();
      const { result } = renderHook(() =>
        useEntityLookup({
          service: 'test-service',
          entityId: null,
          fetcher,
        })
      );

      expect(result.current.isServiceAvailable).toBe(true);
    });

    it('returns entityExists as true initially', () => {
      const fetcher = vi.fn();
      const { result } = renderHook(() =>
        useEntityLookup({
          service: 'test-service',
          entityId: null,
          fetcher,
        })
      );

      expect(result.current.entityExists).toBe(true);
    });
  });

  // ================================================================
  // SUCCESSFUL FETCH TESTS
  // ================================================================
  describe('Successful Fetch', () => {
    it('fetches entity successfully', async () => {
      const fetcher = vi.fn().mockResolvedValue(mockEntity);

      const { result } = renderHook(() =>
        useEntityLookup({
          service: 'test-service',
          entityId: 'entity-123',
          fetcher,
        })
      );

      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });

      expect(result.current.data).toEqual(mockEntity);
      expect(result.current.error).toBeNull();
      expect(fetcher).toHaveBeenCalledWith('entity-123');
    });

    it('sets isLoading to true during fetch', async () => {
      const serviceName = uniqueId('loading-test');
      const entityId = uniqueId('entity');
      let resolvePromise: (value: TestEntity) => void;
      const fetchPromise = new Promise<TestEntity>((resolve) => {
        resolvePromise = resolve;
      });
      const fetcher = vi.fn().mockReturnValue(fetchPromise);

      const { result } = renderHook(() =>
        useEntityLookup({
          service: serviceName,
          entityId,
          fetcher,
        })
      );

      // Should be loading (status 'loading' means isLoading is true)
      await waitFor(() => {
        expect(result.current.status).toBe('loading');
      });
      expect(result.current.isLoading).toBe(true);

      // Resolve and complete - use async act() to handle state updates from promise resolution
      await act(async () => {
        if (resolvePromise) {
          resolvePromise(mockEntity);
        }
        // Allow promise callbacks to execute
        await Promise.resolve();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.status).toBe('success');
      });
    });

    it('caches data and returns from cache on subsequent calls', async () => {
      const fetcher = vi.fn().mockResolvedValue(mockEntity);

      const { result, rerender } = renderHook(
        ({ entityId }) =>
          useEntityLookup({
            service: 'cache-test-service',
            entityId,
            fetcher,
          }),
        { initialProps: { entityId: 'cached-entity' } }
      );

      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });

      expect(fetcher).toHaveBeenCalledTimes(1);

      // Force re-render with same ID
      rerender({ entityId: 'cached-entity' });

      // Should still be success (from cache), fetcher not called again
      expect(result.current.status).toBe('success');
      expect(fetcher).toHaveBeenCalledTimes(1);
    });
  });

  // ================================================================
  // HEALTH CHECK TESTS
  // ================================================================
  describe('Health Check', () => {
    it('checks health before fetching when healthChecker provided', async () => {
      const healthChecker = vi.fn().mockResolvedValue(true);
      const fetcher = vi.fn().mockResolvedValue(mockEntity);

      const { result } = renderHook(() =>
        useEntityLookup({
          service: 'health-test-service',
          entityId: 'health-entity',
          fetcher,
          healthChecker,
        })
      );

      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });

      expect(healthChecker).toHaveBeenCalled();
      expect(fetcher).toHaveBeenCalled();
    });

    it('sets status to service_unavailable when health check fails', async () => {
      const healthChecker = vi.fn().mockResolvedValue(false);
      const fetcher = vi.fn().mockResolvedValue(mockEntity);

      const { result } = renderHook(() =>
        useEntityLookup({
          service: 'unhealthy-service',
          entityId: 'entity-123',
          fetcher,
          healthChecker,
        })
      );

      await waitFor(() => {
        expect(result.current.status).toBe('service_unavailable');
      });

      expect(result.current.isServiceAvailable).toBe(false);
      expect(result.current.error).toContain('unavailable');
      expect(fetcher).not.toHaveBeenCalled();
    });

    it('sets status to checking during health check', async () => {
      let resolveHealth: (value: boolean) => void;
      const healthPromise = new Promise<boolean>((resolve) => {
        resolveHealth = resolve;
      });
      const healthChecker = vi.fn().mockReturnValue(healthPromise);
      const fetcher = vi.fn().mockResolvedValue(mockEntity);

      const { result } = renderHook(() =>
        useEntityLookup({
          service: 'checking-service',
          entityId: 'entity-123',
          fetcher,
          healthChecker,
        })
      );

      await waitFor(() => {
        expect(result.current.status).toBe('checking');
      });

      expect(result.current.isLoading).toBe(true);

      // Complete health check - use async act() to handle state updates from promise resolution
      await act(async () => {
        if (resolveHealth) {
          resolveHealth(true);
        }
        await Promise.resolve();
      });

      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });
    });
  });

  // ================================================================
  // ERROR HANDLING TESTS
  // ================================================================
  describe('Error Handling', () => {
    it('sets status to not_found on 404 error', async () => {
      const fetcher = vi.fn().mockRejectedValue(new Error('404 Not Found'));

      const { result } = renderHook(() =>
        useEntityLookup({
          service: 'notfound-service',
          entityId: 'missing-entity',
          fetcher,
          retryCount: 0,
        })
      );

      await waitFor(() => {
        expect(result.current.status).toBe('not_found');
      });

      expect(result.current.entityExists).toBe(false);
      expect(result.current.error).toContain('not found');
    });

    it('sets status to not_found when error has status 404', async () => {
      const error = new Error('Request failed');
      (error as Error & { status: number }).status = 404;
      const fetcher = vi.fn().mockRejectedValue(error);

      const { result } = renderHook(() =>
        useEntityLookup({
          service: 'status404-service',
          entityId: 'missing-entity',
          fetcher,
          retryCount: 0,
        })
      );

      await waitFor(() => {
        expect(result.current.status).toBe('not_found');
      });
    });

    it('sets status to service_unavailable on 503 error', async () => {
      const fetcher = vi.fn().mockRejectedValue(new Error('503 Service Unavailable'));

      const { result } = renderHook(() =>
        useEntityLookup({
          service: 'unavailable503-service',
          entityId: 'entity-123',
          fetcher,
          retryCount: 0,
        })
      );

      await waitFor(() => {
        expect(result.current.status).toBe('service_unavailable');
      });

      expect(result.current.isServiceAvailable).toBe(false);
    });

    it('sets status to service_unavailable on ECONNREFUSED error', async () => {
      const fetcher = vi.fn().mockRejectedValue(new Error('ECONNREFUSED'));

      const { result } = renderHook(() =>
        useEntityLookup({
          service: 'connrefused-service',
          entityId: 'entity-123',
          fetcher,
          retryCount: 0,
        })
      );

      await waitFor(() => {
        expect(result.current.status).toBe('service_unavailable');
      });
    });

    it('sets status to error on other errors after retries', async () => {
      const fetcher = vi.fn().mockRejectedValue(new Error('Unknown error'));

      const { result } = renderHook(() =>
        useEntityLookup({
          service: 'error-service',
          entityId: 'entity-123',
          fetcher,
          retryCount: 0,
        })
      );

      await waitFor(() => {
        expect(result.current.status).toBe('error');
      });

      expect(result.current.error).toBe('Unknown error');
    });
  });

  // ================================================================
  // RETRY LOGIC TESTS
  // ================================================================
  describe('Retry Logic', () => {
    it('retries on failure according to retryCount', async () => {
      const serviceName = uniqueId('retry');
      const entityId = uniqueId('entity');
      const fetcher = vi
        .fn()
        .mockRejectedValueOnce(new Error('First fail'))
        .mockResolvedValueOnce(mockEntity);

      const { result } = renderHook(() =>
        useEntityLookup({
          service: serviceName,
          entityId,
          fetcher,
          retryCount: 1,
          retryDelay: 10, // Very short delay for tests
        })
      );

      await waitFor(() => {
        expect(result.current.status).toBe('success');
      }, { timeout: 5000 });

      expect(fetcher).toHaveBeenCalledTimes(2);
    });

    it('stops retrying after max retries', async () => {
      const serviceName = uniqueId('maxretry');
      const entityId = uniqueId('entity');
      const fetcher = vi.fn().mockRejectedValue(new Error('Always fails'));

      const { result } = renderHook(() =>
        useEntityLookup({
          service: serviceName,
          entityId,
          fetcher,
          retryCount: 2,
          retryDelay: 10, // Very short delay for tests
        })
      );

      await waitFor(() => {
        expect(result.current.status).toBe('error');
      }, { timeout: 5000 });

      // Initial + 2 retries = 3 calls
      expect(fetcher).toHaveBeenCalledTimes(3);
    });
  });

  // ================================================================
  // AUTOFETCH TESTS
  // ================================================================
  describe('AutoFetch', () => {
    it('does not auto-fetch when autoFetch is false', () => {
      const fetcher = vi.fn().mockResolvedValue(mockEntity);

      const { result } = renderHook(() =>
        useEntityLookup({
          service: 'noauto-service',
          entityId: 'entity-123',
          fetcher,
          autoFetch: false,
        })
      );

      expect(result.current.status).toBe('idle');
      expect(fetcher).not.toHaveBeenCalled();
    });

    it('allows manual fetch when autoFetch is false', async () => {
      const fetcher = vi.fn().mockResolvedValue(mockEntity);

      const { result } = renderHook(() =>
        useEntityLookup({
          service: 'manual-service',
          entityId: 'entity-123',
          fetcher,
          autoFetch: false,
        })
      );

      expect(result.current.status).toBe('idle');

      await act(async () => {
        await result.current.refetch();
      });

      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });

      expect(fetcher).toHaveBeenCalled();
    });
  });

  // ================================================================
  // REFETCH METHOD TESTS
  // ================================================================
  describe('Refetch Method', () => {
    it('provides refetch function', () => {
      const fetcher = vi.fn();
      const { result } = renderHook(() =>
        useEntityLookup({
          service: 'test-service',
          entityId: null,
          fetcher,
        })
      );

      expect(typeof result.current.refetch).toBe('function');
    });

    it('refetch triggers new fetch', async () => {
      const fetcher = vi.fn().mockResolvedValue(mockEntity);

      const { result } = renderHook(() =>
        useEntityLookup({
          service: 'refetch-service',
          entityId: 'entity-123',
          fetcher,
          autoFetch: false,
        })
      );

      await act(async () => {
        await result.current.refetch();
      });

      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });

      expect(fetcher).toHaveBeenCalledTimes(1);
    });
  });

  // ================================================================
  // CLEAR CACHE TESTS
  // ================================================================
  describe('Clear Cache', () => {
    it('provides clearCache function', () => {
      const fetcher = vi.fn();
      const { result } = renderHook(() =>
        useEntityLookup({
          service: 'test-service',
          entityId: null,
          fetcher,
        })
      );

      expect(typeof result.current.clearCache).toBe('function');
    });

    it('clearCache forces refetch on next call', async () => {
      const fetcher = vi.fn().mockResolvedValue(mockEntity);

      const { result } = renderHook(() =>
        useEntityLookup({
          service: 'clearcache-service',
          entityId: 'cached-entity-clear',
          fetcher,
        })
      );

      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });

      expect(fetcher).toHaveBeenCalledTimes(1);

      // Clear cache and refetch
      act(() => {
        result.current.clearCache();
      });

      await act(async () => {
        await result.current.refetch();
      });

      expect(fetcher).toHaveBeenCalledTimes(2);
    });
  });

  // ================================================================
  // COMPUTED VALUES TESTS
  // ================================================================
  describe('Computed Values', () => {
    it('isLoading is true when status is checking', async () => {
      let resolveHealth: (value: boolean) => void;
      const healthPromise = new Promise<boolean>((resolve) => {
        resolveHealth = resolve;
      });
      const healthChecker = vi.fn().mockReturnValue(healthPromise);
      const fetcher = vi.fn().mockResolvedValue(mockEntity);

      const { result } = renderHook(() =>
        useEntityLookup({
          service: 'computed-checking-service',
          entityId: 'entity-123',
          fetcher,
          healthChecker,
        })
      );

      await waitFor(() => {
        expect(result.current.status).toBe('checking');
      });

      expect(result.current.isLoading).toBe(true);

      // Cleanup: resolve the pending promise to prevent test warnings
      await act(async () => {
        if (resolveHealth) {
          resolveHealth(true);
        }
        await Promise.resolve();
      });
    });

    it('isLoading is true when status is loading', async () => {
      let resolveFetch: (value: TestEntity) => void;
      const fetchPromise = new Promise<TestEntity>((resolve) => {
        resolveFetch = resolve;
      });
      const fetcher = vi.fn().mockReturnValue(fetchPromise);

      const { result } = renderHook(() =>
        useEntityLookup({
          service: 'computed-loading-service',
          entityId: 'entity-123',
          fetcher,
        })
      );

      await waitFor(() => {
        expect(result.current.status).toBe('loading');
      });

      expect(result.current.isLoading).toBe(true);

      // Cleanup: resolve the pending promise to prevent test warnings
      await act(async () => {
        if (resolveFetch) {
          resolveFetch(mockEntity);
        }
        await Promise.resolve();
      });
    });

    it('isServiceAvailable is false when status is service_unavailable', async () => {
      const healthChecker = vi.fn().mockResolvedValue(false);
      const fetcher = vi.fn().mockResolvedValue(mockEntity);

      const { result } = renderHook(() =>
        useEntityLookup({
          service: 'computed-unavailable-service',
          entityId: 'entity-123',
          fetcher,
          healthChecker,
        })
      );

      await waitFor(() => {
        expect(result.current.status).toBe('service_unavailable');
      });

      expect(result.current.isServiceAvailable).toBe(false);
    });

    it('entityExists is false when status is not_found', async () => {
      const fetcher = vi.fn().mockRejectedValue(new Error('404'));

      const { result } = renderHook(() =>
        useEntityLookup({
          service: 'computed-notfound-service',
          entityId: 'entity-123',
          fetcher,
          retryCount: 0,
        })
      );

      await waitFor(() => {
        expect(result.current.status).toBe('not_found');
      });

      expect(result.current.entityExists).toBe(false);
    });
  });
});

// ================================================================
// useBatchEntityLookup TESTS
// ================================================================

describe('useBatchEntityLookup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ================================================================
  // BASIC FUNCTIONALITY TESTS
  // ================================================================
  describe('Basic Functionality', () => {
    it('fetches multiple entities', async () => {
      const fetcher = vi.fn().mockImplementation((id: string) => {
        if (id === 'entity-123') return Promise.resolve(mockEntity);
        if (id === 'entity-456') return Promise.resolve(mockEntity2);
        return Promise.reject(new Error('Not found'));
      });

      const { result } = renderHook(() =>
        useBatchEntityLookup({
          service: 'batch-service',
          entityIds: ['entity-123', 'entity-456'],
          fetcher,
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.dataMap.size).toBe(2);
      expect(result.current.getData('entity-123')).toEqual(mockEntity);
      expect(result.current.getData('entity-456')).toEqual(mockEntity2);
    });

    it('filters out null and undefined entityIds', async () => {
      const serviceName = uniqueId('batch-filter');
      const entityId1 = uniqueId('entity');
      const entityId2 = uniqueId('entity');
      const fetcher = vi.fn().mockResolvedValue(mockEntity);

      const { result } = renderHook(() =>
        useBatchEntityLookup({
          service: serviceName,
          entityIds: [entityId1, null, undefined, entityId2],
          fetcher,
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Only 2 valid IDs - check that both were fetched
      expect(result.current.dataMap.size).toBe(2);
      expect(result.current.getData(entityId1)).toBeTruthy();
      expect(result.current.getData(entityId2)).toBeTruthy();
      // Verify fetcher was called with both valid IDs
      expect(fetcher).toHaveBeenCalledWith(entityId1);
      expect(fetcher).toHaveBeenCalledWith(entityId2);
    });

    it('does not fetch when entityIds array is empty', async () => {
      const fetcher = vi.fn().mockResolvedValue(mockEntity);

      const { result } = renderHook(() =>
        useBatchEntityLookup({
          service: 'batch-empty-service',
          entityIds: [],
          fetcher,
        })
      );

      expect(result.current.isLoading).toBe(false);
      expect(fetcher).not.toHaveBeenCalled();
    });
  });

  // ================================================================
  // STATUS MAP TESTS
  // ================================================================
  describe('Status Map', () => {
    it('sets success status for successfully fetched entities', async () => {
      const fetcher = vi.fn().mockResolvedValue(mockEntity);

      const { result } = renderHook(() =>
        useBatchEntityLookup({
          service: 'batch-status-service',
          entityIds: ['entity-123'],
          fetcher,
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.getStatus('entity-123')).toBe('success');
    });

    it('sets not_found status for 404 errors', async () => {
      const fetcher = vi.fn().mockRejectedValue(new Error('404 Not Found'));

      const { result } = renderHook(() =>
        useBatchEntityLookup({
          service: 'batch-notfound-service',
          entityIds: ['missing-entity'],
          fetcher,
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.getStatus('missing-entity')).toBe('not_found');
    });

    it('sets error status for other errors', async () => {
      const fetcher = vi.fn().mockRejectedValue(new Error('Unknown error'));

      const { result } = renderHook(() =>
        useBatchEntityLookup({
          service: 'batch-error-service',
          entityIds: ['error-entity'],
          fetcher,
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.getStatus('error-entity')).toBe('error');
    });

    it('returns idle for unknown entity IDs', () => {
      const fetcher = vi.fn().mockResolvedValue(mockEntity);

      const { result } = renderHook(() =>
        useBatchEntityLookup({
          service: 'batch-idle-service',
          entityIds: [],
          fetcher,
        })
      );

      expect(result.current.getStatus('unknown-entity')).toBe('idle');
    });
  });

  // ================================================================
  // HEALTH CHECK TESTS
  // ================================================================
  describe('Health Check', () => {
    it('checks health before batch fetch', async () => {
      const serviceName = uniqueId('batch-health');
      const entityId1 = uniqueId('entity');
      const entityId2 = uniqueId('entity');
      const healthChecker = vi.fn().mockResolvedValue(true);
      const fetcher = vi.fn().mockResolvedValue(mockEntity);

      const { result } = renderHook(() =>
        useBatchEntityLookup({
          service: serviceName,
          entityIds: [entityId1, entityId2],
          fetcher,
          healthChecker,
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Service is available and entities were fetched
      expect(result.current.isServiceAvailable).toBe(true);
      expect(result.current.dataMap.size).toBe(2);
      expect(result.current.getData(entityId1)).toBeTruthy();
      expect(result.current.getData(entityId2)).toBeTruthy();
    });

    it('sets service_unavailable for all entities when health check fails', async () => {
      const serviceName = uniqueId('batch-unhealthy');
      const entityId1 = uniqueId('entity');
      const entityId2 = uniqueId('entity');
      const healthChecker = vi.fn().mockResolvedValue(false);
      const fetcher = vi.fn().mockResolvedValue(mockEntity);

      const { result } = renderHook(() =>
        useBatchEntityLookup({
          service: serviceName,
          entityIds: [entityId1, entityId2],
          fetcher,
          healthChecker,
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isServiceAvailable).toBe(false);
      expect(result.current.getStatus(entityId1)).toBe('service_unavailable');
      expect(result.current.getStatus(entityId2)).toBe('service_unavailable');
    });
  });

  // ================================================================
  // REFETCH ALL TESTS
  // ================================================================
  describe('RefetchAll', () => {
    it('provides refetchAll function', () => {
      const fetcher = vi.fn().mockResolvedValue(mockEntity);

      const { result } = renderHook(() =>
        useBatchEntityLookup({
          service: 'batch-refetch-service',
          entityIds: [],
          fetcher,
        })
      );

      expect(typeof result.current.refetchAll).toBe('function');
    });

    it('refetchAll can be called after initial fetch', async () => {
      const serviceName = uniqueId('batch-refetchall');
      const entityId = uniqueId('entity');
      const fetcher = vi.fn().mockResolvedValue(mockEntity);

      const { result } = renderHook(() =>
        useBatchEntityLookup({
          service: serviceName,
          entityIds: [entityId],
          fetcher,
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Initial fetch completed
      expect(result.current.getData(entityId)).toBeTruthy();
      expect(result.current.getStatus(entityId)).toBe('success');

      // refetchAll should be callable - wrap in act() to handle async state updates
      await act(async () => {
        result.current.refetchAll();
        await Promise.resolve();
      });

      // Wait for refetch to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  // ================================================================
  // GETTER FUNCTIONS TESTS
  // ================================================================
  describe('Getter Functions', () => {
    it('getData returns entity data or null', async () => {
      const serviceName = uniqueId('batch-getdata');
      const entityId = uniqueId('entity');
      const fetcher = vi.fn().mockResolvedValue(mockEntity);

      const { result } = renderHook(() =>
        useBatchEntityLookup({
          service: serviceName,
          entityIds: [entityId],
          fetcher,
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.getData(entityId)).toEqual(mockEntity);
      expect(result.current.getData('unknown')).toBeNull();
    });

    it('getStatus returns status or idle for unknown', async () => {
      const serviceName = uniqueId('batch-getstatus');
      const entityId = uniqueId('entity');
      const fetcher = vi.fn().mockResolvedValue(mockEntity);

      const { result } = renderHook(() =>
        useBatchEntityLookup({
          service: serviceName,
          entityIds: [entityId],
          fetcher,
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.getStatus(entityId)).toBe('success');
      expect(result.current.getStatus('unknown')).toBe('idle');
    });
  });
});
