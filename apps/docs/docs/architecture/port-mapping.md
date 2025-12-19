---
id: port-mapping
title: Port Mapping Strategy
sidebar_label: Port Mapping
sidebar_position: 3
---

# Port Mapping Strategy - L-KERN v4

**Version:** 2.0.0
**Created:** 2025-10-13
**Updated:** 2025-11-08
**Project:** BOSS (Business Operating System Service)
**Developer:** BOSSystems s.r.o.

**Description:**
Complete port mapping strategy using 1:1 mapping pattern (`LKMS-XXX` → Port `4XXX`) for all services and infrastructure.

**Pattern**: 1:1 Mapping (LKMS number = Port number)

---

## 🎯 Port Mapping Pattern

**Simple Rule**: `LKMS-XXX` service uses port `4XXX`

### **Pattern Breakdown:**

```
LKMS Number  →  Port Number
lkms101      →  4101
lkms102      →  4102
lkms201      →  4201
lkms901      →  4901
```

**Benefits:**
- ✅ Easy to remember (LKMS101 = Port 4101)
- ✅ No conflicts (each service has unique port)
- ✅ Clear separation by service type
- ✅ Scalable (supports up to 999 services)

---

## 📊 Service Categories & Port Ranges

### **100-199: Business Microservices**

Backend APIs for core business logic.

| LKMS | Service | Port | Description |
|------|---------|------|-------------|
| lkms101 | contacts | 4101 | Contacts management API |
| lkms102 | orders | 4102 | Orders management API |
| lkms103 | customers | 4103 | Customers management API |
| lkms104 | inventory | 4104 | Inventory management API |
| lkms105 | finance | 4105 | Finance & accounting API |
| lkms106 | reports | 4106 | Reporting & analytics API |
| lkms107 | auth | 4107 | Authentication & authorization API |

### **200-299: Frontend Applications**

User-facing web applications.

| LKMS | Service | Port | Description |
|------|---------|------|-------------|
| lkms201 | web-ui | 4201 | Main React web application |
| lkms202 | mobile-ui | 4202 | Mobile web app (future) |
| lkms203 | admin-ui | 4203 | Admin dashboard (future) |

### **300-399: Gateway & Proxy**

API Gateway, load balancers, reverse proxies.

| LKMS | Service | Port | Description |
|------|---------|------|-------------|
| lkms301 | api-gateway | 4301 | Main API Gateway (future) |
| lkms302 | nginx-proxy | 4302 | Nginx reverse proxy (future) |

### **400-499: Integration Services**

Third-party integrations, webhooks, message queues.

| LKMS | Service | Port | Description |
|------|---------|------|-------------|
| lkms401 | webhook-handler | 4401 | Webhook processor (future) |
| lkms402 | message-queue | 4402 | RabbitMQ/Redis (future) |

### **500-599: Data Services**

Databases, caching, data processing, event streaming.

| LKMS | Service | Port | Description |
|------|---------|------|-------------|
| lkms501 | postgres-main | 4501 | PostgreSQL main DB (future - per-service DBs) |
| lkms502 | redis-cache | 4502 | Redis caching (future) |
| lkms503 | zookeeper | **2181** | Apache Zookeeper (exception: standard port) |
| lkms504 | kafka | 4503 | Apache Kafka event streaming |
| lkms505 | elasticsearch | 4505 | Search engine (future) |

**Note:** Zookeeper uses standard port **2181** instead of 4503 (exception to pattern)

### **900-999: Development Tools**

Development-only services (not in production).

| LKMS | Service | Port | Description |
|------|---------|------|-------------|
| lkms901 | adminer | 4901 | Database management UI |
| lkms902 | docs | 4902 | Docusaurus + Storybook documentation |
| lkms903 | mailhog | 4903 | Email testing (future) |
| lkms904 | swagger-ui | 4904 | API documentation viewer (future) |

---

## 🔌 gRPC Internal Communication

### **gRPC Port Convention: 5XXX**

Backend services expose **TWO ports**:
- **REST API (4XXX)**: External HTTP/JSON communication (frontend → backend)
- **gRPC API (5XXX)**: Internal service-to-service communication (backend ↔ backend)

