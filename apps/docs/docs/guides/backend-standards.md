---
id: backend-standards
title: Backend Standards
sidebar_label: Backend Standards
sidebar_position: 3
---

## 📋 Overview

This document contains **backend-specific** coding standards for L-KERN v4. For core standards (DRY, file headers, naming), see [coding-standards.md](coding-standards.md).

**Tech Stack:**
- Python 3.11
- FastAPI (REST API framework)
- SQLAlchemy 2.0 (ORM)
- Alembic (database migrations)
- gRPC (inter-service communication)
- Apache Kafka (event streaming)
- PostgreSQL 15 (database)

---

## 1. Python/FastAPI Conventions

### File Naming

**Python files:**
- ✅ `snake_case.py` for all Python files: `contacts_service.py`, `database.py`
- ✅ `test_*.py` for tests: `test_contacts_service.py`, `test_api.py`
- ✅ Descriptive names: `email_validator.py` not `validator.py`

**Examples:**
```
services/lkms101-contacts/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app entry point
│   ├── database.py                # Database connection
│   ├── models/
│   │   ├── __init__.py
│   │   └── contact.py             # SQLAlchemy model
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── contact.py             # Pydantic schemas
│   ├── routers/
│   │   ├── __init__.py
│   │   └── contacts.py            # API routes
│   ├── services/
│   │   ├── __init__.py
│   │   └── contacts_service.py    # Business logic
│   └── grpc/
│       ├── __init__.py
│       ├── server.py              # gRPC server
│       └── contacts_service.py    # gRPC servicer
├── tests/
│   ├── __init__.py
│   ├── test_api.py
│   └── test_grpc.py
└── alembic/
    └── versions/
        └── 001_create_contacts.py
```

---

### FastAPI Service Structure

**Recommended folder structure:**

```
services/lkms101-contacts/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app instance
│   ├── config.py            # Configuration (env vars)
│   ├── database.py          # DB connection & session
│   ├── models/              # SQLAlchemy models
│   │   ├── __init__.py
│   │   └── contact.py
│   ├── schemas/             # Pydantic schemas (request/response)
│   │   ├── __init__.py
│   │   └── contact.py
│   ├── routers/             # API route handlers
│   │   ├── __init__.py
│   │   └── contacts.py
│   ├── services/            # Business logic layer
│   │   ├── __init__.py
│   │   └── contacts_service.py
│   ├── grpc/                # gRPC server & servicers
│   │   ├── __init__.py
│   │   ├── server.py
│   │   └── contacts_service.py
│   └── kafka/               # Kafka producers/consumers
│       ├── __init__.py
│       ├── producer.py
│       └── consumer.py
├── proto/                   # Protocol Buffer definitions
│   └── contacts.proto
├── alembic/                 # Database migrations
│   ├── env.py
│   └── versions/
├── tests/
│   ├── __init__.py
│   ├── conftest.py         # pytest fixtures
│   ├── test_api.py
│   ├── test_grpc.py
│   └── test_services.py
├── Dockerfile
├── requirements.txt
└── .env.example
```

---

### main.py Structure

**app/main.py - FastAPI application:**

```python
"""
================================================================
FILE: main.py
PATH: /services/lkms101-contacts/app/main.py
DESCRIPTION: FastAPI application entry point for contacts service
VERSION: v1.0.0
UPDATED: 2025-10-18 15:30:00
================================================================
"""

# === IMPORTS ===
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.routers import contacts
from app.database import engine, Base

# === LOGGING ===
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# === APP INSTANCE ===
app = FastAPI(
    title="L-KERN Contacts Service",
    version="1.0.0",
    description="Contact management microservice (lkms101)",
    docs_url="/docs",
    redoc_url="/redoc"
)

# === MIDDLEWARE ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === DATABASE INITIALIZATION ===
@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup."""
    logger.info("🚀 Contacts service starting...")
    logger.info("📊 Initializing database...")
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Database initialized")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown."""
    logger.info("🛑 Contacts service shutting down...")

# === ROUTES ===
app.include_router(contacts.router, prefix="/api/v1", tags=["contacts"])

# === HEALTH CHECK ===
@app.get("/health")
async def health_check():
    """Health check endpoint for container orchestration."""
    return {
        "status": "healthy",
        "service": "lkms101-contacts",
        "version": "1.0.0"
    }

# === ROOT ENDPOINT ===
@app.get("/")
async def root():
    """Root endpoint with service info."""
    return {
        "service": "lkms101-contacts",
        "version": "1.0.0",
        "docs": "/docs"
    }
```

---

### Logging Rules

**⚠️ CRITICAL: NEVER use `print()` in backend code!**

**Why?**
- Docker logs don't capture `print()` output properly
- No log levels (INFO, WARNING, ERROR)
- No timestamps or source information
- Hard to debug in production

**✅ ALWAYS use `logging` module:**

```python
import logging

# === LOGGING SETUP ===
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# === USAGE ===
logger.info("User logged in")           # General info (not visible in production)
logger.warning("Authentication failed") # Important events (visible in Docker logs)
logger.error("Database connection lost") # Errors (visible in Docker logs)
logger.debug("Processing request...")    # Debug info (only in development)
```

**Log levels:**
- `logger.debug()` - Development debugging (not in production)
- `logger.info()` - General information (filtered in production)
- `logger.warning()` - Important events **← Use for debugging in Docker!**
- `logger.error()` - Errors and exceptions
- `logger.critical()` - Critical failures

**Docker logs visibility:**
- ✅ `WARNING` and above → Visible in `docker logs`
- ❌ `INFO` and below → Filtered out in production

**Example - Debug output in Docker:**
```python
# ❌ WRONG - won't show in Docker logs
print(f"Contact created: {contact.id}")

# ✅ CORRECT - visible in Docker logs
logger.warning(f"Contact created: {contact.id}")  # Use WARNING for debugging

# ✅ PRODUCTION - proper logging
logger.info(f"Contact created: {contact.id}")     # INFO for normal operations
```

---

### Runtime Configuration (Log Level API)

**⚠️ MANDATORY: All microservices with REST API MUST implement runtime log level configuration**

**Purpose:**
- Change log level at runtime (without restart)
- Persist settings between restarts
- Enable debugging in production without redeployment

**Implementation:**

**1. Create config router (`app/api/rest/config.py`):**

```python
"""
================================================================
Configuration API - Runtime log level management
================================================================
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import logging
import json
import os

router = APIRouter(prefix="/config", tags=["Configuration"])

# Runtime config file path (persists between restarts)
CONFIG_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
RUNTIME_CONFIG_FILE = os.path.join(CONFIG_DIR, "runtime_config.json")

VALID_LOG_LEVELS = ["debug", "info", "warning", "error", "critical"]


class LogLevelRequest(BaseModel):
    level: str


class LogLevelResponse(BaseModel):
    level: str
    valid_levels: list[str] = VALID_LOG_LEVELS


def load_runtime_config() -> dict:
    """Load runtime configuration from file."""
    if os.path.exists(RUNTIME_CONFIG_FILE):
        try:
            with open(RUNTIME_CONFIG_FILE, "r") as f:
                return json.load(f)
        except Exception:
            pass
    return {}


def save_runtime_config(config: dict) -> None:
    """Save runtime configuration to file."""
    with open(RUNTIME_CONFIG_FILE, "w") as f:
        json.dump(config, f, indent=2)


def get_current_log_level() -> str:
    """Get current log level from root logger."""
    root_logger = logging.getLogger()
    return logging.getLevelName(root_logger.level).lower()


def set_log_level(level: str) -> None:
    """Set log level for all loggers at runtime."""
    numeric_level = getattr(logging, level.upper())
    root_logger = logging.getLogger()
    root_logger.setLevel(numeric_level)

    # Also set for all existing loggers
    for name in logging.root.manager.loggerDict:
        logging.getLogger(name).setLevel(numeric_level)


@router.get("/log-level", response_model=LogLevelResponse)
async def get_log_level():
    """Get current log level."""
    return LogLevelResponse(level=get_current_log_level())


@router.put("/log-level", response_model=LogLevelResponse)
async def set_log_level_endpoint(request: LogLevelRequest):
    """
    Set log level at runtime.

    Changes take effect immediately without restart.
    Setting is persisted and restored on next startup.
    """
    level = request.level.lower()

    if level not in VALID_LOG_LEVELS:
        raise HTTPException(status_code=400, detail=f"Invalid log level: {level}")

    set_log_level(level)

    # Persist to config file
    config = load_runtime_config()
    config["log_level"] = level
    save_runtime_config(config)

    return LogLevelResponse(level=level)


def apply_persisted_config():
    """Apply persisted configuration on startup."""
    config = load_runtime_config()
    if "log_level" in config:
        level = config["log_level"]
        if level in VALID_LOG_LEVELS:
            set_log_level(level)
```

**2. Register router in main.py:**

```python
from app.api.rest import config as config_api

# Include routers
app.include_router(config_api.router)

@app.on_event("startup")
async def startup_event():
    # Apply persisted runtime config (log level, etc.)
    config_api.apply_persisted_config()

    # ... rest of startup code
```

**3. API Endpoints:**

