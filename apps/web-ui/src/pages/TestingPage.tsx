/*
 * ================================================================
 * FILE: TestingPage.tsx
 * PATH: /apps/web-ui/src/pages/TestingPage.tsx
 * DESCRIPTION: Component testing page with horizontal layout
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
 * ================================================================
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@l-kern/config';
import { Button, ArrowLeftIcon, ArrowRightIcon, Input, FormField, Select, Checkbox, RadioGroup, Badge, Spinner } from '@l-kern/ui-components';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export const TestingPage: React.FC = () => {
  const { t } = useTranslation();

  // Radio state
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [selectedLayout, setSelectedLayout] = useState<string>('');

  // Enable global keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, marginBottom: '8px' }}>🧪 {t('components.testing.title')}</h1>
          <p style={{ margin: 0, color: 'var(--theme-text-secondary, #666)' }}>
            {t('components.testing.subtitle')}
          </p>
        </div>
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--color-brand-primary, #9c27b0)' }}>
          {t('components.testing.backToHome')}
        </Link>
      </div>

      {/* Grid Layout - 2 columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px'
      }}>

        {/* Button Component */}
        <section style={{
          padding: '24px',
          border: '1px solid var(--theme-border, #e0e0e0)',
          borderRadius: '8px',
          background: 'var(--theme-card-background, #ffffff)'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '16px' }}>Button</h2>

          <h4 style={{ marginBottom: '12px' }}>{t('components.testing.variants')}</h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <Button variant="primary" size="small">{t('components.buttons.primary')}</Button>
            <Button variant="secondary" size="small">{t('components.buttons.secondary')}</Button>
            <Button variant="danger" size="small">{t('components.buttons.danger')}</Button>
            <Button variant="ghost" size="small">{t('components.buttons.ghost')}</Button>
            <Button variant="success" size="small">{t('components.buttons.success')}</Button>
          </div>

          <h4 style={{ marginBottom: '12px' }}>{t('components.testing.sizes')}</h4>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
            <Button size="small">{t('components.buttons.small')}</Button>
            <Button size="medium">{t('components.buttons.medium')}</Button>
            <Button size="large">{t('components.buttons.large')}</Button>
          </div>

          <h4 style={{ marginBottom: '12px' }}>{t('components.testing.states')}</h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <Button loading size="small">{t('common.loading')}</Button>
            <Button disabled size="small">{t('components.testing.disabled')}</Button>
            <Button fullWidth variant="primary">{t('components.testing.fullWidth')}</Button>
          </div>

          <h4 style={{ marginBottom: '12px' }}>{t('components.testing.navigationButtons')}</h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button variant="secondary" size="small" icon={<ArrowLeftIcon />}>
              {t('common.back')}
            </Button>
            <Button variant="primary" size="small" icon={<ArrowRightIcon />} iconPosition="right">
              {t('common.next')}
            </Button>
          </div>
        </section>

        {/* Badge Component */}
        <section style={{
          padding: '24px',
          border: '1px solid var(--theme-border, #e0e0e0)',
          borderRadius: '8px',
          background: 'var(--theme-card-background, #ffffff)'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '16px' }}>Badge</h2>

          <h4 style={{ marginBottom: '12px' }}>{t('components.testing.variants')}</h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <Badge variant="neutral">{t('components.badge.neutral')}</Badge>
            <Badge variant="success">{t('components.badge.success')}</Badge>
            <Badge variant="warning">{t('components.badge.warning')}</Badge>
            <Badge variant="error">{t('components.badge.error')}</Badge>
            <Badge variant="info">{t('components.badge.info')}</Badge>
          </div>

          <h4 style={{ marginBottom: '12px' }}>{t('components.testing.sizes')}</h4>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
            <Badge size="small">{t('components.badge.small')}</Badge>
            <Badge size="medium">{t('components.badge.medium')}</Badge>
            <Badge size="large">{t('components.badge.large')}</Badge>
          </div>

          <h4 style={{ marginBottom: '12px' }}>{t('components.testing.withDot')}</h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Badge variant="success" dot>{t('components.badge.active')}</Badge>
            <Badge variant="warning" dot>{t('components.badge.pending')}</Badge>
            <Badge variant="error" dot>{t('components.badge.failed')}</Badge>
          </div>
        </section>

        {/* Spinner Component */}
        <section style={{
          padding: '24px',
          border: '1px solid var(--theme-border, #e0e0e0)',
          borderRadius: '8px',
          background: 'var(--theme-card-background, #ffffff)'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '16px' }}>Spinner</h2>

          <h4 style={{ marginBottom: '12px' }}>{t('components.testing.sizes')}</h4>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
            <Spinner size="small" />
            <Spinner size="medium" />
            <Spinner size="large" />
          </div>

          <h4 style={{ marginBottom: '12px' }}>{t('components.testing.withLabel')}</h4>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
            <Spinner size="medium" label={t('common.loading')} />
            <Spinner size="large" label={t('components.testing.pleaseWait')} />
          </div>

          <h4 style={{ marginBottom: '12px' }}>{t('components.testing.customColor')}</h4>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Spinner size="medium" color="#4CAF50" />
            <Spinner size="medium" color="#f44336" />
            <Spinner size="medium" color="#ff9800" />
          </div>
        </section>

        {/* Input Component */}
        <section style={{
          padding: '24px',
          border: '1px solid var(--theme-border, #e0e0e0)',
          borderRadius: '8px',
          background: 'var(--theme-card-background, #ffffff)'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '16px' }}>Input</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Input placeholder={t('forms.placeholders.basicInput')} />
            <Input placeholder={t('forms.placeholders.email')} type="email" />
            <Input placeholder={t('forms.placeholders.password')} type="password" />
            <Input placeholder={t('components.testing.withError')} error={t('forms.errors.required')} />
            <Input placeholder={t('components.testing.withHelperText')} helperText={t('components.testing.enterYourName')} />
          </div>
        </section>

        {/* Select Component */}
        <section style={{
          padding: '24px',
          border: '1px solid var(--theme-border, #e0e0e0)',
          borderRadius: '8px',
          background: 'var(--theme-card-background, #ffffff)'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '16px' }}>Select</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Select
              placeholder={t('forms.placeholders.country')}
              options={[
                { value: 'sk', label: 'Slovakia' },
                { value: 'cz', label: 'Czech Republic' },
                { value: 'pl', label: 'Poland' }
              ]}
            />
            <Select
              placeholder={t('components.testing.withError')}
              options={[
                { value: '1', label: 'Option 1' },
                { value: '2', label: 'Option 2' }
              ]}
              error={t('forms.errors.required')}
            />
          </div>
        </section>

        {/* Checkbox Component */}
        <section style={{
          padding: '24px',
          border: '1px solid var(--theme-border, #e0e0e0)',
          borderRadius: '8px',
          background: 'var(--theme-card-background, #ffffff)'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '16px' }}>Checkbox</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Checkbox label={t('components.testing.basicCheckbox')} />
            <Checkbox label={t('forms.checkboxes.subscribeNewsletter')} helperText={t('forms.checkboxes.subscribeHelper')} />
            <Checkbox label={t('forms.checkboxes.requiredField')} error={t('forms.checkboxes.requiredError')} />
            <Checkbox label={t('components.testing.checkedByDefault')} defaultChecked />
          </div>
        </section>

        {/* Radio Component */}
        <section style={{
          padding: '24px',
          border: '1px solid var(--theme-border, #e0e0e0)',
          borderRadius: '8px',
          background: 'var(--theme-card-background, #ffffff)'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '16px' }}>RadioGroup</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <RadioGroup
              name="plan"
              label={t('forms.plans.label')}
              options={[
                { value: 'free', label: t('forms.plans.free') },
                { value: 'pro', label: t('forms.plans.pro') },
                { value: 'enterprise', label: t('forms.plans.enterprise') }
              ]}
              value={selectedPlan}
              onChange={setSelectedPlan}
            />
            <RadioGroup
              name="layout"
              label={t('forms.layout.label')}
              direction="horizontal"
              options={[
                { value: 'yes', label: t('common.yes') },
                { value: 'no', label: t('common.no') }
              ]}
              value={selectedLayout}
              onChange={setSelectedLayout}
            />
          </div>
        </section>

        {/* FormField Component - Full Width */}
        <section style={{
          gridColumn: '1 / -1',
          padding: '24px',
          border: '1px solid var(--theme-border, #e0e0e0)',
          borderRadius: '8px',
          background: 'var(--theme-card-background, #ffffff)'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '16px' }}>{t('components.testing.formExample')}</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            maxWidth: '1200px'
          }}>
            <FormField label={t('forms.username')} required htmlFor="username">
              <Input id="username" placeholder={t('forms.placeholders.username')} />
            </FormField>

            <FormField label={t('forms.email')} required htmlFor="email" helperText={t('forms.helperTexts.emailPrivacy')}>
              <Input id="email" type="email" placeholder={t('forms.placeholders.email')} />
            </FormField>

            <FormField label={t('forms.country')} htmlFor="country">
              <Select
                id="country"
                placeholder={t('forms.placeholders.country')}
                options={[
                  { value: 'sk', label: 'Slovakia' },
                  { value: 'cz', label: 'Czech' }
                ]}
              />
            </FormField>
          </div>

          <div style={{ marginTop: '16px' }}>
            <Button variant="primary">{t('common.submit')}</Button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default TestingPage;
