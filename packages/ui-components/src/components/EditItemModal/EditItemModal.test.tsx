/*
 * ================================================================
 * FILE: EditItemModal.test.tsx
 * PATH: /packages/ui-components/src/components/EditItemModal/EditItemModal.test.tsx
 * DESCRIPTION: Tests for EditItemModal component v1.0.0
 * VERSION: v1.0.0
 * UPDATED: 2025-10-30 23:45:00
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderWithAll, screen, fireEvent, waitFor } from '../../test-utils';
import { EditItemModal } from './EditItemModal';

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

describe('EditItemModal v1.0.0', () => {
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

  it('renders modal when open', () => {
    renderWithAll(
      <EditItemModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        title="Test Edit Modal"
        modalId="test-modal"
      >
        <div>Modal Content</div>
      </EditItemModal>
    );

    expect(screen.getByText('Test Edit Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('renders nothing when closed', () => {
    renderWithAll(
      <EditItemModal
        isOpen={false}
        onClose={vi.fn()}
        onSave={vi.fn()}
        title="Test Modal"
        modalId="test-modal"
      >
        <div>Modal Content</div>
      </EditItemModal>
    );

    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  // ================================================================
  // FOOTER BUTTONS
  // ================================================================

  it('renders save button by default', () => {
    renderWithAll(
      <EditItemModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        title="Test"
        modalId="test-modal"
      >
        <div>Content</div>
      </EditItemModal>
    );

    expect(screen.getByTestId('edit-item-modal-save')).toBeInTheDocument();
  });

  it('renders cancel button by default', () => {
    renderWithAll(
      <EditItemModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        title="Test"
        modalId="test-modal"
      >
        <div>Content</div>
      </EditItemModal>
    );

    expect(screen.getByTestId('edit-item-modal-cancel')).toBeInTheDocument();
  });

  it('calls onSave when save button clicked', () => {
    const handleSave = vi.fn();
    renderWithAll(
      <EditItemModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={handleSave}
        title="Test"
        modalId="test-modal"
      >
        <div>Content</div>
      </EditItemModal>
    );

    fireEvent.click(screen.getByTestId('edit-item-modal-save'));
    expect(handleSave).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when cancel button clicked', () => {
    const handleClose = vi.fn();
    renderWithAll(
      <EditItemModal
        isOpen={true}
        onClose={handleClose}
        onSave={vi.fn()}
        title="Test"
        modalId="test-modal"
      >
        <div>Content</div>
      </EditItemModal>
    );

    fireEvent.click(screen.getByTestId('edit-item-modal-cancel'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  // ================================================================
  // SAVE BUTTON DISABLED STATE
  // ================================================================

  it('disables save button when saveDisabled is true', () => {
    renderWithAll(
      <EditItemModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        title="Test"
        modalId="test-modal"
        saveDisabled={true}
      >
        <div>Content</div>
      </EditItemModal>
    );

    const saveButton = screen.getByTestId('edit-item-modal-save');
    expect(saveButton).toBeDisabled();
  });

  it('enables save button when saveDisabled is false', () => {
    renderWithAll(
      <EditItemModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        title="Test"
        modalId="test-modal"
        saveDisabled={false}
      >
        <div>Content</div>
      </EditItemModal>
    );

    const saveButton = screen.getByTestId('edit-item-modal-save');
    expect(saveButton).not.toBeDisabled();
  });

  // ================================================================
  // CLEAR BUTTON
  // ================================================================

  it('does not show clear button by default', () => {
    renderWithAll(
      <EditItemModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        title="Test"
        modalId="test-modal"
      >
        <div>Content</div>
      </EditItemModal>
    );

    expect(screen.queryByTestId('edit-item-modal-clear')).not.toBeInTheDocument();
  });

  it('shows clear button when showClearButton is true', () => {
    renderWithAll(
      <EditItemModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        title="Test"
        modalId="test-modal"
        showClearButton={true}
        onClear={vi.fn()}
      >
        <div>Content</div>
      </EditItemModal>
    );

    expect(screen.getByTestId('edit-item-modal-clear')).toBeInTheDocument();
  });

  it('shows clear confirmation modal when clear button clicked', async () => {
    renderWithAll(
      <EditItemModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        title="Test"
        modalId="test-modal"
        showClearButton={true}
        onClear={vi.fn()}
      >
        <div>Content</div>
      </EditItemModal>
    );

    // Click clear button
    fireEvent.click(screen.getByTestId('edit-item-modal-clear'));

    // Wait for confirmation modal to appear
    await waitFor(() => {
      // Slovak translation: "Vyčistiť formulár?" (title of confirmation modal)
      const modals = screen.getAllByRole('dialog');
      expect(modals.length).toBeGreaterThan(1); // Main modal + confirmation modal
    });
  });

  it('calls onClear when clear is confirmed', async () => {
    const handleClear = vi.fn();
    renderWithAll(
      <EditItemModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        title="Test Modal"
        modalId="test-modal"
        showClearButton={true}
        onClear={handleClear}
      >
        <div>Content</div>
      </EditItemModal>
    );

    // Click clear button
    const clearButton = screen.getByTestId('edit-item-modal-clear');
    fireEvent.click(clearButton);

    // Wait for confirmation modal to appear (check for 2 modals)
    await waitFor(() => {
      const modals = screen.getAllByRole('dialog');
      expect(modals.length).toBe(2); // Main modal + confirmation modal
    });

    // Find all buttons and filter by text content
    const allButtons = screen.getAllByRole('button');
    // Slovak "Vyčistiť" button in confirmation modal
    const confirmButton = allButtons.find(btn =>
      btn.textContent === 'Vyčistiť' &&
      btn.getAttribute('data-testid') !== 'edit-item-modal-clear'
    );

    expect(confirmButton).toBeTruthy();

    if (confirmButton) {
      fireEvent.click(confirmButton);
    }

    // Wait for onClear to be called
    await waitFor(() => {
      expect(handleClear).toHaveBeenCalledTimes(1);
    }, { timeout: 3000 });
  });

  // ================================================================
  // UNSAVED CHANGES DETECTION
  // ================================================================

  it('closes immediately when no unsaved changes', () => {
    const handleClose = vi.fn();
    renderWithAll(
      <EditItemModal
        isOpen={true}
        onClose={handleClose}
        onSave={vi.fn()}
        title="Test"
        modalId="test-modal"
        hasUnsavedChanges={false}
      >
        <div>Content</div>
      </EditItemModal>
    );

    fireEvent.click(screen.getByTestId('edit-item-modal-cancel'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('shows unsaved changes confirmation when hasUnsavedChanges is true', async () => {
    renderWithAll(
      <EditItemModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        title="Test"
        modalId="test-modal"
        hasUnsavedChanges={true}
      >
        <div>Content</div>
      </EditItemModal>
    );

    // Click cancel button
    fireEvent.click(screen.getByTestId('edit-item-modal-cancel'));

    // Wait for unsaved changes confirmation modal (nested modal)
    await waitFor(() => {
      const dialogs = screen.getAllByRole('dialog');
      expect(dialogs.length).toBeGreaterThan(1); // Main modal + ConfirmModal
    });
  });

  it('closes when unsaved changes confirmed', async () => {
    const handleClose = vi.fn();
    renderWithAll(
      <EditItemModal
        isOpen={true}
        onClose={handleClose}
        onSave={vi.fn()}
        title="Test"
        modalId="test-modal"
        hasUnsavedChanges={true}
      >
        <div>Content</div>
      </EditItemModal>
    );

    // Click cancel button
    fireEvent.click(screen.getByTestId('edit-item-modal-cancel'));

    // Wait for confirmation modal (nested modal)
    await waitFor(() => {
      const dialogs = screen.getAllByRole('dialog');
      expect(dialogs.length).toBeGreaterThan(1);
    });

    // Find and click confirm button ("Áno" = Yes in Slovak)
    const confirmButtons = screen.getAllByRole('button');
    const closeButton = confirmButtons.find(btn => btn.textContent?.includes('Áno'));
    expect(closeButton).toBeTruthy();

    if (closeButton) {
      fireEvent.click(closeButton);
    }

    // onClose should be called
    await waitFor(() => {
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  // ================================================================
  // CUSTOM BUTTON TEXT
  // ================================================================

  it('uses custom save button text when provided', () => {
    renderWithAll(
      <EditItemModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        title="Test"
        modalId="test-modal"
        saveText="Custom Save"
      >
        <div>Content</div>
      </EditItemModal>
    );

    expect(screen.getByText('Custom Save')).toBeInTheDocument();
  });

  it('uses custom cancel button text when provided', () => {
    renderWithAll(
      <EditItemModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        title="Test"
        modalId="test-modal"
        cancelText="Custom Cancel"
      >
        <div>Content</div>
      </EditItemModal>
    );

    expect(screen.getByText('Custom Cancel')).toBeInTheDocument();
  });

  it('uses custom clear button text when provided', () => {
    renderWithAll(
      <EditItemModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        title="Test"
        modalId="test-modal"
        showClearButton={true}
        onClear={vi.fn()}
        clearButtonText="Custom Clear"
      >
        <div>Content</div>
      </EditItemModal>
    );

    expect(screen.getByText('Custom Clear')).toBeInTheDocument();
  });

  // ================================================================
  // TRANSLATION SUPPORT
  // ================================================================

  describe('Translation Support', () => {
    it('displays Slovak button text by default', () => {
      renderWithAll(
        <EditItemModal
          isOpen={true}
          onClose={vi.fn()}
          onSave={vi.fn()}
          title="Test Modal"
          modalId="test-modal"
        >
          <div>Content</div>
        </EditItemModal>
      );

      // Slovak default buttons
      expect(screen.getByText('Uložiť')).toBeInTheDocument(); // Save
      expect(screen.getByText('Zrušiť')).toBeInTheDocument(); // Cancel
    });

    it('buttons use translation system', () => {
      // ✅ Test that buttons render with expected testids (language-independent)
      renderWithAll(
        <EditItemModal
          isOpen={true}
          onClose={vi.fn()}
          onSave={vi.fn()}
          title="Test Modal"
          modalId="test-modal"
        >
          <div>Content</div>
        </EditItemModal>
      );

      // Verify buttons exist by testid (works in any language)
      expect(screen.getByTestId('edit-item-modal-save')).toBeInTheDocument();
      expect(screen.getByTestId('edit-item-modal-cancel')).toBeInTheDocument();

      // Verify buttons have text content (from translation system)
      const saveButton = screen.getByTestId('edit-item-modal-save');
      const cancelButton = screen.getByTestId('edit-item-modal-cancel');
      expect(saveButton.textContent).toBeTruthy();
      expect(cancelButton.textContent).toBeTruthy();
    });
  });
});
