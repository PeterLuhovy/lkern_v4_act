# Task 0.2: @l-kern/ui-components - Implementation Plan

**Version**: 1.0.0
**Created**: 2025-10-15
**Status**: ⏳ Planned
**Project**: L-KERN v4 (BOSS)

---

## 📋 Overview

Vytvorenie **@l-kern/ui-components** package - komplexná UI knižnica s prepoužiteľnými React komponentmi pre L-KERN v4. Komponenty vychádzajú z overeného dizajnu L-KERN v3, s vylepšeniami a modernizáciou.

**Key Decisions:**
- ✅ **CSS Modules** (NIE inline styles - v3 chyba)
- ✅ **Design tokens z @l-kern/config** (existujú, použiť ich)
- ✅ **Postupná implementácia** (komponent po komponente)
- ✅ **TypeScript strict mode**
- ❌ **Storybook NESKÔR** (zatiaľ necháme, nevieme čo to je)

---

## 📁 Mapa súborov - Quick Reference

### **V4 Projekt - Existujúce súbory**

#### **Design Tokens (POUŽIŤ!)**
```
L:\system\lkern_codebase_v4_act\packages\config\src\constants\design-tokens.ts
```
**Obsahuje:**
- COLORS (brand, status, priority, neutral)
- SPACING (8px grid system)
- TYPOGRAPHY (sizes, weights, line-heights)
- LAYOUT (borderRadius, zIndex, maxWidth, breakpoints)
- SHADOWS (elevation system)
- BORDERS (widths, styles)
- ANIMATIONS (durations, timing)
- HOVER_EFFECTS (unified hover system)

#### **Theme System**
```
L:\system\lkern_codebase_v4_act\packages\config\src\theme\ThemeContext.tsx
L:\system\lkern_codebase_v4_act\packages\config\src\theme\types.ts
L:\system\lkern_codebase_v4_act\packages\config\src\theme\index.tsx
```
**Obsahuje:** useTheme() hook, ThemeProvider, light/dark mode

#### **Translations System**
```
L:\system\lkern_codebase_v4_act\packages\config\src\translations\index.tsx
L:\system\lkern_codebase_v4_act\packages\config\src\translations\sk.ts
L:\system\lkern_codebase_v4_act\packages\config\src\translations\en.ts
```
**Obsahuje:** useTranslation() hook, SK/EN preklady

#### **Documentation**
```
L:\system\lkern_codebase_v4_act\docs\programming\coding-standards.md
L:\system\lkern_codebase_v4_act\docs\programming\code-examples.md
L:\system\lkern_codebase_v4_act\docs\ROADMAP.md
L:\system\lkern_codebase_v4_act\docs\PROJECT-OVERVIEW.md
```

---

### **V3 Projekt - Referenčné komponenty**

#### **Modals Package - Form Components**
```
L:\system\lkern_codebase_v3_act\packages\modals\src\components\ModalButton.tsx
L:\system\lkern_codebase_v3_act\packages\modals\src\components\ModalButton.css
L:\system\lkern_codebase_v3_act\packages\modals\src\components\FormComponents.tsx
L:\system\lkern_codebase_v3_act\packages\modals\src\components\ValidatedInput.tsx
```

**ModalButton features:**
- Variants: primary, secondary, danger, ghost, danger-subtle
- Sizes: small, medium, large
- Props: icon, loading, fullWidth, analyticsId
- CSS variables (var(--color-brand-primary))

**FormComponents obsahuje:**
- FormLabel (s required indicator)
- FormInput (s error handling)
- FormSelect (dropdown)
- FormTextarea
- FormCheckbox
- FormFieldWrapper

#### **Page-Templates Package - Display Components**
```
L:\system\lkern_codebase_v3_act\packages\page-templates\src\components\ActionButton\ActionButton.tsx
L:\system\lkern_codebase_v3_act\packages\page-templates\src\components\DataGrid\DataGrid.tsx
L:\system\lkern_codebase_v3_act\packages\page-templates\src\components\DashboardCard\DashboardCard.tsx
L:\system\lkern_codebase_v3_act\packages\page-templates\src\components\StatusBadge\StatusBadge.tsx
L:\system\lkern_codebase_v3_act\packages\page-templates\src\components\EmptyState\EmptyState.tsx
L:\system\lkern_codebase_v3_act\packages\page-templates\src\components\LoadingState\LoadingState.tsx
L:\system\lkern_codebase_v3_act\packages\page-templates\src\components\Pagination\Pagination.tsx
```

**DataGrid features:**
- Sorting (asc/desc)
- Expandable rows
- Row selection (checkboxes)
- Actions column (built-in action buttons)
- Status colors
- Compact mode
- Dark mode support

