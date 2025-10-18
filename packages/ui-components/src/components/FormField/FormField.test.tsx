/**
 * @file FormField.test.tsx
 * @package @l-kern/ui-components
 * @description Unit tests for FormField component
 * @version 1.0.0
 * @date 2025-10-18
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormField } from './FormField';
import { Input } from '../Input';

describe('FormField', () => {
  it('renders label and input', () => {
    render(
      <FormField label="Username" htmlFor="username">
        <Input id="username" />
      </FormField>
    );
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('displays required asterisk when required prop is true', () => {
    render(
      <FormField label="Email" required>
        <Input />
      </FormField>
    );
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not display asterisk when required prop is false', () => {
    render(
      <FormField label="Email">
        <Input />
      </FormField>
    );
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    render(
      <FormField label="Email" error="Invalid email format">
        <Input />
      </FormField>
    );
    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
  });

  it('displays helper text when no error', () => {
    render(
      <FormField label="Password" helperText="Min 8 characters">
        <Input />
      </FormField>
    );
    expect(screen.getByText('Min 8 characters')).toBeInTheDocument();
  });

  it('hides helper text when error is present', () => {
    render(
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
    const { container } = render(
      <FormField label="Email" fullWidth>
        <Input />
      </FormField>
    );
    const formField = container.firstChild as HTMLElement;
    expect(formField.className).toContain('formField--fullWidth');
  });

  it('links label to input via htmlFor/id', () => {
    render(
      <FormField label="Email" htmlFor="email-input">
        <Input id="email-input" />
      </FormField>
    );
    const label = screen.getByText('Email');
    expect(label).toHaveAttribute('for', 'email-input');
  });

  it('applies custom className', () => {
    const { container } = render(
      <FormField label="Email" className="custom-field">
        <Input />
      </FormField>
    );
    const formField = container.firstChild as HTMLElement;
    expect(formField.className).toContain('custom-field');
  });

  it('renders error with role="alert" for accessibility', () => {
    render(
      <FormField label="Email" error="Error message">
        <Input />
      </FormField>
    );
    const errorElement = screen.getByRole('alert');
    expect(errorElement).toHaveTextContent('Error message');
  });

  it('can wrap different input types', () => {
    const { rerender } = render(
      <FormField label="Text">
        <Input type="text" data-testid="input" />
      </FormField>
    );
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'text');

    rerender(
      <FormField label="Email">
        <Input type="email" data-testid="input" />
      </FormField>
    );
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'email');

    rerender(
      <FormField label="Select">
        <select data-testid="select">
          <option>Option 1</option>
        </select>
      </FormField>
    );
    expect(screen.getByTestId('select')).toBeInTheDocument();
  });
});
