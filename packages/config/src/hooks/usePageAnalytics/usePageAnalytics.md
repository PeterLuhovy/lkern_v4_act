# ================================================================
# usePageAnalytics
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\hooks\usePageAnalytics.md
# Version: 2.1.0
# Created: 2025-10-20
# Updated: 2025-10-20 15:30:00
# Hook Location: packages/config/src/hooks/usePageAnalytics/usePageAnalytics.ts
# Package: @l-kern/config
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   React hook for comprehensive user interaction analytics including
#   click tracking, keyboard events, drag operations, text selection,
#   timing metrics, session management, and debounced event handling
#   for pages and modals.
# ================================================================

---

## Overview

**Purpose**: Track user interactions (clicks, keyboard, drag, text selection, timing) for analytics, UX optimization, and behavior analysis
**Package**: @l-kern/config
**Path**: packages/config/src/hooks/usePageAnalytics
**Since**: v1.0.0 | **Latest**: v2.1.0

`usePageAnalytics` provides a complete user interaction tracking solution for pages and modals. It captures click events (with coordinates and timing), keyboard events (with modifiers), drag operations, text selection, text drag & drop, session duration, and provides real-time metrics. Features intelligent debouncing (<500ms = merged event, ≥500ms = separate down/up), drag/text selection detection, and repeat key filtering.

---

## Features

- ✅ Session management (start, end, reset) with unique session IDs
- ✅ Click tracking with coordinates, timing, and element identification
- ✅ Keyboard tracking with modifiers (Ctrl, Shift, Alt, Meta) and target elements
- ✅ **Text selection tracking** with selected text, length, distance, and duration
- ✅ **Drag operation tracking** (element drag) with distance calculation and coordinates
- ✅ **Text drag & drop tracking** (native HTML5 dragstart/dragend events)
- ✅ Intelligent debouncing (**<500ms** = merged event, **≥500ms** = separate down/up events)
- ✅ Smart distinction (text selection vs element drag vs text drag & drop)
- ✅ Repeat key filtering (OS key repeat events ignored)
- ✅ Real-time metrics update (100ms interval)
- ✅ Time tracking (total session time, time since last activity)
- ✅ Average time between clicks calculation (memoized for performance)
- ✅ Session outcome tracking (confirmed, cancelled, dismissed, navigated)
- ✅ Context support (page vs modal analytics)
- ✅ Debug report generation (full session data export)
- ✅ Memory leak prevention (cleanup timeouts on unmount)
- ✅ Zero external dependencies (pure React hooks)

---

## Quick Start

### Basic Usage

```tsx
import { usePageAnalytics } from '@l-kern/config';

function ContactsPage() {
  const analytics = usePageAnalytics('contacts-page', 'page');

  // Start analytics when component mounts
  useEffect(() => {
    analytics.startSession();
    return () => analytics.endSession('navigated');
  }, []);

  return (
    <div>
      <button
        onMouseDown={(e) => analytics.trackClick('add-button', 'button', e)}
        onMouseUp={(e) => analytics.trackClick('add-button', 'button', e)}
      >
        Add Contact
      </button>
      <p>Clicks: {analytics.metrics.clickCount}</p>
      <p>Time: {analytics.metrics.totalTime}</p>
    </div>
  );
}
```

### Common Patterns

#### Pattern 1: Modal Analytics

```tsx
import { usePageAnalytics } from '@l-kern/config';

function EditContactModal({ isOpen, onClose }) {
  const analytics = usePageAnalytics('edit-contact-modal', 'modal');

  useEffect(() => {
    if (isOpen) {
      analytics.startSession();
    }
  }, [isOpen]);

  const handleConfirm = () => {
    analytics.endSession('confirmed');
    onClose();
  };

  const handleCancel = () => {
    analytics.endSession('cancelled');
    onClose();
  };

  return (
    <Modal isOpen={isOpen}>
      <input onKeyDown={analytics.trackKeyboard} onKeyUp={analytics.trackKeyboard} />
      <button
        onMouseDown={(e) => analytics.trackClick('confirm', 'button', e)}
        onMouseUp={(e) => analytics.trackClick('confirm', 'button', e)}
        onClick={handleConfirm}
      >
        Confirm
      </button>
    </Modal>
  );
}
```

