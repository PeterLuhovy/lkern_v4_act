"""
================================================================
FILE: address.py
PATH: /services/lkms101-contacts/app/models/address.py
DESCRIPTION: Address models - reusable address pool + type-safe junction tables
VERSION: v1.0.0
UPDATED: 2025-12-18
================================================================

Type-safe address system:
- addresses: Reusable address pool
- person_addresses: M:N with person-specific types
- company_addresses: M:N with company-specific types
- organizational_unit_addresses: M:N with org-unit-specific types
"""

from sqlalchemy import Column, String, Boolean, DateTime, Date, Numeric, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

from app.database import Base


class Address(Base):
    """
    Reusable address pool - shared across contacts.
    """
    __tablename__ = "addresses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Address components
    street = Column(String(255), nullable=False)
    street_number = Column(String(20), nullable=True)
    building_number = Column(String(20), nullable=True)
    city = Column(String(100), nullable=False, index=True)
    postal_code = Column(String(20), nullable=False, index=True)
    region = Column(String(100), nullable=True)
    country_id = Column(UUID(as_uuid=True), ForeignKey("countries.id", ondelete="RESTRICT"), nullable=False, index=True)

    # GPS coordinates (optional)
    latitude = Column(Numeric(10, 8), nullable=True)
    longitude = Column(Numeric(11, 8), nullable=True)

    # Audit fields
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Unique constraint
    __table_args__ = (
        UniqueConstraint('street', 'street_number', 'city', 'postal_code', 'country_id',
                         name='addresses_unique'),
    )

    # Relationships
    country = relationship("Country", back_populates="addresses")
    person_addresses = relationship("PersonAddress", back_populates="address", cascade="all, delete-orphan")
    company_addresses = relationship("CompanyAddress", back_populates="address", cascade="all, delete-orphan")
    org_unit_addresses = relationship("OrganizationalUnitAddress", back_populates="address", cascade="all, delete-orphan")

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

    def __repr__(self) -> str:
        return f"<Address(city='{self.city}', street='{self.street}')>"


class PersonAddress(Base):
    """
    M:N junction for person addresses.
    Types: personal, work, billing, delivery, correspondence
    """
    __tablename__ = "person_addresses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id", ondelete="CASCADE"), nullable=False, index=True)
    address_id = Column(UUID(as_uuid=True), ForeignKey("addresses.id", ondelete="CASCADE"), nullable=False, index=True)

    # Address type (person-specific)
    address_type = Column(String(20), nullable=False, index=True)
    # Values: personal, work, billing, delivery, correspondence

    # Primary flag
    is_primary = Column(Boolean, default=False, nullable=False)

    # Validity period
    valid_from = Column(Date, server_default=func.current_date(), nullable=False)
    valid_to = Column(Date, nullable=True)

    # Audit fields
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Unique constraint
    __table_args__ = (
        UniqueConstraint('contact_id', 'address_id', 'address_type', name='person_addresses_unique'),
    )

    # Relationships
    contact = relationship("Contact", back_populates="person_addresses")
    address = relationship("Address", back_populates="person_addresses")

    def __repr__(self) -> str:
        return f"<PersonAddress(type='{self.address_type}', primary={self.is_primary})>"


class CompanyAddress(Base):
    """
    M:N junction for company addresses.
    Types: headquarters, billing, delivery, warehouse, branch, correspondence
    """
    __tablename__ = "company_addresses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id", ondelete="CASCADE"), nullable=False, index=True)
    address_id = Column(UUID(as_uuid=True), ForeignKey("addresses.id", ondelete="CASCADE"), nullable=False, index=True)

    # Address type (company-specific)
    address_type = Column(String(20), nullable=False, index=True)
    # Values: headquarters, billing, delivery, warehouse, branch, correspondence

    # Primary flag
    is_primary = Column(Boolean, default=False, nullable=False)

    # Validity period
    valid_from = Column(Date, server_default=func.current_date(), nullable=False)
    valid_to = Column(Date, nullable=True)

    # Audit fields
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Unique constraint
    __table_args__ = (
        UniqueConstraint('contact_id', 'address_id', 'address_type', name='company_addresses_unique'),
    )

    # Relationships
    contact = relationship("Contact", back_populates="company_addresses")
    address = relationship("Address", back_populates="company_addresses")

    def __repr__(self) -> str:
        return f"<CompanyAddress(type='{self.address_type}', primary={self.is_primary})>"


class OrganizationalUnitAddress(Base):
    """
    M:N junction for organizational unit addresses.
    Types: branch, warehouse, delivery, correspondence
    """
    __tablename__ = "organizational_unit_addresses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id", ondelete="CASCADE"), nullable=False, index=True)
    address_id = Column(UUID(as_uuid=True), ForeignKey("addresses.id", ondelete="CASCADE"), nullable=False, index=True)

    # Address type (org unit-specific)
    address_type = Column(String(20), nullable=False, index=True)
    # Values: branch, warehouse, delivery, correspondence

    # Primary flag
    is_primary = Column(Boolean, default=False, nullable=False)

    # Validity period
    valid_from = Column(Date, server_default=func.current_date(), nullable=False)
    valid_to = Column(Date, nullable=True)

    # Audit fields
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Unique constraint
    __table_args__ = (
        UniqueConstraint('contact_id', 'address_id', 'address_type', name='org_unit_addresses_unique'),
    )

    # Relationships
    contact = relationship("Contact", back_populates="org_unit_addresses")
    address = relationship("Address", back_populates="org_unit_addresses")

    def __repr__(self) -> str:
        return f"<OrganizationalUnitAddress(type='{self.address_type}', primary={self.is_primary})>"
