# ================================================================
# useServiceFetch
# ================================================================
# File: L:\system\lkern_codebase_v4_act\packages\config\src\hooks\useServiceFetch\useServiceFetch.md
# Version: 1.0.0
# Created: 2025-11-29
# Updated: 2025-12-10
# Hook Location: packages/config/src/hooks/useServiceFetch/useServiceFetch.ts
# Package: @l-kern/config
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Universal hook for microservice health check and data fetching with comprehensive
#   error handling (unavailable, notFound, error states) and timeout management.
# ================================================================

---

## Overview

**Purpose**: Fetch data from microservices with health check, error handling, and retry logic
**Package**: @l-kern/config
**Path**: packages/config/src/hooks/useServiceFetch
**Since**: v1.0.0

The useServiceFetch hook provides a unified interface for fetching data from L-KERN microservices. It implements a two-step workflow: (1) health check to verify service availability, (2) data fetch if service is healthy. The hook handles various error states (service unavailable, resource not found, generic errors), implements timeout protection with AbortController, and provides computed helpers for UI state management.

---

## Features

- ✅ **Two-Step Workflow**: Health check → Data fetch (can skip health check if needed)
- ✅ **7 Status States**: idle, checking, unavailable, loading, success, notFound, error
- ✅ **Timeout Protection**: Configurable timeouts for health (5s) and data fetch (30s)
- ✅ **AbortController Integration**: Cancels requests on timeout
- ✅ **Comprehensive Error Handling**: Distinguishes service down vs 404 vs other errors
- ✅ **Computed Helpers**: isLoading, isError, isSuccess, isUnavailable, isNotFound
- ✅ **Transform Support**: Optional data transformation function
- ✅ **Retry Mechanism**: retry() function to re-attempt fetch after error
- ✅ **Manual Trigger**: Fetch on demand (immediate mode optional)
- ✅ **Health Check Only**: checkHealth() for availability testing without data fetch
- ✅ **Pre-Defined Configs**: SERVICE_CONFIGS for contacts, issues, config, minio
- ✅ **TypeScript Generics**: Full type safety with <T> data type
- ✅ **HTTP Status Tracking**: Returns statusCode from response

---

## Quick Start

### Basic Usage

```tsx
import { useServiceFetch, SERVICE_CONFIGS } from '@l-kern/config';

function ContactDetails({ contactId }: { contactId: string }) {
  const { data, status, fetch, isLoading, isUnavailable, isNotFound } = useServiceFetch<Contact>({
    service: SERVICE_CONFIGS.contacts,
    endpoint: `/contacts/${contactId}`,
  });

  useEffect(() => {
    fetch(); // Trigger fetch on mount
  }, [fetch, contactId]);

  if (isUnavailable) {
    return <p>Contacts service is currently unavailable. Please try again later.</p>;
  }

  if (isNotFound) {
    return <p>Contact not found - may have been deleted.</p>;
  }

  if (isLoading) {
    return <p>Loading contact...</p>;
  }

  if (data) {
    return <ContactCard contact={data} />;
  }

  return null;
}
```

### Common Patterns

#### Pattern 1: Fetch on Button Click (Manual Trigger)

```tsx
import { useServiceFetch, SERVICE_CONFIGS } from '@l-kern/config';

function IssueLoader() {
  const { data, fetch, isLoading, isError, error } = useServiceFetch<Issue>({
    service: SERVICE_CONFIGS.issues,
    endpoint: '/issues/latest',
  });

  const handleLoadIssue = async () => {
    const result = await fetch();
    if (result) {
      console.log('Issue loaded:', result);
    }
  };

  return (
    <div>
      <button onClick={handleLoadIssue} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Load Latest Issue'}
      </button>

      {isError && <p className="error">{error}</p>}
      {data && <IssueCard issue={data} />}
    </div>
  );
}
```

#### Pattern 2: Retry on Error