```bash
# Get current log level
GET /config/log-level
Response: {"level": "info", "valid_levels": ["debug", "info", "warning", "error", "critical"]}

# Set log level (runtime, no restart needed)
PUT /config/log-level
Body: {"level": "debug"}
Response: {"level": "debug", "valid_levels": [...]}
```

**4. Control Panel Integration:**

L-KERN Control Panel automatically shows log level dropdown for services with REST API.

**Checklist:**
- ✅ Create `app/api/rest/config.py` with log level endpoints
- ✅ Register router: `app.include_router(config_api.router)`
- ✅ Call `apply_persisted_config()` in startup event
- ✅ Runtime config saved to `runtime_config.json` in service root
- ✅ Control Panel shows log level dropdown (automatic for services with REST port)

---

## 2. SQLAlchemy + Alembic

### Database Connection

**app/database.py:**

```python
"""
================================================================
FILE: database.py
PATH: /services/lkms101-contacts/app/database.py
DESCRIPTION: Database connection setup with SQLAlchemy
VERSION: v1.0.0
UPDATED: 2025-10-18 15:30:00
================================================================
"""

# === IMPORTS ===
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# === CONSTANTS ===
# Database URL from environment variable
# Why: Different URLs for dev/test/prod environments
# When to change: Never hardcode - always use env vars
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@lkms501-postgres:5432/lkms101_contacts"
)

# Connection pool settings
# Why: Optimize database connection reuse
# When to change: Performance tuning based on load
POOL_SIZE = 10           # Number of connections to maintain
MAX_OVERFLOW = 20        # Additional connections when pool exhausted
POOL_PRE_PING = True     # Verify connection before using

# === ENGINE ===
engine = create_engine(
    DATABASE_URL,
    pool_size=POOL_SIZE,
    max_overflow=MAX_OVERFLOW,
    pool_pre_ping=POOL_PRE_PING,
    echo=False  # Set True for SQL query logging (development only)
)

# === SESSION ===
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# === BASE ===
Base = declarative_base()

# === DEPENDENCY ===
def get_db():
    """
    Database session dependency for FastAPI.

    Usage:
        @app.get("/contacts")
        def get_contacts(db: Session = Depends(get_db)):
            # Use db session here
            pass
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

---

### SQLAlchemy Models

**app/models/contact.py:**

```python
"""
================================================================
FILE: contact.py
PATH: /services/lkms101-contacts/app/models/contact.py
DESCRIPTION: SQLAlchemy model for contacts table
VERSION: v1.0.0
UPDATED: 2025-10-18 15:30:00
================================================================
"""

# === IMPORTS ===
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base

# === MODEL ===
class Contact(Base):
    """
    Contact model representing a person or organization.

    Attributes:
        id: Primary key
        name: Contact full name
        email: Contact email address (unique)
        phone: Contact phone number (optional)
        is_active: Whether contact is active
        created_at: Timestamp when created
        updated_at: Timestamp when last updated
    """
    __tablename__ = "contacts"

    # === PRIMARY KEY ===
    id = Column(Integer, primary_key=True, index=True)

    # === FIELDS ===
    name = Column(
        String(255),
        nullable=False,
        index=True,
        comment="Contact full name"
    )

    email = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
        comment="Contact email address"
    )

    phone = Column(
        String(50),
        nullable=True,
        comment="Contact phone number"
    )

    is_active = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Whether contact is active"
    )

    # === TIMESTAMPS ===
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        comment="Timestamp when created"
    )

    updated_at = Column(
        DateTime(timezone=True),
        onupdate=func.now(),
        nullable=True,
        comment="Timestamp when last updated"
    )

    def __repr__(self):
        return f"<Contact(id={self.id}, name='{self.name}', email='{self.email}')>"
```

**Model rules:**
- ✅ Add docstrings to model classes
- ✅ Use `comment` parameter for columns (visible in DB schema)
- ✅ Always index foreign keys and frequently queried fields
- ✅ Use `server_default=func.now()` for created_at
- ✅ Use `onupdate=func.now()` for updated_at
- ✅ Add `__repr__` for debugging

---

### Pydantic Schemas

**app/schemas/contact.py:**

```python
"""
================================================================
FILE: contact.py
PATH: /services/lkms101-contacts/app/schemas/contact.py
DESCRIPTION: Pydantic schemas for contact request/response validation
VERSION: v1.0.0
UPDATED: 2025-10-18 15:30:00
================================================================
"""

# === IMPORTS ===
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime
from typing import Optional

# === BASE SCHEMA ===
class ContactBase(BaseModel):
    """Base schema with common contact fields."""
    name: str = Field(..., min_length=1, max_length=255, description="Contact full name")
    email: EmailStr = Field(..., description="Contact email address")
    phone: Optional[str] = Field(None, max_length=50, description="Contact phone number")

# === CREATE SCHEMA ===
class ContactCreate(ContactBase):
    """Schema for creating a new contact (no ID needed)."""
    pass

# === UPDATE SCHEMA ===
class ContactUpdate(BaseModel):
    """Schema for updating contact (all fields optional)."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=50)
    is_active: Optional[bool] = None

# === RESPONSE SCHEMA ===
class ContactResponse(ContactBase):
    """Schema for contact response (includes DB fields)."""
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    # Pydantic v2 config
    model_config = ConfigDict(from_attributes=True)

# === LIST RESPONSE ===
class ContactListResponse(BaseModel):
    """Schema for paginated contact list."""
    contacts: list[ContactResponse]
    total: int
    page: int
    page_size: int
```

**Schema rules:**
- ✅ Use `EmailStr` for email validation (requires `email-validator` package)
- ✅ Use `Field(...)` for required fields with validation
- ✅ Use `Optional[Type]` for nullable fields
- ✅ Add descriptions to fields for auto-generated docs
- ✅ `ContactCreate` - fields needed for creation
- ✅ `ContactUpdate` - all fields optional (partial update)
- ✅ `ContactResponse` - includes DB-generated fields (id, timestamps)
- ✅ Use `model_config = ConfigDict(from_attributes=True)` for Pydantic v2

---

### Alembic Migrations

**Generate migration:**
```bash
# Auto-generate migration from model changes
alembic revision --autogenerate -m "create contacts table"

# Create empty migration
alembic revision -m "add index on email"
```

**alembic/versions/001_create_contacts.py:**

```python
"""create contacts table

Revision ID: 001
Revises:
Create Date: 2025-10-18 15:30:00
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    """Create contacts table."""
    op.create_table(
        'contacts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('phone', sa.String(50), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # Create indexes
    op.create_index('ix_contacts_id', 'contacts', ['id'])
    op.create_index('ix_contacts_name', 'contacts', ['name'])
    op.create_index('ix_contacts_email', 'contacts', ['email'], unique=True)

def downgrade():
    """Drop contacts table."""
    op.drop_index('ix_contacts_email', 'contacts')
    op.drop_index('ix_contacts_name', 'contacts')
    op.drop_index('ix_contacts_id', 'contacts')
    op.drop_table('contacts')
```

**Migration rules:**
- ✅ Always implement both `upgrade()` and `downgrade()`
- ✅ Add descriptive migration message
- ✅ Create indexes in migrations (not just in models)
- ✅ Use `server_default` for default values
- ✅ Test migrations: `alembic upgrade head` and `alembic downgrade -1`

---

## 3. FastAPI Routers

### REST API Router

**app/routers/contacts.py:**

```python
"""
================================================================
FILE: contacts.py
PATH: /services/lkms101-contacts/app/routers/contacts.py
DESCRIPTION: FastAPI router for contacts endpoints (CRUD operations)
VERSION: v1.0.0
UPDATED: 2025-10-18 15:30:00
================================================================
"""

# === IMPORTS ===
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
import logging

from app.database import get_db
from app.models.contact import Contact
from app.schemas.contact import ContactCreate, ContactUpdate, ContactResponse

# === LOGGING ===
logger = logging.getLogger(__name__)

# === ROUTER ===
router = APIRouter(
    prefix="/contacts",
    tags=["contacts"]
)

# === GET ALL CONTACTS ===
@router.get("/", response_model=List[ContactResponse])
async def get_contacts(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Max records to return"),
    is_active: bool = Query(None, description="Filter by active status"),
    db: Session = Depends(get_db)
):
    """
    Get list of contacts with optional filtering and pagination.

    Args:
        skip: Number of records to skip (for pagination)
        limit: Maximum number of records to return
        is_active: Filter by active status (optional)
        db: Database session

    Returns:
        List of contacts
    """
    query = db.query(Contact)

    # Apply filters
    if is_active is not None:
        query = query.filter(Contact.is_active == is_active)

    # Pagination
    contacts = query.offset(skip).limit(limit).all()

    logger.info(f"Retrieved {len(contacts)} contacts (skip={skip}, limit={limit})")
    return contacts

# === GET CONTACT BY ID ===
@router.get("/{contact_id}", response_model=ContactResponse)
async def get_contact(
    contact_id: int,
    db: Session = Depends(get_db)
):
    """
    Get contact by ID.

    Args:
        contact_id: Contact ID
        db: Database session

    Returns:
        Contact details

    Raises:
        HTTPException 404: Contact not found
    """
    contact = db.query(Contact).filter(Contact.id == contact_id).first()

    if not contact:
        logger.warning(f"Contact not found: {contact_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contact with id {contact_id} not found"
        )

    logger.info(f"Retrieved contact: {contact_id}")
    return contact

# === CREATE CONTACT ===
@router.post("/", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def create_contact(
    contact: ContactCreate,
    db: Session = Depends(get_db)
):
    """
    Create new contact.

    Args:
        contact: Contact data
        db: Database session

    Returns:
        Created contact with ID

    Raises:
        HTTPException 400: Email already exists
    """
    # Check if email already exists
    existing = db.query(Contact).filter(Contact.email == contact.email).first()
    if existing:
        logger.warning(f"Duplicate email: {contact.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Contact with email {contact.email} already exists"
        )

    # Create contact
    db_contact = Contact(**contact.model_dump())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)

    logger.info(f"Created contact: {db_contact.id} ({db_contact.email})")
    return db_contact

# === UPDATE CONTACT ===
@router.put("/{contact_id}", response_model=ContactResponse)
async def update_contact(
    contact_id: int,
    contact: ContactUpdate,
    db: Session = Depends(get_db)
):
    """
    Update contact.

    Args:
        contact_id: Contact ID
        contact: Updated contact data
        db: Database session

    Returns:
        Updated contact

    Raises:
        HTTPException 404: Contact not found
    """
    db_contact = db.query(Contact).filter(Contact.id == contact_id).first()

    if not db_contact:
        logger.warning(f"Contact not found for update: {contact_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contact with id {contact_id} not found"
        )

    # Update only provided fields
    update_data = contact.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_contact, field, value)

    db.commit()
    db.refresh(db_contact)

    logger.info(f"Updated contact: {contact_id}")
    return db_contact

