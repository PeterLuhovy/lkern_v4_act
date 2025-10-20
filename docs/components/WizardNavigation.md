# ================================================================
# WizardNavigation
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\components\WizardNavigation.md
# Version: 1.0.0
# Created: 2025-10-18
# Updated: 2025-10-20
# Component Location: packages/ui-components/src/components/Modal/WizardNavigation.tsx
# Package: @l-kern/ui-components
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Navigation buttons for multi-step wizard modals.
#   Provides Previous, Next, and Complete buttons with translation support.
# ================================================================

---

## Overview

**Purpose**: Navigation button bar for multi-step wizard flows
**Package**: @l-kern/ui-components
**Path**: packages/ui-components/src/components/Modal/WizardNavigation.tsx
**Since**: v1.0.0

WizardNavigation provides Previous/Next/Complete buttons for multi-step wizard UIs. It automatically switches between "Next" and "Complete" buttons on the last step, supports custom labels, handles loading states, and integrates with useTranslation for internationalization. Designed specifically for wizard modals but can be used in any multi-step flow.

---

## Features

- ✅ **3 Button Types**: Previous (ghost variant), Next (primary), Complete (primary with loading)
- ✅ **Automatic Button Switching**: Shows "Next" OR "Complete" based on isLastStep prop
- ✅ **Conditional Rendering**: Previous/Next buttons only render when handlers provided
- ✅ **State Management**: canGoPrevious, canGoNext control disabled states
- ✅ **Loading State**: Complete button shows loading spinner when isSubmitting=true
- ✅ **Custom Labels**: Override default labels for all three buttons
- ✅ **Translation Support**: Uses useTranslation for default labels (SK/EN)
- ✅ **Visual Layout**: Flexbox with spacer (Previous left, Next/Complete right)
- ✅ **Top Border**: Visual separator from wizard content (24px margin)
- ✅ **Dark Mode**: Border color adapts to theme
- ✅ **Accessibility**: data-testid attributes for testing

---

## Quick Start

### Basic Usage

```tsx
import { WizardNavigation } from '@l-kern/ui-components';
import { useState } from 'react';

function SimpleWizard() {
  const [step, setStep] = useState(0);
  const totalSteps = 3;

  return (
    <div>
      <div>Step {step + 1} content</div>

      <WizardNavigation
        onPrevious={step > 0 ? () => setStep(step - 1) : undefined}
        onNext={step < totalSteps - 1 ? () => setStep(step + 1) : undefined}
        onComplete={step === totalSteps - 1 ? () => console.log('Complete!') : undefined}
        canGoPrevious={step > 0}
        canGoNext={true}
        isLastStep={step === totalSteps - 1}
      />
    </div>
  );
}
```

### Common Patterns

#### Pattern 1: With Form Validation
```tsx
import { WizardNavigation } from '@l-kern/ui-components';
import { useState } from 'react';

function WizardWithValidation() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '' });

  // Validation: Check if current step is valid
  const isStepValid = () => {
    if (step === 0) return formData.name.length > 0;
    if (step === 1) return formData.email.includes('@');
    return true;
  };

  return (
    <div>
      {step === 0 && <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />}
      {step === 1 && <input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />}

      <WizardNavigation
        onPrevious={step > 0 ? () => setStep(step - 1) : undefined}
        onNext={step < 1 ? () => setStep(step + 1) : undefined}
        onComplete={step === 1 ? () => submitForm(formData) : undefined}
        canGoPrevious={step > 0}
        canGoNext={isStepValid()}  {/* Disable Next if invalid */}
        isLastStep={step === 1}
      />
    </div>
  );
}
```

#### Pattern 2: With Async Submission
```tsx
import { WizardNavigation } from '@l-kern/ui-components';
import { useState } from 'react';

function WizardWithAsyncSubmit() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await submitToAPI(formData);
      alert('Success!');
    } catch (error) {
      alert('Error!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div>Step {step + 1}</div>

      <WizardNavigation
        onPrevious={() => setStep(step - 1)}
        onNext={() => setStep(step + 1)}
        onComplete={handleComplete}
        canGoPrevious={step > 0}
        canGoNext={!isSubmitting}
        isLastStep={step === 2}
        isSubmitting={isSubmitting}  {/* Shows loading spinner */}
      />
    </div>
  );
}
```

#### Pattern 3: Custom Labels
```tsx
import { WizardNavigation } from '@l-kern/ui-components';

function CustomLabelWizard() {
  return (
    <WizardNavigation
      onPrevious={handlePrevious}
      onNext={handleNext}
      onComplete={handleComplete}
      canGoPrevious={true}
      canGoNext={true}
      isLastStep={false}
      previousLabel="← Back to Step 1"
      nextLabel="Continue to Payment →"
      completeLabel="Finish Registration"
    />
  );
}
```

