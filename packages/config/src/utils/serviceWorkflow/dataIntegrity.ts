/*
 * ================================================================
 * FILE: dataIntegrity.ts
 * PATH: /packages/config/src/utils/serviceWorkflow/dataIntegrity.ts
 * DESCRIPTION: Data integrity utilities for auto-creating Issues
 *              when data problems are detected by frontend.
 * VERSION: v1.0.0
 * CREATED: 2025-12-07
 * UPDATED: 2025-12-07
 * ================================================================
 */

import type { DataIntegrityEvent, DataIntegrityIssueType } from './types';
import { SYSTEM_USER_ID } from '../../constants/system-constants';
import { SERVICE_ENDPOINTS } from '../../constants/services';

// ============================================================
// CONFIGURATION
// ============================================================

/** Issues service base URL - automatically configured for Docker/localhost */
const ISSUES_SERVICE_URL = SERVICE_ENDPOINTS.issues.baseUrl;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Create a data integrity event from detected issue.
 *
 * @param issueType - Type of data integrity issue
 * @param sourceService - Name of the service that detected the issue
 * @param details - Issue-specific details
 * @param entity - Optional entity information
 * @returns DataIntegrityEvent ready to be reported
 */
export function createDataIntegrityEvent(
  issueType: DataIntegrityIssueType,
  sourceService: string,
  details: DataIntegrityEvent['details'],
  entity?: DataIntegrityEvent['source_entity']
): DataIntegrityEvent {
  const now = new Date().toISOString();

  // Generate title and description based on issue type
  let title: string;
  let description: string;

  switch (issueType) {
    case 'orphaned_attachment':
      title = entity?.code
        ? `Orphaned attachments in ${entity.type} ${entity.code}`
        : `Orphaned attachments detected`;
      description = `Found ${details.orphaned_files?.length || 0} file(s) in database but missing in MinIO storage.`;
      if (details.orphaned_files?.length) {
        description += `\n\n**Affected files:**\n${details.orphaned_files.map(f => `- ${f}`).join('\n')}`;
      }
      break;

    case 'missing_attachment':
      title = entity?.code
        ? `Missing files in ${entity.type} ${entity.code}`
        : `Missing files detected`;
      description = `Found ${details.missing_files?.length || 0} file(s) in MinIO but not in database.`;
      if (details.missing_files?.length) {
        description += `\n\n**Affected files:**\n${details.missing_files.map(f => `- ${f}`).join('\n')}`;
      }
      break;

    case 'verification_failed':
      title = entity?.code
        ? `Data verification failed for ${entity.type} ${entity.code}`
        : `Data verification failed`;
      description = `Field values don't match between sent and saved data.`;
      if (details.field_mismatches?.length) {
        description += `\n\n**Mismatched fields:**`;
        for (const mismatch of details.field_mismatches) {
          description += `\n- **${mismatch.field}**: sent "${mismatch.sent}" but saved "${mismatch.saved}"`;
        }
      }
      break;

    case 'storage_unavailable':
      title = `Storage unavailable during ${details.operation || 'operation'}`;
      description = `MinIO storage was unavailable. Operation: ${details.operation || 'unknown'}`;
      if (details.error_message) {
        description += `\n\n**Error:** ${details.error_message}`;
      }
      break;

    case 'cleanup_failed':
      title = entity?.code
        ? `Cleanup failed for ${entity.type} ${entity.code}`
        : `Cleanup operation failed`;
      description = `Failed to clean up files from storage.`;
      if (details.error_message) {
        description += `\n\n**Error:** ${details.error_message}`;
      }
      break;

    default:
      title = 'Data integrity issue detected';
      description = 'An unknown data integrity issue was detected.';
  }

  if (details.expected_location) {
    description += `\n\n**Expected location:** ${details.expected_location}`;
  }

  return {
    event_type: `data_integrity.${issueType}`,
    source_service: sourceService,
    source_entity: entity,
    detected_at: now,
    details,
    issue_data: {
      title,
      description,
      type: 'BUG',
      severity: 'MODERATE',
      category: 'DATA_INTEGRITY',
      priority: 'MEDIUM',
    },
  };
}

