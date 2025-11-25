# ================================================================
# L-KERN v4 - Frontend Standards
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\programming\frontend-standards.md
# Version: 2.0.0
# Created: 2025-10-18
# Updated: 2025-11-22
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Frontend development standards for L-KERN v4 including
#   React 19, TypeScript 5.7, Vite 6, CSS patterns, and API client setup.
#
# Changelog v2.0.0:
#   - Added 2-phase retry logic with toast notifications (max 10s + 20s)
#   - Exponential backoff strategy for 500 errors
#   - User feedback via toast (warning → error)
# ================================================================

---

## 📋 Overview

This document contains **frontend-specific** coding standards for L-KERN v4. For core standards (DRY, translations, theme), see [coding-standards.md](coding-standards.md).

**Tech Stack:**
- React 19 (functional components, hooks)
- TypeScript 5.7 (strict mode)
- Vite 6 (build tool, HMR)
- CSS Modules (component styling)
- Axios (REST API client)

---

## 1. TypeScript/React 19 Conventions

### File Naming

**TypeScript/React files:**
- ✅ `PascalCase.tsx` for components: `ContactList.tsx`, `UserProfile.tsx`
- ✅ `camelCase.ts` for utilities: `formatDate.ts`, `apiClient.ts`
- ✅ `camelCase.test.tsx` for tests: `ContactList.test.tsx`
- ✅ `ComponentName.module.css` for CSS Modules: `Button.module.css`

**Examples:**
```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx           # Component
│   │   ├── Button.module.css    # Styles
│   │   ├── Button.test.tsx      # Tests
│   │   └── index.ts             # Exports
│   └── ContactList/
│       ├── ContactList.tsx
│       ├── ContactList.module.css
│       ├── ContactList.test.tsx
│       └── index.ts
├── utils/
│   ├── formatDate.ts            # Utility function
│   └── apiClient.ts             # API client setup
└── pages/
    ├── HomePage.tsx
    └── ContactsPage.tsx
```

---

### Component Structure

**Functional component template:**

```typescript
/*
 * ================================================================
 * FILE: ContactList.tsx
 * PATH: /apps/web-ui/src/components/ContactList/ContactList.tsx
 * DESCRIPTION: Displays list of contacts with selection handling
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 15:30:00
 * ================================================================
 */

// === IMPORTS ===
import React from 'react';
import { useTranslation } from '@l-kern/config';
import styles from './ContactList.module.css';

// === TYPES ===
interface Contact {
  id: number;
  name: string;
  email: string;
}

interface ContactListProps {
  contacts: Contact[];
  onSelect: (contact: Contact) => void;
  loading?: boolean;
}

// === COMPONENT ===
export const ContactList: React.FC<ContactListProps> = ({
  contacts,
  onSelect,
  loading = false
}) => {
  const { t } = useTranslation();

  // === STATE ===
  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  // === HANDLERS ===
  const handleSelect = (contact: Contact) => {
    setSelectedId(contact.id);
    onSelect(contact);
  };

  // === RENDER ===
  if (loading) {
    return <div>{t('common.loading')}</div>;
  }

  if (contacts.length === 0) {
    return <div>{t('contacts.empty')}</div>;
  }

  return (
    <div className={styles.list}>
      <h2>{t('contacts.title')}</h2>
      {contacts.map(contact => (
        <div
          key={contact.id}
          className={`${styles.item} ${selectedId === contact.id ? styles.selected : ''}`}
          onClick={() => handleSelect(contact)}
        >
          <div className={styles.name}>{contact.name}</div>
          <div className={styles.email}>{contact.email}</div>
        </div>
      ))}
    </div>
  );
};
```

**Component rules:**
- ✅ Use functional components (NO class components)
- ✅ Always define `Props` interface
- ✅ Use destructuring for props with default values
- ✅ Use React hooks (useState, useEffect, useMemo, useCallback)
- ✅ Export named components (NOT default export)
- ✅ Section code with comments: IMPORTS, TYPES, COMPONENT, STATE, HANDLERS, RENDER
- ✅ Use `useTranslation()` hook for ALL user-facing text
- ✅ Import CSS Modules as `styles` object

