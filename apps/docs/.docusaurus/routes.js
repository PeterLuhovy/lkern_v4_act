import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', '345'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', '138'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', '33d'),
            routes: [
              {
                path: '/api/components-reference',
                component: ComponentCreator('/api/components-reference', '290'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/api/config',
                component: ComponentCreator('/api/config', '873'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/api/ui-components',
                component: ComponentCreator('/api/ui-components', 'eaf'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/api/utilities-reference',
                component: ComponentCreator('/api/utilities-reference', '05f'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/microservices-architecture',
                component: ComponentCreator('/architecture/microservices-architecture', '49c'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/port-mapping',
                component: ComponentCreator('/architecture/port-mapping', '174'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/architecture/system-overview',
                component: ComponentCreator('/architecture/system-overview', '5ec'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/category/-api-reference',
                component: ComponentCreator('/category/-api-reference', '2d4'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/category/️-architecture',
                component: ComponentCreator('/category/️-architecture', '781'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/category/-design',
                component: ComponentCreator('/category/-design', '432'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/category/-development-guides',
                component: ComponentCreator('/category/-development-guides', '548'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/category/-getting-started',
                component: ComponentCreator('/category/-getting-started', '4e1'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/category/-project',
                component: ComponentCreator('/category/-project', '9dc'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/category/-templates',
                component: ComponentCreator('/category/-templates', '59b'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/category/-testing',
                component: ComponentCreator('/category/-testing', 'e4a'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/design/design-standards',
                component: ComponentCreator('/design/design-standards', 'e7a'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/getting-started/',
                component: ComponentCreator('/getting-started/', '813'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/getting-started/testing',
                component: ComponentCreator('/getting-started/testing', 'c56'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/getting-started/troubleshooting',
                component: ComponentCreator('/getting-started/troubleshooting', '24c'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/guides/backend-standards',
                component: ComponentCreator('/guides/backend-standards', '51a'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/guides/code-examples',
                component: ComponentCreator('/guides/code-examples', '11a'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/guides/coding-standards',
                component: ComponentCreator('/guides/coding-standards', '6dc'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/guides/docker-standards',
                component: ComponentCreator('/guides/docker-standards', '8a7'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/guides/documentation-standards',
                component: ComponentCreator('/guides/documentation-standards', '98b'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/guides/frontend-standards',
                component: ComponentCreator('/guides/frontend-standards', 'fd6'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/project/roadmap',
                component: ComponentCreator('/project/roadmap', '9da'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/templates/',
                component: ComponentCreator('/templates/', 'a73'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/templates/component',
                component: ComponentCreator('/templates/component', '556'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/templates/hook',
                component: ComponentCreator('/templates/hook', '5b3'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/templates/utility',
                component: ComponentCreator('/templates/utility', 'a50'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/testing/testing-best-practices',
                component: ComponentCreator('/testing/testing-best-practices', '503'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/testing/testing-e2e',
                component: ComponentCreator('/testing/testing-e2e', '2c2'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/testing/testing-integration',
                component: ComponentCreator('/testing/testing-integration', 'e17'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/testing/testing-overview',
                component: ComponentCreator('/testing/testing-overview', '2e0'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/testing/testing-unit',
                component: ComponentCreator('/testing/testing-unit', '97b'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/testing/testing-visual',
                component: ComponentCreator('/testing/testing-visual', '49e'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/',
                component: ComponentCreator('/', 'b56'),
                exact: true,
                sidebar: "docsSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
