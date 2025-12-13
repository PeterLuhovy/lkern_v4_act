# ================================================================
# useStorageOperation
# ================================================================
# File: L:\system\lkern_codebase_v4_act\packages\config\src\hooks\useStorageOperation\useStorageOperation.md
# Version: 1.0.0
# Created: 2025-11-30
# Updated: 2025-12-10
# Hook Location: packages/config/src/hooks/useStorageOperation/useStorageOperation.ts
# Package: @l-kern/config
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   React hook for multi-storage CRUD operations with health checks, retry logic,
#   modal management, and progress tracking. Supports SQL, MinIO, ElasticSearch.
# ================================================================

---

## Overview

**Purpose**: Execute CRUD operations across multiple storage systems with comprehensive UI state management
**Package**: @l-kern/config
**Path**: packages/config/src/hooks/useStorageOperation
**Since**: v1.0.0

The useStorageOperation hook provides a unified interface for performing CREATE, READ, UPDATE, DELETE operations across multiple storage systems (SQL databases, MinIO object storage, ElasticSearch). It implements a multi-phase workflow with automatic health checking, exponential backoff retry, UI state management for modals (unavailable services, confirmation dialogs), progress tracking for batch operations, and optional auto-reset after success.

**Workflow**: Health Check → Execute Operation → Verify (if configured) → Update UI State

---

## Features

- ✅ **Multi-Storage Support**: SQL (PostgreSQL), MinIO (object storage), ElasticSearch (search index)
- ✅ **4 Operation Types**: CREATE, READ, UPDATE, DELETE
- ✅ **9 Operation Phases**: idle, health_check, executing, verifying, success, failed, unavailable, not_found, verification_failed
- ✅ **Automatic Health Checks**: Verifies storage availability before operations
- ✅ **Exponential Backoff Retry**: Configurable retry with slow operation notification
- ✅ **UI State Management**: Modal states (unavailable, confirmation), loading, progress, error
- ✅ **Batch Operations**: Execute multiple operations sequentially or in parallel
- ✅ **Progress Tracking**: Real-time progress updates for batch operations
- ✅ **Verification Support**: Optional data verification after operations
- ✅ **Auto-Reset**: Optionally reset state after success (configurable delay)
- ✅ **Computed Helpers**: isLoading, isSuccess, isError, isUnavailable, isIdle
- ✅ **Display Names**: User-friendly service names for error messages
- ✅ **Retry Mechanism**: retry() function to re-attempt failed operations

---

## Quick Start

### Basic Usage

```tsx
import { useStorageOperation } from '@l-kern/config';
import { STORAGE_CONFIGS } from '@l-kern/config';

function IssueEditor({ issueId }: { issueId: string }) {
  const {
    state,
    execute,
    isLoading,
    isUnavailable,
    closeUnavailableModal,
    getUnavailableDisplayNames,
  } = useStorageOperation({
    storages: [STORAGE_CONFIGS.issuesSQL, STORAGE_CONFIGS.minio],
  });

  const handleDelete = async () => {
    const result = await execute({
      type: 'delete',
      endpoint: '/issues',
      data: { id: issueId },
    });

    if (result.success) {
      toast.success('Issue deleted successfully!');
    } else {
      toast.error(result.error || 'Delete failed');
    }
  };

  return (
    <div>
      <button onClick={handleDelete} disabled={isLoading}>
        {isLoading ? 'Deleting...' : 'Delete Issue'}
      </button>

      {state.statusMessage && <p>{state.statusMessage}</p>}

      <Modal isOpen={isUnavailable} onClose={closeUnavailableModal}>
        <h3>Services Unavailable</h3>
        <p>Cannot perform operation. The following services are down:</p>
        <ul>
          {getUnavailableDisplayNames().map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
        <Button onClick={retry}>Retry</Button>
      </Modal>
    </div>
  );
}
```

### Common Patterns

#### Pattern 1: Create Operation with Progress

```tsx
import { useStorageOperation, STORAGE_CONFIGS } from '@l-kern/config';

function IssueCreator() {
  const { execute, state, isLoading, isSuccess } = useStorageOperation({
    storages: [STORAGE_CONFIGS.issuesSQL, STORAGE_CONFIGS.minio],
  });

  const handleCreate = async (data: IssueCreateData) => {
    const result = await execute({
      type: 'create',
      endpoint: '/issues',
      data: data,
    });

    if (result.success) {
      navigate(`/issues/${result.data.id}`);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleCreate(formData); }}>
      {/* Form fields */}

      {isLoading && (
        <div>
          <Spinner />
          <p>{state.statusMessage}</p>
          {state.progress > 0 && <ProgressBar value={state.progress} />}
        </div>
      )}

      {isSuccess && <p>Issue created successfully!</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Issue'}
      </button>
    </form>
  );
}
```

