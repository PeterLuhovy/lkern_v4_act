# ================================================================
# RadioGroup
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\components\RadioGroup.md
# Version: 1.0.0
# Created: 2025-10-20
# Updated: 2025-10-20
# Component Location: packages/ui-components/src/components/Radio/RadioGroup.tsx
# Package: @l-kern/ui-components
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Wrapper component for managing radio button groups with unified state,
#   error handling, and accessibility features.
# ================================================================

---

## Overview

**Purpose**: Manage groups of radio buttons with unified selection state and validation
**Package**: @l-kern/ui-components
**Path**: packages/ui-components/src/components/Radio
**Since**: v1.0.0

RadioGroup is a container component that manages a collection of Radio buttons as a single selection group. It handles state management, error display, helper text, and provides proper ARIA attributes for screen readers. Supports both vertical and horizontal layouts with individual or group-level disabled states.

---

## Features

- ✅ **Unified State Management**: Single value prop controls entire group selection
- ✅ **2 Layout Directions**: vertical (default, stacked), horizontal (inline with wrapping)
- ✅ **Error Handling**: Error message display with red styling on all radios
- ✅ **Helper Text**: Optional helper text below radio group
- ✅ **Required Indicator**: Red asterisk (*) when required=true
- ✅ **Group Label**: Optional label for entire radio group
- ✅ **Individual Disabled**: Disable specific options via option.disabled
- ✅ **Group Disabled**: Disable entire group with disabled prop
- ✅ **ARIA Compliant**: role="radiogroup", aria-labelledby, aria-describedby
- ✅ **Translation Ready**: All labels, errors, helper text support translations
- ✅ **TypeScript**: Full type safety with RadioOption and RadioGroupProps interfaces

---

## Quick Start

### Basic Usage

```tsx
import { RadioGroup } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import { useState } from 'react';

function SizeSelector() {
  const { t } = useTranslation();
  const [size, setSize] = useState('');

  return (
    <RadioGroup
      name="size"
      label={t('product.selectSize')}
      options={[
        { value: 'small', label: t('sizes.small') },
        { value: 'medium', label: t('sizes.medium') },
        { value: 'large', label: t('sizes.large') },
      ]}
      value={size}
      onChange={setSize}
    />
  );
}
```

### Common Patterns

#### Pattern 1: With Validation (FormField wrapper)
```tsx
import { RadioGroup } from '@l-kern/ui-components';
import { FormField } from '@l-kern/ui-components';
import { useState } from 'react';

function PaymentMethodSelector() {
  const { t } = useTranslation();
  const [payment, setPayment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!payment) {
      setError(t('validation.paymentRequired'));
      return;
    }
    // Process payment
  };

  return (
    <FormField
      label={t('checkout.paymentMethod')}
      error={error}
      required
    >
      <RadioGroup
        name="payment"
        options={[
          { value: 'card', label: t('payment.creditCard') },
          { value: 'paypal', label: t('payment.paypal') },
          { value: 'bank', label: t('payment.bankTransfer') },
        ]}
        value={payment}
        onChange={(value) => {
          setPayment(value);
          setError(''); // Clear error on selection
        }}
        error={error}
      />
    </FormField>
  );
}
```

#### Pattern 2: Horizontal Layout
```tsx
<RadioGroup
  name="gender"
  label={t('profile.gender')}
  direction="horizontal"
  options={[
    { value: 'male', label: t('gender.male') },
    { value: 'female', label: t('gender.female') },
    { value: 'other', label: t('gender.other') },
  ]}
  value={gender}
  onChange={setGender}
/>
```

#### Pattern 3: With Disabled Options
```tsx
<RadioGroup
  name="plan"
  label={t('subscription.selectPlan')}
  options={[
    { value: 'free', label: 'Free - $0/month' },
    { value: 'pro', label: 'Pro - $9/month' },
    { value: 'enterprise', label: 'Enterprise - Contact us', disabled: true },
  ]}
  value={selectedPlan}
  onChange={setSelectedPlan}
  helperText={t('subscription.helperText')}
/>
```

