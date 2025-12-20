---
id: templates-overview
slug: index
title: Documentation Templates
sidebar_label: Overview
sidebar_position: 1
---

# Documentation Templates

This folder contains standardized templates for documenting components, hooks, and utilities in L-KERN v4.

## Available Templates

| Template | Purpose | Target Location |
|----------|---------|-----------------|
| [Component Template](component.md) | UI Components (Button, Input, Modal, etc.) | `docs/components/` |
| [Hook Template](hook.md) | React Hooks (useFormDirty, useModalWizard, etc.) | `docs/hooks/` |
| [Utility Template](utility.md) | Utility Functions (validateEmail, formatPhone, etc.) | `docs/utils/` |

---

## How to Use

### Step 1: Copy Template

```bash
# For component documentation
cp docs/templates/COMPONENT_TEMPLATE.md docs/components/Button.md

# For hook documentation
cp docs/templates/HOOK_TEMPLATE.md docs/hooks/useFormDirty.md

# For utility documentation
cp docs/templates/UTILITY_TEMPLATE.md docs/utils/email-validation.md
```

### Step 2: Fill In Template

Open the copied file and replace all placeholders:

- `<ComponentName>` → Actual component name (e.g., `Button`)
- `<hookName>` → Actual hook name (e.g., `useFormDirty`)
- `<utility-name>` → Actual utility name (e.g., `email-validation`)
- `YYYY-MM-DD` → Current date
- `vX.Y.Z` → Component/hook/utility version (usually `v1.0.0` for new)
- All placeholder text in sections

### Step 3: Complete All Sections

Every section is **MANDATORY**. Do not skip any section!

**Required sections:**
- ✅ Header (with file path, version, dates)
- ✅ Overview
- ✅ Features
- ✅ Quick Start
- ✅ API Reference (Props/Parameters/Functions)
- ✅ Examples (minimum 3)
- ✅ Known Issues (even if "No known issues")
- ✅ Testing
- ✅ Related Components/Hooks/Utilities
- ✅ Changelog

### Step 4: Update Main Documentation Map

Add link to your new documentation in `docs/README.md`:

```markdown
### 📁 Components
**Location:** `docs/components/`

| Component | Description | Path |
|-----------|-------------|------|
| **Button** | Primary action button with 5 variants | [components/Button.md](components/Button.md) |
| **YOUR_NEW_COMPONENT** | Brief description | [components/YourComponent.md](components/YourComponent.md) |
```

### Step 5: Commit Together

```bash
# Commit code, documentation, and tests together
git add packages/ui-components/src/components/Button/
git add docs/components/Button.md
git add docs/README.md
git commit -m "feat: Add Button component with documentation

- Implementation: Button.tsx + Button.module.css
- Documentation: docs/components/Button.md
- Tests: Button.test.tsx (16 tests, 100% coverage)
"
```

---

## Template Structure

### Component Template

Sections:
1. Overview - What component does
2. Features - List all features
3. Quick Start - Copy-paste ready example
4. Props API - All props with types
5. Visual Design - Variants, sizes
6. Behavior - Interaction states, keyboard navigation
7. Accessibility - WCAG compliance, ARIA attributes
8. Responsive Design - Mobile/tablet/desktop breakpoints
9. Styling - CSS variables used
10. Known Issues - Active issues + fixed issues
11. Testing - Test coverage, test cases
12. Related Components - Links to related docs
13. Usage Examples - Real-world examples
14. Performance - Bundle size, runtime performance
15. Migration Guide - Breaking changes
16. Changelog - Version history

### Hook Template

Sections:
1. Overview - What hook does
2. Features - List all features
3. Quick Start - Copy-paste ready example
4. API Reference - Parameters, options, return value
5. Behavior - Internal logic, dependencies, re-render triggers
6. Examples - Basic, with options, complex scenarios
7. Performance - Memoization, re-render prevention
8. Known Issues - Active issues + fixed issues
9. Testing - Test coverage, test cases
10. Related Hooks/Components - Links to related docs
11. Migration Guide - Breaking changes
12. Changelog - Version history
13. Troubleshooting - Common issues + solutions
14. Best Practices - Usage recommendations

### Utility Template

Sections:
1. Overview - What utility provides
2. Functions - List all exported functions
3. API Reference - Each function signature, parameters, return values, examples
4. Complete Usage Example - Real-world scenario
5. Performance - Complexity analysis, benchmarks
6. Known Issues - Active issues + fixed issues
7. Testing - Test coverage, test cases
8. Related Utilities/Components - Links to related docs
9. Examples by Use Case - Different usage scenarios
10. Migration Guide - Breaking changes
11. Changelog - Version history
12. Troubleshooting - Common issues + solutions
13. Best Practices - Usage recommendations
14. Design Decisions - Why these rules?

---

## Documentation Standards

**Full documentation standards available at:**
`docs/programming/documentation-standards.md`

**Key principles:**
- ✅ Documentation = Specification for tests
- ✅ Known Issues section tracks bugs not yet fixed
- ✅ Changelog tracks version history (newest first)
- ✅ Every code change → Documentation change (same commit)
- ✅ Time investment: 10-60 min → 1-15 hours saved (ROI: 4-20x)

---

## Need Help?

- **Full documentation guide**: [Documentation Standards](../guides/documentation-standards.md)
- **Main documentation map**: [Intro](../intro.md)
- **Coding standards**: [Coding Standards](../guides/coding-standards.md)

---

**Last Updated:** 2025-10-20
**Maintainer:** BOSSystems s.r.o.
