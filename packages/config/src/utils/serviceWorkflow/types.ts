/*
 * ================================================================
 * FILE: types.ts
 * PATH: /packages/config/src/utils/serviceWorkflow/types.ts
 * DESCRIPTION: TypeScript types for universal service workflow.
 * VERSION: v2.0.0
 * CREATED: 2025-12-03
 * UPDATED: 2025-12-10
 * CHANGELOG:
 *   v2.0.0 - Added cache system, optimistic updates, verification retry
 *   v1.1.0 - Added DataIntegrityEvent type and onDataIntegrityIssue callback
 * ================================================================
 */

// ============================================================
// ERROR CODES
// ============================================================

/**
 * Standard error codes returned by serviceWorkflow
 */
export type ServiceWorkflowErrorCode =
  | 'SERVICE_DOWN'
  | 'SQL_DOWN'
  | 'MINIO_UNAVAILABLE'
  | 'MINIO_UNAVAILABLE_WITH_FILES'
  | 'NOT_FOUND'
  | 'PERMISSION_DENIED'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'API_ERROR'
  | 'NETWORK_ERROR'
  | 'VERIFICATION_FAILED';

// ============================================================
// DATA INTEGRITY EVENTS (for auto-issue creation)
// ============================================================

/**
 * Type of data integrity issue detected
 */
export type DataIntegrityIssueType =
  | 'orphaned_attachment'      // File in MinIO but not in DB
  | 'missing_attachment'       // Record in DB but file missing from MinIO
  | 'verification_failed'      // Field mismatch between sent and saved
  | 'storage_unavailable'      // MinIO unavailable during operation
  | 'cleanup_failed';          // Cleanup operation failed

/**
 * Data integrity event - structure matches Kafka event schema
 * Can be used both for frontend reporting and backend Kafka events.
 */
export interface DataIntegrityEvent {
  /** Full event type (e.g., "data_integrity.orphaned_attachment") */
  event_type: `data_integrity.${DataIntegrityIssueType}`;

  /** Service that detected the issue */
  source_service: string;

  /** Entity affected (optional) */
  source_entity?: {
    type: string;           // e.g., "issue", "contact"
    id: string;             // UUID of the entity
    code?: string;          // Human-readable code (e.g., "ISS-001")
  };

  /** When the issue was detected */
  detected_at: string;       // ISO 8601 timestamp

  /** Additional details specific to issue type */
  details: {
    /** For orphaned/missing attachments */
    orphaned_files?: string[];
    missing_files?: string[];
    expected_location?: string;

    /** For verification failures */
    field_mismatches?: Array<{
      field: string;
      sent: unknown;
      saved: unknown;
    }>;

    /** For storage issues */
    operation?: string;
    error_message?: string;
  };

  /** Pre-filled issue data (optional) */
  issue_data?: {
    title: string;
    description: string;
    type?: 'BUG' | 'FEATURE' | 'IMPROVEMENT' | 'QUESTION';
    severity?: 'MINOR' | 'MODERATE' | 'MAJOR' | 'BLOCKER';
    category?: 'DATA_INTEGRITY' | 'UI' | 'API' | 'BUSINESS_LOGIC' | 'SECURITY' | 'PERFORMANCE';
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  };
}

// ============================================================
// WORKFLOW RESULT
// ============================================================

export interface ServiceWorkflowResult<TResult = unknown> {
  success: boolean;
  data?: TResult;
  error?: string;
  errorCode?: ServiceWorkflowErrorCode;
  statusCode?: number;
  filesUploaded?: boolean;
  verified?: boolean;
  totalTime?: number;
  attempts?: number;
  /** Raw response data (useful for error handling like 409 conflicts) */
  rawResponse?: unknown;
}

// ============================================================
// MESSAGES CONFIGURATION
// ============================================================

export interface ServiceWorkflowMessages {
  generic?: string;
  serviceDown?: string;
  sqlDown?: string;
  minioDown?: string;
  notFound?: string;
  permissionDenied?: string;
  validation?: string;
  takingLonger?: string;
  retrying?: string;
  success?: string;
}

// ============================================================
// CALLBACKS
// ============================================================

// ============================================================
// DOWNLOAD PROGRESS
// ============================================================

/**
 * Download progress event data for tracking large file downloads.
 */
export interface DownloadProgress {
  /** Phase of the download */
  phase: 'healthCheck' | 'downloading' | 'processing' | 'complete';
  /** Total bytes expected (from Content-Length header, 0 if unknown) */
  totalBytes: number;
  /** Bytes downloaded so far */
  downloadedBytes: number;
  /** Percentage complete (0-100) */
  percentage: number;
  /** Whether the total size is known */
  totalKnown: boolean;
}

