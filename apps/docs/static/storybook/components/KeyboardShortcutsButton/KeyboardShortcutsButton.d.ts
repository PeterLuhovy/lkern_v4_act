import { default as React } from '../../../../../node_modules/react';
export interface KeyboardShortcut {
    key: string;
    descriptionKey: string;
    action?: () => void;
}
export interface KeyboardShortcutsButtonProps {
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
    /**
     * Callback when shortcuts modal is opened
     */
    onOpen?: () => void;
    /**
     * Callback when shortcuts modal is closed
     */
    onClose?: () => void;
}
export declare const KeyboardShortcutsButton: React.FC<KeyboardShortcutsButtonProps>;
export default KeyboardShortcutsButton;
