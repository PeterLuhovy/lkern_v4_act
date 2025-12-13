"""
================================================================
Issues Service - MinIO Client
================================================================
File: services/lkms105-issues/app/services/minio_client.py
Version: v1.1.0
Created: 2025-11-08
Updated: 2025-12-07
Description:
  MinIO (S3-compatible) client for file attachment storage.
Changelog:
  v1.1.0 - Fixed delete_file to check if file exists before delete
           (MinIO remove_object is idempotent, doesn't error on missing files)
================================================================
"""

from minio import Minio
from minio.error import S3Error
from io import BytesIO
import logging
from typing import Optional
from urllib3.exceptions import MaxRetryError, NewConnectionError
from urllib3 import HTTPConnectionPool, HTTPSConnectionPool
import urllib3
import socket

from app.config import settings

# Short timeout for health checks (seconds)
HEALTH_CHECK_TIMEOUT = 3

logger = logging.getLogger(__name__)


class MinIOConnectionError(Exception):
    """Raised when MinIO server is not reachable."""
    pass


class MinIOClient:
    """MinIO client wrapper for file operations."""

    def __init__(self):
        """Initialize MinIO client (lazy bucket creation)."""
        self.client = Minio(
            f"{settings.MINIO_HOST}:{settings.MINIO_PORT}",
            access_key=settings.MINIO_ACCESS_KEY,
            secret_key=settings.MINIO_SECRET_KEY,
            secure=settings.MINIO_SECURE
        )
        self.bucket = settings.MINIO_BUCKET
        self._bucket_checked = False

        # Try to ensure bucket exists, but don't fail startup if MinIO is down
        try:
            self._ensure_bucket()
            self._bucket_checked = True
        except MinIOConnectionError:
            logger.warning("MinIO not available at startup - will retry on first operation")
        except Exception as e:
            logger.warning(f"Could not verify MinIO bucket at startup: {e}")

    def _handle_connection_error(self, e: Exception, operation: str) -> None:
        """Handle MinIO connection errors with clear logging."""
        error_msg = f"MinIO unavailable during {operation}: {str(e)}"
        logger.error(error_msg)
        raise MinIOConnectionError(error_msg) from e

    def _is_connection_error(self, e: Exception) -> bool:
        """Check if exception is a connection error."""
        return isinstance(e, (
            MaxRetryError,
            NewConnectionError,
            socket.gaierror,
            ConnectionRefusedError,
            TimeoutError,
            OSError
        )) or (
            hasattr(e, '__cause__') and self._is_connection_error(e.__cause__)
        )

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
        except Exception as e:
            if self._is_connection_error(e):
                self._handle_connection_error(e, "bucket check")
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

        Raises:
            MinIOConnectionError: When MinIO server is not reachable
        """
        try:
            response = self.client.get_object(self.bucket, object_name)
            data = response.read()
            response.close()
            response.release_conn()
            logger.info(f"Downloaded file: {object_name}")
            return data
        except S3Error as e:
            # S3Error includes NoSuchKey (file not found)
            logger.warning(f"S3Error downloading file {object_name}: {e.code} - {e.message}")
            return None
        except Exception as e:
            # Check if it's a connection error - should raise MinIOConnectionError
            if self._is_connection_error(e):
                self._handle_connection_error(e, f"download file {object_name}")
            # For other errors (file corruption, etc.), treat as not found
            logger.warning(f"Error downloading file {object_name}: {type(e).__name__} - {str(e)}")
            return None

    def delete_file(self, object_name: str) -> bool:
        """
        Delete file from MinIO.

        Args:
            object_name: Object name in bucket

        Returns:
            True if file existed and was deleted
            False if file did not exist (orphaned DB record)

        Raises:
            MinIOConnectionError: When MinIO server is not reachable
            S3Error: For other S3 errors (permission denied, bucket not found, etc.)
        """
        try:
            # First check if file exists (remove_object is idempotent - doesn't error on missing)
            try:
                self.client.stat_object(self.bucket, object_name)
            except S3Error as e:
                if e.code == "NoSuchKey":
                    logger.warning(f"File not found in MinIO (orphaned record): {object_name}")
                    return False
                # Other S3 errors (permission denied, etc.) - propagate
                logger.error(f"S3 error checking file {object_name}: {e.code} - {e}")
                raise

            # File exists, delete it
            self.client.remove_object(self.bucket, object_name)
            logger.info(f"Deleted file: {object_name}")
            return True
        except S3Error:
            # Re-raise S3 errors (already logged above or from remove_object)
            raise
        except Exception as e:
            if self._is_connection_error(e):
                self._handle_connection_error(e, f"delete file {object_name}")
            raise

    def delete_folder(self, prefix: str) -> int:
        """
        Delete all files in a folder (prefix).

        Args:
            prefix: Folder prefix (e.g., "issue-uuid/")

        Returns:
            Number of files deleted
        """
        try:
            # List all objects with prefix
            objects = self.client.list_objects(self.bucket, prefix=prefix, recursive=True)

            # Delete each object
            deleted_count = 0
            for obj in objects:
                try:
                    self.client.remove_object(self.bucket, obj.object_name)
                    deleted_count += 1
                except S3Error as e:
                    logger.error(f"Error deleting object {obj.object_name}: {e}")
                    # Continue with other objects

            logger.info(f"Deleted {deleted_count} files with prefix: {prefix}")
            return deleted_count
        except S3Error as e:
            logger.error(f"Error deleting folder {prefix}: {e}")
            return 0

    def list_files(self, prefix: str = "") -> list[str]:
        """
        List files in bucket with optional prefix.

        Args:
            prefix: Object name prefix (e.g., "issue-uuid/")

        Returns:
            List of object names

        Raises:
            MinIOConnectionError: When MinIO server is not reachable
        """
        try:
            objects = self.client.list_objects(self.bucket, prefix=prefix)
            file_list = [obj.object_name for obj in objects]
            logger.info(f"Listed {len(file_list)} files with prefix: {prefix}")
            return file_list
        except S3Error as e:
            logger.error(f"Error listing files: {e}")
            return []
        except Exception as e:
            if self._is_connection_error(e):
                self._handle_connection_error(e, f"list files with prefix {prefix}")
            raise

    def check_health(self) -> bool:
        """
        Check if MinIO is available with a short timeout.

        Returns:
            True if MinIO is reachable and bucket accessible, False otherwise
        """
        try:
            # Create a separate client with short timeout for health check
            # This prevents blocking the request for 30+ seconds when MinIO is down
            http_client = urllib3.PoolManager(
                timeout=urllib3.Timeout(connect=HEALTH_CHECK_TIMEOUT, read=HEALTH_CHECK_TIMEOUT),
                retries=urllib3.Retry(total=0, backoff_factor=0)  # No retries for health check
            )

            health_client = Minio(
                f"{settings.MINIO_HOST}:{settings.MINIO_PORT}",
                access_key=settings.MINIO_ACCESS_KEY,
                secret_key=settings.MINIO_SECRET_KEY,
                secure=settings.MINIO_SECURE,
                http_client=http_client
            )

            # Quick bucket check with timeout
            health_client.bucket_exists(self.bucket)
            return True
        except Exception as e:
            logger.warning(f"MinIO health check failed (timeout={HEALTH_CHECK_TIMEOUT}s): {type(e).__name__}")
            return False


# Global MinIO client instance
minio_client = MinIOClient()
