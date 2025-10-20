# ================================================================
# useModalWizard
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\hooks\useModalWizard.md
# Version: 1.0.0
# Created: 2025-10-20
# Updated: 2025-10-20
# Hook Location: packages/config/src/hooks/useModalWizard/useModalWizard.ts
# Package: @l-kern/config
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   React hook for managing multi-step wizard workflows with data
#   accumulation, step validation, progress tracking, and modal
#   integration for complex forms and onboarding flows.
# ================================================================

---

## Overview

**Purpose**: Simplify multi-step wizard workflows with automatic data accumulation, step validation, and progress tracking
**Package**: @l-kern/config
**Path**: packages/config/src/hooks/useModalWizard
**Since**: v1.0.0

`useModalWizard` provides a complete solution for managing complex multi-step workflows (wizards) within modals. It handles navigation (next/previous/jump), data accumulation across steps, per-step validation, progress calculation, and submission state tracking. Perfect for onboarding flows, contact creation, configuration wizards, and any sequential form process.

---

## Features

- ✅ Multi-step navigation (next, previous, jump to step)
- ✅ Automatic data accumulation across steps (merge strategy)
- ✅ Per-step validation with custom validation functions
- ✅ Progress tracking (percentage, current step, total steps)
- ✅ Modal integration (open/close state management)
- ✅ Submission state tracking (prevents double-submit)
- ✅ Optional data persistence across wizard sessions
- ✅ Callback hooks: `onComplete`, `onCancel`
- ✅ Step status flags: `isFirstStep`, `isLastStep`, `canGoNext`, `canGoPrevious`
- ✅ TypeScript fully typed with generics
- ✅ Zero external dependencies (pure React hooks)

---

## Quick Start

### Basic Usage

```tsx
import { useModalWizard } from '@l-kern/config';
import { Modal, Button } from '@l-kern/ui-components';

function AddContactWizard() {
  const wizard = useModalWizard({
    id: 'add-contact',
    steps: [
      { id: 'type', title: 'Contact Type' },
      { id: 'basic', title: 'Basic Info' },
      { id: 'contact', title: 'Contact Details' },
    ],
    onComplete: (data) => {
      console.log('Wizard completed:', data);
      // Save to API
    },
  });

  return (
    <>
      <Button onClick={wizard.start}>Add Contact</Button>

      <Modal isOpen={wizard.isOpen} onClose={wizard.cancel}>
        <h2>{wizard.currentStepTitle}</h2>
        <p>Step {wizard.currentStep + 1} of {wizard.totalSteps}</p>

        {wizard.currentStepId === 'type' && <TypeStep />}
        {wizard.currentStepId === 'basic' && <BasicStep />}
        {wizard.currentStepId === 'contact' && <ContactStep />}

        <div>
          <Button onClick={wizard.previous} disabled={!wizard.canGoPrevious}>
            Back
          </Button>
          {wizard.isLastStep ? (
            <Button onClick={() => wizard.complete()}>
              Finish
            </Button>
          ) : (
            <Button onClick={() => wizard.next()}>
              Next
            </Button>
          )}
        </div>
      </Modal>
    </>
  );
}
```

### Common Patterns

#### Pattern 1: Data Accumulation with Validation

```tsx
const wizard = useModalWizard({
  id: 'contact-wizard',
  steps: [
    {
      id: 'name',
      title: 'Name',
      validate: (data) => data.name?.length > 0,
    },
    {
      id: 'email',
      title: 'Email',
      validate: (data) => /\S+@\S+\.\S+/.test(data.email),
    },
  ],
  onComplete: async (data) => {
    await saveContact(data);
  },
});

// In steps, pass data when navigating
<Button onClick={() => wizard.next({ name: formData.name })}>
  Next
</Button>
```

#### Pattern 2: Progress Bar Integration

```tsx
function WizardProgress({ wizard }) {
  return (
    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{ width: `${wizard.progress}%` }}
      />
      <p>{Math.round(wizard.progress)}% Complete</p>
    </div>
  );
}
```

