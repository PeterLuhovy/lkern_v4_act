/**
 * @file common.ts
 * @description Common TypeScript types for UI components
 * @version 1.0.0
 * @date 2025-10-18
 */
/**
 * Standard sizes used across components
 */
export type Size = 'xs' | 'small' | 'medium' | 'large';
/**
 * Component variants for styling
 */
export type Variant = 'primary' | 'secondary' | 'danger' | 'danger-subtle' | 'ghost' | 'success' | 'warning';
/**
 * Status variants for badges and indicators
 */
export type StatusVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';
/**
 * Base props that all components should accept
 */
export interface BaseComponentProps {
    className?: string;
    testId?: string;
}
