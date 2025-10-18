# ================================================================
# L-KERN v4 - Coding Standards
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\programming\coding-standards.md
# Version: 1.1.0
# Created: 2025-10-15
# Updated: 2025-10-18
# Project: BOSS (Business Operating System Software)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Mandatory coding standards, conventions and best practices for
#   L-KERN v4 including TypeScript, Python, React, FastAPI, gRPC patterns.
# ================================================================

---

## 📋 Overview

Tento dokument definuje kódovacie štandardy, konvencie a best practices pre L-KERN v4 projekt. Všetky pravidlá sú **POVINNÉ** a musia byť dodržané v celom codebase.

**Key Principles:**
- ✅ **Simplicity First** - Čitateľný kód pred clever riešeniami
- ✅ **DRY Compliance** - Don't Repeat Yourself (Single Source of Truth)
- ✅ **Type Safety** - TypeScript strict mode + Python type hints
- ✅ **Documentation** - Každý súbor musí mať header a komentáre
- ✅ **Testability** - Kód musí byť testovateľný (unit + integration)

---

## 1. Language & Communication

### Language Requirements

**Communication:**
- ✅ **ALWAYS respond in Slovak** - Všetka komunikácia s AI asistentom v slovenčine
- ✅ **Documentation in English** - Všetky `.md` súbory v angličtine
- ✅ **Code in English** - Premenné, funkcie, classes v angličtine
- ✅ **Comments in Slovak** - Komentáre v kóde v slovenčine pre lepšie porozumenie

**Multilingual Support:**
- ✅ **NO hardcoded text** - Všetok používateľský text cez translation systém
- ✅ **Translation package** - Centralizované preklady v `@l-kern/config`
- ✅ **Primary languages** - Slovenčina (default) + Angličtina
- ✅ **Fallback system** - Ak chýba preklad, zobraz slovenčinu + SK: pred textom + console warning

### Translation System Architecture

**Structure:**
```
packages/config/src/translations/
├── index.ts      # Main export + useTranslation hook
├── sk.ts         # Slovak texts (default language)
├── en.ts         # English translations
└── types.ts      # TypeScript interfaces
```

**Usage:**
```typescript
import { useTranslation } from '@l-kern/config';

const MyComponent = () => {
  const { t, currentLanguage, setLanguage } = useTranslation();

  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <button onClick={() => setLanguage('en')}>
        {t('common.buttons.save')}
      </button>
    </div>
  );
};
```

**Rules:**
- ✅ Import ONLY `useTranslation` hook, nie jednotlivé jazykové súbory
- ✅ All translations loaded at startup (no lazy loading)
- ✅ TypeScript autocomplete for translation keys (strict typing)
- ✅ Missing translation → show Slovak + SK: + console warning

---

## 2. Development Workflow

### Educational Development Process

**L-KERN v4 je vzdelávací projekt** - kód sa píše s dôrazom na učenie a pochopenie.

**Mandatory steps:**

1. **Documentation-first** - VŽDY si najprv prečítaj dokumentáciu pred vytváraním súborov
   - 📋 [PROJECT-OVERVIEW.md](../PROJECT-OVERVIEW.md) - Aktuálny stav projektu
   - 📋 [ROADMAP.md](../ROADMAP.md) - Plánované úlohy
   - 🎨 [design-standards.md](../design/design-standards.md) - Dizajnové požiadavky
   - 💻 [coding-standards.md](coding-standards.md) - Tento súbor
   - 🏗️ [main-architecture.md](../architecture/main-architecture.md) - Architektúra systému

2. **Check roadmap** - Pozri sa do ROADMAP.md či úloha existuje, ak nie pridaj ju

3. **Propose workflow** - Pre zložité úlohy vytvor detailný TODO workflow

4. **Think thoroughly** - Zváž všetky implikácie, závislosti a potenciálne problémy

5. **Update docs** - Po schválení workflow aktualizuj PROJECT-OVERVIEW.md

6. **Educational approach** - Generuj kód → vysvetli čo, prečo a na čo → počkaj na schválenie → ďalší chunk

7. **Incremental development** - Malé kroky, časté commity, časté vysvetlenia

8. **Wait for approval** - Vždy čakaj na "dobre" od používateľa pred pokračovaním

9. **Update roadmap** - Po dokončení označ task ako ✅ DONE v ROADMAP.md

### Workflow Rules

**MANDATORY checks pred vytváraním súborov:**
- ✅ Check documentation map - relevantné dokumenty
- ✅ Check design standards - dizajnové požiadavky
- ✅ Check coding standards - programovacie patterns
- ✅ Check architecture - štruktúra projektu
- ✅ NEVER create custom solutions ak dokumentácia definuje štandard
- ✅ Warn user ak vytváraš súbor proti dokumentácii

**Complex task workflow:**
- ✅ Create detailed TODO (atomic operations)
- ✅ Include specific files/functions/components
- ✅ Define expected outputs for each step
- ✅ Identify dependencies between steps
- ✅ Risk analysis (positive/negative impacts)
- ✅ Update TODO if analysis reveals issues

---

## 3. File Headers & Code Structure

### Mandatory File Headers

**EVERY file MUST start with standardized header** - no exceptions.

**JavaScript/TypeScript:**
```javascript
/*
 * ================================================================
 * FILE: filename.ts
 * PATH: /apps/web-ui/src/pages/filename.ts
 * DESCRIPTION: Brief description of file purpose
 * VERSION: v1.0.0
 * UPDATED: 2025-10-15 14:30:00
 * ================================================================
 */
```

**Python:**
```python
"""
================================================================
FILE: filename.py
PATH: /services/lkms101-contacts/app/main.py
DESCRIPTION: Brief description of file purpose
VERSION: v1.0.0
UPDATED: 2025-10-15 14:30:00
================================================================
"""
```

**Header rules:**
- ✅ **Automatic updates** - Pri každej úprave zvýš verziu a aktualizuj timestamp
- ✅ **Semantic versioning** - v1.0.1 (patch), v1.1.0 (feature), v2.0.0 (breaking)
- ✅ **Timestamp format** - YYYY-MM-DD HH:MM:SS
- ✅ **Description in English** - Stručný a jasný popis

