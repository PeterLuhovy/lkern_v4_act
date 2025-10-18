/*
 * ================================================================
 * FILE: phoneUtils.test.ts
 * PATH: /packages/config/src/utils/phoneUtils.test.ts
 * DESCRIPTION: Tests for Slovak phone number utilities
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
 * ================================================================
 */

import { describe, it, expect } from 'vitest';
import {
  cleanPhoneNumber,
  validateMobile,
  validateLandlineOrFax,
  formatPhoneNumber,
  detectPhoneType,
} from './phoneUtils';

describe('phoneUtils', () => {
  describe('cleanPhoneNumber', () => {
    it('should remove spaces from phone number', () => {
      expect(cleanPhoneNumber('+421 902 123 456')).toBe('+421902123456');
    });

    it('should remove dashes from phone number', () => {
      expect(cleanPhoneNumber('0902-123-456')).toBe('0902123456');
    });

    it('should remove parentheses from phone number', () => {
      expect(cleanPhoneNumber('+421 (902) 123 456')).toBe('+421902123456');
    });

    it('should keep + sign at beginning', () => {
      expect(cleanPhoneNumber('+421902123456')).toBe('+421902123456');
    });

    it('should handle empty string', () => {
      expect(cleanPhoneNumber('')).toBe('');
    });

    it('should handle mixed formatting characters', () => {
      expect(cleanPhoneNumber('+421 (902) 123-456')).toBe('+421902123456');
    });
  });

  describe('validateMobile', () => {
    it('should validate correct international mobile number', () => {
      expect(validateMobile('+421 902 123 456')).toBe(true);
    });

    it('should validate correct national mobile number', () => {
      expect(validateMobile('0902 123 456')).toBe(true);
    });

    it('should validate mobile without spaces', () => {
      expect(validateMobile('+421902123456')).toBe(true);
      expect(validateMobile('0902123456')).toBe(true);
    });

    it('should validate all valid mobile prefixes (90X)', () => {
      for (let i = 0; i <= 9; i++) {
        expect(validateMobile(`+42190${i}123456`)).toBe(true);
        expect(validateMobile(`090${i}123456`)).toBe(true);
      }
    });

    it('should validate all valid mobile prefixes (91X)', () => {
      for (let i = 0; i <= 9; i++) {
        expect(validateMobile(`+42191${i}123456`)).toBe(true);
        expect(validateMobile(`091${i}123456`)).toBe(true);
      }
    });

    it('should validate mobile prefixes 940, 944, 948, 949', () => {
      expect(validateMobile('+421940123456')).toBe(true);
      expect(validateMobile('+421944123456')).toBe(true);
      expect(validateMobile('+421948123456')).toBe(true);
      expect(validateMobile('+421949123456')).toBe(true);
    });

    it('should reject invalid mobile prefixes', () => {
      expect(validateMobile('+421941123456')).toBe(false); // 941 not valid
      expect(validateMobile('+421950123456')).toBe(false); // 950 not valid
    });

    it('should reject landline numbers', () => {
      expect(validateMobile('+421 2 1234 5678')).toBe(false);
      expect(validateMobile('02 1234 5678')).toBe(false);
    });

    it('should reject numbers with wrong length', () => {
      expect(validateMobile('+421 902 123 45')).toBe(false); // Too short
      expect(validateMobile('+421 902 123 4567')).toBe(false); // Too long
    });

    it('should reject empty string', () => {
      expect(validateMobile('')).toBe(false);
    });

    it('should reject invalid format', () => {
      expect(validateMobile('invalid')).toBe(false);
    });
  });

  describe('validateLandlineOrFax', () => {
    it('should validate Bratislava landline (2-digit area code)', () => {
      expect(validateLandlineOrFax('+421 2 1234 5678')).toBe(true);
      expect(validateLandlineOrFax('02 1234 5678')).toBe(true);
    });

    it('should validate other cities landline (3-digit area code)', () => {
      expect(validateLandlineOrFax('+421 32 123 4567')).toBe(true);
      expect(validateLandlineOrFax('032 123 4567')).toBe(true);
    });

    it('should validate all valid area codes', () => {
      const areaCodes = ['02', '031', '041', '051'];
      areaCodes.forEach((code) => {
        const testNumber = code === '02' ? '0212345678' : `${code}1234567`;
        expect(validateLandlineOrFax(testNumber)).toBe(true);
      });
    });

    it('should reject mobile numbers', () => {
      expect(validateLandlineOrFax('+421 902 123 456')).toBe(false);
      expect(validateLandlineOrFax('0902 123 456')).toBe(false);
    });

    it('should reject invalid area codes', () => {
      expect(validateLandlineOrFax('+421 99 123 4567')).toBe(false);
      expect(validateLandlineOrFax('099 123 4567')).toBe(false);
    });

    it('should reject numbers with wrong length', () => {
      expect(validateLandlineOrFax('+421 2 123 456')).toBe(false); // Too short
      expect(validateLandlineOrFax('+421 2 12345 67890')).toBe(false); // Too long
    });

    it('should reject empty string', () => {
      expect(validateLandlineOrFax('')).toBe(false);
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format mobile from national to international', () => {
      expect(formatPhoneNumber('0902123456', 'mobile')).toBe('+421 902 123 456');
    });

    it('should format mobile already in international format', () => {
      expect(formatPhoneNumber('+421902123456', 'mobile')).toBe('+421 902 123 456');
    });

    it('should format Bratislava landline', () => {
      expect(formatPhoneNumber('0212345678', 'landline')).toBe('+421 2 1234 5678');
    });

    it('should format other cities landline', () => {
      expect(formatPhoneNumber('0321234567', 'landline')).toBe('+421 32 123 4567');
    });

    it('should format fax numbers', () => {
      expect(formatPhoneNumber('0321234567', 'fax')).toBe('+421 32 123 4567');
    });

    it('should handle already formatted numbers', () => {
      expect(formatPhoneNumber('+421 902 123 456', 'mobile')).toBe('+421 902 123 456');
    });

    it('should return original for invalid numbers', () => {
      expect(formatPhoneNumber('invalid', 'mobile')).toBe('invalid');
    });

    it('should handle empty string', () => {
      expect(formatPhoneNumber('', 'mobile')).toBe('');
    });
  });

  describe('detectPhoneType', () => {
    it('should detect mobile numbers', () => {
      expect(detectPhoneType('+421 902 123 456')).toBe('mobile');
      expect(detectPhoneType('0902 123 456')).toBe('mobile');
    });

    it('should detect landline numbers', () => {
      expect(detectPhoneType('+421 2 1234 5678')).toBe('landline');
      expect(detectPhoneType('02 1234 5678')).toBe('landline');
      expect(detectPhoneType('032 123 4567')).toBe('landline');
    });

    it('should return unknown for invalid numbers', () => {
      expect(detectPhoneType('invalid')).toBe('unknown');
      expect(detectPhoneType('')).toBe('unknown');
      expect(detectPhoneType('123')).toBe('unknown');
    });
  });
});
