#!/usr/bin/env node

/*
 * ================================================================
 * FILE: generate-page.js
 * PATH: /scripts/page-generator/generate-page.js
 * DESCRIPTION: Generator for DataGrid pages from template
 * VERSION: v1.6.0
 * UPDATED: 2025-12-20
 *
 * NEW in v1.6.0:
 * - Added apiBaseUrl config option for mock/API mode switching
 * - apiBaseUrl: null → Mock Data mode (for development/testing)
 * - apiBaseUrl: "http://localhost:4101" → Real API mode (for production)
 *
 * USAGE:
 * node scripts/page-generator/generate-page.js configs/config.json
 * OR
 * npm run generate:page -- configs/config.json
 *
 * CONFIG FORMAT: See configs/orders-page.json
 * ================================================================
 */

const fs = require('fs');
const path = require('path');

// ============================================================
// CONFIGURATION
// ============================================================

const TEMPLATE_DIR = path.join(__dirname, '..', '..', 'apps', 'web-ui', 'src', 'pages', '_templates', 'TemplatePageDatagrid');
const PAGES_DIR = path.join(__dirname, '..', '..', 'apps', 'web-ui', 'src', 'pages');
const TRANSLATIONS_DIR = path.join(__dirname, '..', '..', 'packages', 'config', 'src', 'translations');

// Injection target files
const APP_TSX_PATH = path.join(__dirname, '..', '..', 'apps', 'web-ui', 'src', 'app', 'App.tsx');
const SK_TS_PATH = path.join(TRANSLATIONS_DIR, 'sk.ts');
const EN_TS_PATH = path.join(TRANSLATIONS_DIR, 'en.ts');
const TYPES_TS_PATH = path.join(TRANSLATIONS_DIR, 'types.ts');

// ============================================================
// UTILITIES
// ============================================================

/**
 * Read file content
 */
function readFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf-8');
}

/**
 * Write file content
 */
