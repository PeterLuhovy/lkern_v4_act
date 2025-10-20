/*
 * ================================================================
 * FILE: index.ts
 * PATH: packages/config/src/index.ts
 * DESCRIPTION: Main export file for @l-kern/config package
 * VERSION: v1.1.0
 * UPDATED: 2025-10-18
 * ================================================================
 */

// === CONSTANTS EXPORTS ===
// Export all constants (ports, API, services, design tokens)
export * from './constants/index';

// === TRANSLATIONS EXPORTS ===
// Export translation system (provider, hook, types)
export * from './translations/index';

// === THEME EXPORTS ===
// Export theme system (provider, hook, types)
export * from './theme/index';

// === UTILITIES EXPORTS ===
// Export utility functions (phone, email, date)
export * from './utils/index';

// === HOOKS EXPORTS ===
// Export custom React hooks
export * from './hooks/useModal/useModal';
export * from './hooks/useModalWizard/useModalWizard';
export * from './hooks/usePageAnalytics/usePageAnalytics';
export * from './hooks/useToast/useToast';
export * from './hooks/useFormDirty/useFormDirty';

// === CONTEXTS EXPORTS ===
// Export context providers
export * from './contexts/ModalContext/ModalContext';
export * from './contexts/ToastContext/ToastContext';

// === TYPES EXPORTS ===
// Export all TypeScript types
export * from './types';
