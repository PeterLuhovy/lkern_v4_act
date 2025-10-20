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
import { Button } from '../Button/Button';
import styles from './DebugBar.module.css';

// === TYPES ===

export interface DebugBarProps {
  /**
   * Modal/Page name to display (English name)
   * @example 'contactEdit', 'home', 'modalV3Testing'
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

  /**
   * Context type for analytics (page or modal)
   * @default 'modal'
   */
  contextType?: 'page' | 'modal';
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
  contextType = 'modal',
}) => {
  const { t, language } = useTranslation();
  const currentLanguage = language || 'sk';

  // Don't render if show is false
  if (!show) {
    return null;
  }

  // === COPY FORMATTED NAME ===
  const handleCopyModalName = async () => {
    try {
      // Format: [Analytics][Page|Modal][pageName]
      const contextLabel = contextType.charAt(0).toUpperCase() + contextType.slice(1);
      const formattedName = `[Analytics][${contextLabel}][${modalName}]`;

      await navigator.clipboard.writeText(formattedName);
      console.log('[DebugBar] Copied formatted name:', formattedName);
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
        <span className={styles.debugBar__modalName}>
          <span role="img" aria-label="bug">🐛</span> {modalName}
        </span>
        <Button
          variant="secondary"
          size="xs"
          debug
          onClick={(e) => {
            e.stopPropagation(); // Don't trigger debug header click analytics
            handleAnalyticsClick('CopyModalName', 'button', e);
            handleCopyModalName();
          }}
          title={t('debugBar.copyModalName')}
        >
          <span role="img" aria-label="clipboard">📋</span> copy
        </Button>
      </div>

      {/* Center - Event counts (emoji) */}
      <div className={styles.debugBar__center}>
        <span className={styles.debugBar__counter}>
          <span role="img" aria-label="mouse">🖱️</span> <strong>{analytics.metrics.clickCount}</strong>
        </span>
        <span className={styles.debugBar__counter}>
          <span role="img" aria-label="keyboard">⌨️</span> <strong>{analytics.metrics.keyboardCount}</strong>
        </span>
      </div>

      {/* Right side - Theme + Language + Dual Timers */}
      <div className={styles.debugBar__right}>
        {/* Theme indicator */}
        <span className={styles.debugBar__indicator}>
          {isDarkMode ? (
            <><span role="img" aria-label="moon">🌙</span> Dark</>
          ) : (
            <><span role="img" aria-label="sun">☀️</span> Light</>
          )}
        </span>

        {/* Language indicator */}
        <span className={styles.debugBar__indicator}>
          <span role="img" aria-label="globe">🌐</span> {currentLanguage.toUpperCase()}
        </span>

        {/* Dual timer box */}
        <div className={styles.debugBar__timerBox}>
          {/* Total time */}
          <span className={styles.debugBar__timerMain}>
            <span role="img" aria-label="stopwatch">⏱️</span> {analytics.metrics.totalTime}
          </span>

          {/* Time since last activity */}
          <span className={styles.debugBar__timerSub}>
            <span role="img" aria-label="clock">🕐</span> {analytics.metrics.timeSinceLastActivity}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DebugBar;
