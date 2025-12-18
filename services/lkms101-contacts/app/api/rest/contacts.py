"""
================================================================
FILE: contacts.py
PATH: /services/lkms101-contacts/app/api/rest/contacts.py
DESCRIPTION: REST API for Contact CRUD operations
VERSION: v1.0.0
UPDATED: 2025-12-18
================================================================
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List, Union
from uuid import UUID
import logging

from app.database import get_db
from app.services import ContactService
from app.schemas import (
    ContactCreatePerson,
    ContactCreateCompany,
    ContactCreateOrganizationalUnit,
    ContactUpdate,
    ContactResponse,
    ContactListResponse,
    DeleteResponse,
    RestoreResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/contacts", tags=["Contacts"])


# ================================================================
# LIST & READ
# ================================================================

@router.get("/", response_model=dict)
async def list_contacts(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    contact_type: Optional[str] = Query(None, description="Filter: person, company, organizational_unit"),
    search: Optional[str] = Query(None, description="Search in names, codes"),
    include_deleted: bool = Query(False),
    db: Session = Depends(get_db),
):
    """List contacts with filtering and pagination."""
    service = ContactService(db)
    contacts, total = service.list_contacts(
        skip=skip,
        limit=limit,
        contact_type=contact_type,
        search=search,
        include_deleted=include_deleted,
    )

    return {
        "items": [ContactListResponse.model_validate(c) for c in contacts],
        "total": total,
        "skip": skip,
        "limit": limit,
    }


@router.get("/{contact_id}", response_model=ContactResponse)
async def get_contact(
    contact_id: UUID,
    include_deleted: bool = Query(False),
    db: Session = Depends(get_db),
):
    """Get contact by ID."""
    service = ContactService(db)
    contact = service.get_by_id(contact_id, include_deleted=include_deleted)

    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    return contact


@router.get("/code/{contact_code}", response_model=ContactResponse)
async def get_contact_by_code(
    contact_code: str,
    include_deleted: bool = Query(False),
    db: Session = Depends(get_db),
):
    """Get contact by human-readable code (e.g., con-2512-0001)."""
    service = ContactService(db)
    contact = service.get_by_code(contact_code, include_deleted=include_deleted)

    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    return contact


# ================================================================
# CREATE
# ================================================================

@router.post("/person", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def create_person(
    data: ContactCreatePerson,
    db: Session = Depends(get_db),
):
    """Create a new person contact."""
    service = ContactService(db)
    contact = await service.create_person(data)
    return contact


@router.post("/company", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def create_company(
    data: ContactCreateCompany,
    db: Session = Depends(get_db),
):
    """Create a new company contact."""
    service = ContactService(db)
    contact = await service.create_company(data)
    return contact


@router.post("/organizational-unit", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def create_organizational_unit(
    data: ContactCreateOrganizationalUnit,
    db: Session = Depends(get_db),
):
    """Create a new organizational unit contact."""
    service = ContactService(db)
    contact = await service.create_organizational_unit(data)
    return contact


# ================================================================
# UPDATE
# ================================================================

@router.put("/{contact_id}", response_model=ContactResponse)
async def update_contact(
    contact_id: UUID,
    data: ContactUpdate,
    db: Session = Depends(get_db),
):
    """Update contact data."""
    service = ContactService(db)
    contact = await service.update(contact_id, data)

    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    return contact


# ================================================================
# DELETE / RESTORE
# ================================================================

@router.delete("/{contact_id}", response_model=DeleteResponse)
async def delete_contact(
    contact_id: UUID,
    db: Session = Depends(get_db),
):
    """Soft delete contact."""
    service = ContactService(db)
    contact = await service.soft_delete(contact_id)

    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    return DeleteResponse(
        id=contact.id,
        contact_code=contact.contact_code,
        deleted_at=contact.deleted_at,
    )


@router.post("/{contact_id}/restore", response_model=RestoreResponse)
async def restore_contact(
    contact_id: UUID,
    db: Session = Depends(get_db),
):
    """Restore soft-deleted contact."""
    service = ContactService(db)
    contact = await service.restore(contact_id)

    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found or not deleted")

    return RestoreResponse(
        id=contact.id,
        contact_code=contact.contact_code,
    )
