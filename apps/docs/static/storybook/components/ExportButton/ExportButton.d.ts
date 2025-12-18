export type ExportFormat = 'csv' | 'json' | 'zip';
export interface ExportButtonProps {
    /**
     * Callback when export format is selected
     */
    onExport: (format: ExportFormat) => void;
    /**
     * Available export formats
     * @default ['csv', 'json']
     */
    formats?: ExportFormat[];
    /**
     * Disabled state
     * @default false
     */
    disabled?: boolean;
    /**
     * Custom label (overrides translation)
     */
    label?: string;
    /**
     * CSS class name
     */
    className?: string;
}
/**
 * ExportButton - Dropdown select for exporting data
 *
 * @example
 * ```tsx
 * <ExportButton
 *   onExport={(format) => {
 *     if (format === 'csv') exportToCSV(data, headers, 'export');
 *     else if (format === 'json') exportToJSON(data, 'export');
 *   }}
 *   formats={['csv', 'json']}
 * />
 * ```
 */
export declare function ExportButton({ onExport, formats, disabled, label, className, }: ExportButtonProps): import("react/jsx-runtime").JSX.Element;
