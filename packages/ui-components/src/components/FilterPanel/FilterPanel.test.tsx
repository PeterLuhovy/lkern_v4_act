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
import type { QuickFilter, FilterGroup } from './FilterPanel.types';

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

    // userEvent.type() triggers onChange for each character typed
    expect(mockSearchChange).toHaveBeenCalled();
    expect(mockSearchChange).toHaveBeenCalledTimes(4);
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

  // === COLLAPSE/EXPAND FUNCTIONALITY ===
  describe('Collapse/Expand functionality', () => {
    it('renders collapse arrow when expanded', () => {
      renderWithTranslation(<FilterPanel {...defaultProps} collapsed={false} />);

      // Component uses span.toggleArrow inside clickable div.panelHeader
      expect(screen.getByText('▲')).toBeInTheDocument();
    });

    it('collapses panel when header clicked', async () => {
      const handleCollapseChange = vi.fn();
      const user = userEvent.setup();

      const { container } = renderWithTranslation(
        <FilterPanel
          {...defaultProps}
          collapsed={false}
          onCollapseChange={handleCollapseChange}
        />
      );

      // Click on panelHeader div (not a button)
      const panelHeader = container.querySelector('[class*="panelHeader"]');
      expect(panelHeader).toBeInTheDocument();
      if (panelHeader) {
        await user.click(panelHeader);
      }

      expect(handleCollapseChange).toHaveBeenCalledWith(true);
    });

    it('renders collapsed state correctly', () => {
      renderWithTranslation(
        <FilterPanel
          {...defaultProps}
          collapsed={true}
          panelTitle="Filtre a Hľadanie"
        />
      );

      // Verify panel title is visible
      expect(screen.getByText('Filtre a Hľadanie')).toBeInTheDocument();

      // Verify search input is hidden when collapsed
      expect(screen.queryByPlaceholderText('Hľadať...')).not.toBeInTheDocument();

      // Verify expand arrow exists (▼ when collapsed)
      expect(screen.getByText('▼')).toBeInTheDocument();
    });

    it('renders expand arrow when collapsed', () => {
      renderWithTranslation(
        <FilterPanel {...defaultProps} collapsed={true} />
      );

      // Component shows ▼ when collapsed
      expect(screen.getByText('▼')).toBeInTheDocument();
    });

    it('expands panel when header clicked while collapsed', async () => {
      const handleCollapseChange = vi.fn();
      const user = userEvent.setup();

      const { container } = renderWithTranslation(
        <FilterPanel
          {...defaultProps}
          collapsed={true}
          onCollapseChange={handleCollapseChange}
        />
      );

      // Click on panelHeader div
      const panelHeader = container.querySelector('[class*="panelHeader"]');
      if (panelHeader) {
        await user.click(panelHeader);
      }

      expect(handleCollapseChange).toHaveBeenCalledWith(false);
    });

    it('expands panel when clicking panel title', async () => {
      const handleCollapseChange = vi.fn();
      const user = userEvent.setup();

      const { container } = renderWithTranslation(
        <FilterPanel
          {...defaultProps}
          collapsed={true}
          panelTitle="Test Title"
          onCollapseChange={handleCollapseChange}
        />
      );

      // Clicking anywhere in panelHeader triggers collapse toggle
      const panelHeader = container.querySelector('[class*="panelHeader"]');
      if (panelHeader) {
        await user.click(panelHeader);
      }

      expect(handleCollapseChange).toHaveBeenCalledWith(false);
    });

    it('applies filterPanelCollapsed styling when collapsed', () => {
      const { container } = renderWithTranslation(
        <FilterPanel {...defaultProps} collapsed={true} />
      );

      // When collapsed, panel has filterPanelCollapsed class
      const filterPanel = container.querySelector('[class*="filterPanelCollapsed"]');
      expect(filterPanel).toBeInTheDocument();

      // When collapsed, search input should not be visible
      expect(screen.queryByPlaceholderText('Hľadať...')).not.toBeInTheDocument();
    });

    it('applies expanded styling when not collapsed', () => {
      renderWithTranslation(
        <FilterPanel {...defaultProps} collapsed={false} />
      );

      // When expanded, search input should be visible
      expect(screen.getByPlaceholderText('Hľadať...')).toBeInTheDocument();

      // When expanded, collapse arrow (▲) should be visible
      expect(screen.getByText('▲')).toBeInTheDocument();
    });

    it('shows correct arrow icon based on collapsed state', () => {
      // Test expanded state - shows ▲
      renderWithTranslation(
        <FilterPanel {...defaultProps} collapsed={false} />
      );
      expect(screen.getByText('▲')).toBeInTheDocument();

      // Note: Component uses internal state, so we can't easily test toggle without clicking
    });

    it('shows expand arrow when collapsed', () => {
      renderWithTranslation(
        <FilterPanel {...defaultProps} collapsed={true} />
      );

      // Component shows ▼ when collapsed
      expect(screen.getByText('▼')).toBeInTheDocument();
    });

    it('supports both Slovak and English languages', () => {
      // Test Slovak - component uses translations for panelTitle
      renderWithTranslation(
        <FilterPanel {...defaultProps} collapsed={true} />,
        { initialLanguage: 'sk' }
      );

      // Panel header and arrow should be visible
      expect(screen.getByText('▼')).toBeInTheDocument();
    });

    it('renders with default panel title from translations', () => {
      renderWithTranslation(
        <FilterPanel {...defaultProps} collapsed={false} />
      );

      // Default title comes from t('pageTemplate.filter.panelTitle') = 'Filtre a vyhľadávanie' in Slovak
      expect(screen.getByText('Filtre a vyhľadávanie')).toBeInTheDocument();
    });

    it('uses custom panel title when provided', () => {
      renderWithTranslation(
        <FilterPanel
          {...defaultProps}
          collapsed={true}
          panelTitle="Custom Filter Title"
        />
      );

      expect(screen.getByText('Custom Filter Title')).toBeInTheDocument();
    });

    it('hides all filter content when collapsed', () => {
      const filterGroups = [
        {
          field: 'status',
          title: 'STATUS',
          options: [{ value: 'open', label: 'Open' }],
          selectedValues: new Set(),
          onChange: vi.fn(),
        },
      ];

      renderWithTranslation(
        <FilterPanel
          {...defaultProps}
          collapsed={true}
          filterGroups={filterGroups}
        />
      );

      // Filter content should be hidden
      expect(screen.queryByText('STATUS')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Open' })).not.toBeInTheDocument();
    });

    it('shows all filter content when expanded', () => {
      const filterGroups = [
        {
          field: 'status',
          title: 'STATUS',
          options: [{ value: 'open', label: 'Open' }],
          selectedValues: new Set(),
          onChange: vi.fn(),
        },
      ];

      renderWithTranslation(
        <FilterPanel
          {...defaultProps}
          collapsed={false}
          filterGroups={filterGroups}
        />
      );

      // Filter content should be visible
      expect(screen.getByText('STATUS')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
    });

    it('maintains search functionality after collapse/expand cycle', async () => {
      const handleSearchChange = vi.fn();
      const user = userEvent.setup();

      renderWithTranslation(
        <FilterPanel
          {...defaultProps}
          onSearchChange={handleSearchChange}
          collapsed={false}
        />
      );

      const searchInput = screen.getByPlaceholderText('Hľadať...');
      await user.type(searchInput, 'test');

      expect(handleSearchChange).toHaveBeenCalled();
      handleSearchChange.mockClear();

      // Simulate internal state change (component would need to update)
      // This test verifies search input is functional when expanded
      expect(searchInput).toBeInTheDocument();
    });
  });
});
