/*
 * ================================================================
 * FILE: emailUtils.ts
 * PATH: /packages/config/src/utils/emailUtils.ts
 * DESCRIPTION: Email validation and normalization utilities
 * VERSION: v1.1.0
 * CREATED: 2025-10-18
 * UPDATED: 2025-10-18
 * ================================================================
 */

import { EMAIL_REGEX, EMAIL_CONSTRAINTS } from '../../constants/validation-constants';

/**
 * Validates email address format
 *
 * @param email - Email address to validate
 * @returns true if valid email format
 *
 * @example
 * validateEmail('user@example.com') // true
 * validateEmail('user.name+tag@example.co.uk') // true
 * validateEmail('invalid@') // false
 * validateEmail('@invalid.com') // false
 */
export function validateEmail(email: string): boolean {
  if (!email) return false;

  // Trim whitespace
  const trimmed = email.trim();

  // Check basic length constraints
  if (trimmed.length < EMAIL_CONSTRAINTS.MIN_EMAIL_LENGTH) return false;
  if (trimmed.length > EMAIL_CONSTRAINTS.MAX_EMAIL_LENGTH) return false;

  // Check for @ symbol
  if (!trimmed.includes('@')) return false;

  // Split local and domain parts
  const parts = trimmed.split('@');
  if (parts.length !== 2) return false; // Must have exactly one @

  const [local, domain] = parts;

  // Validate local part (before @)
  if (!local || local.length === 0) return false;
  if (local.length > EMAIL_CONSTRAINTS.MAX_LOCAL_LENGTH) return false;
  if (local.startsWith('.') || local.endsWith('.')) return false;
  if (local.includes('..')) return false; // No consecutive dots

  // Validate domain part (after @)
  if (!domain || domain.length === 0) return false;
  if (domain.length > EMAIL_CONSTRAINTS.MAX_DOMAIN_LENGTH) return false;
  if (domain.startsWith('.') || domain.endsWith('.')) return false;
  if (domain.includes('..')) return false; // No consecutive dots
  if (!domain.includes('.')) return false; // Must have at least one dot

  // Final regex check
  return EMAIL_REGEX.test(trimmed);
}

/**
 * Normalizes email address to lowercase and trims whitespace
 *
 * @param email - Email address to normalize
 * @returns Normalized email address
 *
 * @example
 * normalizeEmail('  User@Example.COM  ') // 'user@example.com'
 * normalizeEmail('ADMIN@DOMAIN.SK') // 'admin@domain.sk'
 */
export function normalizeEmail(email: string): string {
  if (!email) return '';

  return email.trim().toLowerCase();
}

/**
 * Extracts domain from email address
 *
 * @param email - Email address
 * @returns Domain part of email or empty string if invalid
 *
 * @example
 * getEmailDomain('user@example.com') // 'example.com'
 * getEmailDomain('admin@subdomain.example.co.uk') // 'subdomain.example.co.uk'
 * getEmailDomain('invalid') // ''
 */
export function getEmailDomain(email: string): string {
  if (!email || !email.includes('@')) return '';

  const parts = email.trim().split('@');
  if (parts.length !== 2) return '';

  return parts[1].toLowerCase();
}

/**
 * Extracts local part (username) from email address
 *
 * @param email - Email address
 * @returns Local part of email or empty string if invalid
 *
 * @example
 * getEmailLocal('user@example.com') // 'user'
 * getEmailLocal('user.name+tag@example.com') // 'user.name+tag'
 * getEmailLocal('invalid') // ''
 */
export function getEmailLocal(email: string): string {
  if (!email || !email.includes('@')) return '';

  const parts = email.trim().split('@');
  if (parts.length !== 2) return '';

  return parts[0].toLowerCase();
}

/**
 * Checks if email belongs to a specific domain
 *
 * @param email - Email address
 * @param domain - Domain to check against
 * @returns true if email belongs to domain
 *
 * @example
 * isEmailFromDomain('user@example.com', 'example.com') // true
 * isEmailFromDomain('user@subdomain.example.com', 'example.com') // false
 * isEmailFromDomain('user@other.com', 'example.com') // false
 */
export function isEmailFromDomain(email: string, domain: string): boolean {
  const emailDomain = getEmailDomain(email);
  return emailDomain === domain.toLowerCase();
}
