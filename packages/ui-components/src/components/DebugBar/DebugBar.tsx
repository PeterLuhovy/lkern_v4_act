/*
 * ================================================================
 * FILE: DebugBar.tsx
 * PATH: /packages/ui-components/src/components/DebugBar/DebugBar.tsx
 * DESCRIPTION: Debug analytics bar - displays modal metrics (based on v3 ModalDebugHeader)
 * VERSION: v2.0.0
 * UPDATED: 2025-10-19 00:15:00
 * CHANGES:
 *   - v2.0.0: Migrated to v3 ModalDebugHeader design (theme, language, dual timer, emoji counters)
 *   - v1.0.0: Initial implementation
 * ================================================================
 */

import React from 'react';
import { useTranslation } from '@l-kern/config';
import type { UsePageAnalyticsReturn } from '@l-kern/config';
import styles from './DebugBar.module.css';

// === TYPES ===

export interface DebugBarProps {
  /**
   * Modal name to display
   */
  modalName: string;

  /**
   * Whether dark mode is active
   */
  isDarkMode: boolean;

  /**
   * Analytics instance from usePageAnalytics hook
   */
  analytics: UsePageAnalyticsReturn;

  /**
   * Whether to show debug bar
   * @default true
   */
  show?: boolean;
}

// === COMPONENT ===

/**
 * Debug analytics bar component (based on v3 ModalDebugHeader)
 *
 * Displays real-time modal analytics:
 * - Modal name with copy-to-clipboard
 * - Click count (🖱️) and keyboard count (⌨️)
 * - Theme indicator (🌙 Dark / ☀️ Light)
 * - Language indicator (🌐 SK/EN)
 * - Dual timer box (total time + time since last activity)
 *
 * **Features:**
 * - Orange gradient background
 * - Absolute positioning at top of modal
 * - Real-time metrics (updates every 100ms)
 * - Click tracking on debug header area
 *
 * @example
 * ```tsx
 * const analytics = usePageAnalytics('edit-contact');
 *
 * <DebugBar
 *   modalName="edit-contact"
 *   isDarkMode={theme === 'dark'}
 *   analytics={analytics}
 *   show={true}
 * />
 * ```
 */
export const DebugBar: React.FC<DebugBarProps> = ({
  modalName,
  isDarkMode,
  analytics,
  show = true,
}) => {
  const { language } = useTranslation();
  const currentLanguage = language || 'sk';

  // Don't render if show is false
  if (!show) {
    return null;
  }

  // === COPY MODAL NAME ===
  const handleCopyModalName = async () => {
    try {
      await navigator.clipboard.writeText(modalName);
      console.log('[DebugBar] Copied modal name:', modalName);
    } catch (err) {
      console.error('[DebugBar] Copy failed:', err);
    }
  };

  // === CLICK TRACKING ===
  const handleAnalyticsClick = (id: string, type: string, event: React.MouseEvent) => {
    analytics.trackClick(id, type, event);
  };

  return (
    <div
      className={styles.debugBar}
      onClick={(e) => {
        // Track clicks on debug header (but not button - it has its own handler)
        if (!(e.target as HTMLElement).closest('button')) {
          handleAnalyticsClick('DebugHeader', 'debug-header', e);
        }
      }}
    >
      {/* Left side - Modal name + Copy button */}
      <div className={styles.debugBar__left}>
        <span className={styles.debugBar__modalName}>🐛 {modalName}</span>
        <button
          className={styles.debugBar__copyBtn}
          onClick={(e) => {
            e.stopPropagation(); // Don't trigger debug header click analytics
            handleAnalyticsClick('CopyModalName', 'button', e);
            handleCopyModalName();
          }}
          type="button"
          title="Copy modal name to clipboard"
        >
          📋 copy
        </button>
      </div>

      {/* Center - Event counts (emoji) */}
      <div className={styles.debugBar__center}>
        <span className={styles.debugBar__counter}>
          🖱️ <strong>{analytics.metrics.clickCount}</strong>
        </span>
        <span className={styles.debugBar__counter}>
          ⌨️ <strong>{analytics.metrics.keyboardCount}</strong>
        </span>
      </div>

      {/* Right side - Theme + Language + Dual Timers */}
      <div className={styles.debugBar__right}>
        {/* Theme indicator */}
        <span className={styles.debugBar__indicator}>
          {isDarkMode ? '🌙 Dark' : '☀️ Light'}
        </span>

        {/* Language indicator */}
        <span className={styles.debugBar__indicator}>
          🌐 {currentLanguage.toUpperCase()}
        </span>

        {/* Dual timer box */}
        <div className={styles.debugBar__timerBox}>
          {/* Total time */}
          <span className={styles.debugBar__timerMain}>
            ⏱️ {analytics.metrics.totalTime}
          </span>

          {/* Time since last activity */}
          <span className={styles.debugBar__timerSub}>
            🕐 {analytics.metrics.timeSinceLastActivity}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DebugBar;
