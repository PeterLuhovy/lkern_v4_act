/*
 * ================================================================
 * FILE: index.ts
 * PATH: /packages/config/src/hooks/useLocking/index.ts
 * DESCRIPTION: Barrel export for useLocking hook
 * VERSION: v1.0.0
 * CREATED: 2025-12-09
 * UPDATED: 2025-12-09
 * ================================================================
 */

export { useLocking } from './useLocking';
export type {
  UseLockingConfig,
  UseLockingResult,
  LockState,
  LockInfo,
  LockAcquireResult,
  LockReleaseResult,
  LockingCallbacks,
  LockingUserInfo,
} from './types';
