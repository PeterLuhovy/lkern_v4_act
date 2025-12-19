---
id: testing-unit
title: Unit Testing Guide
sidebar_label: Unit Testing
sidebar_position: 2
---

## 📋 Overview

**What is Unit Testing?**

Unit testing tests **individual functions/components in complete isolation**. No DOM (for pure functions), no API calls, no database - just the code unit itself.

**When to Use Unit Tests:**
- ✅ Pure functions (utilities, helpers)
- ✅ Custom React hooks
- ✅ Business logic (validation, calculations)
- ✅ Simple React components (Button, Input)

**When NOT to Use Unit Tests:**
- ❌ Components that fetch data (use integration tests)
- ❌ Complete user flows (use E2E tests)
- ❌ Multi-component interactions (use integration tests)

---

## ⚡ Quick Start

### Frontend (Vitest + React Testing Library)

**Run tests:**
```bash
# All tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# Single file
npm run test Button.test.tsx
```

**Example:**
```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders button text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

---

### Backend (pytest)

**Run tests:**
```bash
# All tests
pytest

# Coverage
pytest --cov=app --cov-report=html

# Single file
pytest tests/test_contact_service.py

# Verbose
pytest -v
```

**Example:**
```python
from app.services.contact_service import format_phone_number

def test_format_phone_number_sk():
    result = format_phone_number("+421900123456", "sk")
    assert result == "+421 900 123 456"
```

---

## 🎯 Frontend Unit Testing

### Setup

**vitest.config.ts:**
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
});
```

**vitest.setup.ts:**
```typescript
import '@testing-library/jest-dom';
```

---

### Testing Pure Functions (Utilities)

**Example: Phone Number Validation**

```typescript
// phoneUtils.ts
export function validateMobile(phone: string, country: 'sk' | 'cz' | 'pl'): boolean {
  const patterns = {
    sk: /^(\+421|00421)?9[0-9]{8}$/,
    cz: /^(\+420|00420)?[67][0-9]{8}$/,
    pl: /^(\+48|0048)?[45678][0-9]{8}$/,
  };

  const cleaned = phone.replace(/[\s\-]/g, '');
  return patterns[country].test(cleaned);
}
```

**phoneUtils.test.ts:**
```typescript
import { describe, it, expect } from 'vitest';
import { validateMobile } from './phoneUtils';

describe('validateMobile', () => {
  describe('Slovak (SK) mobile numbers', () => {
    it('accepts +421 prefix', () => {
      expect(validateMobile('+421900123456', 'sk')).toBe(true);
    });

    it('accepts 00421 prefix', () => {
      expect(validateMobile('00421900123456', 'sk')).toBe(true);
    });

    it('accepts no prefix', () => {
      expect(validateMobile('0900123456', 'sk')).toBe(true);
    });

    it('accepts formatted number with spaces', () => {
      expect(validateMobile('+421 900 123 456', 'sk')).toBe(true);
    });

    it('rejects landline number', () => {
      expect(validateMobile('+421233456789', 'sk')).toBe(false);
    });

    it('rejects too short number', () => {
      expect(validateMobile('+42190012345', 'sk')).toBe(false);
    });

    it('rejects invalid country code', () => {
      expect(validateMobile('+420900123456', 'sk')).toBe(false);
    });
  });

  describe('Czech (CZ) mobile numbers', () => {
    it('accepts +420 prefix with 6XX', () => {
      expect(validateMobile('+420601234567', 'cz')).toBe(true);
    });

    it('accepts +420 prefix with 7XX', () => {
      expect(validateMobile('+420777123456', 'cz')).toBe(true);
    });

    it('rejects landline number', () => {
      expect(validateMobile('+420233456789', 'cz')).toBe(false);
    });
  });
});
```

**Key Points:**
- ✅ Test multiple valid formats (+421, 00421, no prefix)
- ✅ Test edge cases (too short, invalid prefix)
- ✅ Test error cases (landline, wrong country)
- ✅ Use descriptive test names
- ✅ Group related tests with `describe()`

---

### Testing React Components

**Example: Button Component**

