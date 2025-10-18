/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => ({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom', // Changed to jsdom for React hooks testing
    include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
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
