/*
 * ================================================================
 * FILE: SummaryStep.tsx
 * PATH: /apps/web-ui/src/demos/ContactFormWizard/SummaryStep.tsx
 * DESCRIPTION: Step 6 - Final summary and notes
 * VERSION: v2.0.0
 * UPDATED: 2025-10-19 13:00:00
 * ================================================================
 */

import React from 'react';
import { FormField, Input, Card } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import type { ContactTypeStepData } from './ContactTypeStep';
import type { BasicInfoStepData } from './BasicInfoStep';
import type { ContactDetailsStepData } from './ContactDetailsStep';
import type { AddressStepData } from './AddressStep';
import type { BankingStepData } from './BankingStep';

// === TYPES ===

export interface SummaryStepData {
  notes?: string;
}

export interface SummaryStepProps {
  data?: SummaryStepData;
  onChange: (data: SummaryStepData) => void;
  allData: {
    contactType?: ContactTypeStepData;
    basicInfo?: BasicInfoStepData;
    contactDetails?: ContactDetailsStepData;
    address?: AddressStepData;
    banking?: BankingStepData;
  };
}

// === COMPONENT ===

export const SummaryStep: React.FC<SummaryStepProps> = ({ data, onChange, allData }) => {
  const { t } = useTranslation();
  const isCompany = allData.contactType?.contactType === 'company';

  return (
    <div>
      <h3 style={{ marginBottom: '16px' }}>{t('wizard.contactForm.summary.title')}</h3>
      <p style={{ marginBottom: '24px', color: 'var(--theme-text-muted, #9e9e9e)' }}>
        {t('wizard.contactForm.summary.description')}
      </p>

      {/* Summary Card */}
      <div style={{ marginBottom: '24px' }}>
        <Card>
          <div style={{ padding: '16px' }}>
            <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>
              {isCompany ? t('contactType.company') : t('contactType.person')}
            </h4>

        {/* Basic Info */}
        {isCompany ? (
          <div>
            <div><strong>{t('fields.name')}:</strong> {allData.basicInfo?.name || '-'}</div>
            {allData.basicInfo?.ico && <div><strong>{t('fields.ico')}:</strong> {allData.basicInfo.ico}</div>}
            {allData.basicInfo?.dic && <div><strong>{t('fields.dic')}:</strong> {allData.basicInfo.dic}</div>}
          </div>
        ) : (
          <div>
            <div>
              <strong>{t('fields.fullName')}:</strong> {allData.basicInfo?.firstName} {allData.basicInfo?.lastName}
            </div>
          </div>
        )}

        {/* Contact Details */}
        {(allData.contactDetails?.email || allData.contactDetails?.phone || allData.contactDetails?.web) && (
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--theme-border, #e0e0e0)' }}>
            {allData.contactDetails.email && <div><strong>{t('fields.email')}:</strong> {allData.contactDetails.email}</div>}
            {allData.contactDetails.phone && <div><strong>{t('fields.phone')}:</strong> {allData.contactDetails.phone}</div>}
            {allData.contactDetails.web && <div><strong>{t('fields.web')}:</strong> {allData.contactDetails.web}</div>}
          </div>
        )}

        {/* Address */}
        {(allData.address?.street || allData.address?.city || allData.address?.zip) && (
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--theme-border, #e0e0e0)' }}>
            <strong>{t('wizard.contactForm.address.title')}:</strong>
            <div>
              {allData.address.street && <span>{allData.address.street}, </span>}
              {allData.address.zip && <span>{allData.address.zip} </span>}
              {allData.address.city}
            </div>
            {allData.address.country && <div>{allData.address.country}</div>}
          </div>
        )}

        {/* Banking */}
        {(allData.banking?.iban || allData.banking?.swift) && (
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--theme-border, #e0e0e0)' }}>
            {allData.banking.iban && <div><strong>{t('fields.iban')}:</strong> {allData.banking.iban}</div>}
            {allData.banking.swift && <div><strong>{t('fields.swift')}:</strong> {allData.banking.swift}</div>}
            {allData.banking.bankName && <div><strong>{t('fields.bankName')}:</strong> {allData.banking.bankName}</div>}
          </div>
        )}
          </div>
        </Card>
      </div>

      {/* Notes */}
      <FormField label={t('fields.notes')} helperText={t('helperTexts.notesHelper')}>
        <Input
          value={data?.notes || ''}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder={t('placeholders.notes')}
        />
      </FormField>
    </div>
  );
};
