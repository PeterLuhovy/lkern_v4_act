/*
 * ================================================================
 * FILE: useServiceWorkflow.ts
 * PATH: /packages/config/src/hooks/useServiceWorkflow/useServiceWorkflow.ts
 * DESCRIPTION: React hook wrapper for serviceWorkflow with automatic
 *              toast notifications. Eliminates callback duplication
 *              across pages - pages only provide endpoint & data.
 * VERSION: v1.0.0
 * CREATED: 2025-12-04
 * UPDATED: 2025-12-04
 *
 * USAGE:
 *   const { execute } = useServiceWorkflow();
 *
 *   // Simple call with universal toasts
 *   const result = await execute({
 *     baseUrl: SERVICE_ENDPOINTS.issues.baseUrl,
 *     endpoint: `/issues/${id}`,
 *     method: 'PUT',
 *     data: updates,
 *   });
 *
 *   // With page-specific messages (override defaults)
 *   const result = await execute({
 *     baseUrl: SERVICE_ENDPOINTS.issues.baseUrl,
 *     endpoint: `/issues/${id}`,
 *     method: 'PUT',
 *     data: updates,
 *   }, {
 *     serviceDown: t('pages.issues.updateError.serviceDown'),
 *   });
 * ================================================================
 */

import { useCallback } from 'react';
import { useTranslation } from '../../translations';
import { useToast } from '../useToast';
import { serviceWorkflow, ServiceWorkflowConfig, ServiceWorkflowResult } from '../../utils/serviceWorkflow';

// ============================================================
// TYPES
// ============================================================

/**
 * Optional message overrides for page-specific translations.
 * If not provided, uses universal translations from storageOperations.messages.
 */
export interface ServiceWorkflowMessages {
  /** Message when service doesn't respond after all retries */
  serviceDown?: string;
  /** Message when SQL database is unavailable */
  sqlDown?: string;
  /** Message when operation takes longer than expected */
  takingLonger?: string;
}

/**
 * Simplified config for execute() - callbacks handled automatically.
 * Extends ServiceWorkflowConfig but makes callbacks optional (provided by hook).
 */
export type ExecuteConfig<TData = unknown, TResult = unknown> = Omit<
  ServiceWorkflowConfig<TData, TResult>,
  'callbacks'
> & {
  /** Additional callbacks (merged with default toast callbacks) */
  callbacks?: ServiceWorkflowConfig<TData, TResult>['callbacks'];
};

export interface UseServiceWorkflowReturn {
  /**
   * Execute service workflow with automatic toast notifications.
   *
   * @param config - Workflow configuration (baseUrl, endpoint, method, data, etc.)
   * @param messages - Optional page-specific message overrides
   * @returns Workflow result with success/error status
   */
  execute: <TData = unknown, TResult = unknown>(
    config: ExecuteConfig<TData, TResult>,
    messages?: ServiceWorkflowMessages
  ) => Promise<ServiceWorkflowResult<TResult>>;
}

// ============================================================
// HOOK IMPLEMENTATION
// ============================================================

/**
 * React hook that wraps serviceWorkflow with automatic toast notifications.
 *
 * Why: Eliminates callback duplication across pages. Each page only needs to
 * provide endpoint-specific config (baseUrl, endpoint, method, data).
 *
 * Features:
 * - Universal toast callbacks for connection states (quickFailure, retrying)
 * - Page-specific message overrides for serviceDown, sqlDown, takingLonger
 * - Falls back to universal translations from storageOperations.messages
 * - Preserves all serviceWorkflow features (health checks, retry, verification)
 *
 * @returns Object with execute function
 *
 * @example
 * ```tsx
 * function IssuesPage() {
 *   const { execute } = useServiceWorkflow();
 *   const { t } = useTranslation();
 *
 *   const handleSave = async (data) => {
 *     const result = await execute({
 *       baseUrl: SERVICE_ENDPOINTS.issues.baseUrl,
 *       endpoint: `/issues/${id}`,
 *       method: 'PUT',
 *       data,
 *       healthChecks: { ping: true, sql: true, minio: false },
 *       debug: true,
 *       caller: 'Issues.handleSave',
 *     }, {
 *       // Optional: override default message
 *       serviceDown: t('pages.issues.updateError.serviceDown'),
 *     });
 *
 *     if (result.success) {
 *       toast.success('Saved!');
 *     }
 *   };
 * }
 * ```
 */
export function useServiceWorkflow(): UseServiceWorkflowReturn {
  const { t } = useTranslation();
  const toast = useToast();

  const execute = useCallback(
    async <TData = unknown, TResult = unknown>(
      config: ExecuteConfig<TData, TResult>,
      messages?: ServiceWorkflowMessages
    ): Promise<ServiceWorkflowResult<TResult>> => {
      // Build callbacks with universal defaults + optional overrides
      const defaultCallbacks: ServiceWorkflowConfig<TData, TResult>['callbacks'] = {
        // Service alive - just log (no toast needed)
        onServiceAlive: () => {
          console.log('[useServiceWorkflow] Service is alive');
        },

        // Service down after all retries - error toast
        onServiceDown: () => {
          const message = messages?.serviceDown || t('storageOperations.messages.serviceDown');
          toast.error(message, { duration: 20000 });
        },

        // Taking longer than expected - info toast
        onTakingLonger: () => {
          const message = messages?.takingLonger || t('storageOperations.messages.takingLonger');
          toast.info(message, { duration: 20000 });
        },

        // Quick failure (connection failed) - warning toast
        // Always uses universal translation (no override needed)
        onQuickFailure: () => {
          toast.warning(t('storageOperations.messages.connectionFailed'), { duration: 20000 });
        },

        // Retry attempt - info toast
        // Always uses universal translation (no override needed)
        onHealthRetry: (attempt: number, max: number) => {
          toast.info(t('storageOperations.messages.retrying', { attempt, max }), { duration: 20000 });
        },

        // Error callback - for SQL down, verification failed, etc.
        onError: (error: string, errorCode: string) => {
          if (errorCode === 'SQL_DOWN') {
            const message = messages?.sqlDown || t('storageOperations.messages.sqlDown');
            toast.error(message, { duration: 20000 });
          } else if (errorCode === 'VERIFICATION_FAILED') {
            // Critical: Data was sent but not saved correctly!
            toast.error(t('storageOperations.messages.verificationFailed'), { duration: 20000 });
          }
          // Other errors handled by caller
        },
      };

      // Merge default callbacks with any additional callbacks from config
      const mergedCallbacks = {
        ...defaultCallbacks,
        ...config.callbacks,
      };

      // Execute workflow with merged callbacks
      return serviceWorkflow<TData, TResult>({
        ...config,
        callbacks: mergedCallbacks,
      });
    },
    [t, toast]
  );

  return { execute };
}
