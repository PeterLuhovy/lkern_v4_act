/*
 * ================================================================
 * FILE: theme-setup.ts
 * PATH: apps/web-ui/src/theme-setup.ts
 * DESCRIPTION: Generate theme CSS from @l-kern/config design tokens
 * VERSION: v1.0.0
 * UPDATED: 2025-10-13
 * ================================================================
 */

import { COLORS } from '@l-kern/config';

/**
 * Inject theme CSS variables into document
 * Uses design tokens from @l-kern/config
 */
export function setupTheme(): void {
  const style = document.createElement('style');
  style.id = 'l-kern-theme';

  style.textContent = `
    /* Light Theme (default) */
    :root,
    [data-theme="light"] {
      /* Background colors */
      --color-background: ${COLORS.neutral.white};
      --color-background-alt: ${COLORS.neutral.gray100};

      /* Text colors */
      --color-text: ${COLORS.neutral.gray900};
      --color-text-secondary: ${COLORS.neutral.gray600};

      /* Brand colors */
      --color-primary: ${COLORS.brand.primary};
      --color-secondary: ${COLORS.brand.secondary};
      --color-accent: ${COLORS.brand.accent};

      /* Border colors */
      --color-border: ${COLORS.neutral.gray300};

      /* Status colors */
      --color-success: ${COLORS.status.success};
      --color-warning: ${COLORS.status.warning};
      --color-error: ${COLORS.status.error};
      --color-info: ${COLORS.status.info};
    }

    /* Dark Theme */
    [data-theme="dark"] {
      /* Background colors */
      --color-background: ${COLORS.neutral.gray900};
      --color-background-alt: ${COLORS.neutral.gray800};

      /* Text colors */
      --color-text: ${COLORS.neutral.white};
      --color-text-secondary: ${COLORS.neutral.gray400};

      /* Brand colors (lighter versions for dark mode) */
      --color-primary: ${COLORS.brand.light};
      --color-secondary: #64b5f6;
      --color-accent: #f48fb1;

      /* Border colors */
      --color-border: ${COLORS.neutral.gray700};

      /* Status colors */
      --color-success: ${COLORS.status.success};
      --color-warning: ${COLORS.status.warning};
      --color-error: ${COLORS.status.error};
      --color-info: ${COLORS.status.info};
    }

    /* Global Styles */
    body {
      background-color: var(--color-background);
      color: var(--color-text);
      transition: background-color 0.3s ease, color 0.3s ease;
      margin: 0;
      font-family: Arial, sans-serif;
      font-size: 14px;
      line-height: 1.5;
    }

    button {
      background-color: var(--color-primary);
      color: white;
      border: 1px solid transparent;
      padding: 8px 16px;
      cursor: pointer;
      border-radius: 4px;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    button:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    a {
      color: var(--color-secondary);
      text-decoration: none;
      transition: color 0.2s ease;
    }

    a:hover {
      text-decoration: underline;
    }

    h1 {
      font-size: 32px;
      font-weight: 700;
      margin: 0 0 24px 0;
    }

    h2 {
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 16px 0;
    }

    h3 {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 12px 0;
    }

    section {
      background-color: var(--color-background);
      border: 1px solid var(--color-border) !important;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 30px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    ul {
      margin: 12px 0;
      padding-left: 20px;
    }

    li {
      margin-bottom: 8px;
    }
  `;

  document.head.appendChild(style);
}