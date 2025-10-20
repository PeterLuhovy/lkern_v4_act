# ================================================================
# FormField
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\components\FormField.md
# Version: 3.0.0
# Created: 2025-10-20
# Updated: 2025-10-20
# Component Location: packages/ui-components/src/components/FormField/FormField.tsx
# Package: @l-kern/ui-components
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Form field wrapper with built-in real-time validation, error handling,
#   and automatic input prop injection for seamless form development.
# ================================================================

---

## Overview

**Purpose**: Wrap form inputs with labels, validation, and error messages
**Package**: @l-kern/ui-components
**Path**: packages/ui-components/src/components/FormField
**Since**: v1.0.0 (v3.0.0 added real-time validation)

FormField is a powerful wrapper component that manages form input state, validation, and error display. Version 3.0.0 introduced built-in real-time validation, automatic error clearing, and input prop injection, making form development significantly faster and more consistent.

---

## Features

### Core Features
- ✅ **Label + Input Wrapper**: Consistent field layout with optional label
- ✅ **Required Indicator**: Red asterisk (*) when required=true
- ✅ **Error Display**: Red error message below input with alert role
- ✅ **Helper Text**: Muted helper text (when no error)
- ✅ **Full-Width Mode**: Expands to 100% container width

### v3.0.0 Real-Time Validation
- ✅ **Built-in Validation**: `validate` prop for instant field validation
- ✅ **Auto Error Clearing**: Errors vanish when input becomes valid
- ✅ **Validation Callback**: `onValidChange` notifies parent of validation state
- ✅ **Input Prop Injection**: Automatically injects value, onChange, hasError, isValid
- ✅ **Touched State**: Hides errors until field is interacted with
- ✅ **Success Messages**: Optional success message when field is valid
- ✅ **External Error Override**: Server-side errors override client validation

### UX Enhancements
- ✅ **Reserved Message Space**: Prevent layout shift with `reserveMessageSpace`
- ✅ **Initial Value**: Pre-populate input with `initialValue` prop
- ✅ **Input Tooltip**: HTML title attribute via `inputTitle` prop
- ✅ **Error Icon**: ⚠ icon before error messages
- ✅ **Success Icon**: ✓ icon before success messages
- ✅ **Accessibility**: role="alert" for errors, proper ARIA attributes

---

## Quick Start

### Basic Usage (No Validation)

```tsx
import { FormField } from '@l-kern/ui-components';
import { Input } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';

function SimpleForm() {
  const { t } = useTranslation();

  return (
    <FormField
      label={t('forms.email')}
      required
      helperText={t('forms.emailHelper')}
    >
      <Input type="email" placeholder="user@example.com" />
    </FormField>
  );
}
```

### Common Patterns

#### Pattern 1: With Real-Time Validation (v3.0.0)
```tsx
import { FormField } from '@l-kern/ui-components';
import { Input } from '@l-kern/ui-components';
import { useState } from 'react';

function EmailField() {
  const { t } = useTranslation();
  const [emailValid, setEmailValid] = useState(false);

  return (
    <FormField
      label={t('forms.email')}
      required
      validate={(value) => {
        if (!value) return t('validation.required');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return t('validation.invalidEmail');
        }
        return undefined; // Valid
      }}
      onValidChange={setEmailValid}
      successMessage={t('validation.emailValid')}
      reserveMessageSpace
    >
      <Input type="email" placeholder="user@example.com" />
    </FormField>
  );
}
```

#### Pattern 2: External Server Error
```tsx
function SignupForm() {
  const [serverError, setServerError] = useState('');

  const handleSubmit = async () => {
    try {
      await registerUser(email);
    } catch (err) {
      setServerError(err.message); // External error
    }
  };

  return (
    <FormField
      label="Email"
      required
      validate={(value) => !value ? 'Email required' : undefined}
      error={serverError} // External error overrides validation
      reserveMessageSpace
    >
      <Input type="email" />
    </FormField>
  );
}
```

