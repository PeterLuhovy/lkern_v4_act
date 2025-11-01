# ================================================================
# ManagementModal
# ================================================================
# File: L:\system\lkern_codebase_v4_act\packages\ui-components\src\components\ManagementModal\ManagementModal.md
# Version: 2.0.0
# Created: 2025-10-31
# Updated: 2025-11-01
# Source: packages/ui-components/src/components/ManagementModal/ManagementModal.tsx
# Package: @l-kern/ui-components
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Generic list management modal with add/edit/delete all functionality,
#   dirty tracking (unsaved changes detection), and nested modal integration.
# ================================================================

---

## Overview

**Purpose**: Reusable wrapper for list management workflows with dirty tracking (phones, emails, addresses, roles, etc.)
**Package**: @l-kern/ui-components
**Path**: packages/ui-components/src/components/ManagementModal
**Since**: v1.0.0 (Current: v2.0.0)

ManagementModal is a specialized modal wrapper for managing collections of items. It provides a consistent interface for list editors with built-in delete all functionality, empty state handling, and integration with nested modals (typically EditItemModal for add/edit operations).

**Key Benefits:**
- Eliminates boilerplate for list management modals
- Built-in delete all with danger confirmation
- Automatic empty state when no items
- Consistent user experience across all list types
- Full translation support (SK/EN)

---

## Features

- ✅ **Generic list wrapper** - Configurable for any list type (phones, emails, addresses, etc.)
- ✅ **Dirty tracking** - Unsaved changes detection with confirmation dialog (`hasUnsavedChanges` prop)
- ✅ **Save/Cancel pattern** - Cancel button (with unsaved changes check) + Save button in footer
- ✅ **Delete all with confirmation** - Danger mode ConfirmModal with keyword verification
- ✅ **Empty state support** - Shows EmptyState component when items array is empty
- ✅ **Custom empty state** - Override message, icon, and action button
- ✅ **Full translations** - SK/EN support via translation system
- ✅ **Nested modals** - Works with EditItemModal for add/edit workflows
- ✅ **Keyboard accessible** - ESC to close (with unsaved changes check)

---

## Quick Start

### Basic Usage

```tsx
import { ManagementModal } from '@l-kern/ui-components';
import { useState } from 'react';

function PhoneManagementModal({ phones, onPhonesChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteAll = () => {
    onPhonesChange([]);
  };

  return (
    <ManagementModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Správa telefónov"
      modalId="manage-phones"
      items={phones}
      onDeleteAll={handleDeleteAll}
      emptyStateMessage="Žiadne telefónne čísla"
      emptyStateIcon="📱"
    >
      {/* Your list editor component */}
      <PhoneListEditor phones={phones} onChange={onPhonesChange} />
    </ManagementModal>
  );
}
```

### Common Patterns

#### Pattern 1: With Empty State + Add Button

```tsx
import { ManagementModal } from '@l-kern/ui-components';
import { useState } from 'react';

function EmailManagementModal({ emails, onEmailsChange }) {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <ManagementModal
      isOpen={true}
      onClose={handleClose}
      title="Správa emailov"
      modalId="manage-emails"
      items={emails}
      onDeleteAll={() => onEmailsChange([])}
      emptyStateMessage="Žiadne emaily"
      emptyStateIcon="📧"
      addButtonText="Pridať prvý email"
      onAdd={() => setShowAddModal(true)}  // ✅ Shows in empty state
    >
      <EmailListEditor emails={emails} onChange={onEmailsChange} />
    </ManagementModal>
  );
}
```

#### Pattern 2: Complete Add/Edit/Delete Workflow

```tsx
import { ManagementModal, EditItemModal, Input, FormField } from '@l-kern/ui-components';
import { useState } from 'react';

function AddressManagementModal({ addresses, onAddressesChange }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({ street: '', city: '' });

  const handleAdd = () => {
    setEditingAddress(null);
    setFormData({ street: '', city: '' });
    setShowEditModal(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData(address);
    setShowEditModal(true);
  };

  const handleSave = () => {
    if (editingAddress) {
      // Update existing
      onAddressesChange(
        addresses.map(a => a.id === editingAddress.id ? formData : a)
      );
    } else {
      // Add new
      onAddressesChange([...addresses, { ...formData, id: Date.now() }]);
    }
    setShowEditModal(false);
  };

  const handleDelete = (addressId) => {
    onAddressesChange(addresses.filter(a => a.id !== addressId));
  };

  const handleDeleteAll = () => {
    onAddressesChange([]);
  };

  return (
    <>
      {/* Management Modal */}
      <ManagementModal
        isOpen={true}
        onClose={handleClose}
        title="Správa adries"
        modalId="manage-addresses"
        items={addresses}
        onDeleteAll={handleDeleteAll}
        emptyStateMessage="Žiadne adresy"
        emptyStateIcon="📍"
        onAdd={handleAdd}
      >
        <AddressListEditor
          addresses={addresses}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
      </ManagementModal>

      {/* Nested Edit Modal */}
      <EditItemModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSave}
        title={editingAddress ? 'Upraviť adresu' : 'Pridať adresu'}
        modalId="edit-address"
        parentModalId="manage-addresses"  // ✅ Proper nesting
      >
        <FormField label="Ulica">
          <Input
            value={formData.street}
            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
          />
        </FormField>
        <FormField label="Mesto">
          <Input
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
        </FormField>
      </EditItemModal>
    </>
  );
}
```

