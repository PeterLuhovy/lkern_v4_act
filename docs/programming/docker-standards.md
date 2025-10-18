# ================================================================
# L-KERN v4 - Docker & DevOps Standards
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\programming\docker-standards.md
# Version: 1.0.0
# Created: 2025-10-18
# Updated: 2025-10-18
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Docker and DevOps best practices for L-KERN v4 including
#   Dockerfile patterns, docker-compose setup, and hot-reload configuration.
# ================================================================

---

## 📋 Overview

This document contains **Docker and DevOps standards** for L-KERN v4.

**Key topics:**
- Dockerfile multi-stage builds
- docker-compose development setup
- Hot-reload configuration (React + FastAPI)
- Container naming conventions
- Volume management

---

## 1. Dockerfile Best Practices

### Multi-Stage Build - Python/FastAPI

**Dockerfile (production):**
```dockerfile
# ================================================================
# BUILDER STAGE - Install dependencies
# ================================================================
FROM python:3.11-slim as builder

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# ================================================================
# RUNTIME STAGE - Minimal production image
# ================================================================
FROM python:3.11-slim

WORKDIR /app

# Copy dependencies from builder
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

# Copy application code
COPY . .

# Expose ports
# 4101 = REST API
# 5101 = gRPC
EXPOSE 4101 5101

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "4101"]
```

**Dockerfile.dev (development with hot-reload):**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose ports
EXPOSE 4101 5101

# Run with auto-reload
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "4101", "--reload"]
```

---

### Multi-Stage Build - React/Vite

**Dockerfile (production with Nginx):**
```dockerfile
# ================================================================
# BUILDER STAGE - Build React app
# ================================================================
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source and build
COPY . .
RUN yarn build

# ================================================================
# RUNTIME STAGE - Serve with Nginx
# ================================================================
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Dockerfile.dev (development with Vite HMR):**
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
RUN yarn install

# Copy application code
COPY . .

# Expose Vite port
EXPOSE 4201

# Run with hot-reload
CMD ["yarn", "dev", "--host", "0.0.0.0"]
```

---

## 2. docker-compose Setup

### Development docker-compose.yml

**infrastructure/docker/docker-compose.yml:**
```yaml
version: '3.8'

# ================================================================
# SERVICES
# ================================================================
services:
  # === WEB UI (React 19 + Vite 6) ===
  lkms201-web-ui:
    build:
      context: ../../apps/web-ui
      dockerfile: Dockerfile.dev
    container_name: lkms201-web-ui
    ports:
      - "4201:4201"  # Vite dev server
    volumes:
      - ../../apps/web-ui:/app
      - /app/node_modules  # Prevent overwriting node_modules
    environment:
      - CHOKIDAR_USEPOLLING=true  # Enable file watching in Docker
      - NODE_ENV=development
    networks:
      - lkern-network
    restart: unless-stopped

  # === CONTACTS SERVICE (FastAPI) ===
  lkms101-contacts:
    build:
      context: ../../services/lkms101-contacts
      dockerfile: Dockerfile.dev
    container_name: lkms101-contacts
    ports:
      - "4101:4101"  # REST API
      - "5101:5101"  # gRPC
    volumes:
      - ../../services/lkms101-contacts:/app
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@lkms501-postgres:5432/lkms101_contacts
      - LOG_LEVEL=INFO
    depends_on:
      - lkms501-postgres
    networks:
      - lkern-network
    restart: unless-stopped

  # === POSTGRESQL 15 ===
  lkms501-postgres:
    image: postgres:15-alpine
    container_name: lkms501-postgres
    ports:
      - "4501:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_MULTIPLE_DATABASES=lkms101_contacts,lkms102_orders,lkms103_customers
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init-databases.sh:/docker-entrypoint-initdb.d/init-databases.sh
    networks:
      - lkern-network
    restart: unless-stopped

  # === ADMINER (Database UI) ===
  lkms901-adminer:
    image: adminer:latest
    container_name: lkms901-adminer
    ports:
      - "4901:8080"
    environment:
      - ADMINER_DEFAULT_SERVER=lkms501-postgres
    depends_on:
      - lkms501-postgres
    networks:
      - lkern-network
    restart: unless-stopped

  # === KAFKA (Message Broker) ===
  lkms503-kafka:
    image: confluentinc/cp-kafka:7.5.0
    container_name: lkms503-kafka
    ports:
      - "4503:9092"  # External access
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: lkms502-zookeeper:2181
      KAFKA_LISTENERS: EXTERNAL://0.0.0.0:9092,INTERNAL://0.0.0.0:9093
      KAFKA_ADVERTISED_LISTENERS: EXTERNAL://localhost:4503,INTERNAL://lkms503-kafka:9093
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: EXTERNAL:PLAINTEXT,INTERNAL:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: "true"
    depends_on:
      - lkms502-zookeeper
    networks:
      - lkern-network
    restart: unless-stopped

  # === ZOOKEEPER (Kafka dependency) ===
  lkms502-zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    container_name: lkms502-zookeeper
    ports:
      - "2181:2181"
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    networks:
      - lkern-network
    restart: unless-stopped

