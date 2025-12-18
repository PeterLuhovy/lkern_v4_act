export type UserRole = 'user_basic' | 'user_standard' | 'user_advance';
export type IssueType = 'bug' | 'feature' | 'improvement' | 'question';
export type IssueSeverity = 'minor' | 'moderate' | 'major' | 'blocker';
export type IssueCategory = 'ui' | 'backend' | 'database' | 'integration' | 'docs' | 'performance' | 'security' | 'data_integrity';
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';
interface CreateIssueModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: IssueFormData) => void;
    modalId?: string;
    /**
     * Show clear form button
     * @default true
     */
    showClearButton?: boolean;
    /**
     * Initial data to pre-fill form fields (e.g., from ReportButton)
     */
    initialData?: Partial<IssueFormData>;
    /**
     * Show role tabs (will be hidden once authentication is implemented)
     * @default true
     */
    showRoleTabs?: boolean;
    /**
     * User role for filtering visible fields
     * When provided, overrides selectedRole state and hides tabs
     */
    userRole?: UserRole;
    /**
     * Loading state for submit button (shown while creating issue)
     * When true, submit button shows spinner and is disabled
     * @default false
     */
    isLoading?: boolean;
}
interface SystemInfo {
    url?: string;
    browser?: string;
    os?: string;
    viewport?: string;
    screen?: string;
    timestamp?: string;
    userAgent?: string;
}
interface IssueFormData {
    title: string;
    description: string;
    type: IssueType;
    severity?: IssueSeverity;
    category?: IssueCategory;
    priority?: IssuePriority;
    error_message?: string;
    error_type?: string;
    browser?: string;
    os?: string;
    url?: string;
    attachments?: File[];
    system_info?: SystemInfo;
}
export declare function CreateIssueModal({ isOpen, onClose, onSubmit, modalId, showClearButton, initialData, showRoleTabs, userRole, isLoading }: CreateIssueModalProps): import("react/jsx-runtime").JSX.Element;
export {};
