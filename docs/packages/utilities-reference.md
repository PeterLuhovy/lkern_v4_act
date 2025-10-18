# ================================================================
# Utility Functions Reference
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\packages\utilities-reference.md
# Version: 1.0.0
# Created: 2025-10-18
# Updated: 2025-10-18
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Complete reference for all utility functions in @l-kern/config
#   Includes phone validation, email validation, and date formatting.
# ================================================================

---

## 📋 Overview

This document provides a complete reference for all utility functions available in `@l-kern/config` package. All utilities are fully typed, tested, and support multiple countries/locales.

**Package:** `@l-kern/config`
**Total Utilities:** 3 modules (17 functions)
**Test Coverage:** 100% (123 tests)
**Supported Countries:** SK, CZ, PL
**Supported Locales:** SK, EN

---

## 🎯 Utility Categories

### 1. Phone Utilities (6 functions)
Multi-country phone number validation and formatting.

### 2. Email Utilities (5 functions)
RFC 5322 compliant email validation and manipulation.

### 3. Date Utilities (9 functions)
Locale-aware date formatting and parsing.

---

## 📞 Phone Utilities

**Why they exist:** Different countries have different phone number formats. These utilities handle validation and formatting for SK, CZ, and PL phone numbers with a unified API.

**Supported countries:**
- 🇸🇰 Slovakia (SK) - Default
- 🇨🇿 Czech Republic (CZ)
- 🇵🇱 Poland (PL)

---

### 1. `cleanPhoneNumber(phone: string): string`

**Purpose:** Removes all formatting characters from phone number.

**Use cases:**
- Before storing phone number in database
- Before API submission
- Normalizing user input

**Example:**
```typescript
import { cleanPhoneNumber } from '@l-kern/config';

cleanPhoneNumber('+421 902 123 456') // '+421902123456'
cleanPhoneNumber('0902-123-456')     // '0902123456'
cleanPhoneNumber('(02) 1234 5678')   // '0212345678'
```

**Returns:** String with only digits and `+` sign

---

### 2. `validateMobile(phone: string, countryCode?: 'SK' | 'CZ' | 'PL'): boolean`

**Purpose:** Validates if phone number is a valid mobile number for specific country.

**Use cases:**
- Form validation
- Contact data verification
- SMS sending validation

**Parameters:**
- `phone` - Phone number to validate (any format)
- `countryCode` - Country code (default: 'SK')

**Example:**
```typescript
import { validateMobile } from '@l-kern/config';

// Slovak numbers
validateMobile('+421 902 123 456', 'SK')  // true
validateMobile('0902 123 456')            // true (defaults to SK)
validateMobile('+421 2 1234 5678', 'SK')  // false (landline)

// Czech numbers
validateMobile('+420 777 123 456', 'CZ')  // true
validateMobile('+420 234 567 890', 'CZ')  // false (landline)

// Polish numbers
validateMobile('+48 501 234 567', 'PL')   // true
```

**Valid prefixes by country:**
- **SK:** 900-909, 910-919, 940, 944, 948, 949
- **CZ:** 60X, 70X, 72X, 73X, 77X, 79X
- **PL:** 45, 50, 51, 53, 57, 60, 66, 69, 72, 73, 78, 79, 88

---

### 3. `validateLandlineOrFax(phone: string, countryCode?: 'SK' | 'CZ' | 'PL'): boolean`

**Purpose:** Validates if phone number is a valid landline or fax number.

**Use cases:**
- Company contact validation
- Fax number verification
- Landline-only forms

**Example:**
```typescript
import { validateLandlineOrFax } from '@l-kern/config';

// Slovak numbers
validateLandlineOrFax('+421 2 1234 5678', 'SK')  // true (Bratislava)
validateLandlineOrFax('032 123 4567', 'SK')      // true (Trnava)
validateLandlineOrFax('+421 902 123 456', 'SK')  // false (mobile)

// Czech numbers
validateLandlineOrFax('+420 234 567 890', 'CZ')  // true (Prague)

// Polish numbers
validateLandlineOrFax('+48 22 123 45 67', 'PL')  // true (Warsaw)
```

---

### 4. `formatPhoneNumber(phone: string, type: 'mobile' | 'landline' | 'fax', countryCode?: 'SK' | 'CZ' | 'PL'): string`

**Purpose:** Formats phone number to international standard format.

