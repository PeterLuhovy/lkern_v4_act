"""
================================================================
FILE: relations.py
PATH: /services/lkms101-contacts/app/models/relations.py
DESCRIPTION: Classification junction tables - tags, languages,
             operating countries, business focus areas
VERSION: v1.0.0
UPDATED: 2025-12-18
================================================================
"""

from sqlalchemy import Column, Boolean, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

from app.database import Base


class ContactTag(Base):
    """
    M:N junction for contact tags.
    """
    __tablename__ = "contact_tags"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id", ondelete="CASCADE"), nullable=False, index=True)
    tag_id = Column(UUID(as_uuid=True), ForeignKey("tags.id", ondelete="CASCADE"), nullable=False, index=True)

    # Audit fields
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    created_by_id = Column(UUID(as_uuid=True), nullable=True)

    # Unique constraint
    __table_args__ = (
        UniqueConstraint('contact_id', 'tag_id', name='contact_tags_unique'),
    )

    # Relationships
    contact = relationship("Contact", back_populates="tags")
    tag = relationship("Tag", back_populates="contact_tags")

    def __repr__(self) -> str:
        return f"<ContactTag(contact_id={self.contact_id}, tag_id={self.tag_id})>"


class ContactLanguage(Base):
    """
    M:N junction for contact languages.
    """
    __tablename__ = "contact_languages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id", ondelete="CASCADE"), nullable=False, index=True)
    language_id = Column(UUID(as_uuid=True), ForeignKey("languages.id", ondelete="CASCADE"), nullable=False, index=True)

    # Primary language designation
    is_primary = Column(Boolean, default=False, nullable=False)

    # Audit fields
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Unique constraint
    __table_args__ = (
        UniqueConstraint('contact_id', 'language_id', name='contact_languages_unique'),
    )

    # Relationships
    contact = relationship("Contact", back_populates="languages")
    language = relationship("Language", back_populates="contact_languages")

    def __repr__(self) -> str:
        return f"<ContactLanguage(contact_id={self.contact_id}, language_id={self.language_id})>"


class ContactOperatingCountry(Base):
    """
    M:N junction for contact operating countries (for companies).
    """
    __tablename__ = "contact_operating_countries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id", ondelete="CASCADE"), nullable=False, index=True)
    country_id = Column(UUID(as_uuid=True), ForeignKey("countries.id", ondelete="CASCADE"), nullable=False, index=True)

    # Primary country designation
    is_primary = Column(Boolean, default=False, nullable=False)

    # Audit fields
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Unique constraint
    __table_args__ = (
        UniqueConstraint('contact_id', 'country_id', name='contact_operating_countries_unique'),
    )

    # Relationships
    contact = relationship("Contact", back_populates="operating_countries")
    country = relationship("Country", back_populates="contact_operating_countries")

    def __repr__(self) -> str:
        return f"<ContactOperatingCountry(contact_id={self.contact_id}, country_id={self.country_id})>"


class ContactBusinessFocusArea(Base):
    """
    M:N junction for contact business focus areas (for companies).
    """
    __tablename__ = "contact_business_focus_areas"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id", ondelete="CASCADE"), nullable=False, index=True)
    focus_area_id = Column(UUID(as_uuid=True), ForeignKey("business_focus_areas.id", ondelete="CASCADE"), nullable=False, index=True)

    # Primary focus designation
    is_primary = Column(Boolean, default=False, nullable=False)

    # Audit fields
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Unique constraint
    __table_args__ = (
        UniqueConstraint('contact_id', 'focus_area_id', name='contact_business_focus_unique'),
    )

    # Relationships
    contact = relationship("Contact", back_populates="business_focus_areas")
    focus_area = relationship("BusinessFocusArea", back_populates="contact_business_focus_areas")

    def __repr__(self) -> str:
        return f"<ContactBusinessFocusArea(contact_id={self.contact_id}, focus_area_id={self.focus_area_id})>"
