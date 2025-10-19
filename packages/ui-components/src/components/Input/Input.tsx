/**
 * @file Input.tsx
 * @package @l-kern/ui-components
 * @description Text input component with error handling and helper text
 * @version 1.1.0
 * @date 2025-10-19
 */

import React from 'react';
import { classNames } from '../../utils/classNames';
import styles from './Input.module.css';

/**
 * Input component props interface
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Error message to display below input
   */
  error?: string;

  /**
   * Helper text to display below input (when no error)
   */
  helperText?: string;

  /**
   * Make input full width of container
   * @default false
   */
  fullWidth?: boolean;
}

/**
 * Input Component
 *
 * Text input with error state, helper text, and design token integration.
 * Supports all standard HTML input attributes (type, placeholder, disabled, etc.)
 *
 * @example
 * ```tsx
 * <Input
 *   type="email"
 *   placeholder="Enter email"
 *   error="Invalid email format"
 * />
 *
 * <Input
 *   type="password"
 *   helperText="Minimum 8 characters"
 *   fullWidth
 * />
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, helperText, fullWidth = false, className, ...props }, ref) => {
    const inputClassName = classNames(
      styles.input,
      error && styles['input--error'],
      fullWidth && styles['input--fullWidth'],
      className
    );

    return (
      <div className={classNames(styles.wrapper, fullWidth && styles['wrapper--fullWidth'])}>
        <input
          ref={ref}
          {...props}
          className={inputClassName}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
        />
        {error && (
          <span id={`${props.id}-error`} className={styles.errorText}>
            <span className={styles.errorIcon} aria-hidden="true">⚠</span>
            {error}
          </span>
        )}
        {!error && helperText && (
          <span id={`${props.id}-helper`} className={styles.helperText}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
