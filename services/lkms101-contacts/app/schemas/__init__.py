"""
================================================================
FILE: __init__.py
PATH: /services/lkms101-contacts/app/schemas/__init__.py
DESCRIPTION: Schema exports for Contact MDM service
VERSION: v1.0.0
UPDATED: 2025-12-18
================================================================
"""

# Reference schemas
from app.schemas.reference import (
    RoleTypeBase, RoleTypeCreate, RoleTypeResponse,
    OrganizationalUnitTypeBase, OrganizationalUnitTypeCreate, OrganizationalUnitTypeResponse,
    CountryBase, CountryCreate, CountryResponse,
    LanguageBase, LanguageCreate, LanguageResponse,
    NationalityBase, NationalityCreate, NationalityResponse,
    LegalFormBase, LegalFormCreate, LegalFormResponse,
    BusinessFocusAreaBase, BusinessFocusAreaCreate, BusinessFocusAreaResponse,
    TagBase, TagCreate, TagResponse,
)

# Contact schemas
from app.schemas.contact import (
    PersonBase, PersonCreate, PersonUpdate, PersonResponse,
    CompanyBase, CompanyCreate, CompanyUpdate, CompanyResponse,
    OrganizationalUnitBase, OrganizationalUnitCreate, OrganizationalUnitUpdate, OrganizationalUnitResponse,
    ContactBase, ContactCreatePerson, ContactCreateCompany, ContactCreateOrganizationalUnit,
    ContactUpdate, ContactResponse, ContactListResponse,
    DeleteResponse, RestoreResponse,
)

# Role schemas
from app.schemas.role import (
    RoleBase, RoleCreate, RoleUpdate, RoleResponse, RoleListResponse,
)

# Address schemas
from app.schemas.address import (
    AddressBase, AddressCreate, AddressUpdate, AddressResponse,
    PersonAddressBase, PersonAddressCreate, PersonAddressCreateWithAddress, PersonAddressResponse,
    CompanyAddressBase, CompanyAddressCreate, CompanyAddressCreateWithAddress, CompanyAddressResponse,
    OrgUnitAddressBase, OrgUnitAddressCreate, OrgUnitAddressCreateWithAddress, OrgUnitAddressResponse,
)

# Communication schemas
from app.schemas.communication import (
    EmailBase, EmailCreate, EmailUpdate, EmailResponse,
    PhoneBase, PhoneCreate, PhoneUpdate, PhoneResponse,
    WebsiteBase, WebsiteCreate, WebsiteUpdate, WebsiteResponse,
    SocialNetworkBase, SocialNetworkCreate, SocialNetworkUpdate, SocialNetworkResponse,
)

# Relations schemas
from app.schemas.relations import (
    ContactTagBase, ContactTagCreate, ContactTagResponse,
    ContactLanguageBase, ContactLanguageCreate, ContactLanguageUpdate, ContactLanguageResponse,
    ContactOperatingCountryBase, ContactOperatingCountryCreate, ContactOperatingCountryUpdate, ContactOperatingCountryResponse,
    ContactBusinessFocusAreaBase, ContactBusinessFocusAreaCreate, ContactBusinessFocusAreaUpdate, ContactBusinessFocusAreaResponse,
)


__all__ = [
    # Reference
    "RoleTypeBase", "RoleTypeCreate", "RoleTypeResponse",
    "OrganizationalUnitTypeBase", "OrganizationalUnitTypeCreate", "OrganizationalUnitTypeResponse",
    "CountryBase", "CountryCreate", "CountryResponse",
    "LanguageBase", "LanguageCreate", "LanguageResponse",
    "NationalityBase", "NationalityCreate", "NationalityResponse",
    "LegalFormBase", "LegalFormCreate", "LegalFormResponse",
    "BusinessFocusAreaBase", "BusinessFocusAreaCreate", "BusinessFocusAreaResponse",
    "TagBase", "TagCreate", "TagResponse",
    # Contact
    "PersonBase", "PersonCreate", "PersonUpdate", "PersonResponse",
    "CompanyBase", "CompanyCreate", "CompanyUpdate", "CompanyResponse",
    "OrganizationalUnitBase", "OrganizationalUnitCreate", "OrganizationalUnitUpdate", "OrganizationalUnitResponse",
    "ContactBase", "ContactCreatePerson", "ContactCreateCompany", "ContactCreateOrganizationalUnit",
    "ContactUpdate", "ContactResponse", "ContactListResponse",
    "DeleteResponse", "RestoreResponse",
    # Role
    "RoleBase", "RoleCreate", "RoleUpdate", "RoleResponse", "RoleListResponse",
    # Address
    "AddressBase", "AddressCreate", "AddressUpdate", "AddressResponse",
    "PersonAddressBase", "PersonAddressCreate", "PersonAddressCreateWithAddress", "PersonAddressResponse",
    "CompanyAddressBase", "CompanyAddressCreate", "CompanyAddressCreateWithAddress", "CompanyAddressResponse",
    "OrgUnitAddressBase", "OrgUnitAddressCreate", "OrgUnitAddressCreateWithAddress", "OrgUnitAddressResponse",
    # Communication
    "EmailBase", "EmailCreate", "EmailUpdate", "EmailResponse",
    "PhoneBase", "PhoneCreate", "PhoneUpdate", "PhoneResponse",
    "WebsiteBase", "WebsiteCreate", "WebsiteUpdate", "WebsiteResponse",
    "SocialNetworkBase", "SocialNetworkCreate", "SocialNetworkUpdate", "SocialNetworkResponse",
    # Relations
    "ContactTagBase", "ContactTagCreate", "ContactTagResponse",
    "ContactLanguageBase", "ContactLanguageCreate", "ContactLanguageUpdate", "ContactLanguageResponse",
    "ContactOperatingCountryBase", "ContactOperatingCountryCreate", "ContactOperatingCountryUpdate", "ContactOperatingCountryResponse",
    "ContactBusinessFocusAreaBase", "ContactBusinessFocusAreaCreate", "ContactBusinessFocusAreaUpdate", "ContactBusinessFocusAreaResponse",
]
