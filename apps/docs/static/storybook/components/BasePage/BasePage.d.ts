import { default as React } from '../../../../../node_modules/react';
import { SidebarNavItem } from '../Sidebar';
import { ServiceStatus, CurrentUser, DataSource } from '../StatusBar';
import { IssueType, IssueSeverity, IssueCategory, IssuePriority } from '../CreateIssueModal';
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
export declare const BasePage: React.FC<BasePageProps>;