```tsx
import { useServiceFetch, SERVICE_CONFIGS } from '@l-kern/config';

function ContactFetcher({ contactId }: { contactId: string }) {
  const { data, status, retry, isError, isUnavailable, error } = useServiceFetch<Contact>({
    service: SERVICE_CONFIGS.contacts,
    endpoint: `/contacts/${contactId}`,
  });

  if (isError || isUnavailable) {
    return (
      <div className="error-state">
        <p>{error}</p>
        <button onClick={retry}>Retry</button>
      </div>
    );
  }

  return data ? <ContactCard contact={data} /> : <Spinner />;
}
```

#### Pattern 3: Health Check Only (No Data Fetch)

```tsx
import { useServiceFetch, SERVICE_CONFIGS } from '@l-kern/config';

function ServiceStatusChecker() {
  const { checkHealth, status } = useServiceFetch({
    service: SERVICE_CONFIGS.issues,
    endpoint: '/issues', // Not used for health check
  });

  const handleCheckHealth = async () => {
    const isHealthy = await checkHealth();
    console.log('Issues service healthy:', isHealthy);
  };

  return (
    <div>
      <button onClick={handleCheckHealth}>Check Issues Service</button>
      <p>Status: {status}</p>
    </div>
  );
}
```

#### Pattern 4: Skip Health Check (Direct Fetch)

```tsx
import { useServiceFetch } from '@l-kern/config';

function FastDataLoader() {
  const { data, fetch } = useServiceFetch<Config>({
    service: {
      baseUrl: 'http://localhost:8102',
      skipHealthCheck: true, // Skip health check for faster load
    },
    endpoint: '/config/app-settings',
  });

  useEffect(() => {
    fetch(); // Directly fetches data without health check
  }, [fetch]);

  return data ? <ConfigDisplay config={data} /> : <Spinner />;
}
```

#### Pattern 5: Data Transformation

```tsx
import { useServiceFetch, SERVICE_CONFIGS } from '@l-kern/config';

interface RawContact {
  id: string;
  full_name: string;
  email_address: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
}

function ContactViewer({ contactId }: { contactId: string }) {
  const { data, fetch } = useServiceFetch<Contact>({
    service: SERVICE_CONFIGS.contacts,
    endpoint: `/contacts/${contactId}`,
    transform: (raw: RawContact) => ({
      id: raw.id,
      name: raw.full_name,
      email: raw.email_address,
    }),
  });

  useEffect(() => {
    fetch();
  }, [fetch, contactId]);

  return data ? <ContactCard contact={data} /> : <Spinner />;
}
```

---

## API Reference

### Function Signature

```typescript
function useServiceFetch<T = unknown>(
  options: UseServiceFetchOptions<T>
): UseServiceFetchReturn<T>
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `options` | `UseServiceFetchOptions<T>` | Yes | Configuration object (see below) |

### Options

```typescript
interface UseServiceFetchOptions<T> {
  service: ServiceConfig;         // Service configuration
  endpoint: string;                // Data endpoint path (e.g., '/contacts/123')
  transform?: (data: unknown) => T; // Optional data transformation
  immediate?: boolean;             // Fetch on mount (default: false)
}

