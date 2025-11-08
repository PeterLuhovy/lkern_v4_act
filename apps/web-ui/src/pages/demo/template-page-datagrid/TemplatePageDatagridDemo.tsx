/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/accessible-emoji */
/*
 * ================================================================
 * FILE: TemplatePageDatagridDemo.tsx
 * PATH: /apps/web-ui/src/pages/demo/template-page-datagrid/TemplatePageDatagridDemo.tsx
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
import { BasePage, PageHeader } from '@l-kern/ui-components';
import { FilteredDataGrid } from '@l-kern/ui-components';
import type { FilterConfig, QuickFilterConfig } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import styles from './TemplatePageDatagridDemo.module.css';

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
  isActive: boolean;
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
  { id: 'TMP-001', name: 'John Doe', email: 'john@example.com', status: 'active', priority: 'high', value: 5200, date: '2025-11-10', isActive: true },
  { id: 'TMP-002', name: 'Jane Smith', email: 'jane@example.com', status: 'pending', priority: 'medium', value: 3400, date: '2025-11-15', isActive: true },
  { id: 'TMP-003', name: 'Bob Johnson', email: 'bob@example.com', status: 'inactive', priority: 'low', value: 1200, date: '2025-10-20', isActive: false },
  { id: 'TMP-004', name: 'Alice Williams', email: 'alice@example.com', status: 'active', priority: 'high', value: 8900, date: '2025-11-05', isActive: true },
  { id: 'TMP-005', name: 'Charlie Brown', email: 'charlie@example.com', status: 'pending', priority: 'medium', value: 2100, date: '2025-11-20', isActive: true },
];

// ============================================================
// COMPONENT
// ============================================================

export function TemplatePageDatagridDemo() {
  const { t } = useTranslation();

  // State management
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

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
    active: '#4CAF50',    // Green
    pending: '#FF9800',   // Orange
    inactive: '#f44336',  // Red
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
      title: t('test.template.filters.statusTitle'),
      options: [
        { value: 'active', label: t('test.template.filters.statusActive') },
        { value: 'pending', label: t('test.template.filters.statusPending') },
        { value: 'inactive', label: t('test.template.filters.statusInactive') },
      ],
    },
    {
      field: 'priority',
      title: t('test.template.filters.priorityTitle'),
      options: [
        { value: 'low', label: t('test.template.filters.priorityLow') },
        { value: 'medium', label: t('test.template.filters.priorityMedium') },
        { value: 'high', label: t('test.template.filters.priorityHigh') },
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
      label: t('test.template.quickFilters.highValue'),
      filterFn: (item: TemplateItem) => item.value > 5000,
    },
    {
      id: 'overdue',
      label: t('test.template.quickFilters.overdue'),
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
      title: t('test.template.columns.id'),
      field: 'id',
      sortable: true,
      width: 120
    },
    {
      title: t('test.template.columns.name'),
      field: 'name',
      sortable: true,
      width: 200
    },
    {
      title: t('test.template.columns.email'),
      field: 'email',
      sortable: true,
      width: 250
    },
    {
      title: t('test.template.columns.status'),
      field: 'status',
      sortable: true,
      width: 120
    },
    {
      title: t('test.template.columns.priority'),
      field: 'priority',
      sortable: true,
      width: 100
    },
    {
      title: t('test.template.columns.value'),
      field: 'value',
      sortable: true,
      width: 120,
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      title: t('test.template.columns.date'),
      field: 'date',
      sortable: true,
      width: 120
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
      label: '✏️',
      title: t('common.edit'),
      onClick: (item: TemplateItem) => {
        alert(`${t('common.edit')}: ${item.name}`);
        // TODO: Implement edit modal
      },
      variant: 'primary' as const,
    },
    {
      label: '👁️',
      title: t('common.view'),
      onClick: (item: TemplateItem) => {
        alert(`${t('common.view')}: ${item.name}`);
        // TODO: Implement view modal
      },
      variant: 'secondary' as const,
    },
    {
      label: '🗑️',
      title: t('common.delete'),
      onClick: (item: TemplateItem) => {
        if (confirm(t('test.template.deleteConfirm', { name: item.name }))) {
          alert(t('test.template.deleteSuccess', { name: item.name }));
          // TODO: Implement delete API call
        }
      },
      variant: 'danger' as const,
      disabled: (item: TemplateItem) => item.status === 'inactive',
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
      <h4>{t('test.template.detailsTitle', { name: item.name })}</h4>
      <div className={styles.detailsGrid}>
        <div>
          <strong>{t('test.template.details.name')}:</strong> {item.name}
        </div>
        <div>
          <strong>{t('test.template.details.email')}:</strong> {item.email}
        </div>
        <div>
          <strong>{t('test.template.details.status')}:</strong> {item.status}
        </div>
        <div>
          <strong>{t('test.template.details.priority')}:</strong> {item.priority}
        </div>
        <div>
          <strong>{t('test.template.details.value')}:</strong> ${item.value.toLocaleString()}
        </div>
        <div>
          <strong>{t('test.template.details.date')}:</strong> {item.date}
        </div>
        <div>
          <strong>{t('test.template.details.active')}:</strong> {item.isActive ? t('common.yes') : t('common.no')}
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
    alert(t('test.template.newItemClicked'));
    // TODO: Implement create modal
  };

  /**
   * Handle bulk export
   */
  const handleBulkExport = () => {
    if (selectedRows.size === 0) return;
    alert(t('test.template.bulkExport', { count: selectedRows.size }));
    // TODO: Implement CSV/PDF export
  };

  /**
   * Handle bulk delete
   */
  const handleBulkDelete = () => {
    if (selectedRows.size === 0) return;
    if (confirm(t('test.template.bulkDeleteConfirm', { count: selectedRows.size }))) {
      alert(t('test.template.bulkDeleteSuccess', { count: selectedRows.size }));
      setSelectedRows(new Set());
      // TODO: Implement bulk delete API call
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <BasePage>
      <div className={styles.page}>
        <PageHeader
          title={t('test.template.title')}
          subtitle={t('test.template.subtitle')}
          breadcrumbs={[
            { name: t('common.home'), href: '/' },
            { name: t('test.template.breadcrumb'), isActive: true },
          ]}
        />

        {/* FilteredDataGrid Component */}
        <FilteredDataGrid
          data={mockData}
          columns={columns}
          getRowId={(row) => row.id}
          // Search
          searchPlaceholder={t('test.template.searchPlaceholder')}
          // Filters
          filters={filters}
          quickFilters={quickFilters}
          useFilterCheckboxes={true}
          // Pagination
          itemsPerPage={10}
          // New Item Button
          onNewItem={handleNewItem}
          newItemText={t('test.template.newItemButton')}
          // Inactive Toggle
          inactiveField="isActive"
          showInactiveLabel={t('test.template.showInactiveLabel')}
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
          // Grid ID (for localStorage persistence)
          gridId="templatePageDatagrid"
          // Bulk Actions Bar
          betweenContent={
            <div className={styles.selectedInfo}>
              <div className={styles.selectedCount}>
                <strong>{t('test.template.selectedCount')}:</strong> {selectedRows.size}
              </div>
              {selectedRows.size > 0 && (
                <div className={styles.selectedActions}>
                  <button
                    className={styles.actionButton}
                    onClick={handleBulkExport}
                  >
                    📥 {t('common.export')}
                  </button>
                  <button
                    className={styles.actionButton}
                    onClick={handleBulkDelete}
                  >
                    🗑️ {t('common.delete')}
                  </button>
                  <button
                    className={styles.actionButtonSecondary}
                    onClick={() => setSelectedRows(new Set())}
                  >
                    {t('test.template.clearSelection')}
                  </button>
                </div>
              )}
            </div>
          }
        />
      </div>
    </BasePage>
  );
}
