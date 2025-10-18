/*
 * ================================================================
 * FILE: UtilityTestPage.tsx
 * PATH: /apps/web-ui/src/pages/UtilityTestPage.tsx
 * DESCRIPTION: Testing page for utility functions (phone, email, date)
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
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
import { Input, Button, Card, Badge } from '@l-kern/ui-components';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import './UtilityTestPage.css';

export function UtilityTestPage() {
  const { t } = useTranslation();

  // Enable global keyboard shortcuts
  useKeyboardShortcuts();

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
    <div className="utility-test-page">
      <h1>{t('pages.utilityTest.title')}</h1>
      <p className="subtitle">{t('pages.utilityTest.subtitle')}</p>

      {/* Phone Utilities Section */}
      <Card className="test-section">
        <h2>📞 {t('pages.utilityTest.phone.title')}</h2>

        <div className="input-group">
          <label>
            {t('pages.utilityTest.phone.country')}:
            <select value={phoneCountry} onChange={(e) => setPhoneCountry(e.target.value as PhoneCountryCode)}>
              <option value="SK">🇸🇰 Slovakia (SK)</option>
              <option value="CZ">🇨🇿 Czech Republic (CZ)</option>
              <option value="PL">🇵🇱 Poland (PL)</option>
            </select>
          </label>

          <label>
            {t('pages.utilityTest.phone.type')}:
            <select value={phoneType} onChange={(e) => setPhoneType(e.target.value as PhoneType)}>
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

        <div className="results">
          <h3>{t('pages.utilityTest.results.title')}:</h3>
          <div className="result-item">
            <strong>{t('pages.utilityTest.phone.results.isMobile')}:</strong>
            <Badge variant={phoneResults.isMobile ? 'success' : 'error'}>
              {phoneResults.isMobile ? t('common.yes') : t('common.no')}
            </Badge>
          </div>
          <div className="result-item">
            <strong>{t('pages.utilityTest.phone.results.isLandline')}:</strong>
            <Badge variant={phoneResults.isLandline ? 'success' : 'error'}>
              {phoneResults.isLandline ? t('common.yes') : t('common.no')}
            </Badge>
          </div>
          <div className="result-item">
            <strong>{t('pages.utilityTest.phone.results.formatted')}:</strong>
            <code>{phoneResults.formatted || t('pages.utilityTest.results.empty')}</code>
          </div>
          <div className="result-item">
            <strong>{t('pages.utilityTest.phone.results.detectedType')}:</strong>
            <Badge variant={phoneResults.detectedType === 'unknown' ? 'neutral' : 'info'}>
              {phoneResults.detectedType}
            </Badge>
          </div>
        </div>

        <div className="examples">
          <h4>{t('pages.utilityTest.examples.title')}:</h4>
          <ul>
            {phoneCountry === 'SK' && (
              <>
                <li onClick={() => setPhoneInput('+421 902 123 456')}>🇸🇰 +421 902 123 456 (mobile)</li>
                <li onClick={() => setPhoneInput('0902 123 456')}>🇸🇰 0902 123 456 (mobile national)</li>
                <li onClick={() => setPhoneInput('+421 2 1234 5678')}>🇸🇰 +421 2 1234 5678 (Bratislava)</li>
                <li onClick={() => setPhoneInput('032 123 4567')}>🇸🇰 032 123 4567 (Trnava)</li>
              </>
            )}
            {phoneCountry === 'CZ' && (
              <>
                <li onClick={() => setPhoneInput('+420 777 123 456')}>🇨🇿 +420 777 123 456 (mobile)</li>
                <li onClick={() => setPhoneInput('+420 234 567 890')}>🇨🇿 +420 234 567 890 (Prague)</li>
              </>
            )}
            {phoneCountry === 'PL' && (
              <>
                <li onClick={() => setPhoneInput('+48 501 234 567')}>🇵🇱 +48 501 234 567 (mobile)</li>
                <li onClick={() => setPhoneInput('+48 22 123 45 67')}>🇵🇱 +48 22 123 45 67 (Warsaw)</li>
              </>
            )}
          </ul>
        </div>
      </Card>

      {/* Email Utilities Section */}
      <Card className="test-section">
        <h2>📧 {t('pages.utilityTest.email.title')}</h2>

        <Input
          type="email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          placeholder={t('pages.utilityTest.email.placeholder')}
          fullWidth
        />

        <div className="results">
          <h3>{t('pages.utilityTest.results.title')}:</h3>
          <div className="result-item">
            <strong>{t('pages.utilityTest.email.results.isValid')}:</strong>
            <Badge variant={emailResults.isValid ? 'success' : 'error'}>
              {emailResults.isValid ? t('common.yes') : t('common.no')}
            </Badge>
          </div>
          <div className="result-item">
            <strong>{t('pages.utilityTest.email.results.normalized')}:</strong>
            <code>{emailResults.normalized || t('pages.utilityTest.results.empty')}</code>
          </div>
          <div className="result-item">
            <strong>{t('pages.utilityTest.email.results.domain')}:</strong>
            <code>{emailResults.domain || t('pages.utilityTest.results.empty')}</code>
          </div>
        </div>

        <div className="examples">
          <h4>{t('pages.utilityTest.examples.title')}:</h4>
          <ul>
            <li onClick={() => setEmailInput('user@example.com')}>✉️ user@example.com</li>
            <li onClick={() => setEmailInput('first.last+tag@example.co.uk')}>✉️ first.last+tag@example.co.uk</li>
            <li onClick={() => setEmailInput('ADMIN@DOMAIN.SK')}>✉️ ADMIN@DOMAIN.SK (uppercase)</li>
            <li onClick={() => setEmailInput('invalid@')}>❌ invalid@ (invalid)</li>
          </ul>
        </div>
      </Card>

      {/* Date Utilities Section */}
      <Card className="test-section">
        <h2>📅 {t('pages.utilityTest.date.title')}</h2>

        <div className="input-group">
          <label>
            {t('pages.utilityTest.date.locale')}:
            <select value={dateLocale} onChange={(e) => setDateLocale(e.target.value as DateLocale)}>
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

        <div className="results">
          <h3>{t('pages.utilityTest.results.title')}:</h3>
          <div className="result-item">
            <strong>{t('pages.utilityTest.date.results.formatted')}:</strong>
            <code>{dateResults.formatted || t('pages.utilityTest.results.empty')}</code>
          </div>
          <div className="result-item">
            <strong>{t('pages.utilityTest.date.results.parsed')}:</strong>
            <code>{dateResults.parsed ? dateResults.parsed.toISOString() : t('pages.utilityTest.results.invalid')}</code>
          </div>
          <div className="result-item">
            <strong>{t('pages.utilityTest.date.results.converted')}:</strong>
            <code>{dateResults.converted || t('pages.utilityTest.results.empty')}</code>
          </div>
        </div>

        <div className="examples">
          <h4>{t('pages.utilityTest.examples.title')}:</h4>
          <ul>
            {dateLocale === 'sk' && (
              <>
                <li onClick={() => setDateInput('18.10.2025')}>📅 18.10.2025 (today)</li>
                <li onClick={() => setDateInput('01.01.2025')}>📅 01.01.2025 (new year)</li>
                <li onClick={() => setDateInput('31.02.2025')}>❌ 31.02.2025 (invalid)</li>
              </>
            )}
            {dateLocale === 'en' && (
              <>
                <li onClick={() => setDateInput('2025-10-18')}>📅 2025-10-18 (today)</li>
                <li onClick={() => setDateInput('2025-01-01')}>📅 2025-01-01 (new year)</li>
                <li onClick={() => setDateInput('2025-02-31')}>❌ 2025-02-31 (invalid)</li>
              </>
            )}
          </ul>
        </div>
      </Card>

      <div className="info-box">
        <h3>ℹ️ {t('pages.utilityTest.info.title')}</h3>
        <p>{t('pages.utilityTest.info.description')}</p>
        <ul>
          <li><strong>Phone:</strong> Multi-country support (SK, CZ, PL)</li>
          <li><strong>Email:</strong> RFC 5322 compliant validation</li>
          <li><strong>Date:</strong> SK/EN locale formatting</li>
        </ul>
      </div>
    </div>
  );
}
