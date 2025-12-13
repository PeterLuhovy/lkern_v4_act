/*
 * ================================================================
 * FILE: modalV3.types.ts
 * PATH: packages/config/src/translations/types/components/modalV3.types.ts
 * DESCRIPTION: Modal v3.0 component translation types
 * VERSION: v1.0.0
 * UPDATED: 2025-12-10
 * ================================================================
 */

/**
 * Translation types for Modal v3.0 component and test page
 *
 * Used in: @l-kern/ui-components/Modal v3.0
 * Test page: apps/web-ui/src/__tests__/pages/ModalV3Test.tsx
 * Keys: components.modalV3.*
 *
 * Modal v3.0 features:
 * - Drag & Drop
 * - Nested Modals
 * - Enhanced Keyboard
 * - Enhanced Footer
 * - Alignment options
 * - Submit on Enter
 * - ConfirmModal, EditItemModal, ManagementModal wrappers
 */
export interface ModalV3Translations {
  pageTitle: string;

  // Test 1: Drag & Drop
  test1: {
    title: string;
    description: string;
    buttonLabel: string;
    modalTitle: string;
    instructionsHeading: string;
    instruction1: string;
    instruction2: string;
    instruction3: string;
    instruction4: string;
  };

  // Test 2: Nested Modals
  test2: {
    title: string;
    description: string;
    buttonLabel: string;
    parentModalTitle: string;
    childModalTitle: string;
    parentContent: string;
    parentHint: string;
    childButtonLabel: string;
    childTestHeading: string;
    childInstruction1: string;
    childInstruction2: string;
    childInstruction3: string;
    childHint: string;
  };

  // Test 3: Enhanced Footer
  test3: {
    title: string;
    description: string;
    buttonLabel: string;
    modalTitle: string;
    testValidationHeading: string;
    placeholder: string;
    namePlaceholder: string;
    nameSuccess: string;
    emailPlaceholder: string;
    emailHelper: string;
    emailSuccess: string;
    messageLabel: string;
    messagePlaceholder: string;
    messageHelper: string;
    instruction1: string;
    instruction2: string;
    instruction3: string;
    instruction4: string;
    instruction5: string;
    successMessage: string;
  };

  // Test 4: Top Alignment
  test4: {
    title: string;
    description: string;
    buttonLabel: string;
    modalTitle: string;
    content: string;
  };

  // Test 5: Bottom Alignment
  test5: {
    title: string;
    description: string;
    buttonLabel: string;
    modalTitle: string;
    content: string;
  };

  // Test 6: Submit on Enter
  test6: {
    title: string;
    description: string;
    buttonLabel: string;
    modalTitle: string;
    testHeading: string;
    placeholder: string;
    hint: string;
  };

  // Test 7: Disable Drag
  test7: {
    title: string;
    description: string;
    buttonLabel: string;
    modalTitle: string;
    content: string;
  };

  // Test Confirm: useConfirm Hook
  testConfirm: {
    title: string;
    description: string;
    deleteButton: string;
    unsavedButton: string;
    result: string;
    modalTitle: string;
    deleteMessage: string;
    unsavedMessage: string;
    confirmedTrue: string;
    confirmedFalse: string;
  };

  // Feature Summary
  featureSummary: {
    title: string;
    dragDrop: string;
    dragDropDesc: string;
    enhancedKeyboard: string;
    enhancedKeyboardDesc: string;
    nestedModals: string;
    nestedModalsDesc: string;
    enhancedFooter: string;
    enhancedFooterDesc: string;
    alignment: string;
    alignmentDesc: string;
    paddingOverride: string;
    paddingOverrideDesc: string;
    modalStack: string;
    modalStackDesc: string;
  };

  // Test 8: Multi-step Wizard
  test8: {
    title: string;
    description: string;
    buttonLabel: string;
    modalTitle: string;
    step1Title: string;
    step1Content: string;
    step1Placeholder: string;
    step2Title: string;
    step2Content: string;
    step2Placeholder: string;
    step3Title: string;
    step3Content: string;
    hint: string;
    completeMessage: string;
  };

  // Test 9: ConfirmModal - Simple Mode
  test9: {
    title: string;
    description: string;
    buttonLabel: string;
    modalTitle: string;
    modalMessage: string;
  };

  // Test 10: ConfirmModal - Danger Mode
  test10: {
    title: string;
    description: string;
    buttonLabel: string;
    modalTitle: string;
    modalMessage: string;
  };

  // Test 11: ConfirmModal - Unsaved Changes
  test11: {
    title: string;
    description: string;
    buttonLabel: string;
  };

  // Test 12: EditItemModal
  test12: {
    title: string;
    description: string;
    buttonLabel: string;
    modalTitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    savedMessage: string;
    clearedMessage: string;
    closedWithChanges: string;
    closedWithoutChanges: string;
    instructions: {
      unsavedChanges: string;
      formValid: string;
      clearButton: string;
      tryClosing: string;
      changeLanguage: string;
      yes: string;
      no: string;
    };
  };

  // Test 13: ManagementModal
  test13: {
    title: string;
    description: string;
    buttonLabel: string;
    modalTitle: string;
    phoneAdded: string;
    phoneDeleted: string;
    allDeleted: string;
    saved: string;
    itemCount: string;
    emptyMessage: string;
    addButtonText: string;
    deletePhone: {
      title: string;
      message: string;
    };
    editHint: string;
    deleteHint: string;
    instructions: {
      deleteAll: string;
      addPhone: string;
      editPhone: string;
      deletePhone: string;
      emptyState: string;
    };
  };

  // Common translations
  common: {
    confirmDelete: string;
    deleted: string;
    submitted: string;
    inputEmptyError: string;
  };

  // ConfirmModal component
  confirmModal: {
    simple: {
      defaultTitle: string;
      defaultMessage: string;
      defaultConfirm: string;
      defaultCancel: string;
    };
    danger: {
      defaultTitle: string;
      defaultMessage: string;
      defaultConfirm: string;
      defaultCancel: string;
      keywordLabel: string;
      keywordPlaceholder: string;
      keywordError: string;
      confirmKeyword: string;
    };
    unsavedChanges: {
      title: string;
      message: string;
      confirmButton: string;
    };
  };

  // EditItemModal component
  editItemModal: {
    defaultSave: string;
    defaultCancel: string;
    defaultClear: string;
    clearConfirmTitle: string;
    clearConfirmMessage: string;
    clearConfirmButton: string;
  };

  // ManagementModal component
  managementModal: {
    deleteAllButton: string;
    addButton: string;
    cancelButton: string;
    doneButton: string;
    editHint: string;
    deleteHint: string;
    primaryHint: string;
    emptyState: {
      message: string;
      action: string;
    };
    deleteAll: {
      title: string;
      message: string;
    };
    deleteItem: {
      title: string;
      message: string;
    };
  };

  // SectionEditModal component
  sectionEditModal: {
    clearButton: string;
    clearConfirmTitle: string;
    clearConfirmMessage: string;
    clearConfirmButton: string;
  };
}
