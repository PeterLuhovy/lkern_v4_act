/*
 * ================================================================
 * FILE: Contacts.spec.tsx
 * PATH: apps/web-ui/src/pages/Contacts/Contacts.spec.tsx
 * DESCRIPTION: Vitest tests for Contacts page
 * VERSION: v1.0.0
 * UPDATED: 2025-12-19
 * ================================================================
 */

import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import {
  TranslationProvider,
  ThemeProvider,
  ToastProvider,
  AnalyticsProvider,
  AuthProvider,
} from '@l-kern/config';
import { Contacts } from './Contacts';
import React from 'react';
import { vi, describe, it, expect, beforeAll, afterEach } from 'vitest';

// Mock EventSource for jsdom environment (useSSEInvalidation uses it)
class MockEventSource {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSED = 2;

  readonly CONNECTING = 0;
  readonly OPEN = 1;
  readonly CLOSED = 2;

  readyState = MockEventSource.CONNECTING;
  url: string;
  withCredentials = false;

  onopen: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;

  constructor(url: string) {
    this.url = url;
    setTimeout(() => {
      this.readyState = MockEventSource.OPEN;
    }, 0);
  }

  addEventListener(_type: string, _listener: EventListener): void {
    /* noop */
  }
  removeEventListener(_type: string, _listener: EventListener): void {
    /* noop */
  }
  dispatchEvent(_event: Event): boolean {
    return true;
  }
  close(): void {
    this.readyState = MockEventSource.CLOSED;
  }
}

// @ts-expect-error - Mock EventSource globally for tests
globalThis.EventSource = MockEventSource;

// Mock fetch for API calls
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

// Mock contacts data
const mockContacts = {
  items: [
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      contact_code: 'CON-000001',
      contact_type: 'person',
      display_name: 'Ján Novák',
      primary_email: 'jan.novak@example.com',
      primary_phone: '+421 900 123 456',
      roles: 'Zákazník, Partner',
      created_at: '2025-01-15T10:30:00Z',
      is_deleted: false,
    },
    {
      id: '223e4567-e89b-12d3-a456-426614174001',
      contact_code: 'CON-000002',
      contact_type: 'company',
      display_name: 'ACME s.r.o.',
      primary_email: 'info@acme.sk',
      primary_phone: '+421 2 1234 5678',
      roles: 'Dodávateľ',
      created_at: '2025-01-16T14:20:00Z',
      is_deleted: false,
    },
  ],
  total: 2,
  page: 1,
  size: 10,
};

// Test wrapper with all required providers
const renderWithProviders = (component: React.ReactElement) => {
  // Cast providers to any to avoid React 19 type issues in tests
  /* eslint-disable @typescript-eslint/no-explicit-any -- Workaround for React 19 provider type incompatibility in tests */
  const ThemeProviderAny = ThemeProvider as any;
  const TranslationProviderAny = TranslationProvider as any;
  const ToastProviderAny = ToastProvider as any;
  const AnalyticsProviderAny = AnalyticsProvider as any;
  const AuthProviderAny = AuthProvider as any;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return render(
    <ThemeProviderAny>
      <TranslationProviderAny>
        <ToastProviderAny>
          <AnalyticsProviderAny>
            <AuthProviderAny>
              <BrowserRouter>{component}</BrowserRouter>
            </AuthProviderAny>
          </AnalyticsProviderAny>
        </ToastProviderAny>
      </TranslationProviderAny>
    </ThemeProviderAny>
  );
};

describe('Contacts Page', () => {
  beforeAll(() => {
    // Setup default fetch mock
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockContacts),
    });
  });

  afterEach(() => {
    mockFetch.mockClear();
  });

  // ============================================================
  // RENDERING TESTS
  // ============================================================

  it('should render contacts page successfully', async () => {
    const { baseElement } = renderWithProviders(<Contacts />);
    expect(baseElement).toBeTruthy();
  });

  it('should display page title', async () => {
    renderWithProviders(<Contacts />);
    // Title is translated - check for the key or both SK/EN values
    await waitFor(() => {
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toBeTruthy();
    });
  });

  it('should display search placeholder', async () => {
    renderWithProviders(<Contacts />);
    await waitFor(() => {
      const searchInput = screen.getByRole('searchbox');
      expect(searchInput).toBeTruthy();
    });
  });

  // ============================================================
  // DATA LOADING TESTS
  // ============================================================

  it('should call API to fetch contacts on mount', async () => {
    renderWithProviders(<Contacts />);
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/contacts')
      );
    });
  });

  it('should display contacts from API', async () => {
    renderWithProviders(<Contacts />);
    await waitFor(() => {
      // Check for contact code in the grid
      expect(screen.getByText('CON-000001')).toBeTruthy();
    });
  });

  it('should display contact names', async () => {
    renderWithProviders(<Contacts />);
    await waitFor(() => {
      expect(screen.getByText('Ján Novák')).toBeTruthy();
      expect(screen.getByText('ACME s.r.o.')).toBeTruthy();
    });
  });

  // ============================================================
  // FILTER TESTS
  // ============================================================

  it('should display quick filter buttons', async () => {
    renderWithProviders(<Contacts />);
    await waitFor(() => {
      // Quick filters are shown with emojis
      expect(screen.getByText(/Osoby/i)).toBeTruthy();
      expect(screen.getByText(/Firmy/i)).toBeTruthy();
    });
  });

  // ============================================================
  // BUTTON TESTS
  // ============================================================

  it('should display new contact button', async () => {
    renderWithProviders(<Contacts />);
    await waitFor(() => {
      const newButton = screen.getByText(/Nový kontakt|New Contact/i);
      expect(newButton).toBeTruthy();
    });
  });

  // ============================================================
  // TRANSLATION TESTS
  // ============================================================

  it('should use translated column headers', async () => {
    renderWithProviders(<Contacts />);
    await waitFor(() => {
      // Check for translated column names (SK or EN)
      expect(screen.getByText(/Názov|Name/)).toBeTruthy();
      expect(screen.getByText(/Typ|Type/)).toBeTruthy();
    });
  });

  // ============================================================
  // ERROR HANDLING TESTS
  // ============================================================

  it('should handle API error gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    renderWithProviders(<Contacts />);
    // Page should still render even if API fails (uses mock data as fallback)
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeTruthy();
    });
  });

  it('should handle empty API response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ items: [], total: 0, page: 1, size: 10 }),
    });
    renderWithProviders(<Contacts />);
    // Page should render with empty state
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeTruthy();
    });
  });
});
