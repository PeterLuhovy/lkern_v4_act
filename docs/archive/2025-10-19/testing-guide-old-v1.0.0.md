# ================================================================
# L-KERN v4 - Testing Guide
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\programming\testing-guide.md
# Version: 1.0.0
# Created: 2025-10-18
# Updated: 2025-10-18
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Comprehensive testing guide for L-KERN v4 including pytest (backend),
#   Vitest (frontend), testing checklists, and coverage requirements.
# ================================================================

---

## 📋 Overview

This document contains **testing standards and practices** for L-KERN v4.

**Testing stack:**
- **Backend**: pytest + pytest-asyncio
- **Frontend**: Vitest + React Testing Library
- **Coverage**: 90%+ for UI components, 95%+ for backend APIs

---

## 1. Frontend Testing (Vitest)

### Setup

**Install dependencies:**
```bash
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
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

**src/test/setup.ts:**
```typescript
import '@testing-library/jest-dom';
```

---

### UI Component Testing Checklist

**For each UI component (Button, Input, Select, etc.), test:**

#### Rendering Tests
- [ ] Component renders without crashing
- [ ] Renders with required props
- [ ] Renders children correctly
- [ ] Renders with all optional props
- [ ] Applies default values when props omitted

#### Props Tests
- [ ] All variant props apply correct CSS classes
- [ ] All size props apply correct CSS classes
- [ ] Boolean props toggle expected behavior
- [ ] String props display correctly

#### Interaction Tests
- [ ] onClick handler called when clicked
- [ ] onChange handler called when value changes
- [ ] onFocus/onBlur handlers called correctly
- [ ] Keyboard interactions work (Enter, Space, Escape)

#### State Tests
- [ ] Disabled state prevents interactions
- [ ] Disabled state applies correct styling
- [ ] Loading state prevents interactions
- [ ] Loading state shows loading indicator
- [ ] Error state displays error message

#### CSS & Styling Tests
- [ ] All CSS classes applied correctly
- [ ] Uses theme CSS variables (not hardcoded colors)
- [ ] Custom className prop merged with default classes
- [ ] fullWidth prop applies correct width

#### Translation Tests
- [ ] ALL user-facing text uses t() function (NO hardcoded strings)
- [ ] Component text changes when language switches (test with both 'sk' and 'en')
- [ ] Placeholder text uses translations
- [ ] Error messages use translations
- [ ] Helper text uses translations
- [ ] Button labels use translations

**🚨 CRITICAL: Language-Independent Testing**
- ❌ **NEVER test for specific translated text** (e.g., "Save", "Uložiť")
- ✅ **ALWAYS test using data-testid, role, or structure** (e.g., `getByRole('button')`)
- ❌ **NEVER query by translated text** (e.g., `getByText('Save')`)
- ✅ **ALWAYS test translation KEY existence**, not translated value
- **Reason**: Translations change, tests must remain stable across languages

#### Accessibility Tests
- [ ] Has correct ARIA role
- [ ] aria-label or aria-labelledby present
- [ ] aria-disabled set when disabled
- [ ] aria-invalid set when error
- [ ] aria-describedby links to error/helper text
- [ ] Keyboard focusable when not disabled

---

### Example - Button Tests

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  // === RENDERING ===
  it('renders without crashing', () => {
    render(<Button>Click me</Button>);
  });

  it('renders text correctly', () => {
    render(<Button>Save</Button>);
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  // === PROPS ===
  it('applies primary variant class', () => {
    render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--primary');
  });

  it('applies small size class', () => {
    render(<Button size="small">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--small');
  });

  // === INTERACTIONS ===
  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick} disabled>Disabled</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  // === STATE ===
  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows loading indicator when loading', () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  // === TRANSLATION ===
  it('uses translation for button text', () => {
    // ✅ CORRECT: Test that button exists and uses translations
    // ❌ WRONG: Don't test for specific text like "Save" or "Uložiť"
    render(<Button data-testid="save-button">{t('common.save')}</Button>);

    // Test button exists (language-independent)
    expect(screen.getByTestId('save-button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('button text changes when language changes', () => {
    const { rerender } = render(
      <Button data-testid="save-button">{t('common.save')}</Button>
    );

    // Get initial text (don't assert specific value)
    const button = screen.getByTestId('save-button');
    const initialText = button.textContent;

    // Change language
    act(() => setLanguage('en'));
    rerender(<Button data-testid="save-button">{t('common.save')}</Button>);

    // Verify text CHANGED (but don't check what it changed to)
    const newText = button.textContent;
    expect(newText).not.toBe(initialText);
    expect(newText).toBeTruthy(); // Just check text exists
  });

  // === ACCESSIBILITY ===
  it('has button role', () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('is keyboard accessible', () => {
    render(<Button>Test</Button>);
    const button = screen.getByRole('button');
    button.focus();
    expect(document.activeElement).toBe(button);
  });
});
```

