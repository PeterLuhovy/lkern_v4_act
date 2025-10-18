/*
 * ================================================================
 * FILE: ContactTypeStep.tsx
 * PATH: /apps/web-ui/src/demos/ContactFormWizard/ContactTypeStep.tsx
 * DESCRIPTION: Step 1 - Contact type selection (Company/Person)
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 18:15:00
 * ================================================================
 */

import React from 'react';
import { RadioGroup } from '@l-kern/ui-components';
import type { RadioOption } from '@l-kern/ui-components';

// === TYPES ===

export interface ContactTypeStepData {
  contactType: 'company' | 'person';
}

export interface ContactTypeStepProps {
  data?: ContactTypeStepData;
  onChange: (data: ContactTypeStepData) => void;
}

// === COMPONENT ===

export const ContactTypeStep: React.FC<ContactTypeStepProps> = ({ data, onChange }) => {
  const options: RadioOption[] = [
    { value: 'company', label: 'Firma' },
    { value: 'person', label: 'Fyzická osoba' },
  ];

  const handleChange = (value: string) => {
    onChange({
      contactType: value as 'company' | 'person',
    });
  };

  return (
    <div>
      <h3 style={{ marginBottom: '16px' }}>Typ kontaktu</h3>
      <p style={{ marginBottom: '24px', color: 'var(--theme-text-muted, #9e9e9e)' }}>
        Vyberte či pridávate firmu alebo fyzickú osobu.
      </p>
      <RadioGroup
        name="contactType"
        options={options}
        value={data?.contactType || 'company'}
        onChange={handleChange}
      />
    </div>
  );
};