```typescript
// Button.tsx
import { useTranslation } from '@l-kern/config';
import styles from './Button.module.css';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  children,
}: ButtonProps) => {
  const { t } = useTranslation();

  return (
    <button
      className={`${styles.button} ${styles[`button--${variant}`]} ${styles[`button--${size}`]}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? t('common.loading') : children}
    </button>
  );
};
```

**Button.test.tsx:**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  // === RENDERING ===
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<Button>Click me</Button>);
    });

    it('renders children correctly', () => {
      render(<Button>Save</Button>);
      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('renders with default variant (primary)', () => {
      render(<Button>Test</Button>);
      expect(screen.getByRole('button')).toHaveClass('button--primary');
    });

    it('renders with default size (medium)', () => {
      render(<Button>Test</Button>);
      expect(screen.getByRole('button')).toHaveClass('button--medium');
    });
  });

  // === PROPS ===
  describe('Props', () => {
    it('applies primary variant class', () => {
      render(<Button variant="primary">Primary</Button>);
      expect(screen.getByRole('button')).toHaveClass('button--primary');
    });

    it('applies secondary variant class', () => {
      render(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole('button')).toHaveClass('button--secondary');
    });

    it('applies danger variant class', () => {
      render(<Button variant="danger">Danger</Button>);
      expect(screen.getByRole('button')).toHaveClass('button--danger');
    });

    it('applies small size class', () => {
      render(<Button size="small">Small</Button>);
      expect(screen.getByRole('button')).toHaveClass('button--small');
    });

    it('applies large size class', () => {
      render(<Button size="large">Large</Button>);
      expect(screen.getByRole('button')).toHaveClass('button--large');
    });
  });

  // === INTERACTIONS ===
  describe('Interactions', () => {
    it('calls onClick when clicked', async () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click me</Button>);

      await userEvent.click(screen.getByRole('button'));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick} disabled>Disabled</Button>);

      await userEvent.click(screen.getByRole('button'));

      expect(onClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when loading', async () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick} loading>Loading</Button>);

      await userEvent.click(screen.getByRole('button'));

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  // === STATE ===
  describe('State', () => {
    it('disables button when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('disables button when loading prop is true', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('shows loading text when loading', () => {
      render(<Button loading>Save</Button>);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('Save')).not.toBeInTheDocument();
    });
  });

  // === ACCESSIBILITY ===
  describe('Accessibility', () => {
    it('has button role', () => {
      render(<Button>Test</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('is keyboard focusable when not disabled', () => {
      render(<Button>Test</Button>);
      const button = screen.getByRole('button');
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it('is not keyboard focusable when disabled', () => {
      render(<Button disabled>Test</Button>);
      const button = screen.getByRole('button');
      button.focus();
      expect(document.activeElement).not.toBe(button);
    });
  });
});
```

**Key Points:**
- ✅ Use `describe()` to group related tests (Rendering, Props, Interactions, State, Accessibility)
- ✅ Test all variants and sizes (comprehensive coverage)
- ✅ Use `vi.fn()` for mock functions (Vitest mocking)
- ✅ Use `userEvent` for realistic interactions (not `fireEvent`)
- ✅ Test accessibility (role, focus, disabled state)

---

### Testing Custom Hooks

**Example: useModalWizard Hook**

```typescript
// useModalWizard.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useModalWizard } from './useModalWizard';

describe('useModalWizard', () => {
  const steps = [
    { id: 'step1', title: 'Step 1' },
    { id: 'step2', title: 'Step 2' },
    { id: 'step3', title: 'Step 3' },
  ];

  it('initializes with first step', () => {
    const { result } = renderHook(() =>
      useModalWizard({ id: 'test-wizard', steps })
    );

    expect(result.current.currentStep).toBe(0);
    expect(result.current.currentStepData).toEqual(steps[0]);
  });

  it('advances to next step', () => {
    const { result } = renderHook(() =>
      useModalWizard({ id: 'test-wizard', steps })
    );

    act(() => {
      result.current.nextStep();
    });

    expect(result.current.currentStep).toBe(1);
    expect(result.current.currentStepData).toEqual(steps[1]);
  });

  it('goes back to previous step', () => {
    const { result } = renderHook(() =>
      useModalWizard({ id: 'test-wizard', steps })
    );

    act(() => {
      result.current.nextStep();
      result.current.nextStep();
    });

    expect(result.current.currentStep).toBe(2);

    act(() => {
      result.current.previousStep();
    });

    expect(result.current.currentStep).toBe(1);
  });

  it('disables Previous button on first step', () => {
    const { result } = renderHook(() =>
      useModalWizard({ id: 'test-wizard', steps })
    );

    expect(result.current.canGoPrevious).toBe(false);
  });

  it('enables Next button when not on last step', () => {
    const { result } = renderHook(() =>
      useModalWizard({ id: 'test-wizard', steps })
    );

    expect(result.current.canGoNext).toBe(true);
  });

  it('disables Next button on last step', () => {
    const { result } = renderHook(() =>
      useModalWizard({ id: 'test-wizard', steps })
    );

    act(() => {
      result.current.goToStep(2);
    });

    expect(result.current.canGoNext).toBe(false);
  });

  it('resets wizard to first step', () => {
    const { result } = renderHook(() =>
      useModalWizard({ id: 'test-wizard', steps })
    );

    act(() => {
      result.current.goToStep(2);
    });

    expect(result.current.currentStep).toBe(2);

    act(() => {
      result.current.reset();
    });

    expect(result.current.currentStep).toBe(0);
  });
});
```

