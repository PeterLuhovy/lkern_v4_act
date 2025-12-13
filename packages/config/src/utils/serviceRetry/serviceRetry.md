# ================================================================
# serviceRetry
# ================================================================
# File: L:\system\lkern_codebase_v4_act\packages\config\src\utils\serviceRetry\serviceRetry.md
# Version: 1.0.0
# Created: 2025-11-30
# Updated: 2025-12-10
# Utility Location: packages/config/src/utils/serviceRetry/serviceRetry.ts
# Package: @l-kern/config
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Universal service retry utility with exponential backoff, configurable timing,
#   "taking longer" detection, and callbacks for UI feedback (toast notifications).
# ================================================================

---

## Overview

**Purpose**: Universal retry utility for service calls with intelligent timing and UI callbacks
**Package**: @l-kern/config
**Path**: packages/config/src/utils/serviceRetry
**Since**: v1.0.0

The serviceRetry utility provides intelligent retry logic for service calls (health checks, API requests, database connections). It implements configurable retry attempts with exponential backoff, "taking longer" detection during the first attempt (shows toast if service is slow), quick failure detection (immediate error vs timeout), automatic timeout handling, and rich callback system for UI feedback integration with toast notifications.

**Key Features**: First attempt monitoring, configurable retries (default: 3), "taking longer" notification (default: 1.5s), timeout handling (default: 5s), retry delay (default: 5s), debug logging.

---

## Functions

This utility file exports the following:

### executeWithRetry
Main retry function with intelligent timing and UI callbacks

### createFetchServiceCall
Helper to create service call function from fetch request

### pingWithRetry
Simplified retry for ping-style health checks

### ServiceCallResult (interface)
Result interface for service call attempts

### RetryCallbacks (interface)
Callback functions for retry events

### RetryConfig (interface)
Configuration for retry behavior

### RetryResult (interface)
Final result after all retry attempts

---

## API Reference

### Function: executeWithRetry

**Signature:**
```typescript
function executeWithRetry<T = unknown>(
  serviceCall: () => Promise<ServiceCallResult<T>>,
  config: RetryConfig,
  callbacks?: RetryCallbacks
): Promise<RetryResult<T>>
```

**Purpose:**
Execute a service call with automatic retry logic, intelligent timing, and UI feedback callbacks.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `serviceCall` | `() => Promise<ServiceCallResult<T>>` | Yes | Async function that performs the service call |
| `config` | `RetryConfig` | Yes | Configuration for retry behavior |
| `callbacks` | `RetryCallbacks` | No | Callbacks for UI feedback (toasts, modals) |

**Service Call Function:**

```typescript
interface ServiceCallResult<T = unknown> {
  success: boolean;        // Whether call succeeded
  data?: T;                // Response data
  error?: string;          // Error message
  responseTime: number;    // Response time in milliseconds
}

// Example:
async function myServiceCall(): Promise<ServiceCallResult<User>> {
  const startTime = performance.now();
  try {
    const response = await fetch('http://localhost:8101/health');
    const data = await response.json();
    return {
      success: response.ok,
      data,
      responseTime: performance.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      responseTime: performance.now() - startTime,
    };
  }
}
```

**Configuration:**

```typescript
interface RetryConfig {
  serviceName: string;          // Service name for logging (e.g., "Issues Service")
  maxRetries?: number;          // Max retry attempts (default: 3)
  takingLongerDelay?: number;   // Delay before "taking longer" toast ms (default: 1500)
  attemptTimeout?: number;      // Timeout per attempt ms (default: 5000)
  retryDelay?: number;          // Delay between retries ms (default: 5000)
  debug?: boolean;              // Enable console logging (default: true)
}
```

| Config | Type | Default | Description |
|--------|------|---------|-------------|
| `serviceName` | `string` | - | **Required** Service name for logs and UI messages |
| `maxRetries` | `number` | `3` | Maximum number of retry attempts (after initial attempt) |
| `takingLongerDelay` | `number` | `1500` | Milliseconds before showing "taking longer" toast (during first attempt) |
| `attemptTimeout` | `number` | `5000` | Timeout for each attempt in milliseconds |
| `retryDelay` | `number` | `5000` | Delay between retry attempts in milliseconds |
| `debug` | `boolean` | `true` | Enable console logging with `[ServiceRetry:serviceName]` prefix |