#### Pattern 3: Custom Delete All Confirmation

```tsx
import { ManagementModal } from '@l-kern/ui-components';

function RoleManagementModal({ roles, onRolesChange }) {
  return (
    <ManagementModal
      isOpen={true}
      onClose={handleClose}
      title="Správa rolí"
      modalId="manage-roles"
      items={roles}
      onDeleteAll={() => onRolesChange([])}
      deleteAllTitle="Zmazať všetky role?"  // ✅ Custom title
      deleteAllMessage="Táto akcia odstráni všetky pridelené role. Používateľ ostane bez oprávnení."  // ✅ Custom message
    >
      <RoleListEditor roles={roles} onChange={onRolesChange} />
    </ManagementModal>
  );
}
```

---

## Props API

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Controls modal visibility |
| `onClose` | `() => void` | Called when modal is closed (Done button or ESC) |
| `title` | `string` | Modal title (e.g., "Správa telefónov") |
| `modalId` | `string` | Unique modal identifier for modalStack |
| `items` | `any[]` | Array of items (used for delete all validation and empty state) |
| `onDeleteAll` | `() => void` | Called when user confirms "Delete All" action |
| `children` | `React.ReactNode` | List editor component content |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `parentModalId` | `string` | `undefined` | Parent modal ID (for nested modals) |
| `deleteAllTitle` | `string` | `t('managementModal.deleteAll.title')` | Custom delete all confirmation title |
| `deleteAllMessage` | `string` | `t('managementModal.deleteAll.message')` | Custom delete all confirmation message |
| `emptyStateMessage` | `string` | `t('managementModal.emptyState.message')` | Custom empty state message |
| `emptyStateIcon` | `string` | `"📭"` | Empty state icon (emoji) |
| `addButtonText` | `string` | `t('managementModal.emptyState.action')` | Add button text (in empty state) |
| `onAdd` | `() => void` | `undefined` | Called when add button clicked (in empty state) |
| `maxWidth` | `string` | `"700px"` | Modal max width |
| `maxHeight` | `string` | `"80vh"` | Modal max height |

---

## Usage Notes

### Empty State Behavior

- **When `items.length === 0`**: Shows EmptyState component, hides children
- **When `items.length > 0`**: Shows children, hides EmptyState
- **Add button**: Only shows in empty state if `onAdd` prop is provided

### Delete All Flow

1. User clicks "Zmazať všetky" button (disabled when `items.length === 0`)
2. ConfirmModal opens with danger mode (requires typing "ano")
3. If confirmed → `onDeleteAll()` called → ConfirmModal closes → ManagementModal stays open
4. If cancelled → ConfirmModal closes → ManagementModal stays open

### Nested Modal Integration

ManagementModal is designed to work seamlessly with EditItemModal:

```
ManagementModal (list view)
  └─> EditItemModal (add/edit single item)
       └─> ConfirmModal (unsaved changes confirmation)
```

**Proper nesting:**
```tsx
<ManagementModal modalId="manage-phones" {...props}>
  {/* List content */}
</ManagementModal>

<EditItemModal
  parentModalId="manage-phones"  // ✅ Links to parent
  modalId="edit-phone"
  {...props}
/>
```

---

## Translation Keys

ManagementModal uses the following translation keys:

```typescript
// SK translations (packages/config/src/translations/sk.ts)
components: {
  modals: {
    managementModal: {
      deleteAllButton: 'Zmazať všetky',
      doneButton: 'Hotovo',
      emptyState: {
        message: 'Žiadne položky',
        action: 'Pridať prvú položku',
      },
      deleteAll: {
        title: 'Zmazať všetky položky?',
        message: 'Táto akcia je nevratná. Všetky položky budú natrvalo odstránené.',
      },
    },
  },
},
```

**Override defaults:**
```tsx
<ManagementModal
  deleteAllTitle="Vlastný nadpis"  // Overrides t('managementModal.deleteAll.title')
  emptyStateMessage="Vlastná správa"  // Overrides t('managementModal.emptyState.message')
  {...otherProps}
/>
```

---

## Accessibility

- ✅ **Keyboard navigation**: ESC to close, Tab between buttons
- ✅ **ARIA labels**: Modal has proper aria-labelledby
- ✅ **Focus management**: Focus returns to trigger after close
- ✅ **Screen reader support**: ConfirmModal announces danger mode
- ✅ **Button states**: Delete All disabled when empty (clear visual feedback)

