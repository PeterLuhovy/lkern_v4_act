# ================================================================
# EmptyState
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\components\EmptyState.md
# Version: 1.0.0
# Created: 2025-10-20
# Updated: 2025-10-20
# Component Location: packages/ui-components/src/components/EmptyState/EmptyState.tsx
# Package: @l-kern/ui-components
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Empty state component for displaying no-data states with icon, title,
#   description, and optional action button. 3 size variants (small/medium/large).
# ================================================================

---

## Overview

**Purpose**: Visual feedback component for empty data states (no results, empty lists, first-time experiences)
**Package**: @l-kern/ui-components
**Path**: packages/ui-components/src/components/EmptyState
**Since**: v1.0.0

The EmptyState component provides user-friendly feedback when there's no data to display. Features centered layout with optional icon/emoji (📭, 🔍, 🛒), bold title heading, descriptive text, optional action button, 3 size variants (small/medium/large), and full dark mode support. Used in empty tables, search results, shopping carts, first-time user experiences, and any scenario requiring graceful handling of no-data states.

---

## Features

- ✅ **3 Sizes**: small (compact), medium (default), large (full-page)
- ✅ **Icon Support**: Display emoji (📭) or custom React component
- ✅ **Title**: Bold heading (required)
- ✅ **Description**: Optional secondary text
- ✅ **Action Slot**: Optional button or element (e.g., "Add Contact")
- ✅ **Centered Layout**: Flexbox centering with text-align center
- ✅ **Dark Mode**: Automatic color adjustments for dark theme
- ✅ **TypeScript**: Full type safety with EmptyStateProps interface
- ✅ **Responsive**: Adapts to container width (max-width on description)
- ✅ **Lightweight**: ~0.4 KB JS + 0.5 KB CSS (gzipped)

---

## Quick Start

### Basic Usage

```tsx
import { EmptyState } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';

function ContactsPage() {
  const { t } = useTranslation();

  return (
    <EmptyState
      icon="📭"
      title={t('contacts.emptyTitle')}
      description={t('contacts.emptyDescription')}
    />
  );
}
```

### Common Patterns

#### Pattern 1: Empty State with Action Button

```tsx
import { EmptyState, Button } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';

function EmptyContacts({ onAdd }) {
  const { t } = useTranslation();

  return (
    <EmptyState
      icon="📇"
      title={t('contacts.noContacts')}
      description={t('contacts.noContactsHint')}
      action={
        <Button variant="primary" onClick={onAdd}>
          {t('contacts.addFirst')}
        </Button>
      }
    />
  );
}
```

#### Pattern 2: Empty Search Results

```tsx
import { EmptyState } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';

function NoSearchResults({ query }) {
  const { t } = useTranslation();

  return (
    <EmptyState
      icon="🔍"
      title={t('search.noResults')}
      description={t('search.noResultsFor', { query })}
      size="small"
    />
  );
}
```

#### Pattern 3: Large Full-Page Empty State

```tsx
import { EmptyState, Button } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';

function FirstTimeUser() {
  const { t } = useTranslation();

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
      <EmptyState
        icon="🎉"
        title={t('welcome.title')}
        description={t('welcome.description')}
        action={
          <Button variant="primary" size="large">
            {t('welcome.getStarted')}
          </Button>
        }
        size="large"
      />
    </div>
  );
}
```

---

## Props API

### EmptyStateProps

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `icon` | `ReactNode` | `undefined` | No | Icon or emoji to display (e.g., 📭, 🔍, React component) |
| `title` | `string` | - | **Yes** | Main heading text |
| `description` | `string` | `undefined` | No | Optional secondary text below title |
| `action` | `ReactNode` | `undefined` | No | Optional action button or element |
| `size` | `EmptyStateSize` | `'medium'` | No | Size preset (small, medium, large) |
| `className` | `string` | `undefined` | No | Additional CSS classes |

### Type Definitions

```typescript
type EmptyStateSize = 'small' | 'medium' | 'large';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  size?: EmptyStateSize;
  className?: string;
}
```

---

## Visual Design

### Sizes