function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ Created: ${filePath}`);
}

/**
 * Convert PascalCase to camelCase
 */
function toCamelCase(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

/**
 * Convert PascalCase to kebab-case
 */
function toKebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

// ============================================================
// GENERATOR
// ============================================================

/**
 * Generate page from template
 */
function generatePage(config) {
  console.log('\n🚀 Generating DataGrid page...\n');

  const {
    entityName,          // e.g., "Orders"
    entityNameSingular,  // e.g., "Order"
    routePath,           // e.g., "/orders"
    columns,             // Array of column definitions
    features = {},       // Optional features
    apiBaseUrl = null,   // e.g., "http://localhost:4101" - null = mock mode
  } = config;

  // Determine if using real API or mock data
  const useRealApi = apiBaseUrl !== null && apiBaseUrl !== undefined && apiBaseUrl !== '';
  console.log(`📡 Data mode: ${useRealApi ? `API (${apiBaseUrl})` : 'Mock Data'}`);

  // Derived names
  const entityLower = toCamelCase(entityName); // orders
  const entityKebab = toKebabCase(entityName); // orders

  // ============================================================
  // 1. GENERATE TSX FILE
  // ============================================================

  const templateTsx = readFile(path.join(TEMPLATE_DIR, 'TemplatePageDatagrid.tsx'));

  let generatedTsx = templateTsx;

  // Replace entity names
  generatedTsx = generatedTsx.replace(/TemplatePageDatagrid/g, entityName);
  generatedTsx = generatedTsx.replace(/TemplateItem/g, entityNameSingular);
  generatedTsx = generatedTsx.replace(/template/g, entityLower);
  generatedTsx = generatedTsx.replace(/Template/g, entityName);

  // Replace file header
  generatedTsx = generatedTsx.replace(
    /FILE: TemplatePageDatagrid\.tsx/,
    `FILE: ${entityName}.tsx`
  );
  generatedTsx = generatedTsx.replace(
    /PATH: \/apps\/web-ui\/src\/pages\/TemplatePageDatagrid\/TemplatePageDatagrid\.tsx/,
    `PATH: /apps/web-ui/src/pages/${entityName}/${entityName}.tsx`
  );
  generatedTsx = generatedTsx.replace(
    /DESCRIPTION: Universal template for DataGrid pages with FilteredDataGrid/,
    `DESCRIPTION: ${entityName} page with FilteredDataGrid`
  );

  // Remove template usage comments
  const usageStart = generatedTsx.indexOf('📖 USAGE:');
  const usageEnd = generatedTsx.indexOf('* ================================================================', usageStart);
  if (usageStart !== -1 && usageEnd !== -1) {
    generatedTsx = generatedTsx.substring(0, usageStart) + generatedTsx.substring(usageEnd);
  }

  // Replace interface fields (columns)
  const interfaceFieldsOld = `  id: string;
  name: string;
  email: string;
  status: 'active' | 'pending' | 'inactive';
  priority: 'low' | 'medium' | 'high';
  value: number;
  date: string;
  is_deleted: boolean;`;

  const interfaceFieldsNew = columns.map(col => {
    if (col.type === 'status') {
      return `  ${col.field}: ${col.options.map(o => `'${o}'`).join(' | ')};`;
    } else if (col.type === 'number') {
      return `  ${col.field}: number;`;
    } else if (col.type === 'boolean') {
      return `  ${col.field}: boolean;`;
    } else {
      return `  ${col.field}: string;`;
    }
  }).join('\n  ');

  generatedTsx = generatedTsx.replace(interfaceFieldsOld, interfaceFieldsNew);

  // ============================================================
  // GENERATE MOCK DATA
  // ============================================================

  function generateMockValue(col, index) {
    if (col.type === 'status' && col.options) {
      return `'${col.options[index % col.options.length]}'`;
    } else if (col.type === 'number') {
      return Math.floor(Math.random() * 10000) + 1000;
    } else if (col.type === 'boolean') {
      return index % 2 === 0 ? 'true' : 'false';
    } else if (col.field === 'id') {
      return `'${entityName.toUpperCase().substring(0, 3)}-${String(index + 1).padStart(3, '0')}'`;
    } else if (col.field.toLowerCase().includes('date')) {
      const date = new Date();
      date.setDate(date.getDate() + index * 5);
      return `'${date.toISOString().split('T')[0]}'`;
    } else if (col.field.toLowerCase().includes('email')) {
      return `'user${index + 1}@example.com'`;
    } else {
      // Default string value
      return `'Sample ${col.field} ${index + 1}'`;
    }
  }

  const mockDataItems = Array.from({ length: 5 }, (_, i) => {
    const fields = columns.map(col => {
      // Always include id field (required for selection), skip other hidden columns
      if (col.hidden && col.field !== 'id') return null;
      return `${col.field}: ${generateMockValue(col, i)}`;
    }).filter(Boolean).join(', ');
    return `  { ${fields} }`;
  }).join(',\n');

  const mockDataOld = /const mockData: \w+\[\] = \[[^\]]+\];/s;
  const mockDataNew = `const mockData: ${entityNameSingular}[] = [\n${mockDataItems}\n];`;
  generatedTsx = generatedTsx.replace(mockDataOld, mockDataNew);

  // ============================================================
  // CONFIGURE API/MOCK MODE
  // ============================================================

  if (useRealApi) {
    // OPTION B: Real API mode - uncomment API code, comment mock code

    // 1. Uncomment SERVICE_ENDPOINTS
    generatedTsx = generatedTsx.replace(
      /\/\/ const SERVICE_ENDPOINTS = \{[\s\S]*?\/\/ \};/,
      `const SERVICE_ENDPOINTS = {\n  baseUrl: '${apiBaseUrl}',\n};`
    );

    // 2. Comment out OPTION A (Mock Data)
    generatedTsx = generatedTsx.replace(
      /\/\/ OPTION A: Mock Data \(DEFAULT\)\n  const \[items\] = useState<\w+\[\]>\(mockData\);\n  const \[isLoading\] = useState\(false\);\n  const \[apiError\] = useState<string \| null>\(null\);/,
      `// OPTION A: Mock Data (DISABLED - using real API)\n  // const [items] = useState<${entityNameSingular}[]>(mockData);\n  // const [isLoading] = useState(false);\n  // const [apiError] = useState<string | null>(null);`
    );

    // 3. Uncomment OPTION B (Real API) - remove comment slashes
    generatedTsx = generatedTsx.replace(
      /\/\/ OPTION B: Real API \(UNCOMMENT FOR PRODUCTION\)\n  \/\/ const \[items, setItems\]/,
      `// OPTION B: Real API (ACTIVE)\n  const [items, setItems]`
    );
    // Uncomment all lines in OPTION B section
    generatedTsx = generatedTsx.replace(
      /\/\/ const \[items, setItems\] = useState<\w+\[\]>\(\[\]\);/,
      `const [items, setItems] = useState<${entityNameSingular}[]>([]);`
    );
    generatedTsx = generatedTsx.replace(
      /\/\/ const \[isLoading, setIsLoading\] = useState\(true\);/,
      `const [isLoading, setIsLoading] = useState(true);`
    );
    generatedTsx = generatedTsx.replace(
      /\/\/ const \[apiError, setApiError\] = useState<string \| null>\(null\);/,
      `const [apiError, setApiError] = useState<string | null>(null);`
    );

    // 4. Uncomment fetchItems function (multi-line)
    // First, find the commented fetchItems block and uncomment it
    const fetchItemsPattern = /\/\/\s*\/\*\*\s*\n\s*\/\/\s*\* Fetch items from API[\s\S]*?\/\/\s*\}, \[analyticsSettings\.logToConsole\]\);/;
    const fetchItemsMatch = generatedTsx.match(fetchItemsPattern);
    if (fetchItemsMatch) {
      const uncommented = fetchItemsMatch[0]
        .split('\n')
        .map(line => line.replace(/^\s*\/\/\s?/, '  '))
        .join('\n');
      generatedTsx = generatedTsx.replace(fetchItemsPattern, uncommented);
    }

    // 5. Uncomment useEffect
    generatedTsx = generatedTsx.replace(
      /\/\/\s*\/\/ Load items on mount only[\s\S]*?\/\/\s*\}, \[\]\);/,
      `// Load items on mount only (empty deps = run once)\n  useEffect(() => {\n    fetchItems();\n    // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, []);`
    );

    // 6. Update API endpoint in fetchItems
    generatedTsx = generatedTsx.replace(
      /\$\{SERVICE_ENDPOINTS\.baseUrl\}\/items\/\?limit=100/g,
      `\${SERVICE_ENDPOINTS.baseUrl}/${entityLower}/?limit=100`
    );

    // 7. Update log messages
    generatedTsx = generatedTsx.replace(
      /\[Template\]/g,
      `[${entityName}]`
    );

    console.log('✅ API mode configured');
  } else {
    console.log('✅ Mock data mode configured (default)');
  }

  // ============================================================
  // GENERATE COLUMNS DEFINITIONS
  // ============================================================

  const columnsDefOld = /const columns = \[[^\]]+\];/s;
  const columnsDefNew = `const columns = [\n${columns.filter(col => !col.hidden).map(col => {
    // Determine render function based on column type
    let renderFn = null;
    if (col.render === 'currency') {
      renderFn = '      render: (value: number) => `$${value.toLocaleString()}`';
    } else if (col.type === 'status') {
      // Status columns should render translated labels
      renderFn = `      render: (value: string) => t('pages.${entityLower}.statuses.' + value) || value`;
    }

    const parts = [
      `      title: t('pages.${entityLower}.columns.${col.field}')`,
      `      field: '${col.field}'`,
      col.sortable ? '      sortable: true' : null,
      col.width ? `      width: ${col.width}` : null,
      renderFn,
    ].filter(Boolean).join(',\n');
    return `    {\n${parts}\n    }`;
  }).join(',\n')}\n  ];`;
  generatedTsx = generatedTsx.replace(columnsDefOld, columnsDefNew);

  // ============================================================
  // GENERATE STATUS COLORS & LABELS (from config.statuses)
  // ============================================================

  // Check for explicit statuses in config, fallback to status column options
  const statusCol = columns.find(col => col.type === 'status' && col.field === 'status');
  const configStatuses = config.statuses || null;

  // Default color mapping for common status values
  const defaultColorMap = {
    'active': 'COLORS.status.success',
    'pending': 'COLORS.status.warning',
    'inactive': 'COLORS.status.error',
    'completed': 'COLORS.status.info',
    'cancelled': 'COLORS.status.muted',
    'draft': 'COLORS.status.warning',
    'published': 'COLORS.status.success',
    'archived': 'COLORS.status.muted',
    'open': 'COLORS.status.success',
    'closed': 'COLORS.status.muted',
    'resolved': 'COLORS.status.info',
    'rejected': 'COLORS.status.error',
    'assigned': 'COLORS.status.warning',
    'in_progress': 'COLORS.status.info',
  };

  if (configStatuses) {
    // Use explicit statuses from config
    const statusColorsOld = /const statusColors = \{[^\}]+\};/s;
    const statusColorsNew = `const statusColors = {\n${Object.entries(configStatuses).map(([key, status]) =>
      `    ${key}: ${status.color.startsWith('COLORS.') ? status.color : `'${status.color}'`}`
    ).join(',\n')},\n    deleted: theme === 'light' ? COLORS.status.inactiveLight : COLORS.status.inactive, // Deleted items - theme-aware red\n  };`;
    generatedTsx = generatedTsx.replace(statusColorsOld, statusColorsNew);

    // Generate statusLabels
    const statusLabelsOld = /const statusLabels = \{[^\}]+\};/s;
    const statusLabelsNew = `const statusLabels = {\n${Object.entries(configStatuses).map(([key]) =>
      `    ${key}: t('pages.${entityLower}.statuses.${key}')`
    ).join(',\n')},\n  };`;
    generatedTsx = generatedTsx.replace(statusLabelsOld, statusLabelsNew);
  } else if (statusCol && statusCol.options) {
    // Fallback to status column options (legacy behavior)
    const statusColorsOld = /const statusColors = \{[^\}]+\};/s;
    const statusColorsNew = `const statusColors = {\n${statusCol.options.map(opt =>
      `    ${opt}: ${defaultColorMap[opt] || 'COLORS.status.muted'}`
    ).join(',\n')},\n    deleted: theme === 'light' ? COLORS.status.inactiveLight : COLORS.status.inactive, // Deleted items - theme-aware red\n  };`;
    generatedTsx = generatedTsx.replace(statusColorsOld, statusColorsNew);

    // Generate statusLabels from column options
    const statusLabelsOld = /const statusLabels = \{[^\}]+\};/s;
    const statusLabelsNew = `const statusLabels = {\n${statusCol.options.map(opt =>
      `    ${opt}: t('pages.${entityLower}.filters.status${opt.charAt(0).toUpperCase() + opt.slice(1)}')`
    ).join(',\n')},\n  };`;
    generatedTsx = generatedTsx.replace(statusLabelsOld, statusLabelsNew);
  }

  // ============================================================
  // GENERATE FILTERS (from config.filters)
  // ============================================================

  // Match entire filters block from declaration to QUICK FILTERS comment
  const filtersBlockStart = generatedTsx.indexOf('const filters: FilterConfig[]');
  const filtersBlockEnd = generatedTsx.indexOf('// ============================================================\n  // QUICK FILTERS');

  if (filtersBlockStart !== -1 && filtersBlockEnd !== -1) {
    const beforeFilters = generatedTsx.substring(0, filtersBlockStart);
    const afterFilters = generatedTsx.substring(filtersBlockEnd);

    let filtersNew;
    if (config.filters && config.filters.length > 0) {
      // Generate filters array from config
      filtersNew = `const filters: FilterConfig[] = [\n${config.filters.map(filter => {
        const optionsStr = filter.options.map(opt =>
          `      { value: '${opt.value}', label: t('pages.${entityLower}.filters.${filter.translationPrefix || filter.field}${opt.value.charAt(0).toUpperCase() + opt.value.slice(1).replace(/_./g, m => m[1].toUpperCase())}') }`
        ).join(',\n');
        return `    {\n      field: '${filter.field}',\n      title: t('pages.${entityLower}.filters.${filter.translationPrefix || filter.field}Title'),\n      options: [\n${optionsStr},\n      ],\n    }`;
      }).join(',\n')}\n  ];\n\n  `;
    } else {
      // No filters configured - generate empty array
      filtersNew = `const filters: FilterConfig[] = [];\n\n  `;
    }

    generatedTsx = beforeFilters + filtersNew + afterFilters;
  }

  // ============================================================
  // GENERATE QUICK FILTERS (from config.quickFilters)
  // ============================================================

  // Match entire quickFilters block from declaration to COLUMNS comment
  const quickFiltersBlockStart = generatedTsx.indexOf('const quickFilters: QuickFilterConfig[]');
  const quickFiltersBlockEnd = generatedTsx.indexOf('// ============================================================\n  // COLUMNS');

  if (quickFiltersBlockStart !== -1 && quickFiltersBlockEnd !== -1) {
    const beforeQuickFilters = generatedTsx.substring(0, quickFiltersBlockStart);
    const afterQuickFilters = generatedTsx.substring(quickFiltersBlockEnd);

    let quickFiltersNew;
    if (config.quickFilters && config.quickFilters.length > 0) {
      // Generate quickFilters array from config
      quickFiltersNew = `const quickFilters: QuickFilterConfig[] = [\n${config.quickFilters.map(qf => {
        return `    {\n      id: '${qf.id}',\n      label: t('pages.${entityLower}.quickFilters.${qf.id.replace(/-./g, m => m[1].toUpperCase())}'),\n      filterFn: (item: ${entityNameSingular}) => ${qf.filterFn},\n    }`;
      }).join(',\n')}\n  ];\n\n  `;
    } else {
      // No quick filters configured - generate empty array
      quickFiltersNew = `const quickFilters: QuickFilterConfig[] = [];\n\n  `;
    }

    generatedTsx = beforeQuickFilters + quickFiltersNew + afterQuickFilters;
  }

  // ============================================================
  // FIX GET ROW STATUS - Use configurable statusField
  // ============================================================

  // Use statusField from config (default: 'status') for row coloring
  const statusField = config.statusField || 'status';
  const getRowStatusOld = /getRowStatus=\{\(row\) => row\.is_deleted \? 'inactive' : row\.status\}/;
  const getRowStatusNew = `getRowStatus={(row) => row.is_deleted ? 'deleted' : row.${statusField}}`;
  generatedTsx = generatedTsx.replace(getRowStatusOld, getRowStatusNew);

  // ============================================================
  // FIX ACTIONS - Replace item.name with first string field
  // ============================================================

  const firstStringField = columns.find(col => col.type === 'string' && col.field !== 'id');
  if (firstStringField) {
    // Replace in edit action
    generatedTsx = generatedTsx.replace(
      /alert\(`\$\{t\('common\.edit'\)\}: \$\{item\.name\}`\);/,
      `alert(\`\${t('common.edit')}: \${item.${firstStringField.field}}\`);`
    );
    // Replace in view action
    generatedTsx = generatedTsx.replace(
      /alert\(`\$\{t\('common\.view'\)\}: \$\{item\.name\}`\);/,
      `alert(\`\${t('common.view')}: \${item.${firstStringField.field}}\`);`
    );
    // Replace in delete action (2 places)
    generatedTsx = generatedTsx.replace(
      /confirm\(t\('pages\.\w+\.deleteConfirm', \{ name: item\.name \}\)\)/,
      `confirm(t('pages.${entityLower}.deleteConfirm', { name: item.${firstStringField.field} }))`
    );
    generatedTsx = generatedTsx.replace(
      /alert\(t\('pages\.\w+\.deleteSuccess', \{ name: item\.name \}\)\);/,
      `alert(t('pages.${entityLower}.deleteSuccess', { name: item.${firstStringField.field} }));`
    );
    // Replace in expanded content title
    generatedTsx = generatedTsx.replace(
      /t\('pages\.\w+\.detailsTitle', \{ name: item\.name \}\)/,
      `t('pages.${entityLower}.detailsTitle', { name: item.${firstStringField.field} })`
    );
  }

  // ============================================================
  // FIX EXPANDED CONTENT - Generate details from columns
  // ============================================================

  // Match entire expandedContent section from detailsGrid to end
  const expandedDetailsOld = /<div className=\{styles\.detailsGrid\}>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
  const expandedDetailsNew = `<div className={styles.detailsGrid}>\n${columns.filter(col => !col.hidden).map(col => {
    let valueExpr;
    if (col.type === 'number' && col.render === 'currency') {
      valueExpr = `$\${item.${col.field}.toLocaleString()}`;
    } else if (col.type === 'boolean') {
      valueExpr = `{item.${col.field} ? t('common.yes') : t('common.no')}`;
    } else if (col.type === 'number') {
      valueExpr = `{item.${col.field}.toLocaleString()}`;
    } else {
      valueExpr = `{item.${col.field}}`;
    }
    return `        <div>\n          <strong>{t('pages.${entityLower}.details.${col.field}')}:</strong> ${valueExpr}\n        </div>`;
  }).join('\n')}\n      </div>\n    </div>`;
  generatedTsx = generatedTsx.replace(expandedDetailsOld, expandedDetailsNew);

  // Write TSX file
  const outputTsxPath = path.join(PAGES_DIR, entityName, `${entityName}.tsx`);
  writeFile(outputTsxPath, generatedTsx);

  // ============================================================
  // 2. GENERATE CSS FILE
  // ============================================================

  const templateCss = readFile(path.join(TEMPLATE_DIR, 'TemplatePageDatagrid.module.css'));

  let generatedCss = templateCss;
  generatedCss = generatedCss.replace(/TemplatePageDatagrid/g, entityName);
  // Don't replace "template" in CSS property names like "grid-template-columns"
  generatedCss = generatedCss.replace(/FILE: TemplatePageDatagrid/g, `FILE: ${entityName}`);

  const outputCssPath = path.join(PAGES_DIR, entityName, `${entityName}.module.css`);
  writeFile(outputCssPath, generatedCss);

  // ============================================================
  // 3. GENERATE INDEX.TS
  // ============================================================

  const indexContent = `/*
 * ================================================================
 * FILE: index.ts
 * PATH: /apps/web-ui/src/pages/${entityName}/index.ts
 * DESCRIPTION: Export for ${entityName} component
 * VERSION: v1.0.0
 * UPDATED: ${new Date().toISOString().split('T')[0]}
 * ================================================================
 */

export { ${entityName} } from './${entityName}';
`;

  const outputIndexPath = path.join(PAGES_DIR, entityName, 'index.ts');
  writeFile(outputIndexPath, indexContent);

  // ============================================================
  // 4. GENERATE TRANSLATION FILES
  // ============================================================

  const translationsGenerated = generateTranslationFiles(config, entityName, entityLower);

  // ============================================================
  // 5. AUTO-REGISTER PAGE
  // ============================================================

  const registered = registerPage(config, entityName, entityLower);

  // ============================================================
  // 6. SUMMARY
  // ============================================================

  console.log('\n✅ Page generated successfully!\n');
  console.log('📁 Generated files:');
  console.log(`   - ${outputTsxPath}`);
  console.log(`   - ${outputCssPath}`);
  console.log(`   - ${outputIndexPath}`);

  if (translationsGenerated) {
    console.log(`   - packages/config/src/translations/pages/${entityLower}.ts (SK)`);
    console.log(`   - packages/config/src/translations/pages/${entityLower}.en.ts (EN)`);
    console.log(`   - packages/config/src/translations/types/${entityLower}.types.ts`);
  }

  if (registered) {
    console.log('\n📦 Auto-registered:');
    console.log('   - Imports added to sk.ts, en.ts, types.ts, App.tsx');
    console.log('   - Route added to App.tsx');
    console.log('   - Page translations registered');
  }

  console.log('\n📝 Next steps:');
  console.log('   1. ✅ Page fully generated and registered!');
  console.log('   2. Add sidebar item to BasePage defaultSidebarItems (manual)');
  console.log('   3. Customize columns, filters, and actions');
  if (useRealApi) {
    console.log(`   4. ✅ API mode active (${apiBaseUrl})`);
    console.log('   5. Ensure backend service is running');
  } else {
    console.log('   4. To switch to API: add "apiBaseUrl": "http://localhost:PORT" to config');
    console.log('   5. Then regenerate: node scripts/page-generator/generate-page.js <config>');
  }
  console.log('\n🎉 Done!\n');
}

