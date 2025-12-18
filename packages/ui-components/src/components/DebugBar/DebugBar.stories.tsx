/*
 * ================================================================
 * FILE: DebugBar.stories.tsx
 * PATH: /packages/ui-components/src/components/DebugBar/DebugBar.stories.tsx
 * DESCRIPTION: Storybook stories for DebugBar component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { DebugBar } from './DebugBar';
import React from 'react';

// Mock analytics object for stories
const createMockAnalytics = (overrides = {}) => ({
  metrics: {
    totalTime: '00:02:15',
    timeSinceLastActivity: '00:00:05',
    clickCount: 42,
    keyboardCount: 18,
    ...overrides,
  },
  trackClick: (id: string, type: string, event: React.MouseEvent) => {
    console.log('Click tracked:', id, type);
  },
  trackKeyboard: (key: string, event: React.KeyboardEvent) => {
    console.log('Keyboard tracked:', key);
  },
  reset: () => {
    console.log('Analytics reset');
  },
});

const meta: Meta<typeof DebugBar> = {
  title: 'Components/Utility/DebugBar',
  component: DebugBar,
  tags: ['autodocs'],
  argTypes: {
    modalName: {
      control: 'text',
      description: 'Modal/Page name to display',
    },
    isDarkMode: {
      control: 'boolean',
      description: 'Whether dark mode is active',
    },
    show: {
      control: 'boolean',
      description: 'Whether to show debug bar',
    },
    contextType: {
      control: 'select',
      options: ['page', 'modal'],
      description: 'Context type for analytics',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Debug analytics bar displaying real-time modal/page metrics including clicks, keyboard events, theme, language, and timers.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DebugBar>;

// ============================================================
// Basic Variants
// ============================================================

export const LightMode: Story = {
  args: {
    modalName: 'edit-contact',
    isDarkMode: false,
    analytics: createMockAnalytics(),
    show: true,
    contextType: 'modal',
  },
};

export const DarkMode: Story = {
  args: {
    modalName: 'edit-contact',
    isDarkMode: true,
    analytics: createMockAnalytics(),
    show: true,
    contextType: 'modal',
  },
};

// ============================================================
// Different Names
// ============================================================

export const PageContext: Story = {
  args: {
    modalName: 'home',
    isDarkMode: false,
    analytics: createMockAnalytics(),
    show: true,
    contextType: 'page',
  },
};

export const ModalContext: Story = {
  args: {
    modalName: 'modalV3Testing',
    isDarkMode: false,
    analytics: createMockAnalytics(),
    show: true,
    contextType: 'modal',
  },
};

// ============================================================
// Different Metrics
// ============================================================

export const HighActivity: Story = {
  args: {
    modalName: 'orders',
    isDarkMode: false,
    analytics: createMockAnalytics({
      totalTime: '00:15:42',
      timeSinceLastActivity: '00:00:01',
      clickCount: 284,
      keyboardCount: 156,
    }),
    show: true,
  },
};

export const LowActivity: Story = {
  args: {
    modalName: 'settings',
    isDarkMode: false,
    analytics: createMockAnalytics({
      totalTime: '00:00:45',
      timeSinceLastActivity: '00:00:30',
      clickCount: 5,
      keyboardCount: 2,
    }),
    show: true,
  },
};

export const JustOpened: Story = {
  args: {
    modalName: 'create-order',
    isDarkMode: false,
    analytics: createMockAnalytics({
      totalTime: '00:00:03',
      timeSinceLastActivity: '00:00:01',
      clickCount: 0,
      keyboardCount: 0,
    }),
    show: true,
  },
};

// ============================================================
// Long Names
// ============================================================

export const LongModalName: Story = {
  args: {
    modalName: 'edit-contact-with-very-long-modal-name-that-wraps',
    isDarkMode: false,
    analytics: createMockAnalytics(),
    show: true,
  },
};

// ============================================================
// Show/Hide
// ============================================================

export const Hidden: Story = {
  args: {
    modalName: 'edit-contact',
    isDarkMode: false,
    analytics: createMockAnalytics(),
    show: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Debug bar hidden (show=false). Nothing is rendered.',
      },
    },
  },
};

// ============================================================
// Gallery View
// ============================================================

export const LightAndDark: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4 style={{ marginBottom: '8px' }}>Light Mode</h4>
        <DebugBar
          modalName="edit-contact"
          isDarkMode={false}
          analytics={createMockAnalytics()}
          show={true}
        />
      </div>
      <div style={{ background: '#1e1e1e', padding: '16px' }}>
        <h4 style={{ marginBottom: '8px', color: '#fff' }}>Dark Mode</h4>
        <DebugBar
          modalName="edit-contact"
          isDarkMode={true}
          analytics={createMockAnalytics()}
          show={true}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Debug bar in both light and dark modes.',
      },
    },
  },
};

export const DifferentContextTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4 style={{ marginBottom: '8px' }}>Page Context</h4>
        <DebugBar
          modalName="home"
          isDarkMode={false}
          analytics={createMockAnalytics()}
          show={true}
          contextType="page"
        />
      </div>
      <div>
        <h4 style={{ marginBottom: '8px' }}>Modal Context</h4>
        <DebugBar
          modalName="edit-contact"
          isDarkMode={false}
          analytics={createMockAnalytics()}
          show={true}
          contextType="modal"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Debug bar with different context types (affects copy format).',
      },
    },
  },
};
