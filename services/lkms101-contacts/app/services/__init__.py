"""
================================================================
FILE: __init__.py
PATH: /services/lkms101-contacts/app/services/__init__.py
DESCRIPTION: Service layer exports for Contact MDM service
VERSION: v2.0.0
UPDATED: 2025-12-18
================================================================
"""

from app.services.code_generator import generate_contact_code, parse_contact_code
from app.services.contact_service import ContactService
from app.services.role_service import RoleService
from app.services.address_service import AddressService
from app.services.communication_service import CommunicationService
from app.services.relations_service import RelationsService


__all__ = [
    # Code generator
    "generate_contact_code",
    "parse_contact_code",
    # Services
    "ContactService",
    "RoleService",
    "AddressService",
    "CommunicationService",
    "RelationsService",
]
