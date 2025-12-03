/*
 * ================================================================
 * FILE: core.ts
 * PATH: /packages/config/src/permissions/core.ts
 * DESCRIPTION: Core permission configuration with numeric levels (0-100)
 * VERSION: v1.1.0
 * UPDATED: 2025-11-29
 *
 * CHANGES:
 *   - v1.1.0: Moved from permissions.ts to permissions/core.ts
 * ================================================================
 */

/**
 * Permission level thresholds - Easily configurable
 * Add new thresholds as needed without changing logic
 */
export const PERMISSION_THRESHOLDS = {
  VIEW: 1,           // Can view issues
  CREATE: 30,        // Can create new issues (standard level)
  EDIT: 60,          // Can edit issues (expert level)
  DELETE: 60,        // Can delete issues (expert level)
  EXPORT: 60,        // Can export data (expert level)
  VIEW_DELETED: 60,  // Can view soft-deleted issues (expert level)
  // Future thresholds can be added here:
  // APPROVE: 80,
  // ADMIN_PANEL: 90,
} as const;

/**
 * Permission level ranges for color coding
 * Inverted scale: Green = safe/minimal, Red = danger/maximum
 */
export const PERMISSION_COLOR_RANGES = {
  SAFE: { min: 0, max: 29, color: 'green', label: 'Bezpečné' },
  CAUTION: { min: 30, max: 59, color: 'yellow', label: 'Opatrne' },
  ELEVATED: { min: 60, max: 99, color: 'orange', label: 'Zvýšené' },
  DANGER: { min: 100, max: 100, color: 'red', label: 'Nebezpečné' },
} as const;

/**
 * Super Admin level - bypasses ALL field restrictions including id/issue_code
 * Only Ctrl+9 (level 100) has this capability
 */
export const SUPER_ADMIN_LEVEL = 100;

/**
 * Quick-access permission levels - 9 levels for keyboard shortcuts (Ctrl+1 to Ctrl+9)
 *
 * Basic (0-29 range):
 *   - BASIC_1 (Ctrl+1): 10 - View only, minimal access
 *   - BASIC_2 (Ctrl+2): 20 - Basic viewer
 *   - BASIC_3 (Ctrl+3): 29 - Basic user (top of range)
 *
 * Standard (30-59 range):
 *   - STANDARD_1 (Ctrl+4): 35 - Standard entry
 *   - STANDARD_2 (Ctrl+5): 45 - Standard user (middle)
 *   - STANDARD_3 (Ctrl+6): 59 - Standard power user
 *
 * Admin (60-100 range):
 *   - ADMIN_1 (Ctrl+7): 65 - Admin entry
 *   - ADMIN_2 (Ctrl+8): 85 - Admin elevated
 *   - ADMIN_3 (Ctrl+9): 100 - Full admin (max)
 */
export const QUICK_PERMISSION_LEVELS = {
  // Basic levels (0-29)
  BASIC_1: 10,
  BASIC_2: 20,
  BASIC_3: 29,
  // Standard levels (30-59)
  STANDARD_1: 35,
  STANDARD_2: 45,
  STANDARD_3: 59,
  // Admin levels (60-100)
  ADMIN_1: 65,
  ADMIN_2: 85,
  ADMIN_3: 100,
  // Legacy aliases for backwards compatibility
  BASIC: 10,
  STANDARD: 45,
  ADVANCED: 100,
} as const;

/**
 * Keyboard shortcut mapping (Ctrl+1 to Ctrl+9)
 */
export const PERMISSION_SHORTCUTS: Array<{ key: string; level: number; label: string }> = [
  { key: '1', level: QUICK_PERMISSION_LEVELS.BASIC_1, label: 'Basic lvl1' },
  { key: '2', level: QUICK_PERMISSION_LEVELS.BASIC_2, label: 'Basic lvl2' },
  { key: '3', level: QUICK_PERMISSION_LEVELS.BASIC_3, label: 'Basic lvl3' },
  { key: '4', level: QUICK_PERMISSION_LEVELS.STANDARD_1, label: 'Standard lvl1' },
  { key: '5', level: QUICK_PERMISSION_LEVELS.STANDARD_2, label: 'Standard lvl2' },
  { key: '6', level: QUICK_PERMISSION_LEVELS.STANDARD_3, label: 'Standard lvl3' },
  { key: '7', level: QUICK_PERMISSION_LEVELS.ADMIN_1, label: 'Admin lvl1' },
  { key: '8', level: QUICK_PERMISSION_LEVELS.ADMIN_2, label: 'Admin lvl2' },
  { key: '9', level: QUICK_PERMISSION_LEVELS.ADMIN_3, label: 'Admin lvl3' },
];

