/*
 * ================================================================
 * FILE: ThemeCustomizer.tsx
 * PATH: packages/ui-components/src/components/ThemeCustomizer/ThemeCustomizer.tsx
 * DESCRIPTION: Theme customization floating button + modal - dark/light mode, settings
 * VERSION: v1.3.0
 * UPDATED: 2025-11-30
 * PORTED FROM: v3 packages/page-templates/src/components/ThemeCustomizer/
 * CHANGES:
 *   - v1.3.0: Added button gradient variables (--button-primary-from/to), modal header gradient
 *   - v1.2.0: Added actual functionality - settings now apply to document via CSS variables
 *             Added Rose/Pink color option
 *   - v1.1.0: Fixed to use local state for customSettings (v4 ThemeContext doesn't have customSettings)
 *   - v1.0.0: Initial port from v3
 * ================================================================
 */

import React, { useState, useEffect } from 'react';
import { useTheme, useTranslation } from '@l-kern/config';
import styles from './ThemeCustomizer.module.css';

export interface ThemeCustomizerProps {
  /**
   * Position of the floating button
   * @default 'bottom-right'
   */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /**
   * Whether StatusBar is expanded
   * Used for dynamic positioning above StatusBar
   */
  statusBarExpanded?: boolean;
  /**
   * StatusBar collapsed height (px)
   * @default 32
   */
  statusBarHeight?: number;
  /**
   * StatusBar expanded height (px)
   * @default 300
   */
  statusBarExpandedHeight?: number;
}

// Custom settings interface (stored in localStorage)
interface CustomSettings {
  compactMode: boolean;
  highContrast: boolean;
  showAnimations: boolean;
  fontSize: 'small' | 'medium' | 'large';
  accentColor: string;
}

const DEFAULT_CUSTOM_SETTINGS: CustomSettings = {
  compactMode: false,
  highContrast: false,
  showAnimations: true,
  fontSize: 'medium',
  accentColor: '#9c27b0', // L-KERN Purple
};

const ACCENT_COLORS = [
  { color: '#9c27b0', name: 'L-KERN Purple' },
  { color: '#3366cc', name: 'Blue' },
  { color: '#4caf50', name: 'Green' },
  { color: '#ff9800', name: 'Orange' },
  { color: '#e91e63', name: 'Rose' },
  { color: '#FF69B4', name: 'Pink' },
  { color: '#607d8b', name: 'Blue Grey' }
];

// Font size mappings (base rem values)
const FONT_SIZE_MAP = {
  small: '14px',
  medium: '16px',
  large: '18px',
};

