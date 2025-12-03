/*
 * ================================================================
 * FILE: usePageAnalytics.ts
 * PATH: /packages/config/src/hooks/usePageAnalytics.ts
 * DESCRIPTION: Universal analytics - clicks, keyboard, drag tracking, timing (pages + modals)
 * VERSION: v3.0.0
 * UPDATED: 2025-11-30
 * CHANGES:
 *   - v3.0.0: MAJOR - Added AnalyticsContext integration for toggle features
 *             Each tracking feature can be enabled/disabled via context
 *             (trackMouse, trackKeyboard, trackDrag, logToConsole, trackTiming)
 *   - v2.1.0: FIXED - Text selection now shows selected text (check getSelection() after mouseup)
 *   - v2.0.0: MAJOR - Added native HTML5 drag events (dragstart/dragend) for text drag tracking
 *   - v1.3.0: Changed debouncing threshold 1000ms → 500ms (faster distinction)
 *   - v1.2.0: Added text selection detection + drag operation logging (distance, duration)
 *   - v1.1.0: Fixed timeout cleanup leak + memoized expensive calculations
 *   - v1.0.0: Initial implementation
 * ================================================================
 */

import { useRef, useState, useCallback, useEffect, useMemo, useContext } from 'react';
import { AnalyticsContext } from '../../contexts/AnalyticsContext/AnalyticsContext';

// ================================================================
// ANALYTICS SETTINGS TYPE (inline to avoid circular dependency)
// ================================================================

/**
 * Analytics tracking settings (passed from AnalyticsContext or props)
 */
export interface AnalyticsTrackingSettings {
  /** Track mouse clicks and drag operations */
  trackMouse: boolean;
  /** Track keyboard events (keydown/keyup) */
  trackKeyboard: boolean;
  /** Track text drag & drop operations */
  trackDrag: boolean;
  /** Log events to console (debug mode) */
  logToConsole: boolean;
  /** Track timing metrics (session duration, time between events) */
  trackTiming: boolean;
}

/**
 * Default analytics settings (all tracking enabled)
 */
const DEFAULT_ANALYTICS_SETTINGS: AnalyticsTrackingSettings = {
  trackMouse: true,
  trackKeyboard: true,
  trackDrag: true,
  logToConsole: true,
  trackTiming: true,
};

// ================================================================
// TYPES
// ================================================================

export interface ClickEvent {
  timestamp: number;
  element: string;
  elementType: string;
  coordinates?: { x: number; y: number };
  timeSinceLastClick?: number;
  eventType: 'mousedown' | 'mouseup' | 'click';
}

export interface KeyboardEvent {
  timestamp: number;
  key: string;
  code: string;
  modifiers: {
    ctrl: boolean;
    shift: boolean;
    alt: boolean;
    meta: boolean;
  };
  eventType: 'keydown' | 'keyup';
  timeSinceLastKey?: number;
  targetElement?: string;
}

export interface PageAnalyticsSession {
  sessionId: string;
  pageName: string;
  startTime: number;
  endTime?: number;
  outcome?: 'confirmed' | 'cancelled' | 'dismissed' | 'navigated';
  clickEvents: ClickEvent[];
  keyboardEvents: KeyboardEvent[];
  totalDuration?: number;
}

export interface PageAnalyticsMetrics {
  totalTime: string;
  timeSinceLastActivity: string;
  clickCount: number;
  keyboardCount: number;
  averageTimeBetweenClicks: number;
}

export interface UsePageAnalyticsReturn {
  // Session control
  startSession: () => void;
  endSession: (outcome: 'confirmed' | 'cancelled' | 'dismissed' | 'navigated') => void;
  resetSession: () => void;

  // Session state
  isSessionActive: boolean;

  // Event tracking
  trackClick: (element: string, elementType: string, event?: React.MouseEvent) => void;
  trackKeyboard: (event: React.KeyboardEvent | globalThis.KeyboardEvent) => void;
  trackDragStart: (selectedText: string, coordinates: { x: number; y: number }) => void;
  trackDragEnd: (endCoordinates: { x: number; y: number }) => void;

