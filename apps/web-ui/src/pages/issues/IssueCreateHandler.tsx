/*
 * ================================================================
 * FILE: IssueCreateHandler.tsx
 * PATH: /apps/web-ui/src/pages/Issues/IssueCreateHandler.tsx
 * DESCRIPTION: React component that handles all issue creation UI logic.
 *              Manages modals, calls workflow, handles errors.
 *              Issues.tsx just renders this component and gets callbacks.
 * VERSION: v2.0.0
 * CREATED: 2025-11-30
 * UPDATED: 2025-12-04
 * CHANGELOG:
 *   v2.0.0 - Migrated from local createIssueWorkflow to universal serviceWorkflow from @l-kern/config
 *   v1.0.1 - Fixed: MinIO retry modal now stays open on failure
 *            (previously modal disappeared even when retry failed)
 * ================================================================
 */

import { useState, useCallback } from 'react';
import { CreateIssueModal, IssueTypeSelectModal, ConfirmModal } from '@l-kern/ui-components';
import { useTranslation, useToast, useAuthContext, getBackendRole, useAnalyticsSettings, serviceWorkflow, SERVICE_ENDPOINTS, type ServiceWorkflowResult } from '@l-kern/config';
import { type CreatedIssue } from '../../services';

// ============================================================
// TYPES
// ============================================================

type IssueType = 'bug' | 'feature' | 'improvement' | 'question';

interface InitialIssueData {
  type?: IssueType;
  browser?: string;
  os?: string;
  url?: string;
  description?: string;
  system_info?: Record<string, unknown>;
}

interface IssueFormData {
  title: string;
  description: string;
  type: IssueType;
  severity?: string | null;
  category?: string | null;
  priority?: string | null;
  error_message?: string | null;
  error_type?: string | null;
  system_info?: Record<string, unknown> | null;
  attachments?: File[];
}

interface IssueCreateHandlerProps {
  /** Called when issue is successfully created */
  onSuccess: (issue: CreatedIssue) => void;
  /** Optional: Called when create modal is opened */
  onModalOpen?: () => void;
  /** Optional: Called when create modal is closed */
  onModalClose?: () => void;
  /** Initial data for the issue (e.g., from Report Bug button) */
  initialData?: InitialIssueData;
  /** Whether to show type select modal first */
  showTypeSelect?: boolean;
  /** Control modal open state externally */
  isOpen?: boolean;
  /** External control for closing modal */
  onClose?: () => void;
}

// ============================================================
// COMPONENT
// ============================================================

