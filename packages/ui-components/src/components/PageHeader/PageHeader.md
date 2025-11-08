# PageHeader Component

**Version:** v1.0.0
**Path:** `/packages/ui-components/src/components/PageHeader`
**Last Updated:** 2025-11-08

---

## Overview

`PageHeader` je univerzálny komponent pre hlavičku stránky s podporou titulku, podtitulku, breadcrumb navigácie a loga. Používa moderný gradient design system s fialovým akcentom.

**Key Features:**
- ✅ Responzívny design (mobile-first)
- ✅ Breadcrumb navigácia s accessibility support
- ✅ Voliteľné logo (vlastný obrázok alebo ReactNode)
- ✅ Custom content slot (tlačidlá, filtre)
- ✅ 100% DRY compliance (translations, CSS variables)
- ✅ Gradient design (purple accent border)

---

## API Reference

### Props

```typescript
export interface BreadcrumbItem {
  /** Breadcrumb text */
  name: string;
  /** Standard href link */
  href?: string;
  /** React Router path (prevents default when onClick provided) */
  to?: string;
  /** Click handler */
  onClick?: () => void;
  /** Mark as active/current page */
  isActive?: boolean;
}

export interface PageHeaderProps {
  /** Page title (required) */
  title: string;

  /** Optional subtitle below title */
  subtitle?: string;

  /** Optional breadcrumb navigation */
  breadcrumbs?: BreadcrumbItem[];

  /** Show logo on left side (default: false) */
  showLogo?: boolean;

  /** Custom logo icon or image URL */
  logoIcon?: string | React.ReactNode;

  /** Custom content on right side (e.g., buttons, filters) */
  children?: React.ReactNode;

  /** Additional CSS class */
  className?: string;
}
```

---

## Usage Examples

### Basic Usage

**Simple page header with just a title:**

```tsx
import { PageHeader } from '@l-kern/ui-components';

export function ContactsPage() {
  return (
    <div>
      <PageHeader title="Contacts" />
      {/* Page content */}
    </div>
  );
}
```

---

### With Subtitle

**Add a subtitle for additional context:**

```tsx
<PageHeader
  title="Contacts"
  subtitle="Manage your business contacts"
/>
```

---

### With Logo

**Display a logo on the left side:**

```tsx
// With image URL
<PageHeader
  title="Dashboard"
  showLogo
  logoIcon="/assets/logo.png"
/>

// With custom React component
<PageHeader
  title="Dashboard"
  showLogo
  logoIcon={<MyCustomLogo />}
/>

// With default placeholder (shows "LOGO" text)
<PageHeader
  title="Dashboard"
  showLogo
/>
```

---

### With Breadcrumbs

**Add breadcrumb navigation for multi-level pages:**

```tsx
<PageHeader
  title="Contact Details"
  breadcrumbs={[
    { name: 'Home', href: '/' },
    { name: 'Contacts', href: '/contacts' },
    { name: 'John Doe', isActive: true }
  ]}
/>
```

**With React Router integration:**

```tsx
import { useNavigate } from 'react-router-dom';

export function ProductDetails() {
  const navigate = useNavigate();

  return (
    <PageHeader
      title="Product Details"
      breadcrumbs={[
        {
          name: 'Home',
          to: '/',
          onClick: () => navigate('/')
        },
        {
          name: 'Products',
          to: '/products',
          onClick: () => navigate('/products')
        },
        {
          name: 'Laptop',
          isActive: true
        }
      ]}
    />
  );
}
```

---

### With Custom Content

**Add buttons or actions on the right side:**

```tsx
import { PageHeader, Button } from '@l-kern/ui-components';

export function ContactsPage() {
  const handleAddContact = () => {
    console.log('Add contact clicked');
  };

  return (
    <PageHeader
      title="Contacts"
      subtitle="Manage your contacts"
    >
      <Button variant="primary" onClick={handleAddContact}>
        Add Contact
      </Button>
    </PageHeader>
  );
}
```

**Multiple actions:**

```tsx
<PageHeader
  title="Orders"
  subtitle="View and manage orders"
>
  <Button variant="ghost">Export</Button>
  <Button variant="primary">New Order</Button>
</PageHeader>
```

---

### Complete Example

**Full-featured page header:**

