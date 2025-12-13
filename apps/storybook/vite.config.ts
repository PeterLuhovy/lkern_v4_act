/*
 * ================================================================
 * FILE: vite.config.ts
 * PATH: /apps/storybook/vite.config.ts
 * DESCRIPTION: Vite configuration for Storybook
 * VERSION: v1.0.0
 * UPDATED: 2025-12-12
 * ================================================================
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@l-kern/config': resolve(__dirname, '../../packages/config/src'),
      '@l-kern/ui-components': resolve(__dirname, '../../packages/ui-components/src'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
