# ================================================================
# WizardProgress
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\components\WizardProgress.md
# Version: 1.1.1
# Created: 2025-10-18
# Updated: 2025-10-20
# Component Location: packages/ui-components/src/components/Modal/WizardProgress.tsx
# Package: @l-kern/ui-components
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Progress indicator for multi-step wizard modals.
#   Supports 3 display variants: dots, bar, numbers.
# ================================================================

---

## Overview

**Purpose**: Visual progress indicator for multi-step wizard flows
**Package**: @l-kern/ui-components
**Path**: packages/ui-components/src/components/Modal/WizardProgress.tsx
**Since**: v1.0.0 (v1.1.1 added responsive breakpoints)

WizardProgress displays the current step in a multi-step wizard using 3 visual variants: dots (default), progress bar, or numbers. It shows step count (e.g., "Step 2/5") and optional step title. Fully responsive with mobile/tablet/desktop breakpoints and dark mode support.

---

## Features

- ✅ **3 Visual Variants**: dots (default), bar (gradient fill), numbers (fraction display)
- ✅ **Step Count Display**: Shows "Step X/Y" with translation support
- ✅ **Optional Step Titles**: Display current step name (e.g., "Basic Info")
- ✅ **Progress Calculation**: Automatic percentage calculation for bar variant
- ✅ **Active State Highlighting**: Dots scale and change color when active
- ✅ **Responsive Design**: Smaller on mobile (6px dots), larger on desktop (10px dots)
- ✅ **Dark Mode Support**: Adapts colors for dark theme
- ✅ **Gradient Progress Bar**: Purple gradient with smooth animation
- ✅ **Translation Ready**: Uses useTranslation for "Step" label
- ✅ **TypeScript**: Full type safety with WizardProgressProps interface

---

## Quick Start

### Basic Usage

```tsx
import { WizardProgress } from '@l-kern/ui-components';

function SimpleWizard() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div>
      <WizardProgress
        currentStep={currentStep}
        totalSteps={5}
        variant="dots"
      />

      {/* Wizard content */}
    </div>
  );
}
```

### Common Patterns

#### Pattern 1: Dots Variant with Step Title
```tsx
import { WizardProgress } from '@l-kern/ui-components';

function DotsWizard() {
  const stepTitles = ['Basic Info', 'Contact Details', 'Preferences', 'Review', 'Confirmation'];

  return (
    <WizardProgress
      currentStep={1}
      totalSteps={5}
      currentStepTitle={stepTitles[1]}  // "Contact Details"
      variant="dots"
    />
  );
}
```

#### Pattern 2: Progress Bar Variant
```tsx
import { WizardProgress } from '@l-kern/ui-components';

function BarWizard() {
  return (
    <WizardProgress
      currentStep={2}
      totalSteps={4}
      currentStepTitle="Payment Information"
      variant="bar"
    />
  );
}

// Renders:
// ████████████████░░░░░░░░  75% (step 3/4)
// Step 3/4
// Payment Information
```

#### Pattern 3: Numbers Variant (Compact)
```tsx
import { WizardProgress } from '@l-kern/ui-components';

function CompactWizard() {
  return (
    <WizardProgress
      currentStep={0}
      totalSteps={3}
      variant="numbers"
    />
  );
}

// Renders:
// 1 / 3
// Step 1/3
```

---

## Props API

### WizardProgressProps

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `currentStep` | `number` | - | **Yes** | Current step index (0-based, so step 1 = 0) |
| `totalSteps` | `number` | - | **Yes** | Total number of steps in wizard |
| `stepTitles` | `string[]` | `undefined` | No | Array of step titles (not currently used, reserved for future) |
| `currentStepTitle` | `string` | `undefined` | No | Title of current step (displayed below step count) |
| `variant` | `'dots' \| 'bar' \| 'numbers'` | `'dots'` | No | Visual display variant |

### Type Definitions

```typescript
export interface WizardProgressProps {
  currentStep: number;        // 0-based index
  totalSteps: number;
  stepTitles?: string[];      // Reserved for future use
  currentStepTitle?: string;
  variant?: 'dots' | 'bar' | 'numbers';
}
```

---

## Visual Design

### Variants

#### Dots Variant (default)

```
● ● ○ ○ ○  (Step 2/5)
Step 2/5
Basic Information
```

**Visual Details:**
- Active dots: Purple (--color-brand-primary), scaled 1.2x
- Inactive dots: Gray (--theme-border)
- Size: 10px (desktop), 8px (tablet), 6px (mobile)
- Gap: 8px (desktop), 4px (tablet/mobile)
- Animation: 200ms ease transform + color

#### Bar Variant

```
██████████░░░░░░░░░░  50% (Step 2/4)
Step 2/4
Contact Details
```

