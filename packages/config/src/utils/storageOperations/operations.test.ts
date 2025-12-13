/*
 * ================================================================
 * FILE: operations.test.ts
 * PATH: /packages/config/src/utils/storageOperations/operations.test.ts
 * DESCRIPTION: Unit tests for storage operations (SQL CRUD, MinIO)
 * VERSION: v1.0.0
 * CREATED: 2025-12-11
 * UPDATED: 2025-12-11
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  sqlCreate,
  sqlDelete,
  sqlUpdate,
  minioUpload,
  minioDelete,
  minioExists,
  executeOperation,
  executeBatchOperations,
} from './operations';
import type { StorageConfig, OperationRequest } from './types';

// Mock healthCheck module
vi.mock('./healthCheck', () => ({
  checkMultipleStoragesHealth: vi.fn(),
  checkStorageHealth: vi.fn(),
}));

import { checkMultipleStoragesHealth } from './healthCheck';

// ================================================================
// MOCK SETUP
// ================================================================

const mockFetch = vi.fn();
global.fetch = mockFetch;

// Suppress console output
vi.spyOn(console, 'log').mockImplementation(() => undefined);

const mockStorageConfig: StorageConfig = {
  type: 'sql',
  name: 'Test SQL',
  healthEndpoint: '/health',
  baseUrl: 'http://localhost:3000',
  operationTimeout: 5000,
};

const mockMinioConfig: StorageConfig = {
  type: 'minio',
  name: 'Test MinIO',
  healthEndpoint: '/health',
  baseUrl: 'http://localhost:3001',
  operationTimeout: 5000,
};

// ================================================================
// sqlCreate TESTS
// ================================================================

describe('sqlCreate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates record successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: () => Promise.resolve({ id: '123', name: 'Test' }),
    });

    const result = await sqlCreate(
      mockStorageConfig,
      '/items',
      { name: 'Test' }
    );

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: '123', name: 'Test' });
    expect(result.storage).toBe('sql');
  });

  it('handles 503 unavailable response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      json: () => Promise.resolve({}),
    });

    const result = await sqlCreate(mockStorageConfig, '/items', { name: 'Test' });

    expect(result.success).toBe(false);
    expect(result.statusCode).toBe(503);
    expect(result.error).toContain('unavailable');
  });

  it('handles generic error response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ detail: 'Validation error' }),
    });

    const result = await sqlCreate(mockStorageConfig, '/items', { name: '' });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Validation error');
  });

  it('handles network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await sqlCreate(mockStorageConfig, '/items', { name: 'Test' });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Network error');
  });

  it('verifies created record when verifyFields provided', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: () => Promise.resolve({ id: '123', name: 'Test' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '123', name: 'Test' }),
      });

    const result = await sqlCreate(
      mockStorageConfig,
      '/items',
      { name: 'Test' },
      { name: 'Test' }
    );

    expect(result.success).toBe(true);
    expect(result.verified).toBe(true);
  });
});

// ================================================================
// sqlDelete TESTS
// ================================================================

describe('sqlDelete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deletes record successfully', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, status: 200 }) // Check exists
      .mockResolvedValueOnce({ ok: true, status: 200 }) // Delete
      .mockResolvedValueOnce({ ok: false, status: 404 }); // Verify deleted

    const result = await sqlDelete(mockStorageConfig, '/items', '123');

    expect(result.success).toBe(true);
    expect(result.verified).toBe(true);
  });

  it('returns not found for already deleted record', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

    const result = await sqlDelete(mockStorageConfig, '/items', '123');

    expect(result.success).toBe(false);
    expect(result.statusCode).toBe(404);
    expect(result.error).toContain('not found');
  });

  it('handles 503 on check', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 503 });

    const result = await sqlDelete(mockStorageConfig, '/items', '123');

    expect(result.success).toBe(false);
    expect(result.statusCode).toBe(503);
  });

  it('handles 503 on delete', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, status: 200 }) // Check exists
      .mockResolvedValueOnce({ ok: false, status: 503 }); // Delete fails

    const result = await sqlDelete(mockStorageConfig, '/items', '123');

    expect(result.success).toBe(false);
    expect(result.statusCode).toBe(503);
  });

  it('skips check when force is true', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, status: 200 }) // Delete
      .mockResolvedValueOnce({ ok: false, status: 404 }); // Verify deleted

    const result = await sqlDelete(mockStorageConfig, '/items', '123', true);

    expect(result.success).toBe(true);
    // Only 2 calls (delete + verify), no initial check
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('fails if record still exists after delete', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, status: 200 }) // Check exists
      .mockResolvedValueOnce({ ok: true, status: 200 }) // Delete
      .mockResolvedValueOnce({ ok: true, status: 200 }); // Still exists!

    const result = await sqlDelete(mockStorageConfig, '/items', '123');

    expect(result.success).toBe(false);
    expect(result.verified).toBe(false);
    expect(result.error).toContain('still exists');
  });
});

// ================================================================
// sqlUpdate TESTS
// ================================================================

describe('sqlUpdate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates record successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: '123', name: 'Updated' }),
    });

    const result = await sqlUpdate(
      mockStorageConfig,
      '/items',
      '123',
      { name: 'Updated' }
    );

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: '123', name: 'Updated' });
  });

  it('handles 404 not found', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.resolve({}),
    });

    const result = await sqlUpdate(mockStorageConfig, '/items', '999', { name: 'Test' });

    expect(result.success).toBe(false);
    expect(result.statusCode).toBe(404);
  });

  it('handles 503 unavailable', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      json: () => Promise.resolve({}),
    });

    const result = await sqlUpdate(mockStorageConfig, '/items', '123', { name: 'Test' });

    expect(result.success).toBe(false);
    expect(result.statusCode).toBe(503);
  });

  it('verifies updated fields', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: '123', name: 'Updated' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '123', name: 'Updated' }),
      });

    const result = await sqlUpdate(
      mockStorageConfig,
      '/items',
      '123',
      { name: 'Updated' },
      { name: 'Updated' }
    );

    expect(result.success).toBe(true);
    expect(result.verified).toBe(true);
  });

  it('fails verification on mismatch', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: '123', name: 'Updated' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '123', name: 'Different' }), // Mismatch!
      });

    const result = await sqlUpdate(
      mockStorageConfig,
      '/items',
      '123',
      { name: 'Updated' },
      { name: 'Updated' }
    );

    expect(result.success).toBe(false);
    expect(result.verified).toBe(false);
    expect(result.verificationErrors).toBeDefined();
  });
});

// ================================================================
// minioUpload TESTS
// ================================================================

describe('minioUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uploads file successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ file_name: 'test.pdf', file_path: '/uploads/test.pdf' }),
    });

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const result = await minioUpload(mockMinioConfig, '/upload', file);

    expect(result.success).toBe(true);
    expect(result.data?.fileName).toBe('test.pdf');
    expect(result.storage).toBe('minio');
  });

  it('handles 503 unavailable', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      json: () => Promise.resolve({}),
    });

    const file = new File(['test'], 'test.pdf');
    const result = await minioUpload(mockMinioConfig, '/upload', file);

    expect(result.success).toBe(false);
    expect(result.statusCode).toBe(503);
  });

  it('includes metadata in form data', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ file_name: 'test.pdf', file_path: '/uploads/test.pdf' }),
    });

    const file = new File(['test'], 'test.pdf');
    await minioUpload(mockMinioConfig, '/upload', file, { customKey: 'value' });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'POST' })
    );
  });
});

// ================================================================
// minioDelete TESTS
// ================================================================

describe('minioDelete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deletes file successfully', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 200 });

    const result = await minioDelete(mockMinioConfig, '/files', 'test.pdf');

    expect(result.success).toBe(true);
    expect(result.storage).toBe('minio');
  });

  it('treats 404 as success (file already deleted)', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

    const result = await minioDelete(mockMinioConfig, '/files', 'test.pdf');

    expect(result.success).toBe(true);
  });

  it('handles 503 unavailable', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      json: () => Promise.resolve({}),
    });

    const result = await minioDelete(mockMinioConfig, '/files', 'test.pdf');

    expect(result.success).toBe(false);
    expect(result.statusCode).toBe(503);
  });
});

// ================================================================
// minioExists TESTS
// ================================================================

describe('minioExists', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns true when file exists', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });

    const exists = await minioExists(mockMinioConfig, '/files', 'test.pdf');

    expect(exists).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'HEAD' })
    );
  });

  it('returns false when file does not exist', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

    const exists = await minioExists(mockMinioConfig, '/files', 'nonexistent.pdf');

    expect(exists).toBe(false);
  });

  it('returns false on network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const exists = await minioExists(mockMinioConfig, '/files', 'test.pdf');

    expect(exists).toBe(false);
  });
});

// ================================================================
// executeOperation TESTS
// ================================================================

describe('executeOperation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default healthy storage
    vi.mocked(checkMultipleStoragesHealth).mockResolvedValue({
      allHealthy: true,
      unhealthyStorages: [],
      results: [],
    });
  });

  it('executes read operation', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: '123', name: 'Test' }),
    });

    const result = await executeOperation({
      type: 'read',
      storages: [mockStorageConfig],
      endpoint: '/items/123',
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: '123', name: 'Test' });
  });

  it('executes create operation', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: () => Promise.resolve({ id: '123', name: 'New' }),
    });

    const result = await executeOperation<{ id: string; name: string }>({
      type: 'create',
      storages: [mockStorageConfig],
      endpoint: '/items',
      data: { name: 'New' },
    });

    expect(result.success).toBe(true);
    expect(result.data?.id).toBe('123');
  });

  it('calls onHealthCheckStart callback', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    });

    const onHealthCheckStart = vi.fn();

    await executeOperation(
      { type: 'read', storages: [mockStorageConfig], endpoint: '/items' },
      { onHealthCheckStart }
    );

    expect(onHealthCheckStart).toHaveBeenCalled();
  });

  it('handles unavailable storage', async () => {
    vi.mocked(checkMultipleStoragesHealth).mockResolvedValue({
      allHealthy: false,
      unhealthyStorages: ['sql'],
      results: [],
    });

    const onUnavailable = vi.fn();

    const result = await executeOperation(
      { type: 'read', storages: [mockStorageConfig], endpoint: '/items' },
      { onUnavailable }
    );

    expect(result.success).toBe(false);
    expect(result.phase).toBe('unavailable');
    expect(onUnavailable).toHaveBeenCalledWith(['sql']);
  });

  it('skips health check when skipHealthCheck is true', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    });

    await executeOperation({
      type: 'read',
      storages: [mockStorageConfig],
      endpoint: '/items',
      skipHealthCheck: true,
    });

    expect(checkMultipleStoragesHealth).not.toHaveBeenCalled();
  });

  it('calls onSuccess callback on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    });

    const onSuccess = vi.fn();

    await executeOperation(
      { type: 'read', storages: [mockStorageConfig], endpoint: '/items' },
      { onSuccess }
    );

    expect(onSuccess).toHaveBeenCalled();
  });

  it('calls onError callback on failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ detail: 'Server error' }),
    });

    const onError = vi.fn();

    await executeOperation(
      { type: 'read', storages: [mockStorageConfig], endpoint: '/items' },
      { onError }
    );

    expect(onError).toHaveBeenCalled();
  });
});

// ================================================================
// executeBatchOperations TESTS
// ================================================================

describe('executeBatchOperations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkMultipleStoragesHealth).mockResolvedValue({
      allHealthy: true,
      unhealthyStorages: [],
      results: [],
    });
  });

  it('executes multiple operations sequentially', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({ id: '1' }) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({ id: '2' }) });

    const requests: OperationRequest[] = [
      { type: 'read', storages: [mockStorageConfig], endpoint: '/items/1' },
      { type: 'read', storages: [mockStorageConfig], endpoint: '/items/2' },
    ];

    const result = await executeBatchOperations(requests);

    expect(result.results.length).toBe(2);
    expect(result.successCount).toBe(2);
    expect(result.failCount).toBe(0);
  });

  it('executes multiple operations in parallel', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({ id: '1' }) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({ id: '2' }) });

    const requests: OperationRequest[] = [
      { type: 'read', storages: [mockStorageConfig], endpoint: '/items/1' },
      { type: 'read', storages: [mockStorageConfig], endpoint: '/items/2' },
    ];

    const result = await executeBatchOperations(requests, { parallel: true });

    expect(result.results.length).toBe(2);
    expect(result.successCount).toBe(2);
  });

  it('stops on error when stopOnError is true', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: false, status: 500, json: () => Promise.resolve({}) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({}) });

    const requests: OperationRequest[] = [
      { type: 'read', storages: [mockStorageConfig], endpoint: '/items/1' },
      { type: 'read', storages: [mockStorageConfig], endpoint: '/items/2' },
    ];

    const result = await executeBatchOperations(requests, { stopOnError: true });

    // Should stop after first failure
    expect(result.results.length).toBe(1);
    expect(result.failCount).toBe(1);
  });

  it('continues on error when stopOnError is false', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: false, status: 500, json: () => Promise.resolve({}) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({}) });

    const requests: OperationRequest[] = [
      { type: 'read', storages: [mockStorageConfig], endpoint: '/items/1' },
      { type: 'read', storages: [mockStorageConfig], endpoint: '/items/2' },
    ];

    const result = await executeBatchOperations(requests, { stopOnError: false });

    expect(result.results.length).toBe(2);
    expect(result.successCount).toBe(1);
    expect(result.failCount).toBe(1);
  });

  it('calls onProgress callback', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({}) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({}) });

    const onProgress = vi.fn();
    const requests: OperationRequest[] = [
      { type: 'read', storages: [mockStorageConfig], endpoint: '/items/1' },
      { type: 'read', storages: [mockStorageConfig], endpoint: '/items/2' },
    ];

    await executeBatchOperations(requests, { callbacks: { onProgress } });

    expect(onProgress).toHaveBeenCalled();
  });
});
