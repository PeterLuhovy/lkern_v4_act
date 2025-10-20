/*
 * ================================================================
 * FILE: SpinnerTestPage.tsx
 * PATH: /apps/web-ui/src/pages/testing/SpinnerTestPage/SpinnerTestPage.tsx
 * DESCRIPTION: Test page for Spinner component
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
 * UPDATED: 2025-10-18 21:15:00
 * ================================================================
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Spinner, BasePage } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import styles from './SpinnerTestPage.module.css';

export const SpinnerTestPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <BasePage>
      <div className={styles.container}>
        {/* Header with back link */}
        <div className={styles.header}>
          <Link to="/testing" className={styles.backLink}>
            {t('components.testing.backToDashboard')}
          </Link>
          <h1 className={styles.title}>{t('components.testing.spinnerTitle')}</h1>
        </div>

      {/* Sizes */}
      <Card variant="outlined" className={styles.card}>
        <h2 className={styles.cardTitle}>{t('components.testing.sizes')}</h2>
        <div className={styles.spinnerGrid}>
          <div className={styles.spinnerItem}>
            <Spinner size="small" />
            <p className={styles.spinnerLabel}>
              {t('components.buttons.small')} (24px)
            </p>
          </div>
          <div className={styles.spinnerItem}>
            <Spinner size="medium" />
            <p className={styles.spinnerLabel}>
              {t('components.buttons.medium')} (40px)
            </p>
          </div>
          <div className={styles.spinnerItem}>
            <Spinner size="large" />
            <p className={styles.spinnerLabel}>
              {t('components.buttons.large')} (56px)
            </p>
          </div>
        </div>
      </Card>

      {/* With Labels */}
      <Card variant="outlined" className={styles.card}>
        <h2 className={styles.cardTitle}>{t('components.testing.withLabel')}</h2>
        <div className={styles.spinnerGridLarge}>
          <Spinner size="small" label={t('common.loading')} />
          <Spinner size="medium" label={t('common.loading')} />
          <Spinner size="large" label={t('components.testing.pleaseWait')} />
        </div>
      </Card>

      {/* Use Cases */}
      <Card variant="outlined" className={styles.card}>
        <h2 className={styles.cardTitle}>{t('components.testing.useCases')}</h2>

        <h3 className={styles.subsectionTitle}>{t('components.testing.loadingData')}</h3>
        <div className={styles.demoBox}>
          <Spinner size="large" label={t('components.testing.loadingContacts')} />
        </div>

        <h3 className={styles.subsectionTitle}>{t('components.testing.centeredContainer')}</h3>
        <div className={styles.demoBoxCentered}>
          <Spinner size="medium" />
        </div>

        <h3 className={styles.subsectionTitle}>{t('components.testing.inlineText')}</h3>
        <div className={styles.demoBoxInline}>
          <Spinner size="small" />
          <span>{t('components.testing.processingRequest')}</span>
        </div>

        <h3 className={styles.subsectionTitle}>{t('components.testing.fullPageLoader')}</h3>
        <div className={styles.fullPageLoaderContainer}>
          <div className={styles.fullPageLoaderContent}>
            <Spinner size="large" label={t('components.testing.loadingPage')} />
          </div>
        </div>
      </Card>
      </div>
    </BasePage>
  );
};

export default SpinnerTestPage;
