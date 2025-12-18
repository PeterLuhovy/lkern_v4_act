"""
================================================================
{{SERVICE_NAME}} - REST API Routes
================================================================
File: services/lkms{{SERVICE_CODE}}-{{SERVICE_SLUG}}/app/api/rest/__init__.py
Version: v1.0.0
Description:
  REST API route exports.
================================================================
"""

from app.api.rest.example import router as example_router

# MinIO uploads router (only if hasFileUpload=true in generator config)
# from app.api.rest.uploads import router as uploads_router

__all__ = [
    "example_router",
    # "uploads_router",
]
