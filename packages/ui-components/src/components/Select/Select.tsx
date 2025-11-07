/**
 * @file Select.tsx
 * @package @l-kern/ui-components
 * @description Select dropdown component with error handling and helper text
 * @version 1.0.0
 * @date 2025-10-18
 */

import React from 'react';
import { classNames } from '../../utils/classNames';
import styles from './Select.module.css';

/**
 * Option item for Select component
 */
export interface SelectOption {
  /**
   * Internal value (stored in state/form)
   */
  value: string | number;

  /**
   * Display label (shown to user)
   */
  label: string;

  /**
   * Disable this option
   * @default false
   */
  disabled?: boolean;
}

/**
 * Select component props interface
 */
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /**
   * Array of select options
   */
  options: SelectOption[];

  /**
   * Placeholder text (creates empty first option)
   */
  placeholder?: string;

  /**
   * Error message to display below select
   */
  error?: string;

  /**
   * Helper text to display below select (when no error)
   */
  helperText?: string;

  /**
   * Make select full width of container
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Error state (injected by FormField, internal use)
   * @internal
   */
  hasError?: boolean;

  /**
   * Valid state (injected by FormField, internal use)
   * @internal
   */
  isValid?: boolean;
}

/**
 * Select Component
 *
 * Native select dropdown with error state, helper text, and design token integration.
 * Supports all standard HTML select attributes (disabled, required, etc.)
 *
 * @example
 * ```tsx
 * <Select
 *   placeholder="Choose country"
 *   options={[
 *     { value: 'sk', label: 'Slovakia' },
 *     { value: 'cz', label: 'Czech Republic' }
 *   ]}
 *   error="Country is required"
 * />
 *
 * <Select
 *   options={countries}
 *   helperText="Select your country"
 *   fullWidth
 * />
 * ```
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, placeholder, error, helperText, fullWidth = false, className, hasError, isValid, ...props }, ref) => {
    const selectClassName = classNames(
      styles.select,
      error && styles['select--error'],
      fullWidth && styles['select--fullWidth'],
      className
    );

    return (
      <div className={classNames(styles.wrapper, fullWidth && styles['wrapper--fullWidth'])}>
        <select
          ref={ref}
          {...props}
          className={selectClassName}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <span id={`${props.id}-error`} className={styles.errorText}>
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

Select.displayName = 'Select';

export default Select;
