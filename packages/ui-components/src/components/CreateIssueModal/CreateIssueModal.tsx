/*
 * ================================================================
 * FILE: CreateIssueModal.tsx
 * PATH: /packages/ui-components/src/components/CreateIssueModal/CreateIssueModal.tsx
 * DESCRIPTION: Create Issue Modal with role-based form variants
 * VERSION: v1.1.0
 * CREATED: 2025-11-08
 * UPDATED: 2025-11-21
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
import { FileUpload } from '../FileUpload';
import styles from './CreateIssueModal.module.css';

export type UserRole = 'user_basic' | 'user_standard' | 'user_advance';

export type IssueType = 'bug' | 'feature' | 'improvement' | 'question';
export type IssueSeverity = 'minor' | 'moderate' | 'major' | 'blocker';
export type IssueCategory = 'ui' | 'backend' | 'database' | 'integration' | 'docs' | 'performance' | 'security';
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';

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
  /**
   * User role for filtering visible fields
   * When provided, overrides selectedRole state and hides tabs
   */
  userRole?: UserRole;
}

interface SystemInfo {
  url?: string;
  browser?: string;
  os?: string;
  viewport?: string;
  screen?: string;
  timestamp?: string;
  userAgent?: string;
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
  system_info?: SystemInfo;
}

