/*
 * ================================================================
 * FILE: KeyboardShortcutsButton.tsx
 * PATH: packages/ui-components/src/components/KeyboardShortcutsButton/KeyboardShortcutsButton.tsx
 * DESCRIPTION: Floating button for displaying keyboard shortcuts modal
 * VERSION: v1.1.0
 * UPDATED: 2025-11-30
 * PORTED FROM: v3 packages/page-templates/src/components/KeyboardShortcutsButton/
 * CHANGES:
 *   - v1.1.0: Fixed duplicate keyboard handlers, added Ctrl+1-9 shortcuts
 *   - v1.0.0: Initial port from v3
 * ================================================================
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@l-kern/config';
import styles from './KeyboardShortcutsButton.module.css';

export interface KeyboardShortcut {
  key: string;
  descriptionKey: string; // Translation key instead of hardcoded text
  action?: () => void; // Optional - some shortcuts are just display
}

export interface KeyboardShortcutsButtonProps {
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

  /**
   * Callback when shortcuts modal is opened
   */
  onOpen?: () => void;

  /**
   * Callback when shortcuts modal is closed
   */
  onClose?: () => void;
}

const BUTTON_OFFSET = 16; // px offset above StatusBar
const THEME_CUSTOMIZER_WIDTH = 48; // px width of theme customizer button
const BUTTON_SPACING = 16; // px spacing between buttons

export const KeyboardShortcutsButton: React.FC<KeyboardShortcutsButtonProps> = ({
  position = 'bottom-right',
  statusBarExpanded = false,
  statusBarHeight = 32,
  statusBarExpandedHeight = 300,
  onOpen,
  onClose
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  // Define shortcuts for display (BasePage handles the actual functionality)
  const shortcuts: KeyboardShortcut[] = [
    { key: 'Ctrl+D', descriptionKey: 'keyboardShortcuts.toggleTheme' },
    { key: 'Ctrl+L', descriptionKey: 'keyboardShortcuts.changeLanguage' },
    { key: 'Ctrl+1', descriptionKey: 'keyboardShortcuts.permissionLevel10' },
    { key: 'Ctrl+2', descriptionKey: 'keyboardShortcuts.permissionLevel20' },
    { key: 'Ctrl+3', descriptionKey: 'keyboardShortcuts.permissionLevel29' },
    { key: 'Ctrl+4', descriptionKey: 'keyboardShortcuts.permissionLevel35' },
    { key: 'Ctrl+5', descriptionKey: 'keyboardShortcuts.permissionLevel45' },
    { key: 'Ctrl+6', descriptionKey: 'keyboardShortcuts.permissionLevel59' },
    { key: 'Ctrl+7', descriptionKey: 'keyboardShortcuts.permissionLevel65' },
    { key: 'Ctrl+8', descriptionKey: 'keyboardShortcuts.permissionLevel85' },
    { key: 'Ctrl+9', descriptionKey: 'keyboardShortcuts.permissionLevel100' },
  ];

  // Calculate dynamic bottom position - ABOVE ThemeCustomizer
  const calculateBottomPosition = () => {
    const currentStatusBarHeight = statusBarExpanded
      ? (statusBarExpandedHeight + statusBarHeight)  // Expanded content + header
      : statusBarHeight;
    const themeCustomizerBottom = currentStatusBarHeight + BUTTON_OFFSET;
    return themeCustomizerBottom + THEME_CUSTOMIZER_WIDTH + BUTTON_SPACING; // Stack vertically
  };

  // Same right position as ThemeCustomizer (aligned vertically)
  const calculateRightPosition = () => {
    return 24; // Same as ThemeCustomizer - var(--spacing-lg)
  };

  const handleClick = () => {
    setIsModalOpen(true);
    if (onOpen) {
      onOpen();
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    if (onClose) {
      onClose();
    }
  };

  // Keyboard listener ONLY for modal open/close (other shortcuts handled by BasePage)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in input field
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // ? - Open keyboard shortcuts modal (Shift+/ on most keyboards)
      // Note: e.key will be '?' when Shift+/ is pressed
      if (e.key === '?' && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setIsModalOpen(true);
      }

      // Esc - Close modal
      if (e.key === 'Escape' && isModalOpen) {
        e.preventDefault();
        setIsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        className={`${styles.button} ${styles[`button${position.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')}`]}`}
        onClick={handleClick}
        title={t('keyboardShortcuts.buttonHint')}
        style={{
          bottom: `${calculateBottomPosition()}px`,
          right: position.includes('right') ? `${calculateRightPosition()}px` : undefined,
          left: position.includes('left') ? `${calculateRightPosition()}px` : undefined,
          transition: 'bottom 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease'
        }}
      >
        <span className={styles.buttonIcon}>?</span>
      </button>

      {/* MODAL */}
      {isModalOpen && (
        <div
          className={styles.overlay}
          onClick={handleClose}
        >
          <div
            className={styles.content}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.header}>
              <h2 className={styles.title}>
                {t('keyboardShortcuts.title')}
              </h2>
              <button
                className={styles.closeButton}
                onClick={handleClose}
                aria-label={t('common.close')}
              >
                ×
              </button>
            </div>

            <div className={styles.body}>
              <div className={styles.shortcuts}>
                {shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className={styles.shortcut}
                  >
                    <kbd className={styles.key}>
                      {shortcut.key}
                    </kbd>
                    <span className={styles.description}>
                      {t(shortcut.descriptionKey)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.footer}>
              <p className={styles.hint}>
                <span role="img" aria-hidden="true">💡</span> {t('keyboardShortcuts.modalHint')}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KeyboardShortcutsButton;
