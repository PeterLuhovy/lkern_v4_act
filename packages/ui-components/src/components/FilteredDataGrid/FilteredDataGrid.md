# ================================================================
# FilteredDataGrid Component Documentation
# ================================================================
# File: L:\system\lkern_codebase_v4_act\packages\ui-components\src\components\FilteredDataGrid\FilteredDataGrid.md
# Version: 1.0.0
# Created: 2025-11-06
# Updated: 2025-11-06
# Component: FilteredDataGrid v1.0.0
# Package: @l-kern/ui-components
#
# Description:
#   Complete documentation for FilteredDataGrid wrapper component -
#   combines FilterPanel + DataGrid with internal state management
#   for quick and easy filtered grid setup.
# ================================================================

---

## 📋 Overview

**FilteredDataGrid** is a convenience wrapper component that combines **FilterPanel** + **DataGrid** with **internal state management**. Ideal for quick setup of filtered data grids without manual state wiring.

### When to Use

- ✅ **Quick prototypes** - Need filtered grid fast
- ✅ **Simple filtering UIs** - Standard search + filter + pagination
- ✅ **List pages** with common filter patterns
- ✅ **Management interfaces** (orders, contacts, products)
- ✅ **Dashboard tables** with filters
- ✅ **Internal tools** with minimal customization

### When NOT to Use

- ❌ **Complex filter logic** - Use FilterPanel + DataGrid separately for full control
- ❌ **Custom state management** - Use FilterPanel + DataGrid with your own state
- ❌ **Advanced filter UIs** - FilterPanel alone is more flexible
- ❌ **External filter state** - Use separate components for controlled state

### Architecture: 3 Components Pattern

```
FilteredDataGrid (wrapper with internal state)
├── FilterPanel (search + filters + controls)
│   ├── Search input
│   ├── Quick filters
│   ├── Filter groups
│   ├── Items per page
│   └── Result count
└── DataGrid (data display)
    ├── Columns (sortable, resizable)
    ├── Rows (expandable, selectable)
    └── Actions column
```

---

## ✨ Features

### Internal State Management

**FilteredDataGrid manages ALL filter state internally:**
- ✅ Search query (`useState<string>`)
- ✅ Filter group selections (`useState<Map<string, Set<string>>>`)
- ✅ Quick filter toggles (`useState<Set<string>>`)
- ✅ Show inactive toggle (`useState<boolean>`)
- ✅ Items per page (`useState<number>`)

**Filtering logic (`useMemo`):**
- ✅ Search filtering (all string fields by default, or custom `searchFn`)
- ✅ Filter group filtering (multi-select AND logic)
- ✅ Quick filter filtering (custom filter functions)
- ✅ Inactive filtering (optional `inactiveField` prop)
- ✅ Auto "Clear All" button (appears when filters active)

### Props Passthrough

**All DataGrid props supported:**
- ✅ `columns`, `getRowId`, `onRowClick`, `getRowStatus`
- ✅ `enableSelection`, `selectedRows`, `onSelectionChange`
- ✅ `expandable`, `expandedRows`, `onRowToggle`, `renderExpandedContent`
- ✅ `actions`, `compact`

---

## 📦 Installation

FilteredDataGrid is part of `@l-kern/ui-components` package.

```bash
# Already installed if using L-KERN v4
yarn add @l-kern/ui-components
```

---

## 🎯 Basic Usage

### Minimal Example (Search Only)

```typescript
import { FilteredDataGrid } from '@l-kern/ui-components';

function OrdersPage() {
  const orders = [
    { id: '1', customer: 'ACME Corp', status: 'active', total: 1500 },
    { id: '2', customer: 'TechStart', status: 'pending', total: 2300 },
  ];

  const columns = [
    { title: 'Customer', field: 'customer' },
    { title: 'Status', field: 'status' },
    { title: 'Total', field: 'total' },
  ];

  return (
    <FilteredDataGrid
      data={orders}
      columns={columns}
      searchPlaceholder="Search orders..."
    />
  );
}
```