**Use cases:**
- Display formatted phone numbers in UI
- Consistent phone number presentation
- Export/PDF generation

**Example:**
```typescript
import { formatPhoneNumber } from '@l-kern/config';

// Slovak mobile
formatPhoneNumber('0902123456', 'mobile', 'SK')
// Result: '+421 902 123 456'

// Slovak landline
formatPhoneNumber('0212345678', 'landline', 'SK')
// Result: '+421 2 1234 5678'

// Czech mobile
formatPhoneNumber('777123456', 'mobile', 'CZ')
// Result: '+420 777 123 456'

// Polish mobile
formatPhoneNumber('501234567', 'mobile', 'PL')
// Result: '+48 501 234 567'
```

---

### 5. `detectPhoneType(phone: string, countryCode?: 'SK' | 'CZ' | 'PL'): 'mobile' | 'landline' | 'unknown'`

**Purpose:** Automatically detects if phone number is mobile or landline.

**Use cases:**
- Auto-categorizing phone numbers
- Determining communication channel (SMS vs. call)
- Data import classification

**Example:**
```typescript
import { detectPhoneType } from '@l-kern/config';

detectPhoneType('+421 902 123 456', 'SK')  // 'mobile'
detectPhoneType('02 1234 5678', 'SK')      // 'landline'
detectPhoneType('invalid', 'SK')           // 'unknown'
```

---

### 6. Phone Configuration System

**Purpose:** Extensible configuration for adding new countries.

**How to add new country:**

```typescript
// In phone-configs.ts
export const AT_PHONE_CONFIG: PhoneCountryConfig = {
  countryCode: 'AT',
  dialingCode: '+43',
  nationalPrefix: '0',
  mobile: {
    prefixes: ['650', '660', '664', '676', '680', '681', '688', '699'],
    length: 10,
  },
  landline: {
    areaCodes: ['1', '2', '3', ...],
    minLength: 9,
    maxLength: 11,
  },
  format: {
    mobile: (digits) => `+43 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`,
    landline: (digits) => `+43 ${digits.substring(0, 1)} ${digits.substring(1)}`,
  },
};
```

---

## 📧 Email Utilities

**Why they exist:** Email validation is complex due to RFC 5322 standard. These utilities provide reliable email validation and manipulation following international standards.

---

### 1. `validateEmail(email: string): boolean`

**Purpose:** Validates email address according to RFC 5322 standard.

**Use cases:**
- Form validation
- User registration
- Contact form validation

**Example:**
```typescript
import { validateEmail } from '@l-kern/config';

validateEmail('user@example.com')           // true
validateEmail('first.last@example.co.uk')   // true
validateEmail('user+tag@example.com')       // true
validateEmail('invalid@')                   // false
validateEmail('@invalid.com')               // false
validateEmail('no-at-sign.com')             // false
```

**Validation rules:**
- ✅ Local part max 64 characters
- ✅ Domain part max 255 characters
- ✅ Total max 320 characters
- ✅ Must have exactly one @ symbol
- ✅ No consecutive dots
- ✅ Domain must have at least one dot
- ✅ RFC 5322 compliant regex

---

### 2. `normalizeEmail(email: string): string`

**Purpose:** Normalizes email to lowercase and trims whitespace.

**Use cases:**
- Before storing in database
- Email comparison
- Duplicate detection

**Example:**
```typescript
import { normalizeEmail } from '@l-kern/config';

normalizeEmail('  USER@EXAMPLE.COM  ')  // 'user@example.com'
normalizeEmail('Admin@Domain.SK')       // 'admin@domain.sk'
```

---

### 3. `getEmailDomain(email: string): string`

**Purpose:** Extracts domain from email address.

**Use cases:**
- Domain-based filtering
- Corporate email detection
- Email provider statistics

**Example:**
```typescript
import { getEmailDomain } from '@l-kern/config';

getEmailDomain('user@example.com')              // 'example.com'
getEmailDomain('admin@mail.example.co.uk')      // 'mail.example.co.uk'
getEmailDomain('invalid')                       // ''
```

---

### 4. `getEmailLocal(email: string): string`

**Purpose:** Extracts local part (username) from email address.

**Use cases:**
- Username extraction
- Email analysis
- Display purposes

