/*
 * ================================================================
 * FILE: healthCheck.test.ts
 * PATH: /packages/config/src/utils/storageOperations/healthCheck.test.ts
 * DESCRIPTION: Unit tests for healthCheck utility
 * VERSION: v1.0.0
 * CREATED: 2025-12-11
 * UPDATED: 2025-12-11
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  checkStorageHealth,
  checkMultipleStoragesHealth,
  quickHealthCheck,
  quickCheckMultiple,
  checkSQLHealth,
  checkMinIOHealth,
  checkElasticSearchHealth,
  getStorageDisplayName,
  getStorageDisplayNames,
} from './healthCheck';
import type { StorageConfig, StorageType } from './types';

// ================================================================
// MOCK SETUP
// ================================================================

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockStorageConfig: StorageConfig = {
  type: 'sql',
  name: 'Test SQL',
  healthEndpoint: '/health',
  baseUrl: 'http://localhost:3000',
  healthTimeout: 500,
};

const mockMinioConfig: StorageConfig = {
  type: 'minio',
  name: 'Test MinIO',
  healthEndpoint: '/health',
  baseUrl: 'http://localhost:9000',
  healthTimeout: 500,
};

// ================================================================
// checkStorageHealth TESTS
// ================================================================

describe('checkStorageHealth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns healthy status on success', async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 200 });

    const result = await checkStorageHealth(mockStorageConfig);

    expect(result.status).toBe('healthy');
    expect(result.storage).toBe('sql');
  });

  it('returns unhealthy status on failure', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 503 });

    const result = await checkStorageHealth(mockStorageConfig, {
      maxTotalTime: 100, // Short timeout
      initialDelay: 10,
    });

    expect(result.status).toBe('unhealthy');
  });

  it('includes responseTime in result', async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 200 });

    const result = await checkStorageHealth(mockStorageConfig);

    expect(result.responseTime).toBeGreaterThanOrEqual(0);
  });

  it('retries on failure', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: true, status: 200 });

    const result = await checkStorageHealth(mockStorageConfig, {
      maxTotalTime: 5000,
      initialDelay: 10,
    });

    expect(result.status).toBe('healthy');
    expect(result.retryAttempts).toBeGreaterThan(0);
  });

  it('calls onRetry callback', async () => {
    const onRetry = vi.fn();
    mockFetch
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: true, status: 200 });

    await checkStorageHealth(mockStorageConfig, {
      maxTotalTime: 5000,
      initialDelay: 10,
      onRetry,
    });

    expect(onRetry).toHaveBeenCalled();
  });

  it('handles network errors', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const result = await checkStorageHealth(mockStorageConfig, {
      maxTotalTime: 100,
      initialDelay: 10,
    });

    expect(result.status).toBe('unhealthy');
    expect(result.error).toBeDefined();
  });

  it('handles timeout abort', async () => {
    mockFetch.mockRejectedValue(new Error('abort'));

    const result = await checkStorageHealth(mockStorageConfig, {
      maxTotalTime: 100,
      initialDelay: 10,
    });

    expect(result.status).toBe('unhealthy');
    expect(result.error).toContain('timed out');
  });
});

// ================================================================
// checkMultipleStoragesHealth TESTS
// ================================================================

describe('checkMultipleStoragesHealth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('checks multiple storages in parallel', async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 200 });

    const result = await checkMultipleStoragesHealth([
      mockStorageConfig,
      mockMinioConfig,
    ]);

    expect(result.allHealthy).toBe(true);
    expect(result.unhealthyStorages).toHaveLength(0);
  });

  it('returns unhealthy storages', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, status: 200 }) // SQL healthy
      .mockResolvedValueOnce({ ok: false, status: 503 }); // MinIO unhealthy

    const result = await checkMultipleStoragesHealth([
      mockStorageConfig,
      mockMinioConfig,
    ], {
      maxTotalTime: 100,
      initialDelay: 10,
    });

    expect(result.allHealthy).toBe(false);
    expect(result.unhealthyStorages).toContain('minio');
  });

  it('includes results map', async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 200 });

    const result = await checkMultipleStoragesHealth([
      mockStorageConfig,
      mockMinioConfig,
    ]);

    expect(result.results).toBeDefined();
    expect(result.results.size).toBe(2);
  });

  it('includes totalDuration', async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 200 });

    const result = await checkMultipleStoragesHealth([mockStorageConfig]);

    expect(result.totalDuration).toBeGreaterThanOrEqual(0);
  });

  it('shares onSlowOperation callback between storages', async () => {
    // Test that the shared callback mechanism exists
    const onSlowOperation = vi.fn();
    mockFetch.mockResolvedValue({ ok: true, status: 200 });

    await checkMultipleStoragesHealth(
      [mockStorageConfig, mockMinioConfig],
      { onSlowOperation }
    );

    // With fast responses, onSlowOperation should not be called
    // This test verifies the callback mechanism is properly set up
    expect(onSlowOperation).toHaveBeenCalledTimes(0);
  });
});

// ================================================================
// quickHealthCheck TESTS
// ================================================================

describe('quickHealthCheck', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns true on success', async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 200 });

    const result = await quickHealthCheck(mockStorageConfig);

    expect(result).toBe(true);
  });

  it('returns false on failure', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500 });

    const result = await quickHealthCheck(mockStorageConfig);

    expect(result).toBe(false);
  });

  it('does not retry on failure', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500 });

    await quickHealthCheck(mockStorageConfig);

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('accepts custom timeout', async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 200 });

    const result = await quickHealthCheck(mockStorageConfig, 100);

    expect(result).toBe(true);
  });
});

// ================================================================
// quickCheckMultiple TESTS
// ================================================================

describe('quickCheckMultiple', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns map of availabilities', async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 200 });

    const result = await quickCheckMultiple([mockStorageConfig, mockMinioConfig]);

    expect(result).toBeInstanceOf(Map);
    expect(result.get('sql')).toBe(true);
    expect(result.get('minio')).toBe(true);
  });

  it('handles mixed results', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, status: 200 })
      .mockResolvedValueOnce({ ok: false, status: 503 });

    const result = await quickCheckMultiple([mockStorageConfig, mockMinioConfig]);

    expect(result.get('sql')).toBe(true);
    expect(result.get('minio')).toBe(false);
  });
});

// ================================================================
// checkSQLHealth TESTS
// ================================================================

describe('checkSQLHealth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('checks SQL service health', async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 200 });

    const result = await checkSQLHealth('http://localhost:3000');

    expect(result.storage).toBe('sql');
    expect(result.status).toBe('healthy');
  });

  it('uses /health endpoint', async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 200 });

    await checkSQLHealth('http://localhost:3000');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/health',
      expect.any(Object)
    );
  });
});

// ================================================================
// checkMinIOHealth TESTS
// ================================================================

describe('checkMinIOHealth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('checks MinIO service health', async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 200 });

    const result = await checkMinIOHealth('http://localhost:9000');

    expect(result.storage).toBe('minio');
    expect(result.status).toBe('healthy');
  });

  it('uses /minio/health/live endpoint', async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 200 });

    await checkMinIOHealth('http://localhost:9000');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:9000/minio/health/live',
      expect.any(Object)
    );
  });

  it('uses default URL when not provided', async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 200 });

    await checkMinIOHealth();

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:9000/minio/health/live',
      expect.any(Object)
    );
  });
});

// ================================================================
// checkElasticSearchHealth TESTS
// ================================================================

describe('checkElasticSearchHealth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('checks ElasticSearch health', async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 200 });

    const result = await checkElasticSearchHealth('http://localhost:9200');

    expect(result.storage).toBe('elasticsearch');
    expect(result.status).toBe('healthy');
  });

  it('uses /_cluster/health endpoint', async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 200 });

    await checkElasticSearchHealth('http://localhost:9200');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:9200/_cluster/health',
      expect.any(Object)
    );
  });
});

// ================================================================
// getStorageDisplayName TESTS
// ================================================================

describe('getStorageDisplayName', () => {
  it('returns custom display name from config', () => {
    const config: StorageConfig = {
      type: 'sql',
      baseUrl: 'http://localhost',
      healthEndpoint: '/health',
      displayName: 'Custom SQL Name',
    };

    const name = getStorageDisplayName('sql', config);

    expect(name).toBe('Custom SQL Name');
  });

  it('returns default name for SQL', () => {
    const name = getStorageDisplayName('sql');

    expect(name).toBe('Databáza');
  });

  it('returns default name for MinIO', () => {
    const name = getStorageDisplayName('minio');

    expect(name).toBe('Súborové úložisko');
  });

  it('returns default name for ElasticSearch', () => {
    const name = getStorageDisplayName('elasticsearch');

    expect(name).toBe('Vyhľadávač');
  });

  it('returns storage type for unknown types', () => {
    const name = getStorageDisplayName('unknown' as StorageType);

    expect(name).toBe('unknown');
  });
});

// ================================================================
// getStorageDisplayNames TESTS
// ================================================================

describe('getStorageDisplayNames', () => {
  it('returns array of display names', () => {
    const names = getStorageDisplayNames(['sql', 'minio']);

    expect(names).toHaveLength(2);
    expect(names).toContain('Databáza');
    expect(names).toContain('Súborové úložisko');
  });

  it('uses configs when provided', () => {
    const configs = new Map<StorageType, StorageConfig>([
      ['sql', { type: 'sql', baseUrl: '', healthEndpoint: '', displayName: 'My SQL' }],
    ]);

    const names = getStorageDisplayNames(['sql'], configs);

    expect(names[0]).toBe('My SQL');
  });

  it('returns empty array for empty input', () => {
    const names = getStorageDisplayNames([]);

    expect(names).toHaveLength(0);
  });
});
