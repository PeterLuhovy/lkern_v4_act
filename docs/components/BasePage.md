# ================================================================
# BasePage
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\components\BasePage.md
# Version: 3.0.0
# Created: 2025-10-19
# Updated: 2025-10-20
# Component Location: packages/ui-components/src/components/BasePage/BasePage.tsx
# Package: @l-kern/ui-components
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Base page wrapper component with global keyboard shortcuts and analytics.
#   Provides Ctrl+D (theme toggle), Ctrl+L (language toggle), and DebugBar integration.
# ================================================================

---

## Overview

**Purpose**: Global page wrapper with keyboard shortcuts, analytics tracking, and debug bar
**Package**: @l-kern/ui-components
**Path**: packages/ui-components/src/components/BasePage
**Since**: v2.0.0 (v3.0.0 hybrid keyboard handling)

BasePage is the foundation wrapper for all pages in L-KERN v4. It provides global keyboard shortcuts (Ctrl+D for theme toggle, Ctrl+L for language toggle), analytics tracking (clicks, keyboard events, session duration), and an optional DebugBar for development. Version 3.0.0 introduced hybrid keyboard handling where ESC/Enter are handled by Modal component directly, ensuring better separation of concerns.

---

## Features

- ✅ **Global Keyboard Shortcuts**: Ctrl+D (theme), Ctrl+L (language)
- ✅ **Analytics Tracking**: Clicks, keyboard events, session duration, activity metrics
- ✅ **Debug Bar Integration**: Fixed debug bar at top with real-time metrics
- ✅ **Session Lifecycle**: Automatic session start/end on mount/unmount
- ✅ **Modal Detection**: Disables page tracking when modal is open (modal priority)
- ✅ **Input Protection**: Shortcuts disabled when typing in input/textarea/select
- ✅ **Custom Handlers**: Optional onKeyDown prop for page-specific shortcuts
- ✅ **Hybrid Keyboard Handling**: ESC/Enter handled by Modal component (v3.0.0+)
- ✅ **Mouse Tracking**: Tracks mousedown/mouseup events with element metadata
- ✅ **Capture Phase Listeners**: Uses capture phase for better event control
- ✅ **TypeScript**: Full type safety with BasePageProps interface

---

## Quick Start

### Basic Usage

```tsx
import { BasePage } from '@l-kern/ui-components';

function MyPage() {
  return (
    <BasePage pageName="orders" showDebugBar={true}>
      <h1>Orders Page</h1>
      <p>Global shortcuts: Ctrl+D (theme), Ctrl+L (language)</p>
    </BasePage>
  );
}
```

### Common Patterns

#### Pattern 1: Production Page (No Debug Bar)
```tsx
import { BasePage } from '@l-kern/ui-components';

function ProductionPage() {
  return (
    <BasePage pageName="dashboard" showDebugBar={false}>
      <h1>Dashboard</h1>
      {/* Page content */}
    </BasePage>
  );
}
```

#### Pattern 2: Custom Keyboard Handler
```tsx
import { BasePage } from '@l-kern/ui-components';

function OrdersPage() {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Custom shortcut: Ctrl+S to save
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      saveOrder();
      return true; // Prevent BasePage handler
    }
    return false; // Allow BasePage handlers
  };

  return (
    <BasePage pageName="orders" onKeyDown={handleKeyDown}>
      <h1>Orders</h1>
      <p>Press Ctrl+S to save</p>
    </BasePage>
  );
}
```

#### Pattern 3: With Modal (Hybrid Keyboard Handling)
```tsx
import { BasePage } from '@l-kern/ui-components';
import { Modal } from '@l-kern/ui-components';

function PageWithModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <BasePage pageName="page-with-modal">
      <h1>Page Content</h1>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

      {/* Modal handles ESC/Enter internally (v3.0.0+) */}
      <Modal
        modalId="my-modal"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleSave}
      >
        Modal content
      </Modal>
    </BasePage>
  );
}
```

---

## Props API

