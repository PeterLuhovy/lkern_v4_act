"""
================================================================
FILE: communication_service.py
PATH: /services/lkms101-contacts/app/services/communication_service.py
DESCRIPTION: Contact communication management (email, phone, website, social)
VERSION: v1.0.0
UPDATED: 2025-12-18
================================================================
"""

from datetime import datetime
from typing import Optional, List
from uuid import UUID
from sqlalchemy.orm import Session, joinedload
import logging

from app.models import (
    Contact, ContactEmail, ContactPhone, ContactWebsite, ContactSocialNetwork, Country
)
from app.schemas.communication import (
    EmailCreate, EmailUpdate,
    PhoneCreate, PhoneUpdate,
    WebsiteCreate, WebsiteUpdate,
    SocialNetworkCreate, SocialNetworkUpdate,
)

logger = logging.getLogger(__name__)


class CommunicationService:
    """Service for contact communication management."""

    def __init__(self, db: Session):
        self.db = db

    # ================================================================
    # EMAIL
    # ================================================================

    def add_email(self, contact_id: UUID, data: EmailCreate) -> ContactEmail:
        """Add email to contact."""
        if data.is_primary:
            self._unset_primary_email(contact_id)

        email = ContactEmail(
            contact_id=contact_id,
            email=data.email,
            email_type=data.email_type,
            is_primary=data.is_primary,
        )
        self.db.add(email)
        self.db.commit()
        self.db.refresh(email)

        logger.info(f"Added email {data.email} to contact {contact_id}")
        return email

    def update_email(self, email_id: UUID, data: EmailUpdate) -> Optional[ContactEmail]:
        """Update contact email."""
        email = self.db.query(ContactEmail).filter(ContactEmail.id == email_id).first()
        if not email:
            return None

        if data.is_primary and not email.is_primary:
            self._unset_primary_email(email.contact_id, exclude_id=email_id)

        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(email, field, value)

        self.db.commit()
        self.db.refresh(email)
        return email

    def delete_email(self, email_id: UUID) -> bool:
        """Soft delete email."""
        email = self.db.query(ContactEmail).filter(ContactEmail.id == email_id).first()
        if not email:
            return False

        email.deleted_at = datetime.utcnow()
        self.db.commit()
        return True

    def get_contact_emails(self, contact_id: UUID, include_deleted: bool = False) -> List[ContactEmail]:
        """Get all emails for contact."""
        query = self.db.query(ContactEmail).filter(ContactEmail.contact_id == contact_id)
        if not include_deleted:
            query = query.filter(ContactEmail.deleted_at.is_(None))
        return query.order_by(ContactEmail.is_primary.desc()).all()

    def _unset_primary_email(self, contact_id: UUID, exclude_id: Optional[UUID] = None):
        """Unset primary flag on other emails."""
        query = self.db.query(ContactEmail).filter(
            ContactEmail.contact_id == contact_id,
            ContactEmail.is_primary == True,
            ContactEmail.deleted_at.is_(None),
        )
        if exclude_id:
            query = query.filter(ContactEmail.id != exclude_id)
        for e in query.all():
            e.is_primary = False

    # ================================================================
    # PHONE
    # ================================================================

    def add_phone(self, contact_id: UUID, data: PhoneCreate) -> ContactPhone:
        """Add phone to contact."""
        if data.is_primary:
            self._unset_primary_phone(contact_id)

        phone = ContactPhone(
            contact_id=contact_id,
            phone_number=data.phone_number,
            country_id=data.country_id,
            phone_type=data.phone_type,
            is_primary=data.is_primary,
        )
        self.db.add(phone)
        self.db.commit()
        self.db.refresh(phone)

        logger.info(f"Added phone {data.phone_number} to contact {contact_id}")
        return phone

    def update_phone(self, phone_id: UUID, data: PhoneUpdate) -> Optional[ContactPhone]:
        """Update contact phone."""
        phone = self.db.query(ContactPhone).filter(ContactPhone.id == phone_id).first()
        if not phone:
            return None

        if data.is_primary and not phone.is_primary:
            self._unset_primary_phone(phone.contact_id, exclude_id=phone_id)

        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(phone, field, value)

        self.db.commit()
        self.db.refresh(phone)
        return phone

    def delete_phone(self, phone_id: UUID) -> bool:
        """Soft delete phone."""
        phone = self.db.query(ContactPhone).filter(ContactPhone.id == phone_id).first()
        if not phone:
            return False

        phone.deleted_at = datetime.utcnow()
        self.db.commit()
        return True

    def get_contact_phones(self, contact_id: UUID, include_deleted: bool = False) -> List[ContactPhone]:
        """Get all phones for contact."""
        query = self.db.query(ContactPhone).options(
            joinedload(ContactPhone.country)
        ).filter(ContactPhone.contact_id == contact_id)
        if not include_deleted:
            query = query.filter(ContactPhone.deleted_at.is_(None))
        return query.order_by(ContactPhone.is_primary.desc()).all()

    def _unset_primary_phone(self, contact_id: UUID, exclude_id: Optional[UUID] = None):
        """Unset primary flag on other phones."""
        query = self.db.query(ContactPhone).filter(
            ContactPhone.contact_id == contact_id,
            ContactPhone.is_primary == True,
            ContactPhone.deleted_at.is_(None),
        )
        if exclude_id:
            query = query.filter(ContactPhone.id != exclude_id)
        for p in query.all():
            p.is_primary = False

    # ================================================================
    # WEBSITE
    # ================================================================

    def add_website(self, contact_id: UUID, data: WebsiteCreate) -> ContactWebsite:
        """Add website to contact."""
        if data.is_primary:
            self._unset_primary_website(contact_id)

        website = ContactWebsite(
            contact_id=contact_id,
            website_url=data.website_url,
            website_type=data.website_type,
            is_primary=data.is_primary,
            valid_from=data.valid_from,
            valid_to=data.valid_to,
        )
        self.db.add(website)
        self.db.commit()
        self.db.refresh(website)

        logger.info(f"Added website {data.website_url} to contact {contact_id}")
        return website

    def update_website(self, website_id: UUID, data: WebsiteUpdate) -> Optional[ContactWebsite]:
        """Update contact website."""
        website = self.db.query(ContactWebsite).filter(ContactWebsite.id == website_id).first()
        if not website:
            return None

        if data.is_primary and not website.is_primary:
            self._unset_primary_website(website.contact_id, exclude_id=website_id)

        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(website, field, value)

        self.db.commit()
        self.db.refresh(website)
        return website

    def delete_website(self, website_id: UUID) -> bool:
        """Delete website."""
        website = self.db.query(ContactWebsite).filter(ContactWebsite.id == website_id).first()
        if not website:
            return False

        self.db.delete(website)
        self.db.commit()
        return True

    def get_contact_websites(self, contact_id: UUID) -> List[ContactWebsite]:
        """Get all websites for contact."""
        return self.db.query(ContactWebsite).filter(
            ContactWebsite.contact_id == contact_id,
            ContactWebsite.valid_to == None,
        ).order_by(ContactWebsite.is_primary.desc()).all()

    def _unset_primary_website(self, contact_id: UUID, exclude_id: Optional[UUID] = None):
        """Unset primary flag on other websites."""
        query = self.db.query(ContactWebsite).filter(
            ContactWebsite.contact_id == contact_id,
            ContactWebsite.is_primary == True,
            ContactWebsite.valid_to == None,
        )
        if exclude_id:
            query = query.filter(ContactWebsite.id != exclude_id)
        for w in query.all():
            w.is_primary = False

    # ================================================================
    # SOCIAL NETWORK
    # ================================================================

    def add_social_network(self, contact_id: UUID, data: SocialNetworkCreate) -> ContactSocialNetwork:
        """Add social network to contact."""
        if data.is_primary:
            self._unset_primary_social(contact_id)

        social = ContactSocialNetwork(
            contact_id=contact_id,
            platform=data.platform,
            profile_url=data.profile_url,
            is_primary=data.is_primary,
        )
        self.db.add(social)
        self.db.commit()
        self.db.refresh(social)

        logger.info(f"Added {data.platform} profile to contact {contact_id}")
        return social

    def update_social_network(self, social_id: UUID, data: SocialNetworkUpdate) -> Optional[ContactSocialNetwork]:
        """Update contact social network."""
        social = self.db.query(ContactSocialNetwork).filter(ContactSocialNetwork.id == social_id).first()
        if not social:
            return None

        if data.is_primary and not social.is_primary:
            self._unset_primary_social(social.contact_id, exclude_id=social_id)

        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(social, field, value)

        self.db.commit()
        self.db.refresh(social)
        return social

    def delete_social_network(self, social_id: UUID) -> bool:
        """Delete social network."""
        social = self.db.query(ContactSocialNetwork).filter(ContactSocialNetwork.id == social_id).first()
        if not social:
            return False

        self.db.delete(social)
        self.db.commit()
        return True

    def get_contact_social_networks(self, contact_id: UUID) -> List[ContactSocialNetwork]:
        """Get all social networks for contact."""
        return self.db.query(ContactSocialNetwork).filter(
            ContactSocialNetwork.contact_id == contact_id
        ).order_by(ContactSocialNetwork.is_primary.desc()).all()

    def _unset_primary_social(self, contact_id: UUID, exclude_id: Optional[UUID] = None):
        """Unset primary flag on other social networks."""
        query = self.db.query(ContactSocialNetwork).filter(
            ContactSocialNetwork.contact_id == contact_id,
            ContactSocialNetwork.is_primary == True,
        )
        if exclude_id:
            query = query.filter(ContactSocialNetwork.id != exclude_id)
        for s in query.all():
            s.is_primary = False
