/*
 * ================================================================
 * FILE: EntityEditModal.tsx
 * PATH: /packages/ui-components/src/components/EntityEditModal/EntityEditModal.tsx
 * DESCRIPTION: Universal entity edit modal with configuration-driven fields
 * VERSION: v1.0.0
 * CREATED: 2025-12-09
 * UPDATED: 2025-12-09
 *
 * FEATURES:
 *   - Configuration-driven field rendering
 *   - Multi-section support (each section = separate modal)
 *   - Dirty state tracking with useFormDirty
 *   - Permission-based field access control
 *   - Grid/Stack layouts
 *   - Full translation support
 *   - Unsaved changes confirmation
 *   - Pessimistic locking support (via base Modal)
 *
 * USAGE:
 *   <EntityEditModal
 *     isOpen={isOpen}
 *     onClose={handleClose}
 *     onSave={handleSave}
 *     entity={issue}
 *     sectionId="overview"
 *     config={issueEditConfig}
 *     permissionLevel={permissionLevel}
 *     parentModalId="issue-detail"
 *   />
 * ================================================================
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { FormField } from '../FormField';
import { Input } from '../Input';
import { Textarea } from '../Textarea';
import { Select, SelectOption } from '../Select';
import { ConfirmModal } from '../ConfirmModal';
import { useTranslation, useFormDirty } from '@l-kern/config';
import type {
  EntityEditModalProps,
  EntityField,
  EntitySection,
} from './types';
import styles from './EntityEditModal.module.css';

// ================================================================
// COMPONENT
// ================================================================

export function EntityEditModal<TEntity extends Record<string, unknown> = Record<string, unknown>>({
  isOpen,
  onClose,
  onSave,
  entity,
  sectionId,
  config,
  permissionLevel,
  parentModalId,
  size = 'md',
  maxWidth = '600px',
}: EntityEditModalProps<TEntity>) {
  const { t } = useTranslation();

  // ================================================================
  // STATE
  // ================================================================

  // Form data state
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [initialFormData, setInitialFormData] = useState<Record<string, unknown>>({});

  // Validation errors (keyed by field name, value is translation key)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Loading/saving state
  const [isSaving, setIsSaving] = useState(false);

  // Confirm modal for unsaved changes
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  // ================================================================
  // COMPUTED
  // ================================================================

  // Get current section from config
  const currentSection: EntitySection | undefined = useMemo(() => {
    return config.sections.find((s) => s.id === sectionId);
  }, [config.sections, sectionId]);

  // Modal ID
  const modalId = `entity-edit-${config.entityName}-${sectionId}`;

  // ================================================================
  // DIRTY TRACKING
  // ================================================================

  const { isDirty } = useFormDirty(initialFormData, formData);

  // ================================================================
  // PERMISSION HELPERS
  // ================================================================

  /**
   * Check if field can be edited
   */
  const canEditField = useCallback(
    (fieldName: string): boolean => {
      return config.permissions.canEdit(fieldName, permissionLevel);
    },
    [config.permissions, permissionLevel]
  );

  /**
   * Check if field is visible
   */
  const canViewField = useCallback(
    (fieldName: string): boolean => {
      if (!config.permissions.canView) return true;
      return config.permissions.canView(fieldName, permissionLevel);
    },
    [config.permissions, permissionLevel]
  );

  /**
   * Get reason why field is not editable (for tooltip)
   */
  const getFieldReason = useCallback(
    (fieldName: string): string | undefined => {
      if (!config.permissions.getEditReasonKey) return undefined;
      const reasonKey = config.permissions.getEditReasonKey(fieldName, permissionLevel);
      return reasonKey ? t(reasonKey) : undefined;
    },
    [config.permissions, permissionLevel, t]
  );

  // ================================================================
  // INITIALIZATION
  // ================================================================

  /**
   * Initialize form data when modal opens
   */
  useEffect(() => {
    if (isOpen && entity && currentSection) {
      let data: Record<string, unknown>;

      if (config.initializeFormData) {
        // Use custom initializer
        data = config.initializeFormData(entity, sectionId);
      } else {
        // Default: extract field values from entity
        data = {};
        currentSection.fields.forEach((field) => {
          const value = entity[field.name];
          // Handle nested properties (e.g., 'system_info.browser')
          if (field.name.includes('.')) {
            const parts = field.name.split('.');
            let nested: unknown = entity;
            for (const part of parts) {
              if (nested && typeof nested === 'object') {
                nested = (nested as Record<string, unknown>)[part];
              } else {
                nested = undefined;
                break;
              }
            }
            data[field.name] = nested ?? '';
          } else {
            data[field.name] = value ?? '';
          }
        });
      }

      setFormData(data);
      setInitialFormData(data);
      setValidationErrors({});
    }
  }, [isOpen, entity, currentSection, config, sectionId]);

  // ================================================================
  // HANDLERS
  // ================================================================

  /**
   * Handle field value change
   */
  const handleFieldChange = useCallback(
    (fieldName: string, value: unknown) => {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: value,
      }));

      // Clear validation error for this field
      if (validationErrors[fieldName]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    },
    [validationErrors]
  );

  /**
   * Validate a single field
   */
  const validateField = useCallback(
    (field: EntityField, value: unknown): string | undefined => {
      // Required check
      if (field.required && (value === undefined || value === null || value === '')) {
        return 'validation.required';
      }

      // MinLength check
      if (field.minLength && typeof value === 'string' && value.length < field.minLength) {
        return `validation.minLength`;
      }

      // MaxLength check
      if (field.maxLength && typeof value === 'string' && value.length > field.maxLength) {
        return `validation.maxLength`;
      }

      // Custom validation
      if (field.validate) {
        return field.validate(value, formData);
      }

      return undefined;
    },
    [formData]
  );

  /**
   * Validate all fields in current section
   */
  const validateAllFields = useCallback((): boolean => {
    if (!currentSection) return false;

    const errors: Record<string, string> = {};

    currentSection.fields.forEach((field) => {
      const value = formData[field.name];
      const errorKey = validateField(field, value);
      if (errorKey) {
        errors[field.name] = errorKey;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [currentSection, formData, validateField]);

  /**
   * Handle close attempt (with dirty check)
   */
  const handleCloseAttempt = useCallback(() => {
    if (isDirty) {
      setShowConfirmClose(true);
    } else {
      onClose();
    }
  }, [isDirty, onClose]);

  /**
   * Confirm close (discard changes)
   */
  const handleConfirmClose = useCallback(() => {
    setShowConfirmClose(false);
    onClose();
  }, [onClose]);

  /**
   * Cancel close
   */
  const handleCancelClose = useCallback(() => {
    setShowConfirmClose(false);
  }, []);

  /**
   * Handle save
   */
  const handleSave = useCallback(async () => {
    // Validate
    if (!validateAllFields()) return;

    setIsSaving(true);

    try {
      let changes: Partial<TEntity>;

      if (config.extractChanges) {
        // Use custom extractor
        changes = config.extractChanges(formData, entity, sectionId);
      } else {
        // Default: compare with initial data
        changes = {} as Partial<TEntity>;
        Object.keys(formData).forEach((key) => {
          if (formData[key] !== initialFormData[key]) {
            (changes as Record<string, unknown>)[key] = formData[key];
          }
        });
      }

      // Skip save if no changes
      if (Object.keys(changes).length === 0) {
        onClose();
        return;
      }

      const success = await onSave(changes, permissionLevel);
      if (success) {
        onClose();
      }
    } finally {
      setIsSaving(false);
    }
  }, [validateAllFields, config, formData, entity, sectionId, initialFormData, onSave, permissionLevel, onClose]);

  // ================================================================
  // FIELD RENDERING
  // ================================================================

  /**
   * Get select options (handle static or function)
   */
  const getSelectOptions = useCallback((field: EntityField): SelectOption[] => {
    if (field.type !== 'select') return [];
    const options = field.options;
    return typeof options === 'function' ? options() : options;
  }, []);

  /**
   * Render a single field
   */
  const renderField = useCallback(
    (field: EntityField) => {
      const value = formData[field.name];
      const errorKey = validationErrors[field.name];
      const error = errorKey ? t(errorKey) : undefined;
      const isDisabled = field.disabled || !canEditField(field.permissionField || field.name);
      const isBlurred = field.blur && !canViewField(field.name);
      const reason = getFieldReason(field.permissionField || field.name);

      // Container classes
      const containerClass = [
        field.width === 'full' ? styles.fieldFull : styles.fieldHalf,
        isBlurred ? styles.blurredField : undefined,
        isDisabled && !field.disabled ? styles.noEditAccess : undefined,
      ]
        .filter(Boolean)
        .join(' ');

      // Common FormField props
      const formFieldProps = {
        label: t(field.labelKey),
        required: field.required,
        error,
        value: String(value ?? ''),
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
          handleFieldChange(field.name, e.target.value),
        htmlFor: `edit-${field.name}`,
        reserveMessageSpace: Boolean(field.required || field.validate),
        labelHint: field.hintKey ? t(field.hintKey) : undefined,
        labelHintMaxWidth: field.hintMaxWidth,
        maxLength: field.maxLength,
      };

      // Render based on field type
      switch (field.type) {
        case 'text':
        case 'email':
        case 'url':
        case 'number':
        case 'date':
        case 'datetime-local':
          return (
            <div key={field.name} className={containerClass}>
              <FormField {...formFieldProps}>
                <Input
                  id={`edit-${field.name}`}
                  type={field.type}
                  placeholder={field.placeholderKey ? t(field.placeholderKey) : undefined}
                  fullWidth
                  disabled={isDisabled}
                  title={reason}
                  min={field.min}
                  max={field.max}
                  maxLength={field.maxLength}
                />
              </FormField>
            </div>
          );

        case 'textarea':
          return (
            <div key={field.name} className={containerClass}>
              <FormField {...formFieldProps}>
                <Textarea
                  id={`edit-${field.name}`}
                  rows={field.rows ?? 4}
                  placeholder={field.placeholderKey ? t(field.placeholderKey) : undefined}
                  fullWidth
                  disabled={isDisabled}
                  title={reason}
                  maxLength={field.maxLength}
                />
              </FormField>
            </div>
          );

        case 'select':
          return (
            <div key={field.name} className={containerClass}>
              <FormField {...formFieldProps}>
                <Select
                  id={`edit-${field.name}`}
                  options={getSelectOptions(field)}
                  fullWidth
                  disabled={isDisabled}
                  title={reason}
                />
              </FormField>
            </div>
          );

        case 'hidden':
          return null;

        default:
          return null;
      }
    },
    [formData, validationErrors, t, canEditField, canViewField, getFieldReason, handleFieldChange, getSelectOptions]
  );

  // ================================================================
  // RENDER
  // ================================================================

  if (!currentSection) {
    console.error(`[EntityEditModal] Section "${sectionId}" not found in config for "${config.entityName}"`);
    return null;
  }

  const hasValidationErrors = Object.keys(validationErrors).length > 0;
  const isSaveDisabled = isSaving || hasValidationErrors;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseAttempt}
        modalId={modalId}
        parentModalId={parentModalId}
        title={t(currentSection.titleKey)}
        size={size}
        maxWidth={maxWidth}
      >
        <div className={styles.content}>
          <div className={currentSection.useGrid ? styles.grid : styles.stack}>
            {currentSection.fields.map((field) => renderField(field))}
          </div>
        </div>

        <div className={styles.footer}>
          <Button variant="secondary" onClick={handleCloseAttempt} disabled={isSaving}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaveDisabled} loading={isSaving}>
            {t('common.save')}
          </Button>
        </div>
      </Modal>

      {/* Confirm close modal */}
      <ConfirmModal
        isOpen={showConfirmClose}
        onConfirm={handleConfirmClose}
        onClose={handleCancelClose}
        title={t('components.modalV3.confirmModal.unsavedChanges.title')}
        message={t('components.modalV3.confirmModal.unsavedChanges.message')}
        confirmButtonLabel={t('components.modalV3.confirmModal.unsavedChanges.confirmButton')}
        cancelButtonLabel={t('common.cancel')}
        parentModalId={modalId}
      />
    </>
  );
}

export default EntityEditModal;
