/*
 * ================================================================
 * FILE: useServiceFetch.ts
 * PATH: /packages/config/src/hooks/useServiceFetch/useServiceFetch.ts
 * DESCRIPTION: Universal hook for service availability check + data fetching
 *              Handles: health check → fetch data → error states
 * VERSION: v1.0.0
 * CREATED: 2025-11-29
 * UPDATED: 2025-11-29
 * ================================================================
 */

import { useState, useCallback } from 'react';

// ============================================================
// TYPES
// ============================================================

/**
 * Service fetch status
 * - idle: Not started
 * - checking: Checking service health
 * - unavailable: Service is down (503, network error)
 * - loading: Fetching data from service
 * - success: Data fetched successfully
 * - notFound: Resource not found (404) - deleted or doesn't exist
 * - error: Other error occurred
 */
export type ServiceFetchStatus =
  | 'idle'
  | 'checking'
  | 'unavailable'
  | 'loading'
  | 'success'
  | 'notFound'
  | 'error';

export interface ServiceFetchState<T> {
  status: ServiceFetchStatus;
  data: T | null;
  error: string | null;
  /** HTTP status code if available */
  statusCode: number | null;
}

export interface ServiceConfig {
  /** Base URL of the service (e.g., 'http://localhost:8105') */
  baseUrl: string;
  /** Health endpoint path (default: '/health') */
  healthEndpoint?: string;
  /** Timeout for health check in ms (default: 5000) */
  healthTimeout?: number;
  /** Timeout for data fetch in ms (default: 30000) */
  fetchTimeout?: number;
  /** Skip health check and fetch directly (default: false) */
  skipHealthCheck?: boolean;
}

export interface UseServiceFetchOptions<T> {
  /** Service configuration */
  service: ServiceConfig;
  /** Data endpoint path (e.g., '/contacts/123') */
  endpoint: string;
  /** Transform response data (optional) */
  transform?: (data: unknown) => T;
  /** Fetch immediately on mount (default: false) */
  immediate?: boolean;
}

export interface UseServiceFetchReturn<T> extends ServiceFetchState<T> {
  /** Trigger fetch manually */
  fetch: () => Promise<T | null>;
  /** Reset state to idle */
  reset: () => void;
  /** Check if service is available (without fetching data) */
  checkHealth: () => Promise<boolean>;
  /** Retry after error */
  retry: () => Promise<T | null>;
  /** Loading states helpers */
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  isUnavailable: boolean;
  isNotFound: boolean;
}

// ============================================================
// HOOK IMPLEMENTATION
// ============================================================

/**
 * Universal hook for service availability check + data fetching
 *
 * Workflow:
 * 1. Check service health endpoint
 * 2. If healthy, fetch data from endpoint
 * 3. Handle various error states (unavailable, notFound, error)
 *
 * @example
 * ```tsx
 * const { data, status, fetch, isLoading, isUnavailable, isNotFound } = useServiceFetch<Contact>({
 *   service: {
 *     baseUrl: 'http://localhost:8101',
 *     healthEndpoint: '/health',
 *   },
 *   endpoint: `/contacts/${contactId}`,
 * });
 *
 * // Trigger fetch
 * await fetch();
 *
 * // Check states
 * if (isUnavailable) return <ServiceUnavailable />;
 * if (isNotFound) return <ContactDeleted />;
 * if (isLoading) return <Spinner />;
 * if (data) return <ContactCard contact={data} />;
 * ```
 */
