/*
 * ================================================================
 * FILE: useEntityLookup.ts
 * PATH: /packages/config/src/hooks/useEntityLookup/useEntityLookup.ts
 * DESCRIPTION: Universal hook for fetching entities from external services
 *              with health check, error handling, and caching
 * VERSION: v1.0.1
 * CREATED: 2025-11-29
 * UPDATED: 2025-12-16
 *
 * FEATURES:
 *   - Service health check before fetch
 *   - Automatic retry on failure
 *   - Entity not found detection
 *   - Caching with TTL
 *   - Loading/error/unavailable states
 *
 * USAGE:
 *   const { data, status, error, refetch } = useEntityLookup({
 *     service: 'contacts',
 *     entityId: assigneeId,
 *     fetcher: (id) => contactsApi.getContact(id),
 *     healthChecker: () => contactsApi.health(),
 *   });
 * ================================================================
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// ============================================================
// TYPES
// ============================================================

/**
 * Status of the entity lookup
 */
export type EntityLookupStatus =
  | 'idle'           // Initial state, no fetch yet
  | 'checking'       // Checking service health
  | 'loading'        // Service healthy, fetching entity
  | 'success'        // Entity fetched successfully
  | 'service_unavailable'  // Service health check failed
  | 'not_found'      // Entity doesn't exist (404)
  | 'error';         // Other error occurred

/**
 * Options for useEntityLookup hook
 */
export interface UseEntityLookupOptions<T> {
  /** Service name (for caching and logging) */
  service: string;

  /** Entity ID to fetch (null = don't fetch) */
  entityId: string | null | undefined;

  /** Function to fetch the entity */
  fetcher: (id: string) => Promise<T>;

  /** Function to check service health (optional) */
  healthChecker?: () => Promise<boolean>;

  /** Cache TTL in milliseconds (default: 5 minutes) */
  cacheTtl?: number;

  /** Enable automatic refetch on mount (default: true) */
  autoFetch?: boolean;

  /** Retry count on failure (default: 1) */
  retryCount?: number;

  /** Retry delay in ms (default: 1000) */
  retryDelay?: number;
}

/**
 * Return type of useEntityLookup hook
 */
export interface UseEntityLookupResult<T> {
  /** Fetched entity data (null if not loaded) */
  data: T | null;

  /** Current status */
  status: EntityLookupStatus;

  /** Error message (if any) */
  error: string | null;

  /** Whether currently loading (checking or loading) */
  isLoading: boolean;

  /** Whether service is available */
  isServiceAvailable: boolean;

  /** Whether entity exists */
  entityExists: boolean;

  /** Manually trigger refetch */
  refetch: () => Promise<void>;

  /** Clear cached data */
  clearCache: () => void;
}

// ============================================================
// CACHE
// ============================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// Global cache (shared across hook instances)
const entityCache = new Map<string, CacheEntry<unknown>>();

function getCacheKey(service: string, entityId: string): string {
  return `${service}:${entityId}`;
}

function getCachedData<T>(service: string, entityId: string): T | null {
  const key = getCacheKey(service, entityId);
  const entry = entityCache.get(key) as CacheEntry<T> | undefined;

  if (!entry) return null;

  // Check if expired
  if (Date.now() > entry.expiresAt) {
    entityCache.delete(key);
    return null;
  }

  return entry.data;
}

function setCachedData<T>(service: string, entityId: string, data: T, ttl: number): void {
  const key = getCacheKey(service, entityId);
  entityCache.set(key, {
    data,
    timestamp: Date.now(),
    expiresAt: Date.now() + ttl,
  });
}

function clearCachedData(service: string, entityId: string): void {
  const key = getCacheKey(service, entityId);
  entityCache.delete(key);
}

// ============================================================
// HOOK
// ============================================================

