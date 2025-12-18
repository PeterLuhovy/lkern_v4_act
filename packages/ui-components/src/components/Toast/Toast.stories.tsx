/*
 * ================================================================
 * FILE: Toast.stories.tsx
 * PATH: /packages/ui-components/src/components/Toast/Toast.stories.tsx
 * DESCRIPTION: Storybook stories for Toast component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';
import type { Toast as ToastType } from '@l-kern/config';

const meta: Meta<typeof Toast> = {
  title: 'Components/Feedback/Toast',
  component: Toast,
  tags: ['autodocs'],
  argTypes: {
    toast: {
      control: 'object',
      description: 'Toast object with type, message, and optional copiedContent',
    },
    onClose: {
      action: 'closed',
      description: 'Callback when toast is closed',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Toast notification component for displaying temporary messages with different types (success, error, warning, info).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

// ============================================================
// Basic Types
// ============================================================

export const Success: Story = {
  args: {
    toast: {
      id: '1',
      type: 'success',
      message: 'Operation completed successfully!',
      duration: 5000,
    } as ToastType,
  },
};

export const Error: Story = {
  args: {
    toast: {
      id: '2',
      type: 'error',
      message: 'An error occurred. Please try again.',
      duration: 5000,
    } as ToastType,
  },
};

export const Warning: Story = {
  args: {
    toast: {
      id: '3',
      type: 'warning',
      message: 'Warning: This action cannot be undone.',
      duration: 5000,
    } as ToastType,
  },
};

export const Info: Story = {
  args: {
    toast: {
      id: '4',
      type: 'info',
      message: 'New updates are available.',
      duration: 5000,
    } as ToastType,
  },
};

// ============================================================
// With Copied Content
// ============================================================

export const WithCopiedContent: Story = {
  args: {
    toast: {
      id: '5',
      type: 'success',
      message: 'Copied to clipboard!',
      copiedContent: 'user@example.com',
      duration: 3000,
    } as ToastType,
  },
  parameters: {
    docs: {
      description: {
        story: 'Toast with copied content displayed below the main message.',
      },
    },
  },
};

export const LongCopiedContent: Story = {
  args: {
    toast: {
      id: '6',
      type: 'success',
      message: 'API key copied!',
      copiedContent: 'sk_test_51234567890abcdefghijklmnopqrstuvwxyz',
      duration: 3000,
    } as ToastType,
  },
  parameters: {
    docs: {
      description: {
        story: 'Toast with long copied content.',
      },
    },
  },
};

// ============================================================
// Real-World Examples
// ============================================================

export const SaveSuccess: Story = {
  args: {
    toast: {
      id: '7',
      type: 'success',
      message: 'Contact saved successfully!',
      duration: 3000,
    } as ToastType,
  },
};

export const DeleteError: Story = {
  args: {
    toast: {
      id: '8',
      type: 'error',
      message: 'Failed to delete contact. Please check your connection.',
      duration: 5000,
    } as ToastType,
  },
};

export const FormValidationWarning: Story = {
  args: {
    toast: {
      id: '9',
      type: 'warning',
      message: 'Please fill in all required fields before submitting.',
      duration: 4000,
    } as ToastType,
  },
};

export const NetworkInfo: Story = {
  args: {
    toast: {
      id: '10',
      type: 'info',
      message: 'You are currently offline. Changes will sync when reconnected.',
      duration: 6000,
    } as ToastType,
  },
};

// ============================================================
// Gallery Views
// ============================================================

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '400px' }}>
      <Toast
        toast={{
          id: 'success',
          type: 'success',
          message: 'Operation completed successfully!',
          duration: 5000,
        } as ToastType}
      />
      <Toast
        toast={{
          id: 'error',
          type: 'error',
          message: 'An error occurred. Please try again.',
          duration: 5000,
        } as ToastType}
      />
      <Toast
        toast={{
          id: 'warning',
          type: 'warning',
          message: 'Warning: This action cannot be undone.',
          duration: 5000,
        } as ToastType}
      />
      <Toast
        toast={{
          id: 'info',
          type: 'info',
          message: 'New updates are available.',
          duration: 5000,
        } as ToastType}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available toast types stacked.',
      },
    },
  },
};

export const WithAndWithoutClose: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '400px' }}>
      <Toast
        toast={{
          id: 'with-close',
          type: 'success',
          message: 'Toast with close button',
          duration: 5000,
        } as ToastType}
        onClose={(id) => console.log('Closed:', id)}
      />
      <Toast
        toast={{
          id: 'without-close',
          type: 'info',
          message: 'Toast without close button (no onClose prop)',
          duration: 5000,
        } as ToastType}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Toast with and without close button (controlled by onClose prop).',
      },
    },
  },
};
