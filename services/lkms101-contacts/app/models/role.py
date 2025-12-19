"""
================================================================
FILE: role.py
PATH: /services/lkms101-contacts/app/models/role.py
DESCRIPTION: Contact role model - M:N relationship with multi-role support
VERSION: v1.0.0
UPDATED: 2025-12-18
================================================================

Multi-role support: One contact can have multiple roles simultaneously
(e.g., SUPPLIER + CUSTOMER + EMPLOYEE of different companies)
"""

from sqlalchemy import Column, Boolean, DateTime, Date, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

from app.database import Base


class ContactRole(Base):
    """
    M:N junction table for contact roles.
    Supports contextual binding via related_contact_id.
    """
    __tablename__ = "contact_roles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id", ondelete="CASCADE"), nullable=False, index=True)
    role_type_id = Column(UUID(as_uuid=True), ForeignKey("role_types.id", ondelete="RESTRICT"), nullable=False, index=True)

    # Primary role flag
    is_primary = Column(Boolean, default=False, nullable=False)

    # Contextual binding (e.g., Employee OF which company/org unit)
    related_contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id", ondelete="SET NULL"), nullable=True, index=True)

    # Validity period (for historical tracking)
    valid_from = Column(Date, server_default=func.current_date(), nullable=False)
    valid_to = Column(Date, nullable=True)

    # Audit fields
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    created_by_id = Column(UUID(as_uuid=True), nullable=True)

    # Unique constraint - prevent duplicate active roles
    __table_args__ = (
        UniqueConstraint('contact_id', 'role_type_id', 'related_contact_id', 'valid_to',
                         name='contact_roles_unique_active'),
    )

    # Relationships
    contact = relationship("Contact", back_populates="roles", foreign_keys=[contact_id])
    role_type = relationship("RoleType", back_populates="contact_roles")
    related_contact = relationship("Contact", foreign_keys=[related_contact_id], overlaps="related_to_roles")

    @property
    def is_active(self) -> bool:
        """Check if role is currently active (valid_to is NULL)."""
        return self.valid_to is None

    def __repr__(self) -> str:
        return f"<ContactRole(contact_id={self.contact_id}, role='{self.role_type_id}', active={self.is_active})>"
