# ================================================================
# KeyboardShortcutsButton
# ================================================================
# File: L:\system\lkern_codebase_v4_act\packages\ui-components\src\components\KeyboardShortcutsButton\KeyboardShortcutsButton.md
# Version: 1.1.0
# Created: 2025-11-24
# Updated: 2025-12-10
# Source: packages/ui-components/src/components/KeyboardShortcutsButton/KeyboardShortcutsButton.tsx
# Package: @l-kern/ui-components
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Floating "?" button that displays keyboard shortcuts modal with 11 shortcuts.
#   Opens with Shift+/ (?) key and coordinates positioning with StatusBar.
# ================================================================

---

## Overview

**Purpose**: Floating help button displaying available keyboard shortcuts
**Package**: @l-kern/ui-components
**Path**: packages/ui-components/src/components/KeyboardShortcutsButton
**Since**: v1.0.0 (Current: v1.1.0)

The KeyboardShortcutsButton renders a floating "?" button that opens a modal listing all available keyboard shortcuts (Ctrl+D theme toggle, Ctrl+L language, Ctrl+1-9 permissions). Opens with Shift+/ and positions dynamically above StatusBar and ThemeCustomizer button.

---

## Features

- ✅ **11 Keyboard Shortcuts Displayed**: Theme, language, permission levels
- ✅ **Floating Button**: "?" icon in bottom-right corner
- ✅ **Quick Open**: Shift+/ (?) key to open modal
- ✅ **Modal Display**: Clean list of shortcuts with kbd tags
- ✅ **Dynamic Positioning**: Stacks above ThemeCustomizer, adjusts for StatusBar
- ✅ **Escape to Close**: Press Escape to close modal
- ✅ **Click Outside**: Closes modal on outside click

---

## Quick Start

### Basic Usage

```tsx
import { KeyboardShortcutsButton } from '@l-kern/ui-components';

function App() {
  return (
    <>
      <main>{/* Content */}</main>
      <KeyboardShortcutsButton />
    </>
  );
}
```

### With StatusBar Coordination

```tsx
import { KeyboardShortcutsButton, StatusBar } from '@l-kern/ui-components';
import { useState } from 'react';

function App() {
  const [statusBarExpanded, setStatusBarExpanded] = useState(false);
  const [statusBarHeight, setStatusBarHeight] = useState(300);

  return (
    <>
      <main>{/* Content */}</main>

      <KeyboardShortcutsButton
        statusBarExpanded={statusBarExpanded}
        statusBarHeight={32}
        statusBarExpandedHeight={statusBarHeight}
      />

      <StatusBar
        onExpandedChange={setStatusBarExpanded}
        onExpandedHeightChange={setStatusBarHeight}
      />
    </>
  );
}
```

---

## Props API

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `position` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-right'` | No | Position of floating button |
| `statusBarExpanded` | `boolean` | `false` | No | Whether StatusBar is expanded |
| `statusBarHeight` | `number` | `32` | No | StatusBar collapsed height (px) |
| `statusBarExpandedHeight` | `number` | `300` | No | StatusBar expanded height (px) |
| `onOpen` | `() => void` | - | No | Callback when modal opens |
| `onClose` | `() => void` | - | No | Callback when modal closes |

---

## Keyboard Shortcuts Displayed

| Shortcut | Description |
|----------|-------------|
| **Ctrl+D** | Toggle dark/light theme |
| **Ctrl+L** | Change language (SK → EN cycle) |
| **Ctrl+1** | Basic lvl1 (Permission 10) |
| **Ctrl+2** | Basic lvl2 (Permission 20) |
| **Ctrl+3** | Basic lvl3 (Permission 29) |
| **Ctrl+4** | Standard lvl1 (Permission 35) |
| **Ctrl+5** | Standard lvl2 (Permission 45) |
| **Ctrl+6** | Standard lvl3 (Permission 59) |
| **Ctrl+7** | Admin lvl1 (Permission 65) |
| **Ctrl+8** | Admin lvl2 (Permission 85) |
| **Ctrl+9** | Admin lvl3 (Permission 100) |

---

## Behavior

### Opening Modal

**Triggers:**
- Click "?" button
- Press Shift+/ (? key)

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === '?' && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

### Closing Modal

**Triggers:**
- Click close button (×)
- Press Escape
- Click outside modal

### Dynamic Positioning

Button stacks ABOVE ThemeCustomizer:

```typescript
const calculateBottomPosition = () => {
  const currentStatusBarHeight = statusBarExpanded
    ? (statusBarExpandedHeight + statusBarHeight)
    : statusBarHeight;
  const themeCustomizerBottom = currentStatusBarHeight + 16;
  return themeCustomizerBottom + 48 + 16; // Stack vertically
};
```

---

## Visual Design

### Floating Button

```
?  ← Circular button (48px × 48px)
    Position: 24px from right, dynamic from bottom
    Color: Theme-aware
```

### Modal Layout

```
┌─────────────────────────────────┐
│ ⌨️ Keyboard Shortcuts      ✕   │
├─────────────────────────────────┤
│ Ctrl+D  Toggle dark/light theme │
│ Ctrl+L  Change language         │
│ Ctrl+1  Basic lvl1 (10)         │
│ Ctrl+2  Basic lvl2 (20)         │
│ Ctrl+3  Basic lvl3 (29)         │
│ Ctrl+4  Standard lvl1 (35)      │
│ Ctrl+5  Standard lvl2 (45)      │
│ Ctrl+6  Standard lvl3 (59)      │
│ Ctrl+7  Admin lvl1 (65)         │
│ Ctrl+8  Admin lvl2 (85)         │
│ Ctrl+9  Admin lvl3 (100)        │
├─────────────────────────────────┤
│ 💡 Press ? to open this modal  │
└─────────────────────────────────┘
```

---

## Known Issues

**No known issues** - Component is stable.

---

## Testing

### Key Test Cases

1. **Opens modal on button click**
2. **Opens modal on Shift+/ key**
3. **Closes modal on Escape key**
4. **Closes modal on outside click**
5. **Displays all 11 shortcuts**
6. **Position adjusts for StatusBar state**

---

## Related Components

- [ThemeCustomizer](../ThemeCustomizer/ThemeCustomizer.md) - Positioned below KeyboardShortcutsButton
- [StatusBar](../StatusBar/StatusBar.md) - Coordinates positioning
- [BasePage](../BasePage/BasePage.md) - Handles keyboard shortcuts

---

## Changelog

### v1.1.0 (2025-11-30)
- ✅ Fixed duplicate keyboard handlers
- ✅ Added Ctrl+1-9 shortcuts to modal

### v1.0.0 (2025-11-24)
- ✅ Initial port from v3

---

**End of KeyboardShortcutsButton Documentation**
