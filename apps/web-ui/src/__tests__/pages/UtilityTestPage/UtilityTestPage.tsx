/*
 * ================================================================
 * FILE: UtilityTestPage.tsx
 * PATH: /apps/web-ui/src/pages/testing/UtilityTestPage/UtilityTestPage.tsx
 * DESCRIPTION: Testing page for utility functions (phone, email, date)
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
 * UPDATED: 2025-10-18 21:15:00
 * ================================================================
 */

import React, { useState, useMemo } from 'react';
import { useTranslation } from '@l-kern/config';
import {
  validateMobile,
  validateLandlineOrFax,
  formatPhoneNumber,
  detectPhoneType,
  type PhoneCountryCode,
  type PhoneType,
  validateEmail,
  normalizeEmail,
  getEmailDomain,
  formatDate,
  parseDate,
  convertDateLocale,
  type DateLocale,
  debounce,
  validateField,
  type ValidationType,
} from '@l-kern/config';
import { Input, Button, Card, Badge, BasePage } from '@l-kern/ui-components';
import styles from './UtilityTestPage.module.css';

export function UtilityTestPage() {
  const { t } = useTranslation();

  // Phone testing state
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneCountry, setPhoneCountry] = useState<PhoneCountryCode>('SK');
  const [phoneType, setPhoneType] = useState<PhoneType>('mobile');

  // Email testing state
  const [emailInput, setEmailInput] = useState('');

  // Date testing state
  const [dateInput, setDateInput] = useState('');
  const [dateLocale, setDateLocale] = useState<DateLocale>('sk');

  // Validation testing state
  const [debounceInput, setDebounceInput] = useState('');
  const [debounceDelay, setDebounceDelay] = useState(500);
  const [debouncedValue, setDebouncedValue] = useState('');
  const [debounceCallCount, setDebounceCallCount] = useState(0);
  const [debouncePreventedCount, setDebouncePreventedCount] = useState(0);

  const [validationType, setValidationType] = useState<ValidationType>('email');
  const [validationInput, setValidationInput] = useState('');
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; error?: string } | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Memoized debounced function
  const debouncedHandler = useMemo(() =>
    debounce((value: string) => {
      setDebouncedValue(value);
      setDebounceCallCount(prev => prev + 1);
    }, debounceDelay),
    [debounceDelay]
  );

  // Phone test results
  const phoneResults = {
    isMobile: validateMobile(phoneInput, phoneCountry),
    isLandline: validateLandlineOrFax(phoneInput, phoneCountry),
    formatted: formatPhoneNumber(phoneInput, phoneType, phoneCountry),
    detectedType: detectPhoneType(phoneInput, phoneCountry),
  };

  // Email test results
  const emailResults = {
    isValid: validateEmail(emailInput),
    normalized: normalizeEmail(emailInput),
    domain: getEmailDomain(emailInput),
  };

  // Date test results
  const dateResults = {
    formatted: dateInput ? formatDate(dateInput, dateLocale) : '',
    parsed: parseDate(dateInput, dateLocale),
    converted: dateInput ? convertDateLocale(dateInput, dateLocale, dateLocale === 'sk' ? 'en' : 'sk') : '',
  };

  // Validation handlers
  const handleDebounceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDebounceInput(value);
    setDebouncePreventedCount(prev => prev + 1);
    debouncedHandler(value);
  };

  const handleValidationInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValidationInput(value);

    if (!value) {
      setValidationResult(null);
      setIsValidating(false);
      return;
    }

    setIsValidating(true);
    // Simulate async validation delay to show Promise-based API
    await new Promise(resolve => setTimeout(resolve, 300));
    const result = await validateField('testField', value, validationType);
    setValidationResult(result);
    setIsValidating(false);
  };

  const handleValidationExample = async (value: string) => {
    setValidationInput(value);

    if (!value) {
      setValidationResult(null);
      setIsValidating(false);
      return;
    }

    setIsValidating(true);
    // Simulate async validation delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const result = await validateField('testField', value, validationType);
    setValidationResult(result);
    setIsValidating(false);
  };

  return (
    <BasePage>
      <div className={styles.container}>
        <h1 className={styles.title}>
          {t('pages.utilityTest.title')}
        </h1>
        <p className={styles.subtitle}>
          {t('pages.utilityTest.subtitle')}
        </p>

        {/* Phone Utilities Section */}
        <Card className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>
            📞 {t('pages.utilityTest.phone.title')}
          </h2>
          <p className={styles.sectionDescription}>
            <strong>Funkcie:</strong> validateMobile(), validateLandlineOrFax(), formatPhoneNumber(), detectPhoneType() |
            <strong> Krajiny:</strong> SK, CZ, PL
          </p>

          <div className={styles.formRow}>
            <label className={styles.formLabel}>
              {t('pages.utilityTest.phone.country')}:
              <select
                value={phoneCountry}
                onChange={(e) => setPhoneCountry(e.target.value as PhoneCountryCode)}
                className={styles.formSelect}
              >
                <option value="SK">🇸🇰 Slovakia (SK)</option>
                <option value="CZ">🇨🇿 Czech Republic (CZ)</option>
                <option value="PL">🇵🇱 Poland (PL)</option>
              </select>
            </label>

            <label className={styles.formLabel}>
              {t('pages.utilityTest.phone.type')}:
              <select
                value={phoneType}
                onChange={(e) => setPhoneType(e.target.value as PhoneType)}
                className={styles.formSelect}
              >
                <option value="mobile">{t('pages.utilityTest.phone.types.mobile')}</option>
                <option value="landline">{t('pages.utilityTest.phone.types.landline')}</option>
                <option value="fax">{t('pages.utilityTest.phone.types.fax')}</option>
              </select>
            </label>
          </div>

          <Input
            type="text"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            placeholder={t('pages.utilityTest.phone.placeholder')}
            fullWidth
          />

          <div className={styles.resultsContainer}>
            <h3 className={styles.resultsTitle}>
              {t('pages.utilityTest.results.title')}:
            </h3>
            <div className={styles.resultRow}>
              <strong className={styles.resultLabel}>{t('pages.utilityTest.phone.results.isMobile')}:</strong>
              <Badge variant={phoneResults.isMobile ? 'success' : 'error'}>
                {phoneResults.isMobile ? t('common.yes') : t('common.no')}
              </Badge>
            </div>
            <div className={styles.resultRow}>
              <strong className={styles.resultLabel}>{t('pages.utilityTest.phone.results.isLandline')}:</strong>
              <Badge variant={phoneResults.isLandline ? 'success' : 'error'}>
                {phoneResults.isLandline ? t('common.yes') : t('common.no')}
              </Badge>
            </div>
            <div className={styles.resultRow}>
              <strong className={styles.resultLabel}>{t('pages.utilityTest.phone.results.formatted')}:</strong>
              <code className={styles.resultCode}>
                {phoneResults.formatted || t('pages.utilityTest.results.empty')}
              </code>
            </div>
            <div className={styles.resultRow}>
              <strong className={styles.resultLabel}>{t('pages.utilityTest.phone.results.detectedType')}:</strong>
              <Badge variant={phoneResults.detectedType === 'unknown' ? 'neutral' : 'info'}>
                {phoneResults.detectedType}
              </Badge>
            </div>
          </div>

          <div className={styles.examplesContainer}>
            <h4 className={styles.examplesTitle}>
              {t('pages.utilityTest.examples.title')}:
            </h4>
            <ul className={styles.examplesList}>
              {phoneCountry === 'SK' && (
                <>
                  <li onClick={() => setPhoneInput('+421 902 123 456')} className={styles.exampleItem}>
                    🇸🇰 +421 902 123 456 (mobile)
                  </li>
                  <li onClick={() => setPhoneInput('0902 123 456')} className={styles.exampleItem}>
                    🇸🇰 0902 123 456 (mobile national)
                  </li>
                  <li onClick={() => setPhoneInput('+421 2 1234 5678')} className={styles.exampleItem}>
                    🇸🇰 +421 2 1234 5678 (Bratislava)
                  </li>
                  <li onClick={() => setPhoneInput('032 123 4567')} className={styles.exampleItem}>
                    🇸🇰 032 123 4567 (Trnava)
                  </li>
                </>
              )}
              {phoneCountry === 'CZ' && (
                <>
                  <li onClick={() => setPhoneInput('+420 777 123 456')} className={styles.exampleItem}>
                    🇨🇿 +420 777 123 456 (mobile)
                  </li>
                  <li onClick={() => setPhoneInput('+420 234 567 890')} className={styles.exampleItem}>
                    🇨🇿 +420 234 567 890 (Prague)
                  </li>
                </>
              )}
              {phoneCountry === 'PL' && (
                <>
                  <li onClick={() => setPhoneInput('+48 501 234 567')} className={styles.exampleItem}>
                    🇵🇱 +48 501 234 567 (mobile)
                  </li>
                  <li onClick={() => setPhoneInput('+48 22 123 45 67')} className={styles.exampleItem}>
                    🇵🇱 +48 22 123 45 67 (Warsaw)
                  </li>
                </>
              )}
            </ul>
          </div>
        </Card>

        {/* Email Utilities Section */}
        <Card className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>
            📧 {t('pages.utilityTest.email.title')}
          </h2>
          <p className={styles.sectionDescription}>
            <strong>Funkcie:</strong> validateEmail(), normalizeEmail(), getEmailDomain() |
            <strong> RFC 5322 compliant</strong>
          </p>

          <Input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder={t('pages.utilityTest.email.placeholder')}
            fullWidth
          />

          <div className={styles.resultsContainer}>
            <h3 className={styles.resultsTitle}>
              {t('pages.utilityTest.results.title')}:
            </h3>
            <div className={styles.resultRow}>
              <strong className={styles.resultLabel}>{t('pages.utilityTest.email.results.isValid')}:</strong>
              <Badge variant={emailResults.isValid ? 'success' : 'error'}>
                {emailResults.isValid ? t('common.yes') : t('common.no')}
              </Badge>
            </div>
            <div className={styles.resultRow}>
              <strong className={styles.resultLabel}>{t('pages.utilityTest.email.results.normalized')}:</strong>
              <code className={styles.resultCode}>
                {emailResults.normalized || t('pages.utilityTest.results.empty')}
              </code>
            </div>
            <div className={styles.resultRow}>
              <strong className={styles.resultLabel}>{t('pages.utilityTest.email.results.domain')}:</strong>
              <code className={styles.resultCode}>
                {emailResults.domain || t('pages.utilityTest.results.empty')}
              </code>
            </div>
          </div>

          <div className={styles.examplesContainer}>
            <h4 className={styles.examplesTitle}>
              {t('pages.utilityTest.examples.title')}:
            </h4>
            <ul className={styles.examplesList}>
              <li onClick={() => setEmailInput('user@example.com')} className={styles.exampleItem}>
                ✉️ user@example.com
              </li>
              <li onClick={() => setEmailInput('first.last+tag@example.co.uk')} className={styles.exampleItem}>
                ✉️ first.last+tag@example.co.uk
              </li>
              <li onClick={() => setEmailInput('ADMIN@DOMAIN.SK')} className={styles.exampleItem}>
                ✉️ ADMIN@DOMAIN.SK (uppercase)
              </li>
              <li onClick={() => setEmailInput('invalid@')} className={styles.exampleItem}>
                ❌ invalid@ (invalid)
              </li>
            </ul>
          </div>
        </Card>

        {/* Date Utilities Section */}
        <Card className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>
            📅 {t('pages.utilityTest.date.title')}
          </h2>
          <p className={styles.sectionDescription}>
            <strong>Funkcie:</strong> formatDate(), parseDate(), convertDateLocale() |
            <strong> Lokalizácia:</strong> SK (DD.MM.YYYY), EN (YYYY-MM-DD)
          </p>

          <div className={styles.formRow}>
            <label className={styles.formLabel}>
              {t('pages.utilityTest.date.locale')}:
              <select
                value={dateLocale}
                onChange={(e) => setDateLocale(e.target.value as DateLocale)}
                className={styles.formSelect}
              >
                <option value="sk">🇸🇰 Slovak (DD.MM.YYYY)</option>
                <option value="en">🇬🇧 English (YYYY-MM-DD)</option>
              </select>
            </label>
          </div>

          <Input
            type="text"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            placeholder={dateLocale === 'sk' ? '18.10.2025' : '2025-10-18'}
            fullWidth
          />

          <div className={styles.resultsContainer}>
            <h3 className={styles.resultsTitle}>
              {t('pages.utilityTest.results.title')}:
            </h3>
            <div className={styles.resultRow}>
              <strong className={styles.resultLabel}>{t('pages.utilityTest.date.results.formatted')}:</strong>
              <code className={styles.resultCode}>
                {dateResults.formatted || t('pages.utilityTest.results.empty')}
              </code>
            </div>
            <div className={styles.resultRow}>
              <strong className={styles.resultLabel}>{t('pages.utilityTest.date.results.parsed')}:</strong>
              <code className={styles.resultCode}>
                {dateResults.parsed ? dateResults.parsed.toISOString() : t('pages.utilityTest.results.invalid')}
              </code>
            </div>
            <div className={styles.resultRow}>
              <strong className={styles.resultLabel}>{t('pages.utilityTest.date.results.converted')}:</strong>
              <code className={styles.resultCode}>
                {dateResults.converted || t('pages.utilityTest.results.empty')}
              </code>
            </div>
          </div>

          <div className={styles.examplesContainer}>
            <h4 className={styles.examplesTitle}>
              {t('pages.utilityTest.examples.title')}:
            </h4>
            <ul className={styles.examplesList}>
              {dateLocale === 'sk' && (
                <>
                  <li onClick={() => setDateInput('18.10.2025')} className={styles.exampleItem}>
                    📅 18.10.2025 (today)
                  </li>
                  <li onClick={() => setDateInput('01.01.2025')} className={styles.exampleItem}>
                    📅 01.01.2025 (new year)
                  </li>
                  <li onClick={() => setDateInput('31.02.2025')} className={styles.exampleItem}>
                    ❌ 31.02.2025 (invalid)
                  </li>
                </>
              )}
              {dateLocale === 'en' && (
                <>
                  <li onClick={() => setDateInput('2025-10-18')} className={styles.exampleItem}>
                    📅 2025-10-18 (today)
                  </li>
                  <li onClick={() => setDateInput('2025-01-01')} className={styles.exampleItem}>
                    📅 2025-01-01 (new year)
                  </li>
                  <li onClick={() => setDateInput('2025-02-31')} className={styles.exampleItem}>
                    ❌ 2025-02-31 (invalid)
                  </li>
                </>
              )}
            </ul>
          </div>
        </Card>

        {/* Validation Utilities Section */}
        <Card className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>
            🔍 {t('pages.utilityTest.validation.title')}
          </h2>
          <p className={styles.sectionDescription}>
            <strong>Funkcie:</strong> debounce(), validateField() |
            <strong> Async API:</strong> Promise-based validation |
            <strong> Typy:</strong> email, phone, url, required
          </p>

          {/* Debounce Demo */}
          <h3 className={styles.subsectionTitle}>
            ⏱️ {t('pages.utilityTest.validation.debounce.title')}
          </h3>
          <p className={styles.testDescription}>
            {t('pages.utilityTest.validation.debounce.description')}
          </p>

          <div className={styles.formRow}>
            <label className={styles.formLabel}>
              {t('pages.utilityTest.validation.debounce.delay')}:
              <input
                type="number"
                value={debounceDelay}
                onChange={(e) => {
                  setDebounceDelay(Number(e.target.value));
                  setDebounceCallCount(0);
                  setDebouncePreventedCount(0);
                  setDebouncedValue('');
                }}
                className={styles.formSelect}
                min={0}
                max={5000}
                step={100}
              />
            </label>
          </div>

          <Input
            type="text"
            value={debounceInput}
            onChange={handleDebounceInput}
            placeholder={t('pages.utilityTest.validation.debounce.input')}
            fullWidth
          />

          <div className={styles.resultsContainer}>
            <h3 className={styles.resultsTitle}>
              {t('pages.utilityTest.results.title')}:
            </h3>
            <div className={styles.resultRow}>
              <strong className={styles.resultLabel}>{t('pages.utilityTest.validation.debounce.lastValue')}:</strong>
              <code className={styles.resultCode}>
                {debouncedValue || t('pages.utilityTest.results.empty')}
              </code>
            </div>
            <div className={styles.resultRow}>
              <strong className={styles.resultLabel}>{t('pages.utilityTest.validation.debounce.callCount')}:</strong>
              <Badge variant="info">{debounceCallCount}</Badge>
            </div>
            <div className={styles.resultRow}>
              <strong className={styles.resultLabel}>{t('pages.utilityTest.validation.debounce.preventedCount')}:</strong>
              <Badge variant="neutral">{debouncePreventedCount - debounceCallCount}</Badge>
            </div>
          </div>

          {/* ValidateField Demo */}
          <h3 className={styles.subsectionTitle} style={{ marginTop: '24px' }}>
            ✅ {t('pages.utilityTest.validation.validateField.title')}
          </h3>
          <p className={styles.testDescription}>
            {t('pages.utilityTest.validation.validateField.description')}
            <br />
            <em style={{ color: 'var(--color-status-info)' }}>
              ⚡ Promise-based API s async delay (simulácia backend validácie)
            </em>
          </p>

          <div className={styles.formRow}>
            <label className={styles.formLabel}>
              {t('pages.utilityTest.validation.validateField.validationType')}:
              <select
                value={validationType}
                onChange={(e) => {
                  setValidationType(e.target.value as ValidationType);
                  setValidationInput('');
                  setValidationResult(null);
                }}
                className={styles.formSelect}
              >
                <option value="email">{t('pages.utilityTest.validation.validateField.types.email')}</option>
                <option value="phone">{t('pages.utilityTest.validation.validateField.types.phone')}</option>
                <option value="url">{t('pages.utilityTest.validation.validateField.types.url')}</option>
                <option value="required">{t('pages.utilityTest.validation.validateField.types.required')}</option>
              </select>
            </label>
          </div>

          <Input
            type="text"
            value={validationInput}
            onChange={handleValidationInput}
            placeholder={t('pages.utilityTest.validation.validateField.testInput')}
            fullWidth
          />

          {isValidating && (
            <div className={styles.resultsContainer}>
              <div className={styles.resultRow}>
                <strong className={styles.resultLabel}>⏳ Validating...</strong>
                <Badge variant="warning">Processing</Badge>
              </div>
            </div>
          )}

          {!isValidating && validationResult && (
            <div className={styles.resultsContainer}>
              <h3 className={styles.resultsTitle}>
                {t('pages.utilityTest.results.title')}:
              </h3>
              <div className={styles.resultRow}>
                <strong className={styles.resultLabel}>{t('pages.utilityTest.validation.validateField.results.isValid')}:</strong>
                <Badge variant={validationResult.isValid ? 'success' : 'error'}>
                  {validationResult.isValid ? t('common.yes') : t('common.no')}
                </Badge>
              </div>
              {validationResult.error && (
                <div className={styles.resultRow}>
                  <strong className={styles.resultLabel}>{t('pages.utilityTest.validation.validateField.results.error')}:</strong>
                  <code className={styles.resultCode} style={{ color: 'var(--color-status-error)' }}>
                    {validationResult.error}
                  </code>
                </div>
              )}
              {validationResult.metadata?.phoneType && (
                <div className={styles.resultRow}>
                  <strong className={styles.resultLabel}>Phone Type:</strong>
                  <code className={styles.resultCode}>{validationResult.metadata.phoneType}</code>
                </div>
              )}
              {validationResult.metadata?.formattedPhone && (
                <div className={styles.resultRow}>
                  <strong className={styles.resultLabel}>Formatted:</strong>
                  <code className={styles.resultCode}>{validationResult.metadata.formattedPhone}</code>
                </div>
              )}
              {validationResult.metadata?.countryCode && (
                <div className={styles.resultRow}>
                  <strong className={styles.resultLabel}>Country Code:</strong>
                  <code className={styles.resultCode}>{validationResult.metadata.countryCode}</code>
                </div>
              )}
              {validationResult.metadata?.emailDomain && (
                <div className={styles.resultRow}>
                  <strong className={styles.resultLabel}>Domain:</strong>
                  <code className={styles.resultCode}>{validationResult.metadata.emailDomain}</code>
                </div>
              )}
              {validationResult.metadata?.normalizedEmail && (
                <div className={styles.resultRow}>
                  <strong className={styles.resultLabel}>Normalized:</strong>
                  <code className={styles.resultCode}>{validationResult.metadata.normalizedEmail}</code>
                </div>
              )}
            </div>
          )}

          <div className={styles.examplesContainer}>
            <h4 className={styles.examplesTitle}>
              {t('pages.utilityTest.examples.title')}:
            </h4>
            <ul className={styles.examplesList}>
              {validationType === 'email' && (
                <>
                  <li onClick={() => handleValidationExample('user@example.com')} className={styles.exampleItem}>
                    ✉️ user@example.com (valid)
                  </li>
                  <li onClick={() => handleValidationExample('invalid@')} className={styles.exampleItem}>
                    ❌ invalid@ (invalid)
                  </li>
                </>
              )}
              {validationType === 'phone' && (
                <>
                  <li onClick={() => handleValidationExample('+421902123456')} className={styles.exampleItem}>
                    📱 +421902123456 (mobile SK)
                  </li>
                  <li onClick={() => handleValidationExample('+421212345678')} className={styles.exampleItem}>
                    📞 +421212345678 (landline SK)
                  </li>
                  <li onClick={() => handleValidationExample('123')} className={styles.exampleItem}>
                    ❌ 123 (invalid)
                  </li>
                </>
              )}
              {validationType === 'url' && (
                <>
                  <li onClick={() => handleValidationExample('https://example.com')} className={styles.exampleItem}>
                    🌐 https://example.com (valid)
                  </li>
                  <li onClick={() => handleValidationExample('example.com')} className={styles.exampleItem}>
                    ❌ example.com (invalid - no protocol)
                  </li>
                </>
              )}
              {validationType === 'required' && (
                <>
                  <li onClick={() => handleValidationExample('Some text')} className={styles.exampleItem}>
                    ✅ Some text (valid)
                  </li>
                  <li onClick={() => handleValidationExample('')} className={styles.exampleItem}>
                    ❌ (empty - invalid)
                  </li>
                </>
              )}
            </ul>
          </div>
        </Card>

        <div className={styles.infoBox}>
          <h3 className={styles.infoTitle}>
            ℹ️ {t('pages.utilityTest.info.title')}
          </h3>
          <p className={styles.infoDescription}>
            {t('pages.utilityTest.info.description')}
          </p>
          <ul className={styles.infoList}>
            <li className={styles.infoListItem}>
              <strong className={styles.infoListItemStrong}>Phone:</strong> Multi-country support (SK, CZ, PL)
            </li>
            <li className={styles.infoListItem}>
              <strong className={styles.infoListItemStrong}>Email:</strong> RFC 5322 compliant validation
            </li>
            <li className={styles.infoListItem}>
              <strong className={styles.infoListItemStrong}>Date:</strong> SK/EN locale formatting
            </li>
          </ul>
        </div>
      </div>
    </BasePage>
  );
}