# ================================================================
# VOLUMES
# ================================================================
volumes:
  postgres-data:
    driver: local

# ================================================================
# NETWORKS
# ================================================================
networks:
  lkern-network:
    driver: bridge
```

---

## 3. Hot-Reload Configuration

### Vite (React) Hot-Reload

**⚠️ CRITICAL: Docker needs polling for file watching!**

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    host: '0.0.0.0',        // Listen on all interfaces (required for Docker)
    port: 4201,
    watch: {
      usePolling: true,     // ✅ REQUIRED for Docker hot-reload
      interval: 1000        // Poll every 1 second
    },
    hmr: {
      host: 'localhost',
      port: 4201
    }
  }
});
```

**docker-compose.yml environment:**
```yaml
environment:
  - CHOKIDAR_USEPOLLING=true  # Enable file watching polling
```

**Why polling?**
- Docker doesn't support native file system events (inotify)
- Polling checks for file changes every second
- Without it, HMR (Hot Module Replacement) won't work

---

### FastAPI Hot-Reload

**Dockerfile.dev:**
```dockerfile
# Use --reload flag for auto-reload on code changes
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "4101", "--reload"]
```

**Volume mounting:**
```yaml
volumes:
  - ../../services/lkms101-contacts:/app  # Mount source code
```

