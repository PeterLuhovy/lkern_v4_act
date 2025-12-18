"""
================================================================
{{SERVICE_NAME}} - Services
================================================================
File: services/lkms{{SERVICE_CODE}}-{{SERVICE_SLUG}}/app/services/__init__.py
Version: v1.0.0
Created: 2025-12-16
Updated: 2025-12-16
Description:
  Service layer exports.
  Business logic and utilities.
================================================================
"""

from app.services.code_generator import generate_entity_code

# MinIO client (only if hasFileUpload=true in generator config)
# from app.services.minio_client import MinioService, get_minio_service

__all__ = [
    "generate_entity_code",
    # "MinioService",
    # "get_minio_service",
]
