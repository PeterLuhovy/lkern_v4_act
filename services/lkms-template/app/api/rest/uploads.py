"""
================================================================
{{SERVICE_NAME}} - File Upload REST API
================================================================
File: services/lkms{{SERVICE_CODE}}-{{SERVICE_SLUG}}/app/api/rest/uploads.py
Version: v1.0.0
Created: 2025-12-16
Updated: 2025-12-16
Description:
  REST endpoints for file upload/download via MinIO.

  Endpoints:
  - POST   /{{ROUTE_PREFIX}}/uploads           - Upload file
  - GET    /{{ROUTE_PREFIX}}/uploads/{file_id} - Get download URL
  - DELETE /{{ROUTE_PREFIX}}/uploads/{file_id} - Delete file
  - GET    /{{ROUTE_PREFIX}}/uploads/health    - MinIO health check

  File Organization:
  Files are stored with pattern: {{ROUTE_PREFIX}}/{entity_id}/{filename}
  Example: issues/123/screenshot.png

  Security:
  - File size limit: 10MB (configurable)
  - Allowed types: configurable whitelist
  - Presigned URLs expire in 1 hour

  Usage:
    Include this router in main.py:
    from app.api.rest.uploads import router as uploads_router
    app.include_router(uploads_router)
================================================================
"""

import os
import uuid
import logging
from typing import Optional
from datetime import timedelta

from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from pydantic import BaseModel

from app.services.minio_client import get_minio_service

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/{{ROUTE_PREFIX}}/uploads",
    tags=["uploads"],
)


# ============================================================
# CONFIGURATION
# ============================================================

# Maximum file size (10MB default)
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", 10 * 1024 * 1024))

# Allowed MIME types
ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "text/csv",
}


# ============================================================
# SCHEMAS
# ============================================================

class UploadResponse(BaseModel):
    """Response after successful file upload."""
    file_id: str
    filename: str
    content_type: str
    size: int
    object_path: str
    download_url: str

    class Config:
        json_schema_extra = {
            "example": {
                "file_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                "filename": "document.pdf",
                "content_type": "application/pdf",
                "size": 102400,
                "object_path": "{{ROUTE_PREFIX}}/123/a1b2c3d4.pdf",
                "download_url": "https://minio:9000/bucket/..."
            }
        }


class DownloadResponse(BaseModel):
    """Response with presigned download URL."""
    file_id: str
    download_url: str
    expires_in_seconds: int

    class Config:
        json_schema_extra = {
            "example": {
                "file_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                "download_url": "https://minio:9000/bucket/...",
                "expires_in_seconds": 3600
            }
        }


class DeleteResponse(BaseModel):
    """Response after file deletion."""
    file_id: str
    deleted: bool
    message: str


class HealthResponse(BaseModel):
    """MinIO health check response."""
    status: str
    endpoint: str
    bucket: str
    bucket_exists: bool
    error: Optional[str] = None


# ============================================================
# ENDPOINTS
# ============================================================

