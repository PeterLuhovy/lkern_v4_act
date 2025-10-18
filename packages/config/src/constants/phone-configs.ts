/*
 * ================================================================
 * FILE: phone-configs.ts
 * PATH: /packages/config/src/constants/phone-configs.ts
 * DESCRIPTION: Phone number configurations for multiple countries
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
 * ================================================================
 */

import { SK_MOBILE_PREFIXES, SK_AREA_CODES } from './validation-constants';

/**
 * Phone number configuration for a country
 */
export interface PhoneCountryConfig {
  /** ISO 3166-1 alpha-2 country code */
  countryCode: string;

  /** International dialing prefix (e.g., +421) */
  dialingCode: string;

  /** National prefix (e.g., 0) */
  nationalPrefix: string;

  /** Mobile number validation */
  mobile: {
    /** Valid mobile prefixes (without national prefix) */
    prefixes: readonly string[];
    /** Expected length after removing country/national prefix */
    length: number;
  };

  /** Landline number validation */
  landline: {
    /** Valid area codes (with national prefix) */
    areaCodes: readonly string[];
    /** Minimum length after removing country/national prefix */
    minLength: number;
    /** Maximum length after removing country/national prefix */
    maxLength: number;
  };

  /** Formatting functions */
  format: {
    mobile: (digits: string) => string;
    landline: (digits: string) => string;
  };
}

/**
 * Slovakia (SK) phone configuration
 */
export const SK_PHONE_CONFIG: PhoneCountryConfig = {
  countryCode: 'SK',
  dialingCode: '+421',
  nationalPrefix: '0',

  mobile: {
    prefixes: SK_MOBILE_PREFIXES,
    length: 9, // +421 9XX XXX XXX = 9 digits after +421
  },

  landline: {
    areaCodes: SK_AREA_CODES,
    minLength: 8, // Shortest landline: 8 digits
    maxLength: 10, // Longest landline: 10 digits
  },

  format: {
    mobile: (digits: string) => {
      // Format: +421 9XX XXX XXX
      if (digits.length === 9) {
        return `+421 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
      }
      return `+421 ${digits}`;
    },

    landline: (digits: string) => {
      // Bratislava (1-digit area code): +421 2 XXXX XXXX
      if (digits.startsWith('2') && digits.length === 9) {
        return `+421 ${digits.substring(0, 1)} ${digits.substring(1, 5)} ${digits.substring(5)}`;
      }

      // Other cities (2-digit area code): +421 XX XXX XXXX
      if (digits.length === 9) {
        return `+421 ${digits.substring(0, 2)} ${digits.substring(2, 5)} ${digits.substring(5)}`;
      }

      return `+421 ${digits}`;
    },
  },
};

/**
 * Czech Republic (CZ) phone configuration
 *
 * Source: https://www.ctu.cz/
 */
export const CZ_PHONE_CONFIG: PhoneCountryConfig = {
  countryCode: 'CZ',
  dialingCode: '+420',
  nationalPrefix: '0', // Czech numbers don't use 0 prefix in international format

  mobile: {
    // Czech mobile prefixes: 60X, 70X, 72X, 73X, 77X, 79X
    prefixes: [
      '601', '602', '603', '604', '605', '606', '607', '608',
      '702', '703', '704', '705', '706', '707', '708', '709',
      '720', '721', '722', '723', '724', '725', '726', '727', '728', '729',
      '730', '731', '732', '733', '734', '735', '736', '737', '738', '739',
      '770', '771', '772', '773', '774', '775', '776', '777', '778', '779',
      '790', '791', '792', '793', '794', '795', '796', '797', '798', '799',
    ],
    length: 9, // +420 XXX XXX XXX = 9 digits
  },

  landline: {
    // Czech area codes: 2XX, 3XX, 4XX, 5XX (excluding mobile ranges)
    areaCodes: [
      '2', // Prague
      '3', // West Bohemia
      '4', // North Bohemia
      '5', // East Bohemia
    ],
    minLength: 9,
    maxLength: 9,
  },

  format: {
    mobile: (digits: string) => {
      // Format: +420 XXX XXX XXX
      if (digits.length === 9) {
        return `+420 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
      }
      return `+420 ${digits}`;
    },

    landline: (digits: string) => {
      // Format: +420 XXX XXX XXX
      if (digits.length === 9) {
        return `+420 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
      }
      return `+420 ${digits}`;
    },
  },
};

/**
 * Poland (PL) phone configuration
 *
 * Source: https://www.uke.gov.pl/
 */
export const PL_PHONE_CONFIG: PhoneCountryConfig = {
  countryCode: 'PL',
  dialingCode: '+48',
  nationalPrefix: '0',

  mobile: {
    // Polish mobile prefixes: 45X, 50X, 51X, 53X, 57X, 60X, 66X, 69X, 72X, 73X, 78X, 79X, 88X
    prefixes: [
      '45', '50', '51', '53', '57', '60', '66', '69',
      '72', '73', '78', '79', '88',
    ],
    length: 9, // +48 XXX XXX XXX = 9 digits
  },

  landline: {
    // Polish area codes: 12, 22, 32, etc. (2-digit)
    areaCodes: [
      '12', '13', '14', '15', '16', '17', '18', // South Poland
      '22', '23', '24', '25', '29', // Central Poland
      '32', '33', '34', // Silesia
      '41', '42', '43', '44', '46', '48', // Lodz region
      '52', '54', '55', '56', '58', '59', // North Poland
      '61', '62', '63', '65', '67', '68', // West Poland
      '71', '74', '75', '76', '77', // Southwest Poland
      '81', '82', '83', '84', '85', '86', '87', '89', // East Poland
      '91', '94', '95', // Northwest Poland
    ],
    minLength: 9,
    maxLength: 9,
  },

  format: {
    mobile: (digits: string) => {
      // Format: +48 XXX XXX XXX
      if (digits.length === 9) {
        return `+48 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
      }
      return `+48 ${digits}`;
    },

    landline: (digits: string) => {
      // Format: +48 XX XXX XX XX
      if (digits.length === 9) {
        return `+48 ${digits.substring(0, 2)} ${digits.substring(2, 5)} ${digits.substring(5, 7)} ${digits.substring(7)}`;
      }
      return `+48 ${digits}`;
    },
  },
};

/**
 * Available phone configurations by country code
 */
export const PHONE_CONFIGS: Record<string, PhoneCountryConfig> = {
  SK: SK_PHONE_CONFIG,
  CZ: CZ_PHONE_CONFIG,
  PL: PL_PHONE_CONFIG,
};

/**
 * Default country code for phone utilities
 */
export const DEFAULT_PHONE_COUNTRY = 'SK';

/**
 * Get phone configuration for a country
 *
 * @param countryCode - ISO 3166-1 alpha-2 country code (SK, CZ, PL)
 * @returns Phone configuration or undefined if not supported
 */
export function getPhoneConfig(countryCode: string): PhoneCountryConfig | undefined {
  return PHONE_CONFIGS[countryCode.toUpperCase()];
}