---

### React Hooks Best Practices

**useState:**
```typescript
// ✅ CORRECT - typed state
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);

// ❌ WRONG - untyped state
const [count, setCount] = useState(0);  // Type inference OK for primitives
const [user, setUser] = useState(null); // BAD - need explicit type
```

**useEffect:**
```typescript
// ✅ CORRECT - cleanup function
useEffect(() => {
  const subscription = api.subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, [dependency]);

// ✅ CORRECT - dependency array
useEffect(() => {
  fetchData(id);
}, [id]);  // Re-run when id changes

// ❌ WRONG - missing dependencies
useEffect(() => {
  fetchData(id);  // ESLint warning!
}, []);
```

**useMemo & useCallback:**
```typescript
// ✅ Use useMemo for expensive calculations
const expensiveResult = useMemo(() => {
  return contacts.filter(c => c.isActive).sort((a, b) => a.name.localeCompare(b.name));
}, [contacts]);

// ✅ Use useCallback for event handlers passed to children
const handleClick = useCallback((id: number) => {
  console.log('Clicked:', id);
}, []);
```

**Custom hooks:**
```typescript
// Custom hook for API fetching
function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const data = await contactsApi.getAll();
        setContacts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  return { contacts, loading, error };
}

// Usage
const ContactsPage = () => {
  const { contacts, loading, error } = useContacts();
  // ...
};
```

---

## 2. Vite 6 Configuration

### Development Server Setup

**vite.config.ts - Hot Module Replacement (HMR):**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  server: {
    host: '0.0.0.0',        // Listen on all interfaces (required for Docker)
    port: 4201,             // Frontend port
    watch: {
      usePolling: true,     // REQUIRED for Docker hot-reload
      interval: 1000        // Poll every 1 second
    },
    hmr: {
      host: 'localhost',
      port: 4201
    }
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './src/utils')
    }
  }
});
```

**Why usePolling?**
- Docker doesn't support native file watching (inotify)
- Polling checks for file changes every 1 second
- Without it, HMR won't work in Docker containers

---

### Build Optimization

**vite.config.ts - Production build:**

```typescript
export default defineConfig({
  build: {
    target: 'esnext',           // Modern browsers only
    minify: 'esbuild',          // Fast minification
    sourcemap: true,            // Debug in production

    rollupOptions: {
      output: {
        // Code splitting - separate vendor bundle
        manualChunks: {
          vendor: ['react', 'react-dom'],
          axios: ['axios']
        }
      }
    },

    // Chunk size warnings
    chunkSizeWarningLimit: 1000  // 1000 kB
  }
});
```

**Build output:**
```
dist/
├── assets/
│   ├── vendor.abc123.js      # React, React-DOM (large, rarely changes)
│   ├── axios.def456.js       # Axios (medium, rarely changes)
│   ├── index.ghi789.js       # Your code (small, changes often)
│   └── index.jkl012.css      # Styles
└── index.html
```

**Benefits:**
- ✅ Vendor bundle cached separately (faster reload on updates)
- ✅ Modern ES modules (smaller bundle size)
- ✅ Fast builds (esbuild is 10-100x faster than Webpack)

---

## 3. CSS Standards

### CSS Modules

**MANDATORY: Use CSS Modules for component styling**

**Button.module.css:**
```css
/*
 * ================================================================
 * FILE: Button.module.css
 * PATH: /apps/web-ui/src/components/Button/Button.module.css
 * DESCRIPTION: Button component styles
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 15:30:00
 * ================================================================
 */

