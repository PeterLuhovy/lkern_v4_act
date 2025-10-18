/*
 * ================================================================
 * FILE: Modal.test.tsx
 * PATH: /packages/ui-components/src/components/Modal/Modal.test.tsx
 * DESCRIPTION: Tests for Modal component v3.0.0 (with enhanced features)
 * VERSION: v3.0.0
 * UPDATED: 2025-10-18 23:30:00
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Modal, ModalFooterConfig } from './Modal';

// Mock modalStack
const mockModalStack = {
  push: vi.fn((modalId: string, parentModalId?: string, onClose?: () => void) => {
    // Return z-index based on stack depth
    return parentModalId ? 1010 : 1000;
  }),
  pop: vi.fn(),
  getTopmostModalId: vi.fn(() => null),
  closeTopmost: vi.fn(),
  closeModal: vi.fn(),
};

// Mock useTranslation hook and modalStack
vi.mock('@l-kern/config', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.loading': 'Loading...',
        'common.close': 'Close',
      };
      return translations[key] || key;
    },
  }),
  modalStack: mockModalStack,
}));

describe('Modal v3.0.0', () => {
  let portalRoot: HTMLElement;

  beforeEach(() => {
    // Create portal root for tests
    portalRoot = document.createElement('div');
    portalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(portalRoot);

    // Reset mock calls
    mockModalStack.push.mockClear();
    mockModalStack.pop.mockClear();
  });

  afterEach(() => {
    // Clean up portal root
    document.body.removeChild(portalRoot);
  });

  // ================================================================
  // BASIC RENDERING
  // ================================================================

  it('renders nothing when closed', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} modalId="test-modal">
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('renders modal when open', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal">
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" title="Test Modal">
        <div>Content</div>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });

  it('renders simple footer when provided as ReactNode', () => {
    render(
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
    render(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal">
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('md');
  });

  it('applies small size when specified', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" size="sm">
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('sm');
  });

  it('applies large size when specified', () => {
    render(
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
    render(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" title="Test">
        <div>Content</div>
      </Modal>
    );

    expect(screen.getByLabelText('Close')).toBeInTheDocument();
  });

  it('hides close button when showCloseButton is false', () => {
    render(
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

    expect(screen.queryByLabelText('Close')).not.toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} modalId="test-modal" title="Test">
        <div>Content</div>
      </Modal>
    );

    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // ================================================================
  // BACKDROP CLICK
  // ================================================================

  it('does not close on backdrop click by default (closeOnBackdropClick=false)', () => {
    const onClose = vi.fn();
    render(
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
    render(
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
    render(
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
    render(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" loading={true}>
        <div>Content</div>
      </Modal>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('hides content when loading', () => {
    render(
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
    render(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal">
        <div>Content</div>
      </Modal>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('has aria-modal="true"', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal">
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
  });

  it('has aria-labelledby when title provided', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" title="Test Modal">
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    const titleId = dialog.getAttribute('aria-labelledby');
    expect(titleId).toBeTruthy();
    expect(screen.getByText('Test Modal').id).toBe(titleId);
  });

  // ================================================================
  // CLEANUP
  // ================================================================

  it('cleans up when modal closes', async () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Modal isOpen={true} onClose={onClose} modalId="test-modal">
        <div>Content</div>
      </Modal>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();

    rerender(
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
    render(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal">
        <div>Content</div>
      </Modal>
    );

    expect(mockModalStack.push).toHaveBeenCalledWith('test-modal', undefined, expect.any(Function));
  });

  it('unregisters from modalStack when closed', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal">
        <div>Content</div>
      </Modal>
    );

    mockModalStack.pop.mockClear();

    rerender(
      <Modal isOpen={false} onClose={vi.fn()} modalId="test-modal">
        <div>Content</div>
      </Modal>
    );

    expect(mockModalStack.pop).toHaveBeenCalledWith('test-modal');
  });

  it('registers nested modal with parentModalId', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} modalId="child-modal" parentModalId="parent-modal">
        <div>Child Content</div>
      </Modal>
    );

    expect(mockModalStack.push).toHaveBeenCalledWith(
      'child-modal',
      'parent-modal',
      expect.any(Function)
    );
  });

  it('applies higher z-index for nested modal', () => {
    mockModalStack.push.mockReturnValueOnce(1010);

    render(
      <Modal isOpen={true} onClose={vi.fn()} modalId="child-modal" parentModalId="parent-modal">
        <div>Child Content</div>
      </Modal>
    );

    const overlay = screen.getByRole('dialog').parentElement;
    expect(overlay?.style.zIndex).toBe('1010');
  });

  it('respects zIndexOverride when provided', () => {
    render(
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

    render(
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

    render(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" footer={footerConfig}>
        <div>Content</div>
      </Modal>
    );

    expect(screen.getByTestId('cancel-btn')).toBeInTheDocument();
    expect(screen.getByTestId('save-btn')).toBeInTheDocument();
  });

  it('renders enhanced footer with error message', () => {
    const footerConfig: ModalFooterConfig = {
      errorMessage: 'Please fix validation errors',
    };

    render(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" footer={footerConfig}>
        <div>Content</div>
      </Modal>
    );

    expect(screen.getByText('Please fix validation errors')).toBeInTheDocument();
  });

  it('renders complete enhanced footer with left, right, and error', () => {
    const footerConfig: ModalFooterConfig = {
      left: <button data-testid="delete-btn">Delete</button>,
      right: <button data-testid="save-btn">Save</button>,
      errorMessage: 'Validation failed',
    };

    render(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" footer={footerConfig}>
        <div>Content</div>
      </Modal>
    );

    expect(screen.getByTestId('delete-btn')).toBeInTheDocument();
    expect(screen.getByTestId('save-btn')).toBeInTheDocument();
    expect(screen.getByText('Validation failed')).toBeInTheDocument();
  });

  it('renders simple footer when not ModalFooterConfig', () => {
    render(
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
    render(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal">
        <div>Content</div>
      </Modal>
    );

    const overlay = screen.getByRole('dialog').parentElement;
    expect(overlay?.style.alignItems).toBe('center');
  });

  it('applies top alignment when specified', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" alignment="top">
        <div>Content</div>
      </Modal>
    );

    const overlay = screen.getByRole('dialog').parentElement;
    expect(overlay?.style.alignItems).toBe('flex-start');
  });

  it('applies bottom alignment when specified', () => {
    render(
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
    render(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal">
        <div>Content</div>
      </Modal>
    );

    const overlay = screen.getByRole('dialog').parentElement;
    expect(overlay?.style.padding).toBe('64px');
  });

  it('applies custom overlay padding when specified', () => {
    render(
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
    render(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" title="Draggable Modal">
        <div>Content</div>
      </Modal>
    );

    const header = screen.getByText('Draggable Modal').parentElement;
    expect(header?.style.cursor).toBe('grab');
  });

  it('has default cursor on header when disableDrag is true', () => {
    render(
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

    const header = screen.getByText('Non-Draggable Modal').parentElement;
    expect(header?.style.cursor).toBe('default');
  });

  it('changes cursor to grabbing during drag', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" title="Drag Test">
        <div>Content</div>
      </Modal>
    );

    const header = screen.getByText('Drag Test').parentElement!;

    // Start drag
    fireEvent.mouseDown(header, { clientX: 100, clientY: 100 });

    expect(header.style.cursor).toBe('grabbing');
  });

  it('does not start drag from close button', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" title="Drag Test">
        <div>Content</div>
      </Modal>
    );

    const closeButton = screen.getByLabelText('Close');
    const header = screen.getByText('Drag Test').parentElement!;

    // Try to start drag from close button
    fireEvent.mouseDown(closeButton, { clientX: 100, clientY: 100 });

    // Cursor should still be 'grab' (not 'grabbing')
    expect(header.style.cursor).toBe('grab');
  });

  it('modal is centered on initial open', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" title="Test">
        <div>Content</div>
      </Modal>
    );

    const modal = screen.getByRole('dialog');
    expect(modal.style.left).toBe('50%');
    expect(modal.style.top).toBe('50%');
    expect(modal.style.transform).toBe('translate(-50%, -50%)');
  });

  it('updates position during drag', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" title="Drag Test">
        <div>Content</div>
      </Modal>
    );

    const header = screen.getByText('Drag Test').parentElement!;
    const modal = screen.getByRole('dialog');

    // Start drag
    fireEvent.mouseDown(header, { clientX: 100, clientY: 100 });

    // Move mouse (simulate drag)
    fireEvent.mouseMove(document, { clientX: 200, clientY: 200 });

    // Position should be absolute (no longer centered)
    expect(modal.style.transform).toBe('none');
  });

  it('ends drag on mouse up', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" title="Drag Test">
        <div>Content</div>
      </Modal>
    );

    const header = screen.getByText('Drag Test').parentElement!;

    // Start drag
    fireEvent.mouseDown(header, { clientX: 100, clientY: 100 });
    expect(header.style.cursor).toBe('grabbing');

    // End drag
    fireEvent.mouseUp(document);

    // Cursor should return to 'grab'
    expect(header.style.cursor).toBe('grab');
  });

  it('resets position when modal reopens', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" title="Drag Test">
        <div>Content</div>
      </Modal>
    );

    const header = screen.getByText('Drag Test').parentElement!;

    // Drag modal
    fireEvent.mouseDown(header, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(document, { clientX: 200, clientY: 200 });
    fireEvent.mouseUp(document);

    // Close modal
    rerender(
      <Modal isOpen={false} onClose={vi.fn()} modalId="test-modal" title="Drag Test">
        <div>Content</div>
      </Modal>
    );

    // Reopen modal
    rerender(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" title="Drag Test">
        <div>Content</div>
      </Modal>
    );

    // Position should be centered again
    const modal = screen.getByRole('dialog');
    expect(modal.style.left).toBe('50%');
    expect(modal.style.top).toBe('50%');
    expect(modal.style.transform).toBe('translate(-50%, -50%)');
  });

  // ================================================================
  // CUSTOM CLASSNAME
  // ================================================================

  it('applies custom className to modal container', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} modalId="test-modal" className="custom-modal">
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('custom-modal');
  });
});