### With Filter Groups

```typescript
import { FilteredDataGrid, FilterConfig } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';

function OrdersPage() {
  const { t } = useTranslation();

  const filters: FilterConfig[] = [
    {
      field: 'status',
      title: t('orders.filters.statusTitle'),
      options: [
        { value: 'active', label: t('orders.status.active') },
        { value: 'pending', label: t('orders.status.pending') },
        { value: 'completed', label: t('orders.status.completed') },
      ],
    },
    {
      field: 'priority',
      title: t('orders.filters.priorityTitle'),
      options: [
        { value: 'low', label: t('orders.priority.low') },
        { value: 'medium', label: t('orders.priority.medium') },
        { value: 'high', label: t('orders.priority.high') },
      ],
    },
  ];

  return (
    <FilteredDataGrid
      data={orders}
      columns={columns}
      filters={filters}
      searchPlaceholder="Search orders..."
    />
  );
}
```

### With Quick Filters

```typescript
import { FilteredDataGrid, QuickFilterConfig } from '@l-kern/ui-components';

function OrdersPage() {
  const quickFilters: QuickFilterConfig[] = [
    {
      id: 'overdue',
      label: 'Overdue',
      filterFn: (order) => new Date(order.dueDate) < new Date(),
    },
    {
      id: 'high-value',
      label: 'High Value (>$5000)',
      filterFn: (order) => order.total > 5000,
    },
  ];

  return (
    <FilteredDataGrid
      data={orders}
      columns={columns}
      quickFilters={quickFilters}
      searchPlaceholder="Search orders..."
    />
  );
}
```

### Full Example (All Features)

```typescript
import { FilteredDataGrid } from '@l-kern/ui-components';
import { useState } from 'react';
import { useTranslation } from '@l-kern/config';

function OrdersPage() {
  const { t } = useTranslation();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const filters = [
    {
      field: 'status',
      title: t('orders.filters.statusTitle'),
      options: [
        { value: 'active', label: t('orders.status.active') },
        { value: 'pending', label: t('orders.status.pending') },
      ],
    },
  ];

  const quickFilters = [
    {
      id: 'overdue',
      label: t('orders.filters.overdue'),
      filterFn: (order) => new Date(order.dueDate) < new Date(),
    },
  ];

  const actions = [
    { label: 'Edit', onClick: (order) => editOrder(order), variant: 'primary' },
    { label: 'View', onClick: (order) => viewOrder(order), variant: 'secondary' },
    { label: 'Delete', onClick: (order) => deleteOrder(order), variant: 'danger' },
  ];

  return (
    <FilteredDataGrid
      // Data
      data={orders}
      columns={columns}
      getRowId={(row) => row.id}

      // Search & Filters
      searchPlaceholder="Search orders..."
      filters={filters}
      quickFilters={quickFilters}
      useFilterCheckboxes={false}

      // Controls
      itemsPerPage={20}
      onNewItem={() => openNewOrderModal()}
      newItemText="➕ New Order"

      // Show Inactive
      inactiveField="isActive"
      showInactiveLabel="Show Inactive Orders"

      // DataGrid features
      enableSelection
      expandable
      expandedRows={expandedRows}
      onRowToggle={(id) => {
        setExpandedRows((prev) => {
          const next = new Set(prev);
          next.has(id) ? next.delete(id) : next.add(id);
          return next;
        });
      }}
      renderExpandedContent={(order) => <OrderDetails order={order} />}
      actions={actions}
      getRowStatus={(row) => row.status}
      compact
    />
  );
}
```

---

## 🎨 Props API

### FilteredDataGridProps

