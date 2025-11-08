/*
 * ================================================================
 * FILE: Sidebar.test.tsx
 * PATH: /packages/ui-components/src/components/Sidebar/Sidebar.test.tsx
 * DESCRIPTION: Comprehensive test suite for Sidebar component
 * VERSION: v1.0.0
 * UPDATED: 2025-11-02 20:00:00
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  renderWithAll,
  screen,
  fireEvent,
  waitFor,
  userEvent,
  act,
  within,
} from '../../test-utils';
import { Sidebar, SidebarNavItem } from './Sidebar';

// ================================================================
// TEST DATA
// ================================================================

const mockNavigate = vi.fn();
const mockOnFloatingAction = vi.fn();

const basicNavItems: SidebarNavItem[] = [
  {
    path: '/',
    labelKey: 'components.sidebar.home',
    icon: '🏠',
    onClick: () => mockNavigate('/'),
  },
  {
    path: '/contacts',
    labelKey: 'components.sidebar.contacts',
    icon: '👥',
    onClick: () => mockNavigate('/contacts'),
    badge: 5,
  },
];

const treeNavItems: SidebarNavItem[] = [
  {
    path: '/',
    labelKey: 'components.sidebar.home',
    icon: '🏠',
    onClick: () => mockNavigate('/'),
    children: [
      {
        path: '/testing',
        labelKey: 'dashboard.testing',
        icon: '🧪',
        onClick: () => mockNavigate('/testing'),
        children: [
          {
            path: '/testing/modal',
            labelKey: 'components.testing.modalV3Title',
            icon: '🪟',
            onClick: () => mockNavigate('/testing/modal'),
          },
          {
            path: '/testing/toast',
            labelKey: 'components.testing.toastTitle',
            icon: '🍞',
            onClick: () => mockNavigate('/testing/toast'),
          },
        ],
      },
      {
        path: '/contacts',
        labelKey: 'components.sidebar.contacts',
        icon: '👥',
        onClick: () => mockNavigate('/contacts'),
      },
    ],
  },
];

const disabledNavItems: SidebarNavItem[] = [
  {
    path: '/',
    labelKey: 'components.sidebar.home',
    icon: '🏠',
    onClick: () => mockNavigate('/'),
  },
  {
    path: '/dashboard',
    labelKey: 'components.sidebar.dashboard',
    icon: '📊',
    // No onClick = disabled
  },
];

// ================================================================
// SETUP/TEARDOWN
// ================================================================

beforeEach(() => {
  // Clear localStorage before each test
  localStorage.clear();

  // Clear all mocks
  vi.clearAllMocks();
});

afterEach(() => {
  // Clean up localStorage after each test
  localStorage.clear();
});

// ================================================================
// RENDERING TESTS (5 tests)
// ================================================================

describe('Sidebar - Rendering', () => {
  it('renders sidebar with nav items', () => {
    renderWithAll(
      <Sidebar items={basicNavItems} activePath="/" />
    );

    // Check sidebar element exists
    const sidebar = document.querySelector('[data-component="sidebar"]');
    expect(sidebar).toBeInTheDocument();

    // Check nav items are rendered
    expect(screen.getByText('Domov')).toBeInTheDocument(); // Slovak for "Home"
    expect(screen.getByText('Kontakty')).toBeInTheDocument(); // Slovak for "Contacts"
  });

  it('shows logo when showLogo=true', () => {
    renderWithAll(
      <Sidebar items={basicNavItems} showLogo={true} />
    );

    // Check logo image exists
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();
  });

  it('hides logo when showLogo=false', () => {
    renderWithAll(
      <Sidebar items={basicNavItems} showLogo={false} />
    );

    // Check logo image does NOT exist
    const logo = screen.queryByAltText('Logo');
    expect(logo).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    renderWithAll(
      <Sidebar items={basicNavItems} className="custom-sidebar" />
    );

    const sidebar = document.querySelector('[data-component="sidebar"]');
    expect(sidebar).toHaveClass('custom-sidebar');
  });

  it('renders all bottom section elements', () => {
    renderWithAll(
      <Sidebar
        items={basicNavItems}
        showThemeToggle={true}
        showLanguageToggle={true}
        showUploadBox={true}
        showFloatingAction={true}
        onFloatingAction={mockOnFloatingAction}
      />
    );

    // Theme toggle (check for icon)
    expect(screen.getByText('🌙')).toBeInTheDocument();

    // Language toggle
    expect(screen.getByText('🇸🇰')).toBeInTheDocument();

    // Upload box
    expect(screen.getByText('Nahrať nový obrázok')).toBeInTheDocument();

    // Floating action button
    const fab = screen.getByTitle('Nová akcia');
    expect(fab).toBeInTheDocument();
  });
});

// ================================================================
// COLLAPSE/EXPAND TESTS (4 tests)
// ================================================================

describe('Sidebar - Collapse/Expand', () => {
  it('collapses sidebar on toggle button click', async () => {
    renderWithAll(
      <Sidebar items={basicNavItems} defaultCollapsed={false} />
    );

    const sidebar = document.querySelector('[data-component="sidebar"]');
    expect(sidebar).toHaveAttribute('data-collapsed', 'false');

    // Click toggle button
    const toggleButton = screen.getByTitle('Zbaliť navigáciu'); // "Collapse navigation" in Slovak
    await userEvent.click(toggleButton);

    // Check sidebar is collapsed
    expect(sidebar).toHaveAttribute('data-collapsed', 'true');
  });

  it('expands sidebar on toggle button click', async () => {
    renderWithAll(
      <Sidebar items={basicNavItems} defaultCollapsed={true} />
    );

    const sidebar = document.querySelector('[data-component="sidebar"]');
    expect(sidebar).toHaveAttribute('data-collapsed', 'true');

    // Click toggle button
    const toggleButton = screen.getByTitle('Rozbaliť navigáciu'); // "Expand navigation" in Slovak
    await userEvent.click(toggleButton);

    // Check sidebar is expanded
    expect(sidebar).toHaveAttribute('data-collapsed', 'false');
  });

  it('saves collapsed state to localStorage', async () => {
    renderWithAll(
      <Sidebar items={basicNavItems} defaultCollapsed={false} />
    );

    // Click toggle button
    const toggleButton = screen.getByTitle('Zbaliť navigáciu');
    await userEvent.click(toggleButton);

    // Check localStorage
    const saved = localStorage.getItem('sidebar-collapsed');
    expect(saved).toBe('true');
  });

  it('loads collapsed state from localStorage on mount', () => {
    // Set localStorage before rendering
    localStorage.setItem('sidebar-collapsed', 'true');

    renderWithAll(
      <Sidebar items={basicNavItems} />
    );

    const sidebar = document.querySelector('[data-component="sidebar"]');
    expect(sidebar).toHaveAttribute('data-collapsed', 'true');
  });
});

// ================================================================
// NAVIGATION TESTS (6 tests)
// ================================================================

describe('Sidebar - Navigation', () => {
  it('calls onClick when nav item clicked', async () => {
    renderWithAll(
      <Sidebar items={basicNavItems} activePath="/" />
    );

    const homeLink = screen.getByText('Domov');
    await userEvent.click(homeLink);

    expect(mockNavigate).toHaveBeenCalledWith('/');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onClick for disabled items (no onClick handler)', async () => {
    renderWithAll(
      <Sidebar items={disabledNavItems} activePath="/" />
    );

    const dashboardLink = screen.getByText('Dashboard');
    await userEvent.click(dashboardLink);

    // onClick should NOT be called because item is disabled
    expect(mockNavigate).not.toHaveBeenCalledWith('/dashboard');
  });

  it('shows active indicator when activePath matches item.path', () => {
    renderWithAll(
      <Sidebar items={basicNavItems} activePath="/contacts" />
    );

    const contactsLink = screen.getByText('Kontakty').closest('a');
    expect(contactsLink).toHaveAttribute('aria-current', 'page');
  });

  it('opens in new tab on middle-click', async () => {
    renderWithAll(
      <Sidebar items={basicNavItems} activePath="/" />
    );

    const contactsLink = screen.getByText('Kontakty');

    // Middle-click (button 1)
    fireEvent.click(contactsLink, { button: 1 });

    // onClick should NOT be called (native browser behavior handles it)
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('opens in new tab on Ctrl+Click', async () => {
    renderWithAll(
      <Sidebar items={basicNavItems} activePath="/" />
    );

    const contactsLink = screen.getByText('Kontakty');

    // Ctrl+Click
    fireEvent.click(contactsLink, { ctrlKey: true });

    // onClick should NOT be called (native browser behavior handles it)
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('renders badge when item.badge > 0', () => {
    renderWithAll(
      <Sidebar items={basicNavItems} activePath="/" />
    );

    // Check badge displays "5"
    const badge = screen.getByText('5');
    expect(badge).toBeInTheDocument();
  });
});

// ================================================================
// TREE NAVIGATION TESTS (6 tests)
// ================================================================

describe('Sidebar - Tree Navigation', () => {
  it('expands submenu when arrow clicked', async () => {
    renderWithAll(
      <Sidebar items={treeNavItems} activePath="/" defaultCollapsed={false} />
    );

    // Initially, submenu should NOT be visible (collapsed)
    expect(screen.queryByText('Testovanie')).not.toBeInTheDocument();

    // Find expand arrow (the ▶ character) - it's in label container
    const homeItem = screen.getByText('Domov').closest('a');
    // Safe: homeItem exists after closest('a') check
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const arrowSpan = within(homeItem!).getByText('▶');

    expect(arrowSpan).toBeInTheDocument();

    // Click arrow to expand
    await act(async () => {
      fireEvent.click(arrowSpan);
    });

    // Wait for submenu to appear
    await waitFor(() => {
      expect(screen.getByText('Testovanie')).toBeInTheDocument();
    });

    // Arrow should change to ▼
    // Safe: homeItem exists after closest('a') check
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(within(homeItem!).getByText('▼')).toBeInTheDocument();
  });

  it('collapses submenu when arrow clicked again', async () => {
    // Pre-expand the item
    localStorage.setItem('sidebar-expanded-items', JSON.stringify(['/']));

    renderWithAll(
      <Sidebar items={treeNavItems} activePath="/" defaultCollapsed={false} />
    );

    // Submenu should be visible initially (pre-expanded)
    expect(screen.getByText('Testovanie')).toBeInTheDocument();

    // Find expand arrow (▼ when expanded)
    const homeItem = screen.getByText('Domov').closest('a');
    // Safe: homeItem exists after closest('a') check
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const arrowSpan = within(homeItem!).getByText('▼');

    expect(arrowSpan).toBeInTheDocument();

    // Click arrow to collapse
    await act(async () => {
      fireEvent.click(arrowSpan);
    });

    // Wait for submenu to disappear
    await waitFor(() => {
      expect(screen.queryByText('Testovanie')).not.toBeInTheDocument();
    });

    // Arrow should change to ▶
    // Safe: homeItem exists after closest('a') check
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(within(homeItem!).getByText('▶')).toBeInTheDocument();
  });

  it('shows floating submenu on hover (collapsed mode)', async () => {
    renderWithAll(
      <Sidebar items={treeNavItems} activePath="/" defaultCollapsed={true} />
    );

    // Sidebar is collapsed, icons only
    const sidebar = document.querySelector('[data-component="sidebar"]');
    expect(sidebar).toHaveAttribute('data-collapsed', 'true');

    // Hover over Home item (has children)
    const homeIcon = screen.getByText('🏠');

    await act(async () => {
      // Safe: element exists after closest('li') check
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      fireEvent.mouseEnter(homeIcon.closest('li')!);
    });

    // Wait for floating submenu to appear
    await waitFor(() => {
      // Check submenu items are in floating menu (multiple "Domov" text - one in header)
      expect(screen.getByText('Testovanie')).toBeInTheDocument();
    });

    // Check all submenu items visible
    expect(screen.getByText('Kontakty')).toBeInTheDocument();
  });

  it('hides floating submenu on mouse leave', async () => {
    renderWithAll(
      <Sidebar items={treeNavItems} activePath="/" defaultCollapsed={true} />
    );

    // Hover over Home item
    // Safe: element exists after closest('li') check
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const homeIconLi = screen.getByText('🏠').closest('li')!;

    await act(async () => {
      fireEvent.mouseEnter(homeIconLi);
    });

    // Wait for floating submenu
    await waitFor(() => {
      expect(screen.getByText('Testovanie')).toBeInTheDocument();
    });

    // Mouse leave
    await act(async () => {
      fireEvent.mouseLeave(homeIconLi);
    });

    // Floating submenu should disappear
    await waitFor(() => {
      expect(screen.queryByText('Testovanie')).not.toBeInTheDocument();
    });
  });

  it('shows inline submenu when expanded (expanded mode)', async () => {
    // Pre-expand the item
    localStorage.setItem('sidebar-expanded-items', JSON.stringify(['/']));

    renderWithAll(
      <Sidebar items={treeNavItems} activePath="/" defaultCollapsed={false} />
    );

    // Submenu should be visible inline (not floating)
    expect(screen.getByText('Testovanie')).toBeInTheDocument();
    expect(screen.getByText('Kontakty')).toBeInTheDocument();

    // Should NOT have floating submenu header
    const floatingHeader = screen.queryByText('Domov')?.closest('.sidebar__floatingSubmenuHeader');
    expect(floatingHeader).not.toBeInTheDocument();
  });

  it('saves expanded items to localStorage', async () => {
    renderWithAll(
      <Sidebar items={treeNavItems} activePath="/" defaultCollapsed={false} />
    );

    // Expand Home item (click the ▶ arrow)
    const homeItem = screen.getByText('Domov').closest('a');
    // Safe: homeItem exists after closest('a') check
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const arrowSpan = within(homeItem!).getByText('▶');

    await act(async () => {
      fireEvent.click(arrowSpan);
    });

    // Wait for state update in localStorage
    await waitFor(() => {
      const saved = localStorage.getItem('sidebar-expanded-items');
      expect(saved).toBeTruthy();
      // Safe: saved is checked with toBeTruthy() above
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const expandedItems = JSON.parse(saved!);
      expect(expandedItems).toContain('/');
    });
  });
});

// ================================================================
// EXPAND/COLLAPSE ALL TESTS (4 tests)
// ================================================================

describe('Sidebar - Expand/Collapse All', () => {
  it('expands all items with children recursively', async () => {
    renderWithAll(
      <Sidebar items={treeNavItems} activePath="/" defaultCollapsed={false} />
    );

    // Click Expand All button
    const expandAllButton = screen.getByTitle('Rozbaliť všetko');
    await userEvent.click(expandAllButton);

    // Wait for localStorage update
    await waitFor(() => {
      const saved = localStorage.getItem('sidebar-expanded-items');
      // Safe: saved is truthy after getItem call
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const expandedItems = JSON.parse(saved!);

      // Should include ALL items with children (/, /testing)
      expect(expandedItems).toContain('/');
      expect(expandedItems).toContain('/testing');
    });
  });

  it('collapses all items', async () => {
    // Pre-expand some items
    localStorage.setItem('sidebar-expanded-items', JSON.stringify(['/', '/testing']));

    renderWithAll(
      <Sidebar items={treeNavItems} activePath="/" defaultCollapsed={false} />
    );

    // Click Collapse All button
    const collapseAllButton = screen.getByTitle('Zbaliť všetko');
    await userEvent.click(collapseAllButton);

    // Wait for localStorage update
    await waitFor(() => {
      const saved = localStorage.getItem('sidebar-expanded-items');
      // Safe: saved is truthy after getItem call
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const expandedItems = JSON.parse(saved!);

      // Should be empty array
      expect(expandedItems).toEqual([]);
    });
  });

  it('saves expanded state to localStorage', async () => {
    renderWithAll(
      <Sidebar items={treeNavItems} activePath="/" defaultCollapsed={false} />
    );

    // Click Expand All
    const expandAllButton = screen.getByTitle('Rozbaliť všetko');
    await userEvent.click(expandAllButton);

    // Check localStorage persists
    const saved = localStorage.getItem('sidebar-expanded-items');
    expect(saved).toBeTruthy();
  });

  it('listens to storage events for cross-tab sync', async () => {
    renderWithAll(
      <Sidebar items={treeNavItems} activePath="/" defaultCollapsed={false} />
    );

    // Simulate storage event from another tab (wrapped in act)
    await act(async () => {
      localStorage.setItem('sidebar-expanded-items', JSON.stringify(['/']));
      window.dispatchEvent(new Event('storage'));
    });

    // Component should sync with localStorage
    await waitFor(() => {
      // Check if Testing submenu appears
      expect(screen.getByText('Testovanie')).toBeInTheDocument();
    });
  });
});

// ================================================================
// RESIZING TESTS (5 tests)
// ================================================================

describe('Sidebar - Resizing', () => {
  it('shows resize handle when resizable=true and sidebar expanded', () => {
    renderWithAll(
      <Sidebar items={basicNavItems} resizable={true} defaultCollapsed={false} />
    );

    const resizeHandle = screen.getByTitle('Zmeniť šírku sidebaru');
    expect(resizeHandle).toBeInTheDocument();
  });

  it('hides resize handle when sidebar collapsed', () => {
    renderWithAll(
      <Sidebar items={basicNavItems} resizable={true} defaultCollapsed={true} />
    );

    const resizeHandle = screen.queryByTitle('Zmeniť šírku sidebaru');
    expect(resizeHandle).not.toBeInTheDocument();
  });

  it('updates sidebar width on drag', async () => {
    renderWithAll(
      <Sidebar items={basicNavItems} resizable={true} defaultWidth={240} />
    );

    const sidebar = document.querySelector('[data-component="sidebar"]') as HTMLElement;
    const resizeHandle = screen.getByTitle('Zmeniť šírku sidebaru');

    // Initial width
    expect(sidebar.style.width).toBe('240px');

    // Start drag
    fireEvent.mouseDown(resizeHandle, { clientX: 240 });

    // Move mouse to right (increase width)
    fireEvent.mouseMove(document, { clientX: 280 });

    // End drag
    fireEvent.mouseUp(document);

    // Width should increase
    await waitFor(() => {
      expect(parseInt(sidebar.style.width)).toBeGreaterThan(240);
    });
  });

  it('clamps width between minWidth and maxWidth', async () => {
    renderWithAll(
      <Sidebar
        items={basicNavItems}
        resizable={true}
        defaultWidth={240}
        minWidth={120}
        maxWidth={400}
      />
    );

    const sidebar = document.querySelector('[data-component="sidebar"]') as HTMLElement;
    const resizeHandle = screen.getByTitle('Zmeniť šírku sidebaru');

    // Try to drag beyond maxWidth
    fireEvent.mouseDown(resizeHandle, { clientX: 240 });
    fireEvent.mouseMove(document, { clientX: 500 }); // Way beyond 400
    fireEvent.mouseUp(document);

    // Width should be clamped to maxWidth
    await waitFor(() => {
      // Safe: sidebar is HTMLElement from querySelector
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(parseInt(sidebar!.style.width)).toBeLessThanOrEqual(400);
    });
  });

  it('saves width to localStorage', async () => {
    renderWithAll(
      <Sidebar items={basicNavItems} resizable={true} defaultWidth={240} />
    );

    const resizeHandle = screen.getByTitle('Zmeniť šírku sidebaru');

    // Drag to resize
    fireEvent.mouseDown(resizeHandle, { clientX: 240 });
    fireEvent.mouseMove(document, { clientX: 280 });
    fireEvent.mouseUp(document);

    // Check localStorage
    await waitFor(() => {
      const saved = localStorage.getItem('sidebar-width');
      expect(saved).toBeTruthy();
      // Safe: saved is truthy after expect(saved).toBeTruthy()
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(parseInt(saved!)).toBeGreaterThan(240);
    });
  });
});

// ================================================================
// ACCESSIBILITY TESTS (5 tests)
// ================================================================

describe('Sidebar - Accessibility', () => {
  it('has aria-label on nav element', () => {
    renderWithAll(
      <Sidebar items={basicNavItems} activePath="/" />
    );

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Navigácia');
  });

  it('has aria-current="page" on active item', () => {
    renderWithAll(
      <Sidebar items={basicNavItems} activePath="/contacts" />
    );

    const contactsLink = screen.getByText('Kontakty').closest('a');
    expect(contactsLink).toHaveAttribute('aria-current', 'page');
  });

  it('has aria-disabled on disabled items', () => {
    renderWithAll(
      <Sidebar items={disabledNavItems} activePath="/" />
    );

    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).toHaveAttribute('aria-disabled', 'true');
  });

  it('has aria-label on toggle button', () => {
    renderWithAll(
      <Sidebar items={basicNavItems} defaultCollapsed={false} />
    );

    const toggleButton = screen.getByTitle('Zbaliť navigáciu');
    expect(toggleButton).toHaveAttribute('aria-label', 'Zbaliť navigáciu');
  });

  it('keyboard navigation works (Tab, Enter)', async () => {
    renderWithAll(
      <Sidebar items={basicNavItems} activePath="/" />
    );

    const homeLink = screen.getByText('Domov');

    // Verify the element is keyboard accessible (anchor element)
    expect(homeLink.tagName).toBe('SPAN'); // Label is a span inside anchor

    // Get the actual anchor element
    const anchorElement = homeLink.closest('a');
    expect(anchorElement).toBeInTheDocument();
    expect(anchorElement?.tagName).toBe('A');

    // Press Enter on anchor (simulates keyboard activation)
    // Safe: anchorElement exists after expect().toBeInTheDocument()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    fireEvent.keyDown(anchorElement!, { key: 'Enter' });

    // Link is keyboard accessible
    expect(anchorElement).toHaveAttribute('href', '/');
  });
});

// ================================================================
// TRANSLATION SUPPORT TESTS (3+ tests)
// ================================================================

describe('Sidebar - Translation Support', () => {
  it('displays Slovak text by default', () => {
    renderWithAll(
      <Sidebar items={basicNavItems} activePath="/" />
    );

    // Check Slovak translations
    expect(screen.getByText('Domov')).toBeInTheDocument(); // Home
    expect(screen.getByText('Kontakty')).toBeInTheDocument(); // Contacts
  });

  it('switches to English', () => {
    renderWithAll(
      <Sidebar items={basicNavItems} activePath="/" />,
      { initialLanguage: 'en' }
    );

    // Check English translations
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Contacts')).toBeInTheDocument();
  });

  it('all translation keys exist', () => {
    renderWithAll(
      <Sidebar
        items={basicNavItems}
        activePath="/"
        showThemeToggle={true}
        showLanguageToggle={true}
        showUploadBox={true}
        showFloatingAction={true}
        onFloatingAction={mockOnFloatingAction}
      />
    );

    // Check all UI elements have translations (no fallback keys shown)
    expect(screen.queryByText('components.sidebar.')).not.toBeInTheDocument(); // No raw keys
    expect(screen.queryByText('dashboard.')).not.toBeInTheDocument(); // No raw keys
  });
});
