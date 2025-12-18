import { default as React } from '../../../../../node_modules/react';
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
export declare const WizardNavigation: React.FC<WizardNavigationProps>;
export default WizardNavigation;