#### Pattern 2: Real-Time Metrics Display

```tsx
function AnalyticsDashboard() {
  const analytics = usePageAnalytics('dashboard');

  return (
    <div>
      <h3>Session Metrics</h3>
      <p>Total Time: {analytics.metrics.totalTime}</p>
      <p>Last Activity: {analytics.metrics.timeSinceLastActivity}</p>
      <p>Clicks: {analytics.metrics.clickCount}</p>
      <p>Keystrokes: {analytics.metrics.keyboardCount}</p>
      <p>Avg Click Interval: {analytics.metrics.averageTimeBetweenClicks.toFixed(0)}ms</p>
    </div>
  );
}
```

---

## API Reference

### Function Signature

```typescript
function usePageAnalytics(
  pageName: string,
  contextType?: 'page' | 'modal'
): UsePageAnalyticsReturn
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pageName` | `string` | Yes | Unique identifier for page/modal (e.g., 'contacts-page', 'edit-modal') |
| `contextType` | `'page' \| 'modal'` | No | Context type for logging (default: `'page'`) |

### Return Value

```typescript
interface UsePageAnalyticsReturn {
  // SESSION CONTROL
  startSession: () => void;
  endSession: (outcome: 'confirmed' | 'cancelled' | 'dismissed' | 'navigated') => void;
  resetSession: () => void;

  // SESSION STATE
  isSessionActive: boolean;

  // EVENT TRACKING
  trackClick: (element: string, elementType: string, event?: React.MouseEvent) => void;
  trackKeyboard: (event: React.KeyboardEvent | globalThis.KeyboardEvent) => void;
  trackDragStart: (selectedText: string, coordinates: { x: number; y: number }) => void;
  trackDragEnd: (endCoordinates: { x: number; y: number }) => void;

  // METRICS (real-time)
  metrics: PageAnalyticsMetrics;

  // SESSION DATA
  session: PageAnalyticsSession | null;

  // DEBUG
  getSessionReport: () => PageAnalyticsSession | null;
}
```

| Return Property | Type | Description |
|-----------------|------|-------------|
| **SESSION CONTROL** | | |
| `startSession` | `() => void` | Starts analytics session; creates session ID, resets metrics |
| `endSession` | `(outcome) => void` | Ends session with outcome; logs final report |
| `resetSession` | `() => void` | Resets session data without ending (manual cleanup) |
| **SESSION STATE** | | |
| `isSessionActive` | `boolean` | `true` if session started and not ended |
| **EVENT TRACKING** | | |
| `trackClick` | `(element, elementType, event?) => void` | Tracks click event (call on mousedown + mouseup) |
| `trackKeyboard` | `(event) => void` | Tracks keyboard event (call on keydown + keyup) |
| `trackDragStart` | `(selectedText, coordinates) => void` | **NEW v2.0**: Tracks HTML5 dragstart event (text drag & drop) |
| `trackDragEnd` | `(endCoordinates) => void` | **NEW v2.0**: Tracks HTML5 dragend event (text drag & drop) |
| **METRICS** | | |
| `metrics` | `PageAnalyticsMetrics` | Real-time metrics object (see below) |
| **SESSION DATA** | | |
| `session` | `PageAnalyticsSession \| null` | Current session data (null if not started) |
| **DEBUG** | | |
| `getSessionReport` | `() => PageAnalyticsSession \| null` | Returns full session report for debugging |

### PageAnalyticsMetrics Type

```typescript
interface PageAnalyticsMetrics {
  totalTime: string;                    // e.g., "5.3s"
  timeSinceLastActivity: string;        // e.g., "1.2s" or "-"
  clickCount: number;                   // Total clicks logged
  keyboardCount: number;                // Total keystrokes logged
  averageTimeBetweenClicks: number;     // Avg time in milliseconds
}
```

### PageAnalyticsSession Type

```typescript
interface PageAnalyticsSession {
  sessionId: string;                    // e.g., "contacts-page-1729500000"
  pageName: string;                     // Page/modal name
  startTime: number;                    // Timestamp (ms)
  endTime?: number;                     // Timestamp (ms)
  outcome?: 'confirmed' | 'cancelled' | 'dismissed' | 'navigated';
  clickEvents: ClickEvent[];            // Array of click events
  keyboardEvents: KeyboardEvent[];      // Array of keyboard events
  totalDuration?: number;               // Duration in ms
}
```