/**
 * Maps numeric permission level to backend role string
 * Backend still uses role-based API endpoints
 *
 * Permission ranges:
 * - Basic: 0-29
 * - Standard: 30-59
 * - Advanced: 60-100
 *
 * @param level - Numeric permission level (0-100)
 * @returns Backend role string ('user_basic' | 'user_standard' | 'user_advance')
 */
export function getBackendRole(level: number): 'user_basic' | 'user_standard' | 'user_advance' {
  if (level >= 60) return 'user_advance';
  if (level >= 30) return 'user_standard';
  return 'user_basic';
}

/**
 * Get permission level from role string (for backwards compatibility)
 *
 * @param role - Role string ('basic' | 'standard' | 'advanced')
 * @returns Numeric permission level
 */
export function getPermissionFromRole(role: 'basic' | 'standard' | 'advanced'): number {
  switch (role) {
    case 'advanced': return QUICK_PERMISSION_LEVELS.ADVANCED;
    case 'standard': return QUICK_PERMISSION_LEVELS.STANDARD;
    case 'basic': return QUICK_PERMISSION_LEVELS.BASIC;
    default: return QUICK_PERMISSION_LEVELS.BASIC;
  }
}

/**
 * Get color range info for a permission level
 *
 * @param level - Numeric permission level (0-100)
 * @returns Color range object with color, label, min, max
 */
export function getPermissionColorRange(level: number): typeof PERMISSION_COLOR_RANGES[keyof typeof PERMISSION_COLOR_RANGES] {
  if (level >= PERMISSION_COLOR_RANGES.DANGER.min) return PERMISSION_COLOR_RANGES.DANGER;
  if (level >= PERMISSION_COLOR_RANGES.ELEVATED.min) return PERMISSION_COLOR_RANGES.ELEVATED;
  if (level >= PERMISSION_COLOR_RANGES.CAUTION.min) return PERMISSION_COLOR_RANGES.CAUTION;
  return PERMISSION_COLOR_RANGES.SAFE;
}

/**
 * Permission check functions
 * Use these throughout the app instead of hardcoded role checks
 */

export function canView(level: number): boolean {
  return level >= PERMISSION_THRESHOLDS.VIEW;
}

export function canCreate(level: number): boolean {
  return level >= PERMISSION_THRESHOLDS.CREATE;
}

export function canEdit(level: number): boolean {
  return level >= PERMISSION_THRESHOLDS.EDIT;
}

export function canDelete(level: number): boolean {
  return level >= PERMISSION_THRESHOLDS.DELETE;
}

export function canExport(level: number): boolean {
  return level >= PERMISSION_THRESHOLDS.EXPORT;
}

export function canViewDeleted(level: number): boolean {
  return level >= PERMISSION_THRESHOLDS.VIEW_DELETED;
}

/**
 * Validate permission level is within valid range
 *
 * @param level - Numeric permission level
 * @returns Valid level clamped to 0-100 range
 */
export function validatePermissionLevel(level: number): number {
  const numLevel = Number(level);
  if (isNaN(numLevel)) return QUICK_PERMISSION_LEVELS.BASIC;
  return Math.max(0, Math.min(100, Math.floor(numLevel)));
}

/**
 * Get permission level from LocalStorage
 *
 * @returns Stored permission level or default (30)
 */
export function getStoredPermissionLevel(): number {
  try {
    const stored = localStorage.getItem('permissionLevel');
    if (stored === null) return QUICK_PERMISSION_LEVELS.BASIC;
    return validatePermissionLevel(parseInt(stored, 10));
  } catch {
    return QUICK_PERMISSION_LEVELS.BASIC;
  }
}

/**
 * Save permission level to LocalStorage
 *
 * @param level - Numeric permission level (0-100)
 */
export function setStoredPermissionLevel(level: number): void {
  try {
    const validLevel = validatePermissionLevel(level);
    localStorage.setItem('permissionLevel', validLevel.toString());
  } catch (error) {
    console.error('Failed to save permission level:', error);
  }
}
