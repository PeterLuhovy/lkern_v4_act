"""
================================================================
Issues Service - MinIO Client
================================================================
File: services/lkms105-issues/app/services/minio_client.py
Version: v1.0.0
Created: 2025-11-08
Description:
  MinIO (S3-compatible) client for file attachment storage.
================================================================
"""

from minio import Minio
from minio.error import S3Error
from io import BytesIO
import logging
from typing import Optional

from app.config import settings

logger = logging.getLogger(__name__)


class MinIOClient:
    """MinIO client wrapper for file operations."""

    def __init__(self):
        """Initialize MinIO client and ensure bucket exists."""
        self.client = Minio(
            f"{settings.MINIO_HOST}:{settings.MINIO_PORT}",
            access_key=settings.MINIO_ACCESS_KEY,
            secret_key=settings.MINIO_SECRET_KEY,
            secure=settings.MINIO_SECURE
        )
        self.bucket = settings.MINIO_BUCKET

        # Create bucket if doesn't exist
        self._ensure_bucket()

    def _ensure_bucket(self):
        """Create bucket if it doesn't exist."""
        try:
            if not self.client.bucket_exists(self.bucket):
                self.client.make_bucket(self.bucket)
                logger.info(f"Created MinIO bucket: {self.bucket}")
            else:
                logger.info(f"MinIO bucket exists: {self.bucket}")
        except S3Error as e:
            logger.error(f"Error ensuring bucket: {e}")
            raise

    def upload_file(
        self,
        file_data: bytes,
        object_name: str,
        content_type: str = "application/octet-stream"
    ) -> str:
        """
        Upload file to MinIO.

        Args:
            file_data: File bytes
            object_name: Object name in bucket (e.g., "issue-uuid/filename.png")
            content_type: MIME type

        Returns:
            Object name (path in bucket)
        """
        try:
            file_stream = BytesIO(file_data)
            self.client.put_object(
                self.bucket,
                object_name,
                file_stream,
                length=len(file_data),
                content_type=content_type
            )
            logger.info(f"Uploaded file: {object_name}")
            return object_name
        except S3Error as e:
            logger.error(f"Error uploading file {object_name}: {e}")
            raise

    def download_file(self, object_name: str) -> Optional[bytes]:
        """
        Download file from MinIO.

        Args:
            object_name: Object name in bucket

        Returns:
            File bytes or None if not found
        """
        try:
            response = self.client.get_object(self.bucket, object_name)
            data = response.read()
            response.close()
            response.release_conn()
            logger.info(f"Downloaded file: {object_name}")
            return data
        except S3Error as e:
            logger.error(f"Error downloading file {object_name}: {e}")
            return None

    def delete_file(self, object_name: str) -> bool:
        """
        Delete file from MinIO.

        Args:
            object_name: Object name in bucket

        Returns:
            True if deleted, False otherwise
        """
        try:
            self.client.remove_object(self.bucket, object_name)
            logger.info(f"Deleted file: {object_name}")
            return True
        except S3Error as e:
            logger.error(f"Error deleting file {object_name}: {e}")
            return False

    def list_files(self, prefix: str = "") -> list[str]:
        """
        List files in bucket with optional prefix.

        Args:
            prefix: Object name prefix (e.g., "issue-uuid/")

        Returns:
            List of object names
        """
        try:
            objects = self.client.list_objects(self.bucket, prefix=prefix)
            file_list = [obj.object_name for obj in objects]
            logger.info(f"Listed {len(file_list)} files with prefix: {prefix}")
            return file_list
        except S3Error as e:
            logger.error(f"Error listing files: {e}")
            return []


# Global MinIO client instance
minio_client = MinIOClient()
