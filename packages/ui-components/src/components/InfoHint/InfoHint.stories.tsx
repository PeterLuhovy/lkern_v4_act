/*
 * ================================================================
 * FILE: InfoHint.stories.tsx
 * PATH: /packages/ui-components/src/components/InfoHint/InfoHint.stories.tsx
 * DESCRIPTION: Storybook stories for InfoHint component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { InfoHint } from './InfoHint';

const meta: Meta<typeof InfoHint> = {
  title: 'Components/Feedback/InfoHint',
  component: InfoHint,
  tags: ['autodocs'],
  argTypes: {
    content: {
      control: 'text',
      description: 'Content to display in the popup',
    },
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Position of the popup relative to the icon',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the info icon',
    },
    maxWidth: {
      control: 'number',
      description: 'Max width of the popup in pixels',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Info hint icon with click-to-show popup tooltip. Uses React Portal for proper positioning.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof InfoHint>;

// ============================================================
// Basic Positions
// ============================================================

export const Top: Story = {
  args: {
    content: 'This is helpful information that appears on top.',
    position: 'top',
  },
};

export const Bottom: Story = {
  args: {
    content: 'This is helpful information that appears at the bottom.',
    position: 'bottom',
  },
};

export const Left: Story = {
  args: {
    content: 'This is helpful information that appears on the left.',
    position: 'left',
  },
};

export const Right: Story = {
  args: {
    content: 'This is helpful information that appears on the right.',
    position: 'right',
  },
};

// ============================================================
// Sizes
// ============================================================

export const SizeSmall: Story = {
  args: {
    content: 'Small info hint icon',
    position: 'top',
    size: 'small',
  },
};

export const SizeMedium: Story = {
  args: {
    content: 'Medium info hint icon (default)',
    position: 'top',
    size: 'medium',
  },
};

export const SizeLarge: Story = {
  args: {
    content: 'Large info hint icon',
    position: 'top',
    size: 'large',
  },
};

// ============================================================
// Content Variations
// ============================================================

export const ShortContent: Story = {
  args: {
    content: 'Quick tip!',
    position: 'top',
  },
};

export const LongContent: Story = {
  args: {
    content: 'This is a longer piece of information that explains something in more detail. It automatically wraps to multiple lines when it exceeds the maximum width.',
    position: 'top',
    maxWidth: 300,
  },
};

export const CustomWidth: Story = {
  args: {
    content: 'This popup has a custom max width of 200px. The text will wrap accordingly.',
    position: 'top',
    maxWidth: 200,
  },
};

export const RichContent: Story = {
  args: {
    content: (
      <div>
        <strong>Important Note:</strong>
        <p style={{ margin: '8px 0' }}>
          This field accepts email addresses in the format: user@domain.com
        </p>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Must contain @ symbol</li>
          <li>Domain must be valid</li>
        </ul>
      </div>
    ),
    position: 'right',
    maxWidth: 350,
  },
  parameters: {
    docs: {
      description: {
        story: 'InfoHint with rich HTML content including formatting.',
      },
    },
  },
};

// ============================================================
// Real-World Examples
// ============================================================

export const FormFieldHelp: Story = {
  render: () => (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <label htmlFor="email-input" style={{ fontWeight: '600' }}>
          Email Address
        </label>
        <InfoHint
          content="Enter your business email address. We'll send important notifications here."
          position="right"
          size="small"
        />
      </div>
      <input
        id="email-input"
        type="email"
        placeholder="user@example.com"
        style={{
          padding: '10px',
          border: '2px solid #e0e0e0',
          borderRadius: '6px',
          width: '300px',
          fontSize: '14px',
        }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'InfoHint used as form field help tooltip.',
      },
    },
  },
};

export const TableHeaderHelp: Story = {
  render: () => (
    <div style={{ padding: '40px' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
            <th style={{ textAlign: 'left', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Name
                <InfoHint
                  content="Contact's full name as registered in the system."
                  position="top"
                  size="small"
                />
              </div>
            </th>
            <th style={{ textAlign: 'left', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Status
                <InfoHint
                  content="Active contacts receive notifications. Inactive contacts are archived."
                  position="top"
                  size="small"
                />
              </div>
            </th>
            <th style={{ textAlign: 'left', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Last Activity
                <InfoHint
                  content="Timestamp of the last recorded activity (login, order, message)."
                  position="top"
                  size="small"
                />
              </div>
            </th>
          </tr>
        </thead>
      </table>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'InfoHint used in table headers for column explanations.',
      },
    },
  },
};

export const SettingsHelp: Story = {
  render: () => (
    <div style={{ padding: '40px', maxWidth: '600px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <label style={{ fontWeight: '600', flex: 1 }}>
            Enable Two-Factor Authentication
          </label>
          <InfoHint
            content={
              <div>
                <strong>Two-Factor Authentication (2FA)</strong>
                <p style={{ margin: '8px 0' }}>
                  Adds an extra layer of security by requiring a code from your phone in addition to your password.
                </p>
                <p style={{ margin: 0 }}>
                  Recommended for all accounts.
                </p>
              </div>
            }
            position="left"
            maxWidth={300}
          />
        </div>
        <input type="checkbox" id="2fa-toggle" />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <label style={{ fontWeight: '600', flex: 1 }}>
            Session Timeout (minutes)
          </label>
          <InfoHint
            content="Automatically log out after this many minutes of inactivity. Minimum: 5 minutes, Maximum: 1440 minutes (24 hours)."
            position="left"
            maxWidth={300}
          />
        </div>
        <input
          type="number"
          defaultValue="30"
          min="5"
          max="1440"
          style={{
            padding: '8px',
            border: '2px solid #e0e0e0',
            borderRadius: '6px',
            width: '100px',
          }}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'InfoHint used in settings page for feature explanations.',
      },
    },
  },
};

// ============================================================
// Gallery Views
// ============================================================

export const AllPositions: Story = {
  render: () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '60px',
      padding: '100px',
      placeItems: 'center'
    }}>
      <div style={{ textAlign: 'center' }}>
        <InfoHint content="Top position" position="top" />
        <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>Top</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <InfoHint content="Bottom position" position="bottom" />
        <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>Bottom</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <InfoHint content="Left position" position="left" />
        <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>Left</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <InfoHint content="Right position" position="right" />
        <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>Right</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available popup positions.',
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'center', padding: '40px' }}>
      <div style={{ textAlign: 'center' }}>
        <InfoHint content="Small size" position="top" size="small" />
        <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>Small</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <InfoHint content="Medium size" position="top" size="medium" />
        <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>Medium</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <InfoHint content="Large size" position="top" size="large" />
        <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>Large</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available icon sizes.',
      },
    },
  },
};
