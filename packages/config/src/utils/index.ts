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
  getPhoneCountryCode,
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
  formatDateTimeFull,
  parseDate,
  parseDateTime,
  validateDate,
  convertDateLocale,
  getToday,
  isToday,
  addDays,
  getDaysDifference,
  extractDateComponents,
  // UTC Timezone utilities
  toUTC,
  fromUTC,
  formatUserDateTime,
  getNowUTC,
  toUTCFromUserInput,
  type DateLocale,
  type DateComponents,
  type SupportedTimezone,
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

// Export utilities
export { exportToCSV, exportToJSON } from './exportUtils';