---

## Props API

### WizardNavigationProps

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `onPrevious` | `() => void` | `undefined` | No | Handler for Previous button (if undefined, button not rendered) |
| `onNext` | `() => void` | `undefined` | No | Handler for Next button (if undefined, button not rendered) |
| `onComplete` | `() => void` | `undefined` | No | Handler for Complete button (if undefined, button not rendered on last step) |
| `canGoPrevious` | `boolean` | `false` | No | Enable/disable Previous button |
| `canGoNext` | `boolean` | `true` | No | Enable/disable Next/Complete button |
| `isLastStep` | `boolean` | `false` | No | If true, shows Complete button instead of Next |
| `isSubmitting` | `boolean` | `false` | No | Shows loading spinner on Complete button, disables all buttons |
| `previousLabel` | `string` | `t('wizard.previous')` | No | Custom label for Previous button |
| `nextLabel` | `string` | `t('wizard.next')` | No | Custom label for Next button |
| `completeLabel` | `string` | `t('wizard.complete')` | No | Custom label for Complete button |

### Type Definitions

```typescript
export interface WizardNavigationProps {
  onPrevious?: () => void;
  onNext?: () => void;
  onComplete?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  isLastStep?: boolean;
  isSubmitting?: boolean;
  previousLabel?: string;
  nextLabel?: string;
  completeLabel?: string;
}
```

---

## Visual Design

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│              WizardNavigation Bar                       │
│  ┌─────────────┐             ┌──────────────────────┐  │
│  │  ← Previous │   [spacer]  │ Next → / Complete    │  │
│  └─────────────┘             └──────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Dimensions
- **Padding-top**: 24px (--spacing-xl)
- **Margin-top**: 24px (--spacing-xl)
- **Gap**: 12px between buttons
- **Border**: 1px solid at top
- **Button height**: Inherited from Button component (40px default)

### Colors

**Light Mode:**
- Border: `#e0e0e0` (--theme-border)

**Dark Mode:**
- Border: `#333333` (--theme-border)

### Button Styles

**Previous Button:**
- Variant: `ghost` (transparent, subtle hover)
- Position: Left-aligned

**Next Button:**
- Variant: `primary` (purple gradient)
- Position: Right-aligned

**Complete Button:**
- Variant: `primary` (purple gradient)
- Loading: Shows spinner when isSubmitting=true
- Position: Right-aligned (replaces Next on last step)

---

## Behavior

### Button Rendering Logic

```tsx
// Previous button: Only renders if onPrevious provided
{onPrevious && <Button onClick={onPrevious}>Previous</Button>}

// Next OR Complete button (mutually exclusive)
{isLastStep ? (
  onComplete && <Button onClick={onComplete}>Complete</Button>
) : (
  onNext && <Button onClick={onNext}>Next</Button>
)}
```

### Disabled States

**Previous Button Disabled When:**
- `canGoPrevious === false`
- `isSubmitting === true`

**Next Button Disabled When:**
- `canGoNext === false`
- `isSubmitting === true`

**Complete Button Disabled When:**
- `canGoNext === false`
- `isSubmitting === true`

### Loading State

```tsx
// Complete button with loading
<Button
  variant="primary"
  onClick={onComplete}
  disabled={!canGoNext || isSubmitting}
  loading={isSubmitting}  // Shows spinner
>
  {completeLabel}
</Button>
```

---

## Translation Keys

### Default Labels (useTranslation)

| Key | SK Value | EN Value |
|-----|----------|----------|
| `wizard.previous` | `← Späť` | `← Back` |
| `wizard.next` | `Ďalej →` | `Next →` |
| `wizard.complete` | `Uložiť` | `Save` |

### Fallback Labels

If translation keys are missing:

```tsx
const prevLabel = previousLabel || t('wizard.previous') || '← Späť';
const nextLabelText = nextLabel || t('wizard.next') || 'Ďalej →';
const completeLabelText = completeLabel || t('wizard.complete') || 'Uložiť';
```

---

## Accessibility

### WCAG Compliance
- ✅ **WCAG 2.1 Level AA** compliant
- ✅ Keyboard navigable (Tab, Enter, Space)
- ✅ Focus visible (Button component handles focus ring)
- ✅ Disabled state clear (opacity + cursor)
- ✅ Loading state accessible (Button component handles aria-busy)

### Semantic HTML

```tsx
<div className="wizardNavigation">
  <Button data-testid="wizard-previous-button">Previous</Button>
  <div className="spacer" />  {/* Flexbox spacer */}
  <Button data-testid="wizard-next-button">Next</Button>
</div>
```