### Code Sectioning

**TypeScript/JavaScript structure:**
```typescript
// === IMPORTS ===
import React from 'react';
import { useState } from 'react';

// === CONSTANTS ===
const API_ENDPOINTS = {
  CONTACTS: '/api/v1/contacts',
  CUSTOMERS: '/api/v1/customers'
};

// === TYPES ===
interface Contact {
  id: string;
  name: string;
}

// === COMPONENTS ===
const ContactList: React.FC = () => {
  // Component implementation
};

// === UTILITIES ===
const formatDate = (date: Date): string => {
  // Utility function
};

// === EXPORTS ===
export default ContactList;
export { formatDate };
```

**Python structure:**
```python
# === IMPORTS ===
from fastapi import FastAPI, HTTPException
from sqlalchemy.orm import Session
import logging

# === CONSTANTS ===
API_VERSION = "v1"
DATABASE_URL = "postgresql://localhost/lkms101_contacts"

# === LOGGING ===
logger = logging.getLogger(__name__)

# === MODELS ===
class Contact(Base):
    __tablename__ = "contacts"
    id = Column(Integer, primary_key=True)

# === SCHEMAS ===
class ContactCreate(BaseModel):
    name: str
    email: str

# === ROUTES ===
@app.get("/api/v1/contacts")
async def get_contacts():
    return {"contacts": []}

# === UTILITIES ===
def validate_email(email: str) -> bool:
    # Validation logic
    pass
```

---

## 4. Constants Management

### Automatic Extraction Rule

**MANDATORY: Extract ALL hardcoded values to CONSTANTS section.**

**What to extract:**
- ✅ API endpoints
- ✅ Timeouts and delays
- ✅ Layout sizes (widths, heights, breakpoints)
- ✅ Business rules (pagination size, max file size)
- ✅ Colors (use design tokens from @l-kern/config)
- ✅ Default values
- ❌ Small numbers (0, 1, 2) and booleans can stay inline

### Documentation Requirements

**Every constant MUST have documentation:**

```typescript
// === CONSTANTS ===

// API endpoints for microservices communication
// Why: Centralized URLs for easy deployment changes
// When to change: On API version update or architecture change
const API_ENDPOINTS = {
  CONTACTS: '/api/v1/contacts',     // Contact service (lkms101)
  CUSTOMERS: '/api/v1/customers',   // Customer service (lkms103)
  ORDERS: '/api/v1/orders'          // Order service (lkms102)
};

// Timeouts in milliseconds
// Why: Consistent timeout values across application
// When to change: Performance optimization or UX testing
const TIMEOUTS = {
  DEFAULT_REQUEST: 5000,    // 5s - standard API call timeout
  NOTIFICATION_AUTO: 3000,  // 3s - auto-close for notifications
  DEBOUNCE_SEARCH: 300      // 300ms - debounce for search input
};
```

**Documentation template:**
```typescript
// [Category name] (units if needed)
// Why: [Reason for existence]
// When to change: [When it might need modification]
const CONSTANT_GROUP = {
  ITEM_NAME: value,    // [Brief description]
  OTHER_ITEM: value2   // [Description]
};
```

### Naming Conventions

**TypeScript/JavaScript:**
- ✅ `UPPER_SNAKE_CASE` for primitive constants
- ✅ `camelCase` for config objects
- ✅ `PascalCase` for components and classes

**Python:**
- ✅ `UPPER_SNAKE_CASE` for all constants
- ✅ `snake_case` for functions and variables
- ✅ `PascalCase` for classes

**CSS:**
- ✅ `--variable-name` for CSS custom properties
- ✅ `kebab-case` for class names

**Translation keys:**
- ✅ `camelCase` with dot notation: `common.buttons.save`

---

## 5. Frontend Standards

### TypeScript/React 19 Conventions

**File naming:**
- ✅ `PascalCase.tsx` for components: `ContactList.tsx`
- ✅ `camelCase.ts` for utilities: `formatDate.ts`
- ✅ `camelCase.test.tsx` for tests: `ContactList.test.tsx`

**Component structure:**
```typescript
import React from 'react';
import { useTranslation } from '@l-kern/config';

// === TYPES ===
interface ContactListProps {
  contacts: Contact[];
  onSelect: (contact: Contact) => void;
}

// === COMPONENT ===
export const ContactList: React.FC<ContactListProps> = ({
  contacts,
  onSelect
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <h2>{t('contacts.title')}</h2>
      {contacts.map(contact => (
        <div key={contact.id} onClick={() => onSelect(contact)}>
          {contact.name}
        </div>
      ))}
    </div>
  );
};
```

**Rules:**
- ✅ Use functional components (no class components)
- ✅ Always define PropTypes interface
- ✅ Use destructuring for props
- ✅ Use hooks (useState, useEffect, custom hooks)
- ✅ Export named components (not default)

### Vite 6 Configuration

**Hot Module Replacement (HMR):**
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 4201,
    watch: {
      usePolling: true  // Required for Docker hot-reload
    }
  }
});
```

**Build optimization:**
```typescript
export default defineConfig({
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
});
```

### REST API Client Patterns

**Axios instance setup:**
```typescript
// src/api/client.ts
import axios from 'axios';
import { API_BASE_URL } from '@l-kern/config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor (auth token)
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (error handling)
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

