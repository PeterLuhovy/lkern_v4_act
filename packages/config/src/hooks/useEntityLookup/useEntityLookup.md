# ================================================================
# useEntityLookup
# ================================================================
# File: L:\system\lkern_codebase_v4_act\packages\config\src\hooks\useEntityLookup\useEntityLookup.md
# Version: 1.0.0
# Created: 2025-11-29
# Updated: 2025-12-10
# Hook Location: packages/config/src/hooks/useEntityLookup/useEntityLookup.ts
# Package: @l-kern/config
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Universal hook for fetching entities from external services with health check,
#   automatic retry, caching with TTL, and comprehensive error handling.
# ================================================================

---

## Overview

**Purpose**: Fetch external entities (contacts, users, etc.) with caching and health checks
**Package**: @l-kern/config
**Path**: packages/config/src/hooks/useEntityLookup
**Since**: v1.0.0

The useEntityLookup hook provides a standardized way to fetch entities from external microservices. It implements service health checking before fetching, automatic retry on failure, entity not found detection (404), caching with configurable TTL (default 5 minutes), and loading/error/unavailable state management. The hook is designed for lookups of related entities like assignees, reporters, or contact references.

**Workflow**: Health Check (optional) → Fetch Entity → Cache → Return Data

---

## Features

- ✅ **Automatic Health Check**: Optional service health check before fetching
- ✅ **7 Status States**: idle, checking, loading, success, service_unavailable, not_found, error
- ✅ **Caching with TTL**: In-memory cache with configurable expiration (default: 5 minutes)
- ✅ **Global Cache**: Cache shared across all hook instances (reduces redundant fetches)
- ✅ **Automatic Retry**: Configurable retry count (default: 1 retry) with delay
- ✅ **Entity Not Found Detection**: Distinguishes 404 (not found) from other errors
- ✅ **Service Unavailable Detection**: Detects 503 and connection errors
- ✅ **Auto-Fetch on Mount**: Optional automatic fetching when entityId changes
- ✅ **Manual Refetch**: refetch() function to reload data
- ✅ **Cache Management**: clearCache() to invalidate cached data
- ✅ **Computed Helpers**: isLoading, isServiceAvailable, entityExists
- ✅ **Batch Variant**: useBatchEntityLookup for fetching multiple entities at once
- ✅ **Mount Safety**: Prevents state updates after component unmount

---

## Quick Start

### Basic Usage

```tsx
import { useEntityLookup } from '@l-kern/config';

function IssueAssigneeDisplay({ assigneeId }: { assigneeId: string | null }) {
  const { data, isLoading, error, entityExists } = useEntityLookup<Contact>({
    service: 'contacts',
    entityId: assigneeId,
    fetcher: async (id) => {
      const response = await fetch(`http://localhost:8101/contacts/${id}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    },
  });

  if (!assigneeId) return <span>Unassigned</span>;
  if (isLoading) return <Spinner size="small" />;
  if (!entityExists) return <span className="not-found">Contact not found (deleted)</span>;
  if (error) return <span className="error">Error loading contact</span>;
  if (data) return <span>{data.name}</span>;

  return null;
}
```

### Common Patterns

#### Pattern 1: With Health Check

```tsx
import { useEntityLookup } from '@l-kern/config';

