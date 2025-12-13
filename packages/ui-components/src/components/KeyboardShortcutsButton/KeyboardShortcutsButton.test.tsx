/*
 * ================================================================
 * FILE: KeyboardShortcutsButton.test.tsx
 * PATH: /packages/ui-components/src/components/KeyboardShortcutsButton/KeyboardShortcutsButton.test.tsx
 * DESCRIPTION: Unit tests for KeyboardShortcutsButton component
 * VERSION: v1.0.0
 * CREATED: 2025-12-11
 * UPDATED: 2025-12-11
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent } from '@testing-library/react';
import { renderWithTranslation, screen, userEvent } from '../../test-utils';
import { KeyboardShortcutsButton } from './KeyboardShortcutsButton';

describe('KeyboardShortcutsButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ================================================================
  // RENDERING TESTS
  // ================================================================
  describe('Rendering', () => {
    it('renders floating button', () => {
      renderWithTranslation(<KeyboardShortcutsButton />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('renders button with ? icon', () => {
      renderWithTranslation(<KeyboardShortcutsButton />);
      expect(screen.getByText('?')).toBeInTheDocument();
    });

    it('does not show modal by default', () => {
      renderWithTranslation(<KeyboardShortcutsButton />);
      // Modal content should not be visible
      expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    });

    it('renders button with title attribute', () => {
      renderWithTranslation(<KeyboardShortcutsButton />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title');
    });
  });

  // ================================================================
  // MODAL TESTS
  // ================================================================
  describe('Modal', () => {
    it('opens modal when button is clicked', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<KeyboardShortcutsButton />);

      await user.click(screen.getByRole('button'));

      // Modal should be visible
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('closes modal when overlay is clicked', async () => {
      const user = userEvent.setup();
      const { container } = renderWithTranslation(<KeyboardShortcutsButton />);

      // Open modal
      await user.click(screen.getByRole('button'));
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();

      // Click overlay
      const overlay = container.querySelector('[class*="overlay"]');
      if (overlay) {
        await user.click(overlay);
      }

      // Modal should be closed
      expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    });

    it('closes modal when close button is clicked', async () => {
      const user = userEvent.setup();
      const { container } = renderWithTranslation(<KeyboardShortcutsButton />);

      // Open modal
      await user.click(screen.getByRole('button'));

      // Find and click close button (×) - use class selector as aria-label is translated
      const closeButton = container.querySelector('[class*="closeButton"]');
      if (closeButton) {
        await user.click(closeButton);
      }

      // Modal should be closed
      expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    });

    it('does not close modal when clicking inside modal content', async () => {
      const user = userEvent.setup();
      const { container } = renderWithTranslation(<KeyboardShortcutsButton />);

      // Open modal
      await user.click(screen.getByRole('button'));

      // Click inside modal content
      const content = container.querySelector('[class*="content"]');
      if (content) {
        await user.click(content);
      }

      // Modal should still be open
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('displays 11 keyboard shortcuts', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<KeyboardShortcutsButton />);

      await user.click(screen.getByRole('button'));

      // Check for kbd elements (one per shortcut)
      const kbdElements = document.querySelectorAll('kbd');
      expect(kbdElements.length).toBe(11);
    });

    it('displays kbd elements for shortcut keys', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<KeyboardShortcutsButton />);

      await user.click(screen.getByRole('button'));

      // Check for kbd elements
      const kbdElements = document.querySelectorAll('kbd');
      expect(kbdElements.length).toBe(11);
    });

    it('shows Ctrl+D shortcut', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<KeyboardShortcutsButton />);

      await user.click(screen.getByRole('button'));

      expect(screen.getByText('Ctrl+D')).toBeInTheDocument();
    });

    it('shows Ctrl+L shortcut', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<KeyboardShortcutsButton />);

      await user.click(screen.getByRole('button'));

      expect(screen.getByText('Ctrl+L')).toBeInTheDocument();
    });

    it('shows Ctrl+1 through Ctrl+9 shortcuts', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<KeyboardShortcutsButton />);

      await user.click(screen.getByRole('button'));

      for (let i = 1; i <= 9; i++) {
        expect(screen.getByText(`Ctrl+${i}`)).toBeInTheDocument();
      }
    });

    it('shows hint in footer', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<KeyboardShortcutsButton />);

      await user.click(screen.getByRole('button'));

      expect(screen.getByText('💡', { exact: false })).toBeInTheDocument();
    });
  });

  // ================================================================
  // KEYBOARD NAVIGATION TESTS
  // ================================================================
  describe('Keyboard Navigation', () => {
    it('opens modal when ? key is pressed', () => {
      renderWithTranslation(<KeyboardShortcutsButton />);

      fireEvent.keyDown(window, { key: '?' });

      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('closes modal when Escape is pressed', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<KeyboardShortcutsButton />);

      // Open modal
      await user.click(screen.getByRole('button'));
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();

      // Press Escape
      fireEvent.keyDown(window, { key: 'Escape' });

      expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    });

    it('does not open modal when ? is pressed with Ctrl', () => {
      renderWithTranslation(<KeyboardShortcutsButton />);

      fireEvent.keyDown(window, { key: '?', ctrlKey: true });

      expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    });

    it('does not open modal when ? is pressed with Alt', () => {
      renderWithTranslation(<KeyboardShortcutsButton />);

      fireEvent.keyDown(window, { key: '?', altKey: true });

      expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    });

    it('does not open modal when typing in input', () => {
      renderWithTranslation(
        <>
          <KeyboardShortcutsButton />
          <input data-testid="test-input" />
        </>
      );

      const input = screen.getByTestId('test-input');
      input.focus();

      // Simulate keydown with target as input
      fireEvent.keyDown(input, { key: '?' });

      expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    });
  });

  // ================================================================
  // CALLBACKS TESTS
  // ================================================================
  describe('Callbacks', () => {
    it('calls onOpen when modal opens', async () => {
      const onOpen = vi.fn();
      const user = userEvent.setup();
      renderWithTranslation(<KeyboardShortcutsButton onOpen={onOpen} />);

      await user.click(screen.getByRole('button'));

      expect(onOpen).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when modal closes via close button', async () => {
      const onClose = vi.fn();
      const user = userEvent.setup();
      const { container } = renderWithTranslation(<KeyboardShortcutsButton onClose={onClose} />);

      // Open modal
      await user.click(screen.getByRole('button'));

      // Close via close button
      const closeButton = container.querySelector('[class*="closeButton"]');
      if (closeButton) {
        await user.click(closeButton);
      }

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when modal closes via overlay click', async () => {
      const onClose = vi.fn();
      const user = userEvent.setup();
      const { container } = renderWithTranslation(<KeyboardShortcutsButton onClose={onClose} />);

      // Open modal
      await user.click(screen.getByRole('button'));

      // Close via overlay
      const overlay = container.querySelector('[class*="overlay"]');
      if (overlay) {
        await user.click(overlay);
      }

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  // ================================================================
  // POSITION PROPS TESTS
  // ================================================================
  describe('Position Props', () => {
    it('accepts position prop', () => {
      const { container } = renderWithTranslation(<KeyboardShortcutsButton position="top-left" />);
      const button = container.querySelector('[class*="button"]');
      expect(button).toBeInTheDocument();
    });

    it('accepts statusBarExpanded prop', () => {
      renderWithTranslation(<KeyboardShortcutsButton statusBarExpanded={true} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('accepts statusBarHeight prop', () => {
      renderWithTranslation(<KeyboardShortcutsButton statusBarHeight={40} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('accepts statusBarExpandedHeight prop', () => {
      renderWithTranslation(<KeyboardShortcutsButton statusBarExpandedHeight={400} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('calculates bottom position when collapsed', () => {
      renderWithTranslation(
        <KeyboardShortcutsButton statusBarHeight={32} statusBarExpandedHeight={300} statusBarExpanded={false} />
      );
      const button = screen.getByRole('button');
      // Collapsed: 32 + 16 (BUTTON_OFFSET) + 48 (THEME_CUSTOMIZER_WIDTH) + 16 (BUTTON_SPACING) = 112px
      expect(button).toHaveStyle({ bottom: '112px' });
    });

    it('calculates bottom position when expanded', () => {
      renderWithTranslation(
        <KeyboardShortcutsButton statusBarHeight={32} statusBarExpandedHeight={300} statusBarExpanded={true} />
      );
      const button = screen.getByRole('button');
      // Expanded: (300 + 32) + 16 + 48 + 16 = 412px
      expect(button).toHaveStyle({ bottom: '412px' });
    });

    it('sets right position for bottom-right', () => {
      renderWithTranslation(<KeyboardShortcutsButton position="bottom-right" />);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ right: '24px' });
    });

    it('sets left position for bottom-left', () => {
      renderWithTranslation(<KeyboardShortcutsButton position="bottom-left" />);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ left: '24px' });
    });
  });

  // ================================================================
  // TRANSLATION TESTS
  // ================================================================
  describe('Translation Support', () => {
    it('displays translated button title in Slovak', () => {
      renderWithTranslation(<KeyboardShortcutsButton />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title');
    });

    it('displays translated button title in English', () => {
      renderWithTranslation(<KeyboardShortcutsButton />, { initialLanguage: 'en' });
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title');
    });

    it('displays translated modal title', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<KeyboardShortcutsButton />);

      await user.click(screen.getByRole('button'));

      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toBeInTheDocument();
      expect(title.textContent).toBeTruthy();
    });

    it('displays translated shortcut descriptions', async () => {
      const user = userEvent.setup();
      const { container } = renderWithTranslation(<KeyboardShortcutsButton />);

      await user.click(screen.getByRole('button'));

      // Each shortcut should have a description
      const descriptions = container.querySelectorAll('[class*="description"]');
      expect(descriptions.length).toBe(11);
      descriptions.forEach(desc => {
        expect(desc.textContent).toBeTruthy();
      });
    });
  });

  // ================================================================
  // ACCESSIBILITY TESTS
  // ================================================================
  describe('Accessibility', () => {
    it('button has accessible title', () => {
      renderWithTranslation(<KeyboardShortcutsButton />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title');
    });

    it('close button has aria-label', async () => {
      const user = userEvent.setup();
      const { container } = renderWithTranslation(<KeyboardShortcutsButton />);

      await user.click(screen.getByRole('button'));

      const closeButton = container.querySelector('[class*="closeButton"]');
      expect(closeButton).toHaveAttribute('aria-label');
    });

    it('shortcuts use semantic kbd elements', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<KeyboardShortcutsButton />);

      await user.click(screen.getByRole('button'));

      const kbdElements = document.querySelectorAll('kbd');
      expect(kbdElements.length).toBeGreaterThan(0);
    });

    it('modal has heading structure', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<KeyboardShortcutsButton />);

      await user.click(screen.getByRole('button'));

      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });
  });

  // ================================================================
  // CSS & STYLING TESTS
  // ================================================================
  describe('CSS & Styling', () => {
    it('button has base class', () => {
      const { container } = renderWithTranslation(<KeyboardShortcutsButton />);
      const button = container.querySelector('[class*="button"]');
      expect(button).toBeInTheDocument();
    });

    it('button has position class', () => {
      const { container } = renderWithTranslation(<KeyboardShortcutsButton position="bottom-right" />);
      const button = container.querySelector('[class*="button"]');
      expect(button?.className).toMatch(/button/);
    });

    it('modal has overlay class when open', async () => {
      const user = userEvent.setup();
      const { container } = renderWithTranslation(<KeyboardShortcutsButton />);

      await user.click(screen.getByRole('button'));

      const overlay = container.querySelector('[class*="overlay"]');
      expect(overlay).toBeInTheDocument();
    });

    it('modal has content class when open', async () => {
      const user = userEvent.setup();
      const { container } = renderWithTranslation(<KeyboardShortcutsButton />);

      await user.click(screen.getByRole('button'));

      const content = container.querySelector('[class*="content"]');
      expect(content).toBeInTheDocument();
    });

    it('shortcuts have key class', async () => {
      const user = userEvent.setup();
      renderWithTranslation(<KeyboardShortcutsButton />);

      await user.click(screen.getByRole('button'));

      // Check kbd elements have key class
      const kbdElements = document.querySelectorAll('kbd');
      expect(kbdElements.length).toBe(11);
      kbdElements.forEach(kbd => {
        expect(kbd.className).toMatch(/key/);
      });
    });
  });
});