### ClickEvent Type

```typescript
interface ClickEvent {
  timestamp: number;                    // Event timestamp (ms)
  element: string;                      // Element identifier
  elementType: string;                  // Element type (button, input, etc.)
  coordinates?: { x: number; y: number }; // Mouse coordinates
  timeSinceLastClick?: number;          // Time since last click (ms)
  eventType: 'mousedown' | 'mouseup' | 'click';
}
```

### KeyboardEvent Type

```typescript
interface KeyboardEvent {
  timestamp: number;                    // Event timestamp (ms)
  key: string;                          // Key pressed (e.g., 'Enter', 'a')
  code: string;                         // Key code (e.g., 'KeyA')
  modifiers: {
    ctrl: boolean;
    shift: boolean;
    alt: boolean;
    meta: boolean;
  };
  eventType: 'keydown' | 'keyup';
  timeSinceLastKey?: number;            // Time since last keystroke (ms)
  targetElement?: string;               // Target input element
}
```

---

## Behavior

### Internal Logic

**Session Management:**
- `startSession()` creates new session with unique ID (`pageName-timestamp`)
- Prevents double-start (ignores if session already active)
- Resets all metrics and timers
- Logs session start to console

**Event Tracking - Intelligent Debouncing (v2.1.0):**

- **Click Events** (mousedown/mouseup):
  - `mousedown` → store pending event with coordinates
  - `mouseup` → analyze what happened:

    **1. Text Selection Detection** (delta > 5px + text selected):
    ```javascript
    [Analytics] Text selection: {
      selectedText: "Lorem ipsum...",
      selectedLength: "145 chars",
      duration: "1799ms",
      distance: "148px"
    }
    ```

    **2. Element Drag Detection** (delta > 5px + NO text selected):
    ```javascript
    [Analytics] Drag operation: {
      element: "modal-header",
      duration: "523ms",
      distance: "156px",
      startCoords: {x, y},
      endCoords: {x, y}
    }
    ```

    **3. Fast Click** (delta <= 5px AND duration < 500ms):
    ```javascript
    [Analytics] Click: {
      element: "button",
      duration: "120ms"
    }
    ```

    **4. Slow Click** (delta <= 5px AND duration >= 500ms):
    ```javascript
    [Analytics] Mouse down: { ... }
    [Analytics] Mouse up: { duration: "750ms" }
    ```

- **Text Drag & Drop** (native HTML5 events):
  - `dragstart` → capture selected text + start coordinates
  - `dragend` → calculate distance + duration
  ```javascript
  [Analytics] Drag started: { selectedText: "Lorem...", ... }
  [Analytics] Text drag (drop): {
    selectedText: "Lorem...",
    duration: "450ms",
    distance: "89px",
    startCoords: {x, y},
    endCoords: {x, y}
  }
  ```
  **Note**: Browser does NOT fire mousedown/mouseup when dragging selected text!

- **Keyboard Events**:
  - `keydown` → store pending event
  - `keyup` → check duration:
    - **<500ms** → log single `keydown` event (merged)
    - **≥500ms** → log separate `keydown` + `keyup` events
  - Repeat key filtering: OS key repeat events ignored (`event.repeat`)

**Real-Time Metrics:**
- Updates every 100ms via `setInterval`
- Calculates:
  - `totalTime`: Time since session start
  - `timeSinceLastActivity`: Time since last click OR keyboard event (unified)
  - `clickCount`: Total click events logged
  - `keyboardCount`: Total keyboard events logged
  - `averageTimeBetweenClicks`: Computed from `timeSinceLastClick` values

**Side Effects:**
- `setInterval` runs when session active (100ms update)
- Cleanup: `clearInterval` when session ends or component unmounts
- Console logging: All events logged to console with `[Analytics][Page|Modal][pageName]` prefix

**Memoization:**
- All functions memoized with `useCallback`
- Dependencies: `[pageName, logPrefix]`

### Dependencies

**React Hooks Used:**
- `useState` - Manages session state, metrics state
- `useRef` - Stores session data, timing references, pending events
- `useCallback` - Memoizes all tracking functions
- `useEffect` - Runs real-time metrics update interval

**External Dependencies:**
- None (zero external packages)