### BasePageProps

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `children` | `ReactNode` | - | **Yes** | Page content to wrap |
| `onKeyDown` | `(e: KeyboardEvent) => boolean \| void` | `undefined` | No | Custom keyboard handler (return true to prevent BasePage handler) |
| `className` | `string` | `undefined` | No | Additional CSS classes for wrapper |
| `pageName` | `string` | `'page'` | No | Page identifier for analytics tracking |
| `showDebugBar` | `boolean` | `true` | No | Show/hide fixed debug bar at top |

### Type Definitions

```typescript
export interface BasePageProps {
  children: React.ReactNode;
  onKeyDown?: (e: KeyboardEvent) => boolean | void;
  className?: string;
  pageName?: string;
  showDebugBar?: boolean;
}
```

---

## Keyboard Shortcuts

### Global Shortcuts (Always Active)

| Shortcut | Action | Notes |
|----------|--------|-------|
| `Ctrl+D` | Toggle theme (light ↔ dark) | Uses useTheme().toggleTheme() |
| `Ctrl+L` | Toggle language (SK ↔ EN) | Uses useTranslation().setLanguage() |

### Disabled Contexts

Shortcuts are **disabled** when:
- ✅ User is typing in `<input>` field
- ✅ User is typing in `<textarea>` field
- ✅ User is focused on `<select>` dropdown
- ✅ User is editing `contentEditable` element

### Modal Interaction (v3.0.0+)

**Important:** ESC and Enter keys are now handled by Modal component directly, NOT by BasePage.

```tsx
// BEFORE v3.0.0 (BasePage handled ESC/Enter)
<BasePage>
  <Modal isOpen={true} />  // ESC handled by BasePage
</BasePage>

// AFTER v3.0.0 (Modal handles ESC/Enter)
<BasePage>
  <Modal isOpen={true} />  // ESC handled by Modal internally
</BasePage>
```

This ensures better separation of concerns and allows modals to work independently of BasePage wrapper.

---

## Analytics Tracking

### Session Lifecycle

```tsx
// Automatic session management
<BasePage pageName="orders" showDebugBar={true}>
  {/* Session starts on mount */}
  {/* Session ends on unmount with reason: 'navigated' */}
</BasePage>
```

**Session Events:**
- `startSession()` - Called on component mount (useEffect)
- `endSession('navigated')` - Called on component unmount (cleanup)

### Tracked Events

**Keyboard Events:**
- **What**: Both keydown AND keyup events (for detecting Shift selection)
- **When**: Only tracked when NO modal is open
- **Data**: Key name, modifier keys (Ctrl, Shift, Alt), timestamp

**Mouse Events:**
- **What**: mousedown AND mouseup events
- **When**: Only tracked when NO modal is open
- **Data**: Element type (tagName), element ID/className, click position, timestamp

**Session Metrics:**
- Total session time (formatted as "0.0s", "1.5m", "2.3h")
- Time since last activity
- Total clicks
- Total keyboard events
- Average time between clicks

### Modal Priority

When a modal is open:
- ✅ Page analytics are paused (modalStack.getTopmostModalId() !== undefined)
- ✅ Modal tracks its own analytics independently
- ✅ Page shortcuts (Ctrl+D, Ctrl+L) still work
- ✅ ESC/Enter handled by Modal (not BasePage)

---

## Debug Bar

### Features

**Fixed Position:**
- Always visible at top of viewport (position: fixed)
- z-index: 9999 (above all content)
- Page content padded by 48px to prevent overlap

**Real-Time Metrics:**
- Session duration
- Click count
- Keyboard event count
- Time since last activity
- Average time between clicks

**Context Type:**
- Shows "page" context (vs "modal" context)
- Modal name = page name (e.g., "orders", "dashboard")

### Usage

```tsx
// Enable debug bar (development)
<BasePage pageName="orders" showDebugBar={true}>
  {/* Debug bar visible at top */}
</BasePage>

// Disable debug bar (production)
<BasePage pageName="orders" showDebugBar={false}>
  {/* No debug bar, no analytics overhead */}
</BasePage>
```

