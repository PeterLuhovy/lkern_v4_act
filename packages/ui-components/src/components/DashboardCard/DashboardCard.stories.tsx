/*
 * ================================================================
 * FILE: DashboardCard.stories.tsx
 * PATH: /packages/ui-components/src/components/DashboardCard/DashboardCard.stories.tsx
 * DESCRIPTION: Storybook stories for DashboardCard component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { DashboardCard } from './DashboardCard';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof DashboardCard> = {
  title: 'Components/Layout/DashboardCard',
  component: DashboardCard,
  tags: ['autodocs'],
  argTypes: {
    path: {
      control: 'text',
      description: 'Navigation path (React Router link)',
    },
    title: {
      control: 'text',
      description: 'Card title',
    },
    description: {
      control: 'text',
      description: 'Card description',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Reusable dashboard navigation card with icon, title, and description. Wraps Card component with React Router Link.',
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DashboardCard>;

// ============================================================
// Basic Examples
// ============================================================

export const Default: Story = {
  args: {
    path: '/forms',
    icon: '📝',
    title: 'Form Components',
    description: 'Test form inputs and validation',
  },
};

export const WithEmojiIcon: Story = {
  args: {
    path: '/contacts',
    icon: '👥',
    title: 'Contacts',
    description: 'Manage customer contacts and relationships',
  },
};

export const WithComplexIcon: Story = {
  args: {
    path: '/analytics',
    icon: (
      <div style={{
        fontSize: '48px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        📊
      </div>
    ),
    title: 'Analytics Dashboard',
    description: 'View reports and business insights',
  },
};

// ============================================================
// Different Content Types
// ============================================================

export const OrdersCard: Story = {
  args: {
    path: '/orders',
    icon: '📦',
    title: 'Orders',
    description: 'View and manage customer orders',
  },
};

export const InvoicesCard: Story = {
  args: {
    path: '/invoices',
    icon: '💳',
    title: 'Invoices',
    description: 'Create and track invoices',
  },
};

export const SettingsCard: Story = {
  args: {
    path: '/settings',
    icon: '⚙️',
    title: 'Settings',
    description: 'Configure system preferences',
  },
};

export const ReportsCard: Story = {
  args: {
    path: '/reports',
    icon: '📈',
    title: 'Reports',
    description: 'Generate financial and operational reports',
  },
};

// ============================================================
// Long Content
// ============================================================

export const LongTitle: Story = {
  args: {
    path: '/long-title',
    icon: '📚',
    title: 'Very Long Dashboard Card Title Example',
    description: 'Testing how the card handles longer titles',
  },
};

export const LongDescription: Story = {
  args: {
    path: '/long-description',
    icon: '📝',
    title: 'Documentation',
    description: 'This is a much longer description to test how the dashboard card component handles text wrapping and layout when descriptions exceed the typical length.',
  },
};

// ============================================================
// Gallery View
// ============================================================

export const DashboardGrid: Story = {
  render: () => (
    <MemoryRouter>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
        padding: '20px',
        background: 'var(--theme-input-background, #f5f5f5)',
        borderRadius: '8px'
      }}>
        <DashboardCard
          path="/dashboard"
          icon="🏠"
          title="Dashboard"
          description="Overview of key metrics"
        />
        <DashboardCard
          path="/contacts"
          icon="👥"
          title="Contacts"
          description="Manage customer contacts"
        />
        <DashboardCard
          path="/orders"
          icon="📦"
          title="Orders"
          description="View and process orders"
        />
        <DashboardCard
          path="/invoices"
          icon="💳"
          title="Invoices"
          description="Create and track invoices"
        />
        <DashboardCard
          path="/reports"
          icon="📈"
          title="Reports"
          description="Business analytics and insights"
        />
        <DashboardCard
          path="/settings"
          icon="⚙️"
          title="Settings"
          description="System configuration"
        />
      </div>
    </MemoryRouter>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Typical dashboard layout with multiple navigation cards in a responsive grid.',
      },
    },
  },
};

export const TwoColumnLayout: Story = {
  render: () => (
    <MemoryRouter>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        maxWidth: '700px'
      }}>
        <DashboardCard
          path="/income"
          icon="💰"
          title="Income"
          description="Track revenue and earnings"
        />
        <DashboardCard
          path="/expenses"
          icon="💸"
          title="Expenses"
          description="Manage business expenses"
        />
        <DashboardCard
          path="/inventory"
          icon="📦"
          title="Inventory"
          description="Stock management"
        />
        <DashboardCard
          path="/customers"
          icon="👥"
          title="Customers"
          description="Customer database"
        />
      </div>
    </MemoryRouter>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Two-column grid layout for dashboard cards.',
      },
    },
  },
};

export const SingleColumn: Story = {
  render: () => (
    <MemoryRouter>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '400px'
      }}>
        <DashboardCard
          path="/profile"
          icon="👤"
          title="My Profile"
          description="View and edit your profile"
        />
        <DashboardCard
          path="/notifications"
          icon="🔔"
          title="Notifications"
          description="Manage your notifications"
        />
        <DashboardCard
          path="/help"
          icon="❓"
          title="Help & Support"
          description="Get help and documentation"
        />
      </div>
    </MemoryRouter>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Single column layout, suitable for sidebars or mobile views.',
      },
    },
  },
};