### Re-render Triggers

**Hook re-executes when:**
- Component re-renders (hook runs on every render)
- `pageName` prop changes

**Component re-renders when:**
- `session` state changes (new/ended session)
- Metrics update (every 100ms during active session)
- `clickCount` or `keyboardCount` changes

**Performance Note**: Metrics update every 100ms causes re-renders. For display-only components, consider debouncing or memoization.

---

## Examples

### Example 1: Basic Page Analytics

```tsx
import { usePageAnalytics } from '@l-kern/config';
import { useEffect } from 'react';

function ContactsPage() {
  const analytics = usePageAnalytics('contacts-page', 'page');

  useEffect(() => {
    analytics.startSession();

    return () => {
      analytics.endSession('navigated');
    };
  }, []);

  const handleAddContact = () => {
    console.log('Add contact clicked');
  };

  return (
    <div>
      <h1>Contacts</h1>

      <button
        onMouseDown={(e) => analytics.trackClick('add-button', 'button', e)}
        onMouseUp={(e) => analytics.trackClick('add-button', 'button', e)}
        onClick={handleAddContact}
      >
        Add Contact
      </button>

      {/* Search input with keyboard tracking */}
      <input
        placeholder="Search..."
        onKeyDown={analytics.trackKeyboard}
        onKeyUp={analytics.trackKeyboard}
      />

      {/* Real-time metrics */}
      <div className="metrics">
        <p>Session Time: {analytics.metrics.totalTime}</p>
        <p>Clicks: {analytics.metrics.clickCount}</p>
        <p>Keystrokes: {analytics.metrics.keyboardCount}</p>
      </div>
    </div>
  );
}
```

### Example 2: Modal Analytics with Outcomes

```tsx
import { usePageAnalytics, useTranslation } from '@l-kern/config';
import { Modal, Button } from '@l-kern/ui-components';
import { useEffect } from 'react';

function EditContactModal({ isOpen, contact, onSave, onCancel }) {
  const { t } = useTranslation();
  const analytics = usePageAnalytics('edit-contact-modal', 'modal');
  const [formData, setFormData] = useState(contact);

  // Start session when modal opens
  useEffect(() => {
    if (isOpen) {
      analytics.startSession();
    }
  }, [isOpen]);

  const handleSave = async () => {
    try {
      await onSave(formData);
      analytics.endSession('confirmed'); // Track successful save
    } catch (error) {
      analytics.endSession('dismissed'); // Track error dismiss
    }
  };

  const handleCancel = () => {
    analytics.endSession('cancelled'); // Track cancellation
    onCancel();
  };

  const handleClose = (e: React.MouseEvent) => {
    analytics.trackClick('close-button', 'button', e);
    analytics.endSession('dismissed'); // Track X button dismiss
    onCancel();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <h2>{t('contacts.edit')}</h2>

      {/* Track input interactions */}
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        onKeyDown={analytics.trackKeyboard}
        onKeyUp={analytics.trackKeyboard}
        onMouseDown={(e) => analytics.trackClick('name-input', 'input', e)}
        onMouseUp={(e) => analytics.trackClick('name-input', 'input', e)}
      />

      <div className="modal-actions">
        <Button
          variant="secondary"
          onMouseDown={(e) => analytics.trackClick('cancel-button', 'button', e)}
          onMouseUp={(e) => analytics.trackClick('cancel-button', 'button', e)}
          onClick={handleCancel}
        >
          {t('common.cancel')}
        </Button>
        <Button
          variant="primary"
          onMouseDown={(e) => analytics.trackClick('save-button', 'button', e)}
          onMouseUp={(e) => analytics.trackClick('save-button', 'button', e)}
          onClick={handleSave}
        >
          {t('common.save')}
        </Button>
      </div>

      {/* Debug: Show session report */}
      {process.env.NODE_ENV === 'development' && (
        <pre>{JSON.stringify(analytics.getSessionReport(), null, 2)}</pre>
      )}
    </Modal>
  );
}
```

### Example 3: Advanced Analytics with Report Export

