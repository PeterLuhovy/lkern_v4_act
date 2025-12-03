/*
 * ================================================================
 * FILE: Textarea.tsx
 * PATH: /packages/ui-components/src/components/Textarea/Textarea.tsx
 * DESCRIPTION: Simplified textarea component - styling only, no validation
 * VERSION: v1.0.0
 * CREATED: 2025-11-29
 * UPDATED: 2025-11-29
 *
 * NOTE: Similar pattern to Input component - pure styled element.
 *       Use FormField wrapper for labels and validation messages.
 * ================================================================
 */

import React from 'react';
import { classNames } from '../../utils/classNames';
import styles from './Textarea.module.css';

/**
 * Textarea component props interface
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Make textarea full width of container
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
 * Textarea Component (v1.0.0)
 *
 * Styled multi-line text input without validation logic.
 * For form fields with labels and validation, wrap in FormField component.
 *
 * Supports all standard HTML textarea attributes (rows, cols, placeholder, disabled, etc.)
 *
 * @example Basic usage
 * ```tsx
 * <Textarea placeholder="Enter description..." rows={4} />
 * ```
 *
 * @example With validation (use FormField)
 * ```tsx
 * <FormField label="Description" error={errors.description} reserveMessageSpace>
 *   <Textarea id="description" rows={6} hasError={!!errors.description} />
 * </FormField>
 * ```
 *
 * @example With maxLength character counter
 * ```tsx
 * <FormField label="Comment" maxLength={500}>
 *   <Textarea placeholder="Add a comment..." rows={4} maxLength={500} />
 * </FormField>
 * ```
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ fullWidth = false, hasError = false, isValid = false, className, ...props }, ref) => {
    const textareaClassName = classNames(
      styles.textarea,
      hasError && styles['textarea--error'],
      isValid && !hasError && styles['textarea--valid'],
      fullWidth && styles['textarea--fullWidth'],
      className
    );

    return (
      <textarea
        ref={ref}
        {...props}
        className={textareaClassName}
        aria-invalid={hasError ? 'true' : 'false'}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
