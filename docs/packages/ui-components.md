# ================================================================
# @l-kern/ui-components Package Documentation
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\packages\ui-components.md
# Version: 0.0.1
# Created: 2025-10-18
# Updated: 2025-10-18
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Complete documentation for @l-kern/ui-components package with
#   React 19 components, CSS Modules, design tokens, and 100% test coverage.
# ================================================================

**Type**: Buildable React Component Library
**Build Tool**: Vite 6 + CSS Modules

---

## 📋 Overview

**@l-kern/ui-components** is L-KERN v4's core UI component library. Built with React 19, TypeScript 5.7, and CSS Modules, it provides production-ready, accessible, and fully tested components.

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

### **Phase 1: Core Form Components** (67% complete)

| Component | Status | Version | Tests | Description |
|-----------|--------|---------|-------|-------------|
| **Button** | ✅ Done | 1.0.0 | 16/16 | 5 variants, loading, icon support |
| **Input** | ✅ Done | 1.0.0 | 15/15 | Error/helper text, all HTML types |
| **FormField** | ✅ Done | 1.0.0 | 11/11 | Label wrapper with required indicator |
| **Select** | ✅ Done | 1.0.0 | 21/21 | Native select with options array |
| **Checkbox** | ⏳ TODO | - | - | Checkbox with indeterminate state |
| **Radio** | ⏳ TODO | - | - | Radio button group |

### **Phase 2: Layout & Display** (Planned)

- Card
- Badge
- Spinner
- EmptyState

### **Phase 3: Advanced Components** (Planned)

- Modal/Dialog
- Table/DataGrid
- Tabs
- Accordion

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

- **Total Tests**: 63
- **Passing**: 63 (100%)
- **Coverage**: ~95%

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

See: [testing.md](../testing.md) for complete testing guide.

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

- [Testing Guide](../testing.md) - How to run tests
- [@l-kern/config](config.md) - Design tokens & constants
- [Coding Standards](../programming/coding-standards.md) - Code conventions
- [Code Examples](../programming/code-examples.md) - Component examples

---

**Maintainer**: BOSSystems s.r.o.
**Project**: L-KERN v4 - Business Operating System Service
