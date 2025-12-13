# ================================================================
# AuthRoleSwitcher
# ================================================================
# File: L:\system\lkern_codebase_v4_act\packages\ui-components\src\components\AuthRoleSwitcher\AuthRoleSwitcher.md
# Version: 5.0.0
# Created: 2025-11-22
# Updated: 2025-12-10
# Source: packages/ui-components/src/components/AuthRoleSwitcher/AuthRoleSwitcher.tsx
# Package: @l-kern/ui-components
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Authorization permission level switcher with 9-level grid and test user switcher.
#   Development tool for testing permission-based UI - to be replaced with real auth.
# ================================================================

---

## Overview

**Purpose**: Development tool for switching permission levels and test users
**Package**: @l-kern/ui-components
**Path**: packages/ui-components/src/components/AuthRoleSwitcher
**Since**: v1.0.0 (Current: v5.0.0)

🚨 **DEVELOPMENT TOOL - FOR TESTING ONLY**

The AuthRoleSwitcher provides a 9-level permission grid (3×3: Basic lvl1-3, Standard lvl1-3, Admin lvl1-3) with keyboard shortcuts (Ctrl+1-9) and a test user switcher section. Used in Sidebar for quick permission testing during development. **Must be removed when lkms-auth microservice is implemented.**

---

## Features

- ✅ **9 Permission Levels**: 3×3 grid (Basic 10/20/29, Standard 35/45/59, Admin 65/85/100)
- ✅ **Keyboard Shortcuts**: Ctrl+1 through Ctrl+9 for quick switching
- ✅ **Test User Switcher**: 4 predefined users (Peter, Test User 1-3)
- ✅ **Visual Indicators**: Color-coded zones (green/yellow/red)
- ✅ **Permission Display**: Current level shown with color range
- ✅ **localStorage Persistence**: Selected user and level persist
- ✅ **Collapsed Mode**: Works in collapsed sidebar (shows shortcuts only)
- ✅ **User Info Display**: Shows current user name and ID

---

## Quick Start

### Basic Usage

```tsx
import { AuthRoleSwitcher } from '@l-kern/ui-components';

function Sidebar() {
  return (
    <aside>
      {/* Other sidebar content */}
      <AuthRoleSwitcher />
    </aside>
  );
}
```

### With Collapsed State

```tsx
import { AuthRoleSwitcher } from '@l-kern/ui-components';

function Sidebar({ isCollapsed }) {
  return (
    <aside>
      <AuthRoleSwitcher isCollapsed={isCollapsed} />
    </aside>
  );
}
```

---

## Props API

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `isCollapsed` | `boolean` | `false` | No | Whether sidebar is collapsed (shows compact view) |

---

## Permission Levels

### 9-Level System

```
┌─────────────────────────────────────┐
│ 👁️ BASIC (Green Zone)              │
│ [lvl1] [lvl2] [lvl3]                │
│ Ctrl+1 Ctrl+2 Ctrl+3                │
│  10     20     29                   │
├─────────────────────────────────────┤
│ 👤 STANDARD (Yellow Zone)           │
│ [lvl1] [lvl2] [lvl3]                │
│ Ctrl+4 Ctrl+5 Ctrl+6                │
│  35     45     59                   │
├─────────────────────────────────────┤
│ 👑 ADMIN (Red Zone)                 │
│ [lvl1] [lvl2] [lvl3]                │
│ Ctrl+7 Ctrl+8 Ctrl+9                │
│  65     85    100                   │
└─────────────────────────────────────┘
```

### Permission Matrix

| Level | Value | Category | Permissions |
|-------|-------|----------|-------------|
| Basic lvl1 | 10 | Basic | View only |
| Basic lvl2 | 20 | Basic | View + limited actions |
| Basic lvl3 | 29 | Basic | View + most read operations |
| Standard lvl1 | 35 | Standard | Create + view |
| Standard lvl2 | 45 | Standard | Create + view + edit own |
| Standard lvl3 | 59 | Standard | Create + view + edit most |
| Admin lvl1 | 65 | Admin | Edit + delete |
| Admin lvl2 | 85 | Admin | Full access + admin features |
| Admin lvl3 | 100 | Admin | Superuser (all permissions) |

---

## Test Users

### Predefined Users

