/*
 * ================================================================
 * FILE: BasicInfoStep.tsx
 * PATH: /apps/web-ui/src/demos/ContactFormWizard/BasicInfoStep.tsx
 * DESCRIPTION: Step 2 - Basic company/person information
 * VERSION: v2.0.0
 * UPDATED: 2025-10-19 13:00:00
 * ================================================================
 */

import React from 'react';
import { FormField, Input } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';

// === TYPES ===

export interface BasicInfoStepData {
  name: string;
  ico?: string;
  dic?: string;
  firstName?: string;
  lastName?: string;
}

export interface BasicInfoStepProps {
  data?: BasicInfoStepData;
  contactType: 'company' | 'person';
  onChange: (data: BasicInfoStepData) => void;
}

// === COMPONENT ===

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  data,
  contactType,
  onChange,
}) => {
  const { t } = useTranslation();

  const handleChange = (field: keyof BasicInfoStepData, value: string) => {
    onChange({
      name: data?.name || '',
      ...data,
      [field]: value,
    } as BasicInfoStepData);
  };

  if (contactType === 'company') {
    return (
      <div>
        <h3 style={{ marginBottom: '16px' }}>{t('wizard.contactForm.basicInfo.titleCompany')}</h3>
        <p style={{ marginBottom: '24px', color: 'var(--theme-text-muted, #9e9e9e)' }}>
          {t('wizard.contactForm.basicInfo.descriptionCompany')}
        </p>

        <FormField label={t('fields.name')} required>
          <Input
            value={data?.name || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('name', e.target.value)}
            placeholder={t('placeholders.companyName')}
          />
        </FormField>

        <div style={{ marginTop: '16px' }}>
          <FormField label={t('fields.ico')}>
            <Input
              value={data?.ico || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('ico', e.target.value)}
              placeholder={t('placeholders.ico')}
            />
          </FormField>
        </div>

        <div style={{ marginTop: '16px' }}>
          <FormField label={t('fields.dic')}>
            <Input
              value={data?.dic || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('dic', e.target.value)}
              placeholder={t('placeholders.dic')}
            />
          </FormField>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ marginBottom: '16px' }}>{t('wizard.contactForm.basicInfo.titlePerson')}</h3>
      <p style={{ marginBottom: '24px', color: 'var(--theme-text-muted, #9e9e9e)' }}>
        {t('wizard.contactForm.basicInfo.descriptionPerson')}
      </p>

      <FormField label={t('fields.firstName')} required>
        <Input
          value={data?.firstName || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('firstName', e.target.value)}
          placeholder={t('placeholders.firstName')}
        />
      </FormField>

      <div style={{ marginTop: '16px' }}>
        <FormField label={t('fields.lastName')} required>
          <Input
            value={data?.lastName || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('lastName', e.target.value)}
            placeholder={t('placeholders.lastName')}
          />
        </FormField>
      </div>
    </div>
  );
};
