import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TranslationProvider, ThemeProvider, ToastProvider, AnalyticsProvider, AuthProvider } from '@l-kern/config';
import App from './app';
import React from 'react';

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
    // Simulate connection
    setTimeout(() => {
      this.readyState = MockEventSource.OPEN;
    }, 0);
  }

  addEventListener(_type: string, _listener: EventListener): void { /* noop */ }
  removeEventListener(_type: string, _listener: EventListener): void { /* noop */ }
  dispatchEvent(_event: Event): boolean { return true; }
  close(): void {
    this.readyState = MockEventSource.CLOSED;
  }
}

// @ts-expect-error - Mock EventSource globally for tests
globalThis.EventSource = MockEventSource;

// Test wrapper with all required providers
const renderWithProviders = (component: React.ReactElement) => {
  // Cast providers to any to avoid React 19 type issues in tests
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Workaround for React 19 provider type incompatibility in tests
  const ThemeProviderAny = ThemeProvider as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Workaround for React 19 provider type incompatibility in tests
  const TranslationProviderAny = TranslationProvider as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Workaround for React 19 provider type incompatibility in tests
  const ToastProviderAny = ToastProvider as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Workaround for React 19 provider type incompatibility in tests
  const AnalyticsProviderAny = AnalyticsProvider as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Workaround for React 19 provider type incompatibility in tests
  const AuthProviderAny = AuthProvider as any;

  return render(
    <ThemeProviderAny>
      <TranslationProviderAny>
        <ToastProviderAny>
          <AnalyticsProviderAny>
            <AuthProviderAny>
              <BrowserRouter>
                {component}
              </BrowserRouter>
            </AuthProviderAny>
          </AnalyticsProviderAny>
        </ToastProviderAny>
      </TranslationProviderAny>
    </ThemeProviderAny>
  );
};

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(<App />);
    expect(baseElement).toBeTruthy();
  });

  it('should have a greeting as the title', () => {
    const { getByRole } = renderWithProviders(<App />);
    const heading = getByRole('heading', { name: /L-KERN v4/i, level: 1 });
    expect(heading).toBeTruthy();
  });
});
