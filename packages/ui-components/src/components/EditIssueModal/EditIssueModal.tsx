/*
 * ================================================================
 * FILE: EditIssueModal.tsx
 * PATH: /apps/web-ui/src/components/modals/EditIssueModal/EditIssueModal.tsx
 * DESCRIPTION: Edit Issue Modal - Update issue fields
 * VERSION: v1.0.0
 * CREATED: 2025-11-08
 * UPDATED: 2025-11-08
 * ================================================================
 */

import { useState, useEffect } from 'react';
import { useTranslation } from '@l-kern/config';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { Input } from '../Input';
import styles from './EditIssueModal.module.css';

type IssueSeverity = 'MINOR' | 'MODERATE' | 'MAJOR' | 'BLOCKER';
type IssueCategory = 'UI' | 'BACKEND' | 'DATABASE' | 'INTEGRATION' | 'DOCS' | 'PERFORMANCE' | 'SECURITY';
type IssuePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

interface EditIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EditIssueFormData) => void;
  issueCode: string;
  initialData: {
    title: string;
    description: string;
    severity: IssueSeverity;
    priority: IssuePriority;
    category?: IssueCategory;
  };
}

interface EditIssueFormData {
  title?: string;
  description?: string;
  severity?: IssueSeverity;
  priority?: IssuePriority;
  category?: IssueCategory;
}

export function EditIssueModal({ isOpen, onClose, onSubmit, issueCode, initialData }: EditIssueModalProps) {
  const { t } = useTranslation();

  // Form state
  const [formData, setFormData] = useState({
    title: initialData.title,
    description: initialData.description,
    severity: initialData.severity,
    priority: initialData.priority,
    category: initialData.category,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form when initialData changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        severity: initialData.severity,
        priority: initialData.priority,
        category: initialData.category,
      });
      setErrors({});
    }
  }, [isOpen, initialData]);

  // Handle input changes
  const handleChange = (field: keyof EditIssueFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }
    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = () => {
    if (!validateForm()) return;

    // Send only changed fields
    const changedData: EditIssueFormData = {};
    if (formData.title !== initialData.title) changedData.title = formData.title;
    if (formData.description !== initialData.description) changedData.description = formData.description;
    if (formData.severity !== initialData.severity) changedData.severity = formData.severity;
    if (formData.priority !== initialData.priority) changedData.priority = formData.priority;
    if (formData.category !== initialData.category) changedData.category = formData.category;

    onSubmit(changedData);
    handleClose();
  };

  // Handle close
  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Edit Issue: ${issueCode}`} size="lg" modalId="edit-issue-modal">
      <div className={styles.formContainer}>
        {/* Title */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            {t('issues.form.title')} <span className={styles.required}>*</span>
          </label>
          <Input
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder={t('issues.form.titlePlaceholder')}
            error={errors.title}
            maxLength={200}
          />
          <span className={styles.charCount}>{formData.title.length}/200</span>
        </div>

        {/* Description */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            {t('issues.form.description')} <span className={styles.required}>*</span>
          </label>
          <textarea
            className={styles.textarea}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder={t('issues.form.descriptionPlaceholder')}
            rows={3}
          />
          {errors.description && <span className={styles.error}>{errors.description}</span>}
        </div>

        {/* Severity */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            {t('issues.form.severity')} <span className={styles.required}>*</span>
          </label>
          <select
            className={styles.select}
            value={formData.severity}
            onChange={(e) => handleChange('severity', e.target.value as IssueSeverity)}
          >
            <option value="MINOR">Minor</option>
            <option value="MODERATE">Moderate</option>
            <option value="MAJOR">Major</option>
            <option value="BLOCKER">🚨 Blocker</option>
          </select>
        </div>

        {/* Priority */}
        <div className={styles.formGroup}>
          <label className={styles.label}>{t('issues.form.priority')}</label>
          <select
            className={styles.select}
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value as IssuePriority)}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">🔴 Critical</option>
          </select>
        </div>

        {/* Category */}
        <div className={styles.formGroup}>
          <label className={styles.label}>{t('issues.form.category')}</label>
          <select
            className={styles.select}
            value={formData.category || ''}
            onChange={(e) => handleChange('category', e.target.value as IssueCategory || undefined)}
          >
            <option value="">-- Select Category --</option>
            <option value="UI">🎨 UI</option>
            <option value="BACKEND">⚙️ Backend</option>
            <option value="DATABASE">🗄️ Database</option>
            <option value="INTEGRATION">🔗 Integration</option>
            <option value="DOCS">📚 Docs</option>
            <option value="PERFORMANCE">⚡ Performance</option>
            <option value="SECURITY">🔒 Security</option>
          </select>
        </div>

        {/* Form Actions */}
        <div className={styles.formActions}>
          <Button variant="outline" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {t('common.save')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
