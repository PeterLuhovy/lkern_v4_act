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

export const usePageAnalytics = (pageName: string): UsePageAnalyticsReturn => {
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

  // ================================================================
  // SESSION MANAGEMENT
  // ================================================================

  const startSession = useCallback(() => {
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

    console.log('[PageAnalytics] Session started:', newSession.sessionId);
  }, [pageName]);

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

    console.log('[PageAnalytics] Session ended:', {
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
    const timeSinceLastClick = lastClickTimeRef.current
      ? now - lastClickTimeRef.current
      : undefined;

    const clickEvent: ClickEvent = {
      timestamp: now,
      element,
      elementType,
      coordinates: event ? { x: event.clientX, y: event.clientY } : undefined,
      timeSinceLastClick
    };

    sessionRef.current.clickEvents.push(clickEvent);
    lastClickTimeRef.current = now;
    lastActivityTimeRef.current = now;
    setClickCount(prev => prev + 1);

    console.log('[PageAnalytics] Click tracked:', {
      element,
      elementType,
      timeSinceLastClick: timeSinceLastClick ? `${(timeSinceLastClick / 1000).toFixed(1)}s` : 'first click'
    });
  }, []);

  const trackKeyboard = useCallback((
    event: React.KeyboardEvent | globalThis.KeyboardEvent
  ) => {
    if (!sessionRef.current) return;

    const now = Date.now();
    const timeSinceLastKey = lastKeyTimeRef.current
      ? now - lastKeyTimeRef.current
      : undefined;

    // Get target element info (if available)
    let targetElement = 'unknown';
    if ('target' in event && event.target) {
      const target = event.target as HTMLElement;
      targetElement = target.getAttribute('name') || target.id || target.tagName.toLowerCase();
    }

    const keyEvent: KeyboardEvent = {
      timestamp: now,
      key: event.key,
      code: event.code,
      modifiers: {
        ctrl: event.ctrlKey,
        shift: event.shiftKey,
        alt: event.altKey,
        meta: event.metaKey
      },
      eventType: event.type === 'keyup' ? 'keyup' : 'keydown',
      timeSinceLastKey,
      targetElement
    };

    sessionRef.current.keyboardEvents.push(keyEvent);
    lastKeyTimeRef.current = now;
    lastActivityTimeRef.current = now;
    setKeyboardCount(prev => prev + 1);

    // Format modifiers for logging
    const modifiers = [];
    if (keyEvent.modifiers.ctrl) modifiers.push('Ctrl');
    if (keyEvent.modifiers.shift) modifiers.push('Shift');
    if (keyEvent.modifiers.alt) modifiers.push('Alt');
    if (keyEvent.modifiers.meta) modifiers.push('Meta');
    const modifierStr = modifiers.length > 0 ? `${modifiers.join('+')}+` : '';

    console.log('[PageAnalytics] Keyboard tracked:', {
      key: `${modifierStr}${event.key}`,
      eventType: keyEvent.eventType,
      targetElement,
      timeSinceLastKey: timeSinceLastKey ? `${(timeSinceLastKey / 1000).toFixed(1)}s` : 'first key'
    });
  }, []);

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
    trackClick,
    trackKeyboard,
    metrics,
    session,
    getSessionReport
  };
};

export default usePageAnalytics;
