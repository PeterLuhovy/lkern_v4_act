"""
================================================================
{{SERVICE_NAME}} - MinIO Client
================================================================
File: services/lkms{{SERVICE_CODE}}-{{SERVICE_SLUG}}/app/services/minio_client.py
Version: v1.0.0
Created: 2025-12-16
Updated: 2025-12-16
Description:
  MinIO object storage client for file upload/download operations.
  Provides secure file handling with presigned URLs.

  Features:
  - File upload to MinIO bucket
  - File download with presigned URLs
  - File deletion
  - Bucket initialization
  - Health check

  Configuration (via environment variables):
  - MINIO_ENDPOINT: MinIO server URL (e.g., minio:9000)
  - MINIO_ACCESS_KEY: Access key for authentication
  - MINIO_SECRET_KEY: Secret key for authentication
  - MINIO_BUCKET_NAME: Target bucket name
  - MINIO_SECURE: Use HTTPS (default: false)

  Usage:
    from app.services.minio_client import MinioService

    minio = MinioService()
    file_url = minio.upload_file(file, "attachments/doc.pdf")
    download_url = minio.get_presigned_url("attachments/doc.pdf")
    minio.delete_file("attachments/doc.pdf")
================================================================
"""

import os
import logging
from typing import Optional, BinaryIO
from datetime import timedelta

from minio import Minio
from minio.error import S3Error

logger = logging.getLogger(__name__)


class MinioService:
    """
    MinIO client wrapper for file operations.

    Thread-safe: Each instance creates its own Minio client.

    Example:
        >>> minio = MinioService()
        >>> url = minio.upload_file(file_data, "path/to/file.pdf")
        >>> print(url)  # "http://minio:9000/bucket/path/to/file.pdf"
    """

    def __init__(self):
        """Initialize MinIO client from environment variables."""
        self.endpoint = os.getenv("MINIO_ENDPOINT", "minio:9000")
        self.access_key = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
        self.secret_key = os.getenv("MINIO_SECRET_KEY", "minioadmin")
        self.bucket_name = os.getenv("MINIO_BUCKET_NAME", "{{SERVICE_SLUG}}")
        self.secure = os.getenv("MINIO_SECURE", "false").lower() == "true"

        self.client = Minio(
            self.endpoint,
            access_key=self.access_key,
            secret_key=self.secret_key,
            secure=self.secure,
        )

        # Ensure bucket exists
        self._ensure_bucket()

        logger.info(f"MinIO client initialized for bucket: {self.bucket_name}")

    def _ensure_bucket(self) -> None:
        """Create bucket if it doesn't exist."""
        try:
            if not self.client.bucket_exists(self.bucket_name):
                self.client.make_bucket(self.bucket_name)
                logger.info(f"Created bucket: {self.bucket_name}")
        except S3Error as e:
            logger.error(f"Failed to ensure bucket: {e}")
            raise

    def upload_file(
        self,
        file_data: BinaryIO,
        object_name: str,
        content_type: str = "application/octet-stream",
        file_size: Optional[int] = None,
    ) -> str:
        """
        Upload file to MinIO.

        Args:
            file_data: File-like object to upload
            object_name: Path/name in bucket (e.g., "attachments/123/doc.pdf")
            content_type: MIME type (e.g., "application/pdf")
            file_size: Size in bytes (required for streaming)

        Returns:
            str: Object URL (internal, not presigned)

        Raises:
            S3Error: If upload fails

        Example:
            >>> with open("doc.pdf", "rb") as f:
            ...     url = minio.upload_file(f, "docs/doc.pdf", "application/pdf")
        """
        try:
            # If file_size not provided, try to get it
            if file_size is None:
                file_data.seek(0, 2)  # Seek to end
                file_size = file_data.tell()
                file_data.seek(0)  # Seek back to start

            self.client.put_object(
                bucket_name=self.bucket_name,
                object_name=object_name,
                data=file_data,
                length=file_size,
                content_type=content_type,
            )

            logger.info(f"Uploaded file: {object_name} ({file_size} bytes)")

            protocol = "https" if self.secure else "http"
            return f"{protocol}://{self.endpoint}/{self.bucket_name}/{object_name}"

        except S3Error as e:
            logger.error(f"Failed to upload file {object_name}: {e}")
            raise

    def get_presigned_url(
        self,
        object_name: str,
        expires: timedelta = timedelta(hours=1),
    ) -> str:
        """
        Generate presigned URL for file download.

        Args:
            object_name: Path/name in bucket
            expires: URL expiration time (default: 1 hour)

        Returns:
            str: Presigned download URL

        Example:
            >>> url = minio.get_presigned_url("docs/doc.pdf")
            >>> print(url)  # Temporary download URL
        """
        try:
            url = self.client.presigned_get_object(
                bucket_name=self.bucket_name,
                object_name=object_name,
                expires=expires,
            )
            logger.debug(f"Generated presigned URL for: {object_name}")
            return url

        except S3Error as e:
            logger.error(f"Failed to generate presigned URL for {object_name}: {e}")
            raise

    def delete_file(self, object_name: str) -> bool:
        """
        Delete file from MinIO.

        Args:
            object_name: Path/name in bucket

        Returns:
            bool: True if deleted successfully

        Example:
            >>> minio.delete_file("docs/doc.pdf")
            True
        """
        try:
            self.client.remove_object(
                bucket_name=self.bucket_name,
                object_name=object_name,
            )
            logger.info(f"Deleted file: {object_name}")
            return True

        except S3Error as e:
            logger.error(f"Failed to delete file {object_name}: {e}")
            raise

    def file_exists(self, object_name: str) -> bool:
        """
        Check if file exists in MinIO.

        Args:
            object_name: Path/name in bucket

        Returns:
            bool: True if file exists
        """
        try:
            self.client.stat_object(self.bucket_name, object_name)
            return True
        except S3Error:
            return False

    def health_check(self) -> dict:
        """
        Check MinIO connectivity and bucket status.

        Returns:
            dict: Health status
            {
                "status": "healthy" | "unhealthy",
                "endpoint": "minio:9000",
                "bucket": "{{SERVICE_SLUG}}",
                "bucket_exists": true | false,
                "error": null | "error message"
            }
        """
        try:
            bucket_exists = self.client.bucket_exists(self.bucket_name)
            return {
                "status": "healthy" if bucket_exists else "unhealthy",
                "endpoint": self.endpoint,
                "bucket": self.bucket_name,
                "bucket_exists": bucket_exists,
                "error": None,
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "endpoint": self.endpoint,
                "bucket": self.bucket_name,
                "bucket_exists": False,
                "error": str(e),
            }


# Singleton instance for convenience
_minio_service: Optional[MinioService] = None


def get_minio_service() -> MinioService:
    """
    Get or create MinIO service singleton.

    Usage:
        from app.services.minio_client import get_minio_service

        minio = get_minio_service()
        minio.upload_file(...)
    """
    global _minio_service
    if _minio_service is None:
        _minio_service = MinioService()
    return _minio_service
