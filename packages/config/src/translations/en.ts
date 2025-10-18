/*
 * ================================================================
 * FILE: en.ts
 * PATH: packages/config/src/translations/en.ts
 * DESCRIPTION: English translations for L-KERN v4
 * VERSION: v1.0.0
 * UPDATED: 2025-10-13
 * ================================================================
 */

import type { TranslationKeys } from './types';

export const en: TranslationKeys = {
  common: {
    welcome: 'Welcome',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    refresh: 'Refresh',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    submit: 'Submit',
    back: 'Back',
    next: 'Next',
  },
  dashboard: {
    title: 'Dashboard',
    welcome: 'Welcome to L-KERN v4',
  },
  contacts: {
    title: 'Contacts',
    add: 'Add Contact',
    edit: 'Edit Contact',
  },
  orders: {
    title: 'Orders',
    add: 'Add Order',
    edit: 'Edit Order',
  },
  components: {
    buttons: {
      primary: 'Primary',
      secondary: 'Secondary',
      danger: 'Danger',
      ghost: 'Ghost',
      success: 'Success',
      small: 'Small',
      medium: 'Medium',
      large: 'Large',
    },
    badge: {
      neutral: 'Neutral',
      success: 'Success',
      warning: 'Warning',
      error: 'Error',
      info: 'Info',
      small: 'Small',
      medium: 'Medium',
      large: 'Large',
      withDot: 'With Dot',
      active: 'Active',
      pending: 'Pending',
      failed: 'Failed',
      processing: 'Processing',
      demo: {
        title: 'Badge Component Demo',
        variants: 'Variants (Medium Size)',
        sizes: 'Sizes (Success Variant)',
        dotIndicator: 'With Dot Indicator',
        allCombinations: 'All Size Combinations',
        useCases: 'Real-World Use Cases',
        orderStatuses: 'Order Statuses',
        userRoles: 'User Roles',
        stockLevels: 'Stock Levels',
        newOrder: 'New Order',
        inProgress: 'In Progress',
        completed: 'Completed',
        cancelled: 'Cancelled',
        admin: 'Admin',
        manager: 'Manager',
        user: 'User',
        inStock: 'In Stock',
        lowStock: 'Low Stock',
        outOfStock: 'Out of Stock',
      },
    },
    testing: {
      title: 'Component Testing Page',
      subtitle: 'Test all @l-kern/ui-components',
      backToHome: '← Back to Home',
      variants: 'Variants:',
      sizes: 'Sizes:',
      states: 'States:',
      withDot: 'With Dot:',
      formExample: 'FormField - Complete Form Example',
    },
  },
  forms: {
    username: 'Username',
    email: 'Email',
    password: 'Password',
    country: 'Country',
    bio: 'Bio',
    placeholders: {
      username: 'Enter username',
      email: 'Enter email',
      password: 'Enter password',
      country: 'Choose a country',
      bio: 'Tell us about yourself...',
      basicInput: 'Basic input...',
    },
    helperTexts: {
      emailPrivacy: "We'll never share your email",
      selectCountry: 'Select your country',
      bioOptional: 'Optional',
    },
    errors: {
      passwordLength: 'Password must be at least 8 characters',
      required: 'This field is required',
    },
    checkboxes: {
      agreeTerms: 'I agree to the terms and conditions',
      subscribeNewsletter: 'Subscribe to newsletter',
      subscribeHelper: 'Get weekly updates',
      requiredField: 'Required field',
      requiredError: 'You must accept this',
    },
    plans: {
      label: 'Select a plan',
      free: 'Free - $0/month',
      pro: 'Pro - $9/month',
      enterprise: 'Enterprise - $99/month',
      helper: 'You can change your plan anytime',
    },
    layout: {
      label: 'Layout direction',
      vertical: 'Vertical',
      horizontal: 'Horizontal',
    },
  },
};