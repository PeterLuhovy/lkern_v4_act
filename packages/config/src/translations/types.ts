/*
 * ================================================================
 * FILE: types.ts
 * PATH: packages/config/src/translations/types.ts
 * DESCRIPTION: TypeScript types for translation system
 * VERSION: v1.3.0
 * UPDATED: 2025-10-19 13:00:00
 * ================================================================
 */

// ============================================================
// PAGE TRANSLATION TYPES (Auto-imported)
// ============================================================
import type { OrdersPageTranslations } from './types/orders.types';
import type { IssuesPageTranslations } from './types/issues.types';
//--GENERATE-PAGE-PLACEHOLDER-IMPORT--

// ============================================================
// COMPONENT TRANSLATION TYPES (Modularized)
// ============================================================
// Note: ComponentsTranslations type is defined in ./types/components
// but not used directly in this file (used in implementation files)

/**
 * Supported languages in L-KERN v4
 */
export type SupportedLanguage = 'sk' | 'en';

/**
 * Translation function type
 */
export type TranslationFunction = (
  key: string,
  params?: Record<string, string | number>
) => string;

/**
 * Return type for useTranslation hook
 */
export interface UseTranslationReturn {
  t: TranslationFunction;
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  availableLanguages: SupportedLanguage[];
}

/**
 * Translation keys structure
 * This defines the shape of translation objects
 */
