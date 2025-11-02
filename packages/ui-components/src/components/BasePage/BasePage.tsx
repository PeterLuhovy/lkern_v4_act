/*
 * ================================================================
 * FILE: BasePage.tsx
 * PATH: /packages/ui-components/src/components/BasePage/BasePage.tsx
 * DESCRIPTION: Base page wrapper with keyboard shortcuts, analytics, HTML5 drag tracking
 * VERSION: v4.0.0
 * UPDATED: 2025-10-21 18:00:00
 * CHANGES:
 *   - v4.0.0: Added native HTML5 drag event tracking (dragstart/dragend) for text drag & drop
 *   - v3.1.0: Analytics ALWAYS run, showDebugBar only controls visualization
 *   - v3.0.0: HYBRID keyboard handling - removed ESC/Enter (now in Modal.tsx)
 *   - v2.1.0: Fixed Enter key behavior - always preventDefault when modal is open
 *   - v2.0.0: Initial version with keyboard shortcuts
 * ================================================================
 */

import React, { useEffect, useState } from 'react';
import { useTheme, useTranslation, usePageAnalytics, modalStack } from '@l-kern/config';
import { DebugBar } from '../DebugBar';
import { Sidebar, SidebarNavItem } from '../Sidebar';

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
   * Show visual debug bar (analytics always run, this just shows/hides visualization)
   * @default true
   */
  showDebugBar?: boolean;

  /**
   * Show sidebar navigation
   * @default true
   */
  showSidebar?: boolean;

  /**
   * Optional sidebar navigation items (if provided and showSidebar=true, sidebar will be shown)
   */
  sidebarItems?: SidebarNavItem[];

  /**
   * Current active path for sidebar highlighting
   */
  activePath?: string;

  /**
   * Default collapsed state for sidebar
   * @default false
   */
  sidebarDefaultCollapsed?: boolean;
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
  showSidebar = true,
  sidebarItems,
  activePath,
  sidebarDefaultCollapsed = false,
}) => {
  const { toggleTheme, theme } = useTheme();
  const { language, setLanguage } = useTranslation();
  const analytics = usePageAnalytics(pageName);

  // Sidebar collapsed state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(sidebarDefaultCollapsed);

  // Default sidebar items (tree structure matching L-KERN project)
  const defaultSidebarItems: SidebarNavItem[] = [
    { path: '/', labelKey: 'components.sidebar.home', icon: '🏠' },
    { path: '/dashboard', labelKey: 'components.sidebar.dashboard', icon: '📊' },
    {
      path: '/testing',
      labelKey: 'dashboard.testing',
      icon: '🧪',
      children: [
        { path: '/test-badge', labelKey: 'components.testing.badgeTitle', icon: '🏷️' },
        { path: '/test-card', labelKey: 'components.testing.cardTitle', icon: '🃏' },
        { path: '/test-empty-state', labelKey: 'components.testing.emptyStateTitle', icon: '📭' },
        { path: '/test-modal-v3', labelKey: 'components.testing.modalV3Title', icon: '🪟' },
        { path: '/test-toast', labelKey: 'components.testing.toastTitle', icon: '🍞' },
        { path: '/test-utilities', labelKey: 'pages.utilityTest.title', icon: '🔧' },
      ],
    },
    { path: '/contacts', labelKey: 'components.sidebar.contacts', icon: '👥' },
    { path: '/orders', labelKey: 'components.sidebar.orders', icon: '📦' },
    { path: '/settings', labelKey: 'components.sidebar.settings', icon: '⚙️' },
  ];

  // Use provided items or default
  const effectiveSidebarItems = sidebarItems || defaultSidebarItems;

  // Check if sidebar should be shown (showSidebar=true AND has items)
  const isSidebarVisible = showSidebar && effectiveSidebarItems && effectiveSidebarItems.length > 0;

  // Analytics session lifecycle (ALWAYS runs, showDebugBar only controls visualization)
  useEffect(() => {
    analytics.startSession();

    return () => {
      if (analytics.isSessionActive) {
        analytics.endSession('navigated');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageName]);

  // Global keyboard shortcut handler + analytics tracking
  useEffect(() => {
    // Universal keyboard handler (tracks both keydown AND keyup for analytics)
    const handleGlobalKeyEvent = (e: KeyboardEvent) => {
      // Don't track if modal is open (modal has priority)
      const hasOpenModal = modalStack.getTopmostModalId() !== undefined;

      // Track keyboard event in analytics (ALWAYS track, only skip if modal open)
      // Track BOTH keydown and keyup to detect selection (Shift held)
      if (!hasOpenModal) {
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
  }, [onKeyDown, toggleTheme, setLanguage, language, analytics]);

  // Global drag event handler for text drag & drop tracking
  useEffect(() => {
    const handleDragStart = (e: globalThis.DragEvent) => {
      const hasOpenModal = modalStack.getTopmostModalId() !== undefined;

      // Only track if no modal open (modal has priority)
      if (!hasOpenModal) {
        const selectedText = window.getSelection()?.toString() || '';

        // Only track if there's actually selected text
        if (selectedText) {
          analytics.trackDragStart(selectedText, {
            x: e.clientX,
            y: e.clientY
          });
        }
      }
    };

    const handleDragEnd = (e: globalThis.DragEvent) => {
      const hasOpenModal = modalStack.getTopmostModalId() !== undefined;

      // Only track if no modal open (modal has priority)
      if (!hasOpenModal) {
        analytics.trackDragEnd({
          x: e.clientX,
          y: e.clientY
        });
      }
    };

    // Register global drag listeners
    document.addEventListener('dragstart', handleDragStart, true);
    document.addEventListener('dragend', handleDragEnd, true);

    return () => {
      document.removeEventListener('dragstart', handleDragStart, true);
      document.removeEventListener('dragend', handleDragEnd, true);
    };
  }, [analytics]);

  // Handle mouse tracking (mousedown + mouseup) - ALWAYS runs
  const handleMouseEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't track if modal is open (modal has priority via stopPropagation)
    const hasOpenModal = modalStack.getTopmostModalId() !== undefined;

    if (!hasOpenModal) {
      // Get clicked element info
      const target = e.target as HTMLElement;
      const elementType = target.tagName.toLowerCase();
      const elementId = target.id || target.className || 'unknown';

      analytics.trackClick(elementId, elementType, e);
    }
  };

  // Calculate content padding based on sidebar visibility
  const contentPaddingLeft = isSidebarVisible
    ? (sidebarCollapsed ? '24px' : '240px')
    : '0';

  return (
    <div
      className={className}
      data-component="base-page"
      onMouseDown={handleMouseEvent}
      onMouseUp={handleMouseEvent}
    >
      {/* Sidebar Navigation (showSidebar=true and has items) */}
      {isSidebarVisible && (
        <Sidebar
          items={effectiveSidebarItems}
          activePath={activePath}
          collapsed={sidebarCollapsed}
          onCollapseChange={setSidebarCollapsed}
        />
      )}

      {/* Debug Bar - Visual indicator only (analytics run independently) */}
      {showDebugBar && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
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

      {/* Page content - add padding-top if debug bar is visible, padding-left for sidebar */}
      <div style={{
        paddingTop: showDebugBar ? '48px' : '0',
        paddingLeft: contentPaddingLeft,
        transition: 'padding-left 220ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {children}
      </div>
    </div>
  );
};
