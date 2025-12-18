import { default as React } from '../../../../../node_modules/react';
export interface ReportButtonProps {
    /**
     * Callback when button is clicked (opens CreateIssueModal)
     */
    onClick?: () => void;
    /**
     * Position of the floating button
     * @default 'top-right'
     */
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}
/**
 * ReportButton Component
 *
 * Floating button for opening CreateIssueModal.
 * No internal modal - just triggers onClick callback.
 *
 * @example
 * ```tsx
 * <ReportButton
 *   position="top-right"
 *   onClick={() => setIsCreateIssueModalOpen(true)}
 * />
 * ```
 */
export declare const ReportButton: React.FC<ReportButtonProps>;
export default ReportButton;