**ActionButton types:**
- view, edit, delete, add, download, upload, export, import, copy, archive, refresh
- Predefined icons + colors
- Customizable labels

---

## 🎯 Implementation Phases

### **Phase 1: Package Setup**

**1.1 Generate Nx Package**
```bash
cd L:\system\lkern_codebase_v4_act
npx nx generate @nx/react:library ui-components --directory=packages/ui-components --importPath=@l-kern/ui-components
```

**1.2 Package Structure**
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
│   │   └── ... (other components)
│   ├── hooks/
│   │   └── useFormField.ts
│   ├── utils/
│   │   └── classNames.ts
│   ├── types/
│   │   └── common.ts
│   └── index.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

**1.3 Dependencies**
```json
{
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@l-kern/config": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "typescript": "^5.7.2",
    "vite": "^6.0.0",
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0"
  }
}
```

---

### **Phase 2: Base Components (Postupne!)**

#### **2.1 Button Component**

**Reference:** `L:\system\lkern_codebase_v3_act\packages\modals\src\components\ModalButton.tsx`

**Props Interface:**
```typescript
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
```

**CSS Module:**
```css
/* Button.module.css */
.button {
  padding: var(--spacing-sm) var(--spacing-md);
  border: var(--border-width-medium) solid transparent;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--animation-duration-fast) var(--animation-timing-ease);
}

.button--primary {
  background: var(--color-brand-primary);
  color: var(--color-neutral-white);
}

.button--primary:hover {
  background: var(--color-brand-dark);
  box-shadow: var(--shadow-md);
}

/* ... more variants */
```

**Design Tokens Usage:**
- Spacing: `SPACING.sm`, `SPACING.md`
- Colors: `COLORS.brand.primary`, `COLORS.neutral.white`
- Border: `BORDERS.width.medium`, `LAYOUT.borderRadius.md`
- Animation: `ANIMATIONS.duration.fast`

---

#### **2.2 Input Component**

**Reference:** `L:\system\lkern_codebase_v3_act\packages\modals\src\components\FormComponents.tsx` (FormInput)

**Props Interface:**
```typescript
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}
```

**Features:**
- Error state styling
- Helper text
- 2px border (no layout shift on focus)
- Dark/light mode support via useTheme()

---

#### **2.3 FormField Component**

**Wrapper component combining label + input/select + error message**

**Props Interface:**
```typescript
export interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
}
```

**Usage:**
```tsx
<FormField label="Email" required error={errors.email}>
  <Input type="email" {...register('email')} />
</FormField>
```

---

#### **2.4 Select Component**

**Reference:** `L:\system\lkern_codebase_v3_act\packages\modals\src\components\FormComponents.tsx` (FormSelect)

**Props Interface:**
```typescript
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options: Array<{ value: string | number; label: string }>;
  placeholder?: string;
}
```

---

#### **2.5 Checkbox Component**

**NEW - Nebol v v3, vytvoriť od základu**

**Props Interface:**
```typescript
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}
```

---

#### **2.6 Radio Component**

**NEW - Nebol v v3, vytvoriť od základu**

**Props Interface:**
```typescript
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export interface RadioGroupProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  error?: string;
}
```

---

### **Phase 3: Layout & Display Components**

#### **3.1 Card Component**

**Reference:** `L:\system\lkern_codebase_v3_act\packages\page-templates\src\components\DashboardCard\DashboardCard.tsx`

**Props Interface:**
```typescript
export interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  padding?: 'none' | 'small' | 'medium' | 'large';
  elevation?: 'none' | 'sm' | 'md' | 'lg';
}
```

---

#### **3.2 Badge Component**

**Reference:** `L:\system\lkern_codebase_v3_act\packages\page-templates\src\components\StatusBadge\StatusBadge.tsx`

**Props Interface:**
```typescript
export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';
export type BadgeSize = 'small' | 'medium' | 'large';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  dot?: boolean;
}
```

---

#### **3.3 Spinner Component**

**Reference:** `L:\system\lkern_codebase_v3_act\packages\modals\src\components\ModalButton.tsx` (loading state)

**Props Interface:**
```typescript
export type SpinnerSize = 'small' | 'medium' | 'large';

export interface SpinnerProps {
  size?: SpinnerSize;
  color?: string;
}
```

---

#### **3.4 EmptyState Component**

**Reference:** `L:\system\lkern_codebase_v3_act\packages\page-templates\src\components\EmptyState\EmptyState.tsx`