---

## API Reference

### Function Signature

```typescript
function useModalWizard(options: UseModalWizardOptions): UseModalWizardReturn
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `options` | `UseModalWizardOptions` | Yes | Configuration options (see below) |

### Options

```typescript
interface UseModalWizardOptions {
  /**
   * Unique identifier for the wizard instance
   */
  id: string;

  /**
   * Array of wizard steps
   */
  steps: WizardStep[];

  /**
   * Initial step index (default: 0)
   */
  initialStep?: number;

  /**
   * Callback executed when wizard completes
   */
  onComplete?: (data: Record<string, any>) => void | Promise<void>;

  /**
   * Callback executed when wizard is cancelled
   */
  onCancel?: () => void;

  /**
   * Whether to persist data across instances
   * @default false
   */
  persistData?: boolean;
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `id` | `string` | - | Unique identifier for wizard instance (used for analytics, debugging) |
| `steps` | `WizardStep[]` | - | Array of step definitions (see WizardStep type below) |
| `initialStep` | `number` | `0` | Starting step index (0-based); use for resuming wizard |
| `onComplete` | `(data: Record<string, any>) => void \| Promise<void>` | `undefined` | Callback executed when wizard completes; receives accumulated data |
| `onCancel` | `() => void` | `undefined` | Callback executed when wizard is cancelled |
| `persistData` | `boolean` | `false` | If `true`, data persists after cancel/close (useful for draft saving) |

### WizardStep Type

```typescript
interface WizardStep {
  /**
   * Unique identifier for the step
   */
  id: string;

  /**
   * Display title for the step
   */
  title: string;

  /**
   * Optional validation function
   * Returns true if step data is valid
   */
  validate?: (data: any) => boolean;

  /**
   * Optional custom component for the step
   */
  component?: React.ComponentType<any>;
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string` | Yes | Unique step identifier (e.g., 'type', 'basic', 'contact') |
| `title` | `string` | Yes | Display title for step (e.g., 'Contact Type', 'Basic Info') |
| `validate` | `(data: any) => boolean` | No | Validation function; return `false` to prevent navigation |
| `component` | `React.ComponentType<any>` | No | Optional custom step component (alternative to conditional rendering) |

### Return Value

```typescript
interface UseModalWizardReturn {
  // === STATE ===
  isOpen: boolean;
  currentStep: number;
  totalSteps: number;
  currentStepId: string;
  data: Record<string, any>;
  isSubmitting: boolean;

  // === NAVIGATION ===
  start: () => void;
  next: (stepData?: any) => void;
  previous: () => void;
  jumpTo: (stepIndex: number) => void;
  cancel: () => void;
  complete: (finalStepData?: any) => void;

  // === VALIDATION ===
  canGoNext: boolean;
  canGoPrevious: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;

  // === PROGRESS ===
  progress: number;
  currentStepTitle: string;
}
```

| Return Property | Type | Description |
|-----------------|------|-------------|
| **STATE** | | |
| `isOpen` | `boolean` | `true` when wizard modal is open |
| `currentStep` | `number` | Current step index (0-based) |
| `totalSteps` | `number` | Total number of steps |
| `currentStepId` | `string` | Current step ID (e.g., 'type', 'basic') |
| `data` | `Record<string, any>` | Accumulated data from all steps |
| `isSubmitting` | `boolean` | `true` when completing wizard (prevents double-submit) |
| **NAVIGATION** | | |
| `start` | `() => void` | Opens wizard modal and resets to initial step |
| `next` | `(stepData?: any) => void` | Moves to next step; merges `stepData` into `data` |
| `previous` | `() => void` | Moves to previous step (if not first) |
| `jumpTo` | `(stepIndex: number) => void` | Jumps to specific step by index |
| `cancel` | `() => void` | Closes wizard, resets data (unless `persistData=true`) |
| `complete` | `(finalStepData?: any) => void` | Completes wizard, calls `onComplete` callback |
| **VALIDATION** | | |
| `canGoNext` | `boolean` | `true` if can navigate to next step (not on last step) |
| `canGoPrevious` | `boolean` | `true` if can navigate to previous step (not on first step) |
| `isFirstStep` | `boolean` | `true` if on first step |
| `isLastStep` | `boolean` | `true` if on last step |
| **PROGRESS** | | |
| `progress` | `number` | Progress percentage (0-100) |
| `currentStepTitle` | `string` | Title of current step |

---

## Behavior

### Internal Logic

**State Management:**
- Maintains four state variables:
  - `isOpen` (boolean) - Modal visibility
  - `currentStep` (number) - Current step index (0-based)
  - `data` (Record<string, any>) - Accumulated data from all steps
  - `isSubmitting` (boolean) - Prevents double-submit during completion
- Uses `useState` for reactive state updates
- Uses `useCallback` for stable function references

**Data Accumulation Strategy:**
1. **Initial State**: `data = {}` (empty object)
2. **Step Navigation**: `next(stepData)` → merge stepData into data: `{ ...data, ...stepData }`
3. **Overlapping Keys**: Later values override earlier values (merge strategy)
4. **Final Step**: `complete(finalStepData)` → merge final data: `{ ...data, ...finalStepData }`
5. **Reset**: `cancel()` or `start()` → reset to `{}` (unless `persistData=true`)

**Validation Flow:**
1. User calls `next(stepData)` or `complete(stepData)`
2. Hook checks if current step has `validate` function
3. If validator exists, calls `validate(stepData)`
4. If validation returns `false`, navigation is **silently blocked**
5. If validation returns `true` (or no validator), navigation proceeds

**Navigation Rules:**
- `next()` from last step → no effect (silently ignored)
- `previous()` from first step → no effect (silently ignored)
- `jumpTo(index)` with invalid index → no effect (silently ignored)

**Side Effects:**
- None (pure state management hook)
- No DOM manipulation, no API calls, no timers
- No cleanup required on unmount

**Memoization:**
- All functions memoized with `useCallback`
- Dependencies: `[steps, currentStep, data, isSubmitting, callbacks]`

### Dependencies

**React Hooks Used:**
- `useState` - Manages `isOpen`, `currentStep`, `data`, `isSubmitting`
- `useCallback` - Memoizes navigation functions for stable references
- `useMemo` - Computes derived values (progress, step status)

**External Dependencies:**
- None (zero external packages)

### Re-render Triggers

**Hook re-executes when:**
- Component re-renders (hook runs on every render)
- `options` object reference changes

**Component re-renders when:**
- `isOpen` changes (boolean toggle)
- `currentStep` changes (number increment/decrement)
- `data` changes (object reference change)
- `isSubmitting` changes (boolean toggle)

**Optimization:**
```tsx
// ✅ GOOD - Memoize callbacks
const handleComplete = useCallback(async (data) => {
  await saveContact(data);
}, []);

const wizard = useModalWizard({
  id: 'wizard',
  steps: STEPS,
  onComplete: handleComplete,
});

// ❌ BAD - Inline callback creates new reference every render
const wizard = useModalWizard({
  id: 'wizard',
  steps: STEPS,
  onComplete: async (data) => await saveContact(data), // New function!
});
```

---

## Examples

### Example 1: Basic Contact Creation Wizard

```tsx
import { useModalWizard, useTranslation } from '@l-kern/config';
import { Modal, Button, Input } from '@l-kern/ui-components';
import { useState } from 'react';

function CreateContactWizard() {
  const { t } = useTranslation();
  const [stepData, setStepData] = useState({});

  const wizard = useModalWizard({
    id: 'create-contact',
    steps: [
      { id: 'type', title: t('wizard.contactType') },
      { id: 'basic', title: t('wizard.basicInfo') },
      { id: 'contact', title: t('wizard.contactDetails') },
    ],
    onComplete: async (data) => {
      console.log('Creating contact:', data);
      await createContact(data);
    },
  });

  const handleNext = () => {
    wizard.next(stepData);
    setStepData({}); // Reset for next step
  };

  const handleComplete = () => {
    wizard.complete(stepData);
  };

  return (
    <>
      <Button onClick={wizard.start}>
        {t('contacts.create')}
      </Button>

      <Modal
        isOpen={wizard.isOpen}
        onClose={wizard.cancel}
        title={wizard.currentStepTitle}
      >
        {/* Progress Bar */}
        <div className="progress-bar">
          <div style={{ width: `${wizard.progress}%` }} />
        </div>
        <p>Step {wizard.currentStep + 1} of {wizard.totalSteps}</p>

        {/* Step 1: Contact Type */}
        {wizard.currentStepId === 'type' && (
          <div>
            <label>
              <input
                type="radio"
                name="type"
                value="person"
                onChange={(e) => setStepData({ type: e.target.value })}
              />
              Person
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="company"
                onChange={(e) => setStepData({ type: e.target.value })}
              />
              Company
            </label>
          </div>
        )}

        {/* Step 2: Basic Info */}
        {wizard.currentStepId === 'basic' && (
          <div>
            <Input
              label="Name"
              onChange={(e) => setStepData({ ...stepData, name: e.target.value })}
            />
          </div>
        )}

        {/* Step 3: Contact Details */}
        {wizard.currentStepId === 'contact' && (
          <div>
            <Input
              label="Email"
              onChange={(e) => setStepData({ ...stepData, email: e.target.value })}
            />
            <Input
              label="Phone"
              onChange={(e) => setStepData({ ...stepData, phone: e.target.value })}
            />
          </div>
        )}

        {/* Navigation */}
        <div className="wizard-actions">
          <Button
            variant="secondary"
            onClick={wizard.previous}
            disabled={!wizard.canGoPrevious || wizard.isSubmitting}
          >
            {t('common.back')}
          </Button>
          <Button variant="secondary" onClick={wizard.cancel}>
            {t('common.cancel')}
          </Button>
          {wizard.isLastStep ? (
            <Button
              variant="primary"
              onClick={handleComplete}
              disabled={wizard.isSubmitting}
            >
              {wizard.isSubmitting ? t('common.creating') : t('common.create')}
            </Button>
          ) : (
            <Button variant="primary" onClick={handleNext}>
              {t('common.next')}
            </Button>
          )}
        </div>
      </Modal>
    </>
  );
}
```

### Example 2: Wizard with Validation

```tsx
import { useModalWizard } from '@l-kern/config';
import { useState } from 'react';

function ValidatedWizard() {
  const [step1Data, setStep1Data] = useState({ name: '' });
  const [step2Data, setStep2Data] = useState({ email: '' });

  const wizard = useModalWizard({
    id: 'validated-wizard',
    steps: [
      {
        id: 'name',
        title: 'Name',
        validate: (data) => {
          if (!data.name || data.name.length === 0) {
            alert('Name is required');
            return false;
          }
          return true;
        },
      },
      {
        id: 'email',
        title: 'Email',
        validate: (data) => {
          const emailRegex = /\S+@\S+\.\S+/;
          if (!emailRegex.test(data.email)) {
            alert('Invalid email');
            return false;
          }
          return true;
        },
      },
    ],
    onComplete: (data) => {
      console.log('Valid data:', data);
    },
  });

  return (
    <Modal isOpen={wizard.isOpen} onClose={wizard.cancel}>
      {wizard.currentStepId === 'name' && (
        <div>
          <input
            value={step1Data.name}
            onChange={(e) => setStep1Data({ name: e.target.value })}
          />
          <button onClick={() => wizard.next(step1Data)}>Next</button>
        </div>
      )}

      {wizard.currentStepId === 'email' && (
        <div>
          <input
            value={step2Data.email}
            onChange={(e) => setStep2Data({ email: e.target.value })}
          />
          <button onClick={() => wizard.complete(step2Data)}>Finish</button>
        </div>
      )}
    </Modal>
  );
}
```

### Example 3: Complex Onboarding Wizard with Persistence

```tsx
import { useModalWizard, useTranslation, useToast } from '@l-kern/config';
import { Modal, Button, Input } from '@l-kern/ui-components';
import { useState, useEffect } from 'react';

function OnboardingWizard() {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const wizard = useModalWizard({
    id: 'onboarding-wizard',
    steps: [
      { id: 'welcome', title: t('onboarding.welcome') },
      { id: 'profile', title: t('onboarding.profile') },
      { id: 'preferences', title: t('onboarding.preferences') },
      { id: 'review', title: t('onboarding.review') },
    ],
    persistData: true, // Save draft progress
    onComplete: async (data) => {
      try {
        await saveOnboardingData(data);
        showToast({
          message: t('onboarding.success'),
          type: 'success',
        });
      } catch (error) {
        showToast({
          message: t('onboarding.error'),
          type: 'error',
        });
        throw error; // Keep modal open
      }
    },
    onCancel: () => {
      console.log('Onboarding cancelled, draft saved');
    },
  });

  // Auto-start wizard on mount (first-time users)
  useEffect(() => {
    const isFirstTime = !localStorage.getItem('onboarding-completed');
    if (isFirstTime) {
      wizard.start();
    }
  }, []);

  // Save draft every step
  const handleNext = (stepData: any) => {
    wizard.next(stepData);
    localStorage.setItem('onboarding-draft', JSON.stringify(wizard.data));
  };

  return (
    <Modal
      isOpen={wizard.isOpen}
      onClose={wizard.cancel}
      title={wizard.currentStepTitle}
      size="large"
    >
      {/* Progress Indicator */}
      <div className="wizard-progress">
        {wizard.steps.map((step, index) => (
          <div
            key={step.id}
            className={index <= wizard.currentStep ? 'active' : 'inactive'}
          >
            {step.title}
          </div>
        ))}
      </div>

      {/* Welcome Step */}
      {wizard.currentStepId === 'welcome' && (
        <div>
          <h2>{t('onboarding.welcomeTitle')}</h2>
          <p>{t('onboarding.welcomeMessage')}</p>
          <Button onClick={() => handleNext({})}>
            {t('common.getStarted')}
          </Button>
        </div>
      )}

      {/* Profile Step */}
      {wizard.currentStepId === 'profile' && (
        <ProfileForm onNext={handleNext} />
      )}

      {/* Preferences Step */}
      {wizard.currentStepId === 'preferences' && (
        <PreferencesForm onNext={handleNext} onBack={wizard.previous} />
      )}

      {/* Review Step */}
      {wizard.currentStepId === 'review' && (
        <div>
          <h3>{t('onboarding.reviewTitle')}</h3>
          <pre>{JSON.stringify(wizard.data, null, 2)}</pre>

          <div className="actions">
            <Button variant="secondary" onClick={wizard.previous}>
              {t('common.back')}
            </Button>
            <Button
              variant="primary"
              onClick={() => wizard.complete({})}
              disabled={wizard.isSubmitting}
            >
              {wizard.isSubmitting
                ? t('common.completing')
                : t('common.complete')}
            </Button>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${wizard.progress}%` }}
        />
        <span>{Math.round(wizard.progress)}% Complete</span>
      </div>
    </Modal>
  );
}
```

---

## Performance

### Memoization Strategy

**Memoized Functions:**
- All navigation functions (`start`, `next`, `previous`, `jumpTo`, `cancel`, `complete`) use `useCallback`
- Dependencies: `[steps, currentStep, data, isSubmitting, onComplete, onCancel, persistData, initialStep]`

**Optimization:**
```typescript
// ✅ GOOD - Hoist steps outside component (static)
const WIZARD_STEPS = [
  { id: 'step1', title: 'Step 1' },
  { id: 'step2', title: 'Step 2' },
];