```typescript
export interface FilteredDataGridProps<T = any> {
  // === DATA ===
  data: T[];  // Original data (unfiltered)

  // === DATAGRID PROPS (passthrough) ===
  columns: Column[];
  getRowId?: (row: T) => string;
  onRowClick?: (row: T) => void;
  getRowStatus?: (row: T) => string;
  enableSelection?: boolean;
  selectedRows?: Set<string>;
  onSelectionChange?: (selected: Set<string>) => void;
  expandable?: boolean;
  expandedRows?: Set<string>;
  onRowToggle?: (id: string) => void;
  renderExpandedContent?: (row: T) => React.ReactNode;
  actions?: DataGridAction<T>[];
  compact?: boolean;

  // === SEARCH ===
  searchPlaceholder?: string;
  searchFn?: (item: T, query: string) => boolean;  // Custom search

  // === FILTERS ===
  filters?: FilterConfig[];
  useFilterCheckboxes?: boolean;

  // === QUICK FILTERS ===
  quickFilters?: QuickFilterConfig[];

  // === CONTROLS ===
  itemsPerPage?: number;
  onNewItem?: () => void;
  newItemText?: string;

  // === SHOW INACTIVE ===
  inactiveField?: string;  // Field to check (e.g., 'isActive')
  showInactiveLabel?: string;
}
```

### FilterConfig

```typescript
export interface FilterConfig {
  field: string;              // Field name (e.g., 'status')
  title: string;              // Group title (translated)
  options: Array<{
    value: string;            // Option value
    label: string;            // Option label (translated)
  }>;
}
```

### QuickFilterConfig

```typescript
export interface QuickFilterConfig {
  id: string;                 // Unique identifier
  label: string;              // Display label (translated)
  filterFn: (item: any) => boolean;  // Filter function
}
```

---

## 🎯 How It Works

### Internal State Flow

```typescript
// User types in search
setSearchQuery('ACME')

// User clicks status filter
toggleFilter('status', 'active')
// → filterStates.set('status', new Set(['active']))

// User clicks quick filter
toggleQuickFilter('overdue')
// → activeQuickFilters.add('overdue')

// FilteredDataGrid filters data (useMemo)
const filteredData = data.filter(row => {
  // Search: 'ACME' in any field
  if (!row.customer.includes('ACME')) return false;

  // Status: must be 'active'
  if (row.status !== 'active') return false;

  // Quick filter: must be overdue
  if (new Date(row.dueDate) >= new Date()) return false;

  return true;
});

// DataGrid receives filtered data
<DataGrid data={filteredData} />
```

### Default Search Function

```typescript
// Searches ALL string fields by default
const defaultSearchFn = (item: T, query: string): boolean => {
  const searchLower = query.toLowerCase();
  return Object.values(item).some((val) =>
    String(val).toLowerCase().includes(searchLower)
  );
};
```

### Custom Search Function

```typescript
// Search specific fields only
<FilteredDataGrid
  data={orders}
  columns={columns}
  searchFn={(order, query) => {
    const q = query.toLowerCase();
    return (
      order.customer.toLowerCase().includes(q) ||
      order.id.toLowerCase().includes(q)
    );
  }}
/>
```

---

## 🎨 Comparison: FilteredDataGrid vs Separate Components

### FilteredDataGrid (Quick Setup)

**✅ Pros:**
- Fast setup (5 lines of code)
- No state management needed
- Built-in filtering logic
- Auto "Clear All" button

**❌ Cons:**
- Less flexibility
- Can't customize filter logic
- Internal state only
- No external state access

**Example:**
```typescript
<FilteredDataGrid
  data={orders}
  columns={columns}
  filters={filters}
/>
```

### FilterPanel + DataGrid (Full Control)

**✅ Pros:**
- Full control over state
- Custom filtering logic
- External state management
- Can use FilterPanel with other components

**❌ Cons:**
- More boilerplate code
- Manual state wiring
- More complex

**Example:**
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [statusFilters, setStatusFilters] = useState<Set<string>>(new Set());

const filteredData = useMemo(() => {
  return data.filter(row => {
    // Custom filtering logic
    if (searchQuery && !matchesSearch(row, searchQuery)) return false;
    if (statusFilters.size > 0 && !statusFilters.has(row.status)) return false;
    return true;
  });
}, [data, searchQuery, statusFilters]);

