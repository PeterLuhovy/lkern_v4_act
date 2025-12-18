import { default as React } from '../../../../../node_modules/react';
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
export declare const Sidebar: React.FC<SidebarProps>;
