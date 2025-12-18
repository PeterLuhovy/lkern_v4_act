"""
================================================================
Issues Service - API Tests
================================================================
File: services/lkms105-issues/tests/test_api.py
Version: v2.0.0
Created: 2025-11-08
Updated: 2025-12-16
Description:
  pytest tests for REST API endpoints including CRUD, validation,
  error handling, and integration tests.
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
        "/issues/",
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
    client.post("/issues/", json={"name": "Item 1"})
    client.post("/issues/", json={"name": "Item 2"})

    # List items
    response = client.get("/issues/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


def test_get_item():
    """Test getting single item by ID."""
    # Create item
    create_response = client.post("/issues/", json={"name": "Test Item"})
    item_id = create_response.json()["id"]

    # Get item
    response = client.get(f"/issues/{item_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == item_id
    assert data["name"] == "Test Item"


def test_get_item_not_found():
    """Test getting non-existent item returns 404."""
    response = client.get("/issues/999")
    assert response.status_code == 404


def test_update_item():
    """Test updating existing item."""
    # Create item
    create_response = client.post("/issues/", json={"name": "Original Name"})
    item_id = create_response.json()["id"]

    # Update item
    response = client.put(f"/issues/{item_id}", json={"name": "Updated Name"})
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Name"


def test_delete_item():
    """Test deleting item."""
    # Create item
    create_response = client.post("/issues/", json={"name": "Test Item"})
    item_id = create_response.json()["id"]

    # Delete item
    response = client.delete(f"/issues/{item_id}")
    assert response.status_code == 204

    # Verify item is deleted
    get_response = client.get(f"/issues/{item_id}")
    assert get_response.status_code == 404


# ================================================================
# VALIDATION TESTS
# ================================================================

def test_create_item_empty_name():
    """Test creating item with empty name returns validation error."""
    response = client.post("/issues/", json={"name": ""})
    # Should return 422 (Unprocessable Entity) for validation error
    assert response.status_code in [400, 422]


def test_create_item_missing_name():
    """Test creating item without name field returns validation error."""
    response = client.post("/issues/", json={"description": "No name"})
    assert response.status_code in [400, 422]


def test_create_item_invalid_json():
    """Test creating item with invalid JSON returns 422."""
    response = client.post(
        "/issues/",
        content="not valid json",
        headers={"Content-Type": "application/json"}
    )
    assert response.status_code == 422


def test_create_item_wrong_type():
    """Test creating item with wrong type for field returns validation error."""
    response = client.post("/issues/", json={"name": 12345})  # name should be string
    # May accept due to coercion, or reject with 422
    # If accepted, verify the conversion
    if response.status_code == 201:
        data = response.json()
        assert isinstance(data["name"], str)
    else:
        assert response.status_code in [400, 422]


def test_update_item_not_found():
    """Test updating non-existent item returns 404."""
    response = client.put("/issues/99999", json={"name": "Updated Name"})
    assert response.status_code == 404


def test_delete_item_not_found():
    """Test deleting non-existent item returns 404."""
    response = client.delete("/issues/99999")
    assert response.status_code == 404


# ================================================================
# ERROR HANDLING TESTS
# ================================================================

def test_404_for_nonexistent_endpoint():
    """Test 404 returned for nonexistent endpoints."""
    response = client.get("/nonexistent")
    assert response.status_code == 404


def test_405_for_wrong_method():
    """Test 405 returned for wrong HTTP method."""
    response = client.patch("/health")  # GET endpoint, PATCH not allowed
    assert response.status_code == 405


def test_error_response_structure():
    """Test error responses have proper structure."""
    response = client.get("/issues/99999")
    assert response.status_code == 404
    data = response.json()
    assert "detail" in data


# ================================================================
# INTEGRATION TESTS
# ================================================================

def test_full_crud_flow():
    """Test complete CRUD flow for issues."""
    # 1. Create issue
    create_response = client.post(
        "/issues/",
        json={"name": "Integration Test Issue", "description": "Test description"}
    )
    assert create_response.status_code == 201
    issue_id = create_response.json()["id"]

    # 2. Read issue
    get_response = client.get(f"/issues/{issue_id}")
    assert get_response.status_code == 200
    assert get_response.json()["name"] == "Integration Test Issue"

    # 3. Update issue
    update_response = client.put(
        f"/issues/{issue_id}",
        json={"name": "Updated Issue Name"}
    )
    assert update_response.status_code == 200
    assert update_response.json()["name"] == "Updated Issue Name"

    # 4. Verify update persisted
    verify_response = client.get(f"/issues/{issue_id}")
    assert verify_response.json()["name"] == "Updated Issue Name"

    # 5. Delete issue
    delete_response = client.delete(f"/issues/{issue_id}")
    assert delete_response.status_code == 204

    # 6. Verify deletion
    final_response = client.get(f"/issues/{issue_id}")
    assert final_response.status_code == 404


def test_api_documentation_available():
    """Test OpenAPI documentation is available."""
    # Swagger UI
    response = client.get("/docs")
    assert response.status_code == 200

    # ReDoc
    response = client.get("/redoc")
    assert response.status_code == 200

    # OpenAPI schema
    response = client.get("/openapi.json")
    assert response.status_code == 200
    schema = response.json()
    assert "openapi" in schema
    assert "info" in schema
    assert "paths" in schema


def test_list_items_empty():
    """Test listing items when no items exist."""
    response = client.get("/issues/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 0


def test_create_multiple_items():
    """Test creating multiple items."""
    items = [
        {"name": "Issue 1", "description": "First issue"},
        {"name": "Issue 2", "description": "Second issue"},
        {"name": "Issue 3", "description": "Third issue"},
    ]

    for item in items:
        response = client.post("/issues/", json=item)
        assert response.status_code == 201

    # Verify all items created
    list_response = client.get("/issues/")
    assert len(list_response.json()) == 3
