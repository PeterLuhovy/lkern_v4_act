/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/accessible-emoji */
/*
 * ================================================================
 * FILE: TemplatePageDatagrid.tsx
 * PATH: /apps/web-ui/src/pages/TemplatePageDatagrid/TemplatePageDatagrid.tsx
 * DESCRIPTION: Universal template for DataGrid pages with FilteredDataGrid
 * VERSION: v1.0.0
 * UPDATED: 2025-11-08
 *
 * 📖 USAGE:
 * This is a REFERENCE TEMPLATE for creating new DataGrid pages.
 *
 * MANUAL METHOD:
 * 1. Copy this file to new location (e.g., Orders/Orders.tsx)
 * 2. Find & Replace: "TemplateItem" → "Order" (your entity type)
 * 3. Find & Replace: "template" → "orders" (lowercase)
 * 4. Find & Replace: "Template" → "Orders" (capitalized)
 * 5. Update interface fields (name, email → orderNumber, customer, etc.)
 * 6. Update columns configuration
 * 7. Add translation keys to sk.ts and en.ts
 * 8. Update mock data if needed
 *
 * GENERATOR METHOD (Recommended):
 * Run: npm run generate:page
 * Answer prompts → page auto-generated
 *
 * ================================================================
 */

import { useState } from 'react';
import { BasePage, PageHeader, ConfirmModal, ExportButton } from '@l-kern/ui-components';
import { FilteredDataGrid } from '@l-kern/ui-components';
import type { FilterConfig, QuickFilterConfig } from '@l-kern/ui-components';
import { useTranslation, useAuthContext, useTheme, useToast, COLORS, formatDate, exportToCSV, exportToJSON } from '@l-kern/config';
import styles from './TemplatePageDatagrid.module.css';

// ============================================================
// DATA TYPES
// ============================================================

/**
 * TemplateItem interface
 *
 * 🔧 CUSTOMIZATION:
 * Replace with your entity fields (e.g., Order, Contact, Invoice)
 */
