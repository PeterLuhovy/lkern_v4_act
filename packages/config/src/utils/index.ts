/*
 * ================================================================
 * FILE: index.ts
 * PATH: /packages/config/src/utils/index.ts
 * DESCRIPTION: Main export file for utility functions
 * VERSION: v2.0.0
 * UPDATED: 2025-10-19 15:00:00
 *
 * CHANGES:
 *   - v2.0.0: Migrated to folder structure (phoneUtils/, emailUtils/, etc.)
 * ================================================================
 */

// Phone utilities
export {
  cleanPhoneNumber,
  validateMobile,
  validateLandlineOrFax,
  formatPhoneNumber,
  detectPhoneType,
  type PhoneType,
  type PhoneCountryCode,
} from './phoneUtils';

// Email utilities
export {
  validateEmail,
  normalizeEmail,
  getEmailDomain,
  getEmailLocal,
  isEmailFromDomain,
} from './emailUtils';

// Date utilities
export {
  formatDate,
  formatDateTime,
  parseDate,
  validateDate,
  convertDateLocale,
  getToday,
  isToday,
  addDays,
  getDaysDifference,
  type DateLocale,
} from './dateUtils';

// Modal stack utility
export { modalStack } from './modalStack';

// Toast notification manager
export { toastManager, type Toast, type ToastOptions, type ToastType } from './toastManager';

// Validation utilities
export {
  debounce,
  validateField,
  type ValidationResult,
  type ValidationType,
} from './validation';
