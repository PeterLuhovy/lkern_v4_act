/*
 * ================================================================
 * FILE: index.ts
 * PATH: /packages/config/src/utils/index.ts
 * DESCRIPTION: Main export file for utility functions
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
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
