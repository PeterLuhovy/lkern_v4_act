import { default as React } from '../../../../../node_modules/react';
export type EmptyStateSize = 'small' | 'medium' | 'large';
export interface EmptyStateProps {
    /**
     * Icon or emoji to display (e.g., 📭, 🔍, 🛒)
     */
    icon?: React.ReactNode;
    /**
     * Main heading text
     */
    title: string;
    /**
     * Optional description text
     */
    description?: string;
    /**
     * Optional action button or element
     */
    action?: React.ReactNode;
    /**
     * Size variant
     * @default 'medium'
     */
    size?: EmptyStateSize;
    /**
     * Additional CSS class names
     */
    className?: string;
}
export declare const EmptyState: React.FC<EmptyStateProps>;
export default EmptyState;
