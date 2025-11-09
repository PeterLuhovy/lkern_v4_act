/*
 * ================================================================
 * FILE: CreateIssueModal.tsx
 * PATH: /apps/web-ui/src/components/modals/CreateIssueModal/CreateIssueModal.tsx
 * DESCRIPTION: Create Issue Modal with role-based form variants
 * VERSION: v1.0.0
 * CREATED: 2025-11-08
 * UPDATED: 2025-11-08
 * ================================================================
 */

import { useState } from 'react';
import { useTranslation } from '@l-kern/config';
import { Modal, Button, Input } from '@l-kern/ui-components';
import styles from './CreateIssueModal.module.css';

export type UserRole = 'user_basic' | 'user_standard' | 'user_advance';

export type IssueType = 'BUG' | 'FEATURE' | 'IMPROVEMENT' | 'QUESTION';
export type IssueSeverity = 'MINOR' | 'MODERATE' | 'MAJOR' | 'BLOCKER';
export type IssueCategory = 'UI' | 'BACKEND' | 'DATABASE' | 'INTEGRATION' | 'DOCS' | 'PERFORMANCE' | 'SECURITY';
export type IssuePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

interface CreateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IssueFormData) => void;
  userRole: UserRole;
}

interface IssueFormData {
  title: string;
  description: string;
  type: IssueType;
  severity?: IssueSeverity;
  category?: IssueCategory;
  priority?: IssuePriority;
  error_message?: string;
  error_type?: string;
  browser?: string;
  os?: string;
  url?: string;
  attachments?: File[];
}

export function CreateIssueModal({ isOpen, onClose, onSubmit, userRole }: CreateIssueModalProps) {
  const { t } = useTranslation();

  // Form state
  const [formData, setFormData] = useState<IssueFormData>({
    title: '',
    description: '',
    type: 'BUG',
    severity: 'MODERATE',
    category: undefined,
    priority: 'MEDIUM',
    error_message: '',
    error_type: '',
    browser: '',
    os: '',
    url: '',
    attachments: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input changes
  const handleChange = (field: keyof IssueFormData, value: any) => {
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

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    // Validate file count based on role
    const maxFiles = userRole === 'user_basic' ? 1 : 5;
    if (fileArray.length > maxFiles) {
      setErrors((prev) => ({
        ...prev,
        attachments: `Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''} allowed`,
      }));
      return;
    }

    // Validate file size (10MB per file)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = fileArray.filter((file) => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setErrors((prev) => ({
        ...prev,
        attachments: 'Each file must be less than 10MB',
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, attachments: fileArray }));
    if (errors.attachments) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.attachments;
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Common validations
    if (!formData.title || formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }
    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    if (!formData.type) {
      newErrors.type = 'Type is required';
    }

    // Role-specific validations
    if (userRole === 'user_basic') {
      if (!formData.attachments || formData.attachments.length < 1) {
        newErrors.attachments = 'At least 1 screenshot is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = () => {
    if (!validateForm()) return;

    onSubmit(formData);
    handleClose();
  };

  // Handle close
  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      type: 'BUG',
      severity: 'MODERATE',
      category: undefined,
      priority: 'MEDIUM',
      error_message: '',
      error_type: '',
      browser: '',
      os: '',
      url: '',
      attachments: [],
    });
    setErrors({});
    onClose();
  };

  // Role-based title
  const getModalTitle = () => {
    const roleTitles = {
      user_basic: 'Report Issue (Basic)',
      user_standard: 'Report Issue (Standard)',
      user_advance: 'Report Issue (Advanced)',
    };
    return roleTitles[userRole];
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={getModalTitle()} size="large">
      <div className={styles.formContainer}>
        {/* Common Fields (All Roles) */}
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

        <div className={styles.formGroup}>
          <label className={styles.label}>
            {t('issues.form.description')} <span className={styles.required}>*</span>
          </label>
          <textarea
            className={styles.textarea}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder={t('issues.form.descriptionPlaceholder')}
            rows={5}
          />
          {errors.description && <span className={styles.error}>{errors.description}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            {t('issues.form.type')} <span className={styles.required}>*</span>
          </label>
          <select
            className={styles.select}
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value as IssueType)}
          >
            <option value="BUG">🐛 Bug</option>
            <option value="FEATURE">✨ Feature</option>
            <option value="IMPROVEMENT">📈 Improvement</option>
            <option value="QUESTION">❓ Question</option>
          </select>
        </div>

        {/* user_standard and user_advance: Severity */}
        {(userRole === 'user_standard' || userRole === 'user_advance') && (
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
        )}

        {/* user_advance only: Category */}
        {userRole === 'user_advance' && (
          <>
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

            <div className={styles.formGroup}>
              <label className={styles.label}>{t('issues.form.errorMessage')}</label>
              <textarea
                className={styles.textarea}
                value={formData.error_message}
                onChange={(e) => handleChange('error_message', e.target.value)}
                placeholder="Paste error message here..."
                rows={3}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>{t('issues.form.errorType')}</label>
                <Input
                  value={formData.error_type}
                  onChange={(e) => handleChange('error_type', e.target.value)}
                  placeholder="e.g., TypeError, NetworkError"
                  maxLength={100}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>{t('issues.form.browser')}</label>
                <Input
                  value={formData.browser}
                  onChange={(e) => handleChange('browser', e.target.value)}
                  placeholder="e.g., Chrome 120, Firefox 121"
                  maxLength={100}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>{t('issues.form.os')}</label>
                <Input
                  value={formData.os}
                  onChange={(e) => handleChange('os', e.target.value)}
                  placeholder="e.g., Windows 11, macOS 14"
                  maxLength={100}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>{t('issues.form.url')}</label>
                <Input
                  value={formData.url}
                  onChange={(e) => handleChange('url', e.target.value)}
                  placeholder="URL where issue occurred"
                  maxLength={500}
                />
              </div>
            </div>
          </>
        )}

        {/* File Upload (All Roles) */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            {t('issues.form.attachments')}
            {userRole === 'user_basic' && <span className={styles.required}>*</span>}
          </label>
          <input
            type="file"
            multiple={userRole !== 'user_basic'}
            accept="image/*,.pdf,.log,.txt"
            onChange={handleFileUpload}
            className={styles.fileInput}
          />
          <div className={styles.fileHint}>
            {userRole === 'user_basic'
              ? '1 screenshot required (max 10MB)'
              : 'Max 5 files, 10MB each (images, PDF, logs, txt)'}
          </div>
          {errors.attachments && <span className={styles.error}>{errors.attachments}</span>}
          {formData.attachments && formData.attachments.length > 0 && (
            <div className={styles.fileList}>
              {formData.attachments.map((file, index) => (
                <div key={index} className={styles.fileItem}>
                  📎 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className={styles.formActions}>
          <Button variant="outline" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {t('issues.form.submit')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
