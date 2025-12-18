/*
 * ================================================================
 * FILE: AuthRoleSwitcher.stories.tsx
 * PATH: /packages/ui-components/src/components/AuthRoleSwitcher/AuthRoleSwitcher.stories.tsx
 * DESCRIPTION: Storybook stories for AuthRoleSwitcher component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { AuthRoleSwitcher } from './AuthRoleSwitcher';

const meta: Meta<typeof AuthRoleSwitcher> = {
  title: 'Components/Utility/AuthRoleSwitcher',
  component: AuthRoleSwitcher,
  tags: ['autodocs'],
  argTypes: {
    isCollapsed: {
      control: 'boolean',
      description: 'Whether sidebar is collapsed',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Authorization permission level switcher with 9 levels (Basic 1-3, Standard 1-3, Admin 1-3) and test user switcher. Keyboard shortcuts: Ctrl+1 through Ctrl+9. Development tool for testing permissions.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AuthRoleSwitcher>;

// ============================================================
// Basic States
// ============================================================

export const Expanded: Story = {
  args: {
    isCollapsed: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Expanded view showing test users, permission indicator, and 9-level grid with full labels.',
      },
    },
  },
};

export const Collapsed: Story = {
  args: {
    isCollapsed: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Collapsed view showing only keyboard shortcut numbers (1-9) in compact grid.',
      },
    },
  },
};

// ============================================================
// Gallery View
// ============================================================

export const ExpandedAndCollapsed: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
      <div style={{ flex: 1 }}>
        <h4 style={{ marginBottom: '8px' }}>Expanded (Sidebar Open)</h4>
        <AuthRoleSwitcher isCollapsed={false} />
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ marginBottom: '8px' }}>Collapsed (Sidebar Closed)</h4>
        <AuthRoleSwitcher isCollapsed={true} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of expanded and collapsed states.',
      },
    },
  },
};

// ============================================================
// Documentation
// ============================================================

export const KeyboardShortcuts: Story = {
  render: () => (
    <div style={{ padding: '16px' }}>
      <AuthRoleSwitcher isCollapsed={false} />
      <div style={{ marginTop: '24px', padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h4>Keyboard Shortcuts</h4>
        <ul style={{ marginTop: '8px' }}>
          <li><kbd>Ctrl+1</kbd> - Basic Level 1 (10)</li>
          <li><kbd>Ctrl+2</kbd> - Basic Level 2 (20)</li>
          <li><kbd>Ctrl+3</kbd> - Basic Level 3 (29)</li>
          <li><kbd>Ctrl+4</kbd> - Standard Level 1 (35)</li>
          <li><kbd>Ctrl+5</kbd> - Standard Level 2 (45)</li>
          <li><kbd>Ctrl+6</kbd> - Standard Level 3 (59)</li>
          <li><kbd>Ctrl+7</kbd> - Admin Level 1 (65)</li>
          <li><kbd>Ctrl+8</kbd> - Admin Level 2 (85)</li>
          <li><kbd>Ctrl+9</kbd> - Admin Level 3 (100)</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Component with keyboard shortcuts documentation. Try pressing Ctrl+1 through Ctrl+9 to switch permission levels.',
      },
    },
  },
};

export const PermissionLevels: Story = {
  render: () => (
    <div style={{ padding: '16px' }}>
      <AuthRoleSwitcher isCollapsed={false} />
      <div style={{ marginTop: '24px', padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h4>Permission Levels</h4>
        <div style={{ marginTop: '8px' }}>
          <div style={{ marginBottom: '8px' }}>
            <strong style={{ color: '#4CAF50' }}>Basic (Green Zone)</strong>
            <ul>
              <li>Level 1 (10) - View only</li>
              <li>Level 2 (20) - View + basic actions</li>
              <li>Level 3 (29) - View + extended actions</li>
            </ul>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong style={{ color: '#FF9800' }}>Standard (Yellow Zone)</strong>
            <ul>
              <li>Level 1 (35) - Create & edit own</li>
              <li>Level 2 (45) - Edit all</li>
              <li>Level 3 (59) - Delete own</li>
            </ul>
          </div>
          <div>
            <strong style={{ color: '#f44336' }}>Admin (Red Zone)</strong>
            <ul>
              <li>Level 1 (65) - Delete all</li>
              <li>Level 2 (85) - Advanced settings</li>
              <li>Level 3 (100) - Full admin access</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Permission levels documentation showing the 9-level structure and color coding.',
      },
    },
  },
};
