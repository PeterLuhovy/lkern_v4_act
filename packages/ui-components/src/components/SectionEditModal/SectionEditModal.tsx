/*
 * ================================================================
 * FILE: SectionEditModal.tsx
 * PATH: /packages/ui-components/src/components/SectionEditModal/SectionEditModal.tsx
 * DESCRIPTION: Generic form builder modal with FieldDefinition system
 * VERSION: v1.0.0
 * UPDATED: 2025-11-01 17:00:00
 *
 * FEATURES:
 *   - Dynamic field rendering from FieldDefinition array
 *   - HTML5 validation + optional custom validation
 *   - Integration with FormField, Input, Select components
 *   - Clear form button with confirmation
 *   - Unsaved changes detection (delegated to base Modal)
 *   - Full translation support (SK/EN)
 *
 * USAGE:
 *   <SectionEditModal
 *     isOpen={isOpen}
 *     onClose={handleClose}
 *     onSave={handleSave}
 *     title="Upraviť: Základné údaje"
 *     modalId="edit-section"
 *     fields={fieldDefinitions}
 *     initialData={sectionData}
 *   />
 *
 * MIGRATED FROM: L-KERN v3 SectionEditModal.tsx (simplified for v4)
 * ================================================================
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { ConfirmModal } from '../ConfirmModal';
import { FormField } from '../FormField';
import { Input } from '../Input';
import { Select } from '../Select';
import { useTranslation, useFormDirty, useConfirm } from '@l-kern/config';
import styles from './SectionEditModal.module.css';

// ================================================================
// TYPES
// ================================================================

/**
 * Field validation result
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Field definition for dynamic form rendering
 */
export interface FieldDefinition {
  /**
   * Field identifier (used as form data key)
   */
  name: string;

  /**
   * Display label (translated)
   */
  label: string;

  /**
   * Field type
   */
  type: 'text' | 'email' | 'number' | 'date' | 'select' | 'textarea';

  /**
   * Is field required?
   * @default false
   */
  required?: boolean;

  /**
   * Placeholder text (translated)
   */
  placeholder?: string;

  /**
   * Options for select fields
   */
  options?: Array<{
    value: string;
    label: string;
  }>;

  /**
   * HTML5 validation pattern (regex string)
   */
  pattern?: string;

  /**
   * Minimum value (number) or length (text)
   */
  min?: number | string;

  /**
   * Maximum value (number) or length (text)
   */
  max?: number | string;

  /**
   * Custom validation function (synchronous)
   * Receives current value and entire form data
   * Returns validation result with error message if invalid
   */
  validate?: (value: any, formData: Record<string, any>) => ValidationResult;
}

/**
 * SectionEditModal Props Interface
 */
export interface SectionEditModalProps {
  /**
   * Controls modal visibility
   */
  isOpen: boolean;

  /**
   * Called when modal is closed (cancel/ESC)
   */
  onClose: () => void;

  /**
   * Called when user saves the form
   * Receives entire form data object
   */
  onSave: (data: Record<string, any>) => void;

  /**
   * Modal title (e.g., "Upraviť: Základné údaje")
   */
  title: string;

  /**
   * Unique modal identifier
   */
  modalId: string;

  /**
   * Parent modal ID (for nested modals)
   */
  parentModalId?: string;

  /**
   * Field definitions for form rendering
   */
  fields: FieldDefinition[];

  /**
   * Initial form data
   * @default {}
   */
  initialData?: Record<string, any>;

  /**
   * Modal size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Show clear form button
   * @default true
   */
  showClearButton?: boolean;

  /**
   * Custom save button text
   * @default "Uložiť" (from translations)
   */
  saveText?: string;

  /**
   * Custom cancel button text
   * @default "Zrušiť" (from translations)
   */
  cancelText?: string;
}

// ================================================================
// COMPONENT
// ================================================================

/**
 * SectionEditModal Component
 *
 * Generic form builder for dynamic forms using FieldDefinition system.
 * Supports 6 field types: text, email, number, date, select, textarea.
 * Includes HTML5 validation, custom validation, clear form, and unsaved changes detection.
 *
 * @example Basic Usage
 * ```tsx
 * const fields: FieldDefinition[] = [
 *   { name: 'firstName', label: 'Meno', type: 'text', required: true },
 *   { name: 'email', label: 'Email', type: 'email', required: true },
 *   { name: 'age', label: 'Vek', type: 'number', min: 0, max: 120 },
 * ];
 *
 * <SectionEditModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onSave={(data) => console.log(data)}
 *   title="Upraviť: Osobné údaje"
 *   modalId="edit-personal"
 *   fields={fields}
 *   initialData={{ firstName: 'Ján', email: 'jan@example.com', age: 30 }}
 * />
 * ```
 *
 * @example With Custom Validation
 * ```tsx
 * const fields: FieldDefinition[] = [
 *   {
 *     name: 'password',
 *     label: 'Heslo',
 *     type: 'text',
 *     validate: (value) => {
 *       if (value.length < 8) {
 *         return { isValid: false, error: 'Heslo musí mať aspoň 8 znakov' };
 *       }
 *       return { isValid: true };
 *     },
 *   },
 * ];
 * ```
 */
