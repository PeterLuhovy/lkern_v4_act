/*
 * ================================================================
 * FILE: AddressStep.tsx
 * PATH: /apps/web-ui/src/demos/ContactFormWizard/AddressStep.tsx
 * DESCRIPTION: Step 4 - Address information
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 18:15:00
 * ================================================================
 */

import React from 'react';
import { FormField, Input } from '@l-kern/ui-components';

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
  const handleChange = (field: keyof AddressStepData, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div>
      <h3 style={{ marginBottom: '16px' }}>Adresa</h3>
      <p style={{ marginBottom: '24px', color: 'var(--theme-text-muted, #9e9e9e)' }}>
        Zadajte adresu kontaktu (všetky polia sú nepovinné).
      </p>

      <FormField label="Ulica a číslo">
        <Input
          value={data?.street || ''}
          onChange={(e) => handleChange('street', e.target.value)}
          placeholder="Hlavná 123"
        />
      </FormField>

      <FormField label="Mesto" style={{ marginTop: '16px' }}>
        <Input
          value={data?.city || ''}
          onChange={(e) => handleChange('city', e.target.value)}
          placeholder="Bratislava"
        />
      </FormField>

      <FormField label="PSČ" style={{ marginTop: '16px' }}>
        <Input
          value={data?.zip || ''}
          onChange={(e) => handleChange('zip', e.target.value)}
          placeholder="81101"
        />
      </FormField>

      <FormField label="Krajina" style={{ marginTop: '16px' }}>
        <Input
          value={data?.country || 'Slovensko'}
          onChange={(e) => handleChange('country', e.target.value)}
          placeholder="Slovensko"
        />
      </FormField>
    </div>
  );
};
