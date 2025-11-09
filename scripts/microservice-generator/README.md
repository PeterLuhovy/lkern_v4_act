# ================================================================
# Microservice Generator - Documentation
# ================================================================
# File: scripts/README-MICROSERVICE-GENERATOR.md
# Version: v1.0.0
# Updated: 2025-11-08
# Project: L-KERN v4 - Business Operating System Service
# ================================================================

---

## 📖 Overview

**Automated generator for Python FastAPI microservices** - creates production-ready microservices in 30 seconds.

### **What It Does**

1. **Copies** `services/lkms-template/` → `services/lkms{code}-{name}/`
2. **Replaces** 11 placeholders in all files (SERVICE_NAME, REST_PORT, DB_NAME, etc.)
3. **Injects** 2 Docker services into `docker-compose.yml` (database + app)
4. **Injects** configuration into `.env`
5. **Ready to run** - `docker-compose up` and service is live!

### **Time Savings**

- **Manual setup:** 4-6 hours (structure + boilerplate + config + testing)
- **Generator:** 30 seconds + 10 min customization
- **ROI:** 10+ services = 40-60 hours saved

---

## 🚀 Quick Start

### **1. Create Configuration File**

Create a JSON config in `scripts/microservice-configs/`:

```json
{
  "serviceCode": "105",
  "serviceName": "Issues Service",
  "serviceSlug": "issues",
  "restPort": 4105,
  "grpcPort": 5105,
  "dbName": "lkern_issues",
  "modelName": "Issue",
  "tableName": "issues",
  "routePrefix": "issues",
  "routeSingular": "issue",
  "serviceDescription": "Issue tracking and management service",
  "serviceLongDescription": "Comprehensive issue tracking system..."
}
```

### **2. Run Generator**

```bash
node scripts/generate-microservice.js scripts/microservice-configs/issues-service.json
```

### **3. Start Service**

```bash
# Start database + app
docker-compose up -d lkms105-issues lkms105-issues-db

# Run database migrations
docker exec -it lkms105-issues alembic upgrade head

# Visit API documentation
open http://localhost:4105/docs
```

✅ **Done!** Service is running with full CRUD API, gRPC, Kafka, and database.

---

## 📋 Configuration Format

### **Required Fields**

All 11 fields are **required**:

| Field | Type | Example | Description |
|-------|------|---------|-------------|
| `serviceCode` | string | `"105"` | Service code (used in LKMS105, ports 4105/5105) |
| `serviceName` | string | `"Issues Service"` | Human-readable service name |
| `serviceSlug` | string | `"issues"` | URL-friendly slug (kebab-case) |
| `restPort` | number | `4105` | REST API port (convention: 41XX) |
| `grpcPort` | number | `5105` | gRPC API port (convention: 51XX) |
| `dbName` | string | `"lkern_issues"` | PostgreSQL database name |
| `modelName` | string | `"Issue"` | SQLAlchemy model class name (PascalCase) |
| `tableName` | string | `"issues"` | Database table name (snake_case) |
| `routePrefix` | string | `"issues"` | REST API route prefix (/issues) |
| `routeSingular` | string | `"issue"` | Singular form for events (issue.created) |
| `serviceDescription` | string | `"Issue tracking..."` | Short description (1 line) |
| `serviceLongDescription` | string | `"Comprehensive..."` | Detailed description (1 paragraph) |

### **Port Conventions**

- **REST API:** 41XX (e.g., 4101, 4105, 4110)
- **gRPC API:** 51XX (e.g., 5101, 5105, 5110)
- **Service Code:** Matches port last 2-3 digits (e.g., code 105 → ports 4105/5105)

### **Naming Conventions**

- **serviceCode:** Numbers only (e.g., `"105"`, `"101"`)
- **serviceName:** Title Case (e.g., `"Issues Service"`, `"Contact Service (MDM)"`)
- **serviceSlug:** kebab-case (e.g., `"issues"`, `"contacts"`)
- **modelName:** PascalCase (e.g., `"Issue"`, `"Contact"`)
- **tableName:** snake_case plural (e.g., `"issues"`, `"contacts"`)
- **routePrefix:** kebab-case plural (e.g., `"issues"`, `"contacts"`)
- **routeSingular:** kebab-case singular (e.g., `"issue"`, `"contact"`)

---

## 📁 Generated Structure

Running the generator creates:

