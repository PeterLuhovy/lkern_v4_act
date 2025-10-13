/*
 * ================================================================
 * FILE: services.ts
 * PATH: packages/config/src/constants/services.ts
 * DESCRIPTION: Service metadata and configuration for L-KERN v4
 * VERSION: v1.0.0
 * UPDATED: 2025-10-13
 * ================================================================
 */

import { PORTS } from './ports';

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
  database?: string;  // Database name if service has dedicated DB
}

/**
 * SERVICE REGISTRY
 * Complete registry of all L-KERN v4 services with metadata
 * Each business microservice has its own dedicated database
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
  'lkms203-playground': {
    id: 'lkms203',
    name: 'playground',
    port: PORTS.DEV_PLAYGROUND,
    category: 'frontend',
    status: 'planned',
    description: 'Development playground',
  },

  // Business Microservices (LKMS 100-199)
  // Each service has its own dedicated PostgreSQL database
  'lkms101-contacts': {
    id: 'lkms101',
    name: 'contacts',
    port: PORTS.CONTACTS,
    category: 'business',
    status: 'planned',
    description: 'Contacts management API',
    database: 'lkms101_contacts',  // Dedicated contacts database
  },
  'lkms102-orders': {
    id: 'lkms102',
    name: 'orders',
    port: PORTS.ORDERS,
    category: 'business',
    status: 'planned',
    description: 'Orders management API',
    database: 'lkms102_orders',  // Dedicated orders database
  },
  'lkms103-parts': {
    id: 'lkms103',
    name: 'parts',
    port: PORTS.PARTS,
    category: 'business',
    status: 'planned',
    description: 'Parts catalog API',
    database: 'lkms103_parts',  // Dedicated parts database
  },
  'lkms104-packing': {
    id: 'lkms104',
    name: 'packing',
    port: PORTS.PACKING,
    category: 'business',
    status: 'planned',
    description: 'Packing service API',
    database: 'lkms104_packing',  // Dedicated packing database
  },
  'lkms105-delivery': {
    id: 'lkms105',
    name: 'delivery',
    port: PORTS.DELIVERY,
    category: 'business',
    status: 'planned',
    description: 'Delivery service API',
    database: 'lkms105_delivery',  // Dedicated delivery database
  },
  'lkms106-invoices': {
    id: 'lkms106',
    name: 'invoices',
    port: PORTS.INVOICES,
    category: 'business',
    status: 'planned',
    description: 'Invoices service API',
    database: 'lkms106_invoices',  // Dedicated invoices database
  },

  // Data Services (LKMS 500-599)
  // Shared infrastructure services
  'lkms501-postgres': {
    id: 'lkms501',
    name: 'postgres',
    port: PORTS.POSTGRES,
    category: 'data',
    status: 'planned',
    description: 'PostgreSQL database server (hosts multiple databases)',
  },
  'lkms502-redis': {
    id: 'lkms502',
    name: 'redis',
    port: PORTS.REDIS,
    category: 'data',
    status: 'planned',
    description: 'Redis cache (shared across services)',
  },
  'lkms503-elasticsearch': {
    id: 'lkms503',
    name: 'elasticsearch',
    port: PORTS.ELASTICSEARCH,
    category: 'data',
    status: 'planned',
    description: 'Elasticsearch search engine (shared index)',
  },

  // Development Tools (LKMS 900-999)
  'lkms901-adminer': {
    id: 'lkms901',
    name: 'adminer',
    port: PORTS.ADMINER,
    category: 'dev-tool',
    status: 'planned',
    description: 'Database admin UI',
  },
  'lkms902-pgadmin': {
    id: 'lkms902',
    name: 'pgadmin',
    port: PORTS.PGADMIN,
    category: 'dev-tool',
    status: 'planned',
    description: 'PostgreSQL admin',
  },
  'lkms903-mailhog': {
    id: 'lkms903',
    name: 'mailhog',
    port: PORTS.MAILHOG,
    category: 'dev-tool',
    status: 'planned',
    description: 'Email testing tool',
  },
} as const;

/**
 * DATABASE VOLUMES
 * Volume names for database persistent storage
 * Pattern: lkms{XXX}_{service}_db_data
 */
export const DATABASE_VOLUMES = {
  CONTACTS: 'lkms101_contacts_db_data',
  ORDERS: 'lkms102_orders_db_data',
  PARTS: 'lkms103_parts_db_data',
  PACKING: 'lkms104_packing_db_data',
  DELIVERY: 'lkms105_delivery_db_data',
  INVOICES: 'lkms106_invoices_db_data',
} as const;

/**
 * Get service metadata by LKMS ID
 */
export function getServiceById(lkmsId: string): ServiceMetadata | undefined {
  return SERVICES[lkmsId];
}

/**
 * Get all services by category
 */
export function getServicesByCategory(
  category: ServiceMetadata['category']
): ServiceMetadata[] {
  return Object.values(SERVICES).filter((service) => service.category === category);
}

/**
 * Get all active services
 */
export function getActiveServices(): ServiceMetadata[] {
  return Object.values(SERVICES).filter((service) => service.status === 'active');
}

/**
 * Get service URL for given environment
 */
export function getServiceUrl(
  lkmsId: string,
  environment: 'development' | 'production' = 'development'
): string | undefined {
  const service = SERVICES[lkmsId];
  if (!service) return undefined;

  const host = environment === 'development' ? 'localhost' : window.location.hostname;
  return `http://${host}:${service.port}`;
}

/**
 * Get database connection string for a service
 */
export function getDatabaseUrl(
  lkmsId: string,
  options: {
    user?: string;
    password?: string;
    host?: string;
    port?: number;
  } = {}
): string | undefined {
  const service = SERVICES[lkmsId];
  if (!service || !service.database) return undefined;

  const {
    user = 'lkern_user',
    password = 'lkern_dev_password',
    host = 'lkms501-postgres',
    port = 5432,
  } = options;

  return `postgresql://${user}:${password}@${host}:${port}/${service.database}`;
}