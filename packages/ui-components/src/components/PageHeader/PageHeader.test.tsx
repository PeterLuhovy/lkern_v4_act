/*
 * ================================================================
 * FILE: PageHeader.test.tsx
 * PATH: /packages/ui-components/src/components/PageHeader/PageHeader.test.tsx
 * DESCRIPTION: Unit tests for PageHeader component
 * VERSION: v1.0.0
 * CREATED: 2025-11-08
 * UPDATED: 2025-11-08
 * ================================================================
 */

import { describe, it, expect, vi } from 'vitest';
import { renderWithTranslation, screen } from '../../test-utils';
import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  describe('Basic Rendering', () => {
    it('renders title correctly', () => {
      renderWithTranslation(<PageHeader title="Test Page" />);
      expect(screen.getByText('Test Page')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Page');
    });

    it('renders subtitle when provided', () => {
      renderWithTranslation(
        <PageHeader title="Test Page" subtitle="Test Subtitle" />
      );
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });

    it('does not render subtitle when not provided', () => {
      renderWithTranslation(<PageHeader title="Test Page" />);
      expect(screen.queryByText('Test Subtitle')).not.toBeInTheDocument();
    });
  });

  describe('Logo', () => {
    it('does not show logo by default', () => {
      renderWithTranslation(<PageHeader title="Test" />);
      expect(screen.queryByAltText(/logo/i)).not.toBeInTheDocument();
    });

    it('shows logo placeholder when showLogo=true and no logoIcon provided', () => {
      renderWithTranslation(<PageHeader title="Test" showLogo />);
      expect(screen.getByText('LOGO')).toBeInTheDocument();
    });

    it('renders custom logo image when logoIcon is string', () => {
      renderWithTranslation(
        <PageHeader title="Test" showLogo logoIcon="/test-logo.png" />
      );
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', '/test-logo.png');
      expect(img).toHaveAttribute('alt', 'Logo aplikácie'); // Slovak default
    });

    it('renders custom logo component when logoIcon is ReactNode', () => {
      const CustomLogo = () => <div data-testid="custom-logo">Custom</div>;
      renderWithTranslation(
        <PageHeader title="Test" showLogo logoIcon={<CustomLogo />} />
      );
      expect(screen.getByTestId('custom-logo')).toBeInTheDocument();
    });
  });

  describe('Breadcrumbs', () => {
    it('does not render breadcrumbs when not provided', () => {
      renderWithTranslation(<PageHeader title="Test" />);
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    it('renders breadcrumbs navigation', () => {
      const breadcrumbs = [
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/products' },
        { name: 'Details', isActive: true }
      ];
      renderWithTranslation(<PageHeader title="Test" breadcrumbs={breadcrumbs} />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Navigačná cesta'); // Slovak default
    });

    it('renders all breadcrumb items', () => {
      const breadcrumbs = [
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/products' },
        { name: 'Details', isActive: true }
      ];
      renderWithTranslation(<PageHeader title="Test" breadcrumbs={breadcrumbs} />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Details')).toBeInTheDocument();
    });

    it('renders breadcrumb separators', () => {
      const breadcrumbs = [
        { name: 'Home', href: '/' },
        { name: 'Products', isActive: true }
      ];
      const { container } = renderWithTranslation(
        <PageHeader title="Test" breadcrumbs={breadcrumbs} />
      );

      // Should have 1 separator between 2 items
      const separators = container.querySelectorAll('[aria-hidden="true"]');
      expect(separators).toHaveLength(1);
      expect(separators[0]).toHaveTextContent('/');
    });

    it('marks active breadcrumb with aria-current', () => {
      const breadcrumbs = [
        { name: 'Home', href: '/' },
        { name: 'Current', isActive: true }
      ];
      renderWithTranslation(<PageHeader title="Test" breadcrumbs={breadcrumbs} />);

      const currentItem = screen.getByText('Current');
      expect(currentItem).toHaveAttribute('aria-current', 'page');
    });

    it('renders clickable breadcrumbs as links', () => {
      const breadcrumbs = [
        { name: 'Home', href: '/' }
      ];
      renderWithTranslation(<PageHeader title="Test" breadcrumbs={breadcrumbs} />);

      const link = screen.getByRole('link', { name: 'Home' });
      expect(link).toHaveAttribute('href', '/');
    });

    it('calls onClick when breadcrumb clicked', () => {
      const handleClick = vi.fn();
      const breadcrumbs = [
        { name: 'Clickable', onClick: handleClick }
      ];
      renderWithTranslation(<PageHeader title="Test" breadcrumbs={breadcrumbs} />);

      const link = screen.getByText('Clickable');
      link.click();

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('prevents default when onClick provided with "to" prop', () => {
      const handleClick = vi.fn();
      const breadcrumbs = [
        { name: 'React Router', to: '/route', onClick: handleClick }
      ];
      renderWithTranslation(<PageHeader title="Test" breadcrumbs={breadcrumbs} />);

      const link = screen.getByText('React Router');
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      link.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Children', () => {
    it('renders children in right section', () => {
      renderWithTranslation(
        <PageHeader title="Test">
          <button>Action Button</button>
        </PageHeader>
      );

      expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
    });

    it('does not render right section when no children', () => {
      const { container } = renderWithTranslation(<PageHeader title="Test" />);
      const rightSection = container.querySelector('[class*="pageHeader__right"]');
      expect(rightSection).not.toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('applies custom className', () => {
      const { container } = renderWithTranslation(
        <PageHeader title="Test" className="custom-class" />
      );
      const header = container.firstChild as HTMLElement;
      expect(header.className).toContain('custom-class');
    });
  });

  describe('Accessibility', () => {
    it('uses semantic heading for title', () => {
      renderWithTranslation(<PageHeader title="Accessible Page" />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Accessible Page');
    });

    it('breadcrumb navigation has proper aria-label', () => {
      const breadcrumbs = [{ name: 'Home', href: '/' }];
      renderWithTranslation(<PageHeader title="Test" breadcrumbs={breadcrumbs} />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Navigačná cesta'); // Slovak default
    });

    it('logo has proper alt text', () => {
      renderWithTranslation(
        <PageHeader title="Test" showLogo logoIcon="/logo.png" />
      );

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', 'Logo aplikácie'); // Slovak default
    });
  });

  describe('Translation Support', () => {
    it('displays Slovak translations by default', () => {
      renderWithTranslation(
        <PageHeader
          title="Test Page"
          showLogo
          logoIcon="/logo.png"
          breadcrumbs={[{ name: 'Home', href: '/' }]}
        />
      );

      // Logo alt text in Slovak
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', 'Logo aplikácie');

      // Breadcrumb navigation label in Slovak
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Navigačná cesta');
    });

    it('switches to English when language changes', () => {
      renderWithTranslation(
        <PageHeader
          title="Test Page"
          showLogo
          logoIcon="/logo.png"
          breadcrumbs={[{ name: 'Home', href: '/' }]}
        />,
        { initialLanguage: 'en' }
      );

      // Logo alt text in English
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', 'Application logo');

      // Breadcrumb navigation label in English
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Breadcrumb navigation');
    });

    it('uses logo placeholder text from translations', () => {
      // Slovak
      renderWithTranslation(<PageHeader title="Test" showLogo />);
      expect(screen.getByText('LOGO')).toBeInTheDocument();
    });
  });

  describe('Translation Keys Validation', () => {
    it('uses translation for logo alt text', () => {
      renderWithTranslation(
        <PageHeader title="Test" showLogo logoIcon="/logo.png" />
      );

      const img = screen.getByRole('img');
      // Translation key: 'components.pageHeader.logoAlt' -> 'Logo aplikácie' (SK)
      expect(img).toHaveAttribute('alt', 'Logo aplikácie');
    });

    it('uses translation for logo placeholder', () => {
      renderWithTranslation(<PageHeader title="Test" showLogo />);

      // Translation key: 'components.pageHeader.logoPlaceholder' -> 'LOGO'
      expect(screen.getByText('LOGO')).toBeInTheDocument();
    });

    it('uses translation for breadcrumbs aria-label', () => {
      const breadcrumbs = [{ name: 'Home' }];
      renderWithTranslation(<PageHeader title="Test" breadcrumbs={breadcrumbs} />);

      const nav = screen.getByRole('navigation');
      // Translation key: 'components.pageHeader.breadcrumbsLabel' -> 'Navigačná cesta' (SK)
      expect(nav).toHaveAttribute('aria-label', 'Navigačná cesta');
    });
  });
});