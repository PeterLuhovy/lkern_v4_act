# ================================================================
# UI Components Reference
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\packages\components-reference.md
# Version: 1.0.0
# Created: 2025-10-18
# Updated: 2025-10-18
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Complete reference for all UI components in @l-kern/ui-components
#   Includes descriptions, use cases, props, and examples.
# ================================================================

---

## 📋 Overview

This document provides a complete reference for all UI components available in `@l-kern/ui-components` package. All components are fully typed, tested, and support dark mode.

**Package:** `@l-kern/ui-components`
**Total Components:** 10
**Test Coverage:** 100%
**Dark Mode:** ✅ Supported

---

## 🎯 Component Categories

### Phase 1: Form Components (6 components)
Basic form inputs and controls for data entry.

### Phase 2: Layout & Display (4 components)
Components for structuring content and displaying information.

---

## 📦 Phase 1: Form Components

### 1. Button

**Purpose:** Primary action trigger for user interactions.

**Why it exists:** Every application needs buttons for actions like save, cancel, submit, delete. This component provides consistent styling and behavior across all button types.

**Use cases:**
- Form submissions (save, submit)
- Navigation (back, next)
- Actions (delete, edit, download)
- Modal confirmations (confirm, cancel)

**Variants:**
- `primary` - Main call-to-action (purple gradient)
- `secondary` - Secondary actions (gray gradient)
- `danger` - Destructive actions (red gradient)
- `ghost` - Subtle actions (transparent)
- `success` - Success confirmations (green gradient)

**Props:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
}
```

**Example:**
```tsx
<Button variant="primary" size="md" loading={isSaving}>
  {t('common.save')}
</Button>
```

**Tests:** 16 tests, 100% coverage

---

### 2. Input

**Purpose:** Single-line text input for user data entry.

**Why it exists:** Text inputs are the foundation of every form. This component handles all text-based input types (text, email, password, number) with consistent validation and error handling.

**Use cases:**
- User registration (username, email, password)
- Search fields
- Contact forms (name, phone, email)
- Numeric inputs (quantity, price)

**Features:**
- Error state with message
- Helper text
- Full width option
- All HTML input types
- Controlled/uncontrolled modes

**Props:**
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  fullWidth?: boolean;
}
```

**Example:**
```tsx
<Input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder={t('forms.placeholders.email')}
  error={!validateEmail(email)}
  errorMessage={t('forms.errors.invalidEmail')}
  fullWidth
/>
```

**Tests:** 15 tests, 100% coverage

---

### 3. FormField

**Purpose:** Wrapper component for form inputs with label, required indicator, and error display.

**Why it exists:** Reduces code duplication by providing consistent label/error layout for all form fields. Follows accessibility best practices for form field associations.

**Use cases:**
- Wrapping Input components with labels
- Displaying required field indicators
- Showing validation errors
- Helper text for guidance

**Props:**
```typescript
interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  htmlFor?: string;
  children: React.ReactNode;
}
```

**Example:**
```tsx
<FormField
  label={t('forms.email')}
  required
  error={emailError}
  errorMessage={t('forms.errors.invalidEmail')}
  helperText={t('forms.helperTexts.emailPrivacy')}
>
  <Input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    fullWidth
  />
</FormField>
```

**Tests:** 11 tests, 100% coverage

---

### 4. Select

**Purpose:** Dropdown selection from a list of options.

**Why it exists:** Native select element with consistent styling and simplified API using options array instead of manual `<option>` tags.

**Use cases:**
- Country selection
- Category selection
- Status filters
- Any single-choice selection

**Props:**
```typescript
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  fullWidth?: boolean;
}
```

**Example:**
```tsx
<Select
  options={[
    { value: 'SK', label: '🇸🇰 Slovakia' },
    { value: 'CZ', label: '🇨🇿 Czech Republic' },
    { value: 'PL', label: '🇵🇱 Poland' },
  ]}
  value={country}
  onChange={(e) => setCountry(e.target.value)}
  placeholder={t('forms.placeholders.country')}
  fullWidth
/>
```

**Tests:** 21 tests, 100% coverage

---

### 5. Checkbox

**Purpose:** Boolean selection (on/off, yes/no, agree/disagree).

**Why it exists:** For accepting terms, toggling settings, multi-selection lists. Supports indeterminate state for "select all" functionality.

**Use cases:**
- Terms & conditions acceptance
- Newsletter subscription
- Feature toggles
- Multi-item selection
- "Select all" functionality

**Features:**
- Indeterminate state (for "select all")
- Error state
- Helper text
- Modern gradient design

**Props:**
```typescript
interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  label?: string;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
}
```

**Example:**
```tsx
<Checkbox
  checked={agreedToTerms}
  onChange={(e) => setAgreedToTerms(e.target.checked)}
  label={t('forms.checkboxes.agreeTerms')}
  error={!agreedToTerms && submitted}
  errorMessage={t('forms.checkboxes.requiredError')}
/>
```

**Tests:** 19 tests, 100% coverage

---

### 6. Radio / RadioGroup

**Purpose:** Single selection from multiple options (mutually exclusive).

**Why it exists:** When user must choose exactly one option from a set (payment method, plan selection, gender, etc.). RadioGroup manages the selection state.

**Use cases:**
- Plan selection (Free, Pro, Enterprise)
- Payment method selection
- Gender selection
- Yes/No questions
- Any mutually exclusive choice

**Props:**
```typescript
interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
  helperText?: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  direction?: 'vertical' | 'horizontal';
  error?: boolean;
  errorMessage?: string;
}
```

