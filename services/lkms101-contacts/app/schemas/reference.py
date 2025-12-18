"""
================================================================
FILE: reference.py
PATH: /services/lkms101-contacts/app/schemas/reference.py
DESCRIPTION: Pydantic schemas for reference tables
VERSION: v1.0.0
UPDATED: 2025-12-18
================================================================
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from uuid import UUID


# ================================================================
# ROLE TYPE
# ================================================================

class RoleTypeBase(BaseModel):
    """Base schema for RoleType."""
    role_code: str = Field(..., max_length=50)
    role_name_sk: str = Field(..., max_length=100)
    role_name_en: str = Field(..., max_length=100)
    category: str = Field(..., max_length=50)  # purchasing, sales, hr, organizational, partnership
    description: Optional[str] = None
    is_active: bool = True


class RoleTypeCreate(RoleTypeBase):
    """Schema for creating RoleType."""
    pass


class RoleTypeResponse(RoleTypeBase):
    """Schema for RoleType response."""
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ================================================================
# ORGANIZATIONAL UNIT TYPE
# ================================================================

class OrganizationalUnitTypeBase(BaseModel):
    """Base schema for OrganizationalUnitType."""
    type_code: str = Field(..., max_length=50)
    type_name_sk: str = Field(..., max_length=100)
    type_name_en: str = Field(..., max_length=100)
    hierarchy_level: int = 0
    description: Optional[str] = None
    is_active: bool = True


class OrganizationalUnitTypeCreate(OrganizationalUnitTypeBase):
    """Schema for creating OrganizationalUnitType."""
    pass


class OrganizationalUnitTypeResponse(OrganizationalUnitTypeBase):
    """Schema for OrganizationalUnitType response."""
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ================================================================
# COUNTRY
# ================================================================

class CountryBase(BaseModel):
    """Base schema for Country."""
    iso_code_2: str = Field(..., min_length=2, max_length=2)
    iso_code_3: str = Field(..., min_length=3, max_length=3)
    country_name_sk: str = Field(..., max_length=100)
    country_name_en: str = Field(..., max_length=100)
    phone_code: str = Field(..., max_length=10)
    timezone: str = Field(default='Europe/Bratislava', max_length=50)
    is_eu_member: bool = False
    is_active: bool = True


class CountryCreate(CountryBase):
    """Schema for creating Country."""
    pass


class CountryResponse(CountryBase):
    """Schema for Country response."""
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ================================================================
# LANGUAGE
# ================================================================

class LanguageBase(BaseModel):
    """Base schema for Language."""
    iso_code_2: str = Field(..., min_length=2, max_length=2)
    iso_code_3: str = Field(..., min_length=3, max_length=3)
    language_name_sk: str = Field(..., max_length=100)
    language_name_en: str = Field(..., max_length=100)
    language_name_native: str = Field(..., max_length=100)
    is_active: bool = True


class LanguageCreate(LanguageBase):
    """Schema for creating Language."""
    pass


class LanguageResponse(LanguageBase):
    """Schema for Language response."""
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ================================================================
# NATIONALITY
# ================================================================

class NationalityBase(BaseModel):
    """Base schema for Nationality."""
    country_id: UUID
    nationality_name_sk: str = Field(..., max_length=100)
    nationality_name_en: str = Field(..., max_length=100)
    is_active: bool = True


class NationalityCreate(NationalityBase):
    """Schema for creating Nationality."""
    pass


class NationalityResponse(NationalityBase):
    """Schema for Nationality response."""
    id: UUID
    created_at: datetime
    updated_at: datetime
    country: Optional[CountryResponse] = None

    class Config:
        from_attributes = True


# ================================================================
# LEGAL FORM
# ================================================================

class LegalFormBase(BaseModel):
    """Base schema for LegalForm."""
    form_code: str = Field(..., max_length=20)
    form_name_sk: str = Field(..., max_length=100)
    form_name_en: str = Field(..., max_length=100)
    form_abbreviation: str = Field(..., max_length=20)
    country_code: str = Field(..., min_length=2, max_length=2)
    description: Optional[str] = None
    is_active: bool = True


class LegalFormCreate(LegalFormBase):
    """Schema for creating LegalForm."""
    pass


class LegalFormResponse(LegalFormBase):
    """Schema for LegalForm response."""
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ================================================================
# BUSINESS FOCUS AREA
# ================================================================

class BusinessFocusAreaBase(BaseModel):
    """Base schema for BusinessFocusArea."""
    area_code: str = Field(..., max_length=50)
    area_name_sk: str = Field(..., max_length=100)
    area_name_en: str = Field(..., max_length=100)
    category: str = Field(..., max_length=50)  # it, manufacturing, services, trade, etc.
    description: Optional[str] = None
    is_active: bool = True


class BusinessFocusAreaCreate(BusinessFocusAreaBase):
    """Schema for creating BusinessFocusArea."""
    pass


class BusinessFocusAreaResponse(BusinessFocusAreaBase):
    """Schema for BusinessFocusArea response."""
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ================================================================
# TAG
# ================================================================

class TagBase(BaseModel):
    """Base schema for Tag."""
    tag_name: str = Field(..., max_length=50)
    tag_color: Optional[str] = Field(None, max_length=7)  # HEX color
    description: Optional[str] = None
    is_active: bool = True


class TagCreate(TagBase):
    """Schema for creating Tag."""
    pass


class TagResponse(TagBase):
    """Schema for Tag response."""
    id: UUID
    created_at: datetime
    updated_at: datetime
    created_by_id: Optional[UUID] = None

    class Config:
        from_attributes = True
