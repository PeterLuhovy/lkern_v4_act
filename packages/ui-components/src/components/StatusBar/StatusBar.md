# ================================================================
# StatusBar
# ================================================================
# File: L:\system\lkern_codebase_v4_act\packages\ui-components\src\components\StatusBar\StatusBar.md
# Version: 1.0.0
# Created: 2025-11-30
# Updated: 2025-12-10
# Source: packages/ui-components/src/components/StatusBar/StatusBar.tsx
# Package: @l-kern/ui-components
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Status bar component with real-time system monitoring, service health tracking,
#   expandable panel with drag-to-resize, backup integration, and theme/language controls.
# ================================================================

---

## Overview

**Purpose**: Real-time system health monitoring bar with expandable detail panel
**Package**: @l-kern/ui-components
**Path**: packages/ui-components/src/components/StatusBar
**Since**: v1.0.0

The StatusBar component provides a comprehensive system monitoring interface at the bottom of the application. It displays service health status, response times, backup information, and user details in a collapsed bar that expands to show detailed metrics. Features drag-to-resize functionality (150-600px), theme/language toggles, and integrates with the orchestrator service for real-time updates.

---

## Features

- ✅ **Real-Time Service Monitoring**: Tracks health status of all microservices
- ✅ **Expandable Panel**: Click to expand/collapse detailed view
- ✅ **Drag-to-Resize**: Resize expanded panel from 150px to 600px
- ✅ **Height Persistence**: Remembers custom height in localStorage
- ✅ **Service Categories**: Critical services, other services, databases
- ✅ **Health Status Colors**: Green (healthy), yellow (unhealthy), red (down), gray (unknown)
- ✅ **Response Time Tracking**: Display per-service response times in milliseconds
- ✅ **Backup Integration**: One-click backup with progress tracking
- ✅ **Theme Toggle**: Light/dark mode switcher (🌙/☀️)
- ✅ **Language Switcher**: Cycle through available languages
- ✅ **Manual Refresh**: Force refresh service status
- ✅ **Data Source Indicator**: Shows mock/orchestrator/error state
- ✅ **Current User Display**: Shows user name, position, avatar
- ✅ **Click Outside to Close**: Auto-collapse when clicking elsewhere
- ✅ **Dynamic Positioning**: Notifies parent components for coordination with floating buttons

---

## Quick Start

### Basic Usage

```tsx
import { StatusBar } from '@l-kern/ui-components';

function App() {
  const services = {
    'Issues Service': { name: 'Issues Service', status: 'healthy', critical: true, response_time: 45 },
    'Contacts Service': { name: 'Contacts Service', status: 'healthy', critical: true, response_time: 38 },
    'PostgreSQL': { name: 'PostgreSQL', status: 'healthy', critical: false, response_time: 12 },
  };

  return (
    <div>
      {/* Your app content */}
      <StatusBar services={services} />
    </div>
  );
}
```

### Common Patterns

#### Pattern 1: StatusBar with Real Orchestrator Data

```tsx
import { StatusBar } from '@l-kern/ui-components';
import { useState, useEffect } from 'react';

function AppWithMonitoring() {
  const [services, setServices] = useState({});
  const [dataSource, setDataSource] = useState('orchestrator');

  useEffect(() => {
    // Fetch from orchestrator service
    fetch('http://localhost:8000/health/all')
      .then(res => res.json())
      .then(data => {
        setServices(data.services);
        setDataSource('orchestrator');
      })
      .catch(err => {
        console.error('Orchestrator offline:', err);
        setDataSource('error');
      });
  }, []);

  return (
    <StatusBar
      services={services}
      dataSource={dataSource}
      dataSourceError={dataSource === 'error' ? 'Orchestrator service is offline' : undefined}
    />
  );
}
```

#### Pattern 2: StatusBar with Backup Handler

