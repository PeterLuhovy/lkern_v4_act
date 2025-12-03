/**
 * @file FilteredDataGrid.types.ts
 * @description TypeScript interfaces for FilteredDataGrid wrapper component
 * @version 1.0.0
 * @date 2025-11-06
 */

import { BaseComponentProps } from '../../types/common';
import { DataGridProps } from '../DataGrid/DataGrid';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Generic data type for flexible filter usage
  filterFn: (item: any) => boolean;
}

/**
 * FilteredDataGrid component props
 * Combines FilterPanel + DataGrid with internal state management
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Generic data type for flexible grid usage
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
  /** Row double-click handler (e.g., open edit modal) */
  onRowDoubleClick?: DataGridProps<T>['onRowDoubleClick'];
  /** Row status getter (for row coloring) */
  getRowStatus?: DataGridProps<T>['getRowStatus'];
  /** Status color mapping (e.g., {active: '#4CAF50', pending: '#FF9800'}) */
  statusColors?: DataGridProps<T>['statusColors'];
  /** Status labels for legend (e.g., {active: 'Active', pending: 'Pending'}) */
  statusLabels?: DataGridProps<T>['statusLabels'];
  /** Show status color legend */
  showStatusLegend?: DataGridProps<T>['showStatusLegend'];
  /** Enable selection */
  enableSelection?: DataGridProps<T>['enableSelection'];
  /** Selected rows */
  selectedRows?: DataGridProps<T>['selectedRows'];
  /** Selection change handler */
  onSelectionChange?: DataGridProps<T>['onSelectionChange'];
  /** Disable selection for specific rows (e.g., pending deletion items) */
  isRowSelectable?: DataGridProps<T>['isRowSelectable'];
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
  /** Enable pagination (default: true). If false, shows all items but DataGrid height based on itemsPerPage */
  enablePagination?: boolean;
  /** New item button click handler */
  onNewItem?: () => void;
  /** New item button text (translated) */
  newItemText?: string;
  /** Whether new item button is disabled */
  newItemDisabled?: boolean;

  // === SHOW INACTIVE ===
  /** Field to check for inactive status (e.g., 'isActive') */
  inactiveField?: string;
  /** Show inactive label (translated) */
  showInactiveLabel?: string;

  // === PERSISTENCE ===
  /** Unique grid ID for localStorage persistence (prevents column width conflicts) */
  gridId?: string;

  // === CUSTOM CONTENT ===
  /** Custom content to render between FilterPanel and DataGrid */
  betweenContent?: React.ReactNode;

  // === AUTO-REFRESH ===
  /** Auto-refresh interval in milliseconds (e.g., 5000 = 5 seconds). Set to 0 or undefined to disable. */
  autoRefreshInterval?: number;
  /** Callback fired when auto-refresh triggers. Use this to refetch data from API. */
  onRefresh?: () => void;

  // === ERROR STATE ===
  /** Error message to show in DataGrid (e.g., "Service unavailable") */
  error?: string | null;
  /** Retry callback for error state */
  onRetry?: () => void;
}