**Visual Details:**
- Height: 6px (desktop), 5px (tablet), 4px (mobile)
- Background: Gray (--theme-border)
- Fill: Purple gradient (90deg, primary → primary-dark)
- Animation: 300ms ease width transition
- Border radius: 3px

#### Numbers Variant

```
2 / 5
Step 2/5
Preferences
```

**Visual Details:**
- Current number: Purple (--color-brand-primary), 18px, weight 600
- Separator: Gray (--theme-text-muted), 18px
- Total number: Gray (--theme-text-muted), 18px
- Font size: 18px (desktop), 16px (tablet), 14px (mobile)

### Layout Structure

```
┌─────────────────────────────────────────────────────┐
│         WizardProgress Component                    │
│  ┌───────────────────────────────────────────────┐  │
│  │         [Dots / Bar / Numbers]                │  │
│  ├───────────────────────────────────────────────┤  │
│  │         Step 2/5                              │  │
│  │         (stepLabel - uppercase, small)        │  │
│  ├───────────────────────────────────────────────┤  │
│  │         Contact Details                       │  │
│  │         (stepTitle - large, bold, optional)   │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Dimensions

**Desktop (≥ 1024px):**
- Padding: 20px 0
- Gap: 16px
- Margin-bottom: 24px
- Border: 1px solid bottom

**Tablet (768px - 1023px):**
- Padding: 16px 0
- Gap: 12px
- Margin-bottom: 20px

**Mobile (< 768px):**
- Padding: 12px 0
- Gap: 8px
- Margin-bottom: 16px

---

## Behavior

### Progress Calculation

```tsx
// currentStep is 0-based, so add 1 for display
const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

// Examples:
// currentStep=0, totalSteps=4 → (0+1)/4 = 25%
// currentStep=1, totalSteps=4 → (1+1)/4 = 50%
// currentStep=3, totalSteps=4 → (3+1)/4 = 100%
```

### Dot Active State Logic

```tsx
// Active dots: currentStep and all previous steps
{Array.from({ length: totalSteps }).map((_, index) => (
  <div
    key={index}
    className={`dot ${index <= currentStep ? 'dotActive' : ''}`}
  />
))}

// Example: currentStep=2, totalSteps=5
// Dots: [active] [active] [active] [inactive] [inactive]
//        0        1        2         3          4
```

### Step Label Format

```tsx
// Always shows 1-based index (user-friendly)
`Step ${currentStep + 1}/${totalSteps}`

// Examples:
// currentStep=0 → "Step 1/5"
// currentStep=2 → "Step 3/5"
// currentStep=4 → "Step 5/5"
```

---

## Translation Keys

### Default Labels (useTranslation)

| Key | SK Value | EN Value |
|-----|----------|----------|
| `wizard.step` | `Krok` | `Step` |

### Fallback Label

```tsx
const stepLabel = t('wizard.step') || 'Step';
// Renders: "Step 2/5" or "Krok 2/5"
```

---

## Accessibility

### WCAG Compliance
- ✅ **WCAG 2.1 Level AA** compliant
- ✅ Visual progress indicator (color + shape)
- ✅ Text label provides context (not just visual)
- ✅ Semantic HTML (divs with proper structure)
- ✅ Screen reader friendly (text content readable)

### Semantic HTML

```tsx
<div className="wizardProgress">
  <div className="progressDots">       {/* Visual indicator */}
    <div className="dot dotActive" />
    <div className="dot" />
  </div>

  <div className="stepInfo">            {/* Text context */}
    <span className="stepLabel">Step 2/5</span>
    <span className="stepTitle">Contact Details</span>
  </div>
</div>
```

### Screen Reader Behavior

**Announcement:**
- "Step 2 of 5, Contact Details"
- Screen reader reads stepLabel and stepTitle sequentially

---

## Responsive Design

### Breakpoints

**Desktop (≥ 1024px) - Default:**
- Dot size: 10px
- Bar height: 6px
- Font sizes: 18px (numbers), 12px (label), 16px (title)
- Padding: 20px 0
- Gap: 16px

**Tablet (768px - 1023px):**
- Dot size: 8px
- Bar height: 5px
- Font sizes: 16px (numbers), 10px (label), 14px (title)
- Padding: 16px 0
- Gap: 12px

**Mobile (< 768px):**
- Dot size: 6px
- Bar height: 4px
- Font sizes: 14px (numbers), 10px (label), 12px (title)
- Padding: 12px 0
- Gap: 8px

### Responsive Behavior

```tsx
// Dots variant automatically adjusts size
@media (max-width: 767px) {
  .dot {
    width: 6px;    /* Smaller on mobile */
    height: 6px;
  }
}