```typescript
const testUsers = [
  {
    id: 'user-peter-luhovy-001',
    name: 'Peter Luhový',
    email: 'peter@lra.sk',
    role: 'advanced',
    description: 'Admin lvl3 (100)',
    permissionLevel: 100,
  },
  {
    id: 'user-test-001',
    name: 'Test User 1',
    email: 'test1@lra.sk',
    role: 'basic',
    description: 'Basic lvl1 (10)',
    permissionLevel: 10,
  },
  {
    id: 'user-test-002',
    name: 'Test User 2',
    email: 'test2@lra.sk',
    role: 'standard',
    description: 'Standard lvl2 (45)',
    permissionLevel: 45,
  },
  {
    id: 'user-test-003',
    name: 'Test User 3',
    email: 'test3@lra.sk',
    role: 'advanced',
    description: 'Admin lvl2 (85)',
    permissionLevel: 85,
  },
];
```

---

## Keyboard Shortcuts

| Shortcut | Level | Value | Category |
|----------|-------|-------|----------|
| Ctrl+1 | Basic lvl1 | 10 | Basic |
| Ctrl+2 | Basic lvl2 | 20 | Basic |
| Ctrl+3 | Basic lvl3 | 29 | Basic |
| Ctrl+4 | Standard lvl1 | 35 | Standard |
| Ctrl+5 | Standard lvl2 | 45 | Standard |
| Ctrl+6 | Standard lvl3 | 59 | Standard |
| Ctrl+7 | Admin lvl1 | 65 | Admin |
| Ctrl+8 | Admin lvl2 | 85 | Admin |
| Ctrl+9 | Admin lvl3 | 100 | Admin |

---

## Behavior

### Permission Level Switching

```typescript
const handleQuickPermission = (level: number) => {
  setPermissionLevel(level);
  // Persists to localStorage via AuthContext
};
```

### Test User Switching

```typescript
const handleUserSwitch = (userId: string) => {
  setTestUser(userId);
  // Updates user and permission level via AuthContext
  // Persists to localStorage
};
```

### Keyboard Handler

```typescript
const handleKeyDown = (event: KeyboardEvent) => {
  if (!event.ctrlKey && !event.metaKey) return;

  const shortcut = PERMISSION_SHORTCUTS.find(s => s.key === event.key);
  if (shortcut) {
    event.preventDefault();
    setPermissionLevel(shortcut.level);
  }
};
```

---

## Visual Design

### Expanded Mode

```
┌────────────────────────────┐
│ 👤 Test User Switcher      │
│                            │
│ Peter Luhový               │
│ ID: user-pet...            │
│                            │
│ [👑 Peter] [👁️ Test 1]    │
│ [👤 Test 2] [👑 Test 3]    │
├────────────────────────────┤
│ Permission Level: 100      │
│ Admin lvl3                 │
├────────────────────────────┤
│ 👁️ BASIC                   │
│ [lvl1] [lvl2] [lvl3]       │
│                            │
│ 👤 STANDARD                │
│ [lvl1] [lvl2] [lvl3]       │
│                            │
│ 👑 ADMIN                   │
│ [lvl1] [lvl2] [lvl3]       │
└────────────────────────────┘
```

### Collapsed Mode

```
┌──┐
│1 │  ← Ctrl+1
│2 │
│3 │
├──┤
│4 │
│5 │
│6 │
├──┤
│7 │
│8 │
│9 │
└──┘
```

---

## Known Issues

- ⚠️ **DEVELOPMENT TOOL**: Must be replaced with real lkms-auth integration
  - **Tracking**: Task #1.200 Authentication Service
  - **Action Required**: Remove component when auth service is ready

---

## Testing

### Key Test Cases

1. **Renders 9 permission buttons**
2. **Keyboard shortcuts work (Ctrl+1-9)**
3. **Switches permission level on button click**
4. **Switches test user**
5. **Persists to localStorage**
6. **Shows collapsed mode correctly**

---

## Related Components

- [Sidebar](../Sidebar/Sidebar.md) - Contains AuthRoleSwitcher
- useAuth hook - Reads permission level

---

## Changelog

### v5.0.0 (2025-12-09)
- ✅ Added test user switcher section
- ✅ Users have predefined IDs and permission levels
- ✅ Selected user persists in localStorage

### v4.0.0 (2025-11-22)
- ✅ Replaced 3 buttons with 9-level grid (3×3)
- ✅ Added keyboard shortcuts Ctrl+1 to Ctrl+9

---

**End of AuthRoleSwitcher Documentation**
