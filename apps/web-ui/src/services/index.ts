/*
 * ================================================================
 * FILE: index.ts
 * PATH: /apps/web-ui/src/services/index.ts
 * DESCRIPTION: Services exports - API clients and types for external services
 * VERSION: v2.0.0
 * CREATED: 2025-11-29
 * UPDATED: 2025-12-04
 * CHANGELOG:
 *   v2.0.0 - Deprecated local workflow functions in favor of serviceWorkflow from @l-kern/config
 *            Kept only types that are still in use
 * ================================================================
 */

// Contacts Service API (LKMS101)
export { contactsApi, contactsService } from './contactsService';
export type {
  Contact,
  ContactType,
  ContactPerson,
  ContactCompany,
  ContactOrganizationalUnit,
  ContactRole,
  ContactEmail,
  ContactPhone,
  ContactListItem,
  ContactListResponse,
  RoleType,
  Country,
  Language,
  LegalForm,
} from './contactsService';

// NOTE: CreatedIssue type moved to @l-kern/config (serviceWorkflow/types.ts)
// For workflow operations, use serviceWorkflow from @l-kern/config