// Bar variant adjusts height
@media (max-width: 767px) {
  .progressBar {
    height: 4px;   /* Thinner on mobile */
  }
}
```

---

## Styling

### CSS Variables Used

```css
/* Spacing */
--spacing-xl: 20px;           /* Padding vertical */
--spacing-lg: 16px;           /* Gap between elements */
--spacing-md: 12px;
--spacing-sm: 8px;            /* Dot gap */

/* Typography */
--font-size-xl: 18px;         /* Numbers variant */
--font-size-lg: 16px;         /* Step title */
--font-size-sm: 12px;         /* Step label */

/* Colors */
--theme-border: #e0e0e0;                     /* Border, inactive dots/bar */
--color-brand-primary: #9c27b0;              /* Active dots, progress fill */
--color-brand-primary-dark: #7b1fa2;         /* Progress bar gradient end */
--theme-text: #212121;                       /* Step title */
--theme-text-muted: #9e9e9e;                 /* Step label */

/* Dark mode */
[data-theme='dark'] --theme-border: #333333;
[data-theme='dark'] .dot { background: rgba(255, 255, 255, 0.2); }
[data-theme='dark'] .progressBar { background: rgba(255, 255, 255, 0.1); }
```

### Custom Styling

**Via CSS Module:**
```css
/* Change active dot color */
.dotActive {
  background: var(--color-status-success);  /* Green instead of purple */
}

/* Change bar gradient */
.progressBarFill {
  background: linear-gradient(90deg, #4CAF50 0%, #2E7D32 100%);
}
```

---

## Known Issues

### Active Issues

**No known issues** ✅

---

## Testing

### Test Coverage
- ✅ **Unit Tests**: 25 tests
- ✅ **Coverage**: 100% (statements, branches, functions, lines)
- ✅ **Rendering Tests**: 9 tests (variants, structure)
- ✅ **Dots Tests**: 6 tests (count, active state)
- ✅ **Bar Tests**: 4 tests (progress calculation)
- ✅ **Info Tests**: 4 tests (step count, title)
- ✅ **Edge Cases**: 2 tests (single step, large step count)

### Test File
`packages/ui-components/src/components/Modal/WizardProgress.test.tsx`

### Running Tests
```bash
# Run component tests
docker exec lkms201-web-ui npx nx test ui-components --testFile=WizardProgress.test.tsx

# Run with coverage
docker exec lkms201-web-ui npx nx test ui-components --coverage --testFile=WizardProgress.test.tsx

# Watch mode
docker exec lkms201-web-ui npx nx test ui-components --watch --testFile=WizardProgress.test.tsx
```

### Key Test Cases

**Basic Rendering:**
- ✅ Renders dots variant by default
- ✅ Renders bar variant
- ✅ Renders numbers variant

**Dots Variant:**
- ✅ Renders correct number of dots
- ✅ Marks current and previous dots as active
- ✅ Handles first step correctly (only 1 active)

**Bar Variant:**
- ✅ Shows correct progress percentage
- ✅ Calculates progress for first step (25%)
- ✅ Calculates progress for last step (100%)

**Step Info:**
- ✅ Displays step count (1-based display)
- ✅ Displays step title when provided
- ✅ Hides step title when not provided

**Edge Cases:**
- ✅ Handles single step wizard (Step 1/1)
- ✅ Handles large number of steps (10+)

**Accessibility:**
- ✅ Renders accessible step information (text readable)

---

## Related Components

- **[WizardNavigation](WizardNavigation.md)** - Navigation buttons for wizards
- **[Modal](Modal.md)** - Often used as wizard container

---

## Usage Examples

### Example 1: Complete 5-Step Wizard
```tsx
import { WizardProgress, WizardNavigation } from '@l-kern/ui-components';
import { useState } from 'react';

function CompleteWizard() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Personal Info',
    'Contact Details',
    'Address',
    'Preferences',
    'Review'
  ];

  return (
    <div>
      <WizardProgress
        currentStep={currentStep}
        totalSteps={steps.length}
        currentStepTitle={steps[currentStep]}
        variant="dots"
      />

      {/* Step content */}
      <div>{steps[currentStep]} content</div>

      <WizardNavigation
        onPrevious={currentStep > 0 ? () => setCurrentStep(currentStep - 1) : undefined}
        onNext={currentStep < steps.length - 1 ? () => setCurrentStep(currentStep + 1) : undefined}
        onComplete={currentStep === steps.length - 1 ? () => console.log('Done!') : undefined}
        canGoPrevious={currentStep > 0}
        canGoNext={true}
        isLastStep={currentStep === steps.length - 1}
      />
    </div>
  );
}
```

### Example 2: Progress Bar for File Upload
```tsx
import { WizardProgress } from '@l-kern/ui-components';
import { useState, useEffect } from 'react';

