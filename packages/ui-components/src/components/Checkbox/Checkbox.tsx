/*
 * ================================================================
 * FILE: Checkbox.tsx
 * PATH: packages/ui-components/src/components/Checkbox/Checkbox.tsx
 * DESCRIPTION: Checkbox component with error states and accessibility
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
 * ================================================================
 */

import React, { forwardRef } from 'react';
import styles from './Checkbox.module.css';

/**
 * Checkbox component props interface
 */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * Label text displayed next to the checkbox
   */
  label?: string;

  /**
   * Error message to display (shows error state)
   */
  error?: string;

  /**
   * Helper text to display below the checkbox
   */
  helperText?: string;

  /**
   * Indeterminate state (for "some but not all" selections)
   */
  indeterminate?: boolean;
}

/**
 * Checkbox Component
 *
 * A customizable checkbox input with label, error states, and accessibility features.
 * Supports indeterminate state for partial selections (e.g., "select all" with some items selected).
 *
 * @example
 * ```tsx
 * // Basic checkbox
 * <Checkbox label="I agree to the terms" />
 *
 * // Checkbox with error
 * <Checkbox label="Required field" error="You must accept the terms" />
 *
 * // Indeterminate state (partial selection)
 * <Checkbox label="Select all" indeterminate={true} />
 * ```
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, helperText, indeterminate = false, className, disabled, ...props }, ref) => {
    const hasError = Boolean(error);
    const hasHelperText = Boolean(helperText);
    const descriptionId = hasError || hasHelperText ? `${props.id}-description` : undefined;

    // Handle indeterminate state via ref callback
    const indeterminateRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        if (node) {
          node.indeterminate = indeterminate;
        }

        // Forward ref to parent
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [indeterminate, ref]
    );

    return (
      <div
        className={`${styles.checkboxWrapper} ${className || ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <label
          className={`${styles.checkboxLabel} ${hasError ? styles.error : ''} ${disabled ? styles.disabled : ''}`}
        >
          <input
            ref={indeterminateRef}
            type="checkbox"
            className={styles.checkboxInput}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={descriptionId}
            {...props}
          />
          <span className={styles.checkboxCustom} />
          {label && <span className={styles.labelText}>{label}</span>}
        </label>

        {(hasError || hasHelperText) && (
          <div
            id={descriptionId}
            className={hasError ? styles.errorText : styles.helperText}
          >
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
