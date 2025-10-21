/*
 * ================================================================
 * FILE: validation.test.ts
 * PATH: /packages/config/src/utils/validation/validation.test.ts
 * DESCRIPTION: Tests for validation utilities
 * VERSION: v1.0.0
 * CREATED: 2025-10-20
 * UPDATED: 2025-10-20 16:45:00
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce, validateField, type ValidationResult } from './validation';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should delay function execution', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 500);

    debounced('test');
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);
    expect(fn).toHaveBeenCalledWith('test');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should cancel previous call when called again', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 500);

    debounced('call1');
    vi.advanceTimersByTime(300);
    debounced('call2');
    vi.advanceTimersByTime(300);
    debounced('call3');

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);
    expect(fn).toHaveBeenCalledWith('call3');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple rapid calls', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    for (let i = 0; i < 10; i++) {
      debounced(`call${i}`);
      vi.advanceTimersByTime(50);
    }

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledWith('call9');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should allow execution after delay passes', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced('first');
    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledWith('first');

    debounced('second');
    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledWith('second');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should preserve function arguments', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced('arg1', 'arg2', 'arg3');
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
  });

  it('should work with zero delay', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 0);

    debounced('test');
    vi.advanceTimersByTime(0);

    expect(fn).toHaveBeenCalledWith('test');
  });
});

describe('validateField', () => {
  describe('no validation type', () => {
    it('should return valid when no validationType provided', async () => {
      const result = await validateField('field', 'any value');
      expect(result).toEqual({ isValid: true });
    });

    it('should return valid for undefined validationType', async () => {
      const result = await validateField('field', 'value', undefined);
      expect(result).toEqual({ isValid: true });
    });
  });

  describe('required validation', () => {
    it('should return invalid for empty string', async () => {
      const result = await validateField('name', '', 'required');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Field "name" is required');
    });

    it('should return invalid for null', async () => {
      const result = await validateField('name', null, 'required');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Field "name" is required');
    });

    it('should return invalid for undefined', async () => {
      const result = await validateField('name', undefined, 'required');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Field "name" is required');
    });

    it('should return valid for non-empty string', async () => {
      const result = await validateField('name', 'John', 'required');
      expect(result).toEqual({ isValid: true, error: undefined });
    });

    it('should return valid for number zero', async () => {
      const result = await validateField('age', 0, 'required');
      expect(result).toEqual({ isValid: true, error: undefined });
    });
  });

  describe('email validation', () => {
    it('should return valid for correct email with metadata', async () => {
      const result = await validateField('email', 'user@example.com', 'email');
      expect(result.isValid).toBe(true);
      expect(result.metadata?.emailDomain).toBe('example.com');
      expect(result.metadata?.normalizedEmail).toBe('user@example.com');
    });

    it('should return valid for email with subdomain and extract domain', async () => {
      const result = await validateField('email', 'user@mail.example.com', 'email');
      expect(result.isValid).toBe(true);
      expect(result.metadata?.emailDomain).toBe('mail.example.com');
    });

    it('should return invalid for missing @', async () => {
      const result = await validateField('email', 'userexample.com', 'email');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('should return invalid for invalid format', async () => {
      const result = await validateField('email', 'invalid@', 'email');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });
  });

  describe('phone validation', () => {
    it('should return valid for Slovak mobile with complete metadata', async () => {
      const result = await validateField('phone', '+421902123456', 'phone');
      expect(result.isValid).toBe(true);
      expect(result.metadata?.phoneType).toBe('mobile');
      expect(result.metadata?.formattedPhone).toBe('+421 902 123 456');
      expect(result.metadata?.countryCode).toBe('+421');
    });

    it('should return valid for Slovak landline with complete metadata', async () => {
      const result = await validateField('phone', '+421212345678', 'phone');
      expect(result.isValid).toBe(true);
      expect(result.metadata?.phoneType).toBe('landline');
      expect(result.metadata?.formattedPhone).toBe('+421 2 1234 5678');
      expect(result.metadata?.countryCode).toBe('+421');
    });

    it('should return valid for formatted phone', async () => {
      const result = await validateField('phone', '+421 902 123 456', 'phone');
      expect(result.isValid).toBe(true);
      expect(result.metadata?.phoneType).toBe('mobile');
      expect(result.metadata?.countryCode).toBe('+421');
    });

    it('should return invalid for invalid phone', async () => {
      const result = await validateField('phone', '123', 'phone');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid phone number (must be valid mobile or landline)');
    });
  });

  describe('URL validation', () => {
    it('should return valid for https URL', async () => {
      const result = await validateField('website', 'https://example.com', 'url');
      expect(result).toEqual({ isValid: true });
    });

    it('should return valid for http URL', async () => {
      const result = await validateField('website', 'http://example.com', 'url');
      expect(result.isValid).toBe(true);
    });

    it('should return valid for URL with path', async () => {
      const result = await validateField('website', 'https://example.com/path/to/page', 'url');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for URL without protocol', async () => {
      const result = await validateField('website', 'example.com', 'url');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid URL format');
    });

    it('should return invalid for invalid URL', async () => {
      const result = await validateField('website', 'not a url', 'url');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid URL format');
    });
  });
});
