"""
================================================================
FILE: reference.py
PATH: /services/lkms101-contacts/app/models/reference.py
DESCRIPTION: Reference table models (countries, languages, nationalities,
             legal_forms, business_focus_areas, tags, role_types,
             organizational_unit_types)
VERSION: v1.0.0
UPDATED: 2025-12-18
================================================================
"""

from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

from app.database import Base


class RoleType(Base):
    """
    Reference table for contact role types.
    Categories: purchasing, sales, hr, organizational, partnership
    """
    __tablename__ = "role_types"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    role_code = Column(String(50), unique=True, nullable=False, index=True)
    role_name_sk = Column(String(100), nullable=False)
    role_name_en = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False, index=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    contact_roles = relationship("ContactRole", back_populates="role_type")

    def __repr__(self) -> str:
        return f"<RoleType(code='{self.role_code}', name='{self.role_name_en}')>"


class OrganizationalUnitType(Base):
    """
    Reference table for organizational unit types (Division, Department, Team).
    """
    __tablename__ = "organizational_unit_types"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type_code = Column(String(50), unique=True, nullable=False, index=True)
    type_name_sk = Column(String(100), nullable=False)
    type_name_en = Column(String(100), nullable=False)
    hierarchy_level = Column(Integer, default=0, nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    organizational_units = relationship("ContactOrganizationalUnit", back_populates="unit_type")

    def __repr__(self) -> str:
        return f"<OrganizationalUnitType(code='{self.type_code}', level={self.hierarchy_level})>"


class Country(Base):
    """
    Reference table for countries with ISO codes, phone codes, and timezones.
    """
    __tablename__ = "countries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    iso_code_2 = Column(String(2), unique=True, nullable=False, index=True)
    iso_code_3 = Column(String(3), unique=True, nullable=False, index=True)
    country_name_sk = Column(String(100), nullable=False)
    country_name_en = Column(String(100), nullable=False)
    phone_code = Column(String(10), nullable=False)
    timezone = Column(String(50), default='Europe/Bratislava', nullable=False)
    is_eu_member = Column(Boolean, default=False, nullable=False, index=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    nationalities = relationship("Nationality", back_populates="country")
    addresses = relationship("Address", back_populates="country")
    contact_phones = relationship("ContactPhone", back_populates="country")
    contact_operating_countries = relationship("ContactOperatingCountry", back_populates="country")

    def __repr__(self) -> str:
        return f"<Country(iso='{self.iso_code_2}', name='{self.country_name_en}')>"


class Language(Base):
    """
    Reference table for languages with ISO codes.
    """
    __tablename__ = "languages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    iso_code_2 = Column(String(2), unique=True, nullable=False, index=True)
    iso_code_3 = Column(String(3), unique=True, nullable=False, index=True)
    language_name_sk = Column(String(100), nullable=False)
    language_name_en = Column(String(100), nullable=False)
    language_name_native = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    contact_languages = relationship("ContactLanguage", back_populates="language")

    def __repr__(self) -> str:
        return f"<Language(iso='{self.iso_code_2}', name='{self.language_name_en}')>"


class Nationality(Base):
    """
    Reference table for nationalities, linked to countries.
    """
    __tablename__ = "nationalities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    country_id = Column(UUID(as_uuid=True), ForeignKey("countries.id", ondelete="RESTRICT"), nullable=False, index=True)
    nationality_name_sk = Column(String(100), nullable=False)
    nationality_name_en = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    country = relationship("Country", back_populates="nationalities")
    persons = relationship("ContactPerson", back_populates="nationality")

    def __repr__(self) -> str:
        return f"<Nationality(name='{self.nationality_name_en}')>"


class LegalForm(Base):
    """
    Reference table for company legal forms (s.r.o., GmbH, LLC, etc.).
    """
    __tablename__ = "legal_forms"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    form_code = Column(String(20), nullable=False, index=True)
    form_name_sk = Column(String(100), nullable=False)
    form_name_en = Column(String(100), nullable=False)
    form_abbreviation = Column(String(20), nullable=False)
    country_code = Column(String(2), nullable=False, index=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    companies = relationship("ContactCompany", back_populates="legal_form")

    def __repr__(self) -> str:
        return f"<LegalForm(code='{self.form_code}', abbr='{self.form_abbreviation}')>"


class BusinessFocusArea(Base):
    """
    Reference table for business focus areas / industries.
    Categories: it, manufacturing, services, trade, finance, healthcare, education, agriculture, construction, transport
    """
    __tablename__ = "business_focus_areas"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    area_code = Column(String(50), unique=True, nullable=False, index=True)
    area_name_sk = Column(String(100), nullable=False)
    area_name_en = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False, index=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    contact_business_focus_areas = relationship("ContactBusinessFocusArea", back_populates="focus_area")

    def __repr__(self) -> str:
        return f"<BusinessFocusArea(code='{self.area_code}', category='{self.category}')>"


class Tag(Base):
    """
    Reference table for contact tags (VIP, Problematic, Strategic Partner, etc.).
    """
    __tablename__ = "tags"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tag_name = Column(String(50), unique=True, nullable=False, index=True)
    tag_color = Column(String(7), nullable=True)  # HEX color
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    created_by_id = Column(UUID(as_uuid=True), nullable=True)

    # Relationships
    contact_tags = relationship("ContactTag", back_populates="tag")

    def __repr__(self) -> str:
        return f"<Tag(name='{self.tag_name}', color='{self.tag_color}')>"