function MyComponent() {
  const wizard = useModalWizard({
    id: 'wizard',
    steps: WIZARD_STEPS, // Stable reference
    onComplete: handleComplete,
  });
}

// ❌ BAD - Steps array recreated every render
function MyComponent() {
  const wizard = useModalWizard({
    id: 'wizard',
    steps: [  // New array every render!
      { id: 'step1', title: 'Step 1' },
    ],
  });
}
```

### Re-render Triggers

**Hook re-executes when:**
- Component re-renders
- `options.steps` array reference changes
- Callback functions change (if not memoized)

**Component re-renders when:**
- `isOpen` changes
- `currentStep` changes
- `data` object reference changes
- `isSubmitting` changes

**Prevent unnecessary re-renders:**
```typescript
// ✅ Hoist static steps
const STEPS = [{ id: 'step1', title: 'Step 1' }];

// ✅ Memoize callbacks
const handleComplete = useCallback((data) => {
  saveData(data);
}, []);
```

### Memory Usage

- **Typical**: ~2-5KB per wizard instance (depends on accumulated data size)
- **Cleanup**: Automatic when component unmounts
- **Leaks**: None (no subscriptions, no timers, no event listeners)

### Complexity

- **Time**: O(1) for all operations (constant time)
- **Space**: O(n) where n = size of accumulated data object

---

## Known Issues

### Active Issues

**No known issues** ✅

### Fixed Issues

See [Changelog](#changelog) section below.

---

## Testing

### Test Coverage
- ✅ **Unit Tests**: 66 tests
- ✅ **Coverage**: 100% (statements, branches, functions, lines)
- ✅ **Hook Tests**: 20 tests (using @testing-library/react)
- ✅ **Edge Cases**: 8 tests (boundary conditions, validation)

### Test File
`packages/config/src/hooks/useModalWizard/useModalWizard.test.ts`

### Running Tests
```bash
# Run hook tests
docker exec lkms201-web-ui npx nx test config --testFile=useModalWizard.test.ts

