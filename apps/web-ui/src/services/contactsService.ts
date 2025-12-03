/*
 * ================================================================
 * FILE: contactsService.ts
 * PATH: /apps/web-ui/src/services/contactsService.ts
 * DESCRIPTION: Mock Contacts Service API for fetching contact information
 *              Will be replaced with real API when Contacts Service is implemented
 * VERSION: v1.0.0
 * CREATED: 2025-11-29
 * UPDATED: 2025-11-29
 *
 * USAGE:
 *   import { contactsApi, Contact } from '../services/contactsService';
 *
 *   // Check service health
 *   const isHealthy = await contactsApi.health();
 *
 *   // Fetch single contact
 *   const contact = await contactsApi.getContact(contactId);
 *
 * ROADMAP:
 *   - TODO: Replace mock data with real API calls
 *   - TODO: Connect to lkms101-contacts service
 *   - TODO: Add proper authentication headers
 * ================================================================
 */

// ============================================================
// TYPES
// ============================================================

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email?: string;
  phone?: string;
  position?: string;
  department?: string;
  avatar_url?: string;
}

export interface ContactsApiError {
  status: number;
  message: string;
}

// ============================================================
// MOCK DATA
// ============================================================

/**
 * Mock contacts database
 * TODO: Remove when connected to real Contacts Service
 */
const MOCK_CONTACTS: Contact[] = [
  {
    id: 'user-001',
    first_name: 'Peter',
    last_name: 'Luhový',
    full_name: 'Peter Luhový',
    email: 'peter@luhovy.sk',
    position: 'CEO & Developer',
    department: 'Management',
  },
  {
    id: 'user-002',
    first_name: 'Anna',
    last_name: 'Novotná',
    full_name: 'Anna Novotná',
    email: 'anna.novotna@example.com',
    position: 'QA Engineer',
    department: 'Quality Assurance',
  },
  {
    id: 'user-003',
    first_name: 'Martin',
    last_name: 'Kováč',
    full_name: 'Martin Kováč',
    email: 'martin.kovac@example.com',
    position: 'Senior Developer',
    department: 'Engineering',
  },
  {
    id: 'user-004',
    first_name: 'Jana',
    last_name: 'Horváthová',
    full_name: 'Jana Horváthová',
    email: 'jana.horvathova@example.com',
    position: 'Project Manager',
    department: 'Management',
  },
  {
    id: 'user-005',
    first_name: 'Tomáš',
    last_name: 'Szabó',
    full_name: 'Tomáš Szabó',
    email: 'tomas.szabo@example.com',
    position: 'DevOps Engineer',
    department: 'Infrastructure',
  },
];

// ============================================================
// CONFIGURATION
// ============================================================

/**
 * Contacts Service configuration
 * TODO: Move to api-config.ts when connecting to real service
 */
const CONFIG = {
  // Mock settings (for development)
  mockEnabled: true,
  mockDelay: 300, // ms - simulates network latency
  mockServiceDown: false, // Set to true to simulate service outage

  // Real service settings (for future use)
  baseUrl: 'http://localhost:4101', // lkms101-contacts port
  healthEndpoint: '/health',
  contactsEndpoint: '/contacts',
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Simulates network delay for mock responses
 */
const mockDelay = (): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, CONFIG.mockDelay));
};

/**
 * Creates an error with status code
 */
const createError = (status: number, message: string): ContactsApiError => {
  const error = new Error(message) as Error & ContactsApiError;
  error.status = status;
  error.message = message;
  return error;
};

// ============================================================
// CONTACTS API
// ============================================================

export const contactsApi = {
  /**
   * Check if Contacts Service is available
   * @returns true if service is healthy, false otherwise
   */
  health: async (): Promise<boolean> => {
    if (CONFIG.mockEnabled) {
      await mockDelay();

      // Simulate service down scenario
      if (CONFIG.mockServiceDown) {
        console.warn('[ContactsService] Mock: Service is down');
        return false;
      }

      console.log('[ContactsService] Mock: Service is healthy');
      return true;
    }

    // Real implementation (for future use)
    try {
      const response = await fetch(`${CONFIG.baseUrl}${CONFIG.healthEndpoint}`);
      return response.ok;
    } catch {
      return false;
    }
  },

  /**
   * Fetch a single contact by ID
   * @param id - Contact ID
   * @returns Contact object
   * @throws ContactsApiError with status 404 if not found, 503 if service unavailable
   */
  getContact: async (id: string): Promise<Contact> => {
    if (CONFIG.mockEnabled) {
      await mockDelay();

      // Simulate service down scenario
      if (CONFIG.mockServiceDown) {
        throw createError(503, 'Service unavailable');
      }

      // Find contact in mock data
      const contact = MOCK_CONTACTS.find((c) => c.id === id);

      if (!contact) {
        // Contact not found (deleted or invalid ID)
        throw createError(404, `Contact not found: ${id}`);
      }

      console.log('[ContactsService] Mock: Fetched contact:', contact.full_name);
      return contact;
    }

    // Real implementation (for future use)
    const response = await fetch(`${CONFIG.baseUrl}${CONFIG.contactsEndpoint}/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw createError(404, `Contact not found: ${id}`);
      }
      if (response.status === 503) {
        throw createError(503, 'Service unavailable');
      }
      throw createError(response.status, `Failed to fetch contact: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Fetch multiple contacts by IDs
   * @param ids - Array of contact IDs
   * @returns Map of contact ID to Contact (missing IDs are omitted)
   */
  getContacts: async (ids: string[]): Promise<Map<string, Contact>> => {
    const results = new Map<string, Contact>();

    // Fetch each contact (could be optimized with batch endpoint)
    await Promise.all(
      ids.map(async (id) => {
        try {
          const contact = await contactsApi.getContact(id);
          results.set(id, contact);
        } catch {
          // Ignore errors - missing contacts are simply not in the map
        }
      })
    );

    return results;
  },

  /**
   * Search contacts (mock implementation)
   * @param query - Search query
   * @returns Matching contacts
   */
  search: async (query: string): Promise<Contact[]> => {
    if (CONFIG.mockEnabled) {
      await mockDelay();

      if (CONFIG.mockServiceDown) {
        throw createError(503, 'Service unavailable');
      }

      const lowerQuery = query.toLowerCase();
      return MOCK_CONTACTS.filter(
        (c) =>
          c.full_name.toLowerCase().includes(lowerQuery) ||
          c.email?.toLowerCase().includes(lowerQuery) ||
          c.position?.toLowerCase().includes(lowerQuery)
      );
    }

    // Real implementation placeholder
    const response = await fetch(`${CONFIG.baseUrl}${CONFIG.contactsEndpoint}?search=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw createError(response.status, 'Search failed');
    }
    return response.json();
  },
};

// ============================================================
// DEVELOPMENT UTILITIES
// ============================================================

/**
 * Toggle mock service availability (for testing)
 * @example
 *   // In browser console:
 *   window.toggleContactsService(false); // Service down
 *   window.toggleContactsService(true);  // Service up
 */
if (typeof window !== 'undefined') {
  (window as Window & { toggleContactsService?: (available: boolean) => void }).toggleContactsService = (
    available: boolean
  ) => {
    CONFIG.mockServiceDown = !available;
    console.log(`[ContactsService] Mock service ${available ? 'enabled' : 'disabled'}`);
  };
}
