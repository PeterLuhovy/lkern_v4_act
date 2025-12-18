/*
 * ================================================================
 * FILE: Input.stories.tsx
 * PATH: /packages/ui-components/src/components/Input/Input.stories.tsx
 * DESCRIPTION: Storybook stories for Input component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Forms/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: 'Input type',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Make input full width of container',
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
  },
  parameters: {
    docs: {
      description: {
        component: 'Simplified input component - styling only, no validation. For form fields with labels and validation, wrap in FormField component.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// ============================================================
// Basic Variants
// ============================================================

export const Default: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'user@example.com',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: '0',
  },
};

export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
  },
};

// ============================================================
// States
// ============================================================

export const WithError: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
    hasError: true,
  },
};

export const Valid: Story = {
  args: {
    type: 'email',
    placeholder: 'user@example.com',
    isValid: true,
    defaultValue: 'user@example.com',
  },
};

export const Disabled: Story = {
  args: {
    type: 'text',
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const FullWidth: Story = {
  args: {
    type: 'text',
    placeholder: 'Full width input',
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

export const WithValue: Story = {
  args: {
    type: 'text',
    defaultValue: 'Pre-filled value',
  },
};

// ============================================================
// Gallery Views
// ============================================================

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
      <Input type="text" placeholder="Text input" />
      <Input type="email" placeholder="Email input" />
      <Input type="password" placeholder="Password input" />
      <Input type="number" placeholder="Number input" />
      <Input type="tel" placeholder="Phone input" />
      <Input type="url" placeholder="URL input" />
      <Input type="search" placeholder="Search input" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available input types.',
      },
    },
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
      <Input type="text" placeholder="Default state" />
      <Input type="text" placeholder="Error state" hasError />
      <Input type="text" placeholder="Valid state" isValid defaultValue="valid@example.com" />
      <Input type="text" placeholder="Disabled state" disabled />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available input states.',
      },
    },
  },
};
