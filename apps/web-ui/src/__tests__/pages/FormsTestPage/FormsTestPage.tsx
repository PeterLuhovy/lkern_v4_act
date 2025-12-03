/*
 * ================================================================
 * FILE: FormsTestPage.tsx
 * PATH: /apps/web-ui/src/pages/testing/FormsTestPage/FormsTestPage.tsx
 * DESCRIPTION: Test page for form components (Button, Input, Select, Checkbox, Radio, FormField)
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
 * UPDATED: 2025-10-18 21:15:00
 * ================================================================
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation, exportToCSV, exportToJSON } from '@l-kern/config';
import { Button, ArrowLeftIcon, ArrowRightIcon, Input, FormField, Select, Checkbox, RadioGroup, Card, BasePage, ExportButton, InfoHint } from '@l-kern/ui-components';
import styles from './FormsTestPage.module.css';

export const FormsTestPage: React.FC = () => {
  const { t } = useTranslation();

  // Radio state
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [selectedLayout, setSelectedLayout] = useState<string>('');

  return (
    <BasePage>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <Link to="/testing" className={styles.backLink}>
            {t('components.testing.backToDashboard')}
          </Link>
          <h1 className={styles.title}>{t('components.testing.formComponents')}</h1>
          <p className={styles.subtitle}>
            {t('components.testing.formComponentsDescription')}
          </p>
        </div>

      {/* Grid Layout - 2 columns */}
      <div className={styles.twoColumnGrid}>

        {/* Button Component */}
        <Card variant="outlined">
          <h2 className={styles.cardTitle}>Button</h2>

          <h4 className={styles.sectionTitle}>{t('components.testing.variants')}</h4>
          <div className={styles.buttonRow}>
            <Button variant="primary" size="small">{t('components.buttons.primary')}</Button>
            <Button variant="secondary" size="small">{t('components.buttons.secondary')}</Button>
            <Button variant="danger" size="small">{t('components.buttons.danger')}</Button>
            <Button variant="danger-subtle" size="small">{t('components.buttons.dangerSubtle')}</Button>
            <Button variant="ghost" size="small">{t('components.buttons.ghost')}</Button>
            <Button variant="success" size="small">{t('components.buttons.success')}</Button>
          </div>

          <h4 className={styles.sectionTitle}>{t('components.testing.sizes')}</h4>
          <div className={styles.buttonRowAligned}>
            <Button variant="primary" size="xs">XS</Button>
            <Button variant="primary" size="small">{t('components.buttons.small')}</Button>
            <Button variant="primary" size="medium">{t('components.buttons.medium')}</Button>
            <Button variant="primary" size="large">{t('components.buttons.large')}</Button>
          </div>

          <h4 className={styles.sectionTitle}>Debug Style (XS)</h4>
          <div className={styles.buttonRow}>
            <Button variant="secondary" size="xs" debug><span role="img" aria-label="clipboard">📋</span> copy</Button>
            <Button variant="secondary" size="xs" debug><span role="img" aria-label="magnifying glass">🔍</span> search</Button>
            <Button variant="secondary" size="xs" debug><span role="img" aria-label="settings">⚙️</span> settings</Button>
          </div>

          <h4 className={styles.sectionTitle}>{t('components.testing.states')}</h4>
          <div className={styles.buttonRow}>
            <Button loading size="small">{t('common.loading')}</Button>
            <Button disabled size="small">{t('components.testing.disabled')}</Button>
            <Button fullWidth variant="primary">{t('components.testing.fullWidth')}</Button>
          </div>

          <h4 className={styles.sectionTitle}>{t('components.testing.navigationButtons')}</h4>
          <div className={styles.buttonRow}>
            <Button variant="secondary" size="small" icon={<ArrowLeftIcon />}>
              {t('common.back')}
            </Button>
            <Button variant="primary" size="small" icon={<ArrowRightIcon />} iconPosition="right">
              {t('common.next')}
            </Button>
          </div>

          <h4 className={styles.sectionTitle}>{t('components.testing.iconOnlyButtons')}</h4>
          <div className={styles.buttonRow}>
            <Button variant="ghost" size="small"><span role="img" aria-label="pencil">✏️</span></Button>
            <Button variant="danger" size="small"><span role="img" aria-label="trash">🗑️</span></Button>
            <Button variant="primary" size="small"><span role="img" aria-label="star">⭐</span></Button>
            <Button variant="secondary" size="small"><span role="img" aria-label="clipboard">📋</span></Button>
            <Button variant="success" size="small"><span role="img" aria-label="checkmark">✓</span></Button>
          </div>

          <h4 className={styles.sectionTitle}>Export Button</h4>
          <div className={styles.buttonRow}>
            <ExportButton
              onExport={(format) => {
                const sampleData = [
                  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
                  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
                  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', age: 35 },
                ];

                if (format === 'csv') {
                  exportToCSV(
                    sampleData.map(item => ({
                      ...item,
                      email: item.email,
                      age: item.age.toString(),
                    })),
                    ['ID', 'Name', 'Email', 'Age'],
                    'test_export'
                  );
                } else if (format === 'json') {
                  exportToJSON(sampleData, 'test_export');
                }
              }}
              formats={['csv', 'json']}
            />
          </div>
          <p className={styles.description}>
            Click dropdown to export sample data in CSV or JSON format
          </p>

          <h4 className={styles.sectionTitle}>{t('common.submit')}</h4>
          <div className={styles.buttonRowLast}>
            <Button variant="primary">{t('common.submit')}</Button>
          </div>
        </Card>

        {/* Input Component */}
        <Card variant="outlined">
          <h2 className={styles.cardTitle}>Input</h2>

          <div className={styles.formFieldStack}>
            <Input placeholder={t('forms.placeholders.basicInput')} fullWidth />
            <Input placeholder={t('forms.placeholders.email')} type="email" fullWidth />
            <Input placeholder={t('forms.placeholders.password')} type="password" fullWidth />
            <FormField error={t('forms.errors.required')} reserveMessageSpace>
              <Input placeholder={t('components.testing.withError')} hasError fullWidth />
            </FormField>
            <FormField helperText={t('components.testing.enterYourName')} reserveMessageSpace>
              <Input placeholder={t('components.testing.withHelperText')} fullWidth />
            </FormField>
          </div>
        </Card>

        {/* Select Component */}
        <Card variant="outlined">
          <h2 className={styles.cardTitle}>Select</h2>

          <div className={styles.formFieldStack}>
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
        </Card>

        {/* Checkbox Component */}
        <Card variant="outlined">
          <h2 className={styles.cardTitle}>Checkbox</h2>

          <div className={styles.formFieldStack}>
            <Checkbox label={t('components.testing.basicCheckbox')} />
            <Checkbox label={t('forms.checkboxes.subscribeNewsletter')} helperText={t('forms.checkboxes.subscribeHelper')} />
            <Checkbox label={t('forms.checkboxes.requiredField')} error={t('forms.checkboxes.requiredError')} />
            <Checkbox label={t('components.testing.checkedByDefault')} defaultChecked />
          </div>
        </Card>

        {/* InfoHint Component */}
        <Card variant="outlined">
          <h2 className={styles.cardTitle}>InfoHint</h2>

          <h4 className={styles.sectionTitle}>Positions</h4>
          <div className={styles.buttonRow}>
            <div className={styles.infoHintDemo}>
              <InfoHint content="Popup appears on top" position="top" />
              <span>Top</span>
            </div>
            <div className={styles.infoHintDemo}>
              <InfoHint content="Popup appears on bottom" position="bottom" />
              <span>Bottom</span>
            </div>
            <div className={styles.infoHintDemo}>
              <InfoHint content="Popup appears on left" position="left" />
              <span>Left</span>
            </div>
            <div className={styles.infoHintDemo}>
              <InfoHint content="Popup appears on right" position="right" />
              <span>Right</span>
            </div>
          </div>

          <h4 className={styles.sectionTitle}>Sizes</h4>
          <div className={styles.buttonRow}>
            <div className={styles.infoHintDemo}>
              <InfoHint content="Small info icon" size="small" />
              <span>Small</span>
            </div>
            <div className={styles.infoHintDemo}>
              <InfoHint content="Medium info icon (default)" size="medium" />
              <span>Medium</span>
            </div>
            <div className={styles.infoHintDemo}>
              <InfoHint content="Large info icon" size="large" />
              <span>Large</span>
            </div>
          </div>

          <h4 className={styles.sectionTitle}>Example: Severity vs Priority</h4>
          <div className={styles.buttonRow}>
            <div className={styles.infoHintDemo}>
              <InfoHint
                content={t('pages.issues.edit.severityVsPriorityInfo')}
                position="top"
                maxWidth={900}
              />
              <span>{t('common.info')}</span>
            </div>
          </div>
          <p className={styles.description}>
            Click the icon to show explanatory tooltip. Click outside or press Escape to close.
          </p>
        </Card>

        {/* Radio Component */}
        <Card variant="outlined">
          <h2 className={styles.cardTitle}>RadioGroup</h2>

          <div className={styles.formFieldStackLarge}>
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
        </Card>

        {/* FormField Component - Full Width */}
        <Card variant="outlined" className={styles.fullWidthCard}>
          <h2 className={styles.cardTitle}>{t('components.testing.formExample')}</h2>

          <div className={styles.formGrid}>
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

            <FormField
              label="Title with char count"
              required
              htmlFor="title-demo"
              maxLength={100}
              reserveMessageSpace
              validate={(value) => {
                if (!value || value.length < 5) {
                  return 'Minimum 5 characters required';
                }
                return undefined;
              }}
            >
              <Input id="title-demo" placeholder="Type to see char count..." />
            </FormField>
          </div>
        </Card>

      </div>
      </div>
    </BasePage>
  );
};

export default FormsTestPage;
