/*
 * ================================================================
 * FILE: exportFile.ts
 * PATH: /packages/config/src/utils/exportFile.ts
 * DESCRIPTION: File export utility with configurable behavior
 *              (automatic download vs "Save As" dialog).
 * VERSION: v1.1.0
 * CREATED: 2025-12-10
 * UPDATED: 2025-12-11
 * CHANGELOG:
 *   v1.1.0 - Added prepareExportDestination() and writeToFileHandle()
 *            for "choose location first, then download" UX pattern
 * ================================================================
 */

/**
 * Export behavior modes for file downloads.
 *
 * - `automatic`: Download to default Downloads folder (no user prompt)
 * - `save-as-dialog`: Show browser "Save As" dialog (user chooses location)
 */
export type ExportBehavior = 'automatic' | 'save-as-dialog';

/**
 * Options for file export operation.
 */
export interface ExportFileOptions {
  /** Export behavior mode (default: 'automatic') */
  behavior?: ExportBehavior;
  /** Default file name (required for automatic mode) */
  fileName: string;
  /** MIME type (e.g., 'text/csv', 'application/pdf') */
  mimeType?: string;
  /** Suggested file extension (e.g., '.csv', '.pdf') */
  suggestedExtension?: string;
}

/**
 * Result of export operation.
 */
export interface ExportFileResult {
  /** Whether the export was successful */
  success: boolean;
  /** Error message (only if success=false) */
  error?: string;
  /** Export behavior used */
  behavior: ExportBehavior;
  /** Whether File System Access API was available */
  usedFileSystemApi: boolean;
}

/**
 * Export a file blob with configurable behavior.
 *
 * **Behavior Modes:**
 * - `automatic` (default): Downloads to browser's default Downloads folder
 *   - No user interaction required
 *   - Fast and simple
 *   - User cannot choose save location
 *
 * - `save-as-dialog`: Shows browser "Save As" dialog
 *   - User chooses save location and file name
 *   - Uses File System Access API (Chrome 86+, Edge 86+)
 *   - Automatic fallback to automatic download if API unavailable
 *
 * **Browser Compatibility:**
 * - Automatic download: All modern browsers (Chrome, Firefox, Safari, Edge)
 * - File System Access API: Chrome 86+, Edge 86+ (Safari/Firefox unsupported)
 *
 * **Security Notes:**
 * - File System Access API requires user gesture (click event)
 * - Blob URLs are automatically revoked after use to prevent memory leaks
 *
 * @param blob - File content as Blob
 * @param options - Export configuration options
 * @returns Result with success status and metadata
 *
 * @example
 * ```typescript
 * // Automatic download (no dialog)
 * const result = await exportFile(blob, {
 *   behavior: 'automatic',
 *   fileName: 'export_2025-12-10.csv',
 *   mimeType: 'text/csv',
 * });
 *
 * // Save As dialog (user chooses location)
 * const result = await exportFile(blob, {
 *   behavior: 'save-as-dialog',
 *   fileName: 'export.csv',
 *   mimeType: 'text/csv',
 *   suggestedExtension: '.csv',
 * });
 * ```
 */
export async function exportFile(
  blob: Blob,
  options: ExportFileOptions
): Promise<ExportFileResult> {
  const { behavior = 'automatic', fileName, mimeType, suggestedExtension } = options;

  // ─────────────────────────────────────────────────────────────────
  // AUTOMATIC DOWNLOAD - Classic <a> download link
  // ─────────────────────────────────────────────────────────────────
  if (behavior === 'automatic') {
    try {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);

      return {
        success: true,
        behavior: 'automatic',
        usedFileSystemApi: false,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        behavior: 'automatic',
        usedFileSystemApi: false,
      };
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // SAVE AS DIALOG - File System Access API with automatic fallback
  // ─────────────────────────────────────────────────────────────────
  if (behavior === 'save-as-dialog') {
    // Check if File System Access API is available
    if ('showSaveFilePicker' in window) {
      try {
        // Show "Save As" dialog
        const handle = await (window as Window & { showSaveFilePicker: (options: {
          suggestedName: string;
          types?: Array<{ description: string; accept: Record<string, string[]> }>;
        }) => Promise<FileSystemFileHandle> }).showSaveFilePicker({
          suggestedName: fileName,
          types: mimeType && suggestedExtension
            ? [
                {
                  description: 'Export File',
                  accept: { [mimeType]: [suggestedExtension] },
                },
              ]
            : undefined,
        });

        // Write blob to selected file
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();

        return {
          success: true,
          behavior: 'save-as-dialog',
          usedFileSystemApi: true,
        };
      } catch (error) {
        // User cancelled dialog or API error
        if (error instanceof Error && error.name === 'AbortError') {
          return {
            success: false,
            error: 'User cancelled save dialog',
            behavior: 'save-as-dialog',
            usedFileSystemApi: true,
          };
        }

        // Unknown error - fall back to automatic download
        console.warn('File System Access API failed, falling back to automatic download:', error);
      }
    }

    // Fallback: Automatic download (File System Access API unavailable or failed)
    try {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);

      return {
        success: true,
        behavior: 'save-as-dialog',
        usedFileSystemApi: false,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        behavior: 'save-as-dialog',
        usedFileSystemApi: false,
      };
    }
  }

  // Unreachable (TypeScript exhaustiveness check)
  return {
    success: false,
    error: `Invalid behavior: ${behavior as string}`,
    behavior,
    usedFileSystemApi: false,
  };
}