```tsx
import { PageHeader, Button } from '@l-kern/ui-components';
import { useNavigate } from 'react-router-dom';

export function OrderDetailsPage() {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title="Order #12345"
        subtitle="Order details and items"
        showLogo
        logoIcon="/assets/logo.png"
        breadcrumbs={[
          {
            name: 'Home',
            to: '/',
            onClick: () => navigate('/')
          },
          {
            name: 'Orders',
            to: '/orders',
            onClick: () => navigate('/orders')
          },
          {
            name: 'Order #12345',
            isActive: true
          }
        ]}
      >
        <Button variant="ghost">Print</Button>
        <Button variant="primary">Edit Order</Button>
      </PageHeader>

      {/* Page content */}
      <div>Order details go here...</div>
    </div>
  );
}
```

---

## Styling

### CSS Classes

Component uses CSS Modules. Main classes:

```css
.pageHeader           /* Base container */
.pageHeader__content  /* Flexbox layout wrapper */
.pageHeader__left     /* Left section (logo + text) */
.pageHeader__right    /* Right section (custom content) */
.pageHeader__logo     /* Logo container */
.pageHeader__text     /* Text container (title + subtitle + breadcrumbs) */
.pageHeader__title    /* Title (h1) */
.pageHeader__subtitle /* Subtitle */
.pageHeader__breadcrumbs        /* Breadcrumb navigation */
.pageHeader__breadcrumb         /* Single breadcrumb item */
.pageHeader__breadcrumb--active /* Active breadcrumb */
.pageHeader__breadcrumb--clickable /* Clickable breadcrumb */
```

### Design Tokens Used

**Spacing:**
- `--spacing-xs` (4px) - Small gaps
- `--spacing-sm` (8px) - Breadcrumb margins
- `--spacing-md` (16px) - Responsive gaps
- `--spacing-lg` (24px) - Default padding/gaps
- `--spacing-xl` (32px) - Large padding

**Colors:**
- `--theme-card-background` - Background color
- `--theme-border` - Border color
- `--color-brand-primary` - Purple accent (left border, active breadcrumb, subtitle)
- `--theme-text` - Title color
- `--theme-text-muted` - Breadcrumb color
- `--theme-hover-background` - Breadcrumb hover

**Typography:**
- `--font-size-xxxl` (32px) - Title size
- `--font-size-sm` (12px) - Subtitle & breadcrumbs
- `--font-weight-bold` (700) - Title weight
- `--font-weight-semibold` (600) - Subtitle weight

**Border & Shadow:**
- `--radius-md` - Border radius
- Purple left border (4px solid)
- Subtle shadow for depth

---

## Responsive Behavior

### Desktop (> 768px)
- Horizontal layout (left/right sections)
- Logo 60px height
- Full padding (24px/32px)

### Tablet (≤ 768px)
- Vertical layout (stacked)
- Logo 48px height
- Reduced padding (16px/24px)
- Smaller title (24px)

### Mobile (≤ 480px)
- Vertical layout
- Logo 40px height
- Minimal padding (8px/16px)
- Smaller title (18px)
- Wrapped breadcrumbs

---

## Accessibility

### Features
- ✅ Semantic `<h1>` for title
- ✅ `<nav>` with `aria-label="Breadcrumb navigation"`
- ✅ Active breadcrumb marked with `aria-current="page"`
- ✅ Logo `alt` text via translation
- ✅ Keyboard navigation (Tab, Enter)
- ✅ Focus visible states

### ARIA Attributes

```tsx
// Navigation
<nav aria-label="Breadcrumb navigation">

// Active breadcrumb
<span aria-current="page">Current Page</span>

// Logo
<img alt="Application logo" />
```

---

## Translation Keys

**Used translation keys:**

```typescript
components.pageHeader.logoAlt           // "Application logo" / "Logo aplikácie"
components.pageHeader.logoPlaceholder   // "LOGO" / "LOGO"
components.pageHeader.breadcrumbsLabel  // "Breadcrumb navigation" / "Navigačná cesta"
```

**Adding new translations:**

1. Update `types.ts`:
```typescript
pageHeader: {
  logoAlt: string;
  logoPlaceholder: string;
  breadcrumbsLabel: string;
}
```

2. Update `sk.ts`:
```typescript
pageHeader: {
  logoAlt: 'Logo aplikácie',
  logoPlaceholder: 'LOGO',
  breadcrumbsLabel: 'Navigačná cesta',
}
```

