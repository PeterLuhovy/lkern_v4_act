/*
 * ================================================================
 * FILE: dateUtils.test.ts
 * PATH: /packages/config/src/utils/dateUtils.test.ts
 * DESCRIPTION: Tests for date formatting and parsing utilities
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
 * ================================================================
 */

import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatDateTime,
  parseDate,
  validateDate,
  convertDateLocale,
  getToday,
  isToday,
  addDays,
  getDaysDifference,
} from './dateUtils';

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('should format Date to SK format (DD.MM.YYYY)', () => {
      const date = new Date(2025, 9, 18); // October 18, 2025
      expect(formatDate(date, 'sk')).toBe('18.10.2025');
    });

    it('should format Date to EN format (YYYY-MM-DD)', () => {
      const date = new Date(2025, 9, 18); // October 18, 2025
      expect(formatDate(date, 'en')).toBe('2025-10-18');
    });

    it('should format ISO string to SK format', () => {
      expect(formatDate('2025-10-18T00:00:00Z', 'sk')).toBe('18.10.2025');
    });

    it('should format ISO string to EN format', () => {
      expect(formatDate('2025-10-18T00:00:00Z', 'en')).toBe('2025-10-18');
    });

    it('should handle single-digit day and month', () => {
      const date = new Date(2025, 0, 5); // January 5, 2025
      expect(formatDate(date, 'sk')).toBe('05.01.2025');
      expect(formatDate(date, 'en')).toBe('2025-01-05');
    });

    it('should handle invalid date', () => {
      expect(formatDate(new Date('invalid'), 'sk')).toBe('');
      expect(formatDate('invalid', 'en')).toBe('');
    });

    it('should handle empty input', () => {
      expect(formatDate('', 'sk')).toBe('');
    });
  });

  describe('formatDateTime', () => {
    it('should format Date to SK datetime', () => {
      const date = new Date(2025, 9, 18, 14, 30); // October 18, 2025, 14:30
      expect(formatDateTime(date, 'sk')).toBe('18.10.2025 14:30');
    });

    it('should format Date to EN datetime', () => {
      const date = new Date(2025, 9, 18, 14, 30); // October 18, 2025, 14:30
      expect(formatDateTime(date, 'en')).toBe('2025-10-18 14:30');
    });

    it('should handle single-digit hours and minutes', () => {
      const date = new Date(2025, 9, 18, 9, 5); // October 18, 2025, 09:05
      expect(formatDateTime(date, 'sk')).toBe('18.10.2025 09:05');
    });

    it('should handle invalid date', () => {
      expect(formatDateTime('invalid', 'sk')).toBe('');
    });
  });

  describe('parseDate', () => {
    it('should parse SK format to Date', () => {
      const result = parseDate('18.10.2025', 'sk');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getDate()).toBe(18);
      expect(result?.getMonth()).toBe(9); // October (0-indexed)
      expect(result?.getFullYear()).toBe(2025);
    });

    it('should parse EN format to Date', () => {
      const result = parseDate('2025-10-18', 'en');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getDate()).toBe(18);
      expect(result?.getMonth()).toBe(9);
      expect(result?.getFullYear()).toBe(2025);
    });

    it('should handle single-digit day and month', () => {
      const result = parseDate('5.1.2025', 'sk');
      expect(result?.getDate()).toBe(5);
      expect(result?.getMonth()).toBe(0); // January
    });

    it('should return null for invalid format', () => {
      expect(parseDate('invalid', 'sk')).toBeNull();
      expect(parseDate('18-10-2025', 'sk')).toBeNull(); // Wrong delimiter
      expect(parseDate('2025.10.18', 'en')).toBeNull(); // Wrong delimiter
    });

    it('should return null for invalid date', () => {
      expect(parseDate('31.02.2025', 'sk')).toBeNull(); // February 31 doesn't exist
      expect(parseDate('32.10.2025', 'sk')).toBeNull(); // Day 32 doesn't exist
      expect(parseDate('18.13.2025', 'sk')).toBeNull(); // Month 13 doesn't exist
    });

    it('should return null for empty string', () => {
      expect(parseDate('', 'sk')).toBeNull();
    });

    it('should return null for malformed input', () => {
      expect(parseDate('18.10', 'sk')).toBeNull(); // Missing year
      expect(parseDate('2025-10', 'en')).toBeNull(); // Missing day
    });
  });

  describe('validateDate', () => {
    it('should validate correct SK format', () => {
      expect(validateDate('18.10.2025', 'sk')).toBe(true);
    });

    it('should validate correct EN format', () => {
      expect(validateDate('2025-10-18', 'en')).toBe(true);
    });

    it('should reject invalid SK format', () => {
      expect(validateDate('18-10-2025', 'sk')).toBe(false);
    });

    it('should reject invalid EN format', () => {
      expect(validateDate('2025.10.18', 'en')).toBe(false);
    });

    it('should reject invalid dates', () => {
      expect(validateDate('31.02.2025', 'sk')).toBe(false);
      expect(validateDate('2025-02-31', 'en')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validateDate('', 'sk')).toBe(false);
    });
  });

  describe('convertDateLocale', () => {
    it('should convert SK to EN', () => {
      expect(convertDateLocale('18.10.2025', 'sk', 'en')).toBe('2025-10-18');
    });

    it('should convert EN to SK', () => {
      expect(convertDateLocale('2025-10-18', 'en', 'sk')).toBe('18.10.2025');
    });

    it('should handle invalid date', () => {
      expect(convertDateLocale('invalid', 'sk', 'en')).toBe('');
    });

    it('should handle same locale conversion', () => {
      expect(convertDateLocale('18.10.2025', 'sk', 'sk')).toBe('18.10.2025');
    });
  });

  describe('getToday', () => {
    it('should return today in SK format', () => {
      const today = new Date();
      const expected = formatDate(today, 'sk');
      expect(getToday('sk')).toBe(expected);
    });

    it('should return today in EN format', () => {
      const today = new Date();
      const expected = formatDate(today, 'en');
      expect(getToday('en')).toBe(expected);
    });
  });

  describe('isToday', () => {
    it('should return true for today SK format', () => {
      const today = getToday('sk');
      expect(isToday(today, 'sk')).toBe(true);
    });

    it('should return true for today EN format', () => {
      const today = getToday('en');
      expect(isToday(today, 'en')).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = addDays(new Date(), -1, 'sk');
      expect(isToday(yesterday, 'sk')).toBe(false);
    });

    it('should return false for invalid date', () => {
      expect(isToday('invalid', 'sk')).toBe(false);
    });
  });

  describe('addDays', () => {
    it('should add positive days to Date object', () => {
      const date = new Date(2025, 9, 18); // October 18, 2025
      expect(addDays(date, 5, 'sk')).toBe('23.10.2025');
    });

    it('should add negative days to Date object', () => {
      const date = new Date(2025, 9, 18); // October 18, 2025
      expect(addDays(date, -3, 'sk')).toBe('15.10.2025');
    });

    it('should add days to string date', () => {
      expect(addDays('18.10.2025', 5, 'sk')).toBe('23.10.2025');
    });

    it('should handle month overflow', () => {
      expect(addDays('28.10.2025', 5, 'sk')).toBe('02.11.2025');
    });

    it('should handle year overflow', () => {
      expect(addDays('30.12.2025', 5, 'sk')).toBe('04.01.2026');
    });

    it('should handle invalid date', () => {
      expect(addDays('invalid', 5, 'sk')).toBe('');
    });
  });

  describe('getDaysDifference', () => {
    it('should calculate positive difference', () => {
      expect(getDaysDifference('23.10.2025', '18.10.2025', 'sk')).toBe(5);
    });

    it('should calculate negative difference', () => {
      expect(getDaysDifference('18.10.2025', '23.10.2025', 'sk')).toBe(-5);
    });

    it('should return 0 for same dates', () => {
      expect(getDaysDifference('18.10.2025', '18.10.2025', 'sk')).toBe(0);
    });

    it('should work with Date objects', () => {
      const date1 = new Date(2025, 9, 23); // October 23, 2025
      const date2 = new Date(2025, 9, 18); // October 18, 2025
      expect(getDaysDifference(date1, date2, 'sk')).toBe(5);
    });

    it('should handle invalid dates', () => {
      expect(getDaysDifference('invalid', '18.10.2025', 'sk')).toBe(0);
      expect(getDaysDifference('18.10.2025', 'invalid', 'sk')).toBe(0);
    });
  });
});
