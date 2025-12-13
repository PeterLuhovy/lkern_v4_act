/*
 * ================================================================
 * FILE: constants.ts
 * PATH: /packages/config/src/utils/serviceWorkflow/constants.ts
 * DESCRIPTION: Configuration constants for serviceWorkflow timeouts,
 *              retry counts, and TTL values.
 * VERSION: v1.0.0
 * CREATED: 2025-12-10
 * UPDATED: 2025-12-10
 * ================================================================
 */

/**
 * Timeout values in milliseconds
 */
export const TIMEOUTS = {
  /** Timeout for each ping attempt (5 seconds) */
  PING: 5000,
  /** Timeout for full health check (10 seconds) */
  HEALTH: 10000,
  /** Delay before showing "taking longer" toast (1.5 seconds) */
  TAKING_LONGER: 1500,
} as const;

/**
 * Retry configuration
 */
export const RETRY = {
  /** Number of automatic health check retries */
  HEALTH_COUNT: 3,
  /** Delay between health check retry attempts (5 seconds) */
  HEALTH_DELAY: 5000,
  /** Number of verification retry attempts */
  VERIFICATION_COUNT: 3,
  /** Delay between verification retry attempts (2 seconds) */
  VERIFICATION_DELAY: 2000,
} as const;

/**
 * Cache configuration
 */
export const CACHE = {
  /** Default cache TTL for GET requests (5 minutes) */
  DEFAULT_TTL: 5 * 60 * 1000,
} as const;
