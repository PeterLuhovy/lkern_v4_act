/*
 * ================================================================
 * FILE: exportUtils.ts
 * PATH: /apps/web-ui/src/utils/exportUtils.ts
 * DESCRIPTION: Universal export utilities for CSV and JSON
 * VERSION: v1.0.0
 * UPDATED: 2025-11-24 14:20:00
 * ================================================================
 */

/**
 * Export data to CSV file
 * @param data - Array of objects to export
 * @param headers - Column headers (e.g., ['Name', 'Email', 'Date'])
 * @param filename - Output filename without extension
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  headers: string[],
  filename: string
): void {
  if (data.length === 0) {
    console.warn('[exportToCSV] No data to export');
    return;
  }

  // Extract values in header order
  const keys = Object.keys(data[0]);

  // CSV rows
  const rows = data.map(item => {
    return keys.map(key => {
      const value = item[key];

      // Handle null/undefined
      if (value === null || value === undefined) return 'N/A';

      // Handle strings with quotes
      if (typeof value === 'string') {
        return `"${value.replace(/"/g, '""')}"`;
      }

      // Handle dates
      if (value instanceof Date) {
        return value.toLocaleString('sk-SK');
      }

      // Handle booleans
      if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
      }

      return String(value);
    });
  });

  // Build CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  // Download file
  downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
  console.log(`[exportToCSV] ✅ Exported ${data.length} rows to ${filename}.csv`);
}

/**
 * Export data to JSON file
 * @param data - Array of objects to export
 * @param filename - Output filename without extension
 */
export function exportToJSON<T>(data: T[], filename: string): void {
  if (data.length === 0) {
    console.warn('[exportToJSON] No data to export');
    return;
  }

  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, `${filename}.json`, 'application/json;charset=utf-8;');
  console.log(`[exportToJSON] ✅ Exported ${data.length} items to ${filename}.json`);
}

/**
 * Internal helper to trigger file download
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
