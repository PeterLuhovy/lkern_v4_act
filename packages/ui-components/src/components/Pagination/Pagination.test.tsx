/*
 * ================================================================
 * FILE: Pagination.test.tsx
 * PATH: /packages/ui-components/src/components/Pagination/Pagination.test.tsx
 * DESCRIPTION: Comprehensive tests for Pagination component (18 test scenarios)
 * VERSION: v1.0.0
 * CREATED: 2025-11-07
 * UPDATED: 2025-11-07 16:00:00
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithTranslation, screen, fireEvent } from '../../test-utils';
import { Pagination, type PaginationProps } from './Pagination';

// ================================================================
// TEST DATA
// ================================================================

const defaultProps: PaginationProps = {
  currentPage: 1,
  totalPages: 10,
  totalItems: 200,
  itemsPerPage: 20,
  onPageChange: vi.fn(),
};

// ================================================================
// TESTS
// ================================================================

describe('Pagination', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  // ================================================================
  // BASIC RENDERING (1-4)
  // ================================================================

  describe('Basic Rendering', () => {
    it('1. renders with current page and total pages', () => {
      renderWithTranslation(<Pagination {...defaultProps} currentPage={2} />);

      // Verify page count display: "Strana 2 z 10"
      const container = screen.getByText(/📊/i).parentElement;
      expect(container?.textContent).toContain('Strana');
      expect(container?.textContent).toContain('2 z 10');
    });

    it('2. renders record count info (start-end of total)', () => {
      renderWithTranslation(<Pagination {...defaultProps} currentPage={2} />);

      // Page 2: items 21-40 of 200
      // "21-40 z 200 položiek"
      const container = screen.getByText(/📊/i).parentElement;
      expect(container?.textContent).toContain('21-40');
      expect(container?.textContent).toContain('200');
    });

    it('3. renders page number buttons', () => {
      renderWithTranslation(<Pagination {...defaultProps} currentPage={1} totalPages={5} />);

      // Should show page buttons: [1][2][3][4][5]
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
    });

    it('4. renders Previous/Next buttons', () => {
      renderWithTranslation(<Pagination {...defaultProps} currentPage={2} />);

      // Previous button: ◀
      const prevButton = screen.getByRole('button', { name: /◀/ });
      expect(prevButton).toBeInTheDocument();

      // Next button: ▶
      const nextButton = screen.getByRole('button', { name: /▶/ });
      expect(nextButton).toBeInTheDocument();
    });
  });

  // ================================================================
  // NAVIGATION (5-9)
  // ================================================================

  describe('Navigation', () => {
    it('5. Previous button calls onPageChange(currentPage - 1)', () => {
      const mockOnPageChange = vi.fn();
      renderWithTranslation(
        <Pagination {...defaultProps} currentPage={3} onPageChange={mockOnPageChange} />
      );

      const prevButton = screen.getByRole('button', { name: /◀/ });
      fireEvent.click(prevButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    it('6. Next button calls onPageChange(currentPage + 1)', () => {
      const mockOnPageChange = vi.fn();
      renderWithTranslation(
        <Pagination {...defaultProps} currentPage={3} onPageChange={mockOnPageChange} />
      );

      const nextButton = screen.getByRole('button', { name: /▶/ });
      fireEvent.click(nextButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(4);
    });

    it('7. Page number button calls onPageChange(page)', () => {
      const mockOnPageChange = vi.fn();
      renderWithTranslation(
        <Pagination {...defaultProps} currentPage={1} onPageChange={mockOnPageChange} />
      );

      const page3Button = screen.getByRole('button', { name: '3' });
      fireEvent.click(page3Button);

      expect(mockOnPageChange).toHaveBeenCalledWith(3);
    });

    it('8. Previous button disabled on page 1', () => {
      renderWithTranslation(<Pagination {...defaultProps} currentPage={1} />);

      const prevButton = screen.getByRole('button', { name: /◀/ });
      expect(prevButton).toBeDisabled();
    });

    it('9. Next button disabled on last page', () => {
      renderWithTranslation(<Pagination {...defaultProps} currentPage={10} totalPages={10} />);

      const nextButton = screen.getByRole('button', { name: /▶/ });
      expect(nextButton).toBeDisabled();
    });
  });

  // ================================================================
  // WINDOWING (10-14)
  // ================================================================

  describe('Windowing', () => {
    it('10. shows max 5 page numbers at a time', () => {
      renderWithTranslation(<Pagination {...defaultProps} currentPage={1} totalPages={100} />);

      // Should show exactly 5 page buttons
      const pageButtons = screen
        .getAllByRole('button')
        .filter((btn) => /^[0-9]+$/.test(btn.textContent || ''));

      expect(pageButtons).toHaveLength(5);
    });

    it('11. window centers around current page', () => {
      renderWithTranslation(<Pagination {...defaultProps} currentPage={5} totalPages={10} />);

      // Current page 5 should show: [3][4][5][6][7]
      expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '6' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '7' })).toBeInTheDocument();
    });

    it('12. shows [1][2][3][4][5] when currentPage=1, totalPages=10', () => {
      renderWithTranslation(<Pagination {...defaultProps} currentPage={1} totalPages={10} />);

      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();

      // Should NOT show page 6
      expect(screen.queryByRole('button', { name: '6' })).not.toBeInTheDocument();
    });

    it('13. shows [6][7][8][9][10] when currentPage=10, totalPages=10', () => {
      renderWithTranslation(
        <Pagination {...defaultProps} currentPage={10} totalPages={10} totalItems={200} />
      );

      expect(screen.getByRole('button', { name: '6' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '7' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '8' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '9' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();

      // Should NOT show page 5
      expect(screen.queryByRole('button', { name: '5' })).not.toBeInTheDocument();
    });

    it('14. shows [48][49][50][51][52] when currentPage=50, totalPages=100', () => {
      renderWithTranslation(
        <Pagination
          {...defaultProps}
          currentPage={50}
          totalPages={100}
          totalItems={2000}
          itemsPerPage={20}
        />
      );

      expect(screen.getByRole('button', { name: '48' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '49' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '50' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '51' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '52' })).toBeInTheDocument();

      // Should NOT show page 47 or 53
      expect(screen.queryByRole('button', { name: '47' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: '53' })).not.toBeInTheDocument();
    });
  });

  // ================================================================
  // ENABLE/DISABLE (15-17)
  // ================================================================

  describe('Enable/Disable', () => {
    it('15. checkbox toggle calls onEnabledChange', () => {
      const mockOnEnabledChange = vi.fn();
      renderWithTranslation(
        <Pagination
          {...defaultProps}
          enabled={true}
          onEnabledChange={mockOnEnabledChange}
        />
      );

      // Find checkbox by label text (SK: "Stránkovanie")
      const checkbox = screen.getByRole('checkbox', { name: /stránkovanie/i });
      fireEvent.click(checkbox);

      expect(mockOnEnabledChange).toHaveBeenCalledWith(false);
    });

    it('16. when disabled: shows "Page 1 of 1" + "1-N of N items"', () => {
      renderWithTranslation(
        <Pagination
          {...defaultProps}
          enabled={false}
          currentPage={5}
          totalPages={10}
          totalItems={200}
        />
      );

      // Should display: "Strana 1 z 1"
      const container = screen.getByText(/📊/i).parentElement;
      expect(container?.textContent).toContain('Strana 1 z 1');

      // Should display: "1-200 z 200" (all items)
      expect(container?.textContent).toContain('1-200 z 200');
    });

    it('17. when disabled: Previous/Next buttons disabled', () => {
      renderWithTranslation(
        <Pagination
          {...defaultProps}
          enabled={false}
          currentPage={5}
          totalPages={10}
        />
      );

      const prevButton = screen.getByRole('button', { name: /◀/ });
      const nextButton = screen.getByRole('button', { name: /▶/ });

      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });
  });

  // ================================================================
  // TRANSLATION (18)
  // ================================================================

  describe('Translation', () => {
    it('18. text changes when language switches (SK ↔ EN)', () => {
      // Test Slovak
      const { unmount: unmountSk } = renderWithTranslation(
        <Pagination {...defaultProps} currentPage={2} enabled={true} onEnabledChange={vi.fn()} />,
        { initialLanguage: 'sk' }
      );

      // Slovak text
      let container = screen.getByText(/📊/i).parentElement;
      expect(container?.textContent).toContain('Strana');
      expect(container?.textContent).toContain('položiek');
      expect(screen.getByText(/stránkovanie/i)).toBeInTheDocument();

      // Unmount Slovak version
      unmountSk();

      // Render with English
      renderWithTranslation(
        <Pagination {...defaultProps} currentPage={2} enabled={true} onEnabledChange={vi.fn()} />,
        { initialLanguage: 'en' }
      );

      // English text
      container = screen.getByText(/📊/i).parentElement;
      expect(container?.textContent).toContain('Page');
      expect(container?.textContent).toContain('items');
      expect(screen.getByText(/pagination/i)).toBeInTheDocument();
    });
  });

  // ================================================================
  // EDGE CASES
  // ================================================================

  describe('Edge Cases', () => {
    it('renders correctly with only 1 page', () => {
      renderWithTranslation(
        <Pagination
          {...defaultProps}
          currentPage={1}
          totalPages={1}
          totalItems={5}
          itemsPerPage={20}
        />
      );

      // Should show "Strana 1 z 1"
      const container = screen.getByText(/📊/i).parentElement;
      expect(container?.textContent).toContain('1');

      // Should show "1-5 z 5 položiek"
      expect(container?.textContent).toContain('1-5');
      expect(container?.textContent).toContain('5');

      // Only page 1 button should be visible
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: '2' })).not.toBeInTheDocument();
    });

    it('renders correctly on last page with partial items', () => {
      // Last page: 10, totalItems: 195, itemsPerPage: 20
      // Should show items 181-195 (15 items)
      renderWithTranslation(
        <Pagination
          {...defaultProps}
          currentPage={10}
          totalPages={10}
          totalItems={195}
          itemsPerPage={20}
        />
      );

      const container = screen.getByText(/📊/i).parentElement;
      // Should show "181-195 z 195"
      expect(container?.textContent).toContain('181-195');
      expect(container?.textContent).toContain('195');
    });

    it('calculates correct start/end items for each page', () => {
      // Page 1: 1-20
      const { rerender } = renderWithTranslation(
        <Pagination {...defaultProps} currentPage={1} />
      );
      let container = screen.getByText(/📊/i).parentElement;
      expect(container?.textContent).toContain('1-20');

      // Page 2: 21-40
      rerender(<Pagination {...defaultProps} currentPage={2} />);
      container = screen.getByText(/📊/i).parentElement;
      expect(container?.textContent).toContain('21-40');

      // Page 3: 41-60
      rerender(<Pagination {...defaultProps} currentPage={3} />);
      container = screen.getByText(/📊/i).parentElement;
      expect(container?.textContent).toContain('41-60');
    });
  });

  // ================================================================
  // BUTTON VARIANTS
  // ================================================================

  describe('Button Variants', () => {
    it('active page button has primary variant', () => {
      renderWithTranslation(<Pagination {...defaultProps} currentPage={3} />);

      const page3Button = screen.getByRole('button', { name: '3' });

      // Primary variant has specific class (check parent or button itself)
      expect(page3Button.className).toContain('primary');
    });

    it('inactive page buttons have secondary variant', () => {
      renderWithTranslation(<Pagination {...defaultProps} currentPage={3} />);

      const page2Button = screen.getByRole('button', { name: '2' });

      // Secondary variant has specific class
      expect(page2Button.className).toContain('secondary');
    });
  });

  // ================================================================
  // ACCESSIBILITY
  // ================================================================

  describe('Accessibility', () => {
    it('Previous/Next buttons have title attributes', () => {
      renderWithTranslation(<Pagination {...defaultProps} currentPage={2} />);

      const prevButton = screen.getByRole('button', { name: /◀/ });
      const nextButton = screen.getByRole('button', { name: /▶/ });

      expect(prevButton).toHaveAttribute('title');
      expect(nextButton).toHaveAttribute('title');
    });

    it('checkbox has accessible label', () => {
      renderWithTranslation(
        <Pagination {...defaultProps} enabled={true} onEnabledChange={vi.fn()} />
      );

      const checkbox = screen.getByRole('checkbox', { name: /stránkovanie/i });
      expect(checkbox).toBeInTheDocument();
    });

    it('emoji has aria-label', () => {
      renderWithTranslation(<Pagination {...defaultProps} />);

      // Emoji with aria-label
      const emoji = screen.getByRole('img', { name: 'chart' });
      expect(emoji).toBeInTheDocument();
    });
  });
});
