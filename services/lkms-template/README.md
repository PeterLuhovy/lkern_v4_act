# {{SERVICE_NAME}}

**LKMS{{SERVICE_CODE}}** - {{SERVICE_DESCRIPTION}}

**Version:** 1.0.0
**Port (REST):** {{REST_PORT}}
**Port (gRPC):** {{GRPC_PORT}}
**Database:** {{DB_NAME}}

---

## 📋 Description

{{SERVICE_LONG_DESCRIPTION}}

**Key Features:**
- ✅ REST API (FastAPI) - External HTTP/JSON communication
- ✅ gRPC API - Internal service-to-service communication
- ✅ PostgreSQL database (dedicated instance)
- ✅ Apache Kafka event streaming
- ✅ Alembic database migrations
- ✅ Full test coverage (pytest)

---

## 🚀 Quick Start

### **Prerequisites**
- Docker & Docker Compose
- Python 3.11+ (for local development)

### **1. Start Service (Docker)**

```bash
# From project root
docker-compose up -d lkms{{SERVICE_CODE}}-{{SERVICE_SLUG}} lkms{{SERVICE_CODE}}-{{SERVICE_SLUG}}-db
```

### **2. Verify Service**

```bash
# Health check
curl http://localhost:{{REST_PORT}}/health

# API documentation
open http://localhost:{{REST_PORT}}/docs
```

### **3. Run Database Migrations**

```bash
# Enter container
docker exec -it lkms{{SERVICE_CODE}}-{{SERVICE_SLUG}} bash

# Run migrations
alembic upgrade head
```

---

## 🛠️ Development

### **Local Development (without Docker)**

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.template .env

# Run database migrations
alembic upgrade head

# Start development server
python -m app.main
```

### **Run Tests**

```bash
# All tests
pytest

# Specific test file
pytest tests/test_api.py

# With coverage
pytest --cov=app --cov-report=html
```

### **Create Database Migration**

```bash
# Auto-generate migration from model changes
alembic revision --autogenerate -m "description"

# Apply migration
alembic upgrade head

# Rollback one migration
alembic downgrade -1
```

---

## 📡 API Endpoints

### **REST API** (Port {{REST_PORT}})

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Service info |
| GET | `/health` | Health check |
| GET | `/docs` | Swagger UI documentation |
| GET | `/{{ROUTE_PREFIX}}/` | List all {{MODEL_NAME}} entities |
| GET | `/{{ROUTE_PREFIX}}/{id}` | Get {{MODEL_NAME}} by ID |
| POST | `/{{ROUTE_PREFIX}}/` | Create new {{MODEL_NAME}} |
| PUT | `/{{ROUTE_PREFIX}}/{id}` | Update {{MODEL_NAME}} |
| DELETE | `/{{ROUTE_PREFIX}}/{id}` | Delete {{MODEL_NAME}} |

### **gRPC API** (Port {{GRPC_PORT}})

Internal service-to-service communication:
- `Health.Check` - Health check
- `Get{{MODEL_NAME}}` - Get entity by ID (internal calls)

---

## 🔧 Configuration

### **Environment Variables**

See [.env.template](.env.template) for all available configuration options.

**Key variables:**
- `REST_PORT` - REST API port (default: {{REST_PORT}})
- `GRPC_PORT` - gRPC API port (default: {{GRPC_PORT}})
- `DB_HOST` - PostgreSQL host (default: lkms{{SERVICE_CODE}}-{{SERVICE_SLUG}}-db)
- `DB_NAME` - Database name (default: {{DB_NAME}})
- `KAFKA_BOOTSTRAP_SERVERS` - Kafka connection (default: lkms504-kafka:9092)

---

## 📊 Database Schema

### **{{TABLE_NAME}} Table**

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| name | VARCHAR(255) | Entity name |
| description | VARCHAR(1000) | Entity description |
| is_active | BOOLEAN | Active status |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

---

## 🔄 Kafka Events

### **Published Events**

- `{{SERVICE_SLUG}}.{{ROUTE_SINGULAR}}.created` - Emitted when {{MODEL_NAME}} is created
- `{{SERVICE_SLUG}}.{{ROUTE_SINGULAR}}.updated` - Emitted when {{MODEL_NAME}} is updated
- `{{SERVICE_SLUG}}.{{ROUTE_SINGULAR}}.deleted` - Emitted when {{MODEL_NAME}} is deleted

**Event Payload Example:**
```json
{
  "id": 123,
  "name": "Example Item",
  "timestamp": "2025-11-08T12:00:00Z"
}
```

---

## 🧪 Testing

**Test Coverage:** 100% (target)

```bash
# Run all tests
pytest

# With coverage report
pytest --cov=app --cov-report=term-missing

# Run specific test
pytest tests/test_api.py::test_create_item
```

---

## 📝 Project Structure

```
lkms{{SERVICE_CODE}}-{{SERVICE_SLUG}}/
├── app/
│   ├── api/
│   │   ├── rest/           # REST API endpoints
│   │   └── grpc/           # gRPC service implementations
│   ├── models/             # SQLAlchemy models
│   ├── schemas/            # Pydantic schemas
│   ├── events/             # Kafka producer/consumer
│   ├── config.py           # Configuration management
│   ├── database.py         # Database setup
│   └── main.py             # FastAPI application
├── alembic/                # Database migrations
├── tests/                  # Pytest tests
├── requirements.txt        # Python dependencies
├── .env.template           # Environment template
└── README.md               # This file
```

---

## 🔗 Related Services

- **Frontend:** lkms201-web-ui (http://localhost:4201)
- **Database UI:** lkms901-adminer (http://localhost:4901)
- **Kafka:** lkms504-kafka (localhost:4503)
- **Zookeeper:** lkms503-zookeeper (localhost:2181)

---

## 📚 Documentation

- **API Documentation:** http://localhost:{{REST_PORT}}/docs
- **Port Mapping:** `docs/architecture/port-mapping.md`
- **Microservices Architecture:** `docs/architecture/microservices-architecture.md`
- **Coding Standards:** `docs/programming/coding-standards.md`

---

**Last Updated:** 2025-11-08
**Maintainer:** BOSSystems s.r.o.
**Project:** L-KERN v4 - Business Operating System Service