#### Pattern 3: Form-Level Validation State
```tsx
function CompleteForm() {
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const canSubmit = emailValid && passwordValid;

  return (
    <form>
      <FormField
        label="Email"
        validate={(value) => !value ? 'Required' : undefined}
        onValidChange={setEmailValid}
        reserveMessageSpace
      >
        <Input type="email" />
      </FormField>

      <FormField
        label="Password"
        validate={(value) => value.length < 8 ? 'Min 8 chars' : undefined}
        onValidChange={setPasswordValid}
        reserveMessageSpace
      >
        <Input type="password" />
      </FormField>

      <Button disabled={!canSubmit}>Submit</Button>
    </form>
  );
}
```

---

## Props API

### FormFieldProps

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `label` | `string` | `undefined` | No | Label text above input |
| `required` | `boolean` | `false` | No | Show red asterisk (*), show validation errors immediately |
| `error` | `string` | `undefined` | No | External error (e.g., server error) - overrides internal validation |
| `helperText` | `string` | `undefined` | No | Helper text below input (hidden when error present) |
| `htmlFor` | `string` | `undefined` | No | HTML for attribute linking label to input |
| `fullWidth` | `boolean` | `false` | No | Expand to 100% container width |
| `reserveMessageSpace` | `boolean` | `false` | No | Reserve ~28px height for error/helper text (prevents layout shift) |
| `className` | `string` | `undefined` | No | Additional CSS classes for wrapper |
| `validate` | `ValidationFunction` | `undefined` | No | Validation function called on every change |
| `onValidChange` | `(isValid: boolean) => void` | `undefined` | No | Called when validation state changes |
| `initialValue` | `string` | `''` | No | Initial value for input field |
| `inputTitle` | `string` | `undefined` | No | Tooltip text (HTML title attribute) |
| `successMessage` | `string` | `undefined` | No | Success message when field is valid |
| `children` | `ReactElement` | - | **Yes** | Input element (Input, Select, etc.) |

### ValidationFunction Type

```typescript
type ValidationFunction = (value: string) => string | undefined;

// Returns:
// - Error message (string) if invalid
// - undefined if valid

// Example:
const validateEmail = (value: string) => {
  if (!value) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return 'Invalid email format';
  }
  return undefined; // Valid
};
```

### Type Definitions

```typescript
interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  htmlFor?: string;
  fullWidth?: boolean;
  reserveMessageSpace?: boolean;
  className?: string;
  validate?: ValidationFunction;
  onValidChange?: (isValid: boolean) => void;
  initialValue?: string;
  inputTitle?: string;
  successMessage?: string;
  children: React.ReactElement;
}
```

---

## Visual Design

### Layout Structure

```
┌─────────────────────────────────────────────┐
│ Label *                                     │ ← Label + required asterisk
├─────────────────────────────────────────────┤
│ [Input Field                            ]   │ ← Child input element
├─────────────────────────────────────────────┤
│ ⚠ Error message / ✓ Success / Helper text  │ ← Message area (reserved space)
└─────────────────────────────────────────────┘
```

### States