```tsx
import { usePageAnalytics } from '@l-kern/config';
import { useState, useEffect } from 'react';

function DashboardWithAnalytics() {
  const analytics = usePageAnalytics('dashboard', 'page');
  const [sessionHistory, setSessionHistory] = useState<any[]>([]);

  useEffect(() => {
    analytics.startSession();

    return () => {
      const report = analytics.getSessionReport();
      if (report) {
        setSessionHistory((prev) => [...prev, report]);
        // Send to analytics API
        sendAnalyticsReport(report);
      }
      analytics.endSession('navigated');
    };
  }, []);

  const sendAnalyticsReport = async (report: any) => {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });
      console.log('Analytics report sent:', report.sessionId);
    } catch (error) {
      console.error('Failed to send analytics:', error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Interactive elements with tracking */}
      <button
        onMouseDown={(e) => analytics.trackClick('refresh', 'button', e)}
        onMouseUp={(e) => analytics.trackClick('refresh', 'button', e)}
      >
        Refresh
      </button>

      {/* Real-time metrics display */}
      <div className="analytics-panel">
        <h3>Session Metrics</h3>
        <table>
          <tr>
            <td>Session Time:</td>
            <td>{analytics.metrics.totalTime}</td>
          </tr>
          <tr>
            <td>Last Activity:</td>
            <td>{analytics.metrics.timeSinceLastActivity}</td>
          </tr>
          <tr>
            <td>Clicks:</td>
            <td>{analytics.metrics.clickCount}</td>
          </tr>
          <tr>
            <td>Keystrokes:</td>
            <td>{analytics.metrics.keyboardCount}</td>
          </tr>
          <tr>
            <td>Avg Click Interval:</td>
            <td>{analytics.metrics.averageTimeBetweenClicks.toFixed(0)}ms</td>
          </tr>
        </table>
      </div>

      {/* Session history */}
      <div className="history">
        <h3>Session History</h3>
        {sessionHistory.map((session) => (
          <div key={session.sessionId}>
            <p>ID: {session.sessionId}</p>
            <p>Duration: {(session.totalDuration / 1000).toFixed(1)}s</p>
            <p>Outcome: {session.outcome}</p>
            <p>Clicks: {session.clickEvents.length}</p>
            <p>Keys: {session.keyboardEvents.length}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Example 4: Drag & Text Selection Tracking (v2.0+)

```tsx
import { usePageAnalytics } from '@l-kern/config';
import { useEffect } from 'react';

function DraggableContentPage() {
  const analytics = usePageAnalytics('content-page', 'page');

  useEffect(() => {
    analytics.startSession();

    // Global drag event listeners (for text drag & drop)
    const handleDragStart = (e: DragEvent) => {
      const selectedText = window.getSelection()?.toString() || '';
      if (selectedText) {
        analytics.trackDragStart(selectedText, {
          x: e.clientX,
          y: e.clientY
        });
      }
    };

    const handleDragEnd = (e: DragEvent) => {
      analytics.trackDragEnd({
        x: e.clientX,
        y: e.clientY
      });
    };

    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('dragend', handleDragEnd);

    return () => {
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('dragend', handleDragEnd);
      analytics.endSession('navigated');
    };
  }, []);

  return (
    <div>
      <h1>Draggable Content Demo</h1>

      {/* Text content - selectable and draggable */}
      <p>
        Select this text and drag it around. Analytics will track:
        1. Text selection (when you highlight text)
        2. Text drag & drop (when you drag selected text)
      </p>

      {/* Draggable modal/element */}
      <div
        className="draggable-box"
        onMouseDown={(e) => analytics.trackClick('draggable-box', 'div', e)}
        onMouseUp={(e) => analytics.trackClick('draggable-box', 'div', e)}
      >
        Drag me! (element drag)
      </div>

      {/* Analytics output */}
      <div className="analytics-log">
        <h3>Analytics Events:</h3>
        <ul>
          <li>Text Selection: Drag mouse over text → logs selected text + distance</li>
          <li>Element Drag: Drag the box → logs "Drag operation" with coordinates</li>
          <li>Text Drag: Select text, then drag it → logs "Text drag (drop)"</li>
        </ul>
      </div>
    </div>
  );
}
```

**Expected Console Output:**

```javascript
// Scenario 1: User selects text
[Analytics][Page][content-page] Text selection: {
  element: 'p',
  elementType: 'p',
  selectedText: 'Select this text and drag it around...',
  selectedLength: '145 chars',
  duration: '1850ms',
  distance: '234px',
  deltaX: '230px',
  deltaY: '15px'
}

