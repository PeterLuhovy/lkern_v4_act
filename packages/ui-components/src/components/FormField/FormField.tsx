/**
 * @file FormField.tsx
 * @package @l-kern/ui-components
 * @description Form field wrapper combining label, input, and error/helper text
 * @version 1.0.0
 * @date 2025-10-18
 */

import React from 'react';
import { classNames } from '../../utils/classNames';
import styles from './FormField.module.css';

/**
 * FormField component props interface
 */
export interface FormFieldProps {
  /**
   * Label text to display above input
   */
  label: string;

  /**
   * Show required asterisk (*) next to label
   * @default false
   */
  required?: boolean;

  /**
   * Error message to display below input
   */
  error?: string;

  /**
   * Helper text to display below input (when no error)
   */
  helperText?: string;

  /**
   * HTML for attribute linking label to input
   */
  htmlFor?: string;

  /**
   * Make field full width of container
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Custom className for wrapper
   */
  className?: string;

  /**
   * Input element (Input, Select, Textarea, etc.)
   */
  children: React.ReactNode;
}

/**
 * FormField Component
 *
 * Wrapper component that combines label, input field, and error/helper text
 * into a consistent, accessible form field structure.
 *
 * @example
 * ```tsx
 * <FormField label="Email" required error={errors.email} htmlFor="email">
 *   <Input id="email" type="email" placeholder="Enter email" />
 * </FormField>
 *
 * <FormField label="Password" helperText="Min 8 characters" htmlFor="password">
 *   <Input id="password" type="password" />
 * </FormField>
 * ```
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  helperText,
  htmlFor,
  fullWidth = false,
  className,
  children,
}) => {
  const wrapperClassName = classNames(
    styles.formField,
    fullWidth && styles['formField--fullWidth'],
    className
  );

  return (
    <div className={wrapperClassName}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>

      <div className={styles.inputWrapper}>
        {children}
      </div>

      {error && (
        <span className={styles.errorText} role="alert">
          {error}
        </span>
      )}

      {!error && helperText && (
        <span className={styles.helperText}>
          {helperText}
        </span>
      )}
    </div>
  );
};

export default FormField;