# Run with coverage
docker exec lkms201-web-ui npx nx test config --coverage --testFile=useModalWizard.test.ts

# Watch mode
docker exec lkms201-web-ui npx nx test config --watch --testFile=useModalWizard.test.ts
```

### Key Test Cases

**Initialization:**
- ✅ Initializes with default state (closed, step 0)
- ✅ Initializes with custom initial step

**Navigation:**
- ✅ Starts wizard (opens modal, resets to initial step)
- ✅ Navigates to next step
- ✅ Navigates to previous step
- ✅ Does not go previous from first step
- ✅ Does not go next from last step
- ✅ Jumps to specific step by index
- ✅ Prevents invalid step jumps

**Data Accumulation:**
- ✅ Accumulates data from steps
- ✅ Merges overlapping data keys (later overrides earlier)

**Validation:**
- ✅ Validates step data before proceeding
- ✅ Blocks navigation if validation fails

**Cancel:**
- ✅ Cancels wizard and closes modal
- ✅ Resets data (unless `persistData=true`)
- ✅ Calls `onCancel` callback

**Complete:**
- ✅ Completes wizard and calls `onComplete`
- ✅ Does not close modal if `onComplete` throws error

**Progress:**
- ✅ Calculates progress percentage correctly

**Step Status:**
- ✅ Correctly identifies first and last steps
- ✅ `canGoNext` and `canGoPrevious` flags accurate

**Integration:**
- ✅ Complete workflow: start → navigate → complete

---

## Related Hooks

- **[useModal](useModal.md)** - Basic modal state management (useModalWizard builds on this)
- **[useFormDirty](useFormDirty.md)** - Track unsaved form changes (use in wizard steps)
- **[useToast](useToast.md)** - Toast notifications (show success/error after completion)

---

## Related Components

- **[Modal](../components/Modal.md)** - Modal dialog component
- **[Button](../components/Button.md)** - Navigation buttons (Next, Back, Finish)
- **[ProgressBar](../components/ProgressBar.md)** - Visual progress indicator

---

## Migration Guide

### From v3 to v4

**No breaking changes** - This is a new hook in v4.

If migrating from custom wizard state management in v3:

**v3 (Manual state):**
```tsx
const [currentStep, setCurrentStep] = useState(0);
const [data, setData] = useState({});

