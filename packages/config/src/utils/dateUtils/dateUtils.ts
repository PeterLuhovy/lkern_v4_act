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
 * Formats Date object to localized string with time including seconds and milliseconds
 *
 * @param date - Date object or ISO string to format
 * @param locale - Target locale ('sk' or 'en')
 * @returns Formatted datetime string with full precision
 *
 * @example
 * formatDateTimeFull(new Date(2025, 9, 18, 14, 30, 45, 123), 'sk') // '18.10.2025 14:30:45.123'
 * formatDateTimeFull(new Date(2025, 9, 18, 14, 30, 45, 123), 'en') // '2025-10-18 14:30:45.123'
 */
export function formatDateTimeFull(date: Date | string, locale: DateLocale): string {
  if (!date) return '';

  let dateObj: Date | null;

  if (typeof date === 'string') {
    // Try to parse as localized datetime first
    dateObj = parseDateTime(date, locale);
    // If that fails, try ISO string
    if (!dateObj) {
      const isoDate = new Date(date);
      if (!isNaN(isoDate.getTime())) {
        dateObj = isoDate;
      }
    }
  } else {
    dateObj = date;
  }

  // Check if date is valid
  if (!dateObj || isNaN(dateObj.getTime())) {
    return '';
  }

  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');
  const milliseconds = String(dateObj.getMilliseconds()).padStart(3, '0');

  const dateStr = formatDate(dateObj, locale);

  return `${dateStr} ${hours}:${minutes}:${seconds}.${milliseconds}`;
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
 * Parses localized datetime string to Date object
 *
 * @param dateTimeString - DateTime string to parse (supports both date-only and datetime formats)
 * @param locale - Source locale ('sk' or 'en')
 * @returns Date object or null if invalid
 *
 * @example
 * parseDateTime('18.10.2025 14:30', 'sk') // Date(2025, 9, 18, 14, 30)
 * parseDateTime('2025-10-18 14:30', 'en') // Date(2025, 9, 18, 14, 30)
 * parseDateTime('18.10.2025', 'sk') // Date(2025, 9, 18, 0, 0) - time defaults to 00:00
 */
export function parseDateTime(dateTimeString: string, locale: DateLocale): Date | null {
  if (!dateTimeString) return null;

  const trimmed = dateTimeString.trim();

  // Split by space to separate date and time parts
  const parts = trimmed.split(' ');
  const datePart = parts[0];
  const timePart = parts[1]; // May be undefined if no time provided

  // Parse date part using existing parseDate function
  const date = parseDate(datePart, locale);
  if (!date) return null;

  // If time part exists, parse it
  if (timePart) {
    const timeComponents = timePart.split(':');
    if (timeComponents.length >= 2) {
      const hours = parseInt(timeComponents[0], 10);
      const minutes = parseInt(timeComponents[1], 10);

      // Parse seconds and milliseconds (format: "45.123" or "45")
      let seconds = 0;
      let milliseconds = 0;

      if (timeComponents[2]) {
        const secondsAndMs = timeComponents[2].split('.');
        seconds = parseInt(secondsAndMs[0], 10);
        if (secondsAndMs[1]) {
          // Pad milliseconds to 3 digits if needed
          const msStr = secondsAndMs[1].padEnd(3, '0').substring(0, 3);
          milliseconds = parseInt(msStr, 10);
        }
      }

      // Validate time values
      if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return null;
      if (hours < 0 || hours > 23) return null;
      if (minutes < 0 || minutes > 59) return null;
      if (seconds < 0 || seconds > 59) return null;
      if (milliseconds < 0 || milliseconds > 999) return null;

      // Set time on the date object
      date.setHours(hours, minutes, seconds, milliseconds);
    }
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
  // Check if input contains time component (has space and colon)
  const hasTime = dateString.includes(' ') && dateString.includes(':');

  // Use appropriate parser
  const parsed = hasTime
    ? parseDateTime(dateString, fromLocale)
    : parseDate(dateString, fromLocale);

  if (!parsed) return '';

  // Use appropriate formatter
  return hasTime
    ? formatDateTimeFull(parsed, toLocale)
    : formatDate(parsed, toLocale);
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

/**
 * Date components interface
 */
export interface DateComponents {
  /** Year (e.g., 2025) */
  year: number;
  /** Month (1-12) */
  month: number;
  /** Day of month (1-31) */
  day: number;
  /** Hour (0-23) */
  hour: number;
  /** Minute (0-59) */
  minute: number;
  /** Second (0-59) */
  second: number;
  /** Millisecond (0-999) */
  millisecond: number;
}

/**
 * Extracts all components from a Date object
 *
 * @param date - Date object or ISO string to extract components from
 * @returns Object containing year, month, day, hour, minute, second, millisecond
 *
 * @example
 * extractDateComponents(new Date(2025, 9, 18, 15, 30, 45, 123))
 * // { year: 2025, month: 10, day: 18, hour: 15, minute: 30, second: 45, millisecond: 123 }
 *
 * @example
 * extractDateComponents('2025-10-18T15:30:45.123Z')
 * // { year: 2025, month: 10, day: 18, hour: 15, minute: 30, second: 45, millisecond: 123 }
 */
export function extractDateComponents(date: Date | string): DateComponents | null {
  if (!date) return null;

  let dateObj: Date;

  if (typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return null;
  }

  return {
    year: dateObj.getFullYear(),
    month: dateObj.getMonth() + 1, // Convert from 0-indexed to 1-indexed
    day: dateObj.getDate(),
    hour: dateObj.getHours(),
    minute: dateObj.getMinutes(),
    second: dateObj.getSeconds(),
    millisecond: dateObj.getMilliseconds(),
  };
}

/**
 * ==============================================================================
 * UTC TIMEZONE UTILITIES
 * ==============================================================================
 * Internal system time: Always UTC
 * User display time: Converted to user's preferred timezone
 * ==============================================================================
 */

/**
 * Supported timezones for user preferences
 */
export type SupportedTimezone =
  | 'Europe/Bratislava'  // SK (UTC+1/UTC+2 DST)
  | 'Europe/Prague'      // CZ (UTC+1/UTC+2 DST)
  | 'Europe/Warsaw'      // PL (UTC+1/UTC+2 DST)
  | 'UTC';               // UTC (no offset)

/**
 * Converts Date object to UTC ISO string (for backend storage)
 *
 * @param date - Date object to convert
 * @returns UTC ISO string (e.g., "2025-10-21T14:30:00.000Z")
 *
 * @example
 * toUTC(new Date(2025, 9, 21, 15, 30)) // "2025-10-21T13:30:00.000Z" (assuming local is UTC+2)
 */
export function toUTC(date: Date): string {
  if (!date || isNaN(date.getTime())) return '';
  return date.toISOString();
}

/**
 * Parses UTC ISO string to Date object
 *
 * @param utcString - UTC ISO string
 * @returns Date object or null if invalid
 *
 * @example
 * fromUTC("2025-10-21T14:30:00.000Z") // Date object in UTC
 */
export function fromUTC(utcString: string): Date | null {
  if (!utcString) return null;
  const date = new Date(utcString);
  if (isNaN(date.getTime())) return null;
  return date;
}

/**
 * Formats UTC datetime to user's timezone with locale formatting
 *
 * @param utcString - UTC ISO string from backend
 * @param timezone - User's preferred timezone
 * @param locale - Display locale ('sk' or 'en')
 * @returns Formatted datetime string in user's timezone
 *
 * @example
 * formatUserDateTime("2025-10-21T14:30:00Z", "Europe/Bratislava", "sk")
 * // "21.10.2025 16:30" (UTC+2 in summer)
 *
 * @example
 * formatUserDateTime("2025-10-21T14:30:00Z", "UTC", "en")
 * // "2025-10-21 14:30"
 */
export function formatUserDateTime(
  utcString: string,
  timezone: SupportedTimezone,
  locale: DateLocale
): string {
  const date = fromUTC(utcString);
  if (!date) return '';

  // Convert to user's timezone using Intl API
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  const formatter = new Intl.DateTimeFormat(locale === 'sk' ? 'sk-SK' : 'en-GB', options);
  const parts = formatter.formatToParts(date);

  // Extract parts
  const year = parts.find(p => p.type === 'year')?.value || '';
  const month = parts.find(p => p.type === 'month')?.value || '';
  const day = parts.find(p => p.type === 'day')?.value || '';
  const hour = parts.find(p => p.type === 'hour')?.value || '';
  const minute = parts.find(p => p.type === 'minute')?.value || '';

  // Format according to locale
  if (locale === 'sk') {
    return `${day}.${month}.${year} ${hour}:${minute}`;
  } else {
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }
}

/**
 * Gets current UTC datetime as ISO string (for creating timestamps)
 *
 * @returns Current UTC ISO string
 *
 * @example
 * getNowUTC() // "2025-10-21T14:30:45.123Z"
 */
export function getNowUTC(): string {
  return new Date().toISOString();
}

/**
 * Converts user's local datetime input to UTC for backend storage
 *
 * @param localDateTimeString - User's input (e.g., "21.10.2025 16:30")
 * @param timezone - User's timezone
 * @param locale - Input locale ('sk' or 'en')
 * @returns UTC ISO string for backend storage
 *
 * @example
 * toUTCFromUserInput("21.10.2025 16:30", "Europe/Bratislava", "sk")
 * // "2025-10-21T14:30:00.000Z" (assuming UTC+2)
 */
export function toUTCFromUserInput(
  localDateTimeString: string,
  timezone: SupportedTimezone,
  locale: DateLocale
): string | null {
  // Parse user input to Date object
  const localDate = parseDateTime(localDateTimeString, locale);
  if (!localDate) return null;

  // If timezone is UTC, just return ISO string
  if (timezone === 'UTC') {
    return localDate.toISOString();
  }

  // For other timezones, we need to adjust for timezone offset
  // Note: This is a simplified approach. For production, consider using libraries like date-fns-tz

  // Get timezone offset in minutes at the given date
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  // Format the local date in the target timezone
  const formatted = formatter.format(localDate);

  // Parse back and create UTC date
  // This ensures proper timezone conversion
  const [datePart, timePart] = formatted.split(', ');
  const [month, day, year] = datePart.split('/');
  const [hour, minute, second] = timePart.split(':');

  const utcDate = new Date(Date.UTC(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hour),
    parseInt(minute),
    parseInt(second)
  ));

  return utcDate.toISOString();
}
