/**
 * @file index.ts
 * @package @l-kern/ui-components
 * @description Main entry point for L-KERN UI Components library
 * @version 0.0.1
 * @date 2025-10-18
 */

// Utils
export { classNames } from './utils/classNames';

// Types
export type { Size, Variant, StatusVariant, BaseComponentProps } from './types/common';

// Components
export { BasePage } from './components/BasePage';
export type { BasePageProps } from './components/BasePage';

export { Button, ArrowLeftIcon, ArrowRightIcon } from './components/Button';
export type { ButtonProps } from './components/Button';

export { Input } from './components/Input';
export type { InputProps } from './components/Input';

export { FormField } from './components/FormField';
export type { FormFieldProps } from './components/FormField';

export { Select } from './components/Select';
export type { SelectProps, SelectOption } from './components/Select';

export { Checkbox } from './components/Checkbox';
export type { CheckboxProps } from './components/Checkbox';

export { Radio, RadioGroup } from './components/Radio';
export type { RadioProps, RadioGroupProps, RadioOption } from './components/Radio';

export { Badge } from './components/Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './components/Badge';

export { Spinner } from './components/Spinner';
export type { SpinnerProps, SpinnerSize } from './components/Spinner';

export { Card } from './components/Card';
export type { CardProps, CardVariant } from './components/Card';

export { DashboardCard } from './components/DashboardCard';
export type { DashboardCardProps } from './components/DashboardCard';

export { Sidebar } from './components/Sidebar';
export type { SidebarProps, SidebarNavItem } from './components/Sidebar';

export { EmptyState } from './components/EmptyState';
export type { EmptyStateProps, EmptyStateSize } from './components/EmptyState';

export { Modal } from './components/Modal';
export type { ModalProps, ModalFooterConfig } from './components/Modal';

export { WizardProgress } from './components/WizardProgress';
export type { WizardProgressProps } from './components/WizardProgress';

export { WizardNavigation } from './components/WizardNavigation';
export type { WizardNavigationProps } from './components/WizardNavigation';

export { DebugBar } from './components/DebugBar';
export type { DebugBarProps } from './components/DebugBar';

export { Toast } from './components/Toast';
export type { ToastProps } from './components/Toast';

export { ToastContainer } from './components/ToastContainer';
export type { ToastContainerProps } from './components/ToastContainer';

export { ConfirmModal } from './components/ConfirmModal';
export type { ConfirmModalProps } from './components/ConfirmModal';

export { EditItemModal } from './components/EditItemModal';
export type { EditItemModalProps } from './components/EditItemModal';

export { ManagementModal, managementModalStyles } from './components/ManagementModal';
export type { ManagementModalProps } from './components/ManagementModal';

export { SectionEditModal } from './components/SectionEditModal';
export type { SectionEditModalProps, FieldDefinition, ValidationResult } from './components/SectionEditModal';

export { DataGrid } from './components/DataGrid';
export type { DataGridProps, Column, DataGridAction } from './components/DataGrid';

export { FilterPanel } from './components/FilterPanel';
export type { FilterPanelProps, QuickFilter, FilterGroup, RoleFilter } from './components/FilterPanel';

export { FilteredDataGrid } from './components/FilteredDataGrid';
export type { FilteredDataGridProps, FilterConfig, QuickFilterConfig } from './components/FilteredDataGrid';