export function useEntityLookup<T>({
  service,
  entityId,
  fetcher,
  healthChecker,
  cacheTtl = 5 * 60 * 1000, // 5 minutes default
  autoFetch = true,
  retryCount = 1,
  retryDelay = 1000,
}: UseEntityLookupOptions<T>): UseEntityLookupResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<EntityLookupStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  // Track if component is mounted
  const isMounted = useRef(true);

  // Store functions in refs to avoid infinite loops from inline function references
  // This is crucial - inline functions like `(id) => api.get(id)` create new refs on every render
  const fetcherRef = useRef(fetcher);
  const healthCheckerRef = useRef(healthChecker);

  // Update refs when functions change (but don't trigger re-render)
  fetcherRef.current = fetcher;
  healthCheckerRef.current = healthChecker;

  // Fetch function with retry logic
  const fetchEntity = useCallback(async () => {
    if (!entityId) {
      setStatus('idle');
      setData(null);
      return;
    }

    // Check cache first
    const cached = getCachedData<T>(service, entityId);
    if (cached) {
      setData(cached);
      setStatus('success');
      return;
    }

    let attempts = 0;
    const maxAttempts = retryCount + 1;

    while (attempts < maxAttempts) {
      attempts++;

      try {
        // Step 1: Check service health (if healthChecker provided)
        if (healthCheckerRef.current) {
          setStatus('checking');

          const isHealthy = await healthCheckerRef.current();
          if (!isMounted.current) return;

          if (!isHealthy) {
            setStatus('service_unavailable');
            setError(`Service '${service}' is currently unavailable`);
            return;
          }
        }

        // Step 2: Fetch entity
        setStatus('loading');

        const result = await fetcherRef.current(entityId);
        if (!isMounted.current) return;

        // Success - cache and return
        setCachedData(service, entityId, result, cacheTtl);
        setData(result);
        setStatus('success');
        setError(null);
        return;

      } catch (err) {
        if (!isMounted.current) return;

        const errorMessage = err instanceof Error ? err.message : String(err);

        // Check for 404 (not found)
        if (
          errorMessage.includes('404') ||
          errorMessage.toLowerCase().includes('not found') ||
          (err as { status?: number })?.status === 404
        ) {
          setStatus('not_found');
          setError(`Entity not found (may have been deleted)`);
          return;
        }

        // Check for service unavailable
        if (
          errorMessage.includes('503') ||
          errorMessage.toLowerCase().includes('unavailable') ||
          errorMessage.toLowerCase().includes('econnrefused') ||
          (err as { status?: number })?.status === 503
        ) {
          setStatus('service_unavailable');
          setError(`Service '${service}' is currently unavailable`);
          return;
        }

        // Other error - retry if attempts left
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }

        // Max retries reached
        setStatus('error');
        setError(errorMessage);
        return;
      }
    }
  }, [entityId, service, cacheTtl, retryCount, retryDelay]); // Note: fetcher/healthChecker use refs to avoid infinite loops

  // Auto-fetch on mount or entityId change
  useEffect(() => {
    isMounted.current = true;

    if (autoFetch && entityId) {
      fetchEntity();
    }

    return () => {
      isMounted.current = false;
    };
  }, [entityId, autoFetch, fetchEntity]);

  // Clear cache function
  const clearCache = useCallback(() => {
    if (entityId) {
      clearCachedData(service, entityId);
    }
  }, [service, entityId]);

  // Computed values
  const isLoading = status === 'checking' || status === 'loading';
  const isServiceAvailable = status !== 'service_unavailable';
  const entityExists = status !== 'not_found';

  return {
    data,
    status,
    error,
    isLoading,
    isServiceAvailable,
    entityExists,
    refetch: fetchEntity,
    clearCache,
  };
}

// ============================================================
// BATCH LOOKUP HOOK
// ============================================================

/**
 * Options for batch entity lookup
 */
export interface UseBatchEntityLookupOptions<T> {
  service: string;
  entityIds: (string | null | undefined)[];
  fetcher: (id: string) => Promise<T>;
  healthChecker?: () => Promise<boolean>;
  cacheTtl?: number;
}

