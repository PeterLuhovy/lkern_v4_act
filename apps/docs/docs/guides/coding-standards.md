---
id: coding-standards
title: Coding Standards (Core Rules)
sidebar_label: Coding Standards
sidebar_position: 1
---

# L-KERN v4 - Coding Standards (Core Rules)

**Version:** 2.2.0
**Last Updated:** 2025-11-25
**Project:** BOSS (Business Operating System Service)
**Developer:** BOSSystems s.r.o.

Core coding standards for L-KERN v4. This file contains ONLY the fundamental rules. Detailed standards are in separate files.

---

## 📋 Overview

This document defines **core coding standards** for L-KERN v4 project. All rules are **MANDATORY**.

**Key Principles:**
- ✅ **Simplicity First** - Readable code over clever solutions
- ✅ **DRY Compliance** - Don't Repeat Yourself (Single Source of Truth)
- ✅ **Type Safety** - TypeScript strict mode + Python type hints
- ✅ **Documentation** - Every file must have header and comments
- ✅ **Testability** - Code must be testable (unit + integration)

**For detailed standards, see:**
- [frontend-standards](frontend-standards.md) - React, TypeScript, Vite
- [backend-standards](backend-standards.md) - Python, FastAPI, gRPC, Kafka
- [docker-standards](docker-standards.md) - Docker, docker-compose
- [code-examples](code-examples.md) - Practical code examples

---

## 1. Language & Communication

### Language Requirements

**Communication:**
- ✅ **ALWAYS respond in Slovak** - All AI assistant communication in Slovak
- ✅ **Documentation in English** - All `.md` files in English
- ✅ **Code in English** - Variables, functions, classes use English naming
- ✅ **Comments in Slovak** - Code comments in Slovak for better understanding

**Multilingual Support:**
- ✅ **NO hardcoded text** - All user-facing text via translation system
- ✅ **Translation package** - Centralized translations in `@l-kern/config`
- ✅ **Primary languages** - Slovak (default) + English
- ✅ **Fallback system** - If translation missing, show Slovak + SK: prefix + console warning

### Translation System

**Structure:**
```
packages/config/src/translations/
├── index.ts      # Main export + useTranslation hook
├── sk.ts         # Slovak texts (default language)
├── en.ts         # English translations
└── types.ts      # TypeScript interfaces
```

**Usage:**
```typescript
import { useTranslation } from '@l-kern/config';

const MyComponent = () => {
  const { t, currentLanguage, setLanguage } = useTranslation();

  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <button>{t('common.buttons.save')}</button>
    </div>
  );
};
```

**Rules:**
- ✅ Import ONLY `useTranslation` hook
- ✅ All translations loaded at startup (no lazy loading)
- ✅ TypeScript autocomplete for translation keys
- ✅ Missing translation → show Slovak + SK: + console warning

---

## 2. Development Workflow

### Educational Development Process

**L-KERN v4 is an educational project** - code is written with emphasis on learning and understanding.

**Mandatory steps:**

1. **Documentation-first** - ALWAYS read documentation before creating files
2. **Check roadmap** - See if task exists in ROADMAP.md, if not add it
3. **Propose workflow** - For complex tasks create detailed TODO workflow
4. **Think thoroughly** - Consider all implications, dependencies, and potential problems
5. **Update docs** - After workflow approval update PROJECT-OVERVIEW.md
6. **Educational approach** - Generate code → explain what, why, and purpose → wait for approval → next chunk
7. **Incremental development** - Small steps, frequent commits, frequent explanations
8. **Wait for approval** - Always wait for "dobre" from user before proceeding
9. **Update roadmap** - After completion mark task as ✅ DONE in ROADMAP.md

### Workflow Rules

**MANDATORY checks before creating files:**
- ✅ Check documentation map - relevant documents
- ✅ Check design standards - design requirements
- ✅ Check coding standards - programming patterns
- ✅ Check architecture - project structure
- ✅ NEVER create custom solutions if documentation defines standard
- ✅ Warn user if creating file against documentation

