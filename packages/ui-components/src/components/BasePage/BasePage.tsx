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
import { useTheme, useTranslation, usePageAnalytics, modalStack } from '@l-kern/config';
import { DebugBar } from '../DebugBar';

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

  /**
   * Page name for analytics tracking
   * @default 'page'
   */
  pageName?: string;

  /**
   * Show debug bar with analytics
   * @default true
   */
  showDebugBar?: boolean;
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
  pageName = 'page',
  showDebugBar = true,
}) => {
  const { toggleTheme, theme } = useTheme();
  const { language, setLanguage } = useTranslation();
  const analytics = usePageAnalytics(pageName);

  // Analytics session lifecycle
  useEffect(() => {
    if (showDebugBar) {
      analytics.startSession();
      console.log('[BasePage] Analytics session started:', pageName);
    }

    return () => {
      if (showDebugBar && analytics.isSessionActive) {
        analytics.endSession('navigated');
        console.log('[BasePage] Analytics session ended');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageName, showDebugBar]);

  // Global keyboard shortcut handler + analytics tracking
  useEffect(() => {
    // Universal keyboard handler (tracks both keydown AND keyup for analytics)
    const handleGlobalKeyEvent = (e: KeyboardEvent) => {
      // Don't track if modal is open (modal has priority)
      const hasOpenModal = modalStack.getTopmostModalId() !== undefined;

      // Track keyboard event in analytics (only if no modal open)
      // Track BOTH keydown and keyup to detect selection (Shift held)
      if (showDebugBar && !hasOpenModal) {
        analytics.trackKeyboard(e);
      }

      // Only process shortcuts on keydown (not keyup)
      if (e.type !== 'keydown') {
        return;
      }

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

    // Register global keyboard listeners (BOTH keydown and keyup)
    document.addEventListener('keydown', handleGlobalKeyEvent, true); // Use capture phase
    document.addEventListener('keyup', handleGlobalKeyEvent, true); // Use capture phase

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyEvent, true);
      document.removeEventListener('keyup', handleGlobalKeyEvent, true);
    };
  }, [onKeyDown, toggleTheme, setLanguage, language, showDebugBar, analytics]);

  // Handle mouse tracking (mousedown + mouseup)
  const handleMouseEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't track if modal is open (modal has priority via stopPropagation)
    const hasOpenModal = modalStack.getTopmostModalId() !== undefined;

    if (showDebugBar && !hasOpenModal) {
      // Get clicked element info
      const target = e.target as HTMLElement;
      const elementType = target.tagName.toLowerCase();
      const elementId = target.id || target.className || 'unknown';

      analytics.trackClick(elementId, elementType, e);
    }
  };

  return (
    <div
      className={className}
      data-component="base-page"
      onMouseDown={handleMouseEvent}
      onMouseUp={handleMouseEvent}
    >
      {/* Debug Bar - Fixed at top of page (always visible, tracks only page clicks) */}
      {showDebugBar && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999
        }}>
          <DebugBar
            modalName={pageName}
            isDarkMode={theme === 'dark'}
            analytics={analytics}
            show={showDebugBar}
            contextType="page"
          />
        </div>
      )}

      {/* Page content - add padding-top if debug bar is visible */}
      <div style={showDebugBar ? { paddingTop: '48px' } : undefined}>
        {children}
      </div>
    </div>
  );
};
