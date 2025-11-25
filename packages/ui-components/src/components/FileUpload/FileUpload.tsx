/*
 * ================================================================
 * FILE: FileUpload.tsx
 * PATH: /packages/ui-components/src/components/FileUpload/FileUpload.tsx
 * DESCRIPTION: Reusable file upload component with click, drag&drop, and paste support
 * VERSION: v1.0.0
 * CREATED: 2025-11-24
 * UPDATED: 2025-11-24
 * ================================================================
 */

import { useState, useRef, useEffect } from 'react';
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
  dropzoneText,
  dropzoneHint,
  enablePaste = true,
  enableDragDrop = true,
  showHint = true,
}: FileUploadProps) {
  const { t } = useTranslation();
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============================================================
  // FILE VALIDATION
  // ============================================================

  const validateFiles = (files: File[]): { valid: File[]; error?: string } => {
    // Check file count
    const totalFiles = value.length + files.length;
    if (totalFiles > maxFiles) {
      return {
        valid: [],
        error: t('components.fileUpload.errors.maxFiles', { max: maxFiles }),
      };
    }

    // Check file sizes
    const oversizedFiles = files.filter((file) => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
      return {
        valid: [],
        error: t('components.fileUpload.errors.maxSize', { max: maxSizeMB }),
      };
    }

    return { valid: files };
  };

  // ============================================================
  // FILE HANDLERS
  // ============================================================

  const handleFilesAdded = (files: File[]) => {
    const validation = validateFiles(files);

    if (validation.error) {
      if (onError) {
        onError(validation.error);
      }
      return;
    }

    // Clear any previous errors
    if (onError && error) {
      onError('');
    }

    // Add files to current value (merge with existing)
    const newFiles = [...value, ...validation.valid].slice(0, maxFiles);
    onChange(newFiles);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    handleFilesAdded(Array.from(files));

    // Reset input value to allow re-selecting same file
    event.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  // ============================================================
  // DRAG & DROP HANDLERS
  // ============================================================

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    if (!enableDragDrop) return;

    event.preventDefault();
    event.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    if (!enableDragDrop) return;

    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    if (!enableDragDrop) return;

    event.preventDefault();
    event.stopPropagation();

    // Only set to false if leaving the dropzone itself (not child elements)
    if (event.currentTarget === event.target) {
      setIsDraggingOver(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    if (!enableDragDrop) return;

    event.preventDefault();
    event.stopPropagation();
    setIsDraggingOver(false);

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      handleFilesAdded(Array.from(files));
    }
  };

  // ============================================================
  // PASTE HANDLER (Ctrl+V)
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
        handleFilesAdded(imageFiles);
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [enablePaste, value, maxFiles, maxSize, error, onError]);

  // ============================================================
  // COMPUTED VALUES
  // ============================================================

  const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
  const displayDropzoneText = dropzoneText || t('components.fileUpload.dropzoneText');
  const displayDropzoneHint = dropzoneHint || t('components.fileUpload.dropzoneHint', { max: maxFiles });

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className={styles.fileUpload}>
      {/* Dropzone */}
      <div
        ref={dropzoneRef}
        className={`${styles.dropzone} ${isDraggingOver ? styles.dropzoneDragging : ''} ${error ? styles.dropzoneError : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-testid="file-upload-dropzone"
      >
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
        <label htmlFor="file-upload-input" className={styles.dropzoneContent}>
          <span className={styles.dropzoneIcon}>📎</span>
          <span className={styles.dropzoneText}>{displayDropzoneText}</span>
          <span className={styles.dropzoneHint}>{displayDropzoneHint}</span>
        </label>
      </div>

      {/* Hint */}
      {showHint && (
        <div className={styles.fileHint}>
          {t('components.fileUpload.fileHint', { max: maxSizeMB })}
        </div>
      )}

      {/* Error */}
      {error && <span className={styles.error}>{error}</span>}

      {/* File List */}
      {value.length > 0 && (
        <div className={styles.fileList} data-testid="file-upload-list">
          {value.map((file, index) => (
            <div key={index} className={styles.fileItem} data-testid={`file-item-${index}`}>
              <span className={styles.fileName}>
                📎 {file.name} <span className={styles.fileSize}>({(file.size / 1024).toFixed(1)} KB)</span>
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