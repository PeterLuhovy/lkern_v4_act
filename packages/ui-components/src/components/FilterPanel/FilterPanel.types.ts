/**
 * @file FilterPanel.types.ts
 * @description TypeScript interfaces for FilterPanel component
 * @version 1.0.0
 * @date 2025-11-06
 */

import { BaseComponentProps } from '../../types/common';

/**
 * Quick filter button configuration
 */
export interface QuickFilter {
  /** Unique identifier for the filter */
  id: string;
  /** Display label (translated) */
  label: string;
  /** Whether this filter is currently active */
  active: boolean;
  /** Click handler */
  onClick: () => void;
}

/**
 * Filter group configuration (e.g., STATUS, PRIORITY)
 */
export interface FilterGroup {
  /** Field name being filtered (e.g., 'status', 'priority') */
  field: string;
  /** Group title (translated, uppercase) */
  title: string;
  /** Available filter options */
  options: Array<{
    /** Option value */
    value: string;
    /** Option label (translated) */
    label: string;
  }>;
  /** Currently selected values */
  selectedValues: Set<string>;
  /** Callback when option is toggled */
  onChange: (value: string) => void;
}

/**
 * Role filter configuration (for checkbox mode)
 */
export interface RoleFilter {
  /** Role code */
  code: string;
  /** Role name (translated) */
  name: string;
  /** Whether this role is selected */
  checked: boolean;
}

/**
 * FilterPanel component props
 */
export interface FilterPanelProps extends BaseComponentProps {
  /** Current search query */
  searchQuery: string;
  /** Search query change handler */
  onSearchChange: (query: string) => void;
  /** Search input placeholder (translated) */
  searchPlaceholder?: string;

  /** Quick filter buttons */
  quickFilters?: QuickFilter[];

  /** Filter groups (status, priority, etc.) */
  filterGroups?: FilterGroup[];
  /** Use checkboxes instead of buttons for filter groups */
  useCheckboxes?: boolean;

  /** Number of filtered results (displayed count) */
  resultCount: number;
  /** Total unfiltered count (optional) */
  totalCount?: number;

  /** Current items per page value */
  itemsPerPage?: number;
  /** Items per page change handler */
  onItemsPerPageChange?: (value: number) => void;

  /** New item button click handler */
  onNewItem?: () => void;
  /** New item button text (translated) */
  newItemText?: string;
  /** Whether new item button is disabled */
  newItemDisabled?: boolean;

  /** Custom filter content */
  children?: React.ReactNode;

  /** Show inactive items toggle */
  showInactive?: boolean;
  /** Show inactive change handler */
  onShowInactiveChange?: (show: boolean) => void;
  /** Show inactive label (translated) */
  showInactiveLabel?: string;

  /** Role filters (checkbox group) */
  roleFilters?: RoleFilter[];
  /** Role filter change handler */
  onRoleFilterChange?: (code: string, checked: boolean) => void;

  /** Initial collapsed state (default: false) */
  collapsed?: boolean;
  /** Collapse state change handler */
  onCollapseChange?: (collapsed: boolean) => void;
  /** Panel title when collapsed (translated) */
  panelTitle?: string;

  /** Status color mapping for legend (e.g., {OPEN: '#4CAF50', CLOSED: '#9e9e9e'}) */
  statusColors?: Record<string, string>;
  /** Status labels for legend (e.g., {OPEN: 'Open', CLOSED: 'Closed'}) */
  statusLabels?: Record<string, string>;
  /** Show status color legend */
  showStatusLegend?: boolean;
}
