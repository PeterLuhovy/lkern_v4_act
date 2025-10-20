/*
 * ================================================================
 * FILE: usePageAnalytics.ts
 * PATH: /packages/config/src/hooks/usePageAnalytics.ts
 * DESCRIPTION: Universal analytics hook - tracks clicks, keyboard events, timing, and user workflow (pages + modals)
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 23:30:00
 * ================================================================
 */

import { useRef, useState, useCallback, useEffect } from 'react';

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
  const pendingKeyDownRef = useRef<{ timestamp: number; key: string; code: string; modifiers: any; targetElement?: string } | null>(null);

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

    // Reset session after logging
    setTimeout(() => {
      sessionRef.current = null;
      setSession(null);
    }, 100);
  }, []);

  const resetSession = useCallback(() => {
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

    // === DEBOUNCING LOGIC: < 1s = merged "click", >= 1s = separate down/up ===

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

      if (duration < 1000 && !isDragOperation) {
        // FAST CLICK (< 1s) → Log as single "click" event
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
        // SLOW CLICK (>= 1s) → Log both mousedown and mouseup
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

    // === DEBOUNCING LOGIC: < 1s = merged "keypress", >= 1s = separate down/up ===

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

      if (duration < 1000) {
        // FAST KEYPRESS (< 1s) → Log as single "keydown" event
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
        // SLOW KEYPRESS (>= 1s) → Log both keydown and keyup
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

  const averageTimeBetweenClicks = session && session.clickEvents.length > 1
    ? session.clickEvents
        .slice(1)
        .reduce((sum, event) => sum + (event.timeSinceLastClick || 0), 0)
      / (session.clickEvents.length - 1)
    : 0;

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
  // RETURN
  // ================================================================

  return {
    startSession,
    endSession,
    resetSession,
    isSessionActive: session !== null && !session.endTime,
    trackClick,
    trackKeyboard,
    metrics,
    session,
    getSessionReport
  };
};

export default usePageAnalytics;