**Callbacks:**

```typescript
interface RetryCallbacks {
  onAttemptStart?: () => void;                       // First attempt starts
  onTakingLonger?: () => void;                       // After takingLongerDelay (1.5s)
  onQuickFailure?: () => void;                       // Failed before takingLongerDelay
  onRetry?: (attempt: number, maxAttempts: number) => void; // Retry attempt starts
  onSuccess?: () => void;                            // Attempt succeeded
  onAllRetriesFailed?: () => void;                   // All retries exhausted
}
```

| Callback | Parameters | When Called | Use Case |
|----------|------------|-------------|----------|
| `onAttemptStart` | None | First attempt starts | Show loading spinner |
| `onTakingLonger` | None | After 1.5s of first attempt | Show "Connection slow..." toast (long duration) |
| `onQuickFailure` | None | First attempt failed < 1.5s | Show "Connection failed" toast |
| `onRetry` | `attempt`, `maxAttempts` | Before each retry (1-3) | Show "Retry 1/3..." toast |
| `onSuccess` | None | Any attempt succeeded | Dismiss toasts, hide loading |
| `onAllRetriesFailed` | None | All retries exhausted | Show "Service unavailable" modal |

**Returns:**

```typescript
interface RetryResult<T = unknown> {
  success: boolean;      // Whether any attempt succeeded
  data?: T;              // Response data (if success=true)
  error?: string;        // Error message (if success=false)
  attempts: number;      // Total attempts made (1 + retries)
  totalTime: number;     // Total time in milliseconds
  tookLonger: boolean;   // Whether "taking longer" callback was triggered
}
```

| Property | Type | Description |
|----------|------|-------------|
| `success` | `boolean` | True if any attempt succeeded, false if all failed |
| `data` | `T \| undefined` | Response data from successful attempt. Undefined if failed. |
| `error` | `string \| undefined` | Error message from last failed attempt. Undefined if successful. |
| `attempts` | `number` | Total number of attempts made (1 initial + N retries) |
| `totalTime` | `number` | Total time elapsed from start to finish in milliseconds |
| `tookLonger` | `boolean` | True if `onTakingLonger` callback was triggered (first attempt > 1.5s) |

---

## Function: createFetchServiceCall

**Signature:**
```typescript
function createFetchServiceCall<T = unknown>(
  url: string,
  options?: RequestInit
): () => Promise<ServiceCallResult<T>>
```

**Purpose:**
Helper function to create a service call function from a simple fetch request. Simplifies integration with executeWithRetry().

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | `string` | Yes | URL to fetch |
| `options` | `RequestInit` | No | Fetch options (method, headers, body, etc.) |

**Returns:**

Function that can be passed to `executeWithRetry()`.

**Example:**
```typescript
const serviceCall = createFetchServiceCall('http://localhost:8105/health');

const result = await executeWithRetry(
  serviceCall,
  { serviceName: 'Issues Service' },
  callbacks
);
```

---

## Function: pingWithRetry

**Signature:**
```typescript
function pingWithRetry(
  url: string,
  serviceName: string,
  callbacks?: RetryCallbacks
): Promise<RetryResult<{ status: string }>>
```

**Purpose:**
Simplified wrapper for ping-style health checks. Uses default retry configuration.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | `string` | Yes | Health check URL (e.g., 'http://localhost:8105/health') |
| `serviceName` | `string` | Yes | Service name for logging |
| `callbacks` | `RetryCallbacks` | No | UI feedback callbacks |

**Example:**
```typescript
const result = await pingWithRetry(
  'http://localhost:8105/health',
  'Issues Service',
  {
    onTakingLonger: () => toast.info('Slow connection...'),
    onAllRetriesFailed: () => showServiceDownModal(),
  }
);
```

---

## Timing Flow

### First Attempt (0-5s)

