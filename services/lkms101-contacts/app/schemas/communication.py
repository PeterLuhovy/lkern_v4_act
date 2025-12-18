"""
================================================================
FILE: communication.py
PATH: /services/lkms101-contacts/app/schemas/communication.py
DESCRIPTION: Pydantic schemas for Email, Phone, Website, SocialNetwork
VERSION: v1.0.0
UPDATED: 2025-12-18
================================================================
"""

from pydantic import BaseModel, Field, EmailStr, computed_field
from datetime import datetime, date
from typing import Optional, Literal
from uuid import UUID


# ================================================================
# EMAIL SCHEMAS
# ================================================================

EmailType = Literal['work', 'billing', 'support', 'general']


class EmailBase(BaseModel):
    """Base schema for contact email."""
    email: EmailStr
    email_type: EmailType = 'work'
    is_primary: bool = False


class EmailCreate(EmailBase):
    """Schema for adding email to contact."""
    pass


class EmailUpdate(BaseModel):
    """Schema for updating contact email."""
    email: Optional[EmailStr] = None
    email_type: Optional[EmailType] = None
    is_primary: Optional[bool] = None


class EmailResponse(EmailBase):
    """Schema for contact email response."""
    id: UUID
    contact_id: UUID
    is_deleted: bool = False
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ================================================================
# PHONE SCHEMAS
# ================================================================

PhoneType = Literal['mobile', 'fax', 'fixed_line']


class PhoneBase(BaseModel):
    """Base schema for contact phone."""
    phone_number: str = Field(..., max_length=30)
    country_id: UUID
    phone_type: PhoneType = 'mobile'
    is_primary: bool = False


class PhoneCreate(PhoneBase):
    """Schema for adding phone to contact."""
    pass


class PhoneUpdate(BaseModel):
    """Schema for updating contact phone."""
    phone_number: Optional[str] = Field(None, max_length=30)
    country_id: Optional[UUID] = None
    phone_type: Optional[PhoneType] = None
    is_primary: Optional[bool] = None


class PhoneResponse(PhoneBase):
    """Schema for contact phone response."""
    id: UUID
    contact_id: UUID
    is_deleted: bool = False
    created_at: datetime
    updated_at: datetime
    country_name: Optional[str] = None
    country_phone_code: Optional[str] = None

    @computed_field
    @property
    def formatted_number(self) -> str:
        """Returns phone number with country code."""
        if self.country_phone_code:
            return f"{self.country_phone_code} {self.phone_number}"
        return self.phone_number

    class Config:
        from_attributes = True


# ================================================================
# WEBSITE SCHEMAS
# ================================================================

WebsiteType = Literal['main', 'shop', 'blog', 'support', 'portfolio']


class WebsiteBase(BaseModel):
    """Base schema for contact website."""
    website_url: str = Field(..., max_length=500)
    website_type: WebsiteType = 'main'
    is_primary: bool = False
    valid_from: Optional[date] = None
    valid_to: Optional[date] = None


class WebsiteCreate(WebsiteBase):
    """Schema for adding website to contact."""
    pass


class WebsiteUpdate(BaseModel):
    """Schema for updating contact website."""
    website_url: Optional[str] = Field(None, max_length=500)
    website_type: Optional[WebsiteType] = None
    is_primary: Optional[bool] = None
    valid_to: Optional[date] = None


class WebsiteResponse(WebsiteBase):
    """Schema for contact website response."""
    id: UUID
    contact_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ================================================================
# SOCIAL NETWORK SCHEMAS
# ================================================================

SocialPlatform = Literal['linkedin', 'facebook', 'twitter', 'instagram', 'youtube', 'github', 'xing', 'tiktok']


class SocialNetworkBase(BaseModel):
    """Base schema for contact social network."""
    platform: SocialPlatform
    profile_url: str = Field(..., max_length=500)
    is_primary: bool = False


class SocialNetworkCreate(SocialNetworkBase):
    """Schema for adding social network to contact."""
    pass


class SocialNetworkUpdate(BaseModel):
    """Schema for updating contact social network."""
    platform: Optional[SocialPlatform] = None
    profile_url: Optional[str] = Field(None, max_length=500)
    is_primary: Optional[bool] = None


class SocialNetworkResponse(SocialNetworkBase):
    """Schema for contact social network response."""
    id: UUID
    contact_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
