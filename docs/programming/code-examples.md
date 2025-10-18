# ================================================================
# L-KERN v4 - Code Examples
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\programming\code-examples.md
# Version: 1.0.0
# Created: 2025-10-15
# Updated: 2025-10-18
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Production-ready code examples for React, REST API, gRPC, FastAPI,
#   SQLAlchemy, forms, and testing patterns following coding standards.
# ================================================================

---

## 📋 Overview

Tento dokument obsahuje **praktické príklady kódu** pre L-KERN v4 projekt. Všetky príklady sú plne funkčné a dodržiavajú [coding-standards.md](coding-standards.md).

**Obsah:**
1. React Components - Frontend patterns
2. REST API Client - HTTP communication
3. gRPC Server & Client - Inter-service communication
4. FastAPI Routers - Backend endpoints
5. Database Operations - SQLAlchemy + Alembic
6. Form Handling - User input validation
7. Testing - pytest + Vitest examples

---

## 1. React Components

### 1.1 Basic Functional Component

```typescript
/*
 * ================================================================
 * FILE: ContactCard.tsx
 * PATH: /apps/web-ui/src/components/ContactCard.tsx
 * DESCRIPTION: Reusable contact card component
 * VERSION: v1.0.0
 * UPDATED: 2025-10-15 14:30:00
 * ================================================================
 */

// === IMPORTS ===
import React from 'react';
import { useTranslation, COLORS } from '@l-kern/config';

// === TYPES ===
interface ContactCardProps {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

// === COMPONENT ===
export const ContactCard: React.FC<ContactCardProps> = ({
  id,
  name,
  email,
  phone,
  isActive,
  onClick
}) => {
  const { t } = useTranslation();

  return (
    <div
      onClick={() => onClick(id)}
      style={{
        padding: '16px',
        border: `1px solid ${COLORS.BORDER}`,
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: isActive ? COLORS.WHITE : COLORS.DISABLED_BG
      }}
    >
      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
        {name}
      </h3>
      <p style={{ margin: '8px 0', fontSize: '14px', color: COLORS.TEXT_SECONDARY }}>
        {email}
      </p>
      {phone && (
        <p style={{ margin: 0, fontSize: '14px', color: COLORS.TEXT_MUTED }}>
          {phone}
        </p>
      )}
      <span
        style={{
          display: 'inline-block',
          marginTop: '8px',
          padding: '4px 8px',
          fontSize: '12px',
          borderRadius: '4px',
          backgroundColor: isActive ? COLORS.SUCCESS_BG : COLORS.ERROR_BG,
          color: isActive ? COLORS.SUCCESS : COLORS.ERROR
        }}
      >
        {isActive ? t('common.status.active') : t('common.status.inactive')}
      </span>
    </div>
  );
};
```

### 1.2 Component with State & API Call

```typescript
/*
 * ================================================================
 * FILE: ContactsPage.tsx
 * PATH: /apps/web-ui/src/pages/contacts/ContactsPage.tsx
 * DESCRIPTION: Contacts list page with CRUD operations
 * VERSION: v1.0.0
 * UPDATED: 2025-10-15 14:30:00
 * ================================================================
 */

// === IMPORTS ===
import React, { useState, useEffect } from 'react';
import { useTranslation } from '@l-kern/config';
import { contactsApi } from '../../api/contacts';
import { ContactCard } from '../../components/ContactCard';

// === TYPES ===
interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  is_active: boolean;
}

// === CONSTANTS ===
const PAGE_SIZE = 20;

// === COMPONENT ===
export const ContactsPage: React.FC = () => {
  const { t } = useTranslation();

  // === STATE ===
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  // === EFFECTS ===
  useEffect(() => {
    loadContacts();
  }, [page]);

  // === HANDLERS ===
  const loadContacts = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await contactsApi.getAll({
        skip: page * PAGE_SIZE,
        limit: PAGE_SIZE
      });
      setContacts(data);
    } catch (err: any) {
      setError(err.message || t('errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  const handleContactClick = (id: string) => {
    console.log('Contact clicked:', id);
    // Navigate to detail page
  };

  const handleNextPage = () => {
    setPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    setPage(prev => Math.max(0, prev - 1));
  };

  // === RENDER ===
  if (loading) {
    return <div>{t('common.loading')}</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>{t('contacts.title')}</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {contacts.map(contact => (
          <ContactCard
            key={contact.id}
            id={contact.id}
            name={contact.name}
            email={contact.email}
            phone={contact.phone}
            isActive={contact.is_active}
            onClick={handleContactClick}
          />
        ))}
      </div>

      <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
        <button onClick={handlePrevPage} disabled={page === 0}>
          {t('common.buttons.previous')}
        </button>
        <span>Page {page + 1}</span>
        <button onClick={handleNextPage}>
          {t('common.buttons.next')}
        </button>
      </div>
    </div>
  );
};
```

