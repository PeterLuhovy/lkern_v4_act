/*
 * ================================================================
 * FILE: sidebars.ts
 * PATH: /apps/docs/sidebars.ts
 * DESCRIPTION: Sidebar navigation configuration for documentation
 * VERSION: v1.0.0
 * UPDATED: 2025-12-12
 * ================================================================
 */

import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  // Minimálna verzia - plná štruktúra sa pridá po migrácii docs (Fáza 3)
  docsSidebar: [
    'intro',
    // TODO: Po migrácii docs pridať kategórie:
    // - Getting Started (installation, docker-setup, testing, troubleshooting)
    // - Architecture (overview, microservices, port-mapping)
    // - Development Guides (coding-standards, frontend/backend/docker-standards)
    // - API Reference (config-package, ui-components)
    // - Design (design-standards)
  ],
};

export default sidebars;
