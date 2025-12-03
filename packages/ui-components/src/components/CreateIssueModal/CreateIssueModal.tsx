/*
 * ================================================================
 * FILE: CreateIssueModal.tsx
 * PATH: /packages/ui-components/src/components/CreateIssueModal/CreateIssueModal.tsx
 * DESCRIPTION: Create Issue Modal with role-based form variants
 * VERSION: v1.3.0
 * CREATED: 2025-11-08
 * UPDATED: 2025-11-29
 *
 * CHANGES (v1.3.0):
 *   - FIXED: Validation messages now translate dynamically on language change
 *   - REFACTORED: Using FormField's validate + onValidChange instead of external errors
 *   - FIXED: System Info labels now use translations (not hardcoded English)
 *   - ADDED: titleValid/descriptionValid state for validity tracking
 *
 * CHANGES (v1.2.0):
 *   - REFACTORED: Using Textarea component instead of native textarea
 *   - REMOVED: InfoHint import (using FormField labelHint prop)
 * ================================================================
 */

import { useState, useCallback, useEffect } from 'react';
import { useTranslation, useFormDirty, useConfirm, useToast } from '@l-kern/config';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { Input } from '../Input';
import { Textarea } from '../Textarea';
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
  /**
   * Loading state for submit button (shown while creating issue)
   * When true, submit button shows spinner and is disabled
   * @default false
   */
  isLoading?: boolean;
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

