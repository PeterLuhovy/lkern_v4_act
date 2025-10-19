import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TranslationProvider, ThemeProvider } from '@l-kern/config';
import App from './app';
import React from 'react';

// Test wrapper with all required providers
const renderWithProviders = (component: React.ReactElement) => {
  // Cast providers to any to avoid React 19 type issues in tests
  const ThemeProviderAny = ThemeProvider as any;
  const TranslationProviderAny = TranslationProvider as any;

  return render(
    <ThemeProviderAny>
      <TranslationProviderAny>
        <BrowserRouter>
          {component}
        </BrowserRouter>
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
