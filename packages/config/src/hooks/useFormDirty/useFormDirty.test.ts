/*
 * ================================================================
 * FILE: useFormDirty.test.ts
 * PATH: /packages/config/src/hooks/useFormDirty/useFormDirty.test.ts
 * DESCRIPTION: Tests for useFormDirty hook
 * VERSION: v1.0.0
 * UPDATED: 2025-10-20 16:00:00
 * ================================================================
 */

import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFormDirty } from './useFormDirty';

describe('useFormDirty', () => {
  // Test 1: Unchanged values return false
  it('returns isDirty=false when values are unchanged', () => {
    const initialValues = { name: 'John', age: 30 };
    const currentValues = { name: 'John', age: 30 };

    const { result } = renderHook(() =>
      useFormDirty(initialValues, currentValues)
    );

    expect(result.current.isDirty).toBe(false);
    expect(result.current.changedFields).toEqual([]);
  });

  // Test 2: Changed values return true
  it('returns isDirty=true when values change', () => {
    const initialValues = { name: 'John', age: 30 };
    const currentValues = { name: 'Jane', age: 30 };

    const { result } = renderHook(() =>
      useFormDirty(initialValues, currentValues)
    );

    expect(result.current.isDirty).toBe(true);
    expect(result.current.changedFields).toContain('name');
  });

  // Test 3: Nested object changes detected
  it('detects nested object changes', () => {
    const initialValues = {
      name: 'John',
      address: { city: 'Prague', zip: '10000' },
    };
    const currentValues = {
      name: 'John',
      address: { city: 'Bratislava', zip: '10000' },
    };

    const { result } = renderHook(() =>
      useFormDirty(initialValues, currentValues)
    );

    expect(result.current.isDirty).toBe(true);
    expect(result.current.changedFields).toContain('address');
  });

  // Test 4: Array changes detected
  it('detects array changes', () => {
    const initialValues = { tags: ['javascript', 'react'] };
    const currentValues = { tags: ['javascript', 'react', 'typescript'] };

    const { result } = renderHook(() =>
      useFormDirty(initialValues, currentValues)
    );

    expect(result.current.isDirty).toBe(true);
    expect(result.current.changedFields).toContain('tags');
  });

  // Test 5: Ignored fields work correctly
  it('ignores specified fields', () => {
    const initialValues = { name: 'John', age: 30, updated_at: '2025-01-01' };
    const currentValues = { name: 'John', age: 30, updated_at: '2025-01-02' };

    const { result } = renderHook(() =>
      useFormDirty(initialValues, currentValues, {
        ignoreFields: ['updated_at'],
      })
    );

    expect(result.current.isDirty).toBe(false);
    expect(result.current.changedFields).toEqual([]);
  });

  // Test 6: Changed fields list is accurate
  it('returns accurate list of changed fields', () => {
    const initialValues = { name: 'John', age: 30, city: 'Prague' };
    const currentValues = { name: 'Jane', age: 31, city: 'Prague' };

    const { result } = renderHook(() =>
      useFormDirty(initialValues, currentValues)
    );

    expect(result.current.isDirty).toBe(true);
    expect(result.current.changedFields).toEqual(
      expect.arrayContaining(['name', 'age'])
    );
    expect(result.current.changedFields).not.toContain('city');
  });

  // Test 7: Null/undefined handling
  it('handles null and undefined values gracefully', () => {
    // Both null
    const { result: result1 } = renderHook(() => useFormDirty(null, null));
    expect(result1.current.isDirty).toBe(false);

    // Both undefined
    const { result: result2 } = renderHook(() =>
      useFormDirty(undefined, undefined)
    );
    expect(result2.current.isDirty).toBe(false);

    // One null, one defined
    const { result: result3 } = renderHook(() =>
      useFormDirty(null, { name: 'John' })
    );
    expect(result3.current.isDirty).toBe(false);
  });

  // Test 8: Empty objects handling
  it('handles empty objects correctly', () => {
    const initialValues = {};
    const currentValues = {};

    const { result } = renderHook(() =>
      useFormDirty(initialValues, currentValues)
    );

    expect(result.current.isDirty).toBe(false);
    expect(result.current.changedFields).toEqual([]);
  });

  // Test 9: Re-renders on value changes
  it('updates when values change', () => {
    const initialValues = { name: 'John', age: 30 };
    let currentValues = { name: 'John', age: 30 };

    const { result, rerender } = renderHook(() =>
      useFormDirty(initialValues, currentValues)
    );

    // Initially not dirty
    expect(result.current.isDirty).toBe(false);

    // Change values
    currentValues = { name: 'Jane', age: 30 };
    rerender();

    // Now dirty
    expect(result.current.isDirty).toBe(true);
    expect(result.current.changedFields).toContain('name');
  });

  // Test 10: Reset when values equal again
  it('resets isDirty when values become equal', () => {
    const initialValues = { name: 'John', age: 30 };
    let currentValues = { name: 'Jane', age: 30 };

    const { result, rerender } = renderHook(() =>
      useFormDirty(initialValues, currentValues)
    );

    // Initially dirty
    expect(result.current.isDirty).toBe(true);

    // Reset values
    currentValues = { name: 'John', age: 30 };
    rerender();

    // Not dirty anymore
    expect(result.current.isDirty).toBe(false);
    expect(result.current.changedFields).toEqual([]);
  });

  // Test 11: Shallow comparison mode
  it('uses shallow comparison when compareDeep=false', () => {
    const sharedObject = { city: 'Prague' };
    const initialValues = { name: 'John', address: sharedObject };
    const currentValues = { name: 'John', address: sharedObject };

    const { result } = renderHook(() =>
      useFormDirty(initialValues, currentValues, { compareDeep: false })
    );

    // Same reference, not dirty
    expect(result.current.isDirty).toBe(false);
  });

  // Test 12: Multiple ignored fields
  it('ignores multiple fields correctly', () => {
    const initialValues = {
      name: 'John',
      age: 30,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    };
    const currentValues = {
      name: 'John',
      age: 30,
      created_at: '2025-01-02',
      updated_at: '2025-01-03',
    };

    const { result } = renderHook(() =>
      useFormDirty(initialValues, currentValues, {
        ignoreFields: ['created_at', 'updated_at'],
      })
    );

    expect(result.current.isDirty).toBe(false);
  });
});
