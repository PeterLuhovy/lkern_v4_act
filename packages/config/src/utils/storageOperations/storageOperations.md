# ================================================================
# storageOperations
# ================================================================
# File: L:\system\lkern_codebase_v4_act\packages\config\src\utils\storageOperations\storageOperations.md
# Version: 1.0.0
# Created: 2025-11-30
# Updated: 2025-12-10
# Utility Location: packages/config/src/utils/storageOperations/
# Package: @l-kern/config
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Universal CRUD operations system for multi-storage environments (SQL, MinIO,
#   ElasticSearch) with health checks, verification, retry, and batch operations.
# ================================================================

---

## Overview

**Purpose**: Universal CRUD operations for multi-storage systems with health checks and verification
**Package**: @l-kern/config
**Path**: packages/config/src/utils/storageOperations/
**Since**: v1.0.0

The storageOperations utility system provides a comprehensive framework for executing CRUD operations across multiple storage systems (SQL databases, MinIO object storage, ElasticSearch search index). It implements pre-flight health checking, automatic retry with exponential backoff, operation verification (read-back data confirmation), progress tracking for batch operations, and rich callback system for UI state management.

**Key Components**: operations.ts (CRUD execution), healthCheck.ts (service availability), types.ts (TypeScript interfaces).

---

## System Architecture

```
storageOperations/
├── operations.ts         # CRUD operations (CREATE, READ, UPDATE, DELETE)
├── healthCheck.ts        # Health checking for services
├── types.ts              # TypeScript type definitions
└── index.ts              # Exports
```

**Workflow**: Health Check → Execute Operation → Verify (optional) → Return Result

**Supported Storages**:
- **SQL** - PostgreSQL databases (LKMS services)
- **MinIO** - Object storage for files/attachments
- **ElasticSearch** - Search index for fast queries

---

## Main Functions

### From operations.ts

#### executeOperation
Execute single CRUD operation with health check and verification

#### executeBatchOperations
Execute multiple operations sequentially or in parallel

### From healthCheck.ts

#### checkStorageHealth
Check health of single storage system

#### checkMultipleStoragesHealth
Check health of multiple storages in parallel

#### getStorageDisplayNames
Get user-friendly display names for storages

---

## API Reference

### Function: executeOperation

**Signature:**
```typescript
function executeOperation<T = unknown>(
  request: OperationRequest<T>,
  operationCallbacks?: OperationCallbacks,
  retryConfig?: RetryConfig
): Promise<OperationResult<T>>
```

**Purpose:**
Execute a single CRUD operation (CREATE, READ, UPDATE, DELETE) across one or more storage systems with automatic health check and optional verification.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `request` | `OperationRequest<T>` | Yes | Operation request configuration |
| `operationCallbacks` | `OperationCallbacks` | No | Callbacks for UI feedback |
| `retryConfig` | `RetryConfig` | No | Retry configuration |

**Request Interface:**

```typescript
interface OperationRequest<T = unknown> {
  type: OperationType;               // 'create' | 'read' | 'update' | 'delete'
  storages: StorageConfig[];         // Storage configurations
  endpoint: string;                  // API endpoint path
  data?: unknown;                    // Request data (for create/update/delete)
  verifyFields?: string[];           // Fields to verify after operation
  expectedValues?: Partial<T>;       // Expected values for verification
}

interface StorageConfig {
  type: StorageType;                 // 'sql' | 'minio' | 'elasticsearch'
  baseUrl: string;                   // Base URL (e.g., 'http://localhost:8105')
  healthEndpoint: string;            // Health check endpoint
  healthTimeout?: number;            // Health check timeout ms (default: 3000)
  operationTimeout?: number;         // Operation timeout ms (default: 30000)
  displayName?: string;              // Display name for UI
}
```

**Operation Callbacks:**

```typescript
interface OperationCallbacks {
  onHealthCheckStart?: () => void;
  onHealthCheckComplete?: (result: CombinedHealthResult) => void;
  onOperationStart?: () => void;
  onProgress?: (current: number, total: number) => void;
  onSuccess?: (result: OperationResult) => void;
  onError?: (error: string, result?: OperationResult) => void;
  onUnavailable?: (unavailableStorages: StorageType[]) => void;
  onNotFound?: () => void;
  onVerificationFailed?: (errors: VerificationError[]) => void;
}
```

**Return Value:**

```typescript
interface OperationResult<T = unknown> {
  success: boolean;                  // Overall success
  data?: T;                          // Response data
  error?: string;                    // Error message
  phase: OperationPhase;             // Last phase reached
  results: StorageOperationResult[]; // Results per storage
  verificationErrors?: VerificationError[];
}
```

---

### Function: executeBatchOperations

**Signature:**
```typescript
function executeBatchOperations<T = unknown>(
  requests: OperationRequest<T>[],
  options?: {
    parallel?: boolean;
    stopOnError?: boolean;
    retryConfig?: RetryConfig;
    callbacks?: OperationCallbacks;
  }
): Promise<{
  results: OperationResult<T>[];
  successCount: number;
  failCount: number;
}>
```

**Purpose:**
Execute multiple operations sequentially or in parallel with progress tracking.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `requests` | `OperationRequest<T>[]` | - | **Required** Array of operation requests |
| `options.parallel` | `boolean` | `false` | Execute in parallel vs sequential |
| `options.stopOnError` | `boolean` | `false` | Stop batch on first error |
| `options.retryConfig` | `RetryConfig` | - | Retry configuration for all operations |
| `options.callbacks` | `OperationCallbacks` | - | UI feedback callbacks |

**Returns:**

```typescript
{
  results: OperationResult<T>[];   // Results for each operation
  successCount: number;             // Number of successful operations
  failCount: number;                // Number of failed operations
}
```

---

### Function: checkStorageHealth

**Signature:**
```typescript
function checkStorageHealth(
  storage: StorageConfig,
  retryConfig?: RetryConfig
): Promise<HealthCheckResult>
```

**Purpose:**
Check health of a single storage system with retry.

**Returns:**

```typescript
interface HealthCheckResult {
  storage: StorageType;              // Storage type checked
  status: HealthStatus;              // 'checking' | 'healthy' | 'unhealthy' | 'error'
  responseTime?: number;             // Response time in milliseconds
  error?: string;                    // Error message
  statusCode?: number;               // HTTP status code
  retryAttempts?: number;            // Number of retry attempts made
  wasSlow?: boolean;                 // Did it trigger slow threshold
}
```

---

### Function: checkMultipleStoragesHealth

**Signature:**
```typescript
function checkMultipleStoragesHealth(
  storages: StorageConfig[],
  retryConfig?: RetryConfig
): Promise<CombinedHealthResult>
```

**Purpose:**
Check health of multiple storages in parallel.

**Returns:**

```typescript
interface CombinedHealthResult {
  allHealthy: boolean;                    // True if all healthy
  results: Map<StorageType, HealthCheckResult>; // Results per storage
  unhealthyStorages: StorageType[];       // List of unhealthy storages
  totalDuration: number;                  // Total check duration ms
}
```

---

### Function: getStorageDisplayNames

**Signature:**
```typescript
function getStorageDisplayNames(
  storageTypes: StorageType[],
  storageMap?: Map<StorageType, StorageConfig>
): string[]
```

**Purpose:**
Get user-friendly display names for storage types.

**Example:**
```typescript
getStorageDisplayNames(['sql', 'minio'])
// Returns: ['Issues Database', 'MinIO Object Storage']

// Or with custom names:
getStorageDisplayNames(['sql'], storageMap)
// Returns: ['Issues Service'] (from storageMap displayName)
```

---

## Pre-Defined Storage Configurations

```typescript
export const STORAGE_CONFIGS = {
  issuesSQL: {
    type: 'sql',
    baseUrl: import.meta.env.VITE_ISSUES_SERVICE_URL || 'http://localhost:8105',
    healthEndpoint: '/health',
    displayName: 'Issues Database',
  },
  contactsSQL: {
    type: 'sql',
    baseUrl: import.meta.env.VITE_CONTACTS_SERVICE_URL || 'http://localhost:8101',
    healthEndpoint: '/health',
    displayName: 'Contacts Database',
  },
  minio: {
    type: 'minio',
    baseUrl: import.meta.env.VITE_MINIO_URL || 'http://localhost:9000',
    healthEndpoint: '/minio/health/live',
    displayName: 'MinIO Object Storage',
  },
  elasticsearch: {
    type: 'elasticsearch',
    baseUrl: import.meta.env.VITE_ELASTICSEARCH_URL || 'http://localhost:9200',
    healthEndpoint: '/_cluster/health',
    displayName: 'ElasticSearch',
  },
} as const;
```

---

## Examples

### Example 1: Single Operation (CREATE)

```typescript
import { executeOperation, STORAGE_CONFIGS } from '@l-kern/config';

async function createIssue(issueData: IssueCreateData) {
  const result = await executeOperation({
    type: 'create',
    storages: [STORAGE_CONFIGS.issuesSQL, STORAGE_CONFIGS.minio],
    endpoint: '/issues',
    data: issueData,
  }, {
    onHealthCheckStart: () => setStatus('Checking services...'),
    onOperationStart: () => setStatus('Creating issue...'),
    onSuccess: () => toast.success('Issue created!'),
    onUnavailable: (storages) => {
      showModal(`Unavailable: ${storages.join(', ')}`);
    },
  });

  if (result.success) {
    navigate(`/issues/${result.data.id}`);
  }
}
```

### Example 2: Single Operation (UPDATE) with Verification

```typescript
import { executeOperation, STORAGE_CONFIGS } from '@l-kern/config';

async function updateIssueStatus(issueId: string, newStatus: string) {
  const result = await executeOperation({
    type: 'update',
    storages: [STORAGE_CONFIGS.issuesSQL],
    endpoint: '/issues',
    data: { id: issueId, status: newStatus },
    verifyFields: ['status'], // Verify status was updated
    expectedValues: { status: newStatus },
  }, {
    onVerificationFailed: (errors) => {
      toast.error(`Verification failed: ${errors[0].field} mismatch`);
    },
  });

  if (result.success) {
    toast.success('Status updated and verified!');
  }
}
```

### Example 3: Batch Operations (DELETE)

```typescript
import { executeBatchOperations, STORAGE_CONFIGS } from '@l-kern/config';

async function deleteMultipleIssues(issueIds: string[]) {
  const requests = issueIds.map((id) => ({
    type: 'delete' as const,
    storages: [STORAGE_CONFIGS.issuesSQL, STORAGE_CONFIGS.minio],
    endpoint: '/issues',
    data: { id },
  }));

  const { results, successCount, failCount } = await executeBatchOperations(
    requests,
    {
      parallel: false,      // Delete sequentially
      stopOnError: false,   // Continue on errors
      callbacks: {
        onProgress: (current, total) => {
          setProgress(Math.round((current / total) * 100));
        },
      },
    }
  );

  toast.info(`Deleted ${successCount} of ${issueIds.length} issues`);
  if (failCount > 0) {
    toast.warning(`${failCount} deletions failed`);
  }
}
```

### Example 4: Health Check Only

```typescript
import { checkMultipleStoragesHealth, STORAGE_CONFIGS } from '@l-kern/config';

async function checkSystemHealth() {
  const result = await checkMultipleStoragesHealth([
    STORAGE_CONFIGS.issuesSQL,
    STORAGE_CONFIGS.minio,
    STORAGE_CONFIGS.elasticsearch,
  ]);

  if (result.allHealthy) {
    toast.success('All services healthy!');
  } else {
    const names = getStorageDisplayNames(result.unhealthyStorages);
    toast.error(`Unavailable: ${names.join(', ')}`);
  }

  console.log(`Health check took ${result.totalDuration}ms`);
}
```

### Example 5: With useStorageOperation Hook

```typescript
import { useStorageOperation, STORAGE_CONFIGS } from '@l-kern/config';

function IssueEditor() {
  const { execute, state, isLoading } = useStorageOperation({
    storages: [STORAGE_CONFIGS.issuesSQL],
  });

  const handleUpdate = async (data: IssueUpdateData) => {
    await execute({
      type: 'update',
      endpoint: '/issues',
      data,
    });
  };

  return (
    <form>
      {/* Form fields */}
      {isLoading && <p>{state.statusMessage}</p>}
      <button onClick={() => handleUpdate(formData)}>Save</button>
    </form>
  );
}
```

---

## Operation Phases

```typescript
type OperationPhase =
  | 'idle'                  // Not started
  | 'health_check'          // Checking storage health
  | 'executing'             // Executing operation
  | 'verifying'             // Verifying operation result
  | 'success'               // Operation succeeded
  | 'failed'                // Operation failed
  | 'unavailable'           // Storage unavailable
  | 'not_found'             // Resource not found (404)
  | 'verification_failed';  // Verification failed
```

**Phase Flow:**
```
idle → health_check → executing → verifying → success
                 ↓           ↓         ↓          ↓
             unavailable   failed  not_found  verification_failed
```

---

## Retry Configuration

```typescript
interface RetryConfig {
  maxTotalTime?: number;           // Max total retry time ms (default: 15000)
  initialDelay?: number;           // Initial retry delay ms (default: 1000)
  maxDelay?: number;               // Max retry delay ms (default: 4000)
  backoffMultiplier?: number;      // Exponential backoff multiplier (default: 2)
  slowThreshold?: number;          // Slow operation threshold ms (default: 5000)
  onSlowOperation?: () => void;    // Callback for slow operation
  onRetry?: (attempt: number, delay: number) => void; // Callback on retry
}
```

**Default Retry Behavior:**
- Initial delay: 1000ms
- Delay after 1st retry: 2000ms (1000 * 2)
- Delay after 2nd retry: 4000ms (2000 * 2, capped at maxDelay)
- Max total time: 15 seconds
- Slow threshold: 5 seconds

---

## Verification System

**Purpose**: Confirm operation success by reading back data and comparing with expected values.

**When to Use**:
- Critical operations (status changes, deletions)
- Multi-storage operations (SQL + MinIO consistency)
- Operations with eventual consistency

**Example:**
```typescript
await executeOperation({
  type: 'update',
  storages: [STORAGE_CONFIGS.issuesSQL],
  endpoint: '/issues',
  data: { id: '123', status: 'closed' },
  verifyFields: ['status'],
  expectedValues: { status: 'closed' },
});

// System will:
// 1. Execute UPDATE request
// 2. Execute READ request for issue ID 123
// 3. Compare result.status === 'closed'
// 4. If mismatch → onVerificationFailed callback
```

---

## Best Practices

1. **Always provide displayName** - Better UI messages for unavailable services
2. **Use verification for critical operations** - Status changes, deletions
3. **Handle unavailable callback** - Show modal with service names
4. **Use batch operations for multiple items** - More efficient than loops
5. **Set appropriate timeouts** - Longer for MinIO uploads, shorter for SQL
6. **Test with services down** - Verify UI feedback works
7. **Use pre-defined STORAGE_CONFIGS** - Consistent configuration
8. **Check health before batch operations** - Avoid wasting time on unavailable services
9. **Provide progress callbacks for batches** - Show progress bar to user

---

## Known Issues

- ⚠️ **Verification not implemented for MinIO** - Only works for SQL storages
  - **Tracking**: None
  - **Impact**: Cannot verify file uploads to MinIO
  - **Workaround**: Check file existence separately

---

## Changelog

### v1.0.0 (2025-11-30)
- ✅ Initial implementation
- ✅ CRUD operations (CREATE, READ, UPDATE, DELETE)
- ✅ Multi-storage support (SQL, MinIO, ElasticSearch)
- ✅ Health checking with retry
- ✅ Batch operations (sequential/parallel)
- ✅ Verification system
- ✅ Progress tracking
- ✅ Rich callback system
- ⚠️ MinIO verification not implemented

---

**End of storageOperations Documentation**