```
services/lkms{code}-{slug}/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app entry point
│   ├── config.py               # Pydantic settings
│   ├── database.py             # SQLAlchemy setup
│   ├── models/
│   │   ├── __init__.py
│   │   └── example.py          # SQLAlchemy model (customizable)
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── example.py          # Pydantic schemas
│   ├── api/
│   │   ├── __init__.py
│   │   ├── rest/
│   │   │   ├── __init__.py
│   │   │   └── example.py      # CRUD REST endpoints
│   │   └── grpc/
│   │       ├── __init__.py
│   │       └── example_service.py  # gRPC service
│   └── events/
│       ├── __init__.py
│       ├── producer.py         # Kafka producer
│       └── consumer.py         # Kafka consumer
├── alembic/
│   ├── env.py                  # Migration environment
│   ├── script.py.mako          # Migration template
│   └── README                  # Migration instructions
├── tests/
│   ├── __init__.py
│   └── test_api.py             # 13 comprehensive tests
├── alembic.ini                 # Alembic configuration
├── requirements.txt            # Python dependencies
├── .env.template               # Environment variables template
└── README.md                   # Service documentation
```

**Total:** 25+ files ready to use!

---

## 🔧 Customization After Generation

### **1. Update Model** (`app/models/example.py`)

Add your domain-specific fields:

```python
class Issue(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)  # ADD
    description = Column(Text)                    # ADD
    priority = Column(String(20))                 # ADD
    status = Column(String(20))                   # ADD
    assigned_to = Column(String(100))             # ADD
    # ... keep standard fields (created_at, updated_at, is_active)
```

### **2. Update Schemas** (`app/schemas/example.py`)

Match your model fields:

```python
class IssueBase(BaseModel):
    title: str
    description: str | None = None
    priority: str | None = None
    status: str | None = None
    assigned_to: str | None = None

class IssueCreate(IssueBase):
    pass

class IssueUpdate(BaseModel):
    title: str | None = None
    # ... partial updates
```

### **3. Customize REST API** (`app/api/rest/example.py`)

Add custom endpoints, filters, business logic:

```python
@router.get("/by-status/{status}")
async def get_issues_by_status(status: str, db: Session = Depends(get_db)):
    items = db.query(Issue).filter(Issue.status == status).all()
    return items
```

### **4. Add Database Migration**

```bash
# Enter container
docker exec -it lkms105-issues bash

# Generate migration from model changes
alembic revision --autogenerate -m "Add issue fields"

# Apply migration
alembic upgrade head
```

### **5. Add gRPC Methods** (`app/api/grpc/example_service.py`)

Implement inter-service communication:

```python
class IssueService:
    async def GetIssuesByUser(self, request, context):
        # Implementation
        pass
```

---

## 📦 Example Configurations

### **Example 1: Issues Service** (`issues-service.json`)

```json
{
  "serviceCode": "105",
  "serviceName": "Issues Service",
  "serviceSlug": "issues",
  "restPort": 4105,
  "grpcPort": 5105,
  "dbName": "lkern_issues",
  "modelName": "Issue",
  "tableName": "issues",
  "routePrefix": "issues",
  "routeSingular": "issue",
  "serviceDescription": "Issue tracking and management service",
  "serviceLongDescription": "Comprehensive issue tracking system..."
}
```

**Generated:**
- REST API: `http://localhost:4105/issues`
- gRPC: `localhost:5105`
- Database: `lkern_issues`
- Kafka events: `issues.issue.created`, `issues.issue.updated`, `issues.issue.deleted`

### **Example 2: Contact MDM Service** (`contacts-service.json`)

```json
{
  "serviceCode": "101",
  "serviceName": "Contact Service (MDM)",
  "serviceSlug": "contacts",
  "restPort": 4101,
  "grpcPort": 5101,
  "dbName": "lkern_contacts",
  "modelName": "Contact",
  "tableName": "contacts",
  "routePrefix": "contacts",
  "routeSingular": "contact",
  "serviceDescription": "Contact Master Data Management service",
  "serviceLongDescription": "MDM service for contacts..."
}
```

### **Example 3: Test Service** (`test-service.json`)

For generator validation and testing:

```json
{
  "serviceCode": "999",
  "serviceName": "Test Service",
  "serviceSlug": "test",
  "restPort": 4999,
  "grpcPort": 5999,
  "dbName": "lkern_test",
  "modelName": "TestItem",
  "tableName": "test_items",
  "routePrefix": "test-items",
  "routeSingular": "test-item",
  "serviceDescription": "Test microservice for generator validation",
  "serviceLongDescription": "Test service used to validate generator..."
}
```

---

## 🧪 Testing Generated Service

### **1. Build and Start**

```bash
docker-compose up -d lkms105-issues lkms105-issues-db
```

### **2. Run Migrations**

```bash
docker exec -it lkms105-issues alembic upgrade head
```

### **3. Test REST API**

```bash
# Health check
curl http://localhost:4105/health

# Create item
curl -X POST http://localhost:4105/issues/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Issue", "description": "Test description", "is_active": true}'

# List items
curl http://localhost:4105/issues/
```

### **4. Test API Documentation**

Visit: `http://localhost:4105/docs` (Swagger UI)

### **5. Run Unit Tests**

```bash
docker exec -it lkms105-issues pytest
```

