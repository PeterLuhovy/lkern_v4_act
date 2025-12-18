/*
 * ================================================================
 * FILE: ExportProgressModal.stories.tsx
 * PATH: /packages/ui-components/src/components/ExportProgressModal/ExportProgressModal.stories.tsx
 * DESCRIPTION: Storybook stories for ExportProgressModal component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ExportProgressModal, ExportProgress, ExportFile } from './ExportProgressModal';

const meta: Meta<typeof ExportProgressModal> = {
  title: 'Components/Modals/ExportProgressModal',
  component: ExportProgressModal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls modal visibility',
    },
    format: {
      control: 'text',
      description: 'Export format (CSV, JSON, ZIP)',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Reusable export progress modal for serviceWorkflow downloads. Shows progress bar, file list, and status.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ExportProgressModal>;

// ============================================================
// Sample Data
// ============================================================

const sampleFiles: ExportFile[] = [
  {
    name: 'screenshot-2025-12-16.png',
    entityCode: 'LKMS-123',
    size: 1024 * 512, // 512 KB
  },
  {
    name: 'error-log.txt',
    entityCode: 'LKMS-124',
    size: 1024 * 8, // 8 KB
  },
  {
    name: 'diagram.pdf',
    entityCode: 'LKMS-125',
    size: 1024 * 1024 * 2.5, // 2.5 MB
  },
];

// ============================================================
// Progress Phases
// ============================================================

export const HealthCheck: Story = {
  args: {
    isOpen: true,
    format: 'ZIP',
    progress: {
      phase: 'healthCheck',
      percentage: 0,
      downloadedBytes: 0,
      totalBytes: 0,
      totalKnown: false,
    },
    files: sampleFiles,
  },
  parameters: {
    docs: {
      description: {
        story: 'Health check phase - checking if backend service is available.',
      },
    },
  },
};

export const DownloadingDeterminate: Story = {
  args: {
    isOpen: true,
    format: 'ZIP',
    progress: {
      phase: 'downloading',
      percentage: 45,
      downloadedBytes: 1024 * 1024 * 1.5, // 1.5 MB
      totalBytes: 1024 * 1024 * 3.5, // 3.5 MB
      totalKnown: true,
    },
    files: sampleFiles,
  },
  parameters: {
    docs: {
      description: {
        story: 'Downloading phase with known total size - shows percentage and progress bar.',
      },
    },
  },
};

export const DownloadingIndeterminate: Story = {
  args: {
    isOpen: true,
    format: 'ZIP',
    progress: {
      phase: 'downloading',
      percentage: 0,
      downloadedBytes: 1024 * 1024 * 1.2, // 1.2 MB
      totalBytes: 0,
      totalKnown: false,
    },
    files: sampleFiles,
  },
  parameters: {
    docs: {
      description: {
        story: 'Downloading phase with unknown total size - shows indeterminate progress bar animation.',
      },
    },
  },
};

export const Processing: Story = {
  args: {
    isOpen: true,
    format: 'ZIP',
    progress: {
      phase: 'processing',
      percentage: 100,
      downloadedBytes: 1024 * 1024 * 3.5,
      totalBytes: 1024 * 1024 * 3.5,
      totalKnown: true,
    },
    files: sampleFiles,
  },
  parameters: {
    docs: {
      description: {
        story: 'Processing phase - download complete, processing ZIP file.',
      },
    },
  },
};

export const Complete: Story = {
  args: {
    isOpen: true,
    format: 'ZIP',
    progress: {
      phase: 'complete',
      percentage: 100,
      downloadedBytes: 1024 * 1024 * 3.5,
      totalBytes: 1024 * 1024 * 3.5,
      totalKnown: true,
    },
    files: sampleFiles,
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete phase - export finished, file saved to disk.',
      },
    },
  },
};

// ============================================================
// Different Formats
// ============================================================

export const CSVExport: Story = {
  args: {
    isOpen: true,
    format: 'CSV',
    progress: {
      phase: 'downloading',
      percentage: 60,
      downloadedBytes: 1024 * 50,
      totalBytes: 1024 * 80,
      totalKnown: true,
    },
    files: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'CSV export - no attachments, only data.',
      },
    },
  },
};

export const JSONExport: Story = {
  args: {
    isOpen: true,
    format: 'JSON',
    progress: {
      phase: 'downloading',
      percentage: 35,
      downloadedBytes: 1024 * 120,
      totalBytes: 1024 * 350,
      totalKnown: true,
    },
    files: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'JSON export - no attachments, only data.',
      },
    },
  },
};

export const ZIPWithManyFiles: Story = {
  args: {
    isOpen: true,
    format: 'ZIP',
    progress: {
      phase: 'downloading',
      percentage: 25,
      downloadedBytes: 1024 * 1024 * 5,
      totalBytes: 1024 * 1024 * 20,
      totalKnown: true,
    },
    files: [
      { name: 'screenshot1.png', entityCode: 'LKMS-100', size: 1024 * 512 },
      { name: 'screenshot2.png', entityCode: 'LKMS-101', size: 1024 * 480 },
      { name: 'error-log.txt', entityCode: 'LKMS-102', size: 1024 * 12 },
      { name: 'video-demo.mp4', entityCode: 'LKMS-103', size: 1024 * 1024 * 8 },
      { name: 'document.pdf', entityCode: 'LKMS-104', size: 1024 * 1024 * 3 },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'ZIP export with many files - shows scrollable file list.',
      },
    },
  },
};

// ============================================================
// With Cancel Button
// ============================================================

export const WithCancel: Story = {
  args: {
    isOpen: true,
    format: 'ZIP',
    progress: {
      phase: 'downloading',
      percentage: 30,
      downloadedBytes: 1024 * 1024,
      totalBytes: 1024 * 1024 * 3.5,
      totalKnown: true,
    },
    files: sampleFiles,
    onCancel: () => console.log('Export cancelled'),
  },
  parameters: {
    docs: {
      description: {
        story: 'With cancel button - allows user to abort download.',
      },
    },
  },
};

// ============================================================
// Edge Cases
// ============================================================

export const NoAttachments: Story = {
  args: {
    isOpen: true,
    format: 'CSV',
    progress: {
      phase: 'downloading',
      percentage: 80,
      downloadedBytes: 1024 * 40,
      totalBytes: 1024 * 50,
      totalKnown: true,
    },
    files: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'No attachments - shows message instead of file list.',
      },
    },
  },
};

export const LargeFile: Story = {
  args: {
    isOpen: true,
    format: 'ZIP',
    progress: {
      phase: 'downloading',
      percentage: 15,
      downloadedBytes: 1024 * 1024 * 50,
      totalBytes: 1024 * 1024 * 350,
      totalKnown: true,
    },
    files: [
      {
        name: 'large-video.mp4',
        entityCode: 'LKMS-999',
        size: 1024 * 1024 * 350, // 350 MB
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Large file download - progress updates more slowly.',
      },
    },
  },
};

// ============================================================
// Gallery
// ============================================================

export const ProgressPhases: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
      <h3>Export Progress Phases</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center' }}>
        <div style={{ padding: '16px', border: '2px solid #3366cc', borderRadius: '8px', textAlign: 'center', minWidth: '150px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>1. Health Check</div>
          <div style={{ fontSize: '14px' }}>Verify backend availability</div>
        </div>
        <div style={{ fontSize: '24px', color: '#3366cc' }}>→</div>
        <div style={{ padding: '16px', border: '2px solid #3366cc', borderRadius: '8px', textAlign: 'center', minWidth: '150px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>2. Downloading</div>
          <div style={{ fontSize: '14px' }}>Stream file data</div>
        </div>
        <div style={{ fontSize: '24px', color: '#3366cc' }}>→</div>
        <div style={{ padding: '16px', border: '2px solid #3366cc', borderRadius: '8px', textAlign: 'center', minWidth: '150px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>3. Processing</div>
          <div style={{ fontSize: '14px' }}>Prepare final file</div>
        </div>
        <div style={{ fontSize: '24px', color: '#3366cc' }}>→</div>
        <div style={{ padding: '16px', border: '2px solid #4CAF50', borderRadius: '8px', textAlign: 'center', minWidth: '150px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>4. Complete</div>
          <div style={{ fontSize: '14px' }}>File saved to disk</div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Four-phase export workflow with serviceWorkflow integration.',
      },
    },
  },
};

export const Features: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
      <h3>ExportProgressModal Features</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4>📊 Progress Bar</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Determinate (with total) or indeterminate (unknown size).</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4>📎 File List</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Shows all files being exported with sizes.</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4>⚙️ serviceWorkflow</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Integrates with serviceWorkflow onProgress callback.</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4>🚫 Cancellable</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>Optional cancel button to abort download.</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'ExportProgressModal key features overview.',
      },
    },
  },
};
