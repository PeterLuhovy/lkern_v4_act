/*
 * ================================================================
 * FILE: ContactFormWizard.tsx
 * PATH: /apps/web-ui/src/__tests__/demos/ContactFormWizard/ContactFormWizard.tsx
 * DESCRIPTION: TESTING DEMO - 6-step contact form wizard
 * VERSION: v2.0.0
 * UPDATED: 2025-10-18 19:00:00
 *
 * NOTE: This is a TEST-ONLY demo. Uses Modal3Variants for testing all variants.
 * ================================================================
 */

import React, { useState } from 'react';
import { useModalWizard } from '@l-kern/config';
import { WizardProgress, WizardNavigation } from '@l-kern/ui-components';
import { Modal3Variants } from '../../components/Modal3Variants';
import { ContactTypeStep } from './ContactTypeStep';
import { BasicInfoStep } from './BasicInfoStep';
import { ContactDetailsStep } from './ContactDetailsStep';
import { AddressStep } from './AddressStep';
import { BankingStep } from './BankingStep';
import { SummaryStep } from './SummaryStep';
import type { ContactTypeStepData } from './ContactTypeStep';
import type { BasicInfoStepData } from './BasicInfoStep';
import type { ContactDetailsStepData } from './ContactDetailsStep';
import type { AddressStepData } from './AddressStep';
import type { BankingStepData } from './BankingStep';
import type { SummaryStepData } from './SummaryStep';

// === TYPES ===

export interface ContactFormWizardProps {
  variant?: 'centered' | 'drawer' | 'fullscreen';
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
}

interface WizardData {
  contactType?: ContactTypeStepData;
  basicInfo?: BasicInfoStepData;
  contactDetails?: ContactDetailsStepData;
  address?: AddressStepData;
  banking?: BankingStepData;
  summary?: SummaryStepData;
}

// === COMPONENT ===

export const ContactFormWizard: React.FC<ContactFormWizardProps> = ({
  variant = 'centered',
  isOpen,
  onClose,
  onComplete,
}) => {
  const [wizardData, setWizardData] = useState<WizardData>({
    contactType: { contactType: 'company' },
  });

  const wizard = useModalWizard({
    steps: [
      { id: 'type', title: 'Typ kontaktu' },
      { id: 'basic', title: 'Základné údaje' },
      { id: 'contact', title: 'Kontaktné údaje' },
      { id: 'address', title: 'Adresa' },
      { id: 'banking', title: 'Bankové údaje' },
      { id: 'summary', title: 'Zhrnutie' },
    ],
    onComplete: (finalData) => {
      onComplete(finalData);
      onClose();
    },
    onCancel: onClose,
  });

  // Update wizard data when step changes
  const handleStepData = (stepKey: keyof WizardData, stepData: any) => {
    setWizardData((prev) => ({
      ...prev,
      [stepKey]: stepData,
    }));
  };

  // Validation for each step
  const canProceedFromStep = () => {
    switch (wizard.currentStepId) {
      case 'type':
        return !!wizardData.contactType?.contactType;
      case 'basic':
        if (wizardData.contactType?.contactType === 'company') {
          return !!wizardData.basicInfo?.name;
        }
        return !!wizardData.basicInfo?.firstName && !!wizardData.basicInfo?.lastName;
      default:
        return true; // Other steps are optional
    }
  };

  // Open wizard when parent opens it
  React.useEffect(() => {
    if (isOpen && !wizard.isOpen) {
      wizard.start();
    }
  }, [isOpen]);

  // Close parent when wizard closes
  React.useEffect(() => {
    if (!wizard.isOpen && isOpen) {
      onClose();
    }
  }, [wizard.isOpen]);

  // Render current step
  const renderStep = () => {
    switch (wizard.currentStepId) {
      case 'type':
        return (
          <ContactTypeStep
            data={wizardData.contactType}
            onChange={(data) => handleStepData('contactType', data)}
          />
        );
      case 'basic':
        return (
          <BasicInfoStep
            data={wizardData.basicInfo}
            contactType={wizardData.contactType?.contactType || 'company'}
            onChange={(data) => handleStepData('basicInfo', data)}
          />
        );
      case 'contact':
        return (
          <ContactDetailsStep
            data={wizardData.contactDetails}
            onChange={(data) => handleStepData('contactDetails', data)}
          />
        );
      case 'address':
        return (
          <AddressStep
            data={wizardData.address}
            onChange={(data) => handleStepData('address', data)}
          />
        );
      case 'banking':
        return (
          <BankingStep
            data={wizardData.banking}
            onChange={(data) => handleStepData('banking', data)}
          />
        );
      case 'summary':
        return (
          <SummaryStep
            data={wizardData.summary}
            onChange={(data) => handleStepData('summary', data)}
            allData={wizardData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal3Variants
      isOpen={wizard.isOpen}
      onClose={wizard.cancel}
      variant={variant}
      size="md"
      title="Nový kontakt"
      closeOnBackdropClick={false}
      closeOnEscape={false}
      footer={
        <div style={{ width: '100%' }}>
          <WizardProgress
            currentStep={wizard.currentStep}
            totalSteps={wizard.totalSteps}
            currentStepTitle={wizard.currentStepTitle}
            variant="dots"
          />
          <WizardNavigation
            onPrevious={wizard.canGoPrevious ? wizard.previous : undefined}
            onNext={
              !wizard.isLastStep && canProceedFromStep()
                ? () => wizard.next(wizardData)
                : undefined
            }
            onComplete={
              wizard.isLastStep && canProceedFromStep()
                ? () => wizard.complete(wizardData)
                : undefined
            }
            canGoPrevious={wizard.canGoPrevious}
            canGoNext={canProceedFromStep()}
            isLastStep={wizard.isLastStep}
            isSubmitting={wizard.isSubmitting}
          />
        </div>
      }
    >
      {renderStep()}
    </Modal3Variants>
  );
};