@router.post(
    "",
    response_model=UploadResponse,
    summary="Upload file",
    description="Upload a file to MinIO storage. Returns presigned download URL.",
)
async def upload_file(
    file: UploadFile = File(...),
    entity_id: Optional[int] = Query(
        None,
        description="Associated entity ID for file organization"
    ),
):
    """
    Upload file to MinIO.

    **File Validation:**
    - Maximum size: 10MB
    - Allowed types: images, PDFs, Office documents, text files

    **File Organization:**
    Files are stored as: {{ROUTE_PREFIX}}/{entity_id}/{file_id}.{ext}

    **Returns:**
    - file_id: Unique identifier for the file
    - download_url: Presigned URL (valid for 1 hour)
    """
    # Validate content type
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed: {file.content_type}. "
                   f"Allowed types: {', '.join(ALLOWED_CONTENT_TYPES)}"
        )

    # Read file content
    content = await file.read()
    file_size = len(content)

    # Validate file size
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large: {file_size} bytes. Maximum: {MAX_FILE_SIZE} bytes"
        )

    # Generate unique file ID
    file_id = str(uuid.uuid4())

    # Get file extension
    ext = ""
    if file.filename and "." in file.filename:
        ext = "." + file.filename.rsplit(".", 1)[1].lower()

    # Build object path
    if entity_id:
        object_path = f"{{ROUTE_PREFIX}}/{entity_id}/{file_id}{ext}"
    else:
        object_path = f"{{ROUTE_PREFIX}}/general/{file_id}{ext}"

    # Upload to MinIO
    try:
        minio = get_minio_service()

        # Create file-like object from content
        from io import BytesIO
        file_data = BytesIO(content)

        minio.upload_file(
            file_data=file_data,
            object_name=object_path,
            content_type=file.content_type,
            file_size=file_size,
        )

        # Generate presigned download URL
        download_url = minio.get_presigned_url(object_path)

        logger.info(f"Uploaded file: {object_path} ({file_size} bytes)")

        return UploadResponse(
            file_id=file_id,
            filename=file.filename or f"{file_id}{ext}",
            content_type=file.content_type,
            size=file_size,
            object_path=object_path,
            download_url=download_url,
        )

    except Exception as e:
        logger.error(f"Upload failed: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"File upload failed: {str(e)}"
        )


@router.get(
    "/{file_path:path}",
    response_model=DownloadResponse,
    summary="Get download URL",
    description="Get presigned download URL for a file.",
)
async def get_download_url(
    file_path: str,
    expires_hours: int = Query(1, ge=1, le=24, description="URL expiration in hours"),
):
    """
    Get presigned download URL for file.

    **Parameters:**
    - file_path: Full object path (e.g., "{{ROUTE_PREFIX}}/123/abc123.pdf")
    - expires_hours: URL validity (1-24 hours, default: 1)

    **Returns:**
    - Presigned URL that allows temporary download access
    """
    try:
        minio = get_minio_service()

        # Check if file exists
        if not minio.file_exists(file_path):
            raise HTTPException(
                status_code=404,
                detail=f"File not found: {file_path}"
            )

        # Generate presigned URL
        expires = timedelta(hours=expires_hours)
        download_url = minio.get_presigned_url(file_path, expires=expires)

        # Extract file_id from path
        file_id = file_path.rsplit("/", 1)[-1].rsplit(".", 1)[0]

        return DownloadResponse(
            file_id=file_id,
            download_url=download_url,
            expires_in_seconds=int(expires.total_seconds()),
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get download URL: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get download URL: {str(e)}"
        )


@router.delete(
    "/{file_path:path}",
    response_model=DeleteResponse,
    summary="Delete file",
    description="Delete file from MinIO storage.",
)
async def delete_file(file_path: str):
    """
    Delete file from MinIO.

    **Parameters:**
    - file_path: Full object path to delete

    **Note:**
    This permanently deletes the file. There is no undo.
    """
    try:
        minio = get_minio_service()

        # Check if file exists
        if not minio.file_exists(file_path):
            raise HTTPException(
                status_code=404,
                detail=f"File not found: {file_path}"
            )

        # Delete file
        minio.delete_file(file_path)

        # Extract file_id from path
        file_id = file_path.rsplit("/", 1)[-1].rsplit(".", 1)[0]

        logger.info(f"Deleted file: {file_path}")

        return DeleteResponse(
            file_id=file_id,
            deleted=True,
            message=f"File deleted: {file_path}",
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete file: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete file: {str(e)}"
        )


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="MinIO health check",
    description="Check MinIO connectivity and bucket status.",
)
async def health_check():
    """
    Check MinIO health.

    **Returns:**
    - status: "healthy" or "unhealthy"
    - endpoint: MinIO server address
    - bucket: Target bucket name
    - bucket_exists: Whether bucket is accessible
    """
    try:
        minio = get_minio_service()
        health = minio.health_check()
        return HealthResponse(**health)

    except Exception as e:
        logger.error(f"MinIO health check failed: {e}")
        return HealthResponse(
            status="unhealthy",
            endpoint="unknown",
            bucket="unknown",
            bucket_exists=False,
            error=str(e),
        )
