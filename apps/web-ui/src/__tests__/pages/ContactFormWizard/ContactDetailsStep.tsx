/*
 * ================================================================
 * FILE: ContactDetailsStep.tsx
 * PATH: /apps/web-ui/src/demos/ContactFormWizard/ContactDetailsStep.tsx
 * DESCRIPTION: Step 3 - Contact details (email, phone, web)
 * VERSION: v2.0.0
 * UPDATED: 2025-10-19 13:00:00
 * ================================================================
 */

import React from 'react';
import { FormField, Input } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';

// === TYPES ===

export interface ContactDetailsStepData {
  email?: string;
  phone?: string;
  web?: string;
}

export interface ContactDetailsStepProps {
  data?: ContactDetailsStepData;
  onChange: (data: ContactDetailsStepData) => void;
}

// === COMPONENT ===

export const ContactDetailsStep: React.FC<ContactDetailsStepProps> = ({ data, onChange }) => {
  const { t } = useTranslation();

  const handleChange = (field: keyof ContactDetailsStepData, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div>
      <h3 style={{ marginBottom: '16px' }}>{t('wizard.contactForm.contactDetails.title')}</h3>
      <p style={{ marginBottom: '24px', color: 'var(--theme-text-muted, #9e9e9e)' }}>
        {t('wizard.contactForm.contactDetails.description')}
      </p>

      <FormField label={t('fields.email')} helperText={t('helperTexts.emailExample')}>
        <Input
          type="email"
          value={data?.email || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('email', e.target.value)}
          placeholder={t('placeholders.email')}
        />
      </FormField>

      <div style={{ marginTop: '16px' }}>
        <FormField label={t('fields.phone')} helperText={t('helperTexts.phoneExample')}>
          <Input
            type="tel"
            value={data?.phone || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('phone', e.target.value)}
            placeholder={t('placeholders.phone')}
          />
        </FormField>
      </div>

      <div style={{ marginTop: '16px' }}>
        <FormField label={t('fields.web')} helperText={t('helperTexts.webExample')}>
          <Input
            type="url"
            value={data?.web || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('web', e.target.value)}
            placeholder={t('placeholders.web')}
          />
        </FormField>
      </div>
    </div>
  );
};
