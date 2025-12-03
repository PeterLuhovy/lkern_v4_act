/*
 * ================================================================
 * FILE: InfoHint.tsx
 * PATH: /packages/ui-components/src/components/InfoHint/InfoHint.tsx
 * DESCRIPTION: Info hint icon with click-to-show popup tooltip
 * VERSION: v1.1.0
 * CREATED: 2025-11-29
 * UPDATED: 2025-11-29
 *
 * CHANGES (v1.1.0):
 *   - REFACTORED: Using React Portal for popup rendering
 *   - FIXED: Popup no longer clipped by modal overflow
 *   - ADDED: Dynamic positioning based on button viewport position
 * ================================================================
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styles from './InfoHint.module.css';

export type InfoHintPosition = 'top' | 'bottom' | 'left' | 'right';
export type InfoHintSize = 'small' | 'medium' | 'large';

export interface InfoHintProps {
  /**
   * Content to display in the popup
   */
  content: React.ReactNode;

  /**
   * Position of the popup relative to the icon
   * @default 'top'
   */
  position?: InfoHintPosition;

  /**
   * Size of the info icon
   * @default 'medium'
   */
  size?: InfoHintSize;

  /**
   * Custom icon (defaults to ℹ️ circle)
   */
  icon?: React.ReactNode;

  /**
   * Additional CSS class for the container
   */
  className?: string;

  /**
   * Additional CSS class for the popup
   */
  popupClassName?: string;

  /**
   * Max width of the popup in pixels
   * @default 300
   */
  maxWidth?: number;
}

interface PopupPosition {
  top: number;
  left: number;
}

export const InfoHint = React.forwardRef<HTMLDivElement, InfoHintProps>(
  (
    {
      content,
      position = 'top',
      size = 'medium',
      icon,
      className,
      popupClassName,
      maxWidth = 300,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [popupPos, setPopupPos] = useState<PopupPosition>({ top: 0, left: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    // Calculate popup position based on button position and preferred direction
    const calculatePosition = useCallback(() => {
      if (!buttonRef.current) return;

      const buttonRect = buttonRef.current.getBoundingClientRect();
      const gap = 8; // Gap between button and popup

      let top = 0;
      let left = 0;

      switch (position) {
        case 'top':
          top = buttonRect.top - gap;
          left = buttonRect.left + buttonRect.width / 2;
          break;
        case 'bottom':
          top = buttonRect.bottom + gap;
          left = buttonRect.left + buttonRect.width / 2;
          break;
        case 'left':
          top = buttonRect.top + buttonRect.height / 2;
          left = buttonRect.left - gap;
          break;
        case 'right':
          top = buttonRect.top + buttonRect.height / 2;
          left = buttonRect.right + gap;
          break;
      }

      setPopupPos({ top, left });
    }, [position]);

    // Recalculate position when opened or on scroll/resize
    useEffect(() => {
      if (isOpen) {
        calculatePosition();

        // Recalculate on scroll or resize
        const handleReposition = () => calculatePosition();
        window.addEventListener('scroll', handleReposition, true);
        window.addEventListener('resize', handleReposition);

        return () => {
          window.removeEventListener('scroll', handleReposition, true);
          window.removeEventListener('resize', handleReposition);
        };
      }
    }, [isOpen, calculatePosition]);

    // Close popup when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        const isOutsideButton = buttonRef.current && !buttonRef.current.contains(target);
        const isOutsidePopup = popupRef.current && !popupRef.current.contains(target);

        if (isOutsideButton && isOutsidePopup) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }, [isOpen]);

    const handleToggle = () => {
      setIsOpen((prev) => !prev);
    };

    const containerClasses = [styles.container, className].filter(Boolean).join(' ');

    const iconClasses = [
      styles.icon,
      styles[`icon--${size}`],
      isOpen && styles['icon--active'],
    ]
      .filter(Boolean)
      .join(' ');

    const popupClasses = [
      styles.popup,
      styles.popupPortal,
      styles[`popupPortal--${position}`],
      popupClassName,
    ]
      .filter(Boolean)
      .join(' ');

    // Render popup through portal to body
    const renderPopup = () => {
      if (!isOpen) return null;

      return createPortal(
        <div
          ref={popupRef}
          className={popupClasses}
          style={{
            position: 'fixed',
            top: popupPos.top,
            left: popupPos.left,
            width: maxWidth,
            maxWidth,
            zIndex: 10000,
          }}
          role="tooltip"
        >
          <div className={styles.popupContent}>{content}</div>
          <div className={styles.popupArrow} />
        </div>,
        document.body
      );
    };

    return (
      <div ref={containerRef} className={containerClasses}>
        <button
          ref={buttonRef}
          type="button"
          className={iconClasses}
          onClick={handleToggle}
          aria-expanded={isOpen}
          aria-haspopup="true"
          title="Zobraziť informácie"
        >
          {icon || (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.svg}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          )}
        </button>

        {renderPopup()}
      </div>
    );
  }
);

InfoHint.displayName = 'InfoHint';

export default InfoHint;