**Key Points:**
- ✅ Use `renderHook()` for testing hooks
- ✅ Use `act()` when calling hook functions that change state
- ✅ Test all hook methods (nextStep, previousStep, reset)
- ✅ Test computed values (canGoNext, canGoPrevious)
- ✅ Test edge cases (first step, last step)

---

## 🎯 Backend Unit Testing

### Testing Business Logic

**Example: Contact Service**

```python
# app/services/contact_service.py
from typing import Optional
import re

def validate_email(email: str) -> bool:
    """Validate email format (RFC 5322 compliant)."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def format_phone_number(phone: str, country: str) -> str:
    """Format phone number with spaces."""
    # Remove existing formatting
    cleaned = re.sub(r'[\s\-]', '', phone)

    if country == 'sk':
        # Format: +421 900 123 456
        if cleaned.startswith('+421'):
            return f"+421 {cleaned[4:7]} {cleaned[7:10]} {cleaned[10:13]}"
        elif cleaned.startswith('0'):
            return f"+421 {cleaned[1:4]} {cleaned[4:7]} {cleaned[7:10]}"

    return cleaned  # Return as-is if can't format

def normalize_contact_name(name: str) -> str:
    """Normalize contact name (title case, trim)."""
    return name.strip().title()
```

**tests/test_contact_service.py:**
```python
import pytest
from app.services.contact_service import (
    validate_email,
    format_phone_number,
    normalize_contact_name
)

class TestValidateEmail:
    """Test email validation."""

    def test_accepts_valid_email(self):
        assert validate_email('john@example.com') is True

    def test_accepts_email_with_plus(self):
        assert validate_email('john+tag@example.com') is True

    def test_accepts_email_with_dots(self):
        assert validate_email('john.doe@example.com') is True

    def test_accepts_email_with_subdomain(self):
        assert validate_email('john@mail.example.com') is True

    def test_rejects_email_without_at(self):
        assert validate_email('johnexample.com') is False

    def test_rejects_email_without_domain(self):
        assert validate_email('john@') is False

    def test_rejects_email_without_tld(self):
        assert validate_email('john@example') is False

    def test_rejects_empty_string(self):
        assert validate_email('') is False


class TestFormatPhoneNumber:
    """Test phone number formatting."""

    def test_formats_sk_mobile_with_prefix(self):
        result = format_phone_number('+421900123456', 'sk')
        assert result == '+421 900 123 456'

    def test_formats_sk_mobile_without_prefix(self):
        result = format_phone_number('0900123456', 'sk')
        assert result == '+421 900 123 456'

    def test_formats_sk_mobile_with_spaces(self):
        result = format_phone_number('+421 900 123 456', 'sk')
        assert result == '+421 900 123 456'

    def test_formats_sk_mobile_with_dashes(self):
        result = format_phone_number('+421-900-123-456', 'sk')
        assert result == '+421 900 123 456'

    def test_returns_unchanged_for_unknown_country(self):
        result = format_phone_number('+1234567890', 'us')
        assert result == '+1234567890'


class TestNormalizeContactName:
    """Test contact name normalization."""

    def test_trims_whitespace(self):
        result = normalize_contact_name('  John Doe  ')
        assert result == 'John Doe'

    def test_converts_to_title_case(self):
        result = normalize_contact_name('john doe')
        assert result == 'John Doe'

    def test_handles_uppercase_input(self):
        result = normalize_contact_name('JOHN DOE')
        assert result == 'John Doe'

    def test_handles_mixed_case(self):
        result = normalize_contact_name('jOhN dOe')
        assert result == 'John Doe'

    def test_handles_single_name(self):
        result = normalize_contact_name('john')
        assert result == 'John'
```

