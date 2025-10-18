/*
 * ================================================================
 * FILE: BasePage.tsx
 * PATH: /packages/ui-components/src/components/BasePage/BasePage.tsx
 * DESCRIPTION: Base page wrapper component with global keyboard shortcuts
 * VERSION: v2.0.0
 * UPDATED: 2025-10-18 23:00:00
 * ================================================================
 */

import React, { useEffect } from 'react';
import { modalStack, useTheme, useTranslation } from '@l-kern/config';

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
 * Provides global keyboard shortcuts for all pages:
 * - ESC: Close topmost modal (from modalStack)
 * - Enter: Confirm/submit topmost modal (if onConfirm callback provided)
 * - Ctrl+D: Toggle dark/light theme
 * - Ctrl+L: Toggle language (SK ↔ EN)
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
 *     onConfirm={handleSave}  // Enter key will trigger this
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

      // ESC key - close topmost modal
      if (e.key === 'Escape') {
        const topmostModalId = modalStack.getTopmostModalId();

        if (topmostModalId) {
          console.log('[BasePage] ESC pressed - closing topmost modal:', topmostModalId);
          e.preventDefault();
          e.stopPropagation();

          // Close modal via modalStack (calls onClose callback)
          modalStack.closeModal(topmostModalId);
        }
      }

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

      // Enter key - confirm/submit topmost modal
      if (e.key === 'Enter') {
        const topmostModalId = modalStack.getTopmostModalId();

        if (topmostModalId) {
          console.log('[BasePage] Enter pressed - confirming topmost modal:', topmostModalId);
          const confirmed = modalStack.confirmModal(topmostModalId);

          if (confirmed) {
            e.preventDefault();
            e.stopPropagation();
          }
        }
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
