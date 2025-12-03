/*
 * ================================================================
 * FILE: IssueEditModal.tsx
 * PATH: /apps/web-ui/src/pages/Issues/IssueEditModal.tsx
 * DESCRIPTION: Modal for editing issue sections (description, resolution, overview, developerInfo, people)
 * VERSION: v1.8.0
 * CREATED: 2025-11-29
 * UPDATED: 2025-11-29
 *
 * CHANGES (v1.8.0):
 *   - ADDED: People section for editing assignee_id
 *   - ADDED: Mock contacts data (TODO: Replace with Contact Service API)
 *   - ADDED: Dirty tracking for people section
 *
 * CHANGES (v1.7.0):
 *   - REMOVED: Status field (changed via /resolve, /close endpoints)
 *   - FIXED: Enum values sent as lowercase (backend expects lowercase)
 *
 * CHANGES (v1.6.0):
 *   - ADDED: Title validation (min 5, max 200 characters)
 *   - ADDED: maxLength counter
 *
 * CHANGES (v1.5.0):
 *   - ADDED: Title field to overview section (full width at top)
 *
 * CHANGES (v1.4.0):
 *   - REMOVED: Type field from overview section (not editable after creation)
 *
 * CHANGES (v1.3.0):
 *   - ADDED: Dirty tracking with useFormDirty hook
 *   - ADDED: ConfirmModal for unsaved changes warning
 *   - ADDED: Initial values tracking per section
 *
 * CHANGES (v1.2.0):
 *   - REFACTORED: Using FormField + Textarea + Select + Input components
 *   - REMOVED: Native HTML elements (textarea, select, input)
 *   - REMOVED: InfoHint import (using FormField labelHint prop)
 *   - ENHANCED: SelectOption arrays for cleaner Select integration
 *
 * CHANGES (v1.1.0):
 *   - REFACTORED: Using FormField + Select instead of native HTML elements
 *   - ADDED: labelHint support for severity/priority fields
 *   - FIXED: Dynamic translation on language change via FormField
 * ================================================================
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Modal, Button, FormField, Input, Textarea, Select, SelectOption, ConfirmModal } from '@l-kern/ui-components';
import {
  useTranslation,
  useFormDirty,
  useAuth,
  useIssueFieldPermissions,
  useAuthContext,
  canEditField as canEditFieldFromConfig,
  getFieldAccess,
  SUPER_ADMIN_LEVEL,
} from '@l-kern/config';
import type { PermissionContext } from '@l-kern/config';
import styles from './IssueEditModal.module.css';

/**
 * Maps numeric permission level (0-100) to frontend permission level (1, 2, 3)
 *
 * - 0-29: Level 1 (Basic) - ID hidden, all read-only
 * - 30-59: Level 2 (Standard) - Type/Status read-only, rest editable
 * - 60-100: Level 3 (Admin) - Full access
 */
function mapToFrontendPermissionLevel(numericLevel: number): 1 | 2 | 3 {
  if (numericLevel >= 60) return 3; // Admin
  if (numericLevel >= 30) return 2; // Standard
  return 1; // Basic
}

// ============================================================
// DATA TYPES
// ============================================================

type IssueType = 'BUG' | 'FEATURE' | 'IMPROVEMENT' | 'QUESTION' | 'bug' | 'feature' | 'improvement' | 'question';
type IssueSeverity = 'MINOR' | 'MODERATE' | 'MAJOR' | 'BLOCKER' | 'minor' | 'moderate' | 'major' | 'blocker';
type IssueStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REJECTED' | 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed' | 'rejected';
type IssuePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'low' | 'medium' | 'high' | 'critical';

export type EditSection = 'description' | 'resolution' | 'overview' | 'developerInfo' | 'people' | 'timeline' | 'activity';

/**
 * Permission levels for field access:
 * - Level 1 (Basic): ID is blurred/hidden, all other fields visible but not editable
 * - Level 2 (Standard): All visible, ID/Code/Type/Status not editable, rest editable
 * - Level 3 (Admin): All visible and editable
 */
export type PermissionLevel = 1 | 2 | 3;

interface SystemInfo {
  browser?: string;
  os?: string;
  url?: string;
  viewport?: string;
  screen?: string;
  timestamp?: string;
  userAgent?: string;
}

