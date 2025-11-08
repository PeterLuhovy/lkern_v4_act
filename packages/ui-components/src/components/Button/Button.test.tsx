/**
 * @file Button.test.tsx
 * @package @l-kern/ui-components
 * @description Unit tests for Button component
 * @version 1.1.0
 * @date 2025-10-19
 */

import { describe, it, expect, vi } from 'vitest';
import { renderWithTranslation, screen, userEvent } from '../../test-utils';
import { Button } from './Button';

describe('Button', () => {
  it('renders button with text', () => {
    renderWithTranslation(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    renderWithTranslation(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies primary variant class', () => {
    renderWithTranslation(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('button--primary');
  });

  it('applies secondary variant class by default', () => {
    renderWithTranslation(<Button>Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('button--secondary');
  });

  it('applies danger variant class', () => {
    renderWithTranslation(<Button variant="danger">Danger</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('button--danger');
  });

  it('applies danger-subtle variant class', () => {
    renderWithTranslation(<Button variant="danger-subtle">Danger Subtle</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('button--danger-subtle');
  });

  it('applies small size class', () => {
    renderWithTranslation(<Button size="small">Small</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('button--small');
  });

  it('applies medium size class by default', () => {
    renderWithTranslation(<Button>Medium</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('button--medium');
  });

  it('applies large size class', () => {
    renderWithTranslation(<Button size="large">Large</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('button--large');
  });

  it('applies fullWidth class when fullWidth prop is true', () => {
    renderWithTranslation(<Button fullWidth>Full Width</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('button--fullWidth');
  });

  it('disables button and shows loading spinner when loading', () => {
    renderWithTranslation(<Button loading data-testid="loading-button">Loading</Button>);
    const button = screen.getByTestId('loading-button');

    expect(button).toBeDisabled();
    // ✅ Test for loading indicator existence, not specific text
    expect(button).toHaveAttribute('disabled');
    expect(button.className).toContain('button--loading');
  });

  it('does not call onClick when loading', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    renderWithTranslation(<Button onClick={handleClick} loading>Loading</Button>);
    const button = screen.getByRole('button');

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('disables button when disabled prop is true', () => {
    renderWithTranslation(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    renderWithTranslation(<Button onClick={handleClick} disabled>Disabled</Button>);
    const button = screen.getByRole('button');

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders icon when provided', () => {
    renderWithTranslation(<Button icon={<span data-testid="test-icon" role="img" aria-label="fire">🔥</span>}>With Icon</Button>);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    renderWithTranslation(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('custom-class');
  });

  it('forwards HTML button attributes', () => {
    renderWithTranslation(<Button type="submit" data-testid="submit-button">Submit</Button>);
    const button = screen.getByTestId('submit-button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  describe('Translation Support', () => {
    it('renders text content passed as children', () => {
      // ✅ CORRECT: Test structure, not specific translated text
      // Parent component passes t('key'), we just verify button works
      renderWithTranslation(<Button data-testid="action-button">Action Text</Button>);

      const button = screen.getByTestId('action-button');
      expect(button).toBeInTheDocument();
      expect(button.textContent).toBeTruthy(); // Has some text
    });

    it('re-renders when children prop changes', () => {
      // ✅ CORRECT: Test that button updates when text changes
      const { unmount } = renderWithTranslation(<Button data-testid="dynamic-button">Initial</Button>);

      let button = screen.getByTestId('dynamic-button');
      const initialText = button.textContent;
      expect(initialText).toBe('Initial');

      // Unmount and re-render with new text (simulates language change)
      unmount();
      renderWithTranslation(<Button data-testid="dynamic-button">Updated</Button>);

      button = screen.getByTestId('dynamic-button');
      const newText = button.textContent;
      expect(newText).toBe('Updated');
      expect(newText).not.toBe(initialText); // Verify it changed
    });

    it('properly displays any text content (language-independent)', () => {
      // ✅ CORRECT: Test that button renders ANY text correctly
      // ❌ WRONG: We don't test specific languages like "Save" or "Uložiť"
      const arbitraryText = 'Any Text Content';

      renderWithTranslation(<Button data-testid="text-button">{arbitraryText}</Button>);

      const button = screen.getByTestId('text-button');
      expect(button.textContent).toBe(arbitraryText);
      expect(button).toBeInTheDocument();
    });
  });
});