// Apply custom settings to document
const applySettingsToDocument = (settings: CustomSettings): void => {
  const root = document.documentElement;

  // === COMPACT MODE ===
  // Reduces spacing throughout the app
  if (settings.compactMode) {
    root.setAttribute('data-compact', 'true');
    root.style.setProperty('--spacing-xs', '2px');
    root.style.setProperty('--spacing-sm', '4px');
    root.style.setProperty('--spacing-md', '8px');
    root.style.setProperty('--spacing-lg', '12px');
    root.style.setProperty('--spacing-xl', '16px');
  } else {
    root.removeAttribute('data-compact');
    root.style.setProperty('--spacing-xs', '4px');
    root.style.setProperty('--spacing-sm', '8px');
    root.style.setProperty('--spacing-md', '16px');
    root.style.setProperty('--spacing-lg', '24px');
    root.style.setProperty('--spacing-xl', '32px');
  }

  // === HIGH CONTRAST ===
  // Increases text contrast and border visibility
  if (settings.highContrast) {
    root.setAttribute('data-high-contrast', 'true');
    root.style.setProperty('--high-contrast-text', '#000000');
    root.style.setProperty('--high-contrast-border', '2px');
  } else {
    root.removeAttribute('data-high-contrast');
    root.style.removeProperty('--high-contrast-text');
    root.style.removeProperty('--high-contrast-border');
  }

  // === ANIMATIONS ===
  // Disables or enables all CSS animations and transitions
  if (settings.showAnimations) {
    root.removeAttribute('data-reduce-motion');
    root.style.setProperty('--animation-duration', '0.3s');
    root.style.setProperty('--transition-duration', '0.2s');
  } else {
    root.setAttribute('data-reduce-motion', 'true');
    root.style.setProperty('--animation-duration', '0s');
    root.style.setProperty('--transition-duration', '0s');
  }

  // === FONT SIZE ===
  root.style.setProperty('--font-size-base', FONT_SIZE_MAP[settings.fontSize]);
  root.setAttribute('data-font-size', settings.fontSize);

  // === ACCENT COLOR ===
  // Override the primary brand color and all related variables
  root.style.setProperty('--color-brand-primary', settings.accentColor);
  root.style.setProperty('--color-primary', settings.accentColor);
  root.style.setProperty('--color-accent', settings.accentColor);
  root.style.setProperty('--theme-accent', settings.accentColor);

  // Button gradient colors (used by Button, ExportButton, etc.)
  root.style.setProperty('--button-primary-from', settings.accentColor);
  root.style.setProperty('--button-primary-to', settings.accentColor);

  // Modal header gradient (subtle tint of accent color)
  root.style.setProperty('--modal-header-gradient-start', `color-mix(in srgb, ${settings.accentColor} 8%, transparent)`);
  root.style.setProperty('--modal-header-gradient-end', `color-mix(in srgb, ${settings.accentColor} 3%, transparent)`);
  root.style.setProperty('--modal-header-border', `color-mix(in srgb, ${settings.accentColor} 20%, var(--theme-border, #e0e0e0))`);
};

const THEME_CUSTOMIZER_OFFSET = 16; // px offset above StatusBar
const STORAGE_KEY = 'l-kern-custom-settings';

// Load settings from localStorage
const loadSettings = (): CustomSettings => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_CUSTOM_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Failed to load custom settings:', e);
  }
  return DEFAULT_CUSTOM_SETTINGS;
};