**Example:**
```typescript
import { getEmailLocal } from '@l-kern/config';

getEmailLocal('user@example.com')       // 'user'
getEmailLocal('first.last@example.com') // 'first.last'
getEmailLocal('user+tag@example.com')   // 'user+tag'
```

---

### 5. `isEmailFromDomain(email: string, domain: string): boolean`

**Purpose:** Checks if email belongs to specific domain.

**Use cases:**
- Corporate email verification
- Domain whitelist/blacklist
- Access control

**Example:**
```typescript
import { isEmailFromDomain } from '@l-kern/config';

isEmailFromDomain('user@example.com', 'example.com')     // true
isEmailFromDomain('user@EXAMPLE.COM', 'example.com')     // true (case-insensitive)
isEmailFromDomain('user@mail.example.com', 'example.com')// false (subdomain)
```

---

## 📅 Date Utilities

**Why they exist:** Different countries use different date formats. SK uses DD.MM.YYYY while EN uses YYYY-MM-DD. These utilities handle locale-aware date formatting and parsing.

**Supported locales:**
- 🇸🇰 Slovak (SK) - DD.MM.YYYY
- 🇬🇧 English (EN) - YYYY-MM-DD

---

### 1. `formatDate(date: Date | string, locale: 'sk' | 'en'): string`

**Purpose:** Formats Date object to localized string.

**Use cases:**
- Display dates in UI
- Export to CSV/PDF
- API responses

**Example:**
```typescript
import { formatDate } from '@l-kern/config';

const date = new Date(2025, 9, 18); // October 18, 2025

formatDate(date, 'sk')  // '18.10.2025'
formatDate(date, 'en')  // '2025-10-18'

// Also accepts ISO strings
formatDate('2025-10-18T10:30:00Z', 'sk')  // '18.10.2025'
```

---

### 2. `formatDateTime(date: Date | string, locale: 'sk' | 'en'): string`

**Purpose:** Formats Date object to localized datetime string.

**Example:**
```typescript
import { formatDateTime } from '@l-kern/config';

const date = new Date(2025, 9, 18, 14, 30);

formatDateTime(date, 'sk')  // '18.10.2025 14:30'
formatDateTime(date, 'en')  // '2025-10-18 14:30'
```

---

### 3. `parseDate(dateString: string, locale: 'sk' | 'en'): Date | null`

**Purpose:** Parses localized date string to Date object.

**Use cases:**
- Form input parsing
- API request processing
- Data import

**Example:**
```typescript
import { parseDate } from '@l-kern/config';

// Slovak format
const dateSK = parseDate('18.10.2025', 'sk');
// Result: Date(2025, 9, 18)

// English format
const dateEN = parseDate('2025-10-18', 'en');
// Result: Date(2025, 9, 18)

// Invalid dates return null
parseDate('31.02.2025', 'sk')  // null (February has max 29 days)
parseDate('invalid', 'sk')     // null
```

---

### 4. `validateDate(dateString: string, locale: 'sk' | 'en'): boolean`

**Purpose:** Validates if date string is valid in specific locale format.

**Example:**
```typescript
import { validateDate } from '@l-kern/config';

validateDate('18.10.2025', 'sk')  // true
validateDate('2025-10-18', 'en')  // true
validateDate('31.02.2025', 'sk')  // false (invalid date)
validateDate('18-10-2025', 'sk')  // false (wrong format)
```

---

### 5. `convertDateLocale(dateString: string, fromLocale: 'sk' | 'en', toLocale: 'sk' | 'en'): string`

**Purpose:** Converts date string from one locale format to another.

**Use cases:**
- API data transformation
- Export format conversion
- Internationalization

**Example:**
```typescript
import { convertDateLocale } from '@l-kern/config';

convertDateLocale('18.10.2025', 'sk', 'en')  // '2025-10-18'
convertDateLocale('2025-10-18', 'en', 'sk')  // '18.10.2025'
```

---

### 6. `getToday(locale: 'sk' | 'en'): string`

**Purpose:** Gets current date formatted in specified locale.

**Example:**
```typescript
import { getToday } from '@l-kern/config';

getToday('sk')  // '18.10.2025'
getToday('en')  // '2025-10-18'
```

---

### 7. `isToday(dateString: string, locale: 'sk' | 'en'): boolean`

**Purpose:** Checks if date string represents today's date.

