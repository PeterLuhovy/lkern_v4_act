/*
 * ================================================================
 * FILE: FormField.tsx
 * PATH: /packages/ui-components/src/components/FormField/FormField.tsx
 * DESCRIPTION: Form field with built-in real-time validation
 * VERSION: v3.4.0
 * UPDATED: 2025-11-29
 *
 * CHANGES (v3.4.0):
 *   - ENHANCED: onChange now supports both Input and Textarea components
 *   - UPDATED: handleChange accepts HTMLInputElement | HTMLTextAreaElement events
 *
 * CHANGES (v3.3.0):
 *   - ADDED: labelHint prop - Shows InfoHint icon after label
 *   - ADDED: labelHintMaxWidth prop - Configures popup width
 *   - FIXED: Validation messages now re-translate on language change
 *
 * CHANGES (v3.2.0):
 *   - ADDED: maxLength prop - Shows character counter (e.g., "45/200")
 *   - ENHANCED: Char count displayed inline with error/helper text (left-right layout)
 *
 * CHANGES (v3.1.0):
 *   - ADDED: Controlled mode support (value + onChange props)
 *   - ENHANCED: Now supports both controlled and uncontrolled modes
 *   - FIXED: Parent components can now manage FormField value externally
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
import { useTranslation } from '@l-kern/config';
import { classNames } from '../../utils/classNames';
import { InfoHint } from '../InfoHint';
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
   * Initial value for the input field (uncontrolled mode)
   * @default ''
   */
  initialValue?: string;

  /**
   * Controlled value from parent (controlled mode)
   * If provided, FormField operates in controlled mode and won't manage internal state
   */
  value?: string;

  /**
   * Controlled onChange handler from parent (controlled mode)
   * Called when input/textarea value changes
   * Supports both Input and Textarea components
   */
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

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
   * Maximum character length for the input
   * When provided, displays character counter (e.g., "45/200")
   * Displayed inline with error/helper text (error left, counter right)
   */
  maxLength?: number;

  /**
   * Hint text to display as InfoHint icon after label
   * When provided, shows small info icon that reveals popup on click
   */
  labelHint?: string;

  /**
   * Max width for labelHint popup
   * @default 450
   */
  labelHintMaxWidth?: number;

  /**
   * Input element (Input, Select, Textarea, etc.)
   * FormField will inject value, onChange, and hasError props
   */
  children: React.ReactElement;
}

/**
 * FormField Component (v3.1.0)
 *
 * Enhanced form field with built-in real-time validation.
 * Supports both controlled and uncontrolled modes.
 *
 * **Controlled Mode** (when `value` + `onChange` props provided):
 * - Parent component manages the value state
 * - FormField forwards onChange events to parent
 * - Use when you need external state management (e.g., complex modals)
 *
 * **Uncontrolled Mode** (when `value` + `onChange` NOT provided):
 * - FormField manages its own internal state
 * - Uses `initialValue` prop for default value
 * - Use for simple forms where FormField can manage state independently
 *
 * **New in v3.1.0:**
 * - Added controlled mode support (value + onChange props)
 * - Can now be used in controlled parent components
 *
 * **Features from v3.0.0:**
 * - Built-in validation with `validate` prop
 * - Real-time error messages as you type
 * - `onValidChange` callback for form-level validation
 * - Automatic Input prop injection (value, onChange, hasError)
 *
 * @example Controlled mode (parent manages state)
 * ```tsx
 * const [keyword, setKeyword] = useState('');
 *
 * <FormField
 *   label="Keyword"
 *   error={showError ? 'Wrong keyword' : undefined}
 *   value={keyword}
 *   onChange={(e) => setKeyword(e.target.value)}
 *   reserveMessageSpace
 * >
 *   <Input placeholder="Type keyword" />
 * </FormField>
 * ```
 *
 * @example Uncontrolled mode with validation
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
 * @example Simple uncontrolled usage
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
  value: controlledValue,
  onChange: controlledOnChange,
  inputTitle,
  successMessage,
  maxLength,
  labelHint,
  labelHintMaxWidth = 450,
  children,
}) => {
  // Get current language for re-validation on language change
  const { language } = useTranslation();

  // Determine if component is controlled or uncontrolled
  const isControlled = controlledValue !== undefined;

  // Internal state (only used in uncontrolled mode)
  const [internalValue, setInternalValue] = useState<string>(initialValue);
  const [internalError, setInternalError] = useState<string | undefined>(undefined);
  const [touched, setTouched] = useState(false);

  // Use controlled value if provided, otherwise use internal state
  const value = isControlled ? controlledValue : internalValue;

  // Determine which error to show (external overrides internal)
  // If field is required, show error even if not touched (show validation from start)
  const displayError = externalError || (required || touched ? internalError : undefined);

  // Validation effect - run validation when value or language changes
  // Language dependency ensures error messages re-translate on language switch
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
  }, [value, validate, language]);

  // Handle input/textarea change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;

    if (isControlled) {
      // Controlled mode - call parent's onChange
      if (controlledOnChange) {
        controlledOnChange(e);
      }
    } else {
      // Uncontrolled mode - update internal state
      setInternalValue(newValue);
      setTouched(true);
    }
  };

  // Generate unique ID for error message (for aria-describedby)
  const errorId = htmlFor ? `${htmlFor}-error` : undefined;

  // Clone child Input and inject props
  const enhancedChild = isValidElement(children)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- React element props injection requires any
    ? cloneElement(children as React.ReactElement<any>, {
        value,
        onChange: handleChange,
        title: inputTitle,
        'aria-required': required ? 'true' : undefined,
        'aria-invalid': displayError ? 'true' : 'false',
        'aria-describedby': displayError && errorId ? errorId : undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- React element props injection requires any
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

  // Show message area when there's a message OR maxLength counter
  const showMessageArea = hasMessage || maxLength;

  return (
    <div className={wrapperClassName}>
      {/* Label - optional, with optional InfoHint */}
      {label && (
        <div className={styles.labelRow}>
          <label className={styles.label} htmlFor={htmlFor}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
          {labelHint && (
            <InfoHint
              content={labelHint}
              position="right"
              size="small"
              maxWidth={labelHintMaxWidth}
            />
          )}
        </div>
      )}

      {/* Input wrapper */}
      <div className={styles.inputWrapper}>
        {enhancedChild}
      </div>

      {/* Message area - error/helper text left, char count right */}
      <div className={messageAreaClassName}>
        {showMessageArea && (
          <div className={styles.messageRow}>
            {/* Left side: error/success/helper text */}
            <div className={styles.messageLeft}>
              {hasMessage && (
                <span className={messageClass} role={messageRole} id={displayError && errorId ? errorId : undefined}>
                  {displayError && <span className={styles.errorIcon} aria-hidden="true">⚠</span>}
                  {successMsg && <span className={styles.successIcon} aria-hidden="true">✓</span>}
                  {messageContent}
                </span>
              )}
            </div>
            {/* Right side: character counter */}
            {maxLength && (
              <span className={styles.charCount}>
                {value.length}/{maxLength}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormField;