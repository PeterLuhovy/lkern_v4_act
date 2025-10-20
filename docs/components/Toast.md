# ================================================================
# Toast
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\components\Toast.md
# Version: 1.0.0
# Created: 2025-10-20
# Updated: 2025-10-20
# Component Location: packages/ui-components/src/components/Toast/Toast.tsx
# Package: @l-kern/ui-components
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Single toast notification component with fade-in/out animations, 4 type variants
#   (success/error/warning/info), icon indicators, optional copied content display,
#   and close button.
# ================================================================

---

## Overview

**Purpose**: Individual toast notification card for user feedback (success, error, warning, info messages)
**Package**: @l-kern/ui-components
**Path**: packages/ui-components/src/components/Toast
**Since**: v1.0.0

The Toast component displays a single notification message with colored background, icon indicator, message text, optional copied content preview, and close button. Features 4 type variants (success ✓, error ✕, warning ⚠, info ℹ), smooth fade-in/out animations (300ms), auto-dismissal support, ARIA live regions for accessibility, and responsive mobile layout. Used within ToastContainer to display notification queues in fixed positions (top/bottom, left/center/right).

---

## Features

- ✅ **4 Type Variants**: success (green), error (red), warning (orange), info (blue)
- ✅ **Icon Indicators**: ✓ (success), ✕ (error), ⚠ (warning), ℹ (info)
- ✅ **Smooth Animations**: 300ms fade-in/out with slide-up effect
- ✅ **Close Button**: Optional X button with hover states
- ✅ **Copied Content**: Optional monospace preview text (e.g., "Copied: abc123")
- ✅ **Accessibility**: ARIA role="alert", aria-live="polite" for screen readers
- ✅ **Responsive**: Adapts width and padding for mobile devices
- ✅ **Dark Mode Ready**: Uses theme CSS variables (auto-adapts)
- ✅ **TypeScript**: Full type safety with ToastProps interface
- ✅ **Lightweight**: ~0.6 KB JS + 0.8 KB CSS (gzipped)

---

## Quick Start

### Basic Usage

```tsx
import { Toast } from '@l-kern/ui-components';
import type { Toast as ToastType } from '@l-kern/config';

function MyToastDemo() {
  const toast: ToastType = {
    id: '1',
    message: 'Contact saved successfully!',
    type: 'success',
  };

  const handleClose = (id: string) => {
    console.log('Toast closed:', id);
  };

  return <Toast toast={toast} onClose={handleClose} />;
}
```

### Common Patterns

#### Pattern 1: Toast with ToastContext (Recommended)

```tsx
import { useToast } from '@l-kern/config';
import { Button } from '@l-kern/ui-components';

function SaveButton() {
  const { showToast } = useToast();

  const handleSave = () => {
    // ... save logic ...
    showToast({
      message: 'Contact saved!',
      type: 'success',
      duration: 3000,
    });
  };

  return <Button onClick={handleSave}>Save</Button>;
}
```

#### Pattern 2: Error Toast with Copied Content

```tsx
import { useToast } from '@l-kern/config';

function ErrorHandler({ error }) {
  const { showToast } = useToast();

  const handleError = () => {
    showToast({
      message: 'Error occurred. ID copied to clipboard.',
      type: 'error',
      copiedContent: error.id,
      duration: 5000,
    });
  };

  return <button onClick={handleError}>Trigger Error</button>;
}
```

#### Pattern 3: Manual Toast (No Auto-Dismiss)

```tsx
import { Toast } from '@l-kern/ui-components';
import type { Toast as ToastType } from '@l-kern/config';
import { useState } from 'react';

function ManualToast() {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const addToast = () => {
    setToasts([...toasts, {
      id: Date.now().toString(),
      message: 'Manual toast - close manually',
      type: 'info',
    }]);
  };

  const handleClose = (id: string) => {
    setToasts(toasts.filter(t => t.id !== id));
  };

  return (
    <div>
      <button onClick={addToast}>Show Toast</button>
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={handleClose} />
      ))}
    </div>
  );
}
```

---

## Props API

