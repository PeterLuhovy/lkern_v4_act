"""
================================================================
FILE: relations.py
PATH: /services/lkms101-contacts/app/schemas/relations.py
DESCRIPTION: Pydantic schemas for contact relations (tags, languages, etc.)
VERSION: v1.0.0
UPDATED: 2025-12-18
================================================================
"""

from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID

from app.schemas.reference import (
    TagResponse,
    LanguageResponse,
    CountryResponse,
    BusinessFocusAreaResponse,
)


# ================================================================
# TAG SCHEMAS
# ================================================================

class ContactTagBase(BaseModel):
    """Base schema for contact tag junction."""
    tag_id: UUID


class ContactTagCreate(ContactTagBase):
    """Schema for adding tag to contact."""
    pass


class ContactTagResponse(ContactTagBase):
    """Schema for contact tag response."""
    id: UUID
    contact_id: UUID
    created_at: datetime
    created_by_id: Optional[UUID] = None
    tag: Optional[TagResponse] = None

    class Config:
        from_attributes = True


# ================================================================
# LANGUAGE SCHEMAS
# ================================================================

class ContactLanguageBase(BaseModel):
    """Base schema for contact language junction."""
    language_id: UUID
    is_primary: bool = False


class ContactLanguageCreate(ContactLanguageBase):
    """Schema for adding language to contact."""
    pass


class ContactLanguageUpdate(BaseModel):
    """Schema for updating contact language."""
    is_primary: Optional[bool] = None


class ContactLanguageResponse(ContactLanguageBase):
    """Schema for contact language response."""
    id: UUID
    contact_id: UUID
    created_at: datetime
    updated_at: datetime
    language: Optional[LanguageResponse] = None

    class Config:
        from_attributes = True


# ================================================================
# OPERATING COUNTRY SCHEMAS
# ================================================================

class ContactOperatingCountryBase(BaseModel):
    """Base schema for contact operating country junction."""
    country_id: UUID
    is_primary: bool = False


class ContactOperatingCountryCreate(ContactOperatingCountryBase):
    """Schema for adding operating country to contact."""
    pass


class ContactOperatingCountryUpdate(BaseModel):
    """Schema for updating contact operating country."""
    is_primary: Optional[bool] = None


class ContactOperatingCountryResponse(ContactOperatingCountryBase):
    """Schema for contact operating country response."""
    id: UUID
    contact_id: UUID
    created_at: datetime
    updated_at: datetime
    country: Optional[CountryResponse] = None

    class Config:
        from_attributes = True


# ================================================================
# BUSINESS FOCUS AREA SCHEMAS
# ================================================================

class ContactBusinessFocusAreaBase(BaseModel):
    """Base schema for contact business focus area junction."""
    focus_area_id: UUID
    is_primary: bool = False


class ContactBusinessFocusAreaCreate(ContactBusinessFocusAreaBase):
    """Schema for adding business focus area to contact."""
    pass


class ContactBusinessFocusAreaUpdate(BaseModel):
    """Schema for updating contact business focus area."""
    is_primary: Optional[bool] = None


class ContactBusinessFocusAreaResponse(ContactBusinessFocusAreaBase):
    """Schema for contact business focus area response."""
    id: UUID
    contact_id: UUID
    created_at: datetime
    updated_at: datetime
    focus_area: Optional[BusinessFocusAreaResponse] = None

    class Config:
        from_attributes = True
