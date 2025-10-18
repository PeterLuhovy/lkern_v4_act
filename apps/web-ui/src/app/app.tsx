/*
 * ================================================================
 * FILE: app.tsx
 * PATH: /apps/web-ui/src/app/app.tsx
 * DESCRIPTION: Main application component with routing
 * VERSION: v3.0.0
 * CREATED: 2025-10-13
 * UPDATED: 2025-10-18
 * ================================================================
 */

import { Route, Routes } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { UtilityTestPage } from '../pages/UtilityTestPage';

// Testing pages
import { TestingDashboard } from '../pages/testing/TestingDashboard';
import { FormsTestPage } from '../pages/testing/FormsTestPage';
import { BadgeTestPage } from '../pages/testing/BadgeTestPage';
import { CardTestPage } from '../pages/testing/CardTestPage';
import { EmptyStateTestPage } from '../pages/testing/EmptyStateTestPage';
import { SpinnerTestPage } from '../pages/testing/SpinnerTestPage';

// Test-only pages (development)
import { WizardVariantsDemo } from '../__tests__/pages/WizardVariantsDemo';

export function App() {
  return (
    <Routes>
      {/* Production routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/utility-test" element={<UtilityTestPage />} />

      {/* Testing routes */}
      <Route path="/testing" element={<TestingDashboard />} />
      <Route path="/testing/forms" element={<FormsTestPage />} />
      <Route path="/testing/badge" element={<BadgeTestPage />} />
      <Route path="/testing/card" element={<CardTestPage />} />
      <Route path="/testing/empty-state" element={<EmptyStateTestPage />} />
      <Route path="/testing/spinner" element={<SpinnerTestPage />} />

      {/* Test-only routes (modal variants testing) */}
      <Route path="/testing/wizard-demo" element={<WizardVariantsDemo />} />
    </Routes>
  );
}

export default App;
