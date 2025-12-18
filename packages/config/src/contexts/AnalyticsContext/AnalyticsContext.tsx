/*
 * ================================================================
 * FILE: AnalyticsContext.tsx
 * PATH: /packages/config/src/contexts/AnalyticsContext/AnalyticsContext.tsx
 * DESCRIPTION: Analytics configuration context with toggle functions
 *              Controls which analytics features are enabled/disabled
 * VERSION: v1.0.1
 * CREATED: 2025-11-30
 * UPDATED: 2025-12-16
 * ================================================================
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// ================================================================
// TYPES
// ================================================================

/**
 * Analytics tracking settings
 */
export interface AnalyticsSettings {
  /** Track mouse clicks and drag operations */
  trackMouse: boolean;
  /** Track keyboard events (keydown/keyup) */
  trackKeyboard: boolean;
  /** Track text drag & drop operations */
  trackDrag: boolean;
  /** Log events to console (debug mode) */
  logToConsole: boolean;
  /** Track timing metrics (session duration, time between events) */
  trackTiming: boolean;
  /** Show debug bar at top of pages */
  showDebugBarPage: boolean;
  /** Show debug bar at top of modals */
  showDebugBarModal: boolean;
  /** Log permission checks to console */
  logPermissions: boolean;
  /** Log modalStack operations to console */
  logModalStack: boolean;
  /** Log IssueWorkflow operations (create, health check, verify) */
  logIssueWorkflow: boolean;
  /** Log toast notifications to console */
  logToasts: boolean;
  /** Log API fetch calls with permission level to console */
  logFetchCalls: boolean;
  /** Log SSE cache invalidation operations to console */
  logSSEInvalidation: boolean;
}

/**
 * Default analytics settings
 */
const DEFAULT_SETTINGS: AnalyticsSettings = {
  trackMouse: true,
  trackKeyboard: true,
  trackDrag: true,
  logToConsole: true,
  trackTiming: true,
  showDebugBarPage: true,
  showDebugBarModal: true,
  logPermissions: true,
  logModalStack: true,
  logIssueWorkflow: true,
  logToasts: true,
  logFetchCalls: true,
  logSSEInvalidation: true,
};

/**
 * LocalStorage key for analytics settings
 */
const STORAGE_KEY = 'analytics-settings';

/**
 * Analytics context interface
 */
interface AnalyticsContextType {
  /** Current analytics settings */
  settings: AnalyticsSettings;
  /** Update a single setting */
  setSetting: <K extends keyof AnalyticsSettings>(key: K, value: AnalyticsSettings[K]) => void;
  /** Update multiple settings at once */
  setSettings: (newSettings: Partial<AnalyticsSettings>) => void;
  /** Reset all settings to defaults */
  resetSettings: () => void;
  /** Toggle a boolean setting */
  toggleSetting: (key: keyof AnalyticsSettings) => void;
  /** Enable all tracking */
  enableAll: () => void;
  /** Disable all tracking */
  disableAll: () => void;
}

// ================================================================
// CONTEXT
// ================================================================

export const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

// ================================================================
// HELPER FUNCTIONS
// ================================================================

/**
 * Load settings from localStorage
 */
function loadSettings(): AnalyticsSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure all keys exist
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (error) {
    console.error('[AnalyticsContext] Failed to load settings from localStorage:', error);
  }
  return DEFAULT_SETTINGS;
}

/**
 * Save settings to localStorage
 */
function saveSettings(settings: AnalyticsSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('[AnalyticsContext] Failed to save settings to localStorage:', error);
  }
}

// ================================================================
// PROVIDER
// ================================================================

/**
 * AnalyticsProvider Component
 *
 * Provides analytics configuration context with toggle functions.
 * Settings are persisted to localStorage.
 *
 * Features:
 * - Toggle individual tracking features (mouse, keyboard, drag, console, timing)
 * - Enable/disable all tracking at once
 * - Reset to default settings
 * - localStorage persistence
 *
 * @example
 * ```tsx
 * // In app root
 * <AnalyticsProvider>
 *   <App />
 * </AnalyticsProvider>
 *
 * // In component
 * const { settings, toggleSetting } = useAnalyticsContext();
 *
 * <Checkbox
 *   checked={settings.trackKeyboard}
 *   onChange={() => toggleSetting('trackKeyboard')}
 * >
 *   Track Keyboard
 * </Checkbox>
 * ```
 */
export const AnalyticsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettingsState] = useState<AnalyticsSettings>(loadSettings);

  // Save to localStorage when settings change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Update a single setting
  const setSetting = useCallback(<K extends keyof AnalyticsSettings>(
    key: K,
    value: AnalyticsSettings[K]
  ) => {
    setSettingsState(prev => ({ ...prev, [key]: value }));
  }, []);

  // Update multiple settings at once
  const setSettings = useCallback((newSettings: Partial<AnalyticsSettings>) => {
    setSettingsState(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Reset all settings to defaults
  const resetSettings = useCallback(() => {
    setSettingsState(DEFAULT_SETTINGS);
  }, []);

  // Toggle a boolean setting
  const toggleSetting = useCallback((key: keyof AnalyticsSettings) => {
    setSettingsState(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Enable all tracking
  const enableAll = useCallback(() => {
    setSettingsState({
      trackMouse: true,
      trackKeyboard: true,
      trackDrag: true,
      logToConsole: true,
      trackTiming: true,
      showDebugBarPage: true,
      showDebugBarModal: true,
      logPermissions: true,
      logModalStack: true,
      logIssueWorkflow: true,
      logToasts: true,
      logFetchCalls: true,
      logSSEInvalidation: true,
    });
  }, []);

  // Disable all tracking
  const disableAll = useCallback(() => {
    setSettingsState({
      trackMouse: false,
      trackKeyboard: false,
      trackDrag: false,
      logToConsole: false,
      trackTiming: false,
      showDebugBarPage: false,
      showDebugBarModal: false,
      logPermissions: false,
      logModalStack: false,
      logIssueWorkflow: false,
      logToasts: false,
      logFetchCalls: false,
      logSSEInvalidation: false,
    });
  }, []);

  const value: AnalyticsContextType = {
    settings,
    setSetting,
    setSettings,
    resetSettings,
    toggleSetting,
    enableAll,
    disableAll,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

// ================================================================
// HOOK
// ================================================================

/**
 * useAnalyticsContext Hook
 *
 * Access the analytics configuration context.
 *
 * @returns AnalyticsContextType with settings and toggle functions
 * @throws Error if used outside AnalyticsProvider
 *
 * @example
 * ```tsx
 * const { settings, toggleSetting, enableAll, disableAll } = useAnalyticsContext();
 *
 * // Check if keyboard tracking is enabled
 * if (settings.trackKeyboard) {
 *   // ... track keyboard events
 * }
 *
 * // Toggle keyboard tracking
 * toggleSetting('trackKeyboard');
 *
 * // Enable all tracking
 * enableAll();
 * ```
 */
export const useAnalyticsContext = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalyticsContext must be used within AnalyticsProvider');
  }
  return context;
};

/**
 * useAnalyticsSettings Hook
 *
 * Shortcut hook that returns only the settings (read-only).
 * Useful when you only need to check settings without modifying them.
 *
 * @returns AnalyticsSettings object
 * @throws Error if used outside AnalyticsProvider
 */
export const useAnalyticsSettings = (): AnalyticsSettings => {
  const { settings } = useAnalyticsContext();
  return settings;
};

export default AnalyticsProvider;