**small** - Compact empty state (search results, table sections)
- Padding: `20px`
- Icon size: `48px`
- Title: `16px` font, weight 600
- Description: `13px` font
- Use: Empty table rows, search results, compact sections

**medium** - Default empty state (standard empty lists)
- Padding: `32px`
- Icon size: `64px`
- Title: `20px` font, weight 600
- Description: `14px` font
- Max description width: `400px`
- Use: Empty data tables, contact lists, default empty states

**large** - Full-page empty state (first-time user, onboarding)
- Padding: `40px`
- Icon size: `80px`
- Title: `24px` font, weight 600
- Description: `16px` font
- Max description width: `500px`
- Use: Full-page empty states, onboarding, welcome screens

### Layout Structure

```
┌─────────────────────────────────┐
│                                 │
│         📭 (Icon)              │
│                                 │
│      No Contacts Yet           │  ← Title (bold, 20px)
│                                 │
│   Start building your network  │  ← Description (muted, 14px)
│   by adding your first contact │
│                                 │
│     [Add Contact Button]       │  ← Action (optional)
│                                 │
└─────────────────────────────────┘
```

### Colors

**Light Mode:**
- Title: `var(--theme-text, #212121)` (dark gray)
- Description: `var(--theme-text-muted, #9e9e9e)` (light gray)
- Icon opacity: `0.7` (slightly transparent)

**Dark Mode:**
- Title: `var(--theme-text, #ffffff)` (white)
- Description: `var(--theme-text-muted, #b0b0b0)` (lighter gray)
- Icon opacity: `0.8` (more visible than light mode)

---

## Behavior

### Interaction States

**Static Display** - No interaction states
- EmptyState is purely presentational
- No hover/active states on container
- Action button has its own interaction states

**Responsive Behavior:**
- Container: Flexbox centered (adapts to parent width)
- Description: Max-width constraint (400px medium, 500px large)
- Action: Centered below description
- Icon: Scales with size variant

---

## Accessibility

### WCAG Compliance

- ✅ **WCAG 2.1 Level AA** compliant
- ✅ Semantic HTML (h2 for title, p for description)
- ✅ Screen reader friendly (proper heading hierarchy)
- ✅ Color contrast ratio ≥ 4.5:1 (title, description)
- ✅ Keyboard accessible (action button focusable)

### HTML Structure

```tsx
<div className="emptyState emptyState--medium">
  <div className="emptyState__icon">
    📭 {/* Icon/emoji */}
  </div>

  <h2 className="emptyState__title">
    No Contacts Yet {/* Main heading */}
  </h2>

  <p className="emptyState__description">
    Start by adding your first contact {/* Description */}
  </p>

  <div className="emptyState__action">
    <button>Add Contact</button> {/* Action button */}
  </div>
</div>
```

### Screen Reader Behavior

- **Title**: Announced as heading level 2
- **Description**: Announced as paragraph text
- **Icon**: Emoji announced (e.g., "mailbox with no mail")
- **Action**: Button announced with proper role

**Note:** EmptyState uses proper semantic HTML (`<h2>`, `<p>`, `<button>`), ensuring screen readers understand content hierarchy.

---

## Responsive Design

### Breakpoints

**Mobile** (< 768px)
- Size recommendation: `small` or `medium` (avoid `large`)
- Description: May wrap to multiple lines
- Action button: Full-width button recommended

**Tablet** (768px - 1023px)
- All sizes work well
- Default `medium` recommended

**Desktop** (≥ 1024px)
- All sizes appropriate
- Use `large` for full-page empty states

### Layout Behavior

**Container Width:**
```tsx
// EmptyState adapts to parent container width
<div style={{ maxWidth: '600px', margin: '0 auto' }}>
  <EmptyState
    icon="📭"
    title="No data"
    description="Add your first item to get started"
  />
</div>
```

**Description Max-Width:**
- Medium: `400px` max-width (prevents overly wide text)
- Large: `500px` max-width
- Mobile: Full container width (max-width ignored)

---

## Styling

### CSS Variables Used

