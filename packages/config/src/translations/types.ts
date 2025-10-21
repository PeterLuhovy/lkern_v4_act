/*
 * ================================================================
 * FILE: types.ts
 * PATH: packages/config/src/translations/types.ts
 * DESCRIPTION: TypeScript types for translation system
 * VERSION: v1.3.0
 * UPDATED: 2025-10-19 13:00:00
 * ================================================================
 */

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
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    close: string;
    search: string;
    filter: string;
    export: string;
    import: string;
    refresh: string;
    loading: string;
    error: string;
    success: string;
    confirm: string;
    yes: string;
    no: string;
    submit: string;
    back: string;
    next: string;
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
    keyboardShortcuts: string;
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
  components: {
    buttons: {
      primary: string;
      secondary: string;
      danger: string;
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
      formComponents: string;
      formComponentsDescription: string;
      badgeTitle: string;
      badgeDescription: string;
      cardTitle: string;
      cardDescription: string;
      emptyStateTitle: string;
      emptyStateDescription: string;
      spinnerDescription: string;
      utilityFunctions: string;
      utilityDescription: string;
      wizardTitle: string;
      wizardDescription: string;
      modalV3Title: string;
      modalV3Description: string;
      variants: string;
      sizes: string;
      states: string;
      withDot: string;
      formExample: string;
      withLabel: string;
      customColor: string;
      navigationButtons: string;
      disabled: string;
      fullWidth: string;
      withError: string;
      withHelperText: string;
      enterYourName: string;
      pleaseWait: string;
      basicCheckbox: string;
      checkedByDefault: string;
      spinnerTitle: string;
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
      common: {
        confirmDelete: string;
        deleted: string;
        submitted: string;
        inputEmptyError: string;
      };
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
      };
      unsavedChanges: {
        title: string;
        message: string;
      };
    };
  };
  forms: {
    username: string;
    email: string;
    password: string;
    country: string;
    bio: string;
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
  pages: {
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

  helperTexts: {
    emailExample: string;
    phoneExample: string;
    webExample: string;
    ibanHelper: string;
    swiftHelper: string;
    notesHelper: string;
  };
}