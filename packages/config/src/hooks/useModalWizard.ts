/*
 * ================================================================
 * FILE: useModalWizard.ts
 * PATH: /packages/config/src/hooks/useModalWizard.ts
 * DESCRIPTION: Hook for multi-step wizard workflow management
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 17:00:00
 * ================================================================
 */

import { useState, useCallback, useMemo } from 'react';

// === TYPES ===

export interface WizardStep {
  /**
   * Unique identifier for the step
   */
  id: string;

  /**
   * Display title for the step
   */
  title: string;

  /**
   * Optional validation function
   * Returns true if step data is valid
   */
  validate?: (data: any) => boolean;

  /**
   * Optional custom component for the step
   */
  component?: React.ComponentType<any>;
}

export interface UseModalWizardOptions {
  /**
   * Unique identifier for the wizard instance
   */
  id: string;

  /**
   * Array of wizard steps
   */
  steps: WizardStep[];

  /**
   * Initial step index (default: 0)
   */
  initialStep?: number;

  /**
   * Callback executed when wizard completes
   */
  onComplete?: (data: Record<string, any>) => void | Promise<void>;

  /**
   * Callback executed when wizard is cancelled
   */
  onCancel?: () => void;

  /**
   * Whether to persist data across instances
   * @default false
   */
  persistData?: boolean;
}

export interface UseModalWizardReturn {
  // === STATE ===

  /**
   * Whether wizard modal is open
   */
  isOpen: boolean;

  /**
   * Current step index (0-based)
   */
  currentStep: number;

  /**
   * Total number of steps
   */
  totalSteps: number;

  /**
   * Current step ID
   */
  currentStepId: string;

  /**
   * Accumulated data from all steps
   */
  data: Record<string, any>;

  /**
   * Whether wizard is submitting (completing)
   */
  isSubmitting: boolean;

  // === NAVIGATION ===

  /**
   * Start wizard (open modal, go to first step)
   */
  start: () => void;

  /**
   * Go to next step
   * @param stepData - Data from current step
   */
  next: (stepData?: any) => void;

  /**
   * Go to previous step
   */
  previous: () => void;

  /**
   * Jump to specific step by index
   * @param stepIndex - Target step index
   */
  jumpTo: (stepIndex: number) => void;

  /**
   * Cancel wizard (close modal, reset data)
   */
  cancel: () => void;

  /**
   * Complete wizard (execute onComplete callback)
   * @param finalStepData - Data from final step
   */
  complete: (finalStepData?: any) => void;

  // === VALIDATION ===

  /**
   * Whether can navigate to next step
   */
  canGoNext: boolean;

  /**
   * Whether can navigate to previous step
   */
  canGoPrevious: boolean;

  /**
   * Whether current step is first
   */
  isFirstStep: boolean;

  /**
   * Whether current step is last
   */
  isLastStep: boolean;

  // === PROGRESS ===

  /**
   * Progress percentage (0-100)
   */
  progress: number;

  /**
   * Current step title
   */
  currentStepTitle: string;
}

// === HOOK ===

/**
 * Hook for managing multi-step wizard workflows
 *
 * @example Basic usage
 * ```tsx
 * const wizard = useModalWizard({
 *   id: 'add-contact',
 *   steps: [
 *     { id: 'type', title: 'Contact Type' },
 *     { id: 'basic', title: 'Basic Info' },
 *     { id: 'contact', title: 'Contact Details' }
 *   ],
 *   onComplete: (data) => {
 *     console.log('Wizard completed:', data);
 *   }
 * });
 *
 * return (
 *   <>
 *     <Button onClick={wizard.start}>Add Contact</Button>
 *     <Modal isOpen={wizard.isOpen} onClose={wizard.cancel}>
 *       <WizardProgress {...wizard} />
 *       {wizard.currentStepId === 'type' && <TypeStep />}
 *       {wizard.currentStepId === 'basic' && <BasicStep />}
 *       <WizardNavigation {...wizard} />
 *     </Modal>
 *   </>
 * );
 * ```
 */