**Key Points:**
- ✅ Use `pytest` class grouping for related tests (`TestValidateEmail`)
- ✅ Test valid inputs (happy path)
- ✅ Test invalid inputs (error cases)
- ✅ Test edge cases (empty string, whitespace)
- ✅ Use descriptive test names (`test_accepts_valid_email`)

---

### Testing Database Models (No DB Access)

**Example: Contact Model Validation**

```python
# app/models/contact.py
from pydantic import BaseModel, EmailStr, validator
from typing import Optional

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None

    @validator('name')
    def name_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty')
        return v.strip()

    @validator('phone')
    def phone_must_be_valid_sk(cls, v):
        if v and not v.startswith('+421'):
            raise ValueError('Phone must start with +421')
        return v
```

**tests/test_contact_model.py:**
```python
import pytest
from pydantic import ValidationError
from app.models.contact import ContactCreate

class TestContactCreate:
    """Test ContactCreate Pydantic model."""

    def test_creates_valid_contact(self):
        contact = ContactCreate(
            name='John Doe',
            email='john@example.com',
            phone='+421900123456'
        )
        assert contact.name == 'John Doe'
        assert contact.email == 'john@example.com'
        assert contact.phone == '+421900123456'

    def test_trims_name_whitespace(self):
        contact = ContactCreate(
            name='  John Doe  ',
            email='john@example.com'
        )
        assert contact.name == 'John Doe'

    def test_rejects_empty_name(self):
        with pytest.raises(ValidationError) as exc_info:
            ContactCreate(name='', email='john@example.com')

        errors = exc_info.value.errors()
        assert any('cannot be empty' in str(err) for err in errors)

    def test_rejects_invalid_email(self):
        with pytest.raises(ValidationError) as exc_info:
            ContactCreate(name='John Doe', email='not-an-email')

        errors = exc_info.value.errors()
        assert errors[0]['loc'] == ('email',)

    def test_rejects_phone_without_sk_prefix(self):
        with pytest.raises(ValidationError) as exc_info:
            ContactCreate(
                name='John Doe',
                email='john@example.com',
                phone='0900123456'
            )

        errors = exc_info.value.errors()
        assert any('+421' in str(err) for err in errors)

    def test_allows_optional_phone(self):
        contact = ContactCreate(name='John Doe', email='john@example.com')
        assert contact.phone is None
```

**Key Points:**
- ✅ Test Pydantic validators (no database needed)
- ✅ Use `pytest.raises()` for expected errors
- ✅ Verify error messages contain expected text
- ✅ Test optional fields (phone can be None)
- ✅ Test automatic transformations (name trimming)

---

## 📊 UI Component Testing Checklist

**For each UI component (Button, Input, Select, etc.), test:**

### ✅ Rendering Tests
- [ ] Component renders without crashing
- [ ] Renders with required props
- [ ] Renders children correctly
- [ ] Renders with all optional props
- [ ] Applies default values when props omitted

### ✅ Props Tests
- [ ] All variant props apply correct CSS classes
- [ ] All size props apply correct CSS classes
- [ ] Boolean props toggle expected behavior
- [ ] String props display correctly

### ✅ Interaction Tests
- [ ] onClick handler called when clicked
- [ ] onChange handler called when value changes
- [ ] onFocus/onBlur handlers called correctly
- [ ] Keyboard interactions work (Enter, Space, Escape)

### ✅ State Tests
- [ ] Disabled state prevents interactions
- [ ] Disabled state applies correct styling
- [ ] Loading state prevents interactions
- [ ] Loading state shows loading indicator
- [ ] Error state displays error message

### ✅ CSS & Styling Tests
- [ ] All CSS classes applied correctly
- [ ] Uses theme CSS variables (not hardcoded colors)
- [ ] Custom className prop merged with default classes
- [ ] fullWidth prop applies correct width

