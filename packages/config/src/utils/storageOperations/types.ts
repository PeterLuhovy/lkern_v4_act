/*
 * ================================================================
 * FILE: types.ts
 * PATH: /packages/config/src/utils/storageOperations/types.ts
 * DESCRIPTION: TypeScript interfaces for universal storage operations
 *              Supports: SQL, MinIO, ElasticSearch - single or combined
 * VERSION: v1.0.0
 * CREATED: 2025-11-30
 * UPDATED: 2025-11-30
 * ================================================================
 */

// ============================================================
// STORAGE TYPES
// ============================================================

/**
 * Supported storage types
 */
export type StorageType = 'sql' | 'minio' | 'elasticsearch';

/**
 * Retry configuration for health checks and operations
 */
export interface RetryConfig {
  /** Maximum total time to spend retrying in ms (default: 15000) */
  maxTotalTime?: number;
  /** Initial delay between retries in ms (default: 1000) */
  initialDelay?: number;
  /** Maximum delay between retries in ms (default: 4000) */
  maxDelay?: number;
  /** Multiplier for exponential backoff (default: 2) */
  backoffMultiplier?: number;
  /** Delay in ms after which to show "taking longer" toast (default: 5000) */
  slowThreshold?: number;
  /** Callback when operation is taking longer than usual */
  onSlowOperation?: () => void;
  /** Callback on each retry attempt */
  onRetry?: (attempt: number, delay: number) => void;
}

/**
 * Storage configuration
 */
export interface StorageConfig {
  /** Storage type identifier */
  type: StorageType;
  /** Base URL of the storage service */
  baseUrl: string;
  /** Health check endpoint (e.g., '/health', '/minio/health/live') */
  healthEndpoint: string;
  /** Timeout for single health check attempt in ms (default: 3000) */
  healthTimeout?: number;
  /** Timeout for operations in ms (default: 30000) */
  operationTimeout?: number;
  /** Display name for UI messages */
  displayName?: string;
  /** Retry configuration for this storage */
  retryConfig?: RetryConfig;
}

// ============================================================
// HEALTH CHECK TYPES
// ============================================================

/**
 * Health check status for a single storage
 */
export type HealthStatus = 'checking' | 'healthy' | 'unhealthy' | 'error';

/**
 * Result of a single storage health check
 */
export interface HealthCheckResult {
  storage: StorageType;
  status: HealthStatus;
  responseTime?: number;
  error?: string;
  statusCode?: number;
  /** Number of retry attempts made */
  retryAttempts?: number;
  /** Did operation trigger "slow" threshold */
  wasSlow?: boolean;
}

/**
 * Combined health check result for multiple storages
 */
export interface CombinedHealthResult {
  /** Overall health - true only if all required storages are healthy */
  allHealthy: boolean;
  /** Individual results per storage */
  results: Map<StorageType, HealthCheckResult>;
  /** List of unhealthy storages */
  unhealthyStorages: StorageType[];
  /** Total check duration in ms */
  totalDuration: number;
}

// ============================================================
// OPERATION TYPES
// ============================================================

/**
 * Operation type
 */
export type OperationType = 'create' | 'read' | 'update' | 'delete';

/**
 * Operation phase for detailed tracking
 */
export type OperationPhase =
  | 'idle'
  | 'health_check'
  | 'executing'
  | 'verifying'
  | 'success'
  | 'failed'
  | 'unavailable'
  | 'not_found'
  | 'verification_failed';

/**
 * Generic operation request
 */
export interface OperationRequest<T = unknown> {
  /** Type of operation */
  type: OperationType;
  /** Target storage(s) - can be single or multiple */
  storages: StorageConfig[];
  /** Endpoint path for the operation (e.g., '/issues/123') */
  endpoint: string;
  /** Data for create/update operations */
  data?: T;
  /** Fields to verify after create/update (key-value pairs) */
  verifyFields?: Record<string, unknown>;
  /** Skip health check (not recommended) */
  skipHealthCheck?: boolean;
  /** Allow partial success when using multiple storages */
  allowPartialSuccess?: boolean;
  /** Force operation even if primary storage unavailable (mark for later) */
  forceWithPending?: boolean;
}

/**
 * Operation result for a single storage
 */
export interface StorageOperationResult<T = unknown> {
  storage: StorageType;
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
  /** Verification result (for create/update) */
  verified?: boolean;
  /** Fields that failed verification */
  verificationErrors?: Array<{
    field: string;
    expected: unknown;
    actual: unknown;
  }>;
}

/**
 * Combined operation result
 */
export interface OperationResult<T = unknown> {
  /** Overall success - depends on allowPartialSuccess */
  success: boolean;
  /** Operation phase at completion */
  phase: OperationPhase;
  /** Individual results per storage */
  results: Map<StorageType, StorageOperationResult<T>>;
  /** List of failed storages */
  failedStorages: StorageType[];
  /** Was operation marked for pending (cleanup later) */
  markedForPending: boolean;
  /** Primary data (from first successful storage) */
  data?: T;
  /** Error message if failed */
  error?: string;
  /** Total operation duration in ms */
  duration: number;
}

