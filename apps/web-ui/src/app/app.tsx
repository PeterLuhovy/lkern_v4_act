/*
 * ================================================================
 * FILE: app.tsx
 * PATH: /apps/web-ui/src/app/app.tsx
 * DESCRIPTION: Main application component with routing
 * VERSION: v3.1.0
 * CREATED: 2025-10-13
 * UPDATED: 2025-11-02
 * ================================================================
 */

import { Route, Routes } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { ToastContainer } from '@l-kern/ui-components';

// Test-only pages (development) - ALL testing pages in __tests__/pages/
import { TestingDashboard } from '../__tests__/pages/TestingDashboard';
import { FormsTestPage } from '../__tests__/pages/FormsTestPage';
import { BadgeTestPage } from '../__tests__/pages/BadgeTestPage';
import { CardTestPage } from '../__tests__/pages/CardTestPage';
import { EmptyStateTestPage } from '../__tests__/pages/EmptyStateTestPage';
import { SpinnerTestPage } from '../__tests__/pages/SpinnerTestPage';
import { UtilityTestPage } from '../__tests__/pages/UtilityTestPage';
import { WizardVariantsDemo } from '../__tests__/pages/WizardVariantsDemo';
import { TestModalV3Page } from '../__tests__/pages/TestModalV3Page';
import { GlassModalTestPage } from '../__tests__/pages/GlassModalTestPage';
import { ToastTestPage } from '../__tests__/pages/ToastTestPage';
import { IconsTest } from '../pages/IconsTest/IconsTest';

export function App() {
  return (
    <>
      <Routes>
        {/* Production routes */}
        <Route path="/" element={<HomePage />} />

        {/* Testing routes */}
        <Route path="/testing" element={<TestingDashboard />} />
        <Route path="/testing/forms" element={<FormsTestPage />} />
        <Route path="/testing/badge" element={<BadgeTestPage />} />
        <Route path="/testing/card" element={<CardTestPage />} />
        <Route path="/testing/empty-state" element={<EmptyStateTestPage />} />
        <Route path="/testing/spinner" element={<SpinnerTestPage />} />
        <Route path="/testing/utility" element={<UtilityTestPage />} />

        {/* Test-only routes (modal variants testing) */}
        <Route path="/testing/wizard-demo" element={<WizardVariantsDemo />} />
        <Route path="/testing/modal-v3" element={<TestModalV3Page />} />
        <Route path="/testing/glass-modal" element={<GlassModalTestPage />} />
        <Route path="/testing/toast" element={<ToastTestPage />} />
        <Route path="/testing/icons" element={<IconsTest />} />
      </Routes>
      <ToastContainer position="bottom-center" />
    </>
  );
}

export default App;
