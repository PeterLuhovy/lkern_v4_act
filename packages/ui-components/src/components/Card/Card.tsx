/*
 * ================================================================
 * FILE: Card.tsx
 * PATH: /packages/ui-components/src/components/Card/Card.tsx
 * DESCRIPTION: Card container component for content grouping
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
 * ================================================================
 */

import React from 'react';
import styles from './Card.module.css';

export type CardVariant = 'default' | 'outlined' | 'elevated';

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

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', children, onClick, disableHover = false, className }, ref) => {
    const classes = [
      styles.card,
      styles[`card--${variant}`],
      onClick && styles['card--clickable'],
      disableHover && styles['card--no-hover'],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        className={classes}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
