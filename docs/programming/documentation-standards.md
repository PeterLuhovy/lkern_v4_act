# ================================================================
# L-KERN v4 - Documentation Standards
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\programming\documentation-standards.md
# Version: 1.0.0
# Created: 2025-10-20
# Updated: 2025-10-20
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Comprehensive documentation standards for L-KERN v4.
#   Defines structure, templates, and guidelines for documenting
#   components, hooks, utilities, and functions.
# ================================================================

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Documentation Philosophy](#documentation-philosophy)
3. [File Structure](#file-structure)
4. [Mandatory Header Format](#mandatory-header-format)
5. [Component Documentation Template](#component-documentation-template)
6. [Hook Documentation Template](#hook-documentation-template)
7. [Utility Documentation Template](#utility-documentation-template)
8. [Section Guidelines](#section-guidelines)
9. [Workflow Integration](#workflow-integration)
10. [Examples](#examples)

---

## Overview

**Goal**: Every component, hook, and utility function in L-KERN v4 must have comprehensive documentation in a dedicated `.md` file.

**Location**: All documentation files are stored in structured folders under `docs/`:

```
docs/
├── components/          # UI component documentation
│   ├── Button.md
│   ├── Input.md
│   ├── Modal.md
│   └── ...
├── hooks/               # React hooks documentation
│   ├── useFormDirty.md
│   ├── useModalWizard.md
│   └── ...
├── utils/               # Utility functions documentation
│   ├── phone-validation.md
│   ├── email-validation.md
│   └── ...
└── api/                 # API/backend documentation
    ├── contacts-api.md
    └── ...
```

**Main Index**: `docs/README.md` contains links to all documentation.

---

## Documentation Philosophy

### Core Principles

1. ✅ **Documentation as Specification** - Docs define what code SHOULD do
2. ✅ **Written BEFORE Tests** - Tests verify what docs describe
3. ✅ **Updated WITH Code** - Code change = Docs change (same commit)
4. ✅ **Known Issues Tracked** - Bugs documented even if not fixed yet
5. ✅ **Examples First** - Show usage before explaining details

### Why Document?

| Benefit | Impact |
|---------|--------|
| **Faster Onboarding** | New developer productive in 1 day vs 1 week |
| **Better Tests** | Clear spec → complete test coverage |
| **Less Bugs** | Document edge cases → remember to handle them |
| **AI Context** | Claude can read docs → better suggestions |
| **Future-proof** | You in 6 months = new developer |

### Time Investment

| Component Type | Docs Time | Value Returned |
|----------------|-----------|----------------|
| Simple (Button, Input) | 20-30 min | 3-5 hours saved |
| Complex (Modal, Wizard) | 45-60 min | 10-15 hours saved |
| Utility (validateEmail) | 10-15 min | 1-2 hours saved |

**ROI**: 6-15x return on time invested ✅

---

## File Structure

### Naming Convention

**Components**: PascalCase (matches component name)
- ✅ `Button.md` (for Button.tsx)
- ✅ `FormField.md` (for FormField.tsx)
- ✅ `Modal.md` (for Modal.tsx)

**Hooks**: camelCase with "use" prefix
- ✅ `useFormDirty.md` (for useFormDirty.ts)
- ✅ `useModalWizard.md` (for useModalWizard.ts)

**Utilities**: kebab-case describing function group
- ✅ `phone-validation.md` (for validateMobile, formatPhoneNumber, etc.)
- ✅ `email-validation.md` (for validateEmail, normalizeEmail, etc.)

### Location Rules

```
Component → docs/components/<ComponentName>.md
Hook → docs/hooks/<hookName>.md
Utility → docs/utils/<utility-name>.md
API → docs/api/<api-name>.md
```

---

## Mandatory Header Format

**Every documentation file MUST start with this header:**

```markdown
# ================================================================
# <Component/Hook/Utility Name>
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\<category>\<filename>.md
# Version: X.Y.Z
# Created: YYYY-MM-DD
# Updated: YYYY-MM-DD
# Component Location: packages/<package>/src/components/<Name>/<Name>.tsx
# Package: @l-kern/<package-name>
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Brief 1-2 sentence description of what this component/hook/utility does.
# ================================================================
```

**Version Rules:**
- **X**: Major change (breaking API)
- **Y**: Minor change (new features, backwards compatible)
- **Z**: Patch (bug fixes, docs updates)

**Update Rules:**
- Code change → Bump version + update "Updated" date
- Docs-only change → Update "Updated" date only

---

## Component Documentation Template

**File**: `docs/components/<ComponentName>.md`

**Sections** (MANDATORY):

```markdown
# <ComponentName>

## Overview
**Purpose**: One-sentence description
**Package**: @l-kern/ui-components
**Path**: packages/ui-components/src/components/<ComponentName>
**Since**: vX.Y.Z

Brief 2-3 sentence overview of what component does and primary use case.

---

## Features

List all major features with ✅ checkmarks:
- ✅ Feature 1 (e.g., 5 variants: primary, secondary, danger, success, ghost)
- ✅ Feature 2 (e.g., Loading state with spinner)
- ✅ Feature 3 (e.g., Keyboard accessible - Enter, Space, ESC)
- ✅ Feature 4 (e.g., ARIA compliant - aria-busy, aria-label)
- ✅ Feature 5 (e.g., Fully responsive - mobile, tablet, desktop)

---

## Quick Start

### Basic Usage
```tsx
import { ComponentName } from '@l-kern/ui-components';

function MyPage() {
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

#### Pattern 1: [Name]
```tsx
// Example code
```

#### Pattern 2: [Name]
```tsx
// Example code
```

---

## Props API

### ComponentNameProps

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | `ComponentVariant` | `'default'` | No | Visual style variant |
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

**primary** - Main action button
- Background: Purple gradient (#9c27b0 → #7b1fa2)
- Text: White (#ffffff)
- Use: Primary CTAs (Save, Submit, Confirm)

**secondary** - Secondary actions
- Background: Gray (#757575)
- Text: White (#ffffff)
- Use: Cancel, Back, Close

[... document all variants ...]

### Sizes

**sm** - Small (mobile, compact UIs)
- Height: 32px
- Padding: 8px 16px
- Font: 14px

**md** - Medium (default)
- Height: 40px
- Padding: 12px 24px
- Font: 16px

**lg** - Large (hero CTAs)
- Height: 48px
- Padding: 16px 32px
- Font: 18px

---

## Behavior

### Interaction States

**Default** - Normal state
- Cursor: pointer
- Hover: Background darkens 10%
- Active: Background darkens 20%

**Disabled** - Cannot interact
- Cursor: not-allowed
- Opacity: 0.5
- Events: Blocked

**Loading** - Processing
- Spinner: Visible
- Text: Grayed out
- Events: Blocked
- ARIA: aria-busy="true"

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Enter` | Triggers onClick |
| `Space` | Triggers onClick |
| `Tab` | Focus next element |
| `Shift+Tab` | Focus previous element |

---

## Accessibility

### WCAG Compliance
- ✅ **WCAG 2.1 Level AA** compliant
- ✅ Keyboard navigable (Enter, Space)
- ✅ Screen reader support (ARIA labels)
- ✅ Color contrast ratio ≥ 4.5:1
- ✅ Focus visible (2px purple outline)

### ARIA Attributes

```tsx
<button
  role="button"
  aria-label={ariaLabel || children}
  aria-busy={loading}
  aria-disabled={disabled}
  tabIndex={disabled ? -1 : 0}
>
  {children}
</button>
```

### Screen Reader Behavior

- **Normal**: "Save button"
- **Loading**: "Save button, busy"
- **Disabled**: "Save button, disabled"

---

## Responsive Design

### Breakpoints

**Mobile** (< 768px)
- Width: 100% (fullWidth default)
- Padding: Reduced 25%
- Font: -2px

**Tablet** (768px - 1023px)
- Width: Auto
- Padding: Standard
- Font: Standard

**Desktop** (≥ 1024px)
- Width: Auto
- Padding: Standard
- Font: Standard

### Layout Behavior

```tsx
// Mobile: Full width
<ComponentName fullWidth />

// Desktop: Auto width
<ComponentName />
```

---

## Styling

### CSS Variables Used

```css
/* Colors */
--color-brand-primary
--color-brand-primary-dark
--theme-text
--theme-button-text-on-color

/* Spacing */
--spacing-sm
--spacing-md
--spacing-lg

/* Shadows */
--shadow-sm
--shadow-md
```

### Custom Styling

**Via className prop:**
```tsx
<ComponentName className="my-custom-class" />
```

**Via CSS Modules:**
```css
.myButton {
  composes: button from '@l-kern/ui-components/Button.module.css';
  /* Override styles */
}
```

---

## Known Issues

### Active Issues

**Issue #1**: [Short title]
- **Severity**: Low | Medium | High | Critical
- **Affects**: Which props/variants
- **Workaround**: Temporary solution (if any)
- **Tracking**: Task #123 or GitHub issue link
- **Status**: Open | In Progress | Planned

**Example:**
**Issue #1**: Ghost variant missing hover state
- **Severity**: Low
- **Affects**: variant="ghost" only
- **Workaround**: Use secondary variant instead
- **Tracking**: Task #123
- **Status**: Planned for v1.2.0

### Fixed Issues (Changelog)

See [Changelog](#changelog) section below.

---

## Testing

### Test Coverage
- ✅ **Unit Tests**: 16 tests
- ✅ **Coverage**: 100% (statements, branches, functions, lines)
- ✅ **Accessibility Tests**: 5 tests (keyboard, ARIA, focus)
- ✅ **Translation Tests**: 3 tests (SK/EN switching)
- ✅ **Responsive Tests**: 2 tests (mobile, desktop)

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
- ✅ Renders all variants (primary, secondary, danger, success, ghost)
- ✅ Renders all sizes (sm, md, lg)

**Interaction:**
- ✅ onClick triggered on click
- ✅ onClick triggered on Enter key
- ✅ onClick triggered on Space key
- ✅ onClick NOT triggered when disabled

**States:**
- ✅ Loading state shows spinner
- ✅ Disabled state prevents interaction
- ✅ Focus state shows outline

**Accessibility:**
- ✅ ARIA attributes present
- ✅ Keyboard navigation works
- ✅ Screen reader text correct

**Translation:**
- ✅ Text changes when language switches (SK ↔ EN)
- ✅ No hardcoded text in component

---

## Related Components

- **[Input](Input.md)** - Form input field
- **[FormField](FormField.md)** - Label + Input wrapper
- **[Modal](Modal.md)** - Modal dialog (uses Button in footer)

---

## Usage Examples

### Example 1: Basic Save Button
```tsx
import { Button } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';

function SaveButton() {
  const { t } = useTranslation();

  const handleSave = () => {
    console.log('Saving...');
  };

  return (
    <Button variant="primary" onClick={handleSave}>
      {t('common.save')}
    </Button>
  );
}
```

### Example 2: Loading State
```tsx
function SaveButtonWithLoading() {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSave = async () => {
    setLoading(true);
    await saveData();
    setLoading(false);
  };

  return (
    <Button
      variant="primary"
      onClick={handleSave}
      loading={loading}
      disabled={loading}
    >
      {loading ? t('common.saving') : t('common.save')}
    </Button>
  );
}
```

### Example 3: Danger Button with Confirmation
```tsx
function DeleteButton() {
  const { confirm } = useConfirm();
  const { t } = useTranslation();

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: t('contacts.deleteConfirmTitle'),
      message: t('contacts.deleteConfirmMessage'),
      variant: 'danger'
    });

    if (confirmed) {
      await deleteContact();
    }
  };

  return (
    <Button variant="danger" onClick={handleDelete}>
      {t('common.delete')}
    </Button>
  );
}
```

---

## Performance

### Bundle Size
- **JS**: 2.3 KB (gzipped)
- **CSS**: 1.1 KB (gzipped)
- **Total**: 3.4 KB

### Runtime Performance
- **Render time**: < 1ms (average)
- **Re-renders**: Optimized with React.memo (if applicable)
- **Memory**: Negligible (<1KB per instance)

### Optimization Tips
- ✅ Use `React.memo()` if parent re-renders frequently
- ✅ Memoize `onClick` handler with `useCallback()`
- ✅ Avoid inline styles (use CSS Modules)

---

## Migration Guide

### From v3 to v4

**Breaking Changes:**
1. Prop `type` renamed to `variant`
2. Removed `outline` prop (use variant="secondary-outline")
3. `loading` prop now requires explicit `disabled={loading}`

**Migration Example:**
```tsx
// v3
<Button type="primary" outline loading>Save</Button>

// v4
<Button variant="primary-outline" loading disabled>
  {t('common.save')}
</Button>
```

---

## Changelog

### v1.1.0 (2025-10-19)
- ✅ Added `aria-busy` attribute for loading state
- ✅ Improved keyboard navigation (Enter + Space)
- ✅ Fixed ghost variant hover state (Issue #123)

### v1.0.1 (2025-10-18)
- 🐛 Fixed responsive padding on mobile
- 🐛 Fixed disabled state opacity

### v1.0.0 (2025-10-18)
- 🎉 Initial release
- ✅ 5 variants (primary, secondary, danger, success, ghost)
- ✅ 3 sizes (sm, md, lg)
- ✅ Loading state
- ✅ 16 unit tests (100% coverage)

---

## Contributing

### Adding New Variant

1. Add variant to `ButtonVariant` type
2. Create CSS class in `Button.module.css`
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

**Last Updated**: 2025-10-20
**Maintainer**: BOSSystems s.r.o.
**Documentation Version**: 1.0.0
```

---

## Hook Documentation Template

**File**: `docs/hooks/<hookName>.md`

**Sections** (MANDATORY):

```markdown
# <hookName>

## Overview
**Purpose**: One-sentence description
**Package**: @l-kern/config
**Path**: packages/config/src/hooks/<hookName>
**Since**: vX.Y.Z

Brief 2-3 sentence overview of what hook does.

---

## Features

- ✅ Feature 1
- ✅ Feature 2
- ✅ Feature 3

---

## Quick Start

### Basic Usage
```tsx
import { hookName } from '@l-kern/config';

function MyComponent() {
  const { value1, value2, method1 } = hookName(initialValue, options);

  return <div>{value1}</div>;
}
```

---

## API Reference

### Parameters

```typescript
function hookName<T>(
  param1: Type1,
  param2: Type2,
  options?: HookOptions
): HookResult<T>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `param1` | `Type1` | Yes | Description |
| `param2` | `Type2` | Yes | Description |
| `options` | `HookOptions` | No | Configuration options |

### Options

```typescript
interface HookOptions {
  option1?: boolean;  // Description (default: false)
  option2?: string[];  // Description (default: [])
}
```

### Return Value

```typescript
interface HookResult<T> {
  value1: T;              // Description
  value2: boolean;        // Description
  method1: () => void;    // Description
}
```

---

## Examples

### Example 1: Basic Usage
```tsx
// Code example
```

### Example 2: With Options
```tsx
// Code example
```

### Example 3: Complex Scenario
```tsx
// Code example
```

---

## Behavior

### Internal Logic
Explain how hook works internally (state management, side effects, etc.)

### Dependencies
- React hooks used: useState, useEffect, useMemo, etc.
- External dependencies

### Side Effects
- What side effects does hook trigger?
- When are effects cleaned up?

---

## Performance

### Memoization
- What values are memoized?
- When do values re-compute?

### Re-render Triggers
- What causes hook to re-run?
- How to optimize?

### Memory Usage
- Typical memory footprint
- Cleanup behavior

---

## Known Issues

[Same as component template]

---

## Testing

[Same as component template]

---

## Related Hooks

- **[otherHook](otherHook.md)** - Description

---

## Changelog

[Same as component template]

---

## Resources

[Same as component template]
```

---

## Utility Documentation Template

**File**: `docs/utils/<utility-name>.md`

**Sections** (MANDATORY):

```markdown
# <Utility Name>

## Overview
**Purpose**: One-sentence description
**Package**: @l-kern/config
**Path**: packages/config/src/utils/<utility-name>
**Since**: vX.Y.Z

Brief 2-3 sentence overview.

---

## Functions

List all functions in this utility file:

### validateEmail
Validates email address format.

### normalizeEmail
Converts email to lowercase and trims whitespace.

### getEmailDomain
Extracts domain from email address.

[... list all functions ...]

---

## API Reference

### Function 1: validateEmail

**Signature:**
```typescript
function validateEmail(email: string): boolean
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | `string` | Yes | Email address to validate |

**Returns:**
- `true` if email is valid (RFC 5322 compliant)
- `false` if email is invalid

**Validation Rules:**
- ✅ Must contain exactly one `@` symbol
- ✅ Local part: 1-64 characters, alphanumeric + `.` `_` `-` `+`
- ✅ Domain: Valid domain name with TLD
- ✅ No spaces or special characters (except allowed)

**Examples:**
```typescript
validateEmail('peter@example.com');      // true
validateEmail('peter+test@example.com'); // true
validateEmail('invalid@');               // false
validateEmail('no-at-sign.com');         // false
```

---

### Function 2: normalizeEmail

[Repeat structure for each function]

---

## Examples

### Example 1: Email Validation
```typescript
import { validateEmail } from '@l-kern/config';

const email = 'user@example.com';
if (validateEmail(email)) {
  console.log('Valid email');
} else {
  console.log('Invalid email');
}
```

---

## Performance

### Complexity
- validateEmail: O(n) where n = email length
- normalizeEmail: O(n)

### Benchmarks
- validateEmail: ~0.01ms per call (1000 char email)
- normalizeEmail: ~0.005ms per call

---

## Known Issues

[Same as component template]

---

## Testing

### Test Coverage
- ✅ **Unit Tests**: 43 tests
- ✅ **Coverage**: 100%

### Test File
`packages/config/src/utils/<utility-name>.test.ts`

### Key Test Cases
- ✅ Valid inputs
- ✅ Invalid inputs
- ✅ Edge cases (empty string, null, undefined)
- ✅ Special characters
- ✅ Unicode support

---

## Related Utilities

- **[phone-validation](phone-validation.md)** - Phone number utilities
- **[date-validation](date-validation.md)** - Date utilities

---

## Changelog

[Same as component template]

---

## Resources

[Same as component template]
```

---

## Section Guidelines

### Overview Section
- **Purpose**: 1 sentence (what component does)
- **Package**: @l-kern/package-name
- **Path**: Full path to source file
- **Since**: Version when first released
- **Description**: 2-3 sentences max

### Features Section
- Use ✅ checkmarks
- One feature per line
- Be specific (not "supports sizes" but "3 sizes: sm, md, lg")

### Quick Start Section
- **MOST IMPORTANT** - Users read this first
- Show simplest possible usage
- Include import statement
- Full working example (copy-paste ready)

### Props/API Section
- Table format with columns: Prop, Type, Default, Required, Description
- Full TypeScript type definitions
- Explain each type (don't just say "string")

### Examples Section
- **Minimum 3 examples**: Basic, Intermediate, Advanced
- Real-world use cases (not toy examples)
- Complete code (not fragments)
- Add explanatory comments

### Known Issues Section
- **ALWAYS include** (even if empty with "No known issues")
- Severity: Low | Medium | High | Critical
- Workaround: Temporary solution
- Tracking: Link to task/issue
- Status: Open | In Progress | Planned

### Testing Section
- Total test count
- Coverage percentage
- Link to test file
- Key test cases list

### Changelog Section
- Newest version first
- Use emojis: 🎉 (initial), ✅ (feature), 🐛 (bugfix), ⚠️ (breaking)
- Format: `### vX.Y.Z (YYYY-MM-DD)`

---

## Workflow Integration

### When Creating New Component/Hook/Utility

**MANDATORY Steps:**

1. ✅ **Write code** - Implement component/hook/utility
2. ✅ **Create documentation** - Use template, 20-60 min investment
3. ✅ **Write tests** - Use documentation as spec
4. ✅ **Update docs/README.md** - Add link to new documentation
5. ✅ **Git commit** - Code + docs + tests together

**Commit Message Format:**
```
feat: Add Button component with 5 variants

- Implementation: Button.tsx + Button.module.css
- Documentation: docs/components/Button.md
- Tests: Button.test.tsx (16 tests, 100% coverage)
```

### When Modifying Existing Component/Hook/Utility

**MANDATORY Steps:**

1. ✅ **Modify code** - Make changes
2. ✅ **Update documentation** - Change affected sections
   - Update "Updated" date in header
   - Bump version (X.Y.Z)
   - Add entry to Changelog
   - Update props/API if changed
   - Update examples if needed
3. ✅ **Update tests** - Reflect new behavior
4. ✅ **Git commit** - Code + docs + tests together

**Commit Message Format:**
```
feat: Add loading state to Button component

- Added loading prop (boolean)
- Shows spinner when loading
- Updated docs/components/Button.md (v1.0.0 → v1.1.0)
- Added 3 new tests (loading state)
```

### When Finding Bug (Not Fixing Yet)

**MANDATORY Steps:**

1. ✅ **Create task** - In project management system (get Task #123)
2. ✅ **Update documentation** - Add to "Known Issues" section
3. ✅ **Git commit** - Documentation update

**Commit Message Format:**
```
docs: Document known issue with Button ghost variant

- Issue #1: Ghost variant missing hover state
- Severity: Low
- Tracking: Task #123
- Status: Planned for v1.2.0
```

### When Fixing Bug

**MANDATORY Steps:**

1. ✅ **Fix code** - Implement bugfix
2. ✅ **Update documentation** - Move from "Known Issues" to "Changelog"
   - Remove from "Known Issues" section
   - Add to Changelog (🐛 emoji)
   - Bump patch version (X.Y.Z → X.Y.Z+1)
3. ✅ **Update/add tests** - Verify fix works
4. ✅ **Git commit** - Code + docs + tests together

**Commit Message Format:**
```
fix: Button ghost variant hover state

- Added hover background color for ghost variant
- Moved from Known Issues to Changelog
- Updated docs/components/Button.md (v1.0.1 → v1.0.2)
- Added test: "Ghost variant darkens on hover"

Fixes Task #123
```

---

## Examples

### Example: Button Component Documentation

See full template in [Component Documentation Template](#component-documentation-template) section above.

Key highlights:
- ✅ Complete header with version, dates, paths
- ✅ Features list (5 variants, 3 sizes, loading, accessibility)
- ✅ Quick Start with copy-paste example
- ✅ Props table with all details
- ✅ Visual Design section (variant descriptions)
- ✅ Accessibility section (WCAG AA, ARIA, keyboard)
- ✅ Known Issues section (even if empty)
- ✅ Testing section (16 tests, 100% coverage)
- ✅ Changelog (version history)

### Example: useFormDirty Hook Documentation

See full template in [Hook Documentation Template](#hook-documentation-template) section above.

Key highlights:
- ✅ Parameters table (initialData, currentData, options)
- ✅ Return value interface
- ✅ Internal logic explanation
- ✅ Performance notes (memoization, re-renders)
- ✅ Examples (basic, with options, complex)

### Example: Email Validation Utility Documentation

See full template in [Utility Documentation Template](#utility-documentation-template) section above.

Key highlights:
- ✅ All functions listed upfront
- ✅ Each function: Signature, Parameters, Returns, Examples
- ✅ Performance benchmarks (O(n) complexity)
- ✅ 43 tests, 100% coverage

---

## Summary

### Documentation Standards Checklist

**Every component/hook/utility MUST have:**

- ✅ Dedicated `.md` file in `docs/<category>/`
- ✅ Mandatory header (version, dates, paths)
- ✅ Overview (purpose, package, path, description)
- ✅ Features list (with ✅ checkmarks)
- ✅ Quick Start (copy-paste ready example)
- ✅ API Reference (props/parameters table)
- ✅ Examples (minimum 3: basic, intermediate, advanced)
- ✅ Accessibility section (WCAG compliance)
- ✅ Known Issues section (even if "No known issues")
- ✅ Testing section (test count, coverage, key cases)
- ✅ Related Components/Hooks/Utilities
- ✅ Changelog (version history)

**Workflow:**
- ✅ Write code → Create docs → Write tests → Commit together
- ✅ Modify code → Update docs (version, changelog) → Update tests → Commit together
- ✅ Find bug → Add to "Known Issues" → Commit
- ✅ Fix bug → Update docs (move to Changelog) → Commit

**Time Investment:**
- Simple: 20-30 min → 3-5 hours saved (ROI: 6-10x)
- Complex: 45-60 min → 10-15 hours saved (ROI: 10-20x)
- Utility: 10-15 min → 1-2 hours saved (ROI: 4-8x)

---

**This documentation standard ensures:**
1. ✅ Every component/hook/utility is fully documented
2. ✅ Documentation is specification for tests
3. ✅ Known issues are tracked transparently
4. ✅ Future developers (including you) save hours
5. ✅ AI assistants can provide better help

**Last Updated**: 2025-10-20
**Maintainer**: BOSSystems s.r.o.
**Documentation Version**: 1.0.0