export function CreateIssueModal({ isOpen, onClose, onSubmit, modalId = 'create-issue-modal', showClearButton = true, initialData, showRoleTabs = true, userRole }: CreateIssueModalProps) {
  const { t } = useTranslation();

  // Unsaved changes confirmation for Cancel button
  const unsavedConfirm = useConfirm();

  // Role selection state (tabs)
  const [selectedRole, setSelectedRole] = useState<UserRole>('user_basic');

  // Use provided userRole if available, otherwise use selectedRole state
  const activeRole = userRole || selectedRole;

  // Base form data (empty state)
  const baseFormData: IssueFormData = {
    title: '',
    description: '',
    type: 'bug',
    severity: 'moderate',
    category: undefined,
    priority: 'medium',
    error_message: '',
    error_type: '',
    browser: '',
    os: '',
    url: '',
    attachments: [],
    system_info: undefined,
  };

  // Form state
  const [formData, setFormData] = useState<IssueFormData>(baseFormData);

  // Track the actual initial state (including initialData props) for dirty comparison
  const [initialFormState, setInitialFormState] = useState<IssueFormData>(baseFormData);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Clear form confirmation modal state
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Dirty tracking - compare current vs initial (including initialData props)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { isDirty } = useFormDirty(initialFormState as any, formData as any);

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

  // Reset form when modal opens, merge with initialData if provided
  useEffect(() => {
    if (isOpen) {
      const mergedData = {
        ...baseFormData,
        ...initialData, // Override with initialData if provided
      };
      setFormData(mergedData);
      setInitialFormState(mergedData); // Track for dirty comparison

      // Initial validation - mark required fields as invalid immediately
      const initialErrors: Record<string, string> = {};

      if (!mergedData.title || mergedData.title.length < 5) {
        initialErrors.title = t('issues.validation.titleMinLength');
      }
      if (!mergedData.description || mergedData.description.length < 10) {
        initialErrors.description = t('issues.validation.descriptionMinLength');
      }

      setErrors(initialErrors);
    }
  }, [isOpen, initialData, t]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Common validations
    if (!formData.title || formData.title.length < 5) {
      newErrors.title = t('issues.validation.titleMinLength');
    }
    if (formData.title.length > 200) {
      newErrors.title = t('issues.validation.titleMaxLength');
    }
    if (!formData.description || formData.description.length < 10) {
      newErrors.description = t('issues.validation.descriptionMinLength');
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

  // Handle cancel button click - same behavior as X and ESC (confirm if dirty)
  const handleCancel = useCallback(() => {
    if (isDirty) {
      unsavedConfirm.confirm({}).then((confirmed) => {
        if (confirmed) {
          onClose();
        }
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
    setFormData(baseFormData);
    setErrors({});
    setShowClearConfirm(false);
  };

  // Handle clear form cancellation
  const handleClearCancel = () => {
    setShowClearConfirm(false);
  };

  // Check if there are any validation errors
  const hasValidationErrors = Object.keys(errors).length > 0;

  // Role-based title with issue type
  const getModalTitle = () => {
    const typeNames: Record<IssueType, string> = {
      bug: t('issues.types.bug'),
      feature: t('issues.types.feature'),
      improvement: t('issues.types.improvement'),
      question: t('issues.types.question'),
    };
    const roleNames: Record<UserRole, string> = {
      user_basic: t('issues.modal.basic'),
      user_standard: t('issues.modal.standard'),
      user_advance: t('issues.modal.advanced'),
    };
    return `${typeNames[formData.type]} (${roleNames[activeRole]})`;
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
        size="md"
        footer={footer}
        headerClassName={styles[`header${formData.type.charAt(0).toUpperCase() + formData.type.slice(1).toLowerCase()}`]}
      >
        {/* Role Tabs (temporary - will be removed after auth) */}
        {!userRole && showRoleTabs && (
          <div className={styles.roleTabs}>
            <button
              type="button"
              className={`${styles.roleTab} ${activeRole === 'user_basic' ? styles.roleTabActive : ''}`}
              onClick={() => setSelectedRole('user_basic')}
              data-testid="role-tab-basic"
            >
              👤 {t('issues.roles.basic')}
            </button>
            <button
              type="button"
              className={`${styles.roleTab} ${activeRole === 'user_standard' ? styles.roleTabActive : ''}`}
              onClick={() => setSelectedRole('user_standard')}
              data-testid="role-tab-standard"
            >
              👥 {t('issues.roles.standard')}
            </button>
            <button
              type="button"
              className={`${styles.roleTab} ${activeRole === 'user_advance' ? styles.roleTabActive : ''}`}
              onClick={() => setSelectedRole('user_advance')}
              data-testid="role-tab-advance"
            >
              🔧 {t('issues.roles.advanced')}
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
            validate={(value) => {
              if (!value || value.length < 5) {
                return t('issues.validation.titleMinLength');
              }
              if (value.length > 200) {
                return t('issues.validation.titleMaxLength');
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
          <FormField
            label={t('issues.form.description')}
            required
            error={errors.description}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            htmlFor="description"
            helperText={t('issues.form.descriptionHint')}
            validate={(value) => {
              if (!value || value.length < 10) {
                return t('issues.validation.descriptionMinLength');
              }
              return undefined;
            }}
          >
            <textarea
              className={styles.textarea}
              name="description"
              id="description"
              placeholder={t('issues.form.descriptionPlaceholder')}
              rows={3}
            />
          </FormField>
        </div>

        {/* user_standard: Severity (for bug and improvement) */}
        {/* user_advance: Severity only for improvement (bug has severity in Error Type row) */}
        {((activeRole === 'user_standard' && (formData.type === 'bug' || formData.type === 'improvement')) ||
          (activeRole === 'user_advance' && formData.type === 'improvement')) && (
          <div className={styles.formGroup}>
            <FormField
              label={t('issues.form.severity')}
              required
              error={errors.severity}
              value={formData.severity || ''}
              onChange={(e) => handleChange('severity', e.target.value as IssueSeverity)}
              htmlFor="severity"
            >
              <Select
                name="severity"
                id="severity"
                options={[
                  { value: 'minor', label: t('issues.severity.minor') },
                  { value: 'moderate', label: t('issues.severity.moderate') },
                  { value: 'major', label: t('issues.severity.major') },
                  { value: 'blocker', label: `🚨 ${t('issues.severity.blocker')}` },
                ]}
              />
            </FormField>
          </div>
        )}

        {/* user_advance only: Category, Priority, Error details */}
        {activeRole === 'user_advance' && (
          <>
            {/* Category & Priority in one row */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <FormField
                  label={t('issues.form.category')}
                  error={errors.category}
                  value={formData.category || ''}
                  onChange={(e) => handleChange('category', e.target.value as IssueCategory || undefined)}
                  htmlFor="category"
                >
                  <Select
                    name="category"
                    id="category"
                    placeholder={t('issues.category.placeholder')}
                    options={[
                      { value: 'ui', label: `🎨 ${t('issues.category.ui')}` },
                      { value: 'backend', label: `⚙️ ${t('issues.category.backend')}` },
                      { value: 'database', label: `🗄️ ${t('issues.category.database')}` },
                      { value: 'integration', label: `🔗 ${t('issues.category.integration')}` },
                      { value: 'docs', label: `📚 ${t('issues.category.docs')}` },
                      { value: 'performance', label: `⚡ ${t('issues.category.performance')}` },
                      { value: 'security', label: `🔒 ${t('issues.category.security')}` },
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
                >
                  <Select
                    name="priority"
                    id="priority"
                    options={[
                      { value: 'low', label: t('issues.priority.low') },
                      { value: 'medium', label: t('issues.priority.medium') },
                      { value: 'high', label: t('issues.priority.high') },
                      { value: 'critical', label: `🔴 ${t('issues.priority.critical')}` },
                    ]}
                  />
                </FormField>
              </div>
            </div>

            {/* Error Type + Severity in one row - only for bug type */}
            {formData.type === 'bug' && (
              <>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <FormField
                      label={t('issues.form.errorType')}
                      error={errors.error_type}
                      value={formData.error_type || ''}
                      onChange={(e) => handleChange('error_type', e.target.value)}
                      htmlFor="error_type"
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
                      label={t('issues.form.severity')}
                      required
                      error={errors.severity}
                      value={formData.severity || ''}
                      onChange={(e) => handleChange('severity', e.target.value as IssueSeverity)}
                      htmlFor="severity-advance"
                    >
                      <Select
                        name="severity-advance"
                        id="severity-advance"
                        options={[
                          { value: 'minor', label: t('issues.severity.minor') },
                          { value: 'moderate', label: t('issues.severity.moderate') },
                          { value: 'major', label: t('issues.severity.major') },
                          { value: 'blocker', label: `🚨 ${t('issues.severity.blocker')}` },
                        ]}
                      />
                    </FormField>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <FormField
                    label={t('issues.form.errorMessage')}
                    error={errors.error_message}
                    value={formData.error_message || ''}
                    onChange={(e) => handleChange('error_message', e.target.value)}
                    htmlFor="error_message"
                  >
                    <textarea
                      className={styles.textarea}
                      name="error_message"
                      id="error_message"
                      placeholder="Paste error message or stack trace here..."
                      rows={6}
                    />
                  </FormField>
                </div>
              </>
            )}
          </>
        )}

        {/* System Info - Read-only, only visible for advance users */}
        {activeRole === 'user_advance' && formData.system_info && (
          <div className={styles.formGroup}>
            <label className={styles.label}>
              {t('issues.form.systemInfo')} 🖥️
            </label>
            <div className={styles.systemInfoBox}>
              <div className={styles.systemInfoRow}>
                <span className={styles.systemInfoLabel}>Browser:</span>
                <span className={styles.systemInfoValue}>{formData.system_info.browser}</span>
              </div>
              <div className={styles.systemInfoRow}>
                <span className={styles.systemInfoLabel}>OS:</span>
                <span className={styles.systemInfoValue}>{formData.system_info.os}</span>
              </div>
              <div className={styles.systemInfoRow}>
                <span className={styles.systemInfoLabel}>URL:</span>
                <span className={styles.systemInfoValue}>{formData.system_info.url}</span>
              </div>
              <div className={styles.systemInfoRow}>
                <span className={styles.systemInfoLabel}>Viewport:</span>
                <span className={styles.systemInfoValue}>{formData.system_info.viewport}</span>
              </div>
              <div className={styles.systemInfoRow}>
                <span className={styles.systemInfoLabel}>Screen:</span>
                <span className={styles.systemInfoValue}>{formData.system_info.screen}</span>
              </div>
              <div className={styles.systemInfoRow}>
                <span className={styles.systemInfoLabel}>Timestamp:</span>
                <span className={styles.systemInfoValue}>
                  {formData.system_info.timestamp ? new Date(formData.system_info.timestamp).toLocaleString() : '-'}
                </span>
              </div>
            </div>
            <div className={styles.hint}>{t('issues.form.systemInfoHint')}</div>
          </div>
        )}

        {/* File Upload - Optional for all types */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            {t('issues.form.attachments')}
          </label>
          <FileUpload
            value={formData.attachments || []}
            onChange={(files) => handleChange('attachments', files)}
            maxFiles={5}
            maxSize={10 * 1024 * 1024}
            accept="image/*,.pdf,.log,.txt"
            error={errors.attachments}
            onError={(error) => {
              setErrors((prev) => ({ ...prev, attachments: error }));
            }}
          />
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
