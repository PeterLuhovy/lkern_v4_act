/*
 * ================================================================
 * FILE: FilteredDataGrid.tsx
 * PATH: /packages/ui-components/src/components/FilteredDataGrid/FilteredDataGrid.tsx
 * DESCRIPTION: Wrapper combining FilterPanel + DataGrid with internal state management
 * VERSION: v1.2.0
 * UPDATED: 2025-11-24
 * CHANGES:
 *   - v1.2.0: Added sorting support (sortField, sortDirection, onSort)
 *   - v1.1.0: Initial version with filtering and pagination
 * ================================================================
 */

import { useState, useMemo, useEffect } from 'react';
import { FilterPanel } from '../FilterPanel';
import { DataGrid } from '../DataGrid';
import { Pagination } from '../Pagination';
import type { FilteredDataGridProps } from './FilteredDataGrid.types';
import type { FilterGroup, QuickFilter } from '../FilterPanel/FilterPanel.types';
import styles from './FilteredDataGrid.module.css';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Generic data type for flexible grid usage
export function FilteredDataGrid<T extends Record<string, any>>({
  data,
  columns,
  getRowId,
  getRowStatus,
  statusColors,
  statusLabels,
  showStatusLegend,
  enableSelection,
  selectedRows,
  onSelectionChange,
  isRowSelectable,
  expandedRows,
  onRowToggle,
  renderExpandedContent,
  actions,
  compact,
  searchPlaceholder,
  searchFn,
  filters = [],
  useFilterCheckboxes = false,
  quickFilters = [],
  itemsPerPage: initialItemsPerPage = 10,
  enablePagination = true,
  onNewItem,
  newItemText,
  newItemDisabled = false,
  inactiveField,
  showInactiveLabel,
  gridId,
  className,
  betweenContent,
  autoRefreshInterval,
  onRefresh,
}: FilteredDataGridProps<T>) {
  // === INTERNAL STATE ===
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStates, setFilterStates] = useState<Map<string, Set<string>>>(new Map());
  const [activeQuickFilters, setActiveQuickFilters] = useState<Set<string>>(new Set());
  const [showInactive, setShowInactive] = useState(false);
  const [itemsPerPageState, setItemsPerPageState] = useState(initialItemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationEnabled, setPaginationEnabled] = useState(enablePagination);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // === DEFAULT SEARCH FUNCTION ===
  const defaultSearchFn = (item: T, query: string): boolean => {
    const searchLower = query.toLowerCase();
    return Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchLower)
    );
  };

  const search = searchFn || defaultSearchFn;

  // === FILTERING LOGIC ===
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // Search filter
      if (searchQuery && !search(row, searchQuery)) {
        return false;
      }

      // Filter groups (status, priority, etc.)
      for (const [field, selectedValues] of filterStates.entries()) {
        if (selectedValues.size > 0 && !selectedValues.has(row[field])) {
          return false;
        }
      }

      // Quick filters
      for (const filterId of activeQuickFilters) {
        const qf = quickFilters.find((f) => f.id === filterId);
        if (qf && !qf.filterFn(row)) {
          return false;
        }
      }

      // Show inactive
      if (!showInactive && inactiveField && !row[inactiveField]) {
        return false;
      }

      return true;
    });
  }, [data, searchQuery, filterStates, activeQuickFilters, showInactive, quickFilters, inactiveField, search]);

  // === TOTAL COUNT IN CURRENT MODE (showInactive only, no other filters) ===
  const totalCountInCurrentMode = useMemo(() => {
    return data.filter((row) => {
      // Only apply showInactive filter, ignore search/status/priority/quick filters
      if (!showInactive && inactiveField && !row[inactiveField]) {
        return false;
      }
      return true;
    }).length;
  }, [data, showInactive, inactiveField]);

  // === CHECK IF ANY FILTERS ACTIVE ===
  // NOTE: showInactive is NOT a filter, it's a display toggle
  const hasActiveFilters = !!(
    searchQuery !== '' ||
    filterStates.size > 0 ||
    activeQuickFilters.size > 0
  );

  // === SORTING LOGIC ===
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      // Handle null/undefined
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      // Compare values
      let comparison = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortField, sortDirection]);

  // === RESET TO PAGE 1 WHEN FILTERS CHANGE ===
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredData.length, itemsPerPageState]);

  // === AUTO-REFRESH ===
  useEffect(() => {
    if (autoRefreshInterval && autoRefreshInterval > 0 && onRefresh) {
      const interval = setInterval(() => {
        onRefresh();
      }, autoRefreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefreshInterval, onRefresh]);

  // === RESET SHOW INACTIVE ON PERMISSION CHANGE ===
  // When user switches to a role without permission, reset showInactive to false
  useEffect(() => {
    if (!showInactiveLabel && showInactive) {
      setShowInactive(false);
    }
  }, [showInactiveLabel, showInactive]);

  // === SORTING HANDLER ===
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // === PAGINATION ===
  const totalPages = Math.ceil(sortedData.length / itemsPerPageState);

  const paginatedData = useMemo(() => {
    // If pagination disabled, show all sorted items
    if (!paginationEnabled) {
      return sortedData;
    }

    // Otherwise, paginate
    const startIndex = (currentPage - 1) * itemsPerPageState;
    const endIndex = startIndex + itemsPerPageState;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, itemsPerPageState, paginationEnabled]);

  // === FILTER GROUP TOGGLE HANDLERS ===
  const toggleFilter = (field: string, value: string) => {
    setFilterStates((prev) => {
      const next = new Map(prev);
      const fieldSet = next.get(field) || new Set<string>();
      const newFieldSet = new Set(fieldSet);

      if (newFieldSet.has(value)) {
        newFieldSet.delete(value);
      } else {
        newFieldSet.add(value);
      }

      if (newFieldSet.size === 0) {
        next.delete(field);
      } else {
        next.set(field, newFieldSet);
      }

      return next;
    });
  };

  // === CONVERT FILTERS TO FILTER GROUPS ===
  const filterGroups: FilterGroup[] = filters.map((filter) => ({
    field: filter.field,
    title: filter.title,
    options: filter.options,
    selectedValues: filterStates.get(filter.field) || new Set(),
    onChange: (value) => toggleFilter(filter.field, value),
  }));

  // === CONVERT QUICK FILTERS TO FILTER PANEL FORMAT ===
  const quickFilterButtons: QuickFilter[] = [
    ...quickFilters.map((qf) => ({
      id: qf.id,
      label: qf.label,
      active: activeQuickFilters.has(qf.id),
      onClick: () => {
        setActiveQuickFilters((prev) => {
          const next = new Set(prev);
          next.has(qf.id) ? next.delete(qf.id) : next.add(qf.id);
          return next;
        });
      },
    })),
    // Clear All button (only if filters active)
    ...(hasActiveFilters
      ? [
          {
            id: 'clear-all',
            label: 'Clear All',
            active: false,
            onClick: () => {
              setSearchQuery('');
              setFilterStates(new Map());
              setActiveQuickFilters(new Set());
              setShowInactive(false);
            },
          },
        ]
      : []),
  ];

  return (
    <div className={`${styles.filteredDataGrid} ${className || ''}`}>
      {/* FilterPanel */}
      <FilterPanel
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={searchPlaceholder}
        quickFilters={quickFilterButtons}
        filterGroups={filterGroups}
        useCheckboxes={useFilterCheckboxes}
        resultCount={filteredData.length}
        totalCount={totalCountInCurrentMode}
        itemsPerPage={itemsPerPageState}
        onItemsPerPageChange={setItemsPerPageState}
        onNewItem={onNewItem}
        newItemText={newItemText}
        newItemDisabled={newItemDisabled}
        showInactive={inactiveField && showInactiveLabel ? showInactive : undefined}
        onShowInactiveChange={inactiveField && showInactiveLabel ? setShowInactive : undefined}
        showInactiveLabel={showInactiveLabel}
        statusColors={statusColors}
        statusLabels={statusLabels}
        showStatusLegend={showStatusLegend}
      />

      {/* Custom content between FilterPanel and DataGrid */}
      {betweenContent}

      {/* DataGrid */}
      <DataGrid
        data={paginatedData}
        columns={columns}
        getRowId={getRowId}
        getRowStatus={getRowStatus}
        statusColors={statusColors}
        enableSelection={enableSelection}
        selectedRows={selectedRows}
        onSelectionChange={onSelectionChange}
        isRowSelectable={isRowSelectable}
        expandedRows={expandedRows}
        onRowToggle={onRowToggle}
        renderExpandedContent={renderExpandedContent}
        actions={actions}
        compactMode={compact}
        hasActiveFilters={hasActiveFilters}
        gridId={gridId}
        itemsPerPage={itemsPerPageState}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={sortedData.length}
        itemsPerPage={itemsPerPageState}
        onPageChange={setCurrentPage}
        enabled={paginationEnabled}
        onEnabledChange={setPaginationEnabled}
      />
    </div>
  );
}