### 1.3 Custom Hook

```typescript
/*
 * ================================================================
 * FILE: useContacts.ts
 * PATH: /apps/web-ui/src/hooks/useContacts.ts
 * DESCRIPTION: Custom hook for contacts management
 * VERSION: v1.0.0
 * UPDATED: 2025-10-15 14:30:00
 * ================================================================
 */

// === IMPORTS ===
import { useState, useEffect, useCallback } from 'react';
import { contactsApi } from '../api/contacts';

// === TYPES ===
interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  is_active: boolean;
}

interface UseContactsReturn {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (data: Omit<Contact, 'id'>) => Promise<void>;
  update: (id: string, data: Partial<Contact>) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

// === HOOK ===
export const useContacts = (): UseContactsReturn => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load contacts on mount
  useEffect(() => {
    refresh();
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await contactsApi.getAll();
      setContacts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (data: Omit<Contact, 'id'>) => {
    try {
      const newContact = await contactsApi.create(data);
      setContacts(prev => [...prev, newContact]);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const update = useCallback(async (id: string, data: Partial<Contact>) => {
    try {
      const updatedContact = await contactsApi.update(id, data);
      setContacts(prev => prev.map(c => c.id === id ? updatedContact : c));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteContact = useCallback(async (id: string) => {
    try {
      await contactsApi.delete(id);
      setContacts(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    contacts,
    loading,
    error,
    refresh,
    create,
    update,
    delete: deleteContact
  };
};
```

---

## 2. REST API Client

### 2.1 Axios Client Setup

```typescript
/*
 * ================================================================
 * FILE: client.ts
 * PATH: /apps/web-ui/src/api/client.ts
 * DESCRIPTION: Axios client with auth interceptor
 * VERSION: v1.0.0
 * UPDATED: 2025-10-15 14:30:00
 * ================================================================
 */

// === IMPORTS ===
import axios, { AxiosError, AxiosResponse } from 'axios';
import { PORTS } from '@l-kern/config';

// === CONSTANTS ===
const API_BASE_URL = `http://localhost:${PORTS.CONTACTS_REST}`;
const REQUEST_TIMEOUT = 5000; // 5 seconds

// === CLIENT SETUP ===
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// === REQUEST INTERCEPTOR ===
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// === RESPONSE INTERCEPTOR ===
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`[API] Response ${response.status} from ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.error('[API] Unauthorized - redirecting to login');
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('[API] Resource not found');
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error('[API] Server error');
    }

    return Promise.reject(error);
  }
);

// === EXPORTS ===
export default apiClient;
```

### 2.2 API Service Implementation

```typescript
/*
 * ================================================================
 * FILE: contacts.ts
 * PATH: /apps/web-ui/src/api/contacts.ts
 * DESCRIPTION: Contacts API service
 * VERSION: v1.0.0
 * UPDATED: 2025-10-15 14:30:00
 * ================================================================
 */

// === IMPORTS ===
import apiClient from './client';

// === TYPES ===
interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

interface ContactCreate {
  name: string;
  email: string;
  phone?: string;
}

interface ContactUpdate {
  name?: string;
  email?: string;
  phone?: string;
  is_active?: boolean;
}

interface GetAllParams {
  skip?: number;
  limit?: number;
  is_active?: boolean;
}

// === API SERVICE ===
export const contactsApi = {
  /**
   * Get all contacts with optional filtering
   */
  getAll: async (params?: GetAllParams): Promise<Contact[]> => {
    const response = await apiClient.get('/api/v1/contacts', { params });
    return response.data;
  },

  /**
   * Get contact by ID
   */
  getById: async (id: string): Promise<Contact> => {
    const response = await apiClient.get(`/api/v1/contacts/${id}`);
    return response.data;
  },

  /**
   * Create new contact
   */
  create: async (data: ContactCreate): Promise<Contact> => {
    const response = await apiClient.post('/api/v1/contacts', data);
    return response.data;
  },

  /**
   * Update existing contact
   */
  update: async (id: string, data: ContactUpdate): Promise<Contact> => {
    const response = await apiClient.put(`/api/v1/contacts/${id}`, data);
    return response.data;
  },

  /**
   * Delete contact
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/contacts/${id}`);
  },

  /**
   * Search contacts by query
   */
  search: async (query: string): Promise<Contact[]> => {
    const response = await apiClient.get('/api/v1/contacts/search', {
      params: { q: query }
    });
    return response.data;
  }
};
```

---

## 3. gRPC Server & Client

### 3.1 .proto File Definition

```protobuf
/*
 * ================================================================
 * FILE: contacts.proto
 * PATH: /services/lkms101-contacts/proto/contacts.proto
 * DESCRIPTION: gRPC service definition for Contacts
 * VERSION: v1.0.0
 * UPDATED: 2025-10-15 14:30:00
 * ================================================================
 */

