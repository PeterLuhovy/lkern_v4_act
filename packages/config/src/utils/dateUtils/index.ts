/*
 * ================================================================
 * FILE: index.ts
 * PATH: /packages/config/src/utils/dateUtils/index.ts
 * DESCRIPTION: Barrel export for date utilities
 * VERSION: v1.0.0
 * UPDATED: 2025-10-19 15:00:00
 * ================================================================
 */

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