**API service pattern:**
```typescript
// src/api/contacts.ts
import apiClient from './client';

export const contactsApi = {
  getAll: async () => {
    const response = await apiClient.get('/api/v1/contacts');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/api/v1/contacts/${id}`);
    return response.data;
  },

  create: async (data: ContactCreate) => {
    const response = await apiClient.post('/api/v1/contacts', data);
    return response.data;
  },

  update: async (id: string, data: ContactUpdate) => {
    const response = await apiClient.put(`/api/v1/contacts/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/api/v1/contacts/${id}`);
  }
};
```

---

## 6. Backend Standards

### Python/FastAPI Conventions

**File naming:**
- ✅ `snake_case.py` for all Python files: `contacts_service.py`
- ✅ `test_*.py` for tests: `test_contacts_service.py`

**FastAPI service structure:**
```
services/lkms101-contacts/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app instance
│   ├── models/              # SQLAlchemy models
│   │   └── contact.py
│   ├── schemas/             # Pydantic schemas
│   │   └── contact.py
│   ├── routers/             # API routes
│   │   └── contacts.py
│   ├── services/            # Business logic
│   │   └── contacts_service.py
│   ├── grpc/                # gRPC server
│   │   ├── server.py
│   │   └── contacts_pb2.py
│   └── database.py          # DB connection
├── alembic/                 # Migrations
│   └── versions/
├── proto/                   # .proto files
│   └── contacts.proto
├── tests/
│   ├── test_api.py
│   └── test_grpc.py
├── Dockerfile
└── requirements.txt
```

**main.py structure:**
```python
"""
================================================================
FILE: main.py
PATH: /services/lkms101-contacts/app/main.py
DESCRIPTION: FastAPI application entry point for contacts service
VERSION: v1.0.0
UPDATED: 2025-10-15 14:30:00
================================================================
"""

# === IMPORTS ===
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

# === LOGGING ===
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# === APP INSTANCE ===
app = FastAPI(
    title="L-KERN Contacts Service",
    version="1.0.0",
    description="Contact management microservice"
)

# === MIDDLEWARE ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === ROUTES ===
from app.routers import contacts
app.include_router(contacts.router, prefix="/api/v1")

# === HEALTH CHECK ===
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# === STARTUP/SHUTDOWN ===
@app.on_event("startup")
async def startup_event():
    logger.info("Contacts service starting...")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Contacts service shutting down...")
```

**Logging rules:**
- ✅ **NEVER use `print()`** - Docker logs nezobrazia print output
- ✅ **ALWAYS use `logging`** module
- ✅ **DEBUG outputs** - use `logger.warning()` (zobrazí sa v Docker logs)
- ✅ **Errors** - use `logger.error()`
- ✅ **Info** - use `logger.info()` (nezobrazí sa v production logs)

**Logging setup:**
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Usage
logger.warning("User authentication attempted")  # Visible in Docker
logger.error("Database connection failed")       # Visible in Docker
logger.info("Request processed successfully")    # Not visible in Docker
```

### SQLAlchemy + Alembic Patterns

**Model definition:**
```python
# app/models/contact.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Contact(Base):
    __tablename__ = "contacts"

    # Primary key
    id = Column(Integer, primary_key=True, index=True)

    # Fields
    name = Column(String(255), nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(50), nullable=True)
    is_active = Column(Boolean, default=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

**Database connection:**
```python
# app/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# === CONSTANTS ===
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@lkms501-postgres:5432/lkms101_contacts"
)

# === ENGINE ===
engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True  # Verify connection before using
)

# === SESSION ===
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# === BASE ===
Base = declarative_base()

# === DEPENDENCY ===
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

**Pydantic schemas:**
```python
# app/schemas/contact.py
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class ContactBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=50)

class ContactCreate(ContactBase):
    pass

class ContactUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=50)
    is_active: Optional[bool] = None

class ContactResponse(ContactBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # Pydantic v2 (was orm_mode in v1)
```

**Alembic migration:**
```python
# alembic/versions/001_create_contacts_table.py
"""create contacts table

Revision ID: 001
Revises:
Create Date: 2025-10-15 14:30:00
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = '001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'contacts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('phone', sa.String(50), nullable=True),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_contacts_name', 'contacts', ['name'])
    op.create_index('ix_contacts_email', 'contacts', ['email'], unique=True)

def downgrade():
    op.drop_index('ix_contacts_email', 'contacts')
    op.drop_index('ix_contacts_name', 'contacts')
    op.drop_table('contacts')
```

### Database Patterns

**One database per service:**
```
lkms101_contacts    → lkms101-contacts service
lkms102_orders      → lkms102-orders service
lkms103_customers   → lkms103-customers service
```

**Rules:**
- ✅ Each microservice has its OWN database
- ✅ NO direct database access between services
- ✅ Inter-service communication via gRPC only
- ✅ Database connection pooling (pool_size=10, max_overflow=20)
- ✅ Use migrations (Alembic) for schema changes

---

## 7. gRPC Standards

### .proto File Structure

**Location:** `services/{service}/proto/{service}.proto`

**Example - contacts.proto:**
```protobuf
syntax = "proto3";

package contacts;

// Contact message
message Contact {
  int32 id = 1;
  string name = 2;
  string email = 3;
  string phone = 4;
  bool is_active = 5;
}

// Request messages
message GetContactRequest {
  int32 id = 1;
}

message GetContactsByIdsRequest {
  repeated int32 ids = 1;
}

message ValidateContactRequest {
  int32 id = 1;
}

// Response messages
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

// Service definition
service ContactsService {
  rpc GetContact (GetContactRequest) returns (GetContactResponse);
  rpc GetContactsByIds (GetContactsByIdsRequest) returns (GetContactsByIdsResponse);
  rpc ValidateContact (ValidateContactRequest) returns (ValidateContactResponse);
}
```

**Naming conventions:**
- ✅ Service name: `{Resource}Service` (ContactsService)
- ✅ Message name: `{Action}{Resource}{Request/Response}` (GetContactRequest)
- ✅ Field names: `snake_case` (error_message)

### gRPC Server Implementation

**gRPC server setup:**
```python
# app/grpc/server.py
import grpc
from concurrent import futures
import logging
from app.grpc import contacts_pb2_grpc
from app.grpc.contacts_service import ContactsServicer

logger = logging.getLogger(__name__)

def serve():
    # === SERVER SETUP ===
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))

    # === REGISTER SERVICERS ===
    contacts_pb2_grpc.add_ContactsServiceServicer_to_server(
        ContactsServicer(),
        server
    )

    # === LISTEN ON PORT ===
    port = "0.0.0.0:5101"
    server.add_insecure_port(port)

    logger.info(f"gRPC server starting on {port}")
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
```