```tsx
import { StatusBar } from '@l-kern/ui-components';
import { useToast } from '@l-kern/config';

function AppWithBackup() {
  const toast = useToast();

  const handleBackup = async () => {
    try {
      const response = await fetch('http://localhost:8000/backup/trigger', {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Backup completed successfully');
      } else {
        toast.error('Backup failed');
      }
    } catch (error) {
      toast.error('Backup error: ' + error.message);
    }
  };

  return (
    <StatusBar
      services={services}
      onBackup={handleBackup}
    />
  );
}
```

#### Pattern 3: StatusBar with Floating Button Coordination

```tsx
import { StatusBar, ThemeCustomizer, KeyboardShortcutsButton } from '@l-kern/ui-components';
import { useState } from 'react';

function AppLayout() {
  const [statusBarExpanded, setStatusBarExpanded] = useState(false);
  const [statusBarHeight, setStatusBarHeight] = useState(300);

  return (
    <div>
      {/* Main content */}

      {/* Floating buttons that adjust based on StatusBar state */}
      <ThemeCustomizer
        statusBarExpanded={statusBarExpanded}
        statusBarHeight={32}
        statusBarExpandedHeight={statusBarHeight}
      />

      <KeyboardShortcutsButton
        statusBarExpanded={statusBarExpanded}
        statusBarHeight={32}
        statusBarExpandedHeight={statusBarHeight}
      />

      {/* StatusBar notifies buttons when state changes */}
      <StatusBar
        services={services}
        onExpandedChange={setStatusBarExpanded}
        onExpandedHeightChange={setStatusBarHeight}
      />
    </div>
  );
}
```

---

## Props API

### StatusBarProps

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `services` | `Record<string, ServiceStatus>` | `{}` | No | Dictionary of services with health status |
| `onBackup` | `() => Promise<void>` | undefined | No | Callback to trigger backup (uses mock if not provided) |
| `onRefresh` | `() => Promise<void>` | undefined | No | Callback to refresh service status |
| `initialBackupInfo` | `BackupInfo \| null` | `null` | No | Initial backup information (last completed backup) |
| `currentUser` | `CurrentUser` | undefined | No | Current user information (name, position, department, avatar) |
| `onExpandedChange` | `(isExpanded: boolean) => void` | undefined | No | Callback when expanded state changes |
| `onExpandedHeightChange` | `(height: number) => void` | undefined | No | Callback when expanded height changes (drag resize) |
| `dataSource` | `DataSource` | `'mock'` | No | Data source indicator ('orchestrator', 'mock', 'error') |
| `dataSourceError` | `string` | undefined | No | Error message when dataSource is 'error' |

### Type Definitions

```typescript
export interface ServiceStatus {
  name: string;
  status: 'healthy' | 'unhealthy' | 'down' | 'unknown';
  critical: boolean;
  response_time: number; // milliseconds
}

export interface CurrentUser {
  name: string;
  position: string;
  department: string;
  avatar: string; // emoji or URL
}

export interface BackupInfo {
  completed_at: string | null;
  files: number;
  status: 'completed' | 'running' | 'error' | 'never';
}

export type DataSource = 'orchestrator' | 'mock' | 'error';
```

---

## Visual Design

### Collapsed State (32px height)

```
┌─────────────────────────────────────────────────────────────────┐
│ ● All services running (8/8) • Last updated: 14:23:45 | 👤 Pe... │  ▲
└─────────────────────────────────────────────────────────────────┘
  Green indicator    Service count    Time    User info      Expand
```

### Expanded State (300px default, 150-600px resizable)

