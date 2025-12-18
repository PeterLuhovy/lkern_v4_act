"""
================================================================
FILE: reference.py
PATH: /services/lkms101-contacts/app/api/rest/reference.py
DESCRIPTION: REST API for Reference Data (read-only lookups)
VERSION: v1.0.0
UPDATED: 2025-12-18
================================================================
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
import logging

from app.database import get_db
from app.models import (
    RoleType, Country, Language, Nationality, LegalForm,
    BusinessFocusArea, Tag, OrganizationalUnitType
)
from app.schemas.reference import (
    RoleTypeResponse, CountryResponse, LanguageResponse, NationalityResponse,
    LegalFormResponse, BusinessFocusAreaResponse, TagResponse, OrganizationalUnitTypeResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/reference", tags=["Reference Data"])


# ================================================================
# ROLE TYPES
# ================================================================

@router.get("/role-types", response_model=List[RoleTypeResponse])
async def list_role_types(
    is_active: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
):
    """Get all role types (SUPPLIER, CUSTOMER, EMPLOYEE, etc.)."""
    query = db.query(RoleType)
    if is_active is not None:
        query = query.filter(RoleType.is_active == is_active)
    return query.order_by(RoleType.display_order, RoleType.code).all()


@router.get("/role-types/{role_type_id}", response_model=RoleTypeResponse)
async def get_role_type(
    role_type_id: UUID,
    db: Session = Depends(get_db),
):
    """Get role type by ID."""
    role_type = db.query(RoleType).filter(RoleType.id == role_type_id).first()
    if not role_type:
        raise HTTPException(status_code=404, detail="Role type not found")
    return role_type


# ================================================================
# COUNTRIES
# ================================================================

@router.get("/countries", response_model=List[CountryResponse])
async def list_countries(
    is_active: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
):
    """Get all countries."""
    query = db.query(Country)
    if is_active is not None:
        query = query.filter(Country.is_active == is_active)
    return query.order_by(Country.name_en).all()


@router.get("/countries/{country_id}", response_model=CountryResponse)
async def get_country(
    country_id: UUID,
    db: Session = Depends(get_db),
):
    """Get country by ID."""
    country = db.query(Country).filter(Country.id == country_id).first()
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")
    return country


@router.get("/countries/code/{iso_code}", response_model=CountryResponse)
async def get_country_by_code(
    iso_code: str,
    db: Session = Depends(get_db),
):
    """Get country by ISO code (SK, CZ, DE, etc.)."""
    country = db.query(Country).filter(Country.iso_code == iso_code.upper()).first()
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")
    return country


# ================================================================
# LANGUAGES
# ================================================================

@router.get("/languages", response_model=List[LanguageResponse])
async def list_languages(
    is_active: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
):
    """Get all languages."""
    query = db.query(Language)
    if is_active is not None:
        query = query.filter(Language.is_active == is_active)
    return query.order_by(Language.name_en).all()


@router.get("/languages/{language_id}", response_model=LanguageResponse)
async def get_language(
    language_id: UUID,
    db: Session = Depends(get_db),
):
    """Get language by ID."""
    language = db.query(Language).filter(Language.id == language_id).first()
    if not language:
        raise HTTPException(status_code=404, detail="Language not found")
    return language


@router.get("/languages/code/{iso_code}", response_model=LanguageResponse)
async def get_language_by_code(
    iso_code: str,
    db: Session = Depends(get_db),
):
    """Get language by ISO code (sk, cs, en, de, etc.)."""
    language = db.query(Language).filter(Language.iso_code == iso_code.lower()).first()
    if not language:
        raise HTTPException(status_code=404, detail="Language not found")
    return language


# ================================================================
# NATIONALITIES
# ================================================================

@router.get("/nationalities", response_model=List[NationalityResponse])
async def list_nationalities(
    is_active: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
):
    """Get all nationalities."""
    query = db.query(Nationality)
    if is_active is not None:
        query = query.filter(Nationality.is_active == is_active)
    return query.order_by(Nationality.name_en).all()


@router.get("/nationalities/{nationality_id}", response_model=NationalityResponse)
async def get_nationality(
    nationality_id: UUID,
    db: Session = Depends(get_db),
):
    """Get nationality by ID."""
    nationality = db.query(Nationality).filter(Nationality.id == nationality_id).first()
    if not nationality:
        raise HTTPException(status_code=404, detail="Nationality not found")
    return nationality


# ================================================================
# LEGAL FORMS
# ================================================================

@router.get("/legal-forms", response_model=List[LegalFormResponse])
async def list_legal_forms(
    country_code: Optional[str] = Query(None, description="Filter by country ISO code"),
    is_active: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
):
    """Get all legal forms (s.r.o., a.s., GmbH, etc.)."""
    query = db.query(LegalForm)
    if country_code:
        query = query.filter(LegalForm.country_code == country_code.upper())
    if is_active is not None:
        query = query.filter(LegalForm.is_active == is_active)
    return query.order_by(LegalForm.country_code, LegalForm.code).all()


@router.get("/legal-forms/{legal_form_id}", response_model=LegalFormResponse)
async def get_legal_form(
    legal_form_id: UUID,
    db: Session = Depends(get_db),
):
    """Get legal form by ID."""
    legal_form = db.query(LegalForm).filter(LegalForm.id == legal_form_id).first()
    if not legal_form:
        raise HTTPException(status_code=404, detail="Legal form not found")
    return legal_form


# ================================================================
# BUSINESS FOCUS AREAS
# ================================================================

@router.get("/business-focus-areas", response_model=List[BusinessFocusAreaResponse])
async def list_business_focus_areas(
    parent_id: Optional[UUID] = Query(None, description="Filter by parent ID (top-level if null)"),
    is_active: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
):
    """Get all business focus areas (industries)."""
    query = db.query(BusinessFocusArea)
    if parent_id is not None:
        query = query.filter(BusinessFocusArea.parent_id == parent_id)
    elif parent_id is None:
        # Return top-level areas if no parent specified
        query = query.filter(BusinessFocusArea.parent_id == None)
    if is_active is not None:
        query = query.filter(BusinessFocusArea.is_active == is_active)
    return query.order_by(BusinessFocusArea.display_order, BusinessFocusArea.code).all()


@router.get("/business-focus-areas/all", response_model=List[BusinessFocusAreaResponse])
async def list_all_business_focus_areas(
    is_active: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
):
    """Get all business focus areas (flat list including children)."""
    query = db.query(BusinessFocusArea)
    if is_active is not None:
        query = query.filter(BusinessFocusArea.is_active == is_active)
    return query.order_by(BusinessFocusArea.display_order, BusinessFocusArea.code).all()


@router.get("/business-focus-areas/{focus_area_id}", response_model=BusinessFocusAreaResponse)
async def get_business_focus_area(
    focus_area_id: UUID,
    db: Session = Depends(get_db),
):
    """Get business focus area by ID."""
    focus_area = db.query(BusinessFocusArea).filter(BusinessFocusArea.id == focus_area_id).first()
    if not focus_area:
        raise HTTPException(status_code=404, detail="Business focus area not found")
    return focus_area


# ================================================================
# TAGS
# ================================================================

@router.get("/tags", response_model=List[TagResponse])
async def list_tags(
    is_active: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
):
    """Get all tags (VIP, Problematic, Strategic Partner, etc.)."""
    query = db.query(Tag)
    if is_active is not None:
        query = query.filter(Tag.is_active == is_active)
    return query.order_by(Tag.display_order, Tag.name).all()


@router.get("/tags/{tag_id}", response_model=TagResponse)
async def get_tag(
    tag_id: UUID,
    db: Session = Depends(get_db),
):
    """Get tag by ID."""
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    return tag


# ================================================================
# ORGANIZATIONAL UNIT TYPES
# ================================================================

@router.get("/org-unit-types", response_model=List[OrganizationalUnitTypeResponse])
async def list_org_unit_types(
    is_active: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
):
    """Get all organizational unit types (DIVISION, DEPARTMENT, TEAM, etc.)."""
    query = db.query(OrganizationalUnitType)
    if is_active is not None:
        query = query.filter(OrganizationalUnitType.is_active == is_active)
    return query.order_by(OrganizationalUnitType.display_order, OrganizationalUnitType.code).all()


@router.get("/org-unit-types/{type_id}", response_model=OrganizationalUnitTypeResponse)
async def get_org_unit_type(
    type_id: UUID,
    db: Session = Depends(get_db),
):
    """Get organizational unit type by ID."""
    org_type = db.query(OrganizationalUnitType).filter(OrganizationalUnitType.id == type_id).first()
    if not org_type:
        raise HTTPException(status_code=404, detail="Organizational unit type not found")
    return org_type
