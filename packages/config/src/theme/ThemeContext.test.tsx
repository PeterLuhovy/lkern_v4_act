/*
 * ================================================================
 * FILE: ThemeContext.test.tsx
 * PATH: /packages/config/src/theme/ThemeContext.test.tsx
 * DESCRIPTION: Tests for ThemeContext provider
 * VERSION: v1.0.0
 * UPDATED: 2025-10-19 16:15:00
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { ThemeProvider, useTheme } from './ThemeContext';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock document.documentElement.setAttribute
const mockSetAttribute = vi.fn();
Object.defineProperty(document.documentElement, 'setAttribute', {
  value: mockSetAttribute,
  writable: true,
});

describe('ThemeContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    mockSetAttribute.mockClear();
  });

  describe('useTheme hook', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleError = vi.spyOn(console, 'error').mockImplementation(vi.fn());

      expect(() => {
        renderHook(() => useTheme());
      }).toThrow('useTheme must be used within ThemeProvider');

      consoleError.mockRestore();
    });

    it('should return theme context when used within provider', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.theme).toBeDefined();
      expect(result.current.setTheme).toBeTypeOf('function');
      expect(result.current.toggleTheme).toBeTypeOf('function');
    });
  });

  describe('default theme', () => {
    it('should default to light theme', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.theme).toBe('light');
    });

    it('should use defaultTheme prop when provided', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.theme).toBe('dark');
    });

    it('should load theme from localStorage', () => {
      localStorageMock.setItem('l-kern-theme', 'dark');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.theme).toBe('dark');
    });

    it('should prefer defaultTheme over localStorage', () => {
      localStorageMock.setItem('l-kern-theme', 'dark');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="light">{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.theme).toBe('light');
    });
  });

  describe('setTheme', () => {
    it('should update theme', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
    });

    it('should save theme to localStorage', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme('dark');
      });

      expect(localStorageMock.getItem('l-kern-theme')).toBe('dark');
    });

    it('should apply theme to document element', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme('dark');
      });

      expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    });

    it('should warn on unsupported theme', () => {
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(vi.fn());

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        // Testing invalid input - intentionally bypassing type checking
        // @ts-expect-error - Testing error handling with invalid theme value
        result.current.setTheme('invalid');
      });

      expect(consoleWarn).toHaveBeenCalledWith('Unsupported theme: invalid');
      expect(result.current.theme).toBe('light'); // Should not change

      consoleWarn.mockRestore();
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.theme).toBe('light');

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.theme).toBe('dark');

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('light');
    });

    it('should persist toggled theme', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.toggleTheme();
      });

      expect(localStorageMock.getItem('l-kern-theme')).toBe('dark');

      act(() => {
        result.current.toggleTheme();
      });

      expect(localStorageMock.getItem('l-kern-theme')).toBe('light');
    });
  });

  describe('localStorage errors', () => {
    it('should handle localStorage save errors gracefully', () => {
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(vi.fn());

      // Mock localStorage.setItem to throw error
      const originalSetItem = localStorageMock.setItem;
      localStorageMock.setItem = () => {
        throw new Error('Storage quota exceeded');
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme('dark');
      });

      expect(consoleWarn).toHaveBeenCalledWith(
        'Failed to save theme preference:',
        expect.any(Error)
      );

      // Restore
      localStorageMock.setItem = originalSetItem;
      consoleWarn.mockRestore();
    });

    it('should handle localStorage load errors gracefully', () => {
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(vi.fn());

      // Mock localStorage.getItem to throw error
      const originalGetItem = localStorageMock.getItem;
      localStorageMock.getItem = () => {
        throw new Error('Storage access denied');
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      // Should fallback to default theme
      expect(result.current.theme).toBe('light');

      // Restore
      localStorageMock.getItem = originalGetItem;
      consoleWarn.mockRestore();
    });
  });
});