/*
 * ================================================================
 * FILE: preview.tsx
 * PATH: /apps/storybook/.storybook/preview.tsx
 * DESCRIPTION: Storybook preview configuration with providers
 * VERSION: v1.0.0
 * UPDATED: 2025-12-12
 * ================================================================
 */

import React from 'react';
import type { Preview } from '@storybook/react';
import { TranslationProvider, AuthProvider, ThemeProvider, ToastProvider, AnalyticsProvider } from '@l-kern/config';

// Import global styles
import '@l-kern/ui-components/styles/global.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <TranslationProvider>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <AnalyticsProvider>
                <div style={{ padding: '1rem' }}>
                  <Story />
                </div>
              </AnalyticsProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </TranslationProvider>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
        { name: 'gray', value: '#f5f5f5' },
      ],
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default preview;
