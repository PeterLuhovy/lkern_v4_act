---
id: ui-components
title: '@l-kern/ui-components Package'
sidebar_label: '@l-kern/ui-components'
sidebar_position: 2
---

# @l-kern/ui-components Package Documentation

**Type**: Buildable React Component Library
**Build Tool**: Vite 6 + CSS Modules

---

## 📋 Overview

**@l-kern/ui-components** is L-KERN v4's core UI component library. Built with React 19, TypeScript 5.7, and CSS Modules, it provides production-ready, accessible, and fully tested components.

:::tip Interactive Component Playground
Explore all components interactively in **[Storybook](/storybook/)** - see live examples, test different props, and view documentation.
:::

---

## 🎯 Design Principles

1. **100% Design Token Usage** - All colors, spacing, typography from `@l-kern/config`
2. **Zero Hardcoded Values** - No magic numbers or inline styles
3. **CSS Modules Only** - Clean separation of styles (lesson learned from v3)
4. **Accessibility First** - ARIA attributes, semantic HTML, keyboard navigation
5. **100% Test Coverage** - Every component fully tested with Vitest
6. **TypeScript Strict Mode** - Type safety enforced

---

## 📦 Installation

```bash
# Already installed in L-KERN v4 workspace
yarn add @l-kern/ui-components
```

**Peer Dependencies:**
```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "@l-kern/config": "workspace:*"
}
```

---

## 🚀 Usage

### **Import Components**

```typescript
import { Button, Input, Select, FormField } from '@l-kern/ui-components';

function MyForm() {
  return (
    <form>
      <FormField label="Name" required>
        <Input type="text" placeholder="Enter name" />
      </FormField>

      <FormField label="Country">
        <Select
          options={[
            { value: 'sk', label: 'Slovakia' },
            { value: 'cz', label: 'Czech Republic' }
          ]}
          placeholder="Choose country"
        />
      </FormField>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </form>
  );
}
```

---

## 📚 Available Components

### **Phase 1: Core Form Components** ✅ 100% Complete

| Component | Status | Version | Tests | Description |
|-----------|--------|---------|-------|-------------|
| **Button** | ✅ Done | 1.0.0 | 16/16 | 5 variants, loading, icon support |
| **Input** | ✅ Done | 1.0.0 | 15/15 | Error/helper text, all HTML types |
| **FormField** | ✅ Done | 1.0.0 | 11/11 | Label wrapper with required indicator |
| **Select** | ✅ Done | 1.0.0 | 21/21 | Native select with options array |
| **Checkbox** | ✅ Done | 1.0.0 | 19/19 | Checkbox with indeterminate state |
| **Radio** | ✅ Done | 1.0.0 | 33/33 | Radio button group (vertical/horizontal) |

**Total: 6 components, 115 tests, 100% coverage**

---

### **Phase 2: Layout & Display** ✅ 100% Complete

| Component | Status | Version | Tests | Description |
|-----------|--------|---------|-------|-------------|
| **Card** | ✅ Done | 1.0.0 | 18/18 | 3 variants (default, outlined, elevated) |
| **Badge** | ✅ Done | 1.0.0 | 19/19 | 7 variants (status indicators) |
| **Spinner** | ✅ Done | 1.0.0 | 14/14 | 4 sizes, loading indicator |
| **EmptyState** | ✅ Done | 1.0.0 | 16/16 | Empty state placeholder |

**Total: 4 components, 67 tests, 100% coverage**

---

### **Phase 3: Modal & Wizard System** ⏳ IN PROGRESS

| Component | Status | Version | Tests | Description |
|-----------|--------|---------|-------|-------------|
| **Modal** | ⚠️ Partial | 2.0.0 | 26/26 | Centered variant only (drawer/fullscreen planned) |
| **WizardProgress** | ✅ Done | 1.0.0 | 15/15 | Wizard progress indicator (3 variants) |
| **WizardNavigation** | ✅ Done | 1.0.0 | - | Previous/Next/Complete buttons |

**Total: 3 components, 41+ tests**

**Supporting Infrastructure (@l-kern/config):**
- ✅ `useModal` hook - Basic modal state management
- ✅ `useModalWizard` hook - Multi-step wizard workflow (19 tests)
- ✅ `ModalContext` - Centralized modal registry & z-index management

---

### **Phase 4: Advanced Components** ⏳ PLANNED

- Table/DataGrid (CRITICAL - needed for contacts page)
- FilterAndSearch
- ThemeCustomizer
- DebugBar
- Page Layout Templates

---

## 🧩 Component API Reference

### **Button**

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}
```

**Example:**
```tsx
<Button variant="primary" size="medium" loading>
  Save Changes
</Button>
```

---

### **Input**

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}
```

**Example:**
```tsx
<Input
  type="email"
  placeholder="Enter email"
  error="Invalid email format"
  fullWidth
/>
```

