/*
 * ================================================================
 * FILE: FileUpload.stories.tsx
 * PATH: /packages/ui-components/src/components/FileUpload/FileUpload.stories.tsx
 * DESCRIPTION: Storybook stories for FileUpload component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FileUpload } from './FileUpload';

const meta: Meta<typeof FileUpload> = {
  title: 'Components/Forms/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  argTypes: {
    maxFiles: {
      control: 'number',
      description: 'Maximum number of files allowed',
    },
    maxSize: {
      control: 'number',
      description: 'Maximum size per file in bytes',
    },
    accept: {
      control: 'text',
      description: 'Accepted file types (MIME types or extensions)',
    },
    enablePaste: {
      control: 'boolean',
      description: 'Enable Ctrl+V paste functionality',
    },
    enableDragDrop: {
      control: 'boolean',
      description: 'Enable drag and drop functionality',
    },
    showHint: {
      control: 'boolean',
      description: 'Show file size limit hint',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Reusable file upload component with click, drag & drop, and paste (Ctrl+V) support. Features hard limit for paste (won\'t add if at max) and soft limit for drag & drop/click (adds all, parent can disable submit).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

// ============================================================
// Basic Variants
// ============================================================

export const Default: Story = {
  render: function Render() {
    const [files, setFiles] = useState<File[]>([]);
    return <FileUpload value={files} onChange={setFiles} />;
  },
};

export const WithError: Story = {
  render: function Render() {
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string>('');

    return (
      <FileUpload
        value={files}
        onChange={setFiles}
        error={error}
        onError={setError}
      />
    );
  },
};

export const CustomMaxFiles: Story = {
  render: function Render() {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <FileUpload
        value={files}
        onChange={setFiles}
        maxFiles={3}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'File upload with custom max files limit (3 files).',
      },
    },
  },
};

export const CustomMaxSize: Story = {
  render: function Render() {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <FileUpload
        value={files}
        onChange={setFiles}
        maxSize={5 * 1024 * 1024} // 5MB
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'File upload with custom max size (5MB per file).',
      },
    },
  },
};

export const ImagesOnly: Story = {
  render: function Render() {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <FileUpload
        value={files}
        onChange={setFiles}
        accept="image/*"
        dropzoneText="Click or drag images here"
        dropzoneHint="Only image files are accepted"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'File upload that only accepts image files.',
      },
    },
  },
};

export const PDFOnly: Story = {
  render: function Render() {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <FileUpload
        value={files}
        onChange={setFiles}
        accept=".pdf"
        dropzoneText="Click or drag PDF documents"
        dropzoneHint="Only PDF files are accepted"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'File upload that only accepts PDF files.',
      },
    },
  },
};

export const WithoutDragDrop: Story = {
  render: function Render() {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <FileUpload
        value={files}
        onChange={setFiles}
        enableDragDrop={false}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'File upload without drag & drop support (click only).',
      },
    },
  },
};

export const WithoutPaste: Story = {
  render: function Render() {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <FileUpload
        value={files}
        onChange={setFiles}
        enablePaste={false}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'File upload without Ctrl+V paste support.',
      },
    },
  },
};

export const WithoutHint: Story = {
  render: function Render() {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <FileUpload
        value={files}
        onChange={setFiles}
        showHint={false}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'File upload without file size hint.',
      },
    },
  },
};

// ============================================================
// Advanced Features
// ============================================================

export const WithLimitExceededCallback: Story = {
  render: function Render() {
    const [files, setFiles] = useState<File[]>([]);
    const [isOverLimit, setIsOverLimit] = useState(false);

    return (
      <div>
        <FileUpload
          value={files}
          onChange={setFiles}
          maxFiles={3}
          onFileLimitExceeded={setIsOverLimit}
        />
        <div style={{ marginTop: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
          <strong>Submit button status:</strong> {isOverLimit ? <><span role="img" aria-label="cross">❌</span> Disabled</> : <><span role="img" aria-label="checkmark">✅</span> Enabled</>}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates onFileLimitExceeded callback - parent can disable submit button when too many files.',
      },
    },
  },
};

export const WithPasteLimitCallback: Story = {
  render: function Render() {
    const [files, setFiles] = useState<File[]>([]);
    const [toastMessage, setToastMessage] = useState<string>('');

    const handlePasteLimitReached = () => {
      setToastMessage('Cannot paste - maximum file limit reached!');
      setTimeout(() => setToastMessage(''), 3000);
    };

    return (
      <div>
        <FileUpload
          value={files}
          onChange={setFiles}
          maxFiles={3}
          onPasteLimitReached={handlePasteLimitReached}
        />
        {toastMessage && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: '#fff3cd',
            borderRadius: '4px',
            border: '1px solid #ffc107',
            color: '#856404',
          }}>
            <span role="img" aria-label="warning">⚠️</span> {toastMessage}
          </div>
        )}
        <div style={{ marginTop: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
          <strong>Tip:</strong> Try pasting an image (Ctrl+V) when at max files limit
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates onPasteLimitReached callback - shows toast notification when paste is blocked.',
      },
    },
  },
};

export const CompleteExample: Story = {
  render: function Render() {
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string>('');
    const [isOverLimit, setIsOverLimit] = useState(false);
    const [toastMessage, setToastMessage] = useState<string>('');

    const handlePasteLimitReached = () => {
      setToastMessage('Cannot paste - maximum 5 files allowed!');
      setTimeout(() => setToastMessage(''), 3000);
    };

    const handleSubmit = () => {
      if (files.length === 0) {
        setError('Please attach at least one file');
        return;
      }
      if (isOverLimit) {
        alert('Cannot submit - too many files!');
        return;
      }
      alert(`Submitting ${files.length} file(s)!`);
    };

    return (
      <div style={{ maxWidth: '600px' }}>
        <FileUpload
          value={files}
          onChange={(newFiles) => {
            setFiles(newFiles);
            setError('');
          }}
          error={error}
          onError={setError}
          maxFiles={5}
          onFileLimitExceeded={setIsOverLimit}
          onPasteLimitReached={handlePasteLimitReached}
        />

        {toastMessage && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: '#fff3cd',
            borderRadius: '4px',
            border: '1px solid #ffc107',
            color: '#856404',
          }}>
            <span role="img" aria-label="warning">⚠️</span> {toastMessage}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isOverLimit}
          style={{
            marginTop: '16px',
            padding: '10px 20px',
            background: isOverLimit ? '#ccc' : '#9c27b0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isOverLimit ? 'not-allowed' : 'pointer',
          }}
        >
          Submit Files
        </button>

        <div style={{ marginTop: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
          <strong>Features:</strong>
          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
            <li><span role="img" aria-label="paperclip">📎</span> Click or drag & drop files</li>
            <li><span role="img" aria-label="clipboard">📋</span> Paste images with Ctrl+V</li>
            <li><span role="img" aria-label="no entry">🚫</span> Hard limit for paste (blocks when at max)</li>
            <li><span role="img" aria-label="warning">⚠️</span> Soft limit for drag & drop (adds all, disables submit)</li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete example with all features: validation, limits, callbacks, and submit button.',
      },
    },
  },
};
