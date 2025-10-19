# ================================================================
# L-KERN v4 - Integration Testing Guide
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\programming\testing-integration.md
# Version: 1.0.0
# Created: 2025-10-19
# Updated: 2025-10-19
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Comprehensive guide for integration testing in L-KERN v4. Covers
#   frontend integration tests (components + API stubs with MSW) and
#   backend integration tests (FastAPI + test database).
# ================================================================

---

## 📋 Overview

**What is Integration Testing?**

Integration testing tests **how multiple parts work together**. Unlike unit tests (which test in complete isolation), integration tests verify that components, APIs, and services interact correctly.

**Types of Integration Tests in L-KERN v4:**

1. **Frontend Integration** - Components + API stubs (MSW)
2. **Backend Integration** - API endpoints + Test database
3. **Component Integration** - Parent + Child components

**When to Use Integration Tests:**
- ✅ Components that fetch data from APIs
- ✅ Forms that submit data to backend
- ✅ Multi-step wizards (Modal + Form + Validation)
- ✅ API endpoints that interact with database
- ✅ Parent components with multiple children

**When NOT to Use Integration Tests:**
- ❌ Pure functions (use unit tests)
- ❌ Complete user flows across pages (use E2E tests)
- ❌ Simple components without API interaction (use unit tests)

---

## ⚡ Quick Start

### Frontend (Vitest + MSW)

**Run tests:**
```bash
# All integration tests
npm run test

# Watch mode
npm run test:watch

# Single file
npm run test ContactForm.test.tsx

# Coverage
npm run test:coverage
```

**Example:**
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from './ContactForm';

test('submits form data to API', async () => {
  render(<ContactForm />);

  await userEvent.type(screen.getByLabelText('Name'), 'John Doe');
  await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
  await userEvent.click(screen.getByText('Save'));

  // MSW intercepts API call
  await waitFor(() => {
    expect(screen.getByText('Contact saved')).toBeInTheDocument();
  });
});
```

---

### Backend (pytest + TestClient)

**Run tests:**
```bash
# All integration tests
pytest tests/test_contact_api.py

# Verbose
pytest -v tests/test_contact_api.py

# Coverage
pytest --cov=app tests/test_contact_api.py

# Docker
docker exec lkms101-contacts pytest tests/test_contact_api.py
```

**Example:**
```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_contact_success():
    response = client.post(
        "/api/v1/contacts",
        json={"name": "John Doe", "email": "john@example.com"}
    )

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "John Doe"
    assert "id" in data  # Database generated ID
```

---

## 🎯 Frontend Integration Testing

### MSW (Mock Service Worker) Setup

**Why MSW?**
- ✅ Intercepts network requests at browser level
- ✅ No need to modify component code for testing
- ✅ Works with any HTTP client (fetch, axios)
- ✅ Can be reused for Storybook and manual testing

**Installation:**
```bash
cd apps/web-ui
npm install -D msw
```

---

### Step 1: Create API Mock Handlers

**File: `src/test/mocks/handlers.ts`**

```typescript
/*
 * ================================================================
 * FILE: handlers.ts
 * PATH: /apps/web-ui/src/test/mocks/handlers.ts
 * DESCRIPTION: MSW API mock handlers for integration tests
 * VERSION: v1.0.0
 * UPDATED: 2025-10-19 12:00:00
 * ================================================================
 */

import { http, HttpResponse } from 'msw';

// API base URL
const API_BASE = 'http://localhost:8101/api/v1';

// Mock data
let mockContacts = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+421900123456' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+421900654321' },
];

