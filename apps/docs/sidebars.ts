/*
 * ================================================================
 * FILE: sidebars.ts
 * PATH: /apps/docs/sidebars.ts
 * DESCRIPTION: Sidebar navigation configuration for documentation
 * VERSION: v2.0.0
 * UPDATED: 2025-12-16
 * CHANGELOG:
 *   v2.0.0 - Complete documentation structure after migration
 *   v1.0.0 - Initial minimal version
 * ================================================================
 */

import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: '🚀 Getting Started',
      link: { type: 'generated-index', description: 'Get started with L-KERN v4 development' },
      items: [
        'getting-started/getting-started',
        'getting-started/testing',
        'getting-started/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: '🏗️ Architecture',
      link: { type: 'generated-index', description: 'System architecture and design decisions' },
      items: [
        'architecture/system-overview',
        'architecture/microservices-architecture',
        'architecture/port-mapping',
      ],
    },
    {
      type: 'category',
      label: '💻 Development Guides',
      link: { type: 'generated-index', description: 'Coding standards and development guidelines' },
      items: [
        'guides/coding-standards',
        'guides/frontend-standards',
        'guides/backend-standards',
        'guides/docker-standards',
        'guides/documentation-standards',
        'guides/code-examples',
      ],
    },
    {
      type: 'category',
      label: '🧪 Testing',
      link: { type: 'generated-index', description: 'Testing strategies and best practices' },
      items: [
        'testing/testing-overview',
        'testing/testing-unit',
        'testing/testing-integration',
        'testing/testing-e2e',
        'testing/testing-visual',
        'testing/testing-best-practices',
      ],
    },
    {
      type: 'category',
      label: '📦 API Reference',
      link: { type: 'generated-index', description: 'Package documentation and API reference' },
      items: [
        'api/config',
        'api/ui-components',
        'api/components-reference',
        'api/utilities-reference',
      ],
    },
    {
      type: 'category',
      label: '🎨 Design',
      link: { type: 'generated-index', description: 'UI/UX design standards and guidelines' },
      items: [
        'design/design-standards',
      ],
    },
    {
      type: 'category',
      label: '📋 Project',
      link: { type: 'generated-index', description: 'Project overview and roadmap' },
      items: [
        'project/roadmap',
      ],
    },
    {
      type: 'category',
      label: '📝 Templates',
      link: { type: 'generated-index', description: 'Code templates for components, hooks, and utilities' },
      items: [
        'templates/index',
        'templates/component',
        'templates/hook',
        'templates/utility',
      ],
    },
  ],
};

export default sidebars;
