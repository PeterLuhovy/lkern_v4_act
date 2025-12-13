# Component Translation Types

This folder contains TypeScript type definitions for UI component translations, split from the monolithic `types.ts` file for better maintainability.

## 🎯 Purpose

Split the 700-line `components` namespace into manageable modules (30-150 lines each).

## 📁 Structure

Each component has one type definition file:
- `{component}.types.ts` - TypeScript interface defining translation structure
- `index.ts` - Barrel export aggregating all component types

## 📝 Example

```typescript
// buttons.types.ts
export interface ButtonsTranslations {
  primary: string;
  secondary: string;
  danger: string;
  // ...
}

// index.ts (barrel export)
export * from './buttons.types';
export * from './badge.types';
// ...

export interface ComponentsTranslations {
  buttons: ButtonsTranslations;
  badge: BadgeTranslations;
  // ...
}
```

## 🔗 Usage in main types.ts

The barrel export is imported in the main `types.ts` file:

```typescript
// types.ts
import type { ComponentsTranslations } from './types/components';

export interface TranslationKeys {
  common: { ... };
  components: ComponentsTranslations; // ← Type aliasing
  // ...
}
```

## ✅ Benefits

- **Easy navigation** - Find component types quickly
- **Smaller files** - 30-150 lines per file vs 700 lines
- **Less merge conflicts** - Team can work on different components
- **Better IntelliSense** - Faster IDE autocomplete
- **Backward compatible** - Existing code works unchanged

## 🚀 Adding New Component Types

1. Extract component section from `types.ts`
2. Create `{component}.types.ts` with exported interface
3. Add export to `index.ts` barrel
4. Add to `ComponentsTranslations` aggregate interface
5. Verify TypeScript compilation: `npm run typecheck`

## 📋 TODO

Components to extract (in order of size):
- [ ] modalV3 (~150 lines) - Modal v3.0 with all test scenarios
- [ ] dataGridTest (~100 lines) - DataGrid testing page
- [ ] filteredGridDemo (~80 lines) - FilteredDataGrid demo
- [ ] testing (~80 lines) - Testing dashboard
- [ ] sidebar (~60 lines) - Sidebar navigation
- [ ] wizard (~50 lines) - Multi-step wizard
- [ ] card (~40 lines) - Card component
- [ ] emptyState (~40 lines) - Empty state variants
- [ ] fileUpload (~30 lines) - File upload component
- [ ] pageHeader (~15 lines) - Page header
- [ ] reportButton (~30 lines) - Report button

## 🔗 Related

- Main translation types: `../types.ts`
- Page translation types: `../types/orders.types.ts`, `../types/issues.types.ts`
- SK translations: `../../components/` (to be created)
- EN translations: `../../components/` (to be created)