---

## Examples

### Example 1: Phone List Management

```tsx
import { ManagementModal, EditItemModal, Input, Select, FormField } from '@l-kern/ui-components';
import { useState } from 'react';

interface Phone {
  id: number;
  number: string;
  type: 'mobile' | 'home' | 'work';
}

function PhoneManagement() {
  const [phones, setPhones] = useState<Phone[]>([
    { id: 1, number: '+421 900 123 456', type: 'mobile' },
    { id: 2, number: '+421 2 1234 5678', type: 'work' },
  ]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPhone, setEditingPhone] = useState<Phone | null>(null);

  return (
    <>
      <ManagementModal
        isOpen={true}
        onClose={handleClose}
        title="Správa telefónov"
        modalId="manage-phones"
        items={phones}
        onDeleteAll={() => setPhones([])}
        emptyStateMessage="Žiadne telefónne čísla"
        emptyStateIcon="📱"
        onAdd={() => setShowEditModal(true)}
      >
        <PhoneList phones={phones} onEdit={setEditingPhone} />
      </ManagementModal>

      <EditItemModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSavePhone}
        title="Pridať telefón"
        modalId="edit-phone"
        parentModalId="manage-phones"
      >
        {/* Phone form fields */}
      </EditItemModal>
    </>
  );
}
```

---

## Integration

### With EditItemModal

ManagementModal → EditItemModal is the standard pattern for list management:

```tsx
<ManagementModal modalId="parent" items={items} {...props}>
  <ItemList items={items} onEdit={handleEdit} />
</ManagementModal>

<EditItemModal
  parentModalId="parent"
  modalId="child"
  hasUnsavedChanges={isDirty}  // ✅ EditItemModal features
  showClearButton
  {...props}
/>
```

### With ConfirmModal (Delete All)

ManagementModal automatically opens ConfirmModal for delete all:
- Danger mode enabled (keyword: "ano")
- Custom title/message via props
- Stays open after confirmation (allows adding new items)

---

## Component Versions

- **v1.0.0** (2025-10-31) - Initial implementation
  - Generic list management wrapper
  - Delete all with danger confirmation
  - Empty state support with custom message/icon
  - Nested modal integration (EditItemModal)
  - Full SK/EN translations

---

## Dependencies

**Direct:**
- Modal (v3.8.1+)
- Button (v1.2.0+)
- ConfirmModal (v1.0.0+)
- EmptyState (v1.0.0+)
- useTranslation (@l-kern/config)

**Peer:**
- React 19+
- @l-kern/config (translations)

---

## Testing

ManagementModal has comprehensive test coverage (25 tests):

**Tested scenarios:**
- ✅ Renders when open/closed
- ✅ Shows EmptyState when items empty
- ✅ Shows children when items exist
- ✅ Delete All button enabled/disabled based on items
- ✅ Done button always present
- ✅ Calls onClose when Done clicked
- ✅ Opens ConfirmModal on Delete All (with items)
- ✅ Calls onDeleteAll after confirmation
- ✅ Does not call onDeleteAll when cancelled
- ✅ Custom delete all title/message
- ✅ Custom empty state message/icon
- ✅ Custom maxWidth/maxHeight
- ✅ Nested modal support (parentModalId)

**Run tests:**
```bash
npm test -- ManagementModal
```

---

## Known Issues

None

---

## Changelog

### v2.0.0 (2025-11-01)
- ⚠️ **BREAKING**: Changed footer from "Done" button to "Cancel + Save" buttons
- ✅ **NEW**: Dirty tracking (unsaved changes detection)
  - Added `hasUnsavedChanges` prop (boolean)
  - Added `onSave` prop (callback when user clicks Save)
  - Cancel button shows confirmation dialog if `hasUnsavedChanges === true`
  - Uses useConfirm hook for unsaved changes confirmation
  - ESC key also triggers unsaved changes check
- ✅ **NEW**: Save/Cancel workflow
  - Cancel button closes modal (with unsaved changes check)
  - Save button calls `onSave()` callback (parent persists changes)
- ✅ **IMPROVEMENT**: Added unsaved changes ConfirmModal
  - Uses default translation keys from useConfirm
  - Integrated with `parentModalId` for proper z-index

### v1.0.0 (2025-10-31)
- Initial implementation
- Generic list management wrapper
- Delete all with ConfirmModal integration
- Empty state support
- Full translations (SK/EN)
- 25 comprehensive tests

---

## See Also

- [EditItemModal.md](../EditItemModal/EditItemModal.md) - Add/edit single item modal
- [ConfirmModal.md](../ConfirmModal/ConfirmModal.md) - Confirmation dialog
- [EmptyState.md](../EmptyState/EmptyState.md) - Empty state component
- [Modal.md](../Modal/Modal.md) - Base modal component