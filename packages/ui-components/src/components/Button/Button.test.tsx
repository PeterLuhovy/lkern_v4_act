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
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
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
    it('renders translated text when provided as children', () => {
      // Simulate translated text being passed from parent component
      const translatedText = 'Uložiť'; // Slovak for "Save"
      render(<Button>{translatedText}</Button>);

      expect(screen.getByText('Uložiť')).toBeInTheDocument();
    });

    it('re-renders with new translated text when children change', () => {
      const { rerender } = render(<Button>Save</Button>);
      expect(screen.getByText('Save')).toBeInTheDocument();

      // Simulate language change - parent passes new translated text
      rerender(<Button>Uložiť</Button>);
      expect(screen.queryByText('Save')).not.toBeInTheDocument();
      expect(screen.getByText('Uložiť')).toBeInTheDocument();
    });

    it('properly displays any text passed as children (translation-agnostic)', () => {
      // Button should work with ANY text (hardcoded or translated)
      // Real translation happens in parent component using t() function
      const testCases = [
        'Save',           // English
        'Uložiť',         // Slovak
        'Speichern',      // German
        '保存',           // Japanese
      ];

      testCases.forEach((text) => {
        const { unmount } = render(<Button>{text}</Button>);
        expect(screen.getByText(text)).toBeInTheDocument();
        unmount();
      });
    });
  });
});
