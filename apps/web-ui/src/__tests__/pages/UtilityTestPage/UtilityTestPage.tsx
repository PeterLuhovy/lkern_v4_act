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

import React, { useState } from 'react';
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
