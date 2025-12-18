import { default as React } from '../../../../../node_modules/react';
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
export declare const RadioGroup: React.FC<RadioGroupProps>;