---

## Props API

### RadioGroupProps

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `name` | `string` | - | **Yes** | Name attribute for all radio inputs (required for proper grouping) |
| `options` | `RadioOption[]` | - | **Yes** | Array of radio options to render |
| `value` | `string` | `undefined` | No | Currently selected value (controlled component) |
| `onChange` | `(value: string) => void` | `undefined` | No | Called when selection changes, receives selected value |
| `error` | `string` | `undefined` | No | Error message to display (shows error state on all radios) |
| `helperText` | `string` | `undefined` | No | Helper text displayed below the group |
| `label` | `string` | `undefined` | No | Label for the entire radio group |
| `required` | `boolean` | `false` | No | Shows red asterisk (*) next to label |
| `disabled` | `boolean` | `false` | No | Disables entire radio group |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | No | Layout direction for radio buttons |
| `className` | `string` | `undefined` | No | Additional CSS classes for group container |

### RadioOption Interface

```typescript
interface RadioOption {
  value: string;       // Unique value for this option
  label: string;       // Label text to display
  disabled?: boolean;  // Whether this specific option is disabled
}
```

### Type Definitions

```typescript
interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  direction?: 'vertical' | 'horizontal';
  className?: string;
}
```

---

## Visual Design

### Layout Directions

**Vertical (default)** - Stacked layout
- Radio buttons arranged vertically
- Gap: 12px between options
- Use: Default for forms, settings
- Best for: 3+ options, long labels

**Horizontal** - Inline layout
- Radio buttons arranged horizontally
- Gap: 16px between options
- Wraps to new line if needed (flex-wrap)
- Use: Short labels, 2-3 options
- Best for: Yes/No, Gender, simple choices

### States

