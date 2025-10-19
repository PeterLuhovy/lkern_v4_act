/*
 * ================================================================
 * FILE: WizardNavigation.test.tsx
 * PATH: /packages/ui-components/src/components/WizardNavigation/WizardNavigation.test.tsx
 * DESCRIPTION: Tests for WizardNavigation component
 * VERSION: v1.0.0
 * UPDATED: 2025-10-19 15:30:00
 * ================================================================
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WizardNavigation } from './WizardNavigation';

// Mock translation hook
vi.mock('@l-kern/config', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'wizard.previous': '← Späť',
        'wizard.next': 'Ďalej →',
        'wizard.complete': 'Uložiť',
      };
      return translations[key] || key;
    },
    language: 'sk',
  }),
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
  usePageAnalytics: (pageName: string) => ({
    session: null,
    totalTime: '0.0s',
    timeSinceLastActivity: '0.0s',
    clicks: 0,
    keys: 0,
    startSession: vi.fn(),
    endSession: vi.fn(),
    trackClick: vi.fn(),
  }),
}));

describe('WizardNavigation', () => {
  describe('button rendering', () => {
    it('should render previous and next buttons when provided', () => {
      const onPrevious = vi.fn();
      const onNext = vi.fn();

      render(
        <WizardNavigation
          onPrevious={onPrevious}
          onNext={onNext}
          canGoPrevious={true}
          canGoNext={true}
        />
      );

      expect(screen.getByText('← Späť')).toBeInTheDocument();
      expect(screen.getByText('Ďalej →')).toBeInTheDocument();
    });

    it('should render complete button on last step', () => {
      const onComplete = vi.fn();

      render(
        <WizardNavigation
          onComplete={onComplete}
          isLastStep={true}
          canGoNext={true}
        />
      );

      expect(screen.getByText('Uložiť')).toBeInTheDocument();
      expect(screen.queryByText('Ďalej →')).not.toBeInTheDocument();
    });

    it('should not render previous button when onPrevious not provided', () => {
      const onNext = vi.fn();

      render(
        <WizardNavigation
          onNext={onNext}
          canGoNext={true}
        />
      );

      expect(screen.queryByText('← Späť')).not.toBeInTheDocument();
    });

    it('should not render next button when onNext not provided', () => {
      const onPrevious = vi.fn();

      render(
        <WizardNavigation
          onPrevious={onPrevious}
          canGoPrevious={true}
        />
      );

      expect(screen.queryByText('Ďalej →')).not.toBeInTheDocument();
    });
  });

  describe('button interactions', () => {
    it('should call onPrevious when previous button clicked', async () => {
      const user = userEvent.setup();
      const onPrevious = vi.fn();

      render(
        <WizardNavigation
          onPrevious={onPrevious}
          canGoPrevious={true}
        />
      );

      await user.click(screen.getByText('← Späť'));

      expect(onPrevious).toHaveBeenCalledTimes(1);
    });

    it('should call onNext when next button clicked', async () => {
      const user = userEvent.setup();
      const onNext = vi.fn();

      render(
        <WizardNavigation
          onNext={onNext}
          canGoNext={true}
        />
      );

      await user.click(screen.getByText('Ďalej →'));

      expect(onNext).toHaveBeenCalledTimes(1);
    });

    it('should call onComplete when complete button clicked', async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();

      render(
        <WizardNavigation
          onComplete={onComplete}
          isLastStep={true}
          canGoNext={true}
        />
      );

      await user.click(screen.getByText('Uložiť'));

      expect(onComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe('button states', () => {
    it('should disable previous button when canGoPrevious is false', () => {
      const onPrevious = vi.fn();

      render(
        <WizardNavigation
          onPrevious={onPrevious}
          canGoPrevious={false}
        />
      );

      const prevButton = screen.getByText('← Späť').closest('button');
      expect(prevButton).toBeDisabled();
    });

    it('should disable next button when canGoNext is false', () => {
      const onNext = vi.fn();

      render(
        <WizardNavigation
          onNext={onNext}
          canGoNext={false}
        />
      );

      const nextButton = screen.getByText('Ďalej →').closest('button');
      expect(nextButton).toBeDisabled();
    });

    it('should disable complete button when canGoNext is false', () => {
      const onComplete = vi.fn();

      render(
        <WizardNavigation
          onComplete={onComplete}
          isLastStep={true}
          canGoNext={false}
        />
      );

      const completeButton = screen.getByText('Uložiť').closest('button');
      expect(completeButton).toBeDisabled();
    });

    it('should disable all buttons when isSubmitting is true', () => {
      const onPrevious = vi.fn();
      const onNext = vi.fn();

      render(
        <WizardNavigation
          onPrevious={onPrevious}
          onNext={onNext}
          canGoPrevious={true}
          canGoNext={true}
          isSubmitting={true}
        />
      );

      const prevButton = screen.getByText('← Späť').closest('button');
      const nextButton = screen.getByText('Ďalej →').closest('button');

      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });

    it('should show loading state on complete button when submitting', () => {
      const onComplete = vi.fn();

      render(
        <WizardNavigation
          onComplete={onComplete}
          isLastStep={true}
          canGoNext={true}
          isSubmitting={true}
        />
      );

      // When submitting, button shows "Loading..." instead of "Uložiť"
      const loadingButton = screen.getByText('Loading...').closest('button');
      expect(loadingButton).toBeDisabled();
      expect(screen.queryByText('Uložiť')).not.toBeInTheDocument();
    });
  });

  describe('custom labels', () => {
    it('should use custom previous label when provided', () => {
      const onPrevious = vi.fn();

      render(
        <WizardNavigation
          onPrevious={onPrevious}
          canGoPrevious={true}
          previousLabel="Back to Step 1"
        />
      );

      expect(screen.getByText('Back to Step 1')).toBeInTheDocument();
    });

    it('should use custom next label when provided', () => {
      const onNext = vi.fn();

      render(
        <WizardNavigation
          onNext={onNext}
          canGoNext={true}
          nextLabel="Continue to Payment"
        />
      );

      expect(screen.getByText('Continue to Payment')).toBeInTheDocument();
    });

    it('should use custom complete label when provided', () => {
      const onComplete = vi.fn();

      render(
        <WizardNavigation
          onComplete={onComplete}
          isLastStep={true}
          canGoNext={true}
          completeLabel="Finish Registration"
        />
      );

      expect(screen.getByText('Finish Registration')).toBeInTheDocument();
    });
  });

  describe('wizard scenarios', () => {
    it('should handle first step (no previous, has next)', () => {
      const onNext = vi.fn();

      render(
        <WizardNavigation
          onNext={onNext}
          canGoPrevious={false}
          canGoNext={true}
        />
      );

      expect(screen.queryByText('← Späť')).not.toBeInTheDocument();
      expect(screen.getByText('Ďalej →')).toBeInTheDocument();
    });

    it('should handle middle step (has previous, has next)', () => {
      const onPrevious = vi.fn();
      const onNext = vi.fn();

      render(
        <WizardNavigation
          onPrevious={onPrevious}
          onNext={onNext}
          canGoPrevious={true}
          canGoNext={true}
        />
      );

      expect(screen.getByText('← Späť')).toBeInTheDocument();
      expect(screen.getByText('Ďalej →')).toBeInTheDocument();
    });

    it('should handle last step (has previous, has complete)', () => {
      const onPrevious = vi.fn();
      const onComplete = vi.fn();

      render(
        <WizardNavigation
          onPrevious={onPrevious}
          onComplete={onComplete}
          canGoPrevious={true}
          canGoNext={true}
          isLastStep={true}
        />
      );

      expect(screen.getByText('← Späť')).toBeInTheDocument();
      expect(screen.getByText('Uložiť')).toBeInTheDocument();
      expect(screen.queryByText('Ďalej →')).not.toBeInTheDocument();
    });
  });
});