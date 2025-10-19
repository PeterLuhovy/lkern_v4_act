/*
 * ================================================================
 * FILE: BasePage.tsx
 * PATH: /packages/ui-components/src/components/BasePage/BasePage.tsx
 * DESCRIPTION: Base page wrapper component with global keyboard shortcuts
 * VERSION: v3.0.0
 * UPDATED: 2025-10-19 01:05:00
 * CHANGES:
 *   - v3.0.0: HYBRID keyboard handling - removed ESC/Enter (now in Modal.tsx)
 *   - v2.1.0: Fixed Enter key behavior - always preventDefault when modal is open
 *   - v2.0.0: Initial version with keyboard shortcuts
 * ================================================================
 */

import React, { useEffect } from 'react';
import { useTheme, useTranslation } from '@l-kern/config';

/**
 * Props for BasePage component
 */
export interface BasePageProps {
  /**
   * Page content
   */
  children: React.ReactNode;

  /**
   * Optional custom keyboard handlers
   * Return true to prevent default BasePage handler
   */
  onKeyDown?: (e: KeyboardEvent) => boolean | void;

  /**
   * Optional className for custom styling
   */
  className?: string;
}

/**
 * BasePage Component
 *
 * Provides GLOBAL keyboard shortcuts for all pages (non-modal specific):
 * - Ctrl+D: Toggle dark/light theme
 * - Ctrl+L: Toggle language (SK ↔ EN)
 *
 * IMPORTANT: ESC and Enter are handled by Modal component directly (v3.0.0+)
 * This ensures better separation of concerns and allows modals to work
 * independently of BasePage wrapper.
 *
 * Note: Keyboard shortcuts are disabled when user is typing in INPUT/TEXTAREA/SELECT fields.
 *
 * @example
 * ```tsx
 * <BasePage>
 *   <h1>My Page</h1>
 *   <Modal
 *     modalId="my-modal"
 *     isOpen={isOpen}
 *     onClose={onClose}
 *     onConfirm={handleSave}  // Enter handled by Modal (not BasePage)
 *   >
 *     Content
 *   </Modal>
 * </BasePage>
 * ```
 */
export const BasePage: React.FC<BasePageProps> = ({
  children,
  onKeyDown,
  className,
}) => {
  const { toggleTheme } = useTheme();
  const { language, setLanguage } = useTranslation();

  // Global keyboard shortcut handler
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in input field
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      // Call custom handler first (if provided)
      if (onKeyDown) {
        const handled = onKeyDown(e);
        if (handled === true) {
          return; // Custom handler consumed the event
        }
      }

      // ================================================================
      // GLOBAL SHORTCUTS (non-modal specific)
      // ================================================================
      // NOTE: ESC and Enter are now handled by Modal component directly
      // This ensures better separation of concerns and allows modals
      // to work independently of BasePage wrapper

      // Ctrl+D - Toggle dark/light mode
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        toggleTheme();
      }

      // Ctrl+L - Change language
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        setLanguage(language === 'sk' ? 'en' : 'sk');
      }
    };

    // Register global keyboard listener
    document.addEventListener('keydown', handleGlobalKeyDown, true); // Use capture phase

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown, true);
    };
  }, [onKeyDown, toggleTheme, setLanguage, language]);

  return (
    <div className={className} data-component="base-page">
      {children}
    </div>
  );
};
