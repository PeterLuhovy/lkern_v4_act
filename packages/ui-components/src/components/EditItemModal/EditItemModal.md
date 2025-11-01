# ================================================================
# EditItemModal
# ================================================================
# File: L:\system\lkern_codebase_v4_act\packages\ui-components\src\components\EditItemModal\EditItemModal.md
# Version: 2.0.0
# Created: 2025-10-30
# Updated: 2025-11-01
# Source: packages/ui-components/src/components/EditItemModal/EditItemModal.tsx
# Package: @l-kern/ui-components
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Generic add/edit modal wrapper with unsaved changes detection
#   and optional clear button functionality.
# ================================================================

---

## Overview

**Purpose**: Reusable wrapper for add/edit modal workflows with built-in unsaved changes protection
**Package**: @l-kern/ui-components
**Path**: packages/ui-components/src/components/EditItemModal
**Since**: v1.0.0

EditItemModal is a specialized modal wrapper that simplifies common add/edit form scenarios. It provides pre-configured footer buttons (Save/Cancel), optional clear functionality with confirmation, and automatic unsaved changes detection through integration with the `useFormDirty` hook.

**Key Benefits:**
- Eliminates boilerplate for add/edit modals
- Built-in unsaved changes protection
- Consistent user experience across all forms
- Full translation support (SK/EN)

---

## Features

- ✅ **Generic wrapper** - Configurable via props for any add/edit scenario
- ✅ **Unsaved changes detection** - Automatic confirmation before closing with unsaved data
- ✅ **Optional clear button** - Left footer slot with confirmation dialog
- ✅ **Customizable buttons** - Override default text for Save/Cancel/Clear
- ✅ **useFormDirty integration** - Pass `hasUnsavedChanges` from hook
- ✅ **Full translations** - SK/EN support via translation system
- ✅ **Nested modals** - Works with modalStack for proper hierarchy
- ✅ **Keyboard accessible** - ESC to cancel, Enter to save

---

## Quick Start

### Basic Usage

```tsx
import { EditItemModal, Input, FormField } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import { useState } from 'react';

function AddEmailModal() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');

  const handleSave = () => {
    // Save logic here
    console.log('Saving email:', email);
    setIsOpen(false);
  };

  return (
    <EditItemModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onSave={handleSave}
      title="Pridať email"
      modalId="add-email"
      saveDisabled={!email}
    >
      <FormField label="Email" required>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
        />
      </FormField>
    </EditItemModal>
  );
}
```

### Common Patterns

#### Pattern 1: With Unsaved Changes Detection

```tsx
import { EditItemModal, Input, FormField } from '@l-kern/ui-components';
import { useFormDirty } from '@l-kern/config';
import { useState } from 'react';

function EditContactModal({ initialData, onSave }) {
  const [formData, setFormData] = useState(initialData);
  const { isDirty } = useFormDirty(initialData, formData);

  return (
    <EditItemModal
      isOpen={true}
      onClose={handleClose}
      onSave={() => onSave(formData)}
      title="Upraviť kontakt"
      modalId="edit-contact"
      hasUnsavedChanges={isDirty}  // ✅ Automatic confirmation before close
    >
      <FormField label="Meno">
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </FormField>
      <FormField label="Email">
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </FormField>
    </EditItemModal>
  );
}
```

#### Pattern 2: With Clear Button

```tsx
import { EditItemModal, Input, FormField } from '@l-kern/ui-components';
import { useState } from 'react';

function AddPhoneModal() {
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('mobile');

  const handleClear = () => {
    setPhone('');
    setType('mobile');
  };

  return (
    <EditItemModal
      isOpen={true}
      onClose={handleClose}
      onSave={handleSave}
      title="Pridať telefón"
      modalId="add-phone"
      showClearButton  // ✅ Shows clear button in left footer slot
      onClear={handleClear}
    >
      <FormField label="Telefón">
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </FormField>
      <FormField label="Typ">
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="mobile">Mobil</option>
          <option value="home">Domáci</option>
          <option value="work">Pracovný</option>
        </Select>
      </FormField>
    </EditItemModal>
  );
}
```

#### Pattern 3: Nested Modal (Parent → Edit)

```tsx
import { EditItemModal, Input, FormField } from '@l-kern/ui-components';

function EmailListModal() {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      {/* Parent Modal */}
      <Modal
        isOpen={true}
        modalId="email-list"
        title="Zoznam emailov"
      >
        <Button onClick={() => setShowEditModal(true)}>
          Pridať email
        </Button>
      </Modal>

      {/* Nested Edit Modal */}
      <EditItemModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSave}
        title="Pridať email"
        modalId="add-email"
        parentModalId="email-list"  // ✅ Proper modal hierarchy
      >
        <FormField label="Email">
          <Input type="email" />
        </FormField>
      </EditItemModal>
    </>
  );
}
```

---

## Props API

