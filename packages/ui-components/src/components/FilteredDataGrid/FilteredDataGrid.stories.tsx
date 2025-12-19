/*
 * ================================================================
 * FILE: FilteredDataGrid.stories.tsx
 * PATH: /packages/ui-components/src/components/FilteredDataGrid/FilteredDataGrid.stories.tsx
 * DESCRIPTION: Storybook stories for FilteredDataGrid component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FilteredDataGrid } from './FilteredDataGrid';
import type { Column } from '../DataGrid';
import type { FilterConfig } from './FilteredDataGrid.types';

// Mock data types
interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  isActive: boolean;
  createdAt: string;
}

// Generate mock data
const generateMockContacts = (count: number): Contact[] => {
  const statuses: Contact['status'][] = ['active', 'pending', 'completed', 'cancelled'];
  const priorities: Contact['priority'][] = ['high', 'medium', 'low'];
  const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson', 'Diana Prince', 'Eve Adams', 'Frank Miller'];

  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    name: names[i % names.length],
    email: `user${i + 1}@example.com`,
    phone: `+42190${String(i + 1).padStart(7, '0')}`,
    status: statuses[i % statuses.length],
    priority: priorities[i % priorities.length],
    isActive: i % 4 !== 0, // 75% active, 25% inactive
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

const mockContacts = generateMockContacts(50);

// Columns configuration
const columns: Column[] = [
  { title: 'Name', field: 'name', sortable: true, width: 180 },
  { title: 'Email', field: 'email', sortable: true, width: 220 },
  { title: 'Phone', field: 'phone', sortable: false, width: 150 },
  { title: 'Status', field: 'status', sortable: true, width: 120 },
  { title: 'Priority', field: 'priority', sortable: true, width: 120 },
];

// Status colors
const statusColors = {
  active: '#4CAF50',
  pending: '#FF9800',
  completed: '#2196F3',
  cancelled: '#9e9e9e',
};

const statusLabels = {
  active: 'Active',
  pending: 'Pending',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

// Filter configurations
const filters: FilterConfig[] = [
  {
    field: 'status',
    title: 'STATUS',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'pending', label: 'Pending' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' },
    ],
  },
  {
    field: 'priority',
    title: 'PRIORITY',
    options: [
      { value: 'high', label: 'High' },
      { value: 'medium', label: 'Medium' },
      { value: 'low', label: 'Low' },
    ],
  },
];

const meta: Meta<typeof FilteredDataGrid> = {
  title: 'Components/Data/FilteredDataGrid',
  component: FilteredDataGrid,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Wrapper combining FilterPanel + DataGrid + Pagination with internal state management. Handles filtering, sorting, and pagination automatically.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FilteredDataGrid>;

// ============================================================
// Basic States
// ============================================================

export const Default: Story = {
  args: {
    data: mockContacts,
    columns,
    getRowId: (row) => row.id,
    gridId: 'default-filtered-grid',
  },
};

export const WithFilters: Story = {
  args: {
    data: mockContacts,
    columns,
    filters,
    getRowId: (row) => row.id,
    gridId: 'filtered-grid',
  },
  parameters: {
    docs: {
      description: {
        story: 'FilteredDataGrid with status and priority filter groups.',
      },
    },
  },
};

export const WithStatusColors: Story = {
  args: {
    data: mockContacts,
    columns,
    filters,
    getRowId: (row) => row.id,
    getRowStatus: (row) => row.status,
    statusColors,
    statusLabels,
    showStatusLegend: true,
    gridId: 'status-colored-grid',
  },
  parameters: {
    docs: {
      description: {
        story: 'Rows colored by status with status legend in FilterPanel.',
      },
    },
  },
};

export const WithSelection: Story = {
  render: function Render() {
    const [selectedRows, setSelectedRows] = useState(new Set<string>());

    return (
      <div>
        <FilteredDataGrid
          data={mockContacts}
          columns={columns}
          filters={filters}
          enableSelection
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          getRowId={(row) => row.id}
          gridId="selection-filtered-grid"
        />
        <div style={{ marginTop: '16px', padding: '12px', background: 'var(--theme-input-background)', borderRadius: '4px' }}>
          <strong>Selected: {selectedRows.size} rows</strong>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'FilteredDataGrid with row selection enabled.',
      },
    },
  },
};

export const WithExpansion: Story = {
  render: function Render() {
    const [expandedRows, setExpandedRows] = useState(new Set<string>());

    const handleToggle = (rowId: string) => {
      const newExpanded = new Set(expandedRows);
      if (newExpanded.has(rowId)) {
        newExpanded.delete(rowId);
      } else {
        newExpanded.add(rowId);
      }
      setExpandedRows(newExpanded);
    };

    return (
      <FilteredDataGrid
        data={mockContacts}
        columns={columns}
        filters={filters}
        expandedRows={expandedRows}
        onRowToggle={handleToggle}
        renderExpandedContent={(row) => (
          <div style={{ padding: '16px' }}>
            <h4>Contact Details</h4>
            <p><strong>ID:</strong> {row.id}</p>
            <p><strong>Name:</strong> {row.name}</p>
            <p><strong>Email:</strong> {row.email}</p>
            <p><strong>Phone:</strong> {row.phone}</p>
            <p><strong>Status:</strong> {row.status}</p>
            <p><strong>Priority:</strong> {row.priority}</p>
            <p><strong>Created:</strong> {new Date(row.createdAt).toLocaleDateString()}</p>
          </div>
        )}
        getRowId={(row) => row.id}
        gridId="expansion-filtered-grid"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'FilteredDataGrid with expandable rows showing additional details.',
      },
    },
  },
};

export const WithInactiveToggle: Story = {
  args: {
    data: mockContacts,
    columns,
    filters,
    inactiveField: 'isActive',
    showInactiveLabel: 'Show Inactive',
    getRowId: (row) => row.id,
    gridId: 'inactive-toggle-grid',
  },
  parameters: {
    docs: {
      description: {
        story: 'FilteredDataGrid with "Show Inactive" checkbox to toggle inactive items.',
      },
    },
  },
};

export const WithNewItemButton: Story = {
  args: {
    data: mockContacts,
    columns,
    filters,
    onNewItem: () => alert('Create new contact'),
    newItemText: '+ New Contact',
    getRowId: (row) => row.id,
    gridId: 'new-item-grid',
  },
  parameters: {
    docs: {
      description: {
        story: 'FilteredDataGrid with "New Item" button in FilterPanel.',
      },
    },
  },
};

export const WithCustomSearch: Story = {
  args: {
    data: mockContacts,
    columns,
    filters,
    searchPlaceholder: 'Search contacts by name or email...',
    searchFn: (item: Contact, query: string) => {
      const searchLower = query.toLowerCase();
      return item.name.toLowerCase().includes(searchLower) || item.email.toLowerCase().includes(searchLower);
    },
    getRowId: (row) => row.id,
    gridId: 'custom-search-grid',
  },
  parameters: {
    docs: {
      description: {
        story: 'FilteredDataGrid with custom search function (name and email only).',
      },
    },
  },
};

export const WithQuickFilters: Story = {
  args: {
    data: mockContacts,
    columns,
    filters,
    quickFilters: [
      {
        id: 'high-priority',
        label: 'High Priority',
        filterFn: (row: Contact) => row.priority === 'high',
      },
      {
        id: 'active-only',
        label: 'Active Only',
        filterFn: (row: Contact) => row.status === 'active',
      },
    ],
    getRowId: (row) => row.id,
    gridId: 'quick-filters-grid',
  },
  parameters: {
    docs: {
      description: {
        story: 'FilteredDataGrid with quick filter buttons for common filters.',
      },
    },
  },
};

export const LoadingState: Story = {
  args: {
    data: [],
    columns,
    filters,
    loading: true,
    loadingMessage: 'Loading contacts...',
    getRowId: (row) => row.id,
    gridId: 'loading-filtered-grid',
  },
  parameters: {
    docs: {
      description: {
        story: 'FilteredDataGrid showing loading state.',
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    data: [],
    columns,
    filters,
    error: 'Failed to load contacts. Service unavailable.',
    onRetry: () => alert('Retrying...'),
    getRowId: (row) => row.id,
    gridId: 'error-filtered-grid',
  },
  parameters: {
    docs: {
      description: {
        story: 'FilteredDataGrid showing error state with retry button.',
      },
    },
  },
};

export const EmptyState: Story = {
  args: {
    data: [],
    columns,
    filters,
    getRowId: (row) => row.id,
    gridId: 'empty-filtered-grid',
  },
  parameters: {
    docs: {
      description: {
        story: 'FilteredDataGrid with no data.',
      },
    },
  },
};

export const CompactMode: Story = {
  args: {
    data: mockContacts,
    columns,
    filters,
    compact: true,
    getRowId: (row) => row.id,
    gridId: 'compact-filtered-grid',
  },
  parameters: {
    docs: {
      description: {
        story: 'FilteredDataGrid in compact mode with reduced padding.',
      },
    },
  },
};

export const SmallPageSize: Story = {
  args: {
    data: mockContacts,
    columns,
    filters,
    itemsPerPage: 5,
    getRowId: (row) => row.id,
    gridId: 'small-page-grid',
  },
  parameters: {
    docs: {
      description: {
        story: 'FilteredDataGrid with 5 items per page.',
      },
    },
  },
};

export const LargePageSize: Story = {
  args: {
    data: mockContacts,
    columns,
    filters,
    itemsPerPage: 50,
    getRowId: (row) => row.id,
    gridId: 'large-page-grid',
  },
  parameters: {
    docs: {
      description: {
        story: 'FilteredDataGrid with 50 items per page (all data on one page).',
      },
    },
  },
};

// ============================================================
// Complex Combinations
// ============================================================

export const FullFeatured: Story = {
  render: function Render() {
    const [selectedRows, setSelectedRows] = useState(new Set<string>());
    const [expandedRows, setExpandedRows] = useState(new Set<string>());

    const handleToggle = (rowId: string) => {
      const newExpanded = new Set(expandedRows);
      if (newExpanded.has(rowId)) {
        newExpanded.delete(rowId);
      } else {
        newExpanded.add(rowId);
      }
      setExpandedRows(newExpanded);
    };

    return (
      <FilteredDataGrid
        data={mockContacts}
        columns={columns}
        filters={filters}
        quickFilters={[
          {
            id: 'high-priority',
            label: 'High Priority',
            filterFn: (row: Contact) => row.priority === 'high',
          },
          {
            id: 'active-only',
            label: 'Active Only',
            filterFn: (row: Contact) => row.status === 'active',
          },
        ]}
        enableSelection
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        expandedRows={expandedRows}
        onRowToggle={handleToggle}
        renderExpandedContent={(row) => (
          <div style={{ padding: '16px' }}>
            <h4>Contact Details</h4>
            <p><strong>ID:</strong> {row.id}</p>
            <p><strong>Name:</strong> {row.name}</p>
            <p><strong>Email:</strong> {row.email}</p>
            <p><strong>Phone:</strong> {row.phone}</p>
            <p><strong>Status:</strong> {row.status}</p>
            <p><strong>Priority:</strong> {row.priority}</p>
            <p><strong>Created:</strong> {new Date(row.createdAt).toLocaleDateString()}</p>
          </div>
        )}
        getRowId={(row) => row.id}
        getRowStatus={(row) => row.status}
        statusColors={statusColors}
        statusLabels={statusLabels}
        showStatusLegend
        inactiveField="isActive"
        showInactiveLabel="Show Inactive"
        onNewItem={() => alert('Create new contact')}
        newItemText="+ New Contact"
        searchPlaceholder="Search contacts..."
        itemsPerPage={10}
        gridId="full-featured-filtered-grid"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'All features combined: filtering, sorting, pagination, selection, expansion, status colors, and actions.',
      },
    },
  },
};
