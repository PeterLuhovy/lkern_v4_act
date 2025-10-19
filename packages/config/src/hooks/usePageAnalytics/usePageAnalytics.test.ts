/*
 * ================================================================
 * FILE: usePageAnalytics.test.ts
 * PATH: /packages/config/src/hooks/usePageAnalytics/usePageAnalytics.test.ts
 * DESCRIPTION: Tests for usePageAnalytics hook
 * VERSION: v1.0.0
 * UPDATED: 2025-10-19 15:00:00
 * ================================================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePageAnalytics } from './usePageAnalytics';

describe('usePageAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with no active session', () => {
      const { result } = renderHook(() => usePageAnalytics('test-page'));

      expect(result.current.session).toBeNull();
      expect(result.current.isSessionActive).toBe(false);
    });

    it('should store page name', () => {
      const { result } = renderHook(() => usePageAnalytics('test-page'));

      act(() => {
        result.current.startSession();
      });

      expect(result.current.session?.pageName).toBe('test-page');
    });
  });

  describe('session management', () => {
    it('should start session', () => {
      const { result } = renderHook(() => usePageAnalytics('test-page'));

      act(() => {
        result.current.startSession();
      });

      expect(result.current.isSessionActive).toBe(true);
      expect(result.current.session).not.toBeNull();
      expect(result.current.session?.startTime).toBeGreaterThan(0);
    });

    it('should end session with outcome', () => {
      const { result } = renderHook(() => usePageAnalytics('test-page'));

      act(() => {
        result.current.startSession();
      });

      act(() => {
        result.current.endSession('confirmed');
      });

      expect(result.current.isSessionActive).toBe(false);
      expect(result.current.session?.outcome).toBe('confirmed');
      expect(result.current.session?.endTime).toBeGreaterThan(0);
    });

    it('should calculate total duration', () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => usePageAnalytics('test-page'));

      act(() => {
        result.current.startSession();
      });

      // Wait a bit
      act(() => {
        vi.advanceTimersByTime(100);
      });

      act(() => {
        result.current.endSession('confirmed');
      });

      expect(result.current.session?.totalDuration).toBeGreaterThan(0);

      vi.useRealTimers();
    });

    it('should not start session twice', () => {
      const { result } = renderHook(() => usePageAnalytics('test-page'));

      act(() => {
        result.current.startSession();
      });

      const firstSessionId = result.current.session?.sessionId;

      act(() => {
        result.current.startSession();
      });

      // Session ID should remain the same
      expect(result.current.session?.sessionId).toBe(firstSessionId);
    });

    it('should reset session', () => {
      const { result } = renderHook(() => usePageAnalytics('test-page'));

      act(() => {
        result.current.startSession();
      });

      act(() => {
        result.current.endSession('confirmed');
      });

      act(() => {
        result.current.resetSession();
      });

      expect(result.current.session).toBeNull();
      expect(result.current.isSessionActive).toBe(false);
    });
  });

  describe('click tracking', () => {
    it('should track click events', () => {
      const { result } = renderHook(() => usePageAnalytics('test-page'));

      act(() => {
        result.current.startSession();
      });

      const mockEvent = {
        clientX: 100,
        clientY: 200,
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.trackClick('test-button', 'button', mockEvent);
      });

      expect(result.current.session?.clickEvents).toHaveLength(1);
      expect(result.current.session?.clickEvents[0].coordinates).toEqual({ x: 100, y: 200 });
      expect(result.current.session?.clickEvents[0].element).toBe('test-button');
      expect(result.current.session?.clickEvents[0].elementType).toBe('button');
    });

    it('should not track clicks without active session', () => {
      const { result } = renderHook(() => usePageAnalytics('test-page'));

      const mockEvent = {
        clientX: 100,
        clientY: 200,
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.trackClick('test-button', 'button', mockEvent);
      });

      expect(result.current.session).toBeNull();
    });

    it('should calculate time since last click', () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => usePageAnalytics('test-page'));

      act(() => {
        result.current.startSession();
      });

      act(() => {
        result.current.trackClick('button-1', 'button');
      });

      act(() => {
        vi.advanceTimersByTime(50);
      });

      act(() => {
        result.current.trackClick('button-2', 'button');
      });

      expect(result.current.session?.clickEvents).toHaveLength(2);
      expect(result.current.session?.clickEvents[1].timeSinceLastClick).toBeGreaterThan(0);

      vi.useRealTimers();
    });
  });

  describe('keyboard tracking', () => {
    it('should track keyboard events', () => {
      const { result } = renderHook(() => usePageAnalytics('test-page'));

      act(() => {
        result.current.startSession();
      });

      const mockEvent = {
        key: 'Enter',
        code: 'Enter',
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
        type: 'keydown',
      } as KeyboardEvent;

      act(() => {
        result.current.trackKeyboard(mockEvent);
      });

      expect(result.current.session?.keyboardEvents).toHaveLength(1);
      expect(result.current.session?.keyboardEvents[0].key).toBe('Enter');
    });

    it('should track modifier keys', () => {
      const { result } = renderHook(() => usePageAnalytics('test-page'));

      act(() => {
        result.current.startSession();
      });

      const mockEvent = {
        key: 'S',
        code: 'KeyS',
        ctrlKey: true,
        shiftKey: true,
        altKey: false,
        metaKey: false,
        type: 'keydown',
      } as KeyboardEvent;

      act(() => {
        result.current.trackKeyboard(mockEvent);
      });

      const keyboardEvent = result.current.session?.keyboardEvents[0];
      expect(keyboardEvent?.modifiers.ctrl).toBe(true);
      expect(keyboardEvent?.modifiers.shift).toBe(true);
      expect(keyboardEvent?.modifiers.alt).toBe(false);
    });

    it('should not track keyboard without active session', () => {
      const { result } = renderHook(() => usePageAnalytics('test-page'));

      const mockEvent = {
        key: 'Enter',
        code: 'Enter',
      } as KeyboardEvent;

      act(() => {
        result.current.trackKeyboard(mockEvent);
      });

      expect(result.current.session).toBeNull();
    });
  });

  describe('metrics', () => {
    it('should calculate average time between clicks', () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => usePageAnalytics('test-page'));

      act(() => {
        result.current.startSession();
      });

      // Click 3 times with delays
      act(() => {
        result.current.trackClick('button-1', 'button');
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      act(() => {
        result.current.trackClick('button-2', 'button');
      });

      act(() => {
        vi.advanceTimersByTime(200);
      });

      act(() => {
        result.current.trackClick('button-3', 'button');
      });

      expect(result.current.metrics.clickCount).toBe(3);
      expect(result.current.metrics.averageTimeBetweenClicks).toBeGreaterThan(0);

      vi.useRealTimers();
    });

    it('should handle metrics without session', () => {
      const { result } = renderHook(() => usePageAnalytics('test-page'));

      expect(result.current.metrics.clickCount).toBe(0);
      expect(result.current.metrics.keyboardCount).toBe(0);
      expect(result.current.metrics.totalTime).toBe('0.0s');
    });
  });
});
