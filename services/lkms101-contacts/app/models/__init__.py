"""
================================================================
FILE: __init__.py
PATH: /services/lkms101-contacts/app/models/__init__.py
DESCRIPTION: Model exports for Contact MDM service
VERSION: v1.0.0
UPDATED: 2025-12-18
================================================================
"""

# Reference models
from app.models.reference import (
    RoleType,
    OrganizationalUnitType,
    Country,
    Language,
    Nationality,
    LegalForm,
    BusinessFocusArea,
    Tag,
)

# Core contact models
from app.models.contact import (
    Contact,
    ContactPerson,
    ContactCompany,
    ContactOrganizationalUnit,
)

# Role model
from app.models.role import ContactRole

# Address models
from app.models.address import (
    Address,
    PersonAddress,
    CompanyAddress,
    OrganizationalUnitAddress,
)

# Communication models
from app.models.communication import (
    ContactEmail,
    ContactPhone,
    ContactWebsite,
    ContactSocialNetwork,
)

# Classification models
from app.models.relations import (
    ContactTag,
    ContactLanguage,
    ContactOperatingCountry,
    ContactBusinessFocusArea,
)


__all__ = [
    # Reference
    "RoleType",
    "OrganizationalUnitType",
    "Country",
    "Language",
    "Nationality",
    "LegalForm",
    "BusinessFocusArea",
    "Tag",
    # Core
    "Contact",
    "ContactPerson",
    "ContactCompany",
    "ContactOrganizationalUnit",
    # Role
    "ContactRole",
    # Address
    "Address",
    "PersonAddress",
    "CompanyAddress",
    "OrganizationalUnitAddress",
    # Communication
    "ContactEmail",
    "ContactPhone",
    "ContactWebsite",
    "ContactSocialNetwork",
    # Classification
    "ContactTag",
    "ContactLanguage",
    "ContactOperatingCountry",
    "ContactBusinessFocusArea",
]
