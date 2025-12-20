"""
================================================================
FILE: contact.py
PATH: /services/lkms101-contacts/app/models/contact.py
DESCRIPTION: Core contact models - Contact (base), ContactPerson,
             ContactCompany, ContactOrganizationalUnit
VERSION: v1.0.0
UPDATED: 2025-12-18
================================================================

Implements Party Model pattern:
- Contact is the base entity (discriminator: contact_type)
- ContactPerson, ContactCompany, ContactOrganizationalUnit extend it
"""

from sqlalchemy import Column, String, Boolean, DateTime, Date, Text, ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

from app.database import Base


class Contact(Base):
    """
    Base contact entity - Party Model.
    Discriminator: contact_type (person, company, organizational_unit)
    """
    __tablename__ = "contacts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contact_code = Column(String(20), unique=True, nullable=False, index=True)
    contact_type = Column(String(20), nullable=False, index=True)  # person, company, organizational_unit

    # Soft delete (NULL = active, timestamp = deleted)
    deleted_at = Column(DateTime, nullable=True, index=True)
    deleted_by_id = Column(UUID(as_uuid=True), nullable=True)

    # Audit fields
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    created_by_id = Column(UUID(as_uuid=True), nullable=True)
    updated_by_id = Column(UUID(as_uuid=True), nullable=True)

    # Relationships - type-specific extensions
    person = relationship("ContactPerson", back_populates="contact", uselist=False, cascade="all, delete-orphan")
    company = relationship("ContactCompany", back_populates="contact", uselist=False, cascade="all, delete-orphan")
    organizational_unit = relationship("ContactOrganizationalUnit", back_populates="contact", uselist=False, cascade="all, delete-orphan",
                                       foreign_keys="ContactOrganizationalUnit.contact_id")

    # Relationships - roles
    roles = relationship("ContactRole", back_populates="contact", cascade="all, delete-orphan",
                         foreign_keys="ContactRole.contact_id")
    related_to_roles = relationship("ContactRole", foreign_keys="ContactRole.related_contact_id")

    # Relationships - addresses (via junction tables)
    person_addresses = relationship("PersonAddress", back_populates="contact", cascade="all, delete-orphan")
    company_addresses = relationship("CompanyAddress", back_populates="contact", cascade="all, delete-orphan")
    org_unit_addresses = relationship("OrganizationalUnitAddress", back_populates="contact", cascade="all, delete-orphan")

    # Relationships - communication
    emails = relationship("ContactEmail", back_populates="contact", cascade="all, delete-orphan")
    phones = relationship("ContactPhone", back_populates="contact", cascade="all, delete-orphan")
    websites = relationship("ContactWebsite", back_populates="contact", cascade="all, delete-orphan")
    social_networks = relationship("ContactSocialNetwork", back_populates="contact", cascade="all, delete-orphan")

    # Relationships - classification
    tags = relationship("ContactTag", back_populates="contact", cascade="all, delete-orphan")
    languages = relationship("ContactLanguage", back_populates="contact", cascade="all, delete-orphan")
    operating_countries = relationship("ContactOperatingCountry", back_populates="contact", cascade="all, delete-orphan")
    business_focus_areas = relationship("ContactBusinessFocusArea", back_populates="contact", cascade="all, delete-orphan")

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

    def __repr__(self) -> str:
        return f"<Contact(code='{self.contact_code}', type='{self.contact_type}')>"


class ContactPerson(Base):
    """
    Person-specific attributes for contacts with contact_type='person'.
    """
    __tablename__ = "contact_persons"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)

    # Name fields
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False, index=True)
    title_before = Column(String(50), nullable=True)
    title_after = Column(String(50), nullable=True)

    # Personal details
    birth_date = Column(Date, nullable=True)
    gender = Column(String(10), nullable=True)  # male, female, other
    nationality_id = Column(UUID(as_uuid=True), ForeignKey("nationalities.id", ondelete="SET NULL"), nullable=True, index=True)

    # Audit fields
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    contact = relationship("Contact", back_populates="person")
    nationality = relationship("Nationality", back_populates="persons")

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

    def __repr__(self) -> str:
        return f"<ContactPerson(name='{self.first_name} {self.last_name}')>"


class ContactCompany(Base):
    """
    Company-specific attributes for contacts with contact_type='company'.
    """
    __tablename__ = "contact_companies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)

    # Company name
    company_name = Column(String(255), nullable=False, index=True)

    # Legal form
    legal_form_id = Column(UUID(as_uuid=True), ForeignKey("legal_forms.id", ondelete="SET NULL"), nullable=True)

    # Registration numbers
    registration_number = Column(String(50), nullable=True, index=True)
    tax_number = Column(String(50), nullable=True)
    vat_number = Column(String(50), nullable=True)

    # Establishment date
    established_date = Column(Date, nullable=True)

    # Company status
    company_status = Column(String(20), default='active', nullable=False, index=True)
    # Values: active, inactive, suspended, liquidation, bankrupt, dissolved

    # Audit fields
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    contact = relationship("Contact", back_populates="company")
    legal_form = relationship("LegalForm", back_populates="companies")

    def __repr__(self) -> str:
        return f"<ContactCompany(name='{self.company_name}', status='{self.company_status}')>"


class ContactOrganizationalUnit(Base):
    """
    Organizational unit-specific attributes for contacts with contact_type='organizational_unit'.
    """
    __tablename__ = "contact_organizational_units"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)

    # Unit details
    unit_name = Column(String(255), nullable=False, index=True)
    unit_type_id = Column(UUID(as_uuid=True), ForeignKey("organizational_unit_types.id", ondelete="RESTRICT"), nullable=False, index=True)

    # Parent unit (for hierarchy)
    parent_unit_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id", ondelete="SET NULL"), nullable=True, index=True)

    # Parent company
    parent_company_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id", ondelete="SET NULL"), nullable=True, index=True)

    # Audit fields
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    contact = relationship("Contact", back_populates="organizational_unit", foreign_keys=[contact_id])
    unit_type = relationship("OrganizationalUnitType", back_populates="organizational_units")
    parent_unit = relationship("Contact", foreign_keys=[parent_unit_id], remote_side="Contact.id")
    parent_company = relationship("Contact", foreign_keys=[parent_company_id], remote_side="Contact.id")

    def __repr__(self) -> str:
        return f"<ContactOrganizationalUnit(name='{self.unit_name}')>"
