"""
================================================================
Contact Service (MDM) - REST API Routes
================================================================
File: services/lkms101-contacts/app/api/rest/__init__.py
Version: v1.0.0
Description:
  REST API route exports.
================================================================
"""

# Contact CRUD
from app.api.rest.contacts import router as contacts_router

# Role Management
from app.api.rest.roles import router as roles_router
from app.api.rest.roles import role_search_router

# Address Management
from app.api.rest.addresses import router as addresses_router
from app.api.rest.addresses import address_pool_router

# Communication (Email, Phone, Website, Social)
from app.api.rest.communication import email_router
from app.api.rest.communication import phone_router
from app.api.rest.communication import website_router
from app.api.rest.communication import social_router

# Relations (Tags, Languages, Countries, Business Focus)
from app.api.rest.relations import tags_router
from app.api.rest.relations import languages_router
from app.api.rest.relations import countries_router
from app.api.rest.relations import focus_router

# Reference Data (Read-only lookups)
from app.api.rest.reference import router as reference_router


__all__ = [
    # Contact CRUD
    "contacts_router",
    # Role Management
    "roles_router",
    "role_search_router",
    # Address Management
    "addresses_router",
    "address_pool_router",
    # Communication
    "email_router",
    "phone_router",
    "website_router",
    "social_router",
    # Relations
    "tags_router",
    "languages_router",
    "countries_router",
    "focus_router",
    # Reference Data
    "reference_router",
]
