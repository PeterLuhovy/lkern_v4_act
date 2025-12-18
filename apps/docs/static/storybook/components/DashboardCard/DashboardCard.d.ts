import { default as React } from '../../../../../node_modules/react';
export interface DashboardCardProps {
    /**
     * Navigation path (React Router link)
     */
    path: string;
    /**
     * Icon emoji or element
     */
    icon: React.ReactNode;
    /**
     * Card title
     */
    title: string;
    /**
     * Card description
     */
    description: string;
    /**
     * Optional custom className
     */
    className?: string;
}
/**
 * DashboardCard Component
 *
 * Reusable card component for dashboard navigation.
 * Wraps Card component with Link for routing.
 *
 * @example
 * ```tsx
 * <DashboardCard
 *   path="/testing/forms"
 *   icon="📝"
 *   title="Form Components"
 *   description="Test form inputs and validation"
 * />
 * ```
 */
export declare const DashboardCard: React.FC<DashboardCardProps>;
export default DashboardCard;