**Servicer implementation:**
```python
# app/grpc/contacts_service.py
import grpc
from app.grpc import contacts_pb2, contacts_pb2_grpc
from app.database import SessionLocal
from app.models.contact import Contact
import logging

logger = logging.getLogger(__name__)

class ContactsServicer(contacts_pb2_grpc.ContactsServiceServicer):

    def GetContact(self, request, context):
        db = SessionLocal()
        try:
            contact = db.query(Contact).filter(Contact.id == request.id).first()

            if not contact:
                context.set_code(grpc.StatusCode.NOT_FOUND)
                context.set_details(f'Contact with id {request.id} not found')
                return contacts_pb2.GetContactResponse()

            return contacts_pb2.GetContactResponse(
                contact=contacts_pb2.Contact(
                    id=contact.id,
                    name=contact.name,
                    email=contact.email,
                    phone=contact.phone or "",
                    is_active=contact.is_active
                )
            )
        except Exception as e:
            logger.error(f"Error in GetContact: {str(e)}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details('Internal server error')
            return contacts_pb2.GetContactResponse()
        finally:
            db.close()
```

### gRPC Client Usage

**Client setup:**
```python
# app/grpc/clients/contacts_client.py
import grpc
from app.grpc import contacts_pb2, contacts_pb2_grpc

class ContactsClient:
    def __init__(self, host='lkms101-contacts:5101'):
        self.channel = grpc.insecure_channel(host)
        self.stub = contacts_pb2_grpc.ContactsServiceStub(self.channel)

    def get_contact(self, contact_id: int):
        request = contacts_pb2.GetContactRequest(id=contact_id)
        try:
            response = self.stub.GetContact(request)
            return response.contact
        except grpc.RpcError as e:
            print(f"gRPC error: {e.code()} - {e.details()}")
            return None

    def close(self):
        self.channel.close()
```

**Usage in another service:**
```python
# Example: lkms102-orders calling lkms101-contacts via gRPC
from app.grpc.clients.contacts_client import ContactsClient

def validate_order(order_data):
    contacts_client = ContactsClient()

    # Get contact details via gRPC
    contact = contacts_client.get_contact(order_data.contact_id)

    if not contact:
        raise ValueError("Contact not found")

    if not contact.is_active:
        raise ValueError("Contact is inactive")

    contacts_client.close()
    return True
```

---

## 8. REST API Standards

### Endpoint Naming

**URL structure:** `/api/v{version}/{resource}`

**Examples:**
```
GET    /api/v1/contacts          # List all contacts
GET    /api/v1/contacts/{id}     # Get contact by ID
POST   /api/v1/contacts          # Create new contact
PUT    /api/v1/contacts/{id}     # Update contact
DELETE /api/v1/contacts/{id}     # Delete contact
GET    /api/v1/contacts/search   # Search contacts
```

**Rules:**
- ✅ Use plural nouns: `/contacts` not `/contact`
- ✅ Use HTTP methods: GET, POST, PUT, DELETE
- ✅ Version in URL: `/api/v1/`
- ✅ Use kebab-case: `/delivery-notes` not `/deliveryNotes`
- ✅ Use query params for filters: `/contacts?is_active=true`

### Router Implementation

**FastAPI router:**
```python
# app/routers/contacts.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.contact import Contact
from app.schemas.contact import ContactCreate, ContactUpdate, ContactResponse

router = APIRouter(
    prefix="/contacts",
    tags=["contacts"]
)

@router.get("/", response_model=List[ContactResponse])
async def get_contacts(
    skip: int = 0,
    limit: int = 100,
    is_active: bool = None,
    db: Session = Depends(get_db)
):
    """Get list of contacts with optional filtering."""
    query = db.query(Contact)

    if is_active is not None:
        query = query.filter(Contact.is_active == is_active)

    contacts = query.offset(skip).limit(limit).all()
    return contacts

@router.get("/{contact_id}", response_model=ContactResponse)
async def get_contact(
    contact_id: int,
    db: Session = Depends(get_db)
):
    """Get contact by ID."""
    contact = db.query(Contact).filter(Contact.id == contact_id).first()

    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contact with id {contact_id} not found"
        )

    return contact

@router.post("/", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def create_contact(
    contact: ContactCreate,
    db: Session = Depends(get_db)
):
    """Create new contact."""
    # Check if email already exists
    existing = db.query(Contact).filter(Contact.email == contact.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Contact with this email already exists"
        )

    db_contact = Contact(**contact.dict())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)

    return db_contact

@router.put("/{contact_id}", response_model=ContactResponse)
async def update_contact(
    contact_id: int,
    contact: ContactUpdate,
    db: Session = Depends(get_db)
):
    """Update contact."""
    db_contact = db.query(Contact).filter(Contact.id == contact_id).first()

    if not db_contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contact with id {contact_id} not found"
        )

    # Update only provided fields
    update_data = contact.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_contact, field, value)

    db.commit()
    db.refresh(db_contact)

    return db_contact

@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_contact(
    contact_id: int,
    db: Session = Depends(get_db)
):
    """Delete contact."""
    db_contact = db.query(Contact).filter(Contact.id == contact_id).first()

    if not db_contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contact with id {contact_id} not found"
        )

    db.delete(db_contact)
    db.commit()
```

### Error Responses

**Standard error format:**
```json
{
  "detail": "Error message describing what went wrong"
}
```

**HTTP status codes:**
- ✅ `200 OK` - Successful GET/PUT
- ✅ `201 Created` - Successful POST
- ✅ `204 No Content` - Successful DELETE
- ✅ `400 Bad Request` - Invalid input data
- ✅ `401 Unauthorized` - Missing/invalid auth token
- ✅ `403 Forbidden` - No permission for resource
- ✅ `404 Not Found` - Resource doesn't exist
- ✅ `422 Unprocessable Entity` - Validation error
- ✅ `500 Internal Server Error` - Server error

**Custom exception handler:**
```python
# app/main.py
from fastapi import Request
from fastapi.responses import JSONResponse

@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc)}
    )
```

### Retry Logic with Exponential Backoff

**MANDATORY for 500 errors and service unavailability:**

When calling external services (REST API, gRPC), implement retry logic with exponential backoff.

