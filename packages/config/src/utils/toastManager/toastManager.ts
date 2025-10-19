/*
 * ================================================================
 * FILE: toastManager.ts
 * PATH: /packages/config/src/utils/toastManager/toastManager.ts
 * DESCRIPTION: Global toast notification manager (event emitter)
 * VERSION: v1.0.0
 * UPDATED: 2025-10-19 12:00:00
 * ================================================================
 */

// === TYPES ===

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  type?: ToastType;
  duration?: number;
  copiedContent?: string;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

export interface Toast extends ToastOptions {
  id: string;
  message: string;
  timestamp: number;
}

type ToastEvent = 'show' | 'hide' | 'clear';
type ToastEventListener = (toast: Toast) => void;
type ClearAllListener = () => void;

// === TOAST MANAGER CLASS ===

class ToastManager {
  private listeners: Map<ToastEvent | 'clear', Set<ToastEventListener | ClearAllListener>> = new Map();
  private toastCounter = 0;

  show(message: string, options: ToastOptions = {}): string {
    const id = `toast-${++this.toastCounter}`;
    const timestamp = Date.now();

    const toast: Toast = {
      id,
      message,
      timestamp,
      type: options.type || 'success',
      duration: options.duration !== undefined ? options.duration : 3000,
      copiedContent: options.copiedContent,
      position: options.position || 'bottom-center',
    };

    this.emit('show', toast);
    console.log('[ToastManager] Show:', { id, message, type: toast.type });
    return id;
  }

  hide(id: string): void {
    const toast: Toast = {
      id,
      message: '',
      timestamp: Date.now(),
      type: 'success',
    };
    this.emit('hide', toast);
    console.log('[ToastManager] Hide:', id);
  }

  clearAll(): void {
    this.emitClearAll();
    this.toastCounter = 0; // Reset counter for testing
    console.log('[ToastManager] Clear all');
  }

  on(event: ToastEvent, callback: ToastEventListener): void;
  on(event: 'clear', callback: ClearAllListener): void;
  on(event: ToastEvent | 'clear', callback: ToastEventListener | ClearAllListener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: ToastEvent, callback: ToastEventListener): void;
  off(event: 'clear', callback: ClearAllListener): void;
  off(event: ToastEvent | 'clear', callback: ToastEventListener | ClearAllListener): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.delete(callback);
    }
  }

  private emit(event: ToastEvent, toast: Toast): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach((callback) => {
        (callback as ToastEventListener)(toast);
      });
    }
  }

  private emitClearAll(): void {
    if (this.listeners.has('clear')) {
      this.listeners.get('clear')!.forEach((callback) => {
        (callback as ClearAllListener)();
      });
    }
  }
}

// === SINGLETON INSTANCE ===

export const toastManager = new ToastManager();
export default toastManager;
