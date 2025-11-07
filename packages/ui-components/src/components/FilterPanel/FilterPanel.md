# ================================================================
# FilterPanel Component Documentation
# ================================================================
# File: L:\system\lkern_codebase_v4_act\packages\ui-components\src\components\FilterPanel\FilterPanel.md
# Version: 1.0.0
# Created: 2025-11-06
# Updated: 2025-11-06
# Component: FilterPanel v1.0.0
# Package: @l-kern/ui-components
#
# Description:
#   Complete documentation for FilterPanel component - production-ready
#   filter and search UI with quick filters, filter groups, items per page,
#   and result count display. Ported from v3 with v4 enhancements.
# ================================================================

---

## 📋 Overview

**FilterPanel** is a production-ready filter and search UI component for data filtering workflows. Combines search input, quick filter pills, filter group buttons/checkboxes, pagination controls, and result count display in one cohesive panel.

### When to Use

- ✅ **Data filtering UIs** for lists, grids, card views
- ✅ **Search + filter combinations** (orders, contacts, products)
- ✅ **Multi-criteria filtering** (status, priority, category)
- ✅ **Management interfaces** with filters and pagination
- ✅ **Dashboard filters** with quick toggles
- ✅ **List pages** requiring search and filtering

### When NOT to Use

- ❌ **Simple search-only** (use plain Input instead)
- ❌ **Read-only displays** (no filtering needed)
- ❌ **Single filter dropdown** (use Select instead)
- ❌ **Complex query builders** (use dedicated query builder component)

---

## ✨ Features

### Core Features (8+)

**Search Input:**
- ✅ Full-width search bar with 🔍 icon
- ✅ Real-time onChange callback
- ✅ Customizable placeholder (translated)
- ✅ Focus state with brand color border + shadow
- ✅ Inset shadow for depth

**Quick Filters:**
- ✅ Rounded pill buttons (active/inactive)
- ✅ Active highlighting (brand color bg + shadow + lift)
- ✅ Clear All special styling (neutral, no shadow)
- ✅ Flex-wrap layout (8px gap)

**Filter Groups:**
- ✅ Multiple groups (STATUS, PRIORITY, etc.)
- ✅ **Button mode** (default) - clickable option buttons
- ✅ **Checkbox mode** (`useCheckboxes` prop) - grid layout
- ✅ Active state highlighting (purple bg for buttons, checkboxes)
- ✅ Group titles (uppercase, bold, brand color, letter-spacing)

**Controls (Right-Aligned):**
- ✅ Items per page dropdown (5, 10, 20, 50, 100)
- ✅ New Item button (brand gradient, shadow, hover lift)
- ✅ Absolute positioned (bottom-right corner)

**Result Count:**
- ✅ Filtered / Total count display (e.g., "📊 15/25 položiek")
- ✅ Bottom row layout (left side)
- ✅ Brand color for count

**Show Inactive Toggle:**
- ✅ Checkbox toggle (bottom row, right side)
- ✅ Customizable label (translated)
- ✅ Optional (only when `onShowInactiveChange` provided)

**Custom Content:**
- ✅ `children` prop for additional filters
- ✅ Rendered below controls section

**Theme Support:**
- ✅ Light mode (white bg, light borders)
- ✅ Dark mode (dark bg, light gradients)
- ✅ Brand color integration (ThemeCustomizer reactive)

---

## 📦 Installation

FilterPanel is part of `@l-kern/ui-components` package.

```bash
# Already installed if using L-KERN v4
yarn add @l-kern/ui-components
```

---

## 🎯 Basic Usage

### Minimal Example (Search Only)

```typescript
import { FilterPanel } from '@l-kern/ui-components';
import { useState } from 'react';

function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <FilterPanel
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      resultCount={10}
    />
  );
}
```

### With Quick Filters