**Retry strategy:**
- ✅ **Retry on errors**: 500, 502, 503, 504 (server errors)
- ✅ **Retry on exceptions**: Connection timeout, connection refused
- ✅ **Exponential backoff**: 1s, 2s, 4s, 8s
- ✅ **Max retries**: 4 attempts (total 5 tries including initial)
- ✅ **Log each retry**: Warning level with attempt number

**Python implementation (REST API):**
```python
# app/utils/retry.py
import asyncio
import logging
from typing import Callable, Any
from functools import wraps

logger = logging.getLogger(__name__)

# === CONSTANTS ===
# Retry delays in seconds (exponential backoff)
# Why: Progressive delays give service time to recover
# When to change: Performance tuning or SLA requirements
RETRY_DELAYS = [1, 2, 4, 8]  # 1s, 2s, 4s, 8s

# HTTP status codes that should trigger retry
# Why: Server errors are often temporary
# When to change: When adding new retry-able error codes
RETRYABLE_STATUS_CODES = [500, 502, 503, 504]

async def retry_on_failure(
    func: Callable,
    *args,
    retries: int = 4,
    delays: list = RETRY_DELAYS,
    **kwargs
) -> Any:
    """
    Retry function call with exponential backoff.

    Args:
        func: Async function to retry
        retries: Number of retry attempts (default: 4)
        delays: List of delays in seconds (default: [1, 2, 4, 8])

    Returns:
        Function result if successful

    Raises:
        Last exception if all retries fail
    """
    last_exception = None

    for attempt in range(retries + 1):  # +1 for initial attempt
        try:
            return await func(*args, **kwargs)
        except Exception as e:
            last_exception = e

            # Check if we should retry
            should_retry = False

            # HTTP error with retryable status code
            if hasattr(e, 'response') and hasattr(e.response, 'status_code'):
                if e.response.status_code in RETRYABLE_STATUS_CODES:
                    should_retry = True

            # Connection errors
            if 'ConnectionError' in str(type(e)) or 'Timeout' in str(type(e)):
                should_retry = True

            # gRPC errors
            if 'grpc' in str(type(e)).lower():
                should_retry = True

            # Don't retry on last attempt
            if not should_retry or attempt == retries:
                logger.error(f"Request failed after {attempt + 1} attempts: {str(e)}")
                raise last_exception

            # Log retry attempt
            delay = delays[attempt] if attempt < len(delays) else delays[-1]
            logger.warning(
                f"Request failed (attempt {attempt + 1}/{retries + 1}), "
                f"retrying in {delay}s: {str(e)}"
            )

            # Wait before retry
            await asyncio.sleep(delay)

    # Should never reach here, but safety fallback
    raise last_exception

# === DECORATOR VERSION ===
def with_retry(retries: int = 4, delays: list = RETRY_DELAYS):
    """
    Decorator for automatic retry with exponential backoff.

    Usage:
        @with_retry(retries=4, delays=[1, 2, 4, 8])
        async def call_external_service():
            # Service call implementation
            pass
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            return await retry_on_failure(func, *args, retries=retries, delays=delays, **kwargs)
        return wrapper
    return decorator
```

**Usage example:**
```python
# app/api/external_service.py
from app.utils.retry import with_retry
import httpx

# === DECORATOR USAGE ===
@with_retry(retries=4, delays=[1, 2, 4, 8])
async def call_external_api(endpoint: str):
    """Call external service with automatic retry."""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://external-service.com{endpoint}")
        response.raise_for_status()
        return response.json()

# === MANUAL USAGE ===
from app.utils.retry import retry_on_failure

async def get_user_data(user_id: int):
    async def _fetch():
        async with httpx.AsyncClient() as client:
            response = await client.get(f"https://api.example.com/users/{user_id}")
            response.raise_for_status()
            return response.json()

    # Retry with custom parameters
    return await retry_on_failure(_fetch, retries=3, delays=[1, 2, 4])
```

**TypeScript implementation (Frontend):**
```typescript
// src/utils/retry.ts

// === CONSTANTS ===
// Retry delays in milliseconds (exponential backoff)
const RETRY_DELAYS = [1000, 2000, 4000, 8000]; // 1s, 2s, 4s, 8s

// HTTP status codes that should trigger retry
const RETRYABLE_STATUS_CODES = [500, 502, 503, 504];

// === TYPES ===
interface RetryOptions {
  retries?: number;
  delays?: number[];
  onRetry?: (attempt: number, error: Error) => void;
}

// === RETRY FUNCTION ===
export async function retryOnFailure<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    retries = 4,
    delays = RETRY_DELAYS,
    onRetry
  } = options;

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Check if we should retry
      let shouldRetry = false;

      // HTTP error with retryable status code
      if (error.response?.status && RETRYABLE_STATUS_CODES.includes(error.response.status)) {
        shouldRetry = true;
      }

      // Network errors
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        shouldRetry = true;
      }

      // Don't retry on last attempt
      if (!shouldRetry || attempt === retries) {
        console.error(`Request failed after ${attempt + 1} attempts:`, error.message);
        throw lastError;
      }

      // Calculate delay
      const delay = delays[attempt] || delays[delays.length - 1];

      console.warn(
        `Request failed (attempt ${attempt + 1}/${retries + 1}), retrying in ${delay}ms:`,
        error.message
      );

      // Call onRetry callback
      if (onRetry) {
        onRetry(attempt + 1, error);
      }

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// === AXIOS INTERCEPTOR ===
import axios from 'axios';

export const setupRetryInterceptor = () => {
  axios.interceptors.response.use(
    response => response,
    async error => {
      const config = error.config;

      // Check if already retried max times
      if (!config || config.__retryCount >= 4) {
        return Promise.reject(error);
      }

      // Initialize retry count
      config.__retryCount = config.__retryCount || 0;

      // Check if error is retryable
      const isRetryable =
        error.response?.status && RETRYABLE_STATUS_CODES.includes(error.response.status) ||
        error.code === 'ECONNREFUSED' ||
        error.message?.includes('Network Error');

      if (!isRetryable) {
        return Promise.reject(error);
      }

      // Increment retry count
      config.__retryCount++;

      // Calculate delay
      const delay = RETRY_DELAYS[config.__retryCount - 1] || RETRY_DELAYS[RETRY_DELAYS.length - 1];

      console.warn(
        `Request failed (attempt ${config.__retryCount}/5), retrying in ${delay}ms:`,
        error.message
      );

      // Wait and retry
      await new Promise(resolve => setTimeout(resolve, delay));
      return axios(config);
    }
  );
};
```

