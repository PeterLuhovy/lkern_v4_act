# ================================================================
# ThemeCustomizer
# ================================================================
# File: L:\system\lkern_codebase_v4_act\packages\ui-components\src\components\ThemeCustomizer\ThemeCustomizer.md
# Version: 1.3.0
# Created: 2025-11-24
# Updated: 2025-12-10
# Source: packages/ui-components/src/components/ThemeCustomizer/ThemeCustomizer.tsx
# Package: @l-kern/ui-components
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Theme customization floating button with modal for adjusting app appearance.
#   Settings include compact mode, high contrast, animations, font size, and accent color.
# ================================================================

---

## Overview

**Purpose**: Floating button with theme customization modal for personalizing app appearance
**Package**: @l-kern/ui-components
**Path**: packages/ui-components/src/components/ThemeCustomizer
**Since**: v1.0.0 (Current: v1.3.0)

The ThemeCustomizer component provides a comprehensive interface for customizing the application's visual appearance. Users can adjust compact mode, high contrast, animations, font size (3 options), and accent color (7 options). All settings are persisted in localStorage and applied via CSS custom properties at document root level. The component renders as a floating 🎨 button that opens a modal with all customization options.

---

## Features

- ✅ **5 Customization Settings**: Compact mode, high contrast, animations, font size, accent color
- ✅ **7 Accent Colors**: L-KERN Purple, Blue, Green, Orange, Rose, Pink, Blue Grey
- ✅ **3 Font Sizes**: Small (14px), medium (16px), large (18px)
- ✅ **CSS Variables Application**: Applies settings to document root via `--variable` properties
- ✅ **localStorage Persistence**: Settings saved and restored across sessions
- ✅ **Floating Button**: Positioned above StatusBar with dynamic adjustment
- ✅ **Modal Interface**: Clean settings modal with visual preview
- ✅ **Reset to Defaults**: One-click reset button
- ✅ **Real-Time Preview**: Changes apply immediately
- ✅ **Theme-Aware UI**: Modal styling adapts to light/dark mode
- ✅ **Button Gradients**: Applies accent color to primary button gradients
- ✅ **Modal Headers**: Subtle accent color tint in modal headers

---

## Quick Start

### Basic Usage

```tsx
import { ThemeCustomizer } from '@l-kern/ui-components';

function App() {
  return (
    <div>
      {/* Your app content */}

      {/* Floating theme customizer button */}
      <ThemeCustomizer />
    </div>
  );
}
```

### With StatusBar Coordination

```tsx
import { ThemeCustomizer, StatusBar } from '@l-kern/ui-components';
import { useState } from 'react';

function AppLayout() {
  const [statusBarExpanded, setStatusBarExpanded] = useState(false);
  const [statusBarHeight, setStatusBarHeight] = useState(300);

  return (
    <>
      {/* Main content */}

      <ThemeCustomizer
        position="bottom-right"
        statusBarExpanded={statusBarExpanded}
        statusBarHeight={32}
        statusBarExpandedHeight={statusBarHeight}
      />

      <StatusBar
        services={services}
        onExpandedChange={setStatusBarExpanded}
        onExpandedHeightChange={setStatusBarHeight}
      />
    </>
  );
}
```

---

## Props API

### ThemeCustomizerProps

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `position` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-right'` | No | Position of floating button |
| `statusBarExpanded` | `boolean` | `false` | No | Whether StatusBar is expanded (affects button position) |
| `statusBarHeight` | `number` | `32` | No | StatusBar collapsed height in pixels |
| `statusBarExpandedHeight` | `number` | `300` | No | StatusBar expanded height in pixels |

### CustomSettings Interface

```typescript
interface CustomSettings {
  compactMode: boolean;
  highContrast: boolean;
  showAnimations: boolean;
  fontSize: 'small' | 'medium' | 'large';
  accentColor: string; // Hex color code
}
```

### Default Settings

```typescript
const DEFAULT_CUSTOM_SETTINGS: CustomSettings = {
  compactMode: false,
  highContrast: false,
  showAnimations: true,
  fontSize: 'medium',
  accentColor: '#9c27b0', // L-KERN Purple
};
```

---

## Settings Explained

### 1. Compact Mode 📦

**Effect**: Reduces spacing throughout the application

**CSS Variables Modified:**
```css
--spacing-xs: 4px  → 2px
--spacing-sm: 8px  → 4px
--spacing-md: 16px → 8px
--spacing-lg: 24px → 12px
--spacing-xl: 32px → 16px
```

**Use Case**: Users with small screens or who prefer denser UI

### 2. High Contrast 🔆

**Effect**: Increases text contrast and border visibility

**CSS Variables Modified:**
```css
--high-contrast-text: #000000 (pure black text)
--high-contrast-border: 2px (thicker borders)
```

**Attribute Added:**
```html
<html data-high-contrast="true">
```

**Use Case**: Users with visual impairments or bright ambient lighting

### 3. Show Animations ✨

**Effect**: Enables/disables all CSS animations and transitions

**CSS Variables Modified:**
```css
/* Enabled (default) */
--animation-duration: 0.3s
--transition-duration: 0.2s

/* Disabled */
--animation-duration: 0s
--transition-duration: 0s
```

**Attribute Added (when disabled):**
```html
<html data-reduce-motion="true">
```

**Use Case**: Users who prefer static UI or have motion sensitivity

### 4. Font Size 📏

**Options**: Small (14px), Medium (16px), Large (18px)

**CSS Variables Modified:**
```css
--font-size-base: 14px | 16px | 18px
```

**Attribute Added:**
```html
<html data-font-size="small | medium | large">
```

**Use Case**: Users with vision needs or personal preference

### 5. Accent Color 🎨

