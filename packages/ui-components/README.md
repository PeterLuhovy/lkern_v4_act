# @l-kern/ui-components

**Version**: 0.0.1
**Status**: 🚧 In Development

L-KERN v4 UI Component Library - Reusable React components with TypeScript, CSS Modules, and design token integration.

---

## 📚 Documentation

Full documentation: [docs/packages/ui-components.md](../../docs/packages/ui-components.md) (coming soon)

---

## 🚀 Quick Start

### Installation

This package is part of the L-KERN v4 monorepo and uses Yarn workspaces.

```bash
# Already available in the monorepo
import { Button } from '@l-kern/ui-components';
```

### Usage Example

```tsx
import { Button } from '@l-kern/ui-components';

function MyComponent() {
  return (
    <Button variant="primary" size="medium" onClick={() => alert('Clicked!')}>
      Click Me
    </Button>
  );
}
```

---

## 📦 Available Components

**Phase 1: Core Components** (Planned)
- `Button` - Button with variants (primary, secondary, danger, ghost, success)
- `Input` - Text input with error handling
- `Select` - Dropdown select
- `FormField` - Wrapper for form inputs with label and error
- `Checkbox` - Checkbox input
- `Radio` - Radio button and RadioGroup

**Phase 2: Layout & Display** (Planned)
- `Card` - Card container
- `Badge` - Status badge
- `Spinner` - Loading spinner
- `EmptyState` - Empty state placeholder

**Phase 3: Advanced** (Planned)
- `Modal` - Modal dialog
- `Table` - Data table with sorting and selection

---

## 🎨 Design System

Components use design tokens from `@l-kern/config`:

```tsx
// CSS Modules automatically use design tokens
import styles from './Button.module.css';

// CSS:
.button {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-brand-primary);
  border-radius: var(--border-radius-md);
}
```

---

## 🧪 Testing

```bash
# Run unit tests
nx test ui-components

# Run tests in watch mode
nx test ui-components --watch

# Run tests with coverage
nx test ui-components --coverage
```

---

## 🏗️ Development

### Building

```bash
nx build ui-components
```

### Project Structure

```
src/
├── components/     # React components
│   └── Button/
│       ├── Button.tsx
│       ├── Button.module.css
│       ├── Button.test.tsx
│       └── index.ts
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
│   └── classNames.ts
├── types/          # TypeScript types
│   ├── common.ts
│   └── css-modules.d.ts
└── index.ts        # Main exports
```

---

## 📋 Dependencies

**Peer Dependencies** (must be installed in consuming project):
- `react`: ^19.0.0
- `react-dom`: ^19.0.0
- `@l-kern/config`: workspace:*

---

**Project**: L-KERN v4 (BOSS)
**Maintainer**: BOSSystems s.r.o.
**Last Updated**: 2025-10-18
