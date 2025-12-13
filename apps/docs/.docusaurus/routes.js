import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/en/',
    component: ComponentCreator('/en/', '48b'),
    routes: [
      {
        path: '/en/',
        component: ComponentCreator('/en/', '59d'),
        routes: [
          {
            path: '/en/',
            component: ComponentCreator('/en/', 'f23'),
            routes: [
              {
                path: '/en/',
                component: ComponentCreator('/en/', '5a7'),
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
