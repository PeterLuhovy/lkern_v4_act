"""
================================================================
FILE: contacts_service.py
PATH: /services/lkms101-contacts/app/api/grpc/contacts_service.py
DESCRIPTION: gRPC service implementation for Contact Service (MDM)
VERSION: v1.0.0
UPDATED: 2025-12-18

Implements inter-service communication for contact data.
Requires compiled proto files from infrastructure/proto/contacts.proto
================================================================
"""

import logging
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from sqlalchemy.orm import Session
from google.protobuf.timestamp_pb2 import Timestamp
from google.protobuf.wrappers_pb2 import StringValue

from app.database import get_db
from app.services import ContactService, RoleService, CommunicationService
from app.models import Contact, ContactRole, ContactEmail, ContactPhone

# Import generated proto files (compiled from infrastructure/proto/contacts.proto)
from app.grpc import contacts_pb2, contacts_pb2_grpc

logger = logging.getLogger(__name__)


def datetime_to_timestamp(dt: Optional[datetime]) -> Optional[Timestamp]:
    """Convert datetime to protobuf Timestamp."""
    if dt is None:
        return None
    ts = Timestamp()
    ts.FromDatetime(dt)
    return ts


def string_to_wrapper(s: Optional[str]) -> Optional[StringValue]:
    """Convert string to protobuf StringValue wrapper."""
    if s is None:
        return None
    return StringValue(value=s)