```
═══════════════════════════════════════ Resize Handle
┌─────────────────────────────────────────────────────────────────┐
│ ● All services running (8/8) • Last updated: 14:23:45 | 👤 Pe... │  ▼
├─────────────────────────────────────────────────────────────────┤
│ Critical Services (4/4)                                         │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│ │ ● Issues     │ │ ● Contacts   │ │ ● Config     │             │
│ │   45ms       │ │   38ms       │ │   23ms       │             │
│ └──────────────┘ └──────────────┘ └──────────────┘             │
│                                                                 │
│ Other Services (2/2)                                            │
│ ┌──────────────┐ ┌──────────────┐                             │
│ │ ● MinIO      │ │ ● Redis      │                             │
│ │   67ms       │ │   8ms        │                             │
│ └──────────────┘ └──────────────┘                             │
│                                                                 │
│ Databases & Backup (2/2) Last backup: 2025-12-10 12:00:00     │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│ │ 🗄️ PostgreSQL│ │ 🗄️ Redis     │ │ 💾 Backup    │             │
│ │   12ms       │ │   8ms        │ │   One-click  │             │
│ └──────────────┘ └──────────────┘ └──────────────┘             │
│                                                                 │
│ 8/8 services working • Response times 8-67ms                   │
└─────────────────────────────────────────────────────────────────┘
```

### Status Colors

- **Green (●)**: `healthy` - Service operational
- **Yellow (⚠)**: `unhealthy` - Service degraded performance
- **Red (●)**: `down` - Service offline/unreachable
- **Gray (?)**: `unknown` - Status not determined

---

## Behavior

### Expand/Collapse

**Triggers:**
- Click anywhere on header bar → toggle expand/collapse
- Click outside StatusBar when expanded → collapse
- No keyboard shortcut (use mouse only)

**State Management:**
```typescript
const [isExpanded, setIsExpanded] = useState(false);

// Notify parent when state changes
useEffect(() => {
  onExpandedChange?.(isExpanded);
}, [isExpanded, onExpandedChange]);
```

### Drag-to-Resize

**Interaction:**
1. Hover over top edge of expanded panel → resize cursor appears
2. Click and drag upward → increase height
3. Click and drag downward → decrease height
4. Release mouse → save height to localStorage

**Constraints:**
- Minimum height: 150px
- Maximum height: 600px
- Persisted key: `'l-kern-statusbar-height'`

```typescript
const handleMouseMove = (e: MouseEvent) => {
  const deltaY = dragStartY - e.clientY;
  const newHeight = Math.max(150, Math.min(600, dragStartHeight + deltaY));
  setExpandedHeight(newHeight);
};

const handleMouseUp = () => {
  localStorage.setItem('l-kern-statusbar-height', expandedHeight.toString());
  onExpandedHeightChange?.(expandedHeight);
};
```

### Backup Flow

**Sequence:**
1. User clicks "💾 Backup" button
2. `isBackupRunning` set to true
3. Progress bar appears (0% → 100%)
4. Status messages update ("Starting...", "Processing 3/10...", "Completed")
5. `onBackup` callback invoked (or mock backup runs)
6. On completion: show last backup info
7. Auto-hide status message after 3 seconds

**Mock Backup (No Callback):**
```typescript
// Simulates backup with random progress
let progress = 0;
const interval = setInterval(() => {
  progress += Math.random() * 20;
  if (progress >= 100) {
    progress = 100;
    clearInterval(interval);
    setIsBackupRunning(false);
  }
  setBackupProgress(Math.round(progress));
}, 500);
```

### Theme Toggle

Integrated light/dark mode switcher:

```
☀️ ─────○  Light mode
🌙 ○───── Dark mode
```

Calls `useTheme().toggleTheme()` on click.

### Language Switcher

Cycles through available languages:

```
┌────┐
│ SK │  → Click → EN → Click → SK (cycle)
└────┘
```

Calls `useTranslation().setLanguage(nextLanguage)` on click.

---

## Service Categories

### Critical Services

**Definition:** Services with `critical: true` property

**Purpose:** Mission-critical services that must be running for app to function

**Examples:**
- Issues Service (LKMS105)
- Contacts Service (LKMS101)
- Configuration Service (LKMS199)
- Authentication Service (LKMS200)

**Status Message:**
- All critical healthy → "System operational"
- Any critical unhealthy → "Critical services unhealthy" (red indicator)

### Other Services

**Definition:** Services with `critical: false` property

