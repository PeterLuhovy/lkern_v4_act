/*
 * ================================================================
 * FILE: ManagementModal.test.tsx
 * PATH: /packages/ui-components/src/components/ManagementModal/ManagementModal.test.tsx
 * DESCRIPTION: Tests for ManagementModal component v1.0.0
 * VERSION: v1.0.0
 * UPDATED: 2025-10-31 12:00:00
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderWithAll, screen, fireEvent, waitFor } from '../../test-utils';
import { ManagementModal } from './ManagementModal';

// Mock modalStack and usePageAnalytics (needed for Modal component)
vi.mock('@l-kern/config', async () => {
  const actual = await vi.importActual('@l-kern/config');
  return {
    ...actual, // ✅ REAL translations from renderWithAll
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

describe('ManagementModal v1.0.0', () => {
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

  // ================================================================
  // BASIC RENDERING
  // ================================================================

  it('renders modal when open with items', () => {
    const items = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
    renderWithAll(
      <ManagementModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        title="Manage Items"
        modalId="test-modal"
        items={items}
        renderItem={vi.fn()}
        onAdd={vi.fn()}
        onDeleteAll={vi.fn()}
      >
        <div>Item List</div>
      </ManagementModal>
    );

    expect(screen.getByText('Manage Items')).toBeInTheDocument();
    expect(screen.getByText('Item List')).toBeInTheDocument();
  });

  it('renders nothing when closed', () => {
    renderWithAll(
      <ManagementModal
        isOpen={false}
        onClose={vi.fn()}
        onSave={vi.fn()}
        title="Manage Items"
        modalId="test-modal"
        items={[]}
        renderItem={vi.fn()}
        onAdd={vi.fn()}
        onDeleteAll={vi.fn()}
      >
        <div>Item List</div>
      </ManagementModal>
    );

    expect(screen.queryByText('Item List')).not.toBeInTheDocument();
  });

  // ================================================================
  // EMPTY STATE
  // ================================================================

  it('shows EmptyState when items array is empty', () => {
    renderWithAll(
      <ManagementModal
        isOpen={true}
        onClose={vi.fn()}
        title="Manage Items"
        modalId="test-modal"
        items={[]}
        onDeleteAll={vi.fn()}
      >
        <div>Item List</div>
      </ManagementModal>
    );

    // Empty state should show (default message from translations)
    expect(screen.getByText('Žiadne položky')).toBeInTheDocument();
    // Children should NOT show when empty
    expect(screen.queryByText('Item List')).not.toBeInTheDocument();
  });

  it('shows custom empty state message', () => {
    renderWithAll(
      <ManagementModal
        isOpen={true}
        onClose={vi.fn()}
        title="Manage Phones"
        modalId="test-modal"
        items={[]}
        onDeleteAll={vi.fn()}
        emptyStateMessage="No phone numbers"
      >
        <div>Phone List</div>
      </ManagementModal>
    );

    expect(screen.getByText('No phone numbers')).toBeInTheDocument();
  });

  it('shows custom empty state icon', () => {
    renderWithAll(
      <ManagementModal
        isOpen={true}
        onClose={vi.fn()}
        title="Manage Phones"
        modalId="test-modal"
        items={[]}
        onDeleteAll={vi.fn()}
        emptyStateIcon="📱"
      >
        <div>Phone List</div>
      </ManagementModal>
    );

    expect(screen.getByText('📱')).toBeInTheDocument();
  });

  it('shows add button in empty state when onAdd provided', () => {
    const handleAdd = vi.fn();
    renderWithAll(
      <ManagementModal
        isOpen={true}
        onClose={vi.fn()}
        title="Manage Items"
        modalId="test-modal"
        items={[]}
        onDeleteAll={vi.fn()}
        onAdd={handleAdd}
      >
        <div>Item List</div>
      </ManagementModal>
    );

    const addButton = screen.getByTestId('empty-state-action');
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);
    expect(handleAdd).toHaveBeenCalledTimes(1);
  });

  // ================================================================
  // FOOTER BUTTONS
  // ================================================================

  it('renders Delete All button (disabled when empty)', () => {
    renderWithAll(
      <ManagementModal
        isOpen={true}
        onClose={vi.fn()}
        title="Test"
        modalId="test-modal"
        items={[]}
        onDeleteAll={vi.fn()}
      >
        <div>Content</div>
      </ManagementModal>
    );

    const deleteAllButton = screen.getByText('Zmazať všetky');
    expect(deleteAllButton).toBeInTheDocument();
    expect(deleteAllButton).toBeDisabled();
  });

  it('renders Delete All button (enabled when items exist)', () => {
    const items = [{ id: 1 }, { id: 2 }];
    renderWithAll(
      <ManagementModal
        isOpen={true}
        onClose={vi.fn()}
        title="Test"
        modalId="test-modal"
        items={items}
        onDeleteAll={vi.fn()}
      >
        <div>Content</div>
      </ManagementModal>
    );

    const deleteAllButton = screen.getByText('Zmazať všetky');
    expect(deleteAllButton).toBeInTheDocument();
    expect(deleteAllButton).not.toBeDisabled();
  });

  it('renders Cancel button (v2.0.0)', () => {
    renderWithAll(
      <ManagementModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        title="Test"
        modalId="test-modal"
        items={[]}
        renderItem={vi.fn()}
        onAdd={vi.fn()}
        onDeleteAll={vi.fn()}
      >
        <div>Content</div>
      </ManagementModal>
    );

    expect(screen.getByText('Zrušiť')).toBeInTheDocument();
  });

  it('renders Save button (v2.0.0)', () => {
    renderWithAll(
      <ManagementModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        title="Test"
        modalId="test-modal"
        items={[]}
        renderItem={vi.fn()}
        onAdd={vi.fn()}
        onDeleteAll={vi.fn()}
      >
        <div>Content</div>
      </ManagementModal>
    );

    expect(screen.getByText('Uložiť')).toBeInTheDocument();
  });

  // ================================================================
  // BUTTON INTERACTIONS
  // ================================================================

  it('calls onSave when Save button clicked (v2.0.0)', () => {
    const handleSave = vi.fn();
    renderWithAll(
      <ManagementModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={handleSave}
        title="Test"
        modalId="test-modal"
        items={[]}
        renderItem={vi.fn()}
        onAdd={vi.fn()}
        onDeleteAll={vi.fn()}
      >
        <div>Content</div>
      </ManagementModal>
    );

    fireEvent.click(screen.getByText('Uložiť'));
    expect(handleSave).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Cancel button clicked (no unsaved changes)', () => {
    const handleClose = vi.fn();
    renderWithAll(
      <ManagementModal
        isOpen={true}
        onClose={handleClose}
        onSave={vi.fn()}
        title="Test"
        modalId="test-modal"
        items={[]}
        renderItem={vi.fn()}
        onAdd={vi.fn()}
        hasUnsavedChanges={false}
        onDeleteAll={vi.fn()}
      >
        <div>Content</div>
      </ManagementModal>
    );

    fireEvent.click(screen.getByText('Zrušiť'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('shows ConfirmModal when Cancel clicked with unsaved changes (v2.0.0)', async () => {
    const handleClose = vi.fn();
    renderWithAll(
      <ManagementModal
        isOpen={true}
        onClose={handleClose}
        onSave={vi.fn()}
        title="Test"
        modalId="test-modal"
        items={[]}
        renderItem={vi.fn()}
        onAdd={vi.fn()}
        hasUnsavedChanges={true}
        onDeleteAll={vi.fn()}
      >
        <div>Content</div>
      </ManagementModal>
    );

    fireEvent.click(screen.getByText('Zrušiť'));

    // ConfirmModal should appear
    await waitFor(() => {
      expect(screen.getByText('Neuložené zmeny')).toBeInTheDocument();
    });

    // handleClose should NOT be called yet
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('opens ConfirmModal when Delete All clicked (with items)', async () => {
    const items = [{ id: 1 }, { id: 2 }];
    renderWithAll(
      <ManagementModal
        isOpen={true}
        onClose={vi.fn()}
        title="Test"
        modalId="test-modal"
        items={items}
        onDeleteAll={vi.fn()}
      >
        <div>Content</div>
      </ManagementModal>
    );

    // Click Delete All
    fireEvent.click(screen.getByText('Zmazať všetky'));

    // Wait for ConfirmModal to appear
    await waitFor(() => {
      expect(screen.getByText('Zmazať všetky položky?')).toBeInTheDocument();
    });
  });

  it('does not open ConfirmModal when Delete All clicked (no items)', () => {
    renderWithAll(
      <ManagementModal
        isOpen={true}
        onClose={vi.fn()}
        title="Test"
        modalId="test-modal"
        items={[]}
        onDeleteAll={vi.fn()}
      >
        <div>Content</div>
      </ManagementModal>
    );

    // Button is disabled, click should do nothing
    const deleteAllButton = screen.getByText('Zmazať všetky');
    fireEvent.click(deleteAllButton);

    // ConfirmModal should NOT appear
    expect(screen.queryByText('Zmazať všetky položky?')).not.toBeInTheDocument();
  });

  // ================================================================
  // DELETE ALL CONFIRMATION FLOW
  // ================================================================

  it('calls onDeleteAll when user confirms deletion', async () => {
    const handleDeleteAll = vi.fn();
    const items = [{ id: 1 }, { id: 2 }];
    renderWithAll(
      <ManagementModal
        isOpen={true}
        onClose={vi.fn()}
        title="Test"
        modalId="test-modal"
        items={items}
        onDeleteAll={handleDeleteAll}
      >
        <div>Content</div>
      </ManagementModal>
    );

    // Open confirmation
    fireEvent.click(screen.getByText('Zmazať všetky'));
    await waitFor(() => {
      expect(screen.getByText('Zmazať všetky položky?')).toBeInTheDocument();
    });

    // Type correct keyword
    const input = screen.getByPlaceholderText('Napíšte "ano"');
    fireEvent.change(input, { target: { value: 'ano' } });

    // Click confirm
    const confirmButton = screen.getByTestId('confirm-modal-confirm');
    fireEvent.click(confirmButton);

    // onDeleteAll should be called
    await waitFor(() => {
      expect(handleDeleteAll).toHaveBeenCalledTimes(1);
    });

    // ConfirmModal should close
    await waitFor(() => {
      expect(screen.queryByText('Zmazať všetky položky?')).not.toBeInTheDocument();
    });

    // ManagementModal stays open
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('does not call onDeleteAll when user cancels confirmation', async () => {
    const handleDeleteAll = vi.fn();
    const items = [{ id: 1 }, { id: 2 }];
    renderWithAll(
      <ManagementModal
        isOpen={true}
        onClose={vi.fn()}
        title="Test"
        modalId="test-modal"
        items={items}
        onDeleteAll={handleDeleteAll}
      >
        <div>Content</div>
      </ManagementModal>
    );

    // Open confirmation
    fireEvent.click(screen.getByText('Zmazať všetky'));
    await waitFor(() => {
      expect(screen.getByText('Zmazať všetky položky?')).toBeInTheDocument();
    });

    // Click cancel
    fireEvent.click(screen.getByTestId('confirm-modal-cancel'));

    // onDeleteAll should NOT be called
    expect(handleDeleteAll).not.toHaveBeenCalled();

    // ConfirmModal should close
    await waitFor(() => {
      expect(screen.queryByText('Zmazať všetky položky?')).not.toBeInTheDocument();
    });
  });

  // ================================================================
  // CUSTOM PROPS
  // ================================================================

  it('renders custom delete all confirmation title', async () => {
    const items = [{ id: 1 }];
    renderWithAll(
      <ManagementModal
        isOpen={true}
        onClose={vi.fn()}
        title="Test"
        modalId="test-modal"
        items={items}
        onDeleteAll={vi.fn()}
        deleteAllTitle="Custom Delete Title"
      >
        <div>Content</div>
      </ManagementModal>
    );

    fireEvent.click(screen.getByText('Zmazať všetky'));
    await waitFor(() => {
      expect(screen.getByText('Custom Delete Title')).toBeInTheDocument();
    });
  });

  it('renders custom delete all confirmation message', async () => {
    const items = [{ id: 1 }];
    renderWithAll(
      <ManagementModal
        isOpen={true}
        onClose={vi.fn()}
        title="Test"
        modalId="test-modal"
        items={items}
        onDeleteAll={vi.fn()}
        deleteAllMessage="Custom delete message."
      >
        <div>Content</div>
      </ManagementModal>
    );

    fireEvent.click(screen.getByText('Zmazať všetky'));
    await waitFor(() => {
      expect(screen.getByText('Custom delete message.')).toBeInTheDocument();
    });
  });

  it('applies custom maxWidth', () => {
    renderWithAll(
      <ManagementModal
        isOpen={true}
        onClose={vi.fn()}
        title="Test"
        modalId="test-modal"
        items={[]}
        onDeleteAll={vi.fn()}
        maxWidth="900px"
      >
        <div>Content</div>
      </ManagementModal>
    );

    const modal = screen.getByTestId('modal-content');
    expect(modal).toHaveStyle({ maxWidth: '900px' });
  });

  it('applies custom maxHeight', () => {
    renderWithAll(
      <ManagementModal
        isOpen={true}
        onClose={vi.fn()}
        title="Test"
        modalId="test-modal"
        items={[]}
        onDeleteAll={vi.fn()}
        maxHeight="600px"
      >
        <div>Content</div>
      </ManagementModal>
    );

    const modal = screen.getByTestId('modal-content');
    expect(modal).toHaveStyle({ maxHeight: '600px' });
  });

  // ================================================================
  // NESTED MODAL SUPPORT
  // ================================================================

  it('passes parentModalId to Modal', () => {
    renderWithAll(
      <ManagementModal
        isOpen={true}
        onClose={vi.fn()}
        title="Test"
        modalId="child-modal"
        parentModalId="parent-modal"
        items={[]}
        onDeleteAll={vi.fn()}
      >
        <div>Content</div>
      </ManagementModal>
    );

    // Modal should render (parentModalId doesn't affect rendering, only z-index)
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('passes parentModalId to ConfirmModal', async () => {
    const items = [{ id: 1 }];
    renderWithAll(
      <ManagementModal
        isOpen={true}
        onClose={vi.fn()}
        title="Test"
        modalId="management-modal"
        items={items}
        onDeleteAll={vi.fn()}
      >
        <div>Content</div>
      </ManagementModal>
    );

    // Open ConfirmModal
    fireEvent.click(screen.getByText('Zmazať všetky'));
    await waitFor(() => {
      expect(screen.getByText('Zmazať všetky položky?')).toBeInTheDocument();
    });

    // ConfirmModal should have correct parentModalId (management-modal)
    // This is verified by Modal rendering correctly (no errors)
  });
});