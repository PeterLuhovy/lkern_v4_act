/*
 * ================================================================
 * FILE: toastManager.test.ts
 * PATH: /packages/config/src/utils/toastManager/toastManager.test.ts
 * DESCRIPTION: Tests for toast notification manager
 * VERSION: v1.0.0
 * CREATED: 2025-10-19
 * ================================================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { toastManager, Toast, ToastType } from './toastManager';

describe('toastManager', () => {
  // Clear listeners before each test to avoid cross-test pollution
  beforeEach(() => {
    toastManager.clearAll();
  });

  // === BASIC FUNCTIONALITY ===

  describe('show()', () => {
    it('should create toast with auto-generated ID', () => {
      const id = toastManager.show('Test message');
      expect(id).toMatch(/^toast-\d+$/);
    });

    it('should increment toast counter for each toast', () => {
      const id1 = toastManager.show('Toast 1');
      const id2 = toastManager.show('Toast 2');
      const id3 = toastManager.show('Toast 3');

      expect(id1).toBe('toast-1');
      expect(id2).toBe('toast-2');
      expect(id3).toBe('toast-3');
    });

    it('should return unique IDs for multiple toasts', () => {
      const id1 = toastManager.show('Toast 1');
      const id2 = toastManager.show('Toast 2');
      const id3 = toastManager.show('Toast 3');

      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
    });

    it('should apply default options', () => {
      const listener = vi.fn();
      toastManager.on('show', listener);

      toastManager.show('Test message');

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Test message',
          type: 'success',
          duration: 3000,
          position: 'bottom-center',
        })
      );
    });

    it('should allow custom type override', () => {
      const listener = vi.fn();
      toastManager.on('show', listener);

      toastManager.show('Error!', { type: 'error' });

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        })
      );
    });

    it('should allow custom duration override', () => {
      const listener = vi.fn();
      toastManager.on('show', listener);

      toastManager.show('Wait...', { duration: 5000 });

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: 5000,
        })
      );
    });

    it('should allow custom position override', () => {
      const listener = vi.fn();
      toastManager.on('show', listener);

      toastManager.show('Top right', { position: 'top-right' });

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          position: 'top-right',
        })
      );
    });

    it('should include copiedContent when provided', () => {
      const listener = vi.fn();
      toastManager.on('show', listener);

      toastManager.show('Copied', { copiedContent: 'user@example.com' });

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          copiedContent: 'user@example.com',
        })
      );
    });

    it('should include timestamp', () => {
      const listener = vi.fn();
      toastManager.on('show', listener);

      const beforeTimestamp = Date.now();
      toastManager.show('Test');
      const afterTimestamp = Date.now();

      const call = listener.mock.calls[0][0] as Toast;
      expect(call.timestamp).toBeGreaterThanOrEqual(beforeTimestamp);
      expect(call.timestamp).toBeLessThanOrEqual(afterTimestamp);
    });

    it('should handle all toast types', () => {
      const types: ToastType[] = ['success', 'error', 'warning', 'info'];
      const listener = vi.fn();
      toastManager.on('show', listener);

      types.forEach((type) => {
        toastManager.show(`${type} message`, { type });
      });

      expect(listener).toHaveBeenCalledTimes(4);
      types.forEach((type, index) => {
        expect(listener.mock.calls[index][0]).toMatchObject({ type });
      });
    });
  });

  describe('hide()', () => {
    it('should emit hide event with correct ID', () => {
      const listener = vi.fn();
      toastManager.on('hide', listener);

      toastManager.hide('toast-123');

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'toast-123',
        })
      );
    });

    it('should work with non-existent ID (no error)', () => {
      const listener = vi.fn();
      toastManager.on('hide', listener);

      expect(() => {
        toastManager.hide('non-existent-id');
      }).not.toThrow();

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('clearAll()', () => {
    it('should emit clear event', () => {
      const listener = vi.fn();
      toastManager.on('clear', listener);

      toastManager.clearAll();

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should work when no toasts active', () => {
      const listener = vi.fn();
      toastManager.on('clear', listener);

      expect(() => {
        toastManager.clearAll();
      }).not.toThrow();

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  // === EVENT EMITTER ===

  describe('on() and off()', () => {
    it('should register show event listener', () => {
      const listener = vi.fn();
      toastManager.on('show', listener);

      toastManager.show('Test');

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should register hide event listener', () => {
      const listener = vi.fn();
      toastManager.on('hide', listener);

      toastManager.hide('toast-1');

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should register clear event listener', () => {
      const listener = vi.fn();
      toastManager.on('clear', listener);

      toastManager.clearAll();

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should call multiple listeners for same event', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      const listener3 = vi.fn();

      toastManager.on('show', listener1);
      toastManager.on('show', listener2);
      toastManager.on('show', listener3);

      toastManager.show('Test');

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
      expect(listener3).toHaveBeenCalledTimes(1);
    });

    it('should unregister listener with off()', () => {
      const listener = vi.fn();
      toastManager.on('show', listener);
      toastManager.off('show', listener);

      toastManager.show('Test');

      expect(listener).not.toHaveBeenCalled();
    });

    it('should only unregister specific listener', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      toastManager.on('show', listener1);
      toastManager.on('show', listener2);
      toastManager.off('show', listener1);

      toastManager.show('Test');

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalledTimes(1);
    });

    it('should handle off() with non-registered listener', () => {
      const listener = vi.fn();

      expect(() => {
        toastManager.off('show', listener);
      }).not.toThrow();
    });

    it('should pass correct toast data to listeners', () => {
      const listener = vi.fn();
      toastManager.on('show', listener);

      toastManager.show('Test message', {
        type: 'error',
        duration: 5000,
        copiedContent: 'user@example.com',
        position: 'top-right',
      });

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Test message',
          type: 'error',
          duration: 5000,
          copiedContent: 'user@example.com',
          position: 'top-right',
        })
      );
    });
  });

  // === EDGE CASES ===

  describe('Edge cases', () => {
    it('should handle empty message', () => {
      const listener = vi.fn();
      toastManager.on('show', listener);

      toastManager.show('');

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          message: '',
        })
      );
    });

    it('should handle very long message', () => {
      const listener = vi.fn();
      toastManager.on('show', listener);

      const longMessage = 'A'.repeat(1000);
      toastManager.show(longMessage);

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          message: longMessage,
        })
      );
    });

    it('should handle special characters in message', () => {
      const listener = vi.fn();
      toastManager.on('show', listener);

      const specialMessage = '✓ ✕ ℹ ⚠ <script>alert("test")</script>';
      toastManager.show(specialMessage);

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          message: specialMessage,
        })
      );
    });

    it('should handle duration of 0 (no auto-dismiss)', () => {
      const listener = vi.fn();
      toastManager.on('show', listener);

      toastManager.show('Manual dismiss', { duration: 0 });

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: 0,
        })
      );
    });

    it('should handle very long duration', () => {
      const listener = vi.fn();
      toastManager.on('show', listener);

      toastManager.show('Long wait', { duration: 999999 });

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: 999999,
        })
      );
    });
  });
});
