/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(() => ({
  plugins: [react()],
  resolve: {
    preserveSymlinks: true,
  },
  test: {
    globals: true,
    environment: 'jsdom', // Changed to jsdom for React hooks testing
    include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
    setupFiles: [resolve(__dirname, 'vitest.setup.ts')],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/packages/config',
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/*.test.{ts,tsx}',
        '**/*.d.ts',
        '**/index.ts',
        '**/types.ts',
      ],
    },
  },
}));
