import { default as React } from '../../../../../node_modules/react';
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
export declare const Pagination: React.FC<PaginationProps>;
