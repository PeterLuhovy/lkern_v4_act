/*
 * ================================================================
 * FILE: types.ts
 * PATH: packages/config/src/translations/types.ts
 * DESCRIPTION: TypeScript types for translation system
 * VERSION: v1.0.0
 * UPDATED: 2025-10-13
 * ================================================================
 */

/**
 * Supported languages in L-KERN v4
 */
export type SupportedLanguage = 'sk' | 'en';

/**
 * Translation function type
 */
export type TranslationFunction = (
  key: string,
  params?: Record<string, string | number>
) => string;

/**
 * Return type for useTranslation hook
 */
export interface UseTranslationReturn {
  t: TranslationFunction;
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  availableLanguages: SupportedLanguage[];
}

/**
 * Translation keys structure
 * This defines the shape of translation objects
 */
export interface TranslationKeys {
  common: {
    welcome: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    search: string;
    filter: string;
    export: string;
    import: string;
    refresh: string;
    loading: string;
    error: string;
    success: string;
    confirm: string;
    yes: string;
    no: string;
  };
  dashboard: {
    title: string;
    welcome: string;
  };
  contacts: {
    title: string;
    add: string;
    edit: string;
  };
  orders: {
    title: string;
    add: string;
    edit: string;
  };
}