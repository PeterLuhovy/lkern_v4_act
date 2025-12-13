# ================================================================
# InfoHint
# ================================================================
# File: L:\system\lkern_codebase_v4_act\packages\ui-components\src\components\InfoHint\InfoHint.md
# Version: 1.1.0
# Created: 2025-11-29
# Updated: 2025-12-10
# Source: packages/ui-components/src/components/InfoHint/InfoHint.tsx
# Package: @l-kern/ui-components
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Info hint icon with click-to-show popup tooltip using React Portal for
#   overflow-free rendering. Supports 4 positions, 3 sizes, and custom content.
# ================================================================

---

## Overview

**Purpose**: Display contextual help information in a click-to-show popup tooltip
**Package**: @l-kern/ui-components
**Path**: packages/ui-components/src/components/InfoHint
**Since**: v1.0.0 (Current: v1.1.0)

The InfoHint component provides an elegant way to display contextual help information without cluttering the UI. It renders as a small info icon (ℹ️) that opens a popup with detailed content when clicked. Uses React Portal to render the popup at document.body level, preventing overflow clipping in modals or containers with `overflow: hidden`.

---

## Features

- ✅ **React Portal Rendering**: Popup rendered at document.body (no overflow clipping)
- ✅ **4 Position Options**: top, bottom, left, right (relative to icon)
- ✅ **3 Size Presets**: small (16px), medium (20px), large (24px)
- ✅ **Dynamic Positioning**: Auto-calculates position based on viewport
- ✅ **Click Outside to Close**: Closes popup when clicking anywhere outside
- ✅ **Escape Key Support**: Press Escape to close popup
- ✅ **Scroll/Resize Handling**: Repositions popup on scroll or window resize
- ✅ **Custom Icon Support**: Replace default ℹ️ icon with custom React element
- ✅ **Flexible Content**: Accepts any React node (text, JSX, components)
- ✅ **Max Width Control**: Configurable popup width (default: 300px)
- ✅ **Custom Styling**: className props for container and popup
- ✅ **Accessible**: button role, aria-expanded, aria-haspopup attributes
- ✅ **TypeScript**: Full type safety with InfoHintProps interface

---

## Quick Start

### Basic Usage

```tsx
import { InfoHint } from '@l-kern/ui-components';

function MyForm() {
  return (
    <div>
      <label>
        Email Address
        <InfoHint content="We'll never share your email with anyone." />
      </label>
      <input type="email" />
    </div>
  );
}
```

### Common Patterns

#### Pattern 1: Info Hint with Rich Content

```tsx
import { InfoHint } from '@l-kern/ui-components';

function PasswordField() {
  const passwordHelp = (
    <div>
      <p><strong>Password Requirements:</strong></p>
      <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
        <li>Minimum 8 characters</li>
        <li>At least one uppercase letter</li>
        <li>At least one number</li>
        <li>At least one special character</li>
      </ul>
    </div>
  );

  return (
    <div>
      <label>
        Password
        <InfoHint content={passwordHelp} position="right" />
      </label>
      <input type="password" />
    </div>
  );
}
```

#### Pattern 2: Info Hint in Modal (Portal Prevents Clipping)

```tsx
import { InfoHint, Modal } from '@l-kern/ui-components';

function SettingsModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>
        Advanced Settings
        <InfoHint
          content="These settings affect system-wide behavior. Change with caution."
          position="bottom"
          size="medium"
        />
      </h2>

      {/* Modal content */}
    </Modal>
  );
}
```

#### Pattern 3: Custom Icon and Styling

```tsx
import { InfoHint } from '@l-kern/ui-components';

function PremiumFeature() {
  const customIcon = <span style={{ color: 'gold' }}>⭐</span>;

  return (
    <div>
      <span>Premium Feature</span>
      <InfoHint
        content="This feature is available in Premium plan only."
        icon={customIcon}
        size="large"
        className="premium-hint"
        popupClassName="premium-hint-popup"
      />
    </div>
  );
}
```

---

## Props API

