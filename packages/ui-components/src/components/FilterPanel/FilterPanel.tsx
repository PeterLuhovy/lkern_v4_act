/*
 * ================================================================
 * FILE: FilterPanel.tsx
 * PATH: /packages/ui-components/src/components/FilterPanel/FilterPanel.tsx
 * DESCRIPTION: Filter panel with search, quick filters, and filter groups - 100% DRY
 * VERSION: v1.0.0
 * UPDATED: 2025-11-06
 * ================================================================
 */

import React from 'react';
import { useTranslation } from '@l-kern/config';
import type { FilterPanelProps } from '../../types/FilterPanel';
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
  children,
  showInactive = false,
  onShowInactiveChange,
  showInactiveLabel,
  roleFilters = [],
  onRoleFilterChange,
}) => {
  const { t } = useTranslation();
  const placeholder = searchPlaceholder || t('pageTemplate.filter.searchPlaceholder');
  const buttonText = newItemText || t('pageTemplate.filter.newItem');
  const inactiveLabel = showInactiveLabel || t('pageTemplate.filter.showInactive');

  return (
    <div className={styles.filterPanel}>
      {/* Search Bar - V2 Style with Icon Inside */}
      <div className={styles.searchContainer}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>🔍</span>
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

      {/* V2 Layout: 3 columns - STATUS | PRIORITY | Controls (right-aligned) */}
      <div className={styles.layout}>
        {/* Left: STATUS and PRIORITY filters */}
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

        {/* Right: Controls (Items-per-page + New Item) - without count */}
        <div className={styles.controls}>
          <div className={styles.itemsPerPage}>
            <span className={styles.itemsLabel}>{t('pageTemplate.filter.itemsPerPageLabel')}</span>
            <select
              className={styles.itemsSelect}
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange?.(Number(e.target.value))}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>

          {onNewItem && (
            <button
              className={styles.newItemButton}
              onClick={onNewItem}
              title={buttonText}
              data-click-id="add-new-item-button"
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>

      {/* Custom Filter Content */}
      {children && <div className={styles.custom}>{children}</div>}

      {/* Bottom Row - Two Columns: Filter Count (left) | Show Inactive (right) */}
      <div className={styles.bottomRow}>
        {/* Left Column: Filter Result Count */}
        <div className={styles.bottomLeft}>
          <span className={styles.filterLabel}>{t('pageTemplate.filter.filterLabel')}:</span>
          <span className={styles.filterCount}>
            📊 {resultCount}/{totalCount || resultCount} {t('pageTemplate.filter.itemsCount')}
          </span>
        </div>

        {/* Right Column: Show Inactive Checkbox */}
        {onShowInactiveChange && (
          <div className={styles.bottomRight}>
            <Checkbox
              label={inactiveLabel}
              checked={showInactive}
              onChange={(e) => onShowInactiveChange((e.target as HTMLInputElement).checked)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
