/*
 * ================================================================
 * FILE: AddressStep.tsx
 * PATH: /apps/web-ui/src/demos/ContactFormWizard/AddressStep.tsx
 * DESCRIPTION: Step 4 - Address information
 * VERSION: v2.0.0
 * UPDATED: 2025-10-19 13:00:00
 * ================================================================
 */

import React from 'react';
import { FormField, Input } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';

// === TYPES ===

export interface AddressStepData {
  street?: string;
  city?: string;
  zip?: string;
  country?: string;
}

export interface AddressStepProps {
  data?: AddressStepData;
  onChange: (data: AddressStepData) => void;
}

// === COMPONENT ===

export const AddressStep: React.FC<AddressStepProps> = ({ data, onChange }) => {
  const { t } = useTranslation();

  const handleChange = (field: keyof AddressStepData, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div>
      <h3 style={{ marginBottom: '16px' }}>{t('wizard.contactForm.address.title')}</h3>
      <p style={{ marginBottom: '24px', color: 'var(--theme-text-muted, #9e9e9e)' }}>
        {t('wizard.contactForm.address.description')}
      </p>

      <FormField label={t('fields.street')}>
        <Input
          value={data?.street || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('street', e.target.value)}
          placeholder={t('placeholders.street')}
        />
      </FormField>

      <div style={{ marginTop: '16px' }}>
        <FormField label={t('fields.city')}>
          <Input
            value={data?.city || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('city', e.target.value)}
            placeholder={t('placeholders.city')}
          />
        </FormField>
      </div>

      <div style={{ marginTop: '16px' }}>
        <FormField label={t('fields.zip')}>
          <Input
            value={data?.zip || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('zip', e.target.value)}
            placeholder={t('placeholders.zip')}
          />
        </FormField>
      </div>

      <div style={{ marginTop: '16px' }}>
        <FormField label={t('fields.country')}>
          <Input
            value={data?.country || t('placeholders.country')}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('country', e.target.value)}
            placeholder={t('placeholders.country')}
          />
        </FormField>
      </div>
    </div>
  );
};
