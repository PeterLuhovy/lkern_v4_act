/*
 * ================================================================
 * FILE: modalStack.test.ts
 * PATH: /packages/config/src/utils/modalStack/modalStack.test.ts
 * DESCRIPTION: Tests for modal stack manager
 * VERSION: v1.0.0
 * UPDATED: 2025-10-19 15:00:00
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { modalStack } from './modalStack';

describe('modalStack', () => {
  beforeEach(() => {
    // Clear stack before each test
    modalStack.clear();
  });

  describe('push()', () => {
    it('should add modal to stack and return z-index', () => {
      const zIndex = modalStack.push('modal1');

      expect(zIndex).toBe(1000); // Base z-index
      expect(modalStack.has('modal1')).toBe(true);
      expect(modalStack.size()).toBe(1);
    });

    it('should increment z-index for each modal', () => {
      const zIndex1 = modalStack.push('modal1');
      const zIndex2 = modalStack.push('modal2');
      const zIndex3 = modalStack.push('modal3');

      expect(zIndex1).toBe(1000);
      expect(zIndex2).toBe(1010);
      expect(zIndex3).toBe(1020);
    });

    it('should store parent-child relationship', () => {
      modalStack.push('parent');
      modalStack.push('child', 'parent');

      expect(modalStack.size()).toBe(2);
    });

    it('should prevent duplicates', () => {
      modalStack.push('modal1');
      modalStack.push('modal1'); // Push again

      expect(modalStack.size()).toBe(1);
    });

    it('should store onClose callback', () => {
      const onClose = vi.fn();
      modalStack.push('modal1', undefined, onClose);

      expect(modalStack.has('modal1')).toBe(true);
    });

    it('should store onConfirm callback', () => {
      const onConfirm = vi.fn();
      modalStack.push('modal1', undefined, undefined, onConfirm);

      expect(modalStack.has('modal1')).toBe(true);
    });
  });

  describe('pop()', () => {
    it('should remove modal from stack', () => {
      modalStack.push('modal1');
      const hadParent = modalStack.pop('modal1');

      expect(hadParent).toBe(false);
      expect(modalStack.has('modal1')).toBe(false);
      expect(modalStack.size()).toBe(0);
    });

    it('should return true if modal had parent', () => {
      modalStack.push('parent');
      modalStack.push('child', 'parent');

      const hadParent = modalStack.pop('child');

      expect(hadParent).toBe(true);
    });

    it('should close children when requested', () => {
      const childClose = vi.fn();

      modalStack.push('parent');
      modalStack.push('child', 'parent', childClose);

      modalStack.pop('parent', true); // closeChildren = true

      expect(childClose).toHaveBeenCalled();
      expect(modalStack.has('child')).toBe(false);
    });

    it('should not close children by default', () => {
      const childClose = vi.fn();

      modalStack.push('parent');
      modalStack.push('child', 'parent', childClose);

      modalStack.pop('parent'); // closeChildren = false (default)

      expect(childClose).not.toHaveBeenCalled();
    });

    it('should ignore pop if modal not in stack', () => {
      const result = modalStack.pop('nonexistent');

      expect(result).toBe(false);
    });
  });

  describe('closeModal()', () => {
    it('should call onClose callback', () => {
      const onClose = vi.fn();
      modalStack.push('modal1', undefined, onClose);

      const result = modalStack.closeModal('modal1');

      expect(result).toBe(true);
      expect(onClose).toHaveBeenCalled();
    });

    it('should return false if modal not found', () => {
      const result = modalStack.closeModal('nonexistent');

      expect(result).toBe(false);
    });

    it('should return false if no onClose callback', () => {
      modalStack.push('modal1'); // No onClose

      const result = modalStack.closeModal('modal1');

      expect(result).toBe(false);
    });
  });

  describe('confirmModal()', () => {
    it('should call onConfirm callback', () => {
      const onConfirm = vi.fn();
      modalStack.push('modal1', undefined, undefined, onConfirm);

      const result = modalStack.confirmModal('modal1');

      expect(result).toBe(true);
      expect(onConfirm).toHaveBeenCalled();
    });

    it('should return false if modal not found', () => {
      const result = modalStack.confirmModal('nonexistent');

      expect(result).toBe(false);
    });

    it('should return false if no onConfirm callback', () => {
      modalStack.push('modal1'); // No onConfirm

      const result = modalStack.confirmModal('modal1');

      expect(result).toBe(false);
    });
  });

  describe('getTopmostModalId()', () => {
    it('should return undefined when stack is empty', () => {
      const topmost = modalStack.getTopmostModalId();

      expect(topmost).toBeUndefined();
    });

    it('should return last modal in stack', () => {
      modalStack.push('modal1');
      modalStack.push('modal2');
      modalStack.push('modal3');

      const topmost = modalStack.getTopmostModalId();

      expect(topmost).toBe('modal3');
    });

    it('should update when modal is removed', () => {
      modalStack.push('modal1');
      modalStack.push('modal2');

      expect(modalStack.getTopmostModalId()).toBe('modal2');

      modalStack.pop('modal2');

      expect(modalStack.getTopmostModalId()).toBe('modal1');
    });
  });

  describe('getZIndex()', () => {
    it('should return z-index for modal', () => {
      modalStack.push('modal1');

      const zIndex = modalStack.getZIndex('modal1');

      expect(zIndex).toBe(1000);
    });

    it('should return undefined if modal not found', () => {
      const zIndex = modalStack.getZIndex('nonexistent');

      expect(zIndex).toBeUndefined();
    });
  });

  describe('has()', () => {
    it('should return true if modal in stack', () => {
      modalStack.push('modal1');

      expect(modalStack.has('modal1')).toBe(true);
    });

    it('should return false if modal not in stack', () => {
      expect(modalStack.has('nonexistent')).toBe(false);
    });
  });

  describe('size()', () => {
    it('should return 0 when empty', () => {
      expect(modalStack.size()).toBe(0);
    });

    it('should return number of modals', () => {
      modalStack.push('modal1');
      modalStack.push('modal2');
      modalStack.push('modal3');

      expect(modalStack.size()).toBe(3);
    });
  });

  describe('clear()', () => {
    it('should remove all modals', () => {
      modalStack.push('modal1');
      modalStack.push('modal2');
      modalStack.push('modal3');

      modalStack.clear();

      expect(modalStack.size()).toBe(0);
    });

    it('should call onClose for all modals', () => {
      const onClose1 = vi.fn();
      const onClose2 = vi.fn();
      const onClose3 = vi.fn();

      modalStack.push('modal1', undefined, onClose1);
      modalStack.push('modal2', undefined, onClose2);
      modalStack.push('modal3', undefined, onClose3);

      modalStack.clear();

      expect(onClose1).toHaveBeenCalled();
      expect(onClose2).toHaveBeenCalled();
      expect(onClose3).toHaveBeenCalled();
    });
  });

  describe('nested modals', () => {
    it('should handle parent-child hierarchy', () => {
      const parentClose = vi.fn();
      const childClose = vi.fn();

      modalStack.push('parent', undefined, parentClose);
      modalStack.push('child', 'parent', childClose);

      expect(modalStack.size()).toBe(2);
      expect(modalStack.getTopmostModalId()).toBe('child');

      // Close parent with children
      modalStack.pop('parent', true);

      expect(childClose).toHaveBeenCalled();
      expect(modalStack.size()).toBe(0);
    });

    it('should calculate z-index correctly for nested modals', () => {
      const zIndex1 = modalStack.push('parent');
      const zIndex2 = modalStack.push('child', 'parent');

      expect(zIndex2).toBeGreaterThan(zIndex1);
      expect(zIndex2).toBe(zIndex1 + 10);
    });
  });
});