### ToastProps

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `toast` | `ToastType` | - | **Yes** | Toast data object (id, message, type, copiedContent) |
| `onClose` | `(id: string) => void` | `undefined` | No | Callback when toast close button clicked |

### Toast Type (from @l-kern/config)

```typescript
interface Toast {
  id: string;                   // Unique toast identifier
  message: string;              // Main notification text
  type?: 'success' | 'error' | 'warning' | 'info';  // Toast variant (default: 'success')
  copiedContent?: string;       // Optional copied text preview
  duration?: number;            // Auto-dismiss duration in ms (handled by ToastContext)
  position?: ToastPosition;     // Toast position (handled by ToastContainer)
}

type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
```

---

## Visual Design

### Type Variants

**success** (Green) - Positive actions (saved, created, updated)
- Background: `var(--color-status-success, #4CAF50)` (green)
- Icon: ✓ (checkmark)
- Border: 2px solid green
- Use: Successful operations, confirmations

**error** (Red) - Errors and failures
- Background: `var(--color-status-error, #f44336)` (red)
- Icon: ✕ (cross)
- Border: 2px solid red
- Use: Errors, failed operations, validation failures

**warning** (Orange) - Warnings and cautions
- Background: `var(--color-status-warning, #FF9800)` (orange)
- Icon: ⚠ (warning triangle)
- Border: 2px solid orange
- Use: Warnings, cautions, non-critical issues

**info** (Blue) - Informational messages
- Background: `var(--color-status-info, #2196F3)` (blue)
- Icon: ℹ (info circle)
- Border: 2px solid blue
- Use: Information, tips, neutral notifications

### Layout Structure

```
┌─────────────────────────────────────────────┐
│  ✓  Contact saved successfully!        ×   │
│                                             │
│     Copied: peter@example.com              │ ← Optional copied content
└─────────────────────────────────────────────┘
    ↑              ↑                       ↑
  Icon         Message                  Close
```

### Dimensions

- **Width**: 300px min, 500px max (adapts to content)
- **Height**: Auto (based on message + copied content)
- **Padding**: 12px vertical, 16px horizontal
- **Gap**: 12px between icon/message/close button
- **Border-radius**: 8px
- **Box-shadow**: `0 4px 12px rgba(0, 0, 0, 0.15)`

### Animation

**Fade-In** (initial appearance):
- Delay: 10ms (immediate after render)
- Duration: 300ms ease-in-out
- Transform: `translateY(20px)` → `translateY(0)` (slide up)
- Opacity: 0 → 1

**Fade-Out** (on close):
- Duration: 300ms ease-in-out
- Transform: `translateY(0)` → `translateY(20px)` (slide down)
- Opacity: 1 → 0
- Callback: `onClose(id)` fired after animation completes

---

## Behavior

### Interaction States

**Default** - Toast visible
- Animation: Faded in, slide-up complete
- Close button: Visible (if onClose provided)
- Cursor: Default (no clickable area except close button)

**Hover (Close Button)** - Mouse over close button
- Background: `rgba(255, 255, 255, 0.2)` (semi-transparent white)
- Opacity: `1` (from 0.7)
- Cursor: pointer

**Focus (Close Button)** - Close button focused
- Outline: `2px solid white`
- Outline-offset: 2px
- Opacity: 1

**Closing** - User clicked close button
- Animation: Fade-out + slide-down (300ms)
- Pointer-events: Disabled during animation
- Callback: `onClose(id)` fired after 300ms

### Icon Display

Icons are automatically selected based on `toast.type`:

| Type | Icon | Character | Meaning |
|------|------|-----------|---------|
| `success` | ✓ | U+2713 | Checkmark (success) |
| `error` | ✕ | U+2715 | Multiplication X (error) |
| `warning` | ⚠ | U+26A0 | Warning sign (caution) |
| `info` | ℹ | U+2139 | Information source (info) |

**Icon Styling:**
- Size: 24px × 24px circle
- Background: `rgba(255, 255, 255, 0.2)` (semi-transparent white)
- Font-size: 14px
- Font-weight: 700 (bold)
- Color: White

---

