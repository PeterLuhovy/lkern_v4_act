/*
 * ================================================================
 * FILE: index.ts
 * PATH: packages/config/src/translations/types/components/index.ts
 * DESCRIPTION: Components translation types - Barrel export
 * VERSION: v1.0.0
 * UPDATED: 2025-12-10
 * ================================================================
 */

/**
 * COMPONENTS TRANSLATION TYPES
 *
 * This module exports all component translation type interfaces.
 * Structured by component name for easy maintenance and navigation.
 *
 * Usage:
 *   import type { ButtonsTranslations, BadgeTranslations } from './types/components';
 */

// Component-specific types
export * from './buttons.types';
export * from './badge.types';
export * from './modalV3.types';
export * from './sidebar.types';
export * from './reportButton.types';
export * from './pageHeader.types';
// TODO: Add more component types here as they are extracted (testing, dataGrid, etc.)

/**
 * Aggregate interface for all component translations
 *
 * This interface combines all component translation types into a single
 * structure matching the original `components` namespace in TranslationKeys.
 *
 * MIGRATION STATUS:
 * - ✅ buttons (modularized)
 * - ✅ badge (modularized)
 * - ⏸️ testing (TODO: extract to testing.types.ts)
 * - ⏸️ dataGridTest (TODO: extract to dataGridTest.types.ts)
 * - ⏸️ ... (11 more components to extract)
 *
 * Temporary: Uses inline types for non-migrated components to maintain compatibility.
 */
export interface ComponentsTranslations {
  // ✅ Modularized components
  buttons: import('./buttons.types').ButtonsTranslations;
  badge: import('./badge.types').BadgeTranslations;
  modalV3: import('./modalV3.types').ModalV3Translations;
  sidebar: import('./sidebar.types').SidebarTranslations;
  reportButton: import('./reportButton.types').ReportButtonTranslations;
  pageHeader: import('./pageHeader.types').PageHeaderTranslations;

  // ⏸️ TODO: Extract to separate type files
  testing: {
    title: string;
    subtitle: string;
    backToHome: string;
    backToDashboard: string;
    dashboard: string;
    dashboardSubtitle: string;
    dashboardHint: string;
    tabComponents: string;
    tabPages: string;
    categoryComponents: string;
    categoryPages: string;
    formComponents: string;
    formComponentsDescription: string;
    badgeTitle: string;
    badgeDescription: string;
    cardTitle: string;
    cardDescription: string;
    dataGridTitle: string;
    dataGridDescription: string;
    entityEditModalTitle: string;
    entityEditModalDescription: string;
    emptyStateTitle: string;
    emptyStateDescription: string;
    spinnerTitle: string;
    spinnerDescription: string;
    utilityFunctions: string;
    utilityDescription: string;
    wizardTitle: string;
    wizardDescription: string;
    modalV3Title: string;
    modalV3Description: string;
    toastTitle: string;
    toastDescription: string;
    iconsTitle: string;
    iconsDescription: string;
    filteredGridTitle: string;
    filteredGridDescription: string;
    templatePageDatagridTitle: string;
    templatePageDatagridDescription: string;
    templatePageBaseTitle: string;
    templatePageBaseDescription: string;
    nestedContentExamples: string;
    gridLayoutExample: string;
    size: string;
    // ... (skrátené pre úsporu miesta - úplný typ sa skopíruje z types.ts)
    [key: string]: unknown; // Temporary: allow any unmigrated properties
  };

  // Placeholder for remaining components (will be extracted gradually)
  [key: string]: unknown;
}
