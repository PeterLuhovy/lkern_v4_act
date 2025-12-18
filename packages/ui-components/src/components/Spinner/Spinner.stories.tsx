/*
 * ================================================================
 * FILE: Spinner.stories.tsx
 * PATH: /packages/ui-components/src/components/Spinner/Spinner.stories.tsx
 * DESCRIPTION: Storybook stories for Spinner component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Spinner size',
    },
    label: {
      control: 'text',
      description: 'Optional label text below spinner',
    },
    color: {
      control: 'color',
      description: 'Custom color for the spinner',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Spinner component for loading states with customizable size and color.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

// ============================================================
// Basic Sizes
// ============================================================

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
};

// ============================================================
// With Label
// ============================================================

export const WithLabel: Story = {
  args: {
    size: 'medium',
    label: 'Loading...',
  },
};

export const WithLabelLarge: Story = {
  args: {
    size: 'large',
    label: 'Processing your request...',
  },
};

// ============================================================
// Custom Colors
// ============================================================

export const CustomColorPrimary: Story = {
  args: {
    size: 'medium',
    color: '#9c27b0',
    label: 'Primary Color',
  },
};

export const CustomColorSuccess: Story = {
  args: {
    size: 'medium',
    color: '#4CAF50',
    label: 'Success Color',
  },
};

export const CustomColorError: Story = {
  args: {
    size: 'medium',
    color: '#f44336',
    label: 'Error Color',
  },
};

// ============================================================
// Real-World Examples
// ============================================================

export const PageLoading: Story = {
  render: () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '300px',
      background: 'var(--theme-input-background, #fafafa)',
      borderRadius: '8px'
    }}>
      <Spinner size="large" label="Loading page..." />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Full page loading spinner.',
      },
    },
  },
};

export const ButtonLoading: Story = {
  render: () => (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        background: '#9c27b0',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'not-allowed',
      }}
      disabled
    >
      <Spinner size="small" color="#ffffff" />
      Saving...
    </button>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Inline spinner in a button.',
      },
    },
  },
};

export const InlineLoading: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Spinner size="small" />
      <span>Loading data...</span>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Inline spinner with text.',
      },
    },
  },
};

// ============================================================
// Gallery Views
// ============================================================

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
      <Spinner size="small" label="Small" />
      <Spinner size="medium" label="Medium" />
      <Spinner size="large" label="Large" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available spinner sizes.',
      },
    },
  },
};

export const ColorVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
      <Spinner size="medium" color="#9c27b0" label="Primary" />
      <Spinner size="medium" color="#4CAF50" label="Success" />
      <Spinner size="medium" color="#f44336" label="Error" />
      <Spinner size="medium" color="#FF9800" label="Warning" />
      <Spinner size="medium" color="#2196F3" label="Info" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Spinners with different colors.',
      },
    },
  },
};
