/*
 * ================================================================
 * FILE: api-config.ts
 * PATH: packages/config/src/constants/api-config.ts
 * DESCRIPTION: API configuration for L-KERN v4 ERP system
 * VERSION: v1.0.0
 * UPDATED: 2025-10-13
 * ================================================================
 */

/**
 * API ENDPOINTS
 * Centralized API endpoint configuration for all microservices
 */
export const API_ENDPOINTS = {
  // Business Microservices (LKMS 100-199)
  CONTACTS: '/api/v1/contacts',             // lkms101-contacts
  ORDERS: '/api/v1/orders',                 // lkms102-orders
  PARTS: '/api/v1/parts',                   // lkms103-parts (planned)
  PACKING: '/api/v1/packing',               // lkms104-packing (planned)
  DELIVERY: '/api/v1/delivery',             // lkms105-delivery (planned)
  INVOICES: '/api/v1/invoices',             // lkms106-invoices (planned)

  // Search endpoints
  SEARCH: {
    CUSTOMERS: '/api/v1/customers/search',
    PARTS: '/api/v1/parts/search',
    ORDERS: '/api/v1/orders/search',
  },

  // Health check endpoints
  HEALTH: {
    SYSTEM: '/health',
    SERVICES: '/health/services',
    DATABASE: '/health/db',
  },
} as const;

/**
 * TIMEOUTS
 * Timeout configurations in milliseconds
 */
export const TIMEOUTS = {
  // HTTP Request timeouts
  DEFAULT_REQUEST: 5000,        // 5s - standard API calls
  LONG_REQUEST: 15000,          // 15s - complex operations (reports, exports)
  QUICK_REQUEST: 2000,          // 2s - fast operations (search, validation)

  // UI interaction timeouts
  NOTIFICATION_AUTO: 3000,      // 3s - auto-close for notifications
  MODAL_TRANSITION: 300,        // 300ms - modal animation duration
  DEBOUNCE_SEARCH: 300,         // 300ms - search input debounce
  DEBOUNCE_SAVE: 1000,          // 1s - auto-save debounce

  // Health check intervals
  HEALTH_CHECK_INTERVAL: 30000, // 30s - health check polling
  RETRY_DELAY: 1000,            // 1s - delay between retry attempts
  MAX_RETRY_ATTEMPTS: 3,        // Maximum retry attempts
} as const;

/**
 * HTTP CONFIGURATION
 * HTTP client configuration for API calls
 */
export const HTTP_CONFIG = {
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },

  // Response types
  RESPONSE_TYPES: {
    JSON: 'json',
    BLOB: 'blob',           // File downloads
    TEXT: 'text',           // Plain text responses
    STREAM: 'stream',       // Large data streaming
  },

  // HTTP Status codes
  STATUS_CODES: {
    SUCCESS: {
      OK: 200,
      CREATED: 201,
      NO_CONTENT: 204,
    },
    CLIENT_ERROR: {
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      CONFLICT: 409,
      VALIDATION_ERROR: 422,
    },
    SERVER_ERROR: {
      INTERNAL_ERROR: 500,
      BAD_GATEWAY: 502,
      SERVICE_UNAVAILABLE: 503,
      GATEWAY_TIMEOUT: 504,
    },
  },
} as const;

/**
 * BASE URLS
 * Environment-specific base URLs
 */
export const BASE_URLS = {
  // Development environment
  DEVELOPMENT: {
    WEB_UI: 'http://localhost:4201',
    CONTACTS_API: 'http://localhost:4101',
    ORDERS_API: 'http://localhost:4102',
  },

  // Production environment
  PRODUCTION: {
    WEB_UI: typeof import.meta !== 'undefined' && import.meta.env?.VITE_WEB_URL || 'http://localhost:4201',
    API_GATEWAY: typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL || 'http://localhost:4100',
    CDN: typeof import.meta !== 'undefined' && import.meta.env?.VITE_CDN_URL || '',
  },
} as const;

/**
 * PAGINATION
 * Pagination configuration
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 25,        // Default items per page
  MAX_PAGE_SIZE: 100,           // Maximum items per page
  LARGE_DATASET_SIZE: 50,       // For large datasets (orders, contacts)
  SMALL_DATASET_SIZE: 10,       // For small datasets (search results)

  // Page size options for UI dropdown
  SIZE_OPTIONS: [10, 25, 50, 100] as const,
} as const;

/**
 * FILE UPLOAD LIMITS
 * File upload constraints
 */
export const FILE_LIMITS = {
  // Size limits in bytes
  MAX_FILE_SIZE: 10 * 1024 * 1024,      // 10MB for general files
  MAX_IMAGE_SIZE: 5 * 1024 * 1024,      // 5MB for images
  MAX_DOCUMENT_SIZE: 25 * 1024 * 1024,  // 25MB for documents (PDF, DOC)

  // Allowed file types
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const,
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'text/plain'] as const,

  // File extensions
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.txt'] as const,
} as const;