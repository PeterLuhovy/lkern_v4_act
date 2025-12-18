/*
 * ================================================================
 * FILE: Sidebar.tsx
 * PATH: /packages/ui-components/src/components/Sidebar/Sidebar.tsx
 * DESCRIPTION: Modern dark sidebar with 3 tabs (Navigation, User Settings, Analytics)
 * VERSION: v4.0.0
 * UPDATED: 2025-11-30
 * CHANGES:
 *   - v4.0.0: Added 3-tab system (Navigation, User Settings, Analytics)
 *             - Tab 1: Navigation (existing functionality)
 *             - Tab 2: User Settings (AuthRoleSwitcher)
 *             - Tab 3: Analytics Panel (toggle tracking features)
 *   - v3.0.0: Complete redesign - dark theme, floating submenu, pure React+CSS
 *   - v2.0.0: Tree navigation support, vertical toggle button
 *   - v1.0.0: Initial version
 * ================================================================
 */

import React, { useState, useCallback } from 'react';
import { useTranslation, useTheme, useAnalyticsContext, AnalyticsSettings, useAuthContext } from '@l-kern/config';
import styles from './Sidebar.module.css';
import logoImage from '../../assets/logos/lkern-logo.png';
import { AuthRoleSwitcher } from '../AuthRoleSwitcher/AuthRoleSwitcher';
import { InfoHint } from '../InfoHint/InfoHint';

/**
 * Tab type for sidebar navigation
 */
type SidebarTab = 'navigation' | 'settings' | 'analytics';

/**
 * Navigation item interface (supports submenu)
 */
export interface SidebarNavItem {
  /**
   * Unique item path/ID
   */
  path: string;

  /**
   * Display label translation key
   */
  labelKey: string;

  /**
   * Icon (emoji or SVG string)
   */
  icon: string | React.ReactNode;

  /**
   * Optional onClick handler (for navigation)
   */
  onClick?: () => void;

  /**
   * Optional badge count
   */
  badge?: number;

  /**
   * Optional children items (for submenu)
   */
  children?: SidebarNavItem[];
}

/**
 * Props for Sidebar component
 */
export interface SidebarProps {
  /**
   * Navigation items to display
   */
  items: SidebarNavItem[];

  /**
   * Current active path (for highlighting)
   */
  activePath?: string;

  /**
   * Initial collapsed state
   * @default false
   */
  defaultCollapsed?: boolean;

  /**
   * Controlled collapsed state
   */
  collapsed?: boolean;

  /**
   * Collapse change handler
   */
  onCollapseChange?: (collapsed: boolean) => void;

  /**
   * Optional custom className
   */
  className?: string;

  /**
   * Show logo at top
   * @default true
   */
  showLogo?: boolean;

  /**
   * Logo icon
   */
  logoIcon?: string | React.ReactNode;

  /**
   * Show upload box at bottom
   * @default false
   */
  showUploadBox?: boolean;

  /**
   * Show theme toggle at bottom
   * @default false
   */
  showThemeToggle?: boolean;

  /**
   * Show language toggle at bottom
   * @default false
   */
  showLanguageToggle?: boolean;

  /**
   * Custom content to display at the bottom (above theme/language toggles)
   */
  bottomContent?: React.ReactNode;

  /**
   * Show floating action button at bottom
   * @default false
   */
  showFloatingAction?: boolean;

  /**
   * Floating action button handler
   */
  onFloatingAction?: () => void;

  /**
   * Enable sidebar width resizing by dragging edge
   * @default true
   */
  resizable?: boolean;

  /**
   * Default sidebar width in pixels (when expanded)
   * @default 240
   */
  defaultWidth?: number;

  /**
   * Minimum sidebar width in pixels
   * @default 120
   */
  minWidth?: number;

  /**
   * Maximum sidebar width in pixels
   * @default 400
   */
  maxWidth?: number;
}

/**
 * Props for NavItem (with floating submenu)
 */