**Normal** - Default state
- Label: Dark gray (#212121), 14px, weight 500
- Helper text: Muted gray (#9e9e9e), 12px
- Required indicator: Red (#f44336)

**Error** - Validation failed
- Error message: Red (#f44336), 12px
- All radio buttons: Red border + glow
- Label: Unchanged (dark gray)

**Disabled** - Cannot interact
- All radio buttons: Grayed out, opacity 0.6
- Label: Unchanged
- Cursor: not-allowed

---

## Behavior

### Selection Management

**Single Selection** - Only one radio can be checked
- Clicking new radio: Unchecks previous, checks new
- Value prop: Controls which radio is checked
- onChange: Called with new value (string)

**Controlled Component**
- Parent manages `value` state
- RadioGroup displays current selection
- onChange updates parent state
- Re-render updates checked radio

### Interaction States

**Default**
- Hover: Individual radio buttons show purple border + glow
- Focus: Focused radio shows 3px purple glow (keyboard navigation)
- Click: Selects radio, calls onChange

**Error**
- All radios: Red border + glow
- Error message: Displayed below group
- Linked via aria-describedby for screen readers

**Disabled (group-level)**
- All radios: Disabled, grayed out
- Clicking: No effect
- Keyboard: Cannot focus

**Disabled (option-level)**
- Only specific radio: Disabled, grayed out
- Other radios: Remain interactive
- Use: Unavailable options (e.g., "Coming soon")

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Focus first unchecked radio (or checked if exists) |
| `Shift+Tab` | Focus previous element |
| `Arrow Down` / `Arrow Right` | Select next radio in group |
| `Arrow Up` / `Arrow Left` | Select previous radio in group |
| `Space` | Select focused radio |

**Note**: Arrow keys automatically select radios (browser default behavior).

---

## Accessibility

### WCAG Compliance
- ✅ **WCAG 2.1 Level AA** compliant
- ✅ Keyboard navigable (Tab, Arrow keys, Space)
- ✅ Screen reader support (radiogroup role, ARIA labels)
- ✅ Color contrast ratio ≥ 4.5:1 (text vs background)
- ✅ Focus visible (3px purple glow on radios)
- ✅ Error messages linked with aria-describedby

### ARIA Attributes

```tsx
<div
  role="radiogroup"
  aria-labelledby="size-label"
>
  <div id="size-label">Select size *</div>

  <Radio
    name="size"
    value="small"
    aria-describedby="size-description"
  />
  <Radio
    name="size"
    value="medium"
    aria-describedby="size-description"
  />

  <div id="size-description">
    {error || helperText}
  </div>
</div>
```

### Screen Reader Behavior

- **Group Label**: "Select size, radiogroup, required"
- **Radio Option**: "Small, radio button, not checked, 1 of 3"
- **Selected Radio**: "Medium, radio button, checked, 2 of 3"
- **With Error**: "Please select size" announced after group label
- **Disabled**: "Large, radio button, disabled, unavailable"

---

## Responsive Design

### Breakpoints

**Mobile** (< 768px)
- Vertical layout recommended (default)
- Touch-friendly 18px radio buttons
- 12px gap between options

**Tablet** (768px - 1023px)
- Vertical or horizontal layout works
- Horizontal wraps to multiple lines if needed

**Desktop** (≥ 1024px)
- Vertical layout for long option lists
- Horizontal layout for 2-3 short options
- 16px gap in horizontal layout

### Layout Behavior

```tsx
// Mobile: Always vertical (easier to tap)
<RadioGroup
  name="plan"
  direction="vertical"
  options={planOptions}
/>

// Desktop: Horizontal for simple choices
<RadioGroup
  name="newsletter"
  direction="horizontal"
  options={[
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ]}
/>
```

**Recommendation**: Use vertical for 4+ options or complex labels.

---

## Styling

### CSS Variables Used

```css
/* Group Label */
--theme-text: #212121 (label color)
--font-size-md: 14px (label size)
--font-weight-medium: 500 (label weight)
--line-height-normal: 1.5 (label line height)

/* Required Indicator */
--color-status-error: #f44336 (red asterisk)

/* Helper Text */
--theme-text-muted: #9e9e9e (helper color)
--font-size-sm: 12px (helper size)

/* Error Text */
--color-status-error: #f44336 (error color)
--font-size-sm: 12px (error size)

/* Spacing */
--spacing-xs: 4px (label margin)
--spacing-sm: 8px (group gap)
--spacing-md: 12px (vertical gap)
--spacing-lg: 16px (horizontal gap)
```

### Custom Styling

**Via className prop:**
```tsx
<RadioGroup
  name="size"
  className="my-custom-group"
  options={options}
/>
```

```css
.my-custom-group {
  padding: 16px;
  border: 1px solid var(--theme-input-border);
  border-radius: 8px;
}
```

**Individual Radio Styling:**
RadioGroup passes styling to individual Radio components. See [Radio.md](Radio.md) for customization options.

---

## Known Issues

### Active Issues

**No known issues** ✅

All 81 tests passing (62 RadioGroup tests + 19 Radio tests), component stable.

### Fixed Issues

See [Changelog](#changelog) section below.

---

## Testing

### Test Coverage
- ✅ **Unit Tests**: 81 tests total (62 RadioGroup + 19 Radio)
- ✅ **RadioGroup Tests**: 62 tests
- ✅ **Coverage**: 100% (statements, branches, functions, lines)
- ✅ **Accessibility Tests**: 3 tests (radiogroup role, aria-labelledby, aria-describedby)
- ✅ **Translation Tests**: 8 tests (label, options, error, helper text switching)
- ✅ **Layout Tests**: 2 tests (vertical/horizontal direction)

### Test File
`packages/ui-components/src/components/Radio/RadioGroup.test.tsx`

### Running Tests
```bash
# Run RadioGroup tests only
docker exec lkms201-web-ui npx nx test ui-components --testFile=RadioGroup.test.tsx

# Run with coverage
docker exec lkms201-web-ui npx nx test ui-components --coverage --testFile=RadioGroup.test.tsx

# Watch mode (local development)
npx nx test ui-components --watch --testFile=RadioGroup.test.tsx
```

### Key Test Cases

**Rendering (5 tests):**
- ✅ Renders all radio options from array
- ✅ Renders with group label
- ✅ Renders required indicator (*) when required
- ✅ Renders with helper text
- ✅ Renders with error message

**Selection State (3 tests):**
- ✅ Selects radio matching value prop
- ✅ No selection when value is undefined
- ✅ Only one radio checked at a time (single selection)

**Interactions (2 tests):**
- ✅ Calls onChange with selected value when clicked
- ✅ Updates selection when clicking different options

**Disabled State (3 tests):**
- ✅ Disables all options when disabled prop is true
- ✅ Disables individual options based on option.disabled
- ✅ Does not call onChange when clicking disabled option

**Layout (2 tests):**
- ✅ Renders vertical layout by default
- ✅ Renders horizontal layout when direction="horizontal"

**Accessibility (3 tests):**
- ✅ Has radiogroup role
- ✅ Links label with radiogroup via aria-labelledby
- ✅ Links error text with radios via aria-describedby

**HTML Attributes (2 tests):**
- ✅ Applies name attribute to all radio inputs
- ✅ Applies custom className to group container

**Theme CSS Variables (3 tests):**
- ✅ Uses theme CSS variables for colors (not hardcoded)
- ✅ Applies error styles using theme variables
- ✅ Applies required indicator using theme variables

**Translation (8 tests):**
- ✅ Renders translated group label
- ✅ Renders translated option labels
- ✅ Renders translated error message
- ✅ Renders translated helper text
- ✅ Updates label when translation changes
- ✅ Updates option labels when translation changes
- ✅ Updates error message when translation changes
- ✅ Handles complex translations (e.g., "Free - $0/month" → "Zadarmo - 0€/mesiac")

---

## Related Components

- **[Radio](Radio.md)** - Individual radio button component (used internally by RadioGroup)
- **[Checkbox](Checkbox.md)** - Multi-selection alternative
- **[Select](Select.md)** - Dropdown alternative for many options
- **[FormField](FormField.md)** - Wraps RadioGroup with label and validation

---

## Usage Examples

### Example 1: Basic Size Selector
```tsx
import { RadioGroup } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import { useState } from 'react';

function ProductSizeSelector() {
  const { t } = useTranslation();
  const [selectedSize, setSelectedSize] = useState('');

  return (
    <RadioGroup
      name="product-size"
      label={t('product.selectSize')}
      options={[
        { value: 'xs', label: 'XS' },
        { value: 's', label: 'S' },
        { value: 'm', label: 'M' },
        { value: 'l', label: 'L' },
        { value: 'xl', label: 'XL' },
      ]}
      value={selectedSize}
      onChange={setSelectedSize}
      helperText={t('product.sizeGuide')}
    />
  );
}
```

**Output:**
- Label: "Select size"
- 5 radio buttons vertically stacked
- Helper text: "Size guide" below
- Selection updates `selectedSize` state

---

### Example 2: Payment Method with Validation
```tsx
import { RadioGroup } from '@l-kern/ui-components';
import { Button } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import { useState } from 'react';

function CheckoutPayment() {
  const { t } = useTranslation();
  const [payment, setPayment] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!payment) {
      setError(t('validation.paymentRequired'));
      return;
    }
    // Proceed to next step
    console.log('Selected payment:', payment);
  };

  return (
    <div>
      <RadioGroup
        name="payment-method"
        label={t('checkout.paymentMethod')}
        required
        options={[
          { value: 'card', label: t('payment.creditCard') },
          { value: 'paypal', label: 'PayPal' },
          { value: 'bank', label: t('payment.bankTransfer') },
          { value: 'crypto', label: t('payment.cryptocurrency'), disabled: true },
        ]}
        value={payment}
        onChange={(value) => {
          setPayment(value);
          setError(''); // Clear error on selection
        }}
        error={error}
      />

      <Button variant="primary" onClick={handleContinue}>
        {t('common.continue')}
      </Button>
    </div>
  );
}
```

**Output:**
- Label: "Payment method *"
- 4 radio options (1 disabled)
- Error message: "Please select payment method" (if validation fails)
- Red borders on all radios when error present

---

### Example 3: Horizontal Layout (Simple Yes/No)
```tsx
import { RadioGroup } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';

function NewsletterSubscription() {
  const { t } = useTranslation();
  const [subscribe, setSubscribe] = useState('');

  return (
    <RadioGroup
      name="newsletter"
      label={t('profile.newsletter')}
      direction="horizontal"
      options={[
        { value: 'yes', label: t('common.yes') },
        { value: 'no', label: t('common.no') },
      ]}
      value={subscribe}
      onChange={setSubscribe}
      helperText={t('profile.newsletterHelper')}
    />
  );
}
```

**Output:**
- Label: "Newsletter subscription"
- 2 radio buttons side by side (horizontal)
- Helper text: "You can unsubscribe anytime"

---

### Example 4: Subscription Plans with Disabled Option
```tsx
import { RadioGroup } from '@l-kern/ui-components';
import { Badge } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import { useState } from 'react';

function SubscriptionPlanSelector() {
  const { t } = useTranslation();
  const [plan, setPlan] = useState('free');

  const plans = [
    {
      value: 'free',
      label: `${t('plans.free')} - $0/month`,
    },
    {
      value: 'pro',
      label: `${t('plans.pro')} - $9/month`,
    },
    {
      value: 'enterprise',
      label: `${t('plans.enterprise')} - Contact us`,
      disabled: true, // Coming soon
    },
  ];

  return (
    <div>
      <RadioGroup
        name="subscription-plan"
        label={t('subscription.selectPlan')}
        options={plans}
        value={plan}
        onChange={setPlan}
        helperText={t('subscription.helperText')}
      />

      {plan === 'free' && (
        <Badge variant="info">
          {t('subscription.currentPlan')}
        </Badge>
      )}
    </div>
  );
}
```

**Output:**
- Label: "Select plan"
- 3 radio options (enterprise disabled + grayed out)
- Helper text: "Upgrade anytime, cancel anytime"
- Badge: "Current plan" shown when free selected

---

### Example 5: Controlled Component with Form
```tsx
import { RadioGroup } from '@l-kern/ui-components';
import { Button } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import { useState } from 'react';

function SurveyForm() {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState({
    satisfaction: '',
    recommend: '',
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!answers.satisfaction) {
      newErrors.satisfaction = t('validation.required');
    }
    if (!answers.recommend) {
      newErrors.recommend = t('validation.required');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit survey
    console.log('Survey submitted:', answers);
  };

  return (
    <form onSubmit={handleSubmit}>
      <RadioGroup
        name="satisfaction"
        label={t('survey.satisfaction')}
        required
        options={[
          { value: '1', label: t('survey.veryDissatisfied') },
          { value: '2', label: t('survey.dissatisfied') },
          { value: '3', label: t('survey.neutral') },
          { value: '4', label: t('survey.satisfied') },
          { value: '5', label: t('survey.verySatisfied') },
        ]}
        value={answers.satisfaction}
        onChange={(value) => {
          setAnswers({ ...answers, satisfaction: value });
          setErrors({ ...errors, satisfaction: '' });
        }}
        error={errors.satisfaction}
      />

      <RadioGroup
        name="recommend"
        label={t('survey.recommend')}
        required
        direction="horizontal"
        options={[
          { value: 'yes', label: t('common.yes') },
          { value: 'no', label: t('common.no') },
          { value: 'maybe', label: t('common.maybe') },
        ]}
        value={answers.recommend}
        onChange={(value) => {
          setAnswers({ ...answers, recommend: value });
          setErrors({ ...errors, recommend: '' });
        }}
        error={errors.recommend}
      />

      <Button variant="primary" type="submit">
        {t('survey.submit')}
      </Button>
    </form>
  );
}
```

**Output:**
- Two radio groups in form
- Satisfaction: 5 options, vertical layout
- Recommend: 3 options, horizontal layout
- Validation on submit
- Errors cleared on selection

---

## Performance

### Bundle Size
- **JS**: ~1.5 KB (gzipped, RadioGroup + Radio combined)
- **CSS**: ~1.0 KB (gzipped, both components)
- **Total**: ~2.5 KB (minimal footprint)

### Runtime Performance
- **Render time**: < 1ms for 5 options (average)
- **Re-renders**: Only when value/options/error props change
- **Memory**: ~500 bytes per RadioGroup instance

### Optimization Tips
- ✅ Memoize `onChange` handler with `useCallback()` if parent re-renders frequently
- ✅ Memoize `options` array if dynamically generated (avoid recreating on each render)
- ✅ Use controlled component pattern (value + onChange) for predictable state
- ✅ Avoid inline option arrays (define outside component)

**Example - Optimized Options:**
```tsx
// ❌ BAD - Recreates array on every render
function MyForm() {
  return (
    <RadioGroup
      name="size"
      options={[
        { value: 's', label: 'Small' },
        { value: 'm', label: 'Medium' },
        { value: 'l', label: 'Large' },
      ]}
    />
  );
}

// ✅ GOOD - Array created once
const SIZE_OPTIONS = [
  { value: 's', label: 'Small' },
  { value: 'm', label: 'Medium' },
  { value: 'l', label: 'Large' },
];

function MyForm() {
  return <RadioGroup name="size" options={SIZE_OPTIONS} />;
}
```

---

## Migration Guide

### From v3 to v4

**Breaking Changes:**
None - RadioGroup is new in v4.

**New in v4:**
- ✅ RadioGroup component introduced
- ✅ Replaces manual Radio + wrapper pattern
- ✅ Unified state management
- ✅ Built-in error handling

**Migration Example:**
```tsx
// v3 (OLD - Manual Radio management)
<div className="radio-group">
  <label>Select size</label>
  <Radio name="size" value="s" checked={size === 's'} onChange={() => setSize('s')} />
  <Radio name="size" value="m" checked={size === 'm'} onChange={() => setSize('m')} />
  <Radio name="size" value="l" checked={size === 'l'} onChange={() => setSize('l')} />
  {error && <span className="error">{error}</span>}
</div>

// v4 (NEW - RadioGroup)
<RadioGroup
  name="size"
  label="Select size"
  options={[
    { value: 's', label: 'Small' },
    { value: 'm', label: 'Medium' },
    { value: 'l', label: 'Large' },
  ]}
  value={size}
  onChange={setSize}
  error={error}
/>
```

---

## Changelog

### v1.0.0 (2025-10-18)
- 🎉 Initial release
- ✅ Unified radio button group management
- ✅ Vertical and horizontal layout support
- ✅ Error message display
- ✅ Helper text support
- ✅ Group and individual disabled states
- ✅ Required indicator
- ✅ Full ARIA compliance (radiogroup, aria-labelledby, aria-describedby)
- ✅ 62 unit tests (100% coverage)
- ✅ Translation support (8 tests)

---

## Contributing

### Adding New Feature

1. Update `RadioGroupProps` interface
2. Add logic in RadioGroup component
3. Update this documentation (Features, Props, Examples)
4. Add tests for new feature
5. Update translation keys if needed

### Reporting Issues

1. Check [Known Issues](#known-issues) first
2. Create task in project management (get Task #XXX)
3. Add to this documentation under "Known Issues"
4. Include:
   - Severity (Low/Medium/High/Critical)
   - Affected props/layout
   - Workaround (if any)
   - Steps to reproduce

---

## Resources

### Internal Links
- [Radio](Radio.md) - Individual radio button component
- [Checkbox](Checkbox.md) - Multi-selection alternative
- [Select](Select.md) - Dropdown alternative
- [FormField](FormField.md) - Form wrapper component
- [Coding Standards](../programming/coding-standards.md)
- [Design System](../design/component-design-system.md)
- [Testing Guide](../programming/testing-overview.md)

### External References
- [WCAG 2.1 Radio Button Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices - Radio Group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
- [MDN Input Radio](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio)
- [React Controlled Components](https://react.dev/learn/sharing-state-between-components)

---

**Last Updated**: 2025-10-20
**Maintainer**: BOSSystems s.r.o.
**Documentation Version**: 1.0.0
**Component Version**: 1.0.0
