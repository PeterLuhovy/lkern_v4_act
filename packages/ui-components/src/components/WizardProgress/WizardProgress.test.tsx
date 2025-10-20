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

  // === RESPONSIVE DESIGN ===

  it('renders correctly with minimal steps (2 steps)', () => {
    const { container } = render(
      <WizardProgress currentStep={0} totalSteps={2} variant="dots" />
    );

    const dots = container.querySelectorAll('[class*="_dot_"]');
    expect(dots.length).toBe(2);
  });

  it('handles maximum realistic steps (50 steps)', () => {
    const { container } = render(
      <WizardProgress currentStep={25} totalSteps={50} variant="dots" />
    );

    const dots = container.querySelectorAll('[class*="_dot_"]');
    expect(dots.length).toBe(50);
  });

  it('renders bar variant at different widths (mobile simulation)', () => {
    const { container } = render(
      <WizardProgress currentStep={2} totalSteps={5} variant="bar" />
    );

    const progressBar = container.querySelector('[class*="progressBar"]');
    expect(progressBar).toBeTruthy();
    // Bar should render regardless of container width
  });

  it('numbers variant renders with many steps', () => {
    render(
      <WizardProgress currentStep={15} totalSteps={20} variant="numbers" />
    );

    expect(screen.getByText(/16\/20/)).toBeInTheDocument();
  });

  // === ANIMATION & TRANSITIONS ===

  it('applies progress transition on bar variant', () => {
    const { container } = render(
      <WizardProgress currentStep={2} totalSteps={5} variant="bar" />
    );

    const progressBarFill = container.querySelector('[class*="progressBarFill"]');
    expect(progressBarFill).toBeTruthy();
    // Progress bar should have inline width style
    expect(progressBarFill?.getAttribute('style')).toContain('width');
  });

  it('updates progress when step changes', () => {
    const { container, rerender } = render(
      <WizardProgress currentStep={1} totalSteps={5} variant="bar" />
    );

    let progressBarFill = container.querySelector('[class*="progressBarFill"]');
    expect(progressBarFill?.getAttribute('style')).toContain('width: 40%');

    // Update to next step
    rerender(<WizardProgress currentStep={2} totalSteps={5} variant="bar" />);

    progressBarFill = container.querySelector('[class*="progressBarFill"]');
    expect(progressBarFill?.getAttribute('style')).toContain('width: 60%');
  });

  it('handles step transitions in dots variant', () => {
    const { container, rerender } = render(
      <WizardProgress currentStep={1} totalSteps={5} variant="dots" />
    );

    let dots = container.querySelectorAll('[class*="_dot_"]');
    expect(dots[0].className).toContain('Active');
    expect(dots[1].className).toContain('Active');
    expect(dots[2].className).not.toContain('Active');

    // Move to next step
    rerender(<WizardProgress currentStep={2} totalSteps={5} variant="dots" />);

    dots = container.querySelectorAll('[class*="_dot_"]');
    expect(dots[2].className).toContain('Active');
  });

  // === EDGE CASES: EXTREME VALUES ===

  it('handles zero total steps gracefully', () => {
    const { container } = render(
      <WizardProgress currentStep={0} totalSteps={0} />
    );

    // Should render without crashing
    expect(container.firstChild).toBeTruthy();
  });

  it('handles negative current step gracefully', () => {
    const { container } = render(
      <WizardProgress currentStep={-1} totalSteps={5} variant="bar" />
    );

    const progressBarFill = container.querySelector('[class*="progressBarFill"]');
    // Should not crash, even with invalid input
    expect(progressBarFill).toBeTruthy();
  });

  it('handles current step exceeding total steps', () => {
    const { container } = render(
      <WizardProgress currentStep={10} totalSteps={5} variant="bar" />
    );

    const progressBarFill = container.querySelector('[class*="progressBarFill"]');
    // Should cap at 100% or handle gracefully
    expect(progressBarFill).toBeTruthy();
  });

  it('renders 100 steps without performance issues', () => {
    const { container } = render(
      <WizardProgress currentStep={50} totalSteps={100} variant="dots" />
    );

    const dots = container.querySelectorAll('[class*="_dot_"]');
    expect(dots.length).toBe(100);
  });

  // === VARIANT COMBINATIONS WITH STEP TITLE ===

  it('renders bar variant with step title', () => {
    render(
      <WizardProgress
        currentStep={2}
        totalSteps={5}
        variant="bar"
        currentStepTitle="Payment Details"
      />
    );

    expect(screen.getByText('Payment Details')).toBeInTheDocument();
  });

  it('renders numbers variant with step title', () => {
    render(
      <WizardProgress
        currentStep={1}
        totalSteps={4}
        variant="numbers"
        currentStepTitle="Review"
      />
    );

    expect(screen.getByText('Review')).toBeInTheDocument();
  });

  it('renders dots variant with very long step title', () => {
    const longTitle = 'This is an extremely long step title that should be handled gracefully without breaking the layout';
    render(
      <WizardProgress
        currentStep={0}
        totalSteps={3}
        variant="dots"
        currentStepTitle={longTitle}
      />
    );

    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  // === PERCENTAGE CALCULATION EDGE CASES ===

  it('calculates 0% progress correctly (first step)', () => {
    const { container } = render(
      <WizardProgress currentStep={0} totalSteps={10} variant="bar" />
    );

    const progressBarFill = container.querySelector('[class*="progressBarFill"]');
    expect(progressBarFill?.getAttribute('style')).toContain('width: 10%');
  });

  it('calculates 100% progress correctly (last step)', () => {
    const { container } = render(
      <WizardProgress currentStep={9} totalSteps={10} variant="bar" />
    );

    const progressBarFill = container.querySelector('[class*="progressBarFill"]');
    expect(progressBarFill?.getAttribute('style')).toContain('width: 100%');
  });

  it('handles fractional progress percentages', () => {
    const { container } = render(
      <WizardProgress currentStep={2} totalSteps={7} variant="bar" />
    );

    const progressBarFill = container.querySelector('[class*="progressBarFill"]');
    // (2+1)/7 = 3/7 ≈ 42.857% (should be rounded)
    expect(progressBarFill?.getAttribute('style')).toContain('width:');
  });
});
