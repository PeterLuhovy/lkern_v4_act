import { default as React } from '../../../../../node_modules/react';
export interface Column {
    title: string;
    field: string;
    sortable?: boolean;
    width?: number;
    flex?: boolean;
    render?: (value: any, row: any) => React.ReactNode;
}
export interface DataGridAction<T = any> {
    label: string;
    onClick: (row: T, e: React.MouseEvent) => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
    disabled?: (row: T) => boolean;
    hidden?: (row: T) => boolean;
    title?: string;
}
export interface DataGridProps<T = any> {
    data: T[];
    columns: Column[];
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
    onSort?: (field: string) => void;
    onRowClick?: (row: T) => void;
    onRowDoubleClick?: (row: T) => void;
    expandable?: boolean;
    expandedRows?: Set<string>;
    onRowToggle?: (rowId: string) => void;
    renderExpandedContent?: (row: T) => React.ReactNode;
    getRowId?: (row: T) => string;
    getRowStatus?: (row: T) => string;
    statusColors?: Record<string, string>;
    statusLabels?: Record<string, string>;
    showStatusLegend?: boolean;
    hasActiveFilters?: boolean;
    selectedRows?: Set<string>;
    onSelectionChange?: (selectedIds: Set<string>) => void;
    enableSelection?: boolean;
    isRowSelectable?: (row: T) => boolean;
    compact?: boolean;
    compactMode?: boolean;
    actions?: DataGridAction<T>[];
    actionsLabel?: string;
    actionsWidth?: number;
    gridId?: string;
    itemsPerPage?: number;
    /** Loading state - shows spinner instead of empty state */
    loading?: boolean;
    /** Custom loading message (default: "Načítavam dáta...") */
    loadingMessage?: string;
    /** Show "taking longer than usual" hint after delay */
    loadingSlow?: boolean;
    /** Error message to show (e.g., "Service unavailable") - displays instead of empty state */
    error?: string | null;
    /** Retry callback for error state */
    onRetry?: () => void;
}
declare const DataGrid: <T extends Record<string, any>>({ data, columns, sortField, sortDirection, onSort, onRowDoubleClick, expandedRows, onRowToggle, renderExpandedContent, getRowId, getRowStatus, statusColors, statusLabels, showStatusLegend, hasActiveFilters, selectedRows, onSelectionChange, enableSelection, isRowSelectable, compactMode, actions, actionsLabel, actionsWidth, gridId, itemsPerPage, loading, loadingMessage, loadingSlow, error, onRetry, }: DataGridProps<T>) => import("react/jsx-runtime").JSX.Element;
export default DataGrid;
