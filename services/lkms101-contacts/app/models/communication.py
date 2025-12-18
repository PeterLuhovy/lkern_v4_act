"""
================================================================
FILE: communication.py
PATH: /services/lkms101-contacts/app/models/communication.py
DESCRIPTION: Communication models - emails, phones, websites, social networks
VERSION: v1.0.0
UPDATED: 2025-12-18
================================================================
"""

from sqlalchemy import Column, String, Boolean, DateTime, Date, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

from app.database import Base


class ContactEmail(Base):
    """
    Contact email addresses.
    Types: work, billing, support, general
    """
    __tablename__ = "contact_emails"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id", ondelete="CASCADE"), nullable=False, index=True)

    # Email details
    email = Column(String(255), nullable=False, index=True)
    email_type = Column(String(20), default='work', nullable=False, index=True)
    # Values: work, billing, support, general

    # Primary flag
    is_primary = Column(Boolean, default=False, nullable=False)

    # Soft delete
    is_deleted = Column(Boolean, default=False, nullable=False)

    # Audit fields
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Unique constraint
    __table_args__ = (
        UniqueConstraint('contact_id', 'email', name='contact_emails_unique'),
    )

    # Relationships
    contact = relationship("Contact", back_populates="emails")

    def __repr__(self) -> str:
        return f"<ContactEmail(email='{self.email}', type='{self.email_type}')>"


class ContactPhone(Base):
    """
    Contact phone numbers.
    Types: mobile, fax, fixed_line
    """
    __tablename__ = "contact_phones"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id", ondelete="CASCADE"), nullable=False, index=True)

    # Phone details
    phone_number = Column(String(30), nullable=False, index=True)
    country_id = Column(UUID(as_uuid=True), ForeignKey("countries.id", ondelete="RESTRICT"), nullable=False, index=True)
    phone_type = Column(String(20), default='mobile', nullable=False, index=True)
    # Values: mobile, fax, fixed_line

    # Primary flag
    is_primary = Column(Boolean, default=False, nullable=False)

    # Soft delete
    is_deleted = Column(Boolean, default=False, nullable=False)

    # Audit fields
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Unique constraint
    __table_args__ = (
        UniqueConstraint('contact_id', 'phone_number', name='contact_phones_unique'),
    )

    # Relationships
    contact = relationship("Contact", back_populates="phones")
    country = relationship("Country", back_populates="contact_phones")

    @property
    def formatted_number(self) -> str:
        """Returns phone number with country code."""
        if self.country:
            return f"{self.country.phone_code} {self.phone_number}"
        return self.phone_number

    def __repr__(self) -> str:
        return f"<ContactPhone(number='{self.phone_number}', type='{self.phone_type}')>"


class ContactWebsite(Base):
    """
    Contact websites.
    Types: main, shop, blog, support, portfolio
    """
    __tablename__ = "contact_websites"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id", ondelete="CASCADE"), nullable=False, index=True)

    # Website details
    website_url = Column(String(500), nullable=False)
    website_type = Column(String(20), default='main', nullable=False)
    # Values: main, shop, blog, support, portfolio

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
        UniqueConstraint('contact_id', 'website_url', name='contact_websites_unique'),
    )

    # Relationships
    contact = relationship("Contact", back_populates="websites")

    def __repr__(self) -> str:
        return f"<ContactWebsite(url='{self.website_url}', type='{self.website_type}')>"


class ContactSocialNetwork(Base):
    """
    Contact social network profiles.
    Platforms: linkedin, facebook, twitter, instagram, youtube, github, xing, tiktok
    """
    __tablename__ = "contact_social_networks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id", ondelete="CASCADE"), nullable=False, index=True)

    # Social network details
    platform = Column(String(50), nullable=False, index=True)
    # Values: linkedin, facebook, twitter, instagram, youtube, github, xing, tiktok
    profile_url = Column(String(500), nullable=False)

    # Primary flag
    is_primary = Column(Boolean, default=False, nullable=False)

    # Audit fields
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Unique constraint
    __table_args__ = (
        UniqueConstraint('contact_id', 'platform', 'profile_url', name='contact_social_networks_unique'),
    )

    # Relationships
    contact = relationship("Contact", back_populates="social_networks")

    def __repr__(self) -> str:
        return f"<ContactSocialNetwork(platform='{self.platform}')>"
