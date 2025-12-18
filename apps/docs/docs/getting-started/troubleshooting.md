---
id: troubleshooting
title: Troubleshooting
sidebar_label: Troubleshooting
sidebar_position: 3
---

# Troubleshooting Guide - L-KERN v4

## 📋 Overview

This document contains solutions to known issues and problems encountered during L-KERN v4 development. **When you encounter and solve a new problem, ADD IT HERE** so others (and future you) can find the solution quickly.

**Structure:**
- [Docker Issues](#docker-issues)
- [Development Environment](#development-environment)
- [Testing Issues](#testing-issues)
- [Build & Compilation](#build--compilation)
- [Database Issues](#database-issues)
- [Network & API](#network--api)
- [Performance Issues](#performance-issues)
- [Yarn & Dependencies](#yarn--dependencies)

---

## 🐳 Docker Issues

### Container Startup Failures

#### ❌ Problem: Container exits immediately after start

**Symptoms:**
```bash
docker-compose ps
# Shows: lkms201-web-ui  Exited (1)
```

**Check logs:**
```bash
docker-compose logs lkms201-web-ui
```

**Common Causes & Solutions:**

**1. Missing dependencies in package.json**
```bash
# Rebuild Docker image
docker-compose up --build -d
```

**2. Syntax error in code**
```bash
# Check logs for error details
docker-compose logs lkms201-web-ui | tail -50

# Fix syntax error in reported file
# Restart container
docker-compose restart lkms201-web-ui
```

**3. Port already in use**
```bash
# See: Port Already in Use section below
```

**4. Missing environment variables**
```bash
# Check .env file exists and has required variables
cat .env | grep LKMS201

# Add missing variables to .env
# Restart containers
docker-compose down && docker-compose up -d
```

---

### Port Already in Use

#### ❌ Problem: "Bind for 0.0.0.0:4201 failed: port is already allocated"

**Symptoms:**
```
Error starting userland proxy: listen tcp4 0.0.0.0:4201: bind: address already in use
```

**Solution 1: Find and kill process using the port**
```bash
# Windows
netstat -ano | findstr :4201
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :4201
kill -9 <PID>
```

**Solution 2: Change port in .env**
```bash
# Edit .env file
LKMS201_PORT_EXTERNAL=4202  # Change from 4201 to 4202

# Restart containers
docker-compose down
docker-compose up -d

# Access on new port: http://localhost:4202
```

**Solution 3: Stop conflicting Docker container**
```bash
# List all running containers
docker ps -a

# Stop conflicting container
docker stop <container-id>

# Remove if no longer needed
docker rm <container-id>
```

---

### Hot-Reload Not Working

#### ❌ Problem: Changes to code don't trigger rebuild

**Symptoms:**
- Edit `.tsx` file
- Save file
- Browser doesn't update
- No rebuild in logs

**Verification:**
```bash
# Check if file changes are detected
docker-compose logs -f lkms201-web-ui

# Make a change to a file
# Should see: "[vite] page reload src/App.tsx" in logs
```

**Solution 1: Verify volume mounting**
```bash
# Check docker-compose.yml has correct volumes:
volumes:
  - ./apps:/app/apps
  - ./packages:/app/packages

# Restart containers
docker-compose restart lkms201-web-ui
```

**Solution 2: Enable file polling (Windows/Network drives)**
```bash
# Add to docker-compose.yml environment:
environment:
  - CHOKIDAR_USEPOLLING=true
  - CHOKIDAR_INTERVAL=1000

# Restart
docker-compose down && docker-compose up -d
```

**Solution 3: Check file permissions (Linux/Mac)**
```bash
# Files must be readable by container user
chmod -R 755 apps/ packages/

# Restart container
docker-compose restart lkms201-web-ui
```

**Solution 4: Full rebuild**
```bash
# Nuclear option - rebuild everything
docker-compose down -v
docker-compose up --build -d
```

**Known Issue: `node_modules` conflicts**
```bash
# ⚠️ NEVER mount node_modules as volume!
# docker-compose.yml should have:
volumes:
  - node_modules:/app/node_modules  # Volume, not bind mount
  # NOT: - ./node_modules:/app/node_modules  ❌
```

---

### Docker Build Fails

#### ❌ Problem: "ERROR [internal] load metadata for docker.io/library/node:20-slim"

**Symptoms:**
Docker can't pull base image.

**Solution:**
```bash
# Check internet connection
ping docker.io

# Check Docker daemon is running
docker info

# Retry with clean state
docker system prune -a
docker-compose up --build -d
```

---

### Out of Disk Space

#### ❌ Problem: "No space left on device"

**Symptoms:**
Docker build fails or container can't write files.

**Solution:**
```bash
# Check Docker disk usage
docker system df

# Clean up unused images/containers
docker system prune -a --volumes

# Remove specific old images
docker images
docker rmi <image-id>

# Clean build cache
docker builder prune -a
```

---

## 💻 Development Environment

### Nx Workspace Issues

#### ❌ Problem: "Cannot find project 'ui-components'"

**Symptoms:**
```bash
yarn nx test ui-components
# Error: Cannot find configuration for 'ui-components'
```

**Solution 1: Check project.json exists**
```bash
# Verify project configuration file
cat packages/ui-components/project.json

# If missing, regenerate
yarn nx g @nx/react:library ui-components --dry-run
```

**Solution 2: Rebuild Nx cache**
```bash
# Clear Nx cache
rm -rf .nx/cache

# Rebuild cache
yarn nx reset
```

**Solution 3: Check tsconfig.base.json paths**
```bash
# Verify paths mapping exists
cat tsconfig.base.json | grep ui-components

# Should contain:
{
  "paths": {
    "@l-kern/ui-components": ["packages/ui-components/src/index.ts"]
  }
}
```

---

### TypeScript Errors After Adding Package

#### ❌ Problem: "Cannot find module '@l-kern/new-package'"

**Symptoms:**
Created new package, but TypeScript can't resolve imports.

**Solution:**
```bash
# 1. Check package.json name matches
cat packages/new-package/package.json | grep name
# Should be: "@l-kern/new-package"

# 2. Add to tsconfig.base.json paths
{
  "paths": {
    "@l-kern/new-package": ["packages/new-package/src/index.ts"]
  }
}

# 3. Restart TypeScript server in IDE
# VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"

# 4. Rebuild if using Docker
docker-compose restart lkms201-web-ui
```

---

### ESLint Errors After Update

#### ❌ Problem: ESLint shows errors after updating dependencies

**Symptoms:**
```
Parsing error: Cannot read file 'tsconfig.json'
```

**Solution:**
```bash
# Clear ESLint cache
rm -rf .eslintcache

# Reinstall dependencies
yarn install

# Restart IDE ESLint server
# VS Code: Reload Window (Ctrl+Shift+P)
```

---

## 🧪 Testing Issues

### Tests Fail with "Module Not Found"

#### ❌ Problem: Tests can't import @l-kern packages

**Symptoms:**
```
Error: Cannot find module '@l-kern/config'
```

**Solution 1: Verify vitest.config.ts has resolve.alias**
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    // ...
  },
  resolve: {
    alias: {
      '@l-kern/config': resolve(__dirname, '../../packages/config/src'),
    },
  },
});
```

**Solution 2: Install dependencies**
```bash
# In Docker
docker exec lkms201-web-ui yarn install

# Locally
yarn install
```

---

### Tests Pass Locally, Fail in CI

#### ❌ Problem: Tests work on your machine, fail in GitHub Actions

**Common Causes:**

**1. Missing test database**
```yaml
# .github/workflows/test.yml
services:
  postgres:
    image: postgres:15
    env:
      POSTGRES_PASSWORD: postgres
    options: >-
      --health-cmd pg_isready
      --health-interval 10s
```

**2. Timezone differences**
```bash
# Use UTC in tests
process.env.TZ = 'UTC';
```

**3. File path case sensitivity**
```bash
# ❌ Wrong (fails on Linux)
import { Button } from './button';

# ✅ Correct (works everywhere)
import { Button } from './Button';
```

---

### Coverage Report Not Generated

#### ❌ Problem: `coverage/` folder is empty

**Solution:**
```bash
# Run with explicit coverage flag
docker exec lkms201-web-ui yarn nx test ui-components --coverage

# Check vitest.config.ts has coverage config
test: {
  coverage: {
    provider: 'v8',
    reporter: ['html', 'text'],
  },
}

# Verify coverage folder
docker exec lkms201-web-ui ls -la packages/ui-components/coverage/
```

---

## 🔨 Build & Compilation

### Vite Build Fails

#### ❌ Problem: "RollupError: Could not resolve './Button.module.css'"

**Symptoms:**
CSS Module imports fail during build.

**Solution:**
```bash
# 1. Verify css-modules.d.ts exists
cat packages/ui-components/src/types/css-modules.d.ts

# Should contain:
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

# 2. Check tsconfig.json includes types
{
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/types/**/*.d.ts"]
}

# 3. Rebuild
yarn nx build ui-components
```

---

### TypeScript Build Errors

#### ❌ Problem: "Type 'X' is not assignable to type 'Y'"

**Common Causes:**

**1. Strict mode violations**
```typescript
// ❌ Wrong (undefined not handled)
const value: string = getValue();

// ✅ Correct
const value: string | undefined = getValue();
if (value) {
  // Use value
}
```

**2. Missing type definitions**
```bash
# Install type definitions
yarn add -D @types/node

# Or create custom .d.ts file
// src/types/custom.d.ts
declare module 'some-library';
```

---

### Build Works Locally, Fails in Docker

#### ❌ Problem: Local build succeeds, Docker build fails

**Common Causes:**

**1. Node version mismatch**
```bash
# Check local Node version
node --version

# Check Docker Node version
docker exec lkms201-web-ui node --version

# Should match Dockerfile:
FROM node:20-slim  # Use same version
```

**2. Missing build dependencies**
```dockerfile
# Add to Dockerfile.dev
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*
```

---

## 🗄️ Database Issues

### Connection Refused

#### ❌ Problem: "Error: connect ECONNREFUSED 127.0.0.1:5432"

**Symptoms:**
Backend service can't connect to PostgreSQL.

**Solution 1: Check service is running**
```bash
docker-compose ps
# lkms501-postgres should be "Up (healthy)"

# If not, start it
docker-compose up -d lkms501-postgres
```

**Solution 2: Use correct hostname**
```bash
# ❌ Wrong (localhost doesn't work in Docker)
DATABASE_HOST=localhost

# ✅ Correct (use service name)
DATABASE_HOST=lkms501-postgres
```

**Solution 3: Check network**
```bash
# Verify backend and database on same network
docker-compose.yml:
services:
  lkms101-contacts:
    networks:
      - database  # ⭐ Must match database service
  lkms501-postgres:
    networks:
      - database
```

---

### Alembic Migration Fails

#### ❌ Problem: "ERROR [alembic.env] Can't locate revision identified by 'xyz'"

**Symptoms:**
Database migration fails with unknown revision.

**Solution 1: Reset migrations (development only)**
```bash
# ⚠️ DESTROYS DATA - development only!
docker exec lkms501-postgres psql -U postgres -d lkms101_contacts -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Re-run migrations
docker exec lkms101-contacts alembic upgrade head
```

**Solution 2: Check migration files**
```bash
# Verify migration sequence
ls -la services/lkms101-contacts/alembic/versions/

# Each migration should have down_revision pointing to previous
# If broken, fix manually or create new baseline
```

---

## 🌐 Network & API

### CORS Errors in Browser

#### ❌ Problem: "Access to fetch has been blocked by CORS policy"

**Symptoms:**
Frontend can't call backend API.

**Solution:**
```python
# services/lkms101-contacts/app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4201"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### API Request Timeout

#### ❌ Problem: Frontend request hangs for 30+ seconds

**Symptoms:**
API calls time out or take very long.

**Solution 1: Check backend is running**
```bash
docker-compose ps
# lkms101-contacts should be "Up (healthy)"

# Check logs
docker-compose logs -f lkms101-contacts
```

**Solution 2: Verify endpoint URL**
```typescript
// ❌ Wrong (missing port)
const API_URL = 'http://localhost/api/v1/contacts';

// ✅ Correct
const API_URL = 'http://localhost:4101/api/v1/contacts';
```

**Solution 3: Check network connectivity**
```bash
# From frontend container, ping backend
docker exec lkms201-web-ui ping lkms101-contacts

# Should get replies
```

---

### gRPC Connection Failed

#### ❌ Problem: "Error: 14 UNAVAILABLE: failed to connect to all addresses"

**Symptoms:**
gRPC service can't connect to another service.

**Solution 1: Check gRPC port exposed**
```yaml
# docker-compose.yml
services:
  lkms101-contacts:
    ports:
      - "4101:4101"  # REST
      - "5101:5101"  # gRPC ⭐ Must be exposed
```

**Solution 2: Use correct hostname and port**
```python
# ❌ Wrong
channel = grpc.insecure_channel('localhost:5101')

# ✅ Correct (inside Docker)
channel = grpc.insecure_channel('lkms101-contacts:5101')
```

---

## ⚡ Performance Issues

### Slow Docker Build

#### ❌ Problem: Docker build takes 10+ minutes

**Symptoms:**
`docker-compose up --build` is extremely slow.

**Solution 1: Use .dockerignore**
```bash
# Create .dockerignore in project root
node_modules
.git
.nx/cache
dist
coverage
*.log
```

**Solution 2: Multi-stage builds**
```dockerfile
# Use multi-stage build to cache dependencies
FROM node:20-slim AS deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:20-slim AS runtime
COPY --from=deps /app/node_modules ./node_modules
```

**Solution 3: Increase Docker resources**
```
Docker Desktop → Settings → Resources
CPU: 4+ cores
Memory: 8+ GB
```

---

### Slow Hot-Reload

#### ❌ Problem: Changes take 30+ seconds to appear

**Symptoms:**
Edit file → save → wait long time → browser updates.

**Solution 1: Reduce file watching scope**
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    watch: {
      ignored: ['**/node_modules/**', '**/.git/**'],
    },
  },
});
```

**Solution 2: Use polling interval (Windows)**
```yaml
# docker-compose.yml
environment:
  - CHOKIDAR_USEPOLLING=true
  - CHOKIDAR_INTERVAL=1000  # 1 second (increase if too slow)
```

---

### High Memory Usage

#### ❌ Problem: Docker container using 4+ GB RAM

**Symptoms:**
Docker Desktop shows high memory usage.

**Solution 1: Limit container memory**
```yaml
# docker-compose.yml
services:
  lkms201-web-ui:
    deploy:
      resources:
        limits:
          memory: 2G
```

**Solution 2: Disable source maps in development**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    sourcemap: false,  // Reduces memory usage
  },
});
```

---

## 📦 Yarn & Dependencies

### Yarn Installation Fails

#### ❌ Problem: "YN0000: Failed to install dependencies"

**Symptoms:**
`yarn install` fails with cryptic error.

**Solution 1: Clear Yarn cache**
```bash
yarn cache clean
rm -rf node_modules
yarn install
```

**Solution 2: Check Node version**
```bash
node --version
# Should be 20.x or higher

# Update Node if needed (use nvm)
nvm install 20
nvm use 20
```

**Solution 3: Enable Corepack**
```bash
corepack enable
corepack prepare yarn@4.5.3 --activate
yarn install
```

---

### Peer Dependency Conflicts

#### ❌ Problem: "YN0060: Peer dependency on react@^19.0.0"

**Symptoms:**
Package requires React 19, but project uses different version.

**Solution 1: Update peer dependency**
```bash
# Check current React version
yarn why react

# Update to required version
yarn add react@^19.0.0 react-dom@^19.0.0
```

**Solution 2: Allow peer dependency mismatch (not recommended)**
```bash
# .yarnrc.yml
nodeLinker: node-modules
peerDependencyRules:
  allowedVersions:
    react: "19.x"
```

---

### Package Not Found After Install

#### ❌ Problem: "Error: Cannot find package '@l-kern/config'"

**Symptoms:**
Installed package, but imports don't work.

**Solution:**
```bash
# 1. Verify package is in workspace
cat package.json | grep workspaces

# Should include:
"workspaces": ["packages/*", "apps/*", "services/*"]

# 2. Check package.json exists
cat packages/config/package.json

# 3. Rebuild in Docker
docker-compose up --build -d

# 4. Restart TypeScript server in IDE
```

---

## 🔍 Debugging Techniques

### Enable Verbose Logging

```bash
# Docker Compose
docker-compose --verbose up

# Nx commands
yarn nx test ui-components --verbose

# Vite
DEBUG=vite:* yarn nx dev web-ui
```

---

### Inspect Container Filesystem

```bash
# Open shell in container
docker exec -it lkms201-web-ui bash

# Check file exists
ls -la /app/packages/ui-components/src/index.ts

# View file content
cat /app/packages/ui-components/src/index.ts

# Check environment variables
env | grep NODE_ENV
```

---

### Compare Local vs Docker Environment

```bash
# Local
node --version
yarn --version
env | sort

# Docker
docker exec lkms201-web-ui node --version
docker exec lkms201-web-ui yarn --version
docker exec lkms201-web-ui env | sort

# Diff to find differences
```

---

## 📝 Adding New Issues

**When you encounter and solve a new problem:**

1. **Document the problem clearly**
   - Exact error message
   - Steps that caused it
   - Symptoms observed

2. **Document the solution**
   - Exact commands used
   - Files changed
   - Why it worked

3. **Add to this file**
   - Use existing format
   - Add to appropriate section
   - Include code examples

**Template:**
```markdown
### Issue Title

#### ❌ Problem: Brief description

**Symptoms:**
- What you observed
- Error messages

**Solution:**
\`\`\`bash
# Commands that fixed it
\`\`\`

**Explanation:**
Why this solution works.
```

---

## 🆘 Still Stuck?

**If none of these solutions work:**

1. **Check full logs:**
   ```bash
   docker-compose logs --tail=100 lkms201-web-ui
   ```

2. **Try clean rebuild:**
   ```bash
   docker-compose down -v
   docker system prune -a
   docker-compose up --build -d
   ```

3. **Document your issue:**
   - Create detailed bug report
   - Include error messages, logs, steps to reproduce
   - Add to this troubleshooting guide after resolution

---

**Last Updated**: 2025-10-18
**Maintainer**: BOSSystems s.r.o.
