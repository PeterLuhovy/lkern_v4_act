/*
 * ================================================================
 * FILE: CloseIssueModal.tsx
 * PATH: /apps/web-ui/src/components/modals/CloseIssueModal/CloseIssueModal.tsx
 * DESCRIPTION: Close Issue Modal - Add optional closure comment
 * VERSION: v1.0.0
 * CREATED: 2025-11-08
 * UPDATED: 2025-11-08
 * ================================================================
 */

import { useState } from 'react';
import { useTranslation } from '@l-kern/config';
import { Modal, Button } from '@l-kern/ui-components';
import styles from './CloseIssueModal.module.css';

interface CloseIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (comment?: string) => void;
  issueCode: string;
  issueTitle: string;
}

export function CloseIssueModal({ isOpen, onClose, onSubmit, issueCode, issueTitle }: CloseIssueModalProps) {
  const { t } = useTranslation();

  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onSubmit(comment || undefined);
    handleClose();
  };

  const handleClose = () => {
    setComment('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Close Issue: ${issueCode}`} size="md" modalId="close-issue-modal">
      <div className={styles.container}>
        <div className={styles.issueInfo}>
          <p className={styles.issueTitle}>{issueTitle}</p>
        </div>

        <div className={styles.warning}>
          <span className={styles.warningIcon}>⚠️</span>
          <div className={styles.warningContent}>
            <strong>Closing this issue will mark it as completed.</strong>
            <p>This action cannot be undone. The issue will be archived and no further changes can be made.</p>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Closure Comment (Optional)</label>
          <textarea
            className={styles.textarea}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add any final notes about this issue (optional)..."
            rows={4}
          />
          <span className={styles.hint}>You can add additional notes about why this issue is being closed.</span>
        </div>

        <div className={styles.actions}>
          <Button variant="outline" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button variant="danger" onClick={handleSubmit}>
            🔒 Close Issue
          </Button>
        </div>
      </div>
    </Modal>
  );
}
