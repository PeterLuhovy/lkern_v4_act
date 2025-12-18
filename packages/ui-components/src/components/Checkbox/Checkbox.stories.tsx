/*
 * ================================================================
 * FILE: Checkbox.stories.tsx
 * PATH: /packages/ui-components/src/components/Checkbox/Checkbox.stories.tsx
 * DESCRIPTION: Storybook stories for Checkbox component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text displayed next to the checkbox',
    },
    error: {
      control: 'text',
      description: 'Error message to display (shows error state)',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display below the checkbox',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Indeterminate state (for "some but not all" selections)',
    },
    checked: {
      control: 'boolean',
      description: 'Checked state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'A customizable checkbox input with label, error states, and accessibility features. Supports indeterminate state for partial selections.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

// ============================================================
// Basic Variants
// ============================================================

export const Default: Story = {
  args: {
    label: 'I agree to the terms and conditions',
  },
};

export const Checked: Story = {
  args: {
    label: 'I agree to the terms and conditions',
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'I agree to the terms and conditions',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'I agree to the terms and conditions',
    disabled: true,
    checked: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Subscribe to newsletter',
    helperText: 'Receive updates about new features',
  },
};

export const WithError: Story = {
  args: {
    label: 'I agree to the terms and conditions',
    error: 'You must accept the terms to continue',
  },
};

export const Indeterminate: Story = {
  args: {
    label: 'Select all items',
    indeterminate: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Indeterminate state is used when some but not all items are selected (e.g., "Select All" with partial selection).',
      },
    },
  },
};

export const WithoutLabel: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Checkbox without label text (e.g., for table row selection).',
      },
    },
  },
};

// ============================================================
// Gallery Views
// ============================================================

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" checked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled checked" disabled checked />
      <Checkbox label="With error" error="This field is required" />
      <Checkbox label="With helper text" helperText="Optional helper information" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available checkbox states.',
      },
    },
  },
};

export const GroupExample: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Checkbox label="Select all" indeterminate />
      <div style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Checkbox label="Option 1" checked />
        <Checkbox label="Option 2" />
        <Checkbox label="Option 3" checked />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of checkbox group with "Select All" in indeterminate state.',
      },
    },
  },
};
