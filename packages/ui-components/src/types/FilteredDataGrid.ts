/**
 * @file FilteredDataGrid.ts
 * @description TypeScript interfaces for FilteredDataGrid wrapper component
 * @version 1.0.0
 * @date 2025-11-06
 */

import { BaseComponentProps } from './common';
import { DataGridProps } from './DataGrid';

/**
 * Filter configuration for simple filter setup
 */
export interface FilterConfig {
  /** Field name being filtered (e.g., 'status', 'priority') */
  field: string;
  /** Filter group title (translated, will be uppercased) */
  title: string;
  /** Available filter options */
  options: Array<{
    /** Option value */
    value: string;
    /** Option label (translated) */
    label: string;
  }>;
}

/**
 * Quick filter configuration with custom filter function
 */
export interface QuickFilterConfig {
  /** Unique identifier */
  id: string;
  /** Display label (translated) */
  label: string;
  /** Filter function (returns true if item matches) */
  filterFn: (item: any) => boolean;
}

/**
 * FilteredDataGrid component props
 * Combines FilterPanel + DataGrid with internal state management
 */
export interface FilteredDataGridProps<T = any> extends BaseComponentProps {
  // === DATA ===
  /** Original data (unfiltered) */
  data: T[];

  // === DATAGRID PROPS (passthrough) ===
  /** Column definitions */
  columns: DataGridProps<T>['columns'];
  /** Custom row ID getter */
  getRowId?: DataGridProps<T>['getRowId'];
  /** Row click handler */
  onRowClick?: DataGridProps<T>['onRowClick'];
  /** Row status getter (for row coloring) */
  getRowStatus?: DataGridProps<T>['getRowStatus'];
  /** Status color mapping (e.g., {active: '#4CAF50', pending: '#FF9800'}) */
  statusColors?: DataGridProps<T>['statusColors'];
  /** Enable selection */
  enableSelection?: DataGridProps<T>['enableSelection'];
  /** Selected rows */
  selectedRows?: DataGridProps<T>['selectedRows'];
  /** Selection change handler */
  onSelectionChange?: DataGridProps<T>['onSelectionChange'];
  /** Expandable rows */
  expandable?: DataGridProps<T>['expandable'];
  /** Expanded rows */
  expandedRows?: DataGridProps<T>['expandedRows'];
  /** Row toggle handler */
  onRowToggle?: DataGridProps<T>['onRowToggle'];
  /** Render expanded content */
  renderExpandedContent?: DataGridProps<T>['renderExpandedContent'];
  /** Actions column */
  actions?: DataGridProps<T>['actions'];
  /** Compact mode */
  compact?: DataGridProps<T>['compact'];

  // === SEARCH ===
  /** Search input placeholder (translated) */
  searchPlaceholder?: string;
  /** Custom search function (default: searches all string fields) */
  searchFn?: (item: T, query: string) => boolean;

  // === FILTERS ===
  /** Filter configurations (status, priority, etc.) */
  filters?: FilterConfig[];
  /** Use checkboxes instead of buttons for filter groups */
  useFilterCheckboxes?: boolean;

  // === QUICK FILTERS ===
  /** Quick filter configurations with custom filter functions */
  quickFilters?: QuickFilterConfig[];

  // === CONTROLS ===
  /** Items per page (default: 10) */
  itemsPerPage?: number;
  /** New item button click handler */
  onNewItem?: () => void;
  /** New item button text (translated) */
  newItemText?: string;

  // === SHOW INACTIVE ===
  /** Field to check for inactive status (e.g., 'isActive') */
  inactiveField?: string;
  /** Show inactive label (translated) */
  showInactiveLabel?: string;

  // === PERSISTENCE ===
  /** Unique grid ID for localStorage persistence (prevents column width conflicts) */
  gridId?: string;
}
