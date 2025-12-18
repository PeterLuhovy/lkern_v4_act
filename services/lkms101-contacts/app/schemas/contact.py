"""
================================================================
FILE: contact.py
PATH: /services/lkms101-contacts/app/schemas/contact.py
DESCRIPTION: Pydantic schemas for Contact, Person, Company, OrganizationalUnit
VERSION: v1.0.0
UPDATED: 2025-12-18
================================================================
"""

from pydantic import BaseModel, Field, computed_field
from datetime import datetime, date
from typing import Optional, List, Literal
from uuid import UUID

from app.schemas.reference import (
    NationalityResponse,
    LegalFormResponse,
    OrganizationalUnitTypeResponse,
)


# ================================================================
# PERSON SCHEMAS
# ================================================================

class PersonBase(BaseModel):
    """Base schema for person data."""
    first_name: str = Field(..., max_length=100)
    last_name: str = Field(..., max_length=100)
    title_before: Optional[str] = Field(None, max_length=50)
    title_after: Optional[str] = Field(None, max_length=50)
    birth_date: Optional[date] = None
    gender: Optional[Literal['male', 'female', 'other']] = None
    nationality_id: Optional[UUID] = None


class PersonCreate(PersonBase):
    """Schema for creating person."""
    pass


class PersonUpdate(BaseModel):
    """Schema for updating person."""
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    title_before: Optional[str] = Field(None, max_length=50)
    title_after: Optional[str] = Field(None, max_length=50)
    birth_date: Optional[date] = None
    gender: Optional[Literal['male', 'female', 'other']] = None
    nationality_id: Optional[UUID] = None


class PersonResponse(PersonBase):
    """Schema for person response."""
    id: UUID
    contact_id: UUID
    is_deleted: bool = False
    created_at: datetime
    updated_at: datetime
    nationality: Optional[NationalityResponse] = None

    @computed_field
    @property
    def full_name(self) -> str:
        """Returns full name with titles."""
        parts = []
        if self.title_before:
            parts.append(self.title_before)
        parts.append(self.first_name)
        parts.append(self.last_name)
        if self.title_after:
            parts.append(self.title_after)
        return " ".join(parts)

    class Config:
        from_attributes = True


# ================================================================
# COMPANY SCHEMAS
# ================================================================

class CompanyBase(BaseModel):
    """Base schema for company data."""
    company_name: str = Field(..., max_length=255)
    legal_form_id: Optional[UUID] = None
    registration_number: Optional[str] = Field(None, max_length=50)
    tax_number: Optional[str] = Field(None, max_length=50)
    vat_number: Optional[str] = Field(None, max_length=50)
    established_date: Optional[date] = None
    company_status: Literal['active', 'inactive', 'suspended', 'liquidation', 'bankrupt', 'dissolved'] = 'active'


class CompanyCreate(CompanyBase):
    """Schema for creating company."""
    pass


class CompanyUpdate(BaseModel):
    """Schema for updating company."""
    company_name: Optional[str] = Field(None, max_length=255)
    legal_form_id: Optional[UUID] = None
    registration_number: Optional[str] = Field(None, max_length=50)
    tax_number: Optional[str] = Field(None, max_length=50)
    vat_number: Optional[str] = Field(None, max_length=50)
    established_date: Optional[date] = None
    company_status: Optional[Literal['active', 'inactive', 'suspended', 'liquidation', 'bankrupt', 'dissolved']] = None


class CompanyResponse(CompanyBase):
    """Schema for company response."""
    id: UUID
    contact_id: UUID
    is_deleted: bool = False
    created_at: datetime
    updated_at: datetime
    legal_form: Optional[LegalFormResponse] = None

    class Config:
        from_attributes = True


# ================================================================
# ORGANIZATIONAL UNIT SCHEMAS
# ================================================================

class OrganizationalUnitBase(BaseModel):
    """Base schema for organizational unit data."""
    unit_name: str = Field(..., max_length=255)
    unit_type_id: UUID
    parent_unit_id: Optional[UUID] = None
    parent_company_id: Optional[UUID] = None


class OrganizationalUnitCreate(OrganizationalUnitBase):
    """Schema for creating organizational unit."""
    pass


class OrganizationalUnitUpdate(BaseModel):
    """Schema for updating organizational unit."""
    unit_name: Optional[str] = Field(None, max_length=255)
    unit_type_id: Optional[UUID] = None
    parent_unit_id: Optional[UUID] = None
    parent_company_id: Optional[UUID] = None


class OrganizationalUnitResponse(OrganizationalUnitBase):
    """Schema for organizational unit response."""
    id: UUID
    contact_id: UUID
    is_deleted: bool = False
    created_at: datetime
    updated_at: datetime
    unit_type: Optional[OrganizationalUnitTypeResponse] = None

    class Config:
        from_attributes = True


# ================================================================
# CONTACT SCHEMAS
# ================================================================

class ContactBase(BaseModel):
    """Base schema for contact."""
    contact_type: Literal['person', 'company', 'organizational_unit']


class ContactCreatePerson(ContactBase):
    """Schema for creating person contact."""
    contact_type: Literal['person'] = 'person'
    person: PersonCreate


class ContactCreateCompany(ContactBase):
    """Schema for creating company contact."""
    contact_type: Literal['company'] = 'company'
    company: CompanyCreate


class ContactCreateOrganizationalUnit(ContactBase):
    """Schema for creating organizational unit contact."""
    contact_type: Literal['organizational_unit'] = 'organizational_unit'
    organizational_unit: OrganizationalUnitCreate


class ContactUpdate(BaseModel):
    """Schema for updating contact (type-specific data only)."""
    person: Optional[PersonUpdate] = None
    company: Optional[CompanyUpdate] = None
    organizational_unit: Optional[OrganizationalUnitUpdate] = None


class ContactResponse(BaseModel):
    """Schema for contact response."""
    id: UUID
    contact_code: str
    contact_type: str
    is_deleted: bool = False
    deleted_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    created_by_id: Optional[UUID] = None
    updated_by_id: Optional[UUID] = None

    # Type-specific data (only one will be populated)
    person: Optional[PersonResponse] = None
    company: Optional[CompanyResponse] = None
    organizational_unit: Optional[OrganizationalUnitResponse] = None

    @computed_field
    @property
    def display_name(self) -> str:
        """Returns display name based on contact type."""
        if self.contact_type == "person" and self.person:
            return f"{self.person.first_name} {self.person.last_name}"
        elif self.contact_type == "company" and self.company:
            return self.company.company_name
        elif self.contact_type == "organizational_unit" and self.organizational_unit:
            return self.organizational_unit.unit_name
        return self.contact_code

    class Config:
        from_attributes = True


class ContactListResponse(BaseModel):
    """Schema for contact list item (lightweight)."""
    id: UUID
    contact_code: str
    contact_type: str
    display_name: str
    is_deleted: bool = False
    created_at: datetime

    class Config:
        from_attributes = True


# ================================================================
# DELETE / RESTORE SCHEMAS
# ================================================================

class DeleteResponse(BaseModel):
    """Response for soft delete operation."""
    id: UUID
    contact_code: str
    status: str = "deleted"
    deleted_at: datetime
    message: str = "Contact soft-deleted successfully"


class RestoreResponse(BaseModel):
    """Response for restore operation."""
    id: UUID
    contact_code: str
    status: str = "restored"
    message: str = "Contact restored successfully"
