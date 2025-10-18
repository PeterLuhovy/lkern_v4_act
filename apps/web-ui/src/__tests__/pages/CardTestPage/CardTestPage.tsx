/*
 * ================================================================
 * FILE: CardTestPage.tsx
 * PATH: /apps/web-ui/src/pages/testing/CardTestPage/CardTestPage.tsx
 * DESCRIPTION: Test page for Card component variants
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
 * UPDATED: 2025-10-18 21:15:00
 * ================================================================
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, BasePage } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import { useKeyboardShortcuts } from '../../../hooks/useKeyboardShortcuts';
import styles from './CardTestPage.module.css';

export const CardTestPage: React.FC = () => {
  const { t } = useTranslation();

  // Enable global keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <BasePage>
      <div className={styles.container}>
        {/* Header with back link */}
        <div className={styles.header}>
          <Link to="/testing" className={styles.backLink}>
            ← {t('components.testing.backToDashboard')}
          </Link>
          <h1 className={styles.title}>{t('components.testing.cardTitle')}</h1>
        </div>

      {/* Variants */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('components.testing.variants')}</h2>
        <div className={styles.cardStack}>
          <Card variant="default">
            <h3 className={styles.cardTitle}>{t('components.card.defaultVariant')}</h3>
            <p className={styles.cardText}>
              {t('components.card.defaultDescription')}
            </p>
          </Card>

          <Card variant="outlined">
            <h3 className={styles.cardTitle}>{t('components.card.outlinedVariant')}</h3>
            <p className={styles.cardText}>
              {t('components.card.outlinedDescription')}
            </p>
          </Card>

          <Card variant="elevated">
            <h3 className={styles.cardTitle}>{t('components.card.elevatedVariant')}</h3>
            <p className={styles.cardText}>
              {t('components.card.elevatedDescription')}
            </p>
          </Card>
        </div>
      </section>

      {/* Clickable Cards */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('components.card.clickableTitle')}</h2>
        <div className={styles.cardStack}>
          <Card variant="outlined" onClick={() => alert(t('components.card.clickedMessage'))}>
            <h3 className={styles.cardTitle}>{t('components.card.clickableCard')}</h3>
            <p className={styles.cardText}>
              {t('components.card.clickableDescription')}
            </p>
          </Card>

          <Card variant="elevated" onClick={() => alert(t('components.card.elevatedClickedMessage'))}>
            <h3 className={styles.cardTitle}>{t('components.card.elevatedClickableCard')}</h3>
            <p className={styles.cardText}>
              {t('components.card.elevatedClickableDescription')}
            </p>
          </Card>
        </div>
      </section>

      {/* Nested Content */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('components.testing.nestedContentExamples')}</h2>
        <div className={styles.cardStack}>
          <Card variant="outlined">
            <h3 className={styles.cardTitleLarge}>{t('components.card.cardWithList')}</h3>
            <ul className={styles.cardList}>
              <li>{t('components.card.item')} 1</li>
              <li>{t('components.card.item')} 2</li>
              <li>{t('components.card.item')} 3</li>
            </ul>
          </Card>

          <Card variant="default">
            <h3 className={styles.cardTitleLarge}>{t('components.card.cardWithButtons')}</h3>
            <div className={styles.buttonGroup}>
              <button className={styles.primaryButton}>
                {t('common.save')}
              </button>
              <button className={styles.secondaryButton}>
                {t('common.cancel')}
              </button>
            </div>
          </Card>
        </div>
      </section>

      {/* Grid Layout */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('components.testing.gridLayoutExample')}</h2>
        <div className={styles.cardGrid}>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <Card key={num} variant="outlined">
              <h3 className={styles.cardTitle}>{t('components.card.cardNumber', { number: num })}</h3>
              <p className={styles.cardText}>
                {t('components.card.exampleCardInGrid')}
              </p>
            </Card>
          ))}
        </div>
      </section>
      </div>
    </BasePage>
  );
};

export default CardTestPage;
