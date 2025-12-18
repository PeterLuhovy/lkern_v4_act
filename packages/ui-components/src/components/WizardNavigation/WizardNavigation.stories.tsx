/*
 * ================================================================
 * FILE: WizardNavigation.stories.tsx
 * PATH: /packages/ui-components/src/components/WizardNavigation/WizardNavigation.stories.tsx
 * DESCRIPTION: Storybook stories for WizardNavigation component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { WizardNavigation } from './WizardNavigation';

const meta: Meta<typeof WizardNavigation> = {
  title: 'Components/Utility/WizardNavigation',
  component: WizardNavigation,
  tags: ['autodocs'],
  argTypes: {
    onPrevious: { action: 'previous clicked' },
    onNext: { action: 'next clicked' },
    onComplete: { action: 'complete clicked' },
    canGoPrevious: {
      control: 'boolean',
      description: 'Whether can go to previous step',
    },
    canGoNext: {
      control: 'boolean',
      description: 'Whether can go to next step',
    },
    isLastStep: {
      control: 'boolean',
      description: 'Whether current step is last',
    },
    isSubmitting: {
      control: 'boolean',
      description: 'Whether wizard is submitting',
    },
    previousLabel: {
      control: 'text',
      description: 'Custom label for previous button',
    },
    nextLabel: {
      control: 'text',
      description: 'Custom label for next button',
    },
    completeLabel: {
      control: 'text',
      description: 'Custom label for complete button',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Navigation buttons for multi-step wizards with previous, next, and complete actions.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof WizardNavigation>;

// ============================================================
// Basic States
// ============================================================

export const FirstStep: Story = {
  args: {
    onPrevious: undefined, // No previous button on first step
    onNext: () => console.log('Next clicked'),
    canGoPrevious: false,
    canGoNext: true,
    isLastStep: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'First step - only Next button is shown.',
      },
    },
  },
};

export const MiddleStep: Story = {
  args: {
    onPrevious: () => console.log('Previous clicked'),
    onNext: () => console.log('Next clicked'),
    canGoPrevious: true,
    canGoNext: true,
    isLastStep: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Middle step - both Previous and Next buttons are shown.',
      },
    },
  },
};

export const LastStep: Story = {
  args: {
    onPrevious: () => console.log('Previous clicked'),
    onComplete: () => console.log('Complete clicked'),
    canGoPrevious: true,
    canGoNext: true,
    isLastStep: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Last step - Previous and Complete buttons are shown.',
      },
    },
  },
};

// ============================================================
// Validation States
// ============================================================

export const NextDisabled: Story = {
  args: {
    onPrevious: () => console.log('Previous clicked'),
    onNext: () => console.log('Next clicked'),
    canGoPrevious: true,
    canGoNext: false, // Form validation failed
    isLastStep: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Next button disabled due to form validation failure.',
      },
    },
  },
};

export const Submitting: Story = {
  args: {
    onPrevious: () => console.log('Previous clicked'),
    onComplete: () => console.log('Complete clicked'),
    canGoPrevious: true,
    canGoNext: true,
    isLastStep: true,
    isSubmitting: true, // Showing loading state
  },
  parameters: {
    docs: {
      description: {
        story: 'Submitting state - Complete button shows loading spinner.',
      },
    },
  },
};

// ============================================================
// Custom Labels
// ============================================================

export const CustomLabels: Story = {
  args: {
    onPrevious: () => console.log('Previous clicked'),
    onNext: () => console.log('Next clicked'),
    canGoPrevious: true,
    canGoNext: true,
    isLastStep: false,
    previousLabel: 'Go Back',
    nextLabel: 'Continue',
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom button labels instead of default translations.',
      },
    },
  },
};

export const CustomCompleteLabel: Story = {
  args: {
    onPrevious: () => console.log('Previous clicked'),
    onComplete: () => console.log('Complete clicked'),
    canGoPrevious: true,
    canGoNext: true,
    isLastStep: true,
    completeLabel: 'Create Account',
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom complete button label for specific action.',
      },
    },
  },
};

// ============================================================
// Edge Cases
// ============================================================

export const OnlyNextButton: Story = {
  args: {
    onNext: () => console.log('Next clicked'),
    canGoNext: true,
    isLastStep: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Only Next button (no Previous handler provided).',
      },
    },
  },
};

export const OnlyCompleteButton: Story = {
  args: {
    onComplete: () => console.log('Complete clicked'),
    canGoNext: true,
    isLastStep: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Only Complete button (no Previous handler provided).',
      },
    },
  },
};

// ============================================================
// Gallery View
// ============================================================

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4 style={{ marginBottom: '8px' }}>First Step</h4>
        <WizardNavigation
          onNext={() => console.log('Next')}
          canGoNext={true}
          isLastStep={false}
        />
      </div>
      <div>
        <h4 style={{ marginBottom: '8px' }}>Middle Step</h4>
        <WizardNavigation
          onPrevious={() => console.log('Previous')}
          onNext={() => console.log('Next')}
          canGoPrevious={true}
          canGoNext={true}
          isLastStep={false}
        />
      </div>
      <div>
        <h4 style={{ marginBottom: '8px' }}>Last Step</h4>
        <WizardNavigation
          onPrevious={() => console.log('Previous')}
          onComplete={() => console.log('Complete')}
          canGoPrevious={true}
          canGoNext={true}
          isLastStep={true}
        />
      </div>
      <div>
        <h4 style={{ marginBottom: '8px' }}>Submitting</h4>
        <WizardNavigation
          onPrevious={() => console.log('Previous')}
          onComplete={() => console.log('Complete')}
          canGoPrevious={true}
          canGoNext={true}
          isLastStep={true}
          isSubmitting={true}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All navigation states in different wizard steps.',
      },
    },
  },
};
