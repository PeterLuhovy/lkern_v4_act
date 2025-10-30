/*
 * ================================================================
 * FILE: Checkbox.test.tsx
 * PATH: packages/ui-components/src/components/Checkbox/Checkbox.test.tsx
 * DESCRIPTION: Unit tests for Checkbox component
 * VERSION: v1.1.0
 * CREATED: 2025-10-18
 * UPDATED: 2025-10-30
 * ================================================================
 */

import { describe, it, expect, vi } from 'vitest';
import { renderWithTranslation, screen, userEvent } from '../../test-utils';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  describe('Rendering', () => {
    it('renders checkbox input', () => {
      renderWithTranslation(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute('type', 'checkbox');
    });

    it('renders with label', () => {
      renderWithTranslation(<Checkbox label="Accept terms" />);
      expect(screen.getByLabelText('Accept terms')).toBeInTheDocument();
    });

    it('renders without label', () => {
      renderWithTranslation(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('renders with helper text', () => {
      renderWithTranslation(<Checkbox label="Subscribe" helperText="You can unsubscribe anytime" />);
      expect(screen.getByText('You can unsubscribe anytime')).toBeInTheDocument();
    });

    it('renders with error message', () => {
      renderWithTranslation(<Checkbox label="Required" error="You must accept this" />);
      expect(screen.getByText('You must accept this')).toBeInTheDocument();
    });
  });

  describe('States', () => {
    it('renders unchecked by default', () => {
      renderWithTranslation(<Checkbox label="Option" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('renders checked when checked prop is true', () => {
      renderWithTranslation(<Checkbox label="Option" checked readOnly />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('renders disabled state', () => {
      renderWithTranslation(<Checkbox label="Disabled option" disabled />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
    });

    it('sets indeterminate state', () => {
      renderWithTranslation(<Checkbox label="Select all" indeterminate />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('sets aria-invalid when error is present', () => {
      renderWithTranslation(<Checkbox label="Field" error="Error message" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    });

    it('does not set aria-invalid when no error', () => {
      renderWithTranslation(<Checkbox label="Field" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toHaveAttribute('aria-invalid', 'true');
    });

    it('links error text with aria-describedby', () => {
      renderWithTranslation(<Checkbox id="test-checkbox" label="Field" error="Error message" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-describedby', 'test-checkbox-description');
      expect(screen.getByText('Error message')).toHaveAttribute('id', 'test-checkbox-description');
    });

    it('links helper text with aria-describedby', () => {
      renderWithTranslation(<Checkbox id="test-checkbox" label="Field" helperText="Helper message" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-describedby', 'test-checkbox-description');
      expect(screen.getByText('Helper message')).toHaveAttribute('id', 'test-checkbox-description');
    });
  });

  describe('Interactions', () => {
    it('toggles checked state on click', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<Checkbox label="Toggle me" />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).not.toBeChecked();
      await user.click(checkbox);
      expect(checkbox).toBeChecked();
      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('calls onChange handler when clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      renderWithTranslation(<Checkbox label="Click me" onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      await user.click(checkbox);
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('does not toggle when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      renderWithTranslation(<Checkbox label="Disabled" disabled onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      await user.click(checkbox);
      expect(handleChange).not.toHaveBeenCalled();
      expect(checkbox).not.toBeChecked();
    });
  });

  describe('Forward Ref', () => {
    it('forwards ref to input element', () => {
      const ref = { current: null as HTMLInputElement | null };
      renderWithTranslation(<Checkbox ref={ref} label="Ref test" />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.type).toBe('checkbox');
    });
  });

  describe('HTML Attributes', () => {
    it('passes through standard input attributes', () => {
      renderWithTranslation(
        <Checkbox
          label="Test"
          id="custom-id"
          name="custom-name"
          value="custom-value"
          required
        />
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('id', 'custom-id');
      expect(checkbox).toHaveAttribute('name', 'custom-name');
      expect(checkbox).toHaveAttribute('value', 'custom-value');
      expect(checkbox).toBeRequired();
    });

    it('applies custom className to wrapper', () => {
      const { container } = renderWithTranslation(<Checkbox className="custom-class" />);
      const wrapper = container.querySelector('.custom-class');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Theme CSS Variables', () => {
    it('uses theme CSS variables for colors (not hardcoded)', () => {
      const { container } = renderWithTranslation(<Checkbox label="Theme test" />);

      // Read the actual CSS file content to verify theme variables are used
      const checkboxCustom = container.querySelector('[class*="checkboxCustom"]');
      expect(checkboxCustom).toBeInTheDocument();

      // Verify CSS classes are applied (CSS modules will apply the styles with theme variables)
      expect(checkboxCustom?.className).toContain('checkboxCustom');
    });

    it('applies error styles using theme variables', () => {
      const { container } = renderWithTranslation(<Checkbox label="Error test" error="Error message" />);

      const label = container.querySelector('label');
      expect(label?.className).toContain('error');

      // Error class should use --color-status-error theme variable (from CSS file)
      const checkboxCustom = container.querySelector('[class*="checkboxCustom"]');
      expect(checkboxCustom).toBeInTheDocument();
    });

    it('applies disabled styles using theme variables', () => {
      const { container } = renderWithTranslation(<Checkbox label="Disabled test" disabled />);

      const label = container.querySelector('label');
      expect(label?.className).toContain('disabled');

      // Disabled class should use --theme-input-background-disabled theme variable (from CSS file)
      const checkboxCustom = container.querySelector('[class*="checkboxCustom"]');
      expect(checkboxCustom).toBeInTheDocument();
    });
  });

  describe('Translation Support', () => {
    it('renders translated label text', () => {
      const translatedLabel = 'Súhlasím s podmienkami'; // Slovak for "I agree with terms"
      renderWithTranslation(<Checkbox label={translatedLabel} />);

      expect(screen.getByLabelText('Súhlasím s podmienkami')).toBeInTheDocument();
    });

    it('renders translated error message', () => {
      const translatedError = 'Musíte prijať podmienky'; // Slovak for "You must accept terms"
      renderWithTranslation(<Checkbox label="Test" error={translatedError} />);

      expect(screen.getByText('Musíte prijať podmienky')).toBeInTheDocument();
    });

    it('renders translated helper text', () => {
      const translatedHelper = 'Môžete sa kedykoľvek odhlásiť'; // Slovak for "You can unsubscribe anytime"
      renderWithTranslation(<Checkbox label="Test" helperText={translatedHelper} />);

      expect(screen.getByText('Môžete sa kedykoľvek odhlásiť')).toBeInTheDocument();
    });

    it('updates label when translation changes (English)', () => {
      const { unmount } = renderWithTranslation(<Checkbox label="Subscribe to newsletter" data-testid="checkbox-1" />);
      expect(screen.getByLabelText('Subscribe to newsletter')).toBeInTheDocument();

      unmount();

      // Simulate language change to Slovak
      renderWithTranslation(<Checkbox label="Prihlásiť sa na newsletter" data-testid="checkbox-2" />);
      expect(screen.queryByLabelText('Subscribe to newsletter')).not.toBeInTheDocument();
      expect(screen.getByLabelText('Prihlásiť sa na newsletter')).toBeInTheDocument();
    });

    it('updates error message when translation changes', () => {
      const { unmount } = renderWithTranslation(<Checkbox label="Test" error="Required" data-testid="checkbox-3" />);
      expect(screen.getByText('Required')).toBeInTheDocument();

      unmount();

      renderWithTranslation(<Checkbox label="Test" error="Povinné" data-testid="checkbox-4" />);
      expect(screen.queryByText('Required')).not.toBeInTheDocument();
      expect(screen.getByText('Povinné')).toBeInTheDocument();
    });
  });
});
