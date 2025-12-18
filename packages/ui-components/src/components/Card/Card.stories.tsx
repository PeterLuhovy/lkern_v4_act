/*
 * ================================================================
 * FILE: Card.stories.tsx
 * PATH: /packages/ui-components/src/components/Card/Card.stories.tsx
 * DESCRIPTION: Storybook stories for Card component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Layout/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'elevated', 'accent'],
      description: 'Visual variant of the card',
    },
    disableHover: {
      control: 'boolean',
      description: 'Disable hover effects',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler (makes card interactive)',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Versatile card container for content grouping with multiple visual variants.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// ============================================================
// Basic Variants
// ============================================================

export const Default: Story = {
  args: {
    variant: 'default',
    children: (
      <div style={{ padding: '16px' }}>
        <h3 style={{ margin: '0 0 8px 0' }}>Default Card</h3>
        <p style={{ margin: 0 }}>Standard card with subtle background.</p>
      </div>
    ),
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: (
      <div style={{ padding: '16px' }}>
        <h3 style={{ margin: '0 0 8px 0' }}>Outlined Card</h3>
        <p style={{ margin: 0 }}>Card with visible border, transparent background.</p>
      </div>
    ),
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: (
      <div style={{ padding: '16px' }}>
        <h3 style={{ margin: '0 0 8px 0' }}>Elevated Card</h3>
        <p style={{ margin: 0 }}>Card with shadow for depth and prominence.</p>
      </div>
    ),
  },
};

export const Accent: Story = {
  args: {
    variant: 'accent',
    children: (
      <div style={{ padding: '16px' }}>
        <h3 style={{ margin: '0 0 8px 0' }}>Accent Card</h3>
        <p style={{ margin: 0 }}>Card with accent border (purple) for emphasis.</p>
      </div>
    ),
  },
};

// ============================================================
// Interactive States
// ============================================================

export const Clickable: Story = {
  args: {
    variant: 'elevated',
    onClick: () => alert('Card clicked!'),
    children: (
      <div style={{ padding: '16px' }}>
        <h3 style={{ margin: '0 0 8px 0' }}>Clickable Card</h3>
        <p style={{ margin: 0 }}>Click me! Card with hover effects and pointer cursor.</p>
      </div>
    ),
  },
};

export const NoHover: Story = {
  args: {
    variant: 'default',
    disableHover: true,
    children: (
      <div style={{ padding: '16px' }}>
        <h3 style={{ margin: '0 0 8px 0' }}>Non-Interactive Card</h3>
        <p style={{ margin: 0 }}>Card with hover effects disabled.</p>
      </div>
    ),
  },
};

// ============================================================
// Content Examples
// ============================================================

export const WithImage: Story = {
  args: {
    variant: 'elevated',
    children: (
      <div>
        <div style={{
          height: '160px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '48px'
        }}>
          🖼️
        </div>
        <div style={{ padding: '16px' }}>
          <h3 style={{ margin: '0 0 8px 0' }}>Card with Image</h3>
          <p style={{ margin: 0 }}>Card containing image or visual header.</p>
        </div>
      </div>
    ),
  },
};

export const WithList: Story = {
  args: {
    variant: 'outlined',
    children: (
      <div style={{ padding: '16px' }}>
        <h3 style={{ margin: '0 0 12px 0' }}>Shopping List</h3>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Bread</li>
          <li>Milk</li>
          <li>Eggs</li>
          <li>Cheese</li>
        </ul>
      </div>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    variant: 'default',
    children: (
      <div>
        <div style={{ padding: '16px' }}>
          <h3 style={{ margin: '0 0 8px 0' }}>Card Title</h3>
          <p style={{ margin: 0 }}>Card content with footer section below.</p>
        </div>
        <div style={{
          borderTop: '1px solid var(--theme-border, #e0e0e0)',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '14px',
          color: 'var(--theme-text-muted, #757575)'
        }}>
          <span>Last updated: 2025-12-16</span>
          <span>👁️ 42 views</span>
        </div>
      </div>
    ),
  },
};

// ============================================================
// Gallery View
// ============================================================

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', maxWidth: '800px' }}>
      <Card variant="default">
        <div style={{ padding: '16px' }}>
          <h4 style={{ margin: '0 0 8px 0' }}>Default</h4>
          <p style={{ margin: 0, fontSize: '14px' }}>Standard variant</p>
        </div>
      </Card>
      <Card variant="outlined">
        <div style={{ padding: '16px' }}>
          <h4 style={{ margin: '0 0 8px 0' }}>Outlined</h4>
          <p style={{ margin: 0, fontSize: '14px' }}>Border variant</p>
        </div>
      </Card>
      <Card variant="elevated">
        <div style={{ padding: '16px' }}>
          <h4 style={{ margin: '0 0 8px 0' }}>Elevated</h4>
          <p style={{ margin: 0, fontSize: '14px' }}>Shadow variant</p>
        </div>
      </Card>
      <Card variant="accent">
        <div style={{ padding: '16px' }}>
          <h4 style={{ margin: '0 0 8px 0' }}>Accent</h4>
          <p style={{ margin: 0, fontSize: '14px' }}>Purple border variant</p>
        </div>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available card variants displayed in a grid.',
      },
    },
  },
};
