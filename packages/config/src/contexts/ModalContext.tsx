/*
 * ================================================================
 * FILE: ModalContext.tsx
 * PATH: /packages/config/src/contexts/ModalContext.tsx
 * DESCRIPTION: Context provider for centralized modal management
 * VERSION: v1.0.0
 * UPDATED: 2025-10-18 17:30:00
 * ================================================================
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

// === TYPES ===

export interface ModalContextValue {
  /**
   * Array of currently open modal IDs
   */
  openModals: string[];

  /**
   * Register a modal instance
   */
  registerModal: (id: string) => void;

  /**
   * Unregister a modal instance
   */
  unregisterModal: (id: string) => void;

  /**
   * Open a modal by ID
   */
  openModal: (id: string) => void;

  /**
   * Close a modal by ID
   */
  closeModal: (id: string) => void;

  /**
   * Close all open modals
   */
  closeAll: () => void;

  /**
   * Get z-index for a modal
   * Each modal gets z-index based on stack position
   */
  getZIndex: (id: string) => number;

  /**
   * Check if a modal is open
   */
  isModalOpen: (id: string) => boolean;
}

// === CONTEXT ===

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

// === PROVIDER ===

export interface ModalProviderProps {
  children: React.ReactNode;
  /**
   * Base z-index for modals (default: 1000)
   */
  baseZIndex?: number;
}

/**
 * Provider for centralized modal management
 *
 * Handles:
 * - Modal registry (tracking open modals)
 * - Z-index calculation (stacking)
 * - Global modal operations (close all)
 *
 * @example
 * ```tsx
 * <ModalProvider>
 *   <App />
 * </ModalProvider>
 * ```
 */
export const ModalProvider: React.FC<ModalProviderProps> = ({
  children,
  baseZIndex = 1000,
}) => {
  const [openModals, setOpenModals] = useState<string[]>([]);

  // === REGISTRY ===

  const registerModal = useCallback((id: string) => {
    // No-op for now - modals self-register on mount if needed
  }, []);

  const unregisterModal = useCallback((id: string) => {
    setOpenModals((prev) => prev.filter((modalId) => modalId !== id));
  }, []);

  // === OPERATIONS ===

  const openModal = useCallback((id: string) => {
    setOpenModals((prev) => {
      if (prev.includes(id)) {
        return prev; // Already open
      }
      return [...prev, id];
    });
  }, []);

  const closeModal = useCallback((id: string) => {
    setOpenModals((prev) => prev.filter((modalId) => modalId !== id));
  }, []);

  const closeAll = useCallback(() => {
    setOpenModals([]);
  }, []);

  // === Z-INDEX ===

  const getZIndex = useCallback(
    (id: string): number => {
      const index = openModals.indexOf(id);
      if (index === -1) {
        return baseZIndex; // Not in stack
      }
      return baseZIndex + index * 10; // Each modal +10 z-index
    },
    [openModals, baseZIndex]
  );

  // === CHECK ===

  const isModalOpen = useCallback(
    (id: string): boolean => {
      return openModals.includes(id);
    },
    [openModals]
  );

  // === VALUE ===

  const value: ModalContextValue = {
    openModals,
    registerModal,
    unregisterModal,
    openModal,
    closeModal,
    closeAll,
    getZIndex,
    isModalOpen,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

// === HOOK ===

/**
 * Hook to access modal context
 *
 * @throws Error if used outside ModalProvider
 *
 * @example
 * ```tsx
 * const { openModal, closeModal } = useModalContext();
 *
 * <Button onClick={() => openModal('add-contact')}>
 *   Add Contact
 * </Button>
 * ```
 */
export const useModalContext = (): ModalContextValue => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within ModalProvider');
  }
  return context;
};

export default ModalProvider;