```
t=0ms:     onAttemptStart() called
           Service call starts
t=1500ms:  onTakingLonger() called (if call not completed yet)
           "Connection slow..." toast shown
t=5000ms:  Timeout if no response
           If failed → onQuickFailure() or onRetry(1, 3)
```

### Retry Loop (After First Attempt Fails)

```
t=5000ms:  onRetry(1, 3) called
           "Retry 1/3..." toast shown
           Retry attempt starts
t=10000ms: Timeout or result
           If failed → wait 5s

t=15000ms: onRetry(2, 3) called
           "Retry 2/3..." toast shown
           Retry attempt starts
t=20000ms: Timeout or result
           If failed → wait 5s

t=25000ms: onRetry(3, 3) called
           "Retry 3/3..." toast shown
           Final retry attempt starts
t=30000ms: Timeout or result
           If failed → onAllRetriesFailed()
           Show "Service unavailable" modal
```

**Total time for 3 retries**: ~30 seconds (5s * 4 attempts + 5s * 3 delays)

---

## Examples

### Example 1: Basic Health Check with Toasts

```typescript
import { executeWithRetry, createFetchServiceCall } from '@l-kern/config';

async function checkServiceHealth() {
  const result = await executeWithRetry(
    createFetchServiceCall('http://localhost:8105/health'),
    { serviceName: 'Issues Service' },
    {
      onTakingLonger: () => {
        toast.info('Connecting to Issues Service...', { duration: 20000 });
      },
      onRetry: (attempt, max) => {
        toast.warning(`Retry ${attempt}/${max}...`, { duration: 20000 });
      },
      onAllRetriesFailed: () => {
        toast.dismiss(); // Dismiss loading toasts
        showServiceUnavailableModal('Issues Service');
      },
      onSuccess: () => {
        toast.dismiss(); // Dismiss loading toasts
      },
    }
  );

  if (result.success) {
    console.log('Service healthy:', result.data);
  } else {
    console.error('Service unavailable:', result.error);
  }
}
```

### Example 2: Custom Service Call Function

```typescript
import { executeWithRetry, ServiceCallResult } from '@l-kern/config';

async function customServiceCall(): Promise<ServiceCallResult<User>> {
  const startTime = performance.now();

  try {
    const response = await fetch('http://localhost:8101/users/me', {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const data = await response.json();

    return {
      success: response.ok,
      data,
      error: response.ok ? undefined : data.message,
      responseTime: performance.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      responseTime: performance.now() - startTime,
    };
  }
}

const result = await executeWithRetry(
  customServiceCall,
  { serviceName: 'Users Service', maxRetries: 2 },
  callbacks
);
```

### Example 3: Simplified Ping

```typescript
import { pingWithRetry } from '@l-kern/config';

const result = await pingWithRetry(
  'http://localhost:8105/health',
  'Issues Service',
  {
    onTakingLonger: () => toast.info('Slow connection...'),
    onAllRetriesFailed: () => alert('Service down!'),
  }
);

console.log(`Success: ${result.success}, Attempts: ${result.attempts}, Time: ${result.totalTime}ms`);
```

### Example 4: Database Connection Retry

```typescript
import { executeWithRetry } from '@l-kern/config';

async function connectToDatabase(): Promise<ServiceCallResult<Database>> {
  const startTime = performance.now();

  try {
    const db = await DatabaseClient.connect();
    return {
      success: true,
      data: db,
      responseTime: performance.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      responseTime: performance.now() - startTime,
    };
  }
}

const result = await executeWithRetry(
  connectToDatabase,
  {
    serviceName: 'PostgreSQL',
    maxRetries: 5,        // More retries for DB
    retryDelay: 3000,     // Faster retries
    attemptTimeout: 10000, // Longer timeout
  },
  {
    onAllRetriesFailed: () => {
      console.error('Database unavailable after 5 retries');
      process.exit(1);
    },
  }
);
```

### Example 5: With Loading State Management

