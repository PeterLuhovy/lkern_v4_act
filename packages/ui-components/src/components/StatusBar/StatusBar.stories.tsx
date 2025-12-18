/*
 * ================================================================
 * FILE: StatusBar.stories.tsx
 * PATH: /packages/ui-components/src/components/StatusBar/StatusBar.stories.tsx
 * DESCRIPTION: Storybook stories for StatusBar component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { StatusBar, ServiceStatus, BackupInfo, CurrentUser } from './StatusBar';

const meta: Meta<typeof StatusBar> = {
  title: 'Components/Layout/StatusBar',
  component: StatusBar,
  tags: ['autodocs'],
  argTypes: {
    dataSource: {
      control: 'select',
      options: ['orchestrator', 'mock', 'error'],
      description: 'Data source indicator',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Status bar component with real-time system monitoring, service health indicators, backup controls, and theme/language toggles.',
      },
    },
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof StatusBar>;

// Mock data
const healthyServices: Record<string, ServiceStatus> = {
  'orchestrator': {
    name: 'Orchestrator',
    status: 'healthy',
    critical: true,
    response_time: 15,
  },
  'lkms101-contacts': {
    name: 'Contacts Service',
    status: 'healthy',
    critical: false,
    response_time: 23,
  },
  'lkms102-orders': {
    name: 'Orders Service',
    status: 'healthy',
    critical: false,
    response_time: 31,
  },
  'postgres': {
    name: 'PostgreSQL Database',
    status: 'healthy',
    critical: true,
    response_time: 8,
  },
};

const unhealthyServices: Record<string, ServiceStatus> = {
  'orchestrator': {
    name: 'Orchestrator',
    status: 'healthy',
    critical: true,
    response_time: 15,
  },
  'lkms101-contacts': {
    name: 'Contacts Service',
    status: 'unhealthy',
    critical: false,
    response_time: 450,
  },
  'lkms102-orders': {
    name: 'Orders Service',
    status: 'down',
    critical: false,
    response_time: 0,
  },
  'postgres': {
    name: 'PostgreSQL Database',
    status: 'healthy',
    critical: true,
    response_time: 8,
  },
};

const criticalDownServices: Record<string, ServiceStatus> = {
  'orchestrator': {
    name: 'Orchestrator',
    status: 'down',
    critical: true,
    response_time: 0,
  },
  'lkms101-contacts': {
    name: 'Contacts Service',
    status: 'healthy',
    critical: false,
    response_time: 23,
  },
  'postgres': {
    name: 'PostgreSQL Database',
    status: 'down',
    critical: true,
    response_time: 0,
  },
};

const lastBackup: BackupInfo = {
  completed_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  files: 15,
  status: 'completed',
};

const mockUser: CurrentUser = {
  name: 'John Doe',
  position: 'Administrator',
  department: 'IT',
  avatar: '👤',
};

// ============================================================
// Basic States
// ============================================================

export const AllHealthy: Story = {
  args: {
    services: healthyServices,
    initialBackupInfo: lastBackup,
    currentUser: mockUser,
    dataSource: 'orchestrator',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, padding: '20px', background: 'var(--theme-input-background, #f5f5f5)' }}>
          <h1>Main Application Content</h1>
          <p>Click the status bar at the bottom to expand it and see detailed service information.</p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export const SomeUnhealthy: Story = {
  args: {
    services: unhealthyServices,
    initialBackupInfo: lastBackup,
    currentUser: mockUser,
    dataSource: 'orchestrator',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, padding: '20px', background: 'var(--theme-input-background, #f5f5f5)' }}>
          <h1>Main Application Content</h1>
          <p>Some non-critical services are unhealthy or down.</p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export const CriticalDown: Story = {
  args: {
    services: criticalDownServices,
    initialBackupInfo: lastBackup,
    currentUser: mockUser,
    dataSource: 'orchestrator',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, padding: '20px', background: 'var(--theme-input-background, #f5f5f5)' }}>
          <h1>Main Application Content</h1>
          <p>Critical services are down! Status bar shows red warning.</p>
        </div>
        <Story />
      </div>
    ),
  ],
};

// ============================================================
// Data Source Variations
// ============================================================

export const MockData: Story = {
  args: {
    services: healthyServices,
    initialBackupInfo: lastBackup,
    currentUser: mockUser,
    dataSource: 'mock',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, padding: '20px', background: 'var(--theme-input-background, #f5f5f5)' }}>
          <h1>Mock Data Mode</h1>
          <p>Status bar displays a warning indicator showing mock/dummy data is being used.</p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export const OrchestratorOffline: Story = {
  args: {
    services: {},
    currentUser: mockUser,
    dataSource: 'error',
    dataSourceError: 'Failed to connect to orchestrator service (timeout after 5s)',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, padding: '20px', background: 'var(--theme-input-background, #f5f5f5)' }}>
          <h1>Orchestrator Offline</h1>
          <p>Status bar displays error indicator when orchestrator service is unavailable.</p>
        </div>
        <Story />
      </div>
    ),
  ],
};

// ============================================================
// User Variations
// ============================================================

export const WithUser: Story = {
  args: {
    services: healthyServices,
    initialBackupInfo: lastBackup,
    currentUser: mockUser,
    dataSource: 'orchestrator',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, padding: '20px', background: 'var(--theme-input-background, #f5f5f5)' }}>
          <h1>With User Info</h1>
          <p>Status bar displays current user information (avatar, name, position).</p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export const WithoutUser: Story = {
  args: {
    services: healthyServices,
    initialBackupInfo: lastBackup,
    dataSource: 'orchestrator',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, padding: '20px', background: 'var(--theme-input-background, #f5f5f5)' }}>
          <h1>Without User Info</h1>
          <p>Status bar without user information section.</p>
        </div>
        <Story />
      </div>
    ),
  ],
};

// ============================================================
// Backup States
// ============================================================

export const WithRecentBackup: Story = {
  args: {
    services: healthyServices,
    initialBackupInfo: {
      completed_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      files: 42,
      status: 'completed',
    },
    currentUser: mockUser,
    dataSource: 'orchestrator',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, padding: '20px', background: 'var(--theme-input-background, #f5f5f5)' }}>
          <h1>Recent Backup</h1>
          <p>Expand status bar to see recent backup information (30 minutes ago).</p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export const NoBackupHistory: Story = {
  args: {
    services: healthyServices,
    initialBackupInfo: null,
    currentUser: mockUser,
    dataSource: 'orchestrator',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, padding: '20px', background: 'var(--theme-input-background, #f5f5f5)' }}>
          <h1>No Backup History</h1>
          <p>Expand status bar to see backup controls. Click backup button to run first backup.</p>
        </div>
        <Story />
      </div>
    ),
  ],
};

// ============================================================
// Service Variations
// ============================================================

export const MinimalServices: Story = {
  args: {
    services: {
      'orchestrator': {
        name: 'Orchestrator',
        status: 'healthy',
        critical: true,
        response_time: 15,
      },
      'postgres': {
        name: 'PostgreSQL',
        status: 'healthy',
        critical: true,
        response_time: 8,
      },
    },
    currentUser: mockUser,
    dataSource: 'orchestrator',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, padding: '20px', background: 'var(--theme-input-background, #f5f5f5)' }}>
          <h1>Minimal Services</h1>
          <p>Only essential critical services (Orchestrator and Database).</p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export const ManyServices: Story = {
  args: {
    services: {
      'orchestrator': { name: 'Orchestrator', status: 'healthy', critical: true, response_time: 15 },
      'lkms101-contacts': { name: 'Contacts Service', status: 'healthy', critical: false, response_time: 23 },
      'lkms102-orders': { name: 'Orders Service', status: 'healthy', critical: false, response_time: 31 },
      'lkms103-invoices': { name: 'Invoices Service', status: 'healthy', critical: false, response_time: 28 },
      'lkms104-reports': { name: 'Reports Service', status: 'unhealthy', critical: false, response_time: 420 },
      'lkms105-auth': { name: 'Auth Service', status: 'healthy', critical: true, response_time: 12 },
      'postgres': { name: 'PostgreSQL', status: 'healthy', critical: true, response_time: 8 },
      'redis': { name: 'Redis Cache', status: 'healthy', critical: true, response_time: 3 },
    },
    initialBackupInfo: lastBackup,
    currentUser: mockUser,
    dataSource: 'orchestrator',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, padding: '20px', background: 'var(--theme-input-background, #f5f5f5)' }}>
          <h1>Many Services</h1>
          <p>Full microservices architecture with 8 services (one unhealthy).</p>
        </div>
        <Story />
      </div>
    ),
  ],
};

// ============================================================
// Interactive Features
// ============================================================

export const WithCallbacks: Story = {
  args: {
    services: healthyServices,
    initialBackupInfo: lastBackup,
    currentUser: mockUser,
    dataSource: 'orchestrator',
    onBackup: async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Backup completed successfully!');
    },
    onRefresh: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      alert('Services refreshed!');
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, padding: '20px', background: 'var(--theme-input-background, #f5f5f5)' }}>
          <h1>Interactive Features</h1>
          <p>Expand status bar and click backup button or refresh button to trigger callbacks.</p>
        </div>
        <Story />
      </div>
    ),
  ],
};

// ============================================================
// Expanded State
// ============================================================

export const ExpandedView: Story = {
  args: {
    services: healthyServices,
    initialBackupInfo: lastBackup,
    currentUser: mockUser,
    dataSource: 'orchestrator',
  },
  decorators: [
    (Story) => {
      // Auto-expand on mount
      React.useEffect(() => {
        const statusBar = document.querySelector('[data-component="statusbar"]');
        if (statusBar) {
          (statusBar as HTMLElement).click();
        }
      }, []);

      return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, padding: '20px', background: 'var(--theme-input-background, #f5f5f5)' }}>
            <h1>Expanded View</h1>
            <p>Status bar is automatically expanded to show full service details.</p>
            <p>Features:</p>
            <ul>
              <li>Critical services section (orchestrator, database)</li>
              <li>Other services section (microservices)</li>
              <li>Database & backup section with one-click backup</li>
              <li>Service response times</li>
              <li>Resizable height (drag top edge)</li>
              <li>Click outside to collapse</li>
            </ul>
          </div>
          <Story />
        </div>
      );
    },
  ],
};
