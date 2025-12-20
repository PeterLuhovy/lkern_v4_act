/* eslint-disable jsx-a11y/accessible-emoji */
/*
 * ================================================================
 * FILE: Contacts.tsx
 * PATH: /apps/web-ui/src/pages/Contacts/Contacts.tsx
 * DESCRIPTION: Universal contacts for DataGrid pages with FilteredDataGrid
 * VERSION: v1.3.0
 * UPDATED: 2025-12-19
 *
 * * ================================================================
 */

import { useState, useEffect, useCallback } from 'react';
import { BasePage, PageHeader, ConfirmModal, ExportButton, Spinner } from '@l-kern/ui-components';
import { FilteredDataGrid } from '@l-kern/ui-components';
import type { FilterConfig, QuickFilterConfig } from '@l-kern/ui-components';
import { useTranslation, useAuthContext, useTheme, useToast, useAnalyticsContext, COLORS, formatDate, exportToCSV, exportToJSON } from '@l-kern/config';
import styles from './Contacts.module.css';

// ============================================================
// API CONFIGURATION
// ============================================================

/**
 * Service endpoint configuration
 *
 * 🔧 CUSTOMIZATION:
 * Update baseUrl to match your microservice (e.g., lkms105-issues, lkms102-contacts)
 *
 * NOTE: This is commented out as it's not used in the contacts directly.
 * Uncomment and use when implementing actual API calls.
 */
const SERVICE_ENDPOINTS = {
  baseUrl: 'http://localhost:4101',
};

// ============================================================
// DATA TYPES
// ============================================================

/**
 * Contact interface
 *
 * 🔧 CUSTOMIZATION:
 * Replace with your entity fields (e.g., Order, Contact, Invoice)
 */
interface Contact {
  display_name: string;
    contact_type: 'person' | 'company' | 'organizational_unit';
    primary_email: string;
    primary_phone: string;
    contact_code: string;
    roles: string;
    created_at: string;
    id: string;
    is_deleted: boolean;
}

// ============================================================
// MOCK DATA
// ============================================================

/**
 * Mock data for testing
 *
 * 🔧 CUSTOMIZATION:
 * Replace with your entity data or API fetch
 */
const mockData: Contact[] = [
  { display_name: 'Sample display_name 1', contact_type: 'person', primary_email: 'user1@example.com', primary_phone: 'Sample primary_phone 1', id: 'CON-001' },
  { display_name: 'Sample display_name 2', contact_type: 'company', primary_email: 'user2@example.com', primary_phone: 'Sample primary_phone 2', id: 'CON-002' },
  { display_name: 'Sample display_name 3', contact_type: 'organizational_unit', primary_email: 'user3@example.com', primary_phone: 'Sample primary_phone 3', id: 'CON-003' },
  { display_name: 'Sample display_name 4', contact_type: 'person', primary_email: 'user4@example.com', primary_phone: 'Sample primary_phone 4', id: 'CON-004' },
  { display_name: 'Sample display_name 5', contact_type: 'company', primary_email: 'user5@example.com', primary_phone: 'Sample primary_phone 5', id: 'CON-005' }
];

// ============================================================
// API RESPONSE TYPES
// ============================================================

/**
 * API list response structure
 *
 * 🔧 CUSTOMIZATION:
 * Adjust to match your API response format
 */
interface ContactsListApiResponse {
  items: Contact[];
  total: number;
  skip: number;
  limit: number;
}

// ============================================================
// COMPONENT
// ============================================================