---

## Behavior

### Keyboard Event Flow

```
1. User presses Ctrl+D
2. BasePage captures in capture phase (document listener)
3. Check: Is target an input/textarea/select? → NO
4. Check: Custom handler returns true? → NO
5. Execute: toggleTheme()
6. Event: preventDefault() called
```

### Custom Handler Priority

```tsx
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === 's') {
    savePage();
    return true; // BLOCK BasePage handler
  }
  return false; // ALLOW BasePage handlers
};

<BasePage onKeyDown={handleKeyDown}>
  {/* Ctrl+S → savePage() (custom handler) */}
  {/* Ctrl+D → toggleTheme() (BasePage handler) */}
</BasePage>
```

### Event Listener Lifecycle

```tsx
// Mount
useEffect(() => {
  document.addEventListener('keydown', handler, true);  // Capture phase
  document.addEventListener('keyup', handler, true);    // Capture phase
  document.addEventListener('mousedown', handler, true);
  document.addEventListener('mouseup', handler, true);

  return () => {
    // Unmount - cleanup
    document.removeEventListener('keydown', handler, true);
    document.removeEventListener('keyup', handler, true);
    // ... etc
  };
}, [dependencies]);
```

---

## Accessibility

### WCAG Compliance
- ✅ **WCAG 2.1 Level AA** compliant
- ✅ Keyboard shortcuts respect input focus (no interference)
- ✅ Screen reader compatible (no interference with page content)
- ✅ Focus management unaffected (BasePage is transparent wrapper)
- ✅ Semantic HTML (uses `<div>` wrapper with data attribute)

### Keyboard Navigation

**Standard Navigation:**
- Tab / Shift+Tab: Navigate through page content (unaffected by BasePage)
- Enter / Space: Activate focused element (unaffected by BasePage)

**Global Shortcuts:**
- Ctrl+D: Toggle theme (works globally, except in input fields)
- Ctrl+L: Toggle language (works globally, except in input fields)

---

## Responsive Design

### Breakpoints

BasePage itself has NO responsive breakpoints—it's a transparent wrapper.

**Debug Bar Responsiveness:**
- Mobile (< 768px): Same as desktop (48px height)
- Tablet (768px - 1023px): Same as desktop
- Desktop (≥ 1024px): 48px height

### Layout Behavior

```tsx
<BasePage showDebugBar={true}>
  {/* Content automatically padded by 48px from top */}
  <div>Page content here</div>
</BasePage>

// Rendered HTML:
<div data-component="base-page">
  <div style={{ position: 'fixed', top: 0, zIndex: 9999 }}>
    <DebugBar />
  </div>
  <div style={{ paddingTop: '48px' }}>
    {children}
  </div>
</div>
```

---

## Styling

### CSS Variables Used

```css
/* BasePage uses NO direct CSS variables */
/* Styling comes from child components (DebugBar, etc.) */
```

### Custom Styling

**Via className prop:**
```tsx
<BasePage className="custom-page-wrapper">
  <h1>Content</h1>
</BasePage>
```

**CSS:**
```css
.custom-page-wrapper {
  background: var(--theme-background);
  min-height: 100vh;
}
```

---

## Known Issues

### Active Issues

**No known issues** ✅

### Version History Notes

**v3.0.0 Changes:**
- ✅ Removed ESC/Enter handling from BasePage
- ✅ Modal component now handles ESC/Enter internally
- ✅ Better separation of concerns
- ✅ Fixed: Enter key now works correctly in modals

**v2.1.0 Changes:**
- ✅ Fixed: Enter key behavior when modal is open

**v2.0.0 Changes:**
- ✅ Initial version with keyboard shortcuts

---

## Testing

### Test Coverage
- ✅ **Unit Tests**: 48 tests
- ✅ **Coverage**: 100% (statements, branches, functions, lines)
- ✅ **Keyboard Tests**: 15 tests (shortcuts, input protection, custom handlers)
- ✅ **Rendering Tests**: 8 tests (children, className, data attributes)
- ✅ **Language Tests**: 4 tests (toggle behavior)
- ✅ **Event Cleanup Tests**: 3 tests (unmount cleanup)

