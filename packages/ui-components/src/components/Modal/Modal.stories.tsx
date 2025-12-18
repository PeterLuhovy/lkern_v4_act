/*
 * ================================================================
 * FILE: Modal.stories.tsx
 * PATH: /packages/ui-components/src/components/Modal/Modal.stories.tsx
 * DESCRIPTION: Storybook stories for Modal component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from '../Button';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modals/Modal',
  component: Modal,
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
    alignment: {
      control: 'select',
      options: ['top', 'center', 'bottom'],
      description: 'Vertical alignment',
    },
    closeOnBackdropClick: {
      control: 'boolean',
      description: 'Close on backdrop click',
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Show X close button',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
    disableDrag: {
      control: 'boolean',
      description: 'Disable drag',
    },
    hasUnsavedChanges: {
      control: 'boolean',
      description: 'Has unsaved changes',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Production modal component with drag & drop, nested modals, and pessimistic locking support.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

// ============================================================
// Basic Modal
// ============================================================

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'default-modal',
    title: 'Default Modal',
    children: (
      <div style={{ padding: '20px' }}>
        <p>This is a default modal with basic content.</p>
      </div>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'footer-modal',
    title: 'Modal with Footer',
    children: (
      <div style={{ padding: '20px' }}>
        <p>This modal has a footer with action buttons.</p>
      </div>
    ),
    footer: (
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Save</Button>
      </div>
    ),
  },
};

export const WithEnhancedFooter: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'enhanced-footer-modal',
    title: 'Enhanced Footer',
    children: (
      <div style={{ padding: '20px' }}>
        <p>This modal uses enhanced footer with left/right slots.</p>
      </div>
    ),
    footer: {
      left: <Button variant="danger">Delete</Button>,
      right: (
        <>
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Save</Button>
        </>
      ),
    },
  },
};

// ============================================================
// Sizes
// ============================================================

export const SizeSmall: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'small-modal',
    title: 'Small Modal (400px)',
    size: 'sm',
    children: (
      <div style={{ padding: '20px' }}>
        <p>This is a small modal (400px width).</p>
      </div>
    ),
  },
};

export const SizeMedium: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'medium-modal',
    title: 'Medium Modal (600px)',
    size: 'md',
    children: (
      <div style={{ padding: '20px' }}>
        <p>This is a medium modal (600px width).</p>
      </div>
    ),
  },
};

export const SizeLarge: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'large-modal',
    title: 'Large Modal (800px)',
    size: 'lg',
    children: (
      <div style={{ padding: '20px' }}>
        <p>This is a large modal (800px width).</p>
      </div>
    ),
  },
};

// ============================================================
// Alignment
// ============================================================

export const AlignmentTop: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'top-modal',
    title: 'Top Aligned',
    alignment: 'top',
    children: (
      <div style={{ padding: '20px' }}>
        <p>This modal is aligned to the top.</p>
      </div>
    ),
  },
};

export const AlignmentCenter: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'center-modal',
    title: 'Center Aligned',
    alignment: 'center',
    children: (
      <div style={{ padding: '20px' }}>
        <p>This modal is aligned to the center (default).</p>
      </div>
    ),
  },
};

export const AlignmentBottom: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'bottom-modal',
    title: 'Bottom Aligned',
    alignment: 'bottom',
    children: (
      <div style={{ padding: '20px' }}>
        <p>This modal is aligned to the bottom.</p>
      </div>
    ),
  },
};

// ============================================================
// States
// ============================================================

export const Loading: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'loading-modal',
    title: 'Loading Modal',
    loading: true,
  },
};

export const WithUnsavedChanges: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'unsaved-modal',
    title: 'Unsaved Changes',
    hasUnsavedChanges: true,
    children: (
      <div style={{ padding: '20px' }}>
        <p>Try closing this modal with ESC or X button.</p>
        <p>You will see an unsaved changes confirmation.</p>
      </div>
    ),
  },
};

export const NoCloseButton: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'no-close-modal',
    title: 'No Close Button',
    showCloseButton: false,
    children: (
      <div style={{ padding: '20px' }}>
        <p>This modal has no X close button.</p>
      </div>
    ),
  },
};

export const CloseOnBackdropClick: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'backdrop-close-modal',
    title: 'Close on Backdrop Click',
    closeOnBackdropClick: true,
    children: (
      <div style={{ padding: '20px' }}>
        <p>Click outside the modal to close it.</p>
      </div>
    ),
  },
};

// ============================================================
// Features
// ============================================================

export const Draggable: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'draggable-modal',
    title: 'Draggable Modal - Grab and Drag the Header',
    children: (
      <div style={{ padding: '20px' }}>
        <p>Click and drag the header to move this modal around.</p>
        <p>The cursor changes to a hand when hovering over the header.</p>
      </div>
    ),
  },
};

export const DragDisabled: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'no-drag-modal',
    title: 'Drag Disabled',
    disableDrag: true,
    children: (
      <div style={{ padding: '20px' }}>
        <p>This modal cannot be dragged.</p>
      </div>
    ),
  },
};

export const CustomMaxWidth: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'custom-width-modal',
    title: 'Custom Max Width (1000px)',
    maxWidth: '1000px',
    children: (
      <div style={{ padding: '20px' }}>
        <p>This modal has a custom max width of 1000px.</p>
      </div>
    ),
  },
};

// ============================================================
// Gallery
// ============================================================

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <p style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
        Note: In Storybook, only one modal can be shown at a time. Click through the size examples above.
      </p>
      <Modal
        isOpen={true}
        onClose={() => console.log('Modal closed')}
        modalId="gallery-sm"
        title="Small (400px)"
        size="sm"
      >
        <div style={{ padding: '20px' }}>
          <p>Small modal content</p>
        </div>
      </Modal>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available modal sizes: sm (400px), md (600px), lg (800px).',
      },
    },
  },
};