---

### Page Component Testing Checklist

**For each page component, test:**

#### Rendering Tests
- [ ] Page renders without crashing
- [ ] Page title displays correctly
- [ ] Navigation elements visible
- [ ] Loading state shows on initial render

#### Translation Tests
- [ ] Uses t() for all text (not hardcoded)
- [ ] Page title translates when language changes
- [ ] Button labels translate
- [ ] Error messages translate
- [ ] Placeholder text translates

#### API Integration Tests
- [ ] Fetches data from API on mount
- [ ] Displays fetched data correctly
- [ ] Shows loading spinner while fetching
- [ ] Shows error message when API fails
- [ ] Retries failed requests

#### CRUD Operation Tests
- [ ] Create: Opens create modal/form
- [ ] Create: Submits data to API
- [ ] Create: Shows success notification
- [ ] Create: Updates list with new item
- [ ] Read: Displays list of items
- [ ] Update: Opens edit modal with existing data
- [ ] Update: Submits updated data to API
- [ ] Delete: Shows confirmation dialog
- [ ] Delete: Deletes item from API

---

## 2. Backend Testing (pytest)

### Setup

**Install dependencies:**
```bash
pip install pytest pytest-asyncio pytest-cov httpx
```

**pytest.ini:**
```ini
[pytest]
testpaths = tests
python_files = test_*.py
python_functions = test_*
asyncio_mode = auto
```

---

### API Endpoint Testing Checklist

**For each API endpoint, test:**

#### Success Response Tests
- [ ] GET all returns 200 and array
- [ ] GET by ID returns 200 and object
- [ ] POST returns 201 and created object
- [ ] PUT returns 200 and updated object
- [ ] DELETE returns 204 No Content

#### Error Response Tests
- [ ] GET nonexistent ID returns 404
- [ ] POST invalid data returns 400 or 422
- [ ] POST duplicate unique field returns 400
- [ ] PUT nonexistent ID returns 404
- [ ] DELETE nonexistent ID returns 404

#### Validation Tests
- [ ] Required fields validated (400 if missing)
- [ ] Email format validated
- [ ] Min/max length validated
- [ ] Enum values validated
- [ ] Type validation (string vs number)

#### Business Logic Tests
- [ ] Related records created correctly
- [ ] Cascading deletes work
- [ ] Soft delete marks is_active=false
- [ ] Timestamps set correctly (created_at, updated_at)
- [ ] Default values applied

#### Database Tests
- [ ] Record saved to database
- [ ] Record updated in database
- [ ] Record deleted from database
- [ ] Transactions roll back on error
- [ ] Foreign key constraints enforced

---

### Example - Contacts API Tests

**tests/conftest.py:**
```python
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.database import Base, get_db
from app.main import app

# Test database URL
TEST_DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/test_lkms101_contacts"

@pytest.fixture(scope="function")
def db_session():
    """Create fresh database for each test."""
    engine = create_engine(TEST_DATABASE_URL)
    Base.metadata.create_all(bind=engine)

    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSessionLocal()

    yield session

    session.close()
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    """FastAPI test client with DB override."""
    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()
```

