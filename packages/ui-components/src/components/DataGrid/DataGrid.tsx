/*
 * ================================================================
 * FILE: DataGrid.tsx
 * PATH: /packages/ui-components/src/components/DataGrid/DataGrid.tsx
 * DESCRIPTION: Production data grid with sorting, selection, expansion, and actions
 * VERSION: v1.0.0
 * UPDATED: 2025-11-06 12:00:00
 *
 * MIGRATED FROM: L-KERN v3 DataGrid v2.0.0
 * CHANGES:
 *   - CSS Module instead of plain CSS
 *   - Design tokens (NO hardcoded values)
 *   - ARIA attributes for accessibility
 *   - Keyboard navigation (Arrow keys, Enter, Space, Ctrl+A, Escape)
 *   - Column width persistence (localStorage)
 *   - Focus management
 * ================================================================
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation, HOVER_EFFECTS } from '@l-kern/config';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import styles from './DataGrid.module.css';

// === TYPES ===

export interface Column {
  title: string;
  field: string;
  sortable?: boolean;
  width?: number;
  flex?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Generic data type for flexible grid usage
  render?: (value: any, row: any) => React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Generic data type for flexible grid usage
export interface DataGridAction<T = any> {
  label: string;
  onClick: (row: T, e: React.MouseEvent) => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  disabled?: (row: T) => boolean;
  hidden?: (row: T) => boolean; // Hide action button for specific rows
  title?: string; // Tooltip text on hover
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Generic data type for flexible grid usage
export interface DataGridProps<T = any> {
  data: T[];
  columns: Column[];
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  onRowClick?: (row: T) => void; // Row click handler
  onRowDoubleClick?: (row: T) => void; // Row double-click handler (e.g., open edit modal)
  expandable?: boolean; // Enable row expansion
  expandedRows?: Set<string>;
  onRowToggle?: (rowId: string) => void;
  renderExpandedContent?: (row: T) => React.ReactNode;
  getRowId?: (row: T) => string;
  getRowStatus?: (row: T) => string;
  statusColors?: Record<string, string>;
  statusLabels?: Record<string, string>; // Labels for legend items
  showStatusLegend?: boolean; // Show status color legend
  hasActiveFilters?: boolean;
  selectedRows?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
  enableSelection?: boolean;
  isRowSelectable?: (row: T) => boolean; // Disable selection for specific rows (e.g., pending deletion)
  compact?: boolean; // Alias for compactMode
  compactMode?: boolean;
  actions?: DataGridAction<T>[];
  actionsLabel?: string;
  actionsWidth?: number;
  gridId?: string; // For localStorage persistence and ARIA
  itemsPerPage?: number; // For min-height calculation (prevents page jumping)
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

// === COMPONENT ===

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Generic data type for flexible grid usage
const DataGrid = <T extends Record<string, any>>({
  data,
  columns,
  sortField = '',
  sortDirection = 'asc',
  onSort,
  onRowDoubleClick,
  expandedRows = new Set(),
  onRowToggle,
  renderExpandedContent,
  getRowId = (row) => row.id || String(Math.random()),
  getRowStatus,
  statusColors = {},
  statusLabels = {},
  showStatusLegend = false,
  hasActiveFilters = false,
  selectedRows = new Set(),
  onSelectionChange,
  enableSelection = false,
  isRowSelectable,
  compactMode = false,
  actions,
  actionsLabel,
  actionsWidth,
  gridId = 'dataGrid',
  itemsPerPage = 10,
  loading = false,
  loadingMessage,
  loadingSlow = false,
  error = null,
  onRetry,
}: DataGridProps<T>) => {
  const { t } = useTranslation();

  // Detect dark mode from data-theme attribute
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDark(theme === 'dark');
    };

    checkDarkMode();

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  // === AUTO-GENERATE COLUMNS ===
  const finalColumns = React.useMemo(() => {
    let cols = [...columns];

    // Add selection column at the beginning if needed
    const hasSelectionColumn = enableSelection || !!renderExpandedContent;
    if (hasSelectionColumn) {
      const selectionColumn: Column = {
        title: '', // Empty title, checkbox will be rendered instead
        field: '_selection',
        sortable: false,
        width: 80,
      };
      cols = [selectionColumn, ...cols];
    }

    // Add actions column at the end if needed
    if (actions && actions.length > 0) {
      const defaultWidth = actions.length * 40 + (actions.length - 1) * 6 + 20;
      const width = actionsWidth || defaultWidth;

      const actionsColumn: Column = {
        title: actionsLabel || t('common.actions') || 'Actions',
        field: '_actions',
        sortable: false,
        width,
        render: (_, row: T) => (
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
            {actions
              .filter((action) => !action.hidden || !action.hidden(row))
              .map((action, idx) => (
                <Button
                  key={idx}
                  variant={action.variant || 'secondary'}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick(row, e);
                  }}
                  disabled={action.disabled ? action.disabled(row) : false}
                  title={action.title}
                >
                  {action.label}
                </Button>
              ))}
          </div>
        ),
      };

      cols = [...cols, actionsColumn];
    }

    return cols;
  }, [columns, actions, actionsLabel, actionsWidth, t, enableSelection, renderExpandedContent]);

  // === COLUMN WIDTH PERSISTENCE (localStorage) ===
  const [columnWidths, setColumnWidths] = useState<number[]>(() => {
    const saved = localStorage.getItem(`dataGrid-${gridId}-widths`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === finalColumns.length) {
          return parsed;
        }
      } catch {
        // Invalid JSON, use defaults
      }
    }
    return finalColumns.map((col) => col.width || 180);
  });

  // Save widths to localStorage on change
  useEffect(() => {
    if (columnWidths.length > 0 && columnWidths.length === finalColumns.length) {
      localStorage.setItem(`dataGrid-${gridId}-widths`, JSON.stringify(columnWidths));
    }
  }, [columnWidths, gridId, finalColumns.length]);

  // Listen for storage events (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `dataGrid-${gridId}-widths` && e.newValue) {
        try {
          const newWidths = JSON.parse(e.newValue);
          if (Array.isArray(newWidths) && newWidths.length === finalColumns.length) {
            setColumnWidths(newWidths);
          }
        } catch {
          // Invalid JSON, ignore
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [gridId, finalColumns.length]);

  // === CHECKBOX SELECTION HANDLERS ===
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number>(-1);

  // Track mousedown position to distinguish click from drag
  const mouseDownPos = useRef<{ x: number; y: number } | null>(null);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onSelectionChange) return;

    if (e.target.checked) {
      // Only select rows that pass isRowSelectable check
      const selectableRows = isRowSelectable
        ? data.filter((row) => isRowSelectable(row))
        : data;
      const allIds = new Set(selectableRows.map((row) => getRowId(row)));
      onSelectionChange(allIds);
    } else {
      onSelectionChange(new Set());
    }
  };

  const handleRowSelect = (rowId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onSelectionChange) return;

    const newSelection = new Set(selectedRows);
    if (e.target.checked) {
      newSelection.add(rowId);
    } else {
      newSelection.delete(rowId);
    }
    onSelectionChange(newSelection);
  };

  // Handle row click with Ctrl/Shift modifiers
  const handleRowClickWithModifiers = (rowId: string, index: number, e: React.MouseEvent) => {
    // Check if this was a drag (text selection) instead of a click
    const DRAG_THRESHOLD = 5; // pixels
    if (mouseDownPos.current) {
      const deltaX = Math.abs(e.clientX - mouseDownPos.current.x);
      const deltaY = Math.abs(e.clientY - mouseDownPos.current.y);

      // If mouse moved more than threshold, it's a drag - don't expand
      if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
        mouseDownPos.current = null;
        return;
      }
    }

    mouseDownPos.current = null;

    if (!enableSelection || !onSelectionChange) {
      toggleExpand(rowId);
      return;
    }

    // Ctrl+Click: Toggle single selection
    if (e.ctrlKey || e.metaKey) {
      e.stopPropagation();
      const newSelection = new Set(selectedRows);
      if (newSelection.has(rowId)) {
        newSelection.delete(rowId);
      } else {
        newSelection.add(rowId);
      }
      onSelectionChange(newSelection);
      setLastSelectedIndex(index);
      return;
    }

    // Shift+Click: Range selection
    if (e.shiftKey && lastSelectedIndex !== -1) {
      e.stopPropagation();
      const newSelection = new Set(selectedRows);
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);

      for (let i = start; i <= end; i++) {
        newSelection.add(getRowId(data[i]));
      }
      onSelectionChange(newSelection);
      return;
    }

    // Regular click - toggle expand
    toggleExpand(rowId);
    setLastSelectedIndex(index);
  };

  // Capture mousedown position
  const handleRowMouseDown = (e: React.MouseEvent) => {
    mouseDownPos.current = { x: e.clientX, y: e.clientY };
  };

  // Calculate "Select All" checkbox state (only considering selectable rows)
  const selectableData = isRowSelectable ? data.filter((row) => isRowSelectable(row)) : data;
  const allSelected = enableSelection && selectableData.length > 0 && selectableData.every((row) => selectedRows.has(getRowId(row)));
  const someSelected = enableSelection && selectableData.some((row) => selectedRows.has(getRowId(row)));

  // === COLUMN RESIZING ===
  const [isResizing, setIsResizing] = useState(false);
  const [resizingColumn, setResizingColumn] = useState(-1);
  const resizeStartX = useRef<number>(0);
  const resizeStartWidth = useRef<number>(0);

  const handleMouseDown = (e: React.MouseEvent, columnIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizingColumn(columnIndex);
    resizeStartX.current = e.clientX;
    resizeStartWidth.current = columnWidths[columnIndex];
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || resizingColumn === -1) return;

      const deltaX = e.clientX - resizeStartX.current;
      const newWidth = Math.max(50, resizeStartWidth.current + deltaX);

      setColumnWidths((prev) => {
        const newWidths = [...prev];
        newWidths[resizingColumn] = newWidth;
        return newWidths;
      });
    },
    [isResizing, resizingColumn]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    setResizingColumn(-1);
  }, []);

  // Auto-fit column width on double-click
  const handleDoubleClick = (columnIndex: number) => {
    const column = finalColumns[columnIndex];
    if (!column) return;

    // Create canvas for text measurement
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    // Get computed font from header cell
    const headerCell = document.querySelector(`.${styles.headerCell}`) as HTMLElement;
    const computedStyle = headerCell ? window.getComputedStyle(headerCell) : null;
    const font = computedStyle
      ? `${computedStyle.fontWeight} ${computedStyle.fontSize} ${computedStyle.fontFamily}`
      : '16px sans-serif';
    context.font = font;

    let maxWidth = context.measureText(column.title).width; // Start with header width

    // Measure all cell contents in this column
    data.forEach((row) => {
      const value = column.render ? column.render(row[column.field], row) : row[column.field];
      const text = typeof value === 'string' || typeof value === 'number' ? String(value) : '';
      const width = context.measureText(text).width;
      if (width > maxWidth) {
        maxWidth = width;
      }
    });

    // Add padding (2 * 16px = 32px) + buffer for sort icon/arrows (30px)
    const newWidth = Math.max(100, Math.ceil(maxWidth + 62));

    setColumnWidths((prev) => {
      const newWidths = [...prev];
      newWidths[columnIndex] = newWidth;
      return newWidths;
    });
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // === KEYBOARD NAVIGATION ===
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const focusRow = (index: number) => {
    if (index < 0 || index >= data.length) return;
    const rowId = getRowId(data[index]);
    const rowElement = rowRefs.current.get(rowId);
    if (rowElement) {
      rowElement.focus();
    }
  };

  const handleRowKeyDown = (e: React.KeyboardEvent, row: T, index: number) => {
    const rowId = getRowId(row);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        focusRow(index + 1);
        break;

      case 'ArrowUp':
        e.preventDefault();
        focusRow(index - 1);
        break;

      case 'Enter':
        e.preventDefault();
        toggleExpand(rowId);
        break;

      case ' ':
        e.preventDefault();
        if (enableSelection && onSelectionChange) {
          const newSelection = new Set(selectedRows);
          if (newSelection.has(rowId)) {
            newSelection.delete(rowId);
          } else {
            newSelection.add(rowId);
          }
          onSelectionChange(newSelection);
        }
        break;

      case 'a':
      case 'A':
        if ((e.ctrlKey || e.metaKey) && enableSelection && onSelectionChange) {
          e.preventDefault();
          const allIds = new Set(data.map((row) => getRowId(row)));
          onSelectionChange(allIds);
        }
        break;

      case 'Escape':
        if (enableSelection && onSelectionChange) {
          e.preventDefault();
          onSelectionChange(new Set());
        }
        break;
    }
  };

  // === HANDLERS ===
  const handleSort = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

  const toggleExpand = (rowId: string) => {
    if (onRowToggle) {
      onRowToggle(rowId);
    }
  };

  const isEmpty = data.length === 0;

  // === RENDER ===
  // Fixed heights for different items per page values
  // Formula: headerHeight (60px) + ((itemsPerPage + 1) * rowHeight (48px))
  const heightMap: Record<number, string> = {
    5: '300px',
    10: '588px',   // 60 + (11 * 48) = 588
    20: '1068px',  // 60 + (21 * 48) = 1068
    50: '2508px',  // 60 + (51 * 48) = 2508
    100: '4908px', // 60 + (101 * 48) = 4908
  };
  const fixedHeight = heightMap[itemsPerPage] || `${HOVER_EFFECTS.dataGrid.headerHeight + ((itemsPerPage + 1) * HOVER_EFFECTS.dataGrid.rowHeight)}px`;

  return (
    <div
      className={`${styles.dataGrid} ${compactMode ? styles.dataGridCompact : ''}`}
      style={{ height: fixedHeight, overflow: 'auto' }}
      role="grid"
      aria-label={t('common.dataGrid') || 'Data grid'}
      aria-rowcount={data.length + 1}
      aria-colcount={finalColumns.length}
    >
      {/* GRID HEADER */}
      <div className={styles.header} role="row" aria-rowindex={1}>
        {finalColumns.map((column, index) => (
          <div
            key={index}
            className={`${styles.headerCell} ${index === 0 ? styles.headerCellFirst : ''} ${
              column.sortable ? styles.headerCellSortable : ''
            }`}
            style={{
              width: `${columnWidths[index]}px`,
              flex: column.flex ? '1' : '0 0 auto',
              position: 'relative',
            }}
            role="columnheader"
            aria-sort={
              column.sortable
                ? sortField === column.field
                  ? sortDirection === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : 'none'
                : undefined
            }
            aria-colindex={index + 1}
            tabIndex={column.sortable ? 0 : -1}
            onClick={() => {
              if (column.sortable) {
                handleSort(column.field);
              }
            }}
            onKeyDown={(e) => {
              if (column.sortable && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                handleSort(column.field);
              }
            }}
          >
            {/* First column: Select All checkbox OR column title */}
            {index === 0 && enableSelection ? (
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected && !allSelected}
                onChange={handleSelectAll}
                aria-label={t('common.selectAll') || 'Select all rows'}
              />
            ) : index === 0 ? (
              <span>{column.title}</span>
            ) : null}

            {/* Other columns: regular title */}
            {index !== 0 && <span>{column.title}</span>}

            {/* Sort indicator - except first column */}
            {index !== 0 && column.sortable && (
              <span
                className={`${styles.sortIcon} ${sortField === column.field ? styles.sortIconActive : ''}`}
                aria-hidden="true"
              >
                {sortField === column.field ? (sortDirection === 'asc' ? '▲' : '▼') : '▲▼'}
              </span>
            )}

            {/* Resize handle - except last column */}
            {index < finalColumns.length - 1 && (
              <div
                className={styles.resizeHandle}
                onMouseDown={(e) => handleMouseDown(e, index)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  handleDoubleClick(index);
                }}
                onClick={(e) => e.stopPropagation()}
                aria-label={t('common.resizeColumn') || 'Resize column'}
              />
            )}
          </div>
        ))}
      </div>

      {/* LOADING STATE ROW */}
      {loading && !error && (
        <div className={styles.emptyRow} role="row">
          <div className={styles.emptyRowContent} role="gridcell">
            <div className={styles.loadingSpinner} role="img" aria-hidden="true">⏳</div>
            <div className={styles.loadingTitle}>
              {loadingMessage || t('pageTemplate.dataGrid.loading', { defaultValue: 'Načítavam dáta...' })}
            </div>
            {loadingSlow && (
              <div className={styles.loadingHint}>
                {t('pageTemplate.dataGrid.loadingSlow', { defaultValue: 'Trvá to dlhšie ako obvykle...' })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ERROR STATE ROW */}
      {error && !loading && (
        <div className={styles.emptyRow} role="row">
          <div className={styles.emptyRowContent} role="gridcell">
            <div className={styles.errorIcon} role="img" aria-hidden="true">⚠️</div>
            <div className={styles.errorTitle}>{t('pageTemplate.dataGrid.serviceUnavailable', { defaultValue: 'Servis nedostupný' })}</div>
            <div className={styles.errorHint}>{error}</div>
            {onRetry && (
              <button className={styles.retryButton} onClick={onRetry}>
                {t('common.retry', { defaultValue: 'Skúsiť znova' })}
              </button>
            )}
          </div>
        </div>
      )}

      {/* EMPTY STATE ROW */}
      {isEmpty && !error && !loading && (
        <div className={styles.emptyRow} role="row">
          <div className={styles.emptyRowContent} role="gridcell">
            {hasActiveFilters ? (
              <>
                <div className={styles.emptyTitle}>{t('pageTemplate.dataGrid.noFilterResults')}</div>
                <div className={styles.emptyHint}>{t('pageTemplate.dataGrid.noFilterResultsHint')}</div>
              </>
            ) : (
              <div className={styles.emptyTitle}>{t('pageTemplate.dataGrid.emptyState')}</div>
            )}
          </div>
        </div>
      )}

      {/* DATA ROWS */}
      {!isEmpty &&
        data.map((row, rowIndex) => {
          const rowId = getRowId(row);
          const isExpanded = expandedRows.has(rowId);
          const isSelected = selectedRows.has(rowId);

          // Calculate background color from status
          let backgroundColor: string | undefined = undefined;
          let expandedBackgroundColor: string | undefined = undefined;
          let baseColor: string | undefined = undefined;
          if (getRowStatus && statusColors) {
            const status = getRowStatus(row);
            baseColor = statusColors[status];
            if (baseColor) {
              // Dark mode: lower opacity (40% collapsed, 70% expanded) for less vibrant colors like v3
              // Light mode: higher opacity (50% collapsed, 100% expanded) like v3
              const collapsedOpacity = isDark ? '66' : '80'; // 40% vs 50%
              const expandedOpacity = isDark ? 'B3' : 'FF'; // 70% vs 100%
              backgroundColor = isExpanded ? `${baseColor}${expandedOpacity}` : `${baseColor}${collapsedOpacity}`;
              expandedBackgroundColor = `${baseColor}26`;
            }
          }

          return (
            <div key={rowId} style={{ width: 'max-content', minWidth: '100%' }}>
              {/* MAIN ROW */}
              <div
                ref={(el) => {
                  if (el) {
                    rowRefs.current.set(rowId, el);
                  } else {
                    rowRefs.current.delete(rowId);
                  }
                }}
                className={`${styles.row} ${isExpanded ? styles.rowExpanded : ''} ${
                  isSelected ? styles.rowSelected : ''
                }`}
                style={{
                  ...(backgroundColor ? { backgroundColor } : {}),
                  ...(isExpanded && baseColor ? ({ '--status-color': baseColor } as React.CSSProperties) : {}),
                }}
                role="row"
                aria-rowindex={rowIndex + 2}
                aria-selected={isSelected}
                aria-expanded={renderExpandedContent ? isExpanded : undefined}
                tabIndex={0}
                onMouseDown={handleRowMouseDown}
                onClick={(e) => handleRowClickWithModifiers(rowId, rowIndex, e)}
                onDoubleClick={() => onRowDoubleClick?.(row)}
                onKeyDown={(e) => handleRowKeyDown(e, row, rowIndex)}
              >
                {finalColumns.map((column, colIndex) => (
                  <div
                    key={colIndex}
                    className={styles.cell}
                    style={{
                      width: `${columnWidths[colIndex]}px`,
                      flex: column.flex ? '1' : '0 0 auto',
                    }}
                    role="gridcell"
                    aria-colindex={colIndex + 1}
                  >
                    {/* Selection column: ONLY checkbox + expand arrow */}
                    {column.field === '_selection' ? (
                      <>
                        {enableSelection && (
                          <Checkbox
                            checked={isSelected}
                            onChange={(e) => handleRowSelect(rowId, e as unknown as React.ChangeEvent<HTMLInputElement>)}
                            disabled={isRowSelectable ? !isRowSelectable(row) : false}
                            aria-label={t('common.selectRow') || 'Select row'}
                          />
                        )}
                        {renderExpandedContent && (
                          <span
                            className={`${styles.expandArrow} ${isExpanded ? styles.expandArrowExpanded : ''}`}
                            aria-hidden="true"
                          >
                            ▶
                          </span>
                        )}
                      </>
                    ) : (
                      /* Regular column content */
                      column.render ? column.render(row[column.field], row) : row[column.field]
                    )}
                  </div>
                ))}
              </div>

              {/* EXPANDED CONTENT */}
              {isExpanded && renderExpandedContent && (
                <div
                  className={styles.expanded}
                  style={{
                    ...(expandedBackgroundColor ? { backgroundColor: expandedBackgroundColor } : {}),
                    ...(baseColor ? ({ '--status-color': baseColor } as React.CSSProperties) : {}),
                  }}
                  role="row"
                  aria-rowindex={rowIndex + 2}
                >
                  <div role="gridcell" aria-colindex={1} style={{ gridColumn: `1 / -1` }}>
                    <div className={styles.expandedContent}>
                      {renderExpandedContent(row)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default DataGrid;
