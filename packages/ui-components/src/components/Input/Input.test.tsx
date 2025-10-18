/**
 * @file Input.test.tsx
 * @package @l-kern/ui-components
 * @description Unit tests for Input component
 * @version 1.0.0
 * @date 2025-10-18
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('renders input element', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('displays helper text when no error', () => {
    render(<Input helperText="Enter at least 8 characters" />);
    expect(screen.getByText('Enter at least 8 characters')).toBeInTheDocument();
  });

  it('hides helper text when error is present', () => {
    render(<Input helperText="Helper text" error="Error message" />);
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('applies error class when error prop is provided', () => {
    render(<Input error="Error" data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input.className).toContain('input--error');
  });

  it('applies fullWidth class when fullWidth prop is true', () => {
    render(<Input fullWidth data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input.className).toContain('input--fullWidth');
  });

  it('forwards ref to input element', () => {
    const ref = vi.fn();
    render(<Input ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('handles user input', async () => {
    const user = userEvent.setup();
    render(<Input data-testid="input" />);
    const input = screen.getByTestId('input') as HTMLInputElement;

    await user.type(input, 'Hello World');
    expect(input.value).toBe('Hello World');
  });

  it('supports different input types', () => {
    const { rerender } = render(<Input type="email" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'password');

    rerender(<Input type="number" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'number');
  });

  it('disables input when disabled prop is true', () => {
    render(<Input disabled data-testid="input" />);
    expect(screen.getByTestId('input')).toBeDisabled();
  });

  it('sets aria-invalid when error is present', () => {
    render(<Input error="Error" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-describedby for error message', () => {
    render(<Input id="email" error="Invalid email" data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('aria-describedby', 'email-error');
  });

  it('sets aria-describedby for helper text', () => {
    render(<Input id="password" helperText="Min 8 chars" data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('aria-describedby', 'password-helper');
  });

  it('applies custom className', () => {
    render(<Input className="custom-input" data-testid="input" />);
    expect(screen.getByTestId('input').className).toContain('custom-input');
  });

  it('forwards HTML input attributes', () => {
    render(
      <Input
        name="username"
        maxLength={20}
        required
        data-testid="input"
      />
    );
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('name', 'username');
    expect(input).toHaveAttribute('maxLength', '20');
    expect(input).toBeRequired();
  });

  describe('Translation Support', () => {
    it('renders translated placeholder text', () => {
      const translatedPlaceholder = 'Zadajte email'; // Slovak for "Enter email"
      render(<Input placeholder={translatedPlaceholder} />);

      expect(screen.getByPlaceholderText('Zadajte email')).toBeInTheDocument();
    });

    it('renders translated error message', () => {
      const translatedError = 'Toto pole je povinné'; // Slovak for "This field is required"
      render(<Input error={translatedError} />);

      expect(screen.getByText('Toto pole je povinné')).toBeInTheDocument();
    });

    it('renders translated helper text', () => {
      const translatedHelper = 'Zadajte aspoň 8 znakov'; // Slovak for "Enter at least 8 characters"
      render(<Input helperText={translatedHelper} />);

      expect(screen.getByText('Zadajte aspoň 8 znakov')).toBeInTheDocument();
    });

    it('updates placeholder when translation changes', () => {
      const { rerender } = render(<Input placeholder="Enter email" data-testid="input" />);
      expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();

      // Simulate language change - parent passes new translated placeholder
      rerender(<Input placeholder="Zadajte email" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('placeholder', 'Zadajte email');
      expect(input).not.toHaveAttribute('placeholder', 'Enter email');
    });

    it('updates error message when translation changes', () => {
      const { rerender } = render(<Input error="Required" />);
      expect(screen.getByText('Required')).toBeInTheDocument();

      // Simulate language change
      rerender(<Input error="Povinné" />);
      expect(screen.queryByText('Required')).not.toBeInTheDocument();
      expect(screen.getByText('Povinné')).toBeInTheDocument();
    });
  });
});