**Props Interface:**
```typescript
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

---

### **Phase 4: Advanced Components**

#### **4.1 Modal Component**

**Reference:** `L:\system\lkern_codebase_v3_act\packages\modals\src\components\ModalBaseTemplate.tsx`

**Props Interface:**
```typescript
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}
```

**Features:**
- Overlay (backdrop)
- z-index: 1000
- Focus trap
- Escape key handling
- Portal rendering (document.body)

---

#### **4.2 Table/DataGrid Component**

**Reference:** `L:\system\lkern_codebase_v3_act\packages\page-templates\src\components\DataGrid\DataGrid.tsx`

**KOMPLEXNÝ KOMPONENT - IMPLEMENTOVAŤ AKO POSLEDNÝ!**

**Props Interface:**
```typescript
export interface Column<T = any> {
  title: string;
  field: string;
  sortable?: boolean;
  width?: number;
  flex?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  expandedRows?: Set<string>;
  onRowToggle?: (rowId: string) => void;
  renderExpandedContent?: (row: T) => React.ReactNode;
  getRowId?: (row: T) => string;
  selectedRows?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
  enableSelection?: boolean;
  compactMode?: boolean;
  actions?: TableAction<T>[];
}
```

**Features:**
- Sorting (asc/desc, ikona ▲▼)
- Expandable rows
- Row selection (checkboxes)
- Actions column
- Compact mode
- Dark mode

---

## 🎨 Design System Integration

### **CSS Variables Strategy**

**Global CSS (vygenerované z design-tokens.ts):**
```css
:root {
  /* Colors */
  --color-brand-primary: #9c27b0;
  --color-brand-secondary: #3366cc;
  --color-status-success: #4CAF50;
  --color-status-error: #f44336;
  --color-neutral-white: #ffffff;
  --color-neutral-gray300: #e0e0e0;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;

  /* Typography */
  --font-size-xs: 10px;
  --font-size-sm: 12px;
  --font-size-md: 14px;
  --font-size-lg: 16px;
  --font-weight-normal: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Layout */
  --border-radius-sm: 4px;
  --border-radius-md: 6px;
  --border-radius-lg: 8px;
  --border-width-thin: 1px;
  --border-width-medium: 2px;

  /* Shadows */
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

  /* Animation */
  --animation-duration-fast: 150ms;
  --animation-duration-normal: 200ms;
  --animation-timing-ease: ease;
}
```

### **Component CSS Module Example**

```css
/* Button.module.css */
.button {
  /* Use CSS variables from design-tokens */
  padding: var(--spacing-sm) var(--spacing-md);
  border: var(--border-width-medium) solid transparent;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  transition: all var(--animation-duration-fast) var(--animation-timing-ease);
  cursor: pointer;
}

.button--primary {
  background: var(--color-brand-primary);
  color: var(--color-neutral-white);
}

.button--primary:hover {
  background: var(--color-brand-dark);
  box-shadow: var(--shadow-md);
}

.button--secondary {
  background: transparent;
  color: var(--color-brand-primary);
  border-color: var(--color-brand-primary);
}

.button--danger {
  background: var(--color-status-error);
  color: var(--color-neutral-white);
}