// ============================================================
// TRANSLATION GENERATION
// ============================================================

/**
 * Convert JSON object to TypeScript object string
 */
function objectToTsString(obj, indent = 2) {
  const spaces = ' '.repeat(indent);
  const entries = Object.entries(obj).map(([key, value]) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return `${spaces}${key}: ${objectToTsString(value, indent + 2)},`;
    } else {
      const escapedValue = String(value).replace(/'/g, "\\'");
      return `${spaces}${key}: '${escapedValue}',`;
    }
  });
  return `{\n${entries.join('\n')}\n${' '.repeat(indent - 2)}}`;
}

/**
 * Convert JSON object to TypeScript interface string
 */
function objectToInterface(obj, indent = 2) {
  const spaces = ' '.repeat(indent);
  const entries = Object.entries(obj).map(([key, value]) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return `${spaces}${key}: ${objectToInterface(value, indent + 2)};`;
    } else {
      return `${spaces}${key}: string;`;
    }
  });
  return `{\n${entries.join('\n')}\n${' '.repeat(indent - 2)}}`;
}

/**
 * Generate translation file (SK or EN)
 */
function generateTranslationFile(entityName, entityLower, language, translations) {
  const langUpper = language.toUpperCase();
  const varName = `${entityLower}Page${language === 'sk' ? 'Sk' : 'En'}`;
  const today = new Date().toISOString().split('T')[0];

  return `/*
 * ================================================================
 * FILE: ${entityLower}.${language === 'en' ? 'en.' : ''}ts
 * PATH: packages/config/src/translations/pages/${entityLower}.${language === 'en' ? 'en.' : ''}ts
 * DESCRIPTION: ${entityName} page ${langUpper} translations (auto-generated)
 * VERSION: v1.0.0
 * UPDATED: ${today}
 * GENERATED: DO NOT EDIT MANUALLY - generated by generate-page.js
 * ================================================================
 */

export const ${varName} = ${objectToTsString(translations, 2)};
`;
}

