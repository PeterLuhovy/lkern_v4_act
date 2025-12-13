# ================================================================
# exportFile
# ================================================================
# File: L:\system\lkern_codebase_v4_act\packages\config\src\utils\exportFile\exportFile.md
# Version: 1.0.0
# Created: 2025-12-10
# Updated: 2025-12-10
# Utility Location: packages/config/src/utils/exportFile.ts
# Package: @l-kern/config
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   File export utility with configurable behavior (automatic download to Downloads
#   folder vs "Save As" dialog for user-chosen location) with File System Access API.
# ================================================================

---

## Overview

**Purpose**: Export file blobs with automatic download or "Save As" dialog
**Package**: @l-kern/config
**Path**: packages/config/src/utils/exportFile.ts
**Since**: v1.0.0

The exportFile utility provides a standardized way to export file blobs (CSV, PDF, JSON, etc.) with configurable download behavior. It supports two modes: (1) automatic download to browser's default Downloads folder (fast, no user interaction), and (2) "Save As" dialog using File System Access API (user chooses save location and file name). The utility handles API availability detection, automatic fallback for unsupported browsers, and proper Blob URL cleanup.

---

## Functions

This utility file exports the following:

### exportFile
Main function for exporting file blobs with configurable behavior (automatic vs dialog)

### ExportBehavior (type)
Type definition for export behavior modes: 'automatic' | 'save-as-dialog'

### ExportFileOptions (interface)
Options interface for export configuration

### ExportFileResult (interface)
Result interface with success status and metadata

---

## API Reference

### Function: exportFile

**Signature:**
```typescript
function exportFile(
  blob: Blob,
  options: ExportFileOptions
): Promise<ExportFileResult>
```

**Purpose:**
Export a file blob with configurable download behavior (automatic download or "Save As" dialog with File System Access API).

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `blob` | `Blob` | Yes | File content as Blob object (use `new Blob([content], { type: mimeType })`) |
| `options` | `ExportFileOptions` | Yes | Export configuration (behavior, fileName, mimeType, suggestedExtension) |

**Options Interface:**

```typescript
interface ExportFileOptions {
  behavior?: ExportBehavior;      // Export mode (default: 'automatic')
  fileName: string;                // Default file name (required)
  mimeType?: string;               // MIME type (e.g., 'text/csv', 'application/pdf')
  suggestedExtension?: string;     // File extension (e.g., '.csv', '.pdf')
}

type ExportBehavior = 'automatic' | 'save-as-dialog';
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `behavior` | `'automatic' \| 'save-as-dialog'` | `'automatic'` | Export behavior mode |
| `fileName` | `string` | - | **Required** Default file name for download |
| `mimeType` | `string` | `undefined` | MIME type of file content (optional but recommended) |
| `suggestedExtension` | `string` | `undefined` | File extension for file picker filter (only used with save-as-dialog) |

**Returns:**

```typescript
interface ExportFileResult {
  success: boolean;              // Whether export succeeded
  error?: string;                // Error message (only if success=false)
  behavior: ExportBehavior;      // Behavior used
  usedFileSystemApi: boolean;    // Whether File System Access API was used
}
```

| Property | Type | Description |
|----------|------|-------------|
| `success` | `boolean` | True if export succeeded, false if failed or user cancelled |
| `error` | `string \| undefined` | Error message if export failed. Undefined if successful. |
| `behavior` | `ExportBehavior` | Behavior mode that was used (matches input or fallback) |
| `usedFileSystemApi` | `boolean` | True if File System Access API was used (Chrome 86+), false if fallback to <a> download |

---

## Behavior Modes

### 1. Automatic Download (`behavior: 'automatic'`)

**How it works:**
- Creates a Blob URL and triggers download using `<a download>` element
- Downloads to browser's default Downloads folder
- No user interaction required
- Fast and simple

**Pros:**
- ✅ Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ No user interaction required (no dialog)
- ✅ Fast and reliable
- ✅ Simple implementation

**Cons:**
- ❌ User cannot choose save location
- ❌ User cannot rename file before saving
- ❌ Multiple downloads clutter Downloads folder

**Use cases:**
- Quick exports where user doesn't need to choose location
- Batch exports (multiple files at once)
- Default behavior for most exports

### 2. Save As Dialog (`behavior: 'save-as-dialog'`)

**How it works:**
- Uses File System Access API to show native "Save As" dialog
- User chooses save location and file name
- Automatic fallback to automatic download if API unavailable

**Pros:**
- ✅ User chooses save location
- ✅ User can rename file before saving
- ✅ Better user experience for important exports
- ✅ Automatic fallback for unsupported browsers

**Cons:**
- ❌ Only works in Chrome 86+ and Edge 86+ (Safari/Firefox unsupported)
- ❌ Requires user gesture (click event) for security
- ❌ User can cancel dialog (returns success=false with "User cancelled" error)

**Use cases:**
- Important exports (reports, backups, legal documents)
- User preference to organize files in specific folders
- Power users who want control over file location

---

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| **Automatic Download** | ✅ All versions | ✅ All versions | ✅ All versions | ✅ All versions |
| **File System Access API** | ✅ 86+ | ❌ Not supported | ❌ Not supported | ✅ 86+ |
| **Automatic Fallback** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |

**Fallback Behavior:**
- If `behavior: 'save-as-dialog'` but API unavailable → automatically falls back to automatic download
- Result will have `usedFileSystemApi: false` to indicate fallback occurred

---

## Examples

### Example 1: Automatic Download (CSV)

```typescript
import { exportFile } from '@l-kern/config';

async function handleExportCSV(data: string[][]) {
  const csvContent = data.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const result = await exportFile(blob, {
    behavior: 'automatic',
    fileName: `export_${new Date().toISOString()}.csv`,
    mimeType: 'text/csv',
  });

  if (result.success) {
    toast.success('CSV exported successfully!');
  } else {
    toast.error(`Export failed: ${result.error}`);
  }
}
```

### Example 2: Save As Dialog (PDF)

```typescript
import { exportFile } from '@l-kern/config';

async function handleExportPDF(pdfBlob: Blob) {
  const result = await exportFile(pdfBlob, {
    behavior: 'save-as-dialog',
    fileName: 'invoice.pdf',
    mimeType: 'application/pdf',
    suggestedExtension: '.pdf',
  });

  if (result.success) {
    if (result.usedFileSystemApi) {
      toast.success('PDF saved to chosen location!');
    } else {
      toast.success('PDF downloaded to Downloads folder');
    }
  } else if (result.error === 'User cancelled save dialog') {
    // User intentionally cancelled - no need to show error
  } else {
    toast.error(`Export failed: ${result.error}`);
  }
}
```

### Example 3: JSON Export with User Preference

```typescript
import { exportFile, ExportBehavior } from '@l-kern/config';

async function handleExportJSON(data: object, userBehavior: ExportBehavior) {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });

  const result = await exportFile(blob, {
    behavior: userBehavior, // User preference from settings
    fileName: 'data.json',
    mimeType: 'application/json',
    suggestedExtension: '.json',
  });

  if (!result.success) {
    console.error('Export failed:', result.error);
  }
}