```typescript
import { executeWithRetry, createFetchServiceCall } from '@l-kern/config';
import { useState } from 'react';

function MyComponent() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckService = async () => {
    setIsLoading(true);

    const result = await executeWithRetry(
      createFetchServiceCall('http://localhost:8105/health'),
      { serviceName: 'Issues Service' },
      {
        onSuccess: () => {
          setIsLoading(false);
          toast.success('Service is healthy!');
        },
        onAllRetriesFailed: () => {
          setIsLoading(false);
          toast.error('Service is unavailable');
        },
      }
    );
  };

  return (
    <button onClick={handleCheckService} disabled={isLoading}>
      {isLoading ? 'Checking...' : 'Check Service'}
    </button>
  );
}
```

---

## Edge Cases

**Service responds in 500ms:**
```typescript
// onAttemptStart() called at 0ms
// Service returns at 500ms (before takingLongerDelay)
// onTakingLonger() NEVER called
// onSuccess() called
// Result: success=true, attempts=1, tookLonger=false
```

**Service responds in 2000ms:**
```typescript
// onAttemptStart() called at 0ms
// onTakingLonger() called at 1500ms (still waiting)
// Service returns at 2000ms
// onSuccess() called
// Result: success=true, attempts=1, tookLonger=true
```

**Service times out on first attempt, succeeds on retry:**
```typescript
// onAttemptStart() at 0ms
// onTakingLonger() at 1500ms
// Timeout at 5000ms
// onRetry(1, 3) at 5000ms
// Wait 5000ms
// Retry at 10000ms
// Success at 10500ms
// onSuccess() called
// Result: success=true, attempts=2, totalTime=~10500ms
```

**All retries fail:**
```typescript
// Total 4 attempts (1 initial + 3 retries)
// Total time: ~30 seconds
// onAllRetriesFailed() called
// Result: success=false, attempts=4, error="last error message"
```

---

## Known Issues

**No known issues** - Utility is stable and production-ready.

---

## Best Practices

1. **Always provide serviceName** - Used in logs and UI messages
2. **Use appropriate timeouts** - Longer for slow operations (DB), shorter for health checks
3. **Show "taking longer" toast with long duration** - User needs to see it until operation completes
4. **Dismiss toasts on success/failure** - Use `toast.dismiss()` in callbacks
5. **Show modals for all retries failed** - Toast may disappear, modal persists
6. **Log retry results** - Check `result.attempts` and `result.totalTime` for monitoring
7. **Adjust retry configuration per service** - MinIO may need more retries than SQL
8. **Test with service down** - Verify UI feedback works correctly
9. **Use pingWithRetry for simple health checks** - Convenience wrapper

---

## Common Integration Patterns

### Pattern 1: With useStorageOperation Hook

```typescript
// Hook uses executeWithRetry internally
const { execute, state } = useStorageOperation({
  storages: [STORAGE_CONFIGS.issuesSQL],
  retryConfig: {
    maxRetries: 3,
    retryDelay: 5000,
    onSlowOperation: () => toast.info('Slow connection...'),
  },
});
```

### Pattern 2: With useServiceFetch Hook

```typescript
// Hook uses similar retry pattern
const { data, fetch } = useServiceFetch({
  service: SERVICE_CONFIGS.contacts,
  endpoint: '/contacts/123',
  retryCount: 3,
  retryDelay: 2000,
});
```

### Pattern 3: Standalone Health Check

```typescript
import { pingWithRetry } from '@l-kern/config';

async function checkAllServices() {
  const services = [
    { url: 'http://localhost:8101/health', name: 'Contacts' },
    { url: 'http://localhost:8105/health', name: 'Issues' },
  ];

  for (const service of services) {
    const result = await pingWithRetry(service.url, service.name);
    console.log(`${service.name}: ${result.success ? 'UP' : 'DOWN'}`);
  }
}
```

---

## Changelog

### v1.0.0 (2025-11-30)
- ✅ Initial implementation
- ✅ Intelligent "taking longer" detection
- ✅ Quick failure vs slow failure distinction
- ✅ Configurable timing (maxRetries, delays, timeouts)
- ✅ Rich callback system for UI feedback
- ✅ Debug logging with service name prefix
- ✅ Helper functions: createFetchServiceCall, pingWithRetry

---

**End of serviceRetry Documentation**
