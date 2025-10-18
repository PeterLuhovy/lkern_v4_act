/*
 * ================================================================
 * FILE: Card.test.tsx
 * PATH: /packages/ui-components/src/components/Card/Card.test.tsx
 * DESCRIPTION: Unit tests for Card component
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
 * ================================================================
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card } from './Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Test Content</Card>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies default variant class', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('card--default');
  });

  it('applies outlined variant class', () => {
    const { container } = render(<Card variant="outlined">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('card--outlined');
  });

  it('applies elevated variant class', () => {
    const { container } = render(<Card variant="elevated">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('card--elevated');
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('custom-class');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Card onClick={handleClick}>Clickable</Card>);

    const card = screen.getByRole('button');
    await user.click(card);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies clickable class when onClick provided', () => {
    const { container } = render(<Card onClick={() => {}}>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('card--clickable');
  });

  it('sets role="button" when clickable', () => {
    render(<Card onClick={() => {}}>Clickable</Card>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('does not set role when not clickable', () => {
    render(<Card>Not Clickable</Card>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('is keyboard accessible with Enter key', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Card onClick={handleClick}>Clickable</Card>);

    const card = screen.getByRole('button');
    card.focus();
    await user.keyboard('{Enter}');

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is keyboard accessible with Space key', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Card onClick={handleClick}>Clickable</Card>);

    const card = screen.getByRole('button');
    card.focus();
    await user.keyboard(' ');

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies no-hover class when disableHover is true', () => {
    const { container } = render(
      <Card onClick={() => {}} disableHover>
        Content
      </Card>
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('card--no-hover');
  });

  it('does not apply no-hover class when disableHover is false', () => {
    const { container } = render(
      <Card onClick={() => {}} disableHover={false}>
        Content
      </Card>
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).not.toContain('card--no-hover');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Card ref={ref}>Content</Card>);
    expect(ref).toHaveBeenCalled();
  });

  it('renders with tabIndex when clickable', () => {
    render(<Card onClick={() => {}}>Clickable</Card>);
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('tabIndex', '0');
  });

  it('does not set tabIndex when not clickable', () => {
    const { container } = render(<Card>Not Clickable</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).not.toHaveAttribute('tabIndex');
  });

  // CSS Variables Tests
  describe('CSS Variables', () => {
    it('uses theme CSS variables (not hardcoded colors)', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      const styles = getComputedStyle(card);

      // Verify CSS Module classes are applied (indicates CSS variables will be used)
      expect(card.className).toContain('card');
      expect(card.className).toContain('card--default');

      // The actual CSS file uses var(--theme-card-background), var(--theme-border)
      // This test verifies the component applies correct classes that reference those variables
    });

    it('applies correct variant classes that use theme variables', () => {
      const { container: container1 } = render(<Card variant="default">Default</Card>);
      const { container: container2 } = render(<Card variant="outlined">Outlined</Card>);
      const { container: container3 } = render(<Card variant="elevated">Elevated</Card>);

      // CSS Modules add hash suffix, so we check if className contains the variant
      const card1 = container1.firstChild as HTMLElement;
      const card2 = container2.firstChild as HTMLElement;
      const card3 = container3.firstChild as HTMLElement;

      expect(card1.className).toContain('card--default');
      expect(card2.className).toContain('card--outlined');
      expect(card3.className).toContain('card--elevated');
    });
  });
});
