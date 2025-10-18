/*
 * ================================================================
 * FILE: Badge.tsx
 * PATH: /packages/ui-components/src/components/Badge/Badge.tsx
 * DESCRIPTION: Badge component for status indicators and labels
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
 * ================================================================
 */

import React from 'react';
import styles from './Badge.module.css';

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

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'neutral', size = 'medium', dot = false, children, className }, ref) => {
    const classes = [
      styles.badge,
      styles[`badge--${variant}`],
      styles[`badge--${size}`],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <span ref={ref} className={classes}>
        {dot && <span className={styles.badge__dot} />}
        <span className={styles.badge__content}>{children}</span>
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
