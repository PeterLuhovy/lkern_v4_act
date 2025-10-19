/*
 * ================================================================
 * FILE: dateUtils.ts
 * PATH: /packages/config/src/utils/dateUtils.ts
 * DESCRIPTION: Date formatting and parsing utilities (SK/EN locales)
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
 * ================================================================
 */

/**
 * Supported locales for date formatting
 */
export type DateLocale = 'sk' | 'en';

/**
 * Formats Date object to localized string
 *
 * @param date - Date object or ISO string to format
 * @param locale - Target locale ('sk' or 'en')
 * @returns Formatted date string
 *
 * @example
 * formatDate(new Date(2025, 9, 18), 'sk') // '18.10.2025'
 * formatDate(new Date(2025, 9, 18), 'en') // '2025-10-18'
 * formatDate('2025-10-18T10:30:00Z', 'sk') // '18.10.2025'
 */
export function formatDate(date: Date | string, locale: DateLocale): string {
  if (!date) return '';

  let dateObj: Date;

  if (typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = dateObj.getFullYear();

  if (locale === 'sk') {
    return `${day}.${month}.${year}`; // DD.MM.YYYY
  } else {
    return `${year}-${month}-${day}`; // YYYY-MM-DD
  }
}

/**
 * Formats Date object to localized string with time
 *
 * @param date - Date object or ISO string to format
 * @param locale - Target locale ('sk' or 'en')
 * @returns Formatted datetime string
 *
 * @example
 * formatDateTime(new Date(2025, 9, 18, 14, 30), 'sk') // '18.10.2025 14:30'
 * formatDateTime(new Date(2025, 9, 18, 14, 30), 'en') // '2025-10-18 14:30'
 */
export function formatDateTime(date: Date | string, locale: DateLocale): string {
  if (!date) return '';

  let dateObj: Date;

  if (typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  const dateStr = formatDate(dateObj, locale);

  return `${dateStr} ${hours}:${minutes}`;
}

/**
 * Parses localized date string to Date object
 *
 * @param dateString - Date string to parse
 * @param locale - Source locale ('sk' or 'en')
 * @returns Date object or null if invalid
 *
 * @example
 * parseDate('18.10.2025', 'sk') // Date(2025, 9, 18)
 * parseDate('2025-10-18', 'en') // Date(2025, 9, 18)
 * parseDate('invalid', 'sk') // null
 */
export function parseDate(dateString: string, locale: DateLocale): Date | null {
  if (!dateString) return null;

  const trimmed = dateString.trim();

  let day: number;
  let month: number;
  let year: number;

  if (locale === 'sk') {
    // Expected format: DD.MM.YYYY
    const parts = trimmed.split('.');
    if (parts.length !== 3) return null;

    day = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
    year = parseInt(parts[2], 10);
  } else {
    // Expected format: YYYY-MM-DD
    const parts = trimmed.split('-');
    if (parts.length !== 3) return null;

    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
    day = parseInt(parts[2], 10);
  }

  // Validate parsed values
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  if (day < 1 || day > 31) return null;
  if (month < 1 || month > 12) return null;
  if (year < 1000 || year > 9999) return null;

  // Create date object (month is 0-indexed in JavaScript)
  const date = new Date(year, month - 1, day);

  // Verify date is valid (handles cases like 31.02.2025)
  if (
    date.getDate() !== day ||
    date.getMonth() !== month - 1 ||
    date.getFullYear() !== year
  ) {
    return null;
  }

  return date;
}

/**
 * Validates date string format
 *
 * @param dateString - Date string to validate
 * @param locale - Locale to validate against ('sk' or 'en')
 * @returns true if valid date format
 *
 * @example
 * validateDate('18.10.2025', 'sk') // true
 * validateDate('2025-10-18', 'en') // true
 * validateDate('31.02.2025', 'sk') // false (invalid date)
 * validateDate('18-10-2025', 'sk') // false (wrong format)
 */
export function validateDate(dateString: string, locale: DateLocale): boolean {
  const parsed = parseDate(dateString, locale);
  return parsed !== null;
}

/**
 * Converts date string from one locale to another
 *
 * @param dateString - Date string to convert
 * @param fromLocale - Source locale
 * @param toLocale - Target locale
 * @returns Converted date string or empty string if invalid
 *
 * @example
 * convertDateLocale('18.10.2025', 'sk', 'en') // '2025-10-18'
 * convertDateLocale('2025-10-18', 'en', 'sk') // '18.10.2025'
 */
export function convertDateLocale(
  dateString: string,
  fromLocale: DateLocale,
  toLocale: DateLocale
): string {
  const parsed = parseDate(dateString, fromLocale);
  if (!parsed) return '';

  return formatDate(parsed, toLocale);
}

/**
 * Gets current date formatted in specified locale
 *
 * @param locale - Target locale ('sk' or 'en')
 * @returns Today's date formatted
 *
 * @example
 * getToday('sk') // '18.10.2025'
 * getToday('en') // '2025-10-18'
 */
export function getToday(locale: DateLocale): string {
  return formatDate(new Date(), locale);
}

/**
 * Checks if date string is today
 *
 * @param dateString - Date string to check
 * @param locale - Locale of the date string
 * @returns true if date is today
 *
 * @example
 * isToday('18.10.2025', 'sk') // true (if today is 18.10.2025)
 * isToday('17.10.2025', 'sk') // false
 */
export function isToday(dateString: string, locale: DateLocale): boolean {
  const parsed = parseDate(dateString, locale);
  if (!parsed) return false;

  const today = new Date();
  return (
    parsed.getDate() === today.getDate() &&
    parsed.getMonth() === today.getMonth() &&
    parsed.getFullYear() === today.getFullYear()
  );
}

/**
 * Adds days to a date
 *
 * @param date - Date object or string
 * @param days - Number of days to add (can be negative)
 * @param locale - Locale for parsing/formatting strings
 * @returns New date with added days
 *
 * @example
 * addDays(new Date(2025, 9, 18), 5, 'sk') // '23.10.2025'
 * addDays('18.10.2025', -3, 'sk') // '15.10.2025'
 */
export function addDays(date: Date | string, days: number, locale: DateLocale): string {
  let dateObj: Date | null;

  if (typeof date === 'string') {
    dateObj = parseDate(date, locale);
    if (!dateObj) return '';
  } else {
    dateObj = new Date(date);
  }

  dateObj.setDate(dateObj.getDate() + days);

  return formatDate(dateObj, locale);
}

/**
 * Calculates difference in days between two dates
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @param locale - Locale for parsing strings
 * @returns Number of days between dates (date1 - date2)
 *
 * @example
 * getDaysDifference('23.10.2025', '18.10.2025', 'sk') // 5
 * getDaysDifference('18.10.2025', '23.10.2025', 'sk') // -5
 */
export function getDaysDifference(
  date1: Date | string,
  date2: Date | string,
  locale: DateLocale
): number {
  let dateObj1: Date | null;
  let dateObj2: Date | null;

  if (typeof date1 === 'string') {
    dateObj1 = parseDate(date1, locale);
    if (!dateObj1) return 0;
  } else {
    dateObj1 = date1;
  }

  if (typeof date2 === 'string') {
    dateObj2 = parseDate(date2, locale);
    if (!dateObj2) return 0;
  } else {
    dateObj2 = date2;
  }

  const timeDiff = dateObj1.getTime() - dateObj2.getTime();
  return Math.round(timeDiff / (1000 * 60 * 60 * 24));
}