# === DELETE CONTACT ===
@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_contact(
    contact_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete contact (hard delete).

    Args:
        contact_id: Contact ID
        db: Database session

    Raises:
        HTTPException 404: Contact not found
    """
    db_contact = db.query(Contact).filter(Contact.id == contact_id).first()

    if not db_contact:
        logger.warning(f"Contact not found for deletion: {contact_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contact with id {contact_id} not found"
        )

    db.delete(db_contact)
    db.commit()

    logger.info(f"Deleted contact: {contact_id}")
    return None
```

**Router rules:**
- ✅ Use descriptive function names: `get_contacts`, not `list`
- ✅ Add docstrings with Args, Returns, Raises
- ✅ Use `Query()` for query parameters with validation
- ✅ Use `Depends(get_db)` for database session
- ✅ Log all operations (create, update, delete)
- ✅ Return proper HTTP status codes (200, 201, 204, 404, 400)
- ✅ Validate input with Pydantic schemas

---

### Database Insert Validation

**⚠️ CRITICAL: ALWAYS validate data before database insert**

**Validation steps (in order):**

1. **Pydantic schema validation** (automatic via FastAPI)
2. **Business rule validation** (custom logic)
3. **Database constraint check** (SELECT before INSERT)
4. **Insert operation** (only if all checks pass)

**Example - Contact creation with full validation:**

```python
@router.post("/", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def create_contact(
    contact: ContactCreate,
    db: Session = Depends(get_db)
):
    """
    Create new contact with comprehensive validation.

    Validation steps:
    1. Pydantic schema (automatic) - data types, required fields
    2. Business rules - email format, phone format
    3. Database constraints - unique email check
    4. Insert operation - save to database
    """

    # === STEP 1: Pydantic validation ===
    # Already done by FastAPI automatically

    # === STEP 2: Business rule validation ===
    # Example: Check if email domain is allowed
    email_domain = contact.email.split('@')[1]
    allowed_domains = ['company.com', 'partner.com']

    if email_domain not in allowed_domains:
        logger.warning(f"Invalid email domain: {email_domain}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email domain {email_domain} is not allowed"
        )

    # === STEP 3: Database constraint check (SELECT before INSERT) ===
    # Check for duplicate email
    existing_email = db.query(Contact)\
        .filter(Contact.email == contact.email)\
        .first()

    if existing_email:
        logger.warning(f"Duplicate email: {contact.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Contact with email {contact.email} already exists"
        )

    # Check for duplicate phone (if provided)
    if contact.phone:
        existing_phone = db.query(Contact)\
            .filter(Contact.phone == contact.phone)\
            .first()

        if existing_phone:
            logger.warning(f"Duplicate phone: {contact.phone}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Contact with phone {contact.phone} already exists"
            )

    # === STEP 4: Insert operation ===
    # All validations passed, safe to insert
    db_contact = Contact(**contact.model_dump())
    db.add(db_contact)

    try:
        db.commit()
        db.refresh(db_contact)
    except IntegrityError as e:
        db.rollback()
        logger.error(f"Database integrity error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database constraint violation"
        )

    logger.info(f"Created contact: {db_contact.id} ({db_contact.email})")
    return db_contact
```

**Validation checklist:**
- ✅ Check unique constraints (email, phone, username)
- ✅ Check foreign key existence (customer_id, user_id)
- ✅ Check business rules (status transitions, permissions)
- ✅ Check data integrity (date ranges, numeric limits)
- ✅ Use try/except for db.commit() to catch IntegrityError
- ✅ Log validation failures (security audit trail)

**Why SELECT before INSERT?**
- Provides clear error messages (not generic "IntegrityError")
- Allows custom validation logic
- Prevents unnecessary database operations
- Better user feedback (specific field errors)

---

### Deletion Audit Workflow

**⚠️ MANDATORY: All microservices with databases MUST implement audited deletion workflow**

**Deletion Pattern:**
1. **Soft Delete** - Set `deleted_at` timestamp, keep external resources (MinIO files) for recovery
2. **Hard Delete** - Permanent removal from database + cleanup of external resources with audit trail

**Architecture:**
- **Audit Table** - For queryable deletion logs (easy debugging, failed deletion tracking)
- **Kafka Events** - For notifications and future async processing (Phase 2)

---

#### Soft Delete Pattern

**Database model:**
```python
from sqlalchemy import Column, DateTime
from datetime import datetime

class Issue(Base):
    __tablename__ = "issues"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    # ... other fields ...

    # Soft delete timestamp
    deleted_at = Column(
        DateTime,
        nullable=True,
        index=True,
        comment="Soft delete timestamp - null = active, datetime = deleted"
    )
```

**Soft delete endpoint:**
```python
@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(
    item_id: str,
    db: Session = Depends(get_db),
):
    """
    Soft delete item (set deleted_at timestamp).

    - Sets deleted_at to current timestamp
    - Keeps external resources (MinIO files) for potential recovery
    - Publishes Kafka event
    """
    item = db.query(Item).filter(
        Item.id == uuid.UUID(item_id),
        Item.deleted_at == None  # noqa: E711
    ).first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item {item_id} not found"
        )

    # Soft delete
    item.deleted_at = datetime.utcnow()
    db.commit()

    # Publish Kafka event
    await publish_event("item.deleted", {
        "id": str(item.id),
        "item_code": item.code,
    })

    logger.info(f"Soft-deleted item {item.code}")
    return None
```

**Query filters:**
```python
# Default: Exclude soft-deleted items
@router.get("/", response_model=List[ItemResponse])
async def list_items(
    include_deleted: bool = Query(False, description="Include soft-deleted items"),
    db: Session = Depends(get_db),
):
    query = db.query(Item)

    # Soft delete filter (default: exclude deleted)
    if not include_deleted:
        query = query.filter(Item.deleted_at == None)  # noqa: E711

    items = query.all()
    return items
```

---

#### Hard Delete Pattern with Audit Trail

**⚠️ CRITICAL: Hard delete MUST follow this exact order:**

1. **Delete external resources** (MinIO files, S3 objects, etc.) → Track each deletion
2. **Verify deletion** (Check files actually deleted)
3. **Create audit log** (Record what was deleted)
4. **Delete from database** (Only if all previous steps succeed)
5. **Publish Kafka event** (Notification + future async processing foundation)

**Audit table model:**
```python
from sqlalchemy import Column, Integer, String, DateTime, JSON, Enum as SQLEnum
from datetime import datetime
import enum

class DeletionStatus(str, enum.Enum):
    """Deletion operation status."""
    PENDING = "pending"           # Deletion started
    COMPLETED = "completed"       # Fully deleted (DB + external resources)
    FAILED = "failed"             # Complete failure (nothing deleted)
    PARTIAL = "partial"           # Some resources deleted, some failed

class DeletionAudit(Base):
    """
    Audit log for deletion operations.

    Tracks:
    - What was deleted (item_id, item_code)
    - When deletion occurred (timestamps)
    - What external resources were involved (files_found, files_deleted)
    - Failures (files_failed, error_message)
    - Final status (completed, partial, failed)
    """
    __tablename__ = "deletion_audit"

    id = Column(Integer, primary_key=True)

    # Item identification
    item_id = Column(UUID, nullable=False, index=True, comment="ID of deleted item")
    item_code = Column(String(50), nullable=False, comment="Human-readable code")
    item_type = Column(String(50), nullable=False, comment="Type of item (issue, contact, etc.)")

    # Deletion tracking
    status = Column(
        SQLEnum(DeletionStatus),
        nullable=False,
        default=DeletionStatus.PENDING,
        comment="Deletion status"
    )

    # External resources tracking
    files_found = Column(Integer, default=0, comment="Number of files found in MinIO")
    files_deleted = Column(Integer, default=0, comment="Number of files successfully deleted")
    files_failed = Column(JSON, nullable=True, comment="List of files that failed to delete")

    # Error details
    error_message = Column(String(1000), nullable=True, comment="Error message if deletion failed")

    # Timestamps
    started_at = Column(DateTime, nullable=False, default=datetime.utcnow, comment="Deletion start time")
    completed_at = Column(DateTime, nullable=True, comment="Deletion completion time")

    # Metadata
    deleted_by = Column(UUID, nullable=True, comment="User who initiated deletion")
```

**Hard delete endpoint with audit:**
```python
@router.delete("/{item_id}/permanent", status_code=status.HTTP_204_NO_CONTENT)
async def hard_delete_item(
    item_id: str,
    db: Session = Depends(get_db),
):
    """
    Permanently delete item (hard delete from DB + MinIO files with audit trail).

    Deletion order (CRITICAL):
    1. Delete external resources (MinIO files)
    2. Verify deletion
    3. Create audit log
    4. Delete from database (only if external cleanup succeeds)
    5. Publish Kafka event

    If any step fails:
    - Create audit log with status='failed' or 'partial'
    - Raise HTTPException (rollback database changes)
    - Item marked as 'incomplete deletion' if partial
    """

    # Find item (including soft-deleted)
    item = db.query(Item).filter(Item.id == uuid.UUID(item_id)).first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item {item_id} not found"
        )

    # Create audit record
    audit = DeletionAudit(
        item_id=item.id,
        item_code=item.code,
        item_type="issue",  # Or dynamically determine type
        status=DeletionStatus.PENDING,
        started_at=datetime.utcnow()
    )
    db.add(audit)
    db.commit()  # Commit audit record immediately
    db.refresh(audit)

    # Track deletion results
    files_failed = []

    try:
        # === STEP 1: Delete external resources (MinIO files) ===
        folder_prefix = f"{item.id}/"

        # List files first (for audit)
        files = minio_client.list_files(prefix=folder_prefix)
        audit.files_found = len(files)

        # Delete each file and track failures
        deleted_count = 0
        for file_name in files:
            try:
                minio_client.delete_file(file_name)
                deleted_count += 1
            except Exception as e:
                logger.error(f"Failed to delete file {file_name}: {str(e)}")
                files_failed.append({
                    "file_name": file_name,
                    "error": str(e)
                })

        audit.files_deleted = deleted_count
        audit.files_failed = files_failed if files_failed else None

        # === STEP 2: Check if any files failed ===
        if files_failed:
            # Partial deletion - some files failed
            audit.status = DeletionStatus.PARTIAL
            audit.error_message = f"Failed to delete {len(files_failed)} files"
            audit.completed_at = datetime.utcnow()
            db.commit()

            # Mark item as incomplete deletion
            item.deletion_status = "incomplete"
            item.deletion_audit_id = audit.id
            db.commit()

            logger.error(f"Partial deletion for item {item.code}: {len(files_failed)} files failed")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Partial deletion: {len(files_failed)} files failed to delete. Item marked for manual review."
            )

        # === STEP 3: All external resources deleted successfully ===
        if deleted_count > 0:
            logger.info(f"Deleted {deleted_count} files from MinIO folder: {folder_prefix}")
        else:
            logger.warning(f"No files found in MinIO folder: {folder_prefix}")

        # === STEP 4: Delete from database (only after external cleanup succeeds) ===
        item_code = item.code
        db.delete(item)
        db.commit()

        # === STEP 5: Update audit record ===
        audit.status = DeletionStatus.COMPLETED
        audit.completed_at = datetime.utcnow()
        db.commit()

        # === STEP 6: Publish Kafka event ===
        await publish_event("item.permanently_deleted", {
            "id": str(item_id),
            "item_code": item_code,
            "files_deleted": deleted_count,
            "audit_id": audit.id
        })

        logger.info(f"Permanently deleted item {item_code} (audit_id={audit.id})")
        return None

    except HTTPException:
        # Re-raise HTTP exceptions (already handled above)
        raise

    except Exception as e:
        # Unexpected error - mark as failed
        audit.status = DeletionStatus.FAILED
        audit.error_message = str(e)
        audit.completed_at = datetime.utcnow()
        db.commit()

        logger.error(f"Failed to delete item {item.code}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Deletion failed: {str(e)}"
        )
```

**Restore soft-deleted endpoint:**
```python
@router.post("/{item_id}/restore", response_model=ItemResponse)
async def restore_item(
    item_id: str,
    db: Session = Depends(get_db),
):
    """
    Restore soft-deleted item (clear deleted_at timestamp).

    - Clears deleted_at timestamp
    - External resources (MinIO files) still exist
    - Publishes Kafka event
    """
    item = db.query(Item).filter(
        Item.id == uuid.UUID(item_id),
        Item.deleted_at != None  # noqa: E711
    ).first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Soft-deleted item {item_id} not found"
        )

    # Restore (clear deleted_at)
    item.deleted_at = None
    db.commit()
    db.refresh(item)

    # Publish Kafka event
    await publish_event("item.restored", {
        "id": str(item.id),
        "item_code": item.code,
    })

    logger.info(f"Restored item {item.code}")
    return item
```

**Query failed deletions:**
```python
# Get all items with incomplete deletion
incomplete_deletions = db.query(Item)\
    .filter(Item.deletion_status == "incomplete")\
    .all()

# Get audit logs for failed deletions
failed_audits = db.query(DeletionAudit)\
    .filter(DeletionAudit.status.in_([DeletionStatus.FAILED, DeletionStatus.PARTIAL]))\
    .order_by(DeletionAudit.started_at.desc())\
    .all()
```

---

#### Eventual Deletion Pattern (External Storage Unavailable)

**🚨 MANDATORY PATTERN: All microservices with external storage (MinIO, S3) MUST implement this!**

When external storage is unavailable during permanent delete, the item is **marked for deletion** (not failed). A cleanup service will retry later.

**Flow Diagram:**
```
┌─────────────────────────────────────────────────────────────────┐
│  1. User clicks "Permanent Delete"                              │
├─────────────────────────────────────────────────────────────────┤
│  2. Backend tries external storage                              │
│     ├─ Storage OK → delete files → delete from DB → COMPLETED  │
│     └─ Storage FAIL → audit PENDING + link item → 503          │
├─────────────────────────────────────────────────────────────────┤
│  3. Cleanup Service (cron or manual trigger)                    │
│     ├─ Finds audit records with status=PENDING                 │
│     ├─ For each: retry storage operation                       │
│     │   ├─ OK → delete files → delete from DB → COMPLETED      │
│     │   └─ FAIL → retry_count++, last_retry_at = now           │
│     └─ Logs each attempt for audit trail                       │
└─────────────────────────────────────────────────────────────────┘
```

**Key Implementation Points:**

1. **DeletionAudit model** - retry tracking fields:
   - `retry_count` - number of retry attempts
   - `last_retry_at` - timestamp of last retry
   - `status = PENDING` - item waiting for cleanup

2. **Item model** - marker field:
   - `deletion_audit_id` - when set, item is pending cleanup
   - Frontend shows warning icon (🔴) for these items

3. **Storage unavailable handler:**
```python
except StorageConnectionError as e:
    # Get file count from DB (works without storage)
    db_attachments = item.attachments or []
    audit.files_found = len(db_attachments)
    audit.status = DeletionStatus.PENDING  # Will be retried
    audit.error_message = f"Storage unavailable: {str(e)}"

    # Link item to audit (marks for deletion)
    item.deletion_audit_id = audit.id
    db.commit()

    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail="Storage unavailable. Item marked for cleanup."
    )
```

4. **Cleanup service endpoints:**
   - `GET /cleanup/pending` - List pending deletions
   - `POST /cleanup/retry` - Retry all pending deletions
   - `POST /cleanup/retry/{audit_id}` - Retry specific deletion

5. **Frontend handling:**
   - Show modal: "Storage unavailable. Item marked for deletion."
   - Single "I Understand" button

---

#### Kafka Events for Deletion

**Events to publish:**

1. **item.deleted** (soft delete)
   ```python
   {
       "id": "uuid",
       "item_code": "ISSUE-001",
       "deleted_at": "2025-11-24T10:30:00Z"
   }
   ```

2. **item.restored** (restore soft-deleted)
   ```python
   {
       "id": "uuid",
       "item_code": "ISSUE-001",
       "restored_at": "2025-11-24T11:00:00Z"
   }
   ```

3. **item.permanently_deleted** (hard delete)
   ```python
   {
       "id": "uuid",
       "item_code": "ISSUE-001",
       "files_deleted": 5,
       "audit_id": 123,
       "deleted_at": "2025-11-24T12:00:00Z"
   }
   ```

4. **item.deletion.failed** (deletion failed)
   ```python
   {
       "id": "uuid",
       "item_code": "ISSUE-001",
       "audit_id": 124,
       "error": "Failed to delete 3 files from MinIO",
       "status": "partial",
       "failed_at": "2025-11-24T12:05:00Z"
   }
   ```

**Future use cases (Phase 2):**
- Kafka consumer listens to `item.deleted` → schedules background cleanup task
- Async job processes hard deletion (Celery/RQ)
- Retries on failure
- Notifies admin if cleanup fails

---

#### Deletion Workflow Checklist

**✅ MANDATORY for all microservices:**

- ✅ Soft delete uses `deleted_at` timestamp (nullable DateTime column)
- ✅ Hard delete follows exact order: External resources → Audit → Database
- ✅ Audit table tracks: item_id, status, files_found, files_deleted, files_failed, timestamps
- ✅ Failed/partial deletions create audit record with error details
- ✅ Items with incomplete deletion marked and referenced to audit record
- ✅ All deletion operations publish Kafka events
- ✅ Query filters exclude soft-deleted by default (require explicit `include_deleted=True`)
- ✅ Restore endpoint for soft-deleted items
- ✅ Logging for all deletion operations (info, warning, error levels)

**Why this pattern?**
- ✅ Easy debugging (query audit table for failed deletions)
- ✅ Manual verification possible (admin can review incomplete deletions)
- ✅ Kafka events provide notification mechanism
- ✅ Foundation for Phase 2 async processing (background jobs)
- ✅ Clear separation: Audit table = querying, Kafka = async processing
- ✅ Prevents orphaned external resources (files deleted before DB record)

---

### API Endpoint Design Principles

**⚠️ CRITICAL: Keep endpoints simple and use query parameters**

**Design principles:**

1. **Use query parameters for filtering/pagination** (NOT separate endpoints)
2. **Keep endpoints RESTful and predictable**
3. **Avoid overly complex endpoints**
4. **Use standard HTTP methods correctly**

**✅ CORRECT - Simple endpoints with query params:**

```python
# Get all contacts with optional filters
@router.get("/", response_model=List[ContactResponse])
async def get_contacts(
    skip: int = Query(0, ge=0, description="Pagination offset"),
    limit: int = Query(100, ge=1, le=1000, description="Page size"),
    is_active: bool = Query(None, description="Filter by active status"),
    search: str = Query(None, min_length=2, description="Search by name or email"),
    sort_by: str = Query("name", description="Sort field (name, email, created_at)"),
    sort_order: str = Query("asc", regex="^(asc|desc)$", description="Sort order"),
    db: Session = Depends(get_db)
):
    """
    Get contacts with flexible filtering.

    Query parameters:
    - skip: Pagination offset (default: 0)
    - limit: Page size (default: 100, max: 1000)
    - is_active: Filter by active status (optional)
    - search: Search in name/email (optional)
    - sort_by: Sort field (default: name)
    - sort_order: asc or desc (default: asc)
    """
    query = db.query(Contact)

    # Apply filters
    if is_active is not None:
        query = query.filter(Contact.is_active == is_active)

    if search:
        query = query.filter(
            or_(
                Contact.name.ilike(f"%{search}%"),
                Contact.email.ilike(f"%{search}%")
            )
        )

    # Apply sorting
    if sort_order == "desc":
        query = query.order_by(getattr(Contact, sort_by).desc())
    else:
        query = query.order_by(getattr(Contact, sort_by).asc())

    # Pagination
    contacts = query.offset(skip).limit(limit).all()

    return contacts
```

**❌ WRONG - Too many specialized endpoints:**

```python
# DON'T DO THIS - creates endpoint explosion
@router.get("/active")  # ❌
async def get_active_contacts():
    pass

@router.get("/inactive")  # ❌
async def get_inactive_contacts():
    pass

@router.get("/search/{query}")  # ❌ Use query param
async def search_contacts(query: str):
    pass

@router.get("/sorted-by-name")  # ❌
async def get_contacts_sorted_by_name():
    pass

# Instead, use ONE endpoint with query params:
# GET /contacts?is_active=true
# GET /contacts?is_active=false
# GET /contacts?search=john
# GET /contacts?sort_by=name&sort_order=asc
```

**RESTful endpoint patterns:**

```python
# ✅ CORRECT - Standard CRUD with query params
GET    /contacts                    # List with filters (query params)
GET    /contacts/{id}               # Get single contact
POST   /contacts                    # Create new contact
PUT    /contacts/{id}               # Update existing contact
PATCH  /contacts/{id}               # Partial update
DELETE /contacts/{id}               # Delete contact

# ✅ CORRECT - Related resources
GET    /contacts/{id}/addresses     # Get contact's addresses
POST   /contacts/{id}/addresses     # Add address to contact
DELETE /contacts/{id}/addresses/{address_id}  # Remove address

# ✅ CORRECT - Actions (when REST doesn't fit)
POST   /contacts/{id}/activate      # Activate contact (state change)
POST   /contacts/{id}/deactivate    # Deactivate contact
POST   /contacts/{id}/send-email    # Send email to contact
```

**Query parameter validation:**

```python
from enum import Enum

# Define allowed values
class SortField(str, Enum):
    NAME = "name"
    EMAIL = "email"
    CREATED_AT = "created_at"

class SortOrder(str, Enum):
    ASC = "asc"
    DESC = "desc"

@router.get("/")
async def get_contacts(
    sort_by: SortField = Query(SortField.NAME),  # Enum validation
    sort_order: SortOrder = Query(SortOrder.ASC),
    limit: int = Query(100, ge=1, le=1000)  # Range validation
):
    # Type-safe and validated
    pass
```

**Benefits:**
- ✅ Fewer endpoints to maintain
- ✅ More flexible (combine filters)
- ✅ Self-documenting via OpenAPI/Swagger
- ✅ Standard RESTful design
- ✅ Easy to extend (add new query param)

---

## 4. gRPC Standards

### Protocol Buffer Definition

**proto/contacts.proto:**

```protobuf
syntax = "proto3";

package contacts;

// ================================================================
// MESSAGES
// ================================================================

// Contact message
message Contact {
  int32 id = 1;
  string name = 2;
  string email = 3;
  string phone = 4;
  bool is_active = 5;
  string created_at = 6;
  string updated_at = 7;
}

// ================================================================
// REQUEST MESSAGES
// ================================================================

message GetContactRequest {
  int32 id = 1;
}

message GetContactsByIdsRequest {
  repeated int32 ids = 1;
}

message ValidateContactRequest {
  int32 id = 1;
}

// ================================================================
// RESPONSE MESSAGES
// ================================================================

message GetContactResponse {
  Contact contact = 1;
}

message GetContactsByIdsResponse {
  repeated Contact contacts = 1;
}

message ValidateContactResponse {
  bool is_valid = 1;
  string error_message = 2;
}

// ================================================================
// SERVICE DEFINITION
// ================================================================

service ContactsService {
  // Get single contact by ID
  rpc GetContact (GetContactRequest) returns (GetContactResponse);

  // Get multiple contacts by IDs (batch operation)
  rpc GetContactsByIds (GetContactsByIdsRequest) returns (GetContactsByIdsResponse);

  // Validate contact exists and is active
  rpc ValidateContact (ValidateContactRequest) returns (ValidateContactResponse);
}
```

**Naming conventions:**
- ✅ Service name: `{Resource}Service` (ContactsService)
- ✅ Request: `{Action}{Resource}Request` (GetContactRequest)
- ✅ Response: `{Action}{Resource}Response` (GetContactResponse)
- ✅ Field names: `snake_case` (error_message)
- ✅ RPC methods: `PascalCase` (GetContact)

**Generate Python code:**
```bash
python -m grpc_tools.protoc \
  -I./proto \
  --python_out=./app/grpc \
  --grpc_python_out=./app/grpc \
  ./proto/contacts.proto
```

---

### gRPC Server

**app/grpc/server.py:**

```python
"""
================================================================
FILE: server.py
PATH: /services/lkms101-contacts/app/grpc/server.py
DESCRIPTION: gRPC server setup for contacts service
VERSION: v1.0.0
UPDATED: 2025-10-18 15:30:00
================================================================
"""

# === IMPORTS ===
import grpc
from concurrent import futures
import logging

from app.grpc import contacts_pb2_grpc
from app.grpc.contacts_service import ContactsServicer

# === LOGGING ===
logger = logging.getLogger(__name__)

# === CONSTANTS ===
GRPC_PORT = "0.0.0.0:5101"  # gRPC port for contacts service
MAX_WORKERS = 10            # Thread pool size

# === SERVER ===
def serve():
    """Start gRPC server."""
    # Create server with thread pool
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=MAX_WORKERS))

    # Register servicer
    contacts_pb2_grpc.add_ContactsServiceServicer_to_server(
        ContactsServicer(),
        server
    )

    # Listen on port
    server.add_insecure_port(GRPC_PORT)

    logger.info(f"🚀 gRPC server starting on {GRPC_PORT}")
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
```

---

### gRPC Servicer

**app/grpc/contacts_service.py:**

```python
"""
================================================================
FILE: contacts_service.py
PATH: /services/lkms101-contacts/app/grpc/contacts_service.py
DESCRIPTION: gRPC servicer implementation for contacts
VERSION: v1.0.0
UPDATED: 2025-10-18 15:30:00
================================================================
"""

# === IMPORTS ===
import grpc
import logging

from app.grpc import contacts_pb2, contacts_pb2_grpc
from app.database import SessionLocal
from app.models.contact import Contact

# === LOGGING ===
logger = logging.getLogger(__name__)

# === SERVICER ===
class ContactsServicer(contacts_pb2_grpc.ContactsServiceServicer):
    """gRPC servicer for contacts operations."""

    def GetContact(self, request, context):
        """
        Get contact by ID.

        Args:
            request: GetContactRequest with contact ID
            context: gRPC context

        Returns:
            GetContactResponse with contact data
        """
        db = SessionLocal()
        try:
            contact = db.query(Contact).filter(Contact.id == request.id).first()

            if not contact:
                context.set_code(grpc.StatusCode.NOT_FOUND)
                context.set_details(f'Contact with id {request.id} not found')
                return contacts_pb2.GetContactResponse()

            logger.info(f"gRPC: Retrieved contact {contact.id}")

            return contacts_pb2.GetContactResponse(
                contact=contacts_pb2.Contact(
                    id=contact.id,
                    name=contact.name,
                    email=contact.email,
                    phone=contact.phone or "",
                    is_active=contact.is_active,
                    created_at=contact.created_at.isoformat(),
                    updated_at=contact.updated_at.isoformat() if contact.updated_at else ""
                )
            )
        except Exception as e:
            logger.error(f"gRPC error in GetContact: {str(e)}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details('Internal server error')
            return contacts_pb2.GetContactResponse()
        finally:
            db.close()

    def GetContactsByIds(self, request, context):
        """Get multiple contacts by IDs (batch operation)."""
        db = SessionLocal()
        try:
            contacts = db.query(Contact).filter(Contact.id.in_(request.ids)).all()

            logger.info(f"gRPC: Retrieved {len(contacts)} contacts")

            return contacts_pb2.GetContactsByIdsResponse(
                contacts=[
                    contacts_pb2.Contact(
                        id=c.id,
                        name=c.name,
                        email=c.email,
                        phone=c.phone or "",
                        is_active=c.is_active,
                        created_at=c.created_at.isoformat(),
                        updated_at=c.updated_at.isoformat() if c.updated_at else ""
                    )
                    for c in contacts
                ]
            )
        except Exception as e:
            logger.error(f"gRPC error in GetContactsByIds: {str(e)}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details('Internal server error')
            return contacts_pb2.GetContactsByIdsResponse()
        finally:
            db.close()

    def ValidateContact(self, request, context):
        """Validate that contact exists and is active."""
        db = SessionLocal()
        try:
            contact = db.query(Contact).filter(Contact.id == request.id).first()

            if not contact:
                return contacts_pb2.ValidateContactResponse(
                    is_valid=False,
                    error_message=f"Contact with id {request.id} not found"
                )

            if not contact.is_active:
                return contacts_pb2.ValidateContactResponse(
                    is_valid=False,
                    error_message=f"Contact {contact.id} is inactive"
                )

            logger.info(f"gRPC: Validated contact {contact.id}")

            return contacts_pb2.ValidateContactResponse(
                is_valid=True,
                error_message=""
            )
        except Exception as e:
            logger.error(f"gRPC error in ValidateContact: {str(e)}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details('Internal server error')
            return contacts_pb2.ValidateContactResponse(is_valid=False, error_message="Internal error")
        finally:
            db.close()
```

---

### gRPC Client Usage

**Example - Orders service calling Contacts service:**

```python
"""
================================================================
FILE: contacts_client.py
PATH: /services/lkms102-orders/app/grpc/clients/contacts_client.py
DESCRIPTION: gRPC client for calling contacts service
VERSION: v1.0.0
UPDATED: 2025-10-18 15:30:00
================================================================
"""

# === IMPORTS ===
import grpc
import logging

from app.grpc import contacts_pb2, contacts_pb2_grpc

# === LOGGING ===
logger = logging.getLogger(__name__)

# === CONSTANTS ===
CONTACTS_SERVICE_HOST = 'lkms101-contacts:5101'

# === CLIENT ===
class ContactsClient:
    """gRPC client for contacts service."""

    def __init__(self, host=CONTACTS_SERVICE_HOST):
        """Initialize client with channel and stub."""
        self.channel = grpc.insecure_channel(host)
        self.stub = contacts_pb2_grpc.ContactsServiceStub(self.channel)

    def get_contact(self, contact_id: int):
        """
        Get contact by ID.

        Args:
            contact_id: Contact ID

        Returns:
            Contact object or None if not found
        """
        request = contacts_pb2.GetContactRequest(id=contact_id)

        try:
            response = self.stub.GetContact(request)
            logger.info(f"Retrieved contact via gRPC: {contact_id}")
            return response.contact
        except grpc.RpcError as e:
            logger.error(f"gRPC error: {e.code()} - {e.details()}")
            return None

    def validate_contact(self, contact_id: int) -> bool:
        """
        Validate that contact exists and is active.

        Args:
            contact_id: Contact ID

        Returns:
            True if valid, False otherwise
        """
        request = contacts_pb2.ValidateContactRequest(id=contact_id)

        try:
            response = self.stub.ValidateContact(request)
            if not response.is_valid:
                logger.warning(f"Contact validation failed: {response.error_message}")
            return response.is_valid
        except grpc.RpcError as e:
            logger.error(f"gRPC error: {e.code()} - {e.details()}")
            return False

    def close(self):
        """Close gRPC channel."""
        self.channel.close()

# === USAGE EXAMPLE ===
def example_usage():
    """Example of using ContactsClient."""
    client = ContactsClient()

    # Get contact
    contact = client.get_contact(123)
    if contact:
        print(f"Contact: {contact.name} ({contact.email})")

    # Validate contact
    is_valid = client.validate_contact(123)
    if is_valid:
        print("Contact is valid and active")

    client.close()
```

---

## 5. Apache Kafka

### Kafka Producer

**app/kafka/producer.py:**

```python
"""
================================================================
FILE: producer.py
PATH: /services/lkms101-contacts/app/kafka/producer.py
DESCRIPTION: Kafka producer for publishing contact events
VERSION: v1.0.0
UPDATED: 2025-10-18 15:30:00
================================================================
"""

# === IMPORTS ===
from kafka import KafkaProducer
import json
import logging

# === LOGGING ===
logger = logging.getLogger(__name__)

# === CONSTANTS ===
KAFKA_BOOTSTRAP_SERVERS = ['lkms503-kafka:9093']

# Topic naming: lkern.{service}.{event_type}
KAFKA_TOPICS = {
    'CONTACT_CREATED': 'lkern.contacts.created',
    'CONTACT_UPDATED': 'lkern.contacts.updated',
    'CONTACT_DELETED': 'lkern.contacts.deleted',
}

# === PRODUCER ===
class EventProducer:
    """Kafka event producer for publishing events."""

    def __init__(self):
        """Initialize Kafka producer."""
        self.producer = KafkaProducer(
            bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
            value_serializer=lambda v: json.dumps(v).encode('utf-8'),
            acks='all',          # Wait for all replicas to acknowledge
            retries=3,           # Retry failed sends up to 3 times
            max_in_flight_requests_per_connection=1  # Guarantee message order
        )

    def publish_event(self, topic: str, event_data: dict):
        """
        Publish event to Kafka topic.

        Args:
            topic: Kafka topic name
            event_data: Event data dictionary

        Raises:
            Exception: If publishing fails after retries
        """
        try:
            future = self.producer.send(topic, value=event_data)

            # Block until message is sent (optional - for critical events)
            record_metadata = future.get(timeout=10)

            logger.info(
                f"Event published to {topic}: "
                f"partition={record_metadata.partition}, "
                f"offset={record_metadata.offset}"
            )
        except Exception as e:
            logger.error(f"Failed to publish event to {topic}: {str(e)}")
            raise

    def close(self):
        """Close producer connection."""
        self.producer.close()

# === SINGLETON INSTANCE ===
event_producer = EventProducer()
```

**Usage in API:**

```python
# app/routers/contacts.py
from app.kafka.producer import event_producer, KAFKA_TOPICS

@router.post("/", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def create_contact(contact: ContactCreate, db: Session = Depends(get_db)):
    """Create new contact and publish event."""

    # Create contact in database
    db_contact = Contact(**contact.model_dump())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)

    # Publish event to Kafka
    event_data = {
        'event_type': 'ContactCreated',
        'contact_id': db_contact.id,
        'contact_name': db_contact.name,
        'contact_email': db_contact.email,
        'timestamp': db_contact.created_at.isoformat()
    }

    try:
        event_producer.publish_event(KAFKA_TOPICS['CONTACT_CREATED'], event_data)
    except Exception as e:
        # Log error but don't fail request (event publishing is not critical)
        logger.error(f"Failed to publish ContactCreated event: {str(e)}")

    return db_contact
```

---

### Kafka Consumer

**app/kafka/consumer.py:**

```python
"""
================================================================
FILE: consumer.py
PATH: /services/lkms102-orders/app/kafka/consumer.py
DESCRIPTION: Kafka consumer for subscribing to contact events
VERSION: v1.0.0
UPDATED: 2025-10-18 15:30:00
================================================================
"""

# === IMPORTS ===
from kafka import KafkaConsumer
import json
import logging

# === LOGGING ===
logger = logging.getLogger(__name__)

# === CONSTANTS ===
KAFKA_BOOTSTRAP_SERVERS = ['lkms503-kafka:9093']

# === CONSUMER ===
class EventConsumer:
    """Kafka event consumer for subscribing to events."""

    def __init__(self, topics: list, group_id: str):
        """
        Initialize Kafka consumer.

        Args:
            topics: List of topics to subscribe to
            group_id: Consumer group ID (unique per service)
        """
        self.consumer = KafkaConsumer(
            *topics,
            bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
            group_id=group_id,
            value_deserializer=lambda m: json.loads(m.decode('utf-8')),
            auto_offset_reset='earliest',  # Start from beginning if no offset
            enable_auto_commit=True
        )

    def consume_events(self, handler_func):
        """
        Consume events and process with handler function.

        Args:
            handler_func: Function to process each event (receives event_data dict)
        """
        logger.info("Starting event consumer...")

        try:
            for message in self.consumer:
                try:
                    event_data = message.value
                    logger.info(
                        f"Received event from {message.topic}: "
                        f"partition={message.partition}, offset={message.offset}"
                    )

                    # Process event with handler
                    handler_func(event_data)

                except Exception as e:
                    logger.error(f"Error processing event: {str(e)}")
                    # Continue processing other events

        except KeyboardInterrupt:
            logger.info("Consumer stopped by user")
        finally:
            self.consumer.close()
```

**Event handler example:**

```python
# app/kafka/handlers.py
import logging

logger = logging.getLogger(__name__)

def handle_contact_created(event_data: dict):
    """
    Handle ContactCreated event.

    This could:
    - Update local cache
    - Send welcome email
    - Create default settings
    """
    contact_id = event_data['contact_id']
    contact_name = event_data['contact_name']

    logger.info(f"Processing ContactCreated event for: {contact_name} (ID: {contact_id})")

    # Example: Update cache or send notification
    # send_welcome_email(contact_email)
    # invalidate_cache(contact_id)
```

**Start consumer:**

```python
# app/kafka/consumer_service.py
from app.kafka.consumer import EventConsumer
from app.kafka.handlers import handle_contact_created

def start_consumer():
    """Start Kafka consumer in background thread."""
    topics = ['lkern.contacts.created']
    consumer = EventConsumer(topics=topics, group_id='lkms102-orders-group')
    consumer.consume_events(handle_contact_created)

# In main.py
@app.on_event("startup")
async def startup_event():
    import threading
    consumer_thread = threading.Thread(target=start_consumer, daemon=True)
    consumer_thread.start()
```

---

## 6. Human-Readable Code Generation

### Overview

Generate unique, human-readable entity codes in **PREFIX-RRMM-NNNN** format:

| Part | Description | Example |
|------|-------------|---------|
| PREFIX | 2-4 character type code | `BUG`, `FEA`, `INV` |
| RR | Year (last 2 digits) | `25` = 2025 |
| MM | Month (01-12) | `12` = December |
| NNNN | Sequential number | `0001` - `9999` |

**Examples:**
- `BUG-2512-0001` = Bug #1 in December 2025
- `FEA-2601-0042` = Feature #42 in January 2026
- `INV-2503-0123` = Invoice #123 in March 2025

### Implementation

**Code Generator Service:**

```python
# app/services/code_generator.py
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.enums import TYPE_CODE_PREFIXES

def generate_entity_code(
    db: Session,
    entity_type,
    model_class,
    code_column_name: str = "entity_code"
) -> str:
    """
    Generate human-readable entity code: PREFIX-RRMM-NNNN

    Args:
        db: Database session
        entity_type: Enum value (e.g., IssueType.BUG)
        model_class: SQLAlchemy model class
        code_column_name: Name of the code column

    Returns:
        str: Generated code (e.g., "BUG-2512-0042")
    """
    # Get prefix from type mapping
    prefix = TYPE_CODE_PREFIXES.get(entity_type, "GEN")

    # Year-month suffix (RRMM format)
    now = datetime.utcnow()
    year_month = now.strftime("%y%m")  # e.g., "2512"

    # Query pattern for this prefix + month
    code_pattern = f"{prefix}-{year_month}-%"
    code_column = getattr(model_class, code_column_name)

    # Get max sequence for this prefix+month
    max_code = db.query(func.max(code_column))\
        .filter(code_column.like(code_pattern))\
        .scalar()

    if max_code:
        try:
            current_seq = int(max_code.split("-")[-1])
            next_seq = current_seq + 1
        except (ValueError, IndexError):
            next_seq = 1
    else:
        next_seq = 1

    return f"{prefix}-{year_month}-{next_seq:04d}"
```

**Model Column:**

```python
# app/models/example.py
from sqlalchemy import Column, String

class Issue(Base):
    __tablename__ = "issues"

    # Human-readable code (unique, indexed)
    entity_code = Column(
        String(20),
        unique=True,
        nullable=False,
        index=True,
        comment="Human-readable code: PREFIX-RRMM-NNNN"
    )
```

**Usage in Create Endpoint:**

```python
# app/api/rest/issues.py
from app.services.code_generator import generate_entity_code
from app.models import Issue, IssueType

@router.post("/", response_model=IssueResponse)
def create_issue(data: IssueCreate, db: Session = Depends(get_db)):
    # Generate human-readable code
    entity_code = generate_entity_code(db, data.type, Issue)

    issue = Issue(
        entity_code=entity_code,
        **data.model_dump()
    )
    db.add(issue)
    db.commit()
    return issue
```

### Thread Safety Note

The `SELECT MAX()` approach works for single-instance services. For high-concurrency multi-instance deployments, consider:
- Database sequences
- Distributed ID generators (Snowflake)
- Optimistic locking with retry

---

## 7. Rich Enum Classifications

### Overview

Use three standard enums for entity classification:

| Enum | Purpose | Example Values |
|------|---------|----------------|
| **Type** | Entity category | `BUG`, `FEATURE`, `TASK` |
| **Status** | Lifecycle state | `OPEN`, `IN_PROGRESS`, `CLOSED` |
| **Priority** | Urgency level | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` |

### Implementation

**Enum Definitions:**

```python
# app/models/enums.py
from enum import Enum

class IssueType(str, Enum):
    """Entity type classification."""
    BUG = "bug"
    FEATURE = "feature"
    IMPROVEMENT = "improvement"
    TASK = "task"

class IssueStatus(str, Enum):
    """Entity lifecycle status."""
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"
    REJECTED = "rejected"

class IssuePriority(str, Enum):
    """Priority levels."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

# Type to code prefix mapping (for code generator)
TYPE_CODE_PREFIXES = {
    IssueType.BUG: "BUG",
    IssueType.FEATURE: "FEA",
    IssueType.IMPROVEMENT: "IMP",
    IssueType.TASK: "TSK",
}
```

**Model Columns:**

```python
# app/models/issue.py
from sqlalchemy import Column, Enum, DateTime
from app.models.enums import IssueType, IssueStatus, IssuePriority

class Issue(Base):
    __tablename__ = "issues"

    # Classification enums (all indexed for filtering)
    type = Column(
        Enum(IssueType),
        nullable=False,
        index=True
    )
    status = Column(
        Enum(IssueStatus),
        nullable=False,
        default=IssueStatus.OPEN,
        index=True
    )
    priority = Column(
        Enum(IssuePriority),
        nullable=False,
        default=IssuePriority.MEDIUM,
        index=True
    )

    # Status transition timestamps
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    closed_at = Column(DateTime(timezone=True), nullable=True)
```

**Pydantic Schemas:**

```python
# app/schemas/issue.py
from pydantic import BaseModel
from app.models.enums import IssueType, IssueStatus, IssuePriority

class IssueCreate(BaseModel):
    """Schema for creating new issue."""
    title: str
    type: IssueType
    priority: IssuePriority = IssuePriority.MEDIUM

class IssueResponse(BaseModel):
    """Schema for issue response."""
    id: int
    entity_code: str
    title: str
    type: IssueType
    status: IssueStatus
    priority: IssuePriority

    model_config = {"from_attributes": True}
```

### Status State Machine

```
OPEN ─────────► IN_PROGRESS ─────────► RESOLVED ─────────► CLOSED
                    │                     │
                    └─────────────────────┼─────────► REJECTED
                                          │
                                          └─────────► (back to IN_PROGRESS)
```

**Status Transition Rules:**
- `OPEN` → `IN_PROGRESS`: Work started
- `IN_PROGRESS` → `RESOLVED`: Work completed, pending verification
- `RESOLVED` → `CLOSED`: Verified complete (sets `closed_at`)
- `RESOLVED` → `IN_PROGRESS`: Reopened for more work
- Any → `REJECTED`: Declined or cancelled

---

## 8. Soft Delete Pattern

### Overview

Instead of permanently deleting records, mark them as deleted using a `deleted_at` timestamp. This allows:
- Recovery of accidentally deleted data
- Audit trail preservation
- Referential integrity maintenance

### Implementation

**Model Column:**

```python
# app/models/issue.py
from sqlalchemy import Column, DateTime

class Issue(Base):
    __tablename__ = "issues"

    # Soft delete timestamp (NULL = active, set = deleted)
    deleted_at = Column(
        DateTime(timezone=True),
        nullable=True,
        index=True,
        comment="Soft delete timestamp"
    )
```

**Pydantic Schema:**

```python
# app/schemas/issue.py
from pydantic import computed_field

class IssueResponse(BaseModel):
    deleted_at: Optional[datetime] = None

    @computed_field
    @property
    def is_deleted(self) -> bool:
        """Computed field for easy boolean check."""
        return self.deleted_at is not None
```

**Soft Delete Endpoint:**

```python
# app/api/rest/issues.py
from datetime import datetime, timezone

@router.delete("/{issue_id}", response_model=DeleteResponse)
def soft_delete_issue(issue_id: int, db: Session = Depends(get_db)):
    """
    Soft delete - sets deleted_at timestamp.
    Record remains in database but is excluded from normal queries.
    """
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")

    if issue.deleted_at:
        raise HTTPException(status_code=400, detail="Issue already deleted")

    issue.deleted_at = datetime.now(timezone.utc)
    db.commit()

    # Publish event
    publish_event("issues.deleted", {"id": issue_id, "entity_code": issue.entity_code})

    return {"id": issue_id, "deleted": True, "message": "Issue soft deleted"}
```

**Restore Endpoint:**

```python
@router.post("/{issue_id}/restore", response_model=RestoreResponse)
def restore_issue(issue_id: int, db: Session = Depends(get_db)):
    """Restore soft-deleted issue."""
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")

    if not issue.deleted_at:
        raise HTTPException(status_code=400, detail="Issue is not deleted")

    issue.deleted_at = None
    db.commit()

    return {"id": issue_id, "restored": True, "message": "Issue restored"}
```

**Hard Delete (Admin Only):**

```python
@router.delete("/{issue_id}/permanent")
def hard_delete_issue(issue_id: int, db: Session = Depends(get_db)):
    """
    Permanently delete issue. Cannot be undone.
    Requires admin privileges.
    """
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")

    db.delete(issue)
    db.commit()

    return {"id": issue_id, "permanently_deleted": True}
```

### Query Filtering

Always filter out soft-deleted records in list queries (unless explicitly requested):

```python
@router.get("/", response_model=List[IssueResponse])
def list_issues(
    include_deleted: bool = Query(False, description="Include soft-deleted records"),
    db: Session = Depends(get_db)
):
    query = db.query(Issue)

    # By default, exclude soft-deleted records
    if not include_deleted:
        query = query.filter(Issue.deleted_at.is_(None))

    return query.all()
```

---

## 9. Query Filtering & Pagination

### Standard Query Parameters

All list endpoints should support:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `skip` | int | 0 | Records to skip (offset) |
| `limit` | int | 100 | Maximum records to return |
| `type` | string | None | Filter by type enum |
| `status` | string | None | Filter by status enum |
| `priority` | string | None | Filter by priority enum |
| `search` | string | None | Search in text fields |
| `include_deleted` | bool | False | Include soft-deleted |

### Implementation

```python
# app/api/rest/issues.py
from typing import Optional, List
from fastapi import Query

@router.get("/", response_model=List[IssueResponse])
def list_issues(
    # Pagination
    skip: int = Query(0, ge=0, description="Records to skip"),
    limit: int = Query(100, ge=1, le=500, description="Max records to return"),

    # Enum filters
    type: Optional[str] = Query(None, description="Filter by type"),
    status: Optional[str] = Query(None, description="Filter by status"),
    priority: Optional[str] = Query(None, description="Filter by priority"),

    # Text search
    search: Optional[str] = Query(None, description="Search in title/description"),

    # Soft delete
    include_deleted: bool = Query(False, description="Include soft-deleted"),

    db: Session = Depends(get_db)
):
    """
    List issues with filtering and pagination.

    **Filters:**
    - `type`: Filter by issue type (bug, feature, etc.)
    - `status`: Filter by status (open, in_progress, etc.)
    - `priority`: Filter by priority (low, medium, high, critical)
    - `search`: Search in title and description (case-insensitive)
    - `include_deleted`: Include soft-deleted issues

    **Pagination:**
    - `skip`: Number of records to skip (for pagination)
    - `limit`: Maximum records to return (1-500)
    """
    query = db.query(Issue)

    # Soft delete filter (default: exclude deleted)
    if not include_deleted:
        query = query.filter(Issue.deleted_at.is_(None))

    # Enum filters
    if type:
        query = query.filter(Issue.type == type)
    if status:
        query = query.filter(Issue.status == status)
    if priority:
        query = query.filter(Issue.priority == priority)

    # Text search (ILIKE for case-insensitive)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Issue.title.ilike(search_pattern)) |
            (Issue.description.ilike(search_pattern))
        )

    # Apply pagination
    return query.offset(skip).limit(limit).all()
