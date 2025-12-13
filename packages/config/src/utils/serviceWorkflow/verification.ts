/*
 * ================================================================
 * FILE: verification.ts
 * PATH: /packages/config/src/utils/serviceWorkflow/verification.ts
 * DESCRIPTION: Verification logic for SQL records, MinIO attachments,
 *              field comparison, and pre-delete integrity checks.
 * VERSION: v1.0.0
 * CREATED: 2025-12-10
 * UPDATED: 2025-12-10
 * ================================================================
 */

import type { VerificationConfig, DeleteVerificationConfig, DataIntegrityEvent } from './types';
import { RETRY } from './constants';

// ============================================================
// LOGGING ADAPTER (temporary - will be replaced with WorkflowContext)
// ============================================================

// TODO: Replace with WorkflowContext parameter after full refactor
let _debugEnabled = false;
let _callerName = 'ServiceWorkflow';
let _log: (message: string, data?: unknown) => void = () => { /* noop */ };

/**
 * Configure logging for verification module.
 *
 * INTERNAL USE ONLY - Called by serviceWorkflow to set up logging.
 * Will be removed when WorkflowContext migration is complete.
 *
 * @param debugEnabled - Enable debug logging
 * @param callerName - Name of calling service (for context)
 * @param logFn - Logging function from WorkflowContext
 * @internal
 */
export function setVerificationLogger(
  debugEnabled: boolean,
  callerName: string,
  logFn: (message: string, data?: unknown) => void
): void {
  _debugEnabled = debugEnabled;
  _callerName = callerName;
  _log = logFn;
}

function log(message: string, data?: unknown): void {
  if (_debugEnabled) {
    _log(message, data);
  }
}

// ============================================================
// TYPES
// ============================================================

/**
 * Result of MinIO attachment verification for a single file.
 */
export interface AttachmentVerificationResult {
  /** File name */
  fileName: string;
  /** Whether file is accessible in MinIO */
  available: boolean;
  /** Expected file size (from original upload) */
  expectedSize?: number;
  /** Actual file size (from database) */
  actualSize?: number;
  /** Whether sizes match */
  sizeMatch?: boolean;
}

/**
 * Result of comprehensive verification (SQL + attachments + fields).
 */
export interface VerificationResult {
  /** Whether SQL record exists */
  sqlVerified: boolean;
  /** Whether all attachments are verified */
  attachmentsVerified: boolean;
  /** Detailed attachment results */
  attachmentResults?: AttachmentVerificationResult[];
  /** Field comparison results (sent vs saved) */
  fieldComparison?: {
    results: Array<{ field: string; sent: unknown; saved: unknown; match: boolean }>;
    matchCount: number;
    totalCount: number;
    allMatch: boolean;
  };
  /** Total verification time in milliseconds */
  verificationTime: number;
}

/**
 * Result of pre-delete verification (data integrity check).
 */
export interface PreDeleteVerificationResult {
  /** Whether verification succeeded */
  success: boolean;
  /** Files in DB but missing from MinIO */
  missingInMinio: string[];
  /** Files in MinIO but not in DB */
  orphanedInMinio: string[];
  /** Number of attachments in database */
  dbAttachments: number;
  /** Number of files in MinIO */
  minioFiles: number;
  /** Whether data integrity issues were found */
  hasIntegrityIssues: boolean;
}

// ============================================================
// HELPER: NORMALIZE VALUES FOR COMPARISON
// ============================================================

/**
 * Normalize a value for comparison (handles datetime format differences).
 *
 * @param value - Value to normalize
 * @returns Normalized value (ISO datetime string if datetime detected)
 */
function normalizeForComparison(value: unknown): unknown {
  if (typeof value !== 'string') return value;

  // Check if it looks like a datetime (has T separator and looks like ISO format)
  const datetimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;
  if (!datetimePattern.test(value)) return value;

  try {
    // Parse and re-format to consistent ISO string
    const date = new Date(value);
    if (isNaN(date.getTime())) return value; // Invalid date, return original

    // Return ISO string (always has consistent format)
    return date.toISOString();
  } catch {
    return value;
  }
}

