import { default as React } from '../../../../../node_modules/react';
import { Variant, Size } from '../../types/common';
/**
 * Button component props interface
 */
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
    /**
     * Visual style variant
     * @default 'secondary'
     */
    variant?: Variant;
    /**
     * Button size
     * @default 'medium'
     */
    size?: Size;
    /**
     * Icon element to display before or after button text
     */
    icon?: React.ReactNode;
    /**
     * Position of the icon relative to text
     * @default 'left'
     */
    iconPosition?: 'left' | 'right';
    /**
     * Loading state - disables button and shows loading spinner
     * @default false
     */
    loading?: boolean;
    /**
     * Make button full width of container
     * @default false
     */
    fullWidth?: boolean;
    /**
     * Apply debug styling (orange gradient for debug/toolbar buttons)
     * @default false
     */
    debug?: boolean;
    /**
     * Click handler
     */
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    /**
     * Button content (text or elements)
     */
    children: React.ReactNode;
}
/**
 * Button Component
 *
 * Reusable button with multiple variants and sizes. Integrates with @l-kern/config design tokens.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="medium" onClick={() => console.log('Clicked')}>
 *   Save
 * </Button>
 *
 * <Button variant="danger" icon={<TrashIcon />} loading>
 *   Delete
 * </Button>
 * ```
 */
export declare const Button: React.FC<ButtonProps>;
export default Button;
