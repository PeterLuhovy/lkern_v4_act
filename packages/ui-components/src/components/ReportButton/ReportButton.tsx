/*
 * ================================================================
 * FILE: ReportButton.tsx
 * PATH: /packages/ui-components/src/components/ReportButton/ReportButton.tsx
 * DESCRIPTION: Floating report button that triggers CreateIssueModal
 * VERSION: v2.0.0
 * CREATED: 2025-11-08
 * UPDATED: 2025-11-08
 * CHANGES:
 *   - v2.0.0: Removed internal modal, now triggers external CreateIssueModal via onClick
 *   - v1.0.0: Initial version with internal modal
 * ================================================================
 */

import React from 'react';
import { useTranslation } from '@l-kern/config';
import styles from './ReportButton.module.css';

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
export const ReportButton: React.FC<ReportButtonProps> = ({
  onClick,
  position = 'top-right',
}) => {
  const { t } = useTranslation();

  return (
    <button
      className={`${styles.button} ${styles[`button--${position}`]}`}
      onClick={onClick}
      title={t('components.reportButton.title')}
      aria-label={t('components.reportButton.title')}
      type="button"
    >
      <span className={styles.button__icon}>!</span>
      <span className={styles.button__label}>{t('components.reportButton.buttonLabel')}</span>
    </button>
  );
};

export default ReportButton;
