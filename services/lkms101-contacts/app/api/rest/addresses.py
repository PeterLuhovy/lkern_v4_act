"""
================================================================
FILE: addresses.py
PATH: /services/lkms101-contacts/app/api/rest/addresses.py
DESCRIPTION: REST API for Contact Address management
VERSION: v1.0.0
UPDATED: 2025-12-18
================================================================
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
import logging

from app.database import get_db
from app.services import AddressService, ContactService
from app.schemas.address import (
    AddressCreate, AddressUpdate, AddressResponse,
    PersonAddressCreate, PersonAddressCreateWithAddress, PersonAddressResponse,
    CompanyAddressCreate, CompanyAddressCreateWithAddress, CompanyAddressResponse,
    OrgUnitAddressCreate, OrgUnitAddressCreateWithAddress, OrgUnitAddressResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/contacts/{contact_id}/addresses", tags=["Contact Addresses"])


# ================================================================
# PERSON ADDRESSES
# ================================================================

@router.get("/person", response_model=List[PersonAddressResponse])
async def get_person_addresses(
    contact_id: UUID,
    db: Session = Depends(get_db),
):
    """Get all addresses for a person contact."""
    service = AddressService(db)
    return service.get_person_addresses(contact_id)


@router.post("/person", response_model=PersonAddressResponse, status_code=201)
async def add_person_address(
    contact_id: UUID,
    data: PersonAddressCreateWithAddress,
    db: Session = Depends(get_db),
):
    """Add address to person contact (creates address if needed)."""
    # Verify contact exists and is a person
    contact_service = ContactService(db)
    contact = contact_service.get_by_id(contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    if contact.contact_type != "person":
        raise HTTPException(status_code=400, detail="Contact is not a person")

    service = AddressService(db)
    return service.add_person_address(contact_id, data)


@router.post("/person/existing", response_model=PersonAddressResponse, status_code=201)
async def link_existing_address_to_person(
    contact_id: UUID,
    data: PersonAddressCreate,
    db: Session = Depends(get_db),
):
    """Link existing address to person contact."""
    contact_service = ContactService(db)
    contact = contact_service.get_by_id(contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    if contact.contact_type != "person":
        raise HTTPException(status_code=400, detail="Contact is not a person")

    service = AddressService(db)
    return service.add_person_address(contact_id, data)


# ================================================================
# COMPANY ADDRESSES
# ================================================================

@router.get("/company", response_model=List[CompanyAddressResponse])
async def get_company_addresses(
    contact_id: UUID,
    db: Session = Depends(get_db),
):
    """Get all addresses for a company contact."""
    service = AddressService(db)
    return service.get_company_addresses(contact_id)


@router.post("/company", response_model=CompanyAddressResponse, status_code=201)
async def add_company_address(
    contact_id: UUID,
    data: CompanyAddressCreateWithAddress,
    db: Session = Depends(get_db),
):
    """Add address to company contact (creates address if needed)."""
    contact_service = ContactService(db)
    contact = contact_service.get_by_id(contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    if contact.contact_type != "company":
        raise HTTPException(status_code=400, detail="Contact is not a company")

    service = AddressService(db)
    return service.add_company_address(contact_id, data)


@router.post("/company/existing", response_model=CompanyAddressResponse, status_code=201)
async def link_existing_address_to_company(
    contact_id: UUID,
    data: CompanyAddressCreate,
    db: Session = Depends(get_db),
):
    """Link existing address to company contact."""
    contact_service = ContactService(db)
    contact = contact_service.get_by_id(contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    if contact.contact_type != "company":
        raise HTTPException(status_code=400, detail="Contact is not a company")

    service = AddressService(db)
    return service.add_company_address(contact_id, data)


# ================================================================
# ORGANIZATIONAL UNIT ADDRESSES
# ================================================================

@router.get("/org-unit", response_model=List[OrgUnitAddressResponse])
async def get_org_unit_addresses(
    contact_id: UUID,
    db: Session = Depends(get_db),
):
    """Get all addresses for an organizational unit contact."""
    service = AddressService(db)
    return service.get_org_unit_addresses(contact_id)


@router.post("/org-unit", response_model=OrgUnitAddressResponse, status_code=201)
async def add_org_unit_address(
    contact_id: UUID,
    data: OrgUnitAddressCreateWithAddress,
    db: Session = Depends(get_db),
):
    """Add address to organizational unit contact (creates address if needed)."""
    contact_service = ContactService(db)
    contact = contact_service.get_by_id(contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    if contact.contact_type != "organizational_unit":
        raise HTTPException(status_code=400, detail="Contact is not an organizational unit")

    service = AddressService(db)
    return service.add_org_unit_address(contact_id, data)


@router.post("/org-unit/existing", response_model=OrgUnitAddressResponse, status_code=201)
async def link_existing_address_to_org_unit(
    contact_id: UUID,
    data: OrgUnitAddressCreate,
    db: Session = Depends(get_db),
):
    """Link existing address to organizational unit contact."""
    contact_service = ContactService(db)
    contact = contact_service.get_by_id(contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    if contact.contact_type != "organizational_unit":
        raise HTTPException(status_code=400, detail="Contact is not an organizational unit")

    service = AddressService(db)
    return service.add_org_unit_address(contact_id, data)


# ================================================================
# DELETE ADDRESS (Universal - sets valid_to)
# ================================================================

@router.delete("/{address_junction_id}")
async def remove_contact_address(
    contact_id: UUID,
    address_junction_id: UUID,
    contact_type: str = Query(..., description="person, company, or organizational_unit"),
    db: Session = Depends(get_db),
):
    """Remove address from contact (soft delete via valid_to)."""
    service = AddressService(db)
    success = service.delete_contact_address(address_junction_id, contact_type)

    if not success:
        raise HTTPException(status_code=404, detail="Address not found")

    return {"status": "removed"}


# ================================================================
# ADDRESS POOL (Standalone addresses)
# ================================================================

address_pool_router = APIRouter(prefix="/addresses", tags=["Address Pool"])


@address_pool_router.post("/", response_model=AddressResponse, status_code=201)
async def create_address(
    data: AddressCreate,
    db: Session = Depends(get_db),
):
    """Create a new address in the pool (not linked to any contact)."""
    service = AddressService(db)
    return service.create_address(data)


@address_pool_router.put("/{address_id}", response_model=AddressResponse)
async def update_address(
    address_id: UUID,
    data: AddressUpdate,
    db: Session = Depends(get_db),
):
    """Update address in the pool."""
    service = AddressService(db)
    address = service.update_address(address_id, data)

    if not address:
        raise HTTPException(status_code=404, detail="Address not found")

    return address
