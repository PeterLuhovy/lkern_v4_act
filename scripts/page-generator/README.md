# DataGrid Page Generator

**Version:** v1.0.0
**Updated:** 2025-11-08

Automatizovaný generátor pre DataGrid stránky v L-KERN v4.

---

## 🎯 Účel

Vytváranie nových stránok s tabuľkovými dátami (objednávky, kontakty, faktúry, produkty, atď.) je rutinná úloha s veľkou duplicitou kódu. Generator automatizuje tento proces a šetrí čas.

**Bez generátora:** ~15-20 minút manuálnej práce per stránka
**S generátorom:** ~30 sekúnd + customizácia (~5 minút)

**ROI:** Pri 10+ stránkach ušetrí **2-3 hodiny** čistého času.

---

## 📦 Čo generuje?

Generator vytvorí kompletný set súborov pre novú stránku:

```
pages/
└── Orders/
    ├── Orders.tsx          # Hlavný komponent
    ├── Orders.module.css   # Styling
    └── index.ts            # Export
```

**Vygenerovaný kód obsahuje:**
- ✅ FilteredDataGrid s plnou funkčnosťou
- ✅ PageHeader s breadcrumbs
- ✅ Filters + Quick filters
- ✅ Search, pagination, sorting
- ✅ Row selection + bulk actions
- ✅ Expandable rows s detailmi
- ✅ Action buttons (edit, view, delete)
- ✅ Status colors
- ✅ Mock data pre testing
- ✅ 100% DRY compliance (CSS variables, translations)

---

## 🚀 Použitie

### **1. Vytvor config súbor**

Vytvor JSON config pre novú stránku:

```bash
scripts/page-configs/my-page.json
```

**Príklad:** `orders-page.json`

```json
{
  "entityName": "Orders",
  "entityNameSingular": "Order",
  "routePath": "/orders",
  "columns": [
    {
      "field": "id",
      "title": "Order ID",
      "type": "string",
      "width": 120,
      "sortable": true
    },
    {
      "field": "customer",
      "title": "Customer",
      "type": "string",
      "width": 250,
      "sortable": true
    },
    {
      "field": "status",
      "title": "Status",
      "type": "status",
      "width": 120,
      "sortable": true,
      "options": ["active", "pending", "completed", "cancelled"]
    },
    {
      "field": "total",
      "title": "Total",
      "type": "number",
      "width": 120,
      "sortable": true,
      "render": "currency"
    }
  ],
  "features": {
    "search": true,
    "filters": true,
    "export": false,
    "bulkActions": true
  }
}
```

---

### **2. Spusti generátor**

```bash
node scripts/generate-page.js scripts/page-configs/orders-page.json
```

**Výstup:**

```
🚀 Generating DataGrid page...

✅ Created: apps/web-ui/src/pages/Orders/Orders.tsx
✅ Created: apps/web-ui/src/pages/Orders/Orders.module.css
✅ Created: apps/web-ui/src/pages/Orders/index.ts

✅ Page generated successfully!

📝 Next steps:
   1. Add translation keys to sk.ts and en.ts
   2. Add route to App.tsx
   3. Add sidebar item to BasePage
   4. Customize columns, filters, and actions
   5. Connect to real API (replace mock data)

🎉 Done!
```

---

### **3. Pridaj translation keys**

Otvor `packages/config/src/translations/sk.ts` a pridaj sekciu:

```typescript
pages: {
  orders: {
    title: 'Objednávky',
    subtitle: 'Správa objednávok',
    breadcrumb: 'Objednávky',
    searchPlaceholder: 'Vyhľadať objednávky...',
    newItemButton: 'Nová objednávka',
    // ... atď.
  }
}
```

Zopakuj pre `en.ts`.

---

### **4. Pridaj route**

Otvor `apps/web-ui/src/App.tsx` a pridaj route:

```tsx
import { Orders } from './pages/Orders';

// ...

<Route path="/orders" element={<Orders />} />
```

---

### **5. Pridaj do sidebaru**

Otvor `BasePage.tsx` alebo sidebar config a pridaj položku:

```tsx
{
  name: 'Objednávky',
  path: '/orders',
  icon: '📋'
}
```

---

### **6. Customizuj a connect API**

1. **Upravit columns** - podľa tvojich dát
2. **Upraviť filters** - pridaj relevantné filtre
3. **Upraviť actions** - edit/view/delete logika
4. **Replace mock data** - pripoj na API endpoint
5. **Pridať modals** - pre create/edit/view

---

## 📋 Config formát

### **Povinné parametre:**

