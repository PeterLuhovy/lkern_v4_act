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

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BasePage, PageHeader, FilteredDataGrid, CreateIssueModal, IssueTypeSelectModal, ConfirmModal, ExportButton } from '@l-kern/ui-components';
import type { FilterConfig, QuickFilterConfig } from '@l-kern/ui-components';
import { useTranslation, useAuthContext, useTheme, useToast, COLORS, getBackendRole, formatDateTime, formatDate } from '@l-kern/config';
import { DeletionAuditModal } from './DeletionAuditModal';
import { exportToCSV, exportToJSON } from '@l-kern/config';
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

  // Authorization checks - Use centralized permissions from context (DRY)
  const { canEdit, canDelete, canExport, canViewDeleted } = permissions;
  const canCreate = true; // SPECIAL: All users can report issues (Bug Reports)

  // Log authorization changes only when permission level changes
  useEffect(() => {
    console.log('[Issues] 🔐 Permission level:', permissionLevel);
    console.log('[Issues] 🔐 Authorization:', { canCreate, canEdit, canDelete, canExport, canViewDeleted });
  }, [permissionLevel, canCreate, canEdit, canDelete, canExport, canViewDeleted]); // Only run when permissions change

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

  // Bulk delete states
  const [bulkDeleteType, setBulkDeleteType] = useState<'soft' | 'hard' | 'mixed' | null>(null);
  const [bulkDeleteCounts, setBulkDeleteCounts] = useState({ active: 0, deleted: 0 });

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
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch issues: ${response.statusText}`);
      }

      const data = await response.json();

      // Add computed 'isActive' field (inverted from 'deleted_at')
      // FilteredDataGrid expects 'true' = active, but deleted_at !== null means inactive
      const issuesWithActive = data.map((issue: Issue) => ({
        ...issue,
        isActive: issue.deleted_at === null,
      }));

      setIssues(issuesWithActive);
    } catch (err) {
      console.error('[Issues] Error fetching issues:', err);
      if (isInitial) {
        setError(err instanceof Error ? err.message : 'Failed to fetch issues');
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
          {row.deleted_at !== null && <span style={{ color: 'var(--color-status-warning, #FF9800)', fontSize: '1.1em' }} title="Deleted issue">⚠️</span>}
          {row.deletion_audit_id && (
            <span style={{ color: "var(--color-status-error, #f44336)", fontSize: "1.1em" }} title={t("issues.deletionAudit.deletionFailed")}>🔴</span>
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
      title: t('common.view'),
      onClick: (item: Issue) => {
        navigate(`/issues/${item.id}`);
      },
      variant: 'secondary' as const,
      // View is always visible for all users
    },
    {
      label: '✏️',
      title: t('common.edit'),
      onClick: (item: Issue) => {
        console.log(`[Issues] Edit clicked for: ${item.issue_code}`);
        // TODO: Open edit modal
      },
      variant: 'primary' as const,
      disabled: () => !canEdit, // Disabled if no permission
      hidden: (item: Issue) => item.deleted_at !== null, // Hidden for soft-deleted items
    },
    {
      label: '🗑️',
      title: t('common.delete'),
      onClick: (item: Issue) => {
        setIssueToDelete(item);
      },
      variant: 'danger' as const,
      disabled: () => !canDelete, // Disabled if no permission
      hidden: (item: Issue) => item.deleted_at !== null, // Hidden for soft-deleted items
    },
    {
      label: '↩️',
      title: t('common.restore'),
      onClick: (item: Issue) => {
        setIssueToRestore(item);
      },
      variant: 'primary' as const,
      disabled: () => !canDelete, // Disabled if no permission
      hidden: (item: Issue) => item.deleted_at === null, // Hidden for active items (only show for soft-deleted)
    },
    {
      label: '💀',
      title: t('common.permanentDelete'),
      onClick: (item: Issue) => {
        setIssueToPermanentlyDelete(item);
      },
      variant: 'danger' as const,
      disabled: () => !canDelete, // Disabled if no permission
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
    // Debug: Log attachments structure
    if (item.attachments && item.attachments.length > 0) {
      console.log('[Issues] Attachments for', item.issue_code, ':', item.attachments);
      console.log('[Issues] First attachment structure:', JSON.stringify(item.attachments[0], null, 2));
    }

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
              {item.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className={styles.attachmentCard}
                  onClick={() => {
                    console.log(`[Issues] Download attachment: ${attachment.file_name}`);
                    // TODO: Implement file download
                  }}
                  title={t('pages.issues.details.clickToDownload')}
                >
                  <div className={styles.attachmentFileName}>
                    📎 {attachment.file_name}
                  </div>
                  <div className={styles.attachmentMeta}>
                    <span>{(attachment.file_size / 1024).toFixed(2)} KB</span>
                    <span>•</span>
                    <span>{formatDate(attachment.uploaded_at, language)}</span>
                  </div>
                </div>
              ))}
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

  const handleCreateIssue = async (formData: any) => {
    try {
      // Determine role based on permission level
      const role = getBackendRole(permissionLevel);

      // Prepare issue data (without attachments field - files will be separate)
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

      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();

      // Add JSON data as string
      formDataToSend.append('data', JSON.stringify(issueData));

      // Add role
      formDataToSend.append('role', role);

      // Add files if present (formData.attachments is array of File objects)
      if (formData.attachments && Array.isArray(formData.attachments)) {
        formData.attachments.forEach((file: File) => {
          formDataToSend.append('files', file);
        });
        console.log(`[Issues] Adding ${formData.attachments.length} files to upload`);
      }

      const response = await fetch(`${API_BASE_URL}/issues/`, {
        method: 'POST',
        // DON'T set Content-Type header - browser will set it automatically with boundary
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Issues] API error:', errorText);
        throw new Error(`Failed to create issue: ${response.status} ${response.statusText}`);
      }

      const createdIssue = await response.json();
      console.log('[Issues] ✅ Issue created:', createdIssue.issue_code);

      // Close modal
      setIsCreateModalOpen(false);

      // Refresh issues list
      await fetchIssues();

      // TODO: Show toast notification
    } catch (err) {
      console.error('[Issues] Error creating issue:', err);
      // TODO: Show error toast notification
    }
  };

  const handleBulkExport = () => {
    if (selectedRows.size === 0) return;
    console.log(`[Issues] Bulk export requested for ${selectedRows.size} issues`);
    // TODO: Implement CSV/PDF export + show toast notification
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

      // Hard delete soft-deleted items
      if (deletedItems.length > 0) {
        for (const issue of deletedItems) {
          await fetch(`${API_BASE_URL}/issues/${issue.id}/permanent`, { method: 'DELETE' });
        }
        console.log(`[Issues] ✅ Hard deleted ${deletedItems.length} soft-deleted issues`);
      }

      // Close modal and refresh
      setBulkDeleteType(null);
      setSelectedRows(new Set());
      await fetchIssues();
    } catch (error) {
      console.error('[Issues] ❌ Error during bulk delete:', error);
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

    try {
      const response = await fetch(`${API_BASE_URL}/issues/${issueToPermanentlyDelete.id}/permanent`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to permanently delete issue: ${response.statusText}`);
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

  if (error) {
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
          <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
            <p>Error: {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
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
                  }}
                  formats={['csv', 'json']}
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

        {/* Create Issue Modal */}
        <CreateIssueModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateIssue}
          initialData={initialIssueData}
          showRoleTabs={false}
          userRole={getBackendRole(permissionLevel)}
          modalId="create-issue-modal"
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
          />
        )}

        {/* Deletion Audit Modal */}
        <DeletionAuditModal
          isOpen={auditModalOpen}
          onClose={() => setAuditModalOpen(false)}
          issueId={selectedAuditIssueId || ''}
        />
      </div>
    </BasePage>
  );
}
