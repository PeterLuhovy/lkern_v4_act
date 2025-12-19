/*
 * ================================================================
 * FILE: IssueTypeSelectModal.stories.tsx
 * PATH: /packages/ui-components/src/components/IssueTypeSelectModal/IssueTypeSelectModal.stories.tsx
 * DESCRIPTION: Storybook stories for IssueTypeSelectModal component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { IssueTypeSelectModal } from './IssueTypeSelectModal';

const meta: Meta<typeof IssueTypeSelectModal> = {
  title: 'Components/Modals/IssueTypeSelectModal',
  component: IssueTypeSelectModal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls modal visibility',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Small modal with 4 buttons to select issue type before opening CreateIssueModal. Clean 2x2 grid layout.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof IssueTypeSelectModal>;

// ============================================================
// Basic Example
// ============================================================

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSelectType: (type) => console.log('Selected type:', type),
  },
};

// ============================================================
// Filtered Types
// ============================================================

export const BugsOnly: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSelectType: (type) => console.log('Selected type:', type),
    availableTypes: ['bug'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Restrict to bugs only (e.g., for error boundary error reporting).',
      },
    },
  },
};

export const BugsAndQuestions: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSelectType: (type) => console.log('Selected type:', type),
    availableTypes: ['bug', 'question'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic users might only report bugs or ask questions.',
      },
    },
  },
};

export const FeaturesAndImprovements: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSelectType: (type) => console.log('Selected type:', type),
    availableTypes: ['feature', 'improvement'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Product managers might focus on feature requests and improvements.',
      },
    },
  },
};

// ============================================================
// Interactive Example
// ============================================================

export const Interactive: Story = {
  render: () => {
    const handleSelectType = (type: 'bug' | 'feature' | 'improvement' | 'question') => {
      alert(`Selected: ${type}\n\nIn real app, this would:\n1. Close IssueTypeSelectModal\n2. Open CreateIssueModal with type pre-selected`);
    };

    return (
      <IssueTypeSelectModal
        isOpen={true}
        onClose={() => console.log('Modal closed')}
        onSelectType={handleSelectType}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Click any issue type button to see the workflow.',
      },
    },
  },
};

// ============================================================
// Gallery
// ============================================================

export const IssueTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
      <h3>Issue Type Buttons</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '600px' }}>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}><span role="img" aria-label="bug">🐛</span></div>
          <h4>Bug</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Something is broken or not working as expected.</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}><span role="img" aria-label="sparkles">✨</span></div>
          <h4>Feature</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Request a new feature or capability.</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}><span role="img" aria-label="trending up">📈</span></div>
          <h4>Improvement</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Enhancement to existing functionality.</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}><span role="img" aria-label="question">❓</span></div>
          <h4>Question</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Ask for help or clarification.</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available issue types with descriptions.',
      },
    },
  },
};

export const Workflow: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
      <h3>Modal Workflow</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center' }}>
        <div style={{ padding: '16px', border: '2px solid #9c27b0', borderRadius: '8px', textAlign: 'center', minWidth: '150px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Step 1</div>
          <div style={{ fontSize: '14px' }}>User clicks "Report Issue"</div>
        </div>
        <div style={{ fontSize: '24px', color: '#9c27b0' }}>→</div>
        <div style={{ padding: '16px', border: '2px solid #9c27b0', borderRadius: '8px', textAlign: 'center', minWidth: '150px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Step 2</div>
          <div style={{ fontSize: '14px' }}>IssueTypeSelectModal opens</div>
        </div>
        <div style={{ fontSize: '24px', color: '#9c27b0' }}>→</div>
        <div style={{ padding: '16px', border: '2px solid #9c27b0', borderRadius: '8px', textAlign: 'center', minWidth: '150px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Step 3</div>
          <div style={{ fontSize: '14px' }}>User selects type (bug/feature/etc)</div>
        </div>
        <div style={{ fontSize: '24px', color: '#9c27b0' }}>→</div>
        <div style={{ padding: '16px', border: '2px solid #9c27b0', borderRadius: '8px', textAlign: 'center', minWidth: '150px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Step 4</div>
          <div style={{ fontSize: '14px' }}>CreateIssueModal opens with type pre-selected</div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Two-step modal workflow for creating issues.',
      },
    },
  },
};
