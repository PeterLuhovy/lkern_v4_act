/**
 * @file classNames.ts
 * @description Utility for combining CSS class names
 * @version 1.0.0
 * @date 2025-10-18
 */

/**
 * Combines multiple class names into a single string
 * Filters out falsy values (undefined, null, false, '')
 *
 * @example
 * classNames('button', isActive && 'button--active', className)
 * // Returns: 'button button--active custom-class'
 */
export function classNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
