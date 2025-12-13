/*
 * ================================================================
 * FILE: useServiceFetch.test.ts
 * PATH: /packages/config/src/hooks/useServiceFetch/useServiceFetch.test.ts
 * DESCRIPTION: Unit tests for useServiceFetch hook
 * VERSION: v1.0.0
 * CREATED: 2025-12-11
 * UPDATED: 2025-12-11
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useServiceFetch, SERVICE_CONFIGS } from './useServiceFetch';

// ================================================================
// MOCK DATA
// ================================================================

interface TestData {
  id: string;
  name: string;
}

const mockData: TestData = {
  id: '123',
  name: 'Test Item',
};

const testServiceConfig = {
  baseUrl: 'http://localhost:8000',
  healthEndpoint: '/health',
  healthTimeout: 1000,
  fetchTimeout: 5000,
};

// ================================================================
// MOCK FETCH
// ================================================================

const createMockResponse = (options: {
  ok?: boolean;
  status?: number;
  data?: unknown;
  throwError?: boolean;
  errorMessage?: string;
}) => {
  const { ok = true, status = 200, data = {}, throwError = false, errorMessage } = options;

  if (throwError) {
    return Promise.reject(new Error(errorMessage || 'Network error'));
  }

  return Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(data),
  } as Response);
};

// ================================================================
// useServiceFetch TESTS
// ================================================================

describe('useServiceFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock global fetch
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ================================================================
  // INITIAL STATE TESTS
  // ================================================================
  describe('Initial State', () => {
    it('starts with idle status', () => {
      const { result } = renderHook(() =>
        useServiceFetch({
          service: testServiceConfig,
          endpoint: '/data',
        })
      );

      expect(result.current.status).toBe('idle');
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.statusCode).toBeNull();
    });

    it('isLoading is false initially', () => {
      const { result } = renderHook(() =>
        useServiceFetch({
          service: testServiceConfig,
          endpoint: '/data',
        })
      );

      expect(result.current.isLoading).toBe(false);
    });

    it('isError is false initially', () => {
      const { result } = renderHook(() =>
        useServiceFetch({
          service: testServiceConfig,
          endpoint: '/data',
        })
      );

      expect(result.current.isError).toBe(false);
    });

    it('isSuccess is false initially', () => {
      const { result } = renderHook(() =>
        useServiceFetch({
          service: testServiceConfig,
          endpoint: '/data',
        })
      );

      expect(result.current.isSuccess).toBe(false);
    });

    it('isUnavailable is false initially', () => {
      const { result } = renderHook(() =>
        useServiceFetch({
          service: testServiceConfig,
          endpoint: '/data',
        })
      );

      expect(result.current.isUnavailable).toBe(false);
    });

    it('isNotFound is false initially', () => {
      const { result } = renderHook(() =>
        useServiceFetch({
          service: testServiceConfig,
          endpoint: '/data',
        })
      );

      expect(result.current.isNotFound).toBe(false);
    });

    it('provides fetch function', () => {
      const { result } = renderHook(() =>
        useServiceFetch({
          service: testServiceConfig,
          endpoint: '/data',
        })
      );

      expect(typeof result.current.fetch).toBe('function');
    });

    it('provides reset function', () => {
      const { result } = renderHook(() =>
        useServiceFetch({
          service: testServiceConfig,
          endpoint: '/data',
        })
      );

      expect(typeof result.current.reset).toBe('function');
    });

    it('provides checkHealth function', () => {
      const { result } = renderHook(() =>
        useServiceFetch({
          service: testServiceConfig,
          endpoint: '/data',
        })
      );

      expect(typeof result.current.checkHealth).toBe('function');
    });

    it('provides retry function', () => {
      const { result } = renderHook(() =>
        useServiceFetch({
          service: testServiceConfig,
          endpoint: '/data',
        })
      );

      expect(typeof result.current.retry).toBe('function');
    });
  });

  // ================================================================
  // HEALTH CHECK TESTS
  // ================================================================
  describe('Health Check', () => {
    it('checkHealth returns true when service is healthy', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        createMockResponse({ ok: true, status: 200 })
      );

      const { result } = renderHook(() =>
        useServiceFetch({
          service: testServiceConfig,
          endpoint: '/data',
        })
      );

      let isHealthy: boolean | undefined;
      await act(async () => {
        isHealthy = await result.current.checkHealth();
      });

      expect(isHealthy).toBe(true);
    });

    it('checkHealth returns false when service returns error status', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({}),
        })
      );

      const { result } = renderHook(() =>
        useServiceFetch({
          service: testServiceConfig,
          endpoint: '/data',
        })
      );

      let isHealthy: boolean | undefined;
      await act(async () => {
        isHealthy = await result.current.checkHealth();
      });

      expect(isHealthy).toBe(false);
      expect(result.current.status).toBe('unavailable');
    });

    it('checkHealth returns false on network error', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Network error')
      );

      const { result } = renderHook(() =>
        useServiceFetch({
          service: testServiceConfig,
          endpoint: '/data',
        })
      );

      let isHealthy: boolean | undefined;
      await act(async () => {
        isHealthy = await result.current.checkHealth();
      });

      expect(isHealthy).toBe(false);
      expect(result.current.status).toBe('unavailable');
      expect(result.current.error).toBe('Network error');
    });

    it('sets status to checking during health check', async () => {
      let resolveHealth: (value: Response) => void;
      const healthPromise = new Promise<Response>((resolve) => {
        resolveHealth = resolve;
      });

      (global.fetch as ReturnType<typeof vi.fn>).mockReturnValue(healthPromise);

      const { result } = renderHook(() =>
        useServiceFetch({
          service: testServiceConfig,
          endpoint: '/data',
        })
      );

      // Start health check
      act(() => {
        result.current.checkHealth();
      });

      // Should be checking
      expect(result.current.status).toBe('checking');

      // Complete health check
      await act(async () => {
        if (resolveHealth) {
          resolveHealth({
            ok: true,
            status: 200,
            json: () => Promise.resolve({}),
          } as Response);
        }
      });
    });
  });

  // ================================================================
  // DATA FETCHING TESTS
  // ================================================================
  describe('Data Fetching', () => {
    it('fetches data successfully', async () => {
      (global.fetch as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        }) // health check
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockData),
        }); // data fetch

      const { result } = renderHook(() =>
        useServiceFetch<TestData>({
          service: testServiceConfig,
          endpoint: '/items/123',
        })
      );

      await act(async () => {
        await result.current.fetch();
      });

      expect(result.current.status).toBe('success');
      expect(result.current.data).toEqual(mockData);
      expect(result.current.isSuccess).toBe(true);
    });

    it('sets isLoading during fetch', async () => {
      let resolveHealth: (value: Response) => void;
      const healthPromise = new Promise<Response>((resolve) => {
        resolveHealth = resolve;
      });

      (global.fetch as ReturnType<typeof vi.fn>).mockReturnValue(healthPromise);

      const { result } = renderHook(() =>
        useServiceFetch({
          service: testServiceConfig,
          endpoint: '/data',
        })
      );

      // Start fetch
      act(() => {
        result.current.fetch();
      });

      expect(result.current.isLoading).toBe(true);

      // Cleanup
      await act(async () => {
        if (resolveHealth) {
          resolveHealth({
            ok: false,
            status: 500,
            json: () => Promise.resolve({}),
          } as Response);
        }
      });
    });

    it('applies transform function', async () => {
      const rawData = { id: '123', fullName: 'Test User' };

      (global.fetch as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve(rawData),
        });

      const transform = (data: unknown) => ({
        ...(data as typeof rawData),
        name: (data as typeof rawData).fullName,
      });

      const { result } = renderHook(() =>
        useServiceFetch({
          service: testServiceConfig,
          endpoint: '/users/123',
          transform,
        })
      );

      await act(async () => {
        await result.current.fetch();
      });

      expect(result.current.data).toHaveProperty('name', 'Test User');
    });

    it('skips health check when skipHealthCheck is true', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
      });

      const { result } = renderHook(() =>
        useServiceFetch<TestData>({
          service: { ...testServiceConfig, skipHealthCheck: true },
          endpoint: '/items/123',
        })
      );

      await act(async () => {
        await result.current.fetch();
      });

      // Only data fetch, no health check
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(result.current.status).toBe('success');
    });
  });

  // ================================================================
  // ERROR HANDLING TESTS
  // ================================================================
  describe('Error Handling', () => {
    it('sets status to notFound on 404', async () => {
      (global.fetch as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: () => Promise.resolve({ detail: 'Not found' }),
        });

      const { result } = renderHook(() =>
        useServiceFetch({
          service: testServiceConfig,
          endpoint: '/items/999',
        })
      );

      await act(async () => {
        await result.current.fetch();
      });

      expect(result.current.status).toBe('notFound');
      expect(result.current.isNotFound).toBe(true);
      expect(result.current.statusCode).toBe(404);
    });

    it('sets status to unavailable on 503', async () => {
      (global.fetch as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 503,
          json: () => Promise.resolve({}),
        });

      const { result } = renderHook(() =>
        useServiceFetch({
          service: testServiceConfig,
          endpoint: '/items/123',
        })
      );

      await act(async () => {
        await result.current.fetch();
      });

      expect(result.current.status).toBe('unavailable');
      expect(result.current.isUnavailable).toBe(true);
      expect(result.current.statusCode).toBe(503);
    });

    it('sets status to error on other HTTP errors', async () => {
      (global.fetch as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ detail: 'Internal error' }),
        });

      const { result } = renderHook(() =>
        useServiceFetch({
          service: testServiceConfig,
          endpoint: '/items/123',
        })
      );

      await act(async () => {
        await result.current.fetch();
      });

      expect(result.current.status).toBe('error');
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe('Internal error');
    });

    it('sets status to unavailable on network error with Failed to fetch', async () => {
      (global.fetch as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        })
        .mockRejectedValueOnce(new Error('Failed to fetch'));

      const { result } = renderHook(() =>
        useServiceFetch({
          service: testServiceConfig,
          endpoint: '/items/123',
        })
      );

      await act(async () => {
        await result.current.fetch();
      });

      expect(result.current.status).toBe('unavailable');
      expect(result.current.isUnavailable).toBe(true);
    });

    it('returns null when health check fails', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      });

      const { result } = renderHook(() =>
        useServiceFetch({
          service: testServiceConfig,
          endpoint: '/items/123',
        })
      );

      let fetchResult: unknown;
      await act(async () => {
        fetchResult = await result.current.fetch();
      });

      expect(fetchResult).toBeNull();
      expect(result.current.status).toBe('unavailable');
    });
  });

  // ================================================================
  // RESET METHOD TESTS
  // ================================================================
  describe('Reset Method', () => {
    it('reset returns state to idle', async () => {
      (global.fetch as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockData),
        });

      const { result } = renderHook(() =>
        useServiceFetch<TestData>({
          service: testServiceConfig,
          endpoint: '/items/123',
        })
      );

      // Fetch data
      await act(async () => {
        await result.current.fetch();
      });

      expect(result.current.status).toBe('success');
      expect(result.current.data).not.toBeNull();

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.status).toBe('idle');
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.statusCode).toBeNull();
    });
  });

  // ================================================================
  // RETRY METHOD TESTS
  // ================================================================
  describe('Retry Method', () => {
    it('retry triggers new fetch', async () => {
      (global.fetch as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: () => Promise.resolve({}),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockData),
        });

      const { result } = renderHook(() =>
        useServiceFetch<TestData>({
          service: testServiceConfig,
          endpoint: '/items/123',
        })
      );

      // First fetch fails
      await act(async () => {
        await result.current.fetch();
      });

      expect(result.current.status).toBe('error');

      // Retry succeeds
      await act(async () => {
        await result.current.retry();
      });

      expect(result.current.status).toBe('success');
      expect(result.current.data).toEqual(mockData);
    });
  });

  // ================================================================
  // SERVICE CONFIGS TESTS
  // ================================================================
  describe('SERVICE_CONFIGS', () => {
    it('has contacts service config', () => {
      expect(SERVICE_CONFIGS.contacts).toBeDefined();
      expect(SERVICE_CONFIGS.contacts.healthEndpoint).toBe('/health');
    });

    it('has issues service config', () => {
      expect(SERVICE_CONFIGS.issues).toBeDefined();
      expect(SERVICE_CONFIGS.issues.healthEndpoint).toBe('/health');
    });

    it('has config service config', () => {
      expect(SERVICE_CONFIGS.config).toBeDefined();
      expect(SERVICE_CONFIGS.config.healthEndpoint).toBe('/health');
    });

    it('has minio service config', () => {
      expect(SERVICE_CONFIGS.minio).toBeDefined();
      expect(SERVICE_CONFIGS.minio.healthEndpoint).toBe('/minio/health/live');
    });
  });

  // ================================================================
  // HELPER BOOLEANS TESTS
  // ================================================================
  describe('Helper Booleans', () => {
    it('isLoading is true when status is checking', async () => {
      let resolveHealth: (value: Response) => void;
      const healthPromise = new Promise<Response>((resolve) => {
        resolveHealth = resolve;
      });

      (global.fetch as ReturnType<typeof vi.fn>).mockReturnValue(healthPromise);

      const { result } = renderHook(() =>
        useServiceFetch({
          service: testServiceConfig,
          endpoint: '/data',
        })
      );

      act(() => {
        result.current.checkHealth();
      });

      expect(result.current.status).toBe('checking');
      expect(result.current.isLoading).toBe(true);

      // Cleanup
      await act(async () => {
        if (resolveHealth) {
          resolveHealth({
            ok: true,
            status: 200,
            json: () => Promise.resolve({}),
          } as Response);
        }
      });
    });

    it('isLoading is true when status is loading', async () => {
      let resolveData: (value: Response) => void;
      const dataPromise = new Promise<Response>((resolve) => {
        resolveData = resolve;
      });

      (global.fetch as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        })
        .mockReturnValueOnce(dataPromise);

      const { result } = renderHook(() =>
        useServiceFetch({
          service: testServiceConfig,
          endpoint: '/data',
        })
      );

      act(() => {
        result.current.fetch();
      });

      // Wait for health check to complete
      await waitFor(() => {
        expect(result.current.status).toBe('loading');
      });

      expect(result.current.isLoading).toBe(true);

      // Cleanup
      await act(async () => {
        if (resolveData) {
          resolveData({
            ok: true,
            status: 200,
            json: () => Promise.resolve(mockData),
          } as Response);
        }
      });
    });

    it('all helper booleans are correctly computed', async () => {
      (global.fetch as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockData),
        });

      const { result } = renderHook(() =>
        useServiceFetch<TestData>({
          service: testServiceConfig,
          endpoint: '/items/123',
        })
      );

      await act(async () => {
        await result.current.fetch();
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isUnavailable).toBe(false);
      expect(result.current.isNotFound).toBe(false);
    });
  });
});
