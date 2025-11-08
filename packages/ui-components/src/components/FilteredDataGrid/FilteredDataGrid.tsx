/*
 * ================================================================
 * FILE: FilteredDataGrid.tsx
 * PATH: /packages/ui-components/src/components/FilteredDataGrid/FilteredDataGrid.tsx
 * DESCRIPTION: Wrapper combining FilterPanel + DataGrid with internal state management
 * VERSION: v1.0.0
 * UPDATED: 2025-11-06
 * ================================================================
 */

import { useState, useMemo, useEffect } from 'react';
import { FilterPanel } from '../FilterPanel';
import { DataGrid } from '../DataGrid';
import { Pagination } from '../Pagination';
import type { FilteredDataGridProps } from '../../types/FilteredDataGrid';
import type { FilterGroup, QuickFilter } from '../../types/FilterPanel';
import styles from './FilteredDataGrid.module.css';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Generic data type for flexible grid usage
export function FilteredDataGrid<T extends Record<string, any>>({
  data,
  columns,
  getRowId,
  getRowStatus,
  statusColors,
  enableSelection,
  selectedRows,
  onSelectionChange,
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
  inactiveField,
  showInactiveLabel,
  gridId,
  className,
  betweenContent,
}: FilteredDataGridProps<T>) {
  // === INTERNAL STATE ===
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStates, setFilterStates] = useState<Map<string, Set<string>>>(new Map());
  const [activeQuickFilters, setActiveQuickFilters] = useState<Set<string>>(new Set());
  const [showInactive, setShowInactive] = useState(false);
  const [itemsPerPageState, setItemsPerPageState] = useState(initialItemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationEnabled, setPaginationEnabled] = useState(enablePagination);

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

  // === RESET TO PAGE 1 WHEN FILTERS CHANGE ===
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredData.length, itemsPerPageState]);

  // === PAGINATION ===
  const totalPages = Math.ceil(filteredData.length / itemsPerPageState);

  const paginatedData = useMemo(() => {
    // If pagination disabled, show all filtered items
    if (!paginationEnabled) {
      return filteredData;
    }

    // Otherwise, paginate
    const startIndex = (currentPage - 1) * itemsPerPageState;
    const endIndex = startIndex + itemsPerPageState;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPageState, paginationEnabled]);

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
        showInactive={inactiveField ? showInactive : undefined}
        onShowInactiveChange={inactiveField ? setShowInactive : undefined}
        showInactiveLabel={showInactiveLabel}
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
        expandedRows={expandedRows}
        onRowToggle={onRowToggle}
        renderExpandedContent={renderExpandedContent}
        actions={actions}
        compactMode={compact}
        hasActiveFilters={hasActiveFilters}
        gridId={gridId}
        itemsPerPage={itemsPerPageState}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPageState}
        onPageChange={setCurrentPage}
        enabled={paginationEnabled}
        onEnabledChange={setPaginationEnabled}
      />
    </div>
  );
}
