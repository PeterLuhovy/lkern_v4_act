import { default as React } from '../../../../../node_modules/react';
export interface ThemeCustomizerProps {
    /**
     * Position of the floating button
     * @default 'bottom-right'
     */
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    /**
     * Whether StatusBar is expanded
     * Used for dynamic positioning above StatusBar
     */
    statusBarExpanded?: boolean;
    /**
     * StatusBar collapsed height (px)
     * @default 32
     */
    statusBarHeight?: number;
    /**
     * StatusBar expanded height (px)
     * @default 300
     */
    statusBarExpandedHeight?: number;
}
export declare const ThemeCustomizer: React.FC<ThemeCustomizerProps>;
export default ThemeCustomizer;
