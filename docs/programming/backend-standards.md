# ================================================================
# L-KERN v4 - Backend Standards
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\programming\backend-standards.md
# Version: 1.0.0
# Created: 2025-10-18
# Updated: 2025-10-18
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Backend development standards for L-KERN v4 including
#   Python 3.11, FastAPI, SQLAlchemy, Alembic, gRPC, Kafka, and database patterns.
# ================================================================

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

## Summary

**Backend standards cover:**
- ✅ Python 3.11 + FastAPI conventions
- ✅ SQLAlchemy models + Alembic migrations
- ✅ Pydantic schemas for validation
- ✅ FastAPI routers with proper error handling
- ✅ gRPC server & client implementation
- ✅ Apache Kafka producer & consumer
- ✅ Logging rules (NEVER use print!)
- ✅ Database connection pooling

**See also:**
- [coding-standards.md](coding-standards.md) - Core standards (DRY, file headers, naming)
- [code-examples.md](code-examples.md) - Practical code examples
- [testing-guide.md](testing-guide.md) - pytest testing patterns

---

**Last Updated:** 2025-10-18
**Maintainer:** BOSSystems s.r.o.
