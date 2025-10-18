/*
 * ================================================================
 * FILE: BankingStep.tsx
 * PATH: /apps/web-ui/src/demos/ContactFormWizard/BankingStep.tsx
 * DESCRIPTION: Step 5 - Banking information
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 18:15:00
 * ================================================================
 */

import React from 'react';
import { FormField, Input } from '@l-kern/ui-components';

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
  const handleChange = (field: keyof BankingStepData, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div>
      <h3 style={{ marginBottom: '16px' }}>Bankové údaje</h3>
      <p style={{ marginBottom: '24px', color: 'var(--theme-text-muted, #9e9e9e)' }}>
        Zadajte bankové údaje pre platby (všetky polia sú nepovinné).
      </p>

      <FormField label="IBAN" helperText="Medzinárodné číslo bankového účtu">
        <Input
          value={data?.iban || ''}
          onChange={(e) => handleChange('iban', e.target.value)}
          placeholder="SK31 1200 0000 1987 4263 7541"
        />
      </FormField>

      <FormField label="SWIFT/BIC" helperText="Identifikačný kód banky" style={{ marginTop: '16px' }}>
        <Input
          value={data?.swift || ''}
          onChange={(e) => handleChange('swift', e.target.value)}
          placeholder="GIBASKBX"
        />
      </FormField>

      <FormField label="Názov banky" style={{ marginTop: '16px' }}>
        <Input
          value={data?.bankName || ''}
          onChange={(e) => handleChange('bankName', e.target.value)}
          placeholder="Slovenská sporiteľňa"
        />
      </FormField>
    </div>
  );
};