interface TemplateItem {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'pending' | 'inactive';
  priority: 'low' | 'medium' | 'high';
  value: number;
  date: string;
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
const mockData: TemplateItem[] = [
  { id: 'TMP-001', name: 'John Doe', email: 'john@example.com', status: 'active', priority: 'high', value: 5200, date: '2025-11-10', is_deleted: false },
  { id: 'TMP-002', name: 'Jane Smith', email: 'jane@example.com', status: 'pending', priority: 'medium', value: 3400, date: '2025-11-15', is_deleted: false },
  { id: 'TMP-003', name: 'Bob Johnson', email: 'bob@example.com', status: 'inactive', priority: 'low', value: 1200, date: '2025-10-20', is_deleted: true },
  { id: 'TMP-004', name: 'Alice Williams', email: 'alice@example.com', status: 'active', priority: 'high', value: 8900, date: '2025-11-05', is_deleted: false },
  { id: 'TMP-005', name: 'Charlie Brown', email: 'charlie@example.com', status: 'pending', priority: 'medium', value: 2100, date: '2025-11-20', is_deleted: false },
];

// Add computed 'isActive' field (inverted from 'is_deleted')
// FilteredDataGrid expects 'true' = active, but is_deleted has 'true' = inactive
const dataWithActive = mockData.map((item) => ({
  ...item,
  isActive: !item.is_deleted,
}));

// ============================================================
// COMPONENT
// ============================================================

export function TemplatePageDatagrid() {
  const { t, language } = useTranslation();
  const { permissionLevel, permissions } = useAuthContext();
  const { theme } = useTheme();
  const toast = useToast();

  // Authorization checks - Use centralized permissions from context (DRY)
  const { canCreate, canEdit, canDelete, canExport, canViewDeleted } = permissions;
  console.log('[TemplatePageDatagrid] 🔐 Permission level:', permissionLevel);
  console.log('[TemplatePageDatagrid] 🔐 Authorization:', { canCreate, canEdit, canDelete, canExport, canViewDeleted });

  // State management
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [itemToDelete, setItemToDelete] = useState<TemplateItem | null>(null);
  const [itemToRestore, setItemToRestore] = useState<TemplateItem | null>(null);
  const [itemToPermanentlyDelete, setItemToPermanentlyDelete] = useState<TemplateItem | null>(null);

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
    active: COLORS.status.success,   // Green
    pending: COLORS.status.warning,  // Orange
    inactive: theme === 'light' ? COLORS.status.inactiveLight : COLORS.status.inactive, // Red (theme-aware)
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
      field: 'status',
      title: t('pages.template.filters.statusTitle'),
      options: [
        { value: 'active', label: t('pages.template.filters.statusActive') },
        { value: 'pending', label: t('pages.template.filters.statusPending') },
        { value: 'inactive', label: t('pages.template.filters.statusInactive') },
      ],
    },
    {
      field: 'priority',
      title: t('pages.template.filters.priorityTitle'),
      options: [
        { value: 'low', label: t('pages.template.filters.priorityLow') },
        { value: 'medium', label: t('pages.template.filters.priorityMedium') },
        { value: 'high', label: t('pages.template.filters.priorityHigh') },
      ],
    },
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
      id: 'high-value',
      label: t('pages.template.quickFilters.highValue'),
      filterFn: (item: TemplateItem) => item.value > 5000,
    },
    {
      id: 'overdue',
      label: t('pages.template.quickFilters.overdue'),
      filterFn: (item: TemplateItem) => new Date(item.date) < new Date(),
    },
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
      title: t('pages.template.columns.id'),
      field: 'id',
      sortable: true,
      width: 120,
      render: (value: string, row: TemplateItem) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {row.is_deleted && <span style={{ color: 'var(--color-status-warning, #FF9800)', fontSize: '1.1em' }} title="Deleted item">⚠️</span>}
          {value}
        </span>
      ),
    },
    {
      title: t('pages.template.columns.name'),
      field: 'name',
      sortable: true,
      width: 200
    },
    {
      title: t('pages.template.columns.email'),
      field: 'email',
      sortable: true,
      width: 250
    },
    {
      title: t('pages.template.columns.status'),
      field: 'status',
      sortable: true,
      width: 120
    },
    {
      title: t('pages.template.columns.priority'),
      field: 'priority',
      sortable: true,
      width: 100
    },
    {
      title: t('pages.template.columns.value'),
      field: 'value',
      sortable: true,
      width: 120,
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      title: t('pages.template.columns.date'),
      field: 'date',
      sortable: true,
      width: 120,
      render: (value: string) => formatDate(value, language),
    },
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
      onClick: (item: TemplateItem) => {
        alert(`${t('common.view')}: ${item.name}`);
        // TODO: Implement view modal
      },
      variant: 'secondary' as const,
      // View is always visible for all users
    },
    {
      label: '✏️',
      title: t('common.edit'),
      onClick: (item: TemplateItem) => {
        alert(`${t('common.edit')}: ${item.name}`);
        // TODO: Implement edit modal
      },
      variant: 'primary' as const,
      disabled: () => !canEdit, // Disabled if no permission
      hidden: (item: TemplateItem) => item.is_deleted, // Hidden for soft-deleted items
    },
    {
      label: '🗑️',
      title: t('common.delete'),
      onClick: (item: TemplateItem) => {
        setItemToDelete(item);
      },
      variant: 'danger' as const,
      disabled: () => !canDelete, // Disabled if no permission
      hidden: (item: TemplateItem) => item.is_deleted, // Hidden for soft-deleted items
    },
    {
      label: '↩️',
      title: t('common.restore'),
      onClick: (item: TemplateItem) => {
        setItemToRestore(item);
      },
      variant: 'primary' as const,
      disabled: () => !canDelete, // Disabled if no permission
      hidden: (item: TemplateItem) => !item.is_deleted, // Hidden for active items (only show for soft-deleted)
    },
    {
      label: '💀',
      title: t('common.permanentDelete'),
      onClick: (item: TemplateItem) => {
        setItemToPermanentlyDelete(item);
      },
      variant: 'danger' as const,
      disabled: () => !canDelete, // Disabled if no permission
      hidden: (item: TemplateItem) => !item.is_deleted, // Hidden for active items (only show for soft-deleted)
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
  const renderExpandedContent = (item: TemplateItem) => (
    <div className={styles.expandedContent}>
      <h4>{t('pages.template.detailsTitle', { name: item.name })}</h4>

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
          <strong>{t('pages.template.details.name')}:</strong> {item.name}
        </div>
        <div>
          <strong>{t('pages.template.details.email')}:</strong> {item.email}
        </div>
        <div>
          <strong>{t('pages.template.details.status')}:</strong> {item.status}
        </div>
        <div>
          <strong>{t('pages.template.details.priority')}:</strong> {item.priority}
        </div>
        <div>
          <strong>{t('pages.template.details.value')}:</strong> ${item.value.toLocaleString()}
        </div>
        <div>
          <strong>{t('pages.template.details.date')}:</strong> {formatDate(item.date, language)}
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
    alert(t('pages.template.newItemClicked'));
    // TODO: Implement create modal
  };

  /**
   * Handle bulk export
   */
  const handleExportCSV = () => {
    if (selectedRows.size === 0) return;
    const selectedItems = mockData.filter(item => selectedRows.has(item.id));
    
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Status', 'Created'];
    const data = selectedItems.map(item => ({
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone || 'N/A',
      status: item.status,
      created: new Date(item.createdAt).toLocaleString('sk-SK'),
    }));
    
    exportToCSV(data, headers, `template_export_${new Date().toISOString().split('T')[0]}`);
  };

  const handleExportJSON = () => {
    if (selectedRows.size === 0) return;
    const selectedItems = mockData.filter(item => selectedRows.has(item.id));
    exportToJSON(selectedItems, `template_export_${new Date().toISOString().split('T')[0]}`);
  };

  /**
   * Handle bulk delete
   */
  const handleBulkDelete = () => {
    if (selectedRows.size === 0) return;
    if (confirm(t('pages.template.bulkDeleteConfirm', { count: selectedRows.size }))) {
      alert(t('pages.template.bulkDeleteSuccess', { count: selectedRows.size }));
      setSelectedRows(new Set());
      // TODO: Implement bulk delete API call
    }
  };

  /**
   * Handle soft delete confirmation
   */
  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    alert(t('pages.template.deleteSuccess', { name: itemToDelete.name }));
    setItemToDelete(null);
    // TODO: Implement soft delete API call
  };

  /**
   * Handle restore confirmation
   */
  const handleRestoreConfirm = () => {
    if (!itemToRestore) return;
    alert(t('pages.template.restoreSuccess', { name: itemToRestore.name }));
    setItemToRestore(null);
    // TODO: Implement restore API call
  };

  /**
   * Handle permanent delete confirmation
   */
  const handlePermanentDeleteConfirm = async () => {
    if (!itemToPermanentlyDelete) return;

    try {
      // TODO: Implement permanent delete API call
      // const response = await fetch(`${API_BASE_URL}/template/${itemToPermanentlyDelete.id}/permanent`, {
      //   method: 'DELETE',
      // });
      //
      // if (!response.ok) {
      //   throw new Error(`Failed to permanently delete item: ${response.statusText}`);
      // }

      console.log(`[Template] ✅ Item ${itemToPermanentlyDelete.id} permanently deleted`);

      // Close modal
      setItemToPermanentlyDelete(null);

      // TODO: Refresh items list
      // await fetchItems();

      // Show success toast
      toast.success(t('pages.template.permanentDeleteSuccess', { name: itemToPermanentlyDelete.name }));
    } catch (err) {
      console.error('[Template] ✗ Error permanently deleting item:', err);

      // Close modal
      setItemToPermanentlyDelete(null);

      // Show error toast with details
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(t('pages.template.permanentDeleteError', { name: itemToPermanentlyDelete.name, error: errorMessage }));
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
          title={t('pages.template.title')}
          subtitle={t('pages.template.subtitle')}
          breadcrumbs={[
            { name: t('common.home'), href: '/' },
            { name: t('pages.template.breadcrumb'), isActive: true },
          ]}
        />
        {/* FilteredDataGrid Component */}
        <FilteredDataGrid
          data={dataWithActive}
          columns={columns}
          getRowId={(row) => row.id}
          // Search
          searchPlaceholder={t('pages.template.searchPlaceholder')}
          // Filters
          filters={filters}
          quickFilters={quickFilters}
          useFilterCheckboxes={true}
          // Pagination
          itemsPerPage={10}
          // New Item Button (always visible, disabled for basic users)
          onNewItem={handleNewItem}
          newItemText={t('pages.template.newItemButton')}
          newItemDisabled={!canCreate}
          // Inactive field (always provided to filter inactive items)
          inactiveField="isActive"
          // Show inactive toggle (advanced only)
          {...(canViewDeleted && {
            showInactiveLabel: t('pages.template.showInactiveLabel'),
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
          getRowStatus={(row) => row.is_deleted ? 'inactive' : row.status}
          statusColors={statusColors}
          // Grid ID (for localStorage persistence)
          gridId="templatePageDatagrid"
          // Bulk Actions Bar
          betweenContent={
            <div className={styles.selectedInfo}>
              <div className={styles.selectedCount}>
                <strong>{t('pages.template.selectedCount')}:</strong> {selectedRows.size}
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
                  {t('pages.template.clearSelection')}
                </button>
              </div>
            </div>
          }
        />

        {/* Delete Confirmation Modal */}
        {itemToDelete && (
          <ConfirmModal
            isOpen={true}
            onClose={() => setItemToDelete(null)}
            onConfirm={handleDeleteConfirm}
            title={t('common.confirmDelete')}
            message={t('pages.template.deleteConfirm', { name: itemToDelete.name })}
            confirmButtonLabel={t('common.delete')}
            cancelButtonLabel={t('common.cancel')}
          />
        )}

        {/* Restore Confirmation Modal */}
        {itemToRestore && (
          <ConfirmModal
            isOpen={true}
            onClose={() => setItemToRestore(null)}
            onConfirm={handleRestoreConfirm}
            title={t('common.restore')}
            message={t('pages.template.restoreConfirm', { name: itemToRestore.name })}
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
            message={t('pages.template.permanentDeleteConfirm', { name: itemToPermanentlyDelete.name })}
            confirmButtonLabel={t('common.permanentDelete')}
            cancelButtonLabel={t('common.cancel')}
            confirmKeyword="ano"
            isDanger={true}
          />
        )}
      </div>
    </BasePage>
  );
}