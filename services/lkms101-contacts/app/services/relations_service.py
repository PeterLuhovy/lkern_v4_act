"""
================================================================
FILE: relations_service.py
PATH: /services/lkms101-contacts/app/services/relations_service.py
DESCRIPTION: Contact relations management (tags, languages, countries, business areas)
VERSION: v1.0.0
UPDATED: 2025-12-18
================================================================
"""

from typing import Optional, List
from uuid import UUID
from sqlalchemy.orm import Session, joinedload
import logging

from app.models import (
    Contact, Tag, Language, Country, BusinessFocusArea,
    ContactTag, ContactLanguage, ContactOperatingCountry, ContactBusinessFocusArea,
)
from app.schemas.relations import (
    ContactTagCreate,
    ContactLanguageCreate, ContactLanguageUpdate,
    ContactOperatingCountryCreate, ContactOperatingCountryUpdate,
    ContactBusinessFocusAreaCreate, ContactBusinessFocusAreaUpdate,
)

logger = logging.getLogger(__name__)


class RelationsService:
    """Service for contact relations management."""

    def __init__(self, db: Session):
        self.db = db

    # ================================================================
    # TAGS
    # ================================================================

    def add_tag(
        self,
        contact_id: UUID,
        data: ContactTagCreate,
        created_by_id: Optional[UUID] = None
    ) -> ContactTag:
        """Add tag to contact."""
        contact_tag = ContactTag(
            contact_id=contact_id,
            tag_id=data.tag_id,
            created_by_id=created_by_id,
        )
        self.db.add(contact_tag)
        self.db.commit()
        self.db.refresh(contact_tag)

        logger.info(f"Added tag {data.tag_id} to contact {contact_id}")
        return contact_tag

    def remove_tag(self, contact_id: UUID, tag_id: UUID) -> bool:
        """Remove tag from contact."""
        contact_tag = self.db.query(ContactTag).filter(
            ContactTag.contact_id == contact_id,
            ContactTag.tag_id == tag_id,
        ).first()

        if not contact_tag:
            return False

        self.db.delete(contact_tag)
        self.db.commit()

        logger.info(f"Removed tag {tag_id} from contact {contact_id}")
        return True

    def get_contact_tags(self, contact_id: UUID) -> List[ContactTag]:
        """Get all tags for contact."""
        return self.db.query(ContactTag).options(
            joinedload(ContactTag.tag)
        ).filter(ContactTag.contact_id == contact_id).all()

    # ================================================================
    # LANGUAGES
    # ================================================================

    def add_language(self, contact_id: UUID, data: ContactLanguageCreate) -> ContactLanguage:
        """Add language to contact."""
        if data.is_primary:
            self._unset_primary_language(contact_id)

        contact_language = ContactLanguage(
            contact_id=contact_id,
            language_id=data.language_id,
            is_primary=data.is_primary,
        )
        self.db.add(contact_language)
        self.db.commit()
        self.db.refresh(contact_language)

        logger.info(f"Added language {data.language_id} to contact {contact_id}")
        return contact_language

    def update_language(
        self,
        contact_id: UUID,
        language_id: UUID,
        data: ContactLanguageUpdate
    ) -> Optional[ContactLanguage]:
        """Update contact language."""
        contact_language = self.db.query(ContactLanguage).filter(
            ContactLanguage.contact_id == contact_id,
            ContactLanguage.language_id == language_id,
        ).first()

        if not contact_language:
            return None

        if data.is_primary and not contact_language.is_primary:
            self._unset_primary_language(contact_id)

        if data.is_primary is not None:
            contact_language.is_primary = data.is_primary

        self.db.commit()
        self.db.refresh(contact_language)
        return contact_language

    def remove_language(self, contact_id: UUID, language_id: UUID) -> bool:
        """Remove language from contact."""
        contact_language = self.db.query(ContactLanguage).filter(
            ContactLanguage.contact_id == contact_id,
            ContactLanguage.language_id == language_id,
        ).first()

        if not contact_language:
            return False

        self.db.delete(contact_language)
        self.db.commit()
        return True

    def get_contact_languages(self, contact_id: UUID) -> List[ContactLanguage]:
        """Get all languages for contact."""
        return self.db.query(ContactLanguage).options(
            joinedload(ContactLanguage.language)
        ).filter(
            ContactLanguage.contact_id == contact_id
        ).order_by(ContactLanguage.is_primary.desc()).all()

    def _unset_primary_language(self, contact_id: UUID):
        """Unset primary flag on other languages."""
        for lang in self.db.query(ContactLanguage).filter(
            ContactLanguage.contact_id == contact_id,
            ContactLanguage.is_primary == True,
        ).all():
            lang.is_primary = False

    # ================================================================
    # OPERATING COUNTRIES
    # ================================================================

    def add_operating_country(
        self,
        contact_id: UUID,
        data: ContactOperatingCountryCreate
    ) -> ContactOperatingCountry:
        """Add operating country to contact."""
        if data.is_primary:
            self._unset_primary_operating_country(contact_id)

        contact_country = ContactOperatingCountry(
            contact_id=contact_id,
            country_id=data.country_id,
            is_primary=data.is_primary,
        )
        self.db.add(contact_country)
        self.db.commit()
        self.db.refresh(contact_country)

        logger.info(f"Added operating country {data.country_id} to contact {contact_id}")
        return contact_country

    def update_operating_country(
        self,
        contact_id: UUID,
        country_id: UUID,
        data: ContactOperatingCountryUpdate
    ) -> Optional[ContactOperatingCountry]:
        """Update contact operating country."""
        contact_country = self.db.query(ContactOperatingCountry).filter(
            ContactOperatingCountry.contact_id == contact_id,
            ContactOperatingCountry.country_id == country_id,
        ).first()

        if not contact_country:
            return None

        if data.is_primary and not contact_country.is_primary:
            self._unset_primary_operating_country(contact_id)

        if data.is_primary is not None:
            contact_country.is_primary = data.is_primary

        self.db.commit()
        self.db.refresh(contact_country)
        return contact_country

    def remove_operating_country(self, contact_id: UUID, country_id: UUID) -> bool:
        """Remove operating country from contact."""
        contact_country = self.db.query(ContactOperatingCountry).filter(
            ContactOperatingCountry.contact_id == contact_id,
            ContactOperatingCountry.country_id == country_id,
        ).first()

        if not contact_country:
            return False

        self.db.delete(contact_country)
        self.db.commit()
        return True

    def get_contact_operating_countries(self, contact_id: UUID) -> List[ContactOperatingCountry]:
        """Get all operating countries for contact."""
        return self.db.query(ContactOperatingCountry).options(
            joinedload(ContactOperatingCountry.country)
        ).filter(
            ContactOperatingCountry.contact_id == contact_id
        ).order_by(ContactOperatingCountry.is_primary.desc()).all()

    def _unset_primary_operating_country(self, contact_id: UUID):
        """Unset primary flag on other operating countries."""
        for country in self.db.query(ContactOperatingCountry).filter(
            ContactOperatingCountry.contact_id == contact_id,
            ContactOperatingCountry.is_primary == True,
        ).all():
            country.is_primary = False

    # ================================================================
    # BUSINESS FOCUS AREAS
    # ================================================================

    def add_business_focus_area(
        self,
        contact_id: UUID,
        data: ContactBusinessFocusAreaCreate
    ) -> ContactBusinessFocusArea:
        """Add business focus area to contact."""
        if data.is_primary:
            self._unset_primary_business_focus(contact_id)

        contact_focus = ContactBusinessFocusArea(
            contact_id=contact_id,
            focus_area_id=data.focus_area_id,
            is_primary=data.is_primary,
        )
        self.db.add(contact_focus)
        self.db.commit()
        self.db.refresh(contact_focus)

        logger.info(f"Added business focus area {data.focus_area_id} to contact {contact_id}")
        return contact_focus

    def update_business_focus_area(
        self,
        contact_id: UUID,
        focus_area_id: UUID,
        data: ContactBusinessFocusAreaUpdate
    ) -> Optional[ContactBusinessFocusArea]:
        """Update contact business focus area."""
        contact_focus = self.db.query(ContactBusinessFocusArea).filter(
            ContactBusinessFocusArea.contact_id == contact_id,
            ContactBusinessFocusArea.focus_area_id == focus_area_id,
        ).first()

        if not contact_focus:
            return None

        if data.is_primary and not contact_focus.is_primary:
            self._unset_primary_business_focus(contact_id)

        if data.is_primary is not None:
            contact_focus.is_primary = data.is_primary

        self.db.commit()
        self.db.refresh(contact_focus)
        return contact_focus

    def remove_business_focus_area(self, contact_id: UUID, focus_area_id: UUID) -> bool:
        """Remove business focus area from contact."""
        contact_focus = self.db.query(ContactBusinessFocusArea).filter(
            ContactBusinessFocusArea.contact_id == contact_id,
            ContactBusinessFocusArea.focus_area_id == focus_area_id,
        ).first()

        if not contact_focus:
            return False

        self.db.delete(contact_focus)
        self.db.commit()
        return True

    def get_contact_business_focus_areas(self, contact_id: UUID) -> List[ContactBusinessFocusArea]:
        """Get all business focus areas for contact."""
        return self.db.query(ContactBusinessFocusArea).options(
            joinedload(ContactBusinessFocusArea.focus_area)
        ).filter(
            ContactBusinessFocusArea.contact_id == contact_id
        ).order_by(ContactBusinessFocusArea.is_primary.desc()).all()

    def _unset_primary_business_focus(self, contact_id: UUID):
        """Unset primary flag on other business focus areas."""
        for focus in self.db.query(ContactBusinessFocusArea).filter(
            ContactBusinessFocusArea.contact_id == contact_id,
            ContactBusinessFocusArea.is_primary == True,
        ).all():
            focus.is_primary = False
