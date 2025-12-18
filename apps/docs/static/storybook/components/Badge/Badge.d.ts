import { default as React } from '../../../../../node_modules/react';
export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';
export type BadgeSize = 'small' | 'medium' | 'large';
export interface BadgeProps {
    /**
     * Visual style variant
     * @default 'neutral'
     */
    variant?: BadgeVariant;
    /**
     * Size of the badge
     * @default 'medium'
     */
    size?: BadgeSize;
    /**
     * Show colored dot indicator
     * @default false
     */
    dot?: boolean;
    /**
     * Badge content (text or React elements)
     */
    children: React.ReactNode;
    /**
     * Additional CSS class names
     */
    className?: string;
}
export declare const Badge: React.ForwardRefExoticComponent<BadgeProps & React.RefAttributes<HTMLSpanElement>>;
export default Badge;