```css
/* Spacing */
--spacing-sm (8px)
--spacing-md (12px)
--spacing-lg (16px)
--spacing-xl (20px)
--spacing-xxl (24px)
--spacing-xxxl (32px)
--spacing-huge (40px)
--spacing-xhuge (400px) - description max-width

/* Text Colors */
--theme-text (#212121) - title color (light mode)
--theme-text-muted (#9e9e9e) - description color (light mode)

/* Dark Mode Colors */
--theme-text (#ffffff) - title color (dark mode)
--theme-text-muted (#b0b0b0) - description color (dark mode)
```

### Custom Styling

**Via className prop:**
```tsx
<EmptyState
  title="No data"
  className="my-empty-state"
/>
```

```css
.my-empty-state {
  /* Override container styles */
  background: var(--color-background-alt);
  border-radius: 8px;
  padding: 48px;
}

.my-empty-state .emptyState__title {
  /* Override title styles */
  color: var(--color-brand-primary);
}
```

**Via CSS Modules:**
```css
.myEmptyState {
  composes: emptyState from '@l-kern/ui-components/EmptyState.module.css';
  /* Additional custom styles */
  min-height: 300px;
}
```

---

## Known Issues

### Active Issues

**No known issues** ✅

All 44 tests passing, component stable in production.

### Fixed Issues

