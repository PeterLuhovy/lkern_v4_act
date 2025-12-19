"""
================================================================
Contact Service (MDM) - API Tests
================================================================
File: services/lkms101-contacts/tests/test_api.py
Version: v2.0.0
Created: 2025-11-08
Updated: 2025-12-19
Description:
  pytest tests for Contact MDM REST API endpoints.
================================================================
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from uuid import uuid4

from app.main import app
from app.database import Base, get_db

# Test database (in-memory SQLite)
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override database dependency for testing."""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_database():
    """Create tables before each test, drop after."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


# ================================================================
# HEALTH & ROOT ENDPOINTS
# ================================================================

def test_root_endpoint():
    """Test root endpoint returns service info."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "service" in data
    assert "version" in data
    assert "status" in data


def test_health_endpoint():
    """Test health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


# ================================================================
# CONTACT CRUD TESTS
# ================================================================

def test_create_person_contact():
    """Test creating a new person contact."""
    response = client.post(
        "/contacts/",
        json={
            "contact_type": "person",
            "person": {
                "first_name": "Ján",
                "last_name": "Novák",
                "gender": "male"
            }
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["contact_type"] == "person"
    assert "id" in data
    assert "contact_code" in data
    assert data["contact_code"].startswith("CON-")


def test_create_company_contact():
    """Test creating a new company contact."""
    response = client.post(
        "/contacts/",
        json={
            "contact_type": "company",
            "company": {
                "company_name": "Testová Firma s.r.o.",
                "registration_number": "12345678"
            }
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["contact_type"] == "company"
    assert "id" in data


def test_list_contacts():
    """Test listing all contacts with pagination."""
    # Create test contacts
    client.post("/contacts/", json={
        "contact_type": "person",
        "person": {"first_name": "Person", "last_name": "One"}
    })
    client.post("/contacts/", json={
        "contact_type": "person",
        "person": {"first_name": "Person", "last_name": "Two"}
    })

    # List contacts
    response = client.get("/contacts/")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert len(data["items"]) == 2
    assert data["total"] == 2


def test_list_contacts_filter_by_type():
    """Test filtering contacts by type."""
    # Create mixed contacts
    client.post("/contacts/", json={
        "contact_type": "person",
        "person": {"first_name": "Test", "last_name": "Person"}
    })
    client.post("/contacts/", json={
        "contact_type": "company",
        "company": {"company_name": "Test Company"}
    })

    # Filter by person
    response = client.get("/contacts/?contact_type=person")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["contact_type"] == "person"


def test_get_contact_by_id():
    """Test getting single contact by ID."""
    # Create contact
    create_response = client.post("/contacts/", json={
        "contact_type": "person",
        "person": {"first_name": "Test", "last_name": "Contact"}
    })
    contact_id = create_response.json()["id"]

    # Get contact
    response = client.get(f"/contacts/{contact_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == contact_id


def test_get_contact_by_code():
    """Test getting contact by human-readable code."""
    # Create contact
    create_response = client.post("/contacts/", json={
        "contact_type": "person",
        "person": {"first_name": "Test", "last_name": "Contact"}
    })
    contact_code = create_response.json()["contact_code"]

    # Get by code
    response = client.get(f"/contacts/code/{contact_code}")
    assert response.status_code == 200
    data = response.json()
    assert data["contact_code"] == contact_code


def test_get_contact_not_found():
    """Test getting non-existent contact returns 404."""
    fake_uuid = str(uuid4())
    response = client.get(f"/contacts/{fake_uuid}")
    assert response.status_code == 404


def test_update_contact():
    """Test updating existing contact."""
    # Create contact
    create_response = client.post("/contacts/", json={
        "contact_type": "person",
        "person": {"first_name": "Original", "last_name": "Name"}
    })
    contact_id = create_response.json()["id"]

    # Update contact (note: actual update endpoint may differ)
    response = client.patch(f"/contacts/{contact_id}", json={
        "person": {"first_name": "Updated"}
    })
    assert response.status_code == 200


def test_soft_delete_contact():
    """Test soft deleting contact (sets is_deleted=True)."""
    # Create contact
    create_response = client.post("/contacts/", json={
        "contact_type": "person",
        "person": {"first_name": "ToDelete", "last_name": "Contact"}
    })
    contact_id = create_response.json()["id"]

    # Soft delete
    response = client.delete(f"/contacts/{contact_id}")
    assert response.status_code == 200

    # Verify soft deleted (not visible in normal list)
    list_response = client.get("/contacts/")
    data = list_response.json()
    assert all(item["id"] != contact_id for item in data["items"])

    # Verify visible with include_deleted
    list_response = client.get("/contacts/?include_deleted=true")
    data = list_response.json()
    deleted_contact = next((c for c in data["items"] if c["id"] == contact_id), None)
    assert deleted_contact is not None
    assert deleted_contact["is_deleted"] is True


def test_restore_contact():
    """Test restoring soft-deleted contact."""
    # Create and delete contact
    create_response = client.post("/contacts/", json={
        "contact_type": "person",
        "person": {"first_name": "ToRestore", "last_name": "Contact"}
    })
    contact_id = create_response.json()["id"]
    client.delete(f"/contacts/{contact_id}")

    # Restore
    response = client.post(f"/contacts/{contact_id}/restore")
    assert response.status_code == 200

    # Verify restored
    get_response = client.get(f"/contacts/{contact_id}")
    assert get_response.status_code == 200
    assert get_response.json()["is_deleted"] is False


# ================================================================
# ROLE TESTS
# ================================================================

def test_add_role_to_contact():
    """Test adding role to contact."""
    # Create contact
    create_response = client.post("/contacts/", json={
        "contact_type": "person",
        "person": {"first_name": "Test", "last_name": "Person"}
    })
    contact_id = create_response.json()["id"]

    # Add role (need role_type_id - would need seed data)
    # This is a placeholder - actual test needs valid role_type_id
    # response = client.post(f"/contacts/{contact_id}/roles", json={
    #     "role_type_id": "<valid-role-type-uuid>",
    #     "valid_from": "2025-01-01"
    # })
    # assert response.status_code == 201


def test_list_contact_roles():
    """Test listing roles for a contact."""
    # Create contact
    create_response = client.post("/contacts/", json={
        "contact_type": "person",
        "person": {"first_name": "Test", "last_name": "Person"}
    })
    contact_id = create_response.json()["id"]

    # List roles
    response = client.get(f"/contacts/{contact_id}/roles")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


# ================================================================
# COMMUNICATION TESTS
# ================================================================

def test_add_email_to_contact():
    """Test adding email to contact."""
    # Create contact
    create_response = client.post("/contacts/", json={
        "contact_type": "person",
        "person": {"first_name": "Test", "last_name": "Person"}
    })
    contact_id = create_response.json()["id"]

    # Add email
    response = client.post(f"/contacts/{contact_id}/emails", json={
        "email": "test@example.com",
        "email_type": "work",
        "is_primary": True
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"


def test_add_phone_to_contact():
    """Test adding phone to contact."""
    # Create contact
    create_response = client.post("/contacts/", json={
        "contact_type": "person",
        "person": {"first_name": "Test", "last_name": "Person"}
    })
    contact_id = create_response.json()["id"]

    # Add phone (need country_id - would need seed data)
    # response = client.post(f"/contacts/{contact_id}/phones", json={
    #     "phone_number": "911123456",
    #     "country_id": "<valid-country-uuid>",
    #     "phone_type": "mobile",
    #     "is_primary": True
    # })
    # assert response.status_code == 201


# ================================================================
# REFERENCE DATA TESTS
# ================================================================

def test_list_role_types():
    """Test listing role types reference data."""
    response = client.get("/reference/role-types")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_list_countries():
    """Test listing countries reference data."""
    response = client.get("/reference/countries")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_list_languages():
    """Test listing languages reference data."""
    response = client.get("/reference/languages")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_list_legal_forms():
    """Test listing legal forms reference data."""
    response = client.get("/reference/legal-forms")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


# ================================================================
# SEARCH TESTS
# ================================================================

def test_search_contacts():
    """Test searching contacts by name."""
    # Create contacts
    client.post("/contacts/", json={
        "contact_type": "person",
        "person": {"first_name": "Ján", "last_name": "Novák"}
    })
    client.post("/contacts/", json={
        "contact_type": "person",
        "person": {"first_name": "Peter", "last_name": "Horváth"}
    })

    # Search
    response = client.get("/contacts/?search=Novák")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert "Novák" in data["items"][0]["display_name"]
