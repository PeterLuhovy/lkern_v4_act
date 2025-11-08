import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {
      '@nx/enforce-module-boundaries': 'off', // TODO: Re-enable after making @l-kern/config buildable
      '@typescript-eslint/no-empty-function': 'off', // Allow empty functions in tests/mocks
    },
  },
];