// Scenario 2: User drags the box (element drag)
[Analytics][Page][content-page] Drag operation: {
  element: 'draggable-box',
  elementType: 'div',
  duration: '680ms',
  distance: '187px',
  deltaX: '150px',
  deltaY: '110px',
  startCoords: {x: 100, y: 200},
  endCoords: {x: 250, y: 310}
}

// Scenario 3: User drags already selected text
[Analytics][Page][content-page] Drag started: {
  selectedText: 'Select this text and drag it around...',
  selectedLength: '145 chars',
  startCoords: {x: 120, y: 180}
}

[Analytics][Page][content-page] Text drag (drop): {
  selectedText: 'Select this text and drag it around...',
  selectedLength: '145 chars',
  duration: '520ms',
  distance: '95px',
  deltaX: '80px',
  deltaY: '50px',
  startCoords: {x: 120, y: 180},
  endCoords: {x: 200, y: 230}
}
```

---

## Performance

### Memoization Strategy

**Memoized Functions:**
- All tracking functions use `useCallback`
- Dependencies: `[pageName, logPrefix]`

**Real-Time Updates:**
- Metrics update every 100ms via `setInterval` (causes re-renders)
- Consider debouncing display updates for performance

**Optimization:**
```tsx
// ✅ GOOD - Memoize metrics display
const MetricsDisplay = React.memo(({ metrics }) => (
  <div>
    <p>Clicks: {metrics.clickCount}</p>
    <p>Time: {metrics.totalTime}</p>
  </div>
));

// ❌ BAD - Re-renders every 100ms
function Component() {
  const analytics = usePageAnalytics('page');
  return <div>{analytics.metrics.totalTime}</div>; // Re-renders frequently!
}
```

### Re-render Triggers

**Hook re-executes when:**
- Component re-renders
- `pageName` prop changes

**Component re-renders when:**
- Session state changes
- Metrics update (every 100ms)
- Event counts change

**Prevent unnecessary re-renders:**
```tsx
// ✅ Wrap metrics display in React.memo
const MetricsPanel = React.memo(({ metrics }) => { /* ... */ });
```

### Memory Usage

- **Typical**: ~5-20KB per session (depends on event count)
- **Cleanup**: Automatic when component unmounts (interval cleared)
- **Leaks**: None (proper cleanup in useEffect return)

### Complexity

- **Time**: O(1) for event tracking; O(n) for metrics calculation (n = event count)
- **Space**: O(n) where n = total events logged (click + keyboard)

---

## Known Issues

### Active Issues

**Issue #1**: High-frequency re-renders during active session
- **Severity**: Low
- **Affects**: Components displaying real-time metrics (metrics update every 100ms)
- **Workaround**: Wrap metrics display in `React.memo()` to prevent unnecessary re-renders
- **Tracking**: Task #TBD
- **Status**: Accepted behavior (real-time metrics require frequent updates)

### Fixed Issues

**Issue**: Memory leak in `endSession` timeout cleanup
- **Affected Versions**: v1.0.0
- **Fixed In**: v1.1.0
- **Solution**: Added `endSessionTimeoutRef` with proper cleanup on unmount

**Issue**: Performance issue - `averageTimeBetweenClicks` calculated on every render
- **Affected Versions**: v1.0.0
- **Fixed In**: v1.1.0
- **Solution**: Wrapped calculation in `useMemo` with proper dependencies

**Issue**: Text drag & drop not detected (browser suppresses mousedown/mouseup)
- **Affected Versions**: v1.0.0 - v1.5.0
- **Fixed In**: v2.0.0
- **Solution**: Implemented native HTML5 drag events (dragstart/dragend)

**Issue**: Text selection didn't show selected text in logs
- **Affected Versions**: v2.0.0
- **Fixed In**: v2.1.0
- **Solution**: Moved `getSelection()` check after mouseup, display selected text in logs

See [Changelog](#changelog) section for complete version history.

---

## Testing

### Test Coverage
- ✅ **Unit Tests**: 28 tests (all passing)
- ✅ **Coverage**: 100% (statements, branches, functions, lines)
- ✅ **Hook Tests**: Using @testing-library/react with vitest
- ✅ **Edge Cases**: Drag detection, debouncing, text selection, keyboard filtering, HTML5 drag events

### Test File
`packages/config/src/hooks/usePageAnalytics/usePageAnalytics.test.ts`

### Running Tests
```bash
# Run hook tests
docker exec lkms201-web-ui npx nx test config --testFile=usePageAnalytics.test.ts

