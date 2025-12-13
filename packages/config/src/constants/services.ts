/*
 * ================================================================
 * FILE: services.ts
 * PATH: packages/config/src/constants/services.ts
 * DESCRIPTION: Service metadata and API endpoint configuration for L-KERN v4
 * VERSION: v2.0.0
 * UPDATED: 2025-12-03
 * ================================================================
 */

import { PORTS } from './ports';

// ============================================================
// SERVICE METADATA (for documentation and categorization)
// ============================================================

/**
 * Service metadata structure
 */
export interface ServiceMetadata {
  id: string;
  name: string;
  port: number;
  category: 'frontend' | 'business' | 'data' | 'dev-tool';
  status: 'active' | 'planned' | 'deprecated';
  description: string;
  database?: string;
}

/**
 * SERVICE REGISTRY - Metadata for all L-KERN v4 services
 */
export const SERVICES: Record<string, ServiceMetadata> = {
  // Frontend Applications (LKMS 200-299)
  'lkms201-web-ui': {
    id: 'lkms201',
    name: 'web-ui',
    port: PORTS.WEB_UI,
    category: 'frontend',
    status: 'active',
    description: 'Main React web application',
  },
  'lkms202-admin': {
    id: 'lkms202',
    name: 'admin',
    port: PORTS.ADMIN_PANEL,
    category: 'frontend',
    status: 'planned',
    description: 'Admin dashboard',
  },

  // Business Microservices (LKMS 100-199)
  'lkms101-contacts': {
    id: 'lkms101',
    name: 'contacts',
    port: PORTS.CONTACTS,
    category: 'business',
    status: 'planned',
    description: 'Contacts management API',
    database: 'lkms101_contacts',
  },
  'lkms105-issues': {
    id: 'lkms105',
    name: 'issues',
    port: PORTS.ISSUES,
    category: 'business',
    status: 'active',
    description: 'Issues management API',
    database: 'lkms105_issues',
  },

  // Data Services (LKMS 500-599)
  'lkms501-postgres': {
    id: 'lkms501',
    name: 'postgres',
    port: PORTS.POSTGRES,
    category: 'data',
    status: 'active',
    description: 'PostgreSQL database server',
  },
  'lkms502-minio': {
    id: 'lkms502',
    name: 'minio',
    port: PORTS.MINIO,
    category: 'data',
    status: 'active',
    description: 'MinIO object storage',
  },
} as const;

// ============================================================
// SERVICE ENDPOINT CONFIG (for API calls and health checks)
// ============================================================

/**
 * Service endpoint configuration for serviceWorkflow
 */
export interface ServiceEndpointConfig {
  baseUrl: string;
  name: string;
  healthEndpoints: {
    ping: string;
    health: string;
  };
  port: number;
  code: string;
}

/**
 * Get the base host for services (Docker vs localhost)
 */
function getServiceHost(containerName: string, port: number): string {
  const isDocker = typeof window !== 'undefined'
    ? window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    : false;

  if (isDocker) {
    return `http://${containerName}:${port}`;
  }
  return `http://localhost:${port}`;
}

/**
 * SERVICE_ENDPOINTS - API endpoint configuration for serviceWorkflow
 *
 * @example
 * ```ts
 * import { SERVICE_ENDPOINTS } from '@l-kern/config';
 *
 * const result = await serviceWorkflow({
 *   baseUrl: SERVICE_ENDPOINTS.issues.baseUrl,
 *   endpoint: '/issues/',
 *   method: 'POST',
 *   data: issueData,
 * });
 * ```
 */
export const SERVICE_ENDPOINTS = {
  issues: {
    baseUrl: getServiceHost('lkms105-issues', 4105),
    name: 'Issues Service',
    healthEndpoints: { ping: '/ping', health: '/health' },
    port: 4105,
    code: 'lkms105',
  } as ServiceEndpointConfig,

  contacts: {
    baseUrl: getServiceHost('lkms101-contacts', 4101),
    name: 'Contacts Service',
    healthEndpoints: { ping: '/ping', health: '/health' },
    port: 4101,
    code: 'lkms101',
  } as ServiceEndpointConfig,

  minio: {
    baseUrl: getServiceHost('lksp100-minio', 9000),
    name: 'MinIO Storage',
    healthEndpoints: { ping: '/minio/health/live', health: '/minio/health/live' },
    port: 9000,
    code: 'lksp100',
  } as ServiceEndpointConfig,
} as const;

// ============================================================
// TYPE EXPORTS
// ============================================================

export type ServiceEndpointKey = keyof typeof SERVICE_ENDPOINTS;

// ============================================================
// HELPER FUNCTIONS - Metadata
// ============================================================

export function getServiceById(lkmsId: string): ServiceMetadata | undefined {
  return SERVICES[lkmsId];
}

export function getServicesByCategory(category: ServiceMetadata['category']): ServiceMetadata[] {
  return Object.values(SERVICES).filter((service) => service.category === category);
}

export function getActiveServices(): ServiceMetadata[] {
  return Object.values(SERVICES).filter((service) => service.status === 'active');
}

// ============================================================
// HELPER FUNCTIONS - Endpoints
// ============================================================

export function getServiceEndpoint(key: ServiceEndpointKey): ServiceEndpointConfig {
  return SERVICE_ENDPOINTS[key];
}

export function buildServiceUrl(service: ServiceEndpointKey, endpoint: string): string {
  const config = SERVICE_ENDPOINTS[service];
  return `${config.baseUrl}${endpoint}`;
}

export function getHealthUrl(service: ServiceEndpointKey, type: 'ping' | 'health' = 'ping'): string {
  const config = SERVICE_ENDPOINTS[service];
  return `${config.baseUrl}${config.healthEndpoints[type]}`;
}
