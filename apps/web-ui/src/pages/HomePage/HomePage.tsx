/*
 * ================================================================
 * FILE: HomePage.tsx
 * PATH: /apps/web-ui/src/pages/HomePage/HomePage.tsx
 * DESCRIPTION: Simple homepage with navigation
 * VERSION: v2.0.0
 * UPDATED: 2025-10-18
 * ================================================================
 */

// === IMPORTS ===
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation, useTheme } from '@l-kern/config';
import { Card, BasePage } from '@l-kern/ui-components';
import styles from './HomePage.module.css';

// === COMPONENT ===
export const HomePage: React.FC = () => {
  const { t, language, setLanguage } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <BasePage pageName="home">
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span role="img" aria-label="rocket">🚀</span> L-KERN v4
          </h1>
          <p className={styles.subtitle}>
            {t('dashboard.welcome')}
          </p>
        </div>

        {/* Quick Controls */}
        <div className={styles.quickControls}>
          <Card variant="outlined">
            <h3 className={styles.cardTitle}><span role="img" aria-label="artist palette">🎨</span> {t('dashboard.theme')}</h3>
            <p className={styles.cardText}>
              {t('dashboard.current')}: <strong>{theme}</strong>
            </p>
            <button
              onClick={toggleTheme}
              className={styles.themeButton}
            >
              {t('dashboard.toggleTheme')}
            </button>
          </Card>

          <Card variant="outlined">
            <h3 className={styles.cardTitle}><span role="img" aria-label="globe">🌍</span> {t('dashboard.language')}</h3>
            <p className={styles.cardText}>
              {t('dashboard.current')}: <strong>{language.toUpperCase()}</strong>
            </p>
            <div className={styles.languageButtons}>
              <button
                onClick={() => setLanguage('sk')}
                disabled={language === 'sk'}
                className={`${styles.languageButton} ${language === 'sk' ? styles.languageButtonActive : ''}`}
              >
                SK
              </button>
              <button
                onClick={() => setLanguage('en')}
                disabled={language === 'en'}
                className={`${styles.languageButton} ${language === 'en' ? styles.languageButtonActive : ''}`}
              >
                EN
              </button>
            </div>
          </Card>
        </div>

        {/* Navigation Links */}
        <div className={styles.navigationSection}>
          <h2 className={styles.navigationTitle}>{t('dashboard.pages')}</h2>
          <div className={styles.navigationList}>
            <Link to="/testing" className={styles.navigationLink}>
              <Card variant="elevated">
                <div className={styles.navigationCard}>
                  <span role="img" aria-label="test tube">🧪</span> {t('components.testing.dashboard')}
                </div>
                <p className={styles.navigationCardText}>
                  {t('dashboard.testingDescription')}
                </p>
              </Card>
            </Link>
          </div>
        </div>

        {/* Keyboard Shortcuts Hint */}
        <Card variant="default" className={styles.shortcutsCard}>
          <h3 className={styles.shortcutsTitle}><span role="img" aria-label="keyboard">⌨️</span> {t('dashboard.keyboardShortcuts')}</h3>
          <div className={styles.shortcutsList}>
            <div className={styles.shortcutItem}>
              <kbd className={styles.kbd}>Ctrl+D</kbd>
              <span className={styles.shortcutText}>{t('dashboard.toggleTheme')}</span>
            </div>
            <div className={styles.shortcutItem}>
              <kbd className={styles.kbd}>Ctrl+L</kbd>
              <span className={styles.shortcutText}>{t('dashboard.toggleLanguage')}</span>
            </div>
          </div>
        </Card>
      </div>
    </BasePage>
  );
};

export default HomePage;
