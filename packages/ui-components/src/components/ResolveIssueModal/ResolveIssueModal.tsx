/*
 * ================================================================
 * FILE: ResolveIssueModal.tsx
 * PATH: /packages/ui-components/src/components/ResolveIssueModal/ResolveIssueModal.tsx
 * DESCRIPTION: Resolve Issue Modal - Add resolution description
 * VERSION: v1.0.0
 * CREATED: 2025-11-08
 * UPDATED: 2025-11-21
 * ================================================================
 */

import { useState } from 'react';
import { useTranslation } from '@l-kern/config';
import { Modal } from '../Modal';
import { Button } from '../Button';
import styles from './ResolveIssueModal.module.css';

interface ResolveIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (resolution: string) => void;
  issueCode: string;
  issueTitle: string;
}

export function ResolveIssueModal({ isOpen, onClose, onSubmit, issueCode, issueTitle }: ResolveIssueModalProps) {
  const { t } = useTranslation();

  const [resolution, setResolution] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!resolution || resolution.length < 10) {
      setError(t('issues.resolveModal.errors.minLength'));
      return;
    }

    onSubmit(resolution);
    handleClose();
  };

  const handleClose = () => {
    setResolution('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('issues.resolveModal.title', { code: issueCode })} size="lg" modalId="resolve-issue-modal">
      <div className={styles.container}>
        <div className={styles.issueInfo}>
          <p className={styles.issueTitle}>{issueTitle}</p>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            {t('issues.resolveModal.resolutionLabel')} <span className={styles.required}>*</span>
          </label>
          <textarea
            className={styles.textarea}
            value={resolution}
            onChange={(e) => {
              setResolution(e.target.value);
              setError('');
            }}
            placeholder={t('issues.resolveModal.resolutionPlaceholder')}
            rows={3}
          />
          {error && <span className={styles.error}>{error}</span>}
          <span className={styles.hint}>{t('issues.resolveModal.resolutionHint')}</span>
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {t('issues.resolveModal.submitButton')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
