import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { TranslationProvider, ThemeProvider, ToastProvider, AuthProvider, AnalyticsProvider } from '@l-kern/config';
import { setupTheme } from './theme-setup';
import App from './app/app';

// Setup theme CSS from design tokens
setupTheme();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <ThemeProvider defaultTheme="light">
      <TranslationProvider defaultLanguage="sk">
        <AuthProvider>
          <AnalyticsProvider>
            <ToastProvider maxToasts={5}>
              <BrowserRouter
                future={{
                  v7_startTransition: true,
                  v7_relativeSplatPath: true,
                }}
              >
                <App />
              </BrowserRouter>
            </ToastProvider>
          </AnalyticsProvider>
        </AuthProvider>
      </TranslationProvider>
    </ThemeProvider>
  </StrictMode>,
);