interface Issue {
  id: string;
  issue_code: string;
  title: string;
  description: string;
  type: IssueType;
  severity: IssueSeverity;
  status: IssueStatus;
  priority: IssuePriority;
  category?: string;
  resolution?: string;
  error_message?: string;
  error_type?: string;
  system_info?: SystemInfo;
  assignee_id?: string;
  reporter_id?: string;
  created_at?: string;
  updated_at?: string;
  resolved_at?: string;
  closed_at?: string;
}

interface IssueEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Issue>, permissionLevel: number) => Promise<boolean>;
  issue: Issue;
  section: EditSection;
  parentModalId: string;
}

// ============================================================
// FORM DATA INTERFACES (for dirty tracking)
// ============================================================

interface DescriptionFormData {
  description: string;
}

interface ResolutionFormData {
  resolution: string;
}

interface OverviewFormData {
  id: string;
  issueCode: string;
  title: string;
  type: string;
  severity: string;
  status: string;
  priority: string;
  category: string;
}

interface DeveloperInfoFormData {
  errorType: string;
  errorMessage: string;
  browser: string;
  os: string;
  url: string;
}

interface PeopleFormData {
  reporterId: string;
  assigneeId: string;
}

interface TimelineFormData {
  createdAt: string;
  updatedAt: string;
  resolvedAt: string;
  closedAt: string;
}

// Mock contact data - TODO: Replace with Contact Service API call
interface MockContact {
  id: string;
  name: string;
  position: string;
}

const MOCK_CONTACTS: MockContact[] = [
  { id: '', name: '— Nepriradené —', position: '' },
  { id: '11111111-1111-1111-1111-111111111111', name: 'Ján Novák', position: 'Senior Developer' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Mária Kováčová', position: 'Team Lead' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Peter Horváth', position: 'QA Engineer' },
  { id: '44444444-4444-4444-4444-444444444444', name: 'Anna Szabóová', position: 'Product Manager' },
];

// ============================================================
// COMPONENT
// ============================================================

