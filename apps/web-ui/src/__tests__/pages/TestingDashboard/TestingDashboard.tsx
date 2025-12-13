/*
 * ================================================================
 * FILE: TestingDashboard.tsx
 * PATH: /apps/web-ui/src/__tests__/pages/TestingDashboard/TestingDashboard.tsx
 * DESCRIPTION: Central testing dashboard with tabs for Components and Pages
 * VERSION: v3.0.0
 * UPDATED: 2025-11-08
 * ================================================================
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@l-kern/config';
import { BasePage, Card, DashboardCard } from '@l-kern/ui-components';
import styles from './TestingDashboard.module.css';

type TabType = 'components' | 'pages';

export const TestingDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('components');

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
      icon: '📋',
      title: t('components.testing.modalV3Title'),
      description: t('components.testing.modalV3Description'),
    },
    {
      path: '/testing/glass-modal',
      icon: '✨',
      title: t('components.testing.glassModal.title'),
      description: t('components.testing.glassModal.description'),
    },
    {
      path: '/testing/toast',
      icon: '🔔',
      title: t('components.testing.toastTitle'),
      description: t('components.testing.toastDescription'),
    },
    {
      path: '/testing/icons',
      icon: '🎨',
      title: t('components.testing.iconsTitle'),
      description: t('components.testing.iconsDescription'),
    },
    {
      path: '/testing/datagrid',
      icon: '📊',
      title: t('components.testing.dataGridTitle'),
      description: t('components.testing.dataGridDescription'),
    },
    {
      path: '/testing/entity-edit-modal',
      icon: '✏️',
      title: t('components.testing.entityEditModalTitle'),
      description: t('components.testing.entityEditModalDescription'),
    },
  ];

  const demoPages = [
    {
      path: '/testing/filtered-grid',
      icon: '🔍',
      title: t('components.testing.filteredGridTitle'),
      description: t('components.testing.filteredGridDescription'),
    },
    {
      path: '/testing/template-page-datagrid',
      icon: '📋',
      title: t('components.testing.templatePageDatagridTitle'),
      description: t('components.testing.templatePageDatagridDescription'),
    },
  ];

  const currentPages = activeTab === 'components' ? testPages : demoPages;

  return (
    <BasePage>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <Link to="/" className={styles.backLink}>
            {t('components.testing.backToHome')}
          </Link>
          <h1 className={styles.title}>
            <span aria-hidden="true">🧪</span> {t('components.testing.dashboard')}
          </h1>
          <p className={styles.subtitle}>
            {t('components.testing.dashboardSubtitle')}
          </p>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'components' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('components')}
          >
            <span aria-hidden="true">🧩</span> {t('components.testing.tabComponents')}
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'pages' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('pages')}
          >
            <span aria-hidden="true">📄</span> {t('components.testing.tabPages')}
          </button>
        </div>

        {/* Pages Grid */}
        <div className={styles.grid}>
          {currentPages.map((page) => (
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
            <span aria-hidden="true">💡</span> {t('components.testing.dashboardHint')}
          </p>
        </Card>
      </div>
    </BasePage>
  );
};

export default TestingDashboard;
