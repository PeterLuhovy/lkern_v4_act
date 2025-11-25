/*
 * ================================================================
 * FILE: TemplatePageBase.tsx
 * PATH: /apps/web-ui/src/pages/_templates/TemplatePageBase.tsx
 * DESCRIPTION: Template for creating new pages with CSS Modules pattern
 * VERSION: v2.0.0
 * UPDATED: 2025-10-18 21:00:00
 *
 * USAGE:
 *   1. Copy this entire folder to your desired location
 *   2. Rename folder and files (e.g., MyNewPage/)
 *   3. Update imports and component name
 *   4. Customize CSS Modules styles
 *   5. Add route in app.tsx
 *
 * FEATURES:
 *   ✅ BasePage wrapper - Global keyboard shortcuts (ESC closes modals)
 *   ✅ CSS Modules - Scoped, maintainable styles
 *   ✅ Translation support - useTranslation hook ready
 *   ✅ CSS Variables - All colors via --theme-* variables
 *   ✅ Type safety - Full TypeScript support
 *   ✅ DRY compliance - No hardcoded values
 * ================================================================
 */

import React, { useState } from 'react';
import { BasePage, Button, Input, Card } from '@l-kern/ui-components';
import { useTranslation } from '@l-kern/config';
import styles from './TemplatePageBase.module.css';

/**
 * TemplatePageBase Component
 *
 * This is a template for creating new pages with CSS Modules.
 * Copy this folder and customize it for your specific page needs.
 *
 * @example
 * ```bash
 * # 1. Copy template folder
 * cp -r src/pages/_templates/TemplatePageBase src/pages/MyNewPage
 *
 * # 2. Rename files
 * mv src/pages/MyNewPage/TemplatePageBase.tsx src/pages/MyNewPage/MyNewPage.tsx
 * mv src/pages/MyNewPage/TemplatePageBase.module.css src/pages/MyNewPage/MyNewPage.module.css
 *
 * # 3. Update imports in MyNewPage.tsx
 * import styles from './MyNewPage.module.css';
 *
 * # 4. Rename component function
 * export function MyNewPage() { ... }
 *
 * # 5. Add route in app.tsx
 * <Route path="/my-new-page" element={<MyNewPage />} />
 * ```
 */
export function TemplatePageBase() {
  const { t } = useTranslation();

  // Page state
  const [inputValue, setInputValue] = useState<string>('');
  const [results, setResults] = useState<Array<{ label: string; value: string }>>([]);

  // Page handlers
  const handleSubmit = () => {
    if (inputValue.trim()) {
      setResults([
        ...results,
        {
          label: 'Input',
          value: inputValue,
        },
        {
          label: 'Timestamp',
          value: new Date().toLocaleTimeString(),
        },
      ]);
      setInputValue('');
    }
  };

  const handleClear = () => {
    setInputValue('');
    setResults([]);
  };

  return (
    <BasePage>
      <div className={styles.container}>
        {/* Page header */}
        <header className={styles.header}>
          <h1 className={styles.title}>Page Template</h1>
          <p className={styles.subtitle}>
            This is a template page with CSS Modules pattern. Replace this content with your page-specific UI.
          </p>
        </header>

        {/* Main content */}
        <div className={styles.content}>
          {/* Example section with Card */}
          <section className={styles.section}>
            <Card>
              <h2 className={styles.sectionTitle}>Example Form Section</h2>
              <p className={styles.sectionDescription}>
                This demonstrates how to use CSS Modules for styling. All class names are scoped to this component.
              </p>

              {/* Form group */}
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="example-input">
                  {t('forms.enterValue')}
                </label>
                <Input
                  id="example-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={t('forms.enterValue')}
                  className={styles.input}
                />
              </div>

              {/* Button group */}
              <div className={styles.buttonGroup}>
                <Button onClick={handleSubmit} variant="primary">
                  {t('common.submit')}
                </Button>
                <Button onClick={handleClear} variant="secondary">
                  {t('common.cancel')}
                </Button>
              </div>
            </Card>
          </section>

          {/* Results section */}
          {results.length > 0 && (
            <section className={styles.section}>
              <Card>
                <h2 className={styles.sectionTitle}>Results</h2>
                <div className={styles.results}>
                  {results.map((result, index) => (
                    <div key={index} className={styles.resultItem}>
                      <span className={styles.resultLabel}>{result.label}:</span>
                      <code className={styles.resultValue}>{result.value}</code>
                    </div>
                  ))}
                </div>
              </Card>
            </section>
          )}

          {/* Info box */}
          <div className={styles.infoBox}>
            <p>
              <strong><span role="img" aria-label="light bulb">💡</span> Template Guide:</strong> This page uses CSS Modules for styling.
              All styles are in <code>TemplatePageBase.module.css</code> and are scoped to this component.
              Replace the content with your page-specific UI and customize the styles.
            </p>
          </div>

          {/* Example list */}
          <section className={styles.section}>
            <Card>
              <h3 className={styles.sectionTitle}>CSS Modules Features</h3>
              <ul className={styles.list}>
                <li className={styles.listItem}><span role="img" aria-label="checkmark">✅</span> Scoped class names (no global conflicts)</li>
                <li className={styles.listItem}><span role="img" aria-label="checkmark">✅</span> TypeScript autocomplete for class names</li>
                <li className={styles.listItem}><span role="img" aria-label="checkmark">✅</span> CSS variables for theming</li>
                <li className={styles.listItem}><span role="img" aria-label="checkmark">✅</span> Maintainable and organized styles</li>
                <li className={styles.listItem}><span role="img" aria-label="checkmark">✅</span> Production-ready optimization</li>
              </ul>
            </Card>
          </section>
        </div>
      </div>
    </BasePage>
  );
}

export default TemplatePageBase;
