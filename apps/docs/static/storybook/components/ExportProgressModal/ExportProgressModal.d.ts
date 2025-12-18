import { default as React } from '../../../../../node_modules/react';
export interface ExportFile {
    /** File name */
    name: string;
    /** Parent entity code (e.g., issue code) */
    entityCode: string;
    /** File size in bytes */
    size: number;
}
export interface ExportProgress {
    /** Current phase of export */
    phase: 'healthCheck' | 'downloading' | 'processing' | 'complete' | string;
    /** Percentage complete (0-100) */
    percentage: number;
    /** Bytes downloaded so far */
    downloadedBytes: number;
    /** Total bytes expected */
    totalBytes: number;
    /** Whether total size is known */
    totalKnown: boolean;
}
export interface ExportProgressModalProps {
    /** Whether modal is open */
    isOpen: boolean;
    /** Export format (CSV, JSON, ZIP) */
    format: string;
    /** Current export progress */
    progress: ExportProgress | null;
    /** List of files being exported */
    files: ExportFile[];
    /** Callback when user cancels the export */
    onCancel?: () => void;
    /** Custom title override */
    title?: string;
    /** Text for health check phase */
    healthCheckText?: string;
    /** Text for downloading phase */
    downloadingText?: string;
    /** Text for processing phase */
    processingText?: string;
    /** Text for complete phase */
    completeText?: string;
    /** Text when no attachments */
    noAttachmentsText?: string;
    /** Label for attachments count */
    attachmentsLabel?: string;
    /** Text for cancel button */
    cancelText?: string;
}
/**
 * ExportProgressModal - Reusable modal for showing download progress.
 *
 * Used with serviceWorkflow's onProgress callback for blob downloads.
 * Shows:
 * - Current phase (health check, downloading, processing, complete)
 * - Progress bar with percentage and size
 * - List of files being exported
 *
 * @example
 * ```tsx
 * <ExportProgressModal
 *   isOpen={isExporting}
 *   format="ZIP"
 *   progress={exportProgress}
 *   files={exportFiles}
 * />
 * ```
 */
export declare const ExportProgressModal: React.FC<ExportProgressModalProps>;
export default ExportProgressModal;
