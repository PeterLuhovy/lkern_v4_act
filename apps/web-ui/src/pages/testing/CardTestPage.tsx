/*
 * ================================================================
 * FILE: CardTestPage.tsx
 * PATH: /apps/web-ui/src/pages/testing/CardTestPage.tsx
 * DESCRIPTION: Test page for Card component variants
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
 * ================================================================
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

export const CardTestPage: React.FC = () => {
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
        <h1 style={{ margin: 0 }}>{t('components.testing.cardTitle')}</h1>
      </div>

      {/* Variants */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '16px' }}>{t('components.testing.variants')}</h2>
        <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
          <Card variant="default">
            <h3 style={{ margin: '0 0 8px 0' }}>{t('components.card.defaultVariant')}</h3>
            <p style={{ margin: 0, color: 'var(--theme-text-muted, #666)' }}>
              {t('components.card.defaultDescription')}
            </p>
          </Card>

          <Card variant="outlined">
            <h3 style={{ margin: '0 0 8px 0' }}>{t('components.card.outlinedVariant')}</h3>
            <p style={{ margin: 0, color: 'var(--theme-text-muted, #666)' }}>
              {t('components.card.outlinedDescription')}
            </p>
          </Card>

          <Card variant="elevated">
            <h3 style={{ margin: '0 0 8px 0' }}>{t('components.card.elevatedVariant')}</h3>
            <p style={{ margin: 0, color: 'var(--theme-text-muted, #666)' }}>
              {t('components.card.elevatedDescription')}
            </p>
          </Card>
        </div>
      </section>

      {/* Clickable Cards */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '16px' }}>{t('components.card.clickableTitle')}</h2>
        <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
          <Card variant="outlined" onClick={() => alert(t('components.card.clickedMessage'))}>
            <h3 style={{ margin: '0 0 8px 0' }}>{t('components.card.clickableCard')}</h3>
            <p style={{ margin: 0, color: 'var(--theme-text-muted, #666)' }}>
              {t('components.card.clickableDescription')}
            </p>
          </Card>

          <Card variant="elevated" onClick={() => alert(t('components.card.elevatedClickedMessage'))}>
            <h3 style={{ margin: '0 0 8px 0' }}>{t('components.card.elevatedClickableCard')}</h3>
            <p style={{ margin: 0, color: 'var(--theme-text-muted, #666)' }}>
              {t('components.card.elevatedClickableDescription')}
            </p>
          </Card>
        </div>
      </section>

      {/* Nested Content */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '16px' }}>{t('components.testing.nestedContentExamples')}</h2>
        <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
          <Card variant="outlined">
            <h3 style={{ margin: '0 0 16px 0' }}>{t('components.card.cardWithList')}</h3>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>{t('components.card.item')} 1</li>
              <li>{t('components.card.item')} 2</li>
              <li>{t('components.card.item')} 3</li>
            </ul>
          </Card>

          <Card variant="default">
            <h3 style={{ margin: '0 0 16px 0' }}>{t('components.card.cardWithButtons')}</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{
                padding: '8px 16px',
                border: '1px solid var(--color-brand-primary, #9c27b0)',
                borderRadius: '6px',
                background: 'var(--color-brand-primary, #9c27b0)',
                color: 'white',
                cursor: 'pointer'
              }}>
                {t('common.save')}
              </button>
              <button style={{
                padding: '8px 16px',
                border: '1px solid var(--color-brand-primary, #9c27b0)',
                borderRadius: '6px',
                background: 'transparent',
                color: 'var(--color-brand-primary, #9c27b0)',
                cursor: 'pointer'
              }}>
                {t('common.cancel')}
              </button>
            </div>
          </Card>
        </div>
      </section>

      {/* Grid Layout */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '16px' }}>{t('components.testing.gridLayoutExample')}</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px'
        }}>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <Card key={num} variant="outlined">
              <h3 style={{ margin: '0 0 8px 0' }}>{t('components.card.cardNumber', { number: num })}</h3>
              <p style={{ margin: 0, color: 'var(--theme-text-muted, #666)' }}>
                {t('components.card.exampleCardInGrid')}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CardTestPage;
