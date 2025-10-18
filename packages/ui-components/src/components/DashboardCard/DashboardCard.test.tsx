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
import { render, screen } from '@testing-library/react';
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
    render(
      <DashboardCard
        path="/test"
        icon="🧪"
        title="Test Card"
        description="This is a test card"
      />,
      { wrapper: RouterWrapper }
    );

    expect(screen.getByText('🧪')).toBeInTheDocument();
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('This is a test card')).toBeInTheDocument();
  });

  it('renders icon as emoji', () => {
    render(
      <DashboardCard
        path="/forms"
        icon="📝"
        title="Forms"
        description="Form components"
      />,
      { wrapper: RouterWrapper }
    );

    expect(screen.getByText('📝')).toBeInTheDocument();
  });

  it('renders icon as React element', () => {
    render(
      <DashboardCard
        path="/test"
        icon={<span data-testid="custom-icon">🎨</span>}
        title="Custom Icon"
        description="Test"
      />,
      { wrapper: RouterWrapper }
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  // ================================================================
  // LINK BEHAVIOR
  // ================================================================

  it('creates Link with correct path', () => {
    const { container } = render(
      <DashboardCard
        path="/testing/forms"
        icon="📝"
        title="Forms"
        description="Form components"
      />,
      { wrapper: RouterWrapper }
    );

    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link?.getAttribute('href')).toBe('/testing/forms');
  });

  it('renders as clickable link', () => {
    render(
      <DashboardCard
        path="/test"
        icon="🧪"
        title="Test"
        description="Test card"
      />,
      { wrapper: RouterWrapper }
    );

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });

  // ================================================================
  // CONTENT STRUCTURE
  // ================================================================

  it('renders title as h3 heading', () => {
    render(
      <DashboardCard
        path="/test"
        icon="🧪"
        title="Test Heading"
        description="Description"
      />,
      { wrapper: RouterWrapper }
    );

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Test Heading');
  });

  it('renders description text', () => {
    render(
      <DashboardCard
        path="/test"
        icon="🧪"
        title="Title"
        description="This is a long description text"
      />,
      { wrapper: RouterWrapper }
    );

    expect(screen.getByText('This is a long description text')).toBeInTheDocument();
  });

  // ================================================================
  // STYLING
  // ================================================================

  it('applies custom className when provided', () => {
    const { container } = render(
      <DashboardCard
        path="/test"
        icon="🧪"
        title="Test"
        description="Test"
        className="custom-class"
      />,
      { wrapper: RouterWrapper }
    );

    const card = container.querySelector('.custom-class');
    expect(card).toBeInTheDocument();
  });

  it('uses elevated variant for Card', () => {
    const { container } = render(
      <DashboardCard
        path="/test"
        icon="🧪"
        title="Test"
        description="Test"
      />,
      { wrapper: RouterWrapper }
    );

    // Card component should be rendered with elevated variant
    const cardElement = container.querySelector('[class*="elevated"]');
    expect(cardElement).toBeInTheDocument();
  });

  // ================================================================
  // ACCESSIBILITY
  // ================================================================

  it('maintains semantic HTML structure', () => {
    render(
      <DashboardCard
        path="/test"
        icon="🧪"
        title="Accessible Card"
        description="Description"
      />,
      { wrapper: RouterWrapper }
    );

    // Should have link
    expect(screen.getByRole('link')).toBeInTheDocument();

    // Should have heading
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('renders complete content for screen readers', () => {
    render(
      <DashboardCard
        path="/testing/forms"
        icon="📝"
        title="Form Components"
        description="Test form inputs and validation"
      />,
      { wrapper: RouterWrapper }
    );

    const link = screen.getByRole('link');

    // Link should contain all text content for screen readers
    expect(link).toHaveTextContent('Form Components');
    expect(link).toHaveTextContent('Test form inputs and validation');
  });
});