// Save settings to localStorage
const saveSettings = (settings: CustomSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save custom settings:', e);
  }
};

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  position = 'bottom-right',
  statusBarExpanded = false,
  statusBarHeight = 32,
  statusBarExpandedHeight = 300
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customSettings, setCustomSettings] = useState<CustomSettings>(loadSettings);

  // Determine if dark mode based on theme
  const isDarkMode = theme === 'dark';

  // Theme-based colors for modal styling
  const themeColors = {
    cardBackground: isDarkMode ? '#1e1e1e' : '#ffffff',
    text: isDarkMode ? '#e0e0e0' : '#212121',
    border: isDarkMode ? '#424242' : '#e0e0e0',
    inputBackground: isDarkMode ? '#2d2d2d' : '#ffffff',
    inputBorder: isDarkMode ? '#555555' : '#e0e0e0',
    shadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.15)',
  };

  // Apply settings on mount (restore from localStorage)
  useEffect(() => {
    applySettingsToDocument(customSettings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save and apply settings when they change
  useEffect(() => {
    saveSettings(customSettings);
    applySettingsToDocument(customSettings);
  }, [customSettings]);

  // Calculate dynamic bottom position based on StatusBar state
  const calculateBottomPosition = () => {
    const currentStatusBarHeight = statusBarExpanded
      ? (statusBarExpandedHeight + statusBarHeight)  // Expanded content + header
      : statusBarHeight;
    return currentStatusBarHeight + THEME_CUSTOMIZER_OFFSET;
  };

  const handleSettingChange = (key: keyof CustomSettings, value: boolean | string) => {
    setCustomSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setCustomSettings(DEFAULT_CUSTOM_SETTINGS);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        className={`${styles.button} ${styles[`button${position.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')}`]}`}
        onClick={() => setIsModalOpen(true)}
        title={t('themeCustomizer.buttonTitle')}
        style={{
          background: customSettings.accentColor,
          bottom: `${calculateBottomPosition()}px`,
          transition: 'bottom 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease'
        }}
      >
        <span className={styles.buttonIcon} role="img" aria-label="palette">🎨</span>
      </button>

      {/* MODAL */}
      {isModalOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: themeColors.cardBackground,
              border: `1px solid ${themeColors.border}`,
              boxShadow: themeColors.shadow
            }}
          >
            <h3
              className={styles.title}
              style={{ color: themeColors.text }}
            >
              <span role="img" aria-label="palette">🎨</span> {t('themeCustomizer.title')}
            </h3>

            <div className={styles.content}>
              {/* COMPACT MODE */}
              <label
                className={styles.checkboxLabel}
                style={{ color: themeColors.text }}
              >
                <input
                  type="checkbox"
                  checked={customSettings.compactMode}
                  onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
                  style={{ accentColor: customSettings.accentColor }}
                />
                <span><span role="img" aria-label="package">📦</span> {t('themeCustomizer.compactMode')}</span>
              </label>

              {/* HIGH CONTRAST */}
              <label
                className={styles.checkboxLabel}
                style={{ color: themeColors.text }}
              >
                <input
                  type="checkbox"
                  checked={customSettings.highContrast}
                  onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
                  style={{ accentColor: customSettings.accentColor }}
                />
                <span><span role="img" aria-label="brightness">🔆</span> {t('themeCustomizer.highContrast')}</span>
              </label>

              {/* SHOW ANIMATIONS */}
              <label
                className={styles.checkboxLabel}
                style={{ color: themeColors.text }}
              >
                <input
                  type="checkbox"
                  checked={customSettings.showAnimations}
                  onChange={(e) => handleSettingChange('showAnimations', e.target.checked)}
                  style={{ accentColor: customSettings.accentColor }}
                />
                <span><span role="img" aria-label="sparkles">✨</span> {t('themeCustomizer.showAnimations')}</span>
              </label>

              {/* FONT SIZE */}
              <div className={styles.selectGroup}>
                <label
                  className={styles.selectLabel}
                  style={{ color: themeColors.text }}
                >
                  <span role="img" aria-label="ruler">📏</span> {t('themeCustomizer.fontSize')}
                </label>
                <select
                  value={customSettings.fontSize}
                  onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                  className={styles.select}
                  style={{
                    background: themeColors.inputBackground,
                    border: `1px solid ${themeColors.inputBorder}`,
                    color: themeColors.text
                  }}
                >
                  <option value="small">{t('themeCustomizer.fontSizeSmall')}</option>
                  <option value="medium">{t('themeCustomizer.fontSizeMedium')}</option>
                  <option value="large">{t('themeCustomizer.fontSizeLarge')}</option>
                </select>
              </div>

              {/* ACCENT COLOR */}
              <div className={styles.colorGroup}>
                <label
                  className={styles.colorLabel}
                  style={{ color: themeColors.text }}
                >
                  <span role="img" aria-label="palette">🎨</span> {t('themeCustomizer.accentColor')}
                </label>
                <div className={styles.colorGrid}>
                  {ACCENT_COLORS.map(({ color, name }) => (
                    <button
                      key={color}
                      className={`${styles.colorButton} ${
                        customSettings.accentColor === color ? styles.colorButtonActive : ''
                      }`}
                      onClick={() => handleSettingChange('accentColor', color)}
                      style={{
                        background: color,
                        border: customSettings.accentColor === color
                          ? '3px solid white'
                          : '1px solid #ccc',
                        boxShadow: customSettings.accentColor === color
                          ? `0 0 0 2px ${color}`
                          : 'none'
                      }}
                      title={name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className={styles.actions}>
              <button
                className={styles.buttonReset}
                onClick={handleReset}
                style={{
                  background: customSettings.accentColor,
                  color: 'white'
                }}
                title={t('themeCustomizer.resetTitle')}
              >
                <span role="img" aria-label="refresh">🔄</span> {t('themeCustomizer.resetToDefaults')}
              </button>
              <button
                className={styles.buttonClose}
                onClick={handleClose}
                style={{
                  background: themeColors.cardBackground,
                  color: themeColors.text,
                  border: `2px solid ${themeColors.border}`
                }}
                title={t('common.close')}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ThemeCustomizer;
