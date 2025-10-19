/*
 * ================================================================
 * FILE: emailUtils.test.ts
 * PATH: /packages/config/src/utils/emailUtils.test.ts
 * DESCRIPTION: Tests for email validation and normalization utilities
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
 * ================================================================
 */

import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  normalizeEmail,
  getEmailDomain,
  getEmailLocal,
  isEmailFromDomain,
} from './emailUtils';

describe('emailUtils', () => {
  describe('validateEmail', () => {
    it('should validate simple email', () => {
      expect(validateEmail('user@example.com')).toBe(true);
    });

    it('should validate email with subdomain', () => {
      expect(validateEmail('user@mail.example.com')).toBe(true);
    });

    it('should validate email with dots in local part', () => {
      expect(validateEmail('user.name@example.com')).toBe(true);
    });

    it('should validate email with plus sign', () => {
      expect(validateEmail('user+tag@example.com')).toBe(true);
    });

    it('should validate email with numbers', () => {
      expect(validateEmail('user123@example123.com')).toBe(true);
    });

    it('should validate email with hyphens in domain', () => {
      expect(validateEmail('user@my-domain.com')).toBe(true);
    });

    it('should validate email with multiple TLDs', () => {
      expect(validateEmail('user@example.co.uk')).toBe(true);
    });

    it('should reject email without @', () => {
      expect(validateEmail('userexample.com')).toBe(false);
    });

    it('should reject email without domain', () => {
      expect(validateEmail('user@')).toBe(false);
    });

    it('should reject email without local part', () => {
      expect(validateEmail('@example.com')).toBe(false);
    });

    it('should reject email without TLD', () => {
      expect(validateEmail('user@example')).toBe(false);
    });

    it('should reject email with multiple @ signs', () => {
      expect(validateEmail('user@@example.com')).toBe(false);
      expect(validateEmail('user@name@example.com')).toBe(false);
    });

    it('should reject email starting with dot', () => {
      expect(validateEmail('.user@example.com')).toBe(false);
    });

    it('should reject email ending with dot before @', () => {
      expect(validateEmail('user.@example.com')).toBe(false);
    });

    it('should reject email with consecutive dots', () => {
      expect(validateEmail('user..name@example.com')).toBe(false);
      expect(validateEmail('user@example..com')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validateEmail('')).toBe(false);
    });

    it('should reject too short email', () => {
      expect(validateEmail('a@')).toBe(false);
    });

    it('should handle whitespace trimming', () => {
      expect(validateEmail('  user@example.com  ')).toBe(true);
    });
  });

  describe('normalizeEmail', () => {
    it('should convert to lowercase', () => {
      expect(normalizeEmail('USER@EXAMPLE.COM')).toBe('user@example.com');
    });

    it('should trim whitespace', () => {
      expect(normalizeEmail('  user@example.com  ')).toBe('user@example.com');
    });

    it('should handle mixed case', () => {
      expect(normalizeEmail('UsEr@ExAmPlE.CoM')).toBe('user@example.com');
    });

    it('should handle empty string', () => {
      expect(normalizeEmail('')).toBe('');
    });

    it('should preserve special characters', () => {
      expect(normalizeEmail('user+tag@example.com')).toBe('user+tag@example.com');
    });
  });

  describe('getEmailDomain', () => {
    it('should extract domain from email', () => {
      expect(getEmailDomain('user@example.com')).toBe('example.com');
    });

    it('should extract subdomain', () => {
      expect(getEmailDomain('user@mail.example.com')).toBe('mail.example.com');
    });

    it('should convert domain to lowercase', () => {
      expect(getEmailDomain('user@EXAMPLE.COM')).toBe('example.com');
    });

    it('should handle invalid email', () => {
      expect(getEmailDomain('invalid')).toBe('');
    });

    it('should handle email without @', () => {
      expect(getEmailDomain('userexample.com')).toBe('');
    });

    it('should handle empty string', () => {
      expect(getEmailDomain('')).toBe('');
    });

    it('should handle multiple @ signs', () => {
      expect(getEmailDomain('user@@example.com')).toBe('');
    });
  });

  describe('getEmailLocal', () => {
    it('should extract local part from email', () => {
      expect(getEmailLocal('user@example.com')).toBe('user');
    });

    it('should extract local with dots', () => {
      expect(getEmailLocal('user.name@example.com')).toBe('user.name');
    });

    it('should extract local with plus sign', () => {
      expect(getEmailLocal('user+tag@example.com')).toBe('user+tag');
    });

    it('should convert local to lowercase', () => {
      expect(getEmailLocal('USER@example.com')).toBe('user');
    });

    it('should handle invalid email', () => {
      expect(getEmailLocal('invalid')).toBe('');
    });

    it('should handle email without @', () => {
      expect(getEmailLocal('userexample.com')).toBe('');
    });

    it('should handle empty string', () => {
      expect(getEmailLocal('')).toBe('');
    });
  });

  describe('isEmailFromDomain', () => {
    it('should return true for matching domain', () => {
      expect(isEmailFromDomain('user@example.com', 'example.com')).toBe(true);
    });

    it('should return false for different domain', () => {
      expect(isEmailFromDomain('user@example.com', 'other.com')).toBe(false);
    });

    it('should return false for subdomain', () => {
      expect(isEmailFromDomain('user@mail.example.com', 'example.com')).toBe(false);
    });

    it('should be case-insensitive', () => {
      expect(isEmailFromDomain('user@EXAMPLE.COM', 'example.com')).toBe(true);
      expect(isEmailFromDomain('user@example.com', 'EXAMPLE.COM')).toBe(true);
    });

    it('should handle invalid email', () => {
      expect(isEmailFromDomain('invalid', 'example.com')).toBe(false);
    });

    it('should handle empty strings', () => {
      expect(isEmailFromDomain('', 'example.com')).toBe(false);
      expect(isEmailFromDomain('user@example.com', '')).toBe(false);
    });
  });
});
