/*
 * ================================================================
 * FILE: Button.stories.tsx
 * PATH: /packages/ui-components/src/components/Button/Button.stories.tsx
 * DESCRIPTION: Storybook stories for Button component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-12
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'danger-subtle', 'ghost', 'success'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['xs', 'small', 'medium', 'large'],
      description: 'Button size',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Full width button',
    },
    debug: {
      control: 'boolean',
      description: 'Debug styling (orange gradient)',
    },
    iconPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Icon position relative to text',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Reusable button component with multiple variants, sizes, and states.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ============================================================
// Basic Variants
// ============================================================

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Delete',
  },
};

export const DangerSubtle: Story = {
  args: {
    variant: 'danger-subtle',
    children: 'Cancel',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Confirm',
  },
};

// ============================================================
// Sizes
// ============================================================

export const SizeXS: Story = {
  args: {
    variant: 'primary',
    size: 'xs',
    children: 'Extra Small',
  },
};

export const SizeSmall: Story = {
  args: {
    variant: 'primary',
    size: 'small',
    children: 'Small',
  },
};

export const SizeMedium: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Medium',
  },
};

export const SizeLarge: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    children: 'Large',
  },
};

// ============================================================
// States
// ============================================================

export const Loading: Story = {
  args: {
    variant: 'primary',
    loading: true,
    children: 'Saving...',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled',
  },
};

export const FullWidth: Story = {
  args: {
    variant: 'primary',
    fullWidth: true,
    children: 'Full Width Button',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

// ============================================================
// With Icon
// ============================================================

export const WithIconLeft: Story = {
  args: {
    variant: 'primary',
    icon: '💾',
    iconPosition: 'left',
    children: 'Save',
  },
};

export const WithIconRight: Story = {
  args: {
    variant: 'secondary',
    icon: '→',
    iconPosition: 'right',
    children: 'Next',
  },
};

// ============================================================
// Gallery Views
// ============================================================

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="danger-subtle">Danger Subtle</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="success">Success</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available button variants side by side.',
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Button variant="primary" size="xs">XS</Button>
      <Button variant="primary" size="small">Small</Button>
      <Button variant="primary" size="medium">Medium</Button>
      <Button variant="primary" size="large">Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available button sizes.',
      },
    },
  },
};