### Test File
`packages/ui-components/src/components/BasePage/BasePage.test.tsx`

### Running Tests
```bash
# Run component tests
docker exec lkms201-web-ui npx nx test ui-components --testFile=BasePage.test.tsx

# Run with coverage
docker exec lkms201-web-ui npx nx test ui-components --coverage --testFile=BasePage.test.tsx

# Watch mode
docker exec lkms201-web-ui npx nx test ui-components --watch --testFile=BasePage.test.tsx
```

### Key Test Cases

**Rendering:**
- ✅ Renders children
- ✅ Applies custom className
- ✅ Has data-component="base-page" attribute

**Global Keyboard Shortcuts:**
- ✅ Ctrl+D toggles theme
- ✅ Ctrl+L toggles language (SK ↔ EN)
- ✅ Shortcuts disabled when typing in input
- ✅ Shortcuts disabled when typing in textarea
- ✅ Shortcuts disabled when typing in select

**Custom Keyboard Handler:**
- ✅ Calls custom onKeyDown handler
- ✅ Prevents default handler when custom returns true
- ✅ Allows default handler when custom returns false/void

**Event Listener Cleanup:**
- ✅ Removes event listeners on unmount

**Language Toggling:**
- ✅ Toggles from SK to EN
- ✅ Toggles from EN to SK

---

## Related Components

- **[DebugBar](DebugBar.md)** - Debug bar component integrated into BasePage
- **[Modal](Modal.md)** - Modal component with independent keyboard handling (v3.0.0+)
- **useTheme hook** - Theme management hook from @l-kern/config
- **useTranslation hook** - Translation hook from @l-kern/config
- **usePageAnalytics hook** - Analytics tracking hook from @l-kern/config

---

## Usage Examples

### Example 1: Simple Page
```tsx
import { BasePage } from '@l-kern/ui-components';

function SimplePage() {
  return (
    <BasePage pageName="simple" showDebugBar={true}>
      <h1>Simple Page</h1>
      <p>Try pressing Ctrl+D to toggle theme!</p>
    </BasePage>
  );
}
```

### Example 2: Page with Custom Shortcuts
```tsx
import { BasePage } from '@l-kern/ui-components';
import { useState } from 'react';

function OrdersPage() {
  const [orders, setOrders] = useState([]);

  const handleKeyDown = (e: KeyboardEvent) => {
    // Ctrl+S: Save orders
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      saveOrders(orders);
      return true; // Block BasePage handler
    }

    // Ctrl+N: New order
    if (e.ctrlKey && e.key === 'n') {
      e.preventDefault();
      createNewOrder();
      return true;
    }

    return false; // Allow BasePage handlers (Ctrl+D, Ctrl+L)
  };

  return (
    <BasePage pageName="orders" onKeyDown={handleKeyDown}>
      <h1>Orders</h1>
      <p>Shortcuts: Ctrl+S (save), Ctrl+N (new), Ctrl+D (theme), Ctrl+L (language)</p>
      <OrderList orders={orders} />
    </BasePage>
  );
}
```

### Example 3: Production Page (No Debug Bar)
```tsx
import { BasePage } from '@l-kern/ui-components';

function DashboardPage() {
  return (
    <BasePage pageName="dashboard" showDebugBar={false}>
      {/* No debug bar, no analytics overhead */}
      <h1>Dashboard</h1>
      <DashboardStats />
    </BasePage>
  );
}
```

### Example 4: Page with Modal (v3.0.0+)
```tsx
import { BasePage } from '@l-kern/ui-components';
import { Modal } from '@l-kern/ui-components';
import { useState } from 'react';

function ContactsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <BasePage pageName="contacts">
      <h1>Contacts</h1>
      <Button onClick={() => setIsModalOpen(true)}>Add Contact</Button>

      {/* Modal handles ESC/Enter internally (v3.0.0+) */}
      <Modal
        modalId="add-contact"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleAddContact}
      >
        <ContactForm />
      </Modal>

      {/* Page shortcuts (Ctrl+D, Ctrl+L) still work when modal is open */}
    </BasePage>
  );
}
```