```typescript
import { FilterPanel, QuickFilter } from '@l-kern/ui-components';
import { useState } from 'react';

function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

  const quickFilters: QuickFilter[] = [
    {
      id: 'active',
      label: 'Active',
      active: activeFilters.has('active'),
      onClick: () => toggleFilter('active'),
    },
    {
      id: 'pending',
      label: 'Pending',
      active: activeFilters.has('pending'),
      onClick: () => toggleFilter('pending'),
    },
    {
      id: 'clear-all',
      label: 'Clear All',
      active: false,
      onClick: () => setActiveFilters(new Set()),
    },
  ];

  const toggleFilter = (id: string) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <FilterPanel
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      quickFilters={quickFilters}
      resultCount={15}
      totalCount={25}
    />
  );
}
```

### With Filter Groups (Button Mode)

```typescript
import { FilterPanel, FilterGroup } from '@l-kern/ui-components';
import { useState } from 'react';
import { useTranslation } from '@l-kern/config';

function OrdersPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilters, setStatusFilters] = useState<Set<string>>(new Set());
  const [priorityFilters, setPriorityFilters] = useState<Set<string>>(new Set());

  const toggleStatusFilter = (value: string) => {
    setStatusFilters(prev => {
      const next = new Set(prev);
      next.has(value) ? next.delete(value) : next.add(value);
      return next;
    });
  };

  const filterGroups: FilterGroup[] = [
    {
      field: 'status',
      title: t('orders.filters.statusTitle'),
      options: [
        { value: 'active', label: t('orders.status.active') },
        { value: 'pending', label: t('orders.status.pending') },
        { value: 'completed', label: t('orders.status.completed') },
      ],
      selectedValues: statusFilters,
      onChange: toggleStatusFilter,
    },
    {
      field: 'priority',
      title: t('orders.filters.priorityTitle'),
      options: [
        { value: 'low', label: t('orders.priority.low') },
        { value: 'medium', label: t('orders.priority.medium') },
        { value: 'high', label: t('orders.priority.high') },
      ],
      selectedValues: priorityFilters,
      onChange: (value) => {
        setPriorityFilters(prev => {
          const next = new Set(prev);
          next.has(value) ? next.delete(value) : next.add(value);
          return next;
        });
      },
    },
  ];

  return (
    <FilterPanel
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      filterGroups={filterGroups}
      resultCount={8}
      totalCount={25}
    />
  );
}
```

### With Filter Groups (Checkbox Mode)

```typescript
<FilterPanel
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  filterGroups={filterGroups}
  useCheckboxes={true}  // Checkbox mode (grid layout, max 2 rows)
  resultCount={12}
/>
```

### Full Example (All Features)

```typescript
import { FilterPanel } from '@l-kern/ui-components';
import { useState } from 'react';
import { useTranslation } from '@l-kern/config';

function OrdersPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilters, setStatusFilters] = useState<Set<string>>(new Set());
  const [priorityFilters, setPriorityFilters] = useState<Set<string>>(new Set());
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [showInactive, setShowInactive] = useState(false);

  // ... filter logic ...

  return (
    <FilterPanel
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder={t('orders.searchPlaceholder')}

      quickFilters={quickFilters}

      filterGroups={filterGroups}
      useCheckboxes={false}

      resultCount={filteredData.length}
      totalCount={allData.length}

      itemsPerPage={itemsPerPage}
      onItemsPerPageChange={setItemsPerPage}

      onNewItem={() => openNewOrderModal()}
      newItemText="➕ New Order"

      showInactive={showInactive}
      onShowInactiveChange={setShowInactive}
      showInactiveLabel={t('orders.showInactive')}
    />
  );
}
```

---

## 🎨 Props API

### FilterPanelProps