.button--small {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.button--large {
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: var(--font-size-lg);
}

.button--fullWidth {
  width: 100%;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

## 🧪 Testing Strategy

### **Component Testing (Vitest + React Testing Library)**

```typescript
// Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies primary variant styles', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button--primary');
  });

  it('disables button when loading', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
```

---

## 📊 Implementation Checklist

### **Phase 1: Setup** ✅ Priorita 1
- [ ] Generate @l-kern/ui-components package with Nx
- [ ] Setup TypeScript config
- [ ] Setup Vite config
- [ ] Setup Vitest for testing
- [ ] Create folder structure (components/, hooks/, utils/, types/)
- [ ] Setup CSS Modules
- [ ] Install dependencies (@l-kern/config, react, react-dom)
- [ ] Create package exports in index.ts

### **Phase 2: Core Components** ✅ Priorita 2
- [ ] **Button**
  - [ ] Component implementation
  - [ ] CSS Module (variants, sizes)
  - [ ] Tests
  - [ ] Export from index
- [ ] **Input**
  - [ ] Component implementation
  - [ ] CSS Module (error state, focus)
  - [ ] Tests
  - [ ] Export from index
- [ ] **Select**
  - [ ] Component implementation
  - [ ] CSS Module
  - [ ] Tests
  - [ ] Export from index
- [ ] **FormField**
  - [ ] Component implementation (wrapper)
  - [ ] CSS Module
  - [ ] Tests
  - [ ] Export from index
- [ ] **Checkbox**
  - [ ] Component implementation
  - [ ] CSS Module (custom checkbox design)
  - [ ] Tests
  - [ ] Export from index
- [ ] **Radio**
  - [ ] Component implementation
  - [ ] RadioGroup component
  - [ ] CSS Module
  - [ ] Tests
  - [ ] Export from index

### **Phase 3: Layout Components** ✅ Priorita 3
- [ ] **Card**
  - [ ] Component implementation
  - [ ] CSS Module (elevation, padding)
  - [ ] Tests
  - [ ] Export from index
- [ ] **Badge**
  - [ ] Component implementation
  - [ ] CSS Module (variants, sizes)
  - [ ] Tests
  - [ ] Export from index
- [ ] **Spinner**
  - [ ] Component implementation
  - [ ] CSS Module (animation)
  - [ ] Tests
  - [ ] Export from index
- [ ] **EmptyState**
  - [ ] Component implementation
  - [ ] CSS Module
  - [ ] Tests
  - [ ] Export from index

### **Phase 4: Advanced Components** ✅ Priorita 4
- [ ] **Modal**
  - [ ] Component implementation
  - [ ] Portal rendering
  - [ ] Focus trap
  - [ ] Overlay click handling
  - [ ] Escape key handling
  - [ ] CSS Module (overlay, sizes)
  - [ ] Tests
  - [ ] Export from index
- [ ] **Table/DataGrid** (NAJKOMPLEXNEJŠÍ!)
  - [ ] Component implementation
  - [ ] Sorting logic
  - [ ] Expandable rows
  - [ ] Row selection
  - [ ] Actions column
  - [ ] CSS Module (responsive, dark mode)
  - [ ] Tests
  - [ ] Export from index

### **Phase 5: Integration & Documentation** ✅ Priorita 5
- [ ] Test all components in web-ui app
- [ ] Write component usage documentation
- [ ] Create component showcase page
- [ ] Update ROADMAP.md (mark Task 0.2 as DONE)
- [ ] Update PROJECT-OVERVIEW.md
- [ ] Git commit with all components

---

## 🔗 Quick Links

**V4 Project Files:**
- Design Tokens: [design-tokens.ts](L:\system\lkern_codebase_v4_act\packages\config\src\constants\design-tokens.ts)
- Theme System: [ThemeContext.tsx](L:\system\lkern_codebase_v4_act\packages\config\src\theme\ThemeContext.tsx)
- Translations: [index.tsx](L:\system\lkern_codebase_v4_act\packages\config\src\translations\index.tsx)
- Coding Standards: [coding-standards.md](L:\system\lkern_codebase_v4_act\docs\programming\coding-standards.md)
- Code Examples: [code-examples.md](L:\system\lkern_codebase_v4_act\docs\programming\code-examples.md)

**V3 Reference Components:**
- ModalButton: [ModalButton.tsx](L:\system\lkern_codebase_v3_act\packages\modals\src\components\ModalButton.tsx)
- FormComponents: [FormComponents.tsx](L:\system\lkern_codebase_v3_act\packages\modals\src\components\FormComponents.tsx)
- DataGrid: [DataGrid.tsx](L:\system\lkern_codebase_v3_act\packages\page-templates\src\components\DataGrid\DataGrid.tsx)
- ActionButton: [ActionButton.tsx](L:\system\lkern_codebase_v3_act\packages\page-templates\src\components\ActionButton\ActionButton.tsx)

**Roadmap:**
- [ROADMAP.md](L:\system\lkern_codebase_v4_act\docs\ROADMAP.md) - Task 0.2 definition

---

## 📝 Notes for Future Implementation

**When starting Task 0.2, load these files first:**

```
L:\system\lkern_codebase_v4_act\docs\temp\task-0.2-ui-components-plan.md (THIS FILE)
L:\system\lkern_codebase_v4_act\packages\config\src\constants\design-tokens.ts
L:\system\lkern_codebase_v4_act\docs\programming\coding-standards.md
L:\system\lkern_codebase_v3_act\packages\modals\src\components\ModalButton.tsx
L:\system\lkern_codebase_v3_act\packages\modals\src\components\FormComponents.tsx
```

**Command to start:**
```bash
cd L:\system\lkern_codebase_v4_act
npx nx generate @nx/react:library ui-components --directory=packages/ui-components --importPath=@l-kern/ui-components
```

**Implementation order:**
1. Setup package → 2. Button → 3. Input → 4. FormField → 5. Select → 6. Checkbox → 7. Radio → 8. Card → 9. Badge → 10. Spinner → 11. EmptyState → 12. Modal → 13. Table

---

**Last Updated**: 2025-10-15 17:30:00
**Maintainer**: BOSSystems s.r.o.
**Project**: L-KERN v4 (BOSS)
