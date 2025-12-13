/*
 * ================================================================
 * FILE: main.ts
 * PATH: /apps/storybook/.storybook/main.ts
 * DESCRIPTION: Storybook main configuration
 * VERSION: v1.0.0
 * UPDATED: 2025-12-12
 * ================================================================
 */

import type { StorybookConfig } from '@storybook/react-vite';
import { join } from 'path';

const config: StorybookConfig = {
  stories: [
    // UI Components stories
    '../../../packages/ui-components/src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    // Documentation stories (if any)
    '../../../apps/docs/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: join(__dirname, '../vite.config.ts'),
      },
    },
  },
  staticDirs: ['../public'],
  docs: {
    autodocs: 'tag',
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};

export default config;
