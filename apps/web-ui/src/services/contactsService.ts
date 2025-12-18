/*
 * ================================================================
 * FILE: contactsService.ts
 * PATH: /apps/web-ui/src/services/contactsService.ts
 * DESCRIPTION: Contacts API service for LKMS101-contacts microservice
 * VERSION: v2.0.0
 * CREATED: 2025-12-16
 * UPDATED: 2025-12-18
 * ================================================================
 */

import { SERVICE_ENDPOINTS } from '@l-kern/config';

const API_BASE_URL = SERVICE_ENDPOINTS.contacts.baseUrl;

// ============================================================
// TYPES
// ============================================================

export type ContactType = 'person' | 'company' | 'organizational_unit';

export interface Contact {
  id: string;
  contact_code: string;
  contact_type: ContactType;
  display_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  created_by_id?: string;
  updated_by_id?: string;
  // Computed fields from API
  primary_email?: string;
  primary_phone?: string;
  roles?: ContactRole[];
}

export interface ContactPerson {
  first_name: string;
  last_name: string;
  middle_name?: string;
  title_before?: string;
  title_after?: string;
  gender?: string;
  date_of_birth?: string;
  nationality_id?: string;
}

export interface ContactCompany {
  company_name: string;
  trade_name?: string;
  registration_number?: string;
  tax_id?: string;
  vat_id?: string;
  vat_payer?: boolean;
  legal_form_id?: string;
  company_status?: string;
  founded_date?: string;
}

export interface ContactOrganizationalUnit {
  unit_name: string;
  unit_type_id?: string;
  parent_contact_id?: string;
  cost_center?: string;
}

export interface ContactRole {
  id: string;
  role_type_id: string;
  role_type_code?: string;
  role_type_name?: string;
  related_contact_id?: string;
  valid_from?: string;
  valid_to?: string;
  is_active: boolean;
}

export interface ContactEmail {
  id: string;
  email: string;
  email_type: string;
  is_primary: boolean;
}

export interface ContactPhone {
  id: string;
  phone_number: string;
  phone_type: string;
  is_primary: boolean;
  country_id?: string;
}

export interface ContactListItem extends Contact {
  person?: ContactPerson;
  company?: ContactCompany;
  organizational_unit?: ContactOrganizationalUnit;
}

export interface ContactListResponse {
  items: ContactListItem[];
  total: number;
  skip: number;
  limit: number;
}

// Reference types
export interface RoleType {
  id: string;
  code: string;
  name_sk: string;
  name_en: string;
  requires_related_contact: boolean;
  is_active: boolean;
}

export interface Country {
  id: string;
  iso_code: string;
  name_sk: string;
  name_en: string;
  phone_code?: string;
}

export interface Language {
  id: string;
  iso_code: string;
  name_sk: string;
  name_en: string;
}

export interface LegalForm {
  id: string;
  code: string;
  country_code: string;
  name_sk: string;
  name_en: string;
}

// ============================================================
// API CLIENT
// ============================================================

class ContactsApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // ─────────────────────────────────────────────────────────────────
  // HEALTH CHECK
  // ─────────────────────────────────────────────────────────────────

  async ping(): Promise<{ alive: boolean; responseTime: number }> {
    const startTime = performance.now();
    try {
      const response = await fetch(`${this.baseUrl}/health`, { method: 'GET' });
      return {
        alive: response.ok,
        responseTime: Math.round(performance.now() - startTime),
      };
    } catch {
      return {
        alive: false,
        responseTime: Math.round(performance.now() - startTime),
      };
    }
  }

  async health(): Promise<{ status: 'healthy' | 'unhealthy'; message?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const data = await response.json();
      return { status: data.status === 'healthy' ? 'healthy' : 'unhealthy' };
    } catch {
      return { status: 'unhealthy', message: 'Service unavailable' };
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // CONTACTS CRUD
  // ─────────────────────────────────────────────────────────────────

  async listContacts(params?: {
    skip?: number;
    limit?: number;
    contact_type?: ContactType;
    search?: string;
    include_deleted?: boolean;
  }): Promise<ContactListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.skip) searchParams.append('skip', String(params.skip));
    if (params?.limit) searchParams.append('limit', String(params.limit));
    if (params?.contact_type) searchParams.append('contact_type', params.contact_type);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.include_deleted) searchParams.append('include_deleted', 'true');

    const url = `${this.baseUrl}/contacts/?${searchParams.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch contacts: ${response.statusText}`);
    }

    return response.json();
  }

  async getContact(id: string, include_deleted = false): Promise<Contact | null> {
    const url = `${this.baseUrl}/contacts/${id}?include_deleted=${include_deleted}`;
    const response = await fetch(url);

    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error(`Failed to fetch contact: ${response.statusText}`);
    }

    return response.json();
  }

  async getContactByCode(code: string, include_deleted = false): Promise<Contact | null> {
    const url = `${this.baseUrl}/contacts/code/${code}?include_deleted=${include_deleted}`;
    const response = await fetch(url);

    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error(`Failed to fetch contact: ${response.statusText}`);
    }

    return response.json();
  }

  async createPerson(data: ContactPerson): Promise<Contact> {
    const response = await fetch(`${this.baseUrl}/contacts/person`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Failed to create person: ${response.statusText}`);
    }

    return response.json();
  }

  async createCompany(data: ContactCompany): Promise<Contact> {
    const response = await fetch(`${this.baseUrl}/contacts/company`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Failed to create company: ${response.statusText}`);
    }

    return response.json();
  }

  async createOrganizationalUnit(data: ContactOrganizationalUnit): Promise<Contact> {
    const response = await fetch(`${this.baseUrl}/contacts/organizational-unit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Failed to create org unit: ${response.statusText}`);
    }

    return response.json();
  }

  async updateContact(id: string, data: Partial<Contact>): Promise<Contact> {
    const response = await fetch(`${this.baseUrl}/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Failed to update contact: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteContact(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/contacts/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete contact: ${response.statusText}`);
    }
  }

  async restoreContact(id: string): Promise<Contact> {
    const response = await fetch(`${this.baseUrl}/contacts/${id}/restore`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to restore contact: ${response.statusText}`);
    }

    return response.json();
  }

  // ─────────────────────────────────────────────────────────────────
  // ROLES
  // ─────────────────────────────────────────────────────────────────

  async getContactRoles(contactId: string, include_inactive = false): Promise<ContactRole[]> {
    const url = `${this.baseUrl}/contacts/${contactId}/roles/?include_inactive=${include_inactive}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch roles: ${response.statusText}`);
    }

    return response.json();
  }

  async addRole(contactId: string, data: { role_type_id: string; related_contact_id?: string }): Promise<ContactRole> {
    const response = await fetch(`${this.baseUrl}/contacts/${contactId}/roles/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Failed to add role: ${response.statusText}`);
    }

    return response.json();
  }

  async removeRole(contactId: string, roleId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/contacts/${contactId}/roles/${roleId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to remove role: ${response.statusText}`);
    }
  }

  async getContactsByRole(roleCode: string, skip = 0, limit = 50): Promise<{ items: Contact[]; total: number }> {
    const url = `${this.baseUrl}/contacts/by-role/${roleCode}?skip=${skip}&limit=${limit}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch contacts by role: ${response.statusText}`);
    }

    return response.json();
  }

  // ─────────────────────────────────────────────────────────────────
  // EMAILS
  // ─────────────────────────────────────────────────────────────────

  async getContactEmails(contactId: string): Promise<ContactEmail[]> {
    const response = await fetch(`${this.baseUrl}/contacts/${contactId}/emails/`);
    if (!response.ok) throw new Error(`Failed to fetch emails: ${response.statusText}`);
    return response.json();
  }

  async addEmail(contactId: string, data: { email: string; email_type: string; is_primary?: boolean }): Promise<ContactEmail> {
    const response = await fetch(`${this.baseUrl}/contacts/${contactId}/emails/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Failed to add email: ${response.statusText}`);
    }
    return response.json();
  }

  async deleteEmail(contactId: string, emailId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/contacts/${contactId}/emails/${emailId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Failed to delete email: ${response.statusText}`);
  }

  // ─────────────────────────────────────────────────────────────────
  // PHONES
  // ─────────────────────────────────────────────────────────────────

  async getContactPhones(contactId: string): Promise<ContactPhone[]> {
    const response = await fetch(`${this.baseUrl}/contacts/${contactId}/phones/`);
    if (!response.ok) throw new Error(`Failed to fetch phones: ${response.statusText}`);
    return response.json();
  }

  async addPhone(contactId: string, data: { phone_number: string; phone_type: string; country_id?: string; is_primary?: boolean }): Promise<ContactPhone> {
    const response = await fetch(`${this.baseUrl}/contacts/${contactId}/phones/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Failed to add phone: ${response.statusText}`);
    }
    return response.json();
  }

  async deletePhone(contactId: string, phoneId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/contacts/${contactId}/phones/${phoneId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Failed to delete phone: ${response.statusText}`);
  }

  // ─────────────────────────────────────────────────────────────────
  // REFERENCE DATA
  // ─────────────────────────────────────────────────────────────────

  async getRoleTypes(is_active = true): Promise<RoleType[]> {
    const url = `${this.baseUrl}/reference/role-types?is_active=${is_active}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch role types: ${response.statusText}`);
    return response.json();
  }

  async getCountries(is_active = true): Promise<Country[]> {
    const url = `${this.baseUrl}/reference/countries?is_active=${is_active}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch countries: ${response.statusText}`);
    return response.json();
  }

  async getLanguages(is_active = true): Promise<Language[]> {
    const url = `${this.baseUrl}/reference/languages?is_active=${is_active}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch languages: ${response.statusText}`);
    return response.json();
  }

  async getLegalForms(country_code?: string): Promise<LegalForm[]> {
    let url = `${this.baseUrl}/reference/legal-forms`;
    if (country_code) url += `?country_code=${country_code}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch legal forms: ${response.statusText}`);
    return response.json();
  }
}

// ============================================================
// EXPORT SINGLETON
// ============================================================

export const contactsApi = new ContactsApi();

// Backward compatibility - re-export as contactsService
export const contactsService = contactsApi;