| Parameter | Typ | Popis | Príklad |
|-----------|-----|-------|---------|
| `entityName` | string | Názov entity (PascalCase, plural) | `"Orders"` |
| `entityNameSingular` | string | Singulár názov (PascalCase) | `"Order"` |
| `routePath` | string | URL cesta | `"/orders"` |
| `columns` | array | Definície stĺpcov | `[{...}]` |

### **Column objekt:**

| Parameter | Typ | Povinné | Popis |
|-----------|-----|---------|-------|
| `field` | string | ✅ | Názov poľa v dátach |
| `title` | string | ✅ | Názov stĺpca (zobrazený header) |
| `type` | string | ✅ | Typ dát: `"string"`, `"number"`, `"boolean"`, `"status"` |
| `width` | number | ❌ | Šírka stĺpca v px |
| `sortable` | boolean | ❌ | Povoliť sorting |
| `render` | string | ❌ | Custom render: `"currency"`, `"date"` |
| `options` | array | ❌ | Pre typ `"status"` - možné hodnoty |
| `hidden` | boolean | ❌ | Skryť stĺpec (pre internal použitie) |

### **Features (voliteľné):**

```json
{
  "features": {
    "search": true,           // Vyhľadávanie
    "filters": true,          // Dropdown filtre
    "quickFilters": true,     // Pill-style quick filters
    "export": false,          // Export CSV/PDF (TODO)
    "bulkActions": true,      // Hromadné akcie
    "expandable": true,       // Expandable rows
    "selection": true         // Checkbox selection
  }
}
```

---

## 📚 Príklady

### **Príklad 1: Contacts stránka**

```bash
node scripts/generate-page.js scripts/page-configs/contacts-page.json
```

`contacts-page.json`:

```json
{
  "entityName": "Contacts",
  "entityNameSingular": "Contact",
  "routePath": "/contacts",
  "columns": [
    { "field": "id", "type": "string", "width": 120, "sortable": true },
    { "field": "name", "type": "string", "width": 200, "sortable": true },
    { "field": "email", "type": "string", "width": 250, "sortable": true },
    { "field": "phone", "type": "string", "width": 150, "sortable": true },
    { "field": "company", "type": "string", "width": 200, "sortable": true },
    { "field": "isActive", "type": "boolean", "hidden": true }
  ]
}
```

---

### **Príklad 2: Products stránka**

```bash
node scripts/generate-page.js scripts/page-configs/products-page.json
```

`products-page.json`:

```json
{
  "entityName": "Products",
  "entityNameSingular": "Product",
  "routePath": "/products",
  "columns": [
    { "field": "sku", "type": "string", "width": 120, "sortable": true },
    { "field": "name", "type": "string", "width": 250, "sortable": true },
    { "field": "category", "type": "string", "width": 150, "sortable": true },
    { "field": "price", "type": "number", "width": 100, "sortable": true, "render": "currency" },
    { "field": "stock", "type": "number", "width": 80, "sortable": true },
    { "field": "status", "type": "status", "width": 120, "sortable": true, "options": ["available", "out-of-stock", "discontinued"] }
  ]
}
```

---

## 🔧 Troubleshooting

### **Problém: TypeScript errors v generovanom kóde**

**Riešenie:** Generátor vytvorí základný interface. Možno budeš musieť manuálne upraviť typy.

---

### **Problém: Translation keys nenájdené**

**Riešenie:** Generátor nevytvára translation keys automaticky (TODO feature). Pridaj ich manuálne do `sk.ts` a `en.ts`.

---

### **Problém: Columns sa nezobrazujú správne**

**Riešenie:** Skontroluj či `field` v config súbore sa zhoduje s názvom property v interface.

---

## 🛣️ Roadmap

### **v1.0.0** (Current)
- ✅ Základný generátor (TSX + CSS + index.ts)
- ✅ Column definitions z configu
- ✅ Features flags support

### **v1.1.0** (Planned)
- ⏸️ Automatické generovanie translation keys
- ⏸️ Automatické pridanie route do App.tsx
- ⏸️ Automatické pridanie sidebar item

### **v1.2.0** (Planned)
- ⏸️ Interactive CLI (readline prompts)
- ⏸️ Custom render functions support
- ⏸️ Mock data generation based on columns

### **v2.0.0** (Future)
- ⏸️ Visual configurator (web UI)
- ⏸️ API connection wizard
- ⏸️ Modal generators (create/edit/view)

---

## 📞 Support

Pre otázky a issues:
- **Dokumentácia:** Tento súbor + `TemplatePageDatagrid.tsx` (komentáre)
- **Príklady:** `scripts/page-configs/*.json`

---

**Happy generating! 🚀**