### EditItemModalProps

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `isOpen` | `boolean` | - | Yes | Controls modal visibility |
| `onClose` | `() => void` | - | Yes | Called when modal is closed (cancel/ESC) |
| `onSave` | `() => void` | - | Yes | Called when user saves the form |
| `title` | `string` | - | Yes | Modal title (e.g., "Pridať email") |
| `modalId` | `string` | - | Yes | Unique modal identifier |
| `parentModalId` | `string` | `undefined` | No | Parent modal ID (for nested modals) |
| `children` | `ReactNode` | - | Yes | Form fields content |
| `saveDisabled` | `boolean` | `false` | No | Whether save button should be disabled |
| `saveText` | `string` | `"Uložiť"` | No | Custom save button text |
| `cancelText` | `string` | `"Zrušiť"` | No | Custom cancel button text |
| `showClearButton` | `boolean` | `false` | No | Show clear button in footer left slot |
| `clearButtonText` | `string` | `"Vyčistiť formulár"` | No | Custom clear button text |
| `onClear` | `() => void` | `undefined` | No | Called when user confirms form clear |
| `hasUnsavedChanges` | `boolean` | `false` | No | Triggers confirmation on close (from useFormDirty) |
| `unsavedChangesTitle` | `string` | `"Neuložené zmeny"` | No | Custom unsaved changes title |
| `unsavedChangesMessage` | `string` | `"Máte neuložené zmeny..."` | No | Custom unsaved changes message |
| `size` | `ModalSize` | `'md'` | No | Modal size (sm, md, lg) |

### Type Definitions

```typescript
type ModalSize = 'sm' | 'md' | 'lg';

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  title: string;
  modalId: string;
  parentModalId?: string;
  children: React.ReactNode;
  saveDisabled?: boolean;
  saveText?: string;
  cancelText?: string;
  showClearButton?: boolean;
  clearButtonText?: string;
  onClear?: () => void;
  hasUnsavedChanges?: boolean;
  unsavedChangesTitle?: string;
  unsavedChangesMessage?: string;
  size?: ModalSize;
}
```

---

## Examples

### Example 1: Simple Add Modal

```tsx
<EditItemModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSave={handleSave}
  title="Pridať poznámku"
  modalId="add-note"
  saveDisabled={!note}
>
  <FormField label="Poznámka" required>
    <Input
      value={note}
      onChange={(e) => setNote(e.target.value)}
      placeholder="Napíšte poznámku..."
    />
  </FormField>
</EditItemModal>
```

### Example 2: Edit with Validation

```tsx
const [errors, setErrors] = useState({});
const isValid = Object.keys(errors).length === 0;

<EditItemModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSave={handleSave}
  title="Upraviť adresu"
  modalId="edit-address"
  saveDisabled={!isValid}  // ✅ Disable save until valid
>
  <FormField label="Ulica" error={errors.street}>
    <Input
      value={street}
      onChange={(e) => {
        setStreet(e.target.value);
        validateStreet(e.target.value);
      }}
    />
  </FormField>
</EditItemModal>
```

### Example 3: Full Featured (Clear + Unsaved Changes)

```tsx
const [initialData] = useState({ name: '', email: '' });
const [formData, setFormData] = useState(initialData);
const { isDirty } = useFormDirty(initialData, formData);

const handleClear = () => {
  setFormData(initialData);
};

<EditItemModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSave={() => handleSave(formData)}
  title="Upraviť používateľa"
  modalId="edit-user"
  hasUnsavedChanges={isDirty}     // ✅ Confirmation before close
  showClearButton                  // ✅ Clear button in left slot
  onClear={handleClear}
  saveDisabled={!formData.name || !formData.email}
>
  <FormField label="Meno" required>
    <Input
      value={formData.name}
      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    />
  </FormField>
  <FormField label="Email" required>
    <Input
      type="email"
      value={formData.email}
      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    />
  </FormField>
</EditItemModal>
```

---

## Integration with useFormDirty

EditItemModal is designed to work seamlessly with the `useFormDirty` hook:

```tsx
import { EditItemModal, Input, FormField } from '@l-kern/ui-components';
import { useFormDirty } from '@l-kern/config';
import { useState } from 'react';

function EditItemExample({ initialData, onSave }) {
  const [formData, setFormData] = useState(initialData);

  // Track unsaved changes
  const { isDirty, changedFields } = useFormDirty(initialData, formData, {
    ignoreFields: ['updated_at'],
  });

  return (
    <EditItemModal
      isOpen={true}
      onClose={handleClose}
      onSave={() => onSave(formData)}
      title="Upraviť položku"
      modalId="edit-item"
      hasUnsavedChanges={isDirty}  // ✅ Pass isDirty from hook
      saveDisabled={!isDirty}       // ✅ Disable save if nothing changed
    >
      <FormField label="Názov">
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </FormField>

      {/* Show which fields changed (optional) */}
      {isDirty && (
        <p>Zmenené polia: {changedFields.join(', ')}</p>
      )}
    </EditItemModal>
  );
}
```

