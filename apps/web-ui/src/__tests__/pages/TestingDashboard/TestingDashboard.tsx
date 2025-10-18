/*
 * ================================================================
 * FILE: TestingDashboard.tsx
 * PATH: /apps/web-ui/src/__tests__/pages/TestingDashboard/TestingDashboard.tsx
 * DESCRIPTION: Central testing dashboard with links to all component test pages
 * VERSION: v2.0.0
 * UPDATED: 2025-10-18 21:30:00
 * ================================================================
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@l-kern/config';
import { BasePage, Card, DashboardCard } from '@l-kern/ui-components';
import styles from './TestingDashboard.module.css';

export const TestingDashboard: React.FC = () => {
  const { t } = useTranslation();

  const testPages = [
    {
      path: '/testing/forms',
      icon: '📝',
      title: t('components.testing.formComponents'),
      description: t('components.testing.formComponentsDescription'),
    },
    {
      path: '/testing/badge',
      icon: '🏷️',
      title: t('components.testing.badgeTitle'),
      description: t('components.testing.badgeDescription'),
    },
    {
      path: '/testing/card',
      icon: '🃏',
      title: t('components.testing.cardTitle'),
      description: t('components.testing.cardDescription'),
    },
    {
      path: '/testing/empty-state',
      icon: '📭',
      title: t('components.testing.emptyStateTitle'),
      description: t('components.testing.emptyStateDescription'),
    },
    {
      path: '/testing/spinner',
      icon: '⏳',
      title: t('components.testing.spinnerTitle'),
      description: t('components.testing.spinnerDescription'),
    },
    {
      path: '/testing/utility',
      icon: '🔧',
      title: t('components.testing.utilityFunctions'),
      description: t('components.testing.utilityDescription'),
    },
    {
      path: '/testing/wizard-demo',
      icon: '🧙',
      title: t('components.testing.wizardTitle'),
      description: t('components.testing.wizardDescription'),
    },
    {
      path: '/testing/modal-v3',
      icon: '🪟',
      title: 'Modal v3.0.0 Enhanced',
      description: 'Drag & Drop, Nested Modals, Enhanced Keyboard, Enhanced Footer, Alignment',
    },
  ];

  return (
    <BasePage>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <Link to="/" className={styles.backLink}>
            ← {t('components.testing.backToHome')}
          </Link>
          <h1 className={styles.title}>
            🧪 {t('components.testing.dashboard')}
          </h1>
          <p className={styles.subtitle}>
            {t('components.testing.dashboardSubtitle')}
          </p>
        </div>

        {/* Test Pages Grid */}
        <div className={styles.grid}>
          {testPages.map((page) => (
            <DashboardCard
              key={page.path}
              path={page.path}
              icon={page.icon}
              title={page.title}
              description={page.description}
            />
          ))}
        </div>

        {/* Info Footer */}
        <Card variant="default" className={styles.infoFooter}>
          <p className={styles.infoText}>
            💡 {t('components.testing.dashboardHint')}
          </p>
        </Card>
      </div>
    </BasePage>
  );
};

export default TestingDashboard;
