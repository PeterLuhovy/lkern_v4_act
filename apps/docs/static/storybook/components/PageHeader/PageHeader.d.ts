import { default as React } from '../../../../../node_modules/react';
export interface BreadcrumbItem {
    name: string;
    href?: string;
    to?: string;
    onClick?: () => void;
    isActive?: boolean;
}
export interface PageHeaderProps {
    /** Page title (required) */
    title: string;
    /** Optional subtitle below title */
    subtitle?: string;
    /** Optional breadcrumb navigation */
    breadcrumbs?: BreadcrumbItem[];
    /** Show logo on left side (default: false) */
    showLogo?: boolean;
    /** Custom logo icon or image URL */
    logoIcon?: string | React.ReactNode;
    /** Show L-KERN logo on right side (default: true) */
    showRightLogo?: boolean;
    /** Custom content on right side (e.g., buttons, filters) */
    children?: React.ReactNode;
    /** Additional CSS class */
    className?: string;
}
/**
 * PageHeader component
 *
 * Universal page header with title, subtitle, breadcrumbs, and logo support.
 * Uses gradient design system with purple accent border.
 *
 * @example
 * ```tsx
 * <PageHeader
 *   title="Contacts"
 *   subtitle="Manage your contacts"
 *   showLogo
 *   breadcrumbs={[
 *     { name: 'Home', href: '/' },
 *     { name: 'Contacts', isActive: true }
 *   ]}
 * >
 *   <Button>Add Contact</Button>
 * </PageHeader>
 * ```
 */
export declare const PageHeader: React.FC<PageHeaderProps>;
