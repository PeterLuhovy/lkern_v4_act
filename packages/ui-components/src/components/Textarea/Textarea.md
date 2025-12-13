# ================================================================
# Textarea
# ================================================================
# File: L:\system\lkern_codebase_v4_act\packages\ui-components\src\components\Textarea\Textarea.md
# Version: 1.0.0
# Created: 2025-11-29
# Updated: 2025-12-10
# Source: packages/ui-components/src/components/Textarea/Textarea.tsx
# Package: @l-kern/ui-components
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Simplified textarea component providing consistent styling without validation logic.
#   Designed to work with FormField wrapper for labels and validation messages.
# ================================================================

---

## Overview

**Purpose**: Styled multi-line text input component without built-in validation
**Package**: @l-kern/ui-components
**Path**: packages/ui-components/src/components/Textarea
**Since**: v1.0.0

The Textarea component provides a consistently styled HTML `<textarea>` element following the same design pattern as the Input component. It handles only visual styling (borders, colors, states) and delegates validation logic to the FormField wrapper component. Supports all standard HTML textarea attributes (rows, cols, placeholder, maxLength, etc.).

---

## Features

- ✅ **Pure Styled Element**: No validation logic (use FormField wrapper for that)
- ✅ **Error/Valid States**: Visual feedback via `hasError` and `isValid` props
- ✅ **Full-Width Mode**: Expands to 100% container width
- ✅ **All HTML Attributes**: Supports rows, cols, placeholder, maxLength, disabled, etc.
- ✅ **Controlled/Uncontrolled**: Works with both React patterns
- ✅ **FormField Integration**: Designed to work with FormField wrapper
- ✅ **Character Counter Support**: Use FormField's maxLength feature
- ✅ **Accessible**: aria-invalid attribute for error state
- ✅ **TypeScript**: Full type safety extending HTMLTextAreaElement
- ✅ **Theme-Aware**: Uses CSS variables for consistent theming

---

## Quick Start

### Basic Usage

```tsx
import { Textarea } from '@l-kern/ui-components';

function CommentForm() {
  const [comment, setComment] = useState('');

  return (
    <div>
      <label htmlFor="comment">Comment</label>
      <Textarea
        id="comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Enter your comment..."
        rows={4}
      />
    </div>
  );
}
```

### Common Patterns

#### Pattern 1: Textarea with FormField Wrapper (Recommended)

```tsx
import { Textarea } from '@l-kern/ui-components';
import { FormField } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';

function DescriptionField() {
  const { t } = useTranslation();
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  return (
    <FormField
      label={t('issue.description')}
      error={errors.description}
      required
      reserveMessageSpace
    >
      <Textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={6}
        hasError={!!errors.description}
        placeholder={t('issue.descriptionPlaceholder')}
      />
    </FormField>
  );
}
```

#### Pattern 2: Textarea with Character Counter

```tsx
import { Textarea } from '@l-kern/ui-components';
import { FormField } from '@l-kern/ui-components';

function CommentField() {
  const [comment, setComment] = useState('');
  const MAX_LENGTH = 500;

  return (
    <FormField
      label="Comment"
      maxLength={MAX_LENGTH}
      reserveMessageSpace
    >
      <Textarea
        id="comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={MAX_LENGTH}
        rows={4}
        placeholder="Add a comment..."
      />
    </FormField>
  );
}
```

#### Pattern 3: Full-Width Textarea

```tsx
import { Textarea } from '@l-kern/ui-components';

function NotesSection() {
  const [notes, setNotes] = useState('');

  return (
    <div style={{ width: '100%' }}>
      <label>Internal Notes</label>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        fullWidth
        rows={8}
        placeholder="Enter internal notes (not visible to customers)..."
      />
    </div>
  );
}
```

---

## Props API

### TextareaProps

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `fullWidth` | `boolean` | `false` | No | Makes textarea expand to 100% of container width |
| `hasError` | `boolean` | `false` | No | Applies error styling (red border) - typically set when validation fails |
| `isValid` | `boolean` | `false` | No | Applies success styling (green border) - for validated fields |
| ...rest | `HTMLTextareaAttributes` | - | No | All standard HTML textarea attributes (rows, cols, placeholder, etc.) |

### Type Definitions

```typescript
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Make textarea full width of container
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Apply error styling (red border)
   * Note: Error message should be handled by FormField wrapper
   * @default false
   */
  hasError?: boolean;

  /**
   * Apply success styling (green border) - for valid fields
   * @default false
   */
  isValid?: boolean;
}
```

### Standard HTML Textarea Attributes

The component supports all standard HTML `<textarea>` attributes:

- `rows` - Number of visible text lines
- `cols` - Visible width of text area
- `placeholder` - Placeholder text
- `maxLength` - Maximum character length
- `disabled` - Disables the textarea
- `readOnly` - Makes textarea read-only
- `required` - HTML5 required attribute
- `autoFocus` - Auto-focus on mount
- `wrap` - Text wrapping mode
- `value` / `defaultValue` - Controlled/uncontrolled value
- `onChange` - Change event handler

---

## Visual Design

### States

1. **Default**: Gray border, white background
2. **Focus**: Purple border (primary color)
3. **Error** (`hasError={true}`): Red border
4. **Valid** (`isValid={true}`): Green border
5. **Disabled**: Grayed out, non-interactive

### Border Colors