```typescript
export interface FilterPanelProps extends BaseComponentProps {
  // Search
  searchQuery: string;                          // Current search query
  onSearchChange: (query: string) => void;      // Search query change handler
  searchPlaceholder?: string;                   // Search input placeholder (translated)

  // Quick Filters
  quickFilters?: QuickFilter[];                 // Quick filter buttons

  // Filter Groups
  filterGroups?: FilterGroup[];                 // Filter groups (status, priority, etc.)
  useCheckboxes?: boolean;                      // Use checkboxes instead of buttons

  // Result Count
  resultCount: number;                          // Number of filtered results
  totalCount?: number;                          // Total unfiltered count (optional)

  // Controls
  itemsPerPage?: number;                        // Current items per page value
  onItemsPerPageChange?: (value: number) => void; // Items per page change handler
  onNewItem?: () => void;                       // New item button click handler
  newItemText?: string;                         // New item button text (translated)

  // Custom Content
  children?: React.ReactNode;                   // Custom filter content

  // Show Inactive
  showInactive?: boolean;                       // Show inactive items toggle
  onShowInactiveChange?: (show: boolean) => void; // Show inactive change handler
  showInactiveLabel?: string;                   // Show inactive label (translated)

  // Advanced (Future)
  roleFilters?: RoleFilter[];                   // Role filters (checkbox group)
  onRoleFilterChange?: (code: string, checked: boolean) => void;
}
```

### QuickFilter

```typescript
export interface QuickFilter {
  id: string;                 // Unique identifier
  label: string;              // Display label (translated)
  active: boolean;            // Whether filter is active
  onClick: () => void;        // Click handler
}
```

### FilterGroup

```typescript
export interface FilterGroup {
  field: string;              // Field name being filtered
  title: string;              // Group title (translated, uppercase)
  options: Array<{
    value: string;            // Option value
    label: string;            // Option label (translated)
  }>;
  selectedValues: Set<string>; // Currently selected values
  onChange: (value: string) => void; // Callback when option is toggled
}
```

---

## 🎨 Visual Design

### Layout Structure

```
┌─────────────────────────────────────────────────────┐
│ FilterPanel                                         │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 🔍 Search input                                 │ │
│ └─────────────────────────────────────────────────┘ │
│                                                       │
│ [Active] [Pending] [Completed] [Clear All]          │
│                                                       │
│ STATUS                  PRIORITY                      │
│ [Open] [Closed]        [Low] [Medium] [High]        │
│                                                       │
│                     Items per page: [20▼] [➕ New]   │
│ ─────────────────────────────────────────────────── │
│ Filtered: 📊 15/25 items        ☑ Show Inactive     │
└─────────────────────────────────────────────────────┘
```

### Color System

- **Border**: 6px left border (`--color-brand-primary`)
- **Search icon**: Muted text (`--theme-text-muted`)
- **Quick filters**:
  - Inactive: `rgba(255, 255, 255, 0.6)`, opacity 0.85
  - Active: Brand color bg + shadow + lift
  - Clear All: Neutral bg, no shadow
- **Filter group titles**: Brand color, uppercase, bold, letter-spacing 1.2px
- **Filter buttons**:
  - Inactive: `--theme-background`
  - Active: Brand color bg + white text
- **Result count**: Brand color text
- **New Item button**: Brand color bg + shadow + hover lift

---

## ♿ Accessibility

### ARIA Attributes

- **Search input**: `type="text"`, `placeholder` attribute
- **Quick filter buttons**: `role="button"`, clickable
- **Filter buttons**: `role="button"`, clickable
- **Checkboxes**: `type="checkbox"`, proper label association
- **Items per page**: `<select>` with options
- **Show inactive**: `type="checkbox"` with label

### Keyboard Support

- **Tab**: Navigate between search, filters, controls
- **Enter/Space**: Activate buttons, toggle checkboxes
- **Arrow keys**: Navigate dropdown (items per page)

---

## 🧪 Testing

### Test Coverage

**30 tests** covering:
- ✅ Rendering with all props
- ✅ Search input onChange
- ✅ Quick filters onClick
- ✅ Filter groups onChange (button + checkbox mode)
- ✅ Items per page onChange
- ✅ New Item button onClick
- ✅ Show Inactive toggle
- ✅ Custom children rendering
- ✅ Styling (active classes)
- ✅ Edge cases (empty arrays, minimal props)

