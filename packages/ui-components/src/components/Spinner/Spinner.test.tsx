/*
 * ================================================================
 * FILE: Spinner.test.tsx
 * PATH: /packages/ui-components/src/components/Spinner/Spinner.test.tsx
 * DESCRIPTION: Unit tests for Spinner component
 * VERSION: v1.1.0
 * CREATED: 2025-10-18
 * UPDATED: 2025-10-19
 * ================================================================
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TranslationProvider } from '@l-kern/config';
import { Spinner } from './Spinner';

// Helper function to render with TranslationProvider
const renderWithTranslation = (ui: React.ReactElement) => {
  return render(<TranslationProvider>{ui}</TranslationProvider>);
};

describe('Spinner Component', () => {
  // ================================================
  // Basic Rendering
  // ================================================

  it('renders without crashing', () => {
    const { container } = renderWithTranslation(<Spinner />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with default size (medium)', () => {
    const { container } = renderWithTranslation(<Spinner />);
    const spinner = container.firstChild as HTMLElement;
    expect(spinner.className).toContain('spinner--medium');
  });

  it('does not render label by default', () => {
    renderWithTranslation(<Spinner />);
    const label = screen.queryByText(/./);
    expect(label).not.toBeInTheDocument();
  });

  // ================================================
  // Size Props
  // ================================================

  it('applies small size class', () => {
    const { container } = renderWithTranslation(<Spinner size="small" />);
    const spinner = container.firstChild as HTMLElement;
    expect(spinner.className).toContain('spinner--small');
  });

  it('applies medium size class explicitly', () => {
    const { container } = renderWithTranslation(<Spinner size="medium" />);
    const spinner = container.firstChild as HTMLElement;
    expect(spinner.className).toContain('spinner--medium');
  });

  it('applies large size class', () => {
    const { container } = renderWithTranslation(<Spinner size="large" />);
    const spinner = container.firstChild as HTMLElement;
    expect(spinner.className).toContain('spinner--large');
  });

  // ================================================
  // Label Prop
  // ================================================

  it('renders label when provided', () => {
    // ✅ CORRECT: Test that label prop works (language-independent)
    const customLabel = 'Custom Label Text';
    renderWithTranslation(<Spinner label={customLabel} data-testid="spinner-with-label" />);

    const spinner = screen.getByTestId('spinner-with-label');
    expect(spinner.textContent).toContain(customLabel);
  });

  it('renders any label text provided by parent', () => {
    // ✅ CORRECT: Test structure, not specific language
    // Parent provides translated text via t(), we just verify it renders
    const arbitraryLabel = 'Any Text Here';
    renderWithTranslation(<Spinner label={arbitraryLabel} data-testid="labeled-spinner" />);

    const spinner = screen.getByTestId('labeled-spinner');
    expect(spinner.textContent).toBe(arbitraryLabel);
  });

  // ================================================
  // Color Prop
  // ================================================

  it('applies custom color to spinner circle', () => {
    const { container } = renderWithTranslation(<Spinner color="#ff0000" />);
    // Spinner has nested div: spinner container > spinner__ring
    const spinner = container.firstChild as HTMLElement;
    const ring = spinner.firstChild as HTMLElement;
    // Custom color is applied to borderTopColor and borderRightColor (preserves hex format)
    expect(ring.style.borderTopColor).toBe('#ff0000');
    expect(ring.style.borderRightColor).toBe('#ff0000');
  });

  it('uses default color when color prop not provided', () => {
    const { container } = renderWithTranslation(<Spinner />);
    const spinner = container.firstChild as HTMLElement;
    const ring = spinner.firstChild as HTMLElement;
    // No inline style when using default CSS variable
    expect(ring.style.borderTopColor).toBe('');
    expect(ring.style.borderRightColor).toBe('');
  });

  // ================================================
  // Custom Props
  // ================================================

  it('applies custom className', () => {
    const { container } = renderWithTranslation(<Spinner className="custom-spinner" />);
    const spinner = container.firstChild as HTMLElement;
    expect(spinner.className).toContain('custom-spinner');
  });

  it('forwards ref to div element', () => {
    const ref = { current: null as HTMLDivElement | null };
    renderWithTranslation(<Spinner ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  // ================================================
  // Combined Props
  // ================================================

  it('renders small spinner with label', () => {
    // ✅ CORRECT: Test combined props (size + label)
    const testLabel = 'Test Label';
    const { container } = renderWithTranslation(<Spinner size="small" label={testLabel} data-testid="small-spinner" />);
    const spinner = container.firstChild as HTMLElement;
    expect(spinner.className).toContain('spinner--small');

    const spinnerElement = screen.getByTestId('small-spinner');
    expect(spinnerElement.textContent).toContain(testLabel);
  });

  it('renders large spinner with custom color and label', () => {
    // ✅ CORRECT: Test multiple props together
    const testLabel = 'Custom Text';
    const { container } = renderWithTranslation(
      <Spinner size="large" color="#00ff00" label={testLabel} data-testid="large-spinner" />
    );
    const spinner = container.firstChild as HTMLElement;
    const ring = spinner.firstChild as HTMLElement;

    expect(spinner.className).toContain('spinner--large');
    expect(ring.style.borderTopColor).toBe('#00ff00');
    expect(ring.style.borderRightColor).toBe('#00ff00');

    const spinnerElement = screen.getByTestId('large-spinner');
    expect(spinnerElement.textContent).toContain(testLabel);
  });
});
