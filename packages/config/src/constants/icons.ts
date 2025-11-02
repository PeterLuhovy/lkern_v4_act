/*
 * ================================================================
 * FILE: icons.ts
 * PATH: /packages/config/src/constants/icons.ts
 * DESCRIPTION: Modern professional icon set for ERP system
 * VERSION: v3.1.0
 * UPDATED: 2025-11-02
 * CHANGES:
 *   - v3.1.0: Added missing icons from sidebar (cardGame, emptyMailbox, tools, window, palette, toast, badge)
 *   - v3.0.0: Modern colorful icons - clean, professional emoji set
 *   - v2.0.0: Ultra-minimalistic geometric symbols
 *   - v1.1.0: Replaced colorful emojis with B&W Unicode symbols
 *   - v1.0.0: Initial professional icon set
 * ================================================================
 */

/**
 * Modern professional icon set using clean emoji
 * Design Philosophy:
 *   - Modern, colorful, clear visual communication
 *   - Professional business context
 *   - High recognizability
 *   - Consistent visual language
 *   - Clean, not playful
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NAVIGATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ICONS_NAVIGATION = {
  home: '🏠',          // Home
  menu: '☰',           // Menu
  back: '◀️',          // Back
  forward: '▶️',       // Forward
  up: '⬆️',            // Up
  down: '⬇️',          // Down
  expand: '➕',        // Expand
  collapse: '➖',      // Collapse
  chevronRight: '▶️',  // Chevron right
  chevronLeft: '◀️',   // Chevron left
  chevronUp: '🔼',     // Chevron up
  chevronDown: '🔽',   // Chevron down
  first: '⏮️',         // First
  last: '⏭️',          // Last
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ACTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ICONS_ACTIONS = {
  add: '➕',           // Add
  remove: '➖',        // Remove
  delete: '🗑️',       // Delete
  edit: '✏️',          // Edit
  save: '💾',          // Save
  cancel: '❌',        // Cancel
  search: '🔍',        // Search
  filter: '🔽',        // Filter
  sort: '⬍',           // Sort
  refresh: '🔄',       // Refresh
  settings: '⚙️',      // Settings
  copy: '📋',          // Copy
  paste: '📄',         // Paste
  download: '⬇️',      // Download
  upload: '⬆️',        // Upload
  print: '🖨️',        // Print
  lock: '🔒',          // Lock
  unlock: '🔓',        // Unlock
  more: '⋯',           // More
  moreVertical: '⋮',   // More vertical
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STATUS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ICONS_STATUS = {
  success: '✅',        // Success
  error: '❌',          // Error
  warning: '⚠️',        // Warning
  info: 'ℹ️',           // Info
  pending: '⏳',        // Pending
  active: '🟢',         // Active
  inactive: '⚪',       // Inactive
  partial: '🟡',        // Partial
  progress: '⏳',       // Progress
  completed: '✅',      // Completed
  blocked: '🔴',        // Blocked
  star: '⭐',          // Star filled
  starEmpty: '☆',      // Star empty
  flag: '🚩',          // Flag
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ICONS_DATA = {
  table: '📊',         // Table
  list: '📋',          // List
  grid: '▦',           // Grid
  card: '🗂️',         // Card
  cardGame: '🃏',      // Card (game card)
  chart: '📈',         // Chart
  calendar: '📅',      // Calendar
  clock: '🕐',         // Clock
  document: '📄',      // Document
  folder: '📁',        // Folder
  file: '📄',          // File
  image: '🖼️',        // Image
  attach: '📎',        // Attach
  link: '🔗',          // Link
  tag: '🏷️',          // Tag
  bookmark: '🔖',      // Bookmark
  emptyMailbox: '📭',  // Empty state
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BUSINESS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ICONS_BUSINESS = {
  user: '👤',          // User
  users: '👥',         // Users
  company: '🏢',       // Company
  money: '💰',         // Money
  currency: '💶',      // Currency
  invoice: '🧾',       // Invoice
  cart: '🛒',          // Cart
  box: '📦',           // Box
  truck: '🚚',         // Truck
  factory: '🏭',       // Factory
  warehouse: '🏬',     // Warehouse
  phone: '📞',         // Phone
  email: '✉️',         // Email
  location: '📍',      // Location
  globe: '🌐',         // Globe
  contract: '📝',      // Contract
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SYSTEM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ICONS_SYSTEM = {
  dashboard: '📊',     // Dashboard
  reports: '📋',       // Reports
  analytics: '📈',     // Analytics
  database: '💾',      // Database
  server: '🖥️',       // Server
  api: '⚡',           // API
  sync: '🔄',          // Sync
  notification: '🔔',  // Notification
  help: '❓',          // Help
  support: 'ℹ️',       // Support
  bug: '🐛',           // Bug
  test: '🧪',          // Test
  testing: '🧪',       // Testing (same as test)
  security: '🔐',      // Security
  logout: '🚪',        // Logout
  admin: '👑',         // Admin
  tools: '🔧',         // Tools/utilities
  window: '🪟',        // Window/modal
  palette: '🎨',       // Design/palette
  toast: '🍞',         // Toast notification
  badge: '🏷️',        // Badge/label
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SHAPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ICONS_SHAPES = {
  circleFilled: '🔵',  // Circle filled
  circleEmpty: '⚪',   // Circle empty
  squareFilled: '🟦',  // Square filled
  squareEmpty: '⬜',   // Square empty
  triangleUp: '🔺',    // Triangle up
  triangleDown: '🔻',  // Triangle down
  triangleRight: '▶️', // Triangle right
  triangleLeft: '◀️',  // Triangle left
  diamond: '🔶',       // Diamond
  diamondSmall: '🔸',  // Diamond small
  star: '⭐',          // Star
  starSmall: '✨',     // Star small
  heart: '❤️',         // Heart
  bullet: '•',         // Bullet
  dot: '·',            // Dot
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMBINED EXPORT (All icons in one object)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ICONS = {
  navigation: ICONS_NAVIGATION,
  actions: ICONS_ACTIONS,
  status: ICONS_STATUS,
  data: ICONS_DATA,
  business: ICONS_BUSINESS,
  system: ICONS_SYSTEM,
  shapes: ICONS_SHAPES,
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPE EXPORTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type IconCategory = keyof typeof ICONS;
export type NavigationIcon = keyof typeof ICONS_NAVIGATION;
export type ActionIcon = keyof typeof ICONS_ACTIONS;
export type StatusIcon = keyof typeof ICONS_STATUS;
export type DataIcon = keyof typeof ICONS_DATA;
export type BusinessIcon = keyof typeof ICONS_BUSINESS;
export type SystemIcon = keyof typeof ICONS_SYSTEM;
export type ShapeIcon = keyof typeof ICONS_SHAPES;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UTILITY FUNCTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Get icon by category and name
 * @example getIcon('actions', 'save') // '✓'
 */
export function getIcon(
  category: IconCategory,
  name: string
): string {
  const categoryIcons = ICONS[category];
  if (!categoryIcons) {
    throw new Error(`Invalid icon category: ${category}`);
  }

  const icon = (categoryIcons as Record<string, string>)[name];
  if (!icon) {
    throw new Error(`Icon "${name}" not found in category "${category}"`);
  }

  return icon;
}

/**
 * Get all icons from a category
 * @example getAllIcons('status') // ['✓', '✗', '⚠', ...]
 */
export function getAllIcons(category: IconCategory): string[] {
  return Object.values(ICONS[category]);
}

/**
 * Get icon name by symbol (reverse lookup)
 * @example getIconName('✓') // 'save' (or 'success')
 */
export function getIconName(symbol: string): string | null {
  for (const [_categoryName, categoryIcons] of Object.entries(ICONS)) {
    for (const [iconName, iconSymbol] of Object.entries(categoryIcons)) {
      if (iconSymbol === symbol) {
        return iconName;
      }
    }
  }
  return null;
}