const handleNext = (stepData) => {
  setData({ ...data, ...stepData });
  setCurrentStep(currentStep + 1);
};
```

**v4 (useModalWizard hook):**
```tsx
const wizard = useModalWizard({
  id: 'wizard',
  steps: STEPS,
});

const handleNext = (stepData) => {
  wizard.next(stepData); // Automatic data accumulation!
};
```

---

## Changelog

### v1.0.0 (2025-10-18)
- 🎉 Initial release
- ✅ Multi-step navigation (next, previous, jump)
- ✅ Automatic data accumulation
- ✅ Per-step validation
- ✅ Progress tracking (percentage, step status)
- ✅ Modal integration
- ✅ Submission state tracking
- ✅ Data persistence option
- ✅ Callback support (`onComplete`, `onCancel`)
- ✅ 66 unit tests (100% coverage)

---

## Troubleshooting

### Common Issues

**Issue**: Step data not accumulated
**Cause**: Forgot to pass data to `next()` or `complete()`
**Solution**:
```tsx
// ❌ BAD - Data not passed
wizard.next();

// ✅ GOOD - Pass step data
wizard.next({ name: 'John' });
```

**Issue**: Validation not working
**Cause**: Validation function returns truthy/falsy instead of boolean
**Solution**:
```tsx
// ❌ BAD - Returns string (truthy)
validate: (data) => data.name || 'Name required'

