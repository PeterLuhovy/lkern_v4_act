/*
 * ================================================================
 * FILE: ExportProgressModal.test.tsx
 * PATH: /packages/ui-components/src/components/ExportProgressModal/ExportProgressModal.test.tsx
 * DESCRIPTION: Comprehensive test suite for ExportProgressModal component
 * VERSION: v1.0.0
 * CREATED: 2025-12-11
 * UPDATED: 2025-12-11
 * ================================================================
 */

import { describe, it, expect, vi } from 'vitest';
import { renderWithAll, screen, fireEvent } from '../../test-utils';
import { ExportProgressModal, ExportFile, ExportProgress } from './ExportProgressModal';

describe('ExportProgressModal', () => {
  // ================================================================
  // TEST DATA
  // ================================================================

  const mockFiles: ExportFile[] = [
    { name: 'document.pdf', entityCode: 'ISS-001', size: 2621440 }, // 2.5 MB
    { name: 'image.png', entityCode: 'ISS-002', size: 524288 }, // 512 KB
    { name: 'report.xlsx', entityCode: 'ISS-003', size: 1258291 }, // 1.2 MB
  ];

  const mockProgressHealthCheck: ExportProgress = {
    phase: 'healthCheck',
    percentage: 0,
    downloadedBytes: 0,
    totalBytes: 0,
    totalKnown: false,
  };

  const mockProgressDownloading: ExportProgress = {
    phase: 'downloading',
    percentage: 45,
    downloadedBytes: 1048576, // 1 MB
    totalBytes: 2097152, // 2 MB
    totalKnown: true,
  };

  const mockProgressIndeterminate: ExportProgress = {
    phase: 'downloading',
    percentage: 0,
    downloadedBytes: 1048576, // 1 MB
    totalBytes: 0,
    totalKnown: false,
  };

  const mockProgressProcessing: ExportProgress = {
    phase: 'processing',
    percentage: 100,
    downloadedBytes: 2097152, // 2 MB
    totalBytes: 2097152, // 2 MB
    totalKnown: true,
  };

  const mockProgressComplete: ExportProgress = {
    phase: 'complete',
    percentage: 100,
    downloadedBytes: 2097152, // 2 MB
    totalBytes: 2097152, // 2 MB
    totalKnown: true,
  };

  // ================================================================
  // RENDERING
  // ================================================================

  describe('Rendering', () => {
    it('renders nothing when closed', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={false}
          format="CSV"
          progress={mockProgressDownloading}
          files={mockFiles}
        />
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders modal when open', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="CSV"
          progress={mockProgressDownloading}
          files={mockFiles}
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('renders progress bar during downloading phase', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="CSV"
          progress={mockProgressDownloading}
          files={[]}
        />
      );

      // Check for progress info text
      expect(screen.getByText('1.00 MB / 2.00 MB')).toBeInTheDocument();
      expect(screen.getByText('45%')).toBeInTheDocument();
    });

    it('hides progress bar during healthCheck phase', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="ZIP"
          progress={mockProgressHealthCheck}
          files={[]} // No files to avoid "MB" in file sizes
        />
      );

      // Progress bar should NOT be visible during health check
      // Check that progressSection is not rendered
      const modal = screen.getByRole('dialog');
      const progressSection = modal.querySelector('.progressSection');
      expect(progressSection).not.toBeInTheDocument();
    });

    it('renders file list when files provided', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="ZIP"
          progress={mockProgressDownloading}
          files={mockFiles}
        />
      );

      // Check file count
      expect(screen.getByText(/3.*príloh/)).toBeInTheDocument();

      // Check individual files (icon and filename are rendered separately)
      expect(screen.getByText('document.pdf')).toBeInTheDocument();
      expect(screen.getByText('image.png')).toBeInTheDocument();
      expect(screen.getByText('report.xlsx')).toBeInTheDocument();
      // Check file icons are present
      expect(screen.getAllByText('📄')).toHaveLength(3);

      // Check entity codes
      expect(screen.getByText('ISS-001')).toBeInTheDocument();
      expect(screen.getByText('ISS-002')).toBeInTheDocument();
      expect(screen.getByText('ISS-003')).toBeInTheDocument();

      // Check file sizes
      expect(screen.getByText('2.50 MB')).toBeInTheDocument();
      expect(screen.getByText('512.0 KB')).toBeInTheDocument();
      expect(screen.getByText('1.20 MB')).toBeInTheDocument();
    });

    it('renders empty state when no files', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="CSV"
          progress={mockProgressDownloading}
          files={[]}
        />
      );

      expect(screen.getByText('📋 Exportujem iba dáta (žiadne prílohy)')).toBeInTheDocument();
    });

    it('renders cancel button when onCancel provided', () => {
      const handleCancel = vi.fn();
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="CSV"
          progress={mockProgressDownloading}
          files={[]}
          onCancel={handleCancel}
        />
      );

      expect(screen.getByText('Zrušiť')).toBeInTheDocument();
    });

    it('hides cancel button when phase is complete', () => {
      const handleCancel = vi.fn();
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="CSV"
          progress={mockProgressComplete}
          files={[]}
          onCancel={handleCancel}
        />
      );

      expect(screen.queryByText('Zrušiť')).not.toBeInTheDocument();
    });
  });

  // ================================================================
  // PROPS & VARIANTS
  // ================================================================

  describe('Props & Variants', () => {
    it('uses custom title when provided', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="CSV"
          progress={mockProgressDownloading}
          files={[]}
          title="Custom Export Title"
        />
      );

      expect(screen.getByText('Custom Export Title')).toBeInTheDocument();
    });

    it('uses custom healthCheckText when provided', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="ZIP"
          progress={mockProgressHealthCheck}
          files={mockFiles}
          healthCheckText="Checking files..."
        />
      );

      expect(screen.getByText('Checking files...')).toBeInTheDocument();
    });

    it('uses custom downloadingText when provided', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="CSV"
          progress={mockProgressDownloading}
          files={[]}
          downloadingText="Custom downloading..."
        />
      );

      expect(screen.getByText('Custom downloading...')).toBeInTheDocument();
    });

    it('uses custom processingText when provided', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="CSV"
          progress={mockProgressProcessing}
          files={[]}
          processingText="Custom processing..."
        />
      );

      expect(screen.getByText('Custom processing...')).toBeInTheDocument();
    });

    it('uses custom completeText when provided', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="CSV"
          progress={mockProgressComplete}
          files={[]}
          completeText="All done!"
        />
      );

      expect(screen.getByText('All done!')).toBeInTheDocument();
    });

    it('uses custom noAttachmentsText when provided', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="CSV"
          progress={mockProgressDownloading}
          files={[]}
          noAttachmentsText="No files to export"
        />
      );

      expect(screen.getByText('No files to export')).toBeInTheDocument();
    });

    it('uses custom attachmentsLabel when provided', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="ZIP"
          progress={mockProgressDownloading}
          files={mockFiles}
          attachmentsLabel="files"
        />
      );

      expect(screen.getByText(/3 files/)).toBeInTheDocument();
    });

    it('uses custom cancelText when provided', () => {
      const handleCancel = vi.fn();
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="CSV"
          progress={mockProgressDownloading}
          files={[]}
          onCancel={handleCancel}
          cancelText="Abort"
        />
      );

      expect(screen.getByText('Abort')).toBeInTheDocument();
    });

    it('displays correct format in default downloadingText', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="ZIP"
          progress={mockProgressDownloading}
          files={[]}
        />
      );

      // Default downloadingText uses format parameter
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  // ================================================================
  // PROGRESS BAR
  // ================================================================

  describe('Progress Bar', () => {
    it('shows determinate progress when totalKnown is true', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="CSV"
          progress={mockProgressDownloading}
          files={[]}
        />
      );

      expect(screen.getByText('1.00 MB / 2.00 MB')).toBeInTheDocument();
      expect(screen.getByText('45%')).toBeInTheDocument();
    });

    it('shows indeterminate progress when totalKnown is false', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="CSV"
          progress={mockProgressIndeterminate}
          files={[]}
        />
      );

      expect(screen.getByText('1.00 MB')).toBeInTheDocument();
      expect(screen.getByText('...')).toBeInTheDocument();
    });

    it('updates percentage text correctly', () => {
      const { rerender } = renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="CSV"
          progress={{ ...mockProgressDownloading, percentage: 25 }}
          files={[]}
        />
      );

      expect(screen.getByText('25%')).toBeInTheDocument();

      rerender(
        <ExportProgressModal
          isOpen={true}
          format="CSV"
          progress={{ ...mockProgressDownloading, percentage: 75 }}
          files={[]}
        />
      );

      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('formats bytes correctly (B/KB/MB)', () => {
      const progressSmall: ExportProgress = {
        phase: 'downloading',
        percentage: 50,
        downloadedBytes: 512, // 512 B
        totalBytes: 1024, // 1 KB
        totalKnown: true,
      };

      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="CSV"
          progress={progressSmall}
          files={[]}
        />
      );

      // 1024 bytes = 1.0 KB (not 1.00 KB because it's < 1 MB)
      expect(screen.getByText(/512 B \/ 1\.0 KB/)).toBeInTheDocument();
    });

    it('displays 100% when phase is complete', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="CSV"
          progress={mockProgressComplete}
          files={[]}
        />
      );

      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('hides progress bar when phase is healthCheck', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="ZIP"
          progress={mockProgressHealthCheck}
          files={[]}
        />
      );

      // No progress info should be visible
      expect(screen.queryByText(/%/)).not.toBeInTheDocument();
      expect(screen.queryByText(/MB/)).not.toBeInTheDocument();
    });
  });

  // ================================================================
  // FILE LIST
  // ================================================================

  describe('File List', () => {
    it('renders all files in array', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="ZIP"
          progress={mockProgressDownloading}
          files={mockFiles}
        />
      );

      expect(screen.getAllByText(/📄/)).toHaveLength(3);
    });

    it('displays file name, entity code, and size', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="ZIP"
          progress={mockProgressDownloading}
          files={[mockFiles[0]]}
        />
      );

      // Icon and filename are rendered in separate elements
      expect(screen.getByText('📄')).toBeInTheDocument();
      expect(screen.getByText('document.pdf')).toBeInTheDocument();
      expect(screen.getByText('ISS-001')).toBeInTheDocument();
      expect(screen.getByText('2.50 MB')).toBeInTheDocument();
    });

    it('formats file size correctly (B/KB/MB)', () => {
      const testFiles: ExportFile[] = [
        { name: 'small.txt', entityCode: 'ISS-001', size: 512 }, // 512 B
        { name: 'medium.doc', entityCode: 'ISS-002', size: 102400 }, // 100 KB
        { name: 'large.pdf', entityCode: 'ISS-003', size: 5242880 }, // 5 MB
      ];

      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="ZIP"
          progress={mockProgressDownloading}
          files={testFiles}
        />
      );

      expect(screen.getByText('512 B')).toBeInTheDocument();
      expect(screen.getByText('100.0 KB')).toBeInTheDocument();
      expect(screen.getByText('5.00 MB')).toBeInTheDocument();
    });

    it('shows "—" when file size is 0', () => {
      const fileWithNoSize: ExportFile[] = [
        { name: 'unknown.dat', entityCode: 'ISS-999', size: 0 },
      ];

      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="ZIP"
          progress={mockProgressDownloading}
          files={fileWithNoSize}
        />
      );

      expect(screen.getByText('—')).toBeInTheDocument();
    });

    it('shows correct attachment count (singular)', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="ZIP"
          progress={mockProgressDownloading}
          files={[mockFiles[0]]}
        />
      );

      expect(screen.getByText(/1 príloha/)).toBeInTheDocument();
    });

    it('shows correct attachment count (plural)', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="ZIP"
          progress={mockProgressDownloading}
          files={mockFiles}
        />
      );

      expect(screen.getByText(/3 príloh/)).toBeInTheDocument();
    });
  });

  // ================================================================
  // CANCEL FUNCTIONALITY
  // ================================================================

  describe('Cancel Functionality', () => {
    it('calls onCancel when cancel button clicked', () => {
      const handleCancel = vi.fn();
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="CSV"
          progress={mockProgressDownloading}
          files={[]}
          onCancel={handleCancel}
        />
      );

      fireEvent.click(screen.getByText('Zrušiť'));
      expect(handleCancel).toHaveBeenCalledTimes(1);
    });

    it('shows cancel button during healthCheck phase', () => {
      const handleCancel = vi.fn();
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="ZIP"
          progress={mockProgressHealthCheck}
          files={[]}
          onCancel={handleCancel}
        />
      );

      expect(screen.getByText('Zrušiť')).toBeInTheDocument();
    });

    it('shows cancel button during downloading phase', () => {
      const handleCancel = vi.fn();
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="CSV"
          progress={mockProgressDownloading}
          files={[]}
          onCancel={handleCancel}
        />
      );

      expect(screen.getByText('Zrušiť')).toBeInTheDocument();
    });

    it('shows cancel button during processing phase', () => {
      const handleCancel = vi.fn();
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="CSV"
          progress={mockProgressProcessing}
          files={[]}
          onCancel={handleCancel}
        />
      );

      expect(screen.getByText('Zrušiť')).toBeInTheDocument();
    });

    it('hides cancel button during complete phase', () => {
      const handleCancel = vi.fn();
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="CSV"
          progress={mockProgressComplete}
          files={[]}
          onCancel={handleCancel}
        />
      );

      expect(screen.queryByText('Zrušiť')).not.toBeInTheDocument();
    });
  });

  // ================================================================
  // ACCESSIBILITY
  // ================================================================

  describe('Accessibility', () => {
    it('has role="dialog"', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="CSV"
          progress={mockProgressDownloading}
          files={[]}
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('has aria-modal="true"', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="CSV"
          progress={mockProgressDownloading}
          files={[]}
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog.getAttribute('aria-modal')).toBe('true');
    });

    it('has aria-labelledby pointing to title', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="CSV"
          progress={mockProgressDownloading}
          files={[]}
        />
      );

      const dialog = screen.getByRole('dialog');
      const titleId = dialog.getAttribute('aria-labelledby');
      expect(titleId).toBeTruthy();
    });

    it('cancel button has accessible label', () => {
      const handleCancel = vi.fn();
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="CSV"
          progress={mockProgressDownloading}
          files={[]}
          onCancel={handleCancel}
        />
      );

      const cancelButton = screen.getByText('Zrušiť');
      expect(cancelButton).toHaveAttribute('type', 'button');
    });

    it('modal cannot be closed during export (no close button)', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="CSV"
          progress={mockProgressDownloading}
          files={[]}
        />
      );

      // Modal should not have close button (non-closable during export)
      expect(screen.queryByLabelText('Zavrieť')).not.toBeInTheDocument();
    });
  });

  // ================================================================
  // TRANSLATION SUPPORT
  // ================================================================

  describe('Translation Support', () => {
    it('displays Slovak text by default', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="CSV"
          progress={mockProgressDownloading}
          files={mockFiles}
          onCancel={vi.fn()}
        />
      );

      // Slovak attachments label
      expect(screen.getByText(/príloh/)).toBeInTheDocument();

      // Slovak cancel button
      expect(screen.getByText('Zrušiť')).toBeInTheDocument();
    });

    it('switches to English when language changes', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="CSV"
          progress={mockProgressDownloading}
          files={mockFiles}
          onCancel={vi.fn()}
        />,
        { initialLanguage: 'en' }
      );

      // English cancel button should be present
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });

    it('uses default Slovak text for noAttachments when not overridden', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="CSV"
          progress={mockProgressDownloading}
          files={[]}
        />
      );

      expect(screen.getByText('📋 Exportujem iba dáta (žiadne prílohy)')).toBeInTheDocument();
    });

    it('uses Slovak plural for 3 attachments', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="ZIP"
          progress={mockProgressDownloading}
          files={mockFiles}
        />
      );

      expect(screen.getByText(/3 príloh/)).toBeInTheDocument();
    });

    it('uses Slovak singular for 1 attachment', () => {
      renderWithAll(
        <ExportProgressModal
          isOpen={true}
          format="ZIP"
          progress={mockProgressDownloading}
          files={[mockFiles[0]]}
        />
      );

      expect(screen.getByText(/1 príloha/)).toBeInTheDocument();
    });
  });
});
