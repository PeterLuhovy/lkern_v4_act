/*
 * ================================================================
 * FILE: design-tokens.ts
 * PATH: packages/config/src/constants/design-tokens.ts
 * DESCRIPTION: Design tokens for L-KERN v4 ERP system
 * VERSION: v2.0.0
 * UPDATED: 2025-11-06 18:00:00
 * ================================================================
 * CHANGELOG v2.0.0:
 *   - Added GRADIENTS (6 patterns for backgrounds/interactive elements)
 *   - Enhanced ANIMATIONS (hover, stateChange durations + bounce, smooth easings)
 *   - Enhanced HOVER_EFFECTS (clarified scale values)
 *   - Enhanced SHADOWS (focus rings, component shadows, inset deep)
 *   - Enhanced COLORS.status (errorDark, successDark for borders)
 *   - Added SIDEBAR (background + popoverBackground for light/dark)
 *   - Total: ~50 new tokens added for Design System Refactor
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

    // Darker variants for borders (better contrast)
    errorDark: '#d32f2f',    // Darker red for error borders
    successDark: '#388e3c',  // Darker green for success borders
  },

  // Button variant colors
  button: {
    dangerSubtle: {
      light: '#c97575',      // Light mode - softer pink-red
      lightHover: '#d68585', // Light mode hover
      dark: '#904040',       // Dark mode - muted dark red
      darkHover: '#a04848',  // Dark mode hover
    },
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
    gray255: '#d5d6dd',      // Light table header background (v3 compatibility)
    gray300: '#e0e0e0',
    gray400: '#bdbdbd',
    gray500: '#9e9e9e',
    gray600: '#757575',
    gray650: '#4a4a4a',      // Dark input background (v3 compatibility)
    gray700: '#616161',
    gray750: '#2d2d2d',      // Dark card background (v3 compatibility)
    gray770: '#383838',      // Dark table header background (v3 compatibility)
    gray800: '#424242',
    gray900: '#212121',
    black: '#000000',
  },
} as const;

/**
 * SPACING TOKENS
 * 8px grid system - all spacing values based on 8px base unit
 *
 * Čo to je: Systém rozostupov založený na 8px mriežke pre konzistentné spacing
 * Prečo: Jednotné rozostupy pre všetky komponenty, responzívne layouty, hero sekcie
 * Kedy zmeniť: Pri redizajne spacing systému alebo zmene design language
 */
export const SPACING = {
  none: 0,    // 0rem - žiadny rozostup
  xs: 4,      // 0.25rem - extra malý rozostup (padding v malých prvkoch)
  sm: 8,      // 0.5rem - malý rozostup (compact layouts)
  md: 16,     // 1rem - stredný rozostup (štandardné medzery)
  lg: 24,     // 1.5rem - veľký rozostup (sekcie)
  xl: 32,     // 2rem - extra veľký rozostup (veľké sekcie)
  xxl: 40,    // 2.5rem - dvoj-extra veľký (veľké oddelenia)
  xxxl: 48,   // 3rem - troj-extra veľký (hlavné sekcie)
  huge: 56,   // 3.5rem - obrovský rozostup (hero sekcie, veľké layouty)
  xhuge: 64,  // 4rem - extra obrovský rozostup (najväčšie sekcie, hero bannery)
} as const;

/**
 * TYPOGRAPHY TOKENS
 * Font sizes, weights, and line heights
 *
 * Čo to je: Systém veľkostí písma, váh a výšok riadkov pre všetky textové elementy
 * Prečo: Jednotná typografia, konzistentné nadpisy, hero sekcie s veľkou typografiou
 * Kedy zmeniť: Pri redizajne typografie alebo zmene brand guidelines
 */
