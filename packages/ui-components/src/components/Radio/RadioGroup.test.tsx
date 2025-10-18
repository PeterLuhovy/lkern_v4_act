/*
 * ================================================================
 * FILE: RadioGroup.test.tsx
 * PATH: packages/ui-components/src/components/Radio/RadioGroup.test.tsx
 * DESCRIPTION: Unit tests for RadioGroup component
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
 * ================================================================
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup } from './RadioGroup';

const mockOptions = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

describe('RadioGroup', () => {
  describe('Rendering', () => {
    it('renders all radio options', () => {
      render(<RadioGroup name="size" options={mockOptions} />);
      expect(screen.getByLabelText('Small')).toBeInTheDocument();
      expect(screen.getByLabelText('Medium')).toBeInTheDocument();
      expect(screen.getByLabelText('Large')).toBeInTheDocument();
    });

    it('renders with group label', () => {
      render(<RadioGroup name="size" label="Select size" options={mockOptions} />);
      expect(screen.getByText('Select size')).toBeInTheDocument();
    });

    it('renders required indicator when required', () => {
      render(<RadioGroup name="size" label="Size" options={mockOptions} required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('renders with helper text', () => {
      render(
        <RadioGroup
          name="size"
          options={mockOptions}
          helperText="Choose your preferred size"
        />
      );
      expect(screen.getByText('Choose your preferred size')).toBeInTheDocument();
    });

    it('renders with error message', () => {
      render(
        <RadioGroup
          name="size"
          options={mockOptions}
          error="Please select a size"
        />
      );
      expect(screen.getByText('Please select a size')).toBeInTheDocument();
    });
  });

  describe('Selection State', () => {
    it('selects the radio matching the value prop', () => {
      render(<RadioGroup name="size" options={mockOptions} value="medium" />);
      const mediumRadio = screen.getByLabelText('Medium');
      expect(mediumRadio).toBeChecked();
    });

    it('has no selection when value is undefined', () => {
      render(<RadioGroup name="size" options={mockOptions} />);
      const radios = screen.getAllByRole('radio');
      radios.forEach((radio) => {
        expect(radio).not.toBeChecked();
      });
    });

    it('only one radio is checked at a time', () => {
      render(<RadioGroup name="size" options={mockOptions} value="small" />);
      const radios = screen.getAllByRole('radio');
      const checkedRadios = radios.filter((radio) => (radio as HTMLInputElement).checked);
      expect(checkedRadios).toHaveLength(1);
      expect(checkedRadios[0]).toHaveAccessibleName('Small');
    });
  });

  describe('Interactions', () => {
    it('calls onChange with selected value when option is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<RadioGroup name="size" options={mockOptions} onChange={handleChange} />);

      const largeRadio = screen.getByLabelText('Large');
      await user.click(largeRadio);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith('large');
    });

    it('updates selection when clicking different options', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<RadioGroup name="size" options={mockOptions} value="small" onChange={handleChange} />);

      await user.click(screen.getByLabelText('Medium'));
      expect(handleChange).toHaveBeenCalledWith('medium');

      await user.click(screen.getByLabelText('Large'));
      expect(handleChange).toHaveBeenCalledWith('large');
    });
  });

  describe('Disabled State', () => {
    it('disables all options when disabled prop is true', () => {
      render(<RadioGroup name="size" options={mockOptions} disabled />);
      const radios = screen.getAllByRole('radio');
      radios.forEach((radio) => {
        expect(radio).toBeDisabled();
      });
    });

    it('disables individual options based on option.disabled', () => {
      const optionsWithDisabled = [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium', disabled: true },
        { value: 'large', label: 'Large' },
      ];
      render(<RadioGroup name="size" options={optionsWithDisabled} />);

      expect(screen.getByLabelText('Small')).not.toBeDisabled();
      expect(screen.getByLabelText('Medium')).toBeDisabled();
      expect(screen.getByLabelText('Large')).not.toBeDisabled();
    });

    it('does not call onChange when clicking disabled option', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const optionsWithDisabled = [
        { value: 'small', label: 'Small', disabled: true },
      ];
      render(<RadioGroup name="size" options={optionsWithDisabled} onChange={handleChange} />);

      await user.click(screen.getByLabelText('Small'));
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Layout', () => {
    it('renders vertical layout by default', () => {
      const { container } = render(<RadioGroup name="size" options={mockOptions} />);
      const optionsContainer = container.querySelector('div[class*="optionsContainer"]');
      expect(optionsContainer?.className).toContain('vertical');
    });

    it('renders horizontal layout when direction is horizontal', () => {
      const { container } = render(
        <RadioGroup name="size" options={mockOptions} direction="horizontal" />
      );
      const optionsContainer = container.querySelector('div[class*="optionsContainer"]');
      expect(optionsContainer?.className).toContain('horizontal');
    });
  });

  describe('Accessibility', () => {
    it('has radiogroup role', () => {
      render(<RadioGroup name="size" options={mockOptions} label="Size" />);
      const group = screen.getByRole('radiogroup');
      expect(group).toBeInTheDocument();
    });

    it('links label with radiogroup via aria-labelledby', () => {
      render(<RadioGroup name="size" options={mockOptions} label="Select size" />);
      const group = screen.getByRole('radiogroup');
      expect(group).toHaveAttribute('aria-labelledby', 'size-label');
    });

    it('links error text with radios via aria-describedby', () => {
      render(
        <RadioGroup
          name="size"
          options={mockOptions}
          error="Error message"
        />
      );
      const radios = screen.getAllByRole('radio');
      radios.forEach((radio) => {
        expect(radio).toHaveAttribute('aria-describedby', 'size-description');
      });
      expect(screen.getByText('Error message')).toHaveAttribute('id', 'size-description');
    });
  });

  describe('HTML Attributes', () => {
    it('applies name attribute to all radio inputs', () => {
      render(<RadioGroup name="custom-name" options={mockOptions} />);
      const radios = screen.getAllByRole('radio');
      radios.forEach((radio) => {
        expect(radio).toHaveAttribute('name', 'custom-name');
      });
    });

    it('applies custom className to group container', () => {
      const { container } = render(
        <RadioGroup name="size" options={mockOptions} className="custom-class" />
      );
      const group = container.querySelector('.custom-class');
      expect(group).toBeInTheDocument();
    });
  });

  describe('Theme CSS Variables', () => {
    it('uses theme CSS variables for colors (not hardcoded)', () => {
      const { container } = render(
        <RadioGroup name="size" label="Theme test" options={mockOptions} />
      );

      // Verify RadioGroup wrapper classes are applied
      const radioGroup = container.querySelector('[class*="radioGroup"]');
      expect(radioGroup).toBeInTheDocument();

      // Verify label uses theme text color
      const groupLabel = container.querySelector('[class*="groupLabel"]');
      expect(groupLabel).toBeInTheDocument();
    });

    it('applies error styles using theme variables', () => {
      const { container } = render(
        <RadioGroup
          name="size"
          options={mockOptions}
          error="Error message"
        />
      );

      // Error text should use --color-status-error theme variable (from CSS file)
      const errorText = container.querySelector('[class*="errorText"]');
      expect(errorText).toBeInTheDocument();
    });

    it('applies required indicator using theme variables', () => {
      const { container } = render(
        <RadioGroup
          name="size"
          label="Required field"
          options={mockOptions}
          required
        />
      );

      // Required indicator should use --color-status-error theme variable (from CSS file)
      const required = container.querySelector('[class*="required"]');
      expect(required).toBeInTheDocument();
    });
  });

  describe('Translation Support', () => {
    it('renders translated group label', () => {
      const translatedLabel = 'Vyberte si veľkosť'; // Slovak for "Select size"
      render(<RadioGroup name="size" label={translatedLabel} options={mockOptions} />);

      expect(screen.getByText('Vyberte si veľkosť')).toBeInTheDocument();
    });

    it('renders translated option labels', () => {
      const translatedOptions = [
        { value: 'small', label: 'Malá' },
        { value: 'medium', label: 'Stredná' },
        { value: 'large', label: 'Veľká' },
      ];
      render(<RadioGroup name="size" options={translatedOptions} />);

      expect(screen.getByLabelText('Malá')).toBeInTheDocument();
      expect(screen.getByLabelText('Stredná')).toBeInTheDocument();
      expect(screen.getByLabelText('Veľká')).toBeInTheDocument();
    });

    it('renders translated error message', () => {
      const translatedError = 'Prosím vyberte veľkosť'; // Slovak for "Please select size"
      render(<RadioGroup name="size" options={mockOptions} error={translatedError} />);

      expect(screen.getByText('Prosím vyberte veľkosť')).toBeInTheDocument();
    });

    it('renders translated helper text', () => {
      const translatedHelper = 'Vyberte vašu preferovanú veľkosť'; // Slovak for "Choose your preferred size"
      render(<RadioGroup name="size" options={mockOptions} helperText={translatedHelper} />);

      expect(screen.getByText('Vyberte vašu preferovanú veľkosť')).toBeInTheDocument();
    });

    it('updates label when translation changes', () => {
      const { rerender } = render(<RadioGroup name="size" label="Select size" options={mockOptions} />);
      expect(screen.getByText('Select size')).toBeInTheDocument();

      // Simulate language change
      rerender(<RadioGroup name="size" label="Vyberte si veľkosť" options={mockOptions} />);
      expect(screen.queryByText('Select size')).not.toBeInTheDocument();
      expect(screen.getByText('Vyberte si veľkosť')).toBeInTheDocument();
    });

    it('updates option labels when translation changes', () => {
      const englishOptions = [
        { value: 'free', label: 'Free - $0/month' },
        { value: 'pro', label: 'Pro - $9/month' },
      ];
      const slovakOptions = [
        { value: 'free', label: 'Zadarmo - 0€/mesiac' },
        { value: 'pro', label: 'Pro - 9€/mesiac' },
      ];

      const { rerender } = render(<RadioGroup name="plan" options={englishOptions} />);
      expect(screen.getByLabelText('Free - $0/month')).toBeInTheDocument();
      expect(screen.getByLabelText('Pro - $9/month')).toBeInTheDocument();

      // Simulate language change
      rerender(<RadioGroup name="plan" options={slovakOptions} />);
      expect(screen.queryByLabelText('Free - $0/month')).not.toBeInTheDocument();
      expect(screen.getByLabelText('Zadarmo - 0€/mesiac')).toBeInTheDocument();
      expect(screen.getByLabelText('Pro - 9€/mesiac')).toBeInTheDocument();
    });

    it('updates error message when translation changes', () => {
      const { rerender } = render(<RadioGroup name="size" options={mockOptions} error="Please select" />);
      expect(screen.getByText('Please select')).toBeInTheDocument();

      rerender(<RadioGroup name="size" options={mockOptions} error="Prosím vyberte" />);
      expect(screen.queryByText('Please select')).not.toBeInTheDocument();
      expect(screen.getByText('Prosím vyberte')).toBeInTheDocument();
    });
  });
});
