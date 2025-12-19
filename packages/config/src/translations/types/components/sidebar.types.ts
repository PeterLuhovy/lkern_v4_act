/*
 * ================================================================
 * FILE: sidebar.types.ts
 * PATH: packages/config/src/translations/types/components/sidebar.types.ts
 * DESCRIPTION: Sidebar navigation component translation types
 * VERSION: v1.0.0
 * UPDATED: 2025-12-10
 * ================================================================
 */

/**
 * Translation types for Sidebar component
 *
 * Used in: @l-kern/ui-components/Sidebar
 * Keys: components.sidebar.*
 *
 * Features:
 * - Navigation menu
 * - Collapsible sidebar
 * - Tab switching (Navigation, User settings, Debug)
 * - Analytics toggles
 * - Debug settings
 */
export interface SidebarTranslations {
  navigation: string;
  expand: string;
  collapse: string;
  expandAll: string;
  collapseAll: string;
  home: string;
  dashboard: string;
  contacts: string;
  orders: string;
  issues: string;
  settings: string;
  uploadNewImage: string;
  dragAndDrop: string;
  lightMode: string;
  darkMode: string;
  switchToLight: string;
  switchToDark: string;
  changeLanguage: string;
  resizeWidth: string;
  newAction: string;

  tabs: {
    navigation: string;
    nav: string;
    settings: string;
    user: string;
    debug: string;
    dbg: string;
  };

  analytics: {
    sectionAnalytics: string;
    sectionDebug: string;
    trackMouse: string;
    trackMouseHint: string;
    trackKeyboard: string;
    trackKeyboardHint: string;
    trackDrag: string;
    trackDragHint: string;
    trackTiming: string;
    trackTimingHint: string;
    logToConsole: string;
    logToConsoleHint: string;
    showDebugBarPage: string;
    showDebugBarPageHint: string;
    showDebugBarModal: string;
    showDebugBarModalHint: string;
    logPermissions: string;
    logPermissionsHint: string;
    logModalStack: string;
    logModalStackHint: string;
    logServiceWorkflow: string;
    logServiceWorkflowHint: string;
    logToasts: string;
    logToastsHint: string;
    logFetchCalls: string;
    logFetchCallsHint: string;
    enableAll: string;
    disableAll: string;
  };
}
