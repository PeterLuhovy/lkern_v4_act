/*
 * ================================================================
 * FILE: EmptyStateTestPage.tsx
 * PATH: /apps/web-ui/src/pages/testing/EmptyStateTestPage/EmptyStateTestPage.tsx
 * DESCRIPTION: Test page for EmptyState component
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
 * UPDATED: 2025-10-18 21:15:00
 * ================================================================
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, EmptyState, Button, BasePage } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import { useKeyboardShortcuts } from '../../../hooks/useKeyboardShortcuts';
import styles from './EmptyStateTestPage.module.css';

export const EmptyStateTestPage: React.FC = () => {
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
          <h1 className={styles.title}>{t('components.testing.emptyStateTitle')}</h1>
        </div>

      {/* Sizes */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('components.testing.sizes')}</h2>

        <h3 className={styles.subsectionTitle}>{t('components.buttons.small')} {t('components.testing.size')}</h3>
        <Card variant="outlined" className={styles.card}>
          <EmptyState
            size="small"
            icon="📭"
            title={t('components.emptyState.noData')}
            description={t('components.emptyState.noDataDescription')}
          />
        </Card>

        <h3 className={styles.subsectionTitle}>{t('components.buttons.medium')} {t('components.testing.size')}</h3>
        <Card variant="outlined" className={styles.card}>
          <EmptyState
            size="medium"
            icon="🔍"
            title={t('components.emptyState.noResults')}
            description={t('components.emptyState.noResultsDescription')}
          />
        </Card>

        <h3 className={styles.subsectionTitle}>{t('components.buttons.large')} {t('components.testing.size')}</h3>
        <Card variant="outlined" className={styles.card}>
          <EmptyState
            size="large"
            icon="📦"
            title={t('components.emptyState.noOrders')}
            description={t('components.emptyState.noOrdersDescription')}
            action={
              <Button variant="primary" size="small">
                {t('orders.add')}
              </Button>
            }
          />
        </Card>
      </section>

      {/* Use Cases */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('components.testing.useCases')}</h2>

        <h3 className={styles.subsectionTitle}>{t('components.emptyState.noSearchResults')}</h3>
        <Card variant="outlined" className={styles.card}>
          <EmptyState
            size="medium"
            icon="🔍"
            title={t('components.emptyState.noSearchResults')}
            description={t('components.emptyState.noSearchResultsDescription')}
            action={
              <Button variant="secondary" size="small">
                {t('components.emptyState.clearFilters')}
              </Button>
            }
          />
        </Card>

        <h3 className={styles.subsectionTitle}>{t('components.emptyState.emptyList')}</h3>
        <Card variant="outlined" className={styles.card}>
          <EmptyState
            size="medium"
            icon="📋"
            title={t('components.emptyState.noItemsYet')}
            description={t('components.emptyState.noItemsYetDescription')}
            action={
              <Button variant="primary" size="small">
                {t('components.emptyState.createItem')}
              </Button>
            }
          />
        </Card>

        <h3 className={styles.subsectionTitle}>{t('components.emptyState.noContacts')}</h3>
        <Card variant="outlined" className={styles.card}>
          <EmptyState
            size="medium"
            icon="👥"
            title={t('components.emptyState.noContactsFound')}
            description={t('components.emptyState.noContactsFoundDescription')}
            action={
              <Button variant="primary" size="small">
                {t('contacts.add')}
              </Button>
            }
          />
        </Card>

        <h3 className={styles.subsectionTitle}>{t('components.emptyState.noOrders')}</h3>
        <Card variant="outlined" className={styles.card}>
          <EmptyState
            size="medium"
            icon="📦"
            title={t('components.emptyState.noOrders')}
            description={t('components.emptyState.noOrdersDescription')}
            action={
              <Button variant="primary" size="small">
                {t('orders.add')}
              </Button>
            }
          />
        </Card>

        <h3 className={styles.subsectionTitle}>{t('components.emptyState.errorState')}</h3>
        <Card variant="outlined" className={styles.card}>
          <EmptyState
            size="medium"
            icon="⚠️"
            title={t('components.emptyState.somethingWentWrong')}
            description={t('components.emptyState.somethingWentWrongDescription')}
            action={
              <Button variant="danger" size="small">
                {t('components.emptyState.retry')}
              </Button>
            }
          />
        </Card>

        <h3 className={styles.subsectionTitle}>{t('components.emptyState.noPermission')}</h3>
        <Card variant="outlined" className={styles.card}>
          <EmptyState
            size="medium"
            icon="🔒"
            title={t('components.emptyState.accessDenied')}
            description={t('components.emptyState.accessDeniedDescription')}
          />
        </Card>
      </section>

      {/* Without Action Button */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('components.emptyState.withoutActionButton')}</h2>
        <Card variant="outlined">
          <EmptyState
            size="medium"
            icon="✅"
            title={t('components.emptyState.allDone')}
            description={t('components.emptyState.allDoneDescription')}
          />
        </Card>
      </section>
      </div>
    </BasePage>
  );
};

export default EmptyStateTestPage;
