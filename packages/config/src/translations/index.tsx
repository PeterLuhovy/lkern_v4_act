/*
 * ================================================================
 * FILE: index.tsx
 * PATH: packages/config/src/translations/index.tsx
 * DESCRIPTION: Translation system with React Context API
 * VERSION: v1.0.0
 * UPDATED: 2025-10-13
 * ================================================================
 */

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import type {
  SupportedLanguage,
  UseTranslationReturn,
  TranslationFunction,
} from './types';
import { sk } from './sk';
import { en } from './en';

/**
 * TRANSLATION DATA
 * All language data loaded at startup
 */
const translations = {
  sk,
  en,
} as const;

/**
 * DEFAULT SETTINGS
 */
const DEFAULT_LANGUAGE: SupportedLanguage = 'sk';
const STORAGE_KEY = 'l-kern-language';
const AVAILABLE_LANGUAGES: SupportedLanguage[] = ['sk', 'en'];

/**
 * LANGUAGE PERSISTENCE
 * Save and load language preference from localStorage
 */
const saveLanguageToStorage = (language: SupportedLanguage): void => {
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch (error) {
    console.warn('Failed to save language preference:', error);
  }
};

const loadLanguageFromStorage = (): SupportedLanguage => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage;
    return AVAILABLE_LANGUAGES.includes(saved) ? saved : DEFAULT_LANGUAGE;
  } catch (error) {
    console.warn('Failed to load language preference:', error);
    return DEFAULT_LANGUAGE;
  }
};

/**
 * TRANSLATION FUNCTION
 * Core translation function with parameter replacement and fallback
 */
const createTranslationFunction = (
  language: SupportedLanguage
): TranslationFunction => {
  return (key: string, params?: Record<string, string | number>): string => {
    try {
      // Navigate through nested object using dot notation
      const keys = key.split('.');
      let value: any = translations[language];

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          // Key not found - try fallback to Slovak
          if (language !== 'sk') {
            console.warn(`Translation key '${key}' not found in ${language}, falling back to Slovak`);
            const fallbackValue = createTranslationFunction('sk')(key, params);
            // Mark fallback translations with [SK] prefix to make it obvious
            return `[SK] ${fallbackValue}`;
          } else {
            console.error(`Translation key '${key}' not found in Slovak (fallback language)`);
            return `❌ [Missing: ${key}]`;
          }
        }
      }

      // Ensure we have a string result
      if (typeof value !== 'string') {
        console.error(`Translation key '${key}' does not resolve to a string`);
        return `❌ [Invalid: ${key}]`;
      }

      // Replace parameters if provided
      if (params) {
        return Object.entries(params).reduce(
          (text, [paramKey, paramValue]) =>
            text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue)),
          value
        );
      }

      return value;
    } catch (error) {
      console.error(`Error translating key '${key}':`, error);
      return `❌ [Error: ${key}]`;
    }
  };
};

/**
 * CONTEXT
 */
const TranslationContext = createContext<UseTranslationReturn | undefined>(undefined);

/**
 * PROVIDER
 */
interface TranslationProviderProps {
  children: ReactNode;
  defaultLanguage?: SupportedLanguage;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({
  children,
  defaultLanguage,
}) => {
  // Initialize language from props, localStorage, or default
  const [language, setLanguageState] = useState<SupportedLanguage>(
    () => defaultLanguage || loadLanguageFromStorage()
  );

  // Set language with persistence
  const setLanguage = useCallback((newLanguage: SupportedLanguage) => {
    if (!AVAILABLE_LANGUAGES.includes(newLanguage)) {
      console.warn(`Unsupported language: ${newLanguage}`);
      return;
    }

    setLanguageState(newLanguage);
    saveLanguageToStorage(newLanguage);
  }, []);

  // Create translation function for current language
  const t = useMemo(
    () => createTranslationFunction(language),
    [language]
  );

  const value: UseTranslationReturn = {
    t,
    language,
    setLanguage,
    availableLanguages: AVAILABLE_LANGUAGES,
  };

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
};

/**
 * MAIN TRANSLATION HOOK
 * React hook for translation management
 */
export const useTranslation = (): UseTranslationReturn => {
  const context = useContext(TranslationContext);

  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }

  return context;
};

/**
 * UTILITY EXPORTS
 */
export { type SupportedLanguage, type TranslationKeys } from './types';
export { sk } from './sk';
export { en } from './en';

/**
 * DEFAULT EXPORT
 */
export default {
  useTranslation,
  TranslationProvider,
  translations,
  DEFAULT_LANGUAGE,
  AVAILABLE_LANGUAGES,
};