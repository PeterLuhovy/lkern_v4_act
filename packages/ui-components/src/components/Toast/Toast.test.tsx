/*
 * ================================================================
 * FILE: Toast.test.tsx
 * PATH: /packages/ui-components/src/components/Toast/Toast.test.tsx
 * DESCRIPTION: Tests for Toast component
 * VERSION: v1.0.0
 * UPDATED: 2025-10-19 15:45:00
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithTranslation, screen, waitFor, userEvent } from '../../test-utils';
import { Toast } from './Toast';
import type { Toast as ToastType } from '@l-kern/config';

describe('Toast', () => {
  let mockToast: ToastType;
  let onClose: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    onClose = vi.fn();

    mockToast = {
      id: 'test-toast-1',
      message: 'Test notification',
      type: 'success',
    };
  });

  describe('rendering', () => {
    it('should render toast message', () => {
      renderWithTranslation(<Toast toast={mockToast} onClose={onClose} />);

      expect(screen.getByText('Test notification')).toBeInTheDocument();
    });

    it('should render success icon for success toast', () => {
      mockToast.type = 'success';

      renderWithTranslation(<Toast toast={mockToast} onClose={onClose} />);

      expect(screen.getByText('✓')).toBeInTheDocument();
    });

    it('should render error icon for error toast', () => {
      mockToast.type = 'error';

      renderWithTranslation(<Toast toast={mockToast} onClose={onClose} />);

      expect(screen.getByText('✕')).toBeInTheDocument();
    });

    it('should render warning icon for warning toast', () => {
      mockToast.type = 'warning';

      renderWithTranslation(<Toast toast={mockToast} onClose={onClose} />);

      expect(screen.getByText('⚠')).toBeInTheDocument();
    });

    it('should render info icon for info toast', () => {
      mockToast.type = 'info';

      renderWithTranslation(<Toast toast={mockToast} onClose={onClose} />);

      expect(screen.getByText('ℹ')).toBeInTheDocument();
    });

    it('should render close button when onClose provided', () => {
      renderWithTranslation(<Toast toast={mockToast} onClose={onClose} />);

      const closeButton = screen.getByLabelText('Close notification');
      expect(closeButton).toBeInTheDocument();
    });

    it('should not render close button when onClose not provided', () => {
      renderWithTranslation(<Toast toast={mockToast} />);

      const closeButton = screen.queryByLabelText('Close notification');
      expect(closeButton).not.toBeInTheDocument();
    });

    it('should render copied content when provided', () => {
      mockToast.copiedContent = 'Copied text content';

      renderWithTranslation(<Toast toast={mockToast} onClose={onClose} />);

      expect(screen.getByText('Copied text content')).toBeInTheDocument();
    });

    it('should have proper ARIA attributes', () => {
      renderWithTranslation(<Toast toast={mockToast} onClose={onClose} />);

      const toastElement = screen.getByRole('alert');
      expect(toastElement).toHaveAttribute('aria-live', 'polite');
      expect(toastElement).toHaveAttribute('data-toast-id', 'test-toast-1');
    });
  });

  describe('close functionality', () => {
    it('should call onClose with toast id when close button clicked', async () => {
      const user = userEvent.setup();

      renderWithTranslation(<Toast toast={mockToast} onClose={onClose} />);

      const closeButton = screen.getByLabelText('Close notification');
      await user.click(closeButton);

      // Wait for fade-out animation (300ms)
      await waitFor(
        () => {
          expect(onClose).toHaveBeenCalledWith('test-toast-1');
        },
        { timeout: 500 }
      );
    });

    it('should fade out before calling onClose', async () => {
      const user = userEvent.setup();

      renderWithTranslation(<Toast toast={mockToast} onClose={onClose} />);

      const closeButton = screen.getByLabelText('Close notification');
      await user.click(closeButton);

      // onClose should not be called immediately
      expect(onClose).not.toHaveBeenCalled();

      // Wait for fade-out animation
      await waitFor(
        () => {
          expect(onClose).toHaveBeenCalled();
        },
        { timeout: 500 }
      );
    });
  });

  describe('toast types', () => {
    it('should apply success class for success toast', () => {
      mockToast.type = 'success';

      const { container } = renderWithTranslation(<Toast toast={mockToast} onClose={onClose} />);

      const toastElement = container.querySelector('[class*="toast--success"]');
      expect(toastElement).toBeInTheDocument();
    });

    it('should apply error class for error toast', () => {
      mockToast.type = 'error';

      const { container } = renderWithTranslation(<Toast toast={mockToast} onClose={onClose} />);

      const toastElement = container.querySelector('[class*="toast--error"]');
      expect(toastElement).toBeInTheDocument();
    });

    it('should apply warning class for warning toast', () => {
      mockToast.type = 'warning';

      const { container } = renderWithTranslation(<Toast toast={mockToast} onClose={onClose} />);

      const toastElement = container.querySelector('[class*="toast--warning"]');
      expect(toastElement).toBeInTheDocument();
    });

    it('should apply info class for info toast', () => {
      mockToast.type = 'info';

      const { container } = renderWithTranslation(<Toast toast={mockToast} onClose={onClose} />);

      const toastElement = container.querySelector('[class*="toast--info"]');
      expect(toastElement).toBeInTheDocument();
    });

    it('should default to success type when type not specified', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Test edge case with invalid type
      mockToast.type = undefined as any;

      renderWithTranslation(<Toast toast={mockToast} onClose={onClose} />);

      expect(screen.getByText('✓')).toBeInTheDocument(); // Success icon
    });
  });

  describe('animation', () => {
    it('should start invisible and fade in', async () => {
      const { container } = renderWithTranslation(<Toast toast={mockToast} onClose={onClose} />);

      // Safe: toast element exists from querySelector
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const toastElement = container.querySelector('[class*="toast"]')!;

      // Initially should not have visible class
      expect(toastElement.className).not.toContain('toast--visible');

      // Wait for fade-in (10ms delay)
      await waitFor(
        () => {
          expect(toastElement.className).toContain('toast--visible');
        },
        { timeout: 100 }
      );
    });
  });

  describe('multiple toasts', () => {
    it('should render multiple toasts with different ids', () => {
      const toast1: ToastType = {
        id: 'toast-1',
        message: 'First notification',
        type: 'success',
      };

      const toast2: ToastType = {
        id: 'toast-2',
        message: 'Second notification',
        type: 'error',
      };

      const { unmount } = renderWithTranslation(<Toast toast={toast1} onClose={onClose} />);

      expect(screen.getByText('First notification')).toBeInTheDocument();

      unmount();
      renderWithTranslation(<Toast toast={toast2} onClose={onClose} />);

      expect(screen.getByText('Second notification')).toBeInTheDocument();
    });
  });
});