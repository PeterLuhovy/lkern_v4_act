"""
================================================================
FILE: role_service.py
PATH: /services/lkms101-contacts/app/services/role_service.py
DESCRIPTION: Contact role management service
VERSION: v1.0.0
UPDATED: 2025-12-18
================================================================

Multi-role support: One contact can have multiple roles
(e.g., SUPPLIER + CUSTOMER + EMPLOYEE of different companies)
"""

from datetime import date
from typing import Optional, List
from uuid import UUID
from sqlalchemy.orm import Session, joinedload
import logging

from app.models import ContactRole, RoleType, Contact
from app.schemas.role import RoleCreate, RoleUpdate
from app.events.producer import publish_event

logger = logging.getLogger(__name__)


class RoleService:
    """Service for contact role management."""

    def __init__(self, db: Session):
        self.db = db

    # ================================================================
    # ADD ROLE
    # ================================================================

    async def add_role(
        self,
        contact_id: UUID,
        data: RoleCreate,
        created_by_id: Optional[UUID] = None
    ) -> ContactRole:
        """Add a role to contact."""
        # Verify contact exists
        contact = self.db.query(Contact).filter(Contact.id == contact_id).first()
        if not contact:
            raise ValueError(f"Contact not found: {contact_id}")

        # Verify role type exists
        role_type = self.db.query(RoleType).filter(RoleType.id == data.role_type_id).first()
        if not role_type:
            raise ValueError(f"Role type not found: {data.role_type_id}")

        # Create role
        role = ContactRole(
            contact_id=contact_id,
            role_type_id=data.role_type_id,
            is_primary=data.is_primary,
            related_contact_id=data.related_contact_id,
            valid_from=data.valid_from or date.today(),
            valid_to=data.valid_to,
            created_by_id=created_by_id,
        )

        # If this is primary, unset other primary roles of same type
        if data.is_primary:
            self._unset_other_primary(contact_id, data.role_type_id)

        self.db.add(role)
        self.db.commit()
        self.db.refresh(role)

        logger.info(f"Added role {role_type.role_code} to contact {contact.contact_code}")

        await publish_event("contacts.role_added", {
            "contact_id": str(contact_id),
            "contact_code": contact.contact_code,
            "role_id": str(role.id),
            "role_code": role_type.role_code,
        })

        return role

    # ================================================================
    # UPDATE ROLE
    # ================================================================

    async def update_role(
        self,
        role_id: UUID,
        data: RoleUpdate
    ) -> Optional[ContactRole]:
        """Update contact role."""
        role = self.db.query(ContactRole).options(
            joinedload(ContactRole.role_type)
        ).filter(ContactRole.id == role_id).first()

        if not role:
            return None

        if data.is_primary is not None:
            if data.is_primary:
                self._unset_other_primary(role.contact_id, role.role_type_id, exclude_id=role_id)
            role.is_primary = data.is_primary

        if data.related_contact_id is not None:
            role.related_contact_id = data.related_contact_id

        if data.valid_to is not None:
            role.valid_to = data.valid_to

        self.db.commit()
        self.db.refresh(role)

        logger.info(f"Updated role {role_id}")

        await publish_event("contacts.role_updated", {
            "contact_id": str(role.contact_id),
            "role_id": str(role.id),
            "role_code": role.role_type.role_code if role.role_type else None,
        })

        return role

    # ================================================================
    # REMOVE ROLE
    # ================================================================

    async def remove_role(self, role_id: UUID) -> bool:
        """Remove (end validity of) contact role."""
        role = self.db.query(ContactRole).options(
            joinedload(ContactRole.contact),
            joinedload(ContactRole.role_type)
        ).filter(ContactRole.id == role_id).first()

        if not role:
            return False

        # Soft remove - set valid_to to today
        role.valid_to = date.today()
        self.db.commit()

        logger.info(f"Removed role {role_id} from contact {role.contact_id}")

        await publish_event("contacts.role_removed", {
            "contact_id": str(role.contact_id),
            "contact_code": role.contact.contact_code if role.contact else None,
            "role_id": str(role.id),
            "role_code": role.role_type.role_code if role.role_type else None,
        })

        return True

    # ================================================================
    # LIST ROLES
    # ================================================================

    def get_contact_roles(
        self,
        contact_id: UUID,
        include_inactive: bool = False
    ) -> List[ContactRole]:
        """Get all roles for a contact."""
        query = self.db.query(ContactRole).options(
            joinedload(ContactRole.role_type),
            joinedload(ContactRole.related_contact),
        ).filter(ContactRole.contact_id == contact_id)

        if not include_inactive:
            query = query.filter(ContactRole.valid_to == None)

        return query.order_by(ContactRole.is_primary.desc(), ContactRole.created_at).all()

    def get_contacts_by_role(
        self,
        role_code: str,
        skip: int = 0,
        limit: int = 50
    ) -> tuple[List[Contact], int]:
        """Get all contacts with specific role."""
        role_type = self.db.query(RoleType).filter(RoleType.role_code == role_code).first()
        if not role_type:
            return [], 0

        query = self.db.query(Contact).join(ContactRole).filter(
            ContactRole.role_type_id == role_type.id,
            ContactRole.valid_to == None,
            Contact.is_deleted == False,
        )

        total = query.count()
        contacts = query.offset(skip).limit(limit).all()

        return contacts, total

    # ================================================================
    # HELPERS
    # ================================================================

    def _unset_other_primary(
        self,
        contact_id: UUID,
        role_type_id: UUID,
        exclude_id: Optional[UUID] = None
    ):
        """Unset primary flag on other roles of same type."""
        query = self.db.query(ContactRole).filter(
            ContactRole.contact_id == contact_id,
            ContactRole.role_type_id == role_type_id,
            ContactRole.is_primary == True,
            ContactRole.valid_to == None,
        )

        if exclude_id:
            query = query.filter(ContactRole.id != exclude_id)

        for role in query.all():
            role.is_primary = False