### ✅ Translation Tests (L-KERN Specific)
- [ ] ALL user-facing text uses t() function (NO hardcoded strings)
- [ ] Component text changes when language switches (test with both 'sk' and 'en')
- [ ] Placeholder text uses translations
- [ ] Error messages use translations
- [ ] Helper text uses translations
- [ ] Button labels use translations

### ✅ Accessibility Tests
- [ ] Has correct ARIA role
- [ ] aria-label or aria-labelledby present
- [ ] aria-disabled set when disabled
- [ ] aria-invalid set when error
- [ ] aria-describedby links to error/helper text
- [ ] Keyboard focusable when not disabled

---

## 🎯 Translation Testing (L-KERN Specific)

**CRITICAL RULE:** L-KERN enforces **100% translation coverage**. Every UI component MUST test language switching.

**Two Approaches:**
1. **Mock Translations** (Unit Tests) - Fast, but doesn't catch hardcoded text ⚠️
2. **Real Translations** (Integration Tests) - Slower, but CATCHES hardcoded text ✅ **RECOMMENDED**

---

### ❌ WRONG: Using Mock Translations

**Problem:** Mock allows hardcoded text to pass tests!

```typescript
// ❌ DON'T DO THIS - Mock approach
vi.mock('@l-kern/config', () => ({
  useTranslation: () => ({
    t: (key: string) => key,  // Returns translation key as-is
  }),
}));

describe('Button', () => {
  it('renders button text', () => {
    render(<Button>Save</Button>);
    expect(screen.getByText('Save')).toBeInTheDocument();  // ✅ PASSES
  });
});

// Component code (BAD - hardcoded text)
export const Button = ({ children }) => {
  return <button>Save</button>;  // ❌ HARDCODED - should use t('common.save')
};

// Result: Test PASSES even with hardcoded text! ⚠️
```

**Why This is Bad:**
- ❌ Doesn't verify component uses `t()` function
- ❌ Hardcoded text passes tests
- ❌ Translation keys might not exist in sk.ts/en.ts
- ❌ Language switching not tested

---

### ✅ CORRECT: Using Real Translations with TranslationProvider

**Solution:** Wrap component in TranslationProvider to use REAL translations from sk.ts/en.ts.

**Step 1: Create test-utils.tsx (ONE TIME SETUP)**

```typescript
// packages/ui-components/src/test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { TranslationProvider } from '@l-kern/config';

interface CustomRenderOptions extends RenderOptions {
  initialLanguage?: 'sk' | 'en';
}

/**
 * Render component with TranslationProvider wrapper.
 * Uses REAL translations from sk.ts and en.ts.
 *
 * @param ui - Component to render
 * @param initialLanguage - Starting language (default: 'sk')
 */
export function renderWithTranslation(
  ui: ReactElement,
  { initialLanguage = 'sk', ...renderOptions }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <TranslationProvider initialLanguage={initialLanguage}>
        {children}
      </TranslationProvider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

// Export for use in tests
export { screen, fireEvent, waitFor, within } from '@testing-library/react';
```

**Step 2: Use renderWithTranslation in Tests**

```typescript
// Button.test.tsx
import { describe, it, expect } from 'vitest';
import { renderWithTranslation, screen } from '../test-utils';
import { Button } from './Button';

describe('Button Translation', () => {
  it('displays Slovak text by default', () => {
    // ✅ Uses REAL Slovak translations from sk.ts
    renderWithTranslation(<Button>common.save</Button>);

    expect(screen.getByText('Uložiť')).toBeInTheDocument();  // ✅ Real SK text
  });

  it('switches to English when language changes', () => {
    // Start with Slovak
    const { rerender } = renderWithTranslation(<Button>common.save</Button>);

    // Verify Slovak text
    expect(screen.getByText('Uložiť')).toBeInTheDocument();

    // Change to English (re-render with different language)
    const { rerender: rerenderEN } = renderWithTranslation(
      <Button>common.save</Button>,
      { initialLanguage: 'en' }
    );

    // Verify English text
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.queryByText('Uložiť')).not.toBeInTheDocument();  // SK removed
  });

  it('catches hardcoded text', () => {
    // If Button has hardcoded "Save" instead of t('common.save')
    renderWithTranslation(<Button>Save</Button>);

    // This will FAIL because "Uložiť" won't be found
    expect(screen.getByText('Uložiť')).toBeInTheDocument();  // ❌ FAILS with hardcoded text
  });
});
```