---

## 3. File Headers

### Mandatory File Headers

**EVERY file MUST start with standardized header** - no exceptions.

**JavaScript/TypeScript:**
```javascript
/*
 * ================================================================
 * FILE: filename.ts
 * PATH: /apps/web-ui/src/pages/filename.ts
 * DESCRIPTION: Brief description of file purpose
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 15:30:00
 * ================================================================
 */
```

**Python:**
```python
"""
================================================================
FILE: filename.py
PATH: /services/lkms101-contacts/app/main.py
DESCRIPTION: Brief description of file purpose
VERSION: v1.0.0
UPDATED: 2025-10-18 15:30:00
================================================================
"""
```

**Header rules:**
- ✅ **Automatic updates** - On every edit increment version and update timestamp
- ✅ **Semantic versioning** - v1.0.1 (patch), v1.1.0 (feature), v2.0.0 (breaking)
- ✅ **Timestamp format** - YYYY-MM-DD HH:MM:SS
- ✅ **Description in English** - Brief and clear description

---

## 4. DRY Principle & Constants

### Don't Repeat Yourself

**MANDATORY: Extract ALL hardcoded values to CONSTANTS section.**

**What to extract:**
- ✅ API endpoints
- ✅ Timeouts and delays
- ✅ Layout sizes (widths, heights, breakpoints)
- ✅ Business rules (pagination size, max file size)
- ✅ Colors (use design tokens from @l-kern/config)
- ✅ Icons (use icon constants from @l-kern/config)
- ✅ Default values
- ❌ Small numbers (0, 1, 2) and booleans can stay inline

### Constants Documentation

**Every constant MUST have documentation:**

```typescript
// === CONSTANTS ===

// API endpoints for microservices communication
// Why: Centralized URLs for easy deployment changes
// When to change: On API version update or architecture change
const API_ENDPOINTS = {
  CONTACTS: '/api/v1/contacts',     // Contact service (lkms101)
  CUSTOMERS: '/api/v1/customers',   // Customer service (lkms103)
  ORDERS: '/api/v1/orders'          // Order service (lkms102)
};
```

---

## 5. Theme CSS Variables

### MANDATORY CSS Variable Usage

**ALL colors in CSS MUST use `--theme-*` variables** (NOT hardcoded colors, NOT `--color-*` variables).