// ============================================================
// VERIFICATION HELPERS
// ============================================================

/**
 * Handle verification retry delay and callback.
 *
 * Centralizes retry logic to avoid duplication:
 * - Log retry attempt
 * - Invoke callback (if provided)
 * - Wait for retry delay
 *
 * @param attempt - Current attempt number (1-based)
 * @param maxAttempts - Maximum retry attempts
 * @param retryDelay - Delay between retries (milliseconds)
 * @param onRetry - Optional callback for retry notification
 */
async function handleVerificationRetry(
  attempt: number,
  maxAttempts: number,
  retryDelay: number,
  onRetry?: (attempt: number, maxAttempts: number) => void
): Promise<void> {
  if (attempt > 1) {
    log(`🔄 Verification retry attempt ${attempt}/${maxAttempts}`);
    onRetry?.(attempt, maxAttempts);
    await new Promise(resolve => setTimeout(resolve, retryDelay));
  }
}

// ============================================================
// POST-CREATION VERIFICATION (SQL + MINIO + FIELDS)
// ============================================================

/**
 * Perform comprehensive verification after resource creation.
 *
 * Verifies:
 * 1. SQL record exists (GET request with retry)
 * 2. Fields match (sent vs saved comparison)
 * 3. MinIO attachments are accessible and sizes match
 *
 * Features:
 * - Automatic retry on failure (default: 3 attempts)
 * - Configurable retry delay (default: 2 seconds)
 * - Field comparison with datetime normalization
 * - Attachment size verification
 * - Detailed logging of all checks
 *
 * @template TResult - Type of API response data
 * @param baseUrl - Service base URL
 * @param config - Verification configuration
 * @param result - API response data (contains entity ID)
 * @param originalData - Original data sent to API (for field comparison)
 * @param permissionLevel - Permission level header
 * @param originalFiles - Original files uploaded (for size comparison)
 * @param onVerificationRetry - Callback for retry attempts
 * @returns Verification result with detailed status
 */