---

### 📋 Translation Testing Checklist

**EVERY component test MUST include:**

```typescript
describe('ComponentName Translation Tests', () => {
  // ✅ TEST 1: Slovak text by default
  it('displays Slovak text by default', () => {
    renderWithTranslation(<Component />);
    expect(screen.getByText('Slovak Text')).toBeInTheDocument();
  });

  // ✅ TEST 2: Language switching to English
  it('switches to English', () => {
    renderWithTranslation(<Component />, { initialLanguage: 'en' });
    expect(screen.getByText('English Text')).toBeInTheDocument();
  });

  // ✅ TEST 3: Translation keys exist
  it('all translation keys exist', () => {
    const { t } = useTranslation();

    // List all keys used in component
    const keys = ['component.title', 'component.button', 'component.message'];

    keys.forEach(key => {
      const translation = t(key);
      expect(translation).not.toBe(key);  // Should NOT return key itself
      expect(translation).toBeTruthy();   // Should have actual text
    });
  });

  // ✅ TEST 4: No hardcoded text (catches violations)
  it('uses translation keys for all text', () => {
    renderWithTranslation(<Component />);

    // If component has hardcoded text, this test will FAIL
    // because translation won't match hardcoded string
  });
});
```

---

### 🔍 Modal Translation Testing Example

**Modals require special handling for ARIA attributes + translations.**

```typescript
// ConfirmModal.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { renderWithTranslation, screen, fireEvent } from '../test-utils';
import { ConfirmModal } from './ConfirmModal';

describe('ConfirmModal Translation', () => {
  const mockOnConfirm = vi.fn();
  const mockOnCancel = vi.fn();

  it('displays Slovak text by default', () => {
    renderWithTranslation(
      <ConfirmModal
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        title="modal.confirm.title"
        message="modal.confirm.message"
      />
    );

    // Check Slovak translations from sk.ts
    expect(screen.getByText('Potvrdiť akciu')).toBeInTheDocument();  // Title
    expect(screen.getByText('Naozaj chcete pokračovať?')).toBeInTheDocument();  // Message
    expect(screen.getByRole('button', { name: 'Potvrdiť' })).toBeInTheDocument();  // Button
  });

  it('switches to English', () => {
    renderWithTranslation(
      <ConfirmModal
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        title="modal.confirm.title"
        message="modal.confirm.message"
      />,
      { initialLanguage: 'en' }
    );

    // Check English translations from en.ts
    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
  });

  it('verifies all translation keys exist', () => {
    const { t } = useTranslation();

    const keys = [
      'modal.confirm.title',
      'modal.confirm.message',
      'modal.confirm.button',
      'modal.cancel.button',
    ];

    // Test Slovak
    keys.forEach(key => {
      const sk = t(key);
      expect(sk).not.toBe(key);
      expect(sk).toBeTruthy();
    });

    // Switch to English
    act(() => {
      const { setLanguage } = useTranslation();
      setLanguage('en');
    });

    // Test English
    keys.forEach(key => {
      const en = t(key);
      expect(en).not.toBe(key);
      expect(en).toBeTruthy();
    });
  });

  it('tests ARIA attributes with translations', () => {
    renderWithTranslation(
      <ConfirmModal
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        title="modal.confirm.title"
        message="modal.confirm.message"
      />
    );

    const dialog = screen.getByRole('dialog');

    // ✅ ARIA attributes
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');

    // ✅ Accessible name uses translation
    const titleId = dialog.getAttribute('aria-labelledby');
    const titleElement = document.getElementById(titleId!);
    expect(titleElement).toHaveTextContent('Potvrdiť akciu');  // Slovak translation
  });
});
```

---

### 🚨 Common Translation Testing Mistakes

**Mistake 1: Using Mocks Instead of Real Translations**

```typescript
// ❌ WRONG
vi.mock('@l-kern/config', () => ({
  useTranslation: () => ({ t: (key) => key })
}));

// ✅ CORRECT
import { renderWithTranslation } from '../test-utils';
```

