/*
 * ================================================================
 * FILE: KeyboardShortcutsButton.stories.tsx
 * PATH: /packages/ui-components/src/components/KeyboardShortcutsButton/KeyboardShortcutsButton.stories.tsx
 * DESCRIPTION: Storybook stories for KeyboardShortcutsButton component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { KeyboardShortcutsButton } from './KeyboardShortcutsButton';

const meta: Meta<typeof KeyboardShortcutsButton> = {
  title: 'Components/Utility/KeyboardShortcutsButton',
  component: KeyboardShortcutsButton,
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
    onOpen: { action: 'modal opened' },
    onClose: { action: 'modal closed' },
  },
  parameters: {
    docs: {
      description: {
        component: 'Floating button for displaying keyboard shortcuts modal. Shows available shortcuts: Ctrl+D (theme), Ctrl+L (language), Ctrl+1-9 (permission levels). Opens with "?" key, closes with Esc. Positions above ThemeCustomizer button.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof KeyboardShortcutsButton>;

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
        story: 'Floating button positioned above collapsed StatusBar, stacked vertically above ThemeCustomizer.',
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
        story: 'Floating button moves up dynamically when StatusBar expands. Maintains vertical stack above ThemeCustomizer.',
      },
    },
  },
};

// ============================================================
// Callbacks
// ============================================================

export const WithCallbacks: Story = {
  args: {
    position: 'bottom-right',
    statusBarExpanded: false,
    onOpen: () => console.log('Shortcuts modal opened'),
    onClose: () => console.log('Shortcuts modal closed'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Open/close callbacks triggered when modal state changes. Check browser console for events.',
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
        <p style={{ fontSize: '12px' }}>Floating "?" buttons in all 4 corners</p>
      </div>
      <KeyboardShortcutsButton position="top-left" />
      <KeyboardShortcutsButton position="top-right" />
      <KeyboardShortcutsButton position="bottom-left" />
      <KeyboardShortcutsButton position="bottom-right" />
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

export const ShortcutsReference: Story = {
  args: {
    position: 'bottom-right',
  },
  parameters: {
    docs: {
      description: {
        story: `
Click the "?" button or press "?" key to open shortcuts modal.

**Available Keyboard Shortcuts:**

- **Ctrl+D** - Toggle dark/light theme
- **Ctrl+L** - Change language (SK/EN)
- **Ctrl+1** - Permission Level 10 (Basic lvl1)
- **Ctrl+2** - Permission Level 20 (Basic lvl2)
- **Ctrl+3** - Permission Level 29 (Basic lvl3)
- **Ctrl+4** - Permission Level 35 (Standard lvl1)
- **Ctrl+5** - Permission Level 45 (Standard lvl2)
- **Ctrl+6** - Permission Level 59 (Standard lvl3)
- **Ctrl+7** - Permission Level 65 (Admin lvl1)
- **Ctrl+8** - Permission Level 85 (Admin lvl2)
- **Ctrl+9** - Permission Level 100 (Admin lvl3)

**Modal Controls:**
- **?** - Open shortcuts modal
- **Esc** - Close shortcuts modal
        `,
      },
    },
  },
};

export const StackingBehavior: Story = {
  render: () => (
    <div style={{ padding: '16px' }}>
      <div style={{ marginBottom: '16px', padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h4>Vertical Stacking with ThemeCustomizer</h4>
        <p>KeyboardShortcutsButton stacks vertically above ThemeCustomizer:</p>
        <ul style={{ marginTop: '8px' }}>
          <li>ThemeCustomizer: StatusBar + 16px offset</li>
          <li>KeyboardShortcuts: ThemeCustomizer + 48px width + 16px spacing</li>
        </ul>
        <p style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
          Both buttons aligned to the same right position (24px from edge)
        </p>
      </div>
      <div style={{
        position: 'relative',
        height: '400px',
        border: '2px solid #3366cc',
        borderRadius: '8px',
        background: '#fafafa',
      }}>
        <KeyboardShortcutsButton position="bottom-right" statusBarExpanded={false} />
        <div style={{
          position: 'absolute',
          bottom: '48px', // StatusBar + offset
          right: '24px',
          width: '48px',
          height: '48px',
          background: '#9c27b0',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '24px',
        }}>
          <span role="img" aria-label="artist palette">🎨</span>
        </div>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '32px',
          background: '#3366cc',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          StatusBar
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Visual demonstration of vertical stacking above ThemeCustomizer and StatusBar.',
      },
    },
  },
};
