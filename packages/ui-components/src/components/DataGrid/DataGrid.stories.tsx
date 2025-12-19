/*
 * ================================================================
 * FILE: DataGrid.stories.tsx
 * PATH: /packages/ui-components/src/components/DataGrid/DataGrid.stories.tsx
 * DESCRIPTION: Storybook stories for DataGrid component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import DataGrid from './DataGrid';
import type { Column, DataGridAction } from './DataGrid';

// Mock data types
interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  priority: 'high' | 'medium' | 'low';
  isActive: boolean;
}

// Mock data
const mockContacts: Contact[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+421901234567', status: 'active', priority: 'high', isActive: true },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+421902345678', status: 'pending', priority: 'medium', isActive: true },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', phone: '+421903456789', status: 'inactive', priority: 'low', isActive: false },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', phone: '+421904567890', status: 'active', priority: 'medium', isActive: true },
  { id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', phone: '+421905678901', status: 'active', priority: 'high', isActive: true },
  { id: '6', name: 'Diana Prince', email: 'diana@example.com', phone: '+421906789012', status: 'pending', priority: 'low', isActive: true },
  { id: '7', name: 'Eve Adams', email: 'eve@example.com', phone: '+421907890123', status: 'inactive', priority: 'medium', isActive: false },
  { id: '8', name: 'Frank Miller', email: 'frank@example.com', phone: '+421908901234', status: 'active', priority: 'high', isActive: true },
];

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
  inactive: '#9e9e9e',
};

const statusLabels = {
  active: 'Active',
  pending: 'Pending',
  inactive: 'Inactive',
};

const meta: Meta<typeof DataGrid> = {
  title: 'Components/Data/DataGrid',
  component: DataGrid,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Production data grid with sorting, selection, expansion, and actions. Supports column resizing, keyboard navigation, and status color coding.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DataGrid>;

// ============================================================
// Basic States
// ============================================================

export const Default: Story = {
  args: {
    data: mockContacts,
    columns,
    getRowId: (row) => row.id,
    gridId: 'default-grid',
  },
};

export const WithSorting: Story = {
  render: function RenderWithSorting() {
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const handleSort = (field: string) => {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    };

    return (
      <DataGrid
        data={mockContacts}
        columns={columns}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        getRowId={(row) => row.id}
        gridId="sorting-grid"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Click column headers to sort data ascending or descending.',
      },
    },
  },
};

export const WithSelection: Story = {
  render: function RenderWithSelection() {
    const [selectedRows, setSelectedRows] = useState(new Set<string>());

    return (
      <div>
        <DataGrid
          data={mockContacts}
          columns={columns}
          enableSelection
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          getRowId={(row) => row.id}
          gridId="selection-grid"
        />
        <div style={{ marginTop: '16px', padding: '12px', background: 'var(--theme-input-background)', borderRadius: '4px' }}>
          <strong>Selected: {selectedRows.size} rows</strong>
          {selectedRows.size > 0 && (
            <div style={{ marginTop: '8px', fontSize: '14px' }}>
              IDs: {Array.from(selectedRows).join(', ')}
            </div>
          )}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Select rows using checkboxes. Supports Ctrl+Click, Shift+Click, and Ctrl+A for select all.',
      },
    },
  },
};

export const WithExpansion: Story = {
  render: function RenderWithExpansion() {
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
      <DataGrid
        data={mockContacts}
        columns={columns}
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
          </div>
        )}
        getRowId={(row) => row.id}
        gridId="expansion-grid"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Click rows to expand and show additional details.',
      },
    },
  },
};

export const WithStatusColors: Story = {
  args: {
    data: mockContacts,
    columns,
    getRowId: (row) => row.id,
    getRowStatus: (row) => row.status,
    statusColors,
    statusLabels,
    showStatusLegend: true,
    gridId: 'status-grid',
  },
  parameters: {
    docs: {
      description: {
        story: 'Rows are colored based on status. Status legend can be shown for clarity.',
      },
    },
  },
};

export const WithActions: Story = {
  args: {
    data: mockContacts,
    columns,
    actions: [
      {
        label: 'Edit',
        onClick: (row) => alert(`Edit ${row.name}`),
        variant: 'secondary',
      },
      {
        label: 'Delete',
        onClick: (row) => alert(`Delete ${row.name}`),
        variant: 'danger',
        disabled: (row) => row.status === 'pending',
      },
    ] as DataGridAction<Contact>[],
    getRowId: (row) => row.id,
    gridId: 'actions-grid',
  },
  parameters: {
    docs: {
      description: {
        story: 'Action buttons per row. Delete button is disabled for pending contacts.',
      },
    },
  },
};

export const LoadingState: Story = {
  args: {
    data: [],
    columns,
    loading: true,
    loadingMessage: 'Loading contacts...',
    getRowId: (row) => row.id,
    gridId: 'loading-grid',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows loading spinner while data is being fetched.',
      },
    },
  },
};

export const LoadingSlow: Story = {
  args: {
    data: [],
    columns,
    loading: true,
    loadingSlow: true,
    getRowId: (row) => row.id,
    gridId: 'loading-slow-grid',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows loading spinner with "taking longer than usual" message.',
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    data: [],
    columns,
    error: 'Failed to connect to contacts service. Please try again.',
    onRetry: () => alert('Retrying...'),
    getRowId: (row) => row.id,
    gridId: 'error-grid',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows error message with retry button when data fetch fails.',
      },
    },
  },
};

export const EmptyState: Story = {
  args: {
    data: [],
    columns,
    getRowId: (row) => row.id,
    gridId: 'empty-grid',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows empty state message when no data is available.',
      },
    },
  },
};

export const EmptyWithFilters: Story = {
  args: {
    data: [],
    columns,
    hasActiveFilters: true,
    getRowId: (row) => row.id,
    gridId: 'empty-filtered-grid',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows empty state with filter hint when no results match active filters.',
      },
    },
  },
};

export const CompactMode: Story = {
  args: {
    data: mockContacts,
    columns,
    compactMode: true,
    getRowId: (row) => row.id,
    gridId: 'compact-grid',
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact mode with reduced padding and smaller font sizes.',
      },
    },
  },
};

// ============================================================
// Complex Combinations
// ============================================================

export const FullFeatured: Story = {
  render: function RenderFullFeatured() {
    const [selectedRows, setSelectedRows] = useState(new Set<string>());
    const [expandedRows, setExpandedRows] = useState(new Set<string>());
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const handleSort = (field: string) => {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    };

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
      <DataGrid
        data={mockContacts}
        columns={columns}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
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
          </div>
        )}
        getRowId={(row) => row.id}
        getRowStatus={(row) => row.status}
        statusColors={statusColors}
        statusLabels={statusLabels}
        actions={[
          {
            label: 'Edit',
            onClick: (row) => alert(`Edit ${row.name}`),
            variant: 'secondary',
          },
          {
            label: 'Delete',
            onClick: (row) => alert(`Delete ${row.name}`),
            variant: 'danger',
          },
        ] as DataGridAction<Contact>[]}
        gridId="full-featured-grid"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'All features combined: sorting, selection, expansion, status colors, and actions.',
      },
    },
  },
};