syntax = "proto3";

package contacts;

// === MESSAGES ===

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

message CheckEmailExistsRequest {
  string email = 1;
  int32 exclude_id = 2;  // Exclude this ID from check (for updates)
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

message CheckEmailExistsResponse {
  bool exists = 1;
  int32 existing_contact_id = 2;
}

// === SERVICE DEFINITION ===
service ContactsService {
  // Get single contact by ID
  rpc GetContact (GetContactRequest) returns (GetContactResponse);

  // Get multiple contacts by IDs
  rpc GetContactsByIds (GetContactsByIdsRequest) returns (GetContactsByIdsResponse);

  // Validate contact exists and is active
  rpc ValidateContact (ValidateContactRequest) returns (ValidateContactResponse);

  // Check if email already exists
  rpc CheckEmailExists (CheckEmailExistsRequest) returns (CheckEmailExistsResponse);
}
```

### 3.2 gRPC Server Implementation (Python)

```python
"""
================================================================
FILE: contacts_servicer.py
PATH: /services/lkms101-contacts/app/grpc/contacts_servicer.py
DESCRIPTION: gRPC servicer implementation for Contacts
VERSION: v1.0.0
UPDATED: 2025-10-15 14:30:00
================================================================
"""

# === IMPORTS ===
import grpc
from app.grpc import contacts_pb2, contacts_pb2_grpc
from app.database import SessionLocal
from app.models.contact import Contact
import logging

# === LOGGING ===
logger = logging.getLogger(__name__)

# === SERVICER ===
class ContactsServicer(contacts_pb2_grpc.ContactsServiceServicer):
    """gRPC servicer for Contacts service."""

    def GetContact(self, request, context):
        """Get single contact by ID."""
        db = SessionLocal()
        try:
            logger.info(f"gRPC GetContact called with id={request.id}")

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
                    is_active=contact.is_active,
                    created_at=contact.created_at.isoformat(),
                    updated_at=contact.updated_at.isoformat() if contact.updated_at else ""
                )
            )
        except Exception as e:
            logger.error(f"Error in GetContact: {str(e)}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details('Internal server error')
            return contacts_pb2.GetContactResponse()
        finally:
            db.close()

    def GetContactsByIds(self, request, context):
        """Get multiple contacts by IDs."""
        db = SessionLocal()
        try:
            logger.info(f"gRPC GetContactsByIds called with ids={request.ids}")

            contacts = db.query(Contact).filter(Contact.id.in_(request.ids)).all()

            contact_messages = []
            for contact in contacts:
                contact_messages.append(
                    contacts_pb2.Contact(
                        id=contact.id,
                        name=contact.name,
                        email=contact.email,
                        phone=contact.phone or "",
                        is_active=contact.is_active,
                        created_at=contact.created_at.isoformat(),
                        updated_at=contact.updated_at.isoformat() if contact.updated_at else ""
                    )
                )

            return contacts_pb2.GetContactsByIdsResponse(contacts=contact_messages)
        except Exception as e:
            logger.error(f"Error in GetContactsByIds: {str(e)}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details('Internal server error')
            return contacts_pb2.GetContactsByIdsResponse()
        finally:
            db.close()

    def ValidateContact(self, request, context):
        """Validate contact exists and is active."""
        db = SessionLocal()
        try:
            logger.info(f"gRPC ValidateContact called with id={request.id}")

            contact = db.query(Contact).filter(Contact.id == request.id).first()

            if not contact:
                return contacts_pb2.ValidateContactResponse(
                    is_valid=False,
                    error_message=f"Contact with id {request.id} not found"
                )

            if not contact.is_active:
                return contacts_pb2.ValidateContactResponse(
                    is_valid=False,
                    error_message=f"Contact with id {request.id} is inactive"
                )

            return contacts_pb2.ValidateContactResponse(
                is_valid=True,
                error_message=""
            )
        except Exception as e:
            logger.error(f"Error in ValidateContact: {str(e)}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details('Internal server error')
            return contacts_pb2.ValidateContactResponse(
                is_valid=False,
                error_message="Internal server error"
            )
        finally:
            db.close()

    def CheckEmailExists(self, request, context):
        """Check if email already exists."""
        db = SessionLocal()
        try:
            logger.info(f"gRPC CheckEmailExists called with email={request.email}")

            query = db.query(Contact).filter(Contact.email == request.email)

            # Exclude specific ID (for update operations)
            if request.exclude_id > 0:
                query = query.filter(Contact.id != request.exclude_id)

            existing_contact = query.first()

            if existing_contact:
                return contacts_pb2.CheckEmailExistsResponse(
                    exists=True,
                    existing_contact_id=existing_contact.id
                )

            return contacts_pb2.CheckEmailExistsResponse(
                exists=False,
                existing_contact_id=0
            )
        except Exception as e:
            logger.error(f"Error in CheckEmailExists: {str(e)}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details('Internal server error')
            return contacts_pb2.CheckEmailExistsResponse(exists=False, existing_contact_id=0)
        finally:
            db.close()
```

### 3.3 gRPC Server Startup

```python
"""
================================================================
FILE: grpc_server.py
PATH: /services/lkms101-contacts/app/grpc/grpc_server.py
DESCRIPTION: gRPC server startup
VERSION: v1.0.0
UPDATED: 2025-10-15 14:30:00
================================================================
"""

# === IMPORTS ===
import grpc
from concurrent import futures
import logging
from app.grpc import contacts_pb2_grpc
from app.grpc.contacts_servicer import ContactsServicer

# === LOGGING ===
logger = logging.getLogger(__name__)

# === CONSTANTS ===
GRPC_PORT = "0.0.0.0:5101"
MAX_WORKERS = 10

# === SERVER ===
def serve():
    """Start gRPC server."""
    logger.info("Starting gRPC server...")

    # Create server with thread pool
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=MAX_WORKERS))

    # Register servicer
    contacts_pb2_grpc.add_ContactsServiceServicer_to_server(
        ContactsServicer(),
        server
    )

    # Listen on port
    server.add_insecure_port(GRPC_PORT)

    logger.info(f"gRPC server listening on {GRPC_PORT}")
    server.start()
    server.wait_for_termination()

# === MAIN ===
if __name__ == '__main__':
    serve()
```

### 3.4 gRPC Client Implementation (Python)

```python
"""
================================================================
FILE: contacts_client.py
PATH: /services/lkms102-orders/app/grpc/clients/contacts_client.py
DESCRIPTION: gRPC client for Contacts service
VERSION: v1.0.0
UPDATED: 2025-10-15 14:30:00
================================================================
"""

# === IMPORTS ===
import grpc
from app.grpc import contacts_pb2, contacts_pb2_grpc
import logging

# === LOGGING ===
logger = logging.getLogger(__name__)

# === CONSTANTS ===
CONTACTS_SERVICE_HOST = 'lkms101-contacts:5101'

# === CLIENT ===
class ContactsClient:
    """gRPC client for Contacts service."""

    def __init__(self, host: str = CONTACTS_SERVICE_HOST):
        self.channel = grpc.insecure_channel(host)
        self.stub = contacts_pb2_grpc.ContactsServiceStub(self.channel)

    def get_contact(self, contact_id: int):
        """Get contact by ID via gRPC."""
        try:
            request = contacts_pb2.GetContactRequest(id=contact_id)
            response = self.stub.GetContact(request)
            return response.contact
        except grpc.RpcError as e:
            logger.error(f"gRPC error: {e.code()} - {e.details()}")
            return None

    def get_contacts_by_ids(self, contact_ids: list[int]):
        """Get multiple contacts by IDs via gRPC."""
        try:
            request = contacts_pb2.GetContactsByIdsRequest(ids=contact_ids)
            response = self.stub.GetContactsByIds(request)
            return response.contacts
        except grpc.RpcError as e:
            logger.error(f"gRPC error: {e.code()} - {e.details()}")
            return []

    def validate_contact(self, contact_id: int):
        """Validate contact exists and is active."""
        try:
            request = contacts_pb2.ValidateContactRequest(id=contact_id)
            response = self.stub.ValidateContact(request)
            return response.is_valid, response.error_message
        except grpc.RpcError as e:
            logger.error(f"gRPC error: {e.code()} - {e.details()}")
            return False, f"gRPC error: {e.details()}"

    def check_email_exists(self, email: str, exclude_id: int = 0):
        """Check if email already exists in database."""
        try:
            request = contacts_pb2.CheckEmailExistsRequest(
                email=email,
                exclude_id=exclude_id
            )
            response = self.stub.CheckEmailExists(request)
            return response.exists, response.existing_contact_id
        except grpc.RpcError as e:
            logger.error(f"gRPC error: {e.code()} - {e.details()}")
            return False, 0

    def close(self):
        """Close gRPC channel."""
        self.channel.close()

# === USAGE EXAMPLE ===
def example_usage():
    """Example usage of ContactsClient."""
    client = ContactsClient()

    # Get single contact
    contact = client.get_contact(contact_id=1)
    if contact:
        print(f"Contact: {contact.name} ({contact.email})")

    # Get multiple contacts
    contacts = client.get_contacts_by_ids([1, 2, 3])
    for contact in contacts:
        print(f"Contact: {contact.name}")

    # Validate contact
    is_valid, error = client.validate_contact(contact_id=1)
    if is_valid:
        print("Contact is valid")
    else:
        print(f"Contact invalid: {error}")

    # Check email exists
    exists, existing_id = client.check_email_exists("john@example.com")
    if exists:
        print(f"Email exists for contact ID {existing_id}")

    client.close()
```

---

## 4. FastAPI Routers

### 4.1 Complete CRUD Router

```python
"""
================================================================
FILE: contacts.py
PATH: /services/lkms101-contacts/app/routers/contacts.py
DESCRIPTION: REST API router for contacts CRUD operations
VERSION: v1.0.0
UPDATED: 2025-10-15 14:30:00
================================================================
"""

# === IMPORTS ===
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
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

# === ENDPOINTS ===

@router.get("/", response_model=List[ContactResponse])
async def get_contacts(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """
    Get list of contacts with optional filtering.

    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    - **is_active**: Filter by active status (optional)
    """
    logger.info(f"GET /contacts - skip={skip}, limit={limit}, is_active={is_active}")

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
    logger.info(f"GET /contacts/{contact_id}")

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
    logger.info(f"POST /contacts - name={contact.name}, email={contact.email}")

    # Check if email already exists
    existing = db.query(Contact).filter(Contact.email == contact.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Contact with this email already exists"
        )

    # Create contact
    db_contact = Contact(**contact.dict())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)

    logger.info(f"Contact created with id={db_contact.id}")
    return db_contact


@router.put("/{contact_id}", response_model=ContactResponse)
async def update_contact(
    contact_id: int,
    contact: ContactUpdate,
    db: Session = Depends(get_db)
):
    """Update contact."""
    logger.info(f"PUT /contacts/{contact_id}")

    # Find contact
    db_contact = db.query(Contact).filter(Contact.id == contact_id).first()

    if not db_contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contact with id {contact_id} not found"
        )

    # Check email uniqueness (if email is being updated)
    if contact.email and contact.email != db_contact.email:
        existing = db.query(Contact).filter(Contact.email == contact.email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Contact with this email already exists"
            )

    # Update only provided fields
    update_data = contact.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_contact, field, value)

    db.commit()
    db.refresh(db_contact)

    logger.info(f"Contact {contact_id} updated")
    return db_contact


