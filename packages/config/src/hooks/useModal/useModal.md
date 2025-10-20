# ================================================================
# useModal
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\hooks\useModal.md
# Version: 1.0.0
# Created: 2025-10-20
# Updated: 2025-10-20
# Hook Location: packages/config/src/hooks/useModal/useModal.ts
# Package: @l-kern/config
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   React hook for managing modal state lifecycle including open/close
#   operations, submission state tracking, and callback handling with
#   built-in prevention of accidental closes during submissions.
# ================================================================

---

## Overview

**Purpose**: Simplify modal state management with built-in submission protection and lifecycle callbacks
**Package**: @l-kern/config
**Path**: packages/config/src/hooks/useModal
**Since**: v1.0.0

`useModal` provides a complete solution for managing modal dialogs, including open/close state, submission tracking, and callback execution. It automatically prevents modal closing during async operations (form submissions, API calls) to avoid race conditions and data loss.

---

## Features

- ✅ Open/close state management with `isOpen` boolean flag
- ✅ Submission state tracking with `isSubmitting` flag
- ✅ Auto-prevents closing during submission (data loss protection)
- ✅ Callback hooks: `onClose` and `onConfirm` with async support
- ✅ Optional initial open state (`initialOpen` prop)
- ✅ Stable function references with `useCallback` (performance optimized)
- ✅ TypeScript fully typed with generics
- ✅ Zero external dependencies (pure React hooks)

---

## Quick Start

### Basic Usage

```tsx
import { useModal } from '@l-kern/config';
import { Modal } from '@l-kern/ui-components';

function MyComponent() {
  const modal = useModal({
    onClose: () => console.log('Modal closed'),
    onConfirm: () => console.log('Confirmed'),
  });

  return (
    <>
      <button onClick={modal.open}>Open Modal</button>

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        isSubmitting={modal.isSubmitting}
      >
        <p>Modal content</p>
        <button onClick={modal.confirm}>Confirm</button>
      </Modal>
    </>
  );
}
```

### Common Patterns

#### Pattern 1: Form Submission with Loading State

```tsx
import { useModal } from '@l-kern/config';

function EditContactModal() {
  const modal = useModal({
    onConfirm: async () => {
      modal.setIsSubmitting(true);
      try {
        await saveContact();
        modal.close();
      } catch (error) {
        console.error('Save failed:', error);
      } finally {
        modal.setIsSubmitting(false);
      }
    },
  });

  return (
    <Modal isOpen={modal.isOpen} onClose={modal.close}>
      <form onSubmit={modal.confirm}>
        <input name="name" />
        <button type="submit" disabled={modal.isSubmitting}>
          {modal.isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </form>
    </Modal>
  );
}
```

#### Pattern 2: Confirmation Dialog

```tsx
function DeleteButton() {
  const modal = useModal({
    onConfirm: async () => {
      modal.setIsSubmitting(true);
      await deleteContact();
      modal.setIsSubmitting(false);
      modal.close();
    },
  });

  return (
    <>
      <button onClick={modal.open}>Delete</button>

      <Modal isOpen={modal.isOpen} onClose={modal.close}>
        <h2>Are you sure?</h2>
        <p>This action cannot be undone.</p>
        <button onClick={modal.close}>Cancel</button>
        <button onClick={modal.confirm} disabled={modal.isSubmitting}>
          {modal.isSubmitting ? 'Deleting...' : 'Delete'}
        </button>
      </Modal>
    </>
  );
}
```

---

## API Reference

### Function Signature

```typescript
function useModal(options?: UseModalOptions): UseModalReturn
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `options` | `UseModalOptions` | No | Configuration options (see below) |

### Options

```typescript
interface UseModalOptions {
  /**
   * Callback executed when modal is closed
   */
  onClose?: () => void;

  /**
   * Callback executed when confirm button is clicked
   */
  onConfirm?: () => void | Promise<void>;

