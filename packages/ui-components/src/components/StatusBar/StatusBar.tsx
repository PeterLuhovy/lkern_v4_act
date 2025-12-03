/*
 * ================================================================
 * FILE: StatusBar.tsx
 * PATH: packages/ui-components/src/components/StatusBar/StatusBar.tsx
 * DESCRIPTION: Status bar component with real-time system monitoring (frontend only)
 * VERSION: v1.0.0
 * UPDATED: 2025-11-30
 * PORTED FROM: v3 packages/page-templates/src/components/StatusBar/
 * NOTE: Backend integration pending - uses mock data for now
 * ================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation, useTheme } from '@l-kern/config';
import styles from './StatusBar.module.css';

// === INTERFACES ===
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

export const StatusBar: React.FC<StatusBarProps> = ({
  services = {},
  onBackup,
  onRefresh,
  initialBackupInfo = null,
  currentUser,
  onExpandedChange,
  onExpandedHeightChange,
  dataSource = 'mock',
  dataSourceError,
}) => {
  const { t, language, setLanguage, availableLanguages } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  // === STATE ===
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBackupRunning, setIsBackupRunning] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [backupStatus, setBackupStatus] = useState('');
  const [lastBackupInfo, setLastBackupInfo] = useState<BackupInfo | null>(initialBackupInfo);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  // Load custom height from localStorage
  const [expandedHeight, setExpandedHeight] = useState<number>(() => {
    if (typeof window === 'undefined') return 300;
    const saved = localStorage.getItem('l-kern-statusbar-height');
    return saved ? parseInt(saved, 10) : 300;
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartHeight, setDragStartHeight] = useState(0);

  // === REF FOR CLICK OUTSIDE DETECTION ===
  const statusBarRef = useRef<HTMLDivElement>(null);

  // === NOTIFY PARENT WHEN EXPANDED STATE CHANGES ===
  useEffect(() => {
    if (onExpandedChange) {
      onExpandedChange(isExpanded);
    }
  }, [isExpanded, onExpandedChange]);

  // === NOTIFY PARENT ABOUT INITIAL HEIGHT ===
  useEffect(() => {
    if (onExpandedHeightChange) {
      onExpandedHeightChange(expandedHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount

  // === CLICK OUTSIDE TO COLLAPSE ===
  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (statusBarRef.current && !statusBarRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    // Add listener after a short delay to prevent immediate collapse
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // === RESIZE HANDLERS ===
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStartY(e.clientY);
    setDragStartHeight(expandedHeight);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = dragStartY - e.clientY;
      const newHeight = Math.max(150, Math.min(600, dragStartHeight + deltaY));
      setExpandedHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      localStorage.setItem('l-kern-statusbar-height', expandedHeight.toString());
      if (onExpandedHeightChange) {
        onExpandedHeightChange(expandedHeight);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStartY, dragStartHeight, expandedHeight, onExpandedHeightChange]);

  // === HELPER FUNCTIONS ===
  const getStatusColor = (status: ServiceStatus['status']): string => {
    const colorMap = {
      healthy: 'var(--color-status-success, #4caf50)',
      unhealthy: 'var(--color-status-warning, #ff9800)',
      down: 'var(--color-status-error, #f44336)',
      unknown: 'var(--theme-text-muted, #757575)',
    };
    return colorMap[status] || colorMap.unknown;
  };

  const getStatusIcon = (status: ServiceStatus['status']): string => {
    const iconMap = {
      healthy: '●',
      unhealthy: '⚠',
      down: '●',
      unknown: '?',
    };
    return iconMap[status] || '?';
  };

  // === BACKUP FUNCTIONS ===
  const fetchLastBackupInfo = async () => {
    // Mock data - backend integration pending
    setLastBackupInfo({
      completed_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      files: 15,
      status: 'completed',
    });
  };

  const handleBackup = async () => {
    if (!onBackup) {
      // Fallback mock backup if no callback provided
      try {
        setIsBackupRunning(true);
        setBackupProgress(0);
        setBackupStatus(t('statusBar.backup.starting'));

        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 20;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setIsBackupRunning(false);
            setBackupStatus(t('statusBar.backup.completed', { files: '15' }));

            setTimeout(() => {
              fetchLastBackupInfo();
              setBackupStatus('');
            }, 3000);
          }
          setBackupProgress(Math.round(progress));
          const current = Math.round(progress / 10);
          setBackupStatus(t('statusBar.backup.processing', { current: current.toString(), total: '10' }));
        }, 500);
      } catch (error) {
        console.error('Error starting backup:', error);
        setIsBackupRunning(false);
        setBackupStatus(t('statusBar.backup.error'));
      }
    } else {
      try {
        setIsBackupRunning(true);
        await onBackup();
        setIsBackupRunning(false);
        fetchLastBackupInfo();
      } catch (error) {
        console.error('Backup error:', error);
        setIsBackupRunning(false);
        setBackupStatus(t('statusBar.backup.error'));
      }
    }
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      await onRefresh();
    }
    setLastUpdateTime(new Date());
  };

  // === EFFECTS ===
  useEffect(() => {
    if (!initialBackupInfo) {
      fetchLastBackupInfo();
    }
  }, [initialBackupInfo]);

  // === COMPUTED VALUES ===
  const servicesList = Object.values(services);
  const criticalServices = servicesList.filter((s) => s.critical);
  const otherServices = servicesList.filter((s) => !s.critical);

  const allCriticalHealthy = criticalServices.every((s) => s.status === 'healthy');
  const allServicesHealthy = servicesList.every((s) => s.status === 'healthy');

  const activeServicesCount = servicesList.filter((s) => s.status === 'healthy').length;
  const totalServicesCount = servicesList.length;

  const criticalHealthyCount = criticalServices.filter((s) => s.status === 'healthy').length;
  const otherHealthyCount = otherServices.filter((s) => s.status === 'healthy').length;

  const statusMessage = allCriticalHealthy
    ? (allServicesHealthy ? t('statusBar.allServicesRunning') : t('statusBar.systemOperational'))
    : t('statusBar.criticalServicesUnhealthy');

  const statusColor = allServicesHealthy
    ? 'var(--color-status-success, #4caf50)'
    : (allCriticalHealthy
        ? 'var(--color-status-warning, #ff9800)'
        : 'var(--color-status-error, #f44336)');

  const minResponseTime = servicesList.length > 0
    ? Math.min(...servicesList.map((s) => s.response_time))
    : 0;
  const maxResponseTime = servicesList.length > 0
    ? Math.max(...servicesList.map((s) => s.response_time))
    : 0;

  return (
    <div className={styles.statusBar} ref={statusBarRef}>
      {/* RESIZE HANDLE */}
      {isExpanded && (
        <div
          className={`${styles.resizeHandle} ${isDragging ? styles.resizeHandleDragging : ''}`}
          onMouseDown={handleResizeStart}
          title={t('statusBar.dragToResize')}
        >
          <div className={styles.resizeLine} />
        </div>
      )}

      {/* HEADER (collapsed state) */}
      <div className={`${styles.header} ${isExpanded ? styles.headerExpanded : ''}`}>
        <div
          className={styles.headerContent}
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ cursor: 'pointer' }}
        >
          <span className={styles.statusText} style={{ color: statusColor }}>
            <span className={styles.statusIcon}>●</span> {statusMessage}
          </span>

          <span className={styles.servicesCount}>
            ({t('statusBar.servicesCount', {
              active: activeServicesCount.toString(),
              total: totalServicesCount.toString(),
            })})
          </span>

          <span className={styles.lastUpdated}>
            • {t('statusBar.lastUpdated', { time: lastUpdateTime.toLocaleTimeString('sk-SK') })}
          </span>

          {/* CURRENT USER INFO */}
          {currentUser && (
            <>
              <span className={styles.separator}>|</span>
              <div className={styles.userInfo}>
                <span className={styles.userAvatar}>{currentUser.avatar}</span>
                <span className={styles.userName}>{currentUser.name}</span>
                <span className={styles.separator}>•</span>
                <span className={styles.userPosition}>{currentUser.position}</span>
              </div>
            </>
          )}

          {/* DATA SOURCE INDICATOR */}
          {dataSource !== 'orchestrator' && (
            <>
              <span className={styles.separator}>|</span>
              <div
                className={`${styles.dataSource} ${styles[`dataSource${dataSource.charAt(0).toUpperCase() + dataSource.slice(1)}`]}`}
                title={dataSource === 'error' ? dataSourceError : undefined}
              >
                {dataSource === 'mock' && (
                  <>
                    <span className={styles.dataSourceIcon}>⚠️</span>
                    <span className={styles.dataSourceText}>MOCK DATA</span>
                  </>
                )}
                {dataSource === 'error' && (
                  <>
                    <span className={styles.dataSourceIcon}>🔴</span>
                    <span className={styles.dataSourceText}>ORCHESTRATOR OFFLINE</span>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        <div className={styles.headerActions}>
          {/* THEME TOGGLE */}
          <div className={styles.themeToggle}>
            <span className={styles.themeIcon}>
              {isDarkMode ? '🌙' : '☀️'}
            </span>
            <div
              className={styles.themeSlider}
              onClick={toggleTheme}
              title={isDarkMode ? t('theme.switchToLight') : t('theme.switchToDark')}
            >
              <div className={`${styles.themeSliderKnob} ${isDarkMode ? styles.themeSliderKnobDark : ''}`} />
            </div>
          </div>

          <span className={styles.separator}>•</span>

          {/* LANGUAGE TOGGLE */}
          <div className={styles.languageToggle}>
            <button
              className={styles.languageButton}
              onClick={() => {
                const currentIndex = availableLanguages.indexOf(language);
                const nextIndex = (currentIndex + 1) % availableLanguages.length;
                setLanguage(availableLanguages[nextIndex]);
              }}
              title={`Change language (${language.toUpperCase()})`}
            >
              {language.toUpperCase()}
            </button>
          </div>

          <span className={styles.separator}>•</span>

          <button
            className={styles.refreshButton}
            onClick={handleRefresh}
            title={t('statusBar.manualRefresh')}
          >
            ↻
          </button>

          <span className={styles.separator}>•</span>

          <span className={styles.expandIcon}>
            {isExpanded ? '▼' : '▲'}
          </span>
        </div>
      </div>

      {/* EXPANDED CONTENT */}
      {isExpanded && (
        <div
          className={styles.expanded}
          style={{
            maxHeight: `${expandedHeight}px`,
            height: `${expandedHeight}px`
          }}
        >
          {/* Critical services */}
          {criticalServices.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h4>{t('statusBar.sections.critical')}</h4>
                <span className={styles.sectionCount}>
                  ({criticalHealthyCount}/{criticalServices.length})
                </span>
              </div>

              <div className={styles.serviceGrid}>
                {criticalServices.map((service, index) => (
                  <div
                    key={`critical-${index}`}
                    className={`${styles.service} ${styles.serviceCritical}`}
                    title={`${service.name}: ${service.status} (${service.response_time}ms)`}
                  >
                    <span
                      className={styles.serviceIcon}
                      style={{ color: getStatusColor(service.status) }}
                    >
                      {getStatusIcon(service.status)}
                    </span>
                    <span className={styles.serviceName}>{service.name}</span>
                    <span className={styles.serviceTime}>
                      {service.response_time}ms
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other services */}
          {otherServices.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h4>{t('statusBar.sections.other')}</h4>
                <span className={styles.sectionCount}>
                  ({otherHealthyCount}/{otherServices.length})
                </span>
              </div>

              <div className={styles.serviceGrid}>
                {otherServices.map((service, index) => (
                  <div
                    key={`other-${index}`}
                    className={`${styles.service} ${styles.serviceNormal}`}
                    title={`${service.name}: ${service.status} (${service.response_time}ms)`}
                  >
                    <span
                      className={styles.serviceIcon}
                      style={{ color: getStatusColor(service.status) }}
                    >
                      {getStatusIcon(service.status)}
                    </span>
                    <span className={styles.serviceName}>{service.name}</span>
                    <span className={styles.serviceTime}>
                      {service.response_time}ms
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Databases & Backup Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h4>{t('statusBar.sections.databases')}</h4>

              {lastBackupInfo && !isBackupRunning && lastBackupInfo.completed_at && (
                <span className={styles.lastBackup}>
                  {t('statusBar.backup.lastBackup', {
                    time: new Date(lastBackupInfo.completed_at).toLocaleString('sk-SK'),
                  })}
                </span>
              )}
            </div>

            <div className={styles.serviceGrid}>
              {/* Database services */}
              {servicesList
                .filter((s) => s.name.toLowerCase().includes('database') || s.name.toLowerCase().includes('postgres') || s.name.toLowerCase().includes('redis'))
                .map((service, index) => (
                  <div
                    key={`db-${index}`}
                    className={`${styles.service} ${styles.serviceDatabase}`}
                    title={`${service.name}: ${service.status} (${service.response_time}ms)`}
                  >
                    <span
                      className={styles.serviceIcon}
                      style={{ color: getStatusColor(service.status) }}
                    >
                      🗄️
                    </span>
                    <span className={styles.serviceName}>{service.name}</span>
                    <span className={styles.serviceTime}>
                      {service.response_time}ms
                    </span>
                  </div>
                ))}

              {/* BACKUP BUTTON */}
              <div
                className={`${styles.backupButton} ${isBackupRunning ? styles.backupButtonRunning : ''}`}
                onClick={() => !isBackupRunning && handleBackup()}
                title={
                  isBackupRunning
                    ? t('statusBar.backup.progress', { percent: backupProgress.toString() })
                    : t('statusBar.backup.button')
                }
              >
                <span className={styles.backupIcon}>
                  {isBackupRunning ? '🔄' : '💾'}
                </span>
                <span className={styles.backupLabel}>
                  {isBackupRunning
                    ? t('statusBar.backup.buttonRunning')
                    : t('statusBar.backup.button')}
                </span>
                <span className={styles.backupStatus}>
                  {isBackupRunning ? `${backupProgress}%` : t('statusBar.backup.oneClick')}
                </span>
              </div>
            </div>

            {/* BACKUP PROGRESS */}
            {isBackupRunning && (
              <div className={styles.backupProgress}>
                <div className={styles.backupProgressHeader}>
                  <span>{backupStatus}</span>
                  <span>{backupProgress}%</span>
                </div>
                <div className={styles.backupProgressBar}>
                  <div
                    className={styles.backupProgressFill}
                    style={{ width: `${backupProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* BACKUP STATUS MESSAGE */}
            {backupStatus && !isBackupRunning && (
              <div
                className={`${styles.backupMessage} ${
                  backupStatus.includes('✅')
                    ? styles.backupMessageSuccess
                    : backupStatus.includes('❌')
                    ? styles.backupMessageError
                    : ''
                }`}
              >
                {backupStatus}
              </div>
            )}
          </div>

          {/* Footer info */}
          <div className={styles.footer}>
            <small>
              {activeServicesCount}/{totalServicesCount} {t('statusBar.servicesWorking')} •{' '}
              {t('statusBar.responseTimes')} {minResponseTime}-{maxResponseTime}ms
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusBar;
