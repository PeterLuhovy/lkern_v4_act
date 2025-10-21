/*
 * ================================================================
 * FILE: index.ts
 * PATH: /packages/config/src/utils/phoneUtils/index.ts
 * DESCRIPTION: Barrel export for phone utilities
 * VERSION: v1.0.0
 * UPDATED: 2025-10-19 15:00:00
 * ================================================================
 */

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