```

### Response with Total Count

For pagination UI, return total count:

```python
class PaginatedResponse(BaseModel):
    items: List[IssueResponse]
    total: int
    skip: int
    limit: int
    has_more: bool

@router.get("/", response_model=PaginatedResponse)
def list_issues(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(Issue).filter(Issue.deleted_at.is_(None))

    total = query.count()
    items = query.offset(skip).limit(limit).all()

    return PaginatedResponse(
        items=items,
        total=total,
        skip=skip,
        limit=limit,
        has_more=(skip + len(items)) < total
    )
```

---

## 10. MinIO File Upload (Optional)

### Overview

MinIO provides S3-compatible object storage for file attachments. Enable via generator config `hasFileUpload: true`.

### Configuration

```bash
# .env
MINIO_ENDPOINT=lkms505-minio:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=issues
MINIO_SECURE=false
MAX_FILE_SIZE=10485760  # 10MB
```

### MinIO Client Service

```python
# app/services/minio_client.py
from minio import Minio
from minio.error import S3Error
import os

class MinioService:
    def __init__(self):
        self.endpoint = os.getenv("MINIO_ENDPOINT", "minio:9000")
        self.access_key = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
        self.secret_key = os.getenv("MINIO_SECRET_KEY", "minioadmin")
        self.bucket_name = os.getenv("MINIO_BUCKET_NAME", "files")

        self.client = Minio(
            self.endpoint,
            access_key=self.access_key,
            secret_key=self.secret_key,
            secure=False
        )
        self._ensure_bucket()

    def _ensure_bucket(self):
        if not self.client.bucket_exists(self.bucket_name):
            self.client.make_bucket(self.bucket_name)

    def upload_file(self, file_data, object_name, content_type, file_size):
        self.client.put_object(
            self.bucket_name, object_name, file_data, file_size, content_type
        )
        return f"http://{self.endpoint}/{self.bucket_name}/{object_name}"

    def get_presigned_url(self, object_name, expires=timedelta(hours=1)):
        return self.client.presigned_get_object(
            self.bucket_name, object_name, expires
        )

    def delete_file(self, object_name):
        self.client.remove_object(self.bucket_name, object_name)
```

### Upload Endpoint

```python
# app/api/rest/uploads.py
from fastapi import APIRouter, UploadFile, File, HTTPException
import uuid

router = APIRouter(prefix="/issues/uploads", tags=["uploads"])

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_TYPES = {"image/jpeg", "image/png", "application/pdf"}

@router.post("/")
async def upload_file(
    file: UploadFile = File(...),
    entity_id: Optional[int] = None
):
    # Validate content type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, f"File type not allowed: {file.content_type}")

    # Read and validate size
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(400, f"File too large. Max: {MAX_FILE_SIZE} bytes")

    # Generate unique path
    file_id = str(uuid.uuid4())
    ext = file.filename.rsplit(".", 1)[-1] if "." in file.filename else ""
    object_path = f"issues/{entity_id or 'general'}/{file_id}.{ext}"

    # Upload to MinIO
    from io import BytesIO
    minio = get_minio_service()
    minio.upload_file(BytesIO(content), object_path, file.content_type, len(content))

    return {
        "file_id": file_id,
        "object_path": object_path,
        "download_url": minio.get_presigned_url(object_path)
    }
```

### JSON Attachments Column

Store file metadata in JSON column instead of separate table:

```python
# app/models/issue.py
from sqlalchemy.dialects.postgresql import JSON

class Issue(Base):
    # JSON array of attachment metadata
    attachments = Column(
        JSON,
        nullable=True,
        comment="Array of {file_id, filename, content_type, size, object_path}"
    )
```

**Attachment schema:**
```json
[
  {
    "file_id": "a1b2c3d4-e5f6-7890",
    "filename": "screenshot.png",
    "content_type": "image/png",
    "size": 102400,
    "object_path": "issues/123/a1b2c3d4.png",
    "uploaded_at": "2025-12-16T10:30:00Z"
  }
]
```

---

## Summary

**Backend standards cover:**
- ✅ Python 3.11 + FastAPI conventions
- ✅ SQLAlchemy models + Alembic migrations
- ✅ Pydantic schemas for validation
- ✅ FastAPI routers with proper error handling
- ✅ gRPC server & client implementation
- ✅ Apache Kafka producer & consumer
- ✅ Human-readable code generation (PREFIX-RRMM-NNNN)
- ✅ Rich enum classifications (Type, Status, Priority)
- ✅ Soft delete pattern with restore
- ✅ Query filtering & pagination
- ✅ MinIO file upload (optional)
- ✅ Logging rules (NEVER use print!)
- ✅ Database connection pooling

**See also:**
- [coding-standards.md](coding-standards.md) - Core standards (DRY, file headers, naming)
- [code-examples.md](code-examples.md) - Practical code examples
- [testing-overview.md](../testing/testing-overview.md) - pytest testing patterns

---

**Last Updated:** 2025-12-16
**Maintainer:** BOSSystems s.r.o.