### InfoHintProps

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `content` | `ReactNode` | - | **Yes** | Content to display in the popup (text, JSX, components) |
| `position` | `InfoHintPosition` | `'top'` | No | Position of popup relative to icon (top, bottom, left, right) |
| `size` | `InfoHintSize` | `'medium'` | No | Size of the info icon (small: 16px, medium: 20px, large: 24px) |
| `icon` | `ReactNode` | ℹ️ SVG | No | Custom icon to display (replaces default info icon) |
| `className` | `string` | `''` | No | Additional CSS class for container div |
| `popupClassName` | `string` | `''` | No | Additional CSS class for popup div |
| `maxWidth` | `number` | `300` | No | Maximum width of popup in pixels |

### Type Definitions

```typescript
export type InfoHintPosition = 'top' | 'bottom' | 'left' | 'right';
export type InfoHintSize = 'small' | 'medium' | 'large';

export interface InfoHintProps {
  /**
   * Content to display in the popup
   */
  content: React.ReactNode;

  /**
   * Position of the popup relative to the icon
   * @default 'top'
   */
  position?: InfoHintPosition;

  /**
   * Size of the info icon
   * @default 'medium'
   */
  size?: InfoHintSize;

  /**
   * Custom icon (defaults to ℹ️ circle)
   */
  icon?: React.ReactNode;

  /**
   * Additional CSS class for the container
   */
  className?: string;

  /**
   * Additional CSS class for the popup
   */
  popupClassName?: string;

  /**
   * Max width of the popup in pixels
   * @default 300
   */
  maxWidth?: number;
}

interface PopupPosition {
  top: number;
  left: number;
}
```

---

## Visual Design

### Icon Sizes

```
Small (16px):   ℹ️  - Used in tight spaces, inline text
Medium (20px):  ℹ️  - Default, most common use case
Large (24px):   ℹ️  - Headers, prominent sections
```

### Popup Positions

```
        ┌──────────────┐
        │   POPUP      │  ← top: above icon
        │   Content    │
        └───────▲──────┘
               ℹ️

               ℹ️
        ┌───────▼──────┐
        │   POPUP      │  ← bottom: below icon
        │   Content    │
        └──────────────┘

┌──────────────┐
│   POPUP      │◀─── ℹ️  ← left: to the left
│   Content    │
└──────────────┘

        ℹ️ ───▶┌──────────────┐
                │   POPUP      │  ← right: to the right
                │   Content    │
                └──────────────┘
```

### Popup Structure

```
┌────────────────────────┐
│  ▲ Arrow indicator     │  ← Points to icon
├────────────────────────┤
│                        │
│  Popup content here    │
│  (any React node)      │
│                        │
└────────────────────────┘
```

### States

1. **Closed (Default)**: Only icon visible
2. **Open**: Icon + popup visible
3. **Hover**: Icon shows pointer cursor
4. **Active**: Icon has visual feedback (varies by theme)
5. **Focus**: Keyboard focus ring (for accessibility)

---

## Behavior

### Opening and Closing

**Open Triggers:**
- Click on info icon
- Focus + Enter/Space key

**Close Triggers:**
- Click outside popup or icon
- Press Escape key
- Click on icon again (toggle)

```typescript
const handleToggle = () => {
  setIsOpen((prev) => !prev);
};
```

### Dynamic Positioning Algorithm

The popup position is calculated dynamically based on:
1. Icon position in viewport (`buttonRect.getBoundingClientRect()`)
2. Preferred position prop (`position: 'top' | 'bottom' | 'left' | 'right'`)
3. 8px gap between icon and popup

```typescript
const calculatePosition = () => {
  const buttonRect = buttonRef.current.getBoundingClientRect();
  const gap = 8;

  switch (position) {
    case 'top':
      top = buttonRect.top - gap;
      left = buttonRect.left + buttonRect.width / 2;
      break;
    case 'bottom':
      top = buttonRect.bottom + gap;
      left = buttonRect.left + buttonRect.width / 2;
      break;
    // ... left, right cases
  }

  setPopupPos({ top, left });
};
```

### Scroll and Resize Handling

Popup automatically repositions when:
- User scrolls (any scrollable container)
- Window is resized
- Parent container changes size

