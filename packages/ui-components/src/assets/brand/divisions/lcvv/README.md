# LCVV Division Logo Assets (ERP Working Copy)

**Location:** `packages/ui-components/src/assets/brand/divisions/lcvv/`
**Purpose:** Working copy of LCVV division logos for ERP web applications
**Version:** v1.0.0
**Created:** 2025-11-02

---

## ⚠️ IMPORTANT: This is a WORKING COPY

**Master Location (Source of Truth):**
`L:\divisions\lcvv\branding\`

All logo updates should be made in the master location first, then copied here.

---

## 📁 Logo Files

- **`logo.svg`** - Primary logo (vector, scalable)
- **`logo.png`** - Primary logo (raster)
- **`logo-dark.svg`** - Dark theme variant (vector)
- **`logo-icon.svg`** - Icon/favicon variant (vector)

---

## 🔄 Synchronization Workflow

1. **Update logos in master location:**
   `L:\divisions\lcvv\branding\logo-lcvv.svg`

2. **Copy to this working copy location:**
   ```bash
   copy L:\divisions\lcvv\branding\logo-lcvv.svg packages\ui-components\src\assets\brand\divisions\lcvv\logo.svg
   copy L:\divisions\lcvv\branding\logo-lcvv.png packages\ui-components\src\assets\brand\divisions\lcvv\logo.png
   copy L:\divisions\lcvv\branding\logo-lcvv-dark.svg packages\ui-components\src\assets\brand\divisions\lcvv\logo-dark.svg
   copy L:\divisions\lcvv\branding\logo-lcvv-icon.svg packages\ui-components\src\assets\brand\divisions\lcvv\logo-icon.svg
   ```

3. **Test in web-ui application**

4. **Git commit changes**

---

## 💻 Usage in React Components

### Import Logo in Component:

```typescript
import logoLcvv from '@l-kern/ui-components/assets/brand/divisions/lcvv/logo.svg';
import logoLcvvDark from '@l-kern/ui-components/assets/brand/divisions/lcvv/logo-dark.svg';
import logoLcvvIcon from '@l-kern/ui-components/assets/brand/divisions/lcvv/logo-icon.svg';

function Header() {
  return (
    <header>
      <img src={logoLcvv} alt="LCVV Logo" />
    </header>
  );
}
```

### Theme-Aware Logo:

```typescript
import { useTheme } from '@l-kern/config';
import logoLight from '@l-kern/ui-components/assets/brand/divisions/lcvv/logo.svg';
import logoDark from '@l-kern/ui-components/assets/brand/divisions/lcvv/logo-dark.svg';

function ThemeLogo() {
  const { theme } = useTheme();
  const logo = theme === 'dark' ? logoDark : logoLight;

  return <img src={logo} alt="LCVV Logo" />;
}
```

---

## 📐 Naming Convention

**Master location uses full prefix:**
`logo-lcvv-{variant}.{extension}`

**Working copy uses simplified names:**
`logo-{variant}.{extension}`

This simplifies imports in React components while maintaining clear naming in the master location.

---

## 📖 Related Documentation

- **Master Location README:** `L:\divisions\lcvv\branding\README.md`
- **Design Standards:** `docs/design/design-standards.md`
- **UI Components Package:** `packages/ui-components/README.md`
- **Brand Guidelines:** (to be added by marketing team)

---

**Package:** `@l-kern/ui-components`
**Maintained by:** BOSSystems s.r.o.
**Source of Truth:** `L:\divisions\lcvv\branding\`
