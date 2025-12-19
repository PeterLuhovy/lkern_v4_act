---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
sidebar_position: 1
---

# Getting Started - L-KERN v4

## 📋 Overview

This guide walks you through setting up and running L-KERN v4 development environment using Docker.

**Prerequisites:**
- Docker Desktop installed
- Git installed
- Basic terminal/command line knowledge

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd lkern_codebase_v4_act
```

### Step 2: Verify Docker

```bash
# Check Docker is running
docker --version
docker-compose --version
```

### Step 3: Start Development Environment

```bash
# Start all services (detached mode)
docker-compose up -d

# View logs
docker-compose logs -f lkms201-web-ui
```

### Step 4: Access Application

Open browser:
- **Web UI**: http://localhost:4201

**That's it! You're running L-KERN v4.** 🎉

---

## 📖 Detailed Setup Guide

### 1. Environment Configuration

**L-KERN v4 uses `.env` file for configuration** (NOT checked into Git for security).

**Check if `.env` exists:**
```bash
ls -la | grep .env
```

**If missing, create from template:**
```bash
# Check if .env.example exists
cat .env.example

# Copy to .env (if template exists)
cp .env.example .env

# Edit with your values
nano .env  # or your preferred editor
```

**If no `.env.example` exists, configuration is embedded in `docker-compose.yml` using default values.**

---

### 2. Understanding Services

**Currently Active Services:**
- **lkms201-web-ui** - React 19 frontend (Port 4201)

**Commented Out (Future):**
- **lkms101-contacts** - Contacts microservice (Ports 4101 REST, 5101 gRPC)
- **lkms501-postgres** - PostgreSQL database (Port 4501)
- **lkms901-adminer** - Database admin UI (Port 4901)

**To enable commented services:**
1. Uncomment service block in `docker-compose.yml`
2. Ensure Dockerfile exists for that service
3. Rebuild: `docker-compose up --build -d`

---

### 3. Docker Commands Reference

#### Basic Operations

```bash
# 🚀 START all services
docker-compose up -d

# 🔨 REBUILD and start (after code/config changes)
docker-compose up --build -d

# 📊 VIEW LOGS (all services)
docker-compose logs -f

# 📊 VIEW LOGS (specific service)
docker-compose logs -f lkms201-web-ui

# 🔄 RESTART service
docker-compose restart lkms201-web-ui

# 🛑 STOP all services (keeps containers)
docker-compose stop

# 🛑 STOP and REMOVE containers (data in volumes preserved)
docker-compose down

# 🗑️ REMOVE everything (including volumes - ⚠️ DELETES DATA)
docker-compose down -v
```

#### Service Management

```bash
# Start specific service
docker-compose up -d lkms201-web-ui

# Stop specific service
docker-compose stop lkms201-web-ui

# View running containers
docker-compose ps

# View container details
docker inspect lkms201-web-ui
```

#### Shell Access

```bash
# Open bash shell in running container
docker exec -it lkms201-web-ui bash

# Run single command in container
docker exec lkms201-web-ui yarn --version

# Run command as root
docker exec -u root lkms201-web-ui apt-get update
```

---

### 4. Hot-Reload Development

**L-KERN v4 uses volume mounting for instant code updates.**

**How it works:**
1. Your local files are mounted into Docker container (see `volumes:` in docker-compose.yml)
2. Changes to `.tsx`, `.ts`, `.css` files trigger automatic rebuild
3. Browser refreshes automatically (Vite HMR)

**Mounted directories:**
- `./apps` → `/app/apps` (React applications)
- `./packages` → `/app/packages` (Shared packages)
- `./nx.json` → `/app/nx.json` (Nx configuration)
- `./tsconfig.base.json` → `/app/tsconfig.base.json` (TypeScript config)

**NOT mounted (preserved from Docker image):**
- `node_modules` - Uses Docker volume to avoid conflicts
- `package.json`, `yarn.lock` - Prevents version mismatches

**Testing hot-reload:**
```bash
# 1. Start services
docker-compose up -d

# 2. Edit file: apps/web-ui/src/App.tsx
# Change some text in JSX

# 3. Watch logs for rebuild
docker-compose logs -f lkms201-web-ui

# 4. Refresh browser - changes should appear
```

**If hot-reload stops working:**
- See [Troubleshooting Guide](troubleshooting.md#hot-reload-not-working)

---

### 5. Port Mapping

**L-KERN uses LKMS port mapping strategy:**

| Service | LKMS Code | Internal Port | External Port | Protocol |
|---------|-----------|---------------|---------------|----------|
| Web UI | lkms201 | 4201 | 4201 | HTTP |
| Contacts Service | lkms101 | 4101 (REST) | 4101 | HTTP/JSON |
| Contacts Service | lkms101 | 5101 (gRPC) | 5101 | gRPC |
| PostgreSQL | lkms501 | 5432 | 4501 | PostgreSQL |
| Adminer | lkms901 | 8080 | 4901 | HTTP |

**See:** [architecture/port-mapping.md](architecture/port-mapping.md) for complete mapping strategy.

---

### 6. Development Workflow

#### Typical Day-to-Day Workflow

```bash
# Morning: Start environment
docker-compose up -d

# Check everything is healthy
docker-compose ps

# View logs while developing
docker-compose logs -f lkms201-web-ui

# Make code changes (hot-reload applies automatically)

# Run tests (see Testing Guide)
docker exec lkms201-web-ui yarn nx test ui-components

# End of day: Stop environment
docker-compose stop
```

#### After Pulling New Code

```bash
# Pull latest changes
git pull

# Rebuild Docker images (dependencies might have changed)
docker-compose up --build -d

# Check logs for issues
docker-compose logs -f
```

#### After Changing Dependencies

```bash
# If you modified package.json
docker-compose down
docker-compose up --build -d

# Verify new packages installed
docker exec lkms201-web-ui yarn list --pattern <package-name>
```

---

### 7. Verification Checklist

**After setup, verify everything works:**

- [ ] `docker-compose ps` shows services as "healthy" or "running"
- [ ] http://localhost:4201 loads React application
- [ ] Making changes to `.tsx` files triggers hot-reload
- [ ] `docker-compose logs -f lkms201-web-ui` shows no errors
- [ ] Tests run successfully (see [Testing Guide](testing.md))

**If any step fails:**
- Check [Troubleshooting Guide](troubleshooting.md)
- Review `docker-compose logs -f`
- Ensure Docker Desktop has enough resources (Settings → Resources → Advanced)

---

## 🔗 Next Steps

1. **Read** [Project Overview](../project/roadmap.md) - Understand architecture
2. **Review** [Coding Standards](../guides/coding-standards.md) - Learn conventions
3. **Study** [Code Examples](../guides/code-examples.md) - Practical patterns
4. **Run** [Tests](testing.md) - Verify your setup with tests
5. **Explore** [Troubleshooting](troubleshooting.md) - Common issues and solutions

---

## 🆘 Getting Help

**Documentation:**
- [Testing Guide](testing.md) - How to run tests
- [Troubleshooting](troubleshooting.md) - Common problems and solutions
- [Port Mapping](architecture/port-mapping.md) - Service ports reference

**Common Issues:**
- Hot-reload not working → [Troubleshooting: Hot-reload](troubleshooting.md#hot-reload-not-working)
- Container fails to start → [Troubleshooting: Container startup](troubleshooting.md#container-startup-failures)
- Port conflicts → [Troubleshooting: Port conflicts](troubleshooting.md#port-already-in-use)

---

**Last Updated**: 2025-10-18
**Maintainer**: BOSSystems s.r.o.
