/*
 * ================================================================
 * FILE: PageHeader.stories.tsx
 * PATH: /packages/ui-components/src/components/PageHeader/PageHeader.stories.tsx
 * DESCRIPTION: Storybook stories for PageHeader component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { PageHeader } from './PageHeader';
import { Button } from '../Button/Button';

const meta: Meta<typeof PageHeader> = {
  title: 'Components/Layout/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Page title (required)',
    },
    subtitle: {
      control: 'text',
      description: 'Optional subtitle below title',
    },
    showLogo: {
      control: 'boolean',
      description: 'Show logo on left side',
    },
    showRightLogo: {
      control: 'boolean',
      description: 'Show L-KERN logo on right side',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Universal page header with gradient design, title, subtitle, breadcrumbs, and logo support.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

// ============================================================
// Basic Usage
// ============================================================

export const Simple: Story = {
  args: {
    title: 'Page Title',
  },
};

export const WithSubtitle: Story = {
  args: {
    title: 'Contacts',
    subtitle: 'Manage your contacts and customer information',
  },
};

export const WithLogo: Story = {
  args: {
    title: 'Dashboard',
    subtitle: 'Welcome back!',
    showLogo: true,
    logoIcon: '🏠',
  },
};

// ============================================================
// With Breadcrumbs
// ============================================================

export const WithBreadcrumbs: Story = {
  args: {
    title: 'Contact Details',
    breadcrumbs: [
      { name: 'Home', href: '/' },
      { name: 'Contacts', href: '/contacts' },
      { name: 'John Doe', isActive: true },
    ],
  },
};

export const WithBreadcrumbsAndLogo: Story = {
  args: {
    title: 'User Profile',
    subtitle: 'Edit your profile information',
    showLogo: true,
    logoIcon: '👤',
    breadcrumbs: [
      { name: 'Home', href: '/' },
      { name: 'Settings', href: '/settings' },
      { name: 'Profile', isActive: true },
    ],
  },
};

// ============================================================
// With Actions
// ============================================================

export const WithButton: Story = {
  args: {
    title: 'Contacts',
    subtitle: 'Manage your contacts',
    children: <Button variant="primary">Add Contact</Button>,
  },
};

export const WithMultipleButtons: Story = {
  args: {
    title: 'Orders',
    subtitle: 'View and manage customer orders',
    showLogo: true,
    logoIcon: '📦',
    children: (
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button variant="secondary">Export</Button>
        <Button variant="primary">New Order</Button>
      </div>
    ),
  },
};

// ============================================================
// Logo Variations
// ============================================================

export const WithImageLogo: Story = {
  args: {
    title: 'L-KERN System',
    subtitle: 'Business Operating System',
    showLogo: true,
    logoIcon: 'https://via.placeholder.com/40x40/667eea/ffffff?text=L',
  },
};

export const NoRightLogo: Story = {
  args: {
    title: 'Clean Header',
    subtitle: 'No right logo displayed',
    showRightLogo: false,
  },
};

export const BothLogos: Story = {
  args: {
    title: 'Full Header',
    subtitle: 'With both left and right logos',
    showLogo: true,
    logoIcon: '🎯',
    showRightLogo: true,
  },
};

// ============================================================
// Complex Examples
// ============================================================

export const CompleteExample: Story = {
  args: {
    title: 'Invoice Management',
    subtitle: 'View, create, and manage invoices',
    showLogo: true,
    logoIcon: '💳',
    showRightLogo: true,
    breadcrumbs: [
      { name: 'Home', href: '/' },
      { name: 'Finance', href: '/finance' },
      { name: 'Invoices', isActive: true },
    ],
    children: (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="search"
          placeholder="Search invoices..."
          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            border: '1px solid var(--theme-border, #e0e0e0)',
            minWidth: '200px'
          }}
        />
        <Button variant="secondary" size="small">Filter</Button>
        <Button variant="primary" size="small">New Invoice</Button>
      </div>
    ),
  },
};

export const MinimalExample: Story = {
  args: {
    title: 'Simple Page',
  },
};

// ============================================================
// Gallery View
// ============================================================

export const VariousConfigurations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageHeader title="Simple Title" />
      <PageHeader title="With Subtitle" subtitle="This is a subtitle" />
      <PageHeader
        title="With Logo"
        subtitle="Left logo displayed"
        showLogo
        logoIcon="📊"
      />
      <PageHeader
        title="With Actions"
        subtitle="Button on the right"
        children={<Button variant="primary" size="small">Action</Button>}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Various PageHeader configurations stacked vertically.',
      },
    },
  },
};