---

### **Select**

```typescript
interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}
```

**Example:**
```tsx
<Select
  options={[
    { value: 'sk', label: 'Slovakia' },
    { value: 'cz', label: 'Czech Republic', disabled: true }
  ]}
  placeholder="Choose country"
  error="Country is required"
/>
```

---

### **FormField**

```typescript
interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  children: React.ReactNode;
}
```

**Example:**
```tsx
<FormField label="Email" required error="Email is required">
  <Input type="email" />
</FormField>
```

---

### **Modal (Base Modal Component)**

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg';
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  loading?: boolean;
  className?: string;
}
```

**Current Status:** Centered variant only (v2.0.0)

**Example:**
```tsx
import { Modal } from '@l-kern/ui-components';
import { useModal } from '@l-kern/config';

function MyComponent() {
  const modal = useModal();

  return (
    <>
      <Button onClick={modal.open}>Open Modal</Button>

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title="Add Contact"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={modal.close}>
              Cancel
            </Button>
            <Button variant="primary" onClick={modal.confirm}>
              Save
            </Button>
          </>
        }
      >
        <p>Modal content here</p>
      </Modal>
    </>
  );
}
```

**Features:**
- ✅ Portal rendering (outside DOM hierarchy)
- ✅ Focus trap (keyboard navigation locked)
- ✅ ESC key handler
- ✅ Backdrop overlay with click-to-close
- ✅ Loading state
- ✅ 3 sizes (sm=400px, md=600px, lg=800px)
- ⏳ Drag & drop (planned from v3)
- ⏳ Nested modals support (ModalContext ready)
- ⏳ Drawer variant (planned)
- ⏳ Fullscreen variant (planned)

---

### **WizardProgress**

```typescript
interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  variant?: 'dots' | 'bar' | 'numbers';
  currentStepTitle?: string;
}
```

**Example:**
```tsx
<WizardProgress
  currentStep={wizard.currentStep}
  totalSteps={wizard.totalSteps}
  variant="dots"
  currentStepTitle={wizard.currentStepTitle}
/>
```

**Variants:**
- `dots` - Visual dots showing progress
- `bar` - Linear progress bar with percentage
- `numbers` - Step counter (e.g., "Step 2/5")

---

### **WizardNavigation**

```typescript
interface WizardNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  onComplete?: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isLastStep: boolean;
  isSubmitting?: boolean;
}
```

**Example:**
```tsx
<WizardNavigation
  onPrevious={wizard.previous}
  onNext={() => wizard.next(stepData)}
  onComplete={() => wizard.complete(stepData)}
  canGoPrevious={wizard.canGoPrevious}
  canGoNext={wizard.canGoNext}
  isLastStep={wizard.isLastStep}
  isSubmitting={wizard.isSubmitting}
/>
```

---

## 🪝 Modal Hooks & Context (@l-kern/config)

### **useModal Hook**

Basic modal state management hook.

```typescript
interface UseModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  confirm: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
}

const modal = useModal({
  onClose?: () => void;
  onConfirm?: () => void | Promise<void>;
  initialOpen?: boolean;
});
```

**Example:**
```tsx
const modal = useModal({
  onConfirm: async () => {
    modal.setIsSubmitting(true);
    try {
      await saveData();
      modal.close();
    } finally {
      modal.setIsSubmitting(false);
    }
  }
});
```

---

### **useModalWizard Hook**

Multi-step wizard workflow management.

```typescript
interface WizardStep {
  id: string;
  title: string;
  validate?: (data: any) => boolean;
  component?: React.ComponentType<any>;
}

const wizard = useModalWizard({
  id: string;
  steps: WizardStep[];
  initialStep?: number;
  onComplete?: (data: Record<string, any>) => void | Promise<void>;
  onCancel?: () => void;
  persistData?: boolean;
});
```

**Example:**
```tsx
const wizard = useModalWizard({
  id: 'add-contact',
  steps: [
    { id: 'type', title: 'Contact Type' },
    { id: 'basic', title: 'Basic Info' },
    { id: 'contact', title: 'Contact Details' },
    { id: 'address', title: 'Address' },
    { id: 'summary', title: 'Review' }
  ],
  onComplete: async (data) => {
    await createContact(data);
  }
});

// Usage
<Button onClick={wizard.start}>Add Contact</Button>

<Modal isOpen={wizard.isOpen} onClose={wizard.cancel} title={wizard.currentStepTitle}>
  <WizardProgress {...wizard} variant="dots" />

  {wizard.currentStepId === 'type' && <TypeStep onNext={(data) => wizard.next(data)} />}
  {wizard.currentStepId === 'basic' && <BasicStep onNext={(data) => wizard.next(data)} />}
  {/* ... other steps ... */}

  <WizardNavigation {...wizard} />
