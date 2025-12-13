/*
 * ================================================================
 * FILE: FileUpload.tsx
 * PATH: /packages/ui-components/src/components/FileUpload/FileUpload.tsx
 * DESCRIPTION: Reusable file upload component with click, drag&drop, and paste support
 *              - Paste (Ctrl+V): Hard limit - won't add if at max, modal can still submit
 *              - Drag&Drop/Click: Soft limit - adds all, modal disabled until files removed
 * VERSION: v1.1.0
 * CREATED: 2025-11-24
 * UPDATED: 2025-11-27
 * ================================================================
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from '@l-kern/config';
import styles from './FileUpload.module.css';

export interface FileUploadProps {
  /**
   * Current files array
   */
  value: File[];
  /**
   * Callback when files change (add or remove)
   */
  onChange: (files: File[]) => void;
  /**
   * Maximum number of files allowed
   * @default 5
   */
  maxFiles?: number;
  /**
   * Maximum size per file in bytes
   * @default 10485760 (10MB)
   */
  maxSize?: number;
  /**
   * Accepted file types (MIME types or extensions)
   * @default 'image/*,.pdf,.log,.txt'
   */
  accept?: string;
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Callback when validation error occurs
   */
  onError?: (error: string) => void;
  /**
   * Callback when file count exceeds maxFiles limit
   * Used by parent to disable submit button
   */
  onFileLimitExceeded?: (exceeded: boolean) => void;
  /**
   * Callback when paste is blocked due to max files limit
   * Used by parent to show toast notification
   */
  onPasteLimitReached?: () => void;
  /**
   * Custom dropzone text
   */
  dropzoneText?: string;
  /**
   * Custom dropzone hint text
   */
  dropzoneHint?: string;
  /**
   * Enable Ctrl+V paste functionality
   * @default true
   */
  enablePaste?: boolean;
  /**
   * Enable drag and drop functionality
   * @default true
   */
  enableDragDrop?: boolean;
  /**
   * Show file size limit hint
   * @default true
   */
  showHint?: boolean;
}

