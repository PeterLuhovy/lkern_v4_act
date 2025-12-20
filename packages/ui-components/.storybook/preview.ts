/*
 * ================================================================
 * FILE: preview.ts
 * PATH: packages/ui-components/.storybook/preview.ts
 * DESCRIPTION: Storybook preview configuration - global decorators and styles
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Preview } from '@storybook/react';
import React from 'react';
import { TranslationProvider, ThemeProvider, AuthProvider, ToastProvider, AnalyticsProvider } from '@l-kern/config';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a2e' },
        { name: 'gray', value: '#f5f5f5' },
      ],
    },
  },
  decorators: [
    (Story) => {
      return React.createElement(
        TranslationProvider,
        null,
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(
            AuthProvider,
            null,
            React.createElement(
              ToastProvider,
              null,
              React.createElement(
                AnalyticsProvider,
                null,
                React.createElement(
                  'div',
                  {
                    style: {
                      padding: '1rem',
                      fontFamily: 'var(--font-primary, Inter, sans-serif)',
                    },
                  },
                  React.createElement(Story)
                )
              )
            )
          )
        )
      );
    },
  ],
  tags: ['autodocs'],
};

export default preview;
