/*
 * ================================================================
 * FILE: TemplatePageDatagridDemo.tsx
 * PATH: /apps/web-ui/src/__tests__/_templates/TemplatePageDatagridDemo/TemplatePageDatagridDemo.tsx
 * DESCRIPTION: Demo wrapper for TemplatePageDatagrid template
 * VERSION: v2.0.0
 * UPDATED: 2025-11-23
 *
 * CHANGELOG v2.0.0:
 * - Simplified to import and render TemplatePageDatagrid component
 * - Eliminates code duplication
 * - Ensures demo always uses latest template implementation
 * ================================================================
 */

import { TemplatePageDatagrid } from '../../../pages/_templates/TemplatePageDatagrid/TemplatePageDatagrid';

/**
 * TemplatePageDatagridDemo Component
 *
 * Demo wrapper that renders the TemplatePageDatagrid template component.
 * Used for testing and showcasing the template in development environment.
 *
 * Route: /testing/template-page-datagrid
 */
export function TemplatePageDatagridDemo() {
  return <TemplatePageDatagrid />;
}