### Screen Reader Behavior

**Previous Button:**
- "Button, Previous, enabled/disabled"

**Next Button:**
- "Button, Next, enabled/disabled"

**Complete Button (loading):**
- "Button, Save, busy" (aria-busy="true" from Button component)

---

## Responsive Design

### Breakpoints

WizardNavigation has NO responsive CSS—it uses flexbox that adapts naturally.

**Mobile** (< 768px)
- Previous/Next buttons stack if container is narrow
- Spacer shrinks naturally

**Tablet/Desktop** (≥ 768px)
- Previous left, Next/Complete right (flexbox)

### Layout Behavior

```tsx
// Flexbox automatically handles responsive layout
.wizardNavigation {
  display: flex;
  align-items: center;
  gap: 12px;
}

.spacer {
  flex: 1; // Takes all remaining space
}
```

---

## Styling

### CSS Variables Used

```css
/* Spacing */
--spacing-xl: 24px;          /* Padding-top, margin-top */

/* Colors */
--theme-border: #e0e0e0;     /* Border color (light mode) */

/* Dark mode */
[data-theme='dark'] --theme-border: #333333;
```

### Custom Styling

**Via CSS Module:**
```css
/* Override border color */
.wizardNavigation {
  border-color: var(--color-brand-primary);
}

/* Increase padding */
.wizardNavigation {
  padding-top: 32px;
  margin-top: 32px;
}
```

**Via Inline Style:**
```tsx
<div style={{ borderColor: 'red' }}>
  <WizardNavigation {...props} />
</div>
```

---

## Known Issues

### Active Issues

**No known issues** ✅

---

## Testing

### Test Coverage
- ✅ **Unit Tests**: 36 tests
- ✅ **Coverage**: 100% (statements, branches, functions, lines)
- ✅ **Rendering Tests**: 12 tests (button visibility, variants)
- ✅ **Interaction Tests**: 9 tests (click handlers)
- ✅ **State Tests**: 9 tests (disabled, loading)
- ✅ **Label Tests**: 6 tests (custom labels)

### Test File
`packages/ui-components/src/components/WizardNavigation/WizardNavigation.test.tsx`

### Running Tests
```bash
# Run component tests
docker exec lkms201-web-ui npx nx test ui-components --testFile=WizardNavigation.test.tsx

# Run with coverage
docker exec lkms201-web-ui npx nx test ui-components --coverage --testFile=WizardNavigation.test.tsx

# Watch mode
docker exec lkms201-web-ui npx nx test ui-components --watch --testFile=WizardNavigation.test.tsx
```

### Key Test Cases

**Button Rendering:**
- ✅ Renders Previous and Next when provided
- ✅ Renders Complete button on last step
- ✅ Does NOT render Previous when onPrevious not provided
- ✅ Does NOT render Next when onNext not provided

**Button Interactions:**
- ✅ Calls onPrevious when Previous clicked
- ✅ Calls onNext when Next clicked
- ✅ Calls onComplete when Complete clicked

**Button States:**
- ✅ Disables Previous when canGoPrevious=false
- ✅ Disables Next when canGoNext=false
- ✅ Disables Complete when canGoNext=false
- ✅ Disables all buttons when isSubmitting=true
- ✅ Shows loading on Complete when isSubmitting=true

**Custom Labels:**
- ✅ Uses custom previousLabel when provided
- ✅ Uses custom nextLabel when provided
- ✅ Uses custom completeLabel when provided

**Wizard Scenarios:**
- ✅ First step: No Previous, has Next
- ✅ Middle step: Has Previous, has Next
- ✅ Last step: Has Previous, has Complete (no Next)

---

## Related Components

- **[WizardProgress](WizardProgress.md)** - Progress indicator for wizards
- **[Modal](Modal.md)** - Often used as wizard container
- **[Button](Button.md)** - Base button component used internally

---

## Usage Examples

### Example 1: 3-Step Registration Wizard
```tsx
import { WizardNavigation } from '@l-kern/ui-components';
import { useState } from 'react';

function RegistrationWizard() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const steps = [
    { title: 'Basic Info', fields: ['name'] },
    { title: 'Account', fields: ['email', 'password'] },
    { title: 'Confirmation', fields: [] }
  ];

  const isStepValid = () => {
    const currentFields = steps[step].fields;
    return currentFields.every(field => formData[field].length > 0);
  };

  const handleComplete = () => {
    console.log('Submit:', formData);
  };

  return (
    <div>
      <h2>{steps[step].title}</h2>

      {step === 0 && <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />}
      {step === 1 && (
        <>
          <input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
        </>
      )}
      {step === 2 && <div>Review: {formData.name}, {formData.email}</div>}

      <WizardNavigation
        onPrevious={step > 0 ? () => setStep(step - 1) : undefined}
        onNext={step < 2 ? () => setStep(step + 1) : undefined}
        onComplete={step === 2 ? handleComplete : undefined}
        canGoPrevious={step > 0}
        canGoNext={isStepValid()}
        isLastStep={step === 2}
      />
    </div>
  );
}
```

