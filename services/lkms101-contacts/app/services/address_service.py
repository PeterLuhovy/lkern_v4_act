"""
================================================================
FILE: address_service.py
PATH: /services/lkms101-contacts/app/services/address_service.py
DESCRIPTION: Contact address management service
VERSION: v1.0.0
UPDATED: 2025-12-18
================================================================

Type-safe address system with separate junction tables for:
- PersonAddress (personal, work, billing, delivery, correspondence)
- CompanyAddress (headquarters, billing, delivery, warehouse, branch, correspondence)
- OrganizationalUnitAddress (branch, warehouse, delivery, correspondence)
"""

from typing import Optional, List, Union
from uuid import UUID
from sqlalchemy.orm import Session, joinedload
import logging

from app.models import (
    Contact, Address, PersonAddress, CompanyAddress, OrganizationalUnitAddress
)
from app.schemas.address import (
    AddressCreate, AddressUpdate,
    PersonAddressCreate, PersonAddressCreateWithAddress,
    CompanyAddressCreate, CompanyAddressCreateWithAddress,
    OrgUnitAddressCreate, OrgUnitAddressCreateWithAddress,
)

logger = logging.getLogger(__name__)


class AddressService:
    """Service for contact address management."""

    def __init__(self, db: Session):
        self.db = db

    # ================================================================
    # ADDRESS POOL
    # ================================================================

    def create_address(self, data: AddressCreate) -> Address:
        """Create a new address in the pool."""
        address = Address(
            street=data.street,
            street_number=data.street_number,
            building_number=data.building_number,
            city=data.city,
            postal_code=data.postal_code,
            region=data.region,
            country_id=data.country_id,
            latitude=data.latitude,
            longitude=data.longitude,
        )
        self.db.add(address)
        self.db.commit()
        self.db.refresh(address)

        logger.info(f"Created address in {address.city}")
        return address

    def get_or_create_address(self, data: AddressCreate) -> Address:
        """Get existing address or create new one."""
        # Try to find existing
        existing = self.db.query(Address).filter(
            Address.street == data.street,
            Address.street_number == data.street_number,
            Address.city == data.city,
            Address.postal_code == data.postal_code,
            Address.country_id == data.country_id,
        ).first()

        if existing:
            return existing

        return self.create_address(data)

    def update_address(self, address_id: UUID, data: AddressUpdate) -> Optional[Address]:
        """Update address."""
        address = self.db.query(Address).filter(Address.id == address_id).first()
        if not address:
            return None

        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(address, field, value)

        self.db.commit()
        self.db.refresh(address)
        return address

    # ================================================================
    # PERSON ADDRESS
    # ================================================================

    def add_person_address(
        self,
        contact_id: UUID,
        data: Union[PersonAddressCreate, PersonAddressCreateWithAddress]
    ) -> PersonAddress:
        """Add address to person contact."""
        if isinstance(data, PersonAddressCreateWithAddress):
            address = self.get_or_create_address(data.address)
            address_id = address.id
            address_type = data.address_type
            is_primary = data.is_primary
            valid_from = data.valid_from
            valid_to = data.valid_to
        else:
            address_id = data.address_id
            address_type = data.address_type
            is_primary = data.is_primary
            valid_from = data.valid_from
            valid_to = data.valid_to

        if is_primary:
            self._unset_primary_person_address(contact_id)

        person_address = PersonAddress(
            contact_id=contact_id,
            address_id=address_id,
            address_type=address_type,
            is_primary=is_primary,
            valid_from=valid_from,
            valid_to=valid_to,
        )
        self.db.add(person_address)
        self.db.commit()
        self.db.refresh(person_address)

        logger.info(f"Added {address_type} address to person {contact_id}")
        return person_address

    def get_person_addresses(self, contact_id: UUID) -> List[PersonAddress]:
        """Get all addresses for person contact."""
        return self.db.query(PersonAddress).options(
            joinedload(PersonAddress.address).joinedload(Address.country)
        ).filter(
            PersonAddress.contact_id == contact_id,
            PersonAddress.valid_to == None,
        ).order_by(PersonAddress.is_primary.desc()).all()

    def _unset_primary_person_address(self, contact_id: UUID, exclude_id: Optional[UUID] = None):
        """Unset primary flag on other person addresses."""
        query = self.db.query(PersonAddress).filter(
            PersonAddress.contact_id == contact_id,
            PersonAddress.is_primary == True,
            PersonAddress.valid_to == None,
        )
        if exclude_id:
            query = query.filter(PersonAddress.id != exclude_id)
        for a in query.all():
            a.is_primary = False

    # ================================================================
    # COMPANY ADDRESS
    # ================================================================

    def add_company_address(
        self,
        contact_id: UUID,
        data: Union[CompanyAddressCreate, CompanyAddressCreateWithAddress]
    ) -> CompanyAddress:
        """Add address to company contact."""
        if isinstance(data, CompanyAddressCreateWithAddress):
            address = self.get_or_create_address(data.address)
            address_id = address.id
            address_type = data.address_type
            is_primary = data.is_primary
            valid_from = data.valid_from
            valid_to = data.valid_to
        else:
            address_id = data.address_id
            address_type = data.address_type
            is_primary = data.is_primary
            valid_from = data.valid_from
            valid_to = data.valid_to

        if is_primary:
            self._unset_primary_company_address(contact_id)

        company_address = CompanyAddress(
            contact_id=contact_id,
            address_id=address_id,
            address_type=address_type,
            is_primary=is_primary,
            valid_from=valid_from,
            valid_to=valid_to,
        )
        self.db.add(company_address)
        self.db.commit()
        self.db.refresh(company_address)

        logger.info(f"Added {address_type} address to company {contact_id}")
        return company_address

    def get_company_addresses(self, contact_id: UUID) -> List[CompanyAddress]:
        """Get all addresses for company contact."""
        return self.db.query(CompanyAddress).options(
            joinedload(CompanyAddress.address).joinedload(Address.country)
        ).filter(
            CompanyAddress.contact_id == contact_id,
            CompanyAddress.valid_to == None,
        ).order_by(CompanyAddress.is_primary.desc()).all()

    def _unset_primary_company_address(self, contact_id: UUID, exclude_id: Optional[UUID] = None):
        """Unset primary flag on other company addresses."""
        query = self.db.query(CompanyAddress).filter(
            CompanyAddress.contact_id == contact_id,
            CompanyAddress.is_primary == True,
            CompanyAddress.valid_to == None,
        )
        if exclude_id:
            query = query.filter(CompanyAddress.id != exclude_id)
        for a in query.all():
            a.is_primary = False

    # ================================================================
    # ORGANIZATIONAL UNIT ADDRESS
    # ================================================================

    def add_org_unit_address(
        self,
        contact_id: UUID,
        data: Union[OrgUnitAddressCreate, OrgUnitAddressCreateWithAddress]
    ) -> OrganizationalUnitAddress:
        """Add address to organizational unit contact."""
        if isinstance(data, OrgUnitAddressCreateWithAddress):
            address = self.get_or_create_address(data.address)
            address_id = address.id
            address_type = data.address_type
            is_primary = data.is_primary
            valid_from = data.valid_from
            valid_to = data.valid_to
        else:
            address_id = data.address_id
            address_type = data.address_type
            is_primary = data.is_primary
            valid_from = data.valid_from
            valid_to = data.valid_to

        if is_primary:
            self._unset_primary_org_unit_address(contact_id)

        org_unit_address = OrganizationalUnitAddress(
            contact_id=contact_id,
            address_id=address_id,
            address_type=address_type,
            is_primary=is_primary,
            valid_from=valid_from,
            valid_to=valid_to,
        )
        self.db.add(org_unit_address)
        self.db.commit()
        self.db.refresh(org_unit_address)

        logger.info(f"Added {address_type} address to org unit {contact_id}")
        return org_unit_address

    def get_org_unit_addresses(self, contact_id: UUID) -> List[OrganizationalUnitAddress]:
        """Get all addresses for organizational unit contact."""
        return self.db.query(OrganizationalUnitAddress).options(
            joinedload(OrganizationalUnitAddress.address).joinedload(Address.country)
        ).filter(
            OrganizationalUnitAddress.contact_id == contact_id,
            OrganizationalUnitAddress.valid_to == None,
        ).order_by(OrganizationalUnitAddress.is_primary.desc()).all()

    def _unset_primary_org_unit_address(self, contact_id: UUID, exclude_id: Optional[UUID] = None):
        """Unset primary flag on other org unit addresses."""
        query = self.db.query(OrganizationalUnitAddress).filter(
            OrganizationalUnitAddress.contact_id == contact_id,
            OrganizationalUnitAddress.is_primary == True,
            OrganizationalUnitAddress.valid_to == None,
        )
        if exclude_id:
            query = query.filter(OrganizationalUnitAddress.id != exclude_id)
        for a in query.all():
            a.is_primary = False

    # ================================================================
    # GENERIC DELETE
    # ================================================================

    def delete_contact_address(
        self,
        address_junction_id: UUID,
        contact_type: str
    ) -> bool:
        """End validity of contact address (soft delete via valid_to)."""
        from datetime import date

        if contact_type == "person":
            model = PersonAddress
        elif contact_type == "company":
            model = CompanyAddress
        elif contact_type == "organizational_unit":
            model = OrganizationalUnitAddress
        else:
            return False

        junction = self.db.query(model).filter(model.id == address_junction_id).first()
        if not junction:
            return False

        junction.valid_to = date.today()
        self.db.commit()
        return True