## Accessibility

### WCAG Compliance

- ✅ **WCAG 2.1 Level AA** compliant
- ✅ ARIA role="alert" (immediate attention)
- ✅ ARIA aria-live="polite" (non-disruptive announcement)
- ✅ Close button accessible (aria-label, keyboard focusable)
- ✅ Color contrast ratio ≥ 4.5:1 (white text on colored background)
- ✅ Keyboard accessible (Tab to close button, Enter/Space to close)

### ARIA Attributes

```tsx
<div
  className="toast toast--success toast--visible"
  role="alert"
  aria-live="polite"
  data-toast-id={toast.id}
>
  <div className="toast__icon" aria-hidden="true">✓</div>
  <div className="toast__content">
    <div className="toast__message">{toast.message}</div>
    {toast.copiedContent && (
      <div className="toast__copiedContent">{toast.copiedContent}</div>
    )}
  </div>
  <button
    className="toast__closeButton"
    onClick={handleClose}
    aria-label="Close notification"
  >
    ×
  </button>
</div>
```

### Screen Reader Behavior

- **Toast appears**: "Contact saved successfully! (alert, polite)"
- **Copied content**: "Copied: peter@example.com"
- **Close button**: "Close notification button"
- **Close clicked**: Toast removed (no announcement)

**Note:** Screen readers announce toast message immediately (polite announcement), then user can Tab to close button.

---

## Responsive Design

### Breakpoints

**Mobile** (< 768px)
- Min-width: `280px` (from 300px)
- Max-width: `calc(100vw - 32px)` (16px margin on each side)
- Padding: `10px 14px` (reduced from 12px 16px)
- Font-size: `13px` (reduced from 14px)
- Copied content font: `10px` (reduced from 11px)

**Desktop** (≥ 768px)
- Min-width: `300px`
- Max-width: `500px`
- Padding: `12px 16px`
- Font-size: `14px`
- Copied content font: `11px`

### Layout Behavior

**Container Adaptation:**
- Toast width adapts to container (ToastContainer)
- Multiple toasts stack vertically (12px margin-bottom)
- Mobile: Narrower width, reduced padding

**Text Wrapping:**
- Message: Wraps to multiple lines if needed
- Copied content: Single line with ellipsis (`text-overflow: ellipsis`)

---

## Styling

### CSS Variables Used

```css
/* Colors */
--color-status-success (#4CAF50) - success background
--color-status-error (#f44336) - error background
--color-status-warning (#FF9800) - warning background
--color-status-info (#2196F3) - info background
--theme-button-text-on-color (#ffffff) - text color on colored backgrounds
```

### Custom Styling

**Via CSS Modules (not recommended):**
Toast is typically used within ToastContainer and should not be styled directly. Instead, customize ToastContainer positioning or use toast configuration options.

**Toast Configuration:**
```tsx
// Customize via toast object
const toast = {
  id: '1',
  message: 'Custom message',
  type: 'success', // Controls color
  copiedContent: 'Optional preview', // Optional content
};
```

---

## Known Issues

### Active Issues

**No known issues** ✅

All 42 tests passing, component stable in production.

### Fixed Issues

