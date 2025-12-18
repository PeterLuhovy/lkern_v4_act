/*
 * ================================================================
 * FILE: CreateIssueModal.stories.tsx
 * PATH: /packages/ui-components/src/components/CreateIssueModal/CreateIssueModal.stories.tsx
 * DESCRIPTION: Storybook stories for CreateIssueModal component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { CreateIssueModal } from './CreateIssueModal';

const meta: Meta<typeof CreateIssueModal> = {
  title: 'Components/Modals/CreateIssueModal',
  component: CreateIssueModal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls modal visibility',
    },
    showClearButton: {
      control: 'boolean',
      description: 'Show clear form button',
    },
    showRoleTabs: {
      control: 'boolean',
      description: 'Show role selection tabs',
    },
    isLoading: {
      control: 'boolean',
      description: 'Loading state for submit button',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Create Issue Modal with role-based form variants (basic, standard, advanced). Auto-collects system info and supports file uploads.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CreateIssueModal>;

// ============================================================
// Basic Examples
// ============================================================

export const BasicUser: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSubmit: (data) => console.log('Issue submitted:', data),
    userRole: 'user_basic',
    showRoleTabs: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic user view - minimal fields (title, description, severity for bugs).',
      },
    },
  },
};

export const StandardUser: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSubmit: (data) => console.log('Issue submitted:', data),
    userRole: 'user_standard',
    showRoleTabs: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Standard user view - adds severity for bugs and improvements.',
      },
    },
  },
};

export const AdvancedUser: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSubmit: (data) => console.log('Issue submitted:', data),
    userRole: 'user_advance',
    showRoleTabs: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Advanced user view - all fields including category, priority, error details, and system info.',
      },
    },
  },
};

// ============================================================
// With Role Tabs (Development)
// ============================================================

export const WithRoleTabs: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSubmit: (data) => console.log('Issue submitted:', data),
    showRoleTabs: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Development mode - shows role tabs to test different user levels. Will be hidden once authentication is implemented.',
      },
    },
  },
};

// ============================================================
// Pre-filled Data
// ============================================================

export const WithInitialData: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSubmit: (data) => console.log('Issue submitted:', data),
    userRole: 'user_advance',
    showRoleTabs: false,
    initialData: {
      title: 'Pre-filled bug title',
      description: 'This data was pre-filled from a ReportButton click.',
      type: 'bug',
      severity: 'major',
      error_message: 'TypeError: Cannot read property "foo" of undefined',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Pre-filled from ReportButton - useful for context-aware bug reporting.',
      },
    },
  },
};

// ============================================================
// States
// ============================================================

export const LoadingState: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSubmit: (data) => console.log('Issue submitted:', data),
    userRole: 'user_standard',
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Submit button shows spinner while creating issue in backend.',
      },
    },
  },
};

export const WithClearButton: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSubmit: (data) => console.log('Issue submitted:', data),
    userRole: 'user_standard',
    showClearButton: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Clear button in footer left slot - resets form with confirmation.',
      },
    },
  },
};

export const WithoutClearButton: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSubmit: (data) => console.log('Issue submitted:', data),
    userRole: 'user_standard',
    showClearButton: false,
  },
};

// ============================================================
// Issue Type Examples
// ============================================================

export const BugReport: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSubmit: (data) => console.log('Issue submitted:', data),
    userRole: 'user_advance',
    showRoleTabs: false,
    initialData: {
      title: 'Login button not working',
      description: 'When I click the login button, nothing happens.',
      type: 'bug',
      severity: 'major',
      category: 'ui',
      priority: 'high',
    },
  },
};

export const FeatureRequest: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSubmit: (data) => console.log('Issue submitted:', data),
    userRole: 'user_standard',
    showRoleTabs: false,
    initialData: {
      title: 'Add dark mode support',
      description: 'It would be great to have a dark mode option for night work.',
      type: 'feature',
    },
  },
};

export const Improvement: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSubmit: (data) => console.log('Issue submitted:', data),
    userRole: 'user_standard',
    showRoleTabs: false,
    initialData: {
      title: 'Improve search performance',
      description: 'Search is slow with large datasets (10k+ records).',
      type: 'improvement',
      severity: 'moderate',
    },
  },
};

export const Question: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSubmit: (data) => console.log('Issue submitted:', data),
    userRole: 'user_basic',
    showRoleTabs: false,
    initialData: {
      title: 'How to export contacts to CSV?',
      description: "I can't find the export button in the contacts page.",
      type: 'question',
    },
  },
};

// ============================================================
// Gallery
// ============================================================

export const Features: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
      <h3>CreateIssueModal Features</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4>👤 Role-Based Forms</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Different field sets for basic/standard/advanced users.</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4>🖥️ System Info</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Auto-collects browser, OS, URL, viewport.</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4>📎 File Upload</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Up to 5 files, 10MB max each.</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4>✅ Validation</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Title (5-200 chars), description (10+ chars).</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4>🎨 Colored Headers</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Different colors for bug/feature/improvement/question.</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4>💾 Pre-fill Support</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Accept initialData from ReportButton.</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'CreateIssueModal key features overview.',
      },
    },
  },
};

export const RoleComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
      <h3>Role-Based Field Comparison</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
            <th style={{ textAlign: 'left', padding: '12px' }}>Field</th>
            <th style={{ textAlign: 'center', padding: '12px' }}>Basic</th>
            <th style={{ textAlign: 'center', padding: '12px' }}>Standard</th>
            <th style={{ textAlign: 'center', padding: '12px' }}>Advanced</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
            <td style={{ padding: '12px' }}>Title</td>
            <td style={{ textAlign: 'center', padding: '12px' }}>✅</td>
            <td style={{ textAlign: 'center', padding: '12px' }}>✅</td>
            <td style={{ textAlign: 'center', padding: '12px' }}>✅</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
            <td style={{ padding: '12px' }}>Description</td>
            <td style={{ textAlign: 'center', padding: '12px' }}>✅</td>
            <td style={{ textAlign: 'center', padding: '12px' }}>✅</td>
            <td style={{ textAlign: 'center', padding: '12px' }}>✅</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
            <td style={{ padding: '12px' }}>Severity (bug/improvement)</td>
            <td style={{ textAlign: 'center', padding: '12px' }}>❌</td>
            <td style={{ textAlign: 'center', padding: '12px' }}>✅</td>
            <td style={{ textAlign: 'center', padding: '12px' }}>✅</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
            <td style={{ padding: '12px' }}>Category</td>
            <td style={{ textAlign: 'center', padding: '12px' }}>❌</td>
            <td style={{ textAlign: 'center', padding: '12px' }}>❌</td>
            <td style={{ textAlign: 'center', padding: '12px' }}>✅</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
            <td style={{ padding: '12px' }}>Priority</td>
            <td style={{ textAlign: 'center', padding: '12px' }}>❌</td>
            <td style={{ textAlign: 'center', padding: '12px' }}>❌</td>
            <td style={{ textAlign: 'center', padding: '12px' }}>✅</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
            <td style={{ padding: '12px' }}>Error Type/Message</td>
            <td style={{ textAlign: 'center', padding: '12px' }}>❌</td>
            <td style={{ textAlign: 'center', padding: '12px' }}>❌</td>
            <td style={{ textAlign: 'center', padding: '12px' }}>✅ (bugs only)</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
            <td style={{ padding: '12px' }}>System Info</td>
            <td style={{ textAlign: 'center', padding: '12px' }}>❌</td>
            <td style={{ textAlign: 'center', padding: '12px' }}>❌</td>
            <td style={{ textAlign: 'center', padding: '12px' }}>✅</td>
          </tr>
          <tr>
            <td style={{ padding: '12px' }}>File Attachments</td>
            <td style={{ textAlign: 'center', padding: '12px' }}>✅</td>
            <td style={{ textAlign: 'center', padding: '12px' }}>✅</td>
            <td style={{ textAlign: 'center', padding: '12px' }}>✅</td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Field availability per role level.',
      },
    },
  },
};
