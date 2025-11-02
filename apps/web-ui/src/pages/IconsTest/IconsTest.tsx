/*
 * ================================================================
 * FILE: IconsTest.tsx
 * PATH: /apps/web-ui/src/pages/IconsTest/IconsTest.tsx
 * DESCRIPTION: Modern icon set testing page
 * VERSION: v1.3.0
 * UPDATED: 2025-11-02
 * CHANGES:
 *   - v1.3.0: Using Card components instead of custom elements
 *   - v1.2.0: Updated to v3.0.0 icon set (modern colorful icons)
 *   - v1.1.0: Added BasePage wrapper for sidebar and analytics
 *   - v1.0.0: Initial icon testing page
 * ================================================================
 */

import { useState } from 'react';
import {
  useTranslation,
  ICONS_NAVIGATION,
  ICONS_ACTIONS,
  ICONS_STATUS,
  ICONS_DATA,
  ICONS_BUSINESS,
  ICONS_SYSTEM,
  ICONS_SHAPES,
} from '@l-kern/config';
import { BasePage, Card } from '@l-kern/ui-components';
import styles from './IconsTest.module.css';

interface IconCardProps {
  symbol: string;
  name: string;
  onCopy: (symbol: string, name: string) => void;
}

function IconCard({ symbol, name, onCopy }: IconCardProps) {
  return (
    <Card
      variant="outlined"
      onClick={() => onCopy(symbol, name)}
      className={styles.iconCard}
    >
      <div className={styles.iconSymbol}>{symbol}</div>
      <div className={styles.iconName}>{name}</div>
    </Card>
  );
}

interface IconSectionProps {
  title: string;
  icons: Record<string, string>;
  onCopy: (symbol: string, name: string) => void;
}

function IconSection({ title, icons, onCopy }: IconSectionProps) {
  return (
    <Card variant="outlined">
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.iconGrid}>
        {Object.entries(icons).map(([name, symbol]) => (
          <IconCard
            key={name}
            symbol={symbol}
            name={name}
            onCopy={onCopy}
          />
        ))}
      </div>
    </Card>
  );
}

export function IconsTest() {
  const { t } = useTranslation();
  const [copiedText, setCopiedText] = useState<string>('');

  const handleCopy = (symbol: string, name: string) => {
    navigator.clipboard.writeText(symbol);
    setCopiedText(`Copied: ${symbol} (${name})`);
    setTimeout(() => setCopiedText(''), 2000);
  };

  return (
    <BasePage pageName="icons-test" activePath="/testing/icons">
      <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          {t('test.icons.title')}
        </h1>
        <p className={styles.subtitle}>
          {t('test.icons.subtitle')}
        </p>
        {copiedText && (
          <div className={styles.copiedNotification}>
            {copiedText}
          </div>
        )}
      </header>

      <div className={styles.content}>
        <IconSection
          title={t('test.icons.navigation')}
          icons={ICONS_NAVIGATION}
          onCopy={handleCopy}
        />

        <IconSection
          title={t('test.icons.actions')}
          icons={ICONS_ACTIONS}
          onCopy={handleCopy}
        />

        <IconSection
          title={t('test.icons.status')}
          icons={ICONS_STATUS}
          onCopy={handleCopy}
        />

        <IconSection
          title={t('test.icons.data')}
          icons={ICONS_DATA}
          onCopy={handleCopy}
        />

        <IconSection
          title={t('test.icons.business')}
          icons={ICONS_BUSINESS}
          onCopy={handleCopy}
        />

        <IconSection
          title={t('test.icons.system')}
          icons={ICONS_SYSTEM}
          onCopy={handleCopy}
        />

        <IconSection
          title={t('test.icons.shapes')}
          icons={ICONS_SHAPES}
          onCopy={handleCopy}
        />
      </div>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          {t('test.icons.footer')}
        </p>
      </footer>
      </div>
    </BasePage>
  );
}