@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_contact(
    contact_id: int,
    db: Session = Depends(get_db)
):
    """Delete contact."""
    logger.info(f"DELETE /contacts/{contact_id}")

    db_contact = db.query(Contact).filter(Contact.id == contact_id).first()

    if not db_contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contact with id {contact_id} not found"
        )

    db.delete(db_contact)
    db.commit()

    logger.info(f"Contact {contact_id} deleted")


@router.get("/search/", response_model=List[ContactResponse])
async def search_contacts(
    q: str = Query(..., min_length=1),
    db: Session = Depends(get_db)
):
    """
    Search contacts by name or email.

    - **q**: Search query (minimum 1 character)
    """
    logger.info(f"GET /contacts/search - q={q}")

    # Search by name or email (case-insensitive)
    search_pattern = f"%{q}%"
    contacts = db.query(Contact).filter(
        (Contact.name.ilike(search_pattern)) |
        (Contact.email.ilike(search_pattern))
    ).limit(50).all()

    return contacts
```

---

## 5. Database Operations

### 5.1 SQLAlchemy Model

```python
"""
================================================================
FILE: contact.py
PATH: /services/lkms101-contacts/app/models/contact.py
DESCRIPTION: SQLAlchemy model for Contact
VERSION: v1.0.0
UPDATED: 2025-10-15 14:30:00
================================================================
"""