// Usage with user setting
const userExportBehavior = localStorage.getItem('exportBehavior') as ExportBehavior || 'automatic';
handleExportJSON(myData, userExportBehavior);
```

### Example 4: Batch Export (Multiple Files)

```typescript
import { exportFile } from '@l-kern/config';

async function handleBatchExport(files: Array<{ name: string; content: string }>) {
  for (const file of files) {
    const blob = new Blob([file.content], { type: 'text/plain' });

    await exportFile(blob, {
      behavior: 'automatic', // Use automatic for batch exports
      fileName: file.name,
    });

    // Small delay between exports to avoid browser blocking
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  toast.success(`Exported ${files.length} files`);
}
```

### Example 5: Excel Export (XLSX)

```typescript
import { exportFile } from '@l-kern/config';
import * as XLSX from 'xlsx';

async function handleExportExcel(data: object[]) {
  // Create workbook
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  // Generate binary array
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const result = await exportFile(blob, {
    behavior: 'save-as-dialog',
    fileName: 'export.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    suggestedExtension: '.xlsx',
  });

  if (result.success) {
    toast.success('Excel file exported!');
  }
}
```

---

## Edge Cases

**Empty Blob:**
```typescript
const emptyBlob = new Blob([], { type: 'text/plain' });
const result = await exportFile(emptyBlob, {
  fileName: 'empty.txt',
});
// Result: success=true, creates empty file
```

**User Cancels Dialog:**
```typescript
const result = await exportFile(blob, {
  behavior: 'save-as-dialog',
  fileName: 'file.csv',
});

if (!result.success && result.error === 'User cancelled save dialog') {
  // User intentionally cancelled - not an error
  console.log('User cancelled');
}
```

**Unsupported Browser (Safari with save-as-dialog):**
```typescript
// Safari doesn't support File System Access API
const result = await exportFile(blob, {
  behavior: 'save-as-dialog',  // Requested dialog
  fileName: 'file.pdf',
});

// Result: success=true, behavior='save-as-dialog', usedFileSystemApi=false
// Automatically fell back to automatic download
```

**Missing MIME Type:**
```typescript
const result = await exportFile(blob, {
  fileName: 'file.txt',
  // mimeType not provided - still works, browser may infer type
});
// Result: success=true
```

---

## Known Issues

**No known issues** - Utility is stable and production-ready.

---

## Best Practices

1. **Always provide mimeType** - Helps browser handle file correctly
2. **Use automatic for batch exports** - Avoid spamming user with dialogs
3. **Use save-as-dialog for important files** - Reports, backups, legal documents
4. **Handle user cancellation gracefully** - Don't show error if user cancels
5. **Check usedFileSystemApi** - Adjust UI message based on whether dialog was shown
6. **Add timestamp to fileName** - Prevents overwriting previous exports
7. **Test in all browsers** - Verify fallback works in Safari/Firefox
8. **Use proper file extensions** - Match suggestedExtension with mimeType
9. **Handle async errors** - Wrap calls in try/catch or check result.success

---

## Security Notes

- **File System Access API requires user gesture** - Must be called from click event handler
- **Blob URLs are automatically revoked** - Prevents memory leaks
- **No server-side storage** - File export happens client-side only
- **User has full control** - Can cancel dialog or choose any location

---

## Changelog

### v1.0.0 (2025-12-10)
- ✅ Initial implementation
- ✅ Automatic download mode
- ✅ Save As dialog mode with File System Access API
- ✅ Automatic fallback for unsupported browsers
- ✅ Blob URL cleanup
- ✅ User cancellation detection

---

**End of exportFile Documentation**
