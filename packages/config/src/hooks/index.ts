/*
 * ================================================================
 * FILE: index.ts
 * PATH: /packages/config/src/hooks/index.ts
 * DESCRIPTION: Hooks exports
 * VERSION: v2.0.0
 * UPDATED: 2025-10-19 15:00:00
 *
 * CHANGES:
 *   - v2.0.0: Migrated to folder structure (useModal/, useModalWizard/, etc.)
 * ================================================================
 */

// useModal hook
export { useModal } from './useModal';
export type { UseModalReturn } from './useModal';

// useModalWizard hook
export { useModalWizard } from './useModalWizard';
export type {
  UseModalWizardOptions,
  UseModalWizardReturn,
  WizardStep
} from './useModalWizard';

// usePageAnalytics hook
export { usePageAnalytics } from './usePageAnalytics';
export type {
  ClickEvent,
  KeyboardEvent,
  PageAnalyticsSession,
  PageAnalyticsMetrics,
  UsePageAnalyticsReturn
} from './usePageAnalytics';
