/*
 * ================================================================
 * FILE: index.ts
 * PATH: /packages/config/src/utils/index.ts
 * DESCRIPTION: Main export file for utility functions
 * VERSION: v2.0.0
 * UPDATED: 2025-10-19 15:00:00
 *
 * CHANGES:
 *   - v2.0.0: Migrated to folder structure (phoneUtils/, emailUtils/, etc.)
 * ================================================================
 */

// Phone utilities
export {
  cleanPhoneNumber,
  validateMobile,
  validateLandlineOrFax,
  formatPhoneNumber,
  detectPhoneType,
  getPhoneCountryCode,
  type PhoneType,
  type PhoneCountryCode,
} from './phoneUtils';

// Email utilities
export {
  validateEmail,
  normalizeEmail,
  getEmailDomain,
  getEmailLocal,
  isEmailFromDomain,
} from './emailUtils';

// Date utilities
export {
  formatDate,
  formatDateTime,
  formatDateTimeFull,
  parseDate,
  parseDateTime,
  validateDate,
  convertDateLocale,
  getToday,
  isToday,
  addDays,
  getDaysDifference,
  extractDateComponents,
  // UTC Timezone utilities
  toUTC,
  fromUTC,
  formatUserDateTime,
  getNowUTC,
  toUTCFromUserInput,
  type DateLocale,
  type DateComponents,
  type SupportedTimezone,
} from './dateUtils';

// Modal stack utility
export { modalStack } from './modalStack';

// Toast notification manager
export { toastManager, type Toast, type ToastOptions, type ToastType } from './toastManager';

// Validation utilities
export {
  debounce,
  validateField,
  type ValidationResult,
  type ValidationType,
} from './validation';

// Export utilities
export { exportToCSV, exportToJSON } from './exportUtils';

// Storage operations - universal validated CRUD with health checks
export {
  // Types
  type StorageType,
  type StorageConfig,
  type RetryConfig,
  type HealthStatus,
  type HealthCheckResult,
  type CombinedHealthResult,
  type OperationType,
  type OperationPhase,
  type OperationRequest,
  type StorageOperationResult,
  type OperationResult,
  type PendingOperation,
  type StorageOperationUIState,
  type OperationCallbacks,
  // Configs
  STORAGE_CONFIGS,
  // Health check
  checkStorageHealth,
  checkMultipleStoragesHealth,
  quickHealthCheck,
  quickCheckMultiple,
  checkSQLHealth,
  checkMinIOHealth,
  checkElasticSearchHealth,
  getStorageDisplayName,
  getStorageDisplayNames,
  // Operations
  sqlCreate,
  sqlDelete,
  sqlUpdate,
  minioUpload,
  minioDelete,
  minioExists,
  executeOperation,
  executeBatchOperations,
} from './storageOperations';

// Service retry utility - universal retry with callbacks for UI feedback
export {
  executeWithRetry,
  createFetchServiceCall,
  pingWithRetry,
  type ServiceCallResult,
  type RetryCallbacks,
  type RetryConfig as ServiceRetryConfig,
  type RetryResult,
} from './serviceRetry';
