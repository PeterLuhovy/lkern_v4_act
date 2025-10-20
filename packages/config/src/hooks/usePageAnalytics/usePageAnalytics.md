# ================================================================
# usePageAnalytics
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\hooks\usePageAnalytics.md
# Version: 1.0.0
# Created: 2025-10-20
# Updated: 2025-10-20
# Hook Location: packages/config/src/hooks/usePageAnalytics/usePageAnalytics.ts
# Package: @l-kern/config
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   React hook for comprehensive user interaction analytics including
#   click tracking, keyboard events, timing metrics, session management,
#   and debounced event handling for pages and modals.
# ================================================================

---

## Overview

**Purpose**: Track user interactions (clicks, keyboard, timing) for analytics, UX optimization, and behavior analysis
**Package**: @l-kern/config
**Path**: packages/config/src/hooks/usePageAnalytics
**Since**: v1.0.0

`usePageAnalytics` provides a complete user interaction tracking solution for pages and modals. It captures click events (with coordinates and timing), keyboard events (with modifiers), session duration, and provides real-time metrics. Features intelligent debouncing (<1s = merged event, ≥1s = separate down/up), drag detection, and repeat key filtering.

---

## Features

- ✅ Session management (start, end, reset) with unique session IDs
- ✅ Click tracking with coordinates, timing, and element identification
- ✅ Keyboard tracking with modifiers (Ctrl, Shift, Alt, Meta) and target elements
- ✅ Intelligent debouncing (<1s = merged event, ≥1s = separate down/up events)
- ✅ Drag detection (mouse moved >5px = no click logged)
- ✅ Repeat key filtering (OS key repeat events ignored)
- ✅ Real-time metrics update (100ms interval)
- ✅ Time tracking (total session time, time since last activity)
- ✅ Average time between clicks calculation
- ✅ Session outcome tracking (confirmed, cancelled, dismissed, navigated)
- ✅ Context support (page vs modal analytics)
- ✅ Debug report generation (full session data export)
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

**Event Tracking - Intelligent Debouncing:**
- **Click Events**:
  - `mousedown` → store pending event
  - `mouseup` → check duration:
    - <1s → log single `click` event
    - ≥1s → log separate `mousedown` + `mouseup` events
  - Drag detection: If mouse moved >5px, no click logged
- **Keyboard Events**:
  - `keydown` → store pending event
  - `keyup` → check duration:
    - <1s → log single `keydown` event
    - ≥1s → log separate `keydown` + `keyup` events
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
- **Affects**: Components displaying real-time metrics
- **Workaround**: Wrap metrics display in `React.memo()`
- **Tracking**: Task #456
- **Status**: Planned for v1.1.0 (debounced metrics update)

### Fixed Issues

See [Changelog](#changelog) section below.

---

## Testing

### Test Coverage
- ✅ **Unit Tests**: 68 tests
- ✅ **Coverage**: 100% (statements, branches, functions, lines)
- ✅ **Hook Tests**: 25 tests (using @testing-library/react)
- ✅ **Edge Cases**: 10 tests (null, undefined, edge timing)

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
- ✅ Merges fast clicks (<1s) into single event
- ✅ Logs separate events for slow clicks (≥1s)

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
