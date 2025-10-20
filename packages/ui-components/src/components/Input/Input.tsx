/*
 * ================================================================
 * FILE: Input.tsx
 * PATH: /packages/ui-components/src/components/Input/Input.tsx
 * DESCRIPTION: Simplified input component - styling only, no validation
 * VERSION: v2.0.0
 * UPDATED: 2025-10-19 18:00:00
 *
 * BREAKING CHANGES (v2.0.0):
 *   - REMOVED: error prop (moved to FormField)
 *   - REMOVED: helperText prop (moved to FormField)
 *   - Input is now a pure styled input field
 *   - Use FormField wrapper for validation messages
 * ================================================================
 */

import React from 'react';
import { classNames } from '../../utils/classNames';
import styles from './Input.module.css';

/**
 * Input component props interface
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Make input full width of container
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Apply error styling (red border)
   * Note: Error message should be handled by FormField wrapper
   * @default false
   */
  hasError?: boolean;

  /**
   * Apply success styling (green border) - for valid fields
   * @default false
   */
  isValid?: boolean;
}

/**
 * Input Component (v2.0.0 - Simplified)
 *
 * Styled text input field without validation logic.
 * For form fields with labels and validation, wrap in FormField component.
 *
 * Supports all standard HTML input attributes (type, placeholder, disabled, etc.)
 *
 * @example Basic usage
 * ```tsx
 * <Input type="email" placeholder="Enter email" />
 * ```
 *
 * @example With validation (use FormField)
 * ```tsx
 * <FormField label="Email" error={errors.email} reserveMessageSpace>
 *   <Input type="email" id="email" hasError={!!errors.email} />
 * </FormField>
 * ```
 *
 * @example Standalone with error styling
 * ```tsx
 * <Input type="search" placeholder="Search..." hasError={hasError} />
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ fullWidth = false, hasError = false, isValid = false, className, ...props }, ref) => {
    const inputClassName = classNames(
      styles.input,
      hasError && styles['input--error'],
      isValid && !hasError && styles['input--valid'],
      fullWidth && styles['input--fullWidth'],
      className
    );

    return (
      <input
        ref={ref}
        {...props}
        className={inputClassName}
        aria-invalid={hasError ? 'true' : 'false'}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