**Available theme variables:**
- ✅ `--theme-text` - Default text color (#212121)
- ✅ `--theme-text-muted` - Muted/disabled text (#9e9e9e)
- ✅ `--theme-input-background` - Input background (#ffffff)
- ✅ `--theme-input-border` - Input border color (#e0e0e0)
- ✅ `--theme-border` - General border color (#e0e0e0)
- ✅ `--theme-button-text-on-color` - Text on colored buttons (#ffffff)

**Status colors** (use directly):
- ✅ `--color-status-success` - Success green (#4CAF50)
- ✅ `--color-status-error` - Error red (#f44336)
- ✅ `--color-status-warning` - Warning orange (#FF9800)
- ✅ `--color-status-info` - Info blue (#2196F3)

**Brand colors** (use directly for branding elements):
- ✅ `--color-brand-primary` - Primary purple (#9c27b0)
- ✅ `--color-brand-secondary` - Secondary blue (#3366cc)

### Correct vs Wrong Usage

**✅ CORRECT - Using theme variables:**
```css
.button--primary {
  background: var(--color-brand-primary, #9c27b0);
  color: var(--theme-button-text-on-color, #ffffff);
}

.input {
  background: var(--theme-input-background, #ffffff);
  border: 2px solid var(--theme-input-border, #e0e0e0);
  color: var(--theme-text, #212121);
}
```

**❌ WRONG - Hardcoded colors:**
```css
.button {
  background: #9c27b0;  /* DON'T DO THIS */
  color: #ffffff;       /* DON'T DO THIS */
}
```

---

## 6. Icon Constants

### MANDATORY Icon Usage

**ALL icons MUST use icon constants from `@l-kern/config`** (NOT hardcoded emoji or Unicode symbols).

**Professional Icon Set:**
- ✅ **Version:** v3.1.0 (Modern colorful emoji design)
- ✅ **Total icons:** 109 icons across 7 categories
- ✅ **Location:** `packages/config/src/constants/icons.ts`

**Available icon categories:**
```typescript
import {
  ICONS_NAVIGATION,  // 14 icons: home, menu, back, forward, expand, collapse, etc.
  ICONS_ACTIONS,     // 20 icons: add, edit, delete, save, search, filter, etc.
  ICONS_STATUS,      // 14 icons: success, error, warning, info, active, etc.
  ICONS_DATA,        // 17 icons: table, list, card, document, folder, etc.
  ICONS_BUSINESS,    // 16 icons: user, company, invoice, warehouse, etc.
  ICONS_SYSTEM,      // 21 icons: dashboard, analytics, settings, tools, etc.
  ICONS_SHAPES,      // 15 icons: circle, square, triangle, diamond, star, etc.
} from '@l-kern/config';
```

### Correct vs Wrong Usage

**✅ CORRECT - Using icon constants:**
```typescript
import { ICONS_ACTIONS, ICONS_STATUS } from '@l-kern/config';

const SaveButton = () => (
  <button>
    {ICONS_ACTIONS.save} Save
  </button>
);
```

**❌ WRONG - Hardcoded emoji:**
```typescript
const SaveButton = () => (
  <button>
    💾 Save  {/* DON'T DO THIS - use ICONS_ACTIONS.save */}
  </button>
);
```

---

## 7. Naming Conventions

### TypeScript/JavaScript

- ✅ `UPPER_SNAKE_CASE` for primitive constants
- ✅ `camelCase` for config objects, variables, functions
- ✅ `PascalCase` for components and classes
- ✅ `PascalCase.tsx` for component files: `ContactList.tsx`
- ✅ `camelCase.ts` for utilities: `formatDate.ts`

### Python

- ✅ `UPPER_SNAKE_CASE` for all constants
- ✅ `snake_case` for functions and variables
- ✅ `PascalCase` for classes
- ✅ `snake_case.py` for all files: `contacts_service.py`

### CSS

- ✅ `--variable-name` for CSS custom properties
- ✅ `kebab-case` for class names
- ✅ `ComponentName.module.css` for CSS Modules

### Translation Keys

- ✅ `camelCase` with dot notation: `common.buttons.save`

---

## 8. Logging Standards

### Backend Logging (Python)

**⚠️ CRITICAL: NEVER use `print()` in backend code!**

**✅ ALWAYS use `logging` module:**

```python
import logging

# === LOGGING SETUP ===
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# === USAGE ===
logger.info("User logged in")           # General info
logger.warning("Authentication failed") # Important events (visible in Docker)
logger.error("Database connection lost") # Errors (visible in Docker)
```

**Docker logs visibility:**
- ✅ `WARNING` and above → Visible in `docker logs`
- ❌ `INFO` and below → Filtered out in production

---

## Summary

**Core standards covered:**
- ✅ Language & Translation System
- ✅ Development Workflow (documentation-first)
- ✅ File Headers (mandatory)
- ✅ DRY Principle & Constants
- ✅ Theme CSS Variables (--theme-*)
- ✅ Naming Conventions
- ✅ Logging Standards (Backend)

**For detailed standards, see:**
- [Frontend Standards](frontend-standards.md) - React 19, TypeScript 5.7, Vite 6
- [Backend Standards](backend-standards.md) - Python 3.11, FastAPI, SQLAlchemy, Alembic
- [Docker Standards](docker-standards.md) - Docker, docker-compose
- [Documentation Standards](documentation-standards.md) - Component/hook/utility documentation
- [Code Examples](code-examples.md) - Practical code examples

---

**Last Updated:** 2025-11-25
**Maintainer:** BOSSystems s.r.o.
