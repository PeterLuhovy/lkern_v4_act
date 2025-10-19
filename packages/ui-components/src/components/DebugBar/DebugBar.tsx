/*
 * ================================================================
 * FILE: DebugBar.tsx
 * PATH: /packages/ui-components/src/components/DebugBar/DebugBar.tsx
 * DESCRIPTION: Debug analytics bar - displays page metrics (time, clicks, keyboard events)
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 23:30:00
 * ================================================================
 */

import React, { useState } from 'react';
import { useTranslation } from '@l-kern/config';
import type { UsePageAnalyticsReturn } from '@l-kern/config';
import styles from './DebugBar.module.css';

// === TYPES ===

export interface DebugBarProps {
  /**
   * Page or modal name to display
   */
  pageName: string;

  /**
   * File path to display
   */
  pagePath: string;

  /**
   * Analytics instance from usePageAnalytics hook
   */
  analytics: UsePageAnalyticsReturn;
}

// === COMPONENT ===

/**
 * Debug analytics bar component
 *
 * Displays real-time page analytics:
 * - Page name and path (with copy-to-clipboard buttons)
 * - Total time on page
 * - Time since last activity (click or keyboard)
 * - Click count
 * - Keyboard event count
 *
 * **Features:**
 * - Orange gradient background for visibility
 * - Fixed position at top of viewport
 * - Copy-to-clipboard functionality
 * - Real-time metrics (updates every 100ms)
 * - Responsive design (mobile-friendly)
 *
 * @example
 * ```tsx
 * const analytics = usePageAnalytics('ContactsPage');
 *
 * <DebugBar
 *   pageName="Contacts"
 *   pagePath="/apps/web-ui/src/pages/ContactsPage.tsx"
 *   analytics={analytics}
 * />
 * ```
 */
export const DebugBar: React.FC<DebugBarProps> = ({
  pageName,
  pagePath,
  analytics,
}) => {
  const { t } = useTranslation();
  const [copiedItem, setCopiedItem] = useState<'name' | 'path' | null>(null);

  // === COPY TO CLIPBOARD ===
  const copyToClipboard = async (text: string, type: 'name' | 'path') => {
    try {
      // Don't track clicks if a modal is open
      const isModalOpen = document.querySelector('[data-modal-overlay]');
      if (!isModalOpen) {
        analytics.trackClick(`DebugBar-Copy-${type}`, 'button', undefined);
      }

      await navigator.clipboard.writeText(text);
      setCopiedItem(type);

      setTimeout(() => {
        setCopiedItem(null);
      }, 1500);
    } catch (err) {
      console.error('[DebugBar] Copy failed:', err);
    }
  };

  // === TIME FORMATTING ===
  const formatTime = (timeStr: string): string => {
    // timeStr format: "5.3s" (decimal format from hook)
    const seconds = parseFloat(timeStr);

    if (isNaN(seconds)) return '-';

    if (seconds < 60) {
      // Keep decimal format for seconds < 60 (e.g., "5.3s")
      return timeStr;
    }
    // Show minutes and seconds for >= 60 (e.g., "2m 30s")
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10); // Get single decimal digit
    return `${minutes}m ${remainingSeconds}.${ms}s`;
  };

  return (
    <div
      className={styles.debugBar}
      onClick={(e) => {
        // Don't track clicks if a modal is open
        const isModalOpen = document.querySelector('[data-modal-overlay]');
        if (isModalOpen) {
          e.stopPropagation();
          return;
        }

        // Track clicks on debug bar
        const target = e.target as HTMLElement;

        // Don't track if clicking on button (buttons have their own handlers)
        if (target.closest('button')) return;

        let elementId = 'DebugBar';

        // Identify which part of debug bar was clicked
        if (target.closest(`.${styles.debugBar__pageInfo}`)) {
          elementId = 'DebugBar-PageInfo';
        } else if (target.closest(`.${styles.debugBar__timeInfo}`)) {
          elementId = 'DebugBar-TimeInfo';
        }

        analytics.trackClick(elementId, 'debug-bar', undefined);
      }}
    >
      {/* Page info - left side */}
      <div className={styles.debugBar__pageInfo}>
        <span className={styles.debugBar__pageName}>{pageName}</span>
        <button
          className={`${styles.debugBar__copyBtn} ${copiedItem === 'name' ? styles['debugBar__copyBtn--copied'] : ''}`}
          onClick={() => copyToClipboard(pageName, 'name')}
          title="Copy page name"
          type="button"
        >
          {copiedItem === 'name' ? '✓' : '📋'}
        </button>

        <span className={styles.debugBar__separator}>•</span>

        <span className={styles.debugBar__pagePath}>{pagePath}</span>
        <button
          className={`${styles.debugBar__copyBtn} ${copiedItem === 'path' ? styles['debugBar__copyBtn--copied'] : ''}`}
          onClick={() => copyToClipboard(pagePath, 'path')}
          title="Copy page path"
          type="button"
        >
          {copiedItem === 'path' ? '✓' : '📋'}
        </button>
      </div>

      {/* Analytics info - right side */}
      <div className={styles.debugBar__timeInfo}>
        {/* Total time on page */}
        <span className={styles.debugBar__timeLabel}>
          {t('debugBar.totalTimeOnPage')}:
        </span>
        <span className={styles.debugBar__timeValue}>{formatTime(analytics.metrics.totalTime)}</span>

        <span className={styles.debugBar__separator}>•</span>

        {/* Time since last activity (click OR keyboard) */}
        <span className={styles.debugBar__timeLabel}>
          {t('debugBar.timeSinceLastClick')}:
        </span>
        <span className={styles.debugBar__timeValue}>{formatTime(analytics.metrics.timeSinceLastActivity)}</span>

        <span className={styles.debugBar__separator}>•</span>

        {/* Click count */}
        <span className={styles.debugBar__timeLabel}>
          {t('debugBar.clicks')}:
        </span>
        <span className={styles.debugBar__timeValue}>{analytics.metrics.clickCount}</span>

        <span className={styles.debugBar__separator}>•</span>

        {/* Keyboard count */}
        <span className={styles.debugBar__timeLabel}>
          {t('debugBar.keys')}:
        </span>
        <span className={styles.debugBar__timeValue}>{analytics.metrics.keyboardCount}</span>
      </div>
    </div>
  );
};

export default DebugBar;