export async function performVerification<TResult>(
  baseUrl: string,
  config: VerificationConfig<TResult>,
  result: TResult,
  originalData?: unknown,
  permissionLevel?: number,
  originalFiles?: File[],
  onVerificationRetry?: (attempt: number, maxAttempts: number) => void
): Promise<VerificationResult> {
  const startTime = performance.now();

  let sqlVerified = false;
  const expectedAttachments = originalFiles?.length ?? 0;
  let attachmentsVerified = expectedAttachments === 0; // true if no files expected
  const attachmentResults: AttachmentVerificationResult[] = [];
  let fieldComparison: VerificationResult['fieldComparison'] = undefined;

  if (!config.enabled) {
    return {
      sqlVerified: true,
      attachmentsVerified: true,
      verificationTime: Math.round(performance.now() - startTime),
    };
  }

  // Verification retry configuration
  const maxRetries = config.maxRetries ?? RETRY.VERIFICATION_COUNT;
  const retryDelay = config.retryDelay ?? RETRY.VERIFICATION_DELAY;

  let verificationAttempt = 1;

  // Retry loop for verification
  while (verificationAttempt <= maxRetries) {
    // Handle retry delay and callback (if not first attempt)
    await handleVerificationRetry(verificationAttempt, maxRetries, retryDelay, onVerificationRetry);

  try {
    const endpoint = config.getEndpoint(result);
    log(`📋 Verifying SQL record: GET ${baseUrl}${endpoint}`);

    const timeout = config.timeout ?? 5000;
    const headers: Record<string, string> = {};
    if (permissionLevel !== undefined) {
      headers['X-Permission-Level'] = String(permissionLevel);
    }

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(timeout),
    });

    if (!response.ok) {
      log(`   SQL Record: ❌ NOT FOUND (status ${response.status})`);
      return {
        sqlVerified: false,
        attachmentsVerified: false,
        verificationTime: Math.round(performance.now() - startTime),
      };
    }

    const verifiedData = await response.json();
    sqlVerified = true;
    log(`   SQL Record: ✅ EXISTS in database`);

    // ─────────────────────────────────────────────────────────────────
    // COMPARE FIELDS (sent vs saved)
    // ─────────────────────────────────────────────────────────────────
    if (config.compareFields && originalData) {
      log(`🔍 Field comparison (sent vs saved):`);

      const comparisonResults: Array<{ field: string; sent: unknown; saved: unknown; match: boolean }> = [];

      for (const field of config.compareFields) {
        const originalValue = (originalData as Record<string, unknown>)[field];
        const verifiedValue = verifiedData[field];

        // Normalize for comparison (handle null/undefined/empty string)
        const normalizedOriginal = originalValue === undefined || originalValue === '' ? null : originalValue;
        const normalizedVerified = verifiedValue === undefined || verifiedValue === '' ? null : verifiedValue;

        // Additional normalization for datetime fields (handle format differences)
        const comparableOriginal = normalizeForComparison(normalizedOriginal);
        const comparableVerified = normalizeForComparison(normalizedVerified);
        const match = comparableOriginal === comparableVerified;

        comparisonResults.push({ field, sent: normalizedOriginal, saved: normalizedVerified, match });

        // Format values for logging
        const sentStr = normalizedOriginal === null ? 'null' : `"${String(normalizedOriginal).substring(0, 30)}${String(normalizedOriginal).length > 30 ? '...' : ''}"`;
        const savedStr = normalizedVerified === null ? 'null' : `"${String(normalizedVerified).substring(0, 30)}${String(normalizedVerified).length > 30 ? '...' : ''}"`;

        if (match) {
          log(`   [✅] ${field.padEnd(14)} ${sentStr}`);
        } else {
          log(`   [❌] ${field.padEnd(14)} sent: ${sentStr}`);
          log(`                        saved: ${savedStr}`);
        }
      }

      const matchCount = comparisonResults.filter(r => r.match).length;
      const totalCount = comparisonResults.length;
      const allMatch = matchCount === totalCount;

      fieldComparison = {
        results: comparisonResults,
        matchCount,
        totalCount,
        allMatch,
      };

      log(`   Field Result: ${allMatch ? '✅' : '⚠️'} ${matchCount}/${totalCount} fields match`);
    }

    // ─────────────────────────────────────────────────────────────────
    // VERIFY MINIO ATTACHMENTS (same as createIssueWorkflow)
    // ─────────────────────────────────────────────────────────────────
    log(`   Attachments in response: ${verifiedData.attachments?.length || 0}`);

    if (expectedAttachments > 0 && originalFiles) {
      log(`📎 Verifying MinIO attachments (expected: ${expectedAttachments})...`);

      // Build map of original file sizes for comparison
      const originalFileSizes = new Map<string, number>();
      for (const file of originalFiles) {
        originalFileSizes.set(file.name, file.size);
      }

      if (verifiedData.attachments && verifiedData.attachments.length > 0) {
        for (const att of verifiedData.attachments) {
          try {
            // Get attachment endpoint - construct from result endpoint
            const resultEndpoint = config.getEndpoint(result);
            const attResponse = await fetch(
              `${baseUrl}${resultEndpoint}/attachments/${att.file_name}`,
              { method: 'HEAD', signal: AbortSignal.timeout(3000) }
            );
            const available = attResponse.ok;

            // Use file_size from database (backend response), NOT Content-Length from HEAD
            const actualSize = att.file_size || undefined;
            const expectedSize = originalFileSizes.get(att.file_name);
            const sizeMatch = expectedSize !== undefined && actualSize !== undefined ? expectedSize === actualSize : undefined;

            attachmentResults.push({
              fileName: att.file_name,
              available,
              expectedSize,
              actualSize,
              sizeMatch,
            });

            // Format size for logging
            const formatSize = (bytes?: number) => bytes !== undefined ? `${(bytes / 1024).toFixed(1)} KB` : '?';

            if (available) {
              if (sizeMatch === true) {
                log(`   [✅] ${att.file_name} (${formatSize(actualSize)}) ✅ size match`);
              } else if (sizeMatch === false) {
                log(`   [⚠️] ${att.file_name} - size mismatch! DB: ${formatSize(actualSize)}, Sent: ${formatSize(expectedSize)}`);
              } else {
                log(`   [✅] ${att.file_name} (${formatSize(actualSize)}) - size check skipped`);
              }
            } else {
              log(`   [❌] ${att.file_name} - NOT FOUND in MinIO`);
            }
          } catch (err) {
            attachmentResults.push({ fileName: att.file_name, available: false });
            log(`   [❌] ${att.file_name} (error: ${err instanceof Error ? err.message : 'unknown'})`);
          }
        }

        // All files must be available AND sizes must match (if checkable)
        const allAvailable = attachmentResults.every(r => r.available);
        const allSizesMatch = attachmentResults.every(r => r.sizeMatch !== false); // undefined is OK
        attachmentsVerified = allAvailable && allSizesMatch;

        log(`   MinIO Result: ${attachmentsVerified ? '✅ ALL FILES VERIFIED' : '❌ VERIFICATION FAILED'}`);
        if (!allAvailable) log(`      - Some files not accessible`);
        if (!allSizesMatch) log(`      - Some file sizes don't match`);
      } else {
        log(`   ⚠️ WARNING: Expected ${expectedAttachments} attachments but API returned 0`);
        log(`   (Backend GET may not include attachments array)`);
        attachmentsVerified = false; // Can't verify - mark as failed
      }
    } else {
      log(`📎 MinIO: No attachments to verify (none uploaded)`);
    }

    const verificationTime = Math.round(performance.now() - startTime);
    log(`⏱️ Verification completed in ${verificationTime}ms`);

    // Check if verification succeeded
    const fieldsMatch = fieldComparison?.allMatch ?? true;
    const allVerified = sqlVerified && attachmentsVerified && fieldsMatch;

    if (allVerified) {
      log(`✅ Verification successful on attempt ${verificationAttempt}`);
      return {
        sqlVerified,
        attachmentsVerified,
        attachmentResults: attachmentResults.length > 0 ? attachmentResults : undefined,
        fieldComparison,
        verificationTime,
      };
    }

    // If last attempt, return failure
    if (verificationAttempt === maxRetries) {
      log(`❌ Verification failed after ${maxRetries} attempts`);
      return {
        sqlVerified,
        attachmentsVerified,
        attachmentResults: attachmentResults.length > 0 ? attachmentResults : undefined,
        fieldComparison,
        verificationTime,
      };
    }

    // Continue to next retry attempt
    verificationAttempt++;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Verification error';
    log(`   ❌ Verification error on attempt ${verificationAttempt}: ${errorMessage}`);

    // If last attempt, return failure
    if (verificationAttempt === maxRetries) {
      log(`❌ Verification failed after ${maxRetries} attempts`);
      return {
        sqlVerified: false,
        attachmentsVerified: false,
        verificationTime: Math.round(performance.now() - startTime),
      };
    }

    // Continue to next retry attempt
    verificationAttempt++;
  }
  } // End while loop

  // Should never reach here, but TypeScript needs a return
  return {
    sqlVerified: false,
    attachmentsVerified: false,
    verificationTime: Math.round(performance.now() - startTime),
  };
}

