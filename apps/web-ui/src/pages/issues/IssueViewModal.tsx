/*
 * ================================================================
 * FILE: IssueViewModal.tsx
 * PATH: /apps/web-ui/src/pages/Issues/IssueViewModal.tsx
 * DESCRIPTION: Modal for viewing issue details with edit modal for sections
 * VERSION: v2.0.0
 * CREATED: 2025-11-27
 * UPDATED: 2025-11-29
 *
 * CHANGES (v2.0.0):
 *   - REMOVED: Inline editing (caused layout shift)
 *   - ADDED: IssueEditModal for section editing (opens as nested modal)
 *   - SIMPLIFIED: View-only display with edit buttons opening modal
 * ================================================================
 */

import { useState, useEffect, useMemo } from 'react';
import { Modal, Card, Button, ExportButton } from '@l-kern/ui-components';
import type { ExportFormat } from '@l-kern/ui-components';
import {
  useTranslation,
  useToast,
  COLORS,
  formatDateTime,
  useAuth,
  useIssueFieldPermissions,
  useEntityLookup,
} from '@l-kern/config';
import type { PermissionContext } from '@l-kern/config';
import { contactsApi } from '../../services';
import type { Contact } from '../../services';
import { IssueEditModal, EditSection } from './IssueEditModal';
import { AttachmentEditModal } from './AttachmentEditModal';
import styles from './IssueViewModal.module.css';

// ============================================================
// DATA TYPES
// ============================================================

type IssueType = 'BUG' | 'FEATURE' | 'IMPROVEMENT' | 'QUESTION' | 'bug' | 'feature' | 'improvement' | 'question';
type IssueSeverity = 'MINOR' | 'MODERATE' | 'MAJOR' | 'BLOCKER' | 'minor' | 'moderate' | 'major' | 'blocker';
type IssueStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REJECTED' | 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed' | 'rejected';
type IssuePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'low' | 'medium' | 'high' | 'critical';

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
  category?: string;
  reporter_id: string;
  assignee_id?: string;
  resolution?: string;
  error_message?: string;
  error_type?: string;
  system_info?: {
    browser?: string;
    os?: string;
    url?: string;
    viewport?: string;
    screen?: string;
    timestamp?: string;
    userAgent?: string;
  };
  attachments?: Attachment[];
  created_at: string;
  updated_at?: string;
  resolved_at?: string;
  closed_at?: string;
  deleted_at: string | null;
}

interface IssueViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: Issue | null;
  onExport?: (issue: Issue, format: ExportFormat) => void;
  onSaveAttachments?: (issueId: string, deletedAttachments: Attachment[], newFiles: File[]) => Promise<boolean>;
  onSave?: (issueId: string, updates: Partial<Issue>, permissionLevel: number) => Promise<boolean>;
  onDelete?: (issue: Issue) => Promise<boolean>;
  onRestore?: (issue: Issue) => Promise<boolean>;
  onHardDelete?: (issue: Issue) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  canExport?: boolean;
}

// ============================================================
// API CONFIGURATION
// ============================================================

const API_BASE_URL = 'http://localhost:4105';

// ============================================================
// COMPONENT
// ============================================================

