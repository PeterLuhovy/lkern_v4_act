/*
 * ================================================================
 * FILE: reportButton.types.ts
 * PATH: packages/config/src/translations/types/components/reportButton.types.ts
 * DESCRIPTION: Report Button component translation types
 * VERSION: v1.0.0
 * UPDATED: 2025-12-10
 * ================================================================
 */

/**
 * Translation types for Report Button component
 *
 * Used in: @l-kern/ui-components/ReportButton
 * Keys: components.reportButton.*
 *
 * Provides quick access to issue reporting from any page
 */
export interface ReportButtonTranslations {
  title: string;
  buttonLabel: string;

  modal: {
    title: string;
    description: string;
    typeLabel: string;
    descriptionLabel: string;
    placeholder: string;
    close: string;
    cancel: string;
    submit: string;
    submitting: string;
    error: string;
  };

  types: {
    bug: string;
    feature: string;
    improvement: string;
    question: string;
  };
}
