/*
 * ================================================================
 * FILE: EmptyStateTestPage.tsx
 * PATH: /apps/web-ui/src/pages/testing/EmptyStateTestPage.tsx
 * DESCRIPTION: Test page for EmptyState component
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
 * ================================================================
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, EmptyState, Button } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

export const EmptyStateTestPage: React.FC = () => {
  const { t } = useTranslation();

  // Enable global keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header with back link */}
      <div style={{ marginBottom: '32px' }}>
        <Link to="/testing" style={{
          textDecoration: 'none',
          color: 'var(--color-brand-primary, #9c27b0)',
          fontSize: '14px',
          fontWeight: 600,
          display: 'inline-block',
          marginBottom: '16px'
        }}>
          ← {t('components.testing.backToDashboard')}
        </Link>
        <h1 style={{ margin: 0 }}>{t('components.testing.emptyStateTitle')}</h1>
      </div>

      {/* Sizes */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '16px' }}>{t('components.testing.sizes')}</h2>

        <h3 style={{ marginBottom: '12px' }}>{t('components.buttons.small')} {t('components.testing.size')}</h3>
        <Card variant="outlined" style={{ marginBottom: '24px' }}>
          <EmptyState
            size="small"
            icon="📭"
            title={t('components.emptyState.noData')}
            description={t('components.emptyState.noDataDescription')}
          />
        </Card>

        <h3 style={{ marginBottom: '12px' }}>{t('components.buttons.medium')} {t('components.testing.size')}</h3>
        <Card variant="outlined" style={{ marginBottom: '24px' }}>
          <EmptyState
            size="medium"
            icon="🔍"
            title={t('components.emptyState.noResults')}
            description={t('components.emptyState.noResultsDescription')}
          />
        </Card>

        <h3 style={{ marginBottom: '12px' }}>{t('components.buttons.large')} {t('components.testing.size')}</h3>
        <Card variant="outlined" style={{ marginBottom: '24px' }}>
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
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '16px' }}>{t('components.testing.useCases')}</h2>

        <h3 style={{ marginBottom: '12px' }}>{t('components.emptyState.noSearchResults')}</h3>
        <Card variant="outlined" style={{ marginBottom: '24px' }}>
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

        <h3 style={{ marginBottom: '12px' }}>{t('components.emptyState.emptyList')}</h3>
        <Card variant="outlined" style={{ marginBottom: '24px' }}>
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

        <h3 style={{ marginBottom: '12px' }}>{t('components.emptyState.noContacts')}</h3>
        <Card variant="outlined" style={{ marginBottom: '24px' }}>
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

        <h3 style={{ marginBottom: '12px' }}>{t('components.emptyState.noOrders')}</h3>
        <Card variant="outlined" style={{ marginBottom: '24px' }}>
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

        <h3 style={{ marginBottom: '12px' }}>{t('components.emptyState.errorState')}</h3>
        <Card variant="outlined" style={{ marginBottom: '24px' }}>
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

        <h3 style={{ marginBottom: '12px' }}>{t('components.emptyState.noPermission')}</h3>
        <Card variant="outlined" style={{ marginBottom: '24px' }}>
          <EmptyState
            size="medium"
            icon="🔒"
            title={t('components.emptyState.accessDenied')}
            description={t('components.emptyState.accessDeniedDescription')}
          />
        </Card>
      </section>

      {/* Without Action Button */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '16px' }}>{t('components.emptyState.withoutActionButton')}</h2>
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
  );
};

export default EmptyStateTestPage;
