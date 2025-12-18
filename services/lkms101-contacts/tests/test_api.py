"""
================================================================
Contact Service (MDM) - API Tests
================================================================
File: services/lkms101-contacts/tests/test_api.py
Version: v1.0.0
Created: 2025-11-08
Description:
  pytest tests for REST API endpoints.
================================================================
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

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


def test_create_item():
    """Test creating new item."""
    response = client.post(
        "/contacts/",
        json={"name": "Test Item", "description": "Test description", "is_active": True},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Item"
    assert "id" in data
    assert "created_at" in data


def test_list_items():
    """Test listing all items."""
    # Create test items
    client.post("/contacts/", json={"name": "Item 1"})
    client.post("/contacts/", json={"name": "Item 2"})

    # List items
    response = client.get("/contacts/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


def test_get_item():
    """Test getting single item by ID."""
    # Create item
    create_response = client.post("/contacts/", json={"name": "Test Item"})
    item_id = create_response.json()["id"]

    # Get item
    response = client.get(f"/contacts/{item_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == item_id
    assert data["name"] == "Test Item"


def test_get_item_not_found():
    """Test getting non-existent item returns 404."""
    response = client.get("/contacts/999")
    assert response.status_code == 404


def test_update_item():
    """Test updating existing item."""
    # Create item
    create_response = client.post("/contacts/", json={"name": "Original Name"})
    item_id = create_response.json()["id"]

    # Update item
    response = client.put(f"/contacts/{item_id}", json={"name": "Updated Name"})
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Name"


def test_delete_item():
    """Test deleting item."""
    # Create item
    create_response = client.post("/contacts/", json={"name": "Test Item"})
    item_id = create_response.json()["id"]

    # Delete item
    response = client.delete(f"/contacts/{item_id}")
    assert response.status_code == 204

    # Verify item is deleted
    get_response = client.get(f"/contacts/{item_id}")
    assert get_response.status_code == 404
