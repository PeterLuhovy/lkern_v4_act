/*
 * ================================================================
 * FILE: SummaryStep.tsx
 * PATH: /apps/web-ui/src/demos/ContactFormWizard/SummaryStep.tsx
 * DESCRIPTION: Step 6 - Final summary and notes
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 18:15:00
 * ================================================================
 */

import React from 'react';
import { FormField, Input, Card } from '@l-kern/ui-components';
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
  const isCompany = allData.contactType?.contactType === 'company';

  return (
    <div>
      <h3 style={{ marginBottom: '16px' }}>Zhrnutie</h3>
      <p style={{ marginBottom: '24px', color: 'var(--theme-text-muted, #9e9e9e)' }}>
        Skontrolujte údaje a pridajte poznámky.
      </p>

      {/* Summary Card */}
      <Card style={{ marginBottom: '24px', padding: '16px' }}>
        <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>
          {isCompany ? 'Firma' : 'Fyzická osoba'}
        </h4>

        {/* Basic Info */}
        {isCompany ? (
          <div>
            <div><strong>Názov:</strong> {allData.basicInfo?.name || '-'}</div>
            {allData.basicInfo?.ico && <div><strong>IČO:</strong> {allData.basicInfo.ico}</div>}
            {allData.basicInfo?.dic && <div><strong>DIČ:</strong> {allData.basicInfo.dic}</div>}
          </div>
        ) : (
          <div>
            <div>
              <strong>Meno:</strong> {allData.basicInfo?.firstName} {allData.basicInfo?.lastName}
            </div>
          </div>
        )}

        {/* Contact Details */}
        {(allData.contactDetails?.email || allData.contactDetails?.phone || allData.contactDetails?.web) && (
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--theme-border, #e0e0e0)' }}>
            {allData.contactDetails.email && <div><strong>Email:</strong> {allData.contactDetails.email}</div>}
            {allData.contactDetails.phone && <div><strong>Telefón:</strong> {allData.contactDetails.phone}</div>}
            {allData.contactDetails.web && <div><strong>Web:</strong> {allData.contactDetails.web}</div>}
          </div>
        )}

        {/* Address */}
        {(allData.address?.street || allData.address?.city || allData.address?.zip) && (
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--theme-border, #e0e0e0)' }}>
            <strong>Adresa:</strong>
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
            {allData.banking.iban && <div><strong>IBAN:</strong> {allData.banking.iban}</div>}
            {allData.banking.swift && <div><strong>SWIFT:</strong> {allData.banking.swift}</div>}
            {allData.banking.bankName && <div><strong>Banka:</strong> {allData.banking.bankName}</div>}
          </div>
        )}
      </Card>

      {/* Notes */}
      <FormField label="Poznámky" helperText="Ďalšie informácie o kontakte">
        <Input
          value={data?.notes || ''}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="Napr. VIP zákazník, preferovaný dodávateľ..."
        />
      </FormField>
    </div>
  );
};
