/*
 * ================================================================
 * FILE: IssueTypeSelectModal.tsx
 * PATH: /packages/ui-components/src/components/IssueTypeSelectModal/IssueTypeSelectModal.tsx
 * DESCRIPTION: Small modal for selecting issue type before opening CreateIssueModal
 * VERSION: v1.0.0
 * CREATED: 2025-11-09
 * UPDATED: 2025-11-09
 * ================================================================
 */

import React from 'react';
import { useTranslation } from '@l-kern/config';
import { Modal } from '../Modal';
import styles from './IssueTypeSelectModal.module.css';

export type IssueType = 'bug' | 'feature' | 'improvement' | 'question';

export interface IssueTypeSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: IssueType) => void;
  modalId?: string;
  availableTypes?: IssueType[]; // Filter which types to show based on user role
}

/**
 * IssueTypeSelectModal Component
 *
 * Small modal with 4 buttons to select issue type.
 * Uses basic Modal component with grid layout for buttons.
 */
export const IssueTypeSelectModal: React.FC<IssueTypeSelectModalProps> = ({
  isOpen,
  onClose,
  onSelectType,
  modalId = 'issue-type-select-modal',
  availableTypes, // If undefined, show all types
}) => {
  const { t } = useTranslation();

  const allIssueTypes: Array<{ type: IssueType; icon: string; labelKey: string }> = [
    { type: 'bug', icon: '🐛', labelKey: 'pages.issues.types.bug' },
    { type: 'feature', icon: '✨', labelKey: 'pages.issues.types.feature' },
    { type: 'improvement', icon: '📈', labelKey: 'pages.issues.types.improvement' },
    { type: 'question', icon: '❓', labelKey: 'pages.issues.types.question' },
  ];

  // Filter types based on availableTypes prop (if provided)
  const issueTypes = availableTypes
    ? allIssueTypes.filter(({ type }) => availableTypes.includes(type))
    : allIssueTypes;

  const handleTypeClick = (type: IssueType) => {
    onSelectType(type);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      modalId={modalId}
      title={t('pages.issues.typeSelect.title')}
      size="sm"
      showFooter={false}
    >
      <div className={styles.typeGrid}>
        {issueTypes.map(({ type, icon, labelKey }) => (
          <button
            key={type}
            className={styles.typeButton}
            onClick={() => handleTypeClick(type)}
            data-testid={`issue-type-${type.toLowerCase()}`}
          >
            <span className={styles.typeIcon}>{icon}</span>
            <span className={styles.typeLabel}>{t(labelKey)}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
};

export default IssueTypeSelectModal;