import { default as React } from '../../../../../node_modules/react';
export type CardVariant = 'default' | 'outlined' | 'elevated' | 'accent';
export interface CardProps {
    /**
     * Visual variant of the card
     * @default 'default'
     */
    variant?: CardVariant;
    /**
     * Card content
     */
    children: React.ReactNode;
    /**
     * Optional click handler (makes card interactive)
     */
    onClick?: () => void;
    /**
     * Disable hover effects (for non-interactive cards)
     * @default false
     */
    disableHover?: boolean;
    /**
     * Additional CSS class names
     */
    className?: string;
}
export declare const Card: React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>>;
export default Card;