# Run with coverage
docker exec lkms201-web-ui npx nx test config --coverage --testFile=usePageAnalytics.test.ts

# Watch mode
docker exec lkms201-web-ui npx nx test config --watch --testFile=usePageAnalytics.test.ts
```

### Key Test Cases

**Initialization:**
- ✅ Initializes with no active session
- ✅ Stores page name correctly

**Session Management:**
- ✅ Starts session
- ✅ Ends session with outcome
- ✅ Calculates total duration
- ✅ Does not start session twice
- ✅ Resets session

**Click Tracking:**
- ✅ Tracks click events with coordinates
- ✅ Does not track clicks without active session
- ✅ Calculates time since last click

**Keyboard Tracking:**
- ✅ Tracks keyboard events with modifiers
- ✅ Ignores repeat key events
- ✅ Tracks target element

**Metrics:**
- ✅ Updates metrics in real-time
- ✅ Calculates average time between clicks

**Debouncing:**
- ✅ Merges fast clicks (<500ms) into single event
- ✅ Logs separate events for slow clicks (≥500ms)

**Drag Detection:**
- ✅ Ignores clicks when mouse moved >5px

---

## Related Hooks

- **[usePageTracking](usePageTracking.md)** - Simple page view tracking (lightweight alternative)
- **[useModal](useModal.md)** - Modal state management (use together for modal analytics)

---

## Related Components

- **[Button](../components/Button.md)** - Track button clicks
- **[Input](../components/Input.md)** - Track keyboard events in inputs
- **[Modal](../components/Modal.md)** - Track modal interactions

---

## Migration Guide

### From v3 to v4

**No breaking changes** - This is a new hook in v4.

If migrating from custom analytics in v3:

**v3 (Manual tracking):**
```tsx
const [clicks, setClicks] = useState(0);
const handleClick = () => setClicks(clicks + 1);
```

**v4 (usePageAnalytics hook):**
```tsx
const analytics = usePageAnalytics('page');
const handleClick = (e) => analytics.trackClick('button', 'button', e);
```

---

## Changelog

### v2.1.0 (2025-10-21)
- ✅ **FIX**: Text selection now displays selected text in console logs
- ✅ **IMPROVED**: Text selection detection moved after mouseup (check actual selection result)
- ✅ **ENHANCED**: Text selection logs show selected text (truncated to 50 chars if longer)
- ✅ **ENHANCED**: Text selection logs show character count (`selectedLength`)

### v2.0.0 (2025-10-21) - MAJOR UPDATE
- 🎉 **NEW**: HTML5 drag event tracking for text drag & drop operations
- 🎉 **NEW**: `trackDragStart(selectedText, coordinates)` method
- 🎉 **NEW**: `trackDragEnd(endCoordinates)` method
- ✅ **FIX**: Now properly detects when user drags already selected text (browser suppresses mousedown/mouseup)
- ✅ **ENHANCED**: Drag logs include distance (Pythagorean calculation), duration, start/end coordinates
- ✅ **ENHANCED**: Text selection vs element drag clearly distinguished
- 📚 **DOCS**: Added Example 4 (Drag & Text Selection Tracking) with expected console output

### v1.3.0 (2025-10-21)
- ✅ **CHANGED**: Debouncing threshold reduced from 1000ms to 500ms
- ✅ **CHANGED**: Fast clicks now <500ms (previously <1000ms)
- ✅ **CHANGED**: Slow clicks now ≥500ms (previously ≥1000ms)
- ✅ **UPDATED**: All test cases updated to reflect 500ms threshold
- 📚 **DOCS**: Updated documentation to reflect 500ms debouncing

### v1.2.0 (2025-10-21)
- 🎉 **NEW**: Text selection detection (drag with selected text)
- 🎉 **NEW**: Drag operation logging (element drag without text)
- ✅ **ENHANCED**: Console logs now distinguish between:
  - Text selection (user selects text with mouse)
  - Drag operation (user drags modal/element)
  - Regular clicks
- ✅ **ENHANCED**: Logs show distance, duration, delta coordinates for drag operations
- 📚 **DOCS**: Added detailed behavior documentation for all interaction types

### v1.1.0 (2025-10-21)
- ✅ **FIX**: Memory leak - `endSession` timeout now properly cleaned up on unmount
- ✅ **FIX**: Performance - `averageTimeBetweenClicks` now memoized with correct dependencies
- ✅ **CHANGED**: Analytics always run (previously tied to `showDebugBar` prop)
- ✅ **CHANGED**: `showDebugBar` now only controls visualization (analytics run independently)
- 📚 **DOCS**: Added cleanup documentation and performance notes

### v1.0.0 (2025-10-18)
- 🎉 Initial release
- ✅ Session management (start, end, reset)
- ✅ Click tracking with coordinates and timing
- ✅ Keyboard tracking with modifiers
- ✅ Intelligent debouncing (<1s / ≥1s logic)
- ✅ Drag detection (>5px = no click)
- ✅ Repeat key filtering (OS repeats ignored)
- ✅ Real-time metrics (100ms update interval)
- ✅ Session outcome tracking (4 types)
- ✅ Context support (page/modal)
- ✅ Debug report generation
- ✅ 68 unit tests (100% coverage)

---

## Troubleshooting

### Common Issues

**Issue**: Too many re-renders
**Cause**: Metrics update every 100ms
**Solution**:
```tsx
// ❌ BAD - Re-renders every 100ms
function Component() {
  const analytics = usePageAnalytics('page');
  return <div>{analytics.metrics.totalTime}</div>;
}

