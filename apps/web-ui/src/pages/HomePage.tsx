/*
 * ================================================================
 * FILE: HomePage.tsx
 * PATH: /apps/web-ui/src/pages/HomePage.tsx
 * DESCRIPTION: Simple homepage with navigation
 * VERSION: v1.0.0
 * CREATED: 2025-10-18
 * ================================================================
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation, useTheme } from '@l-kern/config';
import { Card } from '@l-kern/ui-components';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export const HomePage: React.FC = () => {
  const { t, language, setLanguage } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  // Enable global keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <div style={{
      padding: '60px 40px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>
          🚀 L-KERN v4
        </h1>
        <p style={{ fontSize: '20px', color: 'var(--theme-text-secondary, #666)' }}>
          {t('dashboard.welcome')}
        </p>
      </div>

      {/* Quick Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        marginBottom: '48px'
      }}>
        <Card variant="outlined">
          <h3 style={{ marginTop: 0 }}>🎨 Theme</h3>
          <p style={{ color: 'var(--theme-text-secondary, #666)' }}>
            Current: <strong>{theme}</strong>
          </p>
          <button
            onClick={toggleTheme}
            style={{
              padding: '8px 16px',
              border: '1px solid var(--color-brand-primary, #9c27b0)',
              borderRadius: '6px',
              background: 'transparent',
              color: 'var(--color-brand-primary, #9c27b0)',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Toggle Theme
          </button>
        </Card>

        <Card variant="outlined">
          <h3 style={{ marginTop: 0 }}>🌍 Language</h3>
          <p style={{ color: 'var(--theme-text-secondary, #666)' }}>
            Current: <strong>{language.toUpperCase()}</strong>
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setLanguage('sk')}
              disabled={language === 'sk'}
              style={{
                padding: '8px 16px',
                border: '1px solid var(--color-brand-primary, #9c27b0)',
                borderRadius: '6px',
                background: language === 'sk' ? 'var(--color-brand-primary, #9c27b0)' : 'transparent',
                color: language === 'sk' ? 'white' : 'var(--color-brand-primary, #9c27b0)',
                cursor: language === 'sk' ? 'default' : 'pointer',
                fontWeight: 600
              }}
            >
              SK
            </button>
            <button
              onClick={() => setLanguage('en')}
              disabled={language === 'en'}
              style={{
                padding: '8px 16px',
                border: '1px solid var(--color-brand-primary, #9c27b0)',
                borderRadius: '6px',
                background: language === 'en' ? 'var(--color-brand-primary, #9c27b0)' : 'transparent',
                color: language === 'en' ? 'white' : 'var(--color-brand-primary, #9c27b0)',
                cursor: language === 'en' ? 'default' : 'pointer',
                fontWeight: 600
              }}
            >
              EN
            </button>
          </div>
        </Card>
      </div>

      {/* Navigation Links */}
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '24px' }}>📋 Pages</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link to="/testing" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Card variant="elevated">
              <div style={{ fontSize: '18px', fontWeight: 600 }}>
                🧪 Component Testing Page
              </div>
              <p style={{
                margin: '8px 0 0 0',
                fontSize: '14px',
                fontWeight: 'normal',
                color: 'var(--theme-text-secondary, #666)'
              }}>
                Test all UI components (Button, Input, FormField, Select, Checkbox, Radio)
              </p>
            </Card>
          </Link>

          <Link to="/badge-demo" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Card variant="elevated">
              <div style={{ fontSize: '18px', fontWeight: 600 }}>
                🏷️ Badge Component Demo
              </div>
              <p style={{
                margin: '8px 0 0 0',
                fontSize: '14px',
                fontWeight: 'normal',
                color: 'var(--theme-text-secondary, #666)'
              }}>
                Badge variants, sizes, and real-world examples
              </p>
            </Card>
          </Link>

          <Link to="/utility-test" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Card variant="elevated">
              <div style={{ fontSize: '18px', fontWeight: 600 }}>
                🔧 Utility Functions Test
              </div>
              <p style={{
                margin: '8px 0 0 0',
                fontSize: '14px',
                fontWeight: 'normal',
                color: 'var(--theme-text-secondary, #666)'
              }}>
                Test phone, email, and date utilities (SK/CZ/PL support)
              </p>
            </Card>
          </Link>

          <Link to="/testing/wizard-demo" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Card variant="elevated">
              <div style={{ fontSize: '18px', fontWeight: 600 }}>
                🧙 Wizard Modal Demo [TEST]
              </div>
              <p style={{
                margin: '8px 0 0 0',
                fontSize: '14px',
                fontWeight: 'normal',
                color: 'var(--theme-text-secondary, #666)'
              }}>
                [Test Only] Compare 3 modal variants (Centered, Drawer, Fullscreen)
              </p>
            </Card>
          </Link>
        </div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <Card variant="default" style={{ marginTop: '48px', textAlign: 'center' }}>
        <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '16px' }}>⌨️ Keyboard Shortcuts</h3>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <kbd style={{
              padding: '4px 8px',
              border: '1px solid var(--theme-border, #ccc)',
              borderRadius: '4px',
              background: 'var(--theme-input-background, #fff)',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}>Ctrl+D</kbd>
            <span style={{ fontSize: '14px', color: 'var(--theme-text-secondary, #666)' }}>Toggle Theme</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <kbd style={{
              padding: '4px 8px',
              border: '1px solid var(--theme-border, #ccc)',
              borderRadius: '4px',
              background: 'var(--theme-input-background, #fff)',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}>Ctrl+L</kbd>
            <span style={{ fontSize: '14px', color: 'var(--theme-text-secondary, #666)' }}>Toggle Language</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HomePage;