export function FileUpload({
  value,
  onChange,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB default
  accept = 'image/*,.pdf,.log,.txt',
  error,
  onError,
  onFileLimitExceeded,
  onPasteLimitReached,
  dropzoneText,
  dropzoneHint,
  enablePaste = true,
  enableDragDrop = true,
  showHint = true,
}: FileUploadProps) {
  const { t } = useTranslation();
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  // Info message for paste limit (non-blocking, just informational)
  const [pasteInfoMessage, setPasteInfoMessage] = useState<string>('');
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Drag counter to handle child element enter/leave events
  const dragCounterRef = useRef(0);

  // ============================================================
  // NOTIFY PARENT WHEN FILE COUNT EXCEEDS LIMIT
  // ============================================================

  useEffect(() => {
    if (onFileLimitExceeded) {
      onFileLimitExceeded(value.length > maxFiles);
    }
    // Clear paste info message when files are removed below limit
    if (value.length <= maxFiles && pasteInfoMessage) {
      setPasteInfoMessage('');
    }
  }, [value.length, maxFiles, onFileLimitExceeded, pasteInfoMessage]);

  // ============================================================
  // FILE VALIDATION
  // ============================================================

  /**
   * Validate file sizes only (no count limit)
   */
  const validateFileSizes = useCallback((files: File[]): { valid: File[]; error?: string } => {
    const oversizedFiles = files.filter((file) => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
      return {
        valid: [],
        error: t('components.fileUpload.errors.maxSize', { max: maxSizeMB }),
      };
    }
    return { valid: files };
  }, [maxSize, t]);

  // ============================================================
  // FILE HANDLERS
  // ============================================================

  /**
   * Handler for Drag & Drop and File Input (click)
   * SOFT LIMIT: Allows adding ANY number of files
   * Parent uses onFileLimitExceeded to disable submit when count > maxFiles
   */
  const handleFilesAddedFromDropOrClick = useCallback((files: File[]) => {
    const validation = validateFileSizes(files);

    if (validation.error) {
      if (onError) {
        onError(validation.error);
      }
      return;
    }

    // Clear paste info message (user is using different method now)
    setPasteInfoMessage('');

    // Add ALL files (no count limit) - parent will disable submit if > maxFiles
    const newFiles = [...value, ...validation.valid];
    onChange(newFiles);
  }, [value, validateFileSizes, onError, onChange]);

  /**
   * Handler for Ctrl+V Paste
   * HARD LIMIT: Will NOT add file if already at maxFiles
   * Triggers toast notification via onPasteLimitReached callback
   */
  const handleFilesAddedFromPaste = useCallback((files: File[]) => {
    // Hard limit check for paste
    if (value.length >= maxFiles) {
      // Notify parent to show toast
      if (onPasteLimitReached) {
        onPasteLimitReached();
      }
      return;
    }

    const validation = validateFileSizes(files);

    if (validation.error) {
      if (onError) {
        onError(validation.error);
      }
      return;
    }

    // Add files up to the limit
    const remainingSlots = maxFiles - value.length;
    const filesToAdd = validation.valid.slice(0, remainingSlots);
    const newFiles = [...value, ...filesToAdd];
    onChange(newFiles);

    // If we couldn't add all pasted files, notify parent
    if (validation.valid.length > remainingSlots && onPasteLimitReached) {
      onPasteLimitReached();
    }
  }, [value, maxFiles, validateFileSizes, onError, onChange, onPasteLimitReached]);

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Use soft limit handler for file input (click)
    handleFilesAddedFromDropOrClick(Array.from(files));

    // Reset input value to allow re-selecting same file
    event.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
    // Clear errors when removing files
    if (onError && error) {
      onError('');
    }
  };

  // ============================================================
  // DRAG & DROP HANDLERS
  // ============================================================

  const handleDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    if (!enableDragDrop) return;

    event.preventDefault();
    event.stopPropagation();
    
    // Increment counter - handles child element events
    dragCounterRef.current++;
    if (dragCounterRef.current === 1) {
      setIsDraggingOver(true);
    }
  }, [enableDragDrop]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    if (!enableDragDrop) return;

    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    if (!enableDragDrop) return;

    event.preventDefault();
    event.stopPropagation();

    // Decrement counter - only hide highlight when fully leaving dropzone
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDraggingOver(false);
    }
  }, [enableDragDrop]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    if (!enableDragDrop) return;

    event.preventDefault();
    event.stopPropagation();

    // Reset counter and hide highlight
    dragCounterRef.current = 0;
    setIsDraggingOver(false);

    // Don't accept drops when at limit
    if (value.length >= maxFiles) {
      return;
    }

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      // Use soft limit handler for drop
      handleFilesAddedFromDropOrClick(Array.from(files));
    }
  }, [enableDragDrop, value.length, maxFiles, handleFilesAddedFromDropOrClick]);

  // ============================================================
  // PASTE HANDLER (Ctrl+V) - Hard limit enforcement
  // ============================================================

  useEffect(() => {
    if (!enablePaste) return;

    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      const imageFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            // Create a named file from clipboard
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const namedFile = new File([file], `screenshot-${timestamp}.png`, { type: file.type });
            imageFiles.push(namedFile);
          }
        }
      }

      if (imageFiles.length > 0) {
        event.preventDefault();
        // Use HARD limit handler for paste
        handleFilesAddedFromPaste(imageFiles);
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [enablePaste, handleFilesAddedFromPaste]);

  // ============================================================
  // COMPUTED VALUES
  // ============================================================

  const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
  const displayDropzoneText = dropzoneText || t('components.fileUpload.dropzoneText');
  const displayDropzoneHint = dropzoneHint || t('components.fileUpload.dropzoneHint', { max: maxFiles });

  // Check if file count exceeds limit (for warning display)
  const isOverLimit = value.length > maxFiles;

  // Check if at max files limit (disable dropzone)
  const isAtLimit = value.length >= maxFiles;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className={styles.fileUpload}>
      {/* Dropzone */}
      <div
        ref={dropzoneRef}
        className={`${styles.dropzone} ${isDraggingOver && !isAtLimit ? styles.dropzoneDragging : ''} ${error || isOverLimit ? styles.dropzoneError : ''} ${isAtLimit ? styles.dropzoneDisabled : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-testid="file-upload-dropzone"
      >
        {/* Only show file input when not at limit */}
        {!isAtLimit && (
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={accept}
            onChange={handleFileInputChange}
            className={styles.fileInputHidden}
            id="file-upload-input"
            data-testid="file-upload-input"
          />
        )}

        {/* Clickable label when not at limit, non-clickable span when at limit */}
        {isAtLimit ? (
          <div className={styles.dropzoneContent}>
            <span className={styles.dropzoneIconDisabled} role="img" aria-hidden="true">🚫</span>
            <span className={styles.dropzoneText}>{t('components.fileUpload.limitReached')}</span>
            <span className={styles.dropzoneHint}>{t('components.fileUpload.removeToAdd')}</span>
          </div>
        ) : (
          <label htmlFor="file-upload-input" className={styles.dropzoneContent}>
            <span className={styles.dropzoneIcon} role="img" aria-hidden="true">📎</span>
            <span className={styles.dropzoneText}>{displayDropzoneText}</span>
            <span className={styles.dropzoneHint}>{displayDropzoneHint}</span>
          </label>
        )}
      </div>

      {/* Hint */}
      {showHint && (
        <div className={styles.fileHint}>
          {t('components.fileUpload.fileHint', { max: maxSizeMB })}
        </div>
      )}

      {/* Error (from size validation) */}
      {error && <span className={styles.error}>{error}</span>}

      {/* Warning when too many files (from drag&drop/click) - blocks form submission */}
      {/* Always rendered with reserved space to prevent modal height jumping */}
      <span
        className={`${styles.warning} ${!isOverLimit ? styles.warningHidden : ''}`}
        data-testid="file-upload-warning"
      >
        <span role="img" aria-hidden="true">⚠️</span> {t('components.fileUpload.errors.maxFiles', { max: maxFiles })} - {t('components.fileUpload.removeToSubmit')}
      </span>

      {/* Info message for paste limit (doesn't block form submission) */}
      {pasteInfoMessage && !isOverLimit && (
        <span className={styles.info} data-testid="file-upload-info">
          <span role="img" aria-hidden="true">ℹ️</span> {pasteInfoMessage}
        </span>
      )}

      {/* File List */}
      {value.length > 0 && (
        <div className={styles.fileList} data-testid="file-upload-list">
          {value.map((file, index) => (
            <div key={index} className={styles.fileItem} data-testid={`file-item-${index}`}>
              <span className={styles.fileName}>
                <span role="img" aria-hidden="true">📎</span> {file.name} <span className={styles.fileSize}>({(file.size / 1024).toFixed(1)} KB)</span>
              </span>
              <button
                type="button"
                className={styles.removeFileBtn}
                onClick={() => handleRemoveFile(index)}
                title={t('components.fileUpload.removeFile')}
                data-testid={`file-remove-${index}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}