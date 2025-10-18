/**
 * @file Select.test.tsx
 * @package @l-kern/ui-components
 * @description Unit tests for Select component
 * @version 1.0.0
 * @date 2025-10-18
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';
import type { SelectOption } from './Select';

describe('Select', () => {
  const mockOptions: SelectOption[] = [
    { value: 'sk', label: 'Slovakia' },
    { value: 'cz', label: 'Czech Republic' },
    { value: 'pl', label: 'Poland' },
  ];

  describe('Rendering', () => {
    it('renders select with options', () => {
      render(<Select options={mockOptions} />);
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      expect(screen.getByText('Slovakia')).toBeInTheDocument();
      expect(screen.getByText('Czech Republic')).toBeInTheDocument();
      expect(screen.getByText('Poland')).toBeInTheDocument();
    });

    it('renders with placeholder', () => {
      render(<Select options={mockOptions} placeholder="Choose country" />);
      expect(screen.getByText('Choose country')).toBeInTheDocument();
    });

    it('renders helper text when provided', () => {
      render(<Select options={mockOptions} helperText="Select your country" />);
      expect(screen.getByText('Select your country')).toBeInTheDocument();
    });

    it('renders error message when provided', () => {
      render(<Select options={mockOptions} error="Country is required" />);
      expect(screen.getByText('Country is required')).toBeInTheDocument();
    });

    it('shows error instead of helper text when both provided', () => {
      render(
        <Select
          options={mockOptions}
          error="Country is required"
          helperText="Select your country"
        />
      );
      expect(screen.getByText('Country is required')).toBeInTheDocument();
      expect(screen.queryByText('Select your country')).not.toBeInTheDocument();
    });
  });

  describe('Options', () => {
    it('renders all options from array', () => {
      render(<Select options={mockOptions} />);
      const options = screen.getAllByRole('option');
      // 3 options total (no placeholder)
      expect(options).toHaveLength(3);
    });

    it('renders placeholder as first option', () => {
      render(<Select options={mockOptions} placeholder="Choose" />);
      const options = screen.getAllByRole('option');
      // 4 options: 1 placeholder + 3 countries
      expect(options).toHaveLength(4);
      expect(options[0]).toHaveTextContent('Choose');
    });

    it('disables specific options when disabled flag set', () => {
      const optionsWithDisabled: SelectOption[] = [
        { value: 'sk', label: 'Slovakia' },
        { value: 'cz', label: 'Czech Republic', disabled: true },
      ];
      render(<Select options={optionsWithDisabled} />);
      const czechOption = screen.getByText('Czech Republic');
      expect(czechOption).toBeDisabled();
    });
  });

  describe('Interaction', () => {
    it('calls onChange when option selected', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Select options={mockOptions} onChange={handleChange} />);

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'sk');

      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('updates selected value', async () => {
      const user = userEvent.setup();
      render(<Select options={mockOptions} />);

      const select = screen.getByRole('combobox') as HTMLSelectElement;
      await user.selectOptions(select, 'cz');

      expect(select.value).toBe('cz');
    });

    it('respects disabled state', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Select options={mockOptions} onChange={handleChange} disabled />);

      const select = screen.getByRole('combobox');
      expect(select).toBeDisabled();

      // Attempt to interact (should not trigger onChange)
      await user.click(select);
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('sets aria-invalid when error present', () => {
      render(<Select options={mockOptions} error="Error message" />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-invalid', 'true');
    });

    it('sets aria-invalid to false when no error', () => {
      render(<Select options={mockOptions} />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-invalid', 'false');
    });

    it('links error message with aria-describedby', () => {
      render(<Select options={mockOptions} id="country" error="Error message" />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-describedby', 'country-error');
    });

    it('links helper text with aria-describedby', () => {
      render(<Select options={mockOptions} id="country" helperText="Helper text" />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-describedby', 'country-helper');
    });

    it('supports required attribute', () => {
      render(<Select options={mockOptions} required />);
      const select = screen.getByRole('combobox');
      expect(select).toBeRequired();
    });
  });

  describe('Styling', () => {
    it('applies fullWidth class when fullWidth prop is true', () => {
      const { container } = render(<Select options={mockOptions} fullWidth />);
      const wrapper = container.firstChild as HTMLElement;
      // CSS Modules generate hashed class names, so check className string contains pattern
      expect(wrapper.className).toContain('wrapper');
      expect(wrapper.className).toContain('fullWidth');
    });

    it('applies custom className', () => {
      render(<Select options={mockOptions} className="custom-class" />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('custom-class');
    });

    it('applies error class when error present', () => {
      render(<Select options={mockOptions} error="Error" />);
      const select = screen.getByRole('combobox');
      // CSS Modules generate hashed class names, so check className string contains pattern
      expect(select.className).toContain('select');
      expect(select.className).toContain('error');
    });
  });

  describe('Forward Ref', () => {
    it('forwards ref to select element', () => {
      const ref = vi.fn();
      render(<Select options={mockOptions} ref={ref} />);
      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLSelectElement);
    });

    it('allows ref to access select value', () => {
      const ref = { current: null as HTMLSelectElement | null };
      render(<Select options={mockOptions} ref={ref} value="sk" onChange={() => {}} />);
      expect(ref.current).toBeInstanceOf(HTMLSelectElement);
      expect(ref.current?.value).toBe('sk');
    });
  });
});
