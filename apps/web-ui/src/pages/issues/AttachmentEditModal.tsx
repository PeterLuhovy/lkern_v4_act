/*
 * ================================================================
 * FILE: AttachmentEditModal.tsx
 * PATH: /apps/web-ui/src/pages/Issues/AttachmentEditModal.tsx
 * DESCRIPTION: Modal for editing issue attachments - add new and delete existing
 * VERSION: v1.2.1
 * CREATED: 2025-11-29
 * UPDATED: 2025-12-09
 * CHANGELOG:
 *   v1.2.1 - Fixed: markedForDeletion reset by auto-refresh (useRef for open transition)
 *   v1.2.0 - Added pessimistic locking (acquires lock on open, releases on close)
 *   v1.1.0 - Fixed attachment list not updating after delete (added localAttachments state)
 * ================================================================
 */

import { useState, useEffect, useRef } from 'react';
import { Modal, FileUpload, Spinner } from '@l-kern/ui-components';
import { useTranslation, useToast, SERVICE_ENDPOINTS } from '@l-kern/config';
import styles from './AttachmentEditModal.module.css';

// ============================================================
// TYPES
// ============================================================

interface Attachment {
  file_name: string;
  file_path: string;
  file_size: number;
  content_type: string;
  uploaded_at: string;
}

type AttachmentStatus = 'checking' | 'available' | 'unavailable' | 'error';

interface AttachmentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  issueId: string;
  issueCode: string;
  existingAttachments: Attachment[];
  attachmentStatus: Map<string, AttachmentStatus>;
  onSave: (deletedAttachments: Attachment[], newFiles: File[]) => Promise<boolean>;
  parentModalId?: string;
}

// ============================================================
// API CONFIGURATION
// ============================================================

const API_BASE_URL = 'http://localhost:4105';

// ============================================================
// COMPONENT
// ============================================================

