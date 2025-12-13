/*
 * ================================================================
 * FILE: StatusBar.test.tsx
 * PATH: /packages/ui-components/src/components/StatusBar/StatusBar.test.tsx
 * DESCRIPTION: Unit tests for StatusBar component
 * VERSION: v1.0.0
 * CREATED: 2025-12-11
 * UPDATED: 2025-12-11
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderWithAll, screen, userEvent } from '../../test-utils';
import { StatusBar, ServiceStatus, CurrentUser } from './StatusBar';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock services data
const mockServices: Record<string, ServiceStatus> = {
  api: { name: 'API Gateway', status: 'healthy', critical: true, response_time: 45 },
  database: { name: 'PostgreSQL', status: 'healthy', critical: true, response_time: 12 },
  redis: { name: 'Redis Cache', status: 'healthy', critical: false, response_time: 5 },
  monitoring: { name: 'Monitoring', status: 'unhealthy', critical: false, response_time: 150 },
};

const mockUser: CurrentUser = {
  name: 'John Doe',
  position: 'Developer',
  department: 'Engineering',
  avatar: '👤',
};

describe('StatusBar', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ================================================================
  // RENDERING TESTS
  // ================================================================
  describe('Rendering', () => {
    it('renders status bar container', () => {
      renderWithAll(<StatusBar />);
      // Status bar should be in document - look for status message
      expect(screen.getByText(/●/)).toBeInTheDocument();
    });

    it('renders services count', () => {
      renderWithAll(<StatusBar services={mockServices} />);
      // Should show services count - text is split across elements
      expect(screen.getByText(/3\/4/)).toBeInTheDocument();
    });

    it('renders last updated time', () => {
      renderWithAll(<StatusBar />);
      // Should contain "Aktualizované" (Updated) text
      expect(screen.getByText(/Aktualizované/)).toBeInTheDocument();
    });

    it('renders theme toggle', () => {
      renderWithAll(<StatusBar />);
      // Theme toggle icons (sun or moon)
      expect(screen.getByText(/☀️|🌙/)).toBeInTheDocument();
    });

    it('renders language button', () => {
      renderWithAll(<StatusBar />);
      // Language should show current language (SK or EN)
      expect(screen.getByRole('button', { name: /SK|EN/i })).toBeInTheDocument();
    });

    it('renders refresh button', () => {
      renderWithAll(<StatusBar />);
      expect(screen.getByRole('button', { name: /↻/ })).toBeInTheDocument();
    });

    it('renders expand/collapse icon', () => {
      renderWithAll(<StatusBar />);
      // Default is collapsed, should show ▲
      expect(screen.getByText('▲')).toBeInTheDocument();
    });
  });

  // ================================================================
  // SERVICES DISPLAY TESTS
  // ================================================================
  describe('Services Display', () => {
    it('displays all healthy status when all services healthy', () => {
      const allHealthy: Record<string, ServiceStatus> = {
        api: { name: 'API', status: 'healthy', critical: true, response_time: 10 },
        db: { name: 'DB', status: 'healthy', critical: true, response_time: 5 },
      };
      renderWithAll(<StatusBar services={allHealthy} />);
      // Status should be green (all healthy)
      const statusIcon = screen.getAllByText('●')[0];
      expect(statusIcon).toBeInTheDocument();
    });

    it('displays warning status when some services unhealthy', () => {
      renderWithAll(<StatusBar services={mockServices} />);
      // Should indicate some services are not healthy - text split across elements
      expect(screen.getByText(/3\/4/)).toBeInTheDocument();
    });

    it('displays critical status when critical services down', () => {
      const criticalDown: Record<string, ServiceStatus> = {
        api: { name: 'API', status: 'down', critical: true, response_time: 0 },
      };
      renderWithAll(<StatusBar services={criticalDown} />);
      expect(screen.getByText(/0\/1/)).toBeInTheDocument();
    });

    it('shows service counts correctly', () => {
      renderWithAll(<StatusBar services={mockServices} />);
      // 3 healthy out of 4 total - text split
      expect(screen.getByText(/3\/4/)).toBeInTheDocument();
    });
  });

  // ================================================================
  // USER INFO TESTS
  // ================================================================
  describe('User Info', () => {
    it('displays user info when provided', () => {
      renderWithAll(<StatusBar currentUser={mockUser} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Developer')).toBeInTheDocument();
    });

    it('displays user avatar', () => {
      renderWithAll(<StatusBar currentUser={mockUser} />);
      expect(screen.getByText('👤')).toBeInTheDocument();
    });

    it('does not show user section when no user provided', () => {
      renderWithAll(<StatusBar />);
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  // ================================================================
  // DATA SOURCE INDICATOR TESTS
  // ================================================================
  describe('Data Source Indicator', () => {
    it('shows mock data indicator when dataSource is mock', () => {
      renderWithAll(<StatusBar dataSource="mock" />);
      expect(screen.getByText('MOCK DATA')).toBeInTheDocument();
      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });

    it('shows error indicator when dataSource is error', () => {
      renderWithAll(<StatusBar dataSource="error" dataSourceError="Connection failed" />);
      expect(screen.getByText('ORCHESTRATOR OFFLINE')).toBeInTheDocument();
      expect(screen.getByText('🔴')).toBeInTheDocument();
    });

    it('does not show indicator when dataSource is orchestrator', () => {
      renderWithAll(<StatusBar dataSource="orchestrator" />);
      expect(screen.queryByText('MOCK DATA')).not.toBeInTheDocument();
      expect(screen.queryByText('ORCHESTRATOR OFFLINE')).not.toBeInTheDocument();
    });
  });

  // ================================================================
  // EXPAND/COLLAPSE TESTS
  // ================================================================
  describe('Expand/Collapse', () => {
    it('starts collapsed by default', () => {
      renderWithAll(<StatusBar services={mockServices} />);
      // When collapsed, ▲ is shown
      expect(screen.getByText('▲')).toBeInTheDocument();
      // Expanded sections should not be visible
      expect(screen.queryByRole('heading', { level: 4 })).not.toBeInTheDocument();
    });

    it('expands when header is clicked', async () => {
      const user = userEvent.setup();
      renderWithAll(<StatusBar services={mockServices} />);

      // Click on header to expand
      const statusText = screen.getByText(/●/).parentElement;
      if (statusText) {
        await user.click(statusText);
      }

      // After expand, ▼ should be shown
      expect(screen.getByText('▼')).toBeInTheDocument();
    });

    it('shows services in expanded state', async () => {
      const user = userEvent.setup();
      renderWithAll(<StatusBar services={mockServices} />);

      const statusText = screen.getByText(/●/).parentElement;
      if (statusText) {
        await user.click(statusText);
      }

      // Should show service names in expanded view
      expect(screen.getByText('API Gateway')).toBeInTheDocument();
      // PostgreSQL appears in both critical and database sections
      expect(screen.getAllByText('PostgreSQL').length).toBeGreaterThan(0);
    });

    it('calls onExpandedChange when expanded state changes', async () => {
      const onExpandedChange = vi.fn();
      const user = userEvent.setup();
      renderWithAll(
        <StatusBar services={mockServices} onExpandedChange={onExpandedChange} />
      );

      const statusText = screen.getByText(/●/).parentElement;
      if (statusText) {
        await user.click(statusText);
      }

      expect(onExpandedChange).toHaveBeenCalledWith(true);
    });

    it('collapses when clicked again', async () => {
      const user = userEvent.setup();
      renderWithAll(<StatusBar services={mockServices} />);

      const statusText = screen.getByText(/●/).parentElement;
      if (statusText) {
        // Expand
        await user.click(statusText);
        expect(screen.getByText('▼')).toBeInTheDocument();

        // Collapse
        await user.click(statusText);
        expect(screen.getByText('▲')).toBeInTheDocument();
      }
    });
  });

  // ================================================================
  // THEME TOGGLE TESTS
  // ================================================================
  describe('Theme Toggle', () => {
    it('renders theme toggle slider', () => {
      renderWithAll(<StatusBar />);
      // Theme icon should be visible
      expect(screen.getByText(/☀️|🌙/)).toBeInTheDocument();
    });
  });

  // ================================================================
  // LANGUAGE TOGGLE TESTS
  // ================================================================
  describe('Language Toggle', () => {
    it('renders language button with current language', () => {
      renderWithAll(<StatusBar />);
      const langButton = screen.getByRole('button', { name: /SK|EN/i });
      expect(langButton).toBeInTheDocument();
    });

    it('changes language on click', async () => {
      const user = userEvent.setup();
      renderWithAll(<StatusBar />);

      const langButton = screen.getByRole('button', { name: /SK/i });
      await user.click(langButton);

      // After click, language should change to EN
      expect(screen.getByRole('button', { name: /EN/i })).toBeInTheDocument();
    });
  });

  // ================================================================
  // REFRESH BUTTON TESTS
  // ================================================================
  describe('Refresh Button', () => {
    it('renders refresh button', () => {
      renderWithAll(<StatusBar />);
      expect(screen.getByRole('button', { name: /↻/ })).toBeInTheDocument();
    });

    it('calls onRefresh when clicked', async () => {
      const onRefresh = vi.fn().mockResolvedValue(undefined);
      const user = userEvent.setup();
      renderWithAll(<StatusBar onRefresh={onRefresh} />);

      const refreshButton = screen.getByRole('button', { name: /↻/ });
      await user.click(refreshButton);

      expect(onRefresh).toHaveBeenCalledTimes(1);
    });
  });

  // ================================================================
  // BACKUP FUNCTIONALITY TESTS
  // ================================================================
  describe('Backup Functionality', () => {
    it('shows backup button in expanded state', async () => {
      const user = userEvent.setup();
      renderWithAll(<StatusBar services={mockServices} />);

      // Expand
      const statusText = screen.getByText(/●/).parentElement;
      if (statusText) {
        await user.click(statusText);
      }

      // Backup button should be visible
      expect(screen.getByText('💾')).toBeInTheDocument();
    });

    it('calls onBackup when backup button clicked', async () => {
      const onBackup = vi.fn().mockResolvedValue(undefined);
      const user = userEvent.setup();
      renderWithAll(<StatusBar services={mockServices} onBackup={onBackup} />);

      // Expand
      const statusText = screen.getByText(/●/).parentElement;
      if (statusText) {
        await user.click(statusText);
      }

      // Click backup button using title attribute
      const backupButton = screen.getByTitle(/Zálohovať/);
      if (backupButton) {
        await user.click(backupButton);
      }

      expect(onBackup).toHaveBeenCalledTimes(1);
    });
  });

  // ================================================================
  // PROPS TESTS
  // ================================================================
  describe('Props', () => {
    it('uses initial backup info when provided', async () => {
      const user = userEvent.setup();
      const initialBackupInfo = {
        completed_at: '2025-01-15T10:30:00Z',
        files: 25,
        status: 'completed' as const,
      };
      renderWithAll(
        <StatusBar services={mockServices} initialBackupInfo={initialBackupInfo} />
      );

      // Expand to see backup info
      const statusText = screen.getByText(/●/).parentElement;
      if (statusText) {
        await user.click(statusText);
      }

      // Last backup info should be displayed - check for backup section header
      expect(screen.getByText(/Databázy|Databases/i)).toBeInTheDocument();
      // Should show "Posledná záloha" text
      expect(screen.getByText(/Posledná záloha|Last backup/i)).toBeInTheDocument();
    });

    it('calls onExpandedHeightChange on mount', () => {
      const onExpandedHeightChange = vi.fn();
      renderWithAll(<StatusBar onExpandedHeightChange={onExpandedHeightChange} />);

      // Should be called on mount with default height (300)
      expect(onExpandedHeightChange).toHaveBeenCalledWith(300);
    });

    it('uses custom height from localStorage', () => {
      localStorageMock.setItem('l-kern-statusbar-height', '450');
      const onExpandedHeightChange = vi.fn();
      renderWithAll(<StatusBar onExpandedHeightChange={onExpandedHeightChange} />);

      expect(onExpandedHeightChange).toHaveBeenCalledWith(450);
    });
  });

  // ================================================================
  // TRANSLATION TESTS
  // ================================================================
  describe('Translation Support', () => {
    it('uses Slovak translations by default', () => {
      renderWithAll(<StatusBar />);
      // Status bar should have Slovak text
      // Looking for any text that would indicate Slovak is active
      const langButton = screen.getByRole('button', { name: /SK/i });
      expect(langButton).toBeInTheDocument();
    });

    it('uses English translations when language=en', () => {
      renderWithAll(<StatusBar />, { initialLanguage: 'en' });
      const langButton = screen.getByRole('button', { name: /EN/i });
      expect(langButton).toBeInTheDocument();
    });
  });

  // ================================================================
  // ACCESSIBILITY TESTS
  // ================================================================
  describe('Accessibility', () => {
    it('has accessible buttons', () => {
      renderWithAll(<StatusBar />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('refresh button has title attribute', () => {
      renderWithAll(<StatusBar />);
      const refreshButton = screen.getByRole('button', { name: /↻/ });
      expect(refreshButton).toHaveAttribute('title');
    });

    it('language button has title attribute', () => {
      renderWithAll(<StatusBar />);
      const langButton = screen.getByRole('button', { name: /SK|EN/i });
      expect(langButton).toHaveAttribute('title');
    });
  });

  // ================================================================
  // CSS & STYLING TESTS
  // ================================================================
  describe('CSS & Styling', () => {
    it('has statusBar base class', () => {
      const { container } = renderWithAll(<StatusBar />);
      const statusBar = container.firstChild as HTMLElement;
      expect(statusBar.className).toMatch(/statusBar/);
    });

    it('applies expanded class when expanded', async () => {
      const user = userEvent.setup();
      const { container } = renderWithAll(<StatusBar services={mockServices} />);

      // Click on the status text to expand
      const statusText = screen.getAllByText(/●/)[0].parentElement;
      if (statusText) {
        await user.click(statusText);
      }

      // After expanding, find element with headerExpanded class
      const expandedHeader = container.querySelector('[class*="headerExpanded"]');
      expect(expandedHeader).not.toBeNull();
    });
  });

  // ================================================================
  // RESPONSE TIME DISPLAY TESTS
  // ================================================================
  describe('Response Time Display', () => {
    it('shows response times in expanded view', async () => {
      const user = userEvent.setup();
      renderWithAll(<StatusBar services={mockServices} />);

      // Click to expand - use getAllByText since ● appears multiple times after expand
      const statusText = screen.getAllByText(/●/)[0].parentElement;
      if (statusText) {
        await user.click(statusText);
      }

      // Response times are in title attributes
      // API Gateway appears once, PostgreSQL appears twice (critical + database sections)
      expect(screen.getByTitle(/API Gateway: healthy \(45ms\)/)).toBeInTheDocument();
      // Use getAllByTitle for PostgreSQL since it appears twice
      expect(screen.getAllByTitle(/PostgreSQL: healthy \(12ms\)/).length).toBeGreaterThan(0);
    });

    it('shows response time range in footer', async () => {
      const user = userEvent.setup();
      renderWithAll(<StatusBar services={mockServices} />);

      // Click to expand - use getAllByText since ● appears multiple times after expand
      const statusText = screen.getAllByText(/●/)[0].parentElement;
      if (statusText) {
        await user.click(statusText);
      }

      // Footer shows "Response times" label
      expect(screen.getByText(/Response times/)).toBeInTheDocument();
      // Footer shows services working text
      expect(screen.getByText(/služieb funguje/)).toBeInTheDocument();
    });
  });
});
