/*
 * ================================================================
 * FILE: validation.ts
 * PATH: /packages/config/src/utils/validation/validation.ts
 * DESCRIPTION: Validation utilities (debounce + field validation wrapper)
 * VERSION: v1.0.0
 * CREATED: 2025-10-20
 * UPDATED: 2025-10-20 16:45:00
 * ================================================================
 */

import { validateEmail } from '../emailUtils';
import { validateMobile } from '../phoneUtils';

/**
 * Validation result interface
 */
export interface ValidationResult {
  /** Whether the field value is valid */
  isValid: boolean;
  /** Error message if validation failed */
  error?: string;
  /** Warning message (field is valid but has potential issues) */
  warning?: string;
}

/**
 * Supported validation types
 */
export type ValidationType = 'email' | 'phone' | 'url' | 'required';

/**
 * Debounces a function call by delaying execution until after a specified delay
 *
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 *
 * @example
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('Searching for:', query);
 * }, 500);
 *
 * // User types "hello" quickly
 * debouncedSearch('h');    // Cancelled
 * debouncedSearch('he');   // Cancelled
 * debouncedSearch('hel');  // Cancelled
 * debouncedSearch('hell'); // Cancelled
 * debouncedSearch('hello'); // Executes after 500ms
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | undefined;

  return (...args: Parameters<T>) => {
    // Clear previous timeout if exists
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new timeout
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = undefined;
    }, delay);
  };
}

/**
 * Validates a field value based on validation type
 *
 * @param fieldName - Name of the field being validated (for error messages)
 * @param value - Value to validate
 * @param validationType - Type of validation to perform
 * @returns Promise resolving to ValidationResult
 *
 * @example
 * // Email validation
 * const result = await validateField('email', 'user@example.com', 'email');
 * // { isValid: true }
 *
 * @example
 * // Phone validation
 * const result = await validateField('phone', '+421902123456', 'phone');
 * // { isValid: true }
 *
 * @example
 * // URL validation
 * const result = await validateField('url', 'https://example.com', 'url');
 * // { isValid: true }
 *
 * @example
 * // Required validation
 * const result = await validateField('name', '', 'required');
 * // { isValid: false, error: 'Field "name" is required' }
 */
export async function validateField(
  fieldName: string,
  value: any,
  validationType?: ValidationType
): Promise<ValidationResult> {
  // No validation type specified - always valid
  if (!validationType) {
    return { isValid: true };
  }

  // Required field validation
  if (validationType === 'required') {
    const isEmpty = value === null || value === undefined || value === '';
    return {
      isValid: !isEmpty,
      error: isEmpty ? `Field "${fieldName}" is required` : undefined,
    };
  }

  // Email validation
  if (validationType === 'email') {
    const isValid = validateEmail(value);
    return {
      isValid,
      error: isValid ? undefined : 'Invalid email format',
    };
  }

  // Phone validation
  if (validationType === 'phone') {
    const isValid = validateMobile(value);
    return {
      isValid,
      error: isValid ? undefined : 'Invalid phone number',
    };
  }

  // URL validation
  if (validationType === 'url') {
    try {
      new URL(value);
      return { isValid: true };
    } catch {
      return { isValid: false, error: 'Invalid URL format' };
    }
  }

  // Unknown validation type - always valid
  return { isValid: true };
}