| LKMS | Service | REST Port | gRPC Port | Description |
|------|---------|-----------|-----------|-------------|
| lkms101 | contacts | 4101 | **5101** | Contacts service (REST + gRPC) |
| lkms102 | orders | 4102 | **5102** | Orders service (REST + gRPC) |
| lkms105 | issues | 4105 | **5105** | Issues service (REST + gRPC) |
| lkms107 | auth | 4107 | **5107** | Authentication service (REST + gRPC) |

**Pattern**: REST port 4XXX → gRPC port 5XXX

**Example:**
```yaml
lkms101-contacts:
  ports:
    - "4101:4101"  # REST API (external)
    - "5101:5101"  # gRPC API (internal only)
```

---

## 🔧 Docker Configuration

### **docker-compose.yml Pattern:**

```yaml
services:
  lkms101-contacts:
    ports:
      - "4101:4101"  # External:Internal (same port)
    environment:
      - PORT=4101
      - SERVICE_NAME=lkms101-contacts
```

### **Environment Variables:**

```bash
# Service-specific ports
LKMS101_PORT=4101
LKMS102_PORT=4102
LKMS201_PORT=4201
LKMS901_PORT=4901

# Database ports (5XX range)
POSTGRES_MAIN_PORT=4501
REDIS_PORT=4502
```

---

## 📝 Service URLs (Development)

```
# Frontend
http://localhost:4201          → Web UI (React app)

# Backend APIs
http://localhost:4101/docs     → Contacts API (Swagger)
http://localhost:4102/docs     → Orders API (Swagger)
http://localhost:4107/docs     → Auth API (Swagger)

# Development Tools
http://localhost:4901          → Adminer (DB viewer)
http://localhost:4903          → Mailhog (Email testing)

# Databases & Event Streaming
postgresql://localhost:4501    → PostgreSQL
redis://localhost:4502         → Redis
zookeeper://localhost:2181     → Zookeeper
kafka://localhost:4503         → Kafka
```

---

## 🚀 Adding New Services

**Step 1**: Choose LKMS number based on category
```
Business logic?     → 100-199
Frontend?           → 200-299
Gateway/Proxy?      → 300-399
Integration?        → 400-499
Data service?       → 500-599
Dev tool?           → 900-999
```

**Step 2**: Assign port = `4{LKMS}`
```
lkms108 (new business service) → Port 4108
lkms204 (new frontend app)     → Port 4204
```

**Step 3**: Update documentation
- Add to this file (port-mapping.md)
- Add to docker-compose.yml
- Add to .env file

---

## ⚠️ Reserved Ports

**DO NOT USE** these ports (conflicts with common services):

```
4000  - Common dev server port
4200  - Angular CLI default
4300  - React Native Metro
4443  - HTTPS alternative
4500  - Reserved for future
```

**Safe ranges:**
- ✅ 4101-4199 (Business services)
- ✅ 4201-4299 (Frontend apps)
- ✅ 4301-4399 (Gateways)
- ✅ 4401-4499 (Integrations)
- ✅ 4501-4599 (Data services)
- ✅ 4901-4999 (Dev tools)

---

## 📊 Quick Reference Table

| Service Type | LKMS Range | Port Range | Example |
|--------------|------------|------------|---------|
| Business APIs | 100-199 | 4100-4199 | lkms101 → 4101 |
| Frontend | 200-299 | 4200-4299 | lkms201 → 4201 |
| Gateway/Proxy | 300-399 | 4300-4399 | lkms301 → 4301 |
| Integration | 400-499 | 4400-4499 | lkms401 → 4401 |
| Data Services | 500-599 | 4500-4599 | lkms501 → 4501 |
| Dev Tools | 900-999 | 4900-4999 | lkms901 → 4901 |

---

**Last Updated**: 2025-11-08
**Maintained by**: BOSSystems s.r.o. Development Team

---

## 📝 Changelog

**v2.0.0 (2025-11-08)**:
- Added Apache Kafka (lkms504, port 4503) for event streaming
- Added Apache Zookeeper (lkms503, port 2181 - exception to 4XXX pattern)
- Added gRPC port convention (5XXX range for internal service communication)
- Updated elasticsearch to lkms505

**v1.0.0 (2025-10-13)**:
- Initial port mapping strategy with 1:1 pattern (`LKMS-XXX` → `4XXX`)
