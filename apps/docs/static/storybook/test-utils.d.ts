import { RenderOptions, RenderResult } from '@testing-library/react';
import { ReactElement } from '../../../node_modules/react';
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
export declare function renderWithTranslation(ui: ReactElement, { initialLanguage, ...renderOptions }?: CustomRenderOptions): RenderResult;
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
export declare function renderWithTheme(ui: ReactElement, { initialTheme, ...renderOptions }?: CustomRenderOptions): RenderResult;
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
export declare function renderWithAll(ui: ReactElement, { initialLanguage, initialTheme, ...renderOptions }?: CustomRenderOptions): RenderResult;
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
export { screen, fireEvent, waitFor, waitForElementToBeRemoved, within, act, } from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export type { RenderResult } from '@testing-library/react';
export type { CustomRenderOptions };
