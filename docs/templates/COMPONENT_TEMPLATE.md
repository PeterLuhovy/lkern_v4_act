# ================================================================
# <ComponentName>
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\components\<ComponentName>.md
# Version: 1.0.0
# Created: YYYY-MM-DD
# Updated: YYYY-MM-DD
# Component Location: packages/ui-components/src/components/<ComponentName>/<ComponentName>.tsx
# Package: @l-kern/ui-components
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Brief 1-2 sentence description of what this component does.
# ================================================================

---

## Overview

**Purpose**: One-sentence description of primary purpose
**Package**: @l-kern/ui-components
**Path**: packages/ui-components/src/components/<ComponentName>
**Since**: v1.0.0

Brief 2-3 sentence overview of what component does and primary use case.

---

## Features

- ✅ Feature 1 (be specific: e.g., "5 variants: primary, secondary, danger, success, ghost")
- ✅ Feature 2 (e.g., "Loading state with spinner")
- ✅ Feature 3 (e.g., "Keyboard accessible - Enter, Space, ESC")
- ✅ Feature 4 (e.g., "ARIA compliant - aria-busy, aria-label")
- ✅ Feature 5 (e.g., "Fully responsive - mobile, tablet, desktop")

---

## Quick Start

### Basic Usage

```tsx
import { ComponentName } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';

function MyPage() {
  const { t } = useTranslation();

  return (
    <ComponentName
      variant="primary"
      onClick={handleClick}
    >
      {t('common.save')}
    </ComponentName>
  );
}
```

### Common Patterns

#### Pattern 1: [Pattern Name]
```tsx
// Example code showing common usage pattern
```

#### Pattern 2: [Pattern Name]
```tsx
// Example code showing another common pattern
```

---

## Props API

### ComponentNameProps

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | `ComponentVariant` | `'default'` | No | Visual style variant (primary, secondary, etc.) |
| `size` | `ComponentSize` | `'md'` | No | Size preset (sm, md, lg) |
| `disabled` | `boolean` | `false` | No | Disables interaction |
| `children` | `ReactNode` | - | Yes | Content to display |
| `onClick` | `() => void` | - | No | Click handler |

### Type Definitions

```typescript
type ComponentVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
type ComponentSize = 'sm' | 'md' | 'lg';

interface ComponentNameProps {
  variant?: ComponentVariant;
  size?: ComponentSize;
  disabled?: boolean;
  children: ReactNode;
  onClick?: () => void;
}
```

---

## Visual Design

### Variants

**primary** - [Description of primary variant]
- Background: [Color with hex]
- Text: [Color with hex]
- Use: [When to use this variant]

**secondary** - [Description]
- Background: [Color]
- Text: [Color]
- Use: [When to use]

[... document all variants ...]

### Sizes

**sm** - Small (mobile, compact UIs)
- Height: [value]px
- Padding: [value]px [value]px
- Font: [value]px

**md** - Medium (default)
- Height: [value]px
- Padding: [value]px [value]px
- Font: [value]px

**lg** - Large (hero CTAs)
- Height: [value]px
- Padding: [value]px [value]px
- Font: [value]px

---

## Behavior

### Interaction States

**Default** - Normal state
- Cursor: pointer
- Hover: [What changes on hover]
- Active: [What changes on click]

**Disabled** - Cannot interact
- Cursor: not-allowed
- Opacity: 0.5
- Events: Blocked

**Loading** (if applicable)
- Spinner: Visible
- Text: Grayed out
- Events: Blocked
- ARIA: aria-busy="true"

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Enter` | [What happens] |
| `Space` | [What happens] |
| `Tab` | Focus next element |
| `Shift+Tab` | Focus previous element |
| `ESC` | [What happens (if applicable)] |

---

## Accessibility

### WCAG Compliance
- ✅ **WCAG 2.1 Level AA** compliant
- ✅ Keyboard navigable (Enter, Space)
- ✅ Screen reader support (ARIA labels)
- ✅ Color contrast ratio ≥ 4.5:1
- ✅ Focus visible (2px outline)

### ARIA Attributes

```tsx
<div
  role="[role]"
  aria-label={[label]}
  aria-busy={[boolean]}
  aria-disabled={[boolean]}
  tabIndex={[number]}
>
  {children}
</div>
```

### Screen Reader Behavior

- **Normal**: "[What screen reader says]"
- **Loading**: "[What screen reader says when loading]"
- **Disabled**: "[What screen reader says when disabled]"

---

## Responsive Design

### Breakpoints

**Mobile** (< 768px)
- [What changes on mobile]

**Tablet** (768px - 1023px)
- [What changes on tablet]

**Desktop** (≥ 1024px)
- [What happens on desktop]

### Layout Behavior

```tsx
// Mobile example
<ComponentName fullWidth />

