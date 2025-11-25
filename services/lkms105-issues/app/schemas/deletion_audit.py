"""
================================================================
Issues Service - DeletionAudit Schemas
================================================================
File: services/lkms105-issues/app/schemas/deletion_audit.py
Version: v1.0.0
Created: 2025-11-24
Description:
  Pydantic schemas for deletion audit trail API responses.
================================================================
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import UUID

from app.models.deletion_audit import DeletionStatus


class DeletionAuditResponse(BaseModel):
    """Response schema for deletion audit record."""

    id: int = Field(..., description="Audit record ID")

    # Item identification
    item_id: UUID = Field(..., description="ID of deleted item")
    item_code: str = Field(..., description="Human-readable code (e.g. ISSUE-001)")
    item_type: str = Field(..., description="Type of item (issue, contact, order)")

    # Deletion tracking
    status: DeletionStatus = Field(..., description="Deletion status")

    # External resources tracking
    files_found: int = Field(0, description="Number of files found in MinIO")
    files_deleted: int = Field(0, description="Number of files successfully deleted")
    files_failed: Optional[List[Dict[str, Any]]] = Field(
        None,
        description="List of files that failed to delete"
    )

    # Error details
    error_message: Optional[str] = Field(None, description="Error message if deletion failed")

    # Timestamps
    started_at: datetime = Field(..., description="Deletion start time")
    completed_at: Optional[datetime] = Field(None, description="Deletion completion time")

    # Metadata
    deleted_by: Optional[UUID] = Field(None, description="User who initiated deletion")

    # Phase 2 enhancements (async background cleanup)
    retry_count: int = Field(0, description="Number of retry attempts")
    last_retry_at: Optional[datetime] = Field(None, description="Last retry timestamp")
    scheduled_at: Optional[datetime] = Field(None, description="Celery task scheduled time")
    celery_task_id: Optional[str] = Field(None, description="Celery task UUID")

    class Config:
        from_attributes = True  # Pydantic v2 (was orm_mode in v1)


class DeletionAuditListResponse(BaseModel):
    """Response schema for list of deletion audit records."""

    total: int = Field(..., description="Total number of audit records")
    records: List[DeletionAuditResponse] = Field(..., description="Audit records")