**Normal** - No error, no success
- Label: Dark gray (#212121), 12px, weight 600
- Input: Standard Input styling
- Helper text: Muted gray (#9e9e9e), 10px

**Error** - Validation failed or external error
- Label: Unchanged (dark gray)
- Input: Red border (injected via hasError prop)
- Error message: Red (#c62828), 10px, with ⚠ icon
- role="alert" for screen readers

**Success** - Validation passed (optional)
- Label: Unchanged
- Input: Green border (injected via isValid prop)
- Success message: Green (#2e7d32), 10px, with ✓ icon

**Required** - required=true
- Label: Red asterisk (*) after text
- Validation errors: Shown immediately (not waiting for touched)

**Reserved Space** - reserveMessageSpace=true
- Message area: min-height ~28px allocated
- Prevents layout shift when errors appear/disappear

---

## Behavior

### Real-Time Validation Flow (v3.0.0)

**1. Initial State**
- Input: Empty
- Internal state: { value: '', error: undefined, touched: false }
- Displayed error: None (unless required=true)

**2. User Types** (e.g., "invalid")
- onChange triggered → setValue('invalid')
- setTouched(true)
- validate() called → returns "Invalid format"
- setInternalError("Invalid format")
- onValidChange(false) called
- Error displayed (field is now touched)

**3. User Corrects** (e.g., "user@example.com")
- onChange triggered → setValue('user@example.com')
- validate() called → returns undefined
- setInternalError(undefined)
- onValidChange(true) called
- Error cleared, success message shown (if provided)

**4. External Error** (e.g., server response)
- Parent sets error prop: "Email already exists"
- External error overrides internal validation
- Error displayed even if internal validation passes

### Input Prop Injection

FormField automatically injects these props to child Input:

```tsx
<Input
  value={internalValue}        // Managed by FormField
  onChange={handleChange}       // Managed by FormField
  hasError={!!displayError}     // true when error present
  isValid={validAndTouched}     // true when valid + touched
  fullWidth={fullWidth}         // Passed through
  title={inputTitle}            // Tooltip
  {...originalChildProps}       // Original props preserved
/>
```

**Result**: You don't need to manage value/onChange in parent component.

### Touched State Logic

- **required=false**: Hide errors until field is touched (user has typed)
- **required=true**: Show errors immediately (even before touched)

### Error Priority

1. **External error** (error prop) - Highest priority
2. **Internal validation error** (from validate function)
3. **No error** - Show helper text or success message

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Focus input field |
| `Shift+Tab` | Focus previous field |
| (Input-specific keys) | Handled by child Input component |

---

## Accessibility

### WCAG Compliance
- ✅ **WCAG 2.1 Level AA** compliant
- ✅ Proper label-input association (htmlFor/id)
- ✅ Error messages with role="alert" for screen readers
- ✅ Color contrast ratio ≥ 4.5:1 (error/helper text)
- ✅ Focus visible (inherited from Input component)
- ✅ Required indicator visible and announced

### ARIA Attributes

```tsx
<label htmlFor="email-input">
  Email *
</label>

<Input
  id="email-input"
  hasError={true}
  aria-invalid="true"
  aria-describedby="email-input-error"
/>

<span id="email-input-error" role="alert">
  ⚠ Email is required
</span>
```

### Screen Reader Behavior

- **Label**: "Email, required, edit text"
- **Error**: "Alert: Email is required" (announced when error appears)
- **Success**: "Email is valid" (announced when success message appears)
- **Helper Text**: "Enter your work email" (announced when focused)

---

## Responsive Design

### Breakpoints

**Mobile** (< 768px)
- Recommend: `fullWidth` for easier touch interaction
- Label: 12px (same as desktop)
- Error/helper text: 10px (same as desktop)

**Tablet** (768px - 1023px)
- Standard desktop styling applies

**Desktop** (≥ 1024px)
- Standard styling applies
- Use `fullWidth` in vertical forms

### Layout Behavior

```tsx
// Mobile: Full width (easier to tap)
<FormField label="Email" fullWidth reserveMessageSpace>
  <Input type="email" />
</FormField>

// Desktop: Inline form (auto width)
<div className="inline-form">
  <FormField label="Search">
    <Input type="search" />
  </FormField>
  <Button>Search</Button>
</div>
```

---

## Styling

### CSS Variables Used

```css
/* Label */
--theme-text: #212121 (label color)
--font-size-sm: 12px (label size)
--font-weight-semibold: 600 (label weight)
--line-height-normal: 1.5

/* Required Asterisk */
--color-status-error: #f44336 (red asterisk)
--font-weight-bold: 700

/* Error Text */
--theme-validation-error: #c62828 (error color)
--font-size-xs: 10px (error size)

/* Success Text */
--theme-validation-success: #2e7d32 (success color)
--font-size-xs: 10px (success size)

/* Helper Text */
--theme-text-muted: #9e9e9e (helper color)
--font-size-xs: 10px (helper size)

/* Spacing */
--spacing-xs: 4px (gap between elements)
--spacing-lg: 24px (reserved message area height)
```

### Custom Styling

**Via className prop:**
```tsx
<FormField
  label="Email"
  className="my-custom-field"
>
  <Input />
</FormField>
```

```css
.my-custom-field {
  padding: 16px;
  background: var(--theme-input-background);
  border-radius: var(--border-radius-md);
}
```

---

## Known Issues

### Active Issues

**No known issues** ✅

All 78 tests passing, component stable in production.

### Fixed Issues

See [Changelog](#changelog) section below.

---

## Testing

### Test Coverage
- ✅ **Unit Tests**: 78 tests
- ✅ **Coverage**: 100% (statements, branches, functions, lines)
- ✅ **v3.0.0 Validation Tests**: 9 tests (validate, onValidChange, touched, external error)
- ✅ **v3.0.0 Layout Tests**: 4 tests (reserved space, initialValue, inputTitle)
- ✅ **v3.0.0 Prop Injection Tests**: 4 tests (value, hasError, isValid, fullWidth)
- ✅ **Accessibility Tests**: 3 tests (role="alert", label association)

### Test File
`packages/ui-components/src/components/FormField/FormField.test.tsx`

### Running Tests
```bash
# Run FormField tests only
docker exec lkms201-web-ui npx nx test ui-components --testFile=FormField.test.tsx

# Run with coverage
docker exec lkms201-web-ui npx nx test ui-components --coverage --testFile=FormField.test.tsx

# Watch mode (local development)
npx nx test ui-components --watch --testFile=FormField.test.tsx
```

### Key Test Cases

**Basic Rendering (10 tests):**
- ✅ Renders label and input
- ✅ Displays required asterisk when required=true
- ✅ Does not display asterisk when required=false
- ✅ Displays error message when error prop provided
- ✅ Displays helper text when no error
- ✅ Hides helper text when error present
- ✅ Applies fullWidth class when fullWidth=true
- ✅ Links label to input via htmlFor/id
- ✅ Applies custom className
- ✅ Renders error with role="alert" for accessibility

**Real-Time Validation (9 tests):**
- ✅ Validates input and shows error message
- ✅ Clears error when input becomes valid
- ✅ Calls onValidChange when validation state changes
- ✅ Shows required error immediately when required=true
- ✅ Hides error until touched when required=false
- ✅ Displays success message when valid
- ✅ Prioritizes external error over internal validation error
- ✅ Validation function receives current value
- ✅ onValidChange receives correct boolean state

**Layout & UX (4 tests):**
- ✅ Reserves space for message when reserveMessageSpace=true
- ✅ Does not reserve space when reserveMessageSpace=false
- ✅ Uses initialValue prop to pre-fill input
- ✅ Applies inputTitle as tooltip on input

**Input Prop Injection (4 tests):**
- ✅ Injects value prop to child Input
- ✅ Injects hasError prop when field has error
- ✅ Injects isValid prop when field is valid
- ✅ Injects fullWidth prop to child Input

---

## Related Components

- **[Input](Input.md)** - Text input element (most common child)
- **[Select](Select.md)** - Dropdown select element
- **[RadioGroup](RadioGroup.md)** - Radio button group
- **[Checkbox](Checkbox.md)** - Checkbox input
- **[Button](Button.md)** - Form submit buttons

---

## Usage Examples

### Example 1: Email Validation (Real-Time)
```tsx
import { FormField } from '@l-kern/ui-components';
import { Input } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import { useState } from 'react';

function EmailField() {
  const { t } = useTranslation();
  const [emailValid, setEmailValid] = useState(false);

  return (
    <FormField
      label={t('forms.email')}
      required
      validate={(value) => {
        if (!value) return t('validation.required');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return t('validation.invalidEmail');
        }
        return undefined;
      }}
      onValidChange={setEmailValid}
      successMessage={t('validation.emailValid')}
      helperText={t('forms.emailHelper')}
      reserveMessageSpace
    >
      <Input type="email" placeholder="user@example.com" />
    </FormField>
  );
}
```

**Output:**
- Label: "Email *"
- Real-time validation as you type
- Error: "Invalid email format" (red, with ⚠ icon)
- Success: "Email is valid" (green, with ✓ icon)
- Helper: "We'll never share your email" (when no error/success)
- No layout shift (reserved space)

---

### Example 2: Password Strength Validation
```tsx
import { FormField } from '@l-kern/ui-components';
import { Input } from '@l-kern/ui-components';

function PasswordField() {
  const { t } = useTranslation();

  const validatePassword = (value: string) => {
    if (!value) return t('validation.required');
    if (value.length < 8) return t('validation.passwordMinLength');
    if (!/[A-Z]/.test(value)) return t('validation.passwordUppercase');
    if (!/[a-z]/.test(value)) return t('validation.passwordLowercase');
    if (!/[0-9]/.test(value)) return t('validation.passwordNumber');
    return undefined;
  };

  return (
    <FormField
      label={t('forms.password')}
      required
      validate={validatePassword}
      successMessage={t('validation.passwordStrong')}
      helperText={t('forms.passwordHelper')}
      reserveMessageSpace
    >
      <Input type="password" />
    </FormField>
  );
}
```

**Output:**
- Label: "Password *"
- Real-time validation: "Min 8 characters" → "Must contain uppercase" → etc.
- Success: "Strong password!" (when all criteria met)
- Helper: "Min 8 chars, 1 uppercase, 1 number" (when no error/success)

---

### Example 3: Server Error Handling
```tsx
import { FormField } from '@l-kern/ui-components';
import { Input } from '@l-kern/ui-components';
import { Button } from '@l-kern/ui-components';
import { useState } from 'react';

function SignupForm() {
  const { t } = useTranslation();
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (email: string) => {
    setSubmitting(true);
    setServerError('');

    try {
      await registerUser(email);
    } catch (err) {
      setServerError(t('errors.emailExists')); // External error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form>
      <FormField
        label={t('forms.email')}
        required
        validate={(value) => {
          if (!value) return t('validation.required');
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return t('validation.invalidEmail');
          }
          return undefined;
        }}
        error={serverError} // External error overrides validation
        reserveMessageSpace
        initialValue="" // Clear on mount
      >
        <Input type="email" />
      </FormField>

      <Button
        variant="primary"
        onClick={handleSubmit}
        loading={submitting}
      >
        {t('auth.signup')}
      </Button>
    </form>
  );
}
```

**Output:**
- Client validation: "Invalid email format" (as you type)
- Server error: "Email already exists" (after submit, overrides client validation)
- External error persists until parent clears it

---

### Example 4: Form-Level Validation State
```tsx
import { FormField } from '@l-kern/ui-components';
import { Input } from '@l-kern/ui-components';
import { Button } from '@l-kern/ui-components';
import { useState } from 'react';

function RegistrationForm() {
  const { t } = useTranslation();
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmValid, setConfirmValid] = useState(false);

  const canSubmit = emailValid && passwordValid && confirmValid;

  return (
    <form>
      <FormField
        label={t('forms.email')}
        required
        validate={(value) => !value ? t('validation.required') : undefined}
        onValidChange={setEmailValid}
        reserveMessageSpace
      >
        <Input type="email" />
      </FormField>

      <FormField
        label={t('forms.password')}
        required
        validate={(value) => value.length < 8 ? t('validation.passwordMinLength') : undefined}
        onValidChange={setPasswordValid}
        reserveMessageSpace
      >
        <Input type="password" />
      </FormField>

      <FormField
        label={t('forms.confirmPassword')}
        required
        validate={(value) => !value ? t('validation.required') : undefined}
        onValidChange={setConfirmValid}
        reserveMessageSpace
      >
        <Input type="password" />
      </FormField>

      <Button
        variant="primary"
        type="submit"
        disabled={!canSubmit}
      >
        {t('auth.register')}
      </Button>
    </form>
  );
}
```

**Output:**
- 3 form fields with real-time validation
- Submit button: Disabled until all fields valid
- onValidChange: Tracks each field's validation state
- canSubmit: Calculated from all field states

---

### Example 5: Custom Validation with Async Check
```tsx
import { FormField } from '@l-kern/ui-components';
import { Input } from '@l-kern/ui-components';
import { useState, useEffect } from 'react';

function UsernameField() {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [checking, setChecking] = useState(false);
  const [serverError, setServerError] = useState('');

  // Debounced async check
  useEffect(() => {
    if (username.length < 3) return;

    const timeout = setTimeout(async () => {
      setChecking(true);
      const available = await checkUsernameAvailability(username);
      if (!available) {
        setServerError(t('validation.usernameExists'));
      } else {
        setServerError('');
      }
      setChecking(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [username]);

  return (
    <FormField
      label={t('forms.username')}
      required
      validate={(value) => {
        if (!value) return t('validation.required');
        if (value.length < 3) return t('validation.usernameMinLength');
        if (!/^[a-z0-9_]+$/.test(value)) return t('validation.usernameInvalidChars');
        return undefined;
      }}
      error={serverError} // External async error
      successMessage={!serverError && username.length >= 3 ? t('validation.usernameAvailable') : undefined}
      helperText={checking ? t('validation.checking') : t('forms.usernameHelper')}
      reserveMessageSpace
      initialValue={username}
    >
      <Input
        placeholder="john_doe"
        onChange={(e) => setUsername(e.target.value)}
      />
    </FormField>
  );
}
```

**Output:**
- Client validation: "Min 3 characters", "Only lowercase, numbers, underscore"
- Async check: "Checking..." (after 500ms debounce)
- Server result: "Username already exists" or "Username available ✓"
- Real-time feedback as you type

---

## Performance

### Bundle Size
- **JS**: ~2.5 KB (gzipped, includes validation logic)
- **CSS**: ~0.8 KB (gzipped, minimal styling)
- **Total**: ~3.3 KB (reasonable for features provided)

### Runtime Performance
- **Render time**: < 1ms (average, with Input child)
- **Re-renders**: Only when value/error/helperText props change
- **Validation**: Synchronous, < 0.1ms per keystroke
- **Memory**: ~1 KB per FormField instance (includes state)

### Optimization Tips
- ✅ Use `reserveMessageSpace` to prevent layout shift (better perceived performance)
- ✅ Memoize validation function with `useCallback()` if parent re-renders frequently
- ✅ Debounce async validation checks (see Example 5)
- ✅ Use `onValidChange` for form-level state (avoid prop drilling)

**Example - Optimized Validation:**
```tsx
// ❌ BAD - Recreates validation function on every render
function MyForm() {
  return (
    <FormField
      validate={(value) => !value ? 'Required' : undefined}
    >
      <Input />
    </FormField>
  );
}

// ✅ GOOD - Validation function created once
const validateRequired = (value) => !value ? 'Required' : undefined;

function MyForm() {
  return (
    <FormField validate={validateRequired}>
      <Input />
    </FormField>
  );
}

// ✅ BETTER - Memoized if parent re-renders frequently
function MyForm() {
  const validateEmail = useCallback((value) => {
    if (!value) return 'Required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Invalid email';
    }
    return undefined;
  }, []); // No dependencies, stable reference

  return <FormField validate={validateEmail}><Input /></FormField>;
}
```

---

## Migration Guide

### From v2.x to v3.0.0

**Non-Breaking Changes:**
All v2.x code continues to work in v3.0.0.

**New Features (Opt-In):**
- ✅ `validate` prop - Add real-time validation
- ✅ `onValidChange` callback - Track validation state
- ✅ `successMessage` prop - Show success state
- ✅ `initialValue` prop - Pre-fill input
- ✅ `inputTitle` prop - Add tooltip
- ✅ Automatic input prop injection (value, onChange, hasError, isValid)

**Migration Example:**
```tsx
// v2.x (OLD - still works in v3.0.0)
const [email, setEmail] = useState('');
const [error, setError] = useState('');

<FormField label="Email" error={error}>
  <Input
    value={email}
    onChange={(e) => {
      setEmail(e.target.value);
      // Manual validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)) {
        setError('Invalid email');
      } else {
        setError('');
      }
    }}
    hasError={!!error}
  />
</FormField>

// v3.0.0 (NEW - automatic validation)
<FormField
  label="Email"
  validate={(value) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Invalid email';
    }
    return undefined;
  }}
  reserveMessageSpace
>
  <Input /> {/* FormField manages value, onChange, hasError */}
</FormField>
```

**Benefits of v3.0.0:**
- Less boilerplate (no manual value/onChange management)
- Automatic error clearing
- Touched state handling
- Success message support
- Form-level validation tracking

---

## Changelog

### v3.0.0 (2025-10-19) - Major Update
- 🎉 **NEW**: `validate` prop for real-time validation
- 🎉 **NEW**: `onValidChange` callback for form-level validation state
- 🎉 **NEW**: Automatic input prop injection (value, onChange, hasError, isValid)
- 🎉 **NEW**: `successMessage` prop for success state display
- 🎉 **NEW**: `initialValue` prop for pre-filling inputs
- 🎉 **NEW**: `inputTitle` prop for input tooltips
- ✅ ENHANCED: Automatic error clearing when input becomes valid
- ✅ ENHANCED: Touched state management (hide errors until field interacted)
- ✅ ENHANCED: External error override (server errors prioritized)
- ✅ ENHANCED: Error icon (⚠) and success icon (✓) display
- ✅ 78 unit tests (100% coverage, added 17 v3.0.0 tests)

### v2.0.0 (2025-10-19)
- ✅ Added `reserveMessageSpace` prop to prevent layout shift
- ✅ Added `.messageArea--reserved` CSS class (min-height allocation)
- ✅ Improved error icon rendering
- 🐛 Fixed layout shift when error messages appear/disappear

### v1.0.0 (2025-10-18)
- 🎉 Initial release
- ✅ Label + input wrapper
- ✅ Required indicator
- ✅ Error message display
- ✅ Helper text support
- ✅ Full-width mode
- ✅ Basic accessibility (role="alert")

---

## Contributing

### Adding New Feature

1. Update `FormFieldProps` interface
2. Add logic in FormField component
3. Update this documentation (Features, Props, Examples)
4. Add tests for new feature
5. Ensure 100% coverage maintained

### Reporting Issues

1. Check [Known Issues](#known-issues) first
2. Create task in project management (get Task #XXX)
3. Add to this documentation under "Known Issues"
4. Include:
   - Severity (Low/Medium/High/Critical)
   - Affected features
   - Workaround (if any)
   - Steps to reproduce

---

## Resources

### Internal Links
- [Input](Input.md) - Text input component
- [Select](Select.md) - Dropdown select component
- [RadioGroup](RadioGroup.md) - Radio button group
- [Checkbox](Checkbox.md) - Checkbox input
- [Button](Button.md) - Form submit buttons
- [Coding Standards](../programming/coding-standards.md)
- [Design System](../design/component-design-system.md)
- [Testing Guide](../programming/testing-overview.md)

### External References
- [WCAG 2.1 Forms](https://www.w3.org/WAI/WCAG21/quickref/#forms)
- [ARIA Authoring Practices - Forms](https://www.w3.org/WAI/ARIA/apg/patterns/)
- [MDN Form Validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)
- [React Controlled Components](https://react.dev/learn/sharing-state-between-components)

---

**Last Updated**: 2025-10-20
**Maintainer**: BOSSystems s.r.o.
**Documentation Version**: 1.0.0
**Component Version**: 3.0.0
