/*
 * ================================================================
 * FILE: Radio.stories.tsx
 * PATH: /packages/ui-components/src/components/Radio/Radio.stories.tsx
 * DESCRIPTION: Storybook stories for Radio component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from './Radio';

const meta: Meta<typeof Radio> = {
  title: 'Components/Forms/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text displayed next to the radio button',
    },
    name: {
      control: 'text',
      description: 'Name attribute (groups radio buttons)',
    },
    value: {
      control: 'text',
      description: 'Value of the radio button',
    },
    checked: {
      control: 'boolean',
      description: 'Checked state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    error: {
      control: 'boolean',
      description: 'Error state (typically controlled by RadioGroup)',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'A customizable radio input with label and accessibility features. Typically used within a RadioGroup component for managing selection state.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

// ============================================================
// Basic Variants
// ============================================================

export const Default: Story = {
  args: {
    name: 'option',
    value: '1',
    label: 'Option 1',
  },
};

export const Checked: Story = {
  args: {
    name: 'option',
    value: '1',
    label: 'Option 1',
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    name: 'option',
    value: '1',
    label: 'Option 1',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    name: 'option',
    value: '1',
    label: 'Option 1',
    disabled: true,
    checked: true,
  },
};

export const WithError: Story = {
  args: {
    name: 'option',
    value: '1',
    label: 'Option 1',
    error: true,
  },
};

// ============================================================
// Gallery Views
// ============================================================

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Radio name="demo1" value="1" label="Unchecked" />
      <Radio name="demo2" value="1" label="Checked" checked />
      <Radio name="demo3" value="1" label="Disabled" disabled />
      <Radio name="demo4" value="1" label="Disabled checked" disabled checked />
      <Radio name="demo5" value="1" label="Error state" error />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available radio button states.',
      },
    },
  },
};

export const RadioGroup: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Choose payment method:</div>
      <Radio name="payment" value="card" label="Credit Card" checked />
      <Radio name="payment" value="paypal" label="PayPal" />
      <Radio name="payment" value="bank" label="Bank Transfer" />
      <Radio name="payment" value="cash" label="Cash on Delivery" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of radio buttons grouped together for single selection.',
      },
    },
  },
};

export const RadioGroupWithDisabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Choose shipping method:</div>
      <Radio name="shipping" value="standard" label="Standard (3-5 days)" checked />
      <Radio name="shipping" value="express" label="Express (1-2 days)" />
      <Radio name="shipping" value="overnight" label="Overnight (Currently unavailable)" disabled />
      <Radio name="shipping" value="pickup" label="Store Pickup" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Radio group with a disabled option.',
      },
    },
  },
};

export const RadioGroupWithError: Story = {
  render: () => (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Choose your subscription plan: *</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Radio name="plan" value="free" label="Free" error />
        <Radio name="plan" value="basic" label="Basic - $9/month" error />
        <Radio name="plan" value="pro" label="Pro - $29/month" error />
      </div>
      <div style={{ color: 'var(--color-status-error)', fontSize: '14px', marginTop: '8px' }}>
        ⚠ Please select a subscription plan
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Radio group in error state (typically controlled by RadioGroup wrapper).',
      },
    },
  },
};
