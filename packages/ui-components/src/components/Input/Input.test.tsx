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

  // NOTE: Input v2.0.0 no longer has error/helperText props
  // These features are now in FormField component
  // See FormField.test.tsx for validation tests

  it('applies error class when hasError prop is true', () => {
    render(<Input hasError data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input.className).toContain('input--error');
  });

  it('applies valid class when isValid prop is true', () => {
    render(<Input isValid data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input.className).toContain('input--valid');
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

  it('sets aria-invalid when hasError is true', () => {
    render(<Input hasError data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-invalid to false when hasError is false', () => {
    render(<Input data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveAttribute('aria-invalid', 'false');
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

    it('updates placeholder when translation changes', () => {
      const { rerender } = render(<Input placeholder="Enter email" data-testid="input" />);
      expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();

      // Simulate language change - parent passes new translated placeholder
      rerender(<Input placeholder="Zadajte email" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('placeholder', 'Zadajte email');
      expect(input).not.toHaveAttribute('placeholder', 'Enter email');
    });

    // NOTE: Error/helper text translations are tested in FormField.test.tsx
    // Input v2.0.0 no longer handles error/helperText - that's FormField's job
  });
});