// ─────────────────────────────────────────────────────────────────
// PREPARE EXPORT DESTINATION - Show save dialog BEFORE download
// ─────────────────────────────────────────────────────────────────

/**
 * Options for preparing export destination.
 */
export interface PrepareExportOptions {
  /** Export behavior mode */
  behavior: ExportBehavior;
  /** Suggested file name */
  fileName: string;
  /** MIME type (e.g., 'application/zip') */
  mimeType?: string;
  /** File extension (e.g., '.zip') */
  suggestedExtension?: string;
}

/**
 * Result of preparing export destination.
 */
export interface PrepareExportResult {
  /** Whether preparation was successful (false = user cancelled) */
  success: boolean;
  /** File handle for writing (only for save-as-dialog with File System API) */
  fileHandle: FileSystemFileHandle | null;
  /** Whether to use automatic download fallback */
  useAutomaticFallback: boolean;
  /** File name to use (may be modified by user in save dialog) */
  fileName: string;
}

/**
 * Prepare export destination BEFORE starting download.
 *
 * This allows showing the "Save As" dialog before a potentially long download,
 * so the user can cancel early without wasting time/bandwidth.
 *
 * **Usage pattern:**
 * 1. Call prepareExportDestination() - shows dialog if needed
 * 2. If success=false, user cancelled - don't start download
 * 3. If success=true, start download with progress
 * 4. After download, call writeToFileHandle() or use automatic download
 *
 * @example
 * ```typescript
 * // 1. Prepare destination first
 * const prep = await prepareExportDestination({
 *   behavior: 'save-as-dialog',
 *   fileName: 'export.zip',
 *   mimeType: 'application/zip',
 *   suggestedExtension: '.zip',
 * });
 *
 * // 2. User cancelled?
 * if (!prep.success) {
 *   console.log('Export cancelled by user');
 *   return;
 * }
 *
 * // 3. Start download (long operation with progress)
 * const blob = await downloadWithProgress(...);
 *
 * // 4. Write to destination
 * if (prep.fileHandle) {
 *   await writeToFileHandle(prep.fileHandle, blob);
 * } else {
 *   // Automatic download fallback
 *   triggerAutomaticDownload(blob, prep.fileName);
 * }
 * ```
 */
export async function prepareExportDestination(
  options: PrepareExportOptions
): Promise<PrepareExportResult> {
  const { behavior, fileName, mimeType, suggestedExtension } = options;

  // Automatic mode - no preparation needed
  if (behavior === 'automatic') {
    return {
      success: true,
      fileHandle: null,
      useAutomaticFallback: true,
      fileName,
    };
  }

  // Save-as-dialog mode - show dialog now
  if (behavior === 'save-as-dialog') {
    // Check if File System Access API is available
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as Window & { showSaveFilePicker: (options: {
          suggestedName: string;
          types?: Array<{ description: string; accept: Record<string, string[]> }>;
        }) => Promise<FileSystemFileHandle> }).showSaveFilePicker({
          suggestedName: fileName,
          types: mimeType && suggestedExtension
            ? [
                {
                  description: 'Export File',
                  accept: { [mimeType]: [suggestedExtension] },
                },
              ]
            : undefined,
        });

        // Get the chosen file name
        const chosenName = handle.name || fileName;

        return {
          success: true,
          fileHandle: handle,
          useAutomaticFallback: false,
          fileName: chosenName,
        };
      } catch (error) {
        // User cancelled dialog
        if (error instanceof Error && error.name === 'AbortError') {
          return {
            success: false,
            fileHandle: null,
            useAutomaticFallback: false,
            fileName,
          };
        }

        // API error - fall back to automatic
        console.warn('File System Access API failed, will use automatic download:', error);
        return {
          success: true,
          fileHandle: null,
          useAutomaticFallback: true,
          fileName,
        };
      }
    }

    // File System Access API not available - use automatic fallback
    return {
      success: true,
      fileHandle: null,
      useAutomaticFallback: true,
      fileName,
    };
  }

  // Unknown behavior
  return {
    success: false,
    fileHandle: null,
    useAutomaticFallback: false,
    fileName,
  };
}

/**
 * Write blob to a FileSystemFileHandle.
 *
 * Use this after prepareExportDestination() returns a fileHandle.
 *
 * @param handle - FileSystemFileHandle from prepareExportDestination()
 * @param blob - File content to write
 */
export async function writeToFileHandle(
  handle: FileSystemFileHandle,
  blob: Blob
): Promise<{ success: boolean; error?: string }> {
  try {
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to write file',
    };
  }
}

/**
 * Trigger automatic download (fallback when File System API unavailable).
 *
 * @param blob - File content
 * @param fileName - File name for download
 */
export function triggerAutomaticDownload(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
