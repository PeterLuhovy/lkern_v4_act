/*
 * ================================================================
 * FILE: ContactDetailsStep.tsx
 * PATH: /apps/web-ui/src/demos/ContactFormWizard/ContactDetailsStep.tsx
 * DESCRIPTION: Step 3 - Contact details (email, phone, web)
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 18:15:00
 * ================================================================
 */

import React from 'react';
import { FormField, Input } from '@l-kern/ui-components';

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
  const handleChange = (field: keyof ContactDetailsStepData, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div>
      <h3 style={{ marginBottom: '16px' }}>Kontaktné údaje</h3>
      <p style={{ marginBottom: '24px', color: 'var(--theme-text-muted, #9e9e9e)' }}>
        Zadajte email, telefón a webovú stránku (všetky polia sú nepovinné).
      </p>

      <FormField label="Email" helperText="Napr. info@example.com">
        <Input
          type="email"
          value={data?.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="info@example.com"
        />
      </FormField>

      <div style={{ marginTop: '16px' }}>
        <FormField label="Telefón" helperText="Napr. +421 900 123 456">
          <Input
            type="tel"
            value={data?.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+421 900 123 456"
          />
        </FormField>
      </div>

      <div style={{ marginTop: '16px' }}>
        <FormField label="Web" helperText="Napr. www.example.com">
          <Input
            type="url"
            value={data?.web || ''}
            onChange={(e) => handleChange('web', e.target.value)}
            placeholder="www.example.com"
          />
        </FormField>
      </div>
    </div>
  );
};
