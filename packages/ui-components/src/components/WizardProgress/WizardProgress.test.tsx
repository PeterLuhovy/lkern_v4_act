/*
 * ================================================================
 * FILE: WizardProgress.test.tsx
 * PATH: /packages/ui-components/src/components/Modal/WizardProgress.test.tsx
 * DESCRIPTION: Tests for WizardProgress component
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 18:00:00
 * ================================================================
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WizardProgress } from './WizardProgress';

// Mock useTranslation hook
vi.mock('@l-kern/config', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'wizard.step': 'Step',
      };
      return translations[key] || key;
    },
  }),
}));

describe('WizardProgress', () => {
  // === BASIC RENDERING ===

  it('renders dots variant by default', () => {
    const { container } = render(
      <WizardProgress currentStep={0} totalSteps={3} />
    );

    // Check dots are rendered
    const dots = container.querySelectorAll('[class*="dot"]');
    expect(dots.length).toBeGreaterThan(0);
  });

  it('renders bar variant', () => {
    const { container } = render(
      <WizardProgress currentStep={0} totalSteps={3} variant="bar" />
    );

    // Check progress bar is rendered
    const progressBar = container.querySelector('[class*="progressBar"]');
    expect(progressBar).toBeTruthy();
  });

  it('renders numbers variant', () => {
    const { container } = render(
      <WizardProgress currentStep={0} totalSteps={3} variant="numbers" />
    );

    // Check progress numbers are rendered
    const progressNumbers = container.querySelector('[class*="progressNumbers"]');
    expect(progressNumbers).toBeTruthy();
  });

  // === DOTS VARIANT ===

  it('renders correct number of dots', () => {
    const { container } = render(
      <WizardProgress currentStep={1} totalSteps={5} variant="dots" />
    );

    const dots = container.querySelectorAll('[class*="_dot_"]');
    expect(dots.length).toBe(5);
  });

  it('marks current and previous dots as active', () => {
    const { container } = render(
      <WizardProgress currentStep={2} totalSteps={4} variant="dots" />
    );

    const dots = container.querySelectorAll('[class*="_dot_"]');
    // currentStep is 0-based, so currentStep=2 means steps 0,1,2 are active
    expect(dots[0].className).toContain('Active');
    expect(dots[1].className).toContain('Active');
    expect(dots[2].className).toContain('Active');
    expect(dots[3].className).not.toContain('Active');
  });

  it('handles first step correctly', () => {
    const { container } = render(
      <WizardProgress currentStep={0} totalSteps={4} variant="dots" />
    );

    const dots = container.querySelectorAll('[class*="_dot_"]');
    // Only first dot should be active
    expect(dots[0].className).toContain('Active');
    expect(dots[1].className).not.toContain('Active');
  });

  // === BAR VARIANT ===

  it('shows correct progress percentage', () => {
    const { container } = render(
      <WizardProgress currentStep={1} totalSteps={4} variant="bar" />
    );

    const progressBar = container.querySelector('[class*="progressBarFill"]');
    // Step 1 (0-based, so 2nd step) of 4 = (1+1)/4 = 50%
    expect(progressBar?.getAttribute('style')).toContain('width: 50%');
  });

  it('calculates progress for first step', () => {
    const { container } = render(
      <WizardProgress currentStep={0} totalSteps={3} variant="bar" />
    );

    const progressBar = container.querySelector('[class*="progressBarFill"]');
    // Step 0 (first step) of 3 = (0+1)/3 ≈ 33.33%
    expect(progressBar?.getAttribute('style')).toContain('width: 33');
  });

  it('calculates progress for last step', () => {
    const { container } = render(
      <WizardProgress currentStep={4} totalSteps={5} variant="bar" />
    );

    const progressBar = container.querySelector('[class*="progressBarFill"]');
    // Step 4 (last step, 0-based) of 5 = (4+1)/5 = 100%
    expect(progressBar?.getAttribute('style')).toContain('width: 100%');
  });

  // === STEP INFO ===

  it('displays step count', () => {
    render(
      <WizardProgress currentStep={1} totalSteps={5} />
    );

    // currentStep is 0-based, so currentStep=1 displays as "Step 2/5"
    expect(screen.getByText(/Step 2\/5/)).toBeInTheDocument();
  });

  it('displays step title when provided', () => {
    render(
      <WizardProgress
        currentStep={0}
        totalSteps={3}
        currentStepTitle="Contact Information"
      />
    );

    expect(screen.getByText('Contact Information')).toBeInTheDocument();
  });

  it('hides step title when not provided', () => {
    const { container } = render(
      <WizardProgress currentStep={0} totalSteps={3} />
    );

    const stepTitle = container.querySelector('[class*="stepTitle"]');
    expect(stepTitle).toBe(null);
  });

  // === EDGE CASES ===

  it('handles single step wizard', () => {
    render(
      <WizardProgress currentStep={0} totalSteps={1} />
    );

    // currentStep=0 (0-based) displays as "Step 1/1"
    expect(screen.getByText(/Step 1\/1/)).toBeInTheDocument();
  });

  it('handles large number of steps', () => {
    const { container } = render(
      <WizardProgress currentStep={4} totalSteps={10} variant="dots" />
    );

    const dots = container.querySelectorAll('[class*="_dot_"]');
    expect(dots.length).toBe(10);
  });

  // === ACCESSIBILITY ===

  it('renders accessible step information', () => {
    const { container } = render(
      <WizardProgress currentStep={1} totalSteps={4} />
    );

    // Check step info is rendered with correct text
    const stepInfo = container.querySelector('[class*="stepInfo"]');
    expect(stepInfo).toBeTruthy();
    expect(stepInfo?.textContent).toContain('Step 2/4');
  });
});
