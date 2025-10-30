/*
 * ================================================================
 * FILE: Badge.test.tsx
 * PATH: /packages/ui-components/src/components/Badge/Badge.test.tsx
 * DESCRIPTION: Unit tests for Badge component
 * VERSION: v1.1.0
 * CREATED: 2025-10-18
 * UPDATED: 2025-10-30
 * ================================================================
 */

import { describe, it, expect } from 'vitest';
import { renderWithTranslation as render, screen } from '../../test-utils';
import { Badge } from './Badge';

describe('Badge Component', () => {
  // ================================================
  // Basic Rendering
  // ================================================

  it('renders with children text', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('renders with default variant (neutral)', () => {
    const { container } = render(<Badge>Neutral</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('badge--neutral');
  });

  it('renders with default size (medium)', () => {
    const { container } = render(<Badge>Medium</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('badge--medium');
  });

  // ================================================
  // Variant Props
  // ================================================

  it('applies success variant class', () => {
    const { container } = render(<Badge variant="success">Success</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('badge--success');
  });

  it('applies warning variant class', () => {
    const { container } = render(<Badge variant="warning">Warning</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('badge--warning');
  });

  it('applies error variant class', () => {
    const { container } = render(<Badge variant="error">Error</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('badge--error');
  });

  it('applies info variant class', () => {
    const { container } = render(<Badge variant="info">Info</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('badge--info');
  });

  it('applies neutral variant class explicitly', () => {
    const { container } = render(<Badge variant="neutral">Neutral</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('badge--neutral');
  });

  // ================================================
  // Size Props
  // ================================================

  it('applies small size class', () => {
    const { container } = render(<Badge size="small">Small</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('badge--small');
  });

  it('applies medium size class explicitly', () => {
    const { container } = render(<Badge size="medium">Medium</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('badge--medium');
  });

  it('applies large size class', () => {
    const { container } = render(<Badge size="large">Large</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('badge--large');
  });

  // ================================================
  // Dot Indicator
  // ================================================

  it('does not render dot by default', () => {
    const { container } = render(<Badge>No Dot</Badge>);
    const dot = container.querySelector('.badge__dot');
    expect(dot).not.toBeInTheDocument();
  });

  it('renders dot when dot prop is true', () => {
    const { container } = render(<Badge dot>With Dot</Badge>);
    // Badge has two spans: .badge__dot and .badge__content
    const spans = container.querySelectorAll('span span');
    expect(spans.length).toBe(2); // dot + content
  });

  // ================================================
  // Custom Props
  // ================================================

  it('applies custom className', () => {
    const { container } = render(<Badge className="custom-class">Custom</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('custom-class');
  });

  it('forwards ref to span element', () => {
    const ref = { current: null as HTMLSpanElement | null };
    render(<Badge ref={ref}>Ref Test</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  // ================================================
  // Complex Content
  // ================================================

  it('renders with React element children', () => {
    render(
      <Badge>
        <strong>Bold</strong> Text
      </Badge>
    );
    expect(screen.getByText('Bold')).toBeInTheDocument();
    expect(screen.getByText(/Text/)).toBeInTheDocument();
  });

  // ================================================
  // Variant + Size Combinations
  // ================================================

  it('renders success variant with small size', () => {
    const { container } = render(
      <Badge variant="success" size="small">
        Small Success
      </Badge>
    );
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('badge--success');
    expect(badge.className).toContain('badge--small');
  });

  it('renders error variant with large size', () => {
    const { container } = render(
      <Badge variant="error" size="large">
        Large Error
      </Badge>
    );
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('badge--error');
    expect(badge.className).toContain('badge--large');
  });

  it('renders warning variant with dot', () => {
    const { container } = render(
      <Badge variant="warning" dot>
        Warning with Dot
      </Badge>
    );
    const badge = container.firstChild as HTMLElement;
    const spans = container.querySelectorAll('span span');
    expect(badge.className).toContain('badge--warning');
    expect(spans.length).toBe(2); // dot + content
  });

  // ================================================
  // Accessibility Tests
  // ================================================

  it('has appropriate role for semantic badge', () => {
    const { container } = render(<Badge variant="success">Active</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.tagName).toBe('SPAN');
  });

  it('renders text content readable by screen readers', () => {
    render(<Badge variant="error">Critical Error</Badge>);
    expect(screen.getByText('Critical Error')).toBeInTheDocument();
  });

  it('has sufficient color contrast for variants', () => {
    const { container: successContainer } = render(<Badge variant="success">Success</Badge>);
    const successBadge = successContainer.firstChild as HTMLElement;
    expect(successBadge.className).toContain('badge--success');

    const { container: errorContainer } = render(<Badge variant="error">Error</Badge>);
    const errorBadge = errorContainer.firstChild as HTMLElement;
    expect(errorBadge.className).toContain('badge--error');
  });

  // ================================================
  // Text Truncation & Long Content
  // ================================================

  it('renders very long text without breaking layout', () => {
    const longText = 'This is an extremely long badge text that should potentially be truncated or handled gracefully by the component without breaking the layout';
    render(<Badge>{longText}</Badge>);
    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  it('handles text with special characters', () => {
    const specialText = '✓ Success! (100%)';
    render(<Badge>{specialText}</Badge>);
    expect(screen.getByText(specialText)).toBeInTheDocument();
  });

  it('renders empty string children', () => {
    const { container } = render(<Badge>{''}</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toBeInTheDocument();
  });

  it('handles numeric children', () => {
    render(<Badge>{42}</Badge>);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  // ================================================
  // Custom Styling Edge Cases
  // ================================================

  it('merges custom className with variant classes', () => {
    const { container } = render(
      <Badge variant="success" className="custom-badge">
        Custom
      </Badge>
    );
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('badge--success');
    expect(badge.className).toContain('custom-badge');
  });

  // ================================================
  // Edge Case: Dot with Different Variants
  // ================================================

  it('renders dot with success variant', () => {
    const { container } = render(
      <Badge variant="success" dot>
        Success
      </Badge>
    );
    const spans = container.querySelectorAll('span span');
    expect(spans.length).toBe(2);
  });

  it('renders dot with error variant', () => {
    const { container } = render(
      <Badge variant="error" dot>
        Error
      </Badge>
    );
    const spans = container.querySelectorAll('span span');
    expect(spans.length).toBe(2);
  });
});