export function AttachmentEditModal({
  isOpen,
  onClose,
  issueId,
  issueCode,
  existingAttachments,
  attachmentStatus,
  onSave,
  parentModalId,
}: AttachmentEditModalProps) {
  const { t } = useTranslation();
  const toast = useToast();

  // ============================================================
  // STATE
  // ============================================================

  // Local copy of attachments (for immediate UI update after delete)
  const [localAttachments, setLocalAttachments] = useState<Attachment[]>(existingAttachments);
  // Attachments marked for deletion
  const [markedForDeletion, setMarkedForDeletion] = useState<Set<string>>(new Set());
  // New files to upload
  const [newFiles, setNewFiles] = useState<File[]>([]);
  // FileUpload error state
  const [fileError, setFileError] = useState<string>('');
  // File limit exceeded state
  const [fileLimitExceeded, setFileLimitExceeded] = useState(false);
  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  // Confirmation modal state
  const [showConfirmation, setShowConfirmation] = useState(false);

  // ============================================================
  // RESET STATE ON MODAL OPEN OR ATTACHMENTS CHANGE
  // ============================================================

  // Sync localAttachments with prop when it changes (e.g., after parent refresh)
  // BUT only if nothing is marked for deletion (preserve user selection)
  useEffect(() => {
    if (markedForDeletion.size === 0) {
      setLocalAttachments(existingAttachments);
    }
  }, [existingAttachments, markedForDeletion.size]);

  // Reset state ONLY when modal OPENS (not on every prop change)
  // Using ref to track previous isOpen state
  const prevIsOpenRef = useRef(false);
  useEffect(() => {
    // Only reset when transitioning from closed to open
    if (isOpen && !prevIsOpenRef.current) {
      setLocalAttachments(existingAttachments);
      setMarkedForDeletion(new Set());
      setNewFiles([]);
      setFileError('');
      setFileLimitExceeded(false);
      setShowConfirmation(false);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, existingAttachments]);

  // ============================================================
  // COMPUTED VALUES
  // ============================================================

  // Remaining attachments (not marked for deletion)
  const remainingAttachments = localAttachments.filter(
    (att) => !markedForDeletion.has(att.file_name)
  );

  // Total count for limit calculation
  const totalCount = remainingAttachments.length + newFiles.length;

  // Max files allowed (5 total)
  const maxFiles = 5;

  // Has changes?
  const hasChanges = markedForDeletion.size > 0 || newFiles.length > 0;

  // Can save? (has changes and not over limit)
  const canSave = hasChanges && !fileLimitExceeded && !isSaving;

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleMarkForDeletion = (fileName: string) => {
    setMarkedForDeletion((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fileName)) {
        newSet.delete(fileName);
      } else {
        newSet.add(fileName);
      }
      return newSet;
    });
  };

  const handleNewFilesChange = (files: File[]) => {
    setNewFiles(files);
  };

  // Handle save button click - show confirmation if deletions exist
  const handleSaveClick = () => {
    if (!canSave) return;

    // If there are attachments marked for deletion, show confirmation
    if (markedForDeletion.size > 0) {
      setShowConfirmation(true);
    } else {
      // No deletions, just upload new files directly
      handleConfirmedSave();
    }
  };

  // Actual save after confirmation
  const handleConfirmedSave = async () => {
    setShowConfirmation(false);
    setIsSaving(true);

    try {
      const deletedAttachments = localAttachments.filter((att) =>
        markedForDeletion.has(att.file_name)
      );

      const success = await onSave(deletedAttachments, newFiles);
      if (success) {
        toast.success(t('pages.issues.attachmentEdit.saveSuccess'));
        // Immediately update local attachments list (removes deleted items)
        // This ensures UI reflects changes before parent props update
        setLocalAttachments((prev) =>
          prev.filter((att) => !markedForDeletion.has(att.file_name))
        );
        // Reset state but keep modal open - user can add more files or close manually
        setMarkedForDeletion(new Set());
        setNewFiles([]);
      } else {
        toast.error(t('pages.issues.attachmentEdit.saveError'));
      }
    } catch (error) {
      console.error('[AttachmentEditModal] Save error:', error);
      toast.error(t('pages.issues.attachmentEdit.saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Get status indicator for existing attachment
  const getStatusIndicator = (fileName: string): React.ReactNode => {
    const status = attachmentStatus.get(fileName);
    switch (status) {
      case 'checking':
        return <span role="img" aria-label={t('pages.issues.details.attachmentChecking')} title={t('pages.issues.details.attachmentChecking')}>⏳</span>;
      case 'available':
        return <span role="img" aria-label={t('pages.issues.details.attachmentAvailable')} title={t('pages.issues.details.attachmentAvailable')} style={{ color: 'var(--color-status-success)' }}>✓</span>;
      case 'unavailable':
        return <span role="img" aria-label={t('pages.issues.details.attachmentUnavailable')} title={t('pages.issues.details.attachmentUnavailable')} style={{ color: 'var(--color-status-error)' }}>❌</span>;
      case 'error':
        return <span role="img" aria-label={t('pages.issues.details.attachmentError')} title={t('pages.issues.details.attachmentError')} style={{ color: 'var(--color-status-warning)' }}>⚠️</span>;
      default:
        return null;
    }
  };

  const handlePasteLimitReached = () => {
    toast.warning(t('components.fileUpload.pasteLimit'));
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      modalId={`${parentModalId || 'issue'}-attachment-edit`}
      title={t('pages.issues.attachmentEdit.title')}
      size="md"
      maxWidth="600px"
      locking={{
        enabled: true,
        recordId: issueId,
        lockApiUrl: SERVICE_ENDPOINTS.issues.baseUrl,
      }}
    >
      <div className={styles.content}>
        {/* Existing Attachments Section */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>
            {t('pages.issues.attachmentEdit.existingTitle')} ({remainingAttachments.length})
          </h4>

          {localAttachments.length > 0 ? (
            <div className={styles.attachmentList}>
              {localAttachments.map((attachment) => {
                const isMarkedForDeletion = markedForDeletion.has(attachment.file_name);
                const isUnavailable = attachmentStatus.get(attachment.file_name) === 'unavailable';

                return (
                  <div
                    key={attachment.file_name}
                    className={`${styles.attachmentItem} ${isMarkedForDeletion ? styles.attachmentMarkedForDeletion : ''}`}
                  >
                    <div className={styles.attachmentInfo}>
                      <span role="img" aria-label="Attachment" className={styles.attachmentIcon}>📎</span>
                      <div className={styles.attachmentDetails}>
                        {isUnavailable || isMarkedForDeletion ? (
                          <span className={styles.attachmentNameDisabled}>
                            {attachment.file_name}
                          </span>
                        ) : (
                          <a
                            href={`${API_BASE_URL}/issues/${issueId}/attachments/${attachment.file_name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.attachmentName}
                          >
                            {attachment.file_name}
                          </a>
                        )}
                        <span className={styles.attachmentSize}>
                          {formatFileSize(attachment.file_size)}
                        </span>
                      </div>
                      <span className={styles.statusIndicator}>
                        {getStatusIndicator(attachment.file_name)}
                      </span>
                    </div>

                    <button
                      type="button"
                      className={`${styles.deleteButton} ${isMarkedForDeletion ? styles.deleteButtonActive : ''}`}
                      onClick={() => handleMarkForDeletion(attachment.file_name)}
                      title={isMarkedForDeletion
                        ? t('pages.issues.attachmentEdit.undoDelete')
                        : t('pages.issues.attachmentEdit.markDelete')}
                    >
                      {isMarkedForDeletion ? '↩' : '✕'}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className={styles.emptyMessage}>{t('pages.issues.view.noAttachments')}</p>
          )}

          {/* Deletion summary */}
          {markedForDeletion.size > 0 && (
            <div className={styles.deletionSummary}>
              <span role="img" aria-label="Warning">⚠️</span> {t('pages.issues.attachmentEdit.deletionWarning', { count: markedForDeletion.size })}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Add New Attachments Section */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>
            {t('pages.issues.attachmentEdit.addNewTitle')}
          </h4>

          <FileUpload
            value={newFiles}
            onChange={handleNewFilesChange}
            maxFiles={maxFiles - remainingAttachments.length}
            maxSize={10 * 1024 * 1024}
            accept="image/*,.pdf,.log,.txt"
            error={fileError}
            onError={setFileError}
            onFileLimitExceeded={setFileLimitExceeded}
            onPasteLimitReached={handlePasteLimitReached}
          />
        </div>

        {/* Total count info */}
        <div className={styles.totalInfo}>
          {t('pages.issues.attachmentEdit.totalCount', {
            current: totalCount,
            max: maxFiles
          })}
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onClose}
          disabled={isSaving}
        >
          {t('common.cancel')}
        </button>
        <button
          type="button"
          className={styles.saveButton}
          onClick={handleSaveClick}
          disabled={!canSave}
        >
          {isSaving ? (
            <>
              <Spinner size="sm" color="white" />
              {t('common.saving')}
            </>
          ) : t('common.save')}
        </button>
      </div>

      {/* Confirmation Modal for deletions */}
      {showConfirmation && (
        <Modal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          modalId={`${parentModalId || 'issue'}-attachment-confirm`}
          title={`⚠️ ${t('pages.issues.attachmentEdit.confirmDeleteTitle')}`}
          size="sm"
          maxWidth="450px"
        >
          <div className={styles.confirmContent}>
            <p className={styles.confirmMessage}>
              {t('pages.issues.attachmentEdit.confirmDeleteMessage', { count: markedForDeletion.size })}
            </p>

            {/* List of attachments to be deleted */}
            <ul className={styles.confirmList}>
              {localAttachments
                .filter((att) => markedForDeletion.has(att.file_name))
                .map((att) => (
                  <li key={att.file_name} className={styles.confirmListItem}>
                    <span role="img" aria-label="Attachment">📎</span> {att.file_name}
                    <span className={styles.confirmListSize}>({formatFileSize(att.file_size)})</span>
                  </li>
                ))}
            </ul>

            <p className={styles.confirmWarning}>
              {t('pages.issues.attachmentEdit.confirmDeleteWarning')}
            </p>

            <div className={styles.confirmActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setShowConfirmation(false)}
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                className={styles.confirmDeleteButton}
                onClick={handleConfirmedSave}
              >
                {t('pages.issues.attachmentEdit.confirmDeleteButton')}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </Modal>
  );
}
