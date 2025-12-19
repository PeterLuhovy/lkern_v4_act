/**
 * @file vitest.setup.ts
 * @package @l-kern/ui-components
 * @description Vitest setup file - extends matchers with @testing-library/jest-dom
 * @version 1.1.0
 * @date 2025-12-19
 */

import '@testing-library/jest-dom/vitest';

// ================================================================
// localStorage/sessionStorage polyfill for JSDOM
// ================================================================
// JSDOM should have localStorage but in some environments it may not be available.
// This polyfill ensures localStorage is always available in tests.

class LocalStorageMock {
  private store: Record<string, string> = {};

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }

  removeItem(key: string) {
    delete this.store[key];
  }

  get length() {
    return Object.keys(this.store).length;
  }

  key(index: number) {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }
}

// Only define if not already available
if (typeof globalThis.localStorage === 'undefined') {
  Object.defineProperty(globalThis, 'localStorage', {
    value: new LocalStorageMock(),
    writable: true,
  });
}

if (typeof globalThis.sessionStorage === 'undefined') {
  Object.defineProperty(globalThis, 'sessionStorage', {
    value: new LocalStorageMock(),
    writable: true,
  });
}
