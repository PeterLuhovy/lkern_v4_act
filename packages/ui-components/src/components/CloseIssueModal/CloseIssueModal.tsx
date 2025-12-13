/*
 * ================================================================
 * FILE: CloseIssueModal.tsx
 * PATH: /packages/ui-components/src/components/CloseIssueModal/CloseIssueModal.tsx
 * DESCRIPTION: Close Issue Modal - Add optional closure comment
 * VERSION: v1.0.0
 * CREATED: 2025-11-08
 * UPDATED: 2025-11-21
 * ================================================================
 */

import { useState } from 'react';
import { useTranslation } from '@l-kern/config';
import { Modal } from '../Modal';
import { Button } from '../Button';
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
    <Modal isOpen={isOpen} onClose={handleClose} title={t('issues.closeModal.title', { code: issueCode })} size="md" modalId="close-issue-modal">
      <div className={styles.container}>
        <div className={styles.issueInfo}>
          <p className={styles.issueTitle}>{issueTitle}</p>
        </div>

        <div className={styles.warning}>
          <span className={styles.warningIcon} role="img" aria-hidden="true">⚠️</span>
          <div className={styles.warningContent}>
            <strong>{t('issues.closeModal.warningTitle')}</strong>
            <p>{t('issues.closeModal.warningMessage')}</p>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>{t('issues.closeModal.commentLabel')}</label>
          <textarea
            className={styles.textarea}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t('issues.closeModal.commentPlaceholder')}
            rows={4}
          />
          <span className={styles.hint}>{t('issues.closeModal.commentHint')}</span>
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button variant="danger" onClick={handleSubmit}>
            {t('issues.closeModal.submitButton')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
