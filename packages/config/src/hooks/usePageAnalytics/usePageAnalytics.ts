/*
 * ================================================================
 * FILE: usePageAnalytics.ts
 * PATH: /packages/config/src/hooks/usePageAnalytics.ts
 * DESCRIPTION: Universal analytics - clicks, keyboard, drag tracking, timing (pages + modals)
 * VERSION: v2.1.0
 * UPDATED: 2025-10-21 18:00:00
 * CHANGES:
 *   - v2.1.0: FIXED - Text selection now shows selected text (check getSelection() after mouseup)
 *   - v2.0.0: MAJOR - Added native HTML5 drag events (dragstart/dragend) for text drag tracking
 *   - v1.3.0: Changed debouncing threshold 1000ms → 500ms (faster distinction)
 *   - v1.2.0: Added text selection detection + drag operation logging (distance, duration)
 *   - v1.1.0: Fixed timeout cleanup leak + memoized expensive calculations
 *   - v1.0.0: Initial implementation
 * ================================================================
 */

import { useRef, useState, useCallback, useEffect, useMemo } from 'react';

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
  contextType: 'page' | 'modal' = 'page'
): UsePageAnalyticsReturn => {
  // Log prefix: [Analytics][Page|Modal][pageName]
  const contextLabel = contextType.charAt(0).toUpperCase() + contextType.slice(1); // "Page" or "Modal"
  const logPrefix = `[Analytics][${contextLabel}][${pageName}]`;

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
      console.log(`${logPrefix} Session already active, ignoring start request`);
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

    console.log(`${logPrefix} Session started:`, newSession.sessionId);
  }, [pageName, logPrefix]);

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

    console.log(`${logPrefix} Session ended:`, {
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
  }, [logPrefix]);

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

        console.log(`${logPrefix} Text selection:`, {
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

        console.log(`${logPrefix} Drag operation:`, {
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

        console.log(`${logPrefix} Click:`, {
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

        console.log(`${logPrefix} Mouse down:`, {
          element: downEvent.element,
          elementType: downEvent.elementType,
          coordinates: downEvent.coordinates,
          timeSinceLastClick: timeSinceLastClick ? `${(timeSinceLastClick / 1000).toFixed(1)}s` : 'first click'
        });

        console.log(`${logPrefix} Mouse up:`, {
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

    console.log(`${logPrefix} Click:`, {
      element,
      elementType,
      timeSinceLastClick: timeSinceLastClick ? `${(timeSinceLastClick / 1000).toFixed(1)}s` : 'first click'
    });
  }, [logPrefix]);

  const trackKeyboard = useCallback((
    event: React.KeyboardEvent | globalThis.KeyboardEvent
  ) => {
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

        console.log(`${logPrefix} Key down:`, {
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

        console.log(`${logPrefix} Keypress:`, {
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

        console.log(`${logPrefix} Key down:`, {
          key: `${modifierStr}${event.key}`,
          targetElement,
          timeSinceLastKey: timeSinceLastKey ? `${(timeSinceLastKey / 1000).toFixed(1)}s` : 'first key'
        });

        console.log(`${logPrefix} Key up:`, {
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

    console.log(`${logPrefix} ${keyEventType}:`, {
      key: `${modifierStr}${event.key}`,
      targetElement,
      timeSinceLastKey: timeSinceLastKey ? `${(timeSinceLastKey / 1000).toFixed(1)}s` : 'first key'
    });
  }, [logPrefix]);

  // ================================================================
  // DRAG TRACKING (for native HTML5 text drag & drop)
  // ================================================================

  const trackDragStart = useCallback((
    selectedText: string,
    coordinates: { x: number; y: number }
  ) => {
    if (!sessionRef.current) return;

    const now = Date.now();

    pendingDragRef.current = {
      timestamp: now,
      selectedText,
      coordinates
    };

    console.log(`${logPrefix} Drag started:`, {
      selectedText: selectedText.length > 50 ? selectedText.substring(0, 50) + '...' : selectedText,
      selectedLength: `${selectedText.length} chars`,
      startCoords: coordinates
    });
  }, [logPrefix]);

  const trackDragEnd = useCallback((
    endCoordinates: { x: number; y: number }
  ) => {
    if (!sessionRef.current || !pendingDragRef.current) return;

    const dragStart = pendingDragRef.current;
    const now = Date.now();
    const duration = now - dragStart.timestamp;

    const deltaX = Math.abs(endCoordinates.x - dragStart.coordinates.x);
    const deltaY = Math.abs(endCoordinates.y - dragStart.coordinates.y);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    console.log(`${logPrefix} Text drag (drop):`, {
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
  }, [logPrefix]);

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
