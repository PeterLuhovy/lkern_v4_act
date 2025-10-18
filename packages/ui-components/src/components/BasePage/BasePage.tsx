/*
 * ================================================================
 * FILE: BasePage.tsx
 * PATH: /packages/ui-components/src/components/BasePage/BasePage.tsx
 * DESCRIPTION: Base page wrapper component with global keyboard shortcuts
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 20:30:00
 * ================================================================
 */

import React, { useEffect } from 'react';
import { modalStack } from '@l-kern/config';

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
 * - Future: Add more global shortcuts as needed
 *
 * @example
 * ```tsx
 * <BasePage>
 *   <h1>My Page</h1>
 *   <Modal modalId="my-modal" isOpen={isOpen} onClose={onClose}>
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
  // Global keyboard shortcut handler
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
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

      // Future: Add more global shortcuts here
      // - Ctrl+K: Global search
      // - Ctrl+/: Show keyboard shortcuts help
      // - etc.
    };

    // Register global keyboard listener
    document.addEventListener('keydown', handleGlobalKeyDown, true); // Use capture phase

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown, true);
    };
  }, [onKeyDown]);

  return (
    <div className={className} data-component="base-page">
      {children}
    </div>
  );
};
