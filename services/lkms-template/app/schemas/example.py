"""
================================================================
{{SERVICE_NAME}} - Example Schemas
================================================================
File: services/lkms{{SERVICE_CODE}}-{{SERVICE_SLUG}}/app/schemas/example.py
Version: v2.0.0
Created: 2025-11-08
Updated: 2025-12-16
Description:
  Pydantic schemas for {{MODEL_NAME}} validation and serialization.

  Features:
  - Rich enum validation (Type, Status, Priority)
  - JSON attachments schema
  - Soft delete support (is_deleted computed field)
  - Lifecycle timestamps
  - Pessimistic Locking schemas
================================================================
"""

from pydantic import BaseModel, Field, computed_field
from datetime import datetime, timezone
from typing import Optional, List
from uuid import UUID
from app.models.enums import {{MODEL_NAME}}Type, {{MODEL_NAME}}Status, {{MODEL_NAME}}Priority


# ================================================================
# ATTACHMENT SCHEMA
# ================================================================

class AttachmentMetadata(BaseModel):
    """Schema for file attachment metadata stored in JSON column."""

    filename: str = Field(..., description="Original filename")
    size: int = Field(..., ge=0, description="File size in bytes")
    mimetype: str = Field(..., description="MIME type (e.g., application/pdf)")
    url: str = Field(..., description="Download URL or storage path")
    uploaded_at: Optional[datetime] = Field(None, description="Upload timestamp")


# ================================================================
# CORE SCHEMAS
# ================================================================

class {{MODEL_NAME}}Base(BaseModel):
    """Base schema with common fields."""

    name: str = Field(..., min_length=1, max_length=255, description="Entity name")
    description: Optional[str] = Field(None, max_length=1000, description="Entity description")
    is_active: bool = Field(True, description="Active status")


class {{MODEL_NAME}}Create({{MODEL_NAME}}Base):
    """
    Schema for creating new {{MODEL_NAME}}.

    Required: name, type
    Optional: description, priority, attachments
    Auto-generated: entity_code, status (OPEN), created_at
    """

    type: {{MODEL_NAME}}Type = Field(..., description="Entity type classification")
    priority: {{MODEL_NAME}}Priority = Field(
        default={{MODEL_NAME}}Priority.MEDIUM,
        description="Priority level"
    )
    attachments: Optional[List[AttachmentMetadata]] = Field(
        None,
        description="Initial attachments (if any)"
    )


class {{MODEL_NAME}}Update(BaseModel):
    """
    Schema for updating existing {{MODEL_NAME}}.

    All fields optional - only provided fields are updated.
    Note: entity_code and type cannot be changed after creation.
    """

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    is_active: Optional[bool] = None
    priority: Optional[{{MODEL_NAME}}Priority] = None
    attachments: Optional[List[AttachmentMetadata]] = None


class {{MODEL_NAME}}Response({{MODEL_NAME}}Base):
    """
    Schema for {{MODEL_NAME}} response (includes all database fields).

    Includes computed fields:
    - is_locked: Check if record is currently locked
    - is_deleted: Check if record has been soft-deleted
    """

    id: UUID
    entity_code: str = Field(..., description="Human-readable code (PREFIX-RRMM-NNNN)")

    # Classification
    type: {{MODEL_NAME}}Type
    status: {{MODEL_NAME}}Status
    priority: {{MODEL_NAME}}Priority

    # Attachments
    attachments: Optional[List[AttachmentMetadata]] = None

    # Timestamps
    created_at: datetime
    updated_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None

    # Pessimistic Locking info
    locked_by_id: Optional[UUID] = None
    locked_by_name: Optional[str] = None
    locked_at: Optional[datetime] = None

    @computed_field
    @property
    def is_locked(self) -> bool:
        """Check if record is currently locked (not expired)."""
        if not self.locked_at:
            return False
        # Lock expires after 30 minutes
        lock_age = datetime.now(timezone.utc) - self.locked_at.replace(tzinfo=timezone.utc)
        return lock_age.total_seconds() < (30 * 60)

    @computed_field
    @property
    def is_deleted(self) -> bool:
        """Check if record has been soft-deleted."""
        return self.deleted_at is not None

    class Config:
        from_attributes = True  # Pydantic v2 (was orm_mode in v1)


# ================================================================
# STATUS CHANGE SCHEMAS
# ================================================================

class StatusChangeRequest(BaseModel):
    """Schema for changing entity status."""

    status: {{MODEL_NAME}}Status = Field(..., description="New status")
    comment: Optional[str] = Field(None, max_length=500, description="Status change comment")


class StatusChangeResponse(BaseModel):
    """Response for status change operation."""

    id: UUID
    entity_code: str
    old_status: {{MODEL_NAME}}Status
    new_status: {{MODEL_NAME}}Status
    changed_at: datetime
    message: str = "Status changed successfully"


# ================================================================
# SOFT DELETE SCHEMAS
# ================================================================

class DeleteResponse(BaseModel):
    """Response for soft delete operation."""

    id: UUID
    entity_code: str
    status: str = "deleted"
    deleted_at: datetime
    message: str = "Record soft-deleted successfully"


class RestoreResponse(BaseModel):
    """Response for restore operation."""

    id: UUID
    entity_code: str
    status: str = "restored"
    message: str = "Record restored successfully"


# ================================================================
# LOCKING SCHEMAS
# ================================================================

class LockRequest(BaseModel):
    """Request body for lock acquisition (optional - can include user info)."""

    user_name: Optional[str] = Field(None, description="User display name (fallback)")


class LockResponse(BaseModel):
    """Response for successful lock acquisition."""

    locked_by_id: UUID
    locked_by_name: str
    locked_at: datetime
    message: str = "Lock acquired successfully"


class LockConflictDetail(BaseModel):
    """Detail object for lock conflict response."""

    message: str = "Record is locked by another user"
    locked_by_id: UUID
    locked_by_name: str
    locked_at: datetime


class UnlockResponse(BaseModel):
    """Response for successful lock release."""

    status: str = "unlocked"
    message: str = "Lock released successfully"