export function IssueCreateHandler({
  onSuccess,
  onModalOpen,
  onModalClose,
  initialData,
  showTypeSelect = true,
  isOpen: externalIsOpen,
  onClose: externalOnClose,
}: IssueCreateHandlerProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const { permissionLevel } = useAuthContext();
  const analyticsSettings = useAnalyticsSettings();

  // ─────────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────────

  // Modal visibility (internal or external control)
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen ?? internalIsOpen;

  // Type select modal (shown first if showTypeSelect=true)
  const [isTypeSelectOpen, setIsTypeSelectOpen] = useState(false);

  // Create modal data
  const [issueInitialData, setIssueInitialData] = useState<InitialIssueData>(initialData || {});

  // Loading state
  const [isCreating, setIsCreating] = useState(false);

  // MinIO unavailable dialog
  const [minioError, setMinioError] = useState<{
    formData: IssueFormData;
    filesCount: number;
  } | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // Service unavailable dialog (Issues Service or SQL down)
  const [serviceError, setServiceError] = useState<{
    formData: IssueFormData;
    errorType: 'SERVICE_DOWN' | 'SQL_DOWN';
  } | null>(null);
  const [isRetryingService, setIsRetryingService] = useState(false);

  // Generic error
  const [error, setError] = useState<string | null>(null);

  // ─────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────

  const handleClose = useCallback(() => {
    if (externalOnClose) {
      externalOnClose();
    } else {
      setInternalIsOpen(false);
    }
    setMinioError(null);
    setServiceError(null);
    setError(null);
    onModalClose?.();
  }, [externalOnClose, onModalClose]);

  const handleTypeSelect = useCallback((type: IssueType) => {
    setIsTypeSelectOpen(false);
    setIssueInitialData(prev => ({ ...prev, type }));

    // Open create modal
    if (externalOnClose) {
      // External control - parent handles it
    } else {
      setInternalIsOpen(true);
    }
    onModalOpen?.();
  }, [externalOnClose, onModalOpen]);

  // ─────────────────────────────────────────────────────────────────
  // CREATE ISSUE HANDLER
  // ─────────────────────────────────────────────────────────────────

  // Core workflow call - uses universal serviceWorkflow from @l-kern/config
  const callWorkflow = useCallback(async (formData: IssueFormData, skipFiles = false, isRetry = false): Promise<ServiceWorkflowResult<CreatedIssue>> => {
    // Build issue data
    const issueData = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      severity: formData.severity || null,
      category: formData.category || null,
      priority: formData.priority || null,
      error_message: formData.error_message || null,
      error_type: formData.error_type || null,
      system_info: formData.system_info || null,
    };

    // Get files (unless skipFiles)
    const files: File[] = skipFiles ? [] : (formData.attachments || []);
    const hasFiles = files.length > 0;

    return await serviceWorkflow<typeof issueData, CreatedIssue>({
      baseUrl: SERVICE_ENDPOINTS.issues.baseUrl,
      endpoint: '/issues/',
      method: 'POST',
      data: issueData,
      files: hasFiles ? files : undefined,
      formDataFields: { role: getBackendRole(permissionLevel) },
      healthChecks: {
        ping: true,
        sql: true,
        minio: hasFiles, // Only check MinIO if we have files
        cache: true,
      },
      // Verification config - verify SQL record and attachments after creation
      verification: {
        enabled: true,
        getEndpoint: (result) => `/issues/${result.id}`,
        compareFields: ['title', 'description', 'type', 'severity', 'category', 'priority', 'error_message', 'error_type'],
        timeout: 5000,
      },
      permissionLevel: permissionLevel,
      debug: analyticsSettings.logIssueWorkflow,
      caller: isRetry ? 'IssueCreateHandler (RETRY)' : 'IssueCreateHandler',
      callbacks: {
        onServiceAlive: () => {
          console.log('[IssueCreateHandler] ✅ Service is alive, checking dependencies...');
        },
        onServiceDown: () => {
          toast.error(t('pages.issues.createError.serviceDown'), { duration: 20000 });
        },
        onTakingLonger: () => {
          toast.info(t('pages.issues.createError.takingLonger'), { duration: 20000 });
        },
        onQuickFailure: () => {
          toast.warning(t('storageOperations.messages.connectionFailed'), { duration: 20000 });
        },
        onHealthRetry: (attempt, max) => {
          toast.info(t('storageOperations.messages.retrying', { attempt, max }), { duration: 20000 });
        },
      },
    });
  }, [permissionLevel, analyticsSettings.logIssueWorkflow, toast, t]);

  // Handle workflow result - defined BEFORE handleCreateIssue to avoid no-use-before-define warning
  const handleWorkflowResult = useCallback((result: ServiceWorkflowResult<CreatedIssue>, formData: IssueFormData) => {
    if (result.success && result.data) {
      // Success!
      toast.success(t('pages.issues.createSuccess', { code: result.data.issue_code }));

      // Warn if files were skipped due to MinIO
      if (!result.filesUploaded && formData.attachments?.length > 0) {
        toast.warning(t('pages.issues.createSuccessNoFiles'));
      }

      handleClose();
      onSuccess(result.data);
      return;
    }

    // Handle errors based on errorCode
    switch (result.errorCode) {
      case 'SERVICE_DOWN':
        // Show retry modal for service down
        setServiceError({
          formData,
          errorType: 'SERVICE_DOWN',
        });
        break;

      case 'SQL_DOWN':
        // Show retry modal for SQL down
        setServiceError({
          formData,
          errorType: 'SQL_DOWN',
        });
        break;

      case 'MINIO_UNAVAILABLE_WITH_FILES':
        // Backend returned 503 minio_unavailable - show dialog
        setMinioError({
          formData,
          filesCount: formData.attachments?.length || 0,
        });
        break;

      case 'VALIDATION_ERROR':
        setError(result.error || t('pages.issues.createError.validation'));
        toast.error(result.error || t('pages.issues.createError.validation'));
        break;

      case 'API_ERROR':
      case 'NETWORK_ERROR':
      default:
        setError(result.error || t('pages.issues.createError.generic'));
        toast.error(result.error || t('pages.issues.createError.generic'));
        break;
    }
  }, [t, toast, handleClose, onSuccess]);

  const handleCreateIssue = useCallback(async (formData: IssueFormData, skipFiles = false) => {
    setError(null);
    setIsCreating(true);

    try {
      const result = await callWorkflow(formData, skipFiles);
      handleWorkflowResult(result, formData);
    } catch (err) {
      console.error('[IssueCreateHandler] Unexpected error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      toast.error(t('pages.issues.createError.generic'));
    } finally {
      setIsCreating(false);
    }
  }, [callWorkflow, handleWorkflowResult, t, toast]);

  // ─────────────────────────────────────────────────────────────────
  // MINIO ERROR HANDLERS
  // ─────────────────────────────────────────────────────────────────

  const handleCreateWithoutFiles = useCallback(async () => {
    if (!minioError) return;

    setMinioError(null);
    await handleCreateIssue(minioError.formData, true);
  }, [minioError, handleCreateIssue]);

  const handleRetryWithFiles = useCallback(async () => {
    if (!minioError) return;

    console.log('[IssueCreateHandler] 🔄 MinIO RETRY triggered - attempting to upload files...');
    setIsRetrying(true);

    try {
      const result = await callWorkflow(minioError.formData, false, true);

      if (result.success && result.data) {
        // Success! Close MinIO modal and show success
        setMinioError(null);
        toast.success(t('pages.issues.createSuccess', { code: result.data.issue_code }));

        if (!result.filesUploaded && minioError.formData.attachments?.length > 0) {
          toast.warning(t('pages.issues.createSuccessNoFiles'));
        }

        handleClose();
        onSuccess(result.data);
      } else if (result.errorCode === 'MINIO_UNAVAILABLE_WITH_FILES') {
        // MinIO still down - keep modal open, just stop spinner
        // minioError stays the same, modal stays visible
        console.log('[IssueCreateHandler] MinIO still unavailable - keeping modal open');
      } else {
        // Different error - show generic error, close MinIO modal
        setMinioError(null);
        setError(result.error || t('pages.issues.createError.generic'));
        toast.error(result.error || t('pages.issues.createError.generic'));
      }
    } catch (err) {
      // Network error etc - keep modal open
      console.error('[IssueCreateHandler] MinIO retry failed:', err);
      toast.error(t('pages.issues.createError.generic'));
    } finally {
      setIsRetrying(false);
    }
  }, [minioError, callWorkflow, t, toast, handleClose, onSuccess]);

  // ─────────────────────────────────────────────────────────────────
  // SERVICE ERROR HANDLERS
  // ─────────────────────────────────────────────────────────────────

  const handleRetryService = useCallback(async () => {
    if (!serviceError) return;

    console.log('[IssueCreateHandler] 🔄 MANUAL RETRY triggered - attempting to reconnect...');
    setIsRetryingService(true);

    try {
      const result = await callWorkflow(serviceError.formData, false, true);

      if (result.success && result.data) {
        // Success! Close retry modal and show success
        setServiceError(null);
        toast.success(t('pages.issues.createSuccess', { code: result.data.issue_code }));

        if (!result.filesUploaded && serviceError.formData.attachments?.length > 0) {
          toast.warning(t('pages.issues.createSuccessNoFiles'));
        }

        handleClose();
        onSuccess(result.data);
      } else if (result.errorCode === 'SERVICE_DOWN' || result.errorCode === 'SQL_DOWN') {
        // Still down - keep modal open, just stop spinner
        // serviceError stays the same, modal stays visible
      } else {
        // Different error - show generic error, close service modal
        setServiceError(null);
        setError(result.error || t('pages.issues.createError.generic'));
        toast.error(result.error || t('pages.issues.createError.generic'));
      }
    } catch (err) {
      // Network error etc - keep modal open
      console.error('[IssueCreateHandler] Retry failed:', err);
      toast.error(t('pages.issues.createError.generic'));
    } finally {
      setIsRetryingService(false);
    }
  }, [serviceError, callWorkflow, t, toast, handleClose, onSuccess]);

  // ─────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Type Select Modal */}
      <IssueTypeSelectModal
        isOpen={isTypeSelectOpen}
        onClose={() => setIsTypeSelectOpen(false)}
        onSelectType={handleTypeSelect}
        modalId="issue-create-type-select"
      />

      {/* Create Issue Modal */}
      <CreateIssueModal
        isOpen={isOpen}
        onClose={handleClose}
        onSubmit={handleCreateIssue}
        initialData={issueInitialData}
        showRoleTabs={false}
        userRole={getBackendRole(permissionLevel)}
        modalId="issue-create-modal"
        isLoading={isCreating}
      />

      {/* MinIO Unavailable Dialog */}
      {minioError && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setMinioError(null)}
          onConfirm={handleCreateWithoutFiles}
          title={t('pages.issues.minioCreateError.title')}
          message={t('pages.issues.minioCreateError.message', { count: minioError.filesCount })}
          confirmButtonLabel={t('pages.issues.minioCreateError.createWithoutFiles')}
          cancelButtonLabel={t('pages.issues.minioCreateError.cancel')}
          secondaryButtonLabel={t('pages.issues.minioCreateError.retryWithFiles')}
          onSecondary={handleRetryWithFiles}
          isSecondaryLoading={isRetrying}
        />
      )}

      {/* Service Unavailable Dialog (Issues Service or SQL down) */}
      {serviceError && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setServiceError(null)}
          onConfirm={handleRetryService}
          title={t('pages.issues.createError.title')}
          message={t('pages.issues.createError.serviceUnavailable')}
          confirmButtonLabel={t('pages.issues.createError.retry')}
          cancelButtonLabel={t('common.cancel')}
          isLoading={isRetryingService}
        />
      )}

      {/* Generic Error Dialog */}
      {error && !minioError && !serviceError && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setError(null)}
          onConfirm={() => setError(null)}
          title={t('pages.issues.createError.title')}
          message={error}
          confirmButtonLabel={t('common.ok')}
          cancelButtonLabel=""
          isDanger={true}
        />
      )}
    </>
  );
}

