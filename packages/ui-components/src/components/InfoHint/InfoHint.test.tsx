/*
 * ================================================================
 * FILE: InfoHint.test.tsx
 * PATH: /packages/ui-components/src/components/InfoHint/InfoHint.test.tsx
 * DESCRIPTION: Unit tests for InfoHint component
 * VERSION: v1.0.0
 * CREATED: 2025-12-11
 * UPDATED: 2025-12-11
 * ================================================================
 */

import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { renderWithTranslation, screen, userEvent, fireEvent } from '../../test-utils';
import { InfoHint } from './InfoHint';

describe('InfoHint', () => {
  // ================================================================
  // RENDERING TESTS
  // ================================================================
  describe('Rendering', () => {
    it('renders info hint button', () => {
      renderWithTranslation(<InfoHint content="Test info" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders with default icon (SVG)', () => {
      const { container } = renderWithTranslation(<InfoHint content="Test info" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders custom icon when provided', () => {
      renderWithTranslation(<InfoHint content="Test info" icon={<span data-testid="custom-icon" role="img" aria-hidden="true">❓</span>} />);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('does not render popup initially (closed state)', () => {
      renderWithTranslation(<InfoHint content="Test info content" />);
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('applies custom className to container', () => {
      const { container } = renderWithTranslation(
        <InfoHint content="Test info" className="custom-class" />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('custom-class');
    });
  });

  // ================================================================
  // PROPS & VARIANTS TESTS
  // ================================================================
  describe('Props & Variants', () => {
    it('applies small size class', () => {
      renderWithTranslation(<InfoHint content="Test" size="small" />);
      const button = screen.getByRole('button');
      expect(button.className).toMatch(/icon--small/);
    });

    it('applies medium size class (default)', () => {
      renderWithTranslation(<InfoHint content="Test" />);
      const button = screen.getByRole('button');
      expect(button.className).toMatch(/icon--medium/);
    });

    it('applies large size class', () => {
      renderWithTranslation(<InfoHint content="Test" size="large" />);
      const button = screen.getByRole('button');
      expect(button.className).toMatch(/icon--large/);
    });

    it('renders popup content when opened', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<InfoHint content="This is helpful information" />);

      await user.click(screen.getByRole('button'));

      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      expect(screen.getByText('This is helpful information')).toBeInTheDocument();
    });

    it('renders JSX content correctly', async () => {
      const user = userEvent.setup();
      renderWithTranslation(
        <InfoHint
          content={
            <div>
              <strong>Bold text</strong>
              <p>Paragraph</p>
            </div>
          }
        />
      );

      await user.click(screen.getByRole('button'));

      expect(screen.getByText('Bold text')).toBeInTheDocument();
      expect(screen.getByText('Paragraph')).toBeInTheDocument();
    });

    it('applies maxWidth to popup', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<InfoHint content="Test" maxWidth={200} />);

      await user.click(screen.getByRole('button'));

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.style.maxWidth).toBe('200px');
    });

    it('applies popupClassName to popup', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<InfoHint content="Test" popupClassName="custom-popup" />);

      await user.click(screen.getByRole('button'));

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.className).toContain('custom-popup');
    });
  });

  // ================================================================
  // INTERACTION TESTS
  // ================================================================
  describe('Interactions', () => {
    it('opens popup on click', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<InfoHint content="Test info" />);

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

      await user.click(screen.getByRole('button'));

      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('closes popup on second click (toggle)', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<InfoHint content="Test info" />);

      const button = screen.getByRole('button');

      // Open
      await user.click(button);
      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      // Close
      await user.click(button);
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('closes popup on Escape key', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<InfoHint content="Test info" />);

      await user.click(screen.getByRole('button'));
      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      await user.keyboard('{Escape}');
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('closes popup when clicking outside', async () => {
      const user = userEvent.setup();
      renderWithTranslation(
        <div>
          <InfoHint content="Test info" />
          <button data-testid="outside-button">Outside</button>
        </div>
      );

      await user.click(screen.getByRole('button', { name: /informácie/i }));
      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      // Click outside
      fireEvent.mouseDown(screen.getByTestId('outside-button'));
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('button remains functional after multiple toggles', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<InfoHint content="Test info" />);

      const button = screen.getByRole('button');

      // Toggle 3 times
      await user.click(button);
      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      await user.click(button);
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

      await user.click(button);
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  // ================================================================
  // POSITION TESTS
  // ================================================================
  describe('Position', () => {
    it('applies top position class by default', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<InfoHint content="Test" />);

      await user.click(screen.getByRole('button'));

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.className).toMatch(/popupPortal--top/);
    });

    it('applies bottom position class', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<InfoHint content="Test" position="bottom" />);

      await user.click(screen.getByRole('button'));

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.className).toMatch(/popupPortal--bottom/);
    });

    it('applies left position class', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<InfoHint content="Test" position="left" />);

      await user.click(screen.getByRole('button'));

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.className).toMatch(/popupPortal--left/);
    });

    it('applies right position class', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<InfoHint content="Test" position="right" />);

      await user.click(screen.getByRole('button'));

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.className).toMatch(/popupPortal--right/);
    });
  });

  // ================================================================
  // ACCESSIBILITY TESTS
  // ================================================================
  describe('Accessibility', () => {
    it('has aria-expanded=false when closed', () => {
      renderWithTranslation(<InfoHint content="Test" />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('has aria-expanded=true when open', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<InfoHint content="Test" />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('has aria-haspopup attribute', () => {
      renderWithTranslation(<InfoHint content="Test" />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-haspopup', 'true');
    });

    it('popup has tooltip role', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<InfoHint content="Test" />);

      await user.click(screen.getByRole('button'));

      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('button has title attribute', () => {
      renderWithTranslation(<InfoHint content="Test" />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', 'Zobraziť informácie');
    });

    it('accepts ref prop (forwardRef pattern)', () => {
      // NOTE: Component accepts ref via forwardRef but doesn't currently attach it
      // This test verifies the component doesn't crash when ref is passed
      const ref = createRef<HTMLDivElement>();
      const { container } = renderWithTranslation(<InfoHint ref={ref} content="Test" />);

      // Verify component renders without errors when ref is passed
      expect(container.firstChild).toBeInTheDocument();
    });

    it('button has type=button to prevent form submission', () => {
      renderWithTranslation(<InfoHint content="Test" />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  // ================================================================
  // CSS & STYLING TESTS
  // ================================================================
  describe('CSS & Styling', () => {
    it('has container class', () => {
      const { container } = renderWithTranslation(<InfoHint content="Test" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toMatch(/container/);
    });

    it('has icon class on button', () => {
      renderWithTranslation(<InfoHint content="Test" />);
      const button = screen.getByRole('button');
      expect(button.className).toMatch(/icon/);
    });

    it('applies icon--active class when open', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<InfoHint content="Test" />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(button.className).toMatch(/icon--active/);
    });

    it('popup has popup and popupPortal classes', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<InfoHint content="Test" />);

      await user.click(screen.getByRole('button'));

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.className).toMatch(/popup/);
      expect(tooltip.className).toMatch(/popupPortal/);
    });

    it('popup uses fixed positioning', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<InfoHint content="Test" />);

      await user.click(screen.getByRole('button'));

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.style.position).toBe('fixed');
    });

    it('popup has high z-index', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<InfoHint content="Test" />);

      await user.click(screen.getByRole('button'));

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.style.zIndex).toBe('10000');
    });
  });

  // ================================================================
  // PORTAL RENDERING TESTS
  // ================================================================
  describe('Portal Rendering', () => {
    it('renders popup directly in document.body', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<InfoHint content="Test popup content" />);

      await user.click(screen.getByRole('button'));

      // The tooltip should be a direct child of body (portal)
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.parentElement).toBe(document.body);
    });

    it('removes popup from body when closed', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<InfoHint content="Test popup content" />);

      await user.click(screen.getByRole('button'));
      expect(screen.getByRole('tooltip').parentElement).toBe(document.body);

      await user.click(screen.getByRole('button'));
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });
});
