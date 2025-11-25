/*
 * ================================================================
 * FILE: DeletionAuditModal.tsx
 * PATH: /apps/web-ui/src/pages/Issues/DeletionAuditModal.tsx
 * DESCRIPTION: Modal showing deletion audit details when hard delete fails
 * VERSION: v1.0.0
 * UPDATED: 2025-11-24 13:40:00
 * ================================================================
 */

import React, { useEffect, useState } from 'react';
import { Modal } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import styles from './DeletionAuditModal.module.css';

// === API CONFIG ===
const API_BASE_URL = 'http://localhost:4105'; // Issues Service REST API

// === TYPES ===

interface DeletionAuditData {
  id: number;
  item_id: string;
  item_code: string;
  item_type: string;
  status: 'pending' | 'completed' | 'failed' | 'partial';
  files_found: number;
  files_deleted: number;
  files_failed: Array<{
    file_name: string;
    error: string;
  }> | null;
  error_message: string | null;
  started_at: string;
  completed_at: string | null;
  deleted_by: string | null;
  retry_count: number;
  last_retry_at: string | null;
}

interface DeletionAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  issueId: string;
}

// === COMPONENT ===

export function DeletionAuditModal({ isOpen, onClose, issueId }: DeletionAuditModalProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [auditData, setAuditData] = useState<DeletionAuditData | null>(null);

  // Fetch deletion audit data when modal opens
  useEffect(() => {
    if (!isOpen || !issueId) return;

    const fetchAuditData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_BASE_URL}/issues/${issueId}/deletion-audit`
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setAuditData(data);
      } catch (err) {
        console.error('[DeletionAuditModal] Failed to fetch audit data:', err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchAuditData();
  }, [isOpen, issueId]);

  // Format date
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('sk-SK', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Get status badge color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'var(--color-status-success)';
      case 'pending':
        return 'var(--color-status-info)';
      case 'failed':
        return 'var(--color-status-error)';
      case 'partial':
        return 'var(--color-status-warning)';
      default:
        return 'var(--theme-text-muted)';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      modalId="deletion-audit-modal"
      title={t('issues.deletionAudit.title')}
      size="md"
      loading={loading}
      showCloseButton={true}
      closeOnBackdropClick={true}
    >
      <div className={styles.container}>
        {error && (
          <div className={styles.error}>
            <strong>{t('common.error')}:</strong> {error}
          </div>
        )}

        {auditData && (
          <>
            {/* Status Section */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>{t('issues.deletionAudit.status')}</h3>
              <div className={styles.statusBadge} style={{ backgroundColor: getStatusColor(auditData.status) }}>
                {t(`issues.deletionAudit.statusValues.${auditData.status}`)}
              </div>
            </div>

            {/* Summary Section */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>{t('issues.deletionAudit.summary')}</h3>
              <div className={styles.grid}>
                <div className={styles.field}>
                  <span className={styles.label}>{t('issues.deletionAudit.itemCode')}:</span>
                  <span className={styles.value}>{auditData.item_code}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.label}>{t('issues.deletionAudit.filesFound')}:</span>
                  <span className={styles.value}>{auditData.files_found}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.label}>{t('issues.deletionAudit.filesDeleted')}:</span>
                  <span className={styles.value}>{auditData.files_deleted}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.label}>{t('issues.deletionAudit.startedAt')}:</span>
                  <span className={styles.value}>{formatDate(auditData.started_at)}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.label}>{t('issues.deletionAudit.completedAt')}:</span>
                  <span className={styles.value}>{formatDate(auditData.completed_at)}</span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {auditData.error_message && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>{t('issues.deletionAudit.errorMessage')}</h3>
                <div className={styles.errorBox}>
                  {auditData.error_message}
                </div>
              </div>
            )}

            {/* Failed Files List */}
            {auditData.files_failed && auditData.files_failed.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  {t('issues.deletionAudit.failedFiles')} ({auditData.files_failed.length})
                </h3>
                <div className={styles.filesList}>
                  {auditData.files_failed.map((file, index) => (
                    <div key={index} className={styles.fileItem}>
                      <div className={styles.fileName}>{file.file_name}</div>
                      <div className={styles.fileError}>{file.error}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
