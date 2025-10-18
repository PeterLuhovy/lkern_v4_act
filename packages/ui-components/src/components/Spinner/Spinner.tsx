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
   * Additional CSS class names
   */
  className?: string;
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = 'medium', label, className }, ref) => {
    const classes = [styles.spinner, styles[`spinner--${size}`], className]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classes}>
        <div className={styles.spinner__ring} />
        {label && <div className={styles.spinner__label}>{label}</div>}
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

export default Spinner;