// ✅ GOOD - Returns boolean
validate: (data) => Boolean(data.name)
```

**Issue**: Hook re-runs too often (performance)
**Cause**: Steps array or callbacks recreated every render
**Solution**:
```tsx
// ❌ BAD - New array every render
const wizard = useModalWizard({
  steps: [{ id: 'step1', title: 'Step 1' }],
});

// ✅ GOOD - Hoist steps outside component
const STEPS = [{ id: 'step1', title: 'Step 1' }];
const wizard = useModalWizard({ steps: STEPS });
```

**Issue**: Data lost after cancel
**Cause**: Default behavior resets data
**Solution**:
```tsx
// Enable data persistence
const wizard = useModalWizard({
  steps: STEPS,
  persistData: true, // ← Data saved after cancel
});
```

---

## Best Practices

1. ✅ **Hoist steps array** - Define steps outside component (prevent re-renders)
2. ✅ **Memoize callbacks** - Use `useCallback` for `onComplete` and `onCancel`
3. ✅ **Validate per step** - Add validation functions to catch errors early
4. ✅ **Show progress** - Display progress bar and "Step X of Y" indicator
5. ✅ **Save drafts** - Use `persistData: true` for long wizards
6. ✅ **Handle errors gracefully** - Catch errors in `onComplete`, keep modal open
7. ✅ **Disable navigation during submit** - Use `disabled={wizard.isSubmitting}`
8. ✅ **Reset step data** - Clear step-specific state after `next()`
9. ✅ **Show review step** - Last step should summarize all data
10. ✅ **Use TypeScript** - Type your data accumulation object for safety

---

## Resources

### Internal Links
- [Coding Standards](../programming/coding-standards.md)
- [Testing Guide](../programming/testing-overview.md)
- [Hooks Best Practices](../programming/frontend-standards.md#react-hooks)

### External References
- [React Hooks Documentation](https://react.dev/reference/react)
- [useCallback Hook](https://react.dev/reference/react/useCallback)
- [Multi-Step Forms Best Practices](https://www.nngroup.com/articles/wizard-design/)

---

**Last Updated**: 2025-10-20
**Maintainer**: BOSSystems s.r.o.
**Documentation Version**: 1.0.0
