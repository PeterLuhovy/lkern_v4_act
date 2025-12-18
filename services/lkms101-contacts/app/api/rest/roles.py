"""
================================================================
FILE: roles.py
PATH: /services/lkms101-contacts/app/api/rest/roles.py
DESCRIPTION: REST API for Contact Role management
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
from app.services import RoleService
from app.schemas import RoleCreate, RoleUpdate, RoleResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/contacts/{contact_id}/roles", tags=["Contact Roles"])


@router.get("/", response_model=List[RoleResponse])
async def get_contact_roles(
    contact_id: UUID,
    include_inactive: bool = Query(False),
    db: Session = Depends(get_db),
):
    """Get all roles for a contact."""
    service = RoleService(db)
    return service.get_contact_roles(contact_id, include_inactive=include_inactive)


@router.post("/", response_model=RoleResponse, status_code=201)
async def add_role(
    contact_id: UUID,
    data: RoleCreate,
    db: Session = Depends(get_db),
):
    """Add role to contact."""
    service = RoleService(db)
    try:
        return await service.add_role(contact_id, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{role_id}", response_model=RoleResponse)
async def update_role(
    contact_id: UUID,
    role_id: UUID,
    data: RoleUpdate,
    db: Session = Depends(get_db),
):
    """Update contact role."""
    service = RoleService(db)
    role = await service.update_role(role_id, data)

    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    return role


@router.delete("/{role_id}")
async def remove_role(
    contact_id: UUID,
    role_id: UUID,
    db: Session = Depends(get_db),
):
    """Remove role from contact (sets valid_to)."""
    service = RoleService(db)
    success = await service.remove_role(role_id)

    if not success:
        raise HTTPException(status_code=404, detail="Role not found")

    return {"status": "removed"}


# ================================================================
# SEARCH BY ROLE
# ================================================================

role_search_router = APIRouter(prefix="/contacts/by-role", tags=["Contact Search"])


@role_search_router.get("/{role_code}")
async def get_contacts_by_role(
    role_code: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """Get all contacts with specific role code (e.g., SUPPLIER, CUSTOMER)."""
    service = RoleService(db)
    contacts, total = service.get_contacts_by_role(role_code, skip=skip, limit=limit)

    return {
        "items": contacts,
        "total": total,
        "role_code": role_code,
    }