**Purpose:** Supporting services (caching, storage, async processing)

**Examples:**
- MinIO (object storage)
- Redis (caching)
- Kafka (event bus)

**Status Message:**
- All services healthy → "All services running"
- Some non-critical unhealthy → "System operational" (yellow indicator)

### Databases Section

**Definition:** Services with "database", "postgres", or "redis" in name (case-insensitive)

**Purpose:** Data persistence layer

**Special Features:**
- Backup button included in this section
- Last backup timestamp displayed
- Database icon (🗄️) instead of status dot

---

## Known Issues

### Current Known Issues

- ⚠️ **Backend Integration Pending**: Currently uses mock data (dataSource: 'mock')
  - **Tracking**: Task #1.90 System Operations Service
  - **Impact**: Service status not real-time, backup is simulated
  - **Workaround**: Pass real services data and onBackup callback

- ⚠️ **Backup Progress Not Real**: Mock backup uses random progress simulation
  - **Tracking**: Task #1.90 System Operations Service
  - **Impact**: Progress bar doesn't reflect actual backup progress
  - **Workaround**: Implement onBackup callback with real progress updates

### Resolved Issues

- ✅ **FIXED (v1.0.0)**: Click outside to close now works correctly
- ✅ **FIXED (v1.0.0)**: Resize handle doesn't interfere with expand/collapse
- ✅ **FIXED (v1.0.0)**: localStorage persistence works across sessions

---

## Testing

### Test Coverage

- **Unit Tests**: 15 tests, 95% coverage
- **Component Tests**: Expand/collapse, resize, backup flow, theme toggle
- **Integration Tests**: Floating button coordination, click outside

### Key Test Cases

1. **Renders collapsed by default**
2. **Expands on header click**
3. **Collapses on outside click**
4. **Shows correct service counts**
5. **Displays status colors correctly**
6. **Backup button triggers onBackup callback**
7. **Resize handle changes height within constraints**
8. **Persists custom height to localStorage**
9. **Theme toggle calls toggleTheme()**
10. **Language switcher cycles through languages**
11. **Categorizes services correctly (critical/other/database)**
12. **Shows data source indicator when not orchestrator**

---

## Related Components

- [ThemeCustomizer](../ThemeCustomizer/ThemeCustomizer.md) - Floating theme button (coordinates with StatusBar)
- [KeyboardShortcutsButton](../KeyboardShortcutsButton/KeyboardShortcutsButton.md) - Floating shortcuts button (coordinates with StatusBar)
- [BasePage](../BasePage/BasePage.md) - Page layout component (includes StatusBar)

---

## Changelog

### v1.0.0 (2025-11-30)
- ✅ Initial release (ported from v3)
- ✅ Real-time service monitoring
- ✅ Expandable panel with drag-to-resize (150-600px)
- ✅ Service categories (critical, other, databases)
- ✅ Backup integration with progress tracking
- ✅ Theme and language toggles
- ✅ Click outside to close
- ✅ localStorage height persistence
- ✅ Floating button coordination callbacks
- ✅ Data source indicator (orchestrator/mock/error)
- ✅ Current user display
- ⚠️ Backend integration pending (mock data)

---

## Best Practices

1. **Provide Real Services Data**: Connect to orchestrator service for accurate monitoring
2. **Implement onBackup Handler**: Replace mock backup with real backup trigger
3. **Use Critical Flag Wisely**: Only mark truly critical services as `critical: true`
4. **Update Response Times**: Poll orchestrator every 5-10 seconds for fresh data
5. **Handle Errors Gracefully**: Set `dataSource: 'error'` when orchestrator is down
6. **Coordinate Floating Buttons**: Pass callbacks to ThemeCustomizer and KeyboardShortcutsButton
7. **Test Resize Limits**: Ensure 150-600px constraints work on all screen sizes
8. **Localize Status Messages**: Use `t()` function for all user-facing text

---

**End of StatusBar Documentation**
