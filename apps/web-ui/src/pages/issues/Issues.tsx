/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/accessible-emoji */
/*
 * ================================================================
 * FILE: Issues.tsx
 * PATH: /apps/web-ui/src/pages/Issues/Issues.tsx
 * DESCRIPTION: Issues page with FilteredDataGrid (soft/hard delete workflow)
 * VERSION: v1.2.0
 * UPDATED: 2025-11-24
 * ================================================================
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BasePage, PageHeader, FilteredDataGrid, CreateIssueModal, IssueTypeSelectModal, ConfirmModal, ExportButton, Spinner } from '@l-kern/ui-components';
import type { FilterConfig, QuickFilterConfig } from '@l-kern/ui-components';
import { useTranslation, useAuthContext, useTheme, useToast, useAnalyticsContext, useAnalyticsSettings, COLORS, getBackendRole, formatDateTime, formatDate, checkMultipleStoragesHealth } from '@l-kern/config';
import { DeletionAuditModal } from './DeletionAuditModal';
import { IssueViewModal } from './IssueViewModal';
import { IssueCreateHandler } from './IssueCreateHandler';
import { issueWorkflow, type CreatedIssue } from '../../services';
import { exportToCSV, exportToJSON } from '@l-kern/config';
import JSZip from 'jszip';
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
  const navigate = useNavigate();
  const { permissionLevel, permissions } = useAuthContext();
  const { theme } = useTheme();
  const toast = useToast();
  const analyticsSettings = useAnalyticsSettings();

  // Try to get debug settings from AnalyticsContext
  let logPermissions = true;
  let logFetchCalls = true;
  try {
    const analyticsContext = useAnalyticsContext();
    logPermissions = analyticsContext.settings.logPermissions;
    logFetchCalls = analyticsContext.settings.logFetchCalls;
  } catch {
    // AnalyticsContext not available, default to true
  }

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
  const [error, setError] = useState<string | null>(null);
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

  const fetchIssues = async (isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
        setError(null);
      }

      // If user can view deleted, fetch ALL issues (including deleted) from backend
      // FilteredDataGrid will handle showing/hiding based on toggle
      const url = canViewDeleted
        ? `${API_BASE_URL}/issues/?include_deleted=true`
        : `${API_BASE_URL}/issues/`;
      // Log fetch call if debug setting enabled
      if (logFetchCalls) {
        console.log(`[Issues] 📡 FETCH ${url} | Permission Level: ${permissionLevel}`);
      }

      const response = await fetch(url, {
        headers: {
          'X-Permission-Level': String(permissionLevel),
        },
      });

      if (!response.ok) {
        throw new Error(`${t('pages.issues.fetchError')}: ${response.statusText}`);
      }

      const data = await response.json();

      // Log response if debug setting enabled
      if (logFetchCalls) {
        console.log(`[Issues] 📡 RESPONSE: ${data.length} issues loaded`);
      }

      // Add computed 'isActive' field (inverted from 'deleted_at')
      // FilteredDataGrid expects 'true' = active, but deleted_at !== null means inactive
      const issuesWithActive = data.map((issue: Issue) => ({
        ...issue,
        isActive: issue.deleted_at === null,
      }));

      setIssues(issuesWithActive);

      // NOTE: Don't clear attachment status cache on every refresh
      // Cache is only cleared for specific issue when its attachments change
      // This prevents excessive HEAD requests every 5s
    } catch (err) {
      console.error('[Issues] Error fetching issues:', err);
      if (isInitial) {
        setError(err instanceof Error ? err.message : t('pages.issues.fetchError'));
      }
    } finally {
      if (isInitial) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchIssues(true);
  }, []);

  // Re-fetch when permission level changes (Ctrl+1-9 shortcuts)
  // This ensures field visibility updates immediately
  useEffect(() => {
    // Skip initial render (handled by effect above)
    fetchIssues(false);
    if (logFetchCalls) {
      console.log(`[Issues] 🔄 Permission level changed to ${permissionLevel}, refreshing data...`);
    }
  }, [permissionLevel, logFetchCalls]);

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
            <span style={{ color: 'var(--color-status-error, #f44336)', fontSize: '1.1em' }} title={t('issues.deletionAudit.deletionPending')}>⚠️⚠️</span>
          )}
          {/* Soft deleted (but not pending) = ⚠️ (one warning) */}
          {row.deleted_at !== null && !row.deletion_audit_id && (
            <span style={{ color: 'var(--color-status-warning, #FF9800)', fontSize: '1.1em' }} title={t('issues.deletionAudit.softDeleted')}>⚠️</span>
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
          return <span title={t('pages.issues.details.attachmentChecking')} style={{ marginLeft: '8px' }}>⏳</span>;
        case 'available':
          return <span title={t('pages.issues.details.attachmentAvailable')} style={{ marginLeft: '8px', color: 'var(--color-status-success)' }}>✓</span>;
        case 'unavailable':
          // File is missing in MinIO (404) - red indicator
          return <span title={t('pages.issues.details.attachmentUnavailable')} style={{ marginLeft: '8px', color: 'var(--color-status-error)' }}>❌ {t('pages.issues.details.attachmentMissing')}</span>;
        case 'error':
          // Service unavailable (503/network) - orange indicator
          return <span title={t('pages.issues.details.attachmentError')} style={{ marginLeft: '8px', color: 'var(--color-status-warning)' }}>⚠️ {t('pages.issues.details.attachmentServiceDown')}</span>;
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
          <span className={styles.deletedIcon}>🗑️</span>
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
          🔴
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
                      📎 {attachment.file_name}
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

  const handleExportCSV = () => {
    if (selectedRows.size === 0) return;

    const selectedIssues = issues.filter(issue => selectedRows.has(issue.id));

    // ALL headers - flattened structure for CSV
    const headers = [
      'ID',
      t('pages.issues.columns.issue_code'),
      t('pages.issues.columns.title'),
      t('pages.issues.details.description'),
      t('pages.issues.details.type'),
      t('pages.issues.details.severity'),
      t('pages.issues.columns.status'),
      t('pages.issues.details.priority'),
      t('pages.issues.details.category'),
      t('pages.issues.details.reporterId'),
      t('pages.issues.details.assigneeId'),
      t('pages.issues.details.resolution'),
      t('pages.issues.details.created_at'),
      t('pages.issues.details.updated'),
      t('pages.issues.details.resolved'),
      t('pages.issues.details.closed'),
      t('pages.issues.details.deleted'),
      // Developer info
      t('pages.issues.details.errorType'),
      t('pages.issues.details.errorMessage'),
      // System info (flattened)
      t('pages.issues.details.browser'),
      t('pages.issues.details.os'),
      t('pages.issues.details.url'),
      'Viewport',
      'Screen',
      'Timestamp',
      'User Agent',
      // Attachments count
      t('pages.issues.details.attachments'),
    ];

    // Map ALL issue data - flattened for CSV
    const exportData = selectedIssues.map(issue => ({
      id: issue.id,
      issue_code: issue.issue_code,
      title: issue.title,
      description: issue.description || '',
      type: issue.type,
      severity: issue.severity,
      status: issue.status,
      priority: issue.priority,
      category: issue.category || '',
      reporter_id: issue.reporter_id,
      assignee_id: issue.assignee_id || '',
      resolution: issue.resolution || '',
      created_at: issue.created_at,
      updated_at: issue.updated_at || '',
      resolved_at: issue.resolved_at || '',
      closed_at: issue.closed_at || '',
      deleted_at: issue.deleted_at || '',
      // Developer info
      error_type: issue.error_type || '',
      error_message: issue.error_message || '',
      // System info (flattened)
      browser: issue.system_info?.browser || '',
      os: issue.system_info?.os || '',
      url: issue.system_info?.url || '',
      viewport: issue.system_info?.viewport || '',
      screen: issue.system_info?.screen || '',
      timestamp: issue.system_info?.timestamp || '',
      userAgent: issue.system_info?.userAgent || '',
      // Attachments count
      attachments_count: issue.attachments?.length || 0,
    }));

    exportToCSV(exportData, headers, `issues_export_${new Date().toISOString().split('T')[0]}`);
    toast.success(t('pages.issues.exportSuccess', { count: selectedIssues.length, format: 'CSV' }));
  };

  const handleExportJSON = () => {
    if (selectedRows.size === 0) return;

    const selectedIssues = issues.filter(issue => selectedRows.has(issue.id));

    // Export FULL data including nested objects (system_info, attachments)
    // Remove internal computed field (isActive) that was added for filtering
    const exportData = selectedIssues.map(issue => {
      const { isActive, ...cleanIssue } = issue as Issue & { isActive?: boolean };
      return cleanIssue;
    });

    exportToJSON(exportData, `issues_export_${new Date().toISOString().split('T')[0]}`);
    toast.success(t('pages.issues.exportSuccess', { count: selectedIssues.length, format: 'JSON' }));
  };

  /**
   * Create ZIP export with folder structure:
   * issues_export_YYYY-MM-DD.zip
   * ├── ISS-001_uuid/
   * │   ├── issue.json
   * │   ├── issue.csv
   * │   └── attachments/
   * │       ├── file1.png
   * │       └── file2.pdf
   * └── ISS-002_uuid/
   *     └── ...
   *
   * Error handling:
   * - Deleted record (404): Skip and show in error modal (no retry)
   * - MinIO error (503/network): Skip and show in error modal (with retry)
   */
  const handleExportZIP = async (skipAttachments = false) => {
    if (selectedRows.size === 0) return;

    const selectedIssues = issues.filter(issue => selectedRows.has(issue.id));

    // Count total attachments
    const totalAttachments = selectedIssues.reduce(
      (sum, issue) => sum + (issue.attachments?.length || 0),
      0
    );

    // If not skipping attachments and there are attachments, check MinIO availability first
    if (!skipAttachments && totalAttachments > 0) {
      setIsExportingZip(true);
      // Loading overlay will show while checking MinIO

      try {
        // Check MinIO availability by calling health endpoint
        const healthResponse = await fetch(`${API_BASE_URL}/issues/health/minio`, {
          method: 'GET',
        });

        // Handle health check response
        if (healthResponse.status === 404) {
          // Health endpoint not implemented - proceed with download, handle errors there
          console.log('[Issues] MinIO health endpoint not found (404) - proceeding with export');
        } else if (!healthResponse.ok || (await healthResponse.json()).status !== 'healthy') {
          // MinIO explicitly unhealthy - show modal to ask user
          console.log('[Issues] MinIO health check returned unhealthy - showing modal');
          setIsExportingZip(false);
          setMinioExportUnavailable({
            selectedIssues,
            attachmentsCount: totalAttachments,
          });
          return;
        }
      } catch (error) {
        // MinIO check failed - show modal
        console.log('[Issues] MinIO health check failed:', error);
        setIsExportingZip(false);
        setMinioExportUnavailable({
          selectedIssues,
          attachmentsCount: totalAttachments,
        });
        return;
      }
    }

    // Proceed with ZIP creation
    setIsExportingZip(true);
    if (skipAttachments) {
      toast.info(t('pages.issues.exportZipStarted', { count: selectedIssues.length }));
    }

    // Track errors
    const deletedRecords: string[] = [];
    const missingAttachments: string[] = [];
    const minioErrors: string[] = [];
    let successCount = 0;

    try {
      const zip = new JSZip();
      const dateStr = new Date().toISOString().split('T')[0];

      // CSV headers for individual issue export
      const csvHeaders = [
        'ID', 'Kód', 'Názov', 'Popis', 'Typ', 'Závažnosť', 'Stav', 'Priorita',
        'Kategória', 'Reporter ID', 'Assignee ID', 'Riešenie',
        'Vytvorené', 'Aktualizované', 'Vyriešené', 'Uzatvorené', 'Vymazané',
        'Typ chyby', 'Chybová správa',
        'Prehliadač', 'OS', 'URL', 'Viewport', 'Screen', 'Timestamp', 'User Agent',
        'Počet príloh',
      ];

      for (const issue of selectedIssues) {
        try {
          // Folder name: issue_code_uuid
          const folderName = `${issue.issue_code}_${issue.id}`;
          const folder = zip.folder(folderName);

          if (!folder) continue;

          // Clean issue data (remove isActive)
          const { isActive, ...cleanIssue } = issue as Issue & { isActive?: boolean };

          // Add issue.json (full data)
          folder.file('issue.json', JSON.stringify(cleanIssue, null, 2));

          // Create CSV content for single issue
          const csvRow = [
            issue.id,
            issue.issue_code,
            issue.title,
            issue.description || '',
            issue.type,
            issue.severity,
            issue.status,
            issue.priority,
            issue.category || '',
            issue.reporter_id,
            issue.assignee_id || '',
            issue.resolution || '',
            issue.created_at,
            issue.updated_at || '',
            issue.resolved_at || '',
            issue.closed_at || '',
            issue.deleted_at || '',
            issue.error_type || '',
            issue.error_message || '',
            issue.system_info?.browser || '',
            issue.system_info?.os || '',
            issue.system_info?.url || '',
            issue.system_info?.viewport || '',
            issue.system_info?.screen || '',
            issue.system_info?.timestamp || '',
            issue.system_info?.userAgent || '',
            issue.attachments?.length || 0,
          ].map(val => {
            const str = String(val);
            // Escape quotes and wrap in quotes if contains comma or newline
            if (str.includes(',') || str.includes('\n') || str.includes('"')) {
              return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
          });

          const csvContent = [csvHeaders.join(','), csvRow.join(',')].join('\n');
          folder.file('issue.csv', csvContent);

          // Download and add attachments (if not skipping)
          if (!skipAttachments && issue.attachments && issue.attachments.length > 0) {
            const attachmentsFolder = folder.folder('attachments');
            if (attachmentsFolder) {
              for (const attachment of issue.attachments) {
                try {
                  // Download attachment from MinIO via backend
                  const attachmentUrl = `${API_BASE_URL}/issues/${issue.id}/attachments/${encodeURIComponent(attachment.file_name)}`;
                  const attachmentResponse = await fetch(attachmentUrl);

                  if (attachmentResponse.ok) {
                    const blob = await attachmentResponse.blob();
                    attachmentsFolder.file(attachment.file_name, blob);
                    console.log(`[Issues] ✅ Added attachment: ${attachment.file_name}`);
                  } else if (attachmentResponse.status === 404) {
                    // Attachment was deleted - track it
                    console.warn(`[Issues] ⚠️ Attachment ${attachment.file_name} not found (404)`);
                    missingAttachments.push(`${issue.issue_code}: ${attachment.file_name}`);
                  } else if (attachmentResponse.status === 503) {
                    // MinIO went down during download - track the issue
                    console.warn(`[Issues] ⚠️ MinIO unavailable for ${issue.issue_code}`);
                    if (!minioErrors.includes(issue.issue_code)) {
                      minioErrors.push(issue.issue_code);
                    }
                  } else {
                    // Other errors (500, etc.) - treat as missing/corrupted file
                    console.warn(`[Issues] ⚠️ Failed to download: ${attachment.file_name} (${attachmentResponse.status})`);
                    missingAttachments.push(`${issue.issue_code}: ${attachment.file_name}`);
                  }
                } catch (err) {
                  // Network error - MinIO might have gone down
                  console.error(`[Issues] ❌ Error downloading ${attachment.file_name}:`, err);
                  if (!minioErrors.includes(issue.issue_code)) {
                    minioErrors.push(issue.issue_code);
                  }
                }
              }
            }
          }

          successCount++;
        } catch (err) {
          // Error processing this issue - continue with others
          console.error(`[Issues] ❌ Error exporting issue ${issue.issue_code}:`, err);
        }
      }

      // Generate ZIP first (we'll need it either way)
      const zipBlob = successCount > 0 ? await zip.generateAsync({ type: 'blob' }) : null;
      const zipFileName = `issues_export_${dateStr}.zip`;

      // If there were missing attachments, show modal and wait for user decision
      if (missingAttachments.length > 0) {
        setExportErrors({
          deletedRecords,
          missingAttachments,
          minioErrors,
          successCount,
          selectedIssues,
          pendingZipBlob: zipBlob || undefined,
          zipFileName,
        });
        setIsExportingZip(false);
        return;
      }

      // If there were MinIO errors (503/network), show modal
      if (minioErrors.length > 0) {
        setExportErrors({
          deletedRecords,
          missingAttachments,
          minioErrors,
          successCount,
          selectedIssues,
          pendingZipBlob: zipBlob || undefined,
          zipFileName,
        });
        setIsExportingZip(false);
        return;
      }

      // No attachment errors - download ZIP directly
      if (successCount > 0 && zipBlob) {
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = zipFileName;
        link.click();
        URL.revokeObjectURL(url);

        const format = skipAttachments ? 'ZIP (bez príloh)' : 'ZIP';

        if (deletedRecords.length > 0) {
          toast.warning(t('pages.issues.exportPartialSuccess', {
            success: successCount,
            deleted: deletedRecords.length
          }));
        } else if (skipAttachments) {
          toast.warning(t('pages.issues.exportSuccessNoAttachments', { count: successCount }));
        } else {
          toast.success(t('pages.issues.exportSuccess', { count: successCount, format }));
        }
      } else if (deletedRecords.length > 0) {
        toast.error(t('pages.issues.exportZipNoContent'));
      }
    } catch (error) {
      console.error('[Issues] ZIP export failed:', error);
      toast.error(t('pages.issues.exportZipError'));
    } finally {
      setIsExportingZip(false);
      setMinioExportUnavailable(null);
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
      // Check MinIO availability again
      const healthResponse = await fetch(`${API_BASE_URL}/issues/health/minio`, {
        method: 'GET',
      });

      // If health endpoint doesn't exist (404), proceed anyway - we'll handle errors during download
      if (healthResponse.status === 404) {
        console.log('[Issues] Health endpoint not found (404) - proceeding with retry');
        setMinioExportUnavailable(null);
        handleExportZIP(false);
        return;
      }

      if (!healthResponse.ok || (await healthResponse.json()).status !== 'healthy') {
        // Explicitly unhealthy - stay on modal
        toast.warning(t('pages.issues.minioExportError.title'));
        return;
      }

      // MinIO is healthy - close modal and proceed
      setMinioExportUnavailable(null);
      handleExportZIP(false);
    } catch (error) {
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
      const result = await issueWorkflow<Issue>({
        endpoint: `/issues/${updateError.issueId}`,
        method: 'PUT',
        data: updateError.updates,
        permissionLevel: updateError.permissionLevel,
        healthChecks: { minio: false },
        messages: {
          serviceDown: t('pages.issues.updateError.serviceDown'),
          sqlDown: t('pages.issues.updateError.sqlDown'),
          notFound: t('pages.issues.updateError.notFound'),
          permissionDenied: t('pages.issues.updateError.permissionDenied'),
          validation: t('pages.issues.updateError.validation'),
          generic: t('pages.issues.updateError.generic'),
        },
        debug: analyticsSettings.logIssueWorkflow,
        caller: 'Issues.handleRetryUpdate',
        onServiceAlive: () => {
          console.log('[Issues] ✅ Service is alive on retry');
        },
        onTakingLonger: () => {
          toast.info(t('pages.issues.updateError.takingLonger'), { duration: 20000 });
        },
        onRetry: (attempt: number, max: number) => {
          toast.info(t('pages.issues.updateError.retrying', { attempt, max }), { duration: 20000 });
        },
      });

      if (result.success && result.data) {
        // Success! Close retry modal and update state
        setUpdateError(null);
        toast.success(t('pages.issues.updateSuccess'));

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
          item.id === updateError.issueId ? { ...item, ...normalizedIssue } : item
        ));
        // Update viewed issue
        setIssueToView((prev) => prev ? { ...prev, ...normalizedIssue } : prev);

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
      const response = await fetch(`${API_BASE_URL}/issues/${issueToPermanentlyDelete.id}/permanent`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        // Check for MinIO unavailable (503)
        if (response.status === 503) {
          console.log('[Issues] ⚠️ MinIO unavailable - showing special modal (no changes made yet)');
          // Close the permanent delete modal and show MinIO unavailable modal
          // NOTE: Backend did NOT mark the issue yet - user can cancel safely
          const issueToHandle = issueToPermanentlyDelete;
          setIssueToPermanentlyDelete(null);
          setMinioFailedItems([issueToHandle]);
          // DON'T refresh - nothing has changed yet
          return;
        }

        // Try to get detailed error message from response body
        let errorDetail = response.statusText;
        try {
          const errorData = await response.json();
          errorDetail = errorData.detail || errorDetail;
        } catch {
          // JSON parse failed, use statusText
        }
        throw new Error(errorDetail);
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

  // ============================================================
  // LOADING / ERROR STATES
  // ============================================================

  if (loading) {
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
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>Loading issues...</p>
          </div>
        </div>
      </BasePage>
    );
  }

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
                  className={styles.actionButton}
                  onClick={handleBulkDelete}
                  disabled={selectedRows.size === 0 || !canDelete}
                >
                  🗑️ {t('common.delete')}
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
                      ⚠️ {t('pages.issues.exportErrors.minioTitle', { count: exportErrors.minioErrors.length })}:
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
            // Use universal issueWorkflow with retry logic
            const result = await issueWorkflow<Issue>({
              endpoint: `/issues/${issueId}`,
              method: 'PUT',
              data: updates as Record<string, unknown>,
              permissionLevel,
              healthChecks: { minio: false },
              messages: {
                serviceDown: t('pages.issues.updateError.serviceDown'),
                sqlDown: t('pages.issues.updateError.sqlDown'),
                notFound: t('pages.issues.updateError.notFound'),
                permissionDenied: t('pages.issues.updateError.permissionDenied'),
                validation: t('pages.issues.updateError.validation'),
                generic: t('pages.issues.updateError.generic'),
              },
              debug: analyticsSettings.logIssueWorkflow,
              caller: 'Issues.onSave',
              onServiceAlive: () => {
                console.log('[Issues] ✅ Service is alive');
              },
              onServiceDown: () => {
                toast.error(t('pages.issues.updateError.serviceDown'), { duration: 20000 });
              },
              onTakingLonger: () => {
                toast.info(t('pages.issues.updateError.takingLonger'), { duration: 20000 });
              },
              onRetry: (attempt: number, max: number) => {
                toast.info(t('pages.issues.updateError.retrying', { attempt, max }), { duration: 20000 });
              },
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
          onExport={(issue, format) => {
            console.log(`[Issues] Export issue ${issue.issue_code} as ${format}`);

            if (format === 'csv') {
              // Single issue CSV export
              const headers = [
                'ID',
                t('pages.issues.columns.issue_code'),
                t('pages.issues.columns.title'),
                t('pages.issues.details.description'),
                t('pages.issues.details.type'),
                t('pages.issues.details.severity'),
                t('pages.issues.columns.status'),
                t('pages.issues.details.priority'),
                t('pages.issues.details.category'),
                t('pages.issues.details.created_at'),
              ];
              const exportData = [{
                id: issue.id,
                issue_code: issue.issue_code,
                title: issue.title,
                description: issue.description || '',
                type: issue.type,
                severity: issue.severity,
                status: issue.status,
                priority: issue.priority,
                category: issue.category || '',
                created_at: issue.created_at,
              }];
              exportToCSV(exportData, headers, `issue_${issue.issue_code}_${new Date().toISOString().split('T')[0]}`);
              toast.success(t('pages.issues.exportSuccess', { count: 1, format: 'CSV' }));

            } else if (format === 'json') {
              // Single issue JSON export
              const { isActive, ...cleanIssue } = issue as Issue & { isActive?: boolean };
              exportToJSON([cleanIssue], `issue_${issue.issue_code}_${new Date().toISOString().split('T')[0]}`);
              toast.success(t('pages.issues.exportSuccess', { count: 1, format: 'JSON' }));

            } else if (format === 'zip') {
              // Single issue ZIP export - use existing bulk function with selection
              setSelectedRows(new Set([issue.id]));
              // Use setTimeout to ensure state update before calling handleExportZIP
              setTimeout(() => handleExportZIP(), 0);
            }
          }}
          onSaveAttachments={async (issueId, deletedAttachments, newFiles) => {
            console.log('═══════════════════════════════════════════════════════════════');
            console.log('[AttachmentSave] STEP 0: Starting attachment save operation');
            console.log('[AttachmentSave] Issue ID:', issueId);
            console.log('[AttachmentSave] Files to DELETE:', deletedAttachments.map(a => a.file_name));
            console.log('[AttachmentSave] Files to UPLOAD:', newFiles.map(f => `${f.name} (${(f.size / 1024).toFixed(1)} KB)`));
            console.log('═══════════════════════════════════════════════════════════════');

            try {
              // ─────────────────────────────────────────────────────────────────
              // STEP 1: Pre-flight Backend health check
              // NOTE: MinIO is checked by backend during operations (CORS prevents direct check)
              // ─────────────────────────────────────────────────────────────────
              console.log('[AttachmentSave] STEP 1: Backend health check - STARTING');
              console.log('[AttachmentSave] STEP 1: NOTE: MinIO checked by backend (CORS prevents direct browser check)');

              const healthStartTime = performance.now();
              const healthResult = await checkMultipleStoragesHealth(
                [
                  {
                    type: 'sql' as const,
                    baseUrl: API_BASE_URL,
                    healthEndpoint: '/health',
                    displayName: 'Issues Service',
                  },
                ],
                {
                  onSlowOperation: () => {
                    console.log('[AttachmentSave] STEP 1: Health check - SLOW (>5s)');
                    toast.warning(t('storage.slowOperation'));
                  },
                  onRetry: (attempt, delay) => {
                    console.log(`[AttachmentSave] STEP 1: Health check retry ${attempt}, waiting ${delay}ms`);
                  },
                }
              );
              const healthDuration = performance.now() - healthStartTime;

              const sqlResult = healthResult.results.get('sql');
              const statusIcon = sqlResult?.status === 'healthy' ? '✅' : '❌';
              console.log(`[AttachmentSave] STEP 1: Issues Service: ${statusIcon} ${sqlResult?.status} (${sqlResult?.responseTime?.toFixed(0)}ms)`);

              if (!healthResult.allHealthy) {
                console.log('[AttachmentSave] STEP 1: Backend unavailable - ❌ CANNOT PROCEED');
                toast.error(t('storage.unavailable', { storage: 'Issues Service' }));
                return false;
              }

              console.log(`[AttachmentSave] STEP 1: Backend health check - ✅ OK (${healthDuration.toFixed(0)}ms)`);

              // ─────────────────────────────────────────────────────────────────
              // STEP 2: Delete marked attachments
              // ─────────────────────────────────────────────────────────────────
              if (deletedAttachments.length > 0) {
                console.log(`[AttachmentSave] STEP 2: Deleting ${deletedAttachments.length} attachments - STARTING`);

                for (let i = 0; i < deletedAttachments.length; i++) {
                  const attachment = deletedAttachments[i];
                  console.log(`[AttachmentSave] STEP 2.${i + 1}: Deleting "${attachment.file_name}" - STARTING`);

                  const deleteUrl = `${API_BASE_URL}/issues/${issueId}/attachments/${attachment.file_name}`;
                  console.log(`[AttachmentSave] STEP 2.${i + 1}: DELETE ${deleteUrl}`);

                  const deleteStartTime = performance.now();
                  const deleteResponse = await fetch(deleteUrl, { method: 'DELETE' });
                  const deleteDuration = performance.now() - deleteStartTime;

                  console.log(`[AttachmentSave] STEP 2.${i + 1}: Response status=${deleteResponse.status}, duration=${deleteDuration.toFixed(0)}ms`);

                  if (!deleteResponse.ok) {
                    console.log(`[AttachmentSave] STEP 2.${i + 1}: Deleting "${attachment.file_name}" - ❌ FAILED`);
                    console.log('[AttachmentSave] ERROR: Delete failed, aborting operation');
                    toast.error(t('pages.issues.attachmentEdit.saveError'));
                    return false;
                  }

                  console.log(`[AttachmentSave] STEP 2.${i + 1}: Deleting "${attachment.file_name}" - ✅ OK`);
                }

                console.log('[AttachmentSave] STEP 2: All deletions - ✅ OK');
              } else {
                console.log('[AttachmentSave] STEP 2: No files to delete - SKIPPED');
              }

              // ─────────────────────────────────────────────────────────────────
              // STEP 3: Upload new files
              // ─────────────────────────────────────────────────────────────────
              if (newFiles.length > 0) {
                console.log(`[AttachmentSave] STEP 3: Uploading ${newFiles.length} files - STARTING`);

                const formData = new FormData();
                newFiles.forEach((file, i) => {
                  formData.append('files', file);
                  console.log(`[AttachmentSave] STEP 3: Added file ${i + 1}/${newFiles.length}: "${file.name}" (${(file.size / 1024).toFixed(1)} KB, type=${file.type})`);
                });

                const uploadUrl = `${API_BASE_URL}/issues/${issueId}/attachments`;
                console.log(`[AttachmentSave] STEP 3: POST ${uploadUrl}`);

                const uploadStartTime = performance.now();
                const uploadResponse = await fetch(uploadUrl, { method: 'POST', body: formData });
                const uploadDuration = performance.now() - uploadStartTime;

                console.log(`[AttachmentSave] STEP 3: Response status=${uploadResponse.status}, duration=${uploadDuration.toFixed(0)}ms`);

                if (!uploadResponse.ok) {
                  const errorBody = await uploadResponse.text().catch(() => 'N/A');
                  console.log('[AttachmentSave] STEP 3: Upload - ❌ FAILED');
                  console.log('[AttachmentSave] ERROR: Response body:', errorBody);
                  toast.error(t('pages.issues.attachmentEdit.saveError'));
                  return false;
                }

                const uploadResult = await uploadResponse.json().catch(() => null);
                console.log('[AttachmentSave] STEP 3: Upload result:', uploadResult);
                console.log('[AttachmentSave] STEP 3: Upload - ✅ OK');
              } else {
                console.log('[AttachmentSave] STEP 3: No files to upload - SKIPPED');
              }

              // ─────────────────────────────────────────────────────────────────
              // STEP 4: Refresh issue data
              // ─────────────────────────────────────────────────────────────────
              console.log('[AttachmentSave] STEP 4: Refreshing issue data - STARTING');

              const refreshUrl = `${API_BASE_URL}/issues/${issueId}`;
              console.log(`[AttachmentSave] STEP 4: GET ${refreshUrl}`);

              const refreshStartTime = performance.now();
              const issueResponse = await fetch(refreshUrl);
              const refreshDuration = performance.now() - refreshStartTime;

              console.log(`[AttachmentSave] STEP 4: Response status=${issueResponse.status}, duration=${refreshDuration.toFixed(0)}ms`);

              if (issueResponse.ok) {
                const updatedIssue = await issueResponse.json();
                console.log('[AttachmentSave] STEP 4: Issue attachments after update:', updatedIssue.attachments?.map((a: Attachment) => a.file_name) || []);

                // Update local state
                setIssues((prev) => prev.map((item) =>
                  item.id === issueId ? { ...item, ...updatedIssue } : item
                ));
                // Update viewed issue
                setIssueToView((prev) => prev ? { ...prev, ...updatedIssue } : prev);
                // Clear attachment status cache for this issue - forces re-check
                setAttachmentStatus((prev) => {
                  const newMap = new Map(prev);
                  newMap.delete(issueId);
                  return newMap;
                });

                console.log('[AttachmentSave] STEP 4: State updated - ✅ OK');
              } else {
                console.log('[AttachmentSave] STEP 4: Refresh failed - ⚠️ WARNING (non-blocking)');
              }

              // ─────────────────────────────────────────────────────────────────
              // COMPLETE
              // ─────────────────────────────────────────────────────────────────
              console.log('═══════════════════════════════════════════════════════════════');
              console.log('[AttachmentSave] ALL STEPS COMPLETED - ✅ SUCCESS');
              console.log('═══════════════════════════════════════════════════════════════');
              return true;

            } catch (error) {
              console.log('═══════════════════════════════════════════════════════════════');
              console.log('[AttachmentSave] UNEXPECTED ERROR - ❌ FAILED');
              console.error('[AttachmentSave] Error details:', error);
              console.log('═══════════════════════════════════════════════════════════════');
              toast.error(t('pages.issues.attachmentEdit.saveError'));
              return false;
            }
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

        {/* Loading Overlay for ZIP Export */}
        {isExportingZip && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
          >
            <Spinner size="large" />
            <p style={{ color: 'white', marginTop: '16px', fontSize: '16px' }}>
              {t('pages.issues.exportZipLoading')}
            </p>
          </div>
        )}
      </div>
    </BasePage>
  );
}
