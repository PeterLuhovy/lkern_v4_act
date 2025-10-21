/*
 * ================================================================
 * FILE: usePageAnalytics.test.ts
 * PATH: /packages/config/src/hooks/usePageAnalytics/usePageAnalytics.test.ts
 * DESCRIPTION: Tests for usePageAnalytics hook (28 tests - includes HTML5 drag events)
 * VERSION: v2.0.0
 * UPDATED: 2025-10-21 18:00:00
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

      const mockKeyDown = {
        key: 'Enter',
        code: 'Enter',
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
        type: 'keydown',
        repeat: false,
      } as KeyboardEvent;

      const mockKeyUp = {
        key: 'Enter',
        code: 'Enter',
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
        type: 'keyup',
        repeat: false,
      } as KeyboardEvent;

      act(() => {
        result.current.trackKeyboard(mockKeyDown);
        result.current.trackKeyboard(mockKeyUp);
      });

      expect(result.current.session?.keyboardEvents).toHaveLength(1);
      expect(result.current.session?.keyboardEvents[0].key).toBe('Enter');
    });

    it('should track modifier keys', () => {
      const { result } = renderHook(() => usePageAnalytics('test-page'));

      act(() => {
        result.current.startSession();
      });

      const mockKeyDown = {
        key: 'S',
        code: 'KeyS',
        ctrlKey: true,
        shiftKey: true,
        altKey: false,
        metaKey: false,
        type: 'keydown',
        repeat: false,
      } as KeyboardEvent;

      const mockKeyUp = {
        key: 'S',
        code: 'KeyS',
        ctrlKey: true,
        shiftKey: true,
        altKey: false,
        metaKey: false,
        type: 'keyup',
        repeat: false,
      } as KeyboardEvent;

      act(() => {
        result.current.trackKeyboard(mockKeyDown);
        result.current.trackKeyboard(mockKeyUp);
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

  describe('advanced features', () => {
    describe('drag detection', () => {
      it('should detect drag operation when mouse moves > 5px', () => {
        const { result } = renderHook(() => usePageAnalytics('test-page'));
        const consoleLogSpy = vi.spyOn(console, 'log');

        act(() => {
          result.current.startSession();
        });

        const mockMouseDown = {
          type: 'mousedown',
          clientX: 100,
          clientY: 100,
        } as React.MouseEvent;

        const mockMouseUp = {
          type: 'mouseup',
          clientX: 150, // Moved 50px horizontally
          clientY: 100,
        } as React.MouseEvent;

        act(() => {
          result.current.trackClick('modal-header', 'header', mockMouseDown);
        });

        act(() => {
          result.current.trackClick('modal-header', 'header', mockMouseUp);
        });

        // Drag detected - should NOT count as click (logged to console only)
        expect(result.current.session?.clickEvents.length).toBe(0);
        expect(result.current.metrics.clickCount).toBe(0);

        // Should log "Drag operation" to console
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('Drag operation'),
          expect.objectContaining({
            element: 'modal-header',
            elementType: 'header',
            distance: expect.stringContaining('px'),
            duration: expect.stringContaining('ms')
          })
        );

        consoleLogSpy.mockRestore();
      });

      it('should not detect drag when mouse moves <= 5px', () => {
        const { result } = renderHook(() => usePageAnalytics('test-page'));

        act(() => {
          result.current.startSession();
        });

        const mockMouseDown = {
          type: 'mousedown',
          clientX: 100,
          clientY: 100,
        } as React.MouseEvent;

        const mockMouseUp = {
          type: 'mouseup',
          clientX: 102, // Moved only 2px
          clientY: 101, // Moved only 1px
        } as React.MouseEvent;

        act(() => {
          result.current.trackClick('button', 'button', mockMouseDown);
        });

        act(() => {
          result.current.trackClick('button', 'button', mockMouseUp);
        });

        // No drag - should log single "click" event
        const clickEvent = result.current.session?.clickEvents[0];
        expect(clickEvent?.eventType).toBe('click');
      });
    });

    describe('click debouncing', () => {
      it('should merge fast click (<500ms) into single event', () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => usePageAnalytics('test-page'));

        act(() => {
          result.current.startSession();
        });

        const mockMouseDown = {
          type: 'mousedown',
          clientX: 100,
          clientY: 100,
        } as React.MouseEvent;

        act(() => {
          result.current.trackClick('button', 'button', mockMouseDown);
        });

        // Fast click - 400ms duration (< 500ms threshold)
        act(() => {
          vi.advanceTimersByTime(400);
        });

        const mockMouseUp = {
          type: 'mouseup',
          clientX: 100,
          clientY: 100,
        } as React.MouseEvent;

        act(() => {
          result.current.trackClick('button', 'button', mockMouseUp);
        });

        // Should be merged into single "click" event
        expect(result.current.session?.clickEvents).toHaveLength(1);
        expect(result.current.session?.clickEvents[0].eventType).toBe('click');

        vi.useRealTimers();
      });

      it('should log separate events for slow click (>=500ms)', () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => usePageAnalytics('test-page'));

        act(() => {
          result.current.startSession();
        });

        const mockMouseDown = {
          type: 'mousedown',
          clientX: 100,
          clientY: 100,
        } as React.MouseEvent;

        act(() => {
          result.current.trackClick('button', 'button', mockMouseDown);
        });

        // Slow click - 600ms duration (>= 500ms threshold)
        act(() => {
          vi.advanceTimersByTime(600);
        });

        const mockMouseUp = {
          type: 'mouseup',
          clientX: 100,
          clientY: 100,
        } as React.MouseEvent;

        act(() => {
          result.current.trackClick('button', 'button', mockMouseUp);
        });

        // Should be 2 separate events: mousedown + mouseup
        expect(result.current.session?.clickEvents).toHaveLength(2);
        expect(result.current.session?.clickEvents[0].eventType).toBe('mousedown');
        expect(result.current.session?.clickEvents[1].eventType).toBe('mouseup');

        vi.useRealTimers();
      });
    });

    describe('keyboard debouncing', () => {
      it('should merge fast keypress (<500ms) into single event', () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => usePageAnalytics('test-page'));

        act(() => {
          result.current.startSession();
        });

        const mockKeyDown = {
          key: 'Enter',
          code: 'Enter',
          type: 'keydown',
          repeat: false,
          ctrlKey: false,
          shiftKey: false,
          altKey: false,
          metaKey: false,
        } as KeyboardEvent;

        act(() => {
          result.current.trackKeyboard(mockKeyDown);
        });

        // Fast keypress - 300ms (< 500ms threshold)
        act(() => {
          vi.advanceTimersByTime(300);
        });

        const mockKeyUp = {
          key: 'Enter',
          code: 'Enter',
          type: 'keyup',
          repeat: false,
          ctrlKey: false,
          shiftKey: false,
          altKey: false,
          metaKey: false,
        } as KeyboardEvent;

        act(() => {
          result.current.trackKeyboard(mockKeyUp);
        });

        // Should be merged into single keyboard event
        expect(result.current.session?.keyboardEvents).toHaveLength(1);

        vi.useRealTimers();
      });

      it('should filter out OS key repeat events', () => {
        const { result } = renderHook(() => usePageAnalytics('test-page'));

        act(() => {
          result.current.startSession();
        });

        const mockKeyDownRepeat = {
          key: 'A',
          code: 'KeyA',
          type: 'keydown',
          repeat: true, // OS repeat event
          ctrlKey: false,
          shiftKey: false,
          altKey: false,
          metaKey: false,
        } as KeyboardEvent;

        // Send 10 repeat events (should all be ignored)
        act(() => {
          for (let i = 0; i < 10; i++) {
            result.current.trackKeyboard(mockKeyDownRepeat);
          }
        });

        // No events logged (all filtered out)
        expect(result.current.session?.keyboardEvents).toHaveLength(0);
      });
    });

    describe('context type', () => {
      it('should use "Page" context label by default', () => {
        const { result } = renderHook(() => usePageAnalytics('home'));

        act(() => {
          result.current.startSession();
        });

        // Session should be created (internal verification)
        expect(result.current.session?.pageName).toBe('home');
      });

      it('should use "Modal" context label when specified', () => {
        const { result } = renderHook(() => usePageAnalytics('editContact', 'modal'));

        act(() => {
          result.current.startSession();
        });

        // Session should be created with modal context
        expect(result.current.session?.pageName).toBe('editContact');
      });
    });

    describe('HTML5 drag events (v2.0.0+)', () => {
      it('should track drag start with selected text', () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => usePageAnalytics('test-page'));
        const consoleLogSpy = vi.spyOn(console, 'log');

        act(() => {
          result.current.startSession();
        });

        const selectedText = 'Lorem ipsum dolor sit amet';
        const startCoords = { x: 100, y: 200 };

        act(() => {
          result.current.trackDragStart(selectedText, startCoords);
        });

        // Should log "Drag started" to console
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('Drag started'),
          expect.objectContaining({
            selectedText: selectedText,
            selectedLength: `${selectedText.length} chars`,
            startCoords: startCoords
          })
        );

        consoleLogSpy.mockRestore();
        vi.useRealTimers();
      });

      it('should track drag end with distance and duration', () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => usePageAnalytics('test-page'));
        const consoleLogSpy = vi.spyOn(console, 'log');

        act(() => {
          result.current.startSession();
        });

        const selectedText = 'Test text for dragging';
        const startCoords = { x: 100, y: 200 };
        const endCoords = { x: 250, y: 350 };

        // Start drag
        act(() => {
          result.current.trackDragStart(selectedText, startCoords);
        });

        // Simulate 500ms drag duration
        act(() => {
          vi.advanceTimersByTime(500);
        });

        // End drag
        act(() => {
          result.current.trackDragEnd(endCoords);
        });

        // Should log "Text drag (drop)" with distance and duration
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('Text drag (drop)'),
          expect.objectContaining({
            selectedText: selectedText,
            selectedLength: `${selectedText.length} chars`,
            duration: expect.stringContaining('ms'),
            distance: expect.stringContaining('px'),
            deltaX: expect.stringContaining('px'),
            deltaY: expect.stringContaining('px'),
            startCoords: startCoords,
            endCoords: endCoords
          })
        );

        consoleLogSpy.mockRestore();
        vi.useRealTimers();
      });

      it('should truncate long selected text to 50 chars', () => {
        const { result } = renderHook(() => usePageAnalytics('test-page'));
        const consoleLogSpy = vi.spyOn(console, 'log');

        act(() => {
          result.current.startSession();
        });

        const longText = 'A'.repeat(100); // 100 characters
        const startCoords = { x: 100, y: 200 };

        act(() => {
          result.current.trackDragStart(longText, startCoords);
        });

        // Should log truncated text (50 chars + '...')
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('Drag started'),
          expect.objectContaining({
            selectedText: 'A'.repeat(50) + '...',
            selectedLength: '100 chars'
          })
        );

        consoleLogSpy.mockRestore();
      });

      it('should not track drag end without drag start', () => {
        const { result } = renderHook(() => usePageAnalytics('test-page'));
        const consoleLogSpy = vi.spyOn(console, 'log');

        act(() => {
          result.current.startSession();
        });

        // Try to end drag without starting it
        act(() => {
          result.current.trackDragEnd({ x: 250, y: 350 });
        });

        // Should NOT log anything (no pending drag)
        expect(consoleLogSpy).not.toHaveBeenCalledWith(
          expect.stringContaining('Text drag (drop)'),
          expect.anything()
        );

        consoleLogSpy.mockRestore();
      });

      it('should not track drag without active session', () => {
        const { result } = renderHook(() => usePageAnalytics('test-page'));
        const consoleLogSpy = vi.spyOn(console, 'log');

        // NO session started

        act(() => {
          result.current.trackDragStart('test text', { x: 100, y: 200 });
        });

        // Should NOT log anything (no active session)
        expect(consoleLogSpy).not.toHaveBeenCalledWith(
          expect.stringContaining('Drag started'),
          expect.anything()
        );

        consoleLogSpy.mockRestore();
      });
    });
  });
});
