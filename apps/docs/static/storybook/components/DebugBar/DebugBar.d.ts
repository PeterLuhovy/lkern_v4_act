import { default as React } from '../../../../../node_modules/react';
import { UsePageAnalyticsReturn } from '../../../../config/src/index.ts';
export interface DebugBarProps {
    /**
     * Modal/Page name to display (English name)
     * @example 'contactEdit', 'home', 'modalV3Testing'
     */
    modalName: string;
    /**
     * Whether dark mode is active
     */
    isDarkMode: boolean;
    /**
     * Analytics instance from usePageAnalytics hook
     */
    analytics: UsePageAnalyticsReturn;
    /**
     * Whether to show debug bar
     * @default true
     */
    show?: boolean;
    /**
     * Context type for analytics (page or modal)
     * @default 'modal'
     */
    contextType?: 'page' | 'modal';
}
/**
 * Debug analytics bar component (based on v3 ModalDebugHeader)
 *
 * Displays real-time modal analytics:
 * - Modal name with copy-to-clipboard
 * - Click count (🖱️) and keyboard count (⌨️)
 * - Theme indicator (🌙 Dark / ☀️ Light)
 * - Language indicator (🌐 SK/EN)
 * - Dual timer box (total time + time since last activity)
 *
 * **Features:**
 * - Orange gradient background
 * - Absolute positioning at top of modal
 * - Real-time metrics (updates every 100ms)
 * - Click tracking on debug header area
 * - Responsive height (wraps on narrow modals)
 *
 * @example
 * ```tsx
 * const analytics = usePageAnalytics('edit-contact');
 *
 * <DebugBar
 *   ref={debugBarRef}
 *   modalName="edit-contact"
 *   isDarkMode={theme === 'dark'}
 *   analytics={analytics}
 *   show={true}
 * />
 * ```
 */
export declare const DebugBar: React.ForwardRefExoticComponent<DebugBarProps & React.RefAttributes<HTMLDivElement>>;
export default DebugBar;
