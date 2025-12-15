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

export { PageHeader } from './components/PageHeader';
export type { PageHeaderProps, BreadcrumbItem } from './components/PageHeader';

export { Button, ArrowLeftIcon, ArrowRightIcon } from './components/Button';
export type { ButtonProps } from './components/Button';

export { Input } from './components/Input';
export type { InputProps } from './components/Input';

export { Textarea } from './components/Textarea';
export type { TextareaProps } from './components/Textarea';

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

export { AuthRoleSwitcher } from './components/AuthRoleSwitcher';
export type { AuthRoleSwitcherProps } from './components/AuthRoleSwitcher';

export { EmptyState } from './components/EmptyState';
export type { EmptyStateProps, EmptyStateSize } from './components/EmptyState';

export { Modal } from './components/Modal';
export type { ModalProps, ModalFooterConfig, LockInfo, ModalLockingConfig } from './components/Modal';

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

export { EntityEditModal } from './components/EntityEditModal';
export type {
  EntityEditModalProps,
  EntityEditConfig,
  EntitySection,
  EntityField,
  EntityFieldType,
  EntityPermissionConfig,
  FieldValidator,
  FieldPermissionCheck,
  FieldVisibilityCheck,
} from './components/EntityEditModal';

export { DataGrid } from './components/DataGrid';
export type { DataGridProps, Column, DataGridAction } from './components/DataGrid';

export { FilterPanel } from './components/FilterPanel';
export type { FilterPanelProps, QuickFilter, FilterGroup, RoleFilter } from './components/FilterPanel';

export { FilteredDataGrid } from './components/FilteredDataGrid';
export type { FilteredDataGridProps, FilterConfig, QuickFilterConfig } from './components/FilteredDataGrid';

export { Pagination } from './components/Pagination';
export type { PaginationProps } from './components/Pagination';

export { ReportButton } from './components/ReportButton';
export type { ReportButtonProps } from './components/ReportButton';

export { FileUpload } from './components/FileUpload';
export type { FileUploadProps } from './components/FileUpload';

export { CreateIssueModal } from './components/CreateIssueModal';
export type { UserRole, IssueType, IssueSeverity, IssueCategory, IssuePriority } from './components/CreateIssueModal';

export { IssueTypeSelectModal } from './components/IssueTypeSelectModal';
export type { IssueTypeSelectModalProps } from './components/IssueTypeSelectModal';




// NOTE: EditIssueModal removed in v1.0.0 - use EntityEditModal with config instead

export { ExportButton } from './components/ExportButton';
export type { ExportButtonProps, ExportFormat } from './components/ExportButton';

export { InfoHint } from './components/InfoHint';
export type { InfoHintProps, InfoHintPosition, InfoHintSize } from './components/InfoHint';

export { ThemeCustomizer } from './components/ThemeCustomizer';
export type { ThemeCustomizerProps } from './components/ThemeCustomizer';

export { KeyboardShortcutsButton } from './components/KeyboardShortcutsButton';
export type { KeyboardShortcutsButtonProps, KeyboardShortcut } from './components/KeyboardShortcutsButton';

export { StatusBar } from './components/StatusBar';
export type { StatusBarProps, ServiceStatus, BackupInfo, CurrentUser, DataSource } from './components/StatusBar';

export { ExportProgressModal } from './components/ExportProgressModal';
export type { ExportProgressModalProps, ExportFile, ExportProgress } from './components/ExportProgressModal';
