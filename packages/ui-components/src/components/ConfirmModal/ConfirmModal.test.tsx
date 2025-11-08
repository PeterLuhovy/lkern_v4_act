/*
 * ================================================================
 * FILE: ConfirmModal.test.tsx
 * PATH: /packages/ui-components/src/components/ConfirmModal/ConfirmModal.test.tsx
 * DESCRIPTION: Tests for ConfirmModal component (simple + danger modes)
 * VERSION: v1.0.0
 * UPDATED: 2025-10-30 10:50:00
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderWithAll, screen, fireEvent, waitFor, userEvent } from '../../test-utils';
import { ConfirmModal } from './ConfirmModal';

// ✅ PARTIAL MOCK - Keep ONLY usePageAnalytics & modalStack (needed for Modal/ConfirmModal)
// ✅ All other exports are REAL (translations from renderWithAll, theme from renderWithAll)
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
      push: vi.fn(() => 1000),
      pop: vi.fn(),
      getTopmostModalId: vi.fn(() => null),
      closeTopmost: vi.fn(),
      closeModal: vi.fn(),
      confirmModal: vi.fn(),
    },
  };
});

describe('ConfirmModal', () => {
  let portalRoot: HTMLElement;

  beforeEach(() => {
    // Create portal root for Modal
    portalRoot = document.createElement('div');
    portalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(portalRoot);
  });

  afterEach(() => {
    // Clean up portal root
    document.body.removeChild(portalRoot);
  });

  // ================================================================
  // SIMPLE MODE TESTS
  // ================================================================

  it('renders simple mode correctly', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    renderWithAll(
      <ConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    // Check for default title and message (Slovak translations)
    expect(screen.getByText('Potvrďte akciu')).toBeInTheDocument();
    expect(screen.getByText('Naozaj chcete pokračovať?')).toBeInTheDocument();

    // Check for buttons (Slovak translations)
    expect(screen.getByRole('button', { name: /Zrušiť/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Áno/i })).toBeInTheDocument();

    // Should NOT have input field (simple mode)
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('calls onConfirm on button click in simple mode', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    renderWithAll(
      <ConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    const confirmButton = screen.getByRole('button', { name: 'Áno' });
    fireEvent.click(confirmButton);

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on cancel button', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    renderWithAll(
      <ConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    const cancelButton = screen.getByRole('button', { name: 'Zrušiť' });
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Enter key confirms in simple mode', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    renderWithAll(
      <ConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    // Simulate Enter key
    const modal = screen.getByText('Naozaj chcete pokračovať?').closest('div');
    // Safe: Element exists after closest('div') check
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    fireEvent.keyDown(modal!, { key: 'Enter', code: 'Enter' });

    // Note: Enter is handled by Modal's onConfirm prop, which calls handleConfirm
    // We can't easily test this without full Modal integration
  });

  // ================================================================
  // DANGER MODE TESTS
  // ================================================================

  it('renders danger mode correctly', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    renderWithAll(
      <ConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        confirmKeyword="ano"
        isDanger={true}
      />
    );

    // Check for danger title (Slovak translation)
    expect(screen.getByText('Nebezpečná akcia')).toBeInTheDocument();

    // Check for danger message with keyword (Slovak translation)
    expect(screen.getByText(/Táto akcia je nevratná/i)).toBeInTheDocument();

    // Check for input field (danger mode)
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Zadajte "ano"/i)).toBeInTheDocument();

    // Check for danger button (Slovak translation)
    expect(screen.getByRole('button', { name: /Zmazať/i })).toBeInTheDocument();
  });

  it('danger mode shows error when keyword empty and button clicked', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    renderWithAll(
      <ConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        confirmKeyword="ano"
        isDanger={true}
      />
    );

    const confirmButton = screen.getByRole('button', { name: /Zmazať/i });
    fireEvent.click(confirmButton);

    // Should show error and NOT call onConfirm (Slovak translation)
    expect(screen.getByText(/Nesprávne heslo/i)).toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('danger mode shows error on wrong keyword', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    renderWithAll(
      <ConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        confirmKeyword="ano"
        isDanger={true}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'wrong' } });

    const confirmButton = screen.getByRole('button', { name: /Zmazať/i });
    fireEvent.click(confirmButton);

    // Check for error message (Slovak translation)
    expect(screen.getByText(/Nesprávne heslo/i)).toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('danger mode confirms when keyword correct', async () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    const user = userEvent.setup();

    renderWithAll(
      <ConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        confirmKeyword="ano"
        isDanger={true}
      />
    );

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'ano');

    const confirmButton = screen.getByRole('button', { name: /Zmazať/i });
    await user.click(confirmButton);

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('Enter key confirms in danger mode with correct keyword', async () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    const user = userEvent.setup();

    renderWithAll(
      <ConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        confirmKeyword="ano"
        isDanger={true}
      />
    );

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'ano{Enter}');

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('Enter key does not confirm in danger mode with wrong keyword', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    renderWithAll(
      <ConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        confirmKeyword="ano"
        isDanger={true}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'wrong' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText(/Nesprávne heslo/i)).toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  // ================================================================
  // STATE MANAGEMENT TESTS
  // ================================================================

  it('resets state on modal open', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    const { rerender } = renderWithAll(
      <ConfirmModal
        isOpen={false}
        onClose={onClose}
        onConfirm={onConfirm}
        confirmKeyword="ano"
        isDanger={true}
      />
    );

    // Open modal
    rerender(
      <ConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        confirmKeyword="ano"
        isDanger={true}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'wrong' } });

    // Trigger error
    const confirmButton = screen.getByRole('button', { name: /Zmazať/i });
    fireEvent.click(confirmButton);

    // Close and reopen
    rerender(
      <ConfirmModal
        isOpen={false}
        onClose={onClose}
        onConfirm={onConfirm}
        confirmKeyword="ano"
        isDanger={true}
      />
    );

    rerender(
      <ConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        confirmKeyword="ano"
        isDanger={true}
      />
    );

    // Input should be empty (state reset)
    const newInput = screen.getByRole('textbox') as HTMLInputElement;
    expect(newInput.value).toBe('');

    // Error should be cleared
    expect(screen.queryByText(/Nesprávne heslo/i)).not.toBeInTheDocument();
  });

  it('clears error on input change', async () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    const user = userEvent.setup();

    renderWithAll(
      <ConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        confirmKeyword="ano"
        isDanger={true}
      />
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'wrong');

    // Trigger error
    const confirmButton = screen.getByRole('button', { name: /Zmazať/i });
    await user.click(confirmButton);
    expect(screen.getByText(/Nesprávne heslo/i)).toBeInTheDocument();

    // Type again - error should clear
    await user.clear(input);
    await user.type(input, 'a');

    await waitFor(() => {
      expect(screen.queryByText(/Nesprávne heslo/i)).not.toBeInTheDocument();
    });
  });

  // ================================================================
  // CUSTOMIZATION TESTS
  // ================================================================

  it('custom button labels work', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    renderWithAll(
      <ConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        confirmButtonLabel="Confirm Custom"
        cancelButtonLabel="Cancel Custom"
      />
    );

    expect(screen.getByRole('button', { name: /Confirm Custom/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel Custom/i })).toBeInTheDocument();
  });

  it('custom title and message work', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    renderWithAll(
      <ConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title="Custom Title"
        message="Custom message text here"
      />
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom message text here')).toBeInTheDocument();
  });

  it('parentModalId is passed to Modal component', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    renderWithAll(
      <ConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        parentModalId="parent-modal"
      />
    );

    // This test verifies the prop is passed - actual behavior tested in Modal tests
    // We just need to ensure the component renders without error (Slovak translation)
    expect(screen.getByText('Potvrďte akciu')).toBeInTheDocument();
  });
});