**Usage in API client:**
```typescript
// src/api/client.ts
import axios from 'axios';
import { setupRetryInterceptor } from '../utils/retry';

const apiClient = axios.create({
  baseURL: 'http://localhost:4101',
  timeout: 5000
});

// Setup automatic retry on failures
setupRetryInterceptor();

export default apiClient;
```

---

## 8.5. Message Broker - Apache Kafka

### Kafka Architecture

**Purpose:** Asynchronous communication between microservices for event-driven architecture.

**Use cases:**
- ✅ **Event publishing** - Service publishes events (e.g., "ContactCreated", "OrderCompleted")
- ✅ **Event consumption** - Other services subscribe to events and react
- ✅ **Data streaming** - Real-time data processing
- ✅ **Audit logs** - Immutable event log for compliance
- ✅ **Cache invalidation** - Notify other services to refresh cached data

**Kafka vs gRPC:**
- **gRPC** - Synchronous request/response (immediate answer needed)
- **Kafka** - Asynchronous events (no immediate answer needed)

**Example scenarios:**

| Scenario | Technology | Why |
|----------|-----------|-----|
| Orders service calls Customers to get customer data | gRPC | Needs immediate response |
| Orders service notifies "OrderCreated" event | Kafka | Other services react asynchronously |
| Warehouse checks stock availability | gRPC | Needs immediate yes/no |
| Warehouse publishes "StockLevelLow" event | Kafka | Notifications sent asynchronously |

### Kafka Service Setup

**Docker Compose:**
```yaml
# infrastructure/docker/docker-compose.yml
services:
  # === KAFKA ===
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

  lkms503-kafka:
    image: confluentinc/cp-kafka:7.5.0
    container_name: lkms503-kafka
    ports:
      - "4503:9092"  # External access
      - "9093:9093"  # Internal access
    depends_on:
      - lkms502-zookeeper
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: lkms502-zookeeper:2181
      KAFKA_LISTENERS: EXTERNAL://0.0.0.0:9092,INTERNAL://0.0.0.0:9093
      KAFKA_ADVERTISED_LISTENERS: EXTERNAL://localhost:4503,INTERNAL://lkms503-kafka:9093
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: EXTERNAL:PLAINTEXT,INTERNAL:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: "true"
    networks:
      - lkern-network

  # === KAFKA UI (Optional) ===
  lkms903-kafka-ui:
    image: provectuslabs/kafka-ui:latest
    container_name: lkms903-kafka-ui
    ports:
      - "4903:8080"
    environment:
      KAFKA_CLUSTERS_0_NAME: lkern-cluster
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: lkms503-kafka:9093
      KAFKA_CLUSTERS_0_ZOOKEEPER: lkms502-zookeeper:2181
    depends_on:
      - lkms503-kafka
    networks:
      - lkern-network
```

### Kafka Producer (Python)

**Producer setup:**
```python
# app/kafka/producer.py
from kafka import KafkaProducer
import json
import logging

logger = logging.getLogger(__name__)

# === CONSTANTS ===
KAFKA_BOOTSTRAP_SERVERS = ['lkms503-kafka:9093']
KAFKA_TOPICS = {
    'CONTACT_CREATED': 'lkern.contacts.created',
    'CONTACT_UPDATED': 'lkern.contacts.updated',
    'CONTACT_DELETED': 'lkern.contacts.deleted',
}

class EventProducer:
    """Kafka event producer for publishing events."""

    def __init__(self):
        self.producer = KafkaProducer(
            bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
            value_serializer=lambda v: json.dumps(v).encode('utf-8'),
            acks='all',  # Wait for all replicas
            retries=3,   # Retry failed sends
            max_in_flight_requests_per_connection=1  # Guarantee order
        )

    def publish_event(self, topic: str, event_data: dict):
        """Publish event to Kafka topic."""
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

**Usage in API endpoints:**
```python
# app/routers/contacts.py
from app.kafka.producer import event_producer, KAFKA_TOPICS

@router.post("/", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def create_contact(contact: ContactCreate, db: Session = Depends(get_db)):
    """Create new contact and publish event."""

    # Create contact in database
    db_contact = Contact(**contact.dict())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)

    # Publish event to Kafka (async notification)
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

### Kafka Consumer (Python)

**Consumer setup:**
```python
# app/kafka/consumer.py
from kafka import KafkaConsumer
import json
import logging

logger = logging.getLogger(__name__)

# === CONSTANTS ===
KAFKA_BOOTSTRAP_SERVERS = ['lkms503-kafka:9093']

class EventConsumer:
    """Kafka event consumer for subscribing to events."""

    def __init__(self, topics: list, group_id: str):
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

**Consumer example - Orders service subscribing to ContactCreated:**
```python
# services/lkms102-orders/app/kafka/handlers.py
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

    # Example: Update local cache or send notification
    # send_welcome_email(contact_email)
    # invalidate_cache(contact_id)

# === CONSUMER STARTUP ===
# services/lkms102-orders/app/kafka/consumer_service.py
from app.kafka.consumer import EventConsumer
from app.kafka.handlers import handle_contact_created

def start_consumer():
    """Start Kafka consumer in background thread."""
    topics = ['lkern.contacts.created']
    consumer = EventConsumer(topics=topics, group_id='lkms102-orders-group')
    consumer.consume_events(handle_contact_created)

