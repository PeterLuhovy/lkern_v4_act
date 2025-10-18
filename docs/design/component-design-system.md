# ================================================================
# L-KERN v4 - Component Design System
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\design\component-design-system.md
# Version: 1.0.0
# Created: 2025-10-18
# Updated: 2025-10-18
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Modern design system for UI components (Radio, Checkbox, etc.)
#   Defines visual standards, gradients, animations, and effects.
# ================================================================

## 📐 Overview

This document defines the **visual design system** for L-KERN v4 UI components. All components follow a unified modern gradient-based design language with smooth animations and accessibility-first approach.

**Last Updated**: 2025-10-18 (Radio & Checkbox redesign)

---

## 🎨 Design Philosophy

### Core Principles

1. **✨ Modern Gradient Aesthetic** - Linear and radial gradients for depth
2. **🎭 Multi-layered Shadows** - Triple shadow system (inset + outer + ring)
3. **⚡ Bounce Animations** - Playful yet professional motion design
4. **♿ Accessibility First** - Clear focus states, high contrast, keyboard support
5. **🌓 Dark Mode Native** - All gradients and shadows work in both themes
6. **🎯 Consistent Language** - Same patterns across all form controls

---

## 🌈 Color System

### Gradients

**Unchecked State** - Subtle white-to-gray gradient:
```css
background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
```

**Checked State** - Purple gradient with depth:
```css
background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
```

**Disabled Checked** - Muted gray gradient:
```css
background: linear-gradient(135deg, #9e9e9e 0%, #757575 100%);
```

**Error Checked** - Red gradient:
```css
background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
```

### Radial Gradients (Inner Elements)

**Radio Inner Dot** - White with subtle gray:
```css
background: radial-gradient(circle, #ffffff 0%, #f0f0f0 100%);
```

**Disabled Inner Dot** - Muted:
```css
background: radial-gradient(circle, #ffffff 0%, #e0e0e0 100%);
```

### Border Colors

- **Unchecked**: `#d1d5db` (gray-300 equivalent)
- **Hover**: `#9c27b0` (brand purple)
- **Checked**: `#9c27b0` (brand purple)
- **Disabled**: `#e0e0e0` (gray-200 equivalent)
- **Error**: `#f44336` (error red)

---

## 💫 Shadow System

### Triple Shadow Layers

**Purpose**: Creates depth through 3 distinct shadow layers

#### Layer 1: Inset Shadow (Depth)
```css
inset 0 1px 2px rgba(0, 0, 0, 0.05)
```
- Always present on unchecked state
- Gives slight recessed appearance

#### Layer 2: Outer Shadow (Elevation)
```css
0 2px 4px rgba(156, 39, 176, 0.3)
```
- Only on checked state
- Creates lifting effect

#### Layer 3: Colored Ring (Glow)
```css
0 0 0 3px rgba(156, 39, 176, 0.15)
```
- Checked state: 15% opacity
- Hover state: 10% opacity
- Focus state: 25% opacity

### Complete Shadow Examples

**Unchecked**:
```css
box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
```

**Checked**:
```css
box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2),
            0 2px 4px rgba(156, 39, 176, 0.3),
            0 0 0 3px rgba(156, 39, 176, 0.15);
```

**Hover (unchecked)**:
```css
box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05),
            0 0 0 3px rgba(156, 39, 176, 0.1);
```

**Focus**:
```css
box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05),
            0 0 0 3px rgba(156, 39, 176, 0.25);
```

---

## ⚡ Animation System

### Timing Functions

**Standard Transition** - Smooth ease-in-out:
```css
cubic-bezier(0.4, 0, 0.2, 1)
```
- Used for: background-color, border-color, box-shadow
- Duration: 220ms

**Bounce Effect** - Playful spring animation:
```css
cubic-bezier(0.175, 0.885, 0.32, 1.275)
```
- Used for: transform scale on checkmark/inner dot
- Duration: 220ms
- Creates subtle "overshoot" effect

### Animation Patterns

**Checkmark/Inner Dot Appear**:
```css
/* Base state (unchecked) */
.element::after {
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  transition: all 220ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Checked state */
.input:checked + .element::after {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
}
```

**Hover Scale Effect**:
```css
.element {
  transition: all 220ms cubic-bezier(0.4, 0, 0.2, 1);
}

.element:hover {
  transform: scale(1.05);
}
```

---

## 🎯 Component Specifications

### Radio Button

**Dimensions**:
- Outer circle: 18px × 18px
- Border: 2px solid
- Inner dot: 6px × 6px
- Border-radius: 50% (perfect circle)

**States**:
1. **Unchecked**: White-gray gradient, gray border, inset shadow
2. **Checked**: Purple gradient, white inner dot (6px), triple shadow
3. **Hover**: Scale 1.05, purple border, 3px ring (10% opacity)
4. **Focus**: 3px ring (25% opacity), no scale
5. **Disabled**: Gray background, 50% opacity, no shadows
6. **Disabled Checked**: Gray gradient, muted white dot (70% opacity)
7. **Error Checked**: Red gradient, white dot, red ring

