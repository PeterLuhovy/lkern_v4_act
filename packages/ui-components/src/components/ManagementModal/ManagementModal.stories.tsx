/*
 * ================================================================
 * FILE: ManagementModal.stories.tsx
 * PATH: /packages/ui-components/src/components/ManagementModal/ManagementModal.stories.tsx
 * DESCRIPTION: Storybook stories for ManagementModal component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ManagementModal } from './ManagementModal';
import { Button } from '../Button';

const meta: Meta<typeof ManagementModal> = {
  title: 'Components/Modals/ManagementModal',
  component: ManagementModal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls modal visibility',
    },
    hasUnsavedChanges: {
      control: 'boolean',
      description: 'Has unsaved changes',
    },
    enablePrimary: {
      control: 'boolean',
      description: 'Enable primary item support',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Generic list management modal with add/edit/delete all functionality. Supports primary item marking and empty states.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ManagementModal>;

// Sample data for stories
const samplePhones = [
  { id: 1, number: '+421 900 123 456', type: 'Mobil' },
  { id: 2, number: '+421 2 1234 5678', type: 'Pracovný' },
  { id: 3, number: '+421 900 999 888', type: 'Domov' },
];

const sampleEmails = [
  { id: 1, email: 'jan.novak@example.com', type: 'Pracovný' },
  { id: 2, email: 'jan.personal@gmail.com', type: 'Osobný' },
];

// ============================================================
// Basic Examples
// ============================================================

export const ManagePhones: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: () => console.log('Changes saved'),
    onAdd: () => console.log('Add clicked'),
    onDeleteAll: () => console.log('Delete all clicked'),
    title: 'Správa telefónov',
    modalId: 'manage-phones',
    items: samplePhones,
    emptyStateMessage: 'Žiadne telefónne čísla',
    emptyStateIcon: <span role="img" aria-label="mobile phone">📱</span>,
    renderItem: (item, { onEdit, onDelete, editHint, deleteHint }) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500 }}>{item.number}</div>
          <div style={{ fontSize: '14px', color: '#666' }}>{item.type}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button size="xs" variant="ghost" onClick={() => onEdit(item.id)} title={editHint}>
            <span role="img" aria-label="edit">✏️</span>
          </Button>
          <Button size="xs" variant="danger-subtle" onClick={() => onDelete(item.id)} title={deleteHint}>
            <span role="img" aria-label="trash">🗑️</span>
          </Button>
        </div>
      </div>
    ),
  },
};

export const ManageEmails: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: () => console.log('Changes saved'),
    onAdd: () => console.log('Add clicked'),
    onDeleteAll: () => console.log('Delete all clicked'),
    title: 'Správa emailov',
    modalId: 'manage-emails',
    items: sampleEmails,
    emptyStateMessage: 'Žiadne emailové adresy',
    emptyStateIcon: <span role="img" aria-label="email">📧</span>,
    renderItem: (item, { onEdit, onDelete, editHint, deleteHint }) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500 }}>{item.email}</div>
          <div style={{ fontSize: '14px', color: '#666' }}>{item.type}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button size="xs" variant="ghost" onClick={() => onEdit(item.id)} title={editHint}>
            <span role="img" aria-label="edit">✏️</span>
          </Button>
          <Button size="xs" variant="danger-subtle" onClick={() => onDelete(item.id)} title={deleteHint}>
            <span role="img" aria-label="trash">🗑️</span>
          </Button>
        </div>
      </div>
    ),
  },
};

// ============================================================
// With Primary Support
// ============================================================

export const WithPrimaryItem: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: () => console.log('Changes saved'),
    onAdd: () => console.log('Add clicked'),
    onDeleteAll: () => console.log('Delete all clicked'),
    onSetPrimary: (id) => console.log('Set primary:', id),
    title: 'Správa emailov (s primárnym)',
    modalId: 'manage-emails-primary',
    items: sampleEmails,
    enablePrimary: true,
    primaryItemId: 1,
    emptyStateMessage: 'Žiadne emailové adresy',
    emptyStateIcon: <span role="img" aria-label="email">📧</span>,
    renderItem: (item, { onEdit, onDelete, onSetPrimary, isPrimary, editHint, deleteHint, primaryHint }) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {item.email}
            {isPrimary && <span style={{ fontSize: '12px' }}><span role="img" aria-label="star">⭐</span> Primárny</span>}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>{item.type}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {onSetPrimary && (
            <Button
              size="xs"
              variant="ghost"
              onClick={() => onSetPrimary(item.id)}
              title={primaryHint}
            >
              {isPrimary ? <span role="img" aria-label="star">⭐</span> : <span role="img" aria-label="star outline">☆</span>}
            </Button>
          )}
          <Button size="xs" variant="ghost" onClick={() => onEdit(item.id)} title={editHint}>
            <span role="img" aria-label="edit">✏️</span>
          </Button>
          <Button size="xs" variant="danger-subtle" onClick={() => onDelete(item.id)} title={deleteHint}>
            <span role="img" aria-label="trash">🗑️</span>
          </Button>
        </div>
      </div>
    ),
  },
};

// ============================================================
// States
// ============================================================

export const EmptyState: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: () => console.log('Changes saved'),
    onAdd: () => console.log('Add clicked'),
    onDeleteAll: () => console.log('Delete all clicked'),
    title: 'Správa telefónov (prázdny)',
    modalId: 'manage-phones-empty',
    items: [],
    emptyStateMessage: 'Zatiaľ ste nepridali žiadne telefónne čísla',
    emptyStateIcon: <span role="img" aria-label="mobile phone">📱</span>,
    renderItem: () => null,
  },
};

export const WithUnsavedChanges: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: () => console.log('Changes saved'),
    onAdd: () => console.log('Add clicked'),
    onDeleteAll: () => console.log('Delete all clicked'),
    title: 'Správa emailov (neuložené zmeny)',
    modalId: 'manage-emails-dirty',
    items: sampleEmails,
    hasUnsavedChanges: true,
    emptyStateMessage: 'Žiadne emailové adresy',
    emptyStateIcon: <span role="img" aria-label="email">📧</span>,
    renderItem: (item, { onEdit, onDelete, editHint, deleteHint }) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500 }}>{item.email}</div>
          <div style={{ fontSize: '14px', color: '#666' }}>{item.type}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button size="xs" variant="ghost" onClick={() => onEdit(item.id)} title={editHint}>
            <span role="img" aria-label="edit">✏️</span>
          </Button>
          <Button size="xs" variant="danger-subtle" onClick={() => onDelete(item.id)} title={deleteHint}>
            <span role="img" aria-label="trash">🗑️</span>
          </Button>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Try closing the modal - you will see unsaved changes confirmation.',
      },
    },
  },
};

// ============================================================
// Custom Sizes
// ============================================================

export const CustomMaxWidth: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: () => console.log('Changes saved'),
    onAdd: () => console.log('Add clicked'),
    onDeleteAll: () => console.log('Delete all clicked'),
    title: 'Správa kontaktov (široký)',
    modalId: 'manage-contacts-wide',
    items: samplePhones,
    maxWidth: '900px',
    emptyStateMessage: 'Žiadne kontakty',
    emptyStateIcon: <span role="img" aria-label="user">👤</span>,
    renderItem: (item, { onEdit, onDelete, editHint, deleteHint }) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500 }}>{item.number}</div>
          <div style={{ fontSize: '14px', color: '#666' }}>{item.type}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button size="xs" variant="ghost" onClick={() => onEdit(item.id)} title={editHint}>
            <span role="img" aria-label="edit">✏️</span>
          </Button>
          <Button size="xs" variant="danger-subtle" onClick={() => onDelete(item.id)} title={deleteHint}>
            <span role="img" aria-label="trash">🗑️</span>
          </Button>
        </div>
      </div>
    ),
  },
};

// ============================================================
// Gallery
// ============================================================

export const Features: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
      <h3>ManagementModal Features</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4><span role="img" aria-label="sparkles">✨</span> List Management</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Add, edit, delete items with confirmation dialogs.</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4><span role="img" aria-label="star">⭐</span> Primary Item</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Mark one item as primary (e.g., default email).</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4><span role="img" aria-label="trash">🗑️</span> Delete All</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Clear all items with danger confirmation.</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4><span role="img" aria-label="open mailbox with lowered flag">📭</span> Empty State</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Custom icon and message when list is empty.</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'ManagementModal key features overview.',
      },
    },
  },
};
