/*
 * ================================================================
 * FILE: SpinnerTestPage.tsx
 * PATH: /apps/web-ui/src/pages/testing/SpinnerTestPage.tsx
 * DESCRIPTION: Test page for Spinner component
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
 * ================================================================
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Spinner } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

export const SpinnerTestPage: React.FC = () => {
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
        <h1 style={{ margin: 0 }}>{t('components.testing.spinnerTitle')}</h1>
      </div>

      {/* Sizes */}
      <Card variant="outlined" style={{ marginBottom: '24px' }}>
        <h2 style={{ marginTop: 0, marginBottom: '16px' }}>{t('components.testing.sizes')}</h2>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <Spinner size="small" />
            <p style={{ marginTop: '8px', fontSize: '14px', color: 'var(--theme-text-muted, #666)' }}>
              {t('components.buttons.small')} (24px)
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner size="medium" />
            <p style={{ marginTop: '8px', fontSize: '14px', color: 'var(--theme-text-muted, #666)' }}>
              {t('components.buttons.medium')} (40px)
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner size="large" />
            <p style={{ marginTop: '8px', fontSize: '14px', color: 'var(--theme-text-muted, #666)' }}>
              {t('components.buttons.large')} (56px)
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner size="xlarge" />
            <p style={{ marginTop: '8px', fontSize: '14px', color: 'var(--theme-text-muted, #666)' }}>
              {t('components.testing.xlarge')} (72px)
            </p>
          </div>
        </div>
      </Card>

      {/* With Labels */}
      <Card variant="outlined" style={{ marginBottom: '24px' }}>
        <h2 style={{ marginTop: 0, marginBottom: '16px' }}>{t('components.testing.withLabel')}</h2>
        <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <Spinner size="small" label={t('common.loading')} />
          <Spinner size="medium" label={t('common.loading')} />
          <Spinner size="large" label={t('components.testing.pleaseWait')} />
          <Spinner size="xlarge" label={t('components.testing.processingRequest')} />
        </div>
      </Card>

      {/* Custom Colors */}
      <Card variant="outlined" style={{ marginBottom: '24px' }}>
        <h2 style={{ marginTop: 0, marginBottom: '16px' }}>{t('components.testing.customColors')}</h2>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <Spinner size="large" color="var(--color-brand-primary, #9c27b0)" />
            <p style={{ marginTop: '8px', fontSize: '14px', color: 'var(--theme-text-muted, #666)' }}>
              {t('components.testing.primary')}
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner size="large" color="var(--color-status-success, #4CAF50)" />
            <p style={{ marginTop: '8px', fontSize: '14px', color: 'var(--theme-text-muted, #666)' }}>
              {t('components.badge.success')}
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner size="large" color="var(--color-status-warning, #FF9800)" />
            <p style={{ marginTop: '8px', fontSize: '14px', color: 'var(--theme-text-muted, #666)' }}>
              {t('components.badge.warning')}
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner size="large" color="var(--color-status-error, #f44336)" />
            <p style={{ marginTop: '8px', fontSize: '14px', color: 'var(--theme-text-muted, #666)' }}>
              {t('components.badge.error')}
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner size="large" color="var(--color-status-info, #2196F3)" />
            <p style={{ marginTop: '8px', fontSize: '14px', color: 'var(--theme-text-muted, #666)' }}>
              {t('components.badge.info')}
            </p>
          </div>
        </div>
      </Card>

      {/* Use Cases */}
      <Card variant="outlined" style={{ marginBottom: '24px' }}>
        <h2 style={{ marginTop: 0, marginBottom: '16px' }}>{t('components.testing.useCases')}</h2>

        <h3 style={{ marginBottom: '12px' }}>{t('components.testing.loadingData')}</h3>
        <div style={{
          padding: '48px',
          border: '1px dashed var(--theme-border, #e0e0e0)',
          borderRadius: '8px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Spinner size="large" label={t('components.testing.loadingContacts')} />
        </div>

        <h3 style={{ marginBottom: '12px' }}>{t('components.testing.centeredContainer')}</h3>
        <div style={{
          padding: '48px',
          border: '1px dashed var(--theme-border, #e0e0e0)',
          borderRadius: '8px',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <Spinner size="medium" />
        </div>

        <h3 style={{ marginBottom: '12px' }}>{t('components.testing.inlineText')}</h3>
        <div style={{
          padding: '24px',
          border: '1px dashed var(--theme-border, #e0e0e0)',
          borderRadius: '8px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Spinner size="small" />
          <span>{t('components.testing.processingRequest')}</span>
        </div>

        <h3 style={{ marginBottom: '12px' }}>{t('components.testing.fullPageLoader')}</h3>
        <div style={{
          position: 'relative',
          height: '300px',
          border: '1px dashed var(--theme-border, #e0e0e0)',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <Spinner size="xlarge" label={t('components.testing.loadingPage')} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SpinnerTestPage;
