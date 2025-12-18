import { default as React } from '../../../../../node_modules/react';
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
export declare const FormField: React.FC<FormFieldProps>;
export default FormField;