export interface ServiceWorkflowCallbacks {
  onServiceAlive?: () => void;
  onServiceDown?: () => void;
  onTakingLonger?: () => void;
  /** Called when first attempt fails quickly - "Connection failed" toast */
  onQuickFailure?: () => void;
  onHealthRetry?: (attempt: number, maxAttempts: number) => void;
  onSuccess?: <TResult>(result: TResult) => void;
  onError?: (error: string, errorCode: ServiceWorkflowErrorCode) => void;
  /**
   * Called periodically during download to report progress.
   * Use for showing progress bars on large file downloads.
   * @param progress - Current download progress
   */
  onProgress?: (progress: DownloadProgress) => void;
  /**
   * Called when a data integrity issue is detected.
   * Can be used to auto-create Issues or log the problem.
   * @param event - Data integrity event with all details
   */
  onDataIntegrityIssue?: (event: DataIntegrityEvent) => void;
  /**
   * Called BEFORE API call for optimistic UI updates.
   * Returns rollback function that will be called if API call fails.
   * @param data - Data being sent to API
   * @returns Rollback function to restore previous state
   */
  onOptimisticUpdate?: <TData>(data: TData) => (() => void) | void;
  /**
   * Called when verification is being retried.
   * @param attempt - Current retry attempt (1-based)
   * @param maxAttempts - Maximum number of retry attempts
   */
  onVerificationRetry?: (attempt: number, maxAttempts: number) => void;
}

// ============================================================
// HEALTH CHECK CONFIGURATION
// ============================================================

export interface HealthCheckConfig {
  ping?: boolean;
  sql?: boolean;
  minio?: boolean;
  cache?: boolean;
  cacheTTL?: number;
  endpoints?: {
    ping?: string;
    health?: string;
  };
}

// ============================================================
// CACHE CONFIGURATION
// ============================================================

export interface CacheConfig {
  /** Enable response caching (default: false) */
  enabled?: boolean;
  /** Cache TTL in milliseconds (default: 300000 = 5 minutes) */
  ttl?: number;
  /** Custom cache key (default: auto-generated from endpoint + method + data) */
  cacheKey?: string;
  /** Skip cache for this request even if globally enabled */
  skipCache?: boolean;
}

// ============================================================
// VERIFICATION CONFIGURATION
// ============================================================

export interface VerificationConfig<TResult = unknown> {
  enabled: boolean;
  getEndpoint: (result: TResult) => string;
  compareFields?: string[];
  timeout?: number;
  /** Maximum retry attempts if verification fails (default: 3) */
  maxRetries?: number;
  /** Delay between retry attempts in ms (default: 2000 = 2s) */
  retryDelay?: number;
}

// ============================================================
// DELETE VERIFICATION CONFIGURATION
// ============================================================

export interface DeleteVerificationConfig {
  /** Enable pre-delete verification (check attachments before delete) */
  enabled: boolean;
  /**
   * Endpoint to get verify data (returns { missing_in_minio, orphaned_in_minio })
   * Example: (id) => `/issues/${id}/verify`
   */
  getVerifyEndpoint: (entityId: string) => string;
  /** Entity type for data integrity events (e.g., "issue", "contact") */
  entityType: string;
  /** Entity code for data integrity events (e.g., "ISS-001") */
  entityCode?: string;
  /** Entity ID (UUID) */
  entityId: string;
}

// ============================================================
// MAIN WORKFLOW CONFIGURATION
// ============================================================

export interface ServiceWorkflowConfig<TData = unknown, TResult = unknown> {
  baseUrl: string;
  endpoint: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET';
  data?: TData;
  files?: File[];
  headers?: Record<string, string>;
  permissionLevel?: number;
  /** Name of the FormData field for data (default: 'data') */
  formDataRole?: string;
  /** Additional FormData fields to include (e.g., { role: 'developer' }) */
  formDataFields?: Record<string, string>;
  healthChecks?: HealthCheckConfig;
  messages?: ServiceWorkflowMessages;
  callbacks?: ServiceWorkflowCallbacks;
  verification?: VerificationConfig<TResult>;
  /** Pre-delete verification config (for DELETE operations only) */
  deleteVerification?: DeleteVerificationConfig;
  /** Cache configuration (for GET requests, optional for POST/PUT/PATCH) */
  cache?: CacheConfig;
  /** Enable optimistic updates (call onOptimisticUpdate before API call) */
  optimisticUpdates?: boolean;
  debug?: boolean;
  caller?: string;
  skipRetry?: boolean;
  maxRetries?: number;
  attemptTimeout?: number;
  /** Enable automatic toast notifications (default: false) */
  showToasts?: boolean;
  /** Language for toast messages (default: 'sk') */
  language?: 'sk' | 'en';
  /** Response type to parse (default: 'json') */
  responseType?: 'json' | 'blob' | 'text';
}

// ============================================================
// DOMAIN-SPECIFIC TYPES (migrated from legacy workflows)
// ============================================================

/**
 * Response type for newly created Issue.
 * Used by IssueCreateHandler after successful POST to /issues/
 */
export interface CreatedIssue {
  id: string;
  issue_code: string;
  title: string;
  attachments?: Array<{
    file_name: string;
    file_path: string;
    file_size: number;
    content_type: string;
  }>;
}
