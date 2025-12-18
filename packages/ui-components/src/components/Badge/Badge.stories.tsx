/*
 * ================================================================
 * FILE: Badge.stories.tsx
 * PATH: /packages/ui-components/src/components/Badge/Badge.stories.tsx
 * DESCRIPTION: Storybook stories for Badge component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Feedback/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info', 'neutral'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Badge size',
    },
    dot: {
      control: 'boolean',
      description: 'Show colored dot indicator',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Badge component for status indicators and labels with multiple variants and sizes.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

// ============================================================
// Basic Variants
// ============================================================

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'Error',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Info',
  },
};

export const Neutral: Story = {
  args: {
    variant: 'neutral',
    children: 'Neutral',
  },
};

// ============================================================
// Sizes
// ============================================================

export const SizeSmall: Story = {
  args: {
    variant: 'success',
    size: 'small',
    children: 'Small',
  },
};

export const SizeMedium: Story = {
  args: {
    variant: 'success',
    size: 'medium',
    children: 'Medium',
  },
};

export const SizeLarge: Story = {
  args: {
    variant: 'success',
    size: 'large',
    children: 'Large',
  },
};

// ============================================================
// With Dot Indicator
// ============================================================

export const WithDot: Story = {
  args: {
    variant: 'success',
    dot: true,
    children: 'Online',
  },
};

export const WithDotError: Story = {
  args: {
    variant: 'error',
    dot: true,
    children: 'Offline',
  },
};

export const WithDotWarning: Story = {
  args: {
    variant: 'warning',
    dot: true,
    children: 'Pending',
  },
};

// ============================================================
// Real-World Examples
// ============================================================

export const StatusBadges: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Badge variant="success" dot>Active</Badge>
      <Badge variant="warning" dot>Pending</Badge>
      <Badge variant="error" dot>Inactive</Badge>
      <Badge variant="info" dot>Processing</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common status badges with dot indicators.',
      },
    },
  },
};

export const CountBadges: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Badge variant="error" size="small">3</Badge>
      <Badge variant="warning" size="small">12</Badge>
      <Badge variant="info" size="small">99+</Badge>
      <Badge variant="success" size="small">New</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Count badges for notifications.',
      },
    },
  },
};

// ============================================================
// Gallery Views
// ============================================================

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="neutral">Neutral</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available badge variants side by side.',
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Badge variant="info" size="small">Small</Badge>
      <Badge variant="info" size="medium">Medium</Badge>
      <Badge variant="info" size="large">Large</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available badge sizes.',
      },
    },
  },
};
