import { default as React } from '../../../../../node_modules/react';
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
export declare const WizardProgress: React.FC<WizardProgressProps>;
export default WizardProgress;