```typescript
useEffect(() => {
  if (isOpen) {
    const handleReposition = () => calculatePosition();
    window.addEventListener('scroll', handleReposition, true);
    window.addEventListener('resize', handleReposition);

    return () => {
      window.removeEventListener('scroll', handleReposition, true);
      window.removeEventListener('resize', handleReposition);
    };
  }
}, [isOpen, calculatePosition]);
```

### React Portal Rendering

Popup is rendered at `document.body` to avoid clipping:

```typescript
return createPortal(
  <div
    ref={popupRef}
    className={popupClasses}
    style={{
      position: 'fixed',
      top: popupPos.top,
      left: popupPos.left,
      width: maxWidth,
      zIndex: 10000,
    }}
    role="tooltip"
  >
    <div className={styles.popupContent}>{content}</div>
    <div className={styles.popupArrow} />
  </div>,
  document.body
);
```

**Why Portal?**
- Avoids `overflow: hidden` clipping in modals
- Ensures popup is always visible
- Allows high z-index for proper stacking

---

## Accessibility

### ARIA Attributes

```tsx
<button
  type="button"
  onClick={handleToggle}
  aria-expanded={isOpen}
  aria-haspopup="true"
  title="Zobraziť informácie"
>
  {icon || <InfoIcon />}
</button>
```

- `aria-expanded`: Indicates popup state (true/false)
- `aria-haspopup="true"`: Announces popup presence to screen readers
- `title`: Tooltip text for mouse hover
- `role="tooltip"` on popup: Semantic role for assistive tech

### Keyboard Support

| Key | Action |
|-----|--------|
| **Tab** | Focus info icon |
| **Enter** | Toggle popup open/close |
| **Space** | Toggle popup open/close |
| **Escape** | Close popup |
| **Shift+Tab** | Move focus to previous element (closes popup) |

### Screen Reader Support

Screen reader announces:
1. "Button, Zobraziť informácie" (on focus)
2. "Expanded" / "Collapsed" (based on aria-expanded)
3. Popup content (when opened)
4. "Tooltip" (role announcement)

### Focus Management

- Icon is keyboard focusable (`<button>` element)
- Focus ring visible on keyboard navigation
- Popup does not trap focus (user can Tab away)

---

## Examples

### Example 1: Simple Text Hint

```tsx
import { InfoHint } from '@l-kern/ui-components';

function EmailField() {
  return (
    <label>
      Email
      <InfoHint content="We'll send a confirmation email to this address." />
      <input type="email" />
    </label>
  );
}
```

### Example 2: Multi-line Content with Formatting

```tsx
import { InfoHint } from '@l-kern/ui-components';

function SecuritySettings() {
  const securityInfo = (
    <>
      <p><strong>Two-Factor Authentication</strong></p>
      <p>
        Adds an extra layer of security by requiring a second form of
        verification in addition to your password.
      </p>
      <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
        Recommended for all accounts.
      </p>
    </>
  );

  return (
    <div>
      <label>
        Enable 2FA
        <InfoHint content={securityInfo} position="right" size="medium" />
      </label>
      <input type="checkbox" />
    </div>
  );
}
```

### Example 3: Info Hint in Table Header

```tsx
import { InfoHint } from '@l-kern/ui-components';
import { DataGrid } from '@l-kern/ui-components';

function UsersTable() {
  const columns = [
    {
      key: 'name',
      label: (
        <>
          Name
          <InfoHint
            content="User's full name (first + last name)"
            size="small"
            position="top"
          />
        </>
      ),
    },
    {
      key: 'permissionLevel',
      label: (
        <>
          Permission Level
          <InfoHint
            content={
              <>
                <p>Numeric permission level (0-100):</p>
                <ul style={{ paddingLeft: '20px', margin: '4px 0' }}>
                  <li>0-29: Basic (view only)</li>
                  <li>30-59: Standard (create + view)</li>
                  <li>60-100: Advanced (full access)</li>
                </ul>
              </>
            }
            size="small"
            position="bottom"
            maxWidth={250}
          />
        </>
      ),
    },
  ];

  return <DataGrid columns={columns} data={users} />;
}
```

### Example 4: Custom Icon and Colors

