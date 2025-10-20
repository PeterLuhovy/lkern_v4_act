/*
 * ================================================================
 * FILE: FormField.tsx
 * PATH: /packages/ui-components/src/components/FormField/FormField.tsx
 * DESCRIPTION: Form field with built-in real-time validation
 * VERSION: v3.0.0
 * UPDATED: 2025-10-19 20:00:00
 *
 * CHANGES (v3.0.0):
 *   - ADDED: validate prop - Real-time validation function
 *   - ADDED: onValidChange callback - Notifies parent of validation state
 *   - ADDED: Internal state management for value, error, touched
 *   - ENHANCED: Automatic error clearing on valid input
 *   - ENHANCED: Clones child Input and injects value/onChange/hasError
 * ================================================================
 */

import React, { useState, useEffect, cloneElement, isValidElement } from 'react';
import { classNames } from '../../utils/classNames';
import styles from './FormField.module.css';

/**
 * Validation function type
 * Returns error message string if invalid, undefined if valid
 */
export type ValidationFunction = (value: string) => string | undefined;

/**
 * FormField component props interface
 */
export interface FormFieldProps {
  /**
   * Label text to display above input
   * Optional - omit for inputs without labels
   */
  label?: string;

  /**
   * Show required asterisk (*) next to label
   * @default false
   */
  required?: boolean;

  /**
   * External error message (overrides internal validation)
   * Use this for server-side validation errors
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
   * Reserve space for validation messages (prevents layout shift)
   * @default false
   */
  reserveMessageSpace?: boolean;

  /**
   * Custom className for wrapper
   */
  className?: string;

  /**
   * Validation function - called on every change
   * Returns error message if invalid, undefined if valid
   * @example (value) => !value ? 'Required field' : undefined
   */
  validate?: ValidationFunction;

  /**
   * Callback when validation state changes
   * Called with true when field becomes valid, false when invalid
   * @param isValid - Current validation state
   */
  onValidChange?: (isValid: boolean) => void;

  /**
   * Initial value for the input field
   * @default ''
   */
  initialValue?: string;

  /**
   * Tooltip text for input (HTML title attribute)
   * Displayed on hover
   */
  inputTitle?: string;

  /**
   * Success message to show when field is valid
   * Only shown when validate function is provided and field is valid
   */
  successMessage?: string;

  /**
   * Input element (Input, Select, Textarea, etc.)
   * FormField will inject value, onChange, and hasError props
   */
  children: React.ReactElement;
}

/**
 * FormField Component (v3.0.0)
 *
 * Enhanced form field with built-in real-time validation.
 * Automatically manages input value, validation errors, and touched state.
 *
 * **New in v3.0.0:**
 * - Built-in validation with `validate` prop
 * - Real-time error messages as you type
 * - `onValidChange` callback for form-level validation
 * - Automatic Input prop injection (value, onChange, hasError)
 *
 * @example With validation
 * ```tsx
 * <FormField
 *   label="Email"
 *   required
 *   validate={(value) => {
 *     if (!value) return t('forms.errors.required');
 *     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
 *       return t('forms.errors.invalidEmail');
 *     }
 *     return undefined;
 *   }}
 *   onValidChange={(isValid) => setEmailValid(isValid)}
 *   reserveMessageSpace
 * >
 *   <Input type="email" placeholder="user@example.com" />
 * </FormField>
 * ```
 *
 * @example Simple usage
 * ```tsx
 * <FormField
 *   label="Name"
 *   required
 *   validate={(value) => !value ? 'Required' : undefined}
 *   reserveMessageSpace
 * >
 *   <Input />
 * </FormField>
 * ```
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error: externalError,
  helperText,
  htmlFor,
  fullWidth = false,
  reserveMessageSpace = false,
  className,
  validate,
  onValidChange,
  initialValue = '',
  inputTitle,
  successMessage,
  children,
}) => {
  // Internal state
  const [value, setValue] = useState<string>(initialValue);
  const [internalError, setInternalError] = useState<string | undefined>(undefined);
  const [touched, setTouched] = useState(false);

  // Determine which error to show (external overrides internal)
  // If field is required, show error even if not touched (show validation from start)
  const displayError = externalError || (required || touched ? internalError : undefined);

  // Validation effect - run validation when value changes
  useEffect(() => {
    if (validate) {
      const error = validate(value);
      setInternalError(error);

      // Notify parent of validation state change
      if (onValidChange) {
        const isValid = !error;
        onValidChange(isValid);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, validate]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setTouched(true);
  };

  // Clone child Input and inject props
  const enhancedChild = isValidElement(children)
    ? cloneElement(children as React.ReactElement<any>, {
        value,
        onChange: handleChange,
        hasError: !!displayError,
        isValid: validate && !internalError && value.length > 0 && touched,
        fullWidth,
        title: inputTitle,
      } as any)
    : children;

  const wrapperClassName = classNames(
    styles.formField,
    fullWidth && styles['formField--fullWidth'],
    className
  );

  const messageAreaClassName = classNames(
    styles.messageArea,
    reserveMessageSpace && styles['messageArea--reserved']
  );

  // Determine what message to show
  const isFieldValid = validate && !internalError && value.length > 0 && touched;
  const successMsg = isFieldValid ? successMessage : undefined;

  const hasMessage = !!(displayError || successMsg || helperText);
  const messageContent = displayError || successMsg || helperText;
  const messageRole = displayError ? 'alert' : undefined;
  const messageClass = displayError ? styles.errorText : (successMsg ? styles.successText : styles.helperText);

  return (
    <div className={wrapperClassName}>
      {/* Label - optional */}
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      {/* Input wrapper */}
      <div className={styles.inputWrapper}>
        {enhancedChild}
      </div>

      {/* Message area - always rendered when reserveMessageSpace=true */}
      <div className={messageAreaClassName}>
        {hasMessage && (
          <span className={messageClass} role={messageRole}>
            {displayError && <span className={styles.errorIcon} aria-hidden="true">⚠</span>}
            {successMsg && <span className={styles.successIcon} aria-hidden="true">✓</span>}
            {messageContent}
          </span>
        )}
      </div>
    </div>
  );
};

export default FormField;