// ✅ GOOD - Memoized display
const MetricsDisplay = React.memo(({ metrics }) => (
  <div>{metrics.totalTime}</div>
));

function Component() {
  const analytics = usePageAnalytics('page');
  return <MetricsDisplay metrics={analytics.metrics} />;
}
```

**Issue**: Click events not logged
**Cause**: Forgot to call `trackClick` on both mousedown AND mouseup
**Solution**:
```tsx
// ❌ BAD - Only onClick
<button onClick={() => analytics.trackClick('btn', 'button')}>

// ✅ GOOD - mousedown + mouseup
<button
  onMouseDown={(e) => analytics.trackClick('btn', 'button', e)}
  onMouseUp={(e) => analytics.trackClick('btn', 'button', e)}
>
```

**Issue**: Keyboard events flooding console
**Cause**: OS key repeat events not filtered
**Solution**: Hook automatically filters `event.repeat=true` events. If still seeing duplicates, check browser compatibility.

**Issue**: Session data lost
**Cause**: Component unmounted before `endSession()` called
**Solution**:
```tsx
// ✅ End session in cleanup
useEffect(() => {
  analytics.startSession();
  return () => analytics.endSession('navigated');
}, []);
```

---

## Best Practices

1. ✅ **Start session on mount** - Use `useEffect(() => { startSession(); return () => endSession(...); }, [])`
2. ✅ **End with outcome** - Always specify outcome: 'confirmed', 'cancelled', 'dismissed', 'navigated'
3. ✅ **Track both mousedown + mouseup** - Enables intelligent debouncing
4. ✅ **Track both keydown + keyup** - Enables duration calculation
5. ✅ **Use unique element names** - Helps analyze specific interactions
6. ✅ **Memoize metrics display** - Prevent unnecessary re-renders
7. ✅ **Export session reports** - Send to analytics API for analysis
8. ✅ **Use context type** - Distinguish between page and modal analytics
9. ✅ **Don't track sensitive data** - Avoid logging passwords or PII
10. ✅ **Test in development** - Check console logs for proper event tracking

---

## Resources

### Internal Links
- [Coding Standards](../programming/coding-standards.md)
- [Testing Guide](../programming/testing-overview.md)
- [Hooks Best Practices](../programming/frontend-standards.md#react-hooks)

### External References
- [React Hooks Documentation](https://react.dev/reference/react)
- [MouseEvent API](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)
- [KeyboardEvent API](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)
- [Google Analytics Best Practices](https://support.google.com/analytics/)

---

**Last Updated**: 2025-10-20
**Maintainer**: BOSSystems s.r.o.
**Documentation Version**: 1.0.0
