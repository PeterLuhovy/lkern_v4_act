# ================================================================
# useToast
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\hooks\useToast.md
# Version: 1.0.0
# Created: 2025-10-20
# Updated: 2025-10-20
# Hook Location: packages/config/src/hooks/useToast/useToast.ts
# Package: @l-kern/config
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   React hook providing a simple API for displaying toast notifications
#   with support for success, error, warning, and info message types.
#   Wraps the toastManager utility for convenient usage in components.
# ================================================================

---

## Overview

**Purpose**: Simplify toast notification display with a React hooks API
**Package**: @l-kern/config
**Path**: packages/config/src/hooks/useToast
**Since**: v1.0.0

`useToast` provides a convenient React hooks interface for displaying toast notifications. It wraps the underlying `toastManager` utility and offers shorthand methods for common toast types (success, error, warning, info). All methods return a toast ID for manual dismissal.

---

## Features

- ✅ Simple API for showing/hiding toast notifications
- ✅ Shorthand methods: `success()`, `error()`, `warning()`, `info()`
- ✅ Generic `showToast()` method with custom options
- ✅ Manual dismissal via `hideToast(id)`
- ✅ Clear all toasts with `clearAll()`
- ✅ Returns toast ID for tracking
- ✅ TypeScript fully typed
- ✅ Zero external dependencies (wraps toastManager)

---

## Quick Start

### Basic Usage

```tsx
import { useToast } from '@l-kern/config';

function MyComponent() {
  const toast = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      toast.success('Data saved successfully!');
    } catch (error) {
      toast.error('Failed to save data.');
    }
  };

  return (
    <button onClick={handleSave}>Save</button>
  );
}
```

### Common Patterns

#### Pattern 1: Success/Error Feedback

```tsx
import { useToast, useTranslation } from '@l-kern/config';

function ContactForm() {
  const toast = useToast();
  const { t } = useTranslation();

  const handleSubmit = async (data) => {
    try {
      await createContact(data);
      toast.success(t('contacts.createSuccess'));
    } catch (error) {
      toast.error(t('contacts.createError'));
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

#### Pattern 2: Manual Dismissal

```tsx
import { useToast } from '@l-kern/config';
import { useState } from 'react';