export function CreateIssueModal({ isOpen, onClose, onSubmit, modalId = 'create-issue-modal', showClearButton = true, initialData, showRoleTabs = true, userRole, isLoading = false }: CreateIssueModalProps) {
  const { t } = useTranslation();

  // Unsaved changes confirmation for Cancel button
  const unsavedConfirm = useConfirm();

  // Toast notifications
  const toast = useToast();

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

  // Field validity tracking (for FormField onValidChange)
  const [titleValid, setTitleValid] = useState(false);
  const [descriptionValid, setDescriptionValid] = useState(false);

  // Clear form confirmation modal state
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // File limit exceeded state (for disabling submit when too many files via drag&drop)
  const [fileLimitExceeded, setFileLimitExceeded] = useState(false);

  // Dirty tracking - compare current vs initial (including initialData props)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { isDirty } = useFormDirty(initialFormState as any, formData as any);

  // Handle input changes
  // NOTE: Title/description validation is handled by FormField's validate prop + onValidChange
  const handleChange = (field: keyof IssueFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for other fields if it exists
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Auto-detect system info (browser, OS, viewport, etc.)
  const collectSystemInfo = (): SystemInfo => {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    let os = 'Unknown';

    // Detect browser
    if (ua.includes('Firefox/')) {
      const version = ua.match(/Firefox\/(\d+)/)?.[1];
      browser = `Firefox ${version || ''}`.trim();
    } else if (ua.includes('Edg/')) {
      const version = ua.match(/Edg\/(\d+)/)?.[1];
      browser = `Edge ${version || ''}`.trim();
    } else if (ua.includes('Chrome/')) {
      const version = ua.match(/Chrome\/(\d+)/)?.[1];
      browser = `Chrome ${version || ''}`.trim();
    } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
      const version = ua.match(/Version\/(\d+)/)?.[1];
      browser = `Safari ${version || ''}`.trim();
    }

    // Detect OS
    if (ua.includes('Windows NT 10')) os = 'Windows 10/11';
    else if (ua.includes('Windows NT 6.3')) os = 'Windows 8.1';
    else if (ua.includes('Windows NT 6.1')) os = 'Windows 7';
    else if (ua.includes('Mac OS X')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    return {
      browser,
      os,
      url: window.location.href,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      screen: `${window.screen.width}x${window.screen.height}`,
      timestamp: new Date().toISOString(),
    };
  };

  // Reset form when modal opens, merge with initialData if provided
  // NOTE: t is intentionally NOT in deps - we don't want to reset form on language change
  useEffect(() => {
    if (isOpen) {
      // Auto-collect system info
      const systemInfo = collectSystemInfo();

      const mergedData = {
        ...baseFormData,
        system_info: systemInfo, // Auto-populate system info
        ...initialData, // Override with initialData if provided (can override system_info)
      };
      setFormData(mergedData);
      setInitialFormState(mergedData); // Track for dirty comparison
      setFileLimitExceeded(false); // Reset file limit state
      setErrors({}); // Clear any previous errors

      // Set initial validity based on merged data
      // FormField's validate will run immediately and call onValidChange
      setTitleValid(!!mergedData.title && mergedData.title.length >= 5 && mergedData.title.length <= 200);
      setDescriptionValid(!!mergedData.description && mergedData.description.length >= 10);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialData]);

  // Handle submit
  // NOTE: Validation is handled by FormField's validate prop + onValidChange
  // isSubmitDisabled already checks titleValid && descriptionValid
  const handleSubmit = () => {
    if (isLoading || !titleValid || !descriptionValid) return;

    onSubmit(formData);
    // NOTE: Don't call onClose() here - parent controls closing after async operation completes
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
    setInitialFormState(baseFormData); // Reset initial state so form is "clean" after clearing
    setErrors({});
    setTitleValid(false); // Reset validity state
    setDescriptionValid(false); // Reset validity state
    setFileLimitExceeded(false); // Reset file limit state
    setShowClearConfirm(false);
  };

  // Handle clear form cancellation
  const handleClearCancel = () => {
    setShowClearConfirm(false);
  };

  // Check if there are any validation errors (excluding attachments - handled by fileLimitExceeded)
  // Title and description validity are tracked via FormField's onValidChange
  const hasOtherErrors = Object.keys(errors).filter(key => key !== 'attachments').length > 0;

  // Submit is disabled if required fields are invalid OR other errors OR file limit exceeded OR loading
  const isSubmitDisabled = !titleValid || !descriptionValid || hasOtherErrors || fileLimitExceeded || isLoading;

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
        disabled={isLoading}
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
          disabled={isLoading}
          data-testid="create-issue-modal-cancel"
        >
          {t('common.cancel')}
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          loading={isLoading}
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
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            htmlFor="title"
            helperText={t('issues.form.titleHint')}
            maxLength={200}
            reserveMessageSpace
            validate={(value) => {
              if (!value || value.length < 5) {
                return t('issues.validation.titleMinLength');
              }
              if (value.length > 200) {
                return t('issues.validation.titleMaxLength');
              }
              return undefined;
            }}
            onValidChange={setTitleValid}
          >
            <Input
              type="text"
              name="title"
              id="title"
              placeholder={t('issues.form.titlePlaceholder')}
              maxLength={200}
            />
          </FormField>
        </div>

        <div className={styles.formGroup}>
          <FormField
            label={t('issues.form.description')}
            required
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            htmlFor="description"
            helperText={t('issues.form.descriptionHint')}
            reserveMessageSpace
            validate={(value) => {
              if (!value || value.length < 10) {
                return t('issues.validation.descriptionMinLength');
              }
              return undefined;
            }}
            onValidChange={setDescriptionValid}
          >
            <Textarea
              name="description"
              id="description"
              placeholder={t('issues.form.descriptionPlaceholder')}
              rows={3}
              fullWidth
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
              labelHint={t('pages.issues.edit.severityVsPriorityInfo')}
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
                  labelHint={t('pages.issues.edit.severityVsPriorityInfo')}
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
                        placeholder={t('pages.issues.details.errorTypePlaceholder')}
                        maxLength={100}
                      />
                    </FormField>
                  </div>
                  <div className={styles.formGroup}>
                    <FormField
                      label={t('issues.form.severity')}
                      labelHint={t('pages.issues.edit.severityVsPriorityInfo')}
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
                    <Textarea
                      name="error_message"
                      id="error_message"
                      placeholder={t('pages.issues.details.errorMessagePlaceholder')}
                      rows={5}
                      fullWidth
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
                <span className={styles.systemInfoLabel}>{t('issues.form.systemInfoLabels.browser')}:</span>
                <span className={styles.systemInfoValue}>{formData.system_info.browser}</span>
              </div>
              <div className={styles.systemInfoRow}>
                <span className={styles.systemInfoLabel}>{t('issues.form.systemInfoLabels.os')}:</span>
                <span className={styles.systemInfoValue}>{formData.system_info.os}</span>
              </div>
              <div className={styles.systemInfoRow}>
                <span className={styles.systemInfoLabel}>{t('issues.form.systemInfoLabels.url')}:</span>
                <span className={styles.systemInfoValue}>{formData.system_info.url}</span>
              </div>
              <div className={styles.systemInfoRow}>
                <span className={styles.systemInfoLabel}>{t('issues.form.systemInfoLabels.viewport')}:</span>
                <span className={styles.systemInfoValue}>{formData.system_info.viewport}</span>
              </div>
              <div className={styles.systemInfoRow}>
                <span className={styles.systemInfoLabel}>{t('issues.form.systemInfoLabels.screen')}:</span>
                <span className={styles.systemInfoValue}>{formData.system_info.screen}</span>
              </div>
              <div className={styles.systemInfoRow}>
                <span className={styles.systemInfoLabel}>{t('issues.form.systemInfoLabels.timestamp')}:</span>
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
            onFileLimitExceeded={(exceeded) => setFileLimitExceeded(exceeded)}
            onPasteLimitReached={() => {
              toast.info(t('components.fileUpload.errors.maxFiles', { max: 5 }));
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
