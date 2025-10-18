/*
 * ================================================================
 * FILE: WizardNavigation.tsx
 * PATH: /packages/ui-components/src/components/Modal/WizardNavigation.tsx
 * DESCRIPTION: Navigation buttons for wizard modals
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 17:45:00
 * ================================================================
 */

import React from 'react';
import { useTranslation } from '@l-kern/config';
import { Button } from '../Button/Button';
import styles from './WizardNavigation.module.css';

// === TYPES ===

export interface WizardNavigationProps {
  /**
   * Handler for previous button
   */
  onPrevious?: () => void;

  /**
   * Handler for next button
   */
  onNext?: () => void;

  /**
   * Handler for complete/finish button
   */
  onComplete?: () => void;

  /**
   * Whether can go to previous step
   */
  canGoPrevious?: boolean;

  /**
   * Whether can go to next step
   */
  canGoNext?: boolean;

  /**
   * Whether current step is last
   */
  isLastStep?: boolean;

  /**
   * Whether wizard is submitting
   */
  isSubmitting?: boolean;

  /**
   * Custom label for previous button
   */
  previousLabel?: string;

  /**
   * Custom label for next button
   */
  nextLabel?: string;

  /**
   * Custom label for complete button
   */
  completeLabel?: string;
}

// === COMPONENT ===

/**
 * Navigation buttons for multi-step wizards
 *
 * @example
 * ```tsx
 * <WizardNavigation
 *   onPrevious={() => wizard.previous()}
 *   onNext={() => wizard.next(formData)}
 *   onComplete={() => wizard.complete(formData)}
 *   canGoPrevious={wizard.canGoPrevious}
 *   canGoNext={isFormValid}
 *   isLastStep={wizard.isLastStep}
 * />
 * ```
 */
export const WizardNavigation: React.FC<WizardNavigationProps> = ({
  onPrevious,
  onNext,
  onComplete,
  canGoPrevious = false,
  canGoNext = true,
  isLastStep = false,
  isSubmitting = false,
  previousLabel,
  nextLabel,
  completeLabel,
}) => {
  const { t } = useTranslation();

  const prevLabel = previousLabel || t('wizard.previous') || '← Späť';
  const nextLabelText = nextLabel || t('wizard.next') || 'Ďalej →';
  const completeLabelText = completeLabel || t('wizard.complete') || 'Uložiť';

  return (
    <div className={styles.wizardNavigation}>
      {/* Previous button */}
      {onPrevious && (
        <Button
          variant="ghost"
          onClick={onPrevious}
          disabled={!canGoPrevious || isSubmitting}
        >
          {prevLabel}
        </Button>
      )}

      <div className={styles.spacer} />

      {/* Next / Complete button */}
      {isLastStep ? (
        onComplete && (
          <Button
            variant="primary"
            onClick={onComplete}
            disabled={!canGoNext || isSubmitting}
            loading={isSubmitting}
          >
            {completeLabelText}
          </Button>
        )
      ) : (
        onNext && (
          <Button
            variant="primary"
            onClick={onNext}
            disabled={!canGoNext || isSubmitting}
          >
            {nextLabelText}
          </Button>
        )
      )}
    </div>
  );
};

export default WizardNavigation;