function FileUploadWizard() {
  const [uploadStep, setUploadStep] = useState(0);

  const steps = ['Select File', 'Upload', 'Processing', 'Complete'];

  // Simulate upload progress
  useEffect(() => {
    if (uploadStep === 1) {
      const timer = setTimeout(() => setUploadStep(2), 2000);
      return () => clearTimeout(timer);
    }
  }, [uploadStep]);

  return (
    <div>
      <WizardProgress
        currentStep={uploadStep}
        totalSteps={steps.length}
        currentStepTitle={steps[uploadStep]}
        variant="bar"  // Bar shows visual progress
      />

      {uploadStep === 0 && <input type="file" onChange={() => setUploadStep(1)} />}
      {uploadStep === 1 && <div>Uploading...</div>}
      {uploadStep === 2 && <div>Processing file...</div>}
      {uploadStep === 3 && <div>Complete!</div>}
    </div>
  );
}
```

### Example 3: Compact Numbers Variant
```tsx
import { WizardProgress } from '@l-kern/ui-components';

function CompactWizard() {
  const [step, setStep] = useState(0);

  return (
    <div>
      {/* Compact display for minimal UI */}
      <WizardProgress
        currentStep={step}
        totalSteps={3}
        variant="numbers"
      />

      <div>Step {step + 1} content</div>

      <button onClick={() => setStep(step + 1)} disabled={step === 2}>
        Next
      </button>
    </div>
  );
}
```

### Example 4: Dynamic Step Titles
```tsx
import { WizardProgress } from '@l-kern/ui-components';
import { useState } from 'react';

function DynamicTitleWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const getStepTitle = () => {
    if (currentStep === 0) return 'Enter your name';
    if (currentStep === 1) return 'Enter your email';
    if (currentStep === 2) return `Review: ${formData.name}`;
    return 'Unknown';
  };

  return (
    <div>
      <WizardProgress
        currentStep={currentStep}
        totalSteps={3}
        currentStepTitle={getStepTitle()}  // Dynamic title
        variant="dots"
      />

      {/* Form fields */}
    </div>
  );
}
```

---

## Performance

### Bundle Size
- **JS**: ~1.2 KB (gzipped)
- **CSS**: ~0.8 KB (gzipped) - includes responsive breakpoints
- **Total**: ~2.0 KB

### Runtime Performance
- **Render time**: < 2ms (average)
- **Re-renders**: None (pure component, only re-renders when props change)
- **Memory**: ~0.5 KB per instance

### Optimization Tips
- ✅ Use `variant="numbers"` for minimal DOM (smallest bundle)
- ✅ Avoid passing unused `stepTitles` array prop
- ✅ Memoize currentStepTitle if computed from complex state

```tsx
// Optimized with useMemo
import { useMemo } from 'react';

function OptimizedWizard() {
  const [step, setStep] = useState(0);

  const stepTitle = useMemo(() => {
    // Expensive computation
    return computeStepTitle(step);
  }, [step]);

  return (
    <WizardProgress
      currentStep={step}
      totalSteps={5}
      currentStepTitle={stepTitle}
    />
  );
}
```

---

## Changelog

### v1.1.1 (2025-10-19)
- ✅ Added responsive breakpoints (mobile, tablet, desktop)
- ✅ Smaller dots/bar on mobile devices
- ✅ Improved touch targets

### v1.0.0 (2025-10-18)
- 🎉 Initial release
- ✅ 3 visual variants (dots, bar, numbers)
- ✅ Step count display
- ✅ Optional step titles
- ✅ Dark mode support
- ✅ 25 unit tests (100% coverage)

---

## Contributing

### Adding New Variant

1. Add variant to `WizardProgressProps` type
2. Create CSS classes in `WizardProgress.module.css`
3. Add rendering logic in component
4. Update tests
5. Update this documentation

Example:
```tsx
// 1. Add to type
variant?: 'dots' | 'bar' | 'numbers' | 'checkmarks';

// 2. CSS
.progressCheckmarks { ... }

// 3. Render
{variant === 'checkmarks' && <div>✓ ✓ ○ ○</div>}

// 4. Test
it('renders checkmarks variant', () => { ... });
```

### Reporting Issues

1. Check [Known Issues](#known-issues) first
2. Create task in project management
3. Add issue to this documentation
4. Link task number

---

## Resources

### Internal Links
- [WizardNavigation Component](WizardNavigation.md)
- [Modal Component](Modal.md)
- [Coding Standards](../programming/coding-standards.md)
- [Design System](../design/component-design-system.md)

### External References
- [Progress Indicators Best Practices](https://www.nngroup.com/articles/progress-indicators/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)

---

**Last Updated**: 2025-10-20
**Maintainer**: BOSSystems s.r.o.
**Documentation Version**: 1.1.1
