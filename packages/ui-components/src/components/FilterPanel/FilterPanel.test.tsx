/**
 * @file FilterPanel.test.tsx
 * @package @l-kern/ui-components
 * @description Unit tests for FilterPanel component
 * @version 1.0.0
 * @date 2025-11-06
 */

import { describe, it, expect, vi } from 'vitest';
import { renderWithTranslation, screen, userEvent } from '../../test-utils';
import { FilterPanel } from './FilterPanel';
import type { QuickFilter, FilterGroup } from '../../types/FilterPanel';

describe('FilterPanel', () => {
  const mockSearchChange = vi.fn();
  const mockItemsPerPageChange = vi.fn();
  const mockNewItem = vi.fn();
  const mockShowInactiveChange = vi.fn();

  const defaultProps = {
    searchQuery: '',
    onSearchChange: mockSearchChange,
    resultCount: 10,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // === RENDERING TESTS ===
  it('renders search input with placeholder', () => {
    renderWithTranslation(<FilterPanel {...defaultProps} searchPlaceholder="Search orders..." />);
    expect(screen.getByPlaceholderText('Search orders...')).toBeInTheDocument();
  });

  it('renders search input with default placeholder from translations', () => {
    renderWithTranslation(<FilterPanel {...defaultProps} />);
    expect(screen.getByPlaceholderText('Hľadať...')).toBeInTheDocument();
  });

  it('renders quick filters when provided', () => {
    const quickFilters: QuickFilter[] = [
      { id: 'active', label: 'Active', active: true, onClick: vi.fn() },
      { id: 'inactive', label: 'Inactive', active: false, onClick: vi.fn() },
    ];
    renderWithTranslation(<FilterPanel {...defaultProps} quickFilters={quickFilters} />);

    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('renders filter groups in button mode', () => {
    const filterGroups: FilterGroup[] = [
      {
        field: 'status',
        title: 'STATUS',
        options: [
          { value: 'open', label: 'Open' },
          { value: 'closed', label: 'Closed' },
        ],
        selectedValues: new Set(['open']),
        onChange: vi.fn(),
      },
    ];
    renderWithTranslation(<FilterPanel {...defaultProps} filterGroups={filterGroups} />);

    expect(screen.getByText('STATUS')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Closed' })).toBeInTheDocument();
  });

  it('renders filter groups in checkbox mode', () => {
    const filterGroups: FilterGroup[] = [
      {
        field: 'priority',
        title: 'PRIORITY',
        options: [
          { value: 'high', label: 'High' },
          { value: 'low', label: 'Low' },
        ],
        selectedValues: new Set(),
        onChange: vi.fn(),
      },
    ];
    renderWithTranslation(
      <FilterPanel {...defaultProps} filterGroups={filterGroups} useCheckboxes />
    );

    expect(screen.getByText('PRIORITY')).toBeInTheDocument();
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
  });

  it('renders items per page selector with default value', () => {
    renderWithTranslation(
      <FilterPanel {...defaultProps} itemsPerPage={20} onItemsPerPageChange={mockItemsPerPageChange} />
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('20');
  });

  it('renders new item button when onNewItem provided', () => {
    renderWithTranslation(
      <FilterPanel {...defaultProps} onNewItem={mockNewItem} newItemText="➕ New Order" />
    );

    expect(screen.getByRole('button', { name: '➕ New Order' })).toBeInTheDocument();
  });

  it('does not render new item button when onNewItem not provided', () => {
    renderWithTranslation(<FilterPanel {...defaultProps} />);

    expect(screen.queryByText('Nová položka')).not.toBeInTheDocument();
  });

  it('renders result count with filtered and total', () => {
    renderWithTranslation(<FilterPanel {...defaultProps} resultCount={5} totalCount={10} />);

    expect(screen.getByText(/5\/10/)).toBeInTheDocument();
  });

  it('renders result count with only filtered when total not provided', () => {
    renderWithTranslation(<FilterPanel {...defaultProps} resultCount={8} />);

    expect(screen.getByText(/8\/8/)).toBeInTheDocument();
  });

  it('renders show inactive checkbox when onShowInactiveChange provided', () => {
    renderWithTranslation(
      <FilterPanel
        {...defaultProps}
        showInactive={false}
        onShowInactiveChange={mockShowInactiveChange}
      />
    );

    expect(screen.getByLabelText('Zobraziť neaktívne')).toBeInTheDocument();
  });

  it('renders custom children', () => {
    renderWithTranslation(
      <FilterPanel {...defaultProps}>
        <div data-testid="custom-content">Custom Filter</div>
      </FilterPanel>
    );

    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
  });

  // === INTERACTION TESTS ===
  it('calls onSearchChange when typing in search input', async () => {
    const user = userEvent.setup();
    renderWithTranslation(<FilterPanel {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Hľadať...');
    await user.type(searchInput, 'test');

    expect(mockSearchChange).toHaveBeenCalledTimes(4); // 't', 'e', 's', 't'
    expect(mockSearchChange).toHaveBeenLastCalledWith('test');
  });

  it('calls quick filter onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    const quickFilters: QuickFilter[] = [
      { id: 'active', label: 'Active', active: false, onClick: handleClick },
    ];

    renderWithTranslation(<FilterPanel {...defaultProps} quickFilters={quickFilters} />);
    await user.click(screen.getByText('Active'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('calls filter group onChange when button clicked', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    const filterGroups: FilterGroup[] = [
      {
        field: 'status',
        title: 'STATUS',
        options: [{ value: 'open', label: 'Open' }],
        selectedValues: new Set(),
        onChange: handleChange,
      },
    ];

    renderWithTranslation(<FilterPanel {...defaultProps} filterGroups={filterGroups} />);
    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(handleChange).toHaveBeenCalledWith('open');
  });

  it('calls filter group onChange when checkbox toggled', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    const filterGroups: FilterGroup[] = [
      {
        field: 'priority',
        title: 'PRIORITY',
        options: [{ value: 'high', label: 'High' }],
        selectedValues: new Set(),
        onChange: handleChange,
      },
    ];

    renderWithTranslation(
      <FilterPanel {...defaultProps} filterGroups={filterGroups} useCheckboxes />
    );

    const checkbox = screen.getByRole('checkbox', { name: 'High' });
    await user.click(checkbox);

    expect(handleChange).toHaveBeenCalledWith('high');
  });

  it('calls onItemsPerPageChange when select value changes', async () => {
    const user = userEvent.setup();
    renderWithTranslation(
      <FilterPanel {...defaultProps} itemsPerPage={20} onItemsPerPageChange={mockItemsPerPageChange} />
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '50');

    expect(mockItemsPerPageChange).toHaveBeenCalledWith(50);
  });

  it('calls onNewItem when new item button clicked', async () => {
    const user = userEvent.setup();
    renderWithTranslation(<FilterPanel {...defaultProps} onNewItem={mockNewItem} />);

    await user.click(screen.getByRole('button', { name: 'Nová položka' }));

    expect(mockNewItem).toHaveBeenCalledTimes(1);
  });

  it('calls onShowInactiveChange when show inactive checkbox toggled', async () => {
    const user = userEvent.setup();
    renderWithTranslation(
      <FilterPanel
        {...defaultProps}
        showInactive={false}
        onShowInactiveChange={mockShowInactiveChange}
      />
    );

    await user.click(screen.getByLabelText('Zobraziť neaktívne'));

    expect(mockShowInactiveChange).toHaveBeenCalledWith(true);
  });

  // === STYLING TESTS ===
  it('applies active class to active quick filter', () => {
    const quickFilters: QuickFilter[] = [
      { id: 'active', label: 'Active', active: true, onClick: vi.fn() },
    ];
    renderWithTranslation(<FilterPanel {...defaultProps} quickFilters={quickFilters} />);

    const button = screen.getByText('Active');
    expect(button.className).toContain('quickFilterActive');
  });

  it('applies clear-all class to clear-all quick filter', () => {
    const quickFilters: QuickFilter[] = [
      { id: 'clear-all', label: 'Clear All', active: false, onClick: vi.fn() },
    ];
    renderWithTranslation(<FilterPanel {...defaultProps} quickFilters={quickFilters} />);

    const button = screen.getByText('Clear All');
    expect(button.className).toContain('quickFilterClearAll');
  });

  it('applies active class to selected filter option', () => {
    const filterGroups: FilterGroup[] = [
      {
        field: 'status',
        title: 'STATUS',
        options: [{ value: 'open', label: 'Open' }],
        selectedValues: new Set(['open']),
        onChange: vi.fn(),
      },
    ];
    renderWithTranslation(<FilterPanel {...defaultProps} filterGroups={filterGroups} />);

    const button = screen.getByRole('button', { name: 'Open' });
    expect(button.className).toContain('optionActive');
  });

  // === EDGE CASES ===
  it('renders with minimal props', () => {
    renderWithTranslation(
      <FilterPanel searchQuery="" onSearchChange={vi.fn()} resultCount={0} />
    );

    expect(screen.getByPlaceholderText('Hľadať...')).toBeInTheDocument();
    expect(screen.getByText(/0\/0/)).toBeInTheDocument();
  });

  it('handles empty filter groups array', () => {
    renderWithTranslation(<FilterPanel {...defaultProps} filterGroups={[]} />);

    expect(screen.queryByRole('button', { name: /Open|Closed/i })).not.toBeInTheDocument();
  });

  it('handles empty quick filters array', () => {
    renderWithTranslation(<FilterPanel {...defaultProps} quickFilters={[]} />);

    expect(screen.queryByText(/Active|Inactive/i)).not.toBeInTheDocument();
  });
});
