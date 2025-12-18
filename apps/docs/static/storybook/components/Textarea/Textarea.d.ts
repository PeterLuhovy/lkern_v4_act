import { default as React } from '../../../../../node_modules/react';
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
export declare const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;
export default Textarea;
