/*
 * ================================================================
 * FILE: useFormDirty.ts
 * PATH: /packages/config/src/hooks/useFormDirty/useFormDirty.ts
 * DESCRIPTION: Track unsaved form changes (initial vs current values)
 * VERSION: v1.0.0
 * UPDATED: 2025-10-20 16:00:00
 *
 * FEATURES:
 *   - Deep comparison of form values (objects, arrays, primitives)
 *   - Ignore specified fields (e.g., updated_at, internal fields)
 *   - Returns list of changed fields for granular control
 *   - Performance optimized with useMemo
 *
 * USAGE:
 *   const { isDirty, changedFields } = useFormDirty(initialData, formData, {
 *     ignoreFields: ['updated_at'],
 *   });
 *
 * PATTERN: Unsaved Changes Protection
 *   if (isDirty) {
 *     const confirmed = await confirm({
 *       title: t('confirmModal.unsavedChanges.title'),
 *       message: t('confirmModal.unsavedChanges.message'),
 *     });
 *     if (!confirmed) return;
 *   }
 * ================================================================
 */

import { useMemo } from 'react';

// ================================================================
// TYPES
// ================================================================

/**
 * Options for useFormDirty hook
 */
export interface UseFormDirtyOptions {
  /**
   * Fields to ignore when comparing values
   * @example ['updated_at', 'created_at', '_internal']
   */
  ignoreFields?: string[];

  /**
   * Use deep comparison (JSON.stringify)
   * @default true
   */
  compareDeep?: boolean;
}

/**
 * Return type for useFormDirty hook
 */
export interface UseFormDirtyResult<T> {
  /**
   * True if any field has changed
   */
  isDirty: boolean;

  /**
   * Array of field names that have changed
   */
  changedFields: (keyof T)[];
}

// ================================================================
// CONSTANTS
// ================================================================

const DEFAULT_OPTIONS: UseFormDirtyOptions = {
  ignoreFields: [],
  compareDeep: true,
};

// ================================================================
// HOOK
// ================================================================

/**
 * Track unsaved form changes
 *
 * Compares initial values with current values and returns:
 * - isDirty: boolean indicating if any field changed
 * - changedFields: array of field names that changed
 *
 * @param initialValues - Original form values (from API/database)
 * @param currentValues - Current form values (user input)
 * @param options - Configuration options
 * @returns Object with isDirty and changedFields
 *
 * @example
 * ```tsx
 * const ContactForm = () => {
 *   const [initialData, setInitialData] = useState(null);
 *   const [formData, setFormData] = useState(null);
 *
 *   const { isDirty, changedFields } = useFormDirty(initialData, formData, {
 *     ignoreFields: ['updated_at'],
 *   });
 *
 *   const handleClose = async () => {
 *     if (isDirty) {
 *       const confirmed = await confirm({
 *         title: 'Unsaved Changes',
 *         message: 'Close without saving?',
 *       });
 *       if (!confirmed) return;
 *     }
 *     onClose();
 *   };
 *
 *   return (
 *     <Modal onClose={handleClose}>
 *       <p>Changed fields: {changedFields.join(', ')}</p>
 *       <Button disabled={!isDirty}>Save</Button>
 *     </Modal>
 *   );
 * };
 * ```
 */
export function useFormDirty<T extends Record<string, any>>(
  initialValues: T | null | undefined,
  currentValues: T | null | undefined,
  options: UseFormDirtyOptions = DEFAULT_OPTIONS
): UseFormDirtyResult<T> {
  const { ignoreFields = [], compareDeep = true } = options;

  // Compute isDirty (memoized for performance)
  const isDirty = useMemo(() => {
    // Handle null/undefined
    if (!initialValues || !currentValues) {
      return false;
    }

    // Create shallow copies
    const initial = { ...initialValues };
    const current = { ...currentValues };

    // Remove ignored fields
    ignoreFields.forEach((field) => {
      delete initial[field as string];
      delete current[field as string];
    });

    // Compare values
    if (compareDeep) {
      // Deep comparison using JSON.stringify
      return JSON.stringify(initial) !== JSON.stringify(current);
    } else {
      // Shallow comparison (faster, but misses nested changes)
      return Object.keys(initial).some(
        (key) => initial[key] !== current[key]
      );
    }
  }, [initialValues, currentValues, ignoreFields, compareDeep]);

  // Compute changed fields (memoized, only if dirty)
  const changedFields = useMemo((): (keyof T)[] => {
    if (!isDirty || !initialValues || !currentValues) {
      return [];
    }

    const changed: (keyof T)[] = [];

    Object.keys(currentValues).forEach((key) => {
      // Skip ignored fields
      if (ignoreFields.includes(key)) {
        return;
      }

      // Compare values
      const initialValue = initialValues[key];
      const currentValue = currentValues[key];

      if (compareDeep) {
        // Deep comparison
        if (JSON.stringify(initialValue) !== JSON.stringify(currentValue)) {
          changed.push(key as keyof T);
        }
      } else {
        // Shallow comparison
        if (initialValue !== currentValue) {
          changed.push(key as keyof T);
        }
      }
    });

    return changed;
  }, [initialValues, currentValues, ignoreFields, compareDeep, isDirty]);

  return { isDirty, changedFields };
}