**Example:**
```typescript
import { isToday } from '@l-kern/config';

isToday('18.10.2025', 'sk')  // true (if today is Oct 18, 2025)
isToday('17.10.2025', 'sk')  // false
```

---

### 8. `addDays(date: Date | string, days: number, locale: 'sk' | 'en'): string`

**Purpose:** Adds (or subtracts) days to a date.

**Example:**
```typescript
import { addDays } from '@l-kern/config';

addDays('18.10.2025', 5, 'sk')    // '23.10.2025'
addDays('18.10.2025', -3, 'sk')   // '15.10.2025'
addDays('2025-10-18', 7, 'en')    // '2025-10-25'
```

---

### 9. `getDaysDifference(date1: Date | string, date2: Date | string, locale: 'sk' | 'en'): number`

**Purpose:** Calculates difference in days between two dates.

**Example:**
```typescript
import { getDaysDifference } from '@l-kern/config';

getDaysDifference('23.10.2025', '18.10.2025', 'sk')  // 5
getDaysDifference('18.10.2025', '23.10.2025', 'sk')  // -5
```

---

## 📊 Utility Statistics

| Category | Functions | Total Tests | Coverage |
|----------|-----------|-------------|----------|
| **Phone Utilities** | 6 | 35 | 100% |
| **Email Utilities** | 5 | 43 | 100% |
| **Date Utilities** | 9 | 45 | 100% |
| **TOTAL** | **20** | **123** | **100%** |

---

## 🎯 Common Use Cases

### User Registration Form

```typescript
import { validateEmail, validateMobile, formatPhoneNumber } from '@l-kern/config';

function validateRegistrationForm(data: RegistrationData) {
  const errors: Record<string, string> = {};

  // Email validation
  if (!validateEmail(data.email)) {
    errors.email = t('forms.errors.invalidEmail');
  }

  // Phone validation (optional field)
  if (data.phone && !validateMobile(data.phone, 'SK')) {
    errors.phone = t('forms.errors.invalidPhone');
  }

  return errors;
}

// Format phone before saving
const formattedPhone = formatPhoneNumber(data.phone, 'mobile', 'SK');
```

### Date Range Picker

```typescript
import { formatDate, parseDate, getDaysDifference } from '@l-kern/config';

function DateRangePicker() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const daysDiff = getDaysDifference(endDate, startDate, 'sk');

  return (
    <div>
      <Input
        type="text"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        placeholder="DD.MM.YYYY"
      />
      <Input
        type="text"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        placeholder="DD.MM.YYYY"
      />
      <p>Selected range: {daysDiff} days</p>
    </div>
  );
}
```

### Contact Form with Multi-Country Support

```typescript
import { validateMobile, validateEmail, formatPhoneNumber } from '@l-kern/config';

function ContactForm() {
  const [country, setCountry] = useState<'SK' | 'CZ' | 'PL'>('SK');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const isPhoneValid = validateMobile(phone, country);
  const isEmailValid = validateEmail(email);

  const handleSubmit = () => {
    const formattedPhone = formatPhoneNumber(phone, 'mobile', country);
    // Submit formattedPhone and email
  };

  return (
    <form onSubmit={handleSubmit}>
      <Select
        options={[
          { value: 'SK', label: '🇸🇰 Slovakia' },
          { value: 'CZ', label: '🇨🇿 Czech Republic' },
          { value: 'PL', label: '🇵🇱 Poland' },
        ]}
        value={country}
        onChange={(e) => setCountry(e.target.value as any)}
      />

      <Input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        error={!isPhoneValid}
      />

      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!isEmailValid}
      />

      <Button type="submit" disabled={!isPhoneValid || !isEmailValid}>
        {t('common.submit')}
      </Button>
    </form>
  );
}
```

---

## 🧪 Interactive Testing

**Test Page:** Visit `/utility-test` in web-ui to interactively test all utility functions.

Features:
- Real-time validation feedback
- Multi-country phone testing (SK, CZ, PL)
- Email validation with examples
- Date format conversion (SK/EN)
- Click-to-try examples

---

## 🔗 Related Documentation

- [Package Documentation](./config.md) - Setup and installation
- [Coding Standards](../programming/coding-standards.md) - Usage guidelines
- [Code Examples](../programming/code-examples.md) - Practical examples

---

**Last Updated:** 2025-10-18
**Maintainer:** BOSSystems s.r.o.
