# ================================================================
# Checkbox
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\components\Checkbox.md
# Version: 1.0.0
# Created: 2025-10-20
# Updated: 2025-10-20
# Component Location: packages/ui-components/src/components/Checkbox/Checkbox.tsx
# Package: @l-kern/ui-components
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Checkbox component with label, error states, helper text, and indeterminate state.
#   Features modern gradient design with accessibility support and keyboard navigation.
# ================================================================

---

## Overview

**Purpose**: Interactive checkbox input for boolean selections with optional partial state support
**Package**: @l-kern/ui-components
**Path**: packages/ui-components/src/components/Checkbox
**Since**: v1.0.0

The Checkbox component provides a customizable checkbox input with label, error states, helper text, and indeterminate state support. Built with modern gradient design, accessibility features (ARIA attributes), and keyboard navigation. Perfect for forms, settings panels, and "select all" functionality with partial selections.

---

## Features

- ✅ **Custom Visual Design**: Modern gradient background with animated checkmark and lift effects
- ✅ **Indeterminate State**: Support for "some but not all" selections (useful for "Select All" checkboxes)
- ✅ **Error & Helper Text**: Display validation errors or helpful descriptions below checkbox
- ✅ **Label Support**: Optional label text displayed next to checkbox
- ✅ **Disabled State**: Visual and functional disabled state with reduced opacity
- ✅ **Keyboard Accessible**: Space bar toggles checkbox, Tab for navigation
- ✅ **ARIA Compliant**: aria-invalid for errors, aria-describedby for helper/error text
- ✅ **Forward Ref**: Supports React ref forwarding for form integration
- ✅ **Theme Integration**: Uses CSS variables for colors (--theme-*, --color-brand-primary)
- ✅ **Translation Ready**: All text props (label, error, helperText) accept translated strings

---

## Quick Start

### Basic Usage

```tsx
import { Checkbox } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';

function MyForm() {
  const { t } = useTranslation();
  const [agreed, setAgreed] = useState(false);

  return (
    <Checkbox
      label={t('forms.agreeToTerms')}
      checked={agreed}
      onChange={(e) => setAgreed(e.target.checked)}
    />
  );
}
```

### Common Patterns

#### Pattern 1: Checkbox with Error State
```tsx
import { Checkbox } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import { useState } from 'react';

function TermsCheckbox() {
  const { t } = useTranslation();
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!agreed) {
      setError(t('forms.errors.mustAcceptTerms'));
      return;
    }
    // Continue with form submission
  };

  return (
    <Checkbox
      label={t('forms.agreeToTerms')}
      checked={agreed}
      onChange={(e) => {
        setAgreed(e.target.checked);
        setError(''); // Clear error on change
      }}
      error={error}
    />
  );
}
```

#### Pattern 2: Select All with Indeterminate State
```tsx
import { Checkbox } from '@l-kern/ui-components';
import { useState, useMemo } from 'react';

function SelectAllList() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const allItems = ['item1', 'item2', 'item3'];

  const allSelected = selectedItems.length === allItems.length;
  const someSelected = selectedItems.length > 0 && !allSelected;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(allItems);
    } else {
      setSelectedItems([]);
    }
  };

  return (
    <div>
      <Checkbox
        label="Select All"
        checked={allSelected}
        indeterminate={someSelected}
        onChange={handleSelectAll}
      />
      {allItems.map(item => (
        <Checkbox
          key={item}
          label={item}
          checked={selectedItems.includes(item)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedItems([...selectedItems, item]);
            } else {
              setSelectedItems(selectedItems.filter(i => i !== item));
            }
          }}
        />
      ))}
    </div>
  );
}
```

