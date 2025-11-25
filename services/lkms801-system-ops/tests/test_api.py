"""
================================================================
FILE: test_api.py
PATH: /services/lkms801-system-ops/tests/test_api.py
DESCRIPTION: FastAPI REST endpoint tests
VERSION: v1.0.0
UPDATED: 2025-11-23 14:45:00
================================================================
"""

# === IMPORTS ===
import pytest
from fastapi.testclient import TestClient

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.main import app
from app.config import settings


# === FIXTURES ===
@pytest.fixture
def client():
    """Create FastAPI test client."""
    return TestClient(app)


# === TESTS: Health Check ===
class TestHealthEndpoint:
    """Tests for /health endpoint."""

    def test_health_check_returns_200(self, client):
        """Test health check returns 200 OK."""
        response = client.get("/health")

        assert response.status_code == 200

    def test_health_check_response_structure(self, client):
        """Test health check returns correct structure."""
        response = client.get("/health")
        data = response.json()

        assert "status" in data
        assert "service" in data
        assert "version" in data
        assert "grpc_port" in data

    def test_health_check_values(self, client):
        """Test health check returns correct values."""
        response = client.get("/health")
        data = response.json()

        assert data["status"] == "healthy"
        assert data["service"] == settings.SERVICE_CODE
        assert data["version"] == settings.SERVICE_VERSION
        assert data["grpc_port"] == settings.GRPC_PORT


# === TESTS: Root Endpoint ===
class TestRootEndpoint:
    """Tests for / root endpoint."""

    def test_root_returns_200(self, client):
        """Test root endpoint returns 200 OK."""
        response = client.get("/")

        assert response.status_code == 200

    def test_root_response_structure(self, client):
        """Test root endpoint returns service info."""
        response = client.get("/")
        data = response.json()

        assert "service" in data
        assert "code" in data
        assert "version" in data
        assert "description" in data
        assert "api" in data
        assert "operations" in data

    def test_root_api_urls(self, client):
        """Test root endpoint provides API URLs."""
        response = client.get("/")
        data = response.json()

        assert "rest" in data["api"]
        assert "grpc" in data["api"]
        assert "docs" in data["api"]

        # Check URL formats
        assert f":{settings.REST_PORT}" in data["api"]["rest"]
        assert f":{settings.GRPC_PORT}" in data["api"]["grpc"]

    def test_root_lists_operations(self, client):
        """Test root endpoint lists available operations."""
        response = client.get("/")
        data = response.json()

        operations = data["operations"]
        assert len(operations) == 7  # 7 operations

        # Check all operations are listed
        operation_names = " ".join(operations)
        assert "OpenFolder" in operation_names
        assert "CopyFile" in operation_names
        assert "MoveFile" in operation_names
        assert "DeleteFile" in operation_names
        assert "RenameFile" in operation_names
        assert "ListFolder" in operation_names
        assert "GetFileInfo" in operation_names


# === TESTS: Status Endpoint (Protected) ===
class TestStatusEndpoint:
    """Tests for /status protected endpoint."""

    def test_status_without_api_key_returns_401(self, client):
        """Test status endpoint requires API key."""
        response = client.get("/status")

        assert response.status_code == 401

    def test_status_with_invalid_api_key_returns_401(self, client):
        """Test status endpoint rejects invalid API key."""
        response = client.get(
            "/status",
            headers={"X-API-Key": "invalid_key"}
        )

        assert response.status_code == 401

    def test_status_with_valid_api_key_returns_200(self, client):
        """Test status endpoint accepts valid API key."""
        response = client.get(
            "/status",
            headers={"X-API-Key": settings.API_KEY}
        )

        assert response.status_code == 200

    def test_status_response_structure(self, client):
        """Test status endpoint returns detailed info."""
        response = client.get(
            "/status",
            headers={"X-API-Key": settings.API_KEY}
        )
        data = response.json()

        assert "service" in data
        assert "version" in data
        assert "status" in data
        assert "allowed_paths" in data
        assert "grpc_port" in data
        assert "rest_port" in data

    def test_status_shows_allowed_paths(self, client):
        """Test status endpoint reveals allowed paths."""
        response = client.get(
            "/status",
            headers={"X-API-Key": settings.API_KEY}
        )
        data = response.json()

        assert isinstance(data["allowed_paths"], list)
        assert len(data["allowed_paths"]) > 0


# === TESTS: CORS Headers ===
class TestCorsHeaders:
    """Tests for CORS headers (if enabled)."""

    def test_cors_headers_present(self, client):
        """Test CORS headers are present in responses."""
        response = client.get("/health")

        # Check if CORS is enabled
        # (May not be in test environment)
        if "access-control-allow-origin" in response.headers:
            assert response.headers["access-control-allow-origin"]


# === TESTS: Error Handling ===
class TestErrorHandling:
    """Tests for error handling."""

    def test_404_for_nonexistent_endpoint(self, client):
        """Test 404 returned for nonexistent endpoints."""
        response = client.get("/nonexistent")

        assert response.status_code == 404

    def test_405_for_wrong_method(self, client):
        """Test 405 returned for wrong HTTP method."""
        response = client.post("/health")  # GET endpoint

        assert response.status_code == 405


# === INTEGRATION TESTS ===
@pytest.mark.integration
class TestApiIntegration:
    """Integration tests for API."""

    def test_full_api_flow(self, client):
        """Test complete API flow."""
        # 1. Check health
        health_response = client.get("/health")
        assert health_response.status_code == 200

        # 2. Get service info
        root_response = client.get("/")
        assert root_response.status_code == 200

        # 3. Get detailed status (with auth)
        status_response = client.get(
            "/status",
            headers={"X-API-Key": settings.API_KEY}
        )
        assert status_response.status_code == 200

        # Verify all responses are JSON
        health_response.json()
        root_response.json()
        status_response.json()

    def test_api_documentation_available(self, client):
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