  // Metrics (real-time)
  metrics: PageAnalyticsMetrics;

  // Session data
  session: PageAnalyticsSession | null;

  // Debug
  getSessionReport: () => PageAnalyticsSession | null;
}

// ================================================================
// HOOK IMPLEMENTATION
// ================================================================

export const usePageAnalytics = (
  pageName: string,
  contextType: 'page' | 'modal' = 'page',
  settings: Partial<AnalyticsTrackingSettings> = {}
): UsePageAnalyticsReturn => {
  // Try to get settings from AnalyticsContext (if available)
  const analyticsContext = useContext(AnalyticsContext);

  // Priority: Context settings > Props settings > Defaults
  // Context provides reactive updates when user toggles settings in sidebar
  const analyticsSettings: AnalyticsTrackingSettings = analyticsContext
    ? { ...analyticsContext.settings, ...settings }  // Context + props override
    : { ...DEFAULT_ANALYTICS_SETTINGS, ...settings }; // Fallback to defaults + props

  // Log prefix: [Analytics][Page|Modal][pageName]
  const contextLabel = contextType.charAt(0).toUpperCase() + contextType.slice(1); // "Page" or "Modal"
  const logPrefix = `[Analytics][${contextLabel}][${pageName}]`;

  // Helper function for conditional logging
  const log = useCallback((message: string, data?: object) => {
    if (analyticsSettings.logToConsole) {
      console.log(`${logPrefix} ${message}`, data || '');
    }
  }, [logPrefix, analyticsSettings.logToConsole]);

  // Session state
  const [session, setSession] = useState<PageAnalyticsSession | null>(null);
  const sessionRef = useRef<PageAnalyticsSession | null>(null);

  // Timing state (updates every 100ms)
  const [totalTime, setTotalTime] = useState<string>('0.0s');
  const [timeSinceLastActivity, setTimeSinceLastActivity] = useState<string>('-');
  const [clickCount, setClickCount] = useState<number>(0);
  const [keyboardCount, setKeyboardCount] = useState<number>(0);

  // Last activity timestamp (unified for clicks AND keyboard)
  const lastActivityTimeRef = useRef<number>(0);

  // Separate timestamps for event-specific metrics
  const lastClickTimeRef = useRef<number>(0);
  const lastKeyTimeRef = useRef<number>(0);

  // Pending down events (for debouncing logic)
  const pendingMouseDownRef = useRef<{ timestamp: number; element: string; elementType: string; coordinates?: { x: number; y: number } } | null>(null);
  const pendingKeyDownRef = useRef<{ timestamp: number; key: string; code: string; modifiers: { ctrl: boolean; shift: boolean; alt: boolean; meta: boolean }; targetElement?: string } | null>(null);

  // Pending drag events (for text drag & drop tracking)
  const pendingDragRef = useRef<{ timestamp: number; selectedText: string; coordinates: { x: number; y: number } } | null>(null);

  // Cleanup timeout for endSession
  const endSessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ================================================================
  // SESSION MANAGEMENT
  // ================================================================

  const startSession = useCallback(() => {
    // Prevent starting session twice
    if (sessionRef.current && !sessionRef.current.endTime) {
      log('Session already active, ignoring start request');
      return;
    }

    const now = Date.now();
    const newSession: PageAnalyticsSession = {
      sessionId: `${pageName}-${now}`,
      pageName,
      startTime: now,
      clickEvents: [],
      keyboardEvents: []
    };

    sessionRef.current = newSession;
    setSession(newSession);
    setTotalTime('0.0s');
    setTimeSinceLastActivity('-');
    setClickCount(0);
    setKeyboardCount(0);
    lastActivityTimeRef.current = 0;
    lastClickTimeRef.current = 0;
    lastKeyTimeRef.current = 0;

    log('Session started:', { sessionId: newSession.sessionId });
  }, [pageName, log]);

  const endSession = useCallback((outcome: 'confirmed' | 'cancelled' | 'dismissed' | 'navigated') => {
    if (!sessionRef.current) return;

    // Clear any pending timeout
    if (endSessionTimeoutRef.current) {
      clearTimeout(endSessionTimeoutRef.current);
      endSessionTimeoutRef.current = null;
    }

    const now = Date.now();
    const duration = now - sessionRef.current.startTime;

    const finalSession: PageAnalyticsSession = {
      ...sessionRef.current,
      endTime: now,
      outcome,
      totalDuration: duration
    };

    sessionRef.current = finalSession;
    setSession(finalSession);

    log('Session ended:', {
      sessionId: finalSession.sessionId,
      outcome,
      duration: `${(duration / 1000).toFixed(1)}s`,
      clicks: finalSession.clickEvents.length,
      keyboard: finalSession.keyboardEvents.length
    });

    // Reset session after logging (with cleanup tracking)
    endSessionTimeoutRef.current = setTimeout(() => {
      sessionRef.current = null;
      setSession(null);
      endSessionTimeoutRef.current = null;
    }, 100);
  }, [log]);

  const resetSession = useCallback(() => {
    // Clear any pending timeout
    if (endSessionTimeoutRef.current) {
      clearTimeout(endSessionTimeoutRef.current);
      endSessionTimeoutRef.current = null;
    }

    sessionRef.current = null;
    setSession(null);
    setTotalTime('0.0s');
    setTimeSinceLastActivity('-');
    setClickCount(0);
    setKeyboardCount(0);
    lastActivityTimeRef.current = 0;
    lastClickTimeRef.current = 0;
    lastKeyTimeRef.current = 0;
  }, []);

  // ================================================================
  // EVENT TRACKING
  // ================================================================

  const trackClick = useCallback((
    element: string,
    elementType: string,
    event?: React.MouseEvent
  ) => {
    // Skip if mouse tracking is disabled
    if (!analyticsSettings.trackMouse) return;
    if (!sessionRef.current) return;

    const now = Date.now();
    const mouseEventType = event?.type === 'mousedown'
      ? 'mousedown'
      : event?.type === 'mouseup'
      ? 'mouseup'
      : 'click';

    // === DEBOUNCING LOGIC: < 500ms = merged "click", >= 500ms = separate down/up ===

    if (mouseEventType === 'mousedown') {
      // Store mousedown event (pending)
      pendingMouseDownRef.current = {
        timestamp: now,
        element,
        elementType,
        coordinates: event ? { x: event.clientX, y: event.clientY } : undefined
      };
      return; // Don't log yet, wait for mouseup
    }

    if (mouseEventType === 'mouseup' && pendingMouseDownRef.current) {
      const downEvent = pendingMouseDownRef.current;
      const duration = now - downEvent.timestamp;
      const timeSinceLastClick = lastClickTimeRef.current
        ? downEvent.timestamp - lastClickTimeRef.current
        : undefined;

      // Detect drag operation (mouse moved > 5px)
      let isDragOperation = false;
      if (downEvent.coordinates && event) {
        const deltaX = Math.abs(event.clientX - downEvent.coordinates.x);
        const deltaY = Math.abs(event.clientY - downEvent.coordinates.y);
        isDragOperation = deltaX > 5 || deltaY > 5;
      }

      // Detect if drag resulted in text selection (user was selecting text, not dragging element)
      const selectedText = window.getSelection()?.toString() || '';
      const isTextSelection = isDragOperation && selectedText.length > 0;

      if (isTextSelection && event && downEvent.coordinates) {
        // TEXT SELECTION → User was selecting text with mouse
        const deltaX = Math.abs(event.clientX - downEvent.coordinates.x);
        const deltaY = Math.abs(event.clientY - downEvent.coordinates.y);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY); // Pythagorean distance

        log('Text selection', {
          element: downEvent.element,
          elementType: downEvent.elementType,
          selectedText: selectedText.length > 50 ? selectedText.substring(0, 50) + '...' : selectedText,
          selectedLength: `${selectedText.length} chars`,
          duration: `${duration}ms`,
          distance: `${Math.round(distance)}px`,
          deltaX: `${deltaX}px`,
          deltaY: `${deltaY}px`
        });

        pendingMouseDownRef.current = null;
        return; // Don't count as click
      }

      if (isDragOperation && event && downEvent.coordinates) {
        // DRAG OPERATION (modal, element) → User was dragging an element (not selecting text)
        const deltaX = Math.abs(event.clientX - downEvent.coordinates.x);
        const deltaY = Math.abs(event.clientY - downEvent.coordinates.y);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY); // Pythagorean distance

        log('Drag operation', {
          element: downEvent.element,
          elementType: downEvent.elementType,
          duration: `${duration}ms`,
          distance: `${Math.round(distance)}px`,
          deltaX: `${deltaX}px`,
          deltaY: `${deltaY}px`,
          startCoords: downEvent.coordinates,
          endCoords: { x: event.clientX, y: event.clientY }
        });

        pendingMouseDownRef.current = null;
        return; // Don't count as click
      }

      if (duration < 500 && !isDragOperation) {
        // FAST CLICK (< 500ms) → Log as single "click" event
        const clickEvent: ClickEvent = {
          timestamp: downEvent.timestamp,
          element: downEvent.element,
          elementType: downEvent.elementType,
          coordinates: downEvent.coordinates,
          timeSinceLastClick,
          eventType: 'click'
        };

        sessionRef.current.clickEvents.push(clickEvent);
        lastClickTimeRef.current = downEvent.timestamp;
        lastActivityTimeRef.current = now;
        setClickCount(prev => prev + 1);

        log('Click', {
          element: downEvent.element,
          elementType: downEvent.elementType,
          duration: `${duration}ms`,
          coordinates: downEvent.coordinates,
          timeSinceLastClick: timeSinceLastClick ? `${(timeSinceLastClick / 1000).toFixed(1)}s` : 'first click'
        });
      } else {
        // SLOW CLICK (>= 500ms) → Log both mousedown and mouseup
        const downClickEvent: ClickEvent = {
          timestamp: downEvent.timestamp,
          element: downEvent.element,
          elementType: downEvent.elementType,
          coordinates: downEvent.coordinates,
          timeSinceLastClick,
          eventType: 'mousedown'
        };

        const upClickEvent: ClickEvent = {
          timestamp: now,
          element,
          elementType,
          coordinates: event ? { x: event.clientX, y: event.clientY } : undefined,
          timeSinceLastClick: now - downEvent.timestamp,
          eventType: 'mouseup'
        };

        sessionRef.current.clickEvents.push(downClickEvent, upClickEvent);
        lastClickTimeRef.current = now;
        lastActivityTimeRef.current = now;
        setClickCount(prev => prev + 2);

        log('Mouse down', {
          element: downEvent.element,
          elementType: downEvent.elementType,
          coordinates: downEvent.coordinates,
          timeSinceLastClick: timeSinceLastClick ? `${(timeSinceLastClick / 1000).toFixed(1)}s` : 'first click'
        });

        log('Mouse up', {
          element,
          elementType,
          coordinates: event ? { x: event.clientX, y: event.clientY } : undefined,
          duration: `${duration}ms`
        });
      }

      pendingMouseDownRef.current = null; // Clear pending
      return;
    }

    // Fallback: standalone click event (legacy support)
    const timeSinceLastClick = lastClickTimeRef.current
      ? now - lastClickTimeRef.current
      : undefined;

    const clickEvent: ClickEvent = {
      timestamp: now,
      element,
      elementType,
      coordinates: event ? { x: event.clientX, y: event.clientY } : undefined,
      timeSinceLastClick,
      eventType: 'click'
    };

    sessionRef.current.clickEvents.push(clickEvent);
    lastClickTimeRef.current = now;
    lastActivityTimeRef.current = now;
    setClickCount(prev => prev + 1);

    log('Click', {
      element,
      elementType,
      timeSinceLastClick: timeSinceLastClick ? `${(timeSinceLastClick / 1000).toFixed(1)}s` : 'first click'
    });
  }, [analyticsSettings.trackMouse, log]);

  const trackKeyboard = useCallback((
    event: React.KeyboardEvent | globalThis.KeyboardEvent
  ) => {
    // Skip if keyboard tracking is disabled
    if (!analyticsSettings.trackKeyboard) return;
    if (!sessionRef.current) return;

    // CRITICAL: Ignore OS key repeat events (holding key down)
    // Only track: first keydown + keyup (not millions of repeats)
    if (event.repeat) {
      return;
    }

    const now = Date.now();
    const keyEventType = event.type === 'keyup' ? 'keyup' : 'keydown';

    // Get target element info (if available)
    let targetElement = 'unknown';
    if ('target' in event && event.target) {
      const target = event.target as HTMLElement;
      targetElement = target.getAttribute('name') || target.id || target.tagName.toLowerCase();
    }

    const modifiers = {
      ctrl: event.ctrlKey,
      shift: event.shiftKey,
      alt: event.altKey,
      meta: event.metaKey
    };

    // === DEBOUNCING LOGIC: < 500ms = merged "keypress", >= 500ms = separate down/up ===

    if (keyEventType === 'keydown') {
      // Store keydown event (pending)
      pendingKeyDownRef.current = {
        timestamp: now,
        key: event.key,
        code: event.code,
        modifiers,
        targetElement
      };
      return; // Don't log yet, wait for keyup
    }

    if (keyEventType === 'keyup' && pendingKeyDownRef.current) {
      const downEvent = pendingKeyDownRef.current;

      // Only pair if same key
      if (downEvent.key !== event.key) {
        // Different key - log pending down event separately
        const timeSinceLastKey = lastKeyTimeRef.current
          ? downEvent.timestamp - lastKeyTimeRef.current
          : undefined;

        const downKeyEvent: KeyboardEvent = {
          timestamp: downEvent.timestamp,
          key: downEvent.key,
          code: downEvent.code,
          modifiers: downEvent.modifiers,
          eventType: 'keydown',
          timeSinceLastKey,
          targetElement: downEvent.targetElement
        };

        sessionRef.current.keyboardEvents.push(downKeyEvent);
        lastKeyTimeRef.current = downEvent.timestamp;
        lastActivityTimeRef.current = now;
        setKeyboardCount(prev => prev + 1);

        const modifierStrs = [];
        if (downEvent.modifiers.ctrl) modifierStrs.push('Ctrl');
        if (downEvent.modifiers.shift) modifierStrs.push('Shift');
        if (downEvent.modifiers.alt) modifierStrs.push('Alt');
        if (downEvent.modifiers.meta) modifierStrs.push('Meta');
        const modifierStr = modifierStrs.length > 0 ? `${modifierStrs.join('+')}+` : '';

        log('Key down', {
          key: `${modifierStr}${downEvent.key}`,
          targetElement: downEvent.targetElement,
          timeSinceLastKey: timeSinceLastKey ? `${(timeSinceLastKey / 1000).toFixed(1)}s` : 'first key'
        });

        pendingKeyDownRef.current = null;
        return;
      }

      const duration = now - downEvent.timestamp;
      const timeSinceLastKey = lastKeyTimeRef.current
        ? downEvent.timestamp - lastKeyTimeRef.current
        : undefined;

      // Format modifiers for logging
      const modifierStrs = [];
      if (modifiers.ctrl) modifierStrs.push('Ctrl');
      if (modifiers.shift) modifierStrs.push('Shift');
      if (modifiers.alt) modifierStrs.push('Alt');
      if (modifiers.meta) modifierStrs.push('Meta');
      const modifierStr = modifierStrs.length > 0 ? `${modifierStrs.join('+')}+` : '';

      if (duration < 500) {
        // FAST KEYPRESS (< 500ms) → Log as single "keydown" event
        const keyEvent: KeyboardEvent = {
          timestamp: downEvent.timestamp,
          key: downEvent.key,
          code: downEvent.code,
          modifiers: downEvent.modifiers,
          eventType: 'keydown',
          timeSinceLastKey,
          targetElement: downEvent.targetElement
        };

        sessionRef.current.keyboardEvents.push(keyEvent);
        lastKeyTimeRef.current = downEvent.timestamp;
        lastActivityTimeRef.current = now;
        setKeyboardCount(prev => prev + 1);

        log('Keypress', {
          key: `${modifierStr}${event.key}`,
          duration: `${duration}ms`,
          targetElement,
          timeSinceLastKey: timeSinceLastKey ? `${(timeSinceLastKey / 1000).toFixed(1)}s` : 'first key'
        });
      } else {
        // SLOW KEYPRESS (>= 500ms) → Log both keydown and keyup
        const downKeyEvent: KeyboardEvent = {
          timestamp: downEvent.timestamp,
          key: downEvent.key,
          code: downEvent.code,
          modifiers: downEvent.modifiers,
          eventType: 'keydown',
          timeSinceLastKey,
          targetElement: downEvent.targetElement
        };

        const upKeyEvent: KeyboardEvent = {
          timestamp: now,
          key: event.key,
          code: event.code,
          modifiers,
          eventType: 'keyup',
          timeSinceLastKey: now - downEvent.timestamp,
          targetElement
        };

        sessionRef.current.keyboardEvents.push(downKeyEvent, upKeyEvent);
        lastKeyTimeRef.current = now;
        lastActivityTimeRef.current = now;
        setKeyboardCount(prev => prev + 2);

        log('Key down', {
          key: `${modifierStr}${event.key}`,
          targetElement,
          timeSinceLastKey: timeSinceLastKey ? `${(timeSinceLastKey / 1000).toFixed(1)}s` : 'first key'
        });

        log('Key up', {
          key: `${modifierStr}${event.key}`,
          duration: `${duration}ms`,
          targetElement
        });
      }

      pendingKeyDownRef.current = null; // Clear pending
      return;
    }

    // Fallback: standalone keydown event (no matching keyup)
    const timeSinceLastKey = lastKeyTimeRef.current
      ? now - lastKeyTimeRef.current
      : undefined;

    const keyEvent: KeyboardEvent = {
      timestamp: now,
      key: event.key,
      code: event.code,
      modifiers,
      eventType: keyEventType,
      timeSinceLastKey,
      targetElement
    };

    sessionRef.current.keyboardEvents.push(keyEvent);
    lastKeyTimeRef.current = now;
    lastActivityTimeRef.current = now;
    setKeyboardCount(prev => prev + 1);

    const modifierStrs = [];
    if (modifiers.ctrl) modifierStrs.push('Ctrl');
    if (modifiers.shift) modifierStrs.push('Shift');
    if (modifiers.alt) modifierStrs.push('Alt');
    if (modifiers.meta) modifierStrs.push('Meta');
    const modifierStr = modifierStrs.length > 0 ? `${modifierStrs.join('+')}+` : '';

    log(`${keyEventType}`, {
      key: `${modifierStr}${event.key}`,
      targetElement,
      timeSinceLastKey: timeSinceLastKey ? `${(timeSinceLastKey / 1000).toFixed(1)}s` : 'first key'
    });
  }, [analyticsSettings.trackKeyboard, log]);

  // ================================================================
  // DRAG TRACKING (for native HTML5 text drag & drop)
  // ================================================================

  const trackDragStart = useCallback((
    selectedText: string,
    coordinates: { x: number; y: number }
  ) => {
    // Skip if drag tracking is disabled
    if (!analyticsSettings.trackDrag) return;
    if (!sessionRef.current) return;

    const now = Date.now();

    pendingDragRef.current = {
      timestamp: now,
      selectedText,
      coordinates
    };

    log('Drag started', {
      selectedText: selectedText.length > 50 ? selectedText.substring(0, 50) + '...' : selectedText,
      selectedLength: `${selectedText.length} chars`,
      startCoords: coordinates
    });
  }, [analyticsSettings.trackDrag, log]);

  const trackDragEnd = useCallback((
    endCoordinates: { x: number; y: number }
  ) => {
    // Skip if drag tracking is disabled
    if (!analyticsSettings.trackDrag) return;
    if (!sessionRef.current || !pendingDragRef.current) return;

    const dragStart = pendingDragRef.current;
    const now = Date.now();
    const duration = now - dragStart.timestamp;

    const deltaX = Math.abs(endCoordinates.x - dragStart.coordinates.x);
    const deltaY = Math.abs(endCoordinates.y - dragStart.coordinates.y);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    log('Text drag (drop)', {
      selectedText: dragStart.selectedText.length > 50 ? dragStart.selectedText.substring(0, 50) + '...' : dragStart.selectedText,
      selectedLength: `${dragStart.selectedText.length} chars`,
      duration: `${duration}ms`,
      distance: `${Math.round(distance)}px`,
      deltaX: `${deltaX}px`,
      deltaY: `${deltaY}px`,
      startCoords: dragStart.coordinates,
      endCoords: endCoordinates
    });

    // Update activity timestamp
    lastActivityTimeRef.current = now;

    // Clear pending drag
    pendingDragRef.current = null;
  }, [analyticsSettings.trackDrag, log]);

  // ================================================================
  // REAL-TIME METRICS UPDATE (100ms interval)
  // ================================================================

  useEffect(() => {
    if (!session) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const currentSession = sessionRef.current;

      if (!currentSession) {
        clearInterval(timer);
        return;
      }

      // Total time since session start
      const elapsed = now - currentSession.startTime;
      const seconds = Math.floor(elapsed / 1000);
      const ms = Math.floor((elapsed % 1000) / 100);
      setTotalTime(`${seconds}.${ms}s`);

      // Time since last activity (click OR keyboard)
      if (lastActivityTimeRef.current > 0) {
        const sinceLastActivity = now - lastActivityTimeRef.current;
        const activitySeconds = Math.floor(sinceLastActivity / 1000);
        const activityMs = Math.floor((sinceLastActivity % 1000) / 100);
        setTimeSinceLastActivity(`${activitySeconds}.${activityMs}s`);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [session?.sessionId]);

  // ================================================================
  // COMPUTED METRICS
  // ================================================================

  // Memoize expensive calculation (important for sessions with 100+ clicks)
  const averageTimeBetweenClicks = useMemo(() => {
    if (!session || session.clickEvents.length <= 1) return 0;

    return session.clickEvents
      .slice(1)
      .reduce((sum, event) => sum + (event.timeSinceLastClick || 0), 0)
      / (session.clickEvents.length - 1);
  }, [session?.clickEvents, clickCount]);

  const metrics: PageAnalyticsMetrics = {
    totalTime,
    timeSinceLastActivity,
    clickCount,
    keyboardCount,
    averageTimeBetweenClicks
  };

  // ================================================================
  // DEBUG REPORT
  // ================================================================

  const getSessionReport = useCallback(() => {
    return sessionRef.current;
  }, []);

  // ================================================================
  // CLEANUP ON UNMOUNT
  // ================================================================

  useEffect(() => {
    return () => {
      // Clear timeout on unmount to prevent memory leak
      if (endSessionTimeoutRef.current) {
        clearTimeout(endSessionTimeoutRef.current);
        endSessionTimeoutRef.current = null;
      }
    };
  }, []);

  // ================================================================
  // RETURN
  // ================================================================

  return {
    startSession,
    endSession,
    resetSession,
    isSessionActive: session !== null && !session.endTime,
    trackClick,
    trackKeyboard,
    trackDragStart,
    trackDragEnd,
    metrics,
    session,
    getSessionReport
  };
};

export default usePageAnalytics;
