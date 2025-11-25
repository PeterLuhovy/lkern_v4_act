/*
 * ================================================================
 * FILE: FilteredGridDemo.tsx
 * PATH: /apps/web-ui/src/pages/demo/FilteredGridDemo.tsx
 * DESCRIPTION: Demo page for FilteredDataGrid component
 * VERSION: v1.1.0
 * UPDATED: 2025-11-07
 * ================================================================
 */

import { useState } from 'react';
import { BasePage } from '@l-kern/ui-components';
import { FilteredDataGrid } from '@l-kern/ui-components';
import type { FilterConfig, QuickFilterConfig } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import styles from './FilteredGridDemo.module.css';

// Mock order data
interface Order {
  id: string;
  customer: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  total: number;
  dueDate: string;
  isActive: boolean;
}

const mockOrders: Order[] = [
  { id: 'ORD-001', customer: 'ACME Corp', status: 'active', priority: 'high', total: 5200, dueDate: '2025-11-10', isActive: true },
  { id: 'ORD-002', customer: 'TechStart Inc', status: 'pending', priority: 'medium', total: 3400, dueDate: '2025-11-15', isActive: true },
  { id: 'ORD-003', customer: 'Global Industries', status: 'completed', priority: 'low', total: 1200, dueDate: '2025-10-20', isActive: false },
  { id: 'ORD-004', customer: 'Innovation Labs', status: 'active', priority: 'high', total: 8900, dueDate: '2025-11-05', isActive: true },
  { id: 'ORD-005', customer: 'Digital Solutions', status: 'pending', priority: 'medium', total: 2100, dueDate: '2025-11-20', isActive: true },
  { id: 'ORD-006', customer: 'Enterprise Systems', status: 'cancelled', priority: 'low', total: 900, dueDate: '2025-10-15', isActive: false },
  { id: 'ORD-007', customer: 'Smart Tech', status: 'active', priority: 'high', total: 6700, dueDate: '2025-11-03', isActive: true },
  { id: 'ORD-008', customer: 'Future Corp', status: 'completed', priority: 'medium', total: 4500, dueDate: '2025-10-25', isActive: false },
  { id: 'ORD-009', customer: 'Alpha Industries', status: 'active', priority: 'medium', total: 3200, dueDate: '2025-11-12', isActive: true },
  { id: 'ORD-010', customer: 'Beta Solutions', status: 'pending', priority: 'low', total: 1800, dueDate: '2025-11-18', isActive: true },
  { id: 'ORD-011', customer: 'Gamma Tech', status: 'active', priority: 'high', total: 7200, dueDate: '2025-11-08', isActive: true },
  { id: 'ORD-012', customer: 'Delta Corp', status: 'completed', priority: 'medium', total: 2900, dueDate: '2025-10-22', isActive: false },
  { id: 'ORD-013', customer: 'Epsilon Ltd', status: 'pending', priority: 'low', total: 1500, dueDate: '2025-11-25', isActive: true },
  { id: 'ORD-014', customer: 'Zeta Industries', status: 'active', priority: 'high', total: 9100, dueDate: '2025-11-02', isActive: true },
  { id: 'ORD-015', customer: 'Eta Systems', status: 'cancelled', priority: 'medium', total: 3700, dueDate: '2025-10-10', isActive: false },
  { id: 'ORD-016', customer: 'Theta Corp', status: 'active', priority: 'medium', total: 4200, dueDate: '2025-11-14', isActive: true },
  { id: 'ORD-017', customer: 'Iota Tech', status: 'pending', priority: 'high', total: 6300, dueDate: '2025-11-06', isActive: true },
  { id: 'ORD-018', customer: 'Kappa Ltd', status: 'completed', priority: 'low', total: 1100, dueDate: '2025-10-18', isActive: false },
  { id: 'ORD-019', customer: 'Lambda Industries', status: 'active', priority: 'medium', total: 3800, dueDate: '2025-11-11', isActive: true },
  { id: 'ORD-020', customer: 'Mu Systems', status: 'pending', priority: 'low', total: 2200, dueDate: '2025-11-22', isActive: true },
  { id: 'ORD-021', customer: 'Nu Corp', status: 'active', priority: 'high', total: 7800, dueDate: '2025-11-04', isActive: true },
  { id: 'ORD-022', customer: 'Xi Solutions', status: 'completed', priority: 'medium', total: 4100, dueDate: '2025-10-28', isActive: false },
  { id: 'ORD-023', customer: 'Omicron Tech', status: 'active', priority: 'low', total: 1900, dueDate: '2025-11-16', isActive: true },
  { id: 'ORD-024', customer: 'Pi Industries', status: 'pending', priority: 'high', total: 5900, dueDate: '2025-11-07', isActive: true },
  { id: 'ORD-025', customer: 'Rho Ltd', status: 'cancelled', priority: 'medium', total: 2700, dueDate: '2025-10-12', isActive: false },
];