export function Contacts() {
  const { t, language } = useTranslation();
  const { permissionLevel, permissions } = useAuthContext();
  const { theme } = useTheme();
  const toast = useToast();
  const { settings: analyticsSettings } = useAnalyticsContext();

  // Authorization checks - Use centralized permissions from context (DRY)
  const { canCreate, canEdit, canDelete, canExport, canViewDeleted } = permissions;
  if (analyticsSettings.logPermissions) {
    console.log('[Contacts] 🔐 Permission level:', permissionLevel);
    console.log('[Contacts] 🔐 Authorization:', { canCreate, canEdit, canDelete, canExport, canViewDeleted });
  }

  // ============================================================
  // API DATA STATE
  // ============================================================

  /**
   * 🔧 CUSTOMIZATION: Choose ONE of these approaches:
   *
   * OPTION A: Mock Data (default - for development/testing)
   * - Uses static mockData array defined above
   * - No API calls, instant loading
   *
   * OPTION B: Real API (uncomment for production)
   * - Fetches from SERVICE_ENDPOINTS.baseUrl
   * - Shows loading spinner during fetch
   * - Handles errors gracefully
   */

  // OPTION A: Mock Data (DISABLED - using real API)
  // const [items] = useState<Contact[]>(mockData);
  // const [isLoading] = useState(false);
  // const [apiError] = useState<string | null>(null);

  // OPTION B: Real API (ACTIVE)
  const [items, setItems] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  //
    /**
   * Fetch items from API
   *
   * ⚠️ IMPORTANT: Dependencies must be STABLE (primitives only)
   * - DO NOT add toast, t, or other hook returns as dependencies
   * - These change on every render and cause infinite loops!
   */
  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await fetch(`${SERVICE_ENDPOINTS.baseUrl}/contacts/?limit=100`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data: ContactsListApiResponse = await response.json();
      setItems(data.items);
      if (analyticsSettings.logToConsole) {
        console.log(`[Contacts] ✅ Loaded ${data.items.length} items from API`);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load items';
      setApiError(errorMsg);
      console.error('[Contacts] ❌ API Error:', errorMsg);
      // Note: Error displayed via apiError state in UI (not toast - avoids re-render loop)
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analyticsSettings.logToConsole]); // Only stable primitive dependencies!
  //
  // Load items on mount only (empty deps = run once)
  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array = run only on mount, NOT on every render

  // Computed data with isActive field for FilteredDataGrid
  const dataWithActive = items.map((item) => ({
    ...item,
    isActive: !item.is_deleted,  // Invert: is_deleted=true means inactive
  }));

  // State management
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [itemToDelete, setItemToDelete] = useState<Contact | null>(null);
  const [itemToRestore, setItemToRestore] = useState<Contact | null>(null);
  const [itemToPermanentlyDelete, setItemToPermanentlyDelete] = useState<Contact | null>(null);

  // Bulk delete states
  const [bulkDeleteType, setBulkDeleteType] = useState<'soft' | 'hard' | 'mixed' | null>(null);
  const [bulkDeleteCounts, setBulkDeleteCounts] = useState({ active: 0, deleted: 0 });

  // MinIO unavailable - items that failed delete (unified for single and bulk)
  const [minioFailedItems, setMinioFailedItems] = useState<Contact[]>([]);

  // Loading states
  const [isPermanentDeleting, setIsPermanentDeleting] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isRetryingDelete, setIsRetryingDelete] = useState(false);

  // ZIP export states
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [exportErrors, setExportErrors] = useState<{
    deletedRecords: string[];
    missingAttachments: string[];
    minioErrors: string[];
    successCount: number;
    selectedItems: (Contact & { isActive: boolean })[];
    pendingZipBlob?: Blob;
    zipFileName?: string;
  } | null>(null);

  // ============================================================
  // STATUS COLORS
  // ============================================================

  /**
   * Row background colors based on status
   *
   * 🔧 CUSTOMIZATION:
   * Adjust colors and statuses to match your entity
   */
  const statusColors = {
    person: COLORS.status.info,
    company: COLORS.status.success,
    organizational_unit: COLORS.status.warning,
    deleted: theme === 'light' ? COLORS.status.inactiveLight : COLORS.status.inactive, // Deleted items - theme-aware red
  };

  /**
   * Status labels for legend display
   *
   * 🔧 CUSTOMIZATION:
   * Labels shown in the status legend (translated)
   */
  const statusLabels = {
    person: t('pages.contacts.statuses.person'),
    company: t('pages.contacts.statuses.company'),
    organizational_unit: t('pages.contacts.statuses.organizational_unit'),
  };

  // ============================================================
  // FILTERS
  // ============================================================

  /**
   * Filter configurations (dropdown filters in FilterPanel)
   *
   * 🔧 CUSTOMIZATION:
   * Add/remove filters based on your entity fields
   */
  const filters: FilterConfig[] = [
    {
      field: 'contact_type',
      title: t('pages.contacts.filters.typeTitle'),
      options: [
      { value: 'person', label: t('pages.contacts.filters.typePerson') },
      { value: 'company', label: t('pages.contacts.filters.typeCompany') },
      { value: 'organizational_unit', label: t('pages.contacts.filters.typeOrganizationalUnit') },
      ],
    },
    {
      field: 'roles',
      title: t('pages.contacts.filters.roleTitle'),
      options: [
      { value: 'supplier', label: t('pages.contacts.filters.roleSupplier') },
      { value: 'customer', label: t('pages.contacts.filters.roleCustomer') },
      { value: 'employee', label: t('pages.contacts.filters.roleEmployee') },
      { value: 'partner', label: t('pages.contacts.filters.rolePartner') },
      ],
    }
  ];

  // ============================================================
  // QUICK FILTERS
  // ============================================================

  /**
   * Quick filters (pill-style filters with custom logic)
   *
   * 🔧 CUSTOMIZATION:
   * Add custom filter logic based on your business rules
   */
  const quickFilters: QuickFilterConfig[] = [
    {
      id: 'persons',
      label: t('pages.contacts.quickFilters.persons'),
      filterFn: (item: Contact) => item.contact_type === 'person',
    },
    {
      id: 'companies',
      label: t('pages.contacts.quickFilters.companies'),
      filterFn: (item: Contact) => item.contact_type === 'company',
    },
    {
      id: 'suppliers',
      label: t('pages.contacts.quickFilters.suppliers'),
      filterFn: (item: Contact) => item.roles?.includes('supplier'),
    },
    {
      id: 'customers',
      label: t('pages.contacts.quickFilters.customers'),
      filterFn: (item: Contact) => item.roles?.includes('customer'),
    }
  ];

  // ============================================================
  // COLUMNS
  // ============================================================

  /**
   * Column definitions for DataGrid
   *
   * 🔧 CUSTOMIZATION:
   * Define columns based on your entity fields
   * - title: Column header (translated)
   * - field: Property name in data object
   * - sortable: Enable sorting
   * - width: Column width in pixels
   * - render: Custom rendering function (optional)
   */
  const columns = [
    {
      title: t('pages.contacts.columns.display_name'),
      field: 'display_name',
      sortable: true,
      width: 250
    },
    {
      title: t('pages.contacts.columns.contact_type'),
      field: 'contact_type',
      sortable: true,
      width: 140,
      render: (value: string) => t('pages.contacts.statuses.' + value) || value
    },
    {
      title: t('pages.contacts.columns.primary_email'),
      field: 'primary_email',
      width: 200
    },
    {
      title: t('pages.contacts.columns.primary_phone'),
      field: 'primary_phone',
      width: 150
    }
  ];

  // ============================================================
  // ACTIONS
  // ============================================================

  /**
   * Row action buttons
   *
   * 🔧 CUSTOMIZATION:
   * Define actions available for each row (edit, view, delete, etc.)
   */
  const actions = [
    {
      label: '👁️',
      title: t('common.view'),
      onClick: (item: Contact) => {
        alert(`${t('common.view')}: ${item.display_name}`);
        // TODO: Implement view modal
      },
      variant: 'secondary' as const,
      // View is always visible for all users
    },
    {
      label: '✏️',
      title: t('common.edit'),
      onClick: (item: Contact) => {
        alert(`${t('common.edit')}: ${item.display_name}`);
        // TODO: Implement edit modal
      },
      variant: 'primary' as const,
      disabled: () => !canEdit, // Disabled if no permission
      hidden: (item: Contact) => item.is_deleted, // Hidden for soft-deleted items
    },
    {
      label: '🗑️',
      title: t('common.delete'),
      onClick: (item: Contact) => {
        setItemToDelete(item);
      },
      variant: 'danger' as const,
      disabled: () => !canDelete, // Disabled if no permission
      hidden: (item: Contact) => item.is_deleted, // Hidden for soft-deleted items
    },
    {
      label: '↩️',
      title: t('common.restore'),
      onClick: (item: Contact) => {
        setItemToRestore(item);
      },
      variant: 'primary' as const,
      disabled: () => !canDelete, // Disabled if no permission
      hidden: (item: Contact) => !item.is_deleted, // Hidden for active items (only show for soft-deleted)
    },
    {
      label: '💀',
      title: t('common.permanentDelete'),
      onClick: (item: Contact) => {
        setItemToPermanentlyDelete(item);
      },
      variant: 'danger' as const,
      disabled: () => !canDelete, // Disabled if no permission
      hidden: (item: Contact) => !item.is_deleted, // Hidden for active items (only show for soft-deleted)
    },
  ];

  // ============================================================
  // EXPANDED CONTENT
  // ============================================================

  /**
   * Render expanded row details
   *
   * 🔧 CUSTOMIZATION:
   * Show additional details when row is expanded
   */
  const renderExpandedContent = (item: Contact) => (
    <div className={styles.expandedContent}>
      <h4>{t('pages.contacts.detailsTitle', { name: item.display_name })}</h4>

      {/* Soft Delete Warning */}
      {item.is_deleted && (
        <div style={{
          padding: 'var(--spacing-sm)',
          background: '#fff3cd',
          border: '2px solid #ffc107',
          borderRadius: 'var(--radius-sm)',
          marginBottom: 'var(--spacing-md)',
          color: '#856404',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)'
        }}>
          <span style={{ fontSize: '1.5rem' }}>🗑️</span>
          <span>This item is deleted (soft delete)</span>
        </div>
      )}

      <div className={styles.detailsGrid}>
        <div>
          <strong>{t('pages.contacts.details.display_name')}:</strong> {item.display_name}
        </div>
        <div>
          <strong>{t('pages.contacts.details.contact_type')}:</strong> {item.contact_type}
        </div>
        <div>
          <strong>{t('pages.contacts.details.primary_email')}:</strong> {item.primary_email}
        </div>
        <div>
          <strong>{t('pages.contacts.details.primary_phone')}:</strong> {item.primary_phone}
        </div>
      </div>
    </div>
  );

  // ============================================================
  // HANDLERS
  // ============================================================

  /**
   * Handle new item creation
   */
  const handleNewItem = () => {
    alert(t('pages.contacts.newItemClicked'));
    // TODO: Implement create modal
  };

  /**
   * Handle bulk export - CSV format
   * Exports selected items with all fields flattened for CSV
   */
  const handleExportCSV = () => {
    if (selectedRows.size === 0) return;
    const selectedItems = dataWithActive.filter(item => selectedRows.has(item.id));

    // Headers matching Contact fields
    const headers = [
      t('pages.contacts.columns.id'),
      t('pages.contacts.columns.name'),
      t('pages.contacts.columns.email'),
      t('pages.contacts.columns.status'),
      t('pages.contacts.columns.priority'),
      t('pages.contacts.columns.value'),
      t('pages.contacts.columns.date'),
      t('pages.contacts.details.isDeleted'),
    ];

    // Map data to export format
    const data = selectedItems.map(item => ({
      id: item.id,
      name: item.name,
      email: item.email,
      status: item.status,
      priority: item.priority,
      value: item.value,
      date: item.date,
      is_deleted: item.is_deleted ? 'Yes' : 'No',
    }));

    exportToCSV(data, headers, `contacts_export_${new Date().toISOString().split('T')[0]}`);
    toast.success(t('pages.contacts.exportSuccess', { count: selectedItems.length, format: 'CSV' }));
  };

  /**
   * Handle bulk export - JSON format
   * Exports selected items with full data structure
   */
  const handleExportJSON = () => {
    if (selectedRows.size === 0) return;
    const selectedItems = dataWithActive.filter(item => selectedRows.has(item.id));

    // Remove computed isActive field before export
    const exportData = selectedItems.map(item => {
      const { isActive, ...cleanItem } = item;
      return cleanItem;
    });

    exportToJSON(exportData, `contacts_export_${new Date().toISOString().split('T')[0]}`);
    toast.success(t('pages.contacts.exportSuccess', { count: selectedItems.length, format: 'JSON' }));
  };

  /**
   * Handle bulk export - ZIP format with full data
   * Creates ZIP archive with JSON and CSV for each item
   *
   * Error handling:
   * - MinIO unavailable (503): Show modal, offer export without attachments
   * - Missing attachments (404): Include in error report, continue export
   *
   * 🔧 TODO: Implement attachment download from MinIO when entity has attachments
   */
  const handleExportZIP = async (skipAttachments = false) => {
    if (selectedRows.size === 0) return;

    const selectedItems = dataWithActive.filter(item => selectedRows.has(item.id));

    // Start loading
    setIsExportingZip(true);

    // Track errors (for future attachment support)
    const deletedRecords: string[] = [];
    const missingAttachments: string[] = [];
    const minioErrors: string[] = [];
    let successCount = 0;

    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      const dateStr = new Date().toISOString().split('T')[0];

      // CSV headers for individual item export
      const csvHeaders = [
        'ID', 'Name', 'Email', 'Status', 'Priority', 'Value', 'Date', 'Is Deleted',
      ];

      for (const item of selectedItems) {
        try {
          // Folder name: id
          const folderName = item.id;
          const folder = zip.folder(folderName);

          if (!folder) continue;

          // Clean item data (remove isActive)
          const { isActive, ...cleanItem } = item;

          // Add item.json (full data)
          folder.file('item.json', JSON.stringify(cleanItem, null, 2));

          // Create CSV content for single item
          const csvRow = [
            item.id,
            item.name,
            item.email,
            item.status,
            item.priority,
            item.value,
            item.date,
            item.is_deleted ? 'Yes' : 'No',
          ].map(val => {
            const str = String(val);
            // Escape quotes and wrap in quotes if contains comma or newline
            if (str.includes(',') || str.includes('\n') || str.includes('"')) {
              return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
          });

          const csvContent = [csvHeaders.join(','), csvRow.join(',')].join('\n');
          folder.file('item.csv', csvContent);

          // Download and add attachments using serviceWorkflow
          // 🔧 CUSTOMIZATION: Uncomment when entity has attachments field
          // if (!skipAttachments && item.attachments && item.attachments.length > 0) {
          //   const attachmentsFolder = folder.folder('attachments');
          //   for (const attachment of item.attachments) {
          //     try {
          //       // Use serviceWorkflow for attachment download with retry & MinIO health check
          //       const result = await serviceWorkflow({
          //         baseUrl: SERVICE_ENDPOINTS.baseUrl,
          //         endpoint: `/items/${item.id}/attachments/${attachment.file_name}`,
          //         method: 'GET',
          //         healthChecks: {
          //           ping: false,  // Skip ping (already checked once per export)
          //           sql: false,   // Skip SQL (not needed for file download)
          //           minio: true,  // Check MinIO (required for attachments)
          //         },
          //         debug: settings.logToConsole,      // Use global debug mode from sidebar
          //         showToasts: true,                  // Show toast notifications (retry, errors)
          //         language: language,                // Use current language for toasts
          //         caller: 'ContactsExportZIP',
          //       });
          //
          //       if (result.success) {
          //         // Download successful - fetch blob and add to ZIP
          //         const response = await fetch(`${SERVICE_ENDPOINTS.baseUrl}/items/${item.id}/attachments/${attachment.file_name}`);
          //         if (response.ok) {
          //           const blob = await response.blob();
          //           attachmentsFolder?.file(attachment.file_name, blob);
          //         }
          //       } else {
          //         // Handle errors from serviceWorkflow
          //         if (result.errorCode === 'MINIO_UNAVAILABLE' || result.errorCode === 'MINIO_UNAVAILABLE_WITH_FILES') {
          //           // MinIO down - track for error modal
          //           if (!minioErrors.includes(item.id)) minioErrors.push(item.id);
          //         } else if (result.statusCode === 404) {
          //           // Attachment not found - track for error modal
          //           missingAttachments.push(`${item.id}: ${attachment.file_name}`);
          //         }
          //       }
          //     } catch (err) {
          //       console.error(`[Contacts] Error downloading attachment ${attachment.file_name}:`, err);
          //     }
          //   }
          // }

          successCount++;
        } catch (err) {
          console.error(`[Contacts] ❌ Error exporting item ${item.id}:`, err);
        }
      }

      // Generate and download ZIP
      if (successCount > 0) {
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const zipFileName = `contacts_export_${dateStr}.zip`;

        // If there were errors, show modal (for future attachment support)
        if (minioErrors.length > 0 || missingAttachments.length > 0) {
          setExportErrors({
            deletedRecords,
            missingAttachments,
            minioErrors,
            successCount,
            selectedItems,
            pendingZipBlob: zipBlob,
            zipFileName,
          });
          setIsExportingZip(false);
          return;
        }

        // No errors - download directly
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = zipFileName;
        link.click();
        URL.revokeObjectURL(url);

        toast.success(t('pages.contacts.exportSuccess', { count: successCount, format: 'ZIP' }));
      }
    } catch (error) {
      console.error('[Contacts] ZIP export failed:', error);
      toast.error(t('pages.contacts.exportZipError'));
    } finally {
      setIsExportingZip(false);
    }
  };

  /**
   * Handle bulk delete - opens appropriate confirmation modal based on item states
   *
   * 🔧 NOTE: This determines soft vs hard delete based on is_deleted status
   */
  const handleBulkDelete = () => {
    if (selectedRows.size === 0) return;

    const selectedItems = items.filter(item => selectedRows.has(item.id));
    const activeItems = selectedItems.filter(item => !item.is_deleted);
    const deletedItems = selectedItems.filter(item => item.is_deleted);

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

  /**
   * Execute bulk delete with MinIO 503 handling
   *
   * 🔧 TODO: Replace mock implementation with actual API calls
   */
  const executeBulkDelete = async () => {
    setIsBulkDeleting(true);
    try {
      const selectedItems = items.filter(item => selectedRows.has(item.id));
      const activeItems = selectedItems.filter(item => !item.is_deleted);
      const deletedItems = selectedItems.filter(item => item.is_deleted);

      // Soft delete active items
      if (activeItems.length > 0) {
        for (const item of activeItems) {
          // TODO: Replace with actual API call
          // await fetch(`${API_BASE_URL}/contacts/${item.id}`, { method: 'DELETE' });
          if (analyticsSettings.logToConsole) console.log(`[Contacts] ✅ Soft deleted ${item.id}`);
        }
      }

      // Hard delete soft-deleted items (with MinIO 503 handling)
      const failedItems: Contact[] = [];
      const successfulHardDeletes: Contact[] = [];

      if (deletedItems.length > 0) {
        for (const item of deletedItems) {
          // TODO: Replace with actual API call
          // const response = await fetch(`${API_BASE_URL}/contacts/${item.id}/permanent`, { method: 'DELETE' });
          //
          // if (response.status === 503) {
          //   failedItems.push(item);
          // } else if (response.ok) {
          //   successfulHardDeletes.push(item);
          // }

          // Mock: Simulate success
          successfulHardDeletes.push(item);
          if (analyticsSettings.logToConsole) console.log(`[Contacts] ✅ Hard deleted ${item.id}`);
        }
      }

      // Close bulk delete modal
      setBulkDeleteType(null);

      // If any items failed due to MinIO, show special modal
      if (failedItems.length > 0) {
        if (analyticsSettings.logToConsole) console.log(`[Contacts] ⚠️ ${failedItems.length} items failed due to MinIO`);
        setMinioFailedItems(failedItems);
        const failedIds = new Set(failedItems.map(i => i.id));
        setSelectedRows(new Set([...selectedRows].filter(id => failedIds.has(id))));
      } else {
        setSelectedRows(new Set());
      }

      // TODO: Refresh list
      // await fetchItems();

      const totalDeleted = activeItems.length + successfulHardDeletes.length;
      if (totalDeleted > 0) {
        toast.success(t('pages.contacts.bulkDeleteSuccess', { count: totalDeleted }));
      }
    } catch (error) {
      console.error('[Contacts] ❌ Error during bulk delete:', error);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  /**
   * Handle soft delete confirmation
   */
  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    alert(t('pages.contacts.deleteSuccess', { name: itemToDelete.name }));
    setItemToDelete(null);
    // TODO: Implement soft delete API call
  };

  /**
   * Handle restore confirmation
   */
  const handleRestoreConfirm = () => {
    if (!itemToRestore) return;
    alert(t('pages.contacts.restoreSuccess', { name: itemToRestore.name }));
    setItemToRestore(null);
    // TODO: Implement restore API call
  };

  /**
   * Handle permanent delete confirmation with MinIO 503 handling
   *
   * 🔧 TODO: Replace mock implementation with actual API calls
   */
  const handlePermanentDeleteConfirm = async () => {
    if (!itemToPermanentlyDelete) return;

    setIsPermanentDeleting(true);

    try {
      // TODO: Implement permanent delete API call
      // const response = await fetch(`${API_BASE_URL}/contacts/${itemToPermanentlyDelete.id}/permanent`, {
      //   method: 'DELETE',
      // });
      //
      // if (!response.ok) {
      //   // Check for MinIO unavailable (503)
      //   if (response.status === 503) {
      //     if (analyticsSettings.logToConsole) console.log('[Contacts] ⚠️ MinIO unavailable - showing special modal');
      //     const itemToHandle = itemToPermanentlyDelete;
      //     setItemToPermanentlyDelete(null);
      //     setMinioFailedItems([itemToHandle]);  // Unified state - array with single item
      //     return;
      //   }
      //   throw new Error(`Failed to permanently delete item: ${response.statusText}`);
      // }

      if (analyticsSettings.logToConsole) console.log(`[Contacts] ✅ Item ${itemToPermanentlyDelete.id} permanently deleted`);

      // Close modal
      setItemToPermanentlyDelete(null);

      // TODO: Refresh items list
      // await fetchItems();

      // Show success toast
      toast.success(t('pages.contacts.permanentDeleteSuccess', { name: itemToPermanentlyDelete.name }));
    } catch (err) {
      console.error('[Contacts] ✗ Error permanently deleting item:', err);

      // Close modal
      setItemToPermanentlyDelete(null);

      // Show error toast with details
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(t('pages.contacts.permanentDeleteError', { name: itemToPermanentlyDelete.name, error: errorMessage }));
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
   *
   * 🔧 TODO: Replace mock implementation with actual API calls
   */
  const handleMinioMarkForDeletion = async () => {
    if (minioFailedItems.length === 0) return;

    try {
      let successCount = 0;

      for (const item of minioFailedItems) {
        // TODO: Implement force delete API call
        // const response = await fetch(`${API_BASE_URL}/contacts/${item.id}/permanent?force=true`, {
        //   method: 'DELETE',
        // });
        //
        // if (response.ok) {
        //   successCount++;
        //   if (analyticsSettings.logToConsole) console.log(`[Contacts] ✅ Item ${item.id} marked for deletion`);
        // }

        // Mock: Simulate success
        successCount++;
        if (analyticsSettings.logToConsole) console.log(`[Contacts] ✅ Item ${item.id} marked for deletion`);
      }

      // Close modal and clear selection
      setMinioFailedItems([]);
      setSelectedRows(new Set());

      // TODO: Refresh list
      // await fetchItems();

      if (successCount > 0) {
        // Show appropriate message based on count
        const messageCode = successCount === 1
          ? minioFailedItems[0].id
          : `${successCount} položiek`;
        toast.success(t('pages.contacts.minioUnavailable.markedForDeletion', { code: messageCode }));
      }
    } catch (error) {
      console.error('[Contacts] ❌ Error during mark for deletion:', error);
    }
  };

  /**
   * Retry delete for all failed items (without force)
   * Stays on modal with loading if some still fail
   *
   * 🔧 TODO: Replace mock implementation with actual API calls
   */
  const handleMinioRetryDelete = async () => {
    if (minioFailedItems.length === 0) return;

    setIsRetryingDelete(true);

    try {
      const stillFailedItems: Contact[] = [];
      let successCount = 0;

      for (const item of minioFailedItems) {
        // TODO: Implement retry delete API call
        // const response = await fetch(`${API_BASE_URL}/contacts/${item.id}/permanent`, {
        //   method: 'DELETE',
        // });
        //
        // if (response.status === 503) {
        //   stillFailedItems.push(item);
        //   if (analyticsSettings.logToConsole) console.log(`[Contacts] ⚠️ MinIO still unavailable for ${item.id}`);
        // } else if (response.ok) {
        //   successCount++;
        //   if (analyticsSettings.logToConsole) console.log(`[Contacts] ✅ Item ${item.id} permanently deleted on retry`);
        // }

        // Mock: Simulate success
        successCount++;
        if (analyticsSettings.logToConsole) console.log(`[Contacts] ✅ Item ${item.id} permanently deleted on retry`);
      }

      if (stillFailedItems.length > 0) {
        // Update the list of still-failed items (stay on modal)
        setMinioFailedItems(stillFailedItems);
        toast.warning(t('pages.contacts.minioUnavailable.title'));
      } else {
        // All successful - close modal
        setMinioFailedItems([]);
        setSelectedRows(new Set());
      }

      // TODO: Refresh list
      // await fetchItems();

      if (successCount > 0) {
        // Show appropriate message
        const messageCode = successCount === 1 && minioFailedItems.length === 1
          ? minioFailedItems[0].name
          : successCount;
        toast.success(t('pages.contacts.permanentDeleteSuccess', { name: messageCode }));
      }
    } catch (error) {
      console.error('[Contacts] ❌ Error during retry delete:', error);
    } finally {
      setIsRetryingDelete(false);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <BasePage>
      <div className={styles.page}>
        {/* Page Header with breadcrumbs */}
        <PageHeader
          title={t('pages.contacts.title')}
          subtitle={t('pages.contacts.subtitle')}
          breadcrumbs={[
            { name: t('common.home'), href: '/' },
            { name: t('pages.contacts.breadcrumb'), isActive: true },
          ]}
        />

        {/* Loading state (for API mode) */}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
            <Spinner size="large" />
          </div>
        )}

        {/* Error state (for API mode) */}
        {apiError && !isLoading && (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-status-error)' }}>
            <p>{t('pages.contacts.loadError')}: {apiError}</p>
            {/* 🔧 CUSTOMIZATION: Add retry button when using real API */}
            {/* <button onClick={fetchItems} style={{ marginTop: '12px' }}>{t('common.retry')}</button> */}
          </div>
        )}

        {/* FilteredDataGrid Component - only show when not loading */}
        {!isLoading && !apiError && (
        <FilteredDataGrid
          data={dataWithActive}
          columns={columns}
          getRowId={(row) => row.id}
          // Search
          searchPlaceholder={t('pages.contacts.searchPlaceholder')}
          // Filters
          filters={filters}
          quickFilters={quickFilters}
          useFilterCheckboxes={true}
          // Pagination
          itemsPerPage={10}
          // New Item Button (always visible, disabled for basic users)
          onNewItem={handleNewItem}
          newItemText={t('pages.contacts.newItemButton')}
          newItemDisabled={!canCreate}
          // Inactive field (always provided to filter inactive items)
          inactiveField="isActive"
          // Show inactive toggle (advanced only)
          {...(canViewDeleted && {
            showInactiveLabel: t('pages.contacts.showInactiveLabel'),
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
          // Status Colors & Legend
          getRowStatus={(row) => row.is_deleted ? 'deleted' : row.contact_type}
          statusColors={statusColors}
          statusLabels={statusLabels}
          showStatusLegend={true}
          // Grid ID (for localStorage persistence)
          gridId="contactsPageDatagrid"
          // Bulk Actions Bar
          betweenContent={
            <div className={styles.selectedInfo}>
              <div className={styles.selectedCount}>
                <strong>{t('pages.contacts.selectedCount')}:</strong> {selectedRows.size}
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
                  {t('pages.contacts.clearSelection')}
                </button>
              </div>
            </div>
          }
        />
        )}

        {/* Delete Confirmation Modal (Soft Delete) */}
        {itemToDelete && (
          <ConfirmModal
            isOpen={true}
            onClose={() => setItemToDelete(null)}
            onConfirm={handleDeleteConfirm}
            title={t('common.confirmDelete')}
            message={t('pages.contacts.deleteConfirm', { name: itemToDelete.name })}
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
            title={t('pages.contacts.bulkDelete.title')}
            message={t('pages.contacts.bulkDelete.softMessage', { count: bulkDeleteCounts.active })}
            isDanger={false}
            isLoading={isBulkDeleting}
          />
        )}

        {bulkDeleteType === 'hard' && (
          <ConfirmModal
            isOpen={true}
            onClose={() => setBulkDeleteType(null)}
            onConfirm={executeBulkDelete}
            title={t('pages.contacts.bulkDelete.titlePermanent')}
            message={t('pages.contacts.bulkDelete.hardMessage', { count: bulkDeleteCounts.deleted })}
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
            title={t('pages.contacts.bulkDelete.titleMixed')}
            message={t('pages.contacts.bulkDelete.mixedMessage', {
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
            title={t('pages.contacts.minioUnavailable.title')}
            message={minioFailedItems.length === 1
              ? t('pages.contacts.minioUnavailable.message', { code: minioFailedItems[0].id })
              : t('pages.contacts.bulkDelete.minioMessage', { count: minioFailedItems.length })
            }
            confirmButtonLabel={t('pages.contacts.minioUnavailable.markForDeletion')}
            cancelButtonLabel={t('common.cancel')}
            secondaryButtonLabel={t('pages.contacts.minioUnavailable.retryDelete')}
            onSecondary={handleMinioRetryDelete}
            isSecondaryLoading={isRetryingDelete}
          />
        )}

        {/* Restore Confirmation Modal */}
        {itemToRestore && (
          <ConfirmModal
            isOpen={true}
            onClose={() => setItemToRestore(null)}
            onConfirm={handleRestoreConfirm}
            title={t('common.restore')}
            message={t('pages.contacts.restoreConfirm', { name: itemToRestore.name })}
            confirmButtonLabel={t('common.restore')}
            cancelButtonLabel={t('common.cancel')}
          />
        )}

        {/* Permanent Delete Confirmation Modal */}
        {itemToPermanentlyDelete && (
          <ConfirmModal
            isOpen={true}
            onClose={() => setItemToPermanentlyDelete(null)}
            onConfirm={handlePermanentDeleteConfirm}
            title={t('common.permanentDelete')}
            message={t('pages.contacts.permanentDeleteConfirm', { name: itemToPermanentlyDelete.name })}
            confirmButtonLabel={t('common.permanentDelete')}
            cancelButtonLabel={t('common.cancel')}
            confirmKeyword="ano"
            isDanger={true}
            isLoading={isPermanentDeleting}
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
                toast.warning(t('pages.contacts.exportPartialAttachments', {
                  success: exportErrors.successCount,
                  missing: exportErrors.missingAttachments.length
                }));
              }
              setExportErrors(null);
            }}
            title={exportErrors.minioErrors.length > 0
              ? t('pages.contacts.minioExportError.title')
              : t('pages.contacts.exportErrors.missingAttachmentsModalTitle')
            }
            message={
              <>
                {exportErrors.missingAttachments.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ marginBottom: '8px' }}>
                      {t('pages.contacts.exportErrors.missingAttachmentsMessage')}
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
                      ⚠️ {t('pages.contacts.exportErrors.minioTitle', { count: exportErrors.minioErrors.length })}:
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
            confirmButtonLabel={t('pages.contacts.exportErrors.downloadWithoutMissing')}
            cancelButtonLabel={t('common.cancel')}
          />
        )}

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
              {t('pages.contacts.exportZipLoading')}
            </p>
          </div>
        )}
      </div>
    </BasePage>
  );
}