/*
 * ================================================================
 * FILE: WizardProgress.tsx
 * PATH: /packages/ui-components/src/components/Modal/WizardProgress.tsx
 * DESCRIPTION: Progress stepper for wizard modals
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 17:45:00
 * ================================================================
 */

import React from 'react';
import { useTranslation } from '@l-kern/config';
import styles from './WizardProgress.module.css';

// === TYPES ===

export interface WizardProgressProps {
  /**
   * Current step (0-based)
   */
  currentStep: number;

  /**
   * Total number of steps
   */
  totalSteps: number;

  /**
   * Step titles (optional)
   */
  stepTitles?: string[];

  /**
   * Current step title
   */
  currentStepTitle?: string;

  /**
   * Progress display variant
   */
  variant?: 'dots' | 'bar' | 'numbers';
}

// === COMPONENT ===

/**
 * Progress indicator for multi-step wizards
 *
 * @example
 * ```tsx
 * <WizardProgress
 *   currentStep={1}
 *   totalSteps={5}
 *   currentStepTitle="Basic Info"
 *   variant="dots"
 * />
 * ```
 */
export const WizardProgress: React.FC<WizardProgressProps> = ({
  currentStep,
  totalSteps,
  stepTitles,
  currentStepTitle,
  variant = 'dots',
}) => {
  const { t } = useTranslation();

  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  return (
    <div className={styles.wizardProgress}>
      {/* Progress indicator */}
      {variant === 'dots' && (
        <div className={styles.progressDots}>
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`${styles.dot} ${
                index <= currentStep ? styles.dotActive : ''
              }`}
            />
          ))}
        </div>
      )}

      {variant === 'bar' && (
        <div className={styles.progressBar}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {variant === 'numbers' && (
        <div className={styles.progressNumbers}>
          <span className={styles.currentNumber}>{currentStep + 1}</span>
          <span className={styles.separator}>/</span>
          <span className={styles.totalNumber}>{totalSteps}</span>
        </div>
      )}

      {/* Step info */}
      <div className={styles.stepInfo}>
        <span className={styles.stepLabel}>
          {t('wizard.step') || 'Step'} {currentStep + 1}/{totalSteps}
        </span>
        {currentStepTitle && (
          <span className={styles.stepTitle}>{currentStepTitle}</span>
        )}
      </div>
    </div>
  );
};

export default WizardProgress;
