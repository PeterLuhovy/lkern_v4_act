# Contact Service (MDM)

**LKMS101** - Contact Master Data Management service

**Version:** 1.0.0
**Port (REST):** 4101
**Port (gRPC):** 5101
**Database:** lkern_contacts

---

## 📋 Description

Master Data Management (MDM) service for contacts. Manages all contact information including companies, persons, addresses, phone numbers, emails, and relationships. Serves as the single source of truth for contact data across the entire L-KERN ecosystem.

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
docker-compose up -d lkms101-contacts lkms101-contacts-db
```

### **2. Verify Service**

```bash
# Health check
curl http://localhost:4101/health

# API documentation
open http://localhost:4101/docs
```

### **3. Run Database Migrations**

```bash
# Enter container
docker exec -it lkms101-contacts bash

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

### **REST API** (Port 4101)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Service info |
| GET | `/health` | Health check |
| GET | `/docs` | Swagger UI documentation |
| GET | `/contacts/` | List all Contact entities |
| GET | `/contacts/{id}` | Get Contact by ID |
| POST | `/contacts/` | Create new Contact |
| PUT | `/contacts/{id}` | Update Contact |
| DELETE | `/contacts/{id}` | Delete Contact |

### **gRPC API** (Port 5101)

Internal service-to-service communication:
- `Health.Check` - Health check
- `GetContact` - Get entity by ID (internal calls)

---

## 🔧 Configuration

### **Environment Variables**

See [.env.template](.env.template) for all available configuration options.

**Key variables:**
- `REST_PORT` - REST API port (default: 4101)
- `GRPC_PORT` - gRPC API port (default: 5101)
- `DB_HOST` - PostgreSQL host (default: lkms101-contacts-db)
- `DB_NAME` - Database name (default: lkern_contacts)
- `KAFKA_BOOTSTRAP_SERVERS` - Kafka connection (default: lkms504-kafka:9092)

---

## 📊 Database Schema

### **contacts Table**

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

- `contacts.contact.created` - Emitted when Contact is created
- `contacts.contact.updated` - Emitted when Contact is updated
- `contacts.contact.deleted` - Emitted when Contact is deleted

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
lkms101-contacts/
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

- **API Documentation:** http://localhost:4101/docs
- **Port Mapping:** `docs/architecture/port-mapping.md`
- **Microservices Architecture:** `docs/architecture/microservices-architecture.md`
- **Coding Standards:** `docs/programming/coding-standards.md`

---

**Last Updated:** 2025-11-08
**Maintainer:** BOSSystems s.r.o.
**Project:** L-KERN v4 - Business Operating System Service