#### Pattern 3: Form Integration with Ref
```tsx
import { Checkbox } from '@l-kern/ui-components';
import { useRef } from 'react';

function FormWithFocus() {
  const checkboxRef = useRef<HTMLInputElement>(null);

  const focusCheckbox = () => {
    checkboxRef.current?.focus();
  };

  return (
    <div>
      <Checkbox
        ref={checkboxRef}
        label="I agree to the terms"
        helperText="Please read the terms and conditions"
      />
      <button onClick={focusCheckbox}>Focus Checkbox</button>
    </div>
  );
}
```

---

## Props API

### CheckboxProps

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `label` | `string` | `undefined` | No | Label text displayed next to checkbox |
| `error` | `string` | `undefined` | No | Error message (shows error state, red border) |
| `helperText` | `string` | `undefined` | No | Helper text displayed below checkbox (gray text) |
| `indeterminate` | `boolean` | `false` | No | Indeterminate state (dash icon, for partial selections) |
| `disabled` | `boolean` | `false` | No | Disables checkbox interaction |
| `checked` | `boolean` | `undefined` | No | Controlled checked state (use with onChange) |
| `onChange` | `(e: ChangeEvent) => void` | `undefined` | No | Change handler for checkbox state |
| `className` | `string` | `undefined` | No | Additional CSS classes for wrapper div |
| `id` | `string` | `undefined` | No | HTML id attribute (used for aria-describedby) |
| `name` | `string` | `undefined` | No | HTML name attribute (for form submission) |
| `value` | `string` | `undefined` | No | HTML value attribute |
| `required` | `boolean` | `false` | No | HTML required attribute |
| `...props` | `InputHTMLAttributes` | - | No | All standard HTML input attributes (except `type`) |

### Type Definitions

```typescript
import React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * Label text displayed next to the checkbox
   */
  label?: string;

  /**
   * Error message to display (shows error state)
   */
  error?: string;

  /**
   * Helper text to display below the checkbox
   */
  helperText?: string;

  /**
   * Indeterminate state (for "some but not all" selections)
   */
  indeterminate?: boolean;
}
```

**Note**: The `type` attribute is omitted from props since it's always set to `"checkbox"` internally.

---

## Visual Design

### States