/* === BASE STYLES === */
.button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  /* ✅ Use theme variables (NOT hardcoded colors) */
  background: var(--theme-input-background, #ffffff);
  color: var(--theme-text, #212121);
  border: 2px solid var(--theme-input-border, #e0e0e0);
}

.button:hover {
  background: var(--theme-hover-background, #f5f5f5);
}

.button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
  background: var(--theme-input-background-disabled, #f5f5f5);
  color: var(--theme-text-muted, #9e9e9e);
}

/* === VARIANTS === */
.button--primary {
  background: var(--color-brand-primary, #9c27b0);
  color: var(--theme-button-text-on-color, #ffffff);
  border-color: var(--color-brand-primary, #9c27b0);
}

.button--danger {
  background: var(--color-status-error, #f44336);
  color: var(--theme-button-text-on-color, #ffffff);
  border-color: var(--color-status-error, #f44336);
}

/* === SIZES === */
.button--small {
  padding: 6px 12px;
  font-size: 12px;
}

.button--large {
  padding: 14px 28px;
  font-size: 16px;
}

/* === STATES === */
.button--fullWidth {
  width: 100%;
  display: block;
}
```

**Button.tsx - Using CSS Modules:**
```typescript
import styles from './Button.module.css';

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'medium',
  fullWidth = false,
  children
}) => {
  const classNames = [
    styles.button,
    variant !== 'default' && styles[`button--${variant}`],
    size !== 'medium' && styles[`button--${size}`],
    fullWidth && styles['button--fullWidth']
  ].filter(Boolean).join(' ');

  return <button className={classNames}>{children}</button>;
};
```

---

### Theme CSS Variables (Reference)

**Available theme variables:**

**Text colors:**
- `--theme-text` - Default text (#212121)
- `--theme-text-muted` - Muted/disabled text (#9e9e9e)

**Input colors:**
- `--theme-input-background` - Input background (#ffffff)
- `--theme-input-background-disabled` - Disabled input (#f5f5f5)
- `--theme-input-border` - Input border (#e0e0e0)
- `--theme-input-border-hover` - Input border on hover (#bdbdbd)

**General UI:**
- `--theme-border` - General border color (#e0e0e0)
- `--theme-hover-background` - Hover background (#f5f5f5)
- `--theme-button-text-on-color` - Text on colored buttons (#ffffff)

**Status colors** (use directly):
- `--color-status-success` - Success green (#4CAF50)
- `--color-status-error` - Error red (#f44336)
- `--color-status-warning` - Warning orange (#FF9800)
- `--color-status-info` - Info blue (#2196F3)

**Brand colors** (use directly):
- `--color-brand-primary` - Primary purple (#9c27b0)
- `--color-brand-secondary` - Secondary blue (#3366cc)

**⚠️ IMPORTANT:**
- ✅ Use `--theme-*` variables for colors that change with theme
- ✅ Use `--color-brand-*` for branding elements
- ✅ Use `--color-status-*` for status indicators
- ❌ NEVER use `--color-neutral-*` (deprecated)
- ❌ NEVER hardcode colors (#ffffff, #212121, etc.)

---

## 4. REST API Client

### Axios Instance Setup

**src/api/client.ts:**

```typescript
/*
 * ================================================================
 * FILE: client.ts
 * PATH: /apps/web-ui/src/api/client.ts
 * DESCRIPTION: Axios client configuration with interceptors
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 15:30:00
 * ================================================================
 */

// === IMPORTS ===
import axios from 'axios';
import { API_BASE_URL } from '@l-kern/config';

// === CONSTANTS ===
const DEFAULT_TIMEOUT = 5000;  // 5 seconds

// === CLIENT INSTANCE ===
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// === REQUEST INTERCEPTOR ===
// Add auth token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// === RESPONSE INTERCEPTOR ===
// Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }

    // Server error - log for debugging
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

---

### API Service Pattern

**src/api/contacts.ts:**

```typescript
/*
 * ================================================================
 * FILE: contacts.ts
 * PATH: /apps/web-ui/src/api/contacts.ts
 * DESCRIPTION: Contacts API service with CRUD operations
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 15:30:00
 * ================================================================
 */

// === IMPORTS ===
import apiClient from './client';

// === TYPES ===
interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  is_active: boolean;
}

interface ContactCreate {
  name: string;
  email: string;
  phone?: string;
}

interface ContactUpdate {
  name?: string;
  email?: string;
  phone?: string;
  is_active?: boolean;
}

// === API SERVICE ===
export const contactsApi = {
  /**
   * Get all contacts
   */
  getAll: async (): Promise<Contact[]> => {
    const response = await apiClient.get('/api/v1/contacts');
    return response.data;
  },

  /**
   * Get contact by ID
   */
  getById: async (id: number): Promise<Contact> => {
    const response = await apiClient.get(`/api/v1/contacts/${id}`);
    return response.data;
  },

  /**
   * Create new contact
   */
  create: async (data: ContactCreate): Promise<Contact> => {
    const response = await apiClient.post('/api/v1/contacts', data);
    return response.data;
  },

  /**
   * Update existing contact
   */
  update: async (id: number, data: ContactUpdate): Promise<Contact> => {
    const response = await apiClient.put(`/api/v1/contacts/${id}`, data);
    return response.data;
  },

  /**
   * Delete contact
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1/contacts/${id}`);
  },

  /**
   * Search contacts by name/email
   */
  search: async (query: string): Promise<Contact[]> => {
    const response = await apiClient.get('/api/v1/contacts/search', {
      params: { q: query }
    });
    return response.data;
  }
};
```

---

### Retry Logic with Exponential Backoff & Toast Notifications

**⚠️ CRITICAL: Server error handling with user feedback**

**Strategy:**
- First attempt: Max 10s total wait → Show toast notification
- Second attempt: Max 20s total wait → Final failure
- Total max waiting time: 30 seconds
- User informed via toast after each phase

**src/utils/retry.ts:**

```typescript
/*
 * ================================================================
 * FILE: retry.ts
 * PATH: /apps/web-ui/src/utils/retry.ts
 * DESCRIPTION: Retry utility with exponential backoff and toast notifications
 * VERSION: v2.0.0
 * UPDATED: 2025-11-22 12:00:00
 * ================================================================
 */

// === IMPORTS ===
import { toast } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';

// === CONSTANTS ===
// Retry delays in milliseconds (exponential backoff)
// Why: Progressive delays give service time to recover
// Phase 1: [1000, 2000, 4000] = 7s total → Toast after phase 1
// Phase 2: [1000, 2000, 4000, 8000] = 15s total → Final failure
const RETRY_DELAYS_PHASE1 = [1000, 2000, 4000]; // First attempt: max 10s
const RETRY_DELAYS_PHASE2 = [1000, 2000, 4000, 8000]; // Second attempt: max 20s

// HTTP status codes that should trigger retry
const RETRYABLE_STATUS_CODES = [500, 502, 503, 504];

// === TYPES ===
interface RetryOptions {
  showToast?: boolean;          // Show toast notifications (default: true)
  phase1Only?: boolean;          // Only first phase (default: false)
  onPhase1Complete?: () => void; // Callback after phase 1
  onRetry?: (attempt: number, phase: number, error: Error) => void;
}

// === RETRY FUNCTION WITH PHASES ===
export async function retryOnFailure<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    showToast = true,
    phase1Only = false,
    onPhase1Complete,
    onRetry
  } = options;

  let lastError: Error | undefined;

  // === PHASE 1: First attempt (max 10s) ===
  console.info('🔄 Phase 1: Starting initial request with retry (max 10s)...');

  for (let attempt = 0; attempt < RETRY_DELAYS_PHASE1.length; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Check if we should retry
      const shouldRetry = isRetryableError(error);

      if (!shouldRetry || attempt === RETRY_DELAYS_PHASE1.length - 1) {
        break; // Exit phase 1, proceed to phase 2 or fail
      }

      const delay = RETRY_DELAYS_PHASE1[attempt];
      console.warn(
        `⚠️ Phase 1 retry ${attempt + 1}/${RETRY_DELAYS_PHASE1.length}: ` +
        `Retrying in ${delay}ms... (${error.response?.status || error.code})`
      );

      if (onRetry) {
        onRetry(attempt + 1, 1, error);
      }

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // === PHASE 1 COMPLETE - Show toast ===
  console.warn('⏱️ Phase 1 failed (10s timeout). Starting Phase 2...');

  if (showToast) {
    toast.warning(
      'Server problem detected. Retrying...',
      { duration: 3000 }
    );
  }

  if (onPhase1Complete) {
    onPhase1Complete();
  }

  // If phase1Only mode, fail now
  if (phase1Only) {
    console.error('❌ Request failed after Phase 1 (phase1Only mode)');
    throw lastError;
  }

  // === PHASE 2: Second attempt (max 20s) ===
  console.info('🔄 Phase 2: Extended retry attempt (max 20s)...');

  for (let attempt = 0; attempt < RETRY_DELAYS_PHASE2.length; attempt++) {
    try {
      const result = await fn();

      // Success after phase 2!
      if (showToast) {
        toast.success('Connection restored!', { duration: 2000 });
      }

      return result;
    } catch (error: any) {
      lastError = error;

      // Check if we should retry
      const shouldRetry = isRetryableError(error);

      if (!shouldRetry || attempt === RETRY_DELAYS_PHASE2.length - 1) {
        // Final failure after phase 2
        console.error(
          `❌ Request failed after Phase 2 (total ~30s). Final error:`,
          error.message
        );

        if (showToast) {
          toast.error(
            'Server unavailable. Please try again later.',
            { duration: 5000 }
          );
        }

        throw lastError;
      }

      const delay = RETRY_DELAYS_PHASE2[attempt];
      console.warn(
        `⚠️ Phase 2 retry ${attempt + 1}/${RETRY_DELAYS_PHASE2.length}: ` +
        `Retrying in ${delay}ms... (${error.response?.status || error.code})`
      );

      if (onRetry) {
        onRetry(attempt + 1, 2, error);
      }

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// === HELPER FUNCTION ===
function isRetryableError(error: any): boolean {
  // HTTP error with retryable status code (500, 502, 503, 504)
  if (error.response?.status && RETRYABLE_STATUS_CODES.includes(error.response.status)) {
    return true;
  }

  // Network errors (connection refused, timeout, etc.)
  if (error.code === 'ECONNREFUSED' ||
      error.code === 'ETIMEDOUT' ||
      error.message?.includes('Network Error') ||
      error.message?.includes('timeout')) {
    return true;
  }

  return false;
}

```

**Usage examples:**

```typescript
// === BASIC USAGE - Automatic toast notifications ===
import { retryOnFailure } from '@/utils/retry';

const fetchContacts = async () => {
  return retryOnFailure(
    () => apiClient.get('/api/v1/contacts')
    // Default: showToast=true, both phases enabled
  );
};

// === CUSTOM OPTIONS - Track retry attempts ===
const saveContact = async (data: ContactData) => {
  return retryOnFailure(
    () => apiClient.post('/api/v1/contacts', data),
    {
      onRetry: (attempt, phase, error) => {
        console.log(`Retry attempt ${attempt} in phase ${phase}:`, error.message);
      },
      onPhase1Complete: () => {
        console.log('Phase 1 failed, moving to Phase 2...');
      }
    }
  );
};

// === SILENT MODE - No toast notifications ===
const backgroundSync = async () => {
  return retryOnFailure(
    () => apiClient.get('/api/v1/sync'),
    {
      showToast: false // No user notifications for background tasks
    }
  );
};

// === PHASE 1 ONLY - Quick fail for non-critical operations ===
const fetchSuggestions = async (query: string) => {
  return retryOnFailure(
    () => apiClient.get('/api/v1/suggestions', { params: { q: query } }),
    {
      phase1Only: true // Only max 10s, fail faster for autocomplete
    }
  );
};
```

**Timeline example:**

```
User action: Click "Save Contact"
  ↓
Phase 1 starts (max 10s):
  - Try 1: Immediate → 500 error
  - Wait 1s
  - Try 2: → 500 error
  - Wait 2s
  - Try 3: → 500 error
  - Wait 4s
  - Try 4: → 500 error (total ~7s elapsed)
  ↓
Phase 1 complete → Toast: "Server problem detected. Retrying..."
  ↓
Phase 2 starts (max 20s):
  - Try 1: Immediate → 500 error
  - Wait 1s
  - Try 2: → 500 error
  - Wait 2s
  - Try 3: → 500 error
  - Wait 4s
  - Try 4: → 500 error
  - Wait 8s
  - Try 5: → 500 error (total ~15s elapsed)
  ↓
Phase 2 failed → Toast: "Server unavailable. Please try again later."
  ↓
Total elapsed: ~22s (within 30s limit)
```

---

## 5. Translation System

### useTranslation Hook

**Import:**
```typescript
import { useTranslation } from '@l-kern/config';
```

**Usage:**
```typescript
export const ContactsPage: React.FC = () => {
  const { t, currentLanguage, setLanguage } = useTranslation();

  return (
    <div>
      <h1>{t('contacts.title')}</h1>
      <button onClick={() => setLanguage('en')}>
        {t('common.buttons.save')}
      </button>
      <p>{t('contacts.description', { count: 42 })}</p>
    </div>
  );
};
```

**Rules:**
- ✅ **ALWAYS use `t()` for user-facing text** (NO hardcoded strings)
- ✅ Translation keys use dot notation: `common.buttons.save`
- ✅ Pass variables via second parameter: `t('key', { var: value })`
- ✅ Add translations to BOTH `sk.ts` and `en.ts`
- ✅ Update `types.ts` for TypeScript autocomplete

**Adding new translations:**

1. **types.ts:**
```typescript
export interface Translations {
  contacts: {
    title: string;
    description: string;
    empty: string;
  };
}
```

2. **sk.ts:**
```typescript
export const sk: Translations = {
  contacts: {
    title: 'Kontakty',
    description: 'Zoznam kontaktov',
    empty: 'Žiadne kontakty'
  }
};
```

3. **en.ts:**
```typescript
export const en: Translations = {
  contacts: {
    title: 'Contacts',
    description: 'Contact list',
    empty: 'No contacts'
  }
};
```

---

## 6. Form Handling

### Form Validation Example

**ContactForm.tsx:**

```typescript
import React, { useState } from 'react';
import { useTranslation } from '@l-kern/config';
import { Input, Button, FormField } from '@l-kern/ui-components';

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
  initialData?: ContactFormData;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  initialData
}) => {
  const { t } = useTranslation();

  // === STATE ===
  const [formData, setFormData] = useState<ContactFormData>(
    initialData || { name: '', email: '', phone: '' }
  );
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // === VALIDATION ===
  const validate = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('validation.required');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('validation.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation.invalidEmail');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // === HANDLERS ===
  const handleChange = (field: keyof ContactFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // === RENDER ===
  return (
    <form onSubmit={handleSubmit}>
      <FormField
        label={t('contacts.form.name')}
        error={errors.name}
        required
      >
        <Input
          value={formData.name}
          onChange={handleChange('name')}
          error={!!errors.name}
        />
      </FormField>

      <FormField
        label={t('contacts.form.email')}
        error={errors.email}
        required
      >
        <Input
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          error={!!errors.email}
        />
      </FormField>

      <FormField
        label={t('contacts.form.phone')}
        error={errors.phone}
      >
        <Input
          type="tel"
          value={formData.phone}
          onChange={handleChange('phone')}
          error={!!errors.phone}
        />
      </FormField>

      <Button
        type="submit"
        variant="primary"
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        {t('common.buttons.save')}
      </Button>
    </form>
  );
};
```

---

## Summary

**Frontend standards cover:**
- ✅ React 19 functional components with hooks
- ✅ TypeScript strict typing
- ✅ Vite 6 configuration (HMR, build optimization)
- ✅ CSS Modules with theme variables
- ✅ REST API client with Axios
- ✅ Retry logic for resilience
- ✅ Translation system (useTranslation)
- ✅ Form validation patterns

**See also:**
- [coding-standards.md](coding-standards.md) - Core standards (DRY, file headers, naming)
- [code-examples.md](code-examples.md) - Practical code examples
- [testing-guide.md](testing-guide.md) - Vitest testing patterns

---

**Last Updated:** 2025-10-18
**Maintainer:** BOSSystems s.r.o.
