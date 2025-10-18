/*
 * ================================================================
 * FILE: Modal.test.tsx
 * PATH: /packages/ui-components/src/components/Modal/Modal.test.tsx
 * DESCRIPTION: Tests for Modal component
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 18:00:00
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Modal } from './Modal';

// Mock useTranslation hook
vi.mock('@l-kern/config', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.loading': 'Loading...',
      };
      return translations[key] || key;
    },
  }),
}));

describe('Modal', () => {
  let portalRoot: HTMLElement;

  beforeEach(() => {
    // Create portal root for tests
    portalRoot = document.createElement('div');
    portalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(portalRoot);
  });

  afterEach(() => {
    // Clean up portal root
    document.body.removeChild(portalRoot);
  });

  // === BASIC RENDERING ===

  it('renders nothing when closed', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('renders modal when open', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
        <div>Content</div>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(
      <Modal
        isOpen={true}
        onClose={vi.fn()}
        footer={<button>Footer Button</button>}
      >
        <div>Content</div>
      </Modal>
    );

    expect(screen.getByText('Footer Button')).toBeInTheDocument();
  });

  // === VARIANTS ===

  it('renders centered variant by default', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('centered');
  });

  it('renders drawer variant', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} variant="drawer">
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('drawer');
  });

  it('renders fullscreen variant', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} variant="fullscreen">
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('fullscreen');
  });

  // === SIZES (CENTERED ONLY) ===

  it('applies medium size by default for centered variant', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} variant="centered">
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('md');
  });

  it('applies small size when specified', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} variant="centered" size="sm">
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('sm');
  });

  it('applies large size when specified', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} variant="centered" size="lg">
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('lg');
  });

  // === CLOSE BUTTON ===

  it('shows close button by default', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test">
        <div>Content</div>
      </Modal>
    );

    expect(screen.getByLabelText('common.buttons.close')).toBeInTheDocument();
  });

  it('hides close button when showCloseButton is false', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test" showCloseButton={false}>
        <div>Content</div>
      </Modal>
    );

    expect(screen.queryByLabelText('common.buttons.close')).not.toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        <div>Content</div>
      </Modal>
    );

    fireEvent.click(screen.getByLabelText('common.buttons.close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // === BACKDROP CLICK ===

  it('calls onClose when backdrop clicked by default', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Content</div>
      </Modal>
    );

    const backdrop = screen.getByRole('dialog').parentElement;
    fireEvent.click(backdrop!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close on backdrop click when closeOnBackdropClick is false', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} closeOnBackdropClick={false}>
        <div>Content</div>
      </Modal>
    );

    const backdrop = screen.getByRole('dialog').parentElement;
    fireEvent.click(backdrop!);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not close when clicking inside modal content', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Modal Content</div>
      </Modal>
    );

    fireEvent.click(screen.getByText('Modal Content'));
    expect(onClose).not.toHaveBeenCalled();
  });

  // === ESC KEY ===

  it('calls onClose when ESC key pressed by default', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Content</div>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close on ESC when closeOnEscape is false', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} closeOnEscape={false}>
        <div>Content</div>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('ignores other keys', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Content</div>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Enter' });
    fireEvent.keyDown(document, { key: 'Space' });
    expect(onClose).not.toHaveBeenCalled();
  });

  // === LOADING STATE ===

  it('shows spinner when loading', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} loading={true}>
        <div>Content</div>
      </Modal>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('hides content when loading', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} loading={true}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  // === ACCESSIBILITY ===

  it('has role="dialog"', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <div>Content</div>
      </Modal>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('has aria-modal="true"', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
  });

  it('has aria-labelledby when title provided', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    const titleId = dialog.getAttribute('aria-labelledby');
    expect(titleId).toBeTruthy();
    expect(screen.getByText('Test Modal').id).toBe(titleId);
  });

  // === CLEANUP ===

  it('removes event listeners on unmount', () => {
    const onClose = vi.fn();
    const { unmount } = render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Content</div>
      </Modal>
    );

    unmount();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('cleans up when modal closes', async () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Content</div>
      </Modal>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();

    rerender(
      <Modal isOpen={false} onClose={onClose}>
        <div>Content</div>
      </Modal>
    );

    await waitFor(() => {
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });
  });
});