**Unchecked (Default)**
- Background: White gradient (#ffffff)
- Border: Light gray (--theme-input-border, #e0e0e0), 2px solid
- Size: 18px × 18px
- Border radius: 4px
- Shadow: Inset shadow (subtle depth)

**Checked**
- Background: Purple gradient (#9c27b0 → #7b1fa2)
- Border: Purple (--color-brand-primary, #9c27b0)
- Checkmark: White, animated checkmark icon (rotate + scale)
- Shadow: 3-layer shadow (inset + elevation + glow ring)
- Ring: 3px purple glow (rgba(156, 39, 176, 0.15))

**Indeterminate**
- Background: Purple gradient (#9c27b0 → #7b1fa2)
- Border: Purple (--color-brand-primary)
- Icon: White horizontal dash (10px wide, 2px tall)
- Shadow: Same as checked state

**Hover (Not Disabled)**
- Border: Purple (--color-brand-primary)
- Ring: 3px purple glow (rgba(156, 39, 176, 0.1))
- Transform: Scale 1.05 (subtle lift effect)

**Focus**
- Ring: 3px purple glow (rgba(156, 39, 176, 0.25), stronger than hover)
- Outline: None (custom focus ring via box-shadow)

**Disabled**
- Background: Light gray (#f5f5f5)
- Border: Gray (#e0e0e0)
- Opacity: 0.5
- Cursor: not-allowed
- Checked state: Gray gradient (#9e9e9e), dimmed checkmark

**Error State**
- Border: Red (--color-status-error, #f44336)
- Ring: 3px red glow (rgba(244, 67, 54, 0.1))
- Error text: Red, 12px font size

### Spacing

**Checkbox Size**: 18px × 18px (--spacing-md)
**Label Gap**: 8px (--spacing-sm) between checkbox and label
**Wrapper Gap**: 4px (--spacing-xs) between checkbox/label and helper/error text
**Helper Text Margin**: 20px left (aligns with label text start)

---

## Behavior

### Interaction States

**Default** - Clickable checkbox
- Cursor: `pointer` on label and checkbox
- Click label: Toggles checkbox
- Click checkbox: Toggles checkbox
- Hover: Purple border + scale effect

**Disabled** - Cannot interact
- Cursor: `not-allowed`
- Opacity: `0.6` on label
- Checkbox opacity: `0.5`
- Click: No effect
- Keyboard: Not focusable (tabindex removed by disabled attribute)

**Indeterminate** - Partial selection
- Visual: Dash icon instead of checkmark
- Click: Transitions to checked state
- Does NOT represent a third state (it's a visual indicator only)

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Space` | Toggle checkbox (checked ↔ unchecked) |
| `Tab` | Focus next element |
| `Shift+Tab` | Focus previous element |

**Note**: Disabled checkboxes are not focusable.

### Animations

**Checkmark Animation**
- Duration: 220ms
- Easing: cubic-bezier(0.175, 0.885, 0.32, 1.275) (bounce effect)
- Transform: rotate(45deg) scale(0 → 1)
- Opacity: 0 → 1

**Hover Lift**
- Duration: 220ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1) (smooth)
- Transform: scale(1.05)

---

## Accessibility

### WCAG Compliance
- ✅ **WCAG 2.1 Level AA** compliant
- ✅ Keyboard navigable (Space to toggle)
- ✅ Screen reader support (label association, ARIA attributes)
- ✅ Color contrast ratio ≥ 4.5:1 (all states tested)
- ✅ Focus visible (3px purple ring)
- ✅ Error states properly communicated (aria-invalid + aria-describedby)

### ARIA Attributes

```tsx
<input
  type="checkbox"
  role="checkbox" // Implicit from type
  aria-invalid={hasError} // true when error prop present
  aria-describedby={error || helperText ? `${id}-description` : undefined}
  disabled={disabled}
/>
```

**Error State:**
```html
<input
  id="terms-checkbox"
  aria-invalid="true"
  aria-describedby="terms-checkbox-description"
/>
<div id="terms-checkbox-description">You must accept the terms</div>
```

**Helper Text:**
```html
<input
  id="newsletter-checkbox"
  aria-describedby="newsletter-checkbox-description"
/>
<div id="newsletter-checkbox-description">You can unsubscribe anytime</div>
```

### Screen Reader Behavior

- **Unchecked**: "Accept terms, checkbox, not checked"
- **Checked**: "Accept terms, checkbox, checked"
- **Indeterminate**: "Select all, checkbox, mixed" (partial selection)
- **Disabled**: "Disabled option, checkbox, disabled, not checked"
- **Error**: "Required field, checkbox, invalid, You must accept the terms"

---

## Responsive Design

### Breakpoints

**Mobile** (< 768px)
- Same sizing as desktop (18px checkbox)
- Touch-friendly: Label text is clickable
- Helper/error text: Same 12px font size

**Tablet** (768px - 1023px)
- Standard sizing applies
- No tablet-specific adjustments

**Desktop** (≥ 1024px)
- Standard sizing applies
- Hover effects work (desktop-only, no hover on mobile)

### Layout Behavior

Checkbox uses flexbox layout with vertical stacking:

```
┌─ checkboxWrapper (column layout) ─────────┐
│ ┌─ checkboxLabel (row layout) ──────────┐ │
│ │ [✓] Label text                        │ │
│ └───────────────────────────────────────┘ │
│ ┌─ helperText/errorText ────────────────┐ │
│ │     Helper or error message           │ │
│ └───────────────────────────────────────┘ │
└───────────────────────────────────────────┘
```

**Responsive Example:**
```tsx
// Mobile: Same as desktop (no changes needed)
<Checkbox label={t('forms.agreeToTerms')} />

// Desktop: Identical
<Checkbox label={t('forms.agreeToTerms')} />
```

---

## Styling

### CSS Variables Used

```css
/* Colors */
--color-brand-primary: #9c27b0 (purple - checked state)
--color-brand-primary-dark: #7b1fa2 (dark purple - gradient end)
--theme-input-background: #ffffff (white - unchecked background)
--theme-input-border: #e0e0e0 (light gray - border)
--theme-input-background-disabled: #f5f5f5 (disabled background)
--theme-text: #212121 (label text)
--theme-text-muted: #9e9e9e (helper text, disabled text)
--theme-button-text-on-color: #ffffff (checkmark color)
--color-status-error: #f44336 (error border/text)

/* Spacing */
--spacing-xs: 4px (wrapper gap, border radius)
--spacing-sm: 8px (label gap, checkmark height)
--spacing-md: 18px (checkbox size)
--spacing-xl: 20px (helper text margin)

/* Typography */
--font-size-sm: 12px (helper/error text)
--font-size-md: 14px (label text)
--font-weight-normal: 400
--line-height-normal: 1.5
```

### Custom Styling

**Via className prop:**
```tsx
<Checkbox className="my-custom-checkbox" label="Custom styled" />
```

```css
.my-custom-checkbox {
  /* Override wrapper styles */
  margin-bottom: 20px;
}

.my-custom-checkbox label {
  /* Override label styles */
  font-weight: 600;
}
```

**Via CSS Modules:**
```css
.myCheckbox {
  composes: checkboxWrapper from '@l-kern/ui-components/Checkbox.module.css';
  /* Additional custom styles */
  padding: 10px;
  background: #f9f9f9;
}
```

**Custom Checkbox Size (Advanced):**
```tsx
<Checkbox
  className="large-checkbox"
  label="Large checkbox"
/>
```

```css
.large-checkbox [class*="checkboxCustom"] {
  width: 24px !important;
  height: 24px !important;
}
```

---

## Known Issues

### Active Issues

**No known issues** ✅

All 58 tests passing, component stable in production.

### Fixed Issues

See [Changelog](#changelog) section below.

---

## Testing

### Test Coverage
- ✅ **Unit Tests**: 58 tests
- ✅ **Coverage**: 100% (statements, branches, functions, lines)
- ✅ **Accessibility Tests**: 4 tests (aria-invalid, aria-describedby)
- ✅ **Translation Tests**: 5 tests (label, error, helper text language switching)
- ✅ **Theme Tests**: 3 tests (CSS variables, error styles, disabled styles)
- ✅ **Interaction Tests**: 3 tests (click, onChange, disabled)

### Test File
`packages/ui-components/src/components/Checkbox/Checkbox.test.tsx`

### Running Tests
```bash
# Run Checkbox tests only
docker exec lkms201-web-ui npx nx test ui-components --testFile=Checkbox.test.tsx

# Run with coverage
docker exec lkms201-web-ui npx nx test ui-components --coverage --testFile=Checkbox.test.tsx

# Watch mode (local development)
npx nx test ui-components --watch --testFile=Checkbox.test.tsx
```

### Key Test Cases

**Rendering (5 tests):**
- ✅ Renders checkbox input with type="checkbox"
- ✅ Renders with label (getByLabelText works)
- ✅ Renders without label (checkbox still accessible)
- ✅ Renders with helper text
- ✅ Renders with error message

**States (4 tests):**
- ✅ Renders unchecked by default
- ✅ Renders checked when checked prop is true
- ✅ Renders disabled state
- ✅ Sets indeterminate state (checkbox.indeterminate === true)

**Accessibility (4 tests):**
- ✅ Sets aria-invalid="true" when error is present
- ✅ Does not set aria-invalid when no error
- ✅ Links error text with aria-describedby
- ✅ Links helper text with aria-describedby

**Interactions (3 tests):**
- ✅ Toggles checked state on click (unchecked → checked → unchecked)
- ✅ Calls onChange handler when clicked
- ✅ Does NOT toggle when disabled (onChange not called)

**Forward Ref (1 test):**
- ✅ Forwards ref to input element (ref.current is HTMLInputElement)

**HTML Attributes (2 tests):**
- ✅ Passes through standard input attributes (id, name, value, required)
- ✅ Applies custom className to wrapper div

**Theme CSS Variables (3 tests):**
- ✅ Uses theme CSS variables for colors (not hardcoded)
- ✅ Applies error styles using theme variables
- ✅ Applies disabled styles using theme variables

**Translation Support (5 tests):**
- ✅ Renders translated label text (Slovak example)
- ✅ Renders translated error message (Slovak example)
- ✅ Renders translated helper text (Slovak example)
- ✅ Updates label when translation changes (EN → SK)
- ✅ Updates error message when translation changes (EN → SK)

---

## Related Components

- **[Radio](Radio.md)** - Single-selection alternative to checkbox
- **[RadioGroup](RadioGroup.md)** - Groups radio buttons together
- **[FormField](FormField.md)** - Wraps form inputs with labels (can wrap Checkbox)
- **[Input](Input.md)** - Text input component (similar error/helper text pattern)

---

## Usage Examples

### Example 1: Basic Checkbox
```tsx
import { Checkbox } from '@l-kern/ui-components';
import { useState } from 'react';

function BasicExample() {
  const [agreed, setAgreed] = useState(false);

  return (
    <Checkbox
      label="I agree to the terms and conditions"
      checked={agreed}
      onChange={(e) => setAgreed(e.target.checked)}
    />
  );
}
```

**Output:**
- Unchecked checkbox with label
- Click label or checkbox to toggle
- Purple gradient when checked
- Animated checkmark appears

---

### Example 2: Checkbox with Error Validation
```tsx
import { Checkbox } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import { useState } from 'react';

function TermsCheckbox() {
  const { t } = useTranslation();
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const error = submitted && !agreed ? t('forms.errors.mustAcceptTerms') : '';

  const handleSubmit = () => {
    setSubmitted(true);
    if (!agreed) return;
    // Continue with form submission
    console.log('Form submitted');
  };

  return (
    <div>
      <Checkbox
        label={t('forms.agreeToTerms')}
        checked={agreed}
        onChange={(e) => {
          setAgreed(e.target.checked);
          setSubmitted(false); // Reset validation on change
        }}
        error={error}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
```

**Output:**
- Checkbox with validation
- Red border + error text if submitted without checking
- Error clears when checkbox is checked
- Slovak translation: "Musíte prijať podmienky"

---

### Example 3: Select All with Indeterminate State
```tsx
import { Checkbox } from '@l-kern/ui-components';
import { useState } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Buy groceries', completed: false },
    { id: 2, text: 'Walk the dog', completed: false },
    { id: 3, text: 'Write documentation', completed: false },
  ]);

  const completedCount = todos.filter(t => t.completed).length;
  const allCompleted = completedCount === todos.length;
  const someCompleted = completedCount > 0 && !allCompleted;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodos(todos.map(t => ({ ...t, completed: e.target.checked })));
  };

  const handleToggle = (id: number) => {
    setTodos(todos.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  return (
    <div>
      <Checkbox
        label={`Select All (${completedCount}/${todos.length})`}
        checked={allCompleted}
        indeterminate={someCompleted}
        onChange={handleSelectAll}
      />
      <hr />
      {todos.map(todo => (
        <Checkbox
          key={todo.id}
          label={todo.text}
          checked={todo.completed}
          onChange={() => handleToggle(todo.id)}
        />
      ))}
    </div>
  );
}
```

**Output:**
- "Select All" checkbox shows dash when some items selected
- Click "Select All" to check/uncheck all items
- Individual checkboxes update "Select All" state
- Indeterminate state (dash) appears when 1-2 items checked

---

### Example 4: Checkbox with Helper Text
```tsx
import { Checkbox } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';

function NewsletterCheckbox() {
  const { t } = useTranslation();

  return (
    <Checkbox
      label={t('forms.subscribeNewsletter')}
      helperText={t('forms.helperText.unsubscribeAnytime')}
    />
  );
}
```

**Output:**
- Checkbox with label
- Gray helper text below: "You can unsubscribe anytime"
- Helper text aligned with label (not checkbox)

---

### Example 5: Disabled Checkbox
```tsx
import { Checkbox } from '@l-kern/ui-components';

function DisabledExample() {
  return (
    <div>
      <Checkbox label="Disabled unchecked" disabled />
      <Checkbox label="Disabled checked" disabled checked readOnly />
    </div>
  );
}
```

**Output:**
- Grayed out checkboxes
- Cursor: not-allowed
- Cannot click or toggle
- Checked state: Gray gradient instead of purple

---

## Performance

### Bundle Size
- **JS**: ~1.2 KB (gzipped, including TypeScript types)
- **CSS**: ~1.5 KB (gzipped, all states + animations)
- **Total**: ~2.7 KB (minimal footprint)

### Runtime Performance
- **Render time**: < 1ms (average, simple checkbox)
- **Re-renders**: Optimized with forwardRef + useCallback for indeterminate ref
- **Memory**: Negligible (~150 bytes per instance)
- **Animation**: CSS-only (checkmark, hover, no JavaScript, 60fps)

### Optimization Tips
- ✅ Memoize `onChange` handler with `useCallback()` if parent re-renders frequently
- ✅ Use controlled component pattern (`checked` + `onChange`) for form integration
- ✅ Avoid recreating label/error/helperText strings on every render (use translation keys)
- ✅ CSS Modules ensure no style conflicts (scoped styles)

**Example - Optimized onChange:**
```tsx
const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  setAgreed(e.target.checked);
}, []); // No dependencies, stable reference

<Checkbox label="Accept" onChange={handleChange} />
```

---

## Migration Guide

### From v3 to v4

**No breaking changes** - Checkbox API is identical to v3.

**New Features:**
- ✅ Added `indeterminate` prop (opt-in, v4 only)
- ✅ Improved gradient design (visual enhancement)
- ✅ Enhanced accessibility (stronger ARIA support)

**Migration Example:**
```tsx
// v3 - Still works in v4
<Checkbox label="Accept terms" error="Required" />

// v4 - New indeterminate feature
<Checkbox label="Select All" indeterminate={someSelected} />
```

---

## Changelog

### v1.0.0 (2025-10-18)
- 🎉 Initial release
- ✅ Custom gradient design with animated checkmark
- ✅ Indeterminate state support (dash icon)
- ✅ Error and helper text support
- ✅ ARIA accessibility (aria-invalid, aria-describedby)
- ✅ Forward ref support
- ✅ 58 unit tests (100% coverage)
- ✅ Theme CSS variables integration
- ✅ Translation support (label, error, helperText)

---

## Contributing

### Reporting Issues

1. Check [Known Issues](#known-issues) first
2. Create task in project management (get Task #XXX)
3. Add to this documentation under "Known Issues"
4. Include:
   - Severity (Low/Medium/High/Critical)
   - Affected states (checked/unchecked/indeterminate/disabled)
   - Workaround (if any)
   - Steps to reproduce

---

## Resources

### Internal Links
- [Coding Standards](../programming/coding-standards.md)
- [Design System](../design/component-design-system.md)
- [Testing Guide](../programming/testing-overview.md)
- [Translation System](../packages/config.md#translations-system)

### External References
- [React 19 Documentation](https://react.dev)
- [WCAG 2.1 Guidelines - Checkbox](https://www.w3.org/WAI/WCAG21/quickref/?tags=forms)
- [ARIA Authoring Practices - Checkbox](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)
- [MDN Checkbox Input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox)

---

**Last Updated**: 2025-10-20
**Maintainer**: BOSSystems s.r.o.
**Documentation Version**: 1.0.0
**Component Version**: 1.0.0