### Running Tests

```bash
# Inside Docker container
docker exec lkms201-web-ui yarn nx test ui-components -- FilterPanel.test.tsx

# Watch mode
docker exec -it lkms201-web-ui yarn nx test ui-components -- FilterPanel.test.tsx --watch

# Coverage
docker exec lkms201-web-ui yarn nx test ui-components --coverage
```

---

## 🎯 Related Components

- **[FilteredDataGrid](../FilteredDataGrid/FilteredDataGrid.md)** - Wrapper combining FilterPanel + DataGrid
- **[DataGrid](../DataGrid/DataGrid.md)** - Data grid component (receives filtered data)
- **[Input](../Input/Input.md)** - For simple search inputs
- **[Select](../Select/Select.md)** - For single-select dropdowns
- **[Checkbox](../Checkbox/Checkbox.md)** - For filter checkboxes

---

## 📝 Best Practices

### State Management Pattern

**Parent (page/template) manages filter state:**

```typescript
// Bad: FilterPanel manages state internally ❌
<FilterPanel />  // How do I get filtered data?

// Good: Parent manages state, FilterPanel captures input ✅
const [searchQuery, setSearchQuery] = useState('');
const [statusFilters, setStatusFilters] = useState<Set<string>>(new Set());

const filteredData = useMemo(() => {
  return data.filter(row => {
    if (searchQuery && !matchesSearch(row, searchQuery)) return false;
    if (statusFilters.size > 0 && !statusFilters.has(row.status)) return false;
    return true;
  });
}, [data, searchQuery, statusFilters]);

<FilterPanel
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  filterGroups={[...]}  // With onChange callbacks
/>
<DataGrid data={filteredData} />
```

### Translation Keys

**Always use translations for user-facing text:**

```typescript
// Bad: Hardcoded text ❌
<FilterPanel newItemText="New Order" />

// Good: Translated text ✅
const { t } = useTranslation();
<FilterPanel newItemText={t('orders.newOrder')} />
```

### Filter Group Naming

**Use consistent field names:**

```typescript
// Good: Consistent with data model ✅
const filterGroups = [
  { field: 'status', title: 'STATUS', ... },   // Matches row.status
  { field: 'priority', title: 'PRIORITY', ... }, // Matches row.priority
];

// Bad: Inconsistent ❌
const filterGroups = [
  { field: 'orderStatus', title: 'STATUS', ... },  // Doesn't match row.status
];
```

---

## 🐛 Troubleshooting

### Filters not updating

**Problem**: Clicking filters doesn't update state.

**Solution**: Check `onChange` callbacks return new Set instance (not mutating):

```typescript
// Bad: Mutating existing Set ❌
const toggleFilter = (value: string) => {
  statusFilters.add(value);  // Doesn't trigger re-render!
};

// Good: Create new Set instance ✅
const toggleFilter = (value: string) => {
  setStatusFilters(prev => {
    const next = new Set(prev);
    next.has(value) ? next.delete(value) : next.add(value);
    return next;
  });
};
```

### Result count shows wrong numbers

**Problem**: Result count displays incorrect filtered/total.

**Solution**: Ensure `resultCount` = filtered data length, `totalCount` = all data length:

```typescript
// Correct ✅
<FilterPanel
  resultCount={filteredData.length}   // 15 (filtered)
  totalCount={allData.length}         // 25 (total)
/>
```

### New Item button not showing

**Problem**: New Item button doesn't render.

**Solution**: Provide `onNewItem` callback:

```typescript
// Missing callback ❌
<FilterPanel newItemText="New Order" />

// With callback ✅
<FilterPanel
  onNewItem={() => openModal()}
  newItemText="New Order"
/>
```

---

**Last Updated**: 2025-11-06
**Version**: 1.0.0
**Component**: FilterPanel v1.0.0
**Package**: @l-kern/ui-components
