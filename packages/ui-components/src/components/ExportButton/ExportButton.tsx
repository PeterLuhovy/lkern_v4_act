/*
 * ================================================================
 * FILE: ExportButton.tsx
 * PATH: /packages/ui-components/src/components/ExportButton/ExportButton.tsx
 * DESCRIPTION: Dropdown button for exporting data in various formats
 * VERSION: v1.0.0
 * UPDATED: 2025-11-24 15:00:00
 * ================================================================
 */

import React from 'react';
import { useTranslation } from '@l-kern/config';
import styles from './ExportButton.module.css';

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
export function ExportButton({
  onExport,
  formats = ['csv', 'json'],
  disabled = false,
  label,
  className = '',
}: ExportButtonProps) {
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const format = e.target.value as ExportFormat;
    if (format) {
      onExport(format);
      e.target.value = ''; // Reset selection
    }
  };

  const formatLabels: Record<ExportFormat, string> = {
    csv: 'CSV',
    json: 'JSON',
    zip: 'ZIP (Full)',
  };

  return (
    <select
      className={`${styles.exportButton} ${className}`}
      onChange={handleChange}
      disabled={disabled}
      value=""
    >
      <option value="" disabled hidden>
        📥 {label || t('common.export')}
      </option>
      {formats.map((format) => (
        <option key={format} value={format}>
          {formatLabels[format]}
        </option>
      ))}
    </select>
  );
}
