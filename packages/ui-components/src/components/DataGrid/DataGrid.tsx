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
import { useTranslation } from '@l-kern/config';
import { Button } from '../Button';
import styles from './DataGrid.module.css';

// === TYPES ===

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
}

export interface DataGridProps<T = any> {
  data: T[];
  columns: Column[];
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  expandedRows?: Set<string>;
  onRowToggle?: (rowId: string) => void;
  renderExpandedContent?: (row: T) => React.ReactNode;
  getRowId?: (row: T) => string;
  getRowStatus?: (row: T) => string;
  statusColors?: Record<string, string>;
  isDarkMode?: boolean;
  hasActiveFilters?: boolean;
  selectedRows?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
  enableSelection?: boolean;
  compactMode?: boolean;
  actions?: DataGridAction<T>[];
  actionsLabel?: string;
  actionsWidth?: number;
  gridId?: string; // For localStorage persistence and ARIA
}

// === COMPONENT ===

const DataGrid = <T extends Record<string, any>>({
  data,
  columns,
  sortField = '',
  sortDirection = 'asc',
  onSort,
  expandedRows = new Set(),
  onRowToggle,
  renderExpandedContent,
  getRowId = (row) => row.id || String(Math.random()),
  getRowStatus,
  statusColors = {},
  isDarkMode = false,
  hasActiveFilters = false,
  selectedRows = new Set(),
  onSelectionChange,
  enableSelection = false,
  compactMode = false,
  actions,
  actionsLabel,
  actionsWidth,
  gridId = 'dataGrid',
}: DataGridProps<T>) => {
  const { t } = useTranslation();

  // === AUTO-GENERATE ACTIONS COLUMN ===
  const finalColumns = React.useMemo(() => {
    if (!actions || actions.length === 0) {
      return columns;
    }

    const defaultWidth = actions.length * 40 + (actions.length - 1) * 6 + 20;
    const width = actionsWidth || defaultWidth;

    const actionsColumn: Column = {
      title: actionsLabel || t('common.actions') || 'Actions',
      field: '_actions',
      sortable: false,
      width,
      render: (_, row: T) => (
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
          {actions.map((action, idx) => (
            <Button
              key={idx}
              variant={action.variant || 'secondary'}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                action.onClick(row, e);
              }}
              disabled={action.disabled ? action.disabled(row) : false}
            >
              {action.label}
            </Button>
          ))}
        </div>
      ),
    };

    return [...columns, actionsColumn];
  }, [columns, actions, actionsLabel, actionsWidth, t]);

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
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onSelectionChange) return;

    if (e.target.checked) {
      const allIds = new Set(data.map((row) => getRowId(row)));
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

  // Calculate "Select All" checkbox state
  const allSelected = enableSelection && data.length > 0 && data.every((row) => selectedRows.has(getRowId(row)));
  const someSelected = enableSelection && data.some((row) => selectedRows.has(getRowId(row)));
  const indeterminate = someSelected && !allSelected;

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

  // Set indeterminate state for "Select All" checkbox
  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

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
  return (
    <div
      className={`${styles.dataGrid} ${compactMode ? styles.dataGridCompact : ''}`}
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
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={allSelected}
                ref={selectAllCheckboxRef}
                onChange={handleSelectAll}
                onClick={(e) => e.stopPropagation()}
                aria-label={t('common.selectAll') || 'Select all rows'}
              />
            ) : index === 0 ? (
              <span>{column.title}</span>
            ) : null}

            {/* Other columns: regular title */}
            {index !== 0 && <span>{column.title}</span>}

            {/* Sort indicator */}
            {column.sortable && (
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
                onClick={(e) => e.stopPropagation()}
                aria-label={t('common.resizeColumn') || 'Resize column'}
              />
            )}
          </div>
        ))}
      </div>

      {/* EMPTY STATE ROW */}
      {isEmpty && (
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
              backgroundColor = isExpanded ? baseColor : `${baseColor}80`;
              expandedBackgroundColor = `${baseColor}26`;
            }
          }

          return (
            <div key={rowId}>
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
                onClick={(e) => handleRowClickWithModifiers(rowId, rowIndex, e)}
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
                    {/* First column: Checkbox + Expand arrow + content */}
                    {colIndex === 0 && (
                      <>
                        {enableSelection && (
                          <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={isSelected}
                            onChange={(e) => handleRowSelect(rowId, e)}
                            onClick={(e) => e.stopPropagation()}
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
                        {/* Show first column content */}
                        {column.render ? column.render(row[column.field], row) : row[column.field]}
                      </>
                    )}

                    {/* Other columns content */}
                    {colIndex !== 0 && (column.render ? column.render(row[column.field], row) : row[column.field])}
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
                    {renderExpandedContent(row)}
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