// ============================================================
// PRE-DELETE VERIFICATION (check attachments before delete)
// ============================================================

/**
 * Perform data integrity check before resource deletion.
 *
 * Checks:
 * 1. Files in DB but missing from MinIO (data loss)
 * 2. Files in MinIO but not in DB (orphaned files)
 *
 * Purpose:
 * - Detect data integrity issues before deletion
 * - Allow automatic issue creation for missing/orphaned files
 * - Prevent silent data loss
 *
 * @param baseUrl - Service base URL
 * @param config - Delete verification configuration
 * @param permissionLevel - Permission level header
 * @param onDataIntegrityIssue - Callback for data integrity issues
 * @returns Verification result with integrity status
 */
export async function performPreDeleteVerification(
  baseUrl: string,
  config: DeleteVerificationConfig,
  permissionLevel?: number,
  onDataIntegrityIssue?: (event: DataIntegrityEvent) => void
): Promise<PreDeleteVerificationResult> {
  log('🔍 Pre-delete verification: checking attachments...');

  const result: PreDeleteVerificationResult = {
    success: true,
    missingInMinio: [],
    orphanedInMinio: [],
    dbAttachments: 0,
    minioFiles: 0,
    hasIntegrityIssues: false,
  };

  try {
    const endpoint = config.getVerifyEndpoint(config.entityId);
    log(`   GET ${baseUrl}${endpoint}`);

    const headers: Record<string, string> = {};
    if (permissionLevel !== undefined) {
      headers['X-Permission-Level'] = String(permissionLevel);
    }

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      log(`   ⚠️ Verify endpoint failed (status ${response.status}) - proceeding without verification`);
      return result;
    }

    const verifyData = await response.json();

    result.dbAttachments = verifyData.db_attachments?.length || 0;
    result.minioFiles = verifyData.minio_files?.length || 0;
    result.missingInMinio = verifyData.missing_in_minio || [];
    result.orphanedInMinio = verifyData.orphaned_in_minio || [];

    log(`   DB attachments: ${result.dbAttachments}`);
    log(`   MinIO files: ${result.minioFiles}`);
    log(`   Missing in MinIO: ${result.missingInMinio.length}`);
    log(`   Orphaned in MinIO: ${result.orphanedInMinio.length}`);

    // Check for data integrity issues
    if (result.missingInMinio.length > 0) {
      result.hasIntegrityIssues = true;
      log(`   ⚠️ DATA INTEGRITY ISSUE: ${result.missingInMinio.length} files in DB but missing from MinIO`);

      // Create and report data integrity event
      if (onDataIntegrityIssue) {
        const event: DataIntegrityEvent = {
          event_type: 'data_integrity.missing_attachment',
          source_service: _callerName,
          source_entity: {
            type: config.entityType,
            id: config.entityId,
            code: config.entityCode,
          },
          detected_at: new Date().toISOString(),
          details: {
            missing_files: result.missingInMinio,
            expected_location: `minio/${config.entityType}s/${config.entityId}/`,
          },
          issue_data: {
            title: config.entityCode
              ? `Missing attachments in ${config.entityType} ${config.entityCode}`
              : `Missing attachments detected during delete`,
            description: `Found ${result.missingInMinio.length} file(s) in database but missing from MinIO storage.\n\n**Affected files:**\n${result.missingInMinio.map(f => `- ${f}`).join('\n')}`,
            type: 'BUG',
            severity: 'MODERATE',
            category: 'DATA_INTEGRITY',
            priority: 'MEDIUM',
          },
        };

        log('   📤 Reporting data integrity issue...');
        onDataIntegrityIssue(event);
      }
    }

    // Check for orphaned files (in MinIO but not in DB)
    if (result.orphanedInMinio.length > 0) {
      result.hasIntegrityIssues = true;
      log(`   ⚠️ DATA INTEGRITY ISSUE: ${result.orphanedInMinio.length} files in MinIO but not in DB`);

      // Create and report data integrity event for orphaned files
      if (onDataIntegrityIssue) {
        const event: DataIntegrityEvent = {
          event_type: 'data_integrity.orphaned_attachment',
          source_service: _callerName,
          source_entity: {
            type: config.entityType,
            id: config.entityId,
            code: config.entityCode,
          },
          detected_at: new Date().toISOString(),
          details: {
            orphaned_files: result.orphanedInMinio,
            expected_location: `minio/${config.entityType}s/${config.entityId}/`,
          },
          issue_data: {
            title: config.entityCode
              ? `Orphaned attachments in ${config.entityType} ${config.entityCode}`
              : `Orphaned attachments detected during delete`,
            description: `Found ${result.orphanedInMinio.length} file(s) in MinIO storage but not in database records.\n\n**Affected files:**\n${result.orphanedInMinio.map(f => `- ${f}`).join('\n')}`,
            type: 'BUG',
            severity: 'MINOR', // Less critical than missing files
            category: 'DATA_INTEGRITY',
            priority: 'LOW',
          },
        };

        log('   📤 Reporting data integrity issue (orphaned files)...');
        onDataIntegrityIssue(event);
      }
    }

    log(`   Status: ${verifyData.status}`);
    return result;

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    log(`   ⚠️ Verify failed: ${errorMsg} - proceeding without verification`);
    return result;
  }
}