**How it works:**
- uvicorn's `--reload` watches for `.py` file changes
- Automatically restarts server when files change
- No polling needed (Python's watchdog works in Docker)

---

## 4. Container Naming Convention

**Format:** `lkms{service_id}-{service_name}`

**Examples:**
- `lkms201-web-ui` - Web UI (port 4201)
- `lkms101-contacts` - Contacts service (port 4101 REST, 5101 gRPC)
- `lkms102-orders` - Orders service (port 4102 REST, 5102 gRPC)
- `lkms501-postgres` - PostgreSQL (port 4501)
- `lkms503-kafka` - Apache Kafka (port 4503)
- `lkms901-adminer` - Adminer UI (port 4901)

**Service ID ranges:**
- `2XX` - Frontend applications (201, 202, ...)
- `1XX` - Backend microservices (101-199)
- `5XX` - Infrastructure (databases, message queues)
- `9XX` - Admin tools (Adminer, Kafka UI, monitoring)

**Port mapping:**
- Service ID determines port: `lkms101` → port `4101` (REST) + `5101` (gRPC)
- Frontend: `4201`, `4202`, ...
- Backend REST: `4101`, `4102`, `4103`, ...
- Backend gRPC: `5101`, `5102`, `5103`, ...
- Infrastructure: `4501` (PostgreSQL), `4503` (Kafka), ...
- Admin tools: `4901` (Adminer), `4903` (Kafka UI), ...

---

## 5. Volume Management

### Types of Volumes

**Named volumes (persistent data):**
```yaml
volumes:
  postgres-data:
    driver: local
```

**Bind mounts (source code for hot-reload):**
```yaml
volumes:
  - ../../apps/web-ui:/app           # Mount source code
  - /app/node_modules                # Prevent overwriting node_modules
```

**Why `/app/node_modules` exclusion?**
- Prevents host `node_modules` from overwriting container's optimized build
- Container installs dependencies optimized for Linux
- Host may have different OS (Windows, macOS)

---

### PostgreSQL Multi-Database Initialization

**infrastructure/docker/init-databases.sh:**
```bash
#!/bin/bash
set -e

# Create multiple databases
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE lkms101_contacts;
    CREATE DATABASE lkms102_orders;
    CREATE DATABASE lkms103_customers;
    CREATE DATABASE lkms104_warehouse;
    CREATE DATABASE lkms105_invoices;
EOSQL

echo "Multiple databases created successfully"
```

**Mount in docker-compose.yml:**
```yaml
volumes:
  - postgres-data:/var/lib/postgresql/data
  - ./init-databases.sh:/docker-entrypoint-initdb.d/init-databases.sh
```

---

## 6. Common Docker Commands

### Start/Stop Services

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d lkms201-web-ui

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### View Logs

```bash
# View all logs
docker-compose logs

# Follow logs (real-time)
docker-compose logs -f

# View specific service logs
docker-compose logs lkms101-contacts

# Follow specific service
docker-compose logs -f lkms101-contacts
```

### Rebuild Containers

```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build lkms201-web-ui

# Rebuild and start
docker-compose up -d --build
```

### Execute Commands in Container

```bash
# Enter container shell
docker exec -it lkms101-contacts bash

# Run single command
docker exec lkms101-contacts python -c "print('Hello')"

# Run database migrations
docker exec lkms101-contacts alembic upgrade head
```

---

## 7. Environment Variables

### .env File

**⚠️ NEVER commit `.env` to git!**

**Create `.env.example` as template:**
```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@lkms501-postgres:5432/lkms101_contacts

# API Keys
API_KEY=your_api_key_here
SECRET_KEY=your_secret_key_here

# Environment
NODE_ENV=development
LOG_LEVEL=INFO
```

**Load in docker-compose.yml:**
```yaml
services:
  lkms101-contacts:
    env_file:
      - .env
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - API_KEY=${API_KEY}
```

---

## 8. Production Considerations

### Security

- ✅ Use secrets management (Docker Swarm secrets, Kubernetes secrets)
- ✅ Don't expose unnecessary ports
- ✅ Run as non-root user in containers
- ✅ Use multi-stage builds to reduce attack surface
- ✅ Scan images for vulnerabilities

### Performance

- ✅ Use `.dockerignore` to exclude unnecessary files
- ✅ Optimize layer caching (copy `package.json` before source)
- ✅ Use Alpine images where possible (smaller size)
- ✅ Implement health checks
- ✅ Set resource limits (CPU, memory)

### Monitoring

- ✅ Centralized logging (ELK stack, Loki)
- ✅ Metrics collection (Prometheus)
- ✅ Distributed tracing (Jaeger, Zipkin)
- ✅ Health check endpoints (`/health`)

---

## Summary

**Docker standards cover:**
- ✅ Multi-stage Dockerfile builds (production + development)
- ✅ docker-compose development setup
- ✅ Hot-reload configuration (Vite polling + uvicorn reload)
- ✅ Container naming convention (lkms{id}-{name})
- ✅ Volume management (named volumes + bind mounts)
- ✅ Common Docker commands
- ✅ Environment variable handling

**See also:**
- [frontend-standards.md](frontend-standards.md) - Vite configuration
- [backend-standards.md](backend-standards.md) - FastAPI setup
- [coding-standards.md](coding-standards.md) - Core standards

---

**Last Updated:** 2025-10-18
**Maintainer:** BOSSystems s.r.o.
