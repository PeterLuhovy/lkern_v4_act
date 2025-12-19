---
id: design-standards
title: Design Standards
sidebar_label: Design Standards
sidebar_position: 1
---

## 🎯 Core Principle: Zero Hardcoded Values

**CRITICAL RULE:** **NO hardcoded values in CSS files.**

**❌ FORBIDDEN:**
```css
.button {
  padding: 12px 24px;        /* WRONG - hardcoded */
  background: #9c27b0;       /* WRONG - hardcoded */
  border-radius: 6px;        /* WRONG - hardcoded */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* WRONG */
}
```

**✅ REQUIRED:**
```css
.button {
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-brand-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}
```

**Exception:** Linear gradients (CSS variables don't interpolate in gradients):
```css
/* ✅ ACCEPTABLE - Gradients only */
background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
```

---

## 🎨 Design Philosophy

### **1. Calm, Fast, Clear**

**User Mental Model:**
> "I manage 100+ tasks daily. Software must get out of my way."

**Priority Order:**
1. **⚡ Speed** - Load fast (&lt;1.5s), respond fast (&lt;200ms)
2. **👁️ Clarity** - User knows what to do without thinking
3. **🧘 Calm UX** - No visual noise, breathing room
4. **🎨 Personality** - Gradients enhance, never distract

---

### **2. Modifier Pattern (Base ± Offset)**

**Problem:** 10 different shades of gray, each 1px different = chaos.

**Solution:** Base value + modifier system.

**Example - Spacing:**
```typescript
// ❌ OLD - Too many constants
SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  mdPlus: 20,    // What is this?
  mdExtra: 24,   // And this?
  lg: 24,        // Duplicate of mdExtra!
  lgPlus: 28,
  xl: 32,
}

// ✅ NEW - Base + modifiers
SPACING = {
  xs: 4,   // 0.25rem
  sm: 8,   // 0.5rem
  md: 16,  // 1rem - base unit
  lg: 24,  // 1.5rem
  xl: 32,  // 2rem
}

// Usage with modifiers
padding: calc(var(--spacing-md) - 4px);  // md - xs = 12px
padding: calc(var(--spacing-lg) + 8px);  // lg + sm = 32px
```

**Pattern:**
- **Base values** in design tokens (4, 8, 16, 24, 32...)
- **Modifiers** via `calc()` in component CSS
- **Naming:** Descriptive size (xs, sm, md, lg, xl) not arbitrary numbers

---

### **3. Performance-First Rules**

#### **Rule 1: Shadow Budget**
- **Max 2 shadow layers** on hover (not 3)
- 3 layers only for focus states

```css
/* ✅ FAST - 2 layers */
box-shadow: var(--shadow-sm), var(--shadow-ring);

/* ❌ SLOW - 3 layers (use only for :focus) */
box-shadow: var(--shadow-inset), var(--shadow-outer), var(--shadow-ring);
```

#### **Rule 2: Transition Limit**
- **Max 2 properties** per transition
- Prefer border-color + box-shadow over background-color

```css
/* ✅ FAST - 2 properties */
transition: border-color 150ms ease-out,
            box-shadow 150ms ease-out;

/* ⚠️ ACCEPTABLE - 3 properties only for state changes */
transition: background 220ms ease-out,
            border-color 220ms ease-out,
            transform 220ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

#### **Rule 3: Animation Duration**
| Duration | User Perception | Use Case |
|----------|----------------|----------|
| 100-150ms | **Instant** ✅ | Hover effects, tooltips |
| 200-220ms | **Fast** | State changes (checkbox) |
| 300ms | **Normal** | Modals open/close |
| 500ms+ | **Too Slow** ❌ | Never use |

```typescript
// Design tokens
ANIMATION = {
  hover: 150,        // Hover effects
  stateChange: 220,  // Checkbox, radio
  modal: 300,        // Modal transitions
}
```

---

## 🎨 Design Token System

### **Color Tokens**

**Philosophy:** Minimal palette, purposeful use.

**Brand Colors (2 only):**
```typescript
COLORS.brand = {
  primary: '#9c27b0',     // Purple
  secondary: '#3366cc',   // Blue
}
```

**Status Colors (4 only):**
```typescript
COLORS.status = {
  success: '#4CAF50',     // Green
  warning: '#FF9800',     // Orange
  error: '#f44336',       // Red
  info: '#2196F3',        // Blue
}
```

**Neutral Grays (System):**
```typescript
COLORS.neutral = {
  white: '#ffffff',
  gray100: '#f5f5f5',     // Backgrounds
  gray300: '#e0e0e0',     // Borders
  gray500: '#9e9e9e',     // Muted text (TOO LIGHT - see below)
  gray600: '#757575',     // Muted text (WCAG AA) ✅
  gray900: '#212121',     // Main text
  black: '#000000',
}
```

**⚠️ CRITICAL: WCAG Compliance**

```typescript
// ❌ WRONG - Fails WCAG AA
--theme-text-muted: #9e9e9e;  // Contrast 2.8:1 on white

// ✅ CORRECT - Passes WCAG AA
--theme-text-muted: #757575;  // Contrast 4.6:1 on white
```

**CSS Variables:**
```css
:root {
  /* Brand */
  --color-brand-primary: #9c27b0;
  --color-brand-secondary: #3366cc;

  /* Status */
  --color-status-success: #4CAF50;
  --color-status-error: #f44336;
  --color-status-warning: #FF9800;
  --color-status-info: #2196F3;

  /* Theme (semantic) */
  --theme-text: #212121;
  --theme-text-muted: #757575;        /* FIXED from #9e9e9e */
  --theme-input-background: #ffffff;
  --theme-input-border: #e0e0e0;
  --theme-border: #e0e0e0;
  --theme-button-text-on-color: #ffffff;
}
```

**Total Colors: 10** (optimal for minimalist design)

---

### **Spacing Tokens**

**8px Grid System** (all values multiples of 4 or 8):

```typescript
SPACING = {
  none: 0,     // No spacing
  xs: 4,       // 0.25rem - Compact padding
  sm: 8,       // 0.5rem - Form field icons
  md: 16,      // 1rem - Base unit, form gaps
  lg: 24,      // 1.5rem - Card padding
  xl: 32,      // 2rem - Modal padding
  xxl: 48,     // 3rem - Section spacing
  xxxl: 64,    // 4rem - Page sections
}
```

**Usage Patterns:**
```css
/* Form field gap */
.formField {
  margin-bottom: var(--spacing-md);  /* 16px */
}

/* Card padding */
.card {
  padding: var(--spacing-lg);        /* 24px */
}

/* Modal content */
.modalContent {
  padding: var(--spacing-xl);        /* 32px */
}

/* Section spacing */
.section + .section {
  margin-top: var(--spacing-xxl);    /* 48px */
}
```

**Modifiers:**
```css
/* Need 12px? Use calc() */
padding: calc(var(--spacing-md) - var(--spacing-xs));  /* 16 - 4 = 12px */

/* Need 20px? */
padding: calc(var(--spacing-md) + var(--spacing-xs));  /* 16 + 4 = 20px */
```

---

### **Typography Tokens**

**Font Sizes (Expressive Scale):**

```typescript
TYPOGRAPHY.fontSize = {
  xs: 12,      // Helper text, captions
  sm: 14,      // Body text, default
  md: 16,      // Emphasized body, small headings
  lg: 18,      // Section headings
  xl: 24,      // Modal titles, page subheadings
  xxl: 32,     // Page titles
  xxxl: 48,    // Hero headings
}
```

**Font Weights:**
```typescript
TYPOGRAPHY.fontWeight = {
  normal: 400,     // Body text (calm)
  medium: 500,     // Slightly emphasized
  semibold: 600,   // Headings (confident)
  bold: 700,       // Strong emphasis (bold)
}
```

**Line Heights:**
```typescript
TYPOGRAPHY.lineHeight = {
  tight: 1.25,     // Headings
  normal: 1.5,     // Body text
  relaxed: 1.75,   // Long-form content
}
```

**Letter Spacing:**
```typescript
TYPOGRAPHY.letterSpacing = {
  tight: '-0.025em',   // Large headings (modern)
  normal: '0',         // Body text
  wide: '0.025em',     // Small caps, labels
}
```

**CSS Variables:**
```css
:root {
  /* Font sizes */
  --text-xs: 12px;
  --text-sm: 14px;
  --text-md: 16px;
  --text-lg: 18px;
  --text-xl: 24px;
  --text-xxl: 32px;
  --text-xxxl: 48px;

  /* Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* Line heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  /* Letter spacing */
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
}
```

**Emotional Hierarchy Pattern:**
```css
/* Hero heading - Impactful */
.headingHero {
  font-size: var(--text-xxxl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}

/* Body text - Calm */
.textBody {
  font-size: var(--text-sm);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  letter-spacing: var(--tracking-normal);
}
```

---

### **Shadow Tokens**

**Shadow System (6 levels):**

```typescript
SHADOWS = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',     // Subtle
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',      // Cards
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',   // Elevated cards
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', // Modals
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', // High elevation
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)', // Inset depth
}
```

**Specialized Shadows:**
```typescript
SHADOWS.focus = {
  default: '0 0 0 3px rgba(156, 39, 176, 0.25)',   // Focus ring
  subtle: '0 0 0 3px rgba(156, 39, 176, 0.15)',    // Checked ring
  hover: '0 0 0 3px rgba(156, 39, 176, 0.1)',      // Hover ring
}

