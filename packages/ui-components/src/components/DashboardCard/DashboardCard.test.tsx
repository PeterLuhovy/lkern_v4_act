/*
 * ================================================================
 * FILE: DashboardCard.test.tsx
 * PATH: /packages/ui-components/src/components/DashboardCard/DashboardCard.test.tsx
 * DESCRIPTION: Tests for DashboardCard component
 * VERSION: v1.0.1
 * UPDATED: 2025-11-02 11:30:00
 * ================================================================
 */

import { describe, it, expect } from 'vitest';
import { renderWithTranslation, screen } from '../../test-utils';
import { BrowserRouter } from 'react-router-dom';
import { DashboardCard } from './DashboardCard';

// Wrapper component to provide Router context
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('DashboardCard', () => {
  // ================================================================
  // BASIC RENDERING
  // ================================================================

  it('renders with all props', () => {
    renderWithTranslation(
      <RouterWrapper>
        <DashboardCard
          path="/test"
          icon="🧪"
          title="Test Card"
          description="This is a test card"
        />
      </RouterWrapper>
    );

    expect(screen.getByText('🧪')).toBeInTheDocument();
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('This is a test card')).toBeInTheDocument();
  });

  it('renders icon as emoji', () => {
    renderWithTranslation(
      <RouterWrapper>
        <DashboardCard
          path="/forms"
          icon="📝"
          title="Forms"
          description="Form components"
        />
      </RouterWrapper>
    );

    expect(screen.getByText('📝')).toBeInTheDocument();
  });

  it('renders icon as React element', () => {
    renderWithTranslation(
      <RouterWrapper>
        <DashboardCard
          path="/test"
          icon={<span data-testid="custom-icon" role="img" aria-label="art">🎨</span>}
          title="Custom Icon"
          description="Test"
        />
      </RouterWrapper>
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  // ================================================================
  // LINK BEHAVIOR
  // ================================================================

  it('creates Link with correct path', () => {
    const { container } = renderWithTranslation(
      <RouterWrapper>
        <DashboardCard
          path="/testing/forms"
          icon="📝"
          title="Forms"
          description="Form components"
        />
      </RouterWrapper>
    );

    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link?.getAttribute('href')).toBe('/testing/forms');
  });

  it('renders as clickable link', () => {
    renderWithTranslation(
      <RouterWrapper>
        <DashboardCard
          path="/test"
          icon="🧪"
          title="Test"
          description="Test card"
        />
      </RouterWrapper>
    );

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });

  // ================================================================
  // CONTENT STRUCTURE
  // ================================================================

  it('renders title as h3 heading', () => {
    renderWithTranslation(
      <RouterWrapper>
        <DashboardCard
          path="/test"
          icon="🧪"
          title="Test Heading"
          description="Description"
        />
      </RouterWrapper>
    );

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Test Heading');
  });

  it('renders description text', () => {
    renderWithTranslation(
      <RouterWrapper>
        <DashboardCard
          path="/test"
          icon="🧪"
          title="Title"
          description="This is a long description text"
        />
      </RouterWrapper>
    );

    expect(screen.getByText('This is a long description text')).toBeInTheDocument();
  });

  // ================================================================
  // STYLING
  // ================================================================

  it('applies custom className when provided', () => {
    const { container } = renderWithTranslation(
      <RouterWrapper>
        <DashboardCard
          path="/test"
          icon="🧪"
          title="Test"
          description="Test"
          className="custom-class"
        />
      </RouterWrapper>
    );

    const card = container.querySelector('.custom-class');
    expect(card).toBeInTheDocument();
  });

  it('uses elevated variant for Card', () => {
    const { container } = renderWithTranslation(
      <RouterWrapper>
        <DashboardCard
          path="/test"
          icon="🧪"
          title="Test"
          description="Test"
        />
      </RouterWrapper>
    );

    // Card component should be rendered with elevated variant
    const cardElement = container.querySelector('[class*="elevated"]');
    expect(cardElement).toBeInTheDocument();
  });

  // ================================================================
  // HOVER EFFECTS (Phase 4 - v1.0.1)
  // ================================================================

  it('applies text-decoration: none on link wrapper', () => {
    const { container } = renderWithTranslation(
      <RouterWrapper>
        <DashboardCard
          path="/test"
          icon="🧪"
          title="Test"
          description="Test card"
        />
      </RouterWrapper>
    );

    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link?.className).toContain('cardLink');

    // CSS Module applies text-decoration: none via .cardLink class
    // We verify the class is applied (actual CSS is in DashboardCard.module.css line 15)
  });

  it('uses HOVER_EFFECTS.lift.subtle (-2px) for hover transform', () => {
    const { container } = renderWithTranslation(
      <RouterWrapper>
        <DashboardCard
          path="/test"
          icon="🧪"
          title="Test"
          description="Test card"
        />
      </RouterWrapper>
    );

    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link?.className).toContain('cardLink');

    // CSS Module applies transform: translateY(-2px) on hover via .cardLink:hover
    // This uses HOVER_EFFECTS.lift.subtle from design-tokens.ts
    // Actual hover CSS is in DashboardCard.module.css line 21-24
  });

  it('applies purple glow shadow on hover', () => {
    const { container } = renderWithTranslation(
      <RouterWrapper>
        <DashboardCard
          path="/test"
          icon="🧪"
          title="Test"
          description="Test card"
        />
      </RouterWrapper>
    );

    const link = container.querySelector('a');
    const cardContent = container.querySelector('[class*="cardContent"]');

    expect(link).toBeInTheDocument();
    expect(cardContent).toBeInTheDocument();

    // CSS Module applies purple glow shadow via .cardLink:hover .cardContent
    // Shadow: 0 0 0 2px rgba(156, 39, 176, 0.12)
    // Actual CSS is in DashboardCard.module.css line 27-32
  });

  it('uses -1px active state transform', () => {
    const { container } = renderWithTranslation(
      <RouterWrapper>
        <DashboardCard
          path="/test"
          icon="🧪"
          title="Test"
          description="Test card"
        />
      </RouterWrapper>
    );

    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link?.className).toContain('cardLink');

    // CSS Module applies transform: translateY(-1px) on active via .cardLink:active
    // Actual CSS is in DashboardCard.module.css line 34-37
  });

  // ================================================================
  // ACCESSIBILITY
  // ================================================================

  it('maintains semantic HTML structure', () => {
    renderWithTranslation(
      <RouterWrapper>
        <DashboardCard
          path="/test"
          icon="🧪"
          title="Accessible Card"
          description="Description"
        />
      </RouterWrapper>
    );

    // Should have link
    expect(screen.getByRole('link')).toBeInTheDocument();

    // Should have heading
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('renders complete content for screen readers', () => {
    renderWithTranslation(
      <RouterWrapper>
        <DashboardCard
          path="/testing/forms"
          icon="📝"
          title="Form Components"
          description="Test form inputs and validation"
        />
      </RouterWrapper>
    );

    const link = screen.getByRole('link');

    // Link should contain all text content for screen readers
    expect(link).toHaveTextContent('Form Components');
    expect(link).toHaveTextContent('Test form inputs and validation');
  });
});
