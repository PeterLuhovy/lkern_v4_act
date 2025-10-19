/**
 * @file Button.test.tsx
 * @package @l-kern/ui-components
 * @description Unit tests for Button component
 * @version 1.0.0
 * @date 2025-10-18
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies primary variant class', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('button--primary');
  });

  it('applies secondary variant class by default', () => {
    render(<Button>Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('button--secondary');
  });

  it('applies danger variant class', () => {
    render(<Button variant="danger">Danger</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('button--danger');
  });

  it('applies small size class', () => {
    render(<Button size="small">Small</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('button--small');
  });

  it('applies medium size class by default', () => {
    render(<Button>Medium</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('button--medium');
  });

  it('applies large size class', () => {
    render(<Button size="large">Large</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('button--large');
  });

  it('applies fullWidth class when fullWidth prop is true', () => {
    render(<Button fullWidth>Full Width</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('button--fullWidth');
  });

  it('disables button and shows loading spinner when loading', () => {
    render(<Button loading data-testid="loading-button">Loading</Button>);
    const button = screen.getByTestId('loading-button');

    expect(button).toBeDisabled();
    // ✅ Test for loading indicator existence, not specific text
    expect(button).toHaveAttribute('disabled');
    expect(button.className).toContain('button--loading');
  });

  it('does not call onClick when loading', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick} loading>Loading</Button>);
    const button = screen.getByRole('button');

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick} disabled>Disabled</Button>);
    const button = screen.getByRole('button');

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders icon when provided', () => {
    render(<Button icon={<span data-testid="test-icon">🔥</span>}>With Icon</Button>);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('custom-class');
  });

  it('forwards HTML button attributes', () => {
    render(<Button type="submit" data-testid="submit-button">Submit</Button>);
    const button = screen.getByTestId('submit-button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  describe('Translation Support', () => {
    it('renders text content passed as children', () => {
      // ✅ CORRECT: Test structure, not specific translated text
      // Parent component passes t('key'), we just verify button works
      render(<Button data-testid="action-button">Action Text</Button>);

      const button = screen.getByTestId('action-button');
      expect(button).toBeInTheDocument();
      expect(button.textContent).toBeTruthy(); // Has some text
    });

    it('re-renders when children prop changes', () => {
      // ✅ CORRECT: Test that button updates, not what it updates to
      const { rerender } = render(<Button data-testid="dynamic-button">Initial</Button>);

      const button = screen.getByTestId('dynamic-button');
      const initialText = button.textContent;
      expect(initialText).toBe('Initial');

      // Simulate language change - parent passes new text from t()
      rerender(<Button data-testid="dynamic-button">Updated</Button>);

      const newText = button.textContent;
      expect(newText).toBe('Updated');
      expect(newText).not.toBe(initialText); // Verify it changed
    });

    it('properly displays any text content (language-independent)', () => {
      // ✅ CORRECT: Test that button renders ANY text correctly
      // ❌ WRONG: We don't test specific languages like "Save" or "Uložiť"
      const arbitraryText = 'Any Text Content';

      render(<Button data-testid="text-button">{arbitraryText}</Button>);

      const button = screen.getByTestId('text-button');
      expect(button.textContent).toBe(arbitraryText);
      expect(button).toBeInTheDocument();
    });
  });
});