#### Pattern 2: Batch Operations

```tsx
import { useStorageOperation, STORAGE_CONFIGS } from '@l-kern/config';

function BulkIssueDeleter({ issueIds }: { issueIds: string[] }) {
  const { executeBatch, state, isLoading } = useStorageOperation({
    storages: [STORAGE_CONFIGS.issuesSQL],
  });

  const handleBulkDelete = async () => {
    const requests = issueIds.map((id) => ({
      type: 'delete' as const,
      endpoint: '/issues',
      data: { id },
    }));

    const result = await executeBatch(requests, {
      parallel: false,     // Execute sequentially
      stopOnError: false,  // Continue on errors
    });

    toast.info(`Deleted ${result.successCount} of ${issueIds.length} issues`);
  };

  return (
    <div>
      <button onClick={handleBulkDelete} disabled={isLoading}>
        Delete {issueIds.length} Issues
      </button>

      {isLoading && (
        <div>
          <ProgressBar value={state.progress} />
          <p>{state.statusMessage}</p>
        </div>
      )}
    </div>
  );
}
```

#### Pattern 3: Health Check Only (No Operation)

```tsx
import { useStorageOperation, STORAGE_CONFIGS } from '@l-kern/config';

function StorageHealthMonitor() {
  const { checkHealth, state, isLoading } = useStorageOperation({
    storages: [
      STORAGE_CONFIGS.issuesSQL,
      STORAGE_CONFIGS.minio,
      STORAGE_CONFIGS.elasticsearch,
    ],
  });

  const handleCheck = async () => {
    const result = await checkHealth();

    if (result.allHealthy) {
      toast.success('All storages healthy!');
    } else {
      toast.error(`Unavailable: ${result.unhealthyStorages.join(', ')}`);
    }
  };

  return (
    <div>
      <button onClick={handleCheck} disabled={isLoading}>
        Check Storage Health
      </button>
      <p>{state.statusMessage}</p>
    </div>
  );
}
```

#### Pattern 4: With Auto-Reset

```tsx
import { useStorageOperation, STORAGE_CONFIGS } from '@l-kern/config';

function QuickIssueUpdater({ issueId }: { issueId: string }) {
  const { execute, isSuccess, isLoading } = useStorageOperation({
    storages: [STORAGE_CONFIGS.issuesSQL],
    autoResetDelay: 3000, // Reset state after 3 seconds
  });

  const handleQuickUpdate = async (field: string, value: string) => {
    await execute({
      type: 'update',
      endpoint: '/issues',
      data: { id: issueId, [field]: value },
    });
    // State automatically resets to idle after 3 seconds
  };

  return (
    <div>
      <button onClick={() => handleQuickUpdate('status', 'closed')}>
        Mark as Closed
      </button>

      {isLoading && <Spinner />}
      {isSuccess && <CheckIcon />} {/* Shows for 3 seconds */}
    </div>
  );
}
```

#### Pattern 5: With Custom Retry Configuration

```tsx
import { useStorageOperation, STORAGE_CONFIGS } from '@l-kern/config';

function ResilientIssueCreator() {
  const [showSlowWarning, setShowSlowWarning] = useState(false);

  const { execute, isLoading } = useStorageOperation({
    storages: [STORAGE_CONFIGS.issuesSQL, STORAGE_CONFIGS.minio],
    retryConfig: {
      maxTotalTime: 30000,      // Retry for up to 30 seconds
      initialDelay: 2000,       // Start with 2 second delay
      maxDelay: 8000,           // Max 8 second delay between retries
      backoffMultiplier: 2,     // Double delay each retry
      slowThreshold: 5000,      // Notify after 5 seconds
      onSlowOperation: () => {
        setShowSlowWarning(true);
      },
      onRetry: (attempt, delay) => {
        console.log(`Retry attempt ${attempt}, waiting ${delay}ms`);
      },
    },
  });

  const handleCreate = async (data: IssueCreateData) => {
    setShowSlowWarning(false);
    const result = await execute({
      type: 'create',
      endpoint: '/issues',
      data,
    });

    if (result.success) {
      toast.success('Issue created!');
    }
  };

  return (
    <div>
      <button onClick={() => handleCreate(formData)} disabled={isLoading}>
        Create Issue
      </button>

      {showSlowWarning && (
        <p className="warning">Operation taking longer than expected...</p>
      )}
    </div>
  );
}
```

