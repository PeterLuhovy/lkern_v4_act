---
id: config
title: '@l-kern/config Package'
sidebar_label: '@l-kern/config'
sidebar_position: 1
---

# @l-kern/config Package Documentation

**Status**: 🚧 In Development
**Package Path**: `packages/config/`
**Import Name**: `@l-kern/config`

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Package Structure](#package-structure)
3. [Installation & Setup](#installation--setup)
4. [Constants](#constants)
   - [Port Mapping](#port-mapping)
   - [API Configuration](#api-configuration)
   - [Design Tokens](#design-tokens)
5. [Translations System](#translations-system)
6. [Theme System](#theme-system)
7. [TypeScript Types](#typescript-types)
8. [Usage Examples](#usage-examples)
9. [Development](#development)

---

## Overview

`@l-kern/config` je centralizovaný konfiguračný package pre L-KERN v4 ERP systém. Obsahuje všetky konštanty, API endpointy, port mapping, translations a theme systém.

**Key Principles:**
- ✅ **Single Source of Truth** - Jedna centrálna konfigurácia
- ✅ **Type Safe** - Plná TypeScript podpora
- ✅ **DRY Compliance** - Žiadne hardcoded hodnoty v aplikáciách
- ✅ **Reusable** - Zdieľané naprieč všetkými aplikáciami a službami

---

## Package Structure

```
packages/config/
├── src/
│   ├── constants/
│   │   ├── index.ts          # Re-exports all constants
│   │   ├── api-config.ts     # API URLs, timeouts, HTTP configuration
│   │   ├── ports.ts          # Port mapping (LKMS{XXX} → 4{XXX})
│   │   ├── services.ts       # Service names and metadata
│   │   └── design-tokens.ts  # CSS variables, colors, spacing
│   ├── translations/
│   │   ├── index.tsx         # Translation provider & useTranslation hook
│   │   ├── types.ts          # Translation TypeScript types
│   │   ├── sk.ts             # Slovak translations
│   │   └── en.ts             # English translations
│   ├── theme/
│   │   ├── ThemeContext.tsx  # Theme provider & useTheme hook
│   │   └── types.ts          # Theme TypeScript types
│   ├── index.ts              # Main export file
│   └── types.ts              # Global TypeScript types
├── package.json
├── project.json              # Nx configuration
├── tsconfig.lib.json         # TypeScript configuration
└── README.md                 # Minimal README with link to this doc
```

---

## Installation & Setup

Package je súčasťou Nx monorepo workspace:

```bash
# Install dependencies (from project root)
yarn install

# Type check config package
yarn nx typecheck @l-kern/config
```

---

## Constants

### Port Mapping

**Port Mapping Strategy**: `LKMS{XXX}` service → Port `4{XXX}`

#### Available Port Constants

```typescript
import { PORTS, FRONTEND_PORTS, BUSINESS_SERVICE_PORTS } from '@l-kern/config';

// Frontend applications (LKMS 200-299)
PORTS.WEB_UI           // 4201 - lkms201-web-ui
PORTS.ADMIN_PANEL      // 4202 - lkms202-admin
PORTS.DEV_PLAYGROUND   // 4203 - lkms203-playground

// Business microservices (LKMS 100-199)
PORTS.CONTACTS         // 4101 - lkms101-contacts
PORTS.ORDERS           // 4102 - lkms102-orders
PORTS.PARTS            // 4103 - lkms103-parts

// Data services (LKMS 500-599)
PORTS.POSTGRES         // 4501 - lkms501-postgres
PORTS.REDIS            // 4502 - lkms502-redis

// Development tools (LKMS 900-999)
PORTS.ADMINER          // 4901 - lkms901-adminer
```

#### Helper Functions

```typescript
import { getPortByLkmsId, getServiceNameByPort, isValidLkernPort } from '@l-kern/config';

// Get port from LKMS ID
const port = getPortByLkmsId('lkms201');  // 4201
const port2 = getPortByLkmsId('201');     // 4201 (works without prefix)

// Get service name from port
const service = getServiceNameByPort(4201);  // 'web-ui'

// Validate port
const valid = isValidLkernPort(4201);  // true
const invalid = isValidLkernPort(3000); // false
```

#### Port Ranges Reference

| Range | Category | LKMS IDs | Usage |
|-------|----------|----------|-------|
| 4100-4199 | Business Services | lkms101-199 | Backend microservices |
| 4200-4299 | Frontend Apps | lkms201-299 | React applications |
| 4500-4599 | Data Services | lkms501-599 | Databases, caches |
| 4900-4999 | Dev Tools | lkms901-999 | Adminer, PgAdmin, etc. |

---

### API Configuration

#### API Endpoints

```typescript
import { API_ENDPOINTS } from '@l-kern/config';

// Business microservices
API_ENDPOINTS.CONTACTS        // '/api/contacts'
API_ENDPOINTS.ORDERS          // '/api/orders'
API_ENDPOINTS.PARTS           // '/api/parts'

// Search endpoints
API_ENDPOINTS.SEARCH.CUSTOMERS   // '/api/contacts/customers/search'
API_ENDPOINTS.SEARCH.PARTS       // '/api/parts/search'

// Health checks
API_ENDPOINTS.HEALTH.SERVICES    // '/health/services'
API_ENDPOINTS.HEALTH.DATABASE    // '/health/db'
```

#### Timeouts

```typescript
import { TIMEOUTS } from '@l-kern/config';

// HTTP request timeouts (milliseconds)
TIMEOUTS.DEFAULT_REQUEST      // 5000 (5s)
TIMEOUTS.LONG_REQUEST         // 15000 (15s) - reports, exports
TIMEOUTS.QUICK_REQUEST        // 2000 (2s) - search, validation

// UI interaction timeouts
TIMEOUTS.NOTIFICATION_AUTO    // 3000 (3s) - auto-close notifications
TIMEOUTS.DEBOUNCE_SEARCH      // 300 (300ms) - search input debounce
TIMEOUTS.DEBOUNCE_SAVE        // 1000 (1s) - auto-save debounce

// Retry configuration
TIMEOUTS.RETRY_DELAY          // 1000 (1s)
TIMEOUTS.MAX_RETRY_ATTEMPTS   // 3
```

#### HTTP Configuration

```typescript
import { HTTP_CONFIG } from '@l-kern/config';

// Default headers
const headers = HTTP_CONFIG.DEFAULT_HEADERS;
// {
//   'Content-Type': 'application/json',
//   'Accept': 'application/json',
//   'X-Requested-With': 'XMLHttpRequest'
// }

// HTTP status codes
HTTP_CONFIG.STATUS_CODES.SUCCESS.OK              // 200
HTTP_CONFIG.STATUS_CODES.CLIENT_ERROR.NOT_FOUND  // 404
HTTP_CONFIG.STATUS_CODES.SERVER_ERROR.INTERNAL_ERROR  // 500
```

#### Pagination

```typescript
import { PAGINATION } from '@l-kern/config';

PAGINATION.DEFAULT_PAGE_SIZE     // 25
PAGINATION.MAX_PAGE_SIZE          // 100
PAGINATION.SIZE_OPTIONS           // [10, 25, 50, 100]
```

---

### Design Tokens

CSS variables a design constants pre konzistentný vzhľad aplikácie.

```typescript
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '@l-kern/config';

// Colors (CSS variable names)
COLORS.PRIMARY          // '--color-primary'
COLORS.SECONDARY        // '--color-secondary'
COLORS.BACKGROUND       // '--color-background'
COLORS.TEXT             // '--color-text'

// Spacing
SPACING.XS              // '4px'
SPACING.SM              // '8px'
SPACING.MD              // '16px'
SPACING.LG              // '24px'
SPACING.XL              // '32px'

// Typography
TYPOGRAPHY.SIZES.H1     // '2rem'
TYPOGRAPHY.SIZES.BODY   // '1rem'
TYPOGRAPHY.WEIGHTS.BOLD // 700

// Shadows
SHADOWS.SM              // 'box-shadow: ...'
SHADOWS.MD              // 'box-shadow: ...'
```

---

## Translations System

Multi-language support s React Context API.

### Setup

```tsx
import { TranslationProvider } from '@l-kern/config';

function App() {
  return (
    <TranslationProvider defaultLanguage="sk">
      <YourApp />
    </TranslationProvider>
  );
}
```

### Usage in Components

```tsx
import { useTranslation } from '@l-kern/config';

function MyComponent() {
  const { t, language, setLanguage } = useTranslation();

  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>{t('dashboard.stats.users')}</p>

      {/* Language switcher */}
      <button onClick={() => setLanguage('en')}>
        English
      </button>
      <button onClick={() => setLanguage('sk')}>
        Slovenčina
      </button>

      <p>Current language: {language}</p>
    </div>
  );
}
```

### Translation Keys Structure

```typescript
{
  common: {
    welcome: string;
    save: string;
    cancel: string;
    delete: string;
  },
  dashboard: {
    title: string;
    stats: {
      users: string;
      orders: string;
    }
  },
  // ...
}
```

### Adding New Translations

1. Update `src/translations/types.ts` with new keys
2. Add translations to `src/translations/sk.ts`
3. Add translations to `src/translations/en.ts`

---

## Theme System

Light/Dark mode support s React Context API a dynamickými CSS premennými.

### Architecture

Theme systém má **2 časti**:

1. **@l-kern/config** - React Context pre prepínanie témy (`useTheme` hook)
2. **theme-setup.ts** - Generuje CSS premenné z design tokens (v `apps/web-ui/src/`)

### Setup

**1. Inicializuj theme CSS (v main.tsx):**

```tsx
import { ThemeProvider } from '@l-kern/config';
import { setupTheme } from './theme-setup';

// IMPORTANT: Generate CSS variables from design tokens
setupTheme();

root.render(
  <ThemeProvider defaultTheme="light">
    <YourApp />
  </ThemeProvider>
);
```

**2. theme-setup.ts generuje CSS premenné:**

```typescript
// apps/web-ui/src/theme-setup.ts
import { COLORS } from '@l-kern/config';

export function setupTheme(): void {
  const style = document.createElement('style');
  style.textContent = `
    /* Light Theme */
    [data-theme="light"] {
      --theme-text: ${COLORS.neutral.gray900};
      --theme-input-background: ${COLORS.neutral.white};
      --theme-input-border: ${COLORS.neutral.gray300};
      --theme-hover-background: ${COLORS.neutral.gray100};
      /* ... */
    }

    /* Dark Theme */
    [data-theme="dark"] {
      --theme-text: ${COLORS.neutral.gray100};
      --theme-input-background: ${COLORS.neutral.gray800};
      --theme-input-border: ${COLORS.neutral.gray600};
      --theme-hover-background: ${COLORS.neutral.gray700};
      /* ... */
    }
  `;
  document.head.appendChild(style);
}
```

### Usage in Components

```tsx
import { useTheme } from '@l-kern/config';

function MyComponent() {
  const { theme, setTheme, toggleTheme } = useTheme();

  return (
    <div>
      <h1>Current theme: {theme}</h1>

      {/* Toggle button */}
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>

      {/* Specific theme selection */}
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
    </div>
  );
}
```

### CSS Variables Reference

**Available theme variables** (defined in `theme-setup.ts`):

```css
/* Text colors */
--theme-text                      /* Main text color */
--theme-text-muted                /* Secondary/muted text */

/* Input/Form colors */
--theme-input-background          /* Input background */
--theme-input-background-disabled /* Disabled input background */
--theme-input-border              /* Input border */
--theme-input-border-hover        /* Input border on hover */

/* UI colors */
--theme-border                    /* General border color */
--theme-hover-background          /* Hover background (buttons, rows) */
```

**Example usage in CSS Modules:**

```css
/* Component.module.css */
.input {
  color: var(--theme-text);
  background: var(--theme-input-background);
  border: 2px solid var(--theme-input-border);
}

.input:hover {
  border-color: var(--theme-input-border-hover);
}

.button--ghost:hover {
  background-color: var(--theme-hover-background);
}
```

### Theme Values

**Light Theme:**
- Text: `#212121` (dark gray - čitateľné na bielom pozadí)
- Input background: `#ffffff` (white)
- Input border: `#e0e0e0` (light gray)
- Hover background: `#f5f5f5` (very light gray)

**Dark Theme:**
- Text: `#f5f5f5` (light gray - čitateľné na tmavom pozadí)
- Input background: `#424242` (dark gray - nie príliš svetlé)
- Input border: `#757575` (medium gray)
- Hover background: `#616161` (darker gray)

### How Theme Switching Works

1. **User clicks toggle** → `toggleTheme()` called
2. **ThemeProvider updates** `data-theme` attribute on `<html>` element
3. **CSS switches** automatically via `[data-theme="dark"]` selector
4. **All components** using `var(--theme-*)` update instantly
5. **Theme persisted** in localStorage for next visit

---

## TypeScript Types

All exports are fully typed:

```typescript
import type {
  // Port types
  PortConfig,
  PortRange,

  // API types
  ApiEndpoint,
  ApiTimeout,
  HttpStatusCode,

  // Translation types
  TranslationKey,
  Language,
  TranslationContextValue,

  // Theme types
  ThemeMode,
  ThemeContextValue,
} from '@l-kern/config';
```

---

## Usage Examples

### Example 1: API Client Configuration

```typescript
import { API_ENDPOINTS, TIMEOUTS, HTTP_CONFIG } from '@l-kern/config';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: API_ENDPOINTS.CONTACTS,
  timeout: TIMEOUTS.DEFAULT_REQUEST,
  headers: HTTP_CONFIG.DEFAULT_HEADERS,
});
```

### Example 2: Port-Based Service Discovery

```typescript
import { PORTS, getServiceNameByPort } from '@l-kern/config';

function getServiceUrl(serviceName: keyof typeof PORTS): string {
  const port = PORTS[serviceName];
  return `http://localhost:${port}`;
}

const contactsUrl = getServiceUrl('CONTACTS');  // 'http://localhost:4101'
```

### Example 3: Multilingual Form

```tsx
import { useTranslation } from '@l-kern/config';

function ContactForm() {
  const { t } = useTranslation();

  return (
    <form>
      <label>{t('contacts.form.name')}</label>
      <input type="text" placeholder={t('contacts.form.namePlaceholder')} />

      <button type="submit">{t('common.save')}</button>
      <button type="button">{t('common.cancel')}</button>
    </form>
  );
}
```

### Example 4: Themed Component

```tsx
import { useTheme } from '@l-kern/config';
import { COLORS, SPACING } from '@l-kern/config';

function StyledCard() {
  const { theme } = useTheme();

  return (
    <div
      style={{
        backgroundColor: `var(${COLORS.BACKGROUND})`,
        color: `var(${COLORS.TEXT})`,
        padding: SPACING.MD,
        border: theme === 'dark' ? '1px solid #333' : '1px solid #ddd',
      }}
    >
      Card content
    </div>
  );
}
```

---

## Development

### Type Checking

```bash
yarn nx typecheck @l-kern/config
```

### Testing Imports

```bash
# From another package/app
yarn nx test web-ui
```

### File Organization Rules

1. **Constants** - Add to appropriate file in `src/constants/`
2. **Translations** - Update both `sk.ts` and `en.ts` + `types.ts`
3. **Theme values** - Add to `design-tokens.ts` and CSS variables
4. **New modules** - Update `src/index.ts` with exports

### Contribution Guidelines

When adding new configuration:

1. ✅ **Add TypeScript types** in appropriate `types.ts` file
2. ✅ **Document in this file** with usage examples
3. ✅ **Use const assertions** (`as const`) for type safety
4. ✅ **Add JSDoc comments** for public APIs
5. ✅ **Test imports** in at least one consumer package

---

**Last Updated**: 2025-10-13
**Maintainer**: BOSSystems s.r.o.
**Related Docs**:
- [Port Mapping Strategy](../architecture/port-mapping.md)
- [Project Overview](../project/overview.md)
