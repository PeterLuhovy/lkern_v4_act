"""
================================================================
FILE: address.py
PATH: /services/lkms101-contacts/app/schemas/address.py
DESCRIPTION: Pydantic schemas for Address and junction tables
VERSION: v1.0.0
UPDATED: 2025-12-18
================================================================
"""

from pydantic import BaseModel, Field, computed_field
from datetime import datetime, date
from typing import Optional, Literal
from uuid import UUID
from decimal import Decimal

from app.schemas.reference import CountryResponse


# ================================================================
# ADDRESS SCHEMAS
# ================================================================

class AddressBase(BaseModel):
    """Base schema for address."""
    street: str = Field(..., max_length=255)
    street_number: Optional[str] = Field(None, max_length=20)
    building_number: Optional[str] = Field(None, max_length=20)
    city: str = Field(..., max_length=100)
    postal_code: str = Field(..., max_length=20)
    region: Optional[str] = Field(None, max_length=100)
    country_id: UUID
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None


class AddressCreate(AddressBase):
    """Schema for creating address."""
    pass


class AddressUpdate(BaseModel):
    """Schema for updating address."""
    street: Optional[str] = Field(None, max_length=255)
    street_number: Optional[str] = Field(None, max_length=20)
    building_number: Optional[str] = Field(None, max_length=20)
    city: Optional[str] = Field(None, max_length=100)
    postal_code: Optional[str] = Field(None, max_length=20)
    region: Optional[str] = Field(None, max_length=100)
    country_id: Optional[UUID] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None


class AddressResponse(AddressBase):
    """Schema for address response."""
    id: UUID
    created_at: datetime
    updated_at: datetime
    country: Optional[CountryResponse] = None

    @computed_field
    @property
    def full_address(self) -> str:
        """Returns formatted full address."""
        parts = [self.street]
        if self.street_number:
            parts[0] = f"{self.street} {self.street_number}"
        parts.append(f"{self.postal_code} {self.city}")
        if self.region:
            parts.append(self.region)
        return ", ".join(parts)

    class Config:
        from_attributes = True


# ================================================================
# PERSON ADDRESS SCHEMAS
# ================================================================

PersonAddressType = Literal['personal', 'work', 'billing', 'delivery', 'correspondence']


class PersonAddressBase(BaseModel):
    """Base schema for person address junction."""
    address_id: UUID
    address_type: PersonAddressType
    is_primary: bool = False
    valid_from: Optional[date] = None
    valid_to: Optional[date] = None


class PersonAddressCreate(PersonAddressBase):
    """Schema for adding address to person."""
    pass


class PersonAddressCreateWithAddress(BaseModel):
    """Schema for creating new address and linking to person."""
    address: AddressCreate
    address_type: PersonAddressType
    is_primary: bool = False
    valid_from: Optional[date] = None
    valid_to: Optional[date] = None


class PersonAddressResponse(PersonAddressBase):
    """Schema for person address response."""
    id: UUID
    contact_id: UUID
    created_at: datetime
    updated_at: datetime
    address: Optional[AddressResponse] = None

    class Config:
        from_attributes = True


# ================================================================
# COMPANY ADDRESS SCHEMAS
# ================================================================

CompanyAddressType = Literal['headquarters', 'billing', 'delivery', 'warehouse', 'branch', 'correspondence']


class CompanyAddressBase(BaseModel):
    """Base schema for company address junction."""
    address_id: UUID
    address_type: CompanyAddressType
    is_primary: bool = False
    valid_from: Optional[date] = None
    valid_to: Optional[date] = None


class CompanyAddressCreate(CompanyAddressBase):
    """Schema for adding address to company."""
    pass


class CompanyAddressCreateWithAddress(BaseModel):
    """Schema for creating new address and linking to company."""
    address: AddressCreate
    address_type: CompanyAddressType
    is_primary: bool = False
    valid_from: Optional[date] = None
    valid_to: Optional[date] = None


class CompanyAddressResponse(CompanyAddressBase):
    """Schema for company address response."""
    id: UUID
    contact_id: UUID
    created_at: datetime
    updated_at: datetime
    address: Optional[AddressResponse] = None

    class Config:
        from_attributes = True


# ================================================================
# ORGANIZATIONAL UNIT ADDRESS SCHEMAS
# ================================================================

OrgUnitAddressType = Literal['branch', 'warehouse', 'delivery', 'correspondence']


class OrgUnitAddressBase(BaseModel):
    """Base schema for organizational unit address junction."""
    address_id: UUID
    address_type: OrgUnitAddressType
    is_primary: bool = False
    valid_from: Optional[date] = None
    valid_to: Optional[date] = None


class OrgUnitAddressCreate(OrgUnitAddressBase):
    """Schema for adding address to organizational unit."""
    pass


class OrgUnitAddressCreateWithAddress(BaseModel):
    """Schema for creating new address and linking to org unit."""
    address: AddressCreate
    address_type: OrgUnitAddressType
    is_primary: bool = False
    valid_from: Optional[date] = None
    valid_to: Optional[date] = None


class OrgUnitAddressResponse(OrgUnitAddressBase):
    """Schema for organizational unit address response."""
    id: UUID
    contact_id: UUID
    created_at: datetime
    updated_at: datetime
    address: Optional[AddressResponse] = None

    class Config:
        from_attributes = True
