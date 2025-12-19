
/*
 * ================================================================
 * FILE: Issues.tsx
 * PATH: /apps/web-ui/src/pages/Issues/Issues.tsx
 * DESCRIPTION: Issues page with FilteredDataGrid (soft/hard delete workflow)
 * VERSION: v1.6.5
 * UPDATED: 2025-12-09
 * CHANGELOG:
 *   v1.6.5 - Fixed error state not clearing + added fetch timeout:
 *            1. Error now always clears on successful fetch (fixed stale closure)
 *            2. Fetch timeout 10s (was browser default 30-60s)
 *   v1.6.4 - Added proper loading states to DataGrid:
 *            1. Shows "Načítavam dáta..." spinner during initial load
 *            2. Shows "Trvá to dlhšie ako obvykle..." after 5 seconds
 *            3. Filter panel + DataGrid always visible (no blank screen)
 *   v1.6.3 - Fixed 3 issues:
 *            1. Error warning now clears automatically when service becomes available
 *            2. Filter panel + DataGrid now visible even when service down/loading
 *            3. Error shown in DataGrid instead of replacing entire page
 *   v1.6.2 - Fixed logFetchCalls checkbox stale closure bug: setInterval was capturing
 *            old function reference. Now using useRef to always read current value.
 *            Checkbox toggle works immediately without page refresh.
 *   v1.6.1 - Fixed logFetchCalls: changed from let variable to useAnalyticsSettings() hook.
 *   v1.6.0 - Added auto-refresh every 1 second for DataGrid, ViewModal, and EditModals
 *   v1.5.0 - Migrated permanent delete to serviceWorkflow with:
 *            - Pre-delete verification (detects orphaned attachments)
 *            - Auto-issue creation for data integrity problems via defaultDataIntegrityHandler
 *   v1.4.0 - Refactored to useServiceWorkflow hook (eliminates callback duplication)
 *   v1.3.0 - Migrated from local issueWorkflow to universal serviceWorkflow from @l-kern/config
 * ================================================================
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { BasePage, PageHeader, FilteredDataGrid, IssueTypeSelectModal, ConfirmModal, ExportButton, ExportProgressModal } from '@l-kern/ui-components';
import type { ExportFile, ExportProgress } from '@l-kern/ui-components';
import type { FilterConfig, QuickFilterConfig } from '@l-kern/ui-components';
import { useTranslation, useAuthContext, useTheme, useToast, useAnalyticsSettings, COLORS, formatDateTime, formatDate, checkMultipleStoragesHealth, useServiceWorkflow, serviceWorkflow, SERVICE_ENDPOINTS, SYSTEM_USER_ID, defaultDataIntegrityHandler, prepareExportDestination, writeToFileHandle, triggerAutomaticDownload, type CreatedIssue } from '@l-kern/config';
import { DeletionAuditModal } from './DeletionAuditModal';
import { IssueViewModal } from './IssueViewModal';
import { IssueCreateHandler } from './IssueCreateHandler';
import styles from './Issues.module.css';

// ============================================================
// DATA TYPES
// ============================================================

type IssueType = 'bug' | 'feature' | 'improvement' | 'question';
type IssueSeverity = 'minor' | 'moderate' | 'major' | 'blocker';
type IssueStatus = 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed' | 'rejected';
type IssuePriority = 'low' | 'medium' | 'high' | 'critical';

interface Attachment {
  file_name: string;
  file_path: string;
  file_size: number;
  content_type: string;
  uploaded_at: string;
}

interface Issue {
  id: string;
  issue_code: string;
  title: string;
  description: string;
  type: IssueType;
  severity: IssueSeverity;
  status: IssueStatus;
  priority: IssuePriority;
  reporter_id: string;
  assignee_id?: string;
  created_at: string;
  updated_at?: string;
  resolved_at?: string;
  closed_at?: string;
  deleted_at: string | null;
  deletion_audit_id?: number | null;
  // Developer fields (variant C)
  error_message?: string;
  error_type?: string;
  // System info JSON object (contains browser, os, url, etc.)
  system_info?: {
    browser?: string;
    os?: string;
    url?: string;
    viewport?: string;
    screen?: string;
    timestamp?: string;
    userAgent?: string;
  };
  // Attachments
  attachments?: Attachment[];
  // Additional fields
  category?: string;
  resolution?: string;
}

// ============================================================
// API CONFIGURATION
// ============================================================

const API_BASE_URL = 'http://localhost:4105'; // Issues Service REST API port (127.0.0.1 = IPv4, bypasses WSL relay on ::1 IPv6)

// ============================================================
// COMPONENT
// ============================================================

export function Issues() {
  const { t, language } = useTranslation();
  const { user, permissionLevel, permissions } = useAuthContext();
  const { theme } = useTheme();
  const toast = useToast();
  const { execute: executeWorkflow } = useServiceWorkflow();
  const analyticsSettings = useAnalyticsSettings();

  // Get debug settings from AnalyticsContext (reactive - updates when checkbox changes)
  const logPermissions = analyticsSettings.logPermissions;
  const logFetchCalls = analyticsSettings.logFetchCalls;

  // Use refs for values that need to be read in setInterval callbacks (stale closure prevention)
  const logFetchCallsRef = useRef(logFetchCalls);
  const logPermissionsRef = useRef(logPermissions);

  // Keep refs in sync with current values
  useEffect(() => {
    logFetchCallsRef.current = logFetchCalls;
    logPermissionsRef.current = logPermissions;
  }, [logFetchCalls, logPermissions]);

  // Authorization checks - Use centralized permissions from context (DRY)
  const { canEdit, canDelete, canExport, canViewDeleted } = permissions;
  const canCreate = true; // SPECIAL: All users can report issues (Bug Reports)

  // Log authorization changes only when permission level changes (if logPermissions enabled)
  useEffect(() => {
    if (logPermissions) {
      console.log('[Issues] 🔐 Permission level:', permissionLevel);
      console.log('[Issues] 🔐 Authorization:', { canCreate, canEdit, canDelete, canExport, canViewDeleted });
    }
  }, [permissionLevel, canCreate, canEdit, canDelete, canExport, canViewDeleted, logPermissions]); // Only run when permissions change

  // State management
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSlow, setLoadingSlow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Modal states
  const [isTypeSelectOpen, setIsTypeSelectOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [initialIssueData, setInitialIssueData] = useState<{
    type?: IssueType;
    browser?: string;
    os?: string;
    url?: string;
    description?: string;
    system_info?: Record<string, unknown>;
  }>({});
  const [issueToDelete, setIssueToDelete] = useState<Issue | null>(null);
  const [issueToRestore, setIssueToRestore] = useState<Issue | null>(null);
  const [issueToPermanentlyDelete, setIssueToPermanentlyDelete] = useState<Issue | null>(null);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [selectedAuditIssueId, setSelectedAuditIssueId] = useState<string | null>(null);

  // View modal state
  const [issueToView, setIssueToView] = useState<Issue | null>(null);

  // Attachment availability tracking: Map<issueId, Map<fileName, status>>
  type AttachmentStatus = 'checking' | 'available' | 'unavailable' | 'error';
  const [attachmentStatus, setAttachmentStatus] = useState<Map<string, Map<string, AttachmentStatus>>>(new Map());

  // Bulk delete states
  const [bulkDeleteType, setBulkDeleteType] = useState<'soft' | 'hard' | 'mixed' | null>(null);
  const [bulkDeleteCounts, setBulkDeleteCounts] = useState({ active: 0, deleted: 0 });

  // MinIO unavailable - items that failed delete (unified for single and bulk)
  const [minioFailedItems, setMinioFailedItems] = useState<Issue[]>([]);

  // Loading state for retry operations (stays on same modal)
  const [isRetryingDelete, setIsRetryingDelete] = useState(false);

  // Loading state for permanent delete confirmation
  const [isPermanentDeleting, setIsPermanentDeleting] = useState(false);

  // Loading state for bulk delete operation
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Update error modal state (service down during edit)
  const [updateError, setUpdateError] = useState<{
    issueId: string;
    updates: Record<string, unknown>;
    permissionLevel: number;
    errorType: 'SERVICE_DOWN' | 'SQL_DOWN';
  } | null>(null);
  const [isRetryingUpdate, setIsRetryingUpdate] = useState(false);

  // ZIP export states
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [isRetryingExport, setIsRetryingExport] = useState(false);
  // Export progress tracking (uses ExportProgress and ExportFile from ui-components)
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [exportFiles, setExportFiles] = useState<ExportFile[]>([]);
  // Ref to track if export was cancelled (prevents success toast after cancel)
  const exportCancelledRef = useRef(false);
  const [minioExportUnavailable, setMinioExportUnavailable] = useState<{
    selectedIssues: Issue[];
    attachmentsCount: number;
  } | null>(null);
  // Export errors modal - shows after ZIP export with errors
  const [exportErrors, setExportErrors] = useState<{
    deletedRecords: string[];       // Issue codes that were deleted (404)
    missingAttachments: string[];   // Attachments that were not found (404)
    minioErrors: string[];          // Issue codes where MinIO download failed
    successCount: number;           // How many exported successfully
    selectedIssues: Issue[];        // Original selection for retry
    pendingZipBlob?: Blob;          // ZIP blob waiting for user confirmation
    zipFileName?: string;           // ZIP file name
  } | null>(null);

  // ============================================================
  // FETCH ISSUES FROM API
  // ============================================================

  const fetchIssues = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
        setLoadingSlow(false);
        setError(null);

        // Clear any existing timeout
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }

        // Set timeout to show "taking longer than usual" after 5 seconds
        loadingTimeoutRef.current = setTimeout(() => {
          setLoadingSlow(true);
        }, 5000);
      }

      // If user can view deleted, fetch ALL issues (including deleted) from backend
      // FilteredDataGrid will handle showing/hiding based on toggle
      const endpoint = canViewDeleted
        ? '/issues/?include_deleted=true'
        : '/issues/';

      // Log fetch call if debug setting enabled (use ref for setInterval compatibility)
      if (logFetchCallsRef.current) {
        console.log(`[Issues] 📡 FETCH ${SERVICE_ENDPOINTS.issues.baseUrl}${endpoint} | Permission Level: ${permissionLevel}`);
      }

      // Use serviceWorkflow with cache enabled (30s TTL = matches auto-refresh interval)
      const result = await serviceWorkflow<unknown, Issue[]>({
        baseUrl: SERVICE_ENDPOINTS.issues.baseUrl,
        endpoint,
        method: 'GET',
        headers: {
          'X-Permission-Level': String(permissionLevel),
        },
        cache: {
          enabled: true,
          ttl: 30000, // 30 seconds (same as auto-refresh interval)
        },
        debug: logFetchCallsRef.current,
      });

      if (!result.success || !result.data) {
        throw new Error(result.error || t('pages.issues.fetchError'));
      }

      const data = result.data;

      // Log response if debug setting enabled (use ref for setInterval compatibility)
      if (logFetchCallsRef.current) {
        console.log(`[Issues] 📡 RESPONSE: ${data.length} issues loaded`);
      }

      // Add computed 'isActive' field (inverted from 'deleted_at')
      // FilteredDataGrid expects 'true' = active, but deleted_at !== null means inactive
      const issuesWithActive = data.map((issue: Issue) => ({
        ...issue,
        isActive: issue.deleted_at === null,
      }));

      setIssues(issuesWithActive);

      // Clear loading states on success
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      setLoading(false);
      setLoadingSlow(false);

      // ALWAYS clear error on successful fetch (even during background refresh)
      // This ensures warning disappears when service becomes available
      // Note: Always call setError(null), not conditionally - avoids stale closure issues
      setError(null);

      // Auto-update issueToView if modal is open (for auto-refresh)
      setIssueToView((currentIssue) => {
        if (!currentIssue) return null;
        const updated = issuesWithActive.find((i: Issue) => i.id === currentIssue.id);
        return updated || currentIssue;
      });

      // NOTE: Don't clear attachment status cache on every refresh
      // Cache is only cleared for specific issue when its attachments change
      // This prevents excessive HEAD requests every 5s
    } catch (err) {
      console.error('[Issues] Error fetching issues:', err);

      // Clear loading timeout on error
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }

      // Stop loading, show error
      setLoading(false);
      setLoadingSlow(false);
      setError(err instanceof Error ? err.message : t('pages.issues.fetchError'));
    }
  }, [canViewDeleted, permissionLevel, t]);

  useEffect(() => {
    fetchIssues(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-refresh every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      fetchIssues(false);
    }, 1000);

    return () => clearInterval(interval);
  }, [fetchIssues]);

  // Re-fetch when permission level changes (Ctrl+1-9 shortcuts)
  // This ensures field visibility updates immediately
  useEffect(() => {
    // Skip initial render (handled by effect above)
    fetchIssues(false);
    if (logFetchCallsRef.current) {
      console.log(`[Issues] 🔄 Permission level changed to ${permissionLevel}, refreshing data...`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionLevel]); // Only re-fetch on permission level change, not on logFetchCalls change

  // ============================================================
  // ATTACHMENT AVAILABILITY CHECK
  // ============================================================

  // Track when each issue's attachments were last checked (for TTL)
  const attachmentCheckTimestamps = useRef<Map<string, number>>(new Map());
  // Track issues currently being checked (prevent duplicate calls)
  const attachmentCheckInProgress = useRef<Set<string>>(new Set());
  // TTL for attachment status cache (60 seconds)
  const ATTACHMENT_CHECK_TTL = 60 * 1000;

  /**
   * Check if attachments are available in MinIO using HEAD request.
   * Called when a row is expanded and has attachments.
   * Re-checks every 60 seconds (TTL-based cache).
   */
  const checkAttachmentAvailability = async (issue: Issue) => {
    if (!issue.attachments || issue.attachments.length === 0) return;

    // Check if already in progress
    if (attachmentCheckInProgress.current.has(issue.id)) return;

    // Check if cache is still valid (within TTL)
    const lastCheck = attachmentCheckTimestamps.current.get(issue.id);
    const now = Date.now();
    if (lastCheck && (now - lastCheck) < ATTACHMENT_CHECK_TTL) {
      return; // Cache still valid, skip check
    }

    // Mark as in progress
    attachmentCheckInProgress.current.add(issue.id);
    attachmentCheckTimestamps.current.set(issue.id, now);

    // Initialize status map for this issue
    const statusMap = new Map<string, AttachmentStatus>();
    issue.attachments.forEach(att => statusMap.set(att.file_name, 'checking'));
    setAttachmentStatus(prev => new Map(prev).set(issue.id, statusMap));

    // Check each attachment with HEAD request
    for (const attachment of issue.attachments) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/issues/${issue.id}/attachments/${encodeURIComponent(attachment.file_name)}`,
          { method: 'HEAD' }
        );

        // Determine status based on HTTP response code:
        // 200 = file exists, 404 = file missing, 503 = MinIO service down
        let newStatus: AttachmentStatus;
        if (response.ok) {
          newStatus = 'available';
        } else if (response.status === 404) {
          newStatus = 'unavailable'; // File doesn't exist in storage
          // Note: 404 is expected for deleted files, log only at debug level
          console.debug(`[Issues] Attachment ${attachment.file_name} not found (404)`);
        } else if (response.status === 503) {
          newStatus = 'error'; // MinIO service unavailable
          console.debug(`[Issues] MinIO unavailable for ${attachment.file_name} (503)`);
        } else {
          newStatus = 'error'; // Other server error
          console.debug(`[Issues] Attachment check failed for ${attachment.file_name}: ${response.status}`);
        }

        setAttachmentStatus(prev => {
          const newMap = new Map(prev);
          const issueMap = new Map(newMap.get(issue.id) || new Map());
          issueMap.set(attachment.file_name, newStatus);
          newMap.set(issue.id, issueMap);
          return newMap;
        });
      } catch {
        // Network error - can't reach backend (silent, expected in some cases)
        setAttachmentStatus(prev => {
          const newMap = new Map(prev);
          const issueMap = new Map(newMap.get(issue.id) || new Map());
          issueMap.set(attachment.file_name, 'error');
          newMap.set(issue.id, issueMap);
          return newMap;
        });
      }
    }

    // Mark as completed
    attachmentCheckInProgress.current.delete(issue.id);
  };

  // ============================================================
  // STATUS COLORS (for FilteredDataGrid statusColors prop)
  // ============================================================

  const statusColors = {
    open: COLORS.status.warning,       // Orange
    assigned: COLORS.status.info,      // Blue
    in_progress: COLORS.brand.primary, // Purple
    resolved: COLORS.status.success,   // Green
    closed: COLORS.status.muted,       // Gray
    rejected: COLORS.status.error,     // Red
    deleted: theme === 'light' ? COLORS.status.inactiveLight : COLORS.status.inactive, // Deleted items - theme-aware red
  };

  // STATUS LABELS (for DataGrid statusLabels prop - legend)
  const statusLabels = {
    open: t('pages.issues.filters.statusOpen'),
    assigned: t('pages.issues.filters.statusAssigned'),
    in_progress: t('pages.issues.filters.statusInProgress'),
    resolved: t('pages.issues.filters.statusResolved'),
    closed: t('pages.issues.filters.statusClosed'),
    rejected: t('pages.issues.filters.statusRejected'),
  };

  // ============================================================
  // FILTERS
  // ============================================================

  const filters: FilterConfig[] = [
    {
      field: 'type',
      title: t('pages.issues.filters.typeTitle'),
      options: [
        { value: 'bug', label: t('pages.issues.filters.typeBug') },
        { value: 'feature', label: t('pages.issues.filters.typeFeature') },
        { value: 'improvement', label: t('pages.issues.filters.typeImprovement') },
        { value: 'question', label: t('pages.issues.filters.typeQuestion') },
      ],
    },
    {
      field: 'severity',
      title: t('pages.issues.filters.severityTitle'),
      options: [
        { value: 'minor', label: t('pages.issues.filters.severityMinor') },
        { value: 'moderate', label: t('pages.issues.filters.severityModerate') },
        { value: 'major', label: t('pages.issues.filters.severityMajor') },
        { value: 'blocker', label: t('pages.issues.filters.severityBlocker') },
      ],
    },
    {
      field: 'status',
      title: t('pages.issues.filters.statusTitle'),
      options: [
        { value: 'open', label: t('pages.issues.filters.statusOpen') },
        { value: 'assigned', label: t('pages.issues.filters.statusAssigned') },
        { value: 'in_progress', label: t('pages.issues.filters.statusInProgress') },
        { value: 'resolved', label: t('pages.issues.filters.statusResolved') },
        { value: 'closed', label: t('pages.issues.filters.statusClosed') },
        { value: 'rejected', label: t('pages.issues.filters.statusRejected') },
      ],
    },
    {
      field: 'priority',
      title: t('pages.issues.filters.priorityTitle'),
      options: [
        { value: 'low', label: t('pages.issues.filters.priorityLow') },
        { value: 'medium', label: t('pages.issues.filters.priorityMedium') },
        { value: 'high', label: t('pages.issues.filters.priorityHigh') },
        { value: 'critical', label: t('pages.issues.filters.priorityCritical') },
      ],
    },
  ];

  // ============================================================
  // QUICK FILTERS
  // ============================================================

  const quickFilters: QuickFilterConfig[] = [
    {
      id: 'blockers',
      label: t('pages.issues.quickFilters.blockers'),
      filterFn: (item: Issue) => item.severity === 'blocker',
    },
    {
      id: 'my-issues',
      label: t('pages.issues.quickFilters.myIssues'),
      filterFn: (item: Issue) => item.assignee_id === '550e8400-e29b-41d4-a716-446655440020', // TODO: Get from auth
    },
    {
      id: 'system-issues',
      label: t('pages.issues.quickFilters.systemIssues'),
      filterFn: (item: Issue) => item.reporter_id === SYSTEM_USER_ID,
    },
    {
      id: 'unassigned',
      label: t('pages.issues.quickFilters.unassigned'),
      filterFn: (item: Issue) => !item.assignee_id,
    },
  ];

  // ============================================================
  // COLUMNS
  // ============================================================

  const columns = [
    {
      title: t('pages.issues.columns.issue_code'),
      field: 'issue_code',
      sortable: true,
      width: 150,
      render: (value: string, row: Issue) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Delete pending (waiting for cleanup) = ⚠️⚠️ (two warnings) */}
          {row.deletion_audit_id && (
            <span role="img" aria-label={t('issues.deletionAudit.deletionPending')} style={{ color: 'var(--color-status-error, #f44336)', fontSize: '1.1em' }} title={t('issues.deletionAudit.deletionPending')}>⚠️⚠️</span>
          )}
          {/* Soft deleted (but not pending) = ⚠️ (one warning) */}
          {row.deleted_at !== null && !row.deletion_audit_id && (
            <span role="img" aria-label={t('issues.deletionAudit.softDeleted')} style={{ color: 'var(--color-status-warning, #FF9800)', fontSize: '1.1em' }} title={t('issues.deletionAudit.softDeleted')}>⚠️</span>
          )}
          <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{value}</span>
        </span>
      ),
    },
    {
      title: t('pages.issues.columns.status'),
      field: 'status',
      sortable: true,
      width: 130,
    },
    {
      title: t('pages.issues.columns.title'),
      field: 'title',
      sortable: true,
      width: 300,
    },
    {
      title: t('pages.issues.columns.severity'),
      field: 'severity',
      sortable: true,
      width: 120,
    },
    {
      title: t('pages.issues.columns.priority'),
      field: 'priority',
      sortable: true,
      width: 100,
    },
    {
      title: t('pages.issues.columns.created_by'),
      field: 'reporter_id',
      sortable: true,
      width: 180,
      render: (value: string) => {
        const isSystem = value === SYSTEM_USER_ID;
        // TODO: When Contacts service is available, lookup user name by ID
        // Fallback: show truncated UUID if service unavailable
        const displayValue = isSystem
          ? t('pages.issues.system')
          : value
            ? `${value.substring(0, 8)}...`  // Show first 8 chars of UUID
            : '—';
        return (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: isSystem ? 'var(--color-status-info, #2196F3)' : 'inherit',
              fontWeight: isSystem ? 500 : 'normal',
            }}
            title={value || undefined}  // Full ID on hover
          >
            {isSystem ? '🤖' : '👤'}
            <span>{displayValue}</span>
          </span>
        );
      },
    },
    {
      title: t('pages.issues.columns.created_at'),
      field: 'created_at',
      sortable: true,
      width: 120,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  // ============================================================
  // ACTIONS
  // ============================================================

  const actions = [
    {
      label: '👁️',
      title: t('common.viewEdit'),
      onClick: (item: Issue) => {
        setIssueToView(item);
      },
      variant: 'primary' as const,
      // View/Edit is always visible for all users (edit controls inside modal)
    },
    {
      label: '🗑️',
      title: t('common.delete'),
      onClick: (item: Issue) => {
        setIssueToDelete(item);
      },
      variant: 'danger' as const,
      disabled: (item: Issue) => !canDelete || !!item.deletion_audit_id, // Disabled if no permission or pending deletion
      hidden: (item: Issue) => item.deleted_at !== null, // Hidden for soft-deleted items
    },
    {
      label: '↩️',
      title: t('common.restore'),
      onClick: (item: Issue) => {
        setIssueToRestore(item);
      },
      variant: 'primary' as const,
      disabled: (item: Issue) => !canDelete || !!item.deletion_audit_id, // Disabled if no permission or pending deletion
      hidden: (item: Issue) => item.deleted_at === null, // Hidden for active items (only show for soft-deleted)
    },
    {
      label: '💀',
      title: t('common.permanentDelete'),
      onClick: (item: Issue) => {
        setIssueToPermanentlyDelete(item);
      },
      variant: 'danger' as const,
      disabled: (item: Issue) => !canDelete || !!item.deletion_audit_id, // Disabled if no permission or pending deletion
      hidden: (item: Issue) => item.deleted_at === null, // Hidden for active items (only show for soft-deleted)
    },
    {
      label: '🔍',
      title: t('issues.deletionAudit.viewAuditLog'),
      onClick: (item: Issue) => {
        setSelectedAuditIssueId(item.id);
        setAuditModalOpen(true);
      },
      variant: 'secondary' as const,
      hidden: (item: Issue) => !item.deletion_audit_id, // Only show if deletion failed
    },
  ];

  // ============================================================
  // EXPANDED CONTENT
  // ============================================================

  const renderExpandedContent = (item: Issue) => {
    // Check attachment availability when expanded (non-blocking)
    // Uses setTimeout(0) to schedule outside of render cycle - prevents React warning
    // TTL-based cache (60s) handled inside checkAttachmentAvailability
    if (item.attachments && item.attachments.length > 0) {
      setTimeout(() => checkAttachmentAvailability(item), 0);
    }

    // Helper to get attachment status indicator
    const getAttachmentStatusIndicator = (fileName: string): React.ReactNode => {
      const issueStatus = attachmentStatus.get(item.id);
      if (!issueStatus) return null;

      const status = issueStatus.get(fileName);
      switch (status) {
        case 'checking':
          return <span role="img" aria-label={t('pages.issues.details.attachmentChecking')} title={t('pages.issues.details.attachmentChecking')} style={{ marginLeft: '8px' }}>⏳</span>;
        case 'available':
          return <span role="img" aria-label={t('pages.issues.details.attachmentAvailable')} title={t('pages.issues.details.attachmentAvailable')} style={{ marginLeft: '8px', color: 'var(--color-status-success)' }}>✓</span>;
        case 'unavailable':
          // File is missing in MinIO (404) - red indicator
          return <span title={t('pages.issues.details.attachmentUnavailable')} style={{ marginLeft: '8px', color: 'var(--color-status-error)' }}><span role="img" aria-label="Error">❌</span> {t('pages.issues.details.attachmentMissing')}</span>;
        case 'error':
          // Service unavailable (503/network) - orange indicator
          return <span title={t('pages.issues.details.attachmentError')} style={{ marginLeft: '8px', color: 'var(--color-status-warning)' }}><span role="img" aria-label="Warning">⚠️</span> {t('pages.issues.details.attachmentServiceDown')}</span>;
        default:
          return null;
      }
    };

    // Check if attachment is unavailable
    const isAttachmentUnavailable = (fileName: string): boolean => {
      const issueStatus = attachmentStatus.get(item.id);
      if (!issueStatus) return false;
      const status = issueStatus.get(fileName);
      return status === 'unavailable' || status === 'error';
    };

    return (
    <>
      <h4>{t('pages.issues.detailsTitle', { name: item.issue_code })}</h4>

      {/* Soft Delete Warning */}
      {item.deleted_at !== null && (
        <div className={styles.deletedWarning}>
          <span role="img" aria-label="Deleted" className={styles.deletedIcon}>🗑️</span>
          <span>{t('pages.issues.details.deletedItem')}</span>
        </div>
      )}

      {/* Deletion Failed Warning */}
      {item.deletion_audit_id && (
        <div style={{
          padding: '12px',
          background: 'var(--color-status-error-light, #ffebee)',
          border: '1px solid var(--color-status-error, #f44336)',
          borderRadius: '4px',
          marginTop: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span role="img" aria-hidden="true">🔴</span>
          <span style={{ fontWeight: 600 }}>{t('issues.deletionAudit.deletionFailed')}</span>
        </div>
      )}

      {/* 4-Column Layout */}
      <div className={styles.detailsColumns}>
        {/* Column 1: Item Details */}
        <div className={styles.detailsColumn}>
          <h5>{t('pages.issues.details.itemDetails')}</h5>
          <div>
            <strong>{t('pages.issues.details.id')}:</strong>
            <span>{item.id}</span>
          </div>
          <div>
            <strong>{t('pages.issues.details.issue_code')}:</strong>
            <span>{item.issue_code}</span>
          </div>
          <div>
            <strong>{t('pages.issues.details.title')}:</strong>
            <span>{item.title}</span>
          </div>
          <div>
            <strong>{t('pages.issues.details.description')}:</strong>
            <pre className={styles.descriptionPre}>
              {item.description || ''}
            </pre>
          </div>
          <div>
            <strong>{t('pages.issues.details.reporterId')}:</strong>
            <span>{item.reporter_id}</span>
          </div>
          <div>
            <strong>{t('pages.issues.details.assigneeId')}:</strong>
            {item.assignee_id ? (
              <span>{item.assignee_id}</span>
            ) : (
              <span className={styles.notAvailable}>{t('pages.issues.details.notAvailable')}</span>
            )}
          </div>
          <div>
            <strong>{t('pages.issues.details.resolution')}:</strong>
            <pre className={styles.resolutionPre}>{item.resolution || ''}</pre>
          </div>
        </div>

        {/* Column 2: Timeline + Classification */}
        <div className={styles.detailsColumn}>
          {/* Timeline section */}
          <h5>{t('pages.issues.details.timeline')}</h5>
          <div>
            <strong>{t('pages.issues.details.created_at')}:</strong>
            <span>{formatDateTime(item.created_at, language)}</span>
          </div>
          <div>
            <strong>{t('pages.issues.details.updated')}:</strong>
            {item.updated_at ? (
              <span>{formatDateTime(item.updated_at, language)}</span>
            ) : (
              <span className={styles.notAvailable}>{t('pages.issues.details.notAvailable')}</span>
            )}
          </div>
          <div>
            <strong>{t('pages.issues.details.resolved')}:</strong>
            {item.resolved_at ? (
              <span>{formatDateTime(item.resolved_at, language)}</span>
            ) : (
              <span className={styles.notAvailable}>{t('pages.issues.details.notAvailable')}</span>
            )}
          </div>
          <div>
            <strong>{t('pages.issues.details.closed')}:</strong>
            {item.closed_at ? (
              <span>{formatDateTime(item.closed_at, language)}</span>
            ) : (
              <span className={styles.notAvailable}>{t('pages.issues.details.notAvailable')}</span>
            )}
          </div>
          <div>
            <strong>{t('pages.issues.details.deleted')}:</strong>
            {item.deleted_at ? (
              <span>{formatDateTime(item.deleted_at, language)}</span>
            ) : (
              <span className={styles.notAvailable}>{t('pages.issues.details.notAvailable')}</span>
            )}
          </div>

          <h5 className={styles.timelineHeader}>{t('pages.issues.details.classification')}</h5>
          <div className={styles.labelValueGrid}>
            <div className={styles.labelColumn}>
              <div><strong>{t('pages.issues.details.type')}:</strong></div>
              <div><strong>{t('pages.issues.details.severity')}:</strong></div>
              <div><strong>{t('pages.issues.details.status')}:</strong></div>
              <div><strong>{t('pages.issues.details.priority')}:</strong></div>
              <div><strong>{t('pages.issues.details.category')}:</strong></div>
            </div>
            <div className={styles.valueColumn}>
              <div><span>{item.type}</span></div>
              <div><span>{item.severity}</span></div>
              <div><span>{item.status}</span></div>
              <div><span>{item.priority}</span></div>
              <div>
                {item.category ? (
                  <span>{item.category}</span>
                ) : (
                  <span className={styles.notAvailable}>{t('pages.issues.details.notAvailable')}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Developer Info */}
        <div className={styles.detailsColumn}>
          <h5>{t('pages.issues.details.developerInfo')}</h5>
          {item.system_info?.browser ? (
            <div>
              <strong>{t('pages.issues.details.browser')}:</strong>
              <span>{item.system_info.browser}</span>
            </div>
          ) : (
            <div>
              <strong>{t('pages.issues.details.browser')}:</strong>
              <span className={styles.notAvailable}>{t('pages.issues.details.notAvailable')}</span>
            </div>
          )}
          {item.system_info?.os ? (
            <div>
              <strong>{t('pages.issues.details.os')}:</strong>
              <span>{item.system_info.os}</span>
            </div>
          ) : (
            <div>
              <strong>{t('pages.issues.details.os')}:</strong>
              <span className={styles.notAvailable}>{t('pages.issues.details.notAvailable')}</span>
            </div>
          )}
          {item.system_info?.url ? (
            <div>
              <strong>{t('pages.issues.details.url')}:</strong>
              <span className={styles.urlBreak}>{item.system_info.url}</span>
            </div>
          ) : (
            <div>
              <strong>{t('pages.issues.details.url')}:</strong>
              <span className={styles.notAvailable}>{t('pages.issues.details.notAvailable')}</span>
            </div>
          )}
          {item.error_type ? (
            <div>
              <strong>{t('pages.issues.details.errorType')}:</strong>
              <pre className={styles.errorTypePre}>
                {item.error_type}
              </pre>
            </div>
          ) : (
            <div>
              <strong>{t('pages.issues.details.errorType')}:</strong>
              <span className={styles.notAvailable}>{t('pages.issues.details.notAvailable')}</span>
            </div>
          )}
          <div>
            <strong>{t('pages.issues.details.errorMessage')}:</strong>
            <pre className={styles.errorMessagePre}>
              {item.error_message || ''}
            </pre>
          </div>
        </div>

        {/* Column 4: Attachments */}
        <div className={styles.detailsColumn}>
          <h5>{t('pages.issues.details.attachments')} {item.attachments && item.attachments.length > 0 ? `(${item.attachments.length})` : ''}</h5>
          {item.attachments && item.attachments.length > 0 ? (
            <div className={styles.attachmentsList}>
              {item.attachments.map((attachment, index) => {
                const unavailable = isAttachmentUnavailable(attachment.file_name);
                return (
                  <div
                    key={index}
                    className={`${styles.attachmentCard} ${unavailable ? styles.attachmentUnavailable : ''}`}
                    onClick={() => {
                      if (unavailable) {
                        toast.error(t('pages.issues.details.attachmentCannotDownload'));
                        return;
                      }
                      console.log(`[Issues] Download attachment: ${attachment.file_name}`);
                      // TODO: Implement file download
                    }}
                    title={unavailable ? t('pages.issues.details.attachmentUnavailable') : t('pages.issues.details.clickToDownload')}
                    style={unavailable ? { opacity: 0.6, cursor: 'not-allowed' } : undefined}
                  >
                    <div className={styles.attachmentFileName} style={unavailable ? { textDecoration: 'line-through' } : undefined}>
                      <span role="img" aria-label="Attachment">📎</span> {attachment.file_name}
                      {getAttachmentStatusIndicator(attachment.file_name)}
                    </div>
                    <div className={styles.attachmentMeta}>
                      <span>{(attachment.file_size / 1024).toFixed(2)} KB</span>
                      <span>•</span>
                      <span>{formatDate(attachment.uploaded_at, language)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyAttachments}>
              {t('pages.issues.details.noAttachments')}
            </div>
          )}
        </div>
      </div>
    </>
    );
  };

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleNewItem = () => {
    // All users: Show type selection modal with all 4 types
    setIsTypeSelectOpen(true);
  };

  const handleTypeSelect = (type: IssueType) => {
    setIsTypeSelectOpen(false);

    // Collect browser information (same as BasePage)
    const userAgent = navigator.userAgent;
    const url = window.location.href;

    // Parse browser name and version from userAgent
    let browserInfo = 'Unknown';
    if (userAgent.includes('Chrome')) {
      const match = userAgent.match(/Chrome\/(\d+)/);
      browserInfo = match ? `Chrome ${match[1]}` : 'Chrome';
    } else if (userAgent.includes('Firefox')) {
      const match = userAgent.match(/Firefox\/(\d+)/);
      browserInfo = match ? `Firefox ${match[1]}` : 'Firefox';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      const match = userAgent.match(/Version\/(\d+)/);
      browserInfo = match ? `Safari ${match[1]}` : 'Safari';
    } else if (userAgent.includes('Edge')) {
      const match = userAgent.match(/Edge\/(\d+)/);
      browserInfo = match ? `Edge ${match[1]}` : 'Edge';
    }

    // Parse OS from userAgent
    let osInfo = 'Unknown';
    if (userAgent.includes('Windows NT 10.0')) osInfo = 'Windows 10/11';
    else if (userAgent.includes('Windows NT 6.3')) osInfo = 'Windows 8.1';
    else if (userAgent.includes('Windows NT 6.2')) osInfo = 'Windows 8';
    else if (userAgent.includes('Windows NT 6.1')) osInfo = 'Windows 7';
    else if (userAgent.includes('Mac OS X')) {
      const match = userAgent.match(/Mac OS X (\d+[._]\d+)/);
      osInfo = match ? `macOS ${match[1].replace('_', '.')}` : 'macOS';
    } else if (userAgent.includes('Linux')) osInfo = 'Linux';

    // Build system info object
    const timestamp = new Date().toISOString();
    const viewport = `${window.innerWidth}x${window.innerHeight}`;
    const screenSize = `${window.screen.width}x${window.screen.height}`;

    const systemInfo = {
      url,
      browser: browserInfo,
      os: osInfo,
      viewport,
      screen: screenSize,
      timestamp,
      userAgent,
    };

    // Set initial data for modal
    setInitialIssueData({
      type,
      browser: browserInfo,
      os: osInfo,
      url,
      system_info: systemInfo,
    });

    // Open modal with pre-filled data
    setIsCreateModalOpen(true);
  };

  // ============================================================
  // ISSUE CREATE HANDLERS
  // ============================================================
  // NOTE: Issue creation logic moved to IssueCreateHandler component
  // See: ./IssueCreateHandler.tsx

  // ============================================================
  // EXPORT HANDLERS
  // ============================================================

  const handleExportCSV = async () => {
    if (selectedRows.size === 0) return;

    const selectedIssues = issues.filter(issue => selectedRows.has(issue.id));
    const issueIds = selectedIssues.map(issue => issue.id);
    const fileName = `issues_export_${new Date().toISOString().split('T')[0]}.csv`;

    console.log(`[Issues] 📤 Exporting ${issueIds.length} issues as CSV via backend`);

    // STEP 1: Prepare export destination BEFORE download
    const exportPrep = await prepareExportDestination({
      behavior: user.exportBehavior || 'automatic',
      fileName,
      mimeType: 'text/csv',
      suggestedExtension: '.csv',
    });

    if (!exportPrep.success) {
      console.log('[Issues] CSV export cancelled by user');
      return;
    }

    // STEP 2: Download (no loading toast - CSV export is fast)
    const result = await serviceWorkflow<{ issue_ids: string[] }, Blob>({
      baseUrl: API_BASE_URL,
      endpoint: '/issues/export?format=csv',
      method: 'POST',
      data: { issue_ids: issueIds },
      healthChecks: { ping: true, sql: true, minio: false },
      debug: analyticsSettings.logToConsole,
      showToasts: true,
      language: language,
      caller: 'IssuesExportCSV',
      responseType: 'blob',
    });

    // STEP 3: Write to destination
    if (result.success && result.data) {
      if (exportPrep.fileHandle) {
        const writeResult = await writeToFileHandle(exportPrep.fileHandle, result.data);
        if (writeResult.success) {
          toast.success(t('pages.issues.exportSuccess', { count: selectedIssues.length, format: 'CSV' }));
        } else {
          toast.error(t('pages.issues.exportFailed'));
        }
      } else {
        triggerAutomaticDownload(result.data, exportPrep.fileName);
        toast.success(t('pages.issues.exportSuccess', { count: selectedIssues.length, format: 'CSV' }));
      }
    } else {
      console.error('[Issues] ❌ CSV export failed:', result.error);
      toast.error(t('pages.issues.exportFailed'));
    }
  };

  const handleExportJSON = async () => {
    if (selectedRows.size === 0) return;

    const selectedIssues = issues.filter(issue => selectedRows.has(issue.id));
    const issueIds = selectedIssues.map(issue => issue.id);
    const fileName = `issues_export_${new Date().toISOString().split('T')[0]}.json`;

    console.log(`[Issues] 📤 Exporting ${issueIds.length} issues as JSON via backend`);

    // STEP 1: Prepare export destination BEFORE download
    const exportPrep = await prepareExportDestination({
      behavior: user.exportBehavior || 'automatic',
      fileName,
      mimeType: 'application/json',
      suggestedExtension: '.json',
    });

    if (!exportPrep.success) {
      console.log('[Issues] JSON export cancelled by user');
      return;
    }

    // STEP 2: Download (no loading toast - JSON export is fast)
    const result = await serviceWorkflow<{ issue_ids: string[] }, Blob>({
      baseUrl: API_BASE_URL,
      endpoint: '/issues/export?format=json',
      method: 'POST',
      data: { issue_ids: issueIds },
      healthChecks: { ping: true, sql: true, minio: false },
      debug: analyticsSettings.logToConsole,
      showToasts: true,
      language: language,
      caller: 'IssuesExportJSON',
      responseType: 'blob',
    });

    // STEP 3: Write to destination
    if (result.success && result.data) {
      if (exportPrep.fileHandle) {
        const writeResult = await writeToFileHandle(exportPrep.fileHandle, result.data);
        if (writeResult.success) {
          toast.success(t('pages.issues.exportSuccess', { count: selectedIssues.length, format: 'JSON' }));
        } else {
          toast.error(t('pages.issues.exportFailed'));
        }
      } else {
        triggerAutomaticDownload(result.data, exportPrep.fileName);
        toast.success(t('pages.issues.exportSuccess', { count: selectedIssues.length, format: 'JSON' }));
      }
    } else {
      console.error('[Issues] ❌ JSON export failed:', result.error);
      toast.error(t('pages.issues.exportFailed'));
    }
  };

  /**
   * Create ZIP export via backend endpoint.
   * Backend generates ZIP with folder structure containing JSON, CSV, and attachments.
   *
   * UX Flow (v1.1.0):
   * 1. If save-as-dialog mode: Show save dialog FIRST (before download)
   * 2. If user cancels dialog: Return early (no download)
   * 3. Start download with progress indicator
   * 4. Write to chosen location or trigger automatic download
   */
  const handleExportZIP = async () => {
    if (selectedRows.size === 0) return;

    const selectedIssues = issues.filter(issue => selectedRows.has(issue.id));
    const issueIds = selectedIssues.map(issue => issue.id);
    const fileName = `issues_export_${new Date().toISOString().split('T')[0]}.zip`;

    console.log(`[Issues] 📤 Exporting ${issueIds.length} issues as ZIP via backend`);

    // ─────────────────────────────────────────────────────────────────
    // STEP 1: Prepare export destination BEFORE download
    // ─────────────────────────────────────────────────────────────────
    const exportPrep = await prepareExportDestination({
      behavior: user.exportBehavior || 'automatic',
      fileName,
      mimeType: 'application/zip',
      suggestedExtension: '.zip',
    });

    // User cancelled save dialog - don't start download
    if (!exportPrep.success) {
      console.log('[Issues] Export cancelled by user');
      return;
    }

    // ─────────────────────────────────────────────────────────────────
    // STEP 2: Collect file list and show progress modal
    // ─────────────────────────────────────────────────────────────────
    exportCancelledRef.current = false; // Reset cancel flag

    const fileList: ExportFile[] = [];
    for (const issue of selectedIssues) {
      if (issue.attachments && issue.attachments.length > 0) {
        for (const attachment of issue.attachments) {
          fileList.push({
            name: attachment.file_name || attachment.original_name || 'unknown',
            entityCode: issue.issue_code,
            size: attachment.file_size || 0,
          });
        }
      }
    }
    setExportFiles(fileList);
    setIsExportingZip(true);
    setExportProgress({ phase: 'healthCheck', percentage: 0, downloadedBytes: 0, totalBytes: 0, totalKnown: false });

    try {
      // ─────────────────────────────────────────────────────────────────
      // STEP 3: Download with progress tracking
      // ─────────────────────────────────────────────────────────────────
      const result = await serviceWorkflow<{ issue_ids: string[] }, Blob>({
        baseUrl: API_BASE_URL,
        endpoint: '/issues/export?format=zip',
        method: 'POST',
        data: {
          issue_ids: issueIds,
        },
        healthChecks: {
          ping: true,
          sql: true,
          minio: true,
        },
        debug: analyticsSettings.logToConsole,
        showToasts: true,
        language: language,
        caller: 'IssuesExportZIP',
        responseType: 'blob',
        callbacks: {
          onProgress: (progress) => {
            setExportProgress({
              phase: progress.phase,
              percentage: progress.percentage,
              downloadedBytes: progress.downloadedBytes,
              totalBytes: progress.totalBytes,
              totalKnown: progress.totalKnown,
            });
          },
        },
      });

      // ─────────────────────────────────────────────────────────────────
      // STEP 4: Write to destination (skip if cancelled)
      // ─────────────────────────────────────────────────────────────────
      if (exportCancelledRef.current) {
        console.log('[Issues] Export was cancelled by user');
        return;
      }

      if (result.success && result.data) {
        const blob = result.data;

        if (exportPrep.fileHandle) {
          // Write to user-selected location via File System API
          const writeResult = await writeToFileHandle(exportPrep.fileHandle, blob);
          if (writeResult.success) {
            toast.success(t('pages.issues.exportSuccess', { count: selectedIssues.length, format: 'ZIP' }));
          } else {
            console.error('[Issues] Failed to write file:', writeResult.error);
            toast.error(t('pages.issues.exportFailed'));
          }
        } else {
          // Automatic download fallback
          triggerAutomaticDownload(blob, exportPrep.fileName);
          toast.success(t('pages.issues.exportSuccess', { count: selectedIssues.length, format: 'ZIP' }));
        }
      } else {
        console.error('[Issues] ❌ ZIP export failed:', result.error);
        if (!result.data) {
          toast.error(t('pages.issues.exportFailed'));
        }
      }
    } finally {
      setIsExportingZip(false);
      setExportProgress(null);
      setExportFiles([]);
    }
  };


  // Handler for "Export without attachments"
  const handleExportZipWithoutAttachments = () => {
    if (!minioExportUnavailable) return;
    setMinioExportUnavailable(null);
    handleExportZIP(true);
  };

  // Handler for "Retry with attachments" (MinIO might be back online)
  const handleRetryExportZipWithAttachments = async () => {
    if (!minioExportUnavailable) return;

    setIsRetryingExport(true);

    try {
      // Use checkMultipleStoragesHealth from @l-kern/config
      const minioConfig = { type: 'minio' as const, baseUrl: 'http://localhost:9000', healthEndpoint: '/minio/health/live', displayName: 'MinIO Storage' };
      const healthResult = await checkMultipleStoragesHealth([minioConfig]);

      if (!healthResult.allHealthy) {
        // Still unhealthy - stay on modal
        toast.warning(t('pages.issues.minioExportError.title'));
        return;
      }

      // MinIO is healthy - close modal and proceed
      setMinioExportUnavailable(null);
      handleExportZIP(false);
    } catch {
      // Network error - MinIO unavailable
      toast.warning(t('pages.issues.minioExportError.title'));
    } finally {
      setIsRetryingExport(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // UPDATE ERROR RETRY HANDLER
  // ─────────────────────────────────────────────────────────────────

  const handleRetryUpdate = async () => {
    if (!updateError) return;

    console.log('[Issues] 🔄 MANUAL RETRY triggered - attempting to save changes...');
    setIsRetryingUpdate(true);

    try {
      // Use useServiceWorkflow hook - callbacks handled automatically
      const result = await executeWorkflow<Record<string, unknown>, Issue>({
        baseUrl: SERVICE_ENDPOINTS.issues.baseUrl,
        endpoint: `/issues/${updateError.issueId}`,
        method: 'PUT',
        data: updateError.updates,
        permissionLevel: updateError.permissionLevel,
        healthChecks: { ping: true, sql: true, minio: false, cache: true },
        verification: {
          enabled: true,
          getEndpoint: (result: Issue) => `/issues/${result.id}`,
          compareFields: Object.keys(updateError.updates),
        },
        debug: analyticsSettings.logServiceWorkflow,
        caller: 'Issues.handleRetryUpdate',
      }, {
        // Page-specific messages (override universal defaults)
        serviceDown: t('pages.issues.updateError.serviceDown'),
        takingLonger: t('pages.issues.updateError.takingLonger'),
      });

      if (result.success && result.data) {
        // Success! Close both retry modal AND edit modal
        setUpdateError(null);
        setIssueToView(null);  // Close edit modal after successful retry
        toast.success(t('pages.issues.updateSuccess'));

        // Normalize enum values to lowercase for local state
        const normalizedIssue = {
          ...result.data,
          type: result.data.type.toLowerCase() as IssueType,
          severity: result.data.severity.toLowerCase() as IssueSeverity,
          status: result.data.status.toLowerCase() as IssueStatus,
          priority: result.data.priority.toLowerCase() as IssuePriority,
        };

        // Update local state with saved data
        setIssues((prev) => prev.map((item) =>
          item.id === updateError.issueId ? { ...item, ...normalizedIssue } : item
        ));

        console.log(`[Issues] ✅ Issue ${updateError.issueId} saved successfully on retry`);
      } else if (result.errorCode === 'SERVICE_DOWN' || result.errorCode === 'SQL_DOWN') {
        // Still down - keep modal open, just stop spinner
        // updateError stays the same, modal stays visible
        console.log('[Issues] Service still unavailable on retry - keeping modal open');
      } else {
        // Different error - show generic error, close retry modal
        setUpdateError(null);
        toast.error(result.error || t('pages.issues.updateError.generic'));
      }
    } catch (err) {
      // Network error etc - keep modal open
      console.error('[Issues] Update retry failed:', err);
      toast.error(t('pages.issues.updateError.generic'));
    } finally {
      setIsRetryingUpdate(false);
    }
  };

  const handleBulkDelete = () => {
    if (selectedRows.size === 0) return;

    // Get selected issues
    const selectedIssues = issues.filter(issue => selectedRows.has(issue.id));

    // Separate active and soft-deleted items (using deleted_at field)
    const activeItems = selectedIssues.filter(issue => !issue.deleted_at);
    const deletedItems = selectedIssues.filter(issue => issue.deleted_at);

    // Determine delete type
    if (activeItems.length > 0 && deletedItems.length === 0) {
      setBulkDeleteType('soft');
      setBulkDeleteCounts({ active: activeItems.length, deleted: 0 });
    } else if (deletedItems.length > 0 && activeItems.length === 0) {
      setBulkDeleteType('hard');
      setBulkDeleteCounts({ active: 0, deleted: deletedItems.length });
    } else {
      setBulkDeleteType('mixed');
      setBulkDeleteCounts({ active: activeItems.length, deleted: deletedItems.length });
    }
  };

  const executeBulkDelete = async () => {
    setIsBulkDeleting(true);
    try {
      const selectedIssues = issues.filter(issue => selectedRows.has(issue.id));
      const activeItems = selectedIssues.filter(issue => !issue.deleted_at);
      const deletedItems = selectedIssues.filter(issue => issue.deleted_at);

      // Soft delete active items
      if (activeItems.length > 0) {
        for (const issue of activeItems) {
          await fetch(`${API_BASE_URL}/issues/${issue.id}`, { method: 'DELETE' });
        }
        console.log(`[Issues] ✅ Soft deleted ${activeItems.length} active issues`);
      }

      // Hard delete soft-deleted items (with MinIO 503 handling)
      const failedItems: Issue[] = [];
      const successfulHardDeletes: Issue[] = [];

      if (deletedItems.length > 0) {
        for (const issue of deletedItems) {
          const response = await fetch(`${API_BASE_URL}/issues/${issue.id}/permanent`, { method: 'DELETE' });

          if (response.status === 503) {
            // MinIO unavailable - track this item for special handling
            console.log(`[Issues] ⚠️ MinIO unavailable for issue ${issue.issue_code} - will offer mark for deletion`);
            failedItems.push(issue);
          } else if (response.ok) {
            successfulHardDeletes.push(issue);
          } else {
            // Other error - log but continue
            console.error(`[Issues] ❌ Failed to hard delete ${issue.issue_code}: ${response.statusText}`);
          }
        }

        if (successfulHardDeletes.length > 0) {
          console.log(`[Issues] ✅ Hard deleted ${successfulHardDeletes.length} soft-deleted issues`);
        }
      }

      // Close bulk delete modal
      setBulkDeleteType(null);

      // If any items failed due to MinIO, show special modal
      if (failedItems.length > 0) {
        console.log(`[Issues] ⚠️ ${failedItems.length} items failed due to MinIO - showing MinIO modal`);
        setMinioFailedItems(failedItems);
        // Clear selection of items that were successfully deleted
        const failedIds = new Set(failedItems.map(i => i.id));
        setSelectedRows(new Set([...selectedRows].filter(id => failedIds.has(id))));
      } else {
        // All successful - clear selection
        setSelectedRows(new Set());
      }

      // Refresh list to show deleted items removed
      await fetchIssues();

      // Show success toast if any items were deleted
      const totalDeleted = activeItems.length + successfulHardDeletes.length;
      if (totalDeleted > 0) {
        toast.success(t('pages.issues.bulkDeleteSuccess', { count: totalDeleted }));
      }
    } catch (error) {
      console.error('[Issues] ❌ Error during bulk delete:', error);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!issueToDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/issues/${issueToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete issue: ${response.statusText}`);
      }

      console.log(`[Issues] ✅ Issue ${issueToDelete.issue_code} soft deleted`);

      // Close modal
      setIssueToDelete(null);

      // Refresh issues list
      await fetchIssues();

      // TODO: Show toast notification
    } catch (err) {
      console.error('[Issues] ✗ Error deleting issue:', err);
      // TODO: Show error toast notification
    }
  };

  const handleRestoreConfirm = async () => {
    if (!issueToRestore) return;

    try {
      const response = await fetch(`${API_BASE_URL}/issues/${issueToRestore.id}/restore`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Failed to restore issue: ${response.statusText}`);
      }

      console.log(`[Issues] ✅ Issue ${issueToRestore.issue_code} restored`);

      // Close modal
      setIssueToRestore(null);

      // Refresh issues list
      await fetchIssues();

      // TODO: Show toast notification
    } catch (err) {
      console.error('[Issues] ✗ Error restoring issue:', err);
      // TODO: Show error toast notification
    }
  };

  const handlePermanentDeleteConfirm = async () => {
    if (!issueToPermanentlyDelete) return;

    setIsPermanentDeleting(true);

    try {
      const result = await serviceWorkflow({
        baseUrl: API_BASE_URL,
        endpoint: `/issues/${issueToPermanentlyDelete.id}/permanent`,
        method: 'DELETE',
        healthChecks: {
          ping: true,
          sql: true,
          minio: true, // Check MinIO for delete operations (has attachments)
        },
        deleteVerification: {
          enabled: true,
          getVerifyEndpoint: (id) => `/issues/${id}/verify`,
          entityType: 'issue',
          entityId: issueToPermanentlyDelete.id,
          entityCode: issueToPermanentlyDelete.issue_code,
        },
        callbacks: {
          onDataIntegrityIssue: defaultDataIntegrityHandler, // Auto-create Issue for orphaned files
          onError: (error, errorCode) => {
            console.error(`[Issues] Delete error: ${errorCode} - ${error}`);
          },
        },
        debug: true,
        caller: 'Issues.handlePermanentDeleteConfirm',
      });

      if (!result.success) {
        // Check for MinIO unavailable
        if (result.errorCode === 'MINIO_UNAVAILABLE' || result.errorCode === 'MINIO_UNAVAILABLE_WITH_FILES') {
          console.log('[Issues] ⚠️ MinIO unavailable - showing special modal (no changes made yet)');
          const issueToHandle = issueToPermanentlyDelete;
          setIssueToPermanentlyDelete(null);
          setMinioFailedItems([issueToHandle]);
          return;
        }

        throw new Error(result.error || 'Delete failed');
      }

      console.log(`[Issues] ✅ Issue ${issueToPermanentlyDelete.issue_code} permanently deleted`);

      // Close modal
      setIssueToPermanentlyDelete(null);

      // Refresh issues list
      await fetchIssues();

      // Show success toast
      toast.success(t('pages.issues.permanentDeleteSuccess', { code: issueToPermanentlyDelete.issue_code }));
    } catch (err) {
      console.error('[Issues] ✗ Error permanently deleting issue:', err);

      // Close modal
      setIssueToPermanentlyDelete(null);

      // Show error toast with details
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(t('pages.issues.permanentDeleteError', { code: issueToPermanentlyDelete.issue_code, error: errorMessage }));
    } finally {
      setIsPermanentDeleting(false);
    }
  };

  // ============================================================
  // UNIFIED MINIO HANDLERS (works for single item or bulk)
  // ============================================================

  /**
   * Mark all failed items for deletion (force=true)
   * Works for single item or bulk - iterates over minioFailedItems array
   */
  const handleMinioMarkForDeletion = async () => {
    if (minioFailedItems.length === 0) return;

    try {
      let successCount = 0;

      for (const issue of minioFailedItems) {
        const response = await fetch(`${API_BASE_URL}/issues/${issue.id}/permanent?force=true`, {
          method: 'DELETE',
        });

        if (response.ok) {
          successCount++;
          console.log(`[Issues] ✅ Issue ${issue.issue_code} marked for deletion`);
        } else {
          console.error(`[Issues] ❌ Failed to mark ${issue.issue_code} for deletion`);
        }
      }

      // Close modal and clear selection
      setMinioFailedItems([]);
      setSelectedRows(new Set());

      // Refresh list
      await fetchIssues();

      if (successCount > 0) {
        // Show appropriate message based on count
        const messageCode = successCount === 1
          ? minioFailedItems[0].issue_code
          : `${successCount} položiek`;
        toast.success(t('pages.issues.minioUnavailable.markedForDeletion', { code: messageCode }));
      }
    } catch (error) {
      console.error('[Issues] ❌ Error during mark for deletion:', error);
    }
  };

  /**
   * Retry delete for all failed items (without force)
   * Stays on modal with loading if some still fail
   */
  const handleMinioRetryDelete = async () => {
    if (minioFailedItems.length === 0) return;

    setIsRetryingDelete(true);

    try {
      const stillFailedItems: Issue[] = [];
      let successCount = 0;

      for (const issue of minioFailedItems) {
        const response = await fetch(`${API_BASE_URL}/issues/${issue.id}/permanent`, {
          method: 'DELETE',
        });

        if (response.status === 503) {
          stillFailedItems.push(issue);
          console.log(`[Issues] ⚠️ MinIO still unavailable for ${issue.issue_code}`);
        } else if (response.ok) {
          successCount++;
          console.log(`[Issues] ✅ Issue ${issue.issue_code} permanently deleted on retry`);
        }
      }

      if (stillFailedItems.length > 0) {
        // Update the list of still-failed items (stay on modal)
        setMinioFailedItems(stillFailedItems);
        toast.warning(t('pages.issues.minioUnavailable.title'));
      } else {
        // All successful - close modal
        setMinioFailedItems([]);
        setSelectedRows(new Set());
      }

      // Refresh list
      await fetchIssues();

      if (successCount > 0) {
        // Show appropriate message
        const messageCode = successCount === 1 && minioFailedItems.length === 1
          ? minioFailedItems[0].issue_code
          : successCount;
        toast.success(t('pages.issues.permanentDeleteSuccess', { code: messageCode }));
      }
    } catch (error) {
      console.error('[Issues] ❌ Error during retry delete:', error);
    } finally {
      setIsRetryingDelete(false);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  // NOTE: No separate loading state - FilteredDataGrid shows loading/error inside grid
  // This ensures filter panel and grid layout are always visible

  return (
    <BasePage>
      <div className={styles.page}>
        <PageHeader
          title={t('pages.issues.title')}
          subtitle={t('pages.issues.subtitle')}
          breadcrumbs={[
            { name: t('common.home'), href: '/' },
            { name: t('pages.issues.breadcrumb'), isActive: true },
          ]}
        />

        <FilteredDataGrid
          data={issues}
          columns={columns}
          getRowId={(row) => row.id}
          // Search
          searchPlaceholder={t('pages.issues.searchPlaceholder')}
          // Filters
          filters={filters}
          quickFilters={quickFilters}
          useFilterCheckboxes={true}
          // Pagination
          itemsPerPage={10}
          // New Item Button (always visible, disabled for basic users)
          onNewItem={handleNewItem}
          newItemText={t('pages.issues.newItemButton')}
          newItemDisabled={!canCreate /* DEBUG: canCreate=${canCreate}, newItemDisabled=${!canCreate} */}
          // Inactive field (always provided to filter soft-deleted issues)
          inactiveField="isActive"
          // Show inactive toggle (advanced only)
          {...(canViewDeleted && {
            showInactiveLabel: t('pages.issues.showInactiveLabel'),
          })}
          // Selection
          enableSelection
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          isRowSelectable={(row: Issue) => !row.deletion_audit_id} // Disable selection for pending deletion items
          // Expandable Rows
          expandable
          expandedRows={expandedRows}
          onRowToggle={(id) => {
            setExpandedRows((prev) => {
              const next = new Set(prev);
              if (next.has(id)) {
                next.delete(id);
              } else {
                next.add(id);
              }
              return next;
            });
          }}
          onRowDoubleClick={(item) => setIssueToView(item)}
          renderExpandedContent={renderExpandedContent}
          // Actions
          actions={actions}
          // Status Colors
          getRowStatus={(row) => row.deleted_at !== null ? 'deleted' : row.status}
          statusColors={statusColors}
          statusLabels={statusLabels}
          showStatusLegend={true}
          // Grid ID
          gridId="issuesPageDatagrid"
          // Auto-refresh every 5 seconds
          autoRefreshInterval={5000}
          onRefresh={() => fetchIssues()}
          // Loading state - shows spinner inside DataGrid
          loading={loading}
          loadingSlow={loadingSlow}
          // Error state - shows inside DataGrid when service unavailable
          error={error}
          onRetry={() => {
            setError(null);
            fetchIssues(true);
          }}
          // Bulk Actions Bar
          betweenContent={
            <div className={styles.selectedInfo}>
              <div className={styles.selectedCount}>
                <strong>{t('pages.issues.selectedCount')}:</strong> {selectedRows.size}
              </div>
              <div className={styles.selectedActions}>
                <ExportButton
                  onExport={(format) => {
                    if (format === 'csv') handleExportCSV();
                    else if (format === 'json') handleExportJSON();
                    else if (format === 'zip') handleExportZIP();
                  }}
                  formats={['csv', 'json', 'zip']}
                  disabled={selectedRows.size === 0 || !canExport}
                />
                <button
                  className={styles.actionButtonDanger}
                  onClick={handleBulkDelete}
                  disabled={selectedRows.size === 0 || !canDelete}
                >
                  <span role="img" aria-label="Delete">🗑️</span> {t('common.delete')}
                </button>
                <button
                  className={styles.actionButtonSecondary}
                  onClick={() => setSelectedRows(new Set())}
                  disabled={selectedRows.size === 0}
                >
                  {t('pages.issues.clearSelection')}
                </button>
              </div>
            </div>
          }
        />

        {/* Issue Type Select Modal - All users see all 4 types */}
        <IssueTypeSelectModal
          isOpen={isTypeSelectOpen}
          onClose={() => setIsTypeSelectOpen(false)}
          onSelectType={handleTypeSelect}
          modalId="issues-type-select-modal"
        />

        {/* Create Issue Handler - manages create modal + error dialogs */}
        <IssueCreateHandler
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          initialData={initialIssueData}
          showTypeSelect={false}
          onSuccess={async (issue: CreatedIssue) => {
            await fetchIssues();
          }}
        />

        {/* Delete Confirmation Modal */}
        {issueToDelete && (
          <ConfirmModal
            isOpen={true}
            onClose={() => setIssueToDelete(null)}
            onConfirm={handleDeleteConfirm}
            title={t('common.confirmDelete')}
            message={`${t('common.confirmDeleteMessage')} ${issueToDelete.issue_code}?`}
            confirmButtonLabel={t('common.delete')}
            cancelButtonLabel={t('common.cancel')}
          />
        )}

        {/* Bulk Delete Confirmation Modals */}
        {bulkDeleteType === 'soft' && (
          <ConfirmModal
            isOpen={true}
            onClose={() => setBulkDeleteType(null)}
            onConfirm={executeBulkDelete}
            title={t('pages.issues.bulkDelete.title')}
            message={t('pages.issues.bulkDelete.softMessage', { count: bulkDeleteCounts.active })}
            isDanger={false}
            isLoading={isBulkDeleting}
          />
        )}

        {bulkDeleteType === 'hard' && (
          <ConfirmModal
            isOpen={true}
            onClose={() => setBulkDeleteType(null)}
            onConfirm={executeBulkDelete}
            title={t('pages.issues.bulkDelete.titlePermanent')}
            message={t('pages.issues.bulkDelete.hardMessage', { count: bulkDeleteCounts.deleted })}
            confirmKeyword="ano"
            isDanger={true}
            isLoading={isBulkDeleting}
          />
        )}

        {bulkDeleteType === 'mixed' && (
          <ConfirmModal
            isOpen={true}
            onClose={() => setBulkDeleteType(null)}
            onConfirm={executeBulkDelete}
            title={t('pages.issues.bulkDelete.titleMixed')}
            message={t('pages.issues.bulkDelete.mixedMessage', {
              softCount: bulkDeleteCounts.active,
              hardCount: bulkDeleteCounts.deleted
            })}
            confirmKeyword="ano"
            isDanger={true}
            isLoading={isBulkDeleting}
          />
        )}

        {/* MinIO Unavailable Modal - unified for single item and bulk */}
        {minioFailedItems.length > 0 && (
          <ConfirmModal
            isOpen={true}
            onClose={() => {
              setMinioFailedItems([]);
              setSelectedRows(new Set());
            }}
            onConfirm={handleMinioMarkForDeletion}
            title={t('pages.issues.minioUnavailable.title')}
            message={minioFailedItems.length === 1
              ? t('pages.issues.minioUnavailable.message', { code: minioFailedItems[0].issue_code })
              : t('pages.issues.bulkDelete.minioMessage', { count: minioFailedItems.length })
            }
            confirmButtonLabel={t('pages.issues.minioUnavailable.markForDeletion')}
            cancelButtonLabel={t('common.cancel')}
            secondaryButtonLabel={t('pages.issues.minioUnavailable.retryDelete')}
            onSecondary={handleMinioRetryDelete}
            isSecondaryLoading={isRetryingDelete}
          />
        )}

        {/* Restore Confirmation Modal */}
        {issueToRestore && (
          <ConfirmModal
            isOpen={true}
            onClose={() => setIssueToRestore(null)}
            onConfirm={handleRestoreConfirm}
            title={t('common.restore')}
            message={t('pages.issues.restoreConfirm', { name: issueToRestore.issue_code })}
            confirmButtonLabel={t('common.restore')}
            cancelButtonLabel={t('common.cancel')}
          />
        )}

        {/* Permanent Delete Confirmation Modal */}
        {issueToPermanentlyDelete && (
          <ConfirmModal
            isOpen={true}
            onClose={() => setIssueToPermanentlyDelete(null)}
            onConfirm={handlePermanentDeleteConfirm}
            title={t('common.permanentDelete')}
            message={t('pages.issues.permanentDeleteConfirm', { name: issueToPermanentlyDelete.issue_code })}
            confirmButtonLabel={t('common.permanentDelete')}
            cancelButtonLabel={t('common.cancel')}
            confirmKeyword="ano"
            isDanger={true}
            isLoading={isPermanentDeleting}
          />
        )}

        {/* Deletion Audit Modal */}
        <DeletionAuditModal
          isOpen={auditModalOpen}
          onClose={() => setAuditModalOpen(false)}
          issueId={selectedAuditIssueId || ''}
        />

        {/* NOTE: MinIO Create Error and Generic Create Error modals are now handled by IssueCreateHandler */}

        {/* MinIO Unavailable during ZIP Export - offer export without attachments */}
        {minioExportUnavailable && (
          <ConfirmModal
            isOpen={true}
            onClose={() => setMinioExportUnavailable(null)}
            onConfirm={handleExportZipWithoutAttachments}
            title={t('pages.issues.minioExportError.title')}
            message={t('pages.issues.minioExportError.message', {
              count: minioExportUnavailable.selectedIssues.length,
              attachments: minioExportUnavailable.attachmentsCount,
            })}
            confirmButtonLabel={t('pages.issues.minioExportError.exportWithoutAttachments')}
            cancelButtonLabel={t('common.cancel')}
            secondaryButtonLabel={t('pages.issues.minioExportError.retryWithAttachments')}
            onSecondary={handleRetryExportZipWithAttachments}
            isSecondaryLoading={isRetryingExport}
          />
        )}

        {/* Export Errors Modal - shows missing attachments with download option */}
        {exportErrors && (
          <ConfirmModal
            isOpen={true}
            onClose={() => setExportErrors(null)}
            onConfirm={() => {
              // Download the pending ZIP
              if (exportErrors.pendingZipBlob && exportErrors.zipFileName) {
                const url = URL.createObjectURL(exportErrors.pendingZipBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = exportErrors.zipFileName;
                link.click();
                URL.revokeObjectURL(url);
                toast.warning(t('pages.issues.exportPartialAttachments', {
                  success: exportErrors.successCount,
                  missing: exportErrors.missingAttachments.length
                }));
              }
              setExportErrors(null);
            }}
            title={exportErrors.minioErrors.length > 0
              ? t('pages.issues.minioExportError.title')
              : t('pages.issues.exportErrors.missingAttachmentsModalTitle')
            }
            message={
              <>
                {exportErrors.missingAttachments.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ marginBottom: '8px' }}>
                      {t('pages.issues.exportErrors.missingAttachmentsMessage')}
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      {exportErrors.missingAttachments.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {exportErrors.minioErrors.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ fontWeight: 600, marginBottom: '4px' }}>
                      <span role="img" aria-label="Warning">⚠️</span> {t('pages.issues.exportErrors.minioTitle', { count: exportErrors.minioErrors.length })}:
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      {exportErrors.minioErrors.map(code => (
                        <li key={code}>{code}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            }
            confirmButtonLabel={t('pages.issues.exportErrors.downloadWithoutMissing')}
            cancelButtonLabel={t('common.cancel')}
          />
        )}

        {/* Update Error Modal (Service/SQL down during edit) */}
        {updateError && (
          <ConfirmModal
            isOpen={true}
            onClose={() => setUpdateError(null)}
            onConfirm={handleRetryUpdate}
            title={t('pages.issues.updateError.title')}
            message={t('pages.issues.updateError.serviceUnavailable')}
            confirmButtonLabel={t('pages.issues.updateError.retry')}
            cancelButtonLabel={t('common.cancel')}
            isLoading={isRetryingUpdate}
          />
        )}

        {/* Issue View Modal */}
        <IssueViewModal
          isOpen={!!issueToView}
          onClose={() => setIssueToView(null)}
          issue={issueToView}
          canEdit={canEdit}
          canDelete={canDelete}
          onSave={async (issueId, updates, permissionLevel) => {
            // Use useServiceWorkflow hook - callbacks handled automatically
            const updatesObj = updates as Record<string, unknown>;
            const result = await executeWorkflow<Record<string, unknown>, Issue>({
              baseUrl: SERVICE_ENDPOINTS.issues.baseUrl,
              endpoint: `/issues/${issueId}`,
              method: 'PUT',
              data: updatesObj,
              permissionLevel,
              healthChecks: { ping: true, sql: true, minio: false, cache: true },
              verification: {
                enabled: true,
                getEndpoint: (result: Issue) => `/issues/${result.id}`,
                compareFields: Object.keys(updatesObj),
              },
              debug: analyticsSettings.logServiceWorkflow,
              caller: 'Issues.onSave',
            }, {
              // Page-specific messages (override universal defaults)
              serviceDown: t('pages.issues.updateError.serviceDown'),
              takingLonger: t('pages.issues.updateError.takingLonger'),
            });

            if (result.success && result.data) {
              // Normalize enum values to lowercase for local state
              const normalizedIssue = {
                ...result.data,
                type: result.data.type.toLowerCase() as IssueType,
                severity: result.data.severity.toLowerCase() as IssueSeverity,
                status: result.data.status.toLowerCase() as IssueStatus,
                priority: result.data.priority.toLowerCase() as IssuePriority,
              };

              // Update local state
              setIssues((prev) => prev.map((item) =>
                item.id === issueId ? { ...item, ...normalizedIssue } : item
              ));
              // Update viewed issue
              setIssueToView((prev) => prev ? { ...prev, ...normalizedIssue } : prev);
              console.log(`[Issues] ✅ Issue ${issueId} saved successfully`);
              return true;
            }

            // Handle errors
            console.error(`[Issues] ❌ Failed to save issue ${issueId}:`, result.error);

            // Show retry modal for SERVICE_DOWN or SQL_DOWN
            if (result.errorCode === 'SERVICE_DOWN' || result.errorCode === 'SQL_DOWN') {
              setUpdateError({
                issueId,
                updates: updates as Record<string, unknown>,
                permissionLevel,
                errorType: result.errorCode,
              });
            } else {
              // Other errors - show toast
              toast.error(result.error || t('pages.issues.updateError.generic'));
            }
            return false;
          }}
          onExport={async (issue, format) => {
            console.log(`[Issues] Export issue ${issue.issue_code} as ${format}`);

            if (format === 'csv') {
              const fileName = `issue_${issue.issue_code}_${new Date().toISOString().split('T')[0]}.csv`;

              // STEP 1: Prepare destination BEFORE download
              const exportPrep = await prepareExportDestination({
                behavior: user.exportBehavior || 'automatic',
                fileName,
                mimeType: 'text/csv',
                suggestedExtension: '.csv',
              });

              if (!exportPrep.success) {
                console.log('[Issues] CSV export cancelled by user');
                return;
              }

              // STEP 2: Download (no loading toast - CSV export is fast)
              const result = await serviceWorkflow<{ issue_ids: string[] }, Blob>({
                baseUrl: API_BASE_URL,
                endpoint: '/issues/export?format=csv',
                method: 'POST',
                data: { issue_ids: [issue.id] },
                healthChecks: { ping: true, sql: true, minio: false },
                debug: analyticsSettings.logToConsole,
                showToasts: true,
                language: language,
                caller: 'IssueViewModal.ExportCSV',
                responseType: 'blob',
              });

              // STEP 3: Write to destination
              if (result.success && result.data) {
                if (exportPrep.fileHandle) {
                  const writeResult = await writeToFileHandle(exportPrep.fileHandle, result.data);
                  if (writeResult.success) {
                    toast.success(t('pages.issues.exportSuccess', { count: 1, format: 'CSV' }));
                  } else {
                    toast.error(t('pages.issues.exportFailed'));
                  }
                } else {
                  triggerAutomaticDownload(result.data, exportPrep.fileName);
                  toast.success(t('pages.issues.exportSuccess', { count: 1, format: 'CSV' }));
                }
              } else {
                toast.error(t('pages.issues.exportFailed'));
              }

            } else if (format === 'json') {
              const fileName = `issue_${issue.issue_code}_${new Date().toISOString().split('T')[0]}.json`;

              // STEP 1: Prepare destination BEFORE download
              const exportPrep = await prepareExportDestination({
                behavior: user.exportBehavior || 'automatic',
                fileName,
                mimeType: 'application/json',
                suggestedExtension: '.json',
              });

              if (!exportPrep.success) {
                console.log('[Issues] JSON export cancelled by user');
                return;
              }

              // STEP 2: Download (no loading toast - JSON export is fast)
              const result = await serviceWorkflow<{ issue_ids: string[] }, Blob>({
                baseUrl: API_BASE_URL,
                endpoint: '/issues/export?format=json',
                method: 'POST',
                data: { issue_ids: [issue.id] },
                healthChecks: { ping: true, sql: true, minio: false },
                debug: analyticsSettings.logToConsole,
                showToasts: true,
                language: language,
                caller: 'IssueViewModal.ExportJSON',
                responseType: 'blob',
              });

              // STEP 3: Write to destination
              if (result.success && result.data) {
                if (exportPrep.fileHandle) {
                  const writeResult = await writeToFileHandle(exportPrep.fileHandle, result.data);
                  if (writeResult.success) {
                    toast.success(t('pages.issues.exportSuccess', { count: 1, format: 'JSON' }));
                  } else {
                    toast.error(t('pages.issues.exportFailed'));
                  }
                } else {
                  triggerAutomaticDownload(result.data, exportPrep.fileName);
                  toast.success(t('pages.issues.exportSuccess', { count: 1, format: 'JSON' }));
                }
              } else {
                toast.error(t('pages.issues.exportFailed'));
              }

            } else if (format === 'zip') {
              // Single issue ZIP export via backend - reuses bulk handleExportZIP
              setSelectedRows(new Set([issue.id]));
              setTimeout(() => handleExportZIP(), 0);
            }
          }}
          onSaveAttachments={async (issueId, deletedAttachments, newFiles) => {
            // Get issue code for data integrity reporting
            const currentIssue = issues.find(i => i.id === issueId);

            // Step 1: Bulk delete attachments (if any)
            if (deletedAttachments.length > 0) {
              // Extended response type with results array
              interface BulkDeleteResponse {
                not_found_minio: number;
                results: Array<{ filename: string; status: string; error?: string }>;
              }

              const deleteResult = await serviceWorkflow<{ filenames: string[] }, BulkDeleteResponse>({
                baseUrl: SERVICE_ENDPOINTS.issues.baseUrl,
                endpoint: `/issues/${issueId}/attachments/bulk-delete`,
                method: 'POST',
                data: { filenames: deletedAttachments.map(a => a.file_name) },
                healthChecks: { ping: true, sql: true, minio: true },
                debug: analyticsSettings.logServiceWorkflow,
                caller: 'Issues.bulkDeleteAttachments',
              });

              if (!deleteResult.success) {
                toast.error(t('pages.issues.attachmentEdit.saveError'));
                return false;
              }

              // Check for orphaned files (data integrity issue) - auto-create Issue
              if (deleteResult.data?.not_found_minio && deleteResult.data.not_found_minio > 0) {
                const orphanedFiles = deleteResult.data.results
                  ?.filter(r => r.status === 'not_found_minio')
                  .map(r => r.filename) || [];

                console.warn(`[Issues] Data integrity: ${deleteResult.data.not_found_minio} orphaned attachment(s) found`);

                // Auto-create Issue via Kafka
                defaultDataIntegrityHandler({
                  event_type: 'data_integrity.missing_attachment',
                  source_service: 'Issues.bulkDeleteAttachments',
                  source_entity: {
                    type: 'issue',
                    id: issueId,
                    code: currentIssue?.issue_code,
                  },
                  detected_at: new Date().toISOString(),
                  details: {
                    missing_files: orphanedFiles,
                    expected_location: `minio/issues-attachments/${issueId}/`,
                  },
                  issue_data: {
                    title: currentIssue?.issue_code
                      ? `Missing attachments in issue ${currentIssue.issue_code}`
                      : `Missing attachments detected during bulk delete`,
                    description: `Found ${orphanedFiles.length} file(s) in database but missing from MinIO storage.\n\n**Affected files:**\n${orphanedFiles.map(f => `- ${f}`).join('\n')}`,
                    type: 'BUG',
                    severity: 'MODERATE',
                    category: 'DATA_INTEGRITY',
                    priority: 'MEDIUM',
                  },
                });
              }
            }

            // Step 2: Upload new files (if any)
            if (newFiles.length > 0) {
              const uploadResult = await serviceWorkflow({
                baseUrl: SERVICE_ENDPOINTS.issues.baseUrl,
                endpoint: `/issues/${issueId}/attachments`,
                method: 'POST',
                files: newFiles,
                healthChecks: { ping: false, sql: false, minio: true }, // Already checked in step 1
                debug: analyticsSettings.logServiceWorkflow,
                caller: 'Issues.uploadAttachments',
              });

              if (!uploadResult.success) {
                toast.error(t('pages.issues.attachmentEdit.saveError'));
                return false;
              }
            }

            // Step 3: Refresh entity (with permission level for field visibility)
            const refreshResult = await serviceWorkflow<void, Issue>({
              baseUrl: SERVICE_ENDPOINTS.issues.baseUrl,
              endpoint: `/issues/${issueId}`,
              method: 'GET',
              permissionLevel,
              healthChecks: { ping: false, sql: false, minio: false },
              debug: analyticsSettings.logServiceWorkflow,
              caller: 'Issues.refreshAfterAttachments',
            });

            if (refreshResult.success && refreshResult.data) {
              const updatedIssue = refreshResult.data;
              // Normalize enum values to lowercase for local state (with null safety)
              const normalizedIssue = {
                ...updatedIssue,
                type: (updatedIssue.type?.toLowerCase() ?? 'bug') as IssueType,
                severity: (updatedIssue.severity?.toLowerCase() ?? 'moderate') as IssueSeverity,
                status: (updatedIssue.status?.toLowerCase() ?? 'open') as IssueStatus,
                priority: (updatedIssue.priority?.toLowerCase() ?? 'medium') as IssuePriority,
              };

              setIssues((prev) => prev.map((item) =>
                item.id === issueId ? { ...item, ...normalizedIssue } : item
              ));
              setIssueToView((prev) => prev ? { ...prev, ...normalizedIssue } : prev);
              setAttachmentStatus((prev) => {
                const newMap = new Map(prev);
                newMap.delete(issueId);
                return newMap;
              });
            }

            toast.success(t('pages.issues.attachmentEdit.saveSuccess'));
            return true;
          }}
          onDelete={async (issue) => {
            try {
              const response = await fetch(`${API_BASE_URL}/issues/${issue.id}`, {
                method: 'DELETE',
              });

              if (!response.ok) {
                throw new Error(`Failed to delete issue: ${response.statusText}`);
              }

              console.log(`[Issues] ✅ Issue ${issue.issue_code} soft deleted`);
              toast.success(t('pages.issues.deleteSuccess', { name: issue.issue_code }));
              await fetchIssues();
              return true;
            } catch (err) {
              console.error('[Issues] ✗ Error deleting issue:', err);
              toast.error(t('common.error'));
              return false;
            }
          }}
          onRestore={async (issue) => {
            try {
              const response = await fetch(`${API_BASE_URL}/issues/${issue.id}/restore`, {
                method: 'POST',
              });

              if (!response.ok) {
                throw new Error(`Failed to restore issue: ${response.statusText}`);
              }

              console.log(`[Issues] ✅ Issue ${issue.issue_code} restored`);
              toast.success(t('pages.issues.restoreSuccess', { name: issue.issue_code }));
              await fetchIssues();
              return true;
            } catch (err) {
              console.error('[Issues] ✗ Error restoring issue:', err);
              toast.error(t('common.error'));
              return false;
            }
          }}
          onHardDelete={(issue) => {
            // Close the view modal and open the permanent delete confirmation modal
            setIssueToView(null);
            setIssueToPermanentlyDelete(issue);
          }}
        />

        {/* Export Progress Modal (reusable component from ui-components) */}
        <ExportProgressModal
          isOpen={isExportingZip}
          format="ZIP"
          progress={exportProgress}
          files={exportFiles}
          healthCheckText={t('pages.issues.exportZipLoading')}
          downloadingText={t('pages.issues.exportLoading', { format: 'ZIP' })}
          onCancel={() => {
            console.log('[Issues] User cancelled export');
            exportCancelledRef.current = true;
            setIsExportingZip(false);
            setExportProgress(null);
            setExportFiles([]);
            toast.info(t('common.cancelled'));
          }}
        />
      </div>
    </BasePage>
  );
}
