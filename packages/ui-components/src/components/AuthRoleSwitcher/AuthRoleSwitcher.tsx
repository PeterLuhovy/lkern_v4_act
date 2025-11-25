/*
 * ================================================================
 * FILE: AuthRoleSwitcher.tsx
 * PATH: /packages/ui-components/src/components/AuthRoleSwitcher/AuthRoleSwitcher.tsx
 * DESCRIPTION: Authorization permission level switcher with slider (0-100)
 * VERSION: v3.3.0
 * CREATED: 2025-11-22
 * UPDATED: 2025-11-24
 * ================================================================
 */

import React from 'react';
import { useTranslation, useAuthContext, QUICK_PERMISSION_LEVELS, getPermissionColorRange } from '@l-kern/config';
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
 * Shows numeric permission level switcher (0-100):
 * - Horizontal slider with color-coded track
 * - Small numeric indicator to the right of slider
 * - Quick access buttons: 30 (basic), 60 (standard), 100 (advanced)
 * - Active button highlights based on permission range
 *
 * Permission ranges:
 * - 0-29: Basic (safe, minimal permissions)
 * - 30-59: Standard (caution, basic permissions)
 * - 60-100: Advanced (elevated permissions)
 *
 * Color coding (inverted scale):
 * - 🟢 0-29: Green (safe, minimal permissions)
 * - 🟡 30-59: Yellow (caution, basic permissions)
 * - 🟠 60-99: Orange (elevated, standard permissions)
 * - 🔴 100: Red (danger, full access)
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

  // Color mapping for CSS classes
  const colorClass = {
    green: styles['authRoleSwitcher__slider--green'],
    yellow: styles['authRoleSwitcher__slider--yellow'],
    orange: styles['authRoleSwitcher__slider--orange'],
    red: styles['authRoleSwitcher__slider--red'],
  }[colorRange.color] || styles['authRoleSwitcher__slider--green'];

  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPermissionLevel(parseInt(e.target.value, 10));
  };

  // Handle quick permission level buttons
  const handleQuickPermission = (level: number) => {
    setPermissionLevel(level);
  };

  // Check if button should be "pressed" (active) based on permission range
  const isPermissionActive = (level: number) => {
    if (level === QUICK_PERMISSION_LEVELS.BASIC) {
      // Basic: 0-29
      return permissionLevel >= 0 && permissionLevel < 30;
    } else if (level === QUICK_PERMISSION_LEVELS.STANDARD) {
      // Standard: 30-59
      return permissionLevel >= 30 && permissionLevel < 60;
    } else if (level === QUICK_PERMISSION_LEVELS.ADVANCED) {
      // Advanced: 60-100
      return permissionLevel >= 60 && permissionLevel <= 100;
    }
    return false;
  };

  const levels: Array<{ value: number; icon: string; labelKey: string }> = [
    { value: QUICK_PERMISSION_LEVELS.BASIC, icon: '👁️', labelKey: 'auth.roles.basic' },
    { value: QUICK_PERMISSION_LEVELS.STANDARD, icon: '👤', labelKey: 'auth.roles.standard' },
    { value: QUICK_PERMISSION_LEVELS.ADVANCED, icon: '👑', labelKey: 'auth.roles.advanced' },
  ];

  return (
    <div className={styles.authRoleSwitcher}>
      {!isCollapsed && (
        <>
          {/* Horizontal Slider with Indicator */}
          <div className={styles.authRoleSwitcher__sliderRow}>
            <div className={styles.authRoleSwitcher__sliderContainer}>
              <input
                type="range"
                min="0"
                max="100"
                value={permissionLevel}
                onChange={handleSliderChange}
                className={`${styles.authRoleSwitcher__slider} ${colorClass}`}
                title={`Oprávnenie: ${permissionLevel}`}
              />
              {/* Markers for quick levels */}
              <div className={styles.authRoleSwitcher__markers}>
                <div
                  className={styles.authRoleSwitcher__marker}
                  style={{ left: '30%' }}
                  title="Basic (30)"
                />
                <div
                  className={styles.authRoleSwitcher__marker}
                  style={{ left: '60%' }}
                  title="Standard (60)"
                />
                <div
                  className={styles.authRoleSwitcher__marker}
                  style={{ left: '100%' }}
                  title="Advanced (100)"
                />
              </div>
            </div>

            {/* Permission Level Indicator - Small, Right of Slider */}
            <div className={styles.authRoleSwitcher__indicator}>
              <span className={styles.authRoleSwitcher__indicatorValue}>
                {permissionLevel}
              </span>
            </div>
          </div>
        </>
      )}

      {/* Quick Access Buttons - Show role names */}
      <div className={styles.authRoleSwitcher__buttonsContainer}>
        {levels.map((level) => (
          <button
            key={level.value}
            className={`${styles.authRoleSwitcher__button} ${
              isPermissionActive(level.value) ? styles['authRoleSwitcher__button--active'] : ''
            }`}
            onClick={() => handleQuickPermission(level.value)}
            type="button"
            title={`${t(level.labelKey)} (${level.value})`}
          >
            <span className={styles.authRoleSwitcher__icon}>{level.icon}</span>
            {!isCollapsed && (
              <span className={styles.authRoleSwitcher__label}>
                {t(level.labelKey)}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AuthRoleSwitcher;