export const useModalWizard = (
  options: UseModalWizardOptions
): UseModalWizardReturn => {
  const {
    id,
    steps,
    initialStep = 0,
    onComplete,
    onCancel,
    persistData = false,
  } = options;

  // === STATE ===
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [data, setData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // === COMPUTED VALUES ===

  const totalSteps = steps.length;
  const currentStepId = steps[currentStep]?.id || '';
  const currentStepTitle = steps[currentStep]?.title || '';
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const canGoPrevious = !isFirstStep;
  const canGoNext = !isLastStep;
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  // === NAVIGATION ===

  /**
   * Start wizard - open modal and reset to first step
   */
  const start = useCallback(() => {
    setIsOpen(true);
    setCurrentStep(initialStep);
    if (!persistData) {
      setData({});
    }
    setIsSubmitting(false);
  }, [initialStep, persistData]);

  /**
   * Go to next step
   */
  const next = useCallback(
    (stepData?: any) => {
      // Merge step data into accumulated data
      if (stepData) {
        setData((prev) => ({ ...prev, ...stepData }));
      }

      // Validate current step if validator exists
      const currentStepConfig = steps[currentStep];
      if (currentStepConfig?.validate && stepData) {
        const isValid = currentStepConfig.validate(stepData);
        if (!isValid) {
          return; // Don't proceed if validation fails
        }
      }

      // Move to next step
      if (!isLastStep) {
        setCurrentStep((prev) => prev + 1);
      }
    },
    [steps, currentStep, isLastStep]
  );

  /**
   * Go to previous step
   */
  const previous = useCallback(() => {
    if (canGoPrevious) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [canGoPrevious]);

  /**
   * Jump to specific step
   */
  const jumpTo = useCallback(
    (stepIndex: number) => {
      if (stepIndex >= 0 && stepIndex < totalSteps) {
        setCurrentStep(stepIndex);
      }
    },
    [totalSteps]
  );

  /**
   * Cancel wizard - close modal and optionally reset data
   */
  const cancel = useCallback(() => {
    setIsOpen(false);
    if (!persistData) {
      setData({});
      setCurrentStep(initialStep);
    }
    setIsSubmitting(false);

    if (onCancel) {
      onCancel();
    }
  }, [persistData, initialStep, onCancel]);

  /**
   * Complete wizard - execute onComplete callback
   */
  const complete = useCallback(
    async (finalStepData?: any) => {
      // Merge final step data
      const finalData = finalStepData
        ? { ...data, ...finalStepData }
        : data;

      // Validate final step if validator exists
      const currentStepConfig = steps[currentStep];
      if (currentStepConfig?.validate && finalStepData) {
        const isValid = currentStepConfig.validate(finalStepData);
        if (!isValid) {
          return; // Don't complete if validation fails
        }
      }

      setIsSubmitting(true);

      try {
        if (onComplete) {
          await onComplete(finalData);
        }

        // Success - close modal and reset
        setIsOpen(false);
        if (!persistData) {
          setData({});
          setCurrentStep(initialStep);
        }
      } catch (error) {
        console.error('Wizard completion failed:', error);
        // Don't close modal on error - let user retry
      } finally {
        setIsSubmitting(false);
      }
    },
    [data, steps, currentStep, onComplete, persistData, initialStep]
  );

  // === RETURN ===

  return {
    // State
    isOpen,
    currentStep,
    totalSteps,
    currentStepId,
    data,
    isSubmitting,

    // Navigation
    start,
    next,
    previous,
    jumpTo,
    cancel,
    complete,

    // Validation
    canGoNext,
    canGoPrevious,
    isFirstStep,
    isLastStep,

    // Progress
    progress,
    currentStepTitle,
  };
};

export default useModalWizard;