# === IMPORTS ===
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from app.database import Base

# === MODEL ===
class Contact(Base):
    """Contact model for database."""

    __tablename__ = "contacts"

    # === PRIMARY KEY ===
    id = Column(Integer, primary_key=True, index=True)

    # === FIELDS ===
    name = Column(String(255), nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(50), nullable=True)
    address = Column(Text, nullable=True)
    ico = Column(String(20), nullable=True)  # Company registration number
    dic = Column(String(20), nullable=True)  # Tax ID
    is_active = Column(Boolean, default=True, nullable=False)

    # === TIMESTAMPS ===
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        onupdate=func.now(),
        nullable=True
    )

    # === METHODS ===
    def __repr__(self):
        return f"<Contact(id={self.id}, name='{self.name}', email='{self.email}')>"
```

### 5.2 Pydantic Schemas

```python
"""
================================================================
FILE: contact.py
PATH: /services/lkms101-contacts/app/schemas/contact.py
DESCRIPTION: Pydantic schemas for Contact validation
VERSION: v1.0.0
UPDATED: 2025-10-15 14:30:00
================================================================
"""

# === IMPORTS ===
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
from typing import Optional

# === BASE SCHEMA ===
class ContactBase(BaseModel):
    """Base schema with common fields."""
    name: str = Field(..., min_length=1, max_length=255, description="Contact name")
    email: EmailStr = Field(..., description="Contact email address")
    phone: Optional[str] = Field(None, max_length=50, description="Phone number")
    address: Optional[str] = Field(None, description="Physical address")
    ico: Optional[str] = Field(None, max_length=20, description="Company registration number")
    dic: Optional[str] = Field(None, max_length=20, description="Tax ID")

    @validator('phone')
    def validate_phone(cls, v):
        """Validate phone number format."""
        if v is None:
            return v

        # Remove spaces and dashes
        digits = ''.join(c for c in v if c.isdigit() or c == '+')

        # Check minimum length
        if len(digits) < 3:
            raise ValueError('Phone number must contain at least 3 digits')

        return v

    @validator('ico')
    def validate_ico(cls, v):
        """Validate ICO format (Slovak company registration number)."""
        if v is None:
            return v

        # Remove spaces
        ico_clean = v.replace(' ', '')

        # Check if digits only
        if not ico_clean.isdigit():
            raise ValueError('ICO must contain only digits')

        # Check length (Slovak ICO is 8 digits)
        if len(ico_clean) != 8:
            raise ValueError('ICO must be 8 digits')

        return ico_clean