**tests/test_api.py:**
```python
import pytest
from app.models.contact import Contact

def test_create_contact_success(client):
    """Test successful contact creation."""
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
    assert "id" in data
    assert "created_at" in data

def test_create_contact_duplicate_email(client, db_session):
    """Test creating contact with duplicate email fails."""
    # Create first contact
    contact = Contact(name="Existing", email="john@example.com")
    db_session.add(contact)
    db_session.commit()

    # Try to create duplicate
    response = client.post(
        "/api/v1/contacts",
        json={"name": "Duplicate", "email": "john@example.com"}
    )

    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

def test_create_contact_invalid_email(client):
    """Test creating contact with invalid email fails."""
    response = client.post(
        "/api/v1/contacts",
        json={"name": "Test", "email": "not-an-email"}
    )

    assert response.status_code == 422  # Validation error

def test_get_contact_by_id(client, db_session):
    """Test retrieving contact by ID."""
    contact = Contact(name="Jane Doe", email="jane@example.com")
    db_session.add(contact)
    db_session.commit()

    response = client.get(f"/api/v1/contacts/{contact.id}")

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Jane Doe"
    assert data["email"] == "jane@example.com"

def test_get_nonexistent_contact(client):
    """Test getting nonexistent contact returns 404."""
    response = client.get("/api/v1/contacts/99999")

    assert response.status_code == 404
    assert "not found" in response.json()["detail"]

def test_update_contact(client, db_session):
    """Test updating contact."""
    contact = Contact(name="Old Name", email="old@example.com")
    db_session.add(contact)
    db_session.commit()

    response = client.put(
        f"/api/v1/contacts/{contact.id}",
        json={"name": "New Name"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "New Name"
    assert data["email"] == "old@example.com"  # Email unchanged

def test_delete_contact(client, db_session):
    """Test deleting contact."""
    contact = Contact(name="Delete Me", email="delete@example.com")
    db_session.add(contact)
    db_session.commit()

    response = client.delete(f"/api/v1/contacts/{contact.id}")

    assert response.status_code == 204

    # Verify deleted
    deleted = db_session.query(Contact).filter(Contact.id == contact.id).first()
    assert deleted is None
```

---

### gRPC Testing

**tests/test_grpc.py:**
```python
import pytest
import grpc
from app.grpc import contacts_pb2, contacts_pb2_grpc
from app.models.contact import Contact

def test_get_contact_grpc(db_session, grpc_channel):
    """Test GetContact gRPC method."""
    # Create test contact
    contact = Contact(name="gRPC Test", email="grpc@example.com")
    db_session.add(contact)
    db_session.commit()

    # Create stub
    stub = contacts_pb2_grpc.ContactsServiceStub(grpc_channel)

    # Call gRPC method
    request = contacts_pb2.GetContactRequest(id=contact.id)
    response = stub.GetContact(request)

    # Verify
    assert response.contact.id == contact.id
    assert response.contact.name == "gRPC Test"
    assert response.contact.email == "grpc@example.com"

def test_get_contact_not_found_grpc(grpc_channel):
    """Test GetContact returns NOT_FOUND for nonexistent ID."""
    stub = contacts_pb2_grpc.ContactsServiceStub(grpc_channel)

    request = contacts_pb2.GetContactRequest(id=99999)

    with pytest.raises(grpc.RpcError) as exc_info:
        stub.GetContact(request)

    assert exc_info.value.code() == grpc.StatusCode.NOT_FOUND
```

---

## 3. Coverage Requirements

**Target coverage:**
- ✅ **UI Components**: 90%+ (critical user-facing code)
- ✅ **API Endpoints**: 95%+ (business logic)
- ✅ **Database Models**: 85%+ (CRUD operations)
- ✅ **Utilities**: 80%+ (helper functions)

**Run coverage:**

```bash
# Frontend
npm run test:coverage

# Backend
pytest --cov=app --cov-report=html tests/
```

---

## 4. Testing Best Practices

### DO's
- ✅ Write tests BEFORE fixing bugs (TDD for bug fixes)
- ✅ Test one thing per test function
- ✅ Use descriptive test names: `test_create_contact_with_duplicate_email_returns_400`
- ✅ Use fixtures for setup/teardown
- ✅ Mock external services (API calls, database)
- ✅ Test error cases, not just happy path
- ✅ Use `arrange-act-assert` pattern

### DON'Ts
- ❌ Don't test implementation details (internal state)
- ❌ Don't use real database in unit tests
- ❌ Don't share state between tests
- ❌ Don't hardcode test data (use factories)
- ❌ Don't skip flaky tests (fix them!)
- ❌ Don't test third-party libraries

---

## Summary

**Testing standards cover:**
- ✅ Vitest frontend testing (UI components, pages)
- ✅ pytest backend testing (API, gRPC, database)
- ✅ Comprehensive testing checklists
- ✅ Coverage requirements (90%+ UI, 95%+ API)
- ✅ Testing best practices

**See also:**
- [frontend-standards.md](frontend-standards.md) - React/TypeScript patterns
- [backend-standards.md](backend-standards.md) - Python/FastAPI patterns
- [code-examples.md](code-examples.md) - Practical code examples

---

**Last Updated:** 2025-10-18
**Maintainer:** BOSSystems s.r.o.
