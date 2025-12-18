/*
 * ================================================================
 * FILE: WizardProgress.stories.tsx
 * PATH: /packages/ui-components/src/components/WizardProgress/WizardProgress.stories.tsx
 * DESCRIPTION: Storybook stories for WizardProgress component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { WizardProgress } from './WizardProgress';

const meta: Meta<typeof WizardProgress> = {
  title: 'Components/Utility/WizardProgress',
  component: WizardProgress,
  tags: ['autodocs'],
  argTypes: {
    currentStep: {
      control: { type: 'number', min: 0, max: 4 },
      description: 'Current step (0-based)',
    },
    totalSteps: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Total number of steps',
    },
    variant: {
      control: 'select',
      options: ['dots', 'bar', 'numbers'],
      description: 'Progress display variant',
    },
    currentStepTitle: {
      control: 'text',
      description: 'Current step title',
    },
    stepTitles: {
      control: 'object',
      description: 'Step titles array (optional)',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Progress indicator for multi-step wizards with three visual variants: dots, bar, and numbers.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof WizardProgress>;

// ============================================================
// Basic Variants
// ============================================================

export const Dots: Story = {
  args: {
    currentStep: 1,
    totalSteps: 5,
    variant: 'dots',
    currentStepTitle: 'Basic Information',
  },
};

export const Bar: Story = {
  args: {
    currentStep: 2,
    totalSteps: 5,
    variant: 'bar',
    currentStepTitle: 'Contact Details',
  },
};

export const Numbers: Story = {
  args: {
    currentStep: 3,
    totalSteps: 5,
    variant: 'numbers',
    currentStepTitle: 'Review & Confirm',
  },
};

// ============================================================
// Different Steps
// ============================================================

export const FirstStep: Story = {
  args: {
    currentStep: 0,
    totalSteps: 5,
    variant: 'dots',
    currentStepTitle: 'Welcome',
  },
};

export const MiddleStep: Story = {
  args: {
    currentStep: 2,
    totalSteps: 5,
    variant: 'dots',
    currentStepTitle: 'Address Information',
  },
};

export const LastStep: Story = {
  args: {
    currentStep: 4,
    totalSteps: 5,
    variant: 'dots',
    currentStepTitle: 'Confirmation',
  },
};

// ============================================================
// Different Step Counts
// ============================================================

export const ThreeSteps: Story = {
  args: {
    currentStep: 1,
    totalSteps: 3,
    variant: 'dots',
    currentStepTitle: 'Step 2 of 3',
  },
};

export const SevenSteps: Story = {
  args: {
    currentStep: 3,
    totalSteps: 7,
    variant: 'dots',
    currentStepTitle: 'Step 4 of 7',
  },
};

// ============================================================
// Gallery View
// ============================================================

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4 style={{ marginBottom: '8px' }}>Dots Variant</h4>
        <WizardProgress
          currentStep={2}
          totalSteps={5}
          variant="dots"
          currentStepTitle="Step 3 - Review"
        />
      </div>
      <div>
        <h4 style={{ marginBottom: '8px' }}>Bar Variant</h4>
        <WizardProgress
          currentStep={2}
          totalSteps={5}
          variant="bar"
          currentStepTitle="Step 3 - Review"
        />
      </div>
      <div>
        <h4 style={{ marginBottom: '8px' }}>Numbers Variant</h4>
        <WizardProgress
          currentStep={2}
          totalSteps={5}
          variant="numbers"
          currentStepTitle="Step 3 - Review"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All three progress variants showing the same step (3 of 5).',
      },
    },
  },
};

export const ProgressSequence: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {[0, 1, 2, 3, 4].map((step) => (
        <WizardProgress
          key={step}
          currentStep={step}
          totalSteps={5}
          variant="dots"
          currentStepTitle={`Step ${step + 1}`}
        />
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Progress sequence showing all steps from first to last.',
      },
    },
  },
};
