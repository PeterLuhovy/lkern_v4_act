/*
 * ================================================================
 * FILE: ReportButton.stories.tsx
 * PATH: /packages/ui-components/src/components/ReportButton/ReportButton.stories.tsx
 * DESCRIPTION: Storybook stories for ReportButton component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ReportButton } from './ReportButton';

const meta: Meta<typeof ReportButton> = {
  title: 'Components/Data/ReportButton',
  component: ReportButton,
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
      description: 'Position of the floating button',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Floating button for reporting issues. Triggers external CreateIssueModal via onClick callback.',
      },
    },
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ReportButton>;

// ============================================================
// Basic States
// ============================================================

export const TopRight: Story = {
  args: {
    position: 'top-right',
    onClick: () => alert('Report button clicked! (Would open CreateIssueModal)'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Default position - top right corner.',
      },
    },
  },
};

export const TopLeft: Story = {
  args: {
    position: 'top-left',
    onClick: () => alert('Report button clicked! (Would open CreateIssueModal)'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Floating button positioned in top left corner.',
      },
    },
  },
};

export const BottomRight: Story = {
  args: {
    position: 'bottom-right',
    onClick: () => alert('Report button clicked! (Would open CreateIssueModal)'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Floating button positioned in bottom right corner.',
      },
    },
  },
};

export const BottomLeft: Story = {
  args: {
    position: 'bottom-left',
    onClick: () => alert('Report button clicked! (Would open CreateIssueModal)'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Floating button positioned in bottom left corner.',
      },
    },
  },
};

// ============================================================
// Usage Examples
// ============================================================

export const WithModal: Story = {
  render: function Render() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
      <div style={{ position: 'relative', height: '400px', border: '1px dashed var(--theme-border)', borderRadius: '8px' }}>
        <div style={{ padding: '20px' }}>
          <h3>Page Content</h3>
          <p>This is a sample page with a floating report button in the top-right corner.</p>
          <p>Click the report button to open the issue modal.</p>
        </div>

        <ReportButton
          position="top-right"
          onClick={() => setIsModalOpen(true)}
        />

        {/* Mock Modal */}
        {isModalOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
          }}>
            <div style={{
              background: 'var(--theme-input-background)',
              padding: '24px',
              borderRadius: '8px',
              maxWidth: '500px',
              width: '90%',
            }}>
              <h3 style={{ marginTop: 0 }}>Report an Issue</h3>
              <p>This would be the CreateIssueModal component.</p>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  marginTop: '16px',
                  padding: '8px 16px',
                  background: 'var(--color-brand-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Example showing ReportButton integrated with a modal (simulated CreateIssueModal).',
      },
    },
  },
};

export const MultiplePositions: Story = {
  render: () => (
    <div style={{ position: 'relative', height: '500px', border: '1px dashed var(--theme-border)', borderRadius: '8px' }}>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>All Positions Demo</h3>
        <p>Report buttons in all four corner positions.</p>
        <p style={{ fontSize: '14px', color: 'var(--theme-text-muted)', marginTop: '20px' }}>
          Note: In real usage, you would only use one button per page.
        </p>
      </div>

      <ReportButton position="top-right" onClick={() => alert('Top Right')} />
      <ReportButton position="top-left" onClick={() => alert('Top Left')} />
      <ReportButton position="bottom-right" onClick={() => alert('Bottom Right')} />
      <ReportButton position="bottom-left" onClick={() => alert('Bottom Left')} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demo showing all four corner positions simultaneously (use only one in real applications).',
      },
    },
  },
};

export const WithPageTemplate: Story = {
  render: function Render() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
      <div style={{
        position: 'relative',
        minHeight: '600px',
        background: 'var(--theme-input-background)',
        border: '1px solid var(--theme-border)',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Mock Page Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid var(--theme-border)',
          background: 'var(--color-brand-primary)',
          color: 'white',
          borderRadius: '8px 8px 0 0',
        }}>
          <h2 style={{ margin: 0 }}>Page Title</h2>
        </div>

        {/* Mock Page Content */}
        <div style={{ flex: 1, padding: '20px' }}>
          <h3>Content Area</h3>
          <p>This simulates a typical page layout with a PageTemplate component.</p>
          <p>The report button is floating in the top-right corner, always accessible.</p>
          <div style={{ marginTop: '20px', padding: '16px', background: 'var(--theme-input-border)', borderRadius: '4px' }}>
            <h4>Sample Section</h4>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div style={{ marginTop: '20px', padding: '16px', background: 'var(--theme-input-border)', borderRadius: '4px' }}>
            <h4>Another Section</h4>
            <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
        </div>

        {/* Report Button */}
        <ReportButton
          position="top-right"
          onClick={() => setIsModalOpen(true)}
        />

        {/* Mock Modal */}
        {isModalOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
          }}>
            <div style={{
              background: 'var(--theme-input-background)',
              padding: '24px',
              borderRadius: '8px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}>
              <h3 style={{ marginTop: 0 }}>Report an Issue</h3>
              <p>Found a bug or have feedback? Let us know!</p>
              <textarea
                placeholder="Describe the issue..."
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '8px',
                  border: '1px solid var(--theme-border)',
                  borderRadius: '4px',
                  resize: 'vertical',
                }}
              />
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    background: 'transparent',
                    color: 'var(--theme-text)',
                    border: '1px solid var(--theme-border)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Issue submitted!');
                    setIsModalOpen(false);
                  }}
                  style={{
                    padding: '8px 16px',
                    background: 'var(--color-brand-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Example showing ReportButton integrated into a full page layout with modal.',
      },
    },
  },
};
