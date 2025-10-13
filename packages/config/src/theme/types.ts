/*
 * ================================================================
 * FILE: types.ts
 * PATH: packages/config/src/theme/types.ts
 * DESCRIPTION: TypeScript types for theme system
 * VERSION: v1.0.0
 * UPDATED: 2025-10-13
 * ================================================================
 */

/**
 * Supported theme modes
 */
export type ThemeMode = 'light' | 'dark';

/**
 * Return type for useTheme hook
 */
export interface UseThemeReturn {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}