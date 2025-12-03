/*
 * ================================================================
 * FILE: BasePage.tsx
 * PATH: /packages/ui-components/src/components/BasePage/BasePage.tsx
 * DESCRIPTION: Base page wrapper with keyboard shortcuts, analytics, HTML5 drag tracking
 * VERSION: v4.2.0
 * UPDATED: 2025-11-30
 * CHANGES:
 *   - v4.2.0: Added Ctrl+1-9 keyboard shortcuts for changing permission levels (10-90)
 *   - v4.1.0: Added StatusBar, ThemeCustomizer, and KeyboardShortcutsButton components
 *   - v4.0.2: Fixed sidebar navigation - added missing test pages (forms, spinner, wizard-demo, glass-modal)
 *   - v4.0.1: Added Icons test page to sidebar navigation
 *   - v4.0.0: Added native HTML5 drag event tracking (dragstart/dragend) for text drag & drop
 *   - v3.1.0: Analytics ALWAYS run, showDebugBar only controls visualization
 *   - v3.0.0: HYBRID keyboard handling - removed ESC/Enter (now in Modal.tsx)
 *   - v2.1.0: Fixed Enter key behavior - always preventDefault when modal is open
 *   - v2.0.0: Initial version with keyboard shortcuts
 * ================================================================
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme, useTranslation, usePageAnalytics, modalStack, useAuthContext, useAnalyticsContext, PERMISSION_SHORTCUTS } from '@l-kern/config';
import { DebugBar } from '../DebugBar';
import { Sidebar, SidebarNavItem } from '../Sidebar';
import { ReportButton } from '../ReportButton';
import { IssueTypeSelectModal } from '../IssueTypeSelectModal';
import { CreateIssueModal } from '../CreateIssueModal';
import { StatusBar } from '../StatusBar';
import type { ServiceStatus, BackupInfo, CurrentUser, DataSource } from '../StatusBar';
import { ThemeCustomizer } from '../ThemeCustomizer';
import { KeyboardShortcutsButton } from '../KeyboardShortcutsButton';
import type { IssueType, IssueSeverity, IssueCategory, IssuePriority, UserRole } from '../CreateIssueModal';

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

  /**
   * Custom content to display at bottom of sidebar (above theme/language toggles)
   */
  sidebarBottomContent?: React.ReactNode;

  /**
   * Show report button for bug reports
   * @default true
   */
  showReportButton?: boolean;

  /**
   * Callback when issue is submitted via CreateIssueModal
   */
  onReportIssue?: (data: {
    title: string;
    description: string;
    type: IssueType;
    severity?: IssueSeverity;
    category?: IssueCategory;
    priority?: IssuePriority;
    error_message?: string;
    error_type?: string;
    browser?: string;
    os?: string;
    url?: string;
  }) => Promise<void>;

  /**
   * Report button position
   * @default 'top-right'
   */
  reportButtonPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

  /**
   * Show StatusBar at bottom of page
   * @default true
   */
  showStatusBar?: boolean;

  /**
   * Services data for StatusBar (from orchestrator)
   */
  statusBarServices?: Record<string, ServiceStatus>;

  /**
   * Current user info for StatusBar
   */
  statusBarUser?: CurrentUser;

  /**
   * Data source for StatusBar
   * @default 'mock'
   */
  statusBarDataSource?: DataSource;

  /**
   * Show ThemeCustomizer floating button
   * @default true
   */
  showThemeCustomizer?: boolean;

  /**
   * Show KeyboardShortcutsButton floating button
   * @default true
   */
  showKeyboardShortcuts?: boolean;
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
  sidebarBottomContent,
  showReportButton = true,
  onReportIssue,
  reportButtonPosition = 'top-right',
  showStatusBar = true,
  statusBarServices,
  statusBarUser,
  statusBarDataSource = 'mock',
  showThemeCustomizer = true,
  showKeyboardShortcuts = true,
}) => {
  const { toggleTheme, theme } = useTheme();
  const { language, setLanguage } = useTranslation();
  const analytics = usePageAnalytics(pageName);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentRole, permissionLevel, permissions, setPermissionLevel } = useAuthContext();

  // Try to get showDebugBarPage from AnalyticsContext (sidebar toggle)
  let contextShowDebugBarPage = true;
  try {
    const analyticsContext = useAnalyticsContext();
    contextShowDebugBarPage = analyticsContext.settings.showDebugBarPage;
  } catch {
    // AnalyticsContext not available, use prop value
  }

  // Final showDebugBar = prop AND context (both must be true)
  const effectiveShowDebugBar = showDebugBar && contextShowDebugBarPage;

  // Sidebar collapsed state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(sidebarDefaultCollapsed);

  // IssueTypeSelectModal state
  const [isTypeSelectOpen, setIsTypeSelectOpen] = useState(false);

  // CreateIssueModal state
  const [isCreateIssueModalOpen, setIsCreateIssueModalOpen] = useState(false);
  const [browserContext, setBrowserContext] = useState<{
    browser?: string;
    os?: string;
    url?: string;
    type?: IssueType;
    system_info?: {
      url?: string;
      browser?: string;
      os?: string;
      viewport?: string;
      screen?: string;
      timestamp?: string;
      userAgent?: string;
    };
  }>({});

  // StatusBar state - for synchronizing floating buttons position
  const [statusBarExpanded, setStatusBarExpanded] = useState(false);
  const [statusBarExpandedHeight, setStatusBarExpandedHeight] = useState(300);
  const STATUS_BAR_COLLAPSED_HEIGHT = 32;

  // Handle ReportButton click - open type selection modal
  const handleReportButtonClick = () => {
    setIsTypeSelectOpen(true);
  };

  // Handle issue type selection - collect browser context and open create modal
  const handleTypeSelect = (type: IssueType) => {
    // Close type select modal
    setIsTypeSelectOpen(false);

    // Collect browser information
    const userAgent = navigator.userAgent;
    const url = window.location.href;

    // Parse browser name and version from userAgent
    let browserInfo = 'Unknown';
    if (userAgent.includes('Chrome')) {
      const match = userAgent.match(/Chrome\/(\d+)/);
      browserInfo = match ? `Chrome ${match[1]}` : 'Chrome';
    } else if (userAgent.includes('Firefox')) {
      const match = userAgent.match(/Firefox\/(\d+)/);
      browserInfo = match ? `Firefox ${match[1]}` : 'Firefox';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      const match = userAgent.match(/Version\/(\d+)/);
      browserInfo = match ? `Safari ${match[1]}` : 'Safari';
    } else if (userAgent.includes('Edge')) {
      const match = userAgent.match(/Edge\/(\d+)/);
      browserInfo = match ? `Edge ${match[1]}` : 'Edge';
    }

    // Parse OS from userAgent
    let osInfo = 'Unknown';
    if (userAgent.includes('Windows NT 10.0')) osInfo = 'Windows 10/11';
    else if (userAgent.includes('Windows NT 6.3')) osInfo = 'Windows 8.1';
    else if (userAgent.includes('Windows NT 6.2')) osInfo = 'Windows 8';
    else if (userAgent.includes('Windows NT 6.1')) osInfo = 'Windows 7';
    else if (userAgent.includes('Mac OS X')) {
      const match = userAgent.match(/Mac OS X (\d+[._]\d+)/);
      osInfo = match ? `macOS ${match[1].replace('_', '.')}` : 'macOS';
    } else if (userAgent.includes('Linux')) osInfo = 'Linux';

    // Build system info object (same as Issues.tsx)
    const timestamp = new Date().toISOString();
    const viewport = `${window.innerWidth}x${window.innerHeight}`;
    const screenSize = `${window.screen.width}x${window.screen.height}`;

    const systemInfo = {
      url,
      browser: browserInfo,
      os: osInfo,
      viewport,
      screen: screenSize,
      timestamp,
      userAgent,
    };

    setBrowserContext({
      browser: browserInfo,
      os: osInfo,
      url: url,
      type, // Add selected type to initial data
      system_info: systemInfo,
    });

    setIsCreateIssueModalOpen(true);
  };

  // Load sidebar width from localStorage for dynamic padding
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    try {
      const saved = localStorage.getItem('sidebar-width');
      return saved !== null ? parseInt(saved, 10) : 240;
    } catch {
      return 240;
    }
  });

  // Listen for localStorage changes (when sidebar width changes)
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('sidebar-width');
        if (saved !== null) {
          setSidebarWidth(parseInt(saved, 10));
        }
      } catch (error) {
        console.error('Failed to sync sidebar width:', error);
      }
    };

    // Poll localStorage every 100ms to detect changes
    const interval = setInterval(handleStorageChange, 100);
    return () => clearInterval(interval);
  }, []);

  // Default sidebar items (tree structure matching L-KERN project)
  // Home is root parent, all other main sections are its children
  const defaultSidebarItems: SidebarNavItem[] = [
    {
      path: '/',
      labelKey: 'components.sidebar.home',
      icon: '🏠',
      onClick: () => navigate('/'),
      children: [
        { path: '/dashboard', labelKey: 'components.sidebar.dashboard', icon: '📊' }, // Not yet implemented (no onClick = disabled)
        {
          path: '/testing',
          labelKey: 'dashboard.testing',
          icon: '🧪',
          onClick: () => navigate('/testing'),
          children: [
            {
              path: '/testing/components',
              labelKey: 'components.testing.categoryComponents',
              icon: '🧩',
              onClick: () => {}, // Expandable category (no navigation)
              children: [
                { path: '/testing/badge', labelKey: 'components.testing.badgeTitle', icon: '🏷️', onClick: () => navigate('/testing/badge') },
                { path: '/testing/card', labelKey: 'components.testing.cardTitle', icon: '🃏', onClick: () => navigate('/testing/card') },
                { path: '/testing/datagrid', labelKey: 'components.testing.dataGridTitle', icon: '📊', onClick: () => navigate('/testing/datagrid') },
                { path: '/testing/empty-state', labelKey: 'components.testing.emptyStateTitle', icon: '📭', onClick: () => navigate('/testing/empty-state') },
                { path: '/testing/forms', labelKey: 'components.testing.formComponents', icon: '📝', onClick: () => navigate('/testing/forms') },
                { path: '/testing/glass-modal', labelKey: 'components.testing.glassModal.title', icon: '✨', onClick: () => navigate('/testing/glass-modal') },
                { path: '/testing/icons', labelKey: 'components.testing.iconsTitle', icon: '🎨', onClick: () => navigate('/testing/icons') },
                { path: '/testing/modal-v3', labelKey: 'components.testing.modalV3Title', icon: '🪟', onClick: () => navigate('/testing/modal-v3') },
                { path: '/testing/spinner', labelKey: 'components.testing.spinnerTitle', icon: '⏳', onClick: () => navigate('/testing/spinner') },
                { path: '/testing/toast', labelKey: 'components.testing.toastTitle', icon: '🍞', onClick: () => navigate('/testing/toast') },
                { path: '/testing/utility', labelKey: 'pages.utilityTest.title', icon: '🔧', onClick: () => navigate('/testing/utility') },
                { path: '/testing/wizard-demo', labelKey: 'components.testing.wizardTitle', icon: '🧙', onClick: () => navigate('/testing/wizard-demo') },
              ],
            },
            {
              path: '/testing/pages',
              labelKey: 'components.testing.categoryPages',
              icon: '📄',
              onClick: () => {}, // Expandable category (no navigation)
              children: [
                { path: '/testing/filtered-grid', labelKey: 'components.testing.filteredGridTitle', icon: '🔍', onClick: () => navigate('/testing/filtered-grid') },
                { path: '/testing/template-page-datagrid', labelKey: 'components.testing.templatePageDatagridTitle', icon: '📋', onClick: () => navigate('/testing/template-page-datagrid') },
                { path: '/testing/base-page-template', labelKey: 'components.testing.templatePageBaseTitle', icon: '📄', onClick: () => navigate('/testing/base-page-template') },
              ],
            },
          ],
        },
        { path: '/contacts', labelKey: 'components.sidebar.contacts', icon: '👥' }, // Not yet implemented (no onClick = disabled)
        { path: '/orders', labelKey: 'components.sidebar.orders', icon: '📦', onClick: () => navigate('/orders') },
        { path: '/issues', labelKey: 'components.sidebar.issues', icon: '🐛', onClick: () => navigate('/issues') },
        { path: '/settings', labelKey: 'components.sidebar.settings', icon: '⚙️' }, // Not yet implemented (no onClick = disabled)
      ],
    },
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

      // Ctrl+1-9 - Change permission level (uses PERMISSION_SHORTCUTS from core.ts)
      if (e.ctrlKey && e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        const shortcut = PERMISSION_SHORTCUTS.find(s => s.key === e.key);
        if (shortcut) {
          setPermissionLevel(shortcut.level);
        }
      }
    };

    // Register global keyboard listeners (BOTH keydown and keyup)
    document.addEventListener('keydown', handleGlobalKeyEvent, true); // Use capture phase
    document.addEventListener('keyup', handleGlobalKeyEvent, true); // Use capture phase

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyEvent, true);
      document.removeEventListener('keyup', handleGlobalKeyEvent, true);
    };
  }, [onKeyDown, toggleTheme, setLanguage, language, analytics, setPermissionLevel]);

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

  // Calculate content padding based on sidebar visibility and dynamic width
  const contentPaddingLeft = isSidebarVisible
    ? (sidebarCollapsed ? '24px' : `${sidebarWidth}px`)
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
          activePath={activePath || location.pathname}
          collapsed={sidebarCollapsed}
          onCollapseChange={setSidebarCollapsed}
          showThemeToggle={true}
          showLanguageToggle={true}
          bottomContent={sidebarBottomContent}
        />
      )}

      {/* Debug Bar - Visual indicator only (analytics run independently) */}
      {effectiveShowDebugBar && (
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
            show={effectiveShowDebugBar}
            contextType="page"
          />
        </div>
      )}

      {/* Report Button (floating bug report) */}
      {showReportButton && (
        <ReportButton
          position={reportButtonPosition}
          onClick={handleReportButtonClick}
        />
      )}

      {/* IssueTypeSelectModal - opened by ReportButton */}
      {showReportButton && (
        <IssueTypeSelectModal
          isOpen={isTypeSelectOpen}
          onClose={() => setIsTypeSelectOpen(false)}
          onSelectType={handleTypeSelect}
          modalId="basepage-issue-type-select-modal"
        />
      )}

      {/* CreateIssueModal - opened after type selection */}
      {showReportButton && (
        <CreateIssueModal
          isOpen={isCreateIssueModalOpen}
          onClose={() => setIsCreateIssueModalOpen(false)}
          modalId="basepage-report-issue-modal"
          initialData={browserContext}
          showRoleTabs={false}
          userRole={
            permissionLevel >= 60
              ? 'user_advance'
              : permissionLevel >= 30
              ? 'user_standard'
              : 'user_basic'
          }
          onSubmit={async (data) => {
            if (onReportIssue) {
              await onReportIssue(data);
            } else {
              // Default: log to console
              console.log('[Issue Report]', data);
            }
            setIsCreateIssueModalOpen(false);
          }}
        />
      )}

      {/* StatusBar (fixed bottom system monitoring) */}
      {showStatusBar && (
        <StatusBar
          services={statusBarServices}
          currentUser={statusBarUser}
          dataSource={statusBarDataSource}
          onExpandedChange={setStatusBarExpanded}
          onExpandedHeightChange={setStatusBarExpandedHeight}
        />
      )}

      {/* ThemeCustomizer (floating button) */}
      {showThemeCustomizer && (
        <ThemeCustomizer
          position="bottom-right"
          statusBarExpanded={statusBarExpanded}
          statusBarHeight={STATUS_BAR_COLLAPSED_HEIGHT}
          statusBarExpandedHeight={statusBarExpandedHeight}
        />
      )}

      {/* KeyboardShortcutsButton (floating button above ThemeCustomizer) */}
      {showKeyboardShortcuts && (
        <KeyboardShortcutsButton
          position="bottom-right"
          statusBarExpanded={statusBarExpanded}
          statusBarHeight={STATUS_BAR_COLLAPSED_HEIGHT}
          statusBarExpandedHeight={statusBarExpandedHeight}
        />
      )}

      {/* Page content - add padding-top if debug bar is visible, padding-left for sidebar, padding-bottom for StatusBar */}
      <div style={{
        paddingTop: effectiveShowDebugBar ? '48px' : '0',
        paddingLeft: contentPaddingLeft,
        paddingBottom: showStatusBar ? `${STATUS_BAR_COLLAPSED_HEIGHT + 16}px` : '0',
        transition: 'padding-left 220ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {children}
      </div>
    </div>
  );
};
