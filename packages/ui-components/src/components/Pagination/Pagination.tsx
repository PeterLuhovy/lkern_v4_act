/*
 * ================================================================
 * FILE: Pagination.tsx
 * PATH: /packages/ui-components/src/components/Pagination/Pagination.tsx
 * DESCRIPTION: Pagination component with page numbers and record count - 100% DRY
 * VERSION: v1.0.0
 * CREATED: 2025-11-07
 * MIGRATED FROM: L-KERN v3 Pagination.tsx
 * ================================================================
 */

import React from 'react';
import { useTranslation } from '@l-kern/config';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import styles from './Pagination.module.css';

export interface PaginationProps {
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Total number of items across all pages */
  totalItems: number;
  /** Number of items per page */
  itemsPerPage: number;
  /** Page change handler */
  onPageChange: (page: number) => void;
  /** Enable pagination (default: true) */
  enabled?: boolean;
  /** Enable pagination change handler */
  onEnabledChange?: (enabled: boolean) => void;
}

/**
 * Pagination Component
 *
 * Displays page navigation with page numbers and record count info.
 * Shows up to 5 page numbers at a time with previous/next arrows.
 *
 * @example
 * ```tsx
 * <Pagination
 *   currentPage={2}
 *   totalPages={10}
 *   totalItems={200}
 *   itemsPerPage={20}
 *   onPageChange={(page) => setCurrentPage(page)}
 * />
 * ```
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  enabled = true,
  onEnabledChange,
}) => {
  const { t } = useTranslation();

  // When pagination disabled, show page 1 of 1
  const displayPage = enabled ? currentPage : 1;
  const displayTotalPages = enabled ? totalPages : 1;

  // Calculate displayed items range
  const startItem = enabled ? (currentPage - 1) * itemsPerPage + 1 : 1;
  const endItem = enabled ? Math.min(currentPage * itemsPerPage, totalItems) : totalItems;

  // Generate page numbers to display (max 5 pages)
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxPages = 5;

    if (displayTotalPages <= maxPages) {
      // Show all pages if total is less than max
      for (let i = 1; i <= displayTotalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let start = Math.max(1, displayPage - 2);
      const end = Math.min(displayTotalPages, start + maxPages - 1);

      // Adjust start if we're near the end
      if (end - start < maxPages - 1) {
        start = Math.max(1, end - maxPages + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={styles.pagination}>
      {/* Left: Record count info */}
      <div className={styles.info}>
        <span className={styles.text}>
          <span role="img" aria-label="chart">📊</span> {t('pageTemplate.filter.page')} {displayPage} {t('pageTemplate.filter.of')} {displayTotalPages} | {startItem}-{endItem} {t('pageTemplate.filter.of')} {totalItems} {t('pageTemplate.filter.itemsCount')}
        </span>
      </div>

      {/* Right: Page navigation controls */}
      <div className={styles.controls}>
        {/* Pagination checkbox */}
        {onEnabledChange && (
          <label className={styles.checkboxLabel}>
            <Checkbox
              checked={enabled}
              onChange={(e) => onEnabledChange((e.target as HTMLInputElement).checked)}
            />
            <span className={styles.checkboxText}>{t('pageTemplate.filter.enablePagination')}</span>
          </label>
        )}

        {/* Navigation buttons */}
        <Button
          variant="secondary"
          size="small"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!enabled || currentPage === 1}
          title={t('pageTemplate.filter.previous')}
        >
          ◀
        </Button>

        {enabled ? (
          pageNumbers.map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? 'primary' : 'secondary'}
              size="small"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ))
        ) : (
          <Button
            variant="primary"
            size="small"
            disabled
          >
            1
          </Button>
        )}

        <Button
          variant="secondary"
          size="small"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!enabled || currentPage === totalPages}
          title={t('pageTemplate.filter.next')}
        >
          ▶
        </Button>
      </div>
    </div>
  );
};