# === CREATE SCHEMA ===
class ContactCreate(ContactBase):
    """Schema for creating new contact."""
    pass

# === UPDATE SCHEMA ===
class ContactUpdate(BaseModel):
    """Schema for updating contact (all fields optional)."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=50)
    address: Optional[str] = None
    ico: Optional[str] = Field(None, max_length=20)
    dic: Optional[str] = Field(None, max_length=20)
    is_active: Optional[bool] = None

# === RESPONSE SCHEMA ===
class ContactResponse(ContactBase):
    """Schema for contact response (includes ID and timestamps)."""
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # Pydantic v2 (was orm_mode in v1)
```

### 5.3 Alembic Migration

```python
"""create contacts table

Revision ID: 001_create_contacts
Revises:
Create Date: 2025-10-15 14:30:00
"""

# === IMPORTS ===
from alembic import op
import sqlalchemy as sa

# === REVISION IDENTIFIERS ===
revision = '001_create_contacts'
down_revision = None
branch_labels = None
depends_on = None

# === UPGRADE ===
def upgrade():
    """Create contacts table."""
    op.create_table(
        'contacts',
        # Primary key
        sa.Column('id', sa.Integer(), nullable=False),

        # Fields
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('phone', sa.String(50), nullable=True),
        sa.Column('address', sa.Text(), nullable=True),
        sa.Column('ico', sa.String(20), nullable=True),
        sa.Column('dic', sa.String(20), nullable=True),
        sa.Column('is_active', sa.Boolean(), default=True, nullable=False),

        # Timestamps
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.func.now(), nullable=True),

        # Constraints
        sa.PrimaryKeyConstraint('id')
    )

    # Create indexes
    op.create_index('ix_contacts_name', 'contacts', ['name'])
    op.create_index('ix_contacts_email', 'contacts', ['email'], unique=True)


# === DOWNGRADE ===
def downgrade():
    """Drop contacts table."""
    op.drop_index('ix_contacts_email', 'contacts')
    op.drop_index('ix_contacts_name', 'contacts')
    op.drop_table('contacts')
```

---

## 6. Form Handling

### 6.1 Form Component with Validation

```typescript
/*
 * ================================================================
 * FILE: ContactForm.tsx
 * PATH: /apps/web-ui/src/components/ContactForm.tsx
 * DESCRIPTION: Contact form with validation
 * VERSION: v1.0.0
 * UPDATED: 2025-10-15 14:30:00
 * ================================================================
 */

// === IMPORTS ===
import React, { useState } from 'react';
import { useTranslation } from '@l-kern/config';
import { contactsApi } from '../api/contacts';

// === TYPES ===
interface ContactFormProps {
  initialData?: {
    id?: string;
    name: string;
    email: string;
    phone?: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

// === COMPONENT ===
export const ContactForm: React.FC<ContactFormProps> = ({
  initialData,
  onSuccess,
  onCancel
}) => {
  const { t } = useTranslation();

  // === STATE ===
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // === VALIDATION ===
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = t('validation.required');
    } else if (formData.name.length < 2) {
      newErrors.name = t('validation.minLength', { min: 2 });
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = t('validation.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation.invalidEmail');
    }

    // Phone validation (optional)
    if (formData.phone && formData.phone.length < 3) {
      newErrors.phone = t('validation.invalidPhone');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // === HANDLERS ===
  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      if (initialData?.id) {
        // Update existing contact
        await contactsApi.update(initialData.id, formData);
      } else {
        // Create new contact
        await contactsApi.create(formData);
      }

      onSuccess();
    } catch (err: any) {
      // Handle API errors
      if (err.response?.status === 400) {
        setErrors({ email: t('errors.emailExists') });
      } else {
        alert(t('errors.generic'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  // === RENDER ===
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Name Field */}
      <div>
        <label htmlFor="name" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
          {t('contacts.fields.name')} *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={handleChange('name')}
          disabled={submitting}
          style={{
            width: '100%',
            padding: '8px',
            border: errors.name ? '1px solid red' : '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        {errors.name && (
          <span style={{ color: 'red', fontSize: '12px' }}>{errors.name}</span>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
          {t('contacts.fields.email')} *
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          disabled={submitting}
          style={{
            width: '100%',
            padding: '8px',
            border: errors.email ? '1px solid red' : '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        {errors.email && (
          <span style={{ color: 'red', fontSize: '12px' }}>{errors.email}</span>
        )}
      </div>

      {/* Phone Field */}
      <div>
        <label htmlFor="phone" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
          {t('contacts.fields.phone')}
        </label>
        <input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange('phone')}
          disabled={submitting}
          style={{
            width: '100%',
            padding: '8px',
            border: errors.phone ? '1px solid red' : '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        {errors.phone && (
          <span style={{ color: 'red', fontSize: '12px' }}>{errors.phone}</span>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          style={{
            padding: '8px 16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
        >
          {t('common.buttons.cancel')}
        </button>
        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#2196F3',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          {submitting ? t('common.loading') : t('common.buttons.save')}
        </button>
      </div>
    </form>
  );
};
```

---

## 7. Testing

### 7.1 Backend Testing (pytest)

```python
"""
================================================================
FILE: test_contacts_api.py
PATH: /services/lkms101-contacts/tests/test_contacts_api.py
DESCRIPTION: REST API tests for Contacts service
VERSION: v1.0.0
UPDATED: 2025-10-15 14:30:00
================================================================
"""

# === IMPORTS ===
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.contact import Contact

# === CLIENT ===
client = TestClient(app)

# === TESTS ===

def test_create_contact(db_session):
    """Test creating new contact."""
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
    assert data["phone"] == "0901234567"
    assert "id" in data
    assert data["is_active"] is True


def test_create_contact_duplicate_email(db_session):
    """Test creating contact with duplicate email fails."""
    # Create first contact
    client.post(
        "/api/v1/contacts/",
        json={
            "name": "John Doe",
            "email": "john@example.com"
        }
    )

    # Try to create second contact with same email
    response = client.post(
        "/api/v1/contacts/",
        json={
            "name": "Jane Doe",
            "email": "john@example.com"
        }
    )

    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]


def test_get_contact(db_session):
    """Test getting contact by ID."""
    # Create contact
    contact = Contact(name="Jane Doe", email="jane@example.com")
    db_session.add(contact)
    db_session.commit()

    # Get contact
    response = client.get(f"/api/v1/contacts/{contact.id}")

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == contact.id
    assert data["name"] == "Jane Doe"
    assert data["email"] == "jane@example.com"


def test_get_nonexistent_contact(db_session):
    """Test getting nonexistent contact returns 404."""
    response = client.get("/api/v1/contacts/99999")

    assert response.status_code == 404
    assert "not found" in response.json()["detail"]


def test_update_contact(db_session):
    """Test updating contact."""
    # Create contact
    contact = Contact(name="Old Name", email="old@example.com")
    db_session.add(contact)
    db_session.commit()

    # Update contact
    response = client.put(
        f"/api/v1/contacts/{contact.id}",
        json={
            "name": "New Name",
            "email": "new@example.com"
        }
    )

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "New Name"
    assert data["email"] == "new@example.com"


def test_delete_contact(db_session):
    """Test deleting contact."""
    # Create contact
    contact = Contact(name="To Delete", email="delete@example.com")
    db_session.add(contact)
    db_session.commit()
    contact_id = contact.id

    # Delete contact
    response = client.delete(f"/api/v1/contacts/{contact_id}")

    assert response.status_code == 204

    # Verify contact is deleted
    response = client.get(f"/api/v1/contacts/{contact_id}")
    assert response.status_code == 404


def test_search_contacts(db_session):
    """Test searching contacts."""
    # Create test contacts
    db_session.add(Contact(name="John Doe", email="john@example.com"))
    db_session.add(Contact(name="Jane Doe", email="jane@example.com"))
    db_session.add(Contact(name="Bob Smith", email="bob@example.com"))
    db_session.commit()

    # Search by name
    response = client.get("/api/v1/contacts/search/?q=Doe")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert all("Doe" in contact["name"] for contact in data)


def test_list_contacts_pagination(db_session):
    """Test listing contacts with pagination."""
    # Create 15 contacts
    for i in range(15):
        db_session.add(Contact(
            name=f"Contact {i}",
            email=f"contact{i}@example.com"
        ))
    db_session.commit()

    # Get first page (10 items)
    response = client.get("/api/v1/contacts/?skip=0&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 10

    # Get second page (5 items)
    response = client.get("/api/v1/contacts/?skip=10&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 5
```

### 7.2 Frontend Testing (Vitest)

```typescript
/*
 * ================================================================
 * FILE: ContactsPage.test.tsx
 * PATH: /apps/web-ui/src/pages/contacts/ContactsPage.test.tsx
 * DESCRIPTION: Tests for ContactsPage component
 * VERSION: v1.0.0
 * UPDATED: 2025-10-15 14:30:00
 * ================================================================
 */

// === IMPORTS ===
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactsPage } from './ContactsPage';
import { contactsApi } from '../../api/contacts';

// === MOCKS ===
vi.mock('../../api/contacts', () => ({
  contactsApi: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}));

// === TEST SUITE ===
describe('ContactsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders contacts list', async () => {
    // Mock data
    const mockContacts = [
      { id: '1', name: 'John Doe', email: 'john@example.com', is_active: true },
      { id: '2', name: 'Jane Doe', email: 'jane@example.com', is_active: true }
    ];

    vi.mocked(contactsApi.getAll).mockResolvedValue(mockContacts);

    // Render component
    render(<ContactsPage />);

    // Wait for contacts to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });

    // Verify API was called
    expect(contactsApi.getAll).toHaveBeenCalledTimes(1);
  });

  it('displays loading state', () => {
    vi.mocked(contactsApi.getAll).mockImplementation(() =>
      new Promise(() => {}) // Never resolves
    );

    render(<ContactsPage />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays error state', async () => {
    vi.mocked(contactsApi.getAll).mockRejectedValue(new Error('API Error'));

    render(<ContactsPage />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('creates new contact', async () => {
    const user = userEvent.setup();

    // Mock empty list initially
    vi.mocked(contactsApi.getAll).mockResolvedValue([]);

    // Mock create response
    vi.mocked(contactsApi.create).mockResolvedValue({
      id: '3',
      name: 'New Contact',
      email: 'new@example.com',
      is_active: true
    });

    render(<ContactsPage />);

    // Wait for page to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Click "Add Contact" button
    const addButton = screen.getByText(/add contact/i);
    await user.click(addButton);

    // Fill form
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);

    await user.type(nameInput, 'New Contact');
    await user.type(emailInput, 'new@example.com');

    // Submit form
    const saveButton = screen.getByText(/save/i);
    await user.click(saveButton);

    // Verify API was called
    await waitFor(() => {
      expect(contactsApi.create).toHaveBeenCalledWith({
        name: 'New Contact',
        email: 'new@example.com'
      });
    });
  });

  it('handles pagination', async () => {
    const user = userEvent.setup();

    // Mock first page
    const page1 = [
      { id: '1', name: 'Contact 1', email: 'c1@example.com', is_active: true }
    ];

    // Mock second page
    const page2 = [
      { id: '2', name: 'Contact 2', email: 'c2@example.com', is_active: true }
    ];

    vi.mocked(contactsApi.getAll)
      .mockResolvedValueOnce(page1)
      .mockResolvedValueOnce(page2);

    render(<ContactsPage />);

    // Wait for first page
    await waitFor(() => {
      expect(screen.getByText('Contact 1')).toBeInTheDocument();
    });

    // Click "Next" button
    const nextButton = screen.getByText(/next/i);
    await user.click(nextButton);

    // Wait for second page
    await waitFor(() => {
      expect(screen.getByText('Contact 2')).toBeInTheDocument();
    });

    // Verify API was called twice with different skip values
    expect(contactsApi.getAll).toHaveBeenCalledTimes(2);
    expect(contactsApi.getAll).toHaveBeenNthCalledWith(1, { skip: 0, limit: 20 });
    expect(contactsApi.getAll).toHaveBeenNthCalledWith(2, { skip: 20, limit: 20 });
  });
});
```

---

## Summary

Tento dokument poskytuje **komplexné praktické príklady** pre všetky hlavné oblasti L-KERN v4 projektu:

✅ **React Components** - Functional components, hooks, state management
✅ **REST API Client** - Axios setup, interceptors, API services
✅ **gRPC** - .proto files, server/client implementation
✅ **FastAPI Routers** - Complete CRUD operations
✅ **Database** - SQLAlchemy models, Pydantic schemas, Alembic migrations
✅ **Form Handling** - Validation, error handling, submission
✅ **Testing** - pytest (backend) + Vitest (frontend)

**Použitie:**
- Kopíruj príklady ako šablóny pre nové funkcie
- Dodržuj rovnaké patterns a štruktúry
- Všetky príklady sú production-ready

**Ďalšie kroky:**
1. Použiť príklady pri implementácii Task 0.2 (@l-kern/ui-components)
2. Použiť príklady pri implementácii Task 0.4 (lkms101-contacts service)

---

**Last Updated**: 2025-10-15
**Maintainer**: BOSSystems s.r.o.
**Project**: L-KERN v4 (BOSS)