// Desktop example
<ComponentName />
```

---

## Styling

### CSS Variables Used

```css
/* Colors */
--color-brand-primary
--theme-text

/* Spacing */
--spacing-md

/* Shadows */
--shadow-md
```

### Custom Styling

**Via className prop:**
```tsx
<ComponentName className="my-custom-class" />
```

**Via CSS Modules:**
```css
.myCustomComponent {
  composes: componentName from '@l-kern/ui-components/ComponentName.module.css';
  /* Override styles */
}
```

---

## Known Issues

### Active Issues

**No known issues** ✅

*(Or list issues if any exist)*

**Issue #1**: [Short title]
- **Severity**: Low | Medium | High | Critical
- **Affects**: [Which props/variants]
- **Workaround**: [Temporary solution if any]
- **Tracking**: Task #123
- **Status**: Open | In Progress | Planned

### Fixed Issues

See [Changelog](#changelog) section below.

---

## Testing

### Test Coverage
- ✅ **Unit Tests**: [count] tests
- ✅ **Coverage**: [percentage]% (statements, branches, functions, lines)
- ✅ **Accessibility Tests**: [count] tests (keyboard, ARIA, focus)
- ✅ **Translation Tests**: [count] tests (SK/EN switching)
- ✅ **Responsive Tests**: [count] tests (mobile, desktop)

### Test File
`packages/ui-components/src/components/<ComponentName>/<ComponentName>.test.tsx`

### Running Tests
```bash
# Run component tests
docker exec lkms201-web-ui npx nx test ui-components --testFile=ComponentName.test.tsx

# Run with coverage
docker exec lkms201-web-ui npx nx test ui-components --coverage
```

### Key Test Cases

**Rendering:**
- ✅ Renders with default props
- ✅ Renders all variants
- ✅ Renders all sizes

**Interaction:**
- ✅ [Test case description]
- ✅ [Test case description]

**States:**
- ✅ [Test case description]

**Accessibility:**
- ✅ ARIA attributes present
- ✅ Keyboard navigation works
- ✅ Screen reader text correct

**Translation:**
- ✅ Text changes when language switches (SK ↔ EN)
- ✅ No hardcoded text in component

---

## Related Components

- **[RelatedComponent](RelatedComponent.md)** - Brief description of relationship

---

## Usage Examples

### Example 1: [Basic Usage]
```tsx
import { ComponentName } from '@l-kern/ui-components';

function Example1() {
  // Example code
  return <ComponentName />;
}
```

### Example 2: [Intermediate Usage]
```tsx
// More complex example
```

### Example 3: [Advanced Usage]
```tsx
// Advanced example with edge cases
```

---

## Performance

### Bundle Size
- **JS**: [size] KB (gzipped)
- **CSS**: [size] KB (gzipped)
- **Total**: [size] KB

### Runtime Performance
- **Render time**: [time]ms (average)
- **Re-renders**: [Optimization notes]
- **Memory**: [Memory usage per instance]

### Optimization Tips
- ✅ [Tip 1]
- ✅ [Tip 2]

---

## Migration Guide

### From v3 to v4

**Breaking Changes:**
1. [Change description]
2. [Change description]

**Migration Example:**
```tsx
// v3
<OldComponent prop="value" />

// v4
<ComponentName newProp="value" />
```

---

## Changelog

### v1.0.0 (YYYY-MM-DD)
- 🎉 Initial release
- ✅ [Feature 1]
- ✅ [Feature 2]
- ✅ [X] unit tests ([Y]% coverage)

---

## Contributing

### Adding New Variant

1. Add variant to `ComponentVariant` type
2. Create CSS class in `ComponentName.module.css`
3. Update this documentation (Features, Props, Visual Design)
4. Add tests for new variant
5. Update translation keys if needed

### Reporting Issues

1. Check [Known Issues](#known-issues) first
2. Create task in project management
3. Add issue to this documentation under "Known Issues"
4. Link task number

---

## Resources

### Internal Links
- [Coding Standards](../programming/coding-standards.md)
- [Design System](../design/component-design-system.md)
- [Testing Guide](../programming/testing-overview.md)

### External References
- [React 19 Documentation](https://react.dev)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

---

**Last Updated**: YYYY-MM-DD
**Maintainer**: BOSSystems s.r.o.
**Documentation Version**: 1.0.0
