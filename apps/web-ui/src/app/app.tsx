/*
 * ================================================================
 * FILE: app.tsx
 * PATH: /apps/web-ui/src/app/app.tsx
 * DESCRIPTION: Main application component with routing
 * VERSION: v2.0.0
 * CREATED: 2025-10-13
 * UPDATED: 2025-10-18
 * ================================================================
 */

import { Route, Routes } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { TestingPage } from '../pages/TestingPage';
import { BadgeDemo } from '../pages/BadgeDemo';
import { UtilityTestPage } from '../pages/UtilityTestPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/testing" element={<TestingPage />} />
      <Route path="/badge-demo" element={<BadgeDemo />} />
      <Route path="/utility-test" element={<UtilityTestPage />} />
    </Routes>
  );
}

export default App;
