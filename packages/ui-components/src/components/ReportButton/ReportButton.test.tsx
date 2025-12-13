/*
 * ================================================================
 * FILE: ReportButton.test.tsx
 * PATH: /packages/ui-components/src/components/ReportButton/ReportButton.test.tsx
 * DESCRIPTION: Test suite for ReportButton component (v2.0.0)
 * VERSION: v2.0.0
 * CREATED: 2025-11-08
 * UPDATED: 2025-12-11
 * CHANGES:
 *   - v2.0.0: Updated tests for new API (no internal modal)
 *   - v1.0.0: Initial version with internal modal tests
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithTranslation, screen, userEvent } from '../../test-utils';
import { ReportButton } from './ReportButton';

describe('ReportButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

      expect(screen.getByText('Nahlásiť chybu / návrh')).toBeInTheDocument();
    });

    it('renders button with English text when language is English', () => {
      renderWithTranslation(<ReportButton />, { initialLanguage: 'en' });

      expect(screen.getByText('Report issue')).toBeInTheDocument();
    });

    it('renders button with exclamation icon', () => {
      renderWithTranslation(<ReportButton />);

      expect(screen.getByText('!')).toBeInTheDocument();
    });
  });

  // ================================================================
  // INTERACTION TESTS
  // ================================================================

  describe('Interactions', () => {
    it('calls onClick callback when button is clicked', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      renderWithTranslation(<ReportButton onClick={handleClick} />);

      await user.click(screen.getByRole('button', { name: /nahlási/i }));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not throw when onClick is not provided', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<ReportButton />);

      // Should not throw
      await user.click(screen.getByRole('button', { name: /nahlási/i }));
    });
  });

  // ================================================================
  // POSITION PROPS TESTS
  // ================================================================

  describe('Position Props', () => {
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
  });

  // ================================================================
  // ACCESSIBILITY TESTS
  // ================================================================

  describe('Accessibility', () => {
    it('button has aria-label', () => {
      renderWithTranslation(<ReportButton />);

      const button = screen.getByRole('button', { name: /nahlási/i });
      expect(button).toHaveAttribute('aria-label', 'Nahlásiť chybu alebo navrhnúť vylepšenie');
    });

    it('button has title attribute', () => {
      renderWithTranslation(<ReportButton />);

      const button = screen.getByRole('button', { name: /nahlási/i });
      expect(button).toHaveAttribute('title', 'Nahlásiť chybu alebo navrhnúť vylepšenie');
    });

    it('button has type="button"', () => {
      renderWithTranslation(<ReportButton />);

      const button = screen.getByRole('button', { name: /nahlási/i });
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  // ================================================================
  // TRANSLATION SUPPORT TESTS
  // ================================================================

  describe('Translation Support', () => {
    it('displays Slovak translations by default', () => {
      renderWithTranslation(<ReportButton />);

      // Button text
      expect(screen.getByText('Nahlásiť chybu / návrh')).toBeInTheDocument();

      // Button title/aria-label
      const button = screen.getByRole('button', { name: /nahlási/i });
      expect(button).toHaveAttribute('title', 'Nahlásiť chybu alebo navrhnúť vylepšenie');
    });

    it('displays English translations when language is English', () => {
      renderWithTranslation(<ReportButton />, { initialLanguage: 'en' });

      // Button text
      expect(screen.getByText('Report issue')).toBeInTheDocument();

      // Button title/aria-label
      const button = screen.getByRole('button', { name: /report/i });
      expect(button).toHaveAttribute('title', 'Report issue or suggest improvement');
    });
  });

  // ================================================================
  // CSS CLASS TESTS
  // ================================================================

  describe('CSS Classes', () => {
    it('has base button class', () => {
      renderWithTranslation(<ReportButton />);

      const button = screen.getByRole('button', { name: /nahlási/i });
      expect(button.className).toMatch(/button/);
    });

    it('has icon span', () => {
      const { container } = renderWithTranslation(<ReportButton />);

      const iconSpan = container.querySelector('[class*="button__icon"]');
      expect(iconSpan).toBeInTheDocument();
      expect(iconSpan).toHaveTextContent('!');
    });

    it('has label span', () => {
      const { container } = renderWithTranslation(<ReportButton />);

      const labelSpan = container.querySelector('[class*="button__label"]');
      expect(labelSpan).toBeInTheDocument();
    });
  });
});
