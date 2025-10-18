/*
 * ================================================================
 * FILE: BadgeDemo.tsx
 * PATH: /apps/web-ui/src/pages/BadgeDemo.tsx
 * DESCRIPTION: Demo page for Badge component with translations
 * VERSION: v2.0.0
 * CREATED: 2025-10-18
 * UPDATED: 2025-10-18
 * ================================================================
 */

import React from 'react';
import { Badge } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export const BadgeDemo: React.FC = () => {
  const { t } = useTranslation();

  // Enable global keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '32px' }}>{t('components.badge.demo.title')}</h1>

      {/* Variants */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '16px' }}>{t('components.badge.demo.variants')}</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Badge variant="neutral">{t('components.badge.neutral')}</Badge>
          <Badge variant="success">{t('components.badge.success')}</Badge>
          <Badge variant="warning">{t('components.badge.warning')}</Badge>
          <Badge variant="error">{t('components.badge.error')}</Badge>
          <Badge variant="info">{t('components.badge.info')}</Badge>
        </div>
      </section>

      {/* Sizes */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '16px' }}>{t('components.badge.demo.sizes')}</h2>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
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
      </section>

      {/* With Dot Indicator */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '16px' }}>{t('components.badge.demo.dotIndicator')}</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
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
      </section>

      {/* All Combinations */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '16px' }}>{t('components.badge.demo.allCombinations')}</h2>

        <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>{t('components.badge.success')}</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge variant="success" size="small">{t('components.badge.small')} {t('components.badge.success')}</Badge>
          <Badge variant="success" size="medium">{t('components.badge.medium')} {t('components.badge.success')}</Badge>
          <Badge variant="success" size="large">{t('components.badge.large')} {t('components.badge.success')}</Badge>
        </div>

        <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>{t('components.badge.warning')}</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge variant="warning" size="small">{t('components.badge.small')} {t('components.badge.warning')}</Badge>
          <Badge variant="warning" size="medium">{t('components.badge.medium')} {t('components.badge.warning')}</Badge>
          <Badge variant="warning" size="large">{t('components.badge.large')} {t('components.badge.warning')}</Badge>
        </div>

        <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>{t('components.badge.error')}</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge variant="error" size="small">{t('components.badge.small')} {t('components.badge.error')}</Badge>
          <Badge variant="error" size="medium">{t('components.badge.medium')} {t('components.badge.error')}</Badge>
          <Badge variant="error" size="large">{t('components.badge.large')} {t('components.badge.error')}</Badge>
        </div>

        <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>{t('components.badge.info')}</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge variant="info" size="small">{t('components.badge.small')} {t('components.badge.info')}</Badge>
          <Badge variant="info" size="medium">{t('components.badge.medium')} {t('components.badge.info')}</Badge>
          <Badge variant="info" size="large">{t('components.badge.large')} {t('components.badge.info')}</Badge>
        </div>
      </section>

      {/* Use Cases */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '16px' }}>{t('components.badge.demo.useCases')}</h2>

        <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>{t('components.badge.demo.orderStatuses')}</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Badge variant="info" dot>{t('components.badge.demo.newOrder')}</Badge>
          <Badge variant="warning" dot>{t('components.badge.demo.inProgress')}</Badge>
          <Badge variant="success" dot>{t('components.badge.demo.completed')}</Badge>
          <Badge variant="error" dot>{t('components.badge.demo.cancelled')}</Badge>
        </div>

        <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>{t('components.badge.demo.userRoles')}</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Badge variant="error" size="small">{t('components.badge.demo.admin')}</Badge>
          <Badge variant="info" size="small">{t('components.badge.demo.manager')}</Badge>
          <Badge variant="neutral" size="small">{t('components.badge.demo.user')}</Badge>
        </div>

        <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>{t('components.badge.demo.stockLevels')}</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Badge variant="success">{t('components.badge.demo.inStock')} (125)</Badge>
          <Badge variant="warning">{t('components.badge.demo.lowStock')} (5)</Badge>
          <Badge variant="error">{t('components.badge.demo.outOfStock')}</Badge>
        </div>
      </section>
    </div>
  );
};

export default BadgeDemo;
