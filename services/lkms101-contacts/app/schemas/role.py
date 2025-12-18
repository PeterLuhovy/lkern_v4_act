"""
================================================================
FILE: role.py
PATH: /services/lkms101-contacts/app/schemas/role.py
DESCRIPTION: Pydantic schemas for ContactRole
VERSION: v1.0.0
UPDATED: 2025-12-18
================================================================
"""

from pydantic import BaseModel, Field, computed_field
from datetime import datetime, date
from typing import Optional
from uuid import UUID

from app.schemas.reference import RoleTypeResponse


# ================================================================
# ROLE SCHEMAS
# ================================================================

class RoleBase(BaseModel):
    """Base schema for contact role."""
    role_type_id: UUID
    is_primary: bool = False
    related_contact_id: Optional[UUID] = None
    valid_from: Optional[date] = None
    valid_to: Optional[date] = None


class RoleCreate(RoleBase):
    """Schema for adding role to contact."""
    pass


class RoleUpdate(BaseModel):
    """Schema for updating contact role."""
    is_primary: Optional[bool] = None
    related_contact_id: Optional[UUID] = None
    valid_to: Optional[date] = None


class RoleResponse(RoleBase):
    """Schema for contact role response."""
    id: UUID
    contact_id: UUID
    created_at: datetime
    updated_at: datetime
    created_by_id: Optional[UUID] = None
    role_type: Optional[RoleTypeResponse] = None

    @computed_field
    @property
    def is_active(self) -> bool:
        """Check if role is currently active."""
        return self.valid_to is None

    class Config:
        from_attributes = True


class RoleListResponse(BaseModel):
    """Schema for listing contact roles."""
    contact_id: UUID
    roles: list[RoleResponse]
    total: int
