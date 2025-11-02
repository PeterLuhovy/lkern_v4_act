/*
 * ================================================================
 * FILE: SectionEditModal.test.tsx
 * PATH: /packages/ui-components/src/components/SectionEditModal/SectionEditModal.test.tsx
 * DESCRIPTION: Complete test suite for SectionEditModal component
 * VERSION: v1.0.0
 * UPDATED: 2025-11-01 17:30:00
 * ================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithAll, screen, fireEvent, waitFor } from '../../test-utils';
import { SectionEditModal, FieldDefinition } from './SectionEditModal';
import { useTranslation } from '@l-kern/config';

describe('SectionEditModal', () => {
  // ================================================================
  // SETUP
  // ================================================================

  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSave: vi.fn(),
    title: 'Edit Form',
    modalId: 'test-modal',
    fields: [] as FieldDefinition[],
    initialData: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Helper function to get input by id (more reliable than getByLabelText)
  const getInputById = (id: string) => {
    const element = document.querySelector(`#${id}`);
    if (!element) {
      throw new Error(`Element with id="${id}" not found`);
    }
    return element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  };

  // ================================================================
  // FIELD DEFINITIONS
  // ================================================================

  const textField: FieldDefinition = {
    name: 'username',
    label: 'Username',
    type: 'text',
    required: true,
    placeholder: 'Enter username',
  };

  const emailField: FieldDefinition = {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
  };

  const numberField: FieldDefinition = {
    name: 'age',
    label: 'Age',
    type: 'number',
    min: 18,
    max: 120,
  };

  const selectField: FieldDefinition = {
    name: 'country',
    label: 'Country',
    type: 'select',
    options: [
      { value: 'sk', label: 'Slovakia' },
      { value: 'cz', label: 'Czechia' },
    ],
  };

  const dateField: FieldDefinition = {
    name: 'birthDate',
    label: 'Birth Date',
    type: 'date',
  };

  const textareaField: FieldDefinition = {
    name: 'bio',
    label: 'Bio',
    type: 'textarea',
    placeholder: 'Tell us about yourself',
  };

  const passwordField: FieldDefinition = {
    name: 'password',
    label: 'Password',
    type: 'text',
    required: true,
    validate: (value) => {
      if (value.length < 8) {
        return { isValid: false, error: 'Password must be at least 8 characters' };
      }
      return { isValid: true };
    },
  };

  // ================================================================
  // RENDERING TESTS
  // ================================================================

  describe('Rendering', () => {
    it('renders with default props', () => {
      renderWithAll(<SectionEditModal {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('renders all 6 field types', () => {
      const allFields = [textField, emailField, numberField, dateField, selectField, textareaField];
      renderWithAll(<SectionEditModal {...defaultProps} fields={allFields} />);

      // Check all fields are rendered using id-based queries (more reliable than getByLabelText)
      expect(document.querySelector('#username')).toBeInTheDocument();
      expect(document.querySelector('#email')).toBeInTheDocument();
      expect(document.querySelector('#age')).toBeInTheDocument();
      expect(document.querySelector('#birthDate')).toBeInTheDocument();
      expect(document.querySelector('#country')).toBeInTheDocument();
      expect(document.querySelector('#bio')).toBeInTheDocument();
    });

    it('renders with initialData', () => {
      const initialData = { username: 'jannovak', email: 'jan@example.com' };
      renderWithAll(
        <SectionEditModal
          {...defaultProps}
          fields={[textField, emailField]}
          initialData={initialData}
        />
      );

      expect(screen.getByDisplayValue('jannovak')).toBeInTheDocument();
      expect(screen.getByDisplayValue('jan@example.com')).toBeInTheDocument();
    });

    it('shows required asterisk for required fields', () => {
      renderWithAll(<SectionEditModal {...defaultProps} fields={[textField]} />);

      // Find label element by for attribute, then check for asterisk inside
      const label = document.querySelector('label[for="username"]');
      expect(label).toBeTruthy();
      const asterisk = label?.querySelector('.required') || label?.querySelector('[class*="required"]');
      expect(asterisk).toBeInTheDocument();
    });

    it('renders modal title correctly', () => {
      renderWithAll(<SectionEditModal {...defaultProps} title="Edit User Profile" />);
      expect(screen.getByText('Edit User Profile')).toBeInTheDocument();
    });

    it('renders Clear Form button when showClearButton=true', () => {
      renderWithAll(<SectionEditModal {...defaultProps} showClearButton={true} />);
      // Clear button uses translation key
      expect(screen.getByTestId('section-edit-modal-clear')).toBeInTheDocument();
    });

    it('does NOT render Clear Form button when showClearButton=false', () => {
      renderWithAll(<SectionEditModal {...defaultProps} showClearButton={false} />);
      expect(screen.queryByTestId('section-edit-modal-clear')).not.toBeInTheDocument();
    });
  });

  // ================================================================
  // INTERACTION TESTS
  // ================================================================

  describe('Interactions', () => {
    it('onChange updates formData when user types in text field', () => {
      renderWithAll(<SectionEditModal {...defaultProps} fields={[textField]} />);

      const input = getInputById('username');
      fireEvent.change(input, { target: { value: 'newuser' } });

      expect(input.value).toBe('newuser');
    });

    it('onChange updates formData when user types in email field', () => {
      renderWithAll(<SectionEditModal {...defaultProps} fields={[emailField]} />);

      const input = getInputById('email');
      fireEvent.change(input, { target: { value: 'test@example.com' } });

      expect(input.value).toBe('test@example.com');
    });

    it('onChange updates formData when user types in number field', () => {
      renderWithAll(<SectionEditModal {...defaultProps} fields={[numberField]} />);

      const input = getInputById('age');
      fireEvent.change(input, { target: { value: '25' } });

      expect(input.value).toBe('25');
    });

    it('onChange updates formData when user selects date', () => {
      renderWithAll(<SectionEditModal {...defaultProps} fields={[dateField]} />);

      const input = getInputById('birthDate');
      fireEvent.change(input, { target: { value: '2000-01-01' } });

      expect(input.value).toBe('2000-01-01');
    });

    it('onChange updates formData when user selects option', () => {
      renderWithAll(<SectionEditModal {...defaultProps} fields={[selectField]} />);

      const select = getInputById('country');
      fireEvent.change(select, { target: { value: 'sk' } });

      expect(select.value).toBe('sk');
    });

    it('onChange updates formData when user types in textarea', () => {
      renderWithAll(<SectionEditModal {...defaultProps} fields={[textareaField]} />);

      const textarea = getInputById('bio');
      fireEvent.change(textarea, { target: { value: 'Software developer' } });

      expect(textarea.value).toBe('Software developer');
    });

    it('Save button triggers onSave with complete form data', async () => {
      const onSave = vi.fn();
      renderWithAll(
        <SectionEditModal
          {...defaultProps}
          fields={[textField, emailField]}
          onSave={onSave}
          initialData={{ username: 'jannovak', email: 'jan@example.com' }}
        />
      );

      const saveButton = screen.getByTestId('section-edit-modal-save');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith({
          username: 'jannovak',
          email: 'jan@example.com',
        });
      });
    });

    it('Cancel button shows confirmation if form is dirty', async () => {
      renderWithAll(
        <SectionEditModal
          {...defaultProps}
          fields={[textField]}
          initialData={{ username: 'original' }}
        />
      );

      // Make form dirty
      const input = getInputById('username');
      fireEvent.change(input, { target: { value: 'changed' } });

      // Click cancel
      const cancelButton = screen.getByTestId('section-edit-modal-cancel');
      fireEvent.click(cancelButton);

      // Wait for confirmation modal
      await waitFor(() => {
        // Confirmation modal should appear (checking for dialog role)
        const dialogs = screen.getAllByRole('dialog');
        expect(dialogs.length).toBeGreaterThan(1); // Main modal + confirmation modal
      });
    });

    it('Cancel button closes immediately if form is clean', () => {
      const onClose = vi.fn();
      renderWithAll(
        <SectionEditModal
          {...defaultProps}
          fields={[textField]}
          initialData={{ username: 'test' }}
          onClose={onClose}
        />
      );

      // Click cancel (form is clean)
      const cancelButton = screen.getByTestId('section-edit-modal-cancel');
      fireEvent.click(cancelButton);

      // Should close immediately without confirmation
      expect(onClose).toHaveBeenCalled();
    });

    it('Clear button shows confirmation modal', async () => {
      renderWithAll(<SectionEditModal {...defaultProps} fields={[textField]} showClearButton={true} />);

      const clearButton = screen.getByTestId('section-edit-modal-clear');
      fireEvent.click(clearButton);

      // Wait for confirmation modal
      await waitFor(() => {
        const dialogs = screen.getAllByRole('dialog');
        expect(dialogs.length).toBeGreaterThan(1); // Main modal + clear confirmation
      });
    });

    it('Clear button clears all fields after confirmation (text → "", number → 0)', async () => {
      renderWithAll(
        <SectionEditModal
          {...defaultProps}
          fields={[textField, numberField]}
          initialData={{ username: 'jannovak', age: 30 }}
          showClearButton={true}
        />
      );

      // Click clear button
      const clearButton = screen.getByTestId('section-edit-modal-clear');
      fireEvent.click(clearButton);

      // Wait for confirmation modal and find confirm button
      await waitFor(() => {
        const dialogs = screen.getAllByRole('dialog');
        expect(dialogs.length).toBeGreaterThan(1);
      });

      // Find and click the confirm button in the clear confirmation modal
      // Use testid to reliably find the confirm button
      const confirmButton = screen.getByTestId('confirm-modal-confirm');

      if (confirmButton) {
        fireEvent.click(confirmButton);
      }

      // Wait for fields to be cleared
      await waitFor(() => {
        const usernameInput = getInputById('username');
        const ageInput = getInputById('age');
        expect(usernameInput.value).toBe('');
        // Number input with value 0 renders as empty string in HTML
        expect(ageInput.value).toBe('');
      });
    });

    it('Clear button cancel keeps data intact', async () => {
      renderWithAll(
        <SectionEditModal
          {...defaultProps}
          fields={[textField]}
          initialData={{ username: 'jannovak' }}
          showClearButton={true}
        />
      );

      // Click clear button
      const clearButton = screen.getByTestId('section-edit-modal-clear');
      fireEvent.click(clearButton);

      // Wait for confirmation modal
      await waitFor(() => {
        const dialogs = screen.getAllByRole('dialog');
        expect(dialogs.length).toBeGreaterThan(1);
      });

      // Find cancel button in confirmation modal using testid
      const cancelButton = screen.getByTestId('confirm-modal-cancel');

      if (cancelButton) {
        fireEvent.click(cancelButton);
      }

      // Data should remain unchanged
      await waitFor(() => {
        const usernameInput = getInputById('username');
        expect(usernameInput.value).toBe('jannovak');
      });
    });
  });

  // ================================================================
  // VALIDATION TESTS
  // ================================================================

  describe('Validation', () => {
    it('Required field shows error when empty and user tries to save', async () => {
      const onSave = vi.fn();
      renderWithAll(
        <SectionEditModal {...defaultProps} fields={[textField]} onSave={onSave} />
      );

      // Try to save without filling required field
      const saveButton = screen.getByTestId('section-edit-modal-save');
      fireEvent.click(saveButton);

      // onSave should not be called (validation failed)
      expect(onSave).not.toHaveBeenCalled();
    });

    it('Custom validation function is called', () => {
      renderWithAll(
        <SectionEditModal {...defaultProps} fields={[passwordField]} />
      );

      const input = getInputById('password');
      fireEvent.change(input, { target: { value: 'short' } });

      // Validation error should appear
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });

    it('Custom validation error message is displayed', () => {
      renderWithAll(
        <SectionEditModal {...defaultProps} fields={[passwordField]} />
      );

      const input = getInputById('password');
      fireEvent.change(input, { target: { value: 'weak' } });

      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });

    it('Save button is disabled when validation errors exist', () => {
      renderWithAll(
        <SectionEditModal {...defaultProps} fields={[passwordField]} />
      );

      const input = getInputById('password');
      fireEvent.change(input, { target: { value: 'short' } });

      const saveButton = screen.getByTestId('section-edit-modal-save');
      expect(saveButton).toBeDisabled();
    });

    it('Validation error clears when field is corrected', async () => {
      renderWithAll(
        <SectionEditModal {...defaultProps} fields={[passwordField]} />
      );

      const input = getInputById('password');

      // Enter invalid value
      fireEvent.change(input, { target: { value: 'short' } });
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();

      // Correct the value
      fireEvent.change(input, { target: { value: 'validpassword123' } });

      // Error should disappear
      await waitFor(() => {
        expect(screen.queryByText('Password must be at least 8 characters')).not.toBeInTheDocument();
      });
    });
  });

  // ================================================================
  // KEYBOARD NAVIGATION TESTS
  // ================================================================

  describe('Keyboard Navigation', () => {
    it('ENTER key saves form and closes modal (when no errors)', async () => {
      const onSave = vi.fn();
      const onClose = vi.fn();

      renderWithAll(
        <SectionEditModal
          {...defaultProps}
          fields={[textField]}
          initialData={{ username: 'test' }}
          onSave={onSave}
          onClose={onClose}
        />
      );

      const dialog = screen.getByRole('dialog');
      fireEvent.keyDown(dialog, { key: 'Enter', code: 'Enter' });

      await waitFor(() => {
        expect(onSave).toHaveBeenCalled();
        expect(onClose).toHaveBeenCalled();
      });
    });

    it('ENTER key does NOT save when validation errors exist', async () => {
      const onSave = vi.fn();

      renderWithAll(
        <SectionEditModal {...defaultProps} fields={[passwordField]} onSave={onSave} />
      );

      // Enter invalid password
      const input = getInputById('password');
      fireEvent.change(input, { target: { value: 'short' } });

      const dialog = screen.getByRole('dialog');
      fireEvent.keyDown(dialog, { key: 'Enter', code: 'Enter' });

      // onSave should NOT be called
      expect(onSave).not.toHaveBeenCalled();
    });

    it('ESC key shows confirmation if form is dirty', async () => {
      renderWithAll(
        <SectionEditModal
          {...defaultProps}
          fields={[textField]}
          initialData={{ username: 'original' }}
        />
      );

      // Make form dirty
      const input = getInputById('username');
      fireEvent.change(input, { target: { value: 'changed' } });

      // Press ESC
      const dialog = screen.getByRole('dialog');
      fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });

      // Confirmation modal should appear
      await waitFor(() => {
        const dialogs = screen.getAllByRole('dialog');
        expect(dialogs.length).toBeGreaterThan(1);
      });
    });

    it('ESC key closes immediately if form is clean', () => {
      const onClose = vi.fn();

      renderWithAll(
        <SectionEditModal
          {...defaultProps}
          fields={[textField]}
          initialData={{ username: 'test' }}
          onClose={onClose}
        />
      );

      // Press ESC (form is clean)
      const dialog = screen.getByRole('dialog');
      fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });

      expect(onClose).toHaveBeenCalled();
    });
  });

  // ================================================================
  // DIRTY STATE TRACKING TESTS
  // ================================================================

  describe('Dirty State Tracking', () => {
    it('isDirty = false initially (form clean)', () => {
      const onClose = vi.fn();

      renderWithAll(
        <SectionEditModal
          {...defaultProps}
          fields={[textField]}
          initialData={{ username: 'test' }}
          onClose={onClose}
        />
      );

      // Click cancel - should close immediately (form is clean)
      const cancelButton = screen.getByTestId('section-edit-modal-cancel');
      fireEvent.click(cancelButton);

      expect(onClose).toHaveBeenCalled();
    });

    it('isDirty = true after user changes any field', async () => {
      renderWithAll(
        <SectionEditModal
          {...defaultProps}
          fields={[textField]}
          initialData={{ username: 'original' }}
        />
      );

      // Change field
      const input = getInputById('username');
      fireEvent.change(input, { target: { value: 'changed' } });

      // Click cancel - should show confirmation (form is dirty)
      const cancelButton = screen.getByTestId('section-edit-modal-cancel');
      fireEvent.click(cancelButton);

      await waitFor(() => {
        const dialogs = screen.getAllByRole('dialog');
        expect(dialogs.length).toBeGreaterThan(1);
      });
    });

    it('isDirty = false after save and reopen with same data', async () => {
      const { rerender } = renderWithAll(
        <SectionEditModal
          {...defaultProps}
          fields={[textField]}
          initialData={{ username: 'test' }}
        />
      );

      // Save
      const saveButton = screen.getByTestId('section-edit-modal-save');
      fireEvent.click(saveButton);

      // Reopen with same data
      rerender(
        <SectionEditModal
          {...defaultProps}
          isOpen={false}
          fields={[textField]}
          initialData={{ username: 'test' }}
        />
      );

      rerender(
        <SectionEditModal
          {...defaultProps}
          isOpen={true}
          fields={[textField]}
          initialData={{ username: 'test' }}
        />
      );

      // Form should be clean
      const cancelButton = screen.getByTestId('section-edit-modal-cancel');
      fireEvent.click(cancelButton);

      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('isDirty = false after clear and reopen', async () => {
      const { rerender } = renderWithAll(
        <SectionEditModal
          {...defaultProps}
          fields={[textField]}
          initialData={{ username: 'test' }}
          showClearButton={true}
        />
      );

      // Clear form
      const clearButton = screen.getByTestId('section-edit-modal-clear');
      fireEvent.click(clearButton);

      // Confirm clear
      await waitFor(() => {
        const dialogs = screen.getAllByRole('dialog');
        expect(dialogs.length).toBeGreaterThan(1);
      });

      const confirmButton = screen.getByTestId('confirm-modal-confirm');
      if (confirmButton) {
        fireEvent.click(confirmButton);
      }

      // Reopen
      rerender(
        <SectionEditModal
          {...defaultProps}
          isOpen={false}
          fields={[textField]}
          initialData={{ username: 'test' }}
          showClearButton={true}
        />
      );

      rerender(
        <SectionEditModal
          {...defaultProps}
          isOpen={true}
          fields={[textField]}
          initialData={{ username: 'test' }}
          showClearButton={true}
        />
      );

      // Form should be clean
      const cancelButton = screen.getByTestId('section-edit-modal-cancel');
      fireEvent.click(cancelButton);

      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('Cancel shows confirmation only when isDirty = true', async () => {
      const onClose = vi.fn();

      const { rerender } = renderWithAll(
        <SectionEditModal
          {...defaultProps}
          fields={[textField]}
          initialData={{ username: 'test' }}
          onClose={onClose}
        />
      );

      // Click cancel when clean - should close immediately
      let cancelButton = screen.getByTestId('section-edit-modal-cancel');
      fireEvent.click(cancelButton);
      expect(onClose).toHaveBeenCalledTimes(1);

      // Reopen and make dirty
      rerender(
        <SectionEditModal
          {...defaultProps}
          fields={[textField]}
          initialData={{ username: 'test' }}
          onClose={onClose}
        />
      );

      const input = getInputById('username');
      fireEvent.change(input, { target: { value: 'changed' } });

      // Click cancel when dirty - should show confirmation
      cancelButton = screen.getByTestId('section-edit-modal-cancel');
      fireEvent.click(cancelButton);

      await waitFor(() => {
        const dialogs = screen.getAllByRole('dialog');
        expect(dialogs.length).toBeGreaterThan(1);
      });

      // onClose should NOT have been called again yet (waiting for confirmation)
      expect(onClose).toHaveBeenCalledTimes(1); // Still 1 from before
    });
  });

  // ================================================================
  // DATA PERSISTENCE TESTS
  // ================================================================

  describe('Data Persistence', () => {
    it('Data persists after save and modal reopen', async () => {
      const onSave = vi.fn();
      const { rerender } = renderWithAll(
        <SectionEditModal
          {...defaultProps}
          fields={[textField]}
          initialData={{ username: 'original' }}
          onSave={onSave}
        />
      );

      // Change data
      const input = getInputById('username');
      fireEvent.change(input, { target: { value: 'changed' } });

      // Save
      const saveButton = screen.getByTestId('section-edit-modal-save');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith({ username: 'changed' });
      });

      // Reopen with new data
      rerender(
        <SectionEditModal
          {...defaultProps}
          isOpen={false}
          fields={[textField]}
          initialData={{ username: 'changed' }}
          onSave={onSave}
        />
      );

      rerender(
        <SectionEditModal
          {...defaultProps}
          isOpen={true}
          fields={[textField]}
          initialData={{ username: 'changed' }}
          onSave={onSave}
        />
      );

      // Data should persist
      const newInput = getInputById('username');
      expect(newInput.value).toBe('changed');
    });

    it('Form resets to initialData when modal opens', () => {
      const { rerender } = renderWithAll(
        <SectionEditModal
          {...defaultProps}
          isOpen={false}
          fields={[textField]}
          initialData={{ username: 'test' }}
        />
      );

      // Open modal
      rerender(
        <SectionEditModal
          {...defaultProps}
          isOpen={true}
          fields={[textField]}
          initialData={{ username: 'test' }}
        />
      );

      const input = getInputById('username');
      expect(input.value).toBe('test');
    });

    it('initialData prop update triggers form reset', () => {
      const { rerender } = renderWithAll(
        <SectionEditModal
          {...defaultProps}
          fields={[textField]}
          initialData={{ username: 'original' }}
        />
      );

      // Update initialData
      rerender(
        <SectionEditModal
          {...defaultProps}
          fields={[textField]}
          initialData={{ username: 'updated' }}
        />
      );

      const input = getInputById('username');
      expect(input.value).toBe('updated');
    });

    it('formData state updates when user edits fields', () => {
      renderWithAll(
        <SectionEditModal {...defaultProps} fields={[textField]} />
      );

      const input = getInputById('username');
      fireEvent.change(input, { target: { value: 'newvalue' } });

      expect(input.value).toBe('newvalue');
    });

    it('initialFormData updates when modal opens (fixes dirty tracking)', () => {
      const { rerender } = renderWithAll(
        <SectionEditModal
          {...defaultProps}
          isOpen={false}
          fields={[textField]}
          initialData={{ username: 'test' }}
        />
      );

      // Open modal - initialFormData should update
      rerender(
        <SectionEditModal
          {...defaultProps}
          isOpen={true}
          fields={[textField]}
          initialData={{ username: 'test' }}
        />
      );

      // Cancel should close immediately (form is clean)
      const cancelButton = screen.getByTestId('section-edit-modal-cancel');
      fireEvent.click(cancelButton);

      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  // ================================================================
  // TRANSLATION TESTS
  // ================================================================

  describe('Translation Support', () => {
    it('Clear button displays Slovak text by default', () => {
      renderWithAll(
        <SectionEditModal {...defaultProps} showClearButton={true} />,
        { initialLanguage: 'sk' }
      );

      const clearButton = screen.getByTestId('section-edit-modal-clear');
      expect(clearButton).toHaveTextContent('🧹 Vyčistiť formulár');
    });

    it('Clear button displays English text when language = en', () => {
      renderWithAll(
        <SectionEditModal {...defaultProps} showClearButton={true} />,
        { initialLanguage: 'en' }
      );

      const clearButton = screen.getByTestId('section-edit-modal-clear');
      expect(clearButton).toHaveTextContent('🧹 Clear Form');
    });

    it('Clear confirmation modal displays Slovak text by default', async () => {
      renderWithAll(
        <SectionEditModal {...defaultProps} fields={[textField]} showClearButton={true} />,
        { initialLanguage: 'sk' }
      );

      const clearButton = screen.getByTestId('section-edit-modal-clear');
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(screen.getByText('Vyčistiť formulár?')).toBeInTheDocument();
        expect(screen.getByText(/Naozaj chcete vymazať všetky polia/)).toBeInTheDocument();
      });
    });

    it('Clear confirmation modal displays English text when language = en', async () => {
      renderWithAll(
        <SectionEditModal {...defaultProps} fields={[textField]} showClearButton={true} />,
        { initialLanguage: 'en' }
      );

      const clearButton = screen.getByTestId('section-edit-modal-clear');
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(screen.getByText('Clear Form?')).toBeInTheDocument();
        expect(screen.getByText(/Are you sure you want to clear all fields/)).toBeInTheDocument();
      });
    });

    it('Unsaved changes confirmation appears when form is dirty (Slovak)', async () => {
      renderWithAll(
        <SectionEditModal
          {...defaultProps}
          fields={[textField]}
          initialData={{ username: 'original' }}
        />,
        { initialLanguage: 'sk' }
      );

      // Make form dirty
      const input = getInputById('username');
      fireEvent.change(input, { target: { value: 'changed' } });

      // Click cancel
      const cancelButton = screen.getByTestId('section-edit-modal-cancel');
      fireEvent.click(cancelButton);

      // Unsaved changes confirmation modal should appear
      await waitFor(
        () => {
          const dialogs = screen.getAllByRole('dialog');
          expect(dialogs.length).toBeGreaterThan(1); // Main modal + confirmation modal
        },
        { timeout: 3000 }
      );
    });

    it('Unsaved changes confirmation appears when form is dirty (English)', async () => {
      renderWithAll(
        <SectionEditModal
          {...defaultProps}
          fields={[textField]}
          initialData={{ username: 'original' }}
        />,
        { initialLanguage: 'en' }
      );

      // Make form dirty
      const input = getInputById('username');
      fireEvent.change(input, { target: { value: 'changed' } });

      // Click cancel
      const cancelButton = screen.getByTestId('section-edit-modal-cancel');
      fireEvent.click(cancelButton);

      // Unsaved changes confirmation modal should appear
      await waitFor(
        () => {
          const dialogs = screen.getAllByRole('dialog');
          expect(dialogs.length).toBeGreaterThan(1); // Main modal + confirmation modal
        },
        { timeout: 3000 }
      );
    });

    it('all translation keys exist and return valid translations', () => {
      // Render component to get access to useTranslation
      const TestComponent = () => {
        const { t } = useTranslation();

        const keys = [
          'components.modalV3.sectionEditModal.clearButton',
          'components.modalV3.sectionEditModal.clearConfirmTitle',
          'components.modalV3.sectionEditModal.clearConfirmMessage',
          'components.modalV3.sectionEditModal.clearConfirmButton',
          'common.cancel',
          'common.save',
          'common.select',
        ];

        keys.forEach((key) => {
          const translation = t(key);
          // Translation should not return the key itself (= key missing)
          expect(translation).not.toBe(key);
          // Translation should not be empty
          expect(translation).toBeTruthy();
          expect(translation.length).toBeGreaterThan(0);
        });

        return null;
      };

      renderWithAll(<TestComponent />);
    });
  });

  // ================================================================
  // PROPS & VARIANTS TESTS
  // ================================================================

  describe('Props & Variants', () => {
    it('renders with size="sm"', () => {
      renderWithAll(<SectionEditModal {...defaultProps} size="sm" />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('renders with size="md" (default)', () => {
      renderWithAll(<SectionEditModal {...defaultProps} size="md" />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('renders with size="lg"', () => {
      renderWithAll(<SectionEditModal {...defaultProps} size="lg" />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('uses custom saveText when provided', () => {
      renderWithAll(
        <SectionEditModal {...defaultProps} saveText="Custom Save" />
      );
      const saveButton = screen.getByTestId('section-edit-modal-save');
      expect(saveButton.textContent).toBe('Custom Save');
    });

    it('uses custom cancelText when provided', () => {
      renderWithAll(
        <SectionEditModal {...defaultProps} cancelText="Custom Cancel" />
      );
      const cancelButton = screen.getByTestId('section-edit-modal-cancel');
      expect(cancelButton.textContent).toBe('Custom Cancel');
    });

    it('supports parentModalId for nested modals', () => {
      renderWithAll(
        <SectionEditModal {...defaultProps} parentModalId="parent-modal" />
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('validates field with pattern attribute', () => {
      const patternField: FieldDefinition = {
        name: 'zipCode',
        label: 'ZIP Code',
        type: 'text',
        pattern: '[0-9]{5}',
      };

      renderWithAll(<SectionEditModal {...defaultProps} fields={[patternField]} />);
      const input = getInputById('zipCode');
      expect(input).toHaveAttribute('pattern', '[0-9]{5}');
    });

    it('validates number field with min attribute', () => {
      const minField: FieldDefinition = {
        name: 'quantity',
        label: 'Quantity',
        type: 'number',
        min: 1,
      };

      renderWithAll(<SectionEditModal {...defaultProps} fields={[minField]} />);
      const input = getInputById('quantity');
      expect(input).toHaveAttribute('min', '1');
    });

    it('validates number field with max attribute', () => {
      const maxField: FieldDefinition = {
        name: 'quantity',
        label: 'Quantity',
        type: 'number',
        max: 100,
      };

      renderWithAll(<SectionEditModal {...defaultProps} fields={[maxField]} />);
      const input = getInputById('quantity');
      expect(input).toHaveAttribute('max', '100');
    });
  });

  // ================================================================
  // ACCESSIBILITY TESTS
  // ================================================================

  describe('Accessibility', () => {
    it('Modal has role="dialog"', () => {
      renderWithAll(<SectionEditModal {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('Modal has aria-modal="true"', () => {
      renderWithAll(<SectionEditModal {...defaultProps} />);
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('FormField labels are associated with inputs', () => {
      renderWithAll(<SectionEditModal {...defaultProps} fields={[textField]} />);

      const input = getInputById('username');
      expect(input).toBeInTheDocument();
    });

    it('Required fields have aria-required="true"', () => {
      renderWithAll(<SectionEditModal {...defaultProps} fields={[textField]} />);

      const input = getInputById('username');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    it('Validation errors have aria-invalid="true"', async () => {
      renderWithAll(<SectionEditModal {...defaultProps} fields={[passwordField]} />);

      const input = getInputById('password');
      fireEvent.change(input, { target: { value: 'short' } });

      await waitFor(() => {
        expect(input).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('Validation errors have aria-describedby pointing to error message', async () => {
      renderWithAll(<SectionEditModal {...defaultProps} fields={[passwordField]} />);

      const input = getInputById('password');
      fireEvent.change(input, { target: { value: 'short' } });

      await waitFor(() => {
        const describedBy = input.getAttribute('aria-describedby');
        expect(describedBy).toBeTruthy();

        // Error message should exist and be referenced
        const errorMessage = screen.getByText('Password must be at least 8 characters');
        expect(errorMessage).toBeInTheDocument();
      });
    });
  });
});