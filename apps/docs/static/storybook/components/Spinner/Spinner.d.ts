import { default as React } from '../../../../../node_modules/react';
export type SpinnerSize = 'small' | 'medium' | 'large';
export interface SpinnerProps {
    /**
     * Size of the spinner
     * @default 'medium'
     */
    size?: SpinnerSize;
    /**
     * Optional label text below spinner
     */
    label?: string;
    /**
     * Custom color for the spinner (CSS color value)
     * @example '#ff0000', 'rgb(255, 0, 0)', 'var(--my-color)'
     */
    color?: string;
    /**
     * Additional CSS class names
     */
    className?: string;
    /**
     * Test ID for testing purposes
     */
    'data-testid'?: string;
}
export declare const Spinner: React.ForwardRefExoticComponent<SpinnerProps & React.RefAttributes<HTMLDivElement>>;
export default Spinner;
