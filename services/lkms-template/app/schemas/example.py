"""
================================================================
{{SERVICE_NAME}} - Example Schemas
================================================================
File: services/lkms{{SERVICE_CODE}}-{{SERVICE_SLUG}}/app/schemas/example.py
Version: v1.1.0
Created: 2025-11-08
Updated: 2025-12-07
Description:
  Pydantic schemas for {{MODEL_NAME}} validation and serialization.
  Includes Pessimistic Locking schemas.
================================================================
"""

from pydantic import BaseModel, Field, computed_field
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID


class {{MODEL_NAME}}Base(BaseModel):
    """Base schema with common fields."""

    name: str = Field(..., min_length=1, max_length=255, description="Entity name")
    description: Optional[str] = Field(None, max_length=1000, description="Entity description")
    is_active: bool = Field(True, description="Active status")


class {{MODEL_NAME}}Create({{MODEL_NAME}}Base):
    """Schema for creating new {{MODEL_NAME}}."""

    pass


class {{MODEL_NAME}}Update(BaseModel):
    """Schema for updating existing {{MODEL_NAME}}."""

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    is_active: Optional[bool] = None


class {{MODEL_NAME}}Response({{MODEL_NAME}}Base):
    """Schema for {{MODEL_NAME}} response (includes database fields)."""

    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

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

    class Config:
        from_attributes = True  # Pydantic v2 (was orm_mode in v1)


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
