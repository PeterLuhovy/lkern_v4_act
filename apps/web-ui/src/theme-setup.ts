/*
 * ================================================================
 * FILE: theme-setup.ts
 * PATH: apps/web-ui/src/theme-setup.ts
 * DESCRIPTION: Generate theme CSS from @l-kern/config design tokens
 * VERSION: v2.0.0
 * UPDATED: 2025-11-06 18:00:00
 * ================================================================
 * CHANGELOG v2.0.0:
 *   - Added GRADIENTS CSS variables (6 patterns)
 *   - Added ANIMATIONS.duration (hover, stateChange, modal)
 *   - Added ANIMATIONS.timing (bounce, smooth)
 *   - Added HOVER_EFFECTS CSS variables (lift, scale)
 *   - Added SHADOWS.focus CSS variables (default, subtle, hover, error, success)
 *   - Added SHADOWS.component CSS variables (button, card, checkbox, radio)
 *   - Added SIDEBAR CSS variables (background, popoverBackground)
 *   - Added border-radius shortcuts (--radius-*)
 *   - Total: ~40 new CSS variables for Design System Refactor
 * ================================================================
 */

import {
  COLORS,
  TYPOGRAPHY,
  LAYOUT,
  SPACING,
  SHADOWS,
  GRADIENTS,
  ANIMATIONS,
  HOVER_EFFECTS,
  SIDEBAR,
} from '@l-kern/config';

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

      /* Button colors (lighter for light theme) */
      --button-primary-from: ${COLORS.brand.light};
      --button-primary-to: ${COLORS.brand.primary};
      --button-danger-from: #ef5350;
      --button-danger-to: #d32f2f;
      --button-success-from: #66bb6a;
      --button-success-to: #388E3C;
      --button-warning-from: #e0925a;
      --button-warning-to: #c46d3a;
      --button-danger-subtle-bg: ${COLORS.button.dangerSubtle.light};
      --button-danger-subtle-hover: ${COLORS.button.dangerSubtle.lightHover};

      /* Border colors */
      --color-border: ${COLORS.neutral.gray300};
      --theme-border: ${COLORS.neutral.gray300};
      --theme-input-border: ${COLORS.neutral.gray300};
      --theme-input-border-hover: ${COLORS.neutral.gray400};

      /* Input/Form colors */
      --theme-input-background: ${COLORS.neutral.white};
      --theme-input-background-focus: ${COLORS.neutral.gray200};
      --theme-input-background-valid: ${COLORS.neutral.white};
      --theme-input-background-disabled: ${COLORS.neutral.gray100};
      --theme-hover-background: ${COLORS.neutral.gray100};
      --theme-button-text-on-color: ${COLORS.neutral.white};

      /* Validation message colors - darker for light mode readability */
      --theme-validation-error: #c62828;
      --theme-validation-success: #2e7d32;

      /* Validation border colors - less saturated for better visibility */
      --theme-validation-error-border: rgba(211, 47, 47, 0.5);
      --theme-validation-success-border: rgba(56, 142, 60, 0.5);

      /* Card colors */
      --theme-card-background: ${COLORS.neutral.gray100};

      /* Table header */
      --theme-table-header-bg: ${COLORS.neutral.gray255};

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

      /* Shadows - Base */
      --shadow-xs: ${SHADOWS.xs};
      --shadow-sm: ${SHADOWS.sm};
      --shadow-md: ${SHADOWS.md};
      --shadow-lg: ${SHADOWS.lg};
      --shadow-xl: ${SHADOWS.xl};
      --shadow-xxl: ${SHADOWS.xxl};
      --shadow-inner: ${SHADOWS.inner};

      /* Shadows - Focus Rings */
      --shadow-focus: ${SHADOWS.focus.default};
      --shadow-focus-subtle: ${SHADOWS.focus.subtle};
      --shadow-focus-hover: ${SHADOWS.focus.hover};
      --shadow-focus-error: ${SHADOWS.focusError};
      --shadow-focus-success: ${SHADOWS.focusSuccess};

      /* Shadows - Hover Rings (Status) */
      --shadow-hover-error: ${SHADOWS.hoverError};
      --shadow-hover-success: ${SHADOWS.hoverSuccess};

      /* Shadows - Inset */
      --shadow-inset-deep: ${SHADOWS.insetDeep};

      /* Shadows - Component (pre-combined) */
      --shadow-checked: ${SHADOWS.component.checked};
      --shadow-button-default: ${SHADOWS.component.button.default};
      --shadow-button-hover: ${SHADOWS.component.button.hover};
      --shadow-button-active: ${SHADOWS.component.button.active};
      --shadow-button-secondary-default: ${SHADOWS.component.buttonSecondary.default};
      --shadow-button-secondary-hover: ${SHADOWS.component.buttonSecondary.hover};
      --shadow-button-secondary-active: ${SHADOWS.component.buttonSecondary.active};
      --shadow-card-default: ${SHADOWS.component.card.default};
      --shadow-card-default-hover: ${SHADOWS.component.card.defaultHover};
      --shadow-card-elevated: ${SHADOWS.component.card.elevated};
      --shadow-card-elevated-hover: ${SHADOWS.component.card.elevatedHover};
      --shadow-card-accent: ${SHADOWS.component.card.accent};
      --shadow-card-accent-hover: ${SHADOWS.component.card.accentHover};
      --shadow-checkbox-default: ${SHADOWS.component.checkbox.default};
      --shadow-checkbox-hover: ${SHADOWS.component.checkbox.hover};
      --shadow-checkbox-focus: ${SHADOWS.component.checkbox.focus};
      --shadow-checkbox-checked: ${SHADOWS.component.checkbox.checked};
      --shadow-radio-default: ${SHADOWS.component.radio.default};
      --shadow-radio-hover: ${SHADOWS.component.radio.hover};
      --shadow-radio-focus: ${SHADOWS.component.radio.focus};
      --shadow-radio-checked: ${SHADOWS.component.radio.checked};
      --shadow-brand-glow: ${SHADOWS.component.brandGlow};
      --shadow-elevation-dark: ${SHADOWS.component.elevationDark};

      /* Border Radius (shortcuts for migration) */
      --radius-none: ${LAYOUT.borderRadius.none}px;
      --radius-sm: ${LAYOUT.borderRadius.sm}px;
      --radius-md: ${LAYOUT.borderRadius.md}px;
      --radius-lg: ${LAYOUT.borderRadius.lg}px;
      --radius-xl: ${LAYOUT.borderRadius.xl}px;
      --radius-round: ${LAYOUT.borderRadius.round}%;
      --radius-pill: ${LAYOUT.borderRadius.pill}px;

      /* Gradients */
      --gradient-primary: ${GRADIENTS.primary};
      --gradient-disabled: ${GRADIENTS.disabled};
      --gradient-error: ${GRADIENTS.error};
      --gradient-unchecked: ${GRADIENTS.unchecked};
      --gradient-radial-white: ${GRADIENTS.radialWhite};
      --gradient-radial-disabled: ${GRADIENTS.radialDisabled};

      /* Animation Durations */
      --duration-instant: ${ANIMATIONS.duration.instant}ms;
      --duration-hover: ${ANIMATIONS.duration.hover}ms;
      --duration-state: ${ANIMATIONS.duration.stateChange}ms;
      --duration-normal: ${ANIMATIONS.duration.normal}ms;
      --duration-modal: ${ANIMATIONS.duration.modal}ms;
      --duration-sidebar: ${ANIMATIONS.duration.sidebar}ms;
      --duration-slow: ${ANIMATIONS.duration.slow}ms;

      /* Animation Easings */
      --ease-linear: ${ANIMATIONS.timing.linear};
      --ease: ${ANIMATIONS.timing.ease};
      --ease-in: ${ANIMATIONS.timing.easeIn};
      --ease-out: ${ANIMATIONS.timing.easeOut};
      --ease-in-out: ${ANIMATIONS.timing.easeInOut};
      --ease-bounce: ${ANIMATIONS.timing.bounce};
      --ease-smooth: ${ANIMATIONS.timing.smooth};

      /* Hover Effects - Lift */
      --lift-subtle: ${HOVER_EFFECTS.lift.subtle};
      --lift-normal: ${HOVER_EFFECTS.lift.normal};
      --lift-strong: ${HOVER_EFFECTS.lift.strong};

      /* Hover Effects - Scale */
      --scale-subtle: ${HOVER_EFFECTS.scale.subtle};
      --scale-normal: ${HOVER_EFFECTS.scale.normal};
      --scale-strong: ${HOVER_EFFECTS.scale.strong};

      /* Sidebar - Light Theme */
      --sidebar-bg: ${SIDEBAR.background.light};
      --sidebar-popover-bg: ${SIDEBAR.popoverBackground.light};

      /* Status Colors - Dark Variants */
      --color-status-error-dark: ${COLORS.status.errorDark};
      --color-status-success-dark: ${COLORS.status.successDark};
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
      --theme-text-muted: ${COLORS.neutral.gray300};

      /* Input text - dark for better contrast on lighter input background */
      --theme-input-text: ${COLORS.neutral.gray900};

      /* Brand colors (same as light mode like v3) */
      --color-primary: ${COLORS.brand.primary};
      --color-brand-primary: ${COLORS.brand.primary};
      --color-secondary: #64b5f6;
      --color-accent: #f48fb1;

      /* Border colors */
      --color-border: ${COLORS.neutral.gray600};
      --theme-border: ${COLORS.neutral.gray600};
      --theme-input-border: ${COLORS.neutral.gray600};
      --theme-input-border-hover: ${COLORS.neutral.gray500};

      /* Input/Form colors - darker like v3 */
      --theme-input-background: ${COLORS.neutral.gray650};
      --theme-input-background-focus: ${COLORS.neutral.gray600};
      --theme-input-background-valid: ${COLORS.neutral.gray650};
      --theme-input-background-disabled: ${COLORS.neutral.gray700};
      --theme-hover-background: ${COLORS.neutral.gray700};
      --theme-button-text-on-color: ${COLORS.neutral.white};

      /* Validation message colors - lighter for dark mode readability */
      --theme-validation-error: #ff6659;
      --theme-validation-success: #66bb6a;

      /* Validation border colors - full saturation for dark mode */
      --theme-validation-error-border: #ff6659;
      --theme-validation-success-border: #66bb6a;

      /* Card colors - darker like v3 */
      --theme-card-background: ${COLORS.neutral.gray750};

      /* Table header - darker like v3 */
      --theme-table-header-bg-dark: ${COLORS.neutral.gray770};

      /* Modal background - darker than inputs */
      --theme-modal-background: ${COLORS.neutral.gray800};

      /* Status colors - lighter shades for dark mode */
      --color-success: ${COLORS.status.success};
      --color-warning: ${COLORS.status.warning};
      --color-error: ${COLORS.status.error};
      --color-info: ${COLORS.status.info};
      --color-status-error: #ef5350;
      --color-status-error-light: #ff6659;

      /* Button danger-subtle - dark mode override */
      --button-danger-subtle-bg: ${COLORS.button.dangerSubtle.dark};
      --button-danger-subtle-hover: ${COLORS.button.dangerSubtle.darkHover};

      /* Button warning - darker for dark mode */
      --button-warning-from: #c46d3a;
      --button-warning-to: #a0522d;

      /* Sidebar - Dark Theme Override */
      --sidebar-bg: ${SIDEBAR.background.dark};
      --sidebar-popover-bg: ${SIDEBAR.popoverBackground.dark};
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