export const handlers = [
  // ========================================
  // GET /api/v1/contacts - List all contacts
  // ========================================
  http.get(`${API_BASE}/contacts`, () => {
    return HttpResponse.json({
      data: mockContacts,
      total: mockContacts.length,
    });
  }),

  // ========================================
  // GET /api/v1/contacts/:id - Get single contact
  // ========================================
  http.get(`${API_BASE}/contacts/:id`, ({ params }) => {
    const { id } = params;
    const contact = mockContacts.find((c) => c.id === Number(id));

    if (!contact) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Contact not found',
      });
    }

    return HttpResponse.json(contact);
  }),

  // ========================================
  // POST /api/v1/contacts - Create contact
  // ========================================
  http.post(`${API_BASE}/contacts`, async ({ request }) => {
    const body = await request.json();
    const newContact = {
      id: mockContacts.length + 1,
      ...body,
    };

    mockContacts.push(newContact);

    return HttpResponse.json(newContact, { status: 201 });
  }),

  // ========================================
  // PUT /api/v1/contacts/:id - Update contact
  // ========================================
  http.put(`${API_BASE}/contacts/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = await request.json();
    const index = mockContacts.findIndex((c) => c.id === Number(id));

    if (index === -1) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Contact not found',
      });
    }

    mockContacts[index] = { ...mockContacts[index], ...body };

    return HttpResponse.json(mockContacts[index]);
  }),

  // ========================================
  // DELETE /api/v1/contacts/:id - Delete contact
  // ========================================
  http.delete(`${API_BASE}/contacts/:id`, ({ params }) => {
    const { id } = params;
    const index = mockContacts.findIndex((c) => c.id === Number(id));

    if (index === -1) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Contact not found',
      });
    }

    mockContacts.splice(index, 1);

    return new HttpResponse(null, { status: 204 });
  }),
];
```

---

### Step 2: Setup MSW in Vitest

**File: `vitest.setup.ts`**

```typescript
/*
 * ================================================================
 * FILE: vitest.setup.ts
 * PATH: /apps/web-ui/vitest.setup.ts
 * DESCRIPTION: Vitest global setup (MSW + Testing Library)
 * VERSION: v1.0.0
 * UPDATED: 2025-10-19 12:00:00
 * ================================================================
 */

import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import { handlers } from './src/test/mocks/handlers';
import { beforeAll, afterEach, afterAll } from 'vitest';

// Create MSW server with handlers
export const server = setupServer(...handlers);

// Start server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

// Reset handlers after each test (important for test isolation)
afterEach(() => {
  server.resetHandlers();
});

// Close server after all tests
afterAll(() => {
  server.close();
});
```

**File: `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts', // ← Load MSW setup
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/', 'src/**/*.test.tsx'],
    },
  },
});
```

---

### Example 1: ContactList (Fetch & Display)

**Component: `ContactList.tsx`**

```typescript
/*
 * ================================================================
 * FILE: ContactList.tsx
 * PATH: /apps/web-ui/src/components/ContactList/ContactList.tsx
 * DESCRIPTION: Contact list component with API data fetching
 * VERSION: v1.0.0
 * UPDATED: 2025-10-19 12:00:00
 * ================================================================
 */

import { useEffect, useState } from 'react';
import { useTranslation } from '@l-kern/config';
import styles from './ContactList.module.css';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

export const ContactList = () => {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8101/api/v1/contacts');

        if (!response.ok) {
          throw new Error('Failed to fetch contacts');
        }

        const data = await response.json();
        setContacts(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (loading) {
    return <div>{t('common.loading')}</div>;
  }

  if (error) {
    return <div className={styles.error}>{t('errors.fetchFailed')}</div>;
  }

  if (contacts.length === 0) {
    return <div>{t('contacts.noContacts')}</div>;
  }

  return (
    <div className={styles.contactList}>
      <h2>{t('contacts.title')}</h2>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <strong>{contact.name}</strong> - {contact.email}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

**Test: `ContactList.test.tsx`**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ContactList } from './ContactList';

describe('ContactList Integration', () => {
  // === LOADING STATE ===
  describe('Loading State', () => {
    it('shows loading state initially', () => {
      render(<ContactList />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  // === SUCCESS STATE ===
  describe('Success State', () => {
    it('fetches and displays contacts from API', async () => {
      render(<ContactList />);

      // Wait for loading to finish
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });

      // Verify contacts displayed (from MSW mock)
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText(/john@example.com/)).toBeInTheDocument();
    });

    it('displays contact list title', async () => {
      render(<ContactList />);

      await waitFor(() => {
        expect(screen.getByText('Contacts')).toBeInTheDocument();
      });
    });

    it('displays all contacts in correct order', async () => {
      render(<ContactList />);

      await waitFor(() => {
        const items = screen.getAllByRole('listitem');
        expect(items).toHaveLength(2);
        expect(items[0]).toHaveTextContent('John Doe');
        expect(items[1]).toHaveTextContent('Jane Smith');
      });
    });
  });

  // === EMPTY STATE ===
  describe('Empty State', () => {
    it('displays empty message when no contacts', async () => {
      // Override MSW handler to return empty array
      server.use(
        http.get('http://localhost:8101/api/v1/contacts', () => {
          return HttpResponse.json({ data: [], total: 0 });
        })
      );

      render(<ContactList />);

      await waitFor(() => {
        expect(screen.getByText('No contacts found')).toBeInTheDocument();
      });
    });
  });

  // === ERROR STATE ===
  describe('Error State', () => {
    it('displays error message when API fails', async () => {
      // Override MSW handler to return 500 error
      server.use(
        http.get('http://localhost:8101/api/v1/contacts', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      render(<ContactList />);

      await waitFor(() => {
        expect(screen.getByText('Failed to fetch contacts')).toBeInTheDocument();
      });
    });

    it('displays error when network fails', async () => {
      // Override MSW handler to simulate network error
      server.use(
        http.get('http://localhost:8101/api/v1/contacts', () => {
          return HttpResponse.error();
        })
      );

      render(<ContactList />);

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });
  });
});
```

**Key Points:**
- ✅ Test all states: loading, success, empty, error
- ✅ Use `waitFor()` for async assertions
- ✅ Override MSW handlers for specific test cases
- ✅ Verify data from mock API is displayed correctly

---

### Example 2: ContactForm (Submit Data)

**Component: `ContactForm.tsx`**

```typescript
/*
 * ================================================================
 * FILE: ContactForm.tsx
 * PATH: /apps/web-ui/src/components/ContactForm/ContactForm.tsx
 * DESCRIPTION: Contact creation form with API submission
 * VERSION: v1.0.0
 * UPDATED: 2025-10-19 12:00:00
 * ================================================================
 */

import { useState } from 'react';
import { useTranslation } from '@l-kern/config';
import { Button, Input } from '@l-kern/ui-components';
import styles from './ContactForm.module.css';

interface ContactFormProps {
  onSuccess?: () => void;
}

export const ContactForm = ({ onSuccess }: ContactFormProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8101/api/v1/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      });

      if (!response.ok) {
        throw new Error('Failed to create contact');
      }

      // Reset form
      setName('');
      setEmail('');
      setPhone('');

      // Notify parent
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.contactForm} onSubmit={handleSubmit}>
      <h2>{t('contacts.createTitle')}</h2>

      {error && <div className={styles.error}>{error}</div>}

      <Input
        label={t('contacts.fields.name')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Input
        label={t('contacts.fields.email')}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        label={t('contacts.fields.phone')}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <Button type="submit" loading={loading}>
        {t('common.save')}
      </Button>
    </form>
  );
};
```

**Test: `ContactForm.test.tsx`**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from './ContactForm';
import { server } from '../../test/mocks/server';
import { http, HttpResponse } from 'msw';

describe('ContactForm Integration', () => {
  // === RENDERING ===
  describe('Rendering', () => {
    it('renders form fields', () => {
      render(<ContactForm />);

      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Phone')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
    });
  });

  // === FORM SUBMISSION ===
  describe('Form Submission', () => {
    it('submits form data to API successfully', async () => {
      const onSuccess = vi.fn();
      render(<ContactForm onSuccess={onSuccess} />);

      // Fill form
      await userEvent.type(screen.getByLabelText('Name'), 'John Doe');
      await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
      await userEvent.type(screen.getByLabelText('Phone'), '+421900123456');

      // Submit
      await userEvent.click(screen.getByText('Save'));

      // Wait for success
      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledTimes(1);
      });
    });

    it('clears form fields after successful submission', async () => {
      render(<ContactForm />);

      // Fill form
      await userEvent.type(screen.getByLabelText('Name'), 'John Doe');
      await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');

      // Submit
      await userEvent.click(screen.getByText('Save'));

      // Wait for form to clear
      await waitFor(() => {
        expect(screen.getByLabelText('Name')).toHaveValue('');
        expect(screen.getByLabelText('Email')).toHaveValue('');
      });
    });

    it('sends correct data to API', async () => {
      let requestBody: any = null;

      // Capture request body
      server.use(
        http.post('http://localhost:8101/api/v1/contacts', async ({ request }) => {
          requestBody = await request.json();
          return HttpResponse.json({ id: 123, ...requestBody }, { status: 201 });
        })
      );

      render(<ContactForm />);

      await userEvent.type(screen.getByLabelText('Name'), 'John Doe');
      await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
      await userEvent.type(screen.getByLabelText('Phone'), '+421900123456');
      await userEvent.click(screen.getByText('Save'));

      await waitFor(() => {
        expect(requestBody).toEqual({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+421900123456',
        });
      });
    });
  });

  // === LOADING STATE ===
  describe('Loading State', () => {
    it('disables submit button while loading', async () => {
      render(<ContactForm />);

      await userEvent.type(screen.getByLabelText('Name'), 'John Doe');
      await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');

      const submitButton = screen.getByText('Save');
      await userEvent.click(submitButton);

      // Button should be disabled during submission
      expect(submitButton).toBeDisabled();
    });

    it('shows loading text on submit button', async () => {
      render(<ContactForm />);

      await userEvent.type(screen.getByLabelText('Name'), 'John Doe');
      await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
      await userEvent.click(screen.getByText('Save'));

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  // === ERROR HANDLING ===
  describe('Error Handling', () => {
    it('displays error when API returns 500', async () => {
      server.use(
        http.post('http://localhost:8101/api/v1/contacts', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      render(<ContactForm />);

      await userEvent.type(screen.getByLabelText('Name'), 'John Doe');
      await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
      await userEvent.click(screen.getByText('Save'));

      await waitFor(() => {
        expect(screen.getByText('Failed to create contact')).toBeInTheDocument();
      });
    });

    it('does not clear form on error', async () => {
      server.use(
        http.post('http://localhost:8101/api/v1/contacts', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      render(<ContactForm />);

      await userEvent.type(screen.getByLabelText('Name'), 'John Doe');
      await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
      await userEvent.click(screen.getByText('Save'));

      await waitFor(() => {
        expect(screen.getByLabelText('Name')).toHaveValue('John Doe');
        expect(screen.getByLabelText('Email')).toHaveValue('john@example.com');
      });
    });
  });

  // === VALIDATION ===
  describe('Validation', () => {
    it('requires name field', async () => {
      render(<ContactForm />);

      await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
      await userEvent.click(screen.getByText('Save'));

      // HTML5 validation prevents submission
      expect(screen.getByLabelText('Name')).toBeInvalid();
    });

    it('requires email field', async () => {
      render(<ContactForm />);

      await userEvent.type(screen.getByLabelText('Name'), 'John Doe');
      await userEvent.click(screen.getByText('Save'));

      expect(screen.getByLabelText('Email')).toBeInvalid();
    });
  });
});
```

**Key Points:**
- ✅ Test form submission flow end-to-end
- ✅ Verify API receives correct data
- ✅ Test loading states during submission
- ✅ Test error handling (API failure)
- ✅ Test form validation

---

## 🎯 Backend Integration Testing

### Setup Test Database

**File: `conftest.py`** (pytest fixtures)

```python
"""
================================================================
FILE: conftest.py
PATH: /services/lkms101-contacts/tests/conftest.py
DESCRIPTION: Pytest fixtures for integration tests
VERSION: v1.0.0
UPDATED: 2025-10-19 12:00:00
================================================================
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db

# Test database URL (in-memory SQLite)
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

# Create test engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}  # SQLite specific
)

# Create test session factory
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db():
    """Create test database for each test."""
    # Create all tables
    Base.metadata.create_all(bind=engine)

    # Create session
    db = TestingSessionLocal()

    try:
        yield db
    finally:
        db.close()

    # Drop all tables after test
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db):
    """Create FastAPI test client with test database."""
    def override_get_db():
        try:
            yield db
        finally:
            db.close()

    # Override dependency
    app.dependency_overrides[get_db] = override_get_db

    # Create test client
    with TestClient(app) as test_client:
        yield test_client

    # Clear overrides
    app.dependency_overrides.clear()
```

---

### Example 1: Contact CRUD API

**Test: `test_contact_api.py`**

```python
"""
================================================================
FILE: test_contact_api.py
PATH: /services/lkms101-contacts/tests/test_contact_api.py
DESCRIPTION: Integration tests for Contact API endpoints
VERSION: v1.0.0
UPDATED: 2025-10-19 12:00:00
================================================================
"""

import pytest
from fastapi.testclient import TestClient


class TestCreateContact:
    """Test POST /api/v1/contacts - Create contact."""

    def test_creates_contact_successfully(self, client):
        response = client.post(
            "/api/v1/contacts",
            json={
                "name": "John Doe",
                "email": "john@example.com",
                "phone": "+421900123456"
            }
        )

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "John Doe"
        assert data["email"] == "john@example.com"
        assert data["phone"] == "+421900123456"
        assert "id" in data  # Database generated ID

    def test_returns_created_contact_id(self, client):
        response = client.post(
            "/api/v1/contacts",
            json={"name": "John Doe", "email": "john@example.com"}
        )

        data = response.json()
        assert isinstance(data["id"], int)
        assert data["id"] > 0

    def test_rejects_duplicate_email(self, client):
        # Create first contact
        client.post(
            "/api/v1/contacts",
            json={"name": "John Doe", "email": "john@example.com"}
        )

        # Try to create duplicate
        response = client.post(
            "/api/v1/contacts",
            json={"name": "Jane Doe", "email": "john@example.com"}
        )

        assert response.status_code == 400
        assert "already exists" in response.json()["detail"]

    def test_validates_email_format(self, client):
        response = client.post(
            "/api/v1/contacts",
            json={"name": "John Doe", "email": "not-an-email"}
        )

        assert response.status_code == 422  # Validation error
        errors = response.json()["detail"]
        assert any("email" in str(err) for err in errors)

    def test_requires_name_field(self, client):
        response = client.post(
            "/api/v1/contacts",
            json={"email": "john@example.com"}
        )

        assert response.status_code == 422
        errors = response.json()["detail"]
        assert any("name" in str(err) for err in errors)


class TestListContacts:
    """Test GET /api/v1/contacts - List contacts."""

    def test_returns_empty_list_when_no_contacts(self, client):
        response = client.get("/api/v1/contacts")

        assert response.status_code == 200
        data = response.json()
        assert data["data"] == []
        assert data["total"] == 0

    def test_returns_all_contacts(self, client):
        # Create test contacts
        client.post("/api/v1/contacts", json={"name": "John Doe", "email": "john@example.com"})
        client.post("/api/v1/contacts", json={"name": "Jane Smith", "email": "jane@example.com"})

        # Fetch all
        response = client.get("/api/v1/contacts")

        assert response.status_code == 200
        data = response.json()
        assert len(data["data"]) == 2
        assert data["total"] == 2

    def test_returns_contacts_in_correct_order(self, client):
        # Create contacts
        client.post("/api/v1/contacts", json={"name": "Alice", "email": "alice@example.com"})
        client.post("/api/v1/contacts", json={"name": "Bob", "email": "bob@example.com"})

        response = client.get("/api/v1/contacts")

        data = response.json()
        names = [contact["name"] for contact in data["data"]]
        assert names == ["Alice", "Bob"]

    def test_supports_pagination(self, client):
        # Create 10 contacts
        for i in range(10):
            client.post("/api/v1/contacts", json={
                "name": f"User {i}",
                "email": f"user{i}@example.com"
            })

        # Fetch first page (limit=5)
        response = client.get("/api/v1/contacts?limit=5&offset=0")

        data = response.json()
        assert len(data["data"]) == 5
        assert data["total"] == 10


class TestGetContact:
    """Test GET /api/v1/contacts/:id - Get single contact."""

    def test_returns_contact_by_id(self, client):
        # Create contact
        create_response = client.post(
            "/api/v1/contacts",
            json={"name": "John Doe", "email": "john@example.com"}
        )
        contact_id = create_response.json()["id"]

        # Fetch by ID
        response = client.get(f"/api/v1/contacts/{contact_id}")

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == contact_id
        assert data["name"] == "John Doe"

    def test_returns_404_for_nonexistent_contact(self, client):
        response = client.get("/api/v1/contacts/99999")

        assert response.status_code == 404
        assert "not found" in response.json()["detail"]


class TestUpdateContact:
    """Test PUT /api/v1/contacts/:id - Update contact."""

    def test_updates_contact_successfully(self, client):
        # Create contact
        create_response = client.post(
            "/api/v1/contacts",
            json={"name": "John Doe", "email": "john@example.com"}
        )
        contact_id = create_response.json()["id"]

        # Update contact
        response = client.put(
            f"/api/v1/contacts/{contact_id}",
            json={"name": "John Updated", "email": "john.updated@example.com"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "John Updated"
        assert data["email"] == "john.updated@example.com"

    def test_returns_404_for_nonexistent_contact(self, client):
        response = client.put(
            "/api/v1/contacts/99999",
            json={"name": "Updated", "email": "updated@example.com"}
        )

        assert response.status_code == 404

    def test_validates_updated_data(self, client):
        # Create contact
        create_response = client.post(
            "/api/v1/contacts",
            json={"name": "John Doe", "email": "john@example.com"}
        )
        contact_id = create_response.json()["id"]

        # Try to update with invalid email
        response = client.put(
            f"/api/v1/contacts/{contact_id}",
            json={"name": "John", "email": "not-an-email"}
        )

        assert response.status_code == 422


class TestDeleteContact:
    """Test DELETE /api/v1/contacts/:id - Delete contact."""

    def test_deletes_contact_successfully(self, client):
        # Create contact
        create_response = client.post(
            "/api/v1/contacts",
            json={"name": "John Doe", "email": "john@example.com"}
        )
        contact_id = create_response.json()["id"]

        # Delete contact
        response = client.delete(f"/api/v1/contacts/{contact_id}")

        assert response.status_code == 204

    def test_contact_not_found_after_deletion(self, client):
        # Create contact
        create_response = client.post(
            "/api/v1/contacts",
            json={"name": "John Doe", "email": "john@example.com"}
        )
        contact_id = create_response.json()["id"]

        # Delete contact
        client.delete(f"/api/v1/contacts/{contact_id}")

        # Try to fetch deleted contact
        response = client.get(f"/api/v1/contacts/{contact_id}")
        assert response.status_code == 404

    def test_returns_404_for_nonexistent_contact(self, client):
        response = client.delete("/api/v1/contacts/99999")

        assert response.status_code == 404
```

**Key Points:**
- ✅ Use `TestClient` for API testing (no server needed)
- ✅ Use test database (in-memory SQLite)
- ✅ Test all CRUD operations (Create, Read, Update, Delete)
- ✅ Test validation errors (422 status)
- ✅ Test error cases (404 not found)
- ✅ Each test is independent (database reset between tests)

---

## 📊 Integration Testing Checklist

### ✅ Frontend Integration Tests (Components + API)

**For each component that fetches data:**
- [ ] Test loading state (shows spinner/loading text)
- [ ] Test success state (data displayed correctly)
- [ ] Test empty state (no data available)
- [ ] Test error state (API returns 500)
- [ ] Test network error (fetch fails)
- [ ] Verify correct API endpoint called
- [ ] Verify data rendered from mock response

**For each component that submits data:**
- [ ] Test form submission success
- [ ] Test form clears after success
- [ ] Test loading state during submission
- [ ] Test error handling (API failure)
- [ ] Test validation errors (422 response)
- [ ] Verify correct data sent to API
- [ ] Verify onSuccess callback called

---

### ✅ Backend Integration Tests (API + Database)

**For each API endpoint:**
- [ ] Test successful request (200/201 status)
- [ ] Test validation errors (422 status)
- [ ] Test not found errors (404 status)
- [ ] Test database constraints (unique email)
- [ ] Test pagination (limit, offset)
- [ ] Test filtering (search, filters)
- [ ] Test sorting (order by name, date)
- [ ] Verify database changes persist
- [ ] Verify response matches schema

---

## 🔧 Advanced MSW Patterns

### Pattern 1: Dynamic Handler Override

**Override handler for specific test:**

```typescript
import { server } from '../../test/mocks/server';
import { http, HttpResponse } from 'msw';

test('handles API timeout', async () => {
  // Override default handler
  server.use(
    http.get('http://localhost:8101/api/v1/contacts', async () => {
      await delay(5000);  // Simulate timeout
      return HttpResponse.json({ data: [] });
    })
  );

  render(<ContactList />);

  await waitFor(() => {
    expect(screen.getByText('Request timed out')).toBeInTheDocument();
  });
});
```

---

### Pattern 2: Stateful Handlers

**Track API calls across tests:**

```typescript
// handlers.ts
let apiCallCount = 0;

export const handlers = [
  http.get('http://localhost:8101/api/v1/contacts', () => {
    apiCallCount++;
    return HttpResponse.json({ data: mockContacts });
  }),
];

// Reset counter in tests
afterEach(() => {
  apiCallCount = 0;
});

// Test
test('calls API only once', async () => {
  render(<ContactList />);

  await waitFor(() => {
    expect(apiCallCount).toBe(1);
  });
});
```

---

### Pattern 3: Conditional Responses

**Return different responses based on request:**

```typescript
http.post('http://localhost:8101/api/v1/contacts', async ({ request }) => {
  const body = await request.json();

  // Simulate duplicate email check
  if (body.email === 'duplicate@example.com') {
    return new HttpResponse(
      JSON.stringify({ detail: 'Email already exists' }),
      { status: 400 }
    );
  }

  return HttpResponse.json({ id: 1, ...body }, { status: 201 });
})
```

---

## 📚 Best Practices

### ✅ DO's

1. **Reset handlers between tests**
   ```typescript
   afterEach(() => {
     server.resetHandlers();
   });
   ```

2. **Use `waitFor()` for async assertions**
   ```typescript
   await waitFor(() => {
     expect(screen.getByText('Loaded')).toBeInTheDocument();
   });
   ```

3. **Test database persistence**
   ```python
   # Create contact
   response = client.post("/api/v1/contacts", json={...})
   contact_id = response.json()["id"]

   # Verify persisted
   get_response = client.get(f"/api/v1/contacts/{contact_id}")
   assert get_response.status_code == 200
   ```

4. **Use realistic test data**
   ```typescript
   const mockContact = {
     id: 1,
     name: 'John Doe',
     email: 'john@example.com',
     phone: '+421900123456',  // Valid SK format
   };
   ```

---

### ❌ DON'Ts

1. **Don't share state between tests**
   ```typescript
   // ❌ BAD - Global state
   let contacts = [];

   test('test 1', () => {
     contacts.push({ id: 1 });  // Affects test 2!
   });

   // ✅ GOOD - Fresh state per test
   beforeEach(() => {
     mockContacts = [{ id: 1 }];
   });
   ```

2. **Don't use real API in integration tests**
   ```typescript
   // ❌ BAD - Real API call
   await fetch('http://real-api.com/contacts');

   // ✅ GOOD - MSW mock
   server.use(
     http.get('http://localhost:8101/api/v1/contacts', ...)
   );
   ```

3. **Don't test multiple features in one test**
   ```typescript
   // ❌ BAD - Tests create, update, delete in one test
   test('CRUD operations', () => {
     // Create, update, delete all in one test
   });

   // ✅ GOOD - Separate tests
   test('creates contact');
   test('updates contact');
   test('deletes contact');
   ```

---

## 🔍 Debugging Integration Tests

### View Network Requests

```typescript
import { server } from '../../test/mocks/server';

server.events.on('request:start', ({ request }) => {
  console.log('MSW intercepted:', request.method, request.url);
});
```

### Check MSW Handler Matches

```typescript
test('debug MSW', async () => {
  render(<ContactList />);

  // Wait and check console for MSW logs
  await screen.findByText('John Doe');

  screen.debug();  // Print DOM
});
```

### Verify Database State

```python
def test_debug_database(client, db):
    # Create contact
    client.post("/api/v1/contacts", json={...})

    # Check database directly
    from app.models import Contact
    contacts = db.query(Contact).all()
    print(f"Database has {len(contacts)} contacts")
```

---

## 🎯 Summary

**Integration Testing Covers:**
- ✅ Components + API stubs (MSW)
- ✅ Form submissions with API
- ✅ Data fetching and display
- ✅ API endpoints + Test database
- ✅ Multi-component interactions

**Integration Testing Does NOT Cover:**
- ❌ Pure functions (use unit tests)
- ❌ Complete user flows (use E2E tests)
- ❌ Real API calls (use MSW mocks)

**Next Steps:**
1. Read [testing-unit.md](testing-unit.md) for unit testing patterns
2. Read [testing-e2e.md](testing-e2e.md) for Playwright E2E tests
3. Read [testing-best-practices.md](testing-best-practices.md) for common pitfalls

---

**Last Updated:** 2025-10-19
**Maintainer:** BOSSystems s.r.o.
