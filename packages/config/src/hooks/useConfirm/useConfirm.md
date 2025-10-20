# ================================================================
# useConfirm
# ================================================================
# File: L:\system\lkern_codebase_v4_act\packages\config\src\hooks\useConfirm\useConfirm.md
# Version: 1.0.0
# Created: 2025-10-20
# Updated: 2025-10-20
# Hook Location: packages/config/src/hooks/useConfirm/useConfirm.ts
# Package: @l-kern/config
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   React hook for displaying confirmation dialogs. Returns a Promise-based
#   confirm function that integrates with Modal system and modalStack.
# ================================================================

---

## Overview

**Purpose**: Display confirmation dialogs with Promise-based API
**Package**: @l-kern/config
**Path**: packages/config/src/hooks/useConfirm
**Since**: v1.0.0

useConfirm provides a simple way to ask users for confirmation before performing dangerous or irreversible actions. Returns a Promise that resolves to `true` (confirmed) or `false` (cancelled), making it easy to use with async/await syntax.

---

## Features

- ✅ **Promise-based API** - Use with async/await for clean code
- ✅ **Modal Integration** - Integrates with Modal component and modalStack
- ✅ **Keyboard Shortcuts** - Enter confirms, ESC cancels
- ✅ **Nested Support** - Works with nested modals via modalStack
- ✅ **Customizable Messages** - Pass custom confirmation text
- ✅ **TypeScript Support** - Full type safety
- ✅ **Automatic Cleanup** - Cleans up modal on unmount
- ✅ **Translation Ready** - Uses translation system for buttons

---

## Quick Start

### Basic Usage

```tsx
import { useConfirm } from '@l-kern/config';

function MyComponent() {
  const { confirm } = useConfirm();

  const handleDelete = async () => {
    const confirmed = await confirm('Naozaj chceš vymazať tento záznam?');

    if (confirmed) {
      await deleteRecord();
      showToast('Záznam vymazaný');
    }
  };

  return (
    <button onClick={handleDelete}>
      Vymazať
    </button>
  );
}
```

### Common Patterns

#### Pattern 1: Delete Confirmation
```tsx
const { confirm } = useConfirm();

const handleDelete = async () => {
  const confirmed = await confirm('Naozaj chceš vymazať tento kontakt?');
  if (!confirmed) return;

  await deleteContact(contactId);
};
```

#### Pattern 2: Unsaved Changes Warning
```tsx
const { confirm } = useConfirm();

const handleClose = async () => {
  if (isDirty) {
    const confirmed = await confirm('Máš neuložené zmeny. Naozaj chceš zavrieť?');
    if (!confirmed) return;
  }

  onClose();
};
```

#### Pattern 3: Dangerous Operation
```tsx
const { confirm } = useConfirm();

const handleBulkDelete = async () => {
  const confirmed = await confirm(
    `Naozaj chceš vymazať ${selectedCount} záznamov? Túto akciu nemožno vrátiť späť.`
  );

  if (confirmed) {
    await bulkDeleteRecords(selectedIds);
  }
};
```

---

## API Reference

### Function Signature

```typescript
function useConfirm(): UseConfirmResult
```

### Parameters

**No parameters** - Hook takes no arguments.

### Return Value

```typescript
interface UseConfirmResult {
  confirm: (message: string) => Promise<boolean>;
}
```

| Return Property | Type | Description |
|-----------------|------|-------------|
| `confirm` | `(message: string) => Promise<boolean>` | Shows confirmation dialog. Returns Promise that resolves to `true` (confirmed) or `false` (cancelled). |

---

## Behavior

### Internal Logic

**Confirmation Flow:**
1. User calls `confirm(message)`
2. Hook renders Modal with confirmation message
3. User clicks "Confirm" (Enter) → Promise resolves to `true`
4. User clicks "Cancel" (ESC) → Promise resolves to `false`
5. Modal closes automatically after user choice

**State Management:**
- Internal state tracks: `isOpen`, `message`, `resolve callback`
- State updates trigger Modal render
- Promise stored in ref to avoid closure issues

**Side Effects:**
- Modal registers in modalStack on open
- Modal unregisters from modalStack on close
- Cleanup: All pending confirmations resolve to `false` on unmount

**Memoization:**
- `confirm` function is memoized with `useCallback` (stable reference)

### Dependencies

**React Hooks Used:**
- `useState` - Track modal open state, message
- `useRef` - Store Promise resolve callback
- `useCallback` - Memoize confirm function
- Custom hooks: None

**External Dependencies:**
- Modal component (from @l-kern/ui-components)
- modalStack utility (for nested modal support)
- useTranslation (for button labels)

### Re-render Triggers

**Hook re-runs when:**
- Component re-renders (normal React behavior)

**Component re-renders when:**
- `confirm()` is called (opens modal → state change)
- User clicks button (closes modal → state change)

---

## Examples

### Example 1: Basic Delete Confirmation

