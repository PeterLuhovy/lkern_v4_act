# Page Templates

This folder contains templates for creating new pages in L-KERN v4.

## 📋 Available Templates

### `BasePageTemplate.tsx`
**Use for:** Standard application pages with common functionality

**Features:**
- ✅ BasePage wrapper (global keyboard shortcuts)
- ✅ Translation support (useTranslation hook)
- ✅ Common UI components imported
- ✅ Proper TypeScript types
- ✅ DRY compliance (no hardcoded values)
- ✅ Standardized file header

---

## 🚀 How to Use a Template

### Step 1: Copy Entire Template Folder
```bash
# Copy the entire BasePageTemplate folder
cp -r src/pages/_templates/BasePageTemplate src/pages/testing/MyNewPage

# Or for production pages:
cp -r src/pages/_templates/BasePageTemplate src/pages/MyNewPage
```

### Step 2: Rename Files Inside Folder
```bash
cd src/pages/testing/MyNewPage  # or src/pages/MyNewPage

# Rename .tsx file
mv BasePageTemplate.tsx MyNewPage.tsx

# Rename .module.css file
mv BasePageTemplate.module.css MyNewPage.module.css
```

### Step 3: Update Import in .tsx File
```tsx
// In MyNewPage.tsx, change:
import styles from './BasePageTemplate.module.css';

// To:
import styles from './MyNewPage.module.css';
```

### Step 5: Customize File Headers
```tsx
/*
 * ================================================================
 * FILE: MyNewPage.tsx
 * PATH: /apps/web-ui/src/pages/testing/MyNewPage/MyNewPage.tsx
 * DESCRIPTION: Your page description here
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 21:00:00
 * ================================================================
 */
```

```css
/*
 * ================================================================
 * FILE: MyNewPage.module.css
 * PATH: /apps/web-ui/src/pages/testing/MyNewPage/MyNewPage.module.css
 * DESCRIPTION: Styles for MyNewPage
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 21:00:00
 * ================================================================
 */
```

### Step 6: Rename Component Function
```tsx
// BEFORE:
export function BasePageTemplate() {

// AFTER:
export function MyNewPage() {
```

### Step 7: Update index.ts
```tsx
// In index.ts, update the export:
export { MyNewPage } from './MyNewPage';
```

### Step 8: Replace Page Content
- Update page title
- Update page description
- Add your specific content
- Customize CSS Modules styles as needed

### Step 9: Add Route
Add route in `apps/web-ui/src/app/app.tsx`:
```tsx
import { MyNewPage } from '../pages/testing/MyNewPage';

// ...

<Route path="/testing/my-new-page" element={<MyNewPage />} />
```

---

## ✅ Best Practices

### 1. Always Use BasePage Wrapper
```tsx
return (
  <BasePage>
    {/* Your page content */}
  </BasePage>
);
```

**Why?** BasePage provides global keyboard shortcuts (ESC closes modals, etc.)

### 2. Use Translations for All Text
```tsx
// ✅ CORRECT
<h1>{t('myPage.title')}</h1>

// ❌ WRONG
<h1>My Page Title</h1>
```

### 3. Use CSS Variables for Colors
```tsx
// ✅ CORRECT
color: 'var(--theme-text, #212121)'

// ❌ WRONG
color: '#212121'
```

### 4. Import from @l-kern Packages
```tsx
// ✅ CORRECT
import { Button, Input } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';

// ❌ WRONG
import Button from '../../components/Button';
```

### 5. Use Proper File Headers
Every file MUST have standardized header with:
- FILE: filename
- PATH: full path from project root
- DESCRIPTION: what the file does
- VERSION: semantic version
- UPDATED: last update timestamp

---

## 📚 Common Imports

### UI Components
```tsx
import {
  BasePage,      // Page wrapper (REQUIRED)
  Button,        // Buttons
  Input,         // Text inputs
  Select,        // Dropdowns
  Checkbox,      // Checkboxes
  Card,          // Card containers
  Modal,         // Modals
  EmptyState,    // Empty states
  Spinner,       // Loading spinners
} from '@l-kern/ui-components';
```

### Hooks & Utilities
```tsx
import {
  useTranslation, // Translation hook
  useModal,       // Modal state management
  modalStack,     // Modal stack management
} from '@l-kern/config';
```

---

## 🎯 Example: Creating a New Page

```tsx
/*
 * ================================================================
 * FILE: ContactsPage.tsx
 * PATH: /apps/web-ui/src/pages/ContactsPage.tsx
 * DESCRIPTION: Contacts management page
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 20:45:00
 * ================================================================
 */

import React, { useState } from 'react';
import { BasePage, Button, Card } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';

export function ContactsPage() {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState([]);

  return (
    <BasePage>
      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '32px', fontSize: '32px', fontWeight: '700' }}>
          {t('contacts.title')}
        </h1>

        <Card>
          {/* Your contacts list here */}
        </Card>
      </div>
    </BasePage>
  );
}

export default ContactsPage;
```

---

## 🔗 Related Documentation

- **BasePage Component**: [packages/ui-components/src/components/BasePage/BasePage.tsx](../../packages/ui-components/src/components/BasePage/BasePage.tsx)
- **Coding Standards**: [docs/programming/coding-standards.md](../../../../docs/programming/coding-standards.md)
- **Translation System**: [packages/config/src/translations/](../../../packages/config/src/translations/)

---

**Last Updated:** 2025-10-18 20:45:00