/**
 * Batch lookup result
 */
export interface UseBatchEntityLookupResult<T> {
  /** Map of entityId -> data */
  dataMap: Map<string, T>;

  /** Map of entityId -> status */
  statusMap: Map<string, EntityLookupStatus>;

  /** Overall loading state */
  isLoading: boolean;

  /** Overall service availability */
  isServiceAvailable: boolean;

  /** Get data for specific entity */
  getData: (id: string) => T | null;

  /** Get status for specific entity */
  getStatus: (id: string) => EntityLookupStatus;

  /** Refetch all entities */
  refetchAll: () => Promise<void>;
}

/**
 * Hook for fetching multiple entities from same service
 */
export function useBatchEntityLookup<T>({
  service,
  entityIds,
  fetcher,
  healthChecker,
  cacheTtl = 5 * 60 * 1000,
}: UseBatchEntityLookupOptions<T>): UseBatchEntityLookupResult<T> {
  const [dataMap, setDataMap] = useState<Map<string, T>>(new Map());
  const [statusMap, setStatusMap] = useState<Map<string, EntityLookupStatus>>(new Map());
  const [isServiceAvailable, setIsServiceAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Store functions in refs to avoid infinite loops from inline function references
  const fetcherRef = useRef(fetcher);
  const healthCheckerRef = useRef(healthChecker);
  fetcherRef.current = fetcher;
  healthCheckerRef.current = healthChecker;

  // Stabilize entityIds array reference to prevent infinite loops
  // Arrays are compared by reference, so [1,2] !== [1,2] even with same values
  const validIds = entityIds.filter((id): id is string => !!id);
  const entityIdsKey = validIds.join(',');

  const fetchAll = useCallback(async () => {
    if (validIds.length === 0) return;

    setIsLoading(true);

    // Check service health first (once for all)
    if (healthCheckerRef.current) {
      try {
        const healthy = await healthCheckerRef.current();
        if (!healthy) {
          setIsServiceAvailable(false);
          const newStatusMap = new Map<string, EntityLookupStatus>();
          validIds.forEach(id => newStatusMap.set(id, 'service_unavailable'));
          setStatusMap(newStatusMap);
          setIsLoading(false);
          return;
        }
      } catch {
        setIsServiceAvailable(false);
        setIsLoading(false);
        return;
      }
    }

    setIsServiceAvailable(true);

    // Fetch each entity
    const newDataMap = new Map<string, T>();
    const newStatusMap = new Map<string, EntityLookupStatus>();

    await Promise.all(
      validIds.map(async (id) => {
        // Check cache
        const cached = getCachedData<T>(service, id);
        if (cached) {
          newDataMap.set(id, cached);
          newStatusMap.set(id, 'success');
          return;
        }

        try {
          const result = await fetcherRef.current(id);
          setCachedData(service, id, result, cacheTtl);
          newDataMap.set(id, result);
          newStatusMap.set(id, 'success');
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          if (errorMessage.includes('404') || errorMessage.toLowerCase().includes('not found')) {
            newStatusMap.set(id, 'not_found');
          } else {
            newStatusMap.set(id, 'error');
          }
        }
      })
    );

    setDataMap(newDataMap);
    setStatusMap(newStatusMap);
    setIsLoading(false);
  }, [entityIdsKey, service, cacheTtl]); // Note: fetcher/healthChecker use refs, validIds derived from entityIdsKey

  useEffect(() => {
    fetchAll();
  }, [entityIdsKey, service]); // Depend on stable key, not fetchAll reference

  const getData = useCallback((id: string) => dataMap.get(id) || null, [dataMap]);
  const getStatus = useCallback((id: string) => statusMap.get(id) || 'idle', [statusMap]);

  return {
    dataMap,
    statusMap,
    isLoading,
    isServiceAvailable,
    getData,
    getStatus,
    refetchAll: fetchAll,
  };
}
