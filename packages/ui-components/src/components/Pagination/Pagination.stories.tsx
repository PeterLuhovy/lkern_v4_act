/*
 * ================================================================
 * FILE: Pagination.stories.tsx
 * PATH: /packages/ui-components/src/components/Pagination/Pagination.stories.tsx
 * DESCRIPTION: Storybook stories for Pagination component
 * VERSION: v1.0.0
 * UPDATED: 2025-12-16
 * ================================================================
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Data/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: 'number',
      description: 'Current page number (1-indexed)',
    },
    totalPages: {
      control: 'number',
      description: 'Total number of pages',
    },
    totalItems: {
      control: 'number',
      description: 'Total number of items',
    },
    itemsPerPage: {
      control: 'number',
      description: 'Items per page',
    },
    enabled: {
      control: 'boolean',
      description: 'Enable pagination',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Pagination component with page numbers and record count. Shows up to 5 page numbers at a time.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

// ============================================================
// Basic States
// ============================================================

export const Default: Story = {
  render: function Render() {
    const [currentPage, setCurrentPage] = useState(1);

    return (
      <Pagination
        currentPage={currentPage}
        totalPages={10}
        totalItems={200}
        itemsPerPage={20}
        onPageChange={setCurrentPage}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Default pagination with 10 pages and 200 items total.',
      },
    },
  },
};

export const FewPages: Story = {
  render: function Render() {
    const [currentPage, setCurrentPage] = useState(1);

    return (
      <Pagination
        currentPage={currentPage}
        totalPages={3}
        totalItems={60}
        itemsPerPage={20}
        onPageChange={setCurrentPage}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination with only 3 pages - all page numbers are shown.',
      },
    },
  },
};

export const ManyPages: Story = {
  render: function Render() {
    const [currentPage, setCurrentPage] = useState(10);

    return (
      <Pagination
        currentPage={currentPage}
        totalPages={50}
        totalItems={1000}
        itemsPerPage={20}
        onPageChange={setCurrentPage}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination with 50 pages - shows 5 page numbers around current page.',
      },
    },
  },
};

export const FirstPage: Story = {
  render: function Render() {
    const [currentPage, setCurrentPage] = useState(1);

    return (
      <Pagination
        currentPage={currentPage}
        totalPages={20}
        totalItems={400}
        itemsPerPage={20}
        onPageChange={setCurrentPage}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'First page - previous button is disabled.',
      },
    },
  },
};

export const LastPage: Story = {
  render: function Render() {
    const [currentPage, setCurrentPage] = useState(20);

    return (
      <Pagination
        currentPage={currentPage}
        totalPages={20}
        totalItems={400}
        itemsPerPage={20}
        onPageChange={setCurrentPage}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Last page - next button is disabled.',
      },
    },
  },
};

export const SinglePage: Story = {
  render: function Render() {
    const [currentPage, setCurrentPage] = useState(1);

    return (
      <Pagination
        currentPage={currentPage}
        totalPages={1}
        totalItems={15}
        itemsPerPage={20}
        onPageChange={setCurrentPage}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Single page - both navigation buttons are disabled.',
      },
    },
  },
};

export const WithToggle: Story = {
  render: function Render() {
    const [currentPage, setCurrentPage] = useState(1);
    const [enabled, setEnabled] = useState(true);

    return (
      <Pagination
        currentPage={currentPage}
        totalPages={10}
        totalItems={200}
        itemsPerPage={20}
        onPageChange={setCurrentPage}
        enabled={enabled}
        onEnabledChange={setEnabled}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination with enable/disable toggle. When disabled, shows all items on page 1.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    totalItems: 200,
    itemsPerPage: 20,
    onPageChange: () => {},
    enabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled pagination state - all controls are disabled.',
      },
    },
  },
};

export const SmallItemsPerPage: Story = {
  render: function Render() {
    const [currentPage, setCurrentPage] = useState(1);

    return (
      <Pagination
        currentPage={currentPage}
        totalPages={40}
        totalItems={200}
        itemsPerPage={5}
        onPageChange={setCurrentPage}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination with 5 items per page - results in more pages.',
      },
    },
  },
};

export const LargeItemsPerPage: Story = {
  render: function Render() {
    const [currentPage, setCurrentPage] = useState(1);

    return (
      <Pagination
        currentPage={currentPage}
        totalPages={2}
        totalItems={200}
        itemsPerPage={100}
        onPageChange={setCurrentPage}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination with 100 items per page - results in fewer pages.',
      },
    },
  },
};

// ============================================================
// Interactive Demo
// ============================================================

export const InteractiveDemo: Story = {
  render: function Render() {
    const [currentPage, setCurrentPage] = useState(1);
    const [enabled, setEnabled] = useState(true);
    const totalPages = 15;
    const totalItems = 300;
    const itemsPerPage = 20;

    const startItem = enabled ? (currentPage - 1) * itemsPerPage + 1 : 1;
    const endItem = enabled ? Math.min(currentPage * itemsPerPage, totalItems) : totalItems;

    return (
      <div>
        <div style={{
          padding: '20px',
          marginBottom: '20px',
          background: 'var(--theme-input-background)',
          borderRadius: '8px',
          border: '2px solid var(--theme-input-border)',
        }}>
          <h3 style={{ marginTop: 0 }}>Current State:</h3>
          <p><strong>Page:</strong> {enabled ? currentPage : 1} of {enabled ? totalPages : 1}</p>
          <p><strong>Items Shown:</strong> {startItem}-{endItem} of {totalItems}</p>
          <p><strong>Pagination Enabled:</strong> {enabled ? 'Yes' : 'No'}</p>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          enabled={enabled}
          onEnabledChange={setEnabled}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showing current pagination state.',
      },
    },
  },
};