**Example:**
```tsx
<RadioGroup
  name="plan"
  options={[
    { value: 'free', label: t('forms.plans.free') },
    { value: 'pro', label: t('forms.plans.pro') },
    { value: 'enterprise', label: t('forms.plans.enterprise') },
  ]}
  value={selectedPlan}
  onChange={(value) => setSelectedPlan(value)}
  direction="vertical"
/>
```

**Tests:** 33 tests, 100% coverage

---

## 📦 Phase 2: Layout & Display Components

### 7. Card

**Purpose:** Container for grouping related content with visual elevation.

**Why it exists:** Cards are fundamental building blocks for modern UIs. They provide visual separation and hierarchy for different content sections.

**Use cases:**
- Dashboard widgets
- Product listings
- User profiles
- Settings panels
- Content sections

**Variants:**
- `default` - Standard card with subtle shadow
- `outlined` - Card with border instead of shadow
- `elevated` - Card with prominent shadow

**Props:**
```typescript
interface CardProps {
  variant?: 'default' | 'outlined' | 'elevated';
  children: React.ReactNode;
  onClick?: () => void;
  disableHover?: boolean;
  className?: string;
}
```

**Example:**
```tsx
<Card variant="elevated">
  <h2>{t('dashboard.stats.title')}</h2>
  <p>Total Orders: 1,234</p>
</Card>
```

**Tests:** 18 tests, 100% coverage

---

### 8. Badge

**Purpose:** Small status indicator or label for highlighting information.

**Why it exists:** Badges draw attention to important information like statuses, counts, notifications, or categories.

**Use cases:**
- Order status (pending, shipped, delivered)
- Notification counts (3 new messages)
- User roles (Admin, User, Guest)
- Feature tags (New, Beta, Premium)
- Validation results (Valid, Invalid)

**Variants:**
- `default` - Neutral gray
- `primary` - Brand purple
- `success` - Green
- `warning` - Orange
- `error` - Red
- `info` - Blue
- `neutral` - Light gray

**Props:**
```typescript
interface BadgeProps {
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}
```

**Example:**
```tsx
<Badge variant="success">
  {t('orders.status.delivered')}
</Badge>
```

**Tests:** 19 tests, 100% coverage

---

### 9. Spinner

**Purpose:** Loading indicator for asynchronous operations.

**Why it exists:** Provides visual feedback during data loading, API calls, or long-running operations. Prevents user confusion during waiting periods.

**Use cases:**
- Page loading
- Form submission
- Data fetching
- File uploads
- Background processing

**Sizes:**
- `sm` - 16px (inline loading)
- `md` - 24px (button loading)
- `lg` - 48px (page loading)
- `xl` - 64px (full-page loading)

**Props:**
```typescript
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
}
```

**Example:**
```tsx
<Button loading={isSubmitting}>
  {t('common.save')}
</Button>

{/* Or standalone */}
<Spinner size="lg" />
```

**Tests:** 14 tests, 100% coverage

---

### 10. EmptyState

**Purpose:** Placeholder when no data is available or search returns no results.

**Why it exists:** Empty states guide users when content is missing, improving UX by explaining why nothing is displayed and suggesting next steps.

**Use cases:**
- Empty search results
- No data in tables
- Empty inbox
- New user onboarding
- Deleted all items

**Props:**
```typescript
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}
```

**Example:**
```tsx
<EmptyState
  icon={<SearchIcon />}
  title={t('components.emptyStates.noResults')}
  description={t('components.emptyStates.noResultsDescription')}
  action={
    <Button variant="primary" onClick={clearFilters}>
      {t('common.clearFilters')}
    </Button>
  }
/>
```

**Tests:** 16 tests, 100% coverage

---

## 📊 Component Statistics

| Category | Components | Total Tests | Coverage |
|----------|-----------|-------------|----------|
| **Form Components** | 6 | 115 | 100% |
| **Layout & Display** | 4 | 67 | 100% |
| **TOTAL** | **10** | **182** | **100%** |

---

## 🎨 Design System Integration

All components use:
- ✅ CSS custom properties from `@l-kern/config` design tokens
- ✅ Theme variables (`--theme-*`) for colors
- ✅ Spacing constants (`--spacing-*`)
- ✅ Translation system via `useTranslation` hook
- ✅ Dark mode support
- ✅ Accessibility (ARIA labels, keyboard navigation)

---

## 📚 Usage Guidelines

### Import Components
```typescript
import { Button, Input, Card, Badge } from '@l-kern/ui-components';
```

### Combining Components
```tsx
<Card variant="elevated">
  <FormField label={t('forms.username')} required>
    <Input
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      fullWidth
    />
  </FormField>

  <Button variant="primary" fullWidth>
    {t('common.submit')}
  </Button>
</Card>
```

### Error Handling
```tsx
<FormField
  label={t('forms.email')}
  error={!validateEmail(email)}
  errorMessage={t('forms.errors.invalidEmail')}
>
  <Input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    error={!validateEmail(email)}
    fullWidth
  />
</FormField>
```

---

## 🔗 Related Documentation

- [Package Documentation](./ui-components.md) - Setup and installation
- [Design System](../design/component-design-system.md) - Visual design language
- [Coding Standards](../programming/coding-standards.md) - Component guidelines
- [Code Examples](../programming/code-examples.md) - Practical examples

---

**Last Updated:** 2025-10-18
**Maintainer:** BOSSystems s.r.o.
