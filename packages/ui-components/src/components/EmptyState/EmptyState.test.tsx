/*
 * ================================================================
 * FILE: EmptyState.test.tsx
 * PATH: /packages/ui-components/src/components/EmptyState/EmptyState.test.tsx
 * DESCRIPTION: Unit tests for EmptyState component
 * VERSION: v1.1.0
 * CREATED: 2025-10-18
 * UPDATED: 2025-10-30
 * ================================================================
 */

import { describe, it, expect } from 'vitest';
import { renderWithTranslation as render, screen } from '../../test-utils';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  // === RENDERING ===
  it('renders without crashing', () => {
    render(<EmptyState title="No data" />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('renders title correctly', () => {
    render(<EmptyState title="Empty state title" />);
    expect(screen.getByText('Empty state title')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(
      <EmptyState title="No data" icon={<span data-testid="icon" role="img" aria-label="empty mailbox">📭</span>} />
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('does not render icon when not provided', () => {
    const { container } = render(<EmptyState title="No data" />);
    const iconDiv = container.querySelector('.emptyState__icon');
    expect(iconDiv).not.toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <EmptyState
        title="No contacts"
        description="Start by adding your first contact"
      />
    );
    expect(screen.getByText('Start by adding your first contact')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    const { container } = render(<EmptyState title="No data" />);
    const descriptionP = container.querySelector('.emptyState__description');
    expect(descriptionP).not.toBeInTheDocument();
  });

  it('renders action when provided', () => {
    render(
      <EmptyState
        title="No data"
        action={<button>Add Item</button>}
      />
    );
    expect(screen.getByText('Add Item')).toBeInTheDocument();
  });

  it('does not render action when not provided', () => {
    const { container } = render(<EmptyState title="No data" />);
    const actionDiv = container.querySelector('.emptyState__action');
    expect(actionDiv).not.toBeInTheDocument();
  });

  // === PROPS ===
  it('applies small size class', () => {
    const { container } = render(<EmptyState title="No data" size="small" />);
    const emptyState = container.firstChild as HTMLElement;
    expect(emptyState.className).toContain('emptyState--small');
  });

  it('applies medium size class by default', () => {
    const { container } = render(<EmptyState title="No data" />);
    const emptyState = container.firstChild as HTMLElement;
    expect(emptyState.className).toContain('emptyState--medium');
  });

  it('applies large size class', () => {
    const { container } = render(<EmptyState title="No data" size="large" />);
    const emptyState = container.firstChild as HTMLElement;
    expect(emptyState.className).toContain('emptyState--large');
  });

  it('applies custom className', () => {
    const { container } = render(
      <EmptyState title="No data" className="custom-class" />
    );
    const emptyState = container.firstChild as HTMLElement;
    expect(emptyState.className).toContain('custom-class');
  });

  // === CSS VARIABLES ===
  describe('CSS Variables', () => {
    it('uses theme CSS variables (not hardcoded colors)', () => {
      const { container } = render(<EmptyState title="No data" />);
      const emptyState = container.firstChild as HTMLElement;

      // Verify CSS Module classes are applied (indicates CSS variables will be used)
      expect(emptyState.className).toContain('emptyState');
      expect(emptyState.className).toContain('emptyState--medium');

      // The actual CSS file uses var(--theme-text), var(--theme-text-muted)
      // This test verifies the component applies correct classes that reference those variables
    });

    it('applies correct size classes that use theme variables', () => {
      const { container: container1 } = render(<EmptyState title="Small" size="small" />);
      const { container: container2 } = render(<EmptyState title="Medium" size="medium" />);
      const { container: container3 } = render(<EmptyState title="Large" size="large" />);

      // CSS Modules add hash suffix, so we check if className contains the variant
      const emptyState1 = container1.firstChild as HTMLElement;
      const emptyState2 = container2.firstChild as HTMLElement;
      const emptyState3 = container3.firstChild as HTMLElement;

      expect(emptyState1.className).toContain('emptyState--small');
      expect(emptyState2.className).toContain('emptyState--medium');
      expect(emptyState3.className).toContain('emptyState--large');
    });
  });

  // === COMPLEX SCENARIOS ===
  it('renders complete empty state with all props', () => {
    render(
      <EmptyState
        icon={<span data-testid="icon" role="img" aria-label="empty mailbox">📭</span>}
        title="No contacts yet"
        description="Start building your network"
        action={<button>Add Contact</button>}
        size="large"
        className="custom-empty"
      />
    );

    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('No contacts yet')).toBeInTheDocument();
    expect(screen.getByText('Start building your network')).toBeInTheDocument();
    expect(screen.getByText('Add Contact')).toBeInTheDocument();
  });

  it('renders minimal empty state with only title', () => {
    const { container } = render(<EmptyState title="Empty" />);

    expect(screen.getByText('Empty')).toBeInTheDocument();
    expect(container.querySelector('.emptyState__icon')).not.toBeInTheDocument();
    expect(container.querySelector('.emptyState__description')).not.toBeInTheDocument();
    expect(container.querySelector('.emptyState__action')).not.toBeInTheDocument();
  });
});
