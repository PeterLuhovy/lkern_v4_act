/*
 * ================================================================
 * FILE: Select.stories.tsx
 * PATH: /packages/ui-components/src/components/Select/Select.stories.tsx
 * DESCRIPTION: Storybook stories for Select component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Components/Forms/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    options: {
      description: 'Array of select options',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text (creates empty first option)',
    },
    error: {
      control: 'text',
      description: 'Error message to display below select',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display below select (when no error)',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Make select full width of container',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Native select dropdown with error state, helper text, and design token integration. Supports all standard HTML select attributes.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

// Sample data
const countryOptions = [
  { value: 'sk', label: 'Slovakia' },
  { value: 'cz', label: 'Czech Republic' },
  { value: 'pl', label: 'Poland' },
  { value: 'hu', label: 'Hungary' },
  { value: 'at', label: 'Austria' },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
  { value: 'archived', label: 'Archived' },
];

const priorityOptions = [
  { value: '1', label: 'Low' },
  { value: '2', label: 'Medium' },
  { value: '3', label: 'High' },
  { value: '4', label: 'Critical' },
];

// ============================================================
// Basic Variants
// ============================================================

export const Default: Story = {
  args: {
    options: countryOptions,
    placeholder: 'Choose country',
  },
};

export const WithHelperText: Story = {
  args: {
    options: countryOptions,
    placeholder: 'Choose country',
    helperText: 'Select your country of residence',
  },
};

export const WithError: Story = {
  args: {
    options: countryOptions,
    placeholder: 'Choose country',
    error: 'Country is required',
  },
};

export const FullWidth: Story = {
  args: {
    options: statusOptions,
    placeholder: 'Choose status',
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

export const Disabled: Story = {
  args: {
    options: countryOptions,
    placeholder: 'Choose country',
    disabled: true,
  },
};

export const WithDisabledOption: Story = {
  args: {
    options: [
      { value: 'sk', label: 'Slovakia' },
      { value: 'cz', label: 'Czech Republic', disabled: true },
      { value: 'pl', label: 'Poland' },
    ],
    placeholder: 'Choose country',
  },
};

export const WithSelectedValue: Story = {
  args: {
    options: priorityOptions,
    placeholder: 'Choose priority',
    defaultValue: '3',
  },
};

// ============================================================
// Gallery Views
// ============================================================

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <Select
        options={countryOptions}
        placeholder="Default state"
      />
      <Select
        options={countryOptions}
        placeholder="With helper text"
        helperText="Select your country"
      />
      <Select
        options={countryOptions}
        placeholder="Error state"
        error="Country is required"
      />
      <Select
        options={countryOptions}
        placeholder="Disabled state"
        disabled
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available select states.',
      },
    },
  },
};

export const DifferentOptionSets: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <Select
        options={countryOptions}
        placeholder="Countries"
        helperText="Country selection"
      />
      <Select
        options={statusOptions}
        placeholder="Status"
        helperText="Current status"
      />
      <Select
        options={priorityOptions}
        placeholder="Priority"
        helperText="Task priority"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Select components with different option sets.',
      },
    },
  },
};