See [Changelog](#changelog) section below.

---

## Testing

### Test Coverage

- ✅ **Unit Tests**: 42 tests
- ✅ **Coverage**: 100% (statements, branches, functions, lines)
- ✅ **Accessibility Tests**: 2 tests (ARIA attributes, screen reader support)
- ✅ **Animation Tests**: 2 tests (fade-in, fade-out timing)
- ✅ **Responsive Tests**: Implicit (mobile CSS tests)

### Test File

`packages/ui-components/src/components/Toast/Toast.test.tsx`

### Running Tests

```bash
# Run Toast tests only
docker exec lkms201-web-ui npx nx test ui-components --testFile=Toast.test.tsx

# Run with coverage
docker exec lkms201-web-ui npx nx test ui-components --coverage --testFile=Toast.test.tsx

# Watch mode (local development)
npx nx test ui-components --watch --testFile=Toast.test.tsx
```

### Key Test Cases

**Rendering (8 tests):**
- ✅ Should render toast message
- ✅ Should render success icon for success toast
- ✅ Should render error icon for error toast
- ✅ Should render warning icon for warning toast
- ✅ Should render info icon for info toast
- ✅ Should render close button when onClose provided
- ✅ Should NOT render close button when onClose not provided
- ✅ Should render copied content when provided

**Accessibility (2 tests):**
- ✅ Should have proper ARIA attributes (role="alert", aria-live="polite")
- ✅ Should have data-toast-id attribute

**Close Functionality (2 tests):**
- ✅ Should call onClose with toast id when close button clicked
- ✅ Should fade out before calling onClose (300ms delay)

**Toast Types (5 tests):**
- ✅ Should apply success class for success toast
- ✅ Should apply error class for error toast
- ✅ Should apply warning class for warning toast
- ✅ Should apply info class for info toast
- ✅ Should default to success type when type not specified

**Animation (1 test):**
- ✅ Should start invisible and fade in (10ms delay)

**Multiple Toasts (1 test):**
- ✅ Should render multiple toasts with different ids

---

## Related Components

- **[ToastContainer](ToastContainer.md)** - Container for rendering toast queue in fixed positions
- **[useToast Hook](../hooks/useToast.md)** - React hook for showing/hiding toasts
- **[Button](Button.md)** - Used to trigger toast notifications

---

## Usage Examples

### Example 1: Success Toast (Save Operation)

```tsx
import { useToast } from '@l-kern/config';
import { Button } from '@l-kern/ui-components';

function SaveButton() {
  const { showToast } = useToast();

  const handleSave = async () => {
    await saveContact();
    showToast({
      message: 'Contact saved successfully!',
      type: 'success',
      duration: 3000,
    });
  };

  return <Button variant="primary" onClick={handleSave}>Save</Button>;
}
```

**Output:**
- Green toast (success background)
- Icon: ✓ (checkmark)
- Message: "Contact saved successfully!"
- Auto-dismisses after 3 seconds
- Close button available

---

### Example 2: Error Toast with Copied Content

```tsx
import { useToast } from '@l-kern/config';

function ErrorHandler() {
  const { showToast } = useToast();

  const handleError = (error) => {
    navigator.clipboard.writeText(error.id);
    showToast({
      message: 'Error occurred. Error ID copied to clipboard.',
      type: 'error',
      copiedContent: error.id,
      duration: 5000,
    });
  };

  return <button onClick={() => handleError({ id: 'ERR-12345' })}>
    Trigger Error
  </button>;
}
```

**Output:**
- Red toast (error background)
- Icon: ✕ (cross)
- Message: "Error occurred. Error ID copied to clipboard."
- Copied content: "ERR-12345" (monospace, gray box)
- Auto-dismisses after 5 seconds

---

### Example 3: Warning Toast (Validation)

```tsx
import { useToast } from '@l-kern/config';

function FormValidation({ formData }) {
  const { showToast } = useToast();

  const handleSubmit = () => {
    if (!formData.email) {
      showToast({
        message: 'Email is required.',
        type: 'warning',
        duration: 4000,
      });
      return;
    }
    // ... submit form ...
  };

  return <button onClick={handleSubmit}>Submit</button>;
}
```

**Output:**
- Orange toast (warning background)
- Icon: ⚠ (warning triangle)
- Message: "Email is required."
- Auto-dismisses after 4 seconds

---

### Example 4: Info Toast (Tips)

```tsx
import { useToast } from '@l-kern/config';
import { useEffect } from 'react';

function FirstTimeUser() {
  const { showToast } = useToast();

  useEffect(() => {
    showToast({
      message: 'Tip: Press Ctrl+D to open debug menu',
      type: 'info',
      duration: 6000,
    });
  }, []);

  return <div>Welcome!</div>;
}
```

**Output:**
- Blue toast (info background)
- Icon: ℹ (info circle)
- Message: "Tip: Press Ctrl+D to open debug menu"
- Auto-dismisses after 6 seconds

---

### Example 5: Manual Toast (No Auto-Dismiss)

```tsx
import { Toast } from '@l-kern/ui-components';
import type { Toast as ToastType } from '@l-kern/config';
import { useState } from 'react';

function ManualToastDemo() {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const addToast = () => {
    setToasts([...toasts, {
      id: Date.now().toString(),
      message: 'Manual toast - close manually',
      type: 'info',
    }]);
  };

  const handleClose = (id: string) => {
    setToasts(toasts.filter(t => t.id !== id));
  };

  return (
    <div>
      <button onClick={addToast}>Show Toast</button>
      <div style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)' }}>
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onClose={handleClose} />
        ))}
      </div>
    </div>
  );
}
```

**Output:**
- Blue info toast
- Message: "Manual toast - close manually"
- Does NOT auto-dismiss (no duration set)
- User must click X button to close

---

## Performance

### Bundle Size

- **JS**: ~0.6 KB (gzipped, including TypeScript types)
- **CSS**: ~0.8 KB (gzipped, all variants + animations)
- **Total**: ~1.4 KB

### Runtime Performance

- **Render time**: < 1ms (average)
- **Animation**: CSS-only (GPU-accelerated, 60fps)
- **Re-renders**: Minimal (only when toast props change)
- **Memory**: ~500 bytes per toast instance

### Optimization Tips

- ✅ **Use ToastContext** - Centralized toast management (better than manual state)
- ✅ **Limit toasts** - Max 3-5 toasts visible at once
- ✅ **Auto-dismiss** - Set reasonable durations (3-5 seconds)
- ✅ **Avoid inline styles** - Use CSS classes instead

---

## Migration Guide

### From v0.x (Internal) to v1.0.0

**No Breaking Changes** ✅

v1.0.0 is initial public release.

---

## Changelog

### v1.0.0 (2025-10-19)
- 🎉 Initial release
- ✅ 4 type variants (success, error, warning, info)
- ✅ Smooth fade-in/out animations (300ms)
- ✅ Optional close button
- ✅ Optional copied content display
- ✅ 42 unit tests (100% coverage)
- ✅ WCAG AA accessibility compliant

---

## Contributing

### Adding New Toast Type

1. Add type to Toast interface in `@l-kern/config`:
   ```typescript
   type ToastType = 'success' | 'error' | 'warning' | 'info' | 'critical'; // NEW
   ```

2. Add icon in `getIcon()` function:
   ```typescript
   case 'critical':
     return '🔥'; // Fire emoji
   ```

3. Add CSS class in `Toast.module.css`:
   ```css
   .toast--critical {
     background: var(--color-status-critical, #d32f2f);
     color: var(--theme-button-text-on-color, #ffffff);
     border: 2px solid var(--color-status-critical, #d32f2f);
   }
   ```

4. Update this documentation:
   - Add to **Features** list
   - Add to **Visual Design > Type Variants** section
   - Add example in **Usage Examples**

5. Add tests:
   ```typescript
   it('should render critical icon for critical toast', () => {
     mockToast.type = 'critical';
     render(<Toast toast={mockToast} onClose={onClose} />);
     expect(screen.getByText('🔥')).toBeInTheDocument();
   });
   ```

### Reporting Issues

1. Check [Known Issues](#known-issues) first
2. Create task in project management (get Task #XXX)
3. Add to this documentation under "Known Issues"
4. Include:
   - Severity (Low/Medium/High/Critical)
   - Affected types/features
   - Steps to reproduce
   - Workaround (if any)

---

## Resources

### Internal Links

- [Coding Standards](../programming/coding-standards.md)
- [Design System](../design/component-design-system.md)
- [Testing Guide](../programming/testing-overview.md)
- [ToastContainer Component](ToastContainer.md)
- [useToast Hook](../hooks/useToast.md)

### External References

- [React 19 Documentation](https://react.dev)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Live Regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions)
- [Toast Notification Patterns](https://www.nngroup.com/articles/toast-notifications/)

---

**Last Updated**: 2025-10-20
**Maintainer**: BOSSystems s.r.o.
**Documentation Version**: 1.0.0
**Component Version**: 1.0.0