export function useServiceFetch<T = unknown>(
  options: UseServiceFetchOptions<T>
): UseServiceFetchReturn<T> {
  const {
    service,
    endpoint,
    transform,
  } = options;

  const {
    baseUrl,
    healthEndpoint = '/health',
    healthTimeout = 5000,
    fetchTimeout = 30000,
    skipHealthCheck = false,
  } = service;

  // State
  const [state, setState] = useState<ServiceFetchState<T>>({
    status: 'idle',
    data: null,
    error: null,
    statusCode: null,
  });

  /**
   * Check if service is available
   */
  const checkHealth = useCallback(async (): Promise<boolean> => {
    setState(prev => ({ ...prev, status: 'checking', error: null }));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), healthTimeout);

      const response = await fetch(`${baseUrl}${healthEndpoint}`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return true;
      }

      // Service returned error status
      setState({
        status: 'unavailable',
        data: null,
        error: `Service returned status ${response.status}`,
        statusCode: response.status,
      });
      return false;
    } catch (error) {
      // Network error or timeout
      const errorMessage = error instanceof Error ? error.message : 'Network error';
      setState({
        status: 'unavailable',
        data: null,
        error: errorMessage,
        statusCode: null,
      });
      return false;
    }
  }, [baseUrl, healthEndpoint, healthTimeout]);

  /**
   * Fetch data from service
   */
  const fetchData = useCallback(async (): Promise<T | null> => {
    // Step 1: Health check (unless skipped)
    if (!skipHealthCheck) {
      const isHealthy = await checkHealth();
      if (!isHealthy) {
        return null;
      }
    }

    // Step 2: Fetch data
    setState(prev => ({ ...prev, status: 'loading', error: null }));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle different status codes
      if (response.ok) {
        const rawData = await response.json();
        const data = transform ? transform(rawData) : (rawData as T);

        setState({
          status: 'success',
          data,
          error: null,
          statusCode: response.status,
        });
        return data;
      }

      // 404 - Resource not found
      if (response.status === 404) {
        setState({
          status: 'notFound',
          data: null,
          error: 'Resource not found - may be deleted or does not exist',
          statusCode: 404,
        });
        return null;
      }

      // 503 - Service unavailable
      if (response.status === 503) {
        setState({
          status: 'unavailable',
          data: null,
          error: 'Service temporarily unavailable',
          statusCode: 503,
        });
        return null;
      }

      // Other errors
      let errorMessage = `Request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch {
        // Ignore JSON parse errors
      }

      setState({
        status: 'error',
        data: null,
        error: errorMessage,
        statusCode: response.status,
      });
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Check if it's a network error (service unavailable)
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        setState({
          status: 'unavailable',
          data: null,
          error: 'Service is not reachable',
          statusCode: null,
        });
      } else {
        setState({
          status: 'error',
          data: null,
          error: errorMessage,
          statusCode: null,
        });
      }
      return null;
    }
  }, [baseUrl, endpoint, skipHealthCheck, checkHealth, fetchTimeout, transform]);

  /**
   * Reset state to idle
   */
  const reset = useCallback(() => {
    setState({
      status: 'idle',
      data: null,
      error: null,
      statusCode: null,
    });
  }, []);

  /**
   * Retry fetch after error
   */
  const retry = useCallback(async (): Promise<T | null> => {
    return fetchData();
  }, [fetchData]);

  // Computed helpers
  const isLoading = state.status === 'checking' || state.status === 'loading';
  const isError = state.status === 'error';
  const isSuccess = state.status === 'success';
  const isUnavailable = state.status === 'unavailable';
  const isNotFound = state.status === 'notFound';

  return {
    ...state,
    fetch: fetchData,
    reset,
    checkHealth,
    retry,
    isLoading,
    isError,
    isSuccess,
    isUnavailable,
    isNotFound,
  };
}

// ============================================================
// SERVICE CONFIGURATIONS (Pre-defined for L-KERN services)
// ============================================================

/**
 * Pre-defined service configurations
 * Use these with useServiceFetch for consistent service access
 */
export const SERVICE_CONFIGS = {
  contacts: {
    baseUrl: import.meta.env.VITE_CONTACTS_SERVICE_URL || 'http://localhost:8101',
    healthEndpoint: '/health',
  },
  issues: {
    baseUrl: import.meta.env.VITE_ISSUES_SERVICE_URL || 'http://localhost:8105',
    healthEndpoint: '/health',
  },
  config: {
    baseUrl: import.meta.env.VITE_CONFIG_SERVICE_URL || 'http://localhost:8102',
    healthEndpoint: '/health',
  },
  minio: {
    baseUrl: import.meta.env.VITE_MINIO_URL || 'http://localhost:9000',
    healthEndpoint: '/minio/health/live',
  },
} as const;

export type ServiceName = keyof typeof SERVICE_CONFIGS;
