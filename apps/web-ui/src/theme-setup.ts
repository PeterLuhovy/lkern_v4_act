/*
 * ================================================================
 * FILE: theme-setup.ts
 * PATH: apps/web-ui/src/theme-setup.ts
 * DESCRIPTION: Generate theme CSS from @l-kern/config design tokens
 * VERSION: v1.1.0
 * UPDATED: 2025-10-19 17:30:00
 * ================================================================
 */

import { COLORS, TYPOGRAPHY, LAYOUT, SPACING, SHADOWS } from '@l-kern/config';

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
      --theme-text: ${COLORS.neutral.gray900};
      --theme-text-muted: ${COLORS.neutral.gray500};

      /* Brand colors */
      --color-primary: ${COLORS.brand.primary};
      --color-brand-primary: ${COLORS.brand.primary};
      --color-brand-primary-dark: #7b1fa2;
      --color-brand-secondary: ${COLORS.brand.secondary};
      --color-secondary: ${COLORS.brand.secondary};
      --color-accent: ${COLORS.brand.accent};

      /* Border colors */
      --color-border: ${COLORS.neutral.gray300};
      --theme-border: ${COLORS.neutral.gray300};
      --theme-input-border: ${COLORS.neutral.gray300};
      --theme-input-border-hover: ${COLORS.neutral.gray400};

      /* Input/Form colors */
      --theme-input-background: ${COLORS.neutral.white};
      --theme-input-background-disabled: ${COLORS.neutral.gray100};
      --theme-hover-background: ${COLORS.neutral.gray100};
      --theme-button-text-on-color: ${COLORS.neutral.white};

      /* Status colors */
      --color-success: ${COLORS.status.success};
      --color-warning: ${COLORS.status.warning};
      --color-error: ${COLORS.status.error};
      --color-info: ${COLORS.status.info};
      --color-status-success: ${COLORS.status.success};
      --color-status-error: ${COLORS.status.error};
      --color-status-error-dark: #d32f2f;
      --color-status-warning: ${COLORS.status.warning};
      --color-status-info: ${COLORS.status.info};

      /* Spacing (8px grid) */
      --spacing-none: ${SPACING.none}px;
      --spacing-xs: ${SPACING.xs}px;
      --spacing-sm: ${SPACING.sm}px;
      --spacing-md: ${SPACING.md}px;
      --spacing-lg: ${SPACING.lg}px;
      --spacing-xl: ${SPACING.xl}px;
      --spacing-xxl: ${SPACING.xxl}px;
      --spacing-xxxl: ${SPACING.xxxl}px;
      --spacing-huge: ${SPACING.huge}px;
      --spacing-xhuge: ${SPACING.xhuge}px;

      /* Font sizes */
      --font-size-xs: ${TYPOGRAPHY.fontSize.xs}px;
      --font-size-sm: ${TYPOGRAPHY.fontSize.sm}px;
      --font-size-md: ${TYPOGRAPHY.fontSize.md}px;
      --font-size-lg: ${TYPOGRAPHY.fontSize.lg}px;
      --font-size-xl: ${TYPOGRAPHY.fontSize.xl}px;
      --font-size-xxl: ${TYPOGRAPHY.fontSize.xxl}px;
      --font-size-xxxl: ${TYPOGRAPHY.fontSize.xxxl}px;
      --font-size-huge: ${TYPOGRAPHY.fontSize.huge}px;
      --font-size-hero: ${TYPOGRAPHY.fontSize.hero}px;

      /* Font weights */
      --font-weight-light: ${TYPOGRAPHY.fontWeight.light};
      --font-weight-normal: ${TYPOGRAPHY.fontWeight.normal};
      --font-weight-medium: ${TYPOGRAPHY.fontWeight.medium};
      --font-weight-semibold: ${TYPOGRAPHY.fontWeight.semibold};
      --font-weight-bold: ${TYPOGRAPHY.fontWeight.bold};
      --font-weight-extrabold: ${TYPOGRAPHY.fontWeight.extrabold};

      /* Font family */
      --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;

      /* Border radius */
      --border-radius-none: ${LAYOUT.borderRadius.none}px;
      --border-radius-sm: ${LAYOUT.borderRadius.sm}px;
      --border-radius-md: ${LAYOUT.borderRadius.md}px;
      --border-radius-lg: ${LAYOUT.borderRadius.lg}px;
      --border-radius-xl: ${LAYOUT.borderRadius.xl}px;
      --border-radius-round: ${LAYOUT.borderRadius.round}%;
      --border-radius-pill: ${LAYOUT.borderRadius.pill}px;

      /* Border widths */
      --border-width-thin: 1px;
      --border-width-medium: 2px;
      --border-width-thick: 4px;

      /* Z-index */
      --z-index-hide: ${LAYOUT.zIndex.hide};
      --z-index-base: ${LAYOUT.zIndex.base};
      --z-index-dropdown: ${LAYOUT.zIndex.dropdown};
      --z-index-sticky: ${LAYOUT.zIndex.sticky};
      --z-index-modal: ${LAYOUT.zIndex.modal};
      --z-index-popover: ${LAYOUT.zIndex.popover};
      --z-index-notification: ${LAYOUT.zIndex.notification};

      /* Shadows */
      --shadow-sm: ${SHADOWS.sm};
      --shadow-md: ${SHADOWS.md};
      --shadow-lg: ${SHADOWS.lg};
      --shadow-xl: ${SHADOWS.xl};

      /* Animations */
      --animation-duration-fast: 150ms;
      --animation-duration-normal: 300ms;
      --animation-duration-slow: 500ms;
      --animation-timing-ease: ease;
      --animation-timing-ease-in: ease-in;
      --animation-timing-ease-out: ease-out;
    }

    /* Dark Theme */
    [data-theme="dark"] {
      /* Background colors */
      --color-background: ${COLORS.neutral.gray900};
      --color-background-alt: ${COLORS.neutral.gray800};

      /* Text colors */
      --color-text: ${COLORS.neutral.gray100};
      --color-text-secondary: ${COLORS.neutral.gray400};
      --theme-text: ${COLORS.neutral.gray100};
      --theme-text-muted: ${COLORS.neutral.gray500};

      /* Brand colors (lighter versions for dark mode) */
      --color-primary: ${COLORS.brand.light};
      --color-brand-primary: ${COLORS.brand.light};
      --color-secondary: #64b5f6;
      --color-accent: #f48fb1;

      /* Border colors */
      --color-border: ${COLORS.neutral.gray600};
      --theme-border: ${COLORS.neutral.gray600};
      --theme-input-border: ${COLORS.neutral.gray600};
      --theme-input-border-hover: ${COLORS.neutral.gray500};

      /* Input/Form colors - darker background, not bright */
      --theme-input-background: ${COLORS.neutral.gray800};
      --theme-input-background-disabled: ${COLORS.neutral.gray700};
      --theme-hover-background: ${COLORS.neutral.gray700};
      --theme-button-text-on-color: ${COLORS.neutral.white};

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

    /* Textarea - same styling as inputs */
    textarea {
      padding: 8px 12px;
      box-sizing: border-box;
      font-family: inherit;
      font-size: 12px;
      font-weight: 400;
      color: var(--theme-text);
      background: var(--theme-input-background);
      border: 2px solid var(--theme-input-border);
      border-radius: 6px;
      transition: border-color 0.15s ease;
      outline: none;
      resize: vertical;
      min-height: 80px;
    }

    textarea:focus {
      border-color: var(--color-brand-primary);
    }

    textarea:hover:not(:focus):not(:disabled) {
      border-color: var(--theme-input-border-hover);
    }

    textarea:disabled {
      cursor: not-allowed;
      opacity: 0.6;
      background: var(--theme-input-background-disabled);
    }

    textarea::placeholder {
      color: var(--theme-text-muted);
      opacity: 0.7;
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