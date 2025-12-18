import { default as React } from '../../../../../node_modules/react';
export type InfoHintPosition = 'top' | 'bottom' | 'left' | 'right';
export type InfoHintSize = 'small' | 'medium' | 'large';
export interface InfoHintProps {
    /**
     * Content to display in the popup
     */
    content: React.ReactNode;
    /**
     * Position of the popup relative to the icon
     * @default 'top'
     */
    position?: InfoHintPosition;
    /**
     * Size of the info icon
     * @default 'medium'
     */
    size?: InfoHintSize;
    /**
     * Custom icon (defaults to ℹ️ circle)
     */
    icon?: React.ReactNode;
    /**
     * Additional CSS class for the container
     */
    className?: string;
    /**
     * Additional CSS class for the popup
     */
    popupClassName?: string;
    /**
     * Max width of the popup in pixels
     * @default 300
     */
    maxWidth?: number;
}
export declare const InfoHint: React.ForwardRefExoticComponent<InfoHintProps & React.RefAttributes<HTMLDivElement>>;
export default InfoHint;
