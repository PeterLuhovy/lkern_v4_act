# ================================================================
# useFormDirty
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\hooks\useFormDirty.md
# Version: 1.0.0
# Created: 2025-10-20
# Updated: 2025-10-20
# Hook Location: packages/config/src/hooks/useFormDirty/useFormDirty.ts
# Package: @l-kern/config
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   React hook for tracking unsaved form changes by comparing initial
#   values with current values, supporting deep object comparison and
#   field ignoring for timestamp fields.
# ================================================================

---

## Overview

**Purpose**: Track unsaved form changes and prevent data loss by detecting differences between initial and current form values
**Package**: @l-kern/config
**Path**: packages/config/src/hooks/useFormDirty
**Since**: v1.0.0

`useFormDirty` compares initial form values (loaded from API/database) with current form values (user input) to detect unsaved changes. It returns a boolean flag and list of changed fields, enabling "unsaved changes" warnings and conditional save button states.

---

## Features

- ✅ Deep comparison of nested objects and arrays using JSON.stringify
- ✅ Shallow comparison mode for performance (reference equality)
- ✅ Field ignoring (skip timestamp fields like `updated_at`, `created_at`)
- ✅ Returns list of changed field names for granular control
- ✅ Memoized computation for optimal performance
- ✅ Null/undefined safety (handles missing data gracefully)
- ✅ TypeScript generic support for type-safe field names
- ✅ Zero external dependencies (pure React hooks)

---

## Quick Start

### Basic Usage

```tsx
import { useFormDirty } from '@l-kern/config';
import { useState } from 'react';

function ContactForm() {
  const [initialData, setInitialData] = useState({ name: 'John', email: 'john@example.com' });
  const [formData, setFormData] = useState({ name: 'John', email: 'john@example.com' });

  const { isDirty, changedFields } = useFormDirty(initialData, formData);

  return (
    <div>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <button disabled={!isDirty}>Save</button>
      {isDirty && <p>Unsaved changes in: {changedFields.join(', ')}</p>}
    </div>
  );
}
```

### Common Patterns

#### Pattern 1: Unsaved Changes Warning on Close

```tsx
import { useFormDirty, useConfirm } from '@l-kern/config';

function EditContactModal({ contact, onClose }) {
  const [formData, setFormData] = useState(contact);
  const { isDirty } = useFormDirty(contact, formData);
  const { confirm } = useConfirm();

  const handleClose = async () => {
    if (isDirty) {
      const confirmed = await confirm({
        title: t('confirmModal.unsavedChanges.title'),
        message: t('confirmModal.unsavedChanges.message'),
        variant: 'warning',
      });
      if (!confirmed) return;
    }
    onClose();
  };

  return (
    <Modal onClose={handleClose}>
      {/* Form fields */}
    </Modal>
  );
}
```

#### Pattern 2: Conditional Save Button with Changed Fields Display

```tsx
function ContactForm() {
  const [initialData] = useState(contact);
  const [formData, setFormData] = useState(contact);

  const { isDirty, changedFields } = useFormDirty(initialData, formData, {
    ignoreFields: ['updated_at', 'created_at'],
  });

  return (
    <form>
      <input value={formData.name} onChange={handleChange} />
      <input value={formData.email} onChange={handleChange} />

      {isDirty && (
        <div className="unsaved-warning">
          Changed fields: {changedFields.join(', ')}
        </div>
      )}

      <button type="submit" disabled={!isDirty}>
        Save Changes
      </button>
    </form>
  );
}
```

---

## API Reference

### Function Signature

```typescript
function useFormDirty<T extends Record<string, any>>(
  initialValues: T | null | undefined,
  currentValues: T | null | undefined,
  options?: UseFormDirtyOptions
): UseFormDirtyResult<T>
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `initialValues` | `T \| null \| undefined` | Yes | Original form values (from API/database) |
| `currentValues` | `T \| null \| undefined` | Yes | Current form values (user input) |
| `options` | `UseFormDirtyOptions` | No | Configuration options (see below) |

**Type Constraint**: `T extends Record<string, any>` (any object type)

### Options

```typescript
interface UseFormDirtyOptions {
  /**
   * Fields to ignore when comparing values
   * @example ['updated_at', 'created_at', '_internal']
   */
  ignoreFields?: string[];