---

## API Reference

### Function Signature

```typescript
function useStorageOperation(
  options: UseStorageOperationOptions
): UseStorageOperationReturn
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `options` | `UseStorageOperationOptions` | Yes | Configuration object (see below) |

### Options

```typescript
interface UseStorageOperationOptions {
  storages: StorageConfig[];           // Storage configurations (SQL, MinIO, ElasticSearch)
  retryConfig?: Partial<RetryConfig>; // Retry configuration
  autoResetDelay?: number;             // Auto-reset after success (ms, 0 = disabled, default: 0)
}

interface StorageConfig {
  type: StorageType;                   // 'sql' | 'minio' | 'elasticsearch'
  baseUrl: string;                     // Base URL (e.g., 'http://localhost:8105')
  healthEndpoint: string;              // Health check endpoint (e.g., '/health')
  healthTimeout?: number;              // Health timeout ms (default: 3000)
  operationTimeout?: number;           // Operation timeout ms (default: 30000)
  displayName?: string;                // Display name for UI (e.g., 'Issues Database')
  retryConfig?: RetryConfig;           // Storage-specific retry config
}

interface RetryConfig {
  maxTotalTime?: number;               // Max total retry time ms (default: 15000)
  initialDelay?: number;               // Initial retry delay ms (default: 1000)
  maxDelay?: number;                   // Max retry delay ms (default: 4000)
  backoffMultiplier?: number;          // Exponential backoff multiplier (default: 2)
  slowThreshold?: number;              // "Slow operation" threshold ms (default: 5000)
  onSlowOperation?: () => void;        // Callback when operation is slow
  onRetry?: (attempt: number, delay: number) => void; // Callback on each retry
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storages` | `StorageConfig[]` | - | **Required** Array of storage configurations to use |
| `retryConfig` | `Partial<RetryConfig>` | `{}` | Global retry configuration for all operations |
| `autoResetDelay` | `number` | `0` | Automatically reset state after success (milliseconds). 0 = disabled. |

### Return Value

```typescript
interface UseStorageOperationReturn {
  // State
  state: StorageOperationUIState;      // Current UI state

  // Methods
  execute: <T>(request) => Promise<OperationResult<T>>; // Execute single operation
  executeBatch: <T>(requests, options) => Promise<BatchResult>; // Execute multiple operations
  checkHealth: () => Promise<CombinedHealthResult>; // Check health only
  retry: () => Promise<OperationResult | null>; // Retry last operation
  reset: () => void;                   // Reset state to idle
  closeUnavailableModal: () => void;   // Close unavailable modal
  closeConfirmModal: () => void;       // Close confirmation modal
  showConfirmation: (type) => void;    // Show confirmation modal

  // Computed Helpers
  isIdle: boolean;                     // True if phase === 'idle'
  isLoading: boolean;                  // True if operation in progress
  isSuccess: boolean;                  // True if phase === 'success'
  isError: boolean;                    // True if phase === 'failed' or 'verification_failed'
  isUnavailable: boolean;              // True if phase === 'unavailable' or modal shown