interface NavItemProps {
  item: SidebarNavItem;
  activePath?: string;
  isCollapsed: boolean;
  onItemClick: (item: SidebarNavItem) => void;
}

/**
 * NavItem Component (with floating submenu on hover in collapsed mode)
 */
const NavItem: React.FC<NavItemProps> = ({
  item,
  activePath,
  isCollapsed,
  onItemClick,
}) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  // Load expanded state from localStorage
  const [isExpanded, setIsExpanded] = useState(() => {
    try {
      const saved = localStorage.getItem('sidebar-expanded-items');
      if (saved) {
        const expandedItems: string[] = JSON.parse(saved);
        return expandedItems.includes(item.path);
      }
    } catch (error) {
      console.error('Failed to load sidebar expanded state:', error);
    }
    return false;
  });

  const isActive = activePath === item.path;
  const hasChildren = item.children && item.children.length > 0;
  const isDisabled = !item.onClick; // Item is disabled if no onClick handler provided

  // Handle item click (navigation only)
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    // Prevent navigation if item is disabled (no onClick handler)
    if (isDisabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Allow middle click and Ctrl+click to open in new tab
    if (e.button === 1 || e.ctrlKey || e.metaKey) {
      return; // Let browser handle it
    }
    e.preventDefault();
    onItemClick(item);
  }, [item, onItemClick, isDisabled]);

  // Handle arrow click (expand/collapse only, no navigation)
  const handleArrowClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent item click
    e.preventDefault();
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  // Save expanded state to localStorage when it changes
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('sidebar-expanded-items');
      const expandedItems: string[] = saved ? JSON.parse(saved) : [];

      if (isExpanded && !expandedItems.includes(item.path)) {
        // Add to expanded items
        expandedItems.push(item.path);
        localStorage.setItem('sidebar-expanded-items', JSON.stringify(expandedItems));
      } else if (!isExpanded && expandedItems.includes(item.path)) {
        // Remove from expanded items
        const filtered = expandedItems.filter((path) => path !== item.path);
        localStorage.setItem('sidebar-expanded-items', JSON.stringify(filtered));
      }
    } catch (error) {
      console.error('Failed to save sidebar expanded state:', error);
    }
  }, [isExpanded, item.path]);

  // Listen for storage events (expand/collapse all)
  React.useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('sidebar-expanded-items');
        if (saved) {
          const expandedItems: string[] = JSON.parse(saved);
          setIsExpanded(expandedItems.includes(item.path));
        } else {
          setIsExpanded(false);
        }
      } catch (error) {
        console.error('Failed to sync expanded state:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [item.path]);

  return (
    <li
      className={styles.sidebar__navItemWrapper}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a
        href={item.path}
        className={`${styles.sidebar__navItem} ${isActive ? styles['sidebar__navItem--active'] : ''} ${isDisabled ? styles['sidebar__navItem--disabled'] : ''}`}
        onClick={handleClick}
        aria-current={isActive ? 'page' : undefined}
        aria-disabled={isDisabled}
        title={isCollapsed ? t(item.labelKey) : undefined}
      >
        {/* Active indicator (left border) */}
        {isActive && <span className={styles.sidebar__navItemIndicator} />}

        {/* Icon */}
        <span className={styles.sidebar__icon}>
          {typeof item.icon === 'string' ? item.icon : item.icon}
        </span>

        {/* Label + expand arrow + badge */}
        <div className={styles.sidebar__labelContainer}>
          {/* Label (visible only when expanded) */}
          {!isCollapsed && (
            <span className={styles.sidebar__label}>
              {t(item.labelKey)}
            </span>
          )}

          {/* Expand arrow (visible only when expanded and has children) */}
          {!isCollapsed && hasChildren && (
            <span
              className={styles.sidebar__expandArrow}
              onClick={handleArrowClick}
            >
              {isExpanded ? '▼' : '▶'}
            </span>
          )}

          {/* Badge */}
          {item.badge !== undefined && item.badge > 0 && (
            <span className={styles.sidebar__badge}>
              {item.badge > 99 ? '99+' : item.badge}
            </span>
          )}
        </div>
      </a>

      {/* Floating submenu (collapsed mode + hover) */}
      {isCollapsed && hasChildren && isHovered && (
        <div className={styles.sidebar__floatingSubmenu}>
          <div className={styles.sidebar__floatingSubmenuHeader}>
            {t(item.labelKey)}
          </div>
          <ul className={styles.sidebar__floatingSubmenuList}>
            {/* Safe: item.children exists after hasChildren check */}
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            {item.children!.map((child) => (
              <li key={child.path}>
                <a
                  href={child.path}
                  className={`${styles.sidebar__floatingSubmenuItem} ${
                    activePath === child.path ? styles['sidebar__floatingSubmenuItem--active'] : ''
                  }`}
                  onClick={(e) => {
                    if (e.button === 1 || e.ctrlKey || e.metaKey) return;
                    e.preventDefault();
                    onItemClick(child);
                  }}
                >
                  <span className={styles.sidebar__icon}>
                    {typeof child.icon === 'string' ? child.icon : child.icon}
                  </span>
                  <span>{t(child.labelKey)}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Inline submenu (expanded mode) - render NavItem recursively for nested children */}
      {!isCollapsed && hasChildren && isExpanded && (
        <ul className={styles.sidebar__submenuList}>
          {/* Safe: item.children exists after hasChildren check */}
          {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
          {item.children!.map((child) => (
            <NavItem
              key={child.path}
              item={child}
              activePath={activePath}
              isCollapsed={isCollapsed}
              onItemClick={onItemClick}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

/**
 * Sidebar Component
 *
 * Modern dark sidebar with floating submenu tooltips in collapsed mode.
 *
 * Features:
 * - Collapsible (240px expanded / 80px collapsed)
 * - Toggle button (top-right corner with arrow)
 * - Floating submenu on hover (collapsed mode)
 * - Inline submenu (expanded mode)
 * - Dark theme optimized
 * - Logo at top
 * - Upload box, theme toggle, floating action button at bottom
 * - Smooth CSS animations
 *
 * @example
 * ```tsx
 * const navItems: SidebarNavItem[] = [
 *   { path: '/', labelKey: 'sidebar.dashboard', icon: '🏠' },
 *   {
 *     path: '/income',
 *     labelKey: 'sidebar.income',
 *     icon: '💰',
 *     children: [
 *       { path: '/income/earnings', labelKey: 'sidebar.earnings', icon: '📈' },
 *       { path: '/income/refunds', labelKey: 'sidebar.refunds', icon: '↩️' },
 *     ]
 *   },
 * ];
 *
 * <Sidebar
 *   items={navItems}
 *   activePath={location.pathname}
 *   showLogo={true}
 *   logoIcon="🎯"
 *   showThemeToggle={true}
 *   showFloatingAction={true}
 * />
 * ```
 */
/**
 * User Export Settings Component (for Tab 2)
 */
const UserExportSettings: React.FC = () => {
  const { t } = useTranslation();
  const { user, setPermissionLevel } = useAuthContext();

  const handleExportBehaviorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newBehavior = event.target.value as 'automatic' | 'save-as-dialog';

    // TODO: When backend auth is ready, this should call API to update user preferences
    // For now, we update localStorage and trigger a re-render by setting permission level
    try {
      localStorage.setItem('user-export-behavior', newBehavior);
      // Trigger re-render by setting the same permission level (hacky but works for mock)
      setPermissionLevel(user.permissionLevel);
    } catch (error) {
      console.error('Failed to save export behavior:', error);
    }
  };

  // Read from localStorage (for mock implementation)
  const currentBehavior = user.exportBehavior || 'automatic';

  return (
    <div className={styles.sidebar__analyticsSection}>
      <div className={styles.sidebar__analyticsSectionTitle}>
        <span role="img" aria-label="export">📤</span> {t('settings.title')}
      </div>
      <div className={styles.sidebar__analyticsToggle}>
        <label htmlFor="export-behavior-select" className={styles.sidebar__analyticsLabel}>
          {t('settings.exportBehavior.label')}
        </label>
        <select
          id="export-behavior-select"
          value={currentBehavior}
          onChange={handleExportBehaviorChange}
          className={styles.sidebar__select}
        >
          <option value="automatic">
            {t('settings.exportBehavior.automatic')}
          </option>
          <option value="save-as-dialog">
            {t('settings.exportBehavior.saveAsDialog')}
          </option>
        </select>
        <div className={styles.sidebar__hint}>
          {currentBehavior === 'automatic'
            ? t('settings.exportBehavior.automaticDescription')
            : t('settings.exportBehavior.saveAsDialogDescription')}
        </div>
      </div>
    </div>
  );
};

/**
 * Analytics Panel Component (for Tab 3)
 */
const AnalyticsPanel: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
  const { t } = useTranslation();

  // Try to use analytics context, fallback to local state if not available
  let settings: AnalyticsSettings = {
    trackMouse: true,
    trackKeyboard: true,
    trackDrag: true,
    logToConsole: true,
    trackTiming: true,
    showDebugBarPage: true,
    showDebugBarModal: true,
    logPermissions: true,
    logModalStack: true,
    logIssueWorkflow: true,
    logToasts: true,
    logFetchCalls: true,
    logSSEInvalidation: true,
  };
  let toggleSetting: (key: keyof AnalyticsSettings) => void = () => {};
  let enableAll: () => void = () => {};
  let disableAll: () => void = () => {};

  try {
    const analyticsContext = useAnalyticsContext();
    settings = analyticsContext.settings;
    toggleSetting = analyticsContext.toggleSetting;
    enableAll = analyticsContext.enableAll;
    disableAll = analyticsContext.disableAll;
  } catch {
    // AnalyticsContext not available, use defaults
  }

  // Section 1: Analytics (tracking features)
  const analyticsItems: Array<{ key: keyof AnalyticsSettings; icon: string; labelKey: string; hintKey: string }> = [
    { key: 'trackMouse', icon: '<span role="img" aria-label="mouse">🖱️</span>', labelKey: 'components.sidebar.analytics.trackMouse', hintKey: 'components.sidebar.analytics.trackMouseHint' },
    { key: 'trackKeyboard', icon: '<span role="img" aria-label="keyboard">⌨️</span>', labelKey: 'components.sidebar.analytics.trackKeyboard', hintKey: 'components.sidebar.analytics.trackKeyboardHint' },
    { key: 'trackDrag', icon: '<span role="img" aria-label="drag">✋</span>', labelKey: 'components.sidebar.analytics.trackDrag', hintKey: 'components.sidebar.analytics.trackDragHint' },
    { key: 'trackTiming', icon: '<span role="img" aria-label="timing">⏱️</span>', labelKey: 'components.sidebar.analytics.trackTiming', hintKey: 'components.sidebar.analytics.trackTimingHint' },
  ];

  // Section 2: Debug (logging & visual debug)
  const debugItems: Array<{ key: keyof AnalyticsSettings; icon: string; labelKey: string; hintKey: string }> = [
    { key: 'logToConsole', icon: '<span role="img" aria-label="console">📝</span>', labelKey: 'components.sidebar.analytics.logToConsole', hintKey: 'components.sidebar.analytics.logToConsoleHint' },
    { key: 'showDebugBarPage', icon: '<span role="img" aria-label="debug-bar">📊</span>', labelKey: 'components.sidebar.analytics.showDebugBarPage', hintKey: 'components.sidebar.analytics.showDebugBarPageHint' },
    { key: 'showDebugBarModal', icon: '<span role="img" aria-label="modal-debug">🗂️</span>', labelKey: 'components.sidebar.analytics.showDebugBarModal', hintKey: 'components.sidebar.analytics.showDebugBarModalHint' },
    { key: 'logPermissions', icon: '<span role="img" aria-label="permissions">🔐</span>', labelKey: 'components.sidebar.analytics.logPermissions', hintKey: 'components.sidebar.analytics.logPermissionsHint' },
    { key: 'logModalStack', icon: '<span role="img" aria-label="modal-stack">📚</span>', labelKey: 'components.sidebar.analytics.logModalStack', hintKey: 'components.sidebar.analytics.logModalStackHint' },
    { key: 'logIssueWorkflow', icon: '<span role="img" aria-label="workflow">🎫</span>', labelKey: 'components.sidebar.analytics.logIssueWorkflow', hintKey: 'components.sidebar.analytics.logIssueWorkflowHint' },
    { key: 'logToasts', icon: '<span role="img" aria-label="toasts">🍞</span>', labelKey: 'components.sidebar.analytics.logToasts', hintKey: 'components.sidebar.analytics.logToastsHint' },
    { key: 'logFetchCalls', icon: '<span role="img" aria-label="fetch">📡</span>', labelKey: 'components.sidebar.analytics.logFetchCalls', hintKey: 'components.sidebar.analytics.logFetchCallsHint' },
    { key: 'logSSEInvalidation', icon: '<span role="img" aria-label="sse">🔄</span>', labelKey: 'components.sidebar.analytics.logSSEInvalidation', hintKey: 'components.sidebar.analytics.logSSEInvalidationHint' },
  ];

  if (isCollapsed) return null;

  // Helper function to render toggle items
  const renderToggleItem = (item: { key: keyof AnalyticsSettings; icon: string; labelKey: string; hintKey: string }) => (
    <div
      key={item.key}
      className={styles.sidebar__analyticsToggle}
    >
      <div
        className={styles.sidebar__analyticsToggleClickable}
        onClick={() => toggleSetting(item.key)}
        role="checkbox"
        aria-checked={settings[item.key]}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleSetting(item.key);
          }
        }}
      >
        <div className={`${styles.sidebar__analyticsCheckbox} ${settings[item.key] ? styles['sidebar__analyticsCheckbox--checked'] : ''}`}>
          {settings[item.key] && <span className={styles.sidebar__analyticsCheckmark}>✓</span>}
        </div>
        <span className={styles.sidebar__analyticsLabel}>
          <span dangerouslySetInnerHTML={{ __html: item.icon }} /> {t(item.labelKey)}
        </span>
      </div>
      <InfoHint
        content={t(item.hintKey)}
        position="right"
        size="small"
        maxWidth={200}
      />
    </div>
  );

  return (
    <div className={styles.sidebar__analyticsPanel}>
      {/* Section 1: Analytics */}
      <div className={styles.sidebar__analyticsSection}>
        <div className={styles.sidebar__analyticsSectionTitle}>
          <span role="img" aria-label="analytics">📈</span> {t('components.sidebar.analytics.sectionAnalytics')}
        </div>
        {analyticsItems.map(renderToggleItem)}
      </div>

      {/* Separator */}
      <div className={styles.sidebar__analyticsDivider} />

      {/* Section 2: Debug */}
      <div className={styles.sidebar__analyticsSection}>
        <div className={styles.sidebar__analyticsSectionTitle}>
          <span role="img" aria-label="debug">🐛</span> {t('components.sidebar.analytics.sectionDebug')}
        </div>
        {debugItems.map(renderToggleItem)}
      </div>

      <div className={styles.sidebar__analyticsActions}>
        <button
          type="button"
          className={`${styles.sidebar__analyticsActionBtn} ${styles['sidebar__analyticsActionBtn--enable']}`}
          onClick={enableAll}
        >
          ✓ {t('components.sidebar.analytics.enableAll')}
        </button>
        <button
          type="button"
          className={`${styles.sidebar__analyticsActionBtn} ${styles['sidebar__analyticsActionBtn--disable']}`}
          onClick={disableAll}
        >
          ✗ {t('components.sidebar.analytics.disableAll')}
        </button>
      </div>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  activePath,
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  onCollapseChange,
  className,
  showLogo = true,
  logoIcon = logoImage,
  showUploadBox = false,
  showThemeToggle = false,
  showLanguageToggle = false,
  bottomContent,
  showFloatingAction = false,
  onFloatingAction,
  resizable = true,
  defaultWidth = 240,
  minWidth = 120,
  maxWidth = 400,
}) => {
  const { t, language, setLanguage } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  // Active tab state (load from localStorage)
  const [activeTab, setActiveTab] = useState<SidebarTab>(() => {
    try {
      const saved = localStorage.getItem('sidebar-active-tab');
      if (saved && ['navigation', 'settings', 'analytics'].includes(saved)) {
        return saved as SidebarTab;
      }
    } catch {
      // Ignore localStorage errors
    }
    return 'navigation';
  });

  // Save active tab to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('sidebar-active-tab', activeTab);
    } catch {
      // Ignore localStorage errors
    }
  }, [activeTab]);

  // Internal collapsed state (if not controlled) - load from localStorage
  const [internalCollapsed, setInternalCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem('sidebar-collapsed');
      return saved !== null ? JSON.parse(saved) : defaultCollapsed;
    } catch (error) {
      console.error('Failed to load sidebar collapsed state:', error);
      return defaultCollapsed;
    }
  });

  // Sidebar width state (for resizing) - load from localStorage
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    try {
      const saved = localStorage.getItem('sidebar-width');
      return saved !== null ? parseInt(saved, 10) : defaultWidth;
    } catch (error) {
      console.error('Failed to load sidebar width:', error);
      return defaultWidth;
    }
  });
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = React.useRef<{ startX: number; startWidth: number } | null>(null);

  // Use controlled state if provided, otherwise use internal state
  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  // Toggle collapse handler
  const handleToggle = useCallback(() => {
    const newCollapsed = !isCollapsed;

    if (controlledCollapsed === undefined) {
      setInternalCollapsed(newCollapsed);
    }

    onCollapseChange?.(newCollapsed);
  }, [isCollapsed, controlledCollapsed, onCollapseChange]);

  // Handle nav item click
  const handleItemClick = useCallback((item: SidebarNavItem) => {
    item.onClick?.();
  }, []);

  // Expand all items with children (recursively finds all expandable items)
  const handleExpandAll = useCallback(() => {
    try {
      const allPaths: string[] = [];

      const traverse = (items: SidebarNavItem[]) => {
        items.forEach(item => {
          if (item.children && item.children.length > 0) {
            allPaths.push(item.path);
            traverse(item.children); // Recursively traverse children
          }
        });
      };

      traverse(items);
      localStorage.setItem('sidebar-expanded-items', JSON.stringify(allPaths));
      // Force re-render by updating a dummy state
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Failed to expand all items:', error);
    }
  }, [items]);

  // Collapse all items
  const handleCollapseAll = useCallback(() => {
    try {
      localStorage.setItem('sidebar-expanded-items', JSON.stringify([]));
      // Force re-render by updating a dummy state
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Failed to collapse all items:', error);
    }
  }, []);

  // Resize handlers (for drag handle)
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    if (!resizable || isCollapsed) return;
    e.preventDefault();

    // Store initial position and width
    resizeStartRef.current = {
      startX: e.clientX,
      startWidth: sidebarWidth,
    };

    setIsResizing(true);
  }, [resizable, isCollapsed, sidebarWidth]);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !resizeStartRef.current) return;

    // Calculate delta from start position
    const delta = e.clientX - resizeStartRef.current.startX;
    const newWidth = resizeStartRef.current.startWidth + delta;

    // Clamp width between min and max
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    setSidebarWidth(clampedWidth);
  }, [isResizing, minWidth, maxWidth]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Save sidebar width to localStorage when it changes
  React.useEffect(() => {
    try {
      localStorage.setItem('sidebar-width', sidebarWidth.toString());
    } catch (error) {
      console.error('Failed to save sidebar width:', error);
    }
  }, [sidebarWidth]);

  // Save collapsed state to localStorage when it changes
  React.useEffect(() => {
    try {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(internalCollapsed));
    } catch (error) {
      console.error('Failed to save sidebar collapsed state:', error);
    }
  }, [internalCollapsed]);

  // Global mouse event listeners for resizing
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);

      // Prevent text selection during resize
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'ew-resize';

      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  return (
    <aside
      className={`${styles.sidebar} ${isCollapsed ? styles['sidebar--collapsed'] : ''} ${isResizing ? styles['sidebar--resizing'] : ''} ${className || ''}`}
      data-component="sidebar"
      data-collapsed={isCollapsed}
      style={{
        width: isCollapsed ? '24px' : `${sidebarWidth}px`,
      }}
    >
      {/* Logo */}
      {showLogo && (
        <div className={styles.sidebar__logo}>
          {typeof logoIcon === 'string' ? (
            <img src={logoIcon} alt="Logo" className={styles.sidebar__logoImage} />
          ) : (
            logoIcon
          )}
        </div>
      )}

      {/* Toggle button (top-right corner) */}
      <button
        className={styles.sidebar__toggle}
        onClick={handleToggle}
        type="button"
        aria-label={t(isCollapsed ? 'components.sidebar.expand' : 'components.sidebar.collapse')}
        title={t(isCollapsed ? 'components.sidebar.expand' : 'components.sidebar.collapse')}
      >
        <span className={styles.sidebar__toggleIcon}>
          {isCollapsed ? '▶' : '◀'}
        </span>
      </button>

      {/* Tab Navigation (hidden when collapsed) */}
      <div className={styles.sidebar__tabs}>
        <button
          type="button"
          className={`${styles.sidebar__tabButton} ${activeTab === 'navigation' ? styles['sidebar__tabButton--active'] : ''}`}
          onClick={() => setActiveTab('navigation')}
          title={t('components.sidebar.tabs.navigation')}
        >
          <span className={styles.sidebar__tabIcon} role="img" aria-label="navigation">📁</span>
          {!isCollapsed && t('components.sidebar.tabs.nav')}
        </button>
        <button
          type="button"
          className={`${styles.sidebar__tabButton} ${activeTab === 'settings' ? styles['sidebar__tabButton--active'] : ''}`}
          onClick={() => setActiveTab('settings')}
          title={t('components.sidebar.tabs.settings')}
        >
          <span className={styles.sidebar__tabIcon} role="img" aria-label="user settings">👤</span>
          {!isCollapsed && t('components.sidebar.tabs.user')}
        </button>
        <button
          type="button"
          className={`${styles.sidebar__tabButton} ${activeTab === 'analytics' ? styles['sidebar__tabButton--active'] : ''}`}
          onClick={() => setActiveTab('analytics')}
          title={t('components.sidebar.tabs.debug')}
        >
          <span className={styles.sidebar__tabIcon} role="img" aria-label="debug">🐛</span>
          {!isCollapsed && t('components.sidebar.tabs.dbg')}
        </button>
      </div>

      {/* Tab 1: Navigation */}
      <div className={`${styles.sidebar__tabContent} ${activeTab === 'navigation' ? styles['sidebar__tabContent--active'] : ''}`}>
        <nav className={styles.sidebar__nav} aria-label={t('components.sidebar.navigation')}>
          {/* Expand/Collapse All buttons (visible only when expanded) */}
          {!isCollapsed && (
            <div className={styles.sidebar__expandCollapseButtons}>
              <button
                className={styles.sidebar__expandAllButton}
                onClick={handleExpandAll}
                type="button"
                title={t('components.sidebar.expandAll')}
              >
                <span className={styles.sidebar__icon}>▼</span>
                <span>{t('components.sidebar.expandAll')}</span>
              </button>
              <button
                className={styles.sidebar__collapseAllButton}
                onClick={handleCollapseAll}
                type="button"
                title={t('components.sidebar.collapseAll')}
              >
                <span className={styles.sidebar__icon}>▲</span>
                <span>{t('components.sidebar.collapseAll')}</span>
              </button>
            </div>
          )}

          <ul className={styles.sidebar__navList}>
            {items.map((item) => (
              <NavItem
                key={item.path}
                item={item}
                activePath={activePath}
                isCollapsed={isCollapsed}
                onItemClick={handleItemClick}
              />
            ))}
          </ul>
        </nav>
      </div>

      {/* Tab 2: User Settings (AuthRoleSwitcher + Export Settings) */}
      <div className={`${styles.sidebar__tabContent} ${activeTab === 'settings' ? styles['sidebar__tabContent--active'] : ''}`}>
        <div className={styles.sidebar__analyticsPanel}>
          <AuthRoleSwitcher isCollapsed={isCollapsed} />

          {/* Export Settings Section */}
          {!isCollapsed && (
            <>
              <div className={styles.sidebar__analyticsDivider} />
              <UserExportSettings />
            </>
          )}
        </div>
      </div>

      {/* Tab 3: Analytics Panel */}
      <div className={`${styles.sidebar__tabContent} ${activeTab === 'analytics' ? styles['sidebar__tabContent--active'] : ''}`}>
        <AnalyticsPanel isCollapsed={isCollapsed} />
      </div>

      {/* Bottom section */}
      <div className={styles.sidebar__bottom}>
        {/* Upload box */}
        {showUploadBox && !isCollapsed && (
          <div className={styles.sidebar__uploadBox}>
            <div className={styles.sidebar__uploadBoxIcon}>+</div>
            <div className={styles.sidebar__uploadBoxText}>
              <div>{t('components.sidebar.uploadNewImage')}</div>
              <div className={styles.sidebar__uploadBoxSubtext}>
                {t('components.sidebar.dragAndDrop')}
              </div>
            </div>
          </div>
        )}

        {/* Custom bottom content (e.g., auth switcher) */}
        {bottomContent && (
          React.isValidElement(bottomContent) && typeof bottomContent.type === 'function'
            ? React.cloneElement(bottomContent as React.ReactElement<{ isCollapsed?: boolean }>, { isCollapsed })
            : bottomContent
        )}

        {/* Theme & Language toggles (horizontal layout) */}
        {(showThemeToggle || showLanguageToggle) && (
          <div className={styles.sidebar__togglesWrapper}>
            {/* Theme toggle */}
            {showThemeToggle && (
              <button
                className={styles.sidebar__themeToggle}
                onClick={toggleTheme}
                type="button"
                title={t(theme === 'dark' ? 'components.sidebar.switchToLight' : 'components.sidebar.switchToDark')}
              >
                <span className={styles.sidebar__icon} role="img" aria-label={theme === 'dark' ? 'sun' : 'moon'}>
                  {theme === 'dark' ? '☀️' : '🌙'}
                </span>
                {!isCollapsed && (
                  <span>{t(theme === 'dark' ? 'components.sidebar.lightMode' : 'components.sidebar.darkMode')}</span>
                )}
              </button>
            )}

            {/* Language toggle */}
            {showLanguageToggle && (
              <button
                className={styles.sidebar__themeToggle}
                onClick={() => setLanguage(language === 'sk' ? 'en' : 'sk')}
                type="button"
                title={t('components.sidebar.changeLanguage')}
              >
                <span className={styles.sidebar__icon} role="img" aria-label={language === 'sk' ? 'Slovakia' : 'United Kingdom'}>
                  {language === 'sk' ? '🇸🇰' : '🇬🇧'}
                </span>
                {!isCollapsed && (
                  <span>{language === 'sk' ? 'SK' : 'EN'}</span>
                )}
              </button>
            )}
          </div>
        )}

        {/* Floating action button */}
        {showFloatingAction && (
          <button
            className={styles.sidebar__floatingAction}
            onClick={onFloatingAction}
            type="button"
            title={t('components.sidebar.newAction')}
          >
            +
          </button>
        )}
      </div>

      {/* Resize handle (only when expanded and resizable) */}
      {resizable && !isCollapsed && (
        <div
          className={styles.sidebar__resizeHandle}
          onMouseDown={handleResizeStart}
          title={t('components.sidebar.resizeWidth')}
        />
      )}
    </aside>
  );
};