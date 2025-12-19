/*
 * ================================================================
 * FILE: ContactEditConfig.ts
 * PATH: /apps/web-ui/src/pages/Contacts/ContactEditConfig.ts
 * DESCRIPTION: Configuration for Contact entity edit modals
 * VERSION: v1.0.0
 * UPDATED: 2025-12-19
 *
 * Defines sections and fields for Person and Company forms
 * ================================================================
 */

import type { EntityEditConfig } from '@l-kern/ui-components';

// ================================================================
// PERSON EDIT CONFIG
// ================================================================

export const personEditConfig: EntityEditConfig = {
  entityType: 'person',
  sections: [
    {
      id: 'basic',
      titleKey: 'pages.contacts.sections.basicInfo',
      layout: 'grid',
      gridColumns: 2,
      fields: [
        {
          name: 'first_name',
          labelKey: 'pages.contacts.fields.firstName',
          type: 'text',
          required: true,
          minPermissionLevel: 'basic',
          grid: { column: 1 },
        },
        {
          name: 'last_name',
          labelKey: 'pages.contacts.fields.lastName',
          type: 'text',
          required: true,
          minPermissionLevel: 'basic',
          grid: { column: 2 },
        },
        {
          name: 'title_before',
          labelKey: 'pages.contacts.fields.titleBefore',
          type: 'text',
          required: false,
          minPermissionLevel: 'basic',
          placeholderKey: 'pages.contacts.placeholders.titleBefore',
          grid: { column: 1 },
        },
        {
          name: 'title_after',
          labelKey: 'pages.contacts.fields.titleAfter',
          type: 'text',
          required: false,
          minPermissionLevel: 'basic',
          placeholderKey: 'pages.contacts.placeholders.titleAfter',
          grid: { column: 2 },
        },
        {
          name: 'birth_date',
          labelKey: 'pages.contacts.fields.birthDate',
          type: 'date',
          required: false,
          minPermissionLevel: 'advanced',
          grid: { column: 1 },
        },
        {
          name: 'gender',
          labelKey: 'pages.contacts.fields.gender',
          type: 'select',
          required: false,
          minPermissionLevel: 'basic',
          options: [
            { value: 'male', labelKey: 'pages.contacts.gender.male' },
            { value: 'female', labelKey: 'pages.contacts.gender.female' },
            { value: 'other', labelKey: 'pages.contacts.gender.other' },
          ],
          grid: { column: 2 },
        },
      ],
    },
    {
      id: 'contact_info',
      titleKey: 'pages.contacts.sections.contactInfo',
      layout: 'stack',
      fields: [
        {
          name: 'primary_email',
          labelKey: 'pages.contacts.fields.primaryEmail',
          type: 'email',
          required: false,
          minPermissionLevel: 'basic',
        },
        {
          name: 'primary_phone',
          labelKey: 'pages.contacts.fields.primaryPhone',
          type: 'tel',
          required: false,
          minPermissionLevel: 'basic',
        },
      ],
    },
  ],
};

// ================================================================
// COMPANY EDIT CONFIG
// ================================================================

export const companyEditConfig: EntityEditConfig = {
  entityType: 'company',
  sections: [
    {
      id: 'basic',
      titleKey: 'pages.contacts.sections.companyInfo',
      layout: 'grid',
      gridColumns: 2,
      fields: [
        {
          name: 'company_name',
          labelKey: 'pages.contacts.fields.companyName',
          type: 'text',
          required: true,
          minPermissionLevel: 'basic',
          grid: { column: 1, span: 2 },
        },
        {
          name: 'registration_number',
          labelKey: 'pages.contacts.fields.registrationNumber',
          type: 'text',
          required: false,
          minPermissionLevel: 'basic',
          placeholderKey: 'pages.contacts.placeholders.registrationNumber',
          grid: { column: 1 },
        },
        {
          name: 'tax_id',
          labelKey: 'pages.contacts.fields.taxId',
          type: 'text',
          required: false,
          minPermissionLevel: 'basic',
          placeholderKey: 'pages.contacts.placeholders.taxId',
          grid: { column: 2 },
        },
        {
          name: 'vat_id',
          labelKey: 'pages.contacts.fields.vatId',
          type: 'text',
          required: false,
          minPermissionLevel: 'basic',
          placeholderKey: 'pages.contacts.placeholders.vatId',
          grid: { column: 1 },
        },
        {
          name: 'legal_form_id',
          labelKey: 'pages.contacts.fields.legalForm',
          type: 'select',
          required: false,
          minPermissionLevel: 'basic',
          // Options loaded dynamically from API
          grid: { column: 2 },
        },
      ],
    },
    {
      id: 'contact_info',
      titleKey: 'pages.contacts.sections.contactInfo',
      layout: 'stack',
      fields: [
        {
          name: 'primary_email',
          labelKey: 'pages.contacts.fields.primaryEmail',
          type: 'email',
          required: false,
          minPermissionLevel: 'basic',
        },
        {
          name: 'primary_phone',
          labelKey: 'pages.contacts.fields.primaryPhone',
          type: 'tel',
          required: false,
          minPermissionLevel: 'basic',
        },
        {
          name: 'primary_website',
          labelKey: 'pages.contacts.fields.primaryWebsite',
          type: 'url',
          required: false,
          minPermissionLevel: 'basic',
        },
      ],
    },
  ],
};

// ================================================================
// ORGANIZATIONAL UNIT EDIT CONFIG
// ================================================================

export const organizationalUnitEditConfig: EntityEditConfig = {
  entityType: 'organizational_unit',
  sections: [
    {
      id: 'basic',
      titleKey: 'pages.contacts.sections.unitInfo',
      layout: 'grid',
      gridColumns: 2,
      fields: [
        {
          name: 'unit_name',
          labelKey: 'pages.contacts.fields.unitName',
          type: 'text',
          required: true,
          minPermissionLevel: 'basic',
          grid: { column: 1, span: 2 },
        },
        {
          name: 'unit_type_id',
          labelKey: 'pages.contacts.fields.unitType',
          type: 'select',
          required: true,
          minPermissionLevel: 'basic',
          // Options: Division, Department, Team
          grid: { column: 1 },
        },
        {
          name: 'parent_company_id',
          labelKey: 'pages.contacts.fields.parentCompany',
          type: 'select',
          required: true,
          minPermissionLevel: 'basic',
          // Options loaded dynamically from API (companies)
          grid: { column: 2 },
        },
      ],
    },
  ],
};

// ================================================================
// HELPER: Get config by contact type
// ================================================================

export function getContactEditConfig(contactType: 'person' | 'company' | 'organizational_unit'): EntityEditConfig {
  switch (contactType) {
    case 'person':
      return personEditConfig;
    case 'company':
      return companyEditConfig;
    case 'organizational_unit':
      return organizationalUnitEditConfig;
    default:
      return personEditConfig;
  }
}