export interface TranslationKeys {
  common: {
    welcome: string;
    home: string;
    save: string;
    cancel: string;
    cancelled: string;
    delete: string;
    restore: string;
    permanentDelete: string;
    edit: string;
    add: string;
    close: string;
    search: string;
    filter: string;
    select: string;
    export: string;
    import: string;
    refresh: string;
    loading: string;
    error: string;
    info: string;
    success: string;
    confirm: string;
    confirmDelete: string;
    confirmDeleteMessage: string;
    yes: string;
    no: string;
    ok: string;
    submit: string;
    back: string;
    next: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    orders: string;
    view: string;
    viewEdit: string;
    actions: string;
    product: string;
    quantity: string;
    price: string;
    total: string;
    resizeColumn: string;
    dataGrid: string;
    selectAll: string;
    selectRow: string;
    saved: string;
    saveFailed: string;
    saving: string;
    notImplemented: string;
    typeToConfirm: string;
    retry: string;
    unknown: string;
    deletedItem: string;
    // Pessimistic Locking
    locking: {
      editedBy: string;
      lockedTitle: string;
      lockedMessage: string;
      readOnlyMode: string;
      forceUnlock: string;
      forceUnlockConfirm: string;
      lockAcquired: string;
      lockReleased: string;
      lockFailed: string;
      unlockFailed: string;
      // Lock monitoring
      lockLost: string;
      lockLostHint: string;
      // Lock acquisition flow
      acquiring: string;
      serviceUnavailable: string;
      serviceUnavailableTitle: string;
      serviceUnavailableMessage: string;
      retryLock: string;
      closeModal: string;
    };
    // Aria Labels for Accessibility
    ariaLabels: {
      close: string;
      closeNotification: string;
    };
  };
  dashboard: {
    title: string;
    welcome: string;
    theme: string;
    language: string;
    current: string;
    toggleTheme: string;
    toggleLanguage: string;
    pages: string;
    testingDescription: string;
    ordersDescription: string;
    issuesDescription: string;
    testing: string;
  };
  contacts: {
    title: string;
    add: string;
    edit: string;
  };
  orders: {
    title: string;
    add: string;
    edit: string;
  };
  issues: {
    title: string;
    form: {
      title: string;
      titlePlaceholder: string;
      titleHint: string;
      description: string;
      descriptionPlaceholder: string;
      descriptionHint: string;
      type: string;
      severity: string;
      category: string;
      priority: string;
      errorMessage: string;
      errorMessagePlaceholder: string;
      errorType: string;
      errorTypePlaceholder: string;
      browser: string;
      os: string;
      url: string;
      attachments: string;
      submit: string;
      dropzoneText: string;
      dropzoneHint: string;
      fileHint: string;
      removeFile: string;
      systemInfo: string;
      systemInfoHint: string;
      systemInfoLabels: {
        browser: string;
        os: string;
        url: string;
        viewport: string;
        screen: string;
        timestamp: string;
      };
    };
    validation: {
      titleMinLength: string;
      titleMaxLength: string;
      descriptionMinLength: string;
      // Timeline validation
      createdAfterUpdated: string;
      createdAfterResolved: string;
      createdAfterClosed: string;
      resolvedAfterClosed: string;
    };
    modal: {
      title: string;
      basic: string;
      standard: string;
      advanced: string;
    };
    roles: {
      basic: string;
      standard: string;
      advanced: string;
    };
    types: {
      bug: string;
      feature: string;
      improvement: string;
      question: string;
    };
    severity: {
      minor: string;
      moderate: string;
      major: string;
      blocker: string;
    };
    priority: {
      low: string;
      medium: string;
      high: string;
      critical: string;
    };
    category: {
      placeholder: string;
      ui: string;
      backend: string;
      database: string;
      integration: string;
      docs: string;
      performance: string;
      security: string;
      dataIntegrity: string;
    };
    status: {
      open: string;
      assigned: string;
      inProgress: string;
      resolved: string;
      closed: string;
      rejected: string;
    };
    deletionAudit: {
      title: string;
      status: string;
      summary: string;
      itemCode: string;
      filesFound: string;
      filesDeleted: string;
      startedAt: string;
      completedAt: string;
      errorMessage: string;
      failedFiles: string;
      viewAuditLog: string;
      deletionFailed: string;
      deletionPending: string;
      softDeleted: string;
      statusValues: {
        pending: string;
        completed: string;
        failed: string;
        partial: string;
      };
    };
    // Resolve Issue Modal
    resolveModal: {
      title: string;
      resolutionLabel: string;
      resolutionPlaceholder: string;
      resolutionHint: string;
      submitButton: string;
      errors: {
        minLength: string;
      };
    };
    // Close Issue Modal
    closeModal: {
      title: string;
      warningTitle: string;
      warningMessage: string;
      commentLabel: string;
      commentPlaceholder: string;
      commentHint: string;
      submitButton: string;
    };
  };
  components: {
    buttons: {
      primary: string;
      secondary: string;
      danger: string;
      dangerSubtle: string;
      ghost: string;
      success: string;
      small: string;
      medium: string;
      large: string;
    };
    badge: {
      neutral: string;
      success: string;
      warning: string;
      error: string;
      info: string;
      small: string;
      medium: string;
      large: string;
      withDot: string;
      active: string;
      pending: string;
      failed: string;
      processing: string;
      demo: {
        title: string;
        variants: string;
        sizes: string;
        dotIndicator: string;
        allCombinations: string;
        useCases: string;
        orderStatuses: string;
        userRoles: string;
        stockLevels: string;
        newOrder: string;
        inProgress: string;
        completed: string;
        cancelled: string;
        admin: string;
        manager: string;
        user: string;
        inStock: string;
        lowStock: string;
        outOfStock: string;
      };
    };
    testing: {
      title: string;
      subtitle: string;
      backToHome: string;
      backToDashboard: string;
      dashboard: string;
      dashboardSubtitle: string;
      dashboardHint: string;
      tabComponents: string;
      tabPages: string;
      categoryComponents: string;
      categoryPages: string;
      formComponents: string;
      formComponentsDescription: string;
      badgeTitle: string;
      badgeDescription: string;
      cardTitle: string;
      cardDescription: string;
      dataGridTitle: string;
      dataGridDescription: string;
      entityEditModalTitle: string;
      entityEditModalDescription: string;
      emptyStateTitle: string;
      emptyStateDescription: string;
      spinnerTitle: string;
      spinnerDescription: string;
      utilityFunctions: string;
      utilityDescription: string;
      wizardTitle: string;
      wizardDescription: string;
      modalV3Title: string;
      modalV3Description: string;
      toastTitle: string;
      toastDescription: string;
      iconsTitle: string;
      iconsDescription: string;
      filteredGridTitle: string;
      filteredGridDescription: string;
      templatePageDatagridTitle: string;
      templatePageDatagridDescription: string;
      templatePageBaseTitle: string;
      templatePageBaseDescription: string;
      variants: string;
      sizes: string;
      states: string;
      withDot: string;
      formExample: string;
      withLabel: string;
      customColor: string;
      navigationButtons: string;
      iconOnlyButtons: string;
      disabled: string;
      fullWidth: string;
      withError: string;
      withHelperText: string;
      enterYourName: string;
      pleaseWait: string;
      basicCheckbox: string;
      checkedByDefault: string;
      xlarge: string;
      processingRequest: string;
      customColors: string;
      primary: string;
      useCases: string;
      loadingData: string;
      loadingContacts: string;
      centeredContainer: string;
      inlineText: string;
      fullPageLoader: string;
      loadingPage: string;
      nestedContentExamples: string;
      gridLayoutExample: string;
      size: string;
      glassModal: {
        title: string;
        description: string;
        openModal: string;
        modalTitle: string;
        namePlaceholder: string;
        fillAllFields: string;
        submitted: string;
        features: {
          title: string;
          backdropBlur: string;
          gradientBackground: string;
          scaleAnimation: string;
          gradientText: string;
          glassInputs: string;
          purpleGlow: string;
        };
      };
      toastTest: {
        title: string;
        variants: string;
        queue: string;
        showSuccess: string;
        showError: string;
        showWarning: string;
        showInfo: string;
        showMultiple: string;
        successMessage: string;
        errorMessage: string;
        warningMessage: string;
        infoMessage: string;
      };
    };
    dataGridTest: {
      title: string;
      subtitle: string;
      backToTesting: string;
      controls: string;
      normalMode: string;
      compactMode: string;
      disableSelection: string;
      enableSelection: string;
      hideActions: string;
      showActions: string;
      clearAll: string;
      resetData: string;
      filterPlaceholder: string;
      clearFilter: string;
      rowsSelected: string;
      showSelected: string;
      noOrders: string;
      ordersFor: string;
      mainGridTitle: string;
      emptyStateTitle: string;
      emptyFilterTitle: string;
      features: {
        sortable: string;
        resizable: string;
        checkboxSelection: string;
        rowExpansion: string;
        nestedGrid: string;
        actionsColumn: string;
        statusColors: string;
        compactMode: string;
        keyboard: string;
        persistence: string;
      };
    };
    filteredGridDemo: {
      pageTitle: string;
      title: string;
      featuresTitle: string;
      feature1: string;
      feature2: string;
      feature3: string;
      feature4: string;
      feature5: string;
      feature6: string;
      feature7: string;
      feature8: string;
      feature9: string;
      feature10: string;
      feature11: string;
      feature12: string;
      statusTitle: string;
      statusActive: string;
      statusPending: string;
      statusCompleted: string;
      statusCancelled: string;
      priorityTitle: string;
      priorityLow: string;
      priorityMedium: string;
      priorityHigh: string;
      quickFilterOverdue: string;
      quickFilterHighValue: string;
      columnOrderId: string;
      columnCustomer: string;
      columnStatus: string;
      columnPriority: string;
      columnTotal: string;
      columnDueDate: string;
      searchPlaceholder: string;
      newOrderClicked: string;
      newOrderButton: string;
      showInactiveLabel: string;
      deleteConfirm: string;
      orderDeleted: string;
      orderDetailsTitle: string;
      labelCustomer: string;
      labelStatus: string;
      labelPriority: string;
      labelTotal: string;
      labelDueDate: string;
      labelActive: string;
      yes: string;
      no: string;
      selectedRows: string;
      orders: string;
      clearSelection: string;
    };
    card: {
      defaultVariant: string;
      defaultDescription: string;
      outlinedVariant: string;
      outlinedDescription: string;
      elevatedVariant: string;
      elevatedDescription: string;
      clickableTitle: string;
      clickableCard: string;
      elevatedClickableCard: string;
      clickableDescription: string;
      elevatedClickableDescription: string;
      clickedMessage: string;
      elevatedClickedMessage: string;
      cardWithList: string;
      cardWithButtons: string;
      item: string;
      cardNumber: string;
      exampleCardInGrid: string;
    };
    emptyState: {
      noContacts: string;
      noContactsDescription: string;
      noOrders: string;
      noOrdersDescription: string;
      noResults: string;
      noResultsDescription: string;
      noSearchResults: string;
      noSearchResultsDescription: string;
      noData: string;
      noDataDescription: string;
      clearFilters: string;
      emptyList: string;
      noItemsYet: string;
      noItemsYetDescription: string;
      createItem: string;
      noContactsFound: string;
      noContactsFoundDescription: string;
      errorState: string;
      somethingWentWrong: string;
      somethingWentWrongDescription: string;
      retry: string;
      noPermission: string;
      accessDenied: string;
      accessDeniedDescription: string;
      withoutActionButton: string;
      allDone: string;
      allDoneDescription: string;
    };
    wizard: {
      testPageDescription: string;
      centeredModal: string;
      centeredDescription: string;
      drawerModal: string;
      recommended: string;
      drawerDescription: string;
      fullscreenModal: string;
      fullscreenDescription: string;
      width: string;
      position: string;
      animation: string;
      center: string;
      scaleIn: string;
      rightSide: string;
      slideIn: string;
      fullViewport: string;
      fadeIn: string;
      openCentered: string;
      openDrawer: string;
      openFullscreen: string;
      wizardData: string;
      completed: string;
      systemInfo: string;
      wizardComponent: string;
      consists6Steps: string;
      step1: string;
      step2: string;
      step3: string;
      step4: string;
      step5: string;
      step6: string;
      technologies: string;
      component: string;
      tech1: string;
      tech2: string;
      tech3: string;
      tech4: string;
    };
    fileUpload: {
      dropzoneText: string;
      dropzoneHint: string;
      fileHint: string;
      removeFile: string;
      removeToSubmit: string;
      limitReached: string;
      removeToAdd: string;
      errors: {
        maxFiles: string;
        maxSize: string;
      };
    };
    modalV3: {
      pageTitle: string;
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
      test4: {
        title: string;
        description: string;
        buttonLabel: string;
        modalTitle: string;
        content: string;
      };
      test5: {
        title: string;
        description: string;
        buttonLabel: string;
        modalTitle: string;
        content: string;
      };
      test6: {
        title: string;
        description: string;
        buttonLabel: string;
        modalTitle: string;
        testHeading: string;
        placeholder: string;
        hint: string;
      };
      test7: {
        title: string;
        description: string;
        buttonLabel: string;
        modalTitle: string;
        content: string;
      };
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
      test9: {
        title: string;
        description: string;
        buttonLabel: string;
        modalTitle: string;
        modalMessage: string;
      };
      test10: {
        title: string;
        description: string;
        buttonLabel: string;
        modalTitle: string;
        modalMessage: string;
      };
      test11: {
        title: string;
        description: string;
        buttonLabel: string;
      };
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
      common: {
        confirmDelete: string;
        deleted: string;
        submitted: string;
        inputEmptyError: string;
      };
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
      editItemModal: {
        defaultSave: string;
        defaultCancel: string;
        defaultClear: string;
        clearConfirmTitle: string;
        clearConfirmMessage: string;
        clearConfirmButton: string;
      };
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
      sectionEditModal: {
        clearButton: string;
        clearConfirmTitle: string;
        clearConfirmMessage: string;
        clearConfirmButton: string;
      };
    };
    sidebar: {
      navigation: string;
      expand: string;
      collapse: string;
      expandAll: string;
      collapseAll: string;
      home: string;
      dashboard: string;
      contacts: string;
      orders: string;
      issues: string;
      documentation: string;
      settings: string;
      uploadNewImage: string;
      dragAndDrop: string;
      lightMode: string;
      darkMode: string;
      switchToLight: string;
      switchToDark: string;
      changeLanguage: string;
      resizeWidth: string;
      newAction: string;
      tabs: {
        navigation: string;
        nav: string;
        settings: string;
        user: string;
        debug: string;
        dbg: string;
      };
      analytics: {
        sectionAnalytics: string;
        sectionDebug: string;
        trackMouse: string;
        trackMouseHint: string;
        trackKeyboard: string;
        trackKeyboardHint: string;
        trackDrag: string;
        trackDragHint: string;
        trackTiming: string;
        trackTimingHint: string;
        logToConsole: string;
        logToConsoleHint: string;
        showDebugBarPage: string;
        showDebugBarPageHint: string;
        showDebugBarModal: string;
        showDebugBarModalHint: string;
        logPermissions: string;
        logPermissionsHint: string;
        logModalStack: string;
        logModalStackHint: string;
        logIssueWorkflow: string;
        logIssueWorkflowHint: string;
        logToasts: string;
        logToastsHint: string;
        logFetchCalls: string;
        logFetchCallsHint: string;
        logSSEInvalidation: string;
        logSSEInvalidationHint: string;
        enableAll: string;
        disableAll: string;
      };
    };
    reportButton: {
      title: string;
      buttonLabel: string;
      modal: {
        title: string;
        description: string;
        typeLabel: string;
        descriptionLabel: string;
        placeholder: string;
        close: string;
        cancel: string;
        submit: string;
        submitting: string;
        error: string;
      };
      types: {
        bug: string;
        feature: string;
        improvement: string;
        question: string;
      };
    };
    pageHeader: {
      logoAlt: string;
      logoPlaceholder: string;
      breadcrumbsLabel: string;
    };
  };
  phoneTypes: {
    mobile: string;
    work: string;
    home: string;
    other: string;
  };
  forms: {
    username: string;
    email: string;
    password: string;
    country: string;
    bio: string;
    enterValue: string;
    placeholders: {
      username: string;
      email: string;
      password: string;
      country: string;
      bio: string;
      basicInput: string;
    };
    helperTexts: {
      emailPrivacy: string;
      selectCountry: string;
      bioOptional: string;
    };
    errors: {
      passwordLength: string;
      required: string;
      invalidEmail: string;
      fillAllFields: string;
    };
    checkboxes: {
      agreeTerms: string;
      subscribeNewsletter: string;
      subscribeHelper: string;
      requiredField: string;
      requiredError: string;
    };
    plans: {
      label: string;
      free: string;
      pro: string;
      enterprise: string;
      helper: string;
    };
    layout: {
      label: string;
      vertical: string;
      horizontal: string;
    };
  };
  // Simple storage keys for inline usage (toast messages, etc.)
  storage: {
    slowOperation: string;
    unavailable: string;
    minioDownWithFiles: string;
    minioDownNoFiles: string;
    types: {
      sql: string;
      minio: string;
      elasticsearch: string;
    };
  };
  storageOperations: {
    healthCheck: {
      checking: string;
      healthy: string;
      unhealthy: string;
      slow: string;
      retrying: string;
    };
    phases: {
      idle: string;
      healthCheck: string;
      executing: string;
      verifying: string;
      success: string;
      failed: string;
      unavailable: string;
      notFound: string;
      verificationFailed: string;
    };
    operations: {
      create: string;
      read: string;
      update: string;
      delete: string;
    };
    messages: {
      checkingServices: string;
      takingLonger: string;
      servicesAvailable: string;
      servicesUnavailable: string;
      unavailableStorages: string;
      creating: string;
      reading: string;
      updating: string;
      deleting: string;
      operationSuccess: string;
      operationFailed: string;
      recordNotFound: string;
      fieldMismatch: string;
      verificationFailed: string;
      processingBatch: string;
      batchSuccess: string;
      batchPartial: string;
      connectionFailed: string;
      retrying: string;
      serviceDown: string;
      sqlDown: string;
    };
    storageTypes: {
      sql: string;
      minio: string;
      elasticsearch: string;
    };
    modal: {
      unavailableTitle: string;
      unavailableMessage: string;
      retry: string;
      markForDeletion: string;
      cancel: string;
    };
  };
  pages: {
    orders: OrdersPageTranslations;
    issues: IssuesPageTranslations;
    //--GENERATE-PAGE-PLACEHOLDER-TYPES--
    template: {
      title: string;
      subtitle: string;
      breadcrumb: string;
      searchPlaceholder: string;
      newItemButton: string;
      showInactiveLabel: string;
      selectedCount: string;
      clearSelection: string;
      newItemClicked: string;
      bulkExport: string;
      bulkDeleteConfirm: string;
      bulkDeleteSuccess: string;
      deleteConfirm: string;
      deleteSuccess: string;
      restoreConfirm: string;
      restoreSuccess: string;
      permanentDeleteConfirm: string;
      permanentDeleteSuccess: string;
      permanentDeleteError: string;
      detailsTitle: string;
      bulkDelete: {
        title: string;
        titlePermanent: string;
        titleMixed: string;
        softMessage: string;
        hardMessage: string;
        mixedMessage: string;
        minioMessage: string;
      };
      minioUnavailable: {
        title: string;
        message: string;
        markForDeletion: string;
        markedForDeletion: string;
        retryDelete: string;
      };
      filters: {
        statusTitle: string;
        statusActive: string;
        statusPending: string;
        statusInactive: string;
        priorityTitle: string;
        priorityLow: string;
        priorityMedium: string;
        priorityHigh: string;
      };
      quickFilters: {
        highValue: string;
        overdue: string;
      };
      columns: {
        id: string;
        name: string;
        email: string;
        status: string;
        priority: string;
        value: string;
        date: string;
      };
      details: {
        name: string;
        email: string;
        status: string;
        priority: string;
        value: string;
        date: string;
        active: string;
        isDeleted: string;
      };
      exportLoading: string;
      exportSuccess: string;
      exportFailed: string;
      exportZipError: string;
      exportZipLoading: string;
      exportPartialAttachments: string;
      minioExportError: {
        title: string;
      };
      exportErrors: {
        missingAttachmentsModalTitle: string;
        missingAttachmentsMessage: string;
        minioTitle: string;
        downloadWithoutMissing: string;
      };
    };
    utilityTest: {
      title: string;
      subtitle: string;
      phone: {
        title: string;
        description: {
          label: string;
          functions: string;
          countries: string;
          countriesList: string;
          usage: string;
          usageDescription: string;
        };
        country: string;
        type: string;
        placeholder: string;
        types: {
          mobile: string;
          landline: string;
          fax: string;
          unknown: string;
        };
        results: {
          isMobile: string;
          isLandline: string;
          formatted: string;
          detectedType: string;
          countryCode: string;
        };
      };
      email: {
        title: string;
        description: {
          label: string;
          functions: string;
          compliance: string;
          usage: string;
          usageDescription: string;
        };
        placeholder: string;
        results: {
          isValid: string;
          normalized: string;
          domain: string;
        };
      };
      date: {
        title: string;
        description: {
          label: string;
          functions: string;
          localization: string;
          localeFormats: string;
          usage: string;
          usageDescription: string;
        };
        locale: string;
        nowButton: string;
        results: {
          formatted: string;
          parsed: string;
          converted: string;
          yearMonthDay: string;
          hourMinuteSecond: string;
        };
      };
      validation: {
        title: string;
        description: {
          label: string;
          functions: string;
          asyncApi: string;
          asyncDescription: string;
          types: string;
          typesList: string;
          usage: string;
          usageDescription: string;
        };
        debounce: {
          title: string;
          description: string;
          input: string;
          delay: string;
          lastValue: string;
          callCount: string;
          preventedCount: string;
        };
        validateField: {
          title: string;
          description: string;
          validationType: string;
          testInput: string;
          types: {
            email: string;
            phone: string;
            url: string;
            required: string;
          };
          results: {
            isValid: string;
            error: string;
            phoneType: string;
            formatted: string;
            countryCode: string;
            domain: string;
            normalized: string;
          };
        };
      };
      results: {
        title: string;
        empty: string;
        invalid: string;
      };
      examples: {
        title: string;
      };
      info: {
        title: string;
        description: string;
      };
    };
  };
  wizard: {
    step: string;
    previous: string;
    next: string;
    complete: string;
    contactForm: {
      title: string;
      contactType: {
        title: string;
        description: string;
      };
      basicInfo: {
        title: string;
        titleCompany: string;
        titlePerson: string;
        descriptionCompany: string;
        descriptionPerson: string;
      };
      contactDetails: {
        title: string;
        description: string;
      };
      address: {
        title: string;
        description: string;
      };
      banking: {
        title: string;
        description: string;
      };
      summary: {
        title: string;
        description: string;
      };
    };
  };
  debugBar: {
    totalTimeOnPage: string;
    timeSinceLastClick: string;
    clicks: string;
    keys: string;
    copyModalName: string;
  };
  notifications: {
    copiedToClipboard: string;
    copyFailed: string;
    savedSuccessfully: string;
    saveFailed: string;
    deletedSuccessfully: string;
    deleteFailed: string;
    updateSuccessfully: string;
    updateFailed: string;
    errorOccurred: string;
    actionCompleted: string;
    processingRequest: string;
  };

