/*
 * ================================================================
 * FILE: TestingDashboard.tsx
 * PATH: /apps/web-ui/src/pages/testing/TestingDashboard.tsx
 * DESCRIPTION: Central testing dashboard with links to all component test pages
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
 * ================================================================
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@l-kern/config';
import { Card } from '@l-kern/ui-components';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

export const TestingDashboard: React.FC = () => {
  const { t } = useTranslation();

  // Enable global keyboard shortcuts
  useKeyboardShortcuts();

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
      path: '/utility-test',
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
  ];

  return (
    <div style={{
      padding: '60px 40px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <Link to="/" style={{
          textDecoration: 'none',
          color: 'var(--color-brand-primary, #9c27b0)',
          fontSize: '14px',
          fontWeight: 600,
          display: 'inline-block',
          marginBottom: '16px'
        }}>
          ← {t('components.testing.backToHome')}
        </Link>
        <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>
          🧪 {t('components.testing.dashboard')}
        </h1>
        <p style={{ fontSize: '20px', color: 'var(--theme-text-secondary, #666)' }}>
          {t('components.testing.dashboardSubtitle')}
        </p>
      </div>

      {/* Test Pages Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '24px'
      }}>
        {testPages.map((page) => (
          <Link
            key={page.path}
            to={page.path}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Card variant="elevated" style={{ height: '100%', transition: 'all 0.2s' }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '16px'
              }}>
                {page.icon}
              </div>
              <h3 style={{
                marginTop: 0,
                marginBottom: '12px',
                fontSize: '20px',
                color: 'var(--theme-text, #212121)'
              }}>
                {page.title}
              </h3>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: 'var(--theme-text-muted, #666)',
                lineHeight: '1.5'
              }}>
                {page.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Info Footer */}
      <Card variant="default" style={{ marginTop: '48px', textAlign: 'center' }}>
        <p style={{
          margin: 0,
          color: 'var(--theme-text-muted, #666)',
          fontSize: '14px'
        }}>
          💡 {t('components.testing.dashboardHint')}
        </p>
      </Card>
    </div>
  );
};

export default TestingDashboard;
