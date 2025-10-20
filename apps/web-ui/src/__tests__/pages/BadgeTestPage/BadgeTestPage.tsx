/*
 * ================================================================
 * FILE: BadgeTestPage.tsx
 * PATH: /apps/web-ui/src/pages/testing/BadgeTestPage/BadgeTestPage.tsx
 * DESCRIPTION: Test page for Badge component with translations
 * VERSION: v2.0.0
 * CREATED: 2025-10-18
 * UPDATED: 2025-10-18 21:15:00
 * ================================================================
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Card, BasePage } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import styles from './BadgeTestPage.module.css';

export const BadgeTestPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <BasePage>
      <div className={styles.container}>
        {/* Header with back link */}
        <div className={styles.header}>
          <Link to="/testing" className={styles.backLink}>
            {t('components.testing.backToDashboard')}
          </Link>
          <h1 className={styles.title}>{t('components.badge.demo.title')}</h1>
        </div>

      {/* Variants */}
      <Card variant="outlined" className={styles.card}>
        <h2 className={styles.cardTitle}>{t('components.badge.demo.variants')}</h2>
        <div className={styles.badgeGrid}>
          <Badge variant="neutral">{t('components.badge.neutral')}</Badge>
          <Badge variant="success">{t('components.badge.success')}</Badge>
          <Badge variant="warning">{t('components.badge.warning')}</Badge>
          <Badge variant="error">{t('components.badge.error')}</Badge>
          <Badge variant="info">{t('components.badge.info')}</Badge>
        </div>
      </Card>

      {/* Sizes */}
      <Card variant="outlined" className={styles.card}>
        <h2 className={styles.cardTitle}>{t('components.badge.demo.sizes')}</h2>
        <div className={styles.badgeGridAligned}>
          <Badge variant="success" size="small">
            {t('components.badge.small')}
          </Badge>
          <Badge variant="success" size="medium">
            {t('components.badge.medium')}
          </Badge>
          <Badge variant="success" size="large">
            {t('components.badge.large')}
          </Badge>
        </div>
      </Card>

      {/* With Dot Indicator */}
      <Card variant="outlined" className={styles.card}>
        <h2 className={styles.cardTitle}>{t('components.badge.demo.dotIndicator')}</h2>
        <div className={styles.badgeGrid}>
          <Badge variant="neutral" dot>
            {t('components.badge.neutral')}
          </Badge>
          <Badge variant="success" dot>
            {t('components.badge.active')}
          </Badge>
          <Badge variant="warning" dot>
            {t('components.badge.pending')}
          </Badge>
          <Badge variant="error" dot>
            {t('components.badge.failed')}
          </Badge>
          <Badge variant="info" dot>
            {t('components.badge.processing')}
          </Badge>
        </div>
      </Card>

      {/* All Combinations */}
      <Card variant="outlined" className={styles.card}>
        <h2 className={styles.cardTitle}>{t('components.badge.demo.allCombinations')}</h2>

        <h3 className={styles.sectionHeading}>{t('components.badge.success')}</h3>
        <div className={styles.badgeGridAligned}>
          <Badge variant="success" size="small">{t('components.badge.small')} {t('components.badge.success')}</Badge>
          <Badge variant="success" size="medium">{t('components.badge.medium')} {t('components.badge.success')}</Badge>
          <Badge variant="success" size="large">{t('components.badge.large')} {t('components.badge.success')}</Badge>
        </div>

        <h3 className={styles.sectionHeading}>{t('components.badge.warning')}</h3>
        <div className={styles.badgeGridAligned}>
          <Badge variant="warning" size="small">{t('components.badge.small')} {t('components.badge.warning')}</Badge>
          <Badge variant="warning" size="medium">{t('components.badge.medium')} {t('components.badge.warning')}</Badge>
          <Badge variant="warning" size="large">{t('components.badge.large')} {t('components.badge.warning')}</Badge>
        </div>

        <h3 className={styles.sectionHeading}>{t('components.badge.error')}</h3>
        <div className={styles.badgeGridAligned}>
          <Badge variant="error" size="small">{t('components.badge.small')} {t('components.badge.error')}</Badge>
          <Badge variant="error" size="medium">{t('components.badge.medium')} {t('components.badge.error')}</Badge>
          <Badge variant="error" size="large">{t('components.badge.large')} {t('components.badge.error')}</Badge>
        </div>

        <h3 className={styles.sectionHeading}>{t('components.badge.info')}</h3>
        <div className={styles.badgeGridAligned}>
          <Badge variant="info" size="small">{t('components.badge.small')} {t('components.badge.info')}</Badge>
          <Badge variant="info" size="medium">{t('components.badge.medium')} {t('components.badge.info')}</Badge>
          <Badge variant="info" size="large">{t('components.badge.large')} {t('components.badge.info')}</Badge>
        </div>
      </Card>

      {/* Use Cases */}
      <Card variant="outlined" className={styles.card}>
        <h2 className={styles.cardTitle}>{t('components.badge.demo.useCases')}</h2>

        <h3 className={styles.sectionHeading}>{t('components.badge.demo.orderStatuses')}</h3>
        <div className={styles.badgeGrid}>
          <Badge variant="info" dot>{t('components.badge.demo.newOrder')}</Badge>
          <Badge variant="warning" dot>{t('components.badge.demo.inProgress')}</Badge>
          <Badge variant="success" dot>{t('components.badge.demo.completed')}</Badge>
          <Badge variant="error" dot>{t('components.badge.demo.cancelled')}</Badge>
        </div>

        <h3 className={styles.sectionHeading}>{t('components.badge.demo.userRoles')}</h3>
        <div className={styles.badgeGrid}>
          <Badge variant="error" size="small">{t('components.badge.demo.admin')}</Badge>
          <Badge variant="info" size="small">{t('components.badge.demo.manager')}</Badge>
          <Badge variant="neutral" size="small">{t('components.badge.demo.user')}</Badge>
        </div>

        <h3 className={styles.sectionHeading}>{t('components.badge.demo.stockLevels')}</h3>
        <div className={styles.badgeGrid}>
          <Badge variant="success">{t('components.badge.demo.inStock')} (125)</Badge>
          <Badge variant="warning">{t('components.badge.demo.lowStock')} (5)</Badge>
          <Badge variant="error">{t('components.badge.demo.outOfStock')}</Badge>
        </div>
      </Card>
      </div>
    </BasePage>
  );
};

export default BadgeTestPage;