**Mistake 2: Not Testing Language Switching**

```typescript
// ❌ WRONG - Only tests default language
it('renders text', () => {
  render(<Button>common.save</Button>);
  expect(screen.getByText('Uložiť')).toBeInTheDocument();
});

// ✅ CORRECT - Tests both languages
it('displays Slovak by default', () => {
  renderWithTranslation(<Button>common.save</Button>);
  expect(screen.getByText('Uložiť')).toBeInTheDocument();
});

it('switches to English', () => {
  renderWithTranslation(<Button>common.save</Button>, { initialLanguage: 'en' });
  expect(screen.getByText('Save')).toBeInTheDocument();
});
```

**Mistake 3: Not Validating Translation Keys Exist**

```typescript
// ❌ WRONG - Doesn't verify keys exist in sk.ts/en.ts
it('renders text', () => {
  renderWithTranslation(<Button>common.save</Button>);
  expect(screen.getByText('Uložiť')).toBeInTheDocument();
});

// ✅ CORRECT - Verifies keys exist
it('translation keys exist', () => {
  const { t } = useTranslation();
  expect(t('common.save')).not.toBe('common.save');
  expect(t('common.save')).toBeTruthy();
});
```

---

### 💡 Why Real Translations Matter

**Scenario: Developer Hardcodes Text**

```typescript
// Component code (BAD)
export const Button = () => {
  return <button>Save</button>;  // ❌ HARDCODED
};

// Test with MOCK (FAILS TO CATCH)
vi.mock('@l-kern/config', () => ({ useTranslation: () => ({ t: (k) => k }) }));
it('renders button', () => {
  render(<Button />);
  expect(screen.getByText('Save')).toBeInTheDocument();  // ✅ PASSES (BAD!)
});

// Test with REAL translations (CATCHES ERROR)
it('renders button', () => {
  renderWithTranslation(<Button />);
  expect(screen.getByText('Uložiť')).toBeInTheDocument();  // ❌ FAILS (GOOD!)
  // Error: Unable to find element with text "Uložiť"
  // Found: "Save" (hardcoded text)
});
```

**Result:** Real translations CATCH hardcoded text, mocks DON'T!

---

## 🔧 Common Patterns

### Pattern 1: Testing Async Functions

```typescript
// fetchContacts.ts
export async function fetchContacts(): Promise<Contact[]> {
  const response = await fetch('/api/v1/contacts');
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
}

// fetchContacts.test.ts
import { describe, it, expect, vi } from 'vitest';
import { fetchContacts } from './fetchContacts';

describe('fetchContacts', () => {
  it('fetches contacts successfully', async () => {
    // Mock global fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1, name: 'John' }]),
      } as Response)
    );

    const result = await fetchContacts();

    expect(result).toEqual([{ id: 1, name: 'John' }]);
    expect(fetch).toHaveBeenCalledWith('/api/v1/contacts');
  });

  it('throws error when fetch fails', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      } as Response)
    );

    await expect(fetchContacts()).rejects.toThrow('Failed to fetch');
  });
});
```

---

### Pattern 2: Testing Components with Context

```typescript
// Button with Theme Context
import { useTheme } from '@l-kern/config';

export const Button = ({ children }: ButtonProps) => {
  const { theme } = useTheme();
  return <button className={theme}>{children}</button>;
};

// Button.test.tsx
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@l-kern/config';
import { Button } from './Button';

describe('Button with Theme', () => {
  it('renders with dark theme', () => {
    render(
      <ThemeProvider initialTheme="dark">
        <Button>Test</Button>
      </ThemeProvider>
    );

    expect(screen.getByRole('button')).toHaveClass('dark');
  });

  it('renders with light theme', () => {
    render(
      <ThemeProvider initialTheme="light">
        <Button>Test</Button>
      </ThemeProvider>
    );

    expect(screen.getByRole('button')).toHaveClass('light');
  });
});
```

---

### Pattern 3: Testing with Timers

```typescript
// debounce.ts
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// debounce.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from './debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('delays function execution', () => {
    const func = vi.fn();
    const debounced = debounce(func, 300);

    debounced();
    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('cancels previous call when called again', () => {
    const func = vi.fn();
    const debounced = debounce(func, 300);

    debounced();
    vi.advanceTimersByTime(100);
    debounced();
    vi.advanceTimersByTime(100);
    debounced();

    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(func).toHaveBeenCalledTimes(1);  // Only last call executed
  });
});
```

