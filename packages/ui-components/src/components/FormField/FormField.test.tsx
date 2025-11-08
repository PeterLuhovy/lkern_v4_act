/**
 * @file FormField.test.tsx
 * @package @l-kern/ui-components
 * @description Unit tests for FormField component
 * @version 1.0.0
 * @date 2025-10-18
 */

import { describe, it, expect, vi } from 'vitest';
import { renderWithTranslation, screen, userEvent } from '../../test-utils';
import { FormField } from './FormField';
import { Input } from '../Input';

describe('FormField', () => {
  it('renders label and input', () => {
    renderWithTranslation(
      <FormField label="Username" htmlFor="username">
        <Input id="username" />
      </FormField>
    );
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('displays required asterisk when required prop is true', () => {
    renderWithTranslation(
      <FormField label="Email" required>
        <Input />
      </FormField>
    );
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not display asterisk when required prop is false', () => {
    renderWithTranslation(
      <FormField label="Email">
        <Input />
      </FormField>
    );
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    renderWithTranslation(
      <FormField label="Email" error="Invalid email format">
        <Input />
      </FormField>
    );
    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
  });

  it('displays helper text when no error', () => {
    renderWithTranslation(
      <FormField label="Password" helperText="Min 8 characters">
        <Input />
      </FormField>
    );
    expect(screen.getByText('Min 8 characters')).toBeInTheDocument();
  });

  it('hides helper text when error is present', () => {
    renderWithTranslation(
      <FormField
        label="Password"
        helperText="Min 8 characters"
        error="Password is required"
      >
        <Input />
      </FormField>
    );
    expect(screen.queryByText('Min 8 characters')).not.toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('applies fullWidth class when fullWidth prop is true', () => {
    const { container } = renderWithTranslation(
      <FormField label="Email" fullWidth>
        <Input />
      </FormField>
    );
    const formField = container.firstChild as HTMLElement;
    expect(formField.className).toContain('formField--fullWidth');
  });

  it('links label to input via htmlFor/id', () => {
    renderWithTranslation(
      <FormField label="Email">
        <Input id="email-input" data-testid="email-input" />
      </FormField>
    );
    const input = screen.getByTestId('email-input');
    expect(input).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = renderWithTranslation(
      <FormField label="Email" className="custom-field">
        <Input />
      </FormField>
    );
    const formField = container.firstChild as HTMLElement;
    expect(formField.className).toContain('custom-field');
  });

  it('renders error with role="alert" for accessibility', () => {
    renderWithTranslation(
      <FormField label="Email" error="Error message">
        <Input />
      </FormField>
    );
    const errorElement = screen.getByRole('alert');
    expect(errorElement).toHaveTextContent('Error message');
  });

  it('can wrap different input types', () => {
    let { unmount } = renderWithTranslation(
      <FormField label="Text">
        <Input type="text" data-testid="input" />
      </FormField>
    );
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'text');

    unmount();
    ({ unmount } = renderWithTranslation(
      <FormField label="Email">
        <Input type="email" data-testid="input" />
      </FormField>
    ));
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'email');

    unmount();
    renderWithTranslation(
      <FormField label="Select">
        <select data-testid="select">
          <option>Option 1</option>
        </select>
      </FormField>
    );
    expect(screen.getByTestId('select')).toBeInTheDocument();
  });

  describe('v3.0.0 features - Real-time validation', () => {
    it('validates input and shows error message', async () => {
      const user = userEvent.setup();
      renderWithTranslation(
        <FormField
          label="Email"
          validate={(value) => {
            if (!value) return 'Email is required';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              return 'Invalid email format';
            }
            return undefined;
          }}
          reserveMessageSpace
        >
          <Input data-testid="email-input" />
        </FormField>
      );

      const input = screen.getByTestId('email-input');

      // Type invalid email
      await user.type(input, 'invalid');

      // Should show validation error
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('clears error when input becomes valid', async () => {
      const user = userEvent.setup();
      renderWithTranslation(
        <FormField
          label="Email"
          validate={(value) => {
            if (!value) return 'Email is required';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              return 'Invalid email format';
            }
            return undefined;
          }}
          reserveMessageSpace
        >
          <Input data-testid="email-input" />
        </FormField>
      );

      const input = screen.getByTestId('email-input');

      // Type invalid email
      await user.type(input, 'invalid');
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();

      // Clear and type valid email
      await user.clear(input);
      await user.type(input, 'user@example.com');

      // Error should be gone
      expect(screen.queryByText('Invalid email format')).not.toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('calls onValidChange when validation state changes', async () => {
      const user = userEvent.setup();
      const mockCallback = vi.fn();
      renderWithTranslation(
        <FormField
          label="Email"
          validate={(value) => (!value ? 'Required' : undefined)}
          onValidChange={mockCallback}
          reserveMessageSpace
        >
          <Input data-testid="email-input" />
        </FormField>
      );

      const input = screen.getByTestId('email-input');

      // Initially invalid (empty)
      expect(mockCallback).toHaveBeenCalledWith(false);

      // Type valid value
      await user.type(input, 'test@example.com');

      // Should call with true
      expect(mockCallback).toHaveBeenCalledWith(true);
    });

    it('shows required error immediately when required=true', () => {
      renderWithTranslation(
        <FormField
          label="Email"
          required
          validate={(value) => (!value ? 'Email is required' : undefined)}
          reserveMessageSpace
        >
          <Input data-testid="email-input" />
        </FormField>
      );

      // Should show error immediately (not waiting for touched)
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    it('hides error until touched when required=false', async () => {
      const user = userEvent.setup();
      renderWithTranslation(
        <FormField
          label="Email"
          validate={(value) => (!value ? 'Email is required' : undefined)}
          reserveMessageSpace
        >
          <Input data-testid="email-input" />
        </FormField>
      );

      const input = screen.getByTestId('email-input');

      // Should NOT show error initially
      expect(screen.queryByText('Email is required')).not.toBeInTheDocument();

      // Type something to touch field
      await user.type(input, 'a');
      await user.clear(input);

      // Now error should appear (field is touched)
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    it('displays success message when valid', async () => {
      const user = userEvent.setup();
      renderWithTranslation(
        <FormField
          label="Email"
          validate={(value) => {
            if (!value) return 'Required';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              return 'Invalid format';
            }
            return undefined;
          }}
          successMessage="Email is valid ✓"
          reserveMessageSpace
        >
          <Input data-testid="email-input" />
        </FormField>
      );

      const input = screen.getByTestId('email-input');

      // Type valid email
      await user.type(input, 'user@example.com');

      // Should show success message
      expect(screen.getByText(/Email is valid/)).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('prioritizes external error over internal validation error', async () => {
      const user = userEvent.setup();
      renderWithTranslation(
        <FormField
          label="Email"
          error="Server error: Email already exists"
          validate={(value) => (!value ? 'Email is required' : undefined)}
          reserveMessageSpace
        >
          <Input data-testid="email-input" />
        </FormField>
      );

      const input = screen.getByTestId('email-input');

      // Type valid value
      await user.type(input, 'user@example.com');

      // Should still show external error (not internal)
      expect(screen.getByText('Server error: Email already exists')).toBeInTheDocument();
      expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
    });
  });

  describe('v3.0.0 features - Layout & UX', () => {
    it('reserves space for message when reserveMessageSpace=true', () => {
      const { container } = renderWithTranslation(
        <FormField label="Email" reserveMessageSpace>
          <Input />
        </FormField>
      );

      // Should have reserved message area even without message
      const messageArea = container.querySelector('[class*="messageArea--reserved"]');
      expect(messageArea).toBeInTheDocument();
    });

    it('does not reserve space when reserveMessageSpace=false', () => {
      const { container } = renderWithTranslation(
        <FormField label="Email">
          <Input />
        </FormField>
      );

      // Should not have reserved class
      const messageArea = container.querySelector('[class*="messageArea--reserved"]');
      expect(messageArea).not.toBeInTheDocument();
    });

    it('uses initialValue prop', () => {
      renderWithTranslation(
        <FormField label="Name" initialValue="John Doe">
          <Input data-testid="name-input" />
        </FormField>
      );

      const input = screen.getByTestId('name-input') as HTMLInputElement;
      expect(input.value).toBe('John Doe');
    });

    it('applies inputTitle as tooltip', () => {
      renderWithTranslation(
        <FormField
          label="Email"
          inputTitle="Enter your work email address"
        >
          <Input data-testid="email-input" />
        </FormField>
      );

      const input = screen.getByTestId('email-input');
      expect(input).toHaveAttribute('title', 'Enter your work email address');
    });
  });

  describe('v3.0.0 features - Input prop injection', () => {
    it('injects value prop to child Input', async () => {
      const user = userEvent.setup();
      renderWithTranslation(
        <FormField label="Name">
          <Input data-testid="name-input" />
        </FormField>
      );

      const input = screen.getByTestId('name-input') as HTMLInputElement;

      // Type value
      await user.type(input, 'John');

      // Value should be injected
      expect(input.value).toBe('John');
    });

    it('injects hasError prop when field has error', () => {
      renderWithTranslation(
        <FormField
          label="Email"
          validate={(value) => (!value ? 'Required' : undefined)}
          required
        >
          <Input data-testid="email-input" />
        </FormField>
      );

      const input = screen.getByTestId('email-input');

      // Initially has error (empty + required)
      // CSS Modules generates hashed classes like "_input--error_0d9f86"
      expect(input.className).toContain('input--error');
    });

    it('injects isValid prop when field is valid', async () => {
      const user = userEvent.setup();
      renderWithTranslation(
        <FormField
          label="Email"
          validate={(value) => {
            if (!value) return 'Required';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              return 'Invalid';
            }
            return undefined;
          }}
        >
          <Input data-testid="email-input" />
        </FormField>
      );

      const input = screen.getByTestId('email-input');

      // Type valid email
      await user.type(input, 'user@example.com');

      // Should have valid class (CSS Modules hash)
      expect(input.className).toContain('input--valid');
    });

    it('injects fullWidth prop to child Input', () => {
      renderWithTranslation(
        <FormField label="Name" fullWidth>
          <Input data-testid="name-input" />
        </FormField>
      );

      const input = screen.getByTestId('name-input');
      // CSS Modules hash
      expect(input.className).toContain('input--fullWidth');
    });
  });

  describe('v3.1.0 features - Controlled mode', () => {
    it('uses controlled value from parent', () => {
      renderWithTranslation(
        <FormField
          label="Keyword"
          value="test-value"
          onChange={vi.fn()}
        >
          <Input data-testid="keyword-input" />
        </FormField>
      );

      const input = screen.getByTestId('keyword-input') as HTMLInputElement;
      expect(input.value).toBe('test-value');
    });

    it('calls parent onChange handler in controlled mode', async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      renderWithTranslation(
        <FormField
          label="Keyword"
          value=""
          onChange={mockOnChange}
        >
          <Input data-testid="keyword-input" />
        </FormField>
      );

      const input = screen.getByTestId('keyword-input');
      await user.type(input, 'a');

      expect(mockOnChange).toHaveBeenCalled();
    });

    it('does not manage internal state in controlled mode', () => {
      const { rerender } = renderWithTranslation(
        <FormField
          label="Keyword"
          value="initial"
          onChange={vi.fn()}
        >
          <Input data-testid="keyword-input" />
        </FormField>
      );

      const input = screen.getByTestId('keyword-input') as HTMLInputElement;
      expect(input.value).toBe('initial');

      // Update controlled value
      rerender(
        <FormField
          label="Keyword"
          value="updated"
          onChange={vi.fn()}
        >
          <Input data-testid="keyword-input" />
        </FormField>
      );

      // Value should update immediately (no internal state)
      expect(input.value).toBe('updated');
    });

    it('uncontrolled mode still works (backward compatibility)', async () => {
      const user = userEvent.setup();

      renderWithTranslation(
        <FormField label="Name" initialValue="John">
          <Input data-testid="name-input" />
        </FormField>
      );

      const input = screen.getByTestId('name-input') as HTMLInputElement;
      expect(input.value).toBe('John');

      // Type more text
      await user.type(input, ' Doe');
      expect(input.value).toBe('John Doe');
    });

    it('controlled mode with validation works correctly', async () => {
      const mockOnChange = vi.fn();

      // Note: In controlled mode, validation runs but doesn't show error until touched
      // Need to use required prop or provide external error to show immediately
      renderWithTranslation(
        <FormField
          label="Email"
          value="invalid"
          onChange={mockOnChange}
          validate={(value) => {
            if (!value) return 'Required';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              return 'Invalid email';
            }
            return undefined;
          }}
          required  // Make field show error immediately
          reserveMessageSpace
        >
          <Input data-testid="email-input" />
        </FormField>
      );

      // Should show validation error (because required=true)
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    it('controlled mode with external error shows error correctly', () => {
      renderWithTranslation(
        <FormField
          label="Keyword"
          value="wrong"
          onChange={vi.fn()}
          error="Incorrect keyword"
          reserveMessageSpace
        >
          <Input data-testid="keyword-input" />
        </FormField>
      );

      expect(screen.getByText('Incorrect keyword')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('controlled mode clears error when external error removed', () => {
      const { rerender } = renderWithTranslation(
        <FormField
          label="Keyword"
          value="test"
          onChange={vi.fn()}
          error="Wrong keyword"
          reserveMessageSpace
        >
          <Input data-testid="keyword-input" />
        </FormField>
      );

      expect(screen.getByText('Wrong keyword')).toBeInTheDocument();

      // Remove error
      rerender(
        <FormField
          label="Keyword"
          value="test"
          onChange={vi.fn()}
          error={undefined}
          reserveMessageSpace
        >
          <Input data-testid="keyword-input" />
        </FormField>
      );

      expect(screen.queryByText('Wrong keyword')).not.toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
