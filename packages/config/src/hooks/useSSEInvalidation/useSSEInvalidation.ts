/*
 * ================================================================
 * FILE: useSSEInvalidation.ts
 * PATH: /packages/config/src/hooks/useSSEInvalidation/useSSEInvalidation.ts
 * DESCRIPTION: React hook for SSE cache invalidation
 * VERSION: v1.0.0
 * CREATED: 2025-12-10
 * UPDATED: 2025-12-10
 * ================================================================
 */

import { useEffect, useRef } from 'react';
import { workflowCache } from '../../utils/serviceWorkflow/cache';
import { useAnalyticsSettings } from '../../contexts/AnalyticsContext/AnalyticsContext';

interface SSECacheInvalidateEvent {
  resource: string;
  action: 'created' | 'updated' | 'deleted' | 'restored';
  id?: string;
  timestamp: string;
}

interface UseSSEInvalidationOptions {
  /**
   * SSE endpoint URL.
   * Default: '/api/issues/events'
   */
  endpoint?: string;

  /**
   * Enable debug logging.
   * Default: false
   */
  debug?: boolean;

  /**
   * Auto-reconnect on disconnect.
   * Default: true
   */
  autoReconnect?: boolean;

  /**
   * Reconnect delay in milliseconds.
   * Default: 3000 (3 seconds)
   */
  reconnectDelay?: number;
}

/**
 * React hook for SSE-based cache invalidation.
 * Connects to backend SSE endpoint and invalidates cache on data mutations.
 *
 * @example
 * ```tsx
 * // In App.tsx (global setup)
 * function App() {
 *   useSSEInvalidation({ debug: true });
 *   return <YourApp />;
 * }
 * ```
 */
export function useSSEInvalidation(options: UseSSEInvalidationOptions = {}) {
  const {
    endpoint = 'http://localhost:4105/issues/events',
    debug: debugOverride,
    autoReconnect = true,
    reconnectDelay = 3000,
  } = options;

  const analyticsSettings = useAnalyticsSettings();
  const debug = debugOverride ?? analyticsSettings.logSSEInvalidation;

  // Use ref so event handlers always read current debug value (avoids stale closure)
  const debugRef = useRef(debug);
  debugRef.current = debug;

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const log = (message: string, data?: unknown) => {
    if (!debugRef.current) return;
    console.log(`[useSSEInvalidation] ${message}`, data || '');
  };

  const connectSSE = () => {
    // Clean up existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // Clear reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    log('Connecting to SSE endpoint...', endpoint);

    const eventSource = new EventSource(endpoint);
    eventSourceRef.current = eventSource;

    // Connection opened
    eventSource.addEventListener('connected', (event) => {
      const data = JSON.parse(event.data);
      log('✅ SSE connected', data);
    });

    // Heartbeat (keep-alive)
    eventSource.addEventListener('heartbeat', (event) => {
      const data = JSON.parse(event.data);
      log('💓 Heartbeat', data.timestamp);
    });

    // Cache invalidation event
    eventSource.addEventListener('cache-invalidate', (event) => {
      const data: SSECacheInvalidateEvent = JSON.parse(event.data);
      log('🔄 Cache invalidate event received', data);

      handleCacheInvalidation(data);
    });

    // Error handling
    eventSource.onerror = (error) => {
      log('❌ SSE connection error', error);
      eventSource.close();

      // Auto-reconnect
      if (autoReconnect) {
        log(`Reconnecting in ${reconnectDelay}ms...`);
        reconnectTimeoutRef.current = setTimeout(() => {
          connectSSE();
        }, reconnectDelay);
      }
    };
  };

  const handleCacheInvalidation = (event: SSECacheInvalidateEvent) => {
    const { resource, action, id } = event;

    // Build cache invalidation pattern based on resource
    let pattern: RegExp;

    if (resource === 'issues') {
      // Invalidate all issue-related cache entries
      // Pattern matches: GET:/issues/*, POST:/issues/*, etc.
      // Note: Cache keys use direct endpoint paths without /api prefix
      pattern = /^[A-Z]+:\/issues\//;

      log(`Invalidating cache pattern: ${pattern}`, { resource, action, id });

      // Get cache stats before invalidation
      const statsBefore = workflowCache.getStats();
      log(`📊 Cache before invalidation:`, statsBefore);

      const invalidatedCount = workflowCache.invalidatePattern(pattern, debugRef.current);

      // Get cache stats after invalidation
      const statsAfter = workflowCache.getStats();
      log(`📊 Cache after invalidation:`, statsAfter);
      log(`✅ Invalidated ${invalidatedCount} cache entries`);
    } else {
      log(`⚠️ Unknown resource type: ${resource}`, event);
    }
  };

  useEffect(() => {
    // Connect to SSE on mount
    connectSSE();

    // Cleanup on unmount
    return () => {
      log('Disconnecting SSE...');

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [endpoint]); // Only reconnect if endpoint changes

  return {
    isConnected: eventSourceRef.current?.readyState === EventSource.OPEN,
  };
}
