# ================================================================
# L-KERN v4 - Coding Standards (Core Rules)
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\programming\coding-standards.md
# Version: 2.0.0
# Created: 2025-10-15
# Updated: 2025-10-18
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Core coding standards for L-KERN v4. This file contains ONLY
#   the fundamental rules. Detailed standards are in separate files.
# ================================================================

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
- [frontend-standards.md](frontend-standards.md) - React, TypeScript, Vite
- [backend-standards.md](backend-standards.md) - Python, FastAPI, gRPC, Kafka
- [testing-guide.md](testing-guide.md) - pytest, Vitest, testing checklists
- [docker-standards.md](docker-standards.md) - Docker, docker-compose
- [code-examples.md](code-examples.md) - Practical code examples

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
   - 📋 [project/overview.md](../project/overview.md) - Current project state
   - 📋 [project/roadmap.md](../project/roadmap.md) - Planned tasks
   - 💻 [programming/coding-standards.md](coding-standards.md) - This file
   - 🎨 [design/component-design-system.md](../design/component-design-system.md) - Design requirements

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

**Complex task workflow:**
- ✅ Create detailed TODO (atomic operations)
- ✅ Include specific files/functions/components
- ✅ Define expected outputs for each step
- ✅ Identify dependencies between steps
- ✅ Risk analysis (positive/negative impacts)
- ✅ Update TODO if analysis reveals issues

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

