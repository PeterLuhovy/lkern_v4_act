/*
 * ================================================================
 * FILE: DataGridTestPage.tsx
 * PATH: /apps/web-ui/src/__tests__/pages/DataGridTestPage/DataGridTestPage.tsx
 * DESCRIPTION: Test page for DataGrid component - all features demonstration
 * VERSION: v1.0.0
 * CREATED: 2025-11-06
 * UPDATED: 2025-11-06 12:00:00
 * ================================================================
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DataGrid, BasePage, Button, type Column, type DataGridAction } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import styles from './DataGridTestPage.module.css';

// === TYPES ===
interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  orders: number;
}

interface Order {
  id: string;
  product: string;
  quantity: number;
  price: number;
}

// === SAMPLE DATA ===
const sampleContacts: Contact[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+421 901 234 567', status: 'active', orders: 5 },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+421 902 345 678', status: 'active', orders: 3 },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', phone: '+421 903 456 789', status: 'inactive', orders: 0 },
  { id: '4', name: 'Alice Williams', email: 'alice@example.com', phone: '+421 904 567 890', status: 'pending', orders: 1 },
  { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', phone: '+421 905 678 901', status: 'active', orders: 8 },
  { id: '6', name: 'Diana Prince', email: 'diana@example.com', phone: '+421 906 789 012', status: 'active', orders: 12 },
  { id: '7', name: 'Eve Davis', email: 'eve@example.com', phone: '+421 907 890 123', status: 'inactive', orders: 0 },
  { id: '8', name: 'Frank Miller', email: 'frank@example.com', phone: '+421 908 901 234', status: 'pending', orders: 2 },
];

const sampleOrders: Record<string, Order[]> = {
  '1': [
    { id: 'o1', product: 'Laptop', quantity: 1, price: 1200 },
    { id: 'o2', product: 'Mouse', quantity: 2, price: 25 },
  ],
  '2': [{ id: 'o3', product: 'Keyboard', quantity: 1, price: 80 }],
  '4': [{ id: 'o4', product: 'Monitor', quantity: 1, price: 350 }],
  '5': [
    { id: 'o5', product: 'USB Cable', quantity: 5, price: 10 },
    { id: 'o6', product: 'HDMI Cable', quantity: 3, price: 15 },
  ],
  '6': [
    { id: 'o7', product: 'Webcam', quantity: 1, price: 120 },
    { id: 'o8', product: 'Headphones', quantity: 2, price: 60 },
    { id: 'o9', product: 'Microphone', quantity: 1, price: 90 },
  ],
  '8': [{ id: 'o10', product: 'Tablet', quantity: 1, price: 450 }],
};

// === COMPONENT ===
export const DataGridTestPage: React.FC = () => {
  const { t } = useTranslation();

  // === STATE ===
  const [data, setData] = useState<Contact[]>(sampleContacts);
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [compactMode, setCompactMode] = useState(false);
  const [enableSelection, setEnableSelection] = useState(true);
  const [enableActions, setEnableActions] = useState(true);
  const [filterText, setFilterText] = useState('');

  // === STATUS COLORS ===
  const statusColors = {
    active: '#4CAF50',    // Green
    inactive: '#9E9E9E',  // Gray
    pending: '#FF9800',   // Orange
  };

  // === SORTING LOGIC ===
  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortField as keyof Contact];
      const bValue = b[sortField as keyof Contact];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return sorted;
  }, [data, sortField, sortDirection]);

  // === FILTERING LOGIC ===
  const filteredData = useMemo(() => {
    if (!filterText) return sortedData;

    const lowerFilter = filterText.toLowerCase();
    return sortedData.filter(
      (contact) =>
        contact.name.toLowerCase().includes(lowerFilter) ||
        contact.email.toLowerCase().includes(lowerFilter) ||
        contact.phone.includes(lowerFilter)
    );
  }, [sortedData, filterText]);

  // === HANDLERS ===
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRowToggle = (rowId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowId)) {
      newExpanded.delete(rowId);
    } else {
      newExpanded.add(rowId);
    }
    setExpandedRows(newExpanded);
  };

  const handleEdit = (contact: Contact, e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`Edit contact: ${contact.name}`);
  };

  const handleDelete = (contact: Contact, e: React.MouseEvent) => {
    e.stopPropagation();
    // eslint-disable-next-line no-restricted-globals
    if (confirm(`Delete contact: ${contact.name}?`)) {
      setData(data.filter((c) => c.id !== contact.id));
      // Clear selection if deleted
      const newSelection = new Set(selectedRows);
      newSelection.delete(contact.id);
      setSelectedRows(newSelection);
    }
  };

  const handlePath = (contact: Contact, e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`Open path for: ${contact.name}`);
  };

  // === COLUMNS ===
  const columns: Column[] = [
    {
      title: t('common.name'),
      field: 'name',
      sortable: true,
      width: 200,
    },
    {
      title: t('common.email'),
      field: 'email',
      sortable: true,
      width: 250,
    },
    {
      title: t('common.phone'),
      field: 'phone',
      sortable: false,
      width: 150,
    },
    {
      title: t('common.status'),
      field: 'status',
      sortable: true,
      width: 120,
      render: (value: string) => (
        <span
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#ffffff',
            backgroundColor: statusColors[value as keyof typeof statusColors],
            textTransform: 'uppercase',
          }}
        >
          {value}
        </span>
      ),
    },
    {
      title: t('common.orders'),
      field: 'orders',
      sortable: true,
      width: 100,
      render: (value: number) => (
        <span style={{ fontWeight: value > 0 ? 700 : 400, color: value > 0 ? '#4CAF50' : '#9E9E9E' }}>
          {value}
        </span>
      ),
    },
  ];

  // === ACTIONS ===
  const actions: DataGridAction<Contact>[] = enableActions
    ? [
        {
          variant: 'primary',
          onClick: handleEdit,
          label: '✏️',
          title: t('common.edit'),
        },
        {
          variant: 'secondary',
          onClick: handlePath,
          label: '👁️',
          title: t('common.view'),
        },
        {
          variant: 'danger',
          onClick: handleDelete,
          label: '🗑️',
          title: t('common.delete'),
          disabled: (row) => row.orders > 0, // Can't delete if has orders
        },
      ]
    : [];

  // === EXPANDED CONTENT (Nested DataGrid for Orders) ===
  const renderExpandedContent = (contact: Contact) => {
    const orders = sampleOrders[contact.id] || [];

    if (orders.length === 0) {
      return (
        <div style={{ padding: '16px', textAlign: 'center', color: '#9E9E9E' }}>
          {t('components.dataGridTest.noOrders')}
        </div>
      );
    }

    const orderColumns: Column[] = [
      { title: t('common.product'), field: 'product', sortable: false, width: 200 },
      { title: t('common.quantity'), field: 'quantity', sortable: false, width: 100 },
      {
        title: t('common.price'),
        field: 'price',
        sortable: false,
        width: 100,
        render: (value: number) => `$${value}`,
      },
      {
        title: t('common.total'),
        field: 'total',
        sortable: false,
        width: 100,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- First parameter unused but required by DataGrid interface
        render: (_: any, row: Order) => `$${row.quantity * row.price}`,
      },
    ];

    return (
      <div style={{ padding: '8px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600 }}>
          {t('components.dataGridTest.ordersFor')} {contact.name}
        </h3>
        <DataGrid
          data={orders}
          columns={orderColumns}
          getRowId={(row) => row.id}
          getRowStatus={() => contact.status}
          statusColors={statusColors}
          gridId={`orders-${contact.id}`}
        />
      </div>
    );
  };

  // === RENDER ===
  return (
    <BasePage>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <Link to="/testing" className={styles.backLink}>
            {t('components.dataGridTest.backToTesting')}
          </Link>
          <h1 className={styles.title}>{t('components.dataGridTest.title')}</h1>
          <p className={styles.subtitle}>
            {t('components.dataGridTest.subtitle')}
          </p>
        </div>

        {/* Controls */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('components.dataGridTest.controls')}</h2>
          <div className={styles.controls}>
            <Button variant={compactMode ? 'primary' : 'secondary'} onClick={() => setCompactMode(!compactMode)}>
              {compactMode ? t('components.dataGridTest.normalMode') : t('components.dataGridTest.compactMode')}
            </Button>
            <Button
              variant={enableSelection ? 'primary' : 'secondary'}
              onClick={() => setEnableSelection(!enableSelection)}
            >
              {enableSelection ? t('components.dataGridTest.disableSelection') : t('components.dataGridTest.enableSelection')}
            </Button>
            <Button variant={enableActions ? 'primary' : 'secondary'} onClick={() => setEnableActions(!enableActions)}>
              {enableActions ? t('components.dataGridTest.hideActions') : t('components.dataGridTest.showActions')}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setExpandedRows(new Set());
                setSelectedRows(new Set());
              }}
            >
              {t('components.dataGridTest.clearAll')}
            </Button>
            <Button variant="secondary" onClick={() => setData(sampleContacts)}>
              {t('components.dataGridTest.resetData')}
            </Button>
          </div>

          {/* Filter */}
          <div className={styles.filterRow}>
            <input
              type="text"
              placeholder={t('components.dataGridTest.filterPlaceholder')}
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className={styles.filterInput}
            />
            {filterText && (
              <Button variant="ghost" onClick={() => setFilterText('')}>
                {t('components.dataGridTest.clearFilter')}
              </Button>
            )}
          </div>

          {/* Selection Info */}
          {enableSelection && selectedRows.size > 0 && (
            <div className={styles.selectionInfo}>
              <strong>{selectedRows.size}</strong> {t('components.dataGridTest.rowsSelected')}
              <Button
                variant="ghost"
                size="small"
                onClick={() => {
                  const selectedContacts = data.filter((c) => selectedRows.has(c.id));
                  alert(`Selected:\n${selectedContacts.map((c) => c.name).join('\n')}`);
                }}
              >
                {t('components.dataGridTest.showSelected')}
              </Button>
            </div>
          )}
        </section>

        {/* Main DataGrid */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('components.dataGridTest.mainGridTitle')}</h2>
          <div className={styles.features}>
            <span>{t('components.dataGridTest.features.sortable')}</span>
            <span>{t('components.dataGridTest.features.resizable')}</span>
            {enableSelection && <span>{t('components.dataGridTest.features.checkboxSelection')}</span>}
            <span>{t('components.dataGridTest.features.rowExpansion')}</span>
            <span>{t('components.dataGridTest.features.nestedGrid')}</span>
            {enableActions && <span>{t('components.dataGridTest.features.actionsColumn')}</span>}
            <span>{t('components.dataGridTest.features.statusColors')}</span>
            {compactMode && <span>{t('components.dataGridTest.features.compactMode')}</span>}
            <span>{t('components.dataGridTest.features.keyboard')}</span>
            <span>{t('components.dataGridTest.features.persistence')}</span>
          </div>

          <DataGrid
            data={filteredData}
            columns={columns}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            expandedRows={expandedRows}
            onRowToggle={handleRowToggle}
            renderExpandedContent={renderExpandedContent}
            getRowId={(row) => row.id}
            getRowStatus={(row) => row.status}
            statusColors={statusColors}
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
            enableSelection={enableSelection}
            compactMode={compactMode}
            actions={actions}
            hasActiveFilters={!!filterText}
            gridId="main-contacts"
          />
        </section>

        {/* Empty State Test */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('components.dataGridTest.emptyStateTitle')}</h2>
          <DataGrid
            data={[]}
            columns={columns}
            hasActiveFilters={false}
            gridId="empty-test"
          />
        </section>

        {/* Empty State with Filters */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('components.dataGridTest.emptyFilterTitle')}</h2>
          <DataGrid
            data={[]}
            columns={columns}
            hasActiveFilters={true}
            gridId="empty-filter-test"
          />
        </section>
      </div>
    </BasePage>
  );
};
