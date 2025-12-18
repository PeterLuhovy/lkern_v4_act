/*
 * ================================================================
 * FILE: ConfirmModal.stories.tsx
 * PATH: /packages/ui-components/src/components/ConfirmModal/ConfirmModal.stories.tsx
 * DESCRIPTION: Storybook stories for ConfirmModal component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ConfirmModal } from './ConfirmModal';

const meta: Meta<typeof ConfirmModal> = {
  title: 'Components/Modals/ConfirmModal',
  component: ConfirmModal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls modal visibility',
    },
    isDanger: {
      control: 'boolean',
      description: 'Danger mode (red button, keyword input)',
    },
    confirmKeyword: {
      control: 'text',
      description: 'Keyword required for danger confirmation',
    },
    isLoading: {
      control: 'boolean',
      description: 'Loading state for confirm button',
    },
    isSecondaryLoading: {
      control: 'boolean',
      description: 'Loading state for secondary button',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Universal confirmation modal with simple and danger modes. Danger mode requires typing a keyword to confirm.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmModal>;

// ============================================================
// Simple Mode
// ============================================================

export const SimpleConfirm: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onConfirm: () => console.log('Confirmed'),
    title: 'Potvrdiť akciu',
    message: 'Naozaj chcete pokračovať?',
  },
};

export const SimpleWithCustomButtons: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onConfirm: () => console.log('Confirmed'),
    title: 'Potvrdiť uloženie',
    message: 'Chcete uložiť zmeny?',
    confirmButtonLabel: 'Áno, uložiť',
    cancelButtonLabel: 'Nie, zrušiť',
  },
};

export const SimpleLoading: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onConfirm: () => console.log('Confirmed'),
    title: 'Ukladám zmeny...',
    message: 'Počkajte prosím.',
    isLoading: true,
  },
};

// ============================================================
// Danger Mode
// ============================================================

export const DangerConfirm: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onConfirm: () => console.log('Confirmed delete'),
    title: 'Vymazať kontakt',
    message: 'Táto akcia je nevratná. Zadajte "ano" pre potvrdenie.',
    confirmKeyword: 'ano',
    isDanger: true,
  },
};

export const DangerWithCustomKeyword: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onConfirm: () => console.log('Confirmed delete'),
    title: 'Vymazať všetky dáta',
    message: 'VAROVÁNÍ! Táto akcia vymaže všetky dáta a je nezvratná. Zadajte "DELETE" pre potvrdenie.',
    confirmKeyword: 'DELETE',
    isDanger: true,
    confirmButtonLabel: 'Vymazať všetko',
  },
};

export const DangerLoading: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onConfirm: () => console.log('Confirmed delete'),
    title: 'Mažem dáta...',
    message: 'Prosím počkajte, prebieha mazanie.',
    confirmKeyword: 'ano',
    isDanger: true,
    isLoading: true,
  },
};

// ============================================================
// With Secondary Action
// ============================================================

export const WithSecondaryButton: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onConfirm: () => console.log('Confirmed'),
    onSecondary: () => console.log('Secondary action'),
    title: 'Chyba pri ukladaní',
    message: 'Nepodarilo sa uložiť zmeny. Chcete to skúsiť znova?',
    confirmButtonLabel: 'Pokračovať',
    secondaryButtonLabel: 'Skúsiť znova',
    cancelButtonLabel: 'Zrušiť',
  },
};

export const WithSecondaryLoading: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onConfirm: () => console.log('Confirmed'),
    onSecondary: () => console.log('Secondary action'),
    title: 'Opakujem pokus...',
    message: 'Skúšam znova uložiť zmeny.',
    confirmButtonLabel: 'Pokračovať',
    secondaryButtonLabel: 'Skúsiť znova',
    isSecondaryLoading: true,
  },
};

// ============================================================
// Real World Examples
// ============================================================

export const UnsavedChanges: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onConfirm: () => console.log('Discarded changes'),
    title: 'Neuložené zmeny',
    message: 'Máte neuložené zmeny. Naozaj chcete zatvoriť okno?',
    confirmButtonLabel: 'Zahodiť zmeny',
    cancelButtonLabel: 'Pokračovať v úprave',
  },
};

export const DeleteContact: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onConfirm: () => console.log('Deleted contact'),
    title: 'Vymazať kontakt',
    message: 'Naozaj chcete vymazať kontakt "Ján Novák"? Túto akciu nie je možné vrátiť späť. Zadajte "ano" pre potvrdenie.',
    confirmKeyword: 'ano',
    isDanger: true,
    confirmButtonLabel: 'Vymazať',
  },
};

export const ClearForm: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onConfirm: () => console.log('Cleared form'),
    title: 'Vyčistiť formulár',
    message: 'Naozaj chcete vyčistiť všetky polia formulára?',
    confirmButtonLabel: 'Vyčistiť',
    cancelButtonLabel: 'Zrušiť',
  },
};

// ============================================================
// Gallery
// ============================================================

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
      <p style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
        Note: In Storybook, only one modal can be shown at a time. Click through the examples above to see different variants.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4>Simple Mode</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Basic confirmation with Yes/Cancel buttons.</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4>Danger Mode</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Requires typing keyword to confirm. Red button.</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4>With Secondary Button</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Three buttons: Cancel / Retry / Proceed.</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4>Loading State</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Shows spinner while processing.</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available ConfirmModal variants.',
      },
    },
  },
};
