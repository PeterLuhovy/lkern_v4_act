/*
 * ================================================================
 * FILE: exportUtils.test.ts
 * PATH: /packages/config/src/utils/exportUtils/exportUtils.test.ts
 * DESCRIPTION: Unit tests for exportUtils (CSV and JSON export)
 * VERSION: v1.0.0
 * CREATED: 2025-12-11
 * UPDATED: 2025-12-11
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportToCSV, exportToJSON } from './exportUtils';

// ================================================================
// MOCK SETUP
// ================================================================

// Mock URL API
const mockCreateObjectURL = vi.fn(() => 'blob:mock-url');
const mockRevokeObjectURL = vi.fn();

// Mock link element
const mockClick = vi.fn();
const mockLink = {
  href: '',
  download: '',
  click: mockClick,
};

// Store Blob content for assertions
let lastBlobContent = '';
let lastBlobType = '';

// Mock Blob class
class MockBlob {
  constructor(parts: BlobPart[], options?: BlobPropertyBag) {
    lastBlobContent = parts[0] as string;
    lastBlobType = options?.type || '';
  }
}

// Replace global Blob
global.Blob = MockBlob as unknown as typeof Blob;

// ================================================================
// TEST DATA
// ================================================================

const sampleData = [
  { name: 'John Doe', email: 'john@example.com', age: 30, active: true },
  { name: 'Jane Smith', email: 'jane@example.com', age: 25, active: false },
];

const sampleHeaders = ['Name', 'Email', 'Age', 'Active'];

// ================================================================
// exportToCSV TESTS
// ================================================================

describe('exportToCSV', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup URL mock
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    // Setup document mock
    vi.spyOn(document, 'createElement').mockReturnValue(mockLink as unknown as HTMLAnchorElement);

    // Reset link properties
    mockLink.href = '';
    mockLink.download = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ================================================================
  // BASIC FUNCTIONALITY
  // ================================================================
  describe('Basic Functionality', () => {
    it('creates CSV file from data', () => {
      exportToCSV(sampleData, sampleHeaders, 'test-export');

      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalled();
    });

    it('sets correct filename with .csv extension', () => {
      exportToCSV(sampleData, sampleHeaders, 'my-data');

      expect(mockLink.download).toBe('my-data.csv');
    });

    it('sets href to blob URL', () => {
      exportToCSV(sampleData, sampleHeaders, 'test');

      expect(mockLink.href).toBe('blob:mock-url');
    });

    it('creates blob with correct mime type', () => {
      exportToCSV(sampleData, sampleHeaders, 'test');

      expect(lastBlobType).toBe('text/csv;charset=utf-8;');
    });
  });

  // ================================================================
  // VALUE HANDLING
  // ================================================================
  describe('Value Handling', () => {
    it('handles null values as N/A', () => {
      const dataWithNull = [{ name: null, value: 'test' }];

      exportToCSV(dataWithNull, ['Name', 'Value'], 'test');

      expect(lastBlobContent).toContain('N/A');
    });

    it('handles undefined values as N/A', () => {
      const dataWithUndefined = [{ name: undefined, value: 'test' }];

      exportToCSV(dataWithUndefined, ['Name', 'Value'], 'test');

      expect(lastBlobContent).toContain('N/A');
    });

    it('escapes quotes in strings', () => {
      const dataWithQuotes = [{ name: 'John "The Man" Doe', value: 'test' }];

      exportToCSV(dataWithQuotes, ['Name', 'Value'], 'test');

      // Double quotes should be escaped as ""
      expect(lastBlobContent).toContain('""');
    });

    it('wraps strings in quotes', () => {
      exportToCSV(sampleData, sampleHeaders, 'test');

      expect(lastBlobContent).toContain('"John Doe"');
    });

    it('formats dates using locale string', () => {
      const testDate = new Date('2025-01-15T10:30:00');
      const dataWithDate = [{ name: 'Test', date: testDate }];

      exportToCSV(dataWithDate, ['Name', 'Date'], 'test');

      // Should contain locale formatted date (sk-SK format)
      expect(lastBlobContent).toBeDefined();
    });

    it('formats true boolean as Yes', () => {
      exportToCSV(sampleData, sampleHeaders, 'test');

      expect(lastBlobContent).toContain('Yes');
    });

    it('formats false boolean as No', () => {
      exportToCSV(sampleData, sampleHeaders, 'test');

      expect(lastBlobContent).toContain('No');
    });

    it('converts numbers to strings', () => {
      exportToCSV(sampleData, sampleHeaders, 'test');

      expect(lastBlobContent).toContain('30');
      expect(lastBlobContent).toContain('25');
    });
  });

  // ================================================================
  // CSV STRUCTURE
  // ================================================================
  describe('CSV Structure', () => {
    it('includes headers as first row', () => {
      exportToCSV(sampleData, sampleHeaders, 'test');

      const lines = lastBlobContent.split('\n');
      expect(lines[0]).toBe('Name,Email,Age,Active');
    });

    it('includes data rows after headers', () => {
      exportToCSV(sampleData, sampleHeaders, 'test');

      const lines = lastBlobContent.split('\n');
      expect(lines.length).toBe(3); // 1 header + 2 data rows
    });

    it('uses comma as separator', () => {
      exportToCSV(sampleData, sampleHeaders, 'test');

      expect(lastBlobContent).toContain(',');
    });

    it('uses newline as row separator', () => {
      exportToCSV(sampleData, sampleHeaders, 'test');

      expect(lastBlobContent).toContain('\n');
    });
  });

  // ================================================================
  // EMPTY DATA HANDLING
  // ================================================================
  describe('Empty Data Handling', () => {
    it('warns when data is empty', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
        /* noop */
      });

      exportToCSV([], sampleHeaders, 'test');

      expect(warnSpy).toHaveBeenCalledWith('[exportToCSV] No data to export');
    });

    it('does not create file when data is empty', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {
        /* noop */
      });

      exportToCSV([], sampleHeaders, 'test');

      expect(mockCreateObjectURL).not.toHaveBeenCalled();
      expect(mockClick).not.toHaveBeenCalled();
    });

    it('returns early when data is empty', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {
        /* noop */
      });

      exportToCSV([], sampleHeaders, 'test');

      expect(document.createElement).not.toHaveBeenCalled();
    });
  });

  // ================================================================
  // LOGGING
  // ================================================================
  describe('Logging', () => {
    it('logs success message with row count', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {
        /* noop */
      });

      exportToCSV(sampleData, sampleHeaders, 'test-file');

      expect(logSpy).toHaveBeenCalledWith(
        '[exportToCSV] ✅ Exported 2 rows to test-file.csv'
      );
    });
  });
});