export function IssueViewModal({
  isOpen,
  onClose,
  issue,
  onExport,
  onSaveAttachments,
  onSave,
  onDelete,
  onRestore,
  onHardDelete,
  canEdit = false,
  canDelete = false,
  canExport = true,
}: IssueViewModalProps) {
  const { t, language } = useTranslation();
  const toast = useToast();
  const { user } = useAuth();

  // ============================================================
  // FIELD-LEVEL PERMISSIONS
  // ============================================================

  // Build permission context from current issue
  const permissionContext: PermissionContext = useMemo(() => ({
    entityStatus: issue?.status?.toLowerCase(),
    isOwner: user?.id === issue?.reporter_id,
    isDeleted: issue?.deleted_at !== null,
    entityType: 'issue',
  }), [issue?.status, issue?.reporter_id, issue?.deleted_at, user?.id]);

  // Get field permissions for all issue fields
  const fieldPermissions = useIssueFieldPermissions(
    [
      // Overview fields
      'title', 'type', 'severity', 'status', 'priority', 'category',
      // Description fields
      'description',
      // Resolution fields
      'resolution',
      // Developer info fields
      'error_message', 'error_type', 'system_info',
      // People fields
      'reporter_id', 'assignee_id',
    ],
    permissionContext
  );

  // ============================================================
  // CONTACT LOOKUP (useEntityLookup for reporter & assignee)
  // ============================================================

  // Fetch reporter contact info
  const reporterLookup = useEntityLookup<Contact>({
    service: 'contacts',
    entityId: issue?.reporter_id,
    fetcher: (id) => contactsApi.getContact(id),
    healthChecker: () => contactsApi.health(),
    cacheTtl: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch assignee contact info
  const assigneeLookup = useEntityLookup<Contact>({
    service: 'contacts',
    entityId: issue?.assignee_id,
    fetcher: (id) => contactsApi.getContact(id),
    healthChecker: () => contactsApi.health(),
    cacheTtl: 5 * 60 * 1000, // 5 minutes
  });

  /**
   * Render contact display with status handling
   * Shows: name + position, or loading indicator, or error message
   */
  const renderContactDisplay = (
    lookup: typeof reporterLookup,
    fallbackId: string | undefined,
    emptyLabel: string
  ): React.ReactNode => {
    if (!fallbackId) {
      return <span className={styles.unassigned}>{emptyLabel}</span>;
    }

    switch (lookup.status) {
      case 'idle':
      case 'checking':
      case 'loading':
        return (
          <span className={styles.contactLoading}>
            <span className={styles.loadingDot}>•</span>
            <span className={styles.userId}>{fallbackId}</span>
          </span>
        );

      case 'success':
        return (
          <div className={styles.contactInfo}>
            <span className={styles.contactName}>{lookup.data?.full_name}</span>
            {lookup.data?.position && (
              <span className={styles.contactPosition}>{lookup.data.position}</span>
            )}
          </div>
        );

      case 'service_unavailable':
        return (
          <div className={styles.contactError}>
            <span className={styles.userId}>{fallbackId}</span>
            <span className={styles.contactServiceDown} title={lookup.error || ''}>
              ⚠️ {t('services.unavailable')}
            </span>
          </div>
        );

      case 'not_found':
        return (
          <div className={styles.contactError}>
            <span className={styles.userIdDeleted}>{fallbackId}</span>
            <span className={styles.contactDeleted} title={lookup.error || ''}>
              ❌ {t('services.entityDeleted')}
            </span>
          </div>
        );

      case 'error':
        return (
          <div className={styles.contactError}>
            <span className={styles.userId}>{fallbackId}</span>
            <span className={styles.contactFetchError} title={lookup.error || ''}>
              ⚠️ {t('common.error')}
            </span>
          </div>
        );

      default:
        return <span className={styles.userId}>{fallbackId}</span>;
    }
  };

  // Helper: check if field is visible
  // TODO: Re-enable per-field permissions when needed
  const canViewField = (_field: string): boolean => {
    return true; // All fields visible for now
  };

  // Helper: check if field can be edited (for showing edit buttons)
  // Currently unused since canEditSection always returns canEdit prop
  const canEditField = (_field: string): boolean => {
    return true; // All fields editable for now
  };

  // Section-level edit permission
  // Always show edit button if canEdit prop is true - individual field permissions apply within modal
  const canEditSection = (_section: EditSection): boolean => {
    return canEdit; // Show edit button for all sections when editing is allowed
  };

  // ============================================================
  // EDIT MODAL STATE
  // ============================================================

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editSection, setEditSection] = useState<EditSection>('description');

  // Attachment edit modal state
  const [attachmentEditModalOpen, setAttachmentEditModalOpen] = useState(false);

  // Loading states for delete/restore operations
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // ============================================================
  // ATTACHMENT STATUS STATE
  // ============================================================

  type AttachmentStatus = 'checking' | 'available' | 'unavailable' | 'error';
  const [attachmentStatus, setAttachmentStatus] = useState<Map<string, AttachmentStatus>>(new Map());

  /**
   * Check if attachments are available in MinIO using HEAD request.
   * Distinguishes between: available (200), missing (404), service down (503/network error)
   */
  const checkAttachmentAvailability = async () => {
    if (!issue?.attachments || issue.attachments.length === 0) return;

    // Set all to 'checking' initially
    const initialStatus = new Map<string, AttachmentStatus>();
    issue.attachments.forEach(att => {
      initialStatus.set(att.file_name, 'checking');
    });
    setAttachmentStatus(initialStatus);

    // Check each attachment via HEAD request
    for (const attachment of issue.attachments) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/issues/${issue.id}/attachments/${attachment.file_name}`,
          { method: 'HEAD' }
        );

        // Determine status based on HTTP response code
        let newStatus: AttachmentStatus;
        if (response.ok) {
          newStatus = 'available';
        } else if (response.status === 404) {
          // 404 is expected for deleted files - log at debug level only
          newStatus = 'unavailable';
          console.debug(`[IssueViewModal] Attachment ${attachment.file_name} not found (404)`);
        } else if (response.status === 503) {
          newStatus = 'error';
          console.debug(`[IssueViewModal] MinIO unavailable for ${attachment.file_name} (503)`);
        } else {
          newStatus = 'error';
          console.debug(`[IssueViewModal] Attachment check failed: ${response.status}`);
        }

        setAttachmentStatus(prev => {
          const updated = new Map(prev);
          updated.set(attachment.file_name, newStatus);
          return updated;
        });
      } catch {
        // Network error - service unreachable (silent, expected in some cases)
        setAttachmentStatus(prev => {
          const updated = new Map(prev);
          updated.set(attachment.file_name, 'error');
          return updated;
        });
      }
    }
  };

  // Check attachments when modal opens or attachments change
  useEffect(() => {
    if (isOpen && issue?.attachments && issue.attachments.length > 0) {
      setAttachmentStatus(new Map()); // Reset
      checkAttachmentAvailability();
    }
  }, [isOpen, issue?.id, issue?.attachments?.length]);

  // ============================================================
  // COLORS & BADGES
  // ============================================================

  const statusColors: Record<string, string> = {
    OPEN: COLORS.status.warning,
    open: COLORS.status.warning,
    ASSIGNED: COLORS.status.info,
    assigned: COLORS.status.info,
    IN_PROGRESS: COLORS.brand.primary,
    in_progress: COLORS.brand.primary,
    RESOLVED: COLORS.status.success,
    resolved: COLORS.status.success,
    CLOSED: COLORS.status.muted,
    closed: COLORS.status.muted,
    REJECTED: COLORS.status.error,
    rejected: COLORS.status.error,
  };

  const typeColors: Record<string, string> = {
    BUG: COLORS.status.error,
    bug: COLORS.status.error,
    FEATURE: COLORS.status.success,
    feature: COLORS.status.success,
    IMPROVEMENT: COLORS.status.info,
    improvement: COLORS.status.info,
    QUESTION: COLORS.status.warning,
    question: COLORS.status.warning,
  };

  const severityColors: Record<string, string> = {
    MINOR: COLORS.status.muted,
    minor: COLORS.status.muted,
    MODERATE: COLORS.status.warning,
    moderate: COLORS.status.warning,
    MAJOR: COLORS.status.error,
    major: COLORS.status.error,
    BLOCKER: COLORS.brand.primary,
    blocker: COLORS.brand.primary,
  };

  const priorityColors: Record<string, string> = {
    LOW: COLORS.status.muted,
    low: COLORS.status.muted,
    MEDIUM: COLORS.status.info,
    medium: COLORS.status.info,
    HIGH: COLORS.status.warning,
    high: COLORS.status.warning,
    CRITICAL: COLORS.status.error,
    critical: COLORS.status.error,
  };

  // ============================================================
  // HANDLERS
  // ============================================================

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Get attachment status indicator
  const getAttachmentStatusIndicator = (fileName: string): React.ReactNode => {
    const status = attachmentStatus.get(fileName);
    switch (status) {
      case 'checking':
        return <span title={t('pages.issues.details.attachmentChecking')} style={{ marginLeft: '8px' }}>⏳</span>;
      case 'available':
        return <span title={t('pages.issues.details.attachmentAvailable')} style={{ marginLeft: '8px', color: 'var(--color-status-success)' }}>✓</span>;
      case 'unavailable':
        return <span title={t('pages.issues.details.attachmentUnavailable')} style={{ marginLeft: '8px', color: 'var(--color-status-error)' }}>❌ {t('pages.issues.details.attachmentMissing')}</span>;
      case 'error':
        return <span title={t('pages.issues.details.attachmentError')} style={{ marginLeft: '8px', color: 'var(--color-status-warning)' }}>⚠️ {t('pages.issues.details.attachmentServiceDown')}</span>;
      default:
        return null;
    }
  };

  // Check if attachment is unavailable (for disabling download)
  const isAttachmentUnavailable = (fileName: string): boolean => {
    const status = attachmentStatus.get(fileName);
    return status === 'unavailable' || status === 'error';
  };

  // Open edit modal for specific section
  const handleEditClick = (section: EditSection) => {
    setEditSection(section);
    setEditModalOpen(true);
  };

  // Handle save from edit modal
  const handleEditSave = async (updates: Partial<Issue>, permissionLevel: number): Promise<boolean> => {
    if (!issue || !onSave) return false;

    try {
      const success = await onSave(issue.id, updates, permissionLevel);
      if (success) {
        toast.success(t('common.saved'));
      } else {
        toast.error(t('common.saveFailed'));
      }
      return success;
    } catch (error) {
      console.error('[IssueViewModal] Save error:', error);
      toast.error(t('common.saveFailed'));
      return false;
    }
  };

  // Handle attachment edit save
  const handleAttachmentSave = async (deletedAttachments: Attachment[], newFiles: File[]): Promise<boolean> => {
    if (!issue || !onSaveAttachments) return false;

    try {
      return await onSaveAttachments(issue.id, deletedAttachments, newFiles);
    } catch (error) {
      console.error('[IssueViewModal] Attachment save error:', error);
      return false;
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  if (!issue) return null;

  // Get header class based on issue type
  const typeKey = issue.type.toLowerCase();
  const headerClass = styles[`header${typeKey.charAt(0).toUpperCase() + typeKey.slice(1)}`];
  const modalId = `issue-view-${issue.id}`;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        modalId={modalId}
        title={`${issue.issue_code} - ${issue.title}`}
        size="lg"
        maxWidth="1000px"
        headerClassName={headerClass}
      >
        <div className={styles.content}>
          {/* Soft Delete Warning - shown when issue is deleted */}
          {issue.deleted_at !== null && (
            <div className={styles.deletedWarningBanner}>
              <span className={styles.deletedIcon}>🗑️</span>
              <span>{t('pages.issues.details.deletedItem')}</span>
            </div>
          )}

          {/* Left Column - Details */}
          <div className={styles.leftColumn}>
            {/* Overview Card */}
            <Card className={styles.cardCompact}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{t('pages.issues.view.overview')}</h3>
                {canEditSection('overview') && (
                  <button
                    className={styles.editButton}
                    onClick={() => handleEditClick('overview')}
                    title={t('common.edit')}
                  >
                    ✏️
                  </button>
                )}
              </div>
              {/* Row 1: ID, Code */}
              <div className={styles.overviewRowCompact}>
                <div className={styles.fieldCompact}>
                  <label>{t('pages.issues.details.id')}</label>
                  <span className={styles.userId}>{issue.id}</span>
                </div>
                <div className={styles.fieldCompact}>
                  <label>{t('pages.issues.details.issue_code')}</label>
                  <span>{issue.issue_code}</span>
                </div>
              </div>
              {/* Row 2: Title */}
              <div className={styles.overviewFullWidthCompact}>
                <div className={styles.fieldCompact}>
                  <label>{t('pages.issues.details.title')}</label>
                  <span>{issue.title}</span>
                </div>
              </div>
              {/* Row 3: Type, Severity, Status, Priority, Category - badges */}
              <div className={styles.overviewGrid}>
                <div className={styles.field}>
                  <label>{t('pages.issues.details.type')}</label>
                  <span className={styles.badge} style={{ backgroundColor: typeColors[issue.type] }}>
                    {issue.type.toUpperCase()}
                  </span>
                </div>
                <div className={styles.field}>
                  <label>{t('pages.issues.details.severity')}</label>
                  <span className={styles.badge} style={{ backgroundColor: severityColors[issue.severity] }}>
                    {issue.severity.toUpperCase()}
                  </span>
                </div>
                <div className={styles.field}>
                  <label>{t('pages.issues.details.status')}</label>
                  <span className={styles.badge} style={{ backgroundColor: statusColors[issue.status] }}>
                    {issue.status.toUpperCase().replace('_', ' ')}
                  </span>
                </div>
                <div className={styles.field}>
                  <label>{t('pages.issues.details.priority')}</label>
                  <span className={styles.badge} style={{ backgroundColor: priorityColors[issue.priority] }}>
                    {issue.priority.toUpperCase()}
                  </span>
                </div>
                <div className={styles.field}>
                  <label>{t('pages.issues.details.category')}</label>
                  <span>{issue.category || 'N/A'}</span>
                </div>
              </div>
            </Card>

            {/* Description Card */}
            <Card className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{t('pages.issues.view.description')}</h3>
                {canEditSection('description') && (
                  <button
                    className={styles.editButton}
                    onClick={() => handleEditClick('description')}
                    title={t('common.edit')}
                  >
                    ✏️
                  </button>
                )}
              </div>
              <p className={styles.description}>{issue.description}</p>
            </Card>

            {/* Resolution Card */}
            <Card className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{t('pages.issues.view.resolution')}</h3>
                {canEditSection('resolution') && (
                  <button
                    className={styles.editButton}
                    onClick={() => handleEditClick('resolution')}
                    title={t('common.edit')}
                  >
                    ✏️
                  </button>
                )}
              </div>
              <p className={styles.description}>{issue.resolution || t('pages.issues.view.noResolution')}</p>
            </Card>

            {/* Developer Info Card - only visible if user can view error_type or error_message */}
            {(canViewField('error_type') || canViewField('error_message') || canViewField('system_info')) && (
            <Card className={styles.cardCompact}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{t('pages.issues.view.developerInfo')}</h3>
                {canEditSection('developerInfo') && (
                  <button
                    className={styles.editButton}
                    onClick={() => handleEditClick('developerInfo')}
                    title={t('common.edit')}
                  >
                    ✏️
                  </button>
                )}
              </div>
              {/* Row 1: Browser, OS */}
              <div className={styles.technicalRowCompact}>
                <div className={styles.fieldCompact}>
                  <label>{t('pages.issues.details.browser')}</label>
                  <span>{issue.system_info?.browser || 'N/A'}</span>
                </div>
                <div className={styles.fieldCompact}>
                  <label>{t('pages.issues.details.os')}</label>
                  <span>{issue.system_info?.os || 'N/A'}</span>
                </div>
              </div>
              {/* Row 2: URL, Error Type */}
              <div className={styles.technicalRowCompact}>
                <div className={styles.fieldCompact}>
                  <label>{t('pages.issues.details.url')}</label>
                  {issue.system_info?.url ? (
                    <a href={issue.system_info.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      {issue.system_info.url}
                    </a>
                  ) : (
                    <span>N/A</span>
                  )}
                </div>
                <div className={styles.fieldCompact}>
                  <label>{t('pages.issues.details.errorType')}</label>
                  <span>{issue.error_type || 'N/A'}</span>
                </div>
              </div>
              {/* Row 3: Error Message - full width */}
              <div className={styles.technicalFullWidth}>
                <div className={styles.fieldCompact}>
                  <label>{t('pages.issues.details.errorMessage')}</label>
                  {issue.error_message ? (
                    <pre className={styles.errorMessage}>{issue.error_message}</pre>
                  ) : (
                    <span>N/A</span>
                  )}
                </div>
              </div>
            </Card>
            )}

            {/* Attachments Card */}
            <Card className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  {t('pages.issues.view.attachments')}
                  {issue.attachments && issue.attachments.length > 0 && (
                    <span className={styles.attachmentCount}>({issue.attachments.length})</span>
                  )}
                </h3>
                {canEdit && onSaveAttachments && (
                  <button
                    className={styles.editButton}
                    onClick={() => setAttachmentEditModalOpen(true)}
                    title={t('pages.issues.view.editAttachments')}
                  >
                    ✏️
                  </button>
                )}
              </div>
              {issue.attachments && issue.attachments.length > 0 ? (
                <div className={styles.attachmentsList}>
                  {issue.attachments.map((file, index) => (
                    <div key={index} className={styles.attachmentItem}>
                      <span className={styles.attachmentIcon}>📎</span>
                      <div className={styles.attachmentInfo}>
                        {isAttachmentUnavailable(file.file_name) ? (
                          <span
                            className={styles.attachmentNameDisabled}
                            title={t('pages.issues.details.attachmentCannotDownload')}
                          >
                            {file.file_name}
                          </span>
                        ) : (
                          <a
                            href={`${API_BASE_URL}/issues/${issue.id}/attachments/${file.file_name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.attachmentName}
                          >
                            {file.file_name}
                          </a>
                        )}
                        <span className={styles.attachmentSize}>{formatFileSize(file.file_size)}</span>
                        {getAttachmentStatusIndicator(file.file_name)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.placeholder}>{t('pages.issues.view.noAttachments')}</p>
              )}
            </Card>
          </div>

          {/* Right Column - Metadata */}
          <div className={styles.rightColumn}>
            {/* People Card */}
            <Card className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{t('pages.issues.view.people')}</h3>
                {canEditSection('people') && (
                  <button
                    className={styles.editButton}
                    onClick={() => handleEditClick('people')}
                    title={t('common.edit')}
                  >
                    ✏️
                  </button>
                )}
              </div>
              <div className={styles.peopleGrid}>
                <div className={styles.field}>
                  <label>{t('pages.issues.details.reporterId')}</label>
                  {renderContactDisplay(reporterLookup, issue.reporter_id, t('pages.issues.view.noReporter'))}
                </div>
                <div className={styles.field}>
                  <label>{t('pages.issues.details.assigneeId')}</label>
                  {renderContactDisplay(assigneeLookup, issue.assignee_id, t('pages.issues.view.unassigned'))}
                </div>
              </div>
            </Card>

            {/* Timeline Card */}
            <Card className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{t('pages.issues.view.timeline')}</h3>
                {canEditSection('timeline') && (
                  <button
                    className={styles.editButton}
                    onClick={() => handleEditClick('timeline')}
                    title={t('common.edit')}
                  >
                    ✏️
                  </button>
                )}
              </div>
              <div className={styles.timelineGrid}>
                <div className={styles.field}>
                  <label>{t('pages.issues.details.created_at')}</label>
                  <span className={styles.timestamp}>{formatDateTime(issue.created_at, language)}</span>
                </div>
                <div className={styles.field}>
                  <label>{t('pages.issues.details.updated')}</label>
                  <span className={styles.timestamp}>{issue.updated_at ? formatDateTime(issue.updated_at, language) : 'N/A'}</span>
                </div>
                <div className={styles.field}>
                  <label>{t('pages.issues.details.resolved')}</label>
                  <span className={styles.timestamp}>{issue.resolved_at ? formatDateTime(issue.resolved_at, language) : 'N/A'}</span>
                </div>
                <div className={styles.field}>
                  <label>{t('pages.issues.details.closed')}</label>
                  <span className={styles.timestamp}>{issue.closed_at ? formatDateTime(issue.closed_at, language) : 'N/A'}</span>
                </div>
                <div className={styles.field}>
                  <label>{t('pages.issues.details.deleted')}</label>
                  <span className={styles.timestamp}>{issue.deleted_at ? formatDateTime(issue.deleted_at, language) : 'N/A'}</span>
                </div>
              </div>
            </Card>

            {/* Activity Card (Placeholder) */}
            <Card className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{t('pages.issues.view.activity')}</h3>
                {canEditSection('activity') && (
                  <button
                    className={styles.editButton}
                    onClick={() => handleEditClick('activity')}
                    title={t('common.edit')}
                  >
                    ✏️
                  </button>
                )}
              </div>
              <p className={styles.placeholder}>{t('pages.issues.view.noActivity')}</p>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          {/* Left side - Delete actions */}
          <div className={styles.footerLeft}>
            {issue.deleted_at === null ? (
              // Active issue - show soft delete button
              canDelete && onDelete && (
                <button
                  className={styles.deleteButton}
                  onClick={async () => {
                    setIsDeleting(true);
                    try {
                      const success = await onDelete(issue);
                      if (success) {
                        onClose();
                      }
                    } finally {
                      setIsDeleting(false);
                    }
                  }}
                  disabled={isDeleting}
                  title={t('common.delete')}
                >
                  {isDeleting ? '⏳' : '🗑️'} {isDeleting ? t('common.loading') : t('common.delete')}
                </button>
              )
            ) : (
              // Deleted issue - show restore and hard delete buttons
              <>
                {onRestore && (
                  <button
                    className={styles.restoreButton}
                    onClick={async () => {
                      setIsRestoring(true);
                      try {
                        const success = await onRestore(issue);
                        if (success) {
                          onClose();
                        }
                      } finally {
                        setIsRestoring(false);
                      }
                    }}
                    disabled={isRestoring}
                    title={t('common.restore')}
                  >
                    {isRestoring ? '⏳' : '♻️'} {isRestoring ? t('common.loading') : t('common.restore')}
                  </button>
                )}
                {canDelete && onHardDelete && (
                  <button
                    className={styles.hardDeleteButton}
                    onClick={() => {
                      onHardDelete(issue);
                      onClose();
                    }}
                    disabled={isRestoring}
                    title={t('pages.issues.bulkDelete.titlePermanent')}
                  >
                    ⚠️ {t('pages.issues.bulkDelete.titlePermanent')}
                  </button>
                )}
              </>
            )}
          </div>

          {/* Right side - Export and Close */}
          <div className={styles.footerRight}>
            <ExportButton
              onExport={(format) => onExport && onExport(issue, format)}
              formats={['csv', 'json', 'zip']}
              disabled={!canExport}
              label={t('pages.issues.view.export')}
            />
            <button
              className={styles.closeButton}
              onClick={onClose}
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal - opens as nested modal */}
      {issue && (
        <IssueEditModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleEditSave}
          issue={issue}
          section={editSection}
          parentModalId={modalId}
        />
      )}

      {/* Attachment Edit Modal */}
      {issue && (
        <AttachmentEditModal
          isOpen={attachmentEditModalOpen}
          onClose={() => {
            setAttachmentEditModalOpen(false);
            // Re-check attachment availability after edit modal closes
            checkAttachmentAvailability();
          }}
          issueId={issue.id}
          issueCode={issue.issue_code}
          existingAttachments={issue.attachments || []}
          attachmentStatus={attachmentStatus}
          onSave={handleAttachmentSave}
          parentModalId={modalId}
        />
      )}
    </>
  );
}