```css
.textarea {
  border: 2px solid var(--theme-input-border, #e0e0e0);
}

.textarea:focus {
  border-color: var(--color-brand-primary, #9c27b0);
}

.textarea--error {
  border-color: var(--color-status-error, #f44336);
}

.textarea--valid {
  border-color: var(--color-status-success, #4caf50);
}

.textarea--fullWidth {
  width: 100%;
}
```

---

## Behavior

### Controlled vs Uncontrolled

**Controlled (Recommended):**
```tsx
const [text, setText] = useState('');

<Textarea
  value={text}
  onChange={(e) => setText(e.target.value)}
/>
```

**Uncontrolled:**
```tsx
<Textarea
  defaultValue="Initial text"
  ref={textareaRef}
/>
```

### Integration with FormField

Textarea is designed to work seamlessly with FormField wrapper:

```tsx
<FormField label="Description" error={errors.description}>
  <Textarea hasError={!!errors.description} />
</FormField>
```

FormField provides:
- Label rendering
- Error message display
- Required indicator (*)
- Character counter (if maxLength set)

Textarea provides:
- Visual styling (borders, colors)
- Error/valid state colors
- Input functionality

---

## Accessibility

### ARIA Attributes

```tsx
<textarea
  aria-invalid={hasError ? 'true' : 'false'}
  {...props}
/>
```

- `aria-invalid`: Indicates validation state to screen readers

### Label Association

Always associate textarea with a label:

```tsx
<label htmlFor="description">Description</label>
<Textarea id="description" />
```

Or use FormField wrapper (handles automatically):

```tsx
<FormField label="Description">
  <Textarea id="description" />
</FormField>
```

### Keyboard Support

Standard HTML textarea keyboard behavior:
- **Tab**: Focus textarea
- **Shift+Tab**: Focus previous element
- **Enter**: New line (not submit)
- **Ctrl+A**: Select all text

---

## Examples

### Example 1: Simple Textarea

```tsx
import { Textarea } from '@l-kern/ui-components';

function SimpleForm() {
  const [text, setText] = useState('');

  return (
    <Textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Enter text..."
      rows={4}
    />
  );
}
```

### Example 2: Textarea with Validation

```tsx
import { Textarea, FormField } from '@l-kern/ui-components';
import { useState } from 'react';

function ValidatedTextarea() {
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  const validate = (value) => {
    if (value.length < 10) {
      setErrors({ description: 'Description must be at least 10 characters' });
    } else {
      setErrors({});
    }
  };

  return (
    <FormField label="Description" error={errors.description} required>
      <Textarea
        id="description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          validate(e.target.value);
        }}
        hasError={!!errors.description}
        rows={6}
      />
    </FormField>
  );
}
```

### Example 3: Textarea with Character Limit

```tsx
import { Textarea, FormField } from '@l-kern/ui-components';

function LimitedTextarea() {
  const [text, setText] = useState('');
  const MAX = 500;

  return (
    <FormField label="Comment" maxLength={MAX}>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={MAX}
        rows={4}
      />
    </FormField>
  );
}
```

### Example 4: Disabled Textarea

```tsx
import { Textarea } from '@l-kern/ui-components';

function ReadOnlyNotes() {
  return (
    <Textarea
      value="This is read-only content that cannot be edited."
      disabled
      rows={3}
    />
  );
}
```

---

## Known Issues

**No known issues** - Component is stable and production-ready.

---

## Testing

### Test Coverage

- **Unit Tests**: 6 tests, 100% coverage
- **Component Tests**: Rendering, states, props

### Key Test Cases

1. **Renders textarea element**
   ```tsx
   render(<Textarea />);
   expect(screen.getByRole('textbox')).toBeInTheDocument();
   ```

2. **Applies error styling**
   ```tsx
   render(<Textarea hasError={true} />);
   expect(screen.getByRole('textbox')).toHaveClass('textarea--error');
   ```

3. **Applies full-width styling**
   ```tsx
   render(<Textarea fullWidth={true} />);
   expect(screen.getByRole('textbox')).toHaveClass('textarea--fullWidth');
   ```

4. **Handles change events**
   ```tsx
   const handleChange = jest.fn();
   render(<Textarea onChange={handleChange} />);
   fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Test' } });
   expect(handleChange).toHaveBeenCalled();
   ```

5. **Sets aria-invalid when hasError**
   ```tsx
   render(<Textarea hasError={true} />);
   expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
   ```

---

## Related Components

- [FormField](../FormField/FormField.md) - Form field wrapper (recommended for labels/validation)
- [Input](../Input/Input.md) - Single-line input component (similar pattern)
- [Button](../Button/Button.md) - Button for form submission

---

## Changelog

### v1.0.0 (2025-11-29)
- ✅ Initial release
- ✅ Simplified styling component (no validation logic)
- ✅ Error/valid state styling
- ✅ Full-width mode
- ✅ All HTML textarea attributes supported
- ✅ FormField integration
- ✅ TypeScript types
- ✅ Accessible (aria-invalid)

---

## Best Practices

1. **Use FormField wrapper** - For labels, errors, character counters
2. **Set rows appropriately** - 3-4 for comments, 6-8 for descriptions, 10+ for long content
3. **Always provide placeholder** - Guide users on expected input
4. **Use maxLength** - Prevent excessive input (with FormField counter)
5. **Validate on blur** - Not on every keystroke (better UX)
6. **Show error state** - Set `hasError={!!errors.fieldName}`
7. **Associate with label** - Use `htmlFor` and `id` attributes
8. **Consider fullWidth** - For most use cases (better mobile experience)

---

**End of Textarea Documentation**
