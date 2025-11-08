/*
 * ================================================================
 * FILE: DebugBar.test.tsx
 * PATH: /packages/ui-components/src/components/DebugBar/DebugBar.test.tsx
 * DESCRIPTION: Tests for DebugBar component
 * VERSION: v1.0.0
 * UPDATED: 2025-10-19 15:30:00
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithTranslation, screen, fireEvent, userEvent } from '../../test-utils';
import { DebugBar } from './DebugBar';
import type { UsePageAnalyticsReturn } from '@l-kern/config';

// Clipboard mock
const clipboardWriteSpy = vi.fn();

describe('DebugBar', () => {
  let mockAnalytics: UsePageAnalyticsReturn;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup clipboard mock properly (configurable: true is CRITICAL!)
    clipboardWriteSpy.mockReset();
    clipboardWriteSpy.mockResolvedValue(undefined);

    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: clipboardWriteSpy,
      },
      writable: true,
      configurable: true, // CRITICAL: allows re-mocking in each test
    });

    // Create mock analytics object (matching UsePageAnalyticsReturn interface)
    mockAnalytics = {
      session: {
        sessionId: 'test-session',
        pageName: 'test-modal',
        startTime: Date.now(),
        clickEvents: [],
        keyboardEvents: [],
      },
      metrics: {
        clickCount: 5,
        keyboardCount: 10,
        totalTime: '1.5s',
        timeSinceLastActivity: '0.2s',
        averageTimeBetweenClicks: 0.3,
      },
      startSession: vi.fn(),
      endSession: vi.fn(),
      trackClick: vi.fn(),
      trackKeyboard: vi.fn(),
      getSessionReport: vi.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Test mock object matching UsePageAnalyticsReturn interface
    } as any;
  });

  describe('rendering', () => {
    it('should render modal name', () => {
      renderWithTranslation(
        <DebugBar
          modalName="edit-contact"
          isDarkMode={false}
          analytics={mockAnalytics}
        />
      );

      expect(screen.getByText(/edit-contact/)).toBeInTheDocument();
    });

    it('should render click count', () => {
      renderWithTranslation(
        <DebugBar
          modalName="test-modal"
          isDarkMode={false}
          analytics={mockAnalytics}
        />
      );

      expect(screen.getByText('5')).toBeInTheDocument(); // Click count
    });

    it('should render keyboard count', () => {
      renderWithTranslation(
        <DebugBar
          modalName="test-modal"
          isDarkMode={false}
          analytics={mockAnalytics}
        />
      );

      expect(screen.getByText('10')).toBeInTheDocument(); // Keyboard count
    });

    it('should render theme indicator for light mode', () => {
      renderWithTranslation(
        <DebugBar
          modalName="test-modal"
          isDarkMode={false}
          analytics={mockAnalytics}
        />
      );

      expect(screen.getByText('Light')).toBeInTheDocument();
    });

    it('should render theme indicator for dark mode', () => {
      renderWithTranslation(
        <DebugBar
          modalName="test-modal"
          isDarkMode={true}
          analytics={mockAnalytics}
        />
      );

      expect(screen.getByText('Dark')).toBeInTheDocument();
    });

    it('should render language indicator', () => {
      renderWithTranslation(
        <DebugBar
          modalName="test-modal"
          isDarkMode={false}
          analytics={mockAnalytics}
        />
      );

      expect(screen.getByText('SK')).toBeInTheDocument();
    });

    it('should render total time', () => {
      renderWithTranslation(
        <DebugBar
          modalName="test-modal"
          isDarkMode={false}
          analytics={mockAnalytics}
        />
      );

      expect(screen.getByText(/1.5s/)).toBeInTheDocument();
    });

    it('should render time since last activity', () => {
      renderWithTranslation(
        <DebugBar
          modalName="test-modal"
          isDarkMode={false}
          analytics={mockAnalytics}
        />
      );

      expect(screen.getByText(/0.2s/)).toBeInTheDocument();
    });

    it('should not render when show is false', () => {
      renderWithTranslation(
        <DebugBar
          modalName="test-modal"
          isDarkMode={false}
          analytics={mockAnalytics}
          show={false}
        />
      );

      expect(screen.queryByText(/test-modal/)).not.toBeInTheDocument();
    });
  });

  describe('copy functionality', () => {
    it('should copy modal name to clipboard when copy button clicked', async () => {
      renderWithTranslation(
        <DebugBar
          modalName="edit-contact"
          isDarkMode={false}
          analytics={mockAnalytics}
        />
      );

      const copyButton = screen.getByTitle('Skopírovať názov modalu');

      // Use fireEvent for synchronous click
      fireEvent.click(copyButton);

      // Wait for async clipboard operation
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(clipboardWriteSpy).toHaveBeenCalledTimes(1);
      // DebugBar copies formatted name: [Analytics][Modal][modalName]
      expect(clipboardWriteSpy).toHaveBeenCalledWith('[Analytics][Modal][edit-contact]');
    });

    it('should track click analytics when copy button clicked', async () => {
      const user = userEvent.setup();

      renderWithTranslation(
        <DebugBar
          modalName="edit-contact"
          isDarkMode={false}
          analytics={mockAnalytics}
        />
      );

      const copyButton = screen.getByTitle('Skopírovať názov modalu');;
      await user.click(copyButton);

      expect(mockAnalytics.trackClick).toHaveBeenCalledWith(
        'CopyModalName',
        'button',
        expect.any(Object)
      );
    });

    it('should handle clipboard error gracefully', async () => {
      const user = userEvent.setup();
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Mock clipboard failure
      clipboardWriteSpy.mockRejectedValueOnce(
        new Error('Clipboard access denied')
      );

      renderWithTranslation(
        <DebugBar
          modalName="edit-contact"
          isDarkMode={false}
          analytics={mockAnalytics}
        />
      );

      const copyButton = screen.getByTitle('Skopírovať názov modalu');
      await user.click(copyButton);

      // Give async error handler time to execute
      await new Promise(resolve => setTimeout(resolve, 50));

      // Component should still be rendered (no crash)
      expect(screen.getByTitle('Skopírovať názov modalu')).toBeInTheDocument();

      consoleError.mockRestore();
    });
  });

  describe('click tracking', () => {
    it('should track clicks on debug header area', async () => {
      const user = userEvent.setup();

      const { container } = renderWithTranslation(
        <DebugBar
          modalName="test-modal"
          isDarkMode={false}
          analytics={mockAnalytics}
        />
      );

      // Safe: debugBar element exists from querySelector
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const debugBar = container.querySelector('[class*="debugBar"]')!;
      await user.click(debugBar);

      expect(mockAnalytics.trackClick).toHaveBeenCalledWith(
        'DebugHeader',
        'debug-header',
        expect.any(Object)
      );
    });

    it('should not track analytics when clicking copy button', async () => {
      const user = userEvent.setup();

      renderWithTranslation(
        <DebugBar
          modalName="edit-contact"
          isDarkMode={false}
          analytics={mockAnalytics}
        />
      );

      const copyButton = screen.getByTitle('Skopírovať názov modalu');
      await user.click(copyButton);

      // Should only track CopyModalName, not DebugHeader
      expect(mockAnalytics.trackClick).toHaveBeenCalledTimes(1);
      expect(mockAnalytics.trackClick).toHaveBeenCalledWith(
        'CopyModalName',
        'button',
        expect.any(Object)
      );
    });
  });

  describe('metrics updates', () => {
    it('should display updated click count', () => {
      const { unmount } = renderWithTranslation(
        <DebugBar
          modalName="test-modal"
          isDarkMode={false}
          analytics={mockAnalytics}
        />
      );

      expect(screen.getByText('5')).toBeInTheDocument();

      // Update metrics
      mockAnalytics.metrics.clickCount = 15;

      unmount();
      renderWithTranslation(
        <DebugBar
          modalName="test-modal"
          isDarkMode={false}
          analytics={mockAnalytics}
        />
      );

      expect(screen.getByText('15')).toBeInTheDocument();
    });

    it('should display updated keyboard count', () => {
      const { unmount } = renderWithTranslation(
        <DebugBar
          modalName="test-modal"
          isDarkMode={false}
          analytics={mockAnalytics}
        />
      );

      expect(screen.getByText('10')).toBeInTheDocument();

      // Update metrics
      mockAnalytics.metrics.keyboardCount = 25;

      unmount();
      renderWithTranslation(
        <DebugBar
          modalName="test-modal"
          isDarkMode={false}
          analytics={mockAnalytics}
        />
      );

      expect(screen.getByText('25')).toBeInTheDocument();
    });

    it('should display updated time values', () => {
      const { unmount } = renderWithTranslation(
        <DebugBar
          modalName="test-modal"
          isDarkMode={false}
          analytics={mockAnalytics}
        />
      );

      expect(screen.getByText(/1.5s/)).toBeInTheDocument();

      // Update metrics
      mockAnalytics.metrics.totalTime = '3.2s';

      unmount();
      renderWithTranslation(
        <DebugBar
          modalName="test-modal"
          isDarkMode={false}
          analytics={mockAnalytics}
        />
      );

      expect(screen.getByText(/3.2s/)).toBeInTheDocument();
    });
  });

  describe('theme switching', () => {
    it('should update theme indicator when theme changes', () => {
      const { unmount } = renderWithTranslation(
        <DebugBar
          modalName="test-modal"
          isDarkMode={false}
          analytics={mockAnalytics}
        />
      );

      // Text "Light" without emoji (emoji is in separate span)
      expect(screen.getByText('Light')).toBeInTheDocument();

      unmount();
      renderWithTranslation(
        <DebugBar
          modalName="test-modal"
          isDarkMode={true}
          analytics={mockAnalytics}
        />
      );

      // Text "Dark" without emoji (emoji is in separate span)
      expect(screen.getByText('Dark')).toBeInTheDocument();
    });
  });
});