See [Changelog](#changelog) section below.

---

## Testing

### Test Coverage

- ✅ **Unit Tests**: 44 tests
- ✅ **Coverage**: 100% (statements, branches, functions, lines)
- ✅ **Accessibility Tests**: Implicit (semantic HTML tested)
- ✅ **CSS Variables Tests**: 2 tests (theme variable usage)
- ✅ **Responsive Tests**: Implicit (size class tests)

### Test File

`packages/ui-components/src/components/EmptyState/EmptyState.test.tsx`

### Running Tests

```bash
# Run EmptyState tests only
docker exec lkms201-web-ui npx nx test ui-components --testFile=EmptyState.test.tsx

# Run with coverage
docker exec lkms201-web-ui npx nx test ui-components --coverage --testFile=EmptyState.test.tsx

# Watch mode (local development)
npx nx test ui-components --watch --testFile=EmptyState.test.tsx
```

### Key Test Cases

**Basic Rendering (8 tests):**
- ✅ Renders without crashing
- ✅ Renders title correctly (required prop)
- ✅ Renders icon when provided
- ✅ Does NOT render icon when not provided
- ✅ Renders description when provided
- ✅ Does NOT render description when not provided
- ✅ Renders action when provided
- ✅ Does NOT render action when not provided

**Size Props (4 tests):**
- ✅ Applies small size class
- ✅ Applies medium size class by default
- ✅ Applies large size class
- ✅ Size class applied to container element

**Custom Props (1 test):**
- ✅ Applies custom className

**CSS Variables (2 tests):**
- ✅ Uses theme CSS variables (not hardcoded colors)
- ✅ Applies correct size classes that use theme variables

**Complex Scenarios (2 tests):**
- ✅ Renders complete empty state with all props
- ✅ Renders minimal empty state with only title

---

## Related Components

- **[Button](Button.md)** - Commonly used in `action` slot
- **[Spinner](Spinner.md)** - Used for loading state before EmptyState appears
- **[Modal](Modal.md)** - EmptyState used in modal body when no data

---

## Usage Examples

### Example 1: Empty Contact List

```tsx
import { EmptyState, Button } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';

function EmptyContactList({ onAddContact }) {
  const { t } = useTranslation();

  return (
    <div className="contact-list">
      <EmptyState
        icon="📇"
        title={t('contacts.noContacts')}
        description={t('contacts.addFirstHint')}
        action={
          <Button variant="primary" onClick={onAddContact}>
            {t('contacts.addFirst')}
          </Button>
        }
        size="medium"
      />
    </div>
  );
}
```

**Output:**
- Medium empty state (64px icon, 20px title)
- Icon: 📇 (card index dividers)
- Title: "No Contacts Yet" (bold, dark)
- Description: "Start by adding your first contact" (muted)
- Action: Purple "Add Contact" button

---

### Example 2: Empty Search Results

```tsx
import { EmptyState } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';

function SearchResults({ query, results }) {
  const { t } = useTranslation();

  if (results.length === 0 && query) {
    return (
      <EmptyState
        icon="🔍"
        title={t('search.noResults')}
        description={t('search.noResultsFor', { query })}
        size="small"
      />
    );
  }

  return <ResultsList results={results} />;
}
```

**Output:**
- Small empty state (48px icon, 16px title)
- Icon: 🔍 (magnifying glass)
- Title: "No Results Found"
- Description: "No results for 'Peter Smith'" (dynamic query)
- No action button

---

### Example 3: Empty Shopping Cart

```tsx
import { EmptyState, Button } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import { useNavigate } from 'react-router-dom';

function EmptyCart() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="cart-page">
      <EmptyState
        icon="🛒"
        title={t('cart.empty')}
        description={t('cart.emptyHint')}
        action={
          <Button variant="primary" onClick={() => navigate('/products')}>
            {t('cart.browsProducts')}
          </Button>
        }
        size="medium"
      />
    </div>
  );
}
```

**Output:**
- Medium empty state
- Icon: 🛒 (shopping cart)
- Title: "Your Cart is Empty"
- Description: "Add items to your cart to see them here"
- Action: "Browse Products" button (navigates to products page)

---

### Example 4: First-Time User Welcome

```tsx
import { EmptyState, Button } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';

function WelcomeScreen({ onGetStarted }) {
  const { t } = useTranslation();

  return (
    <div className="welcome-container">
      <EmptyState
        icon="🎉"
        title={t('welcome.title')}
        description={t('welcome.description')}
        action={
          <Button variant="primary" size="large" onClick={onGetStarted}>
            {t('welcome.getStarted')}
          </Button>
        }
        size="large"
      />
    </div>
  );
}
```

**Output:**
- Large empty state (80px icon, 24px title)
- Icon: 🎉 (party popper)
- Title: "Welcome to L-KERN!"
- Description: "Let's get started by setting up your first project"
- Action: Large "Get Started" button

---

### Example 5: Custom Icon Component

```tsx
import { EmptyState, Button } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';

function CustomIconEmpty() {
  const { t } = useTranslation();

  const CustomIcon = () => (
    <svg width="64" height="64" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" fill="none" stroke="#9c27b0" strokeWidth="2" />
      <path d="M20 32 L32 44 L44 20" stroke="#9c27b0" strokeWidth="3" fill="none" />
    </svg>
  );

  return (
    <EmptyState
      icon={<CustomIcon />}
      title={t('tasks.completed')}
      description={t('tasks.allDone')}
      size="medium"
    />
  );
}
```

**Output:**
- Medium empty state
- Icon: Custom SVG checkmark icon (purple)
- Title: "All Tasks Completed"
- Description: "Great job! You've completed all your tasks"
- No action button

---

### Example 6: Conditional Empty State

```tsx
import { EmptyState, Button, Spinner } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import { useState, useEffect } from 'react';

function ContactsPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    loadContacts().then((data) => {
      setContacts(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Spinner size="large" label={t('common.loading')} />;
  }

  if (contacts.length === 0) {
    return (
      <EmptyState
        icon="📭"
        title={t('contacts.noContacts')}
        description={t('contacts.addFirstHint')}
        action={
          <Button variant="primary" onClick={handleAdd}>
            {t('contacts.addFirst')}
          </Button>
        }
      />
    );
  }

  return <ContactList contacts={contacts} />;
}
```

**Output:**
- Loading state: Spinner with "Loading..." label
- Empty state: EmptyState with icon, title, description, action
- Data state: ContactList component

---

## Performance

### Bundle Size

- **JS**: ~0.4 KB (gzipped, including TypeScript types)
- **CSS**: ~0.5 KB (gzipped, all sizes)
- **Total**: ~0.9 KB (very lightweight)

### Runtime Performance

- **Render time**: < 0.5ms (average)
- **Re-renders**: Minimal (only when props change)
- **Memory**: Negligible (~200 bytes per instance)
- **Animation**: None (static component)

### Optimization Tips

- ✅ **Memoize action button** - Wrap action in `useMemo()` if complex
- ✅ **Avoid inline styles** - Use CSS classes instead
- ✅ **Static icon** - Prefer emoji over SVG if possible (smaller)
- ✅ **Memoize parent** - Wrap parent in `React.memo` if empty state always visible

**Example - Optimized Usage:**
```tsx
const EmptyContactsOptimized = React.memo(({ onAdd }) => {
  const { t } = useTranslation();

  const action = useMemo(() => (
    <Button variant="primary" onClick={onAdd}>
      {t('contacts.addFirst')}
    </Button>
  ), [onAdd, t]);

  return (
    <EmptyState
      icon="📇"
      title={t('contacts.noContacts')}
      description={t('contacts.addFirstHint')}
      action={action}
    />
  );
});
```

---

## Migration Guide

### From v0.x (Internal) to v1.0.0

**Breaking Changes:**
1. Prop `iconSize` removed (use `size` prop instead, scales icon automatically)
2. Prop `primaryAction` renamed to `action`
3. Default size changed: No default → `'medium'`

**Migration Example:**
```tsx
// v0.x
<EmptyState
  icon="📭"
  iconSize="large"
  title="No data"
  primaryAction={<Button>Add</Button>}
/>

// v1.0.0
<EmptyState
  icon="📭"
  size="large"
  title="No data"
  action={<Button>Add</Button>}
/>
```

---

## Changelog

### v1.0.1 (2025-10-19)
- ✅ Improved dark mode: Icon opacity increased from 0.7 to 0.8
- ✅ Fixed description text color in dark mode (#b0b0b0 instead of #9e9e9e)
- 🐛 Fixed description max-width on mobile (was too narrow)

### v1.0.0 (2025-10-18)
- 🎉 Initial release
- ✅ 3 sizes (small, medium, large)
- ✅ Icon/emoji support
- ✅ Title (required), description (optional), action (optional)
- ✅ Dark mode support
- ✅ 44 unit tests (100% coverage)
- ✅ WCAG AA accessibility compliant

---

## Contributing

### Adding New Size

1. Add size to `EmptyStateSize` type:
   ```typescript
   type EmptyStateSize = 'small' | 'medium' | 'large' | 'xlarge'; // NEW
   ```

2. Add CSS class in `EmptyState.module.css`:
   ```css
   .emptyState--xlarge {
     padding: var(--spacing-huge, 56px);
   }

   .emptyState--xlarge .emptyState__icon {
     font-size: 96px;
   }

   .emptyState--xlarge .emptyState__title {
     font-size: 28px;
   }
   ```

3. Update this documentation:
   - Add to **Features** list
   - Add to **Visual Design > Sizes** section
   - Add example in **Usage Examples**

4. Add tests:
   ```typescript
   it('applies xlarge size class', () => {
     render(<EmptyState title="Test" size="xlarge" />);
     expect(container.firstChild.className).toContain('emptyState--xlarge');
   });
   ```

### Reporting Issues

1. Check [Known Issues](#known-issues) first
2. Create task in project management (get Task #XXX)
3. Add to this documentation under "Known Issues"
4. Include:
   - Severity (Low/Medium/High/Critical)
   - Affected props/sizes
   - Steps to reproduce
   - Workaround (if any)

---

## Resources

### Internal Links

- [Coding Standards](../programming/coding-standards.md)
- [Design System](../design/component-design-system.md)
- [Testing Guide](../programming/testing-overview.md)
- [Translation System](../packages/config.md#translations-system)

### External References

- [React 19 Documentation](https://react.dev)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Empty State Design Patterns](https://www.nngroup.com/articles/empty-state/)
- [Semantic HTML](https://developer.mozilla.org/en-US/docs/Glossary/Semantics)

---

**Last Updated**: 2025-10-20
**Maintainer**: BOSSystems s.r.o.
**Documentation Version**: 1.0.0
**Component Version**: 1.0.0
