/*
 * ================================================================
 * FILE: useKeyboardShortcuts.ts
 * PATH: /apps/web-ui/src/hooks/useKeyboardShortcuts.ts
 * DESCRIPTION: Global keyboard shortcuts hook
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
 * ================================================================
 *
 * KEYBOARD SHORTCUTS:
 * - Ctrl+D: Toggle dark/light theme
 * - Ctrl+L: Toggle language (SK ↔ EN)
 */

import { useEffect } from 'react';
import { useTheme, useTranslation } from '@l-kern/config';

export const useKeyboardShortcuts = () => {
  const { toggleTheme } = useTheme();
  const { language, setLanguage } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in input field
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      // Ctrl+D - Toggle dark/light mode
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        toggleTheme();
      }

      // Ctrl+L - Change language
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        setLanguage(language === 'sk' ? 'en' : 'sk');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTheme, setLanguage, language]);
};

export default useKeyboardShortcuts;
