"""
================================================================
Issues Service - Issue Schemas
================================================================
File: services/lkms105-issues/app/schemas/issue.py
Version: v1.0.0
Created: 2025-11-08
Description:
  Pydantic schemas for Issue validation and serialization.

  Role-based create schemas:
    - user_basic: Minimal fields (title, description, type, 1 screenshot)
    - user_standard: Basic fields (+ severity, optional attachments)
    - user_advance: Full fields (+ category, developer data, logs)
================================================================
"""

from pydantic import BaseModel, Field, UUID4, field_validator
from datetime import datetime
from typing import Optional, List, Dict, Any
from app.models.enums import (
    IssueType,
    IssueSeverity,
    IssueCategory,
    IssueStatus,
    IssuePriority,
)


# ============================================================
# CREATE SCHEMAS (Role-Based)
# ============================================================

class IssueCreateUserBasic(BaseModel):
    """
    Schema for creating Issue - user_basic role.

    Minimal fields:
    - title (required)
    - description (required)
    - type (required)
    - 1 screenshot (required in attachments)
    """
    title: str = Field(
        ...,
        min_length=5,
        max_length=200,
        description="Issue title/summary"
    )
    description: str = Field(
        ...,
        min_length=10,
        description="Issue description"
    )
    type: IssueType = Field(
        ...,
        description="Issue type: BUG, FEATURE, IMPROVEMENT, QUESTION"
    )
    attachments: Optional[List[Dict[str, Any]]] = Field(
        None,
        description="File metadata array (at least 1 screenshot required)"
    )

    @field_validator('attachments')
    @classmethod
    def validate_screenshot_required(cls, v):
        """At least 1 screenshot required for user_basic."""
        if not v or len(v) < 1:
            raise ValueError("user_basic role requires at least 1 screenshot")
        return v


class IssueCreateUserStandard(BaseModel):
    """
    Schema for creating Issue - user_standard role.

    Basic fields:
    - All user_basic fields
    - severity (required)
    - attachments (optional, up to 5 files)
    """
    title: str = Field(
        ...,
        min_length=5,
        max_length=200,
        description="Issue title/summary"
    )
    description: str = Field(
        ...,
        min_length=10,
        description="Issue description"
    )
    type: IssueType = Field(
        ...,
        description="Issue type: BUG, FEATURE, IMPROVEMENT, QUESTION"
    )
    severity: IssueSeverity = Field(
        ...,
        description="Severity: MINOR, MODERATE, MAJOR, BLOCKER"
    )
    attachments: Optional[List[Dict[str, Any]]] = Field(
        None,
        max_length=5,
        description="Optional file metadata array (max 5 files)"
    )


class IssueCreateUserAdvance(BaseModel):
    """
    Schema for creating Issue - user_advance role.

    Full fields:
    - All user_standard fields
    - category (optional)
    - Developer fields: error_message, error_type, browser, os, url
    """
    title: str = Field(
        ...,
        min_length=5,
        max_length=200,
        description="Issue title/summary"
    )
    description: str = Field(
        ...,
        min_length=10,
        description="Issue description"
    )
    type: IssueType = Field(
        ...,
        description="Issue type: BUG, FEATURE, IMPROVEMENT, QUESTION"
    )
    severity: IssueSeverity = Field(
        ...,
        description="Severity: MINOR, MODERATE, MAJOR, BLOCKER"
    )
    category: Optional[IssueCategory] = Field(
        None,
        description="Category: UI, BACKEND, DATABASE, INTEGRATION, DOCS, PERFORMANCE, SECURITY"
    )
    priority: Optional[IssuePriority] = Field(
        IssuePriority.MEDIUM,
        description="Priority: LOW, MEDIUM, HIGH, CRITICAL"
    )

    # Developer fields
    error_message: Optional[str] = Field(
        None,
        description="Error message from logs"
    )
    error_type: Optional[str] = Field(
        None,
        max_length=100,
        description="Error type/exception class"
    )
    browser: Optional[str] = Field(
        None,
        max_length=100,
        description="Browser name and version"
    )
    os: Optional[str] = Field(
        None,
        max_length=100,
        description="Operating system"
    )
    url: Optional[str] = Field(
        None,
        max_length=500,
        description="URL where issue occurred"
    )

    attachments: Optional[List[Dict[str, Any]]] = Field(
        None,
        max_length=5,
        description="Optional file metadata array (max 5 files)"
    )


# ============================================================
# UPDATE SCHEMA
# ============================================================

class IssueUpdate(BaseModel):
    """Schema for updating existing Issue."""

    title: Optional[str] = Field(
        None,
        min_length=5,
        max_length=200
    )
    description: Optional[str] = Field(
        None,
        min_length=10
    )
    type: Optional[IssueType] = None
    severity: Optional[IssueSeverity] = None
    category: Optional[IssueCategory] = None
    priority: Optional[IssuePriority] = None

    # Developer fields
    error_message: Optional[str] = None
    error_type: Optional[str] = None
    browser: Optional[str] = None
    os: Optional[str] = None
    url: Optional[str] = None


# ============================================================
# ACTION SCHEMAS
# ============================================================

class IssueAssign(BaseModel):
    """Schema for assigning Issue to developer."""

    assignee_id: UUID4 = Field(
        ...,
        description="UUID of assignee (from Contact service)"
    )


class IssueResolve(BaseModel):
    """Schema for resolving Issue."""

    resolution: str = Field(
        ...,
        min_length=10,
        description="Resolution description"
    )


class IssueClose(BaseModel):
    """Schema for closing Issue."""

    comment: Optional[str] = Field(
        None,
        description="Optional closure comment"
    )


# ============================================================
# RESPONSE SCHEMA
# ============================================================

class IssueResponse(BaseModel):
    """Schema for Issue response (includes all database fields)."""

    # IDs
    id: UUID4
    issue_code: str

    # Core fields
    title: str
    description: str
    type: IssueType
    severity: IssueSeverity
    category: Optional[IssueCategory] = None

    # Status & workflow
    status: IssueStatus
    priority: IssuePriority

    # People
    reporter_id: UUID4
    assignee_id: Optional[UUID4] = None

    # Resolution
    resolution: Optional[str] = None

    # Developer fields
    error_message: Optional[str] = None
    error_type: Optional[str] = None
    browser: Optional[str] = None
    os: Optional[str] = None
    url: Optional[str] = None

    # Attachments
    attachments: Optional[List[Dict[str, Any]]] = None

    # Timestamps
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None

    # Soft delete
    is_deleted: bool

    class Config:
        from_attributes = True  # Pydantic v2 (was orm_mode in v1)
