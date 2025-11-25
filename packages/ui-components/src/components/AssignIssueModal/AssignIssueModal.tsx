/*
 * ================================================================
 * FILE: AssignIssueModal.tsx
 * PATH: /packages/ui-components/src/components/AssignIssueModal/AssignIssueModal.tsx
 * DESCRIPTION: Assign Issue Modal - Select assignee for issue
 * VERSION: v1.0.0
 * CREATED: 2025-11-08
 * UPDATED: 2025-11-21
 * ================================================================
 */

import { useState } from 'react';
import { useTranslation } from '@l-kern/config';
import { Modal } from '../Modal';
import { Button } from '../Button';
import styles from './AssignIssueModal.module.css';

interface AssignIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (assigneeId: string) => void;
  issueCode: string;
}

// TODO: Replace with real user data from Contact/Employee service
const mockUsers = [
  { id: '550e8400-e29b-41d4-a716-446655440020', name: 'John Doe', email: 'john.doe@example.com' },
  { id: '550e8400-e29b-41d4-a716-446655440021', name: 'Jane Smith', email: 'jane.smith@example.com' },
  { id: '550e8400-e29b-41d4-a716-446655440022', name: 'Mike Johnson', email: 'mike.johnson@example.com' },
  { id: '550e8400-e29b-41d4-a716-446655440023', name: 'Sarah Williams', email: 'sarah.williams@example.com' },
];

export function AssignIssueModal({ isOpen, onClose, onSubmit, issueCode }: AssignIssueModalProps) {
  const { t } = useTranslation();

  const [assigneeId, setAssigneeId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!assigneeId) {
      setError('Please select an assignee');
      return;
    }

    onSubmit(assigneeId);
    handleClose();
  };

  const handleClose = () => {
    setAssigneeId('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Assign Issue: ${issueCode}`} size="md" modalId="assign-issue-modal">
      <div className={styles.container}>
        <p className={styles.description}>Select a team member to assign this issue to:</p>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Assignee <span className={styles.required}>*</span>
          </label>
          <select
            className={styles.select}
            value={assigneeId}
            onChange={(e) => {
              setAssigneeId(e.target.value);
              setError('');
            }}
          >
            <option value="">-- Select Assignee --</option>
            {mockUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
          {error && <span className={styles.error}>{error}</span>}
        </div>

        <div className={styles.actions}>
          <Button variant="outline" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Assign Issue
          </Button>
        </div>
      </div>
    </Modal>
  );
}