export function IssueEditModal({
  isOpen,
  onClose,
  onSave,
  issue,
  section,
  parentModalId,
}: IssueEditModalProps) {
  const { t } = useTranslation();
  const { user } = useAuth();

  // ============================================================
  // PERMISSION LEVEL FROM GLOBAL CONTEXT
  // ============================================================

  // Get numeric permission level (0-100) from global AuthContext
  const { permissionLevel: globalPermissionLevel } = useAuthContext();

  // Map to frontend level (1, 2, 3) for field access control
  const permissionLevel: PermissionLevel = mapToFrontendPermissionLevel(globalPermissionLevel);

  // ============================================================
  // FIELD-LEVEL PERMISSIONS (based on permission level)
  // ============================================================

  /**
   * Check if field is visible (not blurred)
   * Level 1: ID is blurred/hidden
   * Level 2+: All visible
   */
  const canViewField = (field: string): boolean => {
    if (permissionLevel === 1) {
      // Level 1: ID is blurred
      return field !== 'id';
    }
    // Level 2, 3: All visible
    return true;
  };

  /**
   * Check if field can be edited
   *
   * Uses centralized permission system from @l-kern/config.
   * Checks edit_level from ISSUE_FIELD_PERMISSIONS.
   *
   * Permission ranges:
   * - 0-29 (Basic): description only
   * - 30-59 (Standard): description
   * - 60-99 (Admin): title, severity, priority, category, etc.
   * - 100 (Super Admin): type, status, issue_code
   *
   * IMMUTABLE (NEVER editable):
   * - id: Foreign key integrity
   */
  const canEditField = (field: string): boolean => {
    return canEditFieldFromConfig('issue', field, globalPermissionLevel);
  };

  // Helper: get permission reason for tooltip
  const getFieldReason = (field: string): string | undefined => {
    const access = getFieldAccess('issue', field, globalPermissionLevel);

    // If editable, no reason needed
    if (access.access === 'editable') {
      return undefined;
    }

    // Use centralized reason key if available
    if (access.reasonKey) {
      return t(access.reasonKey);
    }

    // Fallback reasons for specific cases
    if (field === 'id') {
      return t('pages.issues.edit.immutableFieldHint');
    }
    if (field === 'issue_code' || field === 'type' || field === 'status') {
      return t('pages.issues.edit.superAdminOnlyHint');
    }

    return t('pages.issues.edit.noEditAccessHint');
  };

  // ============================================================
  // STATE - All fields
  // ============================================================

  // Description
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState<string | undefined>();

  // Resolution
  const [resolution, setResolution] = useState('');

  // Overview fields
  const [issueId, setIssueId] = useState('');
  const [issueCode, setIssueCode] = useState('');
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState<string | undefined>();
  const [type, setType] = useState<IssueType>('bug');
  const [severity, setSeverity] = useState<IssueSeverity>('moderate');
  const [status, setStatus] = useState<IssueStatus>('open');
  const [priority, setPriority] = useState<IssuePriority>('medium');
  const [category, setCategory] = useState('');

  // Developer Info fields
  const [errorType, setErrorType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [browser, setBrowser] = useState('');
  const [os, setOs] = useState('');
  const [url, setUrl] = useState('');

  // People fields
  const [reporterId, setReporterId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');

  // Timeline fields
  const [createdAt, setCreatedAt] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [resolvedAt, setResolvedAt] = useState('');
  const [closedAt, setClosedAt] = useState('');

  // Loading state
  const [isSaving, setIsSaving] = useState(false);

  // Confirm modal state
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  // ============================================================
  // INITIAL VALUES (for dirty tracking)
  // ============================================================

  const [initialDescription, setInitialDescription] = useState<DescriptionFormData>({ description: '' });
  const [initialResolution, setInitialResolution] = useState<ResolutionFormData>({ resolution: '' });
  const [initialOverview, setInitialOverview] = useState<OverviewFormData>({
    id: '',
    issueCode: '',
    title: '',
    type: 'bug',
    severity: 'moderate',
    status: 'open',
    priority: 'medium',
    category: '',
  });
  const [initialDeveloperInfo, setInitialDeveloperInfo] = useState<DeveloperInfoFormData>({
    errorType: '',
    errorMessage: '',
    browser: '',
    os: '',
    url: '',
  });
  const [initialPeople, setInitialPeople] = useState<PeopleFormData>({
    reporterId: '',
    assigneeId: '',
  });
  const [initialTimeline, setInitialTimeline] = useState<TimelineFormData>({
    createdAt: '',
    updatedAt: '',
    resolvedAt: '',
    closedAt: '',
  });

  // ============================================================
  // CURRENT VALUES (for dirty tracking)
  // ============================================================

  const currentDescription = useMemo<DescriptionFormData>(() => ({ description }), [description]);
  const currentResolution = useMemo<ResolutionFormData>(() => ({ resolution }), [resolution]);
  const currentOverview = useMemo<OverviewFormData>(() => ({
    id: issueId,
    issueCode,
    title,
    type: type as string,
    severity: severity as string,
    status: status as string,
    priority: priority as string,
    category,
  }), [issueId, issueCode, title, type, severity, status, priority, category]);
  const currentDeveloperInfo = useMemo<DeveloperInfoFormData>(() => ({
    errorType,
    errorMessage,
    browser,
    os,
    url,
  }), [errorType, errorMessage, browser, os, url]);
  const currentPeople = useMemo<PeopleFormData>(() => ({
    reporterId,
    assigneeId,
  }), [reporterId, assigneeId]);
  const currentTimeline = useMemo<TimelineFormData>(() => ({
    createdAt,
    updatedAt,
    resolvedAt,
    closedAt,
  }), [createdAt, updatedAt, resolvedAt, closedAt]);

  // ============================================================
  // DIRTY TRACKING (per section)
  // ============================================================

  const { isDirty: isDescriptionDirty } = useFormDirty(initialDescription, currentDescription);
  const { isDirty: isResolutionDirty } = useFormDirty(initialResolution, currentResolution);
  const { isDirty: isOverviewDirty } = useFormDirty(initialOverview, currentOverview);
  const { isDirty: isDeveloperInfoDirty } = useFormDirty(initialDeveloperInfo, currentDeveloperInfo);
  const { isDirty: isPeopleDirty } = useFormDirty(initialPeople, currentPeople);
  const { isDirty: isTimelineDirty } = useFormDirty(initialTimeline, currentTimeline);

  // Get isDirty for current section
  const isDirty = useMemo(() => {
    switch (section) {
      case 'description':
        return isDescriptionDirty;
      case 'resolution':
        return isResolutionDirty;
      case 'overview':
        return isOverviewDirty;
      case 'developerInfo':
        return isDeveloperInfoDirty;
      case 'people':
        return isPeopleDirty;
      case 'timeline':
        return isTimelineDirty;
      default:
        return false;
    }
  }, [section, isDescriptionDirty, isResolutionDirty, isOverviewDirty, isDeveloperInfoDirty, isPeopleDirty, isTimelineDirty]);

  // ============================================================
  // INIT - Load values when modal opens
  // ============================================================

  useEffect(() => {
    if (isOpen && issue) {
      // Initialize based on section
      if (section === 'description') {
        const desc = issue.description || '';
        setDescription(desc);
        setInitialDescription({ description: desc });
        validateDescription(desc);
      } else if (section === 'resolution') {
        const res = issue.resolution || '';
        setResolution(res);
        setInitialResolution({ resolution: res });
      } else if (section === 'overview') {
        const id = issue.id || '';
        const code = issue.issue_code || '';
        const tit = issue.title || '';
        const typ = issue.type.toLowerCase() as IssueType;
        const sev = issue.severity.toLowerCase() as IssueSeverity;
        const stat = issue.status.toLowerCase() as IssueStatus;
        const prio = issue.priority.toLowerCase() as IssuePriority;
        const cat = issue.category || '';
        setIssueId(id);
        setIssueCode(code);
        setTitle(tit);
        setType(typ);
        setSeverity(sev);
        setStatus(stat);
        setPriority(prio);
        setCategory(cat);
        setInitialOverview({
          id,
          issueCode: code,
          title: tit,
          type: typ,
          severity: sev,
          status: stat,
          priority: prio,
          category: cat,
        });
        // Clear any previous errors
        setTitleError(undefined);
      } else if (section === 'developerInfo') {
        const errType = issue.error_type || '';
        const errMsg = issue.error_message || '';
        const brows = issue.system_info?.browser || '';
        const osVal = issue.system_info?.os || '';
        const urlVal = issue.system_info?.url || '';
        setErrorType(errType);
        setErrorMessage(errMsg);
        setBrowser(brows);
        setOs(osVal);
        setUrl(urlVal);
        setInitialDeveloperInfo({
          errorType: errType,
          errorMessage: errMsg,
          browser: brows,
          os: osVal,
          url: urlVal,
        });
      } else if (section === 'people') {
        const repId = issue.reporter_id || '';
        const assId = issue.assignee_id || '';
        setReporterId(repId);
        setAssigneeId(assId);
        setInitialPeople({
          reporterId: repId,
          assigneeId: assId,
        });
      } else if (section === 'timeline') {
        const created = issue.created_at || '';
        const updated = issue.updated_at || '';
        const resolved = issue.resolved_at || '';
        const closed = issue.closed_at || '';
        setCreatedAt(created);
        setUpdatedAt(updated);
        setResolvedAt(resolved);
        setClosedAt(closed);
        setInitialTimeline({
          createdAt: created,
          updatedAt: updated,
          resolvedAt: resolved,
          closedAt: closed,
        });
      }
    }
  }, [isOpen, issue, section]);

  // ============================================================
  // CLOSE HANDLER (with dirty check)
  // ============================================================

  const handleCloseAttempt = useCallback(() => {
    if (isDirty) {
      setShowConfirmClose(true);
    } else {
      onClose();
    }
  }, [isDirty, onClose]);

  const handleConfirmClose = useCallback(() => {
    setShowConfirmClose(false);
    onClose();
  }, [onClose]);

  const handleCancelClose = useCallback(() => {
    setShowConfirmClose(false);
  }, []);

  // ============================================================
  // VALIDATION
  // ============================================================

  // Store error KEY (not translated message) for dynamic translation
  const validateDescription = (value: string): string | undefined => {
    if (!value || value.length < 10) {
      const errorKey = 'issues.validation.descriptionMinLength';
      setDescriptionError(errorKey);
      return errorKey;
    }
    setDescriptionError(undefined);
    return undefined;
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    validateDescription(value);
  };

  // Translate error at render time for dynamic language switching
  const translatedDescriptionError = descriptionError ? t(descriptionError) : undefined;

  // Title validation (min 5 characters, max 200)
  const validateTitle = (value: string): string | undefined => {
    if (!value || value.length < 5) {
      const errorKey = 'issues.validation.titleMinLength';
      setTitleError(errorKey);
      return errorKey;
    }
    if (value.length > 200) {
      const errorKey = 'issues.validation.titleMaxLength';
      setTitleError(errorKey);
      return errorKey;
    }
    setTitleError(undefined);
    return undefined;
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    validateTitle(value);
  };

  const translatedTitleError = titleError ? t(titleError) : undefined;

  // ============================================================
  // SAVE HANDLER
  // ============================================================

  const handleSave = async () => {
    // Validate if needed
    if (section === 'description') {
      const error = validateDescription(description);
      if (error) return;
    }
    if (section === 'overview') {
      const error = validateTitle(title);
      if (error) return;
    }

    setIsSaving(true);

    try {
      const updates: Partial<Issue> = {};

      if (section === 'description') {
        updates.description = description;
      } else if (section === 'resolution') {
        updates.resolution = resolution;
      } else if (section === 'overview') {
        // Only include fields that the permission level allows to edit
        if (canEditField('id')) {
          updates.id = issueId;
        }
        if (canEditField('issue_code')) {
          updates.issue_code = issueCode;
        }
        if (canEditField('title')) {
          updates.title = title;
        }
        if (canEditField('type')) {
          updates.type = type.toLowerCase() as IssueType;
        }
        if (canEditField('severity')) {
          updates.severity = severity.toLowerCase() as IssueSeverity;
        }
        if (canEditField('status')) {
          updates.status = status.toLowerCase() as IssueStatus;
        }
        if (canEditField('priority')) {
          updates.priority = priority.toLowerCase() as IssuePriority;
        }
        if (canEditField('category')) {
          updates.category = category ? category.toLowerCase() : undefined;
        }
      } else if (section === 'developerInfo') {
        updates.error_type = errorType || undefined;
        updates.error_message = errorMessage || undefined;
        updates.system_info = {
          ...issue.system_info,
          browser: browser || undefined,
          os: os || undefined,
          url: url || undefined,
        };
      } else if (section === 'people') {
        updates.reporter_id = reporterId || undefined;
        updates.assignee_id = assigneeId || undefined;
      } else if (section === 'timeline') {
        updates.created_at = createdAt || undefined;
        updates.updated_at = updatedAt || undefined;
        updates.resolved_at = resolvedAt || undefined;
        updates.closed_at = closedAt || undefined;
      }

      // Send raw permission level (0-100) to backend for proper super admin detection
      const success = await onSave(updates, globalPermissionLevel);
      if (success) {
        onClose();
      }
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================================
  // MODAL TITLE
  // ============================================================

  const getTitle = (): string => {
    switch (section) {
      case 'description':
        return t('pages.issues.edit.descriptionTitle');
      case 'resolution':
        return t('pages.issues.edit.resolutionTitle');
      case 'overview':
        return t('pages.issues.edit.overviewTitle');
      case 'developerInfo':
        return t('pages.issues.edit.developerInfoTitle');
      case 'people':
        return t('pages.issues.edit.peopleTitle');
      case 'timeline':
        return t('pages.issues.edit.timelineTitle');
      case 'activity':
        return t('pages.issues.edit.activityTitle');
      default:
        return t('common.edit');
    }
  };

  // ============================================================
  // RENDER SECTION CONTENT
  // ============================================================

  // ============================================================
  // SELECT OPTIONS - Memoized for Select component
  // ============================================================

  const typeOptions: SelectOption[] = [
    { value: 'bug', label: t('pages.issues.types.bug') },
    { value: 'feature', label: t('pages.issues.types.feature') },
    { value: 'improvement', label: t('pages.issues.types.improvement') },
    { value: 'question', label: t('pages.issues.types.question') },
  ];

  const severityOptions: SelectOption[] = [
    { value: 'minor', label: t('pages.issues.filters.severityMinor') },
    { value: 'moderate', label: t('pages.issues.filters.severityModerate') },
    { value: 'major', label: t('pages.issues.filters.severityMajor') },
    { value: 'blocker', label: t('pages.issues.filters.severityBlocker') },
  ];

  const statusOptions: SelectOption[] = [
    { value: 'open', label: t('pages.issues.filters.statusOpen') },
    { value: 'assigned', label: t('pages.issues.filters.statusAssigned') },
    { value: 'in_progress', label: t('pages.issues.filters.statusInProgress') },
    { value: 'resolved', label: t('pages.issues.filters.statusResolved') },
    { value: 'closed', label: t('pages.issues.filters.statusClosed') },
    { value: 'rejected', label: t('pages.issues.filters.statusRejected') },
  ];

  const priorityOptions: SelectOption[] = [
    { value: 'low', label: t('pages.issues.filters.priorityLow') },
    { value: 'medium', label: t('pages.issues.filters.priorityMedium') },
    { value: 'high', label: t('pages.issues.filters.priorityHigh') },
    { value: 'critical', label: t('pages.issues.filters.priorityCritical') },
  ];

  const categoryOptions: SelectOption[] = [
    { value: '', label: t('common.select') },
    { value: 'ui', label: 'UI' },
    { value: 'backend', label: 'Backend' },
    { value: 'database', label: 'Database' },
    { value: 'integration', label: 'Integration' },
    { value: 'docs', label: 'Documentation' },
    { value: 'performance', label: 'Performance' },
    { value: 'security', label: 'Security' },
  ];

  // Assignee options from mock contacts
  // TODO: Replace with Contact Service API call when service is ready
  const assigneeOptions: SelectOption[] = MOCK_CONTACTS.map((contact) => ({
    value: contact.id,
    label: contact.position ? `${contact.name} (${contact.position})` : contact.name,
  }));

  const renderContent = () => {
    switch (section) {
      case 'description':
        return (
          <FormField
            label={t('pages.issues.details.description')}
            required
            error={translatedDescriptionError}
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            htmlFor="edit-description"
            reserveMessageSpace
            validate={(value) => {
              if (!value || value.length < 10) {
                return t('issues.validation.descriptionMinLength');
              }
              return undefined;
            }}
          >
            <Textarea
              id="edit-description"
              rows={8}
              placeholder={t('pages.issues.view.descriptionPlaceholder')}
              fullWidth
              disabled={!canEditField('description')}
              title={getFieldReason('description')}
            />
          </FormField>
        );

      case 'resolution':
        return (
          <FormField
            label={t('pages.issues.details.resolution')}
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            htmlFor="edit-resolution"
          >
            <Textarea
              id="edit-resolution"
              rows={8}
              placeholder={t('pages.issues.view.resolutionPlaceholder')}
              fullWidth
              disabled={!canEditField('resolution')}
              title={getFieldReason('resolution')}
            />
          </FormField>
        );

      case 'overview':
        return (
          <div className={styles.stack}>
            {/* Row 1: ID and Code */}
            <div className={styles.grid}>
              <div className={!canViewField('id') ? styles.blurredField : (!canEditField('id') ? styles.noEditAccess : undefined)}>
                <FormField
                  label={t('pages.issues.details.id')}
                  value={issueId}
                  onChange={(e) => setIssueId(e.target.value)}
                  htmlFor="edit-id"
                >
                  <Input
                    id="edit-id"
                    fullWidth
                    disabled={!canEditField('id')}
                    title={getFieldReason('id')}
                  />
                </FormField>
              </div>

              <div className={!canEditField('issue_code') ? styles.noEditAccess : undefined}>
                <FormField
                  label={t('pages.issues.details.issue_code')}
                  value={issueCode}
                  onChange={(e) => setIssueCode(e.target.value)}
                  htmlFor="edit-issue-code"
                >
                  <Input
                    id="edit-issue-code"
                    fullWidth
                    disabled={!canEditField('issue_code')}
                    title={getFieldReason('issue_code')}
                  />
                </FormField>
              </div>
            </div>

            {/* Title field - full width */}
            <div className={!canEditField('title') ? styles.noEditAccess : undefined}>
              <FormField
                label={t('pages.issues.details.title')}
                required
                error={translatedTitleError}
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                htmlFor="edit-title"
                reserveMessageSpace
                maxLength={200}
                validate={(value) => {
                  if (!value || value.length < 5) {
                    return t('issues.validation.titleMinLength');
                  }
                  if (value.length > 200) {
                    return t('issues.validation.titleMaxLength');
                  }
                  return undefined;
                }}
              >
                <Input
                  id="edit-title"
                  placeholder={t('issues.form.titlePlaceholder')}
                  fullWidth
                  disabled={!canEditField('title')}
                  title={getFieldReason('title')}
                />
              </FormField>
            </div>

            {/* Row 2: Type and Status */}
            <div className={styles.grid}>
              <div className={!canEditField('type') ? styles.noEditAccess : undefined}>
                <FormField
                  label={t('pages.issues.details.type')}
                  value={type}
                  onChange={(e) => setType(e.target.value as IssueType)}
                  htmlFor="edit-type"
                >
                  <Select
                    id="edit-type"
                    options={typeOptions}
                    fullWidth
                    disabled={!canEditField('type')}
                    title={getFieldReason('type')}
                  />
                </FormField>
              </div>

              <div className={!canEditField('status') ? styles.noEditAccess : undefined}>
                <FormField
                  label={t('pages.issues.details.status')}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as IssueStatus)}
                  htmlFor="edit-status"
                >
                  <Select
                    id="edit-status"
                    options={statusOptions}
                    fullWidth
                    disabled={!canEditField('status')}
                    title={getFieldReason('status')}
                  />
                </FormField>
              </div>
            </div>

            {/* Row 3: Severity and Priority */}
            <div className={styles.grid}>
              <div className={!canEditField('severity') ? styles.noEditAccess : undefined}>
                <FormField
                  label={t('pages.issues.details.severity')}
                  labelHint={t('pages.issues.edit.severityVsPriorityInfo')}
                  labelHintMaxWidth={500}
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as IssueSeverity)}
                  htmlFor="edit-severity"
                >
                  <Select
                    id="edit-severity"
                    options={severityOptions}
                    fullWidth
                    disabled={!canEditField('severity')}
                    title={getFieldReason('severity')}
                  />
                </FormField>
              </div>

              <div className={!canEditField('priority') ? styles.noEditAccess : undefined}>
                <FormField
                  label={t('pages.issues.details.priority')}
                  labelHint={t('pages.issues.edit.severityVsPriorityInfo')}
                  labelHintMaxWidth={500}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as IssuePriority)}
                  htmlFor="edit-priority"
                >
                  <Select
                    id="edit-priority"
                    options={priorityOptions}
                    fullWidth
                    disabled={!canEditField('priority')}
                    title={getFieldReason('priority')}
                  />
                </FormField>
              </div>
            </div>

            {/* Category - full width */}
            <div className={!canEditField('category') ? styles.noEditAccess : undefined}>
              <FormField
                label={t('pages.issues.details.category')}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                htmlFor="edit-category"
              >
                <Select
                  id="edit-category"
                  options={categoryOptions}
                  fullWidth
                  disabled={!canEditField('category')}
                  title={getFieldReason('category')}
                />
              </FormField>
            </div>
          </div>
        );

      case 'developerInfo':
        return (
          <div className={styles.stack}>
            <div className={styles.grid}>
              <FormField
                label={t('pages.issues.details.browser')}
                value={browser}
                onChange={(e) => setBrowser(e.target.value)}
                htmlFor="edit-browser"
              >
                <Input
                  id="edit-browser"
                  placeholder={t('pages.issues.edit.browserPlaceholder')}
                  fullWidth
                />
              </FormField>

              <FormField
                label={t('pages.issues.details.os')}
                value={os}
                onChange={(e) => setOs(e.target.value)}
                htmlFor="edit-os"
              >
                <Input
                  id="edit-os"
                  placeholder={t('pages.issues.edit.osPlaceholder')}
                  fullWidth
                />
              </FormField>
            </div>

            <FormField
              label={t('pages.issues.details.url')}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              htmlFor="edit-url"
            >
              <Input
                id="edit-url"
                placeholder={t('pages.issues.edit.urlPlaceholder')}
                fullWidth
              />
            </FormField>

            <div className={!canEditField('error_type') ? styles.noEditAccess : undefined}>
              <FormField
                label={t('pages.issues.details.errorType')}
                value={errorType}
                onChange={(e) => setErrorType(e.target.value)}
                htmlFor="edit-error-type"
              >
                <Input
                  id="edit-error-type"
                  placeholder={t('pages.issues.details.errorTypePlaceholder')}
                  fullWidth
                  disabled={!canEditField('error_type')}
                  title={getFieldReason('error_type')}
                />
              </FormField>
            </div>

            <div className={!canEditField('error_message') ? styles.noEditAccess : undefined}>
              <FormField
                label={t('pages.issues.details.errorMessage')}
                value={errorMessage}
                onChange={(e) => setErrorMessage(e.target.value)}
                htmlFor="edit-error-message"
              >
                <Textarea
                  id="edit-error-message"
                  rows={6}
                  placeholder={t('pages.issues.details.errorMessagePlaceholder')}
                  fullWidth
                  disabled={!canEditField('error_message')}
                  title={getFieldReason('error_message')}
                />
              </FormField>
            </div>
          </div>
        );

      case 'people':
        return (
          <div className={styles.stack}>
            <div className={!canEditField('reporter_id') ? styles.noEditAccess : undefined}>
              <FormField
                label={t('pages.issues.details.reporterId')}
                labelHint={t('pages.issues.edit.reporterHint')}
                labelHintMaxWidth={400}
                value={reporterId}
                onChange={(e) => setReporterId(e.target.value)}
                htmlFor="edit-reporter"
              >
                <Select
                  id="edit-reporter"
                  options={assigneeOptions}
                  fullWidth
                  disabled={!canEditField('reporter_id')}
                  title={getFieldReason('reporter_id')}
                />
              </FormField>
            </div>

            <div className={!canEditField('assignee_id') ? styles.noEditAccess : undefined}>
              <FormField
                label={t('pages.issues.details.assignee')}
                labelHint={t('pages.issues.edit.assigneeHint')}
                labelHintMaxWidth={400}
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                htmlFor="edit-assignee"
              >
                <Select
                  id="edit-assignee"
                  options={assigneeOptions}
                  fullWidth
                  disabled={!canEditField('assignee_id')}
                  title={getFieldReason('assignee_id')}
                />
              </FormField>
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div className={styles.stack}>
            <div className={styles.grid}>
              <FormField
                label={t('pages.issues.details.created_at')}
                value={createdAt}
                onChange={(e) => setCreatedAt(e.target.value)}
                htmlFor="edit-created-at"
              >
                <Input
                  id="edit-created-at"
                  type="datetime-local"
                  fullWidth
                />
              </FormField>

              <FormField
                label={t('pages.issues.details.updated')}
                value={updatedAt}
                onChange={(e) => setUpdatedAt(e.target.value)}
                htmlFor="edit-updated-at"
              >
                <Input
                  id="edit-updated-at"
                  type="datetime-local"
                  fullWidth
                />
              </FormField>
            </div>

            <div className={styles.grid}>
              <FormField
                label={t('pages.issues.details.resolved')}
                value={resolvedAt}
                onChange={(e) => setResolvedAt(e.target.value)}
                htmlFor="edit-resolved-at"
              >
                <Input
                  id="edit-resolved-at"
                  type="datetime-local"
                  fullWidth
                />
              </FormField>

              <FormField
                label={t('pages.issues.details.closed')}
                value={closedAt}
                onChange={(e) => setClosedAt(e.target.value)}
                htmlFor="edit-closed-at"
              >
                <Input
                  id="edit-closed-at"
                  type="datetime-local"
                  fullWidth
                />
              </FormField>
            </div>
          </div>
        );

      case 'activity':
        return (
          <div className={styles.stack}>
            <div className={styles.placeholderSection}>
              <p className={styles.placeholderText}>
                {t('pages.issues.edit.activityPlaceholder')}
              </p>
              <p className={styles.placeholderHint}>
                {t('pages.issues.edit.activityHint')}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  const isSaveDisabled = isSaving ||
    permissionLevel === 1 ||  // Basic users can't edit anything
    (section === 'description' && !!descriptionError) ||
    (section === 'overview' && !!titleError);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseAttempt}
        modalId={`issue-edit-${section}`}
        parentModalId={parentModalId}
        title={getTitle()}
        size="md"
        maxWidth="600px"
      >
        <div className={styles.content}>
          {renderContent()}
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
        parentModalId={`issue-edit-${section}`}
      />
    </>
  );
}
