/*
 * ================================================================
 * FILE: validation-constants.ts
 * PATH: /packages/config/src/constants/validation-constants.ts
 * DESCRIPTION: Validation constants (phone prefixes, area codes, regex patterns)
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
 * ================================================================
 */

/**
 * Slovak mobile phone prefixes (9XX)
 *
 * Source: https://www.teleoff.gov.sk/
 *
 * Valid mobile prefixes in Slovakia:
 * - 90X series (Orange, T-Mobile, O2)
 * - 91X series (Orange, T-Mobile, O2)
 * - 940, 944, 948, 949 (MVNO operators)
 *
 * @example
 * SK_MOBILE_PREFIXES.includes('902') // true
 * SK_MOBILE_PREFIXES.includes('941') // false (not assigned)
 */
export const SK_MOBILE_PREFIXES: readonly string[] = [
  // 90X series
  '900', '901', '902', '903', '904', '905', '906', '907', '908', '909',
  // 91X series
  '910', '911', '912', '913', '914', '915', '916', '917', '918', '919',
  // MVNO operators
  '940', '944', '948', '949',
];

/**
 * Slovak area codes for landline and fax numbers
 *
 * Source: https://www.teleoff.gov.sk/
 *
 * Format: 2-3 digits starting with 0
 * - 02: Bratislava (capital)
 * - 031-038: West Slovakia
 * - 041-048: Central Slovakia
 * - 051-058: East Slovakia
 *
 * @example
 * SK_AREA_CODES.includes('02') // true (Bratislava)
 * SK_AREA_CODES.includes('032') // true (Trnava)
 * SK_AREA_CODES.includes('099') // false (not assigned)
 */
export const SK_AREA_CODES: readonly string[] = [
  '02',  // Bratislava
  // West Slovakia
  '031', // Dunajská Streda
  '032', // Trnava
  '033', // Trenčín
  '034', // Senica
  '035', // Púchov
  '036', // Považská Bystrica
  '037', // Nitra
  '038', // Topoľčany
  // Central Slovakia
  '041', // Žilina
  '042', // Skalica
  '043', // Martin
  '044', // Liptovský Mikuláš
  '045', // Ružomberok
  '046', // Prievidza
  '047', // Nové Mesto nad Váhom
  '048', // Banská Bystrica
  // East Slovakia
  '051', // Poprad
  '052', // Prešov
  '053', // Spišská Nová Ves
  '054', // Bardejov
  '055', // Košice
  '056', // Michalovce
  '057', // Humenné
  '058', // Rožňava
];

/**
 * RFC 5322 compliant email validation regex
 *
 * Source: https://www.ietf.org/rfc/rfc5322.txt
 *
 * Validates email format according to RFC 5322 standard.
 * Supports:
 * - Standard format: local@domain.tld
 * - Dots in local part: first.last@domain.com
 * - Plus addressing: user+tag@domain.com
 * - Subdomains: user@mail.example.com
 * - Multiple TLDs: user@example.co.uk
 *
 * @example
 * EMAIL_REGEX.test('user@example.com') // true
 * EMAIL_REGEX.test('invalid@') // false
 */
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Email length constraints (RFC 5321)
 *
 * Source: https://www.ietf.org/rfc/rfc5321.txt
 *
 * - MAX_EMAIL_LENGTH: 320 characters total
 * - MAX_LOCAL_LENGTH: 64 characters before @
 * - MAX_DOMAIN_LENGTH: 255 characters after @
 * - MIN_EMAIL_LENGTH: 3 characters minimum (a@b)
 */
export const EMAIL_CONSTRAINTS = {
  MAX_EMAIL_LENGTH: 320,
  MAX_LOCAL_LENGTH: 64,
  MAX_DOMAIN_LENGTH: 255,
  MIN_EMAIL_LENGTH: 3,
} as const;

/**
 * Phone number length constraints
 *
 * Slovak phone number formats:
 * - Mobile (international): +421 9XX XXX XXX (13 chars)
 * - Mobile (national): 09XX XXX XXX (10 chars)
 * - Landline (international): +421 XX XXX XXXX (13 chars)
 * - Landline (national): 0XX XXX XXXX (10 chars)
 */
export const PHONE_CONSTRAINTS = {
  /** International format length with +421 prefix */
  INTERNATIONAL_LENGTH: 13,
  /** National format length with 0 prefix */
  NATIONAL_LENGTH: 10,
  /** Country code for Slovakia */
  COUNTRY_CODE: '+421',
  /** National prefix */
  NATIONAL_PREFIX: '0',
} as const;
