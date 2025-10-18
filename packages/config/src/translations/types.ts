/*
 * ================================================================
 * FILE: types.ts
 * PATH: packages/config/src/translations/types.ts
 * DESCRIPTION: TypeScript types for translation system
 * VERSION: v1.0.0
 * UPDATED: 2025-10-13
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
      clickableDescription: string;
      clickedMessage: string;
    };
    emptyState: {
      noContacts: string;
      noContactsDescription: string;
      noOrders: string;
      noOrdersDescription: string;
      noResults: string;
      noResultsDescription: string;
      noData: string;
      noDataDescription: string;
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
        country: string;
        type: string;
        placeholder: string;
        types: {
          mobile: string;
          landline: string;
          fax: string;
        };
        results: {
          isMobile: string;
          isLandline: string;
          formatted: string;
          detectedType: string;
        };
      };
      email: {
        title: string;
        placeholder: string;
        results: {
          isValid: string;
          normalized: string;
          domain: string;
        };
      };
      date: {
        title: string;
        locale: string;
        results: {
          formatted: string;
          parsed: string;
          converted: string;
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
}