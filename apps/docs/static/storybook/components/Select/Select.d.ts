import { default as React } from '../../../../../node_modules/react';
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
export declare const Select: React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<HTMLSelectElement>>;
export default Select;
