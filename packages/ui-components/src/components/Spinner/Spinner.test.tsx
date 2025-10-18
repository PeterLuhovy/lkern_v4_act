/*
 * ================================================================
 * FILE: Spinner.test.tsx
 * PATH: /packages/ui-components/src/components/Spinner/Spinner.test.tsx
 * DESCRIPTION: Unit tests for Spinner component
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
 * ================================================================
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner Component', () => {
  // ================================================
  // Basic Rendering
  // ================================================

  it('renders without crashing', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with default size (medium)', () => {
    const { container } = render(<Spinner />);
    const spinner = container.firstChild as HTMLElement;
    expect(spinner.className).toContain('spinner--medium');
  });

  it('does not render label by default', () => {
    render(<Spinner />);
    const label = screen.queryByText(/./);
    expect(label).not.toBeInTheDocument();
  });

  // ================================================
  // Size Props
  // ================================================

  it('applies small size class', () => {
    const { container } = render(<Spinner size="small" />);
    const spinner = container.firstChild as HTMLElement;
    expect(spinner.className).toContain('spinner--small');
  });

  it('applies medium size class explicitly', () => {
    const { container } = render(<Spinner size="medium" />);
    const spinner = container.firstChild as HTMLElement;
    expect(spinner.className).toContain('spinner--medium');
  });

  it('applies large size class', () => {
    const { container } = render(<Spinner size="large" />);
    const spinner = container.firstChild as HTMLElement;
    expect(spinner.className).toContain('spinner--large');
  });

  // ================================================
  // Label Prop
  // ================================================

  it('renders label when provided', () => {
    render(<Spinner label="Loading..." />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders custom label text', () => {
    render(<Spinner label="Načítavam dáta" />);
    expect(screen.getByText('Načítavam dáta')).toBeInTheDocument();
  });

  // ================================================
  // Color Prop
  // ================================================

  it('applies custom color to spinner circle', () => {
    const { container } = render(<Spinner color="#ff0000" />);
    // Spinner has nested div: spinner container > spinner__ring
    const spinner = container.firstChild as HTMLElement;
    const ring = spinner.firstChild as HTMLElement;
    // Custom color is applied to borderTopColor and borderRightColor (preserves hex format)
    expect(ring.style.borderTopColor).toBe('#ff0000');
    expect(ring.style.borderRightColor).toBe('#ff0000');
  });

  it('uses default color when color prop not provided', () => {
    const { container } = render(<Spinner />);
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
    const { container } = render(<Spinner className="custom-spinner" />);
    const spinner = container.firstChild as HTMLElement;
    expect(spinner.className).toContain('custom-spinner');
  });

  it('forwards ref to div element', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Spinner ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  // ================================================
  // Combined Props
  // ================================================

  it('renders small spinner with label', () => {
    const { container } = render(<Spinner size="small" label="Loading" />);
    const spinner = container.firstChild as HTMLElement;
    expect(spinner.className).toContain('spinner--small');
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('renders large spinner with custom color and label', () => {
    const { container } = render(
      <Spinner size="large" color="#00ff00" label="Please wait..." />
    );
    const spinner = container.firstChild as HTMLElement;
    const ring = spinner.firstChild as HTMLElement;

    expect(spinner.className).toContain('spinner--large');
    expect(ring.style.borderTopColor).toBe('#00ff00');
    expect(ring.style.borderRightColor).toBe('#00ff00');
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });
});