</Modal>
```

**Returns:**
```typescript
{
  // State
  isOpen: boolean;
  currentStep: number;
  totalSteps: number;
  currentStepId: string;
  data: Record<string, any>;
  isSubmitting: boolean;

  // Navigation
  start: () => void;
  next: (stepData?: any) => void;
  previous: () => void;
  jumpTo: (stepIndex: number) => void;
  cancel: () => void;
  complete: (finalStepData?: any) => void;

  // Validation
  canGoNext: boolean;
  canGoPrevious: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;

  // Progress
  progress: number; // 0-100
  currentStepTitle: string;
}
```

---

### **ModalContext**

Centralized modal registry for z-index management and nested modals.

```typescript
import { ModalProvider, useModalContext } from '@l-kern/config';

// Wrap your app
<ModalProvider baseZIndex={1000}>
  <App />
</ModalProvider>

// Use in components
const { openModal, closeModal, getZIndex } = useModalContext();
```

**API:**
```typescript
{
  openModals: string[];
  registerModal: (id: string) => void;
  unregisterModal: (id: string) => void;
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  closeAll: () => void;
  getZIndex: (id: string) => number;
  isModalOpen: (id: string) => boolean;
}
```

**Z-Index Calculation:**
- Base z-index: 1000 (configurable)
- Each modal: `baseZIndex + (stackPosition * 10)`
- Example: First modal = 1000, second modal = 1010, third modal = 1020

---

## 🎨 Design Tokens Integration

All components use design tokens from `@l-kern/config`:

```css
/* Example: Button.module.css */
.button {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-brand-primary);
  font-size: var(--font-size-sm);
  border-radius: var(--border-radius-md);
  transition: var(--animation-duration-fast) var(--animation-timing-ease);
}
```

**Available Design Tokens:**
- `--color-*` (brand, status, priority, neutral)
- `--spacing-*` (xs, sm, md, lg, xl, xxl)
- `--font-size-*` (xs, sm, md, lg, xl)
- `--font-weight-*` (normal, medium, semibold, bold)
- `--border-radius-*` (sm, md, lg, full)
- `--animation-duration-*` (fast, normal, slow)

See: [@l-kern/config documentation](config.md#design-tokens)

---

## 🧪 Testing

### **Run Tests**

```bash
# In Docker (recommended)
docker exec lkms201-web-ui npx nx test ui-components --run

# With coverage
docker exec lkms201-web-ui npx nx test ui-components --coverage
```

### **Test Coverage** (2025-10-18)

- **Total Tests**: 224 (182 UI components + 42 Modal/Wizard)
- **Passing**: 224 (100%)
- **Coverage**: 100%

**Breakdown:**
- Form Components: 115 tests
- Layout Components: 67 tests
- Modal System: 26 tests (Modal)
- Wizard Components: 15 tests (WizardProgress)
- useModalWizard hook: 19 tests

### **Test Structure**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
});
```

See: [testing.md](../getting-started/testing.md) for complete testing guide.

---

## 🏗️ Build Output

```bash
# Build package
npx nx build ui-components
```

**Output:**
```
dist/packages/ui-components/
├── index.mjs          # 27.86 kB (gzip: 6.93 kB)
├── index.css          # 9.24 kB (gzip: 1.88 kB)
├── index.d.ts         # TypeScript definitions
└── README.md
```

---

## 🔧 Configuration

### **vite.config.ts**

```typescript
export default defineConfig({
  plugins: [
    react(),
    nxViteTsPaths(),
    dts({
      entryRoot: 'src',
      tsconfigPath: 'tsconfig.lib.json',
    }),
  ],
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'ui-components',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
});
```

---

## 📂 Project Structure

```
packages/ui-components/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Select/
│   │   └── FormField/
│   ├── types/
│   │   ├── common.ts
│   │   └── css-modules.d.ts
│   ├── utils/
│   │   └── classNames.ts
│   └── index.ts
├── vite.config.ts
├── vitest.setup.ts
├── tsconfig.json
├── tsconfig.lib.json
└── package.json
```

---

## 🚨 Common Issues

### CSS Modules Class Names

CSS Modules generate hashed class names. Don't test for specific classes:

**❌ WRONG:**
```typescript
expect(container.querySelector('.button--primary')).toBeInTheDocument();
```

**✅ CORRECT:**
```typescript
const button = screen.getByRole('button');
expect(button.className).toContain('button');
expect(button.className).toContain('primary');
```

---

## 📚 Related Documentation

- [Testing Guide](../getting-started/testing.md) - How to run tests
- [@l-kern/config](config.md) - Design tokens & constants
- [Coding Standards](../guides/coding-standards.md) - Code conventions
- [Code Examples](../guides/code-examples.md) - Component examples

---

**Maintainer**: BOSSystems s.r.o.
**Project**: L-KERN v4 - Business Operating System Service