  /**
   * Use deep comparison (JSON.stringify)
   * @default true
   */
  compareDeep?: boolean;
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ignoreFields` | `string[]` | `[]` | Array of field names to skip during comparison (e.g., timestamps) |
| `compareDeep` | `boolean` | `true` | If `true`, uses JSON.stringify for deep comparison; if `false`, uses reference equality (faster but misses nested changes) |

### Return Value

```typescript
interface UseFormDirtyResult<T> {
  /**
   * True if any field has changed
   */
  isDirty: boolean;

  /**
   * Array of field names that have changed
   */
  changedFields: (keyof T)[];
}
```

| Return Property | Type | Description |
|-----------------|------|-------------|
| `isDirty` | `boolean` | `true` if any field differs between initial and current values (excluding ignored fields) |
| `changedFields` | `(keyof T)[]` | Array of field names that have changed; empty array if not dirty |

---

## Behavior

### Internal Logic

**State Management:**
- Hook does NOT maintain internal state (stateless)
- Uses `useMemo` to memoize computation results
- Recomputes only when dependencies change

**Comparison Algorithm:**
1. **Null/Undefined Check**: Returns `isDirty=false` if either value is null/undefined
2. **Shallow Copy**: Creates shallow copies of both objects (`{ ...initialValues }`)
3. **Remove Ignored Fields**: Deletes fields specified in `ignoreFields` from both copies
4. **Comparison**:
   - **Deep mode** (`compareDeep=true`): `JSON.stringify(initial) !== JSON.stringify(current)`
   - **Shallow mode** (`compareDeep=false`): `initial[key] !== current[key]` for each key
5. **Changed Fields**: If dirty, iterates through keys and collects changed field names

**Side Effects:**
- None (pure computation hook)
- No API calls, no DOM manipulation, no timers
- No cleanup required

**Memoization:**
- `isDirty` memoized with dependencies: `[initialValues, currentValues, ignoreFields, compareDeep]`
- `changedFields` memoized with dependencies: `[initialValues, currentValues, ignoreFields, compareDeep, isDirty]`
- `changedFields` only computed if `isDirty=true` (performance optimization)

### Dependencies

**React Hooks Used:**
- `useMemo` - Memoizes `isDirty` and `changedFields` computation to prevent unnecessary recalculations

**External Dependencies:**
- None (zero external packages)

### Re-render Triggers

**Hook re-executes when:**
- `initialValues` reference changes
- `currentValues` reference changes
- `options` reference changes (ignoreFields array, compareDeep boolean)

**Component re-renders when:**
- `isDirty` value changes (boolean flip: false → true or true → false)
- `changedFields` array reference changes (new field added/removed)

**Optimization Tip**: Memoize `options` object to prevent unnecessary re-runs:
```tsx
const options = useMemo(() => ({ ignoreFields: ['updated_at'] }), []);
const { isDirty } = useFormDirty(initialData, formData, options);
```

---

## Examples

### Example 1: Basic Contact Form

```tsx
import { useFormDirty } from '@l-kern/config';
import { useState } from 'react';

interface Contact {
  name: string;
  email: string;
  phone: string;
}

function ContactForm() {
  const [initialData] = useState<Contact>({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+421900123456',
  });

  const [formData, setFormData] = useState<Contact>(initialData);

  const { isDirty, changedFields } = useFormDirty(initialData, formData);

  const handleChange = (field: keyof Contact, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving changes:', changedFields);
    // API call to save data
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
      />
      <input
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
      />
      <input
        value={formData.phone}
        onChange={(e) => handleChange('phone', e.target.value)}
      />

      <button type="submit" disabled={!isDirty}>
        Save Changes
      </button>

      {isDirty && (
        <p>Unsaved changes in: {changedFields.join(', ')}</p>
      )}
    </form>
  );
}
```

### Example 2: With Ignored Timestamp Fields

```tsx
import { useFormDirty } from '@l-kern/config';
import { useState, useMemo } from 'react';

interface Contact {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

function EditContactForm({ contact }: { contact: Contact }) {
  const [formData, setFormData] = useState(contact);

  // Memoize options to prevent re-runs
  const options = useMemo(
    () => ({
      ignoreFields: ['created_at', 'updated_at'],
    }),
    []
  );

  const { isDirty, changedFields } = useFormDirty(
    contact,
    formData,
    options
  );

  return (
    <form>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />

      <div>
        <small>Created: {formData.created_at}</small>
        <small>Updated: {formData.updated_at}</small>
      </div>

      <button disabled={!isDirty}>Save</button>
      {isDirty && <p>Changed: {changedFields.join(', ')}</p>}
    </form>
  );
}
```

### Example 3: Complex Nested Objects with Navigation Guard

```tsx
import { useFormDirty, useConfirm, useTranslation } from '@l-kern/config';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Contact {
  name: string;
  email: string;
  address: {
    street: string;
    city: string;
    zip: string;
  };
  tags: string[];
}

function ComplexContactForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { confirm } = useConfirm();

