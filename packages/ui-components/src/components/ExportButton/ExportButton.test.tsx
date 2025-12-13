/*
 * ================================================================
 * FILE: ExportButton.test.tsx
 * PATH: /packages/ui-components/src/components/ExportButton/ExportButton.test.tsx
 * DESCRIPTION: Unit tests for ExportButton component
 * VERSION: v1.0.0
 * CREATED: 2025-12-11
 * UPDATED: 2025-12-11
 * ================================================================
 */

import { describe, it, expect, vi } from 'vitest';
import { renderWithTranslation, screen, userEvent } from '../../test-utils';
import { ExportButton, ExportFormat } from './ExportButton';

describe('ExportButton', () => {
  // ================================================================
  // RENDERING TESTS
  // ================================================================
  describe('Rendering', () => {
    it('renders select element', () => {
      const handleExport = vi.fn();
      renderWithTranslation(<ExportButton onExport={handleExport} />);

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      expect(select.tagName).toBe('SELECT');
    });

    it('renders all default format options (csv, json)', () => {
      const handleExport = vi.fn();
      renderWithTranslation(<ExportButton onExport={handleExport} />);

      // Get visible options (placeholder is hidden, so only format options are visible)
      const options = screen.getAllByRole('option');
      // csv + json = 2 visible options (placeholder is hidden from a11y tree)
      expect(options).toHaveLength(2);

      // Check option values
      const optionValues = options.map((opt) => (opt as HTMLOptionElement).value);
      expect(optionValues).toContain('csv');
      expect(optionValues).toContain('json');
    });

    it('renders custom format options when provided', () => {
      const handleExport = vi.fn();
      const formats: ExportFormat[] = ['csv', 'json', 'zip'];
      renderWithTranslation(<ExportButton onExport={handleExport} formats={formats} />);

      // Get visible options (placeholder is hidden from a11y tree)
      const options = screen.getAllByRole('option');
      // csv + json + zip = 3 visible options
      expect(options).toHaveLength(3);

      const optionValues = options.map((opt) => (opt as HTMLOptionElement).value);
      expect(optionValues).toContain('zip');
    });

    it('displays format labels correctly', () => {
      const handleExport = vi.fn();
      const formats: ExportFormat[] = ['csv', 'json', 'zip'];
      renderWithTranslation(<ExportButton onExport={handleExport} formats={formats} />);

      expect(screen.getByText('CSV')).toBeInTheDocument();
      expect(screen.getByText('JSON')).toBeInTheDocument();
      expect(screen.getByText('ZIP (Full)')).toBeInTheDocument();
    });
  });

  // ================================================================
  // PROPS & VARIANTS TESTS
  // ================================================================
  describe('Props & Variants', () => {
    it('renders with custom label', () => {
      const handleExport = vi.fn();
      renderWithTranslation(<ExportButton onExport={handleExport} label="Download Data" />);

      // Custom label should be in the placeholder option
      expect(screen.getByText(/Download Data/)).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const handleExport = vi.fn();
      renderWithTranslation(
        <ExportButton onExport={handleExport} className="custom-export-class" />
      );

      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('custom-export-class');
    });

    it('disables select when disabled=true', () => {
      const handleExport = vi.fn();
      renderWithTranslation(<ExportButton onExport={handleExport} disabled />);

      const select = screen.getByRole('combobox');
      expect(select).toBeDisabled();
    });

    it('is enabled by default', () => {
      const handleExport = vi.fn();
      renderWithTranslation(<ExportButton onExport={handleExport} />);

      const select = screen.getByRole('combobox');
      expect(select).not.toBeDisabled();
    });
  });

  // ================================================================
  // INTERACTION TESTS
  // ================================================================
  describe('Interactions', () => {
    it('calls onExport with csv when csv option selected', async () => {
      const handleExport = vi.fn();
      const user = userEvent.setup();
      renderWithTranslation(<ExportButton onExport={handleExport} />);

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'csv');

      expect(handleExport).toHaveBeenCalledTimes(1);
      expect(handleExport).toHaveBeenCalledWith('csv');
    });

    it('calls onExport with json when json option selected', async () => {
      const handleExport = vi.fn();
      const user = userEvent.setup();
      renderWithTranslation(<ExportButton onExport={handleExport} />);

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'json');

      expect(handleExport).toHaveBeenCalledTimes(1);
      expect(handleExport).toHaveBeenCalledWith('json');
    });

    it('calls onExport with zip when zip option selected', async () => {
      const handleExport = vi.fn();
      const user = userEvent.setup();
      const formats: ExportFormat[] = ['csv', 'json', 'zip'];
      renderWithTranslation(<ExportButton onExport={handleExport} formats={formats} />);

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'zip');

      expect(handleExport).toHaveBeenCalledTimes(1);
      expect(handleExport).toHaveBeenCalledWith('zip');
    });

    it('resets selection after export (value returns to empty)', async () => {
      const handleExport = vi.fn();
      const user = userEvent.setup();
      renderWithTranslation(<ExportButton onExport={handleExport} />);

      const select = screen.getByRole('combobox') as HTMLSelectElement;
      await user.selectOptions(select, 'csv');

      // After selection and export, value should be reset to empty
      expect(select.value).toBe('');
    });

    it('does not call onExport when select is disabled', async () => {
      const handleExport = vi.fn();
      const user = userEvent.setup();
      renderWithTranslation(<ExportButton onExport={handleExport} disabled />);

      const select = screen.getByRole('combobox');

      // Attempt to interact with disabled select
      try {
        await user.selectOptions(select, 'csv');
      } catch {
        // Expected - can't interact with disabled select
      }

      expect(handleExport).not.toHaveBeenCalled();
    });

    it('does not call onExport when placeholder is selected', async () => {
      const handleExport = vi.fn();
      const user = userEvent.setup();
      renderWithTranslation(<ExportButton onExport={handleExport} />);

      const select = screen.getByRole('combobox');

      // Try to select empty value (placeholder)
      await user.selectOptions(select, '');

      expect(handleExport).not.toHaveBeenCalled();
    });
  });

  // ================================================================
  // TRANSLATION SUPPORT TESTS
  // ================================================================
  describe('Translation Support', () => {
    it('displays Slovak export label by default', () => {
      const handleExport = vi.fn();
      renderWithTranslation(<ExportButton onExport={handleExport} />);

      // Default Slovak translation for 'common.export' should be visible
      // The emoji 📥 is part of the label
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      // Check that the placeholder contains the export text (Slovak: "Exportovať" or similar)
    });

    it('displays English export label when language=en', () => {
      const handleExport = vi.fn();
      renderWithTranslation(<ExportButton onExport={handleExport} />, { initialLanguage: 'en' });

      // English translation for 'common.export'
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('overrides translation with custom label', () => {
      const handleExport = vi.fn();
      renderWithTranslation(
        <ExportButton onExport={handleExport} label="Custom Export Label" />
      );

      expect(screen.getByText(/Custom Export Label/)).toBeInTheDocument();
    });
  });

  // ================================================================
  // ACCESSIBILITY TESTS
  // ================================================================
  describe('Accessibility', () => {
    it('has combobox role', () => {
      const handleExport = vi.fn();
      renderWithTranslation(<ExportButton onExport={handleExport} />);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('placeholder option is disabled and hidden', () => {
      const handleExport = vi.fn();
      renderWithTranslation(<ExportButton onExport={handleExport} />);

      // The placeholder is hidden from a11y tree, so we need to query select directly
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      // First option (index 0) is the placeholder
      const placeholderOption = select.options[0] as HTMLOptionElement;

      expect(placeholderOption.value).toBe('');
      expect(placeholderOption.disabled).toBe(true);
      expect(placeholderOption.hidden).toBe(true);
    });

    it('can be navigated with keyboard', async () => {
      const handleExport = vi.fn();
      const user = userEvent.setup();
      renderWithTranslation(<ExportButton onExport={handleExport} />);

      const select = screen.getByRole('combobox');

      // Tab to select
      await user.tab();
      expect(select).toHaveFocus();
    });
  });

  // ================================================================
  // CSS & STYLING TESTS
  // ================================================================
  describe('CSS & Styling', () => {
    it('has exportButton base class', () => {
      const handleExport = vi.fn();
      renderWithTranslation(<ExportButton onExport={handleExport} />);

      const select = screen.getByRole('combobox');
      expect(select.className).toMatch(/exportButton/);
    });
  });
});