3. Update `en.ts`:
```typescript
pageHeader: {
  logoAlt: 'Application logo',
  logoPlaceholder: 'LOGO',
  breadcrumbsLabel: 'Breadcrumb navigation',
}
```

---

## Testing

### Test Coverage

**Tested scenarios:**
- ✅ Basic rendering (title, subtitle)
- ✅ Logo variants (none, placeholder, image, custom component)
- ✅ Breadcrumbs (links, active state, separators)
- ✅ Breadcrumb clicks (onClick, href, to + onClick)
- ✅ Children rendering
- ✅ Custom className
- ✅ Accessibility (semantic HTML, ARIA)
- ✅ Translations

### Running Tests

```bash
# Run all tests
npm test

# Run PageHeader tests only
npm test PageHeader

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Example Test

```typescript
import { renderWithTranslation, screen } from '../../test-utils';
import { PageHeader } from './PageHeader';

it('renders title and subtitle', () => {
  renderWithTranslation(
    <PageHeader title="Test Page" subtitle="Test Subtitle" />
  );

  expect(screen.getByText('Test Page')).toBeInTheDocument();
  expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
});
```

---

## Performance Considerations

### Optimization Tips

1. **Breadcrumb Array Stability**
   ```tsx
   // ❌ BAD - Creates new array every render
   <PageHeader breadcrumbs={[{ name: 'Home', href: '/' }]} />

   // ✅ GOOD - Memoized array
   const breadcrumbs = useMemo(() => [
     { name: 'Home', href: '/' },
     { name: 'Products', href: '/products' }
   ], []);

   <PageHeader breadcrumbs={breadcrumbs} />
   ```

2. **Custom Logo Component**
   ```tsx
   // ✅ Memoize expensive logo components
   const CustomLogo = React.memo(() => {
     return <ComplexSVGLogo />;
   });

   <PageHeader logoIcon={<CustomLogo />} />
   ```

3. **Click Handlers**
   ```tsx
   // ✅ Use useCallback for onClick handlers
   const handleClick = useCallback(() => {
     navigate('/home');
   }, [navigate]);

   const breadcrumbs = useMemo(() => [
     { name: 'Home', onClick: handleClick }
   ], [handleClick]);
   ```

---

## Known Issues

**None at this time.**

Report issues: [GitHub Issues](https://github.com/yourusername/l-kern/issues)

---

## Changelog

### v1.0.0 (2025-11-08)
- ✅ Initial release
- ✅ Basic props (title, subtitle, children)
- ✅ Logo support (image, custom component, placeholder)
- ✅ Breadcrumb navigation (href, to, onClick, active state)
- ✅ Gradient design (purple left border)
- ✅ Responsive breakpoints (mobile, tablet, desktop)
- ✅ 100% DRY compliance (translations, CSS variables)
- ✅ Full test coverage (rendering, props, accessibility)
- ✅ Accessibility features (semantic HTML, ARIA)

---

## Related Components

- **[BasePage](../BasePage/BasePage.md)** - Base page layout wrapper
- **[Sidebar](../Sidebar/Sidebar.md)** - Navigation sidebar
- **[FilterPanel](../FilterPanel/FilterPanel.md)** - Filter controls for data pages
- **[DataGrid](../DataGrid/DataGrid.md)** - Data table component

---

## Migration Guide

### From v3 PageHeader

**Breaking changes:**

1. **Props renamed:**
   - `showLkernLogo` → `showLogo`
   - `showLuhovyLogo` → removed (use `children` for secondary logo)

2. **Logo handling:**
   ```tsx
   // v3
   <PageHeader showLkernLogo showLuhovyLogo />

   // v4
   <PageHeader showLogo logoIcon="/logo.png">
     <img src="/secondary-logo.png" alt="Secondary" />
   </PageHeader>
   ```

3. **Breadcrumbs:**
   ```tsx
   // v3
   breadcrumbs={[{ name: 'Home', href: '/', onClick: handler }]}

   // v4 (same API)
   breadcrumbs={[{ name: 'Home', href: '/', onClick: handler }]}
   ```

---

**Maintained by:** BOSSystems s.r.o.
**Contact:** [support@bosystems.sk](mailto:support@bosystems.sk)