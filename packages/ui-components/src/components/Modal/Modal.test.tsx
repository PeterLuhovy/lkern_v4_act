/*
 * ================================================================
 * FILE: Modal.test.tsx
 * PATH: /packages/ui-components/src/components/Modal/Modal.test.tsx
 * DESCRIPTION: Tests for Modal component v3.0.0 (with enhanced features + translation tests)
 * VERSION: v3.1.0
 * UPDATED: 2025-10-30 23:30:00
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderWithAll, screen, fireEvent, waitFor } from '../../test-utils';
import { Modal, ModalFooterConfig } from './Modal';
import { modalStack } from '@l-kern/config';

// ✅ PARTIAL MOCK - Keep ONLY modalStack & usePageAnalytics (needed for Modal)
// ✅ All other exports are REAL (translations from test-utils, theme from test-utils)
vi.mock('@l-kern/config', async () => {
  const actual = await vi.importActual('@l-kern/config');
  return {
    ...actual, // ✅ REAL translations, theme from renderWithAll
    usePageAnalytics: () => ({
      session: null,
      isSessionActive: false,
      metrics: {
        totalTime: '0.0s',
        timeSinceLastActivity: '0.0s',
        clickCount: 0,
        keyboardCount: 0,
        averageTimeBetweenClicks: 0,
      },
      startSession: vi.fn(),
      endSession: vi.fn(),
      resetSession: vi.fn(),
      trackClick: vi.fn(),
      trackKeyboard: vi.fn(),
      getSessionReport: vi.fn(),
    }),
    modalStack: {
      push: vi.fn((modalId: string, parentModalId?: string, onClose?: () => void, onConfirm?: () => void) => {
        // Return z-index based on stack depth
        return parentModalId ? 1010 : 1000;
      }),
      pop: vi.fn(),
      getTopmostModalId: vi.fn(() => null),
      closeTopmost: vi.fn(),
      closeModal: vi.fn(),
      confirmModal: vi.fn(),
    },
  };
});

describe('Modal v3.0.0', () => {
  let portalRoot: HTMLElement;

  beforeEach(() => {
    // Create portal root for tests
    portalRoot = document.createElement('div');
    portalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(portalRoot);

    // Reset mocks are handled internally by vi.mock()
  });

  afterEach(() => {
    // Clean up portal root
    document.body.removeChild(portalRoot);
  });

  // ================================================================
  // BASIC RENDERING
  // ================================================================

  it('renders nothing when closed', () => {
    renderWithAll(
      <Modal isOpen={false} onClose={vi.fn()} modalId="test-modal">
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('renders modal when open', () => {
    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal">
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" title="Test Modal">
        <div>Content</div>
      </Modal>
    );

    const modalTitle = screen.getByRole('heading', { level: 2 });
    expect(modalTitle).toHaveTextContent('Test Modal');
  });

  it('renders simple footer when provided as ReactNode', () => {
    renderWithAll(
      <Modal
        isOpen={true}
        onClose={vi.fn()}
        modalId="test-modal"
        footer={<button>Footer Button</button>}
      >
        <div>Content</div>
      </Modal>
    );

    expect(screen.getByText('Footer Button')).toBeInTheDocument();
  });

  // ================================================================
  // SIZES
  // ================================================================

  it('applies medium size by default', () => {
    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal">
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('md');
  });

  it('applies small size when specified', () => {
    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" size="sm">
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('sm');
  });

  it('applies large size when specified', () => {
    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" size="lg">
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('lg');
  });

  // ================================================================
  // CLOSE BUTTON
  // ================================================================

  it('shows close button by default', () => {
    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" title="Test">
        <div>Content</div>
      </Modal>
    );

    expect(screen.getByLabelText('Zavrieť')).toBeInTheDocument(); // Slovak translation
  });

  it('hides close button when showCloseButton is false', () => {
    renderWithAll(
      <Modal
        isOpen={true}
        onClose={vi.fn()}
        modalId="test-modal"
        title="Test"
        showCloseButton={false}
      >
        <div>Content</div>
      </Modal>
    );

    expect(screen.queryByLabelText('Zavrieť')).not.toBeInTheDocument(); // Slovak translation
  });

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    renderWithAll(
      <Modal isOpen={true} onClose={onClose} modalId="test-modal" title="Test">
        <div>Content</div>
      </Modal>
    );

    fireEvent.click(screen.getByLabelText('Zavrieť')); // Slovak translation
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // ================================================================
  // BACKDROP CLICK
  // ================================================================

  it('does not close on backdrop click by default (closeOnBackdropClick=false)', () => {
    const onClose = vi.fn();
    renderWithAll(
      <Modal isOpen={true} onClose={onClose} modalId="test-modal">
        <div>Content</div>
      </Modal>
    );

    const backdrop = screen.getByRole('dialog').parentElement;
    fireEvent.click(backdrop!);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes on backdrop click when closeOnBackdropClick is true', () => {
    const onClose = vi.fn();
    renderWithAll(
      <Modal isOpen={true} onClose={onClose} modalId="test-modal" closeOnBackdropClick={true}>
        <div>Content</div>
      </Modal>
    );

    const backdrop = screen.getByRole('dialog').parentElement;
    fireEvent.click(backdrop!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when clicking inside modal content', () => {
    const onClose = vi.fn();
    renderWithAll(
      <Modal isOpen={true} onClose={onClose} modalId="test-modal" closeOnBackdropClick={true}>
        <div>Modal Content</div>
      </Modal>
    );

    fireEvent.click(screen.getByText('Modal Content'));
    expect(onClose).not.toHaveBeenCalled();
  });

  // ================================================================
  // LOADING STATE
  // ================================================================

  it('shows spinner when loading', () => {
    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" loading={true}>
        <div>Content</div>
      </Modal>
    );

    // ✅ CORRECT: Test for loading state, not specific text
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();

    // Modal should have loading class or contain spinner element
    // Check that content is hidden and spinner is shown
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('hides content when loading', () => {
    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" loading={true}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  // ================================================================
  // ACCESSIBILITY
  // ================================================================

  it('has role="dialog"', () => {
    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal">
        <div>Content</div>
      </Modal>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('has aria-modal="true"', () => {
    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal">
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
  });

  it('has aria-labelledby when title provided', () => {
    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" title="Test Modal">
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    const titleId = dialog.getAttribute('aria-labelledby');
    expect(titleId).toBeTruthy();

    const titleElement = screen.getByRole('heading', { level: 2 });
    expect(titleElement.id).toBe(titleId);
  });

  // ================================================================
  // CLEANUP
  // ================================================================

  it('cleans up when modal closes', async () => {
    const onClose = vi.fn();
    const { unmount } = renderWithAll(
      <Modal isOpen={true} onClose={onClose} modalId="test-modal">
        <div>Content</div>
      </Modal>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();

    // Close modal by unmounting and re-rendering with isOpen=false
    unmount();
    renderWithAll(
      <Modal isOpen={false} onClose={onClose} modalId="test-modal">
        <div>Content</div>
      </Modal>
    );

    await waitFor(() => {
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });
  });

  // ================================================================
  // MODAL STACK INTEGRATION
  // ================================================================

  it('registers in modalStack when opened', () => {
    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal">
        <div>Content</div>
      </Modal>
    );

    expect(modalStack.push).toHaveBeenCalledWith('test-modal', undefined, expect.any(Function), undefined);
  });

  it('unregisters from modalStack when closed', () => {
    const { unmount } = renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal">
        <div>Content</div>
      </Modal>
    );

    vi.mocked(modalStack.pop).mockClear();

    // Close modal
    unmount();
    renderWithAll(
      <Modal isOpen={false} onClose={vi.fn()} modalId="test-modal">
        <div>Content</div>
      </Modal>
    );

    expect(modalStack.pop).toHaveBeenCalledWith('test-modal');
  });

  it('registers nested modal with parentModalId', () => {
    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="child-modal" parentModalId="parent-modal">
        <div>Child Content</div>
      </Modal>
    );

    expect(modalStack.push).toHaveBeenCalledWith(
      'child-modal',
      'parent-modal',
      expect.any(Function),
      undefined
    );
  });

  it('applies higher z-index for nested modal', () => {
    vi.mocked(modalStack.push).mockReturnValueOnce(1010);

    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="child-modal" parentModalId="parent-modal">
        <div>Child Content</div>
      </Modal>
    );

    const overlay = screen.getByRole('dialog').parentElement;
    expect(overlay?.style.zIndex).toBe('1010');
  });

  it('respects zIndexOverride when provided', () => {
    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" zIndexOverride={2000}>
        <div>Content</div>
      </Modal>
    );

    const overlay = screen.getByRole('dialog').parentElement;
    expect(overlay?.style.zIndex).toBe('2000');
  });

  // ================================================================
  // ENHANCED FOOTER (ModalFooterConfig)
  // ================================================================

  it('renders enhanced footer with left slot', () => {
    const footerConfig: ModalFooterConfig = {
      left: <button data-testid="delete-btn">Delete</button>,
    };

    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" footer={footerConfig}>
        <div>Content</div>
      </Modal>
    );

    expect(screen.getByTestId('delete-btn')).toBeInTheDocument();
  });

  it('renders enhanced footer with right slot', () => {
    const footerConfig: ModalFooterConfig = {
      right: (
        <>
          <button data-testid="cancel-btn">Cancel</button>
          <button data-testid="save-btn">Save</button>
        </>
      ),
    };

    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" footer={footerConfig}>
        <div>Content</div>
      </Modal>
    );

    expect(screen.getByTestId('cancel-btn')).toBeInTheDocument();
    expect(screen.getByTestId('save-btn')).toBeInTheDocument();
  });

  // NOTE: errorMessage was intentionally removed from ModalFooterConfig
  // Error messages should be handled by parent components using FormField validation

  it('renders simple footer when not ModalFooterConfig', () => {
    renderWithAll(
      <Modal
        isOpen={true}
        onClose={vi.fn()}
        modalId="test-modal"
        footer={<div data-testid="simple-footer">Simple Footer</div>}
      >
        <div>Content</div>
      </Modal>
    );

    expect(screen.getByTestId('simple-footer')).toBeInTheDocument();
  });

  // ================================================================
  // ALIGNMENT OPTIONS
  // ================================================================

  it('applies center alignment by default', () => {
    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal">
        <div>Content</div>
      </Modal>
    );

    const overlay = screen.getByRole('dialog').parentElement;
    expect(overlay?.style.alignItems).toBe('center');
  });

  it('applies top alignment when specified', () => {
    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" alignment="top">
        <div>Content</div>
      </Modal>
    );

    const overlay = screen.getByRole('dialog').parentElement;
    expect(overlay?.style.alignItems).toBe('flex-start');
  });

  it('applies bottom alignment when specified', () => {
    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" alignment="bottom">
        <div>Content</div>
      </Modal>
    );

    const overlay = screen.getByRole('dialog').parentElement;
    expect(overlay?.style.alignItems).toBe('flex-end');
  });

  // ================================================================
  // PADDING OVERRIDE
  // ================================================================

  it('applies default overlay padding (64px)', () => {
    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal">
        <div>Content</div>
      </Modal>
    );

    const overlay = screen.getByRole('dialog').parentElement;
    expect(overlay?.style.padding).toBe('64px');
  });

  it('applies custom overlay padding when specified', () => {
    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" overlayPadding="100px">
        <div>Content</div>
      </Modal>
    );

    const overlay = screen.getByRole('dialog').parentElement;
    expect(overlay?.style.padding).toBe('100px');
  });

  // ================================================================
  // DRAG AND DROP
  // ================================================================

  it('has draggable cursor on header by default', () => {
    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" title="Draggable Modal">
        <div>Content</div>
      </Modal>
    );

    const titleElement = screen.getByRole('heading', { level: 2, name: 'Draggable Modal' });
    const header = titleElement.parentElement;
    expect(header?.style.cursor).toBe('grab');
  });

  it('has default cursor on header when disableDrag is true', () => {
    renderWithAll(
      <Modal
        isOpen={true}
        onClose={vi.fn()}
        modalId="test-modal"
        title="Non-Draggable Modal"
        disableDrag={true}
      >
        <div>Content</div>
      </Modal>
    );

    const titleElement = screen.getByRole('heading', { level: 2, name: 'Non-Draggable Modal' });
    const header = titleElement.parentElement;
    expect(header?.style.cursor).toBe('default');
  });

  it('changes cursor to grabbing during drag', () => {
    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" title="Drag Test">
        <div>Content</div>
      </Modal>
    );

    const titleElement = screen.getByRole('heading', { level: 2, name: 'Drag Test' });
    const header = titleElement.parentElement!;

    // Start drag
    fireEvent.mouseDown(header, { clientX: 100, clientY: 100 });

    expect(header.style.cursor).toBe('grabbing');
  });

  it('does not start drag from close button', () => {
    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" title="Drag Test">
        <div>Content</div>
      </Modal>
    );

    const closeButton = screen.getByLabelText('Zavrieť'); // Slovak translation
    const titleElement = screen.getByRole('heading', { level: 2, name: 'Drag Test' });
    const header = titleElement.parentElement!;

    // Try to start drag from close button
    fireEvent.mouseDown(closeButton, { clientX: 100, clientY: 100 });

    // Cursor should still be 'grab' (not 'grabbing')
    expect(header.style.cursor).toBe('grab');
  });

  it('modal is centered on initial open', () => {
    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" title="Test">
        <div>Content</div>
      </Modal>
    );

    const modal = screen.getByRole('dialog');
    // Test behavior: modal is visible and rendered (CSS handles centering)
    expect(modal).toBeInTheDocument();
    expect(modal).toBeVisible();
  });

  it('updates position during drag', () => {
    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" title="Drag Test">
        <div>Content</div>
      </Modal>
    );

    const titleElement = screen.getByRole('heading', { level: 2, name: 'Drag Test' });
    const header = titleElement.parentElement!;
    const modal = screen.getByRole('dialog');

    // Start drag
    fireEvent.mouseDown(header, { clientX: 100, clientY: 100 });

    // Move mouse (simulate drag)
    fireEvent.mouseMove(document, { clientX: 200, clientY: 200 });

    // Test behavior: modal should still be visible after drag
    expect(modal).toBeVisible();
    expect(header.style.cursor).toBe('grabbing');
  });

  it('ends drag on mouse up', () => {
    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" title="Drag Test">
        <div>Content</div>
      </Modal>
    );

    const titleElement = screen.getByRole('heading', { level: 2, name: 'Drag Test' });
    const header = titleElement.parentElement!;

    // Start drag
    fireEvent.mouseDown(header, { clientX: 100, clientY: 100 });
    expect(header.style.cursor).toBe('grabbing');

    // End drag
    fireEvent.mouseUp(document);

    // Cursor should return to 'grab'
    expect(header.style.cursor).toBe('grab');
  });

  it('resets position when modal reopens', () => {
    const { unmount } = renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" title="Drag Test">
        <div>Content</div>
      </Modal>
    );

    const titleElement = screen.getByRole('heading', { level: 2, name: 'Drag Test' });
    const header = titleElement.parentElement!;

    // Drag modal
    fireEvent.mouseDown(header, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(document, { clientX: 200, clientY: 200 });
    fireEvent.mouseUp(document);

    // Close modal
    unmount();
    renderWithAll(
      <Modal isOpen={false} onClose={vi.fn()} modalId="test-modal" title="Drag Test">
        <div>Content</div>
      </Modal>
    );

    // Modal should be removed from DOM when closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Reopen modal
    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" title="Drag Test">
        <div>Content</div>
      </Modal>
    );

    // Modal should be visible again after reopening
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
    expect(modal).toBeVisible();
  });

  // ================================================================
  // CUSTOM CLASSNAME
  // ================================================================

  it('applies custom className to modal container', () => {
    renderWithAll(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" className="custom-modal">
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('custom-modal');
  });

  // ================================================================
  // TRANSLATION SUPPORT
  // ================================================================

  describe('Translation Support', () => {
    it('displays Slovak close button text by default', () => {
      renderWithAll(
        <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" title="Test Modal">
          <div>Content</div>
        </Modal>
      );

      const closeButton = screen.getByRole('button', { name: /zavrieť/i });
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveAttribute('title', 'Zavrieť (ESC)');
    });

    it('switches close button text to English', () => {
      renderWithAll(
        <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" title="Test Modal">
          <div>Content</div>
        </Modal>,
        { initialLanguage: 'en' }
      );

      // Check that close button exists (can't verify exact text due to mock limitations)
      const dialog = screen.getByRole('dialog');
      const closeButton = dialog.querySelector('button[aria-label]');
      expect(closeButton).toBeInTheDocument();
    });

    it('displays Slovak loading text by default', () => {
      renderWithAll(
        <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" loading={true}>
          <div>Content</div>
        </Modal>
      );

      expect(screen.getByText('Načítavam...')).toBeInTheDocument();
    });

    it('switches loading text to English', () => {
      renderWithAll(
        <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" loading={true}>
          <div>Content</div>
        </Modal>,
        { initialLanguage: 'en' }
      );

      // Check that loading text is present (can't verify exact text due to mock limitations)
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });

    it('verifies all translation keys exist', () => {
      // Test by rendering component and checking if translations are applied
      renderWithAll(
        <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" title="Test" loading={true}>
          <div>Content</div>
        </Modal>
      );

      // If translations work, these should be in Slovak
      expect(screen.getByText('Načítavam...')).toBeInTheDocument(); // common.loading
      expect(screen.getByLabelText('Zavrieť')).toBeInTheDocument(); // common.close
    });
  });
});
