/*
 * ================================================================
 * FILE: ThemeContext.tsx
 * PATH: packages/config/src/theme/ThemeContext.tsx
 * DESCRIPTION: Theme system with React Context API
 * VERSION: v1.0.0
 * UPDATED: 2025-10-13
 * ================================================================
 */

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { ThemeMode, UseThemeReturn } from './types';

/**
 * DEFAULT SETTINGS
 */
const DEFAULT_THEME: ThemeMode = 'light';
const STORAGE_KEY = 'l-kern-theme';

/**
 * THEME PERSISTENCE
 * Save and load theme preference from localStorage
 */
const saveThemeToStorage = (theme: ThemeMode): void => {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Failed to save theme preference:', error);
  }
};

const loadThemeFromStorage = (): ThemeMode => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode;
    return saved === 'light' || saved === 'dark' ? saved : DEFAULT_THEME;
  } catch (error) {
    console.warn('Failed to load theme preference:', error);
    return DEFAULT_THEME;
  }
};

/**
 * CONTEXT
 */
const ThemeContext = createContext<UseThemeReturn | undefined>(undefined);

/**
 * PROVIDER
 */
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme,
}) => {
  // Initialize theme from props, localStorage, or default
  const [theme, setThemeState] = useState<ThemeMode>(
    () => defaultTheme || loadThemeFromStorage()
  );

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Set theme with persistence
  const setTheme = useCallback((newTheme: ThemeMode) => {
    if (newTheme !== 'light' && newTheme !== 'dark') {
      console.warn(`Unsupported theme: ${newTheme}`);
      return;
    }

    setThemeState(newTheme);
    saveThemeToStorage(newTheme);
  }, []);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  const value: UseThemeReturn = {
    theme,
    setTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * MAIN THEME HOOK
 * React hook for theme management
 */
export const useTheme = (): UseThemeReturn => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
};

/**
 * UTILITY EXPORTS
 */
export { type ThemeMode } from './types';

/**
 * DEFAULT EXPORT
 */
export default {
  useTheme,
  ThemeProvider,
  DEFAULT_THEME,
};