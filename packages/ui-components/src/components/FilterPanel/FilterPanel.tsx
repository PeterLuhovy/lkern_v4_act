/*
 * ================================================================
 * FILE: FilterPanel.tsx
 * PATH: /packages/ui-components/src/components/FilterPanel/FilterPanel.tsx
 * DESCRIPTION: Filter panel with search, quick filters, and filter groups - 100% DRY
 * VERSION: v1.0.0
 * UPDATED: 2025-11-06
 * ================================================================
 */

import React, { useState } from 'react';
import { useTranslation } from '@l-kern/config';
import type { FilterPanelProps } from './FilterPanel.types';
import { Checkbox } from '../Checkbox';
import styles from './FilterPanel.module.css';

export const FilterPanel: React.FC<FilterPanelProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  quickFilters = [],
  filterGroups = [],
  useCheckboxes = false,
  resultCount,
  totalCount,
  itemsPerPage = 20,
  onItemsPerPageChange,
  onNewItem,
  newItemText,
  newItemDisabled = false,
  children,
  showInactive = false,
  onShowInactiveChange,
  showInactiveLabel,
  collapsed: initialCollapsed = false,
  onCollapseChange,
  panelTitle,
  statusColors,
  statusLabels,
  showStatusLegend = false,
}) => {
  const { t } = useTranslation();
  const placeholder = searchPlaceholder || t('pageTemplate.filter.searchPlaceholder');
  const buttonText = newItemText || t('pageTemplate.filter.newItem');
  const inactiveLabel = showInactiveLabel || t('pageTemplate.filter.showInactive');
  const title = panelTitle || t('pageTemplate.filter.panelTitle');

  // Collapse state
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);

  const handleToggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapseChange?.(newCollapsed);
  };

  return (
    <div className={`${styles.filterPanel} ${isCollapsed ? styles.filterPanelCollapsed : ''}`}>
      {/* Header - Always visible with title and toggle arrow */}
      <div className={styles.panelHeader} onClick={handleToggleCollapse}>
        <span className={styles.panelTitle}>{title}</span>
        <span className={styles.toggleArrow}>{isCollapsed ? '▼' : '▲'}</span>
      </div>

      {/* Expanded Content - All filters visible */}
      {!isCollapsed && (
        <>
      {/* Search Bar - V2 Style with Icon Inside */}
      <div className={styles.searchContainer}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon} role="img" aria-label="search">🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Quick Filters - V2 Rounded Pills */}
      {quickFilters.length > 0 && (
        <div className={styles.quickFilters}>
          {quickFilters.map((filter) => (
            <button
              key={filter.id}
              data-filter-id={filter.id}
              className={`${styles.quickFilter} ${
                filter.active ? styles.quickFilterActive : ''
              } ${
                filter.id === 'clear-all' ? styles.quickFilterClearAll : ''
              }`}
              onClick={filter.onClick}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}

      {/* Filter Groups - STATUS | PRIORITY */}
      {filterGroups.length > 0 && (
        <div className={styles.groups}>
          {filterGroups.map((group, groupIndex) => (
            <div key={groupIndex} className={styles.group}>
              <div className={styles.groupTitle}>{group.title}</div>
              <div
                className={`${styles.groupOptions} ${
                  useCheckboxes ? styles.groupOptionsCheckboxes : ''
                }`}
              >
                {group.options.map((option) => {
                  const isSelected = group.selectedValues.has(option.value);

                  if (useCheckboxes) {
                    return (
                      <Checkbox
                        key={option.value}
                        label={option.label}
                        checked={isSelected}
                        onChange={() => group.onChange(option.value)}
                      />
                    );
                  }

                  return (
                    <button
                      key={option.value}
                      className={`${styles.option} ${
                        isSelected ? styles.optionActive : ''
                      }`}
                      onClick={() => group.onChange(option.value)}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Filter Content */}
      {children && <div className={styles.custom}>{children}</div>}

      {/* Status Legend - Above bottom row */}
      {showStatusLegend && statusColors && Object.keys(statusColors).length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--spacing-md)',
          paddingBottom: 'var(--spacing-xs)',
          marginBottom: '0',
          marginTop: 'var(--spacing-lg)',
        }}>
          <span style={{
            width: '100%',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--theme-text)',
            marginBottom: '0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontSize: 'var(--font-size-sm)'
          }}>
            {t('pageTemplate.filter.statusLegend')}
          </span>
          {Object.entries(statusColors).map(([status, color]) => (
            <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
              <span style={{
                width: 'var(--spacing-md)',
                height: 'var(--spacing-md)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: color,
                flexShrink: 0
              }} />
              <span style={{ color: 'var(--theme-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                {statusLabels?.[status] || status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Row - Two Columns: Filter Count (left) | Controls (right) */}
      <div className={styles.bottomRow}>
        {/* Left Column: Filter Result Count */}
        <div className={styles.bottomLeft}>
          <span className={styles.filterLabel}>{t('pageTemplate.filter.filterLabel')}:</span>
          <span className={styles.filterCount}>
            <span role="img" aria-label="chart">📊</span> {resultCount}/{totalCount || resultCount} {t('pageTemplate.filter.itemsCount')}
          </span>
        </div>

        {/* Right Column: Controls (Items per page + New Item + Show Inactive) */}
        <div className={styles.bottomRight}>
          {/* Items per page selector */}
          {onItemsPerPageChange && (
            <div className={styles.itemsPerPage}>
              <span className={styles.itemsLabel}>{t('pageTemplate.filter.itemsPerPageLabel')}</span>
              <select
                className={styles.itemsSelect}
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          )}

          {/* New Item button */}
          {onNewItem && (
            <button
              className={styles.newItemButton}
              onClick={onNewItem}
              disabled={newItemDisabled}
              title={buttonText}
              data-click-id="add-new-item-button"
            >
              {buttonText}
            </button>
          )}

          {/* Show Inactive Checkbox */}
          {onShowInactiveChange && (
            <Checkbox
              label={inactiveLabel}
              checked={showInactive}
              onChange={(e) => onShowInactiveChange((e.target as HTMLInputElement).checked)}
            />
          )}
        </div>
      </div>
        </>
      )}
    </div>
  );
};
