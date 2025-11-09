"""
================================================================
Issues Service - Example Schemas
================================================================
File: services/lkms105-issues/app/schemas/example.py
Version: v1.0.0
Created: 2025-11-08
Description:
  Pydantic schemas for Issue validation and serialization.
================================================================
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class IssueBase(BaseModel):
    """Base schema with common fields."""

    name: str = Field(..., min_length=1, max_length=255, description="Entity name")
    description: Optional[str] = Field(None, max_length=1000, description="Entity description")
    is_active: bool = Field(True, description="Active status")


class IssueCreate(IssueBase):
    """Schema for creating new Issue."""

    pass


class IssueUpdate(BaseModel):
    """Schema for updating existing Issue."""

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    is_active: Optional[bool] = None


class IssueResponse(IssueBase):
    """Schema for Issue response (includes database fields)."""

    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # Pydantic v2 (was orm_mode in v1)