export const SectionEditModal: React.FC<SectionEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  modalId,
  parentModalId,
  fields,
  initialData = {},
  size = 'md',
  showClearButton = true,
  saveText,
  cancelText,
}) => {
  const { t } = useTranslation();

  // Unsaved changes confirmation
  const unsavedConfirm = useConfirm();

  // ================================================================
  // STATE
  // ================================================================

  // Form data (current working state)
  const [formData, setFormData] = useState<Record<string, any>>(initialData);

  // Initial form data (for dirty tracking)
  const [initialFormData, setInitialFormData] = useState<Record<string, any>>(initialData);

  // Validation errors (field name → error message)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Clear form confirmation modal state
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Dirty tracking - compare current vs initial
  const { isDirty } = useFormDirty(initialFormData, formData);

  // ================================================================
  // EFFECTS
  // ================================================================

  /**
   * Reset form data when modal opens
   * This prevents persisted state from previous open/close cycles
   * Also updates initialFormData for dirty tracking after save
   */
  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      setInitialFormData(initialData); // Update baseline for dirty tracking
      setValidationErrors({});
    }
  }, [isOpen, initialData]);

  // ================================================================
  // COMPUTED
  // ================================================================

  // Check if there are any validation errors
  const hasValidationErrors = Object.keys(validationErrors).length > 0;

  // ================================================================
  // HANDLERS
  // ================================================================

  /**
   * Handle field value change
   * Updates formData and triggers validation if defined
   */
  const handleChange = useCallback(
    (fieldName: string, value: any) => {
      // Update form data
      setFormData((prev) => ({ ...prev, [fieldName]: value }));

      // Find field definition
      const field = fields.find((f) => f.name === fieldName);
      if (!field) return;

      // Run custom validation if defined
      if (field.validate) {
        const result = field.validate(value, { ...formData, [fieldName]: value });
        if (!result.isValid && result.error) {
          setValidationErrors((prev) => ({ ...prev, [fieldName]: result.error! }));
        } else {
          // Clear error for this field
          setValidationErrors((prev) => {
            const { [fieldName]: _, ...rest } = prev;
            return rest;
          });
        }
      } else {
        // No custom validation - clear error if exists
        setValidationErrors((prev) => {
          const { [fieldName]: _, ...rest } = prev;
          return rest;
        });
      }
    },
    [fields, formData]
  );

  /**
   * Handle save button click
   * Validates all fields and calls onSave if valid
   */
  const handleSave = () => {
    // Don't save if there are validation errors
    if (hasValidationErrors) {
      return;
    }

    // Run all validations before saving
    let hasErrors = false;
    const errors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = formData[field.name];

      // Check required fields
      if (field.required && (!value || value === '')) {
        errors[field.name] = 'This field is required';
        hasErrors = true;
        return; // Skip custom validation if field is empty
      }

      // Run custom validation if defined
      if (field.validate) {
        const result = field.validate(value, formData);
        if (!result.isValid && result.error) {
          errors[field.name] = result.error;
          hasErrors = true;
        }
      }
    });

    if (hasErrors) {
      setValidationErrors(errors);
      return;
    }

    // All valid - save and close
    onSave(formData);
    onClose();
  };

  /**
   * Handle cancel button click
   * Shows unsaved changes confirmation if form is dirty
   */
  const handleCancel = useCallback(() => {
    if (isDirty) {
      // Show unsaved changes confirmation
      unsavedConfirm.confirm({}).then((confirmed) => {
        if (confirmed) {
          onClose();
        }
        // If not confirmed, stay in modal (do nothing)
      });
    } else {
      onClose();
    }
  }, [isDirty, unsavedConfirm, onClose]);

  /**
   * Handle clear form button click
   * Shows confirmation modal
   */
  const handleClearClick = () => {
    setShowClearConfirm(true);
  };

  /**
   * Handle clear form confirmation
   * Clears all fields to empty values based on type
   */
  const handleClearConfirm = () => {
    // Clear all fields to empty values based on type
    const clearedData: Record<string, any> = {};
    fields.forEach((field) => {
      if (field.type === 'number') {
        clearedData[field.name] = 0;
      } else {
        clearedData[field.name] = '';
      }
    });

    setFormData(clearedData);
    setValidationErrors({});
    setShowClearConfirm(false);
  };

  /**
   * Handle clear form cancellation
   */
  const handleClearCancel = () => {
    setShowClearConfirm(false);
  };

  // ================================================================
  // RENDER FIELD
  // ================================================================

  /**
   * Render individual field based on FieldDefinition
   */
  const renderField = (field: FieldDefinition) => {
    const value = formData[field.name] || '';
    const error = validationErrors[field.name];

    // Text, Email, Number fields
    if (['text', 'email', 'number'].includes(field.type)) {
      return (
        <FormField
          key={field.name}
          label={field.label}
          error={error}
          required={field.required}
          value={value}
          onChange={(e) => handleChange(field.name, e.target.value)}
          htmlFor={field.name}
        >
          <Input
            type={field.type as 'text' | 'email' | 'number'}
            name={field.name}
            id={field.name}
            placeholder={field.placeholder}
            pattern={field.pattern}
            min={field.min}
            max={field.max}
            required={field.required}
          />
        </FormField>
      );
    }

    // Date field
    if (field.type === 'date') {
      return (
        <FormField
          key={field.name}
          label={field.label}
          error={error}
          required={field.required}
          value={value}
          onChange={(e) => handleChange(field.name, e.target.value)}
          htmlFor={field.name}
        >
          <Input
            type="date"
            name={field.name}
            id={field.name}
            placeholder={field.placeholder}
            required={field.required}
          />
        </FormField>
      );
    }

    // Select field
    if (field.type === 'select' && field.options) {
      return (
        <FormField
          key={field.name}
          label={field.label}
          error={error}
          required={field.required}
          value={value}
          onChange={(e) => handleChange(field.name, e.target.value)}
          htmlFor={field.name}
        >
          <Select
            name={field.name}
            id={field.name}
            options={field.options}
            placeholder={t('common.select')}
            required={field.required}
          />
        </FormField>
      );
    }

    // Textarea field
    if (field.type === 'textarea') {
      return (
        <div key={field.name} className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor={field.name}>
            {field.label}
            {field.required && <span className={styles.required}> *</span>}
          </label>
          <textarea
            className={styles.textarea}
            name={field.name}
            id={field.name}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            required={field.required}
          />
          {error && <div className={styles.fieldError}>{error}</div>}
        </div>
      );
    }

    return null;
  };

  // ================================================================
  // FOOTER CONFIGURATION
  // ================================================================

  const footer = {
    // Left slot: Clear button (if enabled)
    left: showClearButton ? (
      <Button
        variant="danger-subtle"
        onClick={handleClearClick}
        data-testid="section-edit-modal-clear"
      >
        {t('components.modalV3.sectionEditModal.clearButton')}
      </Button>
    ) : undefined,

    // Right slot: Cancel + Save buttons
    right: (
      <>
        <Button
          variant="ghost"
          onClick={handleCancel}
          data-testid="section-edit-modal-cancel"
        >
          {cancelText || t('common.cancel')}
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={hasValidationErrors}
          data-testid="section-edit-modal-save"
        >
          {saveText || t('common.save')}
        </Button>
      </>
    ),
  };

  // ================================================================
  // RENDER
  // ================================================================

  return (
    <>
      {/* Main Section Edit Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={unsavedConfirm.state.isOpen ? undefined : handleSave}
        hasUnsavedChanges={isDirty}
        modalId={modalId}
        parentModalId={parentModalId}
        title={title}
        size={size}
        footer={footer}
      >
        <div className={styles.formContainer}>
          {fields.map((field) => renderField(field))}
        </div>
      </Modal>

      {/* Clear Form Confirmation Modal */}
      {showClearButton && (
        <ConfirmModal
          isOpen={showClearConfirm}
          onClose={handleClearCancel}
          onConfirm={handleClearConfirm}
          title={t('components.modalV3.sectionEditModal.clearConfirmTitle')}
          message={t('components.modalV3.sectionEditModal.clearConfirmMessage')}
          confirmButtonLabel={t('components.modalV3.sectionEditModal.clearConfirmButton')}
          cancelButtonLabel={t('common.cancel')}
          parentModalId={modalId}
        />
      )}

      {/* Unsaved Changes Confirmation Modal */}
      <ConfirmModal
        isOpen={unsavedConfirm.state.isOpen}
        onClose={unsavedConfirm.handleCancel}
        onConfirm={unsavedConfirm.handleConfirm}
        title={unsavedConfirm.state.title}
        message={unsavedConfirm.state.message}
        parentModalId={modalId}
      />
    </>
  );
};

export default SectionEditModal;