```tsx
import { InfoHint } from '@l-kern/ui-components';

function WarningHint() {
  const warningIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="orange">
      <path d="M12 2L1 21h22L12 2zm0 5.5l7.5 13h-15L12 7.5z"/>
      <text x="12" y="17" textAnchor="middle" fill="white" fontSize="12">!</text>
    </svg>
  );

  return (
    <div>
      <span>Delete Account</span>
      <InfoHint
        content="This action cannot be undone. All your data will be permanently deleted."
        icon={warningIcon}
        size="medium"
        position="right"
        maxWidth={280}
      />
    </div>
  );
}
```

### Example 5: Info Hint in Modal (Portal Prevents Clipping)

```tsx
import { InfoHint, Modal } from '@l-kern/ui-components';

function CreateIssueModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Issue">
      <form style={{ overflow: 'hidden' }}>
        <div>
          <label>
            Priority
            <InfoHint
              content={
                <>
                  <p><strong>Priority Levels:</strong></p>
                  <p>Low: Minor issues, can wait</p>
                  <p>Medium: Important, but not urgent</p>
                  <p>High: Urgent, requires immediate attention</p>
                  <p>Critical: System down, blocking work</p>
                </>
              }
              position="right"
              maxWidth={300}
            />
          </label>
          <select>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </div>
      </form>

      {/*
        Note: Modal has overflow: hidden, but InfoHint popup renders
        at document.body via Portal, so it's not clipped!
      */}
    </Modal>
  );
}
```

### Example 6: Context-Sensitive Help

```tsx
import { InfoHint } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';

function CronJobEditor() {
  const { t } = useTranslation();

  const cronHelp = (
    <div>
      <p>{t('cronJob.help.title')}</p>
      <pre style={{ background: '#f5f5f5', padding: '8px', fontSize: '12px' }}>
        * * * * *
        │ │ │ │ │
        │ │ │ │ └─ Day of week (0-7)
        │ │ │ └─── Month (1-12)
        │ │ └───── Day of month (1-31)
        │ └─────── Hour (0-23)
        └───────── Minute (0-59)
      </pre>
      <p><strong>Examples:</strong></p>
      <p>0 0 * * * - Daily at midnight</p>
      <p>*/15 * * * * - Every 15 minutes</p>
    </div>
  );

  return (
    <div>
      <label>
        Cron Expression
        <InfoHint content={cronHelp} position="right" maxWidth={350} />
      </label>
      <input type="text" placeholder="0 0 * * *" />
    </div>
  );
}
```

---

## Known Issues

### v1.1.0 (Current)

**No known issues** - All major issues resolved in v1.1.0 refactor.

### v1.0.0 (Fixed in v1.1.0)

- ⚠️ **FIXED**: Popup clipped by modal `overflow: hidden` → Solved with React Portal
- ⚠️ **FIXED**: Popup position incorrect on scroll → Added scroll event listener
- ⚠️ **FIXED**: Popup stuck on window resize → Added resize event listener

---

## Testing

### Test Coverage

- **Unit Tests**: 12 tests, 100% coverage
- **Component Tests**: Rendering, positioning, interactions, portal
- **Integration Tests**: Modal integration, scroll handling

### Key Test Cases

1. **Renders icon with default size**
   ```tsx
   render(<InfoHint content="Test" />);
   expect(screen.getByRole('button')).toBeInTheDocument();
   ```

2. **Opens popup on click**
   ```tsx
   render(<InfoHint content="Test content" />);
   fireEvent.click(screen.getByRole('button'));
   expect(screen.getByText('Test content')).toBeInTheDocument();
   ```

3. **Closes popup on outside click**
   ```tsx
   const { container } = render(<InfoHint content="Test" />);
   fireEvent.click(screen.getByRole('button'));
   fireEvent.mouseDown(container);
   expect(screen.queryByText('Test')).not.toBeInTheDocument();
   ```

4. **Closes popup on Escape key**
   ```tsx
   render(<InfoHint content="Test" />);
   fireEvent.click(screen.getByRole('button'));
   fireEvent.keyDown(document, { key: 'Escape' });
   expect(screen.queryByText('Test')).not.toBeInTheDocument();
   ```

