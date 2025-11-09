/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/accessible-emoji */
/*
 * ================================================================
 * FILE: Issues.tsx
 * PATH: /apps/web-ui/src/pages/Issues/Issues.tsx
 * DESCRIPTION: Issues page with FilteredDataGrid
 * VERSION: v1.0.0
 * UPDATED: 2025-11-08
 * ================================================================
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BasePage, PageHeader, FilteredDataGrid, CreateIssueModal, IssueTypeSelectModal } from '@l-kern/ui-components';
import type { FilterConfig, QuickFilterConfig } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import styles from './Issues.module.css';

// ============================================================
// DATA TYPES
// ============================================================

type IssueType = 'BUG' | 'FEATURE' | 'IMPROVEMENT' | 'QUESTION';
type IssueSeverity = 'MINOR' | 'MODERATE' | 'MAJOR' | 'BLOCKER';
type IssueStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REJECTED';
type IssuePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

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
  is_deleted: boolean;
}

// ============================================================
// API CONFIGURATION
// ============================================================

const API_BASE_URL = 'http://localhost:4105'; // Issues Service REST API port

// ============================================================
// COMPONENT
// ============================================================

export function Issues() {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
  }>({});

  // ============================================================
  // FETCH ISSUES FROM API
  // ============================================================

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/issues/`);

        if (!response.ok) {
          throw new Error(`Failed to fetch issues: ${response.statusText}`);
        }

        const data = await response.json();
        setIssues(data);
      } catch (err) {
        console.error('[Issues] Error fetching issues:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch issues');
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  // ============================================================
  // STATUS COLORS (for FilteredDataGrid statusColors prop)
  // ============================================================

  const statusColors = {
    OPEN: '#FF9800',
    ASSIGNED: '#2196F3',
    IN_PROGRESS: '#9c27b0',
    RESOLVED: '#4CAF50',
    CLOSED: '#9e9e9e',
    REJECTED: '#f44336',
  };

  // ============================================================
  // FILTERS
  // ============================================================

  const filters: FilterConfig[] = [
    {
      field: 'type',
      title: t('pages.issues.filters.typeTitle'),
      options: [
        { value: 'BUG', label: t('pages.issues.filters.typeBug') },
        { value: 'FEATURE', label: t('pages.issues.filters.typeFeature') },
        { value: 'IMPROVEMENT', label: t('pages.issues.filters.typeImprovement') },
        { value: 'QUESTION', label: t('pages.issues.filters.typeQuestion') },
      ],
    },
    {
      field: 'severity',
      title: t('pages.issues.filters.severityTitle'),
      options: [
        { value: 'MINOR', label: t('pages.issues.filters.severityMinor') },
        { value: 'MODERATE', label: t('pages.issues.filters.severityModerate') },
        { value: 'MAJOR', label: t('pages.issues.filters.severityMajor') },
        { value: 'BLOCKER', label: t('pages.issues.filters.severityBlocker') },
      ],
    },
    {
      field: 'status',
      title: t('pages.issues.filters.statusTitle'),
      options: [
        { value: 'OPEN', label: t('pages.issues.filters.statusOpen') },
        { value: 'ASSIGNED', label: t('pages.issues.filters.statusAssigned') },
        { value: 'IN_PROGRESS', label: t('pages.issues.filters.statusInProgress') },
        { value: 'RESOLVED', label: t('pages.issues.filters.statusResolved') },
        { value: 'CLOSED', label: t('pages.issues.filters.statusClosed') },
        { value: 'REJECTED', label: t('pages.issues.filters.statusRejected') },
      ],
    },
    {
      field: 'priority',
      title: t('pages.issues.filters.priorityTitle'),
      options: [
        { value: 'LOW', label: t('pages.issues.filters.priorityLow') },
        { value: 'MEDIUM', label: t('pages.issues.filters.priorityMedium') },
        { value: 'HIGH', label: t('pages.issues.filters.priorityHigh') },
        { value: 'CRITICAL', label: t('pages.issues.filters.priorityCritical') },
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
      filterFn: (item: Issue) => item.severity === 'BLOCKER',
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
      render: (value: string) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{value}</span>
      ),
    },
    {
      title: t('pages.issues.columns.title'),
      field: 'title',
      sortable: true,
      width: 300,
    },
    {
      title: t('pages.issues.columns.type'),
      field: 'type',
      sortable: true,
      width: 120,
    },
    {
      title: t('pages.issues.columns.severity'),
      field: 'severity',
      sortable: true,
      width: 120,
    },
    {
      title: t('pages.issues.columns.status'),
      field: 'status',
      sortable: true,
      width: 130,
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
    },
    {
      label: '✏️',
      title: t('common.edit'),
      onClick: (item: Issue) => {
        alert(`${t('common.edit')}: ${item.issue_code}`);
        // TODO: Open edit modal
      },
      variant: 'primary' as const,
    },
    {
      label: '🗑️',
      title: t('common.delete'),
      onClick: (item: Issue) => {
        if (confirm(t('pages.issues.deleteConfirm', { name: item.issue_code }))) {
          alert(t('pages.issues.deleteSuccess', { name: item.issue_code }));
          // TODO: API call for soft delete
        }
      },
      variant: 'danger' as const,
      disabled: (item: Issue) => item.is_deleted,
    },
  ];

  // ============================================================
  // EXPANDED CONTENT
  // ============================================================

  const renderExpandedContent = (item: Issue) => (
    <div className={styles.expandedContent}>
      <h4>{t('pages.issues.detailsTitle', { name: item.issue_code })}</h4>
      <div className={styles.detailsGrid}>
        <div>
          <strong>{t('pages.issues.details.issue_code')}:</strong> {item.issue_code}
        </div>
        <div>
          <strong>{t('pages.issues.details.title')}:</strong> {item.title}
        </div>
        <div>
          <strong>{t('common.name')}:</strong> {item.description}
        </div>
        <div>
          <strong>{t('pages.issues.details.type')}:</strong> {item.type}
        </div>
        <div>
          <strong>{t('pages.issues.details.severity')}:</strong> {item.severity}
        </div>
        <div>
          <strong>{t('pages.issues.details.status')}:</strong> {item.status}
        </div>
        <div>
          <strong>{t('pages.issues.details.priority')}:</strong> {item.priority}
        </div>
        <div>
          <strong>{t('pages.issues.details.created_at')}:</strong> {new Date(item.created_at).toLocaleString()}
        </div>
      </div>
    </div>
  );

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleNewItem = () => {
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

    // Build description with context
    const timestamp = new Date().toLocaleString();
    const viewport = `${window.innerWidth}x${window.innerHeight}`;
    const screen = `${window.screen.width}x${window.screen.height}`;

    const contextDescription = `**Browser Context:**
- URL: ${url}
- Browser: ${browserInfo}
- OS: ${osInfo}
- Viewport: ${viewport}
- Screen: ${screen}
- Timestamp: ${timestamp}

**Issue Description:**
`;

    // Set initial data for modal
    setInitialIssueData({
      type,
      browser: browserInfo,
      os: osInfo,
      url,
      description: contextDescription,
    });

    // Open modal with pre-filled data
    setIsCreateModalOpen(true);
  };

  const handleCreateIssue = (formData: any) => {
    // TODO: API call to create issue
    console.log('Creating issue:', formData);
    alert(`Issue created: ${formData.title}`);
  };

  const handleBulkExport = () => {
    if (selectedRows.size === 0) return;
    alert(t('pages.issues.bulkExport', { count: selectedRows.size }));
    // TODO: Implement CSV/PDF export
  };

  const handleBulkDelete = () => {
    if (selectedRows.size === 0) return;
    if (confirm(t('pages.issues.bulkDeleteConfirm', { count: selectedRows.size }))) {
      alert(t('pages.issues.bulkDeleteSuccess', { count: selectedRows.size }));
      setSelectedRows(new Set());
      // TODO: Implement bulk delete API call
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
          // New Item Button
          onNewItem={handleNewItem}
          newItemText={t('pages.issues.newItemButton')}
          // Inactive Toggle - TEMPORARILY DISABLED FOR DEBUGGING
          // inactiveField="is_deleted"
          // showInactiveLabel={t('pages.issues.showInactiveLabel')}
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
          getRowStatus={(row) => row.status}
          statusColors={statusColors}
          // Grid ID
          gridId="issuesPageDatagrid"
          // Bulk Actions Bar
          betweenContent={
            selectedRows.size > 0 ? (
              <div className={styles.selectedInfo}>
                <div className={styles.selectedCount}>
                  <strong>{t('pages.issues.selectedCount')}:</strong> {selectedRows.size}
                </div>
                <div className={styles.selectedActions}>
                  <button
                    className={styles.actionButton}
                    onClick={handleBulkExport}
                    disabled={selectedRows.size === 0}
                  >
                    📥 {t('common.export')}
                  </button>
                  <button
                    className={styles.actionButton}
                    onClick={handleBulkDelete}
                    disabled={selectedRows.size === 0}
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
            ) : undefined
          }
        />

        {/* Issue Type Select Modal */}
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
          showRoleTabs={true}
          modalId="create-issue-modal"
        />
      </div>
    </BasePage>
  );
}