---

## Translation Keys

EditItemModal uses the following translation keys (from `@l-kern/config`):

**Default Buttons:**
```typescript
'components.modalV3.editItemModal.defaultSave'    // "Uložiť" / "Save"
'components.modalV3.editItemModal.defaultCancel'  // "Zrušiť" / "Cancel"
'components.modalV3.editItemModal.defaultClear'   // "Vyčistiť formulár" / "Clear Form"
```

**Clear Confirmation:**
```typescript
'components.modalV3.editItemModal.clearConfirmTitle'    // "Vyčistiť formulár?" / "Clear Form?"
'components.modalV3.editItemModal.clearConfirmMessage'  // "Naozaj chcete vymazať..." / "Do you really want to clear..."
'components.modalV3.editItemModal.clearConfirmButton'   // "Vyčistiť" / "Clear"
```

**Unsaved Changes (from ConfirmModal):**
```typescript
'components.modalV3.confirmModal.unsavedChanges.title'    // "Neuložené zmeny" / "Unsaved Changes"
'components.modalV3.confirmModal.unsavedChanges.message'  // "Máte neuložené zmeny..." / "You have unsaved changes..."
```

---

## Testing Patterns

### Unit Testing

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EditItemModal } from './EditItemModal';
import { TranslationProvider } from '@l-kern/config';

const renderWithTranslations = (ui: React.ReactElement) => {
  return render(
    <TranslationProvider>
      {ui}
    </TranslationProvider>
  );
};

describe('EditItemModal', () => {
  it('renders with required props', () => {
    renderWithTranslations(
      <EditItemModal
        isOpen={true}
        onClose={() => {}}
        onSave={() => {}}
        title="Test Modal"
        modalId="test-modal"
      >
        <div>Content</div>
      </EditItemModal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('shows unsaved changes confirmation', async () => {
    const onClose = jest.fn();

    renderWithTranslations(
      <EditItemModal
        isOpen={true}
        onClose={onClose}
        onSave={() => {}}
        title="Test"
        modalId="test"
        hasUnsavedChanges={true}
      >
        <div>Content</div>
      </EditItemModal>
    );

    // Click cancel
    fireEvent.click(screen.getByTestId('edit-item-modal-cancel'));

    // Confirmation modal should appear
    await waitFor(() => {
      expect(screen.getByText(/neuložené zmeny/i)).toBeInTheDocument();
    });

    // onClose NOT called yet
    expect(onClose).not.toHaveBeenCalled();
  });

  it('shows clear confirmation', async () => {
    const onClear = jest.fn();

    renderWithTranslations(
      <EditItemModal
        isOpen={true}
        onClose={() => {}}
        onSave={() => {}}
        title="Test"
        modalId="test"
        showClearButton
        onClear={onClear}
      >
        <div>Content</div>
      </EditItemModal>
    );

    // Click clear
    fireEvent.click(screen.getByTestId('edit-item-modal-clear'));

    // Confirmation modal should appear
    await waitFor(() => {
      expect(screen.getByText(/vyčistiť formulár/i)).toBeInTheDocument();
    });

    // onClear NOT called yet
    expect(onClear).not.toHaveBeenCalled();
  });
});
```

---

## Known Issues

### Issue #1: None Currently

No known issues at this time.

---

## Changelog

### v2.0.0 (2025-11-01)
- ✅ **IMPROVEMENT**: Enhanced dirty tracking implementation
  - Added own `useConfirm` hook instance in EditItemModal
  - Added `handleCloseWithConfirm()` function for Cancel button
  - Cancel button now properly triggers unsaved changes confirmation
  - Added unsaved changes ConfirmModal at end of render tree
  - Removed dependency on base Modal dirty tracking (custom footers need own logic)
- ✅ **BUGFIX**: Fixed Cancel button not showing unsaved changes confirmation
  - Previously called `onClose()` directly, bypassing confirmation
  - Now calls `handleCloseWithConfirm()` which checks `hasUnsavedChanges`

### v1.0.0 (2025-10-30)
- 🎉 Initial implementation
- Generic wrapper with unsaved changes detection
- Clear button functionality
- Save/Cancel buttons

---

## Related Components

- [Modal](../Modal/Modal.md) - Base modal component
- [ConfirmModal](../ConfirmModal/ConfirmModal.md) - Confirmation dialog (used internally)
- [useFormDirty](../../../../config/src/hooks/useFormDirty/useFormDirty.md) - Track unsaved changes
- [Button](../Button/Button.md) - Footer buttons
- [FormField](../FormField/FormField.md) - Form field wrapper
- [Input](../Input/Input.md) - Text input component

---

**Last Updated:** 2025-10-30
**Maintainer:** BOSSystems s.r.o.
**Status:** ✅ Production Ready