// Timeouts in milliseconds
// Why: Consistent timeout values across application
// When to change: Performance optimization or UX testing
const TIMEOUTS = {
  DEFAULT_REQUEST: 5000,    // 5s - standard API call timeout
  NOTIFICATION_AUTO: 3000,  // 3s - auto-close for notifications
  DEBOUNCE_SEARCH: 300      // 300ms - debounce for search input
};
```

**Documentation template:**
```typescript
// [Category name] (units if needed)
// Why: [Reason for existence]
// When to change: [When it might need modification]
const CONSTANT_GROUP = {
  ITEM_NAME: value,    // [Brief description]
  OTHER_ITEM: value2   // [Description]
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
- ✅ `--theme-input-background-disabled` - Disabled input background (#f5f5f5)
- ✅ `--theme-input-border` - Input border color (#e0e0e0)
- ✅ `--theme-input-border-hover` - Input border on hover (#bdbdbd)
- ✅ `--theme-border` - General border color (#e0e0e0)
- ✅ `--theme-hover-background` - Hover background (#f5f5f5)
- ✅ `--theme-button-text-on-color` - Text on colored buttons (#ffffff)

**Status colors** (use directly, these are NOT theme-dependent):
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

.input:hover {
  border-color: var(--theme-input-border-hover, #bdbdbd);
}

.input:disabled {
  background: var(--theme-input-background-disabled, #f5f5f5);
  color: var(--theme-text-muted, #9e9e9e);
}
```

**❌ WRONG - Hardcoded colors:**
```css
.button {
  background: #9c27b0;  /* DON'T DO THIS */
  color: #ffffff;       /* DON'T DO THIS */
}
```

**❌ WRONG - Using --color-neutral-* instead of --theme-*:**
```css
.input {
  background: var(--color-neutral-white);  /* DON'T DO THIS */
  color: var(--color-neutral-gray900);     /* USE --theme-text INSTEAD */
}
```

---

## 6. Naming Conventions

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

## 7. Code Sectioning

### TypeScript/JavaScript Structure

```typescript
// === IMPORTS ===
import React from 'react';
import { useState } from 'react';

// === CONSTANTS ===
const API_ENDPOINTS = {
  CONTACTS: '/api/v1/contacts',
  CUSTOMERS: '/api/v1/customers'
};

// === TYPES ===
interface Contact {
  id: string;
  name: string;
}

// === COMPONENTS ===
const ContactList: React.FC = () => {
  // Component implementation
};

// === UTILITIES ===
const formatDate = (date: Date): string => {
  // Utility function
};

// === EXPORTS ===
export default ContactList;
export { formatDate };
```

### Python Structure

```python
# === IMPORTS ===
from fastapi import FastAPI, HTTPException
from sqlalchemy.orm import Session
import logging

# === CONSTANTS ===
API_VERSION = "v1"
DATABASE_URL = "postgresql://localhost/lkms101_contacts"

# === LOGGING ===
logger = logging.getLogger(__name__)

# === MODELS ===
class Contact(Base):
    __tablename__ = "contacts"
    id = Column(Integer, primary_key=True)

# === SCHEMAS ===
class ContactCreate(BaseModel):
    name: str
    email: str

# === ROUTES ===
@app.get("/api/v1/contacts")
async def get_contacts():
    return {"contacts": []}

# === UTILITIES ===
def validate_email(email: str) -> bool:
    # Validation logic
    pass
```

---

## 8. Git Standards

### Commit Message Format

**Semantic commits:**
```bash
FEATURE: Add order validation with file system integration
FIX: Resolve Docker path mapping for L:\ drive volumes
UPDATE: Enhance modal template with loading states
REFACTOR: Consolidate duplicate API endpoint definitions
DOCS: Update ROADMAP.md with Phase 0 tasks
```

**Claude Code signature:**
```
🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Branching Strategy

- ✅ `main` - Production-ready code
- ✅ `develop` - Development branch
- ✅ `feature/{task-name}` - Feature branches
- ✅ `fix/{bug-name}` - Bug fix branches

---

## 9. Componentization & Code Reuse

### DRY Rules

**MANDATORY for repeated code:**
- ✅ **Never copy-paste code** - If adding same/similar code in multiple places
- ✅ **Create shared package** - In monorepo create in `packages/` for shared components
- ✅ **Multiple apps = Shared package** - If component used in multiple `apps/`, must be in `packages/`
- ✅ **Function for logic** - Shared logic → `@l-kern/utils` package
- ✅ **Component for UI** - Shared UI elements → `@l-kern/ui-components` package

**Monorepo package location:**
```
packages/
├── ui-components/    # Shared React components
├── utils/            # Shared utilities
├── config/           # Configuration, constants, translations
└── shared-types/     # TypeScript types
```

---

## 10. Utility Functions (@l-kern/config)

### Available Utilities

**L-KERN v4 provides utility functions in `@l-kern/config` package for common operations.**

**Categories:**
- ✅ **Phone utilities** (6 functions) - Multi-country phone validation and formatting (SK, CZ, PL)
- ✅ **Email utilities** (5 functions) - RFC 5322 compliant email validation
- ✅ **Date utilities** (9 functions) - Locale-aware date formatting (SK, EN)

**Complete reference:** See [utilities-reference.md](../packages/utilities-reference.md)

### Phone Utilities

**Import:**
```typescript
import {
  validateMobile,
  validateLandlineOrFax,
  formatPhoneNumber,
  detectPhoneType,
  cleanPhoneNumber,
  type PhoneCountryCode
} from '@l-kern/config';
```

**Usage:**
```typescript
// Validate mobile phone (default: Slovakia)
const isValid = validateMobile('+421 902 123 456');  // true
const isValidCZ = validateMobile('+420 601 234 567', 'CZ');  // true

// Validate landline or fax
const isLandline = validateLandlineOrFax('02 1234 5678');  // true (Bratislava)
const isCzLandline = validateLandlineOrFax('+420 2 1234 5678', 'CZ');  // true

// Format phone number
const formatted = formatPhoneNumber('0902123456', 'mobile');  // '+421 902 123 456'
const formattedCZ = formatPhoneNumber('601234567', 'mobile', 'CZ');  // '+420 601 234 567'

// Auto-detect phone type
const type = detectPhoneType('+421 902 123 456');  // 'mobile'
const type2 = detectPhoneType('02 1234 5678');     // 'landline'

// Clean phone number (remove formatting)
const cleaned = cleanPhoneNumber('+421 902 123 456');  // '421902123456'
```

**Supported countries:**
- ✅ **SK** - Slovakia (default)
- ✅ **CZ** - Czech Republic
- ✅ **PL** - Poland

**Common use cases:**
```typescript
// Registration form - validate mobile
const handleSubmit = () => {
  if (!validateMobile(phone)) {
    setError(t('forms.errors.invalidPhone'));
    return;
  }
  // Continue with submission
};

// Contact form - auto-detect type
const phoneType = detectPhoneType(phoneInput);
if (phoneType === 'mobile') {
  // Save as mobile
} else if (phoneType === 'landline') {
  // Save as landline/fax
} else {
  // Invalid phone number
}

// Display formatted phone
const displayPhone = formatPhoneNumber(contact.phone, 'mobile');
```

### Email Utilities

**Import:**
```typescript
import {
  validateEmail,
  normalizeEmail,
  getEmailDomain,
  getEmailLocal,
  isEmailFromDomain
} from '@l-kern/config';
```

**Usage:**
```typescript
// Validate email (RFC 5322 compliant)
const isValid = validateEmail('user@example.com');  // true
const isInvalid = validateEmail('invalid@');        // false

// Normalize email (lowercase + trim)
const normalized = normalizeEmail('  User@Example.COM  ');  // 'user@example.com'

// Extract domain
const domain = getEmailDomain('user@example.com');  // 'example.com'

// Extract local part (username)
const local = getEmailLocal('user@example.com');  // 'user'

// Check if email is from specific domain
const isCompanyEmail = isEmailFromDomain('user@company.com', 'company.com');  // true
```

**Common use cases:**
```typescript
// Registration form - validate email
const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const email = e.target.value;
  setEmail(email);

  if (!validateEmail(email)) {
    setEmailError(t('forms.errors.invalidEmail'));
  } else {
    setEmailError(null);
  }
};

// Normalize before saving
const saveUser = async (email: string) => {
  const normalized = normalizeEmail(email);
  await api.createUser({ email: normalized });
};

// Check domain for business rules
const checkCorporateEmail = (email: string) => {
  if (!isEmailFromDomain(email, 'company.com')) {
    alert(t('forms.errors.requireCorporateEmail'));
    return false;
  }
  return true;
};
```

### Date Utilities

**Import:**
```typescript
import {
  formatDate,
  formatDateTime,
  parseDate,
  validateDate,
  convertDateLocale,
  getToday,
  isToday,
  addDays,
  getDaysDifference,
  type DateLocale
} from '@l-kern/config';
```

**Usage:**
```typescript
// Format date for display
const date = new Date('2025-10-18');
const formatted = formatDate(date, 'sk');  // '18.10.2025'
const formattedEN = formatDate(date, 'en');  // '2025-10-18'

// Format with time
const dateTime = formatDateTime(date, 'sk');  // '18.10.2025 14:30:00'

// Parse date from string
const parsed = parseDate('18.10.2025', 'sk');  // Date object
const parsedEN = parseDate('2025-10-18', 'en');  // Date object

// Validate date format
const isValid = validateDate('18.10.2025', 'sk');  // true
const isInvalid = validateDate('2025-10-18', 'sk');  // false (wrong format for SK)

// Convert between locales
const converted = convertDateLocale('18.10.2025', 'sk', 'en');  // '2025-10-18'

// Get today's date
const today = getToday('sk');  // '18.10.2025'

// Check if date is today
const isTodayCheck = isToday('18.10.2025', 'sk');  // true/false

// Add/subtract days
const tomorrow = addDays(today, 1, 'sk');  // '19.10.2025'
const yesterday = addDays(today, -1, 'sk');  // '17.10.2025'

// Calculate difference in days
const diff = getDaysDifference('18.10.2025', '25.10.2025', 'sk');  // 7
```

**Common use cases:**
```typescript
// Display date in user's locale
const { currentLanguage } = useTranslation();
const locale: DateLocale = currentLanguage === 'sk' ? 'sk' : 'en';
const displayDate = formatDate(order.createdAt, locale);

// Date input validation
const handleDateChange = (value: string) => {
  if (!validateDate(value, locale)) {
    setError(t('forms.errors.invalidDate'));
    return;
  }
  setDate(value);
};

// Date range calculation
const startDate = getToday('sk');
const endDate = addDays(startDate, 30, 'sk');  // 30 days from now

// API communication (always use EN format)
const saveOrder = async () => {
  const apiDate = convertDateLocale(userInputDate, 'sk', 'en');
  await api.createOrder({ deliveryDate: apiDate });
};

// Display relative dates
const daysSinceOrder = getDaysDifference(order.date, getToday('sk'), 'sk');
if (daysSinceOrder > 7) {
  showWarning(t('orders.warnings.delayed'));
}
```

### Utility Best Practices

**1. Always use utilities instead of custom validation:**
```typescript
// ❌ WRONG - Custom validation
const isEmailValid = (email: string) => {
  return email.includes('@') && email.includes('.');
};

// ✅ CORRECT - Use utility
import { validateEmail } from '@l-kern/config';
const isEmailValid = validateEmail(email);
```

**2. Handle locale properly:**
```typescript
// ❌ WRONG - Hardcoded locale
const date = formatDate(new Date(), 'sk');

// ✅ CORRECT - Use current language
const { currentLanguage } = useTranslation();
const locale: DateLocale = currentLanguage === 'sk' ? 'sk' : 'en';
const date = formatDate(new Date(), locale);
```

**3. Normalize user input:**
```typescript
// ❌ WRONG - Save raw input
await api.createUser({ email: emailInput });

// ✅ CORRECT - Normalize first
import { normalizeEmail } from '@l-kern/config';
const normalized = normalizeEmail(emailInput);
await api.createUser({ email: normalized });
```

**4. Use country parameter for international apps:**
```typescript
// ✅ CORRECT - Multi-country support
const selectedCountry = userProfile.country;  // 'SK', 'CZ', 'PL'
const isValid = validateMobile(phone, selectedCountry);
const formatted = formatPhoneNumber(phone, 'mobile', selectedCountry);
```

**5. Convert dates for API communication:**
```typescript
// ✅ CORRECT - SK format for users, EN format for API
const userDate = '18.10.2025';  // User input in SK format
const apiDate = convertDateLocale(userDate, 'sk', 'en');  // '2025-10-18' for API
await api.createOrder({ deliveryDate: apiDate });

// Display API response in user's locale
const responseDate = '2025-10-18';  // From API
const displayDate = convertDateLocale(responseDate, 'en', 'sk');  // '18.10.2025'
```

---

## 11. Logging Standards

### Backend Logging (Python)

**⚠️ CRITICAL: NEVER use `print()` in backend code!**

**Why?**
- Docker logs don't capture `print()` output properly
- No log levels (INFO, WARNING, ERROR)
- No timestamps or source information

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
logger.debug("Processing request...")    # Debug info (development only)
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
- ✅ Code Sectioning
- ✅ Git Standards
- ✅ Componentization & Code Reuse
- ✅ Utility Functions (@l-kern/config)
- ✅ Logging Standards

**For detailed standards, see:**
- 🎨 [frontend-standards.md](frontend-standards.md) - React 19, TypeScript 5.7, Vite 6, CSS Modules, REST API client
- 🐍 [backend-standards.md](backend-standards.md) - Python 3.11, FastAPI, SQLAlchemy, Alembic, gRPC, Kafka
- ✅ [testing-guide.md](testing-guide.md) - pytest (backend), Vitest (frontend), testing checklists, coverage requirements
- 🐳 [docker-standards.md](docker-standards.md) - Dockerfile patterns, docker-compose, hot-reload configuration
- 💡 [code-examples.md](code-examples.md) - Practical code examples for React, API, gRPC, Database, Testing

---

**Last Updated:** 2025-10-18
**Maintainer:** BOSSystems s.r.o.
**Documentation Location:** `L:\system\lkern_codebase_v4_act\docs\programming\`
