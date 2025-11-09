/*
 * ================================================================
 * FILE: CreateIssueModal.tsx
 * PATH: /packages/ui-components/src/components/CreateIssueModal/CreateIssueModal.tsx
 * DESCRIPTION: Create Issue Modal with role-based form variants
 * VERSION: v1.0.0
 * CREATED: 2025-11-08
 * UPDATED: 2025-11-08
 * ================================================================
 */

import { useState, useCallback, useEffect } from 'react';
import { useTranslation, useFormDirty, useConfirm } from '@l-kern/config';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { Input } from '../Input';
import { Select } from '../Select';
import { FormField } from '../FormField';
import { ConfirmModal } from '../ConfirmModal';
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
  modalId?: string;
  /**
   * Show clear form button
   * @default true
   */
  showClearButton?: boolean;
  /**
   * Initial data to pre-fill form fields (e.g., from ReportButton)
   */
  initialData?: Partial<IssueFormData>;
  /**
   * Show role tabs (will be hidden once authentication is implemented)
   * @default true
   */
  showRoleTabs?: boolean;
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

export function CreateIssueModal({ isOpen, onClose, onSubmit, modalId = 'create-issue-modal', showClearButton = true, initialData, showRoleTabs = true }: CreateIssueModalProps) {
  const { t } = useTranslation();

  // Unsaved changes confirmation
  const unsavedConfirm = useConfirm();

  // Role selection state (tabs)
  const [selectedRole, setSelectedRole] = useState<UserRole>('user_basic');

  // Initial form data (for dirty tracking)
  const initialFormData: IssueFormData = {
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
  };

  // Form state
  const [formData, setFormData] = useState<IssueFormData>(initialFormData);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Clear form confirmation modal state
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Dirty tracking - compare current vs initial
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { isDirty } = useFormDirty(initialFormData as any, formData as any);

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

    // Validate file count based on issue type
    const maxFiles = formData.type === 'BUG' ? 1 : 5;
    if (fileArray.length > maxFiles) {
      setErrors((prev) => ({
        ...prev,
        attachments: formData.type === 'BUG'
          ? 'Only 1 screenshot allowed for bug reports'
          : `Maximum ${maxFiles} files allowed`,
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

    // For BUG type, validate that it's an image
    if (formData.type === 'BUG') {
      const nonImageFiles = fileArray.filter((file) => !file.type.startsWith('image/'));
      if (nonImageFiles.length > 0) {
        setErrors((prev) => ({
          ...prev,
          attachments: 'Bug reports require image screenshots only',
        }));
        return;
      }
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

  // Reset form when modal opens, merge with initialData if provided
  useEffect(() => {
    if (isOpen) {
      const mergedData = {
        ...initialFormData,
        ...initialData, // Override with initialData if provided
      };
      setFormData(mergedData);

      // Initial validation - mark required fields as invalid immediately
      const initialErrors: Record<string, string> = {};

      if (!mergedData.title || mergedData.title.length < 3) {
        initialErrors.title = 'Title must be at least 3 characters';
      }
      if (!mergedData.description || mergedData.description.length < 3) {
        initialErrors.description = 'Description must be at least 3 characters';
      }
      if (mergedData.type === 'BUG' && (!mergedData.attachments || mergedData.attachments.length < 1)) {
        initialErrors.attachments = 'At least 1 screenshot is required for bug reports';
      }

      setErrors(initialErrors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialData]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Common validations
    if (!formData.title || formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }
    if (!formData.description || formData.description.length < 3) {
      newErrors.description = 'Description must be at least 3 characters';
    }
    if (!formData.type) {
      newErrors.type = 'Type is required';
    }

    // Type-specific validations - screenshot required ONLY for BUG
    if (formData.type === 'BUG') {
      if (!formData.attachments || formData.attachments.length < 1) {
        newErrors.attachments = 'At least 1 screenshot is required for bug reports';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = () => {
    if (!validateForm()) return;

    onSubmit(formData);
    onClose(); // Just close, no reset (reset happens on next open via useEffect)
  };

  // Handle cancel button click
  // Shows unsaved changes confirmation if form is dirty
  const handleCancel = useCallback(() => {
    if (isDirty) {
      // Show unsaved changes confirmation
      unsavedConfirm.confirm({}).then((confirmed) => {
        if (confirmed) {
          onClose();
        }
        // If not confirmed, stay in modal (do nothing)
      });
    } else {
      onClose();
    }
  }, [isDirty, unsavedConfirm, onClose]);

  // Handle clear form button click
  const handleClearClick = () => {
    setShowClearConfirm(true);
  };

  // Handle clear form confirmation
  const handleClearConfirm = () => {
    setFormData(initialFormData);
    setErrors({});
    setShowClearConfirm(false);
  };

  // Handle clear form cancellation
  const handleClearCancel = () => {
    setShowClearConfirm(false);
  };

  // Check if there are any validation errors
  const hasValidationErrors = Object.keys(errors).length > 0;

  // Role-based title
  const getModalTitle = () => {
    const roleTitles = {
      user_basic: 'Report Issue (Basic)',
      user_standard: 'Report Issue (Standard)',
      user_advance: 'Report Issue (Advanced)',
    };
    return roleTitles[selectedRole];
  };

  // Footer configuration
  const footer = {
    // Left slot: Clear button (if enabled)
    left: showClearButton ? (
      <Button
        variant="danger-subtle"
        onClick={handleClearClick}
        data-testid="create-issue-modal-clear"
      >
        {t('components.modalV3.sectionEditModal.clearButton')}
      </Button>
    ) : undefined,

    // Right slot: Cancel + Submit buttons
    right: (
      <>
        <Button
          variant="ghost"
          onClick={handleCancel}
          data-testid="create-issue-modal-cancel"
        >
          {t('common.cancel')}
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={hasValidationErrors}
          data-testid="create-issue-modal-submit"
        >
          {t('issues.form.submit')}
        </Button>
      </>
    ),
  };

  return (
    <>
      {/* Main Create Issue Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={unsavedConfirm.state.isOpen ? undefined : handleSubmit}
        hasUnsavedChanges={isDirty}
        modalId={modalId}
        title={getModalTitle()}
        size="lg"
        footer={footer}
      >
        {/* Role Tabs (temporary - will be removed after auth) */}
        {showRoleTabs && (
          <div className={styles.roleTabs}>
            <button
              type="button"
              className={`${styles.roleTab} ${selectedRole === 'user_basic' ? styles.roleTabActive : ''}`}
              onClick={() => setSelectedRole('user_basic')}
              data-testid="role-tab-basic"
            >
              👤 Basic User
            </button>
            <button
              type="button"
              className={`${styles.roleTab} ${selectedRole === 'user_standard' ? styles.roleTabActive : ''}`}
              onClick={() => setSelectedRole('user_standard')}
              data-testid="role-tab-standard"
            >
              👥 Standard User
            </button>
            <button
              type="button"
              className={`${styles.roleTab} ${selectedRole === 'user_advance' ? styles.roleTabActive : ''}`}
              onClick={() => setSelectedRole('user_advance')}
              data-testid="role-tab-advance"
            >
              🔧 Advanced User
            </button>
          </div>
        )}

      <div className={styles.formContainer}>
        {/* Common Fields (All Roles) */}
        <div className={styles.formGroup}>
          <FormField
            label={t('issues.form.title')}
            required
            error={errors.title}
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            htmlFor="title"
            helperText={t('issues.form.titleHint')}
            reserveMessageSpace
            validate={(value) => {
              if (!value || value.length < 3) {
                return 'Title must be at least 3 characters';
              }
              if (value.length > 200) {
                return 'Title must be less than 200 characters';
              }
              return undefined;
            }}
          >
            <Input
              type="text"
              name="title"
              id="title"
              placeholder={t('issues.form.titlePlaceholder')}
              maxLength={200}
            />
          </FormField>
          <span className={styles.charCount}>{formData.title.length}/200</span>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="description">
            {t('issues.form.description')} <span className={styles.required}>*</span>
          </label>
          <textarea
            className={styles.textarea}
            name="description"
            id="description"
            value={formData.description}
            onChange={(e) => {
              handleChange('description', e.target.value);
              // Real-time validation
              if (e.target.value.length > 0 && e.target.value.length < 3) {
                setErrors((prev) => ({ ...prev, description: 'Description must be at least 3 characters' }));
              } else {
                setErrors((prev) => {
                  const { description, ...rest } = prev;
                  return rest;
                });
              }
            }}
            placeholder={t('issues.form.descriptionPlaceholder')}
            rows={5}
          />
          <div className={styles.hint}>{t('issues.form.descriptionHint')}</div>
          {errors.description && <span className={styles.error}>{errors.description}</span>}
        </div>

        {/* Type (read-only - selected from IssueTypeSelectModal) */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            {t('issues.form.type')}
          </label>
          <div className={styles.readOnlyField}>
            {formData.type === 'BUG' && '🐛 Bug'}
            {formData.type === 'FEATURE' && '✨ Feature'}
            {formData.type === 'IMPROVEMENT' && '📈 Improvement'}
            {formData.type === 'QUESTION' && '❓ Question'}
          </div>
        </div>

        {/* user_standard and user_advance: Severity (only for BUG and IMPROVEMENT) */}
        {(selectedRole === 'user_standard' || selectedRole === 'user_advance') &&
         (formData.type === 'BUG' || formData.type === 'IMPROVEMENT') && (
          <div className={styles.formGroup}>
            <FormField
              label={t('issues.form.severity')}
              required
              error={errors.severity}
              value={formData.severity || ''}
              onChange={(e) => handleChange('severity', e.target.value as IssueSeverity)}
              htmlFor="severity"
              reserveMessageSpace
            >
              <Select
                name="severity"
                id="severity"
                options={[
                  { value: 'MINOR', label: 'Minor' },
                  { value: 'MODERATE', label: 'Moderate' },
                  { value: 'MAJOR', label: 'Major' },
                  { value: 'BLOCKER', label: '🚨 Blocker' },
                ]}
              />
            </FormField>
          </div>
        )}

        {/* user_advance only: Category */}
        {selectedRole === 'user_advance' && (
          <>
            <div className={styles.formGroup}>
              <FormField
                label={t('issues.form.category')}
                error={errors.category}
                value={formData.category || ''}
                onChange={(e) => handleChange('category', e.target.value as IssueCategory || undefined)}
                htmlFor="category"
                reserveMessageSpace
              >
                <Select
                  name="category"
                  id="category"
                  placeholder="-- Select Category --"
                  options={[
                    { value: 'UI', label: '🎨 UI' },
                    { value: 'BACKEND', label: '⚙️ Backend' },
                    { value: 'DATABASE', label: '🗄️ Database' },
                    { value: 'INTEGRATION', label: '🔗 Integration' },
                    { value: 'DOCS', label: '📚 Docs' },
                    { value: 'PERFORMANCE', label: '⚡ Performance' },
                    { value: 'SECURITY', label: '🔒 Security' },
                  ]}
                />
              </FormField>
            </div>

            <div className={styles.formGroup}>
              <FormField
                label={t('issues.form.priority')}
                error={errors.priority}
                value={formData.priority || ''}
                onChange={(e) => handleChange('priority', e.target.value as IssuePriority)}
                htmlFor="priority"
                reserveMessageSpace
              >
                <Select
                  name="priority"
                  id="priority"
                  options={[
                    { value: 'LOW', label: 'Low' },
                    { value: 'MEDIUM', label: 'Medium' },
                    { value: 'HIGH', label: 'High' },
                    { value: 'CRITICAL', label: '🔴 Critical' },
                  ]}
                />
              </FormField>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="error_message">
                {t('issues.form.errorMessage')}
              </label>
              <textarea
                className={styles.textarea}
                name="error_message"
                id="error_message"
                value={formData.error_message || ''}
                onChange={(e) => handleChange('error_message', e.target.value)}
                placeholder="Paste error message here..."
                rows={3}
              />
              {errors.error_message && (
                <span className={styles.error}>{errors.error_message}</span>
              )}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <FormField
                  label={t('issues.form.errorType')}
                  error={errors.error_type}
                  value={formData.error_type || ''}
                  onChange={(e) => handleChange('error_type', e.target.value)}
                  htmlFor="error_type"
                  reserveMessageSpace
                >
                  <Input
                    type="text"
                    name="error_type"
                    id="error_type"
                    placeholder="e.g., TypeError, NetworkError"
                    maxLength={100}
                  />
                </FormField>
              </div>

              <div className={styles.formGroup}>
                <FormField
                  label={t('issues.form.browser')}
                  error={errors.browser}
                  value={formData.browser || ''}
                  onChange={(e) => handleChange('browser', e.target.value)}
                  htmlFor="browser"
                  reserveMessageSpace
                >
                  <Input
                    type="text"
                    name="browser"
                    id="browser"
                    placeholder="e.g., Chrome 120, Firefox 121"
                    maxLength={100}
                  />
                </FormField>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <FormField
                  label={t('issues.form.os')}
                  error={errors.os}
                  value={formData.os || ''}
                  onChange={(e) => handleChange('os', e.target.value)}
                  htmlFor="os"
                  reserveMessageSpace
                >
                  <Input
                    type="text"
                    name="os"
                    id="os"
                    placeholder="e.g., Windows 11, macOS 14"
                    maxLength={100}
                  />
                </FormField>
              </div>

              <div className={styles.formGroup}>
                <FormField
                  label={t('issues.form.url')}
                  error={errors.url}
                  value={formData.url || ''}
                  onChange={(e) => handleChange('url', e.target.value)}
                  htmlFor="url"
                  reserveMessageSpace
                >
                  <Input
                    type="text"
                    name="url"
                    id="url"
                    placeholder="URL where issue occurred"
                    maxLength={500}
                  />
                </FormField>
              </div>
            </div>
          </>
        )}

        {/* File Upload - Screenshot for BUG, optional attachments for others */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            {formData.type === 'BUG' ? 'Screenshot problému' : t('issues.form.attachments')}
            {formData.type === 'BUG' && <span className={styles.required}>*</span>}
          </label>
          <input
            type="file"
            multiple={formData.type !== 'BUG'}
            accept={formData.type === 'BUG' ? 'image/*' : 'image/*,.pdf,.log,.txt'}
            onChange={handleFileUpload}
            className={styles.fileInput}
            required={formData.type === 'BUG'}
          />
          <div className={styles.fileHint}>
            {formData.type === 'BUG'
              ? '📸 Povinný screenshot problému (max 10MB, len obrázky)'
              : '📎 Voliteľné prílohy: max 5 súborov, 10MB každý (obrázky, PDF, logy, txt)'}
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

      </div>
      </Modal>

      {/* Clear Form Confirmation Modal */}
      {showClearButton && (
        <ConfirmModal
          isOpen={showClearConfirm}
          onClose={handleClearCancel}
          onConfirm={handleClearConfirm}
          title={t('components.modalV3.sectionEditModal.clearConfirmTitle')}
          message={t('components.modalV3.sectionEditModal.clearConfirmMessage')}
          confirmButtonLabel={t('components.modalV3.sectionEditModal.clearConfirmButton')}
          cancelButtonLabel={t('common.cancel')}
          parentModalId={modalId}
        />
      )}

      {/* Unsaved Changes Confirmation Modal */}
      <ConfirmModal
        isOpen={unsavedConfirm.state.isOpen}
        onClose={unsavedConfirm.handleCancel}
        onConfirm={unsavedConfirm.handleConfirm}
        title={t('components.modalV3.confirmModal.unsavedChanges.title')}
        message={t('components.modalV3.confirmModal.unsavedChanges.message')}
        confirmButtonLabel={t('components.modalV3.confirmModal.unsavedChanges.confirmButton')}
        cancelButtonLabel={t('common.cancel')}
        parentModalId={modalId}
      />
    </>
  );
}
