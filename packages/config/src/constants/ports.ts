/*
 * ================================================================
 * FILE: ports.ts
 * PATH: /packages/config/src/constants/ports.ts
 * DESCRIPTION: Port mapping configuration for L-KERN v4 services
 * VERSION: v1.0.0
 * UPDATED: 2025-10-13
 * ================================================================
 */

/**
 * Port Mapping Strategy:
 * LKMS{XXX} service → Port 4{XXX}
 *
 * Examples:
 * - lkms101-contacts → 4101
 * - lkms201-web-ui → 4201
 * - lkms501-postgres → 4501
 */

// === FRONTEND APPLICATIONS (LKMS 200-299) ===
export const FRONTEND_PORTS = {
  WEB_UI: 4201,              // lkms201-web-ui - Main React application
  ADMIN_PANEL: 4202,         // lkms202-admin - Admin dashboard (planned)
  DEV_PLAYGROUND: 4203,      // lkms203-playground - Dev tools (planned)
} as const;

// === BUSINESS MICROSERVICES (LKMS 100-199) ===
export const BUSINESS_SERVICE_PORTS = {
  CONTACTS: 4101,            // lkms101-contacts - Contacts management API
  ORDERS: 4102,              // lkms102-orders - Orders management API
  PARTS: 4103,               // lkms103-parts - Parts catalog API (planned)
  PACKING: 4104,             // lkms104-packing - Packing service API (planned)
  DELIVERY: 4105,            // lkms105-delivery - Delivery service API (planned)
  INVOICES: 4106,            // lkms106-invoices - Invoices service API (planned)
} as const;

// === DATA SERVICES (LKMS 500-599) ===
export const DATA_SERVICE_PORTS = {
  POSTGRES: 4501,            // lkms501-postgres - PostgreSQL database
  REDIS: 4502,               // lkms502-redis - Redis cache (planned)
  ELASTICSEARCH: 4503,       // lkms503-elasticsearch - Search engine (planned)
} as const;

// === DEVELOPMENT TOOLS (LKMS 900-999) ===
export const DEV_TOOL_PORTS = {
  ADMINER: 4901,             // lkms901-adminer - Database admin UI
  PGADMIN: 4902,             // lkms902-pgadmin - PostgreSQL admin (planned)
  MAILHOG: 4903,             // lkms903-mailhog - Email testing (planned)
} as const;

// === ALL PORTS (Unified Access) ===
export const PORTS = {
  ...FRONTEND_PORTS,
  ...BUSINESS_SERVICE_PORTS,
  ...DATA_SERVICE_PORTS,
  ...DEV_TOOL_PORTS,
} as const;

// === PORT RANGES (for validation and documentation) ===
export const PORT_RANGES = {
  FRONTEND: { START: 4200, END: 4299 },
  BUSINESS: { START: 4100, END: 4199 },
  DATA: { START: 4500, END: 4599 },
  DEV_TOOLS: { START: 4900, END: 4999 },
} as const;

// === HELPER FUNCTIONS ===

/**
 * Get service name from port number
 * @param port - Port number
 * @returns Service name or 'unknown'
 */
export function getServiceNameByPort(port: number): string {
  const entry = Object.entries(PORTS).find(([, p]) => p === port);
  return entry ? entry[0].toLowerCase().replace(/_/g, '-') : 'unknown';
}

/**
 * Get port by service identifier (e.g., 'lkms201' → 4201)
 * @param lkmsId - Service LKMS identifier (e.g., 'lkms201', '201', or 'web-ui')
 * @returns Port number or undefined
 */
export function getPortByLkmsId(lkmsId: string): number | undefined {
  // Extract number from lkmsXXX or XXX format
  const match = lkmsId.match(/(\d{3})/);
  if (!match) return undefined;

  const portSuffix = match[1];
  return parseInt(`4${portSuffix}`, 10);
}

/**
 * Validate if port is in valid L-KERN range
 * @param port - Port number to validate
 * @returns true if port is in valid range
 */
export function isValidLkernPort(port: number): boolean {
  return Object.values(PORT_RANGES).some(
    range => port >= range.START && port <= range.END
  );
}