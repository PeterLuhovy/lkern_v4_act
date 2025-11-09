/*
 * ================================================================
 * FILE: ReportButton.test.tsx
 * PATH: /packages/ui-components/src/components/ReportButton/ReportButton.test.tsx
 * DESCRIPTION: Test suite for ReportButton component
 * VERSION: v1.0.0
 * CREATED: 2025-11-08
 * UPDATED: 2025-11-08
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithTranslation, screen, userEvent, waitFor } from '../../test-utils';
import { ReportButton, ReportData } from './ReportButton';

describe('ReportButton', () => {
  // ================================================================
  // RENDERING TESTS
  // ================================================================

  describe('Rendering', () => {
    it('renders floating button with default position', () => {
      renderWithTranslation(<ReportButton />);

      const button = screen.getByRole('button', { name: /nahlási/i });
      expect(button).toBeInTheDocument();
    });

    it('renders button with Slovak text by default', () => {
      renderWithTranslation(<ReportButton />);

      expect(screen.getByText('Nahlásiť')).toBeInTheDocument();
    });

    it('renders button with English text when language is English', () => {
      renderWithTranslation(<ReportButton />, { initialLanguage: 'en' });

      expect(screen.getByText('Report')).toBeInTheDocument();
    });

    it('does not show modal initially', () => {
      renderWithTranslation(<ReportButton />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  // ================================================================
  // INTERACTION TESTS
  // ================================================================

  describe('Interactions', () => {
    it('opens modal when button is clicked', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<ReportButton />);

      const button = screen.getByRole('button', { name: /nahlási/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Nahlásiť problém')).toBeInTheDocument();
      });
    });

    it('closes modal when close button is clicked', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<ReportButton />);

      // Open modal
      const openButton = screen.getByRole('button', { name: /nahlási/i });
      await user.click(openButton);

      // Wait for modal
      await waitFor(() => {
        expect(screen.getByText('Nahlásiť problém')).toBeInTheDocument();
      });

      // Close modal
      const closeButton = screen.getByRole('button', { name: 'Zavrieť' });
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText('Nahlásiť problém')).not.toBeInTheDocument();
      });
    });

    it('closes modal when overlay is clicked', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<ReportButton />);

      // Open modal
      const openButton = screen.getByRole('button', { name: /nahlási/i });
      await user.click(openButton);

      // Wait for modal
      await waitFor(() => {
        expect(screen.getByText('Nahlásiť problém')).toBeInTheDocument();
      });

      // Click overlay (parent of modal content)
      const overlay = screen.getByText('Nahlásiť problém').closest('div')?.parentElement?.parentElement;
      if (overlay) {
        await user.click(overlay);
      }

      await waitFor(() => {
        expect(screen.queryByText('Nahlásiť problém')).not.toBeInTheDocument();
      });
    });

    it('changes report type when type button is clicked', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<ReportButton />);

      // Open modal
      await user.click(screen.getByRole('button', { name: /nahlási/i }));

      // Wait for modal
      await waitFor(() => {
        expect(screen.getByText('Chyba')).toBeInTheDocument();
      });

      // Click feature type
      const featureButton = screen.getByRole('button', { name: /požiadavka na funkciu/i });
      await user.click(featureButton);

      // Verify feature button is active (has active class)
      expect(featureButton.className).toContain('modal__typeButton--active');
    });

    it('accepts textarea input', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<ReportButton />);

      // Open modal
      await user.click(screen.getByRole('button', { name: /nahlási/i }));

      // Wait for textarea
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/popíšte/i)).toBeInTheDocument();
      });

      // Type in textarea
      const textarea = screen.getByPlaceholderText(/popíšte/i);
      await user.type(textarea, 'Test description');

      expect(textarea).toHaveValue('Test description');
    });

    it('submit button is disabled when textarea is empty', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<ReportButton />);

      // Open modal
      await user.click(screen.getByRole('button', { name: /nahlási/i }));

      // Wait for submit button
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /odosla/i })).toBeInTheDocument();
      });

      const submitButton = screen.getByRole('button', { name: /odosla/i });
      expect(submitButton).toBeDisabled();
    });

    it('submit button is enabled when textarea has text', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<ReportButton />);

      // Open modal
      await user.click(screen.getByRole('button', { name: /nahlási/i }));

      // Wait for textarea
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/popíšte/i)).toBeInTheDocument();
      });

      // Type in textarea
      const textarea = screen.getByPlaceholderText(/popíšte/i);
      await user.type(textarea, 'Test description');

      const submitButton = screen.getByRole('button', { name: /odosla/i });
      expect(submitButton).not.toBeDisabled();
    });

    it('calls onReport callback when form is submitted', async () => {
      const user = userEvent.setup();
      const mockOnReport = vi.fn().mockResolvedValue(undefined);
      renderWithTranslation(<ReportButton onReport={mockOnReport} />);

      // Open modal
      await user.click(screen.getByRole('button', { name: /nahlási/i }));

      // Wait for textarea
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/popíšte/i)).toBeInTheDocument();
      });

      // Fill form
      const textarea = screen.getByPlaceholderText(/popíšte/i);
      await user.type(textarea, 'Test bug report');

      // Submit
      const submitButton = screen.getByRole('button', { name: /odosla/i });
      await user.click(submitButton);

      // Verify callback called
      await waitFor(() => {
        expect(mockOnReport).toHaveBeenCalledTimes(1);
      });

      const reportData: ReportData = mockOnReport.mock.calls[0][0];
      expect(reportData.type).toBe('bug');
      expect(reportData.description).toBe('Test bug report');
      expect(reportData.timestamp).toBeInstanceOf(Date);
    });

    it('closes modal after successful submission', async () => {
      const user = userEvent.setup();
      const mockOnReport = vi.fn().mockResolvedValue(undefined);
      renderWithTranslation(<ReportButton onReport={mockOnReport} />);

      // Open modal
      await user.click(screen.getByRole('button', { name: /nahlási/i }));

      // Wait for textarea
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/popíšte/i)).toBeInTheDocument();
      });

      // Fill and submit
      const textarea = screen.getByPlaceholderText(/popíšte/i);
      await user.type(textarea, 'Test report');

      const submitButton = screen.getByRole('button', { name: /odosla/i });
      await user.click(submitButton);

      // Modal should close
      await waitFor(() => {
        expect(screen.queryByText('Nahlásiť problém')).not.toBeInTheDocument();
      });
    });

    it('resets form after closing modal', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<ReportButton />);

      // Open modal
      await user.click(screen.getByRole('button', { name: /nahlási/i }));

      // Wait for textarea
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/popíšte/i)).toBeInTheDocument();
      });

      // Fill form
      const textarea = screen.getByPlaceholderText(/popíšte/i);
      await user.type(textarea, 'Test description');

      // Change type
      const featureButton = screen.getByRole('button', { name: /požiadavka na funkciu/i });
      await user.click(featureButton);

      // Close modal
      const closeButton = screen.getByRole('button', { name: 'Zavrieť' });
      await user.click(closeButton);

      // Reopen modal
      await user.click(screen.getByRole('button', { name: /nahlási/i }));

      // Verify form is reset
      await waitFor(() => {
        const newTextarea = screen.getByPlaceholderText(/popíšte/i);
        expect(newTextarea).toHaveValue('');
      });

      const bugButton = screen.getByRole('button', { name: /chyba/i });
      expect(bugButton.className).toContain('modal__typeButton--active');
    });
  });

  // ================================================================
  // PROPS TESTS
  // ================================================================

  describe('Props', () => {
    it('applies top-right position by default', () => {
      renderWithTranslation(<ReportButton />);

      const button = screen.getByRole('button', { name: /nahlási/i });
      expect(button.className).toContain('button--top-right');
    });

    it('applies top-left position', () => {
      renderWithTranslation(<ReportButton position="top-left" />);

      const button = screen.getByRole('button', { name: /nahlási/i });
      expect(button.className).toContain('button--top-left');
    });

    it('applies bottom-right position', () => {
      renderWithTranslation(<ReportButton position="bottom-right" />);

      const button = screen.getByRole('button', { name: /nahlási/i });
      expect(button.className).toContain('button--bottom-right');
    });

    it('applies bottom-left position', () => {
      renderWithTranslation(<ReportButton position="bottom-left" />);

      const button = screen.getByRole('button', { name: /nahlási/i });
      expect(button.className).toContain('button--bottom-left');
    });

    it('calls onReport with all report data fields', async () => {
      const user = userEvent.setup();
      const mockOnReport = vi.fn().mockResolvedValue(undefined);
      renderWithTranslation(<ReportButton onReport={mockOnReport} />);

      // Open modal
      await user.click(screen.getByRole('button', { name: /nahlási/i }));

      // Wait for form
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/popíšte/i)).toBeInTheDocument();
      });

      // Fill form
      await user.type(screen.getByPlaceholderText(/popíšte/i), 'Detailed bug report');
      await user.click(screen.getByRole('button', { name: /požiadavka na funkciu/i })); // Change to feature

      // Submit
      await user.click(screen.getByRole('button', { name: /odosla/i }));

      // Verify callback
      await waitFor(() => {
        expect(mockOnReport).toHaveBeenCalledTimes(1);
      });

      const reportData: ReportData = mockOnReport.mock.calls[0][0];
      expect(reportData).toMatchObject({
        type: 'feature',
        description: 'Detailed bug report',
        pageName: expect.any(String),
        pagePath: expect.any(String),
        userAgent: expect.any(String),
      });
      expect(reportData.timestamp).toBeInstanceOf(Date);
    });
  });

  // ================================================================
  // ACCESSIBILITY TESTS
  // ================================================================

  describe('Accessibility', () => {
    it('floating button has aria-label', () => {
      renderWithTranslation(<ReportButton />);

      const button = screen.getByRole('button', { name: /nahlási/i });
      expect(button).toHaveAttribute('aria-label');
    });

    it('floating button has title attribute', () => {
      renderWithTranslation(<ReportButton />);

      const button = screen.getByRole('button', { name: /nahlási/i });
      expect(button).toHaveAttribute('title');
    });

    it('close button has aria-label', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<ReportButton />);

      // Open modal
      await user.click(screen.getByRole('button', { name: /nahlási/i }));

      // Check close button
      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: 'Zavrieť' });
        expect(closeButton).toHaveAttribute('aria-label');
      });
    });

    it('textarea has proper label association', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<ReportButton />);

      // Open modal
      await user.click(screen.getByRole('button', { name: /nahlási/i }));

      // Check textarea
      await waitFor(() => {
        const textarea = screen.getByPlaceholderText(/popíšte/i);
        expect(textarea).toHaveAttribute('id', 'report-description');

        const label = screen.getByText(/popis/i);
        expect(label).toHaveAttribute('for', 'report-description');
      });
    });

    it('form buttons have proper type attributes', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<ReportButton />);

      // Open modal
      await user.click(screen.getByRole('button', { name: /nahlási/i }));

      // Check buttons
      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /odosla/i });
        expect(submitButton).toHaveAttribute('type', 'submit');

        const cancelButton = screen.getByRole('button', { name: 'Zrušiť' });
        expect(cancelButton).toHaveAttribute('type', 'button');
      });
    });

    it('type selection buttons have type="button"', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<ReportButton />);

      // Open modal
      await user.click(screen.getByRole('button', { name: /nahlási/i }));

      // Check type buttons
      await waitFor(() => {
        const bugButton = screen.getByRole('button', { name: /chyba/i });
        expect(bugButton).toHaveAttribute('type', 'button');

        const featureButton = screen.getByRole('button', { name: /požiadavka na funkciu/i });
        expect(featureButton).toHaveAttribute('type', 'button');
      });
    });
  });

  // ================================================================
  // TRANSLATION SUPPORT TESTS
  // ================================================================

  describe('Translation Support', () => {
    it('displays all Slovak translations', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<ReportButton />);

      // Button
      expect(screen.getByText('Nahlásiť')).toBeInTheDocument();

      // Open modal
      await user.click(screen.getByRole('button', { name: /nahlási/i }));

      // Modal texts
      await waitFor(() => {
        expect(screen.getByText('Nahlásiť problém')).toBeInTheDocument();
        expect(screen.getByText(/tento formulár slúži/i)).toBeInTheDocument();
        expect(screen.getByText('Typ problému')).toBeInTheDocument();
        expect(screen.getByText('Chyba')).toBeInTheDocument();
        expect(screen.getByText('Požiadavka na funkciu')).toBeInTheDocument();
        expect(screen.getByText('Vylepšenie')).toBeInTheDocument();
        expect(screen.getByText('Otázka')).toBeInTheDocument();
        expect(screen.getByText('Popis')).toBeInTheDocument();
        expect(screen.getByText('Zrušiť')).toBeInTheDocument();
        expect(screen.getByText('Odoslať')).toBeInTheDocument();
      });
    });

    it('displays all English translations', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<ReportButton />, { initialLanguage: 'en' });

      // Button
      expect(screen.getByText('Report')).toBeInTheDocument();

      // Open modal
      await user.click(screen.getByRole('button', { name: /report/i }));

      // Modal texts
      await waitFor(() => {
        expect(screen.getByText('Report Issue')).toBeInTheDocument();
        expect(screen.getByText(/this form is for reporting bugs/i)).toBeInTheDocument();
        expect(screen.getByText('Issue Type')).toBeInTheDocument();
        expect(screen.getByText('Bug')).toBeInTheDocument();
        expect(screen.getByText('Feature Request')).toBeInTheDocument();
        expect(screen.getByText('Improvement')).toBeInTheDocument();
        expect(screen.getByText('Question')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('Submit')).toBeInTheDocument();
      });
    });

    it('shows submitting state in Slovak', async () => {
      const user = userEvent.setup();
      const mockOnReport = vi.fn(() => new Promise((resolve) => setTimeout(resolve, 1000)));
      renderWithTranslation(<ReportButton onReport={mockOnReport} />);

      // Open modal and fill form
      await user.click(screen.getByRole('button', { name: /nahlási/i }));

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/popíšte/i)).toBeInTheDocument();
      });

      await user.type(screen.getByPlaceholderText(/popíšte/i), 'Test');

      // Submit
      await user.click(screen.getByRole('button', { name: /odosla/i }));

      // Check submitting state
      expect(screen.getByText('Odosielam...')).toBeInTheDocument();
    });

    it('shows submitting state in English', async () => {
      const user = userEvent.setup();
      const mockOnReport = vi.fn(() => new Promise((resolve) => setTimeout(resolve, 1000)));
      renderWithTranslation(<ReportButton onReport={mockOnReport} />, { initialLanguage: 'en' });

      // Open modal and fill form
      await user.click(screen.getByRole('button', { name: /report/i }));

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/describe/i)).toBeInTheDocument();
      });

      await user.type(screen.getByPlaceholderText(/describe/i), 'Test');

      // Submit
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Check submitting state
      expect(screen.getByText('Submitting...')).toBeInTheDocument();
    });
  });
});