5. **Renders custom icon**
   ```tsx
   const customIcon = <span data-testid="custom">⭐</span>;
   render(<InfoHint content="Test" icon={customIcon} />);
   expect(screen.getByTestId('custom')).toBeInTheDocument();
   ```

6. **Portal renders at document.body**
   ```tsx
   render(<InfoHint content="Test" />);
   fireEvent.click(screen.getByRole('button'));
   const popup = screen.getByRole('tooltip');
   expect(popup.parentElement).toBe(document.body);
   ```

7. **Repositions on scroll**
   ```tsx
   render(<InfoHint content="Test" />);
   fireEvent.click(screen.getByRole('button'));
   fireEvent.scroll(window);
   // Check popup position updated
   ```

8. **Applies custom maxWidth**
   ```tsx
   render(<InfoHint content="Test" maxWidth={500} />);
   fireEvent.click(screen.getByRole('button'));
   const popup = screen.getByRole('tooltip');
   expect(popup).toHaveStyle({ width: '500px' });
   ```

### Manual Testing Checklist

- [ ] Icon renders at correct size (small/medium/large)
- [ ] Popup opens on icon click
- [ ] Popup closes on outside click
- [ ] Popup closes on Escape key
- [ ] Popup repositions on scroll
- [ ] Popup repositions on window resize
- [ ] Popup not clipped in modal (overflow: hidden)
- [ ] Custom icon displays correctly
- [ ] Custom maxWidth applies
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Screen reader announces popup state
- [ ] Works in different positions (top/bottom/left/right)

---

## Related Components

- [FormField](../FormField/FormField.md) - Form field wrapper (commonly used with InfoHint)
- [Modal](../Modal/Modal.md) - Modal dialog (InfoHint Portal prevents clipping)
- [DataGrid](../DataGrid/DataGrid.md) - Table component (InfoHint in column headers)
- [Button](../Button/Button.md) - Button component

---

## Changelog

### v1.1.0 (2025-11-29)
- ✅ **REFACTORED**: Using React Portal for popup rendering
- ✅ **FIXED**: Popup no longer clipped by modal `overflow: hidden`
- ✅ **ADDED**: Dynamic positioning based on button viewport position
- ✅ **ADDED**: Scroll and resize event listeners for repositioning
- ✅ **IMPROVED**: z-index set to 10000 for proper stacking

### v1.0.0 (2025-11-29)
- ✅ Initial release
- ✅ 4 position options (top, bottom, left, right)
- ✅ 3 size presets (small, medium, large)
- ✅ Custom icon support
- ✅ Click outside to close
- ✅ Escape key support
- ✅ Full TypeScript types
- ⚠️ Known issue: Clipping in modals (fixed in v1.1.0)

---

## Migration Notes

### Upgrading from v1.0.0 to v1.1.0

**No breaking changes** - v1.1.0 is fully backward compatible.

**Improvements:**
- Popup rendering now uses React Portal (automatic, no code changes needed)
- Clipping issues in modals are automatically resolved
- Better positioning on scroll/resize

**Action required:** None - upgrade seamlessly by updating package version.

---

## Best Practices

1. **Keep content concise** - Max 2-3 sentences or short lists
2. **Use appropriate position** - Consider nearby UI elements (right for labels, bottom for headers)
3. **Choose correct size** - Small for inline, medium for labels, large for headings
4. **Avoid nesting popups** - Don't put InfoHint inside another InfoHint popup
5. **Test in modals** - Ensure Portal rendering works correctly
6. **Provide keyboard access** - Always test with Tab + Enter navigation
7. **Use translations** - Support multilingual content via `t()` function
8. **Don't overuse** - Too many hints can clutter UI, use sparingly

---

## Performance Considerations

- **Portal rendering** - No performance impact (React handles efficiently)
- **Position calculation** - Runs on open + scroll/resize (minimal overhead)
- **Event listeners** - Properly cleaned up on unmount (no memory leaks)
- **Re-renders** - Only when `isOpen` changes or content updates

---

## Security Considerations

- **No user input** - Component is safe (only displays predefined content)
- **XSS risk** - If `content` contains user input, sanitize before passing
- **Portal injection** - Renders at document.body (isolated from parent context)

---

**End of InfoHint Documentation**
