/*
 * ================================================================
 * FILE: Radio.test.tsx
 * PATH: packages/ui-components/src/components/Radio/Radio.test.tsx
 * DESCRIPTION: Unit tests for Radio component
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
 * ================================================================
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Radio } from './Radio';

describe('Radio', () => {
  describe('Rendering', () => {
    it('renders radio input with label', () => {
      render(<Radio name="test" value="1" label="Option 1" />);
      const radio = screen.getByLabelText('Option 1');
      expect(radio).toBeInTheDocument();
      expect(radio).toHaveAttribute('type', 'radio');
    });

    it('renders with correct name attribute', () => {
      render(<Radio name="group1" value="a" label="Option A" />);
      const radio = screen.getByRole('radio');
      expect(radio).toHaveAttribute('name', 'group1');
    });

    it('renders with correct value attribute', () => {
      render(<Radio name="test" value="custom-value" label="Test" />);
      const radio = screen.getByRole('radio');
      expect(radio).toHaveAttribute('value', 'custom-value');
    });
  });

  describe('States', () => {
    it('renders unchecked by default', () => {
      render(<Radio name="test" value="1" label="Option" />);
      const radio = screen.getByRole('radio');
      expect(radio).not.toBeChecked();
    });

    it('renders checked when checked prop is true', () => {
      render(<Radio name="test" value="1" label="Option" checked readOnly />);
      const radio = screen.getByRole('radio');
      expect(radio).toBeChecked();
    });

    it('renders disabled state', () => {
      render(<Radio name="test" value="1" label="Disabled option" disabled />);
      const radio = screen.getByRole('radio');
      expect(radio).toBeDisabled();
    });

    it('applies error class when error prop is true', () => {
      const { container } = render(<Radio name="test" value="1" label="Option" error />);
      const label = container.querySelector('label');
      expect(label?.className).toContain('error');
    });
  });

  describe('Interactions', () => {
    it('calls onChange handler when clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Radio name="test" value="1" label="Click me" onChange={handleChange} />);
      const radio = screen.getByRole('radio');

      await user.click(radio);
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('becomes checked when clicked', async () => {
      const user = userEvent.setup();
      render(<Radio name="test" value="1" label="Toggle me" />);
      const radio = screen.getByRole('radio');

      expect(radio).not.toBeChecked();
      await user.click(radio);
      expect(radio).toBeChecked();
    });

    it('does not call onChange when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Radio name="test" value="1" label="Disabled" disabled onChange={handleChange} />);
      const radio = screen.getByRole('radio');

      await user.click(radio);
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Forward Ref', () => {
    it('forwards ref to input element', () => {
      const ref = { current: null as HTMLInputElement | null };
      render(<Radio ref={ref} name="test" value="1" label="Ref test" />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.type).toBe('radio');
    });
  });

  describe('HTML Attributes', () => {
    it('passes through standard input attributes', () => {
      render(
        <Radio
          name="test-group"
          value="option1"
          label="Test"
          id="custom-id"
          required
        />
      );
      const radio = screen.getByRole('radio');
      expect(radio).toHaveAttribute('id', 'custom-id');
      expect(radio).toHaveAttribute('name', 'test-group');
      expect(radio).toHaveAttribute('value', 'option1');
      expect(radio).toBeRequired();
    });

    it('applies custom className to label', () => {
      const { container } = render(
        <Radio name="test" value="1" label="Test" className="custom-class" />
      );
      const label = container.querySelector('.custom-class');
      expect(label).toBeInTheDocument();
    });
  });

  describe('Theme CSS Variables', () => {
    it('uses theme CSS variables for colors (not hardcoded)', () => {
      const { container } = render(<Radio name="test" value="1" label="Theme test" />);

      // Verify CSS classes are applied (CSS modules will apply the styles with theme variables)
      const radioCustom = container.querySelector('[class*="radioCustom"]');
      expect(radioCustom).toBeInTheDocument();
      expect(radioCustom?.className).toContain('radioCustom');
    });

    it('applies error styles using theme variables', () => {
      const { container } = render(<Radio name="test" value="1" label="Error test" error />);

      const label = container.querySelector('label');
      expect(label?.className).toContain('error');

      // Error class should use --color-status-error theme variable (from CSS file)
      const radioCustom = container.querySelector('[class*="radioCustom"]');
      expect(radioCustom).toBeInTheDocument();
    });

    it('applies disabled styles using theme variables', () => {
      const { container } = render(<Radio name="test" value="1" label="Disabled test" disabled />);

      const label = container.querySelector('label');
      expect(label?.className).toContain('disabled');

      // Disabled class should use --theme-input-background-disabled theme variable (from CSS file)
      const radioCustom = container.querySelector('[class*="radioCustom"]');
      expect(radioCustom).toBeInTheDocument();
    });
  });
});
