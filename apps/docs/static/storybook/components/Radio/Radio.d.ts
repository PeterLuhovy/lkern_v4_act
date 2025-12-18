import { default as React } from '../../../../../node_modules/react';
/**
 * Radio component props interface
 */
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    /**
     * Label text displayed next to the radio button
     */
    label: string;
    /**
     * Error state (typically controlled by RadioGroup)
     */
    error?: boolean;
}
/**
 * Radio Button Component
 *
 * A customizable radio input with label and accessibility features.
 * Typically used within a RadioGroup component for managing selection state.
 *
 * @example
 * ```tsx
 * // Basic radio button
 * <Radio name="option" value="1" label="Option 1" />
 *
 * // Radio button with checked state
 * <Radio name="option" value="2" label="Option 2" checked />
 *
 * // Radio button disabled
 * <Radio name="option" value="3" label="Option 3" disabled />
 * ```
 */
export declare const Radio: React.ForwardRefExoticComponent<RadioProps & React.RefAttributes<HTMLInputElement>>;