function UploadProgress() {
  const toast = useToast();
  const [toastId, setToastId] = useState<string | null>(null);

  const handleUploadStart = () => {
    const id = toast.info('Uploading file...', { duration: 0 }); // Persistent toast
    setToastId(id);
  };

  const handleUploadComplete = () => {
    if (toastId) {
      toast.hideToast(toastId);
    }
    toast.success('Upload complete!');
  };

  return (
    <>
      <button onClick={handleUploadStart}>Upload</button>
      <button onClick={handleUploadComplete}>Finish</button>
    </>
  );
}
```

---

## API Reference

### Function Signature

```typescript
function useToast(): UseToastReturn
```

### Return Value

```typescript
interface UseToastReturn {
  showToast: (message: string, options?: ToastOptions) => string;
  hideToast: (id: string) => void;
  clearAll: () => void;
  success: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  error: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  warning: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  info: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
}
```

| Return Property | Type | Description |
|-----------------|------|-------------|
| `showToast` | `(message: string, options?: ToastOptions) => string` | Shows toast with custom options; returns toast ID |
| `hideToast` | `(id: string) => void` | Manually dismisses toast by ID |
| `clearAll` | `() => void` | Dismisses all active toasts |
| `success` | `(message: string, options?) => string` | Shows success toast (green); returns ID |
| `error` | `(message: string, options?) => string` | Shows error toast (red); returns ID |
| `warning` | `(message: string, options?) => string` | Shows warning toast (orange); returns ID |
| `info` | `(message: string, options?) => string` | Shows info toast (blue); returns ID |

### ToastOptions Type

```typescript
interface ToastOptions {
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;           // Duration in ms (default: 3000)
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
  dismissible?: boolean;       // Show close button (default: true)
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | Toast type (color scheme) |
| `duration` | `number` | `3000` | Auto-dismiss after N milliseconds; `0` = no auto-dismiss |
| `position` | `ToastPosition` | `'top-right'` | Screen position for toast |
| `dismissible` | `boolean` | `true` | If `false`, hides close button |

---

## Behavior

### Internal Logic

**Hook Wrapper:**
- `useToast` is a thin wrapper around `toastManager` utility
- Uses `useCallback` to memoize all methods for stable references
- No internal state (stateless hook)

**Toast Display:**
1. `showToast()` or shorthand method called
2. Calls `toastManager.show()` with message and options
3. `toastManager` generates unique toast ID
4. Returns toast ID to caller
5. Toast auto-dismisses after `duration` (if not 0)

**Manual Dismissal:**
1. `hideToast(id)` called with toast ID
2. Calls `toastManager.hide(id)`
3. Toast removed from DOM immediately

**Side Effects:**
- None (delegated to toastManager utility)
- No cleanup required on unmount

**Memoization:**
- All methods memoized with `useCallback`
- Empty dependencies (stable references)

### Dependencies

**React Hooks Used:**
- `useCallback` - Memoizes all toast methods

**Internal Dependencies:**
- `useTranslation` - Translation hook (imported but not actively used in current implementation)
- `toastManager` - Utility managing toast lifecycle and rendering

**External Dependencies:**
- None (zero external packages)

### Re-render Triggers

**Hook re-executes when:**
- Component re-renders (hook runs on every render)

**Component re-renders when:**
- Never (calling toast methods does NOT trigger re-renders)

**Performance Note**: Hook is extremely lightweight; no performance concerns.

---

## Examples

### Example 1: Basic Success/Error Toasts

```tsx
import { useToast, useTranslation } from '@l-kern/config';

function SaveButton({ data }) {
  const toast = useToast();
  const { t } = useTranslation();

  const handleSave = async () => {
    try {
      await saveContact(data);
      toast.success(t('contacts.saveSuccess'));
    } catch (error) {
      toast.error(t('contacts.saveError'));
    }
  };

  return (
    <button onClick={handleSave}>
      {t('common.save')}
    </button>
  );
}
```

### Example 2: Warning and Info Toasts

```tsx
import { useToast } from '@l-kern/config';

function FormValidator({ formData }) {
  const toast = useToast();

  const handleValidate = () => {
    if (!formData.email) {
      toast.warning('Email is required');
      return false;
    }

    if (formData.age < 18) {
      toast.info('Age verification required');
      return false;
    }

    return true;
  };

  return (
    <button onClick={handleValidate}>
      Validate
    </button>
  );
}
```

### Example 3: Custom Duration and Position

```tsx
import { useToast } from '@l-kern/config';

function NotificationSettings() {
  const toast = useToast();

  const showShortToast = () => {
    toast.success('Quick message', { duration: 1000 }); // 1 second
  };

  const showLongToast = () => {
    toast.warning('Important notice', { duration: 10000 }); // 10 seconds
  };

  const showPersistentToast = () => {
    toast.info('This stays until dismissed', { duration: 0 }); // No auto-dismiss
  };

  const showTopCenterToast = () => {
    toast.success('Centered at top', { position: 'top-center' });
  };

  return (
    <div>
      <button onClick={showShortToast}>Short Toast</button>
      <button onClick={showLongToast}>Long Toast</button>
      <button onClick={showPersistentToast}>Persistent Toast</button>
      <button onClick={showTopCenterToast}>Top Center Toast</button>
    </div>
  );
}
```

### Example 4: Manual Toast Dismissal

```tsx
import { useToast } from '@l-kern/config';
import { useState } from 'react';

function FileUploader() {
  const toast = useToast();
  const [uploadToastId, setUploadToastId] = useState<string | null>(null);

  const handleUploadStart = () => {
    const id = toast.info('Uploading file...', {
      duration: 0, // Don't auto-dismiss
      dismissible: false, // No close button
    });
    setUploadToastId(id);
  };

  const handleUploadProgress = (progress: number) => {
    // Optionally update toast message (requires toastManager.update method)
    console.log(`Upload progress: ${progress}%`);
  };

  const handleUploadComplete = () => {
    // Dismiss upload toast
    if (uploadToastId) {
      toast.hideToast(uploadToastId);
      setUploadToastId(null);
    }

    // Show success toast
    toast.success('File uploaded successfully!');
  };

  const handleUploadError = () => {
    // Dismiss upload toast
    if (uploadToastId) {
      toast.hideToast(uploadToastId);
      setUploadToastId(null);
    }

    // Show error toast
    toast.error('Upload failed. Please try again.');
  };

  return (
    <div>
      <button onClick={handleUploadStart}>Upload File</button>
      <button onClick={handleUploadComplete}>Simulate Success</button>
      <button onClick={handleUploadError}>Simulate Error</button>
    </div>
  );
}
```

### Example 5: Clear All Toasts

```tsx
import { useToast } from '@l-kern/config';

function NotificationCenter() {
  const toast = useToast();

  const showMultipleToasts = () => {
    toast.success('Task 1 completed');
    toast.success('Task 2 completed');
    toast.success('Task 3 completed');
    toast.info('All tasks finished!');
  };

  const dismissAllToasts = () => {
    toast.clearAll();
  };

  return (
    <div>
      <button onClick={showMultipleToasts}>Show Multiple Toasts</button>
      <button onClick={dismissAllToasts}>Clear All</button>
    </div>
  );
}
```

---

## Performance

### Memoization Strategy

**Memoized Functions:**
- All methods memoized with `useCallback`
- Empty dependencies (stable references)

**Optimization:**
```tsx
// ✅ GOOD - Hook is already optimized
const toast = useToast();
toast.success('Message');

// No further optimization needed (no re-render triggers)
```

### Re-render Triggers

**Hook re-executes when:**
- Component re-renders

**Component re-renders when:**
- Never (toast methods do NOT cause re-renders)

**Performance Note**: Hook is extremely lightweight; no performance concerns.

### Memory Usage

- **Typical**: <1KB per hook instance
- **Cleanup**: No cleanup needed (delegated to toastManager)
- **Leaks**: None

### Complexity

- **Time**: O(1) for all operations (constant time)
- **Space**: O(1) (no state maintained)

---

## Known Issues

### Active Issues

**No known issues** ✅

### Fixed Issues

See [Changelog](#changelog) section below.

---

## Testing

### Test Coverage
- ✅ **Unit Tests**: 19 tests
- ✅ **Coverage**: 100% (statements, branches, functions, lines)
- ✅ **Hook Tests**: 8 tests (using @testing-library/react)

### Test File
`packages/config/src/hooks/useToast/useToast.test.ts`

### Running Tests
```bash
# Run hook tests
docker exec lkms201-web-ui npx nx test config --testFile=useToast.test.ts

# Run with coverage
docker exec lkms201-web-ui npx nx test config --coverage --testFile=useToast.test.ts

# Watch mode
docker exec lkms201-web-ui npx nx test config --watch --testFile=useToast.test.ts
```

### Key Test Cases

**API Methods:**
- ✅ Returns all toast API methods
- ✅ `showToast()` calls `toastManager.show()`
- ✅ `hideToast()` calls `toastManager.hide()`
- ✅ `clearAll()` calls `toastManager.clearAll()`

**Type-Specific Methods:**
- ✅ `success()` calls show with `type: 'success'`
- ✅ `error()` calls show with `type: 'error'`
- ✅ `warning()` calls show with `type: 'warning'`
- ✅ `info()` calls show with `type: 'info'`

---

## Related Hooks

- **[useModal](useModal.md)** - Modal state management (show success toast after save)
- **[useFormDirty](useFormDirty.md)** - Track unsaved changes (warn with toast)
- **[usePageAnalytics](usePageAnalytics.md)** - Track user interactions (log toast displays)

---

## Related Components

- **[Toast](../components/Toast.md)** - Toast notification component (rendered by toastManager)
- **[Button](../components/Button.md)** - Trigger toasts on button clicks

---

## Related Utilities

- **[toastManager](../utils/toast-manager.md)** - Underlying toast management utility

---

## Migration Guide

### From v3 to v4

**No breaking changes** - This is a new hook in v4.

If migrating from custom toast implementation in v3:

**v3 (Custom implementation):**
```tsx
import { showNotification } from './notifications';

const handleSave = () => {
  showNotification('Saved!', 'success');
};
```

**v4 (useToast hook):**
```tsx
import { useToast } from '@l-kern/config';

const toast = useToast();
const handleSave = () => {
  toast.success('Saved!');
};
```

---

## Changelog

### v1.0.0 (2025-10-19)
- 🎉 Initial release
- ✅ `showToast()` method with custom options
- ✅ Shorthand methods: `success()`, `error()`, `warning()`, `info()`
- ✅ `hideToast(id)` for manual dismissal
- ✅ `clearAll()` for batch dismissal
- ✅ Returns toast ID for tracking
- ✅ 19 unit tests (100% coverage)

---

## Troubleshooting

### Common Issues

**Issue**: Toast not appearing
**Cause**: `ToastContainer` component not mounted in app
**Solution**:
```tsx
// Ensure ToastContainer is rendered in app root
import { ToastContainer } from '@l-kern/ui-components';

function App() {
  return (
    <>
      <ToastContainer />
      <YourApp />
    </>
  );
}
```

**Issue**: Toast dismissed immediately
**Cause**: Default duration too short
**Solution**:
```tsx
// Increase duration
toast.success('Message', { duration: 5000 }); // 5 seconds

// Or make persistent
toast.info('Persistent', { duration: 0 }); // No auto-dismiss
```

**Issue**: Can't dismiss toast manually
**Cause**: Forgot to store toast ID
**Solution**:
```tsx
// ❌ BAD - ID not stored
toast.info('Loading...');

// ✅ GOOD - Store ID for later dismissal
const toastId = toast.info('Loading...', { duration: 0 });
// Later:
toast.hideToast(toastId);
```

---

## Best Practices

1. ✅ **Use shorthand methods** - Prefer `toast.success()` over `toast.showToast('msg', { type: 'success' })`
2. ✅ **Use translations** - Always use `t()` for toast messages (multi-language support)
3. ✅ **Store IDs for manual dismissal** - Save toast ID if you need to dismiss later
4. ✅ **Set duration=0 for persistent toasts** - Use for loading states
5. ✅ **Clear all on navigation** - Call `toast.clearAll()` when navigating away
6. ✅ **Don't spam toasts** - Limit to 1-2 toasts at a time
7. ✅ **Use appropriate types** - Success for confirmations, error for failures, warning for cautions, info for general notices
8. ✅ **Keep messages short** - Max 1-2 sentences (toasts are temporary)
9. ✅ **Test toast displays** - Verify toasts appear and dismiss correctly
10. ✅ **Don't use for critical information** - Use modals for important confirmations

---

## Resources

### Internal Links
- [Coding Standards](../programming/coding-standards.md)
- [Testing Guide](../programming/testing-overview.md)
- [Hooks Best Practices](../programming/frontend-standards.md#react-hooks)

### External References
- [React Hooks Documentation](https://react.dev/reference/react)
- [Toast UI Patterns](https://www.nngroup.com/articles/toast/)
- [WCAG Toast Guidelines](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)

---

**Last Updated**: 2025-10-20
**Maintainer**: BOSSystems s.r.o.
**Documentation Version**: 1.0.0
