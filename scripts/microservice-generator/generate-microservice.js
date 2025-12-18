#!/usr/bin/env node

/*
 * ================================================================
 * FILE: generate-microservice.js
 * PATH: /scripts/microservice-generator/generate-microservice.js
 * DESCRIPTION: Generator for Python FastAPI microservices from template
 * VERSION: v2.0.0
 * UPDATED: 2025-12-16
 *
 * USAGE:
 * node scripts/microservice-generator/generate-microservice.js configs/config.json
 * OR
 * npm run generate:microservice -- configs/config.json
 *
 * CONFIG FORMAT: See configs/test-service.json
 *
 * NEW IN v2.0.0:
 * - codePrefix: Human-readable code prefix (e.g., ISS, ORD)
 * - hasRichEnums: Enable Type/Status/Priority enums (default: true)
 * - hasFileUpload: Enable MinIO integration (default: false)
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
    // NEW in v2.0.0
    codePrefix,            // e.g., "ISS" - for human-readable codes (ISS-2512-0001)
    hasRichEnums = true,   // Enable Type/Status/Priority enums (default: true)
    hasFileUpload = false, // Enable MinIO integration (default: false)
  } = config;

  // Validate required fields
  const requiredFields = [
    'serviceCode', 'serviceName', 'serviceSlug', 'restPort', 'grpcPort',
    'dbName', 'modelName', 'tableName', 'routePrefix', 'routeSingular',
    'serviceDescription', 'serviceLongDescription', 'codePrefix'
  ];

  for (const field of requiredFields) {
    if (!config[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Log feature flags
  console.log('📋 Feature flags:');
  console.log(`   - codePrefix: ${codePrefix}`);
  console.log(`   - hasRichEnums: ${hasRichEnums}`);
  console.log(`   - hasFileUpload: ${hasFileUpload}\n`);

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
    // NEW in v2.0.0
    '{{CODE_PREFIX}}': codePrefix,
  };

  replacePlaceholdersInDirectory(servicePath, replacements);
  console.log(`✅ Placeholders replaced in all files\n`);

  // ============================================================
  // 2.1 CONDITIONAL: hasRichEnums
  // ============================================================
  // If hasRichEnums is false, remove enum-related files and simplify model

  if (!hasRichEnums) {
    console.log('🔄 hasRichEnums=false: Removing enum definitions...\n');

    // Delete enums.py
    const enumsPath = path.join(servicePath, 'app', 'models', 'enums.py');
    if (fs.existsSync(enumsPath)) {
      fs.unlinkSync(enumsPath);
      console.log(`   ❌ Deleted: ${enumsPath}`);
    }

    // Update models/__init__.py - remove enum imports
    const modelsInitPath = path.join(servicePath, 'app', 'models', '__init__.py');
    if (fs.existsSync(modelsInitPath)) {
      let content = readFile(modelsInitPath);
      // Remove enum import line
      content = content.replace(/from app\.models\.enums import \([^)]+\)\n/g, '');
      // Remove enum exports from __all__
      content = content.replace(/"[^"]+Type",\n/g, '');
      content = content.replace(/"[^"]+Status",\n/g, '');
      content = content.replace(/"[^"]+Priority",\n/g, '');
      content = content.replace(/"TYPE_CODE_PREFIXES",\n/g, '');
      fs.writeFileSync(modelsInitPath, content);
      console.log(`   ✏️  Simplified: ${modelsInitPath}`);
    }

    console.log(`✅ Enum definitions removed (hasRichEnums=false)\n`);
  } else {
    console.log('✅ Rich enums enabled (hasRichEnums=true)\n');
  }

  // ============================================================
  // 2.2 CONDITIONAL: hasFileUpload
  // ============================================================
  // If hasFileUpload is false, remove MinIO-related files

  if (!hasFileUpload) {
    console.log('🔄 hasFileUpload=false: Removing MinIO integration...\n');

    // Files to remove when hasFileUpload=false
    const minioFiles = [
      path.join(servicePath, 'app', 'services', 'minio_client.py'),
      path.join(servicePath, 'app', 'api', 'rest', 'uploads.py'),
    ];

    for (const filePath of minioFiles) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`   ❌ Deleted: ${filePath}`);
      }
    }

    // Update services/__init__.py - remove minio import if present
    const servicesInitPath = path.join(servicePath, 'app', 'services', '__init__.py');
    if (fs.existsSync(servicesInitPath)) {
      let content = readFile(servicesInitPath);
      content = content.replace(/from app\.services\.minio_client import.*\n/g, '');
      content = content.replace(/"minio_client",?\n?/g, '');
      content = content.replace(/"MinioClient",?\n?/g, '');
      fs.writeFileSync(servicesInitPath, content);
      console.log(`   ✏️  Updated: ${servicesInitPath}`);
    }

    // Update api/rest/__init__.py - remove uploads router if present
    const apiInitPath = path.join(servicePath, 'app', 'api', 'rest', '__init__.py');
    if (fs.existsSync(apiInitPath)) {
      let content = readFile(apiInitPath);
      content = content.replace(/from app\.api\.rest\.uploads import.*\n/g, '');
      content = content.replace(/.*uploads.*router.*\n/g, '');
      fs.writeFileSync(apiInitPath, content);
      console.log(`   ✏️  Updated: ${apiInitPath}`);
    }

    console.log(`✅ MinIO integration removed (hasFileUpload=false)\n`);
  } else {
    console.log('🔄 hasFileUpload=true: Enabling MinIO integration...\n');

    // Uncomment MinIO imports in services/__init__.py
    const servicesInitPath = path.join(servicePath, 'app', 'services', '__init__.py');
    if (fs.existsSync(servicesInitPath)) {
      let content = readFile(servicesInitPath);
      // Uncomment MinIO import line
      content = content.replace(
        /# from app\.services\.minio_client import MinioService, get_minio_service/g,
        'from app.services.minio_client import MinioService, get_minio_service'
      );
      // Uncomment __all__ entries
      content = content.replace(/# "MinioService",/g, '"MinioService",');
      content = content.replace(/# "get_minio_service",/g, '"get_minio_service",');
      fs.writeFileSync(servicesInitPath, content);
      console.log(`   ✏️  Enabled MinIO in: ${servicesInitPath}`);
    }

    // Uncomment uploads router in api/rest/__init__.py
    const apiInitPath = path.join(servicePath, 'app', 'api', 'rest', '__init__.py');
    if (fs.existsSync(apiInitPath)) {
      let content = readFile(apiInitPath);
      // Uncomment uploads router import
      content = content.replace(
        /# from app\.api\.rest\.uploads import router as uploads_router/g,
        'from app.api.rest.uploads import router as uploads_router'
      );
      // Uncomment __all__ entry
      content = content.replace(/# "uploads_router",/g, '"uploads_router",');
      fs.writeFileSync(apiInitPath, content);
      console.log(`   ✏️  Enabled uploads router in: ${apiInitPath}`);
    }

    // Uncomment MinIO vars in .env.template
    const envTemplatePath = path.join(servicePath, '.env.template');
    if (fs.existsSync(envTemplatePath)) {
      let content = readFile(envTemplatePath);
      // Uncomment MinIO config lines
      content = content.replace(/# MINIO_ENDPOINT=/g, 'MINIO_ENDPOINT=');
      content = content.replace(/# MINIO_ACCESS_KEY=/g, 'MINIO_ACCESS_KEY=');
      content = content.replace(/# MINIO_SECRET_KEY=/g, 'MINIO_SECRET_KEY=');
      content = content.replace(/# MINIO_BUCKET_NAME=/g, 'MINIO_BUCKET_NAME=');
      content = content.replace(/# MINIO_SECURE=/g, 'MINIO_SECURE=');
      content = content.replace(/# MAX_FILE_SIZE=/g, 'MAX_FILE_SIZE=');
      fs.writeFileSync(envTemplatePath, content);
      console.log(`   ✏️  Enabled MinIO vars in: ${envTemplatePath}`);
    }

    console.log(`✅ MinIO file upload enabled (hasFileUpload=true)\n`);
  }

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