interface ServiceConfig {
  baseUrl: string;                 // Base URL (e.g., 'http://localhost:8101')
  healthEndpoint?: string;         // Health check path (default: '/health')
  healthTimeout?: number;          // Health timeout ms (default: 5000)
  fetchTimeout?: number;           // Fetch timeout ms (default: 30000)
  skipHealthCheck?: boolean;       // Skip health check (default: false)
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `service.baseUrl` | `string` | - | **Required** Base URL of the microservice |
| `service.healthEndpoint` | `string` | `'/health'` | Health check endpoint path |
| `service.healthTimeout` | `number` | `5000` | Health check timeout in milliseconds |
| `service.fetchTimeout` | `number` | `30000` | Data fetch timeout in milliseconds |
| `service.skipHealthCheck` | `boolean` | `false` | Skip health check and fetch directly |
| `endpoint` | `string` | - | **Required** Data endpoint path |
| `transform` | `(data: unknown) => T` | `undefined` | Transform response data before returning |
| `immediate` | `boolean` | `false` | Automatically fetch on mount (not yet implemented) |

### Return Value

```typescript
interface UseServiceFetchReturn<T> {
  // State
  status: ServiceFetchStatus;      // Current status (7 possible values)
  data: T | null;                  // Fetched data (null if not loaded)
  error: string | null;            // Error message (null if no error)
  statusCode: number | null;       // HTTP status code from response

  // Methods
  fetch: () => Promise<T | null>;  // Trigger fetch manually
  reset: () => void;               // Reset state to idle
  checkHealth: () => Promise<boolean>; // Check service health only
  retry: () => Promise<T | null>;  // Retry after error

  // Computed Helpers
  isLoading: boolean;              // True if checking or loading
  isError: boolean;                // True if status === 'error'
  isSuccess: boolean;              // True if status === 'success'
  isUnavailable: boolean;          // True if status === 'unavailable'
  isNotFound: boolean;             // True if status === 'notFound'
}
```

| Return Property | Type | Description |
|-----------------|------|-------------|
| `status` | `ServiceFetchStatus` | Current fetch status (idle, checking, unavailable, loading, success, notFound, error) |
| `data` | `T \| null` | Fetched data. Null until successfully loaded. |
| `error` | `string \| null` | Error message. Null if no error occurred. |
| `statusCode` | `number \| null` | HTTP status code from last response. Null if network error. |
| `fetch` | `() => Promise<T \| null>` | Trigger fetch manually. Returns data on success, null on error. |
| `reset` | `() => void` | Reset state to idle (clears data, error, status). |
| `checkHealth` | `() => Promise<boolean>` | Check service health without fetching data. Returns true if healthy. |
| `retry` | `() => Promise<T \| null>` | Retry fetch after error. Same as calling fetch() again. |
| `isLoading` | `boolean` | Computed helper. True if status is 'checking' or 'loading'. |
| `isError` | `boolean` | Computed helper. True if status is 'error'. |
| `isSuccess` | `boolean` | Computed helper. True if status is 'success'. |
| `isUnavailable` | `boolean` | Computed helper. True if status is 'unavailable'. |
| `isNotFound` | `boolean` | Computed helper. True if status is 'notFound'. |

### Status States

```typescript
type ServiceFetchStatus =
  | 'idle'          // Initial state, not started
  | 'checking'      // Checking service health
  | 'unavailable'   // Service is down (503, network error)
  | 'loading'       // Fetching data from service
  | 'success'       // Data fetched successfully
  | 'notFound'      // Resource not found (404) - deleted or doesn't exist
  | 'error';        // Other error occurred
```

### Pre-Defined Service Configurations

```typescript
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
```

---

## Behavior

### Internal Logic

**Two-Step Workflow:**
1. **Health Check** (unless `skipHealthCheck: true`)
   - Fetch `${baseUrl}${healthEndpoint}` (default: `/health`)
   - Timeout after `healthTimeout` ms (default: 5000ms)
   - If response.ok, proceed to step 2
   - If error, set status to 'unavailable' and stop

2. **Data Fetch**
   - Fetch `${baseUrl}${endpoint}`
   - Timeout after `fetchTimeout` ms (default: 30000ms)
   - If response.ok, parse JSON and set status to 'success'
   - If 404, set status to 'notFound'
   - If 503, set status to 'unavailable'
   - If other error, set status to 'error'

**State Management:**
- Uses `useState` to manage: status, data, error, statusCode
- State updates trigger re-renders in all components using the hook
- State persists across re-renders until reset() is called

**AbortController:**
- Creates AbortController for each request
- Cancels request if timeout is reached
- Cleans up timeout on successful response

**Error Handling:**
- Network errors → status: 'unavailable'
- 404 status → status: 'notFound'
- 503 status → status: 'unavailable'
- Other errors → status: 'error'
- Captures error messages from response.json().detail if available

### Dependencies

**React Hooks Used:**
- `useState` - Manages fetch state
- `useCallback` - Memoizes fetch, reset, checkHealth, retry functions

**External Dependencies:**
- None (uses native fetch API)

**Context Dependencies:**
- None (independent hook)

### Memoization

**useCallback Dependencies:**
- `checkHealth` - Memoized with: baseUrl, healthEndpoint, healthTimeout
- `fetchData` - Memoized with: baseUrl, endpoint, skipHealthCheck, checkHealth, fetchTimeout, transform
- `reset` - Memoized with: [] (no dependencies)
- `retry` - Memoized with: fetchData

**Why Memoization Matters:**
- Prevents infinite loops when using hook with useEffect
- Ensures fetch() reference stays stable unless dependencies change
- Allows safe use of fetch in useEffect dependency array

---

## Workflow Diagram

```
User calls fetch()
     ↓
[skipHealthCheck?]
     ↓ No                    ↓ Yes (skip to data fetch)
Set status: 'checking'
     ↓
Fetch health endpoint
     ↓
[Response OK?]
     ↓ No                    ↓ Yes
Set status: 'unavailable' → Set status: 'loading'
     ↓                           ↓
Return null                 Fetch data endpoint
                                ↓
                            [Response Status?]
                                ↓
        ┌───────────────┬────────────────┬────────────────┐
        ↓ 200 OK        ↓ 404            ↓ 503            ↓ Other
Set status: 'success'   'notFound'       'unavailable'    'error'
        ↓               ↓                ↓                ↓
    Return data     Return null      Return null      Return null
```

---

## Examples

### Example 1: Basic Contact Fetch

```tsx
import { useServiceFetch, SERVICE_CONFIGS } from '@l-kern/config';
import { useEffect } from 'react';

function ContactCard({ contactId }: { contactId: string }) {
  const { data, fetch, isLoading } = useServiceFetch<Contact>({
    service: SERVICE_CONFIGS.contacts,
    endpoint: `/contacts/${contactId}`,
  });

  useEffect(() => {
    fetch();
  }, [fetch, contactId]);

  if (isLoading) return <Spinner />;
  if (!data) return null;

  return (
    <div>
      <h2>{data.name}</h2>
      <p>{data.email}</p>
    </div>
  );
}
```

### Example 2: Complete Error Handling

```tsx
import { useServiceFetch, SERVICE_CONFIGS } from '@l-kern/config';

function IssueViewer({ issueId }: { issueId: string }) {
  const {
    data,
    fetch,
    retry,
    status,
    error,
    isLoading,
    isUnavailable,
    isNotFound,
    isError,
  } = useServiceFetch<Issue>({
    service: SERVICE_CONFIGS.issues,
    endpoint: `/issues/${issueId}`,
  });

  useEffect(() => {
    fetch();
  }, [fetch, issueId]);

  if (isLoading) {
    return <Spinner message="Loading issue..." />;
  }

  if (isUnavailable) {
    return (
      <ErrorState
        message="Issues service is currently unavailable"
        action={<button onClick={retry}>Retry</button>}
      />
    );
  }

  if (isNotFound) {
    return <ErrorState message="Issue not found - may have been deleted" />;
  }

  if (isError) {
    return (
      <ErrorState
        message={error || 'Unknown error occurred'}
        action={<button onClick={retry}>Retry</button>}
      />
    );
  }

  return data ? <IssueDetails issue={data} /> : null;
}
```

### Example 3: Custom Service Configuration

```tsx
import { useServiceFetch } from '@l-kern/config';

function CustomServiceData() {
  const { data, fetch } = useServiceFetch<MyData>({
    service: {
      baseUrl: 'http://localhost:9999',
      healthEndpoint: '/api/health',
      healthTimeout: 3000,   // 3 second health timeout
      fetchTimeout: 60000,   // 60 second data timeout
    },
    endpoint: '/api/data',
  });

  useEffect(() => {
    fetch();
  }, [fetch]);

  return data ? <DataDisplay data={data} /> : <Spinner />;
}
```

### Example 4: Transform Response Data

```tsx
import { useServiceFetch, SERVICE_CONFIGS } from '@l-kern/config';

interface RawIssue {
  issue_id: string;
  issue_title: string;
  created_at: string;
}

interface Issue {
  id: string;
  title: string;
  createdAt: Date;
}

function IssueList() {
  const { data, fetch } = useServiceFetch<Issue[]>({
    service: SERVICE_CONFIGS.issues,
    endpoint: '/issues',
    transform: (raw: RawIssue[]) =>
      raw.map(issue => ({
        id: issue.issue_id,
        title: issue.issue_title,
        createdAt: new Date(issue.created_at),
      })),
  });

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <ul>
      {data?.map(issue => (
        <li key={issue.id}>
          {issue.title} - {issue.createdAt.toLocaleDateString()}
        </li>
      ))}
    </ul>
  );
}
```

---

## Known Issues

### Current Known Issues

- ⚠️ **No Automatic Retry**: Must call retry() manually
  - **Tracking**: None (by design)
  - **Impact**: User must implement retry UI
  - **Workaround**: Use retry() function in error state UI

- ⚠️ **immediate Option Not Implemented**: `immediate: true` doesn't work yet
  - **Tracking**: None
  - **Impact**: Must call fetch() manually in useEffect
  - **Workaround**: Use useEffect to call fetch() on mount

### Resolved Issues

- ✅ **FIXED (v1.0.0)**: Timeout cancellation works correctly with AbortController
- ✅ **FIXED (v1.0.0)**: Status states clearly distinguish unavailable vs notFound vs error

---

## Testing

### Test Coverage

- **Unit Tests**: Not yet implemented
- **Integration Tests**: Tested via components using useServiceFetch
- **Component Tests**: Tested in ContactDetails, IssueViewer components

### Key Test Cases

1. **Fetches data successfully**
2. **Sets status to 'unavailable' when service is down**
3. **Sets status to 'notFound' when endpoint returns 404**
4. **Times out health check after healthTimeout**
5. **Times out data fetch after fetchTimeout**
6. **Transforms data with transform function**
7. **retry() re-attempts fetch**
8. **reset() clears state to idle**
9. **checkHealth() returns boolean without fetching data**
10. **Computed helpers (isLoading, isError, etc.) return correct values**

---

## Related Components

- [useStorageOperation](../useStorageOperation/useStorageOperation.md) - Similar pattern for multi-storage operations
- [serviceRetry](../../utils/serviceRetry/serviceRetry.md) - Utility for retry logic with exponential backoff
- [api-config.ts](../../constants/api-config.md) - Service URL configuration

---

## Best Practices

1. **Always handle all status states** - Check isUnavailable, isNotFound, isError, isSuccess
2. **Use SERVICE_CONFIGS** - Pre-defined configs for consistency
3. **Provide retry UI** - Let users retry after errors
4. **Set appropriate timeouts** - Longer for slow endpoints, shorter for health checks
5. **Use transform for data mapping** - Keep response transformation in one place
6. **Don't skip health check unnecessarily** - Health check prevents wasted requests to down services
7. **Memoize fetch calls** - Use useEffect with [fetch] dependency to prevent infinite loops
8. **Show loading states** - Use isLoading for spinner display
9. **Test with services down** - Verify UI works when microservices are unavailable

---

## Changelog

### v1.0.0 (2025-11-29)
- ✅ Initial implementation
- ✅ Two-step workflow (health check + data fetch)
- ✅ 7 status states with computed helpers
- ✅ Timeout protection with AbortController
- ✅ Transform function support
- ✅ Pre-defined SERVICE_CONFIGS for L-KERN services
- ⚠️ immediate option not yet implemented

---

**End of useServiceFetch Documentation**