  /**
   * Initial open state
   * @default false
   */
  initialOpen?: boolean;
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `onClose` | `() => void` | `undefined` | Callback executed when modal closes (via `close()` method) |
| `onConfirm` | `() => void \| Promise<void>` | `undefined` | Callback executed when `confirm()` is called; supports async functions |
| `initialOpen` | `boolean` | `false` | If `true`, modal starts in open state (useful for server-side rendered modals) |

### Return Value

```typescript
interface UseModalReturn {
  /**
   * Whether modal is currently open
   */
  isOpen: boolean;

  /**
   * Open the modal
   */
  open: () => void;

  /**
   * Close the modal (only if not submitting)
   */
  close: () => void;

  /**
   * Execute confirm action (calls onConfirm callback)
   */
  confirm: () => void;

  /**
   * Whether modal is in submitting state (prevents closing)
   */
  isSubmitting: boolean;

  /**
   * Set submitting state
   */
  setIsSubmitting: (submitting: boolean) => void;
}
```

| Return Property | Type | Description |
|-----------------|------|-------------|
| `isOpen` | `boolean` | `true` when modal is open, `false` when closed |
| `open` | `() => void` | Opens modal and resets `isSubmitting` to `false` |
| `close` | `() => void` | Closes modal if `isSubmitting=false`; calls `onClose` callback |
| `confirm` | `() => void` | Calls `onConfirm` callback if provided and `isSubmitting=false` |
| `isSubmitting` | `boolean` | `true` when form is submitting (prevents closing) |
| `setIsSubmitting` | `(submitting: boolean) => void` | Manually set submitting state (use in async operations) |

---

## Behavior

### Internal Logic

**State Management:**
- Maintains two state variables:
  - `isOpen` (boolean) - Modal visibility state
  - `isSubmitting` (boolean) - Submission state (prevents closing)
- Uses `useState` for reactive state updates
- Uses `useCallback` for stable function references

**Open Operation:**
1. Sets `isOpen=true`
2. Resets `isSubmitting=false` (clean slate for new modal session)
3. No callback executed

**Close Operation:**
1. Checks if `isSubmitting=false` (guards against accidental close)
2. If submitting, operation is **silently ignored** (modal stays open)
3. If not submitting, sets `isOpen=false` and executes `onClose` callback

**Confirm Operation:**
1. Checks if `isSubmitting=false` (prevents double submission)
2. If submitting, operation is **silently ignored**
3. If not submitting, executes `onConfirm` callback
4. Does NOT automatically close modal (manual control required)

**Side Effects:**
- None (pure state management hook)
- No DOM manipulation, no API calls, no timers
- No cleanup required on unmount

**Memoization:**
- `open`, `close`, `confirm` functions memoized with `useCallback`
- Dependencies: `[isSubmitting, onClose, onConfirm]`
- Stable references prevent unnecessary child re-renders

### Dependencies

**React Hooks Used:**
- `useState` - Manages `isOpen` and `isSubmitting` state
- `useCallback` - Memoizes `open`, `close`, `confirm` functions for stable references

**External Dependencies:**
- None (zero external packages)

### Re-render Triggers

**Hook re-executes when:**
- `options` object reference changes (callback functions or initialOpen)
- Component re-renders (hook runs on every render)

**Component re-renders when:**
- `isOpen` changes (boolean flip: false → true or true → false)
- `isSubmitting` changes (boolean flip: false → true or true → false)

**Optimization:**
```tsx
// ✅ GOOD - Memoized callbacks prevent re-renders
const handleClose = useCallback(() => {
  console.log('Closed');
}, []);

const modal = useModal({ onClose: handleClose });

// ❌ BAD - Inline function creates new reference every render
const modal = useModal({
  onClose: () => console.log('Closed'), // New function each render!
});
```

---

## Examples

### Example 1: Basic Edit Form Modal

```tsx
import { useModal, useTranslation } from '@l-kern/config';
import { Modal, Button, Input } from '@l-kern/ui-components';
import { useState } from 'react';

interface Contact {
  id: string;
  name: string;
  email: string;
}

function EditContactModal({ contact }: { contact: Contact }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(contact);

  const modal = useModal({
    onClose: () => {
      console.log('Modal closed');
    },
    onConfirm: async () => {
      modal.setIsSubmitting(true);
      try {
        await saveContact(formData);
        modal.close(); // Close after successful save
      } catch (error) {
        console.error('Save failed:', error);
        // Keep modal open on error
      } finally {
        modal.setIsSubmitting(false);
      }
    },
  });

  return (
    <>
      <Button onClick={modal.open}>
        {t('contacts.edit')}
      </Button>

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        isSubmitting={modal.isSubmitting}
        title={t('contacts.editTitle')}
      >
        <form onSubmit={(e) => { e.preventDefault(); modal.confirm(); }}>
          <Input
            label={t('contacts.name')}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={modal.isSubmitting}
          />
          <Input
            label={t('contacts.email')}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={modal.isSubmitting}
          />

          <div className="modal-actions">
            <Button variant="secondary" onClick={modal.close} disabled={modal.isSubmitting}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="primary" disabled={modal.isSubmitting}>
              {modal.isSubmitting ? t('common.saving') : t('common.save')}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
```

### Example 2: Delete Confirmation with Error Handling

```tsx
import { useModal, useTranslation, useToast } from '@l-kern/config';
import { Modal, Button } from '@l-kern/ui-components';

function DeleteContactButton({ contactId }: { contactId: string }) {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const modal = useModal({
    onConfirm: async () => {
      modal.setIsSubmitting(true);
      try {
        await deleteContact(contactId);
        showToast({
          message: t('contacts.deleteSuccess'),
          type: 'success',
        });
        modal.close();
      } catch (error) {
        showToast({
          message: t('contacts.deleteError'),
          type: 'error',
        });
        // Keep modal open on error
      } finally {
        modal.setIsSubmitting(false);
      }
    },
  });

  return (
    <>
      <Button variant="danger" onClick={modal.open}>
        {t('common.delete')}
      </Button>

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        isSubmitting={modal.isSubmitting}
        title={t('contacts.deleteConfirmTitle')}
      >
        <p>{t('contacts.deleteConfirmMessage')}</p>
        <p className="warning">
          {t('contacts.deleteWarning')}
        </p>

        <div className="modal-actions">
          <Button variant="secondary" onClick={modal.close} disabled={modal.isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button variant="danger" onClick={modal.confirm} disabled={modal.isSubmitting}>
            {modal.isSubmitting ? t('common.deleting') : t('common.delete')}
          </Button>
        </div>
      </Modal>
    </>
  );
}
```

### Example 3: Multi-Step Wizard Modal

```tsx
import { useModal, useTranslation } from '@l-kern/config';
import { Modal, Button } from '@l-kern/ui-components';
import { useState } from 'react';

function CreateContactWizard() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const modal = useModal({
    onClose: () => {
      // Reset wizard on close
      setStep(1);
      setFormData({ name: '', email: '', phone: '' });
    },
    onConfirm: async () => {
      if (step < 3) {
        setStep(step + 1); // Next step
      } else {
        // Final step - submit
        modal.setIsSubmitting(true);
        try {
          await createContact(formData);
          modal.close(); // Triggers onClose reset
        } catch (error) {
          console.error('Create failed:', error);
        } finally {
          modal.setIsSubmitting(false);
        }
      }
    },
  });

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <>
      <Button onClick={modal.open}>
        {t('contacts.create')}
      </Button>

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        isSubmitting={modal.isSubmitting}
        title={t('contacts.createWizardTitle')}
      >
        {/* Step 1: Name */}
        {step === 1 && (
          <div>
            <h3>Step 1: Name</h3>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
        )}

        {/* Step 2: Email */}
        {step === 2 && (
          <div>
            <h3>Step 2: Email</h3>
            <input
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        )}

        {/* Step 3: Phone */}
        {step === 3 && (
          <div>
            <h3>Step 3: Phone</h3>
            <input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        )}

        <div className="modal-actions">
          {step > 1 && (
            <Button variant="secondary" onClick={handleBack} disabled={modal.isSubmitting}>
              {t('common.back')}
            </Button>
          )}
          <Button variant="secondary" onClick={modal.close} disabled={modal.isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" onClick={modal.confirm} disabled={modal.isSubmitting}>
            {step < 3 ? t('common.next') : t('common.create')}
          </Button>
        </div>
      </Modal>
    </>
  );
}
```

---

## Performance

### Memoization Strategy

**Memoized Functions:**
- `open` - Stable reference (dependencies: `[]`)
- `close` - Stable reference (dependencies: `[isSubmitting, onClose]`)
- `confirm` - Stable reference (dependencies: `[isSubmitting, onConfirm]`)

**Optimization:**
```typescript
// ✅ GOOD - Memoized callbacks
const handleClose = useCallback(() => {
  console.log('Closed');
}, []);

const handleConfirm = useCallback(async () => {
  await saveData();
}, [saveData]);

const modal = useModal({ onClose: handleClose, onConfirm: handleConfirm });

// ❌ BAD - Inline functions (new reference every render)
const modal = useModal({
  onClose: () => console.log('Closed'),  // New function!
  onConfirm: async () => await saveData(),  // New function!
});

// ✅ FIX - Hoist callbacks outside component if no dependencies
const OPTIONS = {
  onClose: () => console.log('Closed'),
};

function MyComponent() {
  const modal = useModal(OPTIONS); // Stable reference
}
```

### Re-render Triggers

**Hook re-executes when:**
- Component re-renders (hook runs on every render)
- `options` callbacks change (if not memoized)

**Component re-renders when:**
- `isOpen` changes (boolean toggle)
- `isSubmitting` changes (boolean toggle)

**Prevent unnecessary re-renders:**
```typescript
// ✅ Memoize callbacks with useCallback
const handleClose = useCallback(() => {
  // Close logic
}, [dependencies]);

// ✅ Hoist static options outside component
const MODAL_OPTIONS = {
  initialOpen: false,
};
```

### Memory Usage

- **Typical**: <1KB per hook instance
- **Cleanup**: Automatic when component unmounts (no manual cleanup needed)
- **Leaks**: None (no subscriptions, no timers, no event listeners)

### Complexity

- **Time**: O(1) for all operations (constant time)
- **Space**: O(1) (two boolean state variables)

---

## Known Issues

### Active Issues

**No known issues** ✅

### Fixed Issues

See [Changelog](#changelog) section below.

---

## Testing

### Test Coverage
- ✅ **Unit Tests**: 40 tests
- ✅ **Coverage**: 100% (statements, branches, functions, lines)
- ✅ **Hook Tests**: 15 tests (using @testing-library/react)
- ✅ **Edge Cases**: 5 tests (callbacks, submission state)

### Test File
`packages/config/src/hooks/useModal/useModal.test.ts`

### Running Tests
```bash
# Run hook tests
docker exec lkms201-web-ui npx nx test config --testFile=useModal.test.ts

# Run with coverage
docker exec lkms201-web-ui npx nx test config --coverage --testFile=useModal.test.ts

# Watch mode
docker exec lkms201-web-ui npx nx test config --watch --testFile=useModal.test.ts
```

### Key Test Cases

**Basic State:**
- ✅ Initializes with closed state by default
- ✅ Initializes with open state when `initialOpen=true`
- ✅ `isSubmitting` defaults to `false`

**Open/Close Operations:**
- ✅ Opens modal when `open()` called
- ✅ Closes modal when `close()` called
- ✅ Resets `isSubmitting` to `false` when opening

**Callbacks:**
- ✅ Calls `onClose` callback when closing
- ✅ Calls `onConfirm` callback when `confirm()` called
- ✅ Does not throw error if callbacks not provided
- ✅ Handles async `onConfirm` callback

**Submission State Protection:**
- ✅ Prevents closing when `isSubmitting=true`
- ✅ Prevents confirm when `isSubmitting=true`
- ✅ Allows closing after `isSubmitting` reset to `false`

**Integration:**
- ✅ Complete workflow: open → submit → close
- ✅ Multiple open/close cycles work correctly

**Performance:**
- ✅ Function references stable across re-renders (useCallback)

---

## Related Hooks

- **[useModalWizard](useModalWizard.md)** - Multi-step wizard modal hook
- **[useConfirm](useConfirm.md)** - Confirmation dialog hook (built on useModal)
- **[useFormDirty](useFormDirty.md)** - Track unsaved form changes (use with modals)
- **[useToast](useToast.md)** - Toast notifications (show success/error after modal actions)

---

## Related Components

- **[Modal](../components/Modal.md)** - Modal dialog component (uses this hook)
- **[Button](../components/Button.md)** - Button component (trigger modal open/close)

---

## Migration Guide

### From v3 to v4

**No breaking changes** - This is a new hook in v4.

If migrating from manual modal state management in v3:

**v3 (Manual state):**
```tsx
const [isOpen, setIsOpen] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);

const handleClose = () => {
  if (!isSubmitting) {
    setIsOpen(false);
  }
};

const handleConfirm = async () => {
  setIsSubmitting(true);
  await saveData();
  setIsSubmitting(false);
  setIsOpen(false);
};
```

**v4 (useModal hook):**
```tsx
const modal = useModal({
  onConfirm: async () => {
    modal.setIsSubmitting(true);
    await saveData();
    modal.setIsSubmitting(false);
    modal.close();
  },
});
```

---

## Changelog

### v1.0.0 (2025-10-18)
- 🎉 Initial release
- ✅ Open/close state management
- ✅ Submission state tracking
- ✅ Auto-prevents closing during submission
- ✅ Callback support (`onClose`, `onConfirm`)
- ✅ Async `onConfirm` support
- ✅ Stable function references (useCallback)
- ✅ 40 unit tests (100% coverage)

---

## Troubleshooting

### Common Issues

**Issue**: Modal closes during async operation
**Cause**: Forgot to set `isSubmitting=true`
**Solution**:
```tsx
// ❌ BAD - Modal can close during save
const modal = useModal({
  onConfirm: async () => {
    await saveData();
    modal.close();
  },
});

// ✅ GOOD - Submission protected
const modal = useModal({
  onConfirm: async () => {
    modal.setIsSubmitting(true);
    try {
      await saveData();
      modal.close();
    } finally {
      modal.setIsSubmitting(false);
    }
  },
});
```

**Issue**: Modal doesn't close after `confirm()`
**Cause**: `confirm()` does not automatically close modal
**Solution**:
```tsx
// Manually close after successful operation
const modal = useModal({
  onConfirm: async () => {
    modal.setIsSubmitting(true);
    await saveData();
    modal.setIsSubmitting(false);
    modal.close(); // ← Explicitly close!
  },
});
```

**Issue**: Hook re-runs too often (performance)
**Cause**: Callback functions not memoized
**Solution**:
```tsx
// ❌ BAD - New function every render
const modal = useModal({
  onClose: () => console.log('Closed'),
});

// ✅ GOOD - Memoized callback
const handleClose = useCallback(() => {
  console.log('Closed');
}, []);

const modal = useModal({ onClose: handleClose });
```

**Issue**: `onConfirm` not called
**Cause**: `isSubmitting=true` prevents execution
**Solution**:
```tsx
// Check submission state before calling confirm()
if (!modal.isSubmitting) {
  modal.confirm(); // ✅ Will execute
}
```

---

## Best Practices

1. ✅ **Always set isSubmitting** - Wrap async operations in `setIsSubmitting(true/false)`
2. ✅ **Use try/finally** - Ensure `isSubmitting` reset even on errors
3. ✅ **Memoize callbacks** - Prevent unnecessary re-renders with `useCallback`
4. ✅ **Close explicitly** - Call `modal.close()` after successful operations
5. ✅ **Keep modal open on errors** - Only close after successful completion
6. ✅ **Disable buttons during submission** - Use `disabled={modal.isSubmitting}`
7. ✅ **Show loading text** - Update button text during submission
8. ✅ **Reset state on close** - Clean up form data in `onClose` callback
9. ✅ **Don't call conditionally** - Follow React hooks rules (call at top level)
10. ✅ **Use with useFormDirty** - Warn about unsaved changes before closing

---

## Resources

### Internal Links
- [Coding Standards](../programming/coding-standards.md)
- [Testing Guide](../programming/testing-overview.md)
- [Hooks Best Practices](../programming/frontend-standards.md#react-hooks)

### External References
- [React Hooks Documentation](https://react.dev/reference/react)
- [useCallback Hook](https://react.dev/reference/react/useCallback)
- [Rules of Hooks](https://react.dev/warnings/invalid-hook-call-warning)

---

**Last Updated**: 2025-10-20
**Maintainer**: BOSSystems s.r.o.
**Documentation Version**: 1.0.0