/**
 * Generate TypeScript type definition
 */
function generateTypeDefinition(entityName, entityLower, skTranslations) {
  const pascalEntity = entityName.charAt(0).toUpperCase() + entityName.slice(1);
  const today = new Date().toISOString().split('T')[0];

  return `/*
 * ================================================================
 * FILE: ${entityLower}.types.ts
 * PATH: packages/config/src/translations/types/${entityLower}.types.ts
 * DESCRIPTION: ${entityName} page translation types (auto-generated)
 * VERSION: v1.0.0
 * UPDATED: ${today}
 * GENERATED: DO NOT EDIT MANUALLY - generated by generate-page.js
 * ================================================================
 */

export interface ${pascalEntity}PageTranslations ${objectToInterface(skTranslations, 2)}
`;
}

/**
 * Standard MinIO/bulkDelete translations (auto-included in all pages)
 */
const STANDARD_TRANSLATIONS = {
  sk: {
    permanentDeleteError: 'Chyba pri trvalom vymazaní položky {name}: {error}',
    restoreConfirm: 'Naozaj chcete obnoviť položku {name}?',
    restoreSuccess: 'Položka {name} bola úspešne obnovená',
    permanentDeleteConfirm: 'Naozaj chcete TRVALO vymazať položku {name}? Táto akcia je NEVRATNÁ!',
    permanentDeleteSuccess: 'Položka {name} bola trvalo vymazaná',
    bulkDelete: {
      title: 'Vymazať položky',
      titlePermanent: 'NATRVALO vymazať',
      titleMixed: 'Vymazať položky',
      softMessage: 'Naozaj chcete vymazať {count} položiek? Položky budú označené ako vymazané.',
      hardMessage: 'NATRVALO vymazať {count} položiek? Túto akciu NEMOŽNO vrátiť späť! Napíšte "ano" pre potvrdenie.',
      mixedMessage: 'Soft delete {softCount} aktívnych + Hard delete {hardCount} vymazaných položiek? Napíšte "ano" pre potvrdenie.',
      minioMessage: 'Súborové úložisko (MinIO) je nedostupné. {count} položiek sa nedá trvalo vymazať. Chcete ich označiť na neskoršie zmazanie?',
    },
    minioUnavailable: {
      title: '⚠️ Úložisko nedostupné',
      message: 'Súborové úložisko (MinIO) je momentálne nedostupné. Položka {code} sa nedá vymazať hneď. Chcete ju označiť na neskoršie zmazanie?',
      markForDeletion: 'Označiť na zmazanie',
      markedForDeletion: 'Položka {code} bola označená na neskoršie zmazanie',
      retryDelete: 'Skúsiť znova',
    },
  },
  en: {
    permanentDeleteError: 'Error permanently deleting item {name}: {error}',
    restoreConfirm: 'Are you sure you want to restore item {name}?',
    restoreSuccess: 'Item {name} has been successfully restored',
    permanentDeleteConfirm: 'Are you sure you want to PERMANENTLY delete item {name}? This action is IRREVERSIBLE!',
    permanentDeleteSuccess: 'Item {name} has been permanently deleted',
    bulkDelete: {
      title: 'Delete Items',
      titlePermanent: 'PERMANENTLY Delete',
      titleMixed: 'Delete Items',
      softMessage: 'Are you sure you want to delete {count} items? Items will be marked as deleted.',
      hardMessage: 'PERMANENTLY delete {count} items? This action CANNOT be undone! Type "yes" to confirm.',
      mixedMessage: 'Soft delete {softCount} active + Hard delete {hardCount} deleted items? Type "yes" to confirm.',
      minioMessage: 'File storage (MinIO) is unavailable. {count} items cannot be permanently deleted. Do you want to mark them for later deletion?',
    },
    minioUnavailable: {
      title: '⚠️ Storage Unavailable',
      message: 'File storage (MinIO) is currently unavailable. Item {code} cannot be deleted immediately. Do you want to mark it for later deletion?',
      markForDeletion: 'Mark for deletion',
      markedForDeletion: 'Item {code} has been marked for later deletion',
      retryDelete: 'Retry',
    },
  },
};

