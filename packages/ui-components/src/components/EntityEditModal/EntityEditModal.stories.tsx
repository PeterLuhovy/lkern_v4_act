/*
 * ================================================================
 * FILE: EntityEditModal.stories.tsx
 * PATH: /packages/ui-components/src/components/EntityEditModal/EntityEditModal.stories.tsx
 * DESCRIPTION: Storybook stories for EntityEditModal component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { EntityEditModal } from './EntityEditModal';
import type { EntityEditConfig, EntitySection, EntityField } from './types';

const meta: Meta<typeof EntityEditModal> = {
  title: 'Components/Modals/EntityEditModal',
  component: EntityEditModal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls modal visibility',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Modal size',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Universal entity edit modal with configuration-driven fields. Supports multi-section editing with permission-based field access control.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof EntityEditModal>;

// ============================================================
// Mock Data
// ============================================================

const mockContact = {
  id: 1,
  firstName: 'Ján',
  lastName: 'Novák',
  email: 'jan.novak@example.com',
  phone: '+421 900 123 456',
  company: 'BOSSystems s.r.o.',
  role: 'Developer',
};

// ============================================================
// Basic Config
// ============================================================

const basicContactFields: EntityField[] = [
  {
    name: 'firstName',
    labelKey: 'Meno',
    type: 'text',
    required: true,
    width: 'half',
  },
  {
    name: 'lastName',
    labelKey: 'Priezvisko',
    type: 'text',
    required: true,
    width: 'half',
  },
  {
    name: 'email',
    labelKey: 'Email',
    type: 'email',
    required: true,
    width: 'full',
  },
  {
    name: 'phone',
    labelKey: 'Telefón',
    type: 'text',
    width: 'full',
  },
];

const basicContactSection: EntitySection = {
  id: 'basic',
  titleKey: 'Základné údaje',
  fields: basicContactFields,
  useGrid: true,
};

const basicContactConfig: EntityEditConfig = {
  entityName: 'contact',
  sections: [basicContactSection],
  permissions: {
    canEdit: () => true,
  },
};

export const BasicContact: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: (changes) => {
      console.log('Saved changes:', changes);
      return Promise.resolve(true);
    },
    entity: mockContact,
    sectionId: 'basic',
    config: basicContactConfig,
    permissionLevel: 100,
  },
};

// ============================================================
// Grid Layout vs Stack Layout
// ============================================================

const gridSection: EntitySection = {
  id: 'grid',
  titleKey: 'Grid Layout (2 columns)',
  fields: basicContactFields,
  useGrid: true,
};

const stackSection: EntitySection = {
  id: 'stack',
  titleKey: 'Stack Layout (1 column)',
  fields: basicContactFields,
  useGrid: false,
};

export const GridLayout: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: (changes) => {
      console.log('Saved changes:', changes);
      return Promise.resolve(true);
    },
    entity: mockContact,
    sectionId: 'grid',
    config: {
      entityName: 'contact',
      sections: [gridSection],
      permissions: { canEdit: () => true },
    },
    permissionLevel: 100,
  },
};

export const StackLayout: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: (changes) => {
      console.log('Saved changes:', changes);
      return Promise.resolve(true);
    },
    entity: mockContact,
    sectionId: 'stack',
    config: {
      entityName: 'contact',
      sections: [stackSection],
      permissions: { canEdit: () => true },
    },
    permissionLevel: 100,
  },
};

// ============================================================
// Field Types
// ============================================================

const allFieldTypesFields: EntityField[] = [
  {
    name: 'textField',
    labelKey: 'Text Field',
    type: 'text',
    width: 'half',
  },
  {
    name: 'emailField',
    labelKey: 'Email Field',
    type: 'email',
    width: 'half',
  },
  {
    name: 'numberField',
    labelKey: 'Number Field',
    type: 'number',
    width: 'half',
    min: 0,
    max: 100,
  },
  {
    name: 'dateField',
    labelKey: 'Date Field',
    type: 'date',
    width: 'half',
  },
  {
    name: 'selectField',
    labelKey: 'Select Field',
    type: 'select',
    width: 'full',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
  },
  {
    name: 'textareaField',
    labelKey: 'Textarea Field',
    type: 'textarea',
    width: 'full',
    rows: 4,
  },
];

export const AllFieldTypes: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: (changes) => {
      console.log('Saved changes:', changes);
      return Promise.resolve(true);
    },
    entity: {
      textField: 'Text value',
      emailField: 'test@example.com',
      numberField: 42,
      dateField: '2025-12-16',
      selectField: 'option1',
      textareaField: 'Long text value...',
    },
    sectionId: 'allTypes',
    config: {
      entityName: 'demo',
      sections: [
        {
          id: 'allTypes',
          titleKey: 'All Field Types',
          fields: allFieldTypesFields,
          useGrid: true,
        },
      ],
      permissions: { canEdit: () => true },
    },
    permissionLevel: 100,
    size: 'lg',
  },
};

// ============================================================
// With Validation
// ============================================================

const validatedFields: EntityField[] = [
  {
    name: 'email',
    labelKey: 'Email',
    type: 'email',
    required: true,
    width: 'full',
    validate: (value) => {
      if (!value || !value.includes('@')) {
        return 'validation.invalidEmail';
      }
      return undefined;
    },
  },
  {
    name: 'age',
    labelKey: 'Vek',
    type: 'number',
    required: true,
    width: 'full',
    min: 18,
    max: 120,
    validate: (value) => {
      const age = parseInt(value as string, 10);
      if (age < 18) {
        return 'validation.minAge';
      }
      return undefined;
    },
  },
];

export const WithValidation: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: (changes) => {
      console.log('Saved changes:', changes);
      return Promise.resolve(true);
    },
    entity: {
      email: 'invalid-email',
      age: 15,
    },
    sectionId: 'validated',
    config: {
      entityName: 'user',
      sections: [
        {
          id: 'validated',
          titleKey: 'Validovaný formulár',
          fields: validatedFields,
          useGrid: false,
        },
      ],
      permissions: { canEdit: () => true },
    },
    permissionLevel: 100,
  },
};

// ============================================================
// Permission-Based Access
// ============================================================

const permissionFields: EntityField[] = [
  {
    name: 'publicField',
    labelKey: 'Public Field (all can edit)',
    type: 'text',
    width: 'full',
    permissionField: 'publicField',
  },
  {
    name: 'moderatorField',
    labelKey: 'Moderator Field (moderator+ can edit)',
    type: 'text',
    width: 'full',
    permissionField: 'moderatorField',
  },
  {
    name: 'adminField',
    labelKey: 'Admin Field (admin only)',
    type: 'text',
    width: 'full',
    permissionField: 'adminField',
  },
];

export const PermissionBasedAccess: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: (changes) => {
      console.log('Saved changes:', changes);
      return Promise.resolve(true);
    },
    entity: {
      publicField: 'Public value',
      moderatorField: 'Moderator value',
      adminField: 'Admin value',
    },
    sectionId: 'permissions',
    config: {
      entityName: 'demo',
      sections: [
        {
          id: 'permissions',
          titleKey: 'Permission-Based Fields',
          fields: permissionFields,
          useGrid: false,
        },
      ],
      permissions: {
        canEdit: (fieldName, permissionLevel) => {
          // Public: level 10+
          if (fieldName === 'publicField') return permissionLevel >= 10;
          // Moderator: level 50+
          if (fieldName === 'moderatorField') return permissionLevel >= 50;
          // Admin: level 100+
          if (fieldName === 'adminField') return permissionLevel >= 100;
          return true;
        },
        getEditReasonKey: (fieldName, permissionLevel) => {
          if (fieldName === 'moderatorField' && permissionLevel < 50) {
            return 'permissions.moderatorRequired';
          }
          if (fieldName === 'adminField' && permissionLevel < 100) {
            return 'permissions.adminRequired';
          }
          return undefined;
        },
      },
    },
    permissionLevel: 50, // Moderator level
  },
  parameters: {
    docs: {
      description: {
        story: 'Try changing permissionLevel in controls to see different field access (10=public, 50=moderator, 100=admin).',
      },
    },
  },
};

// ============================================================
// Gallery
// ============================================================

export const Features: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
      <h3>EntityEditModal Features</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4><span role="img" aria-label="settings">⚙️</span> Config-Driven</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Define fields via EntityEditConfig.</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4><span role="img" aria-label="lock">🔐</span> Permissions</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Fine-grained field-level access control.</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4><span role="img" aria-label="triangular ruler">📐</span> Grid/Stack</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Choose 1-column or 2-column layout.</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4><span role="img" aria-label="checkmark">✅</span> Validation</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Custom validation per field.</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'EntityEditModal key features overview.',
      },
    },
  },
};