  const [initialData, setInitialData] = useState<Contact | null>(null);
  const [formData, setFormData] = useState<Contact | null>(null);

  const { isDirty, changedFields } = useFormDirty(initialData, formData);

  // Load data on mount
  useEffect(() => {
    const loadContact = async () => {
      const data = await fetchContact();
      setInitialData(data);
      setFormData(data);
    };
    loadContact();
  }, []);

  // Navigation guard - warn if unsaved changes
  const handleNavigateAway = async () => {
    if (isDirty) {
      const confirmed = await confirm({
        title: t('confirmModal.unsavedChanges.title'),
        message: t('confirmModal.unsavedChanges.message'),
        variant: 'warning',
      });
      if (!confirmed) return;
    }
    navigate('/contacts');
  };

  const handleSave = async () => {
    if (!formData) return;

    console.log('Saving changes to fields:', changedFields);
    await saveContact(formData);

    // Reset dirty state
    setInitialData(formData);
  };

  const handleReset = () => {
    setFormData(initialData);
  };

  if (!formData) return <div>Loading...</div>;

  return (
    <form>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />

      {/* Nested address fields */}
      <input
        value={formData.address.street}
        onChange={(e) =>
          setFormData({
            ...formData,
            address: { ...formData.address, street: e.target.value },
          })
        }
      />
      <input
        value={formData.address.city}
        onChange={(e) =>
          setFormData({
            ...formData,
            address: { ...formData.address, city: e.target.value },
          })
        }
      />

      {/* Array field */}
      <input
        value={formData.tags.join(', ')}
        onChange={(e) =>
          setFormData({
            ...formData,
            tags: e.target.value.split(',').map((t) => t.trim()),
          })
        }
      />

      {/* Dirty state indicator */}
      {isDirty && (
        <div className="unsaved-warning">
          <p>Unsaved changes in: {changedFields.join(', ')}</p>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </div>
      )}

      <button type="button" onClick={handleSave} disabled={!isDirty}>
        Save Changes
      </button>
      <button type="button" onClick={handleNavigateAway}>
        Cancel
      </button>
    </form>
  );
}
```

---

## Performance

### Memoization Strategy

**Memoized Values:**
- `isDirty` - Recomputes when `initialValues`, `currentValues`, `ignoreFields`, or `compareDeep` change
- `changedFields` - Recomputes when above dependencies OR `isDirty` changes
- `changedFields` optimization: Only computed if `isDirty=true` (skip if no changes)

**Optimization:**
```typescript
// ✅ GOOD - Memoized options object
const options = useMemo(() => ({ ignoreFields: ['updated_at'] }), []);
const { isDirty } = useFormDirty(initialData, formData, options);

// ❌ BAD - New object every render (causes unnecessary re-runs)
const { isDirty } = useFormDirty(initialData, formData, {
  ignoreFields: ['updated_at'],
});

// ✅ FIX - Hoist options outside component if static
const OPTIONS = { ignoreFields: ['updated_at'] };
function MyComponent() {
  const { isDirty } = useFormDirty(initialData, formData, OPTIONS);
}
```

### Re-render Triggers

**Hook re-executes when:**
- `initialValues` reference changes (e.g., new object from API)
- `currentValues` reference changes (e.g., setState call)
- `options` object reference changes (if not memoized)
- `ignoreFields` array reference changes

**Prevent unnecessary re-renders:**
```typescript
// ✅ Memoize options object
const options = useMemo(() => ({
  ignoreFields: ['created_at', 'updated_at'],
  compareDeep: true,
}), []);

// ✅ Hoist static options outside component
const FORM_OPTIONS = { ignoreFields: ['created_at', 'updated_at'] };

// ❌ Inline object/array creates new reference every render
const { isDirty } = useFormDirty(data, formData, {
  ignoreFields: ['updated_at'], // New array reference!
});
```

### Memory Usage

- **Typical**: ~1KB per hook instance (shallow copies of objects)
- **Cleanup**: Automatic when component unmounts (no manual cleanup needed)
- **Leaks**: None (no subscriptions, no timers, no event listeners)

### Complexity

- **Time**: O(n) where n = number of fields (JSON.stringify for deep comparison)
- **Space**: O(n) for shallow copies and changedFields array
- **Deep comparison**: O(n × m) where m = average nesting depth (worst case)
- **Shallow comparison**: O(n) (faster, but misses nested changes)

**Optimization Strategy:**
- Use `compareDeep: false` for flat objects (primitives only)
- Use `compareDeep: true` (default) for nested objects/arrays

---

## Known Issues

### Active Issues

**No known issues** ✅

### Fixed Issues

See [Changelog](#changelog) section below.

---

## Testing

### Test Coverage
- ✅ **Unit Tests**: 46 tests
- ✅ **Coverage**: 100% (statements, branches, functions, lines)
- ✅ **Hook Tests**: 16 tests (using @testing-library/react)
- ✅ **Edge Cases**: 7 tests (null, undefined, empty objects)

### Test File
`packages/config/src/hooks/useFormDirty/useFormDirty.test.ts`

### Running Tests
```bash
# Run hook tests
docker exec lkms201-web-ui npx nx test config --testFile=useFormDirty.test.ts

# Run with coverage
docker exec lkms201-web-ui npx nx test config --coverage --testFile=useFormDirty.test.ts

# Watch mode
docker exec lkms201-web-ui npx nx test config --watch --testFile=useFormDirty.test.ts
```

### Key Test Cases

**Basic Functionality:**
- ✅ Returns `isDirty=false` when values are unchanged
- ✅ Returns `isDirty=true` when values change
- ✅ Returns accurate list of changed fields
- ✅ Empty `changedFields` when not dirty

**Deep Comparison:**
- ✅ Detects nested object changes (address.city change)
- ✅ Detects array changes (tags array modified)
- ✅ Detects array order changes

**Field Ignoring:**
- ✅ Ignores single field (`ignoreFields: ['updated_at']`)
- ✅ Ignores multiple fields (`['created_at', 'updated_at']`)
- ✅ Changed fields list excludes ignored fields

**Edge Cases:**
- ✅ Handles `null` initialValues
- ✅ Handles `undefined` currentValues
- ✅ Handles empty objects (`{}`)
- ✅ Handles one null, one defined (returns false)

**State Updates:**
- ✅ Updates `isDirty` when values change
- ✅ Resets `isDirty` when values become equal again
- ✅ Re-renders trigger correct recalculation

**Shallow vs Deep Comparison:**
- ✅ Shallow mode uses reference equality (`compareDeep: false`)
- ✅ Deep mode detects nested changes (`compareDeep: true`)

**Performance:**
- ✅ Memoization prevents unnecessary recalculation
- ✅ changedFields only computed when dirty

---

## Related Hooks

- **[useConfirm](useConfirm.md)** - Confirmation modal hook (used for unsaved changes warnings)
- **[useModal](useModal.md)** - Modal state management (edit forms in modals)
- **[useToast](useToast.md)** - Toast notifications (show "changes saved" message)

---

## Related Components

- **[Modal](../components/Modal.md)** - Modal dialog (edit forms with unsaved changes protection)
- **[Button](../components/Button.md)** - Used for Save/Cancel buttons (disabled when not dirty)
- **[Input](../components/Input.md)** - Form input fields

---

## Migration Guide

### From v3 to v4

**No breaking changes** - This is a new hook in v4.

If migrating from custom dirty tracking logic in v3:

**v3 (Manual tracking):**
```tsx
const [isDirty, setIsDirty] = useState(false);

const handleChange = (field, value) => {
  setFormData({ ...formData, [field]: value });
  setIsDirty(true); // Manual flag
};
```

**v4 (useFormDirty hook):**
```tsx
const { isDirty, changedFields } = useFormDirty(initialData, formData);

const handleChange = (field, value) => {
  setFormData({ ...formData, [field]: value });
  // isDirty automatically updated!
};
```

---

## Changelog

### v1.0.0 (2025-10-20)
- 🎉 Initial release
- ✅ Deep comparison using JSON.stringify
- ✅ Shallow comparison mode (`compareDeep: false`)
- ✅ Field ignoring (`ignoreFields` option)
- ✅ Returns list of changed field names
- ✅ Null/undefined safety
- ✅ TypeScript generic support
- ✅ 46 unit tests (100% coverage)

---

## Troubleshooting

### Common Issues

**Issue**: Hook returns stale data / not updating
**Cause**: `initialValues` or `currentValues` reference not changing
**Solution**:
```tsx
// ❌ BAD - Same reference, hook won't recompute
const data = { name: 'John' };
setFormData(data); // Same object reference!

// ✅ GOOD - New reference, hook recomputes
setFormData({ ...data, name: 'Jane' }); // New object
```

**Issue**: Hook re-runs too often (performance)
**Cause**: Options object recreated every render
**Solution**:
```tsx
// ❌ BAD - New object every render
const { isDirty } = useFormDirty(data, formData, {
  ignoreFields: ['updated_at'],
});

// ✅ GOOD - Memoize options
const options = useMemo(() => ({ ignoreFields: ['updated_at'] }), []);
const { isDirty } = useFormDirty(data, formData, options);
```

**Issue**: Nested changes not detected
**Cause**: Using shallow comparison mode
**Solution**:
```tsx
// ❌ BAD - Shallow mode misses nested changes
const { isDirty } = useFormDirty(data, formData, { compareDeep: false });

// ✅ GOOD - Deep mode detects nested changes (default)
const { isDirty } = useFormDirty(data, formData); // compareDeep: true
```

**Issue**: `changedFields` always empty
**Cause**: Checking `changedFields` when `isDirty=false`
**Solution**:
```tsx
// changedFields is only populated when isDirty=true
if (isDirty) {
  console.log('Changed fields:', changedFields); // ✅ Will have values
}
```

**Issue**: TypeScript errors on field names
**Cause**: Type inference not working
**Solution**:
```tsx
// ✅ Explicitly type the hook
interface Contact {
  name: string;
  email: string;
}
const { isDirty, changedFields } = useFormDirty<Contact>(initial, current);
// changedFields is now typed as (keyof Contact)[]
```

---

## Best Practices

1. ✅ **Memoize options** - Prevent unnecessary re-runs by memoizing options object
2. ✅ **Use TypeScript** - Type the generic parameter for type-safe field names
3. ✅ **Ignore timestamp fields** - Always ignore `created_at`, `updated_at` fields
4. ✅ **Reset after save** - Update `initialValues` after successful save to reset dirty state
5. ✅ **Show changed fields** - Display list of changed fields to user for transparency
6. ✅ **Warn before navigation** - Use with `useConfirm` to prevent accidental data loss
7. ✅ **Disable save when clean** - Disable save button when `isDirty=false`
8. ✅ **Use deep comparison for nested objects** - Default `compareDeep: true` works best for complex forms
9. ✅ **Handle null gracefully** - Hook returns `false` for null values (safe default)
10. ✅ **Don't call conditionally** - Follow React hooks rules (call at top level)

---

## Resources

### Internal Links
- [Coding Standards](../programming/coding-standards.md)
- [Testing Guide](../programming/testing-overview.md)
- [Hooks Best Practices](../programming/frontend-standards.md#react-hooks)

### External References
- [React Hooks Documentation](https://react.dev/reference/react)
- [Rules of Hooks](https://react.dev/warnings/invalid-hook-call-warning)
- [useMemo Hook](https://react.dev/reference/react/useMemo)

---

**Last Updated**: 2025-10-20
**Maintainer**: BOSSystems s.r.o.
**Documentation Version**: 1.0.0