  // Testovacie stránky
  test: {
    icons: {
      title: string;
      subtitle: string;
      navigation: string;
      actions: string;
      status: string;
      data: string;
      business: string;
      system: string;
      shapes: string;
      footer: string;
    };
    template: {
      title: string;
      subtitle: string;
      breadcrumb: string;
      searchPlaceholder: string;
      newItemButton: string;
      showInactiveLabel: string;
      selectedCount: string;
      clearSelection: string;
      newItemClicked: string;
      bulkExport: string;
      bulkDeleteConfirm: string;
      bulkDeleteSuccess: string;
      deleteConfirm: string;
      deleteSuccess: string;
      restoreConfirm: string;
      restoreSuccess: string;
      permanentDeleteConfirm: string;
      permanentDeleteSuccess: string;
      detailsTitle: string;
      filters: {
        statusTitle: string;
        statusActive: string;
        statusPending: string;
        statusInactive: string;
        priorityTitle: string;
        priorityLow: string;
        priorityMedium: string;
        priorityHigh: string;
      };
      quickFilters: {
        highValue: string;
        overdue: string;
      };
      columns: {
        id: string;
        name: string;
        email: string;
        status: string;
        priority: string;
        value: string;
        date: string;
      };
      details: {
        name: string;
        email: string;
        status: string;
        priority: string;
        value: string;
        date: string;
        active: string;
      };
    };
    entityEdit: {
      contact: {
        sections: {
          basic: string;
          company: string;
          notes: string;
          timestamps: string;
        };
        fields: {
          firstName: string;
          lastName: string;
          email: string;
          phone: string;
          company: string;
          position: string;
          type: string;
          status: string;
          notes: string;
          id: string;
          createdAt: string;
          updatedAt: string;
        };
        placeholders: {
          firstName: string;
          lastName: string;
          email: string;
          phone: string;
          company: string;
          position: string;
          notes: string;
        };
        hints: {
          statusHint: string;
        };
      };
      validation: {
        minLength2: string;
      };
      permission: {
        immutableField: string;
        noAccess: string;
        adminOnly: string;
      };
    };
  };