**Options**:
- L-KERN Purple (#9c27b0) - Default
- Blue (#3366cc)
- Green (#4caf50)
- Orange (#ff9800)
- Rose (#e91e63)
- Pink (#FF69B4)
- Blue Grey (#607d8b)

**CSS Variables Modified:**
```css
--color-brand-primary: <accentColor>
--color-primary: <accentColor>
--color-accent: <accentColor>
--theme-accent: <accentColor>
--button-primary-from: <accentColor>
--button-primary-to: <accentColor>
--modal-header-gradient-start: color-mix(in srgb, <accentColor> 8%, transparent)
--modal-header-gradient-end: color-mix(in srgb, <accentColor> 3%, transparent)
--modal-header-border: color-mix(in srgb, <accentColor> 20%, var(--theme-border))
```

**Use Case**: Personal preference, branding customization

---

## Behavior

### Settings Persistence

**Storage**: `localStorage` key `'l-kern-custom-settings'`

**Load on Mount:**
```typescript
const loadSettings = (): CustomSettings => {
  const saved = localStorage.getItem('l-kern-custom-settings');
  return saved ? JSON.parse(saved) : DEFAULT_CUSTOM_SETTINGS;
};
```

**Save on Change:**
```typescript
useEffect(() => {
  localStorage.setItem('l-kern-custom-settings', JSON.stringify(customSettings));
  applySettingsToDocument(customSettings);
}, [customSettings]);
```

### Reset to Defaults

```typescript
const handleReset = () => {
  setCustomSettings(DEFAULT_CUSTOM_SETTINGS);
  // Automatically saves to localStorage and applies to document
};
```

### Dynamic Positioning

Floating button adjusts position based on StatusBar state:

```typescript
const calculateBottomPosition = () => {
  const currentStatusBarHeight = statusBarExpanded
    ? (statusBarExpandedHeight + statusBarHeight)
    : statusBarHeight;
  return currentStatusBarHeight + 16; // 16px offset
};
```

---

## Visual Design

### Floating Button

```
🎨  ← Circular button
     Color: Current accent color
     Size: 48px × 48px
     Position: 16px from bottom-right (above StatusBar)
```

### Modal Layout

```
┌────────────────────────────────────┐
│ 🎨 Theme Customization        ✕  │  ← Header
├────────────────────────────────────┤
│ ☐ 📦 Compact Mode                 │
│ ☐ 🔆 High Contrast                │
│ ☐ ✨ Show Animations              │
│                                    │
│ 📏 Font Size: [Medium ▼]          │
│                                    │
│ 🎨 Accent Color:                  │
│ ⬤ ⬤ ⬤ ⬤ ⬤ ⬤ ⬤                  │  ← Color grid (7 colors)
│                                    │
├────────────────────────────────────┤
│ [🔄 Reset to Defaults]  [✕ Close]│  ← Actions
└────────────────────────────────────┘
```

---

## Examples

### Example 1: Basic ThemeCustomizer

```tsx
import { ThemeCustomizer } from '@l-kern/ui-components';

function App() {
  return (
    <>
      <main>{/* Content */}</main>
      <ThemeCustomizer />
    </>
  );
}
```

### Example 2: Custom Position

```tsx
import { ThemeCustomizer } from '@l-kern/ui-components';

function App() {
  return (
    <>
      <main>{/* Content */}</main>
      <ThemeCustomizer position="top-right" />
    </>
  );
}
```

### Example 3: Full Integration with StatusBar and KeyboardShortcuts

```tsx
import {
  ThemeCustomizer,
  KeyboardShortcutsButton,
  StatusBar
} from '@l-kern/ui-components';
import { useState } from 'react';

function App() {
  const [statusBarExpanded, setStatusBarExpanded] = useState(false);
  const [statusBarHeight, setStatusBarHeight] = useState(300);

  return (
    <>
      <main>{/* Content */}</main>

      {/* All floating buttons coordinate positions */}
      <ThemeCustomizer
        statusBarExpanded={statusBarExpanded}
        statusBarHeight={32}
        statusBarExpandedHeight={statusBarHeight}
      />

      <KeyboardShortcutsButton
        statusBarExpanded={statusBarExpanded}
        statusBarHeight={32}
        statusBarExpandedHeight={statusBarHeight}
      />

      <StatusBar
        services={services}
        onExpandedChange={setStatusBarExpanded}
        onExpandedHeightChange={setStatusBarHeight}
      />
    </>
  );
}
```

---

## Known Issues

**No known issues** - Component is stable and production-ready.

---

## Testing

### Key Test Cases

1. **Opens modal on button click**
2. **Applies settings to document root**
3. **Persists settings to localStorage**
4. **Loads settings on mount**
5. **Reset button restores defaults**
6. **Accent color changes button background**
7. **Position adjusts based on StatusBar state**
8. **Modal closes on outside click**
9. **Modal closes on close button click**
10. **All 7 accent colors work correctly**

---

## Related Components

- [StatusBar](../StatusBar/StatusBar.md) - Coordinates positioning
- [KeyboardShortcutsButton](../KeyboardShortcutsButton/KeyboardShortcutsButton.md) - Stacked above ThemeCustomizer
- [BasePage](../BasePage/BasePage.md) - Page layout with theme support

---

## Changelog

### v1.3.0 (2025-11-30)
- ✅ Added button gradient CSS variables (--button-primary-from/to)
- ✅ Added modal header gradient with accent color tint

### v1.2.0 (2025-11-25)
- ✅ Settings now apply to document via CSS variables
- ✅ Added Rose/Pink accent color options

### v1.1.0 (2025-11-24)
- ✅ Fixed to use local state (v4 ThemeContext doesn't have customSettings)

### v1.0.0 (2025-11-24)
- ✅ Initial port from v3

---

**End of ThemeCustomizer Documentation**