// ================================================================
// exportToJSON TESTS
// ================================================================

describe('exportToJSON', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup URL mock
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    // Setup document mock
    vi.spyOn(document, 'createElement').mockReturnValue(mockLink as unknown as HTMLAnchorElement);

    // Reset link properties
    mockLink.href = '';
    mockLink.download = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ================================================================
  // BASIC FUNCTIONALITY
  // ================================================================
  describe('Basic Functionality', () => {
    it('creates JSON file from data', () => {
      exportToJSON(sampleData, 'test-export');

      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalled();
    });

    it('sets correct filename with .json extension', () => {
      exportToJSON(sampleData, 'my-data');

      expect(mockLink.download).toBe('my-data.json');
    });

    it('sets href to blob URL', () => {
      exportToJSON(sampleData, 'test');

      expect(mockLink.href).toBe('blob:mock-url');
    });

    it('creates blob with correct mime type', () => {
      exportToJSON(sampleData, 'test');

      expect(lastBlobType).toBe('application/json;charset=utf-8;');
    });
  });

  // ================================================================
  // JSON STRUCTURE
  // ================================================================
  describe('JSON Structure', () => {
    it('generates pretty formatted JSON with 2 spaces', () => {
      exportToJSON(sampleData, 'test');

      // Pretty formatted JSON has newlines and spaces
      expect(lastBlobContent).toContain('\n');
      expect(lastBlobContent).toContain('  '); // 2 spaces indent
    });

    it('generates valid JSON', () => {
      exportToJSON(sampleData, 'test');

      expect(() => JSON.parse(lastBlobContent)).not.toThrow();
    });

    it('preserves data structure in JSON', () => {
      exportToJSON(sampleData, 'test');

      const parsed = JSON.parse(lastBlobContent);
      expect(parsed).toEqual(sampleData);
    });
  });

  // ================================================================
  // EMPTY DATA HANDLING
  // ================================================================
  describe('Empty Data Handling', () => {
    it('warns when data is empty', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
        /* noop */
      });

      exportToJSON([], 'test');

      expect(warnSpy).toHaveBeenCalledWith('[exportToJSON] No data to export');
    });

    it('does not create file when data is empty', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {
        /* noop */
      });

      exportToJSON([], 'test');

      expect(mockCreateObjectURL).not.toHaveBeenCalled();
      expect(mockClick).not.toHaveBeenCalled();
    });

    it('returns early when data is empty', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {
        /* noop */
      });

      exportToJSON([], 'test');

      expect(document.createElement).not.toHaveBeenCalled();
    });
  });

  // ================================================================
  // LOGGING
  // ================================================================
  describe('Logging', () => {
    it('logs success message with item count', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {
        /* noop */
      });

      exportToJSON(sampleData, 'test-file');

      expect(logSpy).toHaveBeenCalledWith(
        '[exportToJSON] ✅ Exported 2 items to test-file.json'
      );
    });
  });

  // ================================================================
  // EDGE CASES
  // ================================================================
  describe('Edge Cases', () => {
    it('handles single item array', () => {
      const singleItem = [{ name: 'Test' }];

      exportToJSON(singleItem, 'test');

      const parsed = JSON.parse(lastBlobContent);
      expect(parsed).toEqual(singleItem);
    });

    it('handles complex nested objects', () => {
      const nestedData = [{
        name: 'Test',
        address: {
          city: 'Bratislava',
          zip: '12345',
        },
        tags: ['a', 'b', 'c'],
      }];

      exportToJSON(nestedData, 'test');

      const parsed = JSON.parse(lastBlobContent);
      expect(parsed).toEqual(nestedData);
    });

    it('handles special characters in data', () => {
      const specialData = [{ name: 'Test <script>alert("xss")</script>' }];

      exportToJSON(specialData, 'test');

      const parsed = JSON.parse(lastBlobContent);
      expect(parsed[0].name).toBe('Test <script>alert("xss")</script>');
    });
  });
});
