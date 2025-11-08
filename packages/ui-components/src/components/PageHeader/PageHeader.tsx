/*
 * ================================================================
 * FILE: PageHeader.tsx
 * PATH: /packages/ui-components/src/components/PageHeader/PageHeader.tsx
 * DESCRIPTION: Universal page header component with gradient design
 * VERSION: v1.0.0
 * UPDATED: 2025-11-08 12:00:00
 * ================================================================
 */

import React from 'react';
import { useTranslation } from '@l-kern/config';
import styles from './PageHeader.module.css';
import lkernLogo from '../../assets/logos/lkern-logo.png';

export interface BreadcrumbItem {
  name: string;
  href?: string;
  to?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export interface PageHeaderProps {
  /** Page title (required) */
  title: string;

  /** Optional subtitle below title */
  subtitle?: string;

  /** Optional breadcrumb navigation */
  breadcrumbs?: BreadcrumbItem[];

  /** Show logo on left side (default: false) */
  showLogo?: boolean;

  /** Custom logo icon or image URL */
  logoIcon?: string | React.ReactNode;

  /** Show L-KERN logo on right side (default: true) */
  showRightLogo?: boolean;

  /** Custom content on right side (e.g., buttons, filters) */
  children?: React.ReactNode;

  /** Additional CSS class */
  className?: string;
}

/**
 * PageHeader component
 *
 * Universal page header with title, subtitle, breadcrumbs, and logo support.
 * Uses gradient design system with purple accent border.
 *
 * @example
 * ```tsx
 * <PageHeader
 *   title="Contacts"
 *   subtitle="Manage your contacts"
 *   showLogo
 *   breadcrumbs={[
 *     { name: 'Home', href: '/' },
 *     { name: 'Contacts', isActive: true }
 *   ]}
 * >
 *   <Button>Add Contact</Button>
 * </PageHeader>
 * ```
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  showLogo = false,
  logoIcon,
  showRightLogo = true,
  children,
  className = ''
}) => {
  const { t } = useTranslation();

  return (
    <div className={`${styles.pageHeader} ${className}`}>
      <div className={styles.pageHeader__content}>
        <div className={styles.pageHeader__left}>
          {showLogo && (
            <div className={styles.pageHeader__logo}>
              {typeof logoIcon === 'string' ? (
                <img
                  src={logoIcon}
                  alt={t('components.pageHeader.logoAlt')}
                  className={styles.pageHeader__logoImage}
                />
              ) : logoIcon ? (
                logoIcon
              ) : (
                <span className={styles.pageHeader__logoPlaceholder}>
                  {t('components.pageHeader.logoPlaceholder')}
                </span>
              )}
            </div>
          )}

          <div className={styles.pageHeader__text}>
            <h1 className={styles.pageHeader__title}>{title}</h1>

            {subtitle && (
              <div className={styles.pageHeader__subtitle}>{subtitle}</div>
            )}

            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav
                className={styles.pageHeader__breadcrumbs}
                aria-label={t('components.pageHeader.breadcrumbsLabel')}
              >
                {breadcrumbs.map((item, index) => {
                  const isClickable = !!(item.href || item.to || item.onClick);
                  const breadcrumbClassName = `${styles.pageHeader__breadcrumb} ${
                    item.isActive ? styles['pageHeader__breadcrumb--active'] : ''
                  } ${
                    isClickable ? styles['pageHeader__breadcrumb--clickable'] : ''
                  }`;

                  return (
                    <React.Fragment key={index}>
                      {index > 0 && (
                        <span
                          className={styles.pageHeader__breadcrumbSeparator}
                          aria-hidden="true"
                        >
                          /
                        </span>
                      )}

                      {isClickable ? (
                        <a
                          href={item.href || item.to || '#'}
                          className={breadcrumbClassName}
                          aria-current={item.isActive ? 'page' : undefined}
                          onClick={(e) => {
                            if (item.onClick) {
                              // For React Router 'to' prop, prevent default and call onClick
                              if (item.to && !item.href) {
                                e.preventDefault();
                              }
                              item.onClick();
                            }
                          }}
                        >
                          {item.name}
                        </a>
                      ) : (
                        <span
                          className={breadcrumbClassName}
                          aria-current={item.isActive ? 'page' : undefined}
                        >
                          {item.name}
                        </span>
                      )}
                    </React.Fragment>
                  );
                })}
              </nav>
            )}
          </div>
        </div>

        {(children || showRightLogo) && (
          <div className={styles.pageHeader__right}>
            {children}
            {showRightLogo && (
              <img
                src={lkernLogo}
                alt="L-KERN Logo"
                className={styles.pageHeader__rightLogoImg}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};