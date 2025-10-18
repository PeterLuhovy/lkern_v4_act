/*
 * ================================================================
 * FILE: phoneUtils.ts
 * PATH: /packages/config/src/utils/phoneUtils.ts
 * DESCRIPTION: Generic phone number utilities (multi-country support)
 * VERSION: v2.0.0
 * CREATED: 2025-10-18
 * UPDATED: 2025-10-18
 * ================================================================
 */

import { getPhoneConfig, DEFAULT_PHONE_COUNTRY, type PhoneCountryConfig } from '../constants/phone-configs';

/**
 * Phone number type
 */
export type PhoneType = 'mobile' | 'landline' | 'fax';

/**
 * Supported country codes
 */
export type PhoneCountryCode = 'SK' | 'CZ' | 'PL';

/**
 * Removes all formatting characters from phone number
 *
 * @param phone - Phone number with or without formatting
 * @returns Cleaned phone number (digits and + only)
 *
 * @example
 * cleanPhoneNumber('+421 902 123 456') // '+421902123456'
 * cleanPhoneNumber('0902 123-456') // '0902123456'
 */
export function cleanPhoneNumber(phone: string): string {
  if (!phone) return '';
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Validates mobile phone number for a specific country
 *
 * @param phone - Phone number to validate
 * @param countryCode - ISO 3166-1 alpha-2 country code (default: 'SK')
 * @returns true if valid mobile number for the country
 *
 * @example
 * validateMobile('+421 902 123 456', 'SK') // true
 * validateMobile('+420 777 123 456', 'CZ') // true
 * validateMobile('0902 123 456') // true (defaults to SK)
 */
export function validateMobile(phone: string, countryCode: PhoneCountryCode = DEFAULT_PHONE_COUNTRY): boolean {
  if (!phone) return false;

  const config = getPhoneConfig(countryCode);
  if (!config) return false;

  const cleaned = cleanPhoneNumber(phone);

  // Check international format: +XXX ...
  if (cleaned.startsWith(config.dialingCode)) {
    const withoutCountry = cleaned.substring(config.dialingCode.length);

    if (withoutCountry.length !== config.mobile.length) return false;

    // Check if prefix is valid
    return Array.from(config.mobile.prefixes).some((prefix) =>
      withoutCountry.startsWith(prefix)
    );
  }

  // Check national format: 0XXX ...
  if (config.nationalPrefix && cleaned.startsWith(config.nationalPrefix)) {
    const withoutNational = cleaned.substring(config.nationalPrefix.length);

    if (withoutNational.length !== config.mobile.length) return false;

    // Check if prefix is valid
    return Array.from(config.mobile.prefixes).some((prefix) =>
      withoutNational.startsWith(prefix)
    );
  }

  return false;
}

/**
 * Validates landline or fax number for a specific country
 *
 * @param phone - Phone number to validate
 * @param countryCode - ISO 3166-1 alpha-2 country code (default: 'SK')
 * @returns true if valid landline/fax number for the country
 *
 * @example
 * validateLandlineOrFax('+421 2 1234 5678', 'SK') // true (Bratislava)
 * validateLandlineOrFax('+420 234 567 890', 'CZ') // true (Prague)
 */
export function validateLandlineOrFax(phone: string, countryCode: PhoneCountryCode = DEFAULT_PHONE_COUNTRY): boolean {
  if (!phone) return false;

  const config = getPhoneConfig(countryCode);
  if (!config) return false;

  const cleaned = cleanPhoneNumber(phone);

  // Check international format
  if (cleaned.startsWith(config.dialingCode)) {
    const withoutCountry = cleaned.substring(config.dialingCode.length);

    // Check length constraints
    if (withoutCountry.length < config.landline.minLength || withoutCountry.length > config.landline.maxLength) {
      return false;
    }

    // For SK: Special handling of area codes (02 becomes "2" in international format)
    if (countryCode === 'SK') {
      // Bratislava: +421 2 XXXX XXXX (9 digits, starts with "2")
      if (withoutCountry.length === 9 && withoutCountry.startsWith('2')) {
        return true;
      }

      // Other cities: +421 XX XXX XXXX (9 digits, check if 0+firstTwoDigits is valid area code)
      if (withoutCountry.length === 9) {
        const areaCode = '0' + withoutCountry.substring(0, 2);
        return Array.from(config.landline.areaCodes).includes(areaCode);
      }
    }

    // For CZ/PL: Check if starts with valid area code
    return Array.from(config.landline.areaCodes).some((areaCode) =>
      withoutCountry.startsWith(areaCode)
    );
  }

  // Check national format
  if (config.nationalPrefix && cleaned.startsWith(config.nationalPrefix)) {
    // Try different area code lengths (2, 3, 4 digits)
    for (let areaCodeLength = 4; areaCodeLength >= 2; areaCodeLength--) {
      if (cleaned.length >= areaCodeLength + 6) {
        const areaCode = cleaned.substring(0, areaCodeLength);
        if (Array.from(config.landline.areaCodes).includes(areaCode)) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Formats phone number according to country standards
 *
 * @param phone - Phone number to format
 * @param type - Type of phone number
 * @param countryCode - ISO 3166-1 alpha-2 country code (default: 'SK')
 * @returns Formatted phone number in international format
 *
 * @example
 * formatPhoneNumber('0902123456', 'mobile', 'SK') // '+421 902 123 456'
 * formatPhoneNumber('777123456', 'mobile', 'CZ') // '+420 777 123 456'
 */
export function formatPhoneNumber(
  phone: string,
  type: PhoneType,
  countryCode: PhoneCountryCode = DEFAULT_PHONE_COUNTRY
): string {
  if (!phone) return '';

  const config = getPhoneConfig(countryCode);
  if (!config) return phone;

  const cleaned = cleanPhoneNumber(phone);

  // Convert national format to international
  let international = cleaned;
  if (config.nationalPrefix && cleaned.startsWith(config.nationalPrefix)) {
    international = config.dialingCode + cleaned.substring(config.nationalPrefix.length);
  }

  // Ensure it starts with correct dialing code
  if (!international.startsWith(config.dialingCode)) {
    return phone; // Return original if invalid format
  }

  const withoutCountry = international.substring(config.dialingCode.length);

  // Use country-specific formatter
  if (type === 'mobile') {
    return config.format.mobile(withoutCountry);
  } else {
    return config.format.landline(withoutCountry);
  }
}

/**
 * Detects phone number type (mobile, landline, or unknown)
 *
 * @param phone - Phone number to detect
 * @param countryCode - ISO 3166-1 alpha-2 country code (default: 'SK')
 * @returns Phone type or 'unknown'
 *
 * @example
 * detectPhoneType('+421 902 123 456', 'SK') // 'mobile'
 * detectPhoneType('+420 234 567 890', 'CZ') // 'landline'
 */
export function detectPhoneType(phone: string, countryCode: PhoneCountryCode = DEFAULT_PHONE_COUNTRY): PhoneType | 'unknown' {
  if (validateMobile(phone, countryCode)) return 'mobile';
  if (validateLandlineOrFax(phone, countryCode)) return 'landline';
  return 'unknown';
}