Expected: **13 tests passing** (CRUD + validation)

### **6. Test Kafka Events**

Check Kafka logs:

```bash
docker logs lkms504-kafka --tail 100
```

### **7. Test Database (Adminer)**

Visit: `http://localhost:4901`

- System: PostgreSQL
- Server: lkms105-issues-db
- Username: lkern_admin
- Password: lkern_dev_password_2024
- Database: lkern_issues

---

## 🐛 Known Issues

### **v1.0.0 - docker-compose.yml Injection Bug**

**Issue:** Generator injects services BEFORE `# VOLUMES` comment instead of into `services:` section.

**Workaround:** Manually move generated services from top of docker-compose.yml into `services:` section.

**Status:** Will be fixed in v1.0.1 (see Roadmap below).

**Example Fix:**
```bash
# After running generator, manually move these blocks:
# FROM: After networks: section (line ~25)
# TO: Inside services: section (line ~100+)
```

---

## 🚨 Troubleshooting

### **Error: "Service directory already exists"**

**Problem:** Service was already generated before.

**Solution:** Delete existing service or use different serviceCode/serviceSlug.

```bash
# Delete existing service
rm -rf services/lkms105-issues

# Remove from docker-compose.yml (manual)
# Remove from .env (manual)
```

### **Error: "Port already in use"**

**Problem:** Another service using the same port.

**Solution:** Change `restPort` and `grpcPort` in config to unused ports.

### **Error: "Database connection failed"**

**Problem:** Database container not healthy yet.

**Solution:** Wait for health check to pass:

```bash
docker ps  # Check STATUS column for "healthy"
docker logs lkms105-issues-db  # Check database logs
```

### **Error: "Placeholder not replaced"**

**Problem:** Generator didn't replace all placeholders.

**Solution:** Check config has all 11 required fields. Re-run generator.

---

## 📚 Advanced Usage

### **Generate Multiple Services**

```bash
# Generate 3 services in sequence
node scripts/generate-microservice.js scripts/microservice-configs/issues-service.json
node scripts/generate-microservice.js scripts/microservice-configs/contacts-service.json
node scripts/generate-microservice.js scripts/microservice-configs/inventory-service.json

# Start all services
docker-compose up -d
```

### **Service-to-Service Communication (gRPC)**

Example: Issues Service calls Contact Service to get contact details.

**In Issues Service (`app/api/grpc/example_service.py`):**

```python
import grpc
from generated.contact_pb2 import GetContactRequest
from generated.contact_pb2_grpc import ContactServiceStub

async def get_contact_name(contact_id: int) -> str:
    channel = grpc.aio.insecure_channel('lkms101-contacts:5101')
    stub = ContactServiceStub(channel)
    response = await stub.GetContact(GetContactRequest(id=contact_id))
    return response.name
```

### **Event-Driven Workflows (Kafka)**

Example: When Contact is updated, Issue Service updates cached contact names.

**In Issues Service (`app/events/consumer.py`):**

```python
consumer = EventConsumer()

@consumer.register('contacts.contact.updated')
async def handle_contact_updated(data: dict):
    contact_id = data['id']
    contact_name = data['name']
    # Update cached contact names in issues
    db.query(Issue).filter(Issue.assigned_to_id == contact_id).update({
        Issue.assigned_to_name: contact_name
    })
```

---

## 🎯 Roadmap

### **v1.1.0 (Future)**

- [ ] Auto-generate gRPC proto files from model
- [ ] CLI interactive mode (prompt for each field)
- [ ] Validate port availability before generation
- [ ] Auto-add service to sidebar (frontend integration)

### **v1.2.0 (Future)**

- [ ] Support for microservice variants (read-only, write-only, event-only)
- [ ] Database migration pre-generation (based on model)
- [ ] Docker Compose profile support (dev, prod, test)

### **v2.0.0 (Future)**

- [ ] Visual configurator (web UI for creating configs)
- [ ] Service dependency graph generation
- [ ] Auto-generate frontend CRUD pages
- [ ] Multi-language support (Python, TypeScript, Go)

---

## 📞 Help & Support

**Documentation:**
- Generator code: `scripts/generate-microservice.js`
- Template structure: `services/lkms-template/`
- Example configs: `scripts/microservice-configs/`
- Architecture docs: `docs/architecture/microservices-architecture.md`

**Common Questions:**
1. **How do I customize the generated service?** - Modify files in `services/lkms{code}-{slug}/` after generation
2. **Can I re-generate a service?** - Delete existing service first, then re-run generator
3. **What if I need more than 11 placeholders?** - Add to generator script + template
4. **How do I add authentication?** - Customize `app/main.py` with FastAPI security middleware

---

**Last Updated:** 2025-11-08
**Version:** v1.0.0
**Maintainer:** BOSSystems s.r.o.
**Project:** L-KERN v4 - Business Operating System Service
