/*
 * ================================================================
 * FILE: Spinner.tsx
 * PATH: /packages/ui-components/src/components/Spinner/Spinner.tsx
 * DESCRIPTION: Spinner/Loader component for loading states
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
 * ================================================================
 */

import React from 'react';
import styles from './Spinner.module.css';

export type SpinnerSize = 'small' | 'medium' | 'large';

export interface SpinnerProps {
  /**
   * Size of the spinner
   * @default 'medium'
   */
  size?: SpinnerSize;

  /**
   * Optional label text below spinner
   */
  label?: string;

  /**
   * Custom color for the spinner (CSS color value)
   * @example '#ff0000', 'rgb(255, 0, 0)', 'var(--my-color)'
   */
  color?: string;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Test ID for testing purposes
   */
  'data-testid'?: string;
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = 'medium', label, color, className, 'data-testid': dataTestId }, ref) => {
    const classes = [styles.spinner, styles[`spinner--${size}`], className]
      .filter(Boolean)
      .join(' ');

    // Apply custom color via inline style (overrides CSS variable)
    const ringStyle = color
      ? {
          borderTopColor: color,
          borderRightColor: color,
        }
      : undefined;

    return (
      <div ref={ref} className={classes} data-testid={dataTestId}>
        <div className={styles.spinner__ring} style={ringStyle} />
        {label && <div className={styles.spinner__label}>{label}</div>}
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

export default Spinner;