// ============================================================
// PENDING OPERATION TYPES (for cleanup service)
// ============================================================

/**
 * Pending operation record (stored in database for cleanup service)
 */
export interface PendingOperation {
  id: string;
  /** Type of operation that was attempted */
  operationType: OperationType;
  /** Target storage that was unavailable */
  targetStorage: StorageType;
  /** Service that owns this record (e.g., 'issues', 'contacts') */
  service: string;
  /** Entity ID being operated on */
  entityId: string;
  /** Entity code for display (e.g., 'ISSUE-001') */
  entityCode?: string;
  /** Operation payload (data needed to complete operation) */
  payload: Record<string, unknown>;
  /** Number of retry attempts */
  retryCount: number;
  /** Maximum retry attempts before giving up */
  maxRetries: number;
  /** Created timestamp */
  createdAt: string;
  /** Last retry timestamp */
  lastRetryAt?: string;
  /** Status: pending, in_progress, completed, failed */
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  /** Error from last attempt */
  lastError?: string;
}

// ============================================================
// UI STATE TYPES (for useStorageOperation hook)
// ============================================================

/**
 * UI state for storage operations
 */
export interface StorageOperationUIState {
  /** Current phase of operation */
  phase: OperationPhase;
  /** Is operation in progress */
  isLoading: boolean;
  /** Show unavailable modal */
  showUnavailableModal: boolean;
  /** Unavailable storages for modal */
  unavailableStorages: StorageType[];
  /** Show confirmation modal */
  showConfirmModal: boolean;
  /** Confirmation type (e.g., 'delete', 'force_delete') */
  confirmationType?: 'standard' | 'force' | 'mark_for_pending';
  /** Progress percentage (0-100) */
  progress: number;
  /** Current status message for UI */
  statusMessage: string;
  /** Error message if any */
  error: string | null;
  /** Last operation result */
  lastResult: OperationResult | null;
}

// ============================================================
// CALLBACK TYPES
// ============================================================

/**
 * Callbacks for operation lifecycle
 */
export interface OperationCallbacks<T = unknown> {
  /** Called before health check starts */
  onHealthCheckStart?: () => void;
  /** Called after health check completes */
  onHealthCheckComplete?: (result: CombinedHealthResult) => void;
  /** Called before operation starts */
  onOperationStart?: () => void;
  /** Called on operation progress (batch operations) */
  onProgress?: (current: number, total: number) => void;
  /** Called on operation success */
  onSuccess?: (result: OperationResult<T>) => void;
  /** Called on operation failure */
  onError?: (error: string, result?: OperationResult<T>) => void;
  /** Called when storage is unavailable */
  onUnavailable?: (storages: StorageType[]) => void;
  /** Called when entity not found (already deleted) */
  onNotFound?: (entityId: string) => void;
  /** Called when verification fails */
  onVerificationFailed?: (errors: StorageOperationResult['verificationErrors']) => void;
  /** Called when operation is marked for pending */
  onMarkedForPending?: (pendingId: string) => void;
}

// ============================================================
// CONFIGURATION PRESETS
// ============================================================

/**
 * Pre-defined storage configurations for L-KERN services
 */
export const STORAGE_CONFIGS = {
  /** Issues service SQL database */
  issuesSQL: {
    type: 'sql' as StorageType,
    baseUrl: 'http://localhost:8105',
    healthEndpoint: '/health',
    displayName: 'Issues Database',
  },
  /** Contacts service SQL database */
  contactsSQL: {
    type: 'sql' as StorageType,
    baseUrl: 'http://localhost:8101',
    healthEndpoint: '/health',
    displayName: 'Contacts Database',
  },
  /** MinIO object storage */
  minio: {
    type: 'minio' as StorageType,
    baseUrl: 'http://localhost:9000',
    healthEndpoint: '/minio/health/live',
    displayName: 'File Storage (MinIO)',
  },
  /** ElasticSearch (future) */
  elasticsearch: {
    type: 'elasticsearch' as StorageType,
    baseUrl: 'http://localhost:9200',
    healthEndpoint: '/_cluster/health',
    displayName: 'Search Engine',
  },
} as const;

// ============================================================
// UTILITY TYPES
// ============================================================

/**
 * Extract entity type from API response
 */
export type ExtractEntity<T> = T extends { data: infer U } ? U : T;

/**
 * Make all properties optional for partial update
 */
export type PartialUpdate<T> = Partial<T>;

/**
 * Fields to always verify after create/update
 */
export type VerifiableFields<T> = {
  [K in keyof T]?: boolean;
};