```tsx
import { useConfirm } from '@l-kern/config';

function ContactCard({ contact, onDelete }) {
  const { confirm } = useConfirm();

  const handleDelete = async () => {
    const confirmed = await confirm(
      `Naozaj chceš vymazať kontakt "${contact.name}"?`
    );

    if (confirmed) {
      await onDelete(contact.id);
    }
  };

  return (
    <div>
      <h3>{contact.name}</h3>
      <button onClick={handleDelete}>Vymazať</button>
    </div>
  );
}
```

**Output:**
- Modal appears with message
- User clicks "Potvrdiť" → Contact deleted
- User clicks "Zrušiť" or ESC → Nothing happens

---

### Example 2: Unsaved Changes Guard

```tsx
import { useConfirm } from '@l-kern/config';
import { useFormDirty } from '@l-kern/config';

function EditContactForm({ initialData, onClose }) {
  const [formData, setFormData] = useState(initialData);
  const { isDirty } = useFormDirty(initialData, formData);
  const { confirm } = useConfirm();

  const handleClose = async () => {
    if (isDirty) {
      const confirmed = await confirm(
        'Máš neuložené zmeny. Naozaj chceš zavrieť?'
      );
      if (!confirmed) return;
    }

    onClose();
  };

  return (
    <Modal onClose={handleClose}>
      {/* Form fields */}
      <button onClick={handleClose}>Zrušiť</button>
    </Modal>
  );
}
```

**Output:**
- Clean form → Close immediately
- Dirty form → Show confirmation first

---

### Example 3: Bulk Operations

```tsx
import { useConfirm } from '@l-kern/config';

function ContactList({ contacts, onBulkDelete }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const { confirm } = useConfirm();

  const handleBulkDelete = async () => {
    const count = selectedIds.length;

    const confirmed = await confirm(
      `Naozaj chceš vymazať ${count} kontaktov? Túto akciu nemožno vrátiť späť.`
    );

    if (confirmed) {
      await onBulkDelete(selectedIds);
      setSelectedIds([]);
    }
  };

  return (
    <div>
      {/* Contact checkboxes */}
      {selectedIds.length > 0 && (
        <button onClick={handleBulkDelete}>
          Vymazať vybrané ({selectedIds.length})
        </button>
      )}
    </div>
  );
}
```

**Output:**
- Shows count in message: "Naozaj chceš vymazať 5 kontaktov?"
- User confirms → All selected deleted
- User cancels → Selection preserved

---

### Example 4: Nested Modal Confirmation

```tsx
import { useConfirm, Modal } from '@l-kern/config';

function EditModal({ contact, onClose }) {
  const { confirm } = useConfirm();

  const handleDeleteFromEdit = async () => {
    // Confirmation modal opens on top of edit modal
    const confirmed = await confirm(
      `Vymazať "${contact.name}" a zavrieť editor?`
    );

    if (confirmed) {
      await deleteContact(contact.id);
      onClose(); // Close edit modal
    }
  };

  return (
    <Modal modalId="edit-contact" onClose={onClose}>
      <h2>Upraviť kontakt</h2>
      {/* Form fields */}
      <button onClick={handleDeleteFromEdit}>
        Vymazať kontakt
      </button>
    </Modal>
  );
}
```

**Output:**
- Edit modal open (z-index: 1000)
- Click "Vymazať" → Confirmation modal (z-index: 1100)
- ESC closes confirmation, not edit modal
- Confirm deletes contact and closes edit modal

---

## Performance

### Memoization Strategy

**Memoized Values:**
- `confirm` function - Stable reference via `useCallback`

**Optimization:**
```tsx
// Good - Stable confirm reference
const { confirm } = useConfirm();

useEffect(() => {
  // confirm is stable - no infinite loop
  window.addEventListener('beforeunload', () => confirm('Leave?'));
}, [confirm]);
```

### Re-render Triggers

**Hook re-executes when:**
- Component re-renders (confirm function remains stable)

**Modal opens when:**
- `confirm(message)` is called

### Memory Usage

- **Typical**: ~200 bytes per hook instance
- **Cleanup**: Automatic - pending confirmations resolve to `false` on unmount
- **Leaks**: None - all refs and state cleaned up

### Complexity

- **Time**: O(1) - Simple state management
- **Space**: O(1) - Fixed state size (message + resolve callback)

---

## Known Issues

### Active Issues

**No known issues** ✅

All tests passing, hook stable.

### Fixed Issues

