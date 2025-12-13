/*
 * ================================================================
 * FILE: badge.types.ts
 * PATH: packages/config/src/translations/types/components/badge.types.ts
 * DESCRIPTION: Badge component translation types
 * VERSION: v1.0.0
 * UPDATED: 2025-12-10
 * ================================================================
 */

/**
 * Translation types for Badge component
 *
 * Used in: @l-kern/ui-components/Badge
 * Keys: components.badge.*
 */
export interface BadgeTranslations {
  neutral: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  small: string;
  medium: string;
  large: string;
  withDot: string;
  active: string;
  pending: string;
  failed: string;
  processing: string;
  demo: {
    title: string;
    variants: string;
    sizes: string;
    dotIndicator: string;
    allCombinations: string;
    useCases: string;
    orderStatuses: string;
    userRoles: string;
    stockLevels: string;
    newOrder: string;
    inProgress: string;
    completed: string;
    cancelled: string;
    admin: string;
    manager: string;
    user: string;
    inStock: string;
    lowStock: string;
    outOfStock: string;
  };
}
