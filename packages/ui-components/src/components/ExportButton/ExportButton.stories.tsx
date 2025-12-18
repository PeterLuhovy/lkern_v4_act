/*
 * ================================================================
 * FILE: ExportButton.stories.tsx
 * PATH: /packages/ui-components/src/components/ExportButton/ExportButton.stories.tsx
 * DESCRIPTION: Storybook stories for ExportButton component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ExportButton } from './ExportButton';
import type { ExportFormat } from './ExportButton';

const meta: Meta<typeof ExportButton> = {
  title: 'Components/Data/ExportButton',
  component: ExportButton,
  tags: ['autodocs'],
  argTypes: {
    formats: {
      control: 'object',
      description: 'Available export formats',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Dropdown select button for exporting data in various formats (CSV, JSON, ZIP).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ExportButton>;

// ============================================================
// Basic States
// ============================================================

export const Default: Story = {
  args: {
    onExport: (format: ExportFormat) => {
      alert(`Exporting as ${format.toUpperCase()}...`);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default export button with CSV and JSON formats.',
      },
    },
  },
};

export const CSVOnly: Story = {
  args: {
    formats: ['csv'],
    onExport: (format: ExportFormat) => {
      alert(`Exporting as ${format.toUpperCase()}...`);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Export button with only CSV format available.',
      },
    },
  },
};

export const AllFormats: Story = {
  args: {
    formats: ['csv', 'json', 'zip'],
    onExport: (format: ExportFormat) => {
      alert(`Exporting as ${format.toUpperCase()}...`);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Export button with all available formats: CSV, JSON, and ZIP.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    onExport: (format: ExportFormat) => {
      alert(`Exporting as ${format.toUpperCase()}...`);
    },
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled export button (e.g., when no data to export).',
      },
    },
  },
};

export const CustomLabel: Story = {
  args: {
    onExport: (format: ExportFormat) => {
      alert(`Exporting as ${format.toUpperCase()}...`);
    },
    label: 'Download Data',
  },
  parameters: {
    docs: {
      description: {
        story: 'Export button with custom label text.',
      },
    },
  },
};

export const WithClassName: Story = {
  args: {
    onExport: (format: ExportFormat) => {
      alert(`Exporting as ${format.toUpperCase()}...`);
    },
    className: 'custom-export-button',
  },
  decorators: [
    (Story) => (
      <div>
        <style>{`
          .custom-export-button {
            border: 2px solid var(--color-brand-primary);
            background: var(--color-brand-primary);
            color: white;
            font-weight: bold;
          }
        `}</style>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Export button with custom CSS class for styling.',
      },
    },
  },
};

// ============================================================
// Usage Examples
// ============================================================

export const WithDataGrid: Story = {
  render: () => {
    const mockData = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
    ];

    const exportToCSV = () => {
      const csv = [
        ['ID', 'Name', 'Email'],
        ...mockData.map(row => [row.id, row.name, row.email])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'export.csv';
      a.click();
      URL.revokeObjectURL(url);
    };

    const exportToJSON = () => {
      const json = JSON.stringify(mockData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'export.json';
      a.click();
      URL.revokeObjectURL(url);
    };

    const handleExport = (format: ExportFormat) => {
      if (format === 'csv') {
        exportToCSV();
      } else if (format === 'json') {
        exportToJSON();
      } else if (format === 'zip') {
        alert('ZIP export not implemented in demo');
      }
    };

    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <h4>Mock Data Table</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--theme-border)' }}>
            <thead>
              <tr style={{ background: 'var(--theme-input-background)' }}>
                <th style={{ padding: '8px', border: '1px solid var(--theme-border)' }}>ID</th>
                <th style={{ padding: '8px', border: '1px solid var(--theme-border)' }}>Name</th>
                <th style={{ padding: '8px', border: '1px solid var(--theme-border)' }}>Email</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map(row => (
                <tr key={row.id}>
                  <td style={{ padding: '8px', border: '1px solid var(--theme-border)' }}>{row.id}</td>
                  <td style={{ padding: '8px', border: '1px solid var(--theme-border)' }}>{row.name}</td>
                  <td style={{ padding: '8px', border: '1px solid var(--theme-border)' }}>{row.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ExportButton
          formats={['csv', 'json', 'zip']}
          onExport={handleExport}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Example showing ExportButton with actual export functionality (CSV and JSON downloads work).',
      },
    },
  },
};

export const MultipleButtons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <ExportButton
        formats={['csv']}
        onExport={(format) => alert(`Exporting as ${format}`)}
        label="Export CSV"
      />
      <ExportButton
        formats={['json']}
        onExport={(format) => alert(`Exporting as ${format}`)}
        label="Export JSON"
      />
      <ExportButton
        formats={['zip']}
        onExport={(format) => alert(`Exporting as ${format}`)}
        label="Download All"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple export buttons with different format options.',
      },
    },
  },
};
