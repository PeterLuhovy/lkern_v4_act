/*
 * ================================================================
 * FILE: FilterPanel.stories.tsx
 * PATH: /packages/ui-components/src/components/FilterPanel/FilterPanel.stories.tsx
 * DESCRIPTION: Storybook stories for FilterPanel component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FilterPanel } from './FilterPanel';
import type { QuickFilter, FilterGroup } from './FilterPanel.types';

const meta: Meta<typeof FilterPanel> = {
  title: 'Components/Data/FilterPanel',
  component: FilterPanel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Filter panel with search, quick filters, and filter groups. Supports collapsible state and status legend.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FilterPanel>;

// ============================================================
// Basic States
// ============================================================

export const Default: Story = {
  render: () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
      <FilterPanel
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultCount={50}
        totalCount={100}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic filter panel with only search bar and result count.',
      },
    },
  },
};

export const WithQuickFilters: Story = {
  render: () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState(new Set<string>());

    const quickFilters: QuickFilter[] = [
      {
        id: 'today',
        label: 'Today',
        active: activeFilters.has('today'),
        onClick: () => {
          const newFilters = new Set(activeFilters);
          activeFilters.has('today') ? newFilters.delete('today') : newFilters.add('today');
          setActiveFilters(newFilters);
        },
      },
      {
        id: 'this-week',
        label: 'This Week',
        active: activeFilters.has('this-week'),
        onClick: () => {
          const newFilters = new Set(activeFilters);
          activeFilters.has('this-week') ? newFilters.delete('this-week') : newFilters.add('this-week');
          setActiveFilters(newFilters);
        },
      },
      {
        id: 'this-month',
        label: 'This Month',
        active: activeFilters.has('this-month'),
        onClick: () => {
          const newFilters = new Set(activeFilters);
          activeFilters.has('this-month') ? newFilters.delete('this-month') : newFilters.add('this-month');
          setActiveFilters(newFilters);
        },
      },
    ];

    return (
      <FilterPanel
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        quickFilters={quickFilters}
        resultCount={42}
        totalCount={100}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter panel with quick filter buttons (Today, This Week, This Month).',
      },
    },
  },
};

export const WithFilterGroups: Story = {
  render: () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState(new Set<string>());
    const [priorityFilter, setPriorityFilter] = useState(new Set<string>());

    const toggleStatus = (value: string) => {
      const newFilter = new Set(statusFilter);
      newFilter.has(value) ? newFilter.delete(value) : newFilter.add(value);
      setStatusFilter(newFilter);
    };

    const togglePriority = (value: string) => {
      const newFilter = new Set(priorityFilter);
      newFilter.has(value) ? newFilter.delete(value) : newFilter.add(value);
      setPriorityFilter(newFilter);
    };

    const filterGroups: FilterGroup[] = [
      {
        field: 'status',
        title: 'STATUS',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'pending', label: 'Pending' },
          { value: 'completed', label: 'Completed' },
        ],
        selectedValues: statusFilter,
        onChange: toggleStatus,
      },
      {
        field: 'priority',
        title: 'PRIORITY',
        options: [
          { value: 'high', label: 'High' },
          { value: 'medium', label: 'Medium' },
          { value: 'low', label: 'Low' },
        ],
        selectedValues: priorityFilter,
        onChange: togglePriority,
      },
    ];

    return (
      <FilterPanel
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterGroups={filterGroups}
        resultCount={35}
        totalCount={100}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter panel with filter groups for Status and Priority.',
      },
    },
  },
};

export const WithCheckboxes: Story = {
  render: () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState(new Set<string>());

    const toggleStatus = (value: string) => {
      const newFilter = new Set(statusFilter);
      newFilter.has(value) ? newFilter.delete(value) : newFilter.add(value);
      setStatusFilter(newFilter);
    };

    const filterGroups: FilterGroup[] = [
      {
        field: 'status',
        title: 'STATUS',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'pending', label: 'Pending' },
          { value: 'completed', label: 'Completed' },
          { value: 'cancelled', label: 'Cancelled' },
        ],
        selectedValues: statusFilter,
        onChange: toggleStatus,
      },
    ];

    return (
      <FilterPanel
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterGroups={filterGroups}
        useCheckboxes
        resultCount={28}
        totalCount={100}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter panel using checkboxes instead of button pills.',
      },
    },
  },
};

export const WithItemsPerPage: Story = {
  render: () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(20);

    return (
      <FilterPanel
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultCount={50}
        totalCount={100}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter panel with items per page selector.',
      },
    },
  },
};

export const WithNewItemButton: Story = {
  render: () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
      <FilterPanel
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultCount={50}
        totalCount={100}
        onNewItem={() => alert('Create new item')}
        newItemText="+ New Contact"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter panel with "New Item" button.',
      },
    },
  },
};

export const WithShowInactive: Story = {
  render: () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showInactive, setShowInactive] = useState(false);

    return (
      <FilterPanel
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultCount={showInactive ? 100 : 75}
        totalCount={100}
        showInactive={showInactive}
        onShowInactiveChange={setShowInactive}
        showInactiveLabel="Show Inactive"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter panel with "Show Inactive" checkbox toggle.',
      },
    },
  },
};

export const WithStatusLegend: Story = {
  render: () => {
    const [searchQuery, setSearchQuery] = useState('');

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

    return (
      <FilterPanel
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultCount={50}
        totalCount={100}
        statusColors={statusColors}
        statusLabels={statusLabels}
        showStatusLegend
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter panel with status color legend below filters.',
      },
    },
  },
};

export const Collapsed: Story = {
  render: () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [collapsed, setCollapsed] = useState(true);

    return (
      <FilterPanel
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultCount={50}
        totalCount={100}
        collapsed={collapsed}
        onCollapseChange={setCollapsed}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter panel in collapsed state - only title and toggle arrow visible.',
      },
    },
  },
};

// ============================================================
// Complex Combinations
// ============================================================

export const FullFeatured: Story = {
  render: () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState(new Set<string>());
    const [priorityFilter, setPriorityFilter] = useState(new Set<string>());
    const [activeQuickFilters, setActiveQuickFilters] = useState(new Set<string>());
    const [showInactive, setShowInactive] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    const toggleStatus = (value: string) => {
      const newFilter = new Set(statusFilter);
      newFilter.has(value) ? newFilter.delete(value) : newFilter.add(value);
      setStatusFilter(newFilter);
    };

    const togglePriority = (value: string) => {
      const newFilter = new Set(priorityFilter);
      newFilter.has(value) ? newFilter.delete(value) : newFilter.add(value);
      setPriorityFilter(newFilter);
    };

    const hasActiveFilters = searchQuery !== '' || statusFilter.size > 0 || priorityFilter.size > 0 || activeQuickFilters.size > 0;

    const quickFilters: QuickFilter[] = [
      {
        id: 'today',
        label: 'Today',
        active: activeQuickFilters.has('today'),
        onClick: () => {
          const newFilters = new Set(activeQuickFilters);
          activeQuickFilters.has('today') ? newFilters.delete('today') : newFilters.add('today');
          setActiveQuickFilters(newFilters);
        },
      },
      {
        id: 'this-week',
        label: 'This Week',
        active: activeQuickFilters.has('this-week'),
        onClick: () => {
          const newFilters = new Set(activeQuickFilters);
          activeQuickFilters.has('this-week') ? newFilters.delete('this-week') : newFilters.add('this-week');
          setActiveQuickFilters(newFilters);
        },
      },
      ...(hasActiveFilters ? [{
        id: 'clear-all',
        label: 'Clear All',
        active: false,
        onClick: () => {
          setSearchQuery('');
          setStatusFilter(new Set());
          setPriorityFilter(new Set());
          setActiveQuickFilters(new Set());
        },
      }] : []),
    ];

    const filterGroups: FilterGroup[] = [
      {
        field: 'status',
        title: 'STATUS',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'pending', label: 'Pending' },
          { value: 'completed', label: 'Completed' },
        ],
        selectedValues: statusFilter,
        onChange: toggleStatus,
      },
      {
        field: 'priority',
        title: 'PRIORITY',
        options: [
          { value: 'high', label: 'High' },
          { value: 'medium', label: 'Medium' },
          { value: 'low', label: 'Low' },
        ],
        selectedValues: priorityFilter,
        onChange: togglePriority,
      },
    ];

    const statusColors = {
      active: '#4CAF50',
      pending: '#FF9800',
      completed: '#2196F3',
    };

    const statusLabels = {
      active: 'Active',
      pending: 'Pending',
      completed: 'Completed',
    };

    return (
      <FilterPanel
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        quickFilters={quickFilters}
        filterGroups={filterGroups}
        resultCount={42}
        totalCount={100}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        onNewItem={() => alert('Create new item')}
        newItemText="+ New Contact"
        showInactive={showInactive}
        onShowInactiveChange={setShowInactive}
        showInactiveLabel="Show Inactive"
        statusColors={statusColors}
        statusLabels={statusLabels}
        showStatusLegend
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'All features combined: search, quick filters, filter groups, status legend, items per page, new item button, and show inactive toggle.',
      },
    },
  },
};
