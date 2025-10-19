/*
 * ================================================================
 * FILE: BankingStep.tsx
 * PATH: /apps/web-ui/src/demos/ContactFormWizard/BankingStep.tsx
 * DESCRIPTION: Step 5 - Banking information
 * VERSION: v2.0.0
 * UPDATED: 2025-10-19 13:00:00
 * ================================================================
 */

import React from 'react';
import { FormField, Input } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';

// === TYPES ===

export interface BankingStepData {
  iban?: string;
  swift?: string;
  bankName?: string;
}

export interface BankingStepProps {
  data?: BankingStepData;
  onChange: (data: BankingStepData) => void;
}

// === COMPONENT ===

export const BankingStep: React.FC<BankingStepProps> = ({ data, onChange }) => {
  const { t } = useTranslation();

  const handleChange = (field: keyof BankingStepData, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div>
      <h3 style={{ marginBottom: '16px' }}>{t('wizard.contactForm.banking.title')}</h3>
      <p style={{ marginBottom: '24px', color: 'var(--theme-text-muted, #9e9e9e)' }}>
        {t('wizard.contactForm.banking.description')}
      </p>

      <FormField label={t('fields.iban')} helperText={t('helperTexts.ibanHelper')}>
        <Input
          value={data?.iban || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('iban', e.target.value)}
          placeholder={t('placeholders.iban')}
        />
      </FormField>

      <div style={{ marginTop: '16px' }}>
        <FormField label={t('fields.swift')} helperText={t('helperTexts.swiftHelper')}>
          <Input
            value={data?.swift || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('swift', e.target.value)}
            placeholder={t('placeholders.swift')}
          />
        </FormField>
      </div>

      <div style={{ marginTop: '16px' }}>
        <FormField label={t('fields.bankName')}>
          <Input
            value={data?.bankName || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('bankName', e.target.value)}
            placeholder={t('placeholders.bankName')}
          />
        </FormField>
      </div>
    </div>
  );
};
