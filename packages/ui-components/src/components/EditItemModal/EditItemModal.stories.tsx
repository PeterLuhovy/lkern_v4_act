/*
 * ================================================================
 * FILE: EditItemModal.stories.tsx
 * PATH: /packages/ui-components/src/components/EditItemModal/EditItemModal.stories.tsx
 * DESCRIPTION: Storybook stories for EditItemModal component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EditItemModal } from './EditItemModal';
import { Input } from '../Input';
import { Select } from '../Select';
import { FormField } from '../FormField';

const meta: Meta<typeof EditItemModal> = {
  title: 'Components/Modals/EditItemModal',
  component: EditItemModal,
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
    saveDisabled: {
      control: 'boolean',
      description: 'Disable save button',
    },
    showClearButton: {
      control: 'boolean',
      description: 'Show clear button',
    },
    hasUnsavedChanges: {
      control: 'boolean',
      description: 'Has unsaved changes',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Generic add/edit modal wrapper with unsaved changes detection and optional clear button.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof EditItemModal>;

// ============================================================
// Basic Examples
// ============================================================

export const AddEmail: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: () => console.log('Email saved'),
    title: 'Pridať email',
    modalId: 'add-email',
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <FormField label="Email" required htmlFor="email">
          <Input type="email" id="email" placeholder="jan.novak@example.com" />
        </FormField>
        <FormField label="Typ" htmlFor="email-type">
          <Select
            id="email-type"
            options={[
              { value: 'personal', label: 'Osobný' },
              { value: 'work', label: 'Pracovný' },
              { value: 'other', label: 'Iný' },
            ]}
          />
        </FormField>
      </div>
    ),
  },
};

export const EditPhone: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: () => console.log('Phone saved'),
    title: 'Upraviť telefón',
    modalId: 'edit-phone',
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <FormField label="Číslo" required htmlFor="phone">
          <Input type="tel" id="phone" placeholder="+421 900 123 456" />
        </FormField>
        <FormField label="Typ" htmlFor="phone-type">
          <Select
            id="phone-type"
            options={[
              { value: 'mobile', label: 'Mobil' },
              { value: 'work', label: 'Pracovný' },
              { value: 'home', label: 'Domov' },
            ]}
          />
        </FormField>
      </div>
    ),
  },
};

// ============================================================
// With Clear Button
// ============================================================

export const WithClearButton: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: () => console.log('Address saved'),
    onClear: () => console.log('Form cleared'),
    title: 'Pridať adresu',
    modalId: 'add-address',
    showClearButton: true,
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <FormField label="Ulica" required htmlFor="street">
          <Input type="text" id="street" placeholder="Hlavná 123" />
        </FormField>
        <FormField label="Mesto" required htmlFor="city">
          <Input type="text" id="city" placeholder="Bratislava" />
        </FormField>
        <FormField label="PSČ" required htmlFor="zip">
          <Input type="text" id="zip" placeholder="811 01" />
        </FormField>
      </div>
    ),
  },
};

// ============================================================
// States
// ============================================================

export const WithUnsavedChanges: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: () => console.log('Data saved'),
    title: 'Upraviť údaje',
    modalId: 'edit-data',
    hasUnsavedChanges: true,
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <FormField label="Meno" required htmlFor="name">
          <Input type="text" id="name" defaultValue="Ján Novák" />
        </FormField>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Try closing this modal - you will see unsaved changes confirmation.
        </p>
      </div>
    ),
  },
};

export const SaveDisabled: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: () => console.log('Data saved'),
    title: 'Neplatný formulár',
    modalId: 'invalid-form',
    saveDisabled: true,
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <FormField label="Email" required htmlFor="email" error="Neplatný email">
          <Input type="email" id="email" defaultValue="invalid-email" />
        </FormField>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Save button is disabled due to validation error.
        </p>
      </div>
    ),
  },
};

export const SmallSize: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: () => console.log('Note saved'),
    title: 'Pridať poznámku',
    modalId: 'add-note',
    size: 'sm',
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <FormField label="Poznámka" required htmlFor="note">
          <textarea
            id="note"
            rows={3}
            placeholder="Zadajte poznámku..."
            style={{ width: '100%', padding: '8px', fontFamily: 'inherit' }}
          />
        </FormField>
      </div>
    ),
  },
};

export const LargeSize: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: () => console.log('Details saved'),
    title: 'Upraviť podrobné informácie',
    modalId: 'edit-details',
    size: 'lg',
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <FormField label="Meno" required htmlFor="firstname">
            <Input type="text" id="firstname" placeholder="Ján" />
          </FormField>
          <FormField label="Priezvisko" required htmlFor="lastname">
            <Input type="text" id="lastname" placeholder="Novák" />
          </FormField>
          <FormField label="Email" required htmlFor="email-lg">
            <Input type="email" id="email-lg" placeholder="jan.novak@example.com" />
          </FormField>
          <FormField label="Telefón" htmlFor="phone-lg">
            <Input type="tel" id="phone-lg" placeholder="+421 900 123 456" />
          </FormField>
        </div>
      </div>
    ),
  },
};

// ============================================================
// Interactive Example
// ============================================================

export const InteractiveForm: Story = {
  render: () => {
    const [email, setEmail] = useState('');
    const [isDirty, setIsDirty] = useState(false);

    const handleEmailChange = (value: string) => {
      setEmail(value);
      setIsDirty(value !== '');
    };

    return (
      <EditItemModal
        isOpen={true}
        onClose={() => console.log('Modal closed')}
        onSave={() => console.log('Saved:', email)}
        onClear={() => {
          setEmail('');
          setIsDirty(false);
        }}
        title="Pridať kontakt (Interactive)"
        modalId="interactive-modal"
        saveDisabled={!email || !email.includes('@')}
        hasUnsavedChanges={isDirty}
        showClearButton={true}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormField
            label="Email"
            required
            htmlFor="interactive-email"
            error={email && !email.includes('@') ? 'Neplatný email' : undefined}
          >
            <Input
              type="email"
              id="interactive-email"
              placeholder="jan.novak@example.com"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
            />
          </FormField>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Type an email to enable the save button. Try closing to see unsaved changes warning.
          </p>
        </div>
      </EditItemModal>
    );
  },
};

// ============================================================
// Gallery
// ============================================================

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
      <p style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
        EditItemModal supports three sizes: sm (400px), md (600px), lg (800px).
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4>Small (sm)</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Best for simple forms with 1-2 fields.</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4>Medium (md)</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Default size for most forms.</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4>Large (lg)</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>For complex forms with many fields.</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'EditItemModal size comparison.',
      },
    },
  },
};
