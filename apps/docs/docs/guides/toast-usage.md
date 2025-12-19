---
id: toast-usage
title: Toast Notification System
sidebar_label: Toast Usage
sidebar_position: 6
---

# Toast Notification System - L-KERN v4

Guide for using toast notifications in L-KERN v4 applications.

---

## Quick Start

### 1. Setup in App.tsx

```typescript
import { ToastProvider } from '@l-kern/config';
import { ToastContainer } from '@l-kern/ui-components';

function App() {
  return (
    <ToastProvider maxToasts={5}>
      <Router>{/* routes */}</Router>
      <ToastContainer position="bottom-center" />
    </ToastProvider>
  );
}
```

### 2. Use in Components

```typescript
import { useToast } from '@l-kern/config';
import { useTranslation } from '@l-kern/config';

const MyComponent = () => {
  const { success, error } = useToast();
  const { t } = useTranslation();

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      success(t('notifications.copiedToClipboard'), {
        copiedContent: text
      });
    } catch (err) {
      error(t('notifications.copyFailed'));
    }
  };
};
```

---

## API

```typescript
const {
  success,   // Green toast
  error,     // Red toast
  warning,   // Orange toast
  info,      // Blue toast
  hideToast, // Hide by ID
  clearAll   // Clear all
} = useToast();
```

---

## Examples

```typescript
// Success
success(t('notifications.savedSuccessfully'));

// Error
error(t('notifications.saveFailed'));

// With copied content
success(t('notifications.copiedToClipboard'), {
  copiedContent: 'user@example.com'
});

// Custom duration
info('Processing...', { duration: 5000 });

// No auto-dismiss
const id = info('Wait...', { duration: 0 });
hideToast(id);
```

---

## Translation Keys

```typescript
notifications: {
  copiedToClipboard: 'Skopírované do schránky',
  savedSuccessfully: 'Úspešne uložené',
  saveFailed: 'Chyba pri ukladaní',
  // ... see translations/sk.ts for more
}
```

---

## Use from Non-React Code

```typescript
// api/contacts.ts
import { toastManager } from '@l-kern/config';

toastManager.show('Success!', { type: 'success' });
```

---

## Toast Types

| Type | Color | Use Case |
|------|-------|----------|
| `success` | Green | Successful operations (save, copy, delete) |
| `error` | Red | Failed operations, validation errors |
| `warning` | Orange | Cautions, deprecation notices |
| `info` | Blue | Informational messages, tips |

---

## Best Practices

1. **Always use translations** - Never hardcode toast messages
2. **Keep messages short** - 1-2 sentences maximum
3. **Use appropriate types** - Match toast type to message severity
4. **Include context** - Use `copiedContent` to show what was copied
5. **Handle errors gracefully** - Always show error toasts for failed operations

---

## Related

- [useToast Hook Documentation](../api/utilities-reference.md)
- [Toast Component](../api/components-reference.md)
- [ToastContainer Component](../api/components-reference.md)
