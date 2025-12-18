import { default as React } from '../../../../../node_modules/react';
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
export declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
export default Input;
