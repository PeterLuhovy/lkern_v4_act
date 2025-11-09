#!/usr/bin/env node

/*
 * ================================================================
 * FILE: generate-microservice.js
 * PATH: /scripts/microservice-generator/generate-microservice.js
 * DESCRIPTION: Generator for Python FastAPI microservices from template
 * VERSION: v1.0.1
 * UPDATED: 2025-11-08
 *
 * USAGE:
 * node scripts/microservice-generator/generate-microservice.js configs/config.json
 * OR
 * npm run generate:microservice -- configs/config.json
 *
 * CONFIG FORMAT: See configs/test-service.json
 * ================================================================
 */

const fs = require('fs');
const path = require('path');

// ============================================================
// CONFIGURATION
// ============================================================

const TEMPLATE_DIR = path.join(__dirname, '..', '..', 'services', 'lkms-template');
const SERVICES_DIR = path.join(__dirname, '..', '..', 'services');
const DOCKER_COMPOSE_PATH = path.join(__dirname, '..', '..', 'docker-compose.yml');
const ENV_PATH = path.join(__dirname, '..', '..', '.env');

// ============================================================
// UTILITIES
// ============================================================

/**
 * Read file content
 */
function readFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf-8');
}

/**
 * Write file content
 */
function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ Created: ${filePath}`);
}

/**
 * Copy directory recursively
 */
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Replace placeholders in file
 */
function replacePlaceholdersInFile(filePath, replacements) {
  let content = readFile(filePath);

  for (const [placeholder, value] of Object.entries(replacements)) {
    const regex = new RegExp(placeholder, 'g');
    content = content.replace(regex, value);
  }

  fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * Replace placeholders in all files in directory
 */
function replacePlaceholdersInDirectory(dirPath, replacements) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      replacePlaceholdersInDirectory(fullPath, replacements);
    } else {
      replacePlaceholdersInFile(fullPath, replacements);
    }
  }
}

/**
 * Convert PascalCase to kebab-case
 */
function toKebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

// ============================================================
// GENERATOR
// ============================================================

/**
 * Generate microservice from template
 */
function generateMicroservice(config) {
  console.log('\n🚀 Generating Python FastAPI microservice...\n');

  const {
    serviceCode,           // e.g., "105"
    serviceName,           // e.g., "Issues Service"
    serviceSlug,           // e.g., "issues"
    restPort,              // e.g., 4105
    grpcPort,              // e.g., 5105
    dbName,                // e.g., "lkern_issues"
    modelName,             // e.g., "Issue"
    tableName,             // e.g., "issues"
    routePrefix,           // e.g., "issues"
    routeSingular,         // e.g., "issue"
    serviceDescription,    // e.g., "Issue tracking service"
    serviceLongDescription, // e.g., "Comprehensive issue tracking and management system"
  } = config;

  // Validate required fields
  const requiredFields = [
    'serviceCode', 'serviceName', 'serviceSlug', 'restPort', 'grpcPort',
    'dbName', 'modelName', 'tableName', 'routePrefix', 'routeSingular',
    'serviceDescription', 'serviceLongDescription'
  ];

  for (const field of requiredFields) {
    if (!config[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // ============================================================
  // 1. COPY TEMPLATE
  // ============================================================

  const serviceDirName = `lkms${serviceCode}-${serviceSlug}`;
  const servicePath = path.join(SERVICES_DIR, serviceDirName);

  if (fs.existsSync(servicePath)) {
    throw new Error(`Service directory already exists: ${servicePath}`);
  }

  console.log(`📁 Copying template to ${serviceDirName}...`);
  copyDirectory(TEMPLATE_DIR, servicePath);
  console.log(`✅ Template copied to ${servicePath}\n`);

  // ============================================================
  // 2. REPLACE PLACEHOLDERS
  // ============================================================

  console.log('🔄 Replacing placeholders...\n');

  const replacements = {
    '{{SERVICE_NAME}}': serviceName,
    '{{SERVICE_CODE}}': serviceCode,
    '{{SERVICE_SLUG}}': serviceSlug,
    '{{REST_PORT}}': String(restPort),
    '{{GRPC_PORT}}': String(grpcPort),
    '{{DB_NAME}}': dbName,
    '{{MODEL_NAME}}': modelName,
    '{{TABLE_NAME}}': tableName,
    '{{ROUTE_PREFIX}}': routePrefix,
    '{{ROUTE_SINGULAR}}': routeSingular,
    '{{SERVICE_DESCRIPTION}}': serviceDescription,
    '{{SERVICE_LONG_DESCRIPTION}}': serviceLongDescription,
  };

  replacePlaceholdersInDirectory(servicePath, replacements);
  console.log(`✅ Placeholders replaced in all files\n`);

  // ============================================================
  // 3. INJECT INTO DOCKER-COMPOSE.YML
  // ============================================================

  console.log('🐳 Injecting services into docker-compose.yml...\n');

  const dbServiceName = `lkms${serviceCode}-${serviceSlug}-db`;
  const appServiceName = `lkms${serviceCode}-${serviceSlug}`;

  const dbService = `
  # ================================================================
  # ${serviceName} - PostgreSQL Database
  # ================================================================
  ${dbServiceName}:
    image: \${LKMS${serviceCode}_DB_IMAGE}
    container_name: \${LKMS${serviceCode}_DB_CONTAINER_NAME}
    environment:
      POSTGRES_DB: \${LKMS${serviceCode}_DB_NAME}
      POSTGRES_USER: \${LKMS${serviceCode}_DB_USER}
      POSTGRES_PASSWORD: \${LKMS${serviceCode}_DB_PASSWORD}
    volumes:
      - lkms${serviceCode}_db_data:/var/lib/postgresql/data
    networks:
      - database
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${LKMS${serviceCode}_DB_USER} -d \${LKMS${serviceCode}_DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  # ================================================================
  # ${serviceName} - FastAPI Application
  # ================================================================
  ${appServiceName}:
    build:
      context: .
      dockerfile: infrastructure/docker/Dockerfile.backend.dev
      args:
        SERVICE_PATH: services/${serviceDirName}
    container_name: \${LKMS${serviceCode}_CONTAINER_NAME}
    depends_on:
      ${dbServiceName}:
        condition: service_healthy
    environment:
      - SERVICE_NAME=${serviceName}
      - REST_PORT=\${LKMS${serviceCode}_REST_PORT}
      - GRPC_PORT=\${LKMS${serviceCode}_GRPC_PORT}
      - DB_HOST=${dbServiceName}
      - DB_PORT=5432
      - DB_NAME=\${LKMS${serviceCode}_DB_NAME}
      - DB_USER=\${LKMS${serviceCode}_DB_USER}
      - DB_PASSWORD=\${LKMS${serviceCode}_DB_PASSWORD}
      - KAFKA_BOOTSTRAP_SERVERS=lkms504-kafka:9092
    ports:
      - "\${LKMS${serviceCode}_REST_PORT_EXTERNAL}:\${LKMS${serviceCode}_REST_PORT}"
      - "\${LKMS${serviceCode}_GRPC_PORT_EXTERNAL}:\${LKMS${serviceCode}_GRPC_PORT}"
    volumes:
      - ./services/${serviceDirName}:/app
    networks:
      - backend
      - database
    restart: unless-stopped
`;

  const volumeDefinition = `  lkms${serviceCode}_db_data:
    name: \${LKMS${serviceCode}_DB_VOLUME}`;

  const dockerComposeContent = readFile(DOCKER_COMPOSE_PATH);

  // ============================================================
  // INJECT SERVICES INTO services: SECTION
  // ============================================================

  // Find the end of services: section (before # USAGE comment)
  const usageCommentRegex = /# ================================================================\r?\n# USAGE\r?\n# ================================================================/;
  const usageMatch = dockerComposeContent.match(usageCommentRegex);

  if (!usageMatch) {
    throw new Error('Could not find # USAGE comment section in docker-compose.yml');
  }

  const usageIndex = usageMatch.index;

  // Insert services before # USAGE comment
  const beforeUsage = dockerComposeContent.substring(0, usageIndex);
  const usageAndAfter = dockerComposeContent.substring(usageIndex);

  // ============================================================
  // INJECT VOLUME DEFINITION INTO volumes: SECTION
  // ============================================================

  // Find volumes: section in the beforeUsage part
  const volumesMatch = beforeUsage.match(/\r?\nvolumes:\r?\n/);
  if (!volumesMatch) {
    throw new Error('Could not find volumes: keyword in docker-compose.yml');
  }

  const volumesIndex = volumesMatch.index;
  const beforeVolumes = beforeUsage.substring(0, volumesIndex + volumesMatch[0].length);
  const afterVolumes = beforeUsage.substring(volumesIndex + volumesMatch[0].length);

  // Construct final docker-compose.yml:
  // 1. Everything before volumes: keyword
  // 2. volumes: keyword
  // 3. New volume definition
  // 4. Rest of volumes + services
  // 5. New services
  // 6. # USAGE comment and everything after
  const newDockerCompose = beforeVolumes + volumeDefinition + '\n' + afterVolumes + '\n' + dbService + '\n' + usageAndAfter;

  fs.writeFileSync(DOCKER_COMPOSE_PATH, newDockerCompose, 'utf-8');
  console.log(`✅ Services injected into docker-compose.yml\n`);

  // ============================================================
  // 4. INJECT INTO .ENV
  // ============================================================

  console.log('⚙️  Injecting configuration into .env...\n');

  const envConfig = `
# ================================================================
# ${serviceName} (LKMS${serviceCode})
# ================================================================
LKMS${serviceCode}_ENABLED=true
LKMS${serviceCode}_CONTAINER_NAME=lkms${serviceCode}-${serviceSlug}
LKMS${serviceCode}_REST_PORT=${restPort}
LKMS${serviceCode}_REST_PORT_EXTERNAL=${restPort}
LKMS${serviceCode}_GRPC_PORT=${grpcPort}
LKMS${serviceCode}_GRPC_PORT_EXTERNAL=${grpcPort}

# Database Configuration
LKMS${serviceCode}_DB_IMAGE=postgres:15-alpine
LKMS${serviceCode}_DB_CONTAINER_NAME=lkms${serviceCode}-${serviceSlug}-db
LKMS${serviceCode}_DB_NAME=${dbName}
LKMS${serviceCode}_DB_USER=lkern_admin
LKMS${serviceCode}_DB_PASSWORD=lkern_dev_password_2024
LKMS${serviceCode}_DB_VOLUME=lkern_lkms${serviceCode}_db_data
`;

  fs.appendFileSync(ENV_PATH, envConfig);
  console.log(`✅ Configuration injected into .env\n`);

  // ============================================================
  // 5. SUMMARY
  // ============================================================

  console.log('\n✅ Microservice generated successfully!\n');
  console.log('📁 Generated service:');
  console.log(`   - ${servicePath}`);
  console.log(`   - 25+ files created (app/, tests/, alembic/, etc.)`);
  console.log('\n📦 Docker services:');
  console.log(`   - ${dbServiceName} (PostgreSQL database)`);
  console.log(`   - ${appServiceName} (FastAPI application)`);
  console.log('\n⚙️  Configuration:');
  console.log(`   - REST API: http://localhost:${restPort}`);
  console.log(`   - gRPC API: localhost:${grpcPort}`);
  console.log(`   - Database: ${dbName}`);
  console.log('\n📝 Next steps:');
  console.log(`   1. cd services/${serviceDirName}`);
  console.log(`   2. Review generated code and customize as needed`);
  console.log(`   3. docker-compose up -d ${appServiceName}`);
  console.log(`   4. docker exec -it ${appServiceName} alembic upgrade head`);
  console.log(`   5. Visit http://localhost:${restPort}/docs for API documentation`);
  console.log('\n🎉 Done!\n');
}

// ============================================================
// MAIN
// ============================================================

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('❌ Error: Missing config file');
    console.log('\nUsage:');
    console.log('  node scripts/generate-microservice.js <config.json>');
    console.log('\nExample:');
    console.log('  node scripts/generate-microservice.js scripts/microservice-configs/issues-service.json');
    process.exit(1);
  }

  const configPath = path.resolve(args[0]);

  if (!fs.existsSync(configPath)) {
    console.error(`❌ Error: Config file not found: ${configPath}`);
    process.exit(1);
  }

  try {
    const config = JSON.parse(readFile(configPath));
    generateMicroservice(config);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
