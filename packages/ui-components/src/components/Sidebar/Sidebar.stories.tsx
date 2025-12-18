/*
 * ================================================================
 * FILE: Sidebar.stories.tsx
 * PATH: /packages/ui-components/src/components/Sidebar/Sidebar.stories.tsx
 * DESCRIPTION: Storybook stories for Sidebar component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar, SidebarNavItem } from './Sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Layout/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  argTypes: {
    defaultCollapsed: {
      control: 'boolean',
      description: 'Initial collapsed state',
    },
    showLogo: {
      control: 'boolean',
      description: 'Show logo at top',
    },
    showThemeToggle: {
      control: 'boolean',
      description: 'Show theme toggle at bottom',
    },
    showLanguageToggle: {
      control: 'boolean',
      description: 'Show language toggle at bottom',
    },
    showFloatingAction: {
      control: 'boolean',
      description: 'Show floating action button',
    },
    resizable: {
      control: 'boolean',
      description: 'Enable sidebar width resizing',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Modern dark sidebar with collapsible navigation, tabs (Navigation, Settings, Analytics), and floating submenu tooltips.',
      },
    },
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

// Sample navigation items
const basicNavItems: SidebarNavItem[] = [
  {
    path: '/',
    labelKey: 'sidebar.dashboard',
    icon: '🏠',
    onClick: () => console.log('Navigate to Dashboard')
  },
  {
    path: '/contacts',
    labelKey: 'sidebar.contacts',
    icon: '👥',
    badge: 5,
    onClick: () => console.log('Navigate to Contacts')
  },
  {
    path: '/orders',
    labelKey: 'sidebar.orders',
    icon: '📦',
    badge: 12,
    onClick: () => console.log('Navigate to Orders')
  },
  {
    path: '/settings',
    labelKey: 'sidebar.settings',
    icon: '⚙️',
    onClick: () => console.log('Navigate to Settings')
  },
];

const nestedNavItems: SidebarNavItem[] = [
  {
    path: '/',
    labelKey: 'sidebar.dashboard',
    icon: '🏠',
    onClick: () => console.log('Navigate to Dashboard')
  },
  {
    path: '/income',
    labelKey: 'sidebar.income',
    icon: '💰',
    onClick: () => console.log('Navigate to Income'),
    children: [
      {
        path: '/income/earnings',
        labelKey: 'sidebar.earnings',
        icon: '📈',
        onClick: () => console.log('Navigate to Earnings')
      },
      {
        path: '/income/refunds',
        labelKey: 'sidebar.refunds',
        icon: '↩️',
        onClick: () => console.log('Navigate to Refunds')
      },
    ]
  },
  {
    path: '/expenses',
    labelKey: 'sidebar.expenses',
    icon: '💸',
    onClick: () => console.log('Navigate to Expenses'),
    children: [
      {
        path: '/expenses/bills',
        labelKey: 'sidebar.bills',
        icon: '📄',
        onClick: () => console.log('Navigate to Bills')
      },
      {
        path: '/expenses/payroll',
        labelKey: 'sidebar.payroll',
        icon: '💵',
        onClick: () => console.log('Navigate to Payroll')
      },
    ]
  },
  {
    path: '/reports',
    labelKey: 'sidebar.reports',
    icon: '📊',
    onClick: () => console.log('Navigate to Reports')
  },
];

// ============================================================
// Basic States
// ============================================================

export const Expanded: Story = {
  args: {
    items: basicNavItems,
    activePath: '/',
    defaultCollapsed: false,
    showLogo: true,
    showThemeToggle: true,
    showLanguageToggle: true,
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', display: 'flex' }}>
        <Story />
        <div style={{ flex: 1, padding: '20px', background: 'var(--theme-input-background, #f5f5f5)' }}>
          <h2>Main Content Area</h2>
          <p>Sidebar is expanded (240px width by default)</p>
        </div>
      </div>
    ),
  ],
};

export const Collapsed: Story = {
  args: {
    items: basicNavItems,
    activePath: '/',
    defaultCollapsed: true,
    showLogo: true,
    showThemeToggle: true,
    showLanguageToggle: true,
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', display: 'flex' }}>
        <Story />
        <div style={{ flex: 1, padding: '20px', background: 'var(--theme-input-background, #f5f5f5)' }}>
          <h2>Main Content Area</h2>
          <p>Sidebar is collapsed (24px width). Hover over items to see floating submenu tooltips.</p>
        </div>
      </div>
    ),
  ],
};

// ============================================================
// Navigation Examples
// ============================================================

export const BasicNavigation: Story = {
  args: {
    items: basicNavItems,
    activePath: '/contacts',
    showLogo: true,
    logoIcon: '🎯',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', display: 'flex' }}>
        <Story />
        <div style={{ flex: 1, padding: '20px', background: 'var(--theme-input-background, #f5f5f5)' }}>
          <h2>Contacts Page</h2>
          <p>Active path: /contacts (highlighted in sidebar)</p>
        </div>
      </div>
    ),
  ],
};

export const NestedNavigation: Story = {
  args: {
    items: nestedNavItems,
    activePath: '/income/earnings',
    showLogo: true,
    logoIcon: '💼',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', display: 'flex' }}>
        <Story />
        <div style={{ flex: 1, padding: '20px', background: 'var(--theme-input-background, #f5f5f5)' }}>
          <h2>Earnings Page</h2>
          <p>Nested navigation with expandable/collapsible submenus</p>
          <p>Active path: /income/earnings</p>
        </div>
      </div>
    ),
  ],
};

export const WithBadges: Story = {
  args: {
    items: basicNavItems,
    activePath: '/orders',
    showLogo: true,
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', display: 'flex' }}>
        <Story />
        <div style={{ flex: 1, padding: '20px', background: 'var(--theme-input-background, #f5f5f5)' }}>
          <h2>Navigation with Badges</h2>
          <p>Contacts has 5 notifications, Orders has 12 notifications</p>
        </div>
      </div>
    ),
  ],
};

// ============================================================
// Feature Variations
// ============================================================

export const WithAllFeatures: Story = {
  args: {
    items: nestedNavItems,
    activePath: '/',
    showLogo: true,
    logoIcon: '🚀',
    showThemeToggle: true,
    showLanguageToggle: true,
    showFloatingAction: true,
    onFloatingAction: () => alert('Floating action clicked!'),
    resizable: true,
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', display: 'flex' }}>
        <Story />
        <div style={{ flex: 1, padding: '20px', background: 'var(--theme-input-background, #f5f5f5)' }}>
          <h2>Sidebar with All Features</h2>
          <ul>
            <li>Logo at top</li>
            <li>Nested navigation with expand/collapse</li>
            <li>Theme toggle (light/dark mode)</li>
            <li>Language toggle (SK/EN)</li>
            <li>Floating action button</li>
            <li>Resizable width (drag right edge)</li>
            <li>3 tabs: Navigation, Settings, Analytics</li>
          </ul>
        </div>
      </div>
    ),
  ],
};

export const MinimalSidebar: Story = {
  args: {
    items: basicNavItems,
    activePath: '/',
    showLogo: false,
    showThemeToggle: false,
    showLanguageToggle: false,
    showFloatingAction: false,
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', display: 'flex' }}>
        <Story />
        <div style={{ flex: 1, padding: '20px', background: 'var(--theme-input-background, #f5f5f5)' }}>
          <h2>Minimal Sidebar</h2>
          <p>Only navigation, no extra features</p>
        </div>
      </div>
    ),
  ],
};

export const ResizableWidth: Story = {
  args: {
    items: basicNavItems,
    activePath: '/',
    showLogo: true,
    resizable: true,
    defaultWidth: 300,
    minWidth: 180,
    maxWidth: 450,
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', display: 'flex' }}>
        <Story />
        <div style={{ flex: 1, padding: '20px', background: 'var(--theme-input-background, #f5f5f5)' }}>
          <h2>Resizable Sidebar</h2>
          <p>Drag the right edge to resize (180px - 450px)</p>
          <p>Default width: 300px</p>
        </div>
      </div>
    ),
  ],
};

// ============================================================
// Tab System
// ============================================================

export const TabSystem: Story = {
  args: {
    items: nestedNavItems,
    activePath: '/',
    showLogo: true,
    showThemeToggle: true,
    showLanguageToggle: true,
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', display: 'flex' }}>
        <Story />
        <div style={{ flex: 1, padding: '20px', background: 'var(--theme-input-background, #f5f5f5)' }}>
          <h2>3-Tab System</h2>
          <ul>
            <li><strong>Tab 1: Navigation</strong> - Main app navigation with expand/collapse controls</li>
            <li><strong>Tab 2: User Settings</strong> - Auth role switcher, export settings</li>
            <li><strong>Tab 3: Analytics</strong> - Debug settings, analytics toggles</li>
          </ul>
          <p>Click tabs at the top of the sidebar to switch between them.</p>
        </div>
      </div>
    ),
  ],
};

// ============================================================
// States Comparison
// ============================================================

export const ExpandedVsCollapsed: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '40px' }}>
      <div style={{ height: '600px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3>Expanded (240px)</h3>
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar
            items={nestedNavItems}
            activePath="/income/earnings"
            defaultCollapsed={false}
            showLogo={true}
            showThemeToggle={true}
          />
          <div style={{ width: '200px', padding: '20px', background: 'var(--theme-input-background, #f5f5f5)' }}>
            Content area
          </div>
        </div>
      </div>

      <div style={{ height: '600px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3>Collapsed (24px)</h3>
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar
            items={nestedNavItems}
            activePath="/income/earnings"
            defaultCollapsed={true}
            showLogo={true}
            showThemeToggle={true}
          />
          <div style={{ width: '200px', padding: '20px', background: 'var(--theme-input-background, #f5f5f5)' }}>
            Content area
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of expanded vs collapsed states. Hover over collapsed sidebar to see floating submenu tooltips.',
      },
    },
  },
};