class ContactGrpcService:
    """
    gRPC service implementation for Contact Service (MDM).

    Provides internal microservice-to-microservice communication.
    """

    def __init__(self, db: Session):
        self.db = db
        self.contact_service = ContactService(db)
        self.role_service = RoleService(db)
        self.comm_service = CommunicationService(db)

    # ================================================================
    # SINGLE CONTACT OPERATIONS
    # ================================================================

    async def GetContact(self, request, context):
        """
        Get Contact by ID.

        Args:
            request: GetContactRequest with id and include_deleted fields
            context: gRPC context

        Returns:
            ContactResponse with contact data and found flag
        """
        try:
            contact_id = UUID(request.id)
            contact = self.contact_service.get_by_id(
                contact_id,
                include_deleted=request.include_deleted
            )

            if not contact:
                return self._empty_contact_response()

            return self._build_contact_response(contact)

        except Exception as e:
            logger.error(f"gRPC GetContact error: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return self._empty_contact_response()

    async def GetContactByCode(self, request, context):
        """
        Get Contact by human-readable code (e.g., con-2512-0001).

        Args:
            request: GetContactByCodeRequest with contact_code field
            context: gRPC context

        Returns:
            ContactResponse with contact data and found flag
        """
        try:
            contact = self.contact_service.get_by_code(
                request.contact_code,
                include_deleted=request.include_deleted
            )

            if not contact:
                return self._empty_contact_response()

            return self._build_contact_response(contact)

        except Exception as e:
            logger.error(f"gRPC GetContactByCode error: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return self._empty_contact_response()

    # ================================================================
    # BULK OPERATIONS
    # ================================================================

    async def GetContactsBulk(self, request, context):
        """
        Get multiple Contacts by IDs (bulk operation for other microservices).

        Args:
            request: GetContactsBulkRequest with ids list
            context: gRPC context

        Returns:
            ContactsBulkResponse with contacts list and total count
        """
        try:
            contact_ids = [UUID(id) for id in request.ids]
            contacts = []

            for contact_id in contact_ids:
                contact = self.contact_service.get_by_id(
                    contact_id,
                    include_deleted=request.include_deleted
                )
                if contact:
                    contacts.append(self._build_contact_message(contact))

            return {
                "contacts": contacts,
                "total": len(contacts),
            }

        except Exception as e:
            logger.error(f"gRPC GetContactsBulk error: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return {"contacts": [], "total": 0}

    async def GetContactsByRole(self, request, context):
        """
        Get all Contacts with specific role (e.g., all suppliers, all customers).

        Args:
            request: GetContactsByRoleRequest with role_code, skip, limit
            context: gRPC context

        Returns:
            ContactsByRoleResponse with contacts list and total count
        """
        try:
            contacts_data, total = self.role_service.get_contacts_by_role(
                role_code=request.role_code,
                skip=request.skip or 0,
                limit=request.limit or 50,
            )

            contacts = [self._build_contact_message(c) for c in contacts_data]

            return {
                "contacts": contacts,
                "total": total,
                "role_code": request.role_code,
            }

        except Exception as e:
            logger.error(f"gRPC GetContactsByRole error: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return {"contacts": [], "total": 0, "role_code": request.role_code}

    # ================================================================
    # VALIDATION
    # ================================================================

    async def ValidateContact(self, request, context):
        """
        Validate contact data and check for duplicates.

        Args:
            request: ValidateContactRequest with contact fields
            context: gRPC context

        Returns:
            ValidateContactResponse with is_valid flag, errors, and duplicates
        """
        try:
            errors = []
            duplicates = []

            # Check email duplicates
            if request.email and request.email.value:
                existing = self.db.query(ContactEmail).filter(
                    ContactEmail.email == request.email.value,
                    ContactEmail.deleted_at.is_(None),
                ).first()

                if existing:
                    if not request.exclude_contact_id or str(existing.contact_id) != request.exclude_contact_id.value:
                        duplicates.append({
                            "contact_id": str(existing.contact_id),
                            "contact_code": existing.contact.contact_code if existing.contact else "",
                            "display_name": existing.contact.display_name if existing.contact else "",
                            "contact_type": existing.contact.contact_type if existing.contact else "",
                            "similarity_score": 1.0,
                            "match_reason": "same_email",
                        })

            # Check registration number duplicates (for companies)
            if request.registration_number and request.registration_number.value:
                from app.models import ContactCompany
                existing = self.db.query(ContactCompany).filter(
                    ContactCompany.registration_number == request.registration_number.value,
                ).first()

                if existing:
                    if not request.exclude_contact_id or str(existing.contact_id) != request.exclude_contact_id.value:
                        contact = self.contact_service.get_by_id(existing.contact_id)
                        if contact:
                            duplicates.append({
                                "contact_id": str(contact.id),
                                "contact_code": contact.contact_code,
                                "display_name": contact.display_name,
                                "contact_type": contact.contact_type,
                                "similarity_score": 1.0,
                                "match_reason": "same_registration_number",
                            })

            is_valid = len(errors) == 0 and len(duplicates) == 0

            return {
                "is_valid": is_valid,
                "errors": errors,
                "duplicates": duplicates,
            }

        except Exception as e:
            logger.error(f"gRPC ValidateContact error: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return {"is_valid": False, "errors": [{"field": "general", "message": str(e), "code": "internal_error"}], "duplicates": []}

    # ================================================================
    # QUICK LOOKUP (Lightweight)
    # ================================================================

    async def GetContactSummary(self, request, context):
        """
        Get lightweight contact summary (for display in other services).

        Args:
            request: GetContactSummaryRequest with id
            context: gRPC context

        Returns:
            ContactSummaryResponse with basic contact info
        """
        try:
            contact_id = UUID(request.id)
            contact = self.contact_service.get_by_id(contact_id)

            if not contact:
                return {
                    "id": request.id,
                    "found": False,
                }

            # Get primary email and phone
            emails = self.comm_service.get_contact_emails(contact_id)
            phones = self.comm_service.get_contact_phones(contact_id)
            roles = self.role_service.get_contact_roles(contact_id)

            primary_email = next((e.email for e in emails if e.is_primary), None) or (emails[0].email if emails else "")
            primary_phone = next((p.phone_number for p in phones if p.is_primary), None) or (phones[0].phone_number if phones else "")
            role_codes = [r.role_type.code for r in roles if r.role_type]

            return {
                "id": str(contact.id),
                "contact_code": contact.contact_code,
                "display_name": contact.display_name,
                "contact_type": contact.contact_type,
                "primary_email": primary_email,
                "primary_phone": primary_phone,
                "role_codes": role_codes,
                "is_active": contact.is_active,
                "found": True,
            }

        except Exception as e:
            logger.error(f"gRPC GetContactSummary error: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return {"id": request.id, "found": False}

    # ================================================================
    # HELPER METHODS
    # ================================================================

    def _empty_contact_response(self):
        """Return empty contact response."""
        return {"contact": None, "found": False}

    def _build_contact_response(self, contact: Contact):
        """Build ContactResponse from Contact model."""
        return {
            "contact": self._build_contact_message(contact),
            "found": True,
        }

    def _build_contact_message(self, contact: Contact):
        """Build Contact message from Contact model."""
        contact_msg = {
            "id": str(contact.id),
            "contact_code": contact.contact_code,
            "contact_type": contact.contact_type,
            "display_name": contact.display_name,
            "is_active": contact.is_active,
            "created_at": datetime_to_timestamp(contact.created_at),
            "updated_at": datetime_to_timestamp(contact.updated_at),
        }

        # Add type-specific data
        if contact.contact_type == "person" and contact.person:
            contact_msg["person"] = {
                "first_name": contact.person.first_name,
                "last_name": contact.person.last_name,
                "middle_name": string_to_wrapper(contact.person.middle_name),
                "title_before": string_to_wrapper(contact.person.title_before),
                "title_after": string_to_wrapper(contact.person.title_after),
                "gender": string_to_wrapper(contact.person.gender),
                "date_of_birth": datetime_to_timestamp(contact.person.date_of_birth),
                "nationality_id": string_to_wrapper(str(contact.person.nationality_id) if contact.person.nationality_id else None),
            }
        elif contact.contact_type == "company" and contact.company:
            contact_msg["company"] = {
                "company_name": contact.company.company_name,
                "trade_name": string_to_wrapper(contact.company.trade_name),
                "registration_number": string_to_wrapper(contact.company.registration_number),
                "tax_id": string_to_wrapper(contact.company.tax_id),
                "vat_id": string_to_wrapper(contact.company.vat_id),
                "vat_payer": contact.company.vat_payer or False,
                "legal_form_id": string_to_wrapper(str(contact.company.legal_form_id) if contact.company.legal_form_id else None),
                "company_status": string_to_wrapper(contact.company.company_status),
                "founded_date": datetime_to_timestamp(contact.company.founded_date),
            }
        elif contact.contact_type == "organizational_unit" and contact.organizational_unit:
            contact_msg["organizational_unit"] = {
                "unit_name": contact.organizational_unit.unit_name,
                "unit_type_id": string_to_wrapper(str(contact.organizational_unit.unit_type_id) if contact.organizational_unit.unit_type_id else None),
                "parent_contact_id": string_to_wrapper(str(contact.organizational_unit.parent_contact_id) if contact.organizational_unit.parent_contact_id else None),
                "cost_center": string_to_wrapper(contact.organizational_unit.cost_center),
            }

        # Add roles
        roles = self.role_service.get_contact_roles(contact.id)
        contact_msg["roles"] = [
            {
                "id": str(r.id),
                "role_type_code": r.role_type.code if r.role_type else "",
                "role_type_name": r.role_type.name_en if r.role_type else "",
                "related_contact_id": string_to_wrapper(str(r.related_contact_id) if r.related_contact_id else None),
                "related_contact_code": string_to_wrapper(r.related_contact.contact_code if r.related_contact else None),
                "valid_from": datetime_to_timestamp(r.valid_from),
                "valid_to": datetime_to_timestamp(r.valid_to),
                "is_active": r.is_active,
            }
            for r in roles
        ]

        # Add emails
        emails = self.comm_service.get_contact_emails(contact.id)
        contact_msg["emails"] = [
            {
                "id": str(e.id),
                "email": e.email,
                "email_type": e.email_type,
                "is_primary": e.is_primary,
            }
            for e in emails
        ]

        # Add phones
        phones = self.comm_service.get_contact_phones(contact.id)
        contact_msg["phones"] = [
            {
                "id": str(p.id),
                "phone_number": p.phone_number,
                "phone_type": p.phone_type,
                "is_primary": p.is_primary,
                "country_code": string_to_wrapper(p.country.iso_code if p.country else None),
            }
            for p in phones
        ]

        return contact_msg
