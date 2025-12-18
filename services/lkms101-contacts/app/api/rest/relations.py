"""
================================================================
FILE: relations.py
PATH: /services/lkms101-contacts/app/api/rest/relations.py
DESCRIPTION: REST API for Contact Relations (Tags, Languages, Countries, Business Focus)
VERSION: v1.0.0
UPDATED: 2025-12-18
================================================================
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
import logging

from app.database import get_db
from app.services import RelationsService
from app.schemas.relations import (
    ContactTagCreate, ContactTagResponse,
    ContactLanguageCreate, ContactLanguageUpdate, ContactLanguageResponse,
    ContactOperatingCountryCreate, ContactOperatingCountryUpdate, ContactOperatingCountryResponse,
    ContactBusinessFocusAreaCreate, ContactBusinessFocusAreaUpdate, ContactBusinessFocusAreaResponse,
)

logger = logging.getLogger(__name__)


# ================================================================
# TAGS
# ================================================================

tags_router = APIRouter(prefix="/contacts/{contact_id}/tags", tags=["Contact Tags"])


@tags_router.get("/", response_model=List[ContactTagResponse])
async def get_contact_tags(
    contact_id: UUID,
    db: Session = Depends(get_db),
):
    """Get all tags for a contact."""
    service = RelationsService(db)
    return service.get_contact_tags(contact_id)


@tags_router.post("/", response_model=ContactTagResponse, status_code=201)
async def add_tag(
    contact_id: UUID,
    data: ContactTagCreate,
    db: Session = Depends(get_db),
):
    """Add tag to contact."""
    service = RelationsService(db)
    return service.add_tag(contact_id, data)


@tags_router.delete("/{tag_id}")
async def remove_tag(
    contact_id: UUID,
    tag_id: UUID,
    db: Session = Depends(get_db),
):
    """Remove tag from contact."""
    service = RelationsService(db)
    success = service.remove_tag(contact_id, tag_id)

    if not success:
        raise HTTPException(status_code=404, detail="Tag not found on contact")

    return {"status": "removed"}


# ================================================================
# LANGUAGES
# ================================================================

languages_router = APIRouter(prefix="/contacts/{contact_id}/languages", tags=["Contact Languages"])


@languages_router.get("/", response_model=List[ContactLanguageResponse])
async def get_contact_languages(
    contact_id: UUID,
    db: Session = Depends(get_db),
):
    """Get all languages for a contact."""
    service = RelationsService(db)
    return service.get_contact_languages(contact_id)


@languages_router.post("/", response_model=ContactLanguageResponse, status_code=201)
async def add_language(
    contact_id: UUID,
    data: ContactLanguageCreate,
    db: Session = Depends(get_db),
):
    """Add language to contact."""
    service = RelationsService(db)
    return service.add_language(contact_id, data)


@languages_router.put("/{language_id}", response_model=ContactLanguageResponse)
async def update_language(
    contact_id: UUID,
    language_id: UUID,
    data: ContactLanguageUpdate,
    db: Session = Depends(get_db),
):
    """Update contact language (e.g., set as primary)."""
    service = RelationsService(db)
    lang = service.update_language(contact_id, language_id, data)

    if not lang:
        raise HTTPException(status_code=404, detail="Language not found on contact")

    return lang


@languages_router.delete("/{language_id}")
async def remove_language(
    contact_id: UUID,
    language_id: UUID,
    db: Session = Depends(get_db),
):
    """Remove language from contact."""
    service = RelationsService(db)
    success = service.remove_language(contact_id, language_id)

    if not success:
        raise HTTPException(status_code=404, detail="Language not found on contact")

    return {"status": "removed"}


# ================================================================
# OPERATING COUNTRIES
# ================================================================

countries_router = APIRouter(prefix="/contacts/{contact_id}/operating-countries", tags=["Contact Operating Countries"])


@countries_router.get("/", response_model=List[ContactOperatingCountryResponse])
async def get_contact_operating_countries(
    contact_id: UUID,
    db: Session = Depends(get_db),
):
    """Get all operating countries for a contact."""
    service = RelationsService(db)
    return service.get_contact_operating_countries(contact_id)


@countries_router.post("/", response_model=ContactOperatingCountryResponse, status_code=201)
async def add_operating_country(
    contact_id: UUID,
    data: ContactOperatingCountryCreate,
    db: Session = Depends(get_db),
):
    """Add operating country to contact."""
    service = RelationsService(db)
    return service.add_operating_country(contact_id, data)


@countries_router.put("/{country_id}", response_model=ContactOperatingCountryResponse)
async def update_operating_country(
    contact_id: UUID,
    country_id: UUID,
    data: ContactOperatingCountryUpdate,
    db: Session = Depends(get_db),
):
    """Update contact operating country (e.g., set as primary)."""
    service = RelationsService(db)
    country = service.update_operating_country(contact_id, country_id, data)

    if not country:
        raise HTTPException(status_code=404, detail="Country not found on contact")

    return country


@countries_router.delete("/{country_id}")
async def remove_operating_country(
    contact_id: UUID,
    country_id: UUID,
    db: Session = Depends(get_db),
):
    """Remove operating country from contact."""
    service = RelationsService(db)
    success = service.remove_operating_country(contact_id, country_id)

    if not success:
        raise HTTPException(status_code=404, detail="Country not found on contact")

    return {"status": "removed"}


# ================================================================
# BUSINESS FOCUS AREAS
# ================================================================

focus_router = APIRouter(prefix="/contacts/{contact_id}/business-focus", tags=["Contact Business Focus Areas"])


@focus_router.get("/", response_model=List[ContactBusinessFocusAreaResponse])
async def get_contact_business_focus_areas(
    contact_id: UUID,
    db: Session = Depends(get_db),
):
    """Get all business focus areas for a contact."""
    service = RelationsService(db)
    return service.get_contact_business_focus_areas(contact_id)


@focus_router.post("/", response_model=ContactBusinessFocusAreaResponse, status_code=201)
async def add_business_focus_area(
    contact_id: UUID,
    data: ContactBusinessFocusAreaCreate,
    db: Session = Depends(get_db),
):
    """Add business focus area to contact."""
    service = RelationsService(db)
    return service.add_business_focus_area(contact_id, data)


@focus_router.put("/{focus_area_id}", response_model=ContactBusinessFocusAreaResponse)
async def update_business_focus_area(
    contact_id: UUID,
    focus_area_id: UUID,
    data: ContactBusinessFocusAreaUpdate,
    db: Session = Depends(get_db),
):
    """Update contact business focus area (e.g., set as primary)."""
    service = RelationsService(db)
    focus = service.update_business_focus_area(contact_id, focus_area_id, data)

    if not focus:
        raise HTTPException(status_code=404, detail="Business focus area not found on contact")

    return focus


@focus_router.delete("/{focus_area_id}")
async def remove_business_focus_area(
    contact_id: UUID,
    focus_area_id: UUID,
    db: Session = Depends(get_db),
):
    """Remove business focus area from contact."""
    service = RelationsService(db)
    success = service.remove_business_focus_area(contact_id, focus_area_id)

    if not success:
        raise HTTPException(status_code=404, detail="Business focus area not found on contact")

    return {"status": "removed"}