See [Changelog](#changelog) section below.

---

## Testing

### Test Coverage
- ✅ **Unit Tests**: 15 tests
- ✅ **Coverage**: 100% (statements, branches, functions, lines)
- ✅ **Rendering Tests**: 3 tests (modal open/close, message display)
- ✅ **Promise Tests**: 4 tests (resolve true, resolve false, async/await)
- ✅ **Keyboard Tests**: 2 tests (Enter confirms, ESC cancels)
- ✅ **Nested Modal Tests**: 2 tests (modalStack integration)
- ✅ **Cleanup Tests**: 2 tests (unmount, pending confirmations)
- ✅ **Edge Cases**: 2 tests (null message, rapid calls)

### Test File
`packages/config/src/hooks/useConfirm/useConfirm.test.ts`

### Running Tests
```bash
# Run useConfirm tests only
docker exec lkms201-web-ui npx nx test config --testFile=useConfirm.test.ts

# Run with coverage
docker exec lkms201-web-ui npx nx test config --coverage --testFile=useConfirm.test.ts

# Watch mode (local development)
npx nx test config --watch --testFile=useConfirm.test.ts
```

### Key Test Cases

**Basic Functionality:**
- ✅ Returns confirm function
- ✅ Opens modal when confirm() called
- ✅ Displays custom message in modal

**Promise Resolution:**
- ✅ Resolves to true when user clicks "Potvrdiť"
- ✅ Resolves to false when user clicks "Zrušiť"
- ✅ Works with async/await syntax
- ✅ Resolves to false on ESC key

**Keyboard Shortcuts:**
- ✅ Enter key confirms (resolves to true)
- ✅ ESC key cancels (resolves to false)

**Nested Modals:**
- ✅ Registers in modalStack with correct parent
- ✅ Unregisters from modalStack on close

**Cleanup:**
- ✅ Pending confirmations resolve to false on unmount
- ✅ No memory leaks

**Edge Cases:**
- ✅ Handles empty message (shows default)
- ✅ Handles rapid sequential calls

---

## Related Hooks

- **[useFormDirty](../useFormDirty/useFormDirty.md)** - Track unsaved changes (often used together)
- **[useModal](../useModal/useModal.md)** - Generic modal management
- **[useModalWizard](../useModalWizard/useModalWizard.md)** - Multi-step wizard confirmation

---

## Related Components

- **[Modal](../../../ui-components/src/components/Modal/Modal.md)** - Used internally for confirmation UI
- **[Button](../../../ui-components/src/components/Button/Button.md)** - Used for confirm/cancel buttons

---

## Migration Guide

### From v3 to v4

**No v3 equivalent** - New hook in v4.

**New Features in v4:**
- ✅ Promise-based API (no callbacks)
- ✅ modalStack integration
- ✅ Keyboard shortcuts built-in
- ✅ Translation system integration

---

## Changelog

### v1.0.0 (2025-10-20)
- 🎉 Initial release
- ✅ Promise-based confirm API
- ✅ Modal integration with modalStack
- ✅ Keyboard shortcuts (Enter/ESC)
- ✅ Nested modal support
- ✅ Translation system integration
- ✅ 15 unit tests (100% coverage)
- ✅ Automatic cleanup on unmount

---

## Troubleshooting

### Common Issues

**Issue**: Confirmation doesn't show
**Cause**: Modal component not imported or modalStack not initialized
**Solution**:
```tsx
// Ensure Modal is available
import { Modal } from '@l-kern/ui-components';

// Ensure useConfirm is imported
import { useConfirm } from '@l-kern/config';
```

**Issue**: ESC closes parent modal instead of confirmation
**Cause**: modalStack not properly tracking nested modals
**Solution**:
```tsx
// Ensure parent modal has modalId
<Modal modalId="parent-modal" onClose={onClose}>
  {/* Confirmation will auto-register as child */}
</Modal>
```

**Issue**: Promise never resolves
**Cause**: Component unmounted before user action
**Solution**:
```tsx
// Hook automatically resolves to false on unmount
// No action needed - this is expected behavior
```

---

## Best Practices

1. ✅ **Await confirmation** - Always use `await` or `.then()` to handle result
2. ✅ **Guard dangerous actions** - Use for delete, bulk operations, data loss
3. ✅ **Clear messages** - Explain what will happen if user confirms
4. ✅ **Show counts** - Include numbers for bulk operations
5. ✅ **Check isDirty** - Combine with useFormDirty for unsaved changes
6. ✅ **Handle cancellation** - User clicks cancel → take no action

**Good Example:**
```tsx
const confirmed = await confirm('Naozaj chceš vymazať 5 kontaktov?');
if (!confirmed) return; // Exit early on cancel
await deleteContacts(ids);
```

**Bad Example:**
```tsx
// ❌ Missing await - confirmation ignored!
confirm('Delete?');
await deleteContacts(ids); // Runs immediately!
```

---

## Resources

### Internal Links
- [useFormDirty Hook](../useFormDirty/useFormDirty.md) - Track form changes
- [Modal Component](../../../ui-components/src/components/Modal/Modal.md) - Used internally
- [modalStack Utility](../../utils/modalStack/modalStack.md) - Modal hierarchy management
- [Coding Standards](../../../../docs/programming/coding-standards.md)
- [Testing Guide](../../../../docs/programming/testing-overview.md)

### External References
- [React Hooks Documentation](https://react.dev/reference/react)
- [Promises in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Async/Await Guide](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises)

---

**Last Updated**: 2025-10-20
**Maintainer**: BOSSystems s.r.o.
**Documentation Version**: 1.0.0