### Example 2: Wizard with Async API Submission
```tsx
import { WizardNavigation } from '@l-kern/ui-components';
import { useState } from 'react';

function ContactFormWizard() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contact, setContact] = useState({ name: '', company: '', note: '' });

  const handleComplete = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
      });

      if (response.ok) {
        alert('Contact saved!');
      } else {
        alert('Error saving contact');
      }
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {step === 0 && <input value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })} />}
      {step === 1 && <input value={contact.company} onChange={e => setContact({ ...contact, company: e.target.value })} />}
      {step === 2 && <textarea value={contact.note} onChange={e => setContact({ ...contact, note: e.target.value })} />}

      <WizardNavigation
        onPrevious={() => setStep(step - 1)}
        onNext={() => setStep(step + 1)}
        onComplete={handleComplete}
        canGoPrevious={step > 0}
        canGoNext={!isSubmitting}
        isLastStep={step === 2}
        isSubmitting={isSubmitting}  {/* Shows loading spinner */}
      />
    </div>
  );
}
```

### Example 3: Wizard with Custom Labels
```tsx
import { WizardNavigation } from '@l-kern/ui-components';

function CustomLabelsWizard() {
  const [step, setStep] = useState(0);

  return (
    <div>
      <div>Step {step + 1} content</div>

      <WizardNavigation
        onPrevious={step > 0 ? () => setStep(step - 1) : undefined}
        onNext={step < 2 ? () => setStep(step + 1) : undefined}
        onComplete={step === 2 ? () => console.log('Done!') : undefined}
        canGoPrevious={step > 0}
        canGoNext={true}
        isLastStep={step === 2}
        previousLabel="← Back to Previous Step"
        nextLabel="Continue to Next Step →"
        completeLabel="Finish and Save"
      />
    </div>
  );
}
```

---

## Performance

### Bundle Size
- **JS**: ~1.5 KB (gzipped) - includes Button imports
- **CSS**: ~0.3 KB (gzipped)
- **Total**: ~1.8 KB

### Runtime Performance
- **Render time**: < 3ms (average)
- **Re-renders**: Minimal (only when props change)
- **Memory**: ~1 KB per instance

### Optimization Tips
- ✅ Memoize handlers to prevent re-renders
- ✅ Use conditional rendering for Previous/Next buttons
- ✅ Avoid passing inline functions as handlers

```tsx
// Optimized with useCallback
import { useCallback } from 'react';

function OptimizedWizard() {
  const [step, setStep] = useState(0);

  const handlePrevious = useCallback(() => {
    setStep(s => s - 1);
  }, []);

  const handleNext = useCallback(() => {
    setStep(s => s + 1);
  }, []);

  return (
    <WizardNavigation
      onPrevious={handlePrevious}
      onNext={handleNext}
      // ... other props
    />
  );
}
```

---

## Changelog

### v1.0.0 (2025-10-18)
- 🎉 Initial release
- ✅ Previous/Next/Complete buttons
- ✅ Automatic button switching (Next ↔ Complete)
- ✅ Loading state support
- ✅ Custom labels
- ✅ Translation integration
- ✅ 36 unit tests (100% coverage)

---

## Contributing

### Adding New Button Type

1. Add new handler prop (e.g., `onSkip`)
2. Add new button in render logic
3. Update tests
4. Update documentation

Example:
```tsx
// 1. Add prop
onSkip?: () => void;

// 2. Render button
{onSkip && <Button onClick={onSkip}>Skip</Button>}

// 3. Test
it('should call onSkip when Skip clicked', () => {
  // Test implementation
});
```

### Reporting Issues

1. Check [Known Issues](#known-issues) first
2. Create task in project management
3. Add issue to this documentation
4. Link task number

---

## Resources

### Internal Links
- [WizardProgress Component](WizardProgress.md)
- [Button Component](Button.md)
- [Modal Component](Modal.md)
- [Coding Standards](../programming/coding-standards.md)

### External References
- [React State Management](https://react.dev/learn/managing-state)
- [Wizard UI Pattern](https://www.nngroup.com/articles/wizards/)
- [WCAG Form Guidelines](https://www.w3.org/WAI/WCAG21/quickref/?tags=forms)

---

**Last Updated**: 2025-10-20
**Maintainer**: BOSSystems s.r.o.
**Documentation Version**: 1.0.0
