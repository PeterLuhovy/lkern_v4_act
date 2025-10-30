/*
 * ================================================================
 * FILE: DashboardCard.test.tsx
 * PATH: /packages/ui-components/src/components/DashboardCard/DashboardCard.test.tsx
 * DESCRIPTION: Tests for DashboardCard component
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 23:20:00
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
          icon={<span data-testid="custom-icon">🎨</span>}
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
