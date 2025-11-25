"""
================================================================
Issues Service - DeletionAudit Model
================================================================
File: services/lkms105-issues/app/models/deletion_audit.py
Version: v1.0.0
Created: 2025-11-24
Description:
  SQLAlchemy model for deletion audit trail.
  Tracks deletion operations: status, files deleted, failures, retry attempts.
================================================================
"""

from sqlalchemy import Column, Integer, String, DateTime, JSON, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import enum
import uuid

from app.database import Base


class DeletionStatus(str, enum.Enum):
    """Deletion operation status."""
    PENDING = "pending"           # Deletion started
    COMPLETED = "completed"       # Fully deleted (DB + external resources)
    FAILED = "failed"             # Complete failure (nothing deleted)
    PARTIAL = "partial"           # Some resources deleted, some failed


class DeletionAudit(Base):
    """
    Audit log for deletion operations.

    Tracks:
    - What was deleted (item_id, item_code)
    - When deletion occurred (timestamps)
    - What external resources were involved (files_found, files_deleted)
    - Failures (files_failed, error_message)
    - Final status (completed, partial, failed)
    """
    __tablename__ = "deletion_audit"

    id = Column(Integer, primary_key=True, autoincrement=True)

    # Item identification
    item_id = Column(
        UUID(as_uuid=True),
        nullable=False,
        index=True,
        comment="ID of deleted item"
    )
    item_code = Column(
        String(50),
        nullable=False,
        comment="Human-readable code (e.g. ISSUE-001)"
    )
    item_type = Column(
        String(50),
        nullable=False,
        comment="Type of item (issue, contact, order, etc.)"
    )

    # Deletion tracking
    status = Column(
        SQLEnum(DeletionStatus, values_callable=lambda x: [e.value for e in x]),
        nullable=False,
        default=DeletionStatus.PENDING,
        comment="Deletion status"
    )

    # External resources tracking
    files_found = Column(
        Integer,
        default=0,
        comment="Number of files found in MinIO"
    )
    files_deleted = Column(
        Integer,
        default=0,
        comment="Number of files successfully deleted"
    )
    files_failed = Column(
        JSON,
        nullable=True,
        comment="List of files that failed to delete (array of objects)"
    )

    # Error details
    error_message = Column(
        String(1000),
        nullable=True,
        comment="Error message if deletion failed"
    )

    # Timestamps
    started_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        comment="Deletion start time"
    )
    completed_at = Column(
        DateTime,
        nullable=True,
        comment="Deletion completion time"
    )

    # Metadata
    deleted_by = Column(
        UUID(as_uuid=True),
        nullable=True,
        comment="User who initiated deletion"
    )

    # Phase 2 enhancements (for async background cleanup with retry logic)
    retry_count = Column(
        Integer,
        default=0,
        comment="Number of retry attempts (Phase 2)"
    )
    last_retry_at = Column(
        DateTime,
        nullable=True,
        comment="Last retry attempt timestamp (Phase 2)"
    )
    scheduled_at = Column(
        DateTime,
        nullable=True,
        comment="When Celery task was scheduled (Phase 2)"
    )
    celery_task_id = Column(
        String(255),
        nullable=True,
        comment="Celery task UUID (Phase 2)"
    )

    def __repr__(self):
        return f"<DeletionAudit {self.item_code} ({self.status.value})>"
