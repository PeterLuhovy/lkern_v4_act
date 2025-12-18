import { default as React } from '../../../../../node_modules/react';
export interface CurrentUser {
    name: string;
    position: string;
    department: string;
    avatar: string;
}
export interface ServiceStatus {
    name: string;
    status: 'healthy' | 'unhealthy' | 'down' | 'unknown';
    critical: boolean;
    response_time: number;
}
export interface BackupInfo {
    completed_at: string | null;
    files: number;
    status: 'completed' | 'running' | 'error' | 'never';
}
export type DataSource = 'orchestrator' | 'mock' | 'error';
export interface StatusBarProps {
    services?: Record<string, ServiceStatus>;
    onBackup?: () => Promise<void>;
    onRefresh?: () => Promise<void>;
    initialBackupInfo?: BackupInfo | null;
    currentUser?: CurrentUser;
    /**
     * Callback when expanded state changes
     * Used to synchronize ThemeCustomizer position
     */
    onExpandedChange?: (isExpanded: boolean) => void;
    /**
     * Callback when expanded height changes (drag resize)
     * Used to synchronize ThemeCustomizer and KeyboardShortcutsButton position
     */
    onExpandedHeightChange?: (height: number) => void;
    /**
     * Data source indicator - where the data comes from
     * - 'orchestrator': Real data from orchestrator service
     * - 'mock': Mock/dummy data (visible warning)
     * - 'error': Orchestrator failed/offline (visible error)
     */
    dataSource?: DataSource;
    /**
     * Error message when dataSource is 'error'
     */
    dataSourceError?: string;
}
export declare const StatusBar: React.FC<StatusBarProps>;
export default StatusBar;
