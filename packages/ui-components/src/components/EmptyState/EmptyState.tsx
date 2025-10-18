/*
 * ================================================================
 * FILE: EmptyState.tsx
 * PATH: /packages/ui-components/src/components/EmptyState/EmptyState.tsx
 * DESCRIPTION: Empty state component for displaying empty/no-data states
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
 * ================================================================
 */

import React from 'react';
import styles from './EmptyState.module.css';

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

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  size = 'medium',
  className,
}) => {
  const classes = [
    styles.emptyState,
    styles[`emptyState--${size}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      {icon && (
        <div className={styles.emptyState__icon}>
          {icon}
        </div>
      )}

      <h2 className={styles.emptyState__title}>
        {title}
      </h2>

      {description && (
        <p className={styles.emptyState__description}>
          {description}
        </p>
      )}

      {action && (
        <div className={styles.emptyState__action}>
          {action}
        </div>
      )}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';

export default EmptyState;
