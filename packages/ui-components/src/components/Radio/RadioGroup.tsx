/*
 * ================================================================
 * FILE: RadioGroup.tsx
 * PATH: packages/ui-components/src/components/Radio/RadioGroup.tsx
 * DESCRIPTION: RadioGroup wrapper for managing radio button selection
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
 * ================================================================
 */

import React from 'react';
import { Radio } from './Radio';
import styles from './RadioGroup.module.css';

/**
 * Radio option interface
 */
export interface RadioOption {
  /**
   * Unique value for this option
   */
  value: string;

  /**
   * Label text to display
   */
  label: string;

  /**
   * Whether this option is disabled
   */
  disabled?: boolean;
}

/**
 * RadioGroup component props interface
 */
export interface RadioGroupProps {
  /**
   * Name attribute for all radio inputs (required for proper grouping)
   */
  name: string;

  /**
   * Array of radio options to render
   */
  options: RadioOption[];

  /**
   * Currently selected value
   */
  value?: string;

  /**
   * Change handler called when selection changes
   */
  onChange?: (value: string) => void;

  /**
   * Error message to display (shows error state)
   */
  error?: string;

  /**
   * Helper text to display below the group
   */
  helperText?: string;

  /**
   * Label for the entire radio group
   */
  label?: string;

  /**
   * Whether the radio group is required
   */
  required?: boolean;

  /**
   * Whether the entire group is disabled
   */
  disabled?: boolean;

  /**
   * Layout direction for radio buttons
   */
  direction?: 'vertical' | 'horizontal';

  /**
   * Additional CSS class name
   */
  className?: string;
}

/**
 * RadioGroup Component
 *
 * A wrapper component for managing a group of radio buttons with unified state and styling.
 * Handles selection state, error display, and accessibility features.
 *
 * @example
 * ```tsx
 * // Basic radio group
 * <RadioGroup
 *   name="size"
 *   label="Select size"
 *   options={[
 *     { value: 'small', label: 'Small' },
 *     { value: 'medium', label: 'Medium' },
 *     { value: 'large', label: 'Large' },
 *   ]}
 *   value={selectedSize}
 *   onChange={setSelectedSize}
 * />
 *
 * // With error state
 * <RadioGroup
 *   name="payment"
 *   label="Payment method"
 *   options={paymentOptions}
 *   value={payment}
 *   onChange={setPayment}
 *   error="Please select a payment method"
 *   required
 * />
 * ```
 */
export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  error,
  helperText,
  label,
  required = false,
  disabled = false,
  direction = 'vertical',
  className,
}) => {
  const hasError = Boolean(error);
  const hasHelperText = Boolean(helperText);
  const descriptionId = hasError || hasHelperText ? `${name}-description` : undefined;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <div className={`${styles.radioGroup} ${className || ''}`} role="radiogroup" aria-labelledby={label ? `${name}-label` : undefined}>
      {label && (
        <div id={`${name}-label`} className={styles.groupLabel}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </div>
      )}

      <div className={`${styles.optionsContainer} ${direction === 'horizontal' ? styles.horizontal : styles.vertical}`}>
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            checked={value === option.value}
            onChange={handleChange}
            disabled={disabled || option.disabled}
            error={hasError}
            aria-describedby={descriptionId}
          />
        ))}
      </div>

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
};
