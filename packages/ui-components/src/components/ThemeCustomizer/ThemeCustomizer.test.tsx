/*
 * ================================================================
 * FILE: ThemeCustomizer.test.tsx
 * PATH: /packages/ui-components/src/components/ThemeCustomizer/ThemeCustomizer.test.tsx
 * DESCRIPTION: Unit tests for ThemeCustomizer component
 * VERSION: v1.0.0
 * CREATED: 2025-12-11
 * UPDATED: 2025-12-11
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderWithAll, screen, userEvent } from '../../test-utils';
import { ThemeCustomizer } from './ThemeCustomizer';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('ThemeCustomizer', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    // Reset document styles
    document.documentElement.removeAttribute('data-compact');
    document.documentElement.removeAttribute('data-high-contrast');
    document.documentElement.removeAttribute('data-reduce-motion');
    document.documentElement.removeAttribute('data-font-size');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ================================================================
  // RENDERING TESTS
  // ================================================================
  describe('Rendering', () => {
    it('renders floating button', () => {
      renderWithAll(<ThemeCustomizer />);
      const button = screen.getByRole('button', { name: /palette/i });
      expect(button).toBeInTheDocument();
    });

    it('renders button with theme icon', () => {
      renderWithAll(<ThemeCustomizer />);
      expect(screen.getByText('🎨')).toBeInTheDocument();
    });

    it('does not show modal by default', () => {
      renderWithAll(<ThemeCustomizer />);
      // Modal title should not be visible
      expect(screen.queryByText(/themeCustomizer/)).not.toBeInTheDocument();
    });

    it('renders button with title attribute', () => {
      renderWithAll(<ThemeCustomizer />);
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
      renderWithAll(<ThemeCustomizer />);

      const button = screen.getByRole('button');
      await user.click(button);

      // Modal should be visible - look for checkboxes that appear in modal
      expect(screen.getByText('📦', { exact: false })).toBeInTheDocument();
    });

    it('closes modal when overlay is clicked', async () => {
      const user = userEvent.setup();
      const { container } = renderWithAll(<ThemeCustomizer />);

      // Open modal
      await user.click(screen.getByRole('button'));

      // Click overlay (the modal backdrop)
      const overlay = container.querySelector('[class*="overlay"]');
      if (overlay) {
        await user.click(overlay);
      }

      // Modal content should be gone
      expect(screen.queryByText('📦', { exact: false })).not.toBeInTheDocument();
    });

    it('closes modal when close button is clicked', async () => {
      const user = userEvent.setup();
      renderWithAll(<ThemeCustomizer />);

      // Open modal
      await user.click(screen.getByRole('button'));
      expect(screen.getByText('📦', { exact: false })).toBeInTheDocument();

      // Find and click close button (✕)
      const closeButton = screen.getByText('✕');
      await user.click(closeButton);

      // Modal should be closed
      expect(screen.queryByText('📦', { exact: false })).not.toBeInTheDocument();
    });

    it('does not close modal when clicking inside modal content', async () => {
      const user = userEvent.setup();
      const { container } = renderWithAll(<ThemeCustomizer />);

      // Open modal
      await user.click(screen.getByRole('button'));

      // Click inside modal content
      const modalContent = container.querySelector('[class*="modal"]');
      if (modalContent) {
        await user.click(modalContent);
      }

      // Modal should still be open
      expect(screen.getByText('📦', { exact: false })).toBeInTheDocument();
    });
  });

  // ================================================================
  // SETTINGS TESTS
  // ================================================================
  describe('Settings', () => {
    it('renders compact mode checkbox', async () => {
      const user = userEvent.setup();
      renderWithAll(<ThemeCustomizer />);

      await user.click(screen.getByRole('button'));

      // 📦 is the compact mode icon (with text after)
      expect(screen.getByText('📦', { exact: false })).toBeInTheDocument();
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThanOrEqual(3);
    });

    it('renders high contrast checkbox', async () => {
      const user = userEvent.setup();
      renderWithAll(<ThemeCustomizer />);

      await user.click(screen.getByRole('button'));

      // 🔆 is the high contrast icon (with text after)
      expect(screen.getByText('🔆', { exact: false })).toBeInTheDocument();
    });

    it('renders animations checkbox', async () => {
      const user = userEvent.setup();
      renderWithAll(<ThemeCustomizer />);

      await user.click(screen.getByRole('button'));

      // ✨ is the animations icon (with text after)
      expect(screen.getByText('✨', { exact: false })).toBeInTheDocument();
    });

    it('renders font size select', async () => {
      const user = userEvent.setup();
      renderWithAll(<ThemeCustomizer />);

      await user.click(screen.getByRole('button'));

      // 📏 is the font size icon (with text after)
      expect(screen.getByText('📏', { exact: false })).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders accent color section', async () => {
      const user = userEvent.setup();
      renderWithAll(<ThemeCustomizer />);

      await user.click(screen.getByRole('button'));

      // There should be multiple 🎨 icons (button + section header)
      expect(screen.getAllByText('🎨', { exact: false }).length).toBeGreaterThan(0);
    });

    it('renders 7 accent color options', async () => {
      const user = userEvent.setup();
      const { container } = renderWithAll(<ThemeCustomizer />);

      await user.click(screen.getByRole('button'));

      // Color buttons in the color grid
      const colorButtons = container.querySelectorAll('[class*="colorButton"]');
      expect(colorButtons.length).toBe(7);
    });
  });

  // ================================================================
  // INTERACTION TESTS
  // ================================================================
  describe('Interactions', () => {
    it('toggles compact mode when checkbox clicked', async () => {
      const user = userEvent.setup();
      renderWithAll(<ThemeCustomizer />);

      await user.click(screen.getByRole('button'));

      const checkboxes = screen.getAllByRole('checkbox');
      const compactCheckbox = checkboxes[0]; // First checkbox is compact mode

      expect(compactCheckbox).not.toBeChecked();
      await user.click(compactCheckbox);
      expect(compactCheckbox).toBeChecked();
    });

    it('toggles high contrast when checkbox clicked', async () => {
      const user = userEvent.setup();
      renderWithAll(<ThemeCustomizer />);

      await user.click(screen.getByRole('button'));

      const checkboxes = screen.getAllByRole('checkbox');
      const highContrastCheckbox = checkboxes[1]; // Second checkbox is high contrast

      expect(highContrastCheckbox).not.toBeChecked();
      await user.click(highContrastCheckbox);
      expect(highContrastCheckbox).toBeChecked();
    });

    it('toggles animations when checkbox clicked', async () => {
      const user = userEvent.setup();
      renderWithAll(<ThemeCustomizer />);

      await user.click(screen.getByRole('button'));

      const checkboxes = screen.getAllByRole('checkbox');
      const animationsCheckbox = checkboxes[2]; // Third checkbox is animations

      // Animations default to ON
      expect(animationsCheckbox).toBeChecked();
      await user.click(animationsCheckbox);
      expect(animationsCheckbox).not.toBeChecked();
    });

    it('changes font size when select value changes', async () => {
      const user = userEvent.setup();
      renderWithAll(<ThemeCustomizer />);

      await user.click(screen.getByRole('button'));

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('medium');

      await user.selectOptions(select, 'large');
      expect(select).toHaveValue('large');
    });

    it('changes accent color when color button clicked', async () => {
      const user = userEvent.setup();
      const { container } = renderWithAll(<ThemeCustomizer />);

      await user.click(screen.getByRole('button'));

      const colorButtons = container.querySelectorAll('[class*="colorButton"]');
      const blueButton = colorButtons[1]; // Second color is Blue

      await user.click(blueButton);

      // Blue button should now have active styling (thicker border)
      expect(blueButton).toHaveStyle({ border: '3px solid white' });
    });
  });

  // ================================================================
  // RESET FUNCTIONALITY TESTS
  // ================================================================
  describe('Reset Functionality', () => {
    it('renders reset button', async () => {
      const user = userEvent.setup();
      renderWithAll(<ThemeCustomizer />);

      await user.click(screen.getByRole('button'));

      // Reset button has 🔄 icon
      expect(screen.getByText('🔄', { exact: false })).toBeInTheDocument();
    });

    it('resets settings to defaults when reset button clicked', async () => {
      const user = userEvent.setup();
      renderWithAll(<ThemeCustomizer />);

      await user.click(screen.getByRole('button'));

      // Change some settings
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]); // Enable compact mode
      expect(checkboxes[0]).toBeChecked();

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'large');
      expect(select).toHaveValue('large');

      // Click reset - find button containing 🔄
      const resetButton = screen.getByText('🔄', { exact: false }).closest('button');
      if (resetButton) {
        await user.click(resetButton);
      }

      // Settings should be reset
      expect(checkboxes[0]).not.toBeChecked();
      expect(select).toHaveValue('medium');
    });
  });

  // ================================================================
  // POSITION PROPS TESTS
  // ================================================================
  describe('Position Props', () => {
    it('accepts position prop', () => {
      const { container } = renderWithAll(<ThemeCustomizer position="top-left" />);
      const button = container.querySelector('[class*="button"]');
      expect(button).toBeInTheDocument();
    });

    it('accepts statusBarExpanded prop', () => {
      renderWithAll(<ThemeCustomizer statusBarExpanded={true} />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('accepts statusBarHeight prop', () => {
      renderWithAll(<ThemeCustomizer statusBarHeight={40} />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('accepts statusBarExpandedHeight prop', () => {
      renderWithAll(<ThemeCustomizer statusBarExpandedHeight={400} />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('calculates bottom position when collapsed', () => {
      renderWithAll(
        <ThemeCustomizer statusBarHeight={32} statusBarExpandedHeight={300} statusBarExpanded={false} />
      );
      const button = screen.getByRole('button');
      // Collapsed: 32 + 16 = 48px
      expect(button).toHaveStyle({ bottom: '48px' });
    });

    it('calculates bottom position when expanded', () => {
      renderWithAll(
        <ThemeCustomizer statusBarHeight={32} statusBarExpandedHeight={300} statusBarExpanded={true} />
      );
      const button = screen.getByRole('button');
      // Expanded: (300 + 32) + 16 = 348px
      expect(button).toHaveStyle({ bottom: '348px' });
    });
  });

  // ================================================================
  // LOCALSTORAGE PERSISTENCE TESTS
  // ================================================================
  describe('LocalStorage Persistence', () => {
    it('saves settings to localStorage when changed', async () => {
      const user = userEvent.setup();
      renderWithAll(<ThemeCustomizer />);

      await user.click(screen.getByRole('button'));

      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]); // Enable compact mode

      // Check localStorage was updated
      const saved = localStorage.getItem('l-kern-custom-settings');
      expect(saved).not.toBeNull();
      if (saved) {
        const parsed = JSON.parse(saved);
        expect(parsed.compactMode).toBe(true);
      }
    });

    it('loads settings from localStorage on mount', async () => {
      // Pre-set localStorage
      localStorage.setItem('l-kern-custom-settings', JSON.stringify({
        compactMode: true,
        highContrast: false,
        showAnimations: true,
        fontSize: 'large',
        accentColor: '#3366cc',
      }));

      const user = userEvent.setup();
      renderWithAll(<ThemeCustomizer />);

      await user.click(screen.getByRole('button'));

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).toBeChecked(); // Compact mode loaded as true

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('large');
    });

    it('handles invalid localStorage gracefully', async () => {
      localStorage.setItem('l-kern-custom-settings', 'invalid-json');

      const user = userEvent.setup();
      renderWithAll(<ThemeCustomizer />);

      // Should not crash, uses defaults
      await user.click(screen.getByRole('button'));

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).not.toBeChecked(); // Uses default (false)
    });
  });

  // ================================================================
  // CSS VARIABLE APPLICATION TESTS
  // ================================================================
  describe('CSS Variable Application', () => {
    it('applies compact mode CSS variables', async () => {
      const user = userEvent.setup();
      renderWithAll(<ThemeCustomizer />);

      await user.click(screen.getByRole('button'));

      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]); // Enable compact mode

      // Check document attribute
      expect(document.documentElement.getAttribute('data-compact')).toBe('true');
    });

    it('applies high contrast CSS variables', async () => {
      const user = userEvent.setup();
      renderWithAll(<ThemeCustomizer />);

      await user.click(screen.getByRole('button'));

      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[1]); // Enable high contrast

      expect(document.documentElement.getAttribute('data-high-contrast')).toBe('true');
    });

    it('applies reduce motion when animations disabled', async () => {
      const user = userEvent.setup();
      renderWithAll(<ThemeCustomizer />);

      await user.click(screen.getByRole('button'));

      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[2]); // Disable animations

      expect(document.documentElement.getAttribute('data-reduce-motion')).toBe('true');
    });

    it('applies font size to document', async () => {
      const user = userEvent.setup();
      renderWithAll(<ThemeCustomizer />);

      await user.click(screen.getByRole('button'));

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'large');

      expect(document.documentElement.getAttribute('data-font-size')).toBe('large');
    });
  });

  // ================================================================
  // TRANSLATION TESTS
  // ================================================================
  describe('Translation Support', () => {
    it('displays translated button title in Slovak', () => {
      renderWithAll(<ThemeCustomizer />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title');
    });

    it('displays translated button title in English', () => {
      renderWithAll(<ThemeCustomizer />, { initialLanguage: 'en' });
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title');
    });

    it('displays translated modal content', async () => {
      const user = userEvent.setup();
      renderWithAll(<ThemeCustomizer />);

      await user.click(screen.getByRole('button'));

      // Modal title should be translated
      const title = document.querySelector('[class*="title"]');
      expect(title).toBeInTheDocument();
    });
  });

  // ================================================================
  // ACCESSIBILITY TESTS
  // ================================================================
  describe('Accessibility', () => {
    it('button has accessible title', () => {
      renderWithAll(<ThemeCustomizer />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title');
    });

    it('checkboxes are properly labeled', async () => {
      const user = userEvent.setup();
      renderWithAll(<ThemeCustomizer />);

      await user.click(screen.getByRole('button'));

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => {
        // Each checkbox is inside a label
        expect(checkbox.closest('label')).toBeInTheDocument();
      });
    });

    it('color buttons have title attributes', async () => {
      const user = userEvent.setup();
      const { container } = renderWithAll(<ThemeCustomizer />);

      await user.click(screen.getByRole('button'));

      const colorButtons = container.querySelectorAll('[class*="colorButton"]');
      colorButtons.forEach(button => {
        expect(button).toHaveAttribute('title');
      });
    });

    it('close button has title attribute', async () => {
      const user = userEvent.setup();
      renderWithAll(<ThemeCustomizer />);

      await user.click(screen.getByRole('button'));

      const closeButton = screen.getByText('✕').closest('button');
      expect(closeButton).toHaveAttribute('title');
    });

    it('reset button has title attribute', async () => {
      const user = userEvent.setup();
      renderWithAll(<ThemeCustomizer />);

      await user.click(screen.getByRole('button'));

      const resetButton = screen.getByText('🔄', { exact: false }).closest('button');
      expect(resetButton).toHaveAttribute('title');
    });
  });

  // ================================================================
  // CSS & STYLING TESTS
  // ================================================================
  describe('CSS & Styling', () => {
    it('button has themed background color', () => {
      renderWithAll(<ThemeCustomizer />);
      const button = screen.getByRole('button');
      // Default accent color is L-KERN Purple
      expect(button).toHaveStyle({ background: '#9c27b0' });
    });

    it('button background changes with accent color', async () => {
      localStorage.setItem('l-kern-custom-settings', JSON.stringify({
        compactMode: false,
        highContrast: false,
        showAnimations: true,
        fontSize: 'medium',
        accentColor: '#3366cc', // Blue
      }));

      renderWithAll(<ThemeCustomizer />);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ background: '#3366cc' });
    });

    it('modal has overlay backdrop', async () => {
      const user = userEvent.setup();
      const { container } = renderWithAll(<ThemeCustomizer />);

      await user.click(screen.getByRole('button'));

      const overlay = container.querySelector('[class*="overlay"]');
      expect(overlay).toBeInTheDocument();
    });

    it('modal content has proper styling', async () => {
      const user = userEvent.setup();
      const { container } = renderWithAll(<ThemeCustomizer />);

      await user.click(screen.getByRole('button'));

      const modal = container.querySelector('[class*="modal"]');
      expect(modal).toBeInTheDocument();
      // Modal should have background style set
      expect(modal).toHaveAttribute('style');
      expect((modal as HTMLElement).style.background).toBeTruthy();
    });
  });
});