<FilterPanel
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  filterGroups={[...]}
  resultCount={filteredData.length}
/>
<DataGrid data={filteredData} columns={columns} />
```

---

## 📝 Best Practices

### Use FilteredDataGrid When...

- ✅ Prototyping or MVP development
- ✅ Standard filtering patterns
- ✅ No external state needed
- ✅ Simple search + filter + pagination

### Use FilterPanel + DataGrid When...

- ✅ Complex filtering logic
- ✅ External state management (Redux, Zustand)
- ✅ Custom filter algorithms
- ✅ FilterPanel with non-grid displays (cards, kanban)

### Translation Keys

**Always use translations:**

```typescript
// Bad: Hardcoded ❌
<FilteredDataGrid
  filters={[
    { field: 'status', title: 'STATUS', options: [...] }
  ]}
  newItemText="New Order"
/>

// Good: Translated ✅
const { t } = useTranslation();
<FilteredDataGrid
  filters={[
    { field: 'status', title: t('orders.filters.statusTitle'), options: [...] }
  ]}
  newItemText={t('orders.newOrder')}
/>
```

---

## 🐛 Troubleshooting

### Filters not working

**Problem**: Clicking filters doesn't filter data.

**Solution**: Check filter `field` matches data property:

```typescript
// Bad: Field doesn't match ❌
const filters = [
  { field: 'orderStatus', title: 'STATUS', ... }  // Wrong field!
];
const data = [{ id: '1', status: 'active' }];  // Field is 'status'

// Good: Field matches ✅
const filters = [
  { field: 'status', title: 'STATUS', ... }  // Correct!
];
```

### Search not finding items

**Problem**: Search doesn't match items.

**Solution**: Use custom `searchFn` for specific fields:

```typescript
<FilteredDataGrid
  data={orders}
  columns={columns}
  searchFn={(order, query) => {
    const q = query.toLowerCase();
    // Search only customer and ID
    return order.customer.toLowerCase().includes(q) ||
           order.id.toLowerCase().includes(q);
  }}
/>
```

### Show Inactive not appearing

**Problem**: Show Inactive checkbox doesn't render.

**Solution**: Provide `inactiveField` prop:

```typescript
// Missing inactiveField ❌
<FilteredDataGrid data={orders} columns={columns} />

// With inactiveField ✅
<FilteredDataGrid
  data={orders}
  columns={columns}
  inactiveField="isActive"  // Must specify field!
/>
```

---

## 🎯 Related Components

- **[FilterPanel](../FilterPanel/FilterPanel.md)** - Standalone filter panel
- **[DataGrid](../DataGrid/DataGrid.md)** - Standalone data grid
- **[EmptyState](../EmptyState/EmptyState.md)** - For empty filtered results

---

## 🔧 Migration from Separate Components

### Before (FilterPanel + DataGrid)

```typescript
const [searchQuery, setSearchQuery] = useState('');
const [statusFilters, setStatusFilters] = useState<Set<string>>(new Set());

const filteredData = useMemo(() => {
  return data.filter(row => {
    if (searchQuery && !matchesSearch(row, searchQuery)) return false;
    if (statusFilters.size > 0 && !statusFilters.has(row.status)) return false;
    return true;
  });
}, [data, searchQuery, statusFilters]);

<FilterPanel
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  filterGroups={[...]}
  resultCount={filteredData.length}
/>
<DataGrid data={filteredData} columns={columns} />
```

### After (FilteredDataGrid)

```typescript
<FilteredDataGrid
  data={data}
  columns={columns}
  filters={[
    {
      field: 'status',
      title: 'STATUS',
      options: [...],
    },
  ]}
/>
```

**Result: 20 lines → 8 lines** ✅

---

**Last Updated**: 2025-11-06
**Version**: 1.0.0
**Component**: FilteredDataGrid v1.0.0
**Package**: @l-kern/ui-components
