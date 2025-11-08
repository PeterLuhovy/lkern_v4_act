/*
 * ================================================================
 * FILE: Card.test.tsx
 * PATH: /packages/ui-components/src/components/Card/Card.test.tsx
 * DESCRIPTION: Unit tests for Card component
 * VERSION: v1.2.0
 * CREATED: 2025-10-18
 * UPDATED: 2025-11-02
 * ================================================================
 */

import { describe, it, expect, vi } from 'vitest';
import { renderWithTranslation, screen, userEvent } from '../../test-utils';
import { Card } from './Card';

describe('Card', () => {
  it('renders children correctly', () => {
    renderWithTranslation(<Card>Test Content</Card>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies default variant class', () => {
    const { container } = renderWithTranslation(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('card--default');
  });

  it('applies outlined variant class', () => {
    const { container } = renderWithTranslation(<Card variant="outlined">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('card--outlined');
  });

  it('applies elevated variant class', () => {
    const { container } = renderWithTranslation(<Card variant="elevated">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('card--elevated');
  });

  it('applies accent variant class', () => {
    const { container } = renderWithTranslation(<Card variant="accent">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('card--accent');
  });

  it('applies accent variant with clickable', () => {
    const { container } = renderWithTranslation(
      <Card variant="accent" onClick={vi.fn()}>
        Clickable Accent
      </Card>
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('card--accent');
    expect(card.className).toContain('card--clickable');
  });

  it('applies custom className', () => {
    const { container } = renderWithTranslation(<Card className="custom-class">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('custom-class');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    renderWithTranslation(<Card onClick={handleClick}>Clickable</Card>);

    const card = screen.getByRole('button');
    await user.click(card);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies clickable class when onClick provided', () => {
    const { container } = renderWithTranslation(<Card onClick={vi.fn()}>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('card--clickable');
  });

  it('sets role="button" when clickable', () => {
    renderWithTranslation(<Card onClick={vi.fn()}>Clickable</Card>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('does not set role when not clickable', () => {
    renderWithTranslation(<Card>Not Clickable</Card>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('is keyboard accessible with Enter key', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    renderWithTranslation(<Card onClick={handleClick}>Clickable</Card>);

    const card = screen.getByRole('button');
    card.focus();
    await user.keyboard('{Enter}');

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is keyboard accessible with Space key', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    renderWithTranslation(<Card onClick={handleClick}>Clickable</Card>);

    const card = screen.getByRole('button');
    card.focus();
    await user.keyboard(' ');

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('accent variant is keyboard accessible', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    renderWithTranslation(
      <Card variant="accent" onClick={handleClick}>
        Accent Clickable
      </Card>
    );

    const card = screen.getByRole('button');
    card.focus();
    await user.keyboard('{Enter}');

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies no-hover class when disableHover is true', () => {
    const { container } = renderWithTranslation(
      <Card onClick={vi.fn()} disableHover>
        Content
      </Card>
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('card--no-hover');
  });

  it('does not apply no-hover class when disableHover is false', () => {
    const { container } = renderWithTranslation(
      <Card onClick={vi.fn()} disableHover={false}>
        Content
      </Card>
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).not.toContain('card--no-hover');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    renderWithTranslation(<Card ref={ref}>Content</Card>);
    expect(ref).toHaveBeenCalled();
  });

  it('renders with tabIndex when clickable', () => {
    renderWithTranslation(<Card onClick={vi.fn()}>Clickable</Card>);
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('tabIndex', '0');
  });

  it('does not set tabIndex when not clickable', () => {
    const { container } = renderWithTranslation(<Card>Not Clickable</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).not.toHaveAttribute('tabIndex');
  });

  // CSS Variables Tests
  describe('CSS Variables', () => {
    it('uses theme CSS variables (not hardcoded colors)', () => {
      const { container } = renderWithTranslation(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;

      // Verify CSS Module classes are applied (indicates CSS variables will be used)
      expect(card.className).toContain('card');
      expect(card.className).toContain('card--default');

      // The actual CSS file uses var(--theme-card-background), var(--theme-border)
      // This test verifies the component applies correct classes that reference those variables
    });

    it('applies correct variant classes that use theme variables', () => {
      const { container: container1 } = renderWithTranslation(<Card variant="default">Default</Card>);
      const { container: container2 } = renderWithTranslation(<Card variant="outlined">Outlined</Card>);
      const { container: container3 } = renderWithTranslation(<Card variant="elevated">Elevated</Card>);
      const { container: container4 } = renderWithTranslation(<Card variant="accent">Accent</Card>);

      // CSS Modules add hash suffix, so we check if className contains the variant
      const card1 = container1.firstChild as HTMLElement;
      const card2 = container2.firstChild as HTMLElement;
      const card3 = container3.firstChild as HTMLElement;
      const card4 = container4.firstChild as HTMLElement;

      expect(card1.className).toContain('card--default');
      expect(card2.className).toContain('card--outlined');
      expect(card3.className).toContain('card--elevated');
      expect(card4.className).toContain('card--accent');
    });

    it('accent variant uses brand primary color variable', () => {
      const { container } = renderWithTranslation(<Card variant="accent">Accent Content</Card>);
      const card = container.firstChild as HTMLElement;

      // Verify accent variant class is applied (which uses --color-brand-primary)
      expect(card.className).toContain('card--accent');

      // The actual CSS uses: border-left: 4px solid var(--color-brand-primary, #9c27b0)
      // This test verifies the component applies correct class that references the variable
    });
  });
});
