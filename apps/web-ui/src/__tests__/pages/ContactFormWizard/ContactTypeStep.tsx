/*
 * ================================================================
 * FILE: ContactTypeStep.tsx
 * PATH: /apps/web-ui/src/demos/ContactFormWizard/ContactTypeStep.tsx
 * DESCRIPTION: Step 1 - Contact type selection (Company/Person)
 * VERSION: v2.0.0
 * UPDATED: 2025-10-19 13:00:00
 * ================================================================
 */

import React from 'react';
import { RadioGroup } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
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
  const { t } = useTranslation();

  const options: RadioOption[] = [
    { value: 'company', label: t('contactType.company') },
    { value: 'person', label: t('contactType.person') },
  ];

  const handleChange = (value: string) => {
    onChange({
      contactType: value as 'company' | 'person',
    });
  };

  return (
    <div>
      <h3 style={{ marginBottom: '16px' }}>{t('wizard.contactForm.contactType.title')}</h3>
      <p style={{ marginBottom: '24px', color: 'var(--theme-text-muted, #9e9e9e)' }}>
        {t('wizard.contactForm.contactType.description')}
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
