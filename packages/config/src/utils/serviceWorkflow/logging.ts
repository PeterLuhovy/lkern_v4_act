/*
 * ================================================================
 * FILE: logging.ts
 * PATH: /packages/config/src/utils/serviceWorkflow/logging.ts
 * DESCRIPTION: Isolated logging context for serviceWorkflow.
 *              Prevents race conditions when multiple workflows run in parallel.
 *              Includes sensitive data filtering for PII protection.
 * VERSION: v1.1.0
 * CREATED: 2025-12-10
 * UPDATED: 2025-12-10
 * CHANGELOG:
 *   v1.1.0 - Added sensitive field filtering (security enhancement)
 *   v1.0.0 - Initial version - WorkflowContext class for isolated state
 * ================================================================
 */

// ============================================================
// SENSITIVE FIELD FILTERING (Security)
// ============================================================

/**
 * List of field names that should NEVER be logged (PII/credentials).
 * Prevents accidental exposure of sensitive data in console logs.
 */
const SENSITIVE_FIELDS = [
  'password',
  'passwd',
  'pwd',
  'token',
  'access_token',
  'refresh_token',
  'api_key',
  'apikey',
  'secret',
  'auth',
  'authorization',
  'ssn',
  'social_security',
  'credit_card',
  'card_number',
  'cvv',
  'pin',
  'iban',
  'bank_account',
  'private_key',
  'session',
  'cookie',
] as const;

/**
 * Sanitize a value for logging - redact sensitive information.
 *
 * @param key - Field name
 * @param value - Field value
 * @returns Sanitized string safe for logging
 */
export function sanitizeForLogging(key: string, value: unknown): string {
  // Check if field name contains sensitive keyword
  const keyLower = key.toLowerCase();
  const isSensitive = SENSITIVE_FIELDS.some(field => keyLower.includes(field));

  if (isSensitive) {
    return '***REDACTED***';
  }

  // Truncate long values
  const stringValue = String(value);
  if (stringValue.length > 100) {
    return `${stringValue.substring(0, 100)}... (${stringValue.length} chars)`;
  }

  return stringValue;
}

/**
 * Isolated logging context for a single workflow execution.
 * Prevents race conditions that occur with global logging variables.
 *
 * @example
 * ```typescript
 * const context = new WorkflowContext(true, 'IssueCreateHandler');
 * context.log('Starting workflow...');
 * context.logSection('STEP 1: HEALTH CHECK');
 * ```
 */
export class WorkflowContext {
  private readonly startTime: number;

  constructor(
    public readonly debug: boolean,
    public readonly caller: string
  ) {
    this.startTime = performance.now();
  }

  /**
   * Format elapsed time since workflow start.
   * Returns compact timestamp like "[+0.123s]"
   */
  private formatElapsedTime(): string {
    const elapsed = (performance.now() - this.startTime) / 1000; // Convert to seconds
    return `[+${elapsed.toFixed(3)}s]`;
  }

  /**
   * Log a message with timestamp (only if debug enabled).
   *
   * @param message - Message to log
   * @param data - Optional data to log
   */
  log(message: string, data?: unknown): void {
    if (!this.debug) return;
    const timestamp = this.formatElapsedTime();
    if (data !== undefined) {
      console.log(`${timestamp} [${this.caller}] ${message}`, data);
    } else {
      console.log(`${timestamp} [${this.caller}] ${message}`);
    }
  }

  /**
   * Log a section divider with title.
   */
  logSection(title: string): void {
    if (!this.debug) return;
    const timestamp = this.formatElapsedTime();
    console.log('───────────────────────────────────────────────────────────────');
    console.log(`${timestamp} [${this.caller}] ${title}`);
    console.log('───────────────────────────────────────────────────────────────');
  }

  /**
   * Log a header divider with title (double line).
   */
  logHeader(title: string): void {
    if (!this.debug) return;
    const timestamp = this.formatElapsedTime();
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`${timestamp} [${this.caller}] ${title}`);
    console.log('═══════════════════════════════════════════════════════════════');
  }

  /**
   * Get elapsed time in seconds since workflow start.
   */
  getElapsedSeconds(): number {
    return (performance.now() - this.startTime) / 1000;
  }

  /**
   * Get elapsed time formatted as string (e.g., "2.456s").
   */
  getElapsedFormatted(): string {
    return `${this.getElapsedSeconds().toFixed(3)}s`;
  }
}
