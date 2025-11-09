/* eslint-disable no-restricted-globals */
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
import { BasePage, PageHeader, Badge, Button, Card } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
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
  is_deleted: boolean;
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
    OPEN: '#FF9800',
    ASSIGNED: '#2196F3',
    IN_PROGRESS: '#9c27b0',
    RESOLVED: '#4CAF50',
    CLOSED: '#9e9e9e',
    REJECTED: '#f44336',
  };

  const typeColors = {
    BUG: '#f44336',
    FEATURE: '#4CAF50',
    IMPROVEMENT: '#2196F3',
    QUESTION: '#FF9800',
  };

  const severityColors = {
    MINOR: '#9e9e9e',
    MODERATE: '#FF9800',
    MAJOR: '#f44336',
    BLOCKER: '#9c27b0',
  };

  const priorityColors = {
    LOW: '#9e9e9e',
    MEDIUM: '#2196F3',
    HIGH: '#FF9800',
    CRITICAL: '#f44336',
  };

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleBack = () => {
    navigate('/issues');
  };

  const handleEdit = () => {
    alert(`Edit Issue: ${issue.issue_code}`);
    // TODO: Open edit modal
  };

  const handleAssign = () => {
    alert(`Assign Issue: ${issue.issue_code}`);
    // TODO: Open assign modal
  };

  const handleResolve = () => {
    alert(`Resolve Issue: ${issue.issue_code}`);
    // TODO: Open resolve modal
  };

  const handleClose = () => {
    if (confirm(`Close issue ${issue.issue_code}?`)) {
      alert(`Closed: ${issue.issue_code}`);
      // TODO: API call to close issue
    }
  };

  const handleDelete = () => {
    if (confirm(`Delete issue ${issue.issue_code}?`)) {
      alert(`Deleted: ${issue.issue_code}`);
      navigate('/issues');
      // TODO: API call for soft delete
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
    </BasePage>
  );
}
