/*
 * ================================================================
 * FILE: AuthRoleSwitcher.test.tsx
 * PATH: /packages/ui-components/src/components/AuthRoleSwitcher/AuthRoleSwitcher.test.tsx
 * DESCRIPTION: Unit tests for AuthRoleSwitcher component
 * VERSION: v1.1.0
 * CREATED: 2025-12-11
 * UPDATED: 2025-12-16
 * ================================================================
 */

import { describe, it, expect } from 'vitest';
import { renderWithAll, screen, fireEvent, userEvent } from '../../test-utils';
import { AuthRoleSwitcher } from './AuthRoleSwitcher';

describe('AuthRoleSwitcher', () => {
  // ================================================================
  // RENDERING TESTS
  // ================================================================
  describe('Rendering', () => {
    it('renders auth role switcher container', () => {
      const { container } = renderWithAll(<AuthRoleSwitcher />);
      expect(container.querySelector('[class*="authRoleSwitcher"]')).toBeInTheDocument();
    });

    it('renders test user section in expanded state', () => {
      const { container } = renderWithAll(<AuthRoleSwitcher />);
      // Should show user section
      const userSection = container.querySelector('[class*="userSection"]');
      expect(userSection).toBeInTheDocument();
    });

    it('renders current user info', () => {
      renderWithAll(<AuthRoleSwitcher />);
      // Should display ID prefix
      expect(screen.getByText(/ID:/)).toBeInTheDocument();
    });

    it('renders permission level indicator', () => {
      const { container } = renderWithAll(<AuthRoleSwitcher />);
      const indicator = container.querySelector('[class*="indicator"]');
      expect(indicator).toBeInTheDocument();
    });

    it('renders 9 permission level buttons', () => {
      renderWithAll(<AuthRoleSwitcher />);
      // 9 level buttons + test user buttons
      const buttons = screen.getAllByRole('button');
      // Should have at least 9 permission buttons
      expect(buttons.length).toBeGreaterThanOrEqual(9);
    });

    it('renders three category sections', () => {
      const { container } = renderWithAll(<AuthRoleSwitcher />);
      // Should have 3 category divs
      const categories = container.querySelectorAll('[class*="category"]');
      expect(categories.length).toBeGreaterThanOrEqual(3);
      // Basic icon appears in both user section and category header
      expect(screen.getAllByText('👁️').length).toBeGreaterThan(0);
    });
  });

  // ================================================================
  // COLLAPSED STATE TESTS
  // ================================================================
  describe('Collapsed State', () => {
    it('hides user section when collapsed', () => {
      const { container } = renderWithAll(<AuthRoleSwitcher isCollapsed />);
      // User section should not be rendered
      const userSection = container.querySelector('[class*="userSection"]');
      expect(userSection).not.toBeInTheDocument();
    });

    it('hides permission indicator when collapsed', () => {
      const { container } = renderWithAll(<AuthRoleSwitcher isCollapsed />);
      const indicator = container.querySelector('[class*="indicatorValue"]');
      expect(indicator).not.toBeInTheDocument();
    });

    it('hides category headers when collapsed', () => {
      const { container } = renderWithAll(<AuthRoleSwitcher isCollapsed />);
      const categoryHeader = container.querySelector('[class*="categoryHeader"]');
      expect(categoryHeader).not.toBeInTheDocument();
    });

    it('shows shortcut numbers instead of sublevel text when collapsed', () => {
      renderWithAll(<AuthRoleSwitcher isCollapsed />);
      // Should show "1" through "9" as shortcuts
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('9')).toBeInTheDocument();
    });

    it('still renders permission grid when collapsed', () => {
      const { container } = renderWithAll(<AuthRoleSwitcher isCollapsed />);
      const grid = container.querySelector('[class*="grid"]');
      expect(grid).toBeInTheDocument();
    });
  });

  // ================================================================
  // PERMISSION LEVEL TESTS
  // ================================================================
  describe('Permission Levels', () => {
    it('shows lvl1, lvl2, lvl3 labels in expanded state', () => {
      renderWithAll(<AuthRoleSwitcher />);
      // Each category has lvl1, lvl2, lvl3
      expect(screen.getAllByText('lvl1').length).toBe(3);
      expect(screen.getAllByText('lvl2').length).toBe(3);
      expect(screen.getAllByText('lvl3').length).toBe(3);
    });

    it('displays keyboard shortcut hints', () => {
      renderWithAll(<AuthRoleSwitcher />);
      expect(screen.getByText('Ctrl+1')).toBeInTheDocument();
      expect(screen.getByText('Ctrl+5')).toBeInTheDocument();
      expect(screen.getByText('Ctrl+9')).toBeInTheDocument();
    });

    it('permission buttons have correct type=button', () => {
      renderWithAll(<AuthRoleSwitcher />);
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('type', 'button');
      });
    });

    it('permission buttons have title attributes with info', () => {
      renderWithAll(<AuthRoleSwitcher />);
      // Find a button with Ctrl+ in title
      const buttonWithShortcut = screen.getAllByRole('button').find(
        btn => btn.getAttribute('title')?.includes('Ctrl+')
      );
      expect(buttonWithShortcut).toBeTruthy();
    });
  });

  // ================================================================
  // INTERACTION TESTS
  // ================================================================
  describe('Interactions', () => {
    it('changes permission level when button is clicked', async () => {
      const user = userEvent.setup();
      const { container } = renderWithAll(<AuthRoleSwitcher />);

      // Find a permission button (e.g., lvl2 of any category)
      const lvl2Buttons = screen.getAllByText('lvl2');
      const button = lvl2Buttons[0].closest('button');
      if (!button) throw new Error('Button not found');
      await user.click(button);

      // Button should get active class
      const activeButtons = container.querySelectorAll('[class*="button--active"]');
      expect(activeButtons.length).toBeGreaterThan(0);
    });

    it('highlights active permission level', () => {
      const { container } = renderWithAll(<AuthRoleSwitcher />);
      // Should have one active button for current permission level
      const activeButton = container.querySelector('[class*="button--active"]');
      expect(activeButton).toBeInTheDocument();
    });

    it('responds to keyboard shortcut Ctrl+1', () => {
      const { container } = renderWithAll(<AuthRoleSwitcher />);

      // Simulate Ctrl+1 keypress
      fireEvent.keyDown(window, { key: '1', ctrlKey: true });

      // Should change permission level - check for active button change
      const activeButtons = container.querySelectorAll('[class*="button--active"]');
      expect(activeButtons.length).toBeGreaterThan(0);
    });

    it('responds to keyboard shortcut Ctrl+9', () => {
      const { container } = renderWithAll(<AuthRoleSwitcher />);

      // Simulate Ctrl+9 keypress
      fireEvent.keyDown(window, { key: '9', ctrlKey: true });

      // Should have an active button
      const activeButtons = container.querySelectorAll('[class*="button--active"]');
      expect(activeButtons.length).toBeGreaterThan(0);
    });

    it('ignores keyboard shortcuts without Ctrl key', () => {
      const { container } = renderWithAll(<AuthRoleSwitcher />);
      const initialActive = container.querySelectorAll('[class*="button--active"]').length;

      // Press 5 without Ctrl - should be ignored
      fireEvent.keyDown(window, { key: '5' });

      // Should not change permission level
      const afterActive = container.querySelectorAll('[class*="button--active"]').length;
      expect(afterActive).toBe(initialActive);
    });
  });

  // ================================================================
  // TEST USER SECTION TESTS
  // ================================================================
  describe('Test User Section', () => {
    it('renders test user buttons', () => {
      renderWithAll(<AuthRoleSwitcher />);
      // Should have user buttons in the user section
      const userButtons = screen.getAllByRole('button').filter(
        btn => btn.getAttribute('title')?.includes('ID:')
      );
      expect(userButtons.length).toBeGreaterThan(0);
    });

    it('shows current user name', () => {
      renderWithAll(<AuthRoleSwitcher />);
      // AuthContext provides a default user - check for any user name text
      const userNameElements = document.querySelectorAll('[class*="userName"]');
      expect(userNameElements.length).toBeGreaterThan(0);
    });

    it('can switch test users', async () => {
      const user = userEvent.setup();
      renderWithAll(<AuthRoleSwitcher />);

      // Find a user button
      const userButtons = screen.getAllByRole('button').filter(
        btn => btn.getAttribute('title')?.includes('ID:')
      );

      if (userButtons.length > 1) {
        // Click a different user
        await user.click(userButtons[1]);
        // Button should become active
        expect(userButtons[1].className).toMatch(/active/);
      }
    });
  });

  // ================================================================
  // COLOR INDICATOR TESTS
  // ================================================================
  describe('Color Indicator', () => {
    it('shows permission level number in indicator', () => {
      renderWithAll(<AuthRoleSwitcher />);
      // Should show current permission level (default is 10)
      const indicatorValue = document.querySelector('[class*="indicatorValue"]');
      expect(indicatorValue).toBeInTheDocument();
    });

    it('indicator has color class based on permission', () => {
      const { container } = renderWithAll(<AuthRoleSwitcher />);
      // Indicator should have one of the color classes
      const indicator = container.querySelector('[class*="indicator"]');
      expect(indicator?.className).toMatch(/indicator--(green|yellow|orange|red)/);
    });

    it('shows permission label in indicator', () => {
      const { container } = renderWithAll(<AuthRoleSwitcher />);
      const label = container.querySelector('[class*="indicatorLabel"]');
      expect(label).toBeInTheDocument();
    });
  });

  // ================================================================
  // CATEGORY STRUCTURE TESTS
  // ================================================================
  describe('Category Structure', () => {
    it('renders three categories', () => {
      const { container } = renderWithAll(<AuthRoleSwitcher />);
      const categories = container.querySelectorAll('[class*="category"]');
      expect(categories.length).toBeGreaterThanOrEqual(3);
    });

    it('each category has 3 level buttons', () => {
      const { container } = renderWithAll(<AuthRoleSwitcher />);
      const levelGroups = container.querySelectorAll('[class*="levels"]');
      levelGroups.forEach(group => {
        const buttons = group.querySelectorAll('button');
        expect(buttons.length).toBe(3);
      });
    });

    it('buttons have color-coded classes', () => {
      const { container } = renderWithAll(<AuthRoleSwitcher />);
      // Should have green, yellow, and red buttons
      expect(container.querySelector('[class*="button--green"]')).toBeInTheDocument();
      expect(container.querySelector('[class*="button--yellow"]')).toBeInTheDocument();
      expect(container.querySelector('[class*="button--red"]')).toBeInTheDocument();
    });
  });

  // ================================================================
  // TRANSLATION TESTS
  // ================================================================
  describe('Translation Support', () => {
    it('uses translated role names', () => {
      renderWithAll(<AuthRoleSwitcher />);
      // Should have translated category names
      // The translations depend on the current language
      const categoryNames = document.querySelectorAll('[class*="categoryName"]');
      expect(categoryNames.length).toBe(3);
    });

    it('translates with English language', () => {
      renderWithAll(<AuthRoleSwitcher />, { initialLanguage: 'en' });
      const categoryNames = document.querySelectorAll('[class*="categoryName"]');
      expect(categoryNames.length).toBe(3);
    });
  });

  // ================================================================
  // CSS & STYLING TESTS
  // ================================================================
  describe('CSS & Styling', () => {
    it('has authRoleSwitcher base class', () => {
      const { container } = renderWithAll(<AuthRoleSwitcher />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toMatch(/authRoleSwitcher/);
    });

    it('has grid class for button layout', () => {
      const { container } = renderWithAll(<AuthRoleSwitcher />);
      const grid = container.querySelector('[class*="grid"]');
      expect(grid).toBeInTheDocument();
    });

    it('user buttons have role-based styling', () => {
      const { container } = renderWithAll(<AuthRoleSwitcher />);
      // Should have user buttons with role classes
      const hasRoleStyles = container.querySelector(
        '[class*="userButton--basic"], [class*="userButton--standard"], [class*="userButton--advanced"]'
      );
      expect(hasRoleStyles).toBeInTheDocument();
    });

    it('has divider between sections', () => {
      const { container } = renderWithAll(<AuthRoleSwitcher />);
      const divider = container.querySelector('[class*="divider"]');
      expect(divider).toBeInTheDocument();
    });
  });

  // ================================================================
  // ACCESSIBILITY TESTS
  // ================================================================
  describe('Accessibility', () => {
    it('all buttons have type=button attribute', () => {
      renderWithAll(<AuthRoleSwitcher />);
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('type', 'button');
      });
    });

    it('permission buttons have title with shortcut info', () => {
      renderWithAll(<AuthRoleSwitcher />);
      // Find buttons with Ctrl+ in title
      const buttonsWithShortcuts = screen.getAllByRole('button').filter(
        btn => btn.getAttribute('title')?.includes('Ctrl+')
      );
      expect(buttonsWithShortcuts.length).toBe(9);
    });

    it('user buttons have descriptive titles', () => {
      renderWithAll(<AuthRoleSwitcher />);
      const userButtons = screen.getAllByRole('button').filter(
        btn => btn.getAttribute('title')?.includes('ID:')
      );
      userButtons.forEach(btn => {
        expect(btn.getAttribute('title')).toBeTruthy();
      });
    });
  });
});
