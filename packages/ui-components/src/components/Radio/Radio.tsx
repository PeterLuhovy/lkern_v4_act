/*
 * ================================================================
 * FILE: Radio.tsx
 * PATH: packages/ui-components/src/components/Radio/Radio.tsx
 * DESCRIPTION: Radio button component for single selection within a group
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
 * ================================================================
 */

import React, { forwardRef } from 'react';
import styles from './Radio.module.css';

/**
 * Radio component props interface
 */
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * Label text displayed next to the radio button
   */
  label: string;

  /**
   * Error state (typically controlled by RadioGroup)
   */
  error?: boolean;
}

/**
 * Radio Button Component
 *
 * A customizable radio input with label and accessibility features.
 * Typically used within a RadioGroup component for managing selection state.
 *
 * @example
 * ```tsx
 * // Basic radio button
 * <Radio name="option" value="1" label="Option 1" />
 *
 * // Radio button with checked state
 * <Radio name="option" value="2" label="Option 2" checked />
 *
 * // Radio button disabled
 * <Radio name="option" value="3" label="Option 3" disabled />
 * ```
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error = false, className, disabled, ...props }, ref) => {
    return (
      <label
        className={`${styles.radioLabel} ${error ? styles.error : ''} ${disabled ? styles.disabled : ''} ${className || ''}`}
      >
        <input
          ref={ref}
          type="radio"
          className={styles.radioInput}
          disabled={disabled}
          {...props}
        />
        <span className={styles.radioCustom} />
        <span className={styles.labelText}>{label}</span>
      </label>
    );
  }
);

Radio.displayName = 'Radio';
