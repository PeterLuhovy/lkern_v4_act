/*
 * ================================================================
 * FILE: SectionEditModal.stories.tsx
 * PATH: /packages/ui-components/src/components/SectionEditModal/SectionEditModal.stories.tsx
 * DESCRIPTION: Storybook stories for SectionEditModal component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { SectionEditModal, FieldDefinition } from './SectionEditModal';

const meta: Meta<typeof SectionEditModal> = {
  title: 'Components/Modals/SectionEditModal',
  component: SectionEditModal,
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
    showClearButton: {
      control: 'boolean',
      description: 'Show clear button',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Generic form builder modal with FieldDefinition system. Supports text, email, number, date, select, and textarea fields with validation.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SectionEditModal>;

// ============================================================
// Basic Examples
// ============================================================

const personalInfoFields: FieldDefinition[] = [
  {
    name: 'firstName',
    label: 'Meno',
    type: 'text',
    required: true,
    placeholder: 'Ján',
  },
  {
    name: 'lastName',
    label: 'Priezvisko',
    type: 'text',
    required: true,
    placeholder: 'Novák',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    placeholder: 'jan.novak@example.com',
  },
  {
    name: 'phone',
    label: 'Telefón',
    type: 'text',
    placeholder: '+421 900 123 456',
  },
];

export const PersonalInfo: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: (data) => console.log('Saved:', data),
    title: 'Upraviť: Osobné údaje',
    modalId: 'edit-personal-info',
    fields: personalInfoFields,
    initialData: {
      firstName: 'Ján',
      lastName: 'Novák',
      email: 'jan.novak@example.com',
      phone: '+421 900 123 456',
    },
  },
};

// ============================================================
// Field Types
// ============================================================

const allFieldTypes: FieldDefinition[] = [
  {
    name: 'textField',
    label: 'Text Field',
    type: 'text',
    placeholder: 'Enter text...',
  },
  {
    name: 'emailField',
    label: 'Email Field',
    type: 'email',
    placeholder: 'email@example.com',
  },
  {
    name: 'numberField',
    label: 'Number Field',
    type: 'number',
    min: 0,
    max: 100,
    placeholder: '0',
  },
  {
    name: 'dateField',
    label: 'Date Field',
    type: 'date',
  },
  {
    name: 'selectField',
    label: 'Select Field',
    type: 'select',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
  },
  {
    name: 'textareaField',
    label: 'Textarea Field',
    type: 'textarea',
    placeholder: 'Enter long text...',
  },
];

export const AllFieldTypes: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: (data) => console.log('Saved:', data),
    title: 'All Field Types',
    modalId: 'all-field-types',
    fields: allFieldTypes,
    size: 'lg',
  },
};

// ============================================================
// With Validation
// ============================================================

const validatedFields: FieldDefinition[] = [
  {
    name: 'username',
    label: 'Používateľské meno',
    type: 'text',
    required: true,
    min: 3,
    max: 20,
    placeholder: 'min 3, max 20 znakov',
    validate: (value) => {
      if (value && value.length < 3) {
        return { isValid: false, error: 'Meno musí mať aspoň 3 znaky' };
      }
      if (value && value.length > 20) {
        return { isValid: false, error: 'Meno môže mať max 20 znakov' };
      }
      return { isValid: true };
    },
  },
  {
    name: 'password',
    label: 'Heslo',
    type: 'text',
    required: true,
    placeholder: 'min 8 znakov',
    validate: (value) => {
      if (value && value.length < 8) {
        return { isValid: false, error: 'Heslo musí mať aspoň 8 znakov' };
      }
      return { isValid: true };
    },
  },
  {
    name: 'age',
    label: 'Vek',
    type: 'number',
    required: true,
    min: 18,
    max: 120,
    validate: (value) => {
      const age = parseInt(value, 10);
      if (age < 18) {
        return { isValid: false, error: 'Musíte mať aspoň 18 rokov' };
      }
      if (age > 120) {
        return { isValid: false, error: 'Neplatný vek' };
      }
      return { isValid: true };
    },
  },
];

export const WithValidation: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: (data) => console.log('Saved:', data),
    title: 'Formulár s validáciou',
    modalId: 'validated-form',
    fields: validatedFields,
  },
};

// ============================================================
// Size Examples
// ============================================================

const shortForm: FieldDefinition[] = [
  {
    name: 'title',
    label: 'Názov',
    type: 'text',
    required: true,
  },
  {
    name: 'description',
    label: 'Popis',
    type: 'textarea',
  },
];

export const SmallSize: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: (data) => console.log('Saved:', data),
    title: 'Malý formulár',
    modalId: 'small-form',
    fields: shortForm,
    size: 'sm',
  },
};

export const LargeSize: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: (data) => console.log('Saved:', data),
    title: 'Veľký formulár',
    modalId: 'large-form',
    fields: personalInfoFields,
    size: 'lg',
  },
};

// ============================================================
// With Clear Button
// ============================================================

export const WithClearButton: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: (data) => console.log('Saved:', data),
    title: 'Formulár s tlačidlom Vyčistiť',
    modalId: 'form-with-clear',
    fields: personalInfoFields,
    showClearButton: true,
    initialData: {
      firstName: 'Ján',
      lastName: 'Novák',
      email: 'jan.novak@example.com',
    },
  },
};

// ============================================================
// Real World Examples
// ============================================================

const contactBasicFields: FieldDefinition[] = [
  {
    name: 'companyName',
    label: 'Názov spoločnosti',
    type: 'text',
    required: true,
  },
  {
    name: 'ico',
    label: 'IČO',
    type: 'text',
    pattern: '[0-9]{8}',
    placeholder: '12345678',
  },
  {
    name: 'dic',
    label: 'DIČ',
    type: 'text',
    placeholder: 'SK1234567890',
  },
];

export const ContactBasicInfo: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: (data) => console.log('Saved:', data),
    title: 'Upraviť: Základné údaje',
    modalId: 'edit-contact-basic',
    fields: contactBasicFields,
    initialData: {
      companyName: 'BOSSystems s.r.o.',
      ico: '12345678',
      dic: 'SK1234567890',
    },
  },
};

const issueFields: FieldDefinition[] = [
  {
    name: 'type',
    label: 'Typ',
    type: 'select',
    required: true,
    options: [
      { value: 'bug', label: <><span role="img" aria-label="bug">🐛</span> Bug</> },
      { value: 'feature', label: <><span role="img" aria-label="sparkles">✨</span> Feature</> },
      { value: 'improvement', label: <><span role="img" aria-label="trending up">📈</span> Improvement</> },
    ],
  },
  {
    name: 'severity',
    label: 'Závažnosť',
    type: 'select',
    required: true,
    options: [
      { value: 'minor', label: 'Minor' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'major', label: 'Major' },
      { value: 'blocker', label: <><span role="img" aria-label="alarm">🚨</span> Blocker</> },
    ],
  },
  {
    name: 'priority',
    label: 'Priorita',
    type: 'select',
    required: true,
    options: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
      { value: 'critical', label: <><span role="img" aria-label="red circle">🔴</span> Critical</> },
    ],
  },
];

export const IssueMetadata: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: (data) => console.log('Saved:', data),
    title: 'Upraviť: Metadata Issue',
    modalId: 'edit-issue-metadata',
    fields: issueFields,
    initialData: {
      type: 'bug',
      severity: 'moderate',
      priority: 'medium',
    },
  },
};

// ============================================================
// Gallery
// ============================================================

export const Features: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
      <h3>SectionEditModal Features</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4><span role="img" aria-label="note">📝</span> Dynamic Fields</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Define form fields via FieldDefinition array.</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4><span role="img" aria-label="checkmark">✅</span> Validation</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>HTML5 + custom validation with error messages.</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4><span role="img" aria-label="broom">🧹</span> Clear Form</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Optional clear button with confirmation.</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4><span role="img" aria-label="save">💾</span> Dirty Tracking</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Unsaved changes detection.</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'SectionEditModal key features overview.',
      },
    },
  },
};