SHADOWS.component = {
  // Checkbox/Radio checked state
  checked: '0 2px 4px rgba(156, 39, 176, 0.25), 0 0 0 3px rgba(156, 39, 176, 0.15)',

  // Button hover
  buttonHover: '0 4px 6px rgba(0, 0, 0, 0.15)',
}
```

**CSS Variables:**
```css
:root {
  /* Base shadows */
  --shadow-none: none;
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);

  /* Focus shadows */
  --shadow-focus: 0 0 0 3px rgba(156, 39, 176, 0.25);
  --shadow-focus-subtle: 0 0 0 3px rgba(156, 39, 176, 0.15);
  --shadow-focus-hover: 0 0 0 3px rgba(156, 39, 176, 0.1);

  /* Component shadows */
  --shadow-checked: var(--shadow-sm), var(--shadow-focus-subtle);
  --shadow-button-hover: 0 4px 6px rgba(0, 0, 0, 0.15);
}
```

**Performance Rule:** Max 2 shadow layers on hover.

---

### **Border Radius Tokens**

```typescript
BORDER_RADIUS = {
  none: 0,
  sm: 4,        // Buttons, inputs
  md: 6,        // Cards
  lg: 8,        // Modals
  xl: 12,       // Large cards
  pill: 9999,   // Pills, badges
}
```

**CSS Variables:**
```css
:root {
  --radius-none: 0;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-pill: 9999px;
}
```

---

### **Animation Tokens**

**Durations:**
```typescript
ANIMATION.duration = {
  instant: 0,
  hover: 150,        // Hover effects
  stateChange: 220,  // Checkbox, radio
  modal: 300,        // Modal open/close
}
```

**Easing Functions:**
```typescript
ANIMATION.easing = {
  linear: 'linear',
  easeOut: 'ease-out',                                      // Hover (smooth)
  easeInOut: 'ease-in-out',                                 // General
  bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',       // State changes
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',                  // Material Design
}
```

**CSS Variables:**
```css
:root {
  /* Durations */
  --duration-instant: 0ms;
  --duration-hover: 150ms;
  --duration-state: 220ms;
  --duration-modal: 300ms;

  /* Easing */
  --ease-out: ease-out;
  --ease-in-out: ease-in-out;
  --ease-bounce: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Usage Rules:**
```css
/* ✅ Hover - Fast, smooth */
.button:hover {
  transition: border-color var(--duration-hover) var(--ease-out),
              box-shadow var(--duration-hover) var(--ease-out);
}

/* ✅ State change - Bounce OK */
.checkbox:checked::after {
  transition: transform var(--duration-state) var(--ease-bounce);
}

/* ❌ Never bounce on hover - feels laggy */
.button:hover {
  transition: all 150ms var(--ease-bounce); /* WRONG */
}
```

---

### **Hover Effects Tokens**

**Lift Effects (translateY):**
```typescript
HOVER.lift = {
  subtle: '-2px',    // Cards (default)
  normal: '-4px',    // DashboardCard
  strong: '-8px',    // Hero CTAs
}
```

**Scale Effects:**
```typescript
HOVER.scale = {
  subtle: '1.002',   // Large elements (cards)
  normal: '1.005',   // Medium elements
  strong: '1.05',    // Small elements (checkbox)
}
```

**CSS Variables:**
```css
:root {
  /* Lift */
  --lift-subtle: -2px;
  --lift-normal: -4px;
  --lift-strong: -8px;

  /* Scale */
  --scale-subtle: 1.002;
  --scale-normal: 1.005;
  --scale-strong: 1.05;
}
```

**Usage Pattern:**
```css
/* Small element (18px checkbox) - Strong scale */
.checkbox:hover {
  transform: scale(var(--scale-strong));  /* 1.05 */
}

/* Large element (card) - Subtle scale */
.card:hover {
  transform: scale(var(--scale-subtle));  /* 1.002 */
}

/* Button - Lift instead of scale */
.button:hover {
  transform: translateY(var(--lift-subtle));  /* -2px */
}
```

**Rule:** Larger element → subtler effect.

---

### **Icon Tokens**

**Philosophy:** Consistent visual language, professional business context.

**Professional Icon Set:**
```typescript
// Location: packages/config/src/constants/icons.ts
// Version: v3.1.0 (Modern colorful emoji design)
// Total: 109 icons across 7 categories

ICONS = {
  navigation: ICONS_NAVIGATION,  // 14 icons
  actions: ICONS_ACTIONS,         // 20 icons
  status: ICONS_STATUS,           // 14 icons
  data: ICONS_DATA,               // 17 icons
  business: ICONS_BUSINESS,       // 16 icons
  system: ICONS_SYSTEM,           // 21 icons
  shapes: ICONS_SHAPES,           // 15 icons
}
```

**Design Characteristics:**
- ✅ **Modern colorful emoji** - Clear, recognizable symbols
- ✅ **Professional context** - Business ERP appropriate (not playful)
- ✅ **High recognizability** - Universally understood meanings
- ✅ **Consistent language** - Curated set from single source
- ✅ **TypeScript support** - Full autocomplete for icon names

**Usage Pattern:**
```typescript
import { ICONS_ACTIONS, ICONS_STATUS } from '@l-kern/config';

// ✅ CORRECT - Using icon constants
const SaveButton = () => (
  <button>{ICONS_ACTIONS.save} Save</button>
);

const SuccessMessage = () => (
  <div>{ICONS_STATUS.success} Success!</div>
);

// ❌ WRONG - Hardcoded emoji
const SaveButton = () => (
  <button>💾 Save</button>  // DON'T DO THIS
);
```

**Icon Categories:**

1. **Navigation (14)** - home, menu, back, forward, expand, collapse, chevrons
2. **Actions (20)** - add, edit, delete, save, search, filter, settings, lock
3. **Status (14)** - success, error, warning, info, active, completed, star
4. **Data (17)** - table, list, card, chart, document, folder, calendar
5. **Business (16)** - user, company, invoice, warehouse, truck, location
6. **System (21)** - dashboard, analytics, database, API, security, tools
7. **Shapes (15)** - circles, squares, triangles, diamonds, stars

**Testing & Exploration:**
- 📋 [/testing/icons](http://localhost:4201/testing/icons) - Interactive icon browser
- 🎯 Click-to-copy functionality for quick development

**Why Icon Constants:**
- ✅ **Single source of truth** - Change once, updates everywhere
- ✅ **Consistency** - Uniform design across entire application
- ✅ **Maintainability** - Easy to update visual style system-wide
- ✅ **Documentation** - Each icon categorized and documented
- ✅ **No hardcoding** - Follows DRY principle (Don't Repeat Yourself)

---

## 🎨 Gradient System

**Philosophy:** Functional gradients, not decorative.

**Brand Gradients:**
```css
/* Checked state - Purple gradient */
--gradient-primary: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);

/* Disabled checked - Gray gradient */
--gradient-disabled: linear-gradient(135deg, #9e9e9e 0%, #757575 100%);

/* Error checked - Red gradient */
--gradient-error: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
```

**Background Gradients (Unchecked):**
```css
/* Unchecked state - White-to-gray */
--gradient-unchecked: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
```

**Radial Gradients (Inner Elements):**
```css
/* Radio inner dot */
--gradient-radial-white: radial-gradient(circle, #ffffff 0%, #f0f0f0 100%);
```

**Performance Note:**
```css
/* ✅ Use for hero elements, form controls */
background: var(--gradient-primary);

/* ⚠️ Avoid in data-heavy lists (use solid color) */
.checkbox--list {
  background: var(--color-brand-primary); /* Solid, not gradient */
}
```

---

## 🧘 UX Design Rules

### **Rule 1: Generous Whitespace**

**From Minimalist Research:** "Whitespace is not empty – it's breathing room."

**Spacing Standards:**

| Element | Minimum | Recommended |
|---------|---------|-------------|
| Form field gap | 16px | 16-24px |
| Card padding | 24px | 24-32px |
| Modal padding | 32px | 32px |
| Section spacing | 48px | 48-64px |

```css
/* ✅ Generous spacing */
.formField {
  margin-bottom: var(--spacing-md);  /* 16px minimum */
}

.card {
  padding: var(--spacing-lg);        /* 24px */
}

.modalContent {
  padding: var(--spacing-xl);        /* 32px */
}

.section + .section {
  margin-top: var(--spacing-xxl);    /* 48px */
}
```

---

### **Rule 2: No Aggressive Animations**

**Calm UX Principle:** "Stillness over speed."

**Bounce Restrictions:**
```css
/* ❌ NEVER bounce on hover - feels laggy */
.element:hover {
  transition: transform 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* ✅ Smooth ease-out on hover */
.element:hover {
  transition: transform var(--duration-hover) var(--ease-out);
}

/* ✅ Bounce OK for state changes */
.checkbox:checked::after {
  transition: transform var(--duration-state) var(--ease-bounce);
}
```

**Scale Limits:**
- Small elements (< 50px): `scale(1.05)` ✅
- Medium elements (50-200px): `scale(1.005)` ✅
- Large elements (> 200px): `scale(1.002)` ✅

---

### **Rule 3: SLIP Navigation**

**SLIP Method:** **S**ort, **L**abel, **I**ntegrate, **P**rioritize

**Max 7 Items Per Section** (Miller's Law):
```typescript
// ❌ BAD - 15 flat items
<Sidebar>
  <Item>Item 1</Item>
  <Item>Item 2</Item>
  ... 15 items total
</Sidebar>

// ✅ GOOD - 5 sections, 3-5 items each
<Sidebar>
  <Section title="Overview">      {/* PRIORITIZE */}
    <Item>Dashboard</Item>
  </Section>

  <Section title="Sales & CRM">   {/* SORT by domain */}
    <Item>Contacts</Item>
    <Item>Sales Orders</Item>
  </Section>

  <Section title="Administration" collapsed> {/* HIDE rarely used */}
    <Item>Settings</Item>
  </Section>
</Sidebar>
```

**Visual Priority:**
```css
/* Primary items (most used) */
.sidebarItem--primary {
  font-size: var(--text-md);
  font-weight: var(--font-semibold);
}

/* Secondary items */
.sidebarItem--secondary {
  font-size: var(--text-sm);
  font-weight: var(--font-normal);
}

/* Tertiary (rare) */
.sidebarItem--tertiary {
  font-size: var(--text-sm);
  font-weight: var(--font-normal);
  opacity: 0.7;
}
```

---

### **Rule 4: SHE Method (Filters)**

**SHE:** **S**hrink, **H**ide, **E**mbody

**Hide Advanced Filters:**
```typescript
// ❌ BAD - All filters visible (cluttered)
<FilterPanel>
  <Input label="Name" />
  <Input label="Email" />
  <Select label="Type" />
  <Select label="Industry" />
  <DatePicker label="Created After" />
</FilterPanel>

// ✅ GOOD - Advanced filters hidden
<FilterPanel>
  <Input label="Quick Search" />
  <Accordion title="Advanced Filters" collapsed>
    <Select label="Type" />
    <Select label="Industry" />
    <DatePicker label="Date Range" />
  </Accordion>
</FilterPanel>
```

**Rule:** If filter used < 20% of time → hide in accordion.

---

## ♿ Accessibility Requirements

### **WCAG AA Compliance**

**Contrast Ratios (Minimum 4.5:1 for text):**

```css
/* ✅ PASS */
--theme-text: #212121 on #ffffff = 16:1 ✅
--theme-text-muted: #757575 on #ffffff = 4.6:1 ✅

/* ❌ FAIL */
--theme-text-muted-OLD: #9e9e9e on #ffffff = 2.8:1 ❌
```

**Focus States (3px ring minimum):**
```css
.element:focus {
  outline: none;
  box-shadow: var(--shadow-focus);  /* 3px at 25% opacity */
}
```

**Touch Targets (Mobile):**
- Minimum: 44px × 44px (iOS guideline)
- Recommended: 48px × 48px (Material Design)

---

## 📊 Component Design Patterns

### **Button Pattern**

```css
.button {
  /* Spacing */
  padding: var(--spacing-sm) var(--spacing-md);

  /* Typography */
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);

  /* Borders */
  border-radius: var(--radius-sm);
  border: 2px solid transparent;

  /* Colors (variants) */
  background: var(--color-brand-primary);
  color: var(--theme-button-text-on-color);

  /* Shadows */
  box-shadow: var(--shadow-sm);

  /* Transitions */
  transition: border-color var(--duration-hover) var(--ease-out),
              box-shadow var(--duration-hover) var(--ease-out);
}

.button:hover {
  border-color: var(--color-brand-primary);
  box-shadow: var(--shadow-button-hover);
  transform: translateY(var(--lift-subtle));
}

.button:focus {
  box-shadow: var(--shadow-focus);
}
```

**Variants:**
```css
.button--secondary {
  background: transparent;
  color: var(--theme-text);
  border-color: var(--theme-input-border);
}

.button--ghost {
  background: transparent;
  color: var(--theme-text);
  box-shadow: none;
}
```

---

### **Card Pattern**

```css
.card {
  /* Spacing */
  padding: var(--spacing-lg);

  /* Borders */
  border-radius: var(--radius-md);
  border: 1px solid var(--theme-border);

  /* Background */
  background: var(--theme-input-background);

  /* Shadows */
  box-shadow: var(--shadow-sm);

  /* Transitions */
  transition: transform var(--duration-hover) var(--ease-out),
              box-shadow var(--duration-hover) var(--ease-out);
}

.card:hover {
  transform: translateY(var(--lift-subtle)) scale(var(--scale-subtle));
  box-shadow: var(--shadow-md);
}
```

**Variants:**
```css
.card--elevated {
  box-shadow: var(--shadow-md);
}

.card--elevated:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(var(--lift-normal));
}

.card--accent {
  border-color: var(--color-brand-primary);
  box-shadow: var(--shadow-sm), var(--shadow-focus-subtle);
}
```

---

### **Form Field Pattern**

```css
.formField {
  /* Spacing */
  margin-bottom: var(--spacing-md);  /* 16px gap */
}

.formFieldLabel {
  /* Typography */
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: var(--leading-normal);

  /* Spacing */
  margin-bottom: var(--spacing-xs);

  /* Color */
  color: var(--theme-text);
}

.formFieldInput {
  /* Spacing */
  padding: var(--spacing-sm) var(--spacing-md);

  /* Typography */
  font-size: var(--text-sm);
  line-height: var(--leading-normal);

  /* Borders */
  border-radius: var(--radius-sm);
  border: 2px solid var(--theme-input-border);

  /* Background */
  background: var(--theme-input-background);

  /* Transitions */
  transition: border-color var(--duration-hover) var(--ease-out),
              box-shadow var(--duration-hover) var(--ease-out);
}

.formFieldInput:hover {
  border-color: var(--color-brand-primary);
}

.formFieldInput:focus {
  border-color: var(--color-brand-primary);
  box-shadow: var(--shadow-focus);
  outline: none;
}
```

---

## 🚀 Implementation Checklist

**Before shipping any component:**

### **Performance ✅**
- [ ] Max 2 shadow layers on hover
- [ ] Max 2 transition properties
- [ ] All transitions ≤ 300ms
- [ ] No bounce on hover (only state changes)
- [ ] Gradients limited (not in lists)

### **Zero Hardcoded Values ✅**
- [ ] All colors via CSS variables
- [ ] All spacing via CSS variables
- [ ] All shadows via CSS variables
- [ ] All border-radius via CSS variables
- [ ] All animations via CSS variables
- [ ] Exception: Linear gradients OK

### **Clarity ✅**
- [ ] SLIP navigation (max 7 items per section)
- [ ] SHE filters (advanced hidden)
- [ ] Visual hierarchy (size + weight)
- [ ] Clear labels (no jargon)

### **Calm UX ✅**
- [ ] Generous whitespace (16px+ gaps)
- [ ] Smooth hover (no bounce)
- [ ] Subtle effects (< 5% scale for large)
- [ ] No pulsing animations

### **Accessibility ✅**
- [ ] WCAG AA contrast (4.5:1)
- [ ] Focus states (3px ring)
- [ ] Keyboard navigable
- [ ] Touch targets ≥ 44px

---

## 📚 References

**Design Token Implementation:**
- File: `packages/config/src/constants/design-tokens.ts`
- Location: All constants defined here

**Implementation Plan:**
- File: `docs/temp/implementation-plan-design-refactor.md`
- Roadmap: Section 1.3.6 Design System Refactor

**Minimalist Research:**
- Source: DesignStudioUIUX.com "13 Best & Inspiring Minimalist Web Design Examples in 2025"
- Analysis: `docs/temp/minimalist-design-analysis.md`

**Industry Standards:**
- WCAG 2.1 Level AA - Accessibility
- Material Design - Animation guidelines
- iOS HIG - Touch target sizes

---

**Document Status:** ✅ Single Source of Truth
**Implementation:** See implementation-plan-design-refactor.md
**Roadmap:** Section 1.3.6
**Version:** 1.0.0
**Last Updated:** 2025-11-02
**Maintainer:** BOSSystems s.r.o.