export function FilteredGridDemo() {
  const { t } = useTranslation();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Status colors for row backgrounds
  const statusColors = {
    active: '#4CAF50',    // Green
    pending: '#FF9800',   // Orange
    completed: '#2196F3', // Blue
    cancelled: '#f44336', // Red
  };

  // Filter configurations
  const filters: FilterConfig[] = [
    {
      field: 'status',
      title: t('components.filteredGridDemo.statusTitle'),
      options: [
        { value: 'active', label: t('components.filteredGridDemo.statusActive') },
        { value: 'pending', label: t('components.filteredGridDemo.statusPending') },
        { value: 'completed', label: t('components.filteredGridDemo.statusCompleted') },
        { value: 'cancelled', label: t('components.filteredGridDemo.statusCancelled') },
      ],
    },
    {
      field: 'priority',
      title: t('components.filteredGridDemo.priorityTitle'),
      options: [
        { value: 'low', label: t('components.filteredGridDemo.priorityLow') },
        { value: 'medium', label: t('components.filteredGridDemo.priorityMedium') },
        { value: 'high', label: t('components.filteredGridDemo.priorityHigh') },
      ],
    },
  ];

  // Quick filters with custom logic
  const quickFilters: QuickFilterConfig[] = [
    {
      id: 'overdue',
      label: t('components.filteredGridDemo.quickFilterOverdue'),
      filterFn: (order: Order) => new Date(order.dueDate) < new Date(),
    },
    {
      id: 'high-value',
      label: t('components.filteredGridDemo.quickFilterHighValue'),
      filterFn: (order: Order) => order.total > 5000,
    },
  ];

  // Column definitions
  const columns = [
    { title: t('components.filteredGridDemo.columnOrderId'), field: 'id', sortable: true, width: 120 },
    { title: t('components.filteredGridDemo.columnCustomer'), field: 'customer', sortable: true, width: 250 },
    { title: t('components.filteredGridDemo.columnStatus'), field: 'status', sortable: true, width: 120 },
    { title: t('components.filteredGridDemo.columnPriority'), field: 'priority', sortable: true, width: 100 },
    {
      title: t('components.filteredGridDemo.columnTotal'),
      field: 'total',
      sortable: true,
      width: 120,
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    { title: t('components.filteredGridDemo.columnDueDate'), field: 'dueDate', sortable: true, width: 120 },
  ];

  // Actions
  const actions = [
    {
      label: '✏️',
      title: t('common.edit'),
      onClick: (order: Order) => alert(`${t('common.edit')} ${order.id}`),
      variant: 'primary' as const,
    },
    {
      label: '👁️',
      title: t('common.view'),
      onClick: (order: Order) => alert(`${t('common.view')} ${order.id}`),
      variant: 'secondary' as const,
    },
    {
      label: '🗑️',
      title: t('common.delete'),
      onClick: (order: Order) => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm(t('components.filteredGridDemo.deleteConfirm', { id: order.id }))) {
          alert(t('components.filteredGridDemo.orderDeleted', { id: order.id }));
        }
      },
      variant: 'danger' as const,
      disabled: (order: Order) => order.status === 'completed',
    },
  ];

  // Expanded content
  const renderExpandedContent = (order: Order) => (
    <div className={styles.expandedContent}>
      <h4>{t('components.filteredGridDemo.orderDetailsTitle', { id: order.id })}</h4>
      <div className={styles.detailsGrid}>
        <div>
          <strong>{t('components.filteredGridDemo.labelCustomer')}</strong> {order.customer}
        </div>
        <div>
          <strong>{t('components.filteredGridDemo.labelStatus')}</strong> {order.status}
        </div>
        <div>
          <strong>{t('components.filteredGridDemo.labelPriority')}</strong> {order.priority}
        </div>
        <div>
          <strong>{t('components.filteredGridDemo.labelTotal')}</strong> ${order.total.toLocaleString()}
        </div>
        <div>
          <strong>{t('components.filteredGridDemo.labelDueDate')}</strong> {order.dueDate}
        </div>
        <div>
          <strong>{t('components.filteredGridDemo.labelActive')}</strong> {order.isActive ? t('components.filteredGridDemo.yes') : t('components.filteredGridDemo.no')}
        </div>
      </div>
    </div>
  );

  return (
    <BasePage>
      <div className={styles.demoPage}>
        <h1>{t('components.filteredGridDemo.title')}</h1>

        <div className={styles.info}>
          <p>
            <strong>{t('components.filteredGridDemo.featuresTitle')}</strong>
          </p>
          <ul>
            <li>{t('components.filteredGridDemo.feature1')}</li>
            <li>{t('components.filteredGridDemo.feature2')}</li>
            <li>{t('components.filteredGridDemo.feature3')}</li>
            <li>{t('components.filteredGridDemo.feature4')}</li>
            <li>{t('components.filteredGridDemo.feature5')}</li>
            <li>{t('components.filteredGridDemo.feature6')}</li>
            <li>{t('components.filteredGridDemo.feature7')}</li>
            <li>{t('components.filteredGridDemo.feature8')}</li>
            <li>{t('components.filteredGridDemo.feature9')}</li>
            <li>{t('components.filteredGridDemo.feature10')}</li>
            <li>{t('components.filteredGridDemo.feature11')}</li>
            <li>{t('components.filteredGridDemo.feature12')}</li>
          </ul>
        </div>

        <FilteredDataGrid
          data={mockOrders}
          columns={columns}
          getRowId={(row) => row.id}
          searchPlaceholder={t('components.filteredGridDemo.searchPlaceholder')}
          filters={filters}
          quickFilters={quickFilters}
          useFilterCheckboxes={true}
          itemsPerPage={10}
          onNewItem={() => alert(t('components.filteredGridDemo.newOrderClicked'))}
          newItemText={t('components.filteredGridDemo.newOrderButton')}
          inactiveField="isActive"
          showInactiveLabel={t('components.filteredGridDemo.showInactiveLabel')}
          enableSelection
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          expandable
          expandedRows={expandedRows}
          onRowToggle={(id) => {
            setExpandedRows((prev) => {
              const next = new Set(prev);
              next.has(id) ? next.delete(id) : next.add(id);
              return next;
            });
          }}
          renderExpandedContent={renderExpandedContent}
          actions={actions}
          getRowStatus={(row) => row.status}
          statusColors={statusColors}
          gridId="filteredGridDemo"
          betweenContent={
            <div className={styles.selectedInfo}>
              <div className={styles.selectedCount}>
                <strong>{t('components.filteredGridDemo.selectedRows')}</strong> {selectedRows.size} {t('components.filteredGridDemo.orders')}
              </div>
              {selectedRows.size > 0 && (
                <div className={styles.selectedActions}>
                  <button
                    className={styles.actionButton}
                    onClick={() => {
                      alert(`Export ${selectedRows.size} ${t('components.filteredGridDemo.orders')}`);
                    }}
                  >
                    <span role="img" aria-label="inbox">📥</span> {t('common.export')}
                  </button>
                  <button
                    className={styles.actionButton}
                    onClick={() => {
                      // eslint-disable-next-line no-restricted-globals
                      if (confirm(t('components.filteredGridDemo.deleteSelectedConfirm', { count: selectedRows.size }))) {
                        alert(t('components.filteredGridDemo.selectedDeleted', { count: selectedRows.size }));
                        setSelectedRows(new Set());
                      }
                    }}
                  >
                    <span role="img" aria-label="trash">🗑️</span> {t('common.delete')}
                  </button>
                  <button
                    className={styles.actionButtonSecondary}
                    onClick={() => setSelectedRows(new Set())}
                  >
                    {t('components.filteredGridDemo.clearSelection')}
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
