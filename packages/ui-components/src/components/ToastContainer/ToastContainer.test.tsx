/*
 * ================================================================
 * FILE: ToastContainer.test.tsx
 * PATH: /packages/ui-components/src/components/ToastContainer/ToastContainer.test.tsx
 * DESCRIPTION: Tests for ToastContainer component
 * VERSION: v1.0.0
 * UPDATED: 2025-10-19 15:45:00
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithTranslation, screen } from '../../test-utils';
import { ToastContainer } from './ToastContainer';
import type { Toast } from '@l-kern/config';

// Mock ToastContext
const mockToasts: Toast[] = [];
const mockHideToast = vi.fn();

vi.mock('@l-kern/config', async () => {
  const actual = await vi.importActual('@l-kern/config');
  return {
    ...actual,
    useToastContext: () => ({
      toasts: mockToasts,
      hideToast: mockHideToast,
    }),
  };
});

// Mock Toast component
vi.mock('../Toast', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Test mock component props
  Toast: ({ toast, onClose }: any) => (
    <div data-testid={`toast-${toast.id}`}>
      {toast.message}
      <button onClick={() => onClose(toast.id)}>Close</button>
    </div>
  ),
}));

describe('ToastContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockToasts.length = 0; // Clear array
  });

  describe('rendering', () => {
    it('should render nothing when no toasts', () => {
      renderWithTranslation(<ToastContainer />);

      expect(screen.queryByTestId('toast-container')).not.toBeInTheDocument();
    });

    it('should render container with toasts', () => {
      mockToasts.push({
        id: 'toast-1',
        message: 'Test notification',
        type: 'success',
      });

      renderWithTranslation(<ToastContainer />);

      expect(screen.getByTestId('toast-container')).toBeInTheDocument();
      expect(screen.getByTestId('toast-toast-1')).toBeInTheDocument();
    });

    it('should render multiple toasts', () => {
      mockToasts.push(
        {
          id: 'toast-1',
          message: 'First notification',
          type: 'success',
        },
        {
          id: 'toast-2',
          message: 'Second notification',
          type: 'error',
        },
        {
          id: 'toast-3',
          message: 'Third notification',
          type: 'warning',
        }
      );

      renderWithTranslation(<ToastContainer />);

      expect(screen.getByTestId('toast-toast-1')).toBeInTheDocument();
      expect(screen.getByTestId('toast-toast-2')).toBeInTheDocument();
      expect(screen.getByTestId('toast-toast-3')).toBeInTheDocument();
    });
  });

  describe('positioning', () => {
    beforeEach(() => {
      mockToasts.length = 0;
    });

    it('should filter toasts by position (bottom-center default)', () => {
      mockToasts.push(
        {
          id: 'toast-1',
          message: 'Bottom center toast',
          type: 'success',
          position: 'bottom-center',
        },
        {
          id: 'toast-2',
          message: 'Top right toast',
          type: 'success',
          position: 'top-right',
        }
      );

      renderWithTranslation(<ToastContainer position="bottom-center" />);

      expect(screen.getByTestId('toast-toast-1')).toBeInTheDocument();
      expect(screen.queryByTestId('toast-toast-2')).not.toBeInTheDocument();
    });

    it('should filter toasts for top-right position', () => {
      mockToasts.push(
        {
          id: 'toast-1',
          message: 'Bottom center toast',
          type: 'success',
          position: 'bottom-center',
        },
        {
          id: 'toast-2',
          message: 'Top right toast',
          type: 'success',
          position: 'top-right',
        }
      );

      renderWithTranslation(<ToastContainer position="top-right" />);

      expect(screen.queryByTestId('toast-toast-1')).not.toBeInTheDocument();
      expect(screen.getByTestId('toast-toast-2')).toBeInTheDocument();
    });

    it('should default toast position to bottom-center when not specified', () => {
      mockToasts.push({
        id: 'toast-1',
        message: 'Toast without position',
        type: 'success',
        // No position specified
      });

      renderWithTranslation(<ToastContainer position="bottom-center" />);

      expect(screen.getByTestId('toast-toast-1')).toBeInTheDocument();
    });

    it('should support all position variants', () => {
      const positions = [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ] as const;

      positions.forEach((position) => {
        mockToasts.length = 0;
        mockToasts.push({
          id: `toast-${position}`,
          message: `Toast at ${position}`,
          type: 'success',
          position,
        });

        const { unmount } = renderWithTranslation(<ToastContainer position={position} />);

        expect(screen.getByTestId(`toast-toast-${position}`)).toBeInTheDocument();

        unmount();
      });
    });
  });

  describe('toast interactions', () => {
    it('should pass hideToast to Toast component', () => {
      mockToasts.push({
        id: 'toast-1',
        message: 'Test notification',
        type: 'success',
      });

      renderWithTranslation(<ToastContainer />);

      const closeButton = screen.getByText('Close');
      closeButton.click();

      expect(mockHideToast).toHaveBeenCalledWith('toast-1');
    });
  });

  describe('container classes', () => {
    beforeEach(() => {
      mockToasts.push({
        id: 'toast-1',
        message: 'Test toast',
        type: 'success',
      });
    });

    it('should apply bottom-center class by default', () => {
      const { container } = renderWithTranslation(<ToastContainer />);

      const containerElement = container.querySelector('[class*="toastContainer--bottom-center"]');
      expect(containerElement).toBeInTheDocument();
    });

    it('should apply correct class for top-right position', () => {
      mockToasts[0].position = 'top-right';

      const { container } = renderWithTranslation(<ToastContainer position="top-right" />);

      const containerElement = container.querySelector('[class*="toastContainer--top-right"]');
      expect(containerElement).toBeInTheDocument();
    });

    it('should apply correct class for bottom-left position', () => {
      mockToasts[0].position = 'bottom-left';

      const { container } = renderWithTranslation(<ToastContainer position="bottom-left" />);

      const containerElement = container.querySelector('[class*="toastContainer--bottom-left"]');
      expect(containerElement).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('should not render container when all toasts for different position', () => {
      mockToasts.push({
        id: 'toast-1',
        message: 'Top right toast',
        type: 'success',
        position: 'top-right',
      });

      renderWithTranslation(<ToastContainer position="bottom-center" />);

      expect(screen.queryByTestId('toast-container')).not.toBeInTheDocument();
    });

    it('should hide container when last toast is removed', () => {
      mockToasts.push({
        id: 'toast-1',
        message: 'Test toast',
        type: 'success',
      });

      const { unmount } = renderWithTranslation(<ToastContainer />);

      expect(screen.getByTestId('toast-container')).toBeInTheDocument();

      // Remove toast
      mockToasts.length = 0;

      unmount();
      renderWithTranslation(<ToastContainer />);

      expect(screen.queryByTestId('toast-container')).not.toBeInTheDocument();
    });
  });
});