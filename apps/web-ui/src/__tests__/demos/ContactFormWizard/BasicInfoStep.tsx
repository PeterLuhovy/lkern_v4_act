/*
 * ================================================================
 * FILE: BasicInfoStep.tsx
 * PATH: /apps/web-ui/src/demos/ContactFormWizard/BasicInfoStep.tsx
 * DESCRIPTION: Step 2 - Basic company/person information
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 18:15:00
 * ================================================================
 */

import React from 'react';
import { FormField, Input } from '@l-kern/ui-components';

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
        <h3 style={{ marginBottom: '16px' }}>Základné údaje firmy</h3>
        <p style={{ marginBottom: '24px', color: 'var(--theme-text-muted, #9e9e9e)' }}>
          Zadajte názov a identifikačné údaje firmy.
        </p>

        <FormField label="Názov firmy" required>
          <Input
            value={data?.name || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('name', e.target.value)}
            placeholder="Napr. ABC s.r.o."
          />
        </FormField>

        <div style={{ marginTop: '16px' }}>
          <FormField label="IČO">
            <Input
              value={data?.ico || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('ico', e.target.value)}
              placeholder="12345678"
            />
          </FormField>
        </div>

        <div style={{ marginTop: '16px' }}>
          <FormField label="DIČ">
            <Input
              value={data?.dic || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('dic', e.target.value)}
              placeholder="SK1234567890"
            />
          </FormField>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ marginBottom: '16px' }}>Základné údaje osoby</h3>
      <p style={{ marginBottom: '24px', color: 'var(--theme-text-muted, #9e9e9e)' }}>
        Zadajte meno a priezvisko.
      </p>

      <FormField label="Meno" required>
        <Input
          value={data?.firstName || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('firstName', e.target.value)}
          placeholder="Ján"
        />
      </FormField>

      <div style={{ marginTop: '16px' }}>
        <FormField label="Priezvisko" required>
          <Input
            value={data?.lastName || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('lastName', e.target.value)}
            placeholder="Novák"
          />
        </FormField>
      </div>
    </div>
  );
};
