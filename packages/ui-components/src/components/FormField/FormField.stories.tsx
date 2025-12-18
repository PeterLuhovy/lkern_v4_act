/*
 * ================================================================
 * FILE: FormField.stories.tsx
 * PATH: /packages/ui-components/src/components/FormField/FormField.stories.tsx
 * DESCRIPTION: Storybook stories for FormField component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FormField } from './FormField';
import { Input } from '../Input';
import { Textarea } from '../Textarea';
import { Select } from '../Select';

const meta: Meta<typeof FormField> = {
  title: 'Components/Forms/FormField',
  component: FormField,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text to display above input',
    },
    required: {
      control: 'boolean',
      description: 'Show required asterisk (*) next to label',
    },
    error: {
      control: 'text',
      description: 'External error message (overrides internal validation)',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display below input (when no error)',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Make field full width of container',
    },
    reserveMessageSpace: {
      control: 'boolean',
      description: 'Reserve space for validation messages (prevents layout shift)',
    },
    maxLength: {
      control: 'number',
      description: 'Maximum character length (shows character counter)',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Enhanced form field with built-in real-time validation. Supports both controlled and uncontrolled modes. Features include validation, character counter, helper text, and error messages.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormField>;

// ============================================================
// Basic Variants
// ============================================================

export const Default: Story = {
  args: {
    label: 'Email',
    children: <Input type="email" placeholder="user@example.com" />,
  },
};

export const Required: Story = {
  args: {
    label: 'Email',
    required: true,
    children: <Input type="email" placeholder="user@example.com" />,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Email',
    helperText: 'We will never share your email',
    children: <Input type="email" placeholder="user@example.com" />,
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    error: 'Invalid email address',
    children: <Input type="email" placeholder="user@example.com" />,
  },
};

export const FullWidth: Story = {
  args: {
    label: 'Email',
    fullWidth: true,
    children: <Input type="email" placeholder="user@example.com" />,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
};

export const ReservedMessageSpace: Story = {
  args: {
    label: 'Email',
    reserveMessageSpace: true,
    children: <Input type="email" placeholder="user@example.com" />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Reserved space prevents layout shift when error messages appear/disappear.',
      },
    },
  },
};

// ============================================================
// With Different Input Types
// ============================================================

export const WithTextInput: Story = {
  args: {
    label: 'Full Name',
    required: true,
    helperText: 'Enter your first and last name',
    children: <Input type="text" placeholder="John Doe" />,
  },
};

export const WithTextarea: Story = {
  args: {
    label: 'Description',
    helperText: 'Provide a detailed description',
    children: <Textarea rows={4} placeholder="Enter description..." />,
  },
};

export const WithSelect: Story = {
  args: {
    label: 'Country',
    required: true,
    children: (
      <Select
        options={[
          { value: 'sk', label: 'Slovakia' },
          { value: 'cz', label: 'Czech Republic' },
          { value: 'pl', label: 'Poland' },
        ]}
        placeholder="Choose country"
      />
    ),
  },
};

// ============================================================
// Advanced Features
// ============================================================

export const WithCharacterCounter: Story = {
  args: {
    label: 'Comment',
    maxLength: 200,
    helperText: 'Add a brief comment',
    children: <Textarea rows={4} placeholder="Enter comment..." maxLength={200} />,
  },
};

export const WithLabelHint: Story = {
  args: {
    label: 'Password',
    labelHint: 'Password must be at least 8 characters long and contain uppercase, lowercase, and numbers.',
    required: true,
    children: <Input type="password" placeholder="Enter password" />,
  },
};

export const WithValidation: Story = {
  render: () => {
    const [isValid, setIsValid] = useState(false);

    return (
      <FormField
        label="Email"
        required
        validate={(value) => {
          if (!value) return 'Email is required';
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return 'Invalid email format';
          }
          return undefined;
        }}
        onValidChange={setIsValid}
        successMessage="Email is valid"
        reserveMessageSpace
      >
        <Input type="email" placeholder="user@example.com" />
      </FormField>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Real-time validation with success message when valid.',
      },
    },
  },
};

export const ControlledMode: Story = {
  render: () => {
    const [keyword, setKeyword] = useState('');
    const [showError, setShowError] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value);
      setShowError(false);
    };

    const handleBlur = () => {
      if (keyword !== 'secret') {
        setShowError(true);
      }
    };

    return (
      <FormField
        label="Keyword"
        error={showError ? 'Wrong keyword (hint: try "secret")' : undefined}
        value={keyword}
        onChange={handleChange}
        reserveMessageSpace
      >
        <Input placeholder="Type keyword" onBlur={handleBlur} />
      </FormField>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Controlled mode where parent component manages the value state.',
      },
    },
  },
};

// ============================================================
// Gallery Views
// ============================================================

export const CompleteForm: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
      <FormField
        label="Full Name"
        required
        reserveMessageSpace
      >
        <Input type="text" placeholder="John Doe" />
      </FormField>

      <FormField
        label="Email"
        required
        helperText="We will never share your email"
        reserveMessageSpace
      >
        <Input type="email" placeholder="user@example.com" />
      </FormField>

      <FormField
        label="Country"
        required
        reserveMessageSpace
      >
        <Select
          options={[
            { value: 'sk', label: 'Slovakia' },
            { value: 'cz', label: 'Czech Republic' },
            { value: 'pl', label: 'Poland' },
          ]}
          placeholder="Choose country"
        />
      </FormField>

      <FormField
        label="Comment"
        maxLength={500}
        helperText="Optional feedback or notes"
        reserveMessageSpace
      >
        <Textarea rows={4} placeholder="Enter comment..." maxLength={500} />
      </FormField>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of a complete form using FormField wrapper.',
      },
    },
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
      <FormField
        label="Default state"
        reserveMessageSpace
      >
        <Input placeholder="Enter text" />
      </FormField>

      <FormField
        label="With helper text"
        helperText="This is a helper text"
        reserveMessageSpace
      >
        <Input placeholder="Enter text" />
      </FormField>

      <FormField
        label="With error"
        error="This field is required"
        reserveMessageSpace
      >
        <Input placeholder="Enter text" />
      </FormField>

      <FormField
        label="Required field"
        required
        reserveMessageSpace
      >
        <Input placeholder="Enter text" />
      </FormField>

      <FormField
        label="With character counter"
        maxLength={100}
        reserveMessageSpace
      >
        <Input placeholder="Enter text" maxLength={100} />
      </FormField>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available FormField states.',
      },
    },
  },
};
