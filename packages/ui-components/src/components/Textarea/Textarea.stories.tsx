/*
 * ================================================================
 * FILE: Textarea.stories.tsx
 * PATH: /packages/ui-components/src/components/Textarea/Textarea.stories.tsx
 * DESCRIPTION: Storybook stories for Textarea component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Forms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    rows: {
      control: 'number',
      description: 'Number of visible text lines',
    },
    cols: {
      control: 'number',
      description: 'Visible width of the textarea',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Make textarea full width of container',
    },
    hasError: {
      control: 'boolean',
      description: 'Apply error styling (red border)',
    },
    isValid: {
      control: 'boolean',
      description: 'Apply success styling (green border)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    maxLength: {
      control: 'number',
      description: 'Maximum character length',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Styled multi-line text input without validation logic. For form fields with labels and validation, wrap in FormField component.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

// ============================================================
// Basic Variants
// ============================================================

export const Default: Story = {
  args: {
    placeholder: 'Enter description...',
    rows: 4,
  },
};

export const SmallSize: Story = {
  args: {
    placeholder: 'Short comment...',
    rows: 2,
  },
};

export const LargeSize: Story = {
  args: {
    placeholder: 'Detailed description...',
    rows: 8,
  },
};

export const FullWidth: Story = {
  args: {
    placeholder: 'Full width textarea',
    rows: 4,
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
};

// ============================================================
// States
// ============================================================

export const WithError: Story = {
  args: {
    placeholder: 'Enter description...',
    rows: 4,
    hasError: true,
  },
};

export const Valid: Story = {
  args: {
    placeholder: 'Enter description...',
    rows: 4,
    isValid: true,
    defaultValue: 'This is a valid description that meets all requirements.',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled textarea',
    rows: 4,
    disabled: true,
  },
};

export const WithValue: Story = {
  args: {
    rows: 4,
    defaultValue: 'This is a pre-filled value.\nIt supports multiple lines.\nYou can edit this text.',
  },
};

export const WithMaxLength: Story = {
  args: {
    placeholder: 'Enter comment (max 200 characters)...',
    rows: 4,
    maxLength: 200,
  },
};

// ============================================================
// Gallery Views
// ============================================================

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}>
      <Textarea placeholder="2 rows" rows={2} />
      <Textarea placeholder="4 rows (default)" rows={4} />
      <Textarea placeholder="6 rows" rows={6} />
      <Textarea placeholder="8 rows" rows={8} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Textareas with different row counts.',
      },
    },
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}>
      <Textarea placeholder="Default state" rows={3} />
      <Textarea placeholder="Error state" rows={3} hasError />
      <Textarea
        placeholder="Valid state"
        rows={3}
        isValid
        defaultValue="This is a valid description."
      />
      <Textarea placeholder="Disabled state" rows={3} disabled />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available textarea states.',
      },
    },
  },
};

export const UseCases: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Short comment</div>
        <Textarea placeholder="Add a quick note..." rows={2} />
      </div>
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Standard description</div>
        <Textarea placeholder="Enter description..." rows={4} />
      </div>
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Long content (with character limit)</div>
        <Textarea
          placeholder="Enter detailed content (max 500 characters)..."
          rows={6}
          maxLength={500}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common use cases for textarea component.',
      },
    },
  },
};