/**
 * Deep merge two objects
 */
function deepMerge(target, source) {
  const result = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

/**
 * Generate translation files (SK, EN, Types)
 */
function generateTranslationFiles(config, entityName, entityLower) {
  if (!config.translations) {
    console.log('⚠️  No translations provided in config - skipping translation generation');
    return false;
  }

  const TRANSLATIONS_PAGES_DIR = path.join(TRANSLATIONS_DIR, 'pages');
  const TRANSLATIONS_TYPES_DIR = path.join(TRANSLATIONS_DIR, 'types');

  console.log('\n📝 Generating translation files...\n');

  // Merge standard translations with config translations
  const mergedSk = deepMerge(STANDARD_TRANSLATIONS.sk, config.translations.sk);
  const mergedEn = deepMerge(STANDARD_TRANSLATIONS.en, config.translations.en);

  // Generate SK translation file
  const skContent = generateTranslationFile(
    entityName,
    entityLower,
    'sk',
    mergedSk
  );
  writeFile(
    path.join(TRANSLATIONS_PAGES_DIR, `${entityLower}.ts`),
    skContent
  );

  // Generate EN translation file
  const enContent = generateTranslationFile(
    entityName,
    entityLower,
    'en',
    mergedEn
  );
  writeFile(
    path.join(TRANSLATIONS_PAGES_DIR, `${entityLower}.en.ts`),
    enContent
  );

  // Generate TypeScript type definition
  const typeContent = generateTypeDefinition(
    entityName,
    entityLower,
    mergedSk
  );
  writeFile(
    path.join(TRANSLATIONS_TYPES_DIR, `${entityLower}.types.ts`),
    typeContent
  );

  console.log('\n✅ Translation files generated!\n');
  return true;
}

// ============================================================
// AUTOMATIC INJECTION
// ============================================================

/**
 * Inject code at placeholder location
 * Replaces placeholder with: newCode + "\n" + placeholder
 * This allows multiple injections over time
 *
 * UPDATED: Now checks if code already exists before injecting (duplicate protection)
 */
function injectAtPlaceholder(filePath, placeholder, newCode) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    if (!content.includes(placeholder)) {
      throw new Error(`Placeholder "${placeholder}" not found in ${filePath}`);
    }

    // Check if code already exists (duplicate protection)
    if (content.includes(newCode.trim())) {
      console.log(`⏭️  Already exists in ${path.basename(filePath)} - skipping`);
      return true; // Return success to not break workflow
    }

    // Replace placeholder with: newCode + newline + placeholder (so it can be used again)
    const injectedContent = content.replace(
      placeholder,
      `${newCode}\n${placeholder}`
    );

    fs.writeFileSync(filePath, injectedContent, 'utf-8');
    return true;
  } catch (error) {
    console.error(`❌ Injection failed in ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Automatically register page in all necessary files
 */
function registerPage(config, entityName, entityLower) {
  console.log('\n🔗 Auto-registering page...\n');

  const pascalEntity = entityName.charAt(0).toUpperCase() + entityName.slice(1);
  const routePath = config.path || `/${entityLower}`;

  let success = true;

  // 1. Inject import into sk.ts
  const skImport = `import { ${entityLower}PageSk } from './pages/${entityLower}';`;
  if (injectAtPlaceholder(SK_TS_PATH, '//--GENERATE-PAGE-PLACEHOLDER-IMPORT--', skImport)) {
    console.log(`✅ Added import to sk.ts`);
  } else {
    success = false;
  }

  // 2. Inject page key into sk.ts pages object
  const skPages = `    ${entityLower}: ${entityLower}PageSk,`;
  if (injectAtPlaceholder(SK_TS_PATH, '    //--GENERATE-PAGE-PLACEHOLDER-PAGES--', skPages)) {
    console.log(`✅ Added ${entityLower} to sk.ts pages`);
  } else {
    success = false;
  }

  // 3. Inject import into en.ts
  const enImport = `import { ${entityLower}PageEn } from './pages/${entityLower}.en';`;
  if (injectAtPlaceholder(EN_TS_PATH, '//--GENERATE-PAGE-PLACEHOLDER-IMPORT--', enImport)) {
    console.log(`✅ Added import to en.ts`);
  } else {
    success = false;
  }

  // 4. Inject page key into en.ts pages object
  const enPages = `    ${entityLower}: ${entityLower}PageEn,`;
  if (injectAtPlaceholder(EN_TS_PATH, '    //--GENERATE-PAGE-PLACEHOLDER-PAGES--', enPages)) {
    console.log(`✅ Added ${entityLower} to en.ts pages`);
  } else {
    success = false;
  }

  // 5. Inject import into types.ts
  const typesImport = `import type { ${pascalEntity}PageTranslations } from './types/${entityLower}.types';`;
  if (injectAtPlaceholder(TYPES_TS_PATH, '//--GENERATE-PAGE-PLACEHOLDER-IMPORT--', typesImport)) {
    console.log(`✅ Added import to types.ts`);
  } else {
    success = false;
  }

  // 6. Inject type into types.ts pages interface
  const typesPages = `    ${entityLower}: ${pascalEntity}PageTranslations;`;
  if (injectAtPlaceholder(TYPES_TS_PATH, '    //--GENERATE-PAGE-PLACEHOLDER-TYPES--', typesPages)) {
    console.log(`✅ Added ${entityLower} type to types.ts`);
  } else {
    success = false;
  }

  // 7. Inject import into App.tsx
  const appImport = `import { ${entityName} } from '../pages/${entityName}';`;
  if (injectAtPlaceholder(APP_TSX_PATH, '//--GENERATE-PAGE-PLACEHOLDER-IMPORT--', appImport)) {
    console.log(`✅ Added import to App.tsx`);
  } else {
    success = false;
  }

  // 8. Inject route into App.tsx
  const appRoute = `        <Route path="${routePath}" element={<${entityName} />} />`;
  if (injectAtPlaceholder(APP_TSX_PATH, '        {/*--GENERATE-PAGE-PLACEHOLDER-ROUTE--*/}', appRoute)) {
    console.log(`✅ Added route to App.tsx`);
  } else {
    success = false;
  }

  if (success) {
    console.log('\n✅ Page auto-registered successfully!\n');
  } else {
    console.log('\n⚠️  Some registrations failed - check errors above\n');
  }

  return success;
}

// ============================================================
// MAIN
// ============================================================

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('❌ Error: Missing config file');
    console.log('\nUsage:');
    console.log('  node scripts/generate-page.js <config.json>');
    console.log('\nExample:');
    console.log('  node scripts/generate-page.js configs/orders-page.json');
    process.exit(1);
  }

  const configPath = path.resolve(args[0]);

  if (!fs.existsSync(configPath)) {
    console.error(`❌ Error: Config file not found: ${configPath}`);
    process.exit(1);
  }

  try {
    const config = JSON.parse(readFile(configPath));
    generatePage(config);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
