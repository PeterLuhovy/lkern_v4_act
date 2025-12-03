/*
 * ================================================================
 * FILE: AuthRoleSwitcher.tsx
 * PATH: /packages/ui-components/src/components/AuthRoleSwitcher/AuthRoleSwitcher.tsx
 * DESCRIPTION: Authorization permission level switcher with 9 levels + Ctrl+1-9 shortcuts
 * VERSION: v4.0.0
 * CREATED: 2025-11-22
 * UPDATED: 2025-11-30
 *
 * CHANGES v4.0.0:
 *   - Replaced 3 buttons with 9-level grid (3x3)
 *   - Added keyboard shortcuts Ctrl+1 to Ctrl+9
 *   - Removed slider, added compact button grid
 *   - Basic (1-3), Standard (4-6), Admin (7-9)
 * ================================================================
 */

import React, { useEffect, useCallback } from 'react';
import {
  useTranslation,
  useAuthContext,
  QUICK_PERMISSION_LEVELS,
  PERMISSION_SHORTCUTS,
  getPermissionColorRange,
} from '@l-kern/config';
import styles from './AuthRoleSwitcher.module.css';

export interface AuthRoleSwitcherProps {
  /**
   * Whether sidebar is collapsed (affects display)
   */
  isCollapsed?: boolean;
}

/**
 * AuthRoleSwitcher Component
 *
 * 🚨 DEVELOPMENT TOOL - FOR TESTING ONLY
 *
 * Shows 9-level permission switcher in 3x3 grid:
 * - Basic lvl1-3 (green zone, Ctrl+1/2/3)
 * - Standard lvl1-3 (yellow zone, Ctrl+4/5/6)
 * - Admin lvl1-3 (red zone, Ctrl+7/8/9)
 *
 * Keyboard shortcuts: Ctrl+1 through Ctrl+9
 *
 * TODO: Remove when lkms-auth microservice is ready
 */
export const AuthRoleSwitcher: React.FC<AuthRoleSwitcherProps> = ({
  isCollapsed = false,
}) => {
  const { t } = useTranslation();
  const { permissionLevel, setPermissionLevel } = useAuthContext();

  // Get color range for current permission level
  const colorRange = getPermissionColorRange(permissionLevel);

  // Handle keyboard shortcuts (Ctrl+1 to Ctrl+9)
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Check for Ctrl key (or Cmd on Mac)
    if (!event.ctrlKey && !event.metaKey) return;

    // Find matching shortcut
    const shortcut = PERMISSION_SHORTCUTS.find(s => s.key === event.key);
    if (shortcut) {
      event.preventDefault();
      setPermissionLevel(shortcut.level);
    }
  }, [setPermissionLevel]);

  // Register keyboard shortcuts
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Handle quick permission level buttons
  const handleQuickPermission = (level: number) => {
    setPermissionLevel(level);
  };

  // Check if level is active (exact match)
  const isLevelActive = (level: number) => permissionLevel === level;

  // 9-level structure: 3 categories × 3 levels each
  const categories = [
    {
      name: 'basic',
      icon: '👁️',
      labelKey: 'auth.roles.basic',
      color: 'green',
      levels: [
        { value: QUICK_PERMISSION_LEVELS.BASIC_1, shortcut: '1', sublevel: 'lvl1' },
        { value: QUICK_PERMISSION_LEVELS.BASIC_2, shortcut: '2', sublevel: 'lvl2' },
        { value: QUICK_PERMISSION_LEVELS.BASIC_3, shortcut: '3', sublevel: 'lvl3' },
      ],
    },
    {
      name: 'standard',
      icon: '👤',
      labelKey: 'auth.roles.standard',
      color: 'yellow',
      levels: [
        { value: QUICK_PERMISSION_LEVELS.STANDARD_1, shortcut: '4', sublevel: 'lvl1' },
        { value: QUICK_PERMISSION_LEVELS.STANDARD_2, shortcut: '5', sublevel: 'lvl2' },
        { value: QUICK_PERMISSION_LEVELS.STANDARD_3, shortcut: '6', sublevel: 'lvl3' },
      ],
    },
    {
      name: 'admin',
      icon: '👑',
      labelKey: 'auth.roles.advanced',
      color: 'red',
      levels: [
        { value: QUICK_PERMISSION_LEVELS.ADMIN_1, shortcut: '7', sublevel: 'lvl1' },
        { value: QUICK_PERMISSION_LEVELS.ADMIN_2, shortcut: '8', sublevel: 'lvl2' },
        { value: QUICK_PERMISSION_LEVELS.ADMIN_3, shortcut: '9', sublevel: 'lvl3' },
      ],
    },
  ];

  // Color class for indicator
  const colorClass = {
    green: styles['authRoleSwitcher__indicator--green'],
    yellow: styles['authRoleSwitcher__indicator--yellow'],
    orange: styles['authRoleSwitcher__indicator--orange'],
    red: styles['authRoleSwitcher__indicator--red'],
  }[colorRange.color] || styles['authRoleSwitcher__indicator--green'];

  return (
    <div className={styles.authRoleSwitcher}>
      {/* Permission Level Indicator */}
      {!isCollapsed && (
        <div className={`${styles.authRoleSwitcher__indicator} ${colorClass}`}>
          <span className={styles.authRoleSwitcher__indicatorValue}>
            {permissionLevel}
          </span>
          <span className={styles.authRoleSwitcher__indicatorLabel}>
            {colorRange.label}
          </span>
        </div>
      )}

      {/* 9-Level Grid: 3 categories */}
      <div className={styles.authRoleSwitcher__grid}>
        {categories.map((category) => (
          <div key={category.name} className={styles.authRoleSwitcher__category}>
            {/* Category Header (icon + name) */}
            {!isCollapsed && (
              <div className={styles.authRoleSwitcher__categoryHeader}>
                <span className={styles.authRoleSwitcher__categoryIcon}>{category.icon}</span>
                <span className={styles.authRoleSwitcher__categoryName}>
                  {t(category.labelKey)}
                </span>
              </div>
            )}

            {/* 3 Level Buttons per category */}
            <div className={styles.authRoleSwitcher__levels}>
              {category.levels.map((level) => (
                <button
                  key={level.value}
                  className={`${styles.authRoleSwitcher__button} ${
                    styles[`authRoleSwitcher__button--${category.color}`]
                  } ${
                    isLevelActive(level.value) ? styles['authRoleSwitcher__button--active'] : ''
                  }`}
                  onClick={() => handleQuickPermission(level.value)}
                  type="button"
                  title={`${t(category.labelKey)} ${level.sublevel} (${level.value}) - Ctrl+${level.shortcut}`}
                >
                  {isCollapsed ? (
                    <span className={styles.authRoleSwitcher__shortcut}>{level.shortcut}</span>
                  ) : (
                    <>
                      <span className={styles.authRoleSwitcher__sublevel}>{level.sublevel}</span>
                      <span className={styles.authRoleSwitcher__shortcutHint}>Ctrl+{level.shortcut}</span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthRoleSwitcher;
