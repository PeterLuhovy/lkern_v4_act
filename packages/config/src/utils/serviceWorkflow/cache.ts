/*
 * ================================================================
 * FILE: cache.ts
 * PATH: /packages/config/src/utils/serviceWorkflow/cache.ts
 * DESCRIPTION: Lightweight in-memory cache with TTL for serviceWorkflow
 * VERSION: v1.0.0
 * CREATED: 2025-12-10
 * UPDATED: 2025-12-10
 * ================================================================
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

/**
 * Simple in-memory cache with TTL support.
 * Automatically cleans up expired entries.
 */
class ServiceWorkflowCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Auto-cleanup expired entries every 60 seconds
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Generate cache key from endpoint, method, and optional data.
   * Uses SHA-256 for secure hashing (prevents cache poisoning).
   */
  async generateKey(endpoint: string, method: string, data?: unknown): Promise<string> {
    if (!data) {
      return `${method}:${endpoint}`;
    }

    // Use SHA-256 for secure hashing (prevents collision attacks)
    const dataStr = JSON.stringify(data);
    const hash = await this.sha256Hash(dataStr);
    return `${method}:${endpoint}:${hash}`;
  }

  /**
   * SHA-256 hash function using Web Crypto API.
   * Secure against collision attacks (unlike simple hash).
   */
  private async sha256Hash(str: string): Promise<string> {
    // Convert string to Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(str);

    // Hash with SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
  }

  /**
   * Get cached value if exists and not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return null;
    }

    // Check expiration
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set cache value with TTL
   */
  set<T>(key: string, data: T, ttl: number): void {
    const expiresAt = Date.now() + ttl;
    this.cache.set(key, { data, expiresAt });
  }

  /**
   * Invalidate (delete) cache entry
   */
  invalidate(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Invalidate all cache entries matching pattern
   * @param pattern - RegExp pattern to match keys
   */
  invalidatePattern(pattern: RegExp, debug = false): number {
    const allKeys = Array.from(this.cache.keys());

    if (debug) {
      console.log('[ServiceWorkflowCache.invalidatePattern] Starting invalidation...');
      console.log(`  Pattern: ${pattern}`);
      console.log(`  Cache size: ${this.cache.size}`);
      console.log(`  All keys:`, allKeys);
    }

    let count = 0;
    const matchedKeys: string[] = [];
    const unmatchedKeys: string[] = [];

    for (const key of allKeys) {
      const matches = pattern.test(key);

      if (debug) {
        console.log(`  Testing key: "${key}" → ${matches ? '✅ MATCH' : '❌ NO MATCH'}`);
      }

      if (matches) {
        this.cache.delete(key);
        matchedKeys.push(key);
        count++;
      } else {
        unmatchedKeys.push(key);
      }
    }

    if (debug) {
      console.log(`[ServiceWorkflowCache.invalidatePattern] Results:`);
      console.log(`  ✅ Matched (deleted): ${matchedKeys.length}`, matchedKeys);
      console.log(`  ❌ Unmatched: ${unmatchedKeys.length}`, unmatchedKeys);
      console.log(`  Cache size after: ${this.cache.size}`);
    }

    return count;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`[ServiceWorkflowCache] Cleaned up ${cleaned} expired entries`);
    }
  }

  /**
   * Destroy cache (clear interval)
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clear();
  }
}

// Singleton instance
export const workflowCache = new ServiceWorkflowCache();

// Export to window for debugging (development only)
// Access via: window.workflowCache.getStats()
if (typeof window !== 'undefined') {
  (window as unknown as { workflowCache: ServiceWorkflowCache }).workflowCache = workflowCache;
}
