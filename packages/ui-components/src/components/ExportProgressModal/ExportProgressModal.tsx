/*
 * ================================================================
 * FILE: ExportProgressModal.tsx
 * PATH: /packages/ui-components/src/components/ExportProgressModal/ExportProgressModal.tsx
 * DESCRIPTION: Reusable export progress modal for serviceWorkflow
 *              downloads. Shows progress bar, file list, and status.
 * VERSION: v1.0.0
 * CREATED: 2025-12-11
 * UPDATED: 2025-12-11
 * ================================================================
 */

import React from 'react';
import { useTranslation } from '@l-kern/config';
import { Modal } from '../Modal';
import styles from './ExportProgressModal.module.css';

// ============================================================
// TYPES
// ============================================================

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

// ============================================================
// COMPONENT
// ============================================================

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
export const ExportProgressModal: React.FC<ExportProgressModalProps> = ({
  isOpen,
  format,
  progress,
  files,
  onCancel,
  title,
  healthCheckText,
  downloadingText,
  processingText = 'Spracovávam...',
  completeText = 'Hotovo!',
  noAttachmentsText,
  attachmentsLabel,
  cancelText,
}) => {
  const { t } = useTranslation();

  // Default texts using translations
  const defaultHealthCheckText = t('pages.issues.exportZipLoading');
  const defaultDownloadingText = t('pages.issues.exportLoading', { format });
  const defaultNoAttachmentsText = '📋 Exportujem iba dáta (žiadne prílohy)';

  // Determine title based on phase
  const getTitle = () => {
    if (title) return title;

    switch (progress?.phase) {
      case 'healthCheck':
        return healthCheckText || defaultHealthCheckText;
      case 'downloading':
        return downloadingText || defaultDownloadingText;
      case 'processing':
        return processingText;
      case 'complete':
        return completeText;
      default:
        return downloadingText || defaultDownloadingText;
    }
  };

  // Format bytes to human readable
  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // Cannot close during export
      modalId="export-progress"
      size="md"
      showCloseButton={false}
      title={getTitle()}
    >
      {/* CSS keyframes for indeterminate progress animation */}
      <style>{`
        @keyframes exportIndeterminate {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(200%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>

      {/* Progress Bar */}
      {progress && progress.phase !== 'healthCheck' && (
        <div className={styles.progressSection}>
          <div className={styles.progressInfo}>
            <span className={styles.progressSize}>
              {progress.totalKnown
                ? `${formatBytes(progress.downloadedBytes)} / ${formatBytes(progress.totalBytes)}`
                : formatBytes(progress.downloadedBytes)}
            </span>
            <span className={styles.progressPercent}>
              {progress.totalKnown ? `${progress.percentage}%` : '...'}
            </span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: progress.totalKnown ? `${progress.percentage}%` : '30%',
                transition: progress.totalKnown ? 'width 0.3s ease' : 'none',
                animation: !progress.totalKnown ? 'exportIndeterminate 1.5s ease-in-out infinite' : 'none',
              }}
            />
          </div>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className={styles.fileSection}>
          <p className={styles.fileCount}>
            <span role="img" aria-hidden="true">📎</span> {files.length} {attachmentsLabel || (files.length === 1 ? 'príloha' : 'príloh')} na stiahnutie:
          </p>
          <div className={styles.fileList}>
            {files.map((file, index) => (
              <div
                key={index}
                className={styles.fileItem}
                style={{
                  borderBottom: index < files.length - 1 ? '1px solid var(--theme-border, #e0e0e0)' : 'none',
                }}
              >
                <div className={styles.fileInfo}>
                  <div className={styles.fileName}>
                    <span role="img" aria-hidden="true">📄</span> {file.name}
                  </div>
                  <div className={styles.fileEntity}>
                    {file.entityCode}
                  </div>
                </div>
                <div className={styles.fileSize}>
                  {file.size > 0 ? formatBytes(file.size) : '—'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No attachments message */}
      {files.length === 0 && (
        <p className={styles.noAttachments}>
          {noAttachmentsText || defaultNoAttachmentsText}
        </p>
      )}

      {/* Cancel button */}
      {onCancel && progress?.phase !== 'complete' && (
        <div className={styles.cancelSection}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
          >
            {cancelText || t('common.cancel')}
          </button>
        </div>
      )}
    </Modal>
  );
};

export default ExportProgressModal;