export const TYPOGRAPHY = {
  // Font sizes
  fontSize: {
    xs: 10,     // Extra small - badges, timestamps, tiny labels
    sm: 12,     // Small - helper text, captions, footnotes
    md: 14,     // Standard - body text, inputs, default text
    lg: 16,     // Large - headings, important text, emphasized content
    xl: 18,     // Extra large - section headings, subheaders
    xxl: 24,    // H2 headings, modal titles, card headers
    xxxl: 32,   // H1 headings, page titles, main headers
    huge: 40,   // Hero text - large hero sections
    /**
     * Čo to je: Hero veľkosť fontu (48px) pre hlavné nadpisy landing pages
     * Prečo: Potrebné pre hero sekcie homepage kde je potrebná veľká typografia
     * Kedy zmeniť: Pri redizajne typografie alebo zmene brand guidelines
     */
    hero: 48,   // Hero titles - najväčšie titulky na landing pages a hero sekciách
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

  // Modal widths (5 sizes for flexible modal sizing)
  modalWidth: {
    xs: '400px',    // Extra small - alerts, simple confirmations
    sm: '480px',    // Small - compact forms, quick actions
    md: '720px',    // Medium - standard forms, detailed content
    lg: '1000px',   // Large - complex forms, rich content
    xl: '1200px',   // Extra large - full-featured interfaces, dashboards
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
  // Base shadows
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  xxl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',

  // Focus rings (3 levels for interactive elements)
  focus: {
    default: '0 0 0 3px rgba(156, 39, 176, 0.25)',   // Primary focus (most prominent)
    subtle: '0 0 0 3px rgba(156, 39, 176, 0.15)',    // Checked ring (less prominent)
    hover: '0 0 0 3px rgba(156, 39, 176, 0.1)',      // Hover ring (barely visible)
  },

  // Status focus rings
  focusError: '0 0 0 3px rgba(244, 67, 54, 0.15)',   // Error state focus ring
  focusSuccess: '0 0 0 3px rgba(76, 175, 80, 0.15)', // Success state focus ring

  // Status hover rings (lighter opacity for subtlety)
  hoverError: '0 0 0 3px rgba(211, 47, 47, 0.1)',    // Error state hover ring
  hoverSuccess: '0 0 0 3px rgba(56, 142, 60, 0.1)',  // Success state hover ring

  // Inset shadows
  insetDeep: 'inset 0 1px 3px rgba(0, 0, 0, 0.2)',   // Deep inset for pressed states

  // Component-specific shadows (pre-combined for performance, max 2 layers)
  component: {
    // Checkbox & Radio shadows
    checked: '0 2px 4px rgba(156, 39, 176, 0.25), 0 0 0 3px rgba(156, 39, 176, 0.15)',

    // Button shadows (per variant)
    button: {
      default: 'inset 0 1px 2px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1)',
      hover: 'inset 0 1px 2px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.15)',
      active: 'inset 0 1px 2px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.1)',
    },
    buttonSecondary: {
      default: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
      hover: 'inset 0 1px 2px rgba(0, 0, 0, 0.05), 0 0 0 3px rgba(156, 39, 176, 0.1)',
      active: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
    },

    // Card shadows (per variant)
    card: {
      default: 'inset 0 1px 2px rgba(0, 0, 0, 0.01)',
      defaultHover: '0 10px 15px -3px rgba(0, 0, 0, 0.15)',
      elevated: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      elevatedHover: '0 10px 15px -3px rgba(0, 0, 0, 0.15)',
      accent: '0 4px 6px rgba(156, 39, 176, 0.15)',
      accentHover: '0 8px 12px rgba(156, 39, 176, 0.25)',
    },

    // Checkbox shadows (per state)
    checkbox: {
      default: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
      hover: 'inset 0 1px 2px rgba(0, 0, 0, 0.05), 0 0 0 3px rgba(156, 39, 176, 0.1)',
      focus: 'inset 0 1px 2px rgba(0, 0, 0, 0.05), 0 0 0 3px rgba(156, 39, 176, 0.25)',
      checked: '0 2px 4px rgba(156, 39, 176, 0.25), 0 0 0 3px rgba(156, 39, 176, 0.15)',
      disabled: 'none',
    },

    // Radio shadows (similar to checkbox)
    radio: {
      default: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
      hover: 'inset 0 1px 2px rgba(0, 0, 0, 0.05), 0 0 0 3px rgba(156, 39, 176, 0.1)',
      focus: 'inset 0 1px 2px rgba(0, 0, 0, 0.05), 0 0 0 3px rgba(156, 39, 176, 0.25)',
      checked: '0 1px 2px rgba(0, 0, 0, 0.3)',
      disabled: 'none',
    },

    // Brand-colored shadows
    brandGlow: '0 4px 12px rgba(156, 39, 176, 0.3)',      // Purple glow for sidebar/highlights
    elevationDark: '0 8px 24px rgba(0, 0, 0, 0.3)',       // Dark mode large elevation
  },
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
 * GRADIENTS
 * Gradient patterns for backgrounds and interactive elements
 */
export const GRADIENTS = {
  // Brand gradients
  primary: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',       // Purple gradient for checked states
  disabled: 'linear-gradient(135deg, #9e9e9e 0%, #757575 100%)',      // Gray gradient for disabled states
  error: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',         // Red gradient for error states

  // Background gradients
  unchecked: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',     // White-to-gray for unchecked inputs

  // Radial gradients (for radio buttons)
  radialWhite: 'radial-gradient(circle, #ffffff 0%, #f0f0f0 100%)',   // Radio dot active
  radialDisabled: 'radial-gradient(circle, #ffffff 0%, #e0e0e0 100%)', // Radio dot disabled
} as const;

/**
 * ANIMATION TOKENS
 * Animation durations and timing functions
 */
export const ANIMATIONS = {
  duration: {
    instant: 0,          // 0ms - No animation
    hover: 150,          // 150ms - Hover effects (fast, responsive)
    stateChange: 220,    // 220ms - Checkbox, radio state changes (playful bounce)
    normal: 200,         // 200ms - Standard transitions
    modal: 300,          // 300ms - Modal open/close, complex animations
    sidebar: 350,        // 350ms - Sidebar expand/collapse (smooth, fluid)
    slow: 500,           // 500ms - Slow transitions (rare)
  },
  timing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',                                // Hover transitions (smooth deceleration)
    easeInOut: 'ease-in-out',                          // General transitions
    bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // State changes (playful bounce)
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',            // Material Design smooth
  },
} as const;

/**
 * HOVER EFFECTS TOKENS
 * Unified hover effect system for interactive elements
 *
 * Čo to je: 3-úrovňový hover systém (subtle, normal, strong) pre Cards a clickable elementy
 * Prečo: Konzistentné hover efekty naprieč celou aplikáciou
 * Kedy použiť:
 *   - subtle (-2px): Card default/outlined, subtle interactions
 *   - normal (-4px): DashboardCard, Card elevated/accent, standard interactions
 *   - strong (-8px): Hero sections, call-to-action elements
 */
export const HOVER_EFFECTS = {
  // Card & Button lift effects (3 levels) - translateY values
  lift: {
    subtle: '-2px',    // Card default, outlined - gentle lift
    normal: '-4px',    // DashboardCard, Card elevated/accent - standard lift
    strong: '-8px',    // Hero cards, CTA elements - dramatic lift
  },

  // Scale effects (3 levels) - transform scale values
  scale: {
    subtle: '1.002',   // Large elements (cards) - barely noticeable expansion
    normal: '1.005',   // Medium elements (buttons) - subtle growth
    strong: '1.05',    // Small elements (checkboxes) - prominent growth
  },

  // DataGrid specific (legacy - keep for compatibility)
  dataGrid: {
    cellScale: '0.995',
    cellTranslateY: '1.005px',
    rowHeight: 48,  // Average row height in pixels (for min-height calculation)
    headerHeight: 60,  // Header height in pixels
  },

  // Light mode hover effects (DataGrid v4 - subtle brand colors)
  lightMode: {
    overlay: 'linear-gradient(135deg, rgba(156, 39, 176, 0.08) 0%, rgba(51, 102, 204, 0.06) 50%, rgba(156, 39, 176, 0.08) 100%)',  // Brand gradient: purple → blue → purple
    shadow: 'var(--shadow-lg), 0 0 var(--spacing-sm) rgba(156, 39, 176, 0.15)',  // Shadow with purple glow
    textColor: 'inherit',  // Keep normal text color
    textWeight: 600,  // Semibold instead of bold
    textShadow: 'none',  // No shadow in light mode
  },

  // Dark mode hover effects (DataGrid specific)
  darkMode: {
    overlay: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.25) 100%)',
    shadow: '0 10px 30px rgba(255, 255, 255, 0.2), 0 5px 15px rgba(255, 255, 255, 0.1), 0 0 30px rgba(255, 255, 255, 0.4), 0 0 15px rgba(255, 255, 255, 0.3)',
    textColor: '#ffffff',
    textWeight: 700,
    textShadow: 'none',
  },

  // Layout properties (DataGrid specific)
  layout: {
    position: 'relative',
    zIndex: 10,
    borderRadius: '4px',
  },
} as const;

/**
 * SIDEBAR TOKENS
 * Sidebar-specific colors for light/dark themes
 *
 * Čo to je: Špeciálne farby pre Sidebar komponent (popover backgrounds)
 * Prečo: Sidebar popover má iné pozadie ako štandardné inputy
 * Kedy použiť: Len v Sidebar komponente pre popover sekcie
 */
export const SIDEBAR = {
  background: {
    light: '#ffffff',  // Light theme sidebar background
    dark: '#1a1a1a',   // Dark theme sidebar background
  },
  popoverBackground: {
    light: '#ffffff',  // Light theme popover background
    dark: '#252525',   // Dark theme popover background (lighter than main bg)
  },
} as const;

/**
 * VERSION TRACKING
 */
export const DESIGN_TOKENS_VERSION = '2.0.0';
