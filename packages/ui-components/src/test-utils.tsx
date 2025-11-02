/*
 * ================================================================
 * FILE: test-utils.tsx
 * PATH: /packages/ui-components/src/test-utils.tsx
 * DESCRIPTION: Testing utilities for L-KERN v4 components
 * VERSION: v1.0.0
 * UPDATED: 2025-10-30 23:00:00
 * ================================================================
 */

import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { TranslationProvider, ThemeProvider } from '@l-kern/config';

// ================================================================
// TYPES
// ================================================================

interface CustomRenderOptions extends RenderOptions {
  /**
   * Initial language for TranslationProvider
   * @default 'sk'
   */
  initialLanguage?: 'sk' | 'en';

  /**
   * Initial theme for ThemeProvider
   * @default 'light'
   */
  initialTheme?: 'light' | 'dark';
}

// ================================================================
// RENDER WITH TRANSLATION
// ================================================================

/**
 * Render component with TranslationProvider wrapper.
 * Uses REAL translations from sk.ts and en.ts.
 *
 * **Why use this?**
 * - ✅ Tests use REAL Slovak/English translations
 * - ✅ Catches hardcoded text (test fails if hardcoded)
 * - ✅ Verifies translation keys exist in files
 * - ✅ Tests language switching
 *
 * @param ui - Component to render
 * @param options.initialLanguage - Starting language (default: 'sk')
 * @returns Render result with translation context
 *
 * @example
 * ```typescript
 * // Test Slovak translations
 * renderWithTranslation(<Button>common.save</Button>);
 * expect(screen.getByText('Uložiť')).toBeInTheDocument();
 *
 * // Test English translations
 * renderWithTranslation(<Button>common.save</Button>, { initialLanguage: 'en' });
 * expect(screen.getByText('Save')).toBeInTheDocument();
 * ```
 */
export function renderWithTranslation(
  ui: ReactElement,
  { initialLanguage = 'sk', ...renderOptions }: CustomRenderOptions = {}
): RenderResult {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    // @ts-expect-error - React 19 FC type compatibility issue with Testing Library
    <TranslationProvider defaultLanguage={initialLanguage}>
      {children}
    </TranslationProvider>
  );

  return render(ui, { wrapper: Wrapper as any, ...renderOptions });
}

// ================================================================
// RENDER WITH THEME
// ================================================================

/**
 * Render component with ThemeProvider wrapper.
 * Uses REAL theme context from config package.
 *
 * @param ui - Component to render
 * @param options.initialTheme - Starting theme (default: 'light')
 * @returns Render result with theme context
 *
 * @example
 * ```typescript
 * // Test light theme
 * renderWithTheme(<Button>Test</Button>);
 * expect(screen.getByRole('button')).toHaveClass('light');
 *
 * // Test dark theme
 * renderWithTheme(<Button>Test</Button>, { initialTheme: 'dark' });
 * expect(screen.getByRole('button')).toHaveClass('dark');
 * ```
 */
export function renderWithTheme(
  ui: ReactElement,
  { initialTheme = 'light', ...renderOptions }: CustomRenderOptions = {}
): RenderResult {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    // @ts-expect-error - React 19 FC type compatibility issue with Testing Library
    <ThemeProvider defaultTheme={initialTheme}>{children}</ThemeProvider>
  );

  return render(ui, { wrapper: Wrapper as any, ...renderOptions });
}

// ================================================================
// RENDER WITH ALL PROVIDERS
// ================================================================

/**
 * Render component with ALL providers (Translation + Theme).
 * Most realistic testing setup for L-KERN components.
 *
 * **Use this for:**
 * - Modals (need translation + theme)
 * - Complex components (need multiple contexts)
 * - Integration tests (full provider tree)
 *
 * @param ui - Component to render
 * @param options.initialLanguage - Starting language (default: 'sk')
 * @param options.initialTheme - Starting theme (default: 'light')
 * @returns Render result with all contexts
 *
 * @example
 * ```typescript
 * // Test Modal with Slovak + Light theme
 * renderWithAll(<Modal title="modal.title">Content</Modal>);
 *
 * // Test Modal with English + Dark theme
 * renderWithAll(
 *   <Modal title="modal.title">Content</Modal>,
 *   { initialLanguage: 'en', initialTheme: 'dark' }
 * );
 * ```
 */
export function renderWithAll(
  ui: ReactElement,
  {
    initialLanguage = 'sk',
    initialTheme = 'light',
    ...renderOptions
  }: CustomRenderOptions = {}
): RenderResult {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    // @ts-expect-error - React 19 FC type compatibility issue with Testing Library
    <ThemeProvider defaultTheme={initialTheme}>
      {/* @ts-expect-error - React 19 FC type compatibility issue with Testing Library */}
      <TranslationProvider defaultLanguage={initialLanguage}>
        {children}
      </TranslationProvider>
    </ThemeProvider>
  );

  return render(ui, { wrapper: Wrapper as any, ...renderOptions });
}

// ================================================================
// RE-EXPORT TESTING LIBRARY UTILITIES
// ================================================================

/**
 * Re-export all React Testing Library utilities.
 * Import from test-utils instead of @testing-library/react.
 *
 * @example
 * ```typescript
 * // ✅ CORRECT - Import from test-utils
 * import { renderWithTranslation, screen, fireEvent } from './test-utils';
 *
 * // ❌ WRONG - Don't import from @testing-library/react directly
 * import { render, screen } from '@testing-library/react';
 * ```
 */
export {
  screen,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
  within,
  act,
} from '@testing-library/react';

export { default as userEvent } from '@testing-library/user-event';

// ================================================================
// TYPE EXPORTS
// ================================================================

export type { RenderResult } from '@testing-library/react';
export type { CustomRenderOptions };
