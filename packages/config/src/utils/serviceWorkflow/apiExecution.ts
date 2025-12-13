/*
 * ================================================================
 * FILE: apiExecution.ts
 * PATH: /packages/config/src/utils/serviceWorkflow/apiExecution.ts
 * DESCRIPTION: API execution logic for HTTP requests with
 *              FormData, file uploads, and error parsing.
 * VERSION: v1.0.0
 * CREATED: 2025-12-10
 * UPDATED: 2025-12-10
 * ================================================================
 */

import type { ServiceWorkflowErrorCode, DownloadProgress } from './types';

// ============================================================
// SECURITY - XSS Prevention
// ============================================================

/**
 * Sanitize error messages to prevent XSS attacks.
 *
 * Escapes HTML entities that could be used for script injection:
 * - `<` → `&lt;`
 * - `>` → `&gt;`
 * - `&` → `&amp;`
 * - `"` → `&quot;`
 * - `'` → `&#x27;`
 *
 * @param message - Raw error message (potentially unsafe)
 * @returns Sanitized message safe for display in HTML
 *
 * @example
 * ```typescript
 * const userInput = "<script>alert('xss')</script>";
 * const safe = sanitizeErrorMessage(userInput);
 * // Returns: "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;"
 * ```
 */
function sanitizeErrorMessage(message: string): string {
  return message
    .replace(/&/g, '&amp;')   // Must be first to avoid double-escaping
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// ============================================================
// LOGGING ADAPTER (temporary - will be replaced with WorkflowContext)
// ============================================================

// TODO: Replace with WorkflowContext parameter after full refactor
let _debugEnabled = false;
let _log: (message: string, data?: unknown) => void = () => { /* noop */ };

/**
 * Configure logging for API execution module.
 *
 * INTERNAL USE ONLY - Called by serviceWorkflow to set up logging.
 * Will be removed when WorkflowContext migration is complete.
 *
 * @param debugEnabled - Enable debug logging
 * @param logFn - Logging function from WorkflowContext
 * @internal
 */
export function setApiExecutionLogger(
  debugEnabled: boolean,
  logFn: (message: string, data?: unknown) => void
): void {
  _debugEnabled = debugEnabled;
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
 * Result of an API call execution.
 *
 * @template T - Type of successful response data
 */
export interface ApiResult<T> {
  /** Whether the API call was successful */
  success: boolean;
  /** Response data (only if success=true) */
  data?: T;
  /** Error message (only if success=false) */
  error?: string;
  /** Standardized error code for frontend handling */
  errorCode?: ServiceWorkflowErrorCode;
  /** HTTP status code from response */
  httpStatus?: number;
  /** Raw response data (for debugging) */
  rawResponse?: unknown;
}

// ============================================================
// API EXECUTION
// ============================================================

/**
 * Execute an HTTP API call with automatic FormData handling and error parsing.
 *
 * Features:
 * - HTTP method support: GET, DELETE, POST, PUT, PATCH
 * - Automatic FormData for file uploads
 * - JSON body for non-file requests
 * - Permission level header support
 * - Response type handling: json, blob, text
 * - Standardized error code mapping
 * - Request cancellation via AbortSignal
 *
 * Error Code Mapping:
 * - 409 Conflict → CONFLICT (resource locked)
 * - 503 MinIO unavailable → MINIO_UNAVAILABLE_WITH_FILES
 * - 5xx Server errors → API_ERROR
 * - 4xx Client errors → VALIDATION_ERROR
 * - Network errors → NETWORK_ERROR
 *
 * @template TData - Type of request data
 * @template TResult - Type of response data
 * @param baseUrl - Service base URL (e.g., "http://localhost:8000")
 * @param endpoint - API endpoint path (e.g., "/api/contacts")
 * @param method - HTTP method (GET, POST, PUT, PATCH, DELETE)
 * @param data - Request data (JSON body or FormData role)
 * @param files - Files to upload (triggers FormData mode)
 * @param headers - Additional HTTP headers
 * @param permissionLevel - Permission level header (X-Permission-Level)
 * @param formDataRole - FormData key for JSON data (default: "data")
 * @param formDataFields - Additional FormData fields
 * @param skipFiles - Skip file attachment (for batch operations)
 * @param responseType - Expected response type (default: "json")
 * @param signal - Optional AbortSignal for request cancellation
 * @returns API result with success status, data, and error info
 */
export async function executeApiCall<TData, TResult>(
  baseUrl: string,
  endpoint: string,
  method: string,
  data?: TData,
  files?: File[],
  headers?: Record<string, string>,
  permissionLevel?: number,
  formDataRole?: string,
  formDataFields?: Record<string, string>,
  skipFiles?: boolean,
  responseType: 'json' | 'blob' | 'text' = 'json',
  signal?: AbortSignal,
  onProgress?: (progress: DownloadProgress) => void
): Promise<ApiResult<TResult>> {
  const hasFiles = !skipFiles && files && files.length > 0;
  const useFormData = hasFiles || (method === 'POST' && formDataFields);

  try {
    log(`${method} ${baseUrl}${endpoint}`);

    const requestHeaders: Record<string, string> = { ...headers };
    if (permissionLevel !== undefined) {
      requestHeaders['X-Permission-Level'] = String(permissionLevel);
    }

    // Build request body based on method
    let body: BodyInit | undefined;

    if (method === 'GET' || method === 'DELETE') {
      // GET and DELETE don't have body
      body = undefined;
    } else if (useFormData) {
      // POST/PUT/PATCH with files or FormData fields
      const formData = new FormData();
      if (data) {
        formData.append(formDataRole ?? 'data', JSON.stringify(data));
      }
      if (formDataFields) {
        for (const [key, value] of Object.entries(formDataFields)) {
          formData.append(key, value);
        }
      }
      if (hasFiles && files) {
        for (const file of files) {
          formData.append('files', file);
          log(`   Added file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
        }
      }
      body = formData;
      // Don't set Content-Type - let browser set multipart/form-data with boundary
    } else if (data) {
      // JSON body for PUT/PATCH/POST without files
      requestHeaders['Content-Type'] = 'application/json';
      body = JSON.stringify(data);
    }

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers: requestHeaders,
      body,
      signal,
    });

    // Handle 204 No Content (common for DELETE)
    if (response.status === 204) {
      log('Response: 204 No Content');
      return {
        success: true,
        data: undefined,
        httpStatus: 204,
      };
    }

    // Parse response based on responseType
    let responseData: unknown;
    try {
      if (responseType === 'blob') {
        // Use ReadableStream for progress tracking if onProgress callback provided
        if (onProgress && response.body) {
          const contentLength = response.headers.get('Content-Length');
          const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;
          const totalKnown = totalBytes > 0;

          // Report initial progress
          onProgress({
            phase: 'downloading',
            totalBytes,
            downloadedBytes: 0,
            percentage: 0,
            totalKnown,
          });

          // Read response body with progress tracking
          const reader = response.body.getReader();
          const chunks: Uint8Array[] = [];
          let downloadedBytes = 0;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            chunks.push(value);
            downloadedBytes += value.length;

            // Calculate percentage (0-100)
            const percentage = totalKnown
              ? Math.round((downloadedBytes / totalBytes) * 100)
              : 0;

            // Report progress
            onProgress({
              phase: 'downloading',
              totalBytes,
              downloadedBytes,
              percentage,
              totalKnown,
            });
          }

          // Combine chunks into single blob
          onProgress({
            phase: 'processing',
            totalBytes: downloadedBytes,
            downloadedBytes,
            percentage: 100,
            totalKnown: true,
          });

          // Concatenate all chunks into single Uint8Array
          const combined = new Uint8Array(downloadedBytes);
          let offset = 0;
          for (const chunk of chunks) {
            combined.set(chunk, offset);
            offset += chunk.length;
          }
          const blob = new Blob([combined]);
          responseData = blob;

          // Report complete
          onProgress({
            phase: 'complete',
            totalBytes: blob.size,
            downloadedBytes: blob.size,
            percentage: 100,
            totalKnown: true,
          });

          log(`Response: ${response.status} (blob with progress, ${blob.size} bytes)`);
        } else {
          // No progress tracking - simple blob
          responseData = await response.blob();
          log(`Response: ${response.status} (blob, ${(responseData as Blob).size} bytes)`);
        }
      } else if (responseType === 'text') {
        responseData = await response.text();
        log(`Response: ${response.status} (text, ${(responseData as string).length} chars)`);
      } else {
        // Default: json
        responseData = await response.json();
        log(`Response: ${response.status} (json)`);
      }
    } catch (error) {
      // Parsing failed - return error info
      const errorMsg = error instanceof Error ? error.message : 'Response parsing failed';
      log(`Response parsing error: ${errorMsg}`);
      responseData = { message: response.statusText, parsingError: errorMsg };
    }

    if (!response.ok) {
      const detail = (responseData as { detail?: { error?: string } | string })?.detail;

      // Lock conflict (409) - return locked_by info for frontend
      if (response.status === 409) {
        log('409 Conflict - detail:', detail);
        const lockedBy = typeof detail === 'object' ? (detail as { locked_by?: unknown })?.locked_by : undefined;
        log('409 Conflict - extracted locked_by:', lockedBy);
        return {
          success: false,
          error: 'Resource is locked by another user',
          errorCode: 'CONFLICT',
          httpStatus: 409,
          data: { locked_by: lockedBy } as TResult,  // Put locked_by in data for useLocking
          rawResponse: responseData,
        };
      }

      // MinIO unavailable (503)
      if (response.status === 503 && typeof detail === 'object' && detail?.error === 'minio_unavailable') {
        return {
          success: false,
          error: 'MinIO storage is unavailable',
          errorCode: 'MINIO_UNAVAILABLE_WITH_FILES',
          httpStatus: 503,
          rawResponse: responseData,
        };
      }

      // Server error
      if (response.status >= 500) {
        return {
          success: false,
          error: typeof detail === 'string' ? sanitizeErrorMessage(detail) : 'Service error',
          errorCode: 'API_ERROR',
          httpStatus: response.status,
          rawResponse: responseData,
        };
      }

      // Client error
      return {
        success: false,
        error: typeof detail === 'string' ? sanitizeErrorMessage(detail) : `API returned ${response.status}`,
        errorCode: 'VALIDATION_ERROR',
        httpStatus: response.status,
        rawResponse: responseData,
      };
    }

    return {
      success: true,
      data: responseData as TResult,
      httpStatus: response.status,
      rawResponse: responseData,
    };
  } catch (error) {
    // Handle request cancellation separately
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        error: 'Request was cancelled',
        errorCode: 'NETWORK_ERROR',
      };
    }

    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: sanitizeErrorMessage(errorMsg),
      errorCode: 'NETWORK_ERROR',
    };
  }
}
