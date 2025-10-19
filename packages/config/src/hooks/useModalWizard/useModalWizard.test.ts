/*
 * ================================================================
 * FILE: useModalWizard.test.ts
 * PATH: /packages/config/src/hooks/useModalWizard.test.ts
 * DESCRIPTION: Tests for useModalWizard hook
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 17:00:00
 * ================================================================
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useModalWizard, type WizardStep } from './useModalWizard';

// === TEST DATA ===

const mockSteps: WizardStep[] = [
  { id: 'step1', title: 'Step 1' },
  { id: 'step2', title: 'Step 2' },
  { id: 'step3', title: 'Step 3' },
];

describe('useModalWizard', () => {
  // === INITIALIZATION TESTS ===

  it('should initialize with default state', () => {
    const { result } = renderHook(() =>
      useModalWizard({
        id: 'test-wizard',
        steps: mockSteps,
      })
    );

    expect(result.current.isOpen).toBe(false);
    expect(result.current.currentStep).toBe(0);
    expect(result.current.totalSteps).toBe(3);
    expect(result.current.currentStepId).toBe('step1');
    expect(result.current.currentStepTitle).toBe('Step 1');
    expect(result.current.data).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should initialize with custom initial step', () => {
    const { result } = renderHook(() =>
      useModalWizard({
        id: 'test-wizard',
        steps: mockSteps,
        initialStep: 1,
      })
    );

    expect(result.current.currentStep).toBe(1);
    expect(result.current.currentStepId).toBe('step2');
  });

  // === NAVIGATION TESTS ===

  it('should start wizard', () => {
    const { result } = renderHook(() =>
      useModalWizard({
        id: 'test-wizard',
        steps: mockSteps,
      })
    );

    act(() => {
      result.current.start();
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.currentStep).toBe(0);
  });

  it('should navigate to next step', () => {
    const { result } = renderHook(() =>
      useModalWizard({
        id: 'test-wizard',
        steps: mockSteps,
      })
    );

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.next();
    });

    expect(result.current.currentStep).toBe(1);
    expect(result.current.currentStepId).toBe('step2');
  });

  it('should navigate to previous step', () => {
    const { result } = renderHook(() =>
      useModalWizard({
        id: 'test-wizard',
        steps: mockSteps,
        initialStep: 1,
      })
    );

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.previous();
    });

    expect(result.current.currentStep).toBe(0);
    expect(result.current.currentStepId).toBe('step1');
  });

  it('should not go to previous step from first step', () => {
    const { result } = renderHook(() =>
      useModalWizard({
        id: 'test-wizard',
        steps: mockSteps,
      })
    );

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.previous();
    });

    expect(result.current.currentStep).toBe(0);
  });

  it('should not go to next step from last step', () => {
    const { result } = renderHook(() =>
      useModalWizard({
        id: 'test-wizard',
        steps: mockSteps,
        initialStep: 2,
      })
    );

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.next();
    });

    expect(result.current.currentStep).toBe(2); // Still on last step
  });

  it('should jump to specific step', () => {
    const { result } = renderHook(() =>
      useModalWizard({
        id: 'test-wizard',
        steps: mockSteps,
      })
    );

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.jumpTo(2);
    });

    expect(result.current.currentStep).toBe(2);
    expect(result.current.currentStepId).toBe('step3');
  });

  it('should not jump to invalid step index', () => {
    const { result } = renderHook(() =>
      useModalWizard({
        id: 'test-wizard',
        steps: mockSteps,
      })
    );

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.jumpTo(99);
    });

    expect(result.current.currentStep).toBe(0); // Stays on current step
  });

  // === DATA ACCUMULATION TESTS ===

  it('should accumulate data from steps', () => {
    const { result } = renderHook(() =>
      useModalWizard({
        id: 'test-wizard',
        steps: mockSteps,
      })
    );

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.next({ name: 'John' });
    });

    act(() => {
      result.current.next({ age: 30 });
    });

    expect(result.current.data).toEqual({
      name: 'John',
      age: 30,
    });
  });

  it('should merge overlapping data keys', () => {
    const { result } = renderHook(() =>
      useModalWizard({
        id: 'test-wizard',
        steps: mockSteps,
      })
    );

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.next({ name: 'John', email: 'john@example.com' });
    });

    act(() => {
      result.current.next({ name: 'Jane' }); // Override name
    });

    expect(result.current.data).toEqual({
      name: 'Jane', // Updated
      email: 'john@example.com', // Preserved
    });
  });

  // === VALIDATION TESTS ===

  it('should validate step data before proceeding', () => {
    const stepsWithValidation: WizardStep[] = [
      {
        id: 'step1',
        title: 'Step 1',
        validate: (data) => data.name?.length > 0,
      },
      { id: 'step2', title: 'Step 2' },
    ];

    const { result } = renderHook(() =>
      useModalWizard({
        id: 'test-wizard',
        steps: stepsWithValidation,
      })
    );

    act(() => {
      result.current.start();
    });

    // Try to proceed with invalid data
    act(() => {
      result.current.next({ name: '' });
    });

    expect(result.current.currentStep).toBe(0); // Still on step 1

    // Proceed with valid data
    act(() => {
      result.current.next({ name: 'John' });
    });

    expect(result.current.currentStep).toBe(1); // Moved to step 2
  });

  // === CANCEL TESTS ===

  it('should cancel wizard and close modal', () => {
    const onCancel = vi.fn();
    const { result } = renderHook(() =>
      useModalWizard({
        id: 'test-wizard',
        steps: mockSteps,
        onCancel,
      })
    );

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.next({ name: 'John' });
    });

    act(() => {
      result.current.cancel();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.data).toEqual({}); // Data reset
    expect(result.current.currentStep).toBe(0); // Reset to first step
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should persist data when persistData is true', () => {
    const { result } = renderHook(() =>
      useModalWizard({
        id: 'test-wizard',
        steps: mockSteps,
        persistData: true,
      })
    );

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.next({ name: 'John' });
    });

    act(() => {
      result.current.cancel();
    });

    expect(result.current.data).toEqual({ name: 'John' }); // Data persisted
  });

  // === COMPLETE TESTS ===

  it('should complete wizard and call onComplete', async () => {
    const onComplete = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useModalWizard({
        id: 'test-wizard',
        steps: mockSteps,
        onComplete,
      })
    );

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.next({ name: 'John' });
    });

    act(() => {
      result.current.next({ age: 30 });
    });

    await act(async () => {
      await result.current.complete({ email: 'john@example.com' });
    });

    expect(onComplete).toHaveBeenCalledWith({
      name: 'John',
      age: 30,
      email: 'john@example.com',
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('should not close modal if onComplete throws error', async () => {
    const onComplete = vi.fn().mockRejectedValue(new Error('Save failed'));
    const { result } = renderHook(() =>
      useModalWizard({
        id: 'test-wizard',
        steps: mockSteps,
        onComplete,
      })
    );

    act(() => {
      result.current.start();
    });

    await act(async () => {
      await result.current.complete({ name: 'John' });
    });

    expect(result.current.isOpen).toBe(true); // Modal still open
    expect(result.current.isSubmitting).toBe(false); // Submitting stopped
  });

  // === PROGRESS TESTS ===

  it('should calculate progress percentage', () => {
    const { result } = renderHook(() =>
      useModalWizard({
        id: 'test-wizard',
        steps: mockSteps,
      })
    );

    act(() => {
      result.current.start();
    });

    expect(result.current.progress).toBeCloseTo(33.33); // 1/3

    act(() => {
      result.current.next();
    });

    expect(result.current.progress).toBeCloseTo(66.67); // 2/3

    act(() => {
      result.current.next();
    });

    expect(result.current.progress).toBe(100); // 3/3
  });

  // === STEP STATUS TESTS ===

  it('should correctly identify first and last steps', () => {
    const { result } = renderHook(() =>
      useModalWizard({
        id: 'test-wizard',
        steps: mockSteps,
      })
    );

    act(() => {
      result.current.start();
    });

    expect(result.current.isFirstStep).toBe(true);
    expect(result.current.isLastStep).toBe(false);
    expect(result.current.canGoPrevious).toBe(false);
    expect(result.current.canGoNext).toBe(true);

    act(() => {
      result.current.jumpTo(2);
    });

    expect(result.current.isFirstStep).toBe(false);
    expect(result.current.isLastStep).toBe(true);
    expect(result.current.canGoPrevious).toBe(true);
    expect(result.current.canGoNext).toBe(false);
  });

  // === INTEGRATION TESTS ===

  it('should handle complete wizard workflow', async () => {
    const onComplete = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useModalWizard({
        id: 'test-wizard',
        steps: mockSteps,
        onComplete,
      })
    );

    // Start wizard
    act(() => {
      result.current.start();
    });
    expect(result.current.isOpen).toBe(true);
    expect(result.current.currentStepId).toBe('step1');

    // Step 1 → Step 2
    act(() => {
      result.current.next({ type: 'company' });
    });
    expect(result.current.currentStepId).toBe('step2');

    // Step 2 → Step 3
    act(() => {
      result.current.next({ name: 'ACME Corp' });
    });
    expect(result.current.currentStepId).toBe('step3');

    // Complete
    await act(async () => {
      await result.current.complete({ email: 'info@acme.com' });
    });

    expect(onComplete).toHaveBeenCalledWith({
      type: 'company',
      name: 'ACME Corp',
      email: 'info@acme.com',
    });
    expect(result.current.isOpen).toBe(false);
  });
});