function ContactLookup({ contactId }: { contactId: string }) {
  const {
    data,
    status,
    isLoading,
    isServiceAvailable,
    refetch,
  } = useEntityLookup<Contact>({
    service: 'contacts',
    entityId: contactId,
    fetcher: async (id) => {
      const res = await fetch(`http://localhost:8101/contacts/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
    healthChecker: async () => {
      const res = await fetch('http://localhost:8101/health');
      return res.ok;
    },
  });

  if (isLoading) {
    return <div>Loading... (status: {status})</div>;
  }

  if (!isServiceAvailable) {
    return (
      <div className="error">
        <p>Contacts service is currently unavailable</p>
        <Button onClick={refetch}>Retry</Button>
      </div>
    );
  }

  return data ? <ContactCard contact={data} /> : null;
}
```

#### Pattern 2: Manual Fetch (No Auto-Fetch)

```tsx
import { useEntityLookup } from '@l-kern/config';

function ContactPicker() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useEntityLookup<Contact>({
    service: 'contacts',
    entityId: selectedId,
    fetcher: (id) => contactsApi.getContact(id),
    autoFetch: false, // Don't fetch on mount
  });

  const handleSelect = (id: string) => {
    setSelectedId(id);
    refetch(); // Manually trigger fetch
  };

  return (
    <div>
      <ContactDropdown onSelect={handleSelect} />
      {isLoading && <Spinner />}
      {data && <ContactPreview contact={data} />}
    </div>
  );
}
```

#### Pattern 3: Custom Cache TTL and Retry

```tsx
import { useEntityLookup } from '@l-kern/config';

function UserLookupWithLongCache({ userId }: { userId: string }) {
  const { data, clearCache } = useEntityLookup<User>({
    service: 'users',
    entityId: userId,
    fetcher: (id) => usersApi.getUser(id),
    cacheTtl: 30 * 60 * 1000, // 30 minutes cache
    retryCount: 3,             // 3 retries on failure
    retryDelay: 2000,          // 2 seconds between retries
  });

  const handleForceRefresh = () => {
    clearCache(); // Clear cached data
    refetch();    // Fetch fresh data
  };

  return (
    <div>
      {data && <UserCard user={data} />}
      <Button onClick={handleForceRefresh}>Force Refresh</Button>
    </div>
  );
}
```

#### Pattern 4: Batch Entity Lookup

```tsx
import { useBatchEntityLookup } from '@l-kern/config';

function IssueListWithAssignees({ issues }: { issues: Issue[] }) {
  const assigneeIds = issues.map((issue) => issue.assignee_id);

  const {
    dataMap,
    statusMap,
    isLoading,
    getData,
    getStatus,
  } = useBatchEntityLookup<Contact>({
    service: 'contacts',
    entityIds: assigneeIds,
    fetcher: (id) => contactsApi.getContact(id),
  });

  if (isLoading) return <Spinner />;

  return (
    <ul>
      {issues.map((issue) => {
        const assignee = getData(issue.assignee_id);
        const status = getStatus(issue.assignee_id);

        return (
          <li key={issue.id}>
            <h3>{issue.title}</h3>
            <p>
              Assignee:{' '}
              {status === 'loading' && 'Loading...'}
              {status === 'not_found' && 'Contact not found'}
              {assignee && assignee.name}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
```

---

## API Reference

### Function Signature

```typescript
function useEntityLookup<T>(
  options: UseEntityLookupOptions<T>
): UseEntityLookupResult<T>
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `options` | `UseEntityLookupOptions<T>` | Yes | Configuration object (see below) |

### Options

```typescript
interface UseEntityLookupOptions<T> {
  service: string;                       // Service name (for caching/logging)
  entityId: string | null | undefined;   // Entity ID to fetch (null = don't fetch)
  fetcher: (id: string) => Promise<T>;   // Function to fetch entity
  healthChecker?: () => Promise<boolean>; // Optional health check function
  cacheTtl?: number;                     // Cache TTL ms (default: 5 * 60 * 1000 = 5 min)
  autoFetch?: boolean;                   // Auto-fetch on mount (default: true)
  retryCount?: number;                   // Retry count on failure (default: 1)
  retryDelay?: number;                   // Retry delay ms (default: 1000)
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `service` | `string` | - | **Required** Service name for caching and logging |
| `entityId` | `string \| null \| undefined` | - | **Required** Entity ID to fetch. If null/undefined, hook stays idle. |
| `fetcher` | `(id: string) => Promise<T>` | - | **Required** Async function to fetch entity by ID |
| `healthChecker` | `() => Promise<boolean>` | `undefined` | Optional function to check service health before fetching |
| `cacheTtl` | `number` | `300000` | Cache time-to-live in milliseconds (default: 5 minutes) |
| `autoFetch` | `boolean` | `true` | Automatically fetch when entityId changes |
| `retryCount` | `number` | `1` | Number of retries on failure (0 = no retry) |
| `retryDelay` | `number` | `1000` | Delay between retries in milliseconds |

### Return Value

```typescript
interface UseEntityLookupResult<T> {
  data: T | null;                    // Fetched entity (null if not loaded)
  status: EntityLookupStatus;        // Current status
  error: string | null;              // Error message
  isLoading: boolean;                // Loading indicator
  isServiceAvailable: boolean;       // Service availability
  entityExists: boolean;             // Entity existence
  refetch: () => Promise<void>;      // Manual refetch
  clearCache: () => void;            // Clear cached data
}
```

| Return Property | Type | Description |
|-----------------|------|-------------|
| `data` | `T \| null` | Fetched entity data. Null if not loaded, error, or not found. |
| `status` | `EntityLookupStatus` | Current status (idle, checking, loading, success, service_unavailable, not_found, error) |
| `error` | `string \| null` | Error message if fetch failed. Null if no error. |
| `isLoading` | `boolean` | Computed helper. True if status is 'checking' or 'loading'. |
| `isServiceAvailable` | `boolean` | Computed helper. True unless status is 'service_unavailable'. |
| `entityExists` | `boolean` | Computed helper. True unless status is 'not_found'. |
| `refetch` | `() => Promise<void>` | Manually trigger refetch. Ignores cache and fetches fresh data. |
| `clearCache` | `() => void` | Clear cached data for this entity. Next refetch will fetch from service. |

### Status States

```typescript
type EntityLookupStatus =
  | 'idle'                  // Initial state, no fetch yet
  | 'checking'              // Checking service health
  | 'loading'               // Service healthy, fetching entity
  | 'success'               // Entity fetched successfully
  | 'service_unavailable'   // Service health check failed
  | 'not_found'             // Entity doesn't exist (404)
  | 'error';                // Other error occurred
```

---

## Batch Variant API

### Function Signature

```typescript
function useBatchEntityLookup<T>(
  options: UseBatchEntityLookupOptions<T>
): UseBatchEntityLookupResult<T>
```

### Batch Options

```typescript
interface UseBatchEntityLookupOptions<T> {
  service: string;
  entityIds: (string | null | undefined)[];
  fetcher: (id: string) => Promise<T>;
  healthChecker?: () => Promise<boolean>;
  cacheTtl?: number;
}
```

### Batch Return Value

```typescript
interface UseBatchEntityLookupResult<T> {
  dataMap: Map<string, T>;                   // Map of entityId -> data
  statusMap: Map<string, EntityLookupStatus>; // Map of entityId -> status
  isLoading: boolean;                         // Overall loading state
  isServiceAvailable: boolean;                // Overall service availability
  getData: (id: string) => T | null;          // Get data for specific entity
  getStatus: (id: string) => EntityLookupStatus; // Get status for specific entity
  refetchAll: () => Promise<void>;            // Refetch all entities
}
```

---

## Behavior

### Internal Logic

**Caching Mechanism:**
- Global cache shared across all hook instances
- Cache key: `${service}:${entityId}`
- Cache entry: `{ data, timestamp, expiresAt }`
- Cache checked before every fetch
- Expired entries automatically removed
- clearCache() invalidates specific entity cache

**Fetch Workflow:**
1. Check if entityId is null → stay idle
2. Check cache → if valid, return cached data
3. If healthChecker provided → check health → if unhealthy, set service_unavailable
4. Fetch entity using fetcher function
5. If successful → cache data → set success status
6. If error → check error type (404, 503, other) → set appropriate status
7. If retry attempts left → wait retryDelay → retry

**Error Detection:**
- 404 / "not found" → status: 'not_found'
- 503 / "unavailable" / "ECONNREFUSED" → status: 'service_unavailable'
- Other errors → retry → if max retries reached → status: 'error'

**State Management:**
- Uses `useState` for: data, status, error
- Uses `useRef` for: isMounted flag, fetcher function, healthChecker function
- State updates only if component is mounted (prevents React warnings)

### Dependencies

**React Hooks Used:**
- `useState` - Manages data, status, error
- `useEffect` - Auto-fetch on entityId change
- `useCallback` - Memoizes fetchEntity and clearCache
- `useMemo` - (not used in this hook)
- `useRef` - Tracks mount state and function refs

**External Dependencies:**
- None (uses native fetch in examples, but fetcher is user-provided)

**Context Dependencies:**
- None (independent hook)

### Memoization

**useCallback Dependencies:**
- `fetchEntity` - Memoized with: entityId, service, cacheTtl, retryCount, retryDelay
- `clearCache` - Memoized with: service, entityId

**useRef Usage (Prevents Infinite Loops):**
- `fetcherRef.current = fetcher` - Allows inline function definitions without infinite loops
- `healthCheckerRef.current = healthChecker` - Same as above
- `isMounted.current` - Prevents state updates after unmount

**Why Ref Pattern Matters:**
Users often pass inline functions like `(id) => api.get(id)` which create new references on every render. Using refs prevents infinite useEffect loops.

---

## Examples

### Example 1: Simple Contact Lookup

```tsx
import { useEntityLookup } from '@l-kern/config';

function ContactName({ contactId }: { contactId: string | null }) {
  const { data, isLoading } = useEntityLookup<Contact>({
    service: 'contacts',
    entityId: contactId,
    fetcher: (id) => contactsApi.getContact(id),
  });

  if (!contactId) return <span>-</span>;
  if (isLoading) return <Spinner size="xs" />;
  return <span>{data?.name || 'Unknown'}</span>;
}
```

### Example 2: With Full Error Handling

```tsx
import { useEntityLookup } from '@l-kern/config';

function UserProfile({ userId }: { userId: string }) {
  const {
    data,
    status,
    error,
    isLoading,
    isServiceAvailable,
    entityExists,
    refetch,
  } = useEntityLookup<User>({
    service: 'users',
    entityId: userId,
    fetcher: (id) => usersApi.getUser(id),
    healthChecker: () => usersApi.health(),
  });

  if (isLoading) {
    return <Spinner message={status === 'checking' ? 'Checking service...' : 'Loading user...'} />;
  }

  if (!isServiceAvailable) {
    return (
      <ErrorState
        message="Users service is currently unavailable"
        action={<Button onClick={refetch}>Retry</Button>}
      />
    );
  }

  if (!entityExists) {
    return <ErrorState message="User not found (may have been deleted)" />;
  }

  if (error) {
    return <ErrorState message={error} action={<Button onClick={refetch}>Retry</Button>} />;
  }

  return data ? <UserCard user={data} /> : null;
}
```

### Example 3: Batch Lookup for List

```tsx
import { useBatchEntityLookup } from '@l-kern/config';

function TeamMembersList({ memberIds }: { memberIds: string[] }) {
  const { dataMap, getData, getStatus, isLoading } = useBatchEntityLookup<User>({
    service: 'users',
    entityIds: memberIds,
    fetcher: (id) => usersApi.getUser(id),
  });

  if (isLoading) return <Spinner />;

  return (
    <ul>
      {memberIds.map((id) => {
        const user = getData(id);
        const status = getStatus(id);

        return (
          <li key={id}>
            {status === 'loading' && <Spinner size="xs" />}
            {status === 'not_found' && <span className="not-found">User not found</span>}
            {user && (
              <div>
                <Avatar src={user.avatar} />
                <span>{user.name}</span>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
```

---

## Known Issues

### Current Known Issues

- ⚠️ **Global Cache Not Persistent**: Cache clears on page refresh
  - **Tracking**: None (by design)
  - **Impact**: Refetches all entities after page reload
  - **Workaround**: Consider using localStorage for persistent cache if needed

### Resolved Issues

- ✅ **FIXED (v1.0.0)**: Inline function references no longer cause infinite loops (uses useRef)
- ✅ **FIXED (v1.0.0)**: No state updates after unmount (isMounted ref check)

---

## Testing

### Test Coverage

- **Unit Tests**: Not yet implemented
- **Integration Tests**: Tested via components using useEntityLookup

### Key Test Cases

1. **Fetches entity and caches result**
2. **Returns cached data on subsequent calls**
3. **Detects 404 and sets not_found status**
4. **Detects 503 and sets service_unavailable status**
5. **Retries on error (retryCount times)**
6. **clearCache() invalidates cached data**
7. **refetch() forces fresh fetch**
8. **Computed helpers return correct values**
9. **Batch lookup fetches multiple entities**
10. **No state updates after component unmount**

---

## Related Components

- [useServiceFetch](../useServiceFetch/useServiceFetch.md) - Similar pattern for service data fetching
- [useAuth](../useAuth/useAuth.md) - Authentication hook (may use entity lookup for user data)

---

## Best Practices

1. **Use for external entity lookups** - Contacts, users, references from other services
2. **Configure appropriate cache TTL** - Longer for static data (users), shorter for frequently changing data
3. **Always handle not_found state** - Show "deleted" or "not found" messages
4. **Provide retry UI** - Let users retry when service is unavailable
5. **Use batch variant for lists** - More efficient than multiple individual lookups
6. **Clear cache after updates** - Call clearCache() after entity is modified
7. **Test with service down** - Verify UI works when external service is unavailable
8. **Handle null entityId** - Component should handle null/undefined IDs gracefully

---

## Changelog

### v1.0.0 (2025-11-29)
- ✅ Initial implementation
- ✅ Caching with TTL (5 minutes default)
- ✅ Health check support
- ✅ Automatic retry
- ✅ Entity not found detection
- ✅ Batch lookup variant
- ✅ Mount-safe state updates

---

**End of useEntityLookup Documentation**
