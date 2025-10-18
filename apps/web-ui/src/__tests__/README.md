# ================================================================
# Testing & Demo Components
# ================================================================
# File: apps/web-ui/src/__tests__/README.md
# Version: 1.0.0
# Created: 2025-10-18
# Updated: 2025-10-18
#
# Description:
#   Test-only components, demos, and pages for development purposes.
#   These files are NOT used in production builds.
# ================================================================

## 📋 Overview

This `__tests__/` folder contains **test-only code** that is separated from production code for clarity and maintainability.

**Purpose:**
- Test and compare different UI variants
- Demonstrate complex component usage
- Provide development playground for new features
- Keep production bundle size minimal

---

## 📁 Folder Structure

```
__tests__/
├── components/          ← Test-only components (advanced variants)
│   ├── Modal3Variants.tsx         (Modal with all 3 variants)
│   └── Modal3Variants.module.css
│
├── demos/               ← Complete demo implementations
│   └── ContactFormWizard/         (6-step wizard demo)
│       ├── ContactFormWizard.tsx
│       ├── ContactTypeStep.tsx
│       ├── BasicInfoStep.tsx
│       ├── ContactDetailsStep.tsx
│       ├── AddressStep.tsx
│       ├── BankingStep.tsx
│       ├── SummaryStep.tsx
│       └── index.ts
│
└── pages/               ← Test-only pages
    └── WizardVariantsDemo.tsx     (Variant comparison page)
```

---

## 🎯 Components

### **Modal3Variants** (Test Component)

**File:** `components/Modal3Variants.tsx`

**Purpose:** Full-featured modal with all 3 variants for testing purposes.

**Variants:**
1. **Centered** (600px, classic modal)
2. **Drawer** (500px, slide from right)
3. **Fullscreen** (100vw/vh, no distraction)

**Usage:**
```typescript
import { Modal3Variants } from '../__tests__/components/Modal3Variants';

<Modal3Variants
  variant="drawer"  // centered | drawer | fullscreen
  isOpen={isOpen}
  onClose={handleClose}
  size="md"
>
  <YourContent />
</Modal3Variants>
```

**⚠️ Note:** Production code uses simplified `Modal` from `@l-kern/ui-components` (centered variant only).

---

## 🧙 Demos

### **ContactFormWizard** (6-Step Demo)

**Folder:** `demos/ContactFormWizard/`

**Purpose:** Complete 6-step wizard demonstrating multi-step form workflow.

**Steps:**
1. **ContactTypeStep** - Contact type selection (Firma/Osoba)
2. **BasicInfoStep** - Basic information (Názov, IČO, DIČ)
3. **ContactDetailsStep** - Contact details (Email, Tel, Web)
4. **AddressStep** - Address information (Ulica, Mesto, PSČ)
5. **BankingStep** - Banking details (IBAN, SWIFT)
6. **SummaryStep** - Review + Notes

**Features:**
- ✅ Multi-step navigation (Next/Previous/Complete)
- ✅ Data accumulation across steps
- ✅ Validation (required fields)
- ✅ Progress indicator (Step 2/6)
- ✅ Conditional fields (IČO/DIČ only for companies)
- ✅ Final summary view

**Usage:**
```typescript
import { ContactFormWizard } from '../__tests__/demos/ContactFormWizard';

<ContactFormWizard
  variant="centered"  // or "drawer" or "fullscreen"
  isOpen={isOpen}
  onClose={handleClose}
  onComplete={(data) => console.log(data)}
/>
```

---

## 📄 Pages

### **WizardVariantsDemo** (Comparison Page)

**File:** `pages/WizardVariantsDemo.tsx`

**URL:** `http://localhost:4201/testing/wizard-demo`

**Purpose:** Side-by-side comparison of all 3 modal variants.

**Features:**
- 3 cards (Centered, Drawer, Fullscreen)
- Button to open each variant
- Same ContactFormWizard in all 3 variants
- Data display after completion

**Use case:** Helps decide which modal variant works best for your use case.

---

## 🔧 Production vs Testing

### **Production Components**

Location: `packages/ui-components/src/components/`

**Modal (Production):**
```typescript
import { Modal } from '@l-kern/ui-components';

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  size="md"  // sm | md | lg
>
  <Content />
</Modal>
// → Always centered, simplified API
```

**Features:**
- ✅ Centered positioning only
- ✅ 3 sizes (sm=400px, md=600px, lg=800px)
- ✅ Portal rendering
- ✅ Focus trap
- ✅ ESC key handler
- ✅ Backdrop click to close
- ✅ Loading state
- ✅ Dark mode support

---

### **Testing Components**

Location: `apps/web-ui/src/__tests__/`

**Modal3Variants (Testing):**
```typescript
import { Modal3Variants } from '../__tests__/components/Modal3Variants';

<Modal3Variants
  variant="drawer"  // centered | drawer | fullscreen
  isOpen={isOpen}
  onClose={handleClose}
>
  <Content />
</Modal3Variants>
// → All 3 variants for testing
```

**Features:**
- ✅ All production Modal features
- ✅ + Drawer variant (500px from right)
- ✅ + Fullscreen variant (100vw/vh)
- ✅ Used only in test pages

---

## 📝 Usage Guidelines

### **When to use Production Modal:**

✅ **Production code** - Always use `Modal` from `@l-kern/ui-components`
✅ **Standard dialogs** - Add contact, edit order, confirm delete
✅ **Consistent UX** - All modals should be centered for uniformity

```typescript
import { Modal } from '@l-kern/ui-components';
```

---

### **When to use Modal3Variants:**

⚠️ **Testing only** - Never use in production pages
✅ **Variant comparison** - Testing which variant feels better
✅ **Development** - Experimenting with drawer/fullscreen UX
✅ **Demos** - Showcasing different modal approaches

```typescript
import { Modal3Variants } from '../__tests__/components/Modal3Variants';
```

---

## 🚀 Accessing Test Pages

### **Development Mode:**

Test pages are available at:

- **Wizard Demo:** `http://localhost:4201/testing/wizard-demo`

**From HomePage:**
Click on "🧙 Wizard Modal Demo [TEST]" card

---

## 🎓 Learning Resources

### **Modal Wizard System:**

**Core Hooks:**
- `useModalWizard` - Multi-step workflow logic (`packages/config/src/hooks/`)
- `useModalContext` - Modal registry + z-index management (`packages/config/src/contexts/`)

**UI Components:**
- `Modal` - Base modal component (production)
- `WizardProgress` - Step indicator (dots/bar/numbers)
- `WizardNavigation` - Previous/Next/Complete buttons

**Example Implementation:**
See `ContactFormWizard.tsx` for complete multi-step wizard example.

---

## 📦 File Sizes

**Test Code (excluded from production):**
- Components: ~400 lines
- Demos: ~600 lines
- Pages: ~200 lines
- **Total:** ~1200 lines (not in production bundle)

**Production Code (included in bundle):**
- Modal: ~250 lines
- WizardProgress: ~120 lines
- WizardNavigation: ~80 lines
- **Total:** ~450 lines

---

## ✅ Conclusion

The `__tests__/` folder keeps test/demo code **separated from production** while still being accessible for development and testing.

**Benefits:**
- ✅ Cleaner production bundle
- ✅ Clear separation of concerns
- ✅ Easy to find test code
- ✅ React conventions (` __tests__/` folder)
- ✅ Still testable and usable during development

---

**Last Updated:** 2025-10-18
**Maintainer:** BOSSystems s.r.o.
