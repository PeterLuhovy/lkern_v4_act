/*
 * ================================================================
 * FILE: index.ts
 * PATH: /packages/config/src/utils/storageOperations/index.ts
 * DESCRIPTION: Export all storage operation utilities
 * VERSION: v1.0.0
 * CREATED: 2025-11-30
 * UPDATED: 2025-11-30
 * ================================================================
 */

// Types
export type {
  StorageType,
  StorageConfig,
  RetryConfig,
  HealthStatus,
  HealthCheckResult,
  CombinedHealthResult,
  OperationType,
  OperationPhase,
  OperationRequest,
  StorageOperationResult,
  OperationResult,
  PendingOperation,
  StorageOperationUIState,
  OperationCallbacks,
  ExtractEntity,
  PartialUpdate,
  VerifiableFields,
} from './types';

// Storage configurations
export { STORAGE_CONFIGS } from './types';

// Health check utilities
export {
  checkStorageHealth,
  checkMultipleStoragesHealth,
  quickHealthCheck,
  quickCheckMultiple,
  checkSQLHealth,
  checkMinIOHealth,
  checkElasticSearchHealth,
  getStorageDisplayName,
  getStorageDisplayNames,
} from './healthCheck';

// Operations
export {
  sqlCreate,
  sqlDelete,
  sqlUpdate,
  minioUpload,
  minioDelete,
  minioExists,
  executeOperation,
  executeBatchOperations,
} from './operations';
