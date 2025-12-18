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
export declare function FileUpload({ value, onChange, maxFiles, maxSize, // 10MB default
accept, error, onError, onFileLimitExceeded, onPasteLimitReached, dropzoneText, dropzoneHint, enablePaste, enableDragDrop, showHint, }: FileUploadProps): import("react/jsx-runtime").JSX.Element;