// ============================================================
// HOOK FOR EXTERNAL CONTROL
// ============================================================

/**
 * Hook to control IssueCreateHandler from parent component.
 *
 * @example
 * ```tsx
 * const createHandler = useIssueCreateHandler({
 *   onSuccess: (issue) => {
 *     refreshList();
 *     toast.success(`Created: ${issue.issue_code}`);
 *   }
 * });
 *
 * // Open type select modal
 * <Button onClick={createHandler.openTypeSelect}>New Issue</Button>
 *
 * // Open create modal directly with type
 * <Button onClick={() => createHandler.openCreate({ type: 'bug' })}>Report Bug</Button>
 *
 * // Render the handler
 * {createHandler.render()}
 * ```
 */
export function useIssueCreateHandler(props: Omit<IssueCreateHandlerProps, 'isOpen' | 'onClose'>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTypeSelectOpen, setIsTypeSelectOpen] = useState(false);
  const [initialData, setInitialData] = useState<InitialIssueData>({});

  const openTypeSelect = useCallback(() => {
    setIsTypeSelectOpen(true);
  }, []);

  const openCreate = useCallback((data?: InitialIssueData) => {
    setInitialData(data || {});
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setIsTypeSelectOpen(false);
  }, []);

  const render = useCallback(() => (
    <IssueCreateHandler
      {...props}
      isOpen={isOpen}
      onClose={close}
      showTypeSelect={false}
      initialData={initialData}
    />
  ), [props, isOpen, close, initialData]);

  return {
    isOpen,
    isTypeSelectOpen,
    openTypeSelect,
    openCreate,
    close,
    render,
  };
}
