/**
 * @file Button.tsx
 * @package @l-kern/ui-components
 * @description Customizable button component with variants, sizes, and loading state
 * @version 1.0.0
 * @date 2025-10-18
 */

import React from 'react';
import { classNames } from '../../utils/classNames';
import type { Variant, Size } from '../../types/common';
import styles from './Button.module.css';

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
export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  onClick,
  disabled,
  children,
  className,
  ...props
}) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick && !loading && !disabled) {
      onClick(event);
    }
  };

  const buttonClassName = classNames(
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    fullWidth && styles['button--fullWidth'],
    loading && styles['button--loading'],
    className
  );

  return (
    <button
      {...props}
      className={buttonClassName}
      onClick={handleClick}
      disabled={loading || disabled}
    >
      {loading ? (
        <>
          <span className={styles.loadingSpinner}>⟳</span>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className={styles.icon}>{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className={styles.icon}>{icon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
