"""
================================================================
FILE: contact_service.py
PATH: /services/lkms101-contacts/app/services/contact_service.py
DESCRIPTION: Contact CRUD service with business logic
VERSION: v1.0.0
UPDATED: 2025-12-18
================================================================
"""

from datetime import datetime
from typing import Optional, List
from uuid import UUID
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
import logging

from app.models import (
    Contact, ContactPerson, ContactCompany, ContactOrganizationalUnit,
)
from app.schemas.contact import (
    ContactCreatePerson, ContactCreateCompany, ContactCreateOrganizationalUnit,
    ContactUpdate, ContactResponse,
)
from app.services.code_generator import generate_contact_code
from app.events.producer import publish_event

logger = logging.getLogger(__name__)


class ContactService:
    """Service for Contact CRUD operations."""

    def __init__(self, db: Session):
        self.db = db

    # ================================================================
    # CREATE
    # ================================================================

    async def create_person(
        self,
        data: ContactCreatePerson,
        created_by_id: Optional[UUID] = None
    ) -> Contact:
        """Create a new person contact."""
        contact_code = generate_contact_code(self.db)

        contact = Contact(
            contact_code=contact_code,
            contact_type="person",
            created_by_id=created_by_id,
        )
        self.db.add(contact)
        self.db.flush()  # Get contact.id

        person = ContactPerson(
            contact_id=contact.id,
            first_name=data.person.first_name,
            last_name=data.person.last_name,
            title_before=data.person.title_before,
            title_after=data.person.title_after,
            birth_date=data.person.birth_date,
            gender=data.person.gender,
            nationality_id=data.person.nationality_id,
        )
        self.db.add(person)
        self.db.commit()
        self.db.refresh(contact)

        logger.info(f"Created person contact: {contact_code}")

        # Publish event
        await publish_event("contacts.created", {
            "id": str(contact.id),
            "contact_code": contact_code,
            "contact_type": "person",
            "display_name": f"{person.first_name} {person.last_name}",
        })

        return contact

    async def create_company(
        self,
        data: ContactCreateCompany,
        created_by_id: Optional[UUID] = None
    ) -> Contact:
        """Create a new company contact."""
        contact_code = generate_contact_code(self.db)

        contact = Contact(
            contact_code=contact_code,
            contact_type="company",
            created_by_id=created_by_id,
        )
        self.db.add(contact)
        self.db.flush()

        company = ContactCompany(
            contact_id=contact.id,
            company_name=data.company.company_name,
            legal_form_id=data.company.legal_form_id,
            registration_number=data.company.registration_number,
            tax_number=data.company.tax_number,
            vat_number=data.company.vat_number,
            established_date=data.company.established_date,
            company_status=data.company.company_status,
        )
        self.db.add(company)
        self.db.commit()
        self.db.refresh(contact)

        logger.info(f"Created company contact: {contact_code}")

        await publish_event("contacts.created", {
            "id": str(contact.id),
            "contact_code": contact_code,
            "contact_type": "company",
            "display_name": company.company_name,
        })

        return contact

    async def create_organizational_unit(
        self,
        data: ContactCreateOrganizationalUnit,
        created_by_id: Optional[UUID] = None
    ) -> Contact:
        """Create a new organizational unit contact."""
        contact_code = generate_contact_code(self.db)

        contact = Contact(
            contact_code=contact_code,
            contact_type="organizational_unit",
            created_by_id=created_by_id,
        )
        self.db.add(contact)
        self.db.flush()

        org_unit = ContactOrganizationalUnit(
            contact_id=contact.id,
            unit_name=data.organizational_unit.unit_name,
            unit_type_id=data.organizational_unit.unit_type_id,
            parent_unit_id=data.organizational_unit.parent_unit_id,
            parent_company_id=data.organizational_unit.parent_company_id,
        )
        self.db.add(org_unit)
        self.db.commit()
        self.db.refresh(contact)

        logger.info(f"Created organizational unit contact: {contact_code}")

        await publish_event("contacts.created", {
            "id": str(contact.id),
            "contact_code": contact_code,
            "contact_type": "organizational_unit",
            "display_name": org_unit.unit_name,
        })

        return contact

    # ================================================================
    # READ
    # ================================================================

    def get_by_id(self, contact_id: UUID, include_deleted: bool = False) -> Optional[Contact]:
        """Get contact by ID with all relationships loaded."""
        query = self.db.query(Contact).options(
            joinedload(Contact.person).joinedload(ContactPerson.nationality),
            joinedload(Contact.company).joinedload(ContactCompany.legal_form),
            joinedload(Contact.organizational_unit).joinedload(ContactOrganizationalUnit.unit_type),
        ).filter(Contact.id == contact_id)

        if not include_deleted:
            query = query.filter(Contact.is_deleted == False)

        return query.first()

    def get_by_code(self, contact_code: str, include_deleted: bool = False) -> Optional[Contact]:
        """Get contact by code."""
        query = self.db.query(Contact).options(
            joinedload(Contact.person),
            joinedload(Contact.company),
            joinedload(Contact.organizational_unit),
        ).filter(Contact.contact_code == contact_code)

        if not include_deleted:
            query = query.filter(Contact.is_deleted == False)

        return query.first()

    def list_contacts(
        self,
        skip: int = 0,
        limit: int = 50,
        contact_type: Optional[str] = None,
        search: Optional[str] = None,
        include_deleted: bool = False,
    ) -> tuple[List[Contact], int]:
        """List contacts with filtering and pagination."""
        query = self.db.query(Contact).options(
            joinedload(Contact.person),
            joinedload(Contact.company),
            joinedload(Contact.organizational_unit),
        )

        if not include_deleted:
            query = query.filter(Contact.is_deleted == False)

        if contact_type:
            query = query.filter(Contact.contact_type == contact_type)

        if search:
            search_pattern = f"%{search}%"
            query = query.outerjoin(ContactPerson).outerjoin(ContactCompany).outerjoin(ContactOrganizationalUnit)
            query = query.filter(
                or_(
                    Contact.contact_code.ilike(search_pattern),
                    ContactPerson.first_name.ilike(search_pattern),
                    ContactPerson.last_name.ilike(search_pattern),
                    ContactCompany.company_name.ilike(search_pattern),
                    ContactCompany.registration_number.ilike(search_pattern),
                    ContactOrganizationalUnit.unit_name.ilike(search_pattern),
                )
            )

        total = query.count()
        contacts = query.order_by(Contact.created_at.desc()).offset(skip).limit(limit).all()

        return contacts, total

    # ================================================================
    # UPDATE
    # ================================================================

    async def update(
        self,
        contact_id: UUID,
        data: ContactUpdate,
        updated_by_id: Optional[UUID] = None
    ) -> Optional[Contact]:
        """Update contact data."""
        contact = self.get_by_id(contact_id)
        if not contact:
            return None

        contact.updated_by_id = updated_by_id

        # Update type-specific data
        if contact.contact_type == "person" and data.person and contact.person:
            for field, value in data.person.model_dump(exclude_unset=True).items():
                setattr(contact.person, field, value)

        elif contact.contact_type == "company" and data.company and contact.company:
            for field, value in data.company.model_dump(exclude_unset=True).items():
                setattr(contact.company, field, value)

        elif contact.contact_type == "organizational_unit" and data.organizational_unit and contact.organizational_unit:
            for field, value in data.organizational_unit.model_dump(exclude_unset=True).items():
                setattr(contact.organizational_unit, field, value)

        self.db.commit()
        self.db.refresh(contact)

        logger.info(f"Updated contact: {contact.contact_code}")

        await publish_event("contacts.updated", {
            "id": str(contact.id),
            "contact_code": contact.contact_code,
            "contact_type": contact.contact_type,
        })

        return contact

    # ================================================================
    # DELETE / RESTORE
    # ================================================================

    async def soft_delete(
        self,
        contact_id: UUID,
        deleted_by_id: Optional[UUID] = None
    ) -> Optional[Contact]:
        """Soft delete contact."""
        contact = self.get_by_id(contact_id)
        if not contact:
            return None

        contact.is_deleted = True
        contact.deleted_at = datetime.utcnow()
        contact.deleted_by_id = deleted_by_id

        # Also mark type-specific entity as deleted
        if contact.person:
            contact.person.is_deleted = True
        elif contact.company:
            contact.company.is_deleted = True
        elif contact.organizational_unit:
            contact.organizational_unit.is_deleted = True

        self.db.commit()
        self.db.refresh(contact)

        logger.info(f"Soft deleted contact: {contact.contact_code}")

        await publish_event("contacts.deleted", {
            "id": str(contact.id),
            "contact_code": contact.contact_code,
        })

        return contact

    async def restore(self, contact_id: UUID) -> Optional[Contact]:
        """Restore soft-deleted contact."""
        contact = self.get_by_id(contact_id, include_deleted=True)
        if not contact or not contact.is_deleted:
            return None

        contact.is_deleted = False
        contact.deleted_at = None
        contact.deleted_by_id = None

        if contact.person:
            contact.person.is_deleted = False
        elif contact.company:
            contact.company.is_deleted = False
        elif contact.organizational_unit:
            contact.organizational_unit.is_deleted = False

        self.db.commit()
        self.db.refresh(contact)

        logger.info(f"Restored contact: {contact.contact_code}")

        return contact
