/*
 * ================================================================
 * FILE: DashboardCard.tsx
 * PATH: /packages/ui-components/src/components/DashboardCard/DashboardCard.tsx
 * DESCRIPTION: Reusable dashboard card component for navigation links
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 23:15:00
 * ================================================================
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../Card/Card';
import styles from './DashboardCard.module.css';

export interface DashboardCardProps {
  /**
   * Navigation path (React Router link)
   */
  path: string;

  /**
   * Icon emoji or element
   */
  icon: React.ReactNode;

  /**
   * Card title
   */
  title: string;

  /**
   * Card description
   */
  description: string;

  /**
   * Optional custom className
   */
  className?: string;
}

/**
 * DashboardCard Component
 *
 * Reusable card component for dashboard navigation.
 * Wraps Card component with Link for routing.
 *
 * @example
 * ```tsx
 * <DashboardCard
 *   path="/testing/forms"
 *   icon="📝"
 *   title="Form Components"
 *   description="Test form inputs and validation"
 * />
 * ```
 */
export const DashboardCard: React.FC<DashboardCardProps> = ({
  path,
  icon,
  title,
  description,
  className,
}) => {
  return (
    <Link to={path} className={styles.cardLink}>
      <Card variant="elevated" className={`${styles.cardContent} ${className || ''}`}>
        <div className={styles.icon}>{icon}</div>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>
      </Card>
    </Link>
  );
};

export default DashboardCard;
