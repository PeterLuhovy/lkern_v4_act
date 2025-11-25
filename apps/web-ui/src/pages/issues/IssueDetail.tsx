/*
 * ================================================================
 * FILE: IssueDetail.tsx
 * PATH: /apps/web-ui/src/pages/issues/IssueDetail.tsx
 * DESCRIPTION: Issue detail page with full information and actions
 * VERSION: v1.0.0
 * CREATED: 2025-11-08
 * UPDATED: 2025-11-08
 * ================================================================
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BasePage,
  PageHeader,
  Badge,
  Button,
  Card,
  AssignIssueModal,
  ResolveIssueModal,
  CloseIssueModal,
  EditIssueModal,
  ConfirmModal,
} from '@l-kern/ui-components';
import { useTranslation, COLORS } from '@l-kern/config';
import styles from './IssueDetail.module.css';

// ============================================================
// DATA TYPES
// ============================================================

type IssueType = 'BUG' | 'FEATURE' | 'IMPROVEMENT' | 'QUESTION';
type IssueSeverity = 'MINOR' | 'MODERATE' | 'MAJOR' | 'BLOCKER';
type IssueStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REJECTED';
type IssuePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
type IssueCategory = 'UI' | 'BACKEND' | 'DATABASE' | 'INTEGRATION' | 'DOCS' | 'PERFORMANCE' | 'SECURITY';

interface Issue {
  id: string;
  issue_code: string;
  title: string;
  description: string;
  type: IssueType;
  severity: IssueSeverity;
  status: IssueStatus;
  priority: IssuePriority;
  category?: IssueCategory;
  reporter_id: string;
  assignee_id?: string;
  resolution?: string;
  error_message?: string;
  error_type?: string;
  browser?: string;
  os?: string;
  url?: string;
  attachments?: any[];
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  closed_at?: string;
  deleted_at: string | null;
}

// ============================================================
// API CONFIGURATION
// ============================================================

const API_BASE_URL = 'http://localhost:4105'; // Issues Service REST API port

// ============================================================
// COMPONENT
// ============================================================

export function IssueDetail() {
  const { t } = useTranslation();
  const { issueId } = useParams<{ issueId: string }>();
  const navigate = useNavigate();

  // State
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // ============================================================
  // FETCH ISSUE FROM API
  // ============================================================

  useEffect(() => {
    const fetchIssue = async () => {
      if (!issueId) {
        setError('No issue ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/issues/${issueId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch issue: ${response.statusText}`);
        }

        const data = await response.json();
        setIssue(data);
      } catch (err) {
        console.error('Error fetching issue:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch issue');
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [issueId]);

  // ============================================================
  // COLORS & BADGES
  // ============================================================

  const statusColors = {
    OPEN: COLORS.status.warning,       // Orange
    ASSIGNED: COLORS.status.info,      // Blue
    IN_PROGRESS: COLORS.brand.primary, // Purple
    RESOLVED: COLORS.status.success,   // Green
    CLOSED: COLORS.status.muted,       // Gray
    REJECTED: COLORS.status.error,     // Red
  };

  const typeColors = {
    BUG: COLORS.status.error,          // Red
    FEATURE: COLORS.status.success,    // Green
    IMPROVEMENT: COLORS.status.info,   // Blue
    QUESTION: COLORS.status.warning,   // Orange
  };

  const severityColors = {
    MINOR: COLORS.status.muted,        // Gray
    MODERATE: COLORS.status.warning,   // Orange
    MAJOR: COLORS.status.error,        // Red
    BLOCKER: COLORS.brand.primary,     // Purple
  };

  const priorityColors = {
    LOW: COLORS.status.muted,          // Gray
    MEDIUM: COLORS.status.info,        // Blue
    HIGH: COLORS.status.warning,       // Orange
    CRITICAL: COLORS.status.error,     // Red
  };

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleBack = () => {
    navigate('/issues');
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleAssign = () => {
    setIsAssignModalOpen(true);
  };

  const handleResolve = () => {
    setIsResolveModalOpen(true);
  };

  const handleClose = () => {
    setIsCloseModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  // ============================================================
  // API HANDLERS
  // ============================================================

  const refetchIssue = async () => {
    if (!issueId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/issues/${issueId}`);
      if (response.ok) {
        const data = await response.json();
        setIssue(data);
      }
    } catch (err) {
      console.error('Error refetching issue:', err);
    }
  };

  const handleAssignSubmit = async (assigneeId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues/${issue?.id}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignee_id: assigneeId }),
      });
      if (response.ok) {
        await refetchIssue();
      } else {
        console.error('Failed to assign issue');
      }
    } catch (err) {
      console.error('Error assigning issue:', err);
    }
  };

  const handleResolveSubmit = async (resolution: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues/${issue?.id}/resolve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolution }),
      });
      if (response.ok) {
        await refetchIssue();
      } else {
        console.error('Failed to resolve issue');
      }
    } catch (err) {
      console.error('Error resolving issue:', err);
    }
  };

  const handleCloseSubmit = async (comment?: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues/${issue?.id}/close`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ closure_comment: comment }),
      });
      if (response.ok) {
        await refetchIssue();
      } else {
        console.error('Failed to close issue');
      }
    } catch (err) {
      console.error('Error closing issue:', err);
    }
  };

  const handleEditSubmit = async (data: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues/${issue?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        await refetchIssue();
      } else {
        console.error('Failed to update issue');
      }
    } catch (err) {
      console.error('Error updating issue:', err);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues/${issue?.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        navigate('/issues');
      } else {
        console.error('Failed to delete issue');
      }
    } catch (err) {
      console.error('Error deleting issue:', err);
    }
  };

  // ============================================================
  // RENDER HELPERS
  // ============================================================

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ============================================================
  // LOADING / ERROR STATES
  // ============================================================

  if (loading) {
    return (
      <BasePage>
        <div className={styles.page}>
          <PageHeader
            title="Loading..."
            subtitle="Please wait"
            breadcrumbs={[
              { name: 'Home', href: '/' },
              { name: 'Issues', href: '/issues' },
              { name: 'Loading...', isActive: true },
            ]}
          />
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>Loading issue details...</p>
          </div>
        </div>
      </BasePage>
    );
  }

  if (error || !issue) {
    return (
      <BasePage>
        <div className={styles.page}>
          <PageHeader
            title="Error"
            subtitle="Issue not found"
            breadcrumbs={[
              { name: 'Home', href: '/' },
              { name: 'Issues', href: '/issues' },
              { name: 'Error', isActive: true },
            ]}
          />
          <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
            <p>Error: {error || 'Issue not found'}</p>
            <Button variant="outline" onClick={() => navigate('/issues')}>
              ← Back to Issues
            </Button>
          </div>
        </div>
      </BasePage>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <BasePage>
      <div className={styles.page}>
        {/* Header */}
        <PageHeader
          title={issue.issue_code}
          subtitle={issue.title}
          breadcrumbs={[
            { name: 'Home', href: '/' },
            { name: 'Issues', href: '/issues' },
            { name: issue.issue_code, isActive: true },
          ]}
        />

        {/* Actions Bar */}
        <div className={styles.actionsBar}>
          <Button variant="outline" onClick={handleBack}>
            ← Back to Issues
          </Button>
          <div className={styles.actionButtons}>
            <Button variant="outline" onClick={handleEdit}>
              ✏️ Edit
            </Button>
            {issue.status === 'OPEN' && (
              <Button variant="primary" onClick={handleAssign}>
                👤 Assign
              </Button>
            )}
            {(issue.status === 'ASSIGNED' || issue.status === 'IN_PROGRESS') && (
              <Button variant="primary" onClick={handleResolve}>
                ✅ Resolve
              </Button>
            )}
            {issue.status === 'RESOLVED' && (
              <Button variant="primary" onClick={handleClose}>
                🔒 Close
              </Button>
            )}
            <Button variant="danger" onClick={handleDelete}>
              🗑️ Delete
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.content}>
          {/* Left Column - Details */}
          <div className={styles.leftColumn}>
            {/* Overview Card */}
            <Card className={styles.card}>
              <h3 className={styles.cardTitle}>Overview</h3>
              <div className={styles.overviewGrid}>
                <div className={styles.field}>
                  <label>Type</label>
                  <Badge variant="neutral" style={{ backgroundColor: typeColors[issue.type], color: '#ffffff' }}>
                    {issue.type}
                  </Badge>
                </div>
                <div className={styles.field}>
                  <label>Severity</label>
                  <Badge variant="neutral" style={{ backgroundColor: severityColors[issue.severity], color: '#ffffff' }}>
                    {issue.severity}
                  </Badge>
                </div>
                <div className={styles.field}>
                  <label>Status</label>
                  <Badge variant="neutral" style={{ backgroundColor: statusColors[issue.status], color: '#ffffff' }}>
                    {issue.status}
                  </Badge>
                </div>
                <div className={styles.field}>
                  <label>Priority</label>
                  <Badge variant="neutral" style={{ backgroundColor: priorityColors[issue.priority], color: '#ffffff' }}>
                    {issue.priority}
                  </Badge>
                </div>
                {issue.category && (
                  <div className={styles.field}>
                    <label>Category</label>
                    <Badge variant="neutral">{issue.category}</Badge>
                  </div>
                )}
              </div>
            </Card>

            {/* Description Card */}
            <Card className={styles.card}>
              <h3 className={styles.cardTitle}>Description</h3>
              <p className={styles.description}>{issue.description}</p>
            </Card>

            {/* Technical Details Card (if available) */}
            {(issue.error_message || issue.error_type || issue.browser || issue.os || issue.url) && (
              <Card className={styles.card}>
                <h3 className={styles.cardTitle}>Technical Details</h3>
                <div className={styles.technicalGrid}>
                  {issue.error_message && (
                    <div className={styles.field}>
                      <label>Error Message</label>
                      <pre className={styles.errorMessage}>{issue.error_message}</pre>
                    </div>
                  )}
                  {issue.error_type && (
                    <div className={styles.field}>
                      <label>Error Type</label>
                      <span>{issue.error_type}</span>
                    </div>
                  )}
                  {issue.browser && (
                    <div className={styles.field}>
                      <label>Browser</label>
                      <span>{issue.browser}</span>
                    </div>
                  )}
                  {issue.os && (
                    <div className={styles.field}>
                      <label>Operating System</label>
                      <span>{issue.os}</span>
                    </div>
                  )}
                  {issue.url && (
                    <div className={styles.field}>
                      <label>URL</label>
                      <a href={issue.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                        {issue.url}
                      </a>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Resolution Card (if resolved/closed) */}
            {issue.resolution && (
              <Card className={styles.card}>
                <h3 className={styles.cardTitle}>Resolution</h3>
                <p className={styles.description}>{issue.resolution}</p>
              </Card>
            )}

            {/* Attachments Card */}
            {issue.attachments && issue.attachments.length > 0 && (
              <Card className={styles.card}>
                <h3 className={styles.cardTitle}>Attachments ({issue.attachments.length})</h3>
                <div className={styles.attachmentsList}>
                  {issue.attachments.map((file, index) => (
                    <div key={index} className={styles.attachmentItem}>
                      <span className={styles.attachmentIcon}>📎</span>
                      <div className={styles.attachmentInfo}>
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className={styles.attachmentName}>
                          {file.name}
                        </a>
                        <span className={styles.attachmentSize}>{formatFileSize(file.size)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Metadata */}
          <div className={styles.rightColumn}>
            {/* People Card */}
            <Card className={styles.card}>
              <h3 className={styles.cardTitle}>People</h3>
              <div className={styles.peopleGrid}>
                <div className={styles.field}>
                  <label>Reporter</label>
                  <span className={styles.userId}>{issue.reporter_id}</span>
                  {/* TODO: Fetch and display user name */}
                </div>
                <div className={styles.field}>
                  <label>Assignee</label>
                  {issue.assignee_id ? (
                    <span className={styles.userId}>{issue.assignee_id}</span>
                  ) : (
                    <span className={styles.unassigned}>Unassigned</span>
                  )}
                  {/* TODO: Fetch and display user name */}
                </div>
              </div>
            </Card>

            {/* Timeline Card */}
            <Card className={styles.card}>
              <h3 className={styles.cardTitle}>Timeline</h3>
              <div className={styles.timelineGrid}>
                <div className={styles.field}>
                  <label>Created</label>
                  <span className={styles.timestamp}>{formatDate(issue.created_at)}</span>
                </div>
                <div className={styles.field}>
                  <label>Updated</label>
                  <span className={styles.timestamp}>{formatDate(issue.updated_at)}</span>
                </div>
                {issue.resolved_at && (
                  <div className={styles.field}>
                    <label>Resolved</label>
                    <span className={styles.timestamp}>{formatDate(issue.resolved_at)}</span>
                  </div>
                )}
                {issue.closed_at && (
                  <div className={styles.field}>
                    <label>Closed</label>
                    <span className={styles.timestamp}>{formatDate(issue.closed_at)}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Activity Card (Placeholder) */}
            <Card className={styles.card}>
              <h3 className={styles.cardTitle}>Activity</h3>
              <p className={styles.placeholder}>No activity yet</p>
              {/* TODO: Add activity timeline with comments and status changes */}
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AssignIssueModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSubmit={handleAssignSubmit}
        issueCode={issue.issue_code}
        issueTitle={issue.title}
      />

      <ResolveIssueModal
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        onSubmit={handleResolveSubmit}
        issueCode={issue.issue_code}
        issueTitle={issue.title}
      />

      <CloseIssueModal
        isOpen={isCloseModalOpen}
        onClose={() => setIsCloseModalOpen(false)}
        onSubmit={handleCloseSubmit}
        issueCode={issue.issue_code}
        issueTitle={issue.title}
      />

      <EditIssueModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        issueCode={issue.issue_code}
        initialData={{
          title: issue.title,
          description: issue.description,
          severity: issue.severity,
          priority: issue.priority,
          category: issue.category,
        }}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={`Delete Issue: ${issue.issue_code}`}
        message={`Are you sure you want to delete "${issue.title}"? This action cannot be undone.`}
        confirmButtonLabel="Delete"
        isDanger
      />
    </BasePage>
  );
}