/**
 * Report a data integrity issue to the Issues service.
 * Creates an Issue automatically with SYSTEM_USER_ID as reporter.
 *
 * @param event - Data integrity event to report
 * @param issuesServiceUrl - Optional custom URL for Issues service
 * @returns Promise with created issue data or error
 */
export async function reportDataIntegrityIssue(
  event: DataIntegrityEvent,
  issuesServiceUrl: string = ISSUES_SERVICE_URL
): Promise<{ success: boolean; issueCode?: string; error?: string }> {
  try {
    // Build issue create payload
    const issueData = {
      title: event.issue_data?.title || `Data Integrity Issue - ${event.event_type}`,
      description: buildDescription(event),
      type: (event.issue_data?.type || 'BUG').toLowerCase(),
      severity: (event.issue_data?.severity || 'MODERATE').toLowerCase(),
      category: (event.issue_data?.category || 'DATA_INTEGRITY').toLowerCase(),
      priority: (event.issue_data?.priority || 'MEDIUM').toLowerCase(),
      // Set reporter to SYSTEM_USER for auto-generated issues
      // Must be in body (not just header) because backend currently ignores X-User-ID
      reporter_id: SYSTEM_USER_ID,
      // Additional metadata stored in system_info
      system_info: {
        auto_generated: true,
        event_type: event.event_type,
        source_service: event.source_service,
        source_entity: event.source_entity,
        details: event.details,
        detected_at: event.detected_at,
      },
    };

    // Call Issues service API - system endpoint (JSON body, no form data)
    // Uses /issues/system which requires X-Permission-Level: 100
    const response = await fetch(`${issuesServiceUrl}/issues/system`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Permission-Level': '100', // Super Admin level (required for /system endpoint)
      },
      body: JSON.stringify(issueData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      return {
        success: false,
        error: `Failed to create issue: ${errorData.detail || response.statusText}`,
      };
    }

    const createdIssue = await response.json();
    console.log(`[DataIntegrity] Auto-created issue ${createdIssue.issue_code} for ${event.event_type}`);

    return {
      success: true,
      issueCode: createdIssue.issue_code,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[DataIntegrity] Failed to report issue: ${errorMsg}`);
    return {
      success: false,
      error: errorMsg,
    };
  }
}

/**
 * Build full description from event data.
 */
function buildDescription(event: DataIntegrityEvent): string {
  let description = event.issue_data?.description || 'Auto-generated data integrity issue';

  description += '\n\n---\n';
  description += `**Source Service:** ${event.source_service}\n`;

  if (event.source_entity) {
    const entity = event.source_entity;
    description += `**Entity:** ${entity.type} (${entity.code || entity.id})\n`;
  }

  description += `**Detected:** ${event.detected_at}\n`;
  description += `**Event Type:** ${event.event_type}\n`;

  return description;
}

/**
 * Default handler for onDataIntegrityIssue callback.
 * Logs to console and reports to Issues service.
 *
 * Usage:
 * ```typescript
 * import { defaultDataIntegrityHandler } from '@l-kern/config';
 *
 * serviceWorkflow({
 *   ...config,
 *   callbacks: {
 *     onDataIntegrityIssue: defaultDataIntegrityHandler,
 *   },
 * });
 * ```
 */
export async function defaultDataIntegrityHandler(event: DataIntegrityEvent): Promise<void> {
  console.warn(`[DataIntegrity] Issue detected: ${event.event_type}`, event);

  // Report to Issues service (fire and forget - don't block workflow)
  reportDataIntegrityIssue(event).then(result => {
    if (result.success) {
      console.log(`[DataIntegrity] Created issue ${result.issueCode}`);
    } else {
      console.error(`[DataIntegrity] Failed to create issue: ${result.error}`);
    }
  });
}