# Start consumer in main.py
# @app.on_event("startup")
# async def startup_event():
#     import threading
#     consumer_thread = threading.Thread(target=start_consumer, daemon=True)
#     consumer_thread.start()
```

### Kafka Topic Naming Convention

**Format:** `lkern.{service}.{event_type}`

**Examples:**
- `lkern.contacts.created` - Contact created
- `lkern.contacts.updated` - Contact updated
- `lkern.contacts.deleted` - Contact deleted
- `lkern.orders.created` - Order created
- `lkern.orders.status_changed` - Order status changed
- `lkern.warehouse.stock_low` - Stock level below threshold
- `lkern.invoices.generated` - Invoice generated

**Rules:**
- ✅ Use lowercase with dots: `lkern.service.event`
- ✅ Use past tense for events: `created` not `create`
- ✅ Be specific: `stock_low` not `stock_event`
- ✅ Group by service: `lkern.{service}.*`

### Event Schema

**Standard event structure:**
```json
{
  "event_type": "ContactCreated",
  "event_id": "uuid-v4",
  "timestamp": "2025-10-15T14:30:00Z",
  "service": "lkms101-contacts",
  "version": "1.0",
  "data": {
    "contact_id": 123,
    "contact_name": "John Doe",
    "contact_email": "john@example.com"
  }
}
```

**Rules:**
- ✅ Include `event_type` for easy filtering
- ✅ Include `event_id` (UUID) for deduplication
- ✅ Include `timestamp` (ISO 8601) for ordering
- ✅ Include `service` for tracking event source
- ✅ Include `version` for schema evolution
- ✅ Put business data in `data` field

---

## 9. Testing Standards

### pytest (Backend)

**Test file structure:**
```
services/lkms101-contacts/
└── tests/
    ├── __init__.py
    ├── conftest.py           # Fixtures
    ├── test_api.py           # REST API tests
    ├── test_grpc.py          # gRPC tests
    ├── test_models.py        # Model tests
    └── test_services.py      # Business logic tests
```

**conftest.py - fixtures:**
```python
# tests/conftest.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.main import app
from fastapi.testclient import TestClient

# === TEST DATABASE ===
TEST_DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/test_lkms101_contacts"

@pytest.fixture(scope="function")
def db_session():
    # Create test database
    engine = create_engine(TEST_DATABASE_URL)
    Base.metadata.create_all(bind=engine)

    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSessionLocal()

    yield session

    session.close()
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()
```

**test_api.py - REST API tests:**
```python
# tests/test_api.py
import pytest
from app.schemas.contact import ContactCreate

def test_create_contact(client):
    response = client.post(
        "/api/v1/contacts/",
        json={
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "0901234567"
        }
    )

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "John Doe"
    assert data["email"] == "john@example.com"
    assert "id" in data

def test_get_contact(client, db_session):
    # Create contact
    from app.models.contact import Contact
    contact = Contact(name="Jane Doe", email="jane@example.com")
    db_session.add(contact)
    db_session.commit()

    # Get contact
    response = client.get(f"/api/v1/contacts/{contact.id}")

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Jane Doe"
    assert data["email"] == "jane@example.com"

def test_get_nonexistent_contact(client):
    response = client.get("/api/v1/contacts/99999")

    assert response.status_code == 404
    assert "not found" in response.json()["detail"]
```

### Vitest (Frontend)

**Test file structure:**
```
apps/web-ui/src/
└── pages/
    └── contacts/
        ├── ContactsPage.tsx
        └── ContactsPage.test.tsx
```

**ContactsPage.test.tsx:**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactsPage } from './ContactsPage';
import { contactsApi } from '../../api/contacts';

// Mock API
vi.mock('../../api/contacts', () => ({
  contactsApi: {
    getAll: vi.fn(),
    create: vi.fn()
  }
}));

describe('ContactsPage', () => {
  it('renders contacts list', async () => {
    const mockContacts = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com' }
    ];

    vi.mocked(contactsApi.getAll).mockResolvedValue(mockContacts);

    render(<ContactsPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });
  });

  it('creates new contact', async () => {
    const user = userEvent.setup();

    vi.mocked(contactsApi.create).mockResolvedValue({
      id: 3,
      name: 'New Contact',
      email: 'new@example.com'
    });

    render(<ContactsPage />);

    // Click "Add Contact" button
    await user.click(screen.getByText('Add Contact'));

    // Fill form
    await user.type(screen.getByLabelText('Name'), 'New Contact');
    await user.type(screen.getByLabelText('Email'), 'new@example.com');

    // Submit
    await user.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(contactsApi.create).toHaveBeenCalledWith({
        name: 'New Contact',
        email: 'new@example.com'
      });
    });
  });
});
```

**vitest.config.ts:**
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
      ]
    }
  }
});
```

---

## 10. Docker & DevOps

### Dockerfile Best Practices

**Multi-stage build for Python:**
```dockerfile
# === BUILDER STAGE ===
FROM python:3.11-slim as builder

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# === RUNTIME STAGE ===
FROM python:3.11-slim

WORKDIR /app

# Copy dependencies from builder
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

# Copy application
COPY . .

# Expose ports (REST + gRPC)
EXPOSE 4101 5101

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "4101", "--reload"]
```

**Multi-stage build for React:**
```dockerfile
# === BUILDER STAGE ===
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source and build
COPY . .
RUN yarn build

# === RUNTIME STAGE ===
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose Patterns

**Development docker-compose.yml:**
```yaml
version: '3.8'

services:
  # === WEB UI ===
  lkms201-web-ui:
    build:
      context: ./apps/web-ui
      dockerfile: Dockerfile.dev
    ports:
      - "4201:4201"
    volumes:
      - ./apps/web-ui:/app
      - /app/node_modules
    environment:
      - CHOKIDAR_USEPOLLING=true  # Hot-reload for Docker
    networks:
      - lkern-network

  # === CONTACTS SERVICE ===
  lkms101-contacts:
    build:
      context: ./services/lkms101-contacts
      dockerfile: Dockerfile.dev
    ports:
      - "4101:4101"  # REST API
      - "5101:5101"  # gRPC
    volumes:
      - ./services/lkms101-contacts:/app
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@lkms501-postgres:5432/lkms101_contacts
    depends_on:
      - lkms501-postgres
    networks:
      - lkern-network

  # === POSTGRESQL ===
  lkms501-postgres:
    image: postgres:15
    ports:
      - "4501:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_MULTIPLE_DATABASES=lkms101_contacts,lkms102_orders,lkms103_customers
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./infrastructure/docker/init-databases.sh:/docker-entrypoint-initdb.d/init-databases.sh
    networks:
      - lkern-network

  # === ADMINER ===
  lkms901-adminer:
    image: adminer:latest
    ports:
      - "4901:8080"
    environment:
      - ADMINER_DEFAULT_SERVER=lkms501-postgres
    networks:
      - lkern-network

volumes:
  postgres-data:

networks:
  lkern-network:
    driver: bridge
```