---

## 📚 Best Practices

### ✅ DO's

1. **Test user behavior, not implementation**
   ```typescript
   // ✅ GOOD - Test what user sees
   expect(screen.getByText('John Doe')).toBeInTheDocument();

   // ❌ BAD - Test internal state
   expect(component.state.name).toBe('John Doe');
   ```

2. **Use descriptive test names**
   ```typescript
   // ✅ GOOD
   it('displays error message when email is invalid');

   // ❌ BAD
   it('test email');
   ```

3. **Arrange-Act-Assert pattern**
   ```typescript
   it('adds two numbers', () => {
     // Arrange
     const a = 5;
     const b = 3;

     // Act
     const result = add(a, b);

     // Assert
     expect(result).toBe(8);
   });
   ```

4. **Test one thing per test**
   ```typescript
   // ✅ GOOD - Separate tests
   it('validates email format');
   it('validates email domain');

   // ❌ BAD - Multiple assertions unrelated
   it('validates email and phone and name');
   ```

5. **Use `userEvent` over `fireEvent`**
   ```typescript
   // ✅ GOOD - Realistic user interaction
   await userEvent.click(button);

   // ❌ BAD - Low-level event
   fireEvent.click(button);
   ```

---

### ❌ DON'Ts

1. **Don't test implementation details**
   ```typescript
   // ❌ BAD - Testing internal hook usage
   expect(component.find('useEffect')).toHaveBeenCalled();

   // ✅ GOOD - Test user-visible outcome
   expect(screen.getByText('Loaded')).toBeInTheDocument();
   ```

2. **Don't share state between tests**
   ```typescript
   // ❌ BAD - Shared state
   let user: User;

   it('test 1', () => {
     user = { name: 'John' };  // Affects next test!
   });

   it('test 2', () => {
     expect(user.name).toBe('John');  // FLAKY!
   });

   // ✅ GOOD - Independent tests
   beforeEach(() => {
     user = { name: 'John' };
   });
   ```

3. **Don't test third-party libraries**
   ```typescript
   // ❌ BAD - Testing React itself
   it('useState updates state', () => {
     const [state, setState] = useState(0);
     setState(1);
     expect(state).toBe(1);
   });

   // ✅ GOOD - Test YOUR code
   it('increments counter when button clicked', async () => {
     render(<Counter />);
     await userEvent.click(screen.getByText('Increment'));
     expect(screen.getByText('Count: 1')).toBeInTheDocument();
   });
   ```

---

## 🔍 Debugging Tests

### View Rendered DOM

```typescript
import { render, screen } from '@testing-library/react';

test('debug example', () => {
  render(<Button>Click me</Button>);

  // Print entire DOM
  screen.debug();

  // Print specific element
  screen.debug(screen.getByRole('button'));
});
```

### Common Query Errors

```typescript
// ❌ Error: Unable to find element
screen.getByText('Loading...');

// ✅ Fix 1: Use async query
await screen.findByText('Loading...');

// ✅ Fix 2: Check if element exists
expect(screen.queryByText('Loading...')).not.toBeInTheDocument();

// ✅ Fix 3: Debug what's actually rendered
screen.debug();
```

---

## 📊 Summary

**Unit Testing Covers:**
- ✅ Pure functions (utilities, helpers)
- ✅ Custom React hooks (useModalWizard, useToast)
- ✅ Simple React components (Button, Input)
- ✅ Business logic (validation, formatting)
- ✅ Pydantic models (ContactCreate validation)

**Unit Testing Does NOT Cover:**
- ❌ API calls (use integration tests)
- ❌ Database queries (use integration tests)
- ❌ Multi-component interactions (use integration tests)
- ❌ Complete user flows (use E2E tests)

**Next Steps:**
1. Read [testing-integration.md](testing-integration.md) for API mocking with MSW
2. Read [testing-e2e.md](testing-e2e.md) for Playwright E2E tests
3. Read [testing-best-practices.md](testing-best-practices.md) for common pitfalls

---

**Last Updated:** 2025-10-19
**Maintainer:** BOSSystems s.r.o.
