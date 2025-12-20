/*
 * ================================================================
 * FILE: docusaurus.config.ts
 * PATH: /apps/docs/docusaurus.config.ts
 * DESCRIPTION: Docusaurus configuration for L-KERN v4 documentation
 * VERSION: v1.1.0
 * UPDATED: 2025-12-19
 * ================================================================
 */

import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'L-KERN v4 Documentation',
  tagline: 'Business Operating System Software',
  favicon: 'img/favicon.ico',

  // Production URL
  url: 'http://localhost',
  baseUrl: '/',

  // GitHub pages deployment config (if needed)
  organizationName: 'bossystems',
  projectName: 'l-kern-v4',

  // Changed from 'throw' to 'warn' to allow build with placeholder links
  // TODO: Change back to 'throw' when all documentation pages are created
  onBrokenLinks: 'warn',
  // NOTE: onBrokenMarkdownLinks will be deprecated in Docusaurus v4
  // Migrate to markdown.hooks.onBrokenMarkdownLinks when upgrading to v4
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'sk',
    locales: ['sk', 'en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/', // Docs at root
        },
        blog: false, // Disable blog
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/social-card.jpg',
    navbar: {
      title: 'L-KERN v4',
      logo: {
        alt: 'L-KERN Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: '/storybook/',
          label: 'Components',
          position: 'left',
        },
        {
          href: 'http://localhost:4201',
          label: 'Web UI',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/getting-started',
            },
            {
              label: 'Architecture',
              to: '/architecture/microservices-architecture',
            },
          ],
        },
        {
          title: 'Development',
          items: [
            {
              label: 'Coding Standards',
              to: '/guides/coding-standards',
            },
            {
              label: 'Components',
              href: '/storybook/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} BOSSystems s.r.o.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'yaml', 'python', 'docker'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