---

## Performance

### Bundle Size
- **JS**: ~3.5 KB (gzipped) - includes hooks imports
- **CSS**: ~0 KB (no CSS file)
- **Total**: ~3.5 KB

### Runtime Performance
- **Render time**: < 2ms (average) - lightweight wrapper
- **Re-renders**: Minimal (only when dependencies change)
- **Memory**: ~2 KB per instance (includes analytics session)

### Optimization Tips
- ✅ Disable debug bar in production (`showDebugBar={false}`)
- ✅ Use `pageName` prop for analytics segmentation
- ✅ Custom handlers should return early to avoid unnecessary checks
- ✅ Memoize custom keyboard handlers if they depend on state

```tsx
// Optimized custom handler with useCallback
import { useCallback } from 'react';

function OptimizedPage() {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      savePage();
      return true;
    }
    return false;
  }, []); // No dependencies, handler never changes

  return (
    <BasePage pageName="optimized" onKeyDown={handleKeyDown}>
      <PageContent />
    </BasePage>
  );
}
```

---

## Migration Guide

### From v2.x to v3.0.0

**Breaking Changes:**
1. ESC and Enter keys no longer handled by BasePage
2. Modal component now handles ESC/Enter internally

**Migration Steps:**

```tsx
// BEFORE v3.0.0
<BasePage>
  <Modal isOpen={true} onClose={close} />
  {/* ESC handled by BasePage → calls modal's onClose */}
</BasePage>

// AFTER v3.0.0
<BasePage>
  <Modal isOpen={true} onClose={close} />
  {/* ESC handled by Modal internally */}
</BasePage>

// No code changes required - Modal handles it automatically!
```

**Benefits:**
- ✅ Better separation of concerns
- ✅ Modals work independently of BasePage
- ✅ Enter key works correctly in modal forms

---

## Changelog

### v3.0.0 (2025-10-19)
- 🎉 Hybrid keyboard handling - removed ESC/Enter from BasePage
- ✅ Modal component now handles ESC/Enter internally
- ✅ Better separation of concerns
- ✅ 48 unit tests (100% coverage)

### v2.1.0 (2025-10-19)
- ✅ Fixed Enter key behavior when modal is open
- ✅ Always preventDefault when modal open

### v2.0.0 (2025-10-19)
- 🎉 Initial release with keyboard shortcuts
- ✅ Ctrl+D (theme toggle)
- ✅ Ctrl+L (language toggle)
- ✅ Analytics integration
- ✅ DebugBar integration

---

## Contributing

### Adding New Global Shortcut

1. Add shortcut to keyboard handler in BasePage.tsx
2. Document in this file under "Keyboard Shortcuts" section
3. Add test case in BasePage.test.tsx
4. Update examples with new shortcut

Example:
```tsx
// 1. Add to handler
if (e.ctrlKey && e.key === 'h') {
  e.preventDefault();
  showHelp();
}

// 2. Document
| `Ctrl+H` | Show help dialog | Uses showHelp() |

// 3. Test
it('should show help on Ctrl+H', async () => {
  // Test implementation
});
```

### Reporting Issues

1. Check [Known Issues](#known-issues) first
2. Create task in project management
3. Add issue to this documentation under "Known Issues"
4. Link task number

---

## Resources

### Internal Links
- [DebugBar Component](DebugBar.md)
- [Modal Component](Modal.md)
- [Coding Standards](../programming/coding-standards.md)
- [Analytics System](../architecture/analytics-system.md)

### External References
- [KeyboardEvent MDN](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)
- [Event Capture Phase](https://javascript.info/bubbling-and-capturing)
- [React useEffect Hook](https://react.dev/reference/react/useEffect)

---

**Last Updated**: 2025-10-20
**Maintainer**: BOSSystems s.r.o.
**Documentation Version**: 3.0.0
