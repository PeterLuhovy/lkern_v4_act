/*
 * ================================================================
 * FILE: types.ts
 * PATH: /packages/ui-components/src/components/EntityEditModal/types.ts
 * DESCRIPTION: Type definitions for EntityEditModal configuration
 * VERSION: v1.0.0
 * CREATED: 2025-12-09
 * UPDATED: 2025-12-09
 *
 * This file defines the configuration types for the universal
 * EntityEditModal component. It enables type-safe, configuration-driven
 * entity editing across all microservices.
 * ================================================================
 */

import { SelectOption } from '../Select';

// ================================================================
// FIELD TYPES
// ================================================================

/**
 * Supported field input types
 */
export type EntityFieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'number'
  | 'email'
  | 'datetime-local'
  | 'date'
  | 'url'
  | 'hidden';

/**
 * Field validation result
 */
export interface FieldValidationResult {
  isValid: boolean;
  errorKey?: string; // Translation key for error message
}

/**
 * Field validation function
 * Returns undefined if valid, or translation key for error message
 */
export type FieldValidator = (value: unknown, formData: Record<string, unknown>) => string | undefined;

/**
 * Permission check function
 * Returns true if user can edit the field
 */
export type FieldPermissionCheck = (fieldName: string, permissionLevel: number) => boolean;

/**
 * Permission check for visibility
 * Returns true if user can view the field
 */
export type FieldVisibilityCheck = (fieldName: string, permissionLevel: number) => boolean;

// ================================================================
// FIELD CONFIGURATION
// ================================================================

/**
 * Base field configuration (common properties)
 */
interface EntityFieldBase {
  /**
   * Field name (key in form data)
   * Must match the entity property name
   */
  name: string;

  /**
   * Field input type
   */
  type: EntityFieldType;

  /**
   * Translation key for field label
   * @example 'pages.issues.details.title'
   */
  labelKey: string;

  /**
   * Translation key for placeholder text
   * @optional
   */
  placeholderKey?: string;

  /**
   * Whether field is required
   * @default false
   */
  required?: boolean;

  /**
   * Field width in grid layout
   * - 'full': Full width (1fr)
   * - 'half': Half width (spans 1 column in 2-column grid)
   * @default 'half'
   */
  width?: 'full' | 'half';

  /**
   * Custom validation function
   * @param value - Current field value
   * @param formData - All form data (for cross-field validation)
   * @returns Translation key for error, or undefined if valid
   */
  validate?: FieldValidator;

  /**
   * Permission field name for edit access check
   * If not set, uses the field name
   */
  permissionField?: string;

  /**
   * Translation key for hint text (info icon)
   */
  hintKey?: string;

  /**
   * Max width for hint tooltip
   */
  hintMaxWidth?: number;

  /**
   * Minimum value (for number/date fields)
   */
  min?: number | string;

  /**
   * Maximum value (for number/date fields)
   */
  max?: number | string;

  /**
   * Max length for text inputs
   */
  maxLength?: number;

  /**
   * Min length for text inputs
   */
  minLength?: number;

  /**
   * Number of rows (for textarea)
   * @default 4
   */
  rows?: number;

  /**
   * Whether field should be visually blurred (hidden data)
   * @default false
   */
  blur?: boolean;

  /**
   * Whether field is always disabled (immutable)
   * @default false
   */
  disabled?: boolean;
}

/**
 * Select field configuration
 */
interface EntityFieldSelect extends EntityFieldBase {
  type: 'select';
  /**
   * Options for select field
   * Can be static array or function that returns options
   */
  options: SelectOption[] | (() => SelectOption[]);
}

/**
 * Non-select field configuration
 */
interface EntityFieldOther extends EntityFieldBase {
  type: Exclude<EntityFieldType, 'select'>;
}

/**
 * Union type for all field configurations
 */
export type EntityField = EntityFieldSelect | EntityFieldOther;

// ================================================================
// SECTION CONFIGURATION
// ================================================================

/**
 * Section configuration for grouping fields
 */
export interface EntitySection {
  /**
   * Unique section identifier
   * Used as modal ID suffix: `entity-edit-${sectionId}`
   */
  id: string;

  /**
   * Translation key for section title (modal header)
   * @example 'pages.issues.edit.overviewTitle'
   */
  titleKey: string;

  /**
   * Fields in this section
   */
  fields: EntityField[];

  /**
   * Whether section uses grid layout (2 columns)
   * If false, uses stack layout (1 column)
   * @default false
   */
  useGrid?: boolean;
}

// ================================================================
// ENTITY CONFIGURATION
// ================================================================

/**
 * Permission configuration for entity editing
 */
export interface EntityPermissionConfig {
  /**
   * Function to check if field can be edited
   */
  canEdit: FieldPermissionCheck;

  /**
   * Function to check if field is visible
   * @optional - defaults to always visible
   */
  canView?: FieldVisibilityCheck;

  /**
   * Function to get reason why field is not editable
   * Returns translation key for tooltip
   */
  getEditReasonKey?: (fieldName: string, permissionLevel: number) => string | undefined;
}

/**
 * Complete entity edit configuration
 */
export interface EntityEditConfig<TEntity extends Record<string, unknown> = Record<string, unknown>> {
  /**
   * Entity type name (for logging/debugging)
   * @example 'issue', 'contact', 'order'
   */
  entityName: string;

  /**
   * Sections available for editing
   */
  sections: EntitySection[];

  /**
   * Permission configuration
   */
  permissions: EntityPermissionConfig;

  /**
   * Custom save handler that extracts only changed fields
   * @param currentData - Current form data
   * @param originalData - Original entity data
   * @param sectionId - Which section is being saved
   * @returns Object with only changed fields
   */
  extractChanges?: (
    currentData: Record<string, unknown>,
    originalData: TEntity,
    sectionId: string
  ) => Partial<TEntity>;

  /**
   * Custom data initialization
   * Maps entity data to form data format
   */
  initializeFormData?: (entity: TEntity, sectionId: string) => Record<string, unknown>;
}

// ================================================================
// MODAL PROPS
// ================================================================

/**
 * Props for EntityEditModal component
 */
export interface EntityEditModalProps<TEntity extends Record<string, unknown> = Record<string, unknown>> {
  /**
   * Whether modal is open
   */
  isOpen: boolean;

  /**
   * Callback when modal closes
   */
  onClose: () => void;

  /**
   * Callback when user saves
   * @param changes - Object with only changed fields
   * @param permissionLevel - User's permission level
   * @returns Promise<boolean> - true if save succeeded
   */
  onSave: (changes: Partial<TEntity>, permissionLevel: number) => Promise<boolean>;

  /**
   * Entity data to edit
   */
  entity: TEntity;

  /**
   * Which section to edit
   */
  sectionId: string;

  /**
   * Entity edit configuration
   */
  config: EntityEditConfig<TEntity>;

  /**
   * Current user permission level (0-100)
   */
  permissionLevel: number;

  /**
   * Parent modal ID for nested modals
   */
  parentModalId?: string;

  /**
   * Modal size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Maximum width override
   */
  maxWidth?: string;
}