  // Typy kontaktov (Firma / Fyzická osoba)
  contactType: {
    company: string;
    person: string;
  };

  // Polia formulárov (názvy formulárových polí)
  fields: {
    name: string;
    ico: string;
    dic: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone: string;
    web: string;
    street: string;
    city: string;
    zip: string;
    country: string;
    iban: string;
    swift: string;
    bankName: string;
    notes: string;
  };

  placeholders: {
    companyName: string;
    ico: string;
    dic: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    web: string;
    street: string;
    city: string;
    zip: string;
    country: string;
    iban: string;
    swift: string;
    bankName: string;
    notes: string;
  };

  auth: {
    switchRole: string;
    selectRole: string;
    roles: {
      basic: string;
      standard: string;
      advanced: string;
    };
    userSwitcher: {
      title: string;
      currentUser: string;
      selectUser: string;
    };
  };

  permissions: {
    noViewAccess: string;
    noEditAccess: string;
    readonlyField: string;
    fieldReadOnly: string;
    immutableField: string;
    fieldNotConfigured: string;
    insufficientLevel: string;
    requiresOwnership: string;
    requiresStatus: string;
    wrongStatus: string;
    entityDeleted: string;
  };

  services: {
    unavailable: string;
    entityDeleted: string;
    fetchError: string;
    checking: string;
  };

