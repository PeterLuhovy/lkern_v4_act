import { default as React } from '../../../../../node_modules/react';
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
export declare const Checkbox: React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>>;