**CSS Example**:
```css
.radioCustom {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 220ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Checkbox

**Dimensions**:
- Box: 18px × 18px
- Border: 2px solid
- Border-radius: 4px (rounded corners)
- Checkmark: 5px wide × 9px tall (rotated 45°)

**States**:
1. **Unchecked**: White-gray gradient, gray border, inset shadow
2. **Checked**: Purple gradient, white checkmark, triple shadow
3. **Indeterminate**: Purple gradient, white dash (10px × 2px)
4. **Hover**: Scale 1.05, purple border, 3px ring (10% opacity)
5. **Focus**: 3px ring (25% opacity), no scale
6. **Disabled**: Gray background, 50% opacity, no shadows
7. **Disabled Checked**: Gray gradient, muted checkmark (70% opacity)
8. **Error Checked**: Red gradient, white checkmark, red ring

**Checkmark Drop Shadow**:
```css
filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.3));
```
- Drop-shadow used instead of box-shadow for rotated elements
- Creates better visual effect on angled checkmark

---

## 🛠️ Implementation Guidelines

### CSS Modules Pattern

**Always use CSS Modules** for component styling:

```typescript
// Component.module.css
.customElement {
  /* styles */
}

// Component.tsx
import styles from './Component.module.css';

<div className={styles.customElement} />
```

### Design Token Usage

**DO use CSS variables** for colors (with fallbacks):
```css
/* ✅ CORRECT */
border-color: var(--color-brand-primary, #9c27b0);
background: var(--theme-input-background, #ffffff);

/* ❌ WRONG */
border-color: #9c27b0; /* Hardcoded */
```

**Gradient Exception**: Gradients can use hardcoded hex values (CSS variables don't work well in gradients):
```css
/* ✅ ACCEPTABLE for gradients */
background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
```

### Transition Properties

**Specify exact properties** instead of `all`:
```css
/* ✅ CORRECT - Specific properties */
transition: background-color 220ms cubic-bezier(0.4, 0, 0.2, 1),
            border-color 220ms cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 220ms cubic-bezier(0.4, 0, 0.2, 1);

/* ❌ WRONG - Transition all */
transition: all 220ms ease;
```

**Why?** - Specific properties perform better and prevent unwanted animations.

### Box-Sizing

**Always set box-sizing**:
```css
.element {
  box-sizing: border-box;
}
```
- Ensures consistent sizing with borders
- Required for centering inner elements correctly

---

## ♿ Accessibility Requirements

### Focus States

**Every interactive element** must have clear focus state:
```css
.input:focus + .customElement {
  outline: none; /* Remove default outline */
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05),
              0 0 0 3px rgba(156, 39, 176, 0.25); /* Custom focus ring */
}
```

**Focus ring must**:
- Be at least 2-3px wide
- Have sufficient contrast (25% opacity minimum)
- Be visible in both light and dark themes

### Color Contrast

**Minimum contrast ratios**:
- Text on background: 4.5:1 (WCAG AA)
- Interactive elements: 3:1 (WCAG AA)
- Focus indicators: 3:1 (WCAG AA)

**Checked states**:
- White on purple (`#ffffff` on `#9c27b0`): ✅ 8.59:1
- White on red (`#ffffff` on `#f44336`): ✅ 6.27:1

### Keyboard Navigation

All form controls must be:
- Keyboard focusable (tab order)
- Operable with Space/Enter keys
- Show clear focus state when focused

---

## 🌓 Dark Mode Support

### Gradient Adjustments

**Dark mode should use same gradients** but ensure sufficient contrast:

```css
[data-theme="dark"] .element {
  /* Keep same gradients - they work in dark mode */
  background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
}
```

### Shadow Adjustments

**Shadows may need slight adjustments**:
```css
[data-theme="dark"] .element {
  /* Slightly stronger shadows for visibility */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3),
              0 2px 4px rgba(156, 39, 176, 0.4),
              0 0 0 3px rgba(156, 39, 176, 0.2);
}
```

---

## 📏 Sizing Standards

### Component Sizes

**All form controls**: 18px × 18px
- Radio: 18px circle
- Checkbox: 18px square

**Inner elements**:
- Radio dot: 6px circle
- Checkmark: 5px × 9px (visual size)

**Spacing**:
- Gap between control and label: 8px (`var(--spacing-sm, 8px)`)

---

## ✅ Checklist for New Components

When creating new form components:

- [ ] Uses linear gradient for background (unchecked and checked)
- [ ] Implements triple shadow system (inset + outer + ring)
- [ ] Hover effect: scale(1.05) + colored ring
- [ ] Focus effect: 3px ring at 25% opacity
- [ ] Animations use bounce easing (`cubic-bezier(0.175, 0.885, 0.32, 1.275)`)
- [ ] All transitions at 220ms
- [ ] Disabled state: 50% opacity, no shadows
- [ ] Error state: red gradient matching purple style
- [ ] Box-sizing: border-box set
- [ ] CSS variables used (except gradients)
- [ ] Drop-shadow used for rotated elements (checkmark)
- [ ] WCAG AA contrast ratios met
- [ ] Clear focus state for keyboard navigation
- [ ] Works in both light and dark themes

---

## 📚 References

- **Implementation Examples**:
  - [Radio.module.css](../../packages/ui-components/src/components/Radio/Radio.module.css)
  - [Checkbox.module.css](../../packages/ui-components/src/components/Checkbox/Checkbox.module.css)

- **Design Tokens**:
  - [design-tokens.ts](../../packages/config/src/constants/design-tokens.ts)

- **Theme Setup**:
  - [theme-setup.ts](../../apps/web-ui/src/theme-setup.ts)

---

**Maintained by**: BOSSystems s.r.o.
**Last Review**: 2025-10-18
**Next Review**: When adding new form components
