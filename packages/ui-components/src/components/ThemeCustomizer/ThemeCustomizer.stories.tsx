/*
 * ================================================================
 * FILE: ThemeCustomizer.stories.tsx
 * PATH: /packages/ui-components/src/components/ThemeCustomizer/ThemeCustomizer.stories.tsx
 * DESCRIPTION: Storybook stories for ThemeCustomizer component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ThemeCustomizer } from './ThemeCustomizer';

const meta: Meta<typeof ThemeCustomizer> = {
  title: 'Components/Utility/ThemeCustomizer',
  component: ThemeCustomizer,
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      description: 'Position of the floating button',
    },
    statusBarExpanded: {
      control: 'boolean',
      description: 'Whether StatusBar is expanded',
    },
    statusBarHeight: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'StatusBar collapsed height (px)',
    },
    statusBarExpandedHeight: {
      control: { type: 'number', min: 0, max: 500 },
      description: 'StatusBar expanded height (px)',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Theme customization floating button with modal. Allows users to customize theme settings: compact mode, high contrast, animations, font size, and accent color. Settings persist in localStorage and apply via CSS variables.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemeCustomizer>;

// ============================================================
// Basic Positions
// ============================================================

export const BottomRight: Story = {
  args: {
    position: 'bottom-right',
    statusBarExpanded: false,
    statusBarHeight: 32,
    statusBarExpandedHeight: 300,
  },
};

export const BottomLeft: Story = {
  args: {
    position: 'bottom-left',
    statusBarExpanded: false,
    statusBarHeight: 32,
    statusBarExpandedHeight: 300,
  },
};

export const TopRight: Story = {
  args: {
    position: 'top-right',
    statusBarExpanded: false,
    statusBarHeight: 32,
    statusBarExpandedHeight: 300,
  },
};

export const TopLeft: Story = {
  args: {
    position: 'top-left',
    statusBarExpanded: false,
    statusBarHeight: 32,
    statusBarExpandedHeight: 300,
  },
};

// ============================================================
// StatusBar States
// ============================================================

export const WithCollapsedStatusBar: Story = {
  args: {
    position: 'bottom-right',
    statusBarExpanded: false,
    statusBarHeight: 32,
    statusBarExpandedHeight: 300,
  },
  parameters: {
    docs: {
      description: {
        story: 'Floating button positioned above collapsed StatusBar (32px height).',
      },
    },
  },
};

export const WithExpandedStatusBar: Story = {
  args: {
    position: 'bottom-right',
    statusBarExpanded: true,
    statusBarHeight: 32,
    statusBarExpandedHeight: 300,
  },
  parameters: {
    docs: {
      description: {
        story: 'Floating button positioned above expanded StatusBar (332px total height). Button moves up dynamically.',
      },
    },
  },
};

// ============================================================
// Gallery View
// ============================================================

export const AllPositions: Story = {
  render: () => (
    <div style={{
      position: 'relative',
      height: '400px',
      border: '2px dashed #ccc',
      borderRadius: '8px',
    }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        color: '#999',
      }}>
        <p>Container (400px height)</p>
        <p style={{ fontSize: '12px' }}>Floating buttons in all 4 corners</p>
      </div>
      <ThemeCustomizer position="top-left" />
      <ThemeCustomizer position="top-right" />
      <ThemeCustomizer position="bottom-left" />
      <ThemeCustomizer position="bottom-right" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All four position options demonstrated simultaneously.',
      },
    },
  },
};

// ============================================================
// Features Documentation
// ============================================================

export const SettingsOverview: Story = {
  args: {
    position: 'bottom-right',
  },
  parameters: {
    docs: {
      description: {
        story: `
Click the floating button to open settings modal with these options:

**Compact Mode** - Reduces spacing throughout the app (--spacing-* variables)

**High Contrast** - Increases text contrast and border visibility

**Show Animations** - Toggles CSS animations and transitions

**Font Size** - Adjusts base font size (Small: 14px, Medium: 16px, Large: 18px)

**Accent Color** - Changes primary brand color and button gradients
  - L-KERN Purple (default)
  - Blue
  - Green
  - Orange
  - Rose
  - Pink
  - Blue Grey

All settings persist in localStorage and apply via CSS custom properties.
        `,
      },
    },
  },
};

export const DynamicPositioning: Story = {
  render: () => (
    <div style={{ padding: '16px' }}>
      <div style={{ marginBottom: '16px', padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h4>Dynamic StatusBar Positioning</h4>
        <p>The ThemeCustomizer adjusts its position based on StatusBar state:</p>
        <ul style={{ marginTop: '8px' }}>
          <li>Collapsed: 32px + 16px offset = 48px from bottom</li>
          <li>Expanded: 332px + 16px offset = 348px from bottom</li>
        </ul>
        <p style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
          Transition: smooth 0.3s ease animation when StatusBar expands/collapses
        </p>
      </div>
      <div style={{
        position: 'relative',
        height: '400px',
        border: '2px solid #9c27b0',
        borderRadius: '8px',
        background: '#fafafa',
      }}>
        <ThemeCustomizer position="bottom-right" statusBarExpanded={false} />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '32px',
          background: '#9c27b0',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          StatusBar (collapsed)
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates dynamic positioning above StatusBar with visual reference.',
      },
    },
  },
};