  // Utilities
  getUnavailableDisplayNames: () => string[]; // Get display names of unavailable storages
}
```

| Return Property | Type | Description |
|-----------------|------|-------------|
| `state` | `StorageOperationUIState` | Current UI state including phase, progress, messages, errors, modals |
| `execute` | `<T>(request) => Promise<OperationResult<T>>` | Execute a single operation. Returns result with success flag and data. |
| `executeBatch` | `<T>(requests, options) => Promise<BatchResult>` | Execute multiple operations. Returns results array and counts. |
| `checkHealth` | `() => Promise<CombinedHealthResult>` | Check storage health without performing operation. |
| `retry` | `() => Promise<OperationResult \| null>` | Retry last operation. Returns null if no operation to retry. |
| `reset` | `() => void` | Reset state to idle (clears data, errors, progress, modals). |
| `closeUnavailableModal` | `() => void` | Close the unavailable services modal. |
| `closeConfirmModal` | `() => void` | Close the confirmation modal. |
| `showConfirmation` | `(type) => void` | Show confirmation modal with type ('standard', 'force', 'mark_for_pending'). |
| `isIdle` | `boolean` | Computed helper. True if no operation in progress. |
| `isLoading` | `boolean` | Computed helper. True if checking health, executing, or verifying. |
| `isSuccess` | `boolean` | Computed helper. True if last operation succeeded. |
| `isError` | `boolean` | Computed helper. True if last operation failed or verification failed. |
| `isUnavailable` | `boolean` | Computed helper. True if storages are unavailable or modal is shown. |
| `getUnavailableDisplayNames` | `() => string[]` | Get user-friendly display names of unavailable storages. |

### UI State Interface

```typescript
interface StorageOperationUIState {
  phase: OperationPhase;               // Current operation phase
  isLoading: boolean;                  // Loading indicator
  showUnavailableModal: boolean;       // Show unavailable services modal
  unavailableStorages: StorageType[];  // List of unavailable storage types
  showConfirmModal: boolean;           // Show confirmation modal
  confirmationType?: 'standard' | 'force' | 'mark_for_pending';
  progress: number;                    // Progress percentage (0-100)
  statusMessage: string;               // Status message for UI
  error: string | null;                // Error message
  lastResult: OperationResult | null;  // Last operation result
}

type OperationPhase =
  | 'idle'                  // No operation in progress
  | 'health_check'          // Checking storage health
  | 'executing'             // Executing operation
  | 'verifying'             // Verifying operation result
  | 'success'               // Operation succeeded
  | 'failed'                // Operation failed
  | 'unavailable'           // Storage unavailable
  | 'not_found'             // Resource not found (404)
  | 'verification_failed';  // Verification failed
```

---

## Behavior

### Internal Logic

**Multi-Phase Workflow:**
1. **Health Check Phase** (optional, can be skipped)
   - Check health of all configured storages
   - If any storage unhealthy, show unavailable modal and stop
   - Retry with exponential backoff if configured

2. **Execution Phase**
   - Execute operation on storages (SQL write, MinIO upload, etc.)
   - Track progress for batch operations
   - Update status messages

3. **Verification Phase** (if configured)
   - Verify operation result (e.g., read back data)
   - Compare with expected result
   - Report verification failures

4. **Success/Error Phase**
   - Update UI state
   - Trigger auto-reset timer if configured
   - Store result for retry functionality

**State Management:**
- Uses `useState` for UI state (phase, loading, modals, progress, errors)
- Uses `useRef` for last request (enables retry) and auto-reset timer
- State updates trigger re-renders in all components using the hook
- State persists across re-renders until reset() is called

**Retry Logic:**
- Exponential backoff: delay *= backoffMultiplier (default: 2x)
- Initial delay: 1000ms (configurable)
- Max delay: 4000ms (configurable)
- Max total time: 15000ms (configurable)
- Slow operation notification after 5000ms (configurable)

**Auto-Reset:**
- If `autoResetDelay > 0`, schedules reset after success
- Clears timer if new operation starts before reset
- Useful for showing temporary success feedback

### Dependencies

**React Hooks Used:**
- `useState` - Manages UI state
- `useCallback` - Memoizes functions (execute, retry, reset, etc.)
- `useRef` - Stores last request and auto-reset timer

**Utility Dependencies:**
- `executeOperation` from `../../utils/storageOperations/operations`
- `executeBatchOperations` from `../../utils/storageOperations/operations`
- `checkMultipleStoragesHealth` from `../../utils/storageOperations/healthCheck`
- `getStorageDisplayNames` from `../../utils/storageOperations/healthCheck`

**Context Dependencies:**
- None (independent hook)

### Memoization

**useCallback Dependencies:**
- `reset` - Memoized with: [] (no dependencies)
- `closeUnavailableModal` - Memoized with: [] (no dependencies)
- `closeConfirmModal` - Memoized with: [] (no dependencies)
- `showConfirmation` - Memoized with: [] (no dependencies)
- `checkHealth` - Memoized with: storages, retryConfig
- `execute` - Memoized with: storages, retryConfig
- `executeBatch` - Memoized with: storages, retryConfig
- `retry` - Memoized with: execute, closeUnavailableModal
- `getUnavailableDisplayNames` - Memoized with: state.unavailableStorages, storages

**Why Memoization Matters:**
- Prevents infinite loops when using hook with useEffect
- Ensures function references stay stable unless dependencies change
- Allows safe use of execute/retry in useEffect dependency array

---

## Examples

### Example 1: Simple Issue Delete

```tsx
import { useStorageOperation, STORAGE_CONFIGS } from '@l-kern/config';

function DeleteIssueButton({ issueId }: { issueId: string }) {
  const { execute, isLoading } = useStorageOperation({
    storages: [STORAGE_CONFIGS.issuesSQL],
  });

  const handleDelete = async () => {
    const result = await execute({
      type: 'delete',
      endpoint: '/issues',
      data: { id: issueId },
    });

    if (result.success) {
      navigate('/issues');
    }
  };

  return (
    <button onClick={handleDelete} disabled={isLoading}>
      {isLoading ? 'Deleting...' : 'Delete'}
    </button>
  );
}
```

### Example 2: Complete CRUD UI

```tsx
import { useStorageOperation, STORAGE_CONFIGS } from '@l-kern/config';

function IssueManager() {
  const {
    execute,
    state,
    isLoading,
    isSuccess,
    isError,
    isUnavailable,
    closeUnavailableModal,
    getUnavailableDisplayNames,
    retry,
  } = useStorageOperation({
    storages: [STORAGE_CONFIGS.issuesSQL, STORAGE_CONFIGS.minio],
  });

  const handleCreate = async (data: IssueCreateData) => {
    await execute({ type: 'create', endpoint: '/issues', data });
  };

  const handleUpdate = async (id: string, data: IssueUpdateData) => {
    await execute({ type: 'update', endpoint: '/issues', data: { id, ...data } });
  };

  const handleDelete = async (id: string) => {
    await execute({ type: 'delete', endpoint: '/issues', data: { id } });
  };

  return (
    <div>
      {/* CRUD buttons */}

      {isLoading && (
        <div>
          <Spinner />
          <p>{state.statusMessage}</p>
          <ProgressBar value={state.progress} />
        </div>
      )}

      {isSuccess && <Alert type="success">Operation successful!</Alert>}
      {isError && <Alert type="error">{state.error}</Alert>}

      <UnavailableModal
        isOpen={isUnavailable}
        onClose={closeUnavailableModal}
        unavailableServices={getUnavailableDisplayNames()}
        onRetry={retry}
      />
    </div>
  );
}
```

---

## Known Issues

### Current Known Issues

- ⚠️ **No Automatic Retry on Error**: User must call retry() manually
  - **Tracking**: None (by design)
  - **Impact**: Must implement retry UI for failed operations
  - **Workaround**: Use retry() function in error state UI

- ⚠️ **No Operation Queue**: Sequential operations must be managed by user
  - **Tracking**: None
  - **Impact**: Concurrent execute() calls may interfere
  - **Workaround**: Disable buttons during isLoading

### Resolved Issues

- ✅ **FIXED (v1.0.0)**: Auto-reset timer correctly clears on new operations
- ✅ **FIXED (v1.0.0)**: Batch operations track progress correctly

---

## Testing

### Test Coverage

- **Unit Tests**: Not yet implemented
- **Integration Tests**: Tested via components using useStorageOperation

### Key Test Cases

1. **execute() calls health check before operation**
2. **execute() shows unavailable modal when storage is down**
3. **executeBatch() tracks progress correctly**
4. **retry() re-attempts last operation**
5. **reset() clears all state**
6. **autoResetDelay resets state after success**
7. **Computed helpers return correct values**
8. **getUnavailableDisplayNames() returns correct names**

---

## Related Components

- [useServiceFetch](../useServiceFetch/useServiceFetch.md) - Similar pattern for single-service fetching
- [storageOperations utilities](../../utils/storageOperations/operations.md) - Core operation functions
- [serviceRetry utility](../../utils/serviceRetry/serviceRetry.md) - Retry logic implementation

---

## Best Practices

1. **Always handle unavailable state** - Show modal with unavailable services and retry button
2. **Use STORAGE_CONFIGS** - Pre-defined configs for consistency
3. **Show progress for batch operations** - Display progress bar and status message
4. **Configure appropriate timeouts** - Longer for large file uploads to MinIO
5. **Use auto-reset for temporary feedback** - Set autoResetDelay for success checkmarks
6. **Test with services down** - Verify UI works when storages are unavailable
7. **Disable UI during operations** - Use isLoading to disable buttons
8. **Provide retry UI** - Let users retry after failures
9. **Handle all phases** - Check isIdle, isLoading, isSuccess, isError, isUnavailable

---

## Changelog

### v1.0.0 (2025-11-30)
- ✅ Initial implementation
- ✅ Multi-storage support (SQL, MinIO, ElasticSearch)
- ✅ Multi-phase workflow with health checks
- ✅ Batch operations with progress tracking
- ✅ Modal state management
- ✅ Exponential backoff retry
- ✅ Auto-reset functionality
- ✅ Computed helpers for UI state

---

**End of useStorageOperation Documentation**
