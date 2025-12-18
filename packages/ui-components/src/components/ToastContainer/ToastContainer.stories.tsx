/*
 * ================================================================
 * FILE: ToastContainer.stories.tsx
 * PATH: /packages/ui-components/src/components/ToastContainer/ToastContainer.stories.tsx
 * DESCRIPTION: Storybook stories for ToastContainer component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ToastContainer } from './ToastContainer';
import { Button } from '../Button';
import { useToast } from '@l-kern/config';

const meta: Meta<typeof ToastContainer> = {
  title: 'Components/Feedback/ToastContainer',
  component: ToastContainer,
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'],
      description: 'Position of the toast container',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Container for rendering toast notifications. Must be used within ToastProvider. Supports 6 different positions.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ToastContainer>;

// ============================================================
// Interactive Examples with useToast Hook
// ============================================================

const InteractiveDemo = ({ position }: { position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' }) => {
  const { showToast } = useToast();

  return (
    <div style={{ padding: '20px', minHeight: '400px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <Button
          variant="success"
          onClick={() => showToast('Operation completed successfully!', 'success', { position })}
        >
          Show Success
        </Button>
        <Button
          variant="danger"
          onClick={() => showToast('An error occurred. Please try again.', 'error', { position })}
        >
          Show Error
        </Button>
        <Button
          variant="secondary"
          onClick={() => showToast('Warning: This action cannot be undone.', 'warning', { position })}
        >
          Show Warning
        </Button>
        <Button
          variant="secondary"
          onClick={() => showToast('New updates are available.', 'info', { position })}
        >
          Show Info
        </Button>
        <Button
          variant="primary"
          onClick={() => showToast('Copied to clipboard!', 'success', { copiedContent: 'user@example.com', position })}
        >
          Copy Email
        </Button>
      </div>
      <ToastContainer position={position} />
    </div>
  );
};

// ============================================================
// Position Examples
// ============================================================

export const TopLeft: Story = {
  render: () => <InteractiveDemo position="top-left" />,
  parameters: {
    docs: {
      description: {
        story: 'Toasts appear in the top-left corner.',
      },
    },
  },
};

export const TopCenter: Story = {
  render: () => <InteractiveDemo position="top-center" />,
  parameters: {
    docs: {
      description: {
        story: 'Toasts appear at the top center.',
      },
    },
  },
};

export const TopRight: Story = {
  render: () => <InteractiveDemo position="top-right" />,
  parameters: {
    docs: {
      description: {
        story: 'Toasts appear in the top-right corner.',
      },
    },
  },
};

export const BottomLeft: Story = {
  render: () => <InteractiveDemo position="bottom-left" />,
  parameters: {
    docs: {
      description: {
        story: 'Toasts appear in the bottom-left corner.',
      },
    },
  },
};

export const BottomCenter: Story = {
  render: () => <InteractiveDemo position="bottom-center" />,
  parameters: {
    docs: {
      description: {
        story: 'Toasts appear at the bottom center (default position).',
      },
    },
  },
};

export const BottomRight: Story = {
  render: () => <InteractiveDemo position="bottom-right" />,
  parameters: {
    docs: {
      description: {
        story: 'Toasts appear in the bottom-right corner.',
      },
    },
  },
};

// ============================================================
// Multiple Toasts Demo
// ============================================================

const MultipleToastsDemo = () => {
  const { showToast } = useToast();

  const showMultiple = () => {
    showToast('First notification', 'info', { duration: 5000 });
    setTimeout(() => showToast('Second notification', 'success', { duration: 5000 }), 500);
    setTimeout(() => showToast('Third notification', 'warning', { duration: 5000 }), 1000);
    setTimeout(() => showToast('Fourth notification', 'error', { duration: 5000 }), 1500);
  };

  return (
    <div style={{ padding: '20px', minHeight: '400px' }}>
      <Button variant="primary" onClick={showMultiple}>
        Show Multiple Toasts
      </Button>
      <ToastContainer position="bottom-center" />
    </div>
  );
};

export const MultipleToasts: Story = {
  render: () => <MultipleToastsDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Multiple toasts stacked in the container. Toasts appear with slight delays.',
      },
    },
  },
};

// ============================================================
// Real-World Example
// ============================================================

const RealWorldDemo = () => {
  const { showToast } = useToast();

  const handleSave = () => {
    // Simulate API call
    setTimeout(() => {
      showToast('Contact saved successfully!', 'success', { duration: 3000 });
    }, 500);
  };

  const handleDelete = () => {
    showToast('Contact deleted', 'error', { duration: 3000 });
  };

  const handleCopy = () => {
    showToast('Copied to clipboard!', 'success', {
      copiedContent: 'john.doe@example.com',
      duration: 2000,
    });
  };

  return (
    <div style={{ padding: '20px', minHeight: '400px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '12px' }}>Contact Actions</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="primary" onClick={handleSave}>
            Save Contact
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Contact
          </Button>
          <Button variant="secondary" onClick={handleCopy}>
            Copy Email
          </Button>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export const RealWorldExample: Story = {
  render: () => <RealWorldDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example with save, delete, and copy actions.',
      },
    },
  },
};