### Hot-reload Setup

**Vite (React) hot-reload:**
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 4201,
    watch: {
      usePolling: true  // REQUIRED for Docker hot-reload
    }
  }
});
```

**Environment variable:**
```yaml
# docker-compose.yml
environment:
  - CHOKIDAR_USEPOLLING=true  # Enable polling for file changes
```

**FastAPI hot-reload:**
```dockerfile
# Dockerfile.dev
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "4101", "--reload"]
```

---

## 11. DRY Principle & Code Reuse

### Componentization Rules

**MANDATORY for repeated code:**
- ✅ **Never copy-paste code** - If adding same/similar code in multiple places
- ✅ **Create shared package** - In monorepo create in `packages/` for shared components
- ✅ **Multiple apps = Shared package** - If component used in multiple `apps/`, must be in `packages/`
- ✅ **Function for logic** - Shared logic → `@l-kern/utils` package
- ✅ **Component for UI** - Shared UI elements → `@l-kern/ui-components` package

**Example - Creating shared utility:**
```typescript
// ❌ WRONG - Duplicated in multiple files
// apps/web-ui/src/pages/contacts/ContactsPage.tsx
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('sk-SK');
};

// apps/web-ui/src/pages/orders/OrdersPage.tsx
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('sk-SK');
};

// ✅ CORRECT - Shared utility
// packages/utils/src/formatDate.ts
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('sk-SK');
};

// Usage in both pages
import { formatDate } from '@l-kern/utils';
```

**Monorepo package location:**
```
packages/
├── ui-components/    # Shared React components
├── utils/            # Shared utilities
├── config/           # Configuration, constants, translations
└── shared-types/     # TypeScript types
```

### Anti-Duplication Audit

**MANDATORY before every code change:**
1. ✅ **Search for similar functionality** - Check if similar code exists
2. ✅ **Reuse over create** - If suitable function/component exists, use it
3. ✅ **Balance complexity** - If reuse complicates existing code too much, create new
4. ✅ **Component-first fixes** - Modify components instead of inline solutions
5. ✅ **Consistency** - If fonts/paddings were variables, keep them as variables

---

## 12. UI Standards

### Notifications

**NEVER use `alert()`:**
```typescript
// ❌ WRONG - Primitive and disruptive
alert("Success!");
confirm("Are you sure?");

// ✅ CORRECT - Use NotificationModal
import { useNotification } from '@l-kern/ui-components';

const MyComponent = () => {
  const { showSuccess, showError, showWarning } = useNotification();

  const handleSuccess = () => {
    showSuccess("Success", "Operation completed successfully");
  };

  const handleError = () => {
    showError("Error", "Something went wrong");
  };
};
```

**Features:**
- ✅ Auto-close after 3 seconds
- ✅ Click to close manually
- ✅ Type-based styling (success, error, warning, info)
- ✅ Non-blocking UX

---

## 13. Backup Workflow

### Automatic Backup Before Edits

**MANDATORY for all file modifications:**
- ✅ Create `.backup/` folder in directory where file is being modified
- ✅ Copy original file to `.backup/` with timestamp: `original_file_YYYYMMDD_HHMMSS.ext`
- ✅ Safety net for quick rollback if changes fail
- ✅ `.backup/` directory added to `.gitignore` and `.dockerignore`

**Backup script example:**
```bash
#!/bin/bash
# Create backup before editing

create_backup() {
    local file_path=$1
    local backup_dir=$(dirname "$file_path")/.backup/
    local filename=$(basename "$file_path")
    local timestamp=$(date +"%Y%m%d_%H%M%S")

    mkdir -p "$backup_dir"
    cp "$file_path" "$backup_dir/${filename%.*}_${timestamp}.${filename##*.}"

    echo "Backup created: $backup_dir/${filename%.*}_${timestamp}.${filename##*.}"
}

create_backup "ContactsPage.tsx"
```

---

## 14. Git Standards

### Commit Message Format

**Semantic commits:**
```bash
FEATURE: Add order validation with file system integration
FIX: Resolve Docker path mapping for L:\ drive volumes
UPDATE: Enhance modal template with loading states
REFACTOR: Consolidate duplicate API endpoint definitions
DOCS: Update ROADMAP.md with Phase 0 tasks
```

**Claude Code signature:**
```bash
git commit -m "$(cat <<'EOF'
FEATURE: Add comprehensive order management validation

- Implement real-time sequence number loading
- Add post-creation validation for database and file system
- Fix Docker path mapping for Windows L:\ drive integration
- Enhanced UI with ValidationResultModal component

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Summary

Tento dokument definuje **POVINNÉ** kódovacie štandardy pre L-KERN v4 projekt. Všetky pravidlá musia byť dodržané bez výnimky.

**Key takeaways:**
- ✅ Documentation-first approach
- ✅ File headers + code sectioning
- ✅ Constants extraction + documentation
- ✅ Python logging (not print)
- ✅ UI notifications (not alert)
- ✅ DRY principle (componentization)
- ✅ TypeScript strict mode
- ✅ FastAPI + SQLAlchemy + Alembic patterns
- ✅ gRPC for inter-service communication
- ✅ REST API for frontend-backend
- ✅ Testing (pytest + Vitest)
- ✅ Docker best practices

**Next steps:**
1. Read [code-examples.md](code-examples.md) for practical code templates
2. Check [ROADMAP.md](../ROADMAP.md) for current task priorities
3. Follow educational workflow for all development

---

**Last Updated**: 2025-10-15
**Maintainer**: BOSSystems s.r.o.
**Project**: L-KERN v4 (BOSS)