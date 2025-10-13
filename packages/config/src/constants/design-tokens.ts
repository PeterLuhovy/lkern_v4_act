/*
 * ================================================================
 * FILE: design-tokens.ts
 * PATH: packages/config/src/constants/design-tokens.ts
 * DESCRIPTION: Design tokens for L-KERN v4 ERP system
 * VERSION: v1.0.0
 * UPDATED: 2025-10-13
 * ================================================================
 */

/**
 * COLOR TOKENS
 * Color palette for brand, status, priority, and neutral colors
 */
export const COLORS = {
  // Brand colors
  brand: {
    primary: '#9c27b0',      // Primary purple
    secondary: '#3366cc',    // Secondary blue
    accent: '#E91E63',       // Accent pink
    dark: '#5e1065',         // Dark purple for hover
    light: '#ce93d8',        // Light purple for backgrounds
  },

  // Status colors
  status: {
    success: '#4CAF50',      // Green for success
    warning: '#FF9800',      // Orange for warnings
    error: '#f44336',        // Red for errors
    info: '#2196F3',         // Blue for info
    muted: '#9E9E9E',        // Gray for disabled
  },

  // Priority colors
  priority: {
    nizka: '#9E9E9E',        // Gray - low priority
    normalna: '#2196F3',     // Blue - normal priority
    stredna: '#FF9800',      // Orange - medium priority
    rychla: '#FF5722',       // Red-orange - fast priority
    extra_rychla: '#f44336', // Red - extra fast priority
  },

  // Neutral colors (gray scale)
  neutral: {
    white: '#ffffff',
    gray50: '#fafafa',
    gray100: '#f5f5f5',
    gray200: '#eeeeee',
    gray300: '#e0e0e0',
    gray400: '#bdbdbd',
    gray500: '#9e9e9e',
    gray600: '#757575',
    gray700: '#616161',
    gray800: '#424242',
    gray900: '#212121',
    black: '#000000',
  },
} as const;

/**
 * SPACING TOKENS
 * 8px grid system - all spacing values based on 8px base unit
 */
export const SPACING = {
  xs: 4,      // 0.25rem
  sm: 8,      // 0.5rem
  md: 12,     // 0.75rem
  lg: 16,     // 1rem
  xl: 20,     // 1.25rem
  xxl: 24,    // 1.5rem
  xxxl: 32,   // 2rem
  huge: 40,   // 2.5rem
} as const;

/**
 * TYPOGRAPHY TOKENS
 * Font sizes, weights, and line heights
 */
export const TYPOGRAPHY = {
  // Font sizes
  fontSize: {
    xs: 10,     // Extra small - badges, timestamps
    sm: 12,     // Small - helper text, captions
    md: 14,     // Standard - body text, inputs
    lg: 16,     // Large - headings, important text
    xl: 18,     // Extra large - section headings
    xxl: 24,    // H2 headings, modal titles
    xxxl: 32,   // H1 headings, page titles
    huge: 40,   // Hero text
  },

  // Font weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

/**
 * LAYOUT TOKENS
 * Border radius, z-index, max widths, breakpoints
 */
export const LAYOUT = {
  // Border radius
  borderRadius: {
    none: 0,
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    round: 50,
    pill: 9999,
  },

  // Z-index hierarchy
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 100,
    sticky: 200,
    modal: 1000,
    popover: 1100,
    notification: 9999,
  },

  // Container max widths
  maxWidth: {
    form: '600px',
    content: '800px',
    page: '1200px',
    wide: '1400px',
  },

  // Responsive breakpoints
  breakpoint: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px',
  },
} as const;

/**
 * SHADOW TOKENS
 * Box shadows for depth and elevation
 */
export const SHADOWS = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  xxl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const;

/**
 * BORDER TOKENS
 * Border widths and styles
 */
export const BORDERS = {
  width: {
    none: 0,
    thin: 1,
    medium: 2,
    thick: 4,
    heavy: 6,
  },
  style: {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
    none: 'none',
  },
} as const;

/**
 * ANIMATION TOKENS
 * Animation durations and timing functions
 */
export const ANIMATIONS = {
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  timing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

/**
 * HOVER EFFECTS TOKENS
 * Unified hover effect system for interactive elements
 */
export const HOVER_EFFECTS = {
  // Transform effects
  transform: {
    translateY: '-1px',
    scale: '1.005',
    cellScale: '0.995',
    cellTranslateY: '1.005px',
  },

  // Light mode hover effects
  lightMode: {
    overlay: 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.35) 50%, rgba(255, 255, 255, 0.5) 100%)',
    shadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 5px 15px rgba(0, 0, 0, 0.2), 0 0 25px rgba(255, 255, 255, 0.6), 0 0 12px rgba(255, 255, 255, 0.4)',
    textColor: '#ffffff',
    textWeight: 700,
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.5), 0 0 6px rgba(0, 0, 0, 0.3)',
  },

  // Dark mode hover effects
  darkMode: {
    overlay: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.25) 100%)',
    shadow: '0 10px 30px rgba(255, 255, 255, 0.2), 0 5px 15px rgba(255, 255, 255, 0.1), 0 0 30px rgba(255, 255, 255, 0.4), 0 0 15px rgba(255, 255, 255, 0.3)',
    textColor: '#ffffff',
    textWeight: 700,
    textShadow: 'none',
  },

  // Layout properties
  layout: {
    position: 'relative',
    zIndex: 10,
    borderRadius: '4px',
  },
} as const;

/**
 * VERSION TRACKING
 */
export const DESIGN_TOKENS_VERSION = '1.0.0';