  helperTexts: {
    emailExample: string;
    phoneExample: string;
    webExample: string;
    ibanHelper: string;
    swiftHelper: string;
    notesHelper: string;
  };

  pageTemplate: {
    dataGrid: {
      emptyState: string;
      noFilterResults: string;
      noFilterResultsHint: string;
      serviceUnavailable: string;
      loading: string;
      loadingSlow: string;
    };
    filter: {
      searchPlaceholder: string;
      newItem: string;
      showInactive: string;
      enablePagination: string;
      itemsPerPageLabel: string;
      filterLabel: string;
      itemsCount: string;
      statusLegend: string;
      previous: string;
      next: string;
      page: string;
      of: string;
      panelTitle: string;
      expand: string;
      collapse: string;
    };
  };

  // === THEME CUSTOMIZER ===
  themeCustomizer: {
    buttonTitle: string;
    title: string;
    compactMode: string;
    highContrast: string;
    showAnimations: string;
    fontSize: string;
    fontSizeSmall: string;
    fontSizeMedium: string;
    fontSizeLarge: string;
    accentColor: string;
    resetTitle: string;
    resetToDefaults: string;
  };

  // === KEYBOARD SHORTCUTS ===
  keyboardShortcuts: {
    buttonHint: string;
    title: string;
    toggleTheme: string;
    changeLanguage: string;
    modalHint: string;
    permissionLevel10: string;
    permissionLevel20: string;
    permissionLevel29: string;
    permissionLevel35: string;
    permissionLevel45: string;
    permissionLevel59: string;
    permissionLevel65: string;
    permissionLevel85: string;
    permissionLevel100: string;
  };

  // === STATUS BAR ===
  statusBar: {
    allServicesRunning: string;
    systemOperational: string;
    criticalServicesUnhealthy: string;
    servicesCount: string;
    lastUpdated: string;
    manualRefresh: string;
    dragToResize: string;
    servicesWorking: string;
    responseTimes: string;
    sections: {
      critical: string;
      other: string;
      databases: string;
    };
    backup: {
      button: string;
      buttonRunning: string;
      starting: string;
      processing: string;
      completed: string;
      error: string;
      lastBackup: string;
      progress: string;
      oneClick: string;
    };
  };

  // === THEME ===
  theme: {
    switchToLight: string;
    switchToDark: string;
  };

  // === SETTINGS ===
  settings: {
    title: string;
    exportBehavior: {
      label: string;
      hint: string;
      automatic: string;
      automaticDescription: string;
      saveAsDialog: string;
      saveAsDialogDescription: string;
    };
  };
}