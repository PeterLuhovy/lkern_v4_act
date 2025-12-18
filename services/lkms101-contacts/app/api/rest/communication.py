"""
================================================================
FILE: communication.py
PATH: /services/lkms101-contacts/app/api/rest/communication.py
DESCRIPTION: REST API for Contact Communication management (Email, Phone, Website, Social)
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
from app.services import CommunicationService
from app.schemas.communication import (
    EmailCreate, EmailUpdate, EmailResponse,
    PhoneCreate, PhoneUpdate, PhoneResponse,
    WebsiteCreate, WebsiteUpdate, WebsiteResponse,
    SocialNetworkCreate, SocialNetworkUpdate, SocialNetworkResponse,
)

logger = logging.getLogger(__name__)


# ================================================================
# EMAIL ENDPOINTS
# ================================================================

email_router = APIRouter(prefix="/contacts/{contact_id}/emails", tags=["Contact Emails"])


@email_router.get("/", response_model=List[EmailResponse])
async def get_contact_emails(
    contact_id: UUID,
    include_deleted: bool = Query(False),
    db: Session = Depends(get_db),
):
    """Get all emails for a contact."""
    service = CommunicationService(db)
    return service.get_contact_emails(contact_id, include_deleted=include_deleted)


@email_router.post("/", response_model=EmailResponse, status_code=201)
async def add_email(
    contact_id: UUID,
    data: EmailCreate,
    db: Session = Depends(get_db),
):
    """Add email to contact."""
    service = CommunicationService(db)
    return service.add_email(contact_id, data)


@email_router.put("/{email_id}", response_model=EmailResponse)
async def update_email(
    contact_id: UUID,
    email_id: UUID,
    data: EmailUpdate,
    db: Session = Depends(get_db),
):
    """Update contact email."""
    service = CommunicationService(db)
    email = service.update_email(email_id, data)

    if not email:
        raise HTTPException(status_code=404, detail="Email not found")

    return email


@email_router.delete("/{email_id}")
async def delete_email(
    contact_id: UUID,
    email_id: UUID,
    db: Session = Depends(get_db),
):
    """Soft delete email."""
    service = CommunicationService(db)
    success = service.delete_email(email_id)

    if not success:
        raise HTTPException(status_code=404, detail="Email not found")

    return {"status": "deleted"}


# ================================================================
# PHONE ENDPOINTS
# ================================================================

phone_router = APIRouter(prefix="/contacts/{contact_id}/phones", tags=["Contact Phones"])


@phone_router.get("/", response_model=List[PhoneResponse])
async def get_contact_phones(
    contact_id: UUID,
    include_deleted: bool = Query(False),
    db: Session = Depends(get_db),
):
    """Get all phones for a contact."""
    service = CommunicationService(db)
    return service.get_contact_phones(contact_id, include_deleted=include_deleted)


@phone_router.post("/", response_model=PhoneResponse, status_code=201)
async def add_phone(
    contact_id: UUID,
    data: PhoneCreate,
    db: Session = Depends(get_db),
):
    """Add phone to contact."""
    service = CommunicationService(db)
    return service.add_phone(contact_id, data)


@phone_router.put("/{phone_id}", response_model=PhoneResponse)
async def update_phone(
    contact_id: UUID,
    phone_id: UUID,
    data: PhoneUpdate,
    db: Session = Depends(get_db),
):
    """Update contact phone."""
    service = CommunicationService(db)
    phone = service.update_phone(phone_id, data)

    if not phone:
        raise HTTPException(status_code=404, detail="Phone not found")

    return phone


@phone_router.delete("/{phone_id}")
async def delete_phone(
    contact_id: UUID,
    phone_id: UUID,
    db: Session = Depends(get_db),
):
    """Soft delete phone."""
    service = CommunicationService(db)
    success = service.delete_phone(phone_id)

    if not success:
        raise HTTPException(status_code=404, detail="Phone not found")

    return {"status": "deleted"}


# ================================================================
# WEBSITE ENDPOINTS
# ================================================================

website_router = APIRouter(prefix="/contacts/{contact_id}/websites", tags=["Contact Websites"])


@website_router.get("/", response_model=List[WebsiteResponse])
async def get_contact_websites(
    contact_id: UUID,
    db: Session = Depends(get_db),
):
    """Get all websites for a contact."""
    service = CommunicationService(db)
    return service.get_contact_websites(contact_id)


@website_router.post("/", response_model=WebsiteResponse, status_code=201)
async def add_website(
    contact_id: UUID,
    data: WebsiteCreate,
    db: Session = Depends(get_db),
):
    """Add website to contact."""
    service = CommunicationService(db)
    return service.add_website(contact_id, data)


@website_router.put("/{website_id}", response_model=WebsiteResponse)
async def update_website(
    contact_id: UUID,
    website_id: UUID,
    data: WebsiteUpdate,
    db: Session = Depends(get_db),
):
    """Update contact website."""
    service = CommunicationService(db)
    website = service.update_website(website_id, data)

    if not website:
        raise HTTPException(status_code=404, detail="Website not found")

    return website


@website_router.delete("/{website_id}")
async def delete_website(
    contact_id: UUID,
    website_id: UUID,
    db: Session = Depends(get_db),
):
    """Delete website."""
    service = CommunicationService(db)
    success = service.delete_website(website_id)

    if not success:
        raise HTTPException(status_code=404, detail="Website not found")

    return {"status": "deleted"}


# ================================================================
# SOCIAL NETWORK ENDPOINTS
# ================================================================

social_router = APIRouter(prefix="/contacts/{contact_id}/social", tags=["Contact Social Networks"])


@social_router.get("/", response_model=List[SocialNetworkResponse])
async def get_contact_social_networks(
    contact_id: UUID,
    db: Session = Depends(get_db),
):
    """Get all social networks for a contact."""
    service = CommunicationService(db)
    return service.get_contact_social_networks(contact_id)


@social_router.post("/", response_model=SocialNetworkResponse, status_code=201)
async def add_social_network(
    contact_id: UUID,
    data: SocialNetworkCreate,
    db: Session = Depends(get_db),
):
    """Add social network profile to contact."""
    service = CommunicationService(db)
    return service.add_social_network(contact_id, data)


@social_router.put("/{social_id}", response_model=SocialNetworkResponse)
async def update_social_network(
    contact_id: UUID,
    social_id: UUID,
    data: SocialNetworkUpdate,
    db: Session = Depends(get_db),
):
    """Update contact social network profile."""
    service = CommunicationService(db)
    social = service.update_social_network(social_id, data)

    if not social:
        raise HTTPException(status_code=404, detail="Social network not found")

    return social


@social_router.delete("/{social_id}")
async def delete_social_network(
    contact_id: UUID,
    social_id: UUID,
    db: Session = Depends(get_db),
):
    """Delete social network profile."""
    service = CommunicationService(db)
    success = service.delete_social_network(social_id)

    if not success:
        raise HTTPException(status_code=404, detail="Social network not found")

    return {"